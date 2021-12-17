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
import DeployDynamic from "../configureModule/DeployDynamic";
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
import { compose } from "redux";
import GetStatusApi from "../api/GetStatusApi";
import { responsiveFontSizes } from "@material-ui/core";

const Deploy = (props) => {
  const [stateComponent, setStateComponent] = useState(props.stateComponent);

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

  function trimDigits(s) {
    return s.replace(/\d+$/, "");
  }

  function getDockerImageList() {
    let images = [];
    let comps = props.stateComponent.components;
    let nodes = props.stateComponent.selectedComponents.nodes;
    for (let i = 0; i < nodes.length; i++) {
      let compName = trimDigits(nodes[i].service);
      for (let j = 0; j < comps.length; j++) {
        if (compName == comps[j].dirName) {
          images.push(
            "openedgeinsights/" + comps[j].containerName + ":" + 
            process.env.REACT_APP_EII_VERSION
          );
        }
      }
    }
    // Include default images
    images.push(
      "openedgeinsights/ia_etcd_ui:" + process.env.REACT_APP_EII_VERSION
    );
    images.push("ia_config_mgragent:" + process.env.REACT_APP_EII_VERSION);
    return images;
  }
  /* Write the deploy to target device funcitonality inside this fun */
  const deployToTargetDeviceFunc = () => {
    let dockerImages = getDockerImageList();
    //TODO: Add progress indicator start
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
                  alert("Remote deployment successfully completed!");
                  //TODO: Add progress indicator stop
                  clearInterval(statusTimer);
                } else if (response.status == "Failed") {
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
        alert(
          "Remote deployent failed!: Reason: " +
            response?.status_info?.error_detail
        );
      }
    });
  };

  return (
    <div>
      <div class="container fluid" style={{ paddingBottom: "360px" }}>
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
          style={{ width: window.screen.width }}
        />
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
