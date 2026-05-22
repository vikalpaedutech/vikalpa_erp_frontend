// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, MarkMBStudentAttendance } from "../../service/Student.service";
// import { Container, Card, Table, Button, Badge, Spinner, ToggleButton, ToggleButtonGroup, Row, Col, Alert } from "react-bootstrap";
// import { FaThLarge, FaTable, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext); // Only startDate for single date picker
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
//   const [attendanceStatus, setAttendanceStatus] = useState({}); // Stores 'Present' or 'Absent'
//   const [attendanceLoading, setAttendanceLoading] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null); // Store the selected date object

//   const fetchStudents = async () => {
//     setLoading(true);
//     setError(null);
    
//     // Build request body with single date
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate // Send only startDate (format: "2026-05-08")
//     };

//     console.log("Fetching students with:", reqBody);
    
//     try {
//       const response = await GetMBStudents(reqBody);
//       console.log("Students data:", response.data);
//       console.log("Selected date from API:", response.selectedDate);
      
//       setStudents(response.data || []);
//       setSelectedDate(response.selectedDate || null);
      
//       // Initialize attendance status from API response
//       const initialStatus = {};
//       response.data?.forEach(student => {
//         // Get attendance status from the API response
//         let status = null;
//         if (student.attendanceStatus) {
//           status = student.attendanceStatus;
//         } else if (student.status) {
//           status = student.status;
//         }
        
//         if (status && (status === "Present" || status === "Absent")) {
//           initialStatus[student._id] = status;
//         }
//       });
      
//       console.log("Initial attendance status from API:", initialStatus);
//       setAttendanceStatus(initialStatus);
//     } catch (error) {
//       console.log("Error fetching students:", error);
//       setError("Failed to fetch students. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle attendance marking with API call
//   const handleMarkAttendance = async (student, status) => {
//     setAttendanceLoading(prev => ({
//       ...prev,
//       [student._id]: true
//     }));

//     // Build request body with single date
//     const reqBody = {
//       _id: student._id,
//       status: status,
//       isAttendanceMarked: true,
//       startDate: startDate // Send the selected date from SingleDatePicker
//     };

//     console.log("Marking attendance with:", reqBody);

//     try {
//       const response = await MarkMBStudentAttendance(reqBody);
//       console.log("Attendance marked response:", response);
      
//       if (response.success) {
//         // Update local state with new status
//         setAttendanceStatus(prev => ({
//           ...prev,
//           [student._id]: status
//         }));
        
//         // Also update the student object in students array
//         setStudents(prevStudents => 
//           prevStudents.map(s => 
//             s._id === student._id 
//               ? { ...s, attendanceStatus: status, status: status }
//               : s
//           )
//         );
        
//         // Show success message
//         setSuccessMessage(`Attendance marked as ${status} for ${student.firstName} on ${startDate || 'today'}`);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => {
//           setSuccessMessage(null);
//         }, 3000);
//       } else {
//         setError(`Failed to mark attendance: ${response.message}`);
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError("Failed to mark attendance. Please try again.");
//       setTimeout(() => {
//         setError(null);
//       }, 3000);
//     } finally {
//       setAttendanceLoading(prev => ({
//         ...prev,
//         [student._id]: false
//       }));
//     }
//   };

//   // Toggle between Present and Absent
//   const toggleAttendance = (student) => {
//     const currentStatus = attendanceStatus[student._id];
//     // If no status yet, default to marking Present
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
//     handleMarkAttendance(student, newStatus);
//   };

//   // Fetch students when school, batch, or startDate changes
//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch) {
//       fetchStudents();
//     }
//   }, [schoolContext, batchContext, startDate]); // Only startDate dependency now

//   // Table View
//   const TableView = () => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="mt-3">
//         <thead className="bg-light">
//           <tr>
//             <th>S. No.</th>
//             <th>Student SRN</th>
//             <th>First Name</th>
//             <th>Father's Name</th>
//             {/* <th>Roll Number</th>
//             <th>Class</th> */}
//             <th>Attendance Status</th>
//             {/* <th>Action</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {students.length > 0 ? (
//             students.map((student, index) => {
//               const currentStatus = attendanceStatus[student._id];
//               const isLoading = attendanceLoading[student._id];
//               const isPresent = currentStatus === "Present";
              
//               return (
//                 <tr key={student._id}>
//                   <td>{index + 1}</td>
//                   <td>{student.studentSrn || 'N/A'}</td>
//                   <td>
//                     <strong>{student.firstName || 'N/A'}</strong>
//                     {student.lastName && <span> {student.lastName}</span>}
//                   </td>
//                   <td>{student.fatherName || 'N/A'}</td>
//                   {/* <td>{student.rollNumber || 'N/A'}</td>
//                   <td>{student.classofStudent || 'N/A'}</td> */}
//                   {/* <td>
//                     {currentStatus ? (
//                       <Badge bg={isPresent ? "success" : "danger"}>
//                         {isPresent ? (
//                           <FaCheckCircle className="me-1" /> 
//                         ) : (
//                           <FaTimesCircle className="me-1" />
//                         )}
//                         {currentStatus}
//                       </Badge>
//                     ) : (
//                       <Badge bg="secondary">
//                         <FaClock className="me-1" /> Not Marked
//                       </Badge>
//                     )}
//                   </td> */}
//                   <td>
//                     <Button
//                       variant={isPresent ? "outline-danger" : "outline-success"}
//                       size="sm"
//                       onClick={() => toggleAttendance(student)}
//                       disabled={isLoading}
//                       className="d-flex align-items-center gap-2"
//                     >
//                       {isLoading ? (
//                         <>
//                           <FaSpinner className="spin" /> Updating...
//                         </>
//                       ) : isPresent ? (
//                         <>
//                           <FaUserTimes /> Mark Absent
//                         </>
//                       ) : (
//                         <>
//                           <FaUserCheck /> Mark Present
//                         </>
//                       )}
//                     </Button>
//                    </td>
//                  </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="8" className="text-center text-muted">
//                 No students found for the selected filters and date
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );

//   // Card View
//   const CardView = () => (
//     <Row className="g-3 mt-3">
//       {students.length > 0 ? (
//         students.map((student, index) => {
//           const currentStatus = attendanceStatus[student._id];
//           const isLoading = attendanceLoading[student._id];
//           const isPresent = currentStatus === "Present";
          
//           return (
//             <Col xs={12} md={6} lg={4} key={student._id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Header className={isPresent ? "bg-success text-white" : currentStatus === "Absent" ? "bg-danger text-white" : "bg-primary text-white"}>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <strong>{student.firstName || 'N/A'} {student.lastName || ''}</strong>
//                     <Badge bg="light" className={isPresent ? "text-success" : currentStatus === "Absent" ? "text-danger" : ""}>
//                       #{student.rollNumber || 'N/A'}
//                     </Badge>
//                   </div>
//                 </Card.Header>
//                 <Card.Body>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small className="text-muted">Student SRN:</small>
//                       <p className="mb-0 fw-bold">{student.studentSrn || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small className="text-muted">Father's Name:</small>
//                       <p className="mb-0 fw-bold">{student.fatherName || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small className="text-muted">Class:</small>
//                       <p className="mb-0">{student.classofStudent || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small className="text-muted">Batch:</small>
//                       <p className="mb-0">{student.batch || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col xs={12}>
//                       <small className="text-muted">Status:</small>
//                       <div className="mt-1">
//                         {currentStatus ? (
//                           <Badge bg={isPresent ? "success" : "danger"} className="px-3 py-2">
//                             {isPresent ? (
//                               <FaCheckCircle className="me-1" />
//                             ) : (
//                               <FaTimesCircle className="me-1" />
//                             )}
//                             {currentStatus}
//                           </Badge>
//                         ) : (
//                           <Badge bg="secondary" className="px-3 py-2">
//                             <FaClock className="me-1" /> Not Marked
//                           </Badge>
//                         )}
//                       </div>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//                 <Card.Footer className="bg-white">
//                   <Button
//                     variant={isPresent ? "danger" : "success"}
//                     className="w-100 d-flex align-items-center justify-content-center gap-2"
//                     onClick={() => toggleAttendance(student)}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <FaSpinner className="spin" /> Updating...
//                       </>
//                     ) : isPresent ? (
//                       <>
//                         <FaUserTimes /> Mark Absent
//                       </>
//                     ) : (
//                       <>
//                         <FaUserCheck /> Mark Present
//                       </>
//                     )}
//                   </Button>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })
//       ) : (
//         <Col xs={12}>
//           <div className="text-center text-muted py-5">
//             No students found for the selected filters and date
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Success Message */}
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
//           <Alert.Heading>Success!</Alert.Heading>
//           <p>{successMessage}</p>
//         </Alert>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Info Message - Show selected date */}
//       {startDate && (
//         <Alert variant="info" className="mb-3">
//           <strong>Selected Date:</strong> {startDate}
//         </Alert>
//       )}

//       {/* Filters Section */}
//       <Row className="mb-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <h5 className="mb-0">Filters</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <SingleDatePicker/>
//                 </Col>
//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>
//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Students List Section */}
//       <Row>
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <h5 className="mb-0">Students List</h5>
//                 <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
//                   <ToggleButtonGroup
//                     type="radio"
//                     name="viewMode"
//                     value={viewMode}
//                     onChange={(val) => val && setViewMode(val)}
//                     size="sm"
//                   >
//                     <ToggleButton 
//                       id="table-view" 
//                       variant="outline-light" 
//                       value="table"
//                       className="d-flex align-items-center gap-1"
//                     >
//                       <FaTable /> Table
//                     </ToggleButton>
//                     <ToggleButton 
//                       id="card-view" 
//                       variant="outline-light" 
//                       value="card"
//                       className="d-flex align-items-center gap-1"
//                     >
//                       <FaThLarge /> Card
//                     </ToggleButton>
//                   </ToggleButtonGroup>
//                   <Badge bg="light" text="dark" className="ms-2">
//                     Total: {students.length} Students
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Header>
//             <Card.Body>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-3">Loading students...</p>
//                 </div>
//               ) : (
//                 <>
//                   {students.length > 0 && (
//                     <div className="mb-3 text-muted">
//                       <small>Showing {students.length} student(s) for selected filters and date: <strong>{startDate || 'Today'}</strong></small>
//                     </div>
//                   )}
//                   {viewMode === 'table' ? <TableView /> : <CardView />}
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* CSS for spinner animation */}
//       <style jsx>{`
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };












// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, MarkMBStudentAttendance } from "../../service/Student.service";
// import { Container, Card, Table, Button, Badge, Spinner, ToggleButton, ToggleButtonGroup, Row, Col, Alert } from "react-bootstrap";
// import { FaThLarge, FaTable, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext); // Only startDate for single date picker
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
//   const [attendanceStatus, setAttendanceStatus] = useState({}); // Stores 'Present' or 'Absent'
//   const [attendanceLoading, setAttendanceLoading] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null); // Store the selected date object

//   const fetchStudents = async () => {
//     setLoading(true);
//     setError(null);
    
//     // Build request body with single date
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate // Send only startDate (format: "2026-05-08")
//     };

//     console.log("Fetching students with:", reqBody);
    
//     try {
//       const response = await GetMBStudents(reqBody);
//       console.log("Students data:", response.data);
//       console.log("Selected date from API:", response.selectedDate);
      
//       setStudents(response.data || []);
//       setSelectedDate(response.selectedDate || null);
      
//       // Initialize attendance status from API response
//       const initialStatus = {};
//       response.data?.forEach(student => {
//         // Get attendance status from the API response
//         let status = null;
//         if (student.attendanceStatus) {
//           status = student.attendanceStatus;
//         } else if (student.status) {
//           status = student.status;
//         }
        
//         if (status && (status === "Present" || status === "Absent")) {
//           initialStatus[student._id] = status;
//         }
//       });
      
//       console.log("Initial attendance status from API:", initialStatus);
//       setAttendanceStatus(initialStatus);
//     } catch (error) {
//       console.log("Error fetching students:", error);
//       setError("Failed to fetch students. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle attendance marking with API call
//   const handleMarkAttendance = async (student, status) => {
//     setAttendanceLoading(prev => ({
//       ...prev,
//       [student._id]: true
//     }));

//     // Build request body with single date
//     const reqBody = {
//       _id: student._id,
//       status: status,
//       isAttendanceMarked: true,
//       startDate: startDate // Send the selected date from SingleDatePicker
//     };

//     console.log("Marking attendance with:", reqBody);

//     try {
//       const response = await MarkMBStudentAttendance(reqBody);
//       console.log("Attendance marked response:", response);
      
//       if (response.success) {
//         // Update local state with new status
//         setAttendanceStatus(prev => ({
//           ...prev,
//           [student._id]: status
//         }));
        
//         // Also update the student object in students array
//         setStudents(prevStudents => 
//           prevStudents.map(s => 
//             s._id === student._id 
//               ? { ...s, attendanceStatus: status, status: status }
//               : s
//           )
//         );
        
//         // Show success message
//         setSuccessMessage(`Attendance marked as ${status} for ${student.firstName} on ${startDate || 'today'}`);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => {
//           setSuccessMessage(null);
//         }, 3000);
//       } else {
//         setError(`Failed to mark attendance: ${response.message}`);
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError("Failed to mark attendance. Please try again.");
//       setTimeout(() => {
//         setError(null);
//       }, 3000);
//     } finally {
//       setAttendanceLoading(prev => ({
//         ...prev,
//         [student._id]: false
//       }));
//     }
//   };

//   // Toggle between Present and Absent
//   const toggleAttendance = (student) => {
//     const currentStatus = attendanceStatus[student._id];
//     // If no status yet, default to marking Present
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
//     handleMarkAttendance(student, newStatus);
//   };

//   // Fetch students when school, batch, or startDate changes
//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch) {
//       fetchStudents();
//     }
//   }, [schoolContext, batchContext, startDate]); // Only startDate dependency now

//   // Table View
//   const TableView = () => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="mt-3">
//         <thead className="bg-light">
//           <tr>
//             <th>S. No.</th>
//             <th>Student SRN</th>
//             <th>First Name</th>
//             <th>Father's Name</th>
//             <th>Attendance Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.length > 0 ? (
//             students.map((student, index) => {
//               const currentStatus = attendanceStatus[student._id];
//               const isLoading = attendanceLoading[student._id];
//               const isPresent = currentStatus === "Present";
              
//               return (
//                 <tr key={student._id}>
//                   <td>{index + 1}</td>
//                   <td>{student.studentSrn || 'N/A'}</td>
//                   <td>
//                     <strong>{student.firstName || 'N/A'}</strong>
//                     {student.lastName && <span> {student.lastName}</span>}
//                   </td>
//                   <td>{student.fatherName || 'N/A'}</td>
//                   <td>
//                     {currentStatus === "Present" ? (
//                       <Button
//                         variant="success"
//                         size="sm"
//                         onClick={() => toggleAttendance(student)}
//                         disabled={isLoading}
//                         className="d-flex align-items-center gap-2"
//                       >
//                         {isLoading ? (
//                           <>
//                             <FaSpinner className="spin" /> Updating...
//                           </>
//                         ) : (
//                           <>
//                             <FaUserCheck /> Present
//                           </>
//                         )}
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => toggleAttendance(student)}
//                         disabled={isLoading}
//                         className="d-flex align-items-center gap-2"
//                       >
//                         {isLoading ? (
//                           <>
//                             <FaSpinner className="spin" /> Updating...
//                           </>
//                         ) : (
//                           <>
//                             <FaUserTimes /> Absent
//                           </>
//                         )}
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center text-muted">
//                 No students found for the selected filters and date
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );

//   // Card View
//   const CardView = () => (
//     <Row className="g-3 mt-3">
//       {students.length > 0 ? (
//         students.map((student, index) => {
//           const currentStatus = attendanceStatus[student._id];
//           const isLoading = attendanceLoading[student._id];
//           const isPresent = currentStatus === "Present";
          
//           return (
//             <Col xs={12} md={6} lg={4} key={student._id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Header className={isPresent ? "bg-success text-white" : "bg-danger text-white"}>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <strong>{student.firstName || 'N/A'} {student.lastName || ''}</strong>
//                     <Badge bg="light" className={isPresent ? "text-success" : "text-danger"}>
//                       #{student.rollNumber || 'N/A'}
//                     </Badge>
//                   </div>
//                 </Card.Header>
//                 <Card.Body>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small className="text-muted">Student SRN:</small>
//                       <p className="mb-0 fw-bold">{student.studentSrn || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small className="text-muted">Father's Name:</small>
//                       <p className="mb-0 fw-bold">{student.fatherName || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small className="text-muted">Class:</small>
//                       <p className="mb-0">{student.classofStudent || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small className="text-muted">Batch:</small>
//                       <p className="mb-0">{student.batch || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//                 <Card.Footer className="bg-white">
//                   {isPresent ? (
//                     <Button
//                       variant="success"
//                       className="w-100 d-flex align-items-center justify-content-center gap-2"
//                       onClick={() => toggleAttendance(student)}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <FaSpinner className="spin" /> Updating...
//                         </>
//                       ) : (
//                         <>
//                           <FaUserCheck /> Present
//                         </>
//                       )}
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="danger"
//                       className="w-100 d-flex align-items-center justify-content-center gap-2"
//                       onClick={() => toggleAttendance(student)}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <FaSpinner className="spin" /> Updating...
//                         </>
//                       ) : (
//                         <>
//                           <FaUserTimes /> Absent
//                         </>
//                       )}
//                     </Button>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })
//       ) : (
//         <Col xs={12}>
//           <div className="text-center text-muted py-5">
//             No students found for the selected filters and date
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Success Message */}
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
//           <Alert.Heading>Success!</Alert.Heading>
//           <p>{successMessage}</p>
//         </Alert>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Info Message - Show selected date */}
//       {startDate && (
//         <Alert variant="info" className="mb-3">
//           <strong>Selected Date:</strong> {startDate}
//         </Alert>
//       )}

//       {/* Filters Section */}
//       <Row className="mb-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <h5 className="mb-0">Filters</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <SingleDatePicker/>
//                 </Col>
//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>
//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Students List Section */}
//       <Row>
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <h5 className="mb-0">Students List</h5>
//                 <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
//                   <ToggleButtonGroup
//                     type="radio"
//                     name="viewMode"
//                     value={viewMode}
//                     onChange={(val) => val && setViewMode(val)}
//                     size="sm"
//                   >
//                     <ToggleButton 
//                       id="table-view" 
//                       variant="outline-light" 
//                       value="table"
//                       className="d-flex align-items-center gap-1"
//                     >
//                       <FaTable /> Table
//                     </ToggleButton>
//                     <ToggleButton 
//                       id="card-view" 
//                       variant="outline-light" 
//                       value="card"
//                       className="d-flex align-items-center gap-1"
//                     >
//                       <FaThLarge /> Card
//                     </ToggleButton>
//                   </ToggleButtonGroup>
//                   <Badge bg="light" text="dark" className="ms-2">
//                     Total: {students.length} Students
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Header>
//             <Card.Body>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-3">Loading students...</p>
//                 </div>
//               ) : (
//                 <>
//                   {students.length > 0 && (
//                     <div className="mb-3 text-muted">
//                       <small>Showing {students.length} student(s) for selected filters and date: <strong>{startDate || 'Today'}</strong></small>
//                     </div>
//                   )}
//                   {viewMode === 'table' ? <TableView /> : <CardView />}
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* CSS for spinner animation */}
//       <style jsx>{`
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };








// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, MarkMBStudentAttendance } from "../../service/Student.service";
// import { Container, Card, Table, Button, Badge, Spinner, ToggleButton, ToggleButtonGroup, Row, Col, Alert } from "react-bootstrap";
// import { FaThLarge, FaTable, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext); // Only startDate for single date picker
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
//   const [attendanceStatus, setAttendanceStatus] = useState({}); // Stores 'Present' or 'Absent'
//   const [attendanceLoading, setAttendanceLoading] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null); // Store the selected date object

//   // Function to sort students alphabetically by first name
//   const sortStudentsAlphabetically = (studentsArray) => {
//     if (!studentsArray || !Array.isArray(studentsArray)) return [];
//     return [...studentsArray].sort((a, b) => {
//       const nameA = (a.firstName || '').toLowerCase();
//       const nameB = (b.firstName || '').toLowerCase();
//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;
//       return 0;
//     });
//   };

//   const fetchStudents = async () => {
//     setLoading(true);
//     setError(null);
    
//     // Build request body with single date
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate // Send only startDate (format: "2026-05-08")
//     };

//     console.log("Fetching students with:", reqBody);
    
//     try {
//       const response = await GetMBStudents(reqBody);
//       console.log("Students data:", response.data);
//       console.log("Selected date from API:", response.selectedDate);
      
//       // Sort students alphabetically by first name
//       const sortedStudents = sortStudentsAlphabetically(response.data || []);
      
//       setStudents(sortedStudents);
//       setSelectedDate(response.selectedDate || null);
      
//       // Initialize attendance status from API response
//       const initialStatus = {};
//       sortedStudents.forEach(student => {
//         // Get attendance status from the API response
//         let status = null;
//         if (student.attendanceStatus) {
//           status = student.attendanceStatus;
//         } else if (student.status) {
//           status = student.status;
//         }
        
//         if (status && (status === "Present" || status === "Absent")) {
//           initialStatus[student._id] = status;
//         }
//       });
      
//       console.log("Initial attendance status from API:", initialStatus);
//       setAttendanceStatus(initialStatus);
//     } catch (error) {
//       console.log("Error fetching students:", error);
//       setError("Failed to fetch students. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle attendance marking with API call
//   const handleMarkAttendance = async (student, status) => {
//     setAttendanceLoading(prev => ({
//       ...prev,
//       [student._id]: true
//     }));

//     // Build request body with single date
//     const reqBody = {
//       _id: student._id,
//       status: status,
//       isAttendanceMarked: true,
//       startDate: startDate // Send the selected date from SingleDatePicker
//     };

//     console.log("Marking attendance with:", reqBody);

//     try {
//       const response = await MarkMBStudentAttendance(reqBody);
//       console.log("Attendance marked response:", response);
      
//       if (response.success) {
//         // Update local state with new status
//         setAttendanceStatus(prev => ({
//           ...prev,
//           [student._id]: status
//         }));
        
//         // Also update the student object in students array
//         setStudents(prevStudents => 
//           sortStudentsAlphabetically(
//             prevStudents.map(s => 
//               s._id === student._id 
//                 ? { ...s, attendanceStatus: status, status: status }
//                 : s
//             )
//           )
//         );
        
//         // Show success message
//         setSuccessMessage(`Attendance marked as ${status} for ${student.firstName} on ${startDate || 'today'}`);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => {
//           setSuccessMessage(null);
//         }, 3000);
//       } else {
//         setError(`Failed to mark attendance: ${response.message}`);
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setError("Failed to mark attendance. Please try again.");
//       setTimeout(() => {
//         setError(null);
//       }, 3000);
//     } finally {
//       setAttendanceLoading(prev => ({
//         ...prev,
//         [student._id]: false
//       }));
//     }
//   };

//   // Toggle between Present and Absent
//   const toggleAttendance = (student) => {
//     const currentStatus = attendanceStatus[student._id];
//     // If no status yet, default to marking Present
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
//     handleMarkAttendance(student, newStatus);
//   };

//   // Fetch students when school, batch, or startDate changes
//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch) {
//       fetchStudents();
//     }
//   }, [schoolContext, batchContext, startDate]); // Only startDate dependency now

//   // Table View
//   const TableView = () => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="mt-3">
//         <thead className="bg-light">
//           <tr>
//             <th>S. No.</th>
//             <th>Student SRN</th>
//             <th>First Name</th>
//             <th>Father's Name</th>
//             <th>Attendance Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.length > 0 ? (
//             students.map((student, index) => {
//               const currentStatus = attendanceStatus[student._id];
//               const isLoading = attendanceLoading[student._id];
//               const isPresent = currentStatus === "Present";
              
//               return (
//                 <tr key={student._id}>
//                   <td>{index + 1}</td>
//                   <td>{student.studentSrn || 'N/A'}</td>
//                   <td>
//                     <strong>{student.firstName || 'N/A'}</strong>
//                     {student.lastName && <span> {student.lastName}</span>}
//                   </td>
//                   <td>{student.fatherName || 'N/A'}</td>
//                   <td>
//                     {currentStatus === "Present" ? (
//                       <Button
//                         variant="success"
//                         size="sm"
//                         onClick={() => toggleAttendance(student)}
//                         disabled={isLoading}
//                         className="d-flex align-items-center gap-2"
//                       >
//                         {isLoading ? (
//                           <>
//                             <FaSpinner className="spin" /> Updating...
//                           </>
//                         ) : (
//                           <>
//                             <FaUserCheck /> Present
//                           </>
//                         )}
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => toggleAttendance(student)}
//                         disabled={isLoading}
//                         className="d-flex align-items-center gap-2"
//                       >
//                         {isLoading ? (
//                           <>
//                             <FaSpinner className="spin" /> Updating...
//                           </>
//                         ) : (
//                           <>
//                             <FaUserTimes /> Absent
//                           </>
//                         )}
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center text-muted">
//                 No students found for the selected filters and date
//                </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );

//   // Card View
//   const CardView = () => (
//     <Row className="g-3 mt-3">
//       {students.length > 0 ? (
//         students.map((student, index) => {
//           const currentStatus = attendanceStatus[student._id];
//           const isLoading = attendanceLoading[student._id];
//           const isPresent = currentStatus === "Present";
          
//           return (
//             <Col xs={12} md={6} lg={4} key={student._id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Header className={isPresent ? "bg-success text-white" : "bg-danger text-white"}>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <strong>{student.firstName || 'N/A'} {student.lastName || ''}</strong>
//                     <Badge bg="light" className={isPresent ? "text-success" : "text-danger"}>
//                       #{student.rollNumber || 'N/A'}
//                     </Badge>
//                   </div>
//                 </Card.Header>
//                 <Card.Body>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small className="text-muted">Student SRN:</small>
//                       <p className="mb-0 fw-bold">{student.studentSrn || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small className="text-muted">Father's Name:</small>
//                       <p className="mb-0 fw-bold">{student.fatherName || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small className="text-muted">Class:</small>
//                       <p className="mb-0">{student.classofStudent || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small className="text-muted">Batch:</small>
//                       <p className="mb-0">{student.batch || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//                 <Card.Footer className="bg-white">
//                   {isPresent ? (
//                     <Button
//                       variant="success"
//                       className="w-100 d-flex align-items-center justify-content-center gap-2"
//                       onClick={() => toggleAttendance(student)}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <FaSpinner className="spin" /> Updating...
//                         </>
//                       ) : (
//                         <>
//                           <FaUserCheck /> Present
//                         </>
//                       )}
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="danger"
//                       className="w-100 d-flex align-items-center justify-content-center gap-2"
//                       onClick={() => toggleAttendance(student)}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <FaSpinner className="spin" /> Updating...
//                         </>
//                       ) : (
//                         <>
//                           <FaUserTimes /> Absent
//                         </>
//                       )}
//                     </Button>
//                   )}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })
//       ) : (
//         <Col xs={12}>
//           <div className="text-center text-muted py-5">
//             No students found for the selected filters and date
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Success Message */}
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
//           <Alert.Heading>Success!</Alert.Heading>
//           <p>{successMessage}</p>
//         </Alert>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Info Message - Show selected date */}
//       {startDate && (
//         <Alert variant="info" className="mb-3">
//           <strong>Selected Date:</strong> {startDate}
//         </Alert>
//       )}

//       {/* Filters Section */}
//       <Row className="mb-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <h5 className="mb-0">Filters</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <SingleDatePicker/>
//                 </Col>
//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>
//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Students List Section */}
//       <Row>
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <h5 className="mb-0">Students List</h5>
//                 <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
//                   <ToggleButtonGroup
//                     type="radio"
//                     name="viewMode"
//                     value={viewMode}
//                     onChange={(val) => val && setViewMode(val)}
//                     size="sm"
//                   >
//                     <ToggleButton 
//                       id="table-view" 
//                       variant="outline-light" 
//                       value="table"
//                       className="d-flex align-items-center gap-1"
//                     >
//                       <FaTable /> Table
//                     </ToggleButton>
//                     <ToggleButton 
//                       id="card-view" 
//                       variant="outline-light" 
//                       value="card"
//                       className="d-flex align-items-center gap-1"
//                     >
//                       <FaThLarge /> Card
//                     </ToggleButton>
//                   </ToggleButtonGroup>
//                   <Badge bg="light" text="dark" className="ms-2">
//                     Total: {students.length} Students
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Header>
//             <Card.Body>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-3">Loading students...</p>
//                 </div>
//               ) : (
//                 <>
//                   {students.length > 0 && (
//                     <div className="mb-3 text-muted">
//                       <small>Showing {students.length} student(s) for selected filters and date: <strong>{startDate || 'Today'}</strong></small>
//                     </div>
//                   )}
//                   {viewMode === 'table' ? <TableView /> : <CardView />}
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* CSS for spinner animation */}
//       <style jsx>{`
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };





