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
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import "./ComponentList.css";
import "./ImportCode.css";
import { listFiles, generateUDFConfig } from "./importCodeApis";
import ImportCodeDialog from "./ImportCodeDialog";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { Path } from "history";
import { useSelector, useDispatch } from "react-redux";

const ComponentList = (props) => {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [openImportCodeDialog, setDialogOpen] = useState(false);
  const basePath = "/common/video/udfs/";
  const [configPath, setConfigPath] = useState("");
  const [SelectedFileForConfig, setFileName] = useState("");
  const [openAlert, setAlertOpen] = useState(false);
  const [AlertMsg, setAlertMsg] = useState("");
  const [UDFConfig, setUDFConfig] = useState();

  const ImportButton = useSelector(
    (state) => state.BuildReducer.ImportButtonDisabled
  );

  var Path = require("path");
  useEffect(() => {}, []);
  const onDragStart = (event, dataType, appName) => {
    event.dataTransfer.setData("application/reactflow", dataType);
    props.updateAppname(appName);
    event.dataTransfer.effectAllowed = "move";
  };
  /* Call get files api to display list fo files and directories */
  const importCode = (dirsName) => {
    let PathToApi = configPath ? configPath : basePath;
    if (dirsName && typeof dirsName == "string") {
      if (PathToApi[PathToApi.length - 1] == "/")
        PathToApi = PathToApi + dirsName;
      else PathToApi = PathToApi + "/" + dirsName;
    }
    PathToApi = Path.normalize(PathToApi);
    if (PathToApi.length <= basePath.length) PathToApi = basePath;
    setConfigPath(PathToApi);
    listFilesFunc(PathToApi);
  };
  const listFilesFunc = (_path) => {
    setFileName("");
    let path = _path;
    listFiles(path).then((fileResponse) => {
      if (fileResponse.status_info.status) {
        let data = fileResponse?.data && JSON.parse(fileResponse.data);
        setFiles([...data.files]);
        if (path == basePath) setDirectories([...data.dirs]);
        else setDirectories([...data.dirs, ".."]);
        setDialogOpen(true);
      } else {
        alert("Invalid path");
      }
    });
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setFileName("");
    setUDFConfig("");
    setFileName("");
  };
  /* Back to the root directory */
  const backToBaseURL = () => {
    setConfigPath(basePath);
    setDialogOpen(false);
  };
  /* Generate UDF config for the selected file */
  const generateUDFConfigFunc = (streamIds) => {
    if (SelectedFileForConfig && props && props.NodeSelected) {
      let fileName = SelectedFileForConfig;
      setDialogOpen(false);
      let PathToApi = configPath ? configPath : basePath;
      if (PathToApi[PathToApi.length - 1] == "/")
        PathToApi = PathToApi + fileName;
      else PathToApi = PathToApi + "/" + fileName;
      generateUDFConfig(PathToApi)
        .then((UDFResponse) => {
          let UDF = UDFResponse.data && JSON.parse(UDFResponse.data);
          setUDFConfig(UDF);
          props.udfConfig(UDF, streamIds);
        })
        .catch((error) => {
          alert("Please Select a valid UDF file!");
        });
    } else {
      alert("Please select a file to proceed");
      setAlertOpen(true);
      setAlertMsg("Please select a file to proceed");
    }
  };
  const selectTheFileToGenerateConfig = (fileName) => {
    let SelectedFile = fileName;
    if (SelectedFile && typeof SelectedFile == "string") {
      setFileName(SelectedFile);
    }
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertMsg("");
  };
  const isActive = props?.projectSetup?.noOfStreams === 0;
  return (
    !isActive && (
      <div>
        <div className="positionrel fontSize14">
          {isActive && <div className="positionisActive"></div>}

          <p className="componentListHeader">Components List</p>
          <p className="componentListHelpText">
            Drag a component to add it to the components Layout.
          </p>
          <div className="overflowclip">
            {props.componentsdata &&
              props.componentsdata.map((data) => {
                return (
                  <Box
                    type="input"
                    className="dndnode input drapval"
                    boxShadow={1}
                    m={1}
                    p={0.8}
                    onDragStart={(event) =>
                      onDragStart(event, data.type, data.appName)
                    }
                    draggable={!isActive}
                  >
                    {data.appName}
                  </Box>
                );
              })}
          </div>
        </div>
        <div className="importCodeBtnDiv">
          <button
            className={
              isActive || !props.isImportBtnActive || ImportButton
                ? "disableImportBtn"
                : "importCodeBtn"
            }
            onClick={importCode}
            disabled={isActive || !props.isImportBtnActive|| ImportButton}
          >
            Import UDF
          </button>
        </div>
        <ImportCodeDialog
          files={files}
          dirs={directories}
          handleCloseDialog={closeDialog}
          open={openImportCodeDialog}
          getFiles={importCode}
          backToBaseURL={backToBaseURL}
          generateUDFConfigFunc={generateUDFConfigFunc}
          selectFile={selectTheFileToGenerateConfig}
          selectedFile={SelectedFileForConfig}
          addressBar={configPath}
          NodeSelected={props.NodeSelected}
          streamCount={props?.streamCount}
        />
        <Snackbar
          open={openAlert}
          autoHideDuration={4000}
          onClose={handleAlertClose}
          message={AlertMsg}
          anchorOrigin={{ horizontal: "top", vertical: "center" }}
        >
          <Alert severity="warning">{AlertMsg}</Alert>
        </Snackbar>
      </div>
    )
  );
};

const getCurrCompName = () => {
  return;
};

const mapStateToProps = (state) => {
  return {
    componentsdata:
      state.ConfigureBuildReducer.componentsInitialState.components,
    appName: state.ConfigureBuildReducer.getData.appName,
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAppname: (appName) => {
      dispatch({ type: "UPDATE_APP_NAME", value: appName });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComponentList);
