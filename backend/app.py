from unittest import result

from flask import Flask, jsonify, request
import numpy as np
import cv2
import base64
from flask_cors import CORS
from ultralytics import YOLO
import math
import time
from uuid import uuid4
from datetime import datetime

model = YOLO("runs/detect/runs/crater_detector/weights/best.pt") # Loading the trained YOLO model for crater detection

app = Flask(__name__)
CORS(app) # Enabling CORS for the Flask app to allow cross-origin requests from the frontend

@app.route("/detect", methods=["POST"])
def detecting_craters():

    # Raw image -> Bytes -> Numpy array -> OpenCV image

    if "image" not in request.files: # Checking if the key "image" is present in the uploaded files
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files["image"] # Accessing the uploaded file using the key "image"

    image_bytes = file.read() # Reading the file as bytes

    np_image = np.frombuffer(image_bytes, np.uint8) # Converting bytes to a numpy array
    cv_image = cv2.imdecode(np_image, cv2.IMREAD_COLOR) # Decoding the numpy array to an OpenCV image
    image_height, image_width = cv_image.shape[:2]

    # now we have (height, width, channels) in cv_image

    start_time = time.time()

    results = model(cv_image)

    processing_time = round(time.time() - start_time, 2)

    result = results[0] # Accessing the first result from the list of results returned by the YOLO model. This result contains the detected objects and their bounding boxes.
    analysis_id = f"LIP-{uuid4().hex[:8].upper()}"

    annotated_image = result.plot() # Plotting the detected objects on the original image. The annotated_image will contain the original image with bounding boxes drawn around the detected craters.
    # YOLO gives .plot() method to visualize the results on the image. It returns an image with bounding boxes drawn around the detected objects.

    jpg_image_annotated = cv2.imencode(".jpg", annotated_image)[1].tobytes() # Encoding the annotated image to JPEG format and converting it to bytes
    base64_image_annotated = base64.b64encode(jpg_image_annotated).decode("utf-8") # Encoding the JPEG bytes to base64 format for easy transmission over HTTP

    crater_diameters = [] # Initializing an empty list to store the average sizes of the detected bounding boxes

    for box in result.boxes: # Iterating over the detected bounding boxes in the result
        x1, y1, x2, y2 = box.xyxy[0] # Extracting the coordinates of the bounding box (top-left and bottom-right corners)
        width = x2 - x1 # Calculating the width of the bounding box
        height = y2 - y1 # Calculating the height of the bounding box
        estimated_diameter = (width + height) / 2 # Calculating the average size of the bounding box
        crater_diameters.append(estimated_diameter) # Appending the average size to the list

    median_diameter = (
    math.ceil(np.median(crater_diameters))
    if crater_diameters else 0)

    hazard_score = min(len(result.boxes) * 2, 100)

    if hazard_score < 30:
        hazard_level = "Low"
    elif hazard_score < 60:
        hazard_level = "Moderate"
    else:
        hazard_level = "High"

    summary = (
    f"{len(result.boxes)} craters were detected. "
    f"The average crater diameter is "
    f"{math.ceil(sum(crater_diameters)/len(crater_diameters)) if crater_diameters else 0}px. "
    f"The overall hazard level is {hazard_level}."
    )

    craters = []

    for i, box in enumerate(result.boxes):
        x1, y1, x2, y2 = box.xyxy[0]

        width = float(x2 - x1)
        height = float(y2 - y1)

        diameter = (width + height) / 2

        craters.append({
            "id": i + 1,
            "x": int((x1 + x2) / 2),
            "y": int((y1 + y2) / 2),
            "diameter": round(diameter, 2),
            "confidence": round(float(box.conf[0]), 2)
        })

    confidences = []

    for i, box in enumerate(result.boxes):
        confidence = round(float(box.conf[0]), 2)
        confidences.append(confidence)

    small = 0
    medium = 0
    large = 0
    for d in crater_diameters:
        if d < 60:
            small += 1
        elif d < 120:
            medium += 1
        else:
            large += 1

    return jsonify({

    "success": True,

    "analysis_id": analysis_id,

    "processing_info": {
        "planet": "Moon",
        "model": "YOLO11",
        "processing_time": f"{processing_time} sec",
        "analysis_date": datetime.now().isoformat()
    },

    "image_resolution": {
    "width": image_width,
    "height": image_height
    },

    "craters": craters,

    "images": {
        "annotated": base64_image_annotated,
    },

    "chart_data": {
    "diameters": [math.ceil(x) for x in crater_diameters]
    },

    "statistics": {
        "total_craters": len(result.boxes),
        "largest_crater_px": math.ceil(max(crater_diameters)) if crater_diameters else 0,
        "smallest_crater_px": math.ceil(min(crater_diameters)) if crater_diameters else 0,
        "average_crater_px": math.ceil(sum(crater_diameters)/len(crater_diameters)) if crater_diameters else 0,
        "median_crater_px": median_diameter
    },

    "hazard": {
        "score": hazard_score,
        "level": hazard_level
    },

    "size_distribution": {
    "small": small,
    "medium": medium,
    "large": large
    },

    "confidence": {
    "average": round(sum(confidences)/len(confidences), 2) if confidences else 0,
    "highest": max(confidences) if confidences else 0,
    "lowest": min(confidences) if confidences else 0,
    "values": confidences
    },

    "explainable_ai": {
        "summary": summary
    }

    })

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8600)
