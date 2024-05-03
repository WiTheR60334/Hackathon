"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Chart.module.css";
import axios from "axios";
import { Stat, StatArrow } from "@chakra-ui/react";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import ChartX from "@/components/ChartX/ChartX";

function fetchAPI(selectedTicker, setMessage, setFirstValue) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`https://backend-quotes.vercel.app/api/quote?ticker=${ticker}`)
    .then((response) => {
      setMessage(response.data.currentPrice);
      setFirstValue(response.data.previousPrice);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function Chart({ selectedTicker }) {
  const [message, setMessage] = useState("");
  const [firstValue, setFirstValue] = useState(null);
  const [priceChanged, setPriceChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    setLoading(true);
    const intervalId = setInterval(() => {
      fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setFirstValue);
      setTimeout(() => {
        setLoading(false);
        setDataReady(true);
      }, 1500);
    }, 3500);

    return () => clearInterval(intervalId);
  }, [selectedTicker]);

  useEffect(() => {
    if (firstValue && parseFloat(message) !== parseFloat(firstValue)) {
      setPriceChanged(true);
      setTimeout(() => {
        setPriceChanged(false);
      }, 1500);
    }
  }, [message, firstValue]);

  const priceChange = firstValue
    ? (parseFloat(message) - parseFloat(firstValue)).toFixed(2)
    : 0;

  const colors = priceChange >= 0 ? {
    backgroundColor: "transparent",
    textColor: "white",
    areaTopColor: "rgba(3, 123, 102, .35)",
    areaBottomColor: 'rgba(38, 166, 154, 0)',
    lineColor: 'rgba(38, 166, 154, 1)',
  } : {
    backgroundColor: "transparent",
    textColor: "white",
    areaTopColor: "rgba(239, 83, 80, 0.35)",
    areaBottomColor: 'rgba(239, 83, 80, 0)',
    lineColor: 'rgba(239, 83, 80, 1)',
  };

  return (
    <div className={styles.container}>
      <div className={styles.stockTitle}>
        <div className={styles.stockName}>
          {selectedTicker
            ? selectedTicker.companyName || "Tata Motors Ltd (TATAMOTORS.NS)"
            : "Tata Motors Ltd (TATAMOTORS.NS)"}
          {selectedTicker && ` (${selectedTicker.ticker})`}
        </div>
      </div>
      <div className={styles.stockDetails}>
        {loading || !dataReady ? (
          <div className={styles.loading}>
            <CircularProgress
              isIndeterminate
              color="#31353F"
              thickness="12px"
              size="30px"
              background="transparent"
              zIndex="0"
            />
          </div>
        ) : (
          <>
            <div className={` ${priceChanged ? styles.priceChanged : ""}`}>
              <div className={styles.stockPrice}>{message}</div>
            </div>
            <div className={` ${priceChanged ? styles.priceChanged : ""}`}>
              <div
                className={`${styles.stockPriceChange} ${
                  priceChange >= 0 ? styles.positive : styles.negative
                }`}
              >
                {priceChange >= 0 ? "+" : "-"}
                {Math.abs(priceChange).toFixed(2)}
              </div>
            </div>
            <div className={` ${priceChanged ? styles.priceChanged : ""}`}>
              <div
                className={`${styles.stockPercentageChange} ${
                  priceChange >= 0 ? styles.positive : styles.negative
                }`}
              >
                {" "}
                {priceChange >= 0 ? (
                  <Stat>
                    <StatArrow type="increase" style={{ zIndex: "0" }} />
                    {Math.abs(
                      (priceChange / parseFloat(firstValue)) * 100
                    ).toFixed(2)}
                    %
                  </Stat>
                ) : (
                  <Stat>
                    <StatArrow type="decrease" style={{ zIndex: "0" }} />
                    {Math.abs(
                      (priceChange / parseFloat(firstValue)) * 100
                    ).toFixed(2)}
                    %
                  </Stat>
                )}
              </div>
            </div>
          </>
        )}
      </div> 
      <div>
        <ChartX selectedTicker={selectedTicker} colors={colors} />
      </div>
    </div>
  );
}

export default Chart;