// import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, MarkMBStudentAttendance } from "../../service/Student.service";
// import { Container, Card, Table, Button, Badge, Spinner, ToggleButton, ToggleButtonGroup, Row, Col, Alert } from "react-bootstrap";
// import { FaThLarge, FaTable, FaSpinner, FaUserCheck, FaUserTimes } from "react-icons/fa";

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('table');
//   const [attendanceStatus, setAttendanceStatus] = useState({});
//   const [attendanceLoading, setAttendanceLoading] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const sortStudentsAlphabetically = useCallback((studentsArray) => {
//     if (!studentsArray || !Array.isArray(studentsArray)) return [];
//     return [...studentsArray].sort((a, b) => {
//       const nameA = (a.firstName || '').toLowerCase();
//       const nameB = (b.firstName || '').toLowerCase();
//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;
//       return 0;
//     });
//   }, []);

//   const fetchStudents = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate
//     };

//     try {
//       const response = await GetMBStudents(reqBody);
//       const sortedStudents = sortStudentsAlphabetically(response.data || []);
      
//       setStudents(sortedStudents);
      
//       const initialStatus = {};
//       sortedStudents.forEach(student => {
//         let status = null;
//         if (student.attendanceStatus) {
//           status = student.attendanceStatus;
//         } else if (student.status) {
//           status = student.status;
//         }
        
//         if (status && (status === "Present" || status === "Absent")) {
//           initialStatus[student._id] = status;
//         }
//       });
      
//       setAttendanceStatus(initialStatus);
//     } catch (error) {
//       setError("Failed to fetch students. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolContext?.schoolId, batchContext?.batch, startDate, sortStudentsAlphabetically]);

//   const handleMarkAttendance = useCallback(async (student, status) => {
//     setAttendanceLoading(prev => ({
//       ...prev,
//       [student._id]: true
//     }));

//     const reqBody = {
//       _id: student._id,
//       status: status,
//       isAttendanceMarked: true,
//       startDate: startDate
//     };

//     try {
//       const response = await MarkMBStudentAttendance(reqBody);
      
//       if (response.success) {
//         setAttendanceStatus(prev => ({
//           ...prev,
//           [student._id]: status
//         }));
        
//         setStudents(prevStudents => 
//           sortStudentsAlphabetically(
//             prevStudents.map(s => 
//               s._id === student._id 
//                 ? { ...s, attendanceStatus: status, status: status }
//                 : s
//             )
//           )
//         );
        
//         setSuccessMessage(`Attendance marked as ${status} for ${student.firstName}`);
//         setTimeout(() => setSuccessMessage(null), 3000);
//       } else {
//         setError(`Failed to mark attendance: ${response.message}`);
//         setTimeout(() => setError(null), 3000);
//       }
//     } catch (error) {
//       setError("Failed to mark attendance. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setAttendanceLoading(prev => ({
//         ...prev,
//         [student._id]: false
//       }));
//     }
//   }, [startDate, sortStudentsAlphabetically]);

//   const toggleAttendance = useCallback((student) => {
//     const currentStatus = attendanceStatus[student._id];
//     const newStatus = currentStatus === "Present" ? "Absent" : "Present";
//     handleMarkAttendance(student, newStatus);
//   }, [attendanceStatus, handleMarkAttendance]);

//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch) {
//       fetchStudents();
//     }
//   }, [schoolContext?.schoolId, batchContext?.batch, startDate, fetchStudents]);

//   // Individual Row Component to prevent re-renders
//   const StudentRow = React.memo(({ student, index, attendanceStatus, attendanceLoading, onToggle }) => {
//     const currentStatus = attendanceStatus[student._id];
//     const isLoading = attendanceLoading[student._id];
//     const isPresent = currentStatus === "Present";
    
//     return (
//       <tr>
//         <td className="text-center" style={{ fontSize: 'clamp(12px, 4vw, 14px)' }}>{index + 1}</td>
//         <td style={{ wordBreak: 'break-word', fontSize: 'clamp(11px, 3.5vw, 14px)' }}>{student.studentSrn || 'N/A'}</td>
//         <td style={{ wordBreak: 'break-word', fontSize: 'clamp(12px, 4vw, 14px)' }}>
//           <strong>{student.firstName || 'N/A'}</strong>
//           {student.lastName && <span> {student.lastName}</span>}
//         </td>
//         <td style={{ wordBreak: 'break-word', fontSize: 'clamp(11px, 3.5vw, 14px)' }}>{student.fatherName || 'N/A'}</td>
//         <td style={{ textAlign: 'center' }}>
//           <Button
//             variant={isPresent ? "success" : "danger"}
//             onClick={() => onToggle(student)}
//             disabled={isLoading}
//             style={{ 
//               width: "clamp(35px, 12vw, 50px)", 
//               height: "clamp(28px, 8vw, 32px)",
//               padding: "0",
//               fontSize: "clamp(11px, 4vw, 14px)", 
//               fontWeight: "bold",
//               minWidth: "35px",
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "none",
//               outline: "none"
//             }}
//           >
//             {isLoading ? (
//               <FaSpinner style={{ fontSize: "clamp(10px, 3vw, 12px)" }} className="spin" />
//             ) : (
//               isPresent ? "P" : "A"
//             )}
//           </Button>
//         </td>
//       </tr>
//     );
//   });

//   // Table View with responsive design
//   const TableView = useMemo(() => {
//     if (students.length === 0) {
//       return (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">No students found for the selected filters and date</p>
//         </div>
//       );
//     }

//     return (
//       <div className="table-responsive" style={{ overflowX: 'auto' }}>
//         <Table striped bordered hover style={{ minWidth: '300px', marginBottom: 0, background: 'white' }}>
//           <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//             <tr>
//               <th style={{ 
//                 width: 'clamp(45px, 10vw, 60px)', 
//                 fontSize: 'clamp(11px, 3.5vw, 14px)',
//                 textAlign: 'center'
//               }}>S.No.</th>
//               <th style={{ 
//                 width: 'clamp(80px, 20vw, 15%)', 
//                 fontSize: 'clamp(11px, 3.5vw, 14px)'
//               }}>SRN</th>
//               <th style={{ 
//                 width: 'clamp(90px, 25vw, 25%)', 
//                 fontSize: 'clamp(11px, 3.5vw, 14px)'
//               }}>Student Name</th>
//               <th style={{ 
//                 width: 'clamp(80px, 20vw, 25%)', 
//                 fontSize: 'clamp(11px, 3.5vw, 14px)'
//               }}>Father's Name</th>
//               <th style={{ 
//                 width: 'clamp(55px, 12vw, 80px)', 
//                 fontSize: 'clamp(11px, 3.5vw, 14px)',
//                 textAlign: 'center'
//               }}>Att.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student, index) => (
//               <StudentRow
//                 key={student._id}
//                 student={student}
//                 index={index}
//                 attendanceStatus={attendanceStatus}
//                 attendanceLoading={attendanceLoading}
//                 onToggle={toggleAttendance}
//               />
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   }, [students, attendanceStatus, attendanceLoading, toggleAttendance]);

//   // Card View with responsive design
//   const CardView = () => (
//     <Row className="g-2 g-md-3 mt-3">
//       {students.length > 0 ? (
//         students.map((student) => {
//           const currentStatus = attendanceStatus[student._id];
//           const isLoading = attendanceLoading[student._id];
//           const isPresent = currentStatus === "Present";
          
//           return (
//             <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Header className={isPresent ? "bg-success text-white" : "bg-danger text-white"} style={{ padding: '0.5rem' }}>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <strong style={{ fontSize: 'clamp(12px, 4vw, 16px)' }}>
//                       {student.firstName || 'N/A'} {student.lastName || ''}
//                     </strong>
//                     <Badge bg="light" className={isPresent ? "text-success" : "text-danger"} style={{ fontSize: 'clamp(10px, 3vw, 12px)' }}>
//                       #{student.rollNumber || 'N/A'}
//                     </Badge>
//                   </div>
//                 </Card.Header>
//                 <Card.Body style={{ padding: '0.75rem' }}>
//                   <Row className="mb-2">
//                     <Col xs={6}>
//                       <small style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} className="text-muted">SRN:</small>
//                       <p style={{ fontSize: 'clamp(11px, 3.5vw, 13px)', marginBottom: '0.25rem' }} className="fw-bold">{student.studentSrn || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} className="text-muted">Father:</small>
//                       <p style={{ fontSize: 'clamp(11px, 3.5vw, 13px)', marginBottom: '0.25rem' }} className="fw-bold">{student.fatherName || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col xs={6}>
//                       <small style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} className="text-muted">Class:</small>
//                       <p style={{ fontSize: 'clamp(11px, 3.5vw, 13px)', marginBottom: '0.25rem' }}>{student.classofStudent || 'N/A'}</p>
//                     </Col>
//                     <Col xs={6}>
//                       <small style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} className="text-muted">Batch:</small>
//                       <p style={{ fontSize: 'clamp(11px, 3.5vw, 13px)', marginBottom: '0.25rem' }}>{student.batch || 'N/A'}</p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//                 <Card.Footer className="bg-white" style={{ padding: '0.5rem' }}>
//                   <Button
//                     variant={isPresent ? "success" : "danger"}
//                     className="w-100 d-flex align-items-center justify-content-center gap-2"
//                     onClick={() => toggleAttendance(student)}
//                     disabled={isLoading}
//                     style={{ fontSize: 'clamp(12px, 4vw, 14px)', padding: '0.375rem 0.5rem' }}
//                   >
//                     {isLoading ? (
//                       <><FaSpinner className="spin" style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} /> Updating...</>
//                     ) : (
//                       <>{isPresent ? <FaUserCheck /> : <FaUserTimes />} {isPresent ? "Present" : "Absent"}</>
//                     )}
//                   </Button>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })
//       ) : (
//         <Col xs={12}>
//           <div className="text-center text-muted py-5 bg-light rounded">
//             No students found for the selected filters and date
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-3 mt-md-4 mb-3 mb-md-4">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-2 mb-md-3">
//           <Alert.Heading className="fs-6 fs-md-5">Success!</Alert.Heading>
//           <p className="mb-0 small">{successMessage}</p>
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-2 mb-md-3">
//           <Alert.Heading className="fs-6 fs-md-5">Error!</Alert.Heading>
//           <p className="mb-0 small">{error}</p>
//         </Alert>
//       )}

