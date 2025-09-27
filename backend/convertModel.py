from tensorflow.keras.models import load_model

# Load HDF5 model
model = load_model("deepfake_detector.h5")

# Save in TensorFlow's SavedModel format
model.save("deepfake_model")  # This creates a folder instead of .h5
