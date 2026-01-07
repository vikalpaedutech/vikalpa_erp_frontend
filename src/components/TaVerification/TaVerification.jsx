// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {


//       const { userData, setUserData } = useContext(UserContext);


//     const GetTaDashBoard = async () => {


//         try {
//             const response = await GetStudentAttendanceDashboard();
//             console.log(response.data)
//         } catch (error) {
//             console.error(error)
//         }
//     }

//     useEffect(()=>{
//         GetTaDashBoard()

//         console.log(userData)
//     }, [])


//     return(
//         <h1>
//         <br></br>
//         Hello TA Verification

//         </h1>
//     )
// }














// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🧠 Build req.body from userData
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     // 1️⃣ classIds
//     const classIds = userData.userAccess.classId || [];

//     // 2️⃣ schoolIds (deep nested → flatten)
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   const GetTaDashBoard = async () => {
//     try {
//       const reqBody = buildReqBody();

//       console.log("REQ BODY FOR TA DASHBOARD 👉", reqBody);

//       // ⛔ Not using reqBody yet (you said later)
//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       GetTaDashBoard();
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData]);

//   return (
//     <>
//       <h4>Hello TA Verification</h4>
//     </>
//   );
// };






// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData]);

//   return (
//     <>
//     <br></br>
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={3}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={3}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit}>Submit</Button>
//         </Col>
//       </Row>
//     </>
//   );
// };















// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       // 🔽 Store the attendance data
//       setAttendanceData(response.data.data);
      
//       // 🔽 Calculate student-wise summary
//       calculateStudentSummary(response.data.data);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     const summaryMap = {};
    
//     data.forEach(record => {
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName,
//           class: record.class,
//           rollNo: record.rollNo,
//           center: record.center,
//           district: record.district,
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0
//         };
//       }
      
//       // Update counts based on status
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
//     });
    
//     // Convert map to array and set state
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
    
//     console.log("Student Summary 👉", summaryArray);
//   };

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData]);

//   return (
//     <>
//     <br></br>
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={3}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={3}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit}>Submit</Button>
//         </Col>
//       </Row>

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD */}
//       {studentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">Student Attendance Summary - {month} {year}</h5>
//           </Card.Header>
//           <Card.Body>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>SRN</th>
//                   <th>Student Name</th>
//                   <th>Class</th>
//                   <th>Roll No</th>
//                   <th>Center</th>
//                   <th>District</th>
//                   <th>Present</th>
//                   <th>Absent</th>
//                   <th>Total Days</th>
//                   <th>Attendance %</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentSummary.map((student, index) => {
//                   const attendancePercentage = student.totalRecords > 0 
//                     ? Math.round((student.presentCount / student.totalRecords) * 100)
//                     : 0;
                  
//                   return (
//                     <tr key={index}>
//                       <td>{student.studentSrn}</td>
//                       <td>{student.studentName}</td>
//                       <td>{student.class}</td>
//                       <td>{student.rollNo}</td>
//                       <td>{student.center}</td>
//                       <td>{student.district}</td>
//                       <td>
//                         <Badge bg="success">{student.presentCount}</Badge>
//                       </td>
//                       <td>
//                         <Badge bg="danger">{student.absentCount}</Badge>
//                       </td>
//                       <td>
//                         <Badge bg="info">{student.totalRecords}</Badge>
//                       </td>
//                       <td>
//                         <Badge 
//                           bg={
//                             attendancePercentage >= 75 ? "success" :
//                             attendancePercentage >= 50 ? "warning" : "danger"
//                           }
//                         >
//                           {attendancePercentage}%
//                         </Badge>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {studentSummary.length} student(s) • 
//               Total Present: {studentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {studentSummary.reduce((sum, student) => sum + student.absentCount, 0)}
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 DETAILED ATTENDANCE RECORDS (Optional - can be collapsed/expanded) */}
//       {attendanceData.length > 0 && (
//         <Accordion className="mt-3">
//           <Accordion.Item eventKey="0">
//             <Accordion.Header>
//               Detailed Attendance Records ({attendanceData.length} records)
//             </Accordion.Header>
//             <Accordion.Body>
//               <Table striped bordered hover responsive size="sm">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>SRN</th>
//                     <th>Student Name</th>
//                     <th>Status</th>
//                     <th>Attendance Marked</th>
//                     <th>Absentee Calling Status</th>
//                     <th>Comments</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendanceData.map((record, index) => (
//                     <tr key={index}>
//                       <td>{new Date(record.date).toLocaleDateString()}</td>
//                       <td>{record.studentSrn}</td>
//                       <td>{record.studentName}</td>
//                       <td>
//                         <Badge 
//                           bg={record.status === "Present" ? "success" : "danger"}
//                         >
//                           {record.status}
//                         </Badge>
//                       </td>
//                       <td>
//                         <Badge 
//                           bg={record.isAttendanceMarked ? "success" : "secondary"}
//                         >
//                           {record.isAttendanceMarked ? "Yes" : "No"}
//                         </Badge>
//                       </td>
//                       <td>{record.absenteeCallingStatus}</td>
//                       <td>{record.comments || "-"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Accordion.Body>
//           </Accordion.Item>
//         </Accordion>
//       )}
//     </>
//   );
// };




// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false); // 🔽 Loading state

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       setIsLoading(true); // 🔽 Start loading
//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       // 🔽 Store the attendance data
//       setAttendanceData(response.data.data || []);
      
//       // 🔽 Calculate student-wise summary
//       calculateStudentSummary(response.data.data || []);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false); // 🔽 Stop loading
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     if (!data || !Array.isArray(data)) {
//       console.log("No data or invalid data format");
//       setStudentSummary([]);
//       return;
//     }

//     const summaryMap = {};
    
//     data.forEach(record => {
//       if (!record || !record.studentSrn) return; // 🔽 Skip invalid records
      
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName || "N/A",
//           class: record.class || "N/A",
//           rollNo: record.rollNo || "N/A",
//           center: record.center || "N/A",
//           district: record.district || "N/A",
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0,
//           attendanceRecords: [] // 🔽 Store individual records for each student
//         };
//       }
      
//       // Update counts based on status
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
      
//       // 🔽 Store the individual attendance record
//       summaryMap[studentSrn].attendanceRecords.push({
//         date: record.date || "N/A",
//         status: record.status || "N/A",
//         isAttendanceMarked: record.isAttendanceMarked || false,
//         absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//         comments: record.comments || null
//       });
//     });
    
//     // Convert map to array and set state
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
    
//     console.log("Student Summary 👉", summaryArray);
//   };

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData]);

//   return (
//     <>
//     <br></br>
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={3}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={3}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Col>
//       </Row>

//       {/* 🔽 Loading State */}
//       {isLoading && (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading attendance data...</p>
//         </div>
//       )}

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
//       {!isLoading && studentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">Student Attendance Summary - {month} {year}</h5>
//           </Card.Header>
//           <Card.Body>
//             <Accordion flush>
//               {studentSummary.map((student, studentIndex) => {
//                 const attendancePercentage = student.totalRecords > 0 
//                   ? Math.round((student.presentCount / student.totalRecords) * 100)
//                   : 0;
                
//                 // 🔽 Ensure attendanceRecords exists and is an array
//                 const attendanceRecords = student.attendanceRecords || [];
                
//                 return (
//                   <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
//                     <Accordion.Header>
//                       <Container fluid>
//                         <Row className="align-items-center">
//                           <Col md={2}>
//                             <strong>{student.studentSrn}</strong>
//                           </Col>
//                           <Col md={2}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={1}>
//                             Class {student.class}
//                           </Col>
//                           <Col md={1}>
//                             {student.rollNo}
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="success">{student.presentCount} Present</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="danger">{student.absentCount} Absent</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="info">{student.totalRecords} Days</Badge>
//                           </Col>
//                           <Col md={2}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}% Attendance
//                             </Badge>
//                           </Col>
//                         </Row>
//                       </Container>
//                     </Accordion.Header>
//                     <Accordion.Body>
//                       {/* 🔽 Student Details */}
//                       <Row className="mb-3">
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Student Information</Card.Title>
//                               <Row>
//                                 <Col md={6}>
//                                   <p><strong>SRN:</strong> {student.studentSrn}</p>
//                                   <p><strong>Name:</strong> {student.studentName}</p>
//                                   <p><strong>Class:</strong> {student.class}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p><strong>Roll No:</strong> {student.rollNo}</p>
//                                   <p><strong>Center:</strong> {student.center}</p>
//                                   <p><strong>District:</strong> {student.district}</p>
//                                 </Col>
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Attendance Summary</Card.Title>
//                               <Row>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-success">{student.presentCount}</div>
//                                   <p className="mb-0">Present</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-danger">{student.absentCount}</div>
//                                   <p className="mb-0">Absent</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-primary">{student.totalRecords}</div>
//                                   <p className="mb-0">Total Days</p>
//                                 </Col>
//                               </Row>
//                               <div className="text-center mt-2">
//                                 <Badge 
//                                   bg={
//                                     attendancePercentage >= 75 ? "success" :
//                                     attendancePercentage >= 50 ? "warning" : "danger"
//                                   }
//                                   className="px-3 py-2"
//                                 >
//                                   <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
//                                 </Badge>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       </Row>
                      
//                       {/* 🔽 Daily Attendance Records */}
//                       <h5 className="mb-3">Daily Attendance Records ({attendanceRecords.length} days)</h5>
//                       {attendanceRecords.length > 0 ? (
//                         <Table striped bordered hover responsive size="sm">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Status</th>
//                               <th>Attendance Marked</th>
//                               <th>Absentee Calling Status</th>
//                               <th>Comments</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {attendanceRecords.map((record, recordIndex) => (
//                               <tr key={recordIndex}>
//                                 <td>
//                                   {record.date && record.date !== "N/A" ? 
//                                     new Date(record.date).toLocaleDateString('en-US', {
//                                       weekday: 'short',
//                                       year: 'numeric',
//                                       month: 'short',
//                                       day: 'numeric'
//                                     }) : 
//                                     "N/A"
//                                   }
//                                 </td>
//                                 <td>
//                                   <Badge 
//                                     bg={record.status === "Present" ? "success" : "danger"}
//                                     className="px-3"
//                                   >
//                                     {record.status}
//                                   </Badge>
//                                 </td>
//                                 <td>
//                                   <Badge 
//                                     bg={record.isAttendanceMarked ? "success" : "secondary"}
//                                   >
//                                     {record.isAttendanceMarked ? "Yes" : "No"}
//                                   </Badge>
//                                 </td>
//                                 <td>
//                                   {record.absenteeCallingStatus}
//                                 </td>
//                                 <td>
//                                   {record.comments || "-"}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       ) : (
//                         <div className="alert alert-warning">
//                           No attendance records found for this student.
//                         </div>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {studentSummary.length} student(s) • 
//               Total Present: {studentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {studentSummary.reduce((sum, student) => sum + student.absentCount, 0)}
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 No Data Message */}
//       {!isLoading && studentSummary.length === 0 && attendanceData.length === 0 && month && year && (
//         <Card className="mt-4">
//           <Card.Body className="text-center">
//             <h5>No attendance data found for {month} {year}</h5>
//             <p>Please select a different month/year or check if data exists for the selected period.</p>
//           </Card.Body>
//         </Card>
//       )}

