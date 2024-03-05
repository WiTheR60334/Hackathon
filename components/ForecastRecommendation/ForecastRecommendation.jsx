"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

function fetchAPI(selectedTicker, setMessage, setFirstValue, setRevenueGrowth) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:7000/stock_data?ticker=${ticker}`)
    .then((response) => {
      setMessage(response.data.trailing_pe_ratio);
      setFirstValue(response.data.profitMargin);
      setRevenueGrowth(response.data.revenue_growth);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function fetchAPI2(selectedTicker, setTrend, setPredictedPrice) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:6500/forecast?ticker=${ticker}`)
    .then((response) => {
      setTrend(response.data.trend);
      setPredictedPrice(response.data.predictedPrice);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function fetchAPI3(selectedTicker, setPreviousPrice) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:8000/quote?ticker=${ticker}`)
    .then((response) => {
      setPreviousPrice(response.data.previousPrice);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function ForecastRecommendation({ selectedTicker }) {
  const [message, setMessage] = useState("");
  const [firstValue, setFirstValue] = useState(null);
  const [RevenueGrowth, setRevenueGrowth] = useState(null);
  const [PreviousPrice, setPreviousPrice] = useState(null);
  const [PredictedPrice, setPredictedPrice] = useState(null);
  const [Trend, setTrend] = useState(null);
  const [recommender, setRecommender] = useState(0);

  useEffect(() => {
    fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setFirstValue, setRevenueGrowth);
    fetchAPI2(selectedTicker || "tatamotors.ns", setTrend, setPredictedPrice);
    fetchAPI3(selectedTicker || "tatamotors.ns", setPreviousPrice);
  }, [selectedTicker]);

  useEffect(() => {
    if (message < 20) {
      setRecommender((prevRecommender) => prevRecommender + 1);
    } else {
      setRecommender((prevRecommender) => prevRecommender - 1);
    }
    if (RevenueGrowth > 15) {
      setRecommender((prevRecommender) => prevRecommender + 1);
    } else {
      setRecommender((prevRecommender) => prevRecommender - 1);
    }
    if (Trend == 'Bullish') {
      setRecommender((prevRecommender) => prevRecommender + 1);
    } else {
      setRecommender((prevRecommender) => prevRecommender - 1);
    }
    if (PredictedPrice > PreviousPrice) {
      setRecommender((prevRecommender) => prevRecommender + 1);
    } else {
      setRecommender((prevRecommender) => prevRecommender - 1);
    }

    if (firstValue > 10) {
      setRecommender((prevRecommender) => prevRecommender + 1);
    } else {
      setRecommender((prevRecommender) => prevRecommender - 1);
    }
  }, [message, firstValue]);

  return <div>Recommender: {recommender}</div>;
}

export default ForecastRecommendation;
