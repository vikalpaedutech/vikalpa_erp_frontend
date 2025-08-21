// //This is for marking suuper 100 attendances

// import React, { useState, useEffect, useContext } from "react";

// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Button } from 'react-bootstrap';

// import { getAllAttendance, updateAttendanceBySrnAndDate } from "../../service/AttendanceMB.services.js";

// import { DistrictBlockSchoolById, ClassOfStudent  } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";

// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../contextAPIs/DependentDropdowns.contextAPI";

// import { UserContext } from "../contextAPIs/User.context.js";

// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

// import { getS100Attendances, updateAttendanceStatus, getAttendanceSummaryByClass  } from "../../service/S100Attendance.services.js";

// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"

// import { utils, writeFile } from 'xlsx';

// import jsPDF from "jspdf";

// import "jspdf-autotable";



// export const S100Attendances = async () =>{


// return(

//     <h1>
//         hello s100attendances
//     </h1>
// )


// }





















// // src/components/attendance/S100Attendances.jsx

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Table,
//   Button,
// } from "react-bootstrap";

// import {
//   getS100Attendances,
//   updateAttendanceStatus,
//   getAttendanceSummaryByClass
// } from "../../service/S100Attendance.services.js";

// export const S100Attendances = () => {
//   const [students, setStudents] = useState([]);
//   const [date, setDate] = useState("");
//   const [classofStudent, setClassofStudent] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Fetch default (today's data)
//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   const fetchAttendance = async (filters = {}) => {
//     try {
//       setLoading(true);
//       const data = await getS100Attendances(filters);
//       setStudents(data?.data || []);
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle filter submit
//   const handleFilterSubmit = () => {
//     const filters = {};
//     if (date) filters.date = date;
//     if (classofStudent) filters.classofStudent = classofStudent;
//     fetchAttendance(filters);
//   };

//   // Clear filters → default today
//   const handleClear = () => {
//     setDate("");
//     setClassofStudent("");
//     fetchAttendance();
//   };

//   // Handle toggle
//   const handleToggle = async (student) => {
//     const newStatus = student.status === "Present" ? "Absent" : "Present";

//     try {
//       await updateAttendanceStatus(
//         {
//           studentSrn: student.studentSrn,
//           date: student.date,
//         },
//         { status: newStatus }
//       );

//       // Update UI immediately
//       setStudents((prev) =>
//         prev.map((s) =>
//           s.studentSrn === student.studentSrn && s.date === student.date
//             ? { ...s, status: newStatus }
//             : s
//         )
//       );
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <Container fluid className="p-4">
//       <Row className="mb-3">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Class</Form.Label>
//             <Form.Select
//               value={classofStudent}
//               onChange={(e) => setClassofStudent(e.target.value)}
//             >
//               <option value="">-- Select Class --</option>
//               <option value="11">11</option>
//               <option value="12">12</option>
//               <option value="13">13</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={3} className="d-flex align-items-end">
//           <Button variant="primary" onClick={handleFilterSubmit} className="me-2">
//             Apply Filter
//           </Button>
//           <Button variant="secondary" onClick={handleClear}>
//             Clear
//           </Button>
//         </Col>
//       </Row>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Table bordered hover responsive>
//           <thead>
//             <tr>
//               <th>SRN</th>
//               <th>First Name</th>
//               <th>Father Name</th>
//               <th>Class</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length > 0 ? (
//               students.map((student) => (
//                 <tr key={student._id}>
//                   <td>{student.studentSrn}</td>
//                   <td>{student.firstName}</td>
//                   <td>{student.fatherName}</td>
//                   <td>{student.classofStudent}</td>
//                   <td>
//                     <Form.Check
//                       type="switch"
//                       id={`status-${student.studentSrn}`}
//                       label={student.status}
//                       checked={student.status === "Present"}
//                       onChange={() => handleToggle(student)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default S100Attendances;





















// // src/components/attendance/S100Attendances.jsx

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Table,
//   Button,
// } from "react-bootstrap";

// import {
//   getS100Attendances,
//   updateAttendanceStatus,
//   getAttendanceSummaryByClass
// } from "../../service/S100Attendance.services.js";

