@echo off
echo ========================================
echo  MIT ADT Smart Campus Portal
echo  Opening Images Folder...
echo ========================================
echo.
echo This folder is where you need to save
echo the 6 campus images:
echo.
echo   campus-1.jpg
echo   campus-2.jpg
echo   campus-3.jpg
echo   campus-4.jpg
echo   campus-5.jpg
echo   campus-6.jpg
echo.
echo See HOW_TO_ADD_IMAGES.txt for details
echo ========================================
echo.
pause
start explorer "%~dp0public\images"