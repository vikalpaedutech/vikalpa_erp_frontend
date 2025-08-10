// // This is AttendanceSession1.jsx.

// // This component marks the attendance of class 8th for MB

// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb  } from 'react-bootstrap';


// import { getAllAttendance, updateAttendanceBySrnAndDate } from "../service/AttendanceMB.services.js";
// import { DistrictBlockSchoolById, ClassOfStudent  } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";


// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

// import Select from 'react-select'
// import { formToJSON } from "axios";
// import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
// import { UserContext } from "../components/contextAPIs/User.context.js";

// export const AbsenteeCalling = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

//     //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
    
//      const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//      const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
//      const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
//   //______________________________________________________________________________________________

//   //ClassContext API
//   const {classContext, setClassContext} = useContext(ClassContext);
//   const {userData, setUserData} = useContext(UserContext);

//   //_____________________________________________________

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [error, setError] = useState(null);

//     //Hooks for managing query params for fetching attendance data.
//     const [studentSrn, setStudentSrn] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [fatherName, setFatherName] = useState("");
//     const [date, setDate] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [classofStudent, setClassOfStudent] = useState("");
//     const [batch, setBatch] = useState("");
//     const [status, setStatus] = useState("");

//     const [absenteeCallingStatus, setAbsenteeCallingStatus] = useState({});
//     const [callingRemark1, setCallingRemark1] = useState({});
//     const [remark1, setRemark1] = useState({}); // NEW STATE FOR REMARK OPTIONS

//   // Track attendance state individually for each student using an object.
//   const [attendanceState, setAttendanceState] = useState({});

//   useEffect(()=>{
//     setDate(new Date().toISOString().split("T")[0])
//   }, [])

//   const queryParams = {
//     studentSrn:"",
//     firstName:"",
//     fatherName:"",
//     date: date ,
//     status: "Absent",
//     startDate: date,
//     endDate: endDate || "",
//     // districtId: Object(districtContext[0]).value  , 
//     // blockId:Object(blockContext[0]).value || "",
//     schoolId:Object(schoolContext[0]).value || userData[0].assignedSchools,
//     classofStudent:classContext.value || ['9', '10'],
//     batch:"",
//   };

//   const fetchAttendance = async () => {
//     console.log(queryParams)
//     if (true) {
//       try {
//         const response = await getAllAttendance(queryParams);
//         setAttendanceData(response.data);
//         console.log("I am inside attendance mb")
//         console.log(response.data)
//         const initialAttendanceState = {};
//         const initialAbsenteeCallingStatus = {};
//         const initialCallingRemark1 = {}

//        response.data.forEach((attendance) => {
//         const srn = attendance.studentSrn;

       

//         if (attendance.callingStatus) {
//           initialAbsenteeCallingStatus[srn] = {
//             value: attendance.callingStatus,
//             label: attendance.callingStatus,
//           };
//         }

//         if (attendance.callingRemark1) {
//           initialCallingRemark1[srn] = {
//             value: attendance.callingRemark1,
//             label: attendance.callingRemark1,
//           };
//         }
//       });

    
//       setAbsenteeCallingStatus(initialAbsenteeCallingStatus);  // Pre-fill Select
//       setCallingRemark1(initialCallingRemark1);          //Pre-fill Remark Select
//       } catch (error) {
//         console.log("Error fetching attendance data");
//         setAttendanceData([])
//       }
//     } else {
//       console.log("Please select all filters")
//     }
//   }

//   useEffect(() => {
//     fetchAttendance();
//   }, [districtContext, blockContext, schoolContext, date, endDate, classContext]);

//   useEffect(()=> {
//     setBlockContext([])
//     setSchoolContext([])
//     setSchoolContext({})
//     setAttendanceData([])
//   }, [districtContext])

//   useEffect(()=> {
//     setAttendanceData([])
//   }, [ classContext])

//   useEffect(()=> {
//     setSchoolContext([])
//   }, [blockContext])

//   const handleAbsenteeCalling = async (studentSrn) => {
//   const queryParamsForAttendance = {
//     studentSrn,
//     date,
//   };

//   const formData = {
//     absenteeCallingStatus: absenteeCallingStatus[studentSrn]?.value || "",
//     callingRemark1: callingRemark1[studentSrn]?.value || "",
//   };

