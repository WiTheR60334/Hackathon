"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

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

  
    const chartData ={
      options: {
        chart: {
          type: "line",
        },
        xaxis: {
          categories: firstValue,
        },
      },
      series: [
        {
          name: "Profit",
          data: message,
        },
      ],
      tooltip: {
        theme: "dark",
        style: {
          backgroundColor: "#111",
          color: "#fff",
        },
        },
    };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
      </div>
    </div>
  );
}

export default FinancialsProfit;
