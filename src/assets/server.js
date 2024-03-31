const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  cookieParser(process.env.COOKIE_SECRET, { sameSite: "None", secure: true })
);

app.listen(3001, () => {
  console.log("프록시 서버가 포트 3001에서 실행 중입니다.");
});

// 공지사항 정보 (17)
app.get("/notice", async function (req, res) {
  try {
    const response = await fetch(
      "http://busopen.jeju.go.kr/OpenAPI/service/bis/Notice"
    );
    const text = await response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 정류소 목록 정보 (10)
app.get("/station", async function (req, res) {
  try {
    const response = await fetch(
      "http://busopen.jeju.go.kr/OpenAPI/service/bis/Station"
    );
    const text = await response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 정류장 도착 예정 정보 [정류장 아이디]
app.get("/arrivalInfo", async function (req, res) {
  const { stationId } = req.query;
  try {
    const response = await fetch(
      `https://bus.jeju.go.kr/api/searchArrivalInfoList.do?station_id=${stationId}`
    );
    const text = await response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 노선 경유 정류장 조회 [노선아이디] = 버스가 어디어디 정류장 들르는지
app.get("/busRouteStation", async function (req, res) {
  const { routeId } = req.query;

  try {
    const response = await fetch(
      `http://bus.jeju.go.kr/api/searchBusRouteStationList.do?route_id=${routeId}`
    );
    const text = await response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 모든 노선목록 조회
app.get("/routeList", async function (req, res) {
  try {
    const response = await fetch(
      `http://bus.jeju.go.kr/api/searchBusRouteList.do`
    );
    const text = await response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 버스 위치정보 조회
app.get("/busLocation", async function (req, res) {
  try {
    const response = await fetch(
      `http://bus.jeju.go.kr/api/searchBusAllocList.do`
    );
    const text = await response.text();
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/map", async function (req, res) {
  // const { location } = req.query;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
    );
    const text = await response.json();
    res.send(text);
  } catch (e) {
    console.error(e);
  }
});
