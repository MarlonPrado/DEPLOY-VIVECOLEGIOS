#!/bin/sh
sudo git pull origin main
sudo yarn install
sudo yarn run build
sudo pm2 restart all
sleep 30
sudo pm2 restart gateway