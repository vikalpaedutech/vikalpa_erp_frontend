// // /FRONTEND/src/components/DashBoard

// import React, {useEffect, useState, useContext} from 'react';

// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Table,
// } from "react-bootstrap";
// import { href, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { MdMenuOpen } from "react-icons/md";
// import { UserAttendance } from "../../components/user/UserAttendance";
// import { studentAndAttendanceAndAbsenteeCallingCount, attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";


// export const StudentAttendanceDashBoard = () => {

//   //Context hooks
//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [studentCount, setStudentCount] = useState([]);
//   const [pdfData, setPdfData] = useState([]);

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: userData[0].schoolIds,
//       classFilters: userData[0].classId || ['9', '10'],
//       date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format
//     };

//     try {
//       const response = await studentAndAttendanceAndAbsenteeCallingCount(payload);
//       console.log(response.data);

//       // Sorting logic: present === 0 should come first
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.present === 0 && b.present !== 0) return -1;
//           if (a.present !== 0 && b.present === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       // Sort schools by districtName
//       sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));

//       setStudentCount(sortedData);
//     } catch (error) {
//       console.log("Error fetching student count");
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, []);

//   // Summary by class
//   const classSummary = {
//     '9': { totalStudents: 0, present: 0, absent: 0 },
//     '10': { totalStudents: 0, present: 0, absent: 0 }
//   };

//   studentCount.forEach((school) => {
//     school.classes.forEach((cls) => {
//       const key = cls.classofStudent;
//       if (classSummary[key]) {
//         classSummary[key].totalStudents += cls.totalStudents;
//         classSummary[key].present += cls.present;
//         classSummary[key].absent += cls.absent;
//       }
//     });
//   });

//   return (
//     <Container className="mt-4">
//       {/* Summary Card */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall Summary</Card.Title>
//           <div >
//             <div>
//               <strong>Class 9 -</strong> Total: {classSummary['9'].totalStudents}, Present: {classSummary['9'].present}, Absent: {classSummary['9'].absent}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total: {classSummary['10'].totalStudents}, Present: {classSummary['10'].present}, Absent: {classSummary['10'].absent}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Attendance Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>School-wise Attendance</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>Total</th>
//                 <th>Present</th>
//                 <th>Absent</th>
//                 {/* <th>Absentee Calls</th> */}
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {studentCount.map((school, schoolIndex) =>
//                 school.classes.map((cls, classIndex) => {
//                   const allAbsent = cls.present === 0 && cls.totalStudents > 0;
//                   const serialNo = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//                   return (
//                     <tr
//                       key={`${school.schoolId}-${cls.classofStudent}`}
//                       style={{
//                         backgroundColor: allAbsent ? '#ffcccc' : 'transparent',
//                       }}
//                     >
//                       <td>{serialNo}</td>
//                       {classIndex === 0 && (
//                         <>
//                           <td rowSpan={school.classes.length} className="align-middle">
//                             {school.districtName}
//                           </td>
//                           <td rowSpan={school.classes.length} className="align-middle">
//                             {school.schoolName}
//                           </td>
//                         </>
//                       )}
//                       <td>{cls.classofStudent}</td>
//                       <td>{cls.totalStudents}</td>
//                       <td
//                         style={{
//                           backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit',
//                           fontWeight: cls.present === 0 ? 'bold' : 'normal',
//                         }}
//                       >
//                         {cls.present}
//                       </td>
//                       <td>{cls.absent}</td>
//                       {/* <td>{cls.totalAbsenteeCallings}</td> */}
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };




































// // /FRONTEND/src/components/DashBoard

// import React, {useEffect, useState, useContext} from 'react';

// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Table,
//   Form,
// } from "react-bootstrap";
// import { href, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { MdMenuOpen } from "react-icons/md";
// import { UserAttendance } from "../../components/user/UserAttendance";
// import { studentAndAttendanceAndAbsenteeCallingCount, attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";
// import {Row, Col} from 'react-bootstrap'

// // Utility for CSV export
// const exportToCsv = (rows, filename = 'attendance-data.csv') => {
//   const csvContent = [
//     ['S. No.', 'District', 'School', 'Class', 'Total', 'Present', 'Absent'],
//     ...rows.map(r => [r.serial, r.district, r.school, r.class, r.total, r.present, r.absent])
//   ].map(e => e.join(",")).join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const StudentAttendanceDashBoard = () => {

//   //Context hooks
//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [studentCount, setStudentCount] = useState([]);
//   const [pdfData, setPdfData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showOnlyAbsent, setShowOnlyAbsent] = useState(false);

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: userData[0].schoolIds,
//       classFilters: userData[0].classId || ['9', '10'],
//       date: selectedDate + "T00:00:00.000+00:00", // same format
//     };

//     try {
//       const response = await studentAndAttendanceAndAbsenteeCallingCount(payload);
//       console.log(response.data);

//       // Sorting logic: present === 0 should come first
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.present === 0 && b.present !== 0) return -1;
//           if (a.present !== 0 && b.present === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       // Sort schools by districtName
//       sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));

