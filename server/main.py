from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import cv2, joblib, json
import numpy as np
from wavelet import w2d
from util import face_and_eyes_detection
import uvicorn
import tensorflow as tf

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/')
def image_classification(base64_str):
    # Load artifacts
    cnn_model = load_cnn_model()
    name_index_dict = load_name_index_dict()

    # Detect face and eyes
    cropped_face = face_and_eyes_detection(base64_str)

    if type(cropped_face) == str:
        return cropped_face

    # Extract useful features
    transformed_img = w2d(cropped_face, 'db1', 5)

    # Resize original and transformed images
    scaled_raw_img = cv2.resize(cropped_face, (32,32))
    scaled_transformed_img = cv2.resize(transformed_img, (32,32))

    # Stack them vertically
    combined_img = np.vstack((scaled_raw_img.reshape(32*32*3,1), scaled_transformed_img.reshape(32*32,1)))

    # Transform the image into 4d numpy array
    input = np.array(combined_img).reshape(1,64,64,1)

    # Use cnn model to identify the image
    scores = cnn_model.predict(input)

    # Format the output
    score_dict = {}
    for (idx1, idx2), score in np.ndenumerate(scores):
        name = name_index_dict[idx2]
        score_dict[name] = round(float(score), 2)
        
    # Return the output
    return score_dict

def load_cnn_model():
    cnn_model = tf.keras.models.load_model('./artifacts/cnn_model.h5')
    return cnn_model

def load_name_index_dict():
    with open('./artifacts/name_dict.json', 'r') as file:
        name_dict = json.load(file)
        name_index_dict = {v:k for (k,v) in name_dict.items()}
    return name_index_dict

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)