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
import LinearWithValueLabel from "./LinearProgress";
import { connect } from "react-redux";
import "./ConfigBuild.css";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { getStatusPercentage, buildContainer } from "./configureAndBuildAction";
import ViewLogs from "./ViewLogs";
import { useSelector, useDispatch } from "react-redux";
import { StartContainers } from "../api/StartContainers";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme) => ({
  divPos: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,0.1)",
    padding: 20,
    cursor: "not-allowed",
    border: "1px solid #C9CACE",
  },
  texCenter: {
    textAlign: "center",
  },
  // button: {
  //   "&:hover": {
  //     background: "#030e1642",
  //     color: "black",
  //     padding: "5px 40px 5px 40px",
  //   },
  // },
  divSpec: {
    width: "100%",
    fontSize: 13,
    marginTop: 20,
    marginRight: 0,
    display: "flex",
  },
  nameFloat: {
    width: "auto",
    marginRight: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  progressFloaat: {
    width: "100%",
    padding: 0,
    marginBottom: "7px",
  },
}));

const ConfigBuild = (props) => {
  const classes = useStyles();
  const [BuildProgressPercentage, setBuildProgress] = useState(0);
  const [BuildStatusText, setBuildStatusText] = useState("");
  const [disableStartButton, setStartButtonEnabledOrDisabled] = useState(false);
  const [enableBuildView, setBuildViewFlag] = useState(false);
  const [ViewProcessLogs, setViewLogs] = useState("");
  const [openViewLogDialog, setViewLogsDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    setOpen(false);
  };
  /* Getting the buildComplete state from redux store */
  const BuildComplete = useSelector(
    (state) => state.BuildReducer.BuildComplete
  );
  const startbutton = useSelector(
    (state) => state.BuildReducer.startbuttondisabled
  );
  const BuildError = useSelector((state) => state.BuildReducer.BuildError);
  let promiseResolve;
  let promiseReject;
  const dispatch = useDispatch();
  useEffect(
    (props) => {
      setBuildProgress(BuildComplete ? 100 : 0);
    },
    [BuildComplete]
  );
  /* Starting the build process */
  const startBuild = (e) => {
    e.preventDefault();
    setStartButtonEnabledOrDisabled(true);
    setBuildStatusText("");
    let progressPercentage = 0;
    let ProcessName = "building";
    setBuildProgress(1);
    dispatch({
      type: "BUILD_IN_PROGRESS_DISABLED_DRAG",
      payload: {
        BuildProgress: 1,
      },
    });
    if (BuildProgressPercentage == 1 || BuildProgressPercentage < 100) {
      dispatch({
        type: "IMPORT_DISABLED",
        payload: {
          ImportButtonDisabled: true,
        },
      });
      dispatch({
        type: "DISABLED_SAVE",
        payload: {
          Disabledsave: true,
        },
      });
    }
    buildContainer()
      .then((buildResponse) => {
        setBuildViewFlag(true);
        let response = buildResponse?.data;
        response = JSON.stringify(response);
        setStartButtonEnabledOrDisabled(true);
        getStatus("build", promiseResolve, promiseReject);
      })
      .catch((error) => {
        alert("Some error occured: " + error);
      });

    return false;
  };
  /* To get the update of progress percent call status api every 5 seconds */
  const getStatus = (processName, res, rej) => {
    let ProcessName = processName;
    let progressPercentage = 0;
    let progressString;
    const interval = setInterval(
      () =>
        getStatusPercentage().then((response) => {
          if (response) {
            /* Get the progress % and convert it to integer */
            progressString = JSON.parse(response.data);
	    if(progressString.task != "build"){
              clearInterval(interval);
              return;
            }
            /* if the progress percentage for eg.goes from 10% back to 0% it signifies an error, check for the same */
            if (
              parseInt(progressPercentage) > parseInt(progressString.progress)
            ) {
              if (processName.includes("build")) {
                setBuildStatusText("Error");
                dispatch({
                  type: "IMPORT_DISABLED",
                  payload: {
                    ImportButtonDisabled: false,
                  },
                });
                dispatch({
                  type: "DISABLED_SAVE",
                  payload: {
                    Disabledsave: false,
                  },
                });
                /* displatch the build completion status*/
                dispatch({
                  type: "BUILD_FAILED",
                  payload: {
                    BuildComplete: false,
                    BuildError: true,
                    BuildErrorMessage: "Error",
                  },
                });
                setBuildProgress(49);
                setStartButtonEnabledOrDisabled(false);
                clearInterval(interval);
              }
            } else {
              progressPercentage = progressString.progress;
              /* Setting state value, progress bar % */
              setBuildProgress(parseInt(progressPercentage - 1));
              dispatch({
                type: "BUILD_IN_PROGRESS_DISABLED_DRAG",
                payload: {
                  BuildProgress: (parseInt(progressPercentage - 1)),
                },
              });
              if (progressPercentage == 100) {
                if (ProcessName.includes("build") && progressString.status == "Success") {
                  dispatch({
                    type: "SHOW_BUILD_ALERT",
                    payload: {
                      showBuildAlert: true,
                    },
                  });
		     clearInterval(interval);
                  /* Restart containers so that changes take effect after successfull build */
                  StartContainers("restart").then((containerStart) => {
                    let response = containerStart?.status_info?.status;
                    if (response) {
                      setBuildProgress(100);
                      dispatch({
                        type: "BUILD_IN_PROGRESS_DISABLED_DRAG",
                        payload: {
                          BuildProgress: 100,
                        },
                      });
                      dispatch({
                        type: "BUILD_COMPLETE",
                        payload: { BuildComplete: true, BuildError: false },
                      });
                      dispatch({
                        type: "IMPORT_DISABLED",
                        payload: {
                          ImportButtonDisabled: false,
                        },
                      });
                      dispatch({
                        type: "DISABLED_SAVE",
                        payload: {
                          Disabledsave: false,
                        },
                      });
                      setStartButtonEnabledOrDisabled(false);
                    } else {
                      /* displatch the build completion status*/
                      dispatch({
                        type: "BUILD_FAILED",
                        payload: {
                          BuildComplete: false,
                          BuildError: true,
                          BuildErrorMessage: "Error",
                        },
                      });
                      setBuildProgress(99);
                      setBuildStatusText("Failed");
                      dispatch({
                        type: "IMPORT_DISABLED",
                        payload: {
                          ImportButtonDisabled: false,
                        },
                      });
                      dispatch({
                        type: "DISABLED_SAVE",
                        payload: {
                          Disabledsave: false,
                        },
                      });
                      setStartButtonEnabledOrDisabled(false);
                      clearInterval(interval);
                    }
                  
                  });
                }
                clearInterval(interval);
              } else if (progressString.status == "Failed") {
                setStartButtonEnabledOrDisabled(false);
              }
            }
          }
        })
         .catch((error) => {
         setOpen(true);
       }),
      5000
    );
  };
  const viewLogs = (processname) => {
    if (BuildProgressPercentage > 5) {
      setViewLogs(processname);
      setViewLogsDialog(true);
    }
  };
  const closeViewLogs = () => {
    setViewLogsDialog(false);
  };
  const thumb = [];
  const isActive = props?.projectSetup?.noOfStreams === 0;
  return (
    <div className={`${isActive ? "root" : "root1"}`}>
      {isActive && <div className={classes.divPos}></div>}
      <p className={`titleStyle`}>Build</p>
      <p className="componentListHelpText" style={{ marginBottom: 24 }}>
        click on start to build containers
      </p>

      <div className={classes.divSpec}>
        <div className={classes.nameFloat}>
          <p style={{ marginBottom: 0 }}>Containers:</p>
        </div>
        <div className={classes.progressFloaat}>
          <p
            className={(BuildStatusText == "Error") ||(BuildStatusText == "Failed") ? "ErrorTextBuild" : ""}
            style={{ textAlign: "center", marginBottom: 0 }}
          >
            {(BuildStatusText == "Error") ||(BuildStatusText == "Failed")
              ? BuildStatusText
              : BuildProgressPercentage + "%"}
          </p>
          <LinearWithValueLabel
            className="progressBarConfig"
            value={BuildProgressPercentage}
          />
        </div>
      </div>
      <div className={`${classes.texCenter} startConfig`}>
        <div>
          <button
            disabled={
              disableStartButton ||
              isActive ||
              BuildComplete == true ||
              startbutton
            }
            className={"startConfigButton"}
            onClick={startBuild}
            id={
              disableStartButton ||
              isActive ||
              startbutton ||
              (BuildComplete == true && BuildError == false)
                ? "disableStart"
                : ""
            }
          >
            Start
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="cancelBtn"
            onClick={() => viewLogs("build")}
            id={isActive || BuildProgressPercentage <= 5 ? "disableStart" : ""}
          >
            View Logs
          </button>
        </div>
        <div>
          <button type="submit" className="cancelBtn" id="disableStart">
            Cancel
          </button>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        style={{ color: "white", backgroundColor: "#0068B5" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{ width: "100%" }}
          style={{ color: "white", backgroundColor: "#0068B5" }}
        >
          <h5>Connection Lost</h5>
          <p>Connection with the back-end server lost. Try again later.</p>
        </Alert>
      </Snackbar>
      {thumb}
      <ViewLogs
        processname={ViewProcessLogs}
        open={openViewLogDialog}
        handleCloseViewLog={closeViewLogs}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    componentsStateData: state?.ConfigureBuildReducer?.componentsStateData,
  };
};

export default connect(mapStateToProps)(ConfigBuild);
