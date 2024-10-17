import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { randomBytes, createCipheriv } from "crypto-browserify";
import { useNavigate } from "react-router-dom";
import { contractABI } from "./contracts/contractABI";
import logo from "./components/logo.jpg";
import InfoBox from "./components/InfoBox/InfoBox";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const providerUrl = process.env.REACT_APP_PROVIDER_URL;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

async function publishDataToBlockchain(data, secretKey, setId) {
  if (!data || !secretKey) {
    alert("Data or Secret Key is missing!");
    return;
  }

  try {
    const dataString = JSON.stringify(data);

    // Encrypt the data
    const iv = randomBytes(16);
    const cipher = createCipheriv(
      "aes-256-cbc",
      Buffer.from(secretKey, "hex"),
      iv
    );
    let encrypted = cipher.update(dataString, "utf8", "hex");
    encrypted += cipher.final("hex");
    const encryptedData = iv.toString("hex") + encrypted;

    const id = Math.floor(Math.random() * (9999999999 - 2 + 1)) + 2;

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Send transaction
    const tx = await contract.recordTransaction(id, encryptedData, {
      maxFeePerGas: ethers.parseUnits("0", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("0", "gwei"),
    });

    const transactionHash = tx.hash;

    await tx.wait();

    localStorage.setItem("transactionHash", transactionHash);

    setId(id);
    alert(`Data published! ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error publishing data:", error);
    alert("Error publishing data to the blockchain.");
  }
}

function PublishData({ data: propData, secretKey: propSecretKey, setId }) {
  const [data, setData] = useState(propData);
  const [secretKey, setSecretKey] = useState(propSecretKey);
  const [isPublishing, setIsPublishing] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propData) {
      const savedData = localStorage.getItem("data");
      setData(savedData);
    }
    if (!propSecretKey) {
      const savedKey = localStorage.getItem("secretKey");
      setSecretKey(savedKey);
    }
  }, [propData, propSecretKey]);

  // Handle the animated "Publishing..." text
  useEffect(() => {
    let interval;
    if (isPublishing) {
      interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPublishing]);

  const handlePublish = async () => {
    setIsPublishing(true);
    await publishDataToBlockchain(data, secretKey, setId);
    setIsPublishing(false);
    navigate("/retrieve");
  };

  return (
    <div className="container">
      <img src={logo} alt="Stability Logo" />
      <h2>Step 3: Publish Data</h2>
      <p className="explainer">
        In this step, we are publishing the encrypted version of your data on
        Stability Testnet. Once published, the data will be stored immutably
        on-chain. This means it cannot be modified or deleted after this step.
      </p>
      <br />
      <button onClick={handlePublish} disabled={isPublishing}>
        {isPublishing ? `Publishing${".".repeat(dotCount)}` : "Publish Data"}
      </button>
      <InfoBox>
        {" "}
        Stability can process <strong>15x</strong> the number of transactions as
        Polygon - with a cheaper and predictable cost.{" "}
      </InfoBox>
    </div>
  );
}

export default PublishData;
