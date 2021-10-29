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

import React, { useEffect } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import SplashScreen from './components/configureModule/SplashScreen';
import CreateProject from './components/CreateProject';
import Configure from '../src/components/configureModule/index'
import DynamicTabs from './components/configureModule/DynamicTabs';
import {BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';



function App() {
  useEffect(() => {

    console.log('mount it!');
    handleClickOpen();
  }, []);
  
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
      <Switch>
        <Route exact path="/">
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
