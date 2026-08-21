import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import {
    getDailyWorkById,
    createDailyWorkStatus,
    getDailyWorkStatuses
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
    Breadcrumb
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
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

export const DPRStatus = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    // States
    const [task, setTask] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Status Form
    const [statusData, setStatusData] = useState({
        performedHow: '',
        toolsUsed: '',
        challengesFaced: '',
        challengesResolution: '',
        actualTimeTaken: '',
        taskStatus: TASK_STATUS.WORKING,
        supportRequired: '',
        workProof: ''
    });

    // ============================================
    // FETCH TASK DETAILS & STATUS HISTORY
    // ============================================
    const fetchTaskDetails = async () => {
        if (!taskId) {
            setError('Task ID is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await getDailyWorkById(taskId);
            
            if (response?.status === 'ok') {
                setTask(response.data.task);
                setStatusHistory(response.data.statusHistory || []);
            } else {
                setError(response?.message || 'Failed to fetch task details');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch task details');
            console.error('Fetch Task Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // SUBMIT STATUS UPDATE
    // ============================================
    const handleSubmitStatus = async (e) => {
        e.preventDefault();
        
        if (!taskId) {
            setError('Task ID is missing');
            return;
        }

        if (!statusData.performedHow) {
            setError('Please describe how the task was performed');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const toolsArray = statusData.toolsUsed.split(',').map(t => t.trim()).filter(t => t);
            const workProofArray = statusData.workProof.split(',').map(u => u.trim()).filter(u => u);

            const reqBody = {
                taskId: taskId,
                performedHow: statusData.performedHow,
                toolsUsed: toolsArray,
                challengesFaced: statusData.challengesFaced || '',
                challengesResolution: statusData.challengesResolution || '',
                actualTimeTaken: parseFloat(statusData.actualTimeTaken) || 0,
                taskStatus: statusData.taskStatus || TASK_STATUS.WORKING,
                supportRequired: statusData.supportRequired || '',
                workProof: workProofArray
            };

            const response = await createDailyWorkStatus(reqBody);
            
            if (response?.status === 'ok') {
                setSuccess('Status updated successfully! 🎉');
                resetForm();
                fetchTaskDetails();
            } else {
                setError(response?.message || 'Failed to update status');
            }
        } catch (error) {
            setError(error.message || 'Failed to update status');
            console.error('Update Status Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const resetForm = () => {
        setStatusData({
            performedHow: '',
            toolsUsed: '',
            challengesFaced: '',
            challengesResolution: '',
            actualTimeTaken: '',
            taskStatus: TASK_STATUS.WORKING,
            supportRequired: '',
            workProof: ''
        });
    };

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setStatusData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusBadgeVariant = (status) => {
        const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
        return option?.variant || 'secondary';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString();
    };

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails();
        }
    }, [taskId]);

    // ============================================
    // RENDER
    // ============================================
    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading task details...</p>
            </Container>
        );
    }

    if (!task) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <h4>Task not found</h4>
                    <p>The task you're looking for doesn't exist or has been deleted.</p>
                    <Button variant="primary" onClick={() => navigate('/admin/dpr')}>
                        ← Back to Dashboard
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item onClick={() => navigate('/daily-work-report')}>
                    📋 Daily Work Report
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {task.task}
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* Task Header Card */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <h4 className="fw-bold mb-2">📌 {task.task}</h4>
                            <div className="d-flex flex-wrap gap-3">
                                <span>
                                    <strong>Assigned By:</strong> {task.taskAssignedBy}
                                </span>
                                <span>
                                    <strong>Status:</strong>{' '}
                                    <Badge bg={getStatusBadgeVariant(task.taskStatus)}>
                                        {task.taskStatus}
                                    </Badge>
                                </span>
                                {task.taskStatus === TASK_STATUS.COMPLETED && (
                                    <span>
                                        <strong>Completed:</strong>{' '}
                                        {task.endDate ? new Date(task.endDate).toLocaleDateString() : 'N/A'}
                                    </span>
                                )}
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <div className="text-muted small">
                                <div>Started: {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</div>
                                {task.taskDeadline && (
                                    <div>Deadline: {new Date(task.taskDeadline).toLocaleDateString()}</div>
                                )}
                                {task.isDeadlineCrossed && task.taskStatus !== TASK_STATUS.COMPLETED && (
                                    <Badge bg="danger">⚠️ Deadline Crossed</Badge>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

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

            <Row>
                {/* Left Column - Status Form */}
                <Col lg={5}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">📝 Update Status</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmitStatus}>
                                <Form.Group className="mb-3">
                                    <Form.Label>How was the task performed? <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="performedHow"
                                        value={statusData.performedHow}
                                        onChange={handleStatusChange}
                                        placeholder="Describe how you performed the task"
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tools Used</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="toolsUsed"
                                                value={statusData.toolsUsed}
                                                onChange={handleStatusChange}
                                                placeholder="e.g., VS Code, Postman"
                                            />
                                            <Form.Text className="text-muted">
                                                Separate with comma
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Actual Time (hours)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="actualTimeTaken"
                                                value={statusData.actualTimeTaken}
                                                onChange={handleStatusChange}
                                                placeholder="e.g., 3.5"
                                                step="0.5"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Task Status</Form.Label>
                                    <Form.Select
                                        name="taskStatus"
                                        value={statusData.taskStatus}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Working">Working</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Blocked">Blocked</option>
                                        <option value="On-Hold">On-Hold</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Support Required From</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="supportRequired"
                                        value={statusData.supportRequired}
                                        onChange={handleStatusChange}
                                        placeholder="e.g., Vikram (Backend Team)"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Challenges Faced</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="challengesFaced"
                                        value={statusData.challengesFaced}
                                        onChange={handleStatusChange}
                                        placeholder="Enter challenges faced"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>How Challenges Were Resolved</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="challengesResolution"
                                        value={statusData.challengesResolution}
                                        onChange={handleStatusChange}
                                        placeholder="Enter resolution details"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Any URLs</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="workProof"
                                        value={statusData.workProof}
                                        onChange={handleStatusChange}
                                        placeholder="e.g., https://drive.google.com/file/123"
                                    />
                                    <Form.Text className="text-muted">
                                        Separate multiple URLs with comma
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? <Spinner animation="border" size="sm" /> : 'Update Status'}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate('/admin/dpr')}
                                    >
                                        ← Back
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column - Status History */}
                <Col lg={7}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">
                            <h5 className="mb-0">📜 Status History ({statusHistory.length})</h5>
                        </Card.Header>
                        <Card.Body>
                            {statusHistory.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <p>No status updates yet.</p>
                                    <small>Update the status using the form on the left.</small>
                                </div>
                            ) : (
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {statusHistory.map((status, index) => (
                                        <Card key={status._id} className="mb-3 border-start border-4" 
                                            style={{ borderColor: getStatusBadgeVariant(status.taskStatus) }}>
                                            <Card.Body className="py-2">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <Badge bg={getStatusBadgeVariant(status.taskStatus)}>
                                                            {status.taskStatus}
                                                        </Badge>
                                                        <span className="ms-2 text-muted small">
                                                            #{statusHistory.length - index}
                                                        </span>
                                                    </div>
                                                    <small className="text-muted">
                                                        {formatDate(status.statusUpdatedAt)}
                                                    </small>
                                                </div>
                                                
                                                {status.performedHow && (
                                                    <div className="mt-2">
                                                        <strong>Performed:</strong> {status.performedHow}
                                                    </div>
                                                )}
                                                
                                                <div className="row mt-1">
                                                    {status.toolsUsed?.length > 0 && (
                                                        <div className="col-6">
                                                            <small className="text-muted">
                                                                <strong>Tools:</strong> {status.toolsUsed.join(', ')}
                                                            </small>
                                                        </div>
                                                    )}
                                                    {status.actualTimeTaken > 0 && (
                                                        <div className="col-6">
                                                            <small className="text-muted">
                                                                <strong>Time:</strong> {status.actualTimeTaken}h
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {status.challengesFaced && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            <strong>Challenges:</strong> {status.challengesFaced}
                                                        </small>
                                                    </div>
                                                )}
                                                
                                                {status.challengesResolution && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            <strong>Resolution:</strong> {status.challengesResolution}
                                                        </small>
                                                    </div>
                                                )}
                                                
                                                {status.supportRequired && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            <strong>Support:</strong> {status.supportRequired}
                                                        </small>
                                                    </div>
                                                )}
                                                
                                                {status.workProof?.length > 0 && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            <strong>URLs:</strong> {status.workProof.join(', ')}
                                                        </small>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DPRStatus;