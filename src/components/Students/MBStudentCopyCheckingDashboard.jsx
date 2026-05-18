// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form } from "react-bootstrap";
// import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble, FaSchool } from "react-icons/fa";
// import { GetCopyCheckingData, CreateStudentCopyChecking, StudentCopyCheckinDashboard } from "../../service/StudentCopyChecking/studentCopyChecking.service";

// export const MBStudentCopyCheckingDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   // Show alert when any filter value changes
//   useEffect(() => {
//     const schoolValue = schoolContext?.schoolId || "Not selected";
//     const batchValue = batchContext?.batch || "Not selected";
//     const dateValue = startDate || "Not selected";
    
//     setAlertMessage(`Selected Filters:\n📚 School: ${schoolValue}\n📖 Batch: ${batchValue}\n📅 Date: ${dateValue}`);
//     setShowAlert(true);
    
//     // Auto hide alert after 3 seconds
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [schoolContext, batchContext, startDate]);

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Alert to show selected filter values */}
//       {showAlert && (
//         <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="mb-3">
//           <Alert.Heading>Selected Filters</Alert.Heading>
//           <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
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
//     </Container>
//   );
// };











// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form, Table } from "react-bootstrap";
// import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble, FaSchool, FaChartLine, FaUsers, FaFileAlt } from "react-icons/fa";
// import { StudentCopyCheckinDashboard } from "../../service/StudentCopyChecking/studentCopyChecking.service";

// export const MBStudentCopyCheckingDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   // Fetch dashboard data
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       date: startDate,
//       districtId: schoolContext?.districtId,
//       blockId: schoolContext?.blockId
//     };

//     console.log("Fetching dashboard data with:", reqBody);
    
//     try {
//       const response = await StudentCopyCheckinDashboard(reqBody);
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
    
//     // Auto hide alert after 3 seconds
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [schoolContext, batchContext, startDate]);

//   // Summary Cards Component
//   const SummaryCards = () => {
//     const summary = dashboardData?.summary;
//     if (!summary) return null;
    
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
//               <FaFileAlt size={30} />
//               <h3 className="mt-2">{summary.totalCopyCheckings}</h3>
//               <p className="mb-0">Total Copy Checkings</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-warning text-white">
//             <Card.Body>
//               <FaChartLine size={30} />
//               <h3 className="mt-2">{summary.overallCompletionRate.toFixed(1)}%</h3>
//               <p className="mb-0">Completion Rate</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     );
//   };

//   // School-wise Table Component
//   const SchoolsTable = () => {
//     const schoolsData = dashboardData?.schoolsData;
//     if (!schoolsData || schoolsData.length === 0) {
//       return (
//         <Alert variant="info" className="text-center">
//           No data available for the selected filters
//         </Alert>
//       );
//     }
    
//     return (
//       <div className="table-responsive">
//         <Table striped bordered hover className="mt-3">
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>District</th>
//               <th>Block</th>
//               <th>School Name</th>
//               <th>School ID</th>
//               <th>Total Students</th>
//               <th>With Checking</th>
//               <th>Without Checking</th>
//               <th>Total Records</th>
//               <th>Home Work</th>
//               <th>Class Work</th>
//               <th>Completion Rate</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schoolsData.map((school, index) => (
//               <tr key={school.schoolDetails.schoolId}>
//                 <td>{index + 1}</td>
//                 <td>{school.schoolDetails.districtName || 'N/A'}</td>
//                 <td>{school.schoolDetails.blockName || 'N/A'}</td>
//                 <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
//                 <td>{school.schoolDetails.schoolId || 'N/A'}</td>
//                 <td className="text-center">{school.totalStudents}</td>
//                 <td className="text-center text-success">
//                   <FaCheckCircle /> {school.studentsWithCopyCheckings}
//                 </td>
//                 <td className="text-center text-warning">
//                   <FaClock /> {school.studentsWithoutCopyCheckings}
//                 </td>
//                 <td className="text-center text-primary fw-bold">{school.overallStats.totalRecords}</td>
//                 <td className="text-center">
//                   <div>Total: {school.overallStats.typeWise.homeWork.total}</div>
//                   <small className="text-success">✓ {school.overallStats.typeWise.homeWork.complete}</small>
//                   <small className="text-warning ms-1">⏰ {school.overallStats.typeWise.homeWork.incomplete}</small>
//                   <small className="text-danger ms-1">✗ {school.overallStats.typeWise.homeWork.unavailable}</small>
//                 </td>
//                 <td className="text-center">
//                   <div>Total: {school.overallStats.typeWise.classWork.total}</div>
//                   <small className="text-success">✓ {school.overallStats.typeWise.classWork.complete}</small>
//                   <small className="text-warning ms-1">⏰ {school.overallStats.typeWise.classWork.incomplete}</small>
//                   <small className="text-danger ms-1">✗ {school.overallStats.typeWise.classWork.unavailable}</small>
//                 </td>
//                 <td className="text-center">
//                   <Badge bg={school.completionRate >= 70 ? "success" : school.completionRate >= 40 ? "warning" : "danger"}>
//                     {school.completionRate.toFixed(1)}%
//                   </Badge>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   // Subject-wise Statistics Component
//   const SubjectWiseStats = () => {
//     const schoolsData = dashboardData?.schoolsData;
//     if (!schoolsData || schoolsData.length === 0) return null;
    
