"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

function fetchAPI(selectedTicker, setMessage, setFirstValue) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:7500/performance?ticker=${ticker}`)
    .then((response) => {
      setMessage(response.data.profit);
      setFirstValue(response.data.profitYear);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function FinancialsProfit({ selectedTicker }) {
  const [message, setMessage] = useState([]);
  const [firstValue, setFirstValue] = useState([]);
  const [previousTicker, setPreviousTicker] = useState(null);

  useEffect(() => {
    if (selectedTicker !== previousTicker) {
      fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setFirstValue);
      setPreviousTicker(selectedTicker);
    }
  }, [selectedTicker, previousTicker]);

  

  return (
    <div>
      <div id="chart">
      </div>
    </div>
  );
}

export default FinancialsProfit;
