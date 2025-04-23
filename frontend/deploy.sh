#!/bin/sh
sudo git pull origin main
# sudo yarn install
# sudo yarn run build:prod
sudo rm -Rf /var/www/html/*
sudo cp -Rf dist/* /var/www/html/
