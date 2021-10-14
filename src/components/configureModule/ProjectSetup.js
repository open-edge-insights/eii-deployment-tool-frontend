import React, { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import './AddTab.css';
import { connect } from 'react-redux';
import "./ProjectSetup.css";
import { CallMissedSharp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
   butOk:{
    width: 100,
    height: 40,
    background: "#fff 0% 0% no-repeat padding-box",
    border: "1px solid #2B2C30",
    borderRadius:5,
    position: 'relative', 
    left: 350,
    color:"#262626",
      '&:hover': {
        background:"#E9EAEB 0% 0% no-repeat padding-box",
        // backgroundColor:"#004A86",
        border: "1px solid #2B2C30",
  }
  },
  
  borGrey:{
    border: "1px solid #C9CACE !important",
  },
  RadioGroup:{
    '&$checked': {
      color: '#0068B5',
    }
  },
  checked: {}
}));


const ProjectSetup = (props) => {
  const classes = useStyles();
const [projectList,setProjectList ] = useState([])
const [error,setError ] = useState({
    project_name:false,
})

  const [state, setState] = useState({
    isCreateProject: false,
    noOfStreams: 1,
    projectName: '',
    projectLocation: '',
    existingProjectLocation: '',
  });

  const onChangeHandle = (e, type) => {
    let currentState = { ...state },
      value = '';
    if (e && e.target && e.target.value !== undefined){ 
        value = e.target.value
         sendProjectName(value)
    };
    currentState[type] = value;
    setState(currentState);
    console.log('1', currentState);
    console.log(currentState);
    
  };

  const projectSetupSubmit = () => {
    if(state.projectName.trim() != ''){
      props.updateProjectInfo({ ...state },props.getStateVal);
    }else{
          setError({
              ...error,
              project_name:true,
          });
          // setTimeout(()=>{
          //   setError({
          //     ...error,
          //     project_name:false,
          //    })
          // },3000)
      
    }

  };

  const getProjectList = (event)=>{
    axios.get('/eii/ui/project/list')
    .then((e)=>{
       console.log(e);
      setProjectList(JSON.parse(e?.data?.data) || []);
    }).catch((e)=>{
         console.log(e);
    }) 
  }

  const  sendProjectName = (value)=>{
    axios.post('/eii/ui/project/store',{"name": value})
    .then((e)=>{
         console.log(e)
    }).catch((e)=>{
         console.log({e});
    }) 
  }
  return (
    <div className="marTop50">
      <Box className="boxSetting"
        sx={{
          bgcolor: '#F5F5F5',
          margin: '0 auto',
          border:'1px solid #F5F5F5',
   
        }}
      >
        <FormControl className="forWidth" component='fieldset'>
          <RadioGroup aria-label='projecSelect' name='projecSelect' 
          classes={{root: classes.RadioGroup, checked: classes.checked}}>
            <FormControlLabel value='New' className="width220" control={<Radio color="primary" />} label='Create a new project' ></FormControlLabel>
            <div className="formFirstWidth">
              <span>
                <label for='fname' className="padLeft15">Project name:</label>
                <input
                  type='text'
                  placeholder="Project name"
                  onBlur={(e) => onChangeHandle(e, 'projectName')}
                  id='pname'
                  name='pname'
                  className={error.project_name && "input_error"}
                />
              </span>
            </div>
          
            <div className="formSecondWidth">
              <span>
                <label className="padLeft15" for='fname'>Number of data streams for your project:</label>
                <select className="createSelect"
                  value={state.noOfStreams}
                  onChange={(e) => onChangeHandle(e, 'noOfStreams')}
                >
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>

                  <option value='5'>5</option>

                  <option value='6'>6</option>

                </select>
              </span>
            </div>
            <hr />

            <FormControlLabel
              value='Open'
              control={<Radio  color="primary" onChange={getProjectList}/>}
              label='Open an existing project'
              className="openRadio width220"
              // style={{borderTop:'1px solid #BBBBBB'}}
            />
            <div className="openDiv">
              <span>
                <select  className="openSelect">
                  <option value='1'>Select Project</option>
                  {projectList.map((el,index)=>{
                      return ( <option key={index} value={el}>{el}</option>);
                  })}
                </select>
              </span>
            </div>
          </RadioGroup>
          <button    
            onClick={projectSetupSubmit}
            className={classes.butOk}
            // style={{ borderRadius: 5, backgroundColor: '#fff',border:"1px solid #2B2C30",color:"#262626", position: 'relative', left: 350 }}
          >
            OK
          </button>
        </FormControl>
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isCreateProject: state.ConfigureBuildReducer.isCreateProject,
    noOfStreams: 1,
    projectName: '',
    projectLocation: '',
    existingProjectLocation: '',
    getStateVal : state,
  };
};
const mapDispatchToProps = (dispatch) => {
  console.log("checking tab value:",dispatch);
  return {
    onTabValue: () => dispatch({ type: 'ON_TABVALUE' }),
    updateProjectInfo: (projectData,curState) => {
      console.log("curState1:", curState);
      dispatch({ type: 'UPDATE_PROJECT_INFO', value:projectData });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetup);

