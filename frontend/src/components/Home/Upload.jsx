import React, { useState } from "react";

const Upload = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState("");

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please upload an image!");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                setResult(data.expression);
            }
        } catch (error) {
            alert("Error during prediction!");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Predict</button>
            {result && <h3>Prediction: {result}</h3>}
        </div>
    );
};

export default Upload;

