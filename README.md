# Sign-Language-Translator

## How to Execute 

### Step 1 

- Clone the Repository and change directory  

```bash
git clone https://github.com/Renet-Reji/Sign-Language-Translator.git

cd Sign-Language-Translator
```

### Step 2

-  Setup python viritual environment

```bash 
python -m venv signenv
```
### Step 3 

- Activate your env 

```bash 
signenv\Scripts\activate
```

### Step 4

- Installations 

```bash
pip install opencv-python mediapipe==0.10.10 numpy pandas scikit-learn
```

### Step 5 

- Run the test.py

```bash 
python test.py
```

- If model is not trained, **Add Dataset** in **Dataset** folder run train.py

```bash 
python train.py
``` 