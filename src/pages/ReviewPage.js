import React from "react";
import Nav from "../components/Nav";
import styles from "../styles/ReviewPage.module.css";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

function ReviewPage(props) {
  return (
    <div>
      <Nav choice={"리뷰 작성"} />
      <div className={styles.container}>
        <div>
          <ReviewForm />
        </div>
        <div>
          <ReviewList />
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
