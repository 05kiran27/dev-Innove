# import os
# import numpy as np
# import tensorflow as tf
# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# import cv2
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for React frontend
# from flask_cors import CORS

# # Enable CORS for specific origin (your frontend URL)
# CORS(app, resources={r"/predictions": {"origins": "http://localhost:3000"}})

# # Load DeepFake Model
# # MODEL_PATH = "deepfake_detector.h5"
# # model = load_model(MODEL_PATH)

# # Image preprocessing function
# def preprocess_image(image_path):
#     image = cv2.imread(image_path)
#     image = cv2.resize(image, (224, 224))
#     image = image / 255.0  # Normalize
#     image = np.expand_dims(image, axis=0)  # Reshape for model
#     return image

# # API Route to handle image uploads
# @app.route('/upload', methods=['POST'])
# def predict():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files['file']
#     filename = "uploaded.jpg"
#     file.save(filename)  # Save the image temporarily

#     # Preprocess and predict
#     image = preprocess_image(filename)
#     prediction = model.predict(image)[0][0]
    
#     # Confidence-based thresholding
#     label = "Fake" if prediction > 0.5 else "Real"
#     if label == "Real" and prediction < 0.3:
#         label = "Fake"
#     elif label == "Fake" and prediction > 0.7:
#         label = "Real"

#     return jsonify({"prediction": label, "confidence": float(prediction)})

# if __name__ == '__main__':
#     app.run(debug=True)




# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # This will allow all domains to make requests to your backend

# @app.route("/upload", methods=["POST"])
# def upload():
#     file = request.files.get("file")
#     if not file:
#         return jsonify({"error": "No file uploaded"}), 400

#     # Placeholder: Replace with your actual image prediction logic
#     prediction_result = {"prediction": "Fake", "confidence": 0.87}

#     return jsonify(prediction_result)

# if __name__ == "__main__":
#     app.run(debug=True)



import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from flask import Flask, request, jsonify
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your trained model (you can load it once during the app startup)
model = tf.keras.models.load_model('deepfake_detector.h5')

def upload():
    # Get the file from the request
    file = request.files.get("file")
    
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Read the file and preprocess it
    img = image.load_img(io.BytesIO(file.read()), target_size=(224, 224))  # Adjust the target_size based on your model's input
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Normalize the image if required

    # Make prediction
    prediction = model.predict(img_array)

    # Interpret the prediction (assuming binary classification)
    prediction_label = 'deepfake' if prediction[0] > 0.5 else 'real'
    confidence = prediction[0] if prediction[0] > 0.5 else 1 - prediction[0]

    # Return the result as JSON
    return jsonify({"prediction": prediction_label, "confidence": float(confidence)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)