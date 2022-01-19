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

import { BUILD_COMPLETE, BUILD_FAILED, START_DISABLED } from "../actionTypes/buildTypes";

const initialState = {
  BuildComplete: false,
  BuildError: false,
  BuildErrorMessage: "",
  startbuttondisabled:false,
};

export default function BuildReducer(state = initialState, action) {
  switch (action.type) {
    case BUILD_COMPLETE:
      return {
        ...state,
        BuildComplete: action.payload.BuildComplete,
        BuildError: action.payload.BuildError,
      };
    case BUILD_FAILED:
      return {
        ...state,
        BuildComplete: action.payload.BuildComplete,
        BuildError: action.payload.BuildError,
        BuildErrorMessage: action.payload.BuildErrorMessage,
      };
    case START_DISABLED:
      return {
        ...state,
        startbuttondisabled: action.payload.startbuttondisabled,
      };
    default:
      return state;
  }
}
