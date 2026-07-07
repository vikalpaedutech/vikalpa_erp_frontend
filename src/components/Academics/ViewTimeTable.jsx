// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetTimeTable, DeleteTimeTable } from "../../service/Academic/Academic.services";
// import { 
//   Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
//   Table, Modal, Pagination 
// } from "react-bootstrap";
// import { 
//   FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
//   FaClipboardList, FaTrash, FaEye, FaDownload, FaPrint,
//   FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaPlus,
//   FaArrowLeft
// } from "react-icons/fa";
// import { format } from "date-fns";

// export const ViewTimeTable = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // State for search/filter
//   const [searchParams, setSearchParams] = useState({
//     date: getTodayDate(), // Set today's date by default
//     startDate: "",
//     endDate: "",
//     unqUserObjectId: userData?._id || ""
//   });

//   // State for data
//   const [timetableData, setTimetableData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // State for modal
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [entryToDelete, setEntryToDelete] = useState(null);

//   // State for bulk delete
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Update unqUserObjectId when userData changes
//   useEffect(() => {
//     if (userData?._id) {
//       setSearchParams(prev => ({
//         ...prev,
//         unqUserObjectId: userData._id
//       }));
//     }
//   }, [userData]);

//   // Auto-fetch data on component mount with today's date
//   useEffect(() => {
//     if (userData?._id) {
//       fetchTimeTable();
//     }
//   }, [userData]);

//   // Fetch timetable data
//   const fetchTimeTable = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // Prepare request data
//       const requestData = {};
      
//       if (searchParams.unqUserObjectId) {
//         requestData.unqUserObjectId = searchParams.unqUserObjectId;
//       }

//       // Check if date or date range is provided
//       if (searchParams.date) {
//         requestData.date = searchParams.date;
//       } else if (searchParams.startDate && searchParams.endDate) {
//         requestData.startDate = searchParams.startDate;
//         requestData.endDate = searchParams.endDate;
//       }

//       console.log("🔍 Fetching timetable with:", requestData);
      
//       const response = await GetTimeTable(requestData);
      
//       console.log("📦 Response:", response);

//       if (response && response.success) {
//         setTimetableData(response.data || []);
//         setFilteredData(response.data || []);
//         const count = response.count || response.data?.length || 0;
//         setSuccess(`Found ${count} entries for ${searchParams.date || 'selected date range'}`);
//         setCurrentPage(1);
//         setSelectedIds([]);
//         setSelectAll(false);
//       } else {
//         setError(response?.message || "Failed to fetch timetable data");
//         setTimetableData([]);
//         setFilteredData([]);
//       }
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while fetching timetable");
//       }
//       setTimetableData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search input changes
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear date if startDate/endDate is set and vice versa
//     if (name === 'date' && value) {
//       setSearchParams(prev => ({
//         ...prev,
//         startDate: "",
//         endDate: ""
//       }));
//     }
//     if ((name === 'startDate' || name === 'endDate') && value) {
//       setSearchParams(prev => ({
//         ...prev,
//         date: ""
//       }));
//     }
//   };

//   // Handle search submit
//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchTimeTable();
//   };

//   // Clear search filters
//   const clearFilters = () => {
//     setSearchParams({
//       date: getTodayDate(), // Reset to today's date
//       startDate: "",
//       endDate: "",
//       unqUserObjectId: userData?._id || ""
//     });
//     setTimetableData([]);
//     setFilteredData([]);
//     setError(null);
//     setSuccess(null);
//     setSelectedIds([]);
//     setSelectAll(false);
//   };

//   // Handle view entry
//   const handleViewEntry = (entry) => {
//     setSelectedEntry(entry);
//     setShowModal(true);
//   };

//   // Handle delete single entry
//   const handleDeleteEntry = async () => {
//     if (!entryToDelete) return;

//     setLoading(true);
//     try {
//       const response = await DeleteTimeTable({ ids: entryToDelete._id });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted timetable entry`);
//         // Refresh data
//         fetchTimeTable();
//         setShowDeleteModal(false);
//         setEntryToDelete(null);
//       } else {
//         setError(response?.message || "Failed to delete entry");
//       }
//     } catch (err) {
//       console.error("❌ Delete Error:", err);
//       setError(err.message || "Failed to delete entry");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle bulk delete
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       setError("Please select at least one entry to delete");
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} entries?`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await DeleteTimeTable({ ids: selectedIds });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted ${response.deletedCount} entries`);
//         setSelectedIds([]);
//         setSelectAll(false);
//         fetchTimeTable();
//       } else {
//         setError(response?.message || "Failed to delete entries");
//       }
//     } catch (err) {
//       console.error("❌ Bulk Delete Error:", err);
//       setError(err.message || "Failed to delete entries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedIds([]);
//     } else {
//       const allIds = filteredData.map(item => item._id);
//       setSelectedIds(allIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Handle single select
//   const handleSelect = (id) => {
//     setSelectedIds(prev => {
//       if (prev.includes(id)) {
//         return prev.filter(item => item !== id);
//       } else {
//         return [...prev, id];
//       }
//     });
//   };

//   // Navigate to create timetable
//   const handleCreateTimetable = () => {
//     navigate("/create-time-table");
//   };

