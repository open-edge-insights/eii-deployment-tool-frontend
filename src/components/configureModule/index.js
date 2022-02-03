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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AddTab from "./AddTab";
import ComponentList from "./ComponentList";
import ConfigBuild from "./ConfigBuild";
import DynamicTabs from "./DynamicTabs";
import { useState } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import cssClasses from "./index.module.css"
const styles = {
  Paper: {
    marginTop: 10,
    marginBottom: 10,
    height: 630,
    overflowY: "auto",
  },
};

const Configure = (props) => {
  const [state, setState] = useState(true);
  const [name, setName] = useState();
  const [open, setOpen] = useState(false);
  const [ImportBtnActive, setEnableImportBtn] = useState();
  const [NodeSelected, setNodeSelected] = useState();
  const [updateconfig, setUpdatedConfig] = useState();
  const [streamCount, setStreamCount] = useState(0);
  const [selectedIds, setId] = useState([0]);
  const [updatedUDFFunc, setUDFFunc] = useState(function () { });
  const handleClickOpen = () => setOpen(true);
  const { isCreateProject } = props;
  const setTabValues = () => {
    props.setSelectedTab({ ...state });
  };
  const enableImportBtn = (enableImportBtn, NodeSelected, noOfStreams) => {
    setEnableImportBtn(enableImportBtn);
    setNodeSelected(NodeSelected);
    setStreamCount(noOfStreams);
  };
  const udfConfig = (updatedConfig, streamIds) => {
    setUpdatedConfig(updatedConfig);
    setId(streamIds);
  };
  /* Getting the buildComplete state from redux store */
  const BuildComplete = useSelector(
    (state) => state.BuildReducer.BuildComplete
  );
  const BuildError = useSelector((state) => state.BuildReducer.BuildError);
  return (
    <div style={{ padding: 0 }}>
      <div className={cssClasses.root}>
        {props.noOfStreams === 0 && (
          <div>
            <div>
              <AddTab isCreateProject={isCreateProject} />
            </div>
          </div>
        )}
        {props.noOfStreams > 0 && (
          <div className={`${"row"} ${cssClasses.configurationWrapper}`}>
            <div className={cssClasses.configureTtile}>Configure</div>
            <div className="col-sm-2" style={{ paddingLeft: 20 }}>
              <ComponentList
                setName={setName}
                isImportBtnActive={ImportBtnActive}
                streamCount={streamCount}
                NodeSelected={NodeSelected}
                udfConfig={udfConfig}
              />
            </div>

            <div className="col-sm-10">
              <DynamicTabs
                enableImportBtn={enableImportBtn}
                udfConfig={updateconfig}
                streamIds={selectedIds}
              />
            </div>
            <div className="col-sm-12">
              <hr style={{ marginBottom: 24, width: "100%" }} />
              <ConfigBuild />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Configure.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    tab: state.tab,
    createProjectLayout: state.ConfigBuildReduce,
    noOfStreams: state?.ConfigureBuildReducer?.projectSetup?.noOfStreams,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedTab: (projectData) => {
      dispatch({ type: "ON_SELECTED_TAB", projectData });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
