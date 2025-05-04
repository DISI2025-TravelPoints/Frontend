import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import {
  searchAttractionsByCoords,
  searchAttractionsByText,
} from "../../requests/TouristRequests";
import { validCoordinates } from "../../utils/Regex";
import "../../styles/SearchBar.css";
import SearchResultsDropdown from "./SearchResultsDropdown";

const SearchBar = ({ setFoundAttractions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const validateInput = (input) => {
    input = input.trim();
    if (!input) {
      setIsValid(true);
      return true;
    }

    if (input.includes(",")) {
      const isValidFormat = validCoordinates.test(input);
      setIsValid(isValidFormat);
      return isValidFormat;
    } else {
      setIsValid(true);
      return true;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    validateInput(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(false);
    }
  };

  const handleSelectResult = (result) => {
    console.log("Selected result:", result);
    setShowResults(false);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (searchTerm && validateInput(searchTerm)) {
      if (searchTerm.includes(",")) {
        const [lat, long] = searchTerm.split(",").map((coord) => coord.trim());
        const res = await searchAttractionsByCoords(
          parseFloat(lat),
          parseFloat(long)
        );
        setResults(res);
      } else {
        const res = await searchAttractionsByText(searchTerm);
        setResults(res);
      }
      setShowResults(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <form className="search-box" onSubmit={handleSearch}>
        <div className="search-field">
          <FaMapMarkerAlt className="location-icon" />
          <input
            type="text"
            placeholder="Name of attraction or lat,lng coordinates"
            className={`search-input ${
              !searchTerm || isValid ? "valid" : "invalid"
            }`}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <button type="submit" className="search-button">
          Search Attractions
          <FaSearch className="search-icon" />
        </button>
      </form>

      {showResults && (
        <SearchResultsDropdown
          results={results}
          onSelect={handleSelectResult}
          isLoading={isLoading}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
