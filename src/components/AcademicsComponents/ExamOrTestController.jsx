// /FRONTEND/src/components/AcademiComponents/ExamOrTestController.jsx

import React, { useState, useEffect } from 'react';
import { Table, Col, Row, Container, Form, Dropdown, Button } from "react-bootstrap";
import Select from "react-select"
import { createPost } from '../../service/ExamAndTestController';

export const TestController = () => {

    //HOOKS

    const [examId, setExamId] = useState("");
    const [examType, setExamType] = useState(null);
    const [board, setBoard] = useState(null);
    const [subject, setSubject] = useState(null);
    const [examDate, setExamDate] = useState("");
    const [description, setDescription] = useState("");
    const [maxMarks, setMaxMarks] = useState("");
    const [passingMarks, setPassingMarks] = useState("");
    const [batch, setBatch] = useState(null);
    const [classValue, setClassValue] = useState(null);

    //------------------




//Posting data to backend. Creating exam



const postData = async () => {
   

    const formData = {
        examId: subject.value + "-" + board.value + "-" + classValue.value + "-" + "(" + examType.value + ")" + "-" + "(" + examDate + ")",
        examType: examType.value,
        examBoard: board.value,
        subject: subject.value,
        examDate: examDate,
        description: description,
        maxMarks: maxMarks,
        passingMarks: passingMarks,
        batch: batch.value,
        classofStudent: classValue.value
    }

    try {
        const response = await createPost(formData)


        setExamId("")
        setExamType("")
        setBoard("")
        setSubject("")
        setExamDate("")
        setDescription("")
        setMaxMarks("")
        setPassingMarks("")
        setBatch("")
        setClassValue("")

        alert("Test Created")
        
    } catch (error) {

        console.log("Error occured while creating data", error.message)
        
    }

}


    return (
        <Container fluid>
            <h1>Create Test</h1>
            <hr />
            <Form>
                {/* <Form.Group className="mb-3" controlId="exam-id">
                    <Form.Label>Exam Id</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="test-id" 
                        value={examId}
                        onChange={(e) => setExamId(e.target.value)}
                    />
                </Form.Group> */}

                <Form.Group className="mb-3" controlId="exam-type">
                    <Form.Label>Exam Type</Form.Label>

                    <Select
                        options={[
                            { value: "Class Test", label: "Class Test" },
                            { value: "Subjective Test", label: "Subjective Test" },
                            { value: "Objective Test", label: "Objective Test" },
                            { value: "Half Yearly", label: "Half Yearly" },
                            { value: "A.M.E", label: "A.M.E" },
                            { value: "Board", label: "Board" },
                        ]}
                        value={examType}
                        onChange={setExamType}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Board</Form.Label>
                    <Select
                        options={[
                            { value: "HBSE", label: "HBSE" },
                            { value: "CBSE", label: "CBSE" },
                            { value: "CBSE_HBSE", label: "CBSE_HBSE" },
                        ]}
                        value={board}
                        onChange={setBoard}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Subject</Form.Label>
                    <Select
                        options={[
                            { value: "Hindi", label: "Hindi" },
                            { value: "English", label: "English" },
                            { value: "Maths", label: "Maths" },
                            { value: "Science", label: "Science" },
                            { value: "Physics", label: "Physics" },
                            { value: "Chemistry", label: "Chemistry" },
                            { value: "Bio", label: "Bio" },
                            { value: "Politics", label: "Politcs" },
                            { value: "History", label: "History" },
                            { value: "Geography", label: "Geography" },
                            { value: "Optional", label: "Optional" },
                        ]}
                        value={subject}
                        onChange={setSubject}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Exam Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        placeholder="date" 
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Exam Description (optional)</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Maximum Marks</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Maximum Marks" 
                        value={maxMarks}
                        onChange={(e) => setMaxMarks(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Passing Marks (Optional)</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Passing Marks" 
                        value={passingMarks}
                        onChange={(e) => setPassingMarks(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Batch</Form.Label>
                    <Select
                        options={[
                            { value: "2024-26", label: "2024-26" },
                            { value: "2025-27", label: "2025-27" }
                        ]}
                        value={batch}
                        onChange={setBatch}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Class</Form.Label>
                    <Select
                        options={[
                            { value: "9", label: "9" },
                            { value: "10", label: "10" }
                        ]}
                        value={classValue}
                        onChange={setClassValue}
                    />
                </Form.Group>

                <Button onClick={postData}>Create Test</Button>
            </Form>
        </Container>
    )
}
