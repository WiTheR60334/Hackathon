"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

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

  const chartData = {
    series: [
      {
        name: 'Revenue',
        type: 'column',
        data: revenue,
        // colors: ['#333333', '#222222'],
      },
      {
        name: 'Net Income',
        type: 'line',
        data: netIncome
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        row: {
          colors: undefined,
          opacity: 0.5
        },
        column: {
          colors: undefined,
          opacity: 0.5
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },

      },
      stroke: {
        width: [0, 4],
        // colors: ['#333333', '#222222']
      },
      title: {
        text: 'Financial Performance'
      },
      dataLabels: {
        enabled: true,
        // colors: ['#666666', '#EEEEEE'],
        enabledOnSeries: [1]
      },
      labels: message,
      xaxis: {
        type: 'datetime'
      },
      yaxis: [
        {
          title: {
            text: 'Revenue',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Net Income'
          }
        }
      ],
      tooltip: {
        theme: "dark",
        style: {
          backgroundColor: "#111",
          color: "#fff",
        },
      },
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} height={350} />
      </div>
    </div>
  );
}

export default FinancialsPerformance;
