import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Option from './Option';

function OptionList({option1, option2, option3, option4, optionUI, setOptionUI, submitted}) {
      
    return (
        <Row className='optionlist'>
            <Col><p className='instruction'>Select all the options you think are correct</p>
                <Row>
                    <Option id={1} text={option1} selected={optionUI[0].selected} feedback={optionUI[0].feedback} optionUI={optionUI} setOptionUI={setOptionUI} submitted={submitted}/>
                    <Option id={2} text={option2} selected={optionUI[1].selected} feedback={optionUI[1].feedback} optionUI={optionUI} setOptionUI={setOptionUI} submitted={submitted}/>
                </Row>
                <Row>
                    <Option id={3} text={option3} selected={optionUI[2].selected} feedback={optionUI[2].feedback} optionUI={optionUI} setOptionUI={setOptionUI} submitted={submitted}/>
                    <Option id={4} text={option4} selected={optionUI[3].selected} feedback={optionUI[3].feedback} optionUI={optionUI} setOptionUI={setOptionUI} submitted={submitted}/>
                </Row>
            </Col>
        </Row>
)
}

export default OptionList;