// export const S100Attendances = () => {
//   const [students, setStudents] = useState([]);
//   const [date, setDate] = useState("");
//   const [classofStudent, setClassofStudent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [summary, setSummary] = useState([]); // ✅ summary state

//   // Fetch default (today's data)
//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   const fetchAttendance = async (filters = {}) => {
//     try {
//       setLoading(true);
//       const data = await getS100Attendances(filters);
//       setStudents(data?.data || []);

//       // ✅ fetch summary also
//       const summaryData = await getAttendanceSummaryByClass(filters);
//       setSummary(summaryData?.data || []);
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle filter submit
//   const handleFilterSubmit = () => {
//     const filters = {};
//     if (date) filters.date = date;
//     if (classofStudent) filters.classofStudent = classofStudent;
//     fetchAttendance(filters);
//   };

//   // Clear filters → default today
//   const handleClear = () => {
//     setDate("");
//     setClassofStudent("");
//     fetchAttendance();
//   };

//   // Handle toggle
//   const handleToggle = async (student) => {
//     const newStatus = student.status === "Present" ? "Absent" : "Present";

//     try {
//       await updateAttendanceStatus(
//         {
//           studentSrn: student.studentSrn,
//           date: student.date,
//         },
//         { status: newStatus }
//       );

//       // Update UI immediately
//       setStudents((prev) =>
//         prev.map((s) =>
//           s.studentSrn === student.studentSrn && s.date === student.date
//             ? { ...s, status: newStatus }
//             : s
//         )
//       );

//       // ✅ Refresh summary after toggle
//       const filters = {};
//       if (date) filters.date = date;
//       if (classofStudent) filters.classofStudent = classofStudent;
//       const summaryData = await getAttendanceSummaryByClass(filters);
//       setSummary(summaryData?.data || []);

//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <Container fluid className="p-4">
//       <Row className="mb-3">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Class</Form.Label>
//             <Form.Select
//               value={classofStudent}
//               onChange={(e) => setClassofStudent(e.target.value)}
//             >
//               <option value="">-- Select Class --</option>
//               <option value="11">11</option>
//               <option value="12">12</option>
//               <option value="13">13</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={3} className="d-flex align-items-end">
//           <Button variant="primary" onClick={handleFilterSubmit} className="me-2">
//             Apply Filter
//           </Button>
//           <Button variant="secondary" onClick={handleClear}>
//             Clear
//           </Button>
//         </Col>
//       </Row>

//       {/* ✅ Summary Section */}
//       {summary.length > 0 && (
//         <Row className="mb-3">
//           <Col>
//             <h5>Attendance Summary</h5>
//             <Table bordered size="sm" className="mb-3">
//               <thead>
//                 <tr>
//                   <th>Class</th>
//                   <th>Present</th>
//                   <th>Absent</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {summary.map((s) => (
//                   <tr key={s.classofStudent}>
//                     <td>{s.classofStudent}</td>
//                     <td>{s.presentCount}</td>
//                     <td>{s.absentCount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Col>
//         </Row>
//       )}

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Table bordered hover responsive>
//           <thead>
//             <tr>
//               <th>SRN</th>
//               <th>First Name</th>
//               <th>Father Name</th>
//               <th>Class</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length > 0 ? (
//               students.map((student) => (
//                 <tr key={student._id}>
//                   <td>{student.studentSrn}</td>
//                   <td>{student.firstName}</td>
//                   <td>{student.fatherName}</td>
//                   <td>{student.classofStudent}</td>
//                   <td>
//                     <Form.Check
//                       type="switch"
//                       id={`status-${student.studentSrn}`}
//                       label={student.status}
//                       checked={student.status === "Present"}
//                       onChange={() => handleToggle(student)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default S100Attendances;


















// // src/components/attendance/S100Attendances.jsx

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Table,
//   Button,
// } from "react-bootstrap";

// import {
//   getS100Attendances,
//   updateAttendanceStatus,
//   getAttendanceSummaryByClass
// } from "../../service/S100Attendance.services.js";

