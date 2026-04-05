@echo off
echo ============================================
echo   Liena Q Perez Yacht Listings — Setup
echo   Pure JS / No native build tools needed
echo ============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js not found. Please install from https://nodejs.org
  echo Download the LTS version and run this script again.
  pause
  exit /b 1
)

echo Node.js found:
node --version

echo.
echo Installing dependencies...
npm install

echo.
echo Copying environment file...
if not exist ".env.local" (
  copy ".env.local.example" ".env.local"
  echo .env.local created. Edit it with your email/SMTP settings.
) else (
  echo .env.local already exists.
)

echo.
echo ============================================
echo   SETUP COMPLETE!
echo ============================================
echo.
echo Next steps:
echo   1. Edit .env.local with your settings
echo   2. Run: npm run dev
echo   3. Open: http://localhost:3000
echo   4. Admin: http://localhost:3000/admin/login
echo      Username: liena
echo      Password: LienaQPerez2024!
echo.
echo IMPORTANT: Change the admin password after first login!
echo.
pause
