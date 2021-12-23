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

import * as DeployTypes from "../actionTypes/deploymentTypes";

const initialState = {
  DeploymentComplete: false,
  DeploymentError: false,
  DeploymentErrorMessage: "",
  DeploymentInProgress: false,
  DeployInDevOrProd: "",
  DeployInLocalMachineProgress:false
};

export default function DeploymentReducer(state = initialState, action) {
  switch (action.type) {
    case DeployTypes.DEPLOYMENT_PROGRESS:
      return {
        ...state,
        DeploymentComplete: false,
        DeploymentError: false,
        DeploymentErrorMessage: "",
        DeploymentInProgress: action.payload.DeploymentInProgress,
        DeployInDevOrProd:  action.payload.DeployInDevOrProd,
        DeployInLocalMachineProgress:action.payload.DeployInLocalMachineProgress
      };
    case DeployTypes.DEPLOYMENT_SUCCESSFUL:
      return {
        ...state,
        DeploymentComplete: action.payload.DeploymentComplete,
        DeploymentError: false,
        DeploymentErrorMessage: "",
        DeploymentInProgress: false
      };
      case DeployTypes.DEPLOYMENT_FAILED:
        return {
          ...state,
          DeploymentComplete: false,
          DeploymentError: action.payload.DeploymentError,
          DeploymentErrorMessage: action.payload.DeploymentErrorMessage,
          DeploymentInProgress: false
        };
        case DeployTypes.DEPLOY_IN_LOCAL_MACHINE_PROGRESS_SUCCESSFUL:
          return{
            ...state,
            DeployInLocalMachineProgress:action.payload.DeployInLocalMachineProgress
          };
        case DeployTypes.DEPLOY_IN_LOCAL_MACHINE_PROGRESS_FAILED:
          return{
            ...state,
            DeployInLocalMachineProgress:false
          };
    default:
      return state;
  }
}
