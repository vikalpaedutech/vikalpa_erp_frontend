// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Spinner, Button } from 'react-bootstrap';
// import { callingDashboardByUserId } from "../service/CallingServices/Calling.services.js";
// import { useNavigate } from 'react-router-dom';

// //importing context api
// import { DistrictBlockSchoolContext, BlockContext, SchoolContext, ClassContext } from "../components/contextAPIs/DependentDropdowns.contextAPI.js";
// import Select from 'react-select';
// import { UserContext } from "../components/contextAPIs/User.context.js";

// import { getObjectiveOfCall, callilngDashboardOfAllUsers } from "../service/CallingServices/Calling.services.js";

// export const CallingDashboardOfAllUsers = () => {
//     const navigate = useNavigate();
    
//     // State variables
//     const [objectiveOptions, setObjectiveOptions] = useState([]);
//     const [selectedObjective, setSelectedObjective] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const [dashboardData, setDashboardData] = useState(null);

//     // Fetch objective of callings
//     const fetchObjectiveOfCallings = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await getObjectiveOfCall();
//             console.log("Fetched data:", response.data.data);
            
//             // Transform data for react-select options
//             const options = response.data.data.map(item => ({
//                 value: item._id,
//                 label: item.objectiveOfCalling,
//                 originalData: item // Store full data if needed
//             }));
            
//             setObjectiveOptions(options);
//         } catch (error) {
//             console.log("Error occurred:", error.message);
//             setError("Failed to fetch objective of callings. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle objective selection
//     const handleObjectiveChange = (selectedOption) => {
//         setSelectedObjective(selectedOption);
//         setDashboardData(null); // Clear previous dashboard data when selection changes
//         setError(null);
//     };

//     // Handle form submission
//     const handleSubmit = async () => {
//         if (!selectedObjective) {
//             setError("Please select an objective of calling before submitting.");
//             return;
//         }

//         setSubmitting(true);
//         setError(null);
        
//         const reqBody = {
//             objectiveOfCallId: selectedObjective.value
//         };
        
//         try {
//             const response = await callilngDashboardOfAllUsers(reqBody);
//             console.log("Dashboard data:", response.data);
//             setDashboardData(response.data);
//         } catch (error) {
//             console.log("Error occurred:", error.message);
//             setError("Failed to fetch dashboard data. Please try again.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     useEffect(() => {
//         fetchObjectiveOfCallings();
//     }, []);

//     return (
//         <>
//             <Container fluid className="mt-4">
//                 <Row>
//                     <Col md={12}>
//                         <Card>
//                             <Card.Header>
//                                 <h4>Calling Dashboard - All Users</h4>
//                             </Card.Header>
//                             <Card.Body>
//                                 {/* Filter Section */}
//                                 <Row className="mb-4">
//                                     <Col md={8}>
//                                         <Form.Group>
//                                             <Form.Label>Select Objective of Calling</Form.Label>
//                                             <Select
//                                                 options={objectiveOptions}
//                                                 value={selectedObjective}
//                                                 onChange={handleObjectiveChange}
//                                                 isLoading={loading}
//                                                 isDisabled={loading || submitting}
//                                                 placeholder={loading ? "Loading..." : "Select an objective..."}
//                                                 noOptionsMessage={() => "No objectives found"}
//                                             />
//                                         </Form.Group>
//                                     </Col>
//                                     <Col md={4} className="d-flex align-items-end">
//                                         <Button 
//                                             variant="primary" 
//                                             onClick={handleSubmit}
//                                             disabled={!selectedObjective || submitting || loading}
//                                             className="w-100"
//                                         >
//                                             {submitting ? (
//                                                 <>
//                                                     <Spinner as="span" animation="border" size="sm" className="me-2" />
//                                                     Loading...
//                                                 </>
//                                             ) : (
//                                                 "Submit"
//                                             )}
//                                         </Button>
//                                     </Col>
//                                 </Row>

//                                 {/* Error Alert */}
//                                 {error && (
//                                     <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                                         {error}
//                                     </Alert>
//                                 )}

//                                 {/* Dashboard Data Display */}
//                                 {dashboardData && (
//                                     <Row className="mt-4">
//                                         <Col md={12}>
//                                             <Card>
//                                                 <Card.Header>
//                                                     <h5>Dashboard Results</h5>
//                                                 </Card.Header>
//                                                 <Card.Body>
//                                                     <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
//                                                     {/* You can display the data in a more structured format here */}
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     );
// };



// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Spinner, Button, Badge } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import Select from 'react-select';

// //importing services
// import { getObjectiveOfCall, callilngDashboardOfAllUsers } from "../service/CallingServices/Calling.services.js";

// export const CallingDashboardOfAllUsers = () => {
//     const navigate = useNavigate();
    
//     // State variables
//     const [objectiveOptions, setObjectiveOptions] = useState([]);
//     const [selectedObjective, setSelectedObjective] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const [dashboardData, setDashboardData] = useState([]);
//     const [userWiseData, setUserWiseData] = useState([]);

//     // Fetch objective of callings
//     const fetchObjectiveOfCallings = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await getObjectiveOfCall();
//             console.log("Fetched objectives:", response.data.data);
            
//             // Transform data for react-select options
//             const options = response.data.data.map(item => ({
//                 value: item._id,
//                 label: item.objectiveOfCalling,
//                 originalData: item
//             }));
            
//             setObjectiveOptions(options);
//         } catch (error) {
//             console.log("Error occurred:", error.message);
//             setError("Failed to fetch objective of callings. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Process dashboard data to get user-wise counts
//     const processDashboardData = (data) => {
//         const userMap = new Map();

//         data.forEach(record => {
//             const userId = record.assignedTo;
//             const userName = record.userDetails?.[0]?.name || "Unknown User";
//             const districtName = record.district || "N/A";
//             const centerName = record.schoolDetails?.[0]?.centerName || "N/A";
//             const callingStatus = record.callingStatus || "PENDING";

//             if (!userMap.has(userId)) {
//                 userMap.set(userId, {
//                     userId: userId,
//                     userName: userName,
//                     districtName: districtName,
//                     centerName: centerName,
//                     totalAlloted: 0,
//                     connected: 0,
//                     notConnected: 0,
//                     wrongNumber: 0,
//                     pending: 0,
//                     totalCompleted: 0
//                 });
//             }

//             const userData = userMap.get(userId);
//             userData.totalAlloted++;

//             // Count different statuses
//             if (callingStatus === "CONNECTED") {
//                 userData.connected++;
//                 userData.totalCompleted++;
//             } else if (callingStatus === "NOT_CONNECTED") {
//                 userData.notConnected++;
//                 userData.totalCompleted++;
//             } else if (callingStatus === "Wrong Number") {
//                 userData.wrongNumber++;
//                 userData.totalCompleted++;
//             } else if (callingStatus === "PENDING" || !callingStatus || callingStatus === "") {
//                 userData.pending++;
//             } else {
//                 // Any other status - treat as pending
//                 userData.pending++;
//             }
//         });

//         // Convert map to array and add serial numbers
//         const result = Array.from(userMap.values()).map((item, index) => ({
//             slNo: index + 1,
//             ...item
//         }));

//         return result;
//     };

//     // Handle objective selection
//     const handleObjectiveChange = (selectedOption) => {
//         setSelectedObjective(selectedOption);
//         setDashboardData([]);
//         setUserWiseData([]);
//         setError(null);
//     };

//     // Handle form submission
//     const handleSubmit = async () => {
//         if (!selectedObjective) {
//             setError("Please select an objective of calling before submitting.");
//             return;
//         }

//         setSubmitting(true);
//         setError(null);
        
//         const reqBody = {
//             objectiveOfCallId: selectedObjective.value
//         };
        
//         try {
//             const response = await callilngDashboardOfAllUsers(reqBody);
//             console.log("Dashboard API Response:", response.data);
            
//             const fetchedData = response.data.data || [];
//             setDashboardData(fetchedData);
            
//             // Process data for user-wise dashboard
//             const processedData = processDashboardData(fetchedData);
//             setUserWiseData(processedData);
            
//             console.log("Processed User-wise Data:", processedData);
//         } catch (error) {
//             console.log("Error occurred:", error.message);
//             setError("Failed to fetch dashboard data. Please try again.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Get status badge variant
//     const getStatusBadgeVariant = (status) => {
//         switch(status) {
//             case 'CONNECTED':
//                 return 'success';
//             case 'NOT_CONNECTED':
//                 return 'warning';
//             case 'Wrong Number':
//                 return 'danger';
//             default:
//                 return 'secondary';
//         }
//     };

//     useEffect(() => {
//         fetchObjectiveOfCallings();
//     }, []);

