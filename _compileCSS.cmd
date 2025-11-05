if not exist "%1\config.rb" goto END
set orifld=%~dp0

cd %1
cd

call compass compile

cd %orifld%

:END
