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
import { connect } from 'react-redux';
import './TestDynamic.css';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export function TestDynamic(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    
  var tabsHeader = [];
  var tabsContaner = [];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    for (let index = 0; index < props?.projectSetup?.noOfStreams; index++) {
        tabsHeader.push(
          <Tab className='box borderRadius'
            label={`Data Stream #${index + 1}`}
            {...a11yProps(index)}
          />
        );
      }
       for (let index = 0; index < props?.projectSetup?.noOfStreams; index++) {
    tabsContaner.push(
      <TabPanel key={index} value={value} index={index}>
        <div
          className='row col-sm-12 height570 positionrel padding0' >
         
                <Box className='row col-sm-12 box height570'>
                    <Box className="col-sm-3 height100" >
                        <p className="textAlignCenter">Components Layout</p>

                    </Box>
                    <Box className="col-sm-9 height100 borderLeft" >
                        <Box className="row col-sm-12 height100" >
                            <Box className="col-sm-6 height100" >
                                <TestProfileSettings />
                                {/* <Output /> */}
                            </Box>
                            <Box className="col-sm-6 height100" >
                                {/* <Video /> */}
                            </Box>
                        </Box>
                    </Box>
                </Box>

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



export default connect(mapStateToProps, null)(TestDynamic);