//     // Aggregate subject-wise data across all schools
//     const subjectAggregation = {};
    
//     schoolsData.forEach(school => {
//       Object.entries(school.overallStats.subjectWise).forEach(([subject, stats]) => {
//         if (!subjectAggregation[subject]) {
//           subjectAggregation[subject] = {
//             total: 0,
//             complete: 0,
//             incomplete: 0,
//             unavailable: 0
//           };
//         }
//         subjectAggregation[subject].total += stats.total;
//         subjectAggregation[subject].complete += stats.complete;
//         subjectAggregation[subject].incomplete += stats.incomplete;
//         subjectAggregation[subject].unavailable += stats.unavailable;
//       });
//     });
    
//     return (
//       <>
//         <h5 className="mt-4 mb-3">Subject-wise Statistics</h5>
//         <div className="table-responsive">
//           <Table striped bordered hover size="sm">
//             <thead className="table-light">
//               <tr>
//                 <th>Subject</th>
//                 <th className="text-center">Total</th>
//                 <th className="text-center">Complete</th>
//                 <th className="text-center">Incomplete</th>
//                 <th className="text-center">Unavailable</th>
//                 <th className="text-center">Completion Rate</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(subjectAggregation).map(([subject, stats]) => {
//                 const completionRate = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0;
//                 return (
//                   <tr key={subject}>
//                     <td className="fw-semibold">{subject}</td>
//                     <td className="text-center">{stats.total}</td>
//                     <td className="text-center text-success">{stats.complete}</td>
//                     <td className="text-center text-warning">{stats.incomplete}</td>
//                     <td className="text-center text-danger">{stats.unavailable}</td>
//                     <td className="text-center">
//                       <Badge bg={completionRate >= 70 ? "success" : completionRate >= 40 ? "warning" : "danger"}>
//                         {completionRate.toFixed(1)}%
//                       </Badge>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </div>
//       </>
//     );
//   };

//   // Recent Submissions Component
//   const RecentSubmissions = () => {
//     const schoolsData = dashboardData?.schoolsData;
//     if (!schoolsData || schoolsData.length === 0) return null;
    
//     // Collect recent submissions from all schools
//     const allRecentSubmissions = [];
//     schoolsData.forEach(school => {
//       if (school.recentSubmissions && school.recentSubmissions.length > 0) {
//         allRecentSubmissions.push(...school.recentSubmissions);
//       }
//     });
    
//     // Sort by createdAt and get top 10
//     const sortedSubmissions = allRecentSubmissions
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 10);
    
//     if (sortedSubmissions.length === 0) return null;
    
//     return (
//       <>
//         <h5 className="mt-4 mb-3">Recent Submissions</h5>
//         <div className="table-responsive">
//           <Table striped bordered hover size="sm">
//             <thead className="table-light">
//               <tr>
//                 <th>Student SRN</th>
//                 <th>Subject</th>
//                 <th>Type</th>
//                 <th>Status</th>
//                 <th>Date</th>
//                 <th>Submitted At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedSubmissions.map((submission, idx) => (
//                 <tr key={idx}>
//                   <td>{submission.studentSrn}</td>
//                   <td>{submission.subject}</td>
//                   <td>{submission.copyCheckingType}</td>
//                   <td>
//                     <Badge bg={
//                       submission.status === "complete" ? "success" :
//                       submission.status === "incomplete" ? "warning" : "danger"
//                     }>
//                       {submission.status}
//                     </Badge>
//                   </td>
//                   <td>{new Date(submission.date).toLocaleDateString()}</td>
//                   <td>{new Date(submission.createdAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </>
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
//           <p className="mt-3">Loading dashboard data...</p>
//         </div>
//       ) : (
//         dashboardData && (
//           <>
//             {/* Summary Cards */}
//             <SummaryCards />
            
//             {/* Type-wise Summary */}
//             <Row className="mb-4">
//               <Col md={6}>
//                 <Card className="shadow-sm">
//                   <Card.Header className="bg-info text-white">
//                     <h6 className="mb-0">Home Work Statistics</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="text-center">
//                       <Col md={4}>
//                         <h4 className="text-primary">{dashboardData.summary.totalHomeWork}</h4>
//                         <small>Total Records</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-success">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.complete, 0)}
//                         </h4>
//                         <small>Complete</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-warning">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.incomplete, 0)}
//                         </h4>
//                         <small>Incomplete</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//               <Col md={6}>
//                 <Card className="shadow-sm">
//                   <Card.Header className="bg-success text-white">
//                     <h6 className="mb-0">Class Work Statistics</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="text-center">
//                       <Col md={4}>
//                         <h4 className="text-primary">{dashboardData.summary.totalClassWork}</h4>
//                         <small>Total Records</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-success">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.complete, 0)}
//                         </h4>
//                         <small>Complete</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-warning">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.incomplete, 0)}
//                         </h4>
//                         <small>Incomplete</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
            
