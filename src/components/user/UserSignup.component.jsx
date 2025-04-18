import React, { useEffect, useState, useContext } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { createUser } from "../../service/User.service.js"; // Import the service
import Select from 'react-select';

//importing context api
import { DistrictBlockSchoolContext, BlockContext,  SchoolContext} from "../contextAPIs/DependentDropdowns.contextAPI";


//Importing dependent drop down.
import {DistrictBlockSchool, District} from "../DependentDropDowns/DistrictBlockSchool.component.jsx"

const UserSignup = () => {

    //  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
    //      const [blockContext, setBlockContext] = useState (DistrictBlockSchoolContext);
    //         const [schoolContext, setSchoolContext] = useState (DistrictBlockSchoolContext);


            const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
                const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
                const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
     
    
    
        //_______________________________________


        //In below code block, i am taking out district id which is storec in districtContext as an object of {value as districtId, label as districtName}
        //...what it does is, it stores the district id in array, like this: ["1", "2"]. Because backend accepts array
        let districtContextArray = districtContext.map((eachValue)=> eachValue.value)
       
       console.log("i am dsitrictlskfjlakfjlkfj", districtContextArray, blockContext, schoolContext)
       console.log(...districtContextArray)


        //For block
        let blockContextArray = blockContext.map((eachValue)=> eachValue.value)
       // console.log("i am block sdkfhskjfhsjf", blockContextArray)
       // console.log(...blockContextArray)
        


        //For school

        let schoolContextArray = schoolContext.map((eachValue)=> eachValue.value)
       // console.log("i am school sdkfhskjfhsjf", schoolContextArray)
       // console.log(...schoolContextArray)
        
        //_______________________________________________


  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    contact1: "",
    contact2: "",
    department: "",
    role: "",
    assignmentLevel: "School",
    isAdmin: false,
    assignedDistricts: [...districtContextArray],
    assignedBlocks: [...blockContextArray],
    assignedSchools: [...schoolContextArray],
    districtIds: [],
    blockIds: [],
    schoolIds: [],
    classId: [],
    studentId: "",
    permission: { create: false, read: false, update: false, delete: false },
    accessModules: [],
    isActive: true,
    profileImage: "",
  });

  const [roles, setRoles] = useState({});
  const [classOfStudent, setClassOfStudent] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const deptAndRole = [
    { "Operations": ["Manager", "T.L", "Incharge"] },
    { "Community": ["Manager", "Incharge", "T.L", "ACI", "CC"] },
    { "Academics": ["Teacher", "Academic-Coordinator", "DTP", "Presenter", "TL", "Manager"] },
    { "Media": ["Manager", "TL", "Editor"] },
    { "Tech": ["MIS", "Tech Lead"] }
  ];

  const classOptions = [
    { value: "9", label: "9" },
    { value: "10", label: "10" }
  ];

  const handleChange = (e) => {
   
  
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === "department") {
      const selectedDept = deptAndRole.find(dept => dept[value]);
      if (selectedDept) {
        setRoles({ [value]: "" });
        setFormData(prev => ({
          ...prev,
          department: value,
          role: "",
        }));
      }
    }

    if (name === "role") {
      setRoles({ [formData.department]: value });
    }
  };

  const handleClassChange = (selectedOptions) => {
    const selectedClasses = selectedOptions.map(option => option.value);
    
    setClassOfStudent(selectedOptions);
    setFormData(prev => ({
      ...prev,
      classId: selectedClasses
    }));
  };

  // Handle district/block/school selection from child components
  const handleLocationSelection = (type, values) => {
    setFormData(prev => ({
      ...prev,
      [`assigned${type}s`]: values, // e.g., assignedDistricts
      [`${type.toLowerCase()}Ids`]: values // e.g., districtIds
    }));
  };

  const handleSubmit = async (e) => {
    alert(' i got clicked')
    console.log("i am district context inside handle submit,", districtContext)
    console.log(Object.values(districtContext))
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the data according to your model
      const userData = {
        ...formData,
        // Ensure arrays are properly formatted
        assignedDistricts:districtContextArray,
        assignedBlocks:blockContextArray,
        assignedSchools:schoolContextArray,
        //assignedDistricts: Array.isArray(formData.assignedDistricts) ? formData.assignedDistricts : [],
       // assignedBlocks: Array.isArray(formData.assignedBlocks) ? formData.assignedBlocks : [],
       // assignedSchools: Array.isArray(formData.assignedSchools) ? formData.assignedSchools : [],

       districtIds:districtContextArray,
       blockIds:blockContextArray,
       schoolIds:schoolContextArray,

        // districtIds: Array.isArray(formData.districtIds) ? formData.districtIds : [],
        // blockIds: Array.isArray(formData.blockIds) ? formData.blockIds : [],
        // schoolIds: Array.isArray(formData.schoolIds) ? formData.schoolIds : [],
         classId: Array.isArray(formData.classId) ? formData.classId : [],
      };

      // Call the service
     const response = await createUser(userData);
      
    console.log("User created successfully:", response);
      alert("User created successfully!");
      
      // Reset form after successful submission
      setFormData({
        userId: "",
        name: "",
        email: "",
        password: "",
        contact1: "",
        contact2: "",
        department: "",
        role: "",
        assignmentLevel: "School",
        isAdmin: false,
        assignedDistricts: [],
        assignedBlocks: [],
        assignedSchools: [],
        districtIds: [],
        blockIds: [],
        schoolIds: [],
        classId: [],
        studentId: "",
        permission: { create: false, read: false, update: false, delete: false },
        accessModules: [],
        isActive: true,
        profileImage: "",
      });
      setClassOfStudent([]);
      setRoles({});
      
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.response?.data?.message || "Failed to create user");
      alert(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container  className="user-sign-in-container d-flex justify-content-center align-items-center"
    fluid
    style={{ minHeight: "100vh" }}>


      


<Card style={{ width: "50rem", borderRadius: "20px" }} className="justify-content-center">
        <Card.Body className="user-sign-in-card-body">
          <Card.Title className="text-center">
            Mission Buniyaad 
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted text-center">
            ERP-Signup
          </Card.Subtitle>
          <Card.Text>
          <Row className="justify-content-center">
        <Col md={6}>
        
          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            {/* Department Dropdown */}
            <Form.Group controlId="department" className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {deptAndRole.map((dept, index) => {
                  const deptName = Object.keys(dept)[0];
                  return (
                    <option key={index} value={deptName}>
                      {deptName}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            {/* Role Dropdown */}
            <Form.Group controlId="role" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {deptAndRole
                  .find(dept => dept[formData.department])
                  ?.[formData.department]?.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            {/* User ID */}
            <Form.Group controlId="userId" className="mb-3">
              <Form.Label>User ID/Employee ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {Object.values(roles).includes("CC") ? (
              <div className="mb-3">
                <DistrictBlockSchool 
                  // onDistrictSelect={(districts) => handleLocationSelection("District", districts)}
                  // onBlockSelect={(blocks) => handleLocationSelection("Block", blocks)}
                  // onSchoolSelect={(schools) => handleLocationSelection("School", schools)}
                />
                
                {/* Class Dropdown */}
                <Form.Group controlId="classId">
                  <Form.Label>Class (Select multiple if needed)</Form.Label>
                  <Select
                    isMulti
                    name="classes"
                    options={classOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleClassChange}
                    value={classOfStudent}
                    placeholder="Select classes..."
                  />
                </Form.Group>
              </div>
            ) : (
              <div>
                {Object.values(roles).includes("ACI") ? (
                  <District 
                    // onDistrictSelect={(districts) => handleLocationSelection("District", districts)}
                  />
                ) : null}
              </div>
            )}

            {/* Email */}
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
           
            {/* Contact 1 */}
            <Form.Group controlId="contact1" className="mb-3">
              <Form.Label>Primary Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter primary contact"
                name="contact1"
                value={formData.contact1}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Contact 2 */}
            <Form.Group controlId="contact2" className="mb-3">
              <Form.Label>Whatsapp Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter secondary contact"
                name="contact2"
                value={formData.contact2}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </Form>
        </Col>
      </Row>
          </Card.Text>
          <div>
            <p>New user click here to create accoutn: <Card.Link href="#">Another Link</Card.Link> </p>
         
          </div>
          
        </Card.Body>
      </Card>


















      
    </Container>
  );
};

export default UserSignup;