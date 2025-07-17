//src/components/user/UserAttendanceDashboard.jsx


// import React, {useContext, useState, useEffect} from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { getFilteredUserAttendanceSummary } from '../../service/userAttendance.services';



// export const UserAttendanceDash = () =>{


//       //routing
//   const navigate = useNavigate();





//   //Context API
//   const {userData} = useContext(UserContext);

//   //----------------------------------------------

//   console.log(userData)


//   const fetchUserAttendanceSummaryData = async()=>{

//     const payLoad={

//     }


//     try {
        
//         //Below api calls backend controller
//         const response = await getFilteredUserAttendanceSummary(payLoad)

//     } catch (error) {
        
//         console.log("Error getting data", error)
//     }
    

//   }



//     return (

//         <div>



//         </div>
//     )
// }





// // src/components/user/UserAttendanceDashboard.jsx

// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { getFilteredUserAttendanceSummary } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   //routing
//   const navigate = useNavigate();

//   //Context API
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];


//     console.log(userData)

//     if (!loggedInUser) return;

//     const rolesToSearch = ['CC']; // You can make this dynamic or based on selection
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || []
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       setAttendanceSummary(response?.data?.data || []);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Department</th>
//               <th>Attendance</th>
//               <th>Type</th>
//               <th>Date</th>
//               <th>Visiting Location</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.userId}</td>
//                 <td>{item.name}</td>
//                 <td>{item.role}</td>
//                 <td>{item.department}</td>
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>{item.attendanceType || "N/A"}</td>
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 <td>{item.visitingLocation || "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };













// // src/components/user/UserAttendanceDashboard.jsx

// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { getFilteredUserAttendanceSummary } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   //routing
//   const navigate = useNavigate();

//   //Context API
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [selectedDate, setSelectedDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];

//     console.log(userData)

//     if (!loggedInUser) return;

//     const rolesToSearch = ['CC']; // You can make this dynamic or based on selection
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       date: selectedDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];

//         console.log(result)

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [selectedDate, statusFilter]);

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               {/* <th>User ID</th> */}
//               <th>Name</th>
//               <th>Contact</th>
//               {/* <th>Department</th> */}
//               <th>Attendance</th>
//               {/* <th>Type</th> */}
//               <th>Date</th>
//               {/* <th>Visiting Location</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 {/* <td>{item.userId}</td> */}
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 {/* <td>{item.department}</td> */}
//                 <td>{item.attendance || "N/A"}</td>
//                 {/* <td>{item.attendanceType || "N/A"}</td> */}
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 {/* <td>{item.visitingLocation || "N/A"}</td> */}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };





// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   //routing
//   const navigate = useNavigate();

//   //Context API
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [selectedDate, setSelectedDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];

//     console.log(userData)

//     if (!loggedInUser) return;


//     //Creating conditional roles to search.
//     //...Suppose, if community incharge or upper logs in so he must see...
//     //...CC, ACI attendance...If logged in user is ACI then show only ccs attendance.

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator"){
//         conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI"){
//         conditionalRoleToSearch = ['CC']
//     } 


//     const rolesToSearch = conditionalRoleToSearch; // You can make this dynamic or based on selection
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       date: selectedDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];

//       console.log(result)

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//          userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [selectedDate, statusFilter, selectedRoleFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {

//     const queryParams = {
//       userId: userId,
//       date: selectedDate,
//     };

//     console.log(queryParams)

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       console.log("✅ Patch Response:", response.data);

//       fetchUserAttendanceSummaryData(); // refresh table
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!')
//     }
//   };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//     { value: "Resigned", label: "Resigned" },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
        
        
//       </Row>

