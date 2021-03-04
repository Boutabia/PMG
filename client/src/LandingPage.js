import React from 'react';
import { hslToRgb, makeStyles, rgbToHex } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from './PlayButton';
import { Link } from 'react-router-dom';
import { palette } from '@material-ui/system';
import { FaAlignRight } from 'react-icons/fa';


const useStyles = makeStyles((theme) => ({
  
  root: {
    flexGrow: 1,
  },
  paper: {
  
    background: "#4E0091",
    height: '92vh',
    width: '230vh',
    position: 'absolute',
    right: '0px',
    top: '67px',

    
    
  
    
  },
}));

export default function NestedGrid() {
  const classes = useStyles();


  function FormRow() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Paper>
            <div>
          <Paper className={classes.paper}></Paper>
          <header className="welcomeText">Welcome to Project Management Game</header>
          <div>
          <button class="btn striped-shadow blue"><span>Play</span></button>
  
         </div>
          <text className="instructionsText">For player: The purpose of this game is to learn projects management skills throughout different scenarios and question sets. After starting the game, player will receive one scenario and question with four answer options at the time. The scenario can be for example a picture, text or combination of those. The question is related to scenario and player chooses the option which describes best the correct procedure in scenario shown. There can also be multiple correct answers, so player is able to pick more than one answer option in each phase. Choose the best alternative(s) and the game will show the right answer(s) right away. The player gets points from every correct answer and total score can be seen after finishing the game.</text>
          </div>
          
          </Paper>
          
        </Grid>
        
      </React.Fragment>
    );
  }

  /*<Link className="btn striped-shadow blue" to={`/gameview`}><span>Play</span></Link>*/

  return (
    <div className={classes.root}>
      <Grid container spacing={6}>
        <Grid container item xs={12} spacing={3}>
          <FormRow />
        </Grid>
        
        
      </Grid>
    </div>
  );
}




