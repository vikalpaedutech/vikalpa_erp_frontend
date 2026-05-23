// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { ViewBillSByLoggedInUserIdandDateRange } from "../../service/Bills.services";

// export const ViewBillsV2 = () =>{


// const {  startDate, 
//       setStartDate,
//       endDate, 
//       setEndDate,
//       dateRange,
//       setDateRange} = useContext(DateNDateRangeContext)
    
// console.log(dateRange)

// console.log(startDate, endDate)

//     return(
//         <>
//         <DateNDateRangePicker/>
//         </>
//     )
// }
















// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { ViewBillSByLoggedInUserIdandDateRange } from "../../service/Bills.services";
// import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal } from "react-bootstrap";
// import { 
//   FaFilePdf, 
//   FaFileImage, 
//   FaDownload, 
//   FaEye, 
//   FaRupeeSign, 
//   FaCalendarAlt, 
//   FaTag, 
//   FaUser, 
//   FaInfoCircle, 
//   FaCheckCircle, 
//   FaTimesCircle, 
//   FaClock,
//   FaMapMarkerAlt,
//   FaUtensils,
//   FaHotel,
//   FaBox
// } from "react-icons/fa";
// export const ViewBillsV2 = () => {
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
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [summary, setSummary] = useState({});
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [filterStatus, setFilterStatus] = useState("All");

//   // Set default date range to previous 10 days
//   useEffect(() => {
//     const today = new Date();
//     const tenDaysAgo = new Date();
//     tenDaysAgo.setDate(today.getDate() - 10);
    
//     // Format dates for the date picker
//     const formatDate = (date) => {
//       return {
//         YYYYMMDD: date.toISOString().split('T')[0],
//         DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
//         ISOformat: date.toISOString()
//       };
//     };
    
//     if (!startDate && !endDate) {
//       setStartDate(formatDate(tenDaysAgo));
//       setEndDate(formatDate(today));
//     }
//   }, []);

//   // Fetch bills when date range changes
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
//         endDate: endDate?.YYYYMMDD || endDate
//       };

//       console.log("Fetching bills with:", reqBody);

//       const response = await ViewBillSByLoggedInUserIdandDateRange(reqBody);
      
//       if (response.status === "Success") {
//         setBills(response.data || []);
//         setTotalAmount(response.totalAmount || 0);
//         setSummary(response.summary || {});
//       } else {
//         setError(response.message || "Failed to fetch bills");
//       }
//     } catch (err) {
//       console.error("Error fetching bills:", err);
//       setError("Failed to load bills. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userData?._id, startDate, endDate]);

//   useEffect(() => {
//     if (startDate && endDate && userData?._id) {
//       fetchBills();
//     }
//   }, [startDate, endDate, userData?._id, fetchBills]);

//   // Handle date range change
//   const handleDateRangeChange = (range) => {
//     if (range && range.startDate && range.endDate) {
//       setStartDate(range.startDate);
//       setEndDate(range.endDate);
//       setDateRange(range);
//     }
//   };

//   // Get status badge color
//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'Submitted': 'info',
//       'Pending': 'warning',
//       'Verified': 'primary',
//       'Approved': 'success',
//       'Rejected': 'danger',
//       'Paid': 'dark'
//     };
//     return statusColors[status] || 'secondary';
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

//   // Handle view bill details
//   const handleViewBill = (bill) => {
//     setSelectedBill(bill);
//     setShowModal(true);
//   };

//   // Filter bills by status
//   const filteredBills = filterStatus === "All" 
//     ? bills 
//     : bills.filter(bill => bill.status === filterStatus);

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Status options for filter
//   const statusOptions = ["All", "Submitted", "Pending", "Verified", "Approved", "Rejected", "Paid"];

//   // Bill summary statistics
//   const StatisticsCards = () => (
//     <Row className="mb-4 g-3">
//       <Col md={3} sm={6}>
//         <Card className="border-0 shadow-sm bg-primary text-white">
//           <Card.Body className="text-center">
//             <FaRupeeSign size={24} className="mb-2" />
//             <h3 className="mb-0">{formatCurrency(totalAmount)}</h3>
//             <small>Total Expenses</small>
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={3} sm={6}>
//         <Card className="border-0 shadow-sm bg-success text-white">
//           <Card.Body className="text-center">
//             <FaCheckCircle size={24} className="mb-2" />
//             <h3 className="mb-0">{summary.totalBills || 0}</h3>
//             <small>Total Bills</small>
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={3} sm={6}>
//         <Card className="border-0 shadow-sm bg-info text-white">
//           <Card.Body className="text-center">
//             <FaClock size={24} className="mb-2" />
//             <h3 className="mb-0">{summary.statusBreakdown?.Approved || 0}</h3>
//             <small>Approved Bills</small>
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={3} sm={6}>
//         <Card className="border-0 shadow-sm bg-warning text-dark">
//           <Card.Body className="text-center">
//             <FaClock size={24} className="mb-2" />
//             <h3 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h3>
//             <small>Pending Bills</small>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   );

//   // Table View
//   const TableView = () => (
//     <div className="table-responsive">
//       <Table striped bordered hover className="align-middle">
//         <thead className="bg-light">
//           <tr>
//             <th>#</th>
//             <th>Date</th>
//             <th>Purpose</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentBills.length > 0 ? (
//             currentBills.map((bill, index) => (
//               <tr key={bill._id}>
//                 <td>{indexOfFirstItem + index + 1}</td>
//                 <td>{formatDate(bill.expenseDate)}</td>
//                 <td className="fw-semibold">{bill.purposeOfExpense}</td>
//                 <td>
//                   <Badge bg="secondary">{bill.expenseType}</Badge>
//                  </td>
//                 <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
//                 <td>
//                   <Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge>
//                  </td>
//                 <td>
//                   <div className="d-flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline-primary"
//                       onClick={() => handleViewBill(bill)}
//                     >
//                       <FaEye /> View
//                     </Button>
//                     {bill.fileUrl && (
//                       <Button
//                         size="sm"
//                         variant="outline-success"
//                         href={bill.fileUrl}
//                         target="_blank"
//                       >
//                         <FaDownload /> Receipt
//                       </Button>
//                     )}
//                   </div>
//                  </td>
//                </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="text-center py-5 text-muted">
//                 No bills found for the selected date range
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );

