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
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
// import { GetDistrictBlockSchoolByParams } from "../service/DistrictBlockSchool.service";
// import { getUsersByObjectId } from "../service/User.service";

// import { useLocation , useNavigate } from "react-router-dom";

// export const UpdateUser = () => {


//   const navigate = useNavigate();

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
//     Accounts: ["Accountant"],
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

//       //Console logging my users data.
//       console.log(response.data);

//       setUsers(response.data || []);
//     } catch (error) {
//       console.log("Error fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [page]);

//   //Modal to update user details
//   const [show, setShow] = useState(false);

//   const [showAccessModal, setShowAccessModal] = useState(false);

//   const [filteredUser, setFilteredUser] = useState([]);

//   const handleClose = () => {
//     setShowAccessModal(false);
//     setShow(false);
//   };
//   const handleShow = async (id) => {

//     // alert(id)
//     const reqBody = {
//       _id: id,
//     };

//     const response = await getUsersByObjectId(reqBody);

//     console.log(response.data);

//     // setFilteredUser(response.data[0]);


      
//     navigate('/edit-user', {
//       state:{
//         fetchedAccessData: response
//       }
//     })


//   };

//   const [userAllSchoolIds, setUserAllSchoolIds] = useState([]);

//   const handleAccessModal = async (id) => {

  
//     // alert (id)

//     const reqBody = {
//       _id: id,
//     };

//     const response = await getUsersByObjectId(reqBody);


//     console.log(response)
  
//     navigate('/edit-user-access', {
//       state:{
//         fetchedAccessData: response
//       }
//     })
    
//   };

//   //Fetching district_block_schools data
//   const [dbDistrictBlockSchoolData, setDbDistrictBlockSchoolData] = useState(
//     []
//   );
//   const fetchDistrictBlockSchool = async () => {
//     try {
//       const response = await GetDistrictBlockSchoolByParams();

//       console.log(response.data);

//       setDbDistrictBlockSchoolData(response.data);
//     } catch (error) {
//       console.log("Error::::>", error);
//     }
//   };

//   useEffect(() => {
//     fetchDistrictBlockSchool();
//   }, []);

//   let districtSelectOptions = [];
//   const [districtOptioins1, setDistrictOptioins1] = useState([]);
//   const districtOptions = async () => {
//     console.log(userAllSchoolIds);

//     filteredUser?.access?.region?.map((eachRegion, index) => {
//       districtSelectOptions.push({
//         label: eachRegion.districtId,
//         value: eachRegion.districtId,
//       });
//     });

//     console.log(
//       filteredUser?.accessDetails?.region?.map((eachRegion, index) => {
//         districtSelectOptions.push({
//           label: eachRegion.districtId,
//           value: eachRegion.districtId,
//         });
//       })
//     );

//     setDistrictOptioins1(districtSelectOptions);
//   };

//   //function to update filteredUserobject.
//   const updateUserGeneralDetails = () => {
//     console.log(filteredUser);
//   };

//   useEffect(() => {
//     updateUserGeneralDetails();
//   }, [filteredUser]);

//   return (
//     <Container fluid>
//       <h1>Hello Update Users</h1>
//       <hr></hr>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>User Id</th>
//             <th>Name</th>
//             <th>email</th>
//             <th>Contact 1</th>
//             <th>Contact 2</th>
//             <th>Department</th>
//             <th>Role</th>
//             <th>Edit General</th>
//             <th>Edit Access</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length > 0 ? (
//             <>
//               {users.map((eachUser, index) => {
//                 return (
//                   <tr key={eachUser._id}>
//                     <td>{index + 1}</td>
//                     <td>{eachUser.userId}</td>
//                     <td>{eachUser.name}</td>
//                     <td>{eachUser.email}</td>
//                     <td>{eachUser.contact1}</td>
//                     <td>{eachUser.contact2}</td>
//                     <td>{eachUser.department}</td>
//                     <td>{eachUser.role}</td>
//                     <td>
//                       <Button
//                         id={eachUser._id}
//                         onClick={(e) => handleShow(e.target.id)}
//                       >
//                         ✎
//                       </Button>
//                     </td>
//                     <td>
//                       <Button
//                         id={eachUser._id}
//                         onClick={(e) => handleAccessModal(e.target.id)}
//                       >
//                         ✎
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </>
//           ) : null}
//         </tbody>
//       </Table>

