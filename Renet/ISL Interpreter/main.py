import os
import cv2
import numpy as np
import mediapipe as mp
import joblib

# -----------------------------------
# Load Model Files
# -----------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "isl_model.pkl"))
encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

# -----------------------------------
# MediaPipe Setup
# -----------------------------------
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7
)

def extract_landmarks(hand_landmarks):
    data = []
    base_x = hand_landmarks.landmark[0].x
    base_y = hand_landmarks.landmark[0].y
    base_z = hand_landmarks.landmark[0].z

    for lm in hand_landmarks.landmark:
        data.extend([
            lm.x - base_x,
            lm.y - base_y,
            lm.z - base_z
        ])
    return data  # 63 features per hand


# -----------------------------------
# Start Webcam
# -----------------------------------
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        row = []

        for hand_landmarks in results.multi_hand_landmarks:
            row.extend(extract_landmarks(hand_landmarks))

        # Pad if only 1 hand detected
        if len(results.multi_hand_landmarks) == 1:
            row.extend([0] * 63)

        row = np.array(row).reshape(1, -1)

        # Scale features
        row = scaler.transform(row)

        # Predict
        prediction = model.predict(row)
        probabilities = model.predict_proba(row)
        confidence = np.max(probabilities)

        label = encoder.inverse_transform(prediction)[0]

        # Display only if confident
        if confidence > 0.75:
            cv2.putText(
                frame,
                f"{label} ({confidence:.2f})",
                (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

        # Draw landmarks
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS
            )

    cv2.imshow("ISL Interpreter", frame)

    # Press ESC to exit
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
