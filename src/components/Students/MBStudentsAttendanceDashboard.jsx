


// import React, { useState, useEffect } from "react";

// import {
//   Container,
//   Card,
//   Table,
//   Spinner,
//   Row,
//   Col,
//   Alert,
//   Badge,
// } from "react-bootstrap";

// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";

// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";

// import { GetMBStudents } from "../../service/Student.service";

// import Region from "./Region.json";


// // =====================================================
// // STATIC SCHOOL IDS
// // =====================================================

// const schoolIds_static = [
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


// // =====================================================
// // COMPONENT
// // =====================================================

// export const MBStudentsAttendanceDashboard = () => {

//   const { startDate } = React.useContext(DateNDateRangeContext);

//   const { batchContext } = React.useContext(
//     DistrictBlockSschoolContextV2
//   );

//   const [dashboardData, setDashboardData] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");



//   // =====================================================
//   // FETCH DASHBOARD DATA
//   // =====================================================

//   const fetchDashboardData = async () => {

//     if (!batchContext?.batch || !startDate) return;

//     try {

//       setLoading(true);

//       setError("");

//       let allStudents = [];

//       // =====================================================
//       // FETCH ALL SCHOOLS DATA
//       // =====================================================

//       for (const schoolId of schoolIds_static) {

//         const reqBody = {
//           schoolId,
//           batch: batchContext?.batch,
//           startDate,
//         };

//         try {

//           const response = await GetMBStudents(reqBody);

//           const students = response?.data || [];

//           allStudents.push(...students);

//         } catch (err) {

//           console.log("Error in school:", schoolId);

//         }
//       }

//       // =====================================================
//       // GROUPING DISTRICT BLOCK SCHOOL WISE
//       // =====================================================

//       const groupedData = {};

//       allStudents.forEach((student) => {

//         const schoolInfo = Region.find(
//           (item) => item.schoolId === student.schoolId
//         );

//         const districtName = schoolInfo?.districtName || "Unknown";
//         const blockName = schoolInfo?.blockName || "Unknown";
//         const schoolName = schoolInfo?.schoolName || "Unknown";

//         const key = `${districtName}_${blockName}_${schoolName}`;

//         if (!groupedData[key]) {

//           groupedData[key] = {

//             districtName,
//             blockName,
//             schoolName,

//             totalStudents: 0,
//             totalPresent: 0,
//             totalAbsent: 0,
//             totalMarked: 0,
//             attendancePercentage: 0,
//           };
//         }

//         groupedData[key].totalStudents += 1;

//         if (student.attendanceStatus === "Present") {
//           groupedData[key].totalPresent += 1;
//         }

//         if (student.attendanceStatus === "Absent") {
//           groupedData[key].totalAbsent += 1;
//         }

//         if (student.isAttendanceMarked) {
//           groupedData[key].totalMarked += 1;
//         }
//       });

//       // =====================================================
//       // CALCULATE PERCENTAGE
//       // =====================================================

//       const finalData = Object.values(groupedData).map((item) => {

//         const percentage =
//           item.totalStudents > 0
//             ? (
//                 (item.totalPresent / item.totalStudents) *
//                 100
//               ).toFixed(1)
//             : 0;

//         return {
//           ...item,
//           attendancePercentage: percentage,
//         };
//       });

//       // =====================================================
//       // SORT BY DISTRICT -> BLOCK -> SCHOOL
//       // =====================================================

//       finalData.sort((a, b) => {

//         if (a.districtName !== b.districtName) {
//           return a.districtName.localeCompare(b.districtName);
//         }

//         if (a.blockName !== b.blockName) {
//           return a.blockName.localeCompare(b.blockName);
//         }

//         return a.schoolName.localeCompare(b.schoolName);
//       });

//       setDashboardData(finalData);

//     } catch (err) {

//       console.log(err);

//       setError("Failed to fetch dashboard data");

//     } finally {

//       setLoading(false);

//     }
//   };



//   // =====================================================
//   // AUTO FETCH
//   // =====================================================

//   useEffect(() => {

//     if (batchContext?.batch && startDate) {

//       fetchDashboardData();
//     }

//   }, [batchContext?.batch, startDate]);



//   // =====================================================
//   // TOTALS
//   // =====================================================

//   const totalSchools = dashboardData.length;

//   const totalStudents = dashboardData.reduce(
//     (acc, item) => acc + item.totalStudents,
//     0
//   );