//     return (
//         <>
//             <Container fluid className="mt-4">
//                 <Row>
//                     <Col md={12}>
//                         <Card>
//                             <Card.Header className="bg-primary text-white">
//                                 <h4 className="mb-0">Calling Dashboard - All Users</h4>
//                             </Card.Header>
//                             <Card.Body>
//                                 {/* Filter Section */}
//                                 <Row className="mb-4">
//                                     <Col md={8}>
//                                         <Form.Group>
//                                             <Form.Label className="fw-bold">Select Objective of Calling</Form.Label>
//                                             <Select
//                                                 options={objectiveOptions}
//                                                 value={selectedObjective}
//                                                 onChange={handleObjectiveChange}
//                                                 isLoading={loading}
//                                                 isDisabled={loading || submitting}
//                                                 placeholder={loading ? "Loading..." : "Select an objective..."}
//                                                 noOptionsMessage={() => "No objectives found"}
//                                                 className="react-select-container"
//                                                 classNamePrefix="react-select"
//                                             />
//                                         </Form.Group>
//                                     </Col>
//                                     <Col md={4} className="d-flex align-items-end">
//                                         <Button 
//                                             variant="primary" 
//                                             onClick={handleSubmit}
//                                             disabled={!selectedObjective || submitting || loading}
//                                             className="w-100"
//                                             size="lg"
//                                         >
//                                             {submitting ? (
//                                                 <>
//                                                     <Spinner as="span" animation="border" size="sm" className="me-2" />
//                                                     Loading Dashboard...
//                                                 </>
//                                             ) : (
//                                                 "Generate Dashboard"
//                                             )}
//                                         </Button>
//                                     </Col>
//                                 </Row>

//                                 {/* Selected Objective Info */}
//                                 {selectedObjective && (
//                                     <Alert variant="info" className="mb-4">
//                                         <strong>Selected Objective:</strong> {selectedObjective.label}
//                                     </Alert>
//                                 )}

//                                 {/* Error Alert */}
//                                 {error && (
//                                     <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                                         <strong>Error:</strong> {error}
//                                     </Alert>
//                                 )}

//                                 {/* Dashboard Results */}
//                                 {userWiseData.length > 0 && (
//                                     <>
//                                         <Row className="mb-3">
//                                             <Col md={12}>
//                                                 <Card className="shadow-sm">
//                                                     <Card.Header className="bg-success text-white">
//                                                         <h5 className="mb-0">
//                                                             <strong>Dashboard Summary Report</strong>
//                                                             <Badge bg="light" text="dark" className="ms-3">
//                                                                 Total Users: {userWiseData.length}
//                                                             </Badge>
//                                                             <Badge bg="light" text="dark" className="ms-2">
//                                                                 Total Calls: {userWiseData.reduce((sum, user) => sum + user.totalAlloted, 0)}
//                                                             </Badge>
//                                                         </h5>
//                                                     </Card.Header>
//                                                     <Card.Body className="p-0">
//                                                         <div className="table-responsive">
//                                                             <Table striped bordered hover className="mb-0">
//                                                                 <thead className="table-dark">
//                                                                     <tr>
//                                                                         <th style={{ width: '5%' }}>#</th>
//                                                                         <th style={{ width: '15%' }}>District Name</th>
//                                                                         <th style={{ width: '20%' }}>Center Name</th>
//                                                                         <th style={{ width: '20%' }}>User Name</th>
//                                                                         <th style={{ width: '10%' }}>Connected</th>
//                                                                         <th style={{ width: '10%' }}>Not Connected</th>
//                                                                         <th style={{ width: '10%' }}>Wrong Number</th>
//                                                                         <th style={{ width: '10%' }}>Pending</th>
//                                                                         <th style={{ width: '10%' }}>Total Alloted</th>
//                                                                         <th style={{ width: '10%' }}>Total Completed</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {userWiseData.map((user) => (
//                                                                         <tr key={user.userId}>
//                                                                             <td className="text-center fw-bold">{user.slNo}</td>
//                                                                             <td>{user.districtName}</td>
//                                                                             <td>{user.centerName}</td>
//                                                                             <td>{user.userName}</td>
//                                                                             <td className="text-center">
//                                                                                 <Badge bg="success">
//                                                                                     {user.connected}
//                                                                                 </Badge>
//                                                                             </td>
//                                                                             <td className="text-center">
//                                                                                 <Badge bg="warning">
//                                                                                     {user.notConnected}
//                                                                                 </Badge>
//                                                                             </td>
//                                                                             <td className="text-center">
//                                                                                 <Badge bg="danger">
//                                                                                     {user.wrongNumber}
//                                                                                 </Badge>
//                                                                             </td>
//                                                                             <td className="text-center">
//                                                                                 <Badge bg="secondary">
//                                                                                     {user.pending}
//                                                                                 </Badge>
//                                                                             </td>
//                                                                             <td className="text-center fw-bold">
//                                                                                 {user.totalAlloted}
//                                                                             </td>
//                                                                             <td className="text-center fw-bold text-success">
//                                                                                 {user.totalCompleted}
//                                                                             </td>
//                                                                         </tr>
//                                                                     ))}
//                                                                 </tbody>
//                                                                 <tfoot className="table-secondary">
//                                                                     <tr>
//                                                                         <td colSpan="4" className="text-end fw-bold">Total:</td>
//                                                                         <td className="text-center fw-bold">
//                                                                             {userWiseData.reduce((sum, user) => sum + user.connected, 0)}
//                                                                         </td>
//                                                                         <td className="text-center fw-bold">
//                                                                             {userWiseData.reduce((sum, user) => sum + user.notConnected, 0)}
//                                                                         </td>
//                                                                         <td className="text-center fw-bold">
//                                                                             {userWiseData.reduce((sum, user) => sum + user.wrongNumber, 0)}
//                                                                         </td>
//                                                                         <td className="text-center fw-bold">
//                                                                             {userWiseData.reduce((sum, user) => sum + user.pending, 0)}
//                                                                         </td>
//                                                                         <td className="text-center fw-bold">
//                                                                             {userWiseData.reduce((sum, user) => sum + user.totalAlloted, 0)}
//                                                                         </td>
//                                                                         <td className="text-center fw-bold">
//                                                                             {userWiseData.reduce((sum, user) => sum + user.totalCompleted, 0)}
//                                                                         </td>
//                                                                     </tr>
//                                                                 </tfoot>
//                                                             </Table>
//                                                         </div>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                         </Row>

