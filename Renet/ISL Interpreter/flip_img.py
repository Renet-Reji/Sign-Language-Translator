import cv2
import os
import mediapipe as mp
import pandas as pd

# ===== SETTINGS =====
LABEL = "C"

IMAGE_PATH = r"ISL_Dataset\Images\C"
CSV_PATH = r"ISL_Dataset\landmarks.csv"
# ====================

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.7
)

if not os.path.exists(IMAGE_PATH):
    print("Folder does not exist!")
    exit()

# 🔥 Only original images (no flip_)
original_files = [
    f for f in os.listdir(IMAGE_PATH)
    if f.endswith(".jpg") and not f.startswith("flip_")
]

# Get total files for safe numbering
all_files = [f for f in os.listdir(IMAGE_PATH) if f.endswith(".jpg")]
start_index = len(all_files)

data = []
new_count = 0

for file in original_files:
    img_path = os.path.join(IMAGE_PATH, file)
    image = cv2.imread(img_path)

    if image is None:
        continue

    flipped = cv2.flip(image, 1)

    new_filename = f"flip_{start_index + new_count}.jpg"
    save_path = os.path.join(IMAGE_PATH, new_filename)
    cv2.imwrite(save_path, flipped)

    rgb = cv2.cvtColor(flipped, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        all_landmarks = []

        for hand_landmarks in results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                all_landmarks.extend([lm.x, lm.y, lm.z])

        while len(all_landmarks) < 126:
            all_landmarks.append(0)

        all_landmarks.append(LABEL)
        data.append(all_landmarks)

    new_count += 1

print(f"Created {new_count} flipped images safely")

columns = [f"f{i}" for i in range(126)]
columns.append("label")

df = pd.DataFrame(data, columns=columns)

if os.path.exists(CSV_PATH):
    df.to_csv(CSV_PATH, mode='a', header=False, index=False)
else:
    df.to_csv(CSV_PATH, index=False)

print("Landmarks appended successfully!")