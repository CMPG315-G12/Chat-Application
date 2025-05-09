@echo off
echo Killing all Electron processes...
taskkill /F /IM electron.exe /T
taskkill /F /IM client.exe /T
echo Done.