//       {/* Modal to update user */}
//       <>
//         <Modal show={show} onHide={handleClose}>
//           <Modal.Header closeButton>
//             <Modal.Title>{filteredUser.name}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlInput1"
//               >
//                 <Form.Label>User Id</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.userId || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       userId: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlInput1"
//               >
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.name || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       name: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="name@example.com"
//                   value={filteredUser?.email || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       email: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Contact 1</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.contact1}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       contact1: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Contact 2</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.contact2 || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       contact2: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               {/* Department dropdown */}
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Department</Form.Label>
//                 <Select
//                   options={Object.keys(departmentRoles).map((dep) => ({
//                     label: dep,
//                     value: dep,
//                   }))}
//                   value={
//                     filteredUser?.department
//                       ? {
//                           label: filteredUser.department,
//                           value: filteredUser.department,
//                         }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       department: selected.value,
//                       role: "", // reset role when department changes
//                     });
//                   }}
//                 />
//               </Form.Group>

//               {/* Role dropdown dependent on department */}
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Role</Form.Label>
//                 <Select
//                   options={
//                     filteredUser?.department
//                       ? departmentRoles[filteredUser.department].map(
//                           (role) => ({
//                             label: role,
//                             value: role,
//                           })
//                         )
//                       : []
//                   }
//                   value={
//                     filteredUser?.role
//                       ? { label: filteredUser.role, value: filteredUser.role }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       role: selected.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               {/* IsActive dropdown */}
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Is Active</Form.Label>
//                 <Select
//                   options={[
//                     { label: "True", value: true },
//                     { label: "False", value: false },
//                   ]}
//                   value={
//                     filteredUser?.isActive === true
//                       ? { label: "True", value: true }
//                       : filteredUser?.isActive === false
//                       ? { label: "False", value: false }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       isActive: selected.value,
//                     });
//                   }}
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={handleClose}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </>

//       <>
//         <Modal show={showAccessModal} onHide={handleClose}>
//           <Modal.Header closeButton>
//             <Modal.Title>User Access</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlInput1"
//               >
//                 <Form.Label>Class Id</Form.Label>

//                 {["9", "10"].map((eachClass) => {
//                   return (
//                     <>
//                       <h1>{eachClass}</h1>
//                       <input
//                         type="checkbox"
//                         value={eachClass}
//                         checked={!!eachClass}
//                       />
//                     </>
//                   );
//                 })}
//               </Form.Group>

//               <Form.Group>
//                 <Form.Label>District</Form.Label>

//                 {console.log(districtSelectOptions)}
//                 <Select
//                   isMulti
//                   options={districtOptioins1}
//                   value={districtOptioins1}
//                 />
//               </Form.Group>

//               <Form.Group>
//                 <Form.Label>Block</Form.Label>

//                 {console.log(districtSelectOptions)}
//                 <Select
//                   isMulti
//                   options={districtOptioins1}
//                   value={districtOptioins1}
//                 />
//               </Form.Group>

//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlInput1"
//               >
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.name || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       name: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="name@example.com"
//                   value={filteredUser?.email || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       email: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Contact 1</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.contact1}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       contact1: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Contact 2</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={filteredUser?.contact2 || ""}
//                   onChange={(e) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       contact2: e.target.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               {/* Department dropdown */}
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Department</Form.Label>
//                 <Select
//                   options={Object.keys(departmentRoles).map((dep) => ({
//                     label: dep,
//                     value: dep,
//                   }))}
//                   value={
//                     filteredUser?.department
//                       ? {
//                           label: filteredUser.department,
//                           value: filteredUser.department,
//                         }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       department: selected.value,
//                       role: "", // reset role when department changes
//                     });
//                   }}
//                 />
//               </Form.Group>

