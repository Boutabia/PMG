import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function Answers(props) {
        
        return (
            <ListGroup className='answers'>
                    <ListGroup.Item variant='answers'>{props.optionA}</ListGroup.Item>
                    <ListGroup.Item variant='answers'>{props.optionB}</ListGroup.Item>
                    <ListGroup.Item variant='answers'>{props.optionC}</ListGroup.Item>
                    <ListGroup.Item variant='answers'>{props.optionD}</ListGroup.Item>
            </ListGroup>
    )
}

export default Answers;