//   // Navigate back
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     try {
//       return format(new Date(date), "dd MMM yyyy");
//     } catch {
//       return date;
//     }
//   };

//   // Format time
//   const formatTime = (time) => {
//     if (!time) return "N/A";
//     return time;
//   };

//   // Get badge color based on objective
//   const getObjectiveBadgeColor = (objective) => {
//     const colors = {
//       "Class lecture": "primary",
//       "Class Lecture": "primary",
//       "Lunch": "warning",
//       "Break": "secondary",
//       "Subjective Test": "danger",
//       "Objective Test": "info",
//       "Assembly": "primary",
//       "Lunch Break": "warning",
//       "Competition": "success",
//       "Event": "info",
//       "Programme": "info",
//       "Orientation": "secondary",
//       "Exam": "danger",
//       "Doubt Session": "success",
//       "Other": "dark"
//     };
//     return colors[objective] || "secondary";
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row>
//         <Col>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleGoBack}
//                     className="me-2"
//                   >
//                     <FaArrowLeft />
//                   </Button>
//                   <FaCalendarAlt className="me-2" size={24} />
//                   <h4 className="mb-0">View Timetable</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleCreateTimetable}
//                     className="d-flex align-items-center"
//                   >
//                     <FaPlus className="me-1" />
//                     Create New
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               {/* Search Filters */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <h6 className="mb-0">🔍 Search Filters</h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <Form onSubmit={handleSearch}>
//                     <Row>
//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             Specific Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="date"
//                             value={searchParams.date}
//                             onChange={handleSearchChange}
//                             placeholder="Select specific date"
//                           />
//                           {searchParams.date && (
//                             <small className="text-muted d-block mt-1">
//                               Showing entries for: {formatDate(searchParams.date)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             Start Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="startDate"
//                             value={searchParams.startDate}
//                             onChange={handleSearchChange}
//                           />
//                           {searchParams.startDate && (
//                             <small className="text-muted d-block mt-1">
//                               From: {formatDate(searchParams.startDate)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             End Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="endDate"
//                             value={searchParams.endDate}
//                             onChange={handleSearchChange}
//                           />
//                           {searchParams.endDate && (
//                             <small className="text-muted d-block mt-1">
//                               To: {formatDate(searchParams.endDate)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col xs={12} className="mb-3">
//                         <div className="d-flex gap-2 flex-wrap">
//                           <Button
//                             type="submit"
//                             variant="primary"
//                             disabled={loading}
//                           >
//                             <FaSearch className="me-2" />
//                             Search
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             onClick={clearFilters}
//                             disabled={loading}
//                           >
//                             <FaTimes className="me-2" />
//                             Clear & Reset to Today
//                           </Button>
//                           <Button
//                             variant="info"
//                             onClick={fetchTimeTable}
//                             disabled={loading}
//                             className="text-white"
//                           >
//                             <FaEye className="me-2" />
//                             Refresh
//                           </Button>
//                           <Button
//                             variant="success"
//                             onClick={handleCreateTimetable}
//                             className="ms-auto"
//                           >
//                             <FaPlus className="me-2" />
//                             Create New Entry
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Card.Body>
//               </Card>

//               {/* Current Filter Info */}
//               {searchParams.date && !searchParams.startDate && !searchParams.endDate && (
//                 <Alert variant="info" className="mb-3">
//                   <strong>📅 Viewing entries for:</strong> {formatDate(searchParams.date)}
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     className="ms-3"
//                     onClick={() => {
//                       setSearchParams(prev => ({
//                         ...prev,
//                         date: "",
//                         startDate: "",
//                         endDate: ""
//                       }));
//                     }}
//                   >
//                     <FaTimes className="me-1" />
//                     Clear Date
//                   </Button>
//                 </Alert>
//               )}

//               {(searchParams.startDate || searchParams.endDate) && (
//                 <Alert variant="info" className="mb-3">
//                   <strong>📅 Date Range:</strong> 
//                   {searchParams.startDate && ` From ${formatDate(searchParams.startDate)}`}
//                   {searchParams.endDate && ` To ${formatDate(searchParams.endDate)}`}
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     className="ms-3"
//                     onClick={() => {
//                       setSearchParams(prev => ({
//                         ...prev,
//                         startDate: "",
//                         endDate: "",
//                         date: getTodayDate()
//                       }));
//                     }}
//                   >
//                     <FaTimes className="me-1" />
//                     Clear Range
//                   </Button>
//                 </Alert>
//               )}

//               {/* Bulk Actions */}
//               {filteredData.length > 0 && (
//                 <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
//                   <div>
//                     <Form.Check
//                       type="checkbox"
//                       label={`Select All (${filteredData.length})`}
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                     />
//                   </div>
//                   <div className="d-flex gap-2">
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={handleBulkDelete}
//                       disabled={selectedIds.length === 0 || loading}
//                     >
//                       <FaTrash className="me-1" />
//                       Delete Selected ({selectedIds.length})
//                     </Button>
//                     <Button
//                       variant="success"
//                       size="sm"
//                       onClick={handleCreateTimetable}
//                     >
//                       <FaPlus className="me-1" />
//                       Add New
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading timetable data...</p>
//                 </div>
//               )}

//               {/* Data Table */}
//               {!loading && filteredData.length === 0 && (
//                 <Alert variant="info" className="text-center">
//                   <h5>No timetable entries found</h5>
//                   <p className="mb-0">
//                     {searchParams.date && `No entries found for ${formatDate(searchParams.date)}`}
//                     {!searchParams.date && searchParams.startDate && searchParams.endDate && 
//                       `No entries found in the selected date range`}
//                     {!searchParams.date && !searchParams.startDate && !searchParams.endDate && 
//                       `No entries found`}
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     className="mt-3"
//                     onClick={handleCreateTimetable}
//                   >
//                     <FaPlus className="me-2" />
//                     Create Your First Entry
//                   </Button>
//                 </Alert>
//               )}

//               {!loading && filteredData.length > 0 && (
//                 <>
//                   <div className="table-responsive">
//                     <Table striped bordered hover className="mb-0">
//                       <thead className="bg-light">
//                         <tr>
//                           <th style={{ width: '40px' }}>#</th>
//                           <th style={{ width: '40px' }}>
//                             <Form.Check
//                               type="checkbox"
//                               checked={selectAll}
//                               onChange={handleSelectAll}
//                             />
//                           </th>
//                           <th>Date</th>
//                           <th>Time</th>
//                           <th>Subject</th>
//                           <th>Objective</th>
//                           <th>Board/Batch</th>
//                           <th style={{ width: '150px' }}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentItems.map((entry, index) => (
//                           <tr key={entry._id}>
//                             <td>{indexOfFirstItem + index + 1}</td>
//                             <td>
//                               <Form.Check
//                                 type="checkbox"
//                                 checked={selectedIds.includes(entry._id)}
//                                 onChange={() => handleSelect(entry._id)}
//                               />
//                             </td>
//                             <td>{formatDate(entry.date)}</td>
//                             <td>{formatTime(entry.time)}</td>
//                             <td>
//                               <Badge bg="info">{entry.subject || "N/A"}</Badge>
//                             </td>
//                             <td>
//                               <Badge bg={getObjectiveBadgeColor(entry.objectiveOfDay)}>
//                                 {entry.objectiveOfDay || "N/A"}
//                               </Badge>
//                             </td>
//                             <td>
//                               <div>
//                                 <small className="d-block">{entry.board || "N/A"}</small>
//                                 <small className="d-block text-muted">{entry.batch || "N/A"}</small>
//                               </div>
//                             </td>
//                             <td>
//                               <div className="d-flex gap-1">
//                                 <Button
//                                   variant="outline-info"
//                                   size="sm"
//                                   onClick={() => handleViewEntry(entry)}
//                                   title="View Details"
//                                 >
//                                   <FaEye />
//                                 </Button>
//                                 <Button
//                                   variant="outline-danger"
//                                   size="sm"
//                                   onClick={() => {
//                                     setEntryToDelete(entry);
//                                     setShowDeleteModal(true);
//                                   }}
//                                   title="Delete"
//                                 >
//                                   <FaTrash />
//                                 </Button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="d-flex justify-content-center mt-3">
//                       <Pagination>
//                         <Pagination.First 
//                           onClick={() => paginate(1)} 
//                           disabled={currentPage === 1}
//                         />
//                         <Pagination.Prev 
//                           onClick={() => paginate(currentPage - 1)} 
//                           disabled={currentPage === 1}
//                         />
//                         {[...Array(totalPages)].map((_, idx) => (
//                           <Pagination.Item
//                             key={idx + 1}
//                             active={idx + 1 === currentPage}
//                             onClick={() => paginate(idx + 1)}
//                           >
//                             {idx + 1}
//                           </Pagination.Item>
//                         ))}
//                         <Pagination.Next 
//                           onClick={() => paginate(currentPage + 1)} 
//                           disabled={currentPage === totalPages}
//                         />
//                         <Pagination.Last 
//                           onClick={() => paginate(totalPages)} 
//                           disabled={currentPage === totalPages}
//                         />
//                       </Pagination>
//                     </div>
//                   )}

//                   {/* Summary */}
//                   <div className="mt-3 text-muted">
//                     <small>
//                       Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
//                     </small>
//                   </div>
//                 </>
//               )}
//             </Card.Body>

//             <Card.Footer className="bg-light text-muted">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <small>
//                   <FaUserGraduate className="me-1" />
//                   User ID: {userData?._id || "Not logged in"}
//                 </small>
//                 <Button
//                   variant="link"
//                   size="sm"
//                   onClick={handleCreateTimetable}
//                   className="text-decoration-none"
//                 >
//                   <FaPlus className="me-1" />
//                   Create New Timetable Entry
//                 </Button>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>

//       {/* View Details Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <FaCalendarAlt className="me-2 text-primary" />
//             Timetable Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedEntry && (
//             <Row>
//               <Col md={6}>
//                 <h6 className="text-muted">Basic Information</h6>
//                 <div className="mb-3">
//                   <strong>Date:</strong> {formatDate(selectedEntry.date)}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Time:</strong> {formatTime(selectedEntry.time)}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Objective:</strong>{" "}
//                   <Badge bg={getObjectiveBadgeColor(selectedEntry.objectiveOfDay)}>
//                     {selectedEntry.objectiveOfDay || "N/A"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h6 className="text-muted">Additional Details</h6>
//                 <div className="mb-3">
//                   <strong>Board:</strong> {selectedEntry.board || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Status:</strong>{" "}
//                   <Badge bg={selectedEntry.isObjectiveDone ? "success" : "warning"}>
//                     {selectedEntry.isObjectiveDone ? "Completed" : "Pending"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Remark:</strong> {selectedEntry.remark || "N/A"}
//                 </div>
//               </Col>
//               <Col xs={12}>
//                 <hr />
//                 <h6 className="text-muted">Chapters & Exercises</h6>
//                 <Row>
//                   <Col md={6}>
//                     <strong>Chapters:</strong>
//                     <div className="d-flex flex-wrap gap-1 mt-1">
//                       {selectedEntry.chapter && selectedEntry.chapter.length > 0 ? (
//                         selectedEntry.chapter.map((ch, idx) => (
//                           <Badge key={idx} bg="info" className="me-1">
//                             {ch}
//                           </Badge>
//                         ))
//                       ) : (
//                         <span className="text-muted">No chapters</span>
//                       )}
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <strong>Exercises:</strong>
//                     <div className="d-flex flex-wrap gap-1 mt-1">
//                       {selectedEntry.excerciseNo && selectedEntry.excerciseNo.length > 0 ? (
//                         selectedEntry.excerciseNo.map((ex, idx) => (
//                           <Badge key={idx} bg="success" className="me-1">
//                             {ex}
//                           </Badge>
//                         ))
//                       ) : (
//                         <span className="text-muted">No exercises</span>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={() => {
//               if (selectedEntry) {
//                 window.print();
//               }
//             }}
//           >
//             <FaPrint className="me-2" />
//             Print
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={handleCreateTimetable}
//           >
//             <FaPlus className="me-2" />
//             Create New
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title className="text-danger">
//             <FaTrash className="me-2" />
//             Confirm Delete
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete this timetable entry?</p>
//           {entryToDelete && (
//             <div className="bg-light p-3 rounded">
//               <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
//               <p><strong>Time:</strong> {formatTime(entryToDelete.time)}</p>
//               <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
//             </div>
//           )}
//           <p className="text-danger mt-2">This action cannot be undone!</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDeleteEntry} disabled={loading}>
//             {loading ? "Deleting..." : "Yes, Delete"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewTimeTable;















// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetTimeTable, DeleteTimeTable } from "../../service/Academic/Academic.services";
// import { 
//   Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
//   Table, Modal, Pagination 
// } from "react-bootstrap";
// import { 
//   FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
//   FaClipboardList, FaTrash, FaEye, FaDownload, FaPrint,
//   FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaPlus,
//   FaArrowLeft, FaLock
// } from "react-icons/fa";
// import { format } from "date-fns";

// export const ViewTimeTable = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Check if user has permission to delete
//   const canDelete = userData?.role === "Admin" || userData?.role === "Academic Head";

//   // Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // State for search/filter
//   const [searchParams, setSearchParams] = useState({
//     date: getTodayDate(), // Set today's date by default
//     startDate: "",
//     endDate: "",
//     unqUserObjectId: userData?._id || ""
//   });

//   // State for data
//   const [timetableData, setTimetableData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // State for modal
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [entryToDelete, setEntryToDelete] = useState(null);

//   // State for bulk delete
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Update unqUserObjectId when userData changes
//   useEffect(() => {
//     if (userData?._id) {
//       setSearchParams(prev => ({
//         ...prev,
//         unqUserObjectId: userData._id
//       }));
//     }
//   }, [userData]);

//   // Auto-fetch data on component mount with today's date
//   useEffect(() => {
//     if (userData?._id) {
//       fetchTimeTable();
//     }
//   }, [userData]);

//   // Fetch timetable data
//   const fetchTimeTable = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // Prepare request data
//       const requestData = {};
      
//       if (searchParams.unqUserObjectId) {
//         requestData.unqUserObjectId = searchParams.unqUserObjectId;
//       }

//       // Check if date or date range is provided
//       if (searchParams.date) {
//         requestData.date = searchParams.date;
//       } else if (searchParams.startDate && searchParams.endDate) {
//         requestData.startDate = searchParams.startDate;
//         requestData.endDate = searchParams.endDate;
//       }

//       console.log("🔍 Fetching timetable with:", requestData);
      
//       const response = await GetTimeTable(requestData);
      
//       console.log("📦 Response:", response);

//       if (response && response.success) {
//         setTimetableData(response.data || []);
//         setFilteredData(response.data || []);
//         const count = response.count || response.data?.length || 0;
//         setSuccess(`Found ${count} entries for ${searchParams.date || 'selected date range'}`);
//         setCurrentPage(1);
//         setSelectedIds([]);
//         setSelectAll(false);
//       } else {
//         setError(response?.message || "Failed to fetch timetable data");
//         setTimetableData([]);
//         setFilteredData([]);
//       }
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while fetching timetable");
//       }
//       setTimetableData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search input changes
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear date if startDate/endDate is set and vice versa
//     if (name === 'date' && value) {
//       setSearchParams(prev => ({
//         ...prev,
//         startDate: "",
//         endDate: ""
//       }));
//     }
//     if ((name === 'startDate' || name === 'endDate') && value) {
//       setSearchParams(prev => ({
//         ...prev,
//         date: ""
//       }));
//     }
//   };

//   // Handle search submit
//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchTimeTable();
//   };

//   // Clear search filters
//   const clearFilters = () => {
//     setSearchParams({
//       date: getTodayDate(), // Reset to today's date
//       startDate: "",
//       endDate: "",
//       unqUserObjectId: userData?._id || ""
//     });
//     setTimetableData([]);
//     setFilteredData([]);
//     setError(null);
//     setSuccess(null);
//     setSelectedIds([]);
//     setSelectAll(false);
//   };

//   // Handle view entry
//   const handleViewEntry = (entry) => {
//     setSelectedEntry(entry);
//     setShowModal(true);
//   };

//   // Handle delete single entry
//   const handleDeleteEntry = async () => {
//     if (!entryToDelete) return;

//     // Check permission again before deleting
//     if (!canDelete) {
//       setError("You don't have permission to delete entries");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await DeleteTimeTable({ ids: entryToDelete._id });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted timetable entry`);
//         // Refresh data
//         fetchTimeTable();
//         setShowDeleteModal(false);
//         setEntryToDelete(null);
//       } else {
//         setError(response?.message || "Failed to delete entry");
//       }
//     } catch (err) {
//       console.error("❌ Delete Error:", err);
//       setError(err.message || "Failed to delete entry");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle bulk delete
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       setError("Please select at least one entry to delete");
//       return;
//     }

//     // Check permission before bulk delete
//     if (!canDelete) {
//       setError("You don't have permission to delete entries");
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} entries?`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await DeleteTimeTable({ ids: selectedIds });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted ${response.deletedCount} entries`);
//         setSelectedIds([]);
//         setSelectAll(false);
//         fetchTimeTable();
//       } else {
//         setError(response?.message || "Failed to delete entries");
//       }
//     } catch (err) {
//       console.error("❌ Bulk Delete Error:", err);
//       setError(err.message || "Failed to delete entries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedIds([]);
//     } else {
//       const allIds = filteredData.map(item => item._id);
//       setSelectedIds(allIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Handle single select
//   const handleSelect = (id) => {
//     setSelectedIds(prev => {
//       if (prev.includes(id)) {
//         return prev.filter(item => item !== id);
//       } else {
//         return [...prev, id];
//       }
//     });
//   };

