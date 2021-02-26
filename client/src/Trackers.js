import React from 'react';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';

function Trackers({index, length, score}) {
    return (
        <Row className='trackers'>
                <Badge variant='info'>{`Scenario ${index+1} / ${length}`}</Badge>
                <Badge variant='info'>Score: {score}</Badge>
        </Row>
    )
}

export default Trackers;