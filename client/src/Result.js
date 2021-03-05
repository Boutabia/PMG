import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function Result({score, total, refreshGame}) {
    return (
        <Container className='result'>
            <h1>Result</h1>
            <p>You scored {score} out of {total} points! </p>
            <Button className='btn-game' onClick={() => refreshGame()}>New game</Button>
        </Container>
    )
}

export default Result;