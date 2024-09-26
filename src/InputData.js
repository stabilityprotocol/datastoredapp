import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import logo from "./components/logo.jpg"; // Import the logo
import InfoBox from "./components/InfoBox/InfoBox"; // Import the InfoBox component

function InputData({ secretKey: propSecretKey, setData }) {
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: "", value: "" }]); // Dynamic key-value pairs
  const [secretKey, setSecretKey] = useState(propSecretKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propSecretKey) {
      const savedKey = localStorage.getItem("secretKey");
      if (savedKey) {
        setSecretKey(savedKey);
      }
    }
  }, [propSecretKey]);

  // If no secret key is found, display an error
  if (!secretKey) {
    return <p>Please generate a secret key first!</p>;
  }

  // Handle changes to the key or value
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs[index][name] = value;
    setKeyValuePairs(newKeyValuePairs);
  };

  // Add a new key-value pair input set
  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  // Remove a key-value pair input set
  const removeKeyValuePair = (index) => {
    const newKeyValuePairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(newKeyValuePairs);
  };

  const handleNext = () => {
    // Validate that all key-value pairs have valid entries
    const isValid = keyValuePairs.every((pair) => pair.key && pair.value);
    if (!isValid) {
      alert("Please fill in all key-value pairs.");
      return;
    }

    // Convert key-value pairs to an object
    const dataObject = Object.fromEntries(
      keyValuePairs.map((pair) => [pair.key, pair.value])
    );

    // Save data in React state and localStorage
    setData(dataObject);
    localStorage.setItem("data", JSON.stringify(dataObject));

    alert("Data Saved!");
    navigate("/publish");
  };

  return (
    <div className="container">
      <img src={logo} alt="Stability Logo" />
      <h2>Step 2: Input Data</h2>
      <p className="explainer">
        In this step, you can input any data you'd like to publish. For this
        example, we are using key-value pairs. You can add as many pairs as you
        need, with each representing a key (e.g., "Beneficiary Name") and its
        corresponding value (e.g., "Hank Scorpio"). Click 'Save Data' to proceed
        to the next step.
      </p>
      <br></br>

      {keyValuePairs.map((pair, index) => (
        <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
          <input
            type="text"
            name="key"
            placeholder="Key (e.g., Beneficiary Name)"
            value={pair.key}
            onChange={(e) => handleInputChange(index, e)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            name="value"
            placeholder="Value (e.g., Hank Scorpio)"
            value={pair.value}
            onChange={(e) => handleInputChange(index, e)}
          />
          {keyValuePairs.length > 1 && (
            <button
              type="button"
              onClick={() => removeKeyValuePair(index)}
              className="remove"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="button-group">
        <button type="button" onClick={addKeyValuePair}>
          Add Additional Data
        </button>
        <button onClick={handleNext}>Save Data</button>
      </div>
      <InfoBox>
        {" "}
        Stability is able to store numerous, large data sets on the blockchain -
        immutably, forever, and cheaper.{" "}
      </InfoBox>
    </div>
  );
}

export default InputData;