//       {startDate && (
//         <Alert variant="info" className="mb-2 mb-md-3" style={{ fontSize: 'clamp(12px, 4vw, 14px)' }}>
//           <strong>Selected Date:</strong> {startDate}
//         </Alert>
//       )}

//       {/* Filters Section */}
//       <Row className="mb-3 mb-md-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white" style={{ padding: '0.5rem 1rem' }}>
//               <h5 className="mb-0" style={{ fontSize: 'clamp(14px, 5vw, 18px)' }}>Filters</h5>
//             </Card.Header>
//             <Card.Body style={{ padding: '0.75rem' }}>
//               <Row className="g-2">
//                 <Col md={6}>
//                   <SingleDatePicker/>
//                 </Col>
//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>
//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Header Section */}
//       <Row className="mb-2 mb-md-3">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Body className="py-2">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <div>
//                   <h5 className="mb-0" style={{ fontSize: 'clamp(14px, 5vw, 18px)' }}>Students List</h5>
//                   {students.length > 0 && (
//                     <small className="text-muted" style={{ fontSize: 'clamp(10px, 3.5vw, 12px)' }}>
//                       Total: {students.length} student(s)
//                     </small>
//                   )}
//                 </div>
//                 <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
//                   <ToggleButtonGroup
//                     type="radio"
//                     name="viewMode"
//                     value={viewMode}
//                     onChange={(val) => val && setViewMode(val)}
//                     size="sm"
//                   >
//                     <ToggleButton id="table-view" variant="outline-primary" value="table" style={{ fontSize: 'clamp(11px, 3.5vw, 13px)' }}>
//                       <FaTable className="me-1" style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} /> Table
//                     </ToggleButton>
//                     <ToggleButton id="card-view" variant="outline-primary" value="card" style={{ fontSize: 'clamp(11px, 3.5vw, 13px)' }}>
//                       <FaThLarge className="me-1" style={{ fontSize: 'clamp(10px, 3vw, 12px)' }} /> Card
//                     </ToggleButton>
//                   </ToggleButtonGroup>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Students List */}
//       {loading ? (
//         <div className="text-center py-5 bg-light rounded">
//           <Spinner animation="border" variant="primary" size="sm" />
//           <p className="mt-3 mb-0" style={{ fontSize: 'clamp(12px, 4vw, 14px)' }}>Loading students...</p>
//         </div>
//       ) : (
//         viewMode === 'table' ? TableView : <CardView />
//       )}

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         .table-responsive {
//           overflow-x: auto;
//           -webkit-overflow-scrolling: touch;
//         }
//         .table {
//           background-color: white;
//           border-radius: 8px;
//           overflow: hidden;
//           margin-bottom: 0;
//         }
//         .table thead th {
//           background-color: #f8f9fa;
//           border-bottom: 2px solid #dee2e6;
//         }
//         .table td, .table th {
//           padding: clamp(4px, 2vw, 8px);
//           vertical-align: middle;
//         }
        
//         /* Mobile specific optimizations */
//         @media (max-width: 768px) {
//           .container-fluid {
//             padding-left: 10px;
//             padding-right: 10px;
//           }
//           .card-header {
//             padding: 0.5rem;
//           }
//           .card-body {
//             padding: 0.5rem;
//           }
//         }
        
//         /* Small mobile devices */
//         @media (max-width: 480px) {
//           .table td, .table th {
//             padding: 4px;
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };





// import React, {
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";

// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

// import {
//   School_drop_down,
//   Batch_drop_down,
// } from "../Utils/DependentDropDowns.v2";

// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

// import {
//   GetMBStudents,
//   MarkMBStudentAttendance,
// } from "../../service/Student.service";

// import {
//   Container,
//   Card,
//   Table,
//   Button,
//   Badge,
//   Spinner,
//   ToggleButton,
//   ToggleButtonGroup,
//   Row,
//   Col,
//   Alert,
// } from "react-bootstrap";

// import {
//   FaThLarge,
//   FaTable,
//   FaSpinner,
//   FaUserCheck,
//   FaUserTimes,
// } from "react-icons/fa";

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } = useContext(UserContext);

//   const { schoolContext } = useContext(
//     DistrictBlockSschoolContextV2
//   );

//   const { startDate } = useContext(
//     DateNDateRangeContext
//   );

//   const { batchContext } = useContext(
//     DistrictBlockSschoolContextV2
//   );

//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState("table");

//   const [attendanceStatus, setAttendanceStatus] = useState({});
//   const [attendanceLoading, setAttendanceLoading] = useState({});

//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   // FIX: preserve scroll
//   const tableContainerRef = useRef(null);
//   const scrollPositionRef = useRef(0);

//   const sortStudentsAlphabetically = useCallback(
//     (studentsArray) => {
//       if (!studentsArray || !Array.isArray(studentsArray))
//         return [];

//       return [...studentsArray].sort((a, b) => {
//         const nameA = (a.firstName || "").toLowerCase();
//         const nameB = (b.firstName || "").toLowerCase();

//         if (nameA < nameB) return -1;
//         if (nameA > nameB) return 1;

//         return 0;
//       });
//     },
//     []
//   );

//   const fetchStudents = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate,
//     };

//     try {
//       const response = await GetMBStudents(reqBody);

//       const sortedStudents = sortStudentsAlphabetically(
//         response.data || []
//       );

//       setStudents(sortedStudents);

//       const initialStatus = {};

//       sortedStudents.forEach((student) => {
//         let status = null;

//         if (student.attendanceStatus) {
//           status = student.attendanceStatus;
//         } else if (student.status) {
//           status = student.status;
//         }

//         if (
//           status &&
//           (status === "Present" || status === "Absent")
//         ) {
//           initialStatus[student._id] = status;
//         }
//       });

//       setAttendanceStatus(initialStatus);
//     } catch (error) {
//       setError("Failed to fetch students. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     schoolContext?.schoolId,
//     batchContext?.batch,
//     startDate,
//     sortStudentsAlphabetically,
//   ]);

//   const handleMarkAttendance = useCallback(
//     async (student, status) => {
//       // SAVE SCROLL POSITION
//       if (tableContainerRef.current) {
//         scrollPositionRef.current =
//           tableContainerRef.current.scrollTop;
//       }

//       setAttendanceLoading((prev) => ({
//         ...prev,
//         [student._id]: true,
//       }));

//       const reqBody = {
//         _id: student._id,
//         status: status,
//         isAttendanceMarked: true,
//         startDate: startDate,
//       };

//       try {
//         const response = await MarkMBStudentAttendance(
//           reqBody
//         );

//         if (response.success) {
//           // UPDATE ONLY STATUS
//           setAttendanceStatus((prev) => ({
//             ...prev,
//             [student._id]: status,
//           }));

//           // setSuccessMessage(
//           //   `Attendance marked as ${status} for ${student.firstName}`
//           // );

//           setTimeout(() => {
//             setSuccessMessage(null);
//           }, 2000);
//         } else {
//           setError(
//             `Failed to mark attendance: ${response.message}`
//           );

//           setTimeout(() => {
//             setError(null);
//           }, 3000);
//         }
//       } catch (error) {
//         setError(
//           "Failed to mark attendance. Please try again."
//         );

//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       } finally {
//         setAttendanceLoading((prev) => ({
//           ...prev,
//           [student._id]: false,
//         }));

//         // RESTORE SCROLL
//         requestAnimationFrame(() => {
//           if (tableContainerRef.current) {
//             tableContainerRef.current.scrollTop =
//               scrollPositionRef.current;
//           }
//         });
//       }
//     },
//     [startDate]
//   );

//   const toggleAttendance = useCallback(
//     (student) => {
//       const currentStatus =
//         attendanceStatus[student._id];

//       const newStatus =
//         currentStatus === "Present"
//           ? "Absent"
//           : "Present";

//       handleMarkAttendance(student, newStatus);
//     },
//     [attendanceStatus, handleMarkAttendance]
//   );

//   useEffect(() => {
//     if (
//       schoolContext?.schoolId &&
//       batchContext?.batch
//     ) {
//       fetchStudents();
//     }
//   }, [
//     schoolContext?.schoolId,
//     batchContext?.batch,
//     startDate,
//     fetchStudents,
//   ]);

//   // MEMO ROW
//   const StudentRow = React.memo(
//     ({
//       student,
//       index,
//       currentStatus,
//       isLoading,
//       onToggle,
//     }) => {
//       const isPresent =
//         currentStatus === "Present";

//       return (
//         <tr>
//           <td className="text-center">
//             {index + 1}
//           </td>

//           <td>{student.studentSrn || "N/A"}</td>

