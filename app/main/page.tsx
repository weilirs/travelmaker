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
  const [travelMode, setTravelMode] = useState("DRIVING"); // Moved state up to Main
  const [mapUrl, setMapUrl] = useState(""); // State for storing the URL

  const handleStops = (stop) => {
    setStops((currentStops) => [...currentStops, { ...stop, stayDuration: 0 }]);
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

  const handleMapUrlChange = (url) => {
    setMapUrl(url); // Update the URL when it changes in the Map component
  };

  return (
    <div className="grid grid-cols-[3fr_1fr] h-full">
      <div className="w-full h-full">
        <Map
          onStops={handleStops}
          onUrlChange={handleMapUrlChange}
          travelMode={travelMode}
        />
      </div>
      <div className="w-full flex flex-col items-center justify-start mt-5">
        <Weather onSunrise={handleSunrise} onSunset={handleSunset} />
        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="mt-4"
        >
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="BICYCLING">Bicycling</option>
          <option value="TRANSIT">Transit</option>
        </select>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#e9edc9] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded mt-4"
        >
          Open in Google Maps
        </a>
        <button
          onClick={handleShowItinerary}
          className="bg-[#e9edc9] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded mt-4 self-center"
        >
          Generate Itinerary
        </button>

        {stops.length > 0 && (
          <div>
            <Modal show={showItinerary} onClose={handleClose}>
              <Itinerary
                stops={stops}
                sunRise={sunrise}
                sunSet={sunset}
                setStops={setStops}
              />
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