//   // Navigate to create timetable
//   const handleCreateTimetable = () => {
//     navigate("/create-time-table");
//   };

//   // Navigate back
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     try {
//       return format(new Date(date), "dd MMM yyyy");
//     } catch {
//       return date;
//     }
//   };

//   // Format time
//   const formatTime = (time) => {
//     if (!time) return "N/A";
//     return time;
//   };

//   // Get badge color based on objective
//   const getObjectiveBadgeColor = (objective) => {
//     const colors = {
//       "Class lecture": "primary",
//       "Class Lecture": "primary",
//       "Lunch": "warning",
//       "Break": "secondary",
//       "Subjective Test": "danger",
//       "Objective Test": "info",
//       "Assembly": "primary",
//       "Lunch Break": "warning",
//       "Competition": "success",
//       "Event": "info",
//       "Programme": "info",
//       "Orientation": "secondary",
//       "Exam": "danger",
//       "Doubt Session": "success",
//       "Other": "dark"
//     };
//     return colors[objective] || "secondary";
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row>
//         <Col>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleGoBack}
//                     className="me-2"
//                   >
//                     <FaArrowLeft />
//                   </Button>
//                   <FaCalendarAlt className="me-2" size={24} />
//                   <h4 className="mb-0">View Timetable</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   {userData?.role && (
//                     <Badge bg="info" className="me-2">
//                       {userData?.role}
//                     </Badge>
//                   )}
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleCreateTimetable}
//                     className="d-flex align-items-center"
//                   >
//                     <FaPlus className="me-1" />
//                     Create New
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Permission Info Alert */}
//               {!canDelete && (
//                 <Alert variant="warning" className="mb-3">
//                   <FaLock className="me-2" />
//                   <strong>View Only Mode:</strong> You have read-only access. Delete functionality is available only for Admin and Academic Head roles.
//                 </Alert>
//               )}

//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               {/* Search Filters */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <h6 className="mb-0">🔍 Search Filters</h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <Form onSubmit={handleSearch}>
//                     <Row>
//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             Specific Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="date"
//                             value={searchParams.date}
//                             onChange={handleSearchChange}
//                             placeholder="Select specific date"
//                           />
//                           {searchParams.date && (
//                             <small className="text-muted d-block mt-1">
//                               Showing entries for: {formatDate(searchParams.date)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             Start Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="startDate"
//                             value={searchParams.startDate}
//                             onChange={handleSearchChange}
//                           />
//                           {searchParams.startDate && (
//                             <small className="text-muted d-block mt-1">
//                               From: {formatDate(searchParams.startDate)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             End Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="endDate"
//                             value={searchParams.endDate}
//                             onChange={handleSearchChange}
//                           />
//                           {searchParams.endDate && (
//                             <small className="text-muted d-block mt-1">
//                               To: {formatDate(searchParams.endDate)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col xs={12} className="mb-3">
//                         <div className="d-flex gap-2 flex-wrap">
//                           <Button
//                             type="submit"
//                             variant="primary"
//                             disabled={loading}
//                           >
//                             <FaSearch className="me-2" />
//                             Search
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             onClick={clearFilters}
//                             disabled={loading}
//                           >
//                             <FaTimes className="me-2" />
//                             Clear & Reset to Today
//                           </Button>
//                           <Button
//                             variant="info"
//                             onClick={fetchTimeTable}
//                             disabled={loading}
//                             className="text-white"
//                           >
//                             <FaEye className="me-2" />
//                             Refresh
//                           </Button>
//                           <Button
//                             variant="success"
//                             onClick={handleCreateTimetable}
//                             className="ms-auto"
//                           >
//                             <FaPlus className="me-2" />
//                             Create New Entry
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Card.Body>
//               </Card>

//               {/* Current Filter Info */}
//               {searchParams.date && !searchParams.startDate && !searchParams.endDate && (
//                 <Alert variant="info" className="mb-3">
//                   <strong>📅 Viewing entries for:</strong> {formatDate(searchParams.date)}
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     className="ms-3"
//                     onClick={() => {
//                       setSearchParams(prev => ({
//                         ...prev,
//                         date: "",
//                         startDate: "",
//                         endDate: ""
//                       }));
//                     }}
//                   >
//                     <FaTimes className="me-1" />
//                     Clear Date
//                   </Button>
//                 </Alert>
//               )}

//               {(searchParams.startDate || searchParams.endDate) && (
//                 <Alert variant="info" className="mb-3">
//                   <strong>📅 Date Range:</strong> 
//                   {searchParams.startDate && ` From ${formatDate(searchParams.startDate)}`}
//                   {searchParams.endDate && ` To ${formatDate(searchParams.endDate)}`}
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     className="ms-3"
//                     onClick={() => {
//                       setSearchParams(prev => ({
//                         ...prev,
//                         startDate: "",
//                         endDate: "",
//                         date: getTodayDate()
//                       }));
//                     }}
//                   >
//                     <FaTimes className="me-1" />
//                     Clear Range
//                   </Button>
//                 </Alert>
//               )}

//               {/* Bulk Actions */}
//               {filteredData.length > 0 && (
//                 <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
//                   <div>
//                     <Form.Check
//                       type="checkbox"
//                       label={`Select All (${filteredData.length})`}
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       disabled={!canDelete}
//                     />
//                     {!canDelete && (
//                       <small className="text-muted ms-2">
//                         <FaLock className="me-1" size={12} />
//                         Selection disabled (read-only mode)
//                       </small>
//                     )}
//                   </div>
//                   <div className="d-flex gap-2">
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={handleBulkDelete}
//                       disabled={selectedIds.length === 0 || loading || !canDelete}
//                       title={!canDelete ? "Delete permission required" : ""}
//                     >
//                       <FaTrash className="me-1" />
//                       Delete Selected ({selectedIds.length})
//                     </Button>
//                     <Button
//                       variant="success"
//                       size="sm"
//                       onClick={handleCreateTimetable}
//                     >
//                       <FaPlus className="me-1" />
//                       Add New
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading timetable data...</p>
//                 </div>
//               )}

//               {/* Data Table */}
//               {!loading && filteredData.length === 0 && (
//                 <Alert variant="info" className="text-center">
//                   <h5>No timetable entries found</h5>
//                   <p className="mb-0">
//                     {searchParams.date && `No entries found for ${formatDate(searchParams.date)}`}
//                     {!searchParams.date && searchParams.startDate && searchParams.endDate && 
//                       `No entries found in the selected date range`}
//                     {!searchParams.date && !searchParams.startDate && !searchParams.endDate && 
//                       `No entries found`}
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     className="mt-3"
//                     onClick={handleCreateTimetable}
//                   >
//                     <FaPlus className="me-2" />
//                     Create Your First Entry
//                   </Button>
//                 </Alert>
//               )}

//               {!loading && filteredData.length > 0 && (
//                 <>
//                   <div className="table-responsive">
//                     <Table striped bordered hover className="mb-0">
//                       <thead className="bg-light">
//                         <tr>
//                           <th style={{ width: '40px' }}>#</th>
//                           <th style={{ width: '40px' }}>
//                             <Form.Check
//                               type="checkbox"
//                               checked={selectAll}
//                               onChange={handleSelectAll}
//                               disabled={!canDelete}
//                             />
//                           </th>
//                           <th>Date</th>
//                           <th>Time</th>
//                           <th>Subject</th>
//                           <th>Objective</th>
//                           <th>Board/Batch</th>
//                           <th style={{ width: '150px' }}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentItems.map((entry, index) => (
//                           <tr key={entry._id}>
//                             <td>{indexOfFirstItem + index + 1}</td>
//                             <td>
//                               <Form.Check
//                                 type="checkbox"
//                                 checked={selectedIds.includes(entry._id)}
//                                 onChange={() => handleSelect(entry._id)}
//                                 disabled={!canDelete}
//                               />
//                             </td>
//                             <td>{formatDate(entry.date)}</td>
//                             <td>{formatTime(entry.time)}</td>
//                             <td>
//                               <Badge bg="info">{entry.subject || "N/A"}</Badge>
//                             </td>
//                             <td>
//                               <Badge bg={getObjectiveBadgeColor(entry.objectiveOfDay)}>
//                                 {entry.objectiveOfDay || "N/A"}
//                               </Badge>
//                             </td>
//                             <td>
//                               <div>
//                                 <small className="d-block">{entry.board || "N/A"}</small>
//                                 <small className="d-block text-muted">{entry.batch || "N/A"}</small>
//                               </div>
//                             </td>
//                             <td>
//                               <div className="d-flex gap-1">
//                                 <Button
//                                   variant="outline-info"
//                                   size="sm"
//                                   onClick={() => handleViewEntry(entry)}
//                                   title="View Details"
//                                 >
//                                   <FaEye />
//                                 </Button>
//                                 <Button
//                                   variant="outline-danger"
//                                   size="sm"
//                                   onClick={() => {
//                                     if (!canDelete) {
//                                       setError("You don't have permission to delete entries");
//                                       return;
//                                     }
//                                     setEntryToDelete(entry);
//                                     setShowDeleteModal(true);
//                                   }}
//                                   title={!canDelete ? "Delete permission required" : "Delete"}
//                                   disabled={!canDelete}
//                                 >
//                                   <FaTrash />
//                                 </Button>
//                                 {!canDelete && (
//                                   <FaLock className="text-muted ms-1" size={12} title="Read-only mode" />
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="d-flex justify-content-center mt-3">
//                       <Pagination>
//                         <Pagination.First 
//                           onClick={() => paginate(1)} 
//                           disabled={currentPage === 1}
//                         />
//                         <Pagination.Prev 
//                           onClick={() => paginate(currentPage - 1)} 
//                           disabled={currentPage === 1}
//                         />
//                         {[...Array(totalPages)].map((_, idx) => (
//                           <Pagination.Item
//                             key={idx + 1}
//                             active={idx + 1 === currentPage}
//                             onClick={() => paginate(idx + 1)}
//                           >
//                             {idx + 1}
//                           </Pagination.Item>
//                         ))}
//                         <Pagination.Next 
//                           onClick={() => paginate(currentPage + 1)} 
//                           disabled={currentPage === totalPages}
//                         />
//                         <Pagination.Last 
//                           onClick={() => paginate(totalPages)} 
//                           disabled={currentPage === totalPages}
//                         />
//                       </Pagination>
//                     </div>
//                   )}

