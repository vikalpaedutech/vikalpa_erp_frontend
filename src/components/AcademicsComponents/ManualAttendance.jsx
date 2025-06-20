// /FRONTEND/src/components/AcademicsComponents/ManualAttendance.jsx


import React from "react";
import { Container, Row, Col, Table, Form, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";



export const ManualAttendance = () => {



    return (

        <Container fluid>
            <div  style={{display:'flex', gap:'.5rem', flexDirection:'column', marginTop:'1.5rem'}}>
            <Card style={{ width: '18rem' }}>
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <Card.Body>
        <Card.Title>Manual Attendance Format</Card.Title>
        <Card.Text>
          Click On Below button to download manual attendance format.
        </Card.Text>
        <Link to={'/attendance-pdf-format'}><Button variant="primary">Go To Download</Button></Link>
      </Card.Body>
    </Card>


    <Card style={{ width: '18rem' }}>
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <Card.Body>
        <Card.Title>Upload Manual Attendance</Card.Title>
        <Card.Text>
          Click On Below button to upload manual attendance format.
        </Card.Text>
        <Link to={'/upload-attendance-pdf'}><Button variant="primary">Go To Upload</Button></Link>
      </Card.Body>
    </Card>
    </div>

        </Container>
        
    )

}