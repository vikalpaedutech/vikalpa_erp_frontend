import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import {
  getAllMarksUsinQueryParams,
  updateMarksBySrnAndExamId,
} from "../../service/Marks.services.js";

import {
  DistrictBlockSchoolById,
  ClassOfStudent,
} from "../DependentDropDowns/DistrictBlockSchool.component.jsx";
//importing context api (District Block School Context API)
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";

import { UserContext } from "../../components/contextAPIs/User.context.js";
import Select from "react-select"
import { GetTests } from '../../service/ExamAndTestController';

export const UploadMarks = () => {
  //using userContext
  const { userData, setUserData } = useContext(UserContext);
  //___________________________________________________

  
      //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
      
       const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
       const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
       const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
    //______________________________________________________________________________________________

    //using ClassContext api

    const {classContext, setClassContext} = useContext(ClassContext)

    //______________________________________________________
  
  

  const [marksData, setMarksData] = useState([]);



//Fetchin examId data
const [getTest, setGetTest] =useState([])
const [examId, setExamId] = useState("")
 
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

//--------------------------------------


  //Below query params filters the data and show it on frontend from backend
  const queryParams = {
    studentSrn: "",
    firstName: "",
    fatherName: "",
    districtId: Object(districtContext[0]).value || "",
    blockId: Object(blockContext[0]).value || "",
    schoolId: Object(schoolContext[0]).value || "",
    classofStudent: classContext.value || "",
    examId: examId.value,
    marksObtained: "",
    recordedBy: "",
    remark: "",
    marksUpdatedOn: "",
  };

  const fetchMarksData = async () => {
    if (districtContext.length>0 && blockContext.length>0 && schoolContext.length>0 && classContext.value) {

        console.log("i am class of student ", classContext.value)
        try {
            const response = await getAllMarksUsinQueryParams(queryParams);
            setMarksData(response.data);
            console.log(response.data);
          } catch (error) {
            console.log("Error fetching marks data", error.message);
            setMarksData([])
          }
    } else (console.log("Please select all filters"))
   
  };

  useEffect(() => {
    fetchMarksData();
  }, [districtContext, blockContext, schoolContext, classContext, examId]);

  //Clearing drop down values if user selects different value.

  useEffect(() => {
    setBlockContext([]);
    setSchoolContext([])
    setClassContext("")
    setMarksData([])
    
  }, [districtContext, ])

  const handleMarksChange = async (e, student) => {
    const inputValue = e.target.value;
    const cleanedInput = inputValue.trim();

    // Allow only valid inputs
    const isAbsent = /^absent$/i.test(cleanedInput);
    const isA = /^a$/i.test(cleanedInput);
    const isValidNumber = /^(\d{1,3})(\.\d{1,2})?$/.test(cleanedInput);

    if (!isAbsent && !isA && !isValidNumber && cleanedInput !== "") {
      // Invalid input: ignore
      return;
    }

    // Avoid unnecessary updates
    if (student.marksObtained?.toString() === cleanedInput) {
      return;
    }

    try {
      const payload = {
        marksObtained: cleanedInput,
        recordedBy: userData?.[0]?.userId ?? "Admin", // or dynamically from user
        marksUpdatedOn: new Date().toISOString(),
      };

      const query = {
        studentSrn: student.studentSrn,
        examId: student.examId,
      };

      await updateMarksBySrnAndExamId(query, payload);

      // Update local state for immediate UI feedback
      setMarksData((prevData) =>
        prevData.map((item) =>
          item._id === student._id
            ? { ...item, marksObtained: cleanedInput }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating marks:", error.message);
    }
  };

  //Passing props to DistrictBlockSchoolById component for filtering for logged in users.
  const assignedDistricts = userData[0].assignedDistricts;
  console.log("i am user distrit", assignedDistricts);

  //____________________________________________________________________________


  //Sorting the marks data  
marksData.sort((a, b)=>a.firstName.localeCompare(b.firstName))

  return (
    <Row className="justify-content-center">
  <Col xs={12}>
    <Container fluid className="prevent-overflow">
      <h1>Apply Filter</h1>

      <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
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
    
      <ClassOfStudent />

      <hr></hr>
      <h2>Upload Marks</h2>

      {marksData.length > 0 ? (
        <Table responsive bordered cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Student SRN</th>
              
              <th>Father's Name</th>
              <th>First Name</th>
              {/* <th>District ID</th>
              <th>Block ID</th>
              <th>School ID</th> */}
              {/* <th>Class</th> */}
              {/* <th>Exam ID</th> */}
              {/* <th>Marks Obtained</th> */}
              {/* <th>Recorded By</th> */}
              {/* <th>Remark</th> */}
              {/* <th>Marks Updated On</th> */}
              <th>Obtained Marks</th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.studentSrn}</td>
                
                <td>{student.fatherName}</td>
                <td>{student.firstName}</td>
                {/* <td>{student.districtId}</td>
                <td>{student.blockId}</td>
                <td>{student.schoolId}</td> */}
                {/* <td>{student.classofStudent}</td>
                <td>{student.examId}</td>
                <td>{student.marksObtained ?? "N/A"}</td>
                <td>{student.recordedBy || "N/A"}</td>
                <td>{student.remark || "N/A"}</td> */}
                {/* <td>
                  {student.marksUpdatedOn
                    ? new Date(student.marksUpdatedOn).toLocaleString()
                    : "N/A"}
                </td> */}
                <td>
                  <input
                    type="text"
                    placeholder="Obtained Marks"
                    defaultValue={student.marksObtained ?? ""}
                    onChange={(e) => handleMarksChange(e, student)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Please filter your data and start updating marks.</p>
      )}
    </Container>
  </Col>
</Row>
  );
};
