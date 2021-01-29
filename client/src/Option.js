import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import {FaRegCircle} from 'react-icons/fa';
import {FaCheckCircle} from 'react-icons/fa';

function Option({id, text, selected, feedback, optionUI, setOptionUI}) {

    function handleSelect() {
        setOptionUI(optionUI.map((item) => {
            if (item.id === id) {
                return {
                    ...item, selected: !item.selected
                };
            }
            return item;
        }))
    }

    return (
       <div>
        {feedback===1 ?
            <ListGroup.Item id={id} type='button' variant='correct'><FaCheckCircle className='check'/>{text}</ListGroup.Item>
        : feedback===-1 ?
            <ListGroup.Item id={id} type='button' variant='incorrect'><FaCheckCircle className='check'/>{text}</ListGroup.Item>
        : selected ?
            <ListGroup.Item id={id} type='button' variant='selected' onClick={handleSelect}><FaCheckCircle className='check'/>{text}</ListGroup.Item>
        :   <ListGroup.Item id={id} type='button' variant='options' onClick={handleSelect}><FaRegCircle className='check'/>{text}</ListGroup.Item>
        }
        </div>
    )
}

export default Option;