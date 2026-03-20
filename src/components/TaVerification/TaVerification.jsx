
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
//           fatherName: record.fatherName || "N/A", // 🔽 Add fatherName field with proper fallback
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
    
//     // Debug: Check if fatherName exists in the data
//     console.log("Sample student with fatherName:", sortedArray[0]?.studentName, "Father:", sortedArray[0]?.fatherName);
//     console.log("First few records with fatherName:", data.slice(0, 3).map(r => ({
//       name: r.studentName,
//       fatherName: r.fatherName,
//       hasFatherName: !!r.fatherName
//     })));
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
//       <h4>Attendance Verification</h4>

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
//                           <Col md={3}>
//                             {student.studentName}
//                           </Col>
//                           <Col md={2}>
//                             <small>
//                               {student.fatherName && student.fatherName !== "N/A" ? student.fatherName : "Not Available"}
//                             </small>
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
//                           <Col md={1}>
//                             <Badge 
//                               bg={
//                                 attendancePercentage >= 75 ? "success" :
//                                 attendancePercentage >= 50 ? "warning" : "danger"
//                               }
//                             >
//                               {attendancePercentage}%
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
//                                   <p><strong>Student Name:</strong> {student.studentName}</p>
//                                   <p><strong>Father's Name:</strong> {student.fatherName && student.fatherName !== "N/A" ? student.fatherName : "Not Available"}</p>
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
  Accordion,
  Button,
  Card,
  Form,
  Row,
  Col,
  Table,
  Badge,
  Container
} from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import { GetStudentAttendanceDashboard } from "../../service/TaServices/Ta.service";
import { UpdateAttendanceStatus } from "../../service/TaServices/Ta.service";