//                   {/* Summary */}
//                   <div className="mt-3 text-muted">
//                     <small>
//                       Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
//                     </small>
//                   </div>
//                 </>
//               )}
//             </Card.Body>

//             <Card.Footer className="bg-light text-muted">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <small>
//                   <FaUserGraduate className="me-1" />
//                   User: {userData?.name || "Not logged in"} | Role: {userData?.role || "N/A"}
//                 </small>
//                 <div className="d-flex gap-3">
//                   {!canDelete && (
//                     <small className="text-warning">
//                       <FaLock className="me-1" />
//                       Read-only mode
//                     </small>
//                   )}
//                   <Button
//                     variant="link"
//                     size="sm"
//                     onClick={handleCreateTimetable}
//                     className="text-decoration-none"
//                   >
//                     <FaPlus className="me-1" />
//                     Create New Timetable Entry
//                   </Button>
//                 </div>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>

//       {/* View Details Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <FaCalendarAlt className="me-2 text-primary" />
//             Timetable Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedEntry && (
//             <Row>
//               <Col md={6}>
//                 <h6 className="text-muted">Basic Information</h6>
//                 <div className="mb-3">
//                   <strong>Date:</strong> {formatDate(selectedEntry.date)}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Time:</strong> {formatTime(selectedEntry.time)}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Objective:</strong>{" "}
//                   <Badge bg={getObjectiveBadgeColor(selectedEntry.objectiveOfDay)}>
//                     {selectedEntry.objectiveOfDay || "N/A"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h6 className="text-muted">Additional Details</h6>
//                 <div className="mb-3">
//                   <strong>Board:</strong> {selectedEntry.board || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Status:</strong>{" "}
//                   <Badge bg={selectedEntry.isObjectiveDone ? "success" : "warning"}>
//                     {selectedEntry.isObjectiveDone ? "Completed" : "Pending"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Remark:</strong> {selectedEntry.remark || "N/A"}
//                 </div>
//               </Col>
//               <Col xs={12}>
//                 <hr />
//                 <h6 className="text-muted">Chapters & Exercises</h6>
//                 <Row>
//                   <Col md={6}>
//                     <strong>Chapters:</strong>
//                     <div className="d-flex flex-wrap gap-1 mt-1">
//                       {selectedEntry.chapter && selectedEntry.chapter.length > 0 ? (
//                         selectedEntry.chapter.map((ch, idx) => (
//                           <Badge key={idx} bg="info" className="me-1">
//                             {ch}
//                           </Badge>
//                         ))
//                       ) : (
//                         <span className="text-muted">No chapters</span>
//                       )}
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <strong>Exercises:</strong>
//                     <div className="d-flex flex-wrap gap-1 mt-1">
//                       {selectedEntry.excerciseNo && selectedEntry.excerciseNo.length > 0 ? (
//                         selectedEntry.excerciseNo.map((ex, idx) => (
//                           <Badge key={idx} bg="success" className="me-1">
//                             {ex}
//                           </Badge>
//                         ))
//                       ) : (
//                         <span className="text-muted">No exercises</span>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={() => {
//               if (selectedEntry) {
//                 window.print();
//               }
//             }}
//           >
//             <FaPrint className="me-2" />
//             Print
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={handleCreateTimetable}
//           >
//             <FaPlus className="me-2" />
//             Create New
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title className="text-danger">
//             <FaTrash className="me-2" />
//             Confirm Delete
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete this timetable entry?</p>
//           {entryToDelete && (
//             <div className="bg-light p-3 rounded">
//               <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
//               <p><strong>Time:</strong> {formatTime(entryToDelete.time)}</p>
//               <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
//             </div>
//           )}
//           <p className="text-danger mt-2">This action cannot be undone!</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDeleteEntry} disabled={loading || !canDelete}>
//             {loading ? "Deleting..." : "Yes, Delete"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewTimeTable;











// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetTimeTable, DeleteTimeTable } from "../../service/Academic/Academic.services";
// import { 
//   Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
//   Table, Modal, Pagination, Dropdown 
// } from "react-bootstrap";
// import { 
//   FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
//   FaClipboardList, FaTrash, FaEye, FaDownload, FaPrint,
//   FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaPlus,
//   FaArrowLeft, FaLock, FaFileExcel, FaFilePdf
// } from "react-icons/fa";
// import { format } from "date-fns";
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// export const ViewTimeTable = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Check if user has permission to delete
//   const canDelete = userData?.role === "Admin" || userData?.role === "Academic Head";

//   // Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // State for search/filter
//   const [searchParams, setSearchParams] = useState({
//     date: getTodayDate(), // Set today's date by default
//     startDate: "",
//     endDate: "",
//     unqUserObjectId: userData?._id || ""
//   });

//   // State for data
//   const [timetableData, setTimetableData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // State for modal
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [entryToDelete, setEntryToDelete] = useState(null);

//   // State for bulk delete
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Update unqUserObjectId when userData changes
//   useEffect(() => {
//     if (userData?._id) {
//       setSearchParams(prev => ({
//         ...prev,
//         unqUserObjectId: userData._id
//       }));
//     }
//   }, [userData]);

//   // Auto-fetch data on component mount with today's date
//   useEffect(() => {
//     if (userData?._id) {
//       fetchTimeTable();
//     }
//   }, [userData]);

//   // Fetch timetable data
//   const fetchTimeTable = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // Prepare request data
//       const requestData = {};
      
//       if (searchParams.unqUserObjectId) {
//         requestData.unqUserObjectId = searchParams.unqUserObjectId;
//       }

//       // Check if date or date range is provided
//       if (searchParams.date) {
//         requestData.date = searchParams.date;
//       } else if (searchParams.startDate && searchParams.endDate) {
//         requestData.startDate = searchParams.startDate;
//         requestData.endDate = searchParams.endDate;
//       }

//       console.log("🔍 Fetching timetable with:", requestData);
      
//       const response = await GetTimeTable(requestData);
      
//       console.log("📦 Response:", response);

//       if (response && response.success) {
//         setTimetableData(response.data || []);
//         setFilteredData(response.data || []);
//         const count = response.count || response.data?.length || 0;
//         setSuccess(`Found ${count} entries for ${searchParams.date || 'selected date range'}`);
//         setCurrentPage(1);
//         setSelectedIds([]);
//         setSelectAll(false);
//       } else {
//         setError(response?.message || "Failed to fetch timetable data");
//         setTimetableData([]);
//         setFilteredData([]);
//       }
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while fetching timetable");
//       }
//       setTimetableData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search input changes
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear date if startDate/endDate is set and vice versa
//     if (name === 'date' && value) {
//       setSearchParams(prev => ({
//         ...prev,
//         startDate: "",
//         endDate: ""
//       }));
//     }
//     if ((name === 'startDate' || name === 'endDate') && value) {
//       setSearchParams(prev => ({
//         ...prev,
//         date: ""
//       }));
//     }
//   };

//   // Handle search submit
//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchTimeTable();
//   };

//   // Clear search filters
//   const clearFilters = () => {
//     setSearchParams({
//       date: getTodayDate(), // Reset to today's date
//       startDate: "",
//       endDate: "",
//       unqUserObjectId: userData?._id || ""
//     });
//     setTimetableData([]);
//     setFilteredData([]);
//     setError(null);
//     setSuccess(null);
//     setSelectedIds([]);
//     setSelectAll(false);
//   };

//   // Handle view entry
//   const handleViewEntry = (entry) => {
//     setSelectedEntry(entry);
//     setShowModal(true);
//   };

//   // Handle delete single entry
//   const handleDeleteEntry = async () => {
//     if (!entryToDelete) return;

//     // Check permission again before deleting
//     if (!canDelete) {
//       setError("You don't have permission to delete entries");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await DeleteTimeTable({ ids: entryToDelete._id });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted timetable entry`);
//         // Refresh data
//         fetchTimeTable();
//         setShowDeleteModal(false);
//         setEntryToDelete(null);
//       } else {
//         setError(response?.message || "Failed to delete entry");
//       }
//     } catch (err) {
//       console.error("❌ Delete Error:", err);
//       setError(err.message || "Failed to delete entry");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle bulk delete
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       setError("Please select at least one entry to delete");
//       return;
//     }

//     // Check permission before bulk delete
//     if (!canDelete) {
//       setError("You don't have permission to delete entries");
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} entries?`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await DeleteTimeTable({ ids: selectedIds });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted ${response.deletedCount} entries`);
//         setSelectedIds([]);
//         setSelectAll(false);
//         fetchTimeTable();
//       } else {
//         setError(response?.message || "Failed to delete entries");
//       }
//     } catch (err) {
//       console.error("❌ Bulk Delete Error:", err);
//       setError(err.message || "Failed to delete entries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedIds([]);
//     } else {
//       const allIds = filteredData.map(item => item._id);
//       setSelectedIds(allIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Handle single select
//   const handleSelect = (id) => {
//     setSelectedIds(prev => {
//       if (prev.includes(id)) {
//         return prev.filter(item => item !== id);
//       } else {
//         return [...prev, id];
//       }
//     });
//   };

//   // Navigate to create timetable
//   const handleCreateTimetable = () => {
//     navigate("/create-time-table");
//   };

