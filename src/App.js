import React, { useEffect } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import SplashScreen from './components/configureModule/SplashScreen';
import CreateProject from './components/CreateProject';
import Configure from '../src/components/configureModule/index'
import DynamicTabs from './components/configureModule/DynamicTabs';
import {BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import SplashScreen from '../src/components/configureModule/SplashScreen';
import Dialog from '@material-ui/core/Dialog';



function App() {
  // const selector=useSelector(state=>state);
  useEffect(() => {

    console.log('mount it!');
    handleClickOpen();
  }, []);
  
  // const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const dispatch=useDispatch();
  return (
    <Router>
    <div className="App">
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      ><SplashScreen handleClose={handleClose}/>
      </Dialog>
    {/* <Counter/> */}
      <Switch>
        {/* <Route exact path="/"> */}
          {/* <Configure /> */}
        {/* <HomePage /> */}
        {/* <SplashScreen /> */}

        {/* </Route> */}
        <Route exact path="/">
        <CreateProject />
        </Route>
        <Route exact path="/DynamicTabs">
        {/* <DynamicTabs /> */}
        </Route>
      </Switch>
      </div>
    </Router>
  );
}
export default App;
