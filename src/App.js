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

import React, { useEffect,useState } from 'react';
import './App.css';
import SplashScreen from './components/configureModule/SplashScreen';
import CreateProject from './components/CreateProject';
import {BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import './fonts/font.css';
import OpeningScreen from './components/OpeningScreen';
import LoginScreen from './components/configureModule/SplashScreen';
function App() {
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = useState();
  useEffect(() => {

    console.log('mount it!');
    handleClickOpen();
  }, []);
  
   return (
    <Router>
    <div className="App">
   
      <Switch>
        <Route exact path="/">
        <OpeningScreen/>
        </Route> 
        <Route exact path="/LoginScreen">
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      ><SplashScreen handleClose={handleClose}/>
      </Dialog>
        </Route>
        <Route exact path="/CreateProject">
        <CreateProject />
        </Route>
        <Route exact path="/DynamicTabs">
        </Route>
      </Switch>
      </div>
    </Router>
  );
}
export default App;

