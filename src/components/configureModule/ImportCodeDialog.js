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
import Dialog from "@material-ui/core/Dialog";
import FileIcon from "@material-ui/icons/Description";
import FolderIcon from "@material-ui/icons/Folder";
import "./ImportCode.css";
import FormControlLabel from "@material-ui/core/FormControlLabel";
export default function ImportCodeDialog(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [StreamIdsSelected, setStreamId] = useState([]);
  useEffect(() => {
    setOpenDialog(props?.open);
  }, [props]);
  useEffect(() => {
    if (props.streamCount == 1 && props.NodeSelected != "") {
      setStreamId(["1"]);
    } else if (props.streamCount > 1 && props.NodeSelected != "") {
      let selectedNodeId = props.NodeSelected[props.NodeSelected.length - 1];
      let arr = [];
      arr.push(selectedNodeId);
      setStreamId(arr);
    }
    else {
      setStreamId([])
    }
  }, [props.streamCount, props.NodeSelected]);
  /* Storing the Ids of selected checkboxes */
  const selectedStreamIds = (data) => {
    let elementId = data.target.id.toString();
    let arrOfIds = [...StreamIdsSelected];
    if (arrOfIds.includes(elementId)) {
      arrOfIds.splice(arrOfIds.indexOf(elementId), 1);
    } else {
      arrOfIds.push(data.target.id);
    }
    setStreamId(arrOfIds);
  };
  const numberOfStreams = (count) => {
    let Scount = count;
    let DataStreamCheckboxes = [];
    for (let i = 1; i <= Scount; i++) {
      DataStreamCheckboxes.push(
        <div>
          <input
            name={"Data Stream" + i}
            type="checkbox"
            value={"Data Stream" + i}
            id={i}
            onChange={selectedStreamIds}
            checked={
              Scount == 1 && StreamIdsSelected.includes(i.toString())
                ? true
                : props.NodeSelected[props.NodeSelected.length - 1] == i
                ? true
                : StreamIdsSelected.includes(i.toString())
                ? true
                : false
            }
          />
          <label for={"Data Stream" + i} className="dataStreamLabel">
            {props.streamCount > 1
              ? props.NodeSelected.replace(/\d+$/, "") + i
              : props.streamCount == 1
              ? props.NodeSelected
              : ""}
          </label>
        </div>
      );
    }
    return DataStreamCheckboxes;
  };
  return (
    <div className="ImportCode">
      <Dialog
        open={openDialog}
        onClose={props?.handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {props &&
        ((props.files && props.files.length > 0) ||
          (props.dirs && props.dirs.length > 0)) ? (
          <span>
            <div className="dialogBody">
              <div>
                <div className="dialogTitleImportCode">Import UDF</div>
                <div className="addressBar">{props.addressBar}</div>
                <div className="dialogContent">
                  <div className="files">
                    {/* Show only python files */}
                    {props.files &&
                      props.files.map((fileItems) => {
                        let epos = fileItems.lastIndexOf(".");
                        if (
                          fileItems &&
                          epos > 0 &&
                          fileItems.substring(epos) == ".py"
                        ) {
                          return (
                            <div
                              className="FileItems"
                              onClick={() => props.selectFile(fileItems)}
                            >
                              <FileIcon
                                className="ImportCodeIcon FileIcon"
                                id={
                                  fileItems == props.selectedFile
                                    ? "SelectedFileIcon"
                                    : "filesIconId"
                                }
                              />
                              <span
                                id={
                                  fileItems == props.selectedFile
                                    ? "SelectedFileName"
                                    : "filesDirsID"
                                }
                                className="filesDirs"
                              >
                                {fileItems}
                              </span>
                            </div>
                          );
                        }
                      })}
                  </div>
                  <div className="directories">
                    {/* <div className="DirsTitle">Directories</div> */}
                    {props.dirs &&
                      props.dirs.map((dirsItem) => {
                        return (
                          <div
                            className="DirsItems"
                            onClick={() => props && props.getFiles(dirsItem)}
                          >
                            <FolderIcon className="ImportCodeIcon DirsIcon" />
                            <span className="filesDirs">{dirsItem}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="dataStreamDiv">
              <p>Add to:</p>
              {props.NodeSelected && (
                <>
                  <input
                    name={props.NodeSelected}
                    type="radio"
                    checked={true}
                    value={props.NodeSelected}
                    className="nodeSelectedCheckbox"
                  />
                  <label
                    for={props.NodeSelected}
                    className="nodeSelectedCheckboxLabel"
                  >
                    {props.NodeSelected.replace(/\d+$/, "")}
                  </label>
                </>
              )}
            </div>
            <div className="streamCountDiv">
              {props.streamCount && props.streamCount > 0
                ? numberOfStreams(props.streamCount)
                : ""}
            </div>
            <div className="closeDialogDiv">
              <button
                className="closeDialogBtn closebtn"
                onClick={props?.handleCloseDialog}
              >
                Cancel
              </button>
              <button
                className="closeDialogBtn selectFileIcon"
                onClick={()=>props.generateUDFConfigFunc(StreamIdsSelected)}
              >
                Select
              </button>
            </div>
          </span>
        ) : (
          ""
        )}
      </Dialog>
    </div>
  );
}
