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
import { viewLogs } from "./viewLogsApi";
import "./ViewLogs.css";

export default function ViewLogs(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [logs, setLogs] = useState("");
  useEffect(() => {
    setLogs("");
    setOpenDialog(props?.open);
    props?.processname &&
      viewLogs(props?.processname).then((response) => {
        let logs = JSON.parse(response?.data);
        setLogs(props?.processname && logs[props.processname]);
      })
      .catch((error) => {
        console.log(error);
      })
 
  }, [props.processname, props.open]);
  
  var decodedString = logs && atob(logs).replace(/\033\[[0-9;]*m/g, "");

  return (
    logs && (
      <div className="ViewLogs">
        <Dialog
          open={openDialog}
          onClose={props?.handleCloseViewLog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="dialogBodyViewLogs">
            <div className="viewLogDialogTitle">{props?.processname} Logs</div>
            <div className="logText">
              {logs ? decodedString : "No Logs Found"}
            </div>
          </div>
          <div className="closeDialogDiv">
            <button className="closeDialog" onClick={props?.handleCloseViewLog}>
              Close
            </button>
          </div>
        </Dialog>
      </div>
    )
  );
}
