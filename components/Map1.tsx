"use client";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useEffect, useRef, useState } from "react";
import { useLocations } from "@/utils/locationContext";

const Map1 = () => {
  // TODO: First show the markers, let user pick the origin and destination
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
  const mapRef = useRef();
  const directionsService = new google.maps.DirectionsService();
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const waypoints = locations.slice(1, -1).map((location) => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true,
    }));
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING, // Or any other mode
        optimizeWaypoints: true, // Optimize the route for the shortest distance
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [locations]);

  return (
    <GoogleMap
      options={mapOptions}
      mapContainerStyle={{ width: "800px", height: "800px" }}
      center={locations[0]}
      zoom={5}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      onLoad={(map) => (mapRef.current = map)}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default Map1;
