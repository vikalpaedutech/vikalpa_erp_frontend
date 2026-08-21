// import React, {useEffect, useState, useContext} from "react";
// import { UserContext } from "../contextAPIs/User.context";



// export const DPR = () => {

// const {userData} = useContext(UserContext)




// console.log(userData)

// }



// import React, { useEffect, useState, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//     createDailyWork,
//     completeDailyWork,
//     createDailyWorkStatus,
//     getAllDailyWork,
//     getDailyWorkById,
//     getLatestStatus,
//     updateDailyWork,
//     deleteDailyWork
// } from "../../service/DPR/DPR.services";

// // React-Bootstrap imports
// import {
//     Container,
//     Row,
//     Col,
//     Card,
//     Form,
//     Button,
//     Table,
//     Badge,
//     Alert,
//     Spinner,
//     ButtonGroup,
//     Modal
// } from 'react-bootstrap';

// import 'bootstrap/dist/css/bootstrap.min.css';

// const TASK_STATUS = {
//     PENDING: 'Pending',
//     WORKING: 'Working',
//     COMPLETED: 'Completed',
//     BLOCKED: 'Blocked',
//     ON_HOLD: 'On-Hold'
// };

// const TASK_STATUS_OPTIONS = [
//     { value: 'Pending', label: 'Pending', variant: 'secondary' },
//     { value: 'Working', label: 'Working', variant: 'warning' },
//     { value: 'Completed', label: 'Completed', variant: 'success' },
//     { value: 'Blocked', label: 'Blocked', variant: 'danger' },
//     { value: 'On-Hold', label: 'On-Hold', variant: 'info' }
// ];

// export const DPR = () => {
//     const { userData } = useContext(UserContext);
//     const userId = userData?._id || userData?.unqObjectId || userData?.userId || '';

//     // States
//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     // Form States - Create Task
//     const [showCreateForm, setShowCreateForm] = useState(false);
//     const [newTask, setNewTask] = useState({
//         task: '',
//         taskAssignedBy: '',
//         startDate: new Date().toISOString().split('T')[0], // Default today
//         taskDeadline: ''
//     });

//     // Modal States - Complete Task
//     const [showCompleteModal, setShowCompleteModal] = useState(false);
//     const [selectedTaskId, setSelectedTaskId] = useState('');
//     const [completeData, setCompleteData] = useState({
//         challengesFaceOnTask: '',
//         howChallengeResolved: '',
//         reasonDeadlineCrossed: ''
//     });
//     const [isDeadlineCrossed, setIsDeadlineCrossed] = useState(false);

//     // Update Status Form
//     const [showStatusForm, setShowStatusForm] = useState(false);
//     const [statusData, setStatusData] = useState({
//         performedHow: '',
//         toolsUsed: '',
//         challengesFaced: '',
//         challengesResolution: '',
//         actualTimeTaken: '',
//         taskStatus: TASK_STATUS.WORKING,
//         supportRequired: '',
//         workProof: '' // Changed to string for comma-separated input
//     });

//     // Filter States
//     const [filters, setFilters] = useState({
//         taskStatus: '',
//         startDate: '',
//         endDate: '',
//         isDeadlineCrossed: ''
//     });

//     // ============================================
//     // FETCH TASKS
//     // ============================================
//     const fetchTasks = async () => {
//         if (!userId) {
//             setError('User not authenticated');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         try {
//             const params = {
//                 unqUserObjectId: userId,
//                 ...(filters.taskStatus && { taskStatus: filters.taskStatus }),
//                 ...(filters.startDate && { startDate: filters.startDate }),
//                 ...(filters.endDate && { endDate: filters.endDate }),
//                 ...(filters.isDeadlineCrossed && { isDeadlineCrossed: filters.isDeadlineCrossed === 'true' })
//             };

//             const response = await getAllDailyWork(params);
            
//             if (response?.status === 'ok') {
//                 setTasks(response.data || []);
//             } else {
//                 setError(response?.message || 'Failed to fetch tasks');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to fetch tasks');
//             console.error('Fetch Tasks Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // CREATE TASK - With Start Date
//     // ============================================
//     const handleCreateTask = async (e) => {
//         e.preventDefault();
        
//         if (!userId) {
//             setError('User not authenticated');
//             return;
//         }

//         if (!newTask.task || !newTask.taskAssignedBy) {
//             setError('Task Title and Assigned By are required');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const reqBody = {
//                 unqUserObjectId: userId,
//                 task: newTask.task,
//                 taskAssignedBy: newTask.taskAssignedBy,
//                 startDate: newTask.startDate || new Date().toISOString().split('T')[0],
//                 taskDeadline: newTask.taskDeadline || undefined
//             };

//             const response = await createDailyWork(reqBody);
            
