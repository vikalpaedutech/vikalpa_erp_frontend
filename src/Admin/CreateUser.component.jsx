// //src/Admin/CreateUser.component.jsx
// //This component will allow admin to create, delete, give permission to users.



// import React, {useState, useEffect} from "react";
// import { createUser, setUserAccess } from "../service/User.service";
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json"


// export const CreateUser =  () => {



//     return (
//         <div>
//             <h1>Add user</h1>
//         </div>
//     )
// }







// // src/components/CreateUser.jsx
// import React, { useState, useEffect } from "react";
// import { createUser, setUserAccess } from "../service/User.service";

// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
// import { Container, Form, Button, Row, Col, Card, Table } from "react-bootstrap";

// export const CreateUser = () => {
//   const [userData, setUserData] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     password: "",
//     contact1: "",
//     contact2: "",
//     department: "",
//     role: "",
//     isActive: true,
//   });

//   const [modules, setModules] = useState([]);
//   const [region, setRegion] = useState([]);
//   const [classIds, setClassIds] = useState([]);

//   // District/Block/School dropdown states
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedBlock, setSelectedBlock] = useState("");
//   const [selectedSchool, setSelectedSchool] = useState("");

//   // Handle form input change
//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   // Handle module selection
//   const addModule = () => {
//     setModules([...modules, { name: "Academics", accessLevel: "read" }]);
//   };

//   const updateModule = (index, field, value) => {
//     const updated = [...modules];
//     updated[index][field] = value;
//     setModules(updated);
//   };

//   // Handle region selection
//   const addRegion = () => {
//     if (!selectedDistrict || !selectedBlock || !selectedSchool) return;
//     const newRegion = {
//       districtId: selectedDistrict,
//       blockIds: [
//         {
//           blockId: selectedBlock,
//           schoolIds: [{ schoolId: selectedSchool }],
//         },
//       ],
//     };
//     setRegion([...region, newRegion]);
//     setSelectedDistrict("");
//     setSelectedBlock("");
//     setSelectedSchool("");
//   };

//   // Handle class selection
//   const toggleClass = (classId) => {
//     if (classIds.includes(classId)) {
//       setClassIds(classIds.filter((id) => id !== classId));
//     } else {
//       setClassIds([...classIds, classId]);
//     }
//   };

//   // Handle final submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // 1. Create user
//       const userRes = await createUser(userData);
//       const user = userRes.data;

//       // 2. Assign access
//       const accessReq = {
//         unqObjectId: user._id,
//         userId: user.userId,
//         modules,
//         region,
//         classId: classIds,
//       };

//       await setUserAccess(accessReq);

//       alert("User and access created successfully!");
//       setUserData({
//         userId: "",
//         name: "",
//         email: "",
//         password: "",
//         contact1: "",
//         contact2: "",
//         department: "",
//         role: "",
//         isActive: true,
//       });
//       setModules([]);
//       setRegion([]);
//       setClassIds([]);
//     } catch (err) {
//       console.error(err);
//       alert("Error creating user or access");
//     }
//   };

//   // Unique districts
//   const districts = [...new Map(DistrictBlockSchool.map((d) => [d.districtId, d])).values()];
//   const blocks = DistrictBlockSchool.filter((d) => d.districtId === selectedDistrict);
//   const schools = DistrictBlockSchool.filter((d) => d.blockId === selectedBlock);

//   return (
//     <Container className="my-4">
//       <Card className="p-4 shadow-lg rounded-3">
//         <h2>Add User</h2>
//         <Form onSubmit={handleSubmit}>
//           {/* User Info */}
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>User ID</Form.Label>
//                 <Form.Control
//                   name="userId"
//                   value={userData.userId}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={userData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 1</Form.Label>
//                 <Form.Control
//                   name="contact1"
//                   value={userData.contact1}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 2</Form.Label>
//                 <Form.Control
//                   name="contact2"
//                   value={userData.contact2}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Department</Form.Label>
//                 <Form.Control
//                   name="department"
//                   value={userData.department}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Control
//                   name="role"
//                   value={userData.role}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Module Access */}
//           <h5>Module Access</h5>
//           {modules.map((mod, idx) => (
//             <Row key={idx} className="mb-2">
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.name}
//                   onChange={(e) => updateModule(idx, "name", e.target.value)}
//                 >
//                   <option value="Academics">Academics</option>
//                   <option value="Accounts">Accounts</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.accessLevel}
//                   onChange={(e) => updateModule(idx, "accessLevel", e.target.value)}
//                 >
//                   <option value="read">Read</option>
//                   <option value="create">Create</option>
//                   <option value="write">Write</option>
//                   <option value="delete">Delete</option>
//                   <option value="admin">Admin</option>
//                 </Form.Select>
//               </Col>
//             </Row>
//           ))}
//           <Button variant="secondary" onClick={addModule} className="mb-3">
//             + Add Module
//           </Button>

//           {/* Region Access */}
//           <h5>Region Access</h5>
//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Select
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//               >
//                 <option value="">Select District</option>
//                 {districts.map((d) => (
//                   <option key={d.districtId} value={d.districtId}>
//                     {d.districtName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//             <Col md={4}>
//               <Form.Select
//                 value={selectedBlock}
//                 onChange={(e) => setSelectedBlock(e.target.value)}
//               >
//                 <option value="">Select Block</option>
//                 {blocks.map((b) => (
//                   <option key={b.blockId} value={b.blockId}>
//                     {b.blockName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//             <Col md={4}>
//               <Form.Select
//                 value={selectedSchool}
//                 onChange={(e) => setSelectedSchool(e.target.value)}
//               >
//                 <option value="">Select School</option>
//                 {schools.map((s) => (
//                   <option key={s.schoolId} value={s.schoolId}>
//                     {s.schoolName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//           </Row>
//           <Button variant="secondary" onClick={addRegion} className="mb-3">
//             + Add Region
//           </Button>

//           {region.length > 0 && (
//             <Table striped bordered>
//               <thead>
//                 <tr>
//                   <th>District</th>
//                   <th>Block</th>
//                   <th>School</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {region.map((r, idx) =>
//                   r.blockIds.map((b) =>
//                     b.schoolIds.map((s) => (
//                       <tr key={idx + s.schoolId}>
//                         <td>{r.districtId}</td>
//                         <td>{b.blockId}</td>
//                         <td>{s.schoolId}</td>
//                       </tr>
//                     ))
//                   )
//                 )}
//               </tbody>
//             </Table>
//           )}

//           {/* Class Access */}
//           <h5>Class Access</h5>
//           <div className="mb-3">
//             {["8", "9", "10", "11", "12"].map((c) => (
//               <Form.Check
//                 inline
//                 key={c}
//                 label={`Class ${c}`}
//                 type="checkbox"
//                 checked={classIds.includes(c)}
//                 onChange={() => toggleClass(c)}
//               />
//             ))}
//           </div>

//           <Button type="submit" variant="primary">
//             Save User
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };



























