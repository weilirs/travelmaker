import { useLocations } from "@/utils/locationContext";
import { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const CityInput = () => {
  const { city, setCity } = useLocations(); // Use context
  const [input, setInput] = useState("");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleSelect =
    ({ description }) =>
    () => {
      // When the user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setInput(description);

      setValue(description, false);
      clearSuggestions();
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    setValue(newValue);
  };

  const handleSaveClick = () => {
    getGeocode({ address: input }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      const bounds = results[0].geometry.bounds;
      setCity({
        name: input,
        locationBias: { lat, lng },
      });
    });
  };
  return (
    <div>
      <input
        placeholder="Enter a city"
        className="border border-gray-300 p-2 mr-4"
        type="text"
        onChange={handleChange}
        value={input}
      />
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
      <button
        className="bg-[#e9edc9] hover:bg-[#fefae0] text-gray font-bold py-2 px-4 rounded"
        onClick={handleSaveClick}
      >
        Save City
      </button>
    </div>
  );
};

export default CityInput;
