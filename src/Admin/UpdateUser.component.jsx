
// // src/components/CreateUser.jsx



// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Pagination,
//   Card,
// } from "react-bootstrap";
// import { getAllUsersWithAccess } from "../service/User.service";




// export const UpdateUser = () => {


//     //Hooks
//     const [name, setName] = useState("");
//     const [userId, setUserId] = useState("");
//     const [contact1, setContact1] = useState("");
//     const [contact2, setContact2] = useState("");
//     const [department, setDepartment] = useState("");
//     const [role, setRole] = useState("");   
//     const [isActive, setIsActive] = useState("");
//     const [page, setPage] = useState(""); 


//     const [users, setUsers] = useState([])

//     const fetchUser = async () =>{
// const reqQuery = {
//   page: page || 1,
// };

// if (name) reqQuery.name = name;
// if (userId) reqQuery.userId = userId;
// if (contact1) reqQuery.contact1 = contact1;
// if (contact2) reqQuery.contact2 = contact2;
// if (department) reqQuery.department = department;
// if (role) reqQuery.role = role;
// if (isActive) reqQuery.isActive = isActive;

//         try {

//             console.log(reqQuery)

//             const response = await getAllUsersWithAccess(reqQuery);

//             console.log(response.data)

//             setUsers(response.data)
//         } catch (error) {
//             console.log('Error fetching data')
//         }
//     }

//     useEffect(()=>{
//         fetchUser();
//     }, [])
  

//     return(
//         <div>
//             <br/>
//            <Table striped bordered hover>
//       <thead>

//          <tr>
//           <th>#</th>
//           <th>User Id</th>
//           <th>Name</th>
//           <th>Role</th>
//           <th>Department</th>
//         </tr> 
//       </thead>
//       <tbody>
//         {users.map((eachuser, index )=>{
//     return(
//         <tr key={eachuser._id}>
// <th>{index + 1}</th>
// <th>{eachuser.userId}</th>
// <th>{eachuser.name}</th>
// <th>{eachuser.role}</th>
// <th>{eachuser.department}</th>

//         </tr>
//     )
// })}
//       </tbody>
//     </Table>
//         </div>
//     )

// };














// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Pagination,
//   Card,
// } from "react-bootstrap";
// import { getAllUsersWithAccess } from "../service/User.service";

// export const UpdateUser = () => {
//   //Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);

//   const fetchUser = async () => {
//     const reqQuery = {
//       page: page || 1,
//     };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       console.log(reqQuery);

//       const response = await getAllUsersWithAccess(reqQuery);

//       console.log(response.data);

//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3} className="d-flex align-items-end">
//                 <Button type="submit" variant="primary" className="w-100">
//                   Apply Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Department</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => {
//               return (
//                 <tr key={eachuser._id}>
//                   <td>{index + 1}</td>
//                   <td>{eachuser.userId}</td>
//                   <td>{eachuser.name}</td>
//                   <td>{eachuser.role}</td>
//                   <td>{eachuser.department}</td>
                 
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       </Container>
//     </div>
//   );
// };

















// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,Pagination
// } from "react-bootstrap";
// import { getAllUsersWithAccess } from "../service/User.service";

// export const UpdateUser = () => {
//   // Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);





  

//   const fetchUser = async () => {
//     const reqQuery = { page: page || 1 };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       const response = await getAllUsersWithAccess(reqQuery);
//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   const handleClearFilters = () => {
//     setName("");
//     setUserId("");
//     setContact1("");
//     setContact2("");
//     setDepartment("");
//     setRole("");
//     setIsActive("");
//     setPage(1);
//     fetchUser();
//   };




//   //Pagination setup

// const handlePagination = (pageNumber)=>{
//     alert(pageNumber)
//     setPage(pageNumber)
// }


//   let active = 1;
// let items = [];
// for (let number = 1; number <= 5; number++) {
//   items.push(
//     <Pagination.Item key={number} active={number === active}
//     onClick={() => handlePagination(number)}>
//       {number}
       
//     </Pagination.Item>,
//   );
// }

// const paginationBasic = (
//   <div>
//     <Pagination >{items}</Pagination>
//     <br />
// {/* 
//     <Pagination size="lg">{items}</Pagination>
//     <br />

//     <Pagination size="sm">{items}</Pagination> */}
//   </div>
// );

// //-----------------------------

