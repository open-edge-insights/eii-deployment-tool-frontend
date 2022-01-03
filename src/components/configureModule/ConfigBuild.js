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
import {
  getStatusPercentage,
  buildContainer,
} from "./configureAndBuildAction";
import ViewLogs from "./ViewLogs";
import { useSelector, useDispatch } from "react-redux";
import { StartContainers } from "../api/StartContainers";
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
    float: "left",
    width: 126,
  },
  progressFloaat: {
    width: 160,
    padding: 0,
    marginTop: "10px",
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
  /* Getting the buildComplete state from redux store */
  const BuildComplete = useSelector(
    (state) => state.BuildReducer.BuildComplete
  );
  const BuildError = useSelector((state) => state.BuildReducer.BuildError);
  let promiseResolve;
  let promiseReject;
  const dispatch = useDispatch();
  useEffect((props) => {
    setBuildProgress(BuildComplete ? 100 : 0);
  }, [BuildComplete]);
  /* Starting the build process */
  const startBuild = (e) => {
    e.preventDefault();
    setStartButtonEnabledOrDisabled(true);
    setBuildStatusText("");
    let progressPercentage = 0;
    let ProcessName = "building";
    setBuildProgress(1);
    /* Stop containers so that changes take effect when containers are started in Test screen */
    StartContainers("stop").then((containerStart) => {
      let response = containerStart?.status_info?.status;
      if (response) {
        setBuildProgress(5);
        /* Calling the build api */
        buildContainer().then((buildResponse) => {
          setBuildViewFlag(true);
          let response = buildResponse?.data;
          response = JSON.stringify(response);
          setStartButtonEnabledOrDisabled(true);
          getStatus("build", promiseResolve, promiseReject);
        });
      } else {
        alert("Failed stop containers: " + containerStart?.status_info?.error_detail);
      }
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
            /* if the progress percentage for eg.goes from 10% back to 0% it signifies an error, check for the same */
            if (
              parseInt(progressPercentage) > parseInt(progressString.progress)
            ) {
              if (processName.includes("build")) {
                setBuildStatusText("Error");
                /* displatch the build completion status*/
                dispatch({
                  type: "BUILD_FAILED",
                  payload: {
                    BuildComplete: false,
                    BuildError: true,
                    BuildErrorMessage: "Error",
                  },
                });
                clearInterval(interval);
                setStartButtonEnabledOrDisabled(false);
                //rej("error");
              } 
            } else {
              progressPercentage = progressString.progress;
              /* Setting state value , progress bar % */
              setBuildProgress(parseInt(progressPercentage));
              if (progressPercentage == 100) {
                if (
                  ProcessName.includes("build") &&
                  progressString.status == "Success"
                ) {
                  dispatch({
                    type: "BUILD_COMPLETE",
                    payload: { BuildComplete: true, BuildError: false },
                  });
                }
                setStartButtonEnabledOrDisabled(false);
                clearInterval(interval);
                //res("Success");
              } else if (progressString.status == "Failed") {
                setStartButtonEnabledOrDisabled(false);
                if (processName.includes("build")) {
                  setBuildStatusText("Error");
                  /* displatch the build completion status*/
                  dispatch({
                    type: "BUILD_FAILED",
                    payload: {
                      BuildComplete: false,
                      BuildError: true,
                      BuildErrorMessage: "Error",
                    },
                  });
                  clearInterval(interval);
                  //rej("error");
                }
                clearInterval(interval);
                setStartButtonEnabledOrDisabled(false);
                //rej("error");
              }
            }
          }
        }),
      5000
    );
  };
  const viewLogs = (processname) => {
    setViewLogs(processname);
    setViewLogsDialog(true);
  };
  const closeViewLogs = () => {
    setViewLogsDialog(false);
  };
  const thumb = [];
  const isActive = props?.projectSetup?.noOfStreams === 0;
  return (
    <div className={`${isActive ? "root" : "root1"}`}>
      {isActive && <div className={classes.divPos}></div>}
      <p className={`${classes.texCenter} titleStyle`}>Configure & Build</p>
      <div className={`${classes.texCenter} startConfig`}>
        <button
          disabled={disableStartButton || isActive}
          className={"startConfigButton"}
          onClick={startBuild}
          id={
            disableStartButton ||
            isActive ||
            (BuildComplete == true && BuildError == false)
              ? "disableStart"
              : ""
          }
        >
          Start
        </button>
      </div>
      <div className={classes.divSpec}>
        <div className={classes.nameFloat}>
          <p>Build Containers</p>
        </div>
        <div className={classes.progressFloaat}>
          <LinearWithValueLabel
            className="progressBarConfig"
            value={BuildProgressPercentage}
          />
          <span className={BuildStatusText == "Error" ? "ErrorTextBuild" : ""}>
            {BuildStatusText == "Error"
              ? BuildStatusText
              : BuildProgressPercentage + "%"}
          </span>
        </div>
        <div>
          <button
            type="submit"
            disabled={isActive || !enableBuildView}
            className="viewButton"
            onClick={() => viewLogs("build")}
            id={isActive ? "disableStart" : ""}
          >
            View
          </button>
        </div>
        <div>
          <span class="col-sm-5" style={{marginLeft:150}}>
          <img id="cameraPreviewTN" src="" alt="No Preview" style={{ width:200, backgroundColor:"lightgray" }} ></img>
          </span>
        </div>
      </div>
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
