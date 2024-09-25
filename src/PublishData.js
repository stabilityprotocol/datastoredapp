import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { randomBytes, createCipheriv } from "crypto-browserify";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { contractABI } from "./contracts/contractABI"; // Import the ABI from the new file
import logo from "./components/logo.jpg"; // Import the logo

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Get contract address
const providerUrl = process.env.REACT_APP_PROVIDER_URL; // Get provider URL
const privateKey = process.env.REACT_APP_PRIVATE_KEY; // Get private key

console.log(contractAddress);

async function publishDataToBlockchain(data, secretKey, setId) {
  if (!data || !secretKey) {
    alert("Data or Secret Key is missing!");
    return;
  }

  try {
    // Convert data to a string before encrypting
    const dataString = JSON.stringify(data);

    // Encrypt the data
    const iv = randomBytes(16);
    const cipher = createCipheriv(
      "aes-256-cbc",
      Buffer.from(secretKey, "hex"),
      iv
    );
    let encrypted = cipher.update(dataString, "utf8", "hex"); // Encrypt the stringified data
    encrypted += cipher.final("hex");
    const encryptedData = iv.toString("hex") + encrypted;

    const id = Math.floor(Math.random() * (9999999999 - 2 + 1)) + 2;

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Send transaction
    const tx = await contract.recordTransaction(id, encryptedData, {
      maxFeePerGas: ethers.parseUnits("0", "gwei"), // Minimal non-zero gas fees
      maxPriorityFeePerGas: ethers.parseUnits("0", "gwei"),
    });

    // The transaction hash is available here
    const transactionHash = tx.hash;
    console.log("Transaction Hash:", transactionHash);

    // Wait for the transaction to be mined
    await tx.wait();

    // Store transaction hash in localStorage
    localStorage.setItem("transactionHash", transactionHash);

    setId(id);
    alert(`Data published! ID: ${id}`);
    return id; // Return the ID so it can be used for navigation
  } catch (error) {
    console.error("Error publishing data:", error);
    alert("Error publishing data to the blockchain.");
  }
}

function PublishData({ data: propData, secretKey: propSecretKey, setId }) {
  const [data, setData] = useState(propData);
  const [secretKey, setSecretKey] = useState(propSecretKey);
  const [isPublishing, setIsPublishing] = useState(false); // Track loading state
  const [dotCount, setDotCount] = useState(0); // Track the number of dots for animation
  const navigate = useNavigate(); // For navigation to step 4

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
        setDotCount((prev) => (prev + 1) % 4); // Cycle through 0 to 3 dots
      }, 500); // Change dot count every 500ms
    } else {
      clearInterval(interval); // Clear interval when not publishing
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isPublishing]);

  const handlePublish = async () => {
    setIsPublishing(true); // Set loading state to true
    await publishDataToBlockchain(data, secretKey, setId);
    setIsPublishing(false); // Set loading state to false once done
    navigate("/retrieve"); // Navigate to Step 4 after publishing
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
    </div>
  );
}

export default PublishData;
