import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { createPost } from "../../service/Bills.services.js";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Modal, Breadcrumb } from "react-bootstrap";
import { FaUpload, FaFileUpload, FaRupeeSign, FaMapMarkerAlt, FaUtensils, FaHotel, FaBox, FaCheckCircle } from "react-icons/fa";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker.js";

export const UploadBillsV2 = () => {
  const { userData } = useContext(UserContext);
  const { startDate } = useContext(DateNDateRangeContext);

  console.log("StartDate from context:", startDate);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedBillData, setSubmittedBillData] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    unqUserObjectId: userData?._id || "",
    userId: userData?.userId || "",
    role: userData?.role || "",
    purposeOfExpense: "",
    descriptionExpense: "",
    expenseDate: startDate || null,
    expenseType: "",
    travelFrom: "",
    travelTo: "",
    travelledDistance: "",
    foodType: "",
    accomodationDate: null,
    stayedForDays: "",
    otherItemName: "",
    otherItemPurchasingPurpose: "",
    otherItemDescription: "",
    expenseAmount: ""
  });

  // Update expenseDate when startDate changes from context
  useEffect(() => {
    if (startDate) {
      console.log("Updating expenseDate from context:", startDate);
      setFormData(prev => ({
        ...prev,
        expenseDate: startDate
      }));
    }
  }, [startDate]);

  // Reset conditional fields when expense type changes
  useEffect(() => {
    const resetConditionalFields = () => {
      setFormData(prev => ({
        ...prev,
        travelFrom: "",
        travelTo: "",
        travelledDistance: "",
        foodType: "",
        accomodationDate: null,
        stayedForDays: "",
        otherItemName: "",
        otherItemPurchasingPurpose: "",
        otherItemDescription: ""
      }));
    };
    resetConditionalFields();
  }, [formData.expenseType]);

  // Update form data
  const updateFormData = (field, value) => {
    console.log(`Updating ${field}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size should be less than 5MB");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      setSelectedFile(file);
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Helper function to get date string from date object
  const getDateString = (dateObj) => {
    if (!dateObj) return null;
    if (typeof dateObj === 'string') return dateObj;
    if (dateObj.YYYYMMDD) return dateObj.YYYYMMDD;
    if (dateObj instanceof Date) {
      return dateObj.toISOString().split('T')[0];
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form Data before validation:", formData);
    console.log("Expense Date value:", formData.expenseDate);
    
    // Validation
    if (!formData.purposeOfExpense) {
      setErrorMessage("Please select purpose of expense");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    let expenseDateString = getDateString(formData.expenseDate);
    if (!expenseDateString && startDate) {
      expenseDateString = getDateString(startDate);
      console.log("Using startDate from context:", expenseDateString);
    }
    
    if (!expenseDateString) {
      setErrorMessage("Please select expense date");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    if (!formData.expenseType) {
      setErrorMessage("Please select expense type");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    if (!formData.expenseAmount || formData.expenseAmount <= 0) {
      setErrorMessage("Please enter valid expense amount");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    // Check if file is uploaded (mandatory)
    if (!selectedFile) {
      setErrorMessage("Please upload a bill/receipt file (Mandatory)");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    // Conditional validation based on expense type
    if (formData.expenseType === "Travel") {
      if (!formData.travelFrom || !formData.travelTo) {
        setErrorMessage("Please enter travel from and to locations");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }
    
    if (formData.expenseType === "Food") {
      if (!formData.foodType) {
        setErrorMessage("Please select food type");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }
    
    if (formData.expenseType === "Accommodation") {
      const accomodationDateString = getDateString(formData.accomodationDate);
      if (!accomodationDateString || !formData.stayedForDays) {
        setErrorMessage("Please enter accommodation date and days stayed");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }
    
    if (formData.expenseType === "Other") {
      if (!formData.otherItemName) {
        setErrorMessage("Please enter item name");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const submitFormData = new FormData();

      submitFormData.append("unqUserObjectId", formData.unqUserObjectId);
      submitFormData.append("userId", formData.userId);
      submitFormData.append("role", formData.role);
      submitFormData.append("purposeOfExpense", formData.purposeOfExpense);
      submitFormData.append("descriptionExpense", formData.descriptionExpense || "");
      submitFormData.append("expenseDate", expenseDateString);
      submitFormData.append("expenseType", formData.expenseType);
      submitFormData.append("expenseAmount", formData.expenseAmount);
      submitFormData.append("file", selectedFile);
      
      if (formData.expenseType === "Travel") {
        submitFormData.append("travelFrom", formData.travelFrom);
        submitFormData.append("travelTo", formData.travelTo);
        submitFormData.append("travelledDistance", formData.travelledDistance || 0);
      }
      
      if (formData.expenseType === "Food") {
        submitFormData.append("foodType", formData.foodType);
      }
      
      if (formData.expenseType === "Accommodation") {
        const accomodationDateString = getDateString(formData.accomodationDate);
        submitFormData.append("accomodationDate", accomodationDateString);
        submitFormData.append("stayedForDays", formData.stayedForDays);
      }
      
      if (formData.expenseType === "Other") {
        submitFormData.append("otherItemName", formData.otherItemName);
        submitFormData.append("otherItemPurchasingPurpose", formData.otherItemPurchasingPurpose || "");
        submitFormData.append("otherItemDescription", formData.otherItemDescription || "");
      }
      
      console.log("Submitting FormData with expenseDate:", expenseDateString);
      
      const response = await createPost(submitFormData);
      
      if (response.status === "Success") {
        // Prepare data for success modal
        setSubmittedBillData({
          purpose: formData.purposeOfExpense,
          type: formData.expenseType,
          amount: formData.expenseAmount,
          date: expenseDateString,
          fileName: selectedFile.name,
          description: formData.descriptionExpense
        });
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
          unqUserObjectId: userData?._id || "",
          userId: userData?.userId || "",
          role: userData?.role || "",
          purposeOfExpense: "",
          descriptionExpense: "",
          expenseDate: startDate || null,
          expenseType: "",
          travelFrom: "",
          travelTo: "",
          travelledDistance: "",
          foodType: "",
          accomodationDate: null,
          stayedForDays: "",
          otherItemName: "",
          otherItemPurchasingPurpose: "",
          otherItemDescription: "",
          expenseAmount: ""
        });
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        setErrorMessage(response.message || "Failed to upload bill");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error uploading bill:", error);
      setErrorMessage("Error uploading bill. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const purposeOptions = [
    { value: "Office", label: "Office" },
    { value: "Orientation", label: "Orientation" },
    { value: "Center Event", label: "Center Event" },
    { value: "MB Center", label: "MB Center" },
    { value: "Stationary", label: "Stationary" },
    { value: "Other", label: "Other" }
  ];

  const expenseTypeOptions = [
    { value: "Travel", label: "Travel", icon: <FaMapMarkerAlt /> },
    { value: "Food", label: "Food", icon: <FaUtensils /> },
    { value: "Accommodation", label: "Accommodation", icon: <FaHotel /> },
    { value: "Other", label: "Other", icon: <FaBox /> }
  ];

  const foodTypeOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" }
  ];

  return (
    <Container fluid className="mt-4 mb-4">
<Breadcrumb>
      <Breadcrumb.Item href="/upload-bills-v2">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/view-bills-v2">View Bills</Breadcrumb.Item>
    </Breadcrumb>
        <hr></hr>
      {/* Success Message Toast */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
          <Alert.Heading>Success!</Alert.Heading>
          <p>{successMessage}</p>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{errorMessage}</p>
        </Alert>
      )}

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <FaCheckCircle className="me-2" /> Bill Submitted Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {submittedBillData && (
            <div>
              <div className="text-center mb-4">
                <FaCheckCircle size={60} className="text-success mb-3" />
                <h4>Your bill has been uploaded successfully!</h4>
                <p className="text-muted">Bill details are shown below:</p>
              </div>
              
              <div className="bg-light p-3 rounded">
                <h6 className="text-primary mb-3">Bill Summary</h6>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>Purpose:</strong>
                  </Col>
                  <Col md={8}>
                    {submittedBillData.purpose}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>Expense Type:</strong>
                  </Col>
                  <Col md={8}>
                    {submittedBillData.type}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>Amount:</strong>
                  </Col>
                  <Col md={8}>
                    ₹{submittedBillData.amount}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>Expense Date:</strong>
                  </Col>
                  <Col md={8}>
                    {submittedBillData.date}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <strong>Receipt File:</strong>
                  </Col>
                  <Col md={8}>
                    <Badge bg="info">{submittedBillData.fileName}</Badge>
                  </Col>
                </Row>
                {submittedBillData.description && (
                  <Row className="mb-2">
                    <Col md={4}>
                      <strong>Description:</strong>
                    </Col>
                    <Col md={8}>
                      {submittedBillData.description}
                    </Col>
                  </Row>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-muted small">
                  You can submit another bill by filling the form again.
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Submit Another Bill
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white py-3">
              <div className="d-flex align-items-center gap-2">
                <FaUpload size={24} />
                <h4 className="mb-0">Upload Bill / Expense</h4>
              </div>
              <small className="text-white-50">Submit your expense bills with supporting documents</small>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {/* User Info Display */}
                {/* <div className="mb-4 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <Badge bg="secondary" className="me-2">User: {userData?.name}</Badge>
                      <Badge bg="info">Role: {userData?.role}</Badge>
                    </div>
                   
                  </div>
                </div> */}

                {/* Basic Information */}
                <h5 className="mb-3 text-primary">Basic Information</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">
                      Purpose of Expense <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={formData.purposeOfExpense}
                      onChange={(e) => updateFormData("purposeOfExpense", e.target.value)}
                      required
                    >
                      <option value="">Select purpose</option>
                      {purposeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <SingleDatePicker
                        labelText = "Expense Date"
                      selectedDate={formData.expenseDate}
                      onDateChange={(date) => {
                        console.log("Date selected from picker:", date);
                        updateFormData("expenseDate", date);
                      }}
                      placeholderText="Select expense date"
                      className="w-100"
                    
                    />
                    {formData.expenseDate && (
                      <Form.Text className="text-success">
                        Selected: {typeof formData.expenseDate === 'string' ? formData.expenseDate : formData.expenseDate.YYYYMMDD}
                      </Form.Text>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">
                      Expense Type <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {expenseTypeOptions.map(opt => (
                        <Button
                          key={opt.value}
                          variant={formData.expenseType === opt.value ? "primary" : "outline-primary"}
                          onClick={() => updateFormData("expenseType", opt.value)}
                          className="d-flex align-items-center gap-2"
                          type="button"
                        >
                          {opt.icon} {opt.label}
                        </Button>
                      ))}
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">
                      Expense Amount (₹) <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaRupeeSign /></span>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={formData.expenseAmount}
                        onChange={(e) => updateFormData("expenseAmount", e.target.value)}
                        required
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col xs={12}>
                    <Form.Label className="fw-semibold">Description (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Enter description of expense..."
                      value={formData.descriptionExpense}
                      onChange={(e) => updateFormData("descriptionExpense", e.target.value)}
                    />
                  </Col>
                </Row>

                {/* Conditional Fields based on Expense Type */}
                {formData.expenseType === "Travel" && (
                  <>
                    <hr />
                    <h5 className="mb-3 text-primary">
                      <FaMapMarkerAlt className="me-2" /> Travel Details
                    </h5>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label className="fw-semibold">
                          Travel From <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Starting location"
                          value={formData.travelFrom}
                          onChange={(e) => updateFormData("travelFrom", e.target.value)}
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">
                          Travel To <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Destination"
                          value={formData.travelTo}
                          onChange={(e) => updateFormData("travelTo", e.target.value)}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Label className="fw-semibold">Distance Travelled (km)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Distance in kilometers"
                          value={formData.travelledDistance}
                          onChange={(e) => updateFormData("travelledDistance", e.target.value)}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {formData.expenseType === "Food" && (
                  <>
                    <hr />
                    <h5 className="mb-3 text-primary">
                      <FaUtensils className="me-2" /> Food Details
                    </h5>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Label className="fw-semibold">
                          Food Type <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="d-flex gap-2">
                          {foodTypeOptions.map(opt => (
                            <Button
                              key={opt.value}
                              variant={formData.foodType === opt.value ? "primary" : "outline-primary"}
                              onClick={() => updateFormData("foodType", opt.value)}
                              type="button"
                            >
                              {opt.label}
                            </Button>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </>
                )}

                {formData.expenseType === "Accommodation" && (
                  <>
                    <hr />
                    <h5 className="mb-3 text-primary">
                      <FaHotel className="me-2" /> Accommodation Details
                    </h5>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label className="fw-semibold">
                          Check-in Date <span className="text-danger">*</span>
                        </Form.Label>
                        <SingleDatePicker
                          selectedDate={formData.accomodationDate}
                          onDateChange={(date) => {
                            console.log("Accommodation date selected:", date);
                            updateFormData("accomodationDate", date);
                          }}
                          placeholderText="Select check-in date"
                          className="w-100"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">
                          Days Stayed <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Number of days"
                          value={formData.stayedForDays}
                          onChange={(e) => updateFormData("stayedForDays", e.target.value)}
                          required
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {formData.expenseType === "Other" && (
                  <>
                    <hr />
                    <h5 className="mb-3 text-primary">
                      <FaBox className="me-2" /> Other Item Details
                    </h5>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Label className="fw-semibold">
                          Item Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name of item purchased"
                          value={formData.otherItemName}
                          onChange={(e) => updateFormData("otherItemName", e.target.value)}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Label className="fw-semibold">Purchasing Purpose</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Purpose of purchase"
                          value={formData.otherItemPurchasingPurpose}
                          onChange={(e) => updateFormData("otherItemPurchasingPurpose", e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Additional details about the item"
                          value={formData.otherItemDescription}
                          onChange={(e) => updateFormData("otherItemDescription", e.target.value)}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {/* File Upload Section - Mandatory */}
                <hr />
                <h5 className="mb-3 text-primary">
                  <FaFileUpload className="me-2" /> Bill/Receipt Upload <span className="text-danger">*</span>
                </h5>
                <Row className="mb-4">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Upload Document <span className="text-danger">(Mandatory)</span>
                      </Form.Label>
                      <div className={`border rounded p-4 text-center bg-light ${!selectedFile && errorMessage?.includes("upload") ? 'border-danger' : ''}`}>
                        <input
                          type="file"
                          id="file-upload"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className="d-none"
                        />
                        <label htmlFor="file-upload" className="btn btn-outline-primary">
                          <FaUpload className="me-2" /> Choose File
                        </label>
                        {selectedFile && (
                          <div className="mt-3">
                            <Badge bg="success" className="p-2">
                              ✓ Selected: {selectedFile.name}
                            </Badge>
                          </div>
                        )}
                        {!selectedFile && (
                          <div className="mt-2">
                            <small className="text-danger">* Bill receipt is required</small>
                          </div>
                        )}
                        {filePreview && (
                          <div className="mt-3">
                            <img src={filePreview} alt="Preview" style={{ maxHeight: "150px", maxWidth: "100%" }} />
                          </div>
                        )}
                        <Form.Text className="text-muted d-block mt-2">
                          Supported formats: JPG, PNG, PDF (Max size: 5MB) - Mandatory
                        </Form.Text>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Submit Button */}
                <div className="text-center pt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Submit Bill
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="bg-light text-muted text-center py-3">
              <small>Please ensure all bills are clear and legible. Bill receipt is mandatory. Keep original receipts for future reference.</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};