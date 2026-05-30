#!/bin/bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git build-essential

# Install PM2 globally
sudo npm install -g pm2
