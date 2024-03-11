import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import LinkToPage from "../components/LinkToPage";
import styles from "../styles/MainPage.module.css";

import bus from "../assets/images/bus.svg";
import pathSearch from "../assets/images/pathSearch.svg";
import busStop from "../assets/images/busStop.svg";
import nearByStation from "../assets/images/nearByStation.svg";
import clock from "../assets/images/clock.svg";
import review from "../assets/images/review.svg";

import { getNotice } from "../assets/apis/getNotice";
import { Link } from "react-router-dom";

function MainPage(props) {
  const [noticeData, setNoticeData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNotice(0, 8);
        setNoticeData(data);
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }

    fetchData();
  }, []);
  return (
    <div>
      <div className={styles.mainNav}>
        <Nav />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.linksContainer}>
          <LinkToPage imgUrl={bus} link={"/routeSearch"}>
            노선 검색
          </LinkToPage>
          <LinkToPage imgUrl={pathSearch} link={"/pathSearch"}>
            경로 검색
          </LinkToPage>
          <LinkToPage imgUrl={busStop} link={"/busStop"}>
            정류소 검색
          </LinkToPage>
          <LinkToPage imgUrl={nearByStation} link={"/nearByStation"}>
            주변 정류소
          </LinkToPage>
          <LinkToPage imgUrl={clock} link={"/busSchedule"}>
            버스시간표
          </LinkToPage>
          <LinkToPage imgUrl={review} link={"/review"}>
            리뷰 작성
          </LinkToPage>
        </div>
        <div className={styles.noticeContainer}>
          <Link to={"/notice"}>
            <div className={styles.noticeTitle}>공지사항</div>
          </Link>
          {noticeData.map((item) => (
            <Link
              to={`/notice/${item.noticeId}`}
              state={{ item: item }}
              key={item.noticeId}
            >
              <div className={styles.noticeItem} key={item.noticeId}>
                <p className={styles.noticeItemTitle}>{item.noticeTitle}</p>
                <p className={styles.noticeItemDate}>{item.dateOnlyStr}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