//             {/* Schools Table */}
//             <Card className="shadow-sm">
//               <Card.Header className="bg-primary text-white">
//                 <h6 className="mb-0">School-wise Detailed Report</h6>
//               </Card.Header>
//               <Card.Body>
//                 <SchoolsTable />
//               </Card.Body>
//             </Card>
            
//             {/* Subject-wise Statistics */}
//             <Card className="shadow-sm mt-4">
//               <Card.Header className="bg-secondary text-white">
//                 <h6 className="mb-0">Subject-wise Analysis</h6>
//               </Card.Header>
//               <Card.Body>
//                 <SubjectWiseStats />
//               </Card.Body>
//             </Card>
            
//             {/* Recent Submissions */}
//             <Card className="shadow-sm mt-4">
//               <Card.Header className="bg-dark text-white">
//                 <h6 className="mb-0">Recent Submissions</h6>
//               </Card.Header>
//               <Card.Body>
//                 <RecentSubmissions />
//               </Card.Body>
//             </Card>
//           </>
//         )
//       )}
//     </Container>
//   );
// };





// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form, Table } from "react-bootstrap";
// import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble, FaSchool, FaChartLine, FaUsers, FaFileAlt, FaHome, FaChalkboard } from "react-icons/fa";
// import { StudentCopyCheckinDashboard } from "../../service/StudentCopyChecking/studentCopyChecking.service";

// export const MBStudentCopyCheckingDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   // Fetch dashboard data
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       date: startDate,
//       districtId: schoolContext?.districtId,
//       blockId: schoolContext?.blockId
//     };

//     console.log("Fetching dashboard data with:", reqBody);
    
//     try {
//       const response = await StudentCopyCheckinDashboard(reqBody);
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
    
//     // Auto hide alert after 3 seconds
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [schoolContext, batchContext, startDate]);

//   // Summary Cards Component
//   const SummaryCards = () => {
//     const summary = dashboardData?.summary;
//     if (!summary) return null;
    
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
//               <FaFileAlt size={30} />
//               <h3 className="mt-2">{summary.totalCopyCheckings}</h3>
//               <p className="mb-0">Total Copy Checkings</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-warning text-white">
//             <Card.Body>
//               <FaChartLine size={30} />
//               <h3 className="mt-2">{summary.overallCompletionRate.toFixed(1)}%</h3>
//               <p className="mb-0">Completion Rate</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     );
//   };

//   // School-wise Table Component
//   const SchoolsTable = () => {
//     const schoolsData = dashboardData?.schoolsData;
//     if (!schoolsData || schoolsData.length === 0) {
//       return (
//         <Alert variant="info" className="text-center">
//           No data available for the selected filters
//         </Alert>
//       );
//     }
    
//     return (
//       <div className="table-responsive">
//         <Table striped bordered hover className="mt-3">
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>District</th>
//               <th>Block</th>
//               <th>School Name</th>
//               <th>Total Students</th>
//               <th>Total Records</th>
//               <th>Home Work</th>
//               <th>Class Work</th>
//               <th>Completion Rate</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schoolsData.map((school, index) => (
//               <tr key={school.schoolDetails.schoolId}>
//                 <td>{index + 1}</td>
//                 <td>{school.schoolDetails.districtName || 'N/A'}</td>
//                 <td>{school.schoolDetails.blockName || 'N/A'}</td>
//                 <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
//                 <td className="text-center">{school.totalStudents}</td>
//                 <td className="text-center text-primary fw-bold">{school.overallStats.totalRecords}</td>
//                 <td className="text-center">
//                   <div><strong>Total:</strong> {school.overallStats.typeWise.homeWork.total}</div>
//                   <div><small className="text-success">✓ Complete: {school.overallStats.typeWise.homeWork.complete}</small></div>
//                   <div><small className="text-warning">⏰ Incomplete: {school.overallStats.typeWise.homeWork.incomplete}</small></div>
//                   <div><small className="text-danger">✗ Unavailable: {school.overallStats.typeWise.homeWork.unavailable}</small></div>
//                 </td>
//                 <td className="text-center">
//                   <div><strong>Total:</strong> {school.overallStats.typeWise.classWork.total}</div>
//                   <div><small className="text-success">✓ Complete: {school.overallStats.typeWise.classWork.complete}</small></div>
//                   <div><small className="text-warning">⏰ Incomplete: {school.overallStats.typeWise.classWork.incomplete}</small></div>
//                   <div><small className="text-danger">✗ Unavailable: {school.overallStats.typeWise.classWork.unavailable}</small></div>
//                 </td>
//                 <td className="text-center">
//                   <Badge bg={school.completionRate >= 70 ? "success" : school.completionRate >= 40 ? "warning" : "danger"}>
//                     {school.completionRate.toFixed(1)}%
//                   </Badge>
//                  </td>
//                </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   // Subject-wise Statistics Component (using API's subjectWiseSummary)
//   const SubjectWiseStats = () => {
//     const subjectWiseSummary = dashboardData?.subjectWiseSummary;
//     if (!subjectWiseSummary || Object.keys(subjectWiseSummary).length === 0) return null;
    
