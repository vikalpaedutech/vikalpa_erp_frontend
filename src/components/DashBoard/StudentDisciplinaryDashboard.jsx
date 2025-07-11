// // // src/Components/Dashboard/StudentDisciplinaryData.jsx


// // import React, {useState, useEffect, useContext} from "react";
// // import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"
// // import { UserContext } from "../contextAPIs/User.context.js";

// // import { GetDisciplinaryDataByQueryParams } from "../../service/StudentDisciplinaryOrInteraction.services.js";
// // import { ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// // import { useSearchParams } from "react-router-dom";




// // export const StudentDisciplinaryDashboard = () =>{

// //     //Hooks
// //     const [status, setStatus] = useState(null);

// //     const [selectedDate, setSelectedDate] = useState(null);

// //     //Context API
// //     const {classContext, setClassContext} = useContext(ClassContext);
    
// //     const {userData, setUserData} = useContext(UserContext)




 
// // const fetchDisiciplinaryData = async () =>{

// //      const reqQuery = {
// //         schoolId: userData?.[0]?.assignedSchools || "", 
// //         status: status , 
// //         createdAt :selectedDate
// //     }

// //     try {
        
// //         const response = await GetDisciplinaryDataByQueryParams(reqQuery)
   


// //     } catch (error) {
        
// //         alert('Error fetching data!')

// //     }
// // }


// // return (

// //     <>
// // <h1>Hello Student disciplinary dash</h1>
    
    
// //     </>

// // )





// // }











// // src/Components/Dashboard/StudentDisciplinaryData.jsx

// import React, { useState, useEffect, useContext } from "react";
// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { GetDisciplinaryDataByQueryParams } from "../../service/StudentDisciplinaryOrInteraction.services.js";
// import { ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { useSearchParams } from "react-router-dom";
// import Select from "react-select";

// export const StudentDisciplinaryDashboard = () => {

//   // Hooks
//   const [status, setStatus] = useState({ label: "Copy Checking", value: "Copy Checking" });

//   const [selectedDate, setSelectedDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split("T")[0]; // format: YYYY-MM-DD
//   });

//   const [disciplinaryData, setDisciplinaryData] = useState()

//   // Context API
//   const { classContext, setClassContext } = useContext(ClassContext);
//   const { userData, setUserData } = useContext(UserContext);

//   const statusOptions = [
//     { label: "Copy Checking", value: "Copy Checking" },
//     { label: "Disciplinary", value: "Disciplinary" },
//   ];

//   const fetchDisiciplinaryData = async () => {
//     const reqQuery = {
//       schoolId: userData?.[0]?.assignedSchools || "",
//       status: status?.value,
//       createdAt: selectedDate,
//     };

//     try {
//       const response = await GetDisciplinaryDataByQueryParams(reqQuery);
//       console.log("Fetched Disciplinary Data:", response?.data?.data);
//       setDisciplinaryData(response?.data?.data)
//     } catch (error) {
//       alert("Error fetching data!");
//     }
//   };

//   useEffect(() => {
//     if (selectedDate && userData?.[0]?.assignedSchools) {
//       fetchDisiciplinaryData();
//     }
//   }, [selectedDate, status, userData]);

//   return (
//     <>
//       <h1>Hello Student disciplinary dash</h1>

//       <div className="filters" style={{ maxWidth: "300px", marginBottom: "1rem" }}>
//         <label>Status</label>
//         <Select
//           options={statusOptions}
//           value={status}
//           onChange={(selected) => setStatus(selected)}
//           placeholder="Select status"
//         />
//       </div>

//       <div className="filters" style={{ maxWidth: "300px", marginBottom: "1rem" }}>
//         <label>Date</label>
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="form-control"
//         />
//       </div>
//     </>
//   );
// };








// // src/Components/Dashboard/StudentDisciplinaryData.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { GetStudentCopyCheckingDashboard } from "../../service/StudentDisciplinaryOrInteraction.services.js";
// import Select from "react-select";
// import { Card, Table, Button, Row, Col, Container } from "react-bootstrap";

// export const StudentDisciplinaryDashboard = () => {
//   const [status, setStatus] = useState({ label: "Copy Checking", value: "Copy Checking" });
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
//   const [disciplinaryData, setDisciplinaryData] = useState([]);
//   const [classFilter, setClassFilter] = useState("all");

//   const { userData } = useContext(UserContext);
//   const { classContext } = useContext(ClassContext);

//   const statusOptions = [
//     { label: "Copy Checking", value: "Copy Checking" },
//     { label: "Disciplinary", value: "Disciplinary" },
//   ];

//   const fetchDisiciplinaryData = async () => {
    
//     const reqQuery = {
//       // schoolId: userData?.[0]?.assignedSchools || "",
//       // status: status?.value,
//       createdAt: selectedDate,
//     };

