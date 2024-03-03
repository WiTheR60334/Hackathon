"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { createChart, ColorType } from "lightweight-charts";

function fetchAPI(selectedTicker, setMessage, setFirstValue) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`http://localhost:8000/quote?ticker=${ticker}`)
    .then((response) => {
      setMessage(response.data.oneDayQuote);
      setFirstValue(response.data.oneDayTime);
      console.log(response);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function ChartX({ selectedTicker }) {
  const [message, setMessage] = useState("");
  const [firstValue, setFirstValue] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const intervalId = setInterval(() => {
      fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setFirstValue);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }, 3500);

    return () => clearInterval(intervalId);
  }, [selectedTicker]);

  const initialData = [];

  for (let i = 0; i < message.length; i++) {
    const epochTime = Date.parse(`2024-03-01 ${firstValue[i]}`);
    initialData.push({ time: epochTime, value: message[i] });
  }

  const {
    colors: {
      backgroundColor = "transparent",
      lineColor = "#3A6FF8",
      textColor = "white",
      areaTopColor = "#3A6FF8",
      areaBottomColor = "rgba(58, 111, 248, 0.01)",
    } = {},
  } = {};

  const chartContainerRef = useRef();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    chartInstanceRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
    });

    chartInstanceRef.current.timeScale().applyOptions({
      timeVisible: true,
      rightOffSet: 20,
      barSpacing: 15,
      minBarSpacing: 5,
      fixLeftEdge: true,
    });

    const newSeries = chartInstanceRef.current.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(initialData);
    chartInstanceRef.current.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
      }
    };
  }, [
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    initialData,
  ]);

  return <div ref={chartContainerRef} />;
}

export default ChartX;