//   // Navigate back
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     try {
//       return format(new Date(date), "dd MMM yyyy");
//     } catch {
//       return date;
//     }
//   };

//   // Format time
//   const formatTime = (time) => {
//     if (!time) return "N/A";
//     return time;
//   };

//   // Get badge color based on objective
//   const getObjectiveBadgeColor = (objective) => {
//     const colors = {
//       "Class lecture": "primary",
//       "Class Lecture": "primary",
//       "Lunch": "warning",
//       "Break": "secondary",
//       "Subjective Test": "danger",
//       "Objective Test": "info",
//       "Assembly": "primary",
//       "Lunch Break": "warning",
//       "Competition": "success",
//       "Event": "info",
//       "Programme": "info",
//       "Orientation": "secondary",
//       "Exam": "danger",
//       "Doubt Session": "success",
//       "Other": "dark"
//     };
//     return colors[objective] || "secondary";
//   };

//   // Download Excel functionality
//   const downloadExcel = () => {
//     if (filteredData.length === 0) {
//       setError("No data available to download");
//       return;
//     }

//     try {
//       // Prepare data for Excel
//       const excelData = filteredData.map((entry, index) => ({
//         'S.No': index + 1,
//         'Date': formatDate(entry.date),
//         'Time': entry.time || 'N/A',
//         'Subject': entry.subject || 'N/A',
//         'Objective': entry.objectiveOfDay || 'N/A',
//         'Board': entry.board || 'N/A',
//         'Batch': entry.batch || 'N/A',
//         'Chapters': entry.chapter && entry.chapter.length > 0 ? entry.chapter.join(', ') : 'N/A',
//         'Exercises': entry.excerciseNo && entry.excerciseNo.length > 0 ? entry.excerciseNo.join(', ') : 'N/A',
//         'Status': entry.isObjectiveDone ? 'Completed' : 'Pending',
//         'Remark': entry.remark || 'N/A'
//       }));

//       const ws = XLSX.utils.json_to_sheet(excelData);
      
//       // Set column widths
//       ws['!cols'] = [
//         { wch: 6 },  // S.No
//         { wch: 15 }, // Date
//         { wch: 15 }, // Time
//         { wch: 20 }, // Subject
//         { wch: 20 }, // Objective
//         { wch: 15 }, // Board
//         { wch: 15 }, // Batch
//         { wch: 30 }, // Chapters
//         { wch: 30 }, // Exercises
//         { wch: 12 }, // Status
//         { wch: 20 }  // Remark
//       ];

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
      
//       // Generate filename with date range
//       let filename = 'Timetable';
//       if (searchParams.date) {
//         filename += `_${searchParams.date}`;
//       } else if (searchParams.startDate && searchParams.endDate) {
//         filename += `_${searchParams.startDate}_to_${searchParams.endDate}`;
//       } else {
//         filename += `_${format(new Date(), 'yyyy-MM-dd')}`;
//       }
      
//       XLSX.writeFile(wb, `${filename}.xlsx`);
//       setSuccess(`Excel file downloaded successfully!`);
//     } catch (err) {
//       console.error("Excel Download Error:", err);
//       setError("Failed to download Excel file");
//     }
//   };

//   // Download PDF functionality
//   // Download PDF functionality
// const downloadPDF = () => {
//   if (filteredData.length === 0) {
//     setError("No data available to download");
//     return;
//   }

//   try {
//     const doc = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = doc.internal.pageSize.getWidth();
    
//     // Get logos
//     const logo1 = '/haryana.png';
//     const logo2 = '/admitBuniyaLogo.png';
    
//     // Add header with logos
//     const headerY = 10;
//     const logoSize = 20;
    
//     // Left logo
//     try {
//       doc.addImage(logo1, 'PNG', 10, headerY, logoSize, logoSize);
//     } catch (e) {
//       console.warn('Could not load logo1:', e);
//     }
    
//     // Right logo
//     try {
//       doc.addImage(logo2, 'PNG', pageWidth - 30, headerY, logoSize, logoSize);
//     } catch (e) {
//       console.warn('Could not load logo2:', e);
//     }
    
//     // Title
//     const titleY = headerY + logoSize + 10;
//     const title = `TIME TABLE`;
//     const batch = filteredData[0]?.batch || 'All Batches';
//     const board = filteredData[0]?.board || 'All Boards';
//     const dateRange = searchParams.date 
//       ? formatDate(searchParams.date)
//       : `${formatDate(searchParams.startDate)} to ${formatDate(searchParams.endDate)}`;
    
//     doc.setFontSize(18);
//     doc.setFont('helvetica', 'bold');
//     doc.text(`${title} - ${batch} - ${board} - ${dateRange}`, pageWidth / 2, titleY, { align: 'center' });
    
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'normal');
//     const dateLineY = titleY + 8;
//     doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, pageWidth / 2, dateLineY, { align: 'center' });
    
//     // Group data by board - FIXED: Using boardName as key
//     const groupedByBoard = filteredData.reduce((acc, item) => {
//       const boardKey = item.board || 'Other';
//       if (!acc[boardKey]) {
//         acc[boardKey] = [];
//       }
//       acc[boardKey].push(item);
//       return acc;
//     }, {});
    
//     let startY = dateLineY + 10;
    
//     // Process each board - FIXED: Using boardName correctly
//     Object.keys(groupedByBoard).forEach((boardName) => {
//       const boardData = groupedByBoard[boardName];
      
//       // Check if we need a new page
//       if (startY > 250) {
//         doc.addPage();
//         startY = 20;
//       }
      
//       // Board heading
//       doc.setFontSize(14);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(0, 102, 204);
//       doc.text(`Board: ${boardName}`, 14, startY);
//       startY += 8;
      
//       // Create table for this board
//       const tableData = boardData.map(item => [
//         item.time || 'N/A',
//         item.objectiveOfDay || 'N/A',
//         item.subject || 'N/A',
//         item.chapter && item.chapter.length > 0 ? item.chapter.join(', ') : 'N/A'
//       ]);
      
//       doc.autoTable({
//         startY: startY,
//         head: [['Time', 'Objective', 'Subject', 'Chapters']],
//         body: tableData,
//         theme: 'grid',
//         styles: { fontSize: 9, cellPadding: 2 },
//         headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
//         alternateRowStyles: { fillColor: [240, 248, 255] },
//         tableWidth: 'auto',
//         margin: { left: 14, right: 14 },
//         didDrawPage: function(data) {
//           // Footer
//           const pageCount = doc.internal.getNumberOfPages();
//           doc.setFontSize(8);
//           doc.setTextColor(100);
//           doc.text(`Page ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
//         }
//       });
      
//       startY = doc.lastAutoTable.finalY + 10;
      
//       // Add summary for this board
//       if (boardData.length > 0) {
//         const totalEntries = boardData.length;
//         const completed = boardData.filter(item => item.isObjectiveDone).length;
//         const pending = totalEntries - completed;
        
//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(0);
//         // doc.text(`Summary for ${boardName}:`, 14, startY);
//         // startY += 6;
        
//         // doc.setFont('helvetica', 'normal');
//         // doc.setFontSize(9);
//         // doc.text(`• Total Entries: ${totalEntries}`, 18, startY);
//         // startY += 5;
//         // doc.text(`• Completed: ${completed}`, 18, startY);
//         // startY += 5;
//         // doc.text(`• Pending: ${pending}`, 18, startY);
//         // startY += 10;
//       }
//     });
    
//     // Save PDF
//     let filename = 'Timetable';
//     if (searchParams.date) {
//       filename += `_${searchParams.date}`;
//     } else if (searchParams.startDate && searchParams.endDate) {
//       filename += `_${searchParams.startDate}_to_${searchParams.endDate}`;
//     } else {
//       filename += `_${format(new Date(), 'yyyy-MM-dd')}`;
//     }
    
//     doc.save(`${filename}.pdf`);
//     setSuccess(`PDF file downloaded successfully!`);
//   } catch (err) {
//     console.error("PDF Download Error:", err);
//     setError("Failed to download PDF file: " + err.message);
//   }
// };

//   return (
//     <Container fluid className="py-4">
//       <Row>
//         <Col>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleGoBack}
//                     className="me-2"
//                   >
//                     <FaArrowLeft />
//                   </Button>
//                   <FaCalendarAlt className="me-2" size={24} />
//                   <h4 className="mb-0">View Timetable</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   {userData?.role && (
//                     <Badge bg="info" className="me-2">
//                       {userData?.role}
//                     </Badge>
//                   )}
                  
//                   {/* Download Dropdown */}
//                   <Dropdown className="me-2">
//                     <Dropdown.Toggle variant="success" size="sm">
//                       <FaDownload className="me-1" />
//                       Download
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={downloadExcel}>
//                         <FaFileExcel className="me-2 text-success" />
//                         Download Excel
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={downloadPDF}>
//                         <FaFilePdf className="me-2 text-danger" />
//                         Download PDF
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
                  
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleCreateTimetable}
//                     className="d-flex align-items-center"
//                   >
//                     <FaPlus className="me-1" />
//                     Create New
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Permission Info Alert */}
//               {!canDelete && (
//                 <Alert variant="warning" className="mb-3">
//                   <FaLock className="me-2" />
//                   <strong>View Only Mode:</strong> You have read-only access. Delete functionality is available only for Admin and Academic Head roles.
//                 </Alert>
//               )}

//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               {/* Search Filters */}
//               <Card className="mb-4">
//                 <Card.Header className="bg-light">
//                   <h6 className="mb-0">🔍 Search Filters</h6>
//                 </Card.Header>
//                 <Card.Body>
//                   <Form onSubmit={handleSearch}>
//                     <Row>
//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             Specific Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="date"
//                             value={searchParams.date}
//                             onChange={handleSearchChange}
//                             placeholder="Select specific date"
//                           />
//                           {searchParams.date && (
//                             <small className="text-muted d-block mt-1">
//                               Showing entries for: {formatDate(searchParams.date)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             Start Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="startDate"
//                             value={searchParams.startDate}
//                             onChange={handleSearchChange}
//                           />
//                           {searchParams.startDate && (
//                             <small className="text-muted d-block mt-1">
//                               From: {formatDate(searchParams.startDate)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaCalendarAlt className="me-2 text-primary" />
//                             End Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="endDate"
//                             value={searchParams.endDate}
//                             onChange={handleSearchChange}
//                           />
//                           {searchParams.endDate && (
//                             <small className="text-muted d-block mt-1">
//                               To: {formatDate(searchParams.endDate)}
//                             </small>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col xs={12} className="mb-3">
//                         <div className="d-flex gap-2 flex-wrap">
//                           <Button
//                             type="submit"
//                             variant="primary"
//                             disabled={loading}
//                           >
//                             <FaSearch className="me-2" />
//                             Search
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             onClick={clearFilters}
//                             disabled={loading}
//                           >
//                             <FaTimes className="me-2" />
//                             Clear & Reset to Today
//                           </Button>
//                           <Button
//                             variant="info"
//                             onClick={fetchTimeTable}
//                             disabled={loading}
//                             className="text-white"
//                           >
//                             <FaEye className="me-2" />
//                             Refresh
//                           </Button>
//                           <Button
//                             variant="success"
//                             onClick={handleCreateTimetable}
//                             className="ms-auto"
//                           >
//                             <FaPlus className="me-2" />
//                             Create New Entry
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Card.Body>
//               </Card>