// // src/components/CreateUser.jsx
// import React, { useState } from "react";
// import { createUser, setUserAccess } from "../service/User.service";
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
// import { Container, Form, Button, Row, Col, Card, Table } from "react-bootstrap";
// import Select from "react-select";

// export const CreateUser = () => {
//   const [userData, setUserData] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     password: "",
//     contact1: "",
//     contact2: "",
//     department: "",
//     role: "",
//     isActive: true,
//   });

//   const [modules, setModules] = useState([]);
//   const [region, setRegion] = useState([]);
//   const [classIds, setClassIds] = useState([]);

//   // District/Block/School dropdown states
//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedBlocks, setSelectedBlocks] = useState([]);
//   const [selectedSchools, setSelectedSchools] = useState([]);

//   // Handle form input change
//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   // Handle module selection
//   const addModule = () => {
//     setModules([...modules, { name: "Academics", accessLevel: "read" }]);
//   };

//   const updateModule = (index, field, value) => {
//     const updated = [...modules];
//     updated[index][field] = value;
//     setModules(updated);
//   };

//   // Handle region selection
//   const addRegion = () => {
//     if (selectedDistricts.length === 0 || selectedBlocks.length === 0 || selectedSchools.length === 0) return;

//     const newRegions = selectedDistricts.map((d) => ({
//       districtId: d.value,
//       blockIds: selectedBlocks.map((b) => ({
//         blockId: b.value,
//         schoolIds: selectedSchools.map((s) => ({ schoolId: s.value })),
//       })),
//     }));

//     setRegion([...region, ...newRegions]);
//     setSelectedDistricts([]);
//     setSelectedBlocks([]);
//     setSelectedSchools([]);
//   };

//   // Handle class selection
//   const toggleClass = (classId) => {
//     if (classIds.includes(classId)) {
//       setClassIds(classIds.filter((id) => id !== classId));
//     } else {
//       setClassIds([...classIds, classId]);
//     }
//   };

//   // Handle final submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // 1. Create user
//       const userRes = await createUser(userData);
//       const user = userRes.data;

//       // 2. Assign access
//       const accessReq = {
//         unqObjectId: user._id,
//         userId: user.userId,
//         modules,
//         region,
//         classId: classIds,
//       };

//       await setUserAccess(accessReq);

//       alert("User and access created successfully!");
//       setUserData({
//         userId: "",
//         name: "",
//         email: "",
//         password: "",
//         contact1: "",
//         contact2: "",
//         department: "",
//         role: "",
//         isActive: true,
//       });
//       setModules([]);
//       setRegion([]);
//       setClassIds([]);
//     } catch (err) {
//       console.error(err);
//       alert("Error creating user or access");
//     }
//   };

//   // Unique districts
//   const districts = [
//     ...new Map(DistrictBlockSchool.map((d) => [d.districtId, { value: d.districtId, label: d.districtName }])).values(),
//   ];
//   const blocks = DistrictBlockSchool.filter((d) => selectedDistricts.some((sd) => sd.value === d.districtId)).map((b) => ({
//     value: b.blockId,
//     label: b.blockName,
//   }));
//   const schools = DistrictBlockSchool.filter((d) => selectedBlocks.some((sb) => sb.value === d.blockId)).map((s) => ({
//     value: s.schoolId,
//     label: s.schoolName,
//   }));

//   return (
//     <Container className="my-4">
//       <Card className="p-4 shadow-lg rounded-3">
//         <h2>Add User</h2>
//         <Form onSubmit={handleSubmit}>
//           {/* User Info */}
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>User ID</Form.Label>
//                 <Form.Control
//                   name="userId"
//                   value={userData.userId}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={userData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 1</Form.Label>
//                 <Form.Control
//                   name="contact1"
//                   value={userData.contact1}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 2</Form.Label>
//                 <Form.Control
//                   name="contact2"
//                   value={userData.contact2}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Department</Form.Label>
//                 <Form.Control
//                   name="department"
//                   value={userData.department}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Control
//                   name="role"
//                   value={userData.role}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Module Access */}
//           <h5>Module Access</h5>
//           {modules.map((mod, idx) => (
//             <Row key={idx} className="mb-2">
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.name}
//                   onChange={(e) => updateModule(idx, "name", e.target.value)}
//                 >
//                   <option value="Academics">Academics</option>
//                   <option value="Accounts">Bills</option>
//                   <option value="Accounts">Downloads</option>
//                   <option value="Accounts">Callings</option>
//                   <option value="Accounts">TRUE</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.accessLevel}
//                   onChange={(e) => updateModule(idx, "accessLevel", e.target.value)}
//                 >
//                   <option value="read">Read</option>
//                   <option value="create">Create</option>
//                   <option value="write">Write</option>
//                   <option value="delete">Delete</option>
//                   <option value="admin">Admin</option>
//                 </Form.Select>
//               </Col>
//             </Row>
//           ))}
//           <Button variant="secondary" onClick={addModule} className="mb-3">
//             + Add Module
//           </Button>

//           {/* Region Access */}
//           <h5>Region Access</h5>
//           <Row className="mb-3">
//             <Col md={4}>
//               <Select
//                 isMulti
//                 value={selectedDistricts}
//                 onChange={setSelectedDistricts}
//                 options={districts}
//                 placeholder="Select District(s)"
//               />
//             </Col>
//             <Col md={4}>
//               <Select
//                 isMulti
//                 value={selectedBlocks}
//                 onChange={setSelectedBlocks}
//                 options={blocks}
//                 placeholder="Select Block(s)"
//               />
//             </Col>
//             <Col md={4}>
//               <Select
//                 isMulti
//                 value={selectedSchools}
//                 onChange={setSelectedSchools}
//                 options={schools}
//                 placeholder="Select School(s)"
//               />
//             </Col>
//           </Row>
//           <Button variant="secondary" onClick={addRegion} className="mb-3">
//             + Add Region
//           </Button>

//           {region.length > 0 && (
//             <Table striped bordered>
//               <thead>
//                 <tr>
//                   <th>District</th>
//                   <th>Block</th>
//                   <th>School</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {region.map((r, idx) =>
//                   r.blockIds.map((b) =>
//                     b.schoolIds.map((s) => (
//                       <tr key={idx + s.schoolId}>
//                         <td>{r.districtId}</td>
//                         <td>{b.blockId}</td>
//                         <td>{s.schoolId}</td>
//                       </tr>
//                     ))
//                   )
//                 )}
//               </tbody>
//             </Table>
//           )}

//           {/* Class Access */}
//           <h5>Class Access</h5>
//           <div className="mb-3">
//             {["9", "10"].map((c) => (
//               <Form.Check
//                 inline
//                 key={c}
//                 label={`Class ${c}`}
//                 type="checkbox"
//                 checked={classIds.includes(c)}
//                 onChange={() => toggleClass(c)}
//               />
//             ))}
//           </div>

//           <Button type="submit" variant="primary">
//             Save User
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };



















