"use client";
import { GoogleMap } from "@react-google-maps/api";
import { useMemo } from "react";

const Map1 = () => {
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );
  return (
    <GoogleMap
      options={mapOptions}
      mapContainerStyle={{ width: "800px", height: "800px" }}
      center={mapCenter}
      zoom={14}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      onLoad={() => console.log("Map Component Loaded...")}
    />
  );
};

export default Map1;
