import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Alert,
    Breadcrumb,
    Badge,
    Modal
} from "react-bootstrap";
import { createObjectiveOfCalling } from "../service/CallingServices/Calling.services.js";
import Select from 'react-select';

export const CreateObjectiveOfCalling = () => {
    // State variables
    const [formData, setFormData] = useState({
        objectiveOfCalling: "",
        descriptionOfCalling: "",
        callingStatus: "Active",
        isNewValueToBeUpdatedRequired: false,
        dependentRemarkRequired: false,
        isManualRemarkRequired: true,
        isObjectOfCallingDone: false,
        callingDate: new Date().toISOString().slice(0, 16)
    });
    
    const [remarks, setRemarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    
    // Status options
    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Completed", label: "Completed" }
    ];
    
    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    // Handle status change
    const handleStatusChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            callingStatus: selectedOption ? selectedOption.value : "Active"
        }));
    };
    
    // Handle remark change
    const handleRemarkChange = (index, field, value) => {
        const updatedRemarks = [...remarks];
        updatedRemarks[index][field] = value;
        
        // If remark is changed and dependentRemarks is empty, initialize as empty array
        if (field === 'remark' && !updatedRemarks[index].dependentRemarks) {
            updatedRemarks[index].dependentRemarks = [];
        }
        
        setRemarks(updatedRemarks);
    };
    
    // Handle dependent remark change
    const handleDependentRemarkChange = (index, depIndex, value) => {
        const updatedRemarks = [...remarks];
        updatedRemarks[index].dependentRemarks[depIndex] = value;
        setRemarks(updatedRemarks);
    };
    
    // Add new dependent remark
    const addDependentRemark = (index) => {
        const updatedRemarks = [...remarks];
        if (!updatedRemarks[index].dependentRemarks) {
            updatedRemarks[index].dependentRemarks = [];
        }
        updatedRemarks[index].dependentRemarks.push("");
        setRemarks(updatedRemarks);
    };
    
    // Remove dependent remark
    const removeDependentRemark = (index, depIndex) => {
        const updatedRemarks = [...remarks];
        updatedRemarks[index].dependentRemarks.splice(depIndex, 1);
        setRemarks(updatedRemarks);
    };
    
    // Add new remark
    const addRemark = () => {
        setRemarks([
            ...remarks,
            {
                remark: "",
                dependentRemarks: []
            }
        ]);
    };
    
    // Remove remark
    const removeRemark = (index) => {
        const updatedRemarks = [...remarks];
        updatedRemarks.splice(index, 1);
        setRemarks(updatedRemarks);
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.objectiveOfCalling) {
            setError("Please enter Objective of Calling");
            return;
        }
        
        if (!formData.descriptionOfCalling) {
            setError("Please enter Description of Calling");
            return;
        }
        
        if (remarks.length === 0) {
            setError("Please add at least one remark");
            return;
        }
        
        // Validate each remark has a value
        for (let i = 0; i < remarks.length; i++) {
            if (!remarks[i].remark) {
                setError(`Remark ${i + 1} is required`);
                return;
            }
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const requestData = {
                objectiveOfCalling: formData.objectiveOfCalling,
                descriptionOfCalling: formData.descriptionOfCalling,
                remarks: remarks,
                callingStatus: formData.callingStatus,
                isNewValueToBeUpdatedRequired: formData.isNewValueToBeUpdatedRequired,
                dependentRemarkRequired: formData.dependentRemarkRequired,
                isManualRemarkRequired: formData.isManualRemarkRequired,
                isObjectOfCallingDone: formData.isObjectOfCallingDone,
                callingDate: new Date(formData.callingDate)
            };
            
            const response = await createObjectiveOfCalling(requestData);
            console.log("Response:", response.data);
            
            if (response.data.success) {
                setSuccess("Objective of Calling created successfully!");
                
                // Reset form
                setFormData({
                    objectiveOfCalling: "",
                    descriptionOfCalling: "",
                    callingStatus: "Active",
                    isNewValueToBeUpdatedRequired: false,
                    dependentRemarkRequired: false,
                    isManualRemarkRequired: true,
                    isObjectOfCallingDone: false,
                    callingDate: new Date().toISOString().slice(0, 16)
                });
                setRemarks([]);
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(null);
                }, 3000);
            } else {
                setError(response.data.message || "Failed to create objective");
            }
        } catch (error) {
            console.error("Error creating objective:", error);
            setError(error.response?.data?.message || "Failed to create objective of calling");
        } finally {
            setLoading(false);
        }
    };
    
    // Reset form
    const handleReset = () => {
        setFormData({
            objectiveOfCalling: "",
            descriptionOfCalling: "",
            callingStatus: "Active",
            isNewValueToBeUpdatedRequired: false,
            dependentRemarkRequired: false,
            isManualRemarkRequired: true,
            isObjectOfCallingDone: false,
            callingDate: new Date().toISOString().slice(0, 16)
        });
        setRemarks([]);
        setError(null);
        setSuccess(null);
    };
    
    return (
        <Container fluid className="mt-4">
            <Row>
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Calling Management</Breadcrumb.Item>
                        <Breadcrumb.Item active>Create Objective</Breadcrumb.Item>
                    </Breadcrumb>
                    <h4 className="mb-4">Create Objective of Calling</h4>
                </Col>
            </Row>
            
            <Row>
                <Col lg={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body>
                            {/* Success Alert */}
                            {success && (
                                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                                    {success}
                                </Alert>
                            )}
                            
                            {/* Error Alert */}
                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                {/* Basic Information Section */}
                                <h5 className="mb-3">Basic Information</h5>
                                
                                {/* Objective of Calling - Text Input */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Objective of Calling *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="objectiveOfCalling"
                                        placeholder="Enter objective of calling (e.g., SLC, ABSENTEE, PRINCIPAL, etc.)"
                                        value={formData.objectiveOfCalling}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Enter the objective name (e.g., SLC, ABSENTEE, PRINCIPAL, DEO, BEO, BLC, or any custom objective)
                                    </Form.Text>
                                </Form.Group>
                                
                                {/* Description of Calling - New Field */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Description of Calling *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descriptionOfCalling"
                                        placeholder="Enter detailed description of the calling objective"
                                        value={formData.descriptionOfCalling}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Provide a detailed description explaining the purpose and context of this calling objective
                                    </Form.Text>
                                </Form.Group>
                                
                                {/* Calling Status */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Calling Status</Form.Label>
                                    <Select
                                        options={statusOptions}
                                        onChange={handleStatusChange}
                                        placeholder="Select status..."
                                        value={statusOptions.find(opt => opt.value === formData.callingStatus)}
                                        isClearable={false}
                                    />
                                </Form.Group>
                                
                                {/* Calling Date */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Calling Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="callingDate"
                                        value={formData.callingDate}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                
                                {/* Configuration Section */}
                                <h5 className="mb-3 mt-4">Field Configuration</h5>
                                
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="switch"
                                                id="isNewValueToBeUpdatedRequired"
                                                label="New Value Update Required"
                                                name="isNewValueToBeUpdatedRequired"
                                                checked={formData.isNewValueToBeUpdatedRequired}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Show new/updated information field
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="switch"
                                                id="dependentRemarkRequired"
                                                label="Dependent Remark Required"
                                                name="dependentRemarkRequired"
                                                checked={formData.dependentRemarkRequired}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Show dependent remark dropdown
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="switch"
                                                id="isManualRemarkRequired"
                                                label="Manual Remark Required"
                                                name="isManualRemarkRequired"
                                                checked={formData.isManualRemarkRequired}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Show manual comment field
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                {/* Remarks Section */}
                                <h5 className="mb-3 mt-4">
                                    Remarks & Dependent Dropdowns
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="ms-3"
                                        onClick={addRemark}
                                    >
                                        + Add Remark
                                    </Button>
                                </h5>
                                
                                {remarks.length === 0 ? (
                                    <Alert variant="info">
                                        No remarks added. Click "Add Remark" to create remarks for this objective.
                                    </Alert>
                                ) : (
                                    remarks.map((remark, index) => (
                                        <Card key={index} className="mb-3 bg-light">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h6 className="mb-0">Remark {index + 1}</h6>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => removeRemark(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                
                                                {/* Remark Field */}
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Remark *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter remark (e.g., Documents Pending, Fee Pending)"
                                                        value={remark.remark}
                                                        onChange={(e) => handleRemarkChange(index, 'remark', e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>
                                                
                                                {/* Dependent Remarks Section */}
                                                <div className="ms-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <Form.Label className="mb-0">Dependent Remarks</Form.Label>
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={() => addDependentRemark(index)}
                                                        >
                                                            + Add Option
                                                        </Button>
                                                    </div>
                                                    
                                                    {remark.dependentRemarks && remark.dependentRemarks.length === 0 ? (
                                                        <Alert variant="secondary" className="py-2">
                                                            <small>No dependent remarks added. Click "Add Option" to create dependent dropdown options.</small>
                                                        </Alert>
                                                    ) : (
                                                        remark.dependentRemarks && remark.dependentRemarks.map((depRemark, depIndex) => (
                                                            <div key={depIndex} className="d-flex mb-2">
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder={`Dependent option ${depIndex + 1}`}
                                                                    value={depRemark}
                                                                    onChange={(e) => handleDependentRemarkChange(index, depIndex, e.target.value)}
                                                                    className="me-2"
                                                                />
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => removeDependentRemark(index, depIndex)}
                                                                >
                                                                    ×
                                                                </Button>
                                                            </div>
                                                        ))
                                                    )}
                                                    
                                                    <Form.Text className="text-muted">
                                                        These options will appear in dependent remark dropdown when this remark is selected
                                                    </Form.Text>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )}
                                
                                {/* Preview Button */}
                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        Reset Form
                                    </Button>
                                    <div>
                                        <Button
                                            variant="info"
                                            className="me-2"
                                            onClick={() => setShowPreview(true)}
                                            disabled={loading}
                                        >
                                            Preview
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating...' : 'Create Objective'}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Preview Modal */}
            <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Preview: {formData.objectiveOfCalling || 'Not Entered'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6 className="mb-3">Objective Details:</h6>
                    <div className="mb-3">
                        <strong>Objective:</strong> {formData.objectiveOfCalling || 'Not Entered'}<br/>
                        <strong>Description:</strong> {formData.descriptionOfCalling || 'Not Entered'}<br/>
                        <strong>Status:</strong> {formData.callingStatus}<br/>
                        <strong>Calling Date:</strong> {formData.callingDate ? new Date(formData.callingDate).toLocaleString() : 'Not Set'}<br/>
                        <strong>New Value Update Required:</strong> {formData.isNewValueToBeUpdatedRequired ? 'Yes' : 'No'}<br/>
                        <strong>Dependent Remark Required:</strong> {formData.dependentRemarkRequired ? 'Yes' : 'No'}<br/>
                        <strong>Manual Remark Required:</strong> {formData.isManualRemarkRequired ? 'Yes' : 'No'}
                    </div>
                    
                    <h6 className="mb-3">Remarks Structure:</h6>
                    {remarks.length === 0 ? (
                        <Alert variant="warning">No remarks added yet</Alert>
                    ) : (
                        remarks.map((remark, index) => (
                            <Card key={index} className="mb-2">
                                <Card.Body className="py-2">
                                    <strong>{index + 1}. {remark.remark || 'Unnamed Remark'}</strong>
                                    {remark.dependentRemarks && remark.dependentRemarks.length > 0 && (
                                        <div className="mt-2 ms-3">
                                            <small className="text-muted">Dependent Options:</small>
                                            <ul className="mb-0">
                                                {remark.dependentRemarks.map((dep, depIndex) => (
                                                    <li key={depIndex}>
                                                        <small>{dep || 'Empty option'}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPreview(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};