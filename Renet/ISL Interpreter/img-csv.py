import os
import cv2
import csv
import mediapipe as mp
import os


# ----------------------------
# MediaPipe Setup
# ----------------------------
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.6
)

# ----------------------------
# Landmark Extraction (Normalized)
# ----------------------------
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
    
    return data  # 63 features


# ----------------------------
# Paths
# ----------------------------
DATASET_DIR = r"D:\Coding Projects\Sign-Language-Translator\Renet\ISL Interpreter\dataset\Indian"
OUTPUT_FILE = r"D:\Coding Projects\Sign-Language-Translator\Renet\ISL Interpreter\isl_dataset.csv"
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)


# ----------------------------
# Create CSV Header
# ----------------------------
header = []
for hand in range(2):
    for i in range(21):
        header.extend([
            f'hand{hand+1}_x{i}',
            f'hand{hand+1}_y{i}',
            f'hand{hand+1}_z{i}'
        ])
header.append("label")


# ----------------------------
# Convert Images to CSV
# ----------------------------
with open(OUTPUT_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)

    for label in sorted(os.listdir(DATASET_DIR)):
        label_path = os.path.join(DATASET_DIR, label)

        if not os.path.isdir(label_path):
            continue

        print(f"Processing label: {label}")

        for img_name in os.listdir(label_path):
            
            if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue

            img_path = os.path.join(label_path, img_name)
            image = cv2.imread(img_path)

            if image is None:
                continue

            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb)

            if results.multi_hand_landmarks:
                row = []

                for hand_landmarks in results.multi_hand_landmarks:
                    row.extend(extract_landmarks(hand_landmarks))

                # If only 1 hand detected → pad second hand
                if len(results.multi_hand_landmarks) == 1:
                    row.extend([0] * 63)

                writer.writerow(row + [label])

print("✅ Dataset successfully converted to CSV")
hands.close()
