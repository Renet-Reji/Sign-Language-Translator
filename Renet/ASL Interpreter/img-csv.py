import os
import cv2
import csv
import mediapipe as mp

# MediaPipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True)

def extract_landmarks(hand_landmarks):
    data = []
    for lm in hand_landmarks.landmark:
        data.extend([lm.x, lm.y, lm.z])
    return data

DATASET_DIR = r"D:\Coding Projects\ASL Interpreter\Dataset 2\asl_alphabet_train"# or absolute path
OUTPUT_FILE = r"D:\Coding Projects\ASL Interpreter\asl_dataset.csv"

with open(OUTPUT_FILE, "w", newline="") as f:
    writer = csv.writer(f)

    for label in sorted(os.listdir(DATASET_DIR)):
        label_path = os.path.join(DATASET_DIR, label)

        # ✅ process only folders (A, B, 0, 1, etc.)
        if not os.path.isdir(label_path):
            continue

        print(f"Processing label: {label}")

        for img_name in os.listdir(label_path):
            img_path = os.path.join(label_path, img_name)

            image = cv2.imread(img_path)
            if image is None:
                continue

            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    row = extract_landmarks(hand_landmarks)
                    writer.writerow(row + [label])

print("Letters + numbers dataset converted to CSV")
