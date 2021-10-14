import React, { Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import './AddTab.css';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import ProjectSetup from './ProjectSetup';


const AddTab = (props) => {

  // const {projectSetup} = props;
  console.log("sindu", props);
  let elem = <div></div>;
  if (!props.projectSetup.isValid) elem = <ProjectSetup />
  return (
    <Fragment>{elem}</Fragment>
  );
}
const mapStateToProps = (state) => {
  return {
    projectSetup: {
      isCreateProject: false,
      noOfStreams: 0,
      projectName: "",
      projectLocation: "",
      existingProjectLocation: "",
      isValid: state.ConfigureBuildReducer.projectSetup.isValid,
      // isValid:false,
      selectedTab: '',
      setSelectedTab: '',
      tabCount: 3,
    },
    existProjects: [],
    projects: []// list of dynamic tabs
  }
}
const mapDispatchToProps = (dispach) => {
  return {
    onTabValue: () => dispach({ type: 'ON_TABVALUE' }),
    // updateProjectInfo: (projectData) => {
    //   dispatch({type:"UPDATE_PROJECT_INFO", projectData });
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTab);


