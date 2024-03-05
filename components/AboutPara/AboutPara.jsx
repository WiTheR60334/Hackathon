import React, { useState, useEffect, useRef } from "react";
import styles from "./AboutPara.module.css";
import classnames from "classnames";
import axios from "axios";

function AboutPara({ selectedTicker }) {
  const [stockData, setStockData] = useState(null);
  const [clamped, setClamped] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [containerHeight, setContainerHeight] = useState("150px");
  const paraRef = useRef(null);

  function fetchAPI(selectedTicker) {
    const ticker =
      typeof selectedTicker === "string"
        ? selectedTicker
        : selectedTicker.ticker;

    axios
      .get(`http://localhost:7000/stock_data?ticker=${ticker}`)
      .then((response) => {
        if (response.data && response.data.about !== undefined) {
          setStockData(response.data);
        } else {
          setStockData({ about: "N/A" });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAPI(selectedTicker || "tatamotors.ns");
    }, 3500);

    return () => clearInterval(intervalId);
  }, [selectedTicker]);

  useEffect(() => {
    if (!clamped && paraRef.current) {
      const paraHeight = paraRef.current.offsetHeight;
      setContainerHeight(Math.min(paraHeight, 150) + "px");
    } else {
      setContainerHeight("150px");
    }
  }, [clamped, stockData]);

  const handleClick = () => {
    setClamped(!clamped);
    setShowMore(true);
  };

  return (
    <div className={styles.content} style={{ height: containerHeight }}>
      {stockData ? (
        <div>
          <div
            // className={classnames(styles.para, clamped && styles.clamp)}
            // ref={paraRef}
          >
            {stockData.about !== null ? 
              // Displaying up to 6 lines including the last full stop
              stockData.about
                .split(".")
                .slice(0, 5)
                .join(". ") + "."
              : 
              "N/A"
            }
          </div>
          {/* {stockData.about && stockData.about.split(".").length > 6 && (
            <button className={styles.btn} onClick={handleClick}>
              {clamped ? "Read more" : "Read less"}
            </button>
          )} */}
        </div>
      ) : (
        <span className={styles.loading}>Loading...</span>
      )}
    </div>
  );
}

export default AboutPara;
