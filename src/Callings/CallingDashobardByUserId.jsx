
// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Spinner, Button } from 'react-bootstrap';
// import { callingDashboardByUserId } from "../service/CallingServices/Calling.services.js";
// import { useNavigate } from 'react-router-dom';

// //importing context api
// import { DistrictBlockSchoolContext, BlockContext, SchoolContext, ClassContext } from "../components/contextAPIs/DependentDropdowns.contextAPI.js";
// import Select from 'react-select';
// import { UserContext } from "../components/contextAPIs/User.context.js";

// export const CallingDashboardByUserId = () => {
//     const navigate = useNavigate();
    
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

//     // Handle start calling button click with navigation
//     const handleStartCalling = (objectiveId, objectiveName) => {
//         // Navigate to calling page with objectiveId

//         // alert(objectiveId)
//         navigate(`/calling-main`, {

//           state: {
//             objectiveId: objectiveId,
//             objectiveName:objectiveName
//           }
//         });
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
                        
//                         <h4 className="mb-4">Calling Management Dashboard</h4>
//                         {/* <p className="text-muted">
//                             Welcome, <strong>{userData?.name || userData?.userId || 'User'}</strong>! 
//                             Here's your calling performance summary.
//                         </p> */}
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
                // Filter out objectives where isObjectOfCallingDone is true
                const filteredObjectives = response.data.data.objectives.filter(
                    objective => !objective.config?.isObjectOfCallingDone
                );
                
                // Update dashboard data with filtered objectives
                const updatedDashboardData = {
                    ...response.data.data,
                    objectives: filteredObjectives
                };
                
                setDashboardData(updatedDashboardData);
                
                // Create objective options for filter (only for active objectives)
                const options = filteredObjectives.map(obj => ({
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
                    No active objectives found{selectedObjective ? ' for the selected filter' : ''}
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