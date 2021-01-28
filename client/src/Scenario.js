import React from 'react';
import Card from 'react-bootstrap/Card';
import Question from './Question';
import OptionList from './OptionList';

function Scenario({title, text, option1, option2, option3, option4}) {
    return (
        <Card className="scenario">
            <Card.Title>{title}</Card.Title>
            <Question text={text}/>
            <OptionList
            option1={option1}
            option2={option2}
            option3={option3}
            option4={option4}/>
        </Card>
    )
}

export default Scenario;
