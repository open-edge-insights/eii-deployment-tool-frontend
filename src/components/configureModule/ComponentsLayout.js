import React, { useState, useRef, useCallback, useContext,useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
} from "react-flow-renderer";
import "./ComponentsLayout.css";
import { makeStyles } from '@material-ui/core/styles';




const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const ComponentsLayout = (props) => {
 return(
 <div className="height570 border1"></div>)

};

export default ComponentsLayout;


