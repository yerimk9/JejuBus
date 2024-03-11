import React, { useState } from "react";
import searchImg from "../assets/images/search.svg";
import styles from "../styles/SearchBar.module.css";

function SearchBar({ onSearch, children }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(e.target.value);
    onSearch(value);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div>
      <form className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          name="search"
          value={searchTerm}
          placeholder={children}
          onChange={handleInputChange}
        />
        {searchTerm ? (
          <button
            className={styles.clearBtn}
            type="button"
            onClick={handleClearClick}
          >
            X
          </button>
        ) : (
          <button className={styles.searchBtn} type="submit">
            <img src={searchImg} alt="검색" />
          </button>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
