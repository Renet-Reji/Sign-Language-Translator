import pandas as pd
from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import numpy as np
import pickle

data = pd.read_csv("asl_dataset.csv", header=None)

X = data.iloc[:, :-1]
y = data.iloc[:, -1]

# Normalize landmarks (wrist-relative)
X = X.copy()
for i in range(21):
    X.iloc[:, i*3:(i+1)*3] -= X.iloc[:, 0:3].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = SVC(
    kernel='rbf',
    C=10,
    gamma='scale',
    random_state=42,
    probability=True
)

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


# model = RandomForestClassifier(
#     n_estimators=300,
#     max_depth=25,
#     min_samples_split=5,
#     random_state=42,
#     n_jobs=-1
# )

model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Model accuracy: {accuracy:.2f}")

with open("asl_svm_model.pkl", "wb") as f:
    pickle.dump((model, scaler), f)


print("✅ Model saved as asl_svm_model.pkl")