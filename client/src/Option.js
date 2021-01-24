import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {FaRegCircle} from 'react-icons/fa'
import {FaCheckCircle} from 'react-icons/fa'

function Option({text}) {

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
            <ListGroup.Item type='checkbox' variant='correct'><FaCheckCircle className='check'/>{text}</ListGroup.Item>
        : option.feedback===2 ?
            <ListGroup.Item type='checkbox' variant='incorrect'><FaCheckCircle className='check'/>{text}</ListGroup.Item>
        : option.selected ?
            <ListGroup.Item type='checkbox' variant='selected' onClick={handleSelect}><FaCheckCircle className='check'/>{text}</ListGroup.Item>
        : <ListGroup.Item type='checkbox' variant='options' onClick={handleSelect}><FaRegCircle className='check'/>{text}</ListGroup.Item>
        }
        </div>
    )
}

export default Option;