import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import {FaRegCircle} from 'react-icons/fa';
import {FaCheckCircle} from 'react-icons/fa';

function Option({id, text, selected, feedback, optionUI, setOptionUI, submitted}) {

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
       <Col>
        {feedback===1 ?
            <Button id={id} variant='correct'><FaCheckCircle className='check'/>{text}</Button>
        : feedback===-2 ?
            <Button id={id} variant='incorrect'><FaCheckCircle className='check'/>{text}</Button>
        : selected ?
            <Button id={id} variant='selected' onClick={handleSelect} disabled={submitted}><FaCheckCircle className='check'/>{text}</Button>
        :   <Button id={id} variant='options' onClick={handleSelect} disabled={submitted}><FaRegCircle className='check'/>{text}</Button>
        }
        </Col>
    )
}

export default Option;