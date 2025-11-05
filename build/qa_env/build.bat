@echo off

echo "Cleaning..."
del /F /Q cms\app\webroot\css\*
del /F /Q cms\app\webroot\js\*

echo "Compiling JS (dev)..."
call node_modules\.bin\gulp compile_js

echo "Compile SCSS (dev)..."
call node_modules\.bin\gulp compile_css

docker build -f build\qa_env\Dockerfile -t sf/photosf-qa --no-cache .
