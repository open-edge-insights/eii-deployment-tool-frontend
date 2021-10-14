import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Box from "@material-ui/core/Box";
import "./ComponentList.css"


const ComponentList = (props) => {
  useEffect(() => {
    console.log("componentsdata", props.componentsdata);
  }, []);
  const [stateComponent, setStateComponent] = useState(0);
  const onDragStart = (event, dataType, appName) => {
    event.dataTransfer.setData("application/reactflow", dataType);
    // props.setName(appName);
    props.updateAppname(appName);
    console.log("onDragStart:3",appName);
    event.dataTransfer.effectAllowed = "move";
  };
   const isActive = props?.projectSetup?.noOfStreams >= 0;
  return (
    <div>
      <div className="positionrel fontSize14 border1px " >
     { isActive && ( <div className="positionisActive">

</div> )}  
        <p className="coldrag" >Drag a component to add it to the components Layout.</p>
        <p className="fontweight400 ">Components List</p>
        <div className="overflowclip">
          {props.componentsdata && props.componentsdata.map((data) => {
            return (


              <Box
                type="input"
                className="dndnode input drapval"
                boxShadow={1}
                m={1}
                p={0.8}
              
                draggable={!isActive}
              
              >
                {data.appName}
              </Box>

            );
          })}
        </div>
      </div>
    </div>
  )

}

const mapStateToProps = (state) => {
  console.log("state1 appname:",state.ConfigureBuildReducer.getData.appName);
  return {
    componentsdata: state.ConfigureBuildReducer.componentsInitialState.components,
    appName:state.ConfigureBuildReducer.getData.appName,
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAppname: (appName) => {
      console.log("Update_APP_NAME:", appName);
      dispatch({ type: "UPDATE_APP_NAME", value: appName });
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ComponentList);
