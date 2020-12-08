import React from 'react';
import Button from 'react-bootstrap/Button';

function Buttons({handleSubmit, options, setOptions}) {
    
    return(
        <div>
            <Button disabled={options.every(option => (!option.selected))} variant='submit' onClick={handleSubmit}>Answer</Button>
            <Button variant='skip'>Skip question</Button>
        </div>
    )
}

export default Buttons;
