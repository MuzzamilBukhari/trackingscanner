import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("Click Start to scan barcode");
  const [started, setStarted] = useState(false);

  const handleUpdate = async (trackingNumber) => {
    try {
      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbwPX5vZ_b771oCanC0Sx2FKyWmvf4NRAwmDWqHmUaQqDY9h8-W2LutOOxwfWLj8-SI2/exec",
        {
          trackingNumber,
        }
      );

      setMessage(
        response.data.success
          ? `Order ${trackingNumber} marked as returned!`
          : "Failed to update sheet"
      );
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setScanning(false);
  };

  const handleScan = (err, result) => {
    if (result && !scanning) {
      setScanning(true);
      setMessage(`Scanned: ${result.text}\nUpdating sheet...`);
      handleUpdate(result.text);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Order Return Scanner</h1>
      <p>{message}</p>
      <button
        onClick={() => setStarted(!started)}
        style={{
          padding: "10px 20px",
          margin: "10px",
          backgroundColor: started ? "#ff4444" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {started ? "Stop" : "Start"} Scanner
      </button>

      {started && (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={handleScan}
          />
        </div>
      )}
    </div>
  );
}

export default App;
