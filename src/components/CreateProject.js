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

import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Configure from "./configureModule";
import Test from "../components/testModule";
import Deploy from "../components/deployModule";
import { connect } from "react-redux";
import SplashScreen from "./configureModule/SplashScreen";
import companyLogo from "../images/logo-white.png";
import LogoutFunc from "./api/logoutApi";
import { useSelector, useDispatch } from "react-redux";
import "./CreateProject.css";
import ConfirmDialog from "./ConfirmDialog";
import BuilderApi from "./api/BuilderApi";
import { StartContainers } from "./api/StartContainers";
import Modal from "./common/modal";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ overflow: "hidden" }}
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#E5E5E5",
    minHeight: "100vh",
    overflow: "hidden",
  },
  header: {
    color: "#FFFFFF",
    backgroundColor: "#0068B5",
    height: "64px",
    fontWeight: 700,
    paddingLeft: 60,
    paddingTop: 14,
    display: "flex",
    paddingRight: 60,
    justifyContent: "space-between",
  },
  paddleft35: {
    paddingLeft: 35,
    paddingTop: 10,
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "normal",
  },
}));

const CreateProject = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [deployProgressbar, setShowDeploymentProgress] = useState(false);
  const [deploymentStatusText, setDeploymentStatusText] = useState("");
  const [stateComponent, setStateComponent] = useState(props.stateComponent);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [openAlreadyExistDialog, setOpenAlreadyExistDialog] = useState(false);
  const [flag, setflag] = useState(false);
  const [modalContent, setModalContent] = useState(
    "Are you sure you want to sign out ?"
  );
  const [modalTitle, setModalTitle] = useState("Sign out");
  const [button1Text, setButton1Text] = useState("Cancel");
  const [button2Text, setButton2Text] = useState("Signout");

  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /* Getting the buildComplete state from redux store */
  const BuildComplete = useSelector(
    (state) => state.BuildReducer.BuildComplete
  );
  const DeployInLocalMachineProgress = useSelector(
    (state) => state.DeploymentReducer.DeployInLocalMachineProgress
  );
  const DeployInRemoteMachine = useSelector(
    (state) => state.DeploymentReducer.DeployInRemoteMachine
  );
  const BuildError = useSelector((state) => state.BuildReducer.BuildError);

  /* Getting deployment status from redux store */
  const DeploymentInProgress = useSelector(
    (state) => state.DeploymentReducer.DeploymentInProgress
  );
  const DeploymentComplete = useSelector(
    (state) => state.DeploymentReducer.DeploymentComplete
  );
  const instance_count = useSelector(
    (state) => state.ConfigureBuildReducer.instance_count
  );
  const DeployEnv = useSelector(
    (state) => state.DeploymentReducer.DeployInDevOrProd
  );
  const handleChangeIndex = (index, btnType) => {
    setValue(index);
    if (btnType === "Next") {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  useEffect(() => {
    setStateComponent(props.stateComponent);
  }, [props.stateComponent]);
  useEffect(() => {
    if(value!=2){
      dispatch({
        type: "DEPLOYMENT_PROGRESS",
        payload: {
          DeployInDevOrProd: false,
        }
      });
      if(!DeployEnv){
        dispatch({
          type: "DEPLOYMENT_PROGRESS",
          payload: {
            DeployInDevOrProd: true,
          }
        });
      }
    }
  },[value]);
  useEffect(() => {
    setValue(props.currentTabCount);
  }, [props.currentTabCount]);

  useEffect(() => {
    dispatch({
      type: "PROJECT_SELECTION_ACTIVE",
      payload: {
        projectSelection: true,
      },
    });
  }, []);
  const logoutFunc = () => {
    setOpenAlreadyExistDialog(false);
    LogoutFunc.logout(
      (e) => {
        window.location.href = "/";
      },
      (response) => {}
    );
  };
  const openConfirmDialogFunc = (e) => {
    if (e.target.id == "signOut") {
      setOpenAlreadyExistDialog(true);
      setModalContent("Are you sure you want to sign out ?");
      setModalTitle("Sign out");
      setButton1Text("Cancel");
      setButton2Text("Signout");
    }
    setflag(!openConfirmDialogFunc);
  };

  const closeConfirmDialog = () => {
    setOpenAlreadyExistDialog(false);
    setflag(!openConfirmDialogFunc);
  };

  function isItemFound(arr, item) {
    let itemFound = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        itemFound = true;
        break;
      }
    }
    return itemFound;
  }

  function trimDigits(s) {
    return s.replace(/\d+$/, "");
  }

  function getServicesToDeploy() {
    let services = [];
    let comps = props.stateComponent.components;
    let nodes = props.stateComponent.selectedComponents.nodes;
    let includeWV = props.stateComponent.selectedComponents.showWebVisualizer;
    for (let i = 0; i < nodes.length; i++) {
      let compName = trimDigits(nodes[i].service);
      if (isItemFound(services, compName)) continue;
      for (let j = 0; j < comps.length; j++) {
        if (
          compName === comps[j].dirName &&
          (compName !== "WebVisualizer" || includeWV)
        ) {
          services.push(compName);
        }
      }
    }
    return services;
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Configure />;
      case 1:
        return <Test />;
      case 2:
        return <Deploy />;
    }
  }

  /* Builder and container restart called in sequence */
  const deployLocal = () => {
    if (DeploymentInProgress == true) {
      dispatch({
        type: "DEPLOYMENT_PROGRESS",
        payload: {
          DeployInLocalMachineProgress: true,
        },
      });
      setShowDeploymentProgress(true);
      setDeploymentStatusText("Deployment in progress");
      BuilderApi.builder(
        getServicesToDeploy(),
        instance_count,
        false,
        DeployEnv == "Dev" ? true : false,
        (configresponse, statusresponse) => {
          if (statusresponse?.data?.status_info.status) {
            StartContainers("restart")
              .then((containerStart) => {
                let response = containerStart?.status_info?.status;
                if (response) {
                  dispatch({
                    type: "DEPLOY_IN_LOCAL_MACHINE_PROGRESS_SUCCESSFUL",
                    payload: {
                      DeployInLocalMachineProgress: false,
                    },
                  });
                  dispatch({
                    type: "DEPLOYMENT_SUCCESSFUL",
                    payload: {
                      DeploymentComplete: true,
                    },
                  });
                  setDeploymentStatusText("Deployment Successful");
                  setShowDeploymentProgress(false);
                  alert("Deployment to local machine successfull!");
                } else {
                  dispatch({
                    type: "DEPLOYMENT_FAILED",
                    payload: {
                      DeploymentError: true,
                      DeploymentErrorMessage: "Error in deploying",
                    },
                  });
                  dispatch({
                    type: "DEPLOY_IN_LOCAL_MACHINE_PROGRESS_FAILED",
                    payload: {
                      DeployInLocalMachineProgress: false,
                    },
                  });
                  setDeploymentStatusText("Deployment failed");
                  setShowDeploymentProgress(false);
                }
              })
              .catch((error) => {
                console.log(error);
              });
            //            clearInterval(interval);
          } else {
            setDeploymentStatusText("Deployment failed");
            setShowDeploymentProgress(false);
            //provision api error
            dispatch({
              type: "DEPLOYMENT_FAILED",
              payload: {
                DeploymentError: true,
                DeploymentErrorMessage: "Error in deploying",
              },
            }).catch((error) => {
              setDeploymentStatusText("Deployment failed");
              setShowDeploymentProgress(false);
              dispatch({
                type: "DEPLOYMENT_FAILED",
                payload: {
                  DeploymentError: true,
                  DeploymentErrorMessage: "Error in deploying",
                },
              });
            });
          }
        },
        (response) => {
          setDeploymentStatusText("Deployment failed");
          setShowDeploymentProgress(false);
          dispatch({
            type: "DEPLOYMENT_FAILED",
            payload: {
              DeploymentError: true,
              DeploymentErrorMessage: "Error in deploying",
            },
          });
        }
      );
    } else {
      alert("Please select an environment to deploy");
    }
  };
  const openCancelProjectModal = () => {
    setOpenAlreadyExistDialog(true);
    setModalContent("Are you sure you want to cancel the project?");
    setModalTitle("Cancel the project");
    setButton1Text("No");
    setButton2Text("Yes");
  };
  const cancelProjectFunc = () => {
    window.location.href = "/CreateProject";
  };

  const steps = ["Configure & Build", "Test", "Deploy"];
  return (
    <div className={classes.root}>
      <>
        {props.popup === true && <SplashScreen />}
        <AppBar position="static" color="default">
          <Typography className={classes.header}>
            <div style={{ display: "flex" }}>
              <div
                className="confirmationDialogBody"
                style={{ visibility: "none" }}
              >
                <Modal
                  open={openAlreadyExistDialog}
                  onClose={closeConfirmDialog}
                  title={modalTitle}
                  modalContent={modalContent}
                  button1Text={button1Text}
                  button2Text={button2Text}
                  button2Fn={
                    modalTitle.includes("Sign out")
                      ? logoutFunc
                      : cancelProjectFunc
                  }
                  button1Fn={closeConfirmDialog}
                />
              </div>
              <div style={{ width: 80, height: 48 }}>
                <img src={companyLogo} width="75" alt="Intel logo" />
              </div>
              <div style={{ width: 194 }}>
                <div className={classes.paddleft35}>Web Deployment Tool</div>
              </div>
            </div>
            <div
              className={classes.paddleft35}
              style={{ cursor: "pointer" }}
              onClick={openConfirmDialogFunc}
              id="signOut"
            >
              Sign out
            </div>
          </Typography>
        </AppBar>
        {props.projectSetup.projectName ? (
          <>
            <div className="projectNameHeader">
              <div style={{ padding: "32px 0" }}>
                {props.projectSetup.projectName}
              </div>
              <div className="confirmationDialogBody">
                <Modal
                  open={openAlreadyExistDialog}
                  onClose={closeConfirmDialog}
                  title={modalTitle}
                  modalContent={modalContent}
                  button1Text={button1Text}
                  button2Text={button2Text}
                  button2Fn={
                    modalTitle.includes("Sign out")
                      ? logoutFunc
                      : cancelProjectFunc
                  }
                  button1Fn={closeConfirmDialog}
                />
              </div>

              <Stepper
                activeStep={activeStep}
                style={{
                  backgroundColor: "transparent",
                  padding: "0px 0px 32px",
                }}
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </div>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                </div>
              ) : (
                <div>
                  <Typography className={classes.instructions}>
                    {getStepContent(activeStep)}
                  </Typography>
                </div>
              )}
            </div>
            <div className="row" style={{ margin: 0, marginTop: 20 }}>
              <div className="createProjectNextCancelBtnDiv">
                {props.projectSetup.noOfStreams !== 0 && (
                  <button
                    className="cancelBtn"
                    onClick={openCancelProjectModal}
                    id="cancelProjectDialogButton"
                  >
                    Cancel
                  </button>
                )}
                {value > 0 &&
                  props.projectSetup.noOfStreams !== 0 &&
                  DeploymentComplete == false && (
                    <button
                      onClick={() => handleChangeIndex(value - 1, "Back")}
                      className="cancelBtn"
                    >
                      Back
                    </button>
                  )}
                {value == 0 &&
                  props.projectSetup.noOfStreams !== 0 &&
                  DeploymentComplete == false && (
                    <button className="nextButtonMainPageDisabled startConfigButton cancelBtn">
                      Back
                    </button>
                  )}
                <div style={{ marginLeft: 10 }}>
                  {value < 2 && props.projectSetup.noOfStreams !== 0 && (
                    <button
                      className={
                        !BuildComplete
                          ? "startConfigButton nextButtonMainPageDisabled"
                          : "startConfigButton"
                      }
                      onClick={() => handleChangeIndex(value + 1, "Next")}
                      disabled={!BuildComplete}
                    >
                      Next
                    </button>
                  )}
                  {value == 2 &&
                    props.projectSetup.noOfStreams !== 0 &&
                    !DeployInLocalMachineProgress &&
                    !DeployInRemoteMachine && (
                      <button
                        className={
                          !DeployEnv 
                            ? " deployBtnProjectScreen nextButtonMainPageDisabled nextButtonMainPage"
                            : "startConfigButton"
                        }
                        onClick={deployLocal}
                        disabled={!DeployEnv}
                      >
                        Deploy
                      </button>
                    )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Configure />
        )}
      </>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stateComponent: state.ConfigureBuildReducer.componentsInitialState,
    componentsStateData: state?.ConfigureBuildReducer?.componentsStateData,
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    currentTabCount: state?.ConfigureBuildReducer?.projectSetup?.tabCount,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setTabValues: (tabdata) => {
      dispatch({ type: "ON_SELECTED_TAB", value: tabdata });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
