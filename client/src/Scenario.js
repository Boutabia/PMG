import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DOMPurify from 'dompurify';

function Scenario({title, text, picture}) {
    return (
        <Row className='scenario'>
            <Col><h4>{title}</h4>
                <Row><Col>{picture !== '' ? <img src={`http://localhost:3001/${picture}`} className='img'/> : ''}</Col></Row>
                <Row><Col><p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}}/></Col></Row>
            </Col>
        </Row>
    )
}

export default Scenario;
