// This is AttendanceSession1.jsx.

// This component marks the attendance of class 8th for MB

// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Alert, Breadcrumb  } from 'react-bootstrap';


import { getAllAttendance, updateAttendanceBySrnAndDate } from "../../service/AttendanceMB.services.js";
import { DistrictBlockSchoolById, ClassOfStudent  } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";


//importing context api (District Block School Context API)
import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../contextAPIs/DependentDropdowns.contextAPI";




const AttendanceMB = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

  

    //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
    
     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
     const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
     const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
  //______________________________________________________________________________________________

  //ClassContext API
  const {classContext, setClassContext} = useContext(ClassContext);

  //_____________________________________________________

  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

    //Hooks for managing query params for fetching attendance data.
    const [studentSrn, setStudentSrn] = useState("");
    const [firstName, setFirstName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [date, setDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [classofStudent, setClassOfStudent] = useState("");
    const [batch, setBatch] = useState("");
    const [status, setStatus] = useState("");





  // Track attendance state individually for each student using an object.
  const [attendanceState, setAttendanceState] = useState({});

  

  // useEffect(()=>{
  //   console.log(" I am districtblockcontext", districtContext, blockContext, schoolContext)
  //   console.log(Object(districtContext[0]).value)
  //   console.log(date)
  // }, [districtContext, blockContext, schoolContext, date])





  // Define query parameters for loading data on frontend
  const queryParams = {

    studentSrn:"",
    firstName:"",
    fatherName:"",
    date: date || new Date().toISOString().split("T")[0],
    startDate: date, // Example query param, 
    endDate: endDate || "",   // New query param for end date
    districtId: Object(districtContext[0]).value , 
    blockId:Object(blockContext[0]).value || "",
    schoolId:Object(schoolContext[0]).value || "",
    classofStudent:classContext.value,
    batch:"",
    status:"",
    // isAttendanceMarked:"",
    // isAttendanceUpdated:""
};


const fetchAttendance = async () => {

  if (districtContext.length > 0 && blockContext.length > 0 && schoolContext.length > 0 && classContext.value) {
   
      
    try {
      const response = await getAllAttendance(queryParams);
      setAttendanceData(response.data); // Assuming response has a `data` field
  
      // Initialize attendanceState based on the initial data from the API
      const initialAttendanceState = {};
      response.data.forEach((attendance) => {
        initialAttendanceState[attendance.studentSrn] = attendance.isAttendanceMarked; // Set initial attendance marked state
      });
      setAttendanceState(initialAttendanceState);
    } catch (error) {
      // setError("Error fetching attendance data");
      console.log("Error fetching attendance data");
    }
  } else (console.log("Please select all filters"))
  


  } 
  





  useEffect(() => {
    console.log(districtContext, blockContext, schoolContext)
    console.log("length of block", blockContext.length)
    // Call the service function when the component mounts

    fetchAttendance();
   
  }, [districtContext, blockContext, schoolContext, date, endDate, classContext]); // Empty dependency array to call once on component mount

//Below reset the value of drop downs if user selects different value
 useEffect(()=> {
  setBlockContext([])
  setSchoolContext([])
  setSchoolContext({})
  setAttendanceData([])


 }, [districtContext, ])


 useEffect(()=> {

  setAttendanceData([])

 }, [ classContext])




 useEffect(()=> {
  setSchoolContext([])

 }, [blockContext])

  
  const today = new Date().toISOString().split('T')[0];

  // Function to handle attendance update (marking attendance)
  const handleAttendanceUpdate = async (studentSrn, isMarked) => {

    const queryParamsForAttendance = {
        studentSrn: studentSrn,
        date: today, 
    
      };

  console.log(isMarked)
  console.log(`Student SRN: ${studentSrn}, Currently Marked: ${isMarked ? 'Present' : 'Absent'}`);
    // Define query parameters for updating attendance
    if(isMarked === true) { //if toggle is on then it is showing 'false' and if it is off then it shows 'true', so if it is true 
        //... then i am updating backend attendance to false/absent...
        console.log('marked absent')

        const isAttendanceMarked = {isAttendanceMarked: false}

        console.log(isAttendanceMarked)
        
        try {
            // Here, call your backend API to update attendance status
            // await updateAttendanceAPI(id, { isAttendanceMarked: !isMarked });
      
            // Update the local state to reflect the change in UI
            setAttendanceState((prevState) => ({
              ...prevState,
              [studentSrn]: !isMarked, // Toggle the attendance for the specific student
            }));
      
            const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked)
      
          } catch (error) {
            console.error("Error updating attendance", error.message);
          }


    } else {
        console.log('marked present')

        const isAttendanceMarked = {isAttendanceMarked: true}


        try {
            // Here, call your backend API to update attendance status
            // await updateAttendanceAPI(id, { isAttendanceMarked: !isMarked });
      
            // Update the local state to reflect the change in UI
            setAttendanceState((prevState) => ({
              ...prevState,
              [studentSrn]: !isMarked, // Toggle the attendance for the specific student
            }));
      
            const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked)
      
          } catch (error) {
            console.error("Error updating attendance", error.message);
          }
    }


   
  };

  return (
    <Container fluid className="prevent-overflow">
  <Form>
    <Row className="mb-3">
      <Col >
        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
      </Col>
      {/* <Col >
        <Form.Group controlId="endDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
      </Col> */}
    </Row>

    <Row>
      <Col>
        <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
      </Col>
    </Row>

    <Row>
      <Col>
        <ClassOfStudent />
      </Col>
    </Row>

    
  </Form>

  <hr />

  <h1>Student Attendance</h1>

  {error && <Alert variant="danger">{error}</Alert>}
<Row>
  <Table
    bordered
    hover
    responsive
    className="mt-4 text-center align-middle"
  >
    <thead>
      <tr>
        <th>SRN</th>
        <th>Father</th>
        <th>Student</th>
        
        {/* <th>District Id</th> */}
        {/* <th>Class</th> */}
        {/* <th>Batch</th> */}
        <th>TA</th>
        <th>Attendance Marked</th>
      </tr>
    </thead>
    <tbody>
      {attendanceData.length > 0 ? (
        attendanceData.map((attendance) => (
          <tr key={attendance._id}>
            <td>{attendance.studentSrn}</td>
            
            <td>{attendance.fatherName}</td>
            <td>{attendance.firstName}</td>
            {/* <td>{attendance.districtId}</td>
            <td>{attendance.classofStudent}</td>
            <td>{attendance.batch}</td> */}
            <td>{attendance.TA}</td>
            <td>
              {/* Toggle button for attendance */}
              <div className="toggle-container">
                <div
                  className={`toggle-button ${
                    attendanceState[attendance.studentSrn] ? 'on' : 'off'
                  }`}
                  onClick={() =>
                    handleAttendanceUpdate(
                      attendance.studentSrn,
                      attendanceState[attendance.studentSrn]
                    )
                  }
                >
                  <div
                    className={`circle ${
                      attendanceState[attendance.studentSrn]
                        ? 'move-right'
                        : 'move-left'
                    }`}
                  ></div>
                  <span
                    className={`toggle-text ${
                      attendanceState[attendance.studentSrn]
                        ? 'on-text'
                        : 'off-text'
                    }`}
                  >
                    {attendanceState[attendance.studentSrn]
                      ? 'Present'
                      : 'Absent'}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9">No attendance records found.</td>
        </tr>
      )}
    </tbody>
  </Table>
  </Row>
</Container>
  );
};

export default AttendanceMB;
