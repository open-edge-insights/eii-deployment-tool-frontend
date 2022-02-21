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

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
} from "react-flow-renderer";
import "./ComponentsLayout.css";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import GetConfigApi from "../api/GetConfigApi";
import getLayoutedElements from "./LayoutElement";
import ActionType from "../../actionTypes/index";
import errorIcon from "../images/error.png";
import blankIcon from "../images/blank.png";
import BuilderApi from "../api/BuilderApi";
import StoreProjectApi from "../api/StoreProjectApi";
import GetStatusApi from "../api/GetStatusApi";
import UpdateConfigApi from "../api/UpdateConfigApi";
import { StartContainers } from "../api/StartContainers";
import { connect } from "react-redux";
import ConfigForm from "./ConfigForm";
import Slide from "@material-ui/core/Slide";
import _ from "lodash";
import horizontal from "../../images/horizontal.png";
import vertical from "../../images/vertical.png";
import LoadCompApi from "../api/LoadCompApi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./../common/modal";
import {
  getCameraStatus,
  startCamera,
  stopCamera,
} from "../api/CameraStreamApi";

var timer = null;
const initialElements = [];
const layoutedElements = getLayoutedElements(initialElements);
var edges = [];
var currentSelectedCompName = "";
var flowText = "";
var gId = 0;
const getId = () => `${gId++}`;
var currentSelectedComp = {};
const DT_CONFIG_KEY = "__dt_config__";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
const ComponentsLayout = (props) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [openFileEdit, setOpenFileEdit] = useState(false);
  const [stateComponent, setStateComponent] = useState(props.stateComponent);
  const [elements, setElements] = useState([layoutedElements]);
  const [open, setOpen] = useState(false);
  const [ctxopen, setContextMenuOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState(false);
  const [alertConfigUDF, setAlertConfigUDF] = useState(false);
  const [alertConfigInvalid, setAlertConfigInvalid] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [statusIcon, setStatusIcon] = useState(null);
  const [show, setShow] = useState(false);
  const [enableImportButton, setImportBtnActive] = useState(false);
  const [NodeSelected, setNodeSelected] = useState("");
  const [streamCount, setStreamCount] = useState(0);
  const [executeUdffunc, setexecuteUdf] = useState(false);
  const [progressIndicator, setShowProgress] = useState(false);
  const [cameraSource, setCameraSource] = useState(props.cameraSource);
  const [openAlreadyExistDialog, setOpenAlreadyExistDialog] = useState(false);
  const [dropFlag, setDropFlag] = useState(false);
  const [modalContent, setModalContent] = useState(
    "This component will be removed from the datastream. Do you wish to remove?"
  );
  const [modalTitle, setModalTitle] = useState("Remove Data Stream");
  const [button1Text, setButton1Text] = useState("Yes");
  const [button2Text, setButton2Text] = useState("No");
  const [elementsToremoveState, SetElementsToRemove] = useState();
  const [canEditSettings, setCanEditSettings] = useState(true);
  const [proceedWithChangeAfterBuildEvent, setProceedChange] = useState();
  const [clickedFromForm, setClickedFromForm] = useState(false);
  const [displayBuildAlertFromConfigForm, setDisplayBuildAlertFromConfigForm] =
    useState(true);
  let currentComponentData = { ...stateComponent };
  const dispatch = useDispatch();
  let promiseResolve;
  let promiseReject;
  /* Importing project selection is active variable from redux store */
  const ProjectSelectionActive = useSelector(
    (state) => state.ProjectSelectionReducer.projectSelection
  );
  const BuildProgress = useSelector(
    (state) => state.BuildReducer.BuildProgress
  );
  const BuildError = useSelector(
    (state) => state.BuildReducer.BuildError
  );
  useEffect(() => {
    setStateComponent(props.stateComponent);
  }, [props.stateComponent]);

  /* Modifying the configeration as soon as we get the updated config */
  useEffect(() => {
    let selectedStreamId = props.streamIds;
    let selectedNodeLabel;
    let selectedStreamLabels = [];
    let duplicateUdfFlag = false;
    let selectedUdfName = props.updatedConfig && props.updatedConfig.name;
    /*putting the selected nodes together in an array using its id eg: [videingestion1 , videoingestion2] */
    for (let i in selectedStreamId) {
      selectedNodeLabel = "";
      if (selectedStreamId.length == 1) {
        selectedNodeLabel = NodeSelected;
      } else {
        selectedNodeLabel =
          NodeSelected.replace(/\d+$/, "") + selectedStreamId[i];
      }
      selectedStreamLabels.push(selectedNodeLabel);
    }
    /* get the config of the selected node-calling get api */
    props.updatedConfig &&
      selectedStreamId &&
      selectedStreamId.length > 0 &&
      NodeSelected &&
      GetConfigApi.getconfig(
        selectedStreamLabels,
        (e) => {
          var previousConfig = e && e.data;
          previousConfig && Object.assign(previousConfig[selectedNodeLabel]);
          if (props.updatedConfig) {
            for (let key in previousConfig) {
              let udfsExisting = previousConfig[key].config.udfs;
              for (let itemKey in udfsExisting) {
                /* Check of the user is trying to import already exisiting udf */
                if (udfsExisting[itemKey].name == selectedUdfName) {
                  alert("Duplicate udf cannot be added");
                  duplicateUdfFlag = true;
                  break;
                }
              }
            }
          }
          if (props.updatedConfig && !duplicateUdfFlag) {
            /* Update the exisiting config by appending the seelcted config to the selected node */
            for (let key in previousConfig) {
              previousConfig[key].config.udfs.push(props.updatedConfig);
              let comps = currentComponentData.selectedComponents.nodes;
              for (let i = 0; i < comps.length; i++) {
                if (comps[i].data.name == key) {
                  comps[i].config = previousConfig[key].config;
                  refreshComponentLabel(comps[i]);
                }
              }
            }
            /* Set the updated config - calling set api */
            UpdateConfigApi.updateconfig(
              { ...previousConfig },
              (respons) => {
                setNodeSelected("");
                setAlertConfigUDF(true);
                setOpen(false);
                saveProject();
              },
              (responsedata) => {}
            );
          }
        },
        (response) => {}
      );
  }, [props.streamIds]);

  useEffect(() => {
    if (reactFlowInstance && elements.length) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance, elements]);

  useEffect(() => {
    var TB = "TB";
    onLayout(TB);
  }, [props.stateComponent, progressIndicator]);

  if (currentComponentData.selectedIndex >= 0)
    currentSelectedComp =
      currentComponentData.selectedComponents.nodes[
        currentComponentData.selectedIndex
      ];

  const onLayout = useCallback(
    (direction) => {
      const layoutedElements = getLayoutedElements(elements, direction);
      setElements(layoutedElements);
    },
    [elements]
  );

  function trimDigits(s) {
    return s.replace(/\d+$/, "");
  }

  function getDigits(s) {
    let digits = s.match(/\d+$/);
    if (digits) {
      setStreamCount(digits[0]);
      return digits[0];
    }
    return "";
  }

  const handleClose = () => {
    setOpen(false);
  };
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  if (timer) {
    clearInterval(timer);
  }

  const handleAlertClose = (event) => {
    setAlertConfig(false);
    setAlertConfigInvalid(false);
    setAlertConfigUDF(false);
  };

  const updateSelectedIdex = (data) => {
    if (data && data.data && data.data.name) {
      for (
        let i = 0;
        i < currentComponentData.selectedComponents.nodes.length;
        i++
      ) {
        if (
          currentComponentData.selectedComponents.nodes[i].data.name ===
          data.data.name
        ) {
          currentComponentData.selectedIndex = i;
          props.dispatchComponents(currentComponentData);
          break;
        }
      }
    }
  };

  const updateConfigData = (service, data) => {
    let stat = false;
    try {
      JSON.stringify(data);
    } catch (err) {
      return false;
    }

    if (data && "config" in data && "interfaces" in data) {
      for (
        let i = 0;
        i < currentComponentData.selectedComponents.nodes.length;
        i++
      ) {
        if (
          currentComponentData.selectedComponents.nodes[i].data.name === service
        ) {
          currentComponentData.selectedIndex = i;
          stat = true;
          break;
        }
      }

      if (stat) {
        let config = {};
        config[service] = { config: data.config, interfaces: data.interfaces };
        console.log(config);
        UpdateConfigApi.updateconfig(
          { ...config },
          (data) => {
            if (data.status_info.status) {
              saveProject();
              setAlertConfig(true);
            } else {
              alert(
                "Failed to update config. Reason: " +
                  data.status_info.error_detail
              );
            }
            refreshComponentLabel(currentSelectedComp);
          },
          (response) => {
            stat = false;
            setAlertConfigInvalid(true);
          }
        );
        makeNodeConnections();
        props.dispatchComponents(currentComponentData);
      }
    }
    return stat;
  };

  const handlePaneClick = (event) => {
    setOpen(false);
    setImportBtnActive(false);
    setNodeSelected("");
  };

  function startCameraPreview(pipeline) {
    if (pipeline.length <= 1) {
      alert("Unsupported camera device id:" + pipeline);
      return;
    }
    let config = { devices: [], width: 200 };
    config.devices.push(pipeline);
    getCameraStatus(config).then((response) => {
      let data = JSON.parse(response.data);
      if (data[pipeline].status == "Not Running") {
        startCamera(config).then((response) => {
          if (response?.status_info?.status) {
            let sdata = JSON.parse(response.data);
            if (sdata[pipeline].status == "Running") {
              let stream_id = sdata[pipeline].stream_id;
              setCameraSource("/eii/ui/camera/stream/" + stream_id);
            } else {
              console.log("Camera ", pipeline, "Not running!");
            }
          } else {
            console.log("Camera Start API failed");
          }
        });
      } else if (data[pipeline].status == "Running") {
        let stream_id = data[pipeline].stream_id;
        setCameraSource("/eii/ui/camera/stream/" + stream_id);
      }
    });
  }
  function stopCameraPreview() {
    let imageElem = document.getElementById("cameraPreviewTN");
    let config = { devices: [] };
    stopCamera(config).then((response) => {
      if (response.status_info.status) {
        setCameraSource("");
        if (imageElem) imageElem.src = "";
      }
    });
  }

  const handleElementClick = (event, data) => {
    if (getComponentById(data.id) == null) {
      setNodeSelected(null);
      setImportBtnActive(false);
      return;
    }
    setNodeSelected(data.data.name);
    currentComponentData.selectedComponents.currSelectedCompName =
      data.data.name;
    setImportBtnActive(getComponentObject(data.data.name).hasVideoUdf);
    props.propstoTestDynamic && props.propstoTestDynamic(data.data.name);
    updateSelectedIdex(data);
    event.preventDefault();
    var services = [data.data.name];
    GetConfigApi.getconfig(
      services,
      (e) => {
        var response = e.data;
        var configData = {};
        Object.keys(response).map((el) => {
          if (el == data.data.name) {
            configData = response[el];
          }
        });

        currentSelectedComp.config = configData.config;
        currentSelectedComp.interfaces = configData.interfaces;
        currentSelectedComp.data = data.data;
        refreshComponentLabel(currentSelectedComp);
        setOpen(false);
        setOpen(true);
      },
      (response) => {
        alert("failed to get config for " + JSON.stringify(services));
      }
    );
  };

  const onContextMenu = (event, data) => {
    currentSelectedCompName = data.data.name;

    setContextMenuOpen(true);
    event.stopPropagation();
    event.preventDefault();
  };

  const onConfigCancel = (event) => {
    setOpen(false);
    event.stopPropagation();
  };
  const BuildComplete = useSelector(
    (state) => state.BuildReducer.BuildComplete
  );
  const showBuildAlert = useSelector(
    (state) => state.BuildReducer.showBuildAlert
  );
  useEffect(() => {
    if (BuildComplete) {
      setCanEditSettings(false);
      setDisplayBuildAlertFromConfigForm(true);
    }
  }, [BuildComplete]);

  const onConfigOK = (event, data) => {
    if (BuildComplete) {
      dispatch({
        type: "BUILD_COMPLETE",
        payload: {
          BuildComplete: false,
          BuildError: false,
          BuildErrorMessage: "",
        },
      });
    }
    currentSelectedComp.config = data.config;
    currentSelectedComp.interfaces = data.interfaces;
    let stat = updateConfigData(currentSelectedComp.data.name, data);

    event.preventDefault();
    event.stopPropagation();
  };

  const onFileEditCancel = (event) => {
    setOpenFileEdit(false);
    event.stopPropagation();
  };

  function isEdgeExists(id) {
    for (let i = 0; i < edges.length; i++) {
      if (edges[i].id === id) return true;
    }
    return false;
  }

  function getComponentById(id) {
    var comps = currentComponentData.selectedComponents.nodes;
    let n = comps.length;
    for (var i = 0; i < n; i++) {
      if (comps[i].id === id) return comps[i];
    }
    return null;
  }

  function getNewPSName(appName, ps) {
    if (ps !== "Publishers" && ps !== "Subscribers") {
      return null;
    }
    let comps = currentComponentData.selectedComponents.nodes;
    let psFound = true;
    var psName = "";
    for (let cnt = 1; psFound && cnt < 100; cnt++) {
      psName = appName + "_" + ps.slice(0, -1) + "_" + cnt;
      psFound = false;
      for (let i = 0; i < comps.length && !psFound; i++) {
        let intf = comps[i].interfaces[ps];
        if (!intf) {
          continue;
        }
        for (let j = 0; j < intf.length; j++) {
          if (psName === intf[j].Name) {
            psFound = true;
            break;
          }
        }
      }
    }
    return psName;
  }

  function getNewEndPoint(ipAddress) {
    let comps = currentComponentData.selectedComponents.nodes;
    let portFound = true;
    var port;
    for (port = 6100; portFound && port < 6399; port++) {
      portFound = false;
      for (let i = 0; i < comps.length && !portFound; i++) {
        let ps = ["Publishers", "Subscribers"];
        for (let k = 0; k < ps.length && !portFound; k++) {
          let intf = comps[i].interfaces[ps[k]];
          if (!intf) {
            continue;
          }

          for (let j = 0; j < intf.length; j++) {
            if (
              intf[j].EndPoint === undefined ||
              intf[j].EndPoint.indexOf(":") < 0
            ) {
              continue;
            }
            if (port === parseInt(intf[j].EndPoint.split(":")[1])) {
              portFound = true;
              break;
            }
          }
        }
      }
    }
    port--;
    return ipAddress + ":" + port;
  }

  function addConnectableInterface(src, trg, type = "zmq_tcp") {
    if (src.interfaces.Publishers && src.interfaces.Publishers.length > 0) {
      let sIntf = src.interfaces.Publishers[0];
      let srcInstance = getDigits(src.data.name);
      let trgEndPoint = null;
      if (type === "zmq_tcp") {
        trgEndPoint =
          src.containerName + srcInstance + ":" + sIntf.EndPoint.split(":")[1];
      } else {
        trgEndPoint = sIntf.EndPoint;
      }
      let tIntf = {
        Name: getNewPSName(trg.data.name, "Subscribers"),
        Type: sIntf.Type,
        EndPoint: trgEndPoint,
        Topics: sIntf.Topics,
        PublisherAppName: src.data.name,
        ref: 0,
      };
      if (!isIn(trg.data.name, sIntf.AllowedClients))
        sIntf.AllowedClients.push(trg.data.name);
      if (trg.interfaces.Subscribers) {
        trg.interfaces.Subscribers.push(tIntf);
      } else {
        trg.interfaces["Subscribers"] = [tIntf];
      }
    } else {
      var endPoint = getNewEndPoint("127.0.0.1");
      let sIntf = {
        Name: getNewPSName(src.data.name, "Publishers"),
        Type: type,
        EndPoint: endPoint,
        Topics: [src.data.name + "_topic"],
        AllowedClients: [trg.data.name],
        ref: 0,
      };
      let tIntf = {
        Name: getNewPSName(trg.data.name, "Subscribers"),
        Type: type,
        EndPoint: endPoint,
        Topics: [src.data.name + "_topic"],
        PublisherAppName: src.data.name,
        ref: 0,
      };

      if (src.interfaces.Publishers) {
        src.interfaces.Publishers.push(sIntf);
      } else {
        src.interfaces["Publishers"] = [sIntf];
      }
      if (trg.interfaces.Subscribers) {
        trg.interfaces.Subscribers.push(tIntf);
      } else {
        trg.interfaces["Subscribers"] = [tIntf];
      }
    }
  }

  const onConnect = (params) => {
    var eid = "e" + params.source + "-" + params.target;
    if (isEdgeExists(eid)) return false;

    let src = getComponentById(params.source);
    if (!src) {
      return false;
    }
    let trg = getComponentById(params.target);
    if (!trg) {
      return false;
    }
    addConnectableInterface(src, trg);
    makeNodeConnections();
  };

  function checkAndRemoveEdgeInterfaces(a, b) {
    var intf = getConnectableInterfaces(a, b);
    if (intf) {
      if (intf.pub) {
        if (intf.pub.ref - 1 < 1) {
          intf.pub.ref--;
          a.interfaces.Publishers.splice(intf.pi, 1);
        }
        if (intf.sub.ref - 1 < 1) {
          intf.sub.ref--;
          b.interfaces.Subscribers.splice(intf.si, 1);
        }
      } else if (intf.ser) {
        if (intf.ser.ref - 1 < 1) {
          intf.ser.ref--;
          a.interfaces.Servers.splice(intf.si, 1);
        }
        if (intf.cli.ref - 1 < 1) {
          intf.cli.ref--;
          b.interfaces.Clients.splice(intf.ci, 1);
        }
      }
    }
  }

  function checkAndRemoveInterfaces(a) {
    var comps = currentComponentData.selectedComponents.nodes;
    for (let i = 0; i < comps.length; i++) {
      var b = comps[i];
      if (a.id === b.id) continue;
      checkAndRemoveEdgeInterfaces(a, b);
      checkAndRemoveEdgeInterfaces(b, a);
    }
  }

  const onElementsRemove = (elementsToRemove) => {
    if (BuildProgress > 0 && BuildProgress < 100 && !BuildError) {
      alert("Sorry, you can't delete component when a build is in progress.");
      handlePaneClick();
      return false;
    }
    // Check if backend is busy
    if (props.displayConfigForm == true) {
      if (
        currentComponentData.selectedComponents.activeTask &&
        currentComponentData.selectedComponents.activeTask != ""
      ) {
        alert(
          "Failed to remove elements. Reason: An active " +
            currentComponentData.selectedComponents.activeTask +
            " task is already in progress.\nPlease wait."
        );
        handlePaneClick();
        return false;
      }
      // Check if switching to single instance
      if (getInstanceCount() == 2) {
        var comps = currentComponentData.selectedComponents.nodes;
        for (let i = 0; i < elementsToRemove.length; i++) {
          for (let j = 0; j < comps.length; j++) {
            if (comps[j].id === elementsToRemove[i].id) {
              if (
                comps[j].dirName.startsWith("VideoIngestion") ||
                comps[j].dirName.startsWith("VideoAnalytics")
              ) {
                if (
                  window.confirm(
                    "Switching to single instance.\nComponents will be reset and " +
                      "all settings applied to them will be lost.\n\nDo you want to continue?"
                  ) == false
                ) {
                  handlePaneClick();
                  return false;
                }
              }
            }
          }
        }
      }

      setOpen(false);
      var nodeRemoved = false;
      var comps = currentComponentData.selectedComponents.nodes;
      for (let i = 0; i < elementsToRemove.length; i++) {
        for (let j = 0; j < comps.length; j++) {
          if (comps[j].id === elementsToRemove[i].id) {
            if (comps[j].dirName.startsWith("WebVisualizer")) {
              comps[j].isHidden = true;
              currentComponentData.selectedComponents.showWebVisualizer = false;
              break;
            }
            checkAndRemoveInterfaces(comps[j]);
            comps.splice(j, 1);
            nodeRemoved = true;

            // If VI/VA remove the VI/VA instance pair
            let name = elementsToRemove[i].data.name;
            let instance = getDigits(elementsToRemove[i].data.name);
            let pairName = "";
            if (name.startsWith("VideoIngestion"))
              pairName = "VideoAnalytics" + instance;
            else if (name.startsWith("VideoAnalytics"))
              pairName = "VideoIngestion" + instance;
            else continue;
            for (let j = 0; j < comps.length; j++) {
              if (comps[j].data.name === pairName) {
                checkAndRemoveInterfaces(comps[j]);
                comps.splice(j, 1);
              }
            }

            break;
          }
        }
      }
      if (!nodeRemoved) {
        for (let i = 0; i < elementsToRemove.length; i++) {
          if (elementsToRemove[i].id[0] === "e") {
            let src = getComponentById(elementsToRemove[i].source);
            let trg = getComponentById(elementsToRemove[i].target);
            checkAndRemoveEdgeInterfaces(src, trg);
          }
        }
      }
      setElements((els) => removeElements(elementsToRemove, els));
      makeNodeConnections();
      currentComponentData.selectedComponents.needReProvision = true;

      updateOutputState();
      props.dispatchComponents(currentComponentData);
      reloadAndRenderComponents(false);
      handlePaneClick();
      return true;
    }
  };

  function showNetworkError(show) {
    if (show) {
      setStatusIcon(errorIcon);
    } else {
      setStatusIcon(blankIcon);
    }
  }

  function hasOutput() {
    var comps = currentComponentData.selectedComponents;
    for (let i = 0; i < comps.nodes.length; i++) {
      if (comps.nodes[i].type === "output" && comps.nodes[i].running) {
        return true;
      }
    }
    return false;
  }

  function updateOutputState() {
    currentComponentData.selectedComponents.output = hasOutput();
  }

  function refreshComponentLabel(comp) {
    if (comp.config !== undefined) {
      let udfList = "";
      if (comp.config.udfs) {
        for (let j = 0; j < comp.config.udfs.length; j++) {
          udfList +=
            comp.config.udfs[j].name +
            `${j < comp.config.udfs.length - 1 ? " || " : ""}`;
        }
        // Remove trailing '|'
        // if (udfList != "") udfList = udfList.slice(0, -1);
      } else {
        udfList = null;
      }

      comp.data.label = (
        <>
          <strong>{comp.data.name}</strong>
          <br />

          {udfList && <div className="algoNameInsideNode">{udfList}</div>}
        </>
      );
      onLayout("TB");
    }
  }

  const parseSelectedComponent = (s, cfgdata) => {
    currentSelectedComp = comp;
    let id = getId();
    var bgcolor = null;
    var running = null;
    var dirName = null;
    var containerName = null;
    var type = null;
    var appName = null;
    var postisan_id = null;
    var componentObj = {};
    var config = {};
    var keys = Object.keys(cfgdata);
    var isHidden = false;
    var removeComp = ["EtcdUI", "GlobalEnv"];
    for (let i = 0; i < keys.length; i++) {
      if (getComponentName(keys[i]) === s) {
        if (removeComp.includes(s)) continue;
        appName = s;
        postisan_id = getNumber(s);
        componentObj = getComponentObject(appName);
        config = getConfiragtionObject(cfgdata, appName);
        type = componentObj?.type;
        dirName = componentObj?.dirName;
        containerName = componentObj?.containerName;
        break;
      }
    }
    if (
      appName == "WebVisualizer" &&
      !currentComponentData.selectedComponents.showWebVisualizer
    ) {
      isHidden = true;
    }
    if (appName == null) {
      return;
    }
    var comp = {};
    comp["service"] = appName;
    comp["config"] = config["config"] || {};
    comp["interfaces"] = config["interfaces"] || {};

    var haveIndex = _.findIndex(
      currentComponentData.selectedComponents.nodes,
      (e) => {
        return e.service == appName;
      }
    );

    if (haveIndex == -1 && appName != null) {
      var position = { x: 0, y: 0 };
      var node = {
        ...comp,
        id: `${id}`,
        type,
        running,
        position,
        style: { background: `${bgcolor}` },
        data: {
          name: `${appName}`,
          label: (
            <>
              <strong>{appName}</strong>
            </>
          ),
        },
        dirName,
        containerName,
        isHidden: isHidden,
      };

      setElements((es) => es.concat(node));
      refreshComponentLabel(node);
      currentComponentData.selectedComponents.nodes.push(node);
      currentComponentData.selectedComponents.needReProvision = true;
      currentComponentData.selectedIndex =
        currentComponentData.selectedComponents.nodes.length - 1;
      makeNodeConnections();
      updateOutputState();
      props.dispatchComponents(currentComponentData);
    }
  };

  function saveProject() {
    /* Save the project */
    StoreProjectApi.store(
      props.projectSetup.projectName,
      currentComponentData.selectedComponents.showWebVisualizer,
      (response) => {},
      (response) => {
        console.log(
          "Error saving project: ",
          response?.status_info.error_detail
        );
      }
    );
  }

  function getInstanceCount(services = null) {
    if (services == null) {
      services = [];
      var c = currentComponentData.selectedComponents.nodes;
      for (let i = 0; i < c.length; i++) services.push(c[i].dirName);
    }
    let instances = 1;
    let cnt = new Array(services.length).fill(1);
    for (let i = 0; i < services.length - 1; i++) {
      for (let j = i + 1; j < services.length; j++) {
        if (services[i] === services[j]) {
          cnt[i]++;
        }
      }
    }
    for (let i = 0; i < cnt.length; i++) {
      if (cnt[i] > instances) instances = cnt[i];
    }
    return instances;
  }

  function reloadAndRenderComponents(reset, services = null, instances = null) {
    setShowProgress(true);
    if (services == null) {
      services = [];
      var c = currentComponentData.selectedComponents.nodes;
      for (let i = 0; i < c.length; i++) services.push(c[i].dirName);
    }
    let builder_services = services.filter(
      (item, i, ar) => ar.indexOf(item) === i
    );
    if (instances == null) {
      instances = getInstanceCount(services);
    }
    if (
      builder_services.length == 0 ||
      (builder_services.length == 1 &&
        builder_services[0] == "WebVisualizer" &&
        !currentComponentData.selectedComponents.showWebVisualizer)
    ) {
      dispatch({
        type: "START_DISABLED",
        payload: {
          startbuttondisabled: true,
        },
      });
    }
    BuilderApi.builder(
      builder_services,
      instances,
      reset,
      true,
      (response) => {
        dispatch({
          type: "PROJECT_SELECTION_INACTIVE",
          payload: {
            projectSelection: false,
          },
        });
        let config = response;
        if (instances >= 1) {
          removeAllNodes().then(() => {
            let p = 1;
            Object.keys(config).forEach(function (key, index) {
              parseSelectedComponent(getComponentName(key), config);
              p++;
              updateOutputState();
            });
          });
        }

        saveProject();

        dispatch({
          type: "INSTANCE_COUNT",
          payload: {
            instance_count: instances,
          },
        });
        setShowProgress(false);
      },
      (response) => {
        setShowProgress(false);
      }
    );
    if (BuildComplete) {
      dispatch({
        type: "BUILD_COMPLETE",
        payload: {
          BuildComplete: false,
          BuildError: false,
          BuildErrorMessage: "",
        },
      });
    }
  }

  const onLoad = (event, reactFlowInstance) => {
    setReactFlowInstance(event);

    if (ProjectSelectionActive == true) {
      setShowProgress(true);
      dispatch({
        type: "START_DISABLED",
        payload: {
          startbuttondisabled: true,
        },
      });
      // Stop all EII docker containers running on host
      // New provision flow requirement
      StartContainers("stop").then((response) => {
        if (props?.projectSetup?.isCreateProject == false) {
          /* Load existing project */
          currentComponentData.selectedComponents.showWebVisualizer = true;
          LoadCompApi.get(
            props?.projectSetup?.projectName,
            (response) => {
              let config = response;
              removeAllNodes();
              if (DT_CONFIG_KEY in config) {
                currentComponentData.selectedComponents.showWebVisualizer =
                  config[DT_CONFIG_KEY]?.show_wv == false ? false : true;
                delete config[DT_CONFIG_KEY];
              }
              Object.keys(config).forEach(function (key, index) {
                parseSelectedComponent(getComponentName(key), config);
              });
              let c = currentComponentData.selectedComponents.nodes;
              let services = [];
              for (let i = 0; i < c.length; i++) {
                services.push(c[i].dirName);
              }
              reloadAndRenderComponents(false, services);

              dispatch({
                type: "PROJECT_SELECTION_INACTIVE",
                payload: {
                  projectSelection: false,
                },
              });
              setShowProgress(false);
              dispatch({
                type: "START_DISABLED",
                payload: {
                  startbuttondisabled: false,
                },
              });
            },
            (response) => {
              setShowProgress(false);
            }
          );
        } else {
          /* Create new project */
          let instances = Number(props?.projectSetup?.noOfStreams);
          currentComponentData.selectedComponents.showWebVisualizer = false;
          setStreamCount(instances);
          dispatch({
            type: "INSTANCE_COUNT",
            payload: {
              instance_count: instances,
            },
          });
          BuilderApi.builder(
            ["VideoIngestion", "VideoAnalytics", "WebVisualizer"],
            instances,
            true,
            true,
            (response) => {
              let config = response;
              removeAllNodes();
              Object.keys(config).forEach(function (key, index) {
                parseSelectedComponent(getComponentName(key), config);
              });
              saveProject();

              dispatch({
                type: "PROJECT_SELECTION_INACTIVE",
                payload: {
                  projectSelection: false,
                },
              });
              setShowProgress(false);
              dispatch({
                type: "START_DISABLED",
                payload: {
                  startbuttondisabled: false,
                },
              });
            },
            (response) => {
              setShowProgress(false);
            }
          );
        }
      });
    } else {
      /* if(ProjectSelectionActive != true) */
      setShowProgress(true);
      LoadCompApi.get(
        props?.projectSetup?.projectName,
        (response) => {
          let config = response;
          removeAllNodes();
          Object.keys(config).forEach(function (key, index) {
            if (key != DT_CONFIG_KEY)
              parseSelectedComponent(getComponentName(key), config);
          });
          setShowProgress(false);
        },
        (response) => {
          setShowProgress(false);
        }
      );
    }
  };

  const onDragOver = (event) => {
    setClickedFromForm(false);
    if (BuildComplete) {
      setModalContent(
        "Modifying components require rebuilding containers. Do you wish to proceed?"
      );
      setModalTitle("Build Containers");
      setButton2Text("Proceed");
      setButton1Text("Cancel");

      setDropFlag(false);
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  function isIn(str, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (str === arr[i]) return true;
    }
    return false;
  }

  function hasCommon(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++)
      for (var j = 0; j < arr2.length; j++) {
        if (arr1[i] === arr2[j]) return true;
      }
    return false;
  }

  function isEndPointsConnectable(pubContainterName, p, s) {
    if (p.Type === "zmq_ipc" && s.Type === "zmq_ipc")
      return p.EndPoint === s.EndPoint;

    if (p.Type !== s.Type) return false;

    let pep = p.EndPoint.split(":");
    let pubHostName = pep[0];
    let pubPort = pep[1];
    let sep = s.EndPoint.split(":");
    var subHostName = sep[0];
    var subPort = sep[1];
    if (pubPort !== subPort) return false;

    if (
      ["127.0.0.1", "localhost", "0.0.0.0"].includes(pubHostName) &&
      ["127.0.0.1", "localhost", pubContainterName].includes(subHostName)
    )
      return true;

    return false;
  }

  function isConnectablePS(srcName, srcContainerName, p, trgName, s) {
    while (true) {
      if (!isEndPointsConnectable(srcContainerName, p, s)) break;
      if (!(isIn("*", p.AllowedClients) || isIn(trgName, p.AllowedClients)))
        break;
      if (!(srcName === s.PublisherAppName || s.PublisherAppName === "*"))
        break;
      if (!hasCommon(p.Topics, s.Topics)) break;
      if (!(p.Type === s.Type)) break;
      return true;
    }
    return false;
  }

  function isConnectableSC(srcName, s, trgName, c) {
    while (true) {
      if (s.EndPoint !== c.EndPoint) break;
      if (!(isIn("*", s.AllowedClients) || isIn(trgName, c.AllowedClients)))
        break;
      if (!(srcName === c.ServerAppName || c.ServerAppName === "*")) break;
      if (!(s.Type === c.Type)) break;
      return true;
    }
    return false;
  }

  function validatePublisher(p) {
    if (
      !("EndPoint" in p) ||
      !("AllowedClients" in p) ||
      !("Topics" in p) ||
      !("Type" in p)
    ) {
      return false;
    }
    return true;
  }

  function validateSubscriber(s) {
    if (
      !("EndPoint" in s) ||
      !("Topics" in s) ||
      !("PublisherAppName" in s) ||
      !("Type" in s)
    ) {
      console.log(
        "Error: No EndPoint/ServerAppName/Topics found in: " + JSON.stringify(s)
      );
      return false;
    }
    return true;
  }

  function validateServer(s) {
    if (!("EndPoint" in s) || !("AllowedClients" in s) || !("Type" in s)) {
      return false;
    }
    return true;
  }

  function validateClient(c) {
    if (!("EndPoint" in c) || !("ServerAppName" in c) || !("Type" in c)) {
      return false;
    }
    return true;
  }

  function getConnectableInterfaces(a, b) {
    var srcName = a.data.name;
    var pubs = a.interfaces.Publishers;
    var servers = a.interfaces.Servers;
    var trgName = b.data.name;
    var subs = b.interfaces.Subscribers;
    var clients = b.interfaces.Clients;
    var srcContainerName = a.containerName;
    let srcInstances = getDigits(srcName);
    if (srcInstances) {
      srcContainerName += srcInstances;
    }

    if (pubs && subs) {
      for (let pi = 0; pi < pubs.length; pi++) {
        var p = pubs[pi];
        if (!validatePublisher(p)) {
          console.log(
            "Error: No EndPoint/AllowedClients/Topics found in: " +
              JSON.stringify(p)
          );
          continue;
        }
        for (let si = 0; si < subs.length; si++) {
          let s = subs[si];
          if (!validateSubscriber(s)) {
            console.log(
              "Error: No EndPoint/ServerAppName/Topics found in: " +
                JSON.stringify(s)
            );
            continue;
          }

          if (!isConnectablePS(srcName, srcContainerName, p, trgName, s)) {
            continue;
          }
          return { pub: p, sub: s, pi: pi, si: si };
        }
      }
    }

    if (servers && clients) {
      for (let si = 0; si < servers.length; si++) {
        let s = servers[si];
        if (!validateServer(s)) {
          console.log(
            "Error: No EndPoint/AllowedClients/Type found in: " +
              JSON.stringify(s)
          );
          continue;
        }
        for (let ci = 0; ci < clients.length; ci++) {
          var c = clients[ci];
          if (!validateClient(c)) {
            console.log(
              "Error: No EndPoint/ServerAppName/type found in: " +
                JSON.stringify(c)
            );
            continue;
          }
          if (!isConnectableSC(srcName, s, trgName, c)) continue;
          return { ser: s, cli: c, si: si, ci: ci };
        }
      }
    }
    return null;
  }

  async function removeAllNodes() {
    setElements((els) => []);
    currentComponentData.selectedComponents.nodes = [];
    props.dispatchComponents(currentComponentData);
    return new Promise((resolve, reject) => {
      return resolve(true);
    });
  }

  function updateFlowText(s1, s2) {
    flowText = flowText + " | " + s1 + " --> " + s2;
  }

  function resetRefCounts() {
    var c = currentComponentData.selectedComponents.nodes;
    for (let i = 0; i < c.length; i++) {
      let ifs = [
        c[i].interfaces.Publishers,
        c[i].interfaces.Subscribers,
        c[i].interfaces.Servers,
        c[i].interfaces.Clients,
      ];
      for (let j = 0; j < ifs.length; j++) {
        if (ifs[j]) {
          for (let k = 0; k < ifs[j].length; k++) {
            ifs[j][k].ref = 0;
          }
        }
      }
    }
  }

  function removeAllEdges() {
    resetRefCounts();
    if (currentComponentData.selectedComponents.nodes.length === 0)
      setElements([]);
    else setElements(currentComponentData.selectedComponents.nodes);
    edges = [];
    flowText = "";
  }

  function getComponentName(str) {
    return str.split("/")[1];
  }

  function removeNumber(str) {
    return str.slice(0, -1);
  }
  function getNumber(str) {
    return str.charAt(str.length - 1);
  }
  function getComponentObject(str) {
    return _.find(currentComponentData.components, (e) => {
      return e.appName == trimDigits(str);
    });
  }

  function getConfiragtionObject(config, name) {
    var data = {};
    data["config"] = config[`/${name}/config`];
    data["interfaces"] = config[`/${name}/interfaces`];

    return data;
  }

  function checkAndMakeConnection(a, b) {
    let intf = getConnectableInterfaces(a, b);

    if (intf) {
      var newEdge = {
        id: "e" + a.id + "-" + b.id,
        source: a.id,
        target: b.id,
        animated: false,
        type: "smoothstep",
      };
      edges.push(newEdge);
      setElements((els) => addEdge(newEdge, els));
      if (intf.pub) {
        if (a.interfaces.Publishers[intf.pi].ref === undefined) {
          a.interfaces.Publishers[intf.pi]["ref"] = 0;
        }
        if (b.interfaces.Subscribers[intf.si].ref === undefined) {
          b.interfaces.Subscribers[intf.si]["ref"] = 0;
        }
        a.interfaces.Publishers[intf.pi].ref++;
        b.interfaces.Subscribers[intf.si].ref++;
      }
      if (intf.ser) {
        if (a.interfaces.Servers[intf.si].ref === undefined) {
          a.interfaces.Servers[intf.si]["ref"] = 0;
        }
        if (b.interfaces.Clients[intf.ci].ref === undefined) {
          b.interfaces.Clients[intf.ci]["ref"] = 0;
        }
        a.interfaces.Servers[intf.si].ref++;
        b.interfaces.Clients[intf.ci].ref++;
      }

      updateFlowText(a.data.name, b.data.name);
    }
  }

  function makeNodeConnections() {
    removeAllEdges();

    flowText = "";
    var comp = currentComponentData.selectedComponents.nodes;
    var n = comp.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        checkAndMakeConnection(comp[i], comp[j]);
        checkAndMakeConnection(comp[j], comp[i]);
      }
    }
  }

  const onDivContextMenu = (event) => {
    makeNodeConnections();
  };

  function isServiceAdded(service) {
    let c = currentComponentData.selectedComponents.nodes;
    for (let i = 0; i < c.length; i++)
      if (c[i].data.name == service) return true;
    return false;
  }

  function isNonMIServiceAdded() {
    let c = currentComponentData.selectedComponents.nodes;
    for (let i = 0; i < c.length; i++) {
      let componentObj = getComponentObject(c[i].data.name);
      if (!componentObj.supportMultiInstance) return true;
    }
    return false;
  }

  const onDrop = (event, proceedWithDrop) => {
    setProceedChange(event);
    if (proceedWithDrop == undefined && showBuildAlert) {
      setOpenAlreadyExistDialog(true);
      return;
    }

    setClickedFromForm(false);
    if (BuildProgress > 0 && BuildProgress < 100 && !BuildError) {
      alert("Sorry, you can't add a component when build is in progress!");
      return;
    }

    dispatch({
      type: "START_DISABLED",
      payload: {
        startbuttondisabled: false,
      },
    });
    let services = [];
    let reset = false;
    let nInstances = getInstanceCount();
    if (props.name == "WebVisualizer") {
      currentComponentData.selectedComponents.showWebVisualizer = true;
    } else {
      if (
        proceedWithDrop &&
        nInstances > 1 &&
        (props.name == "OpcuaExport" || props.name == "ImageStore")
      ) {
        alert(
          "Sorry, multi-instance configuration with " +
            props.name +
            " is not currently supported!"
        );
        return;
      }
      if (nInstances == 1 && isServiceAdded(props.name)) {
        let selComponentObj = getComponentObject(props.name);
        if (!selComponentObj.supportMultiInstance) {
          alert(
            "Sorry, multi-instance configuration with " +
              props.name +
              " is not currently supported!"
          );
          return;
        } else if (selComponentObj.supportMultiInstance) {
          if (isNonMIServiceAdded()) {
            alert(
              "Sorry, some of the already added components do not support multi-instance"
            );
            return;
          } else {
            if (
              window.confirm(
                "Switching to multi-instance.\n" +
                  "Components will be reset and all settings applied to them " +
                  "will be lost.\n\nAre you sure you want to contnue?"
              ) == false
            ) {
              return;
            }
            reset = true;
          }
        }
      }
      services.push(props.name);
    }

    if (
      currentComponentData.selectedComponents.activeTask &&
      currentComponentData.selectedComponents.activeTask != ""
    ) {
      alert(
        "Failed to add the component. Reason: An active " +
          currentComponentData.selectedComponents.activeTask +
          " task is already in progress\nPlease wait."
      );
      return false;
    }

    handlePaneClick(null);
    let c = currentComponentData.selectedComponents.nodes;
    for (let i = 0; i < c.length; i++) services.push(c[i].dirName);
    reloadAndRenderComponents(reset, services);
  };
  const enableImportBtn = () => {
    props.enableImportBtn &&
      props.enableImportBtn(enableImportButton, NodeSelected, streamCount);
  };
  const proceedWithChangeAfterBuildFunc = () => {
    onDrop(proceedWithChangeAfterBuildEvent, true);
    setOpenAlreadyExistDialog(false);
    dispatch({
      type: "SHOW_BUILD_ALERT",
      payload: {
        showBuildAlert: false,
      },
    });
  };
  const openDialogModal = (elementsToRemove) => {
    SetElementsToRemove(elementsToRemove);
    setModalContent(
      "This component will be removed from the datastream. Do you wish to remove?"
    );
    setModalTitle("Remove Data Stream");
    setButton1Text("Yes");
    setButton2Text("No");
    setOpenAlreadyExistDialog(true);
  };
  const removeSelectedNode = () => {
    onElementsRemove(elementsToremoveState);
    setOpenAlreadyExistDialog(false);
  };
  const closeDialogModal = () => {
    SetElementsToRemove();
    setOpenAlreadyExistDialog(false);
  };
  const configSettingsEdited = (
    configSettingsEditedFlag,
    clickedFromConfigFormFlag
  ) => {
    dispatch({
      type: "SHOW_BUILD_ALERT",
      payload: {
        showBuildAlert: true,
      },
    });
    setCanEditSettings(configSettingsEditedFlag);
    setClickedFromForm(clickedFromConfigFormFlag);

    setModalContent(
      "Modifying components require rebuilding containers. Do you wish to proceed?"
    );
    setModalTitle("Build Containers");
    setButton2Text("Proceed");
    setButton1Text("Cancel");
    displayBuildAlertFromConfigForm && setOpenAlreadyExistDialog(true);
  };
  const AllowConfigSettingsEdit = () => {
    setOpenAlreadyExistDialog(false);
    setDisplayBuildAlertFromConfigForm(false);
    setCanEditSettings(false);
    dispatch({
      type: "SHOW_BUILD_ALERT",
      payload: {
        showBuildAlert: false,
      },
    });
    setCanEditSettings(true);
  };
  const preventConfigSettingsEdit = () => {
    setOpenAlreadyExistDialog(false);
    setDisplayBuildAlertFromConfigForm(true);
    setCanEditSettings(false);
    setClickedFromForm(true);
  };
  return (
    <>
      {enableImportBtn()}

      <div className="dndflow layoutflow col-sm-8">
        <Snackbar
          className="width100"
          open={alertConfig}
          anchorOrigin={{ horizontal: "top", vertical: "center" }}
          autoHideDuration={5000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity="success">
            Configuration saved
          </Alert>
        </Snackbar>
        <Snackbar
          className="width100"
          open={alertConfigInvalid}
          anchorOrigin={{ horizontal: "top", vertical: "center" }}
          autoHideDuration={5000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity="error">
            Configuration is invalid!
          </Alert>
        </Snackbar>
        <Snackbar
          className="width100"
          open={alertConfigUDF}
          anchorOrigin={{ horizontal: "top", vertical: "center" }}
          autoHideDuration={5000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity="success">
            UDF config applied successfully
          </Alert>
        </Snackbar>
        <div id="component" className="zoompanflow" style={{ width: "100%" }}>
          {!props.inTestScreen && (
            <div>
              <p className="componentListHeader">Data Stream</p>
              <p className="componentListHelpText">
                Click on a datastream to enable and change the settings
              </p>
            </div>
          )}

          {progressIndicator ? (
            <div className="progressIndicator">
              <CircularProgress
                color="primary"
                thickness="2.5"
                size={100}
                className="progressIndicator"
              />
            </div>
          ) : (
            ""
          )}
          <ReactFlowProvider key="ws">
            <div
              className={
                !props.displayConfigForm
                  ? "reactflow-wrapper"
                  : "reactflow-wrapper"
              }
              id="reactflow"
              ref={reactFlowWrapper}
              style={{ display: progressIndicator && "none" }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <button
                id="va"
                hidden
                style={{ float: "right" }}
                onClick={() => onLayout("TB")}
              >
                <img src={vertical} alt="vertical logo" />
              </button>
              <button
                id="ha"
                hidden
                style={{ float: "right" }}
                onClick={() => onLayout("LR")}
              >
                <img src={horizontal} alt="horizontal logo" />
              </button>
              <ReactFlow
                elements={elements}
                nodesConnectable={true}
                selectNodesOnDrag={false}
                onNodeContextMenu={onContextMenu}
                onConnect={onConnect}
                onElementsRemove={openDialogModal}
                onLoad={onLoad}
                onDrop={onDrop}
                onContextMenu={onDivContextMenu}
                onDragOver={onDragOver}
                onElementClick={handleElementClick}
                onPaneClick={handlePaneClick}
                style={{ fill: "darkblue", background: "white" }}
                deleteKeyCode={46}
                key="edges"
                hidden={progressIndicator}
                markerEndId="react-flow__arrowclosed"
                zoomOnScroll={false}
                zoomOnDoubleClick={false}
              ></ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
        <div className="confirmationDialogBody">
          <Modal
            open={openAlreadyExistDialog}
            onClose={closeDialogModal}
            title={modalTitle}
            modalContent={modalContent}
            button1Text={button1Text}
            button2Text={button2Text}
            button2Fn={
              modalTitle.includes("Remove Data Stream")
                ? closeDialogModal
                : clickedFromForm
                ? AllowConfigSettingsEdit
                : proceedWithChangeAfterBuildFunc
            }
            button1Fn={
              modalTitle.includes("Remove Data Stream")
                ? removeSelectedNode
                : clickedFromForm
                ? preventConfigSettingsEdit
                : closeDialogModal
            }
          />
        </div>
      </div>
      {props.displayConfigForm &&
      currentSelectedComp &&
      currentSelectedComp.config &&
      open ? (
        <ConfigForm
          open={open}
          onConfigCancel={onConfigCancel}
          onConfigOK={onConfigOK}
          DB={{
            config: currentSelectedComp.config,
            interfaces: currentSelectedComp.interfaces,
          }}
          main_title={currentSelectedComp.data.name}
          configSettingsEdited={configSettingsEdited}
          canEditSettings={canEditSettings}
        />
      ) : (
        <div class="sideBare col-sm-4">
          <div
            style={{
              justifyContent: "center",
              alignContent: "space-around",
              paddingLeft: 0,
              paddingRight: 5,
            }}
          ></div>
          <div className="configBarSideBarTitle">
            <p className="componentListHelpText">
              <h5>Settings</h5>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, oldProps) => {
  var componentsData = state.ConfigureBuildReducer.componentsInitialState;
  return {
    stateComponent: componentsData,
    appName: state.ConfigureBuildReducer.getData.appName,
    noOfStreams: state?.ConfigureBuildReducer?.projectSetup?.noOfStreams,
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    cameraSource: state?.ConfigureBuildReducer?.cameraSource,
    services_to_deply: state?.ConfigureBuildReducer?.services_to_deploy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchComponents: (currentComponentData) => {
      dispatch({
        type: ActionType.UPDATE_MAIN_OBJECT,
        value: { ...currentComponentData },
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComponentsLayout);
