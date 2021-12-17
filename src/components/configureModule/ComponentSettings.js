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

import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import "./ComponentSettings.css";




const ComponentSettings = () => {
  const [state, setState] = React.useState({
    checkedB: false,

  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <div>
      <div>
        <p className="textAlignCenter">Settings</p>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                name="checkedB"
                color="primary"
              />
            }
            label="use default Settings"
          />
          <div className="col-sm-6">
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >Image Type:</label>
              <input className="col-sm-6 fieldWidth" type="text" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >Level:</label>
              <input className="col-sm-6 fieldWidth" type="text" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >Queue size:</label>
              <input className="col-sm-6 fieldWidth" type="text" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label for="fname" className="col-sm-6 fontSize13"  >Camera:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>

          </div>
          <div className="col-sm-6">
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >Start row:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  ># of rows:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >binning:</label>
              <input className="col-sm-6 fieldWidth" type="text" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >exposure time:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >range axis:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >ad bits:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>

          </div>

        </FormGroup>
      </div>
      <div className="borderTop">
        <p className="textAlignCenter">Video Ingestion Communications</p>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                name="checkedB"
                color="primary"
              />
            }
            label="use default Settings"
          />
          <div className="col-sm-6">
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >setting #1:</label>
              <input className="col-sm-6 fieldWidth" type="text" id="pname" name="pname"   />
            </div>
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >setting #2:</label>
              <input className="col-sm-6 fieldWidth" type="text" id="pname" name="pname"   />
            </div>

          </div>
          <div className="col-sm-6">
            <div className="marginBot">
              <label className="col-sm-6 fontSize13" for="fname"  >setting #3:</label>
              <input type="text" className="col-sm-6 fieldWidth" id="pname" name="pname"   />
            </div>


          </div>
          <div className="col-sm-12">
            <Typography component="div" className="floatright">
              <Button variant="contained">Save</Button>
            </Typography>
          </div>

        </FormGroup>
      </div>
    </div>
  )
}

export default ComponentSettings;