//     return (
//       <>
//         <h5 className="mt-4 mb-3">Subject-wise Statistics</h5>
//         <div className="table-responsive">
//           <Table striped bordered hover size="sm">
//             <thead className="table-light">
//               <tr>
//                 <th>Subject</th>
//                 <th className="text-center">Total</th>
//                 <th className="text-center">Complete</th>
//                 <th className="text-center">Incomplete</th>
//                 <th className="text-center">Unavailable</th>
//                 <th className="text-center">Home Work</th>
//                 <th className="text-center">Class Work</th>
//                 <th className="text-center">Completion Rate</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(subjectWiseSummary)
//                 .sort((a, b) => b[1].total - a[1].total)
//                 .map(([subject, stats]) => {
//                 const completionRate = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0;
//                 return (
//                   <tr key={subject}>
//                     <td className="fw-semibold">{subject}</td>
//                     <td className="text-center">{stats.total}</td>
//                     <td className="text-center text-success">{stats.complete}</td>
//                     <td className="text-center text-warning">{stats.incomplete}</td>
//                     <td className="text-center text-danger">{stats.unavailable}</td>
//                     <td className="text-center">{stats.homeWorkTotal}</td>
//                     <td className="text-center">{stats.classWorkTotal}</td>
//                     <td className="text-center">
//                       <Badge bg={completionRate >= 70 ? "success" : completionRate >= 40 ? "warning" : "danger"}>
//                         {completionRate.toFixed(1)}%
//                       </Badge>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </div>
//       </>
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
//           <p className="mt-3">Loading dashboard data...</p>
//         </div>
//       ) : (
//         dashboardData && (
//           <>
//             {/* Summary Cards */}
//             <SummaryCards />
            
//             {/* Type-wise Summary Cards */}
//             <Row className="mb-4">
//               <Col md={6}>
//                 <Card className="shadow-sm h-100">
//                   <Card.Header className="bg-info text-white">
//                     <h6 className="mb-0"><FaHome className="me-2" />Home Work Statistics</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="text-center">
//                       <Col md={4}>
//                         <h4 className="text-primary">{dashboardData.summary.totalHomeWork}</h4>
//                         <small>Total Records</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-success">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.complete, 0)}
//                         </h4>
//                         <small>Complete</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-warning">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.incomplete, 0)}
//                         </h4>
//                         <small>Incomplete</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//               <Col md={6}>
//                 <Card className="shadow-sm h-100">
//                   <Card.Header className="bg-success text-white">
//                     <h6 className="mb-0"><FaChalkboard className="me-2" />Class Work Statistics</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="text-center">
//                       <Col md={4}>
//                         <h4 className="text-primary">{dashboardData.summary.totalClassWork}</h4>
//                         <small>Total Records</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-success">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.complete, 0)}
//                         </h4>
//                         <small>Complete</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-warning">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.incomplete, 0)}
//                         </h4>
//                         <small>Incomplete</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
            
//             {/* Schools Table */}
//             <Card className="shadow-sm">
//               <Card.Header className="bg-primary text-white">
//                 <h6 className="mb-0">School-wise Detailed Report</h6>
//               </Card.Header>
//               <Card.Body>
//                 <SchoolsTable />
//               </Card.Body>
//             </Card>
            
//             {/* Subject-wise Statistics */}
//             <SubjectWiseStats />
//           </>
//         )
//       )}
//     </Container>
//   );
// };
























// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form, Table, ButtonGroup } from "react-bootstrap";
// import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble, FaSchool, FaChartLine, FaUsers, FaFileAlt, FaHome, FaChalkboard, FaFilter, FaSortAmountDown, FaSortAmountUp, FaBan } from "react-icons/fa";
// import { StudentCopyCheckinDashboard } from "../../service/StudentCopyChecking/studentCopyChecking.service";

// export const MBStudentCopyCheckingDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [filterType, setFilterType] = useState("all"); // all, noRecords, bottom10, top10

//   // Fetch dashboard data
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       date: startDate,
//       districtId: schoolContext?.districtId,
//       blockId: schoolContext?.blockId
//     };

