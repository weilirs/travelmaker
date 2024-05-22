"use client";

import CityInput from "@/components/CityInput";
import LocationsInput from "@/components/LocationsInput";
import EntryCard from "@/components/EntryCard";
import exp from "constants";
import React, { useState, useMemo } from "react";
import { useInfo } from "@/utils/lnfoContext";
import { useRouter } from "next/navigation";
import { useLoadScript } from "@react-google-maps/api";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const {
    locations,
    city,
    setCity,
    setLocations,
    isMapsLoaded,
    mapsLoadError,
    date,
    setDate,
  } = useInfo(); // Use context

  const router = useRouter();

  function findCustomName(lat, lng) {
    let closestLocation = null;
    let shortestDistance = Infinity;

    locations.forEach((location) => {
      const distance = Math.sqrt(
        Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2)
      ); // Simple distance calculation
      if (distance < shortestDistance) {
        closestLocation = location;
        shortestDistance = distance;
      }
    });

    return closestLocation ? closestLocation.name : null;
  }
  const deleteCity = () => {
    setCity({}); // Assuming city is an object, reset it
  };

  const deleteLocation = (index) => {
    const newLocations = locations.filter((_, locIndex) => locIndex !== index);
    setLocations(newLocations);
  };

  if (!isMapsLoaded) {
    return <p>Loading...</p>; // Show loading message until the API is loaded
  }

  if (mapsLoadError) {
    return <p>Error loading maps: {mapsLoadError.message}</p>; // Display any errors
  }
  const handleGenerateClick = () => {
    // Navigate to the map page when Generate is clicked
    router.push("/main");
  };

  // TODO: fixate the elements on the page
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-[#a4c3b2] md:text-5xl lg:text-6xl dark:text-white">
        TravelMaker
      </h1>
      {Object.keys(city).length === 0 ? <CityInput /> : <LocationsInput />}
      {entries.map((entry, index) => (
        <EntryCard key={index} entry={entry} />
      ))}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-gray-300 p-2 mr-4 mt-4 rounded"
      />
      <button
        className="bg-[#ccd5ae] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded mt-4"
        onClick={handleGenerateClick}
      >
        Generate
      </button>
      <div className="flex flex-col items-center justify-center mt-5 w-full max-h-96 overflow-y-auto">
        {city.name && (
          <div className="w-full mb-4 flex justify-center">
            <button
              className="relative w-auto h-auto bg-[#fec5bb] text-white font-bold rounded flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-700 hover:bg-red-700 transition-all px-6 py-3"
              onClick={deleteCity}
            >
              <span className="transition-transform group-hover:translate-x-10">
                {city.name}
              </span>
              <span className="absolute right-0 top-0 flex items-center justify-center w-5 h-5 bg-red-700 transition-all group-hover:w-full">
                <svg
                  className="w-3 h-3 text-white fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                </svg>
              </span>
            </button>
          </div>
        )}
        <div className="w-full flex flex-wrap justify-center mb-4">
          {locations.map((location, index) => (
            <div className="m-2" key={index}>
              <button
                className="relative w-auto h-auto bg-[#fec5bb] text-white font-bold rounded flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-700 hover:bg-red-700 transition-all px-6 py-3"
                onClick={deleteLocation.bind(null, index)}
              >
                <span className="transition-transform group-hover:translate-x-10">
                  {findCustomName(location.lat, location.lng) || "N/A"}
                </span>
                <span className="absolute right-0 top-0 flex items-center justify-center w-5 h-5 bg-red-700 transition-all group-hover:w-full">
                  <svg
                    className="w-3 h-3 text-white fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                  </svg>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
