// // // /FRONTEND/src/components/DashBoard



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
// import { studentAndAttendanceAndAbsenteeCallingCount, 
//   attendancePdfUploadStatusCountByClass,
// PresentAbsentCallingDashboard } from "../../service/dashboardServices/dashboardCounts.services";

// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";




// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";
// import {Row, Col} from 'react-bootstrap'

// const exportToCsv = (rows, classFilter) => {
//   const csvContent = [
//     ['S. No.', 'District', 'School', 'Class', 'Total', 'Present', 'Absent', 'Date'],
//     ...rows.map(r => [
//       r.serial,
//       r.district,
//       r.school,
//       r.class,
//       r.total,
//       r.present,
//       r.absent,
//       r.date
//     ])
//   ]
//   .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
//   .join("\n");

//   const filename = `attendance_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
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



//   const [startDate, setStartDate] = useState(() => {
//       return new Date().toISOString().split("T")[0];
//     });
//     const [endDate, setEndDate] = useState(() => {
//       return new Date().toISOString().split("T")[0];
//     });


    


// //--------------------------------------------------------------------------

// const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

// const allDistrictIds = regions.flatMap(region => 
//   region.districtId
// )

// console.log(allDistrictIds)

// //------------------------------------------------------------------------




//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: allSchoolIds,
//       //classFilters: userData.userAccess.classId || ['9', '10'],
//      // date: selectedDate + "T00:00:00.000+00:00", // same format
//        startDate: startDate,
//       endDate: endDate
      
//     };

//     try {
//       const response = await PresentAbsentCallingDashboard(payload);

//       console.log(payload)
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
//   }, [selectedDate, startDate, endDate]);

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
//   serial,
//   district: school.districtName,
//   school: school.schoolName,
//   class: cls.classofStudent,
//   total: cls.totalStudents,
//   present: cls.present,
//   absent: cls.absent,
//   date: school.date?.split("T")[0] || ""
// });
//       }
//     })
//   );

//   return (
//   <Container className="mt-4">
//     {/* Filters */}
//     <Card className="mb-3 shadow-sm p-3">
//       <Form>
//         <Form.Group as={Row} className="align-items-center">
//           <Col md={4}>
//                     <Form.Group>
//                       <Form.Label>📅 Start Date</Form.Label>
//                       <Form.Control
//                         type="date"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label>📅 End Date</Form.Label>
//                       <Form.Control
//                         type="date"
//                         value={endDate}
//                         onChange={(e) => setEndDate(e.target.value)}
//                       />
//                     </Form.Group>
//                   </Col>
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
//               checked={!userData.filterClass || userData.filterClass === "all"}
//               onChange={() => setUserData([{ ...userData[0], filterClass: "all" }])}
//             />
//             <Form.Check
//               inline
//               type="radio"
//               name="classFilter"
//               label="Class 9"
//               checked={userData.filterClass === "9"}
//               onChange={() => setUserData([{ ...userData[0], filterClass: "9" }])}
//             />
//             <Form.Check
//               inline
//               type="radio"
//               name="classFilter"
//               label="Class 10"
//               checked={userData.filterClass === "10"}
//               onChange={() => setUserData([{ ...userData[0], filterClass: "10" }])}
//             />
//           </Col>
//           <Col sm={2}>
//             <Button variant="success" onClick={() => exportToCsv(flattenedRows, selectedDate, userData[0].filterClass || "all")}>
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
//     {(userData.filterClass === "9" || userData.filterClass === "all") && (
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
//                 <th>Date</th>
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
//                         <td>{school.date?.split("T")[0]}</td>
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
//     {(userData.filterClass === "10" || userData.filterClass === "all") && (
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
//                 <th>Date</th>
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
//                         <td>{school.date?.split("T")[0]}</td>
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
//     ["S. No.", "District", "School", "Class", "Total", "Present", "Absent"],
//     ...rows.map((r) => [
//       r.serial,
//       r.district,
//       r.school,
//       r.class,
//       r.total,
//       r.present,
//       r.absent,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `attendance_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
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
//   const { userData, setUserData } = useContext(UserContext);

//   const [studentCount, setStudentCount] = useState([]);
//   const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showOnlyAbsent, setShowOnlyAbsent] = useState(false);

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