//   const totalPresent = dashboardData.reduce(
//     (acc, item) => acc + item.totalPresent,
//     0
//   );

//   const totalAbsent = dashboardData.reduce(
//     (acc, item) => acc + item.totalAbsent,
//     0
//   );



//   return (
//     <Container fluid className="mt-4 mb-4">

//       {/* ===================================================== */}
//       {/* FILTERS */}
//       {/* ===================================================== */}

//       <Card className="shadow-sm mb-4">

//         <Card.Header className="bg-primary text-white">

//           <h5 className="mb-0">
//             MB Attendance Dashboard
//           </h5>

//         </Card.Header>

//         <Card.Body>

//           <Row className="g-3 align-items-end">

//             <Col md={4}>
//               <SingleDatePicker />
//             </Col>

//             <Col md={4}>
//               <Batch_drop_down />
//             </Col>

//             <Col md={4}>

//               <Alert variant="info" className="mb-0 py-2">

//                 <strong>
//                   Auto Fetch Enabled
//                 </strong>

//               </Alert>

//             </Col>

//           </Row>

//         </Card.Body>

//       </Card>



//       {/* ===================================================== */}
//       {/* ERROR */}
//       {/* ===================================================== */}

//       {error && (
//         <Alert variant="danger">
//           {error}
//         </Alert>
//       )}



//       {/* ===================================================== */}
//       {/* SUMMARY */}
//       {/* ===================================================== */}

//       <Row className="mb-4">

//         <Col md={3}>
//           <Card className="shadow-sm border-0 bg-primary text-white">
//             <Card.Body>
//               <h3>{totalSchools}</h3>
//               <div>Total Schools</div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3}>
//           <Card className="shadow-sm border-0 bg-success text-white">
//             <Card.Body>
//               <h3>{totalStudents}</h3>
//               <div>Total Students</div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3}>
//           <Card className="shadow-sm border-0 bg-info text-white">
//             <Card.Body>
//               <h3>{totalPresent}</h3>
//               <div>Total Present</div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3}>
//           <Card className="shadow-sm border-0 bg-danger text-white">
//             <Card.Body>
//               <h3>{totalAbsent}</h3>
//               <div>Total Absent</div>
//             </Card.Body>
//           </Card>
//         </Col>

//       </Row>



//       {/* ===================================================== */}
//       {/* TABLE */}
//       {/* ===================================================== */}

//       <Card className="shadow-sm">

//         <Card.Header className="bg-dark text-white">

//           <div className="d-flex justify-content-between align-items-center">

//             <h5 className="mb-0">
//               District / Block / School Attendance
//             </h5>

//             <Badge bg="light" text="dark">
//               {dashboardData.length} Schools
//             </Badge>

//           </div>

//         </Card.Header>

//         <Card.Body>

//           {loading ? (

//             <div className="text-center py-5">

//               <Spinner animation="border" variant="primary" />

//               <p className="mt-3">
//                 Loading Dashboard...
//               </p>

//             </div>

//           ) : (

//             <div className="table-responsive">

//               <Table striped bordered hover>

//                 <thead>

//                   <tr>

//                     <th>S.No</th>

//                     <th>District</th>

//                     <th>Block</th>

//                     <th>School</th>

//                     <th>Total Students</th>

//                     <th>Present</th>

//                     <th>Absent</th>

//                     <th>Attendance %</th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {dashboardData.length > 0 ? (

//                     dashboardData.map((item, index) => (

//                       <tr key={index}>

//                         <td>{index + 1}</td>

//                         <td>{item.districtName}</td>

//                         <td>{item.blockName}</td>

//                         <td>{item.schoolName}</td>

//                         <td>{item.totalStudents}</td>

//                         <td>
//                           <Badge bg="success">
//                             {item.totalPresent}
//                           </Badge>
//                         </td>

//                         <td>
//                           <Badge bg="danger">
//                             {item.totalAbsent}
//                           </Badge>
//                         </td>

//                         <td>

//                           <Badge
//                             bg={
//                               item.attendancePercentage >= 75
//                                 ? "success"
//                                 : item.attendancePercentage >= 50
//                                 ? "warning"
//                                 : "danger"
//                             }
//                           >
//                             {item.attendancePercentage}%
//                           </Badge>

//                         </td>

//                       </tr>

//                     ))

//                   ) : (

//                     <tr>

//                       <td
//                         colSpan="8"
//                         className="text-center text-muted py-4"
//                       >
//                         No Data Found
//                       </td>

//                     </tr>

//                   )}