//       setStudentCount(sortedData);
//     } catch (error) {
//       console.log("Error fetching student count");
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, [selectedDate]);

//   // Summary by class
//   const classSummary = {
//     '9': { totalStudents: 0, present: 0, absent: 0 },
//     '10': { totalStudents: 0, present: 0, absent: 0 }
//   };

//   studentCount.forEach((school) => {
//     school.classes.forEach((cls) => {
//       const key = cls.classofStudent;
//       if (classSummary[key]) {
//         classSummary[key].totalStudents += cls.totalStudents;
//         classSummary[key].present += cls.present;
//         classSummary[key].absent += cls.absent;
//       }
//     });
//   });

//   // Flattened filtered data for export
//   const flattenedRows = [];
//   studentCount.forEach((school, schoolIndex) =>
//     school.classes.forEach((cls, classIndex) => {
//       if (!showOnlyAbsent || cls.present === 0) {
//         const serial = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//         flattenedRows.push({
//           serial,
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.classofStudent,
//           total: cls.totalStudents,
//           present: cls.present,
//           absent: cls.absent
//         });
//       }
//     })
//   );

//   return (
//     <Container className="mt-4">
//       {/* Filters */}
//       <Card className="mb-3 shadow-sm p-3">
//         <Form>
//           <Form.Group as={Row} className="align-items-center">
//             <Form.Label column sm={2}><strong>Select Date</strong></Form.Label>
//             <Col sm={4}>
//               <Form.Control
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//               />
//             </Col>
//             <Col sm={3}>
//               <Form.Check
//                 type="checkbox"
//                 label="Show only Present = 0"
//                 checked={showOnlyAbsent}
//                 onChange={(e) => setShowOnlyAbsent(e.target.checked)}
//               />
//             </Col>
//             <Col sm={3}>
//               <Button variant="success" onClick={() => exportToCsv(flattenedRows)}>
//                 Export to CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Summary Card */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall Summary</Card.Title>
//           <div >
//             <div>
//               <strong>Class 9 -</strong> Total: {classSummary['9'].totalStudents}, Present: {classSummary['9'].present}, Absent: {classSummary['9'].absent}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total: {classSummary['10'].totalStudents}, Present: {classSummary['10'].present}, Absent: {classSummary['10'].absent}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Attendance Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>School-wise Attendance</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>Total</th>
//                 <th>Present</th>
//                 <th>Absent</th>
//                 {/* <th>Absentee Calls</th> */}
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {studentCount.map((school, schoolIndex) =>
//                 school.classes.map((cls, classIndex) => {
//                   const allAbsent = cls.present === 0 && cls.totalStudents > 0;
//                   const serialNo = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//                   if (showOnlyAbsent && cls.present !== 0) return null;
//                   return (
//                     <tr
//                       key={`${school.schoolId}-${cls.classofStudent}`}
//                       style={{
//                         backgroundColor: allAbsent ? '#ffcccc' : 'transparent',
//                       }}
//                     >
//                       <td>{serialNo}</td>
//                       {classIndex === 0 && (
//                         <>
//                           <td rowSpan={school.classes.length} className="align-middle">
//                             {school.districtName}
//                           </td>
//                           <td rowSpan={school.classes.length} className="align-middle">
//                             {school.schoolName}
//                           </td>
//                         </>
//                       )}
//                       <td>{cls.classofStudent}</td>
//                       <td>{cls.totalStudents}</td>
//                       <td
//                         style={{
//                           backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit',
//                           fontWeight: cls.present === 0 ? 'bold' : 'normal',
//                         }}
//                       >
//                         {cls.present}
//                       </td>
//                       <td>{cls.absent}</td>
//                       {/* <td>{cls.totalAbsenteeCallings}</td> */}
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };
























// // /FRONTEND/src/components/DashBoard

// import React, {useEffect, useState, useContext} from 'react';

// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Table,
//   Form,
// } from "react-bootstrap";
// import { href, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { MdMenuOpen } from "react-icons/md";
// import { UserAttendance } from "../../components/user/UserAttendance";
// import { studentAndAttendanceAndAbsenteeCallingCount, attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";
// import {Row, Col} from 'react-bootstrap'

// // Utility for CSV export
// const exportToCsv = (rows, filename = 'attendance-data.csv') => {
//   const csvContent = [
//     ['S. No.', 'District', 'School', 'Class', 'Total', 'Present', 'Absent'],
//     ...rows.map(r => [r.serial, r.district, r.school, r.class, r.total, r.present, r.absent])
//   ].map(e => e.join(",")).join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const StudentAttendanceDashBoard = () => {

//   //Context hooks
//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [studentCount, setStudentCount] = useState([]);
//   const [pdfData, setPdfData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showOnlyAbsent, setShowOnlyAbsent] = useState(false);

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: userData[0].schoolIds,
//       classFilters: userData[0].classId || ['9', '10'],
//       date: selectedDate + "T00:00:00.000+00:00", // same format
//     };

//     try {
//       const response = await studentAndAttendanceAndAbsenteeCallingCount(payload);
//       console.log(response.data);

//       // Sorting logic: present === 0 should come first
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.present === 0 && b.present !== 0) return -1;
//           if (a.present !== 0 && b.present === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       // Sort schools by districtName
//       sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));