// export const S100Attendances = () => {
//   const [students, setStudents] = useState([]);
//   const [date, setDate] = useState("");
//   const [classofStudent, setClassofStudent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [summary, setSummary] = useState([]); // ✅ summary state

//   // Fetch default (today's data)
//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   const fetchAttendance = async (filters = {}) => {
//     try {
//       setLoading(true);
//       const data = await getS100Attendances(filters);

//       // ✅ sort by sequenceId
//       const sortedData = (data?.data || []).sort((a, b) => a.sequenceId - b.sequenceId);
//       setStudents(sortedData);

//       // ✅ fetch summary also
//       const summaryData = await getAttendanceSummaryByClass(filters);
//       setSummary(summaryData?.data || []);
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle filter submit
//   const handleFilterSubmit = () => {
//     const filters = {};
//     if (date) filters.date = date;
//     if (classofStudent) filters.classofStudent = classofStudent;
//     fetchAttendance(filters);
//   };

//   // Clear filters → default today
//   const handleClear = () => {
//     setDate("");
//     setClassofStudent("");
//     fetchAttendance();
//   };

//   // Handle toggle
//   const handleToggle = async (student) => {
//     const newStatus = student.status === "Present" ? "Absent" : "Present";

//     try {
//       await updateAttendanceStatus(
//         {
//           studentSrn: student.studentSrn,
//           date: student.date,
//         },
//         { status: newStatus }
//       );

//       // Update UI immediately
//       setStudents((prev) =>
//         prev.map((s) =>
//           s.studentSrn === student.studentSrn && s.date === student.date
//             ? { ...s, status: newStatus }
//             : s
//         ).sort((a, b) => a.sequenceId - b.sequenceId) // ✅ keep sorted after toggle
//       );

//       // ✅ Refresh summary AFTER update
//       const filters = {};
//       if (date) filters.date = date;
//       if (classofStudent) filters.classofStudent = classofStudent;

//       // 🔑 ensure we wait for fresh data
//       const refreshedSummary = await getAttendanceSummaryByClass(filters);
//       setSummary(refreshedSummary?.data || []);

//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <Container fluid className="p-4">
//       <Row className="mb-3">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Class</Form.Label>
//             <Form.Select
//               value={classofStudent}
//               onChange={(e) => setClassofStudent(e.target.value)}
//             >
//               <option value="">-- Select Class --</option>
//               <option value="11">11</option>
//               <option value="12">12</option>
//               <option value="13">13</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={3} className="d-flex align-items-end">
//           <Button variant="primary" onClick={handleFilterSubmit} className="me-2">
//             Apply Filter
//           </Button>
//           <Button variant="secondary" onClick={handleClear}>
//             Clear
//           </Button>
//         </Col>
//       </Row>

//       {/* ✅ Summary Section */}
//       {summary.length > 0 && (
//         <Row className="mb-3">
//           <Col>
//             <h5>Attendance Summary</h5>
//             <Table bordered size="sm" className="mb-3">
//               <thead>
//                 <tr>
//                   <th>Class</th>
//                   <th>Present</th>
//                   <th>Absent</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {summary.map((s) => (
//                   <tr key={s.classofStudent}>
//                     <td>{s.classofStudent}</td>
//                     <td>{s.presentCount}</td>
//                     <td>{s.absentCount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Col>
//         </Row>
//       )}

//       {/* ✅ Show current filter info */}
//       <Row className="mb-2">
//         <Col>
//           <h6>
//             Showing Attendance for{" "}
//             <strong>{date ? date : "Today"}</strong>
//             {classofStudent && ` | Class ${classofStudent}`}
//           </h6>
//         </Col>
//       </Row>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Table bordered hover responsive>
//           <thead>
//             <tr>
//               <th>S.No</th> {/* ✅ Added S.No */}
//               <th>SRN</th>
//               <th>First Name</th>
//               <th>Father Name</th>
//               <th>Class</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length > 0 ? (
//               students.map((student, index) => (
//                 <tr key={student._id}>
//                   <td>{index + 1}</td> {/* ✅ serial no */}
//                   <td>{student.studentSrn}</td>
//                   <td>{student.firstName}</td>
//                   <td>{student.fatherName}</td>
//                   <td>{student.classofStudent}</td>
//                   <td>
//                     <Form.Check
//                       type="switch"
//                       id={`status-${student.studentSrn}`}
//                       label={student.status}
//                       checked={student.status === "Present"}
//                       onChange={() => handleToggle(student)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center">
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default S100Attendances;








