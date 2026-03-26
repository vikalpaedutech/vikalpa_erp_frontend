
// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb  } from 'react-bootstrap';


// import { createCallings, createObjectiveOfCalling, getCallingsByAssignedTo, updateCalling, getObjectiveOfCall,  callingDashboardByUserId} from "../service/CallingServices/Calling.services.js";

// import { DistrictBlockSchoolById, ClassOfStudent  } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";


// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

// import Select from 'react-select'
// import { formToJSON } from "axios";
// import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
// import { UserContext } from "../components/contextAPIs/User.context.js";






// export const CallingDashboardByUserId =  () =>{


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



















// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Badge, Spinner, Button } from 'react-bootstrap';
// import { createCallings, createObjectiveOfCalling, getCallingsByAssignedTo, updateCalling, getObjectiveOfCall, callingDashboardByUserId } from "../service/CallingServices/Calling.services.js";
// import { DistrictBlockSchoolById, ClassOfStudent } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";

// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext, SchoolContext, ClassContext } from "../components/contextAPIs/DependentDropdowns.contextAPI.js";
// import Select from 'react-select';
// import { formToJSON } from "axios";
// import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
// import { UserContext } from "../components/contextAPIs/User.context.js";

// export const CallingDashboardByUserId = () => {
//     // Accessing context
//     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//     const { blockContext, setBlockContext } = useContext(BlockContext);
//     const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//     const { classContext, setClassContext } = useContext(ClassContext);
//     const { userData, setUserData } = useContext(UserContext);

//     // State variables
//     const [dashboardData, setDashboardData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedObjective, setSelectedObjective] = useState(null);
//     const [objectiveOptions, setObjectiveOptions] = useState([]);

//     // Fetch dashboard data on component mount
//     useEffect(() => {
//         if (userData?._id) {
//             fetchDashboardData();
//         }
//     }, [userData]);

