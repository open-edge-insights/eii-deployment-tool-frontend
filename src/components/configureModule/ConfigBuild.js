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

import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import LinearWithValueLabel from './LinearProgress';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import "./ConfigBuild.css";




const ConfigBuild = (props) => {
    useEffect(() => {
        console.log("check thumbnail value", props);
    },[]);
    const thumb = [];

    console.log("check thumbnail value", props);

    for (let index = 0; index < props?.projectSetup?.noOfStreams; index++) {

        thumb.push(
            <Box m={1} p={0.8} className="thumb" 
                key={index} index={index}
            >

            </Box>)
    }
    const isActive = props?.projectSetup?.noOfStreams >= 0;
    return (
        <div style={{ marginTop: 35,position:"relative",padding:5,fontSize:13 }}>
           {isActive &&  <div style={{position:"absolute",top:0,bottom:0,left:0,right: "-32px",background:"rgba(0,0,0,0.1)",padding:20,cursor:"not-allowed",border: "1px solid grey"}}></div> }
            <p style={{ textAlign: "center" }}>Configure & Build</p>
            <div style={{ textAlign: "center" }}>
                <button disabled={isActive} type="submit" style={{ width: 100, height: 30, borderRadius: 5, backgroundColor: "#fff" }}>Start</button>
            </div>
            <div class="row" style={{ width: "100%", fontSize: 13, marginTop: 20, marginRight: 0 }}>
                <div style={{ float: 'left', width: 110 }}>
                    <p>Services & Communications</p>
                </div>
                <div style={{ float: 'left', width: 130, padding: 0 }}>
                    <LinearWithValueLabel />
                </div>
                <div style={{ float: 'left', width: 5, padding: 0 }}>
                    <button disabled={isActive} type="submit" style={{ width: 50, height: 30, borderRadius: 5, backgroundColor: "#fff" }}>View</button>
                </div>
            </div>
            <div class="row" style={{ width: "100%", fontSize: 13, marginTop: 20, marginRight: 0 }}>
                <div style={{ float: 'left', width: 110 }}>
                    <p>State & Metadata:</p>
                </div>
                <div style={{ float: 'left', width: 130, padding: 0 }}>
                    <LinearWithValueLabel />
                </div>
                <div style={{ float: 'left', width: 5, padding: 0 }}>
                    <button type="submit" disabled={isActive} style={{ width: 50, height: 30, borderRadius: 5, backgroundColor: "#fff" }}>View</button>
                </div>
            </div>
            <div class="row" style={{ width: "100%", fontSize: 13, marginTop: 20, marginRight: 0 }}>
                <div style={{ float: 'left', width: 110 }}>
                    <p>Containers</p>
                </div>
                <div style={{ float: 'left', width: 130, padding: 0 }}>
                    <LinearWithValueLabel />
                </div>
                <div style={{ float: 'left', width: 5, padding: 0 }}>
                    <button type="submit" disabled={isActive} style={{ width: 50, height: 30, borderRadius: 5, backgroundColor: "#fff" }}>View</button>
                </div>
            </div>
            {thumb}
        </div>

    )
}
const mapStateToProps = (state) => {
    console.log("Config:", state);
    return {
        projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    

    };
};

export default connect(mapStateToProps)(ConfigBuild);

