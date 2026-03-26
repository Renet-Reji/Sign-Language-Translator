from flask import Flask, request, jsonify
import joblib 
import pandas as pd
from flask_cors import CORS

app = Flask(__name__) 
CORS(app)

model = joblib.load('./Model/asl_model3.pkl')
encoder = joblib.load('./Model/label_encoder3.pkl')

@app.route('/')
def home() : 
    return 'Hello world'

@app.route('/predict', methods=['post'])
def predict() : 
    data = request.json['landmarks']    
    input_data = pd.DataFrame([data], columns=model.feature_names_in_)
    prediction = model.predict(input_data)[0]
    sign = encoder.inverse_transform([prediction])[0]

    return jsonify({'prediction': str(sign)})


if __name__ == '__main__' : 
    app.run(debug=True) 