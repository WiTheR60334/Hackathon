"use client";
require("dotenv").config();
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Searchdock.module.css";
import { FaSearch } from "react-icons/fa";

async function getStockData(item) {
  const response = await axios.get("http://localhost:8000/quote", {
    params: { ticker: item },
  });
  return response.data;
}

function Searchdock({ onTickerSelect }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isModalBlurred, setIsModalBlurred] = useState(false);
  const [stockData, setStockData] = useState({});

  const handleSearchBarClick = () => {
    setIsModalBlurred(true);
  };

  const handleSelect = (ticker, companyName) => {
    onTickerSelect({ ticker, companyName });
    setShowSuggestions(false);
    setInput("");
  };

  const processSuggestions = (matches) => {
    let res = [];
    for (let match of matches) {
      res.push([match["symbol"], match["name"]]);
    }
    return res;
  };

  useEffect(() => {
    if (input !== "") {
      setUserHasTyped(true);
    } else {
      setUserHasTyped(false);
      setShowSuggestions(false);
    }
    if (userHasTyped && input !== "") {
      const timeout = setTimeout(() => {
        axios
          .get(
            `https://financialmodelingprep.com/api/v3/search-ticker?query=${input}&limit=10&apikey=Qv6H6CnRUoHgZtmcODKFqe81UtCDd3KF`
          )
          .then((response) => {
            setSuggestions(processSuggestions(response.data));
            setShowSuggestions(true);
          });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [input, userHasTyped]);

  return (
    <div
      // className={
      //   isModalBlurred ? `${styles.modal}` : styles.modal
      // }
    >
      <div className={styles.searchDock}>
        <div className={styles.searchTitle}>Dashboard</div>
        <div className={styles.searchBar}>
          <div className={styles.wrapper}>
            <FaSearch id={styles.search_icon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // onClick={handleSearchBarClick}
            />
          </div>
        </div>
      </div>
      <div className={styles.searchResults}>
        <ul className={styles.results}>
          {showSuggestions && (
            <div className={styles.results_list}>
              {suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                  <div
                    className={styles.stock_wrapper}
                    key={i}
                    onClick={() => handleSelect(s[0], s[1])}
                  >
                    {s[1] && (
                      <h3 style={{ marginBottom: "-2px" }}>
                        <div className={styles.pad}>{s[1]}</div>
                      </h3>
                    )}
                    {s[0] && (
                      <h3
                        style={{
                          marginTop: "-13px",
                          fontSize: "13px",
                        }}
                      >
                        <div className={styles.pad2}>{s[0]}</div>
                      </h3>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    marginLeft: "1rem",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                  }}
                >
                  No Matches...
                </div>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Searchdock;
