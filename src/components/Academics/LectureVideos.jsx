// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { CreateLectureAndVideos } from "../../service/Academic/Academic.services";
// import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge } from "react-bootstrap";
// import { 
//   FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
//   FaLink, FaCalendarAlt, FaBook, FaChalkboard, 
//   FaUserGraduate, FaClipboardList, FaArrowLeft, 
//   FaEye, FaUpload, FaEdit, FaCheck, FaWhatsapp
// } from "react-icons/fa";

// export const LectureVideos = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Form state
//   const [formData, setFormData] = useState({
//     unqTimeTableId: "",
//     contentType: "",
//     subject: "",
//     board: "",
//     chapter: "",
//     batch: "",
//     sharedOn: "",
//     date: "",
//     filename: "",
//     fileUrl: "",
//     description: "",
//     isActive: true,
//     customSubject: false,
//     customBoard: false,
//     customBatch: false
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Dropdown options
//   const contentTypeOptions = [
//     "PPT",
//     "Notes",
//     "HW",
//     "TEST"
//   ];

//   const boardOptions = [
//     "HBSE",
//     "CBSE",
//     "HBSE_CBSE"
//   ];

//   const batchOptions = [
//     "2025-27",
//     "2026-28"
//   ];

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

//   const sharedOnOptions = [
//     "Whatsapp",
//     "Class Plus"
//   ];

