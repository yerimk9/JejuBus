import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import styles from "../styles/BusStopDetailPage.module.css";
import {
  useSetStationInfo,
  useStationInfo,
} from "../contexts/StationIdContext";
import { Link } from "react-router-dom";
import sad from "../assets/images/sad.svg";

function BusStopDetailPage(props) {
  const stationInfo = useStationInfo();
  const setStationInfo = useSetStationInfo();
  const [arrivalInfo, setArrivalInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stationInfoString = localStorage.getItem("stationInfo");
    if (stationInfoString) {
      const prevStationInfo = JSON.parse(stationInfoString);
      setStationInfo(prevStationInfo);
    }
  }, [setStationInfo]);

  const handleRouteInfo = (item) => {
    localStorage.setItem("routeInfo", JSON.stringify(item));
  };

  useEffect(() => {
    const fetchArrivalInfo = async () => {
      try {
        const encodedStationId = encodeURIComponent(stationInfo.stationId);
        const response = await fetch(
          `/arrivalInfo?stationId=${encodedStationId}`
        );
        const json = await response.json();
        setArrivalInfo(json);
        setIsLoading(false);
      } catch (error) {
        throw new Error(error);
      }
    };
    const timerId = setInterval(fetchArrivalInfo, 1000);
    return () => clearInterval(timerId);
  }, [stationInfo]);

  return (
    <div>
      <Nav choice={"정류장 도착정보"} />
      <div className={styles.container}>
        <div className={styles.CheckedBusStop}>
          <h2>
            {`${stationInfo.stationNm}${stationInfo.dirTp}(${stationInfo.stationId})`}
          </h2>
        </div>
        <div>
          {isLoading ? (
            <div className={"loading"}>
              <div className={"loader"}></div>
              <p>Loading...</p>
            </div>
          ) : arrivalInfo.length > 0 ? (
            arrivalInfo.map((item) => (
              <Link
                to={"/busRouteDetail"}
                key={item["ROUTE_ID"]}
                onClick={() => handleRouteInfo(item)}
              >
                <div className={styles.busDetailItem}>
                  <div className={styles.busInformation}>
                    <p className={styles.routeNumber}>
                      {`${item["ROUTE_NUM"]}(${item["ROUTE_SUB_NM"]})`}
                    </p>
                    <p
                      className={styles.dirTipText}
                    >{`${item["ROUTE_SUB_NM"]} 방면`}</p>
                  </div>
                  <div className={styles.timeArrivalContainer}>
                    <div className={styles.timeArrival}>
                      <p
                        className={styles.time}
                      >{`${item["PREDICT_TRAV_TM"]}분`}</p>
                      <p
                        className={styles.prevStaion}
                      >{`${item["REMAIN_STATION"]}번째 전`}</p>
                    </div>
                    <div>
                      <p className={styles.arrivalDirTip}>
                        {item["CURR_STATION_NM"]}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.noArrivalInfo}>
              <img src={sad} alt="sad" />
              <h1>도착정보없음</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusStopDetailPage;