//           <td>
//             <strong>
//               {student.firstName || "N/A"}
//             </strong>
//             {student.lastName &&
//               ` ${student.lastName}`}
//           </td>

//           <td>
//             {student.fatherName || "N/A"}
//           </td>

//           <td className="text-center">
//             <Button
//               variant={
//                 isPresent
//                   ? "success"
//                   : "danger"
//               }
//               onClick={() => onToggle(student)}
//               disabled={isLoading}
//               style={{
//                 width: "50px",
//                 height: "32px",
//                 padding: 0,
//                 fontWeight: "bold",
//                 border: "none",
//               }}
//             >
//               {isLoading ? (
//                 <FaSpinner className="spin" />
//               ) : isPresent ? (
//                 "P"
//               ) : (
//                 "A"
//               )}
//             </Button>
//           </td>
//         </tr>
//       );
//     }
//   );

//   const TableView = useMemo(() => {
//     if (students.length === 0) {
//       return (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">
//             No students found
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div
//         ref={tableContainerRef}
//         className="table-responsive"
//         style={{
//           maxHeight: "75vh",
//           overflowY: "auto",
//           overflowX: "auto",
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         <Table
//           striped
//           bordered
//           hover
//           style={{
//             minWidth: "500px",
//             marginBottom: 0,
//             background: "white",
//           }}
//         >
//           <thead
//             className="bg-light"
//             style={{
//               position: "sticky",
//               top: 0,
//               zIndex: 5,
//             }}
//           >
//             <tr>
//               <th>S.No.</th>
//               <th>SRN</th>
//               <th>Student Name</th>
//               <th>Father's Name</th>
//               <th>Att.</th>
//             </tr>
//           </thead>

//           <tbody>
//             {students.map((student, index) => (
//               <StudentRow
//                 key={student._id}
//                 student={student}
//                 index={index}
//                 currentStatus={
//                   attendanceStatus[student._id]
//                 }
//                 isLoading={
//                   attendanceLoading[student._id]
//                 }
//                 onToggle={toggleAttendance}
//               />
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   }, [
//     students,
//     attendanceStatus,
//     attendanceLoading,
//     toggleAttendance,
//   ]);

//   const CardView = () => (
//     <Row className="g-3 mt-2">
//       {students.map((student) => {
//         const currentStatus =
//           attendanceStatus[student._id];

//         const isLoading =
//           attendanceLoading[student._id];

//         const isPresent =
//           currentStatus === "Present";

//         return (
//           <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
//             <Card className="h-100 shadow-sm">
//               <Card.Header
//                 className={
//                   isPresent
//                     ? "bg-success text-white"
//                     : "bg-danger text-white"
//                 }
//               >
//                 <div className="d-flex justify-content-between">
//                   <strong>
//                     {student.firstName}
//                   </strong>

//                   <Badge bg="light">
//                     {student.rollNumber}
//                   </Badge>
//                 </div>
//               </Card.Header>

//               <Card.Body>
//                 <p>
//                   <strong>SRN:</strong>{" "}
//                   {student.studentSrn}
//                 </p>

//                 <p>
//                   <strong>Father:</strong>{" "}
//                   {student.fatherName}
//                 </p>
//               </Card.Body>

//               <Card.Footer className="bg-white">
//                 <Button
//                   variant={
//                     isPresent
//                       ? "success"
//                       : "danger"
//                   }
//                   className="w-100"
//                   onClick={() =>
//                     toggleAttendance(student)
//                   }
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <FaSpinner className="spin me-2" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       {isPresent ? (
//                         <FaUserCheck />
//                       ) : (
//                         <FaUserTimes />
//                       )}{" "}
//                       {isPresent
//                         ? "Present"
//                         : "Absent"}
//                     </>
//                   )}
//                 </Button>
//               </Card.Footer>
//             </Card>
//           </Col>
//         );
//       })}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {successMessage && (
//         <Alert
//           variant="success"
//           dismissible
//           onClose={() =>
//             setSuccessMessage(null)
//           }
//         >
//           {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert
//           variant="danger"
//           dismissible
//           onClose={() => setError(null)}
//         >
//           {error}
//         </Alert>
//       )}

//       <Row className="mb-3">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               Filters
//             </Card.Header>

//             <Card.Body>
//               <Row className="g-2">
//                 <Col md={6}>
//                   <SingleDatePicker />
//                 </Col>

//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>

//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Body className="py-2">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <div>
//                   <h5 className="mb-0">
//                     Students List
//                   </h5>

//                   <small className="text-muted">
//                     Total: {students.length}
//                   </small>
//                 </div>

//                 <ToggleButtonGroup
//                   type="radio"
//                   name="viewMode"
//                   value={viewMode}
//                   onChange={(val) =>
//                     val && setViewMode(val)
//                   }
//                 >
//                   <ToggleButton
//                     id="table-view"
//                     value="table"
//                     variant="outline-primary"
//                   >
//                     <FaTable className="me-1" />
//                     Table
//                   </ToggleButton>

//                   <ToggleButton
//                     id="card-view"
//                     value="card"
//                     variant="outline-primary"
//                   >
//                     <FaThLarge className="me-1" />
//                     Card
//                   </ToggleButton>
//                 </ToggleButtonGroup>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" />
//           <p className="mt-3">
//             Loading students...
//           </p>
//         </div>
//       ) : viewMode === "table" ? (
//         TableView
//       ) : (
//         <CardView />
//       )}

//       <style>{`
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         .table-responsive::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }

//         .table-responsive::-webkit-scrollbar-thumb {
//           background: #ccc;
//           border-radius: 10px;
//         }

//         .table th,
//         .table td {
//           vertical-align: middle;
//           white-space: nowrap;
//         }

//         @media (max-width: 768px) {
//           .container-fluid {
//             padding-left: 10px;
//             padding-right: 10px;
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };









// import React, {
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";

// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

// import {
//   School_drop_down,
//   Batch_drop_down,
// } from "../Utils/DependentDropDowns.v2";

// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

// import {
//   GetMBStudents,
//   MarkMBStudentAttendance,
// } from "../../service/Student.service";

// import {
//   Container,
//   Card,
//   Table,
//   Button,
//   Badge,
//   Spinner,
//   ToggleButton,
//   ToggleButtonGroup,
//   Row,
//   Col,
//   Alert,
// } from "react-bootstrap";

// import {
//   FaThLarge,
//   FaTable,
//   FaSpinner,
//   FaUserCheck,
//   FaUserTimes,
// } from "react-icons/fa";

// const StudentRow = React.memo(
//   ({
//     student,
//     index,
//     currentStatus,
//     isLoading,
//     onToggle,
//   }) => {
//     const isPresent = currentStatus === "Present";

//     return (
//       <tr>
//         <td className="text-center">
//           {index + 1}
//         </td>

//         <td>{student.studentSrn || "N/A"}</td>

//         <td>
//           <strong>
//             {student.firstName || "N/A"}
//           </strong>

//           {student.lastName
//             ? ` ${student.lastName}`
//             : ""}
//         </td>

//         <td>
//           {student.fatherName || "N/A"}
//         </td>

//         <td className="text-center">
//           <Button
//             variant={
//               isPresent
//                 ? "success"
//                 : "danger"
//             }
//             onClick={() => onToggle(student)}
//             disabled={isLoading}
//             style={{
//               width: "50px",
//               height: "32px",
//               padding: 0,
//               fontWeight: "bold",
//               border: "none",
//               boxShadow: "none",
//             }}
//           >
//             {isLoading ? (
//               <FaSpinner className="spin" />
//             ) : isPresent ? (
//               "P"
//             ) : (
//               "A"
//             )}
//           </Button>
//         </td>
//       </tr>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.currentStatus ===
//         nextProps.currentStatus &&
//       prevProps.isLoading ===
//         nextProps.isLoading
//     );
//   }
// );

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } =
//     useContext(UserContext);

//   const { schoolContext } = useContext(
//     DistrictBlockSschoolContextV2
//   );

//   const { startDate } = useContext(
//     DateNDateRangeContext
//   );

//   const { batchContext } = useContext(
//     DistrictBlockSschoolContextV2
//   );

//   const [students, setStudents] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [viewMode, setViewMode] =
//     useState("table");

//   const [attendanceStatus, setAttendanceStatus] =
//     useState({});

//   const [attendanceLoading, setAttendanceLoading] =
//     useState({});

//   const [error, setError] =
//     useState(null);

//   const [successMessage, setSuccessMessage] =
//     useState(null);

//   // MAIN FIX
//   const tableWrapperRef = useRef(null);

//   const sortStudentsAlphabetically =
//     useCallback((studentsArray) => {
//       if (
//         !studentsArray ||
//         !Array.isArray(studentsArray)
//       )
//         return [];

//       return [...studentsArray].sort(
//         (a, b) => {
//           const nameA = (
//             a.firstName || ""
//           ).toLowerCase();

//           const nameB = (
//             b.firstName || ""
//           ).toLowerCase();

//           if (nameA < nameB) return -1;
//           if (nameA > nameB) return 1;

//           return 0;
//         }
//       );
//     }, []);

//   const fetchStudents = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const reqBody = {
//       schoolId:
//         schoolContext?.schoolId,

//       batch: batchContext?.batch,

//       startDate: startDate,
//     };

//     try {
//       const response =
//         await GetMBStudents(reqBody);

//       const sortedStudents =
//         sortStudentsAlphabetically(
//           response.data || []
//         );

//       setStudents(sortedStudents);

//       const initialStatus = {};

//       sortedStudents.forEach(
//         (student) => {
//           let status = null;

//           if (
//             student.attendanceStatus
//           ) {
//             status =
//               student.attendanceStatus;
//           } else if (
//             student.status
//           ) {
//             status = student.status;
//           }