//       {/* 🔽 DETAILED ATTENDANCE RECORDS (Optional - can be collapsed/expanded) */}
//       {!isLoading && attendanceData.length > 0 && (
//         <Accordion className="mt-3">
//           <Accordion.Item eventKey="0">
//             <Accordion.Header>
//               Complete Raw Data ({attendanceData.length} records)
//             </Accordion.Header>
//             <Accordion.Body>
//               <Table striped bordered hover responsive size="sm">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>SRN</th>
//                     <th>Student Name</th>
//                     <th>Status</th>
//                     <th>Attendance Marked</th>
//                     <th>Absentee Calling Status</th>
//                     <th>Comments</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendanceData.map((record, index) => (
//                     <tr key={index}>
//                       <td>{record.date ? new Date(record.date).toLocaleDateString() : "N/A"}</td>
//                       <td>{record.studentSrn || "N/A"}</td>
//                       <td>{record.studentName || "N/A"}</td>
//                       <td>
//                         <Badge 
//                           bg={record.status === "Present" ? "success" : "danger"}
//                         >
//                           {record.status || "N/A"}
//                         </Badge>
//                       </td>
//                       <td>
//                         <Badge 
//                           bg={record.isAttendanceMarked ? "success" : "secondary"}
//                         >
//                           {record.isAttendanceMarked ? "Yes" : "No"}
//                         </Badge>
//                       </td>
//                       <td>{record.absenteeCallingStatus || "N/A"}</td>
//                       <td>{record.comments || "-"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Accordion.Body>
//           </Accordion.Item>
//         </Accordion>
//       )}
//     </>
//   );
// };





// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge,
//   Modal
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
// import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // 🔽 State for update modal
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [updateReason, setUpdateReason] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       setIsLoading(true);
//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       setAttendanceData(response.data.data || []);
//       calculateStudentSummary(response.data.data || []);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     if (!data || !Array.isArray(data)) {
//       console.log("No data or invalid data format");
//       setStudentSummary([]);
//       return;
//     }

//     const summaryMap = {};
    
//     data.forEach(record => {
//       if (!record || !record.studentSrn) return;
      
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName || "N/A",
//           class: record.class || "N/A",
//           rollNo: record.rollNo || "N/A",
//           center: record.center || "N/A",
//           district: record.district || "N/A",
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0,
//           attendanceRecords: []
//         };
//       }
      
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
      
//       summaryMap[studentSrn].attendanceRecords.push({
//         _id: record._id,
//         date: record.date || "N/A",
//         status: record.status || "N/A",
//         isAttendanceMarked: record.isAttendanceMarked || false,
//         absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//         comments: record.comments || null,
//         isVerifiedByTA: record.isVerifiedByTA || false,
//         originalStatus: record.originalStatus || null,
//         verifiedByTAName: record.verifiedByTAName || null
//       });
//     });
    
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
//   };

//   // 🔘 Handle update attendance button click
//   const handleUpdateClick = (record, student) => {
//     setSelectedRecord(record);
//     setSelectedStudent(student);
//     setNewStatus(record.status === "Present" ? "Absent" : "Present");
//     setUpdateReason("");
//     setShowUpdateModal(true);
//   };

//   // 🔘 Confirm update attendance
//   const handleConfirmUpdate = async () => {
//     if (!selectedRecord || !newStatus) return;

//     setIsUpdating(true);
//     try {
//       const updateData = {
//         _id: selectedRecord._id,
//         status: newStatus,
//         userId: userData?.userId || "unknown",
//         userName: userData?.name || "Unknown User",
//         reason: updateReason
//       };

//       const response = await UpdateAttendanceStatus(updateData);
      
//       if (response.success) {
//         // Refresh the data
//         await handleSubmit();
//         setShowUpdateModal(false);
//         setRefreshKey(prev => prev + 1);
//       } else {
//         alert(response.message || "Failed to update attendance");
//       }
//     } catch (error) {
//       console.error("Error updating attendance:", error);
//       alert("Failed to update attendance. Please try again.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // 🔘 Format date to dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "N/A") return "N/A";
    
//     try {
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Invalid Date";
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData, refreshKey]);

//   return (
//     <>
//       <br />
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={3}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={3}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Col>
//       </Row>

//       {/* 🔽 Loading State */}
//       {isLoading && (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading attendance data...</p>
//         </div>
//       )}

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
//       {!isLoading && studentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">Student Attendance Summary - {month} {year}</h5>
//           </Card.Header>
//           <Card.Body>
//             <Accordion flush>
//               {studentSummary.map((student, studentIndex) => {
//                 const attendancePercentage = student.totalRecords > 0 
//                   ? Math.round((student.presentCount / student.totalRecords) * 100)
//                   : 0;
                
//                 const attendanceRecords = student.attendanceRecords || [];
                
//                 return (
//                   <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
//                     <Accordion.Header>
//                       <Container fluid>
//                         <Row className="align-items-center">
//                           <Col md={2}>
//                             <strong>{student.studentSrn}</strong>
//                           </Col>
//                           <Col md={2}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={1}>
//                             Class {student.class}
//                           </Col>
//                           <Col md={1}>
//                             {student.rollNo}
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="success">{student.presentCount} Present</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="danger">{student.absentCount} Absent</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="info">{student.totalRecords} Days</Badge>
//                           </Col>
//                           <Col md={2}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}% Attendance
//                             </Badge>
//                           </Col>
//                         </Row>
//                       </Container>
//                     </Accordion.Header>
//                     <Accordion.Body>
//                       {/* 🔽 Student Details */}
//                       <Row className="mb-3">
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Student Information</Card.Title>
//                               <Row>
//                                 <Col md={6}>
//                                   <p><strong>SRN:</strong> {student.studentSrn}</p>
//                                   <p><strong>Name:</strong> {student.studentName}</p>
//                                   <p><strong>Class:</strong> {student.class}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p><strong>Roll No:</strong> {student.rollNo}</p>
//                                   <p><strong>Center:</strong> {student.center}</p>
//                                   <p><strong>District:</strong> {student.district}</p>
//                                 </Col>
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Attendance Summary</Card.Title>
//                               <Row>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-success">{student.presentCount}</div>
//                                   <p className="mb-0">Present</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-danger">{student.absentCount}</div>
//                                   <p className="mb-0">Absent</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-primary">{student.totalRecords}</div>
//                                   <p className="mb-0">Total Days</p>
//                                 </Col>
//                               </Row>
//                               <div className="text-center mt-2">
//                                 <Badge 
//                                   bg={
//                                     attendancePercentage >= 75 ? "success" :
//                                     attendancePercentage >= 50 ? "warning" : "danger"
//                                   }
//                                   className="px-3 py-2"
//                                 >
//                                   <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
//                                 </Badge>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       </Row>
                      
//                       {/* 🔽 Daily Attendance Records */}
//                       <h5 className="mb-3">Daily Attendance Records ({attendanceRecords.length} days)</h5>
//                       {attendanceRecords.length > 0 ? (
//                         <Table striped bordered hover responsive size="sm">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Status</th>
//                               <th>Action</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {attendanceRecords.map((record, recordIndex) => (
//                               <tr key={recordIndex}>
//                                 <td>
//                                   {formatDate(record.date)}
//                                 </td>
//                                 <td>
//                                   <Badge 
//                                     bg={record.status === "Present" ? "success" : "danger"}
//                                     className="px-3"
//                                   >
//                                     {record.status}
//                                     {record.isVerifiedByTA && (
//                                       <span className="ms-1">✓</span>
//                                     )}
//                                   </Badge>
//                                   {record.originalStatus && record.originalStatus !== record.status && (
//                                     <small className="ms-2 text-muted">
//                                       (Originally: {record.originalStatus})
//                                     </small>
//                                   )}
//                                 </td>
//                                 <td>
//                                   <Button 
//                                     size="sm" 
//                                     variant={record.status === "Present" ? "danger" : "success"}
//                                     onClick={() => handleUpdateClick(record, student)}
//                                   >
//                                     Mark as {record.status === "Present" ? "Absent" : "Present"}
//                                   </Button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       ) : (
//                         <div className="alert alert-warning">
//                           No attendance records found for this student.
//                         </div>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {studentSummary.length} student(s) • 
//               Total Present: {studentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {studentSummary.reduce((sum, student) => sum + student.absentCount, 0)}
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 No Data Message */}
//       {!isLoading && studentSummary.length === 0 && attendanceData.length === 0 && month && year && (
//         <Card className="mt-4">
//           <Card.Body className="text-center">
//             <h5>No attendance data found for {month} {year}</h5>
//             <p>Please select a different month/year or check if data exists for the selected period.</p>
//           </Card.Body>
//         </Card>
//       )}

//       {/* 🔽 Update Attendance Modal */}
//       <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Attendance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedRecord && selectedStudent && (
//             <>
//               <p><strong>Student:</strong> {selectedStudent.studentName} ({selectedStudent.studentSrn})</p>
//               <p><strong>Date:</strong> {formatDate(selectedRecord.date)}</p>
//               <p><strong>Current Status:</strong> 
//                 <Badge bg={selectedRecord.status === "Present" ? "success" : "danger"} className="ms-2">
//                   {selectedRecord.status}
//                 </Badge>
//               </p>
//               <p><strong>New Status:</strong> 
//                 <Badge bg={newStatus === "Present" ? "success" : "danger"} className="ms-2">
//                   {newStatus}
//                 </Badge>
//               </p>
              
//               <Form.Group className="mt-3">
//                 <Form.Label>Reason for change (optional)</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={updateReason}
//                   onChange={(e) => setUpdateReason(e.target.value)}
//                   placeholder="Enter reason for changing attendance..."
//                 />
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleConfirmUpdate}
//             disabled={isUpdating}
//           >
//             {isUpdating ? "Updating..." : "Confirm Update"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };










// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge,
//   Modal
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
// import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // 🔽 State for updating
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       setIsLoading(true);
//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       setAttendanceData(response.data.data || []);
//       calculateStudentSummary(response.data.data || []);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     if (!data || !Array.isArray(data)) {
//       console.log("No data or invalid data format");
//       setStudentSummary([]);
//       return;
//     }

//     const summaryMap = {};
    
//     data.forEach(record => {
//       if (!record || !record.studentSrn) return;
      
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName || "N/A",
//           class: record.class || "N/A",
//           rollNo: record.rollNo || "N/A",
//           center: record.center || "N/A",
//           district: record.district || "N/A",
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0,
//           attendanceRecords: []
//         };
//       }
      
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
      
