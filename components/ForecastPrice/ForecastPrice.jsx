"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

function fetchAPI(selectedTicker, setOneDayQuote, setOneDayTime) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:8000/quote?ticker=${ticker}`)
    .then((response) => {
      setOneDayQuote(response.data.oneDayQuote);
      setOneDayTime(response.data.oneDayTime);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function fetchAPI2(selectedTicker, setMessage, setFirstValue) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:6500/forecast?ticker=${ticker}`)
    .then((response) => {
      setMessage(response.data.predictedPrice);
      setFirstValue(response.data.trend);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function ForecastPrice({ selectedTicker }) {
  const [message, setMessage] = useState("");
  const [oneDayQuote, setOneDayQuote] = useState("");
  const [oneDayTime, setOneDayTime] = useState("");
  const [firstValue, setFirstValue] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setFirstValue);
    fetchAPI2(selectedTicker || "tatamotors.ns", setMessage, setFirstValue);
  }, [selectedTicker]);

  return (
    <div>
      <div>HI</div>
    </div>
  );
}

export default ForecastPrice;
