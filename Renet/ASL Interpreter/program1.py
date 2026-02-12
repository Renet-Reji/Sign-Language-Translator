import cv2
import mediapipe as mp
import pickle

# Load trained model
with open("asl_svm_model.pkl", "rb") as f:
    model, scaler = pickle.load(f)

# MediaPipe Hands setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7
)
mp_drawing = mp.solutions.drawing_utils

def extract_landmarks(hand_landmarks):
    data = []
    for lm in hand_landmarks.landmark:
        data.extend([lm.x, lm.y, lm.z])
    return data

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) # Convert to RGB
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS
            )

            landmark_data = extract_landmarks(hand_landmarks)
            prediction = model.predict([landmark_data])[0]

            cv2.putText(
                frame,
                f"Prediction: {prediction}",
                (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 
                1,
                (0, 255, 0),
                2
            )# Display prediction

    cv2.imshow("ASL Interpreter", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