//                 </tbody>

//               </Table>

//             </div>

//           )}

//         </Card.Body>

//       </Card>

//     </Container>
//   );
// };

































// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Table, ButtonGroup } from "react-bootstrap";
// import { FaCheckCircle, FaClock, FaTimesCircle, FaSchool, FaChartLine, FaUsers, FaFileAlt, FaFilter, FaBan, FaPresent, FaUserCheck, FaUserTimes, FaDownload, FaFileExcel } from "react-icons/fa";
// import { StudentAttendanceDashboard } from "../../service/Student.service";
// import * as XLSX from 'xlsx';

// export const MBStudentsAttendanceDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showNoAttendanceOnly, setShowNoAttendanceOnly] = useState(false);
//   const [exporting, setExporting] = useState(false);

//   // Fetch dashboard data
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       date: startDate,
//       districtId: schoolContext?.districtId,
//       blockId: schoolContext?.blockId,
//       isSlcTaken: false
//     };

//     console.log("Fetching attendance dashboard data with:", reqBody);
    
//     try {
//       const response = await StudentAttendanceDashboard(reqBody);
//       console.log("Dashboard response:", response);
      
//       if (response.success) {
//         setDashboardData(response);
//       } else {
//         setError(response.message || "Failed to fetch dashboard data");
//       }
//     } catch (error) {
//       console.log("Error fetching dashboard data:", error);
//       setError("Failed to fetch dashboard data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show alert when any filter value changes
//   useEffect(() => {
//     const schoolValue = schoolContext?.schoolId || "All";
//     const batchValue = batchContext?.batch || "All";
//     const dateValue = startDate || "All";
//     const districtValue = schoolContext?.districtId || "All";
//     const blockValue = schoolContext?.blockId || "All";
    
//     setAlertMessage(`Selected Filters:\n🏢 District: ${districtValue}\n🏘️ Block: ${blockValue}\n📚 School: ${schoolValue}\n📖 Batch: ${batchValue}\n📅 Date: ${dateValue}`);
//     setShowAlert(true);
    
//     // Fetch data when filters change
//     if (batchContext?.batch && startDate) {
//       fetchDashboardData();
//     }
    
//     // Reset no attendance filter when main filters change
//     setShowNoAttendanceOnly(false);
    
//     // Auto hide alert after 3 seconds
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [schoolContext, batchContext, startDate]);

//   // Get filtered schools data (Not Marked counted as Absent)
//   const getFilteredSchoolsData = () => {
//     const schoolsData = dashboardData?.schoolsData || [];
    
//     // Transform data to count Not Marked as Absent
//     const transformedData = schoolsData.map(school => ({
//       ...school,
//       attendance: {
//         ...school.attendance,
//         absent: school.attendance.absent + school.attendance.notMarked,
//         present: school.attendance.present,
//         notMarked: 0,
//         percentage: school.totalStudents > 0 
//           ? ((school.attendance.present / school.totalStudents) * 100).toFixed(2)
//           : 0
//       }
//     }));
    
//     if (showNoAttendanceOnly) {
//       // Schools with totalPresent = 0
//       return transformedData.filter(school => school.attendance.present === 0);
//     }
    
//     return transformedData;
//   };

//   // Export to Excel function
//   const exportToExcel = () => {
//     try {
//       setExporting(true);
      
//       const filteredSchools = getFilteredSchoolsData();
//       const summary = dashboardData?.summary;
      
//       // Prepare summary data
//       const summaryData = [
//         { 'Report Type': 'ATTENDANCE DASHBOARD REPORT', 'Value': '' },
//         { 'Report Type': 'Generated On', 'Value': new Date().toLocaleString() },
//         { 'Report Type': 'Selected Date', 'Value': dashboardData?.filters?.date || 'All' },
//         { 'Report Type': 'Selected Batch', 'Value': dashboardData?.filters?.batch || 'All' },
//         { 'Report Type': 'Selected District', 'Value': dashboardData?.filters?.districtId || 'All' },
//         { 'Report Type': 'Selected Block', 'Value': dashboardData?.filters?.blockId || 'All' },
//         { 'Report Type': 'Selected School', 'Value': dashboardData?.filters?.schoolId || 'All' },
//         { 'Report Type': '', 'Value': '' },
//         { 'Report Type': 'SUMMARY STATISTICS', 'Value': '' },
//         { 'Report Type': 'Total Schools', 'Value': summary?.totalSchools || 0 },
//         { 'Report Type': 'Total Students', 'Value': summary?.totalStudents || 0 },
//         { 'Report Type': 'Total Present', 'Value': summary?.totalPresent || 0 },
//         { 'Report Type': 'Total Absent (Including Not Marked)', 'Value': (summary?.totalAbsent || 0) + (summary?.totalNotMarked || 0) },
//         { 'Report Type': 'Overall Attendance Percentage', 'Value': `${summary?.overallAttendancePercentage || 0}%` },
//         { 'Report Type': '', 'Value': '' }
//       ];
      
