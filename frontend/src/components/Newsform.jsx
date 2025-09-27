import React, { useState } from 'react';
import axios from 'axios';

const Newsform = () => {
    const [newsText, setNewsText] = useState('');
    const [prediction, setPrediction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        setLoading(true); // Show loading spinner or indicator
        setError(null); // Clear any previous error messages
    
        try {
            // Send the news text to the Flask backend using POST
            const response = await axios.post('http://localhost:5000/predict', {
                text: newsText, // The text the user enters
            });
    
            // Handle the backend response (prediction)
            setPrediction(response.data.prediction); // Update state with prediction ("Fake" or "Real")
        } catch (err) {
            setError('Error making prediction'); // Handle errors
        } finally {
            setLoading(false); // Hide loading spinner after the request finishes
        }
    };
    
    

    return (
        <div className="news-form">
            <h1>Fake News Detection</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="Enter the news text"
                    rows="6"
                    cols="50"
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Check News'}
                </button>
            </form>
            
            {prediction && (
                <div className="result">
                    <h3>Prediction: {prediction}</h3>
                </div>
            )}

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Newsform;
