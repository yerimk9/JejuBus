import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/LinkToPage.module.css";

function LinkToPage({ imgUrl, link, children }) {
  return (
    <div>
      <div className={styles.linkContainer}>
        <Link to={link}>
          <img src={imgUrl} alt={children} className={styles.linkImg} />
          <p>{children}</p>
        </Link>
      </div>
    </div>
  );
}

export default LinkToPage;