//   // Card View
//   const CardView = () => (
//     <Row className="g-3">
//       {currentBills.length > 0 ? (
//         currentBills.map((bill, index) => (
//           <Col md={6} lg={4} key={bill._id}>
//             <Card className="h-100 shadow-sm">
//               <Card.Header className="bg-white">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge>
//                   <small className="text-muted">{formatDate(bill.expenseDate)}</small>
//                 </div>
//               </Card.Header>
//               <Card.Body>
//                 <h6 className="mb-2">{bill.purposeOfExpense}</h6>
//                 <div className="mb-2">
//                   <Badge bg="secondary" className="me-2">{bill.expenseType}</Badge>
//                 </div>
//                 <div className="mb-2">
//                   <strong className="text-success">{formatCurrency(bill.expenseAmount)}</strong>
//                 </div>
//                 {bill.expenseType === "Travel" && (
//                   <div className="small text-muted">
//                     <FaMapMarkerAlt className="me-1" />
//                     {bill.travelFrom} → {bill.travelTo}
//                   </div>
//                 )}
//                 {bill.descriptionExpense && (
//                   <div className="small text-muted mt-2">
//                     <FaInfoCircle className="me-1" />
//                     {bill.descriptionExpense.substring(0, 100)}...
//                   </div>
//                 )}
//               </Card.Body>
//               <Card.Footer className="bg-white">
//                 <div className="d-flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline-primary"
//                     onClick={() => handleViewBill(bill)}
//                     className="flex-grow-1"
//                   >
//                     <FaEye /> View Details
//                   </Button>
//                   {bill.fileUrl && (
//                     <Button
//                       size="sm"
//                       variant="outline-success"
//                       href={bill.fileUrl}
//                       target="_blank"
//                     >
//                       <FaDownload />
//                     </Button>
//                   )}
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//         ))
//       ) : (
//         <Col xs={12}>
//           <div className="text-center py-5 text-muted">
//             No bills found for the selected date range
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   // Bill Details Modal
//   const BillDetailsModal = () => (
//     <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//       <Modal.Header closeButton className="bg-primary text-white">
//         <Modal.Title>
//           <FaFilePdf className="me-2" /> Bill Details
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {selectedBill && (
//           <div>
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

//             {selectedBill.approval && selectedBill.approval.comments && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Approval Comments</small>
//                     <p className="mb-0">{selectedBill.approval.comments}</p>
//                     <small className="text-muted">
//                       Approved on: {formatDate(selectedBill.approval.approvedAt)}
//                     </small>
//                   </div>
//                 </Col>
//               </Row>
//             )}

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
//                         className="me-2"
//                       >
//                         {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
//                       </Button>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             <Row className="mb-3">
//               <Col md={12}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Submitted By</small>
//                   <p className="mb-0">{selectedBill.userDetails?.name}</p>
//                   <small className="text-muted">ID: {selectedBill.userDetails?.userId}</small>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => setShowModal(false)}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   // Toggle between table and card view
//   const [viewType, setViewType] = useState('table');

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Header */}
//       <Row className="mb-4">
//         <Col>
//           <h2 className="text-primary mb-2">📄 My Bills / Expenses</h2>
//           <p className="text-muted">View and track all your submitted bills and expenses</p>
//         </Col>
//       </Row>

//       {/* Date Range Picker */}
//       <Row className="mb-4">
//         <Col md={6}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaCalendarAlt className="me-2" /> Select Date Range
//               </Form.Label>
//               <DateNDateRangePicker />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaTag className="me-2" /> Filter by Status
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
//       </Row>

//       {/* Statistics Cards */}
//       {!loading && bills.length > 0 && <StatisticsCards />}

//       {/* View Toggle */}
//       <Row className="mb-3">
//         <Col className="d-flex justify-content-between align-items-center">
//           <div className="btn-group">
//             <Button
//               variant={viewType === 'table' ? 'primary' : 'outline-primary'}
//               onClick={() => setViewType('table')}
//             >
//               Table View
//             </Button>
//             <Button
//               variant={viewType === 'card' ? 'primary' : 'outline-primary'}
//               onClick={() => setViewType('card')}
//             >
//               Card View
//             </Button>
//           </div>
//           <div className="text-muted">
//             Showing {filteredBills.length} of {bills.length} bills
//           </div>
//         </Col>
//       </Row>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3 text-muted">Loading your bills...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !loading && (
//         <Alert variant="danger" className="text-center">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Bills Display */}
//       {!loading && !error && (
//         <>
//           {viewType === 'table' ? <TableView /> : <CardView />}
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="d-flex justify-content-center mt-4">
//               <Pagination>
//                 <Pagination.Prev 
//                   onClick={() => paginate(currentPage - 1)} 
//                   disabled={currentPage === 1}
//                 />
//                 {[...Array(totalPages).keys()].map(number => (
//                   <Pagination.Item
//                     key={number + 1}
//                     active={number + 1 === currentPage}
//                     onClick={() => paginate(number + 1)}
//                   >
//                     {number + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next 
//                   onClick={() => paginate(currentPage + 1)} 
//                   disabled={currentPage === totalPages}
//                 />
//               </Pagination>
//             </div>
//           )}
//         </>
//       )}

//       {/* Bill Details Modal */}
//       <BillDetailsModal />

//       <style jsx>{`
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





// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { ViewBillSByLoggedInUserIdandDateRange } from "../../service/Bills.services";
// import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal, Accordion, Breadcrumb } from "react-bootstrap";
// import { 
//   FaFilePdf, 
//   FaFileImage, 
//   FaDownload, 
//   FaEye, 
//   FaRupeeSign, 
//   FaCalendarAlt, 
//   FaTag, 
//   FaUser, 
//   FaInfoCircle, 
//   FaCheckCircle, 
//   FaTimesCircle, 
//   FaClock,
//   FaMapMarkerAlt,
//   FaUtensils,
//   FaHotel,
//   FaBox,
//   FaChartLine,
//   FaWallet,
//   FaReceipt,
//   FaCheck,
//   FaHourglassHalf
// } from "react-icons/fa";

// export const ViewBillsV2 = () => {
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
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [summary, setSummary] = useState({});
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [viewType, setViewType] = useState('table');
//   const [accordionOpen, setAccordionOpen] = useState(false);

//   // Set default date range to previous 10 days
//   useEffect(() => {
//     const today = new Date();
//     const tenDaysAgo = new Date();
//     tenDaysAgo.setDate(today.getDate() - 10);
    
//     // Format dates for the date picker
//     const formatDate = (date) => {
//       return {
//         YYYYMMDD: date.toISOString().split('T')[0],
//         DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
//         ISOformat: date.toISOString()
//       };
//     };
    
//     if (!startDate && !endDate) {
//       setStartDate(formatDate(tenDaysAgo));
//       setEndDate(formatDate(today));
//     }
//   }, []);

//   // Fetch bills when date range changes
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
//         endDate: endDate?.YYYYMMDD || endDate
//       };

//       console.log("Fetching bills with:", reqBody);

//       const response = await ViewBillSByLoggedInUserIdandDateRange(reqBody);
      
//       if (response.status === "Success") {
//         setBills(response.data || []);
//         setTotalAmount(response.totalAmount || 0);
//         setSummary(response.summary || {});
//       } else {
//         setError(response.message || "Failed to fetch bills");
//       }
//     } catch (err) {
//       console.error("Error fetching bills:", err);
//       setError("Failed to load bills. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userData?._id, startDate, endDate]);

//   useEffect(() => {
//     if (startDate && endDate && userData?._id) {
//       fetchBills();
//     }
//   }, [startDate, endDate, userData?._id, fetchBills]);

//   // Handle date range change
//   const handleDateRangeChange = (range) => {
//     if (range && range.startDate && range.endDate) {
//       setStartDate(range.startDate);
//       setEndDate(range.endDate);
//       setDateRange(range);
//     }
//   };

//   // Get status badge color
//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'Submitted': 'info',
//       'Pending': 'warning',
//       'Verified': 'primary',
//       'Approved': 'success',
//       'Rejected': 'danger',
//       'Paid': 'dark'
//     };
//     return statusColors[status] || 'secondary';
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

//   // Handle view bill details
//   const handleViewBill = (bill) => {
//     setSelectedBill(bill);
//     setShowModal(true);
//   };

//   // Filter bills by status
//   const filteredBills = filterStatus === "All" 
//     ? bills 
//     : bills.filter(bill => bill.status === filterStatus);

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Status options for filter
//   const statusOptions = ["All", "Submitted", "Pending", "Verified", "Approved", "Rejected", "Paid"];

//   // Bill summary statistics in Accordion
//   const StatisticsAccordion = () => (
//     <Accordion 
//       defaultActiveKey={accordionOpen ? "0" : ""} 
//       className="mb-4"
//       onSelect={(eventKey) => setAccordionOpen(eventKey === "0")}
//     >
//       <Accordion.Item eventKey="0">
//         <Accordion.Header>
//           <div className="d-flex align-items-center gap-2">
//             <FaChartLine className="text-primary" />
//             <strong>View Statistics Summary</strong>
//             <Badge bg="primary" className="ms-2">
//               {summary.totalBills || 0} Bills | {formatCurrency(totalAmount)}
//             </Badge>
//           </div>
//         </Accordion.Header>
//         <Accordion.Body>
//           <Row className="g-3">
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-primary text-white h-100">
//                 <Card.Body className="text-center">
//                   <FaWallet size={24} className="mb-2" />
//                   <h4 className="mb-0">{formatCurrency(totalAmount)}</h4>
//                   <small>Total Expenses</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-success text-white h-100">
//                 <Card.Body className="text-center">
//                   <FaReceipt size={24} className="mb-2" />
//                   <h4 className="mb-0">{summary.totalBills || 0}</h4>
//                   <small>Total Bills</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-info text-white h-100">
//                 <Card.Body className="text-center">
//                   <FaCheck size={24} className="mb-2" />
//                   <h4 className="mb-0">{summary.statusBreakdown?.Approved || 0}</h4>
//                   <small>Approved Bills</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="border-0 shadow-sm bg-warning text-dark h-100">
//                 <Card.Body className="text-center">
//                   <FaHourglassHalf size={24} className="mb-2" />
//                   <h4 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h4>
//                   <small>Pending Bills</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Detailed Status Breakdown */}
//           {(summary.statusBreakdown?.Submitted > 0 || 
//             summary.statusBreakdown?.Verified > 0 || 
//             summary.statusBreakdown?.Rejected > 0 || 
//             summary.statusBreakdown?.Paid > 0) && (
//             <Row className="mt-3">
//               <Col xs={12}>
//                 <Card className="border-0 shadow-sm">
//                   <Card.Body>
//                     <h6 className="text-primary mb-3">Detailed Status Breakdown</h6>
//                     <div className="d-flex flex-wrap gap-3">
//                       {summary.statusBreakdown?.Submitted > 0 && (
//                         <div className="text-center">
//                           <Badge bg="info" className="p-2">Submitted</Badge>
//                           <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Submitted}</p>
//                         </div>
//                       )}
//                       {summary.statusBreakdown?.Verified > 0 && (
//                         <div className="text-center">
//                           <Badge bg="primary" className="p-2">Verified</Badge>
//                           <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Verified}</p>
//                         </div>
//                       )}
//                       {summary.statusBreakdown?.Rejected > 0 && (
//                         <div className="text-center">
//                           <Badge bg="danger" className="p-2">Rejected</Badge>
//                           <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Rejected}</p>
//                         </div>
//                       )}
//                       {summary.statusBreakdown?.Paid > 0 && (
//                         <div className="text-center">
//                           <Badge bg="dark" className="p-2">Paid</Badge>
//                           <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Paid}</p>
//                         </div>
//                       )}
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           )}
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
//             <th>Purpose</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentBills.length > 0 ? (
//             currentBills.map((bill, index) => (
//               <tr key={bill._id}>
//                 <td>{indexOfFirstItem + index + 1}</td>
//                 <td>{formatDate(bill.expenseDate)}</td>
//                 <td className="fw-semibold">{bill.purposeOfExpense}</td>
//                 <td>
//                   <Badge bg="secondary">{bill.expenseType}</Badge>
//                  </td>
//                 <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
//                 <td>
//                   <Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge>
//                  </td>
//                 <td>
//                   <div className="d-flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline-primary"
//                       onClick={() => handleViewBill(bill)}
//                     >
//                       <FaEye /> View
//                     </Button>
//                     {bill.fileUrl && (
//                       <Button
//                         size="sm"
//                         variant="outline-success"
//                         href={bill.fileUrl}
//                         target="_blank"
//                       >
//                         <FaDownload /> Receipt
//                       </Button>
//                     )}
//                   </div>
//                  </td>
//                </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="text-center py-5 text-muted">
//                 No bills found for the selected date range
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );

//   // Card View
//   const CardView = () => (
//     <Row className="g-3">
//       {currentBills.length > 0 ? (
//         currentBills.map((bill, index) => (
//           <Col md={6} lg={4} key={bill._id}>
//             <Card className="h-100 shadow-sm">
//               <Card.Header className="bg-white">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge>
//                   <small className="text-muted">{formatDate(bill.expenseDate)}</small>
//                 </div>
//               </Card.Header>
//               <Card.Body>
//                 <h6 className="mb-2">{bill.purposeOfExpense}</h6>
//                 <div className="mb-2">
//                   <Badge bg="secondary" className="me-2">{bill.expenseType}</Badge>
//                 </div>
//                 <div className="mb-2">
//                   <strong className="text-success">{formatCurrency(bill.expenseAmount)}</strong>
//                 </div>
//                 {bill.expenseType === "Travel" && (
//                   <div className="small text-muted">
//                     <FaMapMarkerAlt className="me-1" />
//                     {bill.travelFrom} → {bill.travelTo}
//                   </div>
//                 )}
//                 {bill.expenseType === "Food" && (
//                   <div className="small text-muted">
//                     <FaUtensils className="me-1" />
//                     {bill.foodType}
//                   </div>
//                 )}
//                 {bill.expenseType === "Accommodation" && (
//                   <div className="small text-muted">
//                     <FaHotel className="me-1" />
//                     Stayed: {bill.stayedForDays} days
//                   </div>
//                 )}
//                 {bill.descriptionExpense && (
//                   <div className="small text-muted mt-2">
//                     <FaInfoCircle className="me-1" />
//                     {bill.descriptionExpense.substring(0, 100)}...
//                   </div>
//                 )}
//               </Card.Body>
//               <Card.Footer className="bg-white">
//                 <div className="d-flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline-primary"
//                     onClick={() => handleViewBill(bill)}
//                     className="flex-grow-1"
//                   >
//                     <FaEye /> View Details
//                   </Button>
//                   {bill.fileUrl && (
//                     <Button
//                       size="sm"
//                       variant="outline-success"
//                       href={bill.fileUrl}
//                       target="_blank"
//                     >
//                       <FaDownload />
//                     </Button>
//                   )}
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//         ))
//       ) : (
//         <Col xs={12}>
//           <div className="text-center py-5 text-muted">
//             No bills found for the selected date range
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   // Bill Details Modal
//   const BillDetailsModal = () => (
//     <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//       <Modal.Header closeButton className="bg-primary text-white">
//         <Modal.Title>
//           <FaFilePdf className="me-2" /> Bill Details
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {selectedBill && (
//           <div>
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

//             {selectedBill.approval && selectedBill.approval.comments && (
//               <Row className="mb-3">
//                 <Col md={12}>
//                   <div className="border-bottom pb-2 mb-2">
//                     <small className="text-muted">Approval Comments</small>
//                     <p className="mb-0">{selectedBill.approval.comments}</p>
//                     <small className="text-muted">
//                       Approved on: {formatDate(selectedBill.approval.approvedAt)}
//                     </small>
//                   </div>
//                 </Col>
//               </Row>
//             )}

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
//                         className="me-2"
//                       >
//                         {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
//                       </Button>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//             )}

//             <Row className="mb-3">
//               <Col md={12}>
//                 <div className="border-bottom pb-2 mb-2">
//                   <small className="text-muted">Submitted By</small>
//                   <p className="mb-0">{selectedBill.userDetails?.name}</p>
//                   <small className="text-muted">ID: {selectedBill.userDetails?.userId}</small>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => setShowModal(false)}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//         <Breadcrumb>
//       <Breadcrumb.Item href="/upload-bills-v2">Home</Breadcrumb.Item>
//       <Breadcrumb.Item href="/view-bills-v2">View Bills</Breadcrumb.Item>
//     </Breadcrumb>
//         <hr></hr>
//       {/* Header */}
//       <Row className="mb-4">
//         <Col>
//           <h2 className="text-primary mb-2">📄 My Bills / Expenses</h2>
//           <p className="text-muted">View and track all your submitted bills and expenses</p>
//         </Col>
//       </Row>

//       {/* Date Range Picker */}
//       <Row className="mb-4">
//         <Col md={6}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaCalendarAlt className="me-2" /> Select Date Range
//               </Form.Label>
//               <DateNDateRangePicker />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Form.Label className="fw-semibold">
//                 <FaTag className="me-2" /> Filter by Status
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
//       </Row>

//       {/* Statistics Accordion - Collapsed by default */}
//       {!loading && bills.length > 0 && <StatisticsAccordion />}

//       {/* View Toggle */}
//       <Row className="mb-3">
//         <Col className="d-flex justify-content-between align-items-center">
//           <div className="btn-group">
//             <Button
//               variant={viewType === 'table' ? 'primary' : 'outline-primary'}
//               onClick={() => setViewType('table')}
//             >
//               Table View
//             </Button>
//             <Button
//               variant={viewType === 'card' ? 'primary' : 'outline-primary'}
//               onClick={() => setViewType('card')}
//             >
//               Card View
//             </Button>
//           </div>
//           <div className="text-muted">
//             Showing {filteredBills.length} of {bills.length} bills
//           </div>
//         </Col>
//       </Row>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3 text-muted">Loading your bills...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !loading && (
//         <Alert variant="danger" className="text-center">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Bills Display */}
//       {!loading && !error && (
//         <>
//           {viewType === 'table' ? <TableView /> : <CardView />}
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="d-flex justify-content-center mt-4">
//               <Pagination>
//                 <Pagination.Prev 
//                   onClick={() => paginate(currentPage - 1)} 
//                   disabled={currentPage === 1}
//                 />
//                 {[...Array(totalPages).keys()].map(number => (
//                   <Pagination.Item
//                     key={number + 1}
//                     active={number + 1 === currentPage}
//                     onClick={() => paginate(number + 1)}
//                   >
//                     {number + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next 
//                   onClick={() => paginate(currentPage + 1)} 
//                   disabled={currentPage === totalPages}
//                 />
//               </Pagination>
//             </div>
//           )}
//         </>
//       )}

//       {/* Bill Details Modal */}
//       <BillDetailsModal />

//       <style jsx>{`
//         .table-responsive {
//           overflow-x: auto;
//         }
//         .table th, .table td {
//           vertical-align: middle;
//         }
//         .accordion-button:not(.collapsed) {
//           background-color: #e7f1ff;
//           color: #0d6efd;
//         }
//         .accordion-button:focus {
//           box-shadow: none;
//           border-color: rgba(13, 110, 253, 0.25);
//         }
//       `}</style>
//     </Container>
//   );
// };



















import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DateNDateRangePicker, SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { ViewBillSByLoggedInUserIdandDateRange } from "../../service/Bills.services";
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert, Pagination, Form, Modal, Accordion, Breadcrumb } from "react-bootstrap";
import { 
  FaFilePdf, 
  FaFileImage, 
  FaDownload, 
  FaEye, 
  FaRupeeSign, 
  FaCalendarAlt, 
  FaTag, 
  FaUser, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaMapMarkerAlt,
  FaUtensils,
  FaHotel,
  FaBox,
  FaChartLine,
  FaWallet,
  FaReceipt,
  FaCheck,
  FaHourglassHalf,
  FaFileExport,
  FaTrash
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { deleteBill } from "../../service/Bills.services.js";

export const ViewBillsV2 = () => {
  const { userData } = useContext(UserContext);
  const { 
    startDate, 
    setStartDate,
    endDate, 
    setEndDate,
    dateRange,
    setDateRange
  } = useContext(DateNDateRangeContext);

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [summary, setSummary] = useState({});
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewType, setViewType] = useState('table');
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deletingBillId, setDeletingBillId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  // Set default date range to previous 10 days
  useEffect(() => {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);
    
    // Format dates for the date picker
    const formatDate = (date) => {
      return {
        YYYYMMDD: date.toISOString().split('T')[0],
        DDMMYYYY: date.toLocaleDateString('en-GB').replace(/\//g, '-'),
        ISOformat: date.toISOString()
      };
    };
    
    if (!startDate && !endDate) {
      setStartDate(formatDate(tenDaysAgo));
      setEndDate(formatDate(today));
    }
  }, []);

  // Fetch bills when date range changes
  const fetchBills = useCallback(async () => {
    if (!userData?._id) {
      console.log("No user ID available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reqBody = {
        _id: userData._id,
        startDate: startDate?.YYYYMMDD || startDate,
        endDate: endDate?.YYYYMMDD || endDate
      };

      console.log("Fetching bills with:", reqBody);

      const response = await ViewBillSByLoggedInUserIdandDateRange(reqBody);
      
      if (response.status === "Success") {
        setBills(response.data || []);
        setTotalAmount(response.totalAmount || 0);
        setSummary(response.summary || {});
      } else {
        setError(response.message || "Failed to fetch bills");
      }
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError("Failed to load bills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userData?._id, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate && userData?._id) {
      fetchBills();
    }
  }, [startDate, endDate, userData?._id, fetchBills]);

  // Handle date range change
  const handleDateRangeChange = (range) => {
    if (range && range.startDate && range.endDate) {
      setStartDate(range.startDate);
      setEndDate(range.endDate);
      setDateRange(range);
    }
  };

  // Handle delete bill - Show confirmation modal
  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setShowDeleteConfirm(true);
  };

  // Confirm delete bill
  const confirmDelete = async () => {
    if (!billToDelete) return;
    
    setDeletingBillId(billToDelete._id);
    setShowDeleteConfirm(false);
    
    try {
      const reqBody = {
        _id: billToDelete._id
      };
      
      const response = await deleteBill(reqBody);
      
      if (response.status === "Success") {
        setSuccessMessage(`Bill deleted successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Refresh bills list
        fetchBills();
      } else {
        setError(response.message || "Failed to delete bill");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting bill:", err);
      setError("Failed to delete bill. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeletingBillId(null);
      setBillToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBillToDelete(null);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusColors = {
      'Submitted': 'info',
      'Pending': 'warning',
      'Verified': 'primary',
      'Approved': 'success',
      'Rejected': 'danger',
      'Paid': 'dark'
    };
    return statusColors[status] || 'secondary';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format date for PDF
  const formatDateForPDF = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format currency for PDF (without symbol)
  const formatCurrencyForPDF = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle view bill details
  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  // Export to PDF function
  const exportToPDF = async () => {
    setExporting(true);
    
    try {
      const filteredBills = filterStatus === "All" 
        ? bills 
        : bills.filter(bill => bill.status === filterStatus);

      if (filteredBills.length === 0) {
        alert("No bills to export!");
        setExporting(false);
        return;
      }

      // Create PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.setFont("helvetica", "bold");
      doc.text("Bills/Expenses Report", 14, 20);
      
      // Add user info
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`User: ${userData?.name || 'N/A'} (${userData?.role || 'N/A'})`, 14, 30);
      doc.text(`Email: ${userData?.email || 'N/A'}`, 14, 36);
      doc.text(`User ID: ${userData?._id || 'N/A'}`, 14, 42);
      
      // Add date range
      doc.text(`Date Range: ${formatDateForPDF(startDate?.YYYYMMDD || startDate)} to ${formatDateForPDF(endDate?.YYYYMMDD || endDate)}`, 14, 48);
      
      // Add filter info
      if (filterStatus !== "All") {
        doc.text(`Status Filter: ${filterStatus}`, 14, 54);
      }
      
      // Add summary section
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 64);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      
      const summaryY = 72;
      doc.text(`Total Bills: ${filteredBills.length}`, 14, summaryY);
      doc.text(`Total Amount: ₹${formatCurrencyForPDF(filteredBills.reduce((sum, bill) => sum + (bill.expenseAmount || 0), 0))}`, 14, summaryY + 6);
      
      // Status breakdown
      const statusBreakdown = {};
      filteredBills.forEach(bill => {
        statusBreakdown[bill.status] = (statusBreakdown[bill.status] || 0) + 1;
      });
      
      let yOffset = summaryY + 12;
      doc.text("Status Breakdown:", 14, yOffset);
      yOffset += 6;
      
      Object.entries(statusBreakdown).forEach(([status, count]) => {
        doc.text(`• ${status}: ${count} bill(s)`, 20, yOffset);
        yOffset += 5;
      });
      
      // Add table with bills
      const tableData = filteredBills.map((bill, index) => [
        index + 1,
        formatDateForPDF(bill.expenseDate),
        bill.purposeOfExpense || 'N/A',
        bill.expenseType || 'N/A',
        `₹${formatCurrencyForPDF(bill.expenseAmount)}`,
        bill.status || 'N/A',
        bill.approval?.comments || 'No comments',
        formatDateForPDF(bill.approval?.approvedAt) || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: yOffset + 5,
        head: [['#', 'Date', 'Purpose', 'Type', 'Amount', 'Status', 'Comments', 'Approved On']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 40 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 35 },
          7: { cellWidth: 25 }
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Add footer on each page
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Generated on: ${new Date().toLocaleString()} | Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });
      
      // Add total amount at the end
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text(
        `Grand Total: ₹${formatCurrencyForPDF(filteredBills.reduce((sum, bill) => sum + (bill.expenseAmount || 0), 0))}`,
        14,
        finalY
      );
      
      // Save PDF
      doc.save(`Bills_Report_${userData?.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Export detailed PDF with complete bill information
  const exportDetailedPDF = async () => {
    setExporting(true);
    
    try {
      const filteredBills = filterStatus === "All" 
        ? bills 
        : bills.filter(bill => bill.status === filterStatus);

      if (filteredBills.length === 0) {
        alert("No bills to export!");
        setExporting(false);
        return;
      }

      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add header with logo placeholder
      doc.setFontSize(22);
      doc.setTextColor(13, 110, 253);
      doc.setFont("helvetica", "bold");
      doc.text("EXPENSE BILLS REPORT", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      
      // User Information Section
      doc.setFillColor(240, 248, 255);
      doc.rect(14, 28, 180, 35, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Information", 20, 36);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${userData?.name || 'N/A'}`, 20, 44);
      doc.text(`Role: ${userData?.role || 'N/A'}`, 20, 50);
      doc.text(`Email: ${userData?.email || 'N/A'}`, 20, 56);
      
      // Report Information
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Report Information", 14, 72);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Period: ${formatDateForPDF(startDate?.YYYYMMDD || startDate)} to ${formatDateForPDF(endDate?.YYYYMMDD || endDate)}`, 14, 80);
      doc.text(`Status Filter: ${filterStatus === "All" ? "All Statuses" : filterStatus}`, 14, 86);
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 92);
      
      // Statistics Section
      const totalAmt = filteredBills.reduce((sum, bill) => sum + (bill.expenseAmount || 0), 0);
      const approvedAmt = filteredBills.filter(b => b.status === 'Approved').reduce((sum, bill) => sum + (bill.expenseAmount || 0), 0);
      const pendingAmt = filteredBills.filter(b => b.status === 'Pending').reduce((sum, bill) => sum + (bill.expenseAmount || 0), 0);
      
      doc.setFillColor(230, 242, 255);
      doc.rect(14, 98, 180, 30, 'F');
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Financial Summary", 20, 106);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Bills: ${filteredBills.length}`, 20, 114);
      doc.text(`Total Amount: ₹${formatCurrencyForPDF(totalAmt)}`, 80, 114);
      doc.text(`Approved Amount: ₹${formatCurrencyForPDF(approvedAmt)}`, 140, 114);
      doc.text(`Pending Amount: ₹${formatCurrencyForPDF(pendingAmt)}`, 20, 122);
      
      // Detailed Bills Table
      const tableData = filteredBills.map((bill, index) => [
        index + 1,
        formatDateForPDF(bill.expenseDate),
        bill.purposeOfExpense || 'N/A',
        bill.expenseType || 'N/A',
        `₹${formatCurrencyForPDF(bill.expenseAmount)}`,
        bill.status || 'N/A',
        bill.approval?.comments || 'Pending approval',
        bill.approval?.approvedBy ? `${bill.approval.approvedBy.name || 'N/A'}` : 'N/A'
      ]);
      
      autoTable(doc, {
        startY: 132,
        head: [['#', 'Date', 'Purpose', 'Type', 'Amount', 'Status', 'Comments', 'Approved By']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 18, halign: 'center' },
          2: { cellWidth: 38 },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 18, halign: 'right' },
          5: { cellWidth: 18, halign: 'center' },
          6: { cellWidth: 35 },
          7: { cellWidth: 20, halign: 'center' }
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Add footer on each page
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Generated on: ${new Date().toLocaleString()} | Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });
      
      // Add signature and declaration
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text("Declaration: This report is system-generated and does not require a signature.", 14, finalY);
      doc.text("For any discrepancies, please contact the finance department.", 14, finalY + 5);
      
      // Save PDF
      doc.save(`Detailed_Bills_Report_${userData?.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("Error generating detailed PDF:", error);
      alert("Failed to generate detailed PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Filter bills by status
  const filteredBills = filterStatus === "All" 
    ? bills 
    : bills.filter(bill => bill.status === filterStatus);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status options for filter
  const statusOptions = ["All", "Submitted", "Pending", "Verified", "Approved", "Rejected", "Paid"];

  // Bill summary statistics in Accordion
  const StatisticsAccordion = () => (
    <Accordion 
      defaultActiveKey={accordionOpen ? "0" : ""} 
      className="mb-4"
      onSelect={(eventKey) => setAccordionOpen(eventKey === "0")}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="d-flex align-items-center gap-2">
            <FaChartLine className="text-primary" />
            <strong>View Statistics Summary</strong>
            <Badge bg="primary" className="ms-2">
              {summary.totalBills || 0} Bills | {formatCurrency(totalAmount)}
            </Badge>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Row className="g-3">
            <Col md={3} sm={6}>
              <Card className="border-0 shadow-sm bg-primary text-white h-100">
                <Card.Body className="text-center">
                  <FaWallet size={24} className="mb-2" />
                  <h4 className="mb-0">{formatCurrency(totalAmount)}</h4>
                  <small>Total Expenses</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="border-0 shadow-sm bg-success text-white h-100">
                <Card.Body className="text-center">
                  <FaReceipt size={24} className="mb-2" />
                  <h4 className="mb-0">{summary.totalBills || 0}</h4>
                  <small>Total Bills</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="border-0 shadow-sm bg-info text-white h-100">
                <Card.Body className="text-center">
                  <FaCheck size={24} className="mb-2" />
                  <h4 className="mb-0">{summary.statusBreakdown?.Approved || 0}</h4>
                  <small>Approved Bills</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="border-0 shadow-sm bg-warning text-dark h-100">
                <Card.Body className="text-center">
                  <FaHourglassHalf size={24} className="mb-2" />
                  <h4 className="mb-0">{summary.statusBreakdown?.Pending || 0}</h4>
                  <small>Pending Bills</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Detailed Status Breakdown */}
          {(summary.statusBreakdown?.Submitted > 0 || 
            summary.statusBreakdown?.Verified > 0 || 
            summary.statusBreakdown?.Rejected > 0 || 
            summary.statusBreakdown?.Paid > 0) && (
            <Row className="mt-3">
              <Col xs={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h6 className="text-primary mb-3">Detailed Status Breakdown</h6>
                    <div className="d-flex flex-wrap gap-3">
                      {summary.statusBreakdown?.Submitted > 0 && (
                        <div className="text-center">
                          <Badge bg="info" className="p-2">Submitted</Badge>
                          <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Submitted}</p>
                        </div>
                      )}
                      {summary.statusBreakdown?.Verified > 0 && (
                        <div className="text-center">
                          <Badge bg="primary" className="p-2">Verified</Badge>
                          <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Verified}</p>
                        </div>
                      )}
                      {summary.statusBreakdown?.Rejected > 0 && (
                        <div className="text-center">
                          <Badge bg="danger" className="p-2">Rejected</Badge>
                          <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Rejected}</p>
                        </div>
                      )}
                      {summary.statusBreakdown?.Paid > 0 && (
                        <div className="text-center">
                          <Badge bg="dark" className="p-2">Paid</Badge>
                          <p className="mt-1 mb-0 fw-bold">{summary.statusBreakdown.Paid}</p>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  // Table View
  const TableView = () => (
    <div className="table-responsive">
      <Table striped bordered hover className="align-middle">
        <thead className="bg-light">
          <tr>
            <th>#</th>
            <th>Bill Date</th>
            <th>Purpose</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBills.length > 0 ? (
            currentBills.map((bill, index) => (
              <tr key={bill._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{formatDate(bill.expenseDate)}</td>
                <td className="fw-semibold">{bill.purposeOfExpense}</td>
                <td>
                  <Badge bg="secondary">{bill.expenseType}</Badge>
                </td>
                <td className="text-success fw-bold">{formatCurrency(bill.expenseAmount)}</td>
                <td>
                  <Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleViewBill(bill)}
                    >
                      <FaEye /> View
                    </Button>
                    {bill.fileUrl && (
                      <Button
                        size="sm"
                        variant="outline-success"
                        href={bill.fileUrl}
                        target="_blank"
                      >
                        <FaDownload /> Receipt
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteClick(bill)}
                      disabled={deletingBillId === bill._id}
                    >
                      {deletingBillId === bill._id ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        <><FaTrash /> Delete</>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-5 text-muted">
                No bills found for the selected date range
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );

  // Card View
  const CardView = () => (
    <Row className="g-3">
      {currentBills.length > 0 ? (
        currentBills.map((bill, index) => (
          <Col md={6} lg={4} key={bill._id}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg={getStatusBadge(bill.status)}>{bill.status}</Badge>
                  <small className="text-muted">{formatDate(bill.expenseDate)}</small>
                </div>
              </Card.Header>
              <Card.Body>
                <h6 className="mb-2">{bill.purposeOfExpense}</h6>
                <div className="mb-2">
                  <Badge bg="secondary" className="me-2">{bill.expenseType}</Badge>
                </div>
                <div className="mb-2">
                  <strong className="text-success">{formatCurrency(bill.expenseAmount)}</strong>
                </div>
                {bill.expenseType === "Travel" && (
                  <div className="small text-muted">
                    <FaMapMarkerAlt className="me-1" />
                    {bill.travelFrom} → {bill.travelTo}
                  </div>
                )}
                {bill.expenseType === "Food" && (
                  <div className="small text-muted">
                    <FaUtensils className="me-1" />
                    {bill.foodType}
                  </div>
                )}
                {bill.expenseType === "Accommodation" && (
                  <div className="small text-muted">
                    <FaHotel className="me-1" />
                    Stayed: {bill.stayedForDays} days
                  </div>
                )}
                {bill.descriptionExpense && (
                  <div className="small text-muted mt-2">
                    <FaInfoCircle className="me-1" />
                    {bill.descriptionExpense.substring(0, 100)}...
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleViewBill(bill)}
                    className="flex-grow-1"
                  >
                    <FaEye /> View Details
                  </Button>
                  {bill.fileUrl && (
                    <Button
                      size="sm"
                      variant="outline-success"
                      href={bill.fileUrl}
                      target="_blank"
                    >
                      <FaDownload />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteClick(bill)}
                    disabled={deletingBillId === bill._id}
                  >
                    {deletingBillId === bill._id ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))
      ) : (
        <Col xs={12}>
          <div className="text-center py-5 text-muted">
            No bills found for the selected date range
          </div>
        </Col>
      )}
    </Row>
  );

  // Bill Details Modal
  const BillDetailsModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaFilePdf className="me-2" /> Bill Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedBill && (
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
              <Col md={6}>
                <div className="border-bottom pb-2 mb-2">
                  <small className="text-muted">Purpose</small>
                  <p className="mb-0">{selectedBill.purposeOfExpense}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="border-bottom pb-2 mb-2">
                  <small className="text-muted">Expense Type</small>
                  <p className="mb-0">{selectedBill.expenseType}</p>
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

            {selectedBill.approval && selectedBill.approval.comments && (
              <Row className="mb-3">
                <Col md={12}>
                  <div className="border-bottom pb-2 mb-2">
                    <small className="text-muted">Approval Comments</small>
                    <p className="mb-0">{selectedBill.approval.comments}</p>
                    <small className="text-muted">
                      Approved on: {formatDate(selectedBill.approval.approvedAt)}
                    </small>
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
                      <Button
                        variant="primary"
                        href={selectedBill.fileUrl}
                        target="_blank"
                        className="me-2"
                      >
                        {selectedBill.fileName?.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />} View Receipt
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            )}

            <Row className="mb-3">
              <Col md={12}>
                <div className="border-bottom pb-2 mb-2">
                  <small className="text-muted">Submitted By</small>
                  <p className="mb-0">{selectedBill.userDetails?.name}</p>
                  <small className="text-muted">ID: {selectedBill.userDetails?.userId}</small>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <Modal show={showDeleteConfirm} onHide={cancelDelete} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <FaTrash className="me-2" /> Confirm Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {billToDelete && (
          <div>
            <p className="mb-3">Are you sure you want to delete this bill?</p>
            <div className="alert alert-warning">
              <strong>Bill Details:</strong><br />
              <strong>ID:</strong> {billToDelete._id}<br />
              <strong>Purpose:</strong> {billToDelete.purposeOfExpense}<br />
              <strong>Amount:</strong> {formatCurrency(billToDelete.expenseAmount)}<br />
              <strong>Status:</strong> {billToDelete.status}<br />
              <strong>Date:</strong> {formatDate(billToDelete.expenseDate)}
            </div>
            <p className="text-danger mb-0">⚠️ This action cannot be undone!</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelDelete}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirmDelete}>
          <FaTrash className="me-2" /> Yes, Delete Bill
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className="mt-4 mb-4">
      <Breadcrumb>
        <Breadcrumb.Item href="/upload-bills-v2">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/view-bills-v2">View Bills</Breadcrumb.Item>
      </Breadcrumb>
      <hr />
      
      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
          <FaCheckCircle className="me-2" /> {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <FaTimesCircle className="me-2" /> {error}
        </Alert>
      )}
      
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary mb-2">📄 My Bills / Expenses</h2>
          <p className="text-muted">View and track all your submitted bills and expenses</p>
        </Col>
      </Row>

      {/* Date Range Picker */}
      <Row className="mb-4">
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Label className="fw-semibold">
                <FaCalendarAlt className="me-2" /> Select Date Range
              </Form.Label>
              <DateNDateRangePicker />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Label className="fw-semibold">
                <FaTag className="me-2" /> Filter by Status
              </Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {statusOptions.map(status => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          {/* <Card className="shadow-sm h-100">
            <Card.Body>
              <Form.Label className="fw-semibold">
                <FaFileExport className="me-2" /> Export Report
              </Form.Label>
              <div className="d-flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={exportToPDF}
                  disabled={exporting || bills.length === 0}
                  className="flex-grow-1"
                >
                  {exporting ? <Spinner size="sm" animation="border" /> : <><FaFilePdf className="me-1" /> Quick PDF</>}
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={exportDetailedPDF}
                  disabled={exporting || bills.length === 0}
                  className="flex-grow-1"
                >
                  {exporting ? <Spinner size="sm" animation="border" /> : <><FaFileExport className="me-1" /> Detailed PDF</>}
                </Button>
              </div>
              <small className="text-muted mt-2 d-block">
                Export filtered bills with comments & details
              </small>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>

      {/* Statistics Accordion - Collapsed by default */}
      {!loading && bills.length > 0 && <StatisticsAccordion />}

      {/* View Toggle */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <div className="btn-group">
            <Button
              variant={viewType === 'table' ? 'primary' : 'outline-primary'}
              onClick={() => setViewType('table')}
            >
              Table View
            </Button>
            <Button
              variant={viewType === 'card' ? 'primary' : 'outline-primary'}
              onClick={() => setViewType('card')}
            >
              Card View
            </Button>
          </div>
          <div className="text-muted">
            Showing {filteredBills.length} of {bills.length} bills
          </div>
        </Col>
      </Row>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your bills...</p>
        </div>
      )}

      {/* Bills Display */}
      {!loading && !error && (
        <>
          {viewType === 'table' ? <TableView /> : <CardView />}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages).keys()].map(number => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => paginate(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Bill Details Modal */}
      <BillDetailsModal />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />

      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        .table th, .table td {
          vertical-align: middle;
        }
        .accordion-button:not(.collapsed) {
          background-color: #e7f1ff;
          color: #0d6efd;
        }
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </Container>
  );
};