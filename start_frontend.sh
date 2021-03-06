#!/bin/sh

# Copyright (c) 2021 Intel Corporation.

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

mkdir -p /app/node_modules/.cache
cd /app
rm -rf ./src && cp -r /files/src .
rm -rf ./public && cp -r /files/public .
cp /files/package.json .
npm config set update-notifier false
npm install
echo "REACT_APP_"$(env | grep 'EII_VERSION') > /app/.env
echo "REACT_APP_"$(env | grep 'DOCKER_REGISTRY') >> /app/.env
if [ "$dev_mode" != "true" ]; then
    CHOKIDAR_USEPOLLING=true HTTPS=true SSL_CRT_FILE=/run/secrets/cert SSL_KEY_FILE=/run/secrets/key npm start
else
    CHOKIDAR_USEPOLLING=true npm start
fi
