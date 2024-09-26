import React from "react";
import "./InfoBox.css"; // Import the CSS file for styling

function InfoBox({ children }) {
  return <div className="info-box">{children}</div>;
}

export default InfoBox;