//           if (
//             status &&
//             (status === "Present" ||
//               status === "Absent")
//           ) {
//             initialStatus[
//               student._id
//             ] = status;
//           }
//         }
//       );

//       setAttendanceStatus(
//         initialStatus
//       );
//     } catch (error) {
//       setError(
//         "Failed to fetch students."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     schoolContext?.schoolId,
//     batchContext?.batch,
//     startDate,
//     sortStudentsAlphabetically,
//   ]);

//   const handleMarkAttendance =
//     useCallback(
//       async (student, status) => {
//         // SAVE BOTH SCROLLS
//         const scrollTop =
//           tableWrapperRef.current
//             ?.scrollTop || 0;

//         const scrollLeft =
//           tableWrapperRef.current
//             ?.scrollLeft || 0;

//         // INSTANT UI UPDATE
//         setAttendanceStatus(
//           (prev) => ({
//             ...prev,
//             [student._id]: status,
//           })
//         );

//         setAttendanceLoading(
//           (prev) => ({
//             ...prev,
//             [student._id]: true,
//           })
//         );

//         const reqBody = {
//           _id: student._id,
//           status: status,
//           isAttendanceMarked: true,
//           startDate: startDate,
//         };

//         try {
//           await MarkMBStudentAttendance(
//             reqBody
//           );
//         } catch (error) {
//           setError(
//             "Failed to mark attendance."
//           );

//           // REVERT
//           setAttendanceStatus(
//             (prev) => ({
//               ...prev,
//               [student._id]:
//                 status === "Present"
//                   ? "Absent"
//                   : "Present",
//             })
//           );

//           setTimeout(() => {
//             setError(null);
//           }, 3000);
//         } finally {
//           setAttendanceLoading(
//             (prev) => ({
//               ...prev,
//               [student._id]: false,
//             })
//           );

//           // RESTORE SCROLL
//           requestAnimationFrame(() => {
//             if (
//               tableWrapperRef.current
//             ) {
//               tableWrapperRef.current.scrollTop =
//                 scrollTop;

//               tableWrapperRef.current.scrollLeft =
//                 scrollLeft;
//             }
//           });
//         }
//       },
//       [startDate]
//     );

//   const toggleAttendance =
//     useCallback(
//       (student) => {
//         const currentStatus =
//           attendanceStatus[
//             student._id
//           ];

//         const newStatus =
//           currentStatus === "Present"
//             ? "Absent"
//             : "Present";

//         handleMarkAttendance(
//           student,
//           newStatus
//         );
//       },
//       [
//         attendanceStatus,
//         handleMarkAttendance,
//       ]
//     );

//   useEffect(() => {
//     if (
//       schoolContext?.schoolId &&
//       batchContext?.batch
//     ) {
//       fetchStudents();
//     }
//   }, [
//     schoolContext?.schoolId,
//     batchContext?.batch,
//     startDate,
//     fetchStudents,
//   ]);

//   const TableView = useMemo(() => {
//     if (students.length === 0) {
//       return (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">
//             No students found
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div
//         ref={tableWrapperRef}
//         className="attendance-table-wrapper"
//       >
//         <Table
//           striped
//           bordered
//           hover
//           className="attendance-table"
//         >
//           <thead>
//             <tr>
//               <th
//                 style={{
//                   width: "70px",
//                 }}
//               >
//                 S.No.
//               </th>

//               <th
//                 style={{
//                   width: "140px",
//                 }}
//               >
//                 SRN
//               </th>

//               <th
//                 style={{
//                   minWidth: "220px",
//                 }}
//               >
//                 Student Name
//               </th>

//               <th
//                 style={{
//                   minWidth: "220px",
//                 }}
//               >
//                 Father's Name
//               </th>

