import React from "react";
import ReactDOM from "react-dom/client";
import "../src/styles/index.css";
import App from "./App";
import { StationInfoProvider } from "./contexts/StationIdContext";
import { InputProvider } from "./contexts/InputContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StationInfoProvider>
    <InputProvider>
      <App />
    </InputProvider>
  </StationInfoProvider>
);
