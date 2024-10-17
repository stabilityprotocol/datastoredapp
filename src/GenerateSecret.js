import React from "react";
import { randomBytes } from "crypto-browserify";
import { useNavigate } from "react-router-dom";
import logo from "./components/logo.jpg";
import InfoBox from "./components/InfoBox/InfoBox";

function GenerateSecret({ setSecretKey }) {
  const navigate = useNavigate(); // Use navigate hook for routing

  const generateKey = () => {
    try {
      const key = randomBytes(32).toString("hex");
      setSecretKey(key); // Save the key in React state
      localStorage.setItem("secretKey", key); // Also save it in localStorage
      alert(`Secret Key Generated: ${key}`);
      navigate("/input"); // Navigate to the next step after generating the key
    } catch (error) {
      console.error("Error generating the secret key", error);
      alert("Failed to generate secret key. Please try again.");
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Stability Logo" />
      <h2>Step 1: Generate Secret Key</h2>
      <p className="explainer">
        The secret key is a randomly generated string that will be used to
        securely encrypt and decrypt your data. We will be publishing encrypted
        data on-chain, and this key allows us to decrypt it. In this example,
        you do not need to save the key.
      </p>
      <br />
      <button onClick={generateKey}>Generate Secret Key</button>
      <InfoBox>
        {" "}
        Stability is a public blockchain without any cryptocurrency requirement,
        unlocking blockchain technology for all.{" "}
      </InfoBox>
    </div>
  );
}

export default GenerateSecret;