//       setStudentCount(sortedData);
//     } catch (error) {
//       console.log("Error fetching student count");
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, [selectedDate]);

//   // Summary by class
//   const classSummary = {
//     '9': { totalStudents: 0, present: 0, absent: 0 },
//     '10': { totalStudents: 0, present: 0, absent: 0 }
//   };

//   studentCount.forEach((school) => {
//     school.classes.forEach((cls) => {
//       const key = cls.classofStudent;
//       if (classSummary[key]) {
//         classSummary[key].totalStudents += cls.totalStudents;
//         classSummary[key].present += cls.present;
//         classSummary[key].absent += cls.absent;
//       }
//     });
//   });

//   // Flattened filtered data for export
//   const flattenedRows = [];
//   studentCount.forEach((school, schoolIndex) =>
//     school.classes.forEach((cls, classIndex) => {
//       if (!showOnlyAbsent || cls.present === 0) {
//         const serial = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//         flattenedRows.push({
//           serial,
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.classofStudent,
//           total: cls.totalStudents,
//           present: cls.present,
//           absent: cls.absent
//         });
//       }
//     })
//   );

//   return (
//   <Container className="mt-4">
//     {/* Filters */}
//     <Card className="mb-3 shadow-sm p-3">
//       <Form>
//         <Form.Group as={Row} className="align-items-center">
//           <Form.Label column sm={2}><strong>Select Date</strong></Form.Label>
//           <Col sm={4}>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Col>
//           <Col sm={2}>
//             <Form.Check
//               type="checkbox"
//               label="Show only Present = 0"
//               checked={showOnlyAbsent}
//               onChange={(e) => setShowOnlyAbsent(e.target.checked)}
//             />
//           </Col>
//           <Col sm={2}>
//             <Form.Check
//               inline
//               type="radio"
//               name="classFilter"
//               label="All"
//               checked={!userData[0].filterClass || userData[0].filterClass === "all"}
//               onChange={() => setUserData([{ ...userData[0], filterClass: "all" }])}
//             />
//             <Form.Check
//               inline
//               type="radio"
//               name="classFilter"
//               label="Class 9"
//               checked={userData[0].filterClass === "9"}
//               onChange={() => setUserData([{ ...userData[0], filterClass: "9" }])}
//             />
//             <Form.Check
//               inline
//               type="radio"
//               name="classFilter"
//               label="Class 10"
//               checked={userData[0].filterClass === "10"}
//               onChange={() => setUserData([{ ...userData[0], filterClass: "10" }])}
//             />
//           </Col>
//           <Col sm={2}>
//             <Button variant="success" onClick={() => exportToCsv(flattenedRows)}>
//               Export to CSV
//             </Button>
//           </Col>
//         </Form.Group>
//       </Form>
//     </Card>

