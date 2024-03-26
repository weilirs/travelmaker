"use client";

import Editor from "@/components/Editor";
import EntryCard from "@/components/EntryCard";
import exp from "constants";
import React, { useState } from "react";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleSaveClick = () => {
    setEntries([...entries, { text: input }]);
    setInput(""); // Clear the current input state
    setResetTrigger(!resetTrigger); // Toggle the reset trigger to clear the Editor
  };
  return (
    <div>
      <h1>TravelMaker</h1>
      <Editor
        resetTrigger={resetTrigger}
        onChange={setInput} // Pass setInput directly to handle changes
      />
      <button
        onClick={handleSaveClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
      {entries.map((entry, index) => (
        <EntryCard key={index} entry={entry} />
      ))}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate
      </button>
    </div>
  );
};

export default Dashboard;
