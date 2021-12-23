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
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
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
import { CircularProgress } from "@material-ui/core";
import BuilderApi from "./api/BuilderApi";
import { StartContainers } from "./api/StartContainers";
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
    backgroundColor: theme.palette.background.paper,
  },
  header: {
    color: "#FFFFFF",
    backgroundColor: "#0068B5",
    height: "64px",
    fontWeight: 700,
    paddingLeft: 60,
    paddingTop: 14,
    display: "flex",
  },
  paddleft35: {
    paddingLeft: 35,
    paddingTop: 10,
  },
}));

const CreateProject = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deployProgressbar, setShowDeploymentProgress] = useState(false);
  const [deploymentStatusText, setDeploymentStatusText] = useState("");
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
  const handleChangeIndex = (index) => {
    setValue(index);
  };
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
    LogoutFunc.logout(
      (e) => {
        window.location.href = "/";
      },
      (response) => {}
    );
  };
  const openConfirmDialogFunc = () => {
    setOpenConfirmDialog(true);
  };
  const closeConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  /* Builder and container restart called in sequence */
  const showProgressBar = () => {
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
        [],
        instance_count,
        DeployEnv == "dev" ? true : false,
        false,
        (configresponse, statusresponse) => {
          if (statusresponse?.data?.status_info.status) {
            StartContainers("restart").then((containerStart) => {
              let response = containerStart?.status_info?.status;
              if (response) {
                /*TODO: call DeployRemote API here - fetch parameters from Deployment screen (new text boxes)*/
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
                setDeploymentStatusText(
                  "Deployment Successful"
                );
                setShowDeploymentProgress(false);
              } else {
                dispatch({
                  type: "DEPLOYMENT_FAILED",
                  payload: {
                    DeploymentError: true,
                    DeploymentErrorMessage:
                      "Error in deploying",
                  },
                });
                dispatch({
                  type: "DEPLOY_IN_LOCAL_MACHINE_PROGRESS_FAILED",
                  payload: {
                    DeployInLocalMachineProgress: false,
                  },
                });
                setDeploymentStatusText(
                  "Deployment failed"
                );
                setShowDeploymentProgress(false);
              }
            })
            .catch((error) => {
              //container start error
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
            })              
            .catch((error) => {
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
  return (
    <div className={classes.root}>
        <>
          {props.popup === true && <SplashScreen />}
          <AppBar position="static" color="default">
            <Typography className={classes.header}>
              <div style={{ width: 80, height: 48 }}>
                <img src={companyLogo} width="75" alt="Intel logo" />
              </div>
              <div style={{ width: 194 }}>
                <div className={classes.paddleft35}>EII Deployment Tool</div>
              </div>
            </Typography>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              defaultTab={props.selectedTab}
            >
              <Tab label="Configure and Build" {...a11yProps(0)} />
              <Tab
                label="Test"
                {...a11yProps(1)}
                // disabled={!BuildComplete}
              />
              <Tab label="Deploy" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Configure />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Test />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Deploy />
            </TabPanel>
          </SwipeableViews>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-sm-9"></div>
            <div className="col-sm-3 createProjectNextCancelBtnDiv">
              {props.projectSetup.noOfStreams !== 0 && (
                <span className="cancelButtonMainPageSpan">
                  <button
                    className="cancelButtonMainPage"
                    onClick={openConfirmDialogFunc}
                  >
                    Close
                  </button>
                </span>
              )}
              {value > 0 &&
                props.projectSetup.noOfStreams !== 0 &&
                DeploymentComplete == false && (
                  <button
                    onClick={() => handleChangeIndex(value - 1)}
                    className="backButtonMainPage"
                  >
                    Back
                  </button>
                )}
              {value < 2 && props.projectSetup.noOfStreams !== 0 && (
                <button
                  className={
                    !BuildComplete
                      ? "nextButtonMainPage nextButtonMainPageDisabled"
                      : "nextButtonMainPage"
                  }
                  onClick={() => handleChangeIndex(value + 1)}
                >
                  Next
                </button>
              )}
              {value == 2 && props.projectSetup.noOfStreams !== 0 && !DeployInLocalMachineProgress && (
                <button
                  className="nextButtonMainPage deployBtnProjectScreen"
                  onClick={showProgressBar}
                >
                  Deploy
                </button>
              )}
            </div>
          </div>
          <ConfirmDialog
            open={openConfirmDialog}
            handleCloseDialog={closeConfirmDialog}
            logout={logoutFunc}
          />
        </>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
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
