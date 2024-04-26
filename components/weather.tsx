"use client";
import { useState } from "react";
import { useLocations } from "@/utils/locationContext";

export default function Weather({ onSunrise, onSunset }) {
  const [date, setDate] = useState("");
  const { city } = useLocations();
  const [forecast, setForecast] = useState(null);
  const { lat, lng } = city.locationBias;

  const fetchForecast = async (e) => {
    e.preventDefault();

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&dt=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.forecast && data.forecast.forecastday.length > 0) {
        setForecast(data.forecast.forecastday[0]);
        onSunrise(data.forecast.forecastday[0].astro.sunrise);

        onSunset(data.forecast.forecastday[0].astro.sunset);
      } else {
        setForecast(null);
        alert("Forecast not available for the selected date.");
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
      alert("Failed to retrieve forecast.");
    }
  };

  return (
    <div>
      <h2>Enter Date for Weather Forecast</h2>
      <form onSubmit={fetchForecast}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[#e9edc9] text-gray font-bold py-2 px-4 rounded"
        >
          Get Forecast
        </button>
      </form>
      {forecast && (
        <div>
          <h3>Forecast for {forecast.date}</h3>
          <p>Max Temperature: {forecast.day.maxtemp_c}°C</p>
          <p>Min Temperature: {forecast.day.mintemp_c}°C</p>
          <p>Condition: {forecast.day.condition.text}</p>
          <p>Sunrise: {forecast.astro.sunrise}</p>
          <p>Sunset: {forecast.astro.sunset}</p>
        </div>
      )}
    </div>
  );
}
