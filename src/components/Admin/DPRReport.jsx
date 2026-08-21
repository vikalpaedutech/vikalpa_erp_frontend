// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom"; // 🔥 Added
// import { UserContext } from "../contextAPIs/User.context";
// import { getReportData } from "../../service/DPR/DPR.services";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

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
//     Spinner
// } from 'react-bootstrap';

// import 'bootstrap/dist/css/bootstrap.min.css';

// const TASK_STATUS_OPTIONS = [
//     { value: '', label: 'All' },
//     { value: 'Pending', label: 'Pending' },
//     { value: 'Working', label: 'Working' },
//     { value: 'Completed', label: 'Completed' },
//     { value: 'Blocked', label: 'Blocked' },
//     { value: 'On-Hold', label: 'On-Hold' }
// ];

// export const DPRReport = () => {
//     const navigate = useNavigate(); // 🔥 Added
//     const { userData } = useContext(UserContext);
//     const userId = userData?._id || userData?.unqObjectId || userData?.userId || '';

//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const [filters, setFilters] = useState({
//         taskStatus: '',
//         startDate: '',
//         endDate: '',
//         isDeadlineCrossed: ''
//     });

//     const fetchReportData = async () => {
//         if (!userId) {
//             setError('User not authenticated');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const params = {
//                 unqUserObjectId: userId,
//                 ...(filters.taskStatus && { taskStatus: filters.taskStatus }),
//                 ...(filters.startDate && { startDate: filters.startDate }),
//                 ...(filters.endDate && { endDate: filters.endDate }),
//                 ...(filters.isDeadlineCrossed && { isDeadlineCrossed: filters.isDeadlineCrossed === 'true' })
//             };

//             const response = await getReportData(params);
            
//             if (response?.status === 'ok') {
//                 setTasks(response.data || []);
//                 setSuccess(`Found ${response.data?.length || 0} tasks`);
//             } else {
//                 setError(response?.message || 'Failed to fetch report data');
//             }
//         } catch (error) {
//             setError(error.message || 'Failed to fetch report data');
//             console.error('Fetch Report Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ============================================
//     // EXPORT TO PDF - FIXED
//     // ============================================
//     // ============================================
// // EXPORT TO PDF - WITH STATUS HISTORY
// // ============================================
// const exportToPDF = () => {
//     if (tasks.length === 0) {
//         setError('No data to export. Please apply filters and fetch data first.');
//         return;
//     }

//     try {
//         const doc = new jsPDF({
//             orientation: 'landscape',
//             unit: 'mm',
//             format: 'a4',
//             putOnlyUsedFonts: true,
//             floatPrecision: 16
//         });

//         const pageWidth = doc.internal.pageSize.getWidth();
//         const margin = 15;
//         let y = margin;

//         // HEADER
//         doc.setFontSize(20);
//         doc.setTextColor(33, 37, 41);
//         doc.setFont('helvetica', 'bold');
//         doc.text('Daily Work Report', pageWidth / 2, y, { align: 'center' });
//         y += 8;

//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(100, 100, 100);
//         doc.text('Employee Self Report', pageWidth / 2, y, { align: 'center' });
//         y += 10;

//         doc.setDrawColor(200, 200, 200);
//         doc.line(margin, y, pageWidth - margin, y);
//         y += 8;

//         // USER INFO - 2 Columns
//         doc.setFontSize(9);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(60, 60, 60);

//         const userInfo = [
//             { label: 'Name', value: userData?.name || 'N/A' },
//             { label: 'Department', value: userData?.department || 'N/A' },
//             { label: 'Role', value: userData?.role || 'N/A' },
//             { label: 'Email', value: userData?.email || 'N/A' },
//             { label: 'Report Period', value: `${filters.startDate || 'Start'} to ${filters.endDate || 'End'}` },
//             { label: 'Generated On', value: new Date().toLocaleString() },
//             { label: 'Total Tasks', value: tasks.length.toString() }
//         ];

//         const colWidth = (pageWidth - 2 * margin) / 2;
//         userInfo.forEach((info, index) => {
//             const col = index % 2;
//             const row = Math.floor(index / 2);
//             const x = margin + (col * colWidth);
//             const yPos = y + (row * 6);
            
