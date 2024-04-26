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
  const { locations, city } = useLocations(); // Use context

  const router = useRouter();

  const libraries = useMemo(() => ["places"], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const handleGenerateClick = () => {
    // Navigate to the map page when Generate is clicked
    router.push("/main");
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1>TravelMaker</h1>
      {Object.keys(city).length === 0 ? <CityInput /> : <LocationsInput />}

      {entries.map((entry, index) => (
        <EntryCard key={index} entry={entry} />
      ))}
      <button
        className="bg-[#ccd5ae] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded ml-4"
        onClick={handleGenerateClick}
      >
        Generate
      </button>
    </div>
  );
};

export default Dashboard;
