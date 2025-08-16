// //This will have the dashboard of bills. 
// //Using this admin can download and update the status of bills as paid, or bulk approve and
// //...rejection can be done from here


// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getBillsByQueryParams, deleteBill, getAllBills, getAllBillsWithUserDetails } from "../../service/Bills.services";
// import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

// export const BillDashboard = () => {
//   //Context apis
//   const { userData, setUserData } = useContext(UserContext);
//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext, setClassContext } = useContext(ClassContext);

//   //Usestate hooks.
//   const [billsData, setBillsData] = useState([]);
//   const [statusSelections, setStatusSelections] = useState({}); // to track dropdown selections

  



//   //Get all bills with user details.

//   const FetchAllBillsData = async () => {
//   try {
//     const data = await getAllBillsWithUserDetails(); // this is already JSON
//     console.log(data); // ✅ now you'll see your array/object
//     setBillsData(data.data); // if your API returns { status: "Success", data: [...] }
//     console.log('I am inside try block');
//   } catch (error) {
//     console.log("Error fetching bills data", error.message);
//     console.log('I am inside catch block');
//   }
// };

// useEffect(()=>{
//     FetchAllBillsData()
// },[])

// console.log('Hello dev')
//   return (
//     <Container>
//       <h1>Hello bills</h1>
//     </Container>
//   );
// };



































// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// export const BillDashboard = () => {
//   //Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   //Usestate hooks.
//   const [billsData, setBillsData] = useState([]);

//   //Get all bills with user details.
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // assuming this returns {status, data: []}
//       console.log(data);
//       setBillsData(data.data || []); 
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {billsData.length > 0 ? (
//               billsData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{ width: "60px", height: "60px", objectFit: "cover" }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };





















// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     ["S.No", "Bill ID", "User ID", "Name", "Role", "Bill Date", "Status"],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter)
//     );
//   });

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//             >
//               Export CSV
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };






// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     ["S.No", "Bill ID", "User ID", "Name", "Role", "District(s)", "School(s)", "Bill Date", "Status"],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       r.districtDetails?.map((d) => d.districtName).join(", ") || "N/A",
//       r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [districtFilter, setDistrictFilter] = useState("All");
//   const [schoolFilter, setSchoolFilter] = useState("All");

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
//     const schoolNames = bill.schoolDetails?.map((s) => s.centerName) || [];
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter) &&
//       (districtFilter === "All" || districtNames.includes(districtFilter)) &&
//       (schoolFilter === "All" || schoolNames.includes(schoolFilter))
//     );
//   });

//   // Unique district and school lists for filters
//   const uniqueDistricts = [
//     ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
//   ];
//   const uniqueSchools = [
//     ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
//   ];

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by District</Form.Label>
//               <Form.Select
//                 value={districtFilter}
//                 onChange={(e) => setDistrictFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueDistricts.map((district, idx) => (
//                   <option key={idx} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by School</Form.Label>
//               <Form.Select
//                 value={schoolFilter}
//                 onChange={(e) => setSchoolFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueSchools.map((school, idx) => (
//                   <option key={idx} value={school}>
//                     {school}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end mt-3">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//             >
//               Export CSV
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>District(s)</th>
//               <th>School(s)</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.districtDetails?.map((d) => d.districtName).join(", ") || "N/A"}</td>
//                   <td>{bill.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="10" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };

















// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     ["S.No", "Bill ID", "User ID", "Name", "Role", "District(s)", "School(s)", "Bill Date", "Status"],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       r.districtDetails?.map((d) => d.districtName).join(", ") || "N/A",
//       r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [districtFilter, setDistrictFilter] = useState("All");
//   const [schoolFilter, setSchoolFilter] = useState("All");

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
//     const schoolNames = bill.schoolDetails?.map((s) => s.centerName) || [];
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter) &&
//       (districtFilter === "All" || districtNames.includes(districtFilter)) &&
//       (schoolFilter === "All" || schoolNames.includes(schoolFilter))
//     );
//   });

//   // Unique district and school lists for filters
//   const uniqueDistricts = [
//     ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
//   ];
//   const uniqueSchools = [
//     ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
//   ];

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by District</Form.Label>
//               <Form.Select
//                 value={districtFilter}
//                 onChange={(e) => setDistrictFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueDistricts.map((district, idx) => (
//                   <option key={idx} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by School</Form.Label>
//               <Form.Select
//                 value={schoolFilter}
//                 onChange={(e) => setSchoolFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueSchools.map((school, idx) => (
//                   <option key={idx} value={school}>
//                     {school}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end mt-3">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//             >
//               Export CSV
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };



















// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     ["S.No", "Bill ID", "User ID", "Name", "Role", "District(s)", "School(s)", "Bill Date", "Status"],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       [...new Set(r.districtDetails?.map((d) => d.districtName) || [])].join(", ") || "N/A",
//       r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [districtFilter, setDistrictFilter] = useState("All");
//   const [schoolFilter, setSchoolFilter] = useState("All");

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
//     const schoolNames = bill.schoolDetails?.map((s) => s.centerName) || [];
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter) &&
//       (districtFilter === "All" || districtNames.includes(districtFilter)) &&
//       (schoolFilter === "All" || schoolNames.includes(schoolFilter))
//     );
//   });

//   // Unique district and school lists for filters
//   const uniqueDistricts = [
//     ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
//   ];
//   const uniqueSchools = [
//     ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
//   ];

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by District</Form.Label>
//               <Form.Select
//                 value={districtFilter}
//                 onChange={(e) => setDistrictFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueDistricts.map((district, idx) => (
//                   <option key={idx} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by School</Form.Label>
//               <Form.Select
//                 value={schoolFilter}
//                 onChange={(e) => setSchoolFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueSchools.map((school, idx) => (
//                   <option key={idx} value={school}>
//                     {school}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end mt-3">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//             >
//               Export CSV
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };







// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     [
//       "S.No",
//       "Bill ID",
//       "User ID",
//       "Name",
//       "Role",
//       "Purpose Of Expense",
//       "Expense Type",
//       "Expense Amount",
//       "Bill Image URL",
//       "District(s)",
//       "School(s)",
//       "Bill Date",
//       "Status",
//     ],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       r.purposeOfExpense || "N/A",
//       r.expenseType || "N/A",
//       r.expenseAmount || "N/A",
//       r.fileUrl || "N/A",
//       [...new Set(r.districtDetails?.map((d) => d.districtName) || [])].join(", ") || "N/A",
//       r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [districtFilter, setDistrictFilter] = useState("All");
//   const [schoolFilter, setSchoolFilter] = useState("All");

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
//     const schoolNames = bill.schoolDetails?.map((s) => s.centerName) || [];
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter) &&
//       (districtFilter === "All" || districtNames.includes(districtFilter)) &&
//       (schoolFilter === "All" || schoolNames.includes(schoolFilter))
//     );
//   });

//   // Unique district and school lists for filters
//   const uniqueDistricts = [
//     ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
//   ];
//   const uniqueSchools = [
//     ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
//   ];

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by District</Form.Label>
//               <Form.Select
//                 value={districtFilter}
//                 onChange={(e) => setDistrictFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueDistricts.map((district, idx) => (
//                   <option key={idx} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by School</Form.Label>
//               <Form.Select
//                 value={schoolFilter}
//                 onChange={(e) => setSchoolFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueSchools.map((school, idx) => (
//                   <option key={idx} value={school}>
//                     {school}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end mt-3">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//             >
//               Export CSV
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };






// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     [
//       "S.No",
//       "Bill ID",
//       "User ID",
//       "Name",
//       "Role",
//       "Purpose Of Expense",
//       "Expense Type",
//       "Expense Amount",
//       "Bill Image URL",
//       "District(s)",
//       "School(s)",
//       "Bill Date",
//       "Status",
//     ],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       r.purposeOfExpense || "N/A",
//       r.expenseType || "N/A",
//       r.expenseAmount || "N/A",
//       r.fileUrl || "N/A",
//       [...new Set(r.districtDetails?.map((d) => d.districtName) || [])].join(", ") || "N/A",
//       r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [districtFilter, setDistrictFilter] = useState("All");

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter) &&
//       (districtFilter === "All" || districtNames.includes(districtFilter))
//     );
//   });

//   // Unique district and school lists for filters
//   const uniqueDistricts = [
//     ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
//   ];
//   const uniqueSchools = [
//     ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
//   ];

