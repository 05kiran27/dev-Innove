// for model 
import React, { useState } from "react";
import axios from "axios";

function Deepfake() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle file upload and API request
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
        const response = await axios.post(
            "http://localhost:5000/upload",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        console.log('response -> ', response)
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Prediction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>DeepFake Detection</h1>
      </div>

      <div style={styles.uploadSection}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          style={styles.fileInput}
        />
        <button 
          onClick={handleUpload} 
          disabled={loading} 
          style={loading ? styles.uploadButtonDisabled : styles.uploadButton}
        >
          {loading ? "Processing..." : "Upload & Predict"}
        </button>
      </div>

      {result && (
        <div style={styles.resultSection}>
          <h2 style={styles.predictionText}>Prediction: {result.prediction}</h2>
          <h3 style={styles.confidenceText}>Confidence: {result.confidence.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    color: "#fff",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    marginBottom: "30px",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
  },
  title: {
    fontSize: "3em",
    fontWeight: "bold",
    color: "#ffffff",
  },
  uploadSection: {
    marginBottom: "40px",
  },
  fileInput: {
    padding: "12px",
    fontSize: "1.2em",
    border: "2px solid #ffffff",
    borderRadius: "5px",
    outline: "none",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    color: "#333",
    marginBottom: "20px",
    width: "250px",
    transition: "background-color 0.3s ease",
  },
  fileInputFocus: {
    backgroundColor: "#ffffff",
  },
  uploadButton: {
    padding: "12px 30px",
    fontSize: "1.3em",
    backgroundColor: "#f3a847", // Bright yellow-orange
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  uploadButtonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
  resultSection: {
    marginTop: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Light transparent background
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "inline-block",
    maxWidth: "300px",
  },
  predictionText: {
    fontSize: "1.8em",
    fontWeight: "bold",
    color: "#333",
  },
  confidenceText: {
    fontSize: "1.4em",
    color: "#555",
  },
};


export default Deepfake;
