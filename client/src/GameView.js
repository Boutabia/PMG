import React, {useEffect, useState} from 'react';
import Axios from "axios";
import Card from 'react-bootstrap/Card';
import Scenario from './Scenario';
import Buttons from './GameButtons';
import Button from 'react-bootstrap/Button';
import Explanation from './Explanation';


function GameView(props) {
    
    const [gameData, setGameData] = useState([]);
    const [index, setIndex] = useState(0);
    
    const [scenario, setScenario] = useState(
        {scenarioTitle:"", scenarioText:""});
        
    const [options, setOptions] = useState([
            {id:1, optionText:"", isCorrect:false, selected:false, feedback:0},
            {id:2, optionText:"", isCorrect:true, selected:false, feedback:0},
            {id:3, optionText:"", isCorrect:false, selected:false, feedback:0},
            {id:4, optionText:"", isCorrect:false, selected:false, feedback:0}
        ]);

    const [submitted, setSubmitted] = useState(false);

    function fetchData() {
        Axios.get('http://localhost:3001/api/content/startgame', {params: {difficulty: 3, limit: 15}})
        .then((response) => {
            console.log(response.data);
            setGameData(response.data);
            console.log(gameData);
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

    function handleSubmit() {
        setSubmitted(true);
        setOptions(options.map((item) => {
            if (item.selected) {
                if (item.isCorrect) {
                    return {
                        ...item, feedback: 1
                    };
                } else {
                    return {
                        ...item, feedback: 2
                    };
                }
        }
            return item;
        }))
    }

    function goForward() {
        const nextIndex = index + 1;
        setIndex(nextIndex);
    }

    return (
        <Card className='game-view'>
                <Button onClick={fetchData}>Fetch data</Button>
                <div>
                    {gameData.map(scenario => (
                        <Scenario title={scenario.scenarioname} text={scenario.questiontext}/>
                    ))}
                </div>
            <Buttons options={options} setOptions={setOptions} handleSubmit={handleSubmit} submitted={submitted} goForward={goForward}/>
            {submitted ?
                <Explanation/>
            : ''}
        </Card>
    )
}

export default GameView;