//   // Get today's date
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//     if (error) setError(null);
//     if (success) setSuccess(false);
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.contentType) {
//       errors.contentType = "Content Type is required";
//     }
    
//     if (!formData.subject && !formData.customSubject) {
//       errors.subject = "Subject is required";
//     } else if (formData.customSubject && !formData.subject) {
//       errors.subject = "Please enter a subject";
//     }
    
//     if (!formData.board && !formData.customBoard) {
//       errors.board = "Board is required";
//     } else if (formData.customBoard && !formData.board) {
//       errors.board = "Please enter a board";
//     }
    
//     if (!formData.batch && !formData.customBatch) {
//       errors.batch = "Batch is required";
//     } else if (formData.customBatch && !formData.batch) {
//       errors.batch = "Please enter a batch";
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   // Handle form submission
// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) {
//     return;
//   }

//   setLoading(true);
//   setError(null);
//   setSuccess(false);

//   try {
//     // Prepare data for API - remove empty fields
//     const { customSubject, customBoard, customBatch, unqTimeTableId, ...restData } = formData;
    
//     // Build apiData without empty fields
//     const apiData = { ...restData };
    
//     // Only add unqTimeTableId if it has a value
//     if (unqTimeTableId && unqTimeTableId.trim() !== "") {
//       apiData.unqTimeTableId = unqTimeTableId;
//     }
    
//     console.log("🚀 Sending Data to API:", apiData);
    
//     const response = await CreateLectureAndVideos(apiData);
    
//     console.log("📦 API Response:", response);
    
//     if (response && response.success) {
//       setSuccess(true);
//       // Reset form
//       setFormData({
//         unqTimeTableId: "",
//         contentType: "",
//         subject: "",
//         board: "",
//         chapter: "",
//         batch: "",
//         sharedOn: "",
//         date: "",
//         filename: "",
//         fileUrl: "",
//         description: "",
//         isActive: true,
//         customSubject: false,
//         customBoard: false,
//         customBatch: false
//       });
//       setTimeout(() => setSuccess(false), 5000);
//     } else {
//       setError(response?.message || "Failed to create lecture/video entry");
//     }
//   } catch (err) {
//     console.error("❌ Submit Error:", err);
//     if (err.response) {
//       setError(err.response.data?.message || `Server error: ${err.response.status}`);
//     } else if (err.request) {
//       setError("No response from server. Please check if backend is running.");
//     } else {
//       setError(err.message || "An error occurred while creating the entry");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   // Navigate back
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Navigate to view lecture/videos
//   const handleViewLectures = () => {
//     navigate("/view-lecture-videos");
//   };

//   // Get icon for content type
//   const getContentTypeIcon = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'video': return <FaVideo className="me-2 text-danger" />;
//       case 'pdf': return <FaFilePdf className="me-2 text-danger" />;
//       case 'ppt': return <FaFilePowerpoint className="me-2 text-warning" />;
//       case 'notes': return <FaFileAlt className="me-2 text-primary" />;
//       case 'hw': return <FaFileAlt className="me-2 text-success" />;
//       case 'test': return <FaFileAlt className="me-2 text-danger" />;
//       case 'document': return <FaFileAlt className="me-2 text-primary" />;
//       default: return <FaFileAlt className="me-2 text-secondary" />;
//     }
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={10} xl={8}>
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
//                   <h4 className="mb-0">Upload Lecture / Video</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleViewLectures}
//                     className="d-flex align-items-center"
//                   >
//                     <FaEye className="me-1" />
//                     View All
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3" onClose={() => setSuccess(false)} dismissible>
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>Lecture/Video entry created successfully.</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   {/* Content Type */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaFileAlt className="me-2 text-primary" />
//                         Content Type <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Select
//                         name="contentType"
//                         value={formData.contentType}
//                         onChange={handleChange}
//                         isInvalid={!!validationErrors.contentType}
//                         required
//                       >
//                         <option value="">Select Content Type</option>
//                         {contentTypeOptions.map((type) => (
//                           <option key={type} value={type}>
//                             {type}
//                           </option>
//                         ))}
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {validationErrors.contentType}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   {/* Date */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaCalendarAlt className="me-2 text-primary" />
//                         Date
//                       </Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleChange}
//                         max={getTodayDate()}
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Subject - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Subject <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customSubject ? (
//                         <>
//                           <Form.Select
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.subject}
//                             required
//                           >
//                             <option value="">Select Subject</option>
//                             {subjectOptions.map((subject) => (
//                               <option key={subject} value={subject}>
//                                 {subject}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customSubject"
//                               name="customSubject"
//                               checked={formData.customSubject}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom subject manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.subject}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             placeholder="Enter subject name manually"
//                             isInvalid={!!validationErrors.subject}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customSubject"
//                               name="customSubject"
//                               checked={formData.customSubject}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom subject entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.subject}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Board - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaChalkboard className="me-2 text-primary" />
//                         Board <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customBoard ? (
//                         <>
//                           <Form.Select
//                             name="board"
//                             value={formData.board}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.board}
//                             required
//                           >
//                             <option value="">Select Board</option>
//                             {boardOptions.map((board) => (
//                               <option key={board} value={board}>
//                                 {board}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBoard"
//                               name="customBoard"
//                               checked={formData.customBoard}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom board manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.board}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="board"
//                             value={formData.board}
//                             onChange={handleChange}
//                             placeholder="Enter board name manually"
//                             isInvalid={!!validationErrors.board}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBoard"
//                               name="customBoard"
//                               checked={formData.customBoard}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom board entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.board}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Batch - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaUserGraduate className="me-2 text-primary" />
//                         Batch <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customBatch ? (
//                         <>
//                           <Form.Select
//                             name="batch"
//                             value={formData.batch}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.batch}
//                             required
//                           >
//                             <option value="">Select Batch</option>
//                             {batchOptions.map((batch) => (
//                               <option key={batch} value={batch}>
//                                 {batch}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBatch"
//                               name="customBatch"
//                               checked={formData.customBatch}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom batch manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.batch}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="batch"
//                             value={formData.batch}
//                             onChange={handleChange}
//                             placeholder="Enter batch manually"
//                             isInvalid={!!validationErrors.batch}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBatch"
//                               name="customBatch"
//                               checked={formData.customBatch}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom batch entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.batch}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Chapter */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Chapter
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="chapter"
//                         value={formData.chapter}
//                         onChange={handleChange}
//                         placeholder="e.g., Chapter 3: Metals and Non-metals"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Shared On */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaLink className="me-2 text-primary" />
//                         Shared On
//                       </Form.Label>
//                       <Form.Select
//                         name="sharedOn"
//                         value={formData.sharedOn}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Platform</option>
//                         {sharedOnOptions.map((platform) => (
//                           <option key={platform} value={platform}>
//                             {platform === "Whatsapp" ? (
//                               <><FaWhatsapp className="me-1" /> {platform}</>
//                             ) : (
//                               platform
//                             )}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   {/* Filename - Optional */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaFileAlt className="me-2 text-primary" />
//                         Filename (Optional)
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="filename"
//                         value={formData.filename}
//                         onChange={handleChange}
//                         placeholder="e.g., metals-and-non-metals.pptx"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* File URL - Optional */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaLink className="me-2 text-primary" />
//                         File URL (Optional)
//                       </Form.Label>
//                       <Form.Control
//                         type="url"
//                         name="fileUrl"
//                         value={formData.fileUrl}
//                         onChange={handleChange}
//                         placeholder="https://drive.google.com/file/d/abc123/view"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Description */}
//                   <Col xs={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaClipboardList className="me-2 text-primary" />
//                         Description
//                       </Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Describe the content (optional)"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Preview Section */}
//                   {(formData.contentType || formData.filename || formData.fileUrl) && (
//                     <Col xs={12} className="mb-3">
//                       <Card className="bg-light">
//                         <Card.Body>
//                           <h6 className="mb-2">📄 Preview</h6>
//                           {formData.contentType && (
//                             <div className="d-flex align-items-center">
//                               {getContentTypeIcon(formData.contentType)}
//                               <span className="fw-semibold">
//                                 {formData.contentType}
//                               </span>
//                             </div>
//                           )}
//                           {formData.filename && (
//                             <div className="mt-1">
//                               <small className="text-muted">File: {formData.filename}</small>
//                             </div>
//                           )}
//                           {formData.subject && (
//                             <small className="text-muted d-block mt-1">
//                               Subject: {formData.subject}
//                             </small>
//                           )}
//                           {formData.board && formData.batch && (
//                             <small className="text-muted d-block">
//                               {formData.board} | {formData.batch}
//                             </small>
//                           )}
//                           {formData.sharedOn && (
//                             <small className="text-muted d-block">
//                               Shared on: {formData.sharedOn}
//                             </small>
//                           )}
//                           {formData.fileUrl && (
//                             <Button
//                               variant="outline-primary"
//                               size="sm"
//                               className="mt-2"
//                               href={formData.fileUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               <FaLink className="me-1" />
//                               Open File
//                             </Button>
//                           )}
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   )}

//                   {/* Submit Button */}
//                   <Col xs={12} className="mt-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                       className="w-100"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner
//                             as="span"
//                             animation="border"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                             className="me-2"
//                           />
//                           Creating Entry...
//                         </>
//                       ) : (
//                         <>
//                           <FaUpload className="me-2" />
//                           Upload Lecture / Video
//                         </>
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               </Form>
//             </Card.Body>

//             <Card.Footer className="bg-light text-muted">
//               <div className="d-flex justify-content-between align-items-center">
//                 <small>
//                   <FaUserGraduate className="me-1" />
//                   User ID: {userData?._id || "Not logged in"}
//                 </small>
//                 <Button
//                   variant="link"
//                   size="sm"
//                   onClick={handleViewLectures}
//                   className="text-decoration-none"
//                 >
//                   <FaEye className="me-1" />
//                   View All Lecture/Video Entries
//                 </Button>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LectureVideos;








// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { CreateLectureAndVideos } from "../../service/Academic/Academic.services";
// import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, Modal } from "react-bootstrap";

// import { 
//   FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
//   FaLink, FaCalendarAlt, FaBook, FaChalkboard, 
//   FaUserGraduate, FaClipboardList, FaArrowLeft, 
//   FaEye, FaUpload, FaEdit, FaCheck, FaWhatsapp,
//   FaGoogle, FaTimesCircle, FaCopy, FaExternalLinkAlt,
//   FaTimes  // <-- Add this line
// } from "react-icons/fa";

// export const LectureVideos = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Form state
//   const [formData, setFormData] = useState({
//     unqTimeTableId: "",
//     contentType: "",
//     subject: "",
//     board: "",
//     chapter: "",
//     batch: "",
//     sharedOn: "",
//     date: "",
//     filename: "",
//     fileUrl: "",
//     description: "",
//     isActive: true,
//     customSubject: false,
//     customBoard: false,
//     customBatch: false
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Google Drive Modal State
//   const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
//   const [googleDriveUrl, setGoogleDriveUrl] = useState('');

//   // Google App Script URL - Replace with your deployed URL
//   const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw822SBmVjR2P9nCOthXHjrHRVDeqo_gZLu7y7Sme2oYuqFLOXKM0_P7FoVcDgL7u31Nw/exec';

//   // Dropdown options
//   const contentTypeOptions = [
//     "PPT",
//     "Notes",
//     "HW",
//     "TEST"
//   ];

//   const boardOptions = [
//     "HBSE",
//     "CBSE",
//     "HBSE_CBSE"
//   ];

//   const batchOptions = [
//     "2025-27",
//     "2026-28"
//   ];

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

//   const sharedOnOptions = [
//     "Whatsapp",
//     "Class Plus"
//   ];

//   // Get today's date
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//     if (error) setError(null);
//     if (success) setSuccess(false);
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.contentType) {
//       errors.contentType = "Content Type is required";
//     }
    
//     if (!formData.subject && !formData.customSubject) {
//       errors.subject = "Subject is required";
//     } else if (formData.customSubject && !formData.subject) {
//       errors.subject = "Please enter a subject";
//     }
    
//     if (!formData.board && !formData.customBoard) {
//       errors.board = "Board is required";
//     } else if (formData.customBoard && !formData.board) {
//       errors.board = "Please enter a board";
//     }
    
//     if (!formData.batch && !formData.customBatch) {
//       errors.batch = "Batch is required";
//     } else if (formData.customBatch && !formData.batch) {
//       errors.batch = "Please enter a batch";
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       // Prepare data for API - remove empty fields
//       const { customSubject, customBoard, customBatch, unqTimeTableId, ...restData } = formData;
      
//       // Build apiData without empty fields
//       const apiData = { ...restData };
      
//       // Only add unqTimeTableId if it has a value
//       if (unqTimeTableId && unqTimeTableId.trim() !== "") {
//         apiData.unqTimeTableId = unqTimeTableId;
//       }
      
//       console.log("🚀 Sending Data to API:", apiData);
      
//       const response = await CreateLectureAndVideos(apiData);
      
//       console.log("📦 API Response:", response);
      
//       if (response && response.success) {
//         setSuccess(true);
//         // Reset form but keep the fileUrl if needed
//         setFormData({
//           unqTimeTableId: "",
//           contentType: "",
//           subject: "",
//           board: "",
//           chapter: "",
//           batch: "",
//           sharedOn: "",
//           date: "",
//           filename: "",
//           fileUrl: "",
//           description: "",
//           isActive: true,
//           customSubject: false,
//           customBoard: false,
//           customBatch: false
//         });
//         setGoogleDriveUrl('');
//         setTimeout(() => setSuccess(false), 5000);
//       } else {
//         setError(response?.message || "Failed to create lecture/video entry");
//       }
//     } catch (err) {
//       console.error("❌ Submit Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while creating the entry");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate back
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Navigate to view lecture/videos
//   const handleViewLectures = () => {
//     navigate("/view-lecture-videos");
//   };

//   // Google Drive Modal Handlers
//   const handleOpenGoogleDrive = () => {
//     setShowGoogleDriveModal(true);
//   };

//   const handleCloseGoogleDrive = () => {
//     setShowGoogleDriveModal(false);
//     // If URL was copied, you can optionally auto-fill it
//     if (googleDriveUrl) {
//       setFormData(prev => ({
//         ...prev,
//         fileUrl: googleDriveUrl
//       }));
//     }
//   };

//   // Handle messages from iframe (if Google App Script sends data)
//   useEffect(() => {
//     const handleMessage = (event) => {
//       // Check if message is from your Google App Script
//       if (event.data && event.data.type === 'URL_COPIED') {
//         const url = event.data.url;
//         setGoogleDriveUrl(url);
//         setFormData(prev => ({
//           ...prev,
//           fileUrl: url
//         }));
//         // Show success message
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 3000);
//       }
//     };
    
