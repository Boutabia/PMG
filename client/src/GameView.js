import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Scenario from './Scenario';
import AnswerList from './AnswerList';
import Answer from './Answer';
import Buttons from './GameButtons';

function GameView(props) {
    const [currentScenario, setCurrentScenario] = useState(0);
    
    const [scenarios, setScenarios] = useState([{
        scenarioTitle:"Scenario Title 1",
        scenarioText:"Curabitur placerat lacus massa, ac congue neque aliquet nec. Morbi id dui tincidunt urna pulvinar vulputate id mollis ante?"}])
        
    const [options, setOptions] = useState([
            {id:1, optionText:"Donec sagittis tortor at massa fringilla efficitur.", isCorrect:false, selected:false, feedback:0},
            {id:2, optionText:"Aenean consectetur sit amet nunc eu ultrices.", isCorrect:true, selected:false, feedback:0},
            {id:3, optionText:"Fusce auctor bibendum dui quis tincidunt.", isCorrect:false, selected:false, feedback:0},
            {id:4, optionText:"Mauris vitae metus scelerisque, tincidunt velit vel.", isCorrect:true, selected:false, feedback:0}
        ])
    const [submitted, setSubmitted] = useState(false);

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

    return (
        <Card className='game-view'>
                <div>
                    <Scenario title={scenarios[currentScenario].scenarioTitle} text={scenarios[currentScenario].scenarioText} />
                    <AnswerList>
                        {options.map((option) => (
                            <Answer key={option.id} option={option} text={option.optionText} options={options} setOptions={setOptions}/>
                        ))}
                    </AnswerList>
                </div>
            <Buttons options={options} setOptions={setOptions} handleSubmit={handleSubmit}/>
            {submitted ?
                <Card>
                    <Card.Title>Right answer</Card.Title>
                    <Card.Text>Explanation for the right answer</Card.Text>
                </Card>
            : ''}
        </Card>
    )
}

export default GameView;
