# DataStore DApp

DataStore DApp is a decentralized application built using React that allows users to securely store and retrieve data on the blockchain. This project leverages Solidity smart contracts and web3.js/ethers.js to interact with Stability.

## Features

- **Generate Secrets**: Securely create and manage secrets that can be stored on the Stability blockchain.
- **Publish Data**: Input data and publish it to the Stability blockchain with encryption for added security.
- **Retrieve Data**: Retrieve and decrypt stored data using the associated secret.

## Project Structure

The project is organized into the following key files and directories:

- `/public`: Contains static assets like `favicon.ico`, and `manifest.json`.
- `/src`: Main source code directory containing components and application logic.
  - `App.js`: Entry point for the application.
  - `InputData.js`, `RetrieveData.js`, `GenerateSecret.js`, `PublishData.js`: Core components for handling data operations.
  - `/components`: Contains reusable components like `InfoBox`.
  - `/contracts`: Holds the smart contract ABI file (`contractABI.js`) for blockchain interaction.
- `.env.template`: Template for environment variables configuration (API keys, network settings).

## Getting Started

### Prerequisites

- **Node.js** (v14 or above)
- **npm** or **yarn**
- Stability API Key - Available at the [Stability Account Portal](https://account.stabilityprotocol.com/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/datastoredapp.git
   cd datastoredapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.template` to `.env`
   - Update the `.env` file with the required values.

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

### Testing

Run tests using:

```bash
npm test
```

## Deployment

To build the project for production:

```bash
npm run build
```

The build will be output to the `build` folder, which you can deploy to any static hosting service.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License.
