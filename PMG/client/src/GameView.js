import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Trackers from './Trackers';
import Scenario from './Scenario';
import OptionList from './OptionList';
import Buttons from './GameButtons';
import Explanation from './Explanation';
import Result from './Result';
import './GameView.css';


function GameView(props) {
    
    const [gameData, setGameData] = useState([{}]);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [optionUI, setOptionUI] = useState([
        {id: 1, selected: false, feedback: 0},
        {id: 2, selected: false, feedback: 0},
        {id: 3, selected: false, feedback: 0},
        {id: 4, selected: false, feedback: 0}]);
    const [submitted, setSubmitted] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);
    const [showResult, setShowResult] = useState(false);
    
    //Fetch game content from the database
    useEffect(() => {
        
        function fetchData() {
            Axios.get('https://tuni-pmg.herokuapp.com/api/content/startgame', {params: {difficulty: 1, limit: 15}})
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
        <Container className='gameview'>
            <Trackers index={index} length={gameData.length} score={score}/>
            <Scenario
                title={gameData[index].scenarioname}
                text={gameData[index].questiontext}
                picture={`https://tuni-pmg.herokuapp.com/${gameData[index].picture}`}/>
            <OptionList
                option1={gameData[index].option1}
                option2={gameData[index].option2}
                option3={gameData[index].option3}
                option4={gameData[index].option4}
                optionUI={optionUI}
                setOptionUI={setOptionUI}
                submitted={submitted}/>
            <Row>
                {submitted ?
                    <Explanation text={gameData[index].explanation}/>
                : ''}
                </Row>
            <Buttons
                submitted={submitted}
                handleSubmit={handleSubmit}
                goForward={goForward}
                gameEnd={gameEnd}
                setShowResult={setShowResult}
                optionUI={optionUI}/>
        </Container>
        }
        </div>
    )
}

export default GameView;
