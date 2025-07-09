// // FRONTEND/src/components/Admin/CreateEmpAttendanceData.jsx

// //This compoentn lets admin intiate the test. Once the test is initated, user can..
// //... fill up the test marks from frontend

// import React, {useState, useEffect} from 'react';
// import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';

// import Select from 'react-select';
// import { cronJobUserAttendance } from '../service/userAttendance.services';

// export const CreateEmpAttendanceData = () =>{


//     //Hooks
//     const [choosenDate, setChoosenDate] = useState(null)


// //Post cron-job-user-attendance

// const initiateUserAttendance = async ()=>{

//     try {
//         const response = await cronJobUserAttendance();
//     } catch (error) {
//         console.log("Error initiating user attendance")
//     }
// }


//     return(
//         <Container fluid>
            
//             <h1>Initiate user attendance</h1>
//              <label>Select Date For Creating Attendance Records</label>
//             <br/>
//             <input type='date' onChange={(e)=>setChoosenDate(e.target.value)}/>
//             <br/>
//             <br/>

//             <Button onClick={initiateUserAttendance}>Create User Attendance Instance</Button>
          

//         </Container>
//     )
// }














// FRONTEND/src/components/Admin/CreateEmpAttendanceData.jsx

//This compoentn lets admin intiate the test. Once the test is initated, user can..
//... fill up the test marks from frontend

import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button, Spinner } from 'react-bootstrap';

import Select from 'react-select';
import { cronJobUserAttendance } from '../service/userAttendance.services';

export const CreateEmpAttendanceData = () =>{

    //Hooks
    const [choosenDate, setChoosenDate] = useState(null)
    const [loading, setLoading] = useState(false);


//Post cron-job-user-attendance

const initiateUserAttendance = async ()=>{


    if (choosenDate === null){
        alert('Select date')
        return;
    }

    const reqBody = {
        date: choosenDate
    }

    try {
        setLoading(true);
        const response = await cronJobUserAttendance(reqBody);
        if (response.status === 200){
            // alert(response.status)

            alert('Attendance Created!')
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
            
            <h1>Initiate user attendance</h1>
             <label>Select Date For Creating Attendance Records</label>
            <br/>
            <input type='date' onChange={(e)=>setChoosenDate(e.target.value)}/>
            <br/>
            <br/>

            <Button onClick={initiateUserAttendance} disabled={loading}>
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
