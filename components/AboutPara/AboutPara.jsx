import React, { useState, useEffect, useRef } from "react";
import styles from "./AboutPara.module.css";
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
      .get(`https://key-metrics.vercel.app/api/keymetrics?ticker=${ticker}`)
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
    <div className={styles.content} style={{ height: 'auto' }}>
      {stockData ? (
        <div>
          <div>
            <div className={styles.clamp}>
            {stockData.about !== null ? 
              stockData.about
                .split(".")
                .slice(0, 5)
                .join(". ") + "."
              : 
              "N/A"
            }
            </div>
          </div>
        </div>
      ) : (
        <span className={styles.loading}>Loading...</span>
      )}
    </div>
  );
}

export default AboutPara;
