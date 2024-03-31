import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import styles from "../styles/LoginPage.module.css";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
// signInWithEmailAndPassword 는 이메일과 비밀번호를 인자로 받아, 로그인을 시도하고 성공하면 사용자 정보를 반환
import { auth } from "../firebase";
import GoogleAuth from "../components/GoogleAuth";

function LoginPage() {
  const [message, setMessage] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    return setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      setMessage("로그인에 실패하였습니다.");
    }
    return;
  };

  return (
    <div>
      <Nav />
      <div className={`userContainer`}>
        <form onSubmit={handleLogin}>
          <div className={`inputContainer`}>
            <input
              name="email"
              type="text"
              placeholder="이메일을 입력해주세요"
              autoComplete="username"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={`inputContainer`}>
            <input
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {message && <div>{message}</div>}
          <div className={styles.btnContainer}>
            <button type="submit" className={`btn ${styles.btn}`}>
              로그인
            </button>
            <Link to="/signup" className={`btn ${styles.btn}`}>
              회원가입
            </Link>
          </div>
        </form>
        <div className={styles.socialLoginBox}>
          <GoogleAuth />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
