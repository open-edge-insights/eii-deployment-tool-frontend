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

    // zIndex:-1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function DynamicTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [name, setName] = useState();
  const [indexes, setIndexes] = useState([]);
  // const [selectedTab, setSelectedTab] = useState(0);
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
          {/* <div className="fl-left mg-l-10 layout bg-dkg">
            <CSSTransitionGroup
              transitionName="slideRight"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}>
              {slide}
            </CSSTransitionGroup>
            Slide from right
          </div> */}
          {/* <Box
            style={{
              zIndex: 0,
              borderRight: '1px solid grey',
              borderBottom: '1px solid grey',
              position: 'absolute',
              right: 0,
              height: '100%',
            }}
          >
            {!props.isOpen && <p style={{ textAlign: 'center' }}>Settings</p>}
            {props.isOpen && <ComponentSettings />}


          </Box> */}
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