//             if (response?.status === 'ok') {
//                 setSuccess('Task created successfully!');
//                 resetNewTaskForm();
//                 setShowCreateForm(false);
//                 fetchTasks();
//             } else {
//                 setError(response?.message || 'Failed to create task');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to create task');
//             console.error('Create Task Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // COMPLETE TASK - Opens Modal for Challenges
//     // ============================================
//     const handleOpenCompleteModal = (taskId) => {
//         const task = tasks.find(t => t._id === taskId);
//         if (!task) return;

//         // Check if deadline is crossed
//         const deadlineCrossed = task.taskDeadline && new Date(task.taskDeadline) < new Date();
//         setIsDeadlineCrossed(deadlineCrossed || false);
        
//         setSelectedTaskId(taskId);
//         setCompleteData({
//             challengesFaceOnTask: '',
//             howChallengeResolved: '',
//             reasonDeadlineCrossed: ''
//         });
//         setShowCompleteModal(true);
//     };

//     const handleCompleteTask = async () => {
//         if (!selectedTaskId) {
//             setError('No task selected');
//             return;
//         }

//         // Validation - Challenges and Resolution required
//         if (!completeData.challengesFaceOnTask || !completeData.howChallengeResolved) {
//             setError('Challenges Faced and How Challenge Resolved are required');
//             return;
//         }

//         // If deadline crossed, reason is required
//         if (isDeadlineCrossed && !completeData.reasonDeadlineCrossed) {
//             setError('Reason for deadline crossed is required');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const reqBody = {
//                 challengesFaceOnTask: completeData.challengesFaceOnTask,
//                 howChallengeResolved: completeData.howChallengeResolved,
//                 reasonDeadlineCrossed: completeData.reasonDeadlineCrossed || ''
//             };

//             const response = await completeDailyWork(selectedTaskId, reqBody);
            
//             if (response?.status === 'ok') {
//                 setSuccess(response.message || 'Task completed successfully! 🎉');
//                 setShowCompleteModal(false);
//                 fetchTasks();
//             } else {
//                 setError(response?.message || 'Failed to complete task');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to complete task');
//             console.error('Complete Task Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // UPDATE TASK STATUS
//     // ============================================
//     const handleUpdateStatus = async (e) => {
//         e.preventDefault();
        
//         if (!selectedTaskId) {
//             setError('No task selected');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             // Convert comma-separated strings to arrays
//             const toolsArray = statusData.toolsUsed.split(',').map(t => t.trim()).filter(t => t);
//             const workProofArray = statusData.workProof.split(',').map(u => u.trim()).filter(u => u);

//             const reqBody = {
//                 taskId: selectedTaskId,
//                 performedHow: statusData.performedHow || '',
//                 toolsUsed: toolsArray,
//                 challengesFaced: statusData.challengesFaced || '',
//                 challengesResolution: statusData.challengesResolution || '',
//                 actualTimeTaken: parseFloat(statusData.actualTimeTaken) || 0,
//                 taskStatus: statusData.taskStatus || TASK_STATUS.WORKING,
//                 supportRequired: statusData.supportRequired || '',
//                 workProof: workProofArray
//             };

//             const response = await createDailyWorkStatus(reqBody);
            
//             if (response?.status === 'ok') {
//                 setSuccess('Status updated successfully!');
//                 resetStatusForm();
//                 setShowStatusForm(false);
//                 fetchTasks();
//             } else {
//                 setError(response?.message || 'Failed to update status');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to update status');
//             console.error('Update Status Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // UPDATE TASK (Generic)
//     // ============================================
//     const handleUpdateTask = async (taskId, updateData) => {
//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const response = await updateDailyWork(taskId, updateData);
            
//             if (response?.status === 'ok') {
//                 setSuccess('Task updated successfully!');
//                 fetchTasks();
//             } else {
//                 setError(response?.message || 'Failed to update task');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to update task');
//             console.error('Update Task Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // DELETE TASK
//     // ============================================
//     const handleDeleteTask = async (taskId, taskDescription) => {
//         if (!window.confirm(`Are you sure you want to delete "${taskDescription}"?`)) {
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const response = await deleteDailyWork(taskId);
            
//             if (response?.status === 'ok') {
//                 setSuccess('Task deleted successfully!');
//                 fetchTasks();
//             } else {
//                 setError(response?.message || 'Failed to delete task');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to delete task');
//             console.error('Delete Task Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // VIEW TASK DETAILS
//     // ============================================
//     const handleViewTaskDetails = async (taskId) => {
//         setLoading(true);
//         setError('');
        
//         try {
//             const response = await getDailyWorkById(taskId);
            
//             if (response?.status === 'ok') {
//                 const task = response.data.task;
//                 const statuses = response.data.statusHistory || [];
//                 const latestStatus = statuses[0] || {};
                
