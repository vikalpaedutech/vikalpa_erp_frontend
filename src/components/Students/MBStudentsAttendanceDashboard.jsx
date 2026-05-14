// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, MarkMBStudentAttendance } from "../../service/Student.service";
// import { Container, Card, Table, Button, Badge, Spinner, ToggleButton, ToggleButtonGroup, Row, Col, Alert } from "react-bootstrap";
// import { FaThLarge, FaTable, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";
// import Region from "./Region.json"


// export const MBStudentsAttendanceDashboard = () => {
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





//   const schoolIds_static = [
// "30",
// "2665",
// "2637",
// "3704",
// "2844",
// "1420",
// "1786",
// "184",
// "6625",
// "1798",
// "3874",
// "4300",
// "2655",
// "395",
// "1478",
// "1782",
// "175",
// "4187",
// "3679",
// "3716",
// "3267",
// "3288",
// "5522",
// "1507",
// "2546",
// "1175",
// "2175",
// "738",
// "2516",
// "1441",
// "1443",
// "3109",
// "6642",
// "1512",
// "866",
// "1002",
// "1790",
// "356",
// "2541",
// "2749",
// "885",
// "736",
// "1515",
// "2093",
// "143",
// "7134",
// "884",
// "658",
// "3099",
// "2411",
// "2149",
// "2672",
// "3856",
// "3887",
// "359",
// "3560",
// "3393",
// "3725",
// "13",
// "396",
// "377",
// "3708",
// "2816",
// "3070",
// "2406",
// "4100",
// "2130",
// "2196",
// "3266",
// "2134",
// "1506",
// "3261",
// "2534",
// "2540",
// "2106",
// "2407",
// "40",
// "393",
// "1088",
// "3274",
// "735",
// "784",
// "3609",
// "2679",
// "389",
// "5",
// "2073",
// "2179",
// "2399",
// "1748",
// "3083",
// "4059",
// "1481",
// "2425",
// "2825",
// "3482",
// "1768",
// "979",
// "966",
// "6880",
// "860",
// "3706",
// "4079",
// "2923",
// "190",
// "1008",
// "4025",
// ]


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






import React, { useState, useEffect } from "react";

import {
  Container,
  Card,
  Table,
  Spinner,
  Row,
  Col,
  Alert,
  Badge,
} from "react-bootstrap";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";

import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";

import { GetMBStudents } from "../../service/Student.service";

import Region from "./Region.json";


// =====================================================
// STATIC SCHOOL IDS
// =====================================================

const schoolIds_static = [
"30",
"2665",
"2637",
"3704",
"2844",
"1420",
"1786",
"184",
"6625",
"1798",
"3874",
"4300",
"2655",
"395",
"1478",
"1782",
"175",
"4187",
"3679",
"3716",
"3267",
"3288",
"5522",
"1507",
"2546",
"1175",
"2175",
"738",
"2516",
"1441",
"1443",
"3109",
"6642",
"1512",
"866",
"1002",
"1790",
"356",
"2541",
"2749",
"885",
"736",
"1515",
"2093",
"143",
"7134",
"884",
"658",
"3099",
"2411",
"2149",
"2672",
"3856",
"3887",
"359",
"3560",
"3393",
"3725",
"13",
"396",
"377",
"3708",
"2816",
"3070",
"2406",
"4100",
"2130",
"2196",
"3266",
"2134",
"1506",
"3261",
"2534",
"2540",
"2106",
"2407",
"40",
"393",
"1088",
"3274",
"735",
"784",
"3609",
"2679",
"389",
"5",
"2073",
"2179",
"2399",
"1748",
"3083",
"4059",
"1481",
"2425",
"2825",
"3482",
"1768",
"979",
"966",
"6880",
"860",
"3706",
"4079",
"2923",
"190",
"1008",
"4025",
]


// =====================================================
// COMPONENT
// =====================================================

