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
// import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";


// export const StudentCallingDashBoard = () => {

//   //Context hooks
//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [studentCount, setStudentCount] = useState([]);

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

//       // Sort by districtName
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
//     '9': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 },
//     '10': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 }
//   };

//   studentCount.forEach((school) => {
//     school.classes.forEach((cls) => {
//       const key = cls.classofStudent;
//       if (classSummary[key]) {
//         classSummary[key].totalStudents += cls.totalStudents;
//         classSummary[key].present += cls.present;
//         classSummary[key].absent += cls.absent;
//         classSummary[key].connectedCount += cls.connectedCount || 0;
//         classSummary[key].notConnectedCount += cls.notConnectedCount || 0;
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
//               <strong>Class 9 -</strong> Total: {classSummary['9'].totalStudents}, Connected: {classSummary['9'].connectedCount}, NotConnected: {classSummary['9'].notConnectedCount}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total: {classSummary['10'].totalStudents}, Connected: {classSummary['10'].connectedCount}, Absent: {classSummary['10'].notConnectedCount}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Attendance Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Calling Dashboard</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                   <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 {/* <th>Total</th> */}
//                 <th>Connected</th>
//                 <th>NotConnected</th>
//                 <th>Not Called</th>
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
//                           {school.schoolName}
//                         </td>
                        
//                         </>
                        
                        
//                       )}
//                       <td>{cls.classofStudent}</td>
//                       {/* <td>{cls.totalStudents}</td> */}
//                       <td
//                         style={{
//                           backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit',
//                           fontWeight: cls.present === 0 ? 'bold' : 'normal',
//                         }}
//                       >
//                         {cls.connectedCount}
//                       </td>
//                       <td>{cls.notConnectedCount}</td>
//                       <td>{cls.notCalledCount}</td>
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
// } from "react-bootstrap";
// import { href, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { MdMenuOpen } from "react-icons/md";
// import { UserAttendance } from "../../components/user/UserAttendance";
// import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";

// export const StudentCallingDashBoard = () => {

//   //Context hooks
//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [studentCount, setStudentCount] = useState([]);

//    const [startDate, setStartDate] = useState(() => {
//         return new Date().toISOString().split("T")[0];
//       });
//       const [endDate, setEndDate] = useState(() => {
//         return new Date().toISOString().split("T")[0];
//       });






//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: userData[0].schoolIds,
//       classFilters: userData[0].classId || ['9', '10'],
      
//       // date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format

//          startDate: startDate,
//       endDate: endDate
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

//       // Sort by districtName
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
//     '9': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 },
//     '10': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 }
//   };

//   studentCount.forEach((school) => {
//     school.classes.forEach((cls) => {
//       const key = cls.classofStudent;
//       if (classSummary[key]) {
//         classSummary[key].totalStudents += cls.totalStudents;
//         classSummary[key].present += cls.present;
//         classSummary[key].absent += cls.absent;
//         classSummary[key].connectedCount += cls.connectedCount || 0;
//         classSummary[key].notConnectedCount += cls.notConnectedCount || 0;
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
//               <strong>Class 9 -</strong> Total: {classSummary['9'].absent}, Connected: {classSummary['9'].connectedCount}, NotConnected: {classSummary['9'].notConnectedCount}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total: {classSummary['10'].absent}, Connected: {classSummary['10'].connectedCount}, Absent: {classSummary['10'].notConnectedCount}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Attendance Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Calling Dashboard</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>Absent</th>
//                 <th>Connected</th>
//                 <th>NotConnected</th>
//                 <th>Not Called</th>
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
//                       <td>{cls.absent}</td>
//                       <td
//                         style={{
//                           backgroundColor: cls.connectedCount === 0 ? '#ff9999' : '#ccffcc',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         {cls.connectedCount}
//                       </td>
//                       <td
//                         style={{
//                           backgroundColor: cls.notConnectedCount === 0 ? '#ff9999' : '#ccffcc',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         {cls.notConnectedCount}
//                       </td>
//                       <td>{cls.notCalledCount}</td>
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









