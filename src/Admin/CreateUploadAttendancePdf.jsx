// // FRONTEND/src/components/Admin/CreateUploadAttendancePdf.jsx

// //This compoentn lets admin intiate the Upload Pdf. Once the upload pdf is initated, user can..
// //... upload attendance pdf  from frontend

// import React, {useState, useEffect} from 'react';
// import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

// import Select from 'react-select';

// import { createAttendancePdfCronJob } from '../service/AttendancePdf.services';

// export const CreateUploadAttendancePdf = () =>{


// //Post cron-job-user-attendance

// const initiateUploadAttendancePdf = async ()=>{

//     try {
//         const response = await createAttendancePdfCronJob();
//     } catch (error) {
//         console.log("Error initiating Upload-attendance-pdf")
//     }
// }


//     return(
//         <Container fluid>
//             <h1>Initiate Upload-attendance-pdf data</h1>

//             <Button onClick={initiateUploadAttendancePdf}>Click to create Upload-Attendance-Pdf Instance</Button>
          

//         </Container>
//     )
// }















// FRONTEND/src/components/Admin/CreateUploadAttendancePdf.jsx

//This compoentn lets admin intiate the Upload Pdf. Once the upload pdf is initated, user can..
//... upload attendance pdf  from frontend

import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

import Select from 'react-select';

import { createAttendancePdfCronJob } from '../service/AttendancePdf.services';

export const CreateUploadAttendancePdf = () =>{

    //Hooks
    const [choosenDate, setChoosenDate] = useState(null)
    const [loading, setLoading] = useState(false);


//Post cron-job-user-attendance

const initiateUploadAttendancePdf = async ()=>{

    if (choosenDate === null){
        alert('Select date')
        return;
    }

    const reqBody = {
        date: choosenDate
    }

    try {
        setLoading(true);
        const response = await createAttendancePdfCronJob(reqBody);
        if (response.status === 200){
            // alert(response.status)

            alert('Attendance pdf Created!')
        }
    } catch (error) {
        console.log("Error initiating Upload-attendance-pdf")
        alert("Some error occurred")
    } finally {
        setLoading(false);
    }
}


    return(
        <Container fluid>
            <h1>Initiate Upload-attendance-pdf data</h1>
            <label>Select Date For Creating Attendance Records</label>
            <br/>
            <input type='date' onChange={(e)=>setChoosenDate(e.target.value)}/>
            <br/>
            <br/>

            <Button onClick={initiateUploadAttendancePdf} disabled={loading}>
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
                    "Click to create Upload-Attendance-Pdf Instance"
                )}
            </Button>
        </Container>
    )
}
