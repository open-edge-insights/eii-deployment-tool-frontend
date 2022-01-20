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
import "./NewLoginScreen.css";
import LoginScreen from "./configureModule/LoginScreen";
import intelWhiteFontLogo from '../images/intelWhiteTextLogo.PNG';
const NewLoginScreen = (props) => {
  return (
    <div className="NewLoginScreenMainDiv">
      <div className="NewLoginDiv">
        <div className="MainLoginDiv">
          <p className="NewLoginScreenTitle">Edge Insights for Industrial</p>
          <p className="NewLoginScreenWelcomeText">
            Welcome to the Edge Insights for Industrial (EII) Deployment tool.
            This tool will guide you through the process of configuring,
            testing, and deploying your solution for your project.
          </p>
          <p className="NewLoginScreenStepTitle">
            The main steps for the EII deployment process are:
          </p>
          <div className="NewLoginScreenStepsDiv">
            <p className="NewLoginScreenStep1">
              1. Configure your project’s data streams
            </p>
            <p className="NewLoginScreenStep1 NewLoginScreenStep2">
              2. Build your project’s containers
            </p>
            <p className="NewLoginScreenStep1 NewLoginScreenStep2">
              3. Test your solution
            </p>
            <p className="NewLoginScreenStep1 NewLoginScreenStep2">
              4. Deploy your solution
            </p>
          </div>
        </div>
        <div className="NewLoginScreenIntelWhiteFontLogoDiv">
          <img src={intelWhiteFontLogo} className="NewLoginScreenIntelWhiteFontLogo"/>
        </div>
        <div className="LoginFormDiv">
          <LoginScreen />
        </div>
      </div>
    </div>
  );
};
export default NewLoginScreen;
