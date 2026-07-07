// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetLectureAndVideos, DeleteLectureAndVideos } from "../../service/Academic/Academic.services";
// import { 
//   Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
//   Table, Modal, Pagination 
// } from "react-bootstrap";
// import { 
//   FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
//   FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
//   FaTrash, FaEye, FaSearch, FaTimes, FaPlus, FaArrowLeft,
//   FaEdit, FaCheck, FaWhatsapp, FaLink, FaDownload
// } from "react-icons/fa";
// import { format } from "date-fns";

// export const ViewLectureVideos = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // State for search/filter
//   const [searchParams, setSearchParams] = useState({
//     date: "",
//     startDate: "",
//     endDate: "",
//     subject: "",
//     board: "",
//     batch: "",
//     contentType: ""
//   });

//   // State for data
//   const [lectureData, setLectureData] = useState([]);
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

//   // Dropdown options
//   const contentTypeOptions = ["PPT", "Notes", "HW", "TEST"];
  
//   const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
  
//   const batchOptions = ["2025-27", "2026-28"];
  
//   const subjectOptions = [
//     "Optional Subject",
//     "Biology",
//     "English",
//     "Social Science",
//     "Physics",
//     "Chemistry",
//     "Mathematics",
//     "Hindi"
//   ];

//   // Get today's date
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Fetch lecture/video data
//   const fetchLectureVideos = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // Prepare request data - remove empty fields
//       const requestData = {};
      
//       if (searchParams.date) {
//         requestData.date = searchParams.date;
//       }
      
//       if (searchParams.startDate && searchParams.endDate) {
//         requestData.startDate = searchParams.startDate;
//         requestData.endDate = searchParams.endDate;
//       }
      
//       if (searchParams.subject) {
//         requestData.subject = searchParams.subject;
//       }
      
//       if (searchParams.board) {
//         requestData.board = searchParams.board;
//       }
      
//       if (searchParams.batch) {
//         requestData.batch = searchParams.batch;
//       }
      
//       if (searchParams.contentType) {
//         requestData.contentType = searchParams.contentType;
//       }

//       console.log("🔍 Fetching lecture/videos with:", requestData);
      
//       const response = await GetLectureAndVideos(requestData);
      
//       console.log("📦 Response:", response);

//       if (response && response.success) {
//         setLectureData(response.data || []);
//         setFilteredData(response.data || []);
//         const count = response.count || response.data?.length || 0;
//         setSuccess(`Found ${count} lecture/video entries`);
//         setCurrentPage(1);
//         setSelectedIds([]);
//         setSelectAll(false);
//       } else {
//         setError(response?.message || "Failed to fetch lecture/video data");
//         setLectureData([]);
//         setFilteredData([]);
//       }
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while fetching lecture/videos");
//       }
//       setLectureData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-fetch on component mount
//   useEffect(() => {
//     if (userData?._id) {
//       fetchLectureVideos();
//     }
//   }, [userData]);

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
//     fetchLectureVideos();
//   };

//   // Clear search filters
//   const clearFilters = () => {
//     setSearchParams({
//       date: "",
//       startDate: "",
//       endDate: "",
//       subject: "",
//       board: "",
//       batch: "",
//       contentType: ""
//     });
//     setLectureData([]);
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
//       const response = await DeleteLectureAndVideos({ ids: entryToDelete._id });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted lecture/video entry`);
//         fetchLectureVideos();
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
//       const response = await DeleteLectureAndVideos({ ids: selectedIds });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted ${response.deletedCount} entries`);
//         setSelectedIds([]);
//         setSelectAll(false);
//         fetchLectureVideos();
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

//   // Navigate to create lecture/video
//   const handleCreateLecture = () => {
//     navigate("/create-lecture-videos");
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

//   // Get icon for content type
//   const getContentTypeIcon = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'ppt': return <FaFilePowerpoint className="me-1 text-warning" />;
//       case 'notes': return <FaFileAlt className="me-1 text-primary" />;
//       case 'hw': return <FaFileAlt className="me-1 text-success" />;
//       case 'test': return <FaFileAlt className="me-1 text-danger" />;
//       case 'video': return <FaVideo className="me-1 text-danger" />;
//       case 'pdf': return <FaFilePdf className="me-1 text-danger" />;
//       default: return <FaFileAlt className="me-1 text-secondary" />;
//     }
//   };

//   // Get badge color for content type
//   const getContentTypeBadgeColor = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'ppt': return 'warning';
//       case 'notes': return 'info';
//       case 'hw': return 'success';
//       case 'test': return 'danger';
//       case 'video': return 'danger';
//       case 'pdf': return 'danger';
//       default: return 'secondary';
//     }
//   };

