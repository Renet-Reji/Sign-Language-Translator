# ==========================================================
# 🖐️ DATASET CONVERSION SCRIPT
# ==========================================================
# PURPOSE:
# Convert ASL image dataset into a CSV file containing:
# - 63 raw hand landmark values (21 landmarks × 3 coordinates)
# - 1 label column
#
# IMPORTANT:
# ❌ No feature engineering here
# ❌ No normalization here
# ✔ Keeps dataset clean and reusable
# ==========================================================

import os                    # Used to navigate folder structure
import cv2                   # Used to read images
import csv                   # Used to write CSV file
import mediapipe as mp       # Used to detect hand landmarks

# ----------------------------------------------------------
# Initialize MediaPipe Hands model
# ----------------------------------------------------------
# static_image_mode=True:
#   Each image is processed independently (good for dataset)
# max_num_hands=1:
#   Only detect one hand (ASL alphabet dataset)
# min_detection_confidence:
#   Only accept detection if confidence > 0.7
# ----------------------------------------------------------

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.7
)

# ----------------------------------------------------------
# Function to extract 21 (x, y, z) landmark coordinates
# MediaPipe provides normalized coordinates:
#   x, y are between 0 and 1
#   z is depth relative to wrist
# ----------------------------------------------------------
def extract_landmarks(hand_landmarks):
    data = []
    for lm in hand_landmarks.landmark:
        data.extend([lm.x, lm.y, lm.z])
    return data  # returns list of length 63


# ----------------------------------------------------------
# Define dataset location and output CSV location
# ----------------------------------------------------------
DATASET_DIR = r"Sign-Language-Translator\Renet\ASL Interpreter\asl_alphabet_train"
OUTPUT_FILE = r"Sign-Language-Translator\Renet\ASL Interpreter\asl_dataset.csv"

# ----------------------------------------------------------
# Create CSV file
# Each row format:
#   63 landmark values + 1 label
# ----------------------------------------------------------
with open(OUTPUT_FILE, "w", newline="") as f:

    writer = csv.writer(f)

    # Loop through each folder (A, B, C, ...)
    for label in sorted(os.listdir(DATASET_DIR)):

        label_path = os.path.join(DATASET_DIR, label)

        # Skip files that are not folders
        if not os.path.isdir(label_path):
            continue

        print("Processing:", label)

        # Loop through images inside that letter folder
        for img_name in os.listdir(label_path):

            img_path = os.path.join(label_path, img_name)

            image = cv2.imread(img_path)

            # Skip unreadable images
            if image is None:
                continue

            # Convert BGR → RGB (MediaPipe requirement)
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Detect hand
            results = hands.process(rgb)

            # If hand detected
            if results.multi_hand_landmarks:

                # Extract only first detected hand
                raw = extract_landmarks(results.multi_hand_landmarks[0])

                # Write row: [63 features] + label
                writer.writerow(raw + [label])

print("✅ RAW dataset created successfully")
