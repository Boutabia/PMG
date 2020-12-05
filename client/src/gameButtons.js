import React from 'react';
import Button from 'react-bootstrap/Button';

function Buttons({handleSubmit, options, setOptions}) {
    
    return(
        <Button variant='submit' onClick={handleSubmit}>Answer</Button>
    )
}

export default Buttons;