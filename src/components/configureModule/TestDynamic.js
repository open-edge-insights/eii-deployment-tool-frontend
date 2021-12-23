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

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ComponentsLayout from "./ComponentsLayout";
import { connect } from "react-redux";
import "./TestDynamic.css";
import TestProfileSettings from "./TestProfileSettings";
import GetConfigApi from "../api/GetConfigApi";
import { StartContainers } from "../api/StartContainers";
import TextField from "@material-ui/core/TextField";
import UpdateConfigApi from "../api/UpdateConfigApi";
import StoreProjectApi from "../api/StoreProjectApi";
import { useDispatch } from "react-redux";
import Slider from "@material-ui/core/Slider";
import { CircularProgress } from "@material-ui/core";
import { getCameraConfig, setCameraConfig } from "../api/CameraConfigApi";

// import { MdReplay } from "react-icons/md";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function TestDynamic(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [NodeSelected, setNodeSelected] = useState("");
  const [TopicsRelatedToNode, setTopic] = useState("");
  const [udfConfigSelectedNode, setUDFconfigInfo] = useState({});
  const [updateArray, setUpdateFlag] = useState(false);
  const udfconfigCopy = udfConfigSelectedNode;
  const [enableSaveAndRestart, setEnableRestart] = useState(true);
  const [cameraPipeline, setCameraPipeline] = useState(null);
  const [cameraConfigSettings, setCameraSettings] = useState(null);
  const [progressIndicator, setShowProgress] = useState(false);
  const dispatch = useDispatch();
  let udfItems = [];
  let AlgorithmsUsed = "";
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    StartContainers("start")
      .then((containerStart) => {
        let response = containerStart?.data;
        if (response.status != "Failed") {
        }
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    if (NodeSelected) {
      //debugger;
      let TopicName = "";
      GetConfigApi.getconfig(
        ["WebVisualizer", NodeSelected],
        (e) => {
          let NodeSelectedUDFconfig = e.data && e.data[NodeSelected];
          let SubscriberArr =
            e.data && e.data.WebVisualizer.interfaces.Subscribers;
          /* check the subscriber array for the nodeselected by user and get the topic name*/
          for (let i in SubscriberArr) {
            if (SubscriberArr[i].PublisherAppName == NodeSelected) {
              TopicName = SubscriberArr[i].Topics[0];
              break;
            }
          }
          setTopic(TopicName);
          setUDFconfigInfo(NodeSelectedUDFconfig);
          /* Doing the following steps to get the required pipeline name */
          if (NodeSelected.startsWith("VideoIngestion")) {
            /* Clicking VI won't show preview */
            setCameraPipeline(null);
          } else if (NodeSelected.startsWith("VideoAnalytics")) {
            let publisherName =
              NodeSelectedUDFconfig.interfaces.Subscribers[0].PublisherAppName;
            console.log(publisherName, "subbbs");
            if (publisherName) {
              GetConfigApi.getconfig(
                [publisherName],
                (e) => {
                  let IngestionConfig = e.data && e.data[publisherName];
                  let videoPipeline = IngestionConfig.config.ingestor.pipeline;
                  if (videoPipeline?.startsWith("/dev/")) {
                    setCameraPipeline(videoPipeline);
                    getCameraApiFunc(videoPipeline);
                  } else {
                    setCameraPipeline(null);
                  }
                },
                (response) => {}
              ).catch((error) => {});
            } else {
              alert("Internal error: No publisher found!");
            }
          }
        },
        (response) => {}
      );
    }
  }, [NodeSelected]);

  function fixNonRangeValues(config) {
    for (let item in config) {
      if (config[item]["type"] == "bool") {
        config[item]["min"] = "0";
        config[item]["max"] = "1";
        config[item]["step"] = "1";
      }
    }
    return config;
  }
  /* Getting the camera config only when the pipeline path exists */
  const getCameraApiFunc = (pipelinePath) => {
    if (!pipelinePath.startsWith("/dev/")) {
      console.log("Not a camera pipeline: " + pipelinePath);
      return;
    }
    let cameraConfig = {
      configs: {},
    };
    cameraConfig.configs[pipelinePath] = ["*"];
    pipelinePath &&
      getCameraConfig(cameraConfig).then((cameraGetResponse) => {
        if (cameraGetResponse.status_info.status) {
          let cameraConfigResult = JSON.parse(cameraGetResponse?.data);
          cameraConfig = fixNonRangeValues(cameraConfigResult[pipelinePath]);
          setCameraSettings(null);
          setCameraSettings(cameraConfig);
        } else {
          console.log("Failed to get camera config");
        }
      });
  };
  const propstoTestDynamic = (NodeSelected) => {
    setNodeSelected((prevNodeSelected) =>
      prevNodeSelected != NodeSelected ? NodeSelected : ""
    );
  };
  const reactFlowchartProps = (
    enableImportBtn,
    NodeSelected,
    noOfStreams,
    updateConfigData
  ) => {
    setNodeSelected(NodeSelected);
  };
  const udfTextBox = () => {
    udfConfigSelectedNode?.config?.udfs.map((udfItem, index) => {
      for (let itemkey in udfItem) {
        if (!AlgorithmsUsed.includes(udfItem["name"]))
          AlgorithmsUsed = udfItem["name"] + " , " + AlgorithmsUsed;
        udfItems.push(
          <div className="webvisualizerUdfConfigArr">
            <span className="webvisualizerUdfConfigArrLabel col-sm-4">
              {itemkey}
            </span>
            <TextField
              className="webvisualizerUdfConfigArrTextField"
              fullWidth
              id={index}
              value={udfItem[itemkey]}
              variant="outlined"
              onChange={(e) => modifyUdfSettings(e, itemkey, index)}
            />
          </div>
        );
      }
    });
    return udfItems;
  };
  const modifyUdfSettings = (event, itemkey, modifiedudfindex) => {
    if (udfconfigCopy?.config?.udfs) {
      let udfKey = itemkey;
      let modifiedvalue = event.target.value;
      let modifiedUdf = udfConfigSelectedNode?.config?.udfs;
      let modifiedUdfIndex = modifiedudfindex;
      modifiedUdf.map((udfItem, udfItemIndex) => {
        for (let udfItemKey in udfItem) {
          if (udfItemKey == udfKey && udfItemIndex == modifiedUdfIndex) {
            udfItem[udfKey] = modifiedvalue;
          }
        }
      });
      udfconfigCopy.config.udfs = [...modifiedUdf];
      setUDFconfigInfo(udfconfigCopy);
      setUpdateFlag(!updateArray);
    }
  };
  /* Saving new config and then restarting containers */
  const saveAndRestartFunc = () => {
    setEnableRestart(false);
    setShowProgress(true);
    /* Set the updated config - calling set api */
    let config = {};
    config[NodeSelected] = udfconfigCopy;
    UpdateConfigApi.updateconfig({ ...config }, (response) => {
      console.log(response, "set apo");
      if (response?.status_info?.status) {
        StoreProjectApi.store(
          props.projectSetup.projectName,
          (response) => {
            StartContainers("restart")
              .then((response) => { setEnableRestart(true);setShowProgress(false);
                let status = response?.status_info?.status;
                if (status == false) {
                  setEnableRestart(true);
                  setShowProgress(false);
                }
              })
              .catch((error) => {
              setEnableRestart(true)
              setShowProgress(false);
                alert(
                  "Some error occured while restarting containers: " + error
                );
              });
          },
          (response) => {
            console.log(
              "Error saving project: ",
              response?.status_info.error_detail
            );
          }
        );
      }
    });
  };

  const resetCameraSettings = (e, item = null) => {
    if (!cameraPipeline) return;

    let cameraConfig = { configs: {} };
    cameraConfig.configs[cameraPipeline] = {};

    if (item) {
      cameraConfig.configs[cameraPipeline][item] = cameraConfigSettings[item].default
    } else {
      for (let i in cameraConfigSettings) {
        cameraConfig.configs[cameraPipeline][i] = cameraConfigSettings[i].default
      }
    }

    cameraConfig.configs &&
      setCameraConfig(cameraConfig).then((cameraSetResponse) => {
        getCameraApiFunc(cameraPipeline);
      });
  };

  const handleSliderChange = (key, value) => {
    console.log("in jandle slider");
    if (!cameraPipeline) return;
    let cameraConfig = { configs: {} };
    cameraConfig.configs[cameraPipeline] = {};
    cameraConfig.configs[cameraPipeline][key] = value;
    let tf = document.getElementById(key);
    tf.value = value;

    setCameraConfig(cameraConfig).then((cameraSetResponse) => {});
  };

  return (
    <div className="row col-sm-12  ">
      <div className="TestTabTitle">{props.projectSetup.projectName}</div>
      <div className="tabpan">
        <p className="textAlignCenter TestTabSubTitle">
          Data Streams & Components
        </p>
        <ComponentsLayout
          name={props.appName}
          updatedConfig={undefined}
          streamIds={undefined}
          displayConfigForm={false}
          enableImportBtn={reactFlowchartProps}
          propstoTestDynamic={propstoTestDynamic}
        />
      </div>
      <div className="pipelineSettingTitle TestTabSubTitle">
        {NodeSelected && "Pipeline settings"}
      </div>
      {progressIndicator ? (
        <div className="deploymentProgressBar" >
          <CircularProgress size={100} />
          <p className="deploymentProgressBarText">saving</p>
        </div>
      ) : (
      <div className="TestProfileSettingsInTestTab col-sm-5 WebVisualizerTestSettings">
        {/* <TestProfileSettings /> this space is for test profile settings tab - !important */}
        {NodeSelected && udfTextBox()}
        <div className="cameraConfigSettings">
            {cameraPipeline &&
              cameraConfigSettings &&
              Object.keys(cameraConfigSettings).map((item) => {
                return (
                  <div className="targetDeviceDeploytextFieldDiv">
                    <span className=" targetDeviceDeploytextFieldLabel col-sm-5">
                      {item}
                    </span>
                    <span>
                      <TextField
                        variant="outlined"
                        type="text"
                        className="cameraConfigVal"
                        id={item}
                        value={cameraConfigSettings[item]["value"]}
                        disabled = {cameraConfigSettings[item]["flags"]=="inactive"}
                      />
                    </span>
                    <span
                      className="col-sm-4"
                      style={{ paddingLeft: 15, paddingRight: 0, margin: 0 }}
                    >
                      <input
                        type="range"
                        defaultValue={cameraConfigSettings[item]["value"]}
                        aria-label="Camera config settings"
                        valueLabelDisplay="auto"
                        step={cameraConfigSettings[item]["step"]}
                        min={cameraConfigSettings[item]["min"]}
                        max={cameraConfigSettings[item]["max"]}
                        onChange={(e) => {
                          handleSliderChange(item, e.target.value);
                        }}
                        disabled = {cameraConfigSettings[item]["flags"]=="inactive"}
                      />
                    </span>
                    <span className="TestTabSliderResetBtn">
                      <input
                        id={item}
                        type="button"
                        className="cameraConfigReset"
                        value="<"
                        onClick={(e) => {
                          resetCameraSettings(e, item);
                        }}
                        disabled = {cameraConfigSettings[item]["flags"]=="inactive"}
                      />
                    </span>
                  </div>
                );
              })}
          <span>
          {cameraPipeline && cameraConfigSettings &&  <input
              type="button"
              className="cameraConfigResetAll col-sm-4"
              value="Reset all"
              onClick={resetCameraSettings}
            ></input>}
          </span>
        </div>
      </div>
      )}
      {progressIndicator ? (
        <div className="deploymentProgressBar" >
        </div>
      ) : (
      <div className="WebVisualizerSaveRestartBtnDiv col-sm-1">
        <button
          className="nextButtonMainPage WebVisualizerSaveRestartBtn"
          onClick={saveAndRestartFunc}
          disabled={!enableSaveAndRestart}
          id={enableSaveAndRestart ? "" : "disableSaveRestart"}
        >
          Save & Restart
        </button>
        {/* <button
          className="nextButtonMainPage deployScreenApplyBtn"
          // onClick={saveAndRestartFunc}
          // disabled={!enableSaveAndRestart}
        >
          Apply
        </button> */}
      </div>
      )}
      {progressIndicator ? (
        <div className="deploymentProgressBar" >
        </div>
      ) : (
      <div className="WebVisalizerPreviewTestDiv col-sm-4">
        <span className="WebVisalizerPrevie]wTestTitle">
          Algorithm : {AlgorithmsUsed}
          <br />
          Topic: {TopicsRelatedToNode}
        </span>
        {!TopicsRelatedToNode && (
          <div className="WebVisualizerNoPreview">No Preview available</div>
        )}
        {TopicsRelatedToNode && (
          <img
            className="WebVisalizerPreviewTestImg"
            src={`/webvisualizer/${TopicsRelatedToNode}`}
          />
        )}
      </div>
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    isOpen: state?.ConfigureBuildReducer?.getData?.isOpen,
    appName: state.ConfigureBuildReducer.getData.appName,
  };
};

export default connect(mapStateToProps, null)(TestDynamic);