//     // Fetch dashboard data function
//     const fetchDashboardData = async () => {
//         if (!userData?._id) {
//             setError("User data not available");
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const reqBody = {
//                 assignedTo: userData._id
//             };
            
//             const response = await callingDashboardByUserId(reqBody);
//             console.log("Dashboard response:", response.data);
            
//             if (response.data.success) {
//                 setDashboardData(response.data.data);
                
//                 // Create objective options for filter
//                 const options = response.data.data.objectives.map(obj => ({
//                     value: obj.objectiveId,
//                     label: obj.objectiveOfCalling,
//                     description: obj.descriptionOfCalling
//                 }));
//                 setObjectiveOptions(options);
//             } else {
//                 setError(response.data.message || "Failed to fetch dashboard data");
//             }
//         } catch (error) {
//             console.error("Error fetching dashboard:", error);
//             setError(error.message || "Failed to fetch dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle objective filter change
//     const handleObjectiveFilter = (selected) => {
//         setSelectedObjective(selected);
//     };

//     // Get filtered objectives
//     const getFilteredObjectives = () => {
//         if (!dashboardData?.objectives) return [];
        
//         if (selectedObjective) {
//             return dashboardData.objectives.filter(
//                 obj => obj.objectiveId === selectedObjective.value
//             );
//         }
//         return dashboardData.objectives;
//     };

//     // Get status badge color
//     const getStatusBadgeColor = (status) => {
//         switch(status) {
//             case 'Connected':
//                 return 'success';
//             case 'NotConnected':
//                 return 'danger';
//             case 'Pending':
//                 return 'warning';
//             case 'WrongNumber':
//                 return 'secondary';
//             default:
//                 return 'info';
//         }
//     };

//     // Get status icon
//     const getStatusIcon = (status) => {
//         switch(status) {
//             case 'Connected':
//                 return '✅';
//             case 'NotConnected':
//                 return '❌';
//             case 'Pending':
//                 return '⏳';
//             case 'WrongNumber':
//                 return '📵';
//             default:
//                 return '📞';
//         }
//     };

//     // Calculate completion percentage
//     const getCompletionPercentage = (objective) => {
//         const total = objective.totalCalls;
//         if (total === 0) return 0;
//         const completed = objective.statusBreakdown.Connected + 
//                          objective.statusBreakdown.NotConnected + 
//                          objective.statusBreakdown.WrongNumber;
//         return Math.round((completed / total) * 100);
//     };

//     // Render statistics cards
//     const renderStatisticsCards = () => {
//         if (!dashboardData?.overallStats) return null;

//         const stats = dashboardData.overallStats;
        
//         return (
//             <Row className="mb-4">
             
              
              
//                 <Col md={3}>
//                     <Card className="text-center shadow-sm border-warning">
                     
//                     </Card>
//                 </Col>
//             </Row>
//         );
//     };

//     // Render status summary cards
//     const renderStatusSummaryCards = () => {
//         if (!dashboardData?.overallStats) return null;

//         const stats = dashboardData.overallStats;
        
//         const statusCards = [
          
//         ];

//         return (
//             <Row className="mb-4">
//                 {statusCards.map((card, index) => (
//                     <Col md={3} key={index}>
//                         <Card className={`text-center shadow-sm border-${card.color}`}>
//                             <Card.Body>
//                                 <h5 className="mb-2">{card.icon} {card.label}</h5>
//                                 <h3 className={`mb-0 text-${card.color}`}>{card.value}</h3>
//                                 <small className="text-muted">
//                                     {stats.totalCalls > 0 
//                                         ? `${Math.round((card.value / stats.totalCalls) * 100)}%` 
//                                         : '0%'}
//                                 </small>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>
//         );
//     };

//     // Render objective table
//     const renderObjectivesTable = () => {
//         const filteredObjectives = getFilteredObjectives();
        
//         if (filteredObjectives.length === 0) {
//             return (
//                 <Alert variant="info" className="text-center">
//                     No objectives found{selectedObjective ? ' for the selected filter' : ''}
//                 </Alert>
//             );
//         }

//         return (
//             <div className="table-responsive">
//                 <Table striped bordered hover className="shadow-sm">
//                     <thead className="bg-light">
//                         <tr>
//                             <th style={{ width: '5%' }}>#</th>
//                             <th style={{ width: '20%' }}>Objective of Calling</th>
//                             <th style={{ width: '25%' }}>Description</th>
//                             <th style={{ width: '10%' }}>Total Calls</th>
//                             <th style={{ width: '10%' }}>Connected</th>
//                             <th style={{ width: '10%' }}>Not Connected</th>
//                             <th style={{ width: '10%' }}>Pending</th>
//                             <th style={{ width: '10%' }}>Wrong Number</th>
//                             <th style={{ width: '10%' }}>Completion</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredObjectives.map((objective, index) => (
//                             <tr key={objective.objectiveId}>
//                                 <td>{index + 1}</td>
//                                 <td>
//                                     <strong>{objective.objectiveOfCalling}</strong>
                                    
//                                 </td>
//                                 <td>
//                                     <small className="text-muted">
//                                         {objective.descriptionOfCalling || 'No description available'}
//                                     </small>
//                                 </td>
//                                 <td className="text-center">
//                                     <Badge bg="primary" pill>
//                                         {objective.totalCalls}
//                                     </Badge>
//                                 </td>
//                                 <td className="text-center">
//                                     <Badge bg="success" pill>
//                                         {getStatusIcon('Connected')} {objective.statusBreakdown.Connected}
//                                     </Badge>
//                                 </td>
//                                 <td className="text-center">
//                                     <Badge bg="danger" pill>
//                                         {getStatusIcon('NotConnected')} {objective.statusBreakdown.NotConnected}
//                                     </Badge>
//                                 </td>
//                                 <td className="text-center">
//                                     <Badge bg="warning" pill>
//                                         {getStatusIcon('Pending')} {objective.statusBreakdown.Pending}
//                                     </Badge>
//                                 </td>
//                                 <td className="text-center">
//                                     <Badge bg="secondary" pill>
//                                         {getStatusIcon('WrongNumber')} {objective.statusBreakdown.WrongNumber}
//                                     </Badge>
//                                 </td>
//                                 <td className="text-center">
//                                     <div className="progress" style={{ height: '20px' }}>
//                                         <div
//                                             className={`progress-bar bg-${getCompletionPercentage(objective) === 100 ? 'success' : 'info'}`}
//                                             role="progressbar"
//                                             style={{ width: `${getCompletionPercentage(objective)}%` }}
//                                             aria-valuenow={getCompletionPercentage(objective)}
//                                             aria-valuemin="0"
//                                             aria-valuemax="100"
//                                         >
//                                             {getCompletionPercentage(objective)}%
//                                         </div>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </div>
//         );
//     };

//     // Render detailed cards view (alternative to table)
//     const renderDetailedCards = () => {
//         const filteredObjectives = getFilteredObjectives();
        
//         if (filteredObjectives.length === 0) {
//             return (
//                 <Alert variant="info" className="text-center">
//                     No objectives found{selectedObjective ? ' for the selected filter' : ''}
//                 </Alert>
//             );
//         }

//         return (
//             <Row>
//                 {filteredObjectives.map((objective) => (
//                     <Col md={6} lg={4} key={objective.objectiveId} className="mb-4">
//                         <Card className="h-100 shadow-sm">
//                             <Card.Header className={`bg-${objective.totalCalls > 0 ? 'primary' : 'secondary'} text-white`}>
//                                 <h6 className="mb-0">{objective.objectiveOfCalling}</h6>
//                             </Card.Header>
//                             <Card.Body>
//                                 <div className="mb-3">
//                                     <small className="text-muted">Description:</small>
//                                     <p className="mb-0 small">{objective.descriptionOfCalling || 'No description available'}</p>
//                                 </div>
                                
//                                 <div className="mb-3">
//                                     <strong>Total Calls:</strong>
//                                     <h3 className="text-center text-primary">{objective.totalCalls}</h3>
//                                 </div>
                                
//                                 <div className="row g-2 mb-3">
//                                     <div className="col-6">
//                                         <div className="border rounded p-2 text-center">
//                                             <div className="text-success">✅ Connected</div>
//                                             <strong>{objective.statusBreakdown.Connected}</strong>
//                                         </div>
//                                     </div>
//                                     <div className="col-6">
//                                         <div className="border rounded p-2 text-center">
//                                             <div className="text-danger">❌ Not Connected</div>
//                                             <strong>{objective.statusBreakdown.NotConnected}</strong>
//                                         </div>
//                                     </div>
//                                     <div className="col-6">
//                                         <div className="border rounded p-2 text-center">
//                                             <div className="text-warning">⏳ Pending</div>
//                                             <strong>{objective.statusBreakdown.Pending}</strong>
//                                         </div>
//                                     </div>
//                                     <div className="col-6">
//                                         <div className="border rounded p-2 text-center">
//                                             <div className="text-secondary">📵 Wrong Number</div>
//                                             <strong>{objective.statusBreakdown.WrongNumber}</strong>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="mt-2">
//                                     <small className="text-muted">Completion Rate:</small>
//                                     <div className="progress" style={{ height: '25px' }}>
//                                         <div
//                                             className={`progress-bar bg-${getCompletionPercentage(objective) === 100 ? 'success' : 'info'}`}
//                                             role="progressbar"
//                                             style={{ width: `${getCompletionPercentage(objective)}%` }}
//                                         >
//                                             {getCompletionPercentage(objective)}%
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>
//         );
//     };

//     // Render loading state
//     if (loading && !dashboardData) {
//         return (
//             <Container fluid className="mt-5 text-center">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-3">Loading dashboard data...</p>
//             </Container>
//         );
//     }

//     // Render error state
//     if (error) {
//         return (
//             <Container fluid className="mt-4">
//                 <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                     <Alert.Heading>Error Loading Dashboard</Alert.Heading>
//                     <p>{error}</p>
//                 </Alert>
//                 <Button variant="primary" onClick={fetchDashboardData}>
//                     Retry
//                 </Button>
//             </Container>
//         );
//     }

//     return (
//         <>
//             <Container fluid className="mt-4">
             

//                 {/* Statistics Cards */}
//                 {dashboardData && renderStatisticsCards()}

//                 {/* Status Summary Cards */}
//                 {dashboardData && renderStatusSummaryCards()}

//                 {/* Filters */}
//                 {dashboardData && dashboardData.objectives.length > 0 && (
//                     <Row className="mb-4">
//                         <Col md={4}>
//                             <Form.Group>
//                                 <Form.Label>Filter by Objective</Form.Label>
//                                 <Select
//                                     options={objectiveOptions}
//                                     value={selectedObjective}
//                                     onChange={handleObjectiveFilter}
//                                     placeholder="All Objectives"
//                                     isClearable={true}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={8}>
//                             <div className="mt-4">
//                                 <Button 
//                                     variant="outline-primary" 
//                                     onClick={fetchDashboardData}
//                                     disabled={loading}
//                                 >
//                                     {loading ? <Spinner as="span" size="sm" animation="border" /> : 'Refresh'}
//                                 </Button>
                            
//                             </div>
//                         </Col>
//                     </Row>
//                 )}

//                 {/* Objectives Table */}
//                 <Row className="mt-3">
//                     <Col>
//                         <h5 className="mb-3">Calling Details by Objective</h5>
//                         {renderObjectivesTable()}
//                     </Col>
//                 </Row>

//                 {/* Alternative: Detailed Cards View (Uncomment if you prefer cards) */}
//                 {/* <Row className="mt-3">
//                     <Col>
//                         <h5 className="mb-3">Detailed View</h5>
//                         {renderDetailedCards()}
//                     </Col>
//                 </Row> */}

//                 {/* Summary Footer */}
               
//             </Container>
//         </>
//     );
// };



// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Badge, Spinner, Button } from 'react-bootstrap';
// import { createCallings, createObjectiveOfCalling, getCallingsByAssignedTo, updateCalling, getObjectiveOfCall, callingDashboardByUserId } from "../service/CallingServices/Calling.services.js";
// import { DistrictBlockSchoolById, ClassOfStudent } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";

// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext, SchoolContext, ClassContext } from "../components/contextAPIs/DependentDropdowns.contextAPI.js";
// import Select from 'react-select';
// import { formToJSON } from "axios";
// import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
// import { UserContext } from "../components/contextAPIs/User.context.js";

// export const CallingDashboardByUserId = () => {
//     // Accessing context
//     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//     const { blockContext, setBlockContext } = useContext(BlockContext);
//     const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//     const { classContext, setClassContext } = useContext(ClassContext);
//     const { userData, setUserData } = useContext(UserContext);

//     // State variables
//     const [dashboardData, setDashboardData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedObjective, setSelectedObjective] = useState(null);
//     const [objectiveOptions, setObjectiveOptions] = useState([]);

//     // Fetch dashboard data on component mount
//     useEffect(() => {
//         if (userData?._id) {
//             fetchDashboardData();
//         }
//     }, [userData]);

//     // Fetch dashboard data function
//     const fetchDashboardData = async () => {
//         if (!userData?._id) {
//             setError("User data not available");
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const reqBody = {
//                 assignedTo: userData._id
//             };
            
//             const response = await callingDashboardByUserId(reqBody);
//             console.log("Dashboard response:", response.data);
            
//             if (response.data.success) {
//                 setDashboardData(response.data.data);
                
//                 // Create objective options for filter
//                 const options = response.data.data.objectives.map(obj => ({
//                     value: obj.objectiveId,
//                     label: obj.objectiveOfCalling,
//                     description: obj.descriptionOfCalling
//                 }));
//                 setObjectiveOptions(options);
//             } else {
//                 setError(response.data.message || "Failed to fetch dashboard data");
//             }
//         } catch (error) {
//             console.error("Error fetching dashboard:", error);
//             setError(error.message || "Failed to fetch dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle objective filter change
//     const handleObjectiveFilter = (selected) => {
//         setSelectedObjective(selected);
//     };

//     // Get filtered objectives
//     const getFilteredObjectives = () => {
//         if (!dashboardData?.objectives) return [];
        
//         if (selectedObjective) {
//             return dashboardData.objectives.filter(
//                 obj => obj.objectiveId === selectedObjective.value
//             );
//         }
//         return dashboardData.objectives;
//     };

//     // Calculate total attempts (excluding pending)
//     const getTotalAttempts = (objective) => {
//         return objective.statusBreakdown.Connected + 
//                objective.statusBreakdown.NotConnected + 
//                objective.statusBreakdown.WrongNumber;
//     };

//     // Check if objective is 100% complete (all calls are completed, no pending)
//     const isComplete = (objective) => {
//         return objective.totalCalls > 0 && objective.statusBreakdown.Pending === 0;
//     };

//     // Handle start calling button click
//     const handleStartCalling = (objectiveId, objectiveName) => {
//         alert(`Starting calling for: ${objectiveName}\nObjective ID: ${objectiveId}\n\nYou can now proceed with making calls for this objective.`);
//         // You can add navigation logic here later
//         // For example: navigate to calling page with objectiveId


        
//     };

//     // Render objective table
//     const renderObjectivesTable = () => {
//         const filteredObjectives = getFilteredObjectives();
        
//         if (filteredObjectives.length === 0) {
//             return (
//                 <Alert variant="info" className="text-center">
//                     No objectives found{selectedObjective ? ' for the selected filter' : ''}
//                 </Alert>
//             );
//         }

//         return (
//             <div className="table-responsive">
//                 <Table striped bordered hover className="shadow-sm">
//                     <thead className="bg-light">
//                         <tr>
//                             <th style={{ width: '5%' }}>#</th>
//                             <th style={{ width: '20%' }}>Objective of Calling</th>
//                             <th style={{ width: '25%' }}>Description</th>
//                             <th style={{ width: '8%' }}>Total Calls</th>
//                             <th style={{ width: '8%' }}>Connected</th>
//                             <th style={{ width: '8%' }}>Not Connected</th>
//                             <th style={{ width: '8%' }}>Pending</th>
//                             <th style={{ width: '8%' }}>Wrong Number</th>
//                             <th style={{ width: '8%' }}>Attempts</th>
//                             <th style={{ width: '10%' }}>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredObjectives.map((objective, index) => {
//                             const totalAttempts = getTotalAttempts(objective);
//                             const complete = isComplete(objective);
                            
//                             return (
//                                 <tr key={objective.objectiveId} style={complete ? { backgroundColor: '#d4edda' } : {}}>
//                                     <td>{index + 1}</td>
//                                     <td>
//                                         <strong>{objective.objectiveOfCalling}</strong>
//                                     </td>
//                                     <td>
//                                         <small className="text-muted">
//                                             {objective.descriptionOfCalling || 'No description available'}
//                                         </small>
//                                     </td>
//                                     <td className="text-center">
//                                         {objective.totalCalls}
//                                     </td>
//                                     <td className="text-center">
//                                         {objective.statusBreakdown.Connected}
//                                     </td>
//                                     <td className="text-center">
//                                         {objective.statusBreakdown.NotConnected}
//                                     </td>
//                                     <td className="text-center">
//                                         {objective.statusBreakdown.Pending}
//                                     </td>
//                                     <td className="text-center">
//                                         {objective.statusBreakdown.WrongNumber}
//                                     </td>
//                                     <td className="text-center">
//                                         <strong>{totalAttempts}</strong> / {objective.totalCalls}
//                                     </td>
//                                     <td className="text-center">
//                                         <Button 
//                                             variant="primary" 
//                                             size="sm"
//                                             onClick={() => handleStartCalling(objective.objectiveId, objective.objectiveOfCalling)}
//                                         >
//                                             Start Calling
//                                         </Button>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </Table>
//             </div>
//         );
//     };

//     // Render loading state
//     if (loading && !dashboardData) {
//         return (
//             <Container fluid className="mt-5 text-center">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-3">Loading dashboard data...</p>
//             </Container>
//         );
//     }

//     // Render error state
//     if (error) {
//         return (
//             <Container fluid className="mt-4">
//                 <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                     <Alert.Heading>Error Loading Dashboard</Alert.Heading>
//                     <p>{error}</p>
//                 </Alert>
//                 <Button variant="primary" onClick={fetchDashboardData}>
//                     Retry
//                 </Button>
//             </Container>
//         );
//     }

//     return (
//         <>
//             <Container fluid className="mt-4">
//                 <Row>
//                     <Col>
//                         <Breadcrumb>
//                             <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
//                             <Breadcrumb.Item active>Calling Dashboard</Breadcrumb.Item>
//                         </Breadcrumb>
//                         <h4 className="mb-4">Calling Management Dashboard</h4>
//                         <p className="text-muted">
//                             Welcome, <strong>{userData?.name || userData?.userId || 'User'}</strong>! 
//                             Here's your calling performance summary.
//                         </p>
//                     </Col>
//                 </Row>

//                 {/* Filters */}
//                 {dashboardData && dashboardData.objectives.length > 0 && (
//                     <Row className="mb-4">
//                         <Col md={4}>
//                             <Form.Group>
//                                 <Form.Label>Filter by Objective</Form.Label>
//                                 <Select
//                                     options={objectiveOptions}
//                                     value={selectedObjective}
//                                     onChange={handleObjectiveFilter}
//                                     placeholder="All Objectives"
//                                     isClearable={true}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={8}>
//                             <div className="mt-4">
//                                 <Button 
//                                     variant="outline-primary" 
//                                     onClick={fetchDashboardData}
//                                     disabled={loading}
//                                 >
//                                     {loading ? <Spinner as="span" size="sm" animation="border" /> : 'Refresh'}
//                                 </Button>
//                                 <span className="text-muted ms-3">
//                                     Last updated: {dashboardData && new Date(dashboardData.summary.fetchedAt).toLocaleString()}
//                                 </span>
//                             </div>
//                         </Col>
//                     </Row>
//                 )}

//                 {/* Objectives Table */}
//                 <Row className="mt-3">
//                     <Col>
//                         <h5 className="mb-3">Calling Details by Objective</h5>
//                         {renderObjectivesTable()}
//                     </Col>
//                 </Row>

//                 {/* Summary Footer */}
//                 {dashboardData && (
//                     <Row className="mt-4">
//                         <Col>
//                             <Card className="bg-light">
//                                 <Card.Body>
//                                     <Row>
//                                         <Col md={3}>
//                                             <small className="text-muted">Total Objectives</small>
//                                             <p className="mb-0"><strong>{dashboardData.summary.totalObjectives}</strong></p>
//                                         </Col>
//                                         <Col md={3}>
//                                             <small className="text-muted">Objectives with Calls</small>
//                                             <p className="mb-0"><strong>{dashboardData.summary.objectivesWithCalls}</strong></p>
//                                         </Col>
//                                         <Col md={3}>
//                                             <small className="text-muted">Objectives without Calls</small>
//                                             <p className="mb-0"><strong>{dashboardData.summary.objectivesWithoutCalls}</strong></p>
//                                         </Col>
//                                         <Col md={3}>
//                                             <small className="text-muted">Total Calls</small>
//                                             <p className="mb-0"><strong>{dashboardData.overallStats.totalCalls}</strong></p>
//                                         </Col>
//                                     </Row>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                 )}
//             </Container>
//         </>
//     );
// };




























// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Spinner, Button } from 'react-bootstrap';
import { callingDashboardByUserId } from "../service/CallingServices/Calling.services.js";
import { useNavigate } from 'react-router-dom';

//importing context api
import { DistrictBlockSchoolContext, BlockContext, SchoolContext, ClassContext } from "../components/contextAPIs/DependentDropdowns.contextAPI.js";
import Select from 'react-select';
import { UserContext } from "../components/contextAPIs/User.context.js";

export const CallingDashboardByUserId = () => {
    const navigate = useNavigate();
    
    // Accessing context
    const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
    const { blockContext, setBlockContext } = useContext(BlockContext);
    const { schoolContext, setSchoolContext } = useContext(SchoolContext);
    const { classContext, setClassContext } = useContext(ClassContext);
    const { userData, setUserData } = useContext(UserContext);

    // State variables
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [objectiveOptions, setObjectiveOptions] = useState([]);

    // Fetch dashboard data on component mount
    useEffect(() => {
        if (userData?._id) {
            fetchDashboardData();
        }
    }, [userData]);

    // Fetch dashboard data function
    const fetchDashboardData = async () => {
        if (!userData?._id) {
            setError("User data not available");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reqBody = {
                assignedTo: userData._id
            };
            
            const response = await callingDashboardByUserId(reqBody);
            console.log("Dashboard response:", response.data);
            
            if (response.data.success) {
                setDashboardData(response.data.data);
                
                // Create objective options for filter
                const options = response.data.data.objectives.map(obj => ({
                    value: obj.objectiveId,
                    label: obj.objectiveOfCalling,
                    description: obj.descriptionOfCalling
                }));
                setObjectiveOptions(options);
            } else {
                setError(response.data.message || "Failed to fetch dashboard data");
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            setError(error.message || "Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // Handle objective filter change
    const handleObjectiveFilter = (selected) => {
        setSelectedObjective(selected);
    };

    // Get filtered objectives
    const getFilteredObjectives = () => {
        if (!dashboardData?.objectives) return [];
        
        if (selectedObjective) {
            return dashboardData.objectives.filter(
                obj => obj.objectiveId === selectedObjective.value
            );
        }
        return dashboardData.objectives;
    };

    // Calculate total attempts (excluding pending)
    const getTotalAttempts = (objective) => {
        return objective.statusBreakdown.Connected + 
               objective.statusBreakdown.NotConnected + 
               objective.statusBreakdown.WrongNumber;
    };

    // Check if objective is 100% complete (all calls are completed, no pending)
    const isComplete = (objective) => {
        return objective.totalCalls > 0 && objective.statusBreakdown.Pending === 0;
    };

    // Handle start calling button click with navigation
    const handleStartCalling = (objectiveId, objectiveName) => {
        // Navigate to calling page with objectiveId

        // alert(objectiveId)
        navigate(`/calling-main`, {

          state: {
            objectiveId: objectiveId,
            objectiveName:objectiveName
          }
        });
    };

    // Render objective table
    const renderObjectivesTable = () => {
        const filteredObjectives = getFilteredObjectives();
        
        if (filteredObjectives.length === 0) {
            return (
                <Alert variant="info" className="text-center">
                    No objectives found{selectedObjective ? ' for the selected filter' : ''}
                </Alert>
            );
        }

        return (
            <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm">
                    <thead className="bg-light">
                        <tr>
                            <th style={{ width: '5%' }}>#</th>
                            <th style={{ width: '20%' }}>Objective of Calling</th>
                            <th style={{ width: '25%' }}>Description</th>
                            <th style={{ width: '8%' }}>Total Calls</th>
                            <th style={{ width: '8%' }}>Connected</th>
                            <th style={{ width: '8%' }}>Not Connected</th>
                            <th style={{ width: '8%' }}>Pending</th>
                            <th style={{ width: '8%' }}>Wrong Number</th>
                            <th style={{ width: '8%' }}>Attempts</th>
                            <th style={{ width: '10%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredObjectives.map((objective, index) => {
                            const totalAttempts = getTotalAttempts(objective);
                            const complete = isComplete(objective);
                            
                            return (
                                <tr key={objective.objectiveId} style={complete ? { backgroundColor: '#d4edda' } : {}}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{objective.objectiveOfCalling}</strong>
                                    </td>
                                    <td>
                                        <small className="text-muted">
                                            {objective.descriptionOfCalling || 'No description available'}
                                        </small>
                                    </td>
                                    <td className="text-center">
                                        {objective.totalCalls}
                                    </td>
                                    <td className="text-center">
                                        {objective.statusBreakdown.Connected}
                                    </td>
                                    <td className="text-center">
                                        {objective.statusBreakdown.NotConnected}
                                    </td>
                                    <td className="text-center">
                                        {objective.statusBreakdown.Pending}
                                    </td>
                                    <td className="text-center">
                                        {objective.statusBreakdown.WrongNumber}
                                    </td>
                                    <td className="text-center">
                                        <strong>{totalAttempts}</strong> / {objective.totalCalls}
                                    </td>
                                    <td className="text-center">
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => handleStartCalling(objective.objectiveId, objective.objectiveOfCalling)}
                                        >
                                            Start Calling
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    };

    // Render loading state
    if (loading && !dashboardData) {
        return (
            <Container fluid className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading dashboard data...</p>
            </Container>
        );
    }

    // Render error state
    if (error) {
        return (
            <Container fluid className="mt-4">
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <Alert.Heading>Error Loading Dashboard</Alert.Heading>
                    <p>{error}</p>
                </Alert>
                <Button variant="primary" onClick={fetchDashboardData}>
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <>
            <Container fluid className="mt-4">
                <Row>
                    <Col>
                        
                        <h4 className="mb-4">Calling Management Dashboard</h4>
                        {/* <p className="text-muted">
                            Welcome, <strong>{userData?.name || userData?.userId || 'User'}</strong>! 
                            Here's your calling performance summary.
                        </p> */}
                    </Col>
                </Row>

                {/* Filters */}
                {dashboardData && dashboardData.objectives.length > 0 && (
                    <Row className="mb-4">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filter by Objective</Form.Label>
                                <Select
                                    options={objectiveOptions}
                                    value={selectedObjective}
                                    onChange={handleObjectiveFilter}
                                    placeholder="All Objectives"
                                    isClearable={true}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={8}>
                            <div className="mt-4">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={fetchDashboardData}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner as="span" size="sm" animation="border" /> : 'Refresh'}
                                </Button>
                                <span className="text-muted ms-3">
                                    Last updated: {dashboardData && new Date(dashboardData.summary.fetchedAt).toLocaleString()}
                                </span>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Objectives Table */}
                <Row className="mt-3">
                    <Col>
                        <h5 className="mb-3">Calling Details by Objective</h5>
                        {renderObjectivesTable()}
                    </Col>
                </Row>

                {/* Summary Footer */}
                
            </Container>
        </>
    );
};