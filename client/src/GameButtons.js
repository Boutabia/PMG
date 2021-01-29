import React from 'react';
import Button from 'react-bootstrap/Button';
import {FaCaretRight} from 'react-icons/fa';

function Buttons({handleSubmit, submitted, goForward, gameEnd, setShowResult, optionUI, selected}) {
    
    return(
        <div>
            <Button variant='game' onClick={handleSubmit} disabled={optionUI.every(item => !item.selected)}>Answer</Button>
            {gameEnd ?
            <Button variant='game' onClick={() => setShowResult(true)}>Show result</Button>
            :
            submitted ?
            <Button variant='game' onClick={goForward}>Next question <FaCaretRight/></Button>
            : <Button variant='game' onClick={goForward}>Skip question</Button>
            }
        </div>
    )
}

export default Buttons;