//     console.log("Fetching dashboard data with:", reqBody);
    
//     try {
//       const response = await StudentCopyCheckinDashboard(reqBody);
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
    
//     // Reset filter type when main filters change
//     setFilterType("all");
    
//     // Auto hide alert after 3 seconds
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [schoolContext, batchContext, startDate]);

//   // Get filtered schools data based on filter type
//   const getFilteredSchoolsData = () => {
//     const schoolsData = dashboardData?.schoolsData || [];
    
//     if (filterType === "noRecords") {
//       // Schools with totalRecords = 0
//       return schoolsData.filter(school => school.overallStats.totalRecords === 0);
//     } else if (filterType === "bottom10") {
//       // Bottom 10 schools by totalRecords
//       return [...schoolsData]
//         .sort((a, b) => a.overallStats.totalRecords - b.overallStats.totalRecords)
//         .slice(0, 10);
//     } else if (filterType === "top10") {
//       // Top 10 schools by totalRecords
//       return [...schoolsData]
//         .sort((a, b) => b.overallStats.totalRecords - a.overallStats.totalRecords)
//         .slice(0, 10);
//     }
    
//     return schoolsData;
//   };

//   // Summary Cards Component
//   const SummaryCards = () => {
//     const summary = dashboardData?.summary;
//     if (!summary) return null;
    
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
//               <FaFileAlt size={30} />
//               <h3 className="mt-2">{summary.totalCopyCheckings}</h3>
//               <p className="mb-0">Total Copy Checkings</p>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="text-center shadow-sm border-0 bg-warning text-white">
//             <Card.Body>
//               <FaChartLine size={30} />
//               <h3 className="mt-2">{summary.overallCompletionRate.toFixed(1)}%</h3>
//               <p className="mb-0">Completion Rate</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     );
//   };

//   // Filter Buttons Component
//   const FilterButtons = () => {
//     const schoolsData = dashboardData?.schoolsData || [];
//     const noRecordsCount = schoolsData.filter(s => s.overallStats.totalRecords === 0).length;
    
//     return (
//       <Row className="mb-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-secondary text-white">
//               <h6 className="mb-0"><FaFilter className="me-2" />Additional Filters</h6>
//             </Card.Header>
//             <Card.Body>
//               <ButtonGroup className="w-100">
//                 <Button
//                   variant={filterType === "all" ? "primary" : "outline-primary"}
//                   onClick={() => setFilterType("all")}
//                   className="d-flex align-items-center justify-content-center gap-2"
//                 >
//                   <FaSchool /> All Centers ({schoolsData.length})
//                 </Button>
//                 <Button
//                   variant={filterType === "noRecords" ? "danger" : "outline-danger"}
//                   onClick={() => setFilterType("noRecords")}
//                   className="d-flex align-items-center justify-content-center gap-2"
//                 >
//                   <FaBan /> No Copy Checking ({noRecordsCount})
//                 </Button>
//                 <Button
//                   variant={filterType === "bottom10" ? "warning" : "outline-warning"}
//                   onClick={() => setFilterType("bottom10")}
//                   className="d-flex align-items-center justify-content-center gap-2"
//                 >
//                   <FaSortAmountDown /> Bottom 10 Centers
//                 </Button>
//                 <Button
//                   variant={filterType === "top10" ? "success" : "outline-success"}
//                   onClick={() => setFilterType("top10")}
//                   className="d-flex align-items-center justify-content-center gap-2"
//                 >
//                   <FaSortAmountUp /> Top 10 Centers
//                 </Button>
//               </ButtonGroup>
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
//         <Table striped bordered hover className="mt-3">
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>District</th>
//               <th>Block</th>
//               <th>School Name</th>
//               <th>Total Students</th>
//               <th>Total Records</th>
//               <th>Home Work</th>
//               <th>Class Work</th>
//               <th>Completion Rate</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSchools.map((school, index) => (
//               <tr key={school.schoolDetails.schoolId} className={school.overallStats.totalRecords === 0 ? "table-warning" : ""}>
//                 <td>{index + 1}</td>
//                 <td>{school.schoolDetails.districtName || 'N/A'}</td>
//                 <td>{school.schoolDetails.blockName || 'N/A'}</td>
//                 <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
//                 <td className="text-center">{school.totalStudents}</td>
//                 <td className="text-center text-primary fw-bold">{school.overallStats.totalRecords}</td>
//                 <td className="text-center">
//                   <div><strong>Total:</strong> {school.overallStats.typeWise.homeWork.total}</div>
//                   <div><small className="text-success">✓ Complete: {school.overallStats.typeWise.homeWork.complete}</small></div>
//                   <div><small className="text-warning">⏰ Incomplete: {school.overallStats.typeWise.homeWork.incomplete}</small></div>
//                   <div><small className="text-danger">✗ Unavailable: {school.overallStats.typeWise.homeWork.unavailable}</small></div>
//                 </td>
//                 <td className="text-center">
//                   <div><strong>Total:</strong> {school.overallStats.typeWise.classWork.total}</div>
//                   <div><small className="text-success">✓ Complete: {school.overallStats.typeWise.classWork.complete}</small></div>
//                   <div><small className="text-warning">⏰ Incomplete: {school.overallStats.typeWise.classWork.incomplete}</small></div>
//                   <div><small className="text-danger">✗ Unavailable: {school.overallStats.typeWise.classWork.unavailable}</small></div>
//                 </td>
//                 <td className="text-center">
//                   <Badge bg={school.completionRate >= 70 ? "success" : school.completionRate >= 40 ? "warning" : "danger"}>
//                     {school.completionRate.toFixed(1)}%
//                   </Badge>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   // Subject-wise Statistics Component (using API's subjectWiseSummary)
//   const SubjectWiseStats = () => {
//     const subjectWiseSummary = dashboardData?.subjectWiseSummary;
//     if (!subjectWiseSummary || Object.keys(subjectWiseSummary).length === 0) return null;
    