export const MBStudentsAttendanceDashboard = () => {

  const { startDate } = React.useContext(DateNDateRangeContext);

  const { batchContext } = React.useContext(
    DistrictBlockSschoolContextV2
  );

  const [dashboardData, setDashboardData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {

    if (!batchContext?.batch || !startDate) return;

    try {

      setLoading(true);

      setError("");

      let allStudents = [];

      // =====================================================
      // FETCH ALL SCHOOLS DATA
      // =====================================================

      for (const schoolId of schoolIds_static) {

        const reqBody = {
          schoolId,
          batch: batchContext?.batch,
          startDate,
        };

        try {

          const response = await GetMBStudents(reqBody);

          const students = response?.data || [];

          allStudents.push(...students);

        } catch (err) {

          console.log("Error in school:", schoolId);

        }
      }

      // =====================================================
      // GROUPING DISTRICT BLOCK SCHOOL WISE
      // =====================================================

      const groupedData = {};

      allStudents.forEach((student) => {

        const schoolInfo = Region.find(
          (item) => item.schoolId === student.schoolId
        );

        const districtName = schoolInfo?.districtName || "Unknown";
        const blockName = schoolInfo?.blockName || "Unknown";
        const schoolName = schoolInfo?.schoolName || "Unknown";

        const key = `${districtName}_${blockName}_${schoolName}`;

        if (!groupedData[key]) {

          groupedData[key] = {

            districtName,
            blockName,
            schoolName,

            totalStudents: 0,
            totalPresent: 0,
            totalAbsent: 0,
            totalMarked: 0,
            attendancePercentage: 0,
          };
        }

        groupedData[key].totalStudents += 1;

        if (student.attendanceStatus === "Present") {
          groupedData[key].totalPresent += 1;
        }

        if (student.attendanceStatus === "Absent") {
          groupedData[key].totalAbsent += 1;
        }

        if (student.isAttendanceMarked) {
          groupedData[key].totalMarked += 1;
        }
      });

      // =====================================================
      // CALCULATE PERCENTAGE
      // =====================================================

      const finalData = Object.values(groupedData).map((item) => {

        const percentage =
          item.totalStudents > 0
            ? (
                (item.totalPresent / item.totalStudents) *
                100
              ).toFixed(1)
            : 0;

        return {
          ...item,
          attendancePercentage: percentage,
        };
      });

      // =====================================================
      // SORT BY DISTRICT -> BLOCK -> SCHOOL
      // =====================================================

      finalData.sort((a, b) => {

        if (a.districtName !== b.districtName) {
          return a.districtName.localeCompare(b.districtName);
        }

        if (a.blockName !== b.blockName) {
          return a.blockName.localeCompare(b.blockName);
        }

        return a.schoolName.localeCompare(b.schoolName);
      });

      setDashboardData(finalData);

    } catch (err) {

      console.log(err);

      setError("Failed to fetch dashboard data");

    } finally {

      setLoading(false);

    }
  };



  // =====================================================
  // AUTO FETCH
  // =====================================================

  useEffect(() => {

    if (batchContext?.batch && startDate) {

      fetchDashboardData();
    }

  }, [batchContext?.batch, startDate]);



  // =====================================================
  // TOTALS
  // =====================================================

  const totalSchools = dashboardData.length;

  const totalStudents = dashboardData.reduce(
    (acc, item) => acc + item.totalStudents,
    0
  );

  const totalPresent = dashboardData.reduce(
    (acc, item) => acc + item.totalPresent,
    0
  );

  const totalAbsent = dashboardData.reduce(
    (acc, item) => acc + item.totalAbsent,
    0
  );



  return (
    <Container fluid className="mt-4 mb-4">

      {/* ===================================================== */}
      {/* FILTERS */}
      {/* ===================================================== */}

      <Card className="shadow-sm mb-4">

        <Card.Header className="bg-primary text-white">

          <h5 className="mb-0">
            MB Attendance Dashboard
          </h5>

        </Card.Header>

        <Card.Body>

          <Row className="g-3 align-items-end">

            <Col md={4}>
              <SingleDatePicker />
            </Col>

            <Col md={4}>
              <Batch_drop_down />
            </Col>

            <Col md={4}>

              <Alert variant="info" className="mb-0 py-2">

                <strong>
                  Auto Fetch Enabled
                </strong>

              </Alert>

            </Col>

          </Row>

        </Card.Body>

      </Card>



      {/* ===================================================== */}
      {/* ERROR */}
      {/* ===================================================== */}

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}



      {/* ===================================================== */}
      {/* SUMMARY */}
      {/* ===================================================== */}

      <Row className="mb-4">

        <Col md={3}>
          <Card className="shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <h3>{totalSchools}</h3>
              <div>Total Schools</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h3>{totalStudents}</h3>
              <div>Total Students</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <h3>{totalPresent}</h3>
              <div>Total Present</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 bg-danger text-white">
            <Card.Body>
              <h3>{totalAbsent}</h3>
              <div>Total Absent</div>
            </Card.Body>
          </Card>
        </Col>

      </Row>



      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <Card className="shadow-sm">

        <Card.Header className="bg-dark text-white">

          <div className="d-flex justify-content-between align-items-center">

            <h5 className="mb-0">
              District / Block / School Attendance
            </h5>

            <Badge bg="light" text="dark">
              {dashboardData.length} Schools
            </Badge>

          </div>

        </Card.Header>

        <Card.Body>

          {loading ? (

            <div className="text-center py-5">

              <Spinner animation="border" variant="primary" />

              <p className="mt-3">
                Loading Dashboard...
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <Table striped bordered hover>

                <thead>

                  <tr>

                    <th>S.No</th>

                    <th>District</th>

                    <th>Block</th>

                    <th>School</th>

                    <th>Total Students</th>

                    <th>Present</th>

                    <th>Absent</th>

                    <th>Attendance %</th>

                  </tr>

                </thead>

                <tbody>

                  {dashboardData.length > 0 ? (

                    dashboardData.map((item, index) => (

                      <tr key={index}>

                        <td>{index + 1}</td>

                        <td>{item.districtName}</td>

                        <td>{item.blockName}</td>

                        <td>{item.schoolName}</td>

                        <td>{item.totalStudents}</td>

                        <td>
                          <Badge bg="success">
                            {item.totalPresent}
                          </Badge>
                        </td>

                        <td>
                          <Badge bg="danger">
                            {item.totalAbsent}
                          </Badge>
                        </td>

                        <td>

                          <Badge
                            bg={
                              item.attendancePercentage >= 75
                                ? "success"
                                : item.attendancePercentage >= 50
                                ? "warning"
                                : "danger"
                            }
                          >
                            {item.attendancePercentage}%
                          </Badge>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="text-center text-muted py-4"
                      >
                        No Data Found
                      </td>

                    </tr>

                  )}

                </tbody>

              </Table>

            </div>

          )}

        </Card.Body>

      </Card>

    </Container>
  );
};