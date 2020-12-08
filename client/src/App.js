import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";
import GameView from './GameView';

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
     
      <GameView/>

    </div>
  );
}

export default App;
