"use client";
import React, { useState, useEffect } from "react";
import styles from "./KeyMetrics.module.css";
import axios from "axios";
import { Tooltip } from "react-tooltip";

function KeyMetrics({ selectedTicker }) {
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

  const tooltipContentPE = (
    <div>
      <p>
        <strong>TTM PE Ratio</strong>
      </p>
      <p>TTM PE Ratio shows how much investors</p>
      <p>are paying for each dollar of a company's</p>
      <p>past year's earnings. TTM stands for </p>
      <p>Trailing Twelve Months. </p>
    </div>
  );

  const tooltipContentPB = (
    <div>
      <p>
        <strong>PB Ratio</strong>
      </p>
      <p>The PB Ratio shows how much investors </p>
      <p>are paying for each dollar of a company's</p>
      <p>net assets. </p>
    </div>
  );

  const tooltipContentDY = (
    <div>
      <p>
        <strong>Dividend Yield</strong>
      </p>
      <p>Percentage of a stock's price returned </p>
      <p>to investors as dividends annually.</p>
    </div>
  );

  const tooltipContentMC = (
    <div>
      <p>
        <strong>Market Cap</strong>
      </p>
      <p>Market Cap is the total value of </p>
      <p>a company's publicly traded shares. </p>
    </div>
  );

  const tooltipContentPM = (
    <div>
      <p>
        <strong>Profit Margin</strong>
      </p>
      <p>Profit Margin indicates the portion of</p>
      <p>revenue that turns into profit with </p>
      <p>higher margins suggesting better profitability. </p>
    </div>
  );

  const tooltipContentRV = (
    <div>
      <p>
        <strong>Quarterly Revenue Growth</strong>
      </p>
      <p>Shows how much a company's sales </p>
      <p>have increased or decreased </p>
      <p>compared to the previous quarter. </p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>TTM PE Ratio</div>
            <Tooltip
              id="my-tooltip"
              className={styles.tooltip}
              content={tooltipContentPE}
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "8px",
                lineHeight: "1.5",
                dropShadow: "0 0 15px rgba(0,0,0,.7)",
              }}
            />
            <div className={styles.iconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="18"
                height="18"
                className={styles.icon}
                data-tooltip-id="my-tooltip"
              >
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"></path>
              </svg>
            </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.trailing_pe_ratio !== null
                ? stockData.trailing_pe_ratio
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>PB Ratio </div>
            <Tooltip
              id="my-tooltip2"
              className={styles.tooltip}
              content={tooltipContentPB}
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "8px",
                lineHeight: "1.5",
                dropShadow: "0 0 15px rgba(0,0,0,.7)",
              }}
            />
            <div className={styles.iconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="18"
                height="18"
                className={styles.icon}
                data-tooltip-id="my-tooltip2"
              >
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"></path>
              </svg>
            </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.pb_ratio !== null
                ? stockData.pb_ratio
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.title}>
            <div>Dividend Yield</div>
            <Tooltip
              id="my-tooltip3"
              className={styles.tooltip}
              content={tooltipContentDY}
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "8px",
                lineHeight: "1.5",
                dropShadow: "0 0 15px rgba(0,0,0,.7)",
              }}
            />
            <div className={styles.iconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="18"
                height="18"
                className={styles.icon}
                data-tooltip-id="my-tooltip3"
              >
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"></path>
              </svg>
            </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.dividend_yield !== null
                ? stockData.dividend_yield + "%"
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Market Cap</div>
            <Tooltip
              id="my-tooltip4"
              className={styles.tooltip}
              content={tooltipContentMC}
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "8px",
                lineHeight: "1.5",
                dropShadow: "0 0 15px rgba(0,0,0,.7)",
              }}
            />
            <div className={styles.iconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="18"
                height="18"
                className={styles.icon}
                data-tooltip-id="my-tooltip4"
              >
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"></path>
              </svg>
            </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.market_cap !== null ? (
                <>
                  {`${stockData.market_cap}T`}{" "}
                  {stockData.currency && (
                    <span className={styles.smallCase}>
                      {stockData.currency}
                    </span>
                  )}
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
            <div>Profit Margin</div>
            <Tooltip
              id="my-tooltip5"
              className={styles.tooltip}
              content={tooltipContentPM}
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "8px",
                lineHeight: "1.5",
                dropShadow: "0 0 15px rgba(0,0,0,.7)",
              }}
            />
            <div className={styles.iconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="18"
                height="18"
                className={styles.icon}
                data-tooltip-id="my-tooltip5"
              >
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"></path>
              </svg>
            </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.profitMargin !== null
                ? (stockData.profitMargin * 100).toFixed(2) + "%"
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <div>Q Rev Growth</div>
            <Tooltip
              id="my-tooltip6"
              className={styles.tooltip}
              content={tooltipContentRV}
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "8px",
                lineHeight: "1.5",
                dropShadow: "0 0 15px rgba(0,0,0,.7)",
              }}
            />
            <div className={styles.iconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="18"
                height="18"
                className={styles.icon}
                data-tooltip-id="my-tooltip6"
              >
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"></path>
              </svg>
            </div>
          </div>
          {stockData ? (
            <div className={styles.value}>
              {stockData && stockData.revenue_growth !== null
                ? (stockData.revenue_growth * 100).toFixed(2) + "%"
                : "N/A"}
            </div>
          ) : (
            <span className={styles.loading}>-</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default KeyMetrics;
