"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createChart, ColorType } from "lightweight-charts";

function getEpochTimeInSeconds(timeString) {
  const [hourString, minuteString] = timeString.split(":");
  const hour = parseInt(hourString, 10);
  const minute = parseInt(minuteString, 10);

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const second = 0;

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  return Math.floor(date.getTime() / 1000);
}

function fetchAPI(selectedTicker, setMessage, setFirstValue) {
  const ticker =
    typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

  axios
    .get(`https://backend-quotes.vercel.app/api/quote?ticker=${ticker}`)
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
  const [message, setMessage] = useState([]);
  const [firstValue, setFirstValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState(null);

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
    if (message.length === 0 || firstValue.length === 0) return;

    const epochTimes = firstValue.map((timeString) => getEpochTimeInSeconds(timeString));
    const data = message.map((value, index) => ({
      time: epochTimes[index],
      value: value,
    }));

    if (!chartInstanceRef.current) {
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
        timeFormat: "%H:%m",
      });

      const newSeries = chartInstanceRef.current.addAreaSeries({
        lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
      });
      newSeries.setData(data);
      setSeries(newSeries);
      chartInstanceRef.current.timeScale().fitContent();
    } else {
      series.setData(data);
    }

    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    message,
    firstValue,
    series,
  ]);

  return <div ref={chartContainerRef} />;
}

export default ChartX;







































// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { createChart, ColorType } from "lightweight-charts";

// function getEpochTimeInSeconds(timeString) {
//   const [hourString, minuteString] = timeString.split(":");
//   const hour = parseInt(hourString, 10);
//   const minute = parseInt(minuteString, 10);

//   const currentDate = new Date();

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth() + 1;
//   const day = currentDate.getDate();

//   const second = 0;

//   const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

//   return Math.floor(date.getTime() / 1000);
// }

// function fetchAPI(selectedTicker, setMessage, setFirstValue) {
//   const ticker =
//     typeof selectedTicker === "string" ? selectedTicker : selectedTicker.ticker;

//   axios
//     .get(`https://backend-quotes.vercel.app/api/quote?ticker=${ticker}`)
//     // .get(`https://localhost:8000/quote?ticker=${ticker}`)
//     .then((response) => {
//       setMessage(response.data.oneDayQuote);
//       setFirstValue(response.data.oneDayTime);
//       console.log(response);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// }

// function ChartX({ selectedTicker }) {
//   const [message, setMessage] = useState("");
//   const [firstValue, setFirstValue] = useState("");
//   const [loading, setLoading] = useState(true);  

//   useEffect(() => {
//     if (firstValue) {
//       const epochTimes = firstValue.map((timeString) => getEpochTimeInSeconds(timeString));
//       for (let i = 0; i < message.length; i++) {
//         initialData.push({ time: epochTimes[i], value: message[i] });
//       }
//     }
//     else{
//       console.log("No data");
//     }
//   }, [firstValue]);


//   useEffect(() => {
//     setLoading(true);
//     const intervalId = setInterval(() => {
//       fetchAPI(selectedTicker || "tatamotors.ns", setMessage, setFirstValue);
//       setTimeout(() => {
//         setLoading(false);
//       }, 1500);
//     }, 3500);

//     return () => clearInterval(intervalId);
//   }, [selectedTicker]);

//   const initialData = [];

//   const {
//     colors: {
//       backgroundColor = "transparent",
//       lineColor = "#3A6FF8",
//       textColor = "white",
//       areaTopColor = "#3A6FF8",
//       areaBottomColor = "rgba(58, 111, 248, 0.01)",
//     } = {},
//   } = {};

//   const chartContainerRef = useRef();
//   const chartInstanceRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.applyOptions({
//           width: chartContainerRef.current.clientWidth,
//         });
//       }
//     };

//     chartInstanceRef.current = createChart(chartContainerRef.current, {
//       layout: {
//         background: { type: ColorType.Solid, color: backgroundColor },
//         textColor,
//       },
//       grid: {
//         vertLines: {
//           visible: false,
//         },
//         horzLines: {
//           visible: false,
//         },
//       },
//       width: chartContainerRef.current.clientWidth,
//       height: 350,
//     });

//     chartInstanceRef.current.timeScale().applyOptions({
//       timeVisible: true,
//       rightOffSet: 20,
//       barSpacing: 15,
//       minBarSpacing: 5,
//       fixLeftEdge: true,
//       timeFormat: "%H:%m",
//     });

//     const newSeries = chartInstanceRef.current.addAreaSeries({
//       lineColor,
//       topColor: areaTopColor,
//       bottomColor: areaBottomColor,
//     });
//     newSeries.setData(initialData);
//     chartInstanceRef.current.timeScale().fitContent();

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.remove();
//       }
//     };
//   }, [
//     backgroundColor,
//     lineColor,
//     textColor,  
//     areaTopColor,
//     areaBottomColor,
//     initialData,
//   ]);

//   return <div ref={chartContainerRef} />;
// }

// export default ChartX;
