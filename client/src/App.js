import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";
import Scenario from './scenario';
import Answers from './answerOptions';
import Buttons from './gameButtons';
import GameView from './gameView';

function App() {
const [scenarioNameState , setScenarioName] = useState("");
const [scenarioTypeState , setScenarioType] = useState("");

const submitScenario = () => {

  Axios.post('http://localhost:3001/api/insert',{
    scenarioNameVar: scenarioNameState,
    scenarioTypeVar: scenarioTypeState,
  }).then (() => {
    alert("Scenario Added to DB");
  });
};

  return (
    <div className="App">
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
