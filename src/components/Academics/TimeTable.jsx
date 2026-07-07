// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contextAPIs/User.context";
// import { CreateTimeTable, GetTimeTable, DeleteTimeTable } from "../../service/Academic/Academic.services";
// import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge } from "react-bootstrap";
// import { 
//   FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
//   FaClipboardList, FaHourglassStart, FaHourglassEnd, 
//   FaEye, FaArrowLeft, FaEdit, FaCheck 
// } from "react-icons/fa";

// export const TimeTable = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   // Form state
//   const [formData, setFormData] = useState({
//     unqUserObjectId: userData?._id || "",
//     time: "",
//     fromTime: "",
//     toTime: "",
//     board: "",
//     batch: "",
//     objectiveOfDay: "",
//     subject: "",
//     chapter: [],
//     excerciseNo: [],
//     date: "",
//     isObjectiveDone: false,
//     remark: "",
//     customSubject: false // For manual subject entry
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [chapterInput, setChapterInput] = useState("");
//   const [exerciseInput, setExerciseInput] = useState("");

//   // Update unqUserObjectId when userData changes
//   useEffect(() => {
//     if (userData?._id) {
//       setFormData(prev => ({
//         ...prev,
//         unqUserObjectId: userData._id
//       }));
//     }
//   }, [userData]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//     if (error) setError(null);
//     if (success) setSuccess(false);
//   };

//   // Handle time change - combines fromTime and toTime into time string
//   const handleTimeChange = (e) => {
//     const { name, value } = e.target;
    
//     setFormData(prev => {
//       const updatedForm = {
//         ...prev,
//         [name]: value
//       };
      
//       if (updatedForm.fromTime && updatedForm.toTime) {
//         updatedForm.time = `${updatedForm.fromTime} to ${updatedForm.toTime}`;
//       } else {
//         updatedForm.time = "";
//       }
      
//       return updatedForm;
//     });
    
//     if (error) setError(null);
//     if (success) setSuccess(false);
//   };

//   // Handle chapter input
//   const handleAddChapter = () => {
//     if (chapterInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         chapter: [...prev.chapter, chapterInput.trim()]
//       }));
//       setChapterInput("");
//     }
//   };

//   const handleRemoveChapter = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       chapter: prev.chapter.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle exercise input
//   const handleAddExercise = () => {
//     if (exerciseInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         excerciseNo: [...prev.excerciseNo, exerciseInput.trim()]
//       }));
//       setExerciseInput("");
//     }
//   };

//   const handleRemoveExercise = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       excerciseNo: prev.excerciseNo.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       // Validate required fields
//       if (!formData.time || !formData.date) {
//         throw new Error("Time (From - To) and Date are required fields");
//       }

//       if (!formData.board) {
//         throw new Error("Board is a required field");
//       }

//       if (!formData.batch) {
//         throw new Error("Batch is a required field");
//       }

//       if (!formData.objectiveOfDay) {
//         throw new Error("Objective of the Day is a required field");
//       }

//       if (!formData.subject && !formData.customSubject) {
//         throw new Error("Subject is a required field");
//       }

//       // Prepare data for API (remove fromTime and toTime as they're not needed)
//       const { fromTime, toTime, customSubject, ...apiData } = formData;
      
//       console.log("🚀 Sending Data to API:", apiData);
      
//       const response = await CreateTimeTable(apiData);
      
//       console.log("📦 API Response:", response);
      
//       // Check if response exists
//       if (!response) {
//         throw new Error("No response received from server");
//       }
      
//       // Check if response has success property
//       if (response.success === true) {
//         setSuccess(true);
//         // Reset form except user ID
//         setFormData({
//           unqUserObjectId: userData?._id || "",
//           time: "",
//           fromTime: "",
//           toTime: "",
//           board: "",
//           batch: "",
//           objectiveOfDay: "",
//           subject: "",
//           chapter: [],
//           excerciseNo: [],
//           date: "",
//           isObjectiveDone: false,
//           remark: "",
//           customSubject: false
//         });
//         setChapterInput("");
//         setExerciseInput("");
//         setTimeout(() => setSuccess(false), 5000);
//       } else {
//         // Show the error message from backend
//         const errorMsg = response?.message || "Failed to create timetable entry";
//         setError(errorMsg);
//       }
//     } catch (err) {
//       console.error("❌ Submit Error:", err);
//       // Handle different error types
//       if (err.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         setError(err.response.data?.message || `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         // The request was made but no response was received
//         setError("No response from server. Please check if backend is running.");
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         setError(err.message || "An error occurred while creating the timetable");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to view timetable
//   const handleViewTimetable = () => {
//     navigate("/view-time-table");
//   };

