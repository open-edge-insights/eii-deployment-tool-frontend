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
import DynamicTabs from './configureModule/DynamicTabs';
import { connect } from 'react-redux';
import SplashScreen from './configureModule/SplashScreen';


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
    backgroundColor: theme.palette.background.paper,
    //   width: 500,
  },
}));

const CreateProject = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const[popup,setPopup]=React.useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  useEffect(() => {
    console.log("tabdetails use:", props.currentTabCount);
    setValue(props.currentTabCount);
    // setPopup(props.popup)
  }, [props.currentTabCount])

  return (
    <div className={classes.root}>
      {props.popup == true && <SplashScreen />}
      <AppBar position="static" color="default">
        <Typography style={{ color: "white", backgroundColor: "black", textAlign: "center" }} >EII Deployment Tool</Typography>
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
          {/* <Configure /> */}
          {/* <DynamicTabs /> */}

          <Test />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Deploy />
        </TabPanel>
      </SwipeableViews>
      
    </div>

  )
}

const mapStateToProps = (state) => {
  console.log("tabvalues:", state);
  return {
    projectSetup: state?.ConfigureBuildReducer?.projectSetup,
    currentTabCount: state?.ConfigureBuildReducer?.projectSetup?.tabCount
    // setPopup: state?.ConfigureBuildReducer?.projectSetup?.popup
  };
};
const mapDispatchToProps = (dispatch) => {
  // console.log("checking dispatch value:",dispatch);
  return {
    // onTabValue: () => dispatch({ type: 'ON_TABVALUE' }),
    /*setTabValues: (tabdata) => {
      dispatch({ type: 'ON_SELECTED_TAB', value: tabdata });
    },*/
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetup);

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);

// export default CreateProject;
