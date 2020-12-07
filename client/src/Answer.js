import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {FaCheck} from 'react-icons/fa'

function Answer({text, option, options, setOptions}) {

    function handleSelect() {
        setOptions(options.map((item) => {
            if (item.id === option.id) {
                return {
                    ...item, selected: !item.selected
                };
            }
            return item;
        }))
    }

    return (
        <div>
        {option.feedback===1 ?
            <ListGroup.Item type='checkbox' variant='correct'><FaCheck className='check'/>{text}</ListGroup.Item>
        : option.feedback===2 ?
            <ListGroup.Item type='checkbox' variant='incorrect'><FaCheck className='check'/>{text}</ListGroup.Item>
        : option.selected ?
            <ListGroup.Item type='checkbox' variant='selected' onClick={handleSelect}><FaCheck className='check'/>{text}</ListGroup.Item>
        : <ListGroup.Item type='checkbox' variant='answers' onClick={handleSelect}>{text}</ListGroup.Item>
        }
        </div>
    )
}

export default Answer;