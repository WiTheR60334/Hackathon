"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TickerTape.module.css";

async function getStockData(item) {
  const response = await axios.get("http://localhost:5000/chart", {
    params: { ticker: item },
  });
  return response.data;
}

const TickerTape = ({ items }) => {
  const [stockData, setStockData] = useState({});
  const [valueChanged, setValueChanged] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [previousData, setPreviousData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = {};
        const dataPromises = items.map(item => getStockData(item));
        const fetchedData = await Promise.all(dataPromises);
        items.forEach((item, index) => {
          newData[item] = fetchedData[index];
        });
        setPreviousData(stockData); // Store previous data
        setStockData(newData);
        setDataFetched(true);
        setShowWelcomeMessage(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, [items]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedData = {};
        for (const item of items) {
          const response = await getStockData(item);
          updatedData[item] = response.currentValue;
          if (stockData[item]?.currentValue !== response.currentValue) {
            setValueChanged(true);
            setTimeout(() => setValueChanged(false), 500);
          }
        }
        setPreviousData(stockData); // Store previous data
        setStockData(updatedData);
      } catch (error) {
        console.error("Error updating stock data:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [items, stockData]);

  return (
    <div className={styles.tickerContainer}>
      <ul
        className={styles.ticker}
        style={{
          animationPlayState: showWelcomeMessage ? "paused" : "running",
        }}
        onMouseEnter={() => {
          if (!showWelcomeMessage) {
            document.querySelector(
              `.${styles.ticker}`
            ).style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={() => {
          if (!showWelcomeMessage) {
            document.querySelector(
              `.${styles.ticker}`
            ).style.animationPlayState = "running";
          }
        }}
      >
        {dataFetched ? (
          items.map((item, index) => {
            const currentValue = stockData[item] ? stockData[item].currentValue : previousData[item]?.currentValue;
            const firstValue = stockData[item] ? stockData[item].firstValue : previousData[item]?.firstValue;
            const priceChange = firstValue
              ? (parseFloat(currentValue) - parseFloat(firstValue)).toFixed(2)
              : 0;
            const percentageChange = Math.abs(
              ((currentValue - firstValue) / firstValue) * 100
            );

            return (
              <div
                key={index}
                className={styles.elements}
                // data-tooltip-id="my-tooltipp"
              >
                {/* Tooltip component */}
                {item} :
                <span
                  className={`${styles.stockItem} ${
                    valueChanged ? styles.valueChanged : ""
                  }`}
                  style={{ paddingLeft: "4px" }}
                >
                  {currentValue !== undefined ? currentValue.toFixed(2) : ""}
                </span>
                <div
                  className={`${styles.stockPriceChange} ${
                    priceChange >= 0 ? styles.positive : styles.negative
                  }`}
                >
                  ({priceChange >= 0 ? "+" : "-"}
                  {percentageChange.toFixed(2)}%)
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.greeting}>Welcome :)</div>
        )}
      </ul>
    </div>
  );
};

export default TickerTape;
