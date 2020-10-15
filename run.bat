@echo off
start /WAIT cmd.exe /c npm i
for %%a in (*.red.js) do (
    node.exe "%%~nxa"
)
echo DONE!
goto :EOF