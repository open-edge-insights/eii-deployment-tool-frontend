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
// import "./TestProfileSettings.css";




const Output = () => {
    const [state, setState] = React.useState({
        checkedB: false,

    });

    const handleChange = (event) => {
        console.log("handlechange");
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    return (
        <div>
            <div class="row" style={{ marginTop: '90px' }}>
                <FormGroup row>


                    <div class="col-sm-12" style={{ textAlign: "center" }}>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>Output threshold:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                           

                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>reference image:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                            
                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">
                                <label for="fname" style={{ fontSize: 13 }}>Modal file:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                           

                        </div>
                        <div class="col-sm-12 row" style={{ marginBottom: 10 }}>
                            <span class="col-sm-4">

                                <label for="fname" style={{ fontSize: 13 }}>Device:</label>
                            </span>
                            <span class="col-sm-4">
                                <input type="text" id="pname" name="pname" style={{ width: 50, lineHeight: 1.7 }} />
                            </span>
                           
                        </div>
                       
                    </div>
                    <button
                        // variant="contained"
                        // type='submit'
                        // onClick={projectSetupSubmit}
                        style={{ width: 100, height: 40, lineHeight: 1, borderRadius: 5, backgroundColor: '#fff', marginLeft: 80 }}
                    >
                        {/* <Link to="/Dynamic">OK</Link> */}
                        Save & Restart
                    </button>

                </FormGroup>
            </div>
          


        </div>
    )
}




export default Output;

