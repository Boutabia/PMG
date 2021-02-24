import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {FaCaretRight} from 'react-icons/fa';

function Buttons({handleSubmit, submitted, goForward, gameEnd, setShowResult, optionUI}) {
    
    return (
        <Row className='result-btn'>
            {gameEnd ?
                <Button variant='game' onClick={() => setShowResult(true)}>Show result</Button>
            :<Col>
                <Row className='ans-btn'>
                    <Button variant='game' onClick={handleSubmit} disabled={optionUI.every(item => !item.selected) || submitted}>Answer</Button>
                </Row>
                <Row className='next-btn'>
                    {submitted ?
                    <Button variant='game' onClick={goForward}>Next scenario <FaCaretRight/></Button>
                    : <Button variant='game' onClick={goForward}>Skip scenario</Button>
                    }
                </Row>
            </Col>
            }
        </Row>
    )
}

export default Buttons;
