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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './AddTab.css';
import TabPanel from './TabPanel';
import { connect } from 'react-redux';
import ComponentsLayout from './ComponentsLayout';
import ComponentSettings from './ComponentSettings'
import Video from './Video';
import localforage from 'localforage';
import "./DynamicTabs.css";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    position: "static",
    color: "default",

    backgroundColor: theme.palette.background.paper,
  },
}));

export function DynamicTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [name, setName] = useState();
  const [indexes, setIndexes] = useState([]);
  const tabCount = 3;

  var tabsHeader = [];
  var tabsContaner = [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  for (let index = 0; index < props?.projectSetup?.noOfStreams; index++) {
    tabsHeader.push(
      <Tab
        className="border borderRadius"
        label={`Data Stream #${index + 1}`}
        {...a11yProps(index)}
      />
    );
  }

  for (let index = 0; index < props?.projectSetup?.noOfStreams; index++) {
    tabsContaner.push(
      <TabPanel key={index} value={value} index={index}>
        <div
           className='row col-sm-12 tabpan'
          
        >
          <ComponentsLayout name={props.appName}
            className='col-sm-6'
           >
            <Box>
              <p className="textAlignCenter">Components Layout</p>
              <button
                type='submit'
               className="butvalue"
              >
                Import Code
              </button>
            </Box>
          </ComponentsLayout>
        </div>
      </TabPanel>
    );
  }
  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange}
        variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary">
        {tabsHeader}
      </Tabs>

      {tabsContaner}
    </div>
  );
}

const mapStateToProps = (state) => {
  console.log("Dynamic tab:", state)
  return {
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    isOpen: state?.ConfigureBuildReducer?.getData?.isOpen,
    appName: state.ConfigureBuildReducer.getData.appName,

  };
};



export default connect(mapStateToProps, null)(DynamicTabs);