//     {/* Summary Card */}
//     <Card className="mb-4 shadow-sm">
//       <Card.Body>
//         <Card.Title>Overall Summary</Card.Title>
//         <div>
//           <div>
//             <strong>Class 9 -</strong> Total: {classSummary['9'].totalStudents}, Present: {classSummary['9'].present}, Absent: {classSummary['9'].absent}
//           </div>
//           <div>
//             <strong>Class 10 -</strong> Total: {classSummary['10'].totalStudents}, Present: {classSummary['10'].present}, Absent: {classSummary['10'].absent}
//           </div>
//         </div>
//       </Card.Body>
//     </Card>

//     {/* Class 9 Table */}
//     {(userData[0].filterClass === "9" || userData[0].filterClass === "all") && (
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <Card.Title>Class 9 Attendance</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>Total</th>
//                 <th>Present</th>
//                 <th>Absent</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {studentCount.map((school, schoolIndex) =>
//                 school.classes
//                   .filter((cls) => cls.classofStudent === '9')
//                   .map((cls, classIndex) => {
//                     const allAbsent = cls.present === 0 && cls.totalStudents > 0;
//                     const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                     if (showOnlyAbsent && cls.present !== 0) return null;
//                     return (
//                       <tr
//                         key={`${school.schoolId}-9-${classIndex}`}
//                         style={{ backgroundColor: allAbsent ? '#ffcccc' : 'transparent' }}
//                       >
//                         <td>{serialNo}</td>
//                         {classIndex === 0 && (
//                           <>
//                             <td rowSpan={school.classes.filter(c => c.classofStudent === '9').length} className="align-middle">
//                               {school.districtName}
//                             </td>
//                             <td rowSpan={school.classes.filter(c => c.classofStudent === '9').length} className="align-middle">
//                               {school.schoolName}
//                             </td>
//                           </>
//                         )}
//                         <td>{cls.classofStudent}</td>
//                         <td>{cls.totalStudents}</td>
//                         <td style={{ backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit', fontWeight: cls.present === 0 ? 'bold' : 'normal' }}>{cls.present}</td>
//                         <td>{cls.absent}</td>
//                       </tr>
//                     );
//                   })
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     )}

//     {/* Class 10 Table */}
//     {(userData[0].filterClass === "10" || userData[0].filterClass === "all") && (
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Class 10 Attendance</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>Total</th>
//                 <th>Present</th>
//                 <th>Absent</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {studentCount.map((school, schoolIndex) =>
//                 school.classes
//                   .filter((cls) => cls.classofStudent === '10')
//                   .map((cls, classIndex) => {
//                     const allAbsent = cls.present === 0 && cls.totalStudents > 0;
//                     const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                     if (showOnlyAbsent && cls.present !== 0) return null;
//                     return (
//                       <tr
//                         key={`${school.schoolId}-10-${classIndex}`}
//                         style={{ backgroundColor: allAbsent ? '#ffcccc' : 'transparent' }}
//                       >
//                         <td>{serialNo}</td>
//                         {classIndex === 0 && (
//                           <>
//                             <td rowSpan={school.classes.filter(c => c.classofStudent === '10').length} className="align-middle">
//                               {school.districtName}
//                             </td>
//                             <td rowSpan={school.classes.filter(c => c.classofStudent === '10').length} className="align-middle">
//                               {school.schoolName}
//                             </td>
//                           </>
//                         )}
//                         <td>{cls.classofStudent}</td>
//                         <td>{cls.totalStudents}</td>
//                         <td style={{ backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit', fontWeight: cls.present === 0 ? 'bold' : 'normal' }}>{cls.present}</td>
//                         <td>{cls.absent}</td>
//                       </tr>
//                     );
//                   })
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     )}
//   </Container>
// );

