import os, base64, cv2
import numpy as np

def convert_base64_str_to_cv2_image(base64_str):
    encoded_data = base64_str.split(',')[1]
    np_arr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

def improve_image_quality(image, model):
    model_name = model[:-6].lower()
    dnn_sr = cv2.dnn_superres.DnnSuperResImpl_create()
    dnn_sr.readModel('./models/' + model)
    dnn_sr.setModel(model_name, 4)
    upscaled = dnn_sr.upsample(image)
    return upscaled

def face_and_eyes_detection(input):
    # Import modules
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
    eyes_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')
    # Load image
    for model in os.listdir('./models/'):
        img = cv2.imread(input)
        if img is None:
            img = convert_base64_str_to_cv2_image(input)
        # Improve image quality
        upscaled = improve_image_quality(img, model)
        # Convert to grayscale
        gray = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
        # Detect faces
        faces = face_cascade.detectMultiScale(gray,1.3,5)
        # When face is not detected, try other models. If detectable, then just keep going
        # When failed to detect, "faces" will return ()
        # When detected successfully, "faces" will return something like this [[12,174,231,98]]
        # It will pop the error about the shape, between () and [[]], that's why we use try & except to avoid that
        # We'll do the same for eyes below
        try:
            if faces == ():
                continue
        except:
            pass
        for (x,y,w,h) in faces:
            cv2.rectangle(upscaled, (x,y), (x+w,y+h), (255,0,0), 2)
            roi_gray = gray[y:y+h,x:x+w]
            roi_color = upscaled[y:y+h,x:x+w]
            # In each face, detect eyes
            eyes = eyes_cascade.detectMultiScale(roi_gray,1.3,5)
            # If eyes give (), then len(eyes) cannot be executed
            try:
                if eyes == ():
                    continue
            except:
                pass
        if len(eyes) >= 2:
            return roi_color
    # Sometimes, you can witness that the image is just literally clear but the model still can't detect face and the eyes
    # This issue originates from the algorithms for detecting faces and eyes, which we're implementing
    # Since we only use some DL algorithms provided by opencv, our performance depends partly on them
    return 'Cannot detect'