// // src/components/CreateUser.jsx
// import React, { useState } from "react";
// import { createUser, setUserAccess } from "../service/User.service";
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
// import { Container, Form, Button, Row, Col, Card, Table } from "react-bootstrap";
// import Select from "react-select";

// export const CreateUser = () => {
//   const [userData, setUserData] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     password: "",
//     contact1: "",
//     contact2: "",
//     department: "",
//     role: "",
//     isActive: true,
//   });

//   const [modules, setModules] = useState([]);
//   const [region, setRegion] = useState([]);
//   const [classIds, setClassIds] = useState([]);

//   // District/Block/School dropdown states
//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedBlocks, setSelectedBlocks] = useState([]);
//   const [selectedSchools, setSelectedSchools] = useState([]);

//   // Department -> Role mapping
//   const departmentRoles = {
//     Community: ["CC", "ACI", "Community Incharge", "Project Coordinator", "Community Manager", "Technician"],
//     Academics: ["Academic-Coordinator", "DTP", "Teacher"],
//     Admin: ["Admin"],
//     HR: ["HR Executive", "HR Manager"],
//     Media: ["Media Manager", "Photographer"],
//     Tech: ["MIS", "Data Analyst", "Tech Lead"],
//   };

//   // Handle form input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Reset role if department changes
//     if (name === "department") {
//       setUserData({ ...userData, department: value, role: "" });
//     } else {
//       setUserData({ ...userData, [name]: value });
//     }
//   };

//   // Handle module selection
//   const addModule = () => {
//     setModules([...modules, { name: "Academics", accessLevel: "read" }]);
//   };

//   const updateModule = (index, field, value) => {
//     const updated = [...modules];
//     updated[index][field] = value;
//     setModules(updated);
//   };

//   // Handle region selection
//   const addRegion = () => {
//     if (selectedDistricts.length === 0 || selectedBlocks.length === 0 || selectedSchools.length === 0) return;

//     const newRegions = selectedDistricts.map((d) => ({
//       districtId: d.value,
//       blockIds: selectedBlocks.map((b) => ({
//         blockId: b.value,
//         schoolIds: selectedSchools.map((s) => ({ schoolId: s.value })),
//       })),
//     }));

//     setRegion([...region, ...newRegions]);
//     setSelectedDistricts([]);
//     setSelectedBlocks([]);
//     setSelectedSchools([]);
//   };

//   // Handle class selection
//   const toggleClass = (classId) => {
//     if (classIds.includes(classId)) {
//       setClassIds(classIds.filter((id) => id !== classId));
//     } else {
//       setClassIds([...classIds, classId]);
//     }
//   };

//   // Handle final submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // 1. Create user
//       const userRes = await createUser(userData);
//       const user = userRes.data;

//       // 2. Assign access
//       const accessReq = {
//         unqObjectId: user._id,
//         userId: user.userId,
//         modules,
//         region,
//         classId: classIds,
//       };

//       console.log(accessReq)

//       await setUserAccess(accessReq);

//       alert("User and access created successfully!");
//       setUserData({
//         userId: "",
//         name: "",
//         email: "",
//         password: "",
//         contact1: "",
//         contact2: "",
//         department: "",
//         role: "",
//         isActive: true,
//       });
//       setModules([]);
//       setRegion([]);
//       setClassIds([]);
//     } catch (err) {
//       console.error(err);
//       alert("Error creating user or access");
//     }
//   };

//   // Unique districts
//   const districts = [
//     ...new Map(DistrictBlockSchool.map((d) => [d.districtId, { value: d.districtId, label: d.districtName }])).values(),
//   ];
//   const blocks = DistrictBlockSchool.filter((d) => selectedDistricts.some((sd) => sd.value === d.districtId)).map((b) => ({
//     value: b.blockId,
//     label: b.blockName,
//   }));
//   const schools = DistrictBlockSchool.filter((d) => selectedBlocks.some((sb) => sb.value === d.blockId)).map((s) => ({
//     value: s.schoolId,
//     label: s.schoolName,
//   }));




//   //Region assignement logic advanced.

//   // extra states
// const [assignAllDistricts, setAssignAllDistricts] = useState(false);
// const [assignFullDistricts, setAssignFullDistricts] = useState(false);

// // handle auto-assign
// const handleAssignAllDistricts = (checked) => {
//   setAssignAllDistricts(checked);
//   setAssignFullDistricts(false); // reset other mode
//   if (checked) {
//     // assign all
//     const allRegions = districts.map((d) => ({
//       districtId: d.value,
//       blockIds: DistrictBlockSchool.filter((dbs) => dbs.districtId === d.value).map((b) => ({
//         blockId: b.blockId,
//         schoolIds: DistrictBlockSchool.filter((s) => s.blockId === b.blockId).map((s) => ({
//           schoolId: s.schoolId,
//         })),
//       })),
//     }));
//     setRegion(allRegions);
//   } else {
//     setRegion([]);
//   }
// };

// const handleAssignFullDistricts = (selected) => {
//   setSelectedDistricts(selected);
//   if (selected.length > 0) {
//     const selectedRegions = selected.map((d) => ({
//       districtId: d.value,
//       blockIds: DistrictBlockSchool.filter((dbs) => dbs.districtId === d.value).map((b) => ({
//         blockId: b.blockId,
//         schoolIds: DistrictBlockSchool.filter((s) => s.blockId === b.blockId).map((s) => ({
//           schoolId: s.schoolId,
//         })),
//       })),
//     }));
//     setRegion(selectedRegions);
//   } else {
//     setRegion([]);
//   }
// };







// //-----------------------------------------------

//   return (
//     <Container className="my-4">
//       <Card className="p-4 shadow-lg rounded-3">
//         <h2>Add User</h2>
//         <Form onSubmit={handleSubmit}>
//           {/* User Info */}
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>User ID</Form.Label>
//                 <Form.Control
//                   name="userId"
//                   value={userData.userId}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={userData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 1</Form.Label>
//                 <Form.Control
//                   name="contact1"
//                   value={userData.contact1}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 2</Form.Label>
//                 <Form.Control
//                   name="contact2"
//                   value={userData.contact2}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Department & Role */}
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Department</Form.Label>
//                 <Form.Select
//                   name="department"
//                   value={userData.department}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Department</option>
//                   {Object.keys(departmentRoles).map((dept) => (
//                     <option key={dept} value={dept}>
//                       {dept}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Select
//                   name="role"
//                   value={userData.role}
//                   onChange={handleChange}
//                   required
//                   disabled={!userData.department}
//                 >
//                   <option value="">Select Role</option>
//                   {userData.department &&
//                     departmentRoles[userData.department]?.map((role) => (
//                       <option key={role} value={role}>
//                         {role}
//                       </option>
//                     ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Module Access */}
//           <h5>Module Access</h5>
//           {modules.map((mod, idx) => (
//             <Row key={idx} className="mb-2">
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.name}
//                   onChange={(e) => updateModule(idx, "name", e.target.value)}
//                 >
//                   <option value="Academics">Academics</option>
//                   <option value="Bills">Bills</option>
//                   <option value="Downloads">Downloads</option>
//                   <option value="Callings">Callings</option>
//                   <option value="TRUE">TRUE</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.accessLevel}
//                   onChange={(e) => updateModule(idx, "accessLevel", e.target.value)}
//                 >
//                   <option value="read">Read</option>
//                   <option value="create">Create</option>
//                   <option value="write">Write</option>
//                   <option value="delete">Delete</option>
//                   <option value="admin">Admin</option>
//                 </Form.Select>
//               </Col>
//             </Row>
//           ))}
//           <Button variant="secondary" onClick={addModule} className="mb-3">
//             + Add Module
//           </Button>