// import React, { useEffect, useState, useContext } from "react";
// import {
//   Container,
//   Card,
//   Table,
//   Form,
//   Row,
//   Col,
//   Button,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { PresentAbsentCallingDashboard } from "../../service/dashboardServices/dashboardCounts.services";

// const exportToCsv = (rows, classFilter) => {
//   const csvContent = [
//     [
//       "S. No.",
//       "Date",
//       "District",
//       "School",
//       "Class",
//       "Total Absent",
//       "Calling Connected",
//       "Calling Not Connected",
//       "Calling Not Called",
//     ],
//     ...rows.map((r) => [
//       r.serial,
//       r.date,
//       r.district,
//       r.school,
//       r.class,
//       r.totalAbsent,
//       r.callingConnected,
//       r.callingNotConnected,
//       r.callingNotCalled,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `calling_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const StudentCallingDashBoard = () => {
//   const { userData } = useContext(UserContext);

//   const [studentCount, setStudentCount] = useState([]);
//   const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showOnlyClass9, setShowOnlyClass9] = useState(false);
//   const [showOnlyClass10, setShowOnlyClass10] = useState(false);

//   const regions = userData?.userAccess?.region || [];
//   const allSchoolIds = regions.flatMap((region) =>
//     region.blockIds.flatMap((block) => block.schoolIds.map((s) => s.schoolId))
//   );

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: allSchoolIds,
//       startDate,
//       endDate,
//     };
//     try {
//       const response = await PresentAbsentCallingDashboard(payload);

//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classofStudent].sort(
//           (a, b) => new Date(a.date) - new Date(b.date)
//         );
//         return { ...school, classofStudent: sortedClasses };
//       });
//       sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));
//       setStudentCount(sortedData);
//     } catch (err) {
//       console.error("Error fetching student count:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, [startDate, endDate]);

//   // 🔹 Totals
//   const classSummary = {
//     "9": { absent: 0, connected: 0, notConnected: 0, notCalled: 0 },
//     "10": { absent: 0, connected: 0, notConnected: 0, notCalled: 0 },
//   };

//   studentCount.forEach((school) => {
//     school.classofStudent.forEach((cls) => {
//       if (classSummary[cls.class]) {
//         classSummary[cls.class].absent += cls.totalAbsent;
//         classSummary[cls.class].connected += cls.callingConnected;
//         classSummary[cls.class].notConnected += cls.callingNotConnected;
//         classSummary[cls.class].notCalled += cls.callingNotCalled;
//       }
//     });
//   });

//   // 🔹 Flatten for CSV
//   const flattenedRows = [];
//   studentCount.forEach((school, schoolIndex) =>
//     school.classofStudent.forEach((cls, classIndex) => {
//       if (
//         (!showOnlyClass9 || cls.class === "9") &&
//         (!showOnlyClass10 || cls.class === "10")
//       ) {
//         const serial =
//           school.classofStudent.length > 1
//             ? `${schoolIndex + 1}.${classIndex + 1}`
//             : `${schoolIndex + 1}`;
//         flattenedRows.push({
//           serial,
//           date: new Date(cls.date).toLocaleDateString(),
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.class,
//           totalAbsent: cls.totalAbsent,
//           callingConnected: cls.callingConnected,
//           callingNotConnected: cls.callingNotConnected,
//           callingNotCalled: cls.callingNotCalled,
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
//             <Col md={3}>
//               <Form.Label>📅 Start Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Label>📅 End Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Check
//                 type="checkbox"
//                 label="Class 9"
//                 checked={showOnlyClass9}
//                 onChange={(e) => {
//                   setShowOnlyClass9(e.target.checked);
//                   if (e.target.checked) setShowOnlyClass10(false);
//                 }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Class 10"
//                 checked={showOnlyClass10}
//                 onChange={(e) => {
//                   setShowOnlyClass10(e.target.checked);
//                   if (e.target.checked) setShowOnlyClass9(false);
//                 }}
//               />
//             </Col>
//             <Col md={2}>
//               <Button
//                 variant="success"
//                 onClick={() =>
//                   exportToCsv(flattenedRows, userData.filterClass || "all")
//                 }
//               >
//                 Export CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Summary */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>📞 Calling Summary</Card.Title>
//           <div>
//             <strong>Class 9 -</strong> Absent: {classSummary["9"].absent}, Connected:{" "}
//             {classSummary["9"].connected}, Not Connected:{" "}
//             {classSummary["9"].notConnected}, Not Called:{" "}
//             {classSummary["9"].notCalled}
//           </div>
//           <div>
//             <strong>Class 10 -</strong> Absent: {classSummary["10"].absent}, Connected:{" "}
//             {classSummary["10"].connected}, Not Connected:{" "}
//             {classSummary["10"].notConnected}, Not Called:{" "}
//             {classSummary["10"].notCalled}
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Table */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <Card.Title>Calling Dashboard</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>Date</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>Total Absent</th>
//                 <th>Calling Connected</th>
//                 <th>Calling Not Connected</th>
//                 <th>Calling Not Called</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {flattenedRows.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row.serial}</td>
//                   <td>{row.date}</td>
//                   <td>{row.district}</td>
//                   <td>{row.school}</td>
//                   <td>{row.class}</td>
//                   <td>{row.totalAbsent}</td>
//                   <td>{row.callingConnected}</td>
//                   <td>{row.callingNotConnected}</td>
//                   <td>{row.callingNotCalled}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };













// import React, { useEffect, useState, useContext } from "react";
// import {
//   Container,
//   Card,
//   Table,
//   Form,
//   Row,
//   Col,
//   Button,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { PresentAbsentCallingDashboard } from "../../service/dashboardServices/dashboardCounts.services";

// const exportToCsv = (rows, classFilter) => {
//   const csvContent = [
//     [
//       "S. No.",
//       "Date",
//       "District",
//       "School",
//       "Class",
//       "Total Absent",
//       "Calling Connected",
//       "Calling Not Connected",
//       "Calling Not Called",
//     ],
//     ...rows.map((r) => [
//       r.serial,
//       r.date,
//       r.district,
//       r.school,
//       r.class,
//       r.totalAbsent,
//       r.callingConnected,
//       r.callingNotConnected,
//       r.callingNotCalled,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `calling_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const StudentCallingDashBoard = () => {
//   const { userData } = useContext(UserContext);

//   const [studentCount, setStudentCount] = useState([]);
//   const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showOnlyZeroConnected, setShowOnlyZeroConnected] = useState(false);
//   const [showOnlyClass9, setShowOnlyClass9] = useState(false);
//   const [showOnlyClass10, setShowOnlyClass10] = useState(false);

//   const regions = userData?.userAccess?.region || [];
//   const allSchoolIds = regions.flatMap((region) =>
//     region.blockIds.flatMap((block) => block.schoolIds.map((s) => s.schoolId))
//   );

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: allSchoolIds,
//       startDate,
//       endDate,
//     };
//     try {
//       const response = await PresentAbsentCallingDashboard(payload);

//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classofStudent].sort(
//           (a, b) => new Date(a.date) - new Date(b.date)
//         );
//         return { ...school, classofStudent: sortedClasses };
//       });
//       sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));
//       setStudentCount(sortedData);
//     } catch (err) {
//       console.error("Error fetching student count:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, [startDate, endDate]);

//   // 🔹 Totals
//   const classSummary = {
//     "9": { absent: 0, connected: 0, notConnected: 0, notCalled: 0 },
//     "10": { absent: 0, connected: 0, notConnected: 0, notCalled: 0 },
//   };

//   studentCount.forEach((school) => {
//     school.classofStudent.forEach((cls) => {
//       if (classSummary[cls.class]) {
//         classSummary[cls.class].absent += cls.totalAbsent;
//         classSummary[cls.class].connected += cls.callingConnected;
//         classSummary[cls.class].notConnected += cls.callingNotConnected;
//         classSummary[cls.class].notCalled += cls.callingNotCalled;
//       }
//     });
//   });

