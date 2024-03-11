import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import styles from "../styles/NoticePage.module.css";
import { getNotice, getNoticeTotalCount } from "../assets/apis/getNotice";
import Pagination from "../components/Pagination";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NoticePage(props) {
  const [noticeData, setNoticeData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // 기본값 1로 설정
  const location = useLocation();
  const navigate = useNavigate();

  const handlePageClick = async (pageNumber) => {
    try {
      navigate(`?page=${pageNumber}`); // 새로운 URL로 이동
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    } finally {
      // handlePageClick 함수에서 fetchData를 호출
      // 이때 currentPage가 변경되었으므로 useEffect에서 fetchData가 실행됨
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentPage === 1) {
          const total = await getNoticeTotalCount();
          setTotalCount(total);
        }
        const data = await getNotice((currentPage - 1) * 10, currentPage * 10);
        setNoticeData(data);
        // 페이지가 1일 때만 전체 공지사항 개수를 가져오도록 수정
      } catch (error) {
        console.error("데이터를 가져오는 중 에러 발생:", error);
      }
    }

    fetchData();
  }, [currentPage, location.search]);

  return (
    <div>
      <Nav choice={"공지사항"} />
      <div>
        <p className={styles.notice}>공 지 사 항</p>
      </div>
      {noticeData ? (
        <div className={styles.noticeItems}>
          {noticeData.map((item) => (
            <Link
              to={`/notice/${item.noticeId}`}
              state={{ item: item }}
              className={styles.noticeItem}
              key={item.noticeId}
            >
              <div className={styles.noticeItemTitle}>{item.noticeTitle}</div>
              <div className={styles.noticeItemDate}>{item.dateOnlyStr}</div>
            </Link>
          ))}
          <Pagination
            totalItems={totalCount}
            itemCountPerPage={10}
            pageCount={5}
            currentPage={currentPage}
            handlePageClick={handlePageClick}
          />
        </div>
      ) : (
        <div className={"loading"}>
          <div className={"loader"}></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default NoticePage;
