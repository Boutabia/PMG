import React, {useEffect, useState} from 'react';
import Axios from "axios";
import Card from 'react-bootstrap/Card';
import Scenario from './Scenario';
import Buttons from './GameButtons';
import Button from 'react-bootstrap/Button';
import Explanation from './Explanation';


function GameView(props) {
    
    const [gameData, setGameData] = useState([{}]);
    const [index, setIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    
    useEffect(() => {
        
        function fetchData() {
            Axios.get('http://localhost:3001/api/content/startgame', {params: {difficulty: 1, limit: 15}})
            .then((response) => {
                setGameData(response.data);
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

        fetchData();
        },[]);

    function handleSubmit() {
        setSubmitted(true);
        /*setOptions(options.map((item) => {
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
        }))*/
    }

    function goForward() {
        const nextIndex = index + 1;
        setIndex(nextIndex);
    }

    return (
        <Card className='game-view'>
            <Scenario
            title={gameData[index].scenarioname}
            text={gameData[index].questiontext}
            option1={gameData[index].option1}
            option2={gameData[index].option2}
            option3={gameData[index].option3}
            option4={gameData[index].option4}/>
            <Buttons submitted={submitted} handleSubmit={handleSubmit} goForward={goForward}/>
            {submitted ?
                <Explanation text={gameData[index].explanation}/>
            : ''}
        </Card>
    )
}

export default GameView;