//   // 🔹 Flatten for CSV
//   const flattenedRows = [];
//   studentCount.forEach((school, schoolIndex) =>
//     school.classofStudent.forEach((cls, classIndex) => {
//       if (
//         (!showOnlyZeroConnected || cls.callingConnected === 0) &&
//         (!showOnlyClass9 || cls.class === "9") &&
//         (!showOnlyClass10 || cls.class === "10")
//       ) {
//         const serial =
//           school.classofStudent.length > 1
//             ? `${schoolIndex + 1}.${classIndex + 1}`
//             : `${schoolIndex + 1}`;
//         flattenedRows.push({
//           serial,
//           date: new Date(cls.date).toLocaleDateString(),
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.class,
//           totalAbsent: cls.totalAbsent,
//           callingConnected: cls.callingConnected,
//           callingNotConnected: cls.callingNotConnected,
//           callingNotCalled: cls.callingNotCalled,
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
//             <Col md={3}>
//               <Form.Label>📅 Start Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Label>📅 End Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Check
//                 type="checkbox"
//                 label="0 Connected"
//                 checked={showOnlyZeroConnected}
//                 onChange={(e) => setShowOnlyZeroConnected(e.target.checked)}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Class 9"
//                 checked={showOnlyClass9}
//                 onChange={(e) => {
//                   setShowOnlyClass9(e.target.checked);
//                   if (e.target.checked) setShowOnlyClass10(false);
//                 }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Class 10"
//                 checked={showOnlyClass10}
//                 onChange={(e) => {
//                   setShowOnlyClass10(e.target.checked);
//                   if (e.target.checked) setShowOnlyClass9(false);
//                 }}
//               />
//             </Col>
//             <Col md={2}>
//               <Button
//                 variant="success"
//                 onClick={() =>
//                   exportToCsv(flattenedRows, userData.filterClass || "all")
//                 }
//               >
//                 Export CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Summary */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>📞 Calling Summary</Card.Title>
//           <div>
//             <strong>Class 9 -</strong> Absent: {classSummary["9"].absent}, Connected:{" "}
//             {classSummary["9"].connected}, Not Connected:{" "}
//             {classSummary["9"].notConnected}, Not Called:{" "}
//             {classSummary["9"].notCalled}
//           </div>
//           <div>
//             <strong>Class 10 -</strong> Absent: {classSummary["10"].absent}, Connected:{" "}
//             {classSummary["10"].connected}, Not Connected:{" "}
//             {classSummary["10"].notConnected}, Not Called:{" "}
//             {classSummary["10"].notCalled}
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Tables for Class 9 and 10 */}
//       {["9", "10"].map((clsNum) =>
//         (userData.filterClass === clsNum || userData.filterClass === "all") && (
//           <Card className="shadow-sm mb-4" key={clsNum}>
//             <Card.Body>
//               <Card.Title>Class {clsNum} Calling Dashboard</Card.Title>
//               <Table responsive bordered hover>
//                 <thead className="table-dark text-center">
//                   <tr>
//                     <th>S. No.</th>
//                     <th>Date</th>
//                     <th>District</th>
//                     <th>School</th>
//                     <th>Class</th>
//                     <th>Total Absent</th>
//                     <th>Calling Connected</th>
//                     <th>Calling Not Connected</th>
//                     <th>Calling Not Called</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-center">
//                   {studentCount.map((school, schoolIndex) =>
//                     school.classofStudent
//                       .filter((cls) => cls.class === clsNum)
//                       .filter(
//                         (cls) =>
//                           (!showOnlyZeroConnected || cls.callingConnected === 0) &&
//                           (!showOnlyClass9 || cls.class === "9") &&
//                           (!showOnlyClass10 || cls.class === "10")
//                       )
//                       .map((cls, classIndex) => {
//                         const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                         const zeroConnected = cls.callingConnected === 0;
//                         return (
//                           <tr
//                             key={`${school.schoolId}-${clsNum}-${classIndex}`}
//                             style={{
//                               backgroundColor: zeroConnected ? "#ffcccc" : "transparent",
//                             }}
//                           >
//                             <td>{serialNo}</td>
//                             <td>{new Date(cls.date).toLocaleDateString()}</td>
//                             <td>{school.districtName}</td>
//                             <td>{school.schoolName}</td>
//                             <td>{cls.class}</td>
//                             <td>{cls.totalAbsent}</td>
//                             <td>{cls.callingConnected}</td>
//                             <td>{cls.callingNotConnected}</td>
//                             <td>{cls.callingNotCalled}</td>
//                           </tr>
//                         );
//                       })
//                   )}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         )
//       )}
//     </Container>
//   );
// };











