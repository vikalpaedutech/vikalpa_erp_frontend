// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, StudentAbsenteeCalling } from "../../service/Student.service";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form } from "react-bootstrap";
// import { FaCheckCircle, FaSpinner, FaTimesCircle, FaUserTimes, FaPhoneAlt, FaSave, FaPhone, FaMobileAlt, FaUserFriends } from "react-icons/fa";
// import Select from "react-select";

// export const StudentAbsenteeCallingV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [attendanceStatus, setAttendanceStatus] = useState({});
//   const [attendanceLoading, setAttendanceLoading] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
  
//   // Store call data for each student
//   const [callData, setCallData] = useState({});
  
//   // Form state for each student
//   const [formStates, setFormStates] = useState({});

//   // Dropdown options
//   const callingStatusOptions = [
//     { value: "Connected", label: "Connected" },
//     { value: "Not Connected", label: "Not Connected" }
//   ];

//   const connectedRemarkOptions = [
//     { value: "Sick", label: "Sick" },
//     { value: "Out of town", label: "Out of town" },
//     { value: "Not interested", label: "Not interested" },
//     { value: "Parent denying", label: "Parent denying" },
//     { value: "Wants SLC", label: "Wants SLC" }
//   ];

//   const notConnectedRemarkOptions = [
//     { value: "Call not picked", label: "Call not picked" },
//     { value: "Wrong number", label: "Wrong number" }
//   ];

//   // Helper function to get student status from any source
//   const getStudentStatus = (student) => {
//     if (attendanceStatus[student._id]) {
//       return attendanceStatus[student._id];
//     }
//     if (student.attendanceRecord && student.attendanceRecord.status) {
//       return student.attendanceRecord.status;
//     }
//     if (student.attendanceStatus) {
//       return student.attendanceStatus;
//     }
//     if (student.status) {
//       return student.status;
//     }
//     return null;
//   };

//   const fetchStudents = async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate
//     };

//     console.log("Fetching students with:", reqBody);
    
//     try {
//       const response = await GetMBStudents(reqBody);
//       console.log("Students data:", response.data);
//       console.log("Selected date from API:", response.selectedDate);
      
//       setStudents(response.data || []);
//       setSelectedDate(response.selectedDate || null);
      
//       const initialStatus = {};
//       const initialCallData = {};
      
//       response.data?.forEach(student => {
//         let status = null;
        
//         if (student.attendanceRecord && student.attendanceRecord.status) {
//           status = student.attendanceRecord.status;
//         } else if (student.attendanceStatus) {
//           status = student.attendanceStatus;
//         } else if (student.status) {
//           status = student.status;
//         }
        
//         if (status && (status === "Present" || status === "Absent")) {
//           initialStatus[student._id] = status;
//         }
        
//         // Store existing call data if available
//         if (student.attendanceRecord) {
//           initialCallData[student._id] = {
//             absenteeCallingStatus: student.attendanceRecord.absenteeCallingStatus,
//             callingRemark1: student.attendanceRecord.callingRemark1,
//             callingRemark2: student.attendanceRecord.callingRemark2,
//             comments: student.attendanceRecord.comments,
//             updatedAt: student.attendanceRecord.updatedAt
//           };
//         }
//       });
      
//       console.log("Initial attendance status from API:", initialStatus);
//       setAttendanceStatus(initialStatus);
//       setCallData(initialCallData);
      
//       // Initialize form states for each student
//       const initialFormStates = {};
//       response.data?.forEach(student => {
//         initialFormStates[student._id] = {
//           callingStatus: null,
//           callingRemark1: null,
//           callingRemark2: "",
//           comments: "",
//           showCorrectNumberInput: false,
//           correctNumber: ""
//         };
//       });
//       setFormStates(initialFormStates);
      
//     } catch (error) {
//       console.log("Error fetching students:", error);
//       setError("Failed to fetch students. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMakeCall = async (studentId) => {
//     const formState = formStates[studentId];
//     if (!formState) return;