//       summaryMap[studentSrn].attendanceRecords.push({
//         _id: record._id,
//         date: record.date || "N/A",
//         status: record.status || "N/A",
//         isAttendanceMarked: record.isAttendanceMarked || false,
//         absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//         comments: record.comments || null,
//         isVerifiedByTA: record.isVerifiedByTA || false,
//         originalStatus: record.originalStatus || null,
//         verifiedByTAName: record.verifiedByTAName || null
//       });
//     });
    
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
//   };

//   // 🔘 Handle immediate attendance toggle
//   const handleToggleAttendance = async (recordId, studentSrn, studentIndex, recordIndex, currentStatus) => {
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    
//     // Set updating state for this specific record
//     setUpdatingId(recordId);
//     setIsUpdating(true);

//     try {
//       // Update UI immediately (optimistic update)
//       const updatedStudentSummary = [...studentSummary];
//       const student = updatedStudentSummary[studentIndex];
//       const attendanceRecord = student.attendanceRecords[recordIndex];
      
//       // Store previous values for rollback
//       const previousStatus = attendanceRecord.status;
//       const previousPresentCount = student.presentCount;
//       const previousAbsentCount = student.absentCount;
      
//       // Update record status
//       attendanceRecord.status = newStatus;
      
//       // Update counts
//       if (newStatus === "Present") {
//         student.presentCount += 1;
//         student.absentCount -= 1;
//       } else {
//         student.presentCount -= 1;
//         student.absentCount += 1;
//       }
      
//       // Update state immediately
//       setStudentSummary(updatedStudentSummary);

//       // Call API to update backend
//       const updateData = {
//         _id: recordId,
//         status: newStatus
//       };

//       const response = await UpdateAttendanceStatus(updateData);

      
      
//       if (!response.status) {
//         // Rollback if API fails
//         const rollbackStudentSummary = [...studentSummary];
//         const rollbackStudent = rollbackStudentSummary[studentIndex];
//         const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
        
//         rollbackRecord.status = previousStatus;
//         rollbackStudent.presentCount = previousPresentCount;
//         rollbackStudent.absentCount = previousAbsentCount;
        
//         setStudentSummary(rollbackStudentSummary);

//         alert(response.message || "Failed to update attendance");
//       }
      
//     } catch (error) {
//       console.error("Error updating attendance:", error);
      
//       // Refresh data from server to get correct state
//       await handleSubmit();
//       alert("Failed to update attendance. Please try again.");
      
//     } finally {
//       setIsUpdating(false);
//       setUpdatingId(null);
//     }
//   };

//   // 🔘 Format date to dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "N/A") return "N/A";
    
//     try {
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Invalid Date";
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData]);

//   return (
//     <>
//       <br />
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={3}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={3}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Col>
//       </Row>

//       {/* 🔽 Loading State */}
//       {isLoading && (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading attendance data...</p>
//         </div>
//       )}

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
//       {!isLoading && studentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">Student Attendance Summary - {month} {year}</h5>
//           </Card.Header>
//           <Card.Body>
//             <Accordion flush>
//               {studentSummary.map((student, studentIndex) => {
//                 const attendancePercentage = student.totalRecords > 0 
//                   ? Math.round((student.presentCount / student.totalRecords) * 100)
//                   : 0;
                
//                 const attendanceRecords = student.attendanceRecords || [];
                
//                 return (
//                   <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
//                     <Accordion.Header>
//                       <Container fluid>
//                         <Row className="align-items-center">
//                           <Col md={2}>
//                             <strong>{student.studentSrn}</strong>
//                           </Col>
//                           <Col md={2}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={1}>
//                             Class {student.class}
//                           </Col>
//                           <Col md={1}>
//                             {student.rollNo}
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="success">{student.presentCount} Present</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="danger">{student.absentCount} Absent</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="info">{student.totalRecords} Days</Badge>
//                           </Col>
//                           <Col md={2}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}% Attendance
//                             </Badge>
//                           </Col>
//                         </Row>
//                       </Container>
//                     </Accordion.Header>
//                     <Accordion.Body>
//                       {/* 🔽 Student Details */}
//                       <Row className="mb-3">
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Student Information</Card.Title>
//                               <Row>
//                                 <Col md={6}>
//                                   <p><strong>SRN:</strong> {student.studentSrn}</p>
//                                   <p><strong>Name:</strong> {student.studentName}</p>
//                                   <p><strong>Class:</strong> {student.class}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p><strong>Roll No:</strong> {student.rollNo}</p>
//                                   <p><strong>Center:</strong> {student.center}</p>
//                                   <p><strong>District:</strong> {student.district}</p>
//                                 </Col>
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Attendance Summary</Card.Title>
//                               <Row>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-success">{student.presentCount}</div>
//                                   <p className="mb-0">Present</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-danger">{student.absentCount}</div>
//                                   <p className="mb-0">Absent</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-primary">{student.totalRecords}</div>
//                                   <p className="mb-0">Total Days</p>
//                                 </Col>
//                               </Row>
//                               <div className="text-center mt-2">
//                                 <Badge 
//                                   bg={
//                                     attendancePercentage >= 75 ? "success" :
//                                     attendancePercentage >= 50 ? "warning" : "danger"
//                                   }
//                                   className="px-3 py-2"
//                                 >
//                                   <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
//                                 </Badge>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       </Row>
                      
//                       {/* 🔽 Daily Attendance Records */}
//                       <h5 className="mb-3">Daily Attendance Records ({attendanceRecords.length} days)</h5>
//                       {attendanceRecords.length > 0 ? (
//                         <Table striped bordered hover responsive size="sm">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Status</th>
//                               <th>Toggle Attendance</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {attendanceRecords.map((record, recordIndex) => {
//                               const isUpdatingThisRecord = updatingId === record._id;
//                               return (
//                                 <tr key={recordIndex}>
//                                   <td>
//                                     {formatDate(record.date)}
//                                   </td>
//                                   <td>
//                                     <Badge 
//                                       bg={record.status === "Present" ? "success" : "danger"}
//                                       className="px-3"
//                                     >
//                                       {record.status}
//                                       {isUpdatingThisRecord && (
//                                         <span className="ms-2 spinner-border spinner-border-sm" role="status">
//                                           <span className="visually-hidden">Updating...</span>
//                                         </span>
//                                       )}
//                                     </Badge>
//                                   </td>
//                                   <td>
//                                     <div className="d-flex align-items-center">
//                                       <Form.Check 
//                                         type="switch"
//                                         id={`switch-${record._id}`}
//                                         label={record.status === "Present" ? "Present" : "Absent"}
//                                         checked={record.status === "Present"}
//                                         onChange={() => handleToggleAttendance(
//                                           record._id, 
//                                           student.studentSrn, 
//                                           studentIndex, 
//                                           recordIndex,
//                                           record.status
//                                         )}
//                                         disabled={isUpdating && updatingId !== record._id}
//                                         className="me-3"
//                                       />
//                                       <div className="text-muted">
//                                         <small>
//                                           {record.status === "Present" ? "Switch to Absent" : "Switch to Present"}
//                                         </small>
//                                       </div>
//                                     </div>
//                                     {isUpdatingThisRecord && (
//                                       <div className="mt-1">
//                                         <small className="text-info">Updating...</small>
//                                       </div>
//                                     )}
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </Table>
//                       ) : (
//                         <div className="alert alert-warning">
//                           No attendance records found for this student.
//                         </div>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {studentSummary.length} student(s) • 
//               Total Present: {studentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {studentSummary.reduce((sum, student) => sum + student.absentCount, 0)}
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 No Data Message */}
//       {!isLoading && studentSummary.length === 0 && attendanceData.length === 0 && month && year && (
//         <Card className="mt-4">
//           <Card.Body className="text-center">
//             <h5>No attendance data found for {month} {year}</h5>
//             <p>Please select a different month/year or check if data exists for the selected period.</p>
//           </Card.Body>
//         </Card>
//       )}
//     </>
//   );
// };









// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge,
//   Modal
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
// import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // 🔽 State for updating
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);

//   // 🧠 Function to check if a date is Sunday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//   const isSunday = (dateString) => {
//     if (!dateString || dateString === "N/A") return false;
//     try {
//       const date = new Date(dateString);
//       return date.getDay() === 0; // 0 is Sunday
//     } catch (error) {
//       console.error("Error checking day:", error);
//       return false;
//     }
//   };

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       setIsLoading(true);
//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       setAttendanceData(response.data.data || []);
//       calculateStudentSummary(response.data.data || []);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     if (!data || !Array.isArray(data)) {
//       console.log("No data or invalid data format");
//       setStudentSummary([]);
//       return;
//     }

//     const summaryMap = {};
    
//     data.forEach(record => {
//       if (!record || !record.studentSrn) return;
      
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName || "N/A",
//           class: record.class || "N/A",
//           rollNo: record.rollNo || "N/A",
//           center: record.center || "N/A",
//           district: record.district || "N/A",
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0,
//           attendanceRecords: []
//         };
//       }
      
//       // Skip Sunday records from counting
//       if (isSunday(record.date)) {
//         // Still add the record for display but don't count it
//         summaryMap[studentSrn].attendanceRecords.push({
//           _id: record._id,
//           date: record.date || "N/A",
//           status: record.status || "N/A",
//           isAttendanceMarked: record.isAttendanceMarked || false,
//           absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//           comments: record.comments || null,
//           isVerifiedByTA: record.isVerifiedByTA || false,
//           originalStatus: record.originalStatus || null,
//           verifiedByTAName: record.verifiedByTAName || null,
//           isSunday: true // Mark as Sunday
//         });
//         return; // Don't count Sundays in totals
//       }
      
//       // Count non-Sunday records
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
      
//       summaryMap[studentSrn].attendanceRecords.push({
//         _id: record._id,
//         date: record.date || "N/A",
//         status: record.status || "N/A",
//         isAttendanceMarked: record.isAttendanceMarked || false,
//         absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//         comments: record.comments || null,
//         isVerifiedByTA: record.isVerifiedByTA || false,
//         originalStatus: record.originalStatus || null,
//         verifiedByTAName: record.verifiedByTAName || null,
//         isSunday: false // Mark as not Sunday
//       });
//     });
    
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
//   };

//   // 🔘 Handle immediate attendance toggle
//   const handleToggleAttendance = async (recordId, studentSrn, studentIndex, recordIndex, currentStatus, isSundayRecord) => {
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    
//     // Don't allow toggling for Sunday records
//     if (isSundayRecord) {
//       alert("Cannot update attendance for Sundays");
//       return;
//     }
    
//     // Set updating state for this specific record
//     setUpdatingId(recordId);
//     setIsUpdating(true);

