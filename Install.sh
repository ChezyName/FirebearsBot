#1/bin/bash
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

ARCH=$(uname -m)
ARCH_NAME=""
if [ "$ARCH" = "aarch64" ]; then
  ARCH_NAME="linuxarm64"
elif [ "$ARCH" = "armv7l" ]; then
  ARCH_NAME="linuxarm32"
elif [ "$ARCH" = "x86_64" ]; then
  ARCH_NAME="linuxx64"
else
  if [ "$#" -ne 1 ]; then
      echo "Can't determine current arch; please provide it (one of):"
      echo ""
      echo "- linuxarm32 (32-bit Linux ARM)"
      echo "- linuxarm64 (64-bit Linux ARM)"
      echo "- linuxx64   (64-bit Linux)"
      exit 1
  else
    echo "Can't detect arch (got $ARCH) -- using user-provided $1"
    ARCH_NAME=$1
  fi
fi

echo "Installing FIREBEARSBot for platform $ARCH_NAME"

echo "Installing Node.JS"
apt-get update
apt-get install --yes nodejs
echo "Installed Node.JS"

echo "Installing GIT"
apt-get update
apt-get install git
echo "Installed GIT"

echo "Download Firebears Bot"
git clone https://github.com/ChezyName/FirebearsBot ./
echo "Downloaded Firebears Bot"

echo "Installing UnZip"
apt-get update
apt-get install UnZip
echo "Installed UnZip"

echo "Extracting Firebears Bot"
unzip ./FirebearsBot-main.zip -d ./FirebearsBot
rm ./FirebearsBot-main.zip
echo "Extracted Firebears Bot"

echo "Installing PM2"
npm install pm2@latest -g

echo "Installed All Required Modules."

echo "Type API Keys For Discord & TBA 'The Blue Allience'"


echo "Installed PM2"
pm2 start ./FirebearsBot/index.js