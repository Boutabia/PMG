import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import './App.css';
import Axios from "axios";
import GameView from './GameView';
import Button from 'react-bootstrap/Button'

function App() {

  function startGame() {
    Axios.get('http://localhost:3001/api/content/startgame')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  }

  return (
    <div className="App">
      
      <Button onClick={startGame}>Start game</Button>
      <GameView/>

    </div>
  );
}

export default App;
