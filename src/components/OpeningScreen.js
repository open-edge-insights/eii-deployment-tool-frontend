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
import { useState } from "react";
import intelBlackLogo from "../images/intelFullBlack.PNG";
import "./OpeningScreen.css";
const OpeningScreen = (props) => {
  const [redirect, setRedirect] = useState(false);
  function progressBarDots() {
    let count = 1;
    let prevCount = count;
    let currentDiv;
    let myInterval = setInterval(function () {
      if (count > 3) {
        document.getElementById("dot1").style.visibility = "hidden";
        document.getElementById("dot2").style.visibility = "hidden";
        document.getElementById("dot3").style.visibility = "hidden";
        count = 1;
      } else if (count < 4) {
        currentDiv = document.getElementById("dot" + count);
        prevCount = count;
        document.getElementById("dot" + prevCount).style.visibility = "visible";
        count++;
      }
      setTimeout(() =>window.location.href = "/loginSCreen", 2000);
    }, 400);
  }
  return (
    <div>
      <img src={intelBlackLogo} className="openingScreenImg" />
      <div className="openingScreenTitleDiv">
        <p className="openingScreenTitle">Edge Insights For Industrial</p>
        <div>
          <p className="openingScreenTitleLoading">Loading</p>
        </div>
        <div className="threeDots">
          <div className="dot1 dots" id="dot1" />
          <div className="dot2 dots" id="dot2" />
          <div className="dot3 dots" id="dot3" />
        </div>
      </div>
     <span className="progressBarDots"> {setTimeout(() => progressBarDots(), 1000)}</span>
    </div>
  );
};
export default OpeningScreen;
