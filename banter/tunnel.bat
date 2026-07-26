@echo off
REM ---------------------------------------------------------------------------
REM Banter — quick public tunnel for testing on your phone / with friends.
REM
REM 1) Install ngrok (https://ngrok.com) and make sure "ngrok" is on your PATH.
REM 2) Your .env.local must have LLM_PROVIDER + key set.
REM 3) Double-click this file. Keep BOTH windows open while testing.
REM
REM The ngrok URL (https://xxxx.ngrok.io) is a real public HTTPS link you can
REM send to anyone. It works as long as your PC is on and this is running.
REM For a permanent always-on link, deploy (see DEPLOY.md) instead.
REM ---------------------------------------------------------------------------

echo Starting Banter dev server in a new window...
start "Banter Dev" cmd /k "npm run dev"

echo Waiting for the dev server to boot...
timeout /t 6 >nul

echo.
echo Starting ngrok tunnel...
echo Share the https://....ngrok.io link that appears below.
echo.
ngrok http 3000

pause
