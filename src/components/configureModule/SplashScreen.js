import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
// import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import "./SplashScreen.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(0),
    maxWidth: 360,
    // borderBottom:1,
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
}));


const SplashScreen = (props) => {

  // useEffect(() => {

  //   console.log('mount it!');
  //   handleClickOpen();
  // }, []);

  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      > */}
        <DialogTitle id="alert-dialog-title">
          <div className={classes.section1}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography style={{ fontWeight: "700" }} variant="h6">
                  intel©
                </Typography>
              </Grid>
            </Grid>
            <Typography style={{ color: "#0071c5" }} variant="h4">
              EDGE INSIGHTS
            </Typography>
            <Typography style={{ fontWeight: "700" }} variant="h6">
              FOR INDUSTRIAL
            </Typography>
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography component="div" style={{ textalign: 'center', marginBottom: '20px' }} >
              Welcome to the Edge Insights for Industrial (EII) Deployment Tool. This tool will guide you through the process of configuring, provisioning, debugging and deploying your application for your project.
            </Typography>
            <Typography component="div" style={{ border: '1px solid', marginBottom: '20px' }} >
              <List component="nav" aria-label="secondary mailbox folders">
                <ListItem style={{ textAlign: 'center' }}>
                  <ListItemText>
                    <span style={{ fontWeight: '700', textAlign: 'center' }}>The main steps of the EII deployment process are:
                    </span>
                  </ListItemText>

                </ListItem>
                <ListItem >
                  <ListItemText primary=" 1. Configure & provision your analytic application." />
                </ListItem>
                <ListItem >
                  <ListItemText primary=" 2. Build your project containers." />
                </ListItem>
                <ListItem >
                  <ListItemText primary=" 3. Deploy & debug your analytic application." />
                </ListItem>

              </List>

            </Typography>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={()=> props.handleClose(false)} color="primary">
            <Link to="/">
              Cancel
            </Link>
          </Button> */}
          <Button onClick={()=> props.handleClose(false)} color="primary" autoFocus>
              Ok
          </Button>
        </DialogActions>
      {/* </Dialog> */}
    </div>
  );
}

export default SplashScreen;
