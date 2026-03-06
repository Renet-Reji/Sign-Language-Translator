# Sign-Language-Translator

## How to run project 

### Step 1 

- Clone the Repository and change directory  

```bash
git clone https://github.com/Renet-Reji/Sign-Language-Translator.git

cd Sign-Language-Translator
```

### Step 2

- Open `Command Prompt` in parent folder and run this command

```bash 
setup.bat
```

- Or double click `setup.bat` file 
- After installing all dependencies app.py will be run automatically 
- Open `http://127.0.0.1:5000` on your browser

---

## How to Train and Test Data

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

- Activate your venv 

```bash 
signenv\Scripts\activate
```

### Step 4

- Install Dependencies 

```bash
pip install -r requirements.txt
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