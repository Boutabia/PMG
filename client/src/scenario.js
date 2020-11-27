import React from 'react';
import Card from 'react-bootstrap/Card';

function Scenario(props) {
    return (
        <Card className="scenario">
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.text}</Card.Text>
        </Card>
    )
}

export default Scenario;