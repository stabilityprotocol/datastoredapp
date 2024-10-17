import { ethers } from "ethers";
import { contractABI } from "./contracts/contractABI";

// Contract details
const contractAddress = "0x0A2a393168b24F8E23585bE78a15381aa876Ab34";

// Connect to the Stability Network
const providerUrl = "https://rpc.testnet.stabilityprotocol.com";
const provider = new ethers.JsonRpcProvider(providerUrl);

async function readMessage() {
  try {
    // Create a contract instance
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Call the getMessage function
    const message = await contract.getMessage();

    console.log("The current message is:", message);
  } catch (error) {
    console.error("Error reading the message:", error);
  }
}

// Run the function
readMessage();
