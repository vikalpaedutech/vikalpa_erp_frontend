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
// import { useLocation, useNavigate } from "react-router-dom";
// import { updateUser } from "../service/User.service";

// export const EditUser = () => {
 

// const location = useLocation();
    
// const userAccessData = location.state?.fetchedAccessData


// console.log('Hello i am edit user')
// console.log(userAccessData)









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
// return(
//     <Container>

//     </Container>
// )

// };









// src/components/EditUser.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../service/User.service";

// Department-Roles mapping
const departmentRoles = {
  Community: ["CC", "ACI", "Community Incharge", "Project Coordinator", "Community Manager", "Technician", "hkrn"],
  Academics: ["Academic-Coordinator", "DTP", "Teacher"],
  Admin: ["Admin"],
  HR: ["HR Executive", "HR Manager"],
  Media: ["Media Manager", "Photographer"],
  Tech: ["MIS", "Data Analyst", "Tech Lead"],
  Accounts: ["Accountant"],
  Operations: ["admin", "operator", "manager"],
};

export const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user data from location state
  const userData = location.state?.fetchedAccessData;
  
  // Get the actual user object (handling the nested data structure)
  const actualUser = userData?.data?.[0] || null;
  
  console.log("Actual user data:", actualUser);
  
  // State for form data
  const [formData, setFormData] = useState({
    _id: "",
    userId: "",
    name: "",
    email: "",
    contact1: "",
    contact2: "",
    department: "",
    role: "",
    isActive: true,
    longitude: "",
    latitude: "",
    avgScore: 0,
    totalPoints: "0",
    rank: 0,
  });

  // State for available roles based on selected department
  const [availableRoles, setAvailableRoles] = useState([]);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (actualUser) {
      console.log("Setting form data with user:", actualUser);
      console.log("User department:", actualUser.department);
      console.log("User role:", actualUser.role);
      
      setFormData({
        _id: actualUser._id || "",
        userId: actualUser.userId || "",
        name: actualUser.name || "",
        email: actualUser.email || "",
        contact1: actualUser.contact1 || "",
        contact2: actualUser.contact2 || "",
        department: actualUser.department || "",
        role: actualUser.role || "",
        isActive: actualUser.isActive !== undefined ? actualUser.isActive : true,
        longitude: actualUser.longitude || "",
        latitude: actualUser.latitude || "",
        avgScore: actualUser.avgScore || 0,
        totalPoints: actualUser.totalPoints || "0",
        rank: actualUser.rank || 0,
      });

      // Set available roles based on user's department
      if (actualUser.department && departmentRoles[actualUser.department]) {
        console.log("Setting available roles for department:", actualUser.department);
        setAvailableRoles(departmentRoles[actualUser.department]);
      } else {
        setAvailableRoles([]);
      }
    }
  }, [actualUser]);

  // Handle department change
  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    console.log("Department changed to:", dept);
    setFormData({ ...formData, department: dept, role: "" });
    setAvailableRoles(departmentRoles[dept] || []);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for API
      const updateData = {
        _id: formData._id,
        userId: formData.userId,
        name: formData.name,
        email: formData.email,
        contact1: formData.contact1,
        contact2: formData.contact2 || undefined,
        department: formData.department,
        role: formData.role,
        isActive: formData.isActive,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        avgScore: formData.avgScore,
        totalPoints: formData.totalPoints,
        rank: formData.rank,
      };

      console.log("Updating user with data:", updateData);
      
      const response = await updateUser(updateData);
      
      if (response.status === "Success") {
        setModalMessage("User updated successfully!");
        setShowSuccessModal(true);
      } else {
        setModalMessage(response.message || "Failed to update user");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setModalMessage(error.response?.data?.message || "Error updating user. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation after success
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate(-1); // Go back to previous page
  };

  if (!userData || !actualUser) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>No User Data Found</Alert.Heading>
          <p>
            No user data found. Please go back and select a user to edit.
            <br />
            <small className="text-muted">
              Debug info: State received: {JSON.stringify(location.state)}
            </small>
          </p>
        </Alert>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="secondary" onClick={() => navigate('/users')}>
            Go to Users List
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Edit User: {formData.name}</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* User ID */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>User ID <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>

              {/* Name */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Contact 1 */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact 1 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="contact1"
                    value={formData.contact1}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Contact 2 */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact2"
                    value={formData.contact2}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Department - Dropdown */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleDepartmentChange}
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

              {/* Role - Dependent Dropdown */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Active Status */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Active User"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Location Fields */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Enter longitude"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Enter latitude"
                  />
                </Form.Group>
              </Col>

              {/* Gamification Fields */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Avg Score</Form.Label>
                  <Form.Control
                    type="number"
                    name="avgScore"
                    value={formData.avgScore}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Points</Form.Label>
                  <Form.Control
                    type="text"
                    name="totalPoints"
                    value={formData.totalPoints}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Rank</Form.Label>
                  <Form.Control
                    type="number"
                    name="rank"
                    value={formData.rank}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Updating...</span>
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleSuccessClose} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSuccessClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};