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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { useSelector, useDispatch } from "react-redux";
import ComponentsLayout from "../configureModule/ComponentsLayout";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { DeployRemote } from "../api/DeployRemote";
import "./deployModule.css";
import GetStatusApi from "../api/GetStatusApi";
import { CircularProgress } from "@material-ui/core";
import cssClasses from "../configureModule/index.module.css"
const Deploy = (props) => {
  const [stateComponent, setStateComponent] = useState(props.stateComponent);
  const [stopContainersInProgress, setStopContainersInProgress] = useState(false);
  const [deployRemoteInProgress, setDeployRemoteInProgress] = useState(false);
  const [progressIndicatorLabel, setprogressIndicatorLabel] = useState("");
  
  const DeployInLocalMachineProgress = useSelector(
    (state) => state.DeploymentReducer.DeployInLocalMachineProgress
  );
  const DeployInRemoteMachine = useSelector(
    (state) => state.DeploymentReducer.DeployInRemoteMachine
  );
  useEffect(() => {
    setStateComponent(props.stateComponent);
  }, [props.stateComponent]);

  const dispatch = useDispatch();
  /* Getting deployment status from redux store */
  const DeploymentComplete = useSelector(
    (state) => state.DeploymentReducer.DeploymentComplete
  );
  const [targetDeviceObject, setTargetDevice] = useState({
    ipaddress: { title: "IP Address", value: "" },
    username: { title: "Username", value: "" },
    password: { title: "Password", value: "" },
    directory: { title: "Directory", value: "" },
  });
  const [updationFlag, setUpdationFlag] = useState(false);
  const deployIn = (e) => {
    dispatch({
      type: "DEPLOYMENT_PROGRESS",
      payload: {
        DeploymentInProgress: true,
        DeployInDevOrProd: e.target.value,
      },
    });
  };
  /* Setting the updated target device object parameters */
  const setTargetDeviceValue = (e, key) => {
    let modifiedValue = e.target.value;
    let targetObj = targetDeviceObject;
    let targetObjKey = key;
    targetObj[targetObjKey].value = modifiedValue;
    setTargetDevice(targetObj);
    setUpdationFlag(!updationFlag);
  };

  function isItemFound(arr, item) {
    let itemFound = false;
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === item) {
        itemFound = true;
        break;
        }
    }
    return itemFound;
  }

  function trimDigits(s) {
    return s.replace(/\d+$/, "");
  }
  
  function getDockerImageList() {
    let images = [];
    let comps = props.stateComponent.components;
    let nodes = props.stateComponent.selectedComponents.nodes;
    let includeWV = props.stateComponent.selectedComponents.showWebVisualizer;
    for (let i = 0; i < nodes.length; i++) {
      let compName = trimDigits(nodes[i].service);
      for (let j = 0; j < comps.length; j++) {
        if (compName == comps[j].dirName && (compName != "WebVisualizer" || includeWV)) {
          let image = "openedgeinsights/" + comps[j].containerName + ":" + 
            process.env.REACT_APP_EII_VERSION;
          if(!isItemFound(images, image))
            images.push(image);
        }
      }
    }
    // Include default images
    images.push(
      "openedgeinsights/ia_etcd_ui:" + process.env.REACT_APP_EII_VERSION
    );
    images.push("ia_configmgr_agent:" + process.env.REACT_APP_EII_VERSION);
    return images;
  }
  /* Write the deploy to target device funcitonality inside this fun */
  const deployToTargetDeviceFunc = () => {
  dispatch({
      type: "DEPLOY_IN_REMOTE_MACHINE",
      payload: {
        DeployInRemoteMachine: true,
      },
    });
    if(targetDeviceObject.ipaddress.value.trim() == "" ||
      targetDeviceObject.username.value.trim() == "" ||
      targetDeviceObject.password.value.trim() == "" ||
      targetDeviceObject.directory.value.trim() == "") {
        alert("Please enter all the fields");
        return;
    }
    setDeployRemoteInProgress(true);
    setprogressIndicatorLabel("Deploying to " + targetDeviceObject.ipaddress.value);
    let dockerImages = getDockerImageList();
    DeployRemote(
      dockerImages,
      targetDeviceObject.ipaddress.value,
      targetDeviceObject.username.value,
      targetDeviceObject.password.value,
      targetDeviceObject.directory.value
    ).then((response) => {
      if (response.status_info.status) {
        let statusTimer = setInterval(
          () =>
            GetStatusApi.getstatus(
              (response) => {
                if (response.status == "Success") {
                  setDeployRemoteInProgress(false);
                  setprogressIndicatorLabel("");
                  alert("Remote deployment successfully completed!");
                  dispatch({
                    type: "DEPLOY_IN_REMOTE_MACHINE",
                    payload: {
                      DeployInRemoteMachine: false,
                    },
                  });
                  clearInterval(statusTimer);
                } else if (response.status == "Failed") {
                  setDeployRemoteInProgress(false);
                  setprogressIndicatorLabel("");
                  dispatch({
                    type: "DEPLOY_IN_REMOTE_MACHINE",
                    payload: {
                      DeployInRemoteMachine: false,
                    },
                  });
                  alert("Remote deployment FAILED!");
                  clearInterval(statusTimer);
                }
              },
              (response) => {
                alert(
                  "Failed to get status! reason: " +
                    response?.data?.status_info?.error_detail
                );
              }
            ),
          5000
        );
      } else {
        setDeployRemoteInProgress(false);
        setprogressIndicatorLabel("");
        dispatch({
                    type: "DEPLOY_IN_REMOTE_MACHINE",
                    payload: {
                      DeployInRemoteMachine: false,
                    },
                  });
        alert(
          "Remote deployent failed!: Reason: " +
            response?.status_info?.error_detail
        );
      }
    });
  };

  return (
    <div className={cssClasses.root}>
      <div class="row createProjectWrapper">
        <div className="tabpan">
          <p className="textAlignCenter TestTabSubTitle">
            Data Streams & Components
          </p>
          <ComponentsLayout
            name={props?.projectSetup?.projectName}
            updatedConfig={undefined}
            streamIds={undefined}
            displayConfigForm={false}
            enableImportBtn={undefined}
            propstoTestDynamic={undefined}
          />
        </div>
        <hr
          className="deployScreenDivider"          
        />
        {(DeployInLocalMachineProgress || deployRemoteInProgress || DeployInRemoteMachine) ? (
        <div className="deploymentProgressBar" >
          <CircularProgress size={100} />
          <p className="deploymentProgressBarText">{DeployInLocalMachineProgress?"Deploying to localhost" : progressIndicatorLabel}</p>
        </div>
      ) : (
        <div class="row">
          <div class="col-sm-12 deploymentscreenOptions" style={{ padding: 0 }}>
            <div style={{ marginBottom: 10 }} className="col-sm-5">
              <FormControl component="fieldset">
                <RadioGroup aria-label="quiz" name="quiz" onChange={deployIn}>
                  <div className="TestTabSubTitle bottomPaddingCustom">
                    Deploy in local machine
                  </div>
                  <FormControlLabel
                    className="DeployScreenRadioBtn"
                    value="Dev"
                    control={<Radio color="primary" />}
                    label="Dev"
                  />

                  <FormControlLabel
                    className="DeployScreenRadioBtn"
                    value="Prod"
                    control={<Radio color="primary" />}
                    label="Prod"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className=" col-sm-6">
              <div className="TestTabSubTitle">Deploy in target device</div>
              {Object.keys(targetDeviceObject).map((targetItemKey) => {
                return (
                  <div className="deployToTargetDevice">
                    <span className="targetDeviceDeploytextFieldLabel col-sm-3">
                      {targetDeviceObject[targetItemKey].title}
                    </span>
                    <TextField
                      type={targetItemKey == "password" ? "password" : "text"}
                      variant="outlined"
                      className="webvisualizerUdfConfigArrTextField"
                      value={targetDeviceObject[targetItemKey].value}
                      onChange={(e) => setTargetDeviceValue(e, targetItemKey)}
                    />
                  </div>
                );
              })}
              <button
                className="nextButtonMainPage WebVisualizerSaveRestartBtn deployToTargetDeviceBtn"
                onClick={deployToTargetDeviceFunc}
              >
                Deploy to target device
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  var componentsData = state.ConfigureBuildReducer.componentsInitialState;
  return {
    stateComponent: componentsData,
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
  };
};
export default connect(mapStateToProps, null)(Deploy);
