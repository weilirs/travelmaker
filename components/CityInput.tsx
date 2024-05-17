import { useInfo } from "@/utils/lnfoContext";
import { useState, useEffect } from "react";

const CityInput = () => {
  const { city, setCity } = useInfo(); // Use context
  const [input, setInput] = useState("");
  const [location, setLocation] = useState(null);
  const autocomplete = () => {
    const atc = document.getElementById("autocomplete-input");
    const autocomplete = new google.maps.places.Autocomplete(atc, {});
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      // Handle the selected place data (e.g., place.name, place.geometry.location)
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const latitude = place.geometry.location.lat(); // Get latitude
      const longitude = place.geometry.location.lng(); // Get longitude
      setLocation({
        lat: latitude,
        lng: longitude,
      });
      setInput(place.name);
    });
  };
  useEffect(() => {
    autocomplete();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
  };

  const handleSaveClick = () => {
    if (input && location) {
      // Ensure 'location' is also defined
      setCity({
        name: input,
        locationBias: {
          lat: location.lat, // Use the lat property from location state
          lng: location.lng, // Use the lng property from location state
        },
      });
      console.log(city.locationBias);
      setInput("");
    }
  };
  return (
    <div>
      <div className="flex items-center space-x-4">
        <input
          placeholder="Enter a city"
          className="border border-gray-300 p-2 rounded "
          type="text"
          onChange={handleChange}
          value={input}
          id="autocomplete-input"
        />
        <button
          className="bg-[#e9edc9] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded whitespace-nowrap"
          onClick={handleSaveClick}
        >
          Save City
        </button>
      </div>
    </div>
  );
};

export default CityInput;