// };


















// /FRONTEND/src/components/DashBoard

import React, {useEffect, useState, useContext} from 'react';

import {
  ListGroup,
  Accordion,
  Offcanvas,
  Button,
  Container,
  Navbar,
  Card,
  Carousel,
  Table,
  Form,
} from "react-bootstrap";
import { href, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";
import { MdMenuOpen } from "react-icons/md";
import { UserAttendance } from "../../components/user/UserAttendance";
import { studentAndAttendanceAndAbsenteeCallingCount, attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
//import logoutLogo from '../../assets/logout.png'; // Replace with correct path
import { Link } from "react-router-dom";
import { NewNavbar } from "../../components/Navbar/NewNavbar";
import {Row, Col} from 'react-bootstrap'

// Utility for CSV export
const exportToCsv = (rows, selectedDate, classFilter) => {
  const csvContent = [
    ['S. No.', 'District', 'School', 'Class', 'Total', 'Present', 'Absent', 'Date'],
    ...rows.map(r => [
      r.serial,
      r.district,
      r.school,
      r.class,
      r.total,
      r.present,
      r.absent,
      selectedDate
    ])
  ]
  .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
  .join("\n");

  const filename = `attendance_${selectedDate}_${classFilter}.csv`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const StudentAttendanceDashBoard = () => {

  //Context hooks
  const { userData, setUserData } = useContext(UserContext);

  //All hooks
  const [studentCount, setStudentCount] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showOnlyAbsent, setShowOnlyAbsent] = useState(false);

  const fetchStudentRelatedCounts = async () => {
    const payload = {
      schoolIds: userData[0].schoolIds,
      classFilters: userData[0].classId || ['9', '10'],
      date: selectedDate + "T00:00:00.000+00:00", // same format
    };

    try {
      const response = await studentAndAttendanceAndAbsenteeCallingCount(payload);
      console.log(response.data);

      // Sorting logic: present === 0 should come first
      const sortedData = response.data.map((school) => {
        const sortedClasses = [...school.classes].sort((a, b) => {
          if (a.present === 0 && b.present !== 0) return -1;
          if (a.present !== 0 && b.present === 0) return 1;
          return 0;
        });
        return { ...school, classes: sortedClasses };
      });

      // Sort schools by districtName
      sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));

      setStudentCount(sortedData);
    } catch (error) {
      console.log("Error fetching student count");
    }
  };

  useEffect(() => {
    fetchStudentRelatedCounts();
  }, [selectedDate]);

  // Summary by class
  const classSummary = {
    '9': { totalStudents: 0, present: 0, absent: 0 },
    '10': { totalStudents: 0, present: 0, absent: 0 }
  };

  studentCount.forEach((school) => {
    school.classes.forEach((cls) => {
      const key = cls.classofStudent;
      if (classSummary[key]) {
        classSummary[key].totalStudents += cls.totalStudents;
        classSummary[key].present += cls.present;
        classSummary[key].absent += cls.absent;
      }
    });
  });

  // Flattened filtered data for export
  const flattenedRows = [];
  studentCount.forEach((school, schoolIndex) =>
    school.classes.forEach((cls, classIndex) => {
      if (!showOnlyAbsent || cls.present === 0) {
        const serial = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
        flattenedRows.push({
          serial,
          district: school.districtName,
          school: school.schoolName,
          class: cls.classofStudent,
          total: cls.totalStudents,
          present: cls.present,
          absent: cls.absent
        });
      }
    })
  );

  return (
  <Container className="mt-4">
    {/* Filters */}
    <Card className="mb-3 shadow-sm p-3">
      <Form>
        <Form.Group as={Row} className="align-items-center">
          <Form.Label column sm={2}><strong>Select Date</strong></Form.Label>
          <Col sm={4}>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Col>
          <Col sm={2}>
            <Form.Check
              type="checkbox"
              label="Show only Present = 0"
              checked={showOnlyAbsent}
              onChange={(e) => setShowOnlyAbsent(e.target.checked)}
            />
          </Col>
          <Col sm={2}>
            <Form.Check
              inline
              type="radio"
              name="classFilter"
              label="All"
              checked={!userData[0].filterClass || userData[0].filterClass === "all"}
              onChange={() => setUserData([{ ...userData[0], filterClass: "all" }])}
            />
            <Form.Check
              inline
              type="radio"
              name="classFilter"
              label="Class 9"
              checked={userData[0].filterClass === "9"}
              onChange={() => setUserData([{ ...userData[0], filterClass: "9" }])}
            />
            <Form.Check
              inline
              type="radio"
              name="classFilter"
              label="Class 10"
              checked={userData[0].filterClass === "10"}
              onChange={() => setUserData([{ ...userData[0], filterClass: "10" }])}
            />
          </Col>
          <Col sm={2}>
            <Button variant="success" onClick={() => exportToCsv(flattenedRows, selectedDate, userData[0].filterClass || "all")}>
              Export to CSV
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Card>

    {/* Summary Card */}
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>Overall Summary</Card.Title>
        <div>
          <div>
            <strong>Class 9 -</strong> Total: {classSummary['9'].totalStudents}, Present: {classSummary['9'].present}, Absent: {classSummary['9'].absent}
          </div>
          <div>
            <strong>Class 10 -</strong> Total: {classSummary['10'].totalStudents}, Present: {classSummary['10'].present}, Absent: {classSummary['10'].absent}
          </div>
        </div>
      </Card.Body>
    </Card>

    {/* Class 9 Table */}
    {(userData[0].filterClass === "9" || userData[0].filterClass === "all") && (
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>Class 9 Attendance</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>S. No.</th>
                <th>District</th>
                <th>School</th>
                <th>Class</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {studentCount.map((school, schoolIndex) =>
                school.classes
                  .filter((cls) => cls.classofStudent === '9')
                  .map((cls, classIndex) => {
                    const allAbsent = cls.present === 0 && cls.totalStudents > 0;
                    const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
                    if (showOnlyAbsent && cls.present !== 0) return null;
                    return (
                      <tr
                        key={`${school.schoolId}-9-${classIndex}`}
                        style={{ backgroundColor: allAbsent ? '#ffcccc' : 'transparent' }}
                      >
                        <td>{serialNo}</td>
                        {classIndex === 0 && (
                          <>
                            <td rowSpan={school.classes.filter(c => c.classofStudent === '9').length} className="align-middle">
                              {school.districtName}
                            </td>
                            <td rowSpan={school.classes.filter(c => c.classofStudent === '9').length} className="align-middle">
                              {school.schoolName}
                            </td>
                          </>
                        )}
                        <td>{cls.classofStudent}</td>
                        <td>{cls.totalStudents}</td>
                        <td style={{ backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit', fontWeight: cls.present === 0 ? 'bold' : 'normal' }}>{cls.present}</td>
                        <td>{cls.absent}</td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )}

    {/* Class 10 Table */}
    {(userData[0].filterClass === "10" || userData[0].filterClass === "all") && (
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Class 10 Attendance</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>S. No.</th>
                <th>District</th>
                <th>School</th>
                <th>Class</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {studentCount.map((school, schoolIndex) =>
                school.classes
                  .filter((cls) => cls.classofStudent === '10')
                  .map((cls, classIndex) => {
                    const allAbsent = cls.present === 0 && cls.totalStudents > 0;
                    const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
                    if (showOnlyAbsent && cls.present !== 0) return null;
                    return (
                      <tr
                        key={`${school.schoolId}-10-${classIndex}`}
                        style={{ backgroundColor: allAbsent ? '#ffcccc' : 'transparent' }}
                      >
                        <td>{serialNo}</td>
                        {classIndex === 0 && (
                          <>
                            <td rowSpan={school.classes.filter(c => c.classofStudent === '10').length} className="align-middle">
                              {school.districtName}
                            </td>
                            <td rowSpan={school.classes.filter(c => c.classofStudent === '10').length} className="align-middle">
                              {school.schoolName}
                            </td>
                          </>
                        )}
                        <td>{cls.classofStudent}</td>
                        <td>{cls.totalStudents}</td>
                        <td style={{ backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit', fontWeight: cls.present === 0 ? 'bold' : 'normal' }}>{cls.present}</td>
                        <td>{cls.absent}</td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )}
  </Container>
);
};
