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
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
const LoginScreen = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [checkedRememberMe, setChecked] = useState(true);
  const [showPassWordToggle, setPasswordToggle] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
  };
  let DisableLogin = false;
  DisableLogin = username && password ? false : true;
  async function loginUser(credentials) {
    setLoginDisabled(true);
    const cookies = new Cookies();
    return fetch("/eii/ui/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((data) => data.json())
      .then(function (data) {
        if (data?.status_info?.status) {
          cookies.set("dt_session", JSON.parse(data.data));
          setErrorText("");
          window.location.href = "/CreateProject";
        } else if (data?.detail?.length > 0) {
          setLoginDisabled(false);
          setErrorText(data.detail);
        } else {
          setLoginDisabled(false);
          setErrorText("Error while interacting with backend");
        }
      })
      .catch((error) => {
        setLoginDisabled(false);
        setErrorText("Error: Couldn't connect to Backend!");
      });
  }
  const togglePasswordHide = () => {
    setPasswordToggle(!showPassWordToggle);
  };
  console.log(username == "" && password == "", "de");
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="signIn" style={{ marginBottom: errorText && "0px" }}>
          Sign In
        </h3>
        <span className="LoginErrortext">{errorText && errorText}</span>
        <div className="col-sm-12 loginScreen">
          <div className="col-sm-12 row" style={{ marginBottom: 14 }}>
            <span className="col-sm-8">
              <p className="LoginFormLabel">User name</p>
              <input
                type="text"
                id="username"
                name="username"
                className={errorText ? "username errorTextBorder" : "username"}
                onChange={(e) => {
                  setLoginDisabled(false);
                  setErrorText("");
                  setUserName(e.target.value);
                }}
                required
              />
            </span>
          </div>

          <div className="col-sm-12 row">
            <span className="col-sm-8">
              <p className="LoginFormLabel">Password</p>
              <input
                type={showPassWordToggle ? "text" : "password"}
                id="password"
                className={errorText ? "password errorTextBorder" : "password"}
                name="password"
                autoComplete={checkedRememberMe ? "on" : "new-password"}
                onChange={(e) => {
                  setLoginDisabled(false);
                  setErrorText("");
                  setPassword(e.target.value);
                }}
                required
              />
              <span
                style={{ display: password ? "inline" : "none" }}
                className=" loginScreenPasswordField"
                onClick={togglePasswordHide}
              >
                {showPassWordToggle ? "hide" : "show"}
              </span>
            </span>
          </div>
        </div>
        {!errorText && (
          <span className="col-sm-12">
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedB"
                  style={{
                    color: "#0068B5",
                  }}
                  checked={checkedRememberMe}
                  onChange={(e) => {
                    let checked = e.target.checked;
                    setChecked(checked);
                  }}
                />
              }
              label="Remember me"
            />
          </span>
        )}
        <span className="col-sm-3 loginSpan loginButtonSpan">
          <button
            className="loginButton"
            type="submit"
            disabled={loginDisabled || (username == "" && password == "")}
            style={{
              backgroundColor:
                loginDisabled || (username == "" && password == "" && "#ccc"),
              cursor: loginDisabled && "not-allowed",
            }}
          >
            Sign in
          </button>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
