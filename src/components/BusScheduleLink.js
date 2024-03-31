import React from "react";
import styles from "../styles/BusScheduleLink.module.css";

function BusScheduleLink({ scheduleId, children }) {
  const downloadLink = `https://bus.jeju.go.kr/data/schedule/downScheduleExcel?gscheduleId=${scheduleId}`;

  return (
    <a className={styles.busScheduleItem} href={downloadLink} download>
      {children}
    </a>
  );
}

export default BusScheduleLink;
