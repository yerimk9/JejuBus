import React, { useEffect, useState } from "react";
import userImg from "../assets/images/user.svg";
import styles from "../styles/ReviewForm.module.css";
import { auth, firestore } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// onAuthStateChanged 함수는 사용자의 로그인 상태가 변경될 때마다 등록된 콜백 함수를 호출
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

function ReviewForm({ isEditing, setIsEditing, initialText }) {
  const [reviewText, setReviewText] = useState("");
  const [userNickname, setUserNickname] = useState("");

  // onAuthStateChanged 함수를 사용하여 사용자의 로그인 상태가 변경될 때마다 실행되는 부분
  useEffect(() => {
    let unsubscribe;

    const getUserAndSubscribe = async () => {
      const user = await new Promise((resolve) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user);
        });
      });

      if (user) {
        const usersCollection = firestore.collection("users");
        const querySnapshot = await usersCollection
          .where("uid", "==", user.uid)
          .get();

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const user = firestore.collection("users");
          user
            .doc(userDoc.id)
            .get()
            .then((doc) => {
              const data = doc.data();
              setUserNickname(data.nickname);
            });
        } else {
          console.log("User document not found for UID:", user.uid);
          setUserNickname("이름없음");
        }
      } else {
        setUserNickname("");
      }
      setReviewText(initialText?.text || "");
    };

    getUserAndSubscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initialText]);

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleReviewSubmit = async () => {
    const auth = getAuth();

    // Promise를 반환하는 함수를 사용하여 비동기 작업 수행
    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        resolve(user);
        unsubscribe(); // 콜백 함수가 한 번 호출된 후 구독 해제
      });
    });

    try {
      if (user) {
        const reviewCollection = collection(firestore, "reviews");
        if (isEditing) {
          // 수정 모드일 때는 리뷰를 업데이트
          await updateDoc(doc(firestore, "reviews", initialText.id), {
            text: reviewText,
            timestamp: serverTimestamp(),
          });
          setIsEditing(false);
          alert("Review가 성공적으로 수정되었습니다.");
        } else {
          // 수정 모드가 아닐 때는 새로운 리뷰를 추가
          await addDoc(reviewCollection, {
            userId: user.uid,
            text: reviewText,
            nickname: userNickname,
            timestamp: serverTimestamp(),
          });
          alert("Review가 성공적으로 저장되었습니다.");
        }

        setReviewText("");
      } else {
        // 사용자가 로그인되어 있지 않을 때의 처리
        alert("로그인시에만 리뷰작성이 가능합니다ㅠㅠ");
        setReviewText("");
      }
    } catch (e) {
      console.log(e);
      alert("리뷰 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <img src={userImg} alt="userImg" />
          <div>{userNickname}</div>
        </div>
        <div className={styles.reviewContainer}>
          <textarea
            className={styles.reviewInput}
            value={reviewText}
            placeholder="버스 노선과 정류장에 대한 리뷰와 평가를 남겨주세요!!"
            onChange={handleTextChange}
          />
          <div className={styles.btnContainer}>
            <button
              className={styles.ReviewFormSubmitButton}
              type="submit"
              onClick={handleReviewSubmit}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewForm;