// src/components/attendance/S100Attendances.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
} from "react-bootstrap";

import {
  getS100Attendances,
  updateAttendanceStatus,
  getAttendanceSummaryByClass
} from "../../service/S100Attendance.services.js";

export const S100Attendances = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [classofStudent, setClassofStudent] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]); // ✅ summary state
  const [hasFiltered, setHasFiltered] = useState(false); // ✅ track if filters applied

  // Fetch attendance only when filters are applied
  const fetchAttendance = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getS100Attendances(filters);

      // ✅ sort by sequenceId
      const sortedData = (data?.data || []).sort((a, b) => a.sequenceId - b.sequenceId);
      setStudents(sortedData);

      // ✅ fetch summary also
      const summaryData = await getAttendanceSummaryByClass(filters);
      setSummary(summaryData?.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter submit
  const handleFilterSubmit = () => {
    const filters = {};
    if (date) filters.date = date;
    if (classofStudent) filters.classofStudent = classofStudent;

    setHasFiltered(true); // ✅ now we know filters applied
    fetchAttendance(filters);
  };

  // Clear filters → reset state
  const handleClear = () => {
    setDate("");
    setClassofStudent("");
    setStudents([]);
    setSummary([]);
    setHasFiltered(false); // ✅ reset filter flag
  };

  // Handle toggle
  const handleToggle = async (student) => {
    const newStatus = student.status === "Present" ? "Absent" : "Present";

    try {
      await updateAttendanceStatus(
        {
          studentSrn: student.studentSrn,
          date: student.date,
        },
        { status: newStatus }
      );

      // Update UI immediately
      setStudents((prev) =>
        prev.map((s) =>
          s.studentSrn === student.studentSrn && s.date === student.date
            ? { ...s, status: newStatus }
            : s
        ).sort((a, b) => a.sequenceId - b.sequenceId) // ✅ keep sorted after toggle
      );

      // ✅ Refresh summary AFTER update
      const filters = {};
      if (date) filters.date = date;
      if (classofStudent) filters.classofStudent = classofStudent;

      const refreshedSummary = await getAttendanceSummaryByClass(filters);
      setSummary(refreshedSummary?.data || []);

    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Select Class</Form.Label>
            <Form.Select
              value={classofStudent}
              onChange={(e) => setClassofStudent(e.target.value)}
            >
              <option value="">-- Select Class --</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="12batch6">12batch6</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button variant="primary" onClick={handleFilterSubmit} className="me-2">
            Apply Filter
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>

      {/* ✅ Summary Section */}
      {hasFiltered && summary.length > 0 && (
        <Row className="mb-3">
          <Col>
            <h5>Attendance Summary</h5>
            <Table bordered size="sm" className="mb-3">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((s) => (
                  <tr key={s.classofStudent}>
                    <td>{s.classofStudent}</td>
                    <td>{s.presentCount}</td>
                    <td>{s.absentCount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

      {/* ✅ Show current filter info */}
      {hasFiltered && (
        <Row className="mb-2">
          <Col>
            <h6>
              Showing Attendance for{" "}
              <strong>{date ? date : "Selected Date"}</strong>
              {classofStudent && ` | Class ${classofStudent}`}
            </h6>
          </Col>
        </Row>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : hasFiltered ? (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th> {/* ✅ Added S.No */}
              <th>SRN</th>
              <th>First Name</th>
              <th>Father Name</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td> {/* ✅ serial no */}
                  <td>{student.studentSrn}</td>
                  <td>{student.firstName}</td>
                  <td>{student.fatherName}</td>
                  <td>{student.classofStudent}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id={`status-${student.studentSrn}`}
                      label={student.status}
                      checked={student.status === "Present"}
                      onChange={() => handleToggle(student)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <p className="text-center mt-4">Filter by Date and Class to view attendance</p>
      )}
    </Container>
  );
};

export default S100Attendances;
