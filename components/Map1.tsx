"use client";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useEffect, useRef, useState } from "react";
import { useLocations } from "@/utils/locationContext";
import { InfoWindow } from "@react-google-maps/api";

const Map1 = () => {
  // TODO: allow user to select travel mode, when changing origin or destination, recalculate route
  const { locations } = useLocations();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );
  const handleMarkerClick = (location) => {
    if (!origin) {
      setOrigin(location);
    } else if (!destination && location !== origin) {
      setDestination(location);
      // Optionally, trigger the route calculation here if you want it to be automatic
      // once the destination is set, or wait for a user action like pressing a "Generate Route" button.
    } else {
      // Reset or handle additional clicks, depending on your app's needs.
      // For example, to allow re-selecting origin and destination, you might:
      setOrigin(location);
      setDestination(null); // Ready to select a new destination
    }
  };
  const markers = locations.map((location) => ({
    lat: location.lat,
    lng: location.lng,
  }));
  const mapRef = useRef();
  const directionsService = new google.maps.DirectionsService();
  const [directions, setDirections] = useState(null);
  const [legsInfo, setLegsInfo] = useState([]);

  useEffect(() => {
    if (!origin || !destination) return;
    const waypoints = locations
      .filter((loc) => loc !== origin && loc !== destination)
      .map((location) => ({
        location: { lat: location.lat, lng: location.lng },
        stopover: true,
      }));

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
          const totalTime = result.routes[0].legs.reduce(
            (total, leg) => total + leg.duration.value,
            0
          );
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [locations, origin, destination]);

  useEffect(() => {
    if (directions) {
      const legs = directions.routes[0].legs;
      const newLegsInfo = legs.map((leg, index) => ({
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        duration: leg.duration.text,
        distance: leg.distance.text,
        startLocation: {
          lat: leg.start_location.lat(),
          lng: leg.start_location.lng(),
        }, // Modified
        endLocation: {
          lat: leg.end_location.lat(),
          lng: leg.end_location.lng(),
        }, // Modified
        index,
      }));
      setLegsInfo(newLegsInfo);
      console.log(newLegsInfo);
    }
  }, [directions]);

  return (
    <GoogleMap
      options={mapOptions}
      mapContainerStyle={{ width: "800px", height: "800px" }}
      center={locations[0]}
      zoom={7}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      onLoad={(map) => (mapRef.current = map)}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true, // Prevent DirectionsRenderer from creating default markers
          }}
        />
      )}
      {locations.map((location, index) => (
        <MarkerF
          key={index}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => handleMarkerClick(location)}
          onLoad={() => console.log("Marker Loaded")}
        />
      ))}
      {legsInfo.map((legInfo, index) => (
        <InfoWindow
          key={index}
          position={{
            lat: legInfo.startLocation.lat,
            lng: legInfo.startLocation.lng,
          }}
          options={{ pixelOffset: new google.maps.Size(0, -30) }}
        >
          <div>
            <h4>
              Leg {index + 1}: {legInfo.startAddress} to {legInfo.endAddress}
            </h4>
            <p>Duration: {legInfo.duration}</p>
            <p>Distance: {legInfo.distance}</p>
          </div>
        </InfoWindow>
      ))}
    </GoogleMap>
  );
};

export default Map1;