//       {userData?.[0]?.role === "Community Incharge" ||
//        userData?.[0]?.role === "Community Manager" ||
//        userData?.[0]?.role === "Project Coordinator" ||
//        userData?.[0]?.role === "admin" ? (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>👤 Filter by Role</Form.Label>
//               <Form.Select
//                 value={selectedRoleFilter}
//                 onChange={(e) => setSelectedRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="CC">CC</option>
//                 <option value="ACI">ACI</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={4} className="d-flex align-items-end">
//           <Button variant="secondary" onClick={() => {
//             setStatusFilter("All");
//             setSelectedRoleFilter("All");
//           }}>
//             Clear Filter
//           </Button>
//         </Col>
//         </Row>
        
//       ) : null}

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               {/* <th>User ID</th> */}
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               {/* <th>Department</th> */}
//               <th>Attendance</th>
//               <th>Status</th>
//               {/* <th>Type</th> */}
//               <th>Date</th>
//               {/* <th>Visiting Location</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 {/* <td>{item.userId}</td> */}
                
//                 <td>{index+1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 {/* <td>{item.department}</td> */}
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>
//                   {item.attendance === "Present" ? (
//                     <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                   ) : (
//                     <Select
//   options={statusOptions}
//   onChange={(selectedOption) =>
//     handleAttendanceUpdate(selectedOption, item.userId)
//   }
//   placeholder="Select Reason"
//   menuPlacement="auto" // Automatically open up if there's no space below
//   styles={{
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999, // Make sure dropdown is on top
//       maxHeight: 150,
//       overflowY: 'auto',
//     }),
//     control: (provided) => ({
//       ...provided,
//       minWidth: 150,
//     }),
//   }}
// />
//                   )}
//                 </td>
//                 {/* <td>{item.attendanceType || "N/A"}</td> */}
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 {/* <td>{item.visitingLocation || "N/A"}</td> */}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };



























// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];
//     console.log(userData);
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       date: selectedDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];
//       console.log(result);

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [selectedDate, statusFilter, selectedRoleFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     const queryParams = {
//       userId: userId,
//       date: selectedDate,
//     };

//     console.log(queryParams);

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       console.log("✅ Patch Response:", response.data);
//       fetchUserAttendanceSummaryData();
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin" ? (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>👤 Filter by Role</Form.Label>
//               <Form.Select
//                 value={selectedRoleFilter}
//                 onChange={(e) => setSelectedRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="CC">CC</option>
//                 <option value="ACI">ACI</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={4} className="d-flex align-items-end">
//             <Button variant="secondary" onClick={() => {
//               setStatusFilter("All");
//               setSelectedRoleFilter("All");
//             }}>
//               Clear Filter
//             </Button>
//           </Col>
//         </Row>
//       ) : null}

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th> {/* ✅ Added header */}
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>
//                   {item.attendance === "Present" ? (
//                     <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                   ) : (
//                     <Select
//                       options={statusOptions}
//                       onChange={(selectedOption) =>
//                         handleAttendanceUpdate(selectedOption, item.userId)
//                       }
//                       placeholder="Select Reason"
//                       menuPlacement="auto"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                           maxHeight: 150,
//                           overflowY: 'auto',
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           minWidth: 150,
//                         }),
//                       }}
//                     />
//                   )}
//                 </td>
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>

//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };













// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
//   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];
//     console.log(userData);
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       date: selectedDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];
//       console.log(result);

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       if (selectedTimeFilter !== "All") {
//         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
//         const threshold = new Date();
//         threshold.setHours(hour, minute, 0, 0);

//         result = result.filter((item) => {
//           if (!item.loginTime) return false;
//           const loginTime = new Date(item.loginTime);
//           return loginTime > threshold;
//         });
//       }

//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [selectedDate, statusFilter, selectedRoleFilter, selectedTimeFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     const queryParams = {
//       userId: userId,
//       date: selectedDate,
//     };

//     console.log(queryParams);

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       console.log("✅ Patch Response:", response.data);
//       fetchUserAttendanceSummaryData();
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>🕐 Login After</Form.Label>
//             <Form.Select
//               value={selectedTimeFilter}
//               onChange={(e) => setSelectedTimeFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="07:30">After 7:30 AM</option>
//               <option value="08:00">After 8:00 AM</option>
//               <option value="08:30">After 8:30 AM</option>
//               <option value="09:00">After 9:00 AM</option>
//               <option value="09:30">After 9:30 AM</option>
//               <option value="10:00">After 10:00 AM</option>
//               <option value="10:30">After 10:30 AM</option>
//               <option value="11:00">After 11:00 AM</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>

//         <Col>
//         </Col>
//       </Row>

//       {userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin" ? (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>👤 Filter by Role</Form.Label>
//               <Form.Select
//                 value={selectedRoleFilter}
//                 onChange={(e) => setSelectedRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="CC">CC</option>
//                 <option value="ACI">ACI</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={4} className="d-flex align-items-end">
//             <Button variant="secondary" onClick={() => {
//               setStatusFilter("All");
//               setSelectedRoleFilter("All");
//               setSelectedTimeFilter("All");
//             }}>
//               Clear Filter
//             </Button>
//           </Col>
//         </Row>
//       ) : null}

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>
//                   {item.attendance === "Present" ? (
//                     <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                   ) : (
//                     <Select
//                       options={statusOptions}
//                       onChange={(selectedOption) =>
//                         handleAttendanceUpdate(selectedOption, item.userId)
//                       }
//                       placeholder="Select Reason"
//                       menuPlacement="auto"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                           maxHeight: 150,
//                           overflowY: 'auto',
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           minWidth: 150,
//                         }),
//                       }}
//                     />
//                   )}
//                 </td>
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };






















// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
//   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       date: selectedDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       if (selectedTimeFilter !== "All") {
//         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
//         const threshold = new Date();
//         threshold.setHours(hour, minute, 0, 0);

//         result = result.filter((item) => {
//           if (!item.loginTime) return false;
//           const loginTime = new Date(item.loginTime);
//           return loginTime > threshold;
//         });
//       }

//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [selectedDate, statusFilter, selectedRoleFilter, selectedTimeFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     const queryParams = {
//       userId: userId,
//       date: selectedDate,
//     };

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       fetchUserAttendanceSummaryData();
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['#', 'Name', 'Contact', 'Role', 'Attendance', 'Status', 'Date', 'Login Time'];
//     const rows = attendanceSummary.map((item, index) => [
//       index + 1,
//       item.name || "",
//       item.contact1 || "",
//       item.role || "",
//       item.attendance || "N/A",
//       item.attendance === "Present" ? "✅" : item.attendance || "N/A",
//       item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A",
//       item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(field => `"${field}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Attendance_${selectedDate}.csv`);
//     link.style.display = "none";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//     { value: "Resigned", label: "Resigned " },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>🕐 Login After</Form.Label>
//             <Form.Select
//               value={selectedTimeFilter}
//               onChange={(e) => setSelectedTimeFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="07:30">After 7:30 AM</option>
//               <option value="08:00">After 8:00 AM</option>
//               <option value="08:30">After 8:30 AM</option>
//               <option value="09:00">After 9:00 AM</option>
//               <option value="09:30">After 9:30 AM</option>
//               <option value="10:00">After 10:00 AM</option>
//               <option value="10:30">After 10:30 AM</option>
//               <option value="11:00">After 11:00 AM</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin" ? (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>👤 Filter by Role</Form.Label>
//               <Form.Select
//                 value={selectedRoleFilter}
//                 onChange={(e) => setSelectedRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="CC">CC</option>
//                 <option value="ACI">ACI</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col md={4} className="d-flex align-items-end">
//             <Button variant="secondary" onClick={() => {
//               setStatusFilter("All");
//               setSelectedRoleFilter("All");
//               setSelectedTimeFilter("All");
//             }}>
//               Clear Filter
//             </Button>
//           </Col>
//           <Col md={4} className="d-flex align-items-end justify-content-end">
//             <Button variant="success" onClick={exportCSV}>⬇️ Export as CSV</Button>
//           </Col>
//         </Row>
//       ) : null}

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>
//                   {item.attendance === "Present" ? (
//                     <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                   ) : (
//                     <Select
//                       options={statusOptions}
//                       onChange={(selectedOption) =>
//                         handleAttendanceUpdate(selectedOption, item.userId)
//                       }
//                       placeholder="Select Reason"
//                       menuPlacement="auto"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                           maxHeight: 150,
//                           overflowY: 'auto',
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           minWidth: 150,
//                         }),
//                       }}
//                     />
//                   )}
//                 </td>
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };











































// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
//   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       date: selectedDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       if (selectedTimeFilter !== "All") {
//         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
//         const threshold = new Date(selectedDate); // ✅ Fixed line
//         threshold.setHours(hour, minute, 0, 0);

//         result = result.filter((item) => {
//           if (!item.loginTime) return false;
//           const loginTime = new Date(item.loginTime);
//           return loginTime > threshold;
//         });
//       }

//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [selectedDate, statusFilter, selectedRoleFilter, selectedTimeFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     const queryParams = {
//       userId: userId,
//       date: selectedDate,
//     };

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       fetchUserAttendanceSummaryData();
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['#', 'Name', 'Contact', 'Role', 'Attendance', 'Status', 'Date', 'Login Time'];
//     const rows = attendanceSummary.map((item, index) => [
//       index + 1,
//       item.name || "",
//       item.contact1 || "",
//       item.role || "",
//       item.attendance || "N/A",
//       item.attendance === "Present" ? "✅" : item.attendance || "N/A",
//       item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A",
//       item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(field => `"${field}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Attendance_${selectedDate}.csv`);
//     link.style.display = "none";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//     { value: "Resigned", label: "Resigned " },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>🕐 Login After</Form.Label>
//             <Form.Select
//               value={selectedTimeFilter}
//               onChange={(e) => setSelectedTimeFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="07:30">After 7:30 AM</option>
//               <option value="08:00">After 8:00 AM</option>
//               <option value="08:30">After 8:30 AM</option>
//               <option value="09:00">After 9:00 AM</option>
//               <option value="09:30">After 9:30 AM</option>
//               <option value="10:00">After 10:00 AM</option>
//               <option value="10:30">After 10:30 AM</option>
//               <option value="11:00">After 11:00 AM</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin" ? (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>👤 Filter by Role</Form.Label>
//               <Form.Select
//                 value={selectedRoleFilter}
//                 onChange={(e) => setSelectedRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="CC">CC</option>
//                 <option value="ACI">ACI</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col md={4} className="d-flex align-items-end">
//             <Button variant="secondary" onClick={() => {
//               setStatusFilter("All");
//               setSelectedRoleFilter("All");
//               setSelectedTimeFilter("All");
//             }}>
//               Clear Filter
//             </Button>
//           </Col>
//           <Col md={4} className="d-flex align-items-end justify-content-end">
//             <Button variant="success" onClick={exportCSV}>⬇️ Export as CSV</Button>
//           </Col>
//         </Row>
//       ) : null}

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>
//                   {item.attendance === "Present" ? (
//                     <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                   ) : (
//                     <Select
//                       options={statusOptions}
//                       onChange={(selectedOption) =>
//                         handleAttendanceUpdate(selectedOption, item.userId)
//                       }
//                       placeholder="Select Reason"
//                       menuPlacement="auto"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                           maxHeight: 150,
//                           overflowY: 'auto',
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           minWidth: 150,
//                         }),
//                       }}
//                     />
//                   )}
//                 </td>
//                 <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "N/A"}</td>
//                 <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };
























































// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [startDate, setStartDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });
//   const [endDate, setEndDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
//   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       startDate: startDate,
//       endDate: endDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       if (selectedTimeFilter !== "All") {
//         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
//         const threshold = new Date(startDate); // ✅ Still use startDate to compare loginTime
//         threshold.setHours(hour, minute, 0, 0);