export const TaVerification = () => {

  const { userData } = useContext(UserContext);

  // 🔽 Month & Year state
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [availableClasses, setAvailableClasses] = useState([]);
  
  // 🔽 State to store attendance data and student summary
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentSummary, setStudentSummary] = useState([]);
  const [sortedStudentSummary, setSortedStudentSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 🔽 State for tracking pending updates (for UI only)
  const [pendingCount, setPendingCount] = useState(0);
  
  // 🔽 Store original data for reference
  const [originalData, setOriginalData] = useState(null);

  // 🧠 Function to check if a date is Sunday
  const isSunday = (dateString) => {
    if (!dateString || dateString === "N/A") return false;
    try {
      const date = new Date(dateString);
      return date.getDay() === 0;
    } catch (error) {
      console.error("Error checking day:", error);
      return false;
    }
  };

  // 🧠 Build req.body from userData
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

  // 🔘 Submit handler (Initial load)
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
      
      // Store original data
      setOriginalData(response.data.data || []);
      setAttendanceData(response.data.data || []);
      calculateStudentSummary(response.data.data || []);
      setPendingCount(0);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔘 Save Changes button - Just refreshes the UI with latest data
  const handleSaveChanges = async () => {
    if (pendingCount === 0) {
      alert("No changes to save");
      return;
    }

    setIsSaving(true);
    
    try {
      // Simply refresh the data from backend
      const baseReqBody = buildReqBody();
      const reqBody = {
        ...baseReqBody,
        month,
        year
      };

      const response = await GetStudentAttendanceDashboard(reqBody);
      console.log("Refreshed Data 👉", response.data.data);
      
      setAttendanceData(response.data.data || []);
      calculateStudentSummary(response.data.data || []);
      setOriginalData(response.data.data || []);
      setPendingCount(0);
      
      alert("Data Updated!");

    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Failed to refresh data. Please try again.");
    } finally {
      setIsSaving(false);
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
          fatherName: record.fatherName || "N/A",
          class: record.class || "N/A",
          rollNo: record.rollNo || "N/A",
          center: record.center || "N/A",
          district: record.district || "N/A",
          bothSideDistance: record.bothSideDistance || 0,
          singleSideDistance: record.singleSideDistance || 0,
          presentCount: 0,
          absentCount: 0,
          totalRecords: 0,
          attendanceRecords: []
        };
      }
      
      // Skip Sunday records from counting
      if (isSunday(record.date)) {
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
          isSunday: true
        });
        return;
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
        isSunday: false
      });
    });
    
    const summaryArray = Object.values(summaryMap);
    setStudentSummary(summaryArray);
    
    const sortedArray = [...summaryArray].sort((a, b) => {
      const nameA = a.studentName?.toLowerCase() || "";
      const nameB = b.studentName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
    
    setSortedStudentSummary(sortedArray);
  };

  // 🔘 Handle attendance toggle - Updates in REAL TIME in backend
  const handleAttendanceToggle = async (recordId, studentSrn, studentIndex, recordIndex, currentStatus, isSundayRecord) => {
    if (isSundayRecord) {
      alert("Cannot update attendance for Sundays");
      return;
    }

    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    
    // Optimistic UI update
    const updatedStudentSummary = [...sortedStudentSummary];
    const student = updatedStudentSummary[studentIndex];
    const record = student.attendanceRecords[recordIndex];
    
    // Store previous values for rollback
    const previousStatus = record.status;
    const previousPresentCount = student.presentCount;
    const previousAbsentCount = student.absentCount;
    
    // Update UI immediately
    record.status = newStatus;
    
    if (!record.isSunday) {
      if (newStatus === "Present") {
        student.presentCount += 1;
        student.absentCount -= 1;
      } else {
        student.presentCount -= 1;
        student.absentCount += 1;
      }
    }
    
    setSortedStudentSummary(updatedStudentSummary);
    setPendingCount(prev => prev + 1);

    try {
      // REAL TIME backend update
      const updateData = {
        _id: recordId,
        status: newStatus,
        studentSrn: studentSrn // Send studentSrn for distance updates if needed
      };

      const response = await UpdateAttendanceStatus(updateData);
      
      if (!response.data?.success) {
        // Rollback if API fails
        const rollbackSummary = [...sortedStudentSummary];
        const rollbackStudent = rollbackSummary[studentIndex];
        const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
        
        rollbackRecord.status = previousStatus;
        rollbackStudent.presentCount = previousPresentCount;
        rollbackStudent.absentCount = previousAbsentCount;
        
        setSortedStudentSummary(rollbackSummary);
        setPendingCount(prev => prev - 1);
        alert(response.data?.message || "Failed to update attendance");
      }
      
    } catch (error) {
      console.error("Error updating attendance:", error);
      
      // Rollback on error
      const rollbackSummary = [...sortedStudentSummary];
      const rollbackStudent = rollbackSummary[studentIndex];
      const rollbackRecord = rollbackStudent.attendanceRecords[recordIndex];
      
      rollbackRecord.status = previousStatus;
      rollbackStudent.presentCount = previousPresentCount;
      rollbackStudent.absentCount = previousAbsentCount;
      
      setSortedStudentSummary(rollbackSummary);
      setPendingCount(prev => prev - 1);
      alert("Failed to update attendance. Please try again.");
    }
  };

  // 🔘 Handle distance change - Updates in REAL TIME in backend
  const handleDistanceChange = async (studentIndex, value, studentSrn) => {
    const student = sortedStudentSummary[studentIndex];
    const attendanceRecordId = student.attendanceRecords[0]?._id;
    
    if (!attendanceRecordId) {
      alert("No attendance record found for this student");
      return;
    }

    // Validate
    // if (value === "" || isNaN(value) || Number(value) < 0) {
    //   alert("Please enter a valid positive number");
    //   return;
    // }

    const newDistance = Number(value);
    
    // Optimistic UI update
    const previousDistance = student.bothSideDistance;
    const updatedStudentSummary = [...sortedStudentSummary];
    updatedStudentSummary[studentIndex].bothSideDistance = newDistance;
    setSortedStudentSummary(updatedStudentSummary);
    setPendingCount(prev => prev + 1);

    try {
      // REAL TIME backend update with studentSrn
      const updateData = {
        _id: attendanceRecordId,
        bothSideDistance: newDistance,
        studentSrn: studentSrn // Send studentSrn for correct student lookup
      };

      console.log("Updating distance with:", updateData);
      const response = await UpdateAttendanceStatus(updateData);
      
      if (!response.data?.success) {
        // Rollback if API fails
        const rollbackSummary = [...sortedStudentSummary];
        rollbackSummary[studentIndex].bothSideDistance = previousDistance;
        setSortedStudentSummary(rollbackSummary);
        setPendingCount(prev => prev - 1);
        alert(response.data?.message || "Failed to update distance");
      }
      
    } catch (error) {
      console.error("Error updating distance:", error);
      
      // Rollback on error
      const rollbackSummary = [...sortedStudentSummary];
      rollbackSummary[studentIndex].bothSideDistance = previousDistance;
      setSortedStudentSummary(rollbackSummary);
      setPendingCount(prev => prev - 1);
      alert("Failed to update distance. Please try again.");
    }
  };

  // 🔘 Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  // 🔘 Get day name
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

  // 🔘 Extract classes from userData
  useEffect(() => {
    if (userData?.userAccess?.classId) {
      const classes = userData.userAccess.classId;
      setAvailableClasses(classes);
      if (classes.length === 1) {
        setSelectedClass(classes[0]);
      }
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
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Form.Select>
        </Col>

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
            {isLoading ? "Loading..." : "Load Data"}
          </Button>
        </Col>

        {/* 🔽 SINGLE SAVE CHANGES BUTTON */}
        <Col md={4}>
          <Button 
            variant="success" 
            onClick={handleSaveChanges}
            disabled={isLoading || isSaving || pendingCount === 0}
            className="w-100"
          >
            {isSaving ? (
              <>🔄 Refreshing...</>
            ) : (
              <>💾 Save Changes {pendingCount > 0 && `(${pendingCount})`}</>
            )}
          </Button>
        </Col>
      </Row>

      {/* 🔽 Pending Changes Indicator */}
      {pendingCount > 0 && (
        <Row className="mt-2">
          <Col>
            <Badge bg="warning" text="dark" className="p-2">
              ⚡ {pendingCount} change(s) made - Click Save Changes to refresh view
            </Badge>
          </Col>
        </Row>
      )}

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
      {(isLoading || isSaving) && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">{isSaving ? "Refreshing data..." : "Loading attendance data..."}</p>
        </div>
      )}

      {/* 🔽 STUDENT ATTENDANCE DASHBOARD */}
      {!isLoading && !isSaving && sortedStudentSummary.length > 0 && (
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
                          <Col md={2}>
                            {student.studentName}
                          </Col>
                          <Col md={1}>
                            <small>
                              {student.fatherName && student.fatherName !== "N/A" ? student.fatherName : "N/A"}
                            </small>
                          </Col>
                          {/* 🔽 DISTANCE INPUT - Real-time update */}
                          <Col md={1}>
                            <Form.Control
                              type="number"
                              size="sm"
                              value={student.bothSideDistance || 0}
                              onChange={(e) => handleDistanceChange(
                                studentIndex, 
                                e.target.value,
                                student.studentSrn // Pass studentSrn
                              )}
                              style={{ width: "80px" }}
                              placeholder="Dist"
                              min="0"
                              step="0.5"
                            />
                          </Col>
                          <Col md={1}>
                            <Badge bg="success">{student.presentCount} P</Badge>
                          </Col>
                          <Col md={1}>
                            <Badge bg="danger">{student.absentCount} A</Badge>
                          </Col>
                          <Col md={1}>
                            <Badge bg="info">{totalWorkingDays} D</Badge>
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
                      {/* Student Details */}
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
                                  <p><strong>Both Side Distance:</strong> {student.bothSideDistance || 0} km</p>
                                  {/* <p><strong>Single Side Distance:</strong> {student.singleSideDistance || 0} km</p> */}
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
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      {/* Daily Attendance Records */}
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
                              const dayName = getDayName(record.date);
                              const isSundayRecord = record.isSunday || dayName === 'Sun';
                              
                              return (
                                <tr 
                                  key={recordIndex}
                                  className={isSundayRecord ? "table-secondary" : ""}
                                >
                                  <td>{recordIndex + 1}</td>
                                  <td>{formatDate(record.date)}</td>
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
                                    </Badge>
                                  </td>
                                  <td>
                                    {isSundayRecord ? (
                                      <div className="text-muted">
                                        <small>No attendance on Sundays</small>
                                      </div>
                                    ) : (
                                      <Form.Check 
                                        type="switch"
                                        id={`switch-${record._id}`}
                                        label={record.status === "Present" ? "Present" : "Absent"}
                                        checked={record.status === "Present"}
                                        onChange={() => handleAttendanceToggle(
                                          record._id,
                                          student.studentSrn,
                                          studentIndex,
                                          recordIndex,
                                          record.status,
                                          isSundayRecord
                                        )}
                                        className="me-3"
                                      />
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
              Total Absent: {sortedStudentSummary.reduce((sum, student) => sum + student.absentCount, 0)}
            </small>
          </Card.Footer>
        </Card>
      )}

      {/* No Data Message */}
      {!isLoading && !isSaving && sortedStudentSummary.length === 0 && attendanceData.length === 0 && month && year && (
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


