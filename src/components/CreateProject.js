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

import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Configure from './configureModule';
import Test from '../components/testModule';
import Deploy from '../components/deployModule';
import { connect } from 'react-redux';
import SplashScreen from './configureModule/SplashScreen';
import companyLogo from '../images/logo-white.png';
import { FullscreenExit } from '@material-ui/icons';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  header:{
    color: "#FFFFFF", 
    backgroundColor: "#0068B5",
    height:"64px",
    fontWeight:700,
    paddingLeft:60,
    paddingTop:14,
    display:"flex",
  },
  paddleft35:{
    paddingLeft:35,
    paddingTop:10,
  }
}));

const CreateProject = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  useEffect(() => {
    console.log("tabdetails use:", props.currentTabCount);
    setValue(props.currentTabCount);
  }, [props.currentTabCount])

  return (
    <div className={classes.root}>
      {props.popup === true && <SplashScreen />}
      <AppBar position="static" color="default">
        <Typography className={classes.header} >
          <div style={{width:80,height:48}}>
        <img src={companyLogo} width="75" alt="Intel logo"/>
        </div>
        <div style={{width:194}}>
         <div className={classes.paddleft35}>EII Deployment Tool</div> 
         </div>
         </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          defaultTab={props.selectedTab}
        >
          <Tab label="Configure and Build" {...a11yProps(0)} />
          <Tab label="Test" {...a11yProps(1)} />
          <Tab label="Deploy" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Configure />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>

          <Test />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Deploy />
        </TabPanel>
      </SwipeableViews>
      <div className='row' style={{ marginTop: 20 }}>
        <div className='col-sm-8'></div>
        <div className='col-sm-4'>
          {props.currentTabCount > 0 && <button
            onClick={() => props.setTabValues(props.currentTabCount - 1)}
            style={{ width: 150, height: 30, borderRadius: 5, backgroundColor: '#fff', float: 'Right' }}
          >
            Back
          </button>}

          {props.currentTabCount < 2 &&
            <button
              onClick={() => props.setTabValues(props.currentTabCount + 1)}
              style={{ width: 150, height: 30, borderRadius: 5, backgroundColor: '#fff', float: 'Right' }}
            >
              Next
            </button>
          }
          <button style={{ width: 150, height: 30, borderRadius: 5, backgroundColor: '#fff' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>

  )
}

const mapStateToProps = (state) => {
  console.log("tabvalues:", state);
  return {
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    currentTabCount: state?.ConfigureBuildReducer?.projectSetup?.tabCount
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setTabValues: (tabdata) => {
      dispatch({ type: 'ON_SELECTED_TAB', value: tabdata });
    },
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);