//     setAttendanceLoading(prev => ({
//       ...prev,
//       [studentId]: true
//     }));

//     // Prepare remark2 based on conditions
//     let remark2Value = formState.callingRemark2;
//     if (formState.callingRemark1?.value === "Wrong number" && formState.correctNumber) {
//       remark2Value = formState.correctNumber;
//     }

//     const reqBody = {
//       _id: studentId,
//       status: "Absent",
//       isAttendanceMarked: false,
//       startDate: startDate,
//       absenteeCallingStatus: formState.callingStatus?.value || "",
//       callingRemark1: formState.callingRemark1?.value || "",
//       callingRemark2: remark2Value || "",
//       comments: formState.comments || ""
//     };

//     console.log("Making call with reqBody:", reqBody);

//     try {
//       const response = await StudentAbsenteeCalling(reqBody);
//       console.log("Call response:", response);
      
//       if (response.success) {
//         // Update call data for this student
//         setCallData(prev => ({
//           ...prev,
//           [studentId]: {
//             absenteeCallingStatus: formState.callingStatus?.value,
//             callingRemark1: formState.callingRemark1?.value,
//             callingRemark2: remark2Value,
//             comments: formState.comments,
//             updatedAt: new Date().toISOString()
//           }
//         }));
        
//         setSuccessMessage(`Call status updated for ${response.data?.studentName || 'student'}`);
        
//         // Reset form state for this student
//         setFormStates(prev => ({
//           ...prev,
//           [studentId]: {
//             callingStatus: null,
//             callingRemark1: null,
//             callingRemark2: "",
//             comments: "",
//             showCorrectNumberInput: false,
//             correctNumber: ""
//           }
//         }));
        
//         setTimeout(() => {
//           setSuccessMessage(null);
//         }, 3000);
//       } else {
//         setError(`Failed to update: ${response.message}`);
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       }
//     } catch (error) {
//       console.error("Error making call:", error);
//       setError("Failed to update call status. Please try again.");
//       setTimeout(() => {
//         setError(null);
//       }, 3000);
//     } finally {
//       setAttendanceLoading(prev => ({
//         ...prev,
//         [studentId]: false
//       }));
//     }
//   };

//   // Update form state for a specific student
//   const updateFormState = (studentId, field, value) => {
//     setFormStates(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [field]: value
//       }
//     }));
//   };

//   // Handle remark1 change for a specific student
//   const handleRemark1Change = (studentId, selectedOption) => {
//     updateFormState(studentId, 'callingRemark1', selectedOption);
//     updateFormState(studentId, 'callingRemark2', "");
//     updateFormState(studentId, 'showCorrectNumberInput', false);
//     updateFormState(studentId, 'correctNumber', "");
    
//     // Show correct number input if "Wrong number" is selected
//     if (selectedOption?.value === "Wrong number") {
//       updateFormState(studentId, 'showCorrectNumberInput', true);
//     }
//   };

//   // Get remark options based on calling status for a specific student
//   const getRemarkOptions = (callingStatus) => {
//     if (callingStatus?.value === "Connected") {
//       return connectedRemarkOptions;
//     } else if (callingStatus?.value === "Not Connected") {
//       return notConnectedRemarkOptions;
//     }
//     return [];
//   };

//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch) {
//       fetchStudents();
//     }
//   }, [schoolContext, batchContext, startDate]);

//   // Filter only absent students
//   const absentStudents = students.filter(student => {
//     let status = null;
    
//     if (attendanceStatus[student._id]) {
//       status = attendanceStatus[student._id];
//     } else if (student.attendanceRecord && student.attendanceRecord.status) {
//       status = student.attendanceRecord.status;
//     } else if (student.attendanceStatus) {
//       status = student.attendanceStatus;
//     } else if (student.status) {
//       status = student.status;
//     }
    
//     return status === "Absent";
//   });

