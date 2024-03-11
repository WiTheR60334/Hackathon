"use client";
import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import styles from "./TickerTape.module.css";
import { Tooltip } from "react-tooltip";

async function getStockData(item) {
  const response = await axios.get("https://ticker-tape.vercel.app/api/tickertape", {
    params: { ticker: item },
  });
  return response.data;
}
const TickerTape = ({ items }) => {
  const [stockData, setStockData] = useState({});
  const [valueChanged, setValueChanged] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockData = {};
        const dataPromises = [];
        for (const item of items) {
          dataPromises.push(getStockData(item));
        }
        const allData = await Promise.all(dataPromises);
        for (let i = 0; i < allData.length; i++) {
          stockData[items[i]] = allData[i];
        }
        setStockData(stockData);
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
      const updatedData = {};
      for (const item of items) {
        const response = await getStockData(item);
        updatedData[item] = response.currentValue;
        if (stockData[item]?.currentValue !== response.currentValue) {
          setValueChanged(true);
          setTimeout(() => setValueChanged(false), 500);
        }
      }
      setStockData(updatedData);
    }, 2000);

    return () => clearInterval(interval);
  }, [items, stockData]);

  const tooltipContentPEee = <p>HI</p>;

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
            const currentValue = stockData[item]?.currentValue;
            const firstValue = stockData[item]?.firstValue;
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
                {/* <Tooltip
                  id="my-tooltipp"
                  className={styles.tooltip}
                  content={tooltipContentPEee}
                  style={{ backgroundColor: "#000", borderRadius: "8px" }}
                /> */}
                {item} :
                <span
                  className={`${styles.stockItem} ${
                    valueChanged ? styles.valueChanged : ""
                  }`}
                  style={{ paddingLeft: "4px" }}
                >
                  {currentValue !== undefined ? currentValue.toFixed(2) : (previousData[item]?.currentValue !== undefined ? previousData[item]?.currentValue.toFixed(2) : "")}
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