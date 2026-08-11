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
//   GetMBStudentsForAttendance,
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
//   FaClock,
// } from "react-icons/fa";
// import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";


// import { updateDressSize } from "../../service/Student.service";
// // Helper function to check if attendance should be disabled
// const isAttendanceDisabled = (student) => {
//   // Disable attendance marking if:
//   // request === "SLC Released" AND requestStatus === "Pending"
//   if (student?.request === "SLC Released" && student?.requestStatus === "Pending") {
//     return true;
//   }
//   return false;
// };

// const StudentRow = React.memo(
//   ({
//     student,
//     index,
//     currentStatus,
//     isLoading,
//     onToggle,
//   }) => {
//     const isPresent = currentStatus === "Present";
//     const disabled = isAttendanceDisabled(student);

//     return (
//       <tr className={disabled ? "table-warning" : ""}>
//         <td className="text-center small-cell">
//           {index + 1}
//         </td>

//         <td className="small-cell">
//           {student.studentSrn || "N/A"}
//         </td>

//         <td className="name-cell">
//           <strong>
//             {student.firstName || "N/A"}
//           </strong>
//           {student.lastName ? ` ${student.lastName}` : ""}
         
//         </td>

//         <td className="name-cell">
//           {student.fatherName || "N/A"}
//         </td>

//         <td className="text-center small-cell">
//           <Button
//             variant={
//               isPresent
//                 ? "success"
//                 : "danger"
//             }
//             onClick={() => onToggle(student)}
//             disabled={isLoading || disabled}
//             className="attendance-btn"
//             title={disabled ? "Attendance disabled - SLC Release request pending approval" : ""}
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
//       nextProps.currentStatus &&
//       prevProps.isLoading ===
//       nextProps.isLoading &&
//       prevProps.student === nextProps.student
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
//         await GetMBStudentsForAttendance(reqBody);

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
//         // Check if attendance is disabled
//         if (isAttendanceDisabled(student)) {
//           setError("Cannot mark attendance - SLC Release request is pending approval");
//           setTimeout(() => setError(null), 3000);
//           return;
//         }

//         const scrollTop =
//           tableWrapperRef.current
//             ?.scrollTop || 0;

//         const scrollLeft =
//           tableWrapperRef.current
//             ?.scrollLeft || 0;

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

//           // Gamification
//           console.log('i am here')

//           const currentDate = new Date().toISOString().split("T")[0];

//           if (startDate === currentDate) {
//             const gamificationPoint = async () => {
//               console.log("Gamification point updated!")
//               await ClaimGamificationPoint(
//                 {
//                   pointType: "studentAttendance",
//                   date: new Date().toISOString().split("T")[0],
//                   batch: batchContext?.batch || batchContext,
//                   schoolId: schoolContext?.schoolId,
//                   unqObjectId: userData?._id,
//                 }
//               )
//             }
//             gamificationPoint()
//           }

//         } catch (error) {
//           setError(
//             "Failed to mark attendance."
//           );

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

//         console.log(batchContext?.batch)
//       },
//       [startDate, batchContext, schoolContext, userData]
//     );

//   const toggleAttendance =
//     useCallback(
//       (student) => {
//         const currentStatus =
//           attendanceStatus[
//           student._id
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
//               <th className="small-heading">
//                 S.No.
//               </th>

//               <th className="small-heading">
//                 SRN
//               </th>

//               <th className="name-heading">
//                 Student Name
//               </th>

//               <th className="name-heading">
//                 Father's Name
//               </th>

//               <th className="small-heading">
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
//                     student._id
//                     ]
//                   }
//                   isLoading={
//                     attendanceLoading[
//                     student._id
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
//     <Row className="g-2 mt-2">
//       {students.map((student) => {
//         const currentStatus =
//           attendanceStatus[
//           student._id
//           ];

//         const isLoading =
//           attendanceLoading[
//           student._id
//           ];

//         const isPresent =
//           currentStatus === "Present";

//         const disabled = isAttendanceDisabled(student);

//         return (
//           <Col
//             xs={12}
//             sm={6}
//             md={4}
//             lg={3}
//             key={student._id}
//           >
//             <Card className={`h-100 shadow-sm ${disabled ? "border-warning" : ""}`}>
//               <Card.Header
//                 className={
//                   disabled ? "bg-warning text-dark" :
//                   isPresent ? "bg-success text-white" : "bg-danger text-white"
//                 }
//               >
//                 <div className="d-flex justify-content-between align-items-center">
//                   <strong>
//                     {student.firstName}
//                     {disabled && (
//                       <Badge bg="dark" text="white" className="ms-2" style={{ fontSize: '8px' }}>
//                         <FaClock className="me-1" />
//                         Pending
//                       </Badge>
//                     )}
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
                
//                 {disabled && (
//                   <p className="text-warning mb-0">
//                     <FaClock className="me-1" />
//                     <small>SLC Release request pending approval</small>
//                   </p>
//                 )}
//               </Card.Body>