//   const CardView = () => (
//     <Row className="g-3 mt-3">
//       {absentStudents.length > 0 ? (
//         absentStudents.map((student, index) => {
//           const currentStatus = getStudentStatus(student);
//           const isLoading = attendanceLoading[student._id];
//           const formState = formStates[student._id] || {
//             callingStatus: null,
//             callingRemark1: null,
//             callingRemark2: "",
//             comments: "",
//             showCorrectNumberInput: false,
//             correctNumber: ""
//           };
//           const studentCallData = callData[student._id];
          
//           // Determine card color based on calling status
//           let cardBorderClass = "border-secondary";
//           let cardBgClass = "";
//           if (studentCallData?.absenteeCallingStatus === "Connected") {
//             cardBorderClass = "border-success";
//             cardBgClass = "bg-success-light";
//           } else if (studentCallData?.absenteeCallingStatus === "Not Connected") {
//             cardBorderClass = "border-danger";
//             cardBgClass = "bg-danger-light";
//           }
          
//           return (
//             <Col xs={12} md={6} lg={4} key={student._id}>
//               <Card className={`h-100 shadow-sm ${cardBorderClass} ${cardBgClass}`}>
//                 <Card.Header className={studentCallData?.absenteeCallingStatus === "Connected" ? "bg-success text-white" : studentCallData?.absenteeCallingStatus === "Not Connected" ? "bg-danger text-white" : "bg-danger text-white"}>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <strong>{student.firstName || 'N/A'} {student.lastName || ''}</strong>
//                     <Badge bg="light" text={studentCallData?.absenteeCallingStatus === "Connected" ? "success" : "danger"}>
//                       #{student.rollNumber || 'N/A'}
//                     </Badge>
//                   </div>
//                 </Card.Header>
//                 <Card.Body>
//                   {/* Basic Info */}
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

//                   {/* Contact Numbers - Clickable tel: links */}
//                   <Row className="mb-2">
//                     <Col xs={12}>
//                       <small className="text-muted">Contact Numbers:</small>
//                       <div className="mt-1">
//                         {student.personalContact && (
//                           <a href={`tel:${student.personalContact}`} className="text-decoration-none">
//                             <Badge bg="light" text="dark" className="me-2 mb-1" style={{ cursor: 'pointer' }}>
//                               <FaMobileAlt className="me-1" /> Personal: {student.personalContact}
//                             </Badge>
//                           </a>
//                         )}
//                         {student.parentContact && (
//                           <a href={`tel:${student.parentContact}`} className="text-decoration-none">
//                             <Badge bg="light" text="dark" className="me-2 mb-1" style={{ cursor: 'pointer' }}>
//                               <FaUserFriends className="me-1" /> Parent: {student.parentContact}
//                             </Badge>
//                           </a>
//                         )}
//                         {student.otherContact && (
//                           <a href={`tel:${student.otherContact}`} className="text-decoration-none">
//                             <Badge bg="light" text="dark" className="me-2 mb-1" style={{ cursor: 'pointer' }}>
//                               <FaPhone className="me-1" /> Other: {student.otherContact}
//                             </Badge>
//                           </a>
//                         )}
//                         {!student.personalContact && !student.parentContact && !student.otherContact && (
//                           <span className="text-muted">No contacts available</span>
//                         )}
//                       </div>
//                     </Col>
//                   </Row>

//                   {/* Current Status Badge */}
//                   <Row className="mb-3">
//                     <Col xs={12}>
//                       <small className="text-muted">Status:</small>
//                       <div className="mt-1">
//                         <Badge bg="danger" className="px-3 py-2">
//                           <FaTimesCircle className="me-1" />
//                           {currentStatus || 'Absent'}
//                         </Badge>
//                       </div>
//                     </Col>
//                   </Row>

