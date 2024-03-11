import React from "react";
import styles from "../styles/NearbyStationPage.module.css";
import Map from "../components/Map";
import Nav from "../components/Nav";

function NearbyStationPage(props) {
  return (
    <div>
      <Nav choice={"주변정류소"} />
      <div className={styles.mapTitle}>
        현재 위치의 2000m(또는 2km)내의 버스정류장이 표시됩니다.
      </div>
      <Map choice="map" />
    </div>
  );
}

export default NearbyStationPage;
