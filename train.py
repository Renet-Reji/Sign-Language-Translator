# Train model 
import cv2 as cv
import os
import mediapipe as mp 
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import joblib

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
recognizer = cv.face.LBPHFaceRecognizer_create() 
database = 'Dataset' 

walk_result = list(os.walk(database))
dataY = walk_result[0][1]

folder = []
for item in walk_result : 
    folder_path = item[0]
    folder.append(folder_path) 

folder = folder[1:]
data = []
count = 0

for path in folder : 
    files = os.listdir(path) 
    label = os.path.split(path)[-1]

    for file in files :
        full_path = os.path.join(path, file)

        # conver to gray scale 
        image = cv.imread(full_path) 
        img_rgb = cv.cvtColor(image, cv.COLOR_BGR2RGB) 

        with mp_hands.Hands(static_image_mode=True, max_num_hands=1) as hands : 
            result = hands.process(img_rgb)
            
            if result.multi_hand_landmarks :                 
                for hand_landmarks in result.multi_hand_landmarks : 
                    row =[]

                    for lm in hand_landmarks.landmark : 
                        row.append(lm.x)
                        row.append(lm.y)

                    row.append(label) 
                    data.append(row)
    print(f'{label} processing completed')
    
print(data)

# Create columns and name 
columns = []
for i in range(21):
    columns += [f"x{i}", f"y{i}"]
columns.append("label")

df = pd.DataFrame(data=data, columns=columns) 

# Save to CSV 
os.makedirs('Model', exist_ok=True)
df.to_csv('Model/asl_data.csv', index=False) 
print('CSV Created as asl_data.csv')
# Load Data 
data = pd.read_csv('./Model/asl_data.csv')

# Encode the labels 
encoder = LabelEncoder() 
data['label'] = encoder.fit_transform(data['label'])

# Split features and target
X = data.drop('label', axis=1)
y = data['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, train_size=0.8, random_state=42 
)

# Train using SVC Model 
model = SVC(kernel='rbf', probability=True) 
model.fit(X_train, y_train) 
print('Model is trained') 

# Check accuracy 
accuracy = model.score(X_test, y_test) 
print(f'Accuracy: {accuracy * 100}%') 

# Save the model 
joblib.dump(model, 'Model/asl_model.pkl')
joblib.dump(encoder, 'Model/label_encoder.pkl')

print('Model and encoder saved!')