//                                         {/* Summary Cards */}
//                                         <Row className="mt-3">
//                                             <Col md={3}>
//                                                 <Card className="bg-info text-white text-center">
//                                                     <Card.Body>
//                                                         <h3>{userWiseData.length}</h3>
//                                                         <div>Total Users</div>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <Card className="bg-success text-white text-center">
//                                                     <Card.Body>
//                                                         <h3>{userWiseData.reduce((sum, user) => sum + user.connected, 0)}</h3>
//                                                         <div>Total Connected</div>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <Card className="bg-warning text-white text-center">
//                                                     <Card.Body>
//                                                         <h3>{userWiseData.reduce((sum, user) => sum + user.notConnected, 0)}</h3>
//                                                         <div>Total Not Connected</div>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <Card className="bg-danger text-white text-center">
//                                                     <Card.Body>
//                                                         <h3>{userWiseData.reduce((sum, user) => sum + user.wrongNumber, 0)}</h3>
//                                                         <div>Total Wrong Numbers</div>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                         </Row>
//                                     </>
//                                 )}

//                                 {/* No Data Message */}
//                                 {submitting === false && userWiseData.length === 0 && dashboardData.length === 0 && !error && selectedObjective && (
//                                     <Alert variant="info" className="text-center">
//                                         <strong>No data available.</strong> Please select an objective and click "Generate Dashboard".
//                                     </Alert>
//                                 )}

//                                 {/* Loading State */}
//                                 {submitting && (
//                                     <div className="text-center py-5">
//                                         <Spinner animation="border" variant="primary" />
//                                         <p className="mt-3">Loading dashboard data...</p>
//                                     </div>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     );
// };









// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Spinner, Button, Badge, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

//importing services
import { getObjectiveOfCall, callilngDashboardOfAllUsers } from "../service/CallingServices/Calling.services.js";

