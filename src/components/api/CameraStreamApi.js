/* Copyright (c) 2021 Intel Corporation.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export async function startCamera(cameraConfig) {
  return fetch("/eii/ui/camera/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      cameraConfig
    ),
  })
    .then((data) => data.json())
    .then(function (data) {
      if (data.status_info.status) {
        return data;
      } else {
        console.log("Error while starting camera: " + data.status_info.error_detail);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function stopCamera(cameraConfig) {
  return fetch("/eii/ui/camera/stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cameraConfig),
  })
    .then((data) => data.json())
    .then(function (data) {
      if (data.status_info.status) {
        return data;
      } else {
        console.log("Error while stopping camera: " + data.status_info.error_detail);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getCameraStatus(cameraConfig) {
  return fetch("/eii/ui/camera/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cameraConfig),
  })
    .then((data) => data.json())
    .then(function (data) {
      if (data.status_info.status) {
        return data;
      } else {
        console.log("Error while getting camera status: " + data.status_info.error_detail);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