//   try {
//     await updateAttendanceBySrnAndDate(queryParamsForAttendance, formData);
//     console.log("Sent to backend:", queryParamsForAttendance, formData);
//   } catch (error) {
//     console.error("Error updating attendance", error.message);
//   }
// };

// useEffect(() => {
//   Object.entries(callingRemark1).forEach(([srn, remarkObj]) => {
//     if (remarkObj) {
//       handleAbsenteeCalling(srn);
//     }
//   });
// }, [callingRemark1, absenteeCallingStatus]);

//   // NEW useEffect TO UPDATE REMARK OPTIONS BASED ON CALLING STATUS
//   useEffect(() => {
//     const updatedRemarks = {};
//     Object.entries(absenteeCallingStatus).forEach(([srn, statusObj]) => {
//       if (!statusObj) return;
//       const status = statusObj.value;
//       if (status === "Connected") {
//         updatedRemarks[srn] = [
//           { value: "Fever", label: "Fever" },
//           { value: "Not-interested", label: "Not-interested" },
//           { value: "Out-of-town", label: "Out-of-town" },
//         ];
//       } else if (status === "Not-connected") {
//         updatedRemarks[srn] = [
//           { value: "not-picked", label: "not-picked" },
//         ];
//       } else if (status === "Wrong-number") {
//         updatedRemarks[srn] = [
//           { value: "wrong-number", label: "wrong-number" },
//         ];
//       } else {
//         updatedRemarks[srn] = [];
//       }
//     });
//     setRemark1(updatedRemarks);
//   }, [absenteeCallingStatus]);

//   useEffect(()=>{
//     console.log(absenteeCallingStatus)
//     console.log(callingRemark1)
//     console.log(remark1)
//   }, [remark1, callingRemark1, absenteeCallingStatus])

// //Sorting the students attendance array  
// attendanceData.sort((a, b)=>a.studentDetails.firstName.localeCompare(b.studentDetails.firstName))


//   return (
//     <Container fluid className="prevent-overflow">
//       <Form>
//         <div>
//           <div className="MBAttendance-filter-div">
//             <div className="MBAttendance-filter-div-child-1">
//               <Form.Group controlId="date">
//                 <label>Date</label>
//                 <Form.Control
//                   type="date"
//                   name="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                 />
//               </Form.Group>
//             </div>
//             {/* <div className="MBAttendance-filter-div-child-2">
//               <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
//             </div> */}


//             <div>
//               <SchoolDropDowns/>
//             </div>
//           </div>
//         </div>

//         <Row>
//           <Col>
//             <ClassOfStudent />
//           </Col>
//         </Row>
//       </Form>

//       <hr />

//       <h1>Absentee Calling</h1>

//       {error && <Alert variant="danger">{error}</Alert>}
//       <Row>
//         <Table
//           bordered
//           hover
//           responsive
//           className="mt-4 text-center align-middle"
//         >
//           <thead>
//             <tr>
//               <th>SRN</th>
//               <th>Father</th>
//               <th>Student</th>
//               <th>Contact 1</th>
//               <th>Contact 2</th>
//               <th>Calling Status</th>
//               <th>Remark</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceData.length > 0 ? (
//               attendanceData.map((attendance) => (
//                 <tr key={attendance._id}>
//                   <td>{attendance.studentSrn}</td>
//                   <td>{attendance.studentDetails.fatherName}</td>
//                   <td>{attendance.studentDetails.firstName}</td>
//                   <td>
//                     <a
//                       href={`tel:${attendance.studentDetails.personalContact}`}
//                       style={{ textDecoration: "none" }}
//                     >
//                       📞 {attendance.studentDetails.personalContact}
//                     </a>
//                   </td>
//                   <td>
//                     <a
//                       href={`tel:${attendance.studentDetails.ParentContact}`}
//                       style={{ textDecoration: "none" }}
//                     >
//                       📞 {attendance.studentDetails.ParentContact}
//                     </a>
//                   </td>
//                   <td>
//                     <Select
//                       id={attendance.studentSrn}
//                       options={[
//                         { value: "Connected", label: "Connected" },
//                         { value: "Not-connected", label: "Not-connected" },
//                         { value: "Wrong-number", label: "Wrong-number" },
//                       ]}
//                       value={absenteeCallingStatus[attendance.studentSrn] || null}
//                       onChange={(selectedOption) =>
//                         setAbsenteeCallingStatus((prevState) => ({
//                           ...prevState,
//                           [attendance.studentSrn]: selectedOption,
//                         }))
//                       }
                      
