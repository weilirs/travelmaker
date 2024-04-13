"use client";
import React, { useState, useEffect } from "react";

const calculateArrivalTimes = (departureTime, stops) => {
  const baseTime = new Date();
  const [hours, minutes] = departureTime.split(":");
  baseTime.setHours(hours, minutes, 0); // Sets departure time, assuming today as the date

  return stops.map((stop, index) => {
    // Calculate total duration up to this stop, including stay durations of previous stops
    const durationSeconds =
      stops
        .slice(0, index)
        .reduce(
          (total, curr) =>
            total + curr.duration.value + (curr.stayDuration || 0),
          0
        ) + stop.duration.value;
    const arrivalTime = new Date(baseTime.getTime() + durationSeconds * 1000); // Convert seconds to milliseconds
    return {
      ...stop,
      arrivalTime: arrivalTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
};

const Itinerary = ({ stops, sunRise, sunSet }) => {
  const [departureTime, setDepartureTime] = useState(null);
  const [adjustedStops, setAdjustedStops] = useState(stops);

  useEffect(() => {
    setAdjustedStops(stops); // Reset stops when the props change
  }, [stops]);

  const itinerary = departureTime
    ? calculateArrivalTimes(departureTime, adjustedStops)
    : [];

  const handleStayDurationChange = (index, value) => {
    const newStops = adjustedStops.map(
      (stop, i) =>
        i === index ? { ...stop, stayDuration: parseInt(value, 10) * 60 } : stop // Convert minutes to seconds
    );
    setAdjustedStops(newStops);
  };

  return (
    <div className="bg-white p-6 rounded-lg  mx-auto my-8 ">
      <p>{sunRise && `Sunrise: ${sunRise}`}</p>
      <div className="flex justify-between items-center my-4">
        {" "}
        {/* Flex container */}
        <p className="text-sm text-gray-700">{stops[0]?.start_address}</p>{" "}
        {/* Assuming the first stop is the departure location */}
        <div>
          <label
            htmlFor="appt-time"
            className="block text-sm font-medium text-gray-700"
          >
            departure time:
          </label>
          <input
            className="p-2.5 w-30 border-none rounded-md shadow-sm text-lg transition-all duration-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500  placeholder-blue-500"
            type="time"
            id="appt-time"
            name="appt-time"
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>
      </div>
      {itinerary.map((stop, index) => (
        <div key={index} className="my-4 bg-[#E2D6FF] rounded-lg">
          <p>{stop.arrivalTime}</p>
          <p>{stop.end_address}</p>

          {index < itinerary.length - 1 && (
            <>
              <label htmlFor={`stay-duration-${index}`}>Stay For(mins):</label>
              <input
                className="p-2.5 w-20 border-none rounded-md shadow-sm text-lg transition-all duration-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:w-30 placeholder-blue-500"
                type="number"
                id={`stay-duration-${index}`}
                value={(stop.stayDuration || 0) / 60} // Convert seconds to minutes for display
                onChange={(e) =>
                  handleStayDurationChange(index, e.target.value)
                }
                min="0"
              />
            </>
          )}
        </div>
      ))}
      <p>{sunSet && `Sunset: ${sunSet}`}</p>
    </div>
  );
};

export default Itinerary;
