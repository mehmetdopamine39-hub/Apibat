@echo off
cd /d "%~dp0"
echo Paketler Yukleniyor, Lutfen Bekleyiniz...
npm install express-rate-limit axios crc-32 crypto jsdom dotenv mysql
echo.
echo Yukleme Tamamlandi!
pause