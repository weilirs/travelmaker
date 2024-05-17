"use client";
import React, { createContext, useContext, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const InfoContext = createContext();

export const useInfo = () => useContext(InfoContext);

export const InfoProvider = ({ children }) => {
  const [city, setCity] = useState({});
  const [locations, setLocations] = useState([]);
  const [date, setDate] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Specify libraries if needed
  });

  const contextValue = {
    locations,
    setLocations,
    city,
    setCity,
    isMapsLoaded: isLoaded,
    mapsLoadError: loadError,
    date,
    setDate,
  };

  return (
    <InfoContext.Provider value={contextValue}>{children}</InfoContext.Provider>
  );
};
