import { useLocations } from "@/utils/locationContext";
import { useEffect, useState } from "react";

const LocationsInput = () => {
  const { city, locations, setLocations } = useLocations();
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const atc = document.getElementById("autocomplete-input");
    const center = city.locationBias; // Center of the bias area
    const radius = 1000; // Radius of the bias area in meters
    const circle = new google.maps.Circle({ center, radius });
    const autocomplete = new google.maps.places.Autocomplete(atc, {
      bounds: circle.getBounds(), // Set the location bias using the circle bounds
    });
    const placesService = new google.maps.places.PlacesService(atc);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      // Handle the selected place data (e.g., place.name, place.geometry.location)
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const { location } = place.geometry;
      placesService.getDetails(
        {
          placeId: place.place_id,
          fields: ["name", "formatted_phone_number", "geometry", "website"],
        },
        (placeDetails, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const detailedPlace = {
              name: placeDetails.name,
              lat: location.lat(),
              lng: location.lng(),
              phone: placeDetails.formatted_phone_number || "N/A", // Include phone number
              website: placeDetails.website || "N/A",
            };
            setInput(placeDetails.name);
            setSelected(detailedPlace);
          }
        }
      );
    });
  }, [city]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
  };

  const handleSaveClick = () => {
    if (input) {
      setLocations([...locations, selected]);
      setInput("");
      setSelected(null);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter a location"
        className="border border-gray-300 p-2"
        type="text"
        onChange={handleChange}
        value={input}
        id="autocomplete-input"
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSaveClick}
      >
        Save Location
      </button>
    </div>
  );
};

export default LocationsInput;
