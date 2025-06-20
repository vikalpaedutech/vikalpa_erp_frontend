// FRONTEND/src/components/Admin/CreateEmpAttendanceData.jsx

//This compoentn lets admin intiate the test. Once the test is initated, user can..
//... fill up the test marks from frontend

import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

import Select from 'react-select';
import { cronJobUserAttendance } from '../service/userAttendance.services';

export const CreateEmpAttendanceData = () =>{


//Post cron-job-user-attendance

const initiateUserAttendance = async ()=>{

    try {
        const response = await cronJobUserAttendance();
    } catch (error) {
        console.log("Error initiating user attendance")
    }
}


    return(
        <Container fluid>
            sdljkfjhjsdlfkh
            <h1>Initiate user attendance</h1>

            <Button onClick={initiateUserAttendance}>Create User Attendance Instance</Button>
          

        </Container>
    )
}