//       // Prepare school-wise data
//       const schoolData = filteredSchools.map((school, index) => ({
//         'S.No': index + 1,
//         'District': school.schoolDetails.districtName || 'N/A',
//         'Block': school.schoolDetails.blockName || 'N/A',
//         'School Name': school.schoolDetails.schoolName || 'N/A',
//         'School ID': school.schoolDetails.schoolId || 'N/A',
//         'Total Students': school.totalStudents,
//         'Present': school.attendance.present,
//         'Absent (Including Not Marked)': school.attendance.absent,
//         'Attendance %': `${school.attendance.percentage}%`
//       }));
      
//       // Create worksheet
//       const summarySheet = XLSX.utils.json_to_sheet(summaryData, { skipHeader: true });
//       const schoolSheet = XLSX.utils.json_to_sheet(schoolData);
      
//       // Adjust column widths for school sheet
//       schoolSheet['!cols'] = [
//         { wch: 6 },   // S.No
//         { wch: 15 },  // District
//         { wch: 15 },  // Block
//         { wch: 35 },  // School Name
//         { wch: 10 },  // School ID
//         { wch: 15 },  // Total Students
//         { wch: 10 },  // Present
//         { wch: 25 },  // Absent (Including Not Marked)
//         { wch: 15 }   // Attendance %
//       ];
      
//       // Create workbook
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
//       XLSX.utils.book_append_sheet(workbook, schoolSheet, 'School-wise Report');
      
//       // Generate filename with date
//       const fileName = `Attendance_Dashboard_${dashboardData?.filters?.date || 'report'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
//       // Export to Excel
//       XLSX.writeFile(workbook, fileName);
      
//       setError(null);
//       setTimeout(() => {
//         const successAlert = document.createElement('div');
//         successAlert.className = 'alert alert-success';
//         successAlert.innerText = 'Report exported successfully!';
//         successAlert.style.position = 'fixed';
//         successAlert.style.top = '20px';
//         successAlert.style.right = '20px';
//         successAlert.style.zIndex = '9999';
//         document.body.appendChild(successAlert);
//         setTimeout(() => successAlert.remove(), 3000);
//       }, 100);
      
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       setError("Failed to export report. Please try again.");
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Summary Cards Component
//   const SummaryCards = () => {
//     const summary = dashboardData?.summary;
//     if (!summary) return null;
    
//     // Calculate total absent including not marked
//     const totalAbsentWithNotMarked = (summary.totalAbsent || 0) + (summary.totalNotMarked || 0);
    
//     return (
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-primary text-white">
//             <Card.Body>
//               <FaSchool size={30} />
//               <h3 className="mt-2">{summary.totalSchools}</h3>
//               <p className="mb-0">Total Schools</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-success text-white">
//             <Card.Body>
//               <FaUsers size={30} />
//               <h3 className="mt-2">{summary.totalStudents}</h3>
//               <p className="mb-0">Total Students</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-info text-white">
//             <Card.Body>
//               <FaUserCheck size={30} />
//               <h3 className="mt-2">{summary.totalPresent}</h3>
//               <p className="mb-0">Total Present</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-warning text-white">
//             <Card.Body>
//               <FaChartLine size={30} />
//               <h3 className="mt-2">{summary.overallAttendancePercentage}%</h3>
//               <p className="mb-0">Attendance %</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     );
//   };

//   // Filter Button Component
//   const FilterButton = () => {
//     const schoolsData = getFilteredSchoolsData();
//     const noAttendanceCount = schoolsData.filter(s => s.attendance.present === 0).length;
//     const totalSchools = schoolsData.length;
    
