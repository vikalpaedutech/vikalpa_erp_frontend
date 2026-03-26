

// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb  } from 'react-bootstrap';


// import { createCallings, createObjectiveOfCalling, getCallingsByAssignedTo, updateCalling, getObjectiveOfCall } from "../service/CallingServices/Calling.services.js";
// import { DistrictBlockSchoolById, ClassOfStudent  } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";


// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

// import Select from 'react-select'
// import { formToJSON } from "axios";
// import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
// import { UserContext } from "../components/contextAPIs/User.context.js";






// export const Calling =  () =>{


// //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
    
//      const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//      const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
//      const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
//   //______________________________________________________________________________________________

//   //ClassContext API
//   const {classContext, setClassContext} = useContext(ClassContext);
//   const {userData, setUserData} = useContext(UserContext);


//   console.log(userData)


//   const GetObjectiveOfCall =  async ()=>{
//     try {
//         const response = await getObjectiveOfCall()
//         console.log(response.data.data)
//     } catch (error) {
//      console.log("error fetching objective of call")
//     }
//   }

//   useEffect(()=>{
//     GetObjectiveOfCall()


//   })


//     return(
//         <>

//         hello calling
//         </>
//     )


// };






// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Alert, Breadcrumb, Card, Button, Modal, Badge } from 'react-bootstrap';
import { getCallingsByAssignedTo, updateCalling, getObjectiveOfCall } from "../service/CallingServices/Calling.services.js";

//importing context api
import { DistrictBlockSchoolContext, BlockContext, SchoolContext, ClassContext } from "../components/contextAPIs/DependentDropdowns.contextAPI.js";
import Select from 'react-select';
import { UserContext } from "../components/contextAPIs/User.context.js";

