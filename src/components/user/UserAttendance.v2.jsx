
// UserAttendanceUpdated.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  markUserAttendance, getUserAttendanceData
} from "../../service/userAttendance.services";
import { Modal, Button, Card, Spinner, Form, Row, Col, Alert, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import imageCompression from "browser-image-compression";
import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";
import { selfAttendancePoint } from "../../service/Gamification/Gamification.services";
export const MarkUserAttendance = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState(null);
  const [attendanceTime, setAttendanceTime] = useState(null);
  const [attendanceType, setAttendanceType] = useState(null);
  const [attendanceLocation, setAttendanceLocation] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(null);
  
  // Leave application states
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveAttachment, setLeaveAttachment] = useState(null);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const [leaveError, setLeaveError] = useState(null);
  
  // Leave approval status states
  const [leaveApprovalStatus, setLeaveApprovalStatus] = useState(null);
  const [leaveApprovalRemark, setLeaveApprovalRemark] = useState(null);
  const [leaveAppliedReason, setLeaveAppliedReason] = useState(null);
  const [leaveAppliedAttachment, setLeaveAppliedAttachment] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  // Define roles that can see attendance type dropdown
  const allowedRolesForAttendanceType = ['ACI', 'Media Manager'];
  const canShowAttendanceType = allowedRolesForAttendanceType.includes(userData?.role);

  // Leave Type Options - Added "Half Day"
  const leaveTypeOptions = [
    { value: 'Emergency Leave', label: 'Emergency Leave' },
    { value: 'Leave', label: 'Leave' },
    { value: 'WFH', label: 'WFH' },
    { value: 'Comp-off', label: 'Comp-off' },
    { value: 'Medical Leave', label: 'Medical Leave' },
    { value: 'Sick Leave', label: 'Sick Leave' },
    { value: 'Half Day', label: 'Half Day' },
  ];

  // Fetching if the attendance is already marked and if yes then fetching the status
  const fetchAttendanceStatus = async () => {
    const reqBody = {
      unqUserObjectId: userData?._id
    }

    try {
      const response = await getUserAttendanceData(reqBody)
      console.log(response.data.data)
      const attendanceData = response.data.data;
      
      setCurrentAttendanceStatus(attendanceData.attendance)
      
      // Store the date
      if (attendanceData.date) {
        const dateObj = new Date(attendanceData.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        setAttendanceDate(formattedDate);
      }
      
      // If attendance is marked, store the time, type and location
      if (attendanceData.attendance === "Present") {
        const markedTime = attendanceData.createdAt || attendanceData.updatedAt;
        if (markedTime) {
          const date = new Date(markedTime);
          const formattedTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
          });
          setAttendanceTime(formattedTime);
        }
        
        setAttendanceType(attendanceData.attendanceType || 'Daily Attendance');
        setAttendanceLocation(attendanceData.visitingLocation || null);
      }
      
      // Check if leave is applied (attendance is not "Present")
      if (attendanceData.attendance && attendanceData.attendance !== "Present") {
        setLeaveAppliedReason(attendanceData.reasonIfNotPresent || null);
        setLeaveAppliedAttachment(attendanceData.fileUrl || null);
        
        // Set approval status
        if (attendanceData.isLeaveApproved === true) {
          setLeaveApprovalStatus('Approved');
        } else if (attendanceData.isLeaveApproved === false) {
          setLeaveApprovalStatus('Rejected');
        } else {
          setLeaveApprovalStatus('Pending');
        }
        
        setLeaveApprovalRemark(attendanceData.approvalRemark || null);
      } else {
        setLeaveAppliedReason(null);
        setLeaveAppliedAttachment(null);
        setLeaveApprovalStatus(null);
        setLeaveApprovalRemark(null);
      }
    } catch (error) {
      console.log('Error occured while fetching users data')
    }
  }

  useEffect(() => {
    fetchAttendanceStatus()
  }, [])

  //----------------------------------------------------------------------
  // Attendance Type Options
  const attendanceTypeOptions = [
    { value: 'Daily Attendance', label: 'Daily Attendance' },
    { value: 'WFH', label: 'WFH' },
    { value: 'Field Visit', label: 'Field Visit' },
    { value: 'Center Visit', label: 'Center Visit' },
  ];
    
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [visitingLocation, setVisitingLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  
  const fileInputRef = useRef(null);
  const leaveFileInputRef = useRef(null);
  
  // Set default attendance type for non-allowed roles
  useEffect(() => {
    if (!canShowAttendanceType && !selectedAttendance) {
      const defaultAttendance = attendanceTypeOptions.find(option => option.value === 'Daily Attendance');
      setSelectedAttendance(defaultAttendance);
    }
  }, [canShowAttendanceType]);
  
  // Handle attendance type change
  const handleAttendanceChange = (selectedOption) => {
    setSelectedAttendance(selectedOption);
    setVisitingLocation('');
    
    if (selectedOption?.value === 'Field Visit' || selectedOption?.value === 'Center Visit') {
      setShowLocationInput(true);
    } else {
      setShowLocationInput(false);
    }
  };
  
  // Handle location input change
  const handleLocationChange = (e) => {
    setVisitingLocation(e.target.value);
  };

  // Handle leave type change
  const handleLeaveTypeChange = (selectedOption) => {
    setSelectedLeaveType(selectedOption);
  };

  // Handle leave reason change
  const handleLeaveReasonChange = (e) => {
    setLeaveReason(e.target.value);
  };

  // Handle leave attachment change
  const handleLeaveAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLeaveAttachment(file);
    }
  };

  // Submit Leave Application
  const handleApplyLeave = async () => {
    // Validation
    if (!selectedLeaveType) {
      setLeaveError("Please select a leave type");
      setTimeout(() => setLeaveError(null), 3000);
      return;
    }

    if (!leaveReason || leaveReason.trim() === '') {
      setLeaveError("Please provide a reason for leave");
      setTimeout(() => setLeaveError(null), 3000);
      return;
    }

    setLeaveLoading(true);
    setLeaveError(null);
    setLeaveSuccess(false);

    try {
      const formData = new FormData();
      formData.append('unqUserObjectId', userData?._id);
      formData.append('userId', userData?.userId);
      formData.append('date', new Date().toISOString());
      formData.append('attendance', selectedLeaveType?.value || 'Leave');
      formData.append('reasonIfNotPresent', leaveReason);
      formData.append('attendanceMarkedBy', userData?._id);
      formData.append('attendanceType', 'Leave'); // Always set to "Leave" for any non-present status
      
      // Add attachment if present
      if (leaveAttachment) {
        if (leaveAttachment.type.startsWith('image/')) {
          const options = {
            maxSizeMB: 0.05,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: 'image/jpeg'
          };
          const compressedFile = await imageCompression(leaveAttachment, options);
          formData.append('file', compressedFile);
        } else {
          formData.append('file', leaveAttachment);
        }
      }

      console.log("=== Leave Application Form Data ===");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await markUserAttendance(formData);
      console.log("Leave Application Response:", response);

      if (response && (response.success === true || response.status === 200 || response.data?.success === true)) {
        setLeaveSuccess(true);
        setSelectedLeaveType(null);
        setLeaveReason('');
        setLeaveAttachment(null);
        if (leaveFileInputRef.current) {
          leaveFileInputRef.current.value = '';
        }
        
        await fetchAttendanceStatus();
        
        setTimeout(() => {
          setLeaveSuccess(false);
        }, 3000);
      } else {
        const errorMsg = response?.message || response?.error || response?.data?.message || "Failed to apply leave";
        setLeaveError(errorMsg);
      }
    } catch (err) {
      console.error("Leave Application Error:", err);
      let errorMessage = "Error applying leave. Please try again.";
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setLeaveError(errorMessage);
    } finally {
      setLeaveLoading(false);
    }
  };

  // Handle camera capture and submit
  const handleMarkAttendance = async () => {
    // Check if leave is already applied
    if (currentAttendanceStatus && currentAttendanceStatus !== "Present") {
      setError("You have already applied for leave today. Cannot mark attendance.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (canShowAttendanceType && !selectedAttendance) {
      setError("Please select attendance type");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (showLocationInput && !visitingLocation.trim()) {
      setError("Please enter visiting location");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      const cameraInput = document.createElement('input');
      cameraInput.type = 'file';
      cameraInput.accept = 'image/*';
      cameraInput.capture = 'environment';
      cameraInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          await processAndSubmitAttendance(file);
        }
      };
      cameraInput.click();
    }
  };
  
  // Process image compression and submit attendance
  const processAndSubmitAttendance = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log("Original Image:", file);
      console.log("Original Size:", (file.size / 1024).toFixed(2), "KB");
      
      const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      let compressedFile = await imageCompression(file, options);
      
      if (compressedFile.size / 1024 > 100) {
        options.maxSizeMB = 0.03;
        options.maxWidthOrHeight = 800;
        compressedFile = await imageCompression(file, options);
      }
      
      console.log("Compressed Size:", (compressedFile.size / 1024).toFixed(2), "KB");
      
      const formData = new FormData();
      formData.append('unqUserObjectId', userData?._id);
      formData.append('userId', userData?.userId);
      formData.append('date', new Date().toISOString());
      formData.append('attendance', "Present");
      formData.append('attendanceType', selectedAttendance?.value || 'Daily Attendance');
      formData.append('file', compressedFile);
      formData.append('attendanceMarkedBy', userData?._id);
      
      if (showLocationInput && visitingLocation) {
        formData.append('visitingLocation', visitingLocation);
      }
      
      console.log("=== Form Data being sent ===");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await markUserAttendance(formData);



      console.log("Full Response:", response);
      
      if (response) {

        if(userData?.role === "CC"){
          //   await ClaimGamificationPoint({
          //   pointType: "selfAttendance",
          //   date: new Date().toISOString().split("T")[0],
          //   batch: "NA",
          //   unqObjectId: userData?._id,
          // });
          // console.log('Passed claimgamifcation api');


           await selfAttendancePoint({
            pointType: "selfAttendance",
            date: new Date().toISOString().split("T")[0],
            batch: "NA",
            unqObjectId: userData?._id,
          });
          console.log('Passed claimgamifcation api');




        }
        
          


        const isSuccess = 
          response.success === true || 
          response.status === 200 || 
          response.status === "success" ||
          response.data?.success === true ||
          response.message?.toLowerCase().includes('success') ||
          (response.data && response.data._id);
        
        if (isSuccess) {
          setSuccess(true);
          setSelectedImage(null);
          setSelectedAttendance(null);
          setVisitingLocation('');
          setShowLocationInput(false);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          await fetchAttendanceStatus();

          
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else {
          const errorMsg = response?.message || response?.error || response?.data?.message || "Failed to mark attendance";
          setError(errorMsg);
          console.error("API returned error:", response);
        }
      } else {
        setError("No response received from server");
      }
      
    } catch (err) {
      console.error("Attendance Error Details:", err);
      let errorMessage = "Error marking attendance. Please try again.";
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await processAndSubmitAttendance(file);
    }
  };

  // Check if leave is applied (attendance is not "Present")
  const isLeaveApplied = currentAttendanceStatus && currentAttendanceStatus !== "Present";
  
  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Mark Your Attendance</h4>
        </Card.Header>
        
        <Card.Body>
          {/* Success Alert */}
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
              <Alert.Heading>Success!</Alert.Heading>
              <p>Your attendance has been marked successfully.</p>
            </Alert>
          )}
          
          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}
          
          {/* Hidden file input for camera */}
          <Form.Control
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
          
          <Form>
            {/* Attendance Type Dropdown */}
            {canShowAttendanceType && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Attendance Type <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  options={attendanceTypeOptions}
                  value={selectedAttendance}
                  onChange={handleAttendanceChange}
                  placeholder="Select attendance type..."
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#ced4da',
                      '&:hover': { borderColor: '#86b7fe' }
                    })
                  }}
                />
              </Form.Group>
            )}
            
            {/* Visiting Location Input */}
            {showLocationInput && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Visiting Location <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={visitingLocation}
                  onChange={handleLocationChange}
                  placeholder="Enter visiting location (e.g., Client Office, Site Location, etc.)"
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">
                  Please enter the location you are visiting
                </Form.Text>
              </Form.Group>
            )}
            
            {/* User Info Card */}
            <Card className="bg-light mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <small className="text-muted">Name</small>
                    <p className="mb-0 fw-bold">{userData?.name || userData?.fullName || 'N/A'}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Date</small>
                    <p className="mb-0 fw-bold">{new Date().toLocaleDateString()}</p>
                  </Col>
                </Row>
               
                {/* Show Attendance Status Section if marked */}
                {currentAttendanceStatus === "Present" && (
                  <>
                    <hr className="mt-3 mb-3" />
                    <Row>
                      <Col md={12}>
                        <h6 className="text-success mb-2">✓ Attendance Status</h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <small className="text-muted">Status</small>
                        <p className="mb-0 fw-bold text-success">{currentAttendanceStatus}</p>
                      </Col>
                      <Col md={4}>
                        <small className="text-muted">Marked At</small>
                        <p className="mb-0 fw-bold">{attendanceTime || 'N/A'}</p>
                      </Col>
                      <Col md={4}>
                        <small className="text-muted">Attendance Type</small>
                        <p className="mb-0 fw-bold">{attendanceType || 'Daily Attendance'}</p>
                      </Col>
                    </Row>
                    {attendanceLocation && (
                      <Row className="mt-2">
                        <Col md={12}>
                          <small className="text-muted">Visiting Location</small>
                          <p className="mb-0 fw-bold">{attendanceLocation}</p>
                        </Col>
                      </Row>
                    )}
                  </>
                )}

                {/* Show Leave Status if applied */}
                {isLeaveApplied && (
                  <>
                    <hr className="mt-3 mb-3" />
                    <Row>
                      <Col md={12}>
                        <h6 className="text-warning mb-2">📝 Leave Application Status</h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <small className="text-muted">Leave Type</small>
                        <p className="mb-0 fw-bold">{currentAttendanceStatus || 'N/A'}</p>
                      </Col>
                      <Col md={4}>
                        <small className="text-muted">Applied On</small>
                        <p className="mb-0 fw-bold">{attendanceDate || 'N/A'}</p>
                      </Col>
                      <Col md={4}>
                        <small className="text-muted">Approval Status</small>
                        <p className="mb-0">
                          {leaveApprovalStatus === 'Approved' && (
                            <Badge bg="success">✅ Approved</Badge>
                          )}
                          {leaveApprovalStatus === 'Rejected' && (
                            <Badge bg="danger">❌ Rejected</Badge>
                          )}
                          {leaveApprovalStatus === 'Pending' && (
                            <Badge bg="warning" text="dark">⏳ Pending</Badge>
                          )}
                          {!leaveApprovalStatus && (
                            <Badge bg="secondary">N/A</Badge>
                          )}
                        </p>
                      </Col>
                    </Row>
                    {leaveApprovalRemark && (
                      <Row className="mt-2">
                        <Col md={12}>
                          <small className="text-muted">Approval Remark</small>
                          <p className="mb-0 fw-bold">{leaveApprovalRemark}</p>
                        </Col>
                      </Row>
                    )}
                    {leaveAppliedReason && (
                      <Row className="mt-2">
                        <Col md={12}>
                          <small className="text-muted">Reason Given</small>
                          <p className="mb-0 fw-bold">{leaveAppliedReason}</p>
                        </Col>
                      </Row>
                    )}
                    {leaveAppliedAttachment && (
                      <Row className="mt-2">
                        <Col md={12}>
                          <small className="text-muted">Attachment</small>
                          <div className="mt-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => setShowAttachmentModal(true)}
                            >
                              📎 View Attachment
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
            
            {/* Mark Attendance Button */}
            <div className="d-grid gap-2">
              {currentAttendanceStatus === "Present" ? (
                <Button
                  variant="success"
                  size="lg"
                  disabled
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  ✓ Attendance Marked Successfully
                </Button>
              ) : isLeaveApplied ? (
                <Button
                  variant="warning"
                  size="lg"
                  disabled
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  ⚠️ Leave Applied - Attendance Disabled
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleMarkAttendance}
                  disabled={loading}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Processing...
                    </>
                  ) : (
                    <>
                      📸 Mark Attendance
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {isLeaveApplied && (
              <small className="text-warning d-block text-center mt-3">
                ⚠️ You have applied for leave today. Attendance marking is disabled.
              </small>
            )}
            
            {!isLeaveApplied && currentAttendanceStatus !== "Present" && (
              <small className="text-muted d-block text-center mt-3">
                Clicking the button will open camera to capture your attendance photo
              </small>
            )}

          </Form>

          {/* Apply Leave Section - Only show if not already Present and not already applied for leave */}
          {currentAttendanceStatus !== "Present" && !isLeaveApplied && (
            <>
              <hr className="mt-4 mb-4" style={{ borderTop: '2px dashed #dee2e6' }} />
              
              <h5 className="mb-3">📝 Apply Leave</h5>
              
              {/* Leave Success Alert */}
              {leaveSuccess && (
                <Alert variant="success" onClose={() => setLeaveSuccess(false)} dismissible>
                  <Alert.Heading>Leave Applied Successfully!</Alert.Heading>
                  <p>Your leave application has been submitted.</p>
                </Alert>
              )}
              
              {/* Leave Error Alert */}
              {leaveError && (
                <Alert variant="danger" onClose={() => setLeaveError(null)} dismissible>
                  <Alert.Heading>Error!</Alert.Heading>
                  <p>{leaveError}</p>
                </Alert>
              )}

              {/* Hidden file input for leave attachment */}
              <Form.Control
                type="file"
                ref={leaveFileInputRef}
                onChange={handleLeaveAttachmentChange}
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
              />

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Apply Leave For <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        options={leaveTypeOptions}
                        value={selectedLeaveType}
                        onChange={handleLeaveTypeChange}
                        placeholder="Select leave type..."
                        isClearable
                        isSearchable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: '#ced4da',
                            '&:hover': { borderColor: '#86b7fe' }
                          })
                        }}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Attachment <span className="text-muted">(Optional)</span>
                      </Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="text"
                          placeholder="No file selected"
                          value={leaveAttachment ? leaveAttachment.name : ''}
                          readOnly
                          className="form-control-sm"
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => leaveFileInputRef.current?.click()}
                        >
                          📎 Browse
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Upload supporting document (image, PDF, DOC)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Reason <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={leaveReason}
                        onChange={handleLeaveReasonChange}
                        placeholder="Please provide detailed reason for leave application..."
                        className="form-control-lg"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2">
                  <Button
                    variant="warning"
                    size="lg"
                    onClick={handleApplyLeave}
                    disabled={leaveLoading}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    {leaveLoading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Submitting Leave...
                      </>
                    ) : (
                      <>
                        📤 Apply Leave
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </>
          )}

          <hr className="mt-4 mb-3" />
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>
            <Button onClick={() => navigate('/user-dashboard')}>
              Go to Home
            </Button>
           
            <Button onClick={() => navigate('/user-self-attendance-dashboard')}>
              Attendance Summary
            </Button>
          </div>
        
        </Card.Body>
      </Card>

      {/* Attachment View Modal */}
      <Modal show={showAttachmentModal} onHide={() => setShowAttachmentModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📎 Leave Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {leaveAppliedAttachment ? (
            leaveAppliedAttachment.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
              <img 
                src={leaveAppliedAttachment} 
                alt="Leave Attachment" 
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                className="img-fluid"
              />
            ) : (
              <div>
                <p className="mb-3">📄 Document Attachment</p>
                <a 
                  href={leaveAppliedAttachment} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  📥 Download Attachment
                </a>
              </div>
            )
          ) : (
            <p className="text-muted">No attachment available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttachmentModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};