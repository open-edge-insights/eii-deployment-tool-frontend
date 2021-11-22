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
        console.log("logs", logs);
      });
  }, [props]);
  var decodedString = logs && atob(logs).replace(/\033\[[0-9;]*m/g,"");

  return (
    logs&& <div className="ViewLogs">
      <Dialog
        open={openDialog}
        onClose={props?.handleCloseViewLog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialogBody">
          <div className="dialogTitle">{props?.processname} Logs</div>
          <div className="logText">{logs ? decodedString : "No Logs Found"}</div>
        </div>
        <div className="closeDialogDiv">
          <button className="closeDialog" onClick={props?.handleCloseViewLog}>
            Close
          </button>
        </div>
      </Dialog>
    </div>
  );
}
