import React from 'react';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';

function Trackers({index, length, score}) {
    return (
        <Row className='trackers'>
                <ProgressBar label={`Scenario ${index+1} / ${length}`} now={index+1} max={length} className='progress' variant='info'/>
                <Badge variant='info'>Score: {score}</Badge>
        </Row>
    )
}

export default Trackers;