//               <Card.Footer className="bg-white">
//                 <Button
//                   variant={
//                     disabled ? "secondary" :
//                     isPresent ? "success" : "danger"
//                   }
//                   className="w-100"
//                   onClick={() =>
//                     toggleAttendance(
//                       student
//                     )
//                   }
//                   disabled={isLoading || disabled}
//                   title={disabled ? "Attendance disabled - SLC Release request pending approval" : ""}
//                 >
//                   {isLoading ? (
//                     <>
//                       <FaSpinner className="spin me-2" />
//                       Updating...
//                     </>
//                   ) : disabled ? (
//                     <>
//                       <FaClock className="me-2" />
//                       Disabled
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

//   // Count disabled students
//   const disabledCount = students.filter(s => isAttendanceDisabled(s)).length;

//   return (
//     <Container
//       fluid
//       className="mt-3 mb-3"
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

//       <Row className="mb-2">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white py-2">
//               Filters
//             </Card.Header>

//             <Card.Body className="py-2">
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

//       <Row className="mb-2">
//         <Col xs={12}>
//           <div className="d-flex justify-content-between align-items-center flex-wrap">
//             <div>
//               <h6 className="mb-0">
//                 Students List
//               </h6>

//               <small className="text-muted">
//                 Total: {students.length}
//                 {disabledCount > 0 && (
//                   <span className="ms-2 text-warning">
//                     (SLC Pending: {disabledCount})
//                   </span>
//                 )}
//               </small>
//               {disabledCount > 0 && (
//                 <div className="text-muted small mt-1">
//                   <FaClock className="me-1 text-warning" />
//                   SLC Release Request Pending (Approval Waiting) - ये रिकॉर्ड्स की अटेंडेंस डिसेबल है
//                 </div>
//               )}
//             </div>

//             <ToggleButtonGroup
//               type="radio"
//               name="viewMode"
//               value={viewMode}
//               onChange={(val) =>
//                 val &&
//                 setViewMode(val)
//               }
//               size="sm"
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
//           min-width: 520px;
//           margin-bottom: 0;
//           background: white;
//           font-size: 12px;
//         }

//         .attendance-table thead th {
//           position: sticky;
//           top: 0;
//           z-index: 2;
//           background: #f8f9fa;
//           font-size: 11px;
//           padding: 6px;
//         }

//         .attendance-table td {
//           padding: 5px 6px;
//           font-size: 11px;
//         }

//         .small-heading {
//           width: 55px;
//         }

//         .name-heading {
//           min-width: 140px;
//         }

//         .small-cell {
//           width: 55px;
//         }

//         .name-cell {
//           min-width: 140px;
//         }

//         .attendance-btn {
//           width: 38px;
//           height: 28px;
//           padding: 0;
//           font-size: 11px;
//           font-weight: bold;
//           border: none;
//           box-shadow: none;
//         }

//         .attendance-table th,
//         .attendance-table td {
//           vertical-align: middle;
//           white-space: nowrap;
//         }

//         .attendance-table-wrapper::-webkit-scrollbar {
//           width: 5px;
//           height: 5px;
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
//             padding-left: 8px;
//             padding-right: 8px;
//           }

//           .attendance-table {
//             min-width: 480px;
//             font-size: 10px;
//           }

//           .attendance-table thead th {
//             font-size: 10px;
//             padding: 5px;
//           }

//           .attendance-table td {
//             font-size: 10px;
//             padding: 4px 5px;
//           }

//           .name-heading,
//           .name-cell {
//             min-width: 115px;
//           }

//           .attendance-btn {
//             width: 34px;
//             height: 26px;
//             font-size: 10px;
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
//   GetMBStudentsForAttendance,
//   MarkMBStudentAttendance,
//   updateDressSize,
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
//   Form,
// } from "react-bootstrap";

// import {
//   FaThLarge,
//   FaTable,
//   FaSpinner,
//   FaUserCheck,
//   FaUserTimes,
//   FaClock,
// } from "react-icons/fa";
// import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";
// import { studentAttendance } from "../../service/Gamification/Gamification.services";


// // Dress size options
// const DRESS_SIZES = ["", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50"];

// // Helper function to check if attendance should be disabled
// const isAttendanceDisabled = (student) => {
//   if (student?.request === "SLC Released" && student?.requestStatus === "Pending") {
//     return true;
//   }
//   return false;
// };

// const StudentRow = React.memo(
//   ({
//     student,
//     index,
//     currentStatus,
//     isLoading,
//     onToggle,
//     onDressSizeChange,
//     updatingDressSize,
//   }) => {
//     const isPresent = currentStatus === "Present";
//     const disabled = isAttendanceDisabled(student);

