import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";
import GameView from './GameView';

function App() {

  return (
    <div className="App">
      
      <GameView/>

    </div>
  );
}

export default App;
