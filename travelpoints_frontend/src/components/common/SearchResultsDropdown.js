import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/SearchResultsDropdown.css";
import '../../styles/AttractionCard.css';

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
                <li key={index}>
                  <Link
                    to={`/attractions/${result.id}`}
                    className="search-result-item"
                    onClick={() => onSelect(result)}
                  >
                    <FaMapMarkerAlt className="result-icon" />
                    <span className="result-name">{result.name}</span>
                  </Link>
                </li>
              ))}
        </ul>
        {/* See more button shown only if there is at least one result */}
        {results.length > 0 && (
          <div className="see-more-container">
            <Link to="/search-results" state={{ results }} className="see-more-button">
              See more
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsDropdown;
