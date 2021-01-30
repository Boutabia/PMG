import React from 'react';
import Card from 'react-bootstrap/Card';
import OptionList from './OptionList';

function Scenario({title, text, picture, option1, option2, option3, option4, optionUI, setOptionUI, submitted}) {
    return (
        <Card className='scenario'>
            <Card.Body className='question'>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{text}</Card.Text>
            <Card.Img src={picture} fluid/>
            </Card.Body>
            <Card.Body className='optionlist'>
            <OptionList
                option1={option1}
                option2={option2}
                option3={option3}
                option4={option4}
                optionUI={optionUI}
                setOptionUI={setOptionUI}
                submitted={submitted}/>
            </Card.Body>
        </Card>
    )
}

export default Scenario;