//                     />
//                   </td>
//                   <td>
//                     <Select
//                       id={attendance.studentSrn}
//                       options={remark1[attendance.studentSrn] || []}
//                       value={callingRemark1[attendance.studentSrn] || null}
//                       onChange={(selectedOption) =>
//                         setCallingRemark1((prevState) => ({
//                           ...prevState,
//                           [attendance.studentSrn]: selectedOption,
//                         }))
                      
//                       }
                     
                        
                      
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9">No attendance records found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Row>
//     </Container>
//   );
// };
































// This is AttendanceSession1.jsx.

// This component marks the attendance of class 8th for MB

// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Alert, Breadcrumb  } from 'react-bootstrap';


import { getAllAttendance, updateAttendanceBySrnAndDate } from "../service/AttendanceMB.services.js";
import { DistrictBlockSchoolById, ClassOfStudent  } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";


//importing context api (District Block School Context API)
import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

import Select from 'react-select'
import { formToJSON } from "axios";
import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
import { UserContext } from "../components/contextAPIs/User.context.js";

export const AbsenteeCalling = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

    //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
    
     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
     const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
     const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
  //______________________________________________________________________________________________

  //ClassContext API
  const {classContext, setClassContext} = useContext(ClassContext);
  const {userData, setUserData} = useContext(UserContext);

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

    const [absenteeCallingStatus, setAbsenteeCallingStatus] = useState({});
    const [callingRemark1, setCallingRemark1] = useState({});
    const [remark1, setRemark1] = useState({}); // NEW STATE FOR REMARK OPTIONS

  // Track attendance state individually for each student using an object.
  const [attendanceState, setAttendanceState] = useState({});

  useEffect(()=>{
    setDate(new Date().toISOString().split("T")[0])
  }, [])

  const queryParams = {
    studentSrn:"",
    firstName:"",
    fatherName:"",
    date: date ,
    status: "Absent",
    startDate: date,
    endDate: endDate || "",
    // districtId: Object(districtContext[0]).value  , 
    // blockId:Object(blockContext[0]).value || "",
    schoolId:Object(schoolContext[0]).value || userData[0].assignedSchools,
    classofStudent:classContext.value || ['9', '10'],
    batch:"",
  };

  const fetchAttendance = async () => {
    console.log(queryParams)
    if (true) {
      try {
        const response = await getAllAttendance(queryParams);
        setAttendanceData(response.data);
        console.log("I am inside attendance mb")
        console.log(response.data)
        const initialAttendanceState = {};
        const initialAbsenteeCallingStatus = {};
        const initialCallingRemark1 = {}

       response.data.forEach((attendance) => {
        const srn = attendance.studentSrn;

       

        if (attendance.callingStatus) {
          initialAbsenteeCallingStatus[srn] = {
            value: attendance.callingStatus,
            label: attendance.callingStatus,
          };
        }

        if (attendance.callingRemark1) {
          initialCallingRemark1[srn] = {
            value: attendance.callingRemark1,
            label: attendance.callingRemark1,
          };
        }
      });

    
      setAbsenteeCallingStatus(initialAbsenteeCallingStatus);  // Pre-fill Select
      setCallingRemark1(initialCallingRemark1);          //Pre-fill Remark Select
      } catch (error) {
        console.log("Error fetching attendance data");
        setAttendanceData([])
      }
    } else {
      console.log("Please select all filters")
    }
  }

  useEffect(() => {
    fetchAttendance();
  }, [districtContext, blockContext, schoolContext, date, endDate, classContext]);

  useEffect(()=> {
    setBlockContext([])
    setSchoolContext([])
    setSchoolContext({})
    setAttendanceData([])
  }, [districtContext])

  useEffect(()=> {
    setAttendanceData([])
  }, [ classContext])

  useEffect(()=> {
    setSchoolContext([])
  }, [blockContext])

  const handleAbsenteeCalling = async (studentSrn, schoolId, classofStudent) => {
  const queryParamsForAttendance = {
    studentSrn,
    date,
    schoolId,
    classofStudent
  };
alert('hello world')
  console.log(queryParamsForAttendance)

  const formData = {
    absenteeCallingStatus: absenteeCallingStatus[studentSrn]?.value || "",
    callingRemark1: callingRemark1[studentSrn]?.value || "",
  };

  try {
    await updateAttendanceBySrnAndDate(queryParamsForAttendance, formData);
    console.log("Sent to backend:", queryParamsForAttendance, formData);
  } catch (error) {
    console.error("Error updating attendance", error.message);
  }
};

