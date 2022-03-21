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

import React, { useState, useEffect } from 'react';
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
import LogoutFunc from "../api/logoutApi";
import { CreateProject } from '../api/CreateProject';
import ConfirmDialog from "../ConfirmDialog";
import Modal from "../common/modal";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

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
  const [enableNextBtn, setEnableNextBtn] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAlreadyExistDialog, setOpenAlreadyExistDialog] = useState(false);
  const [modalContent, setModalContent] = useState("A project already exists. Do you wish to replace it?");
  const [modalTitle, setModalTitle] = useState("Create a New Project");
  const [button1Text, setButton1Text] = useState("No");
  const [button2Text, setButton2Text] = useState("Yes");
  const [open, setOpen] = useState(false);
  const [openTask,setopenTask] =useState(false);
  
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
  const handleClose = (event, reason) => {
    setOpen(false);
  };
  const onclose =(event)=>{
    setopenTask(false);
  }
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
                      openAlreadyExistDialogBox();
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
            setopenTask(true);
          }
        },
        (error) => {
          if (error?.message?.includes("status code 403") &&
            window.confirm("Invalid session. Please re-login")) {
            window.location.href = "/LoginScreen";
          }
          else if(error?.message?.includes("status code 504")){
            setOpen(true);
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

  const logoutFunc = () => {
    LogoutFunc.logout(
      (e) => {
        window.location.href = "/";
      },
      (response) => { }
    );
  };

  const openConfirmDialogFunc = () => {
    setOpenConfirmDialog(true);
  };
  const closeConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  /*   const getProjectList = (event) => {
      axios.get('/eii/ui/project/list')
  
        .then((e) => {
  
          var data = [];
          if (e?.data?.data) {
            data = JSON.parse(e?.data?.data);
  
          }
          setProjectList(data || []);
        })
        .catch((e) => {
          console.log(e);
        });
  
    }; */
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
    setEnableNextBtn(true);
    let currentState = { ...state };
    currentState['projectName'] = '';
    if (e.target.value.toLocaleLowerCase() == 'new') {
      disableFields("existingProject");
      currentState['isCreateProject'] = true;

      setState(currentState);
      setError({
        ...error,
        project_name: false,
      });
      //setProjectList([]);
    } else {
      disableFields("newProject");
      //getProjectList(e);
      currentState['isCreateProject'] = false;
      setState(currentState);
    }

  };
  const disableFields = (field) => {
    let selectExistingProject = document.getElementById("selectExistingProject");
    let projectName = document.getElementById("pname");
    let selectNoOfDataStreams = document.getElementById("selectNoOfDataStreams");
    if (field === "existingProject") {
      selectExistingProject.disabled = true;
      projectName.disabled = false;
      selectNoOfDataStreams.disabled = false;

    } else {
      selectExistingProject.disabled = false;
      projectName.disabled = true;
      selectNoOfDataStreams.disabled = true;
    }
  }

  const closeAlreadyExistDialogBox = () => {
    setOpenAlreadyExistDialog(false);
  }
  const openAlreadyExistDialogBox = (data) => {
    setOpenAlreadyExistDialog(true);
  }

  const handleReplaceExisingProject = () => {
    setOpenAlreadyExistDialog(false);
    props.updateProjectInfo({
      ...state
    }, props.getStateVal);
    return true;
  }
  useEffect(() => {
    axios.get('/eii/ui/project/list')

      .then((e) => {

        var data = [];
        if (e?.data?.data) {
          data = JSON.parse(e?.data?.data);

        }
        setProjectList(data || []);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          window.location.href = "/LoginScreen";
        }

      });
  }, []);

  return (
    <div className="createProjectWrapper">
      <h3>Create or select a project</h3>
      <FormControl className='forWidth' component='fieldset'>
        <RadioGroup
          aria-label='projecSelect'
          name='projecSelect'
          classes={{ root: classes.RadioGroup, checked: classes.checked }}
        >
          <FormControlLabel
            value='New'
            control={<Radio color='primary' onChange={handelRadioButton} />}
            label='Create a new project'
          ></FormControlLabel>
          <div className='formFirstWidth'>
            <div>
              <div className='createProjectHelpText'>Please enter the project name, select the number of data streams and then click on next to create a project.</div>
              <div for='fname' className='projectNameTitle'>
                Project name
              </div>
              <input
                type='text'
                placeholder='Project name'
                onBlur={(e) => onChangeHandle(e, 'projectName')}
                id='pname'
                name='pname'
                className={error.project_name && state.isCreateProject && 'input_error'}
                disabled
              />
            </div>
          </div>

          <div className='formSecondWidth'>

            <div for='fname' className='projectNameTitle'>
              Number of datastreams
            </div>
            <select
              id="selectNoOfDataStreams"
              className='createSelect'
              value={state.noOfStreams}
              onChange={(e) => onChangeHandle(e, 'noOfStreams')}
              disabled
            >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
            </select>

          </div>

          <FormControlLabel
            value='Open'
            control={<Radio color='primary' onChange={handelRadioButton} />}
            label='Open a existing project'
            className='openRadio width220'
          />
          <div className='formFirstWidth'>
            <div className='createProjectHelpText'>Please enter the project name or select from the given dropdown to open an existing project.</div>
            <div for='fname' className='projectNameTitle'>
              Select a project
            </div>
            <select id="selectExistingProject" className='createSelect' onChange={(e) => onChangeHandleProject(e, 'projectName')} disabled>
              <option>Select Project</option>
              {projectList.map((el, index) => {
                return (
                  <option key={index} value={el}>
                    {el}
                  </option>
                );
              })}
            </select>

          </div>
        </RadioGroup>
        <div className='footer'>
          <div>
            <button onClick={projectSetupSubmit} className={enableNextBtn ? "nextBtn" : "nextBtn nextButtonMainPageDisabled"}>Next</button>
          </div>

        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} style={{color:"white", backgroundColor:"#0068B5"}} anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }} style={{color:"white", backgroundColor:"#0068B5"}}>
          <h8>Connection Lost</h8>
          <p>Connection with the back-end server lost. Try again later.</p>
        </Alert>
      </Snackbar>
      <Snackbar open={openTask} autoHideDuration={6000} onClose={onclose} style={{color:"white", backgroundColor:"#0068B5"}} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Alert onClose={onclose} severity="info" sx={{ width: '100%' }} style={{color:"white", backgroundColor:"#0068B5"}}>
          <p>A task is already in progress. Please try again later</p>
        </Alert>
      </Snackbar>
      </FormControl>
      <ConfirmDialog
        open={openConfirmDialog}
        handleCloseDialog={closeConfirmDialog}
        logout={logoutFunc}
      />

      <div className="confirmationDialogBody">
        <Modal
          open={openAlreadyExistDialog}
          onClose={closeAlreadyExistDialogBox}
          title={modalTitle}
          modalContent={modalContent}
          button1Text={button1Text}
          button2Text={button2Text}
          button2Fn={handleReplaceExisingProject}
          button1Fn={closeAlreadyExistDialogBox}
        />

      </div>
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



