import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import './App.css';
import LoginForm from './loginForm';
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom";
import Home from './home';
import AddScenarioForm from "./addScenario";
import Axios from "axios";
import Scenario from './scenario';
import Answers from './answerOptions';
import Buttons from './gameButtons';
import GameView from './gameView';

function App() {
  return (
    <div className="App">
      <div className="container">
        <Router>
          <div>
            <Link className="nav" to="/">PMG</Link>
            <Link className="nav" to="/forteachers">For Teachers</Link>
            <Link className="nav" to="/addscenario">Add Scenario</Link>
          </div>
          <Switch>
            <Route path="/forteachers">
              <LoginForm/>
            </Route>
            <Route path="/addscenario">
              <AddScenarioForm/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
        </Router>
      </div>
      {/*<h1> Hello PMG</h1>
      <div className="form">
        <label>Scenario Name</label>
        <input
         type="text" 
         name="scenarioName"
         onChange={(e) => {setScenarioName(e.target.value);}}
         ></input>
        <label>Scenario type</label>
        <input 
        type="text" 
        name="scenarioType"
        onChange={(e) => {setScenarioType(e.target.value);}}></input>
        
        
        <button onClick={submitScenario}> Submit</button>

      </div>*/}
      <GameView/>

    </div>
  );
}

export default App;