export const CallingDashboardOfAllUsers = () => {
    const navigate = useNavigate();
    
    // State variables
    const [objectiveOptions, setObjectiveOptions] = useState([]);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState([]);
    const [userWiseData, setUserWiseData] = useState([]);
    const [filteredUserWiseData, setFilteredUserWiseData] = useState([]);
    const [userNameFilter, setUserNameFilter] = useState("");
    const [remarkSummary, setRemarkSummary] = useState([]);
    const [showRemarkSummary, setShowRemarkSummary] = useState(false);

    // Fetch objective of callings
    const fetchObjectiveOfCallings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getObjectiveOfCall();
            console.log("Fetched objectives:", response.data.data);
            
            // Transform data for react-select options
            const options = response.data.data.map(item => ({
                value: item._id,
                label: item.objectiveOfCalling,
                originalData: item
            }));
            
            setObjectiveOptions(options);
        } catch (error) {
            console.log("Error occurred:", error.message);
            setError("Failed to fetch objective of callings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Process remark summary from dashboard data
    const processRemarkSummary = (data) => {
        const remarkMap = new Map();
        
        data.forEach(record => {
            const remark = record.remark || "Blank Remark";
            const remarkText = remark === "" ? "Blank Remark" : remark;
            
            if (!remarkMap.has(remarkText)) {
                remarkMap.set(remarkText, {
                    remark: remarkText,
                    count: 0,
                    originalRemark: remark
                });
            }
            
            remarkMap.get(remarkText).count++;
        });
        
        const result = Array.from(remarkMap.values()).sort((a, b) => b.count - a.count);
        return result;
    };

    // Process dashboard data to get user-wise counts
    const processDashboardData = (data) => {
        const userMap = new Map();

        data.forEach(record => {
            const userId = record.assignedTo;
            const userName = record.userDetails?.[0]?.name || "Unknown User";
            const districtName = record.district || "N/A";
            const centerName = record.schoolDetails?.[0]?.centerName || "N/A";
            const callingStatus = record.callingStatus || "PENDING";

            if (!userMap.has(userId)) {
                userMap.set(userId, {
                    userId: userId,
                    userName: userName,
                    districtName: districtName,
                    centerName: centerName,
                    totalAlloted: 0,
                    connected: 0,
                    notConnected: 0,
                    wrongNumber: 0,
                    pending: 0,
                    totalCompleted: 0
                });
            }

            const userData = userMap.get(userId);
            userData.totalAlloted++;

            // Count different statuses
            if (callingStatus === "CONNECTED") {
                userData.connected++;
                userData.totalCompleted++; // Only connected calls count in completed
            } else if (callingStatus === "NOT_CONNECTED") {
                userData.notConnected++;
            } else if (callingStatus === "Wrong Number") {
                userData.wrongNumber++;
            } else if (callingStatus === "PENDING" || !callingStatus || callingStatus === "") {
                userData.pending++;
            } else {
                // Any other status - treat as pending
                userData.pending++;
            }
        });

        // Convert map to array and add serial numbers
        const result = Array.from(userMap.values()).map((item, index) => ({
            slNo: index + 1,
            ...item
        }));

        return result;
    };

    // Handle objective selection
    const handleObjectiveChange = (selectedOption) => {
        setSelectedObjective(selectedOption);
        setDashboardData([]);
        setUserWiseData([]);
        setFilteredUserWiseData([]);
        setError(null);
        setUserNameFilter("");
        setRemarkSummary([]);
        setShowRemarkSummary(false);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!selectedObjective) {
            setError("Please select an objective of calling before submitting.");
            return;
        }

        setSubmitting(true);
        setError(null);
        
        const reqBody = {
            objectiveOfCallId: selectedObjective.value
        };
        
        try {
            const response = await callilngDashboardOfAllUsers(reqBody);
            console.log("Dashboard API Response:", response.data);
            
            const fetchedData = response.data.data || [];
            setDashboardData(fetchedData);
            
            // Process data for user-wise dashboard
            const processedData = processDashboardData(fetchedData);
            setUserWiseData(processedData);
            setFilteredUserWiseData(processedData);
            
            // Process remark summary
            const remarks = processRemarkSummary(fetchedData);
            setRemarkSummary(remarks);
            
            console.log("Processed User-wise Data:", processedData);
            console.log("Remark Summary:", remarks);
        } catch (error) {
            console.log("Error occurred:", error.message);
            setError("Failed to fetch dashboard data. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter data by user name
    const handleUserNameFilter = (e) => {
        const filterValue = e.target.value.toLowerCase();
        setUserNameFilter(filterValue);
        
        if (filterValue === "") {
            setFilteredUserWiseData(userWiseData);
        } else {
            const filtered = userWiseData.filter(user => 
                user.userName.toLowerCase().includes(filterValue)
            );
            setFilteredUserWiseData(filtered);
        }
    };

    // Download PDF report
    const downloadPDF = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text("Calling Dashboard Report", 14, 20);
        
        // Add objective info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Objective: ${selectedObjective?.label || "N/A"}`, 14, 30);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);
        
        // Add remark summary section
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text("Remark Summary", 14, 48);
        
        // Create remark summary table
        const remarkTableData = remarkSummary.map(remark => [
            remark.remark,
            remark.count
        ]);
        
        doc.autoTable({
            startY: 52,
            head: [['Remark', 'Count']],
            body: remarkTableData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            margin: { left: 14, right: 14 },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 30, halign: 'center' }
            }
        });
        
        // Add user-wise dashboard section
        let finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text("User-wise Dashboard", 14, finalY);
        
        // Create user-wise table data
        const tableData = filteredUserWiseData.map(user => [
            user.slNo,
            user.districtName,
            user.centerName,
            user.userName,
            user.connected,
            user.notConnected,
            user.wrongNumber,
            user.pending,
            user.totalAlloted,
            user.totalCompleted
        ]);
        
        // Add summary row
        const summaryRow = [
            "",
            "",
            "",
            "TOTAL:",
            filteredUserWiseData.reduce((sum, user) => sum + user.connected, 0),
            filteredUserWiseData.reduce((sum, user) => sum + user.notConnected, 0),
            filteredUserWiseData.reduce((sum, user) => sum + user.wrongNumber, 0),
            filteredUserWiseData.reduce((sum, user) => sum + user.pending, 0),
            filteredUserWiseData.reduce((sum, user) => sum + user.totalAlloted, 0),
            filteredUserWiseData.reduce((sum, user) => sum + user.totalCompleted, 0)
        ];
        
        doc.autoTable({
            startY: finalY + 5,
            head: [['#', 'District', 'Center', 'User Name', 'Conn', 'Not Conn', 'Wrong No', 'Pending', 'Total', 'Completed']],
            body: [...tableData, summaryRow],
            theme: 'striped',
            headStyles: { fillColor: [46, 204, 113], textColor: 255, fontStyle: 'bold' },
            footStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: 'bold' },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 8, halign: 'center' },
                1: { cellWidth: 20 },
                2: { cellWidth: 28 },
                3: { cellWidth: 30 },
                4: { cellWidth: 15, halign: 'center' },
                5: { cellWidth: 17, halign: 'center' },
                6: { cellWidth: 17, halign: 'center' },
                7: { cellWidth: 15, halign: 'center' },
                8: { cellWidth: 17, halign: 'center' },
                9: { cellWidth: 19, halign: 'center' }
            }
        });
        
        // Save the PDF
        doc.save(`calling-dashboard-${selectedObjective?.label?.substring(0, 30) || 'report'}.pdf`);
    };

    useEffect(() => {
        fetchObjectiveOfCallings();
    }, []);

    return (
        <>
            <Container fluid className="mt-4">
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">Calling Dashboard - All Users</h4>
                            </Card.Header>
                            <Card.Body>
                                {/* Filter Section */}
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Select Objective of Calling</Form.Label>
                                            <Select
                                                options={objectiveOptions}
                                                value={selectedObjective}
                                                onChange={handleObjectiveChange}
                                                isLoading={loading}
                                                isDisabled={loading || submitting}
                                                placeholder={loading ? "Loading..." : "Select an objective..."}
                                                noOptionsMessage={() => "No objectives found"}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3} className="d-flex align-items-end">
                                        <Button 
                                            variant="primary" 
                                            onClick={handleSubmit}
                                            disabled={!selectedObjective || submitting || loading}
                                            className="w-100"
                                            size="lg"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                    Loading...
                                                </>
                                            ) : (
                                                "Generate Dashboard"
                                            )}
                                        </Button>
                                    </Col>
                                    <Col md={3} className="d-flex align-items-end">
                                        {userWiseData.length > 0 && (
                                            <Button 
                                                variant="success" 
                                                onClick={downloadPDF}
                                                className="w-100"
                                                size="lg"
                                                disabled={filteredUserWiseData.length === 0}
                                            >
                                                📄 Download PDF Report
                                            </Button>
                                        )}
                                    </Col>
                                </Row>

                                {/* Selected Objective Info */}
                                {selectedObjective && (
                                    <Alert variant="info" className="mb-4">
                                        <strong>Selected Objective:</strong> {selectedObjective.label}
                                    </Alert>
                                )}

                                {/* Error Alert */}
                                {error && (
                                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                        <strong>Error:</strong> {error}
                                    </Alert>
                                )}

                                {/* Dashboard Results */}
                                {userWiseData.length > 0 && (
                                    <>
                                        {/* Filter and Summary Toggle Row */}
                                        <Row className="mb-3">
                                            <Col md={4}>
                                                <InputGroup>
                                                    <InputGroup.Text>🔍</InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Filter by user name..."
                                                        value={userNameFilter}
                                                        onChange={handleUserNameFilter}
                                                        style={{ fontSize: '13px' }}
                                                    />
                                                    {userNameFilter && (
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            onClick={() => {
                                                                setUserNameFilter("");
                                                                setFilteredUserWiseData(userWiseData);
                                                            }}
                                                            size="sm"
                                                        >
                                                            ✕
                                                        </Button>
                                                    )}
                                                </InputGroup>
                                            </Col>
                                            <Col md={8} className="text-end">
                                                <Button 
                                                    variant="info" 
                                                    onClick={() => setShowRemarkSummary(!showRemarkSummary)}
                                                    size="sm"
                                                >
                                                    {showRemarkSummary ? "Hide" : "Show"} Remark Summary
                                                </Button>
                                            </Col>
                                        </Row>

                                        {/* Remark Summary Section */}
                                        {showRemarkSummary && remarkSummary.length > 0 && (
                                            <Row className="mb-4">
                                                <Col md={12}>
                                                    <Card className="border-info">
                                                        <Card.Header className="bg-info text-white">
                                                            <h6 className="mb-0 fw-bold">Remark Summary Report</h6>
                                                        </Card.Header>
                                                        <Card.Body className="p-0">
                                                            <div className="table-responsive">
                                                                <Table bordered hover size="sm" className="mb-0" style={{ fontSize: '12px' }}>
                                                                    <thead className="table-info">
                                                                        <tr>
                                                                            <th className="fw-bold">#</th>
                                                                            <th className="fw-bold">Remark</th>
                                                                            <th className="text-center fw-bold">Count</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {remarkSummary.map((remark, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="text-center">{idx + 1}</td>
                                                                                <td>
                                                                                    {remark.remark === "Blank Remark" ? (
                                                                                        <Badge bg="secondary">Blank Remark</Badge>
                                                                                    ) : (
                                                                                        <span className="fw-bold">{remark.remark}</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="text-center fw-bold">{remark.count}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot className="table-secondary">
                                                                        <tr>
                                                                            <td colSpan="2" className="text-end fw-bold">Total Records:</td>
                                                                            <td className="text-center fw-bold">{dashboardData.length}</td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </Table>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        )}

                                        {/* User-wise Dashboard Table */}
                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Card className="shadow-sm">
                                                    <Card.Header className="bg-success text-white">
                                                        <h5 className="mb-0">
                                                            <strong>User-wise Dashboard Report</strong>
                                                            <Badge bg="light" text="dark" className="ms-3">
                                                                Total Users: {filteredUserWiseData.length}
                                                            </Badge>
                                                            <Badge bg="light" text="dark" className="ms-2">
                                                                Total Calls: {filteredUserWiseData.reduce((sum, user) => sum + user.totalAlloted, 0)}
                                                            </Badge>
                                                            {userNameFilter && (
                                                                <Badge bg="warning" text="dark" className="ms-2">
                                                                    Filtered: {userNameFilter}
                                                                </Badge>
                                                            )}
                                                        </h5>
                                                    </Card.Header>
                                                    <Card.Body className="p-0">
                                                        <div className="table-responsive">
                                                            <Table striped bordered hover className="mb-0" style={{ fontSize: '12px' }}>
                                                                <thead className="table-dark">
                                                                    <tr>
                                                                        <th className="fw-bold" style={{ width: '5%' }}>#</th>
                                                                        <th className="fw-bold" style={{ width: '15%' }}>District Name</th>
                                                                        <th className="fw-bold" style={{ width: '20%' }}>Center Name</th>
                                                                        <th className="fw-bold" style={{ width: '20%' }}>User Name</th>
                                                                        <th className="fw-bold" style={{ width: '8%' }}>Connected</th>
                                                                        <th className="fw-bold" style={{ width: '8%' }}>Not Connected</th>
                                                                        <th className="fw-bold" style={{ width: '8%' }}>Wrong Number</th>
                                                                        <th className="fw-bold" style={{ width: '8%' }}>Pending</th>
                                                                        <th className="fw-bold" style={{ width: '8%' }}>Total Alloted</th>
                                                                        <th className="fw-bold" style={{ width: '8%' }}>Completed</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {filteredUserWiseData.length > 0 ? (
                                                                        filteredUserWiseData.map((user) => (
                                                                            <tr key={user.userId}>
                                                                                <td className="text-center fw-bold">{user.slNo}</td>
                                                                                <td className="fw-bold">{user.districtName}</td>
                                                                                <td className="fw-bold">{user.centerName}</td>
                                                                                <td className="fw-bold">{user.userName}</td>
                                                                                <td className="text-center fw-bold text-success">{user.connected}</td>
                                                                                <td className="text-center fw-bold text-warning">{user.notConnected}</td>
                                                                                <td className="text-center fw-bold text-danger">{user.wrongNumber}</td>
                                                                                <td className="text-center fw-bold text-secondary">{user.pending}</td>
                                                                                <td className="text-center fw-bold">{user.totalAlloted}</td>
                                                                                <td className="text-center fw-bold text-success">{user.totalCompleted}</td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="10" className="text-center text-danger fw-bold">
                                                                                No users found matching the filter criteria
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                                <tfoot className="table-secondary">
                                                                    <tr>
                                                                        <td colSpan="4" className="text-end fw-bold">Total:</td>
                                                                        <td className="text-center fw-bold">
                                                                            {filteredUserWiseData.reduce((sum, user) => sum + user.connected, 0)}
                                                                        </td>
                                                                        <td className="text-center fw-bold">
                                                                            {filteredUserWiseData.reduce((sum, user) => sum + user.notConnected, 0)}
                                                                        </td>
                                                                        <td className="text-center fw-bold">
                                                                            {filteredUserWiseData.reduce((sum, user) => sum + user.wrongNumber, 0)}
                                                                        </td>
                                                                        <td className="text-center fw-bold">
                                                                            {filteredUserWiseData.reduce((sum, user) => sum + user.pending, 0)}
                                                                        </td>
                                                                        <td className="text-center fw-bold">
                                                                            {filteredUserWiseData.reduce((sum, user) => sum + user.totalAlloted, 0)}
                                                                        </td>
                                                                        <td className="text-center fw-bold">
                                                                            {filteredUserWiseData.reduce((sum, user) => sum + user.totalCompleted, 0)}
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>
                                                            </Table>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>

                                        {/* Summary Cards */}
                                        <Row className="mt-3">
                                            <Col md={2}>
                                                <Card className="bg-info text-white text-center">
                                                    <Card.Body>
                                                        <h4 className="fw-bold">{filteredUserWiseData.length}</h4>
                                                        <div className="fw-bold">Total Users</div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={2}>
                                                <Card className="bg-success text-white text-center">
                                                    <Card.Body>
                                                        <h4 className="fw-bold">{filteredUserWiseData.reduce((sum, user) => sum + user.connected, 0)}</h4>
                                                        <div className="fw-bold">Connected</div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={2}>
                                                <Card className="bg-warning text-white text-center">
                                                    <Card.Body>
                                                        <h4 className="fw-bold">{filteredUserWiseData.reduce((sum, user) => sum + user.notConnected, 0)}</h4>
                                                        <div className="fw-bold">Not Connected</div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={2}>
                                                <Card className="bg-danger text-white text-center">
                                                    <Card.Body>
                                                        <h4 className="fw-bold">{filteredUserWiseData.reduce((sum, user) => sum + user.wrongNumber, 0)}</h4>
                                                        <div className="fw-bold">Wrong Number</div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={2}>
                                                <Card className="bg-secondary text-white text-center">
                                                    <Card.Body>
                                                        <h4 className="fw-bold">{filteredUserWiseData.reduce((sum, user) => sum + user.pending, 0)}</h4>
                                                        <div className="fw-bold">Pending</div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={2}>
                                                <Card className="bg-primary text-white text-center">
                                                    <Card.Body>
                                                        <h4 className="fw-bold">{filteredUserWiseData.reduce((sum, user) => sum + user.totalCompleted, 0)}</h4>
                                                        <div className="fw-bold">Total Completed</div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                {/* No Data Message */}
                                {submitting === false && userWiseData.length === 0 && dashboardData.length === 0 && !error && selectedObjective && (
                                    <Alert variant="info" className="text-center">
                                        <strong>No data available.</strong> Please select an objective and click "Generate Dashboard".
                                    </Alert>
                                )}

                                {/* Loading State */}
                                {submitting && (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3">Loading dashboard data...</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};