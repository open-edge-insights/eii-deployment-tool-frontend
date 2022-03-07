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
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(3, 2),
    maxWidth:360,
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
}));
const HomePage = ()=>{
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography style={{fontWeight:"700"}} variant="h6">
                intel
              </Typography>
            </Grid>
           </Grid>
          <Typography style={{color:"#0071c5"}} variant="h4">
            eDGe INSIGHTS
          </Typography>
          <Typography style={{fontWeight:"700"}} variant="h6">
            FOR INDUSTRIAL
          </Typography>
        </div>
        <Divider />
      <Container maxWidth="md" >
        <Typography component="div" style={{textalign: 'center',marginBottom:'40px'}} >
            Welcome to the Web Deployment Tool. This tool will guide you through the process of configuring, provisioning, debugging and deploying your application for your project.
        </Typography>
        <Typography component="div" style={{ border: '1px solid',marginBottom:'40px'}} >
        <List component="nav" aria-label="secondary mailbox folders">
        <ListItem  >
          <ListItemText >
              <span style={{fontWeight:'700',textAlign:'center'}}>The main step of the EII deployment process are:
</span>
              </ListItemText>
          
        </ListItem>
        <ListItem >
          <ListItemText primary=" 1.Configure & provision your analytic application." />
          
        </ListItem>
        <ListItem >
        <ListItemText primary=" 2. Build your project containers." />
        </ListItem>
        <ListItem >
          <ListItemText primary=" 3. Deploy & debug your analytic application." />
          </ListItem>
        
      </List>
           
        </Typography>
        <Typography component="div" style={{float:"right"}}>
        <Button variant="contained" style={{marginRight:"40px"}}><Link to="/">Cancel</Link></Button>
        <Button variant="contained"><Link to="/CreateProject">Next</Link></Button>
        </Typography>

      </Container>
       
      </div>
    )
}

export default HomePage;