//               <th
//                 style={{
//                   width: "90px",
//                 }}
//               >
//                 Att.
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {students.map(
//               (student, index) => (
//                 <StudentRow
//                   key={student._id}
//                   student={student}
//                   index={index}
//                   currentStatus={
//                     attendanceStatus[
//                       student._id
//                     ]
//                   }
//                   isLoading={
//                     attendanceLoading[
//                       student._id
//                     ]
//                   }
//                   onToggle={
//                     toggleAttendance
//                   }
//                 />
//               )
//             )}
//           </tbody>
//         </Table>
//       </div>
//     );
//   }, [
//     students,
//     attendanceStatus,
//     attendanceLoading,
//     toggleAttendance,
//   ]);

//   const CardView = () => (
//     <Row className="g-3 mt-2">
//       {students.map((student) => {
//         const currentStatus =
//           attendanceStatus[
//             student._id
//           ];

//         const isLoading =
//           attendanceLoading[
//             student._id
//           ];

//         const isPresent =
//           currentStatus === "Present";

//         return (
//           <Col
//             xs={12}
//             sm={6}
//             md={4}
//             lg={3}
//             key={student._id}
//           >
//             <Card className="h-100 shadow-sm">
//               <Card.Header
//                 className={
//                   isPresent
//                     ? "bg-success text-white"
//                     : "bg-danger text-white"
//                 }
//               >
//                 <div className="d-flex justify-content-between">
//                   <strong>
//                     {student.firstName}
//                   </strong>

//                   <Badge bg="light">
//                     {
//                       student.rollNumber
//                     }
//                   </Badge>
//                 </div>
//               </Card.Header>

//               <Card.Body>
//                 <p>
//                   <strong>SRN:</strong>{" "}
//                   {
//                     student.studentSrn
//                   }
//                 </p>

//                 <p>
//                   <strong>Father:</strong>{" "}
//                   {
//                     student.fatherName
//                   }
//                 </p>
//               </Card.Body>

//               <Card.Footer className="bg-white">
//                 <Button
//                   variant={
//                     isPresent
//                       ? "success"
//                       : "danger"
//                   }
//                   className="w-100"
//                   onClick={() =>
//                     toggleAttendance(
//                       student
//                     )
//                   }
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <FaSpinner className="spin me-2" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       {isPresent ? (
//                         <FaUserCheck />
//                       ) : (
//                         <FaUserTimes />
//                       )}{" "}
//                       {isPresent
//                         ? "Present"
//                         : "Absent"}
//                     </>
//                   )}
//                 </Button>
//               </Card.Footer>
//             </Card>
//           </Col>
//         );
//       })}
//     </Row>
//   );

//   return (
//     <Container
//       fluid
//       className="mt-4 mb-4"
//     >
//       {successMessage && (
//         <Alert
//           variant="success"
//           dismissible
//           onClose={() =>
//             setSuccessMessage(null)
//           }
//         >
//           {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert
//           variant="danger"
//           dismissible
//           onClose={() =>
//             setError(null)
//           }
//         >
//           {error}
//         </Alert>
//       )}

//       <Row className="mb-3">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               Filters
//             </Card.Header>

//             <Card.Body>
//               <Row className="g-2">
//                 <Col md={6}>
//                   <SingleDatePicker />
//                 </Col>

//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>

//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col xs={12}>
//           <div className="d-flex justify-content-between align-items-center flex-wrap">
//             <div>
//               <h5 className="mb-0">
//                 Students List
//               </h5>

//               <small className="text-muted">
//                 Total: {students.length}
//               </small>
//             </div>

//             <ToggleButtonGroup
//               type="radio"
//               name="viewMode"
//               value={viewMode}
//               onChange={(val) =>
//                 val &&
//                 setViewMode(val)
//               }
//             >
//               <ToggleButton
//                 id="table-view"
//                 value="table"
//                 variant="outline-primary"
//               >
//                 <FaTable className="me-1" />
//                 Table
//               </ToggleButton>

//               <ToggleButton
//                 id="card-view"
//                 value="card"
//                 variant="outline-primary"
//               >
//                 <FaThLarge className="me-1" />
//                 Card
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </div>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" />

//           <p className="mt-3">
//             Loading students...
//           </p>
//         </div>
//       ) : viewMode === "table" ? (
//         TableView
//       ) : (
//         <CardView />
//       )}

//       <style>{`
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }

//           to {
//             transform: rotate(360deg);
//           }
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         .attendance-table-wrapper {
//           width: 100%;
//           overflow: auto;
//           -webkit-overflow-scrolling: touch;
//           max-height: 75vh;
//           position: relative;
//         }

//         .attendance-table {
//           min-width: 700px;
//           margin-bottom: 0;
//           background: white;
//         }

//         .attendance-table thead th {
//           position: sticky;
//           top: 0;
//           z-index: 2;
//           background: #f8f9fa;
//         }

//         .attendance-table th,
//         .attendance-table td {
//           vertical-align: middle;
//           white-space: nowrap;
//         }

//         .attendance-table-wrapper::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }

//         .attendance-table-wrapper::-webkit-scrollbar-thumb {
//           background: #c1c1c1;
//           border-radius: 10px;
//         }

//         button {
//           transition: none !important;
//         }

//         @media (max-width: 768px) {
//           .container-fluid {
//             padding-left: 10px;
//             padding-right: 10px;
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };





import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

import {
  School_drop_down,
  Batch_drop_down,
} from "../Utils/DependentDropDowns.v2";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

import {
  GetMBStudents,
  MarkMBStudentAttendance,
} from "../../service/Student.service";

import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

import {
  FaThLarge,
  FaTable,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

const StudentRow = React.memo(
  ({
    student,
    index,
    currentStatus,
    isLoading,
    onToggle,
  }) => {
    const isPresent = currentStatus === "Present";

    return (
      <tr>
        <td className="text-center small-cell">
          {index + 1}
        </td>

        <td className="small-cell">
          {student.studentSrn || "N/A"}
        </td>

        <td className="name-cell">
          <strong>
            {student.firstName || "N/A"}
          </strong>

          {student.lastName
            ? ` ${student.lastName}`
            : ""}
        </td>

        <td className="name-cell">
          {student.fatherName || "N/A"}
        </td>

        <td className="text-center small-cell">
          <Button
            variant={
              isPresent
                ? "success"
                : "danger"
            }
            onClick={() => onToggle(student)}
            disabled={isLoading}
            className="attendance-btn"
          >
            {isLoading ? (
              <FaSpinner className="spin" />
            ) : isPresent ? (
              "P"
            ) : (
              "A"
            )}
          </Button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.currentStatus ===
        nextProps.currentStatus &&
      prevProps.isLoading ===
        nextProps.isLoading
    );
  }
);

export const MBStudentsAttendanceV2 = () => {
  const { userData } =
    useContext(UserContext);

  const { schoolContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const { startDate } = useContext(
    DateNDateRangeContext
  );

  const { batchContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [viewMode, setViewMode] =
    useState("table");

  const [attendanceStatus, setAttendanceStatus] =
    useState({});

  const [attendanceLoading, setAttendanceLoading] =
    useState({});

  const [error, setError] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState(null);

  const tableWrapperRef = useRef(null);

  const sortStudentsAlphabetically =
    useCallback((studentsArray) => {
      if (
        !studentsArray ||
        !Array.isArray(studentsArray)
      )
        return [];

      return [...studentsArray].sort(
        (a, b) => {
          const nameA = (
            a.firstName || ""
          ).toLowerCase();

          const nameB = (
            b.firstName || ""
          ).toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;

          return 0;
        }
      );
    }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const reqBody = {
      schoolId:
        schoolContext?.schoolId,

      batch: batchContext?.batch,

      startDate: startDate,
    };

    try {
      const response =
        await GetMBStudents(reqBody);

      const sortedStudents =
        sortStudentsAlphabetically(
          response.data || []
        );

      setStudents(sortedStudents);

      const initialStatus = {};

      sortedStudents.forEach(
        (student) => {
          let status = null;

          if (
            student.attendanceStatus
          ) {
            status =
              student.attendanceStatus;
          } else if (
            student.status
          ) {
            status = student.status;
          }

          if (
            status &&
            (status === "Present" ||
              status === "Absent")
          ) {
            initialStatus[
              student._id
            ] = status;
          }
        }
      );

      setAttendanceStatus(
        initialStatus
      );
    } catch (error) {
      setError(
        "Failed to fetch students."
      );
    } finally {
      setLoading(false);
    }
  }, [
    schoolContext?.schoolId,
    batchContext?.batch,
    startDate,
    sortStudentsAlphabetically,
  ]);

  const handleMarkAttendance =
    useCallback(
      async (student, status) => {
        const scrollTop =
          tableWrapperRef.current
            ?.scrollTop || 0;

        const scrollLeft =
          tableWrapperRef.current
            ?.scrollLeft || 0;

        setAttendanceStatus(
          (prev) => ({
            ...prev,
            [student._id]: status,
          })
        );

        setAttendanceLoading(
          (prev) => ({
            ...prev,
            [student._id]: true,
          })
        );

        const reqBody = {
          _id: student._id,
          status: status,
          isAttendanceMarked: true,
          startDate: startDate,
        };

        try {
          await MarkMBStudentAttendance(
            reqBody
          );
        } catch (error) {
          setError(
            "Failed to mark attendance."
          );

          setAttendanceStatus(
            (prev) => ({
              ...prev,
              [student._id]:
                status === "Present"
                  ? "Absent"
                  : "Present",
            })
          );

          setTimeout(() => {
            setError(null);
          }, 3000);
        } finally {
          setAttendanceLoading(
            (prev) => ({
              ...prev,
              [student._id]: false,
            })
          );

          requestAnimationFrame(() => {
            if (
              tableWrapperRef.current
            ) {
              tableWrapperRef.current.scrollTop =
                scrollTop;

              tableWrapperRef.current.scrollLeft =
                scrollLeft;
            }
          });
        }
      },
      [startDate]
    );

  const toggleAttendance =
    useCallback(
      (student) => {
        const currentStatus =
          attendanceStatus[
            student._id
          ];

        const newStatus =
          currentStatus === "Present"
            ? "Absent"
            : "Present";

        handleMarkAttendance(
          student,
          newStatus
        );
      },
      [
        attendanceStatus,
        handleMarkAttendance,
      ]
    );

  useEffect(() => {
    if (
      schoolContext?.schoolId &&
      batchContext?.batch
    ) {
      fetchStudents();
    }
  }, [
    schoolContext?.schoolId,
    batchContext?.batch,
    startDate,
    fetchStudents,
  ]);

  const TableView = useMemo(() => {
    if (students.length === 0) {
      return (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">
            No students found
          </p>
        </div>
      );
    }

    return (
      <div
        ref={tableWrapperRef}
        className="attendance-table-wrapper"
      >
        <Table
          striped
          bordered
          hover
          className="attendance-table"
        >
          <thead>
            <tr>
              <th className="small-heading">
                S.No.
              </th>

              <th className="small-heading">
                SRN
              </th>

              <th className="name-heading">
                Student Name
              </th>

              <th className="name-heading">
                Father's Name
              </th>

              <th className="small-heading">
                Att.
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map(
              (student, index) => (
                <StudentRow
                  key={student._id}
                  student={student}
                  index={index}
                  currentStatus={
                    attendanceStatus[
                      student._id
                    ]
                  }
                  isLoading={
                    attendanceLoading[
                      student._id
                    ]
                  }
                  onToggle={
                    toggleAttendance
                  }
                />
              )
            )}
          </tbody>
        </Table>
      </div>
    );
  }, [
    students,
    attendanceStatus,
    attendanceLoading,
    toggleAttendance,
  ]);

  const CardView = () => (
    <Row className="g-2 mt-2">
      {students.map((student) => {
        const currentStatus =
          attendanceStatus[
            student._id
          ];

        const isLoading =
          attendanceLoading[
            student._id
          ];

        const isPresent =
          currentStatus === "Present";

        return (
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={student._id}
          >
            <Card className="h-100 shadow-sm">
              <Card.Header
                className={
                  isPresent
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }
              >
                <div className="d-flex justify-content-between">
                  <strong>
                    {student.firstName}
                  </strong>

                  <Badge bg="light">
                    {
                      student.rollNumber
                    }
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body>
                <p>
                  <strong>SRN:</strong>{" "}
                  {
                    student.studentSrn
                  }
                </p>

                <p>
                  <strong>Father:</strong>{" "}
                  {
                    student.fatherName
                  }
                </p>
              </Card.Body>

              <Card.Footer className="bg-white">
                <Button
                  variant={
                    isPresent
                      ? "success"
                      : "danger"
                  }
                  className="w-100"
                  onClick={() =>
                    toggleAttendance(
                      student
                    )
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spin me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {isPresent ? (
                        <FaUserCheck />
                      ) : (
                        <FaUserTimes />
                      )}{" "}
                      {isPresent
                        ? "Present"
                        : "Absent"}
                    </>
                  )}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Container
      fluid
      className="mt-3 mb-3"
    >
      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() =>
            setSuccessMessage(null)
          }
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setError(null)
          }
        >
          {error}
        </Alert>
      )}

      <Row className="mb-2">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white py-2">
              Filters
            </Card.Header>

            <Card.Body className="py-2">
              <Row className="g-2">
                <Col md={6}>
                  <SingleDatePicker />
                </Col>

                <Col md={3}>
                  <School_drop_down />
                </Col>

                <Col md={3}>
                  <Batch_drop_down />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h6 className="mb-0">
                Students List
              </h6>

              <small className="text-muted">
                Total: {students.length}
              </small>
            </div>

            <ToggleButtonGroup
              type="radio"
              name="viewMode"
              value={viewMode}
              onChange={(val) =>
                val &&
                setViewMode(val)
              }
              size="sm"
            >
              <ToggleButton
                id="table-view"
                value="table"
                variant="outline-primary"
              >
                <FaTable className="me-1" />
                Table
              </ToggleButton>

              <ToggleButton
                id="card-view"
                value="card"
                variant="outline-primary"
              >
                <FaThLarge className="me-1" />
                Card
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />

          <p className="mt-3">
            Loading students...
          </p>
        </div>
      ) : viewMode === "table" ? (
        TableView
      ) : (
        <CardView />
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .attendance-table-wrapper {
          width: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          max-height: 75vh;
          position: relative;
        }

        .attendance-table {
          min-width: 520px;
          margin-bottom: 0;
          background: white;
          font-size: 12px;
        }

        .attendance-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: #f8f9fa;
          font-size: 11px;
          padding: 6px;
        }

        .attendance-table td {
          padding: 5px 6px;
          font-size: 11px;
        }

        .small-heading {
          width: 55px;
        }

        .name-heading {
          min-width: 140px;
        }

        .small-cell {
          width: 55px;
        }

        .name-cell {
          min-width: 140px;
        }

        .attendance-btn {
          width: 38px;
          height: 28px;
          padding: 0;
          font-size: 11px;
          font-weight: bold;
          border: none;
          box-shadow: none;
        }

        .attendance-table th,
        .attendance-table td {
          vertical-align: middle;
          white-space: nowrap;
        }

        .attendance-table-wrapper::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .attendance-table-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        button {
          transition: none !important;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 8px;
            padding-right: 8px;
          }

          .attendance-table {
            min-width: 480px;
            font-size: 10px;
          }

          .attendance-table thead th {
            font-size: 10px;
            padding: 5px;
          }

          .attendance-table td {
            font-size: 10px;
            padding: 4px 5px;
          }

          .name-heading,
          .name-cell {
            min-width: 115px;
          }

          .attendance-btn {
            width: 34px;
            height: 26px;
            font-size: 10px;
          }
        }
      `}</style>
    </Container>
  );
};