//     return (
//       <>
//         <h5 className="mt-4 mb-3">Subject-wise Statistics</h5>
//         <div className="table-responsive">
//           <Table striped bordered hover size="sm">
//             <thead className="table-light">
//               <tr>
//                 <th>Subject</th>
//                 <th className="text-center">Total</th>
//                 <th className="text-center">Complete</th>
//                 <th className="text-center">Incomplete</th>
//                 <th className="text-center">Unavailable</th>
//                 <th className="text-center">Home Work</th>
//                 <th className="text-center">Class Work</th>
//                 <th className="text-center">Completion Rate</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(subjectWiseSummary)
//                 .sort((a, b) => b[1].total - a[1].total)
//                 .map(([subject, stats]) => {
//                 const completionRate = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0;
//                 return (
//                   <tr key={subject}>
//                     <td className="fw-semibold">{subject}</td>
//                     <td className="text-center">{stats.total}</td>
//                     <td className="text-center text-success">{stats.complete}</td>
//                     <td className="text-center text-warning">{stats.incomplete}</td>
//                     <td className="text-center text-danger">{stats.unavailable}</td>
//                     <td className="text-center">{stats.homeWorkTotal}</td>
//                     <td className="text-center">{stats.classWorkTotal}</td>
//                     <td className="text-center">
//                       <Badge bg={completionRate >= 70 ? "success" : completionRate >= 40 ? "warning" : "danger"}>
//                         {completionRate.toFixed(1)}%
//                       </Badge>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </div>
//       </>
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
//           <p className="mt-3">Loading dashboard data...</p>
//         </div>
//       ) : (
//         dashboardData && (
//           <>
//             {/* Summary Cards */}
//             <SummaryCards />
            
//             {/* Type-wise Summary Cards */}
//             <Row className="mb-4">
//               <Col md={6}>
//                 <Card className="shadow-sm h-100">
//                   <Card.Header className="bg-info text-white">
//                     <h6 className="mb-0"><FaHome className="me-2" />Home Work Statistics</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="text-center">
//                       <Col md={4}>
//                         <h4 className="text-primary">{dashboardData.summary.totalHomeWork}</h4>
//                         <small>Total Records</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-success">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.complete, 0)}
//                         </h4>
//                         <small>Complete</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-warning">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.incomplete, 0)}
//                         </h4>
//                         <small>Incomplete</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//               <Col md={6}>
//                 <Card className="shadow-sm h-100">
//                   <Card.Header className="bg-success text-white">
//                     <h6 className="mb-0"><FaChalkboard className="me-2" />Class Work Statistics</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="text-center">
//                       <Col md={4}>
//                         <h4 className="text-primary">{dashboardData.summary.totalClassWork}</h4>
//                         <small>Total Records</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-success">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.complete, 0)}
//                         </h4>
//                         <small>Complete</small>
//                       </Col>
//                       <Col md={4}>
//                         <h4 className="text-warning">
//                           {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.incomplete, 0)}
//                         </h4>
//                         <small>Incomplete</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
            
//             {/* Additional Filter Buttons */}
//             <FilterButtons />
            
//             {/* Schools Table */}
//             <Card className="shadow-sm">
//               <Card.Header className="bg-primary text-white">
//                 <h6 className="mb-0">
//                   {filterType === "all" && "School-wise Detailed Report"}
//                   {filterType === "noRecords" && "Schools with No Copy Checking Records"}
//                   {filterType === "bottom10" && "Bottom 10 Centers (Lowest Copy Checking)"}
//                   {filterType === "top10" && "Top 10 Centers (Highest Copy Checking)"}
//                 </h6>
//               </Card.Header>
//               <Card.Body>
//                 <SchoolsTable />
//               </Card.Body>
//             </Card>
            