//   // Get shared on icon
//   const getSharedOnIcon = (platform) => {
//     switch(platform?.toLowerCase()) {
//       case 'whatsapp': return <FaWhatsapp className="text-success" />;
//       case 'class plus': return <FaChalkboard className="text-primary" />;
//       default: return <FaLink className="text-secondary" />;
//     }
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
//                   <FaVideo className="me-2" size={24} />
//                   <h4 className="mb-0">View Lectures & Videos</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleCreateLecture}
//                     className="d-flex align-items-center"
//                   >
//                     <FaPlus className="me-1" />
//                     Upload New
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
//                           />
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
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaBook className="me-2 text-primary" />
//                             Subject
//                           </Form.Label>
//                           <Form.Select
//                             name="subject"
//                             value={searchParams.subject}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Subjects</option>
//                             {subjectOptions.map((subject) => (
//                               <option key={subject} value={subject}>
//                                 {subject}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaChalkboard className="me-2 text-primary" />
//                             Board
//                           </Form.Label>
//                           <Form.Select
//                             name="board"
//                             value={searchParams.board}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Boards</option>
//                             {boardOptions.map((board) => (
//                               <option key={board} value={board}>
//                                 {board}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaUserGraduate className="me-2 text-primary" />
//                             Batch
//                           </Form.Label>
//                           <Form.Select
//                             name="batch"
//                             value={searchParams.batch}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Batches</option>
//                             {batchOptions.map((batch) => (
//                               <option key={batch} value={batch}>
//                                 {batch}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaFileAlt className="me-2 text-primary" />
//                             Content Type
//                           </Form.Label>
//                           <Form.Select
//                             name="contentType"
//                             value={searchParams.contentType}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Types</option>
//                             {contentTypeOptions.map((type) => (
//                               <option key={type} value={type}>
//                                 {type}
//                               </option>
//                             ))}
//                           </Form.Select>
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
//                             Clear Filters
//                           </Button>
//                           <Button
//                             variant="info"
//                             onClick={fetchLectureVideos}
//                             disabled={loading}
//                             className="text-white"
//                           >
//                             <FaEye className="me-2" />
//                             Refresh
//                           </Button>
//                           <Button
//                             variant="success"
//                             onClick={handleCreateLecture}
//                             className="ms-auto"
//                           >
//                             <FaPlus className="me-2" />
//                             Upload New
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Card.Body>
//               </Card>

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
//                       onClick={handleCreateLecture}
//                     >
//                       <FaPlus className="me-1" />
//                       Upload New
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading lecture/video data...</p>
//                 </div>
//               )}

