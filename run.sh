#!/bin/bash

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

function create_docker_network() {
    echo "Checking eii docker network.."
    docker_networks=$(docker network ls --filter name=eii| awk '{print $2}')
    docker_net_list=(`echo ${docker_networks}`);
    network_present=false
    for dn in "${docker_net_list[@]}"
    do
        if [[ "$dn" = "eii" ]];then
            network_present=true
            break
        fi
    done
    if [[ "$network_present" = false ]]; then
        echo "Creating eii docker bridge network as it is not present.."
        docker network create eii
    fi
}

function sourceEnv() {
    set -a
    source ../build/.env
    if [ "$HOST_IP" == "" ];then
        echo "HOST_IP is not set. Have you run the backend?"
        exit
    fi
    set +a
}

function setupHost() {
    sudo mkdir -p $EII_INSTALL_PATH/tools_output/deployment-tool-fe && \
    sudo chown -R $EII_UID $EII_INSTALL_PATH/tools_output/deployment-tool-fe && \
    sudo chmod u+rw -R $EII_INSTALL_PATH/tools_output/deployment-tool-fe && \
    create_docker_network
    if [ -d ../DeploymentToolBackend/certificates ];then
        sudo cp -rf ../DeploymentToolBackend/certificates .
        sudo chmod -R a+r ./certificates
    else
        echo "Could not find certificates in DeploymentToolBackend directory. Please build the backend first!"
        exit
    fi
}

sourceEnv

if [ "$1" ==  "--build" -o "$1" == "-b" ]; then
    docker-compose down && \
    setupHost && \
    docker-compose build $2 && \
    docker-compose up -d
elif [ "$1" ==  "--restart" -o "$1" == "-r" ]; then
    docker-compose down && \
    docker-compose up -d
elif [ "$1" ==  "--down" -o "$1" == "-d" ]; then
    docker-compose down
elif [ "$1" != "" ]; then
    echo "Error: unexpected param: $1"
    exit 
else
    docker-compose up -d
fi
