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

import React, { createRef, useState, useEffect } from "react";
import "./ConfigForm.css";
import _ from "lodash";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

export var ConfigForm = (props) => {
  const { DB, main_title, onConfigOK } = props;
  var [data, setData] = useState({});
  const [jsonEditeddata, setJSONdata] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    var NEW_DATA = _.cloneDeep(DB);
    setData({ ...NEW_DATA });
  }, [DB]);

  const handleJSONChange = (e) => {
    if (BuildComplete && props.canEditSettings) {
      setJSONdata(e);
      dispatch({
        type: "SHOW_BUILD_ALERT",
        payload: {
          showBuildAlert: false,
        },
      });
    }
  };
  const Disabledsave = useSelector((state) => state.BuildReducer.Disabledsave);
  const showBuildAlert = useSelector(
    (state) => state.BuildReducer.showBuildAlert
  );
  const BuildComplete = true;
  const openAlertModal = () => {console.log(showBuildAlert,"in config form")
      if (props.canEditSettings) {
        props.configSettingsEdited(false, true);
      } else if (!props.canEditSettings) {
        props.configSettingsEdited(true, true);
      } else if (BuildComplete) {
        props.configSettingsEdited(true, true);
      }
  };
  return (
    <div className="sideBare col-sm-4">
      <div
        style={{
          justifyContent: "center",
          alignContent: "space-around",
          paddingLeft: 0,
          paddingRight: 5,
        }}
      >
        <div className="configBarSideBarTitle">
          <h5>{main_title} Configuration</h5>
          <Button
            disabled={
              Object.keys(jsonEditeddata).length == 0 || Disabledsave
                ? "disabledsavebtn"
                : ""
            }
            onClick={(e) =>
              onConfigOK(e, {
                config: jsonEditeddata.config,
                interfaces: jsonEditeddata.interfaces,
              })
            }
            variant="contained"
            color="successs"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="configFormJSONeditor" onClick={openAlertModal}>
        <Editor value={props.DB} onChange={handleJSONChange} />
      </div>
      <br />
      <div
        style={{
          width: "100%",
          paddingLeft: 10,
          height: 70,
          background: "#fff",
          float: "right",
        }}
      ></div>
    </div>
  );
};

export default ConfigForm;
