# ==========================================================
# 🧠 FINAL TRAINING SCRIPT
# ==========================================================
# Steps:
# 1. Load RAW dataset
# 2. Apply feature engineering
# 3. Encode labels
# 4. Train SVM with Pipeline
# 5. Tune hyperparameters
# 6. Save final model
# ==========================================================

import pandas as pd
import pickle
import numpy as np

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.metrics import classification_report

from features import compute_features

# ----------------------------------------------------------
# Load RAW dataset (63 features only)
# ----------------------------------------------------------
data = pd.read_csv(r"Sign-Language-Translator\Renet\ASL Interpreter\asl_dataset.csv", header=None)

X_raw = data.iloc[:, :-1].values
y = data.iloc[:, -1].values

# ----------------------------------------------------------
# Encode string labels into integers
# Example:
# A → 0
# B → 1
# ...
# ----------------------------------------------------------
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# ----------------------------------------------------------
# Apply feature engineering
# Converts 63 → engineered feature vector
# ----------------------------------------------------------
X = compute_features(X_raw)

print("Training feature count:", X.shape[1])

# ----------------------------------------------------------
# Split dataset
# Stratify ensures equal class distribution
# ----------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2,
    stratify=y,
    random_state=42
)

# ----------------------------------------------------------
# Build Pipeline:
# StandardScaler + SVM
# ----------------------------------------------------------
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC(probability=True))
])

# ----------------------------------------------------------
# Hyperparameter tuning
# ----------------------------------------------------------
param_grid = {
    'svm__C': [1,5,10],
    'svm__gamma': ['scale',0.1,0.01]
}

grid = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1)
grid.fit(X_train, y_train)

model = grid.best_estimator_

# ----------------------------------------------------------
# Evaluate
# ----------------------------------------------------------
print(classification_report(y_test, model.predict(X_test)))

# ----------------------------------------------------------
# Save model
# ----------------------------------------------------------
with open("asl_svm_model.pkl", "wb") as f:
    pickle.dump((model, label_encoder), f)

print("✅ Model saved successfully")
