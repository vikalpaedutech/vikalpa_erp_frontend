//This is student.component.jsx. It is going to be a landing kind of page. 
//It Posts, update, deletes, patches, the student data. Basically for admin type of roles.

import React, {useEffect, useState} from "react";
import {Table, Row, Col, COntainer, Button} from "react-bootstrap";

//Importing service
import {getStudentIfisSlcTakenIsFalse} from "../../service/Student.service.js";


export const GetStudents = () => {

    //Defining state hooks to store data.
    const [studentData, setStudentData] = useState([]);

    
    const getStudents = async () => {
        try {
            const response = await getStudentIfisSlcTakenIsFalse();
            setStudentData(response.data);
            console.log(response.data)
        } catch (error) {
            console.log("Some error occured while calling getStudentIfisSlcTakenIsFalse api in backend student.controller.js", error.message)
        }

    }
    useEffect (()=> {
        getStudents();
    }, [])

    //Hndling handleEdit. When user cllicks on edit details button then it allows to update students details.

    function handleEdit (e) {
        console.log(e.target.id)
    


    }

    return  (
        <div className="Get-students">
          <h3>Student Information</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SRN</th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Mother Name</th>
                <th>Gender</th>
                <th>Category</th>
                <th>District</th>
                <th>Block</th>
                <th>School</th>
                <th>Edit Details</th>
                <th>Delete Students</th>
              </tr>
            </thead>
            <tbody>
              {studentData.map((eachStudent) => (
                <tr key={eachStudent.studentSrn}>
                  <td>{eachStudent.studentSrn}</td>
                  <td>{eachStudent.firstName} {eachStudent.lastName}</td>
                  <td>{eachStudent.fatherName}</td>
                  <td>{eachStudent.motherName}</td>
                  <td>{eachStudent.gender}</td>
                  <td>{eachStudent.category}</td>
                  <td>{eachStudent.districtId}</td>
                  <td>{eachStudent.blockId}</td>
                  <td>{eachStudent.schoolId}</td>
                  <td><Button id={eachStudent.studentSrn}
                    onClick={(e) => handleEdit(e)}
                  
                  >Edit Detials</Button></td>
                  <td><Button>Remove Students</Button></td>
                 
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    };