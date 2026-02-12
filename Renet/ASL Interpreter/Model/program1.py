# ==========================================================
# 🎥 FINAL REAL-TIME ASL INTERPRETER
# ==========================================================
# Includes:
# - Feature engineering
# - Pipeline scaling
# - Confidence filtering
# - Majority voting
# - Basic Z motion detection
# ==========================================================

import cv2
import mediapipe as mp
import pickle
import numpy as np
from collections import deque, Counter
from features import compute_features

# ----------------------------------------------------------
# Load trained model
# ----------------------------------------------------------
with open("asl_svm_model.pkl", "rb") as f:
    model, label_encoder = pickle.load(f)

print("Model expects:", model.named_steps['scaler'].n_features_in_)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

# Buffer stores last 15 predictions
buffer = deque(maxlen=15)

# Store index finger path (for Z detection)
index_path = deque(maxlen=20)

while True:

    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame,1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    final_label = "No Hand"

    if results.multi_hand_landmarks:

        hand = results.multi_hand_landmarks[0]
        mp_draw.draw_landmarks(frame, hand, mp_hands.HAND_CONNECTIONS)

        # Extract raw landmarks
        raw = []
        for lm in hand.landmark:
            raw.extend([lm.x, lm.y, lm.z])
        raw = np.array(raw)

        # Track index fingertip
        index_path.append((hand.landmark[8].x, hand.landmark[8].y))

        # Feature engineering
        X = compute_features(raw)

        # Predict probabilities
        probs = model.predict_proba(X)
        confidence = np.max(probs)

        # Confidence filtering
        if confidence > 0.80:

            pred = model.predict(X)[0]
            buffer.append(pred)

            # Majority vote smoothing
            final_pred = Counter(buffer).most_common(1)[0][0]
            final_label = label_encoder.inverse_transform([final_pred])[0]

        else:
            final_label = "Unknown"

        # Simple motion-based Z detection
        if len(index_path) > 15:
            dx = index_path[-1][0] - index_path[0][0]
            dy = index_path[-1][1] - index_path[0][1]

            if abs(dx) > 0.15 and abs(dy) > 0.15:
                final_label = "Z"

    cv2.putText(frame,
                f"Prediction: {final_label}",
                (20,50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,0),
                2)

    cv2.imshow("ASL Final System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
hands.close()
