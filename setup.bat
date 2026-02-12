@echo off

echo Creating Viritual Environment.....
@REM python -m venv signvenv

echo.
echo Activating Viritual Environment 
@REM call signvenv\Scripts\activate  

echo.
echo Installing Dependencies 
@REM pip install -r requirements.txt
echo Dependencies installed successfully 

echo. 
echo Running project 
python app.py