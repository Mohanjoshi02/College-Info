@echo off
echo ========================================
echo  Creating Desktop Shortcut
echo ========================================
echo.
echo This will create a shortcut on your desktop
echo to easily start the MIT ADT Portal server.
echo.
pause

set SCRIPT="%TEMP%\CreateShortcut.vbs"
set DESKTOP=%USERPROFILE%\Desktop

echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%DESKTOP%\MIT ADT Portal.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0START_SERVER.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "Start MIT ADT Smart Campus Portal" >> %SCRIPT%
echo oLink.IconLocation = "C:\Windows\System32\imageres.dll,1" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ========================================
echo  ✓ Shortcut created on Desktop!
echo ========================================
echo.
echo You can now double-click "MIT ADT Portal"
echo on your desktop to start the server!
echo.
pause