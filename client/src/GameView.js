import React, {useEffect, useState} from 'react';
import Axios from "axios";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Scenario from './Scenario';
import Buttons from './GameButtons';
import Explanation from './Explanation';
import Result from './Result';
import './GameView.css';


function GameView(props) {
    
    const [gameData, setGameData] = useState([{}]);
    const [index, setIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [optionUI, setOptionUI] = useState([
        {id: 1, selected: false, feedback: 0},
        {id: 2, selected: false, feedback: 0},
        {id: 3, selected: false, feedback: 0},
        {id: 4, selected: false, feedback: 0}]);
    const [score, setScore] = useState(0);
    const [gameEnd, setGameEnd] = useState(false);
    const [showResult, setShowResult] = useState(false);
    
    //Fetch game content from the database
    useEffect(() => {
        
        function fetchData() {
            Axios.get('http://localhost:3001/api/content/startgame', {params: {difficulty: 1, limit: 15}})
            .then((response) => {
                console.log(response.data);
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


    
    /*Updates feedback according to given answers & updates score according to feedback*/
    function checkAnswers() {

        const newOptions = optionUI.map((item, i) => {
            if (item.selected) {
                
                if ((i===0 && gameData[index].correct1===1) || (i===1 && gameData[index].correct2===1) || (i===2 && gameData[index].correct3===1) || (i===3 && gameData[index].correct4===1)) {
                    return {...item, feedback: 1};
                }
                else {
                    return {...item, feedback: -1};
                }
            }
            return item;
        });

        setOptionUI(newOptions);

        var newScore = newOptions.reduce((acc, obj) => acc + obj.feedback, score);
        setScore(newScore);
    }
    
    /*Button actions*/
    function handleSubmit() {
        setSubmitted(true);
        checkAnswers();
        if (index === gameData.length-1) {
            setGameEnd(true);
        }
    }

    function goForward() {
        const nextIndex = index + 1;
        if (nextIndex < gameData.length) {
            setIndex(nextIndex);
            cleanOptionUI();
            setSubmitted(false);
        } else {
            setGameEnd(true);
        }
    }

    /*Helper functions*/
    function cleanOptionUI() {
        setOptionUI(optionUI.map((item) => {
            return {...item, feedback: 0, selected: false};
        }));
    }
    function countTotal() {
        let total = 0;
        for (var i=0; i < gameData.length; i++) {
            total = total + gameData[i].correct1 + gameData[i].correct2 + gameData[i].correct3 + gameData[i].correct4;
        }
        return total;
    }

    return (
        <div>
        {showResult ?
            <Result score={score} total={countTotal()}/>
            :
        <Card className='gameview'>
            <Card.Header className='trackers'>
                <ProgressBar label={`Scenario ${index+1} / ${gameData.length}`} now={index+1} max={gameData.length} variant='info'/>
                <Badge variant='info'>Score: {score}</Badge>
            </Card.Header>
            <Scenario
            title={gameData[index].scenarioname}
            text={gameData[index].questiontext}
            picture={gameData[index].picture}
            option1={gameData[index].option1}
            option2={gameData[index].option2}
            option3={gameData[index].option3}
            option4={gameData[index].option4}
            optionUI={optionUI}
            setOptionUI={setOptionUI}
            submitted={submitted}/>
            {submitted ?
                <Explanation text={gameData[index].explanation}/>
            : ''}
            <Buttons submitted={submitted} handleSubmit={handleSubmit} goForward={goForward} gameEnd={gameEnd} setShowResult={setShowResult} optionUI={optionUI}/>

        </Card>
        }
        </div>
    )
}

export default GameView;
