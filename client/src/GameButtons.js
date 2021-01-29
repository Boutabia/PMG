import React from 'react';
import Button from 'react-bootstrap/Button';
import {FaCaretRight} from 'react-icons/fa';

function Buttons({handleSubmit, submitted, goForward}) {
    
    return(
        <div>
            <Button variant='game' onClick={handleSubmit}>Answer</Button>
            {submitted ?
            <Button variant='game' onClick={goForward}>Next question <FaCaretRight/></Button>
            : <Button variant='game' onClick={goForward}>Skip question</Button>
            }
        </div>
    )
}

export default Buttons;
