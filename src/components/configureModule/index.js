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


  const { isCreateProject } = props;
  const setTabValues = () => {
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
          </div>
          <div class='col-sm-7'>
            <AddTab isCreateProject={isCreateProject} />
            <DynamicTabs />
          </div>
          <div class='col-sm-3'>
            <ConfigBuild />
          </div>
        </div>
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
    setSelectedTab: (projectData) => {
      console.log("Project data:", projectData)
      dispatch({ type: "ON_SELECTED_TAB", projectData });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
