import React, { useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import styles from "../styles/GoogleAuth.module.css";

function GoogleAuth(props) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithRedirect(auth, provider);
      console.log(result);
      const user = result.user;

      const userRef = collection(firestore, "users");
      const querySnapshot = await getDocs(
        query(userRef, where("uid", "==", user.uid))
      );
      if (querySnapshot.empty) {
        await addDoc(userRef, {
          uid: user.uid,
          email: user.email,
          nickname: user.displayName,
        });
      }
      loginSuccess(user.email, user.uid);
    } catch (error) {
      console.error("Google 로그인 오류:", error.message);
    }
  };

  const handleRedirectLogin = async () => {
    try {
      const result = await getRedirectResult(auth);

      if (result) {
        const user = result.user;

        if (user) {
          const userRef = collection(firestore, "users");
          const querySnapshot = await getDocs(
            query(userRef, where("uid", "==", user.uid))
          );

          if (querySnapshot.empty) {
            await addDoc(userRef, {
              uid: user.uid,
              email: user.email,
              nickname: user.displayName,
            });
          }

          loginSuccess(user.email, user.uid);
        } else {
          // 사용자가 로그인을 완료하지 않은 경우
          console.log("사용자가 로그인을 완료하지 않았습니다.");
        }
      }
    } catch (error) {
      console.error("Google 로그인 오류:", error.message);
    }
  };

  useEffect(() => {
    handleRedirectLogin();
  }, []);

  const loginSuccess = async (email, uid) => {
    // 로그인 성공 시 원하는 동작 수행
    navigate("/");
    console.log(email, uid);
  };

  return (
    <div className={styles.googleLoginBox}>
      <button onClick={handleGoogleLogin}>Google 로그인</button>
    </div>
  );
}

export default GoogleAuth;
