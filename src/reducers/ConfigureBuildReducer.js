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

import { initialState } from '../initialState';
import ActionType from '../actionTypes';
import _ from 'lodash';

export default function ConfigureBuildReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case ActionType.ON_TABVALUE:
      console.log('createProjectLayout');
      return {
        ...state,
        createProjectLayout: false,
      };
  
    case ActionType.UPDATE_PROJECT_INFO: {
   
      return {
        ...state,
        projectSetup: {
          ...state.projectSetup,
          ...action.value,
          isValid: true,
        },
      };
    }
    case ActionType.ON_SELECTED_TAB:{
      console.log('ontabselected', action.tabdata);
      return{
        ...state,
        projectSetup:{
          ...action.projectSetup,
          tabCount:action.value,
       
        }
      }
    }
    case ActionType.HANDLE_SETTINGS:{
      return{
        ...state,
        getData:{
          ...state.getData,
          isOpen:action.value
        }
      }
    }
    case ActionType.UPDATE_APP_NAME: {
      console.log("Update:",action.value);
      return {
        ...state,
        getData: {
          ...state.getData,
          appName:action.value
        },
      };
    }
    case ActionType.UPDATE_MAIN_OBJECT: {
   
      
      var obj = {
        ...state,
    
        componentsInitialState: {
            ...state.componentsInitialState,
            ...action.value
          }
      };
    
      return{
         ...obj,
        };
    } 
    case ActionType.UPDATE_CONFIG_OBJECT:{
                  let currentData = {...state};
                  console.log("action.response:",action.response);
                  currentData.selectedComponents=action.response;
                  console.log("action.response selected:",currentData.selectedComponents);
      
                  return currentData.selectedComponents;
              }
    default:
      console.log("actionss:", state);
      return newState;
  }


}

