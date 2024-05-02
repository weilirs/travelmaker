"use client";
import React, { createContext, useContext, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const LocationContext = createContext();

export const useLocations = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState({});
  const [locations, setLocations] = useState([]);

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
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};
