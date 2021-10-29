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
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import "./SplashScreen.css";
import companyLogo from '../../images/logo-black.png';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(0),
    maxWidth: 360,
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
  secColor:{
    color: "#0068B5",
  },
  seeFontWei:{
    fontWeight:"700",
  },
  conBor:{
    border: "1px solid #E9E9E9",
    marginBottom:20,
  },
  textAli:{
    textalign:"center",
  },
  seeFull:{
    textalign:"center",
    fontWeight:"700",
  },
  seeFullmar:{
    textalign:"center",
    marginBottom:20,
  },
  butOk:{
    width: 100,
    height: 40,
    background: "#0068B5 0% 0% no-repeat padding-box",
    border: "1px solid #0068B5",
    color:"#fff",
      '&:hover': {
        backgroundColor:"#004A86",
        border: "1px solid #0068B5",
  }
  },
  marRight15:{
    marginRight:15,
  }
}));


const SplashScreen = (props) => {

    const classes = useStyles();

  return (
    <div>
    
        <DialogTitle id="alert-dialog-title">
          <div className={classes.section1}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography className={ classes.seeFontWei } variant="h6">
                <img src={companyLogo} width="70" height="30" alt="Intel logo"/>
                </Typography>
              </Grid>
            </Grid>
            <Typography className={ classes.secColor } variant="h4">
              eDGe INSIGHTS
            </Typography>
            <Typography className={ classes.seeFontWei } variant="h6">
              FOR INDUSTRIAL
            </Typography>
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography component="div" className={classes.seeFullmar} >
              Welcome to the Edge Insights for Industrial (EII) Deployment Tool. This tool will guide you through the process of configuring, provisioning, debugging and deploying your application for your project.
            </Typography>
            <Typography component="div" className={classes.conBor} >
              <List component="nav" aria-label="secondary mailbox folders">
                <ListItem  >
                  <ListItemText >
                    <span className={ classes.seeFull } >The main steps of the EII deployment process are:
                    </span>
                  </ListItemText>

                </ListItem>
                <ol>
                  <li style={{marginBottom:15}}>&nbsp;Configure & provision your analytic application.</li>
                  <li style={{marginBottom:15}}>&nbsp;Build your project containers.</li>
                  <li style={{marginBottom:15}}>&nbsp;Deploy & debug your analytic application.</li>
                </ol>

              </List>

            </Typography>

          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.marRight15}>
 
          <Button onClick={()=> props.handleClose(false)} className={classes.butOk} >
              Ok
          </Button>
        </DialogActions>
    </div>
  );
}

export default SplashScreen;