//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // Get icon for content type
//   const getContentTypeIcon = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'video': return <FaVideo className="me-2 text-danger" />;
//       case 'pdf': return <FaFilePdf className="me-2 text-danger" />;
//       case 'ppt': return <FaFilePowerpoint className="me-2 text-warning" />;
//       case 'notes': return <FaFileAlt className="me-2 text-primary" />;
//       case 'hw': return <FaFileAlt className="me-2 text-success" />;
//       case 'test': return <FaFileAlt className="me-2 text-danger" />;
//       case 'document': return <FaFileAlt className="me-2 text-primary" />;
//       default: return <FaFileAlt className="me-2 text-secondary" />;
//     }
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={10} xl={8}>
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
//                   <h4 className="mb-0">Upload Lecture / Video</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleViewLectures}
//                     className="d-flex align-items-center"
//                   >
//                     <FaEye className="me-1" />
//                     View All
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3" onClose={() => setSuccess(false)} dismissible>
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>Lecture/Video entry created successfully.</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   {/* Content Type */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaFileAlt className="me-2 text-primary" />
//                         Content Type <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Select
//                         name="contentType"
//                         value={formData.contentType}
//                         onChange={handleChange}
//                         isInvalid={!!validationErrors.contentType}
//                         required
//                       >
//                         <option value="">Select Content Type</option>
//                         {contentTypeOptions.map((type) => (
//                           <option key={type} value={type}>
//                             {type}
//                           </option>
//                         ))}
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {validationErrors.contentType}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   {/* Date */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaCalendarAlt className="me-2 text-primary" />
//                         Date
//                       </Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleChange}
//                         max={getTodayDate()}
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Subject - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Subject <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customSubject ? (
//                         <>
//                           <Form.Select
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.subject}
//                             required
//                           >
//                             <option value="">Select Subject</option>
//                             {subjectOptions.map((subject) => (
//                               <option key={subject} value={subject}>
//                                 {subject}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customSubject"
//                               name="customSubject"
//                               checked={formData.customSubject}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom subject manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.subject}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             placeholder="Enter subject name manually"
//                             isInvalid={!!validationErrors.subject}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customSubject"
//                               name="customSubject"
//                               checked={formData.customSubject}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom subject entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.subject}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Board - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaChalkboard className="me-2 text-primary" />
//                         Board <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customBoard ? (
//                         <>
//                           <Form.Select
//                             name="board"
//                             value={formData.board}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.board}
//                             required
//                           >
//                             <option value="">Select Board</option>
//                             {boardOptions.map((board) => (
//                               <option key={board} value={board}>
//                                 {board}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBoard"
//                               name="customBoard"
//                               checked={formData.customBoard}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom board manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.board}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="board"
//                             value={formData.board}
//                             onChange={handleChange}
//                             placeholder="Enter board name manually"
//                             isInvalid={!!validationErrors.board}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBoard"
//                               name="customBoard"
//                               checked={formData.customBoard}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom board entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.board}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Batch - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaUserGraduate className="me-2 text-primary" />
//                         Batch <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customBatch ? (
//                         <>
//                           <Form.Select
//                             name="batch"
//                             value={formData.batch}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.batch}
//                             required
//                           >
//                             <option value="">Select Batch</option>
//                             {batchOptions.map((batch) => (
//                               <option key={batch} value={batch}>
//                                 {batch}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBatch"
//                               name="customBatch"
//                               checked={formData.customBatch}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom batch manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.batch}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="batch"
//                             value={formData.batch}
//                             onChange={handleChange}
//                             placeholder="Enter batch manually"
//                             isInvalid={!!validationErrors.batch}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBatch"
//                               name="customBatch"
//                               checked={formData.customBatch}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom batch entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.batch}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Chapter */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Chapter
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="chapter"
//                         value={formData.chapter}
//                         onChange={handleChange}
//                         placeholder="e.g., Chapter 3: Metals and Non-metals"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Shared On */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaLink className="me-2 text-primary" />
//                         Shared On
//                       </Form.Label>
//                       <Form.Select
//                         name="sharedOn"
//                         value={formData.sharedOn}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Platform</option>
//                         {sharedOnOptions.map((platform) => (
//                           <option key={platform} value={platform}>
//                             {platform === "Whatsapp" ? (
//                               <><FaWhatsapp className="me-1" /> {platform}</>
//                             ) : (
//                               platform
//                             )}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   {/* Filename - Optional */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaFileAlt className="me-2 text-primary" />
//                         Filename (Optional)
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="filename"
//                         value={formData.filename}
//                         onChange={handleChange}
//                         placeholder="e.g., metals-and-non-metals.pptx"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* File URL Section with Google Drive Integration */}
//                   <Col md={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaLink className="me-2 text-primary" />
//                         File URL (Optional)
//                       </Form.Label>
//                       <div className="d-flex gap-2">
//                         <Form.Control
//                           type="url"
//                           name="fileUrl"
//                           value={formData.fileUrl}
//                           onChange={handleChange}
//                           placeholder="https://drive.google.com/file/d/abc123/view"
//                           className="flex-grow-1"
//                         />
//                         <Button
//                           variant="success"
//                           onClick={handleOpenGoogleDrive}
//                           className="d-flex align-items-center gap-1"
//                         >
//                           <FaGoogle />
//                           <FaUpload />
//                           <span className="d-none d-sm-inline">Upload</span>
//                         </Button>
//                         {formData.fileUrl && (
//                           <Button
//                             variant="outline-primary"
//                             onClick={() => {
//                               window.open(formData.fileUrl, '_blank');
//                             }}
//                           >
//                             <FaExternalLinkAlt />
//                           </Button>
//                         )}
//                       </div>
//                       <Form.Text className="text-muted">
//                         <FaGoogle className="me-1 text-success" />
//                         Click the <strong>Upload</strong> button to upload your file to Google Drive and get a shareable URL automatically.
//                         <br />
//                         <small>
//                           <strong>Tip:</strong> You can also paste any Google Drive URL directly.
//                         </small>
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>

//                   {/* Google Drive URL Auto-filled indicator */}
//                   {googleDriveUrl && (
//                     <Col xs={12} className="mb-3">
//                       <Alert variant="success" className="mb-0">
//                         <FaCheck className="me-2" />
//                         <strong>Google Drive URL ready!</strong> The URL has been automatically added to the File URL field.
//                         <Button
//                           variant="link"
//                           size="sm"
//                           className="ms-2 p-0"
//                           onClick={() => {
//                             navigator.clipboard.writeText(googleDriveUrl);
//                             setSuccess(true);
//                             setTimeout(() => setSuccess(false), 2000);
//                           }}
//                         >
//                           <FaCopy className="me-1" />
//                           Copy URL
//                         </Button>
//                       </Alert>
//                     </Col>
//                   )}

//                   {/* Description */}
//                   <Col xs={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaClipboardList className="me-2 text-primary" />
//                         Description
//                       </Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Describe the content (optional)"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Preview Section */}
//                   {(formData.contentType || formData.filename || formData.fileUrl) && (
//                     <Col xs={12} className="mb-3">
//                       <Card className="bg-light">
//                         <Card.Body>
//                           <h6 className="mb-2">📄 Preview</h6>
//                           {formData.contentType && (
//                             <div className="d-flex align-items-center">
//                               {getContentTypeIcon(formData.contentType)}
//                               <span className="fw-semibold">
//                                 {formData.contentType}
//                               </span>
//                             </div>
//                           )}
//                           {formData.filename && (
//                             <div className="mt-1">
//                               <small className="text-muted">File: {formData.filename}</small>
//                             </div>
//                           )}
//                           {formData.subject && (
//                             <small className="text-muted d-block mt-1">
//                               Subject: {formData.subject}
//                             </small>
//                           )}
//                           {formData.board && formData.batch && (
//                             <small className="text-muted d-block">
//                               {formData.board} | {formData.batch}
//                             </small>
//                           )}
//                           {formData.sharedOn && (
//                             <small className="text-muted d-block">
//                               Shared on: {formData.sharedOn}
//                             </small>
//                           )}
//                           {formData.fileUrl && (
//                             <div className="mt-2">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 href={formData.fileUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="me-2"
//                               >
//                                 <FaExternalLinkAlt className="me-1" />
//                                 Open File
//                               </Button>
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(formData.fileUrl);
//                                   setSuccess(true);
//                                   setTimeout(() => setSuccess(false), 2000);
//                                 }}
//                               >
//                                 <FaCopy className="me-1" />
//                                 Copy URL
//                               </Button>
//                             </div>
//                           )}
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   )}

//                   {/* Submit Button */}
//                   <Col xs={12} className="mt-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                       className="w-100"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner
//                             as="span"
//                             animation="border"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                             className="me-2"
//                           />
//                           Creating Entry...
//                         </>
//                       ) : (
//                         <>
//                           <FaUpload className="me-2" />
//                           Upload Lecture / Video
//                         </>
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               </Form>
//             </Card.Body>