//                 alert(
//                     `📋 Task Details\n\n` +
//                     `Title: ${task.task}\n` +
//                     `Assigned By: ${task.taskAssignedBy}\n` +
//                     `Status: ${task.taskStatus}\n` +
//                     `Start Date: ${task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}\n` +
//                     `End Date: ${task.endDate ? new Date(task.endDate).toLocaleDateString() : 'Not Completed'}\n` +
//                     `Total Hours: ${task.totalHoursTakenToFinishTask || 0}h\n` +
//                     `Total Days: ${task.totalDaysTakenToFinishTask || 0}d\n` +
//                     `Challenges: ${task.challengesFaceOnTask || 'N/A'}\n` +
//                     `Resolution: ${task.howChallengeResolved || 'N/A'}\n` +
//                     `Deadline: ${task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'N/A'}\n` +
//                     `Deadline Crossed: ${task.isDeadlineCrossed ? 'Yes ✅' : 'No ❌'}\n` +
//                     `Status Updates: ${statuses.length}\n\n` +
//                     `📊 Latest Status:\n` +
//                     `Performed: ${latestStatus.performedHow || 'N/A'}\n` +
//                     `Tools: ${latestStatus.toolsUsed?.join(', ') || 'N/A'}`
//                 );
//                 console.log('Task Details:', response.data);
//             } else {
//                 setError(response?.message || 'Failed to fetch task details');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to fetch task details');
//             console.error('View Task Details Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // VIEW LATEST STATUS
//     // ============================================
//     const handleViewLatestStatus = async (taskId) => {
//         setLoading(true);
//         setError('');
        
//         try {
//             const response = await getLatestStatus(taskId);
            
//             if (response?.status === 'ok') {
//                 const data = response.data;
//                 alert(
//                     `📊 Latest Status\n\n` +
//                     `Status: ${data.taskStatus}\n` +
//                     `Performed: ${data.performedHow || 'N/A'}\n` +
//                     `Tools: ${data.toolsUsed?.join(', ') || 'N/A'}\n` +
//                     `Actual Time: ${data.actualTimeTaken || 0} hours\n` +
//                     `Support Required: ${data.supportRequired || 'N/A'}\n` +
//                     `Updated At: ${new Date(data.statusUpdatedAt).toLocaleString()}`
//                 );
//                 console.log('Latest Status:', data);
//             } else {
//                 setError(response?.message || 'Failed to fetch latest status');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to fetch latest status');
//             console.error('View Latest Status Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // UTILITY FUNCTIONS
//     // ============================================
//     const resetNewTaskForm = () => {
//         setNewTask({
//             task: '',
//             taskAssignedBy: '',
//             startDate: new Date().toISOString().split('T')[0],
//             taskDeadline: ''
//         });
//     };

//     const resetStatusForm = () => {
//         setStatusData({
//             performedHow: '',
//             toolsUsed: '',
//             challengesFaced: '',
//             challengesResolution: '',
//             actualTimeTaken: '',
//             taskStatus: TASK_STATUS.WORKING,
//             supportRequired: '',
//             workProof: ''
//         });
//         setSelectedTaskId('');
//     };

//     const handleNewTaskChange = (e) => {
//         const { name, value } = e.target;
//         setNewTask(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleCompleteDataChange = (e) => {
//         const { name, value } = e.target;
//         setCompleteData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleStatusChange = (e) => {
//         const { name, value } = e.target;
//         setStatusData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const getStatusBadgeVariant = (status) => {
//         const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
//         return option?.variant || 'secondary';
//     };

//     // ============================================
//     // EFFECTS
//     // ============================================
//     useEffect(() => {
//         if (userId) {
//             fetchTasks();
//         }
//     }, [userId, filters]);

//     // ============================================
//     // RENDER
//     // ============================================
//     return (
//         <Container fluid className="py-4">
//             <Row className="mb-4">
//                 <Col>
//                     <h1 className="display-5 fw-bold">📋 Daily Work Report</h1>
//                     <p className="text-muted">Track and manage your daily tasks efficiently</p>
//                 </Col>
//             </Row>

//             {/* User Info Card */}
//             <Row className="mb-4">
//                 <Col md={12}>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Row>
//                                 <Col md={3}>
//                                     <small className="text-muted">User ID</small>
//                                     <p className="fw-semibold">{userId || 'N/A'}</p>
//                                 </Col>
//                                 <Col md={3}>
//                                     <small className="text-muted">Name</small>
//                                     <p className="fw-semibold">{userData?.name || 'N/A'}</p>
//                                 </Col>
//                                 <Col md={3}>
//                                     <small className="text-muted">Email</small>
//                                     <p className="fw-semibold">{userData?.email || 'N/A'}</p>
//                                 </Col>
//                                 <Col md={3}>
//                                     <small className="text-muted">Department</small>
//                                     <p className="fw-semibold">{userData?.department || 'N/A'}</p>
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Alerts */}
//             {success && (
//                 <Alert variant="success" dismissible onClose={() => setSuccess('')}>
//                     {success}
//                 </Alert>
//             )}
//             {error && (
//                 <Alert variant="danger" dismissible onClose={() => setError('')}>
//                     {error}
//                 </Alert>
//             )}