//     return (
//       <tr className={disabled ? "table-warning" : ""}>
//         <td className="text-center small-cell">{index + 1}</td>
//         <td className="small-cell">{student.studentSrn || "N/A"}</td>
//         <td className="name-cell">
//           <strong>{student.firstName || "N/A"}</strong>
//           {student.lastName ? ` ${student.lastName}` : ""}
//         </td>
//         <td className="name-cell">{student.fatherName || "N/A"}</td>
//         <td className="text-center small-cell">
//           <Button
//             variant={isPresent ? "success" : "danger"}
//             onClick={() => onToggle(student)}
//             disabled={isLoading || disabled}
//             className="attendance-btn"
//             title={disabled ? "Attendance disabled - SLC Release request pending approval" : ""}
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
//         <td className="text-center dress-size-cell">
//           <Form.Select
//             size="sm"
//             value={student.shirtSizeInInches || ""}
//             onChange={(e) => onDressSizeChange(student._id, "shirtSizeInInches", e.target.value)}
//             disabled={updatingDressSize[student._id] || false}
//             className="dress-size-select"
//           >
//             {DRESS_SIZES.map((size) => (
//               <option key={`shirt-${size}`} value={size}>
//                 {size || "Select"}
//               </option>
//             ))}
//           </Form.Select>
//         </td>
//         <td className="text-center dress-size-cell">
//           <Form.Select
//             size="sm"
//             value={student.waistToBottomLengthInInches || ""}
//             onChange={(e) => onDressSizeChange(student._id, "waistToBottomLengthInInches", e.target.value)}
//             disabled={updatingDressSize[student._id] || false}
//             className="dress-size-select"
//           >
//             {DRESS_SIZES.map((size) => (
//               <option key={`bottom-${size}`} value={size}>
//                 {size || "Select"}
//               </option>
//             ))}
//           </Form.Select>
//         </td>
//       </tr>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.currentStatus === nextProps.currentStatus &&
//       prevProps.isLoading === nextProps.isLoading &&
//       prevProps.student === nextProps.student &&
//       prevProps.updatingDressSize[prevProps.student._id] === 
//       nextProps.updatingDressSize[nextProps.student._id]
//     );
//   }
// );

// export const MBStudentsAttendanceV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);

//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState("table");
//   const [attendanceStatus, setAttendanceStatus] = useState({});
//   const [attendanceLoading, setAttendanceLoading] = useState({});
//   const [updatingDressSize, setUpdatingDressSize] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const tableWrapperRef = useRef(null);

//   const sortStudentsAlphabetically = useCallback((studentsArray) => {
//     if (!studentsArray || !Array.isArray(studentsArray)) return [];
//     return [...studentsArray].sort((a, b) => {
//       const nameA = (a.firstName || "").toLowerCase();
//       const nameB = (b.firstName || "").toLowerCase();
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
//       startDate: startDate,
//     };

//     try {
//       const response = await GetMBStudentsForAttendance(reqBody);
//       const sortedStudents = sortStudentsAlphabetically(response.data || []);
//       setStudents(sortedStudents);

//       const initialStatus = {};
//       sortedStudents.forEach((student) => {
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
//       setError("Failed to fetch students.");
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolContext?.schoolId, batchContext?.batch, startDate, sortStudentsAlphabetically]);

//   const handleMarkAttendance = useCallback(
//     async (student, status) => {
//       if (isAttendanceDisabled(student)) {
//         setError("Cannot mark attendance - SLC Release request is pending approval");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }

//       const scrollTop = tableWrapperRef.current?.scrollTop || 0;
//       const scrollLeft = tableWrapperRef.current?.scrollLeft || 0;

//       setAttendanceStatus((prev) => ({
//         ...prev,
//         [student._id]: status,
//       }));

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
//         await MarkMBStudentAttendance(reqBody);

//         const currentDate = new Date().toISOString().split("T")[0];
        
//         if (startDate === currentDate) {
//           // alert(currentDate)
//           const gamificationPoint = async () => {
//             // await ClaimGamificationPoint({
//             //   pointType: "studentAttendance",
//             //   date: new Date().toISOString().split("T")[0],
//             //   batch: batchContext?.batch || batchContext,
//             //   schoolId: schoolContext?.schoolId,
//             //   unqObjectId: userData?._id,
//             // });


//             await studentAttendance({
//               pointType: "studentAttendance",
//               date: new Date().toISOString().split("T")[0],
//               batch: batchContext?.batch || batchContext,
//               schoolId: schoolContext?.schoolId,
//               unqObjectId: userData?._id,
//             });