//           {/* Region Access */}
//           {/* <h5>Region Access</h5>
//           <Row className="mb-3">
//             <Col md={4}>
//               <Select
//                 isMulti
//                 value={selectedDistricts}
//                 onChange={setSelectedDistricts}
//                 options={districts}
//                 placeholder="Select District(s)"
//               />
//             </Col>
//             <Col md={4}>
//               <Select
//                 isMulti
//                 value={selectedBlocks}
//                 onChange={setSelectedBlocks}
//                 options={blocks}
//                 placeholder="Select Block(s)"
//               />
//             </Col>
//             <Col md={4}>
//               <Select
//                 isMulti
//                 value={selectedSchools}
//                 onChange={setSelectedSchools}
//                 options={schools}
//                 placeholder="Select School(s)"
//               />
//             </Col>
//           </Row>
//           <Button variant="secondary" onClick={addRegion} className="mb-3">
//             + Add Region
//           </Button>

//           {region.length > 0 && (
//             <Table striped bordered>
//               <thead>
//                 <tr>
//                   <th>District</th>
//                   <th>Block</th>
//                   <th>School</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {region.map((r, idx) =>
//                   r.blockIds.map((b) =>
//                     b.schoolIds.map((s) => (
//                       <tr key={idx + s.schoolId}>
//                         <td>{r.districtId}</td>
//                         <td>{b.blockId}</td>
//                         <td>{s.schoolId}</td>
//                       </tr>
//                     ))
//                   )
//                 )}
//               </tbody>
//             </Table>
//           )} */}




// {/* Region Access */}
// <h5>Region Access</h5>

// <div className="mb-2">
//   <Form.Check
//     type="checkbox"
//     label="Assign All Districts (all blocks & schools auto)"
//     checked={assignAllDistricts}
//     onChange={(e) => handleAssignAllDistricts(e.target.checked)}
//   />
//   <Form.Check
//     type="checkbox"
//     label="Assign District(s) Fully (auto all blocks & schools under them)"
//     checked={assignFullDistricts}
//     disabled={assignAllDistricts}
//     onChange={(e) => {
//       setAssignFullDistricts(e.target.checked);
//       setAssignAllDistricts(false); // reset other mode
//       setRegion([]); // reset region
//     }}
//   />
// </div>

// <Row className="mb-3">
//   <Col md={4}>
//     <Select
//       isMulti
//       value={selectedDistricts}
//       onChange={(selected) =>
//         assignFullDistricts ? handleAssignFullDistricts(selected) : setSelectedDistricts(selected)
//       }
//       options={districts}
//       placeholder="Select District(s)"
//       isDisabled={assignAllDistricts}
//     />
//   </Col>
//   <Col md={4}>
//     <Select
//       isMulti
//       value={selectedBlocks}
//       onChange={setSelectedBlocks}
//       options={blocks}
//       placeholder="Select Block(s)"
//       isDisabled={assignAllDistricts || assignFullDistricts}
//     />
//   </Col>
//   <Col md={4}>
//     <Select
//       isMulti
//       value={selectedSchools}
//       onChange={setSelectedSchools}
//       options={schools}
//       placeholder="Select School(s)"
//       isDisabled={assignAllDistricts || assignFullDistricts}
//     />
//   </Col>
// </Row>

// {!assignAllDistricts && !assignFullDistricts && (
//   <Button variant="secondary" onClick={addRegion} className="mb-3">
//     + Add Region
//   </Button>
// )}

// {region.length > 0 && (
//   <Table striped bordered>
//     <thead>
//       <tr>
//         <th>District</th>
//         <th>Block</th>
//         <th>School</th>
//       </tr>
//     </thead>
//     <tbody>
//       {region.map((r, idx) =>
//         r.blockIds.map((b) =>
//           b.schoolIds.map((s) => (
//             <tr key={idx + s.schoolId}>
//               <td>{r.districtId}</td>
//               <td>{b.blockId}</td>
//               <td>{s.schoolId}</td>
//             </tr>
//           ))
//         )
//       )}
//     </tbody>
//   </Table>
// )}


//           {/* Class Access */}
//           <h5>Class Access</h5>
//           <div className="mb-3">
//             {["9", "10"].map((c) => (
//               <Form.Check
//                 inline
//                 key={c}
//                 label={`Class ${c}`}
//                 type="checkbox"
//                 checked={classIds.includes(c)}
//                 onChange={() => toggleClass(c)}
//               />
//             ))}
//           </div>

//           <Button type="submit" variant="primary">
//             Save User
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

























// // src/components/CreateUser.jsx
// import React, { useState } from "react";
// import { createUser, setUserAccess } from "../service/User.service";
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
// import { Container, Form, Button, Row, Col, Card, Table } from "react-bootstrap";
// import Select from "react-select";
// import Papa from "papaparse";

// export const CreateUser = () => {
//   const [userData, setUserData] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     password: "",
//     contact1: "",
//     contact2: "",
//     department: "",
//     role: "",
//     isActive: true,
//   });

//   const [modules, setModules] = useState([]);
//   const [region, setRegion] = useState([]);
//   const [classIds, setClassIds] = useState([]);

//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedBlocks, setSelectedBlocks] = useState([]);
//   const [selectedSchools, setSelectedSchools] = useState([]);