//             {/* Filters */}
//             <Card className="shadow-sm mb-4">
//                 <Card.Body>
//                     <h5 className="fw-semibold mb-3">🔍 Filters</h5>
//                     <Row>
//                         <Col md={3}>
//                             <Form.Group>
//                                 <Form.Label>Task Status</Form.Label>
//                                 <Form.Select
//                                     name="taskStatus"
//                                     value={filters.taskStatus}
//                                     onChange={handleFilterChange}
//                                 >
//                                     <option value="">All</option>
//                                     {TASK_STATUS_OPTIONS.map(option => (
//                                         <option key={option.value} value={option.value}>
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </Form.Select>
//                             </Form.Group>
//                         </Col>
//                         <Col md={3}>
//                             <Form.Group>
//                                 <Form.Label>Start Date (From)</Form.Label>
//                                 <Form.Control
//                                     type="date"
//                                     name="startDate"
//                                     value={filters.startDate}
//                                     onChange={handleFilterChange}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={3}>
//                             <Form.Group>
//                                 <Form.Label>End Date (To)</Form.Label>
//                                 <Form.Control
//                                     type="date"
//                                     name="endDate"
//                                     value={filters.endDate}
//                                     onChange={handleFilterChange}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={3}>
//                             <Form.Group>
//                                 <Form.Label>Deadline Crossed</Form.Label>
//                                 <Form.Select
//                                     name="isDeadlineCrossed"
//                                     value={filters.isDeadlineCrossed}
//                                     onChange={handleFilterChange}
//                                 >
//                                     <option value="">All</option>
//                                     <option value="true">Yes</option>
//                                     <option value="false">No</option>
//                                 </Form.Select>
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                 </Card.Body>
//             </Card>

//             {/* Create Task Button */}
//             <div className="mb-4">
//                 <Button
//                     variant={showCreateForm ? 'secondary' : 'primary'}
//                     onClick={() => setShowCreateForm(!showCreateForm)}
//                 >
//                     {showCreateForm ? '✕ Cancel' : '+ Create New Task'}
//                 </Button>
//             </div>

//             {/* Create Task Form - With Start Date */}
//             {showCreateForm && (
//                 <Card className="shadow-sm mb-4">
//                     <Card.Body>
//                         <h5 className="fw-semibold mb-3">📝 Create New Task</h5>
//                         <p className="text-muted small">Start Date can be edited if you forgot to create on the actual start day</p>
//                         <Form onSubmit={handleCreateTask}>
//                             <Row>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Task Title <span className="text-danger">*</span></Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             name="task"
//                                             value={newTask.task}
//                                             onChange={handleNewTaskChange}
//                                             placeholder="Enter task title"
//                                             required
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Assigned By <span className="text-danger">*</span></Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             name="taskAssignedBy"
//                                             value={newTask.taskAssignedBy}
//                                             onChange={handleNewTaskChange}
//                                             placeholder="Enter assigner name"
//                                             required
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Start Date <span className="text-muted">(You can update)</span></Form.Label>
//                                         <Form.Control
//                                             type="date"
//                                             name="startDate"
//                                             value={newTask.startDate}
//                                             onChange={handleNewTaskChange}
//                                         />
//                                         <Form.Text className="text-muted">Default is today, you can change if needed</Form.Text>
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Deadline (Optional)</Form.Label>
//                                         <Form.Control
//                                             type="date"
//                                             name="taskDeadline"
//                                             value={newTask.taskDeadline}
//                                             onChange={handleNewTaskChange}
//                                         />
//                                         <Form.Text className="text-muted">System will auto-check if crossed</Form.Text>
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Task Status</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             value="Pending (Auto-set)"
//                                             disabled
//                                             className="bg-light text-muted"
//                                         />
//                                         <Form.Text className="text-muted">System will set to Pending</Form.Text>
//                                     </Form.Group>
//                                 </Col>
//                             </Row>
//                             <div className="mt-3">
//                                 <Button type="submit" variant="success" disabled={loading}>
//                                     {loading ? <Spinner animation="border" size="sm" /> : 'Create Task'}
//                                 </Button>
//                             </div>
//                         </Form>
//                     </Card.Body>
//                 </Card>
//             )}

