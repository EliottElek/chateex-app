import React from "react";
import Channels from "../Channels/Channels";
import AutoCompleteChannels from "../../AutoCompleteChannels/AutoCompleteChannels";
import Profile from "./Profile/Profile";

const styles = {
  grid: {
    background: "transparent!important",
    height: "100%",
    display: "grid",
    gridTemplateRows: "55px auto 65px",
    overflowY: "hidden",
    width: "100%",
  },
  topGrid: {
    display: "flex",
    padding: "12x 0px 12px 0px",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent!important",
  },
  middleGrid: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    overflowY: "hidden",
    background: "transparent!important",
  },
  bottomGrid: {
    height: "100%",
    width: "100%",
    overflowY: "hidden",
    background: "transparent!important",
  },
};
const LeftContainer = () => {

  return (
    <div style={styles.grid}>
      <div style={styles.topGrid}>
        <AutoCompleteChannels placeholder={"Find a channel..."} />
      </div>
      <div style={styles.middleGrid}>
        <Channels />
      </div>
      <div style={styles.bottomGrid}>
        <Profile />
      </div>
    </div>
  );
};

export default LeftContainer;
