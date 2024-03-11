import React, { useEffect, useState } from "react";
import styles from "../styles/Nav.module.css";
import logoImg from "../assets/images/IMG_9707.png";
import login from "../assets/images/login.svg";
import logout from "../assets/images/logout.svg";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../firebase";

function Nav({ choice }) {
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggingIn(!!user);

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
      }
    });

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 화면 크기 조정에 따른 resize 이벤트 감지
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isMainPage = location.pathname === "/";

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("로그아웃 되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("로그아웃 오류:", error.message);
      });
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (isLoginPage || isSignupPage) {
    return (
      <div className={`${styles.logoContainer}`}>
        <div className={styles.logoContainer}>
          <Link to={"/"}>
            <h1 className={styles.logoText}>버스오맨</h1>
          </Link>
          <img src={logoImg} alt="orange" className={styles.logoImg} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isMainPage ? (
        isMainPage && windowWidth <= 1000 ? (
          <button
            type="button"
            className={styles.choice}
            onClick={() => (window.location.href = "/notice")}
          >
            공지사항
          </button>
        ) : (
          <div></div>
        )
      ) : (
        <button type="button" className={styles.choice} onClick={handleReload}>
          {choice}
        </button>
      )}
      <div className={styles.logoContainer}>
        <Link to={"/"}>
          <h1 className={styles.logoText}>버스오맨</h1>
        </Link>
        <img src={logoImg} alt="orange" className={styles.logoImg} />
      </div>
      <div className={styles.userContainer}>
        {isLoggingIn ? (
          <>
            <button className={styles.userLogin}>
              <img src={login} alt="login" />
              {userNickname}
            </button>
            <button className={styles.userLogout} onClick={handleLogout}>
              <img src={logout} alt="logout" />
            </button>
          </>
        ) : (
          <>
            <Link to={"/login"} className="btn">
              로그인
            </Link>
            <Link to={"/signup"} className="btn">
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