//           };
//           gamificationPoint();
//         }
//       } catch (error) {
//         setError("Failed to mark attendance.");
//         setAttendanceStatus((prev) => ({
//           ...prev,
//           [student._id]: status === "Present" ? "Absent" : "Present",
//         }));
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       } finally {
//         setAttendanceLoading((prev) => ({
//           ...prev,
//           [student._id]: false,
//         }));
//         requestAnimationFrame(() => {
//           if (tableWrapperRef.current) {
//             tableWrapperRef.current.scrollTop = scrollTop;
//             tableWrapperRef.current.scrollLeft = scrollLeft;
//           }
//         });
//       }
//     },
//     [startDate, batchContext, schoolContext, userData]
//   );







//   const toggleAttendance = useCallback(
//     (student) => {
//       const currentStatus = attendanceStatus[student._id];
//       const newStatus = currentStatus === "Present" ? "Absent" : "Present";
//       handleMarkAttendance(student, newStatus);
//     },
//     [attendanceStatus, handleMarkAttendance]
//   );

//   // Handle dress size update
//   const handleDressSizeChange = useCallback(
//     async (studentId, field, value) => {
//       // Set updating state
//       setUpdatingDressSize((prev) => ({ ...prev, [studentId]: true }));

//       // Update local state immediately for better UX
//       setStudents((prevStudents) =>
//         prevStudents.map((student) =>
//           student._id === studentId
//             ? { ...student, [field]: value ? parseInt(value) : null }
//             : student
//         )
//       );

//       try {
//         const updateData = {
//           _id: studentId,
//         };
        
//         if (field === "shirtSizeInInches") {
//           updateData.shirtSizeInInches = value ? parseInt(value) : null;
//         } else if (field === "waistToBottomLengthInInches") {
//           updateData.waistToBottomLengthInInches = value ? parseInt(value) : null;
//         }

//         const result = await updateDressSize(updateData);
        
//         if (result.success) {
//           setSuccessMessage("Dress size updated successfully");
//           setTimeout(() => setSuccessMessage(null), 3000);
//         } else {
//           setError(result.message || "Failed to update dress size");
//           // Revert the local change
//           setStudents((prevStudents) =>
//             prevStudents.map((student) =>
//               student._id === studentId
//                 ? { ...student, [field]: student[field] }
//                 : student
//             )
//           );
//           setTimeout(() => setError(null), 3000);
//         }
//       } catch (error) {
//         setError("Failed to update dress size");
//         // Revert the local change
//         setStudents((prevStudents) =>
//           prevStudents.map((student) =>
//             student._id === studentId
//               ? { ...student, [field]: student[field] }
//               : student
//           )
//         );
//         setTimeout(() => setError(null), 3000);
//       } finally {
//         setUpdatingDressSize((prev) => ({ ...prev, [studentId]: false }));
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch) {
//       fetchStudents();
//     }
//   }, [schoolContext?.schoolId, batchContext?.batch, startDate, fetchStudents]);

//   const TableView = useMemo(() => {
//     if (students.length === 0) {
//       return (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">No students found</p>
//         </div>
//       );
//     }

//     return (
//       <div ref={tableWrapperRef} className="attendance-table-wrapper">
//         <Table striped bordered hover className="attendance-table">
//           <thead>
//             <tr>
//               <th className="small-heading">S.No.</th>
//               <th className="small-heading">SRN</th>
//               <th className="name-heading">Student Name</th>
//               <th className="name-heading">Father's Name</th>
//               <th className="small-heading">Att.</th>
//               <th className="dress-heading">T-Shirt (Inches)</th>
//               <th className="dress-heading">Bottom Length (Inches)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student, index) => (
//               <StudentRow
//                 key={student._id}
//                 student={student}
//                 index={index}
//                 currentStatus={attendanceStatus[student._id]}
//                 isLoading={attendanceLoading[student._id]}
//                 onToggle={toggleAttendance}
//                 onDressSizeChange={handleDressSizeChange}
//                 updatingDressSize={updatingDressSize}
//               />
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   }, [students, attendanceStatus, attendanceLoading, toggleAttendance, handleDressSizeChange, updatingDressSize]);

//   const CardView = () => (
//     <Row className="g-2 mt-2">
//       {students.map((student) => {
//         const currentStatus = attendanceStatus[student._id];
//         const isLoading = attendanceLoading[student._id];
//         const isPresent = currentStatus === "Present";
//         const disabled = isAttendanceDisabled(student);
//         const isUpdatingDress = updatingDressSize[student._id];

//         return (
//           <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
//             <Card className={`h-100 shadow-sm ${disabled ? "border-warning" : ""}`}>
//               <Card.Header
//                 className={
//                   disabled
//                     ? "bg-warning text-dark"
//                     : isPresent
//                     ? "bg-success text-white"
//                     : "bg-danger text-white"
//                 }
//               >
//                 <div className="d-flex justify-content-between align-items-center">
//                   <strong>
//                     {student.firstName}
//                     {disabled && (
//                       <Badge bg="dark" text="white" className="ms-2" style={{ fontSize: "8px" }}>
//                         <FaClock className="me-1" />
//                         Pending
//                       </Badge>
//                     )}
//                   </strong>
//                   <Badge bg="light">{student.rollNumber}</Badge>
//                 </div>
//               </Card.Header>

//               <Card.Body>
//                 <p>
//                   <strong>SRN:</strong> {student.studentSrn}
//                 </p>
//                 <p>
//                   <strong>Father:</strong> {student.fatherName}
//                 </p>
//                 {disabled && (
//                   <p className="text-warning mb-0">
//                     <FaClock className="me-1" />
//                     <small>SLC Release request pending approval</small>
//                   </p>
//                 )}
//               </Card.Body>