//               {/* Current Filter Info */}
//               {searchParams.date && !searchParams.startDate && !searchParams.endDate && (
//                 <Alert variant="info" className="mb-3">
//                   <strong>📅 Viewing entries for:</strong> {formatDate(searchParams.date)}
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     className="ms-3"
//                     onClick={() => {
//                       setSearchParams(prev => ({
//                         ...prev,
//                         date: "",
//                         startDate: "",
//                         endDate: ""
//                       }));
//                     }}
//                   >
//                     <FaTimes className="me-1" />
//                     Clear Date
//                   </Button>
//                 </Alert>
//               )}

//               {(searchParams.startDate || searchParams.endDate) && (
//                 <Alert variant="info" className="mb-3">
//                   <strong>📅 Date Range:</strong> 
//                   {searchParams.startDate && ` From ${formatDate(searchParams.startDate)}`}
//                   {searchParams.endDate && ` To ${formatDate(searchParams.endDate)}`}
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     className="ms-3"
//                     onClick={() => {
//                       setSearchParams(prev => ({
//                         ...prev,
//                         startDate: "",
//                         endDate: "",
//                         date: getTodayDate()
//                       }));
//                     }}
//                   >
//                     <FaTimes className="me-1" />
//                     Clear Range
//                   </Button>
//                 </Alert>
//               )}

//               {/* Bulk Actions */}
//               {filteredData.length > 0 && (
//                 <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
//                   <div>
//                     <Form.Check
//                       type="checkbox"
//                       label={`Select All (${filteredData.length})`}
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       disabled={!canDelete}
//                     />
//                     {!canDelete && (
//                       <small className="text-muted ms-2">
//                         <FaLock className="me-1" size={12} />
//                         Selection disabled (read-only mode)
//                       </small>
//                     )}
//                   </div>
//                   <div className="d-flex gap-2">
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={handleBulkDelete}
//                       disabled={selectedIds.length === 0 || loading || !canDelete}
//                       title={!canDelete ? "Delete permission required" : ""}
//                     >
//                       <FaTrash className="me-1" />
//                       Delete Selected ({selectedIds.length})
//                     </Button>
//                     <Button
//                       variant="success"
//                       size="sm"
//                       onClick={handleCreateTimetable}
//                     >
//                       <FaPlus className="me-1" />
//                       Add New
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading timetable data...</p>
//                 </div>
//               )}

//               {/* Data Table */}
//               {!loading && filteredData.length === 0 && (
//                 <Alert variant="info" className="text-center">
//                   <h5>No timetable entries found</h5>
//                   <p className="mb-0">
//                     {searchParams.date && `No entries found for ${formatDate(searchParams.date)}`}
//                     {!searchParams.date && searchParams.startDate && searchParams.endDate && 
//                       `No entries found in the selected date range`}
//                     {!searchParams.date && !searchParams.startDate && !searchParams.endDate && 
//                       `No entries found`}
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     className="mt-3"
//                     onClick={handleCreateTimetable}
//                   >
//                     <FaPlus className="me-2" />
//                     Create Your First Entry
//                   </Button>
//                 </Alert>
//               )}

//               {!loading && filteredData.length > 0 && (
//                 <>
//                   <div className="table-responsive">
//                     <Table striped bordered hover className="mb-0">
//                       <thead className="bg-light">
//                         <tr>
//                           <th style={{ width: '40px' }}>#</th>
//                           <th style={{ width: '40px' }}>
//                             <Form.Check
//                               type="checkbox"
//                               checked={selectAll}
//                               onChange={handleSelectAll}
//                               disabled={!canDelete}
//                             />
//                           </th>
//                           <th>Date</th>
//                           <th>Time</th>
//                           <th>Subject</th>
//                           <th>Objective</th>
//                           <th>Board/Batch</th>
//                           <th style={{ width: '150px' }}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {currentItems.map((entry, index) => (
//                           <tr key={entry._id}>
//                             <td>{indexOfFirstItem + index + 1}</td>
//                             <td>
//                               <Form.Check
//                                 type="checkbox"
//                                 checked={selectedIds.includes(entry._id)}
//                                 onChange={() => handleSelect(entry._id)}
//                                 disabled={!canDelete}
//                               />
//                             </td>
//                             <td>{formatDate(entry.date)}</td>
//                             <td>{formatTime(entry.time)}</td>
//                             <td>
//                               <Badge bg="info">{entry.subject || "N/A"}</Badge>
//                             </td>
//                             <td>
//                               <Badge bg={getObjectiveBadgeColor(entry.objectiveOfDay)}>
//                                 {entry.objectiveOfDay || "N/A"}
//                               </Badge>
//                             </td>
//                             <td>
//                               <div>
//                                 <small className="d-block">{entry.board || "N/A"}</small>
//                                 <small className="d-block text-muted">{entry.batch || "N/A"}</small>
//                               </div>
//                             </td>
//                             <td>
//                               <div className="d-flex gap-1">
//                                 <Button
//                                   variant="outline-info"
//                                   size="sm"
//                                   onClick={() => handleViewEntry(entry)}
//                                   title="View Details"
//                                 >
//                                   <FaEye />
//                                 </Button>
//                                 <Button
//                                   variant="outline-danger"
//                                   size="sm"
//                                   onClick={() => {
//                                     if (!canDelete) {
//                                       setError("You don't have permission to delete entries");
//                                       return;
//                                     }
//                                     setEntryToDelete(entry);
//                                     setShowDeleteModal(true);
//                                   }}
//                                   title={!canDelete ? "Delete permission required" : "Delete"}
//                                   disabled={!canDelete}
//                                 >
//                                   <FaTrash />
//                                 </Button>
//                                 {!canDelete && (
//                                   <FaLock className="text-muted ms-1" size={12} title="Read-only mode" />
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="d-flex justify-content-center mt-3">
//                       <Pagination>
//                         <Pagination.First 
//                           onClick={() => paginate(1)} 
//                           disabled={currentPage === 1}
//                         />
//                         <Pagination.Prev 
//                           onClick={() => paginate(currentPage - 1)} 
//                           disabled={currentPage === 1}
//                         />
//                         {[...Array(totalPages)].map((_, idx) => (
//                           <Pagination.Item
//                             key={idx + 1}
//                             active={idx + 1 === currentPage}
//                             onClick={() => paginate(idx + 1)}
//                           >
//                             {idx + 1}
//                           </Pagination.Item>
//                         ))}
//                         <Pagination.Next 
//                           onClick={() => paginate(currentPage + 1)} 
//                           disabled={currentPage === totalPages}
//                         />
//                         <Pagination.Last 
//                           onClick={() => paginate(totalPages)} 
//                           disabled={currentPage === totalPages}
//                         />
//                       </Pagination>
//                     </div>
//                   )}

//                   {/* Summary */}
//                   <div className="mt-3 text-muted">
//                     <small>
//                       Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
//                     </small>
//                   </div>
//                 </>
//               )}
//             </Card.Body>

//             <Card.Footer className="bg-light text-muted">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <small>
//                   <FaUserGraduate className="me-1" />
//                   User: {userData?.name || "Not logged in"} | Role: {userData?.role || "N/A"}
//                 </small>
//                 <div className="d-flex gap-3">
//                   {!canDelete && (
//                     <small className="text-warning">
//                       <FaLock className="me-1" />
//                       Read-only mode
//                     </small>
//                   )}
//                   <Button
//                     variant="link"
//                     size="sm"
//                     onClick={handleCreateTimetable}
//                     className="text-decoration-none"
//                   >
//                     <FaPlus className="me-1" />
//                     Create New Timetable Entry
//                   </Button>
//                 </div>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>

//       {/* View Details Modal - Removed Print Button */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <FaCalendarAlt className="me-2 text-primary" />
//             Timetable Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedEntry && (
//             <Row>
//               <Col md={6}>
//                 <h6 className="text-muted">Basic Information</h6>
//                 <div className="mb-3">
//                   <strong>Date:</strong> {formatDate(selectedEntry.date)}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Time:</strong> {formatTime(selectedEntry.time)}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Objective:</strong>{" "}
//                   <Badge bg={getObjectiveBadgeColor(selectedEntry.objectiveOfDay)}>
//                     {selectedEntry.objectiveOfDay || "N/A"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h6 className="text-muted">Additional Details</h6>
//                 <div className="mb-3">
//                   <strong>Board:</strong> {selectedEntry.board || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Status:</strong>{" "}
//                   <Badge bg={selectedEntry.isObjectiveDone ? "success" : "warning"}>
//                     {selectedEntry.isObjectiveDone ? "Completed" : "Pending"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Remark:</strong> {selectedEntry.remark || "N/A"}
//                 </div>
//               </Col>
//               <Col xs={12}>
//                 <hr />
//                 <h6 className="text-muted">Chapters & Exercises</h6>
//                 <Row>
//                   <Col md={6}>
//                     <strong>Chapters:</strong>
//                     <div className="d-flex flex-wrap gap-1 mt-1">
//                       {selectedEntry.chapter && selectedEntry.chapter.length > 0 ? (
//                         selectedEntry.chapter.map((ch, idx) => (
//                           <Badge key={idx} bg="info" className="me-1">
//                             {ch}
//                           </Badge>
//                         ))
//                       ) : (
//                         <span className="text-muted">No chapters</span>
//                       )}
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <strong>Exercises:</strong>
//                     <div className="d-flex flex-wrap gap-1 mt-1">
//                       {selectedEntry.excerciseNo && selectedEntry.excerciseNo.length > 0 ? (
//                         selectedEntry.excerciseNo.map((ex, idx) => (
//                           <Badge key={idx} bg="success" className="me-1">
//                             {ex}
//                           </Badge>
//                         ))
//                       ) : (
//                         <span className="text-muted">No exercises</span>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={handleCreateTimetable}
//           >
//             <FaPlus className="me-2" />
//             Create New
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title className="text-danger">
//             <FaTrash className="me-2" />
//             Confirm Delete
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete this timetable entry?</p>
//           {entryToDelete && (
//             <div className="bg-light p-3 rounded">
//               <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
//               <p><strong>Time:</strong> {formatTime(entryToDelete.time)}</p>
//               <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
//             </div>
//           )}
//           <p className="text-danger mt-2">This action cannot be undone!</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDeleteEntry} disabled={loading || !canDelete}>
//             {loading ? "Deleting..." : "Yes, Delete"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewTimeTable;


















