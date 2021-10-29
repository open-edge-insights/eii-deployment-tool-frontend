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

import React, {  useEffect } from 'react';
import { connect } from 'react-redux';
import Box from "@material-ui/core/Box";
import "./ComponentList.css"


const ComponentList = (props) => {
  useEffect(() => {
    console.log("componentsdata", props.componentsdata);
  }, []);
  const onDragStart = (event, dataType, appName) => {
    event.dataTransfer.setData("application/reactflow", dataType);
    props.updateAppname(appName);
    console.log("onDragStart:3",appName);
    event.dataTransfer.effectAllowed = "move";
  };
   const isActive = props?.projectSetup?.noOfStreams === 0;
  return (
    <div>
      <div className="positionrel fontSize14 border1px" >
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
