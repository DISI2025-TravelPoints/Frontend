import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/SearchResultsDropdown.css";

const SearchResultsDropdown = ({ results, isLoading, onSelect, onClose }) => {
  if (isLoading) {
    return (
      <div className="search-overlay" onClick={onClose}>
        <div className="search-results-dropdown loading">
          <div className="loading-spinner"></div>
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-overlay" onClick={onClose}>
        <div className="search-results-dropdown">
          <div className="results-header">
            <h4>Search Results</h4>
            <span className="results-count">{results.length} found</span>
          </div>
          <div className="no-results">No results found</div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="search-overlay" onClick={onClose}></div>
      <div className="search-results-dropdown">
        <div className="results-header">
          <h4>Search Results</h4>
          <span className="results-count">{results.length} found</span>
        </div>
        <ul className="results-list">
          {results.map((result, index) => (
            <li key={index} onClick={() => onSelect(result)}>
              <FaMapMarkerAlt className="icon" />
              <div>
                <div>{result.name}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SearchResultsDropdown;
