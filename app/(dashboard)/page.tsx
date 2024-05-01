"use client";

import CityInput from "@/components/CityInput";
import LocationsInput from "@/components/LocationsInput";
import EntryCard from "@/components/EntryCard";
import exp from "constants";
import React, { useState, useMemo } from "react";
import { useLocations } from "@/utils/locationContext";
import { useRouter } from "next/navigation";
import { useLoadScript } from "@react-google-maps/api";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const { locations, city, setCity, setLocations } = useLocations(); // Use context

  const router = useRouter();

  const libraries = useMemo(() => ["places"], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

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
  const handleGenerateClick = () => {
    // Navigate to the map page when Generate is clicked
    router.push("/main");
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-[#a4c3b2] md:text-5xl lg:text-6xl dark:text-white">
        TravelMaker
      </h1>
      {Object.keys(city).length === 0 ? <CityInput /> : <LocationsInput />}
      {entries.map((entry, index) => (
        <EntryCard key={index} entry={entry} />
      ))}
      <button
        className="bg-[#ccd5ae] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded mt-4"
        onClick={handleGenerateClick}
      >
        Generate
      </button>
      <div className="flex items-center justify-center flex-wrap mt-5">
        {city.name && (
          <button
            className="relative w-40 h-12 bg-[#fec5bb] text-white font-bold rounded flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-700 hover:bg-red-700 transition-all"
            onClick={deleteCity}
          >
            <span className="absolute left-4 transition-transform group-hover:translate-x-10">
              {city.name}
            </span>
            <span className="absolute right-4 flex items-center justify-center w-5 h-5 bg-red-700 transition-all group-hover:w-full">
              <svg
                className="w-3 h-3 text-white fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
              </svg>
            </span>
          </button>
        )}
        {locations.map((location, index) => (
          <button
            className="relative w-60 h-16 bg-[#fec5bb] text-white font-bold rounded flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-700 hover:bg-red-700 transition-all"
            onClick={deleteLocation.bind(null, index)}
            key={index}
          >
            <span className="absolute left-4 transition-transform group-hover:translate-x-10">
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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
