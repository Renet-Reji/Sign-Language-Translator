from flask import Flask, render_template, request, jsonify
import joblib

model = joblib.load('./Model/asl_model2.pkl')
encoder = joblib.load('./Model/label_encoder2.pkl')

app = Flask(__name__) 

@app.route('/') 
def home() : 
    return render_template('index.html')

@app.route('/predict', methods=['post'])
def predict() : 
    data = request.json['landmarks']
    prediction = model.predict([data])[0]
    sign = encoder.inverse_transform([prediction])[0]

    return jsonify({'prediction': str(sign)})

if __name__ == '__main__' : 
    app.run(debug=True) 