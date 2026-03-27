import os
import cv2

dataset_path = r"D:\Coding Projects\ASL Main\Sign-Language-Translator\server\Dataset"

valid_ext = (".jpg", ".jpeg", ".png")

total_files = 0
processed = 0
saved = 0

print("🔍 Starting scan...\n")

if not os.path.exists(dataset_path):
    print("❌ ERROR: Path does not exist!")
    exit()

for root, dirs, files in os.walk(dataset_path):
    print(f"\n📂 Folder: {root}")
    print(f"   Files found: {len(files)}")

    for file in files:
        total_files += 1

        if not file.lower().endswith(valid_ext):
            continue

        if "_flipH" in file:
            continue

        img_path = os.path.join(root, file)
        print(f"➡️ Processing: {img_path}")

        img = cv2.imread(img_path)

        if img is None:
            print("❌ Could not read image!")
            continue

        processed += 1

        # Mirror flip
        flipped = cv2.flip(img, 1)

        name, ext = os.path.splitext(file)
        save_path = os.path.join(root, f"{name}_flipH{ext}")

        success = cv2.imwrite(save_path, flipped)

        if success:
            print(f"✅ Saved: {save_path}")
            saved += 1
        else:
            print("❌ Failed to save!")

print("\n======================")
print(f"Total files seen: {total_files}")
print(f"Images processed: {processed}")
print(f"Images saved: {saved}")
print("======================")