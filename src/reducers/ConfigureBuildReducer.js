import { combineReducers } from 'redux';
import { initialState } from '../initialState';
import ActionType from '../actionTypes';

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
      // console.log('projectSetup', action.projectData);
      // console.log("curState12", action.curState);
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
          //  ...action.value,
          //  value:index+1
          //  selectedTab:(selectedTab + 1) % tabCount
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
    
    case ActionType.UPDATE_MAIN_OBJECT: {
      console.log("Update main object1213:",action.value);
      var obj = {
        ...state,
        componentsInitialState: {
          ...state.componentsInitialState,
         ... action.value
          }
      };
      console.log("obj",obj)
      return{
         ...obj,
        };
    } 
  
    default:
      console.log("actionss:", state);
      return newState;
  }

  // return state;
}