//     try {
//       // Update UI immediately (optimistic update)
//       const updatedStudentSummary = [...studentSummary];
//       const student = updatedStudentSummary[studentIndex];
//       const attendanceRecord = student.attendanceRecords[recordIndex];
      
//       // Store previous values for rollback
//       const previousStatus = attendanceRecord.status;
//       const previousPresentCount = student.presentCount;
//       const previousAbsentCount = student.absentCount;
      
//       // Update record status
//       attendanceRecord.status = newStatus;
      
//       // Update counts for non-Sunday records
//       if (!attendanceRecord.isSunday) {
//         if (newStatus === "Present") {
//           student.presentCount += 1;
//           student.absentCount -= 1;
//         } else {
//           student.presentCount -= 1;
//           student.absentCount += 1;
//         }
//       }
      
//       // Update state immediately
//       setStudentSummary(updatedStudentSummary);

//       // Call API to update backend
//       const updateData = {
//         _id: recordId,
//         status: newStatus
//       };

//       const response = await UpdateAttendanceStatus(updateData);

//       if (!response.status) {
//         // Rollback if API fails
//         const rollbackStudentSummary = [...studentSummary];
//         const rollbackStudent = rollbackStudentSummary[studentIndex];
//         const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
        
//         rollbackRecord.status = previousStatus;
//         rollbackStudent.presentCount = previousPresentCount;
//         rollbackStudent.absentCount = previousAbsentCount;
        
//         setStudentSummary(rollbackStudentSummary);
//         alert(response.message || "Failed to update attendance");
//       }
      
//     } catch (error) {
//       console.error("Error updating attendance:", error);
      
//       // Refresh data from server to get correct state
//       await handleSubmit();
//       alert("Failed to update attendance. Please try again.");
      
//     } finally {
//       setIsUpdating(false);
//       setUpdatingId(null);
//     }
//   };

//   // 🔘 Format date to dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "N/A") return "N/A";
    
//     try {
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Invalid Date";
//     }
//   };

//   // 🔘 Get day name from date
//   const getDayName = (dateString) => {
//     if (!dateString || dateString === "N/A") return "";
//     try {
//       const date = new Date(dateString);
//       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       return days[date.getDay()];
//     } catch (error) {
//       return "";
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//     }
//   }, [userData]);

//   return (
//     <>
//       <br />
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={3}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={3}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Col>
//       </Row>

//       {/* 🔽 Loading State */}
//       {isLoading && (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading attendance data...</p>
//         </div>
//       )}

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
//       {!isLoading && studentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">Student Attendance Summary - {month} {year}</h5>
//           </Card.Header>
//           <Card.Body>
//             <Accordion flush>
//               {studentSummary.map((student, studentIndex) => {
//                 // Calculate total days as present + absent (excluding Sundays)
//                 const totalWorkingDays = student.presentCount + student.absentCount;
//                 const attendancePercentage = totalWorkingDays > 0 
//                   ? Math.round((student.presentCount / totalWorkingDays) * 100)
//                   : 0;
                
//                 const attendanceRecords = student.attendanceRecords || [];
                
//                 return (
//                   <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
//                     <Accordion.Header>
//                       <Container fluid>
//                         <Row className="align-items-center">
//                           <Col md={2}>
//                             <strong>{student.studentSrn}</strong>
//                           </Col>
//                           <Col md={2}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={1}>
//                             Class {student.class}
//                           </Col>
//                           <Col md={1}>
//                             {student.rollNo}
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="success">{student.presentCount} Present</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="danger">{student.absentCount} Absent</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="info">{totalWorkingDays} Days</Badge>
//                           </Col>
//                           <Col md={2}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}% Attendance
//                             </Badge>
//                           </Col>
//                         </Row>
//                       </Container>
//                     </Accordion.Header>
//                     <Accordion.Body>
//                       {/* 🔽 Student Details */}
//                       <Row className="mb-3">
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Student Information</Card.Title>
//                               <Row>
//                                 <Col md={6}>
//                                   <p><strong>SRN:</strong> {student.studentSrn}</p>
//                                   <p><strong>Name:</strong> {student.studentName}</p>
//                                   <p><strong>Class:</strong> {student.class}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p><strong>Roll No:</strong> {student.rollNo}</p>
//                                   <p><strong>Center:</strong> {student.center}</p>
//                                   <p><strong>District:</strong> {student.district}</p>
//                                 </Col>
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Attendance Summary</Card.Title>
//                               <Row>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-success">{student.presentCount}</div>
//                                   <p className="mb-0">Present</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-danger">{student.absentCount}</div>
//                                   <p className="mb-0">Absent</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-primary">{totalWorkingDays}</div>
//                                   <p className="mb-0">Total Working Days</p>
//                                 </Col>
//                               </Row>
//                               <div className="text-center mt-2">
//                                 <Badge 
//                                   bg={
//                                     attendancePercentage >= 75 ? "success" :
//                                     attendancePercentage >= 50 ? "warning" : "danger"
//                                   }
//                                   className="px-3 py-2"
//                                 >
//                                   <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
//                                 </Badge>
//                               </div>
//                               <div className="text-center mt-2">
//                                 <small className="text-muted">
//                                   *Excluding Sundays from calculations
//                                 </small>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       </Row>
                      
//                       {/* 🔽 Daily Attendance Records */}
//                       <h5 className="mb-3">Daily Attendance Records</h5>
//                       {attendanceRecords.length > 0 ? (
//                         <Table striped bordered hover responsive size="sm">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Day</th>
//                               <th>Status</th>
//                               <th>Toggle Attendance</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {attendanceRecords.map((record, recordIndex) => {
//                               const isUpdatingThisRecord = updatingId === record._id;
//                               const dayName = getDayName(record.date);
//                               const isSundayRecord = record.isSunday || dayName === 'Sun';
                              
//                               return (
//                                 <tr 
//                                   key={recordIndex}
//                                   className={isSundayRecord ? "table-secondary" : ""}
//                                 >
//                                   <td>
//                                     {formatDate(record.date)}
//                                   </td>
//                                   <td>
//                                     <span className={isSundayRecord ? "text-danger fw-bold" : ""}>
//                                       {dayName}
//                                       {isSundayRecord && " (Holiday)"}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <Badge 
//                                       bg={record.status === "Present" ? "success" : "danger"}
//                                       className="px-3"
//                                     >
//                                       {record.status}
//                                       {isUpdatingThisRecord && (
//                                         <span className="ms-2 spinner-border spinner-border-sm" role="status">
//                                           <span className="visually-hidden">Updating...</span>
//                                         </span>
//                                       )}
//                                     </Badge>
//                                   </td>
//                                   <td>
//                                     {isSundayRecord ? (
//                                       <div className="text-muted">
//                                         <small>No attendance on Sundays</small>
//                                       </div>
//                                     ) : (
//                                       <>
//                                         <div className="d-flex align-items-center">
//                                           <Form.Check 
//                                             type="switch"
//                                             id={`switch-${record._id}`}
//                                             label={record.status === "Present" ? "Present" : "Absent"}
//                                             checked={record.status === "Present"}
//                                             onChange={() => handleToggleAttendance(
//                                               record._id, 
//                                               student.studentSrn, 
//                                               studentIndex, 
//                                               recordIndex,
//                                               record.status,
//                                               isSundayRecord
//                                             )}
//                                             disabled={(isUpdating && updatingId !== record._id) || isSundayRecord}
//                                             className="me-3"
//                                           />
//                                           <div className="text-muted">
//                                             <small>
//                                               {record.status === "Present" ? "Switch to Absent" : "Switch to Present"}
//                                             </small>
//                                           </div>
//                                         </div>
//                                         {isUpdatingThisRecord && (
//                                           <div className="mt-1">
//                                             <small className="text-info">Updating...</small>
//                                           </div>
//                                         )}
//                                       </>
//                                     )}
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </Table>
//                       ) : (
//                         <div className="alert alert-warning">
//                           No attendance records found for this student.
//                         </div>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {studentSummary.length} student(s) • 
//               Total Present: {studentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {studentSummary.reduce((sum, student) => sum + student.absentCount, 0)} •
//               *Excluding Sundays from all calculations
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 No Data Message */}
//       {!isLoading && studentSummary.length === 0 && attendanceData.length === 0 && month && year && (
//         <Card className="mt-4">
//           <Card.Body className="text-center">
//             <h5>No attendance data found for {month} {year}</h5>
//             <p>Please select a different month/year or check if data exists for the selected period.</p>
//           </Card.Body>
//         </Card>
//       )}
//     </>
//   );
// };









// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge,
//   Modal
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
// import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [selectedClass, setSelectedClass] = useState(""); // 🔽 New state for class filter
//   const [availableClasses, setAvailableClasses] = useState([]); // 🔽 Available classes from userData
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // 🔽 State for updating
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);

//   // 🧠 Function to check if a date is Sunday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//   const isSunday = (dateString) => {
//     if (!dateString || dateString === "N/A") return false;
//     try {
//       const date = new Date(dateString);
//       return date.getDay() === 0; // 0 is Sunday
//     } catch (error) {
//       console.error("Error checking day:", error);
//       return false;
//     }
//   };

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = selectedClass ? [selectedClass] : userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       setIsLoading(true);
//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       setAttendanceData(response.data.data || []);
//       calculateStudentSummary(response.data.data || []);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     if (!data || !Array.isArray(data)) {
//       console.log("No data or invalid data format");
//       setStudentSummary([]);
//       return;
//     }

//     const summaryMap = {};
    
//     data.forEach(record => {
//       if (!record || !record.studentSrn) return;
      
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName || "N/A",
//           class: record.class || "N/A",
//           rollNo: record.rollNo || "N/A",
//           center: record.center || "N/A",
//           district: record.district || "N/A",
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0,
//           attendanceRecords: []
//         };
//       }
      
//       // Skip Sunday records from counting
//       if (isSunday(record.date)) {
//         // Still add the record for display but don't count it
//         summaryMap[studentSrn].attendanceRecords.push({
//           _id: record._id,
//           date: record.date || "N/A",
//           status: record.status || "N/A",
//           isAttendanceMarked: record.isAttendanceMarked || false,
//           absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//           comments: record.comments || null,
//           isVerifiedByTA: record.isVerifiedByTA || false,
//           originalStatus: record.originalStatus || null,
//           verifiedByTAName: record.verifiedByTAName || null,
//           isSunday: true // Mark as Sunday
//         });
//         return; // Don't count Sundays in totals
//       }
      
//       // Count non-Sunday records
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
      
//       summaryMap[studentSrn].attendanceRecords.push({
//         _id: record._id,
//         date: record.date || "N/A",
//         status: record.status || "N/A",
//         isAttendanceMarked: record.isAttendanceMarked || false,
//         absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//         comments: record.comments || null,
//         isVerifiedByTA: record.isVerifiedByTA || false,
//         originalStatus: record.originalStatus || null,
//         verifiedByTAName: record.verifiedByTAName || null,
//         isSunday: false // Mark as not Sunday
//       });
//     });
    
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
//   };