//         result = result.filter((item) => {
//           if (!item.loginTime) return false;
//           const loginTime = new Date(item.loginTime);
//           return loginTime > threshold;
//         });
//       }
//       console.log(result)
//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [startDate, endDate, statusFilter, selectedRoleFilter, selectedTimeFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     const queryParams = {
//       userId: userId,
//       date: startDate,
//     };

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       fetchUserAttendanceSummaryData();
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const exportCSV = () => {
//   const headers = ['#', 'Name', 'Contact', 'Role', 'Attendance', 'Status', 'Date', 'Login Time'];
//   const rows = attendanceSummary.map((item, index) => [
//     index + 1,
//     item.name || "",
//     item.contact1 || "",
//     item.role || "",
//     item.attendance || "N/A",
//     item.attendance === "Present" ? "✅" : item.attendance || "N/A",
//     item.date ? new Date(item.date).toLocaleDateString() : "N/A",
//     item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"
//   ]);

//   const csvContent = [
//     headers.join(','),
//     ...rows.map(row => row.map(field => `"${field}"`).join(','))
//   ].join('\n');

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", `Attendance_${startDate}_to_${endDate}.csv`);
//   link.style.display = "none";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//     { value: "Resigned", label: "Resigned " },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Start Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 End Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//   value={statusFilter}
//   onChange={(e) => setStatusFilter(e.target.value)}
// >
//   <option value="All">All</option>
//   <option value="Present">Present</option>
//   <option value="Absent">Absent</option>
//   <option value="WFH">WFH</option>
//   <option value="Comp-off">Comp-off</option>
//   <option value="Monthly Leave">Monthly Leave</option>
//   <option value="Half Day">Half Day</option>
//   <option value="Sick Leave">Sick Leave</option>
//   <option value="Leave Without Pay">Leave Without Pay</option>
//   <option value="Resigned">Resigned </option>
// </Form.Select>

//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>🕐 Login After</Form.Label>
//             <Form.Select
//               value={selectedTimeFilter}
//               onChange={(e) => setSelectedTimeFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="07:30">After 7:30 AM</option>
//               <option value="08:00">After 8:00 AM</option>
//               <option value="08:30">After 8:30 AM</option>
//               <option value="09:00">After 9:00 AM</option>
//               <option value="09:30">After 9:30 AM</option>
//               <option value="10:00">After 10:00 AM</option>
//               <option value="10:30">After 10:30 AM</option>
//               <option value="11:00">After 11:00 AM</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         {userData?.[0]?.role === "Community Incharge" ||
//           userData?.[0]?.role === "Community Manager" ||
//           userData?.[0]?.role === "Project Coordinator" ||
//           userData?.[0]?.role === "admin" ? (
//           <>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>👤 Filter by Role</Form.Label>
//                 <Form.Select
//                   value={selectedRoleFilter}
//                   onChange={(e) => setSelectedRoleFilter(e.target.value)}
//                 >
//                   <option value="All">All</option>
//                   <option value="CC">CC</option>
//                   <option value="ACI">ACI</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={4} className="d-flex align-items-end justify-content-between">
//               <Button variant="secondary" onClick={() => {
//                 setStatusFilter("All");
//                 setSelectedRoleFilter("All");
//                 setSelectedTimeFilter("All");
//               }}>
//                 Clear Filter
//               </Button>
//               <Button variant="success" onClick={exportCSV}>⬇️ Export as CSV</Button>
//             </Col>
//           </>
//         ) : null}
//       </Row>

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.contact1}</td>
//                 <td>{item.attendance || "N/A"}</td>
//                 <td>
//                   {item.attendance === "Present" ? (
//                     <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                   ) : (
//                     <Select
//                       options={statusOptions}
//                       onChange={(selectedOption) =>
//                         handleAttendanceUpdate(selectedOption, item.userId)
//                       }
//                       placeholder="Select Reason"
//                       menuPlacement="auto"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 9999,
//                           maxHeight: 150,
//                           overflowY: 'auto',
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           minWidth: 150,
//                         }),
//                       }}
//                     />
//                   )}
//                 </td>
//                 <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
//                 <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };






























// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [startDate, setStartDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });
//   const [endDate, setEndDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
//   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData?.[0];
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.[0]?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       startDate: startDate,
//       endDate: endDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getFilteredUserAttendanceSummary(payLoad);
//       let result = response?.data?.data || [];

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.[0]?.role === "Community Incharge" ||
//         userData?.[0]?.role === "Community Manager" ||
//         userData?.[0]?.role === "Project Coordinator" ||
//         userData?.[0]?.role === "admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       if (selectedTimeFilter !== "All") {
//         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
//         const threshold = new Date(startDate);
//         threshold.setHours(hour, minute, 0, 0);

//         result = result.filter((item) => {
//           if (!item.loginTime) return false;
//           const loginTime = new Date(item.loginTime);
//           return loginTime > threshold;
//         });
//       }

//       console.log(result)
//       setAttendanceSummary(result);
//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [startDate, endDate, statusFilter, selectedRoleFilter, selectedTimeFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     const queryParams = {
//       userId: userId,
//       date: startDate,
//     };

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);
//       fetchUserAttendanceSummaryData();
//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['#', 'Name', 'Contact', 'Role', 'Attendance', 'Status', 'Date', 'Login Time', 'Districts', 'Centers'];
//     const rows = attendanceSummary.map((item, index) => {
//       const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
//       const centers = [...new Set(item.locationInfo?.map(loc => loc.centerName)?.filter(Boolean))] || [];

//       return [
//         index + 1,
//         item.name || "",
//         item.contact1 || "",
//         item.role || "",
//         item.attendance || "N/A",
//         item.attendance === "Present" ? "✅" : item.attendance || "N/A",
//         item.date ? new Date(item.date).toLocaleDateString() : "N/A",
//         item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A",
//         `${districts.join(', ')}`,
//         `${centers.join(', ')}`
//       ];
//     });

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(field => `"${field}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Attendance_${startDate}_to_${endDate}.csv`);
//     link.style.display = "none";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const statusOptions = [
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//     { value: "Resigned", label: "Resigned " },
//   ];

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 Start Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>📅 End Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//               <option value="WFH">WFH</option>
//               <option value="Comp-off">Comp-off</option>
//               <option value="Monthly Leave">Monthly Leave</option>
//               <option value="Half Day">Half Day</option>
//               <option value="Sick Leave">Sick Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//               <option value="Resigned">Resigned </option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>🕐 Login After</Form.Label>
//             <Form.Select
//               value={selectedTimeFilter}
//               onChange={(e) => setSelectedTimeFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="07:30">After 7:30 AM</option>
//               <option value="08:00">After 8:00 AM</option>
//               <option value="08:30">After 8:30 AM</option>
//               <option value="09:00">After 9:00 AM</option>
//               <option value="09:30">After 9:30 AM</option>
//               <option value="10:00">After 10:00 AM</option>
//               <option value="10:30">After 10:30 AM</option>
//               <option value="11:00">After 11:00 AM</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         {userData?.[0]?.role === "Community Incharge" ||
//           userData?.[0]?.role === "Community Manager" ||
//           userData?.[0]?.role === "Project Coordinator" ||
//           userData?.[0]?.role === "admin" ? (
//           <>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>👤 Filter by Role</Form.Label>
//                 <Form.Select
//                   value={selectedRoleFilter}
//                   onChange={(e) => setSelectedRoleFilter(e.target.value)}
//                 >
//                   <option value="All">All</option>
//                   <option value="CC">CC</option>
//                   <option value="ACI">ACI</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={4} className="d-flex align-items-end justify-content-between">
//               <Button variant="secondary" onClick={() => {
//                 setStatusFilter("All");
//                 setSelectedRoleFilter("All");
//                 setSelectedTimeFilter("All");
//               }}>
//                 Clear Filter
//               </Button>
//               <Button variant="success" onClick={exportCSV}>⬇️ Export as CSV</Button>
//             </Col>
//           </>
//         ) : null}
//       </Row>

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th>Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th>
//               <th>Districts</th>
//               <th>Centers</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => {
//               const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
//               const centers = [...new Set(item.locationInfo?.map(loc => loc.centerName)?.filter(Boolean))] || [];