//             <Card.Footer className="bg-light text-muted">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <small>
//                   <FaUserGraduate className="me-1" />
//                   User ID: {userData?._id || "Not logged in"}
//                 </small>
//                 <div className="d-flex gap-3">
//                   <Button
//                     variant="link"
//                     size="sm"
//                     onClick={handleViewLectures}
//                     className="text-decoration-none"
//                   >
//                     <FaEye className="me-1" />
//                     View All Lecture/Video Entries
//                   </Button>
//                 </div>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>

//       {/* Google Drive Upload Modal */}
//       <Modal 
//         show={showGoogleDriveModal} 
//         onHide={handleCloseGoogleDrive}
//         size="xl"
//         className="google-drive-modal"
//         centered
//       >
//         <Modal.Header className="bg-success text-white">
//           <Modal.Title>
//             <FaGoogle className="me-2" />
//             <FaUpload className="me-2" />
//             Upload File to Google Drive
//           </Modal.Title>
//           <Button 
//             variant="outline-light" 
//             size="sm" 
//             onClick={handleCloseGoogleDrive}
//             className="ms-2"
//           >
//             <FaTimesCircle className="me-1" />
//             Close
//           </Button>
//         </Modal.Header>
//         <Modal.Body style={{ padding: 0, height: '80vh' }}>
//           <div className="google-drive-iframe-container" style={{ height: '100%', width: '100%' }}>
//             <iframe
//               src={GOOGLE_APP_SCRIPT_URL}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 border: 'none',
//                 borderRadius: '0 0 8px 8px'
//               }}
//               title="Google Drive Uploader"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//             />
//           </div>
//         </Modal.Body>
//         <Modal.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
//             <div className="text-muted small">
//               <FaGoogle className="me-1 text-success" />
//               <strong>Instructions:</strong> Upload your file, copy the URL, and it will be automatically added to the form.
//             </div>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="secondary" 
//                 size="sm"
//                 onClick={handleCloseGoogleDrive}
//               >
//                 <FaTimes className="me-1" />
//                 Close
//               </Button>
//             </div>
//           </div>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default LectureVideos;













// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { CreateLectureAndVideos } from "../../service/Academic/Academic.services";
// import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, Modal } from "react-bootstrap";
// import { 
//   FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
//   FaLink, FaCalendarAlt, FaBook, FaChalkboard, 
//   FaUserGraduate, FaClipboardList, FaArrowLeft, 
//   FaEye, FaUpload, FaEdit, FaCheck, FaWhatsapp,
//   FaGoogle, FaTimesCircle, FaCopy, FaExternalLinkAlt,
//   FaTimes, FaWindowMaximize
// } from "react-icons/fa";

// export const LectureVideos = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Form state
//   const [formData, setFormData] = useState({
//     unqTimeTableId: "",
//     contentType: "",
//     subject: "",
//     board: "",
//     chapter: "",
//     batch: "",
//     sharedOn: "",
//     date: "",
//     filename: "",
//     fileUrl: "",
//     description: "",
//     isActive: true,
//     customSubject: false,
//     customBoard: false,
//     customBatch: false
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Google Drive Popup State
//   const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
//   const [googleDriveUrl, setGoogleDriveUrl] = useState('');
//   const [popupWindow, setPopupWindow] = useState(null);

//   // Google App Script URL
//   const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw822SBmVjR2P9nCOthXHjrHRVDeqo_gZLu7y7Sme2oYuqFLOXKM0_P7FoVcDgL7u31Nw/exec';

//   // Dropdown options
//   const contentTypeOptions = ["PPT", "Notes", "HW", "TEST"];
//   const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
//   const batchOptions = ["2025-27", "2026-28"];
//   const subjectOptions = [
//     "Optional Subject", "Biology", "English", "Social Science",
//     "Physics", "Chemistry", "Mathematics", "Hindi"
//   ];
//   const sharedOnOptions = ["Whatsapp", "Class Plus"];

//   // Get today's date
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//     if (error) setError(null);
//     if (success) setSuccess(false);
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.contentType) {
//       errors.contentType = "Content Type is required";
//     }
    
//     if (!formData.subject && !formData.customSubject) {
//       errors.subject = "Subject is required";
//     } else if (formData.customSubject && !formData.subject) {
//       errors.subject = "Please enter a subject";
//     }
    
//     if (!formData.board && !formData.customBoard) {
//       errors.board = "Board is required";
//     } else if (formData.customBoard && !formData.board) {
//       errors.board = "Please enter a board";
//     }
    
//     if (!formData.batch && !formData.customBatch) {
//       errors.batch = "Batch is required";
//     } else if (formData.customBatch && !formData.batch) {
//       errors.batch = "Please enter a batch";
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const { customSubject, customBoard, customBatch, unqTimeTableId, ...restData } = formData;
//       const apiData = { ...restData };
      
//       if (unqTimeTableId && unqTimeTableId.trim() !== "") {
//         apiData.unqTimeTableId = unqTimeTableId;
//       }
      
//       console.log("🚀 Sending Data to API:", apiData);
      
//       const response = await CreateLectureAndVideos(apiData);
      
//       console.log("📦 API Response:", response);
      
//       if (response && response.success) {
//         setSuccess(true);
//         setFormData({
//           unqTimeTableId: "",
//           contentType: "",
//           subject: "",
//           board: "",
//           chapter: "",
//           batch: "",
//           sharedOn: "",
//           date: "",
//           filename: "",
//           fileUrl: "",
//           description: "",
//           isActive: true,
//           customSubject: false,
//           customBoard: false,
//           customBatch: false
//         });
//         setGoogleDriveUrl('');
//         setTimeout(() => setSuccess(false), 5000);
//       } else {
//         setError(response?.message || "Failed to create lecture/video entry");
//       }
//     } catch (err) {
//       console.error("❌ Submit Error:", err);
//       if (err.response) {
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         setError(err.message || "An error occurred while creating the entry");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate functions
//   const handleGoBack = () => navigate(-1);
//   const handleViewLectures = () => navigate("/view-lecture-videos");

//   // Google Drive Popup Handler - OPEN IN POPUP INSTEAD OF IFRAME
//   const handleOpenGoogleDrive = () => {
//     setShowGoogleDriveModal(true);
    
//     // Open Google App Script in a popup window
//     const popup = window.open(
//       GOOGLE_APP_SCRIPT_URL,
//       'GoogleDriveUpload',
//       'width=900,height=700,scrollbars=yes,resizable=yes'
//     );
//     setPopupWindow(popup);
    
//     // Focus the popup
//     if (popup) {
//       popup.focus();
//     }
//   };

//   const handleCloseGoogleDrive = () => {
//     setShowGoogleDriveModal(false);
//     // Close the popup if it's still open
//     if (popupWindow && !popupWindow.closed) {
//       popupWindow.close();
//     }
//     setPopupWindow(null);
    
//     // If URL was copied, auto-fill it
//     if (googleDriveUrl) {
//       setFormData(prev => ({
//         ...prev,
//         fileUrl: googleDriveUrl
//       }));
//     }
//   };

//   // Handle messages from popup (Google App Script)
//   useEffect(() => {
//     const handleMessage = (event) => {
//       // Check if message is from your Google App Script
//       if (event.data && event.data.type === 'URL_COPIED') {
//         const url = event.data.url;
//         setGoogleDriveUrl(url);
//         setFormData(prev => ({
//           ...prev,
//           fileUrl: url
//         }));
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 3000);
        
//         // Close the popup automatically
//         if (popupWindow && !popupWindow.closed) {
//           setTimeout(() => {
//             popupWindow.close();
//             setPopupWindow(null);
//             setShowGoogleDriveModal(false);
//           }, 1500);
//         }
//       }
//     };
    
//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, [popupWindow]);

//   // Clean up popup on component unmount
//   useEffect(() => {
//     return () => {
//       if (popupWindow && !popupWindow.closed) {
//         popupWindow.close();
//       }
//     };
//   }, [popupWindow]);

