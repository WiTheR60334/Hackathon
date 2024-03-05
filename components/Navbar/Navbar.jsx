import React from "react";
import styles from "./Navbar.module.css";
import { Button } from "@chakra-ui/react";
import { MdDashboard } from "react-icons/md";
import { RiStockFill } from "react-icons/ri";
import { MdOnlinePrediction } from "react-icons/md";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { AiOutlineRead } from "react-icons/ai";
import { Element, scroller } from "react-scroll";

const buttonData = [
  {
    buttonName: "Overview",
    icon: <MdDashboard className={styles.icons} />,
    targetElement: "overview", // ID or name of the target element in the layout file
  },
  {
    buttonName: "Forecast",
    icon: <MdOnlinePrediction className={styles.icons} />,
    targetElement: "forecast",
  },
  {
    buttonName: "Financials",
    icon: <BiSolidBarChartAlt2 className={styles.icons} />,
    targetElement: "financials",
  },
  {
    buttonName: "Peers",
    icon: <FaUsers className={styles.icons} />,
    targetElement: "peers",
  },
  {
    buttonName: "News",
    icon: <AiOutlineRead className={styles.icons} />,
    targetElement: "news",
  },
];

const scrollToElement = (element) => {
  scroller.scrollTo(element, {
    duration: 900,
    delay: 100,
    smooth: true,
    offset: -50,
  });
};

function Navbar() {
  return (
    <div className={styles.main}>
      <div className={styles.hi}>
        <RiStockFill />
        TrendTracker
      </div>

      <div className={styles.btnGroup}>
        {buttonData.map((button, index) => (
          <Button
            key={index}
            leftIcon={button.icon}
            className={styles.btn}
            onClick={() => scrollToElement(button.targetElement)}
          >
            {button.buttonName}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
