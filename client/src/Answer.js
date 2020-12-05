import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

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
        <ListGroup.Item  type='button' variant={option.feedback===1 ? 'correct' : option.feedback===2 ? 'incorrect' : option.selected ? 'selected' : 'answers'} onClick={handleSelect}>{text}</ListGroup.Item>
    )
}

export default Answer;