//   // Get icon for content type
//   const getContentTypeIcon = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'video': return <FaVideo className="me-2 text-danger" />;
//       case 'pdf': return <FaFilePdf className="me-2 text-danger" />;
//       case 'ppt': return <FaFilePowerpoint className="me-2 text-warning" />;
//       case 'notes': return <FaFileAlt className="me-2 text-primary" />;
//       case 'hw': return <FaFileAlt className="me-2 text-success" />;
//       case 'test': return <FaFileAlt className="me-2 text-danger" />;
//       case 'document': return <FaFileAlt className="me-2 text-primary" />;
//       default: return <FaFileAlt className="me-2 text-secondary" />;
//     }
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={10} xl={8}>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <Button variant="outline-light" size="sm" onClick={handleGoBack} className="me-2">
//                     <FaArrowLeft />
//                   </Button>
//                   <FaVideo className="me-2" size={24} />
//                   <h4 className="mb-0">Upload Lecture / Video</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   <Button variant="outline-light" size="sm" onClick={handleViewLectures} className="d-flex align-items-center">
//                     <FaEye className="me-1" />
//                     View All
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3" onClose={() => setSuccess(false)} dismissible>
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>Lecture/Video entry created successfully.</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   {/* Content Type */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaFileAlt className="me-2 text-primary" />
//                         Content Type <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Select
//                         name="contentType"
//                         value={formData.contentType}
//                         onChange={handleChange}
//                         isInvalid={!!validationErrors.contentType}
//                         required
//                       >
//                         <option value="">Select Content Type</option>
//                         {contentTypeOptions.map((type) => (
//                           <option key={type} value={type}>{type}</option>
//                         ))}
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {validationErrors.contentType}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>

//                   {/* Date */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaCalendarAlt className="me-2 text-primary" />
//                         Date
//                       </Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleChange}
//                         max={getTodayDate()}
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Subject - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Subject <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customSubject ? (
//                         <>
//                           <Form.Select
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.subject}
//                             required
//                           >
//                             <option value="">Select Subject</option>
//                             {subjectOptions.map((subject) => (
//                               <option key={subject} value={subject}>{subject}</option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customSubject"
//                               name="customSubject"
//                               checked={formData.customSubject}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom subject manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.subject}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             placeholder="Enter subject name manually"
//                             isInvalid={!!validationErrors.subject}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customSubject"
//                               name="customSubject"
//                               checked={formData.customSubject}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom subject entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.subject}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Board - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaChalkboard className="me-2 text-primary" />
//                         Board <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customBoard ? (
//                         <>
//                           <Form.Select
//                             name="board"
//                             value={formData.board}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.board}
//                             required
//                           >
//                             <option value="">Select Board</option>
//                             {boardOptions.map((board) => (
//                               <option key={board} value={board}>{board}</option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBoard"
//                               name="customBoard"
//                               checked={formData.customBoard}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom board manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.board}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="board"
//                             value={formData.board}
//                             onChange={handleChange}
//                             placeholder="Enter board name manually"
//                             isInvalid={!!validationErrors.board}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBoard"
//                               name="customBoard"
//                               checked={formData.customBoard}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom board entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.board}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Batch - Dropdown with Custom Option */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaUserGraduate className="me-2 text-primary" />
//                         Batch <span className="text-danger">*</span>
//                       </Form.Label>
                      
//                       {!formData.customBatch ? (
//                         <>
//                           <Form.Select
//                             name="batch"
//                             value={formData.batch}
//                             onChange={handleChange}
//                             isInvalid={!!validationErrors.batch}
//                             required
//                           >
//                             <option value="">Select Batch</option>
//                             {batchOptions.map((batch) => (
//                               <option key={batch} value={batch}>{batch}</option>
//                             ))}
//                           </Form.Select>
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBatch"
//                               name="customBatch"
//                               checked={formData.customBatch}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaEdit className="me-1" size={14} />
//                                   Enter custom batch manually
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.batch}
//                           </Form.Control.Feedback>
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="batch"
//                             value={formData.batch}
//                             onChange={handleChange}
//                             placeholder="Enter batch manually"
//                             isInvalid={!!validationErrors.batch}
//                             required
//                           />
//                           <div className="mt-2">
//                             <Form.Check
//                               type="checkbox"
//                               id="customBatch"
//                               name="customBatch"
//                               checked={formData.customBatch}
//                               onChange={handleChange}
//                               label={
//                                 <span className="d-flex align-items-center">
//                                   <FaCheck className="me-1 text-success" size={14} />
//                                   Using custom batch entry
//                                 </span>
//                               }
//                             />
//                           </div>
//                           <Form.Control.Feedback type="invalid">
//                             {validationErrors.batch}
//                           </Form.Control.Feedback>
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Chapter */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Chapter
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="chapter"
//                         value={formData.chapter}
//                         onChange={handleChange}
//                         placeholder="e.g., Chapter 3: Metals and Non-metals"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Shared On */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaLink className="me-2 text-primary" />
//                         Shared On
//                       </Form.Label>
//                       <Form.Select
//                         name="sharedOn"
//                         value={formData.sharedOn}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Platform</option>
//                         {sharedOnOptions.map((platform) => (
//                           <option key={platform} value={platform}>
//                             {platform === "Whatsapp" ? (
//                               <><FaWhatsapp className="me-1" /> {platform}</>
//                             ) : platform}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   {/* Filename - Optional */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaFileAlt className="me-2 text-primary" />
//                         Filename (Optional)
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="filename"
//                         value={formData.filename}
//                         onChange={handleChange}
//                         placeholder="e.g., metals-and-non-metals.pptx"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* File URL Section with Google Drive Integration */}
//                   <Col md={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaLink className="me-2 text-primary" />
//                         File URL (Optional)
//                       </Form.Label>
//                       <div className="d-flex gap-2">
//                         <Form.Control
//                           type="url"
//                           name="fileUrl"
//                           value={formData.fileUrl}
//                           onChange={handleChange}
//                           placeholder="https://drive.google.com/file/d/abc123/view"
//                           className="flex-grow-1"
//                         />
//                         <Button
//                           variant="success"
//                           onClick={handleOpenGoogleDrive}
//                           className="d-flex align-items-center gap-1"
//                         >
//                           <FaGoogle />
//                           <FaUpload />
//                           <span className="d-none d-sm-inline">Upload</span>
//                           <FaWindowMaximize className="ms-1" size={12} />
//                         </Button>
//                         {formData.fileUrl && (
//                           <Button
//                             variant="outline-primary"
//                             onClick={() => {
//                               window.open(formData.fileUrl, '_blank');
//                             }}
//                           >
//                             <FaExternalLinkAlt />
//                           </Button>
//                         )}
//                       </div>
//                       <Form.Text className="text-muted">
//                         <FaGoogle className="me-1 text-success" />
//                         Click the <strong>Upload</strong> button to open Google Drive uploader in a new window.
//                         <br />
//                         <small>
//                           <strong>Tip:</strong> Upload your file, copy the URL, and paste it here.
//                         </small>
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>

//                   {/* Google Drive URL Auto-filled indicator */}
//                   {googleDriveUrl && (
//                     <Col xs={12} className="mb-3">
//                       <Alert variant="success" className="mb-0">
//                         <FaCheck className="me-2" />
//                         <strong>Google Drive URL ready!</strong> The URL has been automatically added to the File URL field.
//                         <Button
//                           variant="link"
//                           size="sm"
//                           className="ms-2 p-0"
//                           onClick={() => {
//                             navigator.clipboard.writeText(googleDriveUrl);
//                             setSuccess(true);
//                             setTimeout(() => setSuccess(false), 2000);
//                           }}
//                         >
//                           <FaCopy className="me-1" />
//                           Copy URL
//                         </Button>
//                       </Alert>
//                     </Col>
//                   )}

//                   {/* Description */}
//                   <Col xs={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaClipboardList className="me-2 text-primary" />
//                         Description
//                       </Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Describe the content (optional)"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Preview Section */}
//                   {(formData.contentType || formData.filename || formData.fileUrl) && (
//                     <Col xs={12} className="mb-3">
//                       <Card className="bg-light">
//                         <Card.Body>
//                           <h6 className="mb-2">📄 Preview</h6>
//                           {formData.contentType && (
//                             <div className="d-flex align-items-center">
//                               {getContentTypeIcon(formData.contentType)}
//                               <span className="fw-semibold">{formData.contentType}</span>
//                             </div>
//                           )}
//                           {formData.filename && (
//                             <div className="mt-1">
//                               <small className="text-muted">File: {formData.filename}</small>
//                             </div>
//                           )}
//                           {formData.subject && (
//                             <small className="text-muted d-block mt-1">
//                               Subject: {formData.subject}
//                             </small>
//                           )}
//                           {formData.board && formData.batch && (
//                             <small className="text-muted d-block">
//                               {formData.board} | {formData.batch}
//                             </small>
//                           )}
//                           {formData.sharedOn && (
//                             <small className="text-muted d-block">
//                               Shared on: {formData.sharedOn}
//                             </small>
//                           )}
//                           {formData.fileUrl && (
//                             <div className="mt-2">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 href={formData.fileUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="me-2"
//                               >
//                                 <FaExternalLinkAlt className="me-1" />
//                                 Open File
//                               </Button>
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(formData.fileUrl);
//                                   setSuccess(true);
//                                   setTimeout(() => setSuccess(false), 2000);
//                                 }}
//                               >
//                                 <FaCopy className="me-1" />
//                                 Copy URL
//                               </Button>
//                             </div>
//                           )}
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   )}

