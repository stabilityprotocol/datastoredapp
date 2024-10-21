import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { createDecipheriv } from "crypto-browserify";
import { useNavigate } from "react-router-dom";
import { contractABI } from "./contracts/contractABI";
import logo from "./components/logo.jpg";
import InfoBox from "./components/InfoBox/InfoBox";
import { config } from "./config";

async function retrieveDataFromBlockchain(id, secretKey) {
  if (!id || !secretKey) {
    alert("ID or Secret Key is missing!");
    return;
  }

  try {
    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(config.providerUrl);
    const contract = new ethers.Contract(
      config.contractAddress,
      contractABI,
      provider
    );

    // Fetch the encrypted data from blockchain
    const encryptedData = await contract.getTransaction(id);

    // Decrypt the data
    const iv = encryptedData.slice(0, 32);
    const encrypted = encryptedData.slice(32);
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(secretKey, "hex"),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return { encrypted, decrypted }; // Return decrypted data
  } catch (error) {
    console.error("Error retrieving data from blockchain:", error);
    alert("Error retrieving data from the blockchain.");
  }
}

function RetrieveData({ secretKey: propSecretKey, id: propId }) {
  const [decryptedData, setDecryptedData] = useState("");
  const [encryptedDataRaw, setEncryptedDataRaw] = useState("");
  const [transactionHash, setTransactionHash] = useState(""); // For displaying the transaction hash
  const [id, setId] = useState(propId);
  const [secretKey, setSecretKey] = useState(propSecretKey);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Retrieve transaction hash from localStorage
    const savedTransactionHash = localStorage.getItem("transactionHash");
    setTransactionHash(savedTransactionHash);

    // Check if ID or secretKey are missing from props, and try to retrieve them from localStorage
    if (!propId) {
      const savedId = localStorage.getItem("id");
      setId(savedId);
    }
    if (!propSecretKey) {
      const savedKey = localStorage.getItem("secretKey");
      setSecretKey(savedKey);
    }
  }, [propId, propSecretKey]);

  const handleRetrieve = async () => {
    const data = await retrieveDataFromBlockchain(id, secretKey);
    setEncryptedDataRaw(data.encrypted);
    setDecryptedData(data.decrypted);
  };

  const handleStartOver = () => {
    // Clear localStorage and reset all states
    localStorage.removeItem("id");
    localStorage.removeItem("secretKey");
    localStorage.removeItem("data");
    localStorage.removeItem("transactionHash");

    setId("");
    setSecretKey("");
    setDecryptedData("");
    setEncryptedDataRaw("");
    setTransactionHash("");

    // Navigate to the first step
    navigate("/");
  };

  // Helper function to display decrypted object as Key : Value
  const renderDecryptedData = (decryptedData) => {
    try {
      const parsedData = JSON.parse(decryptedData); // Parse the decrypted JSON string
      return Object.entries(parsedData).map(([key, value]) => (
        <div key={key}>
          <strong>{key}</strong>: {value}
        </div>
      ));
    } catch (error) {
      console.error("Error parsing decrypted data", error);
      return <div>Error parsing decrypted data.</div>;
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Stability Logo" />
      <h2>Step 4: Retrieve Data</h2>
      <p className="explainer">
        In this step, you can retrieve the encrypted data you previously
        published on the blockchain. By using the secret key and the ID, you can
        decrypt the data and view its contents. The transaction hash will be
        displayed for reference, and the decrypted data will be presented in a
        readable format.
      </p>
      <br />
      <div>
        <button onClick={handleRetrieve}>Retrieve Data from Blockchain</button>
      </div>
      <div>
        <br />
        <button onClick={handleStartOver}>Start Over</button>
      </div>

      {decryptedData && (
        <div>
          <h3>Transaction Hash:</h3>
          <pre>
            <a
              href={`https://stability-testnet.blockscout.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </pre>
          <h3>Secret Key:</h3>
          <pre>{secretKey}</pre>
          <h3>ID:</h3>
          <pre>{id}</pre>
          <h3>Public Encrypted Data:</h3>
          <pre>{encryptedDataRaw}</pre>
          <h3>Decrypted Data:</h3>
          <pre>{renderDecryptedData(decryptedData)}</pre>
        </div>
      )}
      <InfoBox>
        To learn more about Stability, please visit{" "}
        <a
          href="https://stabilityprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stability Protocol
        </a>
        .
      </InfoBox>
    </div>
  );
}

export default RetrieveData;