//               {/* Role dropdown dependent on department */}
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Role</Form.Label>
//                 <Select
//                   options={
//                     filteredUser?.department
//                       ? departmentRoles[filteredUser.department].map(
//                           (role) => ({
//                             label: role,
//                             value: role,
//                           })
//                         )
//                       : []
//                   }
//                   value={
//                     filteredUser?.role
//                       ? { label: filteredUser.role, value: filteredUser.role }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       role: selected.value,
//                     });
//                   }}
//                 />
//               </Form.Group>

//               {/* IsActive dropdown */}
//               <Form.Group
//                 className="mb-3"
//                 controlId="exampleForm.ControlTextarea1"
//               >
//                 <Form.Label>Is Active</Form.Label>
//                 <Select
//                   options={[
//                     { label: "True", value: true },
//                     { label: "False", value: false },
//                   ]}
//                   value={
//                     filteredUser?.isActive === true
//                       ? { label: "True", value: true }
//                       : filteredUser?.isActive === false
//                       ? { label: "False", value: false }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     setFilteredUser({
//                       ...filteredUser,
//                       isActive: selected.value,
//                     });
//                   }}
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={handleClose}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </>
//     </Container>
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
  InputGroup,
} from "react-bootstrap";
import Select from "react-select"; // ✅ react-select for multi dropdowns
import {
  getAllUsersWithAccess,
  updateUserWithAccess,
} from "../service/User.service";
import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
import { GetDistrictBlockSchoolByParams } from "../service/DistrictBlockSchool.service";
import { getUsersByObjectId } from "../service/User.service";
import { useLocation , useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

export const UpdateUser = () => {
  const navigate = useNavigate();

  // -----------------------------
  // Hooks for filtering
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
    Accounts: ["Accountant"],
  };

  // Available roles for selected department (for filter dropdown)
  const [availableRoles, setAvailableRoles] = useState([]);

  // Handle department change in filters
  const handleDepartmentFilterChange = (selected) => {
    const dept = selected ? selected.value : "";
    setDepartment(dept);
    setRole(""); // Reset role when department changes
    
    // Update available roles for the role dropdown
    if (dept && departmentRoles[dept]) {
      setAvailableRoles(departmentRoles[dept]);
    } else {
      setAvailableRoles([]);
    }
  };

  // -----------------------------
  // Fetch Users
  const fetchUser = async () => {
    setLoading(true);
    const reqQuery = { page: page || 1 };

    if (name) reqQuery.name = name;
    if (userId) reqQuery.userId = userId;
    if (contact1) reqQuery.contact1 = contact1;
    if (contact2) reqQuery.contact2 = contact2;
    if (department) reqQuery.department = department;
    if (role) reqQuery.role = role;
    if (isActive) reqQuery.isActive = isActive;
    if (email) reqQuery.email = email;

    try {
      const response = await getAllUsersWithAccess(reqQuery);
      if (response.totalPages) setTotalPages(response.totalPages);

      //Console logging my users data.
      console.log(response.data);

      setUsers(response.data || []);
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [page]);

  // Reset filters
  const resetFilters = () => {
    setName("");
    setUserId("");
    setContact1("");
    setContact2("");
    setEmail("");
    setDepartment("");
    setRole("");
    setIsActive("");
    setAvailableRoles([]);
    setPage(1);
    fetchUser();
  };

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchUser();
  };

  //Modal to update user details
  const [show, setShow] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [filteredUser, setFilteredUser] = useState([]);

  const handleClose = () => {
    setShowAccessModal(false);
    setShow(false);
  };
  
  const handleShow = async (id) => {
    alert(id)
    const reqBody = {
      _id: id,
    };

    const response = await getUsersByObjectId(reqBody);
    console.log(response.data);
      
    navigate('/edit-user', {
      state:{
        fetchedAccessData: response
      }
    })
  };

  const [userAllSchoolIds, setUserAllSchoolIds] = useState([]);

  const handleAccessModal = async (id) => {
    alert (id)

    const reqBody = {
      _id: id,
    };

    const response = await getUsersByObjectId(reqBody);
    console.log(response)
  
    navigate('/edit-user-access', {
      state:{
        fetchedAccessData: response
      }
    })
  };

  //Fetching district_block_schools data
  const [dbDistrictBlockSchoolData, setDbDistrictBlockSchoolData] = useState([]);
  
  const fetchDistrictBlockSchool = async () => {
    try {
      const response = await GetDistrictBlockSchoolByParams();
      console.log(response.data);
      setDbDistrictBlockSchoolData(response.data);
    } catch (error) {
      console.log("Error::::>", error);
    }
  };

  useEffect(() => {
    fetchDistrictBlockSchool();
  }, []);

  let districtSelectOptions = [];
  const [districtOptioins1, setDistrictOptioins1] = useState([]);
  
  const districtOptions = async () => {
    console.log(userAllSchoolIds);

    filteredUser?.access?.region?.map((eachRegion, index) => {
      districtSelectOptions.push({
        label: eachRegion.districtId,
        value: eachRegion.districtId,
      });
    });

    console.log(
      filteredUser?.accessDetails?.region?.map((eachRegion, index) => {
        districtSelectOptions.push({
          label: eachRegion.districtId,
          value: eachRegion.districtId,
        });
      })
    );

    setDistrictOptioins1(districtSelectOptions);
  };

  //function to update filteredUserobject.
  const updateUserGeneralDetails = () => {
    console.log(filteredUser);
  };

  useEffect(() => {
    updateUserGeneralDetails();
  }, [filteredUser]);

  // Pagination component
  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === page}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev 
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        />
        {items}
        <Pagination.Next 
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container fluid>
      <h1 className="mb-4">User Management</h1>
      
      {/* Search and Filter Section */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaFilter className="me-2" /> Search & Filter Users
          </h5>
          <Button 
            variant="light" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              {/* Basic Search - Always Visible */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by User ID</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter user ID..."
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Contact</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter contact number..."
                      value={contact1}
                      onChange={(e) => setContact1(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            {/* Advanced Filters - Toggle Visibility */}
            {showFilters && (
              <>
                <hr />
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact 2 (Alternative)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter alternative contact..."
                        value={contact2}
                        onChange={(e) => setContact2(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Department</Form.Label>
                      <Select
                        options={Object.keys(departmentRoles).map((dep) => ({
                          label: dep,
                          value: dep,
                        }))}
                        value={department ? { label: department, value: department } : null}
                        onChange={handleDepartmentFilterChange}
                        isClearable
                        placeholder="Select Department"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Select
                        options={availableRoles.map((role) => ({
                          label: role,
                          value: role,
                        }))}
                        value={role ? { label: role, value: role } : null}
                        onChange={(selected) => setRole(selected ? selected.value : "")}
                        isClearable
                        placeholder="Select Role"
                        isDisabled={!department}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Select
                        options={[
                          { label: "Active", value: true },
                          { label: "Inactive", value: false },
                        ]}
                        value={
                          isActive === "true" ? { label: "Active", value: true } :
                          isActive === "false" ? { label: "Inactive", value: false } :
                          null
                        }
                        onChange={(selected) => setIsActive(selected ? selected.value.toString() : "")}
                        isClearable
                        placeholder="Select Status"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {/* Action Buttons */}
            <Row className="mt-3">
              <Col className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={resetFilters}>
                  <FaTimes className="me-2" /> Reset Filters
                </Button>
                <Button variant="primary" type="submit">
                  <FaSearch className="me-2" /> Search Users
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Count */}
      <Row className="mb-3">
        <Col>
          <h6>
            Total Users Found: <span className="text-primary">{users.length}</span>
          </h6>
        </Col>
      </Row>

      {/* Users Table */}
      <Table striped bordered hover responsive>
        <thead className="bg-light">
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact 1</th>
            <th>Contact 2</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Edit General</th>
            <th>Edit Access</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="11" className="text-center">
                <div className="text-primary">Loading users...</div>
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((eachUser, index) => {
              return (
                <tr key={eachUser._id}>
                  <td>{index + 1}</td>
                  <td>{eachUser.userId}</td>
                  <td>{eachUser.name}</td>
                  <td>{eachUser.email}</td>
                  <td>{eachUser.contact1}</td>
                  <td>{eachUser.contact2 || '-'}</td>
                  <td>{eachUser.department}</td>
                  <td>{eachUser.role}</td>
                  <td>
                    <span className={`badge ${eachUser.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {eachUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      id={eachUser._id}
                      onClick={(e) => handleShow(e.target.id)}
                    >
                      ✎ Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      id={eachUser._id}
                      onClick={(e) => handleAccessModal(e.target.id)}
                    >
                      ✎ Access
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                <div className="text-muted">No users found matching your criteria</div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}

      {/* Modals remain the same */}
      {/* Modal to update user */}
      <>
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{filteredUser.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User Id</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.userId || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      userId: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.name || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      name: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={filteredUser?.email || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact 1</Form.Label>
                    <Form.Control
                      type="text"
                      value={filteredUser?.contact1}
                      onChange={(e) => {
                        setFilteredUser({
                          ...filteredUser,
                          contact1: e.target.value,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact 2</Form.Label>
                    <Form.Control
                      type="text"
                      value={filteredUser?.contact2 || ""}
                      onChange={(e) => {
                        setFilteredUser({
                          ...filteredUser,
                          contact2: e.target.value,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Department dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Select
                  options={Object.keys(departmentRoles).map((dep) => ({
                    label: dep,
                    value: dep,
                  }))}
                  value={
                    filteredUser?.department
                      ? {
                          label: filteredUser.department,
                          value: filteredUser.department,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      department: selected.value,
                      role: "", // reset role when department changes
                    });
                  }}
                />
              </Form.Group>

              {/* Role dropdown dependent on department */}
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Select
                  options={
                    filteredUser?.department
                      ? departmentRoles[filteredUser.department].map(
                          (role) => ({
                            label: role,
                            value: role,
                          })
                        )
                      : []
                  }
                  value={
                    filteredUser?.role
                      ? { label: filteredUser.role, value: filteredUser.role }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      role: selected.value,
                    });
                  }}
                />
              </Form.Group>

              {/* IsActive dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Is Active</Form.Label>
                <Select
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  value={
                    filteredUser?.isActive === true
                      ? { label: "True", value: true }
                      : filteredUser?.isActive === false
                      ? { label: "False", value: false }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      isActive: selected.value,
                    });
                  }}
                />
              </Form.Group>
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
      </>

      {/* Access Modal - Keep as is */}
      <>
        <Modal show={showAccessModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>User Access - {filteredUser?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Your existing access modal content */}
              <Form.Group className="mb-3">
                <Form.Label>Class Id</Form.Label>
                <div>
                  {["9", "10"].map((eachClass) => (
                    <Form.Check
                      key={eachClass}
                      type="checkbox"
                      label={`Class ${eachClass}`}
                      value={eachClass}
                      className="mb-2"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Select isMulti options={districtOptioins1} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Block</Form.Label>
                <Select isMulti options={districtOptioins1} />
              </Form.Group>
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
      </>
    </Container>
  );
};