//             if (yPos > 250) {
//                 doc.addPage();
//                 y = margin;
//             }
//             doc.setFont('helvetica', 'bold');
//             doc.text(`${info.label}:`, x, yPos);
//             doc.setFont('helvetica', 'normal');
//             doc.text(info.value, x + 30, yPos);
//         });

//         y += Math.ceil(userInfo.length / 2) * 6 + 8;

//         doc.line(margin, y, pageWidth - margin, y);
//         y += 8;

//         // ============================================
//         // TASKS TABLE - WITH STATUS HISTORY COUNT
//         // ============================================
//         const tableData = tasks.map((task, index) => {
//             // 🔥 Get status history from task (now included)
//             const statusHistory = task.statusHistory || [];
//             const statusCount = statusHistory.length;
            
//             return [
//                 index + 1,
//                 task.task || 'N/A',
//                 task.taskAssignedBy || 'N/A',
//                 task.taskStatus || 'N/A',
//                 task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A',
//                 task.endDate ? new Date(task.endDate).toLocaleDateString() : 'In Progress',
//                 task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'N/A',
//                 task.taskStatus === 'Completed' ? `${task.totalHoursTakenToFinishTask || 0}h / ${task.totalDaysTakenToFinishTask || 0}d` : '—',
//                 statusCount > 0 ? `${statusCount}` : '0'
//             ];
//         });

//         const headers = [
//             ['#', 'Task Title', 'Assigned By', 'Status', 'Start Date', 'End Date', 'Deadline', 'Time Taken', 'Updates']
//         ];

//         doc.autoTable({
//             head: headers,
//             body: tableData,
//             startY: y,
//             margin: { left: margin, right: margin },
//             styles: {
//                 fontSize: 7,
//                 cellPadding: 1.5,
//                 lineColor: [200, 200, 200],
//                 lineWidth: 0.1,
//                 font: 'helvetica'
//             },
//             headStyles: {
//                 fillColor: [52, 73, 94],
//                 textColor: [255, 255, 255],
//                 fontSize: 7,
//                 fontStyle: 'bold',
//                 halign: 'center'
//             },
//             bodyStyles: {
//                 halign: 'left'
//             },
//             columnStyles: {
//                 0: { cellWidth: 8, halign: 'center' },
//                 1: { cellWidth: 45, halign: 'left' },
//                 2: { cellWidth: 25, halign: 'left' },
//                 3: { cellWidth: 22, halign: 'center' },
//                 4: { cellWidth: 22, halign: 'center' },
//                 5: { cellWidth: 22, halign: 'center' },
//                 6: { cellWidth: 22, halign: 'center' },
//                 7: { cellWidth: 28, halign: 'center' },
//                 8: { cellWidth: 18, halign: 'center' }
//             },
//             didDrawPage: function(data) {
//                 const pageHeight = doc.internal.pageSize.getHeight();
//                 doc.setFontSize(7);
//                 doc.setTextColor(150, 150, 150);
//                 doc.setFont('helvetica', 'normal');
//                 doc.text(
//                     `Generated on: ${new Date().toLocaleString()} | Page ${data.pageNumber}`,
//                     pageWidth / 2,
//                     pageHeight - 5,
//                     { align: 'center' }
//                 );
//             }
//         });

//         // ============================================
//         // ADD STATUS HISTORY FOR EACH TASK (NEW PAGE)
//         // ============================================
//         tasks.forEach((task, index) => {
//             const statusHistory = task.statusHistory || [];
            
//             if (statusHistory.length > 0) {
//                 doc.addPage();
//                 y = margin;

//                 // Task Header
//                 doc.setFontSize(12);
//                 doc.setFont('helvetica', 'bold');
//                 doc.setTextColor(33, 37, 41);
//                 doc.text(`📌 Task #${index + 1}: ${task.task || 'N/A'}`, margin, y);
//                 y += 8;

//                 doc.setFontSize(9);
//                 doc.setFont('helvetica', 'normal');
//                 doc.setTextColor(80, 80, 80);
//                 doc.text(`Assigned By: ${task.taskAssignedBy || 'N/A'} | Status: ${task.taskStatus || 'N/A'}`, margin, y);
//                 y += 8;

//                 doc.setDrawColor(200, 200, 200);
//                 doc.line(margin, y, pageWidth - margin, y);
//                 y += 8;