//                   {/* Previous Call Data if exists */}
//                   {studentCallData && studentCallData.absenteeCallingStatus && (
//                     <div className="mb-3 p-2 border rounded bg-light">
//                       <small className="text-muted fw-bold">Last Call Update:</small>
//                       <div className="mt-1">
//                         <Badge bg={studentCallData.absenteeCallingStatus === "Connected" ? "success" : "danger"} className="mb-1">
//                           Status: {studentCallData.absenteeCallingStatus}
//                         </Badge>
//                         {studentCallData.callingRemark1 && (
//                           <div><small><strong>Remark:</strong> {studentCallData.callingRemark1}</small></div>
//                         )}
//                         {studentCallData.callingRemark2 && (
//                           <div><small><strong>Details:</strong> {studentCallData.callingRemark2}</small></div>
//                         )}
//                         {studentCallData.comments && (
//                           <div><small><strong>Comments:</strong> {studentCallData.comments}</small></div>
//                         )}
//                         {studentCallData.updatedAt && (
//                           <div><small><strong>Updated:</strong> {new Date(studentCallData.updatedAt).toLocaleString()}</small></div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Call Form Section */}
//                   <div className="mt-3">
//                     <hr />
//                     <h6 className="mb-3">Make New Call</h6>
                    
//                     {/* Calling Status */}
//                     <Form.Group className="mb-3">
//                       <Form.Label>Calling Status <span className="text-danger">*</span></Form.Label>
//                       <Select
//                         options={callingStatusOptions}
//                         value={formState.callingStatus}
//                         onChange={(option) => updateFormState(student._id, 'callingStatus', option)}
//                         placeholder="Select calling status..."
//                         isClearable
//                         styles={{
//                           control: (base) => ({
//                             ...base,
//                             borderColor: '#ced4da',
//                             '&:hover': { borderColor: '#86b7fe' }
//                           })
//                         }}
//                       />
//                     </Form.Group>

//                     {/* Remark 1 - Depends on Calling Status */}
//                     {formState.callingStatus && (
//                       <Form.Group className="mb-3">
//                         <Form.Label>Remark <span className="text-danger">*</span></Form.Label>
//                         <Select
//                           options={getRemarkOptions(formState.callingStatus)}
//                           value={formState.callingRemark1}
//                           onChange={(option) => handleRemark1Change(student._id, option)}
//                           placeholder="Select remark..."
//                           isClearable
//                           styles={{
//                             control: (base) => ({
//                               ...base,
//                               borderColor: '#ced4da',
//                               '&:hover': { borderColor: '#86b7fe' }
//                             })
//                           }}
//                         />
//                       </Form.Group>
//                     )}

//                     {/* Correct Number Input - Shows only when Wrong Number is selected (Not mandatory) */}
//                     {formState.showCorrectNumberInput && (
//                       <Form.Group className="mb-3">
//                         <Form.Label>Enter Correct Number</Form.Label>
//                           <Form.Control
//                           type="tel"
//                           value={formState.correctNumber}
//                           onChange={(e) => updateFormState(student._id, 'correctNumber', e.target.value)}
//                           placeholder="Enter the correct phone number (optional)..."
//                         />
//                         <Form.Text className="text-muted">
//                           Please provide the updated/correct phone number (optional)
//                         </Form.Text>
//                       </Form.Group>
//                     )}

//                     {/* Comments - Only show for Connected status */}
//                     {formState.callingStatus?.value === "Connected" && formState.callingRemark1 && (
//                       <Form.Group className="mb-3">
//                         <Form.Label>Comments</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           value={formState.comments}
//                           onChange={(e) => updateFormState(student._id, 'comments', e.target.value)}
//                           placeholder="Enter any comments about the call..."
//                         />
//                       </Form.Group>
//                     )}
//                   </div>
//                 </Card.Body>
//                 <Card.Footer className="bg-white">
//                   <Button
//                     variant={formState.callingStatus?.value === "Connected" ? "success" : "info"}
//                     className="w-100 d-flex align-items-center justify-content-center gap-2"
//                     onClick={() => handleMakeCall(student._id)}
//                     disabled={isLoading || !formState.callingStatus || !formState.callingRemark1}
//                   >
//                     {isLoading ? (
//                       <>
//                         <FaSpinner className="spin" /> Updating...
//                       </>
//                     ) : (
//                       <>
//                         <FaSave /> Submit Call Update
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
//             <FaCheckCircle size={50} className="mb-3 text-success" />
//             <h5>No Absent Students!</h5>
//             <p>All students are present for {startDate || 'today'}</p>
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
//           <Alert.Heading>Success!</Alert.Heading>
//           <p>{successMessage}</p>
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

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

