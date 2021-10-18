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

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ComponentsLayout from './ComponentsLayout';
import Video from '../configureModule/Video';
import { auto } from 'async';
import TestProfileSettings from './TestProfileSettings';
import Output from './Output';
import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import LinearWithValueLabel from './LinearProgress';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    checkboxlabel: {
        fontSize: 12
      }
}));

export default function RegistrySettings() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
           
                <Box class='row ' style={{
                    borderRight: '1px solid grey',
                    borderLeft: '1px solid grey',
                    borderBottom: '1px solid grey',
                    borderTop: '1px solid grey',
                    height: '250px',
                }}>
                    <Box class="col-sm-5" style={{
                        height: '100%',
                        backgroundColor:"#eeeeee",

                    }}>
                         <div class="row" style={{display:"inline-flex"}}>
                <div class="col-sm-5">             
                <FormGroup row>
                    <span>Registry Settings</span>
                <FormControlLabel
                classes={{label:classes.checkboxlabel}}
                        control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="use default Settings"
                    />


                    <div class="col-sm-12" style={{ textAlign: "center" }}>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-6">
                                <label for="fname" style={{ fontSize: 13 }}>Authentication:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                           

                        </div>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-6">
                                <label for="fname" style={{ fontSize: 13 }}>SSL Certificates:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            
                        </div>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-6">
                                <label for="fname" style={{ fontSize: 13 }}>Storage:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                           

                        </div>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-6">

                                <label for="fname" style={{ fontSize: 13 }}>Image Permissions:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                           
                        </div>
                       
                    </div>
                </FormGroup>
                </div>
                <div class="col-sm-7">             
                <FormGroup row>
                   
               
                    <div class="col-sm-12" style={{ textAlign: "center" }}>
                        <div class="row" style={{ marginBottom: 10,marginTop:50 }}>
                        <FormControl  classes={{label:classes.checkboxlabel}} component="fieldset" >
                                {/* <FormLabel  labelPlacement="start"component="legend">Gender</FormLabel> */}
                                <RadioGroup aria-label="quiz" name="quiz" style={{ display: "block" }} >
                                    <FormControlLabel classes={{label:classes.checkboxlabel}} value="CPU" control={<Radio color="primary" />} label="Pull your application from your registry.(for deploying via the cloud on an-premise device)" />

                                    <FormControlLabel classes={{label:classes.checkboxlabel}} value="GPU" control={<Radio color="primary" />} label="Generate a file for your application.(for deploying manually on an on-premise device)" />
                                </RadioGroup>
                            </FormControl>
                           

                        </div>
                       
                       
                    </div>
                    <button
                        style={{ width: 70, height: 30, lineHeight: 1, borderRadius: 5, backgroundColor: '#fff', marginLeft: 80 ,fontSize:14}}
                    >
                        Save
                    </button>
                </FormGroup>
                </div>
            </div>
          

                    </Box>
                    <Box class="col-sm-3" style={{
                        height: '100%',
                        borderLeft: '1px solid grey',

                    }}>
                        <Box>
                 <p style={{ textAlign: 'center' }}>Registry</p>
                 <button
                        style={{ width: 70, height: 30, lineHeight: 1, borderRadius: 5, backgroundColor: '#fff', marginLeft: 80 ,fontSize:14}}
                    >
                        Start
                    </button>
                    <div class="row" style={{ width: "100%", fontSize: 13, marginTop: 20,display:"inline-flex"}}>
                <div style={{width:10, float:"left"}} >
                    Create Registry
                </div>
                <div style={{width:140, float:"left",marginLeft:30}}  >
                    <LinearWithValueLabel />
                </div>
                <span style={{width:50, float:"left"}} >
                    <button type="submit" style={{ width: 50, height: 30, borderRadius: 5, backgroundColor: "#fff" }}>View</button>
                </span>
            </div>
            </Box>

                        
                    </Box>
                    <Box class="col-sm-4" style={{
                        height: '100%',
                        borderLeft: '1px solid grey',

                    }}>
                        <p style={{ textAlign: 'center' }}>Deploy to target device</p>
                        <FormGroup row>

                    <div class="col-sm-12" style={{ textAlign: "center" }}>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 ,float:"Right"}}>Device IP:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 160, lineHeight: 1.7 }} />
                            </span>
                        </div>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13,float:"right" }}>Username:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 160, lineHeight: 1.7 }} />
                            </span>
                        </div>
                        <div class="row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13,float:"right" }}>Password:</label>
                            </span>
                            <span class="col-sm-6">
                                <input type="text" id="pname" name="pname" style={{ width: 160, lineHeight: 1.7 }} />
                            </span>
                        </div>
                    </div>
                    <div>
                    <button
                        style={{ width: 100, height: 40, lineHeight: 1, borderRadius: 5, backgroundColor: '#fff',fontSize:12,marginLeft:40,marginRight:40 }}
                    >
                        Deploy Another
                    </button>
                    <button
                        style={{ width: 100, height: 40, lineHeight: 1, borderRadius: 5, backgroundColor: '#fff', fontSize:12 }}
                    >
                        Deploy
                    </button>
                    </div>

                </FormGroup>

                    </Box>
                </Box>

        </div>
    );
}