export const Calling = () => {
    // Accessing context
    const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
    const { blockContext, setBlockContext } = useContext(BlockContext);
    const { schoolContext, setSchoolContext } = useContext(SchoolContext);
    const { classContext, setClassContext } = useContext(ClassContext);
    const { userData, setUserData } = useContext(UserContext);

    // State variables
    const [objectiveOptions, setObjectiveOptions] = useState([]);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [callingData, setCallingData] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        callingStatus: '',
        remark: '',
        dependentRemark: '',
        manualRemark: '',
        newUpdatedValue: '',
        descriptionOfCalling: '',
    });
    const [remarkOptions, setRemarkOptions] = useState([]);
    const [dependentOptions, setDependentOptions] = useState([]);
    const [selectedObjectiveDetails, setSelectedObjectiveDetails] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch objectives on component mount
    useEffect(() => {
        fetchObjectives();
    }, []);

    // Fetch objectives function
    const fetchObjectives = async () => {
        try {
            const response = await getObjectiveOfCall();
            console.log("Objectives fetched:", response.data);

            if (response.data.success && response.data.data) {
                // Format for react-select
                const options = response.data.data.map(obj => ({
                    value: obj._id,
                    label: obj.objectiveOfCalling,
                    descriptionOfCalling: obj.descriptionOfCalling,
                    remarks: obj.remarks,
                    dependentRemarkRequired: obj.dependentRemarkRequired,
                    isManualRemarkRequired: obj.isManualRemarkRequired,
                    isNewValueToBeUpdatedRequired: obj.isNewValueToBeUpdatedRequired,
                    isObjectOfCallingDone: obj.isObjectOfCallingDone
                }));
                setObjectiveOptions(options);
            }
        } catch (error) {
            console.error("Error fetching objectives:", error);
            setError("Failed to fetch objectives");
        }
    };

    // Handle objective selection change
    const handleObjectiveChange = (selectedOption) => {
        setSelectedObjective(selectedOption);
        if (selectedOption) {
            setSelectedObjectiveDetails({
                dependentRemarkRequired: selectedOption.dependentRemarkRequired,
                isManualRemarkRequired: selectedOption.isManualRemarkRequired,
                isNewValueToBeUpdatedRequired: selectedOption.isNewValueToBeUpdatedRequired,
                descriptionOfCalling: selectedOption.descriptionOfCalling,
                remarks: selectedOption.remarks
            });
            // Set remark options when objective changes
            if (selectedOption.remarks && selectedOption.remarks.length > 0) {
                setRemarkOptions(selectedOption.remarks);
            } else {
                setRemarkOptions([]);
            }
        } else {
            setSelectedObjectiveDetails(null);
            setRemarkOptions([]);
        }
        // Reset search flag when objective changes
        setHasSearched(false);
        setCallingData([]);
        setStatistics(null);
    };

    // Handle search/filter submission
    const handleSearch = () => {
        if (userData?._id && selectedObjective?.value) {
            fetchCallings();
            setHasSearched(true);
        } else {
            setError("Please select an objective first");
        }
    };

    // Fetch callings function
    const fetchCallings = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const reqBody = {
                assignedTo: userData._id,
                objectiveOfCallId: selectedObjective.value
            };
            
            const response = await getCallingsByAssignedTo(reqBody);
            console.log("Callings fetched:", response.data);
            
            if (response.data.success) {
                setCallingData(response.data.data);
                setStatistics(response.data.statistics);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching callings:", error);
            setError("Failed to fetch callings");
        } finally {
            setLoading(false);
        }
    };

    // Handle modal open
    const handleEditClick = (calling) => {
        setSelectedCall(calling);
        
        // Find the remarks for the current objective
        const currentObjective = objectiveOptions.find(opt => opt.value === calling.objectiveOfCallId);
        if (currentObjective && currentObjective.remarks) {
            setRemarkOptions(currentObjective.remarks);
            setSelectedObjectiveDetails({
                dependentRemarkRequired: currentObjective.dependentRemarkRequired,
                isManualRemarkRequired: currentObjective.isManualRemarkRequired,
                isNewValueToBeUpdatedRequired: currentObjective.isNewValueToBeUpdatedRequired,
                descriptionOfCalling: currentObjective.descriptionOfCalling,
                remarks: currentObjective.remarks
            });
        }
        
        setUpdateFormData({
            callingStatus: calling.callingStatus || '',
            remark: calling.remark || '',
            dependentRemark: calling.dependentRemark || '',
            manualRemark: calling.manualRemark || '',
            newUpdatedValue: calling.newUpdatedValue || '',
            descriptionOfCalling: calling.descriptionOfCalling || ''
        });
        
        setShowModal(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setShowModal(false);
        setSelectedCall(null);
        setUpdateFormData({
            callingStatus: '',
            remark: '',
            dependentRemark: '',
            manualRemark: '',
            newUpdatedValue: '',
            descriptionOfCalling: ''
        });
        setDependentOptions([]);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle remark change to update dependent options
    const handleRemarkChange = (e) => {
        const selectedRemark = e.target.value;
        setUpdateFormData(prev => ({
            ...prev,
            remark: selectedRemark,
            dependentRemark: '' // Reset dependent remark when remark changes
        }));
        
        // Find dependent remarks for selected remark
        const currentObjective = objectiveOptions.find(opt => opt.value === selectedCall?.objectiveOfCallId);
        if (currentObjective && currentObjective.remarks) {
            const remarkObj = currentObjective.remarks.find(r => r.remark === selectedRemark);
            if (remarkObj && remarkObj.dependentRemarks && remarkObj.dependentRemarks.length > 0) {
                setDependentOptions(remarkObj.dependentRemarks);
            } else {
                setDependentOptions([]);
            }
        }
    };

    // Handle update submission
    const handleUpdateSubmit = async () => {
        if (!selectedCall?._id) return;
        
        setLoading(true);
        
        try {
            const updateData = {
                _id: selectedCall._id,
                ...updateFormData
            };
            
            const response = await updateCalling(updateData);
            console.log("Update response:", response.data);
            
            if (response.data.success) {
                // Refresh the callings list
                await fetchCallings();
                handleModalClose();
                // Show success message
                alert("Calling record updated successfully!");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error updating calling:", error);
            setError("Failed to update calling record");
        } finally {
            setLoading(false);
        }
    };

    // Handle phone number click
    const handlePhoneClick = (phoneNumber) => {
        if (phoneNumber && phoneNumber !== 'N/A') {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch(status) {
            case 'CONNECTED':
                return 'success';
            case 'NOT_CONNECTED':
                return 'danger';
            case 'PENDING':
                return 'warning';
            case 'COMPLETED':
                return 'info';
            default:
                return 'secondary';
        }
    };

    // Get calling type badge color
    const getCallingTypeBadge = (type) => {
        return type === 'MB_CALLING' ? 'primary' : 'dark';
    };

    // Render MB Calling Card
    const renderMBCallingCard = (call) => {
        const studentDetails = call.studentDetails;
        
        return (
            <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Badge bg={getCallingTypeBadge(call.callingType)}>
                        MB Calling
                    </Badge>
                    <Badge bg={getStatusBadge(call.callingStatus)}>
                        {call.callingStatus || 'N/A'}
                    </Badge>
                </Card.Header>
                <Card.Body>
                    <Card.Title className="mb-3">
                        {studentDetails?.firstName || call.name || 'No Name'}
                    </Card.Title>
                    
                    {/* Student Details */}
                    {studentDetails?.fatherName && (
                        <div className="mb-2">
                            <strong>Father's Name:</strong> {studentDetails.fatherName}
                        </div>
                    )}
                    
                    {studentDetails?.studentSrn && (
                        <div className="mb-2">
                            <strong>Student SRN:</strong> {studentDetails.studentSrn}
                        </div>
                    )}
                    
                    {studentDetails?.classofStudent && (
                        <div className="mb-2">
                            <strong>Class:</strong> {studentDetails.classofStudent}
                        </div>
                    )}
                    
                    {/* Contact Numbers - Clickable */}
                    <div className="mb-2">
                        <strong>Contact Numbers:</strong>
                        {studentDetails?.personalContact && (
                            <div className="mt-1">
                                <Button 
                                    variant="link" 
                                    className="p-0 me-2 text-primary"
                                    onClick={() => handlePhoneClick(studentDetails.personalContact)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    📞 {studentDetails.personalContact}
                                </Button>
                            </div>
                        )}
                        {studentDetails?.ParentContact && studentDetails.ParentContact !== studentDetails.personalContact && (
                            <div>
                                <Button 
                                    variant="link" 
                                    className="p-0 me-2 text-primary"
                                    onClick={() => handlePhoneClick(studentDetails.ParentContact)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    📞 {studentDetails.ParentContact} 
                                </Button>
                            </div>
                        )}
                        {studentDetails?.otherContact && (
                            <div>
                                <Button 
                                    variant="link" 
                                    className="p-0 text-primary"
                                    onClick={() => handlePhoneClick(studentDetails.otherContact)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    📞 {studentDetails.otherContact} (Other)
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {/* Call Script/Description */}
                    {selectedObjective?.descriptionOfCalling && (
                        <div className="mb-3 mt-3">
                            <div className="border-start border-primary border-3 ps-3 bg-light p-2 rounded">
                                <strong className="text-primary">📋Calling Purpose/Description:</strong>
                                <p className="mb-0 mt-1 small text-muted">{selectedObjective.descriptionOfCalling}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Remark Information */}
                    {call.remark && (
                        <div className="mb-2 mt-3">
                            <strong>Remark:</strong> {call.remark}
                        </div>
                    )}
                    {call.dependentRemark && (
                        <div className="mb-2">
                            <strong>Details:</strong> {call.dependentRemark}
                        </div>
                    )}
                    {call.manualRemark && (
                        <div className="mb-2">
                            <strong>Manual Comment:</strong> {call.manualRemark}
                        </div>
                    )}
                    
                    {/* Updated Value */}
                    {call.newUpdatedValue && (
                        <div className="mb-2 text-info">
                            <strong>Updated Info:</strong> {call.newUpdatedValue}
                        </div>
                    )}
                    
                    {/* Date Information */}
                    {/* <div className="text-muted small mt-3">
                        <div>Called on: {call.callingDate ? new Date(call.callingDate).toLocaleString() : 'N/A'}</div>
                        <div>Created: {call.createdAt ? new Date(call.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div> */}
                </Card.Body>
                <Card.Footer>
                    <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleEditClick(call)}
                        className="w-100"
                    >
                        Update Call Details
                    </Button>
                </Card.Footer>
            </Card>
        );
    };

    // Render Random Calling Card
    const renderRandomCallingCard = (call) => {
        return (
            <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Badge bg={getCallingTypeBadge(call.callingType)}>
                    
                        {call.callingType || "Pending"}
                    </Badge>
                    <Badge bg={getStatusBadge(call.callingStatus)}>
                        {call.callingStatus || 'Pending'}
                    </Badge>
                </Card.Header>
                <Card.Body>
                    <Card.Title className="mb-3">
                        {call.name || 'No Name'}
                    </Card.Title>
                    
                    {/* Called To */}
                    {call.calledTo && (
                        <div className="mb-2">
                            <strong>Called To:</strong> {call.calledTo}
                        </div>
                    )}
                    
                    {/* Father Name (if student) */}
                    {call.fatherName && (
                        <div className="mb-2">
                            <strong>Father's Name:</strong> {call.fatherName}
                        </div>
                    )}
                    
                    {/* Location Details */}
                    {call.district && (
                        <div className="mb-2">
                            <strong>District:</strong> {call.district}
                        </div>
                    )}
                    {call.block && (
                        <div className="mb-2">
                            <strong>Block:</strong> {call.block}
                        </div>
                    )}
                    {call.school && (
                        <div className="mb-2">
                            <strong>School:</strong> {call.school}
                        </div>
                    )}
                    
                    {/* Contact Numbers - Clickable */}
                    <div className="mb-2">
                        <strong>Contact Numbers:</strong>
                        {call.contact1 && (
                            <div className="mt-1">
                                <Button 
                                    variant="link" 
                                    className="p-0 me-2 text-primary"
                                    onClick={() => handlePhoneClick(call.contact1)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    📞 {call.contact1}
                                </Button>
                            </div>
                        )}
                        {call.contact2 && (
                            <div>
                                <Button 
                                    variant="link" 
                                    className="p-0 me-2 text-primary"
                                    onClick={() => handlePhoneClick(call.contact2)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    📞 {call.contact2}
                                </Button>
                            </div>
                        )}
                        {call.contact3 && (
                            <div>
                                <Button 
                                    variant="link" 
                                    className="p-0 text-primary"
                                    onClick={() => handlePhoneClick(call.contact3)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    📞 {call.contact3}
                                </Button>
                            </div>
                        )}
                        {!call.contact1 && !call.contact2 && !call.contact3 && (
                            <span className="text-muted"> No contact available</span>
                        )}
                    </div>
                    
                    {/* Call Script/Description */}
                    {selectedObjective?.descriptionOfCalling && (
                        <div className="mb-3 mt-3">
                            <div className="border-start border-primary border-3 ps-3 bg-light p-2 rounded">
                                <strong className="text-primary">📋 Call Purpose/Description:</strong>
                                <p className="mb-0 mt-1 small text-muted">{selectedObjective.descriptionOfCalling}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Remark Information */}
                    {call.remark && (
                        <div className="mb-2 mt-3">
                            <strong>Remark:</strong> {call.remark}
                        </div>
                    )}
                    {call.dependentRemark && (
                        <div className="mb-2">
                            <strong>Details:</strong> {call.dependentRemark}
                        </div>
                    )}
                    {call.manualRemark && (
                        <div className="mb-2">
                            <strong>Manual Comment:</strong> {call.manualRemark}
                        </div>
                    )}
                    
                    {/* Updated Value */}
                    {call.newUpdatedValue && (
                        <div className="mb-2 text-info">
                            <strong>Updated Info:</strong> {call.newUpdatedValue}
                        </div>
                    )}
                    
                    {/* Description of Calling (if available in call object) */}
                    {call.descriptionOfCalling && (
                        <div className="mb-2 text-info">
                            <strong>Call Description:</strong> {call.descriptionOfCalling}
                        </div>
                    )}
                    
                    {/* Date Information */}
                    {/* <div className="text-muted small mt-3">
                        <div>Called on: {call.callingDate ? new Date(call.callingDate).toLocaleString() : 'N/A'}</div>
                        <div>Created: {call.createdAt ? new Date(call.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div> */}
                </Card.Body>
                <Card.Footer>
                    <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleEditClick(call)}
                        className="w-100"
                    >
                        Update Call Details
                    </Button>
                </Card.Footer>
            </Card>
        );
    };

    return (
        <>
            <Container fluid className="mt-4">
                <Row>
                    <Col>
                        {/* <Breadcrumb>
                            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Calling Management</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <h4 className="mb-4">Callings</h4>
                        <hr></hr>
                    </Col>
                </Row>

                {/* Filters Section */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Select Objective of Calling</Form.Label>
                            <Select
                                options={objectiveOptions}
                                value={selectedObjective}
                                onChange={handleObjectiveChange}
                                placeholder="Select objective..."
                                isClearable={false}
                                isLoading={!objectiveOptions.length}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Button 
                            variant="primary" 
                            onClick={handleSearch}
                            disabled={loading || !selectedObjective}
                            className="mt-4"
                        >
                            {loading ? 'Loading...' : 'Search Calls'}
                        </Button>
                    </Col>
                </Row>

                {/* Statistics Cards - Only show after search */}
                {hasSearched && statistics && (
                    <Row className="mb-4">
                        <Col md={2}>
                            <Card className="text-center">
                                <Card.Body>
                                    <h5>Total Calls</h5>
                                    <h3>{statistics.totalCalls}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="text-center bg-success text-white">
                                <Card.Body>
                                    <h5>Connected</h5>
                                    <h3>{statistics.connectedCalls}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="text-center bg-danger text-white">
                                <Card.Body>
                                    <h5>Not Connected</h5>
                                    <h3>{statistics.notConnectedCalls}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="text-center bg-warning">
                                <Card.Body>
                                    <h5>Pending</h5>
                                    <h3>{statistics.pendingCalls}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="text-center bg-info text-white">
                                <Card.Body>
                                    <h5>MB Calls</h5>
                                    <h3>{statistics.mBCalls}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="text-center bg-dark text-white">
                                <Card.Body>
                                    <h5>Random Calls</h5>
                                    <h3>{statistics.randomCalls}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                {/* Loading State */}
                {loading && !callingData.length && hasSearched && (
                    <Row>
                        <Col className="text-center">
                            <Alert variant="info">Loading call data...</Alert>
                        </Col>
                    </Row>
                )}

                {/* Call Cards Section */}
                {hasSearched && (
                    <Row>
                        {callingData.length > 0 ? (
                            callingData.map((call) => (
                                <Col md={6} lg={4} key={call._id} className="mb-4">
                                    {call.callingType === 'MB_CALLING' 
                                        ? renderMBCallingCard(call)
                                        : renderRandomCallingCard(call)
                                    }
                                </Col>
                            ))
                        ) : (
                            !loading && (
                                <Col>
                                    <Alert variant="info">
                                        No call records found for this objective. {selectedObjective && `Objective: ${selectedObjective.label}`}
                                    </Alert>
                                </Col>
                            )
                        )}
                    </Row>
                )}

                {/* Update Modal */}
                <Modal show={showModal} onHide={handleModalClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Update Call Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedCall && selectedObjectiveDetails && (
                            <Form>
                                {/* Call Information Summary - Dynamic based on calling type */}
                                <Alert variant="info">
                                    {selectedCall.callingType === 'MB_CALLING' ? (
                                        // MB Calling Summary
                                        <>
                                            <strong>Student Name:</strong> {selectedCall.studentDetails?.firstName || selectedCall.name || 'N/A'}<br/>
                                            {selectedCall.studentDetails?.fatherName && (
                                                <><strong>Father's Name:</strong> {selectedCall.studentDetails.fatherName}<br/></>
                                            )}
                                            {selectedCall.studentDetails?.studentSrn && (
                                                <><strong>Student SRN:</strong> {selectedCall.studentDetails.studentSrn}<br/></>
                                            )}
                                            <strong>Contact:</strong>{' '}
                                            {selectedCall.studentDetails?.personalContact && (
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 text-primary"
                                                    onClick={() => handlePhoneClick(selectedCall.studentDetails.personalContact)}
                                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    {selectedCall.studentDetails.personalContact}
                                                </Button>
                                            )}
                                            {selectedCall.studentDetails?.ParentContact && selectedCall.studentDetails.ParentContact !== selectedCall.studentDetails?.personalContact && (
                                                <>
                                                    {' / '}
                                                    <Button 
                                                        variant="link" 
                                                        className="p-0 text-primary"
                                                        onClick={() => handlePhoneClick(selectedCall.studentDetails.ParentContact)}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        {selectedCall.studentDetails.ParentContact}
                                                    </Button>
                                                </>
                                            )}
                                            <br/>
                                            <strong>Call Type:</strong> {selectedCall.callingType}<br/>
                                            <strong>Called To:</strong> {selectedCall.calledTo || 'Student'}
                                        </>
                                    ) : (
                                        // Random Calling Summary
                                        <>
                                            <strong>Name:</strong> {selectedCall.name || 'N/A'}<br/>
                                            {selectedCall.fatherName && (
                                                <><strong>Father's Name:</strong> {selectedCall.fatherName}<br/></>
                                            )}
                                            <strong>Called To:</strong> {selectedCall.calledTo || 'N/A'}<br/>
                                            {selectedCall.district && (
                                                <><strong>District:</strong> {selectedCall.district}<br/></>
                                            )}
                                            {selectedCall.block && (
                                                <><strong>Block:</strong> {selectedCall.block}<br/></>
                                            )}
                                            {selectedCall.school && (
                                                <><strong>School:</strong> {selectedCall.school}<br/></>
                                            )}
                                            <strong>Contact:</strong>{' '}
                                            {selectedCall.contact1 && (
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 text-primary"
                                                    onClick={() => handlePhoneClick(selectedCall.contact1)}
                                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    {selectedCall.contact1}
                                                </Button>
                                            )}
                                            {selectedCall.contact2 && (
                                                <>
                                                    {' / '}
                                                    <Button 
                                                        variant="link" 
                                                        className="p-0 text-primary"
                                                        onClick={() => handlePhoneClick(selectedCall.contact2)}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        {selectedCall.contact2}
                                                    </Button>
                                                </>
                                            )}
                                            {selectedCall.contact3 && (
                                                <>
                                                    {' / '}
                                                    <Button 
                                                        variant="link" 
                                                        className="p-0 text-primary"
                                                        onClick={() => handlePhoneClick(selectedCall.contact3)}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        {selectedCall.contact3}
                                                    </Button>
                                                </>
                                            )}
                                            <br/>
                                            <strong>Call Type:</strong> {selectedCall.callingType}
                                        </>
                                    )}
                                </Alert>

                                {/* Call Script/Description - Display in modal */}
                                {selectedObjectiveDetails.descriptionOfCalling && (
                                    <Alert variant="primary" className="mb-3">
                                        <strong>📋 Call Script/Description:</strong>
                                        <p className="mb-0 mt-1">{selectedObjectiveDetails.descriptionOfCalling}</p>
                                    </Alert>
                                )}

                                {/* Calling Status */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Calling Status</Form.Label>
                                    <Form.Select 
                                        name="callingStatus"
                                        value={updateFormData.callingStatus}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="CONNECTED">Connected</option>
                                        <option value="NOT_CONNECTED">Not Connected</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="Wrong Number">Wrong Number</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Remark Dropdown - Always show if remark options exist */}
                                {remarkOptions.length > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Remark</Form.Label>
                                        <Form.Select 
                                            name="remark"
                                            value={updateFormData.remark}
                                            onChange={handleRemarkChange}
                                        >
                                            <option value="">Select Remark</option>
                                            {remarkOptions.map((opt, idx) => (
                                                <option key={idx} value={opt.remark}>{opt.remark}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {/* Dependent Remark Dropdown - Only show if dependentRemarkRequired is true AND dependent options exist */}
                                {selectedObjectiveDetails.dependentRemarkRequired && 
                                 updateFormData.remark && 
                                 dependentOptions.length > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dependent Remark</Form.Label>
                                        <Form.Select 
                                            name="dependentRemark"
                                            value={updateFormData.dependentRemark}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Dependent Remark</option>
                                            {dependentOptions.map((depRemark, idx) => (
                                                <option key={idx} value={depRemark}>{depRemark}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {/* Manual Remark - Only show if isManualRemarkRequired is true */}
                                {selectedObjectiveDetails.isManualRemarkRequired && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Manual Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="manualRemark"
                                            value={updateFormData.manualRemark}
                                            onChange={handleInputChange}
                                            placeholder="Enter manual comment..."
                                        />
                                    </Form.Group>
                                )}

                                {/* New Updated Value - Only show if isNewValueToBeUpdatedRequired is true */}
                                {selectedObjectiveDetails.isNewValueToBeUpdatedRequired && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>New/Updated Information</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="newUpdatedValue"
                                            value={updateFormData.newUpdatedValue}
                                            onChange={handleInputChange}
                                            placeholder="Enter any new or updated information (e.g., new contact number, address change, etc.)"
                                        />
                                    </Form.Group>
                                )}
                            </Form>
                        )}
                        
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleUpdateSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Call'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};