//       {/* Absent Students List Section */}
//       <Row>
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-danger text-white">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <h5 className="mb-0">
//                   <FaUserTimes className="me-2" />
//                   Absent Students List
//                 </h5>
//                 <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
//                   <Badge bg="light" text="danger" className="ms-2">
//                     Total Absent: {absentStudents.length} Students
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Header>
//             <Card.Body>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="danger" />
//                   <p className="mt-3">Loading students...</p>
//                 </div>
//               ) : (
//                 <>
//                   {absentStudents.length > 0 && (
//                     <div className="mb-3 text-muted">
//                       <small>Showing {absentStudents.length} absent student(s) for selected filters and date: <strong>{startDate || 'Today'}</strong></small>
//                     </div>
//                   )}
//                   <CardView />
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

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
//         .bg-success-light {
//           background-color: #d4edda;
//         }
//         .bg-danger-light {
//           background-color: #f8d7da;
//         }
//       `}</style>
//     </Container>
//   );
// };






import React, { useState, useEffect, useContext, memo } from "react";
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
  StudentAbsenteeCalling,
} from "../../service/Student.service";

import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Row,
  Col,
  Alert,
  Form,
} from "react-bootstrap";

import {
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
  FaUserTimes,
  FaSave,
  FaPhone,
  FaMobileAlt,
  FaUserFriends,
} from "react-icons/fa";

import Select from "react-select";
import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";

/* =========================
   OPTIONS
========================= */

const callingStatusOptions = [
  { value: "Connected", label: "Connected" },
  { value: "Not Connected", label: "Not Connected" },
];

const connectedRemarkOptions = [
  { value: "Health Issues", label: "Health Issues" },
   { value: "Student was travelling", label: "Student was travelling" },
    { value: "Did not receive class link", label: "Did not receive class link" },
     { value: "No internet available", label: "No internet available" },
      { value: "Attending a function", label: "Attending a function" },
       { value: " Do not have mobile phone", label: " Do not have mobile phone" },

       
  { value: "Sick", label: "Sick" },
  { value: "Out of town", label: "Out of town" },
  { value: "Not interested", label: "Not interested" },
  { value: "Parent denying", label: "Parent denying" },
  { value: "Wants SLC", label: "Wants SLC" },
];

const notConnectedRemarkOptions = [
  { value: "Call not picked", label: "Call not picked" },
  { value: "Wrong number", label: "Wrong number" },
];

/* =========================
   STUDENT CARD
========================= */

const StudentCard = memo(
  ({
    student,
    currentStatus,
    studentCallData,
    onSubmit,
    isLoading,
  }) => {
    // LOCAL STATES
    const [callingStatus, setCallingStatus] = useState(null);
    const [callingRemark1, setCallingRemark1] = useState(null);
    const [correctNumber, setCorrectNumber] = useState("");
    const [comments, setComments] = useState("");

    const getRemarkOptions = () => {
      if (callingStatus?.value === "Connected") {
        return connectedRemarkOptions;
      }

      if (callingStatus?.value === "Not Connected") {
        return notConnectedRemarkOptions;
      }

      return [];
    };

    const handleRemarkChange = (selectedOption) => {
      setCallingRemark1(selectedOption);

      // reset
      setCorrectNumber("");
    };

    const handleSubmit = () => {
      let remark2 = "";

      if (callingRemark1?.value === "Wrong number") {
        remark2 = correctNumber;
      }

      onSubmit(student._id, {
        absenteeCallingStatus: callingStatus?.value || "",
        callingRemark1: callingRemark1?.value || "",
        callingRemark2: remark2,
        comments,
      });

      // RESET AFTER SUBMIT
      setCallingStatus(null);
      setCallingRemark1(null);
      setCorrectNumber("");
      setComments("");
    };

    let cardBorderClass = "border-secondary";
    let cardBgClass = "";

    if (studentCallData?.absenteeCallingStatus === "Connected") {
      cardBorderClass = "border-success";
      cardBgClass = "bg-success-light";
    } else if (
      studentCallData?.absenteeCallingStatus === "Not Connected"
    ) {
      cardBorderClass = "border-danger";
      cardBgClass = "bg-danger-light";
    }

    return (
      <Col xs={12} md={6} lg={4}>
        <Card
          className={`h-100 shadow-sm ${cardBorderClass} ${cardBgClass}`}
          style={{
            minHeight: "850px",
            transition: "none",
          }}
        >
          {/* HEADER */}
          <Card.Header
            className={
              studentCallData?.absenteeCallingStatus === "Connected"
                ? "bg-success text-white"
                : "bg-danger text-white"
            }
          >
            <div className="d-flex justify-content-between align-items-center">
              <strong>
                {student.firstName || "N/A"} {student.lastName || ""}
              </strong>

              <Badge
                bg="light"
                text={
                  studentCallData?.absenteeCallingStatus === "Connected"
                    ? "success"
                    : "danger"
                }
              >
                #{student.rollNumber || "N/A"}
              </Badge>
            </div>
          </Card.Header>

          {/* BODY */}
          <Card.Body>
            {/* BASIC INFO */}
            <Row className="mb-2">
              <Col xs={6}>
                <small className="text-muted">Student SRN:</small>
                <p className="mb-0 fw-bold">
                  {student.studentSrn || "N/A"}
                </p>
              </Col>

              <Col xs={6}>
                <small className="text-muted">Father's Name:</small>
                <p className="mb-0 fw-bold">
                  {student.fatherName || "N/A"}
                </p>
              </Col>
            </Row>

            <Row className="mb-2">
             
              {/* <Col xs={6}>
                <small className="text-muted">Batch:</small>
                <p className="mb-0">{student.batch || "N/A"}</p>
              </Col> */}
            </Row>

            {/* CONTACTS */}
            <Row className="mb-3">
              <Col xs={12}>
                <small className="text-muted">Contact Numbers:</small>

                <div className="mt-1">
                  {student.personalContact && (
                    <a
                      href={`tel:${student.personalContact}`}
                      className="text-decoration-none"
                    >
                      <Badge
                        bg="light"
                        text="dark"
                        className="me-2 mb-1"
                      >
                        <FaMobileAlt className="me-1" />
                        Personal: {student.personalContact}
                      </Badge>
                    </a>
                  )}

                  {student.parentContact && (
                    <a
                      href={`tel:${student.parentContact}`}
                      className="text-decoration-none"
                    >
                      <Badge
                        bg="light"
                        text="dark"
                        className="me-2 mb-1"
                      >
                        <FaUserFriends className="me-1" />
                        Parent: {student.parentContact}
                      </Badge>
                    </a>
                  )}

                  {student.otherContact && (
                    <a
                      href={`tel:${student.otherContact}`}
                      className="text-decoration-none"
                    >
                      <Badge
                        bg="light"
                        text="dark"
                        className="me-2 mb-1"
                      >
                        <FaPhone className="me-1" />
                        Other: {student.otherContact}
                      </Badge>
                    </a>
                  )}
                </div>
              </Col>
            </Row>

            {/* STATUS */}
            <Row className="mb-3">
              <Col xs={12}>
                <small className="text-muted">Status:</small>

                <div className="mt-1">
                  <Badge bg="danger" className="px-3 py-2">
                    <FaTimesCircle className="me-1" />
                    {currentStatus || "Absent"}
                  </Badge>
                </div>
              </Col>
            </Row>

            {/* PREVIOUS CALL DATA */}
            {studentCallData &&
              studentCallData.absenteeCallingStatus && (
                <div className="mb-3 p-2 border rounded bg-light">
                  <small className="text-muted fw-bold">
                    Last Call Update:
                  </small>

                  <div className="mt-1">
                    <Badge
                      bg={
                        studentCallData.absenteeCallingStatus ===
                        "Connected"
                          ? "success"
                          : "danger"
                      }
                      className="mb-1"
                    >
                      Status:{" "}
                      {studentCallData.absenteeCallingStatus}
                    </Badge>

                    {studentCallData.callingRemark1 && (
                      <div>
                        <small>
                          <strong>Remark:</strong>{" "}
                          {studentCallData.callingRemark1}
                        </small>
                      </div>
                    )}

                    {studentCallData.callingRemark2 && (
                      <div>
                        <small>
                          <strong>Details:</strong>{" "}
                          {studentCallData.callingRemark2}
                        </small>
                      </div>
                    )}

                    {studentCallData.comments && (
                      <div>
                        <small>
                          <strong>Comments:</strong>{" "}
                          {studentCallData.comments}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* FORM */}
            <hr />

            <h6 className="mb-3">Make New Call</h6>

            {/* CALL STATUS */}
            <Form.Group className="mb-3">
              <Form.Label>
                Calling Status{" "}
                <span className="text-danger">*</span>
              </Form.Label>

              <Select
                options={callingStatusOptions}
                value={callingStatus}
                onChange={setCallingStatus}
                placeholder="Select calling status..."
                isClearable
              />
            </Form.Group>

            {/* REMARK */}
            {callingStatus && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Remark{" "}
                  <span className="text-danger">*</span>
                </Form.Label>

                <Select
                  options={getRemarkOptions()}
                  value={callingRemark1}
                  onChange={handleRemarkChange}
                  placeholder="Select remark..."
                  isClearable
                />
              </Form.Group>
            )}

            {/* CORRECT NUMBER */}
            {callingRemark1?.value === "Wrong number" && (
              <Form.Group className="mb-3">
                <Form.Label>Correct Number</Form.Label>

                <Form.Control
                  type="tel"
                  value={correctNumber}
                  onChange={(e) =>
                    setCorrectNumber(e.target.value)
                  }
                  placeholder="Enter correct number..."
                />
              </Form.Group>
            )}

            {/* COMMENTS */}
            {callingStatus?.value === "Connected" &&
              callingRemark1 && (
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comments}
                    onChange={(e) =>
                      setComments(e.target.value)
                    }
                    placeholder="Enter comments..."
                  />
                </Form.Group>
              )}
          </Card.Body>

          {/* FOOTER */}
          <Card.Footer className="bg-white">
            <Button
              variant={
                callingStatus?.value === "Connected"
                  ? "success"
                  : "info"
              }
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !callingStatus ||
                !callingRemark1
              }
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Submit Call Update
                </>
              )}
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
);

