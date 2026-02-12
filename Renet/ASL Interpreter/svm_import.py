import pickle

with open("asl_svm_model.pkl", "rb") as f:
    model, scaler = pickle.load(f)
