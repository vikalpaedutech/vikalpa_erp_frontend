import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

import {
  School_drop_down,
  Batch_drop_down,
} from "../Utils/DependentDropDowns.v2";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

import {
  GetMBStudents,
  MarkMBStudentAttendance,
} from "../../service/Student.service";

import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Row,
  Col,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";

import {
  FaThLarge,
  FaTable,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
  FaCheck,
  FaTimes,
  FaFilter,
} from "react-icons/fa";
import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";

import { getstudentAddRequest, studentAddUpdatedApi } from "../../service/Student.service";

export const StudentAddRequest = () => {

  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);

  const [studentsData, setStudentsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [uniqueDistricts, setUniqueDistricts] = useState([]);
  const [uniqueSchools, setUniqueSchools] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' or 'reject'

  console.log(userData);

  // Function to extract unique district IDs from userData
  const getUniqueDistrictIds = useCallback(() => {
    if (!userData?.userAccess?.region) {
      return [];
    }

    const districtIds = userData.userAccess.region.map(
      (region) => region.districtId
    );
    
    const uniqueDistrictIds = [...new Set(districtIds)];
    return uniqueDistrictIds;
  }, [userData]);

  const fetchStudentAddOrRemoveRequestData = async () => {
    setLoading(true);
    setError(null);

    const uniqueDistrictIds = getUniqueDistrictIds();

    if (uniqueDistrictIds.length === 0) {
      setError("No districts found in user data");
      setLoading(false);
      return;
    }

    const reqBody = {
      districtIds: uniqueDistrictIds,
      request: "Added",
      requestStatus: "Pending"
    };

    console.log("Request Body:", reqBody);

    try {
      const response = await getstudentAddRequest(reqBody);
      console.log("API Response:", response);
      
      if (response.success) {
        const data = response.data || [];
        setStudentsData(data);
        setFilteredData(data);
        
        // Extract unique districts and schools for filters
        const districts = [...new Set(data.map(item => item.districtName || item.districtId).filter(Boolean))];
        const schools = [...new Set(data.map(item => item.schoolName || item.schoolId).filter(Boolean))];
        setUniqueDistricts(districts);
        setUniqueSchools(schools);
        
        setSuccessMessage(`Successfully fetched ${response.count || data.length} students`);
        console.log("Students Data:", data);
        console.log("Total Count:", response.count);
      } else {
        setError(response.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching student requests:", error);
      setError(error.message || "Failed to fetch student requests");
    } finally {
      setLoading(false);
    }
  };

  // Handle Approve/Reject action
  const handleAction = async () => {
    if (!selectedStudent || !actionType) return;

    setUpdatingId(selectedStudent._id);
    setShowModal(false);

    const reqBody = {
      studentId: selectedStudent._id,
      requestStatus: actionType === "approve" ? "Approved" : "Rejected",
      approvedByUserId: userData?._id
    };

    console.log("Update Request Body:", reqBody);

    try {
      const response = await studentAddUpdatedApi(reqBody);
      console.log("Update Response:", response);
      
      if (response.success) {
        setSuccessMessage(
          `Student ${selectedStudent.firstName} request ${actionType === "approve" ? "approved" : "rejected"} successfully!`
        );
        // Refresh data
        await fetchStudentAddOrRemoveRequestData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update request");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error updating student request:", error);
      setError(error.message || "Failed to update student request");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdatingId(null);
      setSelectedStudent(null);
      setActionType("");
    }
  };

  // Open modal for approve/reject
  const openModal = (student, type) => {
    setSelectedStudent(student);
    setActionType(type);
    setShowModal(true);
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = studentsData;
    
    if (selectedDistrict) {
      filtered = filtered.filter(item => 
        (item.districtName === selectedDistrict || item.districtId === selectedDistrict)
      );
    }
    
    if (selectedSchool) {
      filtered = filtered.filter(item => 
        (item.schoolName === selectedSchool || item.schoolId === selectedSchool)
      );
    }
    
    setFilteredData(filtered);
  }, [studentsData, selectedDistrict, selectedSchool]);

  // Apply filters when filter criteria change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Auto fetch on component mount
  useEffect(() => {
    if (userData?.userAccess?.region) {
      fetchStudentAddOrRemoveRequestData();
    }
  }, [userData]);

  // Reset filters
  const resetFilters = () => {
    setSelectedDistrict("");
    setSelectedSchool("");
    setFilteredData(studentsData);
  };

  return (
    <>
      <Container fluid className="mt-3 mb-3">
        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
            <FaCheck className="me-2" />
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <FaTimes className="me-2" />
            {error}
          </Alert>
        )}

        {/* Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className={actionType === "approve" ? "bg-success text-white" : "bg-danger text-white"}>
            <Modal.Title>
              {actionType === "approve" ? (
                <><FaCheck className="me-2" /> Confirm Approve</>
              ) : (
                <><FaTimes className="me-2" /> Confirm Reject</>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to <strong>{actionType}</strong> the following student request?
            </p>
            <Card className="bg-light">
              <Card.Body>
                <p><strong>Name:</strong> {selectedStudent?.firstName} {selectedStudent?.lastName || ""}</p>
                <p><strong>SRN:</strong> {selectedStudent?.studentSrn}</p>
                <p><strong>Father's Name:</strong> {selectedStudent?.fatherName}</p>
                <p><strong>School:</strong> {selectedStudent?.schoolName || selectedStudent?.schoolId}</p>
                <p><strong>Request:</strong> {selectedStudent?.request}</p>
                <p><strong>Current Status:</strong> {selectedStudent?.requestStatus}</p>
              </Card.Body>
            </Card>
            {actionType === "approve" ? (
              <p className="text-success mt-3">
                <FaCheck className="me-1" />
                This will approve the student request.
              </p>
            ) : (
              <p className="text-danger mt-3">
                <FaTimes className="me-1" />
                This will reject the student request.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === "approve" ? "success" : "danger"} 
              onClick={handleAction}
              disabled={updatingId === selectedStudent?._id}
            >
              {updatingId === selectedStudent?._id ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                `Confirm ${actionType === "approve" ? "Approve" : "Reject"}`
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Filters Card */}
        <Row className="mb-3">
          <Col xs={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white py-2">
                <FaFilter className="me-2" />
                Filters
              </Card.Header>
              <Card.Body className="py-2">
                <Row className="g-2 align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold small">District</Form.Label>
                      <Form.Select 
                        value={selectedDistrict} 
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        size="sm"
                      >
                        <option value="">All Districts</option>
                        {uniqueDistricts.map((district, index) => (
                          <option key={index} value={district}>
                            {district}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold small">School</Form.Label>
                      <Form.Select 
                        value={selectedSchool} 
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        size="sm"
                      >
                        <option value="">All Schools</option>
                        {uniqueSchools.map((school, index) => (
                          <option key={index} value={school}>
                            {school}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={resetFilters}
                        className="flex-grow-1"
                      >
                        Reset Filters
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={fetchStudentAddOrRemoveRequestData}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            Loading...
                          </>
                        ) : (
                          "Refresh"
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Card */}
        <Row className="mb-3">
          <Col xs={12}>
            <Card className="shadow-sm">
              <Card.Body className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Total Requests:</strong> {filteredData.length}
                    {studentsData.length !== filteredData.length && (
                      <span className="text-muted ms-2">
                        (Filtered from {studentsData.length})
                      </span>
                    )}
                  </div>
                  <div className="d-flex gap-3">
                    <Badge bg="warning" className="px-3 py-2">
                      Pending: {filteredData.filter(s => s.requestStatus === "Pending").length}
                    </Badge>
                    <Badge bg="success" className="px-3 py-2">
                      Approved: {filteredData.filter(s => s.requestStatus === "Approved").length}
                    </Badge>
                    <Badge bg="danger" className="px-3 py-2">
                      Rejected: {filteredData.filter(s => s.requestStatus === "Rejected").length}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3">Loading student requests...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>SRN</th>
                  <th>Student Name</th>
                  <th>Father's Name</th>
                  <th>District</th>
                  <th>School</th>
                  <th>Request</th>
                  <th>Request Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student, index) => (
                  <tr key={student._id || index}>
                    <td>{index + 1}</td>
                    <td>{student.studentSrn || "N/A"}</td>
                    <td>
                      <strong>{student.firstName || "N/A"}</strong>
                      {student.lastName && ` ${student.lastName}`}
                    </td>
                    <td>{student.fatherName || "N/A"}</td>
                    <td>{student.districtName || student.districtId || "N/A"}</td>
                    <td>{student.schoolName || student.schoolId || "N/A"}</td>
                    <td>
                      <Badge bg="info">{student.request || "N/A"}</Badge>
                    </td>
                    <td>
                      <Badge 
                        bg={
                          student.requestStatus === "Approved" ? "success" :
                          student.requestStatus === "Rejected" ? "danger" :
                          student.requestStatus === "Pending" ? "warning" :
                          "secondary"
                        }
                      >
                        {student.requestStatus || "N/A"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => openModal(student, "approve")}
                          disabled={
                            student.requestStatus === "Approved" || 
                            student.requestStatus === "Rejected" ||
                            updatingId === student._id
                          }
                          title="Approve Request"
                        >
                          {updatingId === student._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaCheck />
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openModal(student, "reject")}
                          disabled={
                            student.requestStatus === "Approved" || 
                            student.requestStatus === "Rejected" ||
                            updatingId === student._id
                          }
                          title="Reject Request"
                        >
                          {updatingId === student._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaTimes />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-5 bg-light rounded">
            <p className="text-muted mb-0">No student requests found</p>
          </div>
        )}

        <style>{`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .table-responsive {
            max-height: 70vh;
            overflow-y: auto;
          }
          .table th, .table td {
            white-space: nowrap;
          }
        `}</style>
      </Container>
    </>
  );
};