//             {/* Update Status Form */}
//             {showStatusForm && (
//                 <Card className="shadow-sm mb-4">
//                     <Card.Body>
//                         <h5 className="fw-semibold mb-3">📊 Update Task Status</h5>
//                         <Form onSubmit={handleUpdateStatus}>
//                             <Row>
//                                 <Col md={12}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>How was the task performed?</Form.Label>
//                                         <Form.Control
//                                             as="textarea"
//                                             rows={2}
//                                             name="performedHow"
//                                             value={statusData.performedHow}
//                                             onChange={handleStatusChange}
//                                             placeholder="Describe how you performed the task"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={4}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Tools Used</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             name="toolsUsed"
//                                             value={statusData.toolsUsed}
//                                             onChange={handleStatusChange}
//                                             placeholder="e.g., VS Code, Postman, GitHub"
//                                         />
//                                         <Form.Text className="text-muted">Separate with comma (e.g., Tool1, Tool2, Tool3)</Form.Text>
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={4}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Actual Time Taken (hours)</Form.Label>
//                                         <Form.Control
//                                             type="number"
//                                             name="actualTimeTaken"
//                                             value={statusData.actualTimeTaken}
//                                             onChange={handleStatusChange}
//                                             placeholder="e.g., 3.5"
//                                             step="0.5"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={4}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Task Status</Form.Label>
//                                         <Form.Select
//                                             name="taskStatus"
//                                             value={statusData.taskStatus}
//                                             onChange={handleStatusChange}
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Working">Working</option>
//                                             <option value="Completed">Completed</option>
//                                             <option value="Blocked">Blocked</option>
//                                             <option value="On-Hold">On-Hold</option>
//                                         </Form.Select>
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={12}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Support Required From</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             name="supportRequired"
//                                             value={statusData.supportRequired}
//                                             onChange={handleStatusChange}
//                                             placeholder="e.g., Vikram (Backend Team)"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={12}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Challenges Faced</Form.Label>
//                                         <Form.Control
//                                             as="textarea"
//                                             rows={2}
//                                             name="challengesFaced"
//                                             value={statusData.challengesFaced}
//                                             onChange={handleStatusChange}
//                                             placeholder="Enter challenges faced"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={12}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>How Challenges Were Resolved</Form.Label>
//                                         <Form.Control
//                                             as="textarea"
//                                             rows={2}
//                                             name="challengesResolution"
//                                             value={statusData.challengesResolution}
//                                             onChange={handleStatusChange}
//                                             placeholder="Enter resolution details"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={12}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Any URLs</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             name="workProof"
//                                             value={statusData.workProof}
//                                             onChange={handleStatusChange}
//                                             placeholder="e.g., https://drive.google.com/file/123, https://screenshot.png"
//                                         />
//                                         <Form.Text className="text-muted">Separate multiple URLs with comma</Form.Text>
//                                     </Form.Group>
//                                 </Col>
//                             </Row>
//                             <div className="d-flex gap-2">
//                                 <Button type="submit" variant="primary" disabled={loading}>
//                                     {loading ? <Spinner animation="border" size="sm" /> : 'Update Status'}
//                                 </Button>
//                                 <Button variant="secondary" onClick={() => setShowStatusForm(false)}>
//                                     Cancel
//                                 </Button>
//                             </div>
//                         </Form>
//                     </Card.Body>
//                 </Card>
//             )}

//             {/* Tasks Table */}
//             <Card className="shadow-sm">
//                 <Card.Body>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="fw-semibold mb-0">📋 Tasks ({tasks.length})</h5>
//                         {loading && <Spinner animation="border" size="sm" />}
//                     </div>
                    
//                     {tasks.length === 0 ? (
//                         <div className="text-center py-4 text-muted">
//                             {loading ? 'Loading tasks...' : 'No tasks found'}
//                         </div>
//                     ) : (
//                         <Table responsive striped hover>
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Task Title</th>
//                                     <th>Assigned By</th>
//                                     <th>Status</th>
//                                     <th>Start Date</th>
//                                     <th>End Date</th>
//                                     <th>Time</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {tasks.map((task, index) => (
//                                     <tr key={task._id}>
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             <div style={{ maxWidth: '180px' }}>
//                                                 <div className="text-truncate" title={task.task}>
//                                                     {task.task}
//                                                 </div>
//                                                 {task.isDeadlineCrossed && task.taskStatus !== TASK_STATUS.COMPLETED && (
//                                                     <Badge bg="danger" className="mt-1">⚠️ Deadline Crossed</Badge>
//                                                 )}
//                                                 {task.taskStatus === TASK_STATUS.COMPLETED && (
//                                                     <Badge bg="info" className="mt-1">
//                                                         ⏱️ {task.totalHoursTakenToFinishTask || 0}h
//                                                     </Badge>
//                                                 )}
//                                             </div>
//                                         </td>
//                                         <td>{task.taskAssignedBy}</td>
//                                         <td>
//                                             <Badge bg={getStatusBadgeVariant(task.taskStatus)}>
//                                                 {task.taskStatus}
//                                             </Badge>
//                                         </td>
//                                         <td>
//                                             {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}
//                                         </td>
//                                         <td>
//                                             {task.endDate ? new Date(task.endDate).toLocaleDateString() : '⏳ In Progress'}
//                                         </td>
//                                         <td>
//                                             {task.taskStatus === TASK_STATUS.COMPLETED ? (
//                                                 <div>
//                                                     <div className="small">{task.totalHoursTakenToFinishTask || 0}h</div>
//                                                     <div className="small text-muted">{task.totalDaysTakenToFinishTask || 0}d</div>
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-muted">—</span>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <ButtonGroup size="sm" vertical={false}>
//                                                 <Button
//                                                     variant="outline-primary"
//                                                     onClick={() => {
//                                                         setSelectedTaskId(task._id);
//                                                         setShowStatusForm(true);
//                                                         setShowCreateForm(false);
//                                                     }}
//                                                     title="Update Status"
//                                                 >
//                                                     📝
//                                                 </Button>
//                                                 <Button
//                                                     variant="outline-success"
//                                                     onClick={() => handleViewTaskDetails(task._id)}
//                                                     title="View Details"
//                                                 >
//                                                     👁️
//                                                 </Button>
//                                                 <Button
//                                                     variant="outline-warning"
//                                                     onClick={() => handleViewLatestStatus(task._id)}
//                                                     title="Latest Status"
//                                                 >
//                                                     🔄
//                                                 </Button>
                                                