//   // 🔘 Handle immediate attendance toggle
//   const handleToggleAttendance = async (recordId, studentSrn, studentIndex, recordIndex, currentStatus, isSundayRecord) => {
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    
//     // Don't allow toggling for Sunday records
//     if (isSundayRecord) {
//       alert("Cannot update attendance for Sundays");
//       return;
//     }
    
//     // Set updating state for this specific record
//     setUpdatingId(recordId);
//     setIsUpdating(true);

//     try {
//       // Update UI immediately (optimistic update)
//       const updatedStudentSummary = [...studentSummary];
//       const student = updatedStudentSummary[studentIndex];
//       const attendanceRecord = student.attendanceRecords[recordIndex];
      
//       // Store previous values for rollback
//       const previousStatus = attendanceRecord.status;
//       const previousPresentCount = student.presentCount;
//       const previousAbsentCount = student.absentCount;
      
//       // Update record status
//       attendanceRecord.status = newStatus;
      
//       // Update counts for non-Sunday records
//       if (!attendanceRecord.isSunday) {
//         if (newStatus === "Present") {
//           student.presentCount += 1;
//           student.absentCount -= 1;
//         } else {
//           student.presentCount -= 1;
//           student.absentCount += 1;
//         }
//       }
      
//       // Update state immediately
//       setStudentSummary(updatedStudentSummary);

//       // Call API to update backend
//       const updateData = {
//         _id: recordId,
//         status: newStatus
//       };

//       const response = await UpdateAttendanceStatus(updateData);

//       if (!response.status) {
//         // Rollback if API fails
//         const rollbackStudentSummary = [...studentSummary];
//         const rollbackStudent = rollbackStudentSummary[studentIndex];
//         const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
        
//         rollbackRecord.status = previousStatus;
//         rollbackStudent.presentCount = previousPresentCount;
//         rollbackStudent.absentCount = previousAbsentCount;
        
//         setStudentSummary(rollbackStudentSummary);
//         alert(response.message || "Failed to update attendance");
//       }
      
//     } catch (error) {
//       console.error("Error updating attendance:", error);
      
//       // Refresh data from server to get correct state
//       await handleSubmit();
//       alert("Failed to update attendance. Please try again.");
      
//     } finally {
//       setIsUpdating(false);
//       setUpdatingId(null);
//     }
//   };

//   // 🔘 Format date to dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "N/A") return "N/A";
    
//     try {
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Invalid Date";
//     }
//   };

//   // 🔘 Get day name from date
//   const getDayName = (dateString) => {
//     if (!dateString || dateString === "N/A") return "";
//     try {
//       const date = new Date(dateString);
//       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       return days[date.getDay()];
//     } catch (error) {
//       return "";
//     }
//   };

//   // 🔘 Extract unique classes from userData
//   useEffect(() => {
//     if (userData?.userAccess?.classId) {
//       const classes = userData.userAccess.classId;
//       setAvailableClasses(classes);
//       // If only one class is available, select it by default
//       if (classes.length === 1) {
//         setSelectedClass(classes[0]);
//       }
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//       console.log("Available Classes:", userData?.userAccess?.classId);
//     }
//   }, [userData]);

//   return (
//     <>
//       <br />
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={2}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         {/* 🔽 Class Filter */}
//         <Col md={2}>
//           <Form.Select 
//             value={selectedClass} 
//             onChange={(e) => setSelectedClass(e.target.value)}
//           >
//             <option value="">All Classes</option>
//             {availableClasses.map((classId, index) => (
//               <option key={index} value={classId}>
//                 Class {classId}
//               </option>
//             ))}
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Col>
//       </Row>

//       {/* 🔽 Selected Filters Info */}
//       {selectedClass && (
//         <Row className="mt-2">
//           <Col>
//             <Badge bg="info" className="p-2">
//               Filtering by: Class {selectedClass}
//             </Badge>
//           </Col>
//         </Row>
//       )}

//       {/* 🔽 Loading State */}
//       {isLoading && (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading attendance data...</p>
//         </div>
//       )}

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
//       {!isLoading && studentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">
//               Student Attendance Summary - {month} {year}
//               {selectedClass && ` | Class ${selectedClass}`}
//             </h5>
//           </Card.Header>
//           <Card.Body>
//             <Accordion flush>
//               {studentSummary.map((student, studentIndex) => {
//                 // Calculate total days as present + absent (excluding Sundays)
//                 const totalWorkingDays = student.presentCount + student.absentCount;
//                 const attendancePercentage = totalWorkingDays > 0 
//                   ? Math.round((student.presentCount / totalWorkingDays) * 100)
//                   : 0;
                
//                 const attendanceRecords = student.attendanceRecords || [];
                
//                 return (
//                   <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
//                     <Accordion.Header>
//                       <Container fluid>
//                         <Row className="align-items-center">
//                           <Col md={2}>
//                             <strong>{student.studentSrn}</strong>
//                           </Col>
//                           <Col md={2}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={1}>
//                             Class {student.class}
//                           </Col>
//                           <Col md={1}>
//                             {student.rollNo}
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="success">{student.presentCount} Present</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="danger">{student.absentCount} Absent</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="info">{totalWorkingDays} Days</Badge>
//                           </Col>
//                           <Col md={2}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}% Attendance
//                             </Badge>
//                           </Col>
//                         </Row>
//                       </Container>
//                     </Accordion.Header>
//                     <Accordion.Body>
//                       {/* 🔽 Student Details */}
//                       <Row className="mb-3">
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Student Information</Card.Title>
//                               <Row>
//                                 <Col md={6}>
//                                   <p><strong>SRN:</strong> {student.studentSrn}</p>
//                                   <p><strong>Name:</strong> {student.studentName}</p>
//                                   <p><strong>Class:</strong> {student.class}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p><strong>Roll No:</strong> {student.rollNo}</p>
//                                   <p><strong>Center:</strong> {student.center}</p>
//                                   <p><strong>District:</strong> {student.district}</p>
//                                 </Col>
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Attendance Summary</Card.Title>
//                               <Row>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-success">{student.presentCount}</div>
//                                   <p className="mb-0">Present</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-danger">{student.absentCount}</div>
//                                   <p className="mb-0">Absent</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-primary">{totalWorkingDays}</div>
//                                   <p className="mb-0">Total Working Days</p>
//                                 </Col>
//                               </Row>
//                               <div className="text-center mt-2">
//                                 <Badge 
//                                   bg={
//                                     attendancePercentage >= 75 ? "success" :
//                                     attendancePercentage >= 50 ? "warning" : "danger"
//                                   }
//                                   className="px-3 py-2"
//                                 >
//                                   <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
//                                 </Badge>
//                               </div>
//                               <div className="text-center mt-2">
//                                 <small className="text-muted">
//                                   *Excluding Sundays from calculations
//                                 </small>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       </Row>
                      
//                       {/* 🔽 Daily Attendance Records */}
//                       <h5 className="mb-3">Daily Attendance Records</h5>
//                       {attendanceRecords.length > 0 ? (
//                         <Table striped bordered hover responsive size="sm">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Day</th>
//                               <th>Status</th>
//                               <th>Toggle Attendance</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {attendanceRecords.map((record, recordIndex) => {
//                               const isUpdatingThisRecord = updatingId === record._id;
//                               const dayName = getDayName(record.date);
//                               const isSundayRecord = record.isSunday || dayName === 'Sun';
                              
//                               return (
//                                 <tr 
//                                   key={recordIndex}
//                                   className={isSundayRecord ? "table-secondary" : ""}
//                                 >
//                                   <td>
//                                     {formatDate(record.date)}
//                                   </td>
//                                   <td>
//                                     <span className={isSundayRecord ? "text-danger fw-bold" : ""}>
//                                       {dayName}
//                                       {isSundayRecord && " (Holiday)"}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <Badge 
//                                       bg={record.status === "Present" ? "success" : "danger"}
//                                       className="px-3"
//                                     >
//                                       {record.status}
//                                       {isUpdatingThisRecord && (
//                                         <span className="ms-2 spinner-border spinner-border-sm" role="status">
//                                           <span className="visually-hidden">Updating...</span>
//                                         </span>
//                                       )}
//                                     </Badge>
//                                   </td>
//                                   <td>
//                                     {isSundayRecord ? (
//                                       <div className="text-muted">
//                                         <small>No attendance on Sundays</small>
//                                       </div>
//                                     ) : (
//                                       <>
//                                         <div className="d-flex align-items-center">
//                                           <Form.Check 
//                                             type="switch"
//                                             id={`switch-${record._id}`}
//                                             label={record.status === "Present" ? "Present" : "Absent"}
//                                             checked={record.status === "Present"}
//                                             onChange={() => handleToggleAttendance(
//                                               record._id, 
//                                               student.studentSrn, 
//                                               studentIndex, 
//                                               recordIndex,
//                                               record.status,
//                                               isSundayRecord
//                                             )}
//                                             disabled={(isUpdating && updatingId !== record._id) || isSundayRecord}
//                                             className="me-3"
//                                           />
//                                           <div className="text-muted">
//                                             <small>
//                                               {record.status === "Present" ? "Switch to Absent" : "Switch to Present"}
//                                             </small>
//                                           </div>
//                                         </div>
//                                         {isUpdatingThisRecord && (
//                                           <div className="mt-1">
//                                             <small className="text-info">Updating...</small>
//                                           </div>
//                                         )}
//                                       </>
//                                     )}
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </Table>
//                       ) : (
//                         <div className="alert alert-warning">
//                           No attendance records found for this student.
//                         </div>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {studentSummary.length} student(s) • 
//               Total Present: {studentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {studentSummary.reduce((sum, student) => sum + student.absentCount, 0)} •
//               *Excluding Sundays from all calculations
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 No Data Message */}
//       {!isLoading && studentSummary.length === 0 && attendanceData.length === 0 && month && year && (
//         <Card className="mt-4">
//           <Card.Body className="text-center">
//             <h5>No attendance data found for {month} {year}{selectedClass && ` in Class ${selectedClass}`}</h5>
//             <p>Please select a different month/year/class or check if data exists for the selected period.</p>
//           </Card.Body>
//         </Card>
//       )}
//     </>
//   );
// };








// import React, { useState, useContext, useEffect } from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge,
//   Modal
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
// import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

// export const TaVerification = () => {

//   const { userData } = useContext(UserContext);

//   // 🔽 Month & Year state
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [selectedClass, setSelectedClass] = useState(""); // 🔽 New state for class filter
//   const [availableClasses, setAvailableClasses] = useState([]); // 🔽 Available classes from userData
  
//   // 🔽 New state to store attendance data and student summary
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [studentSummary, setStudentSummary] = useState([]);
//   const [sortedStudentSummary, setSortedStudentSummary] = useState([]); // 🔽 Sorted student summary
//   const [isLoading, setIsLoading] = useState(false);
  