//   const departmentRoles = {
//     Community: ["CC", "ACI", "Community Incharge", "Project Coordinator", "Community Manager", "Technician"],
//     Academics: ["Academic-Coordinator", "DTP", "Teacher"],
//     Admin: ["Admin"],
//     HR: ["HR Executive", "HR Manager"],
//     Media: ["Media Manager", "Photographer"],
//     Tech: ["MIS", "Data Analyst", "Tech Lead"],
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "department") {
//       setUserData({ ...userData, department: value, role: "" });
//     } else {
//       setUserData({ ...userData, [name]: value });
//     }
//   };

//   const addModule = () => {
//     setModules([...modules, { name: "Academics", accessLevel: "read" }]);
//   };

//   const updateModule = (index, field, value) => {
//     const updated = [...modules];
//     updated[index][field] = value;
//     setModules(updated);
//   };

//   // const addRegion = () => {
//   //   if (selectedDistricts.length === 0 || selectedBlocks.length === 0 || selectedSchools.length === 0) return;
//   //   const newRegions = selectedDistricts.map((d) => ({
//   //     districtId: d.value,
//   //     blockIds: selectedBlocks.map((b) => ({
//   //       blockId: b.value,
//   //       schoolIds: selectedSchools.map((s) => ({ schoolId: s.value })),
//   //     })),
//   //   }));
//   //   setRegion([...region, ...newRegions]);
//   //   setSelectedDistricts([]);
//   //   setSelectedBlocks([]);
//   //   setSelectedSchools([]);
//   // };







//   const addRegion = () => {
//   if (selectedDistricts.length === 0 || selectedBlocks.length === 0 || selectedSchools.length === 0) return;

//   const newRegions = selectedDistricts.map((d) => ({
//     districtId: d.value,
//     blockIds: selectedBlocks.map((b) => ({
//       blockId: b.value,
//       schoolIds: selectedSchools.map((s) => ({ schoolId: s.value })),
//     })),
//   }));

//   const mergedRegions = [...region];

//   newRegions.forEach((newReg) => {
//     const existingDistrict = mergedRegions.find((r) => r.districtId === newReg.districtId);

//     if (existingDistrict) {
//       // merge blocks
//       newReg.blockIds.forEach((newBlock) => {
//         const existingBlock = existingDistrict.blockIds.find((b) => b.blockId === newBlock.blockId);
//         if (existingBlock) {
//           // merge schools
//           newBlock.schoolIds.forEach((s) => {
//             if (!existingBlock.schoolIds.some((es) => es.schoolId === s.schoolId)) {
//               existingBlock.schoolIds.push(s);
//             }
//           });
//         } else {
//           existingDistrict.blockIds.push(newBlock);
//         }
//       });
//     } else {
//       mergedRegions.push(newReg);
//     }
//   });

//   setRegion(mergedRegions);
//   setSelectedDistricts([]);
//   setSelectedBlocks([]);
//   setSelectedSchools([]);
// };

//   const toggleClass = (classId) => {
//     if (classIds.includes(classId)) {
//       setClassIds(classIds.filter((id) => id !== classId));
//     } else {
//       setClassIds([...classIds, classId]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userRes = await createUser(userData);
//       const user = userRes.data;

//       const accessReq = {
//         unqObjectId: user._id,
//         userId: user.userId,
//         modules,
//         region,
//         classId: classIds,
//       };

//       console.log(accessReq);
//       await setUserAccess(accessReq);

//       alert("User and access created successfully!");
//       setUserData({
//         userId: "",
//         name: "",
//         email: "",
//         password: "",
//         contact1: "",
//         contact2: "",
//         department: "",
//         role: "",
//         isActive: true,
//       });
//       setModules([]);
//       setRegion([]);
//       setClassIds([]);
//     } catch (err) {
//       console.error(err);
//       alert("Error creating user or access");
//     }
//   };

//   const districts = [
//     ...new Map(DistrictBlockSchool.map((d) => [d.districtId, { value: d.districtId, label: d.districtName }])).values(),
//   ];
//   const blocks = DistrictBlockSchool.filter((d) => selectedDistricts.some((sd) => sd.value === d.districtId)).map((b) => ({
//     value: b.blockId,
//     label: b.blockName,
//   }));
//   const schools = DistrictBlockSchool.filter((d) => selectedBlocks.some((sb) => sb.value === d.blockId)).map((s) => ({
//     value: s.schoolId,
//     label: s.schoolName,
//   }));

//   const [assignAllDistricts, setAssignAllDistricts] = useState(false);
//   const [assignFullDistricts, setAssignFullDistricts] = useState(false);

//   const handleAssignAllDistricts = (checked) => {
//     setAssignAllDistricts(checked);
//     setAssignFullDistricts(false);
//     if (checked) {
//       const allRegions = districts.map((d) => ({
//         districtId: d.value,
//         blockIds: DistrictBlockSchool.filter((dbs) => dbs.districtId === d.value).map((b) => ({
//           blockId: b.blockId,
//           schoolIds: DistrictBlockSchool.filter((s) => s.blockId === b.blockId).map((s) => ({
//             schoolId: s.schoolId,
//           })),
//         })),
//       }));
//       setRegion(allRegions);
//     } else {
//       setRegion([]);
//     }
//   };

//   const handleAssignFullDistricts = (selected) => {
//     setSelectedDistricts(selected);
//     if (selected.length > 0) {
//       const selectedRegions = selected.map((d) => ({
//         districtId: d.value,
//         blockIds: DistrictBlockSchool.filter((dbs) => dbs.districtId === d.value).map((b) => ({
//           blockId: b.blockId,
//           schoolIds: DistrictBlockSchool.filter((s) => s.blockId === b.blockId).map((s) => ({
//             schoolId: s.schoolId,
//           })),
//         })),
//       }));
//       setRegion(selectedRegions);
//     } else {
//       setRegion([]);
//     }
//   };

//   // ---------------------- BULK UPLOAD FUNCTIONS ----------------------

//   // Download CSV template with prefilled format
//   const handleDownloadTemplate = () => {
//     if (!userData.userId) {
//       alert("Please fill user data to generate template");
//       return;
//     }

//     const moduleNames = modules.map((m) => m.name).join(", ");
//     const moduleRoles = modules.map((m) => m.accessLevel).join(", ");
//     const classStr = classIds.join(",");

//     let rows = [];

//     region.forEach((r) => {
//       r.blockIds.forEach((b) => {
//         b.schoolIds.forEach((s) => {
//           rows.push({
//             userId: userData.userId,
//             name: userData.name,
//             email: userData.email,
//             password: userData.password,
//             contact1: userData.contact1,
//             contact2: userData.contact2,
//             dept: userData.department,
//             role: userData.role,
//             moduleaccess: moduleNames,
//             accessRole: moduleRoles,
//             district: r.districtId,
//             block: b.blockId,
//             school: s.schoolId,
//             class: classStr,
//           });
//         });
//       });
//     });

//     const csv = Papa.unparse(rows);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute("download", "bulk_user_template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Upload CSV and register users
//   const handleUploadCSV = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

  


//     Papa.parse(file, {
//   header: true,
//   complete: async (result) => {
//     const grouped = {};

//     // group by userId
//     result.data.forEach((row) => {
//       if (!grouped[row.userId]) {
//         grouped[row.userId] = { user: row, modules: [], regions: [], classes: [] };
//       }

//       // ✅ safe split
//       const moduleAccess = row.moduleaccess ? row.moduleaccess.split(",") : [];
//       const accessRoles  = row.accessRole   ? row.accessRole.split(",")   : [];
//       const classes      = row.class        ? row.class.split(",")        : [];

//       grouped[row.userId].modules = moduleAccess.map((m, i) => ({
//         name: m.trim(),
//         accessLevel: accessRoles[i]?.trim() || "read",
//       }));

//       grouped[row.userId].classes = classes;

//       grouped[row.userId].regions.push({
//         districtId: row.district,
//         blockIds: [
//           {
//             blockId: row.block,
//             schoolIds: [{ schoolId: row.school }],
//           },
//         ],
//       });
//     });

//     // create users
//     for (let uid in grouped) {
//       const { user, modules, regions, classes } = grouped[uid];
//       try {
//         const userRes = await createUser({
//           userId: user.userId,
//           name: user.name,
//           email: user.email,
//           password: user.password,
//           contact1: user.contact1,
//           contact2: user.contact2,
//           department: user.dept,
//           role: user.role,
//           isActive: true,
//         });
//         const createdUser = userRes.data;

//         const accessReq = {
//           unqObjectId: createdUser._id,
//           userId: createdUser.userId,
//           modules,
//           region: regions,
//           classId: classes,
//         };

//         await setUserAccess(accessReq);
//         console.log("Uploaded user:", createdUser.userId);
//       } catch (err) {
//         console.error("Error uploading user:", uid, err);
//       }
//     }

//     alert("Bulk upload completed!");
//   },
// });

//   };

//   // -------------------------------------------------------------------

//   return (
//     <Container className="my-4">
//       <Card className="p-4 shadow-lg rounded-3">
//         <h2>Add User</h2>
//         <Form onSubmit={handleSubmit}>
//           {/* ---- your existing form code unchanged ---- */}


//           {/* User Info */}
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>User ID</Form.Label>
//                 <Form.Control
//                   name="userId"
//                   value={userData.userId}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={userData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   value={userData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 1</Form.Label>
//                 <Form.Control
//                   name="contact1"
//                   value={userData.contact1}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact 2</Form.Label>
//                 <Form.Control
//                   name="contact2"
//                   value={userData.contact2}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Department & Role */}
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Department</Form.Label>
//                 <Form.Select
//                   name="department"
//                   value={userData.department}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Department</option>
//                   {Object.keys(departmentRoles).map((dept) => (
//                     <option key={dept} value={dept}>
//                       {dept}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Select
//                   name="role"
//                   value={userData.role}
//                   onChange={handleChange}
//                   required
//                   disabled={!userData.department}
//                 >
//                   <option value="">Select Role</option>
//                   {userData.department &&
//                     departmentRoles[userData.department]?.map((role) => (
//                       <option key={role} value={role}>
//                         {role}
//                       </option>
//                     ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Module Access */}
//           <h5>Module Access</h5>
//           {modules.map((mod, idx) => (
//             <Row key={idx} className="mb-2">
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.name}
//                   onChange={(e) => updateModule(idx, "name", e.target.value)}
//                 >
//                   <option value="Academics">Academics</option>
//                   <option value="Bills">Bills</option>
//                   <option value="Downloads">Downloads</option>
//                   <option value="Callings">Callings</option>
//                   <option value="TRUE">TRUE</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6}>
//                 <Form.Select
//                   value={mod.accessLevel}
//                   onChange={(e) => updateModule(idx, "accessLevel", e.target.value)}
//                 >
//                   <option value="read">Read</option>
//                   <option value="create">Create</option>
//                   <option value="write">Write</option>
//                   <option value="delete">Delete</option>
//                   <option value="admin">Admin</option>
//                 </Form.Select>
//               </Col>
//             </Row>
//           ))}
//           <Button variant="secondary" onClick={addModule} className="mb-3">
//             + Add Module
//           </Button>


