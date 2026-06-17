@echo off
setlocal
cd /d "%~dp0"
set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
    set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  )
)
echo Spoustim Archiv vyroku na http://localhost:4173
echo.
echo Pokud chcete skutecne zive vyhledavani a vytahy, nastavte pred spustenim:
echo set BRAVE_SEARCH_API_KEY=vas_klic
echo.
"%NODE_EXE%" server.mjs