//   // 🔽 State for updating
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);

//   // 🧠 Function to check if a date is Sunday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//   const isSunday = (dateString) => {
//     if (!dateString || dateString === "N/A") return false;
//     try {
//       const date = new Date(dateString);
//       return date.getDay() === 0; // 0 is Sunday
//     } catch (error) {
//       console.error("Error checking day:", error);
//       return false;
//     }
//   };

//   // 🧠 Build req.body from userData (UNCHANGED)
//   const buildReqBody = () => {
//     if (!userData?.userAccess) return null;

//     const classIds = selectedClass ? [selectedClass] : userData.userAccess.classId || [];
//     const schoolIds = [];

//     userData.userAccess.region?.forEach(region => {
//       region.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });

//     return {
//       classIds,
//       schoolIds
//     };
//   };

//   // 🔘 Submit handler
//   const handleSubmit = async () => {
//     try {
//       if (!month || !year) {
//         alert("Please select month and year");
//         return;
//       }

//       setIsLoading(true);
//       const baseReqBody = buildReqBody();

//       const reqBody = {
//         ...baseReqBody,
//         month,
//         year
//       };

//       console.log("FINAL REQ BODY 👉", reqBody);

//       const response = await GetStudentAttendanceDashboard(reqBody);
//       console.log("Dashboard Response 👉", response.data.data);
      
//       setAttendanceData(response.data.data || []);
//       calculateStudentSummary(response.data.data || []);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🧠 Function to calculate student-wise attendance summary
//   const calculateStudentSummary = (data) => {
//     if (!data || !Array.isArray(data)) {
//       console.log("No data or invalid data format");
//       setStudentSummary([]);
//       setSortedStudentSummary([]);
//       return;
//     }

//     const summaryMap = {};
    
//     data.forEach(record => {
//       if (!record || !record.studentSrn) return;
      
//       const studentSrn = record.studentSrn;
      
//       if (!summaryMap[studentSrn]) {
//         summaryMap[studentSrn] = {
//           studentSrn: studentSrn,
//           studentName: record.studentName || "N/A",
//           class: record.class || "N/A",
//           rollNo: record.rollNo || "N/A",
//           center: record.center || "N/A",
//           district: record.district || "N/A",
//           presentCount: 0,
//           absentCount: 0,
//           totalRecords: 0,
//           attendanceRecords: []
//         };
//       }
      
//       // Skip Sunday records from counting
//       if (isSunday(record.date)) {
//         // Still add the record for display but don't count it
//         summaryMap[studentSrn].attendanceRecords.push({
//           _id: record._id,
//           date: record.date || "N/A",
//           status: record.status || "N/A",
//           isAttendanceMarked: record.isAttendanceMarked || false,
//           absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//           comments: record.comments || null,
//           isVerifiedByTA: record.isVerifiedByTA || false,
//           originalStatus: record.originalStatus || null,
//           verifiedByTAName: record.verifiedByTAName || null,
//           isSunday: true // Mark as Sunday
//         });
//         return; // Don't count Sundays in totals
//       }
      
//       // Count non-Sunday records
//       if (record.status === "Present") {
//         summaryMap[studentSrn].presentCount += 1;
//       } else if (record.status === "Absent") {
//         summaryMap[studentSrn].absentCount += 1;
//       }
      
//       summaryMap[studentSrn].totalRecords += 1;
      
//       summaryMap[studentSrn].attendanceRecords.push({
//         _id: record._id,
//         date: record.date || "N/A",
//         status: record.status || "N/A",
//         isAttendanceMarked: record.isAttendanceMarked || false,
//         absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
//         comments: record.comments || null,
//         isVerifiedByTA: record.isVerifiedByTA || false,
//         originalStatus: record.originalStatus || null,
//         verifiedByTAName: record.verifiedByTAName || null,
//         isSunday: false // Mark as not Sunday
//       });
//     });
    
//     const summaryArray = Object.values(summaryMap);
//     setStudentSummary(summaryArray);
    
//     // 🔽 Sort the student summary by student name (case-insensitive)
//     const sortedArray = [...summaryArray].sort((a, b) => {
//       const nameA = a.studentName?.toLowerCase() || "";
//       const nameB = b.studentName?.toLowerCase() || "";
//       return nameA.localeCompare(nameB);
//     });
    
//     setSortedStudentSummary(sortedArray);
//   };

//   // 🔘 Handle immediate attendance toggle
//   const handleToggleAttendance = async (recordId, studentSrn, studentIndex, recordIndex, currentStatus, isSundayRecord) => {
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    
//     // Don't allow toggling for Sunday records
//     if (isSundayRecord) {
//       alert("Cannot update attendance for Sundays");
//       return;
//     }
    
//     // Set updating state for this specific record
//     setUpdatingId(recordId);
//     setIsUpdating(true);

//     try {
//       // Update UI immediately (optimistic update)
//       const updatedStudentSummary = [...sortedStudentSummary];
//       const student = updatedStudentSummary[studentIndex];
//       const attendanceRecord = student.attendanceRecords[recordIndex];
      
//       // Store previous values for rollback
//       const previousStatus = attendanceRecord.status;
//       const previousPresentCount = student.presentCount;
//       const previousAbsentCount = student.absentCount;
      
//       // Update record status
//       attendanceRecord.status = newStatus;
      
//       // Update counts for non-Sunday records
//       if (!attendanceRecord.isSunday) {
//         if (newStatus === "Present") {
//           student.presentCount += 1;
//           student.absentCount -= 1;
//         } else {
//           student.presentCount -= 1;
//           student.absentCount += 1;
//         }
//       }
      
//       // Update state immediately
//       setSortedStudentSummary(updatedStudentSummary);

//       // Call API to update backend
//       const updateData = {
//         _id: recordId,
//         status: newStatus
//       };

//       const response = await UpdateAttendanceStatus(updateData);

//       if (!response.status) {
//         // Rollback if API fails
//         const rollbackStudentSummary = [...sortedStudentSummary];
//         const rollbackStudent = rollbackStudentSummary[studentIndex];
//         const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
        
//         rollbackRecord.status = previousStatus;
//         rollbackStudent.presentCount = previousPresentCount;
//         rollbackStudent.absentCount = previousAbsentCount;
        
//         setSortedStudentSummary(rollbackStudentSummary);
//         alert(response.message || "Failed to update attendance");
//       }
      
//     } catch (error) {
//       console.error("Error updating attendance:", error);
      
//       // Refresh data from server to get correct state
//       await handleSubmit();
//       alert("Failed to update attendance. Please try again.");
      
//     } finally {
//       setIsUpdating(false);
//       setUpdatingId(null);
//     }
//   };

//   // 🔘 Format date to dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "N/A") return "N/A";
    
//     try {
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Invalid Date";
//     }
//   };

//   // 🔘 Get day name from date
//   const getDayName = (dateString) => {
//     if (!dateString || dateString === "N/A") return "";
//     try {
//       const date = new Date(dateString);
//       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       return days[date.getDay()];
//     } catch (error) {
//       return "";
//     }
//   };

