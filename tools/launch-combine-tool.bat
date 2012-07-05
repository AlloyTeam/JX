@echo off
set xp_chrome="%userprofile%\Local Settings\Application Data\Google\Chrome\Application\Chrome.exe"
set win7_chrome="%localAppdata%\Google\Chrome\Application\chrome.exe"
echo launch nodejs ...
start "JX server" ".\compile\node.exe" ".\combine\server.js"
echo open configuration page ...
if exist %xp_chrome% (
	start "" %xp_chrome% "%cd%\combine\index.html"
) else if exist %win7_chrome% (
	start "" %win7_chrome% "%cd%\combine\index.html"
) else (
	start "" "%cd%\combine\index.html"
)
echo done