import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const useGoogleMapsLoader = ({ libraries }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      libraries: libraries,
    });

    loader
      .load()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        setLoadError(error);
        console.error("Error loading Google Maps", error);
      });
  }, [apiKey, libraries]); // Depend on apiKey and libraries to prevent re-loads

  return { isLoaded, loadError };
};
