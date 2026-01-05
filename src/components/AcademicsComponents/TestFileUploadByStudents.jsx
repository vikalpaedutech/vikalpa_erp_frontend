import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Form, Button, ProgressBar, Alert, Card, Badge } from "react-bootstrap";
import { 
  getAllMarksUsinQueryParams, 
  uploadTestFileService,
  updateMarksBySrnAndExamId 
} from "../../service/Marks.services.js";
import { GetTests } from '../../service/ExamAndTestController';

export const StudentTestFileUpload = ({ studentClass = "9" }) => {
  // Student SRN input state
  const [studentSrn, setStudentSrn] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Test data states
  const [getTest, setGetTest] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  
  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRefs = useRef({});

  // Fetch tests based on class (9 or 10)
  const fetchTest = async () => {
    const reqBody = {
      classofStudent: [studentClass]
    };
    
    console.log("Fetching tests for class:", studentClass);
    
    try {
      const response = await GetTests(reqBody);
      console.log("Test data fetched:", response.data.data);
      setGetTest(response.data.data);
      
      // Filter tests that allow file upload
      const testsWithFileUpload = response.data.data.filter(test => 
        test.fileUpload === true || test.allowFileUpload === true
      );
      setFilteredTests(testsWithFileUpload);
      
    } catch (error) {
      console.log("Error fetching test data", error.message);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [studentClass]);

  // Handle SRN search
  const handleSearchStudent = async (e) => {
    e.preventDefault();
    
    if (!studentSrn.trim()) {
      setErrorMessage("Please enter your SRN number");
      return;
    }

    if (studentSrn.length < 6) {
      setErrorMessage("Please enter a valid SRN number");
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setStudentData(null);
    setStudentMarks([]);

    try {
      // Query to fetch student data
      const queryParams = {
        studentSrn: studentSrn.trim(),
        firstName: "",
        fatherName: "",
        schoolId: "",
        classofStudent: studentClass,
        examId: "",
        marksObtained: "",
        recordedBy: "",
        remark: "",
        marksUpdatedOn: "",
      };

      const response = await getAllMarksUsinQueryParams(queryParams);
      
      if (response.data && response.data.length > 0) {
        // Get unique student data (first record)
        const student = response.data[0];
        setStudentData({
          srn: student.studentSrn,
          name: student.firstName,
          fatherName: student.fatherName,
          schoolId: student.schoolId,
          class: student.classofStudent
        });
        
        // Get student's marks data
        setStudentMarks(response.data);
        setSuccessMessage(`Student found: ${student.firstName}`);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
        
      } else {
        setErrorMessage("No student found with this SRN in Class " + studentClass);
      }
      
    } catch (error) {
      console.error("Error fetching student data:", error.message);
      setErrorMessage("Error fetching student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // File upload handler
  const handleFileUpload = async (e, examId) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected for upload:", file.name, file.type, file.size);

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors(prev => ({
        ...prev,
        [examId]: "File size exceeds 10MB limit"
      }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors(prev => ({
        ...prev,
        [examId]: "Only PDF and image files are allowed"
      }));
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [examId]: true }));
    setUploadErrors(prev => ({ ...prev, [examId]: null }));

    const formData = new FormData();
    formData.append('testFile', file);
    formData.append('studentSrn', studentSrn.trim());
    formData.append('examId', examId);

    try {
      console.log("Uploading file to backend...");
      const response = await uploadTestFileService(formData);
      console.log("File upload response:", response);
      
      // Update local state with file URL
      setStudentMarks(prevData =>
        prevData.map((item) =>
          item.examId === examId
            ? { ...item, fileUrl: response.fileUrl }
            : item
        )
      );
      
      // Update marks record with file URL
      const payload = {
        studentSrn: studentSrn.trim(),
        examId: examId,
        schoolId: studentData?.schoolId || "",
        classofStudent: studentClass,
        fileUrl: response.fileUrl,
        recordedBy: "Student",
        marksUpdatedOn: new Date().toISOString(),
      };
      
      console.log("Updating marks with file URL:", payload);
      await updateMarksBySrnAndExamId({}, payload);
      
      // Show success message
      setSuccessMessage(`✅ File uploaded successfully for ${examId}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error uploading file";
      setUploadErrors(prev => ({
        ...prev,
        [examId]: errorMessage
      }));
      
      setErrorMessage(`❌ Error uploading file: ${errorMessage}`);
      setTimeout(() => setErrorMessage(''), 5000);
      
    } finally {
      setUploadingFiles(prev => ({ ...prev, [examId]: false }));
    }
  };

  const openFile = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("No file available");
    }
  };

  // Get file status for a specific exam
  const getFileStatus = (examId) => {
    const markRecord = studentMarks.find(mark => mark.examId === examId);
    return markRecord?.fileUrl || null;
  };

  // Get file name from URL
  const getFileName = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Student Test File Upload - Class {studentClass}</h4>
              <small>Upload your test answer sheets and documents</small>
            </Card.Header>
            
            <Card.Body>
              {/* SRN Search Form */}
              <Form onSubmit={handleSearchStudent}>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Enter Your SRN Number</strong></Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="e.g., 1111112752"
                      value={studentSrn}
                      onChange={(e) => setStudentSrn(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading || !studentSrn.trim()}
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Enter your 10-digit Student Registration Number
                  </Form.Text>
                </Form.Group>
              </Form>

              {/* Success and Error Messages */}
              {successMessage && (
                <Alert variant="success" className="mt-3">
                  {successMessage}
                </Alert>
              )}
              
              {errorMessage && (
                <Alert variant="danger" className="mt-3">
                  {errorMessage}
                </Alert>
              )}

              {/* Student Info Card */}
              {studentData && (
                <Card className="mb-4 border-success">
                  <Card.Body>
                    <h5 className="text-success">✅ Student Found</h5>
                    <Row>
                      <Col md={6}>
                        <p><strong>SRN:</strong> {studentData.srn}</p>
                        <p><strong>Name:</strong> {studentData.name}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Father's Name:</strong> {studentData.fatherName}</p>
                        <p><strong>Class:</strong> {studentData.class}</p>
                      </Col>
                    </Row>
                    <Badge bg="info" className="mt-2">
                      You can now upload your test files
                    </Badge>
                  </Card.Body>
                </Card>
              )}

              {/* Test File Upload Table */}
              {studentData && filteredTests.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-3">Available Tests for File Upload</h5>
                  
                  <Table responsive bordered hover className="mt-3">
                    <thead className="table-dark">
                      <tr>
                        <th width="5%">#</th>
                        <th width="35%">Test ID / Name</th>
                        <th width="30%">Current File</th>
                        <th width="30%">Upload New File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTests.map((test, index) => {
                        const existingFileUrl = getFileStatus(test.examId);
                        
                        return (
                          <tr key={test.examId}>
                            <td>{index + 1}</td>
                            <td>
                              <div>
                                <strong>{test.examId}</strong>
                                {test.testName && (
                                  <div className="text-muted small">{test.testName}</div>
                                )}
                              </div>
                            </td>
                            <td>
                              {existingFileUrl ? (
                                <div>
                                  <Button 
                                    variant="success" 
                                    size="sm" 
                                    onClick={() => openFile(existingFileUrl)}
                                    className="me-2"
                                  >
                                    📁 View
                                  </Button>
                                  <small className="text-muted d-block mt-1">
                                    {getFileName(existingFileUrl)}
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">No file uploaded</span>
                              )}
                            </td>
                            <td>
                              <div>
                                <input
                                  type="file"
                                  ref={el => fileInputRefs.current[test.examId] = el}
                                  onChange={(e) => handleFileUpload(e, test.examId)}
                                  accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                                  style={{ display: 'none' }}
                                  disabled={uploadingFiles[test.examId]}
                                />
                                <Button
                                  variant={existingFileUrl ? "outline-warning" : "outline-primary"}
                                  size="sm"
                                  onClick={() => fileInputRefs.current[test.examId]?.click()}
                                  disabled={uploadingFiles[test.examId]}
                                  className="mb-1"
                                >
                                  {uploadingFiles[test.examId] 
                                    ? '⏳ Uploading...' 
                                    : existingFileUrl 
                                      ? '📤 Replace File' 
                                      : '📎 Upload File'
                                  }
                                </Button>
                                {uploadingFiles[test.examId] && (
                                  <ProgressBar 
                                    animated 
                                    now={50} 
                                    className="mt-1" 
                                    style={{ width: '100px' }}
                                    label="Uploading..."
                                  />
                                )}
                                {uploadErrors[test.examId] && (
                                  <Alert variant="danger" className="mt-1 p-1" style={{ fontSize: '0.8rem' }}>
                                    ❌ {uploadErrors[test.examId]}
                                  </Alert>
                                )}
                                <small className="text-muted d-block mt-1">
                                  Max 10MB (PDF/Images)
                                </small>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  {/* Instructions */}
                  <Alert variant="info" className="mt-4">
                    <h6>📝 Instructions:</h6>
                    <ul className="mb-0">
                      <li>Only upload files for tests that are marked as "File Upload Allowed"</li>
                      <li>Maximum file size: 10MB</li>
                      <li>Allowed formats: PDF, JPG, JPEG, PNG, GIF, BMP, WEBP</li>
                      <li>You can replace existing files by uploading a new one</li>
                      <li>Make sure the file clearly shows your answers and details</li>
                    </ul>
                  </Alert>
                </div>
              )}

              {/* No tests available message */}
              {studentData && filteredTests.length === 0 && (
                <Alert variant="warning" className="mt-4">
                  <h6>ℹ️ No tests available for file upload</h6>
                  <p className="mb-0">
                    Currently, there are no tests configured to accept student file uploads. 
                    Please contact your teacher or administrator.
                  </p>
                </Alert>
              )}

              {/* Welcome message (when no student searched) */}
              {!studentData && !loading && (
                <div className="text-center mt-5">
                  <div className="mb-4">
                    <i className="bi bi-upload" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  </div>
                  <h5 className="text-muted">Welcome to Student Test File Upload</h5>
                  <p className="text-muted">
                    Enter your SRN number above to search for your records and upload test files.
                  </p>
                  <div className="mt-4">
                    <Badge bg="light" text="dark" className="me-2 p-2">
                      📝 Upload answer sheets
                    </Badge>
                    <Badge bg="light" text="dark" className="me-2 p-2">
                      📄 Submit test documents
                    </Badge>
                    <Badge bg="light" text="dark" className="p-2">
                      🔒 Secure file upload
                    </Badge>
                  </div>
                </div>
              )}
            </Card.Body>
            
            <Card.Footer className="text-muted small">
              <div className="d-flex justify-content-between">
                <div>
                  <i className="bi bi-info-circle me-1"></i>
                  Class {studentClass} - Student Portal
                </div>
                <div>
                  <i className="bi bi-shield-check me-1"></i>
                  Secure File Upload System
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