//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3} className="d-flex align-items-end gap-2">
//                 <Button type="submit" variant="primary" className="w-50">
//                   Apply Filters
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="w-50"
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Department</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => (
//               <tr key={eachuser._id}>
//                 <td>{index + 1}</td>
//                 <td>{eachuser.userId}</td>
//                 <td>{eachuser.name}</td>
//                 <td>{eachuser.role}</td>
//                 <td>{eachuser.department}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         <div>
//             {paginationBasic}
//         </div>

        
//       </Container>
//     </div>
//   );
// };














// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Pagination,
// } from "react-bootstrap";
// import { getAllUsersWithAccess } from "../service/User.service";

// export const UpdateUser = () => {
//   // Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1); // ✅ new state for total pages

//   const fetchUser = async () => {
//     const reqQuery = { page: page || 1 };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       const response = await getAllUsersWithAccess(reqQuery);

//       // ✅ extract pagination info
//       if (response.totalPages) {
//         setTotalPages(response.totalPages);
//       }

//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   const handleClearFilters = () => {
//     setName("");
//     setUserId("");
//     setContact1("");
//     setContact2("");
//     setDepartment("");
//     setRole("");
//     setIsActive("");
//     setPage(1);
//     fetchUser();
//   };

//   // Pagination setup
//   const handlePagination = (pageNumber) => {
//     setPage(pageNumber);
//   };

//   let items = [];
//   for (let number = 1; number <= totalPages; number++) {
//     items.push(
//       <Pagination.Item
//         key={number}
//         active={number === page}
//         onClick={() => handlePagination(number)}
//       >
//         {number}
//       </Pagination.Item>
//     );
//   }

//   const paginationBasic = (
//     <div className="d-flex justify-content-center">
//       <Pagination>{items}</Pagination>
//     </div>
//   );

//   //-----------------------------

//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3} className="d-flex align-items-end gap-2">
//                 <Button type="submit" variant="primary" className="w-50">
//                   Apply Filters
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="w-50"
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Department</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => (
//               <tr key={eachuser._id}>
//                 <td>{index + 1}</td>
//                 <td>{eachuser.userId}</td>
//                 <td>{eachuser.name}</td>
//                 <td>{eachuser.role}</td>
//                 <td>{eachuser.department}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       {/* ✅ Fixed pagination at bottom */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "0",
//           left: "0",
//           width: "100%",
//           background: "#fff",
//           padding: "10px 0",
//           borderTop: "1px solid #ddd",
//           zIndex: 1000,
//         }}
//       >
//         {paginationBasic}
//       </div>
//     </div>
//   );
// };



















// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Pagination,
// } from "react-bootstrap";
// import { getAllUsersWithAccess } from "../service/User.service";

// export const UpdateUser = () => {
//   // Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);

//   // Department -> Role mapping
//   const departmentRoles = {
//     Community: [
//       "CC",
//       "ACI",
//       "Community Incharge",
//       "Project Coordinator",
//       "Community Manager",
//       "Technician",
//     ],
//     Academics: ["Academic-Coordinator", "DTP", "Teacher"],
//     Admin: ["Admin"],
//     HR: ["HR Executive", "HR Manager"],
//     Media: ["Media Manager", "Photographer"],
//     Tech: ["MIS", "Data Analyst", "Tech Lead"],
//   };

//   const fetchUser = async () => {
//     const reqQuery = { page: page || 1 };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       const response = await getAllUsersWithAccess(reqQuery);

//       if (response.totalPages) {
//         setTotalPages(response.totalPages);
//       }

//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   const handleClearFilters = () => {
//     setName("");
//     setUserId("");
//     setContact1("");
//     setContact2("");
//     setDepartment("");
//     setRole("");
//     setIsActive("");
//     setPage(1);
//     fetchUser();
//   };

//   // Pagination setup
//   const handlePagination = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setPage(pageNumber);
//     }
//   };

//   const renderPagination = () => {
//     let items = [];

//     // Always show first
//     if (page > 2) {
//       items.push(
//         <Pagination.Item key={1} onClick={() => handlePagination(1)}>
//           1
//         </Pagination.Item>
//       );
//       if (page > 3) {
//         items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
//       }
//     }

//     // Middle range
//     for (
//       let number = Math.max(1, page - 1);
//       number <= Math.min(totalPages, page + 1);
//       number++
//     ) {
//       items.push(
//         <Pagination.Item
//           key={number}
//           active={number === page}
//           onClick={() => handlePagination(number)}
//         >
//           {number}
//         </Pagination.Item>
//       );
//     }

//     // Always show last
//     if (page < totalPages - 1) {
//       if (page < totalPages - 2) {
//         items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
//       }
//       items.push(
//         <Pagination.Item
//           key={totalPages}
//           onClick={() => handlePagination(totalPages)}
//         >
//           {totalPages}
//         </Pagination.Item>
//       );
//     }

//     return (
//       <Pagination className="mb-0">
//         <Pagination.Prev
//           onClick={() => handlePagination(page - 1)}
//           disabled={page === 1}
//         />
//         {items}
//         <Pagination.Next
//           onClick={() => handlePagination(page + 1)}
//           disabled={page === totalPages}
//         />
//       </Pagination>
//     );
//   };

//   //-----------------------------

//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     value={department}
//                     onChange={(e) => {
//                       setDepartment(e.target.value);
//                       setRole(""); // reset role when department changes
//                     }}
//                   >
//                     <option value="">All</option>
//                     {Object.keys(departmentRoles).map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     disabled={!department}
//                   >
//                     <option value="">All</option>
//                     {department &&
//                       departmentRoles[department]?.map((r) => (
//                         <option key={r} value={r}>
//                           {r}
//                         </option>
//                       ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3} className="d-flex align-items-end gap-2">
//                 <Button type="submit" variant="primary" className="w-50">
//                   Apply Filters
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="w-50"
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Department</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => (
//               <tr key={eachuser._id}>
//                 <td>{index + 1}</td>
//                 <td>{eachuser.userId}</td>
//                 <td>{eachuser.name}</td>
//                 <td>{eachuser.role}</td>
//                 <td>{eachuser.department}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       {/* ✅ Fixed pagination at bottom */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "0",
//           left: "0",
//           width: "100%",
//           background: "#fff",
//           padding: "10px 0",
//           borderTop: "1px solid #ddd",
//           zIndex: 1000,
//         }}
//       >
//         <div className="d-flex justify-content-center">
//           {renderPagination()}
//         </div>
//       </div>
//     </div>
//   );
// };
























// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Pagination,
// } from "react-bootstrap";
// import { getAllUsersWithAccess, updateUserWithAccess } from "../service/User.service";

// export const UpdateUser = () => {
//   // Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);

//   // Department -> Role mapping
//   const departmentRoles = {
//     Community: [
//       "CC",
//       "ACI",
//       "Community Incharge",
//       "Project Coordinator",
//       "Community Manager",
//       "Technician",
//     ],
//     Academics: ["Academic-Coordinator", "DTP", "Teacher"],
//     Admin: ["Admin"],
//     HR: ["HR Executive", "HR Manager"],
//     Media: ["Media Manager", "Photographer"],
//     Tech: ["MIS", "Data Analyst", "Tech Lead"],
//   };

//   const fetchUser = async () => {
//     const reqQuery = { page: page || 1 };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       const response = await getAllUsersWithAccess(reqQuery);

//       if (response.totalPages) {
//         setTotalPages(response.totalPages);
//       }

//       console.log(response.data)
//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   const handleClearFilters = () => {
//     setName("");
//     setUserId("");
//     setContact1("");
//     setContact2("");
//     setDepartment("");
//     setRole("");
//     setIsActive("");
//     setPage(1);
//     fetchUser();
//   };

//   // Pagination setup
//   const handlePagination = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setPage(pageNumber);
//     }
//   };

//   const renderPagination = () => {
//     let items = [];
//     const maxVisible = 10; // show max 10 pages in one view
//     const startPage = Math.floor((page - 1) / maxVisible) * maxVisible + 1;
//     const endPage = Math.min(startPage + maxVisible - 1, totalPages);

//     for (let number = startPage; number <= endPage; number++) {
//       items.push(
//         <Pagination.Item
//           key={number}
//           active={number === page}
//           onClick={() => handlePagination(number)}
//         >
//           {number}
//         </Pagination.Item>
//       );
//     }

//     return (
//       <Pagination className="mb-0">
//         <Pagination.Prev
//           onClick={() => handlePagination(page - 1)}
//           disabled={page === 1}
//         />
//         {items}
//         <Pagination.Next
//           onClick={() => handlePagination(page + 1)}
//           disabled={page === totalPages}
//         />
//       </Pagination>
//     );
//   };

//   //-----------------------------

//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     value={department}
//                     onChange={(e) => {
//                       setDepartment(e.target.value);
//                       setRole(""); // reset role when department changes
//                     }}
//                   >
//                     <option value="">All</option>
//                     {Object.keys(departmentRoles).map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     disabled={!department}
//                   >
//                     <option value="">All</option>
//                     {department &&
//                       departmentRoles[department]?.map((r) => (
//                         <option key={r} value={r}>
//                           {r}
//                         </option>
//                       ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3} className="d-flex align-items-end gap-2">
//                 <Button type="submit" variant="primary" className="w-50">
//                   Apply Filters
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="w-50"
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Department</th>
//               <th>Role</th>
//               <th>Contact</th>
              
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => (
//               <tr key={eachuser._id}>
//                 <td>{index + 1}</td>
//                 <td>{eachuser.userId}</td>
//                 <td>{eachuser.name}</td>
//                 <td>{eachuser.department}</td>
//                 <td>{eachuser.role}</td>
//                 <td>{eachuser.contact1}</td>
                
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       {/* ✅ Normal pagination at bottom */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "0",
//           left: "0",
//           width: "100%",
//           background: "#fff",
//           padding: "10px 0",
//           borderTop: "1px solid #ddd",
//           zIndex: 1000,
//         }}
//       >
//         <div className="d-flex justify-content-center">
//           {renderPagination()}
//         </div>
//       </div>
//     </div>
//   );
// };


























// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Pagination,
//   Modal,
// } from "react-bootstrap";
// import {
//   getAllUsersWithAccess,
//   updateUserWithAccess,
// } from "../service/User.service";

// export const UpdateUser = () => {
//   // Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);

//   // Department -> Role mapping
//   const departmentRoles = {
//     Community: [
//       "CC",
//       "ACI",
//       "Community Incharge",
//       "Project Coordinator",
//       "Community Manager",
//       "Technician",
//     ],
//     Academics: ["Academic-Coordinator", "DTP", "Teacher"],
//     Admin: ["Admin"],
//     HR: ["HR Executive", "HR Manager"],
//     Media: ["Media Manager", "Photographer"],
//     Tech: ["MIS", "Data Analyst", "Tech Lead"],
//   };

//   const fetchUser = async () => {
//     const reqQuery = { page: page || 1 };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       const response = await getAllUsersWithAccess(reqQuery);

//       if (response.totalPages) {
//         setTotalPages(response.totalPages);
//       }

//       console.log(response.data);
//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   const handleClearFilters = () => {
//     setName("");
//     setUserId("");
//     setContact1("");
//     setContact2("");
//     setDepartment("");
//     setRole("");
//     setIsActive("");
//     setPage(1);
//     fetchUser();
//   };

//   // Pagination setup
//   const handlePagination = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setPage(pageNumber);
//     }
//   };

//   const renderPagination = () => {
//     let items = [];
//     const maxVisible = 10; // show max 10 pages in one view
//     const startPage = Math.floor((page - 1) / maxVisible) * maxVisible + 1;
//     const endPage = Math.min(startPage + maxVisible - 1, totalPages);

//     for (let number = startPage; number <= endPage; number++) {
//       items.push(
//         <Pagination.Item
//           key={number}
//           active={number === page}
//           onClick={() => handlePagination(number)}
//         >
//           {number}
//         </Pagination.Item>
//       );
//     }

//     return (
//       <Pagination className="mb-0">
//         <Pagination.Prev
//           onClick={() => handlePagination(page - 1)}
//           disabled={page === 1}
//         />
//         {items}
//         <Pagination.Next
//           onClick={() => handlePagination(page + 1)}
//           disabled={page === totalPages}
//         />
//       </Pagination>
//     );
//   };

//   //-----------------------------
//   // ✅ Edit Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   const handleEditClick = (user) => {
//     setEditingUser({
//       ...user,
//       isActive: user.isActive ? "true" : "false", // store as string for form
//     });
//     setShowModal(true);
//   };

//   const handleModalChange = (e) => {
//     const { name, value } = e.target;
//     setEditingUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingUser) return;

//     try {
//       const reqBody = {
//         _id: editingUser._id,
//         userData: {
//           name: editingUser.name,
//           email: editingUser.email,
//           contact1: editingUser.contact1,
//           contact2: editingUser.contact2,
//           department: editingUser.department,
//           role: editingUser.role,
//           isActive: editingUser.isActive === "true",
//         },
//       };

//       await updateUserWithAccess(reqBody);
//       setShowModal(false);
//       fetchUser();
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   //-----------------------------

//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     value={department}
//                     onChange={(e) => {
//                       setDepartment(e.target.value);
//                       setRole(""); // reset role when department changes
//                     }}
//                   >
//                     <option value="">All</option>
//                     {Object.keys(departmentRoles).map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     disabled={!department}
//                   >
//                     <option value="">All</option>
//                     {department &&
//                       departmentRoles[department]?.map((r) => (
//                         <option key={r} value={r}>
//                           {r}
//                         </option>
//                       ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3} className="d-flex align-items-end gap-2">
//                 <Button type="submit" variant="primary" className="w-50">
//                   Apply Filters
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="w-50"
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Department</th>
//               <th>Role</th>
//               <th>Contact</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => (
//               <tr key={eachuser._id}>
//                 <td>{index + 1}</td>
//                 <td>{eachuser.userId}</td>
//                 <td>{eachuser.name}</td>
//                 <td>{eachuser.department}</td>
//                 <td>{eachuser.role}</td>
//                 <td>{eachuser.contact1}</td>
//                 <td>
//                   <Button
//                     variant="warning"
//                     size="sm"
//                     onClick={() => handleEditClick(eachuser)}
//                   >
//                     Edit
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       {/* ✅ Normal pagination at bottom */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "0",
//           left: "0",
//           width: "100%",
//           background: "#fff",
//           padding: "10px 0",
//           borderTop: "1px solid #ddd",
//           zIndex: 1000,
//         }}
//       >
//         <div className="d-flex justify-content-center">{renderPagination()}</div>
//       </div>

//       {/* ✅ Edit Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleUpdateSubmit}>
//           <Modal.Body>
//             {editingUser && (
//               <>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     value={editingUser.name}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={editingUser.email}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="contact1"
//                     value={editingUser.contact1}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="contact2"
//                     value={editingUser.contact2}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     name="department"
//                     value={editingUser.department}
//                     onChange={handleModalChange}
//                   >
//                     {Object.keys(departmentRoles).map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Role</Form.Label>
//                   <Form.Select
//                     name="role"
//                     value={editingUser.role}
//                     onChange={handleModalChange}
//                   >
//                     {departmentRoles[editingUser.department]?.map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     name="isActive"
//                     value={editingUser.isActive}
//                     onChange={handleModalChange}
//                   >
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>

//                  {/* <h3>User Access</h3>
//              <hr></hr>




//              <Form.Group className="mb-3">
//                   <Form.Label>Class</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     value={editingUser.access.classId}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>

//                 {editingUser.access.region.map((eachRegion, index)=>{
//                     return(
//                         <Form.Group className="mb-3">
//                   <Form.Label>Region</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={eachRegion.districtId}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>     
//                     )

//                 })} */}
                      




//               </>
//             )}

             

            


             
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="primary">
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };


























// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Pagination,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select"; // ✅ react-select for multi dropdowns
// import {
//   getAllUsersWithAccess,
//   updateUserWithAccess,
// } from "../service/User.service";
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json"

// export const UpdateUser = () => {

// console.log(DistrictBlockSchool)


//   // -----------------------------
//   // Hooks
//   const [name, setName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [contact1, setContact1] = useState("");
//   const [contact2, setContact2] = useState("");
//   const [department, setDepartment] = useState("");
//   const [role, setRole] = useState("");
//   const [isActive, setIsActive] = useState("");
//   const [page, setPage] = useState(1);

//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);

//   // -----------------------------
//   // Department -> Role mapping
//   const departmentRoles = {
//     Community: [
//       "CC",
//       "ACI",
//       "Community Incharge",
//       "Project Coordinator",
//       "Community Manager",
//       "Technician",
//     ],
//     Academics: ["Academic-Coordinator", "DTP", "Teacher"],
//     Admin: ["Admin"],
//     HR: ["HR Executive", "HR Manager"],
//     Media: ["Media Manager", "Photographer"],
//     Tech: ["MIS", "Data Analyst", "Tech Lead"],
//   };

//   // -----------------------------
//   // Fetch Users
//   const fetchUser = async () => {
//     const reqQuery = { page: page || 1 };

//     if (name) reqQuery.name = name;
//     if (userId) reqQuery.userId = userId;
//     if (contact1) reqQuery.contact1 = contact1;
//     if (contact2) reqQuery.contact2 = contact2;
//     if (department) reqQuery.department = department;
//     if (role) reqQuery.role = role;
//     if (isActive) reqQuery.isActive = isActive;

//     try {
//       const response = await getAllUsersWithAccess(reqQuery);
//       if (response.totalPages) setTotalPages(response.totalPages);
//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchUser();
//   };

//   const handleClearFilters = () => {
//     setName("");
//     setUserId("");
//     setContact1("");
//     setContact2("");
//     setDepartment("");
//     setRole("");
//     setIsActive("");
//     setPage(1);
//     fetchUser();
//   };

//   // -----------------------------
//   // Pagination setup
//   const handlePagination = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setPage(pageNumber);
//     }
//   };

//   const renderPagination = () => {
//     let items = [];
//     const maxVisible = 10;
//     const startPage = Math.floor((page - 1) / maxVisible) * maxVisible + 1;
//     const endPage = Math.min(startPage + maxVisible - 1, totalPages);

//     for (let number = startPage; number <= endPage; number++) {
//       items.push(
//         <Pagination.Item
//           key={number}
//           active={number === page}
//           onClick={() => handlePagination(number)}
//         >
//           {number}
//         </Pagination.Item>
//       );
//     }

//     return (
//       <Pagination className="mb-0">
//         <Pagination.Prev
//           onClick={() => handlePagination(page - 1)}
//           disabled={page === 1}
//         />
//         {items}
//         <Pagination.Next
//           onClick={() => handlePagination(page + 1)}
//           disabled={page === totalPages}
//         />
//       </Pagination>
//     );
//   };

//   // -----------------------------
//   // ✅ Edit Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   const handleEditClick = (user) => {
//     setEditingUser({
//       ...user,
//       isActive: user.isActive ? "true" : "false",
//     });
//     setShowModal(true);
//   };

//   const handleModalChange = (e) => {
//     const { name, value } = e.target;
//     setEditingUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // -----------------------------
//   // ✅ Submit Update
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingUser) return;

//     try {
//       const reqBody = {
//         _id: editingUser._id,
//         userData: {
//           name: editingUser.name,
//           email: editingUser.email,
//           contact1: editingUser.contact1,
//           contact2: editingUser.contact2,
//           department: editingUser.department,
//           role: editingUser.role,
//           isActive: editingUser.isActive === "true",
//         },
//         userAccess: {
//           classId: editingUser.access.classId || [],
//           modules: editingUser.access.modules || [],
//           region: editingUser.access.region || [],
//         },
//       };


//       console.log(reqBody)
//       await updateUserWithAccess(reqBody);
//       setShowModal(false);
//       fetchUser();
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   // -----------------------------
//   // JSX
//   return (
//     <div>
//       <br />
//       <Container>
//         <Card className="p-3 mb-4">
//           {/* 🔍 Filters */}
//           <Form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>User ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact1}
//                     onChange={(e) => setContact1(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={contact2}
//                     onChange={(e) => setContact2(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     value={department}
//                     onChange={(e) => {
//                       setDepartment(e.target.value);
//                       setRole("");
//                     }}
//                   >
//                     <option value="">All</option>
//                     {Object.keys(departmentRoles).map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Role</Form.Label>
//                   <Form.Select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     disabled={!department}
//                   >
//                     <option value="">All</option>
//                     {department &&
//                       departmentRoles[department]?.map((r) => (
//                         <option key={r} value={r}>
//                           {r}
//                         </option>
//                       ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     value={isActive}
//                     onChange={(e) => setIsActive(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={3} className="d-flex align-items-end gap-2">
//                 <Button type="submit" variant="primary" className="w-50">
//                   Apply Filters
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="w-50"
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         {/* 📋 Users Table */}
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>User Id</th>
//               <th>Name</th>
//               <th>Department</th>
//               <th>Role</th>
//               <th>Contact</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((eachuser, index) => (
//               <tr key={eachuser._id}>
//                 <td>{index + 1}</td>
//                 <td>{eachuser.userId}</td>
//                 <td>{eachuser.name}</td>
//                 <td>{eachuser.department}</td>
//                 <td>{eachuser.role}</td>
//                 <td>{eachuser.contact1}</td>
//                 <td>
//                   <Button
//                     variant="warning"
//                     size="sm"
//                     onClick={() => handleEditClick(eachuser)}
//                   >
//                     Edit
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       {/* 📌 Pagination */}
//       <div
//         style={{
//           position: "fixed",
//           bottom: "0",
//           left: "0",
//           width: "100%",
//           background: "#fff",
//           padding: "10px 0",
//           borderTop: "1px solid #ddd",
//           zIndex: 1000,
//         }}
//       >
//         <div className="d-flex justify-content-center">{renderPagination()}</div>
//       </div>

//       {/* ✨ Edit Modal with Access */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleUpdateSubmit}>
//           <Modal.Body>
//             {editingUser && (
//               <>
//                 {/* --- User Info --- */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     value={editingUser.name}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={editingUser.email}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Contact1</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="contact1"
//                     value={editingUser.contact1}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Contact2</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="contact2"
//                     value={editingUser.contact2}
//                     onChange={handleModalChange}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     name="department"
//                     value={editingUser.department}
//                     onChange={handleModalChange}
//                   >
//                     {Object.keys(departmentRoles).map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Role</Form.Label>
//                   <Form.Select
//                     name="role"
//                     value={editingUser.role}
//                     onChange={handleModalChange}
//                   >
//                     {departmentRoles[editingUser.department]?.map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Is Active</Form.Label>
//                   <Form.Select
//                     name="isActive"
//                     value={editingUser.isActive}
//                     onChange={handleModalChange}
//                   >
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>

//                 {/* --- User Access --- */}
//                 <h4 className="mt-4">User Access</h4>
//                 <hr />

//                 {/* ✅ Classes Checkboxes */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Classes</Form.Label>
//                   <div>
//                     {[ "9", "10"].map((cls) => (
//                       <Form.Check
//                         inline
//                         key={cls}
//                         type="checkbox"
//                         label={`Class ${cls}`}
//                         checked={editingUser.access.classId?.includes(cls)}
//                         onChange={(e) => {
//                           const checked = e.target.checked;
//                           setEditingUser((prev) => {
//                             const classIds = prev.access.classId || [];
//                             let updatedClassIds = checked
//                               ? [...classIds, cls]
//                               : classIds.filter((c) => c !== cls);
//                             return {
//                               ...prev,
//                               access: { ...prev.access, classId: updatedClassIds },
//                             };
//                           });
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </Form.Group>
                

//                 {/* ✅ Modules Access */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Modules</Form.Label>
//                   {editingUser.access.modules?.map((mod, idx) => (
//                     <Row key={idx} className="mb-2">
//                       <Col md={6}>
//                         <Form.Control
//                           type="text"
//                           value={mod.name}
//                           disabled
//                         />
//                       </Col>
//                       <Col md={6}>
//                         <Form.Select
//                           value={mod.accessLevel}
//                           onChange={(e) => {
//                             const newVal = e.target.value;
//                             setEditingUser((prev) => {
//                               const newModules = [...prev.access.modules];
//                               newModules[idx].accessLevel = newVal;
//                               return {
//                                 ...prev,
//                                 access: { ...prev.access, modules: newModules },
//                               };
//                             });
//                           }}
//                         >
//                           {["create", "read", "write", "delete", "admin"].map(
//                             (lvl) => (
//                               <option key={lvl} value={lvl}>
//                                 {lvl}
//                               </option>
//                             )
//                           )}
//                         </Form.Select>
//                       </Col>
//                     </Row>
//                   ))}
//                 </Form.Group>

//                 {/* ✅ Region Access with react-select */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Regions</Form.Label>
//                   {editingUser.access.region?.map((region, idx) => (
//                     <div key={idx} className="border p-2 mb-2 rounded">
//                       <Form.Label>District</Form.Label>
//                       <Form.Control
//                         type="text"
//                         value={region.districtId}
//                         onChange={(e) => {
//                           const newVal = e.target.value;
//                           setEditingUser((prev) => {
//                             const newRegions = [...prev.access.region];
//                             newRegions[idx].districtId = newVal;
//                             return {
//                               ...prev,
//                               access: { ...prev.access, region: newRegions },
//                             };
//                           });
//                         }}
//                       />
//                       {region.blockIds?.map((block, bIdx) => (
//                         <div key={bIdx} className="ms-3 mt-2">
//                           <Form.Label>Block</Form.Label>
//                           <Form.Control
//                             type="text"
//                             value={block.blockId}
//                             onChange={(e) => {
//                               const newVal = e.target.value;
//                               setEditingUser((prev) => {
//                                 const newRegions = [...prev.access.region];
//                                 newRegions[idx].blockIds[bIdx].blockId = newVal;
//                                 return {
//                                   ...prev,
//                                   access: { ...prev.access, region: newRegions },
//                                 };
//                               });
//                             }}
//                           />
//                           <Form.Label>Schools</Form.Label>
//                           <Select
//                             isMulti
//                             value={block.schoolIds.map((s) => ({
//                               value: s.schoolId,
//                               label: s.schoolId,
//                             }))}
//                             onChange={(selected) => {
//                               setEditingUser((prev) => {
//                                 const newRegions = [...prev.access.region];
//                                 newRegions[idx].blockIds[bIdx].schoolIds =
//                                   selected.map((s) => ({ schoolId: s.value }));
//                                 return {
//                                   ...prev,
//                                   access: { ...prev.access, region: newRegions },
//                                 };
//                               });
//                             }}
//                             options={[
//                               { value: "50000", label: "50000" },
//                               { value: "50001", label: "50001" },
//                               { value: "50002", label: "50002" },
//                             ]}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </Form.Group>
//               </>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="primary">
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };
































// src/components/UsersList.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Pagination,
  Modal,
} from "react-bootstrap";
import Select from "react-select"; // ✅ react-select for multi dropdowns
import {
  getAllUsersWithAccess,
  updateUserWithAccess,
} from "../service/User.service";
import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json"

export const UpdateUser = () => {




  // -----------------------------
  // Hooks
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // -----------------------------
  // Department -> Role mapping
  const departmentRoles = {
    Community: [
      "CC",
      "ACI",
      "Community Incharge",
      "Project Coordinator",
      "Community Manager",
      "Technician",
    ],
    Academics: ["Academic-Coordinator", "DTP", "Teacher"],
    Admin: ["Admin"],
    HR: ["HR Executive", "HR Manager"],
    Media: ["Media Manager", "Photographer"],
    Tech: ["MIS", "Data Analyst", "Tech Lead"],
  };

  // -----------------------------
  // Fetch Users
  const fetchUser = async () => {
    const reqQuery = { page: page || 1 };

    if (name) reqQuery.name = name;
    if (userId) reqQuery.userId = userId;
    if (contact1) reqQuery.contact1 = contact1;
    if (contact2) reqQuery.contact2 = contact2;
    if (department) reqQuery.department = department;
    if (role) reqQuery.role = role;
    if (isActive) reqQuery.isActive = isActive;

    try {
      const response = await getAllUsersWithAccess(reqQuery);
      if (response.totalPages) setTotalPages(response.totalPages);


      //Console logging my users data.

      console.log(response.data)


      setUsers(response.data || []);
    
    } catch (error) {
      console.log("Error fetching data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUser();
  };

  const handleClearFilters = () => {
    setName("");
    setUserId("");
    setContact1("");
    setContact2("");
    setDepartment("");
    setRole("");
    setIsActive("");
    setPage(1);
    fetchUser();
  };

  // -----------------------------
  // Pagination setup
  const handlePagination = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const renderPagination = () => {
    let items = [];
    const maxVisible = 10;
    const startPage = Math.floor((page - 1) / maxVisible) * maxVisible + 1;
    const endPage = Math.min(startPage + maxVisible - 1, totalPages);

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => handlePagination(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mb-0">
        <Pagination.Prev
          onClick={() => handlePagination(page - 1)}
          disabled={page === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePagination(page + 1)}
          disabled={page === totalPages}
        />
      </Pagination>
    );
  };



  //Handle edit click

  //Hooks for showing modal
  const [showEditModal, setShowEditModal] = useState(false)
  
  //Stroing fetched-to-be-edited object in a hook.
  
  const [userObjectToBeEdited, setUserObjectToBeEdited] = useState([])

  //These hooks will store the values that is to be edited.

  const [updatedUserId, setUpdatedUserId] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedContact1, setUpdatedContact1] = useState("");
  const [updatedContact2, setUpdatedContact2]= useState("");
  const [updatedDepartment, setUpdatedDepartment] = useState("");
  const [updatedRole, setUpdatedRole] = useState("");
  const [updatedIsActive, setUpdatedIsActive] = useState("");

  const [updatedClassId, setUpdatedClassId] = useState([])
  const [updatedModules, setUpdatedModules] = useState([]);
  const [updatedRegion, setUpdatedRegion] = useState([]);

  const [access, setAccess] = useState({})



  const handleEditClick = async (e)=>{




  //I will fetch the data of passed id of user using api: getAllUsersWithAccess

  const reqQuery = { page: page || 1, userId: e.target.id };

  
    // if (userId) reqQuery.userId = userId;
   

  const response = await getAllUsersWithAccess(reqQuery)


  console.log(response.data[0])


  setUserObjectToBeEdited(response.data[0] || [])

  //UPDATING HOOKS FOR PREFILLED
  setUpdatedUserId(response.data[0].userId);
  setUpdatedName(response.data[0].name);
  setUpdatedEmail(response.data[0].email);
  setUpdatedContact1(response.data[0].contact1);
  setUpdatedContact2(response.data[0].contact2);
  setUpdatedDepartment(response.data[0].department);
  setUpdatedRole(response.data[0].role);
  setUpdatedIsActive(response.data[0].isActive);
  setUpdatedClassId(response.data[0].access.classId) //['9', '10']
  setUpdatedModules(response.data[0].access.modules)
   setUpdatedRegion(response.data[0].access.region)
  setAccess(response.data[0].access);


    setShowEditModal(true)
   
  }

  const handleClose = ()=>{

    setShowEditModal(false)
  }
  



const moduleOptions = [
  { value: "Academics", label: "Academics" },
  { value: "Bills", label: "Bills" },
  { value: "Downloads", label: "Downloads" },
  { value: "Callings", label: "Callings" },
];

const permissionOptions = [
  { value: "create", label: "create" },
  { value: "read", label: "read" },
  { value: "updated", label: "update" },
  { value: "delete", label: "delete" },
  { value: "admin", label: "admin" },
];



// ✅ Step 1: Flatten all schoolIds from arrayOfHeaven
const heavenSchoolIds = updatedRegion.flatMap(d =>
  d.blockIds.flatMap(b =>
    b.schoolIds.map(s => s.schoolId)
  )
);


// ✅ Step 2: Filter DistrictBlockSchool objects that match these schoolIds
const matchedSchools = DistrictBlockSchool.filter(s =>
  heavenSchoolIds.includes(s.schoolId)
);

console.log("Matched schools:", matchedSchools);




//PREFILLED DISTRICTS
const groupByDistrict = (schools) => {
  const grouped = {};
  schools.forEach((s) => {
    if (!grouped[s.districtId]) {
      grouped[s.districtId] = {
        districtId: s.districtId,
        districtName: s.districtName,
        blocks: {},
      };
    }
    if (!grouped[s.districtId].blocks[s.blockId]) {
      grouped[s.districtId].blocks[s.blockId] = {
        blockId: s.blockId,
        blockName: s.blockName,
        schools: [],
      };
    }
    grouped[s.districtId].blocks[s.blockId].schools.push({
      schoolId: s.schoolId,
      schoolName: s.schoolName,
    });
  });
  return Object.values(grouped);
};




 const districts = groupByDistrict(matchedSchools);



  // JSX
  return (
    <div>
      <br></br>
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>User Id</th>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((eachuser, index) => {
              return (
                <tr key={index} id={eachuser._id}>
                  <td>{index + 1}</td>
                  <td>{eachuser.userId}</td>
                  <td>{eachuser.name}</td>
                  <td>{eachuser.role}</td>
                  <td>{eachuser.department}</td>
                  <td>{eachuser.contact1}</td>
                  <td>
                    <Button
                      id={eachuser.userId}
                      onClick={(e) => handleEditClick(e)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      {/* Edit modal */}

      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>userId</Form.Label>
              <Form.Control
                type="text"
                value={updatedUserId}
                onChange={(e) => setUpdatedUserId(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>email</Form.Label>
              <Form.Control
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Contact 1</Form.Label>
              <Form.Control
                type="email"
                value={updatedContact1}
                onChange={(e) => setUpdatedContact1(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Contact 2</Form.Label>
              <Form.Control
                type="email"
                value={updatedContact2}
                onChange={(e) => setUpdatedContact2(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="email"
                value={updatedDepartment}
                onChange={(e) => setUpdatedDepartment(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="email"
                value={updatedRole}
                onChange={(e) => setUpdatedRole(e.target.value)}
              />
            </Form.Group>

            {/* d */}
            <hr></hr>
            <h3>User Access</h3>
            <hr></hr>

           <Form.Label>Class</Form.Label>
            <Form>
              {['9', '10'].map((type) => (
                <div key={`${type}`} className="mb-3">
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    id={`${type}`}
                    label={`Class ${type}`}
                    checked = {updatedClassId.includes(type)}
                  />
                </div>
              ))}
            </Form>

<Form.Label></Form.Label>
<Form>
  <Table>
    <thead>
      <tr>
        <th>Module</th>
        <th>Permission</th>
      </tr>
    </thead>
    <tbody>
      {updatedModules.map((mod, idx) => (
        <tr key={idx}>
          <td>
            <Select
              options={moduleOptions}
              value={moduleOptions.find(o => o.value === mod.name)}
              onChange={(selected) => {
                const newMods = [...updatedModules];
                newMods[idx].name = selected.value;
                setUpdatedModules(newMods);
              }}
            />
          </td>
          <td>
            <Select
              options={permissionOptions}
              value={permissionOptions.find(o => o.value === mod.accessLevel)}
              onChange={(selected) => {
                const newMods = [...updatedModules];
                newMods[idx].accessLevel = selected.value;
                setUpdatedModules(newMods);
              }}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>

  <Button
    type="button"
    onClick={() =>
      setUpdatedModules([...updatedModules, { name: "", accessLevel: "" }])
    }
  >
    + Add More
  </Button>
</Form>
    
    <Form.Label>Region</Form.Label>
    <Form>
      <Table bordered>
        <thead>
          <tr>
            <td>District</td>
            <td>Blocks</td>
            <td>Schools</td>
          </tr>
        </thead>
        <tbody>
          {districts.map((district, index) => {
            // Options for dropdowns
            const districtOption = {
              value: district.districtId,
              label: district.districtName,
            };

            const blockOptions = Object.values(district.blocks).map((b) => ({
              value: b.blockId,
              label: b.blockName,
            }));

            const schoolOptions = Object.values(district.blocks).flatMap((b) =>
              b.schools.map((s) => ({
                value: s.schoolId,
                label: s.schoolName,
              }))
            );

            return (
              <tr key={index}>
                {/* District Dropdown (single select, prefilled) */}
                <td>
                  <Select
                    value={districtOption}
                    options={[districtOption]}
                    isDisabled // District is fixed
                  />
                </td>

                {/* Block Dropdown (multi select) */}
                <td>
                  <Select
                    isMulti
                    options={blockOptions}
                    defaultValue={blockOptions} // preselect all blocks
                  />
                </td>

                {/* School Dropdown (multi select) */}
                <td>
                  <Select
                    isMulti
                    options={schoolOptions}
                    defaultValue={schoolOptions} // preselect all schools
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Form>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
