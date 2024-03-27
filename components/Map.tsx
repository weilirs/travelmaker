"use client";

import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Map = () => {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const position = { lat: 37.7749, lng: -122.4194 };

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 8,
        mapId: "TravelMaker",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    };
    initMap();
  }, []);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};
export default Map;