import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import { GetTimeTable, DeleteTimeTable } from "../../service/Academic/Academic.services";
import { 
  Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
  Table, Modal, Pagination, Dropdown 
} from "react-bootstrap";
import { 
  FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
  FaClipboardList, FaTrash, FaEye, FaDownload, FaPrint,
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaPlus,
  FaArrowLeft, FaLock, FaFileExcel, FaFilePdf, FaBookOpen, FaHashtag
} from "react-icons/fa";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ViewTimeTable = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  // Check if user has permission to delete
  const canDelete = userData?.role === "Admin" || userData?.role === "Academic Head";

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // State for search/filter
  const [searchParams, setSearchParams] = useState({
    date: getTodayDate(), // Set today's date by default
    startDate: "",
    endDate: "",
    unqUserObjectId: userData?._id || ""
  });

  // State for data
  const [timetableData, setTimetableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // State for bulk delete
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Update unqUserObjectId when userData changes
  useEffect(() => {
    if (userData?._id) {
      setSearchParams(prev => ({
        ...prev,
        unqUserObjectId: userData._id
      }));
    }
  }, [userData]);

  // Auto-fetch data on component mount with today's date
  useEffect(() => {
    if (userData?._id) {
      fetchTimeTable();
    }
  }, [userData]);

  // Fetch timetable data
  const fetchTimeTable = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare request data
      const requestData = {};
      
      if (searchParams.unqUserObjectId) {
        requestData.unqUserObjectId = searchParams.unqUserObjectId;
      }

      // Check if date or date range is provided
      if (searchParams.date) {
        requestData.date = searchParams.date;
      } else if (searchParams.startDate && searchParams.endDate) {
        requestData.startDate = searchParams.startDate;
        requestData.endDate = searchParams.endDate;
      }

      console.log("🔍 Fetching timetable with:", requestData);
      
      const response = await GetTimeTable(requestData);
      
      console.log("📦 Response:", response);

      if (response && response.success) {
        setTimetableData(response.data || []);
        setFilteredData(response.data || []);
        const count = response.count || response.data?.length || 0;
        setSuccess(`Found ${count} entries for ${searchParams.date || 'selected date range'}`);
        setCurrentPage(1);
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        setError(response?.message || "Failed to fetch timetable data");
        setTimetableData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Please check if backend is running.");
      } else {
        setError(err.message || "An error occurred while fetching timetable");
      }
      setTimetableData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear date if startDate/endDate is set and vice versa
    if (name === 'date' && value) {
      setSearchParams(prev => ({
        ...prev,
        startDate: "",
        endDate: ""
      }));
    }
    if ((name === 'startDate' || name === 'endDate') && value) {
      setSearchParams(prev => ({
        ...prev,
        date: ""
      }));
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTimeTable();
  };

  // Clear search filters
  const clearFilters = () => {
    setSearchParams({
      date: getTodayDate(), // Reset to today's date
      startDate: "",
      endDate: "",
      unqUserObjectId: userData?._id || ""
    });
    setTimetableData([]);
    setFilteredData([]);
    setError(null);
    setSuccess(null);
    setSelectedIds([]);
    setSelectAll(false);
  };

  // Handle view entry
  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  // Handle delete single entry
  const handleDeleteEntry = async () => {
    if (!entryToDelete) return;

    // Check permission again before deleting
    if (!canDelete) {
      setError("You don't have permission to delete entries");
      return;
    }

    setLoading(true);
    try {
      const response = await DeleteTimeTable({ ids: entryToDelete._id });
      
      if (response && response.success) {
        setSuccess(`Successfully deleted timetable entry`);
        // Refresh data
        fetchTimeTable();
        setShowDeleteModal(false);
        setEntryToDelete(null);
      } else {
        setError(response?.message || "Failed to delete entry");
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      setError(err.message || "Failed to delete entry");
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setError("Please select at least one entry to delete");
      return;
    }

    // Check permission before bulk delete
    if (!canDelete) {
      setError("You don't have permission to delete entries");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} entries?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await DeleteTimeTable({ ids: selectedIds });
      
      if (response && response.success) {
        setSuccess(`Successfully deleted ${response.deletedCount} entries`);
        setSelectedIds([]);
        setSelectAll(false);
        fetchTimeTable();
      } else {
        setError(response?.message || "Failed to delete entries");
      }
    } catch (err) {
      console.error("❌ Bulk Delete Error:", err);
      setError(err.message || "Failed to delete entries");
    } finally {
      setLoading(false);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = filteredData.map(item => item._id);
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle single select
  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Navigate to create timetable
  const handleCreateTimetable = () => {
    navigate("/create-time-table");
  };

  // Navigate back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch {
      return date;
    }
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "N/A";
    return time;
  };

  // Get badge color based on objective
  const getObjectiveBadgeColor = (objective) => {
    const colors = {
      "Class lecture": "primary",
      "Class Lecture": "primary",
      "Lunch": "warning",
      "Break": "secondary",
      "Subjective Test": "danger",
      "Objective Test": "info",
      "Assembly": "primary",
      "Lunch Break": "warning",
      "Competition": "success",
      "Event": "info",
      "Programme": "info",
      "Orientation": "secondary",
      "Exam": "danger",
      "Doubt Session": "success",
      "Other": "dark"
    };
    return colors[objective] || "secondary";
  };

  // Download Excel functionality - Updated with book and lectureNo
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      setError("No data available to download");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = filteredData.map((entry, index) => ({
        'S.No': index + 1,
        'Date': formatDate(entry.date),
        'Time': entry.time || 'N/A',
        'Subject': entry.subject || 'N/A',
        'Objective': entry.objectiveOfDay || 'N/A',
        'Board': entry.board || 'N/A',
        'Batch': entry.batch || 'N/A',
        'Book': entry.book || 'N/A', // New field
        'Lecture No': entry.lectureNo || 'N/A', // New field
        'Chapters': entry.chapter && entry.chapter.length > 0 ? entry.chapter.join(', ') : 'N/A',
        'Exercises': entry.excerciseNo && entry.excerciseNo.length > 0 ? entry.excerciseNo.join(', ') : 'N/A',
        'Status': entry.isObjectiveDone ? 'Completed' : 'Pending',
        'Remark': entry.remark || 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 6 },  // S.No
        { wch: 15 }, // Date
        { wch: 15 }, // Time
        { wch: 20 }, // Subject
        { wch: 20 }, // Objective
        { wch: 15 }, // Board
        { wch: 15 }, // Batch
        { wch: 20 }, // Book
        { wch: 12 }, // Lecture No
        { wch: 30 }, // Chapters
        { wch: 30 }, // Exercises
        { wch: 12 }, // Status
        { wch: 20 }  // Remark
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
      
      // Generate filename with date range
      let filename = 'Timetable';
      if (searchParams.date) {
        filename += `_${searchParams.date}`;
      } else if (searchParams.startDate && searchParams.endDate) {
        filename += `_${searchParams.startDate}_to_${searchParams.endDate}`;
      } else {
        filename += `_${format(new Date(), 'yyyy-MM-dd')}`;
      }
      
      XLSX.writeFile(wb, `${filename}.xlsx`);
      setSuccess(`Excel file downloaded successfully!`);
    } catch (err) {
      console.error("Excel Download Error:", err);
      setError("Failed to download Excel file");
    }
  };

  // Download PDF functionality - Updated with book and lectureNo
  const downloadPDF = () => {
    if (filteredData.length === 0) {
      setError("No data available to download");
      return;
    }

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Get logos
      const logo1 = '/haryana.png';
      const logo2 = '/admitBuniyaLogo.png';
      
      // Add header with logos
      const headerY = 10;
      const logoSize = 20;
      
      // Left logo
      try {
        doc.addImage(logo1, 'PNG', 10, headerY, logoSize, logoSize);
      } catch (e) {
        console.warn('Could not load logo1:', e);
      }
      
      // Right logo
      try {
        doc.addImage(logo2, 'PNG', pageWidth - 30, headerY, logoSize, logoSize);
      } catch (e) {
        console.warn('Could not load logo2:', e);
      }
      
      // Title
      const titleY = headerY + logoSize + 10;
      const title = `TIME TABLE`;
      const batch = filteredData[0]?.batch || 'All Batches';
      const board = filteredData[0]?.board || 'All Boards';
      const dateRange = searchParams.date 
        ? formatDate(searchParams.date)
        : `${formatDate(searchParams.startDate)} to ${formatDate(searchParams.endDate)}`;
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${title} - ${batch} - ${board} - ${dateRange}`, pageWidth / 2, titleY, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const dateLineY = titleY + 8;
      doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, pageWidth / 2, dateLineY, { align: 'center' });
      
      // Group data by board
      const groupedByBoard = filteredData.reduce((acc, item) => {
        const boardKey = item.board || 'Other';
        if (!acc[boardKey]) {
          acc[boardKey] = [];
        }
        acc[boardKey].push(item);
        return acc;
      }, {});
      
      let startY = dateLineY + 10;
      
      // Process each board
      Object.keys(groupedByBoard).forEach((boardName) => {
        const boardData = groupedByBoard[boardName];
        
        // Check if we need a new page
        if (startY > 250) {
          doc.addPage();
          startY = 20;
        }
        
        // Board heading
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text(`Board: ${boardName}`, 14, startY);
        startY += 8;
        
        // Create table for this board - Updated with book and lectureNo
        const tableData = boardData.map(item => [
          item.time || 'N/A',
          item.objectiveOfDay || 'N/A',
          item.subject || 'N/A',
          item.book || 'N/A',
          item.lectureNo || 'N/A',
          item.chapter && item.chapter.length > 0 ? item.chapter.join(', ') : 'N/A'
        ]);
        
        doc.autoTable({
          startY: startY,
          head: [['Time', 'Objective', 'Subject', 'Book', 'Lecture No', 'Chapters']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 2 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 248, 255] },
          tableWidth: 'auto',
          margin: { left: 14, right: 14 },
          didDrawPage: function(data) {
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Page ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
          }
        });
        
        startY = doc.lastAutoTable.finalY + 10;
      });
      
      // Save PDF
      let filename = 'Timetable';
      if (searchParams.date) {
        filename += `_${searchParams.date}`;
      } else if (searchParams.startDate && searchParams.endDate) {
        filename += `_${searchParams.startDate}_to_${searchParams.endDate}`;
      } else {
        filename += `_${format(new Date(), 'yyyy-MM-dd')}`;
      }
      
      doc.save(`${filename}.pdf`);
      setSuccess(`PDF file downloaded successfully!`);
    } catch (err) {
      console.error("PDF Download Error:", err);
      setError("Failed to download PDF file: " + err.message);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={handleGoBack}
                    className="me-2"
                  >
                    <FaArrowLeft />
                  </Button>
                  <FaCalendarAlt className="me-2" size={24} />
                  <h4 className="mb-0">View Timetable</h4>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark" className="me-2">
                    {userData?.name || "User"}
                  </Badge>
                  {userData?.role && (
                    <Badge bg="info" className="me-2">
                      {userData?.role}
                    </Badge>
                  )}
                  
                  {/* Download Dropdown */}
                  <Dropdown className="me-2">
                    <Dropdown.Toggle variant="success" size="sm">
                      <FaDownload className="me-1" />
                      Download
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={downloadExcel}>
                        <FaFileExcel className="me-2 text-success" />
                        Download Excel
                      </Dropdown.Item>
                      <Dropdown.Item onClick={downloadPDF}>
                        <FaFilePdf className="me-2 text-danger" />
                        Download PDF
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={handleCreateTimetable}
                    className="d-flex align-items-center"
                  >
                    <FaPlus className="me-1" />
                    Create New
                  </Button>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Permission Info Alert */}
              {!canDelete && (
                <Alert variant="warning" className="mb-3">
                  <FaLock className="me-2" />
                  <strong>View Only Mode:</strong> You have read-only access. Delete functionality is available only for Admin and Academic Head roles.
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert variant="success" className="mb-3" onClose={() => setSuccess(null)} dismissible>
                  <Alert.Heading>✅ Success!</Alert.Heading>
                  <p>{success}</p>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
                  <Alert.Heading>❌ Error!</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              {/* Search Filters */}
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">🔍 Search Filters</h6>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSearch}>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaCalendarAlt className="me-2 text-primary" />
                            Specific Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="date"
                            value={searchParams.date}
                            onChange={handleSearchChange}
                            placeholder="Select specific date"
                          />
                          {searchParams.date && (
                            <small className="text-muted d-block mt-1">
                              Showing entries for: {formatDate(searchParams.date)}
                            </small>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaCalendarAlt className="me-2 text-primary" />
                            Start Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={searchParams.startDate}
                            onChange={handleSearchChange}
                          />
                          {searchParams.startDate && (
                            <small className="text-muted d-block mt-1">
                              From: {formatDate(searchParams.startDate)}
                            </small>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaCalendarAlt className="me-2 text-primary" />
                            End Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={searchParams.endDate}
                            onChange={handleSearchChange}
                          />
                          {searchParams.endDate && (
                            <small className="text-muted d-block mt-1">
                              To: {formatDate(searchParams.endDate)}
                            </small>
                          )}
                        </Form.Group>
                      </Col>

                      <Col xs={12} className="mb-3">
                        <div className="d-flex gap-2 flex-wrap">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                          >
                            <FaSearch className="me-2" />
                            Search
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={clearFilters}
                            disabled={loading}
                          >
                            <FaTimes className="me-2" />
                            Clear & Reset to Today
                          </Button>
                          <Button
                            variant="info"
                            onClick={fetchTimeTable}
                            disabled={loading}
                            className="text-white"
                          >
                            <FaEye className="me-2" />
                            Refresh
                          </Button>
                          <Button
                            variant="success"
                            onClick={handleCreateTimetable}
                            className="ms-auto"
                          >
                            <FaPlus className="me-2" />
                            Create New Entry
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              {/* Current Filter Info */}
              {searchParams.date && !searchParams.startDate && !searchParams.endDate && (
                <Alert variant="info" className="mb-3">
                  <strong>📅 Viewing entries for:</strong> {formatDate(searchParams.date)}
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="ms-3"
                    onClick={() => {
                      setSearchParams(prev => ({
                        ...prev,
                        date: "",
                        startDate: "",
                        endDate: ""
                      }));
                    }}
                  >
                    <FaTimes className="me-1" />
                    Clear Date
                  </Button>
                </Alert>
              )}

              {(searchParams.startDate || searchParams.endDate) && (
                <Alert variant="info" className="mb-3">
                  <strong>📅 Date Range:</strong> 
                  {searchParams.startDate && ` From ${formatDate(searchParams.startDate)}`}
                  {searchParams.endDate && ` To ${formatDate(searchParams.endDate)}`}
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="ms-3"
                    onClick={() => {
                      setSearchParams(prev => ({
                        ...prev,
                        startDate: "",
                        endDate: "",
                        date: getTodayDate()
                      }));
                    }}
                  >
                    <FaTimes className="me-1" />
                    Clear Range
                  </Button>
                </Alert>
              )}

              {/* Bulk Actions */}
              {filteredData.length > 0 && (
                <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <Form.Check
                      type="checkbox"
                      label={`Select All (${filteredData.length})`}
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={!canDelete}
                    />
                    {!canDelete && (
                      <small className="text-muted ms-2">
                        <FaLock className="me-1" size={12} />
                        Selection disabled (read-only mode)
                      </small>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={selectedIds.length === 0 || loading || !canDelete}
                      title={!canDelete ? "Delete permission required" : ""}
                    >
                      <FaTrash className="me-1" />
                      Delete Selected ({selectedIds.length})
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleCreateTimetable}
                    >
                      <FaPlus className="me-1" />
                      Add New
                    </Button>
                  </div>
                </div>
              )}

              {/* Loading Spinner */}
              {loading && (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading timetable data...</p>
                </div>
              )}

              {/* Data Table */}
              {!loading && filteredData.length === 0 && (
                <Alert variant="info" className="text-center">
                  <h5>No timetable entries found</h5>
                  <p className="mb-0">
                    {searchParams.date && `No entries found for ${formatDate(searchParams.date)}`}
                    {!searchParams.date && searchParams.startDate && searchParams.endDate && 
                      `No entries found in the selected date range`}
                    {!searchParams.date && !searchParams.startDate && !searchParams.endDate && 
                      `No entries found`}
                  </p>
                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={handleCreateTimetable}
                  >
                    <FaPlus className="me-2" />
                    Create Your First Entry
                  </Button>
                </Alert>
              )}

              {!loading && filteredData.length > 0 && (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th style={{ width: '40px' }}>#</th>
                          <th style={{ width: '40px' }}>
                            <Form.Check
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              disabled={!canDelete}
                            />
                          </th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Subject</th>
                          <th>Objective</th>
                          <th>Board/Batch</th>
                          <th>Book</th>
                          <th>Lecture No</th>
                          <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((entry, index) => (
                          <tr key={entry._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedIds.includes(entry._id)}
                                onChange={() => handleSelect(entry._id)}
                                disabled={!canDelete}
                              />
                            </td>
                            <td>{formatDate(entry.date)}</td>
                            <td>{formatTime(entry.time)}</td>
                            <td>
                              <Badge bg="info">{entry.subject || "N/A"}</Badge>
                            </td>
                            <td>
                              <Badge bg={getObjectiveBadgeColor(entry.objectiveOfDay)}>
                                {entry.objectiveOfDay || "N/A"}
                              </Badge>
                            </td>
                            <td>
                              <div>
                                <small className="d-block">{entry.board || "N/A"}</small>
                                <small className="d-block text-muted">{entry.batch || "N/A"}</small>
                              </div>
                            </td>
                            <td>{entry.book || "N/A"}</td>
                            <td>{entry.lectureNo || "N/A"}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewEntry(entry)}
                                  title="View Details"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    if (!canDelete) {
                                      setError("You don't have permission to delete entries");
                                      return;
                                    }
                                    setEntryToDelete(entry);
                                    setShowDeleteModal(true);
                                  }}
                                  title={!canDelete ? "Delete permission required" : "Delete"}
                                  disabled={!canDelete}
                                >
                                  <FaTrash />
                                </Button>
                                {!canDelete && (
                                  <FaLock className="text-muted ms-1" size={12} title="Read-only mode" />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <Pagination>
                        <Pagination.First 
                          onClick={() => paginate(1)} 
                          disabled={currentPage === 1}
                        />
                        <Pagination.Prev 
                          onClick={() => paginate(currentPage - 1)} 
                          disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item
                            key={idx + 1}
                            active={idx + 1 === currentPage}
                            onClick={() => paginate(idx + 1)}
                          >
                            {idx + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next 
                          onClick={() => paginate(currentPage + 1)} 
                          disabled={currentPage === totalPages}
                        />
                        <Pagination.Last 
                          onClick={() => paginate(totalPages)} 
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="mt-3 text-muted">
                    <small>
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                    </small>
                  </div>
                </>
              )}
            </Card.Body>

            <Card.Footer className="bg-light text-muted">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <small>
                  <FaUserGraduate className="me-1" />
                  User: {userData?.name || "Not logged in"} | Role: {userData?.role || "N/A"}
                </small>
                <div className="d-flex gap-3">
                  {!canDelete && (
                    <small className="text-warning">
                      <FaLock className="me-1" />
                      Read-only mode
                    </small>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleCreateTimetable}
                    className="text-decoration-none"
                  >
                    <FaPlus className="me-1" />
                    Create New Timetable Entry
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* View Details Modal - Updated with book and lectureNo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalendarAlt className="me-2 text-primary" />
            Timetable Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntry && (
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Basic Information</h6>
                <div className="mb-3">
                  <strong>Date:</strong> {formatDate(selectedEntry.date)}
                </div>
                <div className="mb-3">
                  <strong>Time:</strong> {formatTime(selectedEntry.time)}
                </div>
                <div className="mb-3">
                  <strong>Objective:</strong>{" "}
                  <Badge bg={getObjectiveBadgeColor(selectedEntry.objectiveOfDay)}>
                    {selectedEntry.objectiveOfDay || "N/A"}
                  </Badge>
                </div>
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Additional Details</h6>
                <div className="mb-3">
                  <strong>Board:</strong> {selectedEntry.board || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Book:</strong> {selectedEntry.book || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Lecture No:</strong> {selectedEntry.lectureNo || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>{" "}
                  <Badge bg={selectedEntry.isObjectiveDone ? "success" : "warning"}>
                    {selectedEntry.isObjectiveDone ? "Completed" : "Pending"}
                  </Badge>
                </div>
                <div className="mb-3">
                  <strong>Remark:</strong> {selectedEntry.remark || "N/A"}
                </div>
              </Col>
              <Col xs={12}>
                <hr />
                <h6 className="text-muted">Chapters & Exercises</h6>
                <Row>
                  <Col md={6}>
                    <strong>Chapters:</strong>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {selectedEntry.chapter && selectedEntry.chapter.length > 0 ? (
                        selectedEntry.chapter.map((ch, idx) => (
                          <Badge key={idx} bg="info" className="me-1">
                            {ch}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">No chapters</span>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <strong>Exercises:</strong>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {selectedEntry.excerciseNo && selectedEntry.excerciseNo.length > 0 ? (
                        selectedEntry.excerciseNo.map((ex, idx) => (
                          <Badge key={idx} bg="success" className="me-1">
                            {ex}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">No exercises</span>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={handleCreateTimetable}
          >
            <FaPlus className="me-2" />
            Create New
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this timetable entry?</p>
          {entryToDelete && (
            <div className="bg-light p-3 rounded">
              <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
              <p><strong>Time:</strong> {formatTime(entryToDelete.time)}</p>
              <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
            </div>
          )}
          <p className="text-danger mt-2">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEntry} disabled={loading || !canDelete}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewTimeTable;