import React, { useState } from "react";
import Nav from "../components/Nav";
import styles from "../styles/BusSchedulePage.module.css";
import BusScheduleLink from "../components/BusScheduleLink";
import mock from "../data/mock.json";

function BusSchedulePage(props) {
  const [selectedBusType, setSelectedBusType] = useState("급행");
  const [selectedButtonType, setSelectedButtonType] = useState(null);

  const handleBusTypeClick = (busType) => {
    setSelectedBusType(busType);
    setSelectedButtonType(busType);
  };

  const renderBusSchduleItems = (type) => {
    const selectedBusData =
      type === "1st"
        ? mock["1st"][selectedBusType]
        : mock["2st"][selectedBusType];

    return selectedBusData
      ? selectedBusData.map((schedule) => (
          <BusScheduleLink key={schedule.id} scheduleId={schedule.id}>
            {schedule.number}
          </BusScheduleLink>
        ))
      : null;
  };

  return (
    <div>
      <Nav choice={"버스시간표"} />
      <div className={styles.busScheduleContainer}>
        <div className={styles.busScheduleTitle}>
          {Object.keys(mock["1st"]).map((busType) => (
            <button
              key={busType}
              className={`${styles.titleBtn} ${
                selectedButtonType === busType ? styles.selectedBtn : ""
              }`}
              type="button"
              onClick={() => handleBusTypeClick(busType)}
            >
              {busType}
            </button>
          ))}
        </div>
        <div className={styles.busScheduleItems}>
          {renderBusSchduleItems("1st")}
        </div>
        <div className={styles.busScheduleTitle}>
          {Object.keys(mock["2st"]).map((busType) => (
            <button
              key={busType}
              className={`${styles.titleBtn} ${
                selectedButtonType === busType ? styles.selectedBtn : ""
              }`}
              type="button"
              onClick={() => handleBusTypeClick(busType)}
            >
              {busType}
            </button>
          ))}
        </div>
        <div className={styles.busScheduleItems}>
          {renderBusSchduleItems("2st")}
        </div>
      </div>
    </div>
  );
}

export default BusSchedulePage;
