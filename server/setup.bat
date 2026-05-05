@echo off

echo Creating Viritual Environment.....
python -m venv signvenv

echo.
echo Activating Viritual Environment 
call signvenv\Scripts\activate  

echo.
echo Installing Dependencies 
echo Please wait......
pip install -r requirements1.txt

echo.
echo Dependencies installed successfully 

pause

echo. 
echo Running project 
python server.py