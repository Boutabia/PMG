import React from 'react';
import Card from 'react-bootstrap/Card';

function Question({text}) {
    return (
        <Card className="question">
            <Card.Text>{text}</Card.Text>
        </Card>
    )
}

export default Question;