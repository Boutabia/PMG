import React from 'react';
import Container from 'react-bootstrap/Container';

function Result({score, total}) {
    return (
        <Container className='result'>
            <h1>Result</h1>
            <p>You scored {score} out of {total} points! </p>
        </Container>
    )
}

export default Result;