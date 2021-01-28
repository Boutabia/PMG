import React from 'react';
import Card from 'react-bootstrap/Card';

function Explanation({text}) {
    return (
        <Card className='explanation'>
            <Card.Title>Explanation</Card.Title>
            <Card.Text>{text}</Card.Text>
        </Card>
    )
}

export default Explanation;