import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Card,
  Table,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import { PresentAbsentCallingDashboard } from "../../service/dashboardServices/dashboardCounts.services";

const exportToCsv = (rows, classFilter) => {
  const csvContent = [
    [
      "S. No.",
      "Date",
      "District",
      "School",
      "Class",
      "Total Absent",
      "Calling Connected",
      "Calling Not Connected",
      "Calling Not Called",
    ],
    ...rows.map((r) => [
      r.serial,
      r.date,
      r.district,
      r.school,
      r.class,
      r.totalAbsent,
      r.callingConnected,
      r.callingNotConnected,
      r.callingNotCalled,
    ]),
  ]
    .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const filename = `calling_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const StudentCallingDashBoard = () => {
  const { userData } = useContext(UserContext);

  const [studentCount, setStudentCount] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [showOnlyZeroConnected, setShowOnlyZeroConnected] = useState(false);
  const [showOnlyClass9, setShowOnlyClass9] = useState(false);
  const [showOnlyClass10, setShowOnlyClass10] = useState(false);

  const regions = userData?.userAccess?.region || [];
  const allSchoolIds = regions.flatMap((region) =>
    region.blockIds.flatMap((block) => block.schoolIds.map((s) => s.schoolId))
  );

  const fetchStudentRelatedCounts = async () => {
    const payload = {
      schoolIds: allSchoolIds,
      startDate,
      endDate,
    };
    try {
      const response = await PresentAbsentCallingDashboard(payload);

      const sortedData = response.data.map((school) => {
        const sortedClasses = [...school.classofStudent].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        return { ...school, classofStudent: sortedClasses };
      });
      sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));
      setStudentCount(sortedData);
    } catch (err) {
      console.error("Error fetching student count:", err);
    }
  };

  useEffect(() => {
    fetchStudentRelatedCounts();
  }, [startDate, endDate]);

  // 🔹 Totals
  const classSummary = {
    "9": { absent: 0, connected: 0, notConnected: 0, notCalled: 0 },
    "10": { absent: 0, connected: 0, notConnected: 0, notCalled: 0 },
  };

  studentCount.forEach((school) => {
    school.classofStudent.forEach((cls) => {
      if (classSummary[cls.class]) {
        classSummary[cls.class].absent += cls.totalAbsent;
        classSummary[cls.class].connected += cls.callingConnected;
        classSummary[cls.class].notConnected += cls.callingNotConnected;
        classSummary[cls.class].notCalled += cls.callingNotCalled;
      }
    });
  });

  // 🔹 Flatten for CSV
  const flattenedRows = [];
  studentCount.forEach((school, schoolIndex) =>
    school.classofStudent.forEach((cls, classIndex) => {
      if (
        (!showOnlyZeroConnected || cls.callingConnected === 0) &&
        (!showOnlyClass9 || cls.class === "9") &&
        (!showOnlyClass10 || cls.class === "10")
      ) {
        const serial =
          school.classofStudent.length > 1
            ? `${schoolIndex + 1}.${classIndex + 1}`
            : `${schoolIndex + 1}`;
        flattenedRows.push({
          serial,
          date: new Date(cls.date).toLocaleDateString(),
          district: school.districtName,
          school: school.schoolName,
          class: cls.class,
          totalAbsent: cls.totalAbsent,
          callingConnected: cls.callingConnected,
          callingNotConnected: cls.callingNotConnected,
          callingNotCalled: cls.callingNotCalled,
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
            <Col md={3}>
              <Form.Label>📅 Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label>📅 End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Check
                type="checkbox"
                label="0 Connected"
                checked={showOnlyZeroConnected}
                onChange={(e) => setShowOnlyZeroConnected(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Class 9"
                checked={showOnlyClass9}
                onChange={(e) => {
                  setShowOnlyClass9(e.target.checked);
                  if (e.target.checked) setShowOnlyClass10(false);
                }}
              />
              <Form.Check
                type="checkbox"
                label="Class 10"
                checked={showOnlyClass10}
                onChange={(e) => {
                  setShowOnlyClass10(e.target.checked);
                  if (e.target.checked) setShowOnlyClass9(false);
                }}
              />
            </Col>
            <Col md={2}>
              <Button
                variant="success"
                onClick={() =>
                  exportToCsv(flattenedRows, userData.filterClass || "all")
                }
              >
                Export CSV
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>

      {/* Summary */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>📞 Calling Summary</Card.Title>
          <div>
            <strong>Class 9 -</strong> Absent: {classSummary["9"].absent}, Connected:{" "}
            {classSummary["9"].connected}, Not Connected:{" "}
            {classSummary["9"].notConnected}, Not Called:{" "}
            {classSummary["9"].notCalled}
          </div>
          <div>
            <strong>Class 10 -</strong> Absent: {classSummary["10"].absent}, Connected:{" "}
            {classSummary["10"].connected}, Not Connected:{" "}
            {classSummary["10"].notConnected}, Not Called:{" "}
            {classSummary["10"].notCalled}
          </div>
        </Card.Body>
      </Card>

      {/* Tables for Class 9 and 10 */}
      {["9", "10"].map((clsNum) =>
        (userData?.userAccess?.classId?.includes(clsNum))  && (
          <Card className="shadow-sm mb-4" key={clsNum}>
            <Card.Body>
              <Card.Title>Class {clsNum} Calling Dashboard</Card.Title>
              <Table responsive bordered hover>
                <thead className="table-dark text-center">
                  <tr>
                    <th>S. No.</th>
                    <th>Date</th>
                    <th>District</th>
                    <th>School</th>
                    <th>Class</th>
                    <th>Total Absent</th>
                    <th>Calling Connected</th>
                    <th>Calling Not Connected</th>
                    <th>Calling Not Called</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {studentCount.map((school, schoolIndex) =>
                    school.classofStudent
                      .filter((cls) => cls.class === clsNum)
                      .filter(
                        (cls) =>
                          (!showOnlyZeroConnected || cls.callingConnected === 0) &&
                          (!showOnlyClass9 || cls.class === "9") &&
                          (!showOnlyClass10 || cls.class === "10")
                      )
                      .map((cls, classIndex) => {
                        const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
                        const highlight =
                          cls.callingConnected === 0 || cls.callingNotConnected === 0;
                        return (
                          <tr key={`${school.schoolId}-${clsNum}-${classIndex}`}>
  <td>{serialNo}</td>
  <td>{new Date(cls.date).toLocaleDateString()}</td>
  <td>{school.districtName}</td>
  <td>{school.schoolName}</td>
  <td>{cls.class}</td>
  <td>{cls.totalAbsent}</td>
  <td
    style={{
      backgroundColor: cls.callingConnected === 0 ? "#ffcccc" : "transparent",
      fontWeight: cls.callingConnected === 0 ? "bold" : "normal",
    }}
  >
    {cls.callingConnected}
  </td>
  <td
    style={{
      backgroundColor: cls.callingNotConnected === 0 ? "#ffcccc" : "transparent",
      fontWeight: cls.callingNotConnected === 0 ? "bold" : "normal",
    }}
  >
    {cls.callingNotConnected}
  </td>
  <td
    style={{
      backgroundColor: cls.callingNotCalled === 0 ? "#ffcccc" : "transparent",
      fontWeight: cls.callingNotCalled === 0 ? "bold" : "normal",
    }}
  >
    {cls.callingNotCalled}
  </td>
</tr>
                        );
                      })
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )
      )}
    </Container>
  );
};
