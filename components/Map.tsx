"use client";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { useMemo, useEffect, useRef, useState } from "react";
import { useLocations } from "@/utils/locationContext";
import { url } from "inspector";

const Map = ({ onStops, travelMode, onUrlChange }) => {
  const { locations } = useLocations();
  console.log(locations);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [polylines, setPolylines] = useState([]); // State to keep track of polylines
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [infoPosition, setInfoPosition] = useState(null);
  const hoverTimeoutRef = useRef(null);

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

  function createGoogleMapsUrl(origin, destination, waypoints) {
    let baseUrl = "https://www.google.com/maps/dir/?api=1";
    let originParam = `origin=${origin.lat},${origin.lng}`;
    let destinationParam = `destination=${destination.lat},${destination.lng}`;
    let waypointsParam = waypoints
      .map((wp) => `${wp.location.lat},${wp.location.lng}`)
      .join("|");
    return `${baseUrl}&${originParam}&${destinationParam}&waypoints=${waypointsParam}`;
  }

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const handleMouseOver = (location) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setSelectedPlace(location);
    setInfoPosition({ lat: location.lat + 0.03, lng: location.lng }); // TODO: when zoom in the map, the info window will be shown in the wrong place
    setInfoOpen(true);
  };

  const handleMouseOut = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setInfoOpen(false);
    }, 100); // Adjust delay as needed
  };

  // Remember to clear the timeout if the component unmounts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
    const url = createGoogleMapsUrl(origin, destination, waypoints);
    onUrlChange(url); // Update URL in Main component

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
      <GoogleMap
        options={mapOptions}
        mapContainerStyle={{ width: "100%", height: "850px" }} // TODO: set height to 100%
        center={locations[0]}
        zoom={10}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        onLoad={(map) => (mapRef.current = map)}
      >
        {locations.map((location, index) => {
          // Determine the icon based on whether the location is the origin or destination
          let iconUrl = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; // Default icon
          if (origin && location === origin) {
            iconUrl = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // Origin icon
          } else if (destination && location === destination) {
            iconUrl = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; // Destination icon
          }

          return (
            <MarkerF
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => handleMarkerClick(location)}
              onMouseOver={() => handleMouseOver(location)}
              onMouseOut={handleMouseOut}
              icon={{
                url: iconUrl,
              }}
            />
          );
        })}
        {infoOpen && (
          <InfoWindow
            position={infoPosition}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div>
              <h3>{selectedPlace.name}</h3>
              <p>{selectedPlace.description}</p>{" "}
              {/* Additional details can be added here */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
