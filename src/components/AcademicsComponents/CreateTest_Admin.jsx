// FRONTEND/src/components/AcademicsComponents/CreateTest_Admin.jsx

//This compoentn lets admin intiate the test. Once the test is initated, user can..
//... fill up the test marks from frontend

import React, {useState, useEffect} from 'react';
import { Container, Table, Row, Col, Form, Button } from 'react-bootstrap';
import { createMarksRecordCron } from '../../service/ExamAndTestController';
import { GetTests } from '../../service/ExamAndTestController';
import Select from 'react-select';

export const CreateTest_Admin = () =>{

//Hooks

const [getTest, setGetTest] =useState([])
const [examId, setExamId] = useState("")
const [filteredExamId, setFilteredExamId] = useState(null);

//-------------------------------------

    const fetchTest = async () =>{

        try {
            const response = await GetTests();
            console.log(response.data.data);
            setGetTest(response.data.data)

            
        } catch (error) {
            console.log("Error fetching test data", error.message)
        }
    }

    useEffect(()=> {
        fetchTest()

    }, [])

useEffect(() => {
    if (examId?.value) {
        const filteredTest = getTest.find(item => item.examId === examId.value);
        setFilteredExamId(filteredTest);
        console.log("Filtered Test:", filteredTest);
    }
}, [examId]);


//Api to post data in db

const postTestData = async () => {

    const formData = {
        examId: examId.value,
        classofStudent: filteredExamId.classofStudent,
        medium: filteredExamId.examBoard
    }

    try {
        const response = await createMarksRecordCron(formData)
       
       
    } catch (error) {
        console.log('inside')
        console.log("Error occured while intiating test data", error.message)
        alert('Test is already created with this exam id')
    }
}


    return(
        <Container>

            <Form>
      
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Test Id</Form.Label>
            <Select
           options= 
            {getTest.length > 0 ? getTest.map((eachTest)=>{
                
             return (
                {value: eachTest.examId, label: eachTest.examId}
                )
                
               
            }):(null)}
           value={examId}
           onChange={setExamId}
            />
      </Form.Group>
    </Form>

<Button onClick={postTestData}>Initate Test Data</Button>

        </Container>
    )
}