import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddTab from './AddTab';
import ComponentList from './ComponentList';
import ConfigBuild from './ConfigBuild';
import DynamicTabs from './DynamicTabs';
import ComponentsLayout from './ComponentsLayout'
import { useState } from 'react';
import { connect } from 'react-redux';
import SplashScreen from './SplashScreen';
import Dialog from '@material-ui/core/Dialog';


const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const Configure = (props) => {
  const [state, setState] = useState(true);
  const [name, setName] = useState();


  // triggerAddTabState = () => {
  //   setState('add tab');
  // }
  // const { classes } = props;
  const { isCreateProject } = props;
  const setTabValues = () => {
    //validation. 1. isCreateProject true - noofstreams and project name
    //2. isCreateProject false - existing project location

    props.setSelectedTab({ ...state });
  };
 

  return (
    <div>
   
      <p style={{ textAlign: 'center' }}>
        Create or select a project, import your code, then configure your data streams.
      </p>

      <div class='container fluid'>
        <div class='row'>
          <div class='col-sm-2' style={{ padding: 0 }}>
            <ComponentList setName={setName} />
            {/* <SplashScreen /> */}
          </div>
          <div class='col-sm-7'>
            {/* no if streams === 0 project setup isValid false */}
            <AddTab isCreateProject={isCreateProject} />
            {/* no if streams >= 0 Project setup is valid */}
            {/* <ComponentsLayout />  */}
            <DynamicTabs />
            {/* </ComponentsLayout> */}
            {/* <Pipeline /> */}
          </div>
          <div class='col-sm-3'>
            <ConfigBuild />
          </div>
        </div>
        {/* <div class='row' style={{ marginTop: 20 }}>
          <div class='col-sm-8'></div>
          <div class='col-sm-4'>
            <button
            onClick={setTabValues}
              type='submit'
              style={{ width: 150, height: 30, borderRadius: 5, backgroundColor: '#fff', float: 'Right' }}
            >
              Next
            </button>
            <button type='submit' style={{ width: 150, height: 30, borderRadius: 5, backgroundColor: '#fff' }}>
              Cancel
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

Configure.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  console.log("createProjectLayout:", state);
  return {
    tab: state.tab,
    createProjectLayout: state.ConfigBuildReduce,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // onTabValue: () => dispatch({ type: 'ON_TABVALUE' }),
    setSelectedTab: (projectData) => {
      console.log("Project data:", projectData)
      dispatch({ type: "ON_SELECTED_TAB", projectData });
    }
  };
};

//   export default withStyles(styles)(Configure);
export default connect(mapStateToProps, mapDispatchToProps)(Configure);
