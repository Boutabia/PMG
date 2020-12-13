import React from 'react'
import Button from 'react-bootstrap/Button'
import {FaCaretRight} from 'react-icons/fa'

function Buttons({handleSubmit, options, setOptions, submitted}) {
    
    return(
        <div>
            <Button disabled={options.every(option => (!option.selected))} variant='game' onClick={handleSubmit}>Answer</Button>
            {submitted ?
            <Button variant='game'>Next question <FaCaretRight/></Button>
            : <Button variant='game'>Skip question</Button>
            }
        </div>
    )
}

export default Buttons;