// {/* Region Access */}
// <h5>Region Access</h5>

// <div className="mb-2">
//   <Form.Check
//     type="checkbox"
//     label="Assign All Districts (all blocks & schools auto)"
//     checked={assignAllDistricts}
//     onChange={(e) => handleAssignAllDistricts(e.target.checked)}
//   />
//   <Form.Check
//     type="checkbox"
//     label="Assign District(s) Fully (auto all blocks & schools under them)"
//     checked={assignFullDistricts}
//     disabled={assignAllDistricts}
//     onChange={(e) => {
//       setAssignFullDistricts(e.target.checked);
//       setAssignAllDistricts(false); // reset other mode
//       setRegion([]); // reset region
//     }}
//   />
// </div>

// <Row className="mb-3">
//   <Col md={4}>
//     <Select
//       isMulti
//       value={selectedDistricts}
//       onChange={(selected) =>
//         assignFullDistricts ? handleAssignFullDistricts(selected) : setSelectedDistricts(selected)
//       }
//       options={districts}
//       placeholder="Select District(s)"
//       isDisabled={assignAllDistricts}
//     />
//   </Col>
//   <Col md={4}>
//     <Select
//       isMulti
//       value={selectedBlocks}
//       onChange={setSelectedBlocks}
//       options={blocks}
//       placeholder="Select Block(s)"
//       isDisabled={assignAllDistricts || assignFullDistricts}
//     />
//   </Col>
//   <Col md={4}>
//     <Select
//       isMulti
//       value={selectedSchools}
//       onChange={setSelectedSchools}
//       options={schools}
//       placeholder="Select School(s)"
//       isDisabled={assignAllDistricts || assignFullDistricts}
//     />
//   </Col>
// </Row>

// {!assignAllDistricts && !assignFullDistricts && (
//   <Button variant="secondary" onClick={addRegion} className="mb-3">
//     + Add Region
//   </Button>
// )}

// {region.length > 0 && (
//   <Table striped bordered>
//     <thead>
//       <tr>
//         <th>District</th>
//         <th>Block</th>
//         <th>School</th>
//       </tr>
//     </thead>
//     <tbody>
//       {region.map((r, idx) =>
//         r.blockIds.map((b) =>
//           b.schoolIds.map((s) => (
//             <tr key={idx + s.schoolId}>
//               <td>{r.districtId}</td>
//               <td>{b.blockId}</td>
//               <td>{s.schoolId}</td>
//             </tr>
//           ))
//         )
//       )}
//     </tbody>
//   </Table>
// )}


//           {/* Class Access */}
//           <h5>Class Access</h5>
//           <div className="mb-3">
//             {["9", "10"].map((c) => (
//               <Form.Check
//                 inline
//                 key={c}
//                 label={`Class ${c}`}
//                 type="checkbox"
//                 checked={classIds.includes(c)}
//                 onChange={() => toggleClass(c)}
//               />
//             ))}
//           </div>

//           <Button type="submit" variant="primary">
//             Save User
//           </Button>
//         </Form>

//         {/* ---- NEW BUTTONS ---- */}
//         <hr />
//         <h5>Bulk Upload Options</h5>
//         <Button variant="warning" className="me-3" onClick={handleDownloadTemplate}>
//           Download Bulk Upload Format
//         </Button>
//         <Form.Group controlId="formFile" className="mt-3">
//           <Form.Label>Upload CSV</Form.Label>
//           <Form.Control type="file" accept=".csv" onChange={handleUploadCSV} />
//         </Form.Group>
//       </Card>
//     </Container>
//   );
// };
