//     return (
//       <Row className="mb-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-secondary text-white">
//               <h6 className="mb-0"><FaFilter className="me-2" />Filter</h6>
//             </Card.Header>
//             <Card.Body>
//               <div className="d-flex gap-3 flex-wrap">
//                 <ButtonGroup>
//                   <Button
//                     variant={!showNoAttendanceOnly ? "primary" : "outline-primary"}
//                     onClick={() => setShowNoAttendanceOnly(false)}
//                     className="d-flex align-items-center justify-content-center gap-2"
//                   >
//                     <FaSchool /> All Centers ({totalSchools})
//                   </Button>
//                   <Button
//                     variant={showNoAttendanceOnly ? "danger" : "outline-danger"}
//                     onClick={() => setShowNoAttendanceOnly(true)}
//                     className="d-flex align-items-center justify-content-center gap-2"
//                   >
//                     <FaBan /> Zero Present ({noAttendanceCount})
//                   </Button>
//                 </ButtonGroup>
//                 <Button
//                   variant="success"
//                   onClick={exportToExcel}
//                   disabled={exporting || !dashboardData?.schoolsData?.length}
//                   className="d-flex align-items-center justify-content-center gap-2 ms-auto"
//                 >
//                   {exporting ? (
//                     <>
//                       <Spinner animation="border" size="sm" />
//                       Exporting...
//                     </>
//                   ) : (
//                     <>
//                       <FaFileExcel /> Export to Excel
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     );
//   };

//   // School-wise Table Component
//   const SchoolsTable = () => {
//     const filteredSchools = getFilteredSchoolsData();
    
//     if (!filteredSchools || filteredSchools.length === 0) {
//       return (
//         <Alert variant="info" className="text-center">
//           No data available for the selected filter
//         </Alert>
//       );
//     }
    
//     return (
//       <div className="table-responsive">
//         <Table striped bordered hover className="mt-3" id="attendance-table">
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>District</th>
//               <th>Block</th>
//               <th>School Name</th>
//               <th>School ID</th>
//               <th>Total Students</th>
//               <th>Present</th>
//               <th>Absent (Including Not Marked)</th>
//               <th>Attendance %</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSchools.map((school, index) => (
//               <tr key={school.schoolDetails.schoolId} className={school.attendance.present === 0 ? "table-warning" : ""}>
//                 <td>{index + 1}</td>
//                 <td>{school.schoolDetails.districtName || 'N/A'}</td>
//                 <td>{school.schoolDetails.blockName || 'N/A'}</td>
//                 <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
//                 <td>{school.schoolDetails.schoolId || 'N/A'}</td>
//                 <td className="text-center">{school.totalStudents}</td>
//                 <td className="text-center text-success">
//                   <FaUserCheck /> {school.attendance.present}
//                 </td>
//                 <td className="text-center text-danger">
//                   <FaUserTimes /> {school.attendance.absent}
//                 </td>
//                 <td className="text-center">
//                   <Badge bg={school.attendance.percentage >= 70 ? "success" : school.attendance.percentage >= 40 ? "warning" : "danger"}>
//                     {school.attendance.percentage}%
//                   </Badge>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   // Additional Stats Cards
//   const AdditionalStats = () => {
//     const summary = dashboardData?.summary;
//     if (!summary) return null;
    
//     const totalAbsentWithNotMarked = (summary.totalAbsent || 0) + (summary.totalNotMarked || 0);
//     const attendanceRate = summary.totalStudents > 0 
//       ? ((summary.totalPresent / summary.totalStudents) * 100).toFixed(2)
//       : 0;
    
//     return (
//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="shadow-sm h-100 border-0 bg-light">
//             <Card.Body className="text-center">
//               <FaUserTimes size={30} className="text-danger mb-2" />
//               <h4 className="text-danger">{totalAbsentWithNotMarked}</h4>
//               <p className="mb-0 text-muted">Total Absent (Including Not Marked)</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm h-100 border-0 bg-light">
//             <Card.Body className="text-center">
//               <FaUserCheck size={30} className="text-success mb-2" />
//               <h4 className="text-success">{summary.totalPresent}</h4>
//               <p className="mb-0 text-muted">Total Present</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm h-100 border-0 bg-light">
//             <Card.Body className="text-center">
//               <FaChartLine size={30} className="text-primary mb-2" />
//               <h4 className="text-primary">{attendanceRate}%</h4>
//               <p className="mb-0 text-muted">Attendance Rate</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     );
//   };

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Alert to show selected filter values */}
//       {showAlert && (
//         <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="mb-3">
//           <Alert.Heading>Selected Filters</Alert.Heading>
//           <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
//         </Alert>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
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

//       {/* Dashboard Content */}
//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3">Loading attendance dashboard data...</p>
//         </div>
//       ) : (
//         dashboardData && (
//           <>
//             {/* Summary Cards */}
//             <SummaryCards />
            
//             {/* Additional Stats */}
//             <AdditionalStats />
            
//             {/* Filter and Export Button */}
//             <FilterButton />
            
//             {/* Schools Table */}
//             <Card className="shadow-sm">
//               <Card.Header className="bg-primary text-white">
//                 <h6 className="mb-0">
//                   {!showNoAttendanceOnly ? "School-wise Attendance Report" : "Schools with Zero Present Students"}
//                 </h6>
//               </Card.Header>
//               <Card.Body>
//                 <SchoolsTable />
//               </Card.Body>
//             </Card>
//           </>
//         )
//       )}
//     </Container>
//   );
// };





import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Table, ButtonGroup } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTimesCircle, FaSchool, FaChartLine, FaUsers, FaFileAlt, FaFilter, FaBan, FaPresent, FaUserCheck, FaUserTimes, FaDownload, FaFileExcel, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { StudentAttendanceDashboard } from "../../service/Student.service";
import * as XLSX from 'xlsx';
import { DownloadMBStudentAttendance } from "../Utils/DownloadMBStudentAttendnace";

export const MBStudentsAttendanceDashboard = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showNoAttendanceOnly, setShowNoAttendanceOnly] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sortField, setSortField] = useState("district");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const reqBody = {
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      date: startDate,
      districtId: schoolContext?.districtId,
      blockId: schoolContext?.blockId,
      isSlcTaken: false
    };

    console.log("Fetching attendance dashboard data with:", reqBody);
    
    try {
      const response = await StudentAttendanceDashboard(reqBody);
      console.log("Dashboard response:", response);
      
      if (response.success) {
        setDashboardData(response);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show alert when any filter value changes
  useEffect(() => {
    const schoolValue = schoolContext?.schoolId || "All";
    const batchValue = batchContext?.batch || "All";
    const dateValue = startDate || "All";
    const districtValue = schoolContext?.districtId || "All";
    const blockValue = schoolContext?.blockId || "All";
    
    setAlertMessage(`Selected Filters:\n🏢 District: ${districtValue}\n🏘️ Block: ${blockValue}\n📚 School: ${schoolValue}\n📖 Batch: ${batchValue}\n📅 Date: ${dateValue}`);
    setShowAlert(true);
    
    if (batchContext?.batch && startDate) {
      fetchDashboardData();
    }
    
    setShowNoAttendanceOnly(false);
    
    const timer = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(timer);
  }, [schoolContext, batchContext, startDate]);

  // Get filtered schools data (Not Marked counted as Absent)
  const getFilteredSchoolsData = () => {
    const schoolsData = dashboardData?.schoolsData || [];
    
    const transformedData = schoolsData.map(school => ({
      ...school,
      attendance: {
        ...school.attendance,
        absent: school.attendance.absent + school.attendance.notMarked,
        present: school.attendance.present,
        notMarked: 0,
        percentage: school.totalStudents > 0 
          ? ((school.attendance.present / school.totalStudents) * 100).toFixed(2)
          : 0
      }
    }));
    
    if (showNoAttendanceOnly) {
      return transformedData.filter(school => school.attendance.present === 0);
    }
    
    return transformedData;
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Get sorted schools data
  const getSortedSchoolsData = () => {
    const filteredSchools = getFilteredSchoolsData();
    
    const sorted = [...filteredSchools].sort((a, b) => {
      let aVal, bVal;
      
      switch(sortField) {
        case "district":
          aVal = a.schoolDetails.districtName || "";
          bVal = b.schoolDetails.districtName || "";
          break;
        case "block":
          aVal = a.schoolDetails.blockName || "";
          bVal = b.schoolDetails.blockName || "";
          break;
        case "schoolName":
          aVal = a.schoolDetails.schoolName || "";
          bVal = b.schoolDetails.schoolName || "";
          break;
        case "totalStudents":
          aVal = a.totalStudents || 0;
          bVal = b.totalStudents || 0;
          break;
        case "present":
          aVal = a.attendance.present || 0;
          bVal = b.attendance.present || 0;
          break;
        case "absent":
          aVal = a.attendance.absent || 0;
          bVal = b.attendance.absent || 0;
          break;
        case "percentage":
          aVal = parseFloat(a.attendance.percentage) || 0;
          bVal = parseFloat(b.attendance.percentage) || 0;
          break;
        default:
          aVal = a.schoolDetails.districtName || "";
          bVal = b.schoolDetails.districtName || "";
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      setExporting(true);
      
      const filteredSchools = getSortedSchoolsData();
      const summary = dashboardData?.summary;
      
      const summaryData = [
        { 'Report Type': 'ATTENDANCE DASHBOARD REPORT', 'Value': '' },
        { 'Report Type': 'Generated On', 'Value': new Date().toLocaleString() },
        { 'Report Type': 'Selected Date', 'Value': dashboardData?.filters?.date || 'All' },
        { 'Report Type': 'Selected Batch', 'Value': dashboardData?.filters?.batch || 'All' },
        { 'Report Type': 'Selected District', 'Value': dashboardData?.filters?.districtId || 'All' },
        { 'Report Type': 'Selected Block', 'Value': dashboardData?.filters?.blockId || 'All' },
        { 'Report Type': 'Selected School', 'Value': dashboardData?.filters?.schoolId || 'All' },
        { 'Report Type': '', 'Value': '' },
        { 'Report Type': 'SUMMARY STATISTICS', 'Value': '' },
        { 'Report Type': 'Total Schools', 'Value': summary?.totalSchools || 0 },
        { 'Report Type': 'Total Students', 'Value': summary?.totalStudents || 0 },
        { 'Report Type': 'Total Present', 'Value': summary?.totalPresent || 0 },
        { 'Report Type': 'Total Absent (Including Not Marked)', 'Value': (summary?.totalAbsent || 0) + (summary?.totalNotMarked || 0) },
        { 'Report Type': 'Overall Attendance Percentage', 'Value': `${summary?.overallAttendancePercentage || 0}%` },
        { 'Report Type': '', 'Value': '' }
      ];
      
      const schoolData = filteredSchools.map((school, index) => ({
        'S.No': index + 1,
        'District': school.schoolDetails.districtName || 'N/A',
        'Block': school.schoolDetails.blockName || 'N/A',
        'School Name': school.schoolDetails.schoolName || 'N/A',
        'School ID': school.schoolDetails.schoolId || 'N/A',
        'Total Students': school.totalStudents,
        'Present': school.attendance.present,
        'Absent (Including Not Marked)': school.attendance.absent,
        'Attendance %': `${school.attendance.percentage}%`
      }));
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData, { skipHeader: true });
      const schoolSheet = XLSX.utils.json_to_sheet(schoolData);
      
      schoolSheet['!cols'] = [
        { wch: 6 }, { wch: 15 }, { wch: 15 }, { wch: 35 },
        { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 25 }, { wch: 15 }
      ];
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      XLSX.utils.book_append_sheet(workbook, schoolSheet, 'School-wise Report');
      
      const fileName = `Attendance_Dashboard_${dashboardData?.filters?.date || 'report'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      setTimeout(() => {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.innerText = 'Report exported successfully!';
        successAlert.style.position = 'fixed';
        successAlert.style.top = '20px';
        successAlert.style.right = '20px';
        successAlert.style.zIndex = '9999';
        document.body.appendChild(successAlert);
        setTimeout(() => successAlert.remove(), 3000);
      }, 100);
      
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Summary Cards Component
  const SummaryCards = () => {
    const summary = dashboardData?.summary;
    if (!summary) return null;
    
    const totalAbsentWithNotMarked = (summary.totalAbsent || 0) + (summary.totalNotMarked || 0);
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <FaSchool size={30} />
              <h3 className="mt-2">{summary.totalSchools}</h3>
              <p className="mb-0">Total Schools</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <FaUsers size={30} />
              <h3 className="mt-2">{summary.totalStudents}</h3>
              <p className="mb-0">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <FaUserCheck size={30} />
              <h3 className="mt-2">{summary.totalPresent}</h3>
              <p className="mb-0">Total Present</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <FaChartLine size={30} />
              <h3 className="mt-2">{summary.overallAttendancePercentage}%</h3>
              <p className="mb-0">Attendance %</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Filter Button Component
  const FilterButton = () => {
    const schoolsData = getFilteredSchoolsData();
    const noAttendanceCount = schoolsData.filter(s => s.attendance.present === 0).length;
    const totalSchools = schoolsData.length;
    
    return (
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h6 className="mb-0"><FaFilter className="me-2" />Filter</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <ButtonGroup>
                  <Button
                    variant={!showNoAttendanceOnly ? "primary" : "outline-primary"}
                    onClick={() => setShowNoAttendanceOnly(false)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaSchool /> All Centers ({totalSchools})
                  </Button>
                  <Button
                    variant={showNoAttendanceOnly ? "danger" : "outline-danger"}
                    onClick={() => setShowNoAttendanceOnly(true)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaBan /> Zero Present ({noAttendanceCount})
                  </Button>
                </ButtonGroup>
                <Button
                  variant="success"
                  onClick={exportToExcel}
                  disabled={exporting || !dashboardData?.schoolsData?.length}
                  className="d-flex align-items-center justify-content-center gap-2 ms-auto"
                >
                  {exporting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaFileExcel /> Export to Excel
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // School-wise Table Component with Sorting
  const SchoolsTable = () => {
    const sortedSchools = getSortedSchoolsData();
    
    if (!sortedSchools || sortedSchools.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          No data available for the selected filter
        </Alert>
      );
    }
    
    const getSortIcon = (field) => {
      if (sortField !== field) return <FaSort className="ms-1" />;
      return sortOrder === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    };
    
    return (
      <div className="table-responsive">
        <Table striped bordered hover className="mt-3" id="attendance-table">
          <thead className="table-dark">
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("sno")}>S.No</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("district")}>
                District {getSortIcon("district")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("block")}>
                Block {getSortIcon("block")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("schoolName")}>
                School Name {getSortIcon("schoolName")}
              </th>
              <th>School ID</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("totalStudents")}>
                Total Students {getSortIcon("totalStudents")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("present")}>
                Present {getSortIcon("present")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("absent")}>
                Absent {getSortIcon("absent")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("percentage")}>
                Attendance % {getSortIcon("percentage")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSchools.map((school, index) => (
              <tr key={school.schoolDetails.schoolId} className={school.attendance.present === 0 ? "table-warning" : ""}>
                <td>{index + 1}</td>
                <td>{school.schoolDetails.districtName || 'N/A'}</td>
                <td>{school.schoolDetails.blockName || 'N/A'}</td>
                <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
                <td>{school.schoolDetails.schoolId || 'N/A'}</td>
                <td className="text-center">{school.totalStudents}</td>
                <td className="text-center text-success">
                  <FaUserCheck /> {school.attendance.present}
                </td>
                <td className="text-center text-danger">
                  <FaUserTimes /> {school.attendance.absent}
                </td>
                <td className="text-center">
                  <Badge bg={school.attendance.percentage >= 70 ? "success" : school.attendance.percentage >= 40 ? "warning" : "danger"}>
                    {school.attendance.percentage}%
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // Additional Stats Cards
  const AdditionalStats = () => {
    const summary = dashboardData?.summary;
    if (!summary) return null;
    
    const totalAbsentWithNotMarked = (summary.totalAbsent || 0) + (summary.totalNotMarked || 0);
    const attendanceRate = summary.totalStudents > 0 
      ? ((summary.totalPresent / summary.totalStudents) * 100).toFixed(2)
      : 0;
    
    return (
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100 border-0 bg-light">
            <Card.Body className="text-center">
              <FaUserTimes size={30} className="text-danger mb-2" />
              <h4 className="text-danger">{totalAbsentWithNotMarked}</h4>
              <p className="mb-0 text-muted">Total Absent (Including Not Marked)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100 border-0 bg-light">
            <Card.Body className="text-center">
              <FaUserCheck size={30} className="text-success mb-2" />
              <h4 className="text-success">{summary.totalPresent}</h4>
              <p className="mb-0 text-muted">Total Present</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100 border-0 bg-light">
            <Card.Body className="text-center">
              <FaChartLine size={30} className="text-primary mb-2" />
              <h4 className="text-primary">{attendanceRate}%</h4>
              <p className="mb-0 text-muted">Attendance Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid className="mt-4 mb-4">
      {showAlert && (
        <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="mb-3">
          <Alert.Heading>Selected Filters</Alert.Heading>
          <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
        </Alert>
      )}
<hr></hr>

<DownloadMBStudentAttendance/>
<hr></hr>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

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

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading attendance dashboard data...</p>
        </div>
      ) : (
        dashboardData && (
          <>
            <SummaryCards />
            <AdditionalStats />
            <FilterButton />
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  {!showNoAttendanceOnly ? "School-wise Attendance Report" : "Schools with Zero Present Students"}
                </h6>
              </Card.Header>
              <Card.Body>
                <SchoolsTable />
              </Card.Body>
            </Card>
          </>
        )
      )}
    </Container>
  );
};


