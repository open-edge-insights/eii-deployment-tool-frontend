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

import React, { useState } from "react";
import "./LoginScreen.css";
import Cookies from "universal-cookie";

async function loginUser(credentials) {
  const cookies = new Cookies();
  return fetch("/eii/ui/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then(data => data.json())    
    .then(function (data) {    
      if (data?.status_info?.status) {
        cookies.set("dt_session", JSON.parse(data.data));
        window.location.href = "/CreateProject";
      } else if(data?.detail?.length > 0) {
        alert(data.detail + ". Please try again");
      } else {
        alert("Error while interacting with backend");
      }
    })
    .catch((error) => {
      alert("Error: Couldn't connect to Backend!");
    });
}
const LoginScreen = () => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
  };
  let DisableLogin = false;
  DisableLogin = username && password ? false : true;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="signIn">Sign In</h3>

        <div className="col-sm-12 loginScreen">
          <div className="col-sm-12 row" style={{ marginBottom: 10 }}>
            <span className="col-sm-8">
              <input
                type="text"
                id="username"
                name="username"
                className="username"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </span>
          </div>
          <div className="col-sm-12 row" style={{ marginBottom: 10 }}>
            <span className="col-sm-8">
              <input
                type="password"
                id="password"
                className="password"
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </span>
          </div>
        </div>
        <span className="col-sm-3 loginSpan">
          <button className="loginButton" type="submit">
            Login
          </button>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