//   // Navigate back to dashboard
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Get today's date for min date attribute
//   const today = new Date().toISOString().split('T')[0];

//   // Dropdown options
//   const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
  
//   const batchOptions = ["2025-27", "2026-28"];
  
//   const objectiveOptions = [
//     "Class Lecture",
//     "Lunch",
//     "Break",
//     "Subjective Test",
//     "Objective Test",
//     "Assembly",
//     "Lunch Break",
//     "Competition",
//     "Event",
//     "Programme",
//     "Orientation",
//     "Doubt Session",
//     "Exam",
//     "Other"
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
//                   <FaCalendarAlt className="me-2" size={24} />
//                   <h4 className="mb-0">Create Timetable Entry</h4>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <Badge bg="light" text="dark" className="me-2">
//                     {userData?.name || "User"}
//                   </Badge>
//                   <Button 
//                     variant="outline-light" 
//                     size="sm" 
//                     onClick={handleViewTimetable}
//                     className="d-flex align-items-center"
//                   >
//                     <FaEye className="me-1" />
//                     View Timetable
//                   </Button>
//                 </div>
//               </div>
//             </Card.Header>

//             <Card.Body className="p-4">
//               {/* Success Alert */}
//               {success && (
//                 <Alert variant="success" className="mb-3">
//                   <Alert.Heading>✅ Success!</Alert.Heading>
//                   <p>TimeTable entry created successfully.</p>
//                 </Alert>
//               )}

//               {/* Error Alert */}
//               {error && (
//                 <Alert variant="danger" className="mb-3">
//                   <Alert.Heading>❌ Error!</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   {/* Time Range - From and To */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaHourglassStart className="me-2 text-primary" />
//                         From Time <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Control
//                         type="time"
//                         name="fromTime"
//                         value={formData.fromTime}
//                         onChange={handleTimeChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaHourglassEnd className="me-2 text-primary" />
//                         To Time <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Control
//                         type="time"
//                         name="toTime"
//                         value={formData.toTime}
//                         onChange={handleTimeChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Preview of concatenated time */}
//                   {formData.time && (
//                     <Col xs={12} className="mb-3">
//                       <Alert variant="info" className="py-2">
//                         <strong>⏰ Time Preview:</strong> {formData.time}
//                       </Alert>
//                     </Col>
//                   )}

//                   {/* Date */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaCalendarAlt className="me-2 text-primary" />
//                         Date <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleChange}
//                         required
//                         min={today}
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Board - Dropdown */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaChalkboard className="me-2 text-primary" />
//                         Board <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Select
//                         name="board"
//                         value={formData.board}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select Board</option>
//                         {boardOptions.map((board) => (
//                           <option key={board} value={board}>
//                             {board}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   {/* Batch - Dropdown */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaUserGraduate className="me-2 text-primary" />
//                         Batch <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Select
//                         name="batch"
//                         value={formData.batch}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select Batch</option>
//                         {batchOptions.map((batch) => (
//                           <option key={batch} value={batch}>
//                             {batch}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   {/* Objective of Day - Dropdown */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaClipboardList className="me-2 text-primary" />
//                         Objective of Day <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Form.Select
//                         name="objectiveOfDay"
//                         value={formData.objectiveOfDay}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select Objective</option>
//                         {objectiveOptions.map((objective) => (
//                           <option key={objective} value={objective}>
//                             {objective}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   {/* Subject - Dropdown with Custom Subject Option */}
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
//                         </>
//                       ) : (
//                         <>
//                           <Form.Control
//                             type="text"
//                             name="subject"
//                             value={formData.subject}
//                             onChange={handleChange}
//                             placeholder="Enter subject name manually"
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
//                         </>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   {/* Chapters */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaBook className="me-2 text-primary" />
//                         Chapters
//                       </Form.Label>
//                       <div className="d-flex">
//                         <Form.Control
//                           type="text"
//                           value={chapterInput}
//                           onChange={(e) => setChapterInput(e.target.value)}
//                           placeholder="Add chapter name"
//                           className="me-2"
//                         />
//                         <Button
//                           variant="outline-primary"
//                           onClick={handleAddChapter}
//                           disabled={!chapterInput.trim()}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                       <div className="mt-2 d-flex flex-wrap gap-2">
//                         {formData.chapter.map((chapter, index) => (
//                           <Badge
//                             key={index}
//                             bg="info"
//                             className="p-2 d-flex align-items-center"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => handleRemoveChapter(index)}
//                           >
//                             {chapter}
//                             <span className="ms-2">&times;</span>
//                           </Badge>
//                         ))}
//                       </div>
//                     </Form.Group>
//                   </Col>

