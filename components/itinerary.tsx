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
    <div>
      <p>{sunRise && `Sunrise: ${sunRise}`}</p>
      <label htmlFor="appt-time">Choose a departure time:</label>
      <input
        type="time"
        id="appt-time"
        name="appt-time"
        onChange={(e) => setDepartureTime(e.target.value)}
      ></input>
      {itinerary.map((stop, index) => (
        <div key={index}>
          {index === 0 && <p>Departure: {stop.start_address}</p>}
          <p>Arrival: {stop.end_address}</p>
          <p>Arrival Time: {stop.arrivalTime}</p>
          {index < itinerary.length - 1 && ( // Only render stay duration input if it's not the last stop
            <>
              <label htmlFor={`stay-duration-${index}`}>
                Stay Duration (minutes):{" "}
              </label>
              <input
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
