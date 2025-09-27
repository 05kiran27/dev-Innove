# from flask import Flask, request, jsonify
# from flask_socketio import SocketIO
# import cv2
# import numpy as np
# import tensorflow as tf
# from PIL import Image

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# from flask_cors import CORS
# CORS(app)

# # Load your pre-trained model
# model = tf.keras.models.load_model('./face_expression.h5')

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image uploaded'}), 400  # Return error if no file found

#     try:
#         file = request.files['image']
#         print("Received file:", file.filename)

#         img = Image.open(file).convert('RGB')
#         img = img.resize((96, 96))  # Resize to (96, 96) instead of (224, 224)
#         img_array = np.array(img) / 255.0  # Normalize image
#         img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

#         print(f"Input shape: {img_array.shape}")  # Debugging log

#         # Predict with the model
#         predictions = model.predict(img_array)
#         predicted_label = np.argmax(predictions, axis=1)[0]

#         return jsonify({'label': int(predicted_label)})

#     except Exception as e:
#         print("🚨 Error during prediction:", str(e))
#         return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500  # Return error response

# if __name__ == "__main__":
#     socketio.run(app, host="0.0.0.0", port=5000)






from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load pre-trained model
model = tf.keras.models.load_model("./deepfake_detector.h5")

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        file = request.files['image']
        img = Image.open(file).convert('RGB')
        img = img.resize((96, 96))  # Resize image to model's input shape
        img_array = np.array(img) / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        predicted_label = np.argmax(predictions, axis=1)[0]

        return jsonify({'label': int(predicted_label)})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