//                   {/* Exercise Numbers */}
//                   <Col md={6} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">
//                         <FaClipboardList className="me-2 text-primary" />
//                         Exercise Numbers
//                       </Form.Label>
//                       <div className="d-flex">
//                         <Form.Control
//                           type="text"
//                           value={exerciseInput}
//                           onChange={(e) => setExerciseInput(e.target.value)}
//                           placeholder="Add exercise number"
//                           className="me-2"
//                         />
//                         <Button
//                           variant="outline-primary"
//                           onClick={handleAddExercise}
//                           disabled={!exerciseInput.trim()}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                       <div className="mt-2 d-flex flex-wrap gap-2">
//                         {formData.excerciseNo.map((exercise, index) => (
//                           <Badge
//                             key={index}
//                             bg="success"
//                             className="p-2 d-flex align-items-center"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => handleRemoveExercise(index)}
//                           >
//                             {exercise}
//                             <span className="ms-2">&times;</span>
//                           </Badge>
//                         ))}
//                       </div>
//                     </Form.Group>
//                   </Col>

//                   {/* Remark */}
//                   <Col xs={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">Remark</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         name="remark"
//                         value={formData.remark}
//                         onChange={handleChange}
//                         placeholder="Any additional remarks..."
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Is Objective Done */}
//                   <Col xs={12} className="mb-3">
//                     <Form.Group>
//                       <Form.Check
//                         type="checkbox"
//                         id="isObjectiveDone"
//                         name="isObjectiveDone"
//                         checked={formData.isObjectiveDone}
//                         onChange={handleChange}
//                         label="Objective Completed"
//                         className="fw-semibold"
//                       />
//                     </Form.Group>
//                   </Col>

//                   {/* Submit Button */}
//                   <Col xs={12} className="mt-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                       className="w-100"
//                       disabled={loading || !formData.fromTime || !formData.toTime || !formData.date}
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
//                         "Create Timetable Entry"
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
//                   onClick={handleViewTimetable}
//                   className="text-decoration-none"
//                 >
//                   <FaEye className="me-1" />
//                   View All Timetable Entries
//                 </Button>
//               </div>
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default TimeTable;











import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contextAPIs/User.context";
import { CreateTimeTable, GetTimeTable, DeleteTimeTable } from "../../service/Academic/Academic.services";
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { 
  FaCalendarAlt, FaBook, FaChalkboard, FaUserGraduate, 
  FaClipboardList, FaHourglassStart, FaHourglassEnd, 
  FaEye, FaArrowLeft, FaEdit, FaCheck, FaBookOpen, FaHashtag,
  FaPlus, FaTimes
} from "react-icons/fa";

