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
import axios from "axios";

const BuilderApi = {
  builder: function (
    services,
    instances,
    reset,
    dev_mode,
    successCallback,
    errorCallback)
  {
    if(services.length > 0) {
      if (services.indexOf("EtcdUI") == -1) {
        services.push("EtcdUI");
      }
      if (services.indexOf("ConfigMgrAgent") == -1) {
        services.push("ConfigMgrAgent");
      }
    }

    services = services.filter((el) => {
      return el != "";
    });

    let configData = {
      names: services,
      instance_count: instances,
      reset: reset,
      dev_mode: dev_mode,
    };
    axios.post("/eii/ui/config/generate", configData).then((response) => {
      if (response?.data?.status_info?.status) {
        let data = JSON.parse(response.data.data);
        successCallback(data, response);
      } else {
        errorCallback(response?.data);
      }
    });
  },
};
export default BuilderApi;
