import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import styles from "../styles/NoticeDetailPage.module.css";

function NoticeDetailPage(props) {
  const location = useLocation();
  const noticeItem = location.state.item;

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/notice");
  };
  return (
    <div>
      <Nav choice={"공지사항"} />
      <div className={styles.notice}>
        <p>공 지 사 항</p>
      </div>
      <div className={styles.noticeContainer}>
        <div className={styles.title}>
          <p className={styles.green}>제목</p>
          <p>{noticeItem.noticeTitle}</p>
        </div>
        <div className={styles.textContainer}>
          <p>{noticeItem.noticeText}</p>
        </div>
        <div className={styles.date}>
          <p className={styles.green}>등록일</p>
          <p>{noticeItem.dateOnlyStr}</p>
        </div>
      </div>
      <div className={styles.backBtn}>
        <button className="btn" onClick={handleBack}>
          목 록
        </button>
      </div>
    </div>
  );
}

export default NoticeDetailPage;
