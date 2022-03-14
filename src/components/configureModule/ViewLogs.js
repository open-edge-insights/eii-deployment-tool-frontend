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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from '@material-ui/core/Slider';
import "./ViewLogs.css";
export default function ViewLogs(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [ViewProcessLogs, setViewLogs] = useState("");
  const [logs, setLogs] = useState("");
  const [autoRefreshTimer, setAutoRefreshTimer] = useState(null);
  const [minLogRefresh] = useState(5);
  const [maxLogRefresh] = useState(60);
  const [value, setValue] = useState(minLogRefresh);
  const [refreshCounter, setRefreshCounter] = useState(minLogRefresh);
  const [refreshInterval, setRefreshInterval] = useState(minLogRefresh * 1000);

  useEffect(() => {
    setLogs("");
    
    props?.processname &&
      viewLogs(props?.processname).then((response) => {
        let logs = JSON.parse(response?.data);
        setLogs(props?.processname && logs[props.processname]);
        let a = document.getElementById("textscroll");
        document.getElementsByClassName("Bare")[0].scrollTop = a.offsetHeight
      })
        .catch((error) => {
          console.log(error);
        })

  }, [props.processname, props.open]);

  useEffect(() => {
    setOpenDialog(props?.open);
  },[props.open]);

  var decodedString = logs && atob(logs).replace(/\033\[[0-9;]*m/g, "");
  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked == true) {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
      }
      setAutoRefreshTimer(setInterval(() => {
        let counter = refreshCounter + 1;
        if (counter > 1000) {
        counter = 0;
        }
        setRefreshCounter(counter);
        viewLogs(props?.processname,true).then((response) => {
        let logs = JSON.parse(response?.data);
        setLogs(props?.processname && logs[props.processname]);
        let a = document.getElementById("textscroll");
        document.getElementsByClassName("Bare")[0].scrollTop = a.offsetHeight
        })
        }, refreshInterval)
      );
    }
    else {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
        setAutoRefreshTimer(null);
      }
    }
  };
  const myDebounce = (callBack, delay) => {
    let timer;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callBack(...args);
      }, delay);
    }
  }
  const handleIntervalValue = (event) => {
    const eventValue = event.target.value;
    setValue(eventValue);
    onRefreshIntervalChange(event);
  }
  const onRefreshIntervalChange = myDebounce((event) =>{
    let eventValue = event.target.value;
    if(eventValue < minLogRefresh && eventValue > maxLogRefresh){
      eventValue = eventValue;
    }
    else if(eventValue > maxLogRefresh){
      alert("Please enter a value between " + minLogRefresh + " and " + maxLogRefresh);
      eventValue = maxLogRefresh;
    }else if(eventValue < minLogRefresh){
      alert("Please enter a value between " + minLogRefresh + " and " + maxLogRefresh);
      eventValue = minLogRefresh;
    }
    setValue(eventValue);
  },2000)
  function onClose() {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      setAutoRefreshTimer(null);
    }
    props?.handleCloseViewLog();
    setChecked(false);
  }
  return (
     logs && (
      <div className="ViewLogs">
        <Dialog
          open={openDialog}
          onClose={props?.handleCloseViewLog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="viewLogDialogTitle">{props?.processname} Logs</div>
          <div className="viewLogDialogCheckbox">
            <FormControlLabel
              label="Enable Auto Refresh"
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  color={"primary"}
                />
              }
            />
            <label className="viewLogDialog">Refresh Every</label>
            <label className="viewLogDialog"></label>
            <input className="Refreshtext"
              type="number"
              min={minLogRefresh}
              max={maxLogRefresh}
              value={value}
              placeholder="Seconds"
              disabled={!checked}
              onChange={handleIntervalValue}
                        
            />
            <label className="viewLogDialog">Seconds</label>
          </div>
          <div class="Bare">
            <div className="logText" id="textscroll">
            
              {logs ? decodedString : "No logs found"}
            </div>
          </div>

          <div className="closeDialogDiv">
            <button className="cancelBtn" onClick={onClose}>
              Close
            </button>
          </div>
        </Dialog>
      </div>
     )
  );
}