//                   {/* Submit Button */}
//                   <Col xs={12} className="mt-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                       className="w-100"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner
//                             as="span"
//                             animation="border"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                             className="me-2"
//                           />
//                           Creating Entry...
//                         </>
//                       ) : (
//                         <>
//                           <FaUpload className="me-2" />
//                           Upload Lecture / Video
//                         </>
//                       )}
//                     </Button>
//                   </Col>
//                 </Row>
//               </Form>
//             </Card.Body>

//             <Card.Footer className="bg-light text-muted">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <small>
//                   <FaUserGraduate className="me-1" />
//                   User ID: {userData?._id || "Not logged in"}
//                 </small>
//                 <div className="d-flex gap-3">
//                   <Button
//                     variant="link"
//                     size="sm"
//                     onClick={handleViewLectures}
//                     className="text-decoration-none"
//                   >
//                     <FaEye className="me-1" />
//                     View All Lecture/Video Entries
//                   </Button>
//                 </div>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>

//       {/* Google Drive Upload Modal - Simplified */}
//       <Modal 
//         show={showGoogleDriveModal} 
//         onHide={handleCloseGoogleDrive}
//         size="md"
//         className="google-drive-modal"
//         centered
//       >
//         <Modal.Header className="bg-success text-white">
//           <Modal.Title>
//             <FaGoogle className="me-2" />
//             <FaUpload className="me-2" />
//             Google Drive Upload
//           </Modal.Title>
//           <Button 
//             variant="outline-light" 
//             size="sm" 
//             onClick={handleCloseGoogleDrive}
//           >
//             <FaTimesCircle className="me-1" />
//             Close
//           </Button>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center py-4">
//             <FaGoogle size={64} className="text-success mb-3" />
//             <h5>Upload your file to Google Drive</h5>
//             <p className="text-muted">
//               A popup window has been opened. Please follow these steps:
//             </p>
//             <div className="text-start bg-light p-3 rounded">
//               <ol className="mb-0">
//                 <li className="mb-2">📤 Upload your file in the popup window</li>
//                 <li className="mb-2">🔗 Copy the generated shareable URL</li>
//                 <li className="mb-2">📋 Paste the URL in the File URL field above</li>
//                 <li>✅ Click "Upload Lecture / Video" to save</li>
//               </ol>
//             </div>
//             {!popupWindow?.closed && (
//               <Button 
//                 variant="outline-success" 
//                 className="mt-3"
//                 onClick={() => {
//                   if (popupWindow && !popupWindow.closed) {
//                     popupWindow.focus();
//                   } else {
//                     handleOpenGoogleDrive();
//                   }
//                 }}
//               >
//                 <FaWindowMaximize className="me-2" />
//                 Open Upload Window
//               </Button>
//             )}
//           </div>
//         </Modal.Body>
//         <Modal.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
//             <div className="text-muted small">
//               <FaGoogle className="me-1 text-success" />
//               <strong>Tip:</strong> If popup is blocked, allow popups for this site.
//             </div>
//             <Button 
//               variant="secondary" 
//               size="sm"
//               onClick={handleCloseGoogleDrive}
//             >
//               <FaTimes className="me-1" />
//               Close
//             </Button>
//           </div>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default LectureVideos;

















import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import { CreateLectureAndVideos } from "../../service/Academic/Academic.services";
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge, Modal } from "react-bootstrap";
import Select from 'react-select';
import { 
  FaVideo, FaFilePdf, FaFilePowerpoint, FaFileAlt, 
  FaLink, FaCalendarAlt, FaBook, FaChalkboard, 
  FaUserGraduate, FaClipboardList, FaArrowLeft, 
  FaEye, FaUpload, FaEdit, FaCheck, FaWhatsapp,
  FaGoogle, FaTimesCircle, FaCopy, FaExternalLinkAlt,
  FaTimes, FaWindowMaximize, FaHome, FaFileInvoice
} from "react-icons/fa";

