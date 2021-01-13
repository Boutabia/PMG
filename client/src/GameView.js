import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Scenario from './Scenario';
import AnswerList from './AnswerList';
import Answer from './Answer';
import Buttons from './GameButtons';

function GameView(props) {
    const [currentScenario, setCurrentScenario] = useState(0);
    
    const [scenarios, setScenarios] = useState([{
        scenarioTitle:"Email Subject Fields",
        scenarioText:"You are managing eShop project and organising project plan inspection meeting. You are sending the project plan to client and other stakeholders. What is a good email subject field?"}])
        
    const [options, setOptions] = useState([
            {id:1, optionText:"Your project plan is ready!!!!", isCorrect:false, selected:false, feedback:0},
            {id:2, optionText:"eShop / Project plan inspection on 30.09.2020", isCorrect:true, selected:false, feedback:0},
            {id:3, optionText:"Project Plan is ready to be inspected", isCorrect:false, selected:false, feedback:0},
            {id:4, optionText:"eShop inspection on Friday", isCorrect:false, selected:false, feedback:0}
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
            <Buttons options={options} setOptions={setOptions} handleSubmit={handleSubmit} submitted={submitted}/>
            {submitted ?
                <Card className='explanation'>
                    <Card.Title>Right answer: eShop / Project plan inspection on 30.09.2020</Card.Title>
                    <Card.Text>Email subject field should include the name of the project, a concise subject and a date.</Card.Text>
                </Card>
            : ''}
        </Card>
    )
}

export default GameView;
