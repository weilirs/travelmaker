"use client";
import React, { useState } from "react";

const calculateArrivalTimes = (departureTime, stops) => {
  const baseTime = new Date();
  const [hours, minutes] = departureTime.split(":");
  baseTime.setHours(hours, minutes, 0); // Sets departure time, assuming today as the date

  return stops.map((stop, index) => {
    const durationSeconds = stops
      .slice(0, index + 1)
      .reduce((total, curr) => total + curr.duration.value, 0);
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
  const itinerary = departureTime
    ? calculateArrivalTimes(departureTime, stops)
    : [];

  const handleTimeChange = (event) => {
    setDepartureTime(event.target.value);
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
      {itinerary.map((stop, index) =>
        index == 0 ? (
          <div key={index}>
            <p>Departure: {stop.start_address}</p>
            <p>Arrival: {stop.end_address}</p>
            <p>Arrival Time: {stop.arrivalTime}</p>
          </div>
        ) : (
          <div key={index}>
            <p>Arrival: {stop.end_address}</p>
            <p>Arrival Time: {stop.arrivalTime}</p>
          </div>
        )
      )}
      <p>{sunSet && `Sunset: ${sunSet}`}</p>
    </div>
  );
};

export default Itinerary;
