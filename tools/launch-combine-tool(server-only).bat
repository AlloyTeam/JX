@echo off
taskkill /FI "WINDOWTITLE eq JX Server" /IM "node.exe"
echo launch nodejs ...
start "JX server" ".\compile\node.exe" ".\combine\server.js"
echo done