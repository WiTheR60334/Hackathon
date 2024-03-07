"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

function fetchAPI(selectedTicker, setMessage, setRevenue, setNetIncome) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:7500/performance?ticker=${ticker}`)
    .then((response) => {
      setMessage(response.data.years);
      setRevenue(response.data.revenue);
      setNetIncome(response.data.net_income);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}



function FinancialsPerformance({ selectedTicker }) {
  const [message, setMessage] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [netIncome, setNetIncome] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setRevenue, setNetIncome);
  }, [selectedTicker]);

  return (
    <div>
      <div id="chart">
      </div>
    </div>
  );
}

export default FinancialsPerformance;