//                 // Status History Table
//                 const historyData = statusHistory.map((status, idx) => {
//                     return [
//                         idx + 1,
//                         status.taskStatus || 'N/A',
//                         status.performedHow || '—',
//                         status.toolsUsed?.join(', ') || '—',
//                         status.actualTimeTaken ? `${status.actualTimeTaken}h` : '—',
//                         status.challengesFaced || '—',
//                         status.challengesResolution || '—',
//                         status.statusUpdatedAt ? new Date(status.statusUpdatedAt).toLocaleString() : 'N/A'
//                     ];
//                 });

//                 const historyHeaders = [
//                     ['#', 'Status', 'Performed How', 'Tools Used', 'Time', 'Challenges', 'Resolution', 'Updated At']
//                 ];

//                 doc.autoTable({
//                     head: historyHeaders,
//                     body: historyData,
//                     startY: y,
//                     margin: { left: margin, right: margin },
//                     styles: {
//                         fontSize: 6.5,
//                         cellPadding: 1.5,
//                         lineColor: [200, 200, 200],
//                         lineWidth: 0.1,
//                         font: 'helvetica'
//                     },
//                     headStyles: {
//                         fillColor: [52, 73, 94],
//                         textColor: [255, 255, 255],
//                         fontSize: 6.5,
//                         fontStyle: 'bold',
//                         halign: 'center'
//                     },
//                     bodyStyles: {
//                         halign: 'left'
//                     },
//                     columnStyles: {
//                         0: { cellWidth: 6, halign: 'center' },
//                         1: { cellWidth: 18, halign: 'center' },
//                         2: { cellWidth: 30, halign: 'left' },
//                         3: { cellWidth: 25, halign: 'left' },
//                         4: { cellWidth: 12, halign: 'center' },
//                         5: { cellWidth: 30, halign: 'left' },
//                         6: { cellWidth: 30, halign: 'left' },
//                         7: { cellWidth: 30, halign: 'center' }
//                     },
//                     didDrawPage: function(data) {
//                         const pageHeight = doc.internal.pageSize.getHeight();
//                         doc.setFontSize(7);
//                         doc.setTextColor(150, 150, 150);
//                         doc.setFont('helvetica', 'normal');
//                         doc.text(
//                             `Status History for: ${task.task || 'N/A'} | Page ${data.pageNumber}`,
//                             pageWidth / 2,
//                             pageHeight - 5,
//                             { align: 'center' }
//                         );
//                     }
//                 });
//             }
//         });

//         const fileName = `Daily_Work_Report_${userData?.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`;
//         doc.save(fileName);
//         setSuccess('PDF exported successfully! ✅');

//     } catch (error) {
//         console.error('PDF Export Error:', error);
//         setError('Failed to export PDF: ' + error.message);
//     }
// };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const getStatusBadgeVariant = (status) => {
//         const variants = {
//             'Pending': 'secondary',
//             'Working': 'warning',
//             'Completed': 'success',
//             'Blocked': 'danger',
//             'On-Hold': 'info'
//         };
//         return variants[status] || 'secondary';
//     };

//     useEffect(() => {
//         if (userId) {
//             fetchReportData();
//         }
//     }, [userId, filters]);

//     return (
//         <Container fluid className="py-4">
//             {/* 🔥 Navigation Link - Added */}
//             <Row className="mb-3">
//                 <Col>
//                     <Button 
//                         variant="outline-primary" 
//                         size="sm"
//                         onClick={() => navigate('/daily-work-report')}
//                         className="d-inline-flex align-items-center gap-1"
//                     >
//                         <span>←</span> Back to Daily Work Report
//                     </Button>
//                 </Col>
//             </Row>

//             <Row className="mb-4">
//                 <Col>
//                     <h1 className="display-5 fw-bold">📊 Daily Work Report</h1>
//                     <p className="text-muted">View and export your work report as PDF</p>
//                 </Col>
//             </Row>

