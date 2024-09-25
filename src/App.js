import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GenerateSecret from "./GenerateSecret";
import InputData from "./InputData";
import PublishData from "./PublishData";
import RetrieveData from "./RetrieveData";

function App() {
  const [secretKey, setSecretKey] = useState(""); // Holds the generated secret key
  const [data, setData] = useState(""); // Holds the input data (property: value)
  const [id, setId] = useState(null); // Holds the blockchain ID after publishing

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<GenerateSecret setSecretKey={setSecretKey} />}
        />
        <Route
          path="/input"
          element={<InputData secretKey={secretKey} setData={setData} />}
        />
        <Route
          path="/publish"
          element={
            <PublishData data={data} secretKey={secretKey} setId={setId} />
          }
        />
        <Route
          path="/retrieve"
          element={<RetrieveData secretKey={secretKey} id={id} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
