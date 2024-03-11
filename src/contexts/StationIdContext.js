import React, { createContext, useContext, useState } from "react";

const StationInfoContext = createContext();

export const StationInfoProvider = ({ children }) => {
  const [stationInfo, setStationInfo] = useState({});

  return (
    <StationInfoContext.Provider value={{ stationInfo, setStationInfo }}>
      {children}
    </StationInfoContext.Provider>
  );
};

export const useStationInfo = () => {
  const context = useContext(StationInfoContext);
  if (!context) {
    throw new Error("반드시 StationInfoProvider 안에서 사용해야 합니다.");
  }
  return context.stationInfo;
};

export const useSetStationInfo = () => {
  const context = useContext(StationInfoContext);

  if (!context) {
    throw new Error("반드시 StationInfoProvider 안에서 사용해야 합니다.");
  }
  return context.setStationInfo;
};
