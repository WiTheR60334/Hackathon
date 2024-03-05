"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

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

  const initChart = () => {
    const options = {
      series: [
        {
          type: "rangeArea",
          name: "Team A Range",
          data: [
            {
              x: "Jan",
              y: [3100, 3400],
            },
            {
              x: "Feb",
              y: [4200, 5200],
            },
            {
              x: "Mar",
              y: [3900, 4900],
            },
            {
              x: "Apr",
              y: [3400, 3900],
            },
            {
              x: "May",
              y: [5100, 5900],
            },
            {
              x: "Jun",
              y: [5400, 6700],
            },
            {
              x: "Jul",
              y: [4300, 4600],
            },
            {
              x: "Aug",
              y: [2100, 2900],
            },
          ],
        },

        {
          type: "line",
          name: "Team B Median",
          data: [
            {
              x: "Jan",
              y: 1500,
            },
            {
              x: "Feb",
              y: 1700,
            },
            {
              x: "Mar",
              y: 1900,
            },
            {
              x: "Apr",
              y: 2200,
            },
            {
              x: "May",
              y: 3000,
            },
            {
              x: "Jun",
              y: 1000,
            },
            {
              x: "Jul",
              y: 2100,
            },
            {
              x: "Aug",
              y: 1200,
            },
            {
              x: "Sep",
              y: 1800,
            },
            {
              x: "Oct",
              y: 2000,
            },
          ],
        },
        {
          type: "line",
          name: "Team A Median",
          data: [
            {
              x: "Jan",
              y: 3300,
            },
            {
              x: "Feb",
              y: 4900,
            },
            {
              x: "Mar",
              y: 4300,
            },
            {
              x: "Apr",
              y: 3700,
            },
            {
              x: "May",
              y: 5500,
            },
            {
              x: "Jun",
              y: 5900,
            },
            {
              x: "Jul",
              y: 4500,
            },
            {
              x: "Aug",
              y: 2400,
            },
            {
              x: "Sep",
              y: 2100,
            },
            {
              x: "Oct",
              y: 1500,
            },
          ],
        },
      ],
      chart: {
        height: 300,
        width: "100%",
        type: "rangeArea",
        animations: {
          speed: 500,
        },
      },
      colors: ["#d4526e", "#33b2df", "#d4526e", "#33b2df"],
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: [0.24, 0.24, 1, 1],
      },
      forecastDataPoints: {
        count: 2,
      },
      stroke: {
        curve: "straight",
        width: [0, 0, 2, 2],
      },
      legend: {
        show: true,
        customLegendItems: ["Team A"],
        inverseOrder: true,
      },
      title: {
        text: "Range Area with Forecast Line (Combo)",
      },
      markers: {
        hover: {
          sizeOffset: 5,
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();
  };

  useEffect(() => {
    initChart();
  }, []);

  return (
    <div>
      <div id="chart" ref={chartRef} style={{ width: "100%" }}></div>
      {/* <div>Trend : {firstValue}</div>
      <div>Forecast Price : {message}</div> */}
    </div>
  );
}

export default ForecastPrice;
