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
import axios from 'axios';

const GetConfigApi={
    getconfig:function(services, successCallback, errorCallback){    
      let req = {};
      req["names"] = services;
      axios.post("/eii/ui/config/get", req)
      .then((response)=>{
        response.data.data = JSON.parse(response.data.data);
        console.log("=======Get-Config-Api=========");
        console.log(response.data);

        console.log("||||||||||||||Get-Config-Api=========");
        if(response && response.data) 
          successCallback(response.data);
        else
          errorCallback(null);
      })
      .catch((error)=>{
          console.log(error);
          errorCallback({"status": {"error": "Network error!"}});
      });
    }
}

export default GetConfigApi;