//             <Row className="mb-4">
//                 <Col md={12}>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Row>
//                                 <Col md={3}>
//                                     <small className="text-muted">Name</small>
//                                     <p className="fw-semibold">{userData?.name || 'N/A'}</p>
//                                 </Col>
//                                 <Col md={3}>
//                                     <small className="text-muted">Department</small>
//                                     <p className="fw-semibold">{userData?.department || 'N/A'}</p>
//                                 </Col>
//                                 <Col md={3}>
//                                     <small className="text-muted">Role</small>
//                                     <p className="fw-semibold">{userData?.role || 'N/A'}</p>
//                                 </Col>
//                                 <Col md={3}>
//                                     <small className="text-muted">Total Tasks</small>
//                                     <p className="fw-semibold">{tasks.length}</p>
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

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
//                     <div className="mt-3 d-flex gap-2">
//                         <Button 
//                             variant="primary" 
//                             onClick={fetchReportData}
//                             disabled={loading}
//                         >
//                             {loading ? <Spinner animation="border" size="sm" /> : '🔄 Refresh Data'}
//                         </Button>
//                         <Button 
//                             variant="success" 
//                             onClick={exportToPDF}
//                             disabled={loading || tasks.length === 0}
//                         >
//                             📄 Export PDF
//                         </Button>
//                     </div>
//                 </Card.Body>
//             </Card>

//             <Card className="shadow-sm">
//                 <Card.Body>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="fw-semibold mb-0">📋 Tasks ({tasks.length})</h5>
//                         {loading && <Spinner animation="border" size="sm" />}
//                     </div>
                    
//                     {tasks.length === 0 ? (
//                         <div className="text-center py-4 text-muted">
//                             {loading ? 'Loading tasks...' : 'No tasks found for the selected filters'}
//                         </div>
//                     ) : (
//                         <div className="table-responsive">
//                             <Table responsive striped hover>
//                                 <thead>
//                                     <tr>
//                                         <th>#</th>
//                                         <th>Task Title</th>
//                                         <th>Assigned By</th>
//                                         <th>Status</th>
//                                         <th>Start Date</th>
//                                         <th>End Date</th>
//                                         <th>Deadline</th>
//                                         <th>Time</th>
//                                         <th>Updates</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {tasks.map((task, index) => {
//                                         const statusHistory = task.statusHistory || [];
//                                         return (
//                                             <tr key={task._id}>
//                                                 <td>{index + 1}</td>
//                                                 <td>
//                                                     <div className="text-truncate" style={{ maxWidth: '150px' }} title={task.task}>
//                                                         {task.task}
//                                                     </div>
//                                                 </td>
//                                                 <td>{task.taskAssignedBy}</td>
//                                                 <td>
//                                                     <Badge bg={getStatusBadgeVariant(task.taskStatus)}>
//                                                         {task.taskStatus}
//                                                     </Badge>
//                                                 </td>
//                                                 <td>{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</td>
//                                                 <td>{task.endDate ? new Date(task.endDate).toLocaleDateString() : '⏳'}</td>
//                                                 <td>{task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'N/A'}</td>
//                                                 <td>
//                                                     {task.taskStatus === 'Completed' ? (
//                                                         <div>
//                                                             <span className="badge bg-info">{task.totalHoursTakenToFinishTask || 0}h</span>
//                                                             <span className="badge bg-secondary ms-1">{task.totalDaysTakenToFinishTask || 0}d</span>
//                                                         </div>
//                                                     ) : '—'}
//                                                 </td>
//                                                 <td>
//                                                     <span className="badge bg-primary">{statusHistory.length}</span>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </Table>
//                         </div>
//                     )}
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };

// export default DPRReport;












import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import { getReportData } from "../../service/DPR/DPR.services";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
    Spinner
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const TASK_STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Working', label: 'Working' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Blocked', label: 'Blocked' },
    { value: 'On-Hold', label: 'On-Hold' }
];

