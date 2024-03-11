import React, { useEffect, useState } from "react";
import userImg from "../assets/images/user.svg";
import styles from "../styles/ReviewList.module.css";
import { auth, firestore } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import ReviewForm from "./ReviewForm";

function ReviewListItem({ review }) {
  const [initialText, setInitialText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = auth.currentUser; // currentUser는 현재 로그인한 사용자의 정보를 나타내는 객체

  const handleEditClick = () => {
    if (currentUser && review.userId === currentUser.uid) {
      setInitialText(review);
      setIsEditing(true);
    } else {
      alert("해당 리뷰를 수정할 권한이 없습니다.");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (currentUser && review.userId === currentUser.uid) {
      const reviewRef = doc(firestore, "reviews", reviewId);
      try {
        await deleteDoc(reviewRef);
        alert("리뷰가 성공적으로 삭제되었습니다.");
      } catch (e) {
        console.error("리뷰 삭제 중 오류 : ", e);
        alert("리뷰 삭제 중 오류가 발생했습니다.");
      }
    } else {
      alert("해당 리뷰를 삭제할 권한이 없습니다.");
    }
  };

  return (
    <>
      {isEditing ? (
        <ReviewForm
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          initialText={initialText}
        />
      ) : (
        <div className={styles.container} key={review.idx}>
          <div className={styles.userContainer}>
            <img src={userImg} alt="userImg" />
            <div>{review.nickname}</div>
          </div>
          <div className={styles.reviewContainer}>
            <div>
              {review.text}
              <p>{review.date} </p>
            </div>
            <div className={styles.btnContainer}>
              <button
                type="button"
                className={styles.correctionBtn}
                onClick={handleEditClick}
              >
                수정
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleReviewDelete(review.id)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReviewList(props) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const data = firestore.collection("reviews");

    // onSnapshot : firestore쿼리나 문서에 대한 실시간 업데이트를 수신하는 데 사용되는 메서드
    // 이 메서드를 사용하면 서버에서 데이터베이스에 변경사항이 발생할 떄마다 클라이언트에 알림을 받아서 데이터를 자동으로 업데이트함
    const unsubscribe = data.onSnapshot((querySnapshot) => {
      const newReviews = [];

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const date = reviewData.timestamp
          ? new Date(
              reviewData.timestamp.seconds * 1000 +
                reviewData.timestamp.nanoseconds / 1000000
            )
          : new Date(); // 기본값으로 현재 시간 사용

        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
        const review = {
          id: doc.id,
          text: reviewData.text,
          nickname: reviewData.nickname,
          date: formattedDate,
          userId: reviewData.userId,
        };
        newReviews.push(review);
      });
      newReviews.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setReviews(newReviews);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {reviews.map((review) => (
        <ReviewListItem key={review.id} review={review} />
      ))}
    </div>
  );
}

export default ReviewList;
