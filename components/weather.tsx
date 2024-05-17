"use client";
import { useState, useEffect } from "react";
import { useInfo } from "@/utils/lnfoContext";
import Image from "next/image";

export default function Weather({ onSunrise, onSunset }) {
  const { city, date } = useInfo();
  const [forecast, setForecast] = useState(null);
  const { lat, lng } = city.locationBias;

  const fetchForecast = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
      alert("Failed to retrieve forecast.");
    }
  };

  function getImageSrc(conditionText) {
    if (conditionText.toLowerCase().includes("rain")) {
      return "../static/weather_icons/animated/rainy-5.svg"; // Path to rainy weather icon
    } else if (conditionText.toLowerCase().includes("cloud")) {
      return "../static/weather_icons/animated/cloudy-day-1.svg"; // Path to cloudy weather icon
    } else if (conditionText.toLowerCase().includes("snow")) {
      return "../static/weather_icons/animated/snowy-1.svg"; // Path to sunny weather icon
    } else {
      return "../static/weather_icons/animated/day.svg"; // Default weather icon
    }
  }

  useEffect(() => {
    if (date) {
      fetchForecast();
    }
  }, [date]);
  return (
    <div>
      {forecast && (
        <div>
          {/* <div>
            <p>Max Temperature: {forecast.day.maxtemp_c}°C</p>
            <p>Min Temperature: {forecast.day.mintemp_c}°C</p>
            <p>Condition: {forecast.day.condition.text}</p>
            <p>Sunrise: {forecast.astro.sunrise}</p>
            <p>Sunset: {forecast.astro.sunset}</p>
          </div> */}
          <div className="relative flex justify-center items-center mt-4">
            <div className=" relative w-220 h-250 flex flex-col items-center justify-between py-5 px-2.5 bg-custom-gray rounded-md bg-opacity-80">
              <p className="font-bold text-sm tracking-wide text-white">
                {city.name}
              </p>
              <p className="font-medium text-custom-size tracking-custom-spacing">
                {forecast.day.condition.text}
              </p>
              <Image
                src={getImageSrc(forecast.day.condition.text)}
                alt="weather icon"
                width={100}
                height={100}
              ></Image>
              <div className="w-full flex items-center justify-between">
                <div className="w-1/2 flex flex-col items-end justify-center px-5 py-0 gap-1 ">
                  <p className="text-sm font-semibold">Min</p>
                  <p className="text-xs font-medium">
                    {forecast.day.mintemp_c}°C
                  </p>
                </div>
                <div className="w-1/2 flex flex-col items-start justify-centter px-5 py-0 gap-1 border-l-2 border-white">
                  <p className="text-sm font-semibold">Max</p>
                  <p className="text-xs font-medium">
                    {forecast.day.maxtemp_c}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