//                                                 {/* Complete Button - Opens Modal */}
//                                                 {task.taskStatus !== TASK_STATUS.COMPLETED && (
//                                                     <Button
//                                                         variant="outline-success"
//                                                         onClick={() => handleOpenCompleteModal(task._id)}
//                                                         title="Mark as Completed"
//                                                         className="fw-bold"
//                                                     >
//                                                         ✅ Complete
//                                                     </Button>
//                                                 )}
//                                                 {task.taskStatus === TASK_STATUS.COMPLETED && (
//                                                     <Badge bg="success" className="p-2 ms-1">
//                                                         ✅ Done
//                                                     </Badge>
//                                                 )}
//                                                 <Button
//                                                     variant="outline-danger"
//                                                     onClick={() => handleDeleteTask(task._id, task.task)}
//                                                     title="Delete"
//                                                 >
//                                                     🗑️
//                                                 </Button>
//                                             </ButtonGroup>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Complete Task Modal */}
//             <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>✅ Complete Task</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p className="text-muted">Please provide details about the task completion.</p>
                    
//                     {isDeadlineCrossed && (
//                         <Alert variant="danger">
//                             ⚠️ <strong>Deadline Crossed!</strong> Please provide a reason.
//                         </Alert>
//                     )}

//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Challenges Faced <span className="text-danger">*</span></Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={2}
//                                 name="challengesFaceOnTask"
//                                 value={completeData.challengesFaceOnTask}
//                                 onChange={handleCompleteDataChange}
//                                 placeholder="What challenges did you face?"
//                                 required
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label>How Challenge Resolved <span className="text-danger">*</span></Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={2}
//                                 name="howChallengeResolved"
//                                 value={completeData.howChallengeResolved}
//                                 onChange={handleCompleteDataChange}
//                                 placeholder="How did you resolve the challenges?"
//                                 required
//                             />
//                         </Form.Group>

//                         {isDeadlineCrossed && (
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Reason for Deadline Crossed <span className="text-danger">*</span></Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={2}
//                                     name="reasonDeadlineCrossed"
//                                     value={completeData.reasonDeadlineCrossed}
//                                     onChange={handleCompleteDataChange}
//                                     placeholder="Why was the deadline crossed?"
//                                     required
//                                 />
//                             </Form.Group>
//                         )}

//                         <Alert variant="info" className="mt-2">
//                             <small>
//                                 ⏱️ <strong>System will auto-calculate:</strong><br />
//                                 • End Date: Today<br />
//                                 • Total Hours: From Start Date to Today<br />
//                                 • Total Days: From Start Date to Today
//                             </small>
//                         </Alert>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button 
//                         variant="success" 
//                         onClick={handleCompleteTask}
//                         disabled={loading}
//                     >
//                         {loading ? <Spinner animation="border" size="sm" /> : '✅ Complete Task'}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default DPR;









import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import {
    createDailyWork,
    getAllDailyWork,
    completeDailyWork,
    deleteDailyWork
} from "../../service/DPR/DPR.services";

// React-Bootstrap imports
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Table,
    Badge,
    Alert,
    Spinner,
    ButtonGroup,
    Modal
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const TASK_STATUS = {
    PENDING: 'Pending',
    WORKING: 'Working',
    COMPLETED: 'Completed',
    BLOCKED: 'Blocked',
    ON_HOLD: 'On-Hold'
};

const TASK_STATUS_OPTIONS = [
    { value: 'Pending', label: 'Pending', variant: 'secondary' },
    { value: 'Working', label: 'Working', variant: 'warning' },
    { value: 'Completed', label: 'Completed', variant: 'success' },
    { value: 'Blocked', label: 'Blocked', variant: 'danger' },
    { value: 'On-Hold', label: 'On-Hold', variant: 'info' }
];

