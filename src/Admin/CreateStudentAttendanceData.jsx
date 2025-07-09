// FRONTEND/src/components/Admin/CreateStudentAttendanceData.jsx

//This compoentn lets admin intiate the test. Once the test is initated, user can..
//... fill up the test marks from frontend

// import React, {useState, useEffect} from 'react';
// import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

// import Select from 'react-select';
// import { createAttendanceRecords } from '../service/AttendanceMB.services';
// import { AxiosError } from 'axios';

// export const CreateStudentAttendanceData = () =>{


//     //Hooks

//     const [choosenDate, setChoosenDate] = useState(null)


// //Post cron-job-user-attendance

// const initiateStudentAttendance = async ()=>{
//     alert(choosenDate)

//     if (choosenDate === null){
//         alert('Select date')
//         return;
//     }

//     const reqBody = {
//         date: choosenDate
//     }

//     try {
//         const response = await createAttendanceRecords(reqBody);
//         alert(response.status)
//     } catch (error) {
//         console.log("Error initiating user attendance")
//     }
// }


//     return(
//         <Container fluid>
//             <h1>Initiate Student attendance</h1>
//             <label>Select Date For Creating Attendance Records</label>
//             <br/>
//             <input type='date' onSelect={(e)=>setChoosenDate(e.target.value)}/>
//             <br/>
//             <br/>
//             <Button onClick={initiateStudentAttendance}>Create User Attendance Instance</Button>
          

//         </Container>
//     )
// }









// import React, {useState, useEffect} from 'react';
// import { Container, Table, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

// import Select from 'react-select';
// import { createAttendanceRecords } from '../service/AttendanceMB.services';
// import { AxiosError } from 'axios';

// export const CreateStudentAttendanceData = () =>{

//     //Hooks

//     const [choosenDate, setChoosenDate] = useState(null)
//     const [loading, setLoading] = useState(false);


// //Post cron-job-user-attendance

// const initiateStudentAttendance = async ()=>{
//     alert(choosenDate)

//     if (choosenDate === null){
//         alert('Select date')
//         return;
//     }

//     const reqBody = {
//         date: choosenDate
//     }

//     try {
//         setLoading(true);
//         const response = await createAttendanceRecords(reqBody);
//         if (response.status === 200){
//             alert(response.status)
//         }
//     } catch (error) {
//         console.log("Error initiating user attendance")
//         alert("Some error occurred")
//     } finally {
//         setLoading(false);
//     }
// }


//     return(
//         <Container fluid>
//             <h1>Initiate Student attendance</h1>
//             <label>Select Date For Creating Attendance Records</label>
//             <br/>
//             <input type='date' onSelect={(e)=>setChoosenDate(e.target.value)}/>
//             <br/>
//             <br/>
//             <Button onClick={initiateStudentAttendance} disabled={loading}>
//                 {loading ? (
//                     <>
//                         <Spinner
//                             as="span"
//                             animation="border"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                         /> Creating...
//                     </>
//                 ) : (
//                     "Create User Attendance Instance"
//                 )}
//             </Button>
//         </Container>
//     )
// }














import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

import Select from 'react-select';
import { createAttendanceRecords } from '../service/AttendanceMB.services';
import { AxiosError } from 'axios';

export const CreateStudentAttendanceData = () =>{

    //Hooks

    const [choosenDate, setChoosenDate] = useState(null)
    const [loading, setLoading] = useState(false);


//Post cron-job-user-attendance

const initiateStudentAttendance = async ()=>{
    // alert(choosenDate)

    if (choosenDate === null){
        alert('Select date')
        return;
    }

    const reqBody = {
        date: choosenDate
    }

    try {
        setLoading(true);
        const response = await createAttendanceRecords(reqBody);
        if (response.status === 200){
            alert(response.status)
        }
    } catch (error) {
        console.log("Error initiating user attendance")
        alert("Some error occurred")
    } finally {
        setLoading(false);
    }
}


    return(
        <Container fluid>
            <h1>Initiate Student attendance</h1>
            <label>Select Date For Creating Attendance Records</label>
            <br/>
            <input type='date' onChange={(e)=>setChoosenDate(e.target.value)}/>
            <br/>
            <br/>
            {choosenDate && (
                <h1>Create attendance record for date: {choosenDate}</h1>
            )}
            <Button onClick={initiateStudentAttendance} disabled={loading}>
                {loading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> Creating...
                    </>
                ) : (
                    "Create User Attendance Instance"
                )}
            </Button>
        </Container>
    )
}