useEffect(() => {
  Object.entries(callingRemark1).forEach(([srn, remarkObj]) => {
    if (remarkObj) {
      handleAbsenteeCalling(srn);
    }
  });
}, [callingRemark1, absenteeCallingStatus]);

  // NEW useEffect TO UPDATE REMARK OPTIONS BASED ON CALLING STATUS
  useEffect(() => {
    const updatedRemarks = {};
    Object.entries(absenteeCallingStatus).forEach(([srn, statusObj]) => {
      if (!statusObj) return;
      const status = statusObj.value;
      if (status === "Connected") {
        updatedRemarks[srn] = [
          { value: "Fever", label: "Fever" },
          { value: "Not-interested", label: "Not-interested" },
          { value: "Out-of-town", label: "Out-of-town" },
        ];
      } else if (status === "Not-connected") {
        updatedRemarks[srn] = [
          { value: "not-picked", label: "not-picked" },
        ];
      } else if (status === "Wrong-number") {
        updatedRemarks[srn] = [
          { value: "wrong-number", label: "wrong-number" },
        ];
      } else {
        updatedRemarks[srn] = [];
      }
    });
    setRemark1(updatedRemarks);
  }, [absenteeCallingStatus]);

  useEffect(()=>{
    console.log(absenteeCallingStatus)
    console.log(callingRemark1)
    console.log(remark1)
  }, [remark1, callingRemark1, absenteeCallingStatus])

//Sorting the students attendance array  
attendanceData.sort((a, b)=>a.studentDetails.firstName.localeCompare(b.studentDetails.firstName))


  return (
    <Container fluid className="prevent-overflow">
      <Form>
        <div>
          <div className="MBAttendance-filter-div">
            <div className="MBAttendance-filter-div-child-1">
              <Form.Group controlId="date">
                <label>Date</label>
                <Form.Control
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </div>
            {/* <div className="MBAttendance-filter-div-child-2">
              <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
            </div> */}


            <div>
              <SchoolDropDowns/>
            </div>
          </div>
        </div>

        <Row>
          <Col>
            <ClassOfStudent />
          </Col>
        </Row>
      </Form>

      <hr />

      <h1>Absentee Calling</h1>

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
              <th>Contact 1</th>
              <th>Contact 2</th>
              <th>Calling Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((attendance) => (
                <tr key={attendance._id}>
                  <td>{attendance.studentSrn}</td>
                  <td>{attendance.studentDetails.fatherName}</td>
                  <td>{attendance.studentDetails.firstName}</td>
                  <td>
                    <a
                      href={`tel:${attendance.studentDetails.personalContact}`}
                      style={{ textDecoration: "none" }}
                    >
                      📞 {attendance.studentDetails.personalContact}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`tel:${attendance.studentDetails.ParentContact}`}
                      style={{ textDecoration: "none" }}
                    >
                      📞 {attendance.studentDetails.ParentContact}
                    </a>
                  </td>
                  <td>
                    <Select
  id={attendance.studentSrn}
  options={[
    { value: "Connected", label: "Connected" },
    { value: "Not-connected", label: "Not-connected" },
    { value: "Wrong-number", label: "Wrong-number" },
  ]}
  value={absenteeCallingStatus[attendance.studentSrn] || null}
  onChange={(selectedOption) =>
    setAbsenteeCallingStatus((prevState) => ({
      ...prevState,
      [attendance.studentSrn]: selectedOption,
    }))
  }
/>
                  </td>
                  <td>
                    <Select
  id={attendance.studentSrn}
  options={remark1[attendance.studentSrn] || []}
  value={callingRemark1[attendance.studentSrn] || null}
  onChange={(selectedOption) => {
    setCallingRemark1((prevState) => ({
      ...prevState,
      [attendance.studentSrn]: selectedOption,
    }));
    // Call here with schoolId & classofStudent from studentDetails
    handleAbsenteeCalling(
      attendance.studentSrn,
      attendance.studentDetails.schoolId,
      attendance.studentDetails.classofStudent
    );
  }}
/>
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