//       console.log(response.data)
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classofStudent].sort((a, b) => {
//           if (a.totalPresent === 0 && b.totalPresent !== 0) return -1;
//           if (a.totalPresent !== 0 && b.totalPresent === 0) return 1;
//           return 0;
//         });
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

//   const classSummary = { "9": { totalStudents: 0, present: 0, absent: 0 }, "10": { totalStudents: 0, present: 0, absent: 0 } };
//   studentCount.forEach((school) => {
//     school.classofStudent.forEach((cls) => {
//       if (classSummary[cls.class]) {
//         classSummary[cls.class].totalStudents += cls.totalStudents;
//         classSummary[cls.class].present += cls.totalPresent;
//         classSummary[cls.class].absent += cls.totalAbsent;
//       }
//     });
//   });

//   const flattenedRows = [];
//   studentCount.forEach((school, schoolIndex) =>
//     school.classofStudent.forEach((cls, classIndex) => {
//       if (!showOnlyAbsent || cls.totalPresent === 0) {
//         const serial = school.classofStudent.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//         flattenedRows.push({
//           serial,
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.class,
//           total: cls.totalStudents,
//           present: cls.totalPresent,
//           absent: cls.totalAbsent,
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
//               <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//             </Col>
//             <Col md={3}>
//               <Form.Label>📅 End Date</Form.Label>
//               <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//             </Col>
//             <Col md={2}>
//               <Form.Check
//                 type="checkbox"
//                 label="Show only Absent = 0"
//                 checked={showOnlyAbsent}
//                 onChange={(e) => setShowOnlyAbsent(e.target.checked)}
//               />
//             </Col>
//             <Col md={2}>
//               <Button variant="success" onClick={() => exportToCsv(flattenedRows, userData.filterClass || "all")}>
//                 Export CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Summary Card */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall Summary</Card.Title>
//           <div>
//             <strong>Class 9 -</strong> Total: {classSummary["9"].totalStudents}, Present: {classSummary["9"].present}, Absent: {classSummary["9"].absent}
//           </div>
//           <div>
//             <strong>Class 10 -</strong> Total: {classSummary["10"].totalStudents}, Present: {classSummary["10"].present}, Absent: {classSummary["10"].absent}
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Tables */}
//       {["9", "10"].map((clsNum) =>
//         (userData.filterClass === clsNum || userData.filterClass === "all") && (
//           <Card className="shadow-sm mb-4" key={clsNum}>
//             <Card.Body>
//               <Card.Title>Class {clsNum} Attendance</Card.Title>
//               <Table responsive bordered hover>
//                 <thead className="table-dark text-center">
//                   <tr>
//                     <th>S. No.</th>
//                     <th>District</th>
//                     <th>School</th>
//                     <th>Class</th>
//                     <th>Total</th>
//                     <th>Present</th>
//                     <th>Absent</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-center">
//                   {studentCount.map((school, schoolIndex) =>
//                     school.classofStudent
//                       .filter((cls) => cls.class === clsNum)
//                       .map((cls, classIndex) => {
//                         if (showOnlyAbsent && cls.totalPresent !== 0) return null;
//                         const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                         const allAbsent = cls.totalPresent === 0 && cls.totalStudents > 0;
//                         return (
//                           <tr key={`${school.schoolId}-${clsNum}-${classIndex}`} style={{ backgroundColor: allAbsent ? "#ffcccc" : "transparent" }}>
//                             <td>{serialNo}</td>
//                             {classIndex === 0 && (
//                               <>
//                                 <td rowSpan={school.classofStudent.filter((c) => c.class === clsNum).length} className="align-middle">
//                                   {school.districtName}
//                                 </td>
//                                 <td rowSpan={school.classofStudent.filter((c) => c.class === clsNum).length} className="align-middle">
//                                   {school.schoolName}
//                                 </td>
//                               </>
//                             )}
//                             <td>{cls.class}</td>
//                             <td>{cls.totalStudents}</td>
//                             <td style={{ backgroundColor: cls.totalPresent === 0 ? "#ff9999" : "inherit", fontWeight: cls.totalPresent === 0 ? "bold" : "normal" }}>
//                               {cls.totalPresent}
//                             </td>
//                             <td>{cls.totalAbsent}</td>
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
//     ["S. No.", "Date", "District", "School", "Class", "Total", "Present", "Absent"],
//     ...rows.map((r) => [
//       r.serial,
//       r.date,
//       r.district,
//       r.school,
//       r.class,
//       r.total,
//       r.present,
//       r.absent,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `attendance_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
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
//   const { userData } = useContext(UserContext);

//   const [studentCount, setStudentCount] = useState([]);
//   const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showOnlyAbsent, setShowOnlyAbsent] = useState(false);

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

//       console.log(response.data)
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classofStudent].sort((a, b) => {
//           if (a.totalPresent === 0 && b.totalPresent !== 0) return -1;
//           if (a.totalPresent !== 0 && b.totalPresent === 0) return 1;
//           return 0;
//         });
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

//   const classSummary = { "9": { totalStudents: 0, present: 0, absent: 0 }, "10": { totalStudents: 0, present: 0, absent: 0 } };
//   studentCount.forEach((school) => {
//     school.classofStudent.forEach((cls) => {
//       if (classSummary[cls.class]) {
//         classSummary[cls.class].totalStudents += cls.totalStudents;
//         classSummary[cls.class].present += cls.totalPresent;
//         classSummary[cls.class].absent += cls.totalAbsent;
//       }
//     });
//   });

//   const flattenedRows = [];
//   studentCount.forEach((school, schoolIndex) =>
//     school.classofStudent.forEach((cls, classIndex) => {
//       if (!showOnlyAbsent || cls.totalPresent === 0) {
//         const serial = school.classofStudent.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//         flattenedRows.push({
//           serial,
//           date: new Date(cls.date).toLocaleDateString(),
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.class,
//           total: cls.totalStudents,
//           present: cls.totalPresent,
//           absent: cls.totalAbsent,
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
//               <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//             </Col>
//             <Col md={3}>
//               <Form.Label>📅 End Date</Form.Label>
//               <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//             </Col>
//             <Col md={2}>
//               <Form.Check
//                 type="checkbox"
//                 label="Show only Absent = 0"
//                 checked={showOnlyAbsent}
//                 onChange={(e) => setShowOnlyAbsent(e.target.checked)}
//               />
//             </Col>
//             <Col md={2}>
//               <Button variant="success" onClick={() => exportToCsv(flattenedRows, userData.filterClass || "all")}>
//                 Export CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Summary Card */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall Summary</Card.Title>
//           <div>
//             <strong>Class 9 -</strong> Total: {classSummary["9"].totalStudents}, Present: {classSummary["9"].present}, Absent: {classSummary["9"].absent}
//           </div>
//           <div>
//             <strong>Class 10 -</strong> Total: {classSummary["10"].totalStudents}, Present: {classSummary["10"].present}, Absent: {classSummary["10"].absent}
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Tables */}
//       {["9", "10"].map((clsNum) =>
//         (userData.filterClass === clsNum || userData.filterClass === "all") && (
//           <Card className="shadow-sm mb-4" key={clsNum}>
//             <Card.Body>
//               <Card.Title>Class {clsNum} Attendance</Card.Title>
//               <Table responsive bordered hover>
//                 <thead className="table-dark text-center">
//                   <tr>
//                     <th>S. No.</th>
//                     <th>Date</th>
//                     <th>District</th>
//                     <th>School</th>
//                     <th>Class</th>
//                     <th>Total</th>
//                     <th>Present</th>
//                     <th>Absent</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-center">
//                   {studentCount.map((school, schoolIndex) =>
//                     school.classofStudent
//                       .filter((cls) => cls.class === clsNum)
//                       .map((cls, classIndex) => {
//                         if (showOnlyAbsent && cls.totalPresent !== 0) return null;
//                         const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                         const allAbsent = cls.totalPresent === 0 && cls.totalStudents > 0;
//                         return (
//                           <tr key={`${school.schoolId}-${clsNum}-${classIndex}`} style={{ backgroundColor: allAbsent ? "#ffcccc" : "transparent" }}>
//                             <td>{serialNo}</td>
//                             {classIndex === 0 && (
//                               <>
//                                 <td rowSpan={school.classofStudent.filter((c) => c.class === clsNum).length} className="align-middle">
//                                   {new Date(cls.date).toLocaleDateString()}
//                                 </td>
//                                 <td rowSpan={school.classofStudent.filter((c) => c.class === clsNum).length} className="align-middle">
//                                   {school.districtName}
//                                 </td>
//                                 <td rowSpan={school.classofStudent.filter((c) => c.class === clsNum).length} className="align-middle">
//                                   {school.schoolName}
//                                 </td>
//                               </>
//                             )}
//                             <td>{cls.class}</td>
//                             <td>{cls.totalStudents}</td>
//                             <td style={{ backgroundColor: cls.totalPresent === 0 ? "#ff9999" : "inherit", fontWeight: cls.totalPresent === 0 ? "bold" : "normal" }}>
//                               {cls.totalPresent}
//                             </td>
//                             <td>{cls.totalAbsent}</td>
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
    ["S. No.", "Date", "District", "School", "Class", "Total", "Present", "Absent"],
    ...rows.map((r) => [
      r.serial,
      r.date,
      r.district,
      r.school,
      r.class,
      r.total,
      r.present,
      r.absent,
    ]),
  ]
    .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const filename = `attendance_${new Date().toISOString().split("T")[0]}_${classFilter}.csv`;
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
  const { userData } = useContext(UserContext);

  const [studentCount, setStudentCount] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [showOnlyAbsent, setShowOnlyAbsent] = useState(false);
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

      console.log(response.data)
      const sortedData = response.data.map((school) => {
        const sortedClasses = [...school.classofStudent]
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // ✅ sort by date
          .sort((a, b) => {
            if (a.totalPresent === 0 && b.totalPresent !== 0) return -1;
            if (a.totalPresent !== 0 && b.totalPresent === 0) return 1;
            return 0;
          });
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

  const classSummary = { "9": { totalStudents: 0, present: 0, absent: 0 }, "10": { totalStudents: 0, present: 0, absent: 0 } };
  studentCount.forEach((school) => {
    school.classofStudent.forEach((cls) => {
      if (classSummary[cls.class]) {
        classSummary[cls.class].totalStudents += cls.totalStudents;
        classSummary[cls.class].present += cls.totalPresent;
        classSummary[cls.class].absent += cls.totalAbsent;
      }
    });
  });

  const flattenedRows = [];
  studentCount.forEach((school, schoolIndex) =>
    school.classofStudent.forEach((cls, classIndex) => {
      if ((!showOnlyAbsent || cls.totalPresent === 0) &&
          (!showOnlyClass9 || cls.class === "9") &&
          (!showOnlyClass10 || cls.class === "10")) {
        const serial = school.classofStudent.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
        flattenedRows.push({
          serial,
          date: new Date(cls.date).toLocaleDateString(),
          district: school.districtName,
          school: school.schoolName,
          class: cls.class,
          total: cls.totalStudents,
          present: cls.totalPresent,
          absent: cls.totalAbsent,
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
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Col>
            <Col md={3}>
              <Form.Label>📅 End Date</Form.Label>
              <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Check
                type="checkbox"
                label="Absent"
                checked={showOnlyAbsent}
                onChange={(e) => setShowOnlyAbsent(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="9"
                checked={showOnlyClass9}
                onChange={(e) => {
                  setShowOnlyClass9(e.target.checked);
                  if (e.target.checked) setShowOnlyClass10(false);
                }}
              />
              <Form.Check
                type="checkbox"
                label="10"
                checked={showOnlyClass10}
                onChange={(e) => {
                  setShowOnlyClass10(e.target.checked);
                  if (e.target.checked) setShowOnlyClass9(false);
                }}
              />
            </Col>
            <Col md={2}>
              <Button variant="success" onClick={() => exportToCsv(flattenedRows, userData.filterClass || "all")}>
                Export CSV
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
            <strong>Class 9 -</strong> Total: {classSummary["9"].totalStudents}, Present: {classSummary["9"].present}, Absent: {classSummary["9"].absent}
          </div>
          <div>
            <strong>Class 10 -</strong> Total: {classSummary["10"].totalStudents}, Present: {classSummary["10"].present}, Absent: {classSummary["10"].absent}
          </div>
        </Card.Body>
      </Card>

      {/* Tables */}
      {["9", "10"].map((clsNum) =>
  (userData?.userAccess?.classId?.includes(clsNum)) && (
    <Card className="shadow-sm mb-4" key={clsNum}>
      <Card.Body>
        <Card.Title>Class {clsNum} Attendance</Card.Title>
        <Table responsive bordered hover>
          <thead className="table-dark text-center">
            <tr>
              <th>S. No.</th>
              <th>Date</th>
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
              school.classofStudent
                .filter((cls) => cls.class === clsNum)
                .filter((cls) =>
                  (!showOnlyAbsent || cls.totalPresent === 0) &&
                  (!showOnlyClass9 || cls.class === "9") &&
                  (!showOnlyClass10 || cls.class === "10")
                )
                .map((cls, classIndex) => {
                  const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
                  const allAbsent = cls.totalPresent === 0 && cls.totalStudents > 0;
                  return (
                    <tr
                      key={`${school.schoolId}-${clsNum}-${classIndex}`}
                      style={{ backgroundColor: allAbsent ? "#ffcccc" : "transparent" }}
                    >
                      <td>{serialNo}</td>
                      {classIndex === 0 && (
                        <>
                          <td
                            rowSpan={
                              school.classofStudent.filter((c) => c.class === clsNum).length
                            }
                            className="align-middle"
                          >
                            {new Date(cls.date).toLocaleDateString()}
                          </td>
                          <td
                            rowSpan={
                              school.classofStudent.filter((c) => c.class === clsNum).length
                            }
                            className="align-middle"
                          >
                            {school.districtName}
                          </td>
                          <td
                            rowSpan={
                              school.classofStudent.filter((c) => c.class === clsNum).length
                            }
                            className="align-middle"
                          >
                            {school.schoolName}
                          </td>
                        </>
                      )}
                      <td>{cls.class}</td>
                      <td>{cls.totalStudents}</td>
                      <td
                        style={{
                          backgroundColor: cls.totalPresent === 0 ? "#ff9999" : "inherit",
                          fontWeight: cls.totalPresent === 0 ? "bold" : "normal",
                        }}
                      >
                        {cls.totalPresent}
                      </td>
                      <td>{cls.totalAbsent}</td>
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