//     try {
//       const response = await GetStudentCopyCheckingDashboard(reqQuery);
//       setDisciplinaryData(response?.data?.data || []);

//       console.log(response.data.data)
//     } catch (error) {
//       alert("Error fetching data!");
//     }
//   };

//   useEffect(() => {
//     if (selectedDate && userData?.[0]?.assignedSchools) {
//       fetchDisiciplinaryData();
//     }
//   }, [selectedDate, status, userData]);

//   const exportToCsv = () => {
//     let csv = "";
//     if (status.value === "Copy Checking") {
//       csv += "First Name,Father Name,Class";
//       const subjects = ["Hindi", "English", "Maths", "Science", "S.St"];
//       subjects.forEach((s) => (csv += ",CW: " + s));
//       subjects.forEach((s) => (csv += ",HW: " + s));
//       csv += "\n";

//       disciplinaryData.forEach((student) => {
//         if (classFilter === "all" || student.classofStudent === classFilter) {
//           let row = `${student.firstName},${student.fatherName},${student.classofStudent}`;
//           const subjectsMap = {};
//           student.subjects.forEach((sub) => {
//             subjectsMap[sub.subject] = sub;
//           });
//           subjects.forEach((s) => row += "," + (subjectsMap[s]?.classWorkChecking || ""));
//           subjects.forEach((s) => row += "," + (subjectsMap[s]?.homeWorkChecking || ""));
//           csv += row + "\n";
//         }
//       });
//     } else {
//       csv += "First Name,Father Name,Class,Remarks,Remarks Count\n";
//       disciplinaryData.forEach((student) => {
//         if (classFilter === "all" || student.classofStudent === classFilter) {
//           const remarks = student.subjects?.map(sub => sub.subject).join(", ") || "";
//           const count = student.subjects?.length || 0;
//           csv += `${student.firstName},${student.fatherName},${student.classofStudent},"${remarks}",${count}\n`;
//         }
//       });
//     }

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Disciplinary_${status.value}_${selectedDate}_${classFilter}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <Container className="mt-4">
//       <Card className="p-3 shadow-sm mb-3">
//         <Row className="mb-2">
//           <Col md={4}>
//             <label>Status</label>
//             <Select
//               options={statusOptions}
//               value={status}
//               onChange={setStatus}
//             />
//           </Col>
//           <Col md={3}>
//             <label>Date</label>
//             <input
//               type="date"
//               className="form-control"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Col>
//           <Col md={3}>
//             <label>Class</label>
//             <div className="d-flex gap-2">
//               <Button
//                 variant={classFilter === "all" ? "primary" : "outline-primary"}
//                 onClick={() => setClassFilter("all")}>All</Button>
//               <Button
//                 variant={classFilter === "9" ? "primary" : "outline-primary"}
//                 onClick={() => setClassFilter("9")}>Class 9</Button>
//               <Button
//                 variant={classFilter === "10" ? "primary" : "outline-primary"}
//                 onClick={() => setClassFilter("10")}>Class 10</Button>
//             </div>
//           </Col>
//           <Col md={2} className="d-flex align-items-end">
//             <Button variant="success" onClick={exportToCsv}>Export to CSV</Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               {status.value === "Copy Checking" ? (
//                 <tr>
//                   <th>First Name</th>
//                   <th>Father Name</th>
//                   <th>Class</th>
//                   <th colSpan={5}>Class Work</th>
//                   <th colSpan={5}>Home Work</th>
//                 </tr>
//               ) : (
//                 <tr>
//                   <th>First Name</th>
//                   <th>Father Name</th>
//                   <th>Class</th>
//                   <th>Remarks</th>
//                   <th>Remarks Count</th>
//                 </tr>
//               )}
//             </thead>
//             <tbody className="text-center">
//               {disciplinaryData.filter(student => classFilter === "all" || student.classofStudent === classFilter).map((student, idx) => {
//                 if (status.value === "Copy Checking") {
//                   const subjectsMap = {};
//                   student.subjects?.forEach((sub) => {
//                     subjectsMap[sub.subject] = sub;
//                   });
//                   return (
//                     <tr key={idx}>
//                       <td>{student.firstName}</td>
//                       <td>{student.fatherName}</td>
//                       <td>{student.classofStudent}</td>
//                       {['Hindi', 'English', 'Maths', 'Science', 'S.St'].map((s, i) => (
//                         <td key={`cw-${i}`}>{subjectsMap[s]?.classWorkChecking || ""}</td>
//                       ))}
//                       {['Hindi', 'English', 'Maths', 'Science', 'S.St'].map((s, i) => (
//                         <td key={`hw-${i}`}>{subjectsMap[s]?.homeWorkChecking || ""}</td>
//                       ))}
//                     </tr>
//                   );
//                 } else {
//                   const remarks = student.subjects?.map((sub) => sub.subject).join(", ") || "";
//                   return (
//                     <tr key={idx}>
//                       <td>{student.firstName}</td>
//                       <td>{student.fatherName}</td>
//                       <td>{student.classofStudent}</td>
//                       <td>{remarks}</td>
//                       <td>{student.subjects?.length || 0}</td>
//                     </tr>
//                   );
//                 }
//               })}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };






















