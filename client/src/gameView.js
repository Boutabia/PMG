import React from 'react';
import Card from 'react-bootstrap/Card';
import Scenario from './scenario';
import Answers from './answerOptions';
import Buttons from './gameButtons';

function GameView(props) {
    return (
        <Card className='game-view' bg='gameview'>
            <Scenario
            title='Scenario title'
            text='Curabitur placerat lacus massa, ac congue neque aliquet nec. Morbi id dui tincidunt urna pulvinar vulputate id mollis ante?'
            />
            <Answers
                optionA='A. Donec sagittis tortor at massa fringilla efficitur.' 
                optionB='B. Aenean consectetur sit amet nunc eu ultrices.' 
                optionC='C. Fusce auctor bibendum dui quis tincidunt.' 
                optionD='D. Mauris vitae metus scelerisque, tincidunt velit vel, bibendum leo.'
            />
            <Buttons/>
        </Card>
    )
}

export default GameView;