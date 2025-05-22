// FRONTEND/src/components/Admin/CreateStudentAttendanceData.jsx

//This compoentn lets admin intiate the test. Once the test is initated, user can..
//... fill up the test marks from frontend

import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

import Select from 'react-select';
import { createAttendanceRecords } from '../service/AttendanceMB.services';

export const CreateStudentAttendanceData = () =>{


//Post cron-job-user-attendance

const initiateStudentAttendance = async ()=>{

    try {
        const response = await createAttendanceRecords();
    } catch (error) {
        console.log("Error initiating user attendance")
    }
}


    return(
        <Container fluid>
            <h1>Initiate Student attendance</h1>

            <Button onClick={initiateStudentAttendance}>Create User Attendance Instance</Button>
          

        </Container>
    )
}