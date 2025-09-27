from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import face_recognition
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load criminal images
criminals_path = "criminals/"
criminal_encodings = []
criminal_names = []

for file in os.listdir(criminals_path):
    if file.endswith(("jpg", "png", "jpeg")):
        image = face_recognition.load_image_file(os.path.join(criminals_path, file))
        encoding = face_recognition.face_encodings(image)
        if encoding:
            criminal_encodings.append(encoding[0])
            criminal_names.append(os.path.splitext(file)[0])

@app.route('/detect', methods=['POST'])
def detect():
    try:
        file = request.files.get('image')
        if file is None:
            return jsonify({"error": "No image received"}), 400
        
        print("Received an image for processing...")

        image = face_recognition.load_image_file(file)

        # Detect faces
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        if not face_encodings:
            print("No faces detected in the image.")
            return jsonify({"faces": []})  # No faces found

        results = []
        for encoding, location in zip(face_encodings, face_locations):
            matches = face_recognition.compare_faces(criminal_encodings, encoding, tolerance=0.6)
            name = "Unknown"
            color = "green"

            if True in matches:
                match_index = np.argmin(face_recognition.face_distance(criminal_encodings, encoding))
                name = criminal_names[match_index]
                color = "red"

            results.append({"name": name, "location": location, "color": color})

        print(f"Detected: {results}")
        return jsonify({"faces": results})

    except Exception as e:
        print(f"Error in detect(): {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
