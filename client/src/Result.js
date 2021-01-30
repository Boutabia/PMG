import React from 'react';
import Card from 'react-bootstrap/Card';

function Result({score, total}) {
    return (
        <Card className='result'>
            <Card.Body>
            <Card.Title>Result</Card.Title>
            <Card.Text>You scored {score} out of {total} points! </Card.Text>
            </Card.Body>

        </Card>
    )
}

export default Result;