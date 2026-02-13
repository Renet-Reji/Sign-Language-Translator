# Test Model 
import cv2 as cv 
import mediapipe as mp 
import joblib
import pandas as pd
model = joblib.load('./Model/asl_model2.pkl')
encoder = joblib.load('./Model/label_encoder2.pkl')
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
cam = cv.VideoCapture(0) 

with mp_hands.Hands(max_num_hands=1) as hands : 
    while True : 
        ret, frame = cam.read() 
        # frame = cv.flip(frame, 1) 

        frame = cv.cvtColor(frame, cv.COLOR_RGB2BGR)
        result = hands.process(frame)  
        frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)

        if result.multi_hand_landmarks : 
            for hand_landmarks in result.multi_hand_landmarks : 
                data = []

                for lm in hand_landmarks.landmark : 
                    data.append(lm.x) 
                    data.append(lm.y) 
                
                input_data = pd.DataFrame([data], columns=model.feature_names_in_) 
                prediction = model.predict(input_data)[0]
                sign = encoder.inverse_transform([prediction])[0]
                
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                cv.putText(frame, sign, (50, 100), cv.FONT_HERSHEY_COMPLEX, 2, (0, 255, 0), thickness=2)
        
        cv.imshow('Cam', frame) 
        if cv.waitKey(1) == ord('q') : 
            cam.release() 
            cv.destroyAllWindows() 
            break 