export const DPRReport = () => {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const userId = userData?._id || userData?.unqObjectId || userData?.userId || '';

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [filters, setFilters] = useState({
        taskStatus: '',
        startDate: '',
        endDate: '',
        isDeadlineCrossed: ''
    });

    const fetchReportData = async () => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const params = {
                unqUserObjectId: userId,
                ...(filters.taskStatus && { taskStatus: filters.taskStatus }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                ...(filters.isDeadlineCrossed && { isDeadlineCrossed: filters.isDeadlineCrossed === 'true' })
            };

            const response = await getReportData(params);
            
            if (response?.status === 'ok') {
                setTasks(response.data || []);
                setSuccess(`Found ${response.data?.length || 0} tasks`);
            } else {
                setError(response?.message || 'Failed to fetch report data');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch report data');
            console.error('Fetch Report Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // EXPORT TO PDF - FIXED TABLE
    // ============================================
    const exportToPDF = () => {
        if (tasks.length === 0) {
            setError('No data to export. Please apply filters and fetch data first.');
            return;
        }

        try {
            const doc = new jsPDF({
                orientation: 'landscape', // 🔥 Landscape mode for more width
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            let y = margin;

            // ============================================
            // HEADER
            // ============================================
            
            doc.setFontSize(22);
            doc.setTextColor(33, 37, 41);
            doc.setFont('helvetica', 'bold');
            doc.text('Daily Work Report', pageWidth / 2, y, { align: 'center' });
            y += 8;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text('Employee Self Report', pageWidth / 2, y, { align: 'center' });
            y += 12;

            doc.setDrawColor(200, 200, 200);
            doc.line(margin, y, pageWidth - margin, y);
            y += 10;

            // ============================================
            // USER INFO - 2 Columns Layout
            // ============================================
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);

            const leftX = margin;
            const rightX = pageWidth / 2 + 5;

            const leftInfo = [
                { label: 'Name', value: userData?.name || 'N/A' },
                { label: 'Department', value: userData?.department || 'N/A' },
                { label: 'Role', value: userData?.role || 'N/A' },
                { label: 'Report Period', value: `${filters.startDate || 'Start'} to ${filters.endDate || 'End'}` }
            ];

            const rightInfo = [
                { label: 'Email', value: userData?.email || 'N/A' },
                { label: 'Generated On', value: new Date().toLocaleString() },
                { label: 'Total Tasks', value: tasks.length.toString() }
            ];

            leftInfo.forEach((info, index) => {
                const yPos = y + (index * 7);
                doc.setFont('helvetica', 'bold');
                doc.text(`${info.label}:`, leftX, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(info.value, leftX + 30, yPos);
            });

            rightInfo.forEach((info, index) => {
                const yPos = y + (index * 7);
                doc.setFont('helvetica', 'bold');
                doc.text(`${info.label}:`, rightX, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(info.value, rightX + 32, yPos);
            });

            y += Math.max(leftInfo.length, rightInfo.length) * 7 + 8;

            doc.line(margin, y, pageWidth - margin, y);
            y += 10;

            // ============================================
            // TASKS SUMMARY TABLE - FIXED COLUMN WIDTHS
            // ============================================
            const summaryData = tasks.map((task, index) => {
                const statusCount = task.statusHistory?.length || 0;
                
                return [
                    index + 1,
                    task.task || 'N/A',
                    task.taskAssignedBy || 'N/A',
                    task.taskStatus || 'N/A',
                    task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A',
                    task.endDate ? new Date(task.endDate).toLocaleDateString() : 'In Progress',
                    task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'N/A',
                    task.taskStatus === 'Completed' ? `${task.totalHoursTakenToFinishTask || 0}h` : '—',
                    statusCount > 0 ? `${statusCount}` : '0'
                ];
            });

            const summaryHeaders = [
                ['#', 'Task Title', 'Assigned By', 'Status', 'Start', 'End', 'Deadline', 'Time', 'Updates']
            ];

            doc.autoTable({
                head: summaryHeaders,
                body: summaryData,
                startY: y,
                margin: { left: margin, right: margin },
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1,
                    font: 'helvetica'
                },
                headStyles: {
                    fillColor: [52, 73, 94],
                    textColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: {
                    halign: 'left'
                },
                columnStyles: {
                    0: { cellWidth: 8, halign: 'center' },
                    1: { cellWidth: 50, halign: 'left' },
                    2: { cellWidth: 28, halign: 'left' },
                    3: { cellWidth: 22, halign: 'center' },
                    4: { cellWidth: 22, halign: 'center' },
                    5: { cellWidth: 22, halign: 'center' },
                    6: { cellWidth: 22, halign: 'center' },
                    7: { cellWidth: 22, halign: 'center' },
                    8: { cellWidth: 18, halign: 'center' }
                },
                didDrawPage: function(data) {
                    const pageHeight = doc.internal.pageSize.getHeight();
                    doc.setFontSize(7);
                    doc.setTextColor(150, 150, 150);
                    doc.setFont('helvetica', 'normal');
                    doc.text(
                        `Generated on: ${new Date().toLocaleString()} | Page ${data.pageNumber}`,
                        pageWidth / 2,
                        pageHeight - 5,
                        { align: 'center' }
                    );
                }
            });

            // ============================================
            // DETAILED TASK SECTIONS
            // ============================================
            tasks.forEach((task, index) => {
                const statusHistory = task.statusHistory || [];
                
                doc.addPage();
                y = margin;

                // Task Header
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(33, 37, 41);
                doc.text(`${index + 1}. ${task.task || 'N/A'}`, margin, y);
                y += 8;

                doc.setDrawColor(200, 200, 200);
                doc.line(margin, y, pageWidth - margin, y);
                y += 8;

                // Task Details - 2 Columns
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);

                const taskLeftInfo = [
                    { label: 'Assigned By', value: task.taskAssignedBy || 'N/A' },
                    { label: 'Status', value: task.taskStatus || 'N/A' },
                    { label: 'Start Date', value: task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A' }
                ];

                const taskRightInfo = [
                    { label: 'End Date', value: task.endDate ? new Date(task.endDate).toLocaleDateString() : 'In Progress' },
                    { label: 'Deadline', value: task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'N/A' },
                    { label: 'Time Taken', value: task.taskStatus === 'Completed' ? `${task.totalHoursTakenToFinishTask || 0}h` : '—' }
                ];

                taskLeftInfo.forEach((info, idx) => {
                    const yPos = y + (idx * 6);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${info.label}:`, margin, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.text(info.value, margin + 28, yPos);
                });

                const rightX = pageWidth / 2 + 5;
                taskRightInfo.forEach((info, idx) => {
                    const yPos = y + (idx * 6);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${info.label}:`, rightX, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.text(info.value, rightX + 28, yPos);
                });

                y += Math.max(taskLeftInfo.length, taskRightInfo.length) * 6 + 8;

                doc.line(margin, y, pageWidth - margin, y);
                y += 8;

                // Challenges & Resolution (if completed)
                if (task.taskStatus === 'Completed') {
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(60, 60, 60);
                    doc.text('Challenges Faced:', margin, y);
                    y += 5;
                    doc.setFont('helvetica', 'normal');
                    const challenges = doc.splitTextToSize(task.challengesFaceOnTask || 'N/A', pageWidth - 2 * margin);
                    doc.text(challenges, margin, y);
                    y += (challenges.length * 4) + 4;

                    doc.setFont('helvetica', 'bold');
                    doc.text('How Challenge Resolved:', margin, y);
                    y += 5;
                    doc.setFont('helvetica', 'normal');
                    const resolution = doc.splitTextToSize(task.howChallengeResolved || 'N/A', pageWidth - 2 * margin);
                    doc.text(resolution, margin, y);
                    y += (resolution.length * 4) + 8;

                    doc.line(margin, y, pageWidth - margin, y);
                    y += 8;
                }

                // Status History Table
                if (statusHistory.length > 0) {
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(33, 37, 41);
                    doc.text('Status History', margin, y);
                    y += 6;

                    const historyData = statusHistory.map((status, idx) => {
                        return [
                            idx + 1,
                            status.taskStatus || 'N/A',
                            status.performedHow || '—',
                            status.toolsUsed?.join(', ') || '—',
                            status.actualTimeTaken ? `${status.actualTimeTaken}h` : '—',
                            status.challengesFaced || '—',
                            status.challengesResolution || '—',
                            status.statusUpdatedAt ? new Date(status.statusUpdatedAt).toLocaleString() : 'N/A'
                        ];
                    });

                    const historyHeaders = [
                        ['#', 'Status', 'Performed How', 'Tools', 'Time', 'Challenges', 'Resolution', 'Updated At']
                    ];

                    doc.autoTable({
                        head: historyHeaders,
                        body: historyData,
                        startY: y,
                        margin: { left: margin, right: margin },
                        styles: {
                            fontSize: 7,
                            cellPadding: 1.5,
                            lineColor: [200, 200, 200],
                            lineWidth: 0.1,
                            font: 'helvetica'
                        },
                        headStyles: {
                            fillColor: [52, 73, 94],
                            textColor: [255, 255, 255],
                            fontSize: 7,
                            fontStyle: 'bold',
                            halign: 'center'
                        },
                        bodyStyles: {
                            halign: 'left'
                        },
                        columnStyles: {
                            0: { cellWidth: 6, halign: 'center' },
                            1: { cellWidth: 18, halign: 'center' },
                            2: { cellWidth: 32, halign: 'left' },
                            3: { cellWidth: 24, halign: 'left' },
                            4: { cellWidth: 12, halign: 'center' },
                            5: { cellWidth: 28, halign: 'left' },
                            6: { cellWidth: 28, halign: 'left' },
                            7: { cellWidth: 30, halign: 'center' }
                        },
                        didDrawPage: function(data) {
                            const pageHeight = doc.internal.pageSize.getHeight();
                            doc.setFontSize(7);
                            doc.setTextColor(150, 150, 150);
                            doc.setFont('helvetica', 'normal');
                            doc.text(
                                `Task: ${task.task || 'N/A'} | Page ${data.pageNumber}`,
                                pageWidth / 2,
                                pageHeight - 5,
                                { align: 'center' }
                            );
                        }
                    });
                } else {
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'italic');
                    doc.setTextColor(150, 150, 150);
                    doc.text('No status updates yet for this task.', margin, y);
                }
            });

            const fileName = `Daily_Work_Report_${userData?.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            setSuccess('PDF exported successfully! ✅');

        } catch (error) {
            console.error('PDF Export Error:', error);
            setError('Failed to export PDF: ' + error.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'Pending': 'secondary',
            'Working': 'warning',
            'Completed': 'success',
            'Blocked': 'danger',
            'On-Hold': 'info'
        };
        return variants[status] || 'secondary';
    };

    useEffect(() => {
        if (userId) {
            fetchReportData();
        }
    }, [userId, filters]);

    return (
        <Container fluid className="py-4">
            <Row className="mb-3">
                <Col>
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate('/daily-work-report')}
                        className="d-inline-flex align-items-center gap-1"
                    >
                        <span>←</span> Back to Daily Work Report
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <h1 className="display-5 fw-bold">📊 Daily Work Report</h1>
                    <p className="text-muted">View and export your work report as PDF</p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <small className="text-muted">Name</small>
                                    <p className="fw-semibold">{userData?.name || 'N/A'}</p>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted">Department</small>
                                    <p className="fw-semibold">{userData?.department || 'N/A'}</p>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted">Role</small>
                                    <p className="fw-semibold">{userData?.role || 'N/A'}</p>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted">Total Tasks</small>
                                    <p className="fw-semibold">{tasks.length}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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
                    <div className="mt-3 d-flex gap-2">
                        <Button 
                            variant="primary" 
                            onClick={fetchReportData}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : '🔄 Refresh Data'}
                        </Button>
                        <Button 
                            variant="success" 
                            onClick={exportToPDF}
                            disabled={loading || tasks.length === 0}
                        >
                            📄 Export PDF
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold mb-0">📋 Tasks ({tasks.length})</h5>
                        {loading && <Spinner animation="border" size="sm" />}
                    </div>
                    
                    {tasks.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            {loading ? 'Loading tasks...' : 'No tasks found for the selected filters'}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Task Title</th>
                                        <th>Assigned By</th>
                                        <th>Status</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Deadline</th>
                                        <th>Time</th>
                                        <th>Updates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => {
                                        const statusHistory = task.statusHistory || [];
                                        return (
                                            <tr key={task._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '150px' }} title={task.task}>
                                                        {task.task}
                                                    </div>
                                                </td>
                                                <td>{task.taskAssignedBy}</td>
                                                <td>
                                                    <Badge bg={getStatusBadgeVariant(task.taskStatus)}>
                                                        {task.taskStatus}
                                                    </Badge>
                                                </td>
                                                <td>{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</td>
                                                <td>{task.endDate ? new Date(task.endDate).toLocaleDateString() : '⏳'}</td>
                                                <td>{task.taskDeadline ? new Date(task.taskDeadline).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    {task.taskStatus === 'Completed' ? (
                                                        <div>
                                                            <span className="badge bg-info">{task.totalHoursTakenToFinishTask || 0}h</span>
                                                            <span className="badge bg-secondary ms-1">{task.totalDaysTakenToFinishTask || 0}d</span>
                                                        </div>
                                                    ) : '—'}
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{statusHistory.length}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DPRReport;