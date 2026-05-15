import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { Container, Card, Button, Spinner, Row, Col, Alert, Form, Badge, Modal } from "react-bootstrap";
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaDownload, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import { GetTests } from "../../service/ExamAndTestController";
import { getStudentMarksByExam, updateMarksByExamAndStudent } from "../../service/Marks.services";

export const MBMarksUpload = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marksFormData, setMarksFormData] = useState({
    marksObtained: '',
    remark: '',
    fileUrl: ''
  });
  const [updatingMarks, setUpdatingMarks] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    examAndTestId: null,
    batch: null,
    isSlcTaken: false,
    schoolId: null,
    districtId: null,
    blockId: null
  });

  // Fetch exams on component mount
  const fetchExamAndTest = async () => {
    try {
      const response = await GetTests();
      console.log("Full response:", response);
      
      let examsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          examsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          examsData = response.data.data;
        } else if (typeof response.data === 'object') {
          examsData = [response.data];
        }
      } else if (Array.isArray(response)) {
        examsData = response;
      }
      
      console.log("Exams data:", examsData);
      setExams(examsData);
    } catch (error) {
      console.log("Error fetching exams:", error);
      setError("Failed to fetch exams");
    }
  };

  useEffect(() => {
    fetchExamAndTest();
  }, []);

  // Update filters when context changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      batch: batchContext?.batch || null,
      schoolId: schoolContext?.schoolId || null,
      isSlcTaken: false
    }));
  }, [batchContext, schoolContext]);

  // Fetch students marks when exam is selected
  const fetchStudentMarks = async () => {
    if (!filters.examAndTestId || !filters.batch || filters.schoolId === null) {
      console.log("Missing filters:", filters);
      return;
    }

    setLoading(true);
    setError(null);

    const reqBody = {
      examAndTestId: filters.examAndTestId,
      batch: filters.batch,
      isSlcTaken: filters.isSlcTaken,
      schoolId: filters.schoolId,
      districtId: filters.districtId,
      blockId: filters.blockId
    };

    console.log("Fetching marks with:", reqBody);

    try {
      const response = await getStudentMarksByExam(reqBody);
      console.log("Student marks response:", response);
      
      let studentsData = [];
      if (response.data?.students) {
        studentsData = response.data.students;
      } else if (response.students) {
        studentsData = response.students;
      } else if (Array.isArray(response.data)) {
        studentsData = response.data;
      }
      
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching student marks:", error);
      setError("Failed to fetch student marks. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle exam selection
  const handleExamChange = (e) => {
    const examId = e.target.value;
    const selectedExamData = exams.find(exam => exam._id === examId);
    setSelectedExam(selectedExamData);
    setFilters(prev => ({
      ...prev,
      examAndTestId: examId
    }));
  };

  // Handle open modal for updating marks
  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setMarksFormData({
      marksObtained: student.marksObtained || '',
      remark: student.remark || '',
      fileUrl: student.fileUrl || ''
    });
    setShowModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setMarksFormData({
      marksObtained: '',
      remark: '',
      fileUrl: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarksFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle update marks submission
  const handleUpdateMarks = async () => {
    if (!selectedStudent || !selectedExam) return;

    // Validate marks
    const marksValue = parseFloat(marksFormData.marksObtained);
    if (isNaN(marksValue) || marksValue < 0) {
      setError("Please enter valid marks");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (marksValue > selectedExam.maxMarks) {
      setError(`Marks cannot exceed ${selectedExam.maxMarks}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUpdatingMarks(true);
    setError(null);

    const reqBody = {
      examAndTestUnqObjectId: filters.examAndTestId,
      unqStudentObjectId: selectedStudent._id,
      studentSrn: selectedStudent.studentSrn,
      firstName: selectedStudent.firstName,
      fatherName: selectedStudent.fatherName,
      districtId: selectedStudent.districtId,
      blockId: selectedStudent.blockId,
      schoolId: selectedStudent.schoolId,
      classofStudent: selectedStudent.classofStudent,
      marksObtained: marksFormData.marksObtained,
      remark: marksFormData.remark,
      fileUrl: marksFormData.fileUrl,
      recordedBy: userData?._id || "admin"
    };

    console.log("Updating marks with:", reqBody);

    try {
      const response = await updateMarksByExamAndStudent(reqBody);
      console.log("Update response:", response);
      
      if (response.success) {
        // setSuccessMessage(`Marks updated successfully for ${selectedStudent.firstName}`);
        
        // Update the student in the list
        setStudents(prevStudents => 
          prevStudents.map(s => 
            s._id === selectedStudent._id 
              ? { 
                  ...s, 
                  marksObtained: marksFormData.marksObtained,
                  remark: marksFormData.remark,
                  fileUrl: marksFormData.fileUrl,
                  isMarksRecordExist: true,
                  marksUpdatedOn: new Date().toISOString()
                }
              : s
          )
        );
        
        // Close modal and clear form
        handleCloseModal();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update marks");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error updating marks:", error);
      setError("Failed to update marks. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdatingMarks(false);
    }
  };

  // Fetch marks when exam is selected or filters change
  useEffect(() => {
    if (filters.examAndTestId && filters.batch && filters.schoolId) {
      fetchStudentMarks();
    }
  }, [filters.examAndTestId, filters.batch, filters.schoolId]);

  // Card View for displaying students with marks
  const MarksCardView = () => (
    <Row className="g-3 mt-3">
      {students && students.length > 0 ? (
        students.map((student, index) => {
          const hasMarks = student.isMarksRecordExist;
          const marksObtained = student.marksObtained;
          
          return (
            <Col xs={12} md={6} lg={4} key={student._id || index}>
              <Card className="h-100 shadow-sm">
                <Card.Header className={hasMarks ? "bg-success text-white" : "bg-secondary text-white"}>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{student.firstName || 'NA'}</strong>
                    <span className="badge bg-light text-dark">
                      #{student.rollNumber || 'N/A'}
                    </span>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <Col xs={6}>
                      <small className="text-muted">Student SRN:</small>
                      <p className="mb-0 fw-bold">{student.studentSrn || 'N/A'}</p>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted">Father's Name:</small>
                      <p className="mb-0">{student.fatherName || 'N/A'}</p>
                    </Col>
                  </Row>
                  
                  <Row className="mb-2">
                    <Col xs={12}>
                      <small className="text-muted">Batch:</small>
                      <p className="mb-0">{student.batch || 'N/A'}</p>
                    </Col>
                  </Row>

                  <hr />

                  <Row>
                    <Col xs={12}>
                      <div className="text-center">
                        {hasMarks ? (
                          <>
                            <h3 className="text-success">
                              {marksObtained}
                            </h3>
                            {student.remark && (
                              <div className="mt-2">
                                <small className="text-muted">Remark: {student.remark}</small>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-muted">
                            <FaTimesCircle className="me-1" />
                            <p className="mb-0">Marks not uploaded yet</p>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Button
                    variant={hasMarks ? "primary" : "success"}
                    className="w-100"
                    size="sm"
                    onClick={() => handleOpenModal(student)}
                  >
                    {hasMarks ? (
                      <>
                        <FaEdit className="me-1" /> Edit Marks
                      </>
                    ) : (
                      <>
                        <FaDownload className="me-1" /> Upload Marks
                      </>
                    )}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })
      ) : (
        <Col xs={12}>
          <div className="text-center text-muted py-5">
            {filters.examAndTestId ? "No students found for selected filters" : "Please select an exam to view student marks"}
          </div>
        </Col>
      )}
    </Row>
  );

  return (
    <Container fluid className="mt-4 mb-4">
      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
          <Alert.Heading>Success!</Alert.Heading>
          <p>{successMessage}</p>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Filters Section */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Exam</Form.Label>
                    <Form.Select 
                      value={filters.examAndTestId || ""} 
                      onChange={handleExamChange}
                    >
                      <option value="">-- Select Exam --</option>
                      {exams && exams.length > 0 ? (
                        exams.map((exam) => (
                          <option key={exam._id} value={exam._id}>
                            {exam.examId} - {exam.subject} ({exam.examType})
                          </option>
                        ))
                      ) : (
                        <option disabled>No exams available</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <School_drop_down />
                </Col>
                <Col md={4}>
                  <Batch_drop_down />
                </Col>
              </Row>
              
              {/* Selected Exam Info */}
              {selectedExam && (
                <Row className="mt-2">
                  <Col xs={12}>
                    <Alert variant="info" className="mb-0">
                      <strong>Selected Exam Details:</strong><br />
                      Subject: {selectedExam.subject} | Type: {selectedExam.examType} | 
                      {/* Max Marks: {selectedExam.maxMarks} | Date: {selectedExam.examDate ? new Date(selectedExam.examDate).toLocaleDateString() : 'N/A'} */}
                      {selectedExam.passingMarks && ` | Passing Marks: ${selectedExam.passingMarks}`}
                    </Alert>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students Marks Section */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-0">Student Marks</h5>
                {students && students.length > 0 && (
                  <Badge bg="light" text="dark" className="ms-2">
                    Total: {students.length} Students | 
                    With Marks: {students.filter(s => s.isMarksRecordExist).length} | 
                    Without Marks: {students.filter(s => !s.isMarksRecordExist).length}
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading student marks...</p>
                </div>
              ) : (
                <MarksCardView />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Update Marks Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedStudent?.isMarksRecordExist ? "Edit Marks" : "Upload Marks"} - {selectedStudent?.firstName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={`${selectedStudent.firstName} ${selectedStudent.fatherName}`}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student SRN</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={selectedStudent.studentSrn}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Roll Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={selectedStudent.rollNumber}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Batch</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={selectedStudent.batch}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Marks Obtained *</Form.Label>
                    <Form.Control 
                      type="number"
                      name="marksObtained"
                      value={marksFormData.marksObtained}
                      onChange={handleInputChange}
                      placeholder={`Enter marks (Max: ${selectedExam?.maxMarks})`}
                      isInvalid={marksFormData.marksObtained > selectedExam?.maxMarks}
                    />
                    <Form.Control.Feedback type="invalid">
                      Marks cannot exceed {selectedExam?.maxMarks}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Maximum marks: {selectedExam?.maxMarks}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Percentage</Form.Label>
                    <Form.Control 
                      type="text"
                      value={marksFormData.marksObtained && selectedExam?.maxMarks 
                        ? `${((marksFormData.marksObtained / selectedExam.maxMarks) * 100).toFixed(2)}%`
                        : 'N/A'}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Remark</Form.Label>
                <Form.Control 
                  as="textarea"
                  name="remark"
                  rows={3}
                  value={marksFormData.remark}
                  onChange={handleInputChange}
                  placeholder="Enter any remarks (optional)"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>File URL</Form.Label>
                <Form.Control 
                  type="text"
                  name="fileUrl"
                  value={marksFormData.fileUrl}
                  onChange={handleInputChange}
                  placeholder="Enter file URL (optional)"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            <FaTimes className="me-1" /> Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateMarks}
            disabled={updatingMarks || !marksFormData.marksObtained}
          >
            {updatingMarks ? (
              <>
                <FaSpinner className="spin me-1" /> Saving...
              </>
            ) : (
              <>
                <FaSave className="me-1" /> Save Marks
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS for spinner animation */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Container>
  );
};