// src/components/CreateUser.jsx
import React, { useState } from "react";
import { createUser, setUserAccess } from "../service/User.service";
import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
import { Container, Form, Button, Row, Col, Card, Table } from "react-bootstrap";
import Select from "react-select";
import Papa from "papaparse";

export const CreateUser = () => {
  const [userData, setUserData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    contact1: "",
    contact2: "",
    department: "",
    role: "",
    isActive: true,
  });

  const [modules, setModules] = useState([]);
  const [region, setRegion] = useState([]);
  const [classIds, setClassIds] = useState([]);

  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);

  const departmentRoles = {
    Community: ["CC", "ACI", "Community Incharge", "Project Coordinator", "Community Manager", "Technician"],
    Academics: ["Academic-Coordinator", "DTP", "Teacher"],
    Admin: ["Admin"],
    HR: ["HR Executive", "HR Manager"],
    Media: ["Media Manager", "Photographer"],
    Tech: ["MIS", "Data Analyst", "Tech Lead"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setUserData({ ...userData, department: value, role: "" });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const addModule = () => {
    setModules([...modules, { name: "Academics", accessLevel: "read" }]);
  };

  const updateModule = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  // const addRegion = () => {
  //   if (selectedDistricts.length === 0 || selectedBlocks.length === 0 || selectedSchools.length === 0) return;
  //   const newRegions = selectedDistricts.map((d) => ({
  //     districtId: d.value,
  //     blockIds: selectedBlocks.map((b) => ({
  //       blockId: b.value,
  //       schoolIds: selectedSchools.map((s) => ({ schoolId: s.value })),
  //     })),
  //   }));
  //   setRegion([...region, ...newRegions]);
  //   setSelectedDistricts([]);
  //   setSelectedBlocks([]);
  //   setSelectedSchools([]);
  // };

  const addRegion = () => {
    if (selectedDistricts.length === 0 || selectedBlocks.length === 0 || selectedSchools.length === 0) return;

    const newRegions = selectedDistricts.map((d) => ({
      districtId: d.value,
      blockIds: selectedBlocks.map((b) => ({
        blockId: b.value,
        schoolIds: selectedSchools.map((s) => ({ schoolId: s.value })),
      })),
    }));

    const mergedRegions = [...region];

    newRegions.forEach((newReg) => {
      const existingDistrict = mergedRegions.find((r) => r.districtId === newReg.districtId);

      if (existingDistrict) {
        // merge blocks
        newReg.blockIds.forEach((newBlock) => {
          const existingBlock = existingDistrict.blockIds.find((b) => b.blockId === newBlock.blockId);
          if (existingBlock) {
            // merge schools
            newBlock.schoolIds.forEach((s) => {
              if (!existingBlock.schoolIds.some((es) => es.schoolId === s.schoolId)) {
                existingBlock.schoolIds.push(s);
              }
            });
          } else {
            existingDistrict.blockIds.push(newBlock);
          }
        });
      } else {
        mergedRegions.push(newReg);
      }
    });

    setRegion(mergedRegions);
    setSelectedDistricts([]);
    setSelectedBlocks([]);
    setSelectedSchools([]);
  };

  const toggleClass = (classId) => {
    if (classIds.includes(classId)) {
      setClassIds(classIds.filter((id) => id !== classId));
    } else {
      setClassIds([...classIds, classId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRes = await createUser(userData);
      const user = userRes.data;

      const accessReq = {
        unqObjectId: user._id,
        userId: user.userId,
        modules,
        region,
        classId: classIds,
      };

      console.log(accessReq);
      await setUserAccess(accessReq);

      alert("User and access created successfully!");
      setUserData({
        userId: "",
        name: "",
        email: "",
        password: "",
        contact1: "",
        contact2: "",
        department: "",
        role: "",
        isActive: true,
      });
      setModules([]);
      setRegion([]);
      setClassIds([]);
    } catch (err) {
      console.error(err);
      alert("Error creating user or access");
    }
  };

  const districts = [
    ...new Map(DistrictBlockSchool.map((d) => [d.districtId, { value: d.districtId, label: d.districtName }])).values(),
  ];
  const blocks = DistrictBlockSchool.filter((d) => selectedDistricts.some((sd) => sd.value === d.districtId)).map((b) => ({
    value: b.blockId,
    label: b.blockName,
  }));
  const schools = DistrictBlockSchool.filter((d) => selectedBlocks.some((sb) => sb.value === d.blockId)).map((s) => ({
    value: s.schoolId,
    label: s.schoolName,
  }));

  const [assignAllDistricts, setAssignAllDistricts] = useState(false);
  const [assignFullDistricts, setAssignFullDistricts] = useState(false);

  const handleAssignAllDistricts = (checked) => {
    setAssignAllDistricts(checked);
    setAssignFullDistricts(false);
    if (checked) {
      const allRegions = districts.map((d) => ({
        districtId: d.value,
        blockIds: DistrictBlockSchool.filter((dbs) => dbs.districtId === d.value).map((b) => ({
          blockId: b.blockId,
          schoolIds: DistrictBlockSchool.filter((s) => s.blockId === b.blockId).map((s) => ({
            schoolId: s.schoolId,
          })),
        })),
      }));
      setRegion(allRegions);
    } else {
      setRegion([]);
    }
  };

  const handleAssignFullDistricts = (selected) => {
    setSelectedDistricts(selected);
    if (selected.length > 0) {
      const selectedRegions = selected.map((d) => ({
        districtId: d.value,
        blockIds: DistrictBlockSchool.filter((dbs) => dbs.districtId === d.value).map((b) => ({
          blockId: b.blockId,
          schoolIds: DistrictBlockSchool.filter((s) => s.blockId === b.blockId).map((s) => ({
            schoolId: s.schoolId,
          })),
        })),
      }));
      setRegion(selectedRegions);
    } else {
      setRegion([]);
    }
  };

  // ---------------------- BULK UPLOAD FUNCTIONS ----------------------

  // helper to merge regions
  const mergeRegions = (existingRegions, newRegions) => {
    const merged = [...existingRegions];
    newRegions.forEach((newReg) => {
      const existingDistrict = merged.find((r) => r.districtId === newReg.districtId);
      if (existingDistrict) {
        newReg.blockIds.forEach((newBlock) => {
          const existingBlock = existingDistrict.blockIds.find((b) => b.blockId === newBlock.blockId);
          if (existingBlock) {
            newBlock.schoolIds.forEach((s) => {
              if (!existingBlock.schoolIds.some((es) => es.schoolId === s.schoolId)) {
                existingBlock.schoolIds.push(s);
              }
            });
          } else {
            existingDistrict.blockIds.push(newBlock);
          }
        });
      } else {
        merged.push(newReg);
      }
    });
    return merged;
  };

  // Download CSV template with prefilled format
  const handleDownloadTemplate = () => {
    if (!userData.userId) {
      alert("Please fill user data to generate template");
      return;
    }

    const moduleNames = modules.map((m) => m.name).join(", ");
    const moduleRoles = modules.map((m) => m.accessLevel).join(", ");
    const classStr = classIds.join(",");

    let rows = [];

    region.forEach((r) => {
      r.blockIds.forEach((b) => {
        b.schoolIds.forEach((s) => {
          rows.push({
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            contact1: userData.contact1,
            contact2: userData.contact2,
            dept: userData.department,
            role: userData.role,
            moduleaccess: moduleNames,
            accessRole: moduleRoles,
            district: r.districtId,
            block: b.blockId,
            school: s.schoolId,
            class: classStr,
          });
        });
      });
    });

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "bulk_user_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Upload CSV and register users
  const handleUploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (result) => {
        const grouped = {};

        // group by userId
        result.data.forEach((row) => {
          if (!grouped[row.userId]) {
            grouped[row.userId] = { user: row, modules: [], regions: [], classes: [] };
          }

          // ✅ safe split
          const moduleAccess = row.moduleaccess ? row.moduleaccess.split(",") : [];
          const accessRoles = row.accessRole ? row.accessRole.split(",") : [];
          const classes = row.class ? row.class.split(",") : [];

          grouped[row.userId].modules = moduleAccess.map((m, i) => ({
            name: m.trim(),
            accessLevel: accessRoles[i]?.trim() || "read",
          }));

          grouped[row.userId].classes = classes;

          const newRegion = {
            districtId: row.district,
            blockIds: [
              {
                blockId: row.block,
                schoolIds: [{ schoolId: row.school }],
              },
            ],
          };

          grouped[row.userId].regions = mergeRegions(grouped[row.userId].regions, [newRegion]);
        });

        // create users
        for (let uid in grouped) {
          const { user, modules, regions, classes } = grouped[uid];
          try {
            const userRes = await createUser({
              userId: user.userId,
              name: user.name,
              email: user.email,
              password: user.password,
              contact1: user.contact1,
              contact2: user.contact2,
              department: user.dept,
              role: user.role,
              isActive: true,
            });
            const createdUser = userRes.data;

            const accessReq = {
              unqObjectId: createdUser._id,
              userId: createdUser.userId,
              modules,
              region: regions,
              classId: classes,
            };

            await setUserAccess(accessReq);
            console.log("Uploaded user:", createdUser.userId);
          } catch (err) {
            console.error("Error uploading user:", uid, err);
          }
        }

        alert("Bulk upload completed!");
      },
    });
  };

  // -------------------------------------------------------------------

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-lg rounded-3">
        <h2>Add User</h2>
        <Form onSubmit={handleSubmit}>
          {/* ---- your existing form code unchanged ---- */}

          {/* User Info */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  name="userId"
                  value={userData.userId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact 1</Form.Label>
                <Form.Control
                  name="contact1"
                  value={userData.contact1}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact 2</Form.Label>
                <Form.Control
                  name="contact2"
                  value={userData.contact2}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Department & Role */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={userData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {Object.keys(departmentRoles).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  required
                  disabled={!userData.department}
                >
                  <option value="">Select Role</option>
                  {userData.department &&
                    departmentRoles[userData.department]?.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Module Access */}
          <h5>Module Access</h5>
          {modules.map((mod, idx) => (
            <Row key={idx} className="mb-2">
              <Col md={6}>
                <Form.Select
                  value={mod.name}
                  onChange={(e) => updateModule(idx, "name", e.target.value)}
                >
                  <option value="Academics">Academics</option>
                  <option value="Bills">Bills</option>
                  <option value="Downloads">Downloads</option>
                  <option value="Callings">Callings</option>
                  <option value="TRUE">TRUE</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Select
                  value={mod.accessLevel}
                  onChange={(e) => updateModule(idx, "accessLevel", e.target.value)}
                >
                  <option value="read">Read</option>
                  <option value="create">Create</option>
                  <option value="write">Write</option>
                  <option value="delete">Delete</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addModule} className="mb-3">
            + Add Module
          </Button>

          {/* Region Access */}
          <h5>Region Access</h5>

          <div className="mb-2">
            <Form.Check
              type="checkbox"
              label="Assign All Districts (all blocks & schools auto)"
              checked={assignAllDistricts}
              onChange={(e) => handleAssignAllDistricts(e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Assign District(s) Fully (auto all blocks & schools under them)"
              checked={assignFullDistricts}
              disabled={assignAllDistricts}
              onChange={(e) => {
                setAssignFullDistricts(e.target.checked);
                setAssignAllDistricts(false); // reset other mode
                setRegion([]); // reset region
              }}
            />
          </div>

          <Row className="mb-3">
            <Col md={4}>
              <Select
                isMulti
                value={selectedDistricts}
                onChange={(selected) =>
                  assignFullDistricts ? handleAssignFullDistricts(selected) : setSelectedDistricts(selected)
                }
                options={districts}
                placeholder="Select District(s)"
                isDisabled={assignAllDistricts}
              />
            </Col>
            <Col md={4}>
              <Select
                isMulti
                value={selectedBlocks}
                onChange={setSelectedBlocks}
                options={blocks}
                placeholder="Select Block(s)"
                isDisabled={assignAllDistricts || assignFullDistricts}
              />
            </Col>
            <Col md={4}>
              <Select
                isMulti
                value={selectedSchools}
                onChange={setSelectedSchools}
                options={schools}
                placeholder="Select School(s)"
                isDisabled={assignAllDistricts || assignFullDistricts}
              />
            </Col>
          </Row>

          {!assignAllDistricts && !assignFullDistricts && (
            <Button variant="secondary" onClick={addRegion} className="mb-3">
              + Add Region
            </Button>
          )}

          {region.length > 0 && (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Block</th>
                  <th>School</th>
                </tr>
              </thead>
              <tbody>
                {region.map((r, idx) =>
                  r.blockIds.map((b) =>
                    b.schoolIds.map((s) => (
                      <tr key={idx + s.schoolId}>
                        <td>{r.districtId}</td>
                        <td>{b.blockId}</td>
                        <td>{s.schoolId}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </Table>
          )}

          {/* Class Access */}
          <h5>Class Access</h5>
          <div className="mb-3">
            {["9", "10"].map((c) => (
              <Form.Check
                inline
                key={c}
                label={`Class ${c}`}
                type="checkbox"
                checked={classIds.includes(c)}
                onChange={() => toggleClass(c)}
              />
            ))}
          </div>

          <Button type="submit" variant="primary">
            Save User
          </Button>
        </Form>

        {/* ---- NEW BUTTONS ---- */}
        <hr />
        <h5>Bulk Upload Options</h5>
        <Button variant="warning" className="me-3" onClick={handleDownloadTemplate}>
          Download Bulk Upload Format
        </Button>
        <Form.Group controlId="formFile" className="mt-3">
          <Form.Label>Upload CSV</Form.Label>
          <Form.Control type="file" accept=".csv" onChange={handleUploadCSV} />
        </Form.Group>
      </Card>
    </Container>
  );
};






