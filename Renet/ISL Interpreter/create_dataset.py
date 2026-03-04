import cv2
import os
import mediapipe as mp
import pandas as pd
import random
import time

# ================= SETTINGS =================
LABEL = input("Enter Sign Label: ")
TOTAL_SAMPLES = 1500
REQUIRE_TWO_HANDS = False   # Change to True if both hands mandatory
DATASET_PATH = "ISL_Dataset"
IMAGE_PATH = os.path.join(DATASET_PATH, "Images", LABEL)
CSV_PATH = os.path.join(DATASET_PATH, "landmarks.csv")
# ============================================

os.makedirs(IMAGE_PATH, exist_ok=True)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

cap = cv2.VideoCapture(0)
count = 0
data = []

print("Press 'S' to start...")

# ===== WAIT FOR START KEY =====
while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)

    cv2.putText(frame, "Press S to Start",
                (120, 240),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2)

    cv2.imshow("ISL Collector", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):
        break
    if key == ord('q'):
        cap.release()
        cv2.destroyAllWindows()
        exit()

# ===== 3 SECOND COUNTDOWN (ONLY ONCE) =====
for i in range(3, 0, -1):
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)

    cv2.putText(frame, str(i),
                (300, 250),
                cv2.FONT_HERSHEY_SIMPLEX,
                5,
                (0, 0, 255),
                10)

    cv2.imshow("ISL Collector", frame)
    cv2.waitKey(1000)

print("Capturing Started...")

# ===== FAST CONTINUOUS CAPTURE =====
while count < TOTAL_SAMPLES:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:

        # Optional: require both hands
        if REQUIRE_TWO_HANDS and len(results.multi_hand_landmarks) < 2:
            continue

        all_landmarks = []
        h, w, _ = frame.shape
        x_min, y_min = w, h
        x_max, y_max = 0, 0

        for hand_landmarks in results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                all_landmarks.extend([lm.x, lm.y, lm.z])

                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)

        # Pad to 126 features
        while len(all_landmarks) < 126:
            all_landmarks.append(0)

        # Safe crop
        x_min = max(0, x_min - 20)
        y_min = max(0, y_min - 20)
        x_max = min(w, x_max + 20)
        y_max = min(h, y_max + 20)

        cropped = frame[y_min:y_max, x_min:x_max]

        if cropped.size != 0:

            # Random brightness
            brightness = random.randint(-30, 30)
            cropped = cv2.convertScaleAbs(cropped, alpha=1, beta=brightness)

            img_name = os.path.join(IMAGE_PATH, f"{count}.jpg")
            cv2.imwrite(img_name, cropped)

            all_landmarks.append(LABEL)
            data.append(all_landmarks)

            count += 1
            print(f"{count}/{TOTAL_SAMPLES}")

    cv2.putText(frame, f"{count}/{TOTAL_SAMPLES}",
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2)

    cv2.imshow("ISL Collector", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# ===== SAVE CSV =====
columns = [f"f{i}" for i in range(126)]
columns.append("label")

df = pd.DataFrame(data, columns=columns)

if os.path.exists(CSV_PATH):
    df.to_csv(CSV_PATH, mode='a', header=False, index=False)
else:
    df.to_csv(CSV_PATH, index=False)

print("Dataset Collection Complete!")