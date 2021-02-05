import React from 'react';
import Card from 'react-bootstrap/Card';
import DOMPurify from 'dompurify';


function Explanation({text}) {
    return (
        <Card className='explanation'>
            <Card.Title>Explanation</Card.Title>
            <Card.Text dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}}/>
        </Card>
    )
}

export default Explanation;