//   // Clear filters
//   const clearFilters = () => {
//     setRoleFilter("All");
//     setStatusFilter("All");
//     setDistrictFilter("All");
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by District</Form.Label>
//               <Form.Select
//                 value={districtFilter}
//                 onChange={(e) => setDistrictFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueDistricts.map((district, idx) => (
//                   <option key={idx} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end mt-3">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//               className="me-2"
//             >
//               Export CSV
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={clearFilters}
//             >
//               Clear Filters
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Card>
//     </Container>
//   );
// };






















// // BillDashboard.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Card, Table, Image, Form, Row, Col, Button, Pagination } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   SchoolContext,
//   BlockContext,
//   DistrictBlockSchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// // CSV Export Utility
// const exportToCsv = (rows) => {
//   const csvContent = [
//     [
//       "S.No",
//       "Bill ID",
//       "User ID",
//       "Name",
//       "Role",
//       "Purpose Of Expense",
//       "Expense Type",
//       "Expense Amount",
//       "Bill Image URL",
//       "District(s)",
//       "School(s)",
//       "Bill Date",
//       "Status",
//     ],
//     ...rows.map((r, index) => [
//       index + 1,
//       r._id,
//       r.userId,
//       r.userDetails?.name || "N/A",
//       r.role,
//       r.purposeOfExpense || "N/A",
//       r.expenseType || "N/A",
//       r.expenseAmount || "N/A",
//       r.fileUrl || "N/A",
//       [...new Set(r.districtDetails?.map((d) => d.districtName) || [])].join(", ") || "N/A",
//       r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
//       r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
//       r.status,
//     ]),
//   ]
//     .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     .join("\n");

//   const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const BillDashboard = () => {
//   // Context apis
//   const { userData } = useContext(UserContext);
//   const { districtContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext } = useContext(BlockContext);
//   const { schoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   // State
//   const [billsData, setBillsData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [districtFilter, setDistrictFilter] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 50;

//   // Fetch bills
//   const FetchAllBillsData = async () => {
//     try {
//       const data = await getAllBillsWithUserDetails(); // {status, data: []}
//       setBillsData(data.data || []);
//       console.log(data)
//     } catch (error) {
//       console.log("Error fetching bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     FetchAllBillsData();
//   }, []);

//   // Apply filters
//   const filteredData = billsData.filter((bill) => {
//     const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
//     return (
//       (roleFilter === "All" || bill.role === roleFilter) &&
//       (statusFilter === "All" || bill.status === statusFilter) &&
//       (districtFilter === "All" || districtNames.includes(districtFilter))
//     );
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   // Unique district and school lists for filters
//   const uniqueDistricts = [
//     ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
//   ];
//   const uniqueSchools = [
//     ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
//   ];

//   // Clear filters
//   const clearFilters = () => {
//     setRoleFilter("All");
//     setStatusFilter("All");
//     setDistrictFilter("All");
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Card className="shadow-sm p-3">
//         <h3 className="mb-3">Bills Dashboard</h3>

//         {/* Filters */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Role</Form.Label>
//               <Form.Select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="ACI">ACI</option>
//                 <option value="CC">CC</option>
//                 <option value="Admin">Admin</option>
//                 {/* Add more roles if needed */}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by Status</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Verified">Verified</option>
//                 <option value="Rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Filter by District</Form.Label>
//               <Form.Select
//                 value={districtFilter}
//                 onChange={(e) => setDistrictFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 {uniqueDistricts.map((district, idx) => (
//                   <option key={idx} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={3} className="d-flex align-items-end mt-3">
//             <Button
//               variant="success"
//               onClick={() => exportToCsv(filteredData)}
//               className="me-2"
//             >
//               Export CSV
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={clearFilters}
//             >
//               Clear Filters
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>Bill ID</th>
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Bill Image</th>
//               <th>Bill Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map((bill, index) => (
//                 <tr key={bill._id}>
//                   <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
//                   <td>{bill._id}</td>
//                   <td>{bill.userId}</td>
//                   <td>{bill.userDetails?.name || "N/A"}</td>
//                   <td>{bill.role}</td>
//                   <td>
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Image
//                           src={bill.fileUrl}
//                           alt="Bill"
//                           thumbnail
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </a>
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td>
//                     {bill.expenseDate
//                       ? new Date(bill.expenseDate).toISOString().split("T")[0]
//                       : ""}
//                   </td>
//                   <td>{bill.status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No bills found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <Pagination className="justify-content-center mt-3">
//             <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
//             <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
//             {[...Array(totalPages)].map((_, idx) => (
//               <Pagination.Item
//                 key={idx + 1}
//                 active={idx + 1 === currentPage}
//                 onClick={() => setCurrentPage(idx + 1)}
//               >
//                 {idx + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
//             <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
//           </Pagination>
//         )}
//       </Card>
//     </Container>
//   );
// };
















// BillDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Table, Image, Form, Row, Col, Button, Pagination } from "react-bootstrap";
import { UserContext } from "../contextAPIs/User.context";
import {
  SchoolContext,
  BlockContext,
  DistrictBlockSchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { getAllBillsWithUserDetails } from "../../service/Bills.services";

// CSV Export Utility
const exportToCsv = (rows) => {
  const csvContent = [
    [
      "S.No",
      "Bill ID",
      "User ID",
      "Name",
      "Role",
      "Purpose Of Expense",
      "Expense Type",
      "Expense Amount",
      "Bill Image URL",
      "District(s)",
      "School(s)",
      "Bill Date",
      "Status",
    ],
    ...rows.map((r, index) => [
      index + 1,
      r._id,
      r.userId,
      r.userDetails?.name || "N/A",
      r.role,
      r.purposeOfExpense || "N/A",
      r.expenseType || "N/A",
      r.expenseAmount || "N/A",
      r.fileUrl || "N/A",
      [...new Set(r.districtDetails?.map((d) => d.districtName) || [])].join(", ") || "N/A",
      r.schoolDetails?.map((s) => s.centerName).join(", ") || "N/A",
      r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
      r.status,
    ]),
  ]
    .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const BillDashboard = () => {
  // Context apis
  const { userData } = useContext(UserContext);
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext } = useContext(SchoolContext);
  const { classContext } = useContext(ClassContext);

  // State
  const [billsData, setBillsData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Fetch bills
  const FetchAllBillsData = async () => {
    try {
      const data = await getAllBillsWithUserDetails(); // {status, data: []}
      const filtered = (data.data || []).filter((bill) => bill.role === "CC" || bill.role === "ACI"); // Only CC and ACI
      setBillsData(filtered);
      console.log(data)
    } catch (error) {
      console.log("Error fetching bills data", error.message);
    }
  };

  useEffect(() => {
    FetchAllBillsData();
  }, []);

  // Apply filters
  const filteredData = billsData.filter((bill) => {
    const districtNames = bill.districtDetails?.map((d) => d.districtName) || [];
    return (
      (roleFilter === "All" || bill.role === roleFilter) &&
      (statusFilter === "All" || bill.status === statusFilter) &&
      (districtFilter === "All" || districtNames.includes(districtFilter))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Unique district and school lists for filters
  const uniqueDistricts = [
    ...new Set(billsData.flatMap((bill) => bill.districtDetails?.map((d) => d.districtName) || [])),
  ];
  const uniqueSchools = [
    ...new Set(billsData.flatMap((bill) => bill.schoolDetails?.map((s) => s.centerName) || [])),
  ];

  // Clear filters
  const clearFilters = () => {
    setRoleFilter("All");
    setStatusFilter("All");
    setDistrictFilter("All");
  };

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-sm p-3">
        <h3 className="mb-3">Bills Dashboard</h3>

        {/* Filters */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Filter by Role</Form.Label>
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="ACI">ACI</option>
                <option value="CC">CC</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Filter by Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Filter by District</Form.Label>
              <Form.Select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="All">All</option>
                {uniqueDistricts.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3} className="d-flex align-items-end mt-3">
            <Button
              variant="success"
              onClick={() => exportToCsv(filteredData)}
              className="me-2"
            >
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Bill ID</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Bill Image</th>
              <th>Bill Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((bill, index) => (
                <tr key={bill._id}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td>{bill._id}</td>
                  <td>{bill.userId}</td>
                  <td>{bill.userDetails?.name || "N/A"}</td>
                  <td>{bill.role}</td>
                  <td>
                    {bill.fileUrl ? (
                      <a
                        href={bill.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={bill.fileUrl}
                          alt="Bill"
                          thumbnail
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {bill.expenseDate
                      ? new Date(bill.expenseDate).toISOString().split("T")[0]
                      : ""}
                  </td>
                  <td>{bill.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No bills found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        )}
      </Card>
    </Container>
  );
};
