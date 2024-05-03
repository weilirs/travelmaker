"use client";
import React, { useState } from "react";
import Map from "@/components/Map";
import Weather from "@/components/weather";
import Itinerary from "@/components/itinerary";
import Modal from "@/components/modal";
import { useLocations } from "@/utils/locationContext";

const Main = () => {
  const [stops, setStops] = useState([]);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const [travelMode, setTravelMode] = useState("DRIVING"); // Moved state up to Main
  const [mapUrl, setMapUrl] = useState(""); // State for storing the URL
  const { isMapsLoaded, mapsLoadError, city } = useLocations();

  if (!isMapsLoaded) {
    return <p>Loading...</p>; // Show loading message until the API is loaded
  }

  if (mapsLoadError) {
    return <p>Error loading maps: {mapsLoadError.message}</p>; // Display any errors
  }

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

  const handleOpenMap = () => {
    if (!mapUrl) {
      alert("Click on the map to select origin and destination.");
    } else {
      window.open(mapUrl, "_blank");
    }
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
        <div className="mt-4">
          <p>Travel Mode</p>
          <select
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
          >
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
            <option value="BICYCLING">Bicycling</option>
            <option value="TRANSIT">Transit</option>
          </select>
        </div>
        <button
          onClick={handleOpenMap}
          className="bg-[#e9edc9] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded mt-4"
        >
          Open in Google Maps
        </button>
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
