// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { GetBillsForVerification } from "../../service/Bills.services.js";


// export const BillsVerificationV2 = () =>{
//   const { userData } = useContext(UserContext);
//   const { 
//     startDate, 
//     setStartDate,
//     endDate, 
//     setEndDate,
//     dateRange,
//     setDateRange
//   } = useContext(DateNDateRangeContext);

//   console.log(userData)

//   console.log(startDate, endDate)
//     return(
//         <>
//         hello bills verification
//         <DateNDateRangePicker/>
//         </>
//     )
// }





// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { GetBillsForVerification, BillsVerification } from "../../service/Bills.services.js";
// import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal, Accordion } from "react-bootstrap";
// import { 
//   FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaRupeeSign, 
//   FaCalendarAlt, FaUser, FaFilePdf, FaFileImage, FaDownload,
//   FaMapMarkerAlt, FaUtensils, FaHotel, FaBox, FaComment, FaCheck, 
//   FaTimes, FaInfoCircle, FaFilter, FaSyncAlt
// } from "react-icons/fa";

// export const BillsVerificationV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { 
//     startDate, 
//     setStartDate,
//     endDate, 
//     setEndDate,
//     dateRange,
//     setDateRange
//   } = useContext(DateNDateRangeContext);

//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [filterStatus, setFilterStatus] = useState("Pending");
//   const [summary, setSummary] = useState({});
//   const [verifierInfo, setVerifierInfo] = useState({});
//   const [verifyingBillId, setVerifyingBillId] = useState(null);
//   const [verificationComment, setVerificationComment] = useState("");
//   const [verificationAction, setVerificationAction] = useState("");

//   // Set default date range to previous 30 days
//   useEffect(() => {
//     const today = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(today.getDate() - 30);
    
//     const formatDate = (date) => {
//       return {
//         YYYYMMDD: date.toISOString().split('T')[0],
//         DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
//         ISOformat: date.toISOString()
//       };
//     };
    
//     if (!startDate && !endDate) {
//       setStartDate(formatDate(thirtyDaysAgo));
//       setEndDate(formatDate(today));
//     }
//   }, []);

//   // Fetch bills for verification
//   const fetchBills = useCallback(async () => {
//     if (!userData?._id) {
//       console.log("No user ID available");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const reqBody = {
//         _id: userData._id,
//         startDate: startDate?.YYYYMMDD || startDate,
//         endDate: endDate?.YYYYMMDD || endDate,
//         status: filterStatus,
//         limit: itemsPerPage,
//         page: currentPage
//       };

//       console.log("Fetching bills for verification with:", reqBody);

//       const response = await GetBillsForVerification(reqBody);
      
//       if (response.status === "Success") {
//         setBills(response.data || []);
//         setSummary(response.summary || {});
//         setVerifierInfo(response.verifierInfo || {});
//       } else {
//         setError(response.message || "Failed to fetch bills");
//       }
//     } catch (err) {
//       console.error("Error fetching bills:", err);
//       setError("Failed to load bills. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userData?._id, startDate, endDate, filterStatus, currentPage, itemsPerPage]);

//   useEffect(() => {
//     if (startDate && endDate && userData?._id) {
//       fetchBills();
//     }
//   }, [startDate, endDate, userData?._id, filterStatus, currentPage, fetchBills]);

//   // Handle verification (Verify or Reject)
//   const handleVerification = async (bill, action) => {
//     setVerifyingBillId(bill._id);
//     setVerificationAction(action);
    
//     try {
//       const reqBody = {
//         _id: bill._id,
//         status: action === "verify" ? "Verified" : "Rejected",
//         verification: {
//           verifiedBy: userData?._id,
//           verifiedAt: new Date().toISOString(),
//           comments: verificationComment || `${action === "verify" ? "Bill verified successfully" : "Bill rejected"}`
//         }
//       };

//       const response = await BillsVerification(reqBody);
      
//       if (response.status === "Success") {
//         setSuccessMessage(`Bill ${action === "verify" ? "verified" : "rejected"} successfully!`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//         // Refresh bills list
//         fetchBills();
//         setShowModal(false);
//         setVerificationComment("");
//       } else {
//         setError(response.message || "Failed to update bill");
//         setTimeout(() => setError(""), 3000);
//       }
//     } catch (err) {
//       console.error("Error verifying bill:", err);
//       setError("Failed to update bill status");
//       setTimeout(() => setError(""), 3000);
//     } finally {
//       setVerifyingBillId(null);
//       setVerificationAction("");
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'Submitted': 'info',
//       'Pending': 'warning',
//       'Verified': 'success',
//       'Approved': 'primary',
//       'Rejected': 'danger',
//       'Paid': 'dark'
//     };
//     return statusColors[status] || 'secondary';
//   };

//   // Handle view bill details
//   const handleViewBill = (bill) => {
//     setSelectedBill(bill);
//     setVerificationComment("");
//     setShowModal(true);
//   };

//   // Statistics Cards in Accordion
//   const StatisticsAccordion = () => (
//     <Accordion defaultActiveKey="" className="mb-4">
//       <Accordion.Item eventKey="0">
//         <Accordion.Header>
//           <div className="d-flex align-items-center gap-2">
//             <FaInfoCircle className="text-primary" />
//             <strong>Verification Summary</strong>
//             <Badge bg="primary" className="ms-2">
//               {summary.totalBills || 0} Bills | {formatCurrency(summary.totalAmount || 0)}
//             </Badge>
//           </div>
//         </Accordion.Header>
//         <Accordion.Body>
//           <Row className="g-3">
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-primary text-white">
//                 <Card.Body className="text-center">
//                   <h3 className="mb-0">{summary.totalBills || 0}</h3>
//                   <small>Total Bills</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-success text-white">
//                 <Card.Body className="text-center">
//                   <h3 className="mb-0">{summary.statusBreakdown?.Verified || 0}</h3>
//                   <small>Verified</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-danger text-white">
//                 <Card.Body className="text-center">
//                   <h3 className="mb-0">{summary.statusBreakdown?.Rejected || 0}</h3>
//                   <small>Rejected</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-warning text-dark">
//                 <Card.Body className="text-center">
//                   <h3 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h3>
//                   <small>Pending</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//           <div className="mt-3 text-muted small">
//             <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools?.length || 0}
//           </div>
//         </Accordion.Body>
//       </Accordion.Item>
//     </Accordion>
//   );

//   // Table View
//   const TableView = () => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="align-middle">
//         <thead className="bg-light">
//           <tr>
//             <th>#</th>
//             <th>Date</th>
//             <th>Submitted By</th>
//             <th>Purpose</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bills.length > 0 ? (
//             bills.map((bill, index) => (
//               <tr key={bill._id}>
//                 <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                 <td>{formatDate(bill.expenseDate)}</td>
//                 <td>
//                   <div className="fw-semibold">{bill.submitterDetails?.name || bill.userId}</div>
//                   <small className="text-muted">{bill.submitterDetails?.role || bill.role}</small>
//                 </td>
//                 <td>{bill.purposeOfExpense}</td>
//                 <td><Badge bg="secondary">{bill.expenseType}</Badge></td>
//                 <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
//                 <td><Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge></td>
//                 <td>
//                   <Button
//                     size="sm"
//                     variant="outline-primary"
//                     onClick={() => handleViewBill(bill)}
//                   >
//                     <FaEye /> Verify
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="text-center py-5 text-muted">
//                 No bills found for verification
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );

//   // Bill Details Modal for Verification
//   const BillVerificationModal = () => (
//     <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//       <Modal.Header closeButton className="bg-primary text-white">
//         <Modal.Title>
//           <FaFilePdf className="me-2" /> Verify Bill
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {selectedBill && (
//           <div>
//             {/* Bill Information */}
//             <Row className="mb-3">
//               <Col md={6}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Bill ID</small>
//                   <p className="mb-0 fw-semibold">{selectedBill._id}</p>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Status</small>
//                   <p className="mb-0">
//                     <Badge bg={getStatusBadge(selectedBill.status)}>{selectedBill.status}</Badge>
//                   </p>
//                 </div>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Expense Date</small>
//                   <p className="mb-0">{formatDate(selectedBill.expenseDate)}</p>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Amount</small>
//                   <p className="mb-0 text-success fw-bold">{formatCurrency(selectedBill.expenseAmount)}</p>
//                 </div>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Purpose</small>
//                   <p className="mb-0">{selectedBill.purposeOfExpense}</p>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Expense Type</small>
//                   <p className="mb-0">{selectedBill.expenseType}</p>
//                 </div>
//               </Col>
//             </Row>

//             {/* Submitter Information */}
//             <Row className="mb-3">
//               <Col md={12}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Submitted By</small>
//                   <p className="mb-0 fw-semibold">{selectedBill.submitterDetails?.name}</p>
//                   <small>ID: {selectedBill.submitterDetails?.userId} | Role: {selectedBill.submitterDetails?.role}</small>
//                 </div>
//               </Col>
//             </Row>

//             {/* Conditional Fields based on Expense Type */}
//             {selectedBill.expenseType === "Travel" && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Travel Details</small>
//                     <p className="mb-0">From: {selectedBill.travelFrom}</p>
//                     <p className="mb-0">To: {selectedBill.travelTo}</p>
//                     {selectedBill.travelledDistance && (
//                       <p className="mb-0">Distance: {selectedBill.travelledDistance} km</p>
//                     )}
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             {selectedBill.expenseType === "Food" && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Food Type</small>
//                     <p className="mb-0">{selectedBill.foodType}</p>
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             {selectedBill.expenseType === "Accommodation" && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Accommodation Details</small>
//                     <p className="mb-0">Check-in: {formatDate(selectedBill.accomodationDate)}</p>
//                     <p className="mb-0">Days Stayed: {selectedBill.stayedForDays}</p>
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             {selectedBill.descriptionExpense && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Description</small>
//                     <p className="mb-0">{selectedBill.descriptionExpense}</p>
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             {/* Receipt */}
//             {selectedBill.fileUrl && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Receipt</small>
//                     <div className="mt-2">
//                       <Button
//                         variant="primary"
//                         href={selectedBill.fileUrl}
//                         target="_blank"
//                         size="sm"
//                       >
//                         {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
//                       </Button>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             {/* Verification Comments */}
//             <Row className="mb-3">
//               <Col md={12}>
//                 <Form.Label className="fw-semibold">
//                   <FaComment className="me-2" /> Verification Comments
//                 </Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={verificationComment}
//                   onChange={(e) => setVerificationComment(e.target.value)}
//                   placeholder="Enter verification comments... (optional)"
//                 />
//               </Col>
//             </Row>
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => setShowModal(false)}>
//           Close
//         </Button>
//         <Button 
//           variant="danger" 
//           onClick={() => handleVerification(selectedBill, "reject")}
//           disabled={verifyingBillId === selectedBill?._id}
//         >
//           {verifyingBillId === selectedBill?._id && verificationAction === "reject" ? (
//             <Spinner size="sm" animation="border" />
//           ) : (
//             <><FaTimes className="me-2" /> Reject</>
//           )}
//         </Button>
//         <Button 
//           variant="success" 
//           onClick={() => handleVerification(selectedBill, "verify")}
//           disabled={verifyingBillId === selectedBill?._id}
//         >
//           {verifyingBillId === selectedBill?._id && verificationAction === "verify" ? (
//             <Spinner size="sm" animation="border" />
//           ) : (
//             <><FaCheck className="me-2" /> Verify & Approve</>
//           )}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   // Status filter options
//   const statusOptions = ["Pending", "Submitted", "Verified", "Approved", "Rejected", "Paid", "All"];

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Success Message */}
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           <FaCheckCircle className="me-2" /> {successMessage}
//         </Alert>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <FaTimesCircle className="me-2" /> {error}
//         </Alert>
//       )}

//       {/* Header */}
//       <Row className="mb-4">
//         <Col>
//           <h2 className="text-primary mb-2">🔍 Bills Verification</h2>
//           <p className="text-muted">Verify and approve bills submitted by users in your region</p>
//         </Col>
//       </Row>

//       {/* Filters Section */}
//       <Row className="mb-4 g-3">
//         <Col md={5}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaCalendarAlt className="me-2" /> Date Range
//               </Form.Label>
//               <DateNDateRangePicker />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaFilter className="me-2" /> Filter by Status
//               </Form.Label>
//               <div className="d-flex gap-2 flex-wrap">
//                 {statusOptions.map(status => (
//                   <Button
//                     key={status}
//                     variant={filterStatus === status ? "primary" : "outline-secondary"}
//                     size="sm"
//                     onClick={() => {
//                       setFilterStatus(status);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     {status}
//                   </Button>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaUser className="me-2" /> Verifier Info
//               </Form.Label>
//               <div className="small">
//                 <div className="fw-semibold">{userData?.name}</div>
//                 <div className="text-muted">Role: {userData?.role}</div>
//                 <div className="text-muted">Schools: {verifierInfo.accessibleSchools?.length || 0}</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Statistics */}
//       {!loading && bills.length > 0 && <StatisticsAccordion />}

//       {/* Refresh Button */}
//       <Row className="mb-3">
//         <Col className="text-end">
//           <Button 
//             variant="outline-primary" 
//             size="sm" 
//             onClick={fetchBills}
//             disabled={loading}
//           >
//             <FaSyncAlt className={loading ? "spin" : ""} /> Refresh
//           </Button>
//         </Col>
//       </Row>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3 text-muted">Loading bills for verification...</p>
//         </div>
//       )}

//       {/* Bills Table */}
//       {!loading && (
//         <>
//           <TableView />
          
//           {/* Pagination */}
//           {summary.totalBills > itemsPerPage && (
//             <div className="d-flex justify-content-center mt-4">
//               <Pagination>
//                 <Pagination.Prev 
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
//                   disabled={currentPage === 1}
//                 />
//                 {[...Array(Math.ceil(summary.totalBills / itemsPerPage)).keys()].map(number => (
//                   <Pagination.Item
//                     key={number + 1}
//                     active={number + 1 === currentPage}
//                     onClick={() => setCurrentPage(number + 1)}
//                   >
//                     {number + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next 
//                   onClick={() => setCurrentPage(prev => prev + 1)} 
//                   disabled={currentPage === Math.ceil(summary.totalBills / itemsPerPage)}
//                 />
//               </Pagination>
//             </div>
//           )}
//         </>
//       )}

//       {/* Bill Verification Modal */}
//       <BillVerificationModal />

//       <style>{`
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .table-responsive {
//           overflow-x: auto;
//         }
//         .table th, .table td {
//           vertical-align: middle;
//         }
//       `}</style>
//     </Container>
//   );
// };









// import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { GetBillsForVerification, BillsVerification } from "../../service/Bills.services.js";
// import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal, Accordion } from "react-bootstrap";
// import { 
//   FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaRupeeSign, 
//   FaCalendarAlt, FaUser, FaFilePdf, FaFileImage, FaDownload,
//   FaMapMarkerAlt, FaUtensils, FaHotel, FaBox, FaComment, FaCheck, 
//   FaTimes, FaInfoCircle, FaFilter, FaSyncAlt, FaUserTag
// } from "react-icons/fa";
// import Select from "react-select";

// // Memoized Bill Row Component
// const BillRow = memo(({ bill, index, currentPage, itemsPerPage, formatDate, formatCurrency, getStatusBadge, onVerify }) => {
//   return (
//     <tr>
//       <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//       <td>{formatDate(bill.expenseDate)}</td>
//       <td>
//         <div className="fw-semibold">{bill.submitterDetails?.name || bill.userId}</div>
//         <small className="text-muted">{bill.submitterDetails?.role || bill.role}</small>
//       </td>
//       <td>{bill.purposeOfExpense}</td>
//       <td><Badge bg="secondary">{bill.expenseType}</Badge></td>
//       <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
//       <td><Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge></td>
//       <td>
//         <Button size="sm" variant="outline-primary" onClick={() => onVerify(bill)}>
//           <FaEye /> Verify
//         </Button>
//       </td>
//     </tr>
//   );
// });

// // Memoized Statistics Accordion Component
// const StatisticsAccordion = memo(({ summary, verifierInfo, formatCurrency }) => (
//   <Accordion defaultActiveKey="" className="mb-4">
//     <Accordion.Item eventKey="0">
//       <Accordion.Header>
//         <div className="d-flex align-items-center gap-2">
//           <FaInfoCircle className="text-primary" />
//           <strong>Verification Summary</strong>
//           <Badge bg="primary" className="ms-2">
//             {summary.totalBills || 0} Bills | {formatCurrency(summary.totalAmount || 0)}
//           </Badge>
//         </div>
//       </Accordion.Header>
//       <Accordion.Body>
//         <Row className="g-3">
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-primary text-white">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.totalBills || 0}</h3>
//                 <small>Total Bills</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-success text-white">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.statusBreakdown?.Verified || 0}</h3>
//                 <small>Verified</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-danger text-white">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.statusBreakdown?.Rejected || 0}</h3>
//                 <small>Rejected</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-warning text-dark">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h3>
//                 <small>Pending</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//         <div className="mt-3 text-muted small">
//           <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools?.length || 0}
//         </div>
//       </Accordion.Body>
//     </Accordion.Item>
//   </Accordion>
// ));

// // Memoized Bill Details Component for Modal
// const BillDetailsContent = memo(({ selectedBill, formatDate, formatCurrency, getStatusBadge, verificationComment, onCommentChange }) => {
//   if (!selectedBill) return null;

//   return (
//     <div>
//       <Row className="mb-3">
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Bill ID</small>
//             <p className="mb-0 fw-semibold">{selectedBill._id}</p>
//           </div>
//         </Col>
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Status</small>
//             <p className="mb-0">
//               <Badge bg={getStatusBadge(selectedBill.status)}>{selectedBill.status}</Badge>
//             </p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Expense Date</small>
//             <p className="mb-0">{formatDate(selectedBill.expenseDate)}</p>
//           </div>
//         </Col>
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Amount</small>
//             <p className="mb-0 text-success fw-bold">{formatCurrency(selectedBill.expenseAmount)}</p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Purpose</small>
//             <p className="mb-0">{selectedBill.purposeOfExpense}</p>
//           </div>
//         </Col>
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Expense Type</small>
//             <p className="mb-0">{selectedBill.expenseType}</p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={12}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Submitted By</small>
//             <p className="mb-0 fw-semibold">{selectedBill.submitterDetails?.name}</p>
//             <small>ID: {selectedBill.submitterDetails?.userId} | Role: {selectedBill.submitterDetails?.role}</small>
//           </div>
//         </Col>
//       </Row>

//       {selectedBill.expenseType === "Travel" && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Travel Details</small>
//               <p className="mb-0">From: {selectedBill.travelFrom}</p>
//               <p className="mb-0">To: {selectedBill.travelTo}</p>
//               {selectedBill.travelledDistance && (
//                 <p className="mb-0">Distance: {selectedBill.travelledDistance} km</p>
//               )}
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.expenseType === "Food" && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Food Type</small>
//               <p className="mb-0">{selectedBill.foodType}</p>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.expenseType === "Accommodation" && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Accommodation Details</small>
//               <p className="mb-0">Check-in: {formatDate(selectedBill.accomodationDate)}</p>
//               <p className="mb-0">Days Stayed: {selectedBill.stayedForDays}</p>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.descriptionExpense && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Description</small>
//               <p className="mb-0">{selectedBill.descriptionExpense}</p>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.fileUrl && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Receipt</small>
//               <div className="mt-2">
//                 <Button variant="primary" href={selectedBill.fileUrl} target="_blank" size="sm">
//                   {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       )}

//       <Row className="mb-3">
//         <Col md={12}>
//           <Form.Label className="fw-semibold">
//             <FaComment className="me-2" /> Verification Comments
//           </Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
//             value={verificationComment}
//             onChange={(e) => onCommentChange(e.target.value)}
//             placeholder="Enter verification comments... (optional)"
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// });

// export const BillsVerificationV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { 
//     startDate, 
//     setStartDate,
//     endDate, 
//     setEndDate,
//     dateRange,
//     setDateRange
//   } = useContext(DateNDateRangeContext);

//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [filterStatus, setFilterStatus] = useState("Pending");
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [summary, setSummary] = useState({});
//   const [verifierInfo, setVerifierInfo] = useState({});
//   const [verifyingBillId, setVerifyingBillId] = useState(null);
//   const [verificationComment, setVerificationComment] = useState("");
//   const [verificationAction, setVerificationAction] = useState("");

//   // Get role options based on user's role
//   const getRoleOptions = useCallback(() => {
//     const userRole = userData?.role;
    
//     if (userRole === "Admin") {
//       return [
//         { value: "CC", label: "CC" },
//         { value: "ACI", label: "ACI" },
//         { value: "Community Manager", label: "Community Manager" }
//       ];
//     } else if (userRole === "Community Manager") {
//       return [
//         { value: "ACI", label: "ACI" },
//         { value: "CC", label: "CC" }
//       ];
//     } else if (userRole === "ACI") {
//       return [
//         { value: "CC", label: "CC" }
//       ];
//     }
//     return [];
//   }, [userData?.role]);

//   // Get default role to send based on user's role (when no filter selected)
//   const getDefaultRoleForAPI = useCallback(() => {
//     const userRole = userData?.role;
    
//     if (userRole === "Admin") {
//       return null; // Admin must select a role first
//     } else if (userRole === "Community Manager") {
//       return null; // Community Manager must select a role first
//     } else if (userRole === "ACI") {
//       return "CC"; // ACI sends CC by default
//     }
//     return null;
//   }, [userData?.role]);

//   // Set default date range to previous 30 days
//   useEffect(() => {
//     const today = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(today.getDate() - 30);
    
//     const formatDate = (date) => {
//       return {
//         YYYYMMDD: date.toISOString().split('T')[0],
//         DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
//         ISOformat: date.toISOString()
//       };
//     };
    
//     if (!startDate && !endDate) {
//       setStartDate(formatDate(thirtyDaysAgo));
//       setEndDate(formatDate(today));
//     }
//   }, []);

//   // Fetch bills for verification
//   const fetchBills = useCallback(async () => {
//     if (!userData?._id) {
//       console.log("No user ID available");
//       return;
//     }

//     // Determine role to send
//     let roleToSend = null;
    
//     if (selectedRole) {
//       // If a role is selected from dropdown, use that
//       roleToSend = selectedRole.value;
//     } else {
//       // Otherwise use default role based on user's role
//       roleToSend = getDefaultRoleForAPI();
//     }

//     // If no role to send (Admin/Community Manager without selection), don't fetch
//     if (!roleToSend) {
//       console.log("Please select a role to verify");
//       setError("Please select a role to verify bills");
//       setTimeout(() => setError(null), 3000);
//       setBills([]);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const reqBody = {
//         _id: userData._id,
//         startDate: startDate?.YYYYMMDD || startDate,
//         endDate: endDate?.YYYYMMDD || endDate,
//         status: filterStatus,
//         limit: itemsPerPage,
//         page: currentPage,
//         role: roleToSend
//       };

//       console.log("Fetching bills for verification with:", reqBody);
//       console.log("Selected Role:", selectedRole);
//       console.log("Role being sent to API:", roleToSend);

//       const response = await GetBillsForVerification(reqBody);
      
//       if (response.status === "Success") {
//         setBills(response.data || []);
//         setSummary(response.summary || {});
//         setVerifierInfo(response.verifierInfo || {});
//       } else {
//         setError(response.message || "Failed to fetch bills");
//       }
//     } catch (err) {
//       console.error("Error fetching bills:", err);
//       setError("Failed to load bills. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userData?._id, startDate, endDate, filterStatus, selectedRole, currentPage, itemsPerPage, getDefaultRoleForAPI]);

//   useEffect(() => {
//     if (startDate && endDate && userData?._id) {
//       fetchBills();
//     }
//   }, [startDate, endDate, userData?._id, filterStatus, selectedRole, currentPage, fetchBills]);

//   // Handle verification (Verify or Reject)
//   const handleVerification = useCallback(async (bill, action) => {
//     setVerifyingBillId(bill._id);
//     setVerificationAction(action);
    
//     try {
//       const reqBody = {
//         _id: bill._id,
//         status: action === "verify" ? "Verified" : "Rejected",
//         verification: {
//           verifiedBy: userData?._id,
//           verifiedAt: new Date().toISOString(),
//           comments: verificationComment || `${action === "verify" ? "Bill verified successfully" : "Bill rejected"}`
//         }
//       };

//       const response = await BillsVerification(reqBody);
      
//       if (response.status === "Success") {
//         setSuccessMessage(`Bill ${action === "verify" ? "verified" : "rejected"} successfully!`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//         fetchBills();
//         setShowModal(false);
//         setVerificationComment("");
//       } else {
//         setError(response.message || "Failed to update bill");
//         setTimeout(() => setError(""), 3000);
//       }
//     } catch (err) {
//       console.error("Error verifying bill:", err);
//       setError("Failed to update bill status");
//       setTimeout(() => setError(""), 3000);
//     } finally {
//       setVerifyingBillId(null);
//       setVerificationAction("");
//     }
//   }, [userData?._id, verificationComment, fetchBills]);

//   // Handle comment change
//   const handleCommentChange = useCallback((value) => {
//     setVerificationComment(value);
//   }, []);

//   // Handle view bill details
//   const handleViewBill = useCallback((bill) => {
//     setSelectedBill(bill);
//     setVerificationComment("");
//     setShowModal(true);
//   }, []);

//   // Format date
//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   }, []);

//   // Format currency
//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   }, []);

//   // Get status badge
//   const getStatusBadge = useCallback((status) => {
//     const statusColors = {
//       'Submitted': 'info',
//       'Pending': 'warning',
//       'Verified': 'success',
//       'Approved': 'primary',
//       'Rejected': 'danger',
//       'Paid': 'dark'
//     };
//     return statusColors[status] || 'secondary';
//   }, []);

//   // Memoized Table View
//   const TableView = useMemo(() => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="align-middle">
//         <thead className="bg-light">
//           <tr>
//             <th>#</th>
//             <th>Date</th>
//             <th>Submitted By</th>
//             <th>Purpose</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bills.length > 0 ? (
//             bills.map((bill, index) => (
//               <BillRow
//                 key={bill._id}
//                 bill={bill}
//                 index={index}
//                 currentPage={currentPage}
//                 itemsPerPage={itemsPerPage}
//                 formatDate={formatDate}
//                 formatCurrency={formatCurrency}
//                 getStatusBadge={getStatusBadge}
//                 onVerify={handleViewBill}
//               />
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="text-center py-5 text-muted">
//                 {selectedRole ? "No bills found for verification" : "Please select a role to verify bills"}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [bills, currentPage, itemsPerPage, formatDate, formatCurrency, getStatusBadge, handleViewBill, selectedRole]);

//   // Status filter options
//   const statusOptions = ["Pending", "Submitted", "Verified", "Approved", "Rejected", "Paid", "All"];
//   const roleOptions = getRoleOptions();

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           <FaCheckCircle className="me-2" /> {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <FaTimesCircle className="me-2" /> {error}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col>
//           <h2 className="text-primary mb-2">🔍 Bills Verification</h2>
//           <p className="text-muted">Verify and approve bills submitted by users in your region</p>
//         </Col>
//       </Row>

//       {/* Filters Section */}
//       <Row className="mb-4 g-3">
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaCalendarAlt className="me-2" /> Date Range
//               </Form.Label>
//               <DateNDateRangePicker />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaFilter className="me-2" /> Filter by Status
//               </Form.Label>
//               <div className="d-flex gap-2 flex-wrap">
//                 {statusOptions.map(status => (
//                   <Button
//                     key={status}
//                     variant={filterStatus === status ? "primary" : "outline-secondary"}
//                     size="sm"
//                     onClick={() => {
//                       setFilterStatus(status);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     {status}
//                   </Button>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaUserTag className="me-2" /> Select Submitter Role
//               </Form.Label>
//               <Select
//                 options={roleOptions}
//                 value={selectedRole}
//                 onChange={(option) => {
//                   setSelectedRole(option);
//                   setCurrentPage(1);
//                 }}
//                 placeholder="Select role to verify..."
//                 isClearable={userData?.role !== "ACI"}
//                 isDisabled={userData?.role === "ACI"}
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: '#ced4da',
//                     '&:hover': { borderColor: '#86b7fe' }
//                   })
//                 }}
//               />
//               {userData?.role === "ACI" && (
//                 <Form.Text className="text-muted">
//                   ACI can only verify CC bills
//                 </Form.Text>
//               )}
//               {userData?.role === "Admin" && (
//                 <Form.Text className="text-muted">
//                   Please select a role to verify bills
//                 </Form.Text>
//               )}
//               {userData?.role === "Community Manager" && (
//                 <Form.Text className="text-muted">
//                   Please select a role to verify bills
//                 </Form.Text>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Verifier Info Card */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <Card className="shadow-sm bg-light">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <div>
//                   <FaUser className="text-primary me-2" />
//                   <strong>Verifier:</strong> {userData?.name} ({userData?.role})
//                 </div>
//                 <div>
//                   <strong>Selected Role Filter:</strong> {selectedRole ? selectedRole.label : "None selected"}
//                 </div>
//                 <div>
//                   <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools?.length || 0}
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Statistics */}
//       {!loading && bills.length > 0 && (
//         <StatisticsAccordion 
//           summary={summary} 
//           verifierInfo={verifierInfo} 
//           formatCurrency={formatCurrency}
//         />
//       )}

//       {/* Refresh Button */}
//       <Row className="mb-3">
//         <Col className="text-end">
//           <Button 
//             variant="outline-primary" 
//             size="sm" 
//             onClick={fetchBills}
//             disabled={loading || !selectedRole}
//           >
//             <FaSyncAlt className={loading ? "spin" : ""} /> Refresh
//           </Button>
//         </Col>
//       </Row>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3 text-muted">Loading bills for verification...</p>
//         </div>
//       )}

//       {/* Bills Table */}
//       {!loading && TableView}

//       {/* Pagination */}
//       {!loading && summary.totalBills > itemsPerPage && (
//         <div className="d-flex justify-content-center mt-4">
//           <Pagination>
//             <Pagination.Prev 
//               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
//               disabled={currentPage === 1}
//             />
//             {[...Array(Math.ceil(summary.totalBills / itemsPerPage)).keys()].map(number => (
//               <Pagination.Item
//                 key={number + 1}
//                 active={number + 1 === currentPage}
//                 onClick={() => setCurrentPage(number + 1)}
//               >
//                 {number + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next 
//               onClick={() => setCurrentPage(prev => prev + 1)} 
//               disabled={currentPage === Math.ceil(summary.totalBills / itemsPerPage)}
//             />
//           </Pagination>
//         </div>
//       )}

//       {/* Bill Verification Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title>
//             <FaFilePdf className="me-2" /> Verify Bill
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <BillDetailsContent
//             selectedBill={selectedBill}
//             formatDate={formatDate}
//             formatCurrency={formatCurrency}
//             getStatusBadge={getStatusBadge}
//             verificationComment={verificationComment}
//             onCommentChange={handleCommentChange}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={() => handleVerification(selectedBill, "reject")}
//             disabled={verifyingBillId === selectedBill?._id}
//           >
//             {verifyingBillId === selectedBill?._id && verificationAction === "reject" ? (
//               <Spinner size="sm" animation="border" />
//             ) : (
//               <><FaTimes className="me-2" /> Reject</>
//             )}
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={() => handleVerification(selectedBill, "verify")}
//             disabled={verifyingBillId === selectedBill?._id}
//           >
//             {verifyingBillId === selectedBill?._id && verificationAction === "verify" ? (
//               <Spinner size="sm" animation="border" />
//             ) : (
//               <><FaCheck className="me-2" /> Verify</>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <style>{`
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .table-responsive {
//           overflow-x: auto;
//         }
//         .table th, .table td {
//           vertical-align: middle;
//         }
//       `}</style>
//     </Container>
//   );
// };










// import React, { useState, useEffect, useContext, useCallback, useMemo, memo, useRef } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { GetBillsForVerification, BillsVerification } from "../../service/Bills.services.js";
// import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal, Accordion } from "react-bootstrap";
// import { 
//   FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaRupeeSign, 
//   FaCalendarAlt, FaUser, FaFilePdf, FaFileImage, FaDownload,
//   FaMapMarkerAlt, FaUtensils, FaHotel, FaBox, FaComment, FaCheck, 
//   FaTimes, FaInfoCircle, FaFilter, FaSyncAlt, FaUserTag
// } from "react-icons/fa";
// import Select from "react-select";

// // Memoized Bill Row Component
// const BillRow = memo(({ bill, index, currentPage, itemsPerPage, formatDate, formatCurrency, getStatusBadge, onVerify }) => {
//   return (
//     <tr>
//       <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//       <td>{formatDate(bill.expenseDate)}</td>
//       <td>
//         <div className="fw-semibold">{bill.submitterDetails?.name || bill?.unqUserObjectId?.name}</div>
//         <small className="text-muted">{bill.submitterDetails?.role || bill?.unqUserObjectId?.contact1}</small>
//         </td>
//        <td className="text-wrap" style={{ maxWidth: "200px" }}>{bill.purposeOfExpense}</td>
//        <td><Badge bg="secondary">{bill.expenseType}</Badge></td>
//        <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
//        <td><Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge></td>
//        <td>
//         <Button size="sm" variant="outline-primary" onClick={() => onVerify(bill)}>
//           <FaEye /> Verify
//         </Button>
//         </td>
//     </tr>
//   );
// });

// // Memoized Statistics Accordion Component
// const StatisticsAccordion = memo(({ summary, verifierInfo, formatCurrency }) => (
//   <Accordion defaultActiveKey="" className="mb-4">
//     <Accordion.Item eventKey="0">
//       <Accordion.Header>
//         <div className="d-flex align-items-center gap-2">
//           <FaInfoCircle className="text-primary" />
//           <strong>Verification Summary</strong>
//           <Badge bg="primary" className="ms-2">
//             {summary.totalBills || 0} Bills | {formatCurrency(summary.totalAmount || 0)}
//           </Badge>
//         </div>
//       </Accordion.Header>
//       <Accordion.Body>
//         <Row className="g-3">
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-primary text-white">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.totalBills || 0}</h3>
//                 <small>Total Bills</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-success text-white">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.statusBreakdown?.Verified || 0}</h3>
//                 <small>Verified</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-danger text-white">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.statusBreakdown?.Rejected || 0}</h3>
//                 <small>Rejected</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} sm={6}>
//             <Card className="border-0 shadow-sm bg-warning text-dark">
//               <Card.Body className="text-center">
//                 <h3 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h3>
//                 <small>Pending</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//         <div className="mt-3 text-muted small">
//           <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools || 0}
//         </div>
//       </Accordion.Body>
//     </Accordion.Item>
//   </Accordion>
// ));

// // Memoized Bill Details Component for Modal
// const BillDetailsContent = memo(({ selectedBill, formatDate, formatCurrency, getStatusBadge, verificationComment, onCommentChange }) => {
//   if (!selectedBill) return null;

//   return (
//     <div>
//       <Row className="mb-3">
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Bill ID</small>
//             <p className="mb-0 fw-semibold">{selectedBill._id}</p>
//           </div>
//         </Col>
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Status</small>
//             <p className="mb-0">
//               <Badge bg={getStatusBadge(selectedBill.status)}>{selectedBill.status}</Badge>
//             </p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Expense Date</small>
//             <p className="mb-0">{formatDate(selectedBill.expenseDate)}</p>
//           </div>
//         </Col>
//         <Col md={6}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Amount</small>
//             <p className="mb-0 text-success fw-bold">{formatCurrency(selectedBill.expenseAmount)}</p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={12}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Purpose</small>
//             <p className="mb-0">{selectedBill.purposeOfExpense}</p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={12}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Expense Type</small>
//             <p className="mb-0">{selectedBill.expenseType}</p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={12}>
//           <div className="border-bottom pb-2 mb-2">
//             <small className="text-muted">Submitted By</small>
//             <p className="mb-0 fw-semibold">{selectedBill.submitterDetails?.name}</p>
//             <small>ID: {selectedBill.submitterDetails?.userId} | Role: {selectedBill.submitterDetails?.role}</small>
//           </div>
//         </Col>
//       </Row>

//       {selectedBill.expenseType === "Travel" && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Travel Details</small>
//               <p className="mb-0">From: {selectedBill.travelFrom}</p>
//               <p className="mb-0">To: {selectedBill.travelTo}</p>
//               {selectedBill.travelledDistance && (
//                 <p className="mb-0">Distance: {selectedBill.travelledDistance} km</p>
//               )}
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.expenseType === "Food" && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Food Type</small>
//               <p className="mb-0">{selectedBill.foodType}</p>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.expenseType === "Accommodation" && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Accommodation Details</small>
//               <p className="mb-0">Check-in: {formatDate(selectedBill.accomodationDate)}</p>
//               <p className="mb-0">Days Stayed: {selectedBill.stayedForDays}</p>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.descriptionExpense && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Description</small>
//               <p className="mb-0">{selectedBill.descriptionExpense}</p>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {selectedBill.fileUrl && (
//         <Row className="mb-3">
//           <Col md={12}>
//             <div className="border-bottom pb-2 mb-2">
//               <small className="text-muted">Receipt</small>
//               <div className="mt-2">
//                 <Button variant="primary" href={selectedBill.fileUrl} target="_blank" size="sm">
//                   {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       )}

//       <Row className="mb-3">
//         <Col md={12}>
//           <Form.Label className="fw-semibold">
//             <FaComment className="me-2" /> Verification Comments
//           </Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
//             value={verificationComment}
//             onChange={(e) => onCommentChange(e.target.value)}
//             placeholder="Enter verification comments... (optional)"
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// });

// export const BillsVerificationV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { 
//     startDate, 
//     setStartDate,
//     endDate, 
//     setEndDate,
//   } = useContext(DateNDateRangeContext);

//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(50);
//   const [filterStatus, setFilterStatus] = useState("Pending");
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [summary, setSummary] = useState({});
//   const [verifierInfo, setVerifierInfo] = useState({});
//   const [verifyingBillId, setVerifyingBillId] = useState(null);
//   const [verificationComment, setVerificationComment] = useState("");
//   const [verificationAction, setVerificationAction] = useState("");
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Use ref to track if initial load is done
//   const isInitialMount = useRef(true);
//   // Use ref to store latest filter values to prevent unnecessary re-renders
//   const filterRef = useRef({
//     startDate: null,
//     endDate: null,
//     status: "Pending",
//     selectedRole: null,
//     itemsPerPage: 50
//   });

//   // Get role options based on user's role
//   const getRoleOptions = useCallback(() => {
//     const userRole = userData?.role;
    
//     if (userRole === "Admin") {
//       return [
//         { value: "CC", label: "CC" },
//         { value: "ACI", label: "ACI" },
//         { value: "Community Manager", label: "Community Manager" }
//       ];
//     } else if (userRole === "Community Manager") {
//       return [
//         { value: "ACI", label: "ACI" },
//         { value: "CC", label: "CC" }
//       ];
//     } else if (userRole === "ACI") {
//       return [
//         { value: "CC", label: "CC" }
//       ];
//     }
//     return [];
//   }, [userData?.role]);

//   // Get default role to send based on user's role
//   const getDefaultRoleForAPI = useCallback(() => {
//     const userRole = userData?.role;
    
//     if (userRole === "Admin") {
//       return null;
//     } else if (userRole === "Community Manager") {
//       return null;
//     } else if (userRole === "ACI") {
//       return "CC";
//     }
//     return null;
//   }, [userData?.role]);

//   // Set default date range to previous 30 days
//   useEffect(() => {
//     const today = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(today.getDate() - 30);
    
//     const formatDate = (date) => {
//       return {
//         YYYYMMDD: date.toISOString().split('T')[0],
//         DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
//         ISOformat: date.toISOString()
//       };
//     };
    
//     if (!startDate && !endDate) {
//       setStartDate(formatDate(thirtyDaysAgo));
//       setEndDate(formatDate(today));
//     }
//   }, []);

//   // Main fetch function - stable using useCallback with proper dependencies
//   const fetchBills = useCallback(async (page = currentPage, limit = itemsPerPage) => {
//     if (!userData?._id) {
//       return;
//     }

//     let roleToSend = null;
    
//     if (selectedRole) {
//       roleToSend = selectedRole.value;
//     } else {
//       roleToSend = getDefaultRoleForAPI();
//     }

//     if (!roleToSend) {
//       setError("Please select a role to verify bills");
//       setTimeout(() => setError(null), 3000);
//       setBills([]);
//       setTotalItems(0);
//       setTotalPages(1);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const reqBody = {
//         _id: userData._id,
//         startDate: startDate?.YYYYMMDD || startDate,
//         endDate: endDate?.YYYYMMDD || endDate,
//         status: filterStatus,
//         limit: limit,
//         page: page,
//         role: roleToSend
//       };

//       const response = await GetBillsForVerification(reqBody);
      
//       if (response.status === "Success") {
//         setBills(response.data || []);
//         setSummary(response.summary || {});
//         setVerifierInfo(response.verifierInfo || {});
        
//         if (response.pagination) {
//           setTotalItems(response.pagination.totalItems);
//           setTotalPages(response.pagination.totalPages);
//         }
//       } else {
//         setError(response.message || "Failed to fetch bills");
//       }
//     } catch (err) {
//       console.error("Error fetching bills:", err);
//       setError("Failed to load bills. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userData?._id, startDate, endDate, filterStatus, selectedRole, getDefaultRoleForAPI]);

//   // Handle page change - FIXED: Don't depend on fetchBills
//   const handlePageChange = useCallback((pageNumber) => {
//     if (pageNumber === currentPage) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [currentPage]);

//   // Handle items per page change
//   const handleItemsPerPageChange = useCallback((event) => {
//     const newLimit = parseInt(event.target.value, 10);
//     setItemsPerPage(newLimit);
//     setCurrentPage(1);
//   }, []);

//   // Separate useEffect for fetching when page changes
//   useEffect(() => {
//     if (userData?._id && startDate && endDate) {
//       fetchBills(currentPage, itemsPerPage);
//     }
//   }, [currentPage, itemsPerPage, fetchBills, userData?._id, startDate, endDate]);

//   // Handle filter changes - Reset page to 1 when filters change
//   const handleFilterStatusChange = useCallback((status) => {
//     setFilterStatus(status);
//     setCurrentPage(1);
//   }, []);

//   const handleRoleChange = useCallback((option) => {
//     setSelectedRole(option);
//     setCurrentPage(1);
//   }, []);

//   // Handle verification
//   const handleVerification = useCallback(async (bill, action) => {
//     setVerifyingBillId(bill._id);
//     setVerificationAction(action);
    
//     try {
//       const reqBody = {
//         _id: bill._id,
//         status: action === "verify" ? "Verified" : "Rejected",
//         verification: {
//           verifiedBy: userData?._id,
//           verifiedAt: new Date().toISOString(),
//           comments: verificationComment || `${action === "verify" ? "Bill verified successfully" : "Bill rejected"}`
//         }
//       };

//       const response = await BillsVerification(reqBody);
      
//       if (response.status === "Success") {
//         setSuccessMessage(`Bill ${action === "verify" ? "verified" : "rejected"} successfully!`);
//         setTimeout(() => setSuccessMessage(""), 3000);
        
//         // Refresh current page after verification
//         fetchBills(currentPage, itemsPerPage);
//         setShowModal(false);
//         setVerificationComment("");
//       } else {
//         setError(response.message || "Failed to update bill");
//         setTimeout(() => setError(""), 3000);
//       }
//     } catch (err) {
//       console.error("Error verifying bill:", err);
//       setError("Failed to update bill status");
//       setTimeout(() => setError(""), 3000);
//     } finally {
//       setVerifyingBillId(null);
//       setVerificationAction("");
//     }
//   }, [userData?._id, verificationComment, fetchBills, currentPage, itemsPerPage]);

//   const handleCommentChange = useCallback((value) => {
//     setVerificationComment(value);
//   }, []);

//   const handleViewBill = useCallback((bill) => {
//     setSelectedBill(bill);
//     setVerificationComment("");
//     setShowModal(true);
//   }, []);

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   }, []);

//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   }, []);

//   const getStatusBadge = useCallback((status) => {
//     const statusColors = {
//       'Submitted': 'info',
//       'Pending': 'warning',
//       'Verified': 'success',
//       'Approved': 'primary',
//       'Rejected': 'danger',
//       'Paid': 'dark'
//     };
//     return statusColors[status] || 'secondary';
//   }, []);

//   // Generate pagination items - memoized
//   const renderPaginationItems = useMemo(() => {
//     const items = [];
//     const maxVisiblePages = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }
    
//     for (let number = startPage; number <= endPage; number++) {
//       items.push(
//         <Pagination.Item
//           key={number}
//           active={number === currentPage}
//           onClick={() => handlePageChange(number)}
//         >
//           {number}
//         </Pagination.Item>
//       );
//     }
//     return items;
//   }, [currentPage, totalPages, handlePageChange]);

//   // Memoized Table View
//   const TableView = useMemo(() => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="align-middle">
//         <thead className="bg-light">
//           <tr>
//             <th>#</th>
//             <th>Date</th>
//             <th>Submitted By</th>
//             <th>Purpose</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bills.length > 0 ? (
//             bills.map((bill, index) => (
//               <BillRow
//                 key={bill._id}
//                 bill={bill}
//                 index={index}
//                 currentPage={currentPage}
//                 itemsPerPage={itemsPerPage}
//                 formatDate={formatDate}
//                 formatCurrency={formatCurrency}
//                 getStatusBadge={getStatusBadge}
//                 onVerify={handleViewBill}
//               />
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="text-center py-5 text-muted">
//                 {selectedRole ? "No bills found for verification" : "Please select a role to verify bills"}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [bills, currentPage, itemsPerPage, formatDate, formatCurrency, getStatusBadge, handleViewBill, selectedRole]);

//   const statusOptions = ["Pending", "Submitted", "Verified", "Approved", "Rejected", "Paid", "All"];
//   const roleOptions = getRoleOptions();

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           <FaCheckCircle className="me-2" /> {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <FaTimesCircle className="me-2" /> {error}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col>
//           <h2 className="text-primary mb-2">🔍 Bills Verification</h2>
//           <p className="text-muted">Verify and approve bills submitted by users in your region</p>
//         </Col>
//       </Row>

//       {/* Filters Section */}
//       <Row className="mb-4 g-3">
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaCalendarAlt className="me-2" /> Date Range
//               </Form.Label>
//               <DateNDateRangePicker />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaFilter className="me-2" /> Filter by Status
//               </Form.Label>
//               <div className="d-flex gap-2 flex-wrap">
//                 {statusOptions.map(status => (
//                   <Button
//                     key={status}
//                     variant={filterStatus === status ? "primary" : "outline-secondary"}
//                     size="sm"
//                     onClick={() => handleFilterStatusChange(status)}
//                   >
//                     {status}
//                   </Button>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaUserTag className="me-2" /> Select Submitter Role
//               </Form.Label>
//               <Select
//                 options={roleOptions}
//                 value={selectedRole}
//                 onChange={handleRoleChange}
//                 placeholder="Select role to verify..."
//                 isClearable={userData?.role !== "ACI"}
//                 isDisabled={userData?.role === "ACI"}
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: '#ced4da',
//                     '&:hover': { borderColor: '#86b7fe' }
//                   })
//                 }}
//               />
//               {userData?.role === "ACI" && (
//                 <Form.Text className="text-muted">
//                   ACI can only verify CC bills
//                 </Form.Text>
//               )}
//               {(userData?.role === "Admin" || userData?.role === "Community Manager") && (
//                 <Form.Text className="text-muted">
//                   Please select a role to verify bills
//                 </Form.Text>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Items Per Page and Verifier Info */}
//       <Row className="mb-4">
//         <Col md={6}>
//           <Card className="shadow-sm bg-light">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <div>
//                   <FaUser className="text-primary me-2" />
//                   <strong>Verifier:</strong> {userData?.name} ({userData?.role})
//                 </div>
//                 <div>
//                   <strong>Selected Role Filter:</strong> {selectedRole ? selectedRole.label : "None selected"}
//                 </div>
//                 <div>
//                   <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools || 0}
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="shadow-sm bg-light">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>Rows per page:</strong>
//                 </div>
//                 <Form.Select 
//                   value={itemsPerPage} 
//                   onChange={handleItemsPerPageChange}
//                   style={{ width: "100px" }}
//                 >
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                   <option value={200}>200</option>
//                 </Form.Select>
//                 <div className="text-muted">
//                   Showing {bills.length} of {totalItems} bills
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Statistics */}
//       {!loading && bills.length > 0 && (
//         <StatisticsAccordion 
//           summary={summary} 
//           verifierInfo={verifierInfo} 
//           formatCurrency={formatCurrency}
//         />
//       )}

//       {/* Refresh Button */}
//       <Row className="mb-3">
//         <Col className="text-end">
//           <Button 
//             variant="outline-primary" 
//             size="sm" 
//             onClick={() => fetchBills(currentPage, itemsPerPage)}
//             disabled={loading || !selectedRole}
//           >
//             <FaSyncAlt className={loading ? "spin" : ""} /> Refresh
//           </Button>
//         </Col>
//       </Row>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3 text-muted">Loading bills for verification...</p>
//         </div>
//       )}

//       {/* Bills Table */}
//       {!loading && TableView}

//       {/* Pagination */}
//       {!loading && totalPages > 1 && (
//         <div className="d-flex justify-content-center mt-4">
//           <Pagination>
//             <Pagination.First 
//               onClick={() => handlePageChange(1)} 
//               disabled={currentPage === 1}
//             />
//             <Pagination.Prev 
//               onClick={() => handlePageChange(currentPage - 1)} 
//               disabled={currentPage === 1}
//             />
//             {renderPaginationItems}
//             <Pagination.Next 
//               onClick={() => handlePageChange(currentPage + 1)} 
//               disabled={currentPage === totalPages}
//             />
//             <Pagination.Last 
//               onClick={() => handlePageChange(totalPages)} 
//               disabled={currentPage === totalPages}
//             />
//           </Pagination>
//         </div>
//       )}

//       {/* Bill Verification Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title>
//             <FaFilePdf className="me-2" /> Verify Bill
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <BillDetailsContent
//             selectedBill={selectedBill}
//             formatDate={formatDate}
//             formatCurrency={formatCurrency}
//             getStatusBadge={getStatusBadge}
//             verificationComment={verificationComment}
//             onCommentChange={handleCommentChange}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={() => handleVerification(selectedBill, "reject")}
//             disabled={verifyingBillId === selectedBill?._id}
//           >
//             {verifyingBillId === selectedBill?._id && verificationAction === "reject" ? (
//               <Spinner size="sm" animation="border" />
//             ) : (
//               <><FaTimes className="me-2" /> Reject</>
//             )}
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={() => handleVerification(selectedBill, "verify")}
//             disabled={verifyingBillId === selectedBill?._id}
//           >
//             {verifyingBillId === selectedBill?._id && verificationAction === "verify" ? (
//               <Spinner size="sm" animation="border" />
//             ) : (
//               <><FaCheck className="me-2" /> Verify</>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <style>{`
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .table-responsive {
//           overflow-x: auto;
//         }
//         .table th, .table td {
//           vertical-align: middle;
//         }
//       `}</style>
//     </Container>
//   );
// };





import React, { useState, useEffect, useContext, useCallback, useMemo, memo, useRef } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { GetBillsForVerification, BillsVerification } from "../../service/Bills.services.js";
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal, Accordion } from "react-bootstrap";
import { 
  FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaRupeeSign, 
  FaCalendarAlt, FaUser, FaFilePdf, FaFileImage, FaDownload,
  FaMapMarkerAlt, FaUtensils, FaHotel, FaBox, FaComment, FaCheck, 
  FaTimes, FaInfoCircle, FaFilter, FaSyncAlt, FaUserTag, FaExclamationTriangle
} from "react-icons/fa";
import Select from "react-select";

// Memoized Bill Row Component
const BillRow = memo(({ bill, index, currentPage, itemsPerPage, formatDate, formatCurrency, getStatusBadge, onVerify }) => {
  return (
    <tr>
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{formatDate(bill.expenseDate)}</td>
      <td>
        <div className="fw-semibold">{bill.submitterDetails?.name || bill?.unqUserObjectId?.name}</div>
        <small className="text-muted">{bill.submitterDetails?.role || bill?.unqUserObjectId?.contact1}</small>
        </td>
       <td className="text-wrap" style={{ maxWidth: "200px" }}>{bill.purposeOfExpense}</td>
       <td><Badge bg="secondary">{bill.expenseType}</Badge></td>
       <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
       <td><Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge></td>
       <td>
        <Button size="sm" variant="outline-primary" onClick={() => onVerify(bill)}>
          <FaEye /> Verify
        </Button>
      </td>
    </tr>
  );
});

// Memoized Statistics Accordion Component
const StatisticsAccordion = memo(({ summary, verifierInfo, formatCurrency }) => (
  <Accordion defaultActiveKey="" className="mb-4">
    <Accordion.Item eventKey="0">
      <Accordion.Header>
        <div className="d-flex align-items-center gap-2">
          <FaInfoCircle className="text-primary" />
          <strong>Verification Summary</strong>
          <Badge bg="primary" className="ms-2">
            {summary.totalBills || 0} Bills | {formatCurrency(summary.totalAmount || 0)}
          </Badge>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <Row className="g-3">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm bg-primary text-white">
              <Card.Body className="text-center">
                <h3 className="mb-0">{summary.totalBills || 0}</h3>
                <small>Total Bills</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm bg-success text-white">
              <Card.Body className="text-center">
                <h3 className="mb-0">{summary.statusBreakdown?.Verified || 0}</h3>
                <small>Verified</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm bg-danger text-white">
              <Card.Body className="text-center">
                <h3 className="mb-0">{summary.statusBreakdown?.Rejected || 0}</h3>
                <small>Rejected</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm bg-warning text-dark">
              <Card.Body className="text-center">
                <h3 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h3>
                <small>Pending</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="mt-3 text-muted small">
          <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools || 0}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
));

// Memoized Bill Details Component for Modal
const BillDetailsContent = memo(({ selectedBill, formatDate, formatCurrency, getStatusBadge, verificationComment, onCommentChange }) => {
  if (!selectedBill) return null;

  return (
    <div>
      <Row className="mb-3">
        <Col md={6}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Bill ID</small>
            <p className="mb-0 fw-semibold">{selectedBill._id}</p>
          </div>
        </Col>
        <Col md={6}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Status</small>
            <p className="mb-0">
              <Badge bg={getStatusBadge(selectedBill.status)}>{selectedBill.status}</Badge>
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Expense Date</small>
            <p className="mb-0">{formatDate(selectedBill.expenseDate)}</p>
          </div>
        </Col>
        <Col md={6}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Amount</small>
            <p className="mb-0 text-success fw-bold">{formatCurrency(selectedBill.expenseAmount)}</p>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Purpose</small>
            <p className="mb-0">{selectedBill.purposeOfExpense}</p>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Expense Type</small>
            <p className="mb-0">{selectedBill.expenseType}</p>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <div className="border-bottom pb-2 mb-2">
            <small className="text-muted">Submitted By</small>
            <p className="mb-0 fw-semibold">{selectedBill.submitterDetails?.name}</p>
            <small>ID: {selectedBill.submitterDetails?.userId} | Role: {selectedBill.submitterDetails?.role}</small>
          </div>
        </Col>
      </Row>

      {selectedBill.expenseType === "Travel" && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="border-bottom pb-2 mb-2">
              <small className="text-muted">Travel Details</small>
              <p className="mb-0">From: {selectedBill.travelFrom}</p>
              <p className="mb-0">To: {selectedBill.travelTo}</p>
              {selectedBill.travelledDistance && (
                <p className="mb-0">Distance: {selectedBill.travelledDistance} km</p>
              )}
            </div>
          </Col>
        </Row>
      )}

      {selectedBill.expenseType === "Food" && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="border-bottom pb-2 mb-2">
              <small className="text-muted">Food Type</small>
              <p className="mb-0">{selectedBill.foodType}</p>
            </div>
          </Col>
        </Row>
      )}

      {selectedBill.expenseType === "Accommodation" && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="border-bottom pb-2 mb-2">
              <small className="text-muted">Accommodation Details</small>
              <p className="mb-0">Check-in: {formatDate(selectedBill.accomodationDate)}</p>
              <p className="mb-0">Days Stayed: {selectedBill.stayedForDays}</p>
            </div>
          </Col>
        </Row>
      )}

      {selectedBill.descriptionExpense && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="border-bottom pb-2 mb-2">
              <small className="text-muted">Description</small>
              <p className="mb-0">{selectedBill.descriptionExpense}</p>
            </div>
          </Col>
        </Row>
      )}

      {selectedBill.fileUrl && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="border-bottom pb-2 mb-2">
              <small className="text-muted">Receipt</small>
              <div className="mt-2">
                <Button variant="primary" href={selectedBill.fileUrl} target="_blank" size="sm">
                  {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={12}>
          <Form.Label className="fw-semibold">
            <FaComment className="me-2" /> Verification Comments
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={verificationComment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Enter verification comments... (required for rejection)"
          />
          <Form.Text className="text-muted">
            Comments are required when rejecting a bill
          </Form.Text>
        </Col>
      </Row>
    </div>
  );
});

// Warning Modal Component for Rejection Without Comment
const RejectionWarningModal = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-warning">
        <Modal.Title>
          <FaExclamationTriangle className="me-2" /> Comment Required
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-3">
          <FaTimesCircle className="text-danger" size={48} />
          <h5 className="mt-3">Cannot Reject Bill Without Reason</h5>
          <p className="text-muted mt-2">
            Please provide a reason for rejection in the comments section before rejecting this bill.
          </p>
          <div className="alert alert-info mt-3">
            <FaComment className="me-2" />
            A clear rejection reason helps the submitter understand why their bill was rejected.
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Go Back to Comments
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const BillsVerificationV2 = () => {
  const { userData } = useContext(UserContext);
  const { 
    startDate, 
    setStartDate,
    endDate, 
    setEndDate,
  } = useContext(DateNDateRangeContext);

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [selectedRole, setSelectedRole] = useState(null);
  const [summary, setSummary] = useState({});
  const [verifierInfo, setVerifierInfo] = useState({});
  const [verifyingBillId, setVerifyingBillId] = useState(null);
  const [verificationComment, setVerificationComment] = useState("");
  const [verificationAction, setVerificationAction] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showRejectionWarning, setShowRejectionWarning] = useState(false);
  
  // Use ref to track if initial load is done
  const isInitialMount = useRef(true);
  // Use ref to store latest filter values to prevent unnecessary re-renders
  const filterRef = useRef({
    startDate: null,
    endDate: null,
    status: "Pending",
    selectedRole: null,
    itemsPerPage: 50
  });

  // Get role options based on user's role
  const getRoleOptions = useCallback(() => {
    const userRole = userData?.role;
    
    if (userRole === "Admin") {
      return [
        { value: "CC", label: "CC" },
        { value: "ACI", label: "ACI" },
        { value: "Community Manager", label: "Community Manager" }
      ];
    } else if (userRole === "Community Manager") {
      return [
        { value: "ACI", label: "ACI" },
        { value: "CC", label: "CC" }
      ];
    } else if (userRole === "ACI") {
      return [
        { value: "CC", label: "CC" }
      ];
    }
    return [];
  }, [userData?.role]);

  // Get default role to send based on user's role
  const getDefaultRoleForAPI = useCallback(() => {
    const userRole = userData?.role;
    
    if (userRole === "Admin") {
      return null;
    } else if (userRole === "Community Manager") {
      return null;
    } else if (userRole === "ACI") {
      return "CC";
    }
    return null;
  }, [userData?.role]);

  // Set default date range to previous 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const formatDate = (date) => {
      return {
        YYYYMMDD: date.toISOString().split('T')[0],
        DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
        ISOformat: date.toISOString()
      };
    };
    
    if (!startDate && !endDate) {
      setStartDate(formatDate(thirtyDaysAgo));
      setEndDate(formatDate(today));
    }
  }, []);

  // Main fetch function - stable using useCallback with proper dependencies
  const fetchBills = useCallback(async (page = currentPage, limit = itemsPerPage) => {
    if (!userData?._id) {
      return;
    }

    let roleToSend = null;
    
    if (selectedRole) {
      roleToSend = selectedRole.value;
    } else {
      roleToSend = getDefaultRoleForAPI();
    }

    if (!roleToSend) {
      setError("Please select a role to verify bills");
      setTimeout(() => setError(null), 3000);
      setBills([]);
      setTotalItems(0);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reqBody = {
        _id: userData._id,
        startDate: startDate?.YYYYMMDD || startDate,
        endDate: endDate?.YYYYMMDD || endDate,
        status: filterStatus,
        limit: limit,
        page: page,
        role: roleToSend
      };

      const response = await GetBillsForVerification(reqBody);
      
      if (response.status === "Success") {
        setBills(response.data || []);
        setSummary(response.summary || {});
        setVerifierInfo(response.verifierInfo || {});
        
        if (response.pagination) {
          setTotalItems(response.pagination.totalItems);
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.message || "Failed to fetch bills");
      }
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError("Failed to load bills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userData?._id, startDate, endDate, filterStatus, selectedRole, getDefaultRoleForAPI]);

  // Handle page change - FIXED: Don't depend on fetchBills
  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((event) => {
    const newLimit = parseInt(event.target.value, 10);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  }, []);

  // Separate useEffect for fetching when page changes
  useEffect(() => {
    if (userData?._id && startDate && endDate) {
      fetchBills(currentPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage, fetchBills, userData?._id, startDate, endDate]);

  // Handle filter changes - Reset page to 1 when filters change
  const handleFilterStatusChange = useCallback((status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  }, []);

  const handleRoleChange = useCallback((option) => {
    setSelectedRole(option);
    setCurrentPage(1);
  }, []);

  // Handle verification with rejection validation
  const handleVerificationClick = useCallback((bill, action) => {
    if (action === "reject" && (!verificationComment || verificationComment.trim() === "")) {
      setShowRejectionWarning(true);
      return;
    }
    handleVerification(bill, action);
  }, [verificationComment]);

  const handleVerification = useCallback(async (bill, action) => {
    setVerifyingBillId(bill._id);
    setVerificationAction(action);
    
    try {
      const reqBody = {
        _id: bill._id,
        status: action === "verify" ? "Verified" : "Rejected",
        verification: {
          verifiedBy: userData?._id,
          verifiedAt: new Date().toISOString(),
          comments: verificationComment || `${action === "verify" ? "Bill verified successfully" : "Bill rejected"}`
        }
      };

      const response = await BillsVerification(reqBody);
      
      if (response.status === "Success") {
        setSuccessMessage(`Bill ${action === "verify" ? "verified" : "rejected"} successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Refresh current page after verification
        fetchBills(currentPage, itemsPerPage);
        setShowModal(false);
        setVerificationComment("");
      } else {
        setError(response.message || "Failed to update bill");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error verifying bill:", err);
      setError("Failed to update bill status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setVerifyingBillId(null);
      setVerificationAction("");
    }
  }, [userData?._id, verificationComment, fetchBills, currentPage, itemsPerPage]);

  const handleCommentChange = useCallback((value) => {
    setVerificationComment(value);
  }, []);

  const handleViewBill = useCallback((bill) => {
    setSelectedBill(bill);
    setVerificationComment("");
    setShowModal(true);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const getStatusBadge = useCallback((status) => {
    const statusColors = {
      'Submitted': 'info',
      'Pending': 'warning',
      'Verified': 'success',
      'Approved': 'primary',
      'Rejected': 'danger',
      'Paid': 'dark'
    };
    return statusColors[status] || 'secondary';
  }, []);

  // Generate pagination items - memoized
  const renderPaginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  }, [currentPage, totalPages, handlePageChange]);

  // Memoized Table View
  const TableView = useMemo(() => (
    <div className="table-responsive">
      <Table striped bordered hover className="align-middle">
        <thead className="bg-light">
          <tr>
            <th>#</th>
            <th>Bill Date</th>
            <th>Submitted By</th>
            <th>Purpose</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.length > 0 ? (
            bills.map((bill, index) => (
              <BillRow
                key={bill._id}
                bill={bill}
                index={index}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                onVerify={handleViewBill}
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-5 text-muted">
                {selectedRole ? "No bills found for verification" : "Please select a role to verify bills"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  ), [bills, currentPage, itemsPerPage, formatDate, formatCurrency, getStatusBadge, handleViewBill, selectedRole]);

  const statusOptions = ["Pending", "Submitted", "Verified", "Approved", "Rejected", "Paid", "All"];
  const roleOptions = getRoleOptions();

  return (
    <Container fluid className="mt-4 mb-4">
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
          <FaCheckCircle className="me-2" /> {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <FaTimesCircle className="me-2" /> {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h2 className="text-primary mb-2">🔍 Bills Verification</h2>
          <p className="text-muted">Verify and approve bills submitted by users in your region</p>
        </Col>
      </Row>

      {/* Filters Section */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Label className="fw-semibold">
                <FaCalendarAlt className="me-2" /> Date Range
              </Form.Label>
              <DateNDateRangePicker />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Label className="fw-semibold">
                <FaFilter className="me-2" /> Filter by Status
              </Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {statusOptions.map(status => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleFilterStatusChange(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Label className="fw-semibold">
                <FaUserTag className="me-2" /> Select Submitter Role
              </Form.Label>
              <Select
                options={roleOptions}
                value={selectedRole}
                onChange={handleRoleChange}
                placeholder="Select role to verify..."
                isClearable={userData?.role !== "ACI"}
                isDisabled={userData?.role === "ACI"}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#ced4da',
                    '&:hover': { borderColor: '#86b7fe' }
                  })
                }}
              />
              {userData?.role === "ACI" && (
                <Form.Text className="text-muted">
                  ACI can only verify CC bills
                </Form.Text>
              )}
              {(userData?.role === "Admin" || userData?.role === "Community Manager") && (
                <Form.Text className="text-muted">
                  Please select a role to verify bills
                </Form.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Items Per Page and Verifier Info */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm bg-light">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <FaUser className="text-primary me-2" />
                  <strong>Verifier:</strong> {userData?.name} ({userData?.role})
                </div>
                <div>
                  <strong>Selected Role Filter:</strong> {selectedRole ? selectedRole.label : "None selected"}
                </div>
                <div>
                  <strong>Accessible Schools:</strong> {verifierInfo.accessibleSchools || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm bg-light">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Rows per page:</strong>
                </div>
                <Form.Select 
                  value={itemsPerPage} 
                  onChange={handleItemsPerPageChange}
                  style={{ width: "100px" }}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </Form.Select>
                <div className="text-muted">
                  Showing {bills.length} of {totalItems} bills
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics */}
      {!loading && bills.length > 0 && (
        <StatisticsAccordion 
          summary={summary} 
          verifierInfo={verifierInfo} 
          formatCurrency={formatCurrency}
        />
      )}

      {/* Refresh Button */}
      <Row className="mb-3">
        <Col className="text-end">
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={() => fetchBills(currentPage, itemsPerPage)}
            disabled={loading || !selectedRole}
          >
            <FaSyncAlt className={loading ? "spin" : ""} /> Refresh
          </Button>
        </Col>
      </Row>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading bills for verification...</p>
        </div>
      )}

      {/* Bills Table */}
      {!loading && TableView}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            />
            {renderPaginationItems}
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Bill Verification Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaFilePdf className="me-2" /> Verify Bill
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BillDetailsContent
            selectedBill={selectedBill}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusBadge={getStatusBadge}
            verificationComment={verificationComment}
            onCommentChange={handleCommentChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleVerificationClick(selectedBill, "reject")}
            disabled={verifyingBillId === selectedBill?._id}
          >
            {verifyingBillId === selectedBill?._id && verificationAction === "reject" ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <><FaTimes className="me-2" /> Reject</>
            )}
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleVerification(selectedBill, "verify")}
            disabled={verifyingBillId === selectedBill?._id}
          >
            {verifyingBillId === selectedBill?._id && verificationAction === "verify" ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <><FaCheck className="me-2" /> Verify</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Warning Modal */}
      <RejectionWarningModal 
        show={showRejectionWarning}
        onClose={() => setShowRejectionWarning(false)}
      />

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table th, .table td {
          vertical-align: middle;
        }
      `}</style>
    </Container>
  );
};