//               {/* Data Table */}
//               {!loading && filteredData.length === 0 && (
//                 <Alert variant="info" className="text-center">
//                   <h5>No lecture/video entries found</h5>
//                   <p className="mb-0">Use the search filters above to find entries</p>
//                   <Button 
//                     variant="primary" 
//                     className="mt-3"
//                     onClick={handleCreateLecture}
//                   >
//                     <FaPlus className="me-2" />
//                     Upload Your First Lecture/Video
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
//                           <th>Type</th>
//                           <th>Subject</th>
//                           <th>Board/Batch</th>
//                           <th>Date</th>
//                           <th>Shared On</th>
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
//                             <td>
//                               <Badge bg={getContentTypeBadgeColor(entry.contentType)}>
//                                 {getContentTypeIcon(entry.contentType)}
//                                 {entry.contentType || "N/A"}
//                               </Badge>
//                             </td>
//                             <td>{entry.subject || "N/A"}</td>
//                             <td>
//                               <div>
//                                 <small className="d-block">{entry.board || "N/A"}</small>
//                                 <small className="d-block text-muted">{entry.batch || "N/A"}</small>
//                               </div>
//                             </td>
//                             <td>{formatDate(entry.date)}</td>
//                             <td>
//                               {entry.sharedOn ? (
//                                 <span>
//                                   {getSharedOnIcon(entry.sharedOn)}
//                                   <span className="ms-1">{entry.sharedOn}</span>
//                                 </span>
//                               ) : (
//                                 "N/A"
//                               )}
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
//                                 {entry.fileUrl && (
//                                   <Button
//                                     variant="outline-primary"
//                                     size="sm"
//                                     href={entry.fileUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     title="Open File"
//                                   >
//                                     <FaLink />
//                                   </Button>
//                                 )}
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
//                   onClick={handleCreateLecture}
//                   className="text-decoration-none"
//                 >
//                   <FaPlus className="me-1" />
//                   Upload New Lecture/Video
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
//             <FaVideo className="me-2 text-primary" />
//             Lecture/Video Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedEntry && (
//             <Row>
//               <Col md={6}>
//                 <h6 className="text-muted">Basic Information</h6>
//                 <div className="mb-3">
//                   <strong>Content Type:</strong>{" "}
//                   <Badge bg={getContentTypeBadgeColor(selectedEntry.contentType)}>
//                     {getContentTypeIcon(selectedEntry.contentType)}
//                     {selectedEntry.contentType || "N/A"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Board:</strong> {selectedEntry.board || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Date:</strong> {formatDate(selectedEntry.date)}
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h6 className="text-muted">Additional Details</h6>
//                 <div className="mb-3">
//                   <strong>Chapter:</strong> {selectedEntry.chapter || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Shared On:</strong>{" "}
//                   {selectedEntry.sharedOn ? (
//                     <span>
//                       {getSharedOnIcon(selectedEntry.sharedOn)}
//                       <span className="ms-1">{selectedEntry.sharedOn}</span>
//                     </span>
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Filename:</strong> {selectedEntry.filename || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Status:</strong>{" "}
//                   <Badge bg={selectedEntry.isActive ? "success" : "danger"}>
//                     {selectedEntry.isActive ? "Active" : "Inactive"}
//                   </Badge>
//                 </div>
//                 {selectedEntry.fileUrl && (
//                   <div className="mb-3">
//                     <strong>File URL:</strong>{" "}
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       href={selectedEntry.fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <FaLink className="me-1" />
//                       Open File
//                     </Button>
//                   </div>
//                 )}
//               </Col>
//               {selectedEntry.description && (
//                 <Col xs={12}>
//                   <hr />
//                   <h6 className="text-muted">Description</h6>
//                   <p>{selectedEntry.description}</p>
//                 </Col>
//               )}
//               {selectedEntry.unqTimeTableId && (
//                 <Col xs={12}>
//                   <hr />
//                   <h6 className="text-muted">Linked Timetable</h6>
//                   <div className="bg-light p-2 rounded">
//                     <small>
//                       <strong>ID:</strong> {selectedEntry.unqTimeTableId._id || selectedEntry.unqTimeTableId}
//                       {selectedEntry.unqTimeTableId.date && (
//                         <> | <strong>Date:</strong> {formatDate(selectedEntry.unqTimeTableId.date)}</>
//                       )}
//                       {selectedEntry.unqTimeTableId.time && (
//                         <> | <strong>Time:</strong> {selectedEntry.unqTimeTableId.time}</>
//                       )}
//                     </small>
//                   </div>
//                 </Col>
//               )}
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           {selectedEntry?.fileUrl && (
//             <Button 
//               variant="primary"
//               href={selectedEntry.fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaLink className="me-2" />
//               Open File
//             </Button>
//           )}
//           <Button 
//             variant="success" 
//             onClick={handleCreateLecture}
//           >
//             <FaPlus className="me-2" />
//             Upload New
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
//           <p>Are you sure you want to delete this lecture/video entry?</p>
//           {entryToDelete && (
//             <div className="bg-light p-3 rounded">
//               <p><strong>Content Type:</strong> {entryToDelete.contentType || "N/A"}</p>
//               <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
//               <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
//               {entryToDelete.filename && (
//                 <p><strong>File:</strong> {entryToDelete.filename}</p>
//               )}
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

// export default ViewLectureVideos;
















// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetLectureAndVideos, DeleteLectureAndVideos } from "../../service/Academic/Academic.services";
// import { 
//   Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
//   Table, Modal, Pagination 
// } from "react-bootstrap";
// import { 
//   FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
//   FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
//   FaTrash, FaEye, FaSearch, FaTimes, FaPlus, FaArrowLeft,
//   FaEdit, FaCheck, FaWhatsapp, FaLink, FaDownload, FaLock
// } from "react-icons/fa";
// import { format } from "date-fns";

// export const ViewLectureVideos = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Check if user has permission to delete
//   const canDelete = userData?.role === "Admin" || userData?.role === "Academic Head";

//   // State for search/filter
//   const [searchParams, setSearchParams] = useState({
//     date: "",
//     startDate: "",
//     endDate: "",
//     subject: "",
//     board: "",
//     batch: "",
//     contentType: ""
//   });

//   // State for data
//   const [lectureData, setLectureData] = useState([]);
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

//   // Dropdown options
//   const contentTypeOptions = ["PPT", "Notes", "HW", "TEST"];
  
//   const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
  
//   const batchOptions = ["2025-27", "2026-28"];
  
//   const subjectOptions = [
//     "Optional Subject",
//     "Biology",
//     "English",
//     "Social Science",
//     "Physics",
//     "Chemistry",
//     "Mathematics",
//     "Hindi"
//   ];

//   // Get today's date
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Fetch lecture/video data
//   const fetchLectureVideos = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // Prepare request data - remove empty fields
//       const requestData = {};
      
//       if (searchParams.date) {
//         requestData.date = searchParams.date;
//       }
      
//       if (searchParams.startDate && searchParams.endDate) {
//         requestData.startDate = searchParams.startDate;
//         requestData.endDate = searchParams.endDate;
//       }
      
//       if (searchParams.subject) {
//         requestData.subject = searchParams.subject;
//       }
      
//       if (searchParams.board) {
//         requestData.board = searchParams.board;
//       }
      
//       if (searchParams.batch) {
//         requestData.batch = searchParams.batch;
//       }
      
//       if (searchParams.contentType) {
//         requestData.contentType = searchParams.contentType;
//       }

//       console.log("🔍 Fetching lecture/videos with:", requestData);
      
//       const response = await GetLectureAndVideos(requestData);
      
//       console.log("📦 Response:", response);

//       if (response && response.success) {
//         setLectureData(response.data || []);
//         setFilteredData(response.data || []);
//         const count = response.count || response.data?.length || 0;
//         setSuccess(`Found ${count} lecture/video entries`);
//         setCurrentPage(1);
//         setSelectedIds([]);
//         setSelectAll(false);
//       } else {
//         setError(response?.message || "Failed to fetch lecture/video data");
//         setLectureData([]);
//         setFilteredData([]);
//       }
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while fetching lecture/videos");
//       }
//       setLectureData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-fetch on component mount
//   useEffect(() => {
//     if (userData?._id) {
//       fetchLectureVideos();
//     }
//   }, [userData]);

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
//     fetchLectureVideos();
//   };

//   // Clear search filters
//   const clearFilters = () => {
//     setSearchParams({
//       date: "",
//       startDate: "",
//       endDate: "",
//       subject: "",
//       board: "",
//       batch: "",
//       contentType: ""
//     });
//     setLectureData([]);
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
//       const response = await DeleteLectureAndVideos({ ids: entryToDelete._id });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted lecture/video entry`);
//         fetchLectureVideos();
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
//       const response = await DeleteLectureAndVideos({ ids: selectedIds });
      
//       if (response && response.success) {
//         setSuccess(`Successfully deleted ${response.deletedCount} entries`);
//         setSelectedIds([]);
//         setSelectAll(false);
//         fetchLectureVideos();
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

//   // Navigate to create lecture/video
//   const handleCreateLecture = () => {
//     navigate("/create-lecture-videos");
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

//   // Get icon for content type
//   const getContentTypeIcon = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'ppt': return <FaFilePowerpoint className="me-1 text-warning" />;
//       case 'notes': return <FaFileAlt className="me-1 text-primary" />;
//       case 'hw': return <FaFileAlt className="me-1 text-success" />;
//       case 'test': return <FaFileAlt className="me-1 text-danger" />;
//       case 'video': return <FaVideo className="me-1 text-danger" />;
//       case 'pdf': return <FaFilePdf className="me-1 text-danger" />;
//       default: return <FaFileAlt className="me-1 text-secondary" />;
//     }
//   };

//   // Get badge color for content type
//   const getContentTypeBadgeColor = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'ppt': return 'warning';
//       case 'notes': return 'info';
//       case 'hw': return 'success';
//       case 'test': return 'danger';
//       case 'video': return 'danger';
//       case 'pdf': return 'danger';
//       default: return 'secondary';
//     }
//   };

//   // Get shared on icon
//   const getSharedOnIcon = (platform) => {
//     switch(platform?.toLowerCase()) {
//       case 'whatsapp': return <FaWhatsapp className="text-success" />;
//       case 'class plus': return <FaChalkboard className="text-primary" />;
//       default: return <FaLink className="text-secondary" />;
//     }
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
//                   <FaVideo className="me-2" size={24} />
//                   <h4 className="mb-0">View Lectures & Videos</h4>
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
//                     onClick={handleCreateLecture}
//                     className="d-flex align-items-center"
//                   >
//                     <FaPlus className="me-1" />
//                     Upload New
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
//                           />
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
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaBook className="me-2 text-primary" />
//                             Subject
//                           </Form.Label>
//                           <Form.Select
//                             name="subject"
//                             value={searchParams.subject}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Subjects</option>
//                             {subjectOptions.map((subject) => (
//                               <option key={subject} value={subject}>
//                                 {subject}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaChalkboard className="me-2 text-primary" />
//                             Board
//                           </Form.Label>
//                           <Form.Select
//                             name="board"
//                             value={searchParams.board}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Boards</option>
//                             {boardOptions.map((board) => (
//                               <option key={board} value={board}>
//                                 {board}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaUserGraduate className="me-2 text-primary" />
//                             Batch
//                           </Form.Label>
//                           <Form.Select
//                             name="batch"
//                             value={searchParams.batch}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Batches</option>
//                             {batchOptions.map((batch) => (
//                               <option key={batch} value={batch}>
//                                 {batch}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4} className="mb-3">
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">
//                             <FaFileAlt className="me-2 text-primary" />
//                             Content Type
//                           </Form.Label>
//                           <Form.Select
//                             name="contentType"
//                             value={searchParams.contentType}
//                             onChange={handleSearchChange}
//                           >
//                             <option value="">All Types</option>
//                             {contentTypeOptions.map((type) => (
//                               <option key={type} value={type}>
//                                 {type}
//                               </option>
//                             ))}
//                           </Form.Select>
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
//                             Clear Filters
//                           </Button>
//                           <Button
//                             variant="info"
//                             onClick={fetchLectureVideos}
//                             disabled={loading}
//                             className="text-white"
//                           >
//                             <FaEye className="me-2" />
//                             Refresh
//                           </Button>
//                           <Button
//                             variant="success"
//                             onClick={handleCreateLecture}
//                             className="ms-auto"
//                           >
//                             <FaPlus className="me-2" />
//                             Upload New
//                           </Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Card.Body>
//               </Card>

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
//                       onClick={handleCreateLecture}
//                     >
//                       <FaPlus className="me-1" />
//                       Upload New
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Loading Spinner */}
//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading lecture/video data...</p>
//                 </div>
//               )}

//               {/* Data Table */}
//               {!loading && filteredData.length === 0 && (
//                 <Alert variant="info" className="text-center">
//                   <h5>No lecture/video entries found</h5>
//                   <p className="mb-0">Use the search filters above to find entries</p>
//                   <Button 
//                     variant="primary" 
//                     className="mt-3"
//                     onClick={handleCreateLecture}
//                   >
//                     <FaPlus className="me-2" />
//                     Upload Your First Lecture/Video
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
//                           <th>Type</th>
//                           <th>Subject</th>
//                           <th>Board/Batch</th>
//                           <th>Date</th>
//                           <th>Shared On</th>
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
//                             <td>
//                               <Badge bg={getContentTypeBadgeColor(entry.contentType)}>
//                                 {getContentTypeIcon(entry.contentType)}
//                                 {entry.contentType || "N/A"}
//                               </Badge>
//                             </td>
//                             <td>{entry.subject || "N/A"}</td>
//                             <td>
//                               <div>
//                                 <small className="d-block">{entry.board || "N/A"}</small>
//                                 <small className="d-block text-muted">{entry.batch || "N/A"}</small>
//                               </div>
//                             </td>
//                             <td>{formatDate(entry.date)}</td>
//                             <td>
//                               {entry.sharedOn ? (
//                                 <span>
//                                   {getSharedOnIcon(entry.sharedOn)}
//                                   <span className="ms-1">{entry.sharedOn}</span>
//                                 </span>
//                               ) : (
//                                 "N/A"
//                               )}
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
//                                 {entry.fileUrl && (
//                                   <Button
//                                     variant="outline-primary"
//                                     size="sm"
//                                     href={entry.fileUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     title="Open File"
//                                   >
//                                     <FaLink />
//                                   </Button>
//                                 )}
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
//                     onClick={handleCreateLecture}
//                     className="text-decoration-none"
//                   >
//                     <FaPlus className="me-1" />
//                     Upload New Lecture/Video
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
//             <FaVideo className="me-2 text-primary" />
//             Lecture/Video Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedEntry && (
//             <Row>
//               <Col md={6}>
//                 <h6 className="text-muted">Basic Information</h6>
//                 <div className="mb-3">
//                   <strong>Content Type:</strong>{" "}
//                   <Badge bg={getContentTypeBadgeColor(selectedEntry.contentType)}>
//                     {getContentTypeIcon(selectedEntry.contentType)}
//                     {selectedEntry.contentType || "N/A"}
//                   </Badge>
//                 </div>
//                 <div className="mb-3">
//                   <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Board:</strong> {selectedEntry.board || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Date:</strong> {formatDate(selectedEntry.date)}
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h6 className="text-muted">Additional Details</h6>
//                 <div className="mb-3">
//                   <strong>Chapter:</strong> {selectedEntry.chapter || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Shared On:</strong>{" "}
//                   {selectedEntry.sharedOn ? (
//                     <span>
//                       {getSharedOnIcon(selectedEntry.sharedOn)}
//                       <span className="ms-1">{selectedEntry.sharedOn}</span>
//                     </span>
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Filename:</strong> {selectedEntry.filename || "N/A"}
//                 </div>
//                 <div className="mb-3">
//                   <strong>Status:</strong>{" "}
//                   <Badge bg={selectedEntry.isActive ? "success" : "danger"}>
//                     {selectedEntry.isActive ? "Active" : "Inactive"}
//                   </Badge>
//                 </div>
//                 {selectedEntry.fileUrl && (
//                   <div className="mb-3">
//                     <strong>File URL:</strong>{" "}
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       href={selectedEntry.fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <FaLink className="me-1" />
//                       Open File
//                     </Button>
//                   </div>
//                 )}
//               </Col>
//               {selectedEntry.description && (
//                 <Col xs={12}>
//                   <hr />
//                   <h6 className="text-muted">Description</h6>
//                   <p>{selectedEntry.description}</p>
//                 </Col>
//               )}
//               {selectedEntry.unqTimeTableId && (
//                 <Col xs={12}>
//                   <hr />
//                   <h6 className="text-muted">Linked Timetable</h6>
//                   <div className="bg-light p-2 rounded">
//                     <small>
//                       <strong>ID:</strong> {selectedEntry.unqTimeTableId._id || selectedEntry.unqTimeTableId}
//                       {selectedEntry.unqTimeTableId.date && (
//                         <> | <strong>Date:</strong> {formatDate(selectedEntry.unqTimeTableId.date)}</>
//                       )}
//                       {selectedEntry.unqTimeTableId.time && (
//                         <> | <strong>Time:</strong> {selectedEntry.unqTimeTableId.time}</>
//                       )}
//                     </small>
//                   </div>
//                 </Col>
//               )}
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           {selectedEntry?.fileUrl && (
//             <Button 
//               variant="primary"
//               href={selectedEntry.fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaLink className="me-2" />
//               Open File
//             </Button>
//           )}
//           <Button 
//             variant="success" 
//             onClick={handleCreateLecture}
//           >
//             <FaPlus className="me-2" />
//             Upload New
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
//           <p>Are you sure you want to delete this lecture/video entry?</p>
//           {entryToDelete && (
//             <div className="bg-light p-3 rounded">
//               <p><strong>Content Type:</strong> {entryToDelete.contentType || "N/A"}</p>
//               <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
//               <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
//               {entryToDelete.filename && (
//                 <p><strong>File:</strong> {entryToDelete.filename}</p>
//               )}
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

// export default ViewLectureVideos;
















import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import { GetLectureAndVideos, DeleteLectureAndVideos } from "../../service/Academic/Academic.services";
import { 
  Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, 
  Table, Modal, Pagination, Dropdown 
} from "react-bootstrap";
import { 
  FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
  FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
  FaTrash, FaEye, FaSearch, FaTimes, FaPlus, FaArrowLeft,
  FaEdit, FaCheck, FaWhatsapp, FaLink, FaDownload, FaLock,
  FaFileExcel
} from "react-icons/fa";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

export const ViewLectureVideos = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  // Check if user has permission to delete
  const canDelete = userData?.role === "Admin" || userData?.role === "Academic Head";

  // State for search/filter
  const [searchParams, setSearchParams] = useState({
    date: "",
    startDate: "",
    endDate: "",
    subject: "",
    board: "",
    batch: "",
    contentType: ""
  });

  // State for data
  const [lectureData, setLectureData] = useState([]);
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

  // Dropdown options
  const contentTypeOptions = ["PPT", "Notes", "HW", "TEST"];
  
  const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
  
  const batchOptions = ["2025-27", "2026-28"];
  
  const subjectOptions = [
    "Optional Subject",
    "Biology",
    "English",
    "Social Science",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Hindi"
  ];

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch lecture/video data
  const fetchLectureVideos = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare request data - remove empty fields
      const requestData = {};
      
      if (searchParams.date) {
        requestData.date = searchParams.date;
      }
      
      if (searchParams.startDate && searchParams.endDate) {
        requestData.startDate = searchParams.startDate;
        requestData.endDate = searchParams.endDate;
      }
      
      if (searchParams.subject) {
        requestData.subject = searchParams.subject;
      }
      
      if (searchParams.board) {
        requestData.board = searchParams.board;
      }
      
      if (searchParams.batch) {
        requestData.batch = searchParams.batch;
      }
      
      if (searchParams.contentType) {
        requestData.contentType = searchParams.contentType;
      }

      console.log("🔍 Fetching lecture/videos with:", requestData);
      
      const response = await GetLectureAndVideos(requestData);
      
      console.log("📦 Response:", response);

      if (response && response.success) {
        setLectureData(response.data || []);
        setFilteredData(response.data || []);
        const count = response.count || response.data?.length || 0;
        setSuccess(`Found ${count} lecture/video entries`);
        setCurrentPage(1);
        setSelectedIds([]);
        setSelectAll(false);
      } else {
        setError(response?.message || "Failed to fetch lecture/video data");
        setLectureData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Please check if backend is running.");
      } else {
        setError(err.message || "An error occurred while fetching lecture/videos");
      }
      setLectureData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    if (userData?._id) {
      fetchLectureVideos();
    }
  }, [userData]);

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
    fetchLectureVideos();
  };

  // Clear search filters
  const clearFilters = () => {
    setSearchParams({
      date: "",
      startDate: "",
      endDate: "",
      subject: "",
      board: "",
      batch: "",
      contentType: ""
    });
    setLectureData([]);
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
      const response = await DeleteLectureAndVideos({ ids: entryToDelete._id });
      
      if (response && response.success) {
        setSuccess(`Successfully deleted lecture/video entry`);
        fetchLectureVideos();
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
      const response = await DeleteLectureAndVideos({ ids: selectedIds });
      
      if (response && response.success) {
        setSuccess(`Successfully deleted ${response.deletedCount} entries`);
        setSelectedIds([]);
        setSelectAll(false);
        fetchLectureVideos();
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

  // Navigate to create lecture/video
  const handleCreateLecture = () => {
    navigate("/create-lecture-videos");
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

  // Get icon for content type
  const getContentTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'ppt': return <FaFilePowerpoint className="me-1 text-warning" />;
      case 'notes': return <FaFileAlt className="me-1 text-primary" />;
      case 'hw': return <FaFileAlt className="me-1 text-success" />;
      case 'test': return <FaFileAlt className="me-1 text-danger" />;
      case 'video': return <FaVideo className="me-1 text-danger" />;
      case 'pdf': return <FaFilePdf className="me-1 text-danger" />;
      default: return <FaFileAlt className="me-1 text-secondary" />;
    }
  };

  // Get badge color for content type
  const getContentTypeBadgeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'ppt': return 'warning';
      case 'notes': return 'info';
      case 'hw': return 'success';
      case 'test': return 'danger';
      case 'video': return 'danger';
      case 'pdf': return 'danger';
      default: return 'secondary';
    }
  };

  // Get shared on icon
  const getSharedOnIcon = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'whatsapp': return <FaWhatsapp className="text-success" />;
      case 'class plus': return <FaChalkboard className="text-primary" />;
      default: return <FaLink className="text-secondary" />;
    }
  };

  // Download Excel functionality
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      setError("No data available to download");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = filteredData.map((entry, index) => ({
        'S.No': index + 1,
        'Content Type': entry.contentType || 'N/A',
        'Subject': entry.subject || 'N/A',
        'Board': entry.board || 'N/A',
        'Batch': entry.batch || 'N/A',
        'Date': formatDate(entry.date),
        'Chapter': entry.chapter || 'N/A',
        'Shared On': entry.sharedOn || 'N/A',
        'Filename': entry.filename || 'N/A',
        'Status': entry.isActive ? 'Active' : 'Inactive',
        'Description': entry.description || 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 6 },   // S.No
        { wch: 15 },  // Content Type
        { wch: 20 },  // Subject
        { wch: 15 },  // Board
        { wch: 15 },  // Batch
        { wch: 15 },  // Date
        { wch: 25 },  // Chapter
        { wch: 15 },  // Shared On
        { wch: 20 },  // Filename
        { wch: 12 },  // Status
        { wch: 40 }   // Description
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Lectures_Videos');
      
      // Generate filename with date range
      let filename = 'Lectures_Videos';
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
      setError("Failed to download Excel file: " + err.message);
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
                  <FaVideo className="me-2" size={24} />
                  <h4 className="mb-0">View Lectures & Videos</h4>
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
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={handleCreateLecture}
                    className="d-flex align-items-center"
                  >
                    <FaPlus className="me-1" />
                    Upload New
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
                          />
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
                        </Form.Group>
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaBook className="me-2 text-primary" />
                            Subject
                          </Form.Label>
                          <Form.Select
                            name="subject"
                            value={searchParams.subject}
                            onChange={handleSearchChange}
                          >
                            <option value="">All Subjects</option>
                            {subjectOptions.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaChalkboard className="me-2 text-primary" />
                            Board
                          </Form.Label>
                          <Form.Select
                            name="board"
                            value={searchParams.board}
                            onChange={handleSearchChange}
                          >
                            <option value="">All Boards</option>
                            {boardOptions.map((board) => (
                              <option key={board} value={board}>
                                {board}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaUserGraduate className="me-2 text-primary" />
                            Batch
                          </Form.Label>
                          <Form.Select
                            name="batch"
                            value={searchParams.batch}
                            onChange={handleSearchChange}
                          >
                            <option value="">All Batches</option>
                            {batchOptions.map((batch) => (
                              <option key={batch} value={batch}>
                                {batch}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaFileAlt className="me-2 text-primary" />
                            Content Type
                          </Form.Label>
                          <Form.Select
                            name="contentType"
                            value={searchParams.contentType}
                            onChange={handleSearchChange}
                          >
                            <option value="">All Types</option>
                            {contentTypeOptions.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Form.Select>
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
                            Clear Filters
                          </Button>
                          <Button
                            variant="info"
                            onClick={fetchLectureVideos}
                            disabled={loading}
                            className="text-white"
                          >
                            <FaEye className="me-2" />
                            Refresh
                          </Button>
                          <Button
                            variant="success"
                            onClick={handleCreateLecture}
                            className="ms-auto"
                          >
                            <FaPlus className="me-2" />
                            Upload New
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

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
                      onClick={handleCreateLecture}
                    >
                      <FaPlus className="me-1" />
                      Upload New
                    </Button>
                  </div>
                </div>
              )}

              {/* Loading Spinner */}
              {loading && (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading lecture/video data...</p>
                </div>
              )}

              {/* Data Table */}
              {!loading && filteredData.length === 0 && (
                <Alert variant="info" className="text-center">
                  <h5>No lecture/video entries found</h5>
                  <p className="mb-0">Use the search filters above to find entries</p>
                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={handleCreateLecture}
                  >
                    <FaPlus className="me-2" />
                    Upload Your First Lecture/Video
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
                          <th>Type</th>
                          <th>Subject</th>
                          <th>Board/Batch</th>
                          <th>Date</th>
                          <th>Shared On</th>
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
                            <td>
                              <Badge bg={getContentTypeBadgeColor(entry.contentType)}>
                                {getContentTypeIcon(entry.contentType)}
                                {entry.contentType || "N/A"}
                              </Badge>
                            </td>
                            <td>{entry.subject || "N/A"}</td>
                            <td>
                              <div>
                                <small className="d-block">{entry.board || "N/A"}</small>
                                <small className="d-block text-muted">{entry.batch || "N/A"}</small>
                              </div>
                            </td>
                            <td>{formatDate(entry.date)}</td>
                            <td>
                              {entry.sharedOn ? (
                                <span>
                                  {getSharedOnIcon(entry.sharedOn)}
                                  <span className="ms-1">{entry.sharedOn}</span>
                                </span>
                              ) : (
                                "N/A"
                              )}
                            </td>
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
                                {entry.fileUrl && (
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    href={entry.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open File"
                                  >
                                    <FaLink />
                                  </Button>
                                )}
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
                    onClick={handleCreateLecture}
                    className="text-decoration-none"
                  >
                    <FaPlus className="me-1" />
                    Upload New Lecture/Video
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* View Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaVideo className="me-2 text-primary" />
            Lecture/Video Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntry && (
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Basic Information</h6>
                <div className="mb-3">
                  <strong>Content Type:</strong>{" "}
                  <Badge bg={getContentTypeBadgeColor(selectedEntry.contentType)}>
                    {getContentTypeIcon(selectedEntry.contentType)}
                    {selectedEntry.contentType || "N/A"}
                  </Badge>
                </div>
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedEntry.subject || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Board:</strong> {selectedEntry.board || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Batch:</strong> {selectedEntry.batch || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Date:</strong> {formatDate(selectedEntry.date)}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Additional Details</h6>
                <div className="mb-3">
                  <strong>Chapter:</strong> {selectedEntry.chapter || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Shared On:</strong>{" "}
                  {selectedEntry.sharedOn ? (
                    <span>
                      {getSharedOnIcon(selectedEntry.sharedOn)}
                      <span className="ms-1">{selectedEntry.sharedOn}</span>
                    </span>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="mb-3">
                  <strong>Filename:</strong> {selectedEntry.filename || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>{" "}
                  <Badge bg={selectedEntry.isActive ? "success" : "danger"}>
                    {selectedEntry.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {selectedEntry.fileUrl && (
                  <div className="mb-3">
                    <strong>File URL:</strong>{" "}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      href={selectedEntry.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLink className="me-1" />
                      Open File
                    </Button>
                  </div>
                )}
              </Col>
              {selectedEntry.description && (
                <Col xs={12}>
                  <hr />
                  <h6 className="text-muted">Description</h6>
                  <p>{selectedEntry.description}</p>
                </Col>
              )}
              {selectedEntry.unqTimeTableId && (
                <Col xs={12}>
                  <hr />
                  <h6 className="text-muted">Linked Timetable</h6>
                  <div className="bg-light p-2 rounded">
                    <small>
                      <strong>ID:</strong> {selectedEntry.unqTimeTableId._id || selectedEntry.unqTimeTableId}
                      {selectedEntry.unqTimeTableId.date && (
                        <> | <strong>Date:</strong> {formatDate(selectedEntry.unqTimeTableId.date)}</>
                      )}
                      {selectedEntry.unqTimeTableId.time && (
                        <> | <strong>Time:</strong> {selectedEntry.unqTimeTableId.time}</>
                      )}
                    </small>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedEntry?.fileUrl && (
            <Button 
              variant="primary"
              href={selectedEntry.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink className="me-2" />
              Open File
            </Button>
          )}
          <Button 
            variant="success" 
            onClick={handleCreateLecture}
          >
            <FaPlus className="me-2" />
            Upload New
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
          <p>Are you sure you want to delete this lecture/video entry?</p>
          {entryToDelete && (
            <div className="bg-light p-3 rounded">
              <p><strong>Content Type:</strong> {entryToDelete.contentType || "N/A"}</p>
              <p><strong>Subject:</strong> {entryToDelete.subject || "N/A"}</p>
              <p><strong>Date:</strong> {formatDate(entryToDelete.date)}</p>
              {entryToDelete.filename && (
                <p><strong>File:</strong> {entryToDelete.filename}</p>
              )}
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

export default ViewLectureVideos;