/* =========================
   MAIN COMPONENT
========================= */

export const StudentAbsenteeCallingV2 = () => {
  const { schoolContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const {userData} = useContext(UserContext)
  const { startDate } = useContext(
    DateNDateRangeContext
  );

  const { batchContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [attendanceLoading, setAttendanceLoading] =
    useState({});

  const [callData, setCallData] = useState({});

  const [successMessage, setSuccessMessage] =
    useState(null);

  const [error, setError] = useState(null);

  /* =========================
     GET STATUS
  ========================= */

  const getStudentStatus = (student) => {
    if (
      student.attendanceRecord &&
      student.attendanceRecord.status
    ) {
      return student.attendanceRecord.status;
    }

    if (student.attendanceStatus) {
      return student.attendanceStatus;
    }

    if (student.status) {
      return student.status;
    }

    return null;
  };

  /* =========================
     FETCH STUDENTS
  ========================= */

  const fetchStudents = async () => {
    setLoading(true);

    try {
      const reqBody = {
        schoolId: schoolContext?.schoolId,
        batch: batchContext?.batch,
        startDate,
      };

      const response = await GetMBStudents(reqBody);

      setStudents(response.data || []);

      const initialCallData = {};

      response.data?.forEach((student) => {
        if (student.attendanceRecord) {
          initialCallData[student._id] = {
            absenteeCallingStatus:
              student.attendanceRecord
                .absenteeCallingStatus,

            callingRemark1:
              student.attendanceRecord.callingRemark1,

            callingRemark2:
              student.attendanceRecord.callingRemark2,

            comments:
              student.attendanceRecord.comments,

            updatedAt:
              student.attendanceRecord.updatedAt,
          };
        }
      });

      setCallData(initialCallData);
    } catch (err) {
      console.log(err);

      setError(
        "Failed to fetch students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUBMIT CALL
  ========================= */

  const handleMakeCall = async (
    studentId,
    formData
  ) => {
    setAttendanceLoading((prev) => ({
      ...prev,
      [studentId]: true,
    }));

    try {
      const reqBody = {
        _id: studentId,
        status: "Absent",
        isAttendanceMarked: false,
        startDate,
        ...formData,
      };

      const response =
        await StudentAbsenteeCalling(reqBody);

      if (response.success) {
        setCallData((prev) => ({
          ...prev,
          [studentId]: {
            ...formData,
            updatedAt: new Date().toISOString(),
          },
        }));

        setSuccessMessage(
          "Call status updated successfully!"
        );

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

  const currentDate = new Date().toISOString().split("T")[0]; // "2026-06-18"


  if (startDate === currentDate) {
  //Gamification setup
       await ClaimGamificationPoint({

         pointType:"callingAbsentee",
        date: new Date().toISOString().split("T")[0],
        batch: batchContext?.batch || batchContext,
        schoolId: schoolContext?.schoolId,
        // district_block_schoolsObjectId,
        unqObjectId: userData?._id,
       })
}
      }
    } catch (error) {
      console.log(error);

      setError(
        "Failed to update call status."
      );

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setAttendanceLoading((prev) => ({
        ...prev,
        [studentId]: false,
      }));
    }
  };

  /* =========================
     EFFECT
  ========================= */

  useEffect(() => {
    if (
      schoolContext?.schoolId &&
      batchContext?.batch
    ) {
      fetchStudents();
    }
  }, [schoolContext, batchContext, startDate]);

  /* =========================
     FILTER ABSENT
  ========================= */

  const absentStudents = students.filter(
    (student) =>
      getStudentStatus(student) === "Absent"
  );

  /* =========================
     RETURN
  ========================= */

  return (
    <Container fluid className="mt-4 mb-4">
      {/* SUCCESS */}
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

      {/* ERROR */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* FILTERS */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Filters</h5>
            </Card.Header>

            <Card.Body>
              <Row>
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

      {/* LIST */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-danger text-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-0">
                  <FaUserTimes className="me-2" />
                  Absent Students List
                </h5>

                <Badge bg="light" text="danger">
                  Total Absent: {absentStudents.length}
                </Badge>
              </div>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner
                    animation="border"
                    variant="danger"
                  />

                  <p className="mt-3">
                    Loading students...
                  </p>
                </div>
              ) : (
                <Row className="g-3">
                  {absentStudents.length > 0 ? (
                    absentStudents.map((student) => (
                      <StudentCard
                        key={student._id}
                        student={student}
                        currentStatus={getStudentStatus(
                          student
                        )}
                        studentCallData={
                          callData[student._id]
                        }
                        onSubmit={handleMakeCall}
                        isLoading={
                          attendanceLoading[
                            student._id
                          ]
                        }
                      />
                    ))
                  ) : (
                    <Col xs={12}>
                      <div className="text-center text-muted py-5">
                        <FaCheckCircle
                          size={50}
                          className="mb-3 text-success"
                        />

                        <h5>
                          No Absent Students!
                        </h5>

                        <p>
                          All students are present
                        </p>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* STYLES */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .bg-success-light {
          background-color: #d4edda;
        }

        .bg-danger-light {
          background-color: #f8d7da;
        }
      `}</style>
    </Container>
  );
};