export const TimeTable = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    unqUserObjectId: userData?._id || "",
    time: "",
    fromTime: "",
    toTime: "",
    board: "",
    batch: "",
    objectiveOfDay: "",
    subject: "",
    chapter: [],
    excerciseNo: [],
    date: "",
    isObjectiveDone: false,
    remark: "",
    customSubject: false,
    book: "",
    lectureNo: ""
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [chapterInput, setChapterInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");

  // Update unqUserObjectId when userData changes
  useEffect(() => {
    if (userData?._id) {
      setFormData(prev => ({
        ...prev,
        unqUserObjectId: userData._id
      }));
    }
  }, [userData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Handle time change - combines fromTime and toTime into time string
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedForm = {
        ...prev,
        [name]: value
      };
      
      if (updatedForm.fromTime && updatedForm.toTime) {
        updatedForm.time = `${updatedForm.fromTime} to ${updatedForm.toTime}`;
      } else {
        updatedForm.time = "";
      }
      
      return updatedForm;
    });
    
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Handle chapter input - combines chapter and topic with || separator
  const handleAddChapter = () => {
    if (chapterInput.trim()) {
      let chapterText = chapterInput.trim();
      
      // If topic is provided, combine with || separator
      if (topicInput.trim()) {
        chapterText = `${chapterText} || ${topicInput.trim()}`;
      }
      
      setFormData(prev => ({
        ...prev,
        chapter: [...prev.chapter, chapterText]
      }));
      setChapterInput("");
      setTopicInput("");
    }
  };

  const handleRemoveChapter = (index) => {
    setFormData(prev => ({
      ...prev,
      chapter: prev.chapter.filter((_, i) => i !== index)
    }));
  };

  // Handle exercise input
  const handleAddExercise = () => {
    if (exerciseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        excerciseNo: [...prev.excerciseNo, exerciseInput.trim()]
      }));
      setExerciseInput("");
    }
  };

  const handleRemoveExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      excerciseNo: prev.excerciseNo.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.time || !formData.date) {
        throw new Error("Time (From - To) and Date are required fields");
      }

      if (!formData.board) {
        throw new Error("Board is a required field");
      }

      if (!formData.batch) {
        throw new Error("Batch is a required field");
      }

      if (!formData.objectiveOfDay) {
        throw new Error("Objective of the Day is a required field");
      }

      if (!formData.subject && !formData.customSubject) {
        throw new Error("Subject is a required field");
      }

      // Prepare data for API
      const { fromTime, toTime, customSubject, ...apiData } = formData;
      
      // Convert lectureNo to number if provided
      if (apiData.lectureNo) {
        apiData.lectureNo = parseInt(apiData.lectureNo);
      }
      
      console.log("🚀 Sending Data to API:", apiData);
      
      const response = await CreateTimeTable(apiData);
      
      console.log("📦 API Response:", response);
      
      if (!response) {
        throw new Error("No response received from server");
      }
      
      if (response.success === true) {
        setSuccess(true);
        // Reset form except user ID
        setFormData({
          unqUserObjectId: userData?._id || "",
          time: "",
          fromTime: "",
          toTime: "",
          board: "",
          batch: "",
          objectiveOfDay: "",
          subject: "",
          chapter: [],
          excerciseNo: [],
          date: "",
          isObjectiveDone: false,
          remark: "",
          customSubject: false,
          book: "",
          lectureNo: ""
        });
        setChapterInput("");
        setTopicInput("");
        setExerciseInput("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorMsg = response?.message || "Failed to create timetable entry";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("❌ Submit Error:", err);
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Please check if backend is running.");
      } else {
        setError(err.message || "An error occurred while creating the timetable");
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigate to view timetable
  const handleViewTimetable = () => {
    navigate("/view-time-table");
  };

  // Navigate back to dashboard
  const handleGoBack = () => {
    navigate(-1);
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Dropdown options
  const boardOptions = ["HBSE", "CBSE", "HBSE_CBSE"];
  const batchOptions = ["2025-27", "2026-28"];
  const objectiveOptions = [
    "Class Lecture", "Lunch", "Break", "Subjective Test",
    "Objective Test", "Assembly", "Lunch Break", "Competition",
    "Event", "Programme", "Orientation", "Doubt Session", "Exam", "Other"
  ];
  const subjectOptions = [
    "Optional Subject", "Biology", "English", "Social Science",
    "Physics", "Chemistry", "Mathematics", "Hindi"
  ];

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
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
                  <h4 className="mb-0">Create Timetable Entry</h4>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark" className="me-2">
                    {userData?.name || "User"}
                  </Badge>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={handleViewTimetable}
                    className="d-flex align-items-center"
                  >
                    <FaEye className="me-1" />
                    View Timetable
                  </Button>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success" className="mb-3">
                  <Alert.Heading>✅ Success!</Alert.Heading>
                  <p>TimeTable entry created successfully.</p>
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mb-3">
                  <Alert.Heading>❌ Error!</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Time Range */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaHourglassStart className="me-2 text-primary" />
                        From Time <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="fromTime"
                        value={formData.fromTime}
                        onChange={handleTimeChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaHourglassEnd className="me-2 text-primary" />
                        To Time <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="toTime"
                        value={formData.toTime}
                        onChange={handleTimeChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  {formData.time && (
                    <Col xs={12} className="mb-3">
                      <Alert variant="info" className="py-2">
                        <strong>⏰ Time Preview:</strong> {formData.time}
                      </Alert>
                    </Col>
                  )}

                  {/* Date */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaCalendarAlt className="me-2 text-primary" />
                        Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={today}
                      />
                    </Form.Group>
                  </Col>

                  {/* Board */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaChalkboard className="me-2 text-primary" />
                        Board <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="board"
                        value={formData.board}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Board</option>
                        {boardOptions.map((board) => (
                          <option key={board} value={board}>{board}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Batch */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaUserGraduate className="me-2 text-primary" />
                        Batch <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Batch</option>
                        {batchOptions.map((batch) => (
                          <option key={batch} value={batch}>{batch}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Objective of Day */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaClipboardList className="me-2 text-primary" />
                        Objective of Day <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="objectiveOfDay"
                        value={formData.objectiveOfDay}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Objective</option>
                        {objectiveOptions.map((objective) => (
                          <option key={objective} value={objective}>{objective}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Subject */}
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
                        </>
                      ) : (
                        <>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter subject name manually"
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
                        </>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Book - Now as Input Field instead of Dropdown */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaBookOpen className="me-2 text-primary" />
                        Book
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="book"
                        value={formData.book}
                        onChange={handleChange}
                        placeholder="Enter book name (e.g., NCERT, RS Aggarwal, etc.)"
                      />
                    </Form.Group>
                  </Col>

                  {/* Lecture No - New Field */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaHashtag className="me-2 text-primary" />
                        Lecture Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="lectureNo"
                        value={formData.lectureNo}
                        onChange={handleChange}
                        placeholder="Enter lecture number"
                        min="1"
                      />
                    </Form.Group>
                  </Col>

                  {/* Chapters with Topic - Updated */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaBook className="me-2 text-primary" />
                        Chapter & Topic/Exercise
                      </Form.Label>
                      <div className="d-flex flex-column">
                        <div className="d-flex mb-2">
                          <Form.Control
                            type="text"
                            value={chapterInput}
                            onChange={(e) => setChapterInput(e.target.value)}
                            placeholder="Enter chapter name"
                            className="me-2"
                          />
                          <Button
                            variant="outline-primary"
                            onClick={handleAddChapter}
                            disabled={!chapterInput.trim()}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            placeholder="Enter topic/exercise (optional)"
                            className="me-2"
                          />
                        </div>
                        <small className="text-muted mt-1">
                          <FaEdit className="me-1" size={12} />
                          Format: Chapter Name || Topic/Exercise
                        </small>
                      </div>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {formData.chapter.map((chapter, index) => (
                          <Badge
                            key={index}
                            bg="info"
                            className="p-2 d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveChapter(index)}
                          >
                            {chapter}
                            <FaTimes className="ms-2" size={12} />
                          </Badge>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Exercise Numbers */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <FaClipboardList className="me-2 text-primary" />
                        Exercise Numbers
                      </Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={exerciseInput}
                          onChange={(e) => setExerciseInput(e.target.value)}
                          placeholder="Add exercise number"
                          className="me-2"
                        />
                        <Button
                          variant="outline-primary"
                          onClick={handleAddExercise}
                          disabled={!exerciseInput.trim()}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {formData.excerciseNo.map((exercise, index) => (
                          <Badge
                            key={index}
                            bg="success"
                            className="p-2 d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveExercise(index)}
                          >
                            {exercise}
                            <FaTimes className="ms-2" size={12} />
                          </Badge>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Remark */}
                  <Col xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Remark</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        placeholder="Any additional remarks..."
                      />
                    </Form.Group>
                  </Col>

                  {/* Is Objective Done */}
                  <Col xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="isObjectiveDone"
                        name="isObjectiveDone"
                        checked={formData.isObjectiveDone}
                        onChange={handleChange}
                        label="Objective Completed"
                        className="fw-semibold"
                      />
                    </Form.Group>
                  </Col>

                  {/* Submit Button */}
                  <Col xs={12} className="mt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100"
                      disabled={loading || !formData.fromTime || !formData.toTime || !formData.date}
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
                        "Create Timetable Entry"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>

            <Card.Footer className="bg-light text-muted">
              <div className="d-flex justify-content-between align-items-center">
                <small>
                  <FaUserGraduate className="me-1" />
                  User ID: {userData?._id || "Not logged in"}
                </small>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleViewTimetable}
                  className="text-decoration-none"
                >
                  <FaEye className="me-1" />
                  View All Timetable Entries
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TimeTable;