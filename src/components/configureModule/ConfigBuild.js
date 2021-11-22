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
  startProvisioning,
  getStatusPercentage,
  buildContainer,
} from "./configureAndBuildAction";
import { Report } from "@material-ui/icons";
import ViewLogs from "./ViewLogs";

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
  const [ProvisionProgressPercentage, setProvisionProgress] = useState(0);
  const [BuildProgressPercentage, setBuildProgress] = useState(0);
  const [ProvisionStatusText, setProvisioningText] = useState("");
  const [BuildStatusText, setBuildStatusText] = useState("");
  const [disableStartButton, setStartButtonEnabledOrDisabled] = useState(false);
  const [enableProvisionView, setProvisionViewFlag] = useState(false);
  const [enableBuildView, setBuildViewFlag] = useState(false);
  const [ViewProcessLogs, setViewLogs] = useState("");
  const [openViewLogDialog, setViewLogsDialog] = useState(false);
  let promiseResolve;
  let promiseReject;

  useEffect((props) => {}, []);
  /* Mayanka: Starting the provisioning & build process respectively*/
  const startProvisionProcessAndBuild = () => {
    setStartButtonEnabledOrDisabled(true);
    let progressPercentage = 0;
    let ProcessName = "provisioning";
    /* Mayanka: Calling the provisioning api first */
    startProvisioning().then((response) => {
      if (response?.status == 200) {
        setProvisioningText("Started");
        let prom = new Promise((res, rej) => {
          promiseResolve = res;
          promiseReject = rej;
          getStatus(ProcessName, promiseResolve, promiseReject);
        });
        prom
          .then(() => {
            /* Mayanka: Calling build api after provisioning is complete */
            buildContainer().then((buildResponse) => {
              setBuildViewFlag(true);
              let response = buildResponse?.data;
              response = JSON.stringify(response);
              if (response.status != "Failed") {
                setBuildStatusText("Started");
                setStartButtonEnabledOrDisabled(true);
                setBuildProgress(0);
                getStatus("build", promiseResolve, promiseReject);
              }
            });
          })
          .catch((error) => {});

        /* Mayanka: Calling the status api after success */
      } else if (response?.status == 200) {
        setProvisioningText("Error");
        setProvisionViewFlag(true);
        setStartButtonEnabledOrDisabled(false);

      }
    });
  };
  /* Mayanka: To get the update of progress percent call status api every 5 seconds */
  const getStatus = (processName, res, rej) => {
    let ProcessName = processName;
    let progressPercentage = 0;
    const interval = setInterval(
      () =>
        getStatusPercentage().then((response) => {
          if (response) {
            ProcessName.includes("provision")
              ? setProvisioningText("In Progress")
              : setBuildStatusText("In Progress");

            /* Mayanka: Get the progress % and convert it to integer */
            let progressString = JSON.parse(response.data);
            progressPercentage = progressString.progress;
            /* Mayanka: Setting state value , progress bar % */
            ProcessName.includes("provision")
              ? setProvisionProgress(parseInt(progressPercentage))
              : setBuildProgress(parseInt(progressPercentage));
            if (
              progressPercentage == 100 ||
              progressString.status == "Failed"
            ) {
              setStartButtonEnabledOrDisabled(false);
              ProcessName.includes("provision")
                ? setProvisioningText("Done")
                : setBuildStatusText("Done");
              setProvisionViewFlag(true);
              clearInterval(interval);
              res("Success");
            }
          } else {
            rej("error");
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
  console.log("dialog", openViewLogDialog);
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
          onClick={startProvisionProcessAndBuild}
          id={disableStartButton || isActive ? "disableStart" : ""}
        >
          Start
        </button>
      </div>
      <div className={classes.divSpec}>
        <div className={classes.nameFloat}>
          <p>Provisioning</p>
        </div>
        <div className={classes.progressFloaat}>
          <LinearWithValueLabel
            className="progressBarConfig"
            value={ProvisionProgressPercentage}
          />{" "}
          {ProvisionProgressPercentage + "%"}
          <span
            className={
              ProvisionStatusText == "Started" ||
              ProvisionStatusText == "In Progress"
                ? "Progress"
                : ProvisionStatusText == "Done"
                ? "Success"
                : "ErrorText"
            }
          >
            {/* {ProvisionStatusText} */}
          </span>
        </div>
        <div>
          <button
            type="submit"
            disabled={isActive || !enableProvisionView}
            onClick={() => viewLogs("provision")}
            className="viewButton"
            id={!enableProvisionView || isActive ? "disableStart" : ""}
          >
            View
          </button>
        </div>
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
          <span
          // className={
          //   BuildStatusText == "Started" || BuildStatusText == "In Progress"
          //     ? "Progress"
          //     : BuildStatusText == "Done"
          //     ? "Success"
          //     : "ErrorText"
          // }
          >
            {BuildProgressPercentage + "%"}
          </span>
        </div>
        <div>
          <button
            type="submit"
            disabled={isActive || !enableBuildView}
            className="viewButton"
            onClick={() => viewLogs("build")}
            id={!enableProvisionView || isActive ? "disableStart" : ""}
          >
            View
          </button>
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
