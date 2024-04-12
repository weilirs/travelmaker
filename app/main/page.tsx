"use client";
import React, { useState } from "react";
import Map from "@/components/Map";
import Weather from "@/components/weather";
import Itinerary from "@/components/itinerary";
import Modal from "@/components/modal";

const Main = () => {
  const [stops, setStops] = useState([]);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);

  const handleStops = (stop) => {
    setStops((currentStops) => [
      ...currentStops,
      { ...stop, stayDuration: 0 }, // Add stayTime initialized to 0 for each new stop
    ]);
  };
  const handleSunrise = (time) => {
    setSunrise(time);
  };
  const handleSunset = (time) => {
    setSunset(time);
  };
  const handleShowItinerary = () => {
    if (stops.length === 0) {
      alert("Please click on the map to select origin and destination.");
      return;
    }
    setShowItinerary(true);
  };

  const handleClose = () => {
    setShowItinerary(false);
  };
  return (
    <div>
      <h1>TravelMaker</h1>
      <Weather onSunrise={handleSunrise} onSunset={handleSunset} />
      <Map onStops={handleStops} />
      <button
        onClick={handleShowItinerary}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Itinerary
      </button>

      {stops.length > 0 && (
        <Modal show={showItinerary} onClose={handleClose}>
          <Itinerary
            stops={stops}
            sunRise={sunrise}
            sunSet={sunset}
            setStops={setStops}
          />
        </Modal>
      )}
    </div>
  );
};

export default Main;
