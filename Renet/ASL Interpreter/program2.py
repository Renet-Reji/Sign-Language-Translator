import os
import cv2
import csv
import mediapipe as mp

# MediaPipe Hands setup (IMPORTANT CHANGES HERE)
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.3,  # LOWERED
    model_complexity=0      # ADDED FOR MORE TOLERANCE FOR VARIED IMAGES
)
    

def extract_landmarks(hand_landmarks):
    data = []
    for lm in hand_landmarks.landmark:
        data.extend([lm.x, lm.y, lm.z])
    return data

DATASET_DIR = r"D:\Coding Projects\ASL Interpreter\asl_alphabet_train"
OUTPUT_FILE = r"D:\Coding Projects\ASL Interpreter\asl_dataset.csv"

written = 0
skipped = 0

with open(OUTPUT_FILE, "w", newline="") as f:
    writer = csv.writer(f)

    for label in sorted(os.listdir(DATASET_DIR)):
        label_path = os.path.join(DATASET_DIR, label)

        if not os.path.isdir(label_path):
            continue

        print(f"\nProcessing label: {label}")

        for img_name in os.listdir(label_path):
            img_path = os.path.join(label_path, img_name)

            image = cv2.imread(img_path)
            if image is None:
                skipped += 1
                continue

            # 🔹 RESIZE IMAGE (CRITICAL)
            image = cv2.resize(image, (640, 480))

            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb)

            if results.multi_hand_landmarks:
                hand_landmarks = results.multi_hand_landmarks[0]
                row = extract_landmarks(hand_landmarks)
                writer.writerow(row + [label])
                written += 1
            else:
                skipped += 1

print("\n✅ Conversion complete")
print("Rows written:", written)
print("Images skipped:", skipped)

hands.close()
