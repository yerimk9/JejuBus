import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import styles from "../styles/PathSearchPage.module.css";
import arrow from "../assets/images/arrow.svg";
import { useInput } from "../contexts/InputContext";
import { useNavigate } from "react-router-dom";

function PathSearchPage(props) {
  const [departure, setDeparture] = useState(""); // 출발지
  const [destination, setDestination] = useState(""); // 도착지
  const { clickedInput, setClickedInput } = useInput();
  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate("/busStop");
    if (name === "departure") {
      setClickedInput("departure");
    } else if (name === "destination") {
      setClickedInput("destination");
    }
  };
  const handleFindPath = () => {
    window.open(
      `http://m.map.naver.com/route.nhn?menu=route&sname=${departure.stationNm}&sx=${departure.localX}&sy=${departure.localY}&ename=${destination.stationNm}&ex=${destination.localX}&ey=${destination.localY}&pathType=0&showMap=true`
    );
    localStorage.removeItem("selectedDeparture");
    localStorage.removeItem("selectedDestination");
  };
  useEffect(() => {
    const selectedDeparture = JSON.parse(
      localStorage.getItem("selectedDeparture")
    );
    const selectedDestination = JSON.parse(
      localStorage.getItem("selectedDestination")
    );
    if (selectedDeparture) {
      const { localX, localY, stationNm } = selectedDeparture;
      setDeparture({
        localX: localX["#text"],
        localY: localY["#text"],
        stationNm: stationNm["#text"],
      });
    }
    if (selectedDestination) {
      const { localX, localY, stationNm } = selectedDestination;
      setDestination({
        localX: localX["#text"],
        localY: localY["#text"],
        stationNm: stationNm["#text"],
      });
    }
  }, [clickedInput]);

  return (
    <div>
      <Nav choice={"경로검색"} />
      <div className={styles.inputContainer}>
        <div className={styles.input}>
          <input
            name="departure"
            type="text"
            placeholder="출발지"
            defaultValue={departure.stationNm}
            onClick={() => handleClick("departure")}
          />
        </div>
        <div>
          <img className={styles.arrow} src={arrow} alt="arrow" />
        </div>
        <div className={styles.input}>
          <input
            name="destination"
            type="text"
            placeholder="도착지"
            defaultValue={destination.stationNm}
            onClick={() => handleClick("destination")}
          />
        </div>
        <div>
          <img className={styles.arrow} src={arrow} alt="arrow" />
        </div>
        <div>
          <button
            className={`btn ${styles.searchBtn}`}
            type="button"
            onClick={handleFindPath}
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default PathSearchPage;