//   // 🔘 Extract unique classes from userData
//   useEffect(() => {
//     if (userData?.userAccess?.classId) {
//       const classes = userData.userAccess.classId;
//       setAvailableClasses(classes);
//       // If only one class is available, select it by default
//       if (classes.length === 1) {
//         setSelectedClass(classes[0]);
//       }
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (userData) {
//       console.log("USER DATA 👉", userData);
//       console.log("Available Classes:", userData?.userAccess?.classId);
//     }
//   }, [userData]);

//   return (
//     <>
//       <br />
//       <h4>Hello TA Verification</h4>

//       {/* 🔽 FILTER UI */}
//       <Row className="mt-3">
//         <Col md={2}>
//           <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <option value="">Select Month</option>
//             <option value="October">October</option>
//             <option value="November">November</option>
//             <option value="December">December</option>
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="">Select Year</option>
//             <option value="2025">2025</option>
//           </Form.Select>
//         </Col>

//         {/* 🔽 Class Filter */}
//         <Col md={2}>
//           <Form.Select 
//             value={selectedClass} 
//             onChange={(e) => setSelectedClass(e.target.value)}
//           >
//             <option value="">All Classes</option>
//             {availableClasses.map((classId, index) => (
//               <option key={index} value={classId}>
//                 Class {classId}
//               </option>
//             ))}
//           </Form.Select>
//         </Col>

//         <Col md={2}>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Col>
//       </Row>

//       {/* 🔽 Selected Filters Info */}
//       {selectedClass && (
//         <Row className="mt-2">
//           <Col>
//             <Badge bg="info" className="p-2">
//               Filtering by: Class {selectedClass}
//             </Badge>
//           </Col>
//         </Row>
//       )}

//       {/* 🔽 Loading State */}
//       {isLoading && (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading attendance data...</p>
//         </div>
//       )}

//       {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
//       {!isLoading && sortedStudentSummary.length > 0 && (
//         <Card className="mt-4">
//           <Card.Header className="bg-primary text-white">
//             <h5 className="mb-0">
//               Student Attendance Summary - {month} {year}
//               {selectedClass && ` | Class ${selectedClass}`}
//             </h5>
//           </Card.Header>
//           <Card.Body>
//             <Accordion flush>
//               {sortedStudentSummary.map((student, studentIndex) => {
//                 // Calculate total days as present + absent (excluding Sundays)
//                 const totalWorkingDays = student.presentCount + student.absentCount;
//                 const attendancePercentage = totalWorkingDays > 0 
//                   ? Math.round((student.presentCount / totalWorkingDays) * 100)
//                   : 0;
                
//                 const attendanceRecords = student.attendanceRecords || [];
                
//                 return (
//                   <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
//                     <Accordion.Header>
//                       <Container fluid>
//                         <Row className="align-items-center">
//                           <Col md={1}>
//                             <strong>#{studentIndex + 1}</strong>
//                           </Col>
//                           <Col md={2}>
//                             <strong>{student.studentSrn}</strong>
//                           </Col>
//                           <Col md={2}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={1}>
//                             Class {student.class}
//                           </Col>
//                           <Col md={1}>
//                             {student.rollNo}
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="success">{student.presentCount} Present</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="danger">{student.absentCount} Absent</Badge>
//                           </Col>
//                           <Col md={1}>
//                             <Badge bg="info">{totalWorkingDays} Days</Badge>
//                           </Col>
//                           <Col md={2}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}% Attendance
//                             </Badge>
//                           </Col>
//                         </Row>
//                       </Container>
//                     </Accordion.Header>
//                     <Accordion.Body>
//                       {/* 🔽 Student Details */}
//                       <Row className="mb-3">
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Student Information</Card.Title>
//                               <Row>
//                                 <Col md={6}>
//                                   <p><strong>S.No:</strong> {studentIndex + 1}</p>
//                                   <p><strong>SRN:</strong> {student.studentSrn}</p>
//                                   <p><strong>Name:</strong> {student.studentName}</p>
//                                   <p><strong>Class:</strong> {student.class}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p><strong>Roll No:</strong> {student.rollNo}</p>
//                                   <p><strong>Center:</strong> {student.center}</p>
//                                   <p><strong>District:</strong> {student.district}</p>
//                                 </Col>
//                               </Row>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                         <Col md={6}>
//                           <Card>
//                             <Card.Body>
//                               <Card.Title>Attendance Summary</Card.Title>
//                               <Row>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-success">{student.presentCount}</div>
//                                   <p className="mb-0">Present</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-danger">{student.absentCount}</div>
//                                   <p className="mb-0">Absent</p>
//                                 </Col>
//                                 <Col md={4} className="text-center">
//                                   <div className="display-6 text-primary">{totalWorkingDays}</div>
//                                   <p className="mb-0">Total Working Days</p>
//                                 </Col>
//                               </Row>
//                               <div className="text-center mt-2">
//                                 <Badge 
//                                   bg={
//                                     attendancePercentage >= 75 ? "success" :
//                                     attendancePercentage >= 50 ? "warning" : "danger"
//                                   }
//                                   className="px-3 py-2"
//                                 >
//                                   <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
//                                 </Badge>
//                               </div>
//                               <div className="text-center mt-2">
//                                 <small className="text-muted">
//                                   *Excluding Sundays from calculations
//                                 </small>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       </Row>
                      
//                       {/* 🔽 Daily Attendance Records */}
//                       <h5 className="mb-3">Daily Attendance Records</h5>
//                       {attendanceRecords.length > 0 ? (
//                         <Table striped bordered hover responsive size="sm">
//                           <thead>
//                             <tr>
//                               <th>S.No</th>
//                               <th>Date</th>
//                               <th>Day</th>
//                               <th>Status</th>
//                               <th>Toggle Attendance</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {attendanceRecords.map((record, recordIndex) => {
//                               const isUpdatingThisRecord = updatingId === record._id;
//                               const dayName = getDayName(record.date);
//                               const isSundayRecord = record.isSunday || dayName === 'Sun';
                              
//                               return (
//                                 <tr 
//                                   key={recordIndex}
//                                   className={isSundayRecord ? "table-secondary" : ""}
//                                 >
//                                   <td>{recordIndex + 1}</td>
//                                   <td>
//                                     {formatDate(record.date)}
//                                   </td>
//                                   <td>
//                                     <span className={isSundayRecord ? "text-danger fw-bold" : ""}>
//                                       {dayName}
//                                       {isSundayRecord && " (Holiday)"}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <Badge 
//                                       bg={record.status === "Present" ? "success" : "danger"}
//                                       className="px-3"
//                                     >
//                                       {record.status}
//                                       {isUpdatingThisRecord && (
//                                         <span className="ms-2 spinner-border spinner-border-sm" role="status">
//                                           <span className="visually-hidden">Updating...</span>
//                                         </span>
//                                       )}
//                                     </Badge>
//                                   </td>
//                                   <td>
//                                     {isSundayRecord ? (
//                                       <div className="text-muted">
//                                         <small>No attendance on Sundays</small>
//                                       </div>
//                                     ) : (
//                                       <>
//                                         <div className="d-flex align-items-center">
//                                           <Form.Check 
//                                             type="switch"
//                                             id={`switch-${record._id}`}
//                                             label={record.status === "Present" ? "Present" : "Absent"}
//                                             checked={record.status === "Present"}
//                                             onChange={() => handleToggleAttendance(
//                                               record._id, 
//                                               student.studentSrn, 
//                                               studentIndex, 
//                                               recordIndex,
//                                               record.status,
//                                               isSundayRecord
//                                             )}
//                                             disabled={(isUpdating && updatingId !== record._id) || isSundayRecord}
//                                             className="me-3"
//                                           />
//                                           <div className="text-muted">
//                                             <small>
//                                               {record.status === "Present" ? "Switch to Absent" : "Switch to Present"}
//                                             </small>
//                                           </div>
//                                         </div>
//                                         {isUpdatingThisRecord && (
//                                           <div className="mt-1">
//                                             <small className="text-info">Updating...</small>
//                                           </div>
//                                         )}
//                                       </>
//                                     )}
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </Table>
//                       ) : (
//                         <div className="alert alert-warning">
//                           No attendance records found for this student.
//                         </div>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 );
//               })}
//             </Accordion>
//           </Card.Body>
//           <Card.Footer>
//             <small className="text-muted">
//               Showing {sortedStudentSummary.length} student(s) • 
//               Total Present: {sortedStudentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
//               Total Absent: {sortedStudentSummary.reduce((sum, student) => sum + student.absentCount, 0)} •
//               *Excluding Sundays from all calculations
//             </small>
//           </Card.Footer>
//         </Card>
//       )}

//       {/* 🔽 No Data Message */}
//       {!isLoading && sortedStudentSummary.length === 0 && attendanceData.length === 0 && month && year && (
//         <Card className="mt-4">
//           <Card.Body className="text-center">
//             <h5>No attendance data found for {month} {year}{selectedClass && ` in Class ${selectedClass}`}</h5>
//             <p>Please select a different month/year/class or check if data exists for the selected period.</p>
//           </Card.Body>
//         </Card>
//       )}
//     </>
//   );
// };









import React, { useState, useContext, useEffect } from "react";
import {
  ListGroup,
  Accordion,
  Offcanvas,
  Button,
  Container,
  Navbar,
  Card,
  Carousel,
  Form,
  Row,
  Col,
  Table,
  Badge,
  Modal
} from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

export const TaVerification = () => {

  const { userData } = useContext(UserContext);

  // 🔽 Month & Year state
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedClass, setSelectedClass] = useState(""); // 🔽 New state for class filter
  const [availableClasses, setAvailableClasses] = useState([]); // 🔽 Available classes from userData
  
  // 🔽 New state to store attendance data and student summary
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentSummary, setStudentSummary] = useState([]);
  const [sortedStudentSummary, setSortedStudentSummary] = useState([]); // 🔽 Sorted student summary
  const [isLoading, setIsLoading] = useState(false);
  
  // 🔽 State for updating
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // 🧠 Function to check if a date is Sunday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const isSunday = (dateString) => {
    if (!dateString || dateString === "N/A") return false;
    try {
      const date = new Date(dateString);
      return date.getDay() === 0; // 0 is Sunday
    } catch (error) {
      console.error("Error checking day:", error);
      return false;
    }
  };

  // 🧠 Build req.body from userData (UNCHANGED)
  const buildReqBody = () => {
    if (!userData?.userAccess) return null;

    const classIds = selectedClass ? [selectedClass] : userData.userAccess.classId || [];
    const schoolIds = [];

    userData.userAccess.region?.forEach(region => {
      region.blockIds?.forEach(block => {
        block.schoolIds?.forEach(school => {
          if (school.schoolId) {
            schoolIds.push(school.schoolId);
          }
        });
      });
    });

    return {
      classIds,
      schoolIds
    };
  };

  // 🔘 Submit handler
  const handleSubmit = async () => {
    try {
      if (!month || !year) {
        alert("Please select month and year");
        return;
      }

      setIsLoading(true);
      const baseReqBody = buildReqBody();

      const reqBody = {
        ...baseReqBody,
        month,
        year
      };

      console.log("FINAL REQ BODY 👉", reqBody);

      const response = await GetStudentAttendanceDashboard(reqBody);
      console.log("Dashboard Response 👉", response.data.data);
      
      setAttendanceData(response.data.data || []);
      calculateStudentSummary(response.data.data || []);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧠 Function to calculate student-wise attendance summary
  const calculateStudentSummary = (data) => {
    if (!data || !Array.isArray(data)) {
      console.log("No data or invalid data format");
      setStudentSummary([]);
      setSortedStudentSummary([]);
      return;
    }

    const summaryMap = {};
    
    data.forEach(record => {
      if (!record || !record.studentSrn) return;
      
      const studentSrn = record.studentSrn;
      
      if (!summaryMap[studentSrn]) {
        summaryMap[studentSrn] = {
          studentSrn: studentSrn,
          studentName: record.studentName || "N/A",
          fatherName: record.fatherName || "N/A", // 🔽 Add fatherName field with proper fallback
          class: record.class || "N/A",
          rollNo: record.rollNo || "N/A",
          center: record.center || "N/A",
          district: record.district || "N/A",
          presentCount: 0,
          absentCount: 0,
          totalRecords: 0,
          attendanceRecords: []
        };
      }
      
      // Skip Sunday records from counting
      if (isSunday(record.date)) {
        // Still add the record for display but don't count it
        summaryMap[studentSrn].attendanceRecords.push({
          _id: record._id,
          date: record.date || "N/A",
          status: record.status || "N/A",
          isAttendanceMarked: record.isAttendanceMarked || false,
          absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
          comments: record.comments || null,
          isVerifiedByTA: record.isVerifiedByTA || false,
          originalStatus: record.originalStatus || null,
          verifiedByTAName: record.verifiedByTAName || null,
          isSunday: true // Mark as Sunday
        });
        return; // Don't count Sundays in totals
      }
      
      // Count non-Sunday records
      if (record.status === "Present") {
        summaryMap[studentSrn].presentCount += 1;
      } else if (record.status === "Absent") {
        summaryMap[studentSrn].absentCount += 1;
      }
      
      summaryMap[studentSrn].totalRecords += 1;
      
      summaryMap[studentSrn].attendanceRecords.push({
        _id: record._id,
        date: record.date || "N/A",
        status: record.status || "N/A",
        isAttendanceMarked: record.isAttendanceMarked || false,
        absenteeCallingStatus: record.absenteeCallingStatus || "N/A",
        comments: record.comments || null,
        isVerifiedByTA: record.isVerifiedByTA || false,
        originalStatus: record.originalStatus || null,
        verifiedByTAName: record.verifiedByTAName || null,
        isSunday: false // Mark as not Sunday
      });
    });
    
    const summaryArray = Object.values(summaryMap);
    setStudentSummary(summaryArray);
    
    // 🔽 Sort the student summary by student name (case-insensitive)
    const sortedArray = [...summaryArray].sort((a, b) => {
      const nameA = a.studentName?.toLowerCase() || "";
      const nameB = b.studentName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
    
    setSortedStudentSummary(sortedArray);
    
    // Debug: Check if fatherName exists in the data
    console.log("Sample student with fatherName:", sortedArray[0]?.studentName, "Father:", sortedArray[0]?.fatherName);
    console.log("First few records with fatherName:", data.slice(0, 3).map(r => ({
      name: r.studentName,
      fatherName: r.fatherName,
      hasFatherName: !!r.fatherName
    })));
  };

  // 🔘 Handle immediate attendance toggle
  const handleToggleAttendance = async (recordId, studentSrn, studentIndex, recordIndex, currentStatus, isSundayRecord) => {
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    
    // Don't allow toggling for Sunday records
    if (isSundayRecord) {
      alert("Cannot update attendance for Sundays");
      return;
    }
    
    // Set updating state for this specific record
    setUpdatingId(recordId);
    setIsUpdating(true);

    try {
      // Update UI immediately (optimistic update)
      const updatedStudentSummary = [...sortedStudentSummary];
      const student = updatedStudentSummary[studentIndex];
      const attendanceRecord = student.attendanceRecords[recordIndex];
      
      // Store previous values for rollback
      const previousStatus = attendanceRecord.status;
      const previousPresentCount = student.presentCount;
      const previousAbsentCount = student.absentCount;
      
      // Update record status
      attendanceRecord.status = newStatus;
      
      // Update counts for non-Sunday records
      if (!attendanceRecord.isSunday) {
        if (newStatus === "Present") {
          student.presentCount += 1;
          student.absentCount -= 1;
        } else {
          student.presentCount -= 1;
          student.absentCount += 1;
        }
      }
      
      // Update state immediately
      setSortedStudentSummary(updatedStudentSummary);

      // Call API to update backend
      const updateData = {
        _id: recordId,
        status: newStatus
      };

      const response = await UpdateAttendanceStatus(updateData);

      if (!response.status) {
        // Rollback if API fails
        const rollbackStudentSummary = [...sortedStudentSummary];
        const rollbackStudent = rollbackStudentSummary[studentIndex];
        const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
        
        rollbackRecord.status = previousStatus;
        rollbackStudent.presentCount = previousPresentCount;
        rollbackStudent.absentCount = previousAbsentCount;
        
        setSortedStudentSummary(rollbackStudentSummary);
        alert(response.message || "Failed to update attendance");
      }
      
    } catch (error) {
      console.error("Error updating attendance:", error);
      
      // Refresh data from server to get correct state
      await handleSubmit();
      alert("Failed to update attendance. Please try again.");
      
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
    }
  };

  // 🔘 Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // 🔘 Get day name from date
  const getDayName = (dateString) => {
    if (!dateString || dateString === "N/A") return "";
    try {
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    } catch (error) {
      return "";
    }
  };

  // 🔘 Extract unique classes from userData
  useEffect(() => {
    if (userData?.userAccess?.classId) {
      const classes = userData.userAccess.classId;
      setAvailableClasses(classes);
      // If only one class is available, select it by default
      if (classes.length === 1) {
        setSelectedClass(classes[0]);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      console.log("USER DATA 👉", userData);
      console.log("Available Classes:", userData?.userAccess?.classId);
    }
  }, [userData]);

  return (
    <>
      <br />
      <h4>Attendance Verification</h4>

      {/* 🔽 FILTER UI */}
      <Row className="mt-3">
        <Col md={2}>
          <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="2025">2025</option>
          </Form.Select>
        </Col>

        {/* 🔽 Class Filter */}
        <Col md={2}>
          <Form.Select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {availableClasses.map((classId, index) => (
              <option key={index} value={classId}>
                Class {classId}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </Col>
      </Row>

      {/* 🔽 Selected Filters Info */}
      {selectedClass && (
        <Row className="mt-2">
          <Col>
            <Badge bg="info" className="p-2">
              Filtering by: Class {selectedClass}
            </Badge>
          </Col>
        </Row>
      )}

      {/* 🔽 Loading State */}
      {isLoading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading attendance data...</p>
        </div>
      )}

      {/* 🔽 STUDENT ATTENDANCE DASHBOARD WITH ACCORDION */}
      {!isLoading && sortedStudentSummary.length > 0 && (
        <Card className="mt-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              Student Attendance Summary - {month} {year}
              {selectedClass && ` | Class ${selectedClass}`}
            </h5>
          </Card.Header>
          <Card.Body>
            <Accordion flush>
              {sortedStudentSummary.map((student, studentIndex) => {
                // Calculate total days as present + absent (excluding Sundays)
                const totalWorkingDays = student.presentCount + student.absentCount;
                const attendancePercentage = totalWorkingDays > 0 
                  ? Math.round((student.presentCount / totalWorkingDays) * 100)
                  : 0;
                
                const attendanceRecords = student.attendanceRecords || [];
                
                return (
                  <Accordion.Item eventKey={studentIndex.toString()} key={studentIndex}>
                    <Accordion.Header>
                      <Container fluid>
                        <Row className="align-items-center">
                          <Col md={1}>
                            <strong>#{studentIndex + 1}</strong>
                          </Col>
                          <Col md={2}>
                            <strong>{student.studentSrn}</strong>
                          </Col>
                          <Col md={3}>
                            {student.studentName}
                          </Col>
                          <Col md={2}>
                            <small>
                              {student.fatherName && student.fatherName !== "N/A" ? student.fatherName : "Not Available"}
                            </small>
                          </Col>
                          <Col md={1}>
                            <Badge bg="success">{student.presentCount} Present</Badge>
                          </Col>
                          <Col md={1}>
                            <Badge bg="danger">{student.absentCount} Absent</Badge>
                          </Col>
                          <Col md={1}>
                            <Badge bg="info">{totalWorkingDays} Days</Badge>
                          </Col>
                          <Col md={1}>
                            <Badge 
                              bg={
                                attendancePercentage >= 75 ? "success" :
                                attendancePercentage >= 50 ? "warning" : "danger"
                              }
                            >
                              {attendancePercentage}%
                            </Badge>
                          </Col>
                        </Row>
                      </Container>
                    </Accordion.Header>
                    <Accordion.Body>
                      {/* 🔽 Student Details */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Student Information</Card.Title>
                              <Row>
                                <Col md={6}>
                                  <p><strong>S.No:</strong> {studentIndex + 1}</p>
                                  <p><strong>SRN:</strong> {student.studentSrn}</p>
                                  <p><strong>Student Name:</strong> {student.studentName}</p>
                                  <p><strong>Father's Name:</strong> {student.fatherName && student.fatherName !== "N/A" ? student.fatherName : "Not Available"}</p>
                                  <p><strong>Class:</strong> {student.class}</p>
                                </Col>
                                <Col md={6}>
                                  <p><strong>Roll No:</strong> {student.rollNo}</p>
                                  <p><strong>Center:</strong> {student.center}</p>
                                  <p><strong>District:</strong> {student.district}</p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Attendance Summary</Card.Title>
                              <Row>
                                <Col md={4} className="text-center">
                                  <div className="display-6 text-success">{student.presentCount}</div>
                                  <p className="mb-0">Present</p>
                                </Col>
                                <Col md={4} className="text-center">
                                  <div className="display-6 text-danger">{student.absentCount}</div>
                                  <p className="mb-0">Absent</p>
                                </Col>
                                <Col md={4} className="text-center">
                                  <div className="display-6 text-primary">{totalWorkingDays}</div>
                                  <p className="mb-0">Total Working Days</p>
                                </Col>
                              </Row>
                              <div className="text-center mt-2">
                                <Badge 
                                  bg={
                                    attendancePercentage >= 75 ? "success" :
                                    attendancePercentage >= 50 ? "warning" : "danger"
                                  }
                                  className="px-3 py-2"
                                >
                                  <h5 className="mb-0">Overall Attendance: {attendancePercentage}%</h5>
                                </Badge>
                              </div>
                              <div className="text-center mt-2">
                                <small className="text-muted">
                                  *Excluding Sundays from calculations
                                </small>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      {/* 🔽 Daily Attendance Records */}
                      <h5 className="mb-3">Daily Attendance Records</h5>
                      {attendanceRecords.length > 0 ? (
                        <Table striped bordered hover responsive size="sm">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Date</th>
                              <th>Day</th>
                              <th>Status</th>
                              <th>Toggle Attendance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceRecords.map((record, recordIndex) => {
                              const isUpdatingThisRecord = updatingId === record._id;
                              const dayName = getDayName(record.date);
                              const isSundayRecord = record.isSunday || dayName === 'Sun';
                              
                              return (
                                <tr 
                                  key={recordIndex}
                                  className={isSundayRecord ? "table-secondary" : ""}
                                >
                                  <td>{recordIndex + 1}</td>
                                  <td>
                                    {formatDate(record.date)}
                                  </td>
                                  <td>
                                    <span className={isSundayRecord ? "text-danger fw-bold" : ""}>
                                      {dayName}
                                      {isSundayRecord && " (Holiday)"}
                                    </span>
                                  </td>
                                  <td>
                                    <Badge 
                                      bg={record.status === "Present" ? "success" : "danger"}
                                      className="px-3"
                                    >
                                      {record.status}
                                      {isUpdatingThisRecord && (
                                        <span className="ms-2 spinner-border spinner-border-sm" role="status">
                                          <span className="visually-hidden">Updating...</span>
                                        </span>
                                      )}
                                    </Badge>
                                  </td>
                                  <td>
                                    {isSundayRecord ? (
                                      <div className="text-muted">
                                        <small>No attendance on Sundays</small>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="d-flex align-items-center">
                                          <Form.Check 
                                            type="switch"
                                            id={`switch-${record._id}`}
                                            label={record.status === "Present" ? "Present" : "Absent"}
                                            checked={record.status === "Present"}
                                            onChange={() => handleToggleAttendance(
                                              record._id, 
                                              student.studentSrn, 
                                              studentIndex, 
                                              recordIndex,
                                              record.status,
                                              isSundayRecord
                                            )}
                                            disabled={(isUpdating && updatingId !== record._id) || isSundayRecord}
                                            className="me-3"
                                          />
                                          <div className="text-muted">
                                            <small>
                                              {record.status === "Present" ? "Switch to Absent" : "Switch to Present"}
                                            </small>
                                          </div>
                                        </div>
                                        {isUpdatingThisRecord && (
                                          <div className="mt-1">
                                            <small className="text-info">Updating...</small>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="alert alert-warning">
                          No attendance records found for this student.
                        </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
              Showing {sortedStudentSummary.length} student(s) • 
              Total Present: {sortedStudentSummary.reduce((sum, student) => sum + student.presentCount, 0)} • 
              Total Absent: {sortedStudentSummary.reduce((sum, student) => sum + student.absentCount, 0)} •
              *Excluding Sundays from all calculations
            </small>
          </Card.Footer>
        </Card>
      )}

      {/* 🔽 No Data Message */}
      {!isLoading && sortedStudentSummary.length === 0 && attendanceData.length === 0 && month && year && (
        <Card className="mt-4">
          <Card.Body className="text-center">
            <h5>No attendance data found for {month} {year}{selectedClass && ` in Class ${selectedClass}`}</h5>
            <p>Please select a different month/year/class or check if data exists for the selected period.</p>
          </Card.Body>
        </Card>
      )}
    </>
  );
};