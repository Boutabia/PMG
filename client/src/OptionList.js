import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Option from './Option';

function OptionList({option1, option2, option3, option4}) {
      
    return (
        <ListGroup className='options'>
                <Option text={option1}/>
                <Option text={option2}/>
                <Option text={option3}/>
                <Option text={option4}/>
        </ListGroup>
)
}

export default OptionList;