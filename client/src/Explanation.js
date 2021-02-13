import React from 'react';
import Col from 'react-bootstrap/Col';
import DOMPurify from 'dompurify';


function Explanation({text}) {
    return (
        <Col className='explanation'>
            <h5>Explanation</h5>
            <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}}/>
        </Col>
    )
}

export default Explanation;