// FRONTEND/src/components/Admin/CreateUploadAttendancePdf.jsx

//This compoentn lets admin intiate the Upload Pdf. Once the upload pdf is initated, user can..
//... upload attendance pdf  from frontend

import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

import Select from 'react-select';

import { createAttendancePdfCronJob } from '../service/AttendancePdf.services';

export const CreateUploadAttendancePdf = () =>{


//Post cron-job-user-attendance

const initiateUploadAttendancePdf = async ()=>{

    try {
        const response = await createAttendancePdfCronJob();
    } catch (error) {
        console.log("Error initiating Upload-attendance-pdf")
    }
}


    return(
        <Container fluid>
            <h1>Initiate Upload-attendance-pdf data</h1>

            <Button onClick={initiateUploadAttendancePdf}>Click to create Upload-Attendance-Pdf Instance</Button>
          

        </Container>
    )
}