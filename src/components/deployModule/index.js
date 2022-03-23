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
import cssClasses from "../configureModule/index.module.css";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import BuilderApi from "../api/BuilderApi";
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Deploy = (props) => {
  const [stateComponent, setStateComponent] = useState(props.stateComponent);
  const [stopContainersInProgress, setStopContainersInProgress] = useState(false);
  const [deployRemoteInProgress, setDeployRemoteInProgress] = useState(false);
  const [progressIndicatorLabel, setprogressIndicatorLabel] = useState("");
  const [deployDevMode, setDeployDevMode] = useState(null);
  const [open, setOpen] = useState(false);
  const [DeployBuildProgressPercentage, setdeployBuildProgress] = useState(0);

  const handleClose = (event, reason) => {
    setOpen(false);
  };
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
    setDeployDevMode(e.target.value==="Dev");
    dispatch({
      type: "DEPLOYMENT_PROGRESS",
      payload: {
        DeploymentInProgress: true,
        DeployInDevOrProd: e.target.value,
      },
    });
  };
  const instance_count = useSelector(
    (state) => state.ConfigureBuildReducer.instance_count
  );
  
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
          let image =  process.env.REACT_APP_DOCKER_REGISTRY + "openedgeinsights/" + comps[j].containerName + ":" + 
            process.env.REACT_APP_EII_VERSION;
          if(!isItemFound(images, image))
            images.push(image);
        }
      }
    }
    // Include default images
    images.push(process.env.REACT_APP_DOCKER_REGISTRY + "openedgeinsights/ia_etcd_ui:" + process.env.REACT_APP_EII_VERSION);
    images.push( process.env.REACT_APP_DOCKER_REGISTRY + "ia_configmgr_agent:" + process.env.REACT_APP_EII_VERSION);
    return images;
  }
  function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))    {
      return true;
    }
    return false;
  }
  function onDeployToTargetDevice() {
    if(!ValidateIPaddress(targetDeviceObject.ipaddress.value.trim())) {
      alert("Please enter a valid IP address");
      return;
    }
    /* set dev/prod mode and then deploy in remote machine*/
    BuilderApi.builder(
      getServicesToDeploy(),
      instance_count,
      false,
      deployDevMode,
      (configresponse, statusresponse) => {
        if (statusresponse?.data?.status_info.status) {
          deployToTargetDeviceFunc();
        }
      });
  }
  /* Write the deploy to target device funcitonality inside this fun */
  const deployToTargetDeviceFunc = () => {
    setDeployRemoteInProgress(true);
    dispatch({
      type: "DEPLOY_IN_REMOTE_MACHINE",
      payload: {
        DeployInRemoteMachine: true,
      },
    });
    let progressString;
    let progressPercentage=0;
    
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
                if(response){
                  progressString = response;
                  console.log(progressString);
                  progressPercentage = progressString.progress;
                  console.log(progressPercentage);
                  if(progressPercentage > 0){
                  setdeployBuildProgress(parseInt(progressPercentage)); 
                  }else{
                    setdeployBuildProgress(1); 
                  }
                if (progressString.task == "deploy" && progressString.status == "Success" && progressPercentage==100)  {
                  setDeployRemoteInProgress(false);
                  setprogressIndicatorLabel("");
                  setTimeout(() => {
                    alert("Remote deployment successfully completed!");
                  }, 500);
                  
                  dispatch({
                    type: "DEPLOY_IN_REMOTE_MACHINE",
                    payload: {
                      DeployInRemoteMachine: false,
                    },
                  });
                  dispatch({
                    type: "DEPLOYMENT_PROGRESS",
                    payload: {
                      DeployInLocalMachineProgress: false,
                    },
                  });  
                  clearInterval(statusTimer);
                } 
              else if (response.status == "Failed") {
                  setDeployRemoteInProgress(false);
                  setprogressIndicatorLabel("");
                  dispatch({
                    type: "DEPLOY_IN_REMOTE_MACHINE",
                    payload: {
                      DeployInRemoteMachine: false,
                    },
                  });
                  dispatch({
                    type: "DEPLOYMENT_PROGRESS",
                    payload: {
                      DeployInLocalMachineProgress: false,
                    },
                  });
                  alert("Remote deployment FAILED!");
                  clearInterval(statusTimer);
                }
              }
              },
              (response) => {
              if(response?.message?.includes("status code 504")){
                  setOpen(true);
                  }
                  else{
                alert(
                  "Failed to get status! reason: " +
                    response?.data?.status_info?.error_detail
                );
                }
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
        <div className="tabpan" style={{height: "500px"}}>
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
        {(DeployInLocalMachineProgress) ? (
          <div className="deploymentProgressBar" >
            <CircularProgress size={100}  />
            <p className="deploymentProgressBarText">{DeployInLocalMachineProgress?"Deploying to localhost" : progressIndicatorLabel}</p>
          </div>
        ) : 
        ( deployRemoteInProgress || DeployInRemoteMachine) ? (
        <div className="deploymentProgressBar" >
          <div style = {{maxWidth:"100px" }}>
          <CircularProgressbar value={DeployBuildProgressPercentage} text={`${DeployBuildProgressPercentage}%`} size={100}/>
          </div>
          <p className="deploymentProgressBarText">{deployRemoteInProgress?"Deploying to " + targetDeviceObject.ipaddress.value : ""}</p>
        </div>
      ) : (
        <div class="row" style={{paddingTop: "10px"}}>
          <div class="col-sm-12 deploymentscreenOptions" style={{ padding: 0 }}>
            <div style={{ marginBottom: "0px" }} className="col-sm-5">
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
              <div className="TestTabSubTitle">Deploy in remote machine</div>
              <div style={{width:"100%", margin:"auto", paddingTop:"15px"}}>
              {Object.keys(targetDeviceObject).map((targetItemKey) => {
                return (
                  <div className="deployToTargetDevice">
                    <label 
                      style={{width:"90px"}}>
                      {targetDeviceObject[targetItemKey].title} 
                    </label>
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
              </div>
              <button
                className={(targetDeviceObject.ipaddress.value.trim() == "" ||
                targetDeviceObject.username.value.trim() == "" ||
                targetDeviceObject.password.value.trim() == "" ||
                targetDeviceObject.directory.value.trim() == "" || 
                deployDevMode == null)?"nextButtonMainPageDisabled nextButtonMainPage deployToTargetDeviceBtn ":" nextButtonMainPage deployToTargetDeviceBtn"}
                onClick={onDeployToTargetDevice}
                disabled={(targetDeviceObject.ipaddress.value.trim() == "" ||
                targetDeviceObject.username.value.trim() == "" ||
                targetDeviceObject.password.value.trim() == "" ||
                targetDeviceObject.directory.value.trim() == "" || deployDevMode == null)}
                
              >
                Deploy to target device
              </button>
            </div>
          </div>
        </div>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} style={{color:"white", backgroundColor:"#0068B5"}} anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }} style={{color:"white", backgroundColor:"#0068B5"}}>
          <h8>Connection Lost</h8>
          <p>Connection with the back-end server lost. Try again later.</p>
        </Alert>
      </Snackbar>
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
