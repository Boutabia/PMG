import React from 'react';
import Card from 'react-bootstrap/Card';

function Scenario({title, text}) {
    return (
        <Card className="scenario">
            <Card.Title>{title}</Card.Title>
            <Card.Text>{text}</Card.Text>
        </Card>
    )
}

export default Scenario;
