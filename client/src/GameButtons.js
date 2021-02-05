import React from 'react';
import Button from 'react-bootstrap/Button';
import {FaCaretRight} from 'react-icons/fa';

function Buttons({handleSubmit, submitted, goForward, gameEnd, setShowResult, optionUI}) {
    
    return (
        <div>
            {gameEnd ?
                <Button variant='game' onClick={() => setShowResult(true)}>Show result</Button>
            :<div>
                <Button variant='game' onClick={handleSubmit} disabled={optionUI.every(item => !item.selected) || submitted}>Answer</Button>
                {submitted ?
                <Button variant='game' onClick={goForward}>Next scenario <FaCaretRight/></Button>
                : <Button variant='game' onClick={goForward}>Skip scenario</Button>
                }
            </div>
            }
        </div>
    )
}

export default Buttons;
