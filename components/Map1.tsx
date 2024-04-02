"use client";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";
import { useLocations } from "@/utils/locationContext";

const Map1 = () => {
  const { locations } = useLocations();
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const markers = locations.map((location) => ({
    lat: location.lat,
    lng: location.lng,
  }));
  return (
    <GoogleMap
      options={mapOptions}
      mapContainerStyle={{ width: "800px", height: "800px" }}
      center={markers[0]}
      zoom={14}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      onLoad={() => console.log("Map Component Loaded...")}
    >
      {markers.map((marker, index) => (
        <MarkerF
          key={index}
          position={marker}
          onLoad={() => console.log("Marker Loaded")}
        />
      ))}
    </GoogleMap>
  );
};

export default Map1;
