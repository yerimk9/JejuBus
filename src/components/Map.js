import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import fetch from "node-fetch";

/* global google */

function Map() {
  const [currentLocation, setCurrentLocation] = useState(null); // 현재 위치
  const [busStops, setBusStops] = useState([]); // 버스 정류장 정보
  const [isLoading, setIsLoading] = useState(true);

  const mapStyles = {
    height: "100vh",
    width: "100vw",
    minWidth: "400px",
  };

  const defaultCenter = {
    lat: currentLocation ? currentLocation.lat : 0,
    lng: currentLocation ? currentLocation.lng : 0,
  };

  const fetchBusStops = async () => {
    try {
      const response = await fetch(
        `/map?keyword=busStop&location=${currentLocation.lat}%2C${currentLocation.lng}&radius=2000&type=busStop`
      );
      const data = await response.json();
      console.log(data);
      const busStopsData = data["results"].map((busStop) => {
        const { lat, lng } = busStop.geometry.location;
        return {
          name: busStop.name,
          location: { lat, lng },
        };
      });
      setBusStops(busStopsData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      // 사용자의 브라우저가 Geolocation API를 지원하는지 확인한다.
      navigator.geolocation.getCurrentPosition(
        // getCurrentPosition 메서드를 사용하여 현재 위치를 가져온다.
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude, // 위도
            lng: position.coords.longitude, // 경도
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchBusStops();
    }
  }, [currentLocation]);

  return (
    <div>
      {isLoading ? (
        <div className={"loading"}>
          <div className={"loader"}></div>
          <p>Loading...</p>
        </div>
      ) : (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={defaultCenter}
            zoom={15}
          >
            {currentLocation && <Marker position={defaultCenter} />}
            {busStops.map((busStop, index) => (
              <Marker
                key={index}
                position={{
                  lat: busStop.location.lat,
                  lng: busStop.location.lng,
                }}
                label={{
                  text: "Bus",
                  color: "white",
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}

export default Map;