// // src/Components/Dashboard/StudentCopyCheckingTable.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Button, Row, Col, Form } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetStudentCopyCheckingDashboard } from "../../service/StudentDisciplinaryOrInteraction.services";

// export const StudentDisciplinaryDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
//   const [data, setData] = useState([]);
//   const [classFilter, setClassFilter] = useState("all");

//   const fetchCopyData = async () => {
//     try {
//       const res = await GetStudentCopyCheckingDashboard({ createdAt: selectedDate });
//       setData(res.data.data || []);
//     } catch (error) {
//       alert("Error fetching copy checking data");
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchCopyData();
//     }
//   }, [selectedDate, userData]);

//   const exportToCsv = () => {
//     let csv = "S. No.,District,Center,Class,Total Students,Copy Checking Count\n";
//     data.forEach((item, index) => {
//       if (classFilter === "all" || item.classofStudent === classFilter) {
//         csv += `${index + 1},${item.districtName},${item.centerName},${item.classofStudent},${item.totalStudents},${item.copyCheckingCount}\n`;
//       }
//     });

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `CopyChecking_${selectedDate}_${classFilter}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

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
//             <Col sm={4}>
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="All"
//                 checked={classFilter === "all"}
//                 onChange={() => setClassFilter("all")}
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 9"
//                 checked={classFilter === "9"}
//                 onChange={() => setClassFilter("9")}
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 10"
//                 checked={classFilter === "10"}
//                 onChange={() => setClassFilter("10")}
//               />
//             </Col>
//             <Col sm={2}>
//               <Button variant="success" onClick={exportToCsv}>Export to CSV</Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Copy Checking Dashboard</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>Center</th>
//                 <th>Class</th>
//                 <th>Total Students</th>
//                 <th>Copy Checking Count</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {data
//                 .filter(d => classFilter === "all" || d.classofStudent === classFilter)
//                 .map((item, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{item.districtName}</td>
//                     <td>{item.centerName}</td>
//                     <td>{item.classofStudent}</td>
//                     <td>{item.totalStudents}</td>
//                     <td>{item.copyCheckingCount}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };




















// // src/Components/Dashboard/StudentCopyCheckingTable.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Button, Row, Col, Form } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetStudentCopyCheckingDashboard } from "../../service/StudentDisciplinaryOrInteraction.services";

// export const StudentDisciplinaryDashboard = () => {
//   const { userData } = useContext(UserContext);
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
//   const [data, setData] = useState([]);
//   const [classFilter, setClassFilter] = useState("all");

//   const fetchCopyData = async () => {
//     try {
//       const res = await GetStudentCopyCheckingDashboard({ createdAt: selectedDate });
//       setData(res.data.data || []);
//     } catch (error) {
//       alert("Error fetching copy checking data");
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchCopyData();
//     }
//   }, [selectedDate, userData]);

//   const exportToCsv = () => {
//     let csv = "S. No.,District,Center,Class,Total Students,Copy Checking Count\n";
//     const sorted = [...data]
//       .filter((d) => classFilter === "all" || d.classofStudent === classFilter)
//       .sort((a, b) => {
//         if (a.classofStudent !== b.classofStudent) return a.classofStudent.localeCompare(b.classofStudent);
//         return a.districtName.localeCompare(b.districtName);
//       });

//     sorted.forEach((item, index) => {
//       csv += `${index + 1},${item.districtName},${item.centerName},${item.classofStudent},${item.totalStudents},${item.copyCheckingCount}\n`;
//     });

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `CopyChecking_${selectedDate}_${classFilter}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const sortedData = [...data]
//     .filter((d) => classFilter === "all" || d.classofStudent === classFilter)
//     .sort((a, b) => {
//       if (a.classofStudent !== b.classofStudent) return a.classofStudent.localeCompare(b.classofStudent);
//       return a.districtName.localeCompare(b.districtName);
//     });

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
//             <Col sm={4}>
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="All"
//                 checked={classFilter === "all"}
//                 onChange={() => setClassFilter("all")}
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 9"
//                 checked={classFilter === "9"}
//                 onChange={() => setClassFilter("9")}
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 10"
//                 checked={classFilter === "10"}
//                 onChange={() => setClassFilter("10")}
//               />
//             </Col>
//             <Col sm={2}>
//               <Button variant="success" onClick={exportToCsv}>Export to CSV</Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       {/* Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Copy Checking Dashboard</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>Center</th>
//                 <th>Class</th>
//                 <th>Total Students</th>
//                 <th>Copy Checking Count</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {sortedData.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{item.districtName}</td>
//                   <td>{item.centerName}</td>
//                   <td>{item.classofStudent}</td>
//                   <td>{item.totalStudents}</td>
//                   <td>{item.copyCheckingCount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };














// src/Components/Dashboard/StudentCopyCheckingTable.jsx

import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Table, Button, Row, Col, Form } from "react-bootstrap";
import { UserContext } from "../contextAPIs/User.context";
import { GetStudentCopyCheckingDashboard } from "../../service/StudentDisciplinaryOrInteraction.services";

export const StudentDisciplinaryDashboard = () => {
  const { userData } = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [classFilter, setClassFilter] = useState("all");
  const [onlyZero, setOnlyZero] = useState(false);

  const fetchCopyData = async () => {
    try {
      const res = await GetStudentCopyCheckingDashboard({ createdAt: selectedDate });
      setData(res.data.data || []);
    } catch (error) {
      alert("Error fetching copy checking data");
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchCopyData();
    }
  }, [selectedDate, userData]);

  const exportToCsv = () => {
    let csv = "S. No.,District,Center,Class,Total Students,Copy Checking Count\n";
    const sorted = [...data]
      .filter((d) => (classFilter === "all" || d.classofStudent === classFilter))
      .filter((d) => (!onlyZero || d.copyCheckingCount === 0))
      .sort((a, b) => {
        if (a.classofStudent !== b.classofStudent) return a.classofStudent.localeCompare(b.classofStudent);
        return a.districtName.localeCompare(b.districtName);
      });

    sorted.forEach((item, index) => {
      csv += `"${index + 1}","${item.districtName}","${item.centerName}","${item.classofStudent}","${item.totalStudents}","${item.copyCheckingCount}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CopyChecking_${selectedDate}_${classFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedData = [...data]
    .filter((d) => (classFilter === "all" || d.classofStudent === classFilter))
    .filter((d) => (!onlyZero || d.copyCheckingCount === 0))
    .sort((a, b) => {
      if (a.classofStudent !== b.classofStudent) return a.classofStudent.localeCompare(b.classofStudent);
      return a.districtName.localeCompare(b.districtName);
    });

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
            <Col sm={4}>
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="All"
                checked={classFilter === "all"}
                onChange={() => setClassFilter("all")}
              />
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="Class 9"
                checked={classFilter === "9"}
                onChange={() => setClassFilter("9")}
              />
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="Class 10"
                checked={classFilter === "10"}
                onChange={() => setClassFilter("10")}
              />
              <Form.Check
                inline
                type="checkbox"
                label="Only 0 Checked"
                checked={onlyZero}
                onChange={(e) => setOnlyZero(e.target.checked)}
              />
            </Col>
            <Col sm={2}>
              <Button variant="success" onClick={exportToCsv}>Export to CSV</Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Copy Checking Dashboard</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>S. No.</th>
                <th>District</th>
                <th>Center</th>
                <th>Class</th>
                <th>Total Students</th>
                <th>Copy Checking Count</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {sortedData.map((item, index) => (
                // <tr key={index} style={{ backgroundColor: item.copyCheckingCount === 0 ? '#f8d7da' : 'transparent' }}>
                //   <td>{index + 1}</td>
                //   <td>{item.districtName}</td>
                //   <td>{item.centerName}</td>
                //   <td>{item.classofStudent}</td>
                //   <td>{item.totalStudents}</td>
                //   <td>{item.copyCheckingCount}</td>
                // </tr>






                <tr key={index}>
  <td style={Number(item.copyCheckingCount) === 0 ? { backgroundColor: '#ffcccc', fontWeight: 'bold' } : {}}>
    {index + 1}
  </td>
  <td style={Number(item.copyCheckingCount) === 0 ? { backgroundColor: '#ffcccc', fontWeight: 'bold' } : {}}>
    {item.districtName}
  </td>
  <td style={Number(item.copyCheckingCount) === 0 ? { backgroundColor: '#ffcccc', fontWeight: 'bold' } : {}}>
    {item.centerName}
  </td>
  <td style={Number(item.copyCheckingCount) === 0 ? { backgroundColor: '#ffcccc', fontWeight: 'bold' } : {}}>
    {item.classofStudent}
  </td>
  <td style={Number(item.copyCheckingCount) === 0 ? { backgroundColor: '#ffcccc', fontWeight: 'bold' } : {}}>
    {item.totalStudents}
  </td>
  <td style={Number(item.copyCheckingCount) === 0 ? { backgroundColor: '#ffcccc', fontWeight: 'bold' } : {}}>
    {item.copyCheckingCount}
  </td>
</tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};
