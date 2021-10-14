import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { grey } from '@material-ui/core/colors';
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';
import "./TestProfileSettings.css";




const TestProfileSettings = () => {
    const [state, setState] = React.useState({
        checkedB: false,

    });

    const handleChange = (event) => {
        console.log("handlechange");
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    return (
        <div>
            <div>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox
                                // checked={state.checkedB}
                                // onChange={handleChange}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="use default Settings"
                    />
                    <span>
                        <PlayCircleOutlineIcon style={{ fontSize: 40 }} />
                        <PauseCircleOutlineIcon style={{ fontSize: 40 }} />

                    </span>
                    <div class="col-sm-12" style={{ textAlign: "center" }}>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>Gain [dB]:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            <span class="col-sm-4">
                                <Slider
                                    // value={value}
                                    // onChange={handleChange}
                                    valueLabelDisplay="auto"
                                // aria-labelledby="range-slider"
                                // getAriaValueText={valuetext}
                                />
                            </span>

                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>Black Level[DN]:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            <span class="col-sm-4">
                                <Slider
                                    // value={value}
                                    // onChange={handleChange}
                                    valueLabelDisplay="auto"
                                // aria-labelledby="range-slider"
                                // getAriaValueText={valuetext}
                                />
                            </span>
                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>Gamma:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            <span class="col-sm-4">
                                <Slider
                                    // value={value}
                                    // onChange={handleChange}
                                    valueLabelDisplay="auto"
                                // aria-labelledby="range-slider"
                                // getAriaValueText={valuetext}
                                />
                            </span>

                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">

                                <label for="fname" style={{ fontSize: 13 }}>Exposure time:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            <span class="col-sm-4">
                                <Slider
                                    // value={value}
                                    // onChange={handleChange}
                                    valueLabelDisplay="auto"
                                // aria-labelledby="range-slider"
                                // getAriaValueText={valuetext}
                                />
                            </span>
                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>Aquisition Frame:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            <span class="col-sm-4">
                                <Slider
                                    // value={value}
                                    // onChange={handleChange}
                                    valueLabelDisplay="auto"
                                // aria-labelledby="range-slider"
                                // getAriaValueText={valuetext}
                                />
                            </span>
                        </div>
                    </div>


                </FormGroup>
            </div>
            <div style={{ borderTop: "2px solid grey" }}>
                <div class="col-sm-12 row" style={{ display: "inline-flex", marginTop: 5 }}>
                    <span class="col-sm-6">
                        <p> Pipeline Settings</p>
                    </span>
                    <span class="col-sm-6">
                        <button
                            // variant="contained"
                            // type='submit'
                            // onClick={projectSetupSubmit}
                            style={{ width: 100, height: 40, lineHeight: 1, borderRadius: 5, backgroundColor: '#fff', marginLeft: 80 }}
                        >
                            {/* <Link to="/Dynamic">OK</Link> */}
                            Save & Restart
                        </button>

                    </span>
                </div>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox
                                // checked={state.checkedB}
                                // onChange={handleChange}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="use default Settings"
                    />

                    <div class="col-sm-12" style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: 10 }}>
                            <FormControl component="fieldset" >
                                {/* <FormLabel  labelPlacement="start"component="legend">Gender</FormLabel> */}
                                <RadioGroup aria-label="quiz" name="quiz" style={{ display: "block" }} >
                                    <span>Decode Pligin:</span>
                                    <FormControlLabel value="CPU" control={<Radio color="primary" />} label="CPU" />

                                    <FormControlLabel value="GPU" control={<Radio color="primary" />} label="GPU" />
                                </RadioGroup>
                            </FormControl>

                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <RadioGroup aria-label="quiz" name="quiz" style={{ display: "block" }}>
                                <span>fpscounter:</span>

                                <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio color="primary" />} label="No" />
                            </RadioGroup>
                        </div>
                        <div class="col-sm-8" style={{ marginBottom: 10 }}>
                            <label for="fname" class="col-sm-7" style={{ fontSize: 13 }}>Resize output-width:</label>
                            <input type="text" class="col-sm-5" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                        </div>
                        <div class="col-sm-8" style={{ marginBottom: 10 }}>
                            <label for="fname" class="col-sm-7" style={{ fontSize: 13 }}>Resize output-height:</label>
                            <input type="text" class="col-sm-5" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                        </div>


                    </div>


                </FormGroup>
            </div>
        </div>
    )
}

export default TestProfileSettings;