export const DPR = () => {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const userId = userData?._id || userData?.unqObjectId || userData?.userId || '';

    // States
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Create Task Form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTask, setNewTask] = useState({
        task: '',
        taskAssignedBy: '',
        startDate: new Date().toISOString().split('T')[0],
        taskDeadline: ''
    });

    // Complete Task Modal
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [completeData, setCompleteData] = useState({
        challengesFaceOnTask: '',
        howChallengeResolved: '',
        reasonDeadlineCrossed: ''
    });
    const [isDeadlineCrossed, setIsDeadlineCrossed] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        taskStatus: '',
        startDate: '',
        endDate: '',
        isDeadlineCrossed: ''
    });

    // ============================================
    // FETCH TASKS
    // ============================================
    const fetchTasks = async () => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const params = {
                unqUserObjectId: userId,
                ...(filters.taskStatus && { taskStatus: filters.taskStatus }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                ...(filters.isDeadlineCrossed && { isDeadlineCrossed: filters.isDeadlineCrossed === 'true' })
            };

            const response = await getAllDailyWork(params);
            
            if (response?.status === 'ok') {
                setTasks(response.data || []);
            } else {
                setError(response?.message || 'Failed to fetch tasks');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch tasks');
            console.error('Fetch Tasks Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // CREATE TASK
    // ============================================
    const handleCreateTask = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        if (!newTask.task || !newTask.taskAssignedBy) {
            setError('Task Title and Assigned By are required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const reqBody = {
                unqUserObjectId: userId,
                task: newTask.task,
                taskAssignedBy: newTask.taskAssignedBy,
                startDate: newTask.startDate,
                taskDeadline: newTask.taskDeadline || undefined
            };

            const response = await createDailyWork(reqBody);
            
            if (response?.status === 'ok') {
                setSuccess('Task created successfully!');
                resetNewTaskForm();
                setShowCreateForm(false);
                fetchTasks();
            } else {
                setError(response?.message || 'Failed to create task');
            }
        } catch (error) {
            setError(error.message || 'Failed to create task');
            console.error('Create Task Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // COMPLETE TASK
    // ============================================
    const handleOpenCompleteModal = (taskId) => {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return;

        const deadlineCrossed = task.taskDeadline && new Date(task.taskDeadline) < new Date();
        setIsDeadlineCrossed(deadlineCrossed || false);
        
        setSelectedTaskId(taskId);
        setCompleteData({
            challengesFaceOnTask: '',
            howChallengeResolved: '',
            reasonDeadlineCrossed: ''
        });
        setShowCompleteModal(true);
    };

    const handleCompleteTask = async () => {
        if (!selectedTaskId) {
            setError('No task selected');
            return;
        }

        if (!completeData.challengesFaceOnTask || !completeData.howChallengeResolved) {
            setError('Challenges Faced and How Challenge Resolved are required');
            return;
        }

        if (isDeadlineCrossed && !completeData.reasonDeadlineCrossed) {
            setError('Reason for deadline crossed is required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const reqBody = {
                challengesFaceOnTask: completeData.challengesFaceOnTask,
                howChallengeResolved: completeData.howChallengeResolved,
                reasonDeadlineCrossed: completeData.reasonDeadlineCrossed || ''
            };

            const response = await completeDailyWork(selectedTaskId, reqBody);
            
            if (response?.status === 'ok') {
                setSuccess(response.message || 'Task completed successfully! 🎉');
                setShowCompleteModal(false);
                fetchTasks();
            } else {
                setError(response?.message || 'Failed to complete task');
            }
        } catch (error) {
            setError(error.message || 'Failed to complete task');
            console.error('Complete Task Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // DELETE TASK
    // ============================================
    const handleDeleteTask = async (taskId, taskDescription) => {
        if (!window.confirm(`Are you sure you want to delete "${taskDescription}"?`)) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await deleteDailyWork(taskId);
            
            if (response?.status === 'ok') {
                setSuccess('Task deleted successfully!');
                fetchTasks();
            } else {
                setError(response?.message || 'Failed to delete task');
            }
        } catch (error) {
            setError(error.message || 'Failed to delete task');
            console.error('Delete Task Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // NAVIGATE TO STATUS PAGE
    // ============================================
    const handleOpenStatusPage = (taskId) => {
        navigate(`/admin/dpr-status/${taskId}`);
    };

    // ============================================
    // NAVIGATE TO REPORT PAGE
    // ============================================
    const handleOpenReport = () => {
        navigate('/admin/dpr-report');
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const resetNewTaskForm = () => {
        setNewTask({
            task: '',
            taskAssignedBy: '',
            startDate: new Date().toISOString().split('T')[0],
            taskDeadline: ''
        });
    };

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCompleteDataChange = (e) => {
        const { name, value } = e.target;
        setCompleteData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusBadgeVariant = (status) => {
        const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
        return option?.variant || 'secondary';
    };

    useEffect(() => {
        if (userId) {
            fetchTasks();
        }
    }, [userId, filters]);

    // ============================================
    // RENDER
    // ============================================
    return (
        <Container fluid className="py-4">
            {/* 🔥 Navigation Link - Report Page */}
            <Row className="mb-3">
                <Col>
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={handleOpenReport}
                        className="d-inline-flex align-items-center gap-1"
                    >
                        📄 View / Export Report
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <h1 className="display-5 fw-bold">📋 Daily Work Report</h1>
                    <p className="text-muted">Track and manage your daily tasks efficiently</p>
                </Col>
            </Row>

            {/* User Info */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <small className="text-muted">User ID</small>
                                    <p className="fw-semibold">{userId || 'N/A'}</p>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted">Name</small>
                                    <p className="fw-semibold">{userData?.name || 'N/A'}</p>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted">Email</small>
                                    <p className="fw-semibold">{userData?.email || 'N/A'}</p>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted">Department</small>
                                    <p className="fw-semibold">{userData?.department || 'N/A'}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Alerts */}
            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h5 className="fw-semibold mb-3">🔍 Filters</h5>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Task Status</Form.Label>
                                <Form.Select
                                    name="taskStatus"
                                    value={filters.taskStatus}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All</option>
                                    {TASK_STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Start Date (From)</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>End Date (To)</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Deadline Crossed</Form.Label>
                                <Form.Select
                                    name="isDeadlineCrossed"
                                    value={filters.isDeadlineCrossed}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Create Task Button */}
            <div className="mb-4">
                <Button
                    variant={showCreateForm ? 'secondary' : 'primary'}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? '✕ Cancel' : '+ Create New Task'}
                </Button>
            </div>

            {/* Create Task Form */}
            {showCreateForm && (
                <Card className="shadow-sm mb-4">
                    <Card.Body>
                        <h5 className="fw-semibold mb-3">📝 Create New Task</h5>
                        <Form onSubmit={handleCreateTask}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Task Title <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="task"
                                            value={newTask.task}
                                            onChange={handleNewTaskChange}
                                            placeholder="Enter task title"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Assigned By <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="taskAssignedBy"
                                            value={newTask.taskAssignedBy}
                                            onChange={handleNewTaskChange}
                                            placeholder="Enter assigner name"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="startDate"
                                            value={newTask.startDate}
                                            onChange={handleNewTaskChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Deadline (Optional)</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="taskDeadline"
                                            value={newTask.taskDeadline}
                                            onChange={handleNewTaskChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button type="submit" variant="success" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Create Task'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            {/* Tasks Table */}
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold mb-0">📋 Tasks ({tasks.length})</h5>
                        {loading && <Spinner animation="border" size="sm" />}
                    </div>
                    
                    {tasks.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            {loading ? 'Loading tasks...' : 'No tasks found'}
                        </div>
                    ) : (
                        <Table responsive striped hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Task Title</th>
                                    <th>Assigned By</th>
                                    <th>Status</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={task._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div style={{ maxWidth: '180px' }}>
                                                <div className="text-truncate" title={task.task}>
                                                    {task.task}
                                                </div>
                                                {task.isDeadlineCrossed && task.taskStatus !== TASK_STATUS.COMPLETED && (
                                                    <Badge bg="danger" className="mt-1">⚠️ Deadline Crossed</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td>{task.taskAssignedBy}</td>
                                        <td>
                                            <Badge bg={getStatusBadgeVariant(task.taskStatus)}>
                                                {task.taskStatus}
                                            </Badge>
                                        </td>
                                        <td>
                                            {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            {task.endDate ? new Date(task.endDate).toLocaleDateString() : '⏳ In Progress'}
                                        </td>
                                        <td>
                                            <ButtonGroup size="sm" vertical={false}>
                                                {/* Status Button - Opens DPRStatus page */}
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={() => handleOpenStatusPage(task._id)}
                                                    title="View/Update Status"
                                                >
                                                    📝 Status
                                                </Button>
                                                
                                                {/* Complete Button */}
                                                {task.taskStatus !== TASK_STATUS.COMPLETED && (
                                                    <Button
                                                        variant="outline-success"
                                                        onClick={() => handleOpenCompleteModal(task._id)}
                                                        title="Mark as Completed"
                                                    >
                                                        ✅ Complete
                                                    </Button>
                                                )}
                                                {task.taskStatus === TASK_STATUS.COMPLETED && (
                                                    <Badge bg="success" className="p-2 ms-1">
                                                        ✅ Done
                                                    </Badge>
                                                )}
                                                
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleDeleteTask(task._id, task.task)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Complete Task Modal */}
            <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>✅ Complete Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isDeadlineCrossed && (
                        <Alert variant="danger">
                            ⚠️ <strong>Deadline Crossed!</strong> Please provide a reason.
                        </Alert>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Challenges Faced <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="challengesFaceOnTask"
                                value={completeData.challengesFaceOnTask}
                                onChange={handleCompleteDataChange}
                                placeholder="What challenges did you face?"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>How Challenge Resolved <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="howChallengeResolved"
                                value={completeData.howChallengeResolved}
                                onChange={handleCompleteDataChange}
                                placeholder="How did you resolve the challenges?"
                                required
                            />
                        </Form.Group>
                        {isDeadlineCrossed && (
                            <Form.Group className="mb-3">
                                <Form.Label>Reason for Deadline Crossed <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="reasonDeadlineCrossed"
                                    value={completeData.reasonDeadlineCrossed}
                                    onChange={handleCompleteDataChange}
                                    placeholder="Why was the deadline crossed?"
                                    required
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleCompleteTask} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : '✅ Complete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DPR;