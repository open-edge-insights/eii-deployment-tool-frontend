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

# Dockerfile for EII Web UI Deplyment Tool Front-end

ARG EII_VERSION
ARG EII_UID
ARG EII_USER_NAME
ARG UBUNTU_IMAGE_VERSION
FROM ubuntu:$UBUNTU_IMAGE_VERSION as runtime

LABEL description="EII Web UI Deployment Tool Front-end Image"


WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nodejs \
    npm && \
    rm -rf /var/lib/apt/lists/*


USER root

ARG EII_UID
ARG EII_USER_NAME
RUN groupadd $EII_USER_NAME -g $EII_UID && \
    useradd -r -u $EII_UID -g $EII_USER_NAME $EII_USER_NAME

COPY . /files
ARG CMAKE_INSTALL_PREFIX

ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:${CMAKE_INSTALL_PREFIX}/lib \
    PATH=$PATH:/app/.local/bin

RUN mkdir -p /app && chown $EII_UID /app
RUN mkdir -p /home/$EII_USER_NAME && chown $EII_UID /home/$EII_USER_NAME
USER $EII_USER_NAME
ENV NO_UPDATE_NOTIFIER=true
HEALTHCHECK NONE
ENTRYPOINT ["/bin/sh", "/files/start_frontend.sh"]

