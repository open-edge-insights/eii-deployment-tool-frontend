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

import React, { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import './AddTab.css';
import { connect } from 'react-redux';
import './ProjectSetup.css';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import GetStatusApi from '../api/GetStatusApi';
import { CreateProject } from '../api/CreateProject';

const useStyles = makeStyles((theme) => ({
  butOk: {
    width: 100,
    height: 40,
    background: '#fff 0% 0% no-repeat padding-box',
    border: '1px solid #2B2C30',
    borderRadius: 5,
    position: 'relative',
    left: 350,
    color: '#262626',
    '&:hover': {
      background: '#E9EAEB 0% 0% no-repeat padding-box',
      border: '1px solid #2B2C30',
    },
  },

  borGrey: {
    border: '1px solid #C9CACE !important',
  },
 
}));

const ProjectSetup = (props) => {
  const classes = useStyles();
  const [projectList, setProjectList] = useState([]);
  const [newProject, setNewProject] = useState([]);
  const [error, setError] = useState({
    project_name: false,
  });

  const [state, setState] = useState({
    isCreateProject: false,
    noOfStreams: 1,
    projectName: '',
    projectLocation: '',
    existingProjectLocation: '',
    openProjectName: '',
  });

  const onChangeHandle = (e, type) => {
    let currentState = { ...state },
      value = '';
    if (e && e.target && e.target.value !== undefined) {
      value = e.target.value;
      //sendProjectName(value);
    }
    currentState[type] = value;
    setState(currentState);
  };

  const onChangeHandleProject = (e, type) => {
    let currentState = { ...state },
      value = '';
    if (e && e.target && e.target.value !== undefined) {
      value = e.target.value;
      
    }
    currentState[type] = value;
    setState(currentState);
  };

  const projectSetupSubmit = () => {
    if (state.projectName.trim() != '' || state.openProjectName) {
      GetStatusApi.getstatus(
        (data) => {
          if (data.status != "In Progress") {
            if (state.isCreateProject) {
              CreateProject(state.projectName.trim()).then((response) => {
                if (response) {
                  if (!response?.status_info?.status) {
                    if (response.status_info.error_detail == 'AlreadyExist') {
                      let choice = window.confirm("A project with the same name already exists. Do you want to replace it?");
                      if (choice == true) {
                        props.updateProjectInfo({
                          ...state
                        }, props.getStateVal);
                        return true;
                      }
                    } else {
                      alert("An eror occurred while creating project: " + response.status_info.error_detail);
                    }
                  } else {
                    props.updateProjectInfo({
                      ...state
                    }, props.getStateVal);
                    return true;
                  }
                }
              });
            } else {
              props.updateProjectInfo({
                ...state
              }, props.getStateVal);
            }
          } else {
            alert("A " + data.task + " task is already in progress.Please try again later");
          }
        },
        (error) => {
          if(error?.message?.includes("status code 403") && 
            window.confirm("Invalid session. Please re-login")) {
            window.location.href = "/LoginScreen";
          }
        }
      );
    } else {
      setError({
        ...error,
        project_name: true,
      });
    }
  };

  const getProjectList = (event) => {
    axios.get('/eii/ui/project/list').then((e) => {
        var data = [];
        if (e?.data?.data) {
          data = JSON.parse(e?.data?.data);

        }
        setProjectList(data || []);
      })
      .catch((e) => {
        console.log(e);
        if (e?.message?.includes("status code 403") &&
          window.confirm("Invalid session. Please re-login")) {
          window.location.href = "/LoginScreen";
        }
      });
  };

  const sendProjectNamedetails = (value) => {
    axios
      .post('eii/ui/project/load', { name: value })
      .then((e) => {
      })
      .catch((e) => {
        console.log({ e });
      });
  };
  const handelRadioButton = (e) => {
    let currentState = { ...state };
    currentState['projectName'] = '';
    if (e.target.value.toLocaleLowerCase() == 'new') {
      
      currentState['isCreateProject'] = true;

      setState(currentState);
      setError({
        ...error,
        project_name: false,
      });
      setProjectList([]);
    } else {
      getProjectList(e);
      currentState['isCreateProject'] = false;
      setState(currentState);
    }

  };
  return (
    <div>
      <Box
        className='boxSetting'
        sx={{
          bgcolor: '#F5F5F5',
          margin: '0 auto',
          border: '1px solid #F5F5F5',
        }}
      >
        <FormControl className='forWidth' component='fieldset'>
          <RadioGroup
            aria-label='projecSelect'
            name='projecSelect'
            classes={{ root: classes.RadioGroup, checked: classes.checked }}
          >
            <FormControlLabel
              value='New'
              className='width220'
              control={<Radio color='primary' onChange={handelRadioButton} />}
              label='Create a new project'
            ></FormControlLabel>
            <div className='formFirstWidth'>
              <span>
                <label for='fname' className='padLeft15'>
                  Project name:
                </label>
                <input
                  type='text'
                  placeholder='Project name'
                  onBlur={(e) => onChangeHandle(e, 'projectName')}
                  id='pname'
                  name='pname'
                  className={error.project_name && state.isCreateProject && 'input_error'}
                />
              </span>
            </div>

            <div className='formSecondWidth'>
              <span>
                <label className='padLeft15' for='fname'>
                  Number of data streams for your projects:
                </label>
                <select
                  className='createSelect'
                  value={state.noOfStreams}
                  onChange={(e) => onChangeHandle(e, 'noOfStreams')}
                >
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>

                  <option value='5'>5</option>

                  <option value='6'>6</option>
                </select>
              </span>
            </div>
            <hr />

            <FormControlLabel
              value='Open'
              control={<Radio color='primary' onChange={handelRadioButton} />}
              label='Open a existing project'
              className='openRadio width220'
            />
            <div className='openDiv'>
              <span>
                <select className='openSelect' onChange={(e) => onChangeHandleProject(e, 'projectName')}>
                  <option>Select Project</option>
                  {projectList.map((el, index) => {
                    return (
                      <option key={index} value={el}>
                        {el}
                      </option>
                    );
                  })}
                </select>
              </span>
            </div>
          </RadioGroup>
          <button
            onClick={projectSetupSubmit}
            className={classes.butOk}
          >
            OK
          </button>
        </FormControl>
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isCreateProject: state.ConfigureBuildReducer.isCreateProject,
    noOfStreams: 1,
    projectName: '',
    projectLocation: '',
    existingProjectLocation: '',
    getStateVal: state,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onTabValue: () => dispatch({ type: 'ON_TABVALUE' }),
    updateProjectInfo: (projectData, curState) => {
      dispatch({ type: 'UPDATE_PROJECT_INFO', value: projectData });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetup);



