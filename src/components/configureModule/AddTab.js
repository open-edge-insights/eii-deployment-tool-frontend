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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTab);


