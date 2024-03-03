"use client";
import React, { useState, useEffect } from "react";
import styles from "./AboutMetrics.module.css";
import axios from "axios";
import { TbExternalLink } from "react-icons/tb";

function AboutMetrics({ selectedTicker }) {
  const [stockData, setStockData] = useState(null);

  function fetchAPI(selectedTicker) {
    const ticker =
      typeof selectedTicker === "string"
        ? selectedTicker
        : selectedTicker.ticker;

    axios
      .get(`http://localhost:7000/stock_data?ticker=${ticker}`)
      .then((response) => {
        setStockData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAPI(selectedTicker || "tatamotors.ns");
    }, 3500);

    return () => clearInterval(intervalId);
  }, [selectedTicker]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Sector</div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.sector !== null
                ? stockData.sector
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Industry </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.industry !== null
                ? stockData.industry
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.title}>
            <div>Headquaters</div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.city !== null ? stockData.city : "N/A"},
              <> </>
              {stockData && stockData.country !== null ? stockData.country : ""}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Website</div>
          </div>
          {stockData ? (
            <div className={styles.value} style={{ display: "inline-block" }}>
              {stockData && stockData.website !== null ? (
                <>
                  <a
                    href={stockData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block" }}
                  >
                    {new URL(stockData.website).hostname.replace("www.", "")}
                    <TbExternalLink
                      style={{
                        display: "inline-block",
                        marginLeft: "7px",
                        marginBottom: "3px",
                      }}
                    />
                  </a>
                </>
              ) : (
                "N/A"
              )}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Employees (FTE)</div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.fullTimeEmployees !== null
                ? stockData.fullTimeEmployees
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Phone No</div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              +{stockData && stockData.phone !== null ? stockData.phone : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutMetrics;
