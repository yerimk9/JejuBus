import React, { createContext, useContext, useState } from "react";

const InputContext = createContext();

export const InputProvider = ({ children }) => {
  const [clickedInput, setClickedInput] = useState("");

  return (
    <InputContext.Provider value={{ clickedInput, setClickedInput }}>
      {children}
    </InputContext.Provider>
  );
};

export const useInput = () => {
  const context = useContext(InputContext);

  if (!context) {
    throw new Error("반드시 InputProvider 안에서 사용해야 합니다.");
  }
  return context;
};