//               return (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{item.name}</td>
//                   <td>{item.contact1}</td>
//                   <td>{item.attendance || "N/A"}</td>
//                   <td>
//                     {item.attendance === "Present" ? (
//                       <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
//                     ) : (
//                       <Select
//                         options={statusOptions}
//                         onChange={(selectedOption) =>
//                           handleAttendanceUpdate(selectedOption, item.userId)
//                         }
//                         placeholder="Select Reason"
//                         menuPlacement="auto"
//                         styles={{
//                           menu: (provided) => ({
//                             ...provided,
//                             zIndex: 9999,
//                             maxHeight: 150,
//                             overflowY: 'auto',
//                           }),
//                           control: (provided) => ({
//                             ...provided,
//                             minWidth: 150,
//                           }),
//                         }}
//                       />
//                     )}
//                   </td>
//                   <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
//                   <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
//                   <td>{districts.join(', ')}</td>
//                   <td>{centers.join(', ')}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };


























// src/components/user/UserAttendanceDashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contextAPIs/User.context";
import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getFilteredUserAttendanceSummary, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

export const UserAttendanceDash = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

  const fetchUserAttendanceSummaryData = async () => {
    const loggedInUser = userData?.[0];
    if (!loggedInUser) return;

    let conditionalRoleToSearch;
    if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Community Manager" || userData?.[0]?.role === "Project Coordinator") {
      conditionalRoleToSearch = ['ACI', 'CC']
    } else if (userData?.[0]?.role === "ACI") {
      conditionalRoleToSearch = ['CC']
    }

    const rolesToSearch = conditionalRoleToSearch;
    const departmentsToSearch = ['Community'];

    const payLoad = {
      roles: rolesToSearch,
      departments: departmentsToSearch,
      districtIds: loggedInUser.districtIds || [],
      schoolIds: loggedInUser.schoolIds || [],
      startDate: startDate,
      endDate: endDate
    };

    try {
      setIsLoading(true);
      const response = await getFilteredUserAttendanceSummary(payLoad);
      let result = response?.data?.data || [];

      if (statusFilter !== "All") {
        result = result.filter((item) => item.attendance === statusFilter);
      }

      if (
        userData?.[0]?.role === "Community Incharge" ||
        userData?.[0]?.role === "Community Manager" ||
        userData?.[0]?.role === "Project Coordinator" ||
        userData?.[0]?.role === "admin"
      ) {
        if (selectedRoleFilter !== "All") {
          result = result.filter((item) => item.role === selectedRoleFilter);
        }
      }

      if (selectedTimeFilter !== "All") {
        const [hour, minute] = selectedTimeFilter.split(":").map(Number);
        const threshold = new Date(startDate);
        threshold.setHours(hour, minute, 0, 0);

        result = result.filter((item) => {
          if (!item.loginTime) return false;
          const loginTime = new Date(item.loginTime);
          return loginTime > threshold;
        });
      }

      console.log(result)
      setAttendanceSummary(result);
    } catch (error) {
      console.log("Error getting data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAttendanceSummaryData();
  }, [startDate, endDate, statusFilter, selectedRoleFilter, selectedTimeFilter]);

  const handleAttendanceUpdate = async (selectedOption, userId) => {
    const queryParams = {
      userId: userId,
      date: startDate,
    };

    const payLoad = {
      attendance: selectedOption.value,
      attendanceMarkedBy: userData?.[0]?.userId || "unknown",
      attendanceType: "Leave",
      visitingLocation: "NA",
    };

    try {
      const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);

      setAttendanceSummary(prev =>
        prev.map(item =>
          item.userId === userId
            ? { ...item, attendance: selectedOption.value }
            : item
        )
      );

    } catch (error) {
      console.error("❌ Patch Error:", error.message);
      alert('Attendance has not been initiated in db. Contact to office!');
    }
  };

  const exportCSV = () => {
    const headers = ['#', 'Name', 'Contact', 'Role', 'Attendance', 'Status', 'Date', 'Login Time', 'Districts', 'Centers'];
    const rows = attendanceSummary.map((item, index) => {
      const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
      const centers = [...new Set(item.locationInfo?.map(loc => loc.centerName)?.filter(Boolean))] || [];

      return [
        index + 1,
        item.name || "",
        item.contact1 || "",
        item.role || "",
        item.attendance || "N/A",
        item.attendance === "Present" ? "✅" : item.attendance || "N/A",
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
        item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A",
        `${districts.join(', ')}`,
        `${centers.join(', ')}`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${startDate}_to_${endDate}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusOptions = [
    { value: "WFH", label: "WFH" },
    { value: "Comp-off", label: "Comp-off" },
    { value: "Monthly Leave", label: "Monthly Leave" },
    { value: "Half Day", label: "Half Day" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Leave Without Pay", label: "Leave Without Pay" },
    { value: "Resigned", label: "Resigned " },
  ];

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Attendance Summary</h4>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>📅 Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>📅 End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>✅ Attendance Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="WFH">WFH</option>
              <option value="Comp-off">Comp-off</option>
              <option value="Monthly Leave">Monthly Leave</option>
              <option value="Half Day">Half Day</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Leave Without Pay">Leave Without Pay</option>
              <option value="Resigned">Resigned </option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>🕐 Login After</Form.Label>
            <Form.Select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="07:30">After 7:30 AM</option>
              <option value="08:00">After 8:00 AM</option>
              <option value="08:30">After 8:30 AM</option>
              <option value="09:00">After 9:00 AM</option>
              <option value="09:30">After 9:30 AM</option>
              <option value="10:00">After 10:00 AM</option>
              <option value="10:30">After 10:30 AM</option>
              <option value="11:00">After 11:00 AM</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {userData?.[0]?.role === "Community Incharge" ||
          userData?.[0]?.role === "Community Manager" ||
          userData?.[0]?.role === "Project Coordinator" ||
          userData?.[0]?.role === "admin" ? (
          <>
            <Col md={4}>
              <Form.Group>
                <Form.Label>👤 Filter by Role</Form.Label>
                <Form.Select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="CC">CC</option>
                  <option value="ACI">ACI</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end justify-content-between">
              <Button variant="secondary" onClick={() => {
                setStatusFilter("All");
                setSelectedRoleFilter("All");
                setSelectedTimeFilter("All");
              }}>
                Clear Filter
              </Button>
              <Button variant="success" onClick={exportCSV}>⬇️ Export as CSV</Button>
            </Col>
          </>
        ) : null}
      </Row>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : attendanceSummary.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Date</th>
              <th>Login Time</th>
              <th>Districts</th>
              <th>Centers</th>
            </tr>
          </thead>
          <tbody>
            {attendanceSummary.map((item, index) => {
              const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
              const centers = [...new Set(item.locationInfo?.map(loc => loc.centerName)?.filter(Boolean))] || [];

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.contact1}</td>
                  <td>{item.attendance || "N/A"}</td>
                  <td>
                    {item.attendance === "Present" ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
                    ) : (
                      <Select
                        options={statusOptions}
                        onChange={(selectedOption) =>
                          handleAttendanceUpdate(selectedOption, item.userId)
                        }
                        placeholder="Select Reason"
                        menuPlacement="auto"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                            maxHeight: 150,
                            overflowY: 'auto',
                          }),
                          control: (provided) => ({
                            ...provided,
                            minWidth: 150,
                          }),
                        }}
                      />
                    )}
                  </td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                  <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
                  <td>{districts.join(', ')}</td>
                  <td>{centers.join(', ')}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};
