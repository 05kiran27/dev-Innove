from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

with open("./final_model.sav", "rb") as model_file:
    model = pickle.load(model_file)

@app.route("/")
def home():
    return "Fake News Detection API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request"}), 400
    
    text = [data["text"]]  # Convert to list for model input
    prediction = model.predict(text)
    
    return jsonify({"prediction": "Fake" if prediction[0] else "Real"})

if __name__ == "__main__":
    app.run(debug=True)
