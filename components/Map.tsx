"use client";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useEffect, useRef, useState } from "react";
import { useLocations } from "@/utils/locationContext";
import { InfoWindow } from "@react-google-maps/api";

const Map = ({ onStops }) => {
  const { locations } = useLocations();
  console.log(locations);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [polylines, setPolylines] = useState([]); // State to keep track of polylines
  const [travelMode, setTravelMode] = useState("DRIVING");

  function findCustomName(lat, lng) {
    let closestLocation = null;
    let shortestDistance = Infinity;

    locations.forEach((location) => {
      const distance = Math.sqrt(
        Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2)
      ); // Simple distance calculation
      if (distance < shortestDistance) {
        closestLocation = location;
        shortestDistance = distance;
      }
    });

    return closestLocation ? closestLocation.name : null;
  }

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const mapRef = useRef();
  const directionsService = new google.maps.DirectionsService();

  const handleMarkerClick = (location) => {
    if (!origin) {
      setOrigin(location);
    } else if (!destination && location !== origin) {
      setDestination(location);
    } else {
      setOrigin(location);
      setDestination(null);
    }
  };

  useEffect(() => {
    if (!origin || !destination) return;

    // Clear previous polylines from the map
    polylines.forEach((polyline) => polyline.setMap(null));
    setPolylines([]); // Reset the polylines state

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
        travelMode: google.maps.TravelMode[travelMode],
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const newPolylines = []; // Temporary array to store new polylines
          result.routes[0].legs.forEach((leg) => {
            const startName = findCustomName(
              leg.start_location.lat(),
              leg.start_location.lng()
            );
            const endName = findCustomName(
              leg.end_location.lat(),
              leg.end_location.lng()
            );
            leg.start_address = startName || leg.start_address;
            leg.end_address = endName || leg.end_address;
            console.log(leg);
            onStops(leg);
            var legPath = leg.steps.reduce(
              (acc, step) => acc.concat(step.path),
              []
            );
            var polyline = new google.maps.Polyline({
              path: legPath,
              strokeColor: "#FF0000",
              strokeOpacity: 0.5,
              strokeWeight: 4,
              map: mapRef.current,
            });

            polyline.addListener("mouseover", function (e) {
              polyline.setOptions({ strokeOpacity: 1.0 });
              var infoWindow = new google.maps.InfoWindow({
                content: "Duration: " + leg.duration.text,
                position: e.latLng,
              });
              infoWindow.open(mapRef.current);
              polyline.addListener("mouseout", function () {
                polyline.setOptions({ strokeOpacity: 0.5 });
                infoWindow.close();
              });
            });

            newPolylines.push(polyline); // Add the new polyline to the temporary array
          });

          setPolylines(newPolylines); // Update the state with the new polylines
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [locations, origin, destination, travelMode]);

  return (
    <div>
      <select
        value={travelMode}
        onChange={(e) => setTravelMode(e.target.value)}
      >
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Transit</option>
      </select>
      <GoogleMap
        options={mapOptions}
        mapContainerStyle={{ width: "800px", height: "800px" }}
        center={locations[0]}
        zoom={10}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        onLoad={(map) => (mapRef.current = map)}
      >
        {locations.map((location, index) => (
          <MarkerF
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
