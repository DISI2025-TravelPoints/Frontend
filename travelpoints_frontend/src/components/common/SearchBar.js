import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { searchAttractionsByText } from "../../requests/TouristRequests";
import { validCoordinates } from "../../utils/Regex";
import "../../styles/SearchBar.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);

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
    }
    else {
        setIsValid(true);
        return true;
    }
  };

  useEffect(() => {
    validateInput(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    
    if (searchTerm && validateInput(searchTerm)) {
      searchAttractionsByText(searchTerm);
    }
  };

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSearch}>
        <div className="search-field">
          <FaMapMarkerAlt className="location-icon" />
          <input
            type="text"
            placeholder="Name of attraction or lat,lng coordinates"
            className={`search-input ${!searchTerm || isValid ? "valid" : "invalid"}`}
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        <button 
          type="submit" 
          className="search-button"
        >
          Search Attractions
          <FaSearch className="search-icon" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;