export const LectureVideos = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    unqTimeTableId: "",
    contentType: "",
    subject: "",
    board: "",
    chapter: "",
    batch: "",
    sharedOn: [],
    date: "",
    filename: "",
    fileUrl: "",
    description: "",
    isActive: true,
    customSubject: false,
    customBoard: false,
    customBatch: false,
    solutionDate: "",
    contentTypeDisplay: "" // For display purposes
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Google Drive Popup State
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [popupWindow, setPopupWindow] = useState(null);

  // Google App Script URL
  const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw822SBmVjR2P9nCOthXHjrHRVDeqo_gZLu7y7Sme2oYuqFLOXKM0_P7FoVcDgL7u31Nw/exec';

  // Dropdown options - Updated with new content types
  const contentTypeOptions = [
    "PPT", 
    "Notes", 
    "HW", 
    "TEST",
    "Home Assigned",
    "Solution Shared || Date"
  ];
  
  const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
  const batchOptions = ["2025-27", "2026-28"];
  const subjectOptions = [
    "Optional Subject", "Biology", "English", "Social Science",
    "Physics", "Chemistry", "Mathematics", "Hindi"
  ];
  
  // Shared On options for react-select
  const sharedOnOptions = [
    { value: 'Whatsapp', label: 'Whatsapp' },
    { value: 'Class Plus', label: 'Class Plus' }
  ];

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check if content type is "Solution Shared"
  const isSolutionShared = formData.contentType === "Solution Shared || Date";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If changing contentType, reset solutionDate
    if (name === 'contentType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        solutionDate: value !== "Solution Shared || Date" ? "" : prev.solutionDate,
        contentTypeDisplay: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
    
    if (error) setError(null);
    if (success) setSuccess(false);
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle Solution Date change - updates contentType with concatenated value
  const handleSolutionDateChange = (e) => {
    const dateValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      solutionDate: dateValue,
      // Keep contentType as the base value, but store display value separately
      contentType: "Solution Shared || Date", // Keep base value for dropdown
      contentTypeDisplay: dateValue ? `Solution Shared || ${dateValue}` : "Solution Shared || Date"
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
    if (validationErrors.solutionDate) {
      setValidationErrors(prev => ({ ...prev, solutionDate: null }));
    }
  };

  // Handle Shared On change - multi-select
  const handleSharedOnChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      sharedOn: selectedOptions || []
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.contentType) {
      errors.contentType = "Content Type is required";
    }
    
    // If Solution Shared is selected, validate that date is selected
    if (formData.contentType === "Solution Shared || Date" && !formData.solutionDate) {
      errors.solutionDate = "Please select a date for Solution Shared";
    }
    
    if (!formData.subject && !formData.customSubject) {
      errors.subject = "Subject is required";
    } else if (formData.customSubject && !formData.subject) {
      errors.subject = "Please enter a subject";
    }
    
    if (!formData.board && !formData.customBoard) {
      errors.board = "Board is required";
    } else if (formData.customBoard && !formData.board) {
      errors.board = "Please enter a board";
    }
    
    if (!formData.batch && !formData.customBatch) {
      errors.batch = "Batch is required";
    } else if (formData.customBatch && !formData.batch) {
      errors.batch = "Please enter a batch";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { customSubject, customBoard, customBatch, unqTimeTableId, solutionDate, sharedOn, contentTypeDisplay, ...restData } = formData;
      
      // Prepare API data
      const apiData = { ...restData };
      
      // For Solution Shared, use the display value with date
      if (formData.contentType === "Solution Shared || Date" && solutionDate) {
        apiData.contentType = `Solution Shared || ${solutionDate}`;
      }
      
      // Convert sharedOn array to pipe-separated string
      if (sharedOn && sharedOn.length > 0) {
        apiData.sharedOn = sharedOn.map(item => item.value).join(' || ');
      } else {
        apiData.sharedOn = null;
      }
      
      if (unqTimeTableId && unqTimeTableId.trim() !== "") {
        apiData.unqTimeTableId = unqTimeTableId;
      }
      
      console.log("🚀 Sending Data to API:", apiData);
      
      const response = await CreateLectureAndVideos(apiData);
      
      console.log("📦 API Response:", response);
      
      if (response && response.success) {
        setSuccess(true);
        setFormData({
          unqTimeTableId: "",
          contentType: "",
          subject: "",
          board: "",
          chapter: "",
          batch: "",
          sharedOn: [],
          date: "",
          filename: "",
          fileUrl: "",
          description: "",
          isActive: true,
          customSubject: false,
          customBoard: false,
          customBatch: false,
          solutionDate: "",
          contentTypeDisplay: ""
        });
        setGoogleDriveUrl('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response?.message || "Failed to create lecture/video entry");
      }
    } catch (err) {
      console.error("❌ Submit Error:", err);
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Please check if backend is running.");
      } else {
        setError(err.message || "An error occurred while creating the entry");
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigate functions
  const handleGoBack = () => navigate(-1);
  const handleViewLectures = () => navigate("/view-lecture-videos");

  // Google Drive Popup Handler
  const handleOpenGoogleDrive = () => {
    setShowGoogleDriveModal(true);
    
    const popup = window.open(
      GOOGLE_APP_SCRIPT_URL,
      'GoogleDriveUpload',
      'width=900,height=700,scrollbars=yes,resizable=yes'
    );
    setPopupWindow(popup);
    
    if (popup) {
      popup.focus();
    }
  };

  const handleCloseGoogleDrive = () => {
    setShowGoogleDriveModal(false);
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
    }
    setPopupWindow(null);
    
    if (googleDriveUrl) {
      setFormData(prev => ({
        ...prev,
        fileUrl: googleDriveUrl
      }));
    }
  };

  // Handle messages from popup
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'URL_COPIED') {
        const url = event.data.url;
        setGoogleDriveUrl(url);
        setFormData(prev => ({
          ...prev,
          fileUrl: url
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        if (popupWindow && !popupWindow.closed) {
          setTimeout(() => {
            popupWindow.close();
            setPopupWindow(null);
            setShowGoogleDriveModal(false);
          }, 1500);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [popupWindow]);

  // Clean up popup on component unmount
  useEffect(() => {
    return () => {
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  }, [popupWindow]);

  // Get icon for content type
  const getContentTypeIcon = (type) => {
    if (!type) return <FaFileAlt className="me-2 text-secondary" />;
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('ppt')) return <FaFilePowerpoint className="me-2 text-warning" />;
    if (lowerType.includes('notes')) return <FaFileAlt className="me-2 text-primary" />;
    if (lowerType.includes('hw')) return <FaFileAlt className="me-2 text-success" />;
    if (lowerType.includes('test')) return <FaFileAlt className="me-2 text-danger" />;
    if (lowerType.includes('home assigned')) return <FaHome className="me-2 text-info" />;
    if (lowerType.includes('solution shared')) return <FaFileInvoice className="me-2 text-success" />;
    if (lowerType.includes('video')) return <FaVideo className="me-2 text-danger" />;
    if (lowerType.includes('pdf')) return <FaFilePdf className="me-2 text-danger" />;
    if (lowerType.includes('document')) return <FaFileAlt className="me-2 text-primary" />;
    return <FaFileAlt className="me-2 text-secondary" />;
  };

  // Get content type display value
  const getContentTypeDisplay = () => {
    if (formData.contentType === "Solution Shared || Date" && formData.solutionDate) {
      return `Solution Shared || ${formData.solutionDate}`;
    }
    return formData.contentType || formData.contentTypeDisplay || "";
  };

  // Get shared on display text
  const getSharedOnDisplay = () => {
    if (formData.sharedOn && formData.sharedOn.length > 0) {
      return formData.sharedOn.map(item => item.value).join(' || ');
    }
    return null;
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Button variant="outline-light" size="sm" onClick={handleGoBack} className="me-2">
                    <FaArrowLeft />
                  </Button>
                  <FaVideo className="me-2" size={24} />
                  <h4 className="mb-0">Upload Lecture / Video</h4>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark" className="me-2">
                    {userData?.name || "User"}
                  </Badge>
                  <Button variant="outline-light" size="sm" onClick={handleViewLectures} className="d-flex align-items-center">
                    <FaEye className="me-1" />
                    View All
                  </Button>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Success Alert */}
              {success && (
                <Alert variant="success" className="mb-3" onClose={() => setSuccess(false)} dismissible>
                  <Alert.Heading>✅ Success!</Alert.Heading>
                  <p>Lecture/Video entry created successfully.</p>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
                  <Alert.Heading>❌ Error!</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Content Type */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaFileAlt className="me-2 text-primary" />
                        Content Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="contentType"
                        value={formData.contentType}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.contentType}
                        required
                      >
                        <option value="">Select Content Type</option>
                        {contentTypeOptions.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.contentType}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Solution Date - Only appears when Solution Shared is selected */}
                  {isSolutionShared && (
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <FaCalendarAlt className="me-2 text-success" />
                          Solution Date <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="solutionDate"
                          value={formData.solutionDate}
                          onChange={handleSolutionDateChange}
                          isInvalid={!!validationErrors.solutionDate}
                          required
                        />
                        <Form.Text className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          Select the date for this solution. This will be added to the Content Type.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.solutionDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}

                  {/* Show preview of Solution Shared value */}
                  {isSolutionShared && formData.solutionDate && (
                    <Col xs={12} className="mb-2">
                      <Alert variant="info" className="py-2">
                        <strong>📋 Content Type Preview:</strong> Solution Shared || {formData.solutionDate}
                      </Alert>
                    </Col>
                  )}

                  {/* Date */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaCalendarAlt className="me-2 text-primary" />
                        Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={getTodayDate()}
                      />
                    </Form.Group>
                  </Col>

                  {/* Subject - Dropdown with Custom Option */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaBook className="me-2 text-primary" />
                        Subject <span className="text-danger">*</span>
                      </Form.Label>
                      
                      {!formData.customSubject ? (
                        <>
                          <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.subject}
                            required
                          >
                            <option value="">Select Subject</option>
                            {subjectOptions.map((subject) => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </Form.Select>
                          <div className="mt-2">
                            <Form.Check
                              type="checkbox"
                              id="customSubject"
                              name="customSubject"
                              checked={formData.customSubject}
                              onChange={handleChange}
                              label={
                                <span className="d-flex align-items-center">
                                  <FaEdit className="me-1" size={14} />
                                  Enter custom subject manually
                                </span>
                              }
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.subject}
                          </Form.Control.Feedback>
                        </>
                      ) : (
                        <>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter subject name manually"
                            isInvalid={!!validationErrors.subject}
                            required
                          />
                          <div className="mt-2">
                            <Form.Check
                              type="checkbox"
                              id="customSubject"
                              name="customSubject"
                              checked={formData.customSubject}
                              onChange={handleChange}
                              label={
                                <span className="d-flex align-items-center">
                                  <FaCheck className="me-1 text-success" size={14} />
                                  Using custom subject entry
                                </span>
                              }
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.subject}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Board - Dropdown with Custom Option */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaChalkboard className="me-2 text-primary" />
                        Board <span className="text-danger">*</span>
                      </Form.Label>
                      
                      {!formData.customBoard ? (
                        <>
                          <Form.Select
                            name="board"
                            value={formData.board}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.board}
                            required
                          >
                            <option value="">Select Board</option>
                            {boardOptions.map((board) => (
                              <option key={board} value={board}>{board}</option>
                            ))}
                          </Form.Select>
                          <div className="mt-2">
                            <Form.Check
                              type="checkbox"
                              id="customBoard"
                              name="customBoard"
                              checked={formData.customBoard}
                              onChange={handleChange}
                              label={
                                <span className="d-flex align-items-center">
                                  <FaEdit className="me-1" size={14} />
                                  Enter custom board manually
                                </span>
                              }
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.board}
                          </Form.Control.Feedback>
                        </>
                      ) : (
                        <>
                          <Form.Control
                            type="text"
                            name="board"
                            value={formData.board}
                            onChange={handleChange}
                            placeholder="Enter board name manually"
                            isInvalid={!!validationErrors.board}
                            required
                          />
                          <div className="mt-2">
                            <Form.Check
                              type="checkbox"
                              id="customBoard"
                              name="customBoard"
                              checked={formData.customBoard}
                              onChange={handleChange}
                              label={
                                <span className="d-flex align-items-center">
                                  <FaCheck className="me-1 text-success" size={14} />
                                  Using custom board entry
                                </span>
                              }
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.board}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Batch - Dropdown with Custom Option */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaUserGraduate className="me-2 text-primary" />
                        Batch <span className="text-danger">*</span>
                      </Form.Label>
                      
                      {!formData.customBatch ? (
                        <>
                          <Form.Select
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            isInvalid={!!validationErrors.batch}
                            required
                          >
                            <option value="">Select Batch</option>
                            {batchOptions.map((batch) => (
                              <option key={batch} value={batch}>{batch}</option>
                            ))}
                          </Form.Select>
                          <div className="mt-2">
                            <Form.Check
                              type="checkbox"
                              id="customBatch"
                              name="customBatch"
                              checked={formData.customBatch}
                              onChange={handleChange}
                              label={
                                <span className="d-flex align-items-center">
                                  <FaEdit className="me-1" size={14} />
                                  Enter custom batch manually
                                </span>
                              }
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.batch}
                          </Form.Control.Feedback>
                        </>
                      ) : (
                        <>
                          <Form.Control
                            type="text"
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            placeholder="Enter batch manually"
                            isInvalid={!!validationErrors.batch}
                            required
                          />
                          <div className="mt-2">
                            <Form.Check
                              type="checkbox"
                              id="customBatch"
                              name="customBatch"
                              checked={formData.customBatch}
                              onChange={handleChange}
                              label={
                                <span className="d-flex align-items-center">
                                  <FaCheck className="me-1 text-success" size={14} />
                                  Using custom batch entry
                                </span>
                              }
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.batch}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Chapter */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaBook className="me-2 text-primary" />
                        Chapter
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="chapter"
                        value={formData.chapter}
                        onChange={handleChange}
                        placeholder="e.g., Chapter 3: Metals and Non-metals"
                      />
                    </Form.Group>
                  </Col>

                  {/* Shared On - Multi-select with react-select */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaLink className="me-2 text-primary" />
                        Shared On
                      </Form.Label>
                      <Select
                        isMulti
                        name="sharedOn"
                        options={sharedOnOptions}
                        value={formData.sharedOn}
                        onChange={handleSharedOnChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select platform(s)"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: '38px',
                            borderColor: '#ced4da',
                            '&:hover': {
                              borderColor: '#86b7fe'
                            }
                          })
                        }}
                      />
                      {formData.sharedOn && formData.sharedOn.length > 0 && (
                        <Form.Text className="text-muted">
                          <FaCheck className="me-1 text-success" />
                          Selected: {formData.sharedOn.map(item => item.value).join(' || ')}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Filename - Optional */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaFileAlt className="me-2 text-primary" />
                        Filename (Optional)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="filename"
                        value={formData.filename}
                        onChange={handleChange}
                        placeholder="e.g., metals-and-non-metals.pptx"
                      />
                    </Form.Group>
                  </Col>

                  {/* File URL Section with Google Drive Integration */}
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaLink className="me-2 text-primary" />
                        File URL (Optional)
                      </Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="url"
                          name="fileUrl"
                          value={formData.fileUrl}
                          onChange={handleChange}
                          placeholder="https://drive.google.com/file/d/abc123/view"
                          className="flex-grow-1"
                        />
                        <Button
                          variant="success"
                          onClick={handleOpenGoogleDrive}
                          className="d-flex align-items-center gap-1"
                        >
                          <FaGoogle />
                          <FaUpload />
                          <span className="d-none d-sm-inline">Upload</span>
                          <FaWindowMaximize className="ms-1" size={12} />
                        </Button>
                        {formData.fileUrl && (
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              window.open(formData.fileUrl, '_blank');
                            }}
                          >
                            <FaExternalLinkAlt />
                          </Button>
                        )}
                      </div>
                      <Form.Text className="text-muted">
                        <FaGoogle className="me-1 text-success" />
                        Click the <strong>Upload</strong> button to open Google Drive uploader in a new window.
                        <br />
                        <small>
                          <strong>Tip:</strong> Upload your file, copy the URL, and paste it here.
                        </small>
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Google Drive URL Auto-filled indicator */}
                  {googleDriveUrl && (
                    <Col xs={12} className="mb-3">
                      <Alert variant="success" className="mb-0">
                        <FaCheck className="me-2" />
                        <strong>Google Drive URL ready!</strong> The URL has been automatically added to the File URL field.
                        <Button
                          variant="link"
                          size="sm"
                          className="ms-2 p-0"
                          onClick={() => {
                            navigator.clipboard.writeText(googleDriveUrl);
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 2000);
                          }}
                        >
                          <FaCopy className="me-1" />
                          Copy URL
                        </Button>
                      </Alert>
                    </Col>
                  )}

                  {/* Description */}
                  <Col xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaClipboardList className="me-2 text-primary" />
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the content (optional)"
                      />
                    </Form.Group>
                  </Col>

                  {/* Preview Section */}
                  {(formData.contentType || formData.filename || formData.fileUrl || formData.solutionDate) && (
                    <Col xs={12} className="mb-3">
                      <Card className="bg-light">
                        <Card.Body>
                          <h6 className="mb-2">📄 Preview</h6>
                          {getContentTypeDisplay() && (
                            <div className="d-flex align-items-center">
                              {getContentTypeIcon(getContentTypeDisplay())}
                              <span className="fw-semibold">{getContentTypeDisplay()}</span>
                            </div>
                          )}
                          {formData.filename && (
                            <div className="mt-1">
                              <small className="text-muted">File: {formData.filename}</small>
                            </div>
                          )}
                          {formData.subject && (
                            <small className="text-muted d-block mt-1">
                              Subject: {formData.subject}
                            </small>
                          )}
                          {formData.board && formData.batch && (
                            <small className="text-muted d-block">
                              {formData.board} | {formData.batch}
                            </small>
                          )}
                          {getSharedOnDisplay() && (
                            <small className="text-muted d-block">
                              Shared on: {getSharedOnDisplay()}
                            </small>
                          )}
                          {formData.fileUrl && (
                            <div className="mt-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                href={formData.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="me-2"
                              >
                                <FaExternalLinkAlt className="me-1" />
                                Open File
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(formData.fileUrl);
                                  setSuccess(true);
                                  setTimeout(() => setSuccess(false), 2000);
                                }}
                              >
                                <FaCopy className="me-1" />
                                Copy URL
                              </Button>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  )}

                  {/* Submit Button */}
                  <Col xs={12} className="mt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Creating Entry...
                        </>
                      ) : (
                        <>
                          <FaUpload className="me-2" />
                          Upload Lecture / Video
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>

            <Card.Footer className="bg-light text-muted">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <small>
                  <FaUserGraduate className="me-1" />
                  User ID: {userData?._id || "Not logged in"}
                </small>
                <div className="d-flex gap-3">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleViewLectures}
                    className="text-decoration-none"
                  >
                    <FaEye className="me-1" />
                    View All Lecture/Video Entries
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Google Drive Upload Modal */}
      <Modal 
        show={showGoogleDriveModal} 
        onHide={handleCloseGoogleDrive}
        size="md"
        className="google-drive-modal"
        centered
      >
        <Modal.Header className="bg-success text-white">
          <Modal.Title>
            <FaGoogle className="me-2" />
            <FaUpload className="me-2" />
            Google Drive Upload
          </Modal.Title>
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={handleCloseGoogleDrive}
          >
            <FaTimesCircle className="me-1" />
            Close
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-4">
            <FaGoogle size={64} className="text-success mb-3" />
            <h5>Upload your file to Google Drive</h5>
            <p className="text-muted">
              A popup window has been opened. Please follow these steps:
            </p>
            <div className="text-start bg-light p-3 rounded">
              <ol className="mb-0">
                <li className="mb-2">📤 Upload your file in the popup window</li>
                <li className="mb-2">🔗 Copy the generated shareable URL</li>
                <li className="mb-2">📋 Paste the URL in the File URL field above</li>
                <li>✅ Click "Upload Lecture / Video" to save</li>
              </ol>
            </div>
            {!popupWindow?.closed && (
              <Button 
                variant="outline-success" 
                className="mt-3"
                onClick={() => {
                  if (popupWindow && !popupWindow.closed) {
                    popupWindow.focus();
                  } else {
                    handleOpenGoogleDrive();
                  }
                }}
              >
                <FaWindowMaximize className="me-2" />
                Open Upload Window
              </Button>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
            <div className="text-muted small">
              <FaGoogle className="me-1 text-success" />
              <strong>Tip:</strong> If popup is blocked, allow popups for this site.
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleCloseGoogleDrive}
            >
              <FaTimes className="me-1" />
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LectureVideos;