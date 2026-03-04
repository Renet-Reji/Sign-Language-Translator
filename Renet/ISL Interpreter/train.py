import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.svm import SVC

# -----------------------------------
# Load Dataset
# -----------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "isl_dataset.csv")

df = pd.read_csv(DATA_PATH)

# Features and Labels
X = df.iloc[:, :-1].values
y = df.iloc[:, -1].astype(str).values  # Ensure all labels are strings

# -----------------------------------
# Encode Labels
# -----------------------------------
encoder = LabelEncoder()
y = encoder.fit_transform(y)

# -----------------------------------
# Scale Features
# -----------------------------------
scaler = StandardScaler()
X = scaler.fit_transform(X)

# -----------------------------------
# Train/Test Split (Stratified)
# -----------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -----------------------------------
# Train SVM
# -----------------------------------
model = SVC(
    kernel="linear",
    probability=True
)

model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# -----------------------------------
# Save Model Files
# -----------------------------------
joblib.dump(model, os.path.join(BASE_DIR, "isl_model.pkl"))
joblib.dump(encoder, os.path.join(BASE_DIR, "label_encoder.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "scaler.pkl"))

print("✅ Model, encoder, and scaler saved successfully.")
