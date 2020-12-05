import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

function AnswerList(props) {
      
    return (
        <ListGroup className='answers'>
                    {props.children}
        </ListGroup>
)
}

export default AnswerList;