//             {/* Subject-wise Statistics */}
//             <SubjectWiseStats />
//           </>
//         )
//       )}
//     </Container>
//   );
// };








import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form, Table, ButtonGroup } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble, FaSchool, FaChartLine, FaUsers, FaFileAlt, FaHome, FaChalkboard, FaFilter, FaSortAmountDown, FaSortAmountUp, FaBan } from "react-icons/fa";
import { StudentCopyCheckinDashboard } from "../../service/StudentCopyChecking/studentCopyChecking.service";

export const MBStudentCopyCheckingDashboard = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, noRecords, bottom10, top10

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const reqBody = {
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      date: startDate,
      districtId: schoolContext?.districtId,
      blockId: schoolContext?.blockId
    };

    console.log("Fetching dashboard data with:", reqBody);
    
    try {
      const response = await StudentCopyCheckinDashboard(reqBody);
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
    // setShowAlert(true);
    
    // Fetch data when filters change
    if (batchContext?.batch && startDate) {
      fetchDashboardData();
    }
    
    // Reset filter type when main filters change
    setFilterType("all");
    
    // Auto hide alert after 3 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [schoolContext, batchContext, startDate]);

  // Get filtered schools data based on filter type
  const getFilteredSchoolsData = () => {
    const schoolsData = dashboardData?.schoolsData || [];
    
    if (filterType === "noRecords") {
      // Schools with totalRecords = 0
      return schoolsData.filter(school => school.overallStats.totalRecords === 0);
    } else if (filterType === "bottom10") {
      // Bottom 10 schools by totalRecords
      return [...schoolsData]
        .sort((a, b) => a.overallStats.totalRecords - b.overallStats.totalRecords)
        .slice(0, 10);
    } else if (filterType === "top10") {
      // Top 10 schools by totalRecords
      return [...schoolsData]
        .sort((a, b) => b.overallStats.totalRecords - a.overallStats.totalRecords)
        .slice(0, 10);
    }
    
    return schoolsData;
  };

  // Summary Cards Component
  const SummaryCards = () => {
    const summary = dashboardData?.summary;
    if (!summary) return null;
    
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
              <FaFileAlt size={30} />
              <h3 className="mt-2">{summary.totalCopyCheckings}</h3>
              <p className="mb-0">Total Copy Checkings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <FaChartLine size={30} />
              <h3 className="mt-2">{summary.overallCompletionRate.toFixed(1)}%</h3>
              <p className="mb-0">Completion Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Filter Buttons Component
  const FilterButtons = () => {
    const schoolsData = dashboardData?.schoolsData || [];
    const noRecordsCount = schoolsData.filter(s => s.overallStats.totalRecords === 0).length;
    
    return (
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h6 className="mb-0"><FaFilter className="me-2" />Additional Filters</h6>
            </Card.Header>
            <Card.Body>
              <ButtonGroup className="w-100">
                <Button
                  variant={filterType === "all" ? "primary" : "outline-primary"}
                  onClick={() => setFilterType("all")}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSchool /> All Centers ({schoolsData.length})
                </Button>
                <Button
                  variant={filterType === "noRecords" ? "danger" : "outline-danger"}
                  onClick={() => setFilterType("noRecords")}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <FaBan /> No Copy Checking ({noRecordsCount})
                </Button>
                {/* <Button
                  variant={filterType === "bottom10" ? "warning" : "outline-warning"}
                  onClick={() => setFilterType("bottom10")}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSortAmountDown /> Bottom 10 Centers
                </Button>
                <Button
                  variant={filterType === "top10" ? "success" : "outline-success"}
                  onClick={() => setFilterType("top10")}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSortAmountUp /> Top 10 Centers
                </Button> */}
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // School-wise Table Component
  const SchoolsTable = () => {
    const filteredSchools = getFilteredSchoolsData();
    
    if (!filteredSchools || filteredSchools.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          No data available for the selected filter
        </Alert>
      );
    }
    
    return (
      <div className="table-responsive">
        <Table striped bordered hover className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>District</th>
              <th>Block</th>
              <th>School Name</th>
              <th>Total Students</th>
              <th>Total Records</th>
              <th>Home Work</th>
              <th>Class Work</th>
              <th>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map((school, index) => (
              <tr key={school.schoolDetails.schoolId} className={school.overallStats.totalRecords === 0 ? "table-warning" : ""}>
                <td>{index + 1}</td>
                <td>{school.schoolDetails.districtName || 'N/A'}</td>
                <td>{school.schoolDetails.blockName || 'N/A'}</td>
                <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
                <td className="text-center">{school.totalStudents}</td>
                <td className="text-center text-primary fw-bold">{school.overallStats.totalRecords}</td>
                <td className="text-center">
                  <div><strong>Total:</strong> {school.overallStats.typeWise.homeWork.total}</div>
                  <div><small className="text-success">✓ Complete: {school.overallStats.typeWise.homeWork.complete}</small></div>
                  <div><small className="text-warning">⏰ Incomplete: {school.overallStats.typeWise.homeWork.incomplete}</small></div>
                  <div><small className="text-danger">✗ Unavailable: {school.overallStats.typeWise.homeWork.unavailable}</small></div>
                </td>
                <td className="text-center">
                  <div><strong>Total:</strong> {school.overallStats.typeWise.classWork.total}</div>
                  <div><small className="text-success">✓ Complete: {school.overallStats.typeWise.classWork.complete}</small></div>
                  <div><small className="text-warning">⏰ Incomplete: {school.overallStats.typeWise.classWork.incomplete}</small></div>
                  <div><small className="text-danger">✗ Unavailable: {school.overallStats.typeWise.classWork.unavailable}</small></div>
                </td>
                <td className="text-center">
                  <Badge bg={school.completionRate >= 70 ? "success" : school.completionRate >= 40 ? "warning" : "danger"}>
                    {school.completionRate.toFixed(1)}%
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // Subject-wise Statistics Component (using API's subjectWiseSummary)
  const SubjectWiseStats = () => {
    const subjectWiseSummary = dashboardData?.subjectWiseSummary;
    if (!subjectWiseSummary || Object.keys(subjectWiseSummary).length === 0) return null;
    
    return (
      <>
        <h5 className="mt-4 mb-3">Subject-wise Statistics</h5>
        <div className="table-responsive">
          <Table striped bordered hover size="sm">
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th className="text-center">Total</th>
                <th className="text-center">Complete</th>
                <th className="text-center">Incomplete</th>
                <th className="text-center">Unavailable</th>
                <th className="text-center">Home Work</th>
                <th className="text-center">Class Work</th>
                <th className="text-center">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(subjectWiseSummary)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([subject, stats]) => {
                const completionRate = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0;
                return (
                  <tr key={subject}>
                    <td className="fw-semibold">{subject}</td>
                    <td className="text-center">{stats.total}</td>
                    <td className="text-center text-success">{stats.complete}</td>
                    <td className="text-center text-warning">{stats.incomplete}</td>
                    <td className="text-center text-danger">{stats.unavailable}</td>
                    <td className="text-center">{stats.homeWorkTotal}</td>
                    <td className="text-center">{stats.classWorkTotal}</td>
                    <td className="text-center">
                      <Badge bg={completionRate >= 70 ? "success" : completionRate >= 40 ? "warning" : "danger"}>
                        {completionRate.toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <Container fluid className="mt-4 mb-4">
      {/* Alert to show selected filter values */}
      {showAlert && (
        <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="mb-3">
          <Alert.Heading>Selected Filters</Alert.Heading>
          <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Filters Section */}
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

      {/* Dashboard Content */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      ) : (
        dashboardData && (
          <>
            {/* Summary Cards */}
            <SummaryCards />
            
            {/* Type-wise Summary Cards */}
            <Row className="mb-4">
              <Col md={6}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0"><FaHome className="me-2" />Home Work Statistics</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="text-center">
                      <Col md={4}>
                        <h4 className="text-primary">{dashboardData.summary.totalHomeWork}</h4>
                        <small>Total Records</small>
                      </Col>
                      <Col md={4}>
                        <h4 className="text-success">
                          {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.complete, 0)}
                        </h4>
                        <small>Complete</small>
                      </Col>
                      <Col md={4}>
                        <h4 className="text-warning">
                          {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.homeWork.incomplete, 0)}
                        </h4>
                        <small>Incomplete</small>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0"><FaChalkboard className="me-2" />Class Work Statistics</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="text-center">
                      <Col md={4}>
                        <h4 className="text-primary">{dashboardData.summary.totalClassWork}</h4>
                        <small>Total Records</small>
                      </Col>
                      <Col md={4}>
                        <h4 className="text-success">
                          {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.complete, 0)}
                        </h4>
                        <small>Complete</small>
                      </Col>
                      <Col md={4}>
                        <h4 className="text-warning">
                          {dashboardData.schoolsData.reduce((sum, s) => sum + s.overallStats.typeWise.classWork.incomplete, 0)}
                        </h4>
                        <small>Incomplete</small>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Additional Filter Buttons */}
            <FilterButtons />
            
            {/* Schools Table */}
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  {filterType === "all" && "School-wise Detailed Report"}
                  {filterType === "noRecords" && "Schools with No Copy Checking Records"}
                  {filterType === "bottom10" && "Bottom 10 Centers (Lowest Copy Checking)"}
                  {filterType === "top10" && "Top 10 Centers (Highest Copy Checking)"}
                </h6>
              </Card.Header>
              <Card.Body>
                <SchoolsTable />
              </Card.Body>
            </Card>
            
            {/* Subject-wise Statistics */}
            <SubjectWiseStats />
          </>
        )
      )}
    </Container>
  );
};