//               <Card.Footer className="bg-white">
//                 <div className="mb-2">
//                   <Form.Select
//                     size="sm"
//                     value={student.shirtSizeInInches || ""}
//                     onChange={(e) =>
//                       handleDressSizeChange(student._id, "shirtSizeInInches", e.target.value)
//                     }
//                     disabled={isUpdatingDress || false}
//                     className="mb-1"
//                   >
//                     {DRESS_SIZES.map((size) => (
//                       <option key={`shirt-${size}`} value={size}>
//                         {size || "T-Shirt Size"}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <Form.Select
//                     size="sm"
//                     value={student.waistToBottomLengthInInches || ""}
//                     onChange={(e) =>
//                       handleDressSizeChange(student._id, "waistToBottomLengthInInches", e.target.value)
//                     }
//                     disabled={isUpdatingDress || false}
//                   >
//                     {DRESS_SIZES.map((size) => (
//                       <option key={`bottom-${size}`} value={size}>
//                         {size || "Bottom Length"}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </div>
//                 <Button
//                   variant={disabled ? "secondary" : isPresent ? "success" : "danger"}
//                   className="w-100"
//                   onClick={() => toggleAttendance(student)}
//                   disabled={isLoading || disabled}
//                   title={disabled ? "Attendance disabled - SLC Release request pending approval" : ""}
//                 >
//                   {isLoading ? (
//                     <>
//                       <FaSpinner className="spin me-2" />
//                       Updating...
//                     </>
//                   ) : disabled ? (
//                     <>
//                       <FaClock className="me-2" />
//                       Disabled
//                     </>
//                   ) : (
//                     <>
//                       {isPresent ? <FaUserCheck /> : <FaUserTimes />}{" "}
//                       {isPresent ? "Present" : "Absent"}
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

//   const disabledCount = students.filter((s) => isAttendanceDisabled(s)).length;

//   return (
//     <Container fluid className="mt-3 mb-3">
//       {successMessage && (
//         <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
//           {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Row className="mb-2">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white py-2">Filters</Card.Header>
//             <Card.Body className="py-2">
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

//       <Row className="mb-2">
//         <Col xs={12}>
//           <div className="d-flex justify-content-between align-items-center flex-wrap">
//             <div>
//               <h6 className="mb-0">Students List</h6>
//               <small className="text-muted">
//                 Total: {students.length}
//                 {disabledCount > 0 && (
//                   <span className="ms-2 text-warning">(SLC Pending: {disabledCount})</span>
//                 )}
//               </small>
//               {disabledCount > 0 && (
//                 <div className="text-muted small mt-1">
//                   <FaClock className="me-1 text-warning" />
//                   SLC Release Request Pending (Approval Waiting) - ये रिकॉर्ड्स की अटेंडेंस डिसेबल है
//                 </div>
//               )}
//             </div>

//             <ToggleButtonGroup
//               type="radio"
//               name="viewMode"
//               value={viewMode}
//               onChange={(val) => val && setViewMode(val)}
//               size="sm"
//             >
//               <ToggleButton id="table-view" value="table" variant="outline-primary">
//                 <FaTable className="me-1" />
//                 Table
//               </ToggleButton>
//               <ToggleButton id="card-view" value="card" variant="outline-primary">
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
//           <p className="mt-3">Loading students...</p>
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
//           min-width: 720px;
//           margin-bottom: 0;
//           background: white;
//           font-size: 12px;
//         }

//         .attendance-table thead th {
//           position: sticky;
//           top: 0;
//           z-index: 2;
//           background: #f8f9fa;
//           font-size: 11px;
//           padding: 6px;
//         }

//         .attendance-table td {
//           padding: 5px 6px;
//           font-size: 11px;
//         }

//         .small-heading {
//           width: 55px;
//         }

//         .name-heading {
//           min-width: 140px;
//         }

//         .dress-heading {
//           min-width: 120px;
//         }

//         .small-cell {
//           width: 55px;
//         }

//         .name-cell {
//           min-width: 140px;
//         }

//         .dress-size-cell {
//           min-width: 120px;
//         }

//         .attendance-btn {
//           width: 38px;
//           height: 28px;
//           padding: 0;
//           font-size: 11px;
//           font-weight: bold;
//           border: none;
//           box-shadow: none;
//         }

//         .dress-size-select {
//           width: 100%;
//           min-width: 90px;
//           font-size: 10px;
//           padding: 2px 4px;
//           height: 28px;
//         }

//         .attendance-table th,
//         .attendance-table td {
//           vertical-align: middle;
//           white-space: nowrap;
//         }

//         .attendance-table-wrapper::-webkit-scrollbar {
//           width: 5px;
//           height: 5px;
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
//             padding-left: 8px;
//             padding-right: 8px;
//           }

//           .attendance-table {
//             min-width: 680px;
//             font-size: 10px;
//           }

//           .attendance-table thead th {
//             font-size: 10px;
//             padding: 5px;
//           }

//           .attendance-table td {
//             font-size: 10px;
//             padding: 4px 5px;
//           }

//           .name-heading,
//           .name-cell {
//             min-width: 115px;
//           }

//           .dress-heading,
//           .dress-size-cell {
//             min-width: 100px;
//           }

//           .attendance-btn {
//             width: 34px;
//             height: 26px;
//             font-size: 10px;
//           }

//           .dress-size-select {
//             font-size: 9px;
//             min-width: 75px;
//             height: 24px;
//             padding: 1px 2px;
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
  GetMBStudentsForAttendance,
  MarkMBStudentAttendance,
  updateDressSize,
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
  Form,
} from "react-bootstrap";

import {
  FaThLarge,
  FaTable,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";
import { studentAttendance } from "../../service/Gamification/Gamification.services";


// Dress size options
const DRESS_SIZES = ["", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50"];

// Helper function to check if attendance should be disabled
const isAttendanceDisabled = (student) => {
  if (student?.request === "SLC Released" && student?.requestStatus === "Pending") {
    return true;
  }
  return false;
};

const StudentRow = React.memo(
  ({
    student,
    index,
    currentStatus,
    isLoading,
    onToggle,
    onDressSizeChange,
    updatingDressSize,
  }) => {
    const isPresent = currentStatus === "Present";
    const disabled = isAttendanceDisabled(student);

    return (
      <tr className={disabled ? "table-warning" : ""}>
        <td className="text-center small-cell">{index + 1}</td>
        <td className="small-cell">{student.studentSrn || "N/A"}</td>
        <td className="name-cell">
          <strong>{student.firstName || "N/A"}</strong>
          {student.lastName ? ` ${student.lastName}` : ""}
        </td>
        <td className="name-cell">{student.fatherName || "N/A"}</td>
        <td className="text-center small-cell">
          <Button
            variant={isPresent ? "success" : "danger"}
            onClick={() => onToggle(student)}
            disabled={isLoading || disabled}
            className="attendance-btn"
            title={disabled ? "Attendance disabled - SLC Release request pending approval" : ""}
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
        <td className="text-center dress-size-cell">
          <Form.Select
            size="sm"
            value={student.shirtSizeInInches || ""}
            onChange={(e) => onDressSizeChange(student._id, "shirtSizeInInches", e.target.value)}
            disabled={updatingDressSize[student._id] || false}
            className="dress-size-select"
          >
            {DRESS_SIZES.map((size) => (
              <option key={`shirt-${size}`} value={size}>
                {size || "Select"}
              </option>
            ))}
          </Form.Select>
        </td>
        <td className="text-center dress-size-cell">
          <Form.Select
            size="sm"
            value={student.waistToBottomLengthInInches || ""}
            onChange={(e) => onDressSizeChange(student._id, "waistToBottomLengthInInches", e.target.value)}
            disabled={updatingDressSize[student._id] || false}
            className="dress-size-select"
          >
            {DRESS_SIZES.map((size) => (
              <option key={`bottom-${size}`} value={size}>
                {size || "Select"}
              </option>
            ))}
          </Form.Select>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.currentStatus === nextProps.currentStatus &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.student === nextProps.student &&
      prevProps.updatingDressSize[prevProps.student._id] === 
      nextProps.updatingDressSize[nextProps.student._id]
    );
  }
);

export const MBStudentsAttendanceV2 = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState({});
  const [updatingDressSize, setUpdatingDressSize] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // ✅ State to track if date is selected
  const [isDateSelected, setIsDateSelected] = useState(false);

  const tableWrapperRef = useRef(null);

  const sortStudentsAlphabetically = useCallback((studentsArray) => {
    if (!studentsArray || !Array.isArray(studentsArray)) return [];
    return [...studentsArray].sort((a, b) => {
      const nameA = (a.firstName || "").toLowerCase();
      const nameB = (b.firstName || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, []);

  const fetchStudents = useCallback(async () => {
    // ✅ Check if date is selected
    if (!startDate || startDate === "" || startDate === null || startDate === undefined) {
      setStudents([]);
      setAttendanceStatus({});
      setIsDateSelected(false);
      return;
    }

    setIsDateSelected(true);
    setLoading(true);
    setError(null);

    const reqBody = {
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      startDate: startDate,
    };

    try {
      const response = await GetMBStudentsForAttendance(reqBody);
      const sortedStudents = sortStudentsAlphabetically(response.data || []);
      setStudents(sortedStudents);

      const initialStatus = {};
      sortedStudents.forEach((student) => {
        let status = null;
        if (student.attendanceStatus) {
          status = student.attendanceStatus;
        } else if (student.status) {
          status = student.status;
        }
        if (status && (status === "Present" || status === "Absent")) {
          initialStatus[student._id] = status;
        }
      });
      setAttendanceStatus(initialStatus);
    } catch (error) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, [schoolContext?.schoolId, batchContext?.batch, startDate, sortStudentsAlphabetically]);

  const handleMarkAttendance = useCallback(
    async (student, status) => {
      // ✅ Check if date is selected before marking attendance
      if (!startDate || startDate === "" || startDate === null || startDate === undefined) {
        setError("Please select a date first!");
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (isAttendanceDisabled(student)) {
        setError("Cannot mark attendance - SLC Release request is pending approval");
        setTimeout(() => setError(null), 3000);
        return;
      }

      const scrollTop = tableWrapperRef.current?.scrollTop || 0;
      const scrollLeft = tableWrapperRef.current?.scrollLeft || 0;

      setAttendanceStatus((prev) => ({
        ...prev,
        [student._id]: status,
      }));

      setAttendanceLoading((prev) => ({
        ...prev,
        [student._id]: true,
      }));

      const reqBody = {
        _id: student._id,
        status: status,
        isAttendanceMarked: true,
        startDate: startDate,
      };

      try {
        await MarkMBStudentAttendance(reqBody);

        const currentDate = new Date().toISOString().split("T")[0];
        
        // ✅ Only trigger gamification if attendance is for TODAY
        if (startDate === currentDate) {
          await studentAttendance({
            pointType: "studentAttendance",
            date: currentDate,
            batch: batchContext?.batch || batchContext,
            schoolId: schoolContext?.schoolId,
            unqObjectId: userData?._id,
          });
        } else {
          console.log(`⚠️ Attendance marked for ${startDate} (past/future date) - Gamification skipped`);
        }
      } catch (error) {
        setError("Failed to mark attendance.");
        setAttendanceStatus((prev) => ({
          ...prev,
          [student._id]: status === "Present" ? "Absent" : "Present",
        }));
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setAttendanceLoading((prev) => ({
          ...prev,
          [student._id]: false,
        }));
        requestAnimationFrame(() => {
          if (tableWrapperRef.current) {
            tableWrapperRef.current.scrollTop = scrollTop;
            tableWrapperRef.current.scrollLeft = scrollLeft;
          }
        });
      }
    },
    [startDate, batchContext, schoolContext, userData]
  );

  const toggleAttendance = useCallback(
    (student) => {
      const currentStatus = attendanceStatus[student._id];
      const newStatus = currentStatus === "Present" ? "Absent" : "Present";
      handleMarkAttendance(student, newStatus);
    },
    [attendanceStatus, handleMarkAttendance]
  );

  // Handle dress size update
  const handleDressSizeChange = useCallback(
    async (studentId, field, value) => {
      // Set updating state
      setUpdatingDressSize((prev) => ({ ...prev, [studentId]: true }));

      // Update local state immediately for better UX
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, [field]: value ? parseInt(value) : null }
            : student
        )
      );

      try {
        const updateData = {
          _id: studentId,
        };
        
        if (field === "shirtSizeInInches") {
          updateData.shirtSizeInInches = value ? parseInt(value) : null;
        } else if (field === "waistToBottomLengthInInches") {
          updateData.waistToBottomLengthInInches = value ? parseInt(value) : null;
        }

        const result = await updateDressSize(updateData);
        
        if (result.success) {
          setSuccessMessage("Dress size updated successfully");
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          setError(result.message || "Failed to update dress size");
          // Revert the local change
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === studentId
                ? { ...student, [field]: student[field] }
                : student
            )
          );
          setTimeout(() => setError(null), 3000);
        }
      } catch (error) {
        setError("Failed to update dress size");
        // Revert the local change
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId
              ? { ...student, [field]: student[field] }
              : student
          )
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setUpdatingDressSize((prev) => ({ ...prev, [studentId]: false }));
      }
    },
    []
  );

  useEffect(() => {
    if (schoolContext?.schoolId && batchContext?.batch) {
      fetchStudents();
    }
  }, [schoolContext?.schoolId, batchContext?.batch, startDate, fetchStudents]);

  const TableView = useMemo(() => {
    if (students.length === 0) {
      return (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">No students found</p>
        </div>
      );
    }

    return (
      <div ref={tableWrapperRef} className="attendance-table-wrapper">
        <Table striped bordered hover className="attendance-table">
          <thead>
            <tr>
              <th className="small-heading">S.No.</th>
              <th className="small-heading">SRN</th>
              <th className="name-heading">Student Name</th>
              <th className="name-heading">Father's Name</th>
              <th className="small-heading">Att.</th>
              <th className="dress-heading">T-Shirt (Inches)</th>
              <th className="dress-heading">Bottom Length (Inches)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <StudentRow
                key={student._id}
                student={student}
                index={index}
                currentStatus={attendanceStatus[student._id]}
                isLoading={attendanceLoading[student._id]}
                onToggle={toggleAttendance}
                onDressSizeChange={handleDressSizeChange}
                updatingDressSize={updatingDressSize}
              />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }, [students, attendanceStatus, attendanceLoading, toggleAttendance, handleDressSizeChange, updatingDressSize]);

  const CardView = () => (
    <Row className="g-2 mt-2">
      {students.map((student) => {
        const currentStatus = attendanceStatus[student._id];
        const isLoading = attendanceLoading[student._id];
        const isPresent = currentStatus === "Present";
        const disabled = isAttendanceDisabled(student);
        const isUpdatingDress = updatingDressSize[student._id];

        return (
          <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
            <Card className={`h-100 shadow-sm ${disabled ? "border-warning" : ""}`}>
              <Card.Header
                className={
                  disabled
                    ? "bg-warning text-dark"
                    : isPresent
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }
              >
                <div className="d-flex justify-content-between align-items-center">
                  <strong>
                    {student.firstName}
                    {disabled && (
                      <Badge bg="dark" text="white" className="ms-2" style={{ fontSize: "8px" }}>
                        <FaClock className="me-1" />
                        Pending
                      </Badge>
                    )}
                  </strong>
                  <Badge bg="light">{student.rollNumber}</Badge>
                </div>
              </Card.Header>

              <Card.Body>
                <p>
                  <strong>SRN:</strong> {student.studentSrn}
                </p>
                <p>
                  <strong>Father:</strong> {student.fatherName}
                </p>
                {disabled && (
                  <p className="text-warning mb-0">
                    <FaClock className="me-1" />
                    <small>SLC Release request pending approval</small>
                  </p>
                )}
              </Card.Body>

              <Card.Footer className="bg-white">
                <div className="mb-2">
                  <Form.Select
                    size="sm"
                    value={student.shirtSizeInInches || ""}
                    onChange={(e) =>
                      handleDressSizeChange(student._id, "shirtSizeInInches", e.target.value)
                    }
                    disabled={isUpdatingDress || false}
                    className="mb-1"
                  >
                    {DRESS_SIZES.map((size) => (
                      <option key={`shirt-${size}`} value={size}>
                        {size || "T-Shirt Size"}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    size="sm"
                    value={student.waistToBottomLengthInInches || ""}
                    onChange={(e) =>
                      handleDressSizeChange(student._id, "waistToBottomLengthInInches", e.target.value)
                    }
                    disabled={isUpdatingDress || false}
                  >
                    {DRESS_SIZES.map((size) => (
                      <option key={`bottom-${size}`} value={size}>
                        {size || "Bottom Length"}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <Button
                  variant={disabled ? "secondary" : isPresent ? "success" : "danger"}
                  className="w-100"
                  onClick={() => toggleAttendance(student)}
                  disabled={isLoading || disabled}
                  title={disabled ? "Attendance disabled - SLC Release request pending approval" : ""}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spin me-2" />
                      Updating...
                    </>
                  ) : disabled ? (
                    <>
                      <FaClock className="me-2" />
                      Disabled
                    </>
                  ) : (
                    <>
                      {isPresent ? <FaUserCheck /> : <FaUserTimes />}{" "}
                      {isPresent ? "Present" : "Absent"}
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

  const disabledCount = students.filter((s) => isAttendanceDisabled(s)).length;

  return (
    <Container fluid className="mt-3 mb-3">
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ✅ DATE MANDATORY WARNING */}
      {!isDateSelected && (
        <Alert variant="warning" className="mb-2">
          <FaExclamationTriangle className="me-2" />
          <strong>Please select a date</strong> to view and manage student attendance.
        </Alert>
      )}

      <Row className="mb-2">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white py-2">Filters</Card.Header>
            <Card.Body className="py-2">
              <Row className="g-2">
                <Col md={6}>
                  <SingleDatePicker />
                  {!isDateSelected && (
                    <small className="text-danger d-block mt-1">
                      * Date is mandatory
                    </small>
                  )}
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
              <h6 className="mb-0">Students List</h6>
              <small className="text-muted">
                Total: {isDateSelected ? students.length : 0}
                {disabledCount > 0 && isDateSelected && (
                  <span className="ms-2 text-warning">(SLC Pending: {disabledCount})</span>
                )}
              </small>
              {disabledCount > 0 && isDateSelected && (
                <div className="text-muted small mt-1">
                  <FaClock className="me-1 text-warning" />
                  SLC Release Request Pending (Approval Waiting) - ये रिकॉर्ड्स की अटेंडेंस डिसेबल है
                </div>
              )}
            </div>

            <ToggleButtonGroup
              type="radio"
              name="viewMode"
              value={viewMode}
              onChange={(val) => val && setViewMode(val)}
              size="sm"
            >
              <ToggleButton id="table-view" value="table" variant="outline-primary">
                <FaTable className="me-1" />
                Table
              </ToggleButton>
              <ToggleButton id="card-view" value="card" variant="outline-primary">
                <FaThLarge className="me-1" />
                Card
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Col>
      </Row>

      {!isDateSelected ? (
        <div className="text-center py-5 bg-light rounded">
          <FaExclamationTriangle size={50} className="mb-3 text-warning" />
          <h5>Please Select a Date</h5>
          <p className="text-muted">
            Choose a date from the date picker above to view student attendance.
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading students...</p>
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
          min-width: 720px;
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

        .dress-heading {
          min-width: 120px;
        }

        .small-cell {
          width: 55px;
        }

        .name-cell {
          min-width: 140px;
        }

        .dress-size-cell {
          min-width: 120px;
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

        .dress-size-select {
          width: 100%;
          min-width: 90px;
          font-size: 10px;
          padding: 2px 4px;
          height: 28px;
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
            min-width: 680px;
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

          .dress-heading,
          .dress-size-cell {
            min-width: 100px;
          }

          .attendance-btn {
            width: 34px;
            height: 26px;
            font-size: 10px;
          }

          .dress-size-select {
            font-size: 9px;
            min-width: 75px;
            height: 24px;
            padding: 1px 2px;
          }
        }
      `}</style>
    </Container>
  );
};