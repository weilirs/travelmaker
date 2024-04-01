"use client";
import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const useLocations = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState({});
  const [locations, setLocations] = useState([]); // Initialize locations as an empty array

  return (
    <LocationContext.Provider
      value={{ locations, setLocations, city, setCity }}
    >
      {children}
    </LocationContext.Provider>
  );
};
