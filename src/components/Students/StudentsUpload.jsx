
// import React, {
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";

// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

// import {
//   School_drop_down,
//   Batch_drop_down,
// } from "../Utils/DependentDropDowns.v2";

// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

// import { UplaoadStudentFiles, getStudentUploadsObjectives, GetStudentsForUploads, DeletUploads } from "../../service/StudentUploadServices/StudentUpload.services";

// import {
//   Container,
//   Card,
//   Table,
//   Button,
//   Badge,
//   Spinner,
//   ToggleButton,
//   ToggleButtonGroup,
//   Row,
//   Col,
//   Alert,
//   Form,
// } from "react-bootstrap";

// import Select from "react-select";

// import {
//   FaThLarge,
//   FaTable,
//   FaSpinner,
//   FaUpload,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaEye,
//   FaFilePdf,
//   FaFileImage,
//   FaTrash,
// } from "react-icons/fa";

// import imageCompression from 'browser-image-compression';

// const StudentRow = React.memo(
//   ({
//     student,
//     index,
//     selectedFile,
//     uploadLoading,
//     deleteLoading,
//     onFileSelect,
//     onUpload,
//     onDelete,
//     uploadStatus,
//     existingUpload,
//   }) => {
//     const [localFile, setLocalFile] = useState(null);
//     const fileInputRef = useRef(null);

//     const handleFileChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setLocalFile(file);
//         onFileSelect(student._id, file);
//       }
//     };

//     const handleUploadClick = () => {
//       if (localFile) {
//         onUpload(student._id, localFile);
//       }
//     };

//     const handleDeleteClick = () => {
//       if (existingUpload && existingUpload._id) {
//         onDelete(student._id, existingUpload._id);
//       }
//     };

//     const isAlreadyUploaded = existingUpload && existingUpload.fileUrl;
//     const isUploaded = uploadStatus[student._id] === "success";
//     const isError = uploadStatus[student._id] === "error";
//     const isLoading = uploadLoading[student._id];
//     const isDeleting = deleteLoading[student._id];

//     const getFileIcon = (fileType) => {
//       if (fileType === 'application/pdf') return <FaFilePdf />;
//       if (fileType?.startsWith('image/')) return <FaFileImage />;
//       return <FaFileImage />;
//     };

//     const handleViewFile = () => {
//       if (existingUpload && existingUpload.fileUrl) {
//         window.open(existingUpload.fileUrl, '_blank');
//       }
//     };

//     return (
//       <tr>
//         <td className="text-center small-cell">
//           {index + 1}
//         </td>
//         <td className="small-cell">
//           {student.studentSrn || "N/A"}
//         </td>
//         <td className="name-cell">
//           <strong>{student.firstName || "N/A"}</strong>
//           {student.lastName ? ` ${student.lastName}` : ""}
//         </td>
//         <td className="name-cell">
//           {student.fatherName || "N/A"}
//         </td>
//         <td className="upload-cell">
//           <div className="upload-container">
//             <Form.Control
//               type="file"
//               size="sm"
//               onChange={handleFileChange}
//               ref={fileInputRef}
//               accept=".pdf,.jpg,.jpeg,.png"
//               disabled={isLoading || isDeleting || isAlreadyUploaded}
//               className="file-input"
//             />
//             <Button
//               variant="primary"
//               size="sm"
//               onClick={handleUploadClick}
//               disabled={!localFile || isLoading || isAlreadyUploaded || isDeleting}
//               className="upload-btn"
//             >
//               {isLoading ? (
//                 <FaSpinner className="spin" />
//               ) : (
//                 <FaUpload />
//               )}
//             </Button>
//             {isAlreadyUploaded && (
//               <Button
//                 variant="danger"
//                 size="sm"
//                 onClick={handleDeleteClick}
//                 disabled={isDeleting}
//                 className="delete-btn"
//                 title="Delete old file to upload new one"
//               >
//                 {isDeleting ? <FaSpinner className="spin" /> : <FaTrash />}
//               </Button>
//             )}
//           </div>
//           {(isAlreadyUploaded || isUploaded) && (
//             <Badge bg="success" className="mt-1">
//               <FaCheckCircle /> Uploaded
//             </Badge>
//           )}
//           {isError && (
//             <Badge bg="danger" className="mt-1">
//               <FaTimesCircle /> Failed
//             </Badge>
//           )}
//         </td>
//         <td className="view-cell text-center">
//           {existingUpload && existingUpload.fileUrl ? (
//             <Button
//               variant="info"
//               size="sm"
//               onClick={handleViewFile}
//               className="view-btn"
//               title="View File"
//             >
//               <FaEye className="me-1" />
//               View
//             </Button>
//           ) : (
//             <Button
//               variant="secondary"
//               size="sm"
//               disabled
//               className="view-btn-disabled"
//               title="No file uploaded"
//             >
//               <FaEye className="me-1" />
//               No File
//             </Button>
//           )}
//           {existingUpload && existingUpload.fileUrl && (
//             <div className="file-info mt-1">
//               <small className="text-muted">
//                 {getFileIcon(existingUpload.fileType)}
//                 {' '}
//                 {existingUpload.fileName?.split('-').slice(1).join('-')?.substring(0, 20) || 'File'}
//                 {existingUpload.fileName?.length > 20 ? '...' : ''}
//               </small>
//             </div>
//           )}
//         </td>
//       </tr>
//     );
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.selectedFile === nextProps.selectedFile &&
//       prevProps.uploadLoading === nextProps.uploadLoading &&
//       prevProps.deleteLoading === nextProps.deleteLoading &&
//       prevProps.uploadStatus === nextProps.uploadStatus &&
//       prevProps.existingUpload === nextProps.existingUpload
//     );
//   }
// );

// export const StudentsUpload = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);

//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState("table");
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
  
//   // Objectives state
//   const [objectives, setObjectives] = useState([]);
//   const [selectedObjective, setSelectedObjective] = useState(null);
//   const [loadingObjectives, setLoadingObjectives] = useState(false);
  
//   // File upload states
//   const [selectedFiles, setSelectedFiles] = useState({});
//   const [uploadLoading, setUploadLoading] = useState({});
//   const [uploadStatus, setUploadStatus] = useState({});
//   const [deleteLoading, setDeleteLoading] = useState({});

//   const tableWrapperRef = useRef(null);

//   const sortStudentsAlphabetically = useCallback((studentsArray) => {
//     if (!studentsArray || !Array.isArray(studentsArray)) return [];
//     return [...studentsArray].sort((a, b) => {
//       const nameA = (a.firstName || "").toLowerCase();
//       const nameB = (b.firstName || "").toLowerCase();
//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;
//       return 0;
//     });
//   }, []);

//   // Compress image file if needed
//   const compressFile = async (file) => {
//     const maxSizeMB = 10;
    
//     if (file.size <= maxSizeMB * 1024 * 1024) {
//       return file;
//     }

//     if (file.type.startsWith('image/')) {
//       const options = {
//         maxSizeMB: maxSizeMB,
//         maxWidthOrHeight: 1920,
//         useWebWorker: true,
//         fileType: file.type,
//       };
      
//       try {
//         const compressedFile = await imageCompression(file, options);
//         return compressedFile;
//       } catch (error) {
//         console.error("Error compressing image:", error);
//         throw new Error("Failed to compress image");
//       }
//     } else if (file.type === 'application/pdf') {
//       throw new Error("PDF files exceed 10MB. Please upload a smaller file.");
//     } else {
//       throw new Error("File size exceeds 10MB. Please upload a smaller file.");
//     }
//   };

//   const fetchUploadsObjectives = async () => {
//     setLoadingObjectives(true);
//     try {
//       const response = await getStudentUploadsObjectives();
//       console.log(response.data);
      
//       if (response.data && response.data.data && response.data.data.length > 0) {
//         const objectiveOptions = response.data.data.map(obj => ({
//           value: obj._id,
//           label: `${obj.objective} - ${obj.subject} (Due: ${new Date(obj.submissionDate).toLocaleDateString()})`,
//           objectiveData: obj
//         }));
//         setObjectives(objectiveOptions);
        
//         setSelectedObjective(null);
//         setStudents([]);
//       } else {
//         setObjectives([]);
//         setError("No objectives found.");
//       }
//     } catch (error) {
//       console.error("Error fetching objectives:", error);
//       setError("Failed to fetch objectives.");
//     } finally {
//       setLoadingObjectives(false);
//     }
//   };

//   // Check if all required fields are selected
//   const areRequiredFieldsSelected = useCallback(() => {
//     return selectedObjective && schoolContext?.schoolId && batchContext?.batch;
//   }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch]);

//   const fetchStudents = useCallback(async () => {
//     if (!areRequiredFieldsSelected()) {
//       if (selectedObjective && (!schoolContext?.schoolId || !batchContext?.batch)) {
//         setError("Please select both School and Batch before fetching students.");
//       }
//       setStudents([]);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSelectedFiles({});
//     setUploadStatus({});

//     const reqBody = {
//       idofstudentuploadobjectives: selectedObjective.value,
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       startDate: startDate,
//     };

//     try {
//       const response = await GetStudentsForUploads(reqBody);
//       console.log("Students response:", response.data);
      
//       const studentsData = response.data?.data || [];
      
//       // Process students to include upload info from response
//       const processedStudents = studentsData.map(student => ({
//         ...student,
//         existingUpload: student.uploadRecord || null,
//         isUploaded: student.isUploaded || false,
//         uploadStatus: student.uploadStatus || null
//       }));
      
//       const sortedStudents = sortStudentsAlphabetically(processedStudents);
//       setStudents(sortedStudents);
      
//       // Initialize upload status for already uploaded files
//       const initialUploadStatus = {};
//       sortedStudents.forEach(student => {
//         if (student.existingUpload && student.existingUpload.fileUrl) {
//           initialUploadStatus[student._id] = "success";
//         }
//       });
//       setUploadStatus(initialUploadStatus);
      
//       if (sortedStudents.length === 0) {
//         setError("No students found for the selected criteria.");
//       }
//     } catch (error) {
//       setError("Failed to fetch students.");
//       console.error("Error fetching students:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch, startDate, sortStudentsAlphabetically, areRequiredFieldsSelected]);

//   const handleObjectiveChange = (selectedOption) => {
//     setSelectedObjective(selectedOption);
//     setStudents([]);
//     setSelectedFiles({});
//     setUploadStatus({});
//     setError(null);
//   };

//   const handleFileSelect = (studentId, file) => {
//     setSelectedFiles(prev => ({
//       ...prev,
//       [studentId]: file
//     }));
//     setUploadStatus(prev => ({
//       ...prev,
//       [studentId]: null
//     }));
//   };

//   const handleDeleteFile = async (studentId, uploadRecordId) => {
//     if (!uploadRecordId) {
//       setError("Invalid upload record ID");
//       return;
//     }

//     // Confirm before deletion
//     const confirmDelete = window.confirm("Are you sure you want to delete this file? This action cannot be undone.");
//     if (!confirmDelete) {
//       return;
//     }

//     setDeleteLoading(prev => ({ ...prev, [studentId]: true }));
    
//     try {
//       // Call the delete API
//       const response = await DeletUploads({ _id: uploadRecordId });
      
//       if (response && response.status === 200) {
//         // Update student to remove existingUpload
//         setStudents(prevStudents => 
//           prevStudents.map(student => 
//             student._id === studentId 
//               ? {
//                   ...student,
//                   existingUpload: null,
//                   isUploaded: false,
//                   uploadStatus: null
//                 }
//               : student
//           )
//         );
        
//         // Clear upload status for this student
//         setUploadStatus(prev => ({
//           ...prev,
//           [studentId]: null
//         }));
        
//         // Clear selected file if any
//         setSelectedFiles(prev => {
//           const newState = { ...prev };
//           delete newState[studentId];
//           return newState;
//         });
        
//         setSuccessMessage(`File deleted successfully. You can now upload a new file.`);
//         setTimeout(() => setSuccessMessage(null), 3000);
//       } else {
//         throw new Error("Delete request failed");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       setError(error.response?.data?.message || error.message || "Failed to delete file. Please try again.");
//       setTimeout(() => setError(null), 5000);
//     } finally {
//       setDeleteLoading(prev => ({ ...prev, [studentId]: false }));
//     }
//   };

//   const handleFileUpload = async (studentId, file) => {
//     if (!selectedObjective) {
//       setError("No objective selected. Please select an objective first.");
//       return;
//     }

//     if (!schoolContext?.schoolId || !batchContext?.batch) {
//       setError("School and Batch must be selected before uploading.");
//       return;
//     }

//     setUploadLoading(prev => ({ ...prev, [studentId]: true }));
//     setUploadStatus(prev => ({ ...prev, [studentId]: "uploading" }));

//     try {
//       const compressedFile = await compressFile(file);
      
//       const formData = new FormData();
//       formData.append("unqStudentObjectId", studentId);
//       formData.append("batch", batchContext?.batch || "");
//       formData.append("uploadType", "Assignment");
//       formData.append("subject", selectedObjective.objectiveData.subject);
//       formData.append("dateOfSubmission", startDate || new Date().toISOString().split('T')[0]);
//       formData.append("topic", selectedObjective.objectiveData.objective);
//       formData.append("unqObjectIdOfStudentUploads", selectedObjective.objectiveData._id);
//       formData.append("file", compressedFile);

//       const response = await UplaoadStudentFiles(formData);
      
//       if (response && response.status === 201) {
//         setUploadStatus(prev => ({ ...prev, [studentId]: "success" }));
//         setSuccessMessage(`File uploaded successfully for ${file.name}`);
        
//         // Update the student's existing upload info
//         setStudents(prevStudents => 
//           prevStudents.map(student => 
//             student._id === studentId 
//               ? {
//                   ...student,
//                   existingUpload: response.data.data,
//                   isUploaded: true,
//                   uploadStatus: "Uploaded"
//                 }
//               : student
//           )
//         );
        
//         setTimeout(() => setSuccessMessage(null), 3000);
        
//         setSelectedFiles(prev => {
//           const newState = { ...prev };
//           delete newState[studentId];
//           return newState;
//         });
//       } else {
//         throw new Error("Upload failed");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setUploadStatus(prev => ({ ...prev, [studentId]: "error" }));
//       setError(error.message || "Failed to upload file. Please try again.");
//       setTimeout(() => setError(null), 5000);
//     } finally {
//       setUploadLoading(prev => ({ ...prev, [studentId]: false }));
//     }
//   };

//   useEffect(() => {
//     fetchUploadsObjectives();
//   }, []);

//   useEffect(() => {
//     if (areRequiredFieldsSelected()) {
//       fetchStudents();
//     } else {
//       setStudents([]);
//       if (selectedObjective && (!schoolContext?.schoolId || !batchContext?.batch)) {
//         setError(null);
//       }
//     }
//   }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch, startDate, fetchStudents, areRequiredFieldsSelected]);

//   const TableView = useMemo(() => {
//     if (students.length === 0) {
//       return (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">
//             No students found. Please ensure Objective, School, and Batch are all selected.
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div ref={tableWrapperRef} className="upload-table-wrapper">
//         <Table striped bordered hover className="upload-table">
//           <thead>
//             <tr>
//               <th className="small-heading">S.No.</th>
//               <th className="small-heading">SRN</th>
//               <th className="name-heading">Student Name</th>
//               <th className="name-heading">Father's Name</th>
//               <th className="upload-heading">Upload File</th>
//               <th className="view-heading">View File</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student, index) => (
//               <StudentRow
//                 key={student._id}
//                 student={student}
//                 index={index}
//                 selectedFile={selectedFiles[student._id]}
//                 uploadLoading={uploadLoading}
//                 deleteLoading={deleteLoading}
//                 onFileSelect={handleFileSelect}
//                 onUpload={handleFileUpload}
//                 onDelete={handleDeleteFile}
//                 uploadStatus={uploadStatus}
//                 existingUpload={student.existingUpload}
//               />
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   }, [students, selectedFiles, uploadLoading, deleteLoading, uploadStatus]);

//   const CardView = () => (
//     <Row className="g-2 mt-2">
//       {students.map((student) => {
//         const selectedFile = selectedFiles[student._id];
//         const isLoading = uploadLoading[student._id];
//         const isDeleting = deleteLoading[student._id];
//         const status = uploadStatus[student._id];
//         const isUploaded = status === "success" || student.existingUpload;
//         const isError = status === "error";
//         const existingUpload = student.existingUpload;
        
//         const getFileIcon = (fileType) => {
//           if (fileType === 'application/pdf') return <FaFilePdf />;
//           if (fileType?.startsWith('image/')) return <FaFileImage />;
//           return <FaFileImage />;
//         };

//         const handleViewFile = () => {
//           if (existingUpload && existingUpload.fileUrl) {
//             window.open(existingUpload.fileUrl, '_blank');
//           }
//         };

//         const handleDeleteClick = () => {
//           if (existingUpload && existingUpload._id) {
//             handleDeleteFile(student._id, existingUpload._id);
//           }
//         };
        
//         return (
//           <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
//             <Card className="h-100 shadow-sm">
//               <Card.Header className="bg-primary text-white">
//                 <div className="d-flex justify-content-between">
//                   <strong>{student.firstName} {student.lastName || ""}</strong>
//                   <Badge bg="light" text="dark">
//                     {student.rollNumber}
//                   </Badge>
//                 </div>
//               </Card.Header>
//               <Card.Body>
//                 <p><strong>SRN:</strong> {student.studentSrn}</p>
//                 <p><strong>Father:</strong> {student.fatherName}</p>
                
//                 {!existingUpload && (
//                   <>
//                     <Form.Group>
//                       <Form.Control
//                         type="file"
//                         size="sm"
//                         onChange={(e) => handleFileSelect(student._id, e.target.files[0])}
//                         accept=".pdf,.jpg,.jpeg,.png"
//                         disabled={isLoading || isDeleting}
//                       />
//                     </Form.Group>
//                     {selectedFile && (
//                       <div className="mt-2">
//                         <small className="text-muted">
//                           {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
//                         </small>
//                       </div>
//                     )}
//                   </>
//                 )}
                
//                 {existingUpload && (
//                   <div className="uploaded-file-info mt-2 p-2 bg-light rounded">
//                     <small>
//                       {getFileIcon(existingUpload.fileType)}
//                       {' '}
//                       <strong>Uploaded:</strong> {new Date(existingUpload.createdAt).toLocaleDateString()}
//                     </small>
//                     <br />
//                     <small className="text-muted">
//                       {existingUpload.fileName?.split('-').slice(1).join('-')?.substring(0, 30)}
//                       {existingUpload.fileName?.length > 30 ? '...' : ''}
//                     </small>
//                   </div>
//                 )}
//               </Card.Body>
//               <Card.Footer className="bg-white">
//                 {!existingUpload ? (
//                   <Button
//                     variant="primary"
//                     className="w-100"
//                     onClick={() => handleFileUpload(student._id, selectedFile)}
//                     disabled={!selectedFile || isLoading || isDeleting}
//                   >
//                     {isLoading ? (
//                       <>
//                         <FaSpinner className="spin me-2" />
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <FaUpload className="me-2" />
//                         Upload File
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <div className="d-flex gap-2">
//                     <Button
//                       variant="info"
//                       className="flex-grow-1"
//                       onClick={handleViewFile}
//                       disabled={isDeleting}
//                     >
//                       <FaEye className="me-2" />
//                       View
//                     </Button>
//                     <Button
//                       variant="danger"
//                       className="flex-grow-1"
//                       onClick={handleDeleteClick}
//                       disabled={isDeleting}
//                     >
//                       {isDeleting ? (
//                         <FaSpinner className="spin" />
//                       ) : (
//                         <FaTrash className="me-2" />
//                       )}
//                       Delete
//                     </Button>
//                   </div>
//                 )}
//                 {isUploaded && !existingUpload && (
//                   <div className="text-center mt-2">
//                     <Badge bg="success">
//                       <FaCheckCircle /> Uploaded Successfully
//                     </Badge>
//                   </div>
//                 )}
//                 {isError && (
//                   <div className="text-center mt-2">
//                     <Badge bg="danger">
//                       <FaTimesCircle /> Upload Failed
//                     </Badge>
//                   </div>
//                 )}
//               </Card.Footer>
//             </Card>
//           </Col>
//         );
//       })}
//     </Row>
//   );

//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: '38px',
//       fontSize: '14px',
//     }),
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999,
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       fontSize: '13px',
//       padding: '8px 12px',
//       backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
//       color: state.isSelected ? 'white' : '#212529',
//     }),
//   };

//   const isMissingFilters = () => {
//     const missing = [];
//     if (!selectedObjective) missing.push("Objective");
//     if (!schoolContext?.schoolId) missing.push("School");
//     if (!batchContext?.batch) missing.push("Batch");
//     return missing;
//   };

//   const missingFilters = isMissingFilters();

//   return (
//     <Container fluid className="mt-3 mb-3">
//       {successMessage && (
//         <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
//           {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Row className="mb-2">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white py-2">
//               Student File Upload
//             </Card.Header>
//             <Card.Body className="py-2">
//               <Row className="g-2">
//                 <Col md={12}>
//                   <Form.Group>
//                     <Form.Label>Select Objective <span className="text-danger">*</span></Form.Label>
//                     <Select
//                       options={objectives}
//                       value={selectedObjective}
//                       onChange={handleObjectiveChange}
//                       isLoading={loadingObjectives}
//                       isClearable
//                       placeholder="Choose an objective..."
//                       styles={customSelectStyles}
//                       noOptionsMessage={() => "No objectives found"}
//                     />
//                     {selectedObjective && (
//                       <Form.Text className="text-muted">
//                         <strong>Subject:</strong> {selectedObjective.objectiveData.subject} | 
//                         <strong> Due Date:</strong> {new Date(selectedObjective.objectiveData.submissionDate).toLocaleDateString()} |
//                         <strong> Batch:</strong> {selectedObjective.objectiveData.batch}
//                       </Form.Text>
//                     )}
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row className="g-2 mt-2">
//                 {/* <Col md={6}>
//                   <SingleDatePicker />
//                 </Col> */}
//                 <Col md={3}>
//                   <Form.Label>School <span className="text-danger">*</span></Form.Label>
//                   <School_drop_down />
//                 </Col>
//                 <Col md={3}>
//                   <Form.Label>Batch <span className="text-danger">*</span></Form.Label>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//               {missingFilters.length > 0 && missingFilters.length < 3 && (
//                 <div className="mt-2">
//                   <Alert variant="warning" className="py-1 mb-0">
//                     <small>⚠️ Please select: {missingFilters.join(", ")} to view students</small>
//                   </Alert>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {selectedObjective && schoolContext?.schoolId && batchContext?.batch && (
//         <Row className="mb-2">
//           <Col xs={12}>
//             <div className="d-flex justify-content-between align-items-center flex-wrap">
//               <div>
//                 <h6 className="mb-0">
//                   Students batch - {selectedObjective.objectiveData.batch}
//                 </h6>
//                 <small className="text-muted">
//                   Total: {students.length} students | 
//                   Objective: {selectedObjective.objectiveData.objective}
//                 </small>
//               </div>
//               <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={(val) => val && setViewMode(val)} size="sm">
//                 <ToggleButton id="table-view" value="table" variant="outline-primary">
//                   <FaTable className="me-1" />
//                   Table
//                 </ToggleButton>
//                 <ToggleButton id="card-view" value="card" variant="outline-primary">
//                   <FaThLarge className="me-1" />
//                   Card
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {!selectedObjective && !loadingObjectives && (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">
//             Please select an objective from the dropdown above to begin.
//           </p>
//         </div>
//       )}

//       {selectedObjective && (!schoolContext?.schoolId || !batchContext?.batch) && (
//         <div className="text-center py-5 bg-light rounded">
//           <p className="text-muted mb-0">
//             ⚠️ Please select both School and Batch to view students for this objective.
//           </p>
//         </div>
//       )}

//       {(loading || loadingObjectives) && (
//         <div className="text-center py-5">
//           <Spinner animation="border" />
//           <p className="mt-3">Loading...</p>
//         </div>
//       )}

//       {selectedObjective && schoolContext?.schoolId && batchContext?.batch && !loading && !loadingObjectives && (
//         viewMode === "table" ? TableView : <CardView />
//       )}

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         .upload-table-wrapper {
//           width: 100%;
//           overflow: auto;
//           -webkit-overflow-scrolling: touch;
//           max-height: 75vh;
//           position: relative;
//         }

//         .upload-table {
//           min-width: 820px;
//           margin-bottom: 0;
//           background: white;
//           font-size: 12px;
//         }

//         .upload-table thead th {
//           position: sticky;
//           top: 0;
//           z-index: 2;
//           background: #f8f9fa;
//           font-size: 11px;
//           padding: 6px;
//         }

//         .upload-table td {
//           padding: 5px 6px;
//           font-size: 11px;
//           vertical-align: middle;
//         }

//         .small-heading {
//           width: 55px;
//         }

//         .name-heading {
//           min-width: 140px;
//         }

//         .upload-heading {
//           min-width: 250px;
//         }

//         .view-heading {
//           min-width: 120px;
//         }

//         .small-cell {
//           width: 55px;
//         }

//         .name-cell {
//           min-width: 140px;
//         }

//         .upload-cell {
//           min-width: 250px;
//         }

//         .view-cell {
//           min-width: 120px;
//         }

//         .upload-container {
//           display: flex;
//           gap: 8px;
//           align-items: center;
//         }

//         .file-input {
//           flex: 1;
//           font-size: 11px;
//           padding: 4px;
//         }

//         .upload-btn {
//           width: 32px;
//           height: 31px;
//           padding: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .delete-btn {
//           width: 32px;
//           height: 31px;
//           padding: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .view-btn {
//           width: 70px;
//           font-size: 11px;
//           padding: 4px;
//         }

//         .view-btn-disabled {
//           width: 70px;
//           font-size: 11px;
//           padding: 4px;
//         }

//         .file-info {
//           font-size: 10px;
//         }

//         .uploaded-file-info {
//           font-size: 11px;
//         }

//         .upload-table th,
//         .upload-table td {
//           vertical-align: middle;
//         }

//         .upload-table-wrapper::-webkit-scrollbar {
//           width: 5px;
//           height: 5px;
//         }

//         .upload-table-wrapper::-webkit-scrollbar-thumb {
//           background: #c1c1c1;
//           border-radius: 10px;
//         }

//         button {
//           transition: none !important;
//         }

//         @media (max-width: 768px) {
//           .container-fluid {
//             padding-left: 8px;
//             padding-right: 8px;
//           }

//           .upload-table {
//             min-width: 750px;
//             font-size: 10px;
//           }

//           .upload-table thead th {
//             font-size: 10px;
//             padding: 5px;
//           }

//           .upload-table td {
//             font-size: 10px;
//             padding: 4px 5px;
//           }

//           .name-heading,
//           .name-cell {
//             min-width: 115px;
//           }

//           .upload-heading,
//           .upload-cell {
//             min-width: 220px;
//           }

//           .view-heading,
//           .view-cell {
//             min-width: 100px;
//           }

//           .file-input {
//             font-size: 9px;
//           }

//           .upload-btn {
//             width: 28px;
//             height: 28px;
//           }

//           .delete-btn {
//             width: 28px;
//             height: 28px;
//           }

//           .view-btn {
//             width: 60px;
//             font-size: 9px;
//           }
//         }
//       `}</style>
//     </Container>
//   );
// };
















import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

import {
  School_drop_down,
  Batch_drop_down,
} from "../Utils/DependentDropDowns.v2";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

import { UplaoadStudentFiles, getStudentUploadsObjectives, GetStudentsForUploads, DeletUploads } from "../../service/StudentUploadServices/StudentUpload.services";

import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Row,
  Col,
  Alert,
  Form,
} from "react-bootstrap";

import Select from "react-select";

import {
  FaThLarge,
  FaTable,
  FaSpinner,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFilePdf,
  FaFileImage,
  FaTrash,
} from "react-icons/fa";

import imageCompression from 'browser-image-compression';

const StudentRow = React.memo(
  ({
    student,
    index,
    selectedFile,
    uploadLoading,
    deleteLoading,
    onFileSelect,
    onUpload,
    onDelete,
    uploadStatus,
    existingUpload,
  }) => {
    const [localFile, setLocalFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setLocalFile(file);
        onFileSelect(student._id, file);
      }
    };

    const handleUploadClick = () => {
      if (localFile) {
        onUpload(student._id, localFile);
      }
    };

    const handleDeleteClick = () => {
      if (existingUpload && existingUpload._id) {
        onDelete(student._id, existingUpload._id);
      }
    };

    const isAlreadyUploaded = existingUpload && existingUpload.fileUrl;
    const isUploaded = uploadStatus[student._id] === "success";
    const isError = uploadStatus[student._id] === "error";
    const isLoading = uploadLoading[student._id];
    const isDeleting = deleteLoading[student._id];

    const getFileIcon = (fileType) => {
      if (fileType === 'application/pdf') return <FaFilePdf />;
      if (fileType?.startsWith('image/')) return <FaFileImage />;
      return <FaFileImage />;
    };

    const handleViewFile = () => {
      if (existingUpload && existingUpload.fileUrl) {
        window.open(existingUpload.fileUrl, '_blank');
      }
    };

    return (
      <tr>
        <td className="text-center small-cell">
          {index + 1}
        </td>
        <td className="small-cell">
          {student.studentSrn || "N/A"}
        </td>
        <td className="name-cell">
          <strong>{student.firstName || "N/A"}</strong>
          {student.lastName ? ` ${student.lastName}` : ""}
        </td>
        <td className="name-cell">
          {student.fatherName || "N/A"}
        </td>
        <td className="upload-cell">
          <div className="upload-container">
            <Form.Control
              type="file"
              size="sm"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isLoading || isDeleting || isAlreadyUploaded}
              className="file-input"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleUploadClick}
              disabled={!localFile || isLoading || isAlreadyUploaded || isDeleting}
              className="upload-btn"
            >
              {isLoading ? (
                <FaSpinner className="spin" />
              ) : (
                <FaUpload />
              )}
            </Button>
            {isAlreadyUploaded && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="delete-btn"
                title="Delete old file to upload new one"
              >
                {isDeleting ? <FaSpinner className="spin" /> : <FaTrash />}
              </Button>
            )}
          </div>
          {(isAlreadyUploaded || isUploaded) && (
            <Badge bg="success" className="mt-1">
              <FaCheckCircle /> Uploaded
            </Badge>
          )}
          {isError && (
            <Badge bg="danger" className="mt-1">
              <FaTimesCircle /> Failed
            </Badge>
          )}
        </td>
        <td className="view-cell text-center">
          {existingUpload && existingUpload.fileUrl ? (
            <Button
              variant="info"
              size="sm"
              onClick={handleViewFile}
              className="view-btn"
              title="View File"
            >
              <FaEye className="me-1" />
              View
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="view-btn-disabled"
              title="No file uploaded"
            >
              <FaEye className="me-1" />
              No File
            </Button>
          )}
          {existingUpload && existingUpload.fileUrl && (
            <div className="file-info mt-1">
              <small className="text-muted">
                {getFileIcon(existingUpload.fileType)}
                {' '}
                {existingUpload.fileName?.split('-').slice(1).join('-')?.substring(0, 20) || 'File'}
                {existingUpload.fileName?.length > 20 ? '...' : ''}
              </small>
            </div>
          )}
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectedFile === nextProps.selectedFile &&
      prevProps.uploadLoading === nextProps.uploadLoading &&
      prevProps.deleteLoading === nextProps.deleteLoading &&
      prevProps.uploadStatus === nextProps.uploadStatus &&
      prevProps.existingUpload === nextProps.existingUpload
    );
  }
);

export const StudentsUpload = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Objectives state
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [loadingObjectives, setLoadingObjectives] = useState(false);
  
  // File upload states
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadLoading, setUploadLoading] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});

  const tableWrapperRef = useRef(null);

  const sortStudentsAlphabetically = useCallback((studentsArray) => {
    if (!studentsArray || !Array.isArray(studentsArray)) return [];
    return [...studentsArray].sort((a, b) => {
      const nameA = (a.firstName || "").toLowerCase();
      const nameB = (b.firstName || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, []);

  // Compress image file if needed
  const compressFile = async (file) => {
    const maxSizeMB = 25;
    
    if (file.size <= maxSizeMB * 1024 * 1024) {
      return file;
    }

    if (file.type.startsWith('image/')) {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };
      
      try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
      } catch (error) {
        console.error("Error compressing image:", error);
        throw new Error("Failed to compress image");
      }
    } else if (file.type === 'application/pdf') {
      throw new Error("PDF files exceed 10MB. Please upload a smaller file.");
    } else {
      throw new Error("File size exceeds 10MB. Please upload a smaller file.");
    }
  };

  const fetchUploadsObjectives = async () => {
  setLoadingObjectives(true);
  try {
    const response = await getStudentUploadsObjectives();
    console.log(response.data);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      // Sort objectives by dateOfObjective (oldest first - ascending order)
      const sortedObjectives = [...response.data.data].sort((a, b) => {
        // First sort by dateOfObjective (oldest first)
        const dateA = new Date(a.dateOfObjective || a.submissionDate || 0);
        const dateB = new Date(b.dateOfObjective || b.submissionDate || 0);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime(); // Changed: dateA - dateB for ascending (oldest first)
        }
        // If dates are equal, sort by batch
        const batchA = a.batch || "";
        const batchB = b.batch || "";
        return batchA.localeCompare(batchB);
      });
      
      const objectiveOptions = sortedObjectives.map(obj => ({
        value: obj._id,
        label: `${obj.objective} - ${obj.subject} (Batch: ${obj.batch || 'N/A'}) (Due: ${new Date(obj.submissionDate).toLocaleDateString()})`,
        objectiveData: obj
      }));
      setObjectives(objectiveOptions);
      
      setSelectedObjective(null);
      setStudents([]);
    } else {
      setObjectives([]);
      setError("No objectives found.");
    }
  } catch (error) {
    console.error("Error fetching objectives:", error);
    setError("Failed to fetch objectives.");
  } finally {
    setLoadingObjectives(false);
  }
};

  // Check if all required fields are selected
  const areRequiredFieldsSelected = useCallback(() => {
    return selectedObjective && schoolContext?.schoolId && batchContext?.batch;
  }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch]);

  const fetchStudents = useCallback(async () => {
    if (!areRequiredFieldsSelected()) {
      if (selectedObjective && (!schoolContext?.schoolId || !batchContext?.batch)) {
        setError("Please select both School and Batch before fetching students.");
      }
      setStudents([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedFiles({});
    setUploadStatus({});

    const reqBody = {
      idofstudentuploadobjectives: selectedObjective.value,
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      startDate: startDate,
    };

    try {
      const response = await GetStudentsForUploads(reqBody);
      console.log("Students response:", response.data);
      
      const studentsData = response.data?.data || [];
      
      // Process students to include upload info from response
      const processedStudents = studentsData.map(student => ({
        ...student,
        existingUpload: student.uploadRecord || null,
        isUploaded: student.isUploaded || false,
        uploadStatus: student.uploadStatus || null
      }));
      
      const sortedStudents = sortStudentsAlphabetically(processedStudents);
      setStudents(sortedStudents);
      
      // Initialize upload status for already uploaded files
      const initialUploadStatus = {};
      sortedStudents.forEach(student => {
        if (student.existingUpload && student.existingUpload.fileUrl) {
          initialUploadStatus[student._id] = "success";
        }
      });
      setUploadStatus(initialUploadStatus);
      
      if (sortedStudents.length === 0) {
        setError("No students found for the selected criteria.");
      }
    } catch (error) {
      setError("Failed to fetch students.");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch, startDate, sortStudentsAlphabetically, areRequiredFieldsSelected]);

  const handleObjectiveChange = (selectedOption) => {
    setSelectedObjective(selectedOption);
    setStudents([]);
    setSelectedFiles({});
    setUploadStatus({});
    setError(null);
  };

  const handleFileSelect = (studentId, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [studentId]: file
    }));
    setUploadStatus(prev => ({
      ...prev,
      [studentId]: null
    }));
  };

  const handleDeleteFile = async (studentId, uploadRecordId) => {
    if (!uploadRecordId) {
      setError("Invalid upload record ID");
      return;
    }

    // Confirm before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this file? This action cannot be undone.");
    if (!confirmDelete) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [studentId]: true }));
    
    try {
      // Call the delete API
      const response = await DeletUploads({ _id: uploadRecordId });
      
      if (response && response.status === 200) {
        // Update student to remove existingUpload
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student._id === studentId 
              ? {
                  ...student,
                  existingUpload: null,
                  isUploaded: false,
                  uploadStatus: null
                }
              : student
          )
        );
        
        // Clear upload status for this student
        setUploadStatus(prev => ({
          ...prev,
          [studentId]: null
        }));
        
        // Clear selected file if any
        setSelectedFiles(prev => {
          const newState = { ...prev };
          delete newState[studentId];
          return newState;
        });
        
        setSuccessMessage(`File deleted successfully. You can now upload a new file.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Delete request failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || error.message || "Failed to delete file. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleFileUpload = async (studentId, file) => {
    if (!selectedObjective) {
      setError("No objective selected. Please select an objective first.");
      return;
    }

    if (!schoolContext?.schoolId || !batchContext?.batch) {
      setError("School and Batch must be selected before uploading.");
      return;
    }

    setUploadLoading(prev => ({ ...prev, [studentId]: true }));
    setUploadStatus(prev => ({ ...prev, [studentId]: "uploading" }));

    try {
      const compressedFile = await compressFile(file);
      
      const formData = new FormData();
      formData.append("unqStudentObjectId", studentId);
      formData.append("batch", batchContext?.batch || "");
      formData.append("uploadType", "Assignment");
      formData.append("subject", selectedObjective.objectiveData.subject);
      formData.append("dateOfSubmission", startDate || new Date().toISOString().split('T')[0]);
      formData.append("topic", selectedObjective.objectiveData.objective);
      formData.append("unqObjectIdOfStudentUploads", selectedObjective.objectiveData._id);
      formData.append("file", compressedFile);

      const response = await UplaoadStudentFiles(formData);
      
      if (response && response.status === 201) {
        setUploadStatus(prev => ({ ...prev, [studentId]: "success" }));
        setSuccessMessage(`File uploaded successfully for ${file.name}`);
        
        // Update the student's existing upload info
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student._id === studentId 
              ? {
                  ...student,
                  existingUpload: response.data.data,
                  isUploaded: true,
                  uploadStatus: "Uploaded"
                }
              : student
          )
        );
        
        setTimeout(() => setSuccessMessage(null), 3000);
        
        setSelectedFiles(prev => {
          const newState = { ...prev };
          delete newState[studentId];
          return newState;
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(prev => ({ ...prev, [studentId]: "error" }));
      setError(error.message || "Failed to upload file. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploadLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  useEffect(() => {
    fetchUploadsObjectives();
  }, []);

  useEffect(() => {
    if (areRequiredFieldsSelected()) {
      fetchStudents();
    } else {
      setStudents([]);
      if (selectedObjective && (!schoolContext?.schoolId || !batchContext?.batch)) {
        setError(null);
      }
    }
  }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch, startDate, fetchStudents, areRequiredFieldsSelected]);

  const TableView = useMemo(() => {
    if (students.length === 0) {
      return (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">
            No students found. Please ensure Objective, School, and Batch are all selected.
          </p>
        </div>
      );
    }

    return (
      <div ref={tableWrapperRef} className="upload-table-wrapper">
        <Table striped bordered hover className="upload-table">
          <thead>
            <tr>
              <th className="small-heading">S.No.</th>
              <th className="small-heading">SRN</th>
              <th className="name-heading">Student Name</th>
              <th className="name-heading">Father's Name</th>
              <th className="upload-heading">Upload File</th>
              <th className="view-heading">View File</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <StudentRow
                key={student._id}
                student={student}
                index={index}
                selectedFile={selectedFiles[student._id]}
                uploadLoading={uploadLoading}
                deleteLoading={deleteLoading}
                onFileSelect={handleFileSelect}
                onUpload={handleFileUpload}
                onDelete={handleDeleteFile}
                uploadStatus={uploadStatus}
                existingUpload={student.existingUpload}
              />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }, [students, selectedFiles, uploadLoading, deleteLoading, uploadStatus]);

  const CardView = () => (
    <Row className="g-2 mt-2">
      {students.map((student) => {
        const selectedFile = selectedFiles[student._id];
        const isLoading = uploadLoading[student._id];
        const isDeleting = deleteLoading[student._id];
        const status = uploadStatus[student._id];
        const isUploaded = status === "success" || student.existingUpload;
        const isError = status === "error";
        const existingUpload = student.existingUpload;
        
        const getFileIcon = (fileType) => {
          if (fileType === 'application/pdf') return <FaFilePdf />;
          if (fileType?.startsWith('image/')) return <FaFileImage />;
          return <FaFileImage />;
        };

        const handleViewFile = () => {
          if (existingUpload && existingUpload.fileUrl) {
            window.open(existingUpload.fileUrl, '_blank');
          }
        };

        const handleDeleteClick = () => {
          if (existingUpload && existingUpload._id) {
            handleDeleteFile(student._id, existingUpload._id);
          }
        };
        
        return (
          <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex justify-content-between">
                  <strong>{student.firstName} {student.lastName || ""}</strong>
                  <Badge bg="light" text="dark">
                    {student.rollNumber}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <p><strong>SRN:</strong> {student.studentSrn}</p>
                <p><strong>Father:</strong> {student.fatherName}</p>
                
                {!existingUpload && (
                  <>
                    <Form.Group>
                      <Form.Control
                        type="file"
                        size="sm"
                        onChange={(e) => handleFileSelect(student._id, e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={isLoading || isDeleting}
                      />
                    </Form.Group>
                    {selectedFile && (
                      <div className="mt-2">
                        <small className="text-muted">
                          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </small>
                      </div>
                    )}
                  </>
                )}
                
                {existingUpload && (
                  <div className="uploaded-file-info mt-2 p-2 bg-light rounded">
                    <small>
                      {getFileIcon(existingUpload.fileType)}
                      {' '}
                      <strong>Uploaded:</strong> {new Date(existingUpload.createdAt).toLocaleDateString()}
                    </small>
                    <br />
                    <small className="text-muted">
                      {existingUpload.fileName?.split('-').slice(1).join('-')?.substring(0, 30)}
                      {existingUpload.fileName?.length > 30 ? '...' : ''}
                    </small>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-white">
                {!existingUpload ? (
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleFileUpload(student._id, selectedFile)}
                    disabled={!selectedFile || isLoading || isDeleting}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="spin me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Upload File
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button
                      variant="info"
                      className="flex-grow-1"
                      onClick={handleViewFile}
                      disabled={isDeleting}
                    >
                      <FaEye className="me-2" />
                      View
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-grow-1"
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <FaSpinner className="spin" />
                      ) : (
                        <FaTrash className="me-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                )}
                {isUploaded && !existingUpload && (
                  <div className="text-center mt-2">
                    <Badge bg="success">
                      <FaCheckCircle /> Uploaded Successfully
                    </Badge>
                  </div>
                )}
                {isError && (
                  <div className="text-center mt-2">
                    <Badge bg="danger">
                      <FaTimesCircle /> Upload Failed
                    </Badge>
                  </div>
                )}
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '38px',
      fontSize: '14px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '13px',
      padding: '8px 12px',
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
      color: state.isSelected ? 'white' : '#212529',
    }),
  };

  const isMissingFilters = () => {
    const missing = [];
    if (!selectedObjective) missing.push("Objective");
    if (!schoolContext?.schoolId) missing.push("School");
    if (!batchContext?.batch) missing.push("Batch");
    return missing;
  };

  const missingFilters = isMissingFilters();

  return (
    <Container fluid className="mt-3 mb-3">
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="mb-2">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white py-2">
              Student File Upload
            </Card.Header>
            <Card.Body className="py-2">
              <Row className="g-2">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Select Objective <span className="text-danger">*</span></Form.Label>
                    <Select
                      options={objectives}
                      value={selectedObjective}
                      onChange={handleObjectiveChange}
                      isLoading={loadingObjectives}
                      isClearable
                      placeholder="Choose an objective..."
                      styles={customSelectStyles}
                      noOptionsMessage={() => "No objectives found"}
                    />
                    {selectedObjective && (
                      <Form.Text className="text-muted">
                        <strong>Subject:</strong> {selectedObjective.objectiveData.subject} | 
                        <strong> Due Date:</strong> {new Date(selectedObjective.objectiveData.submissionDate).toLocaleDateString()} |
                        <strong> Batch:</strong> {selectedObjective.objectiveData.batch}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-2">
                {/* <Col md={6}>
                  <SingleDatePicker />
                </Col> */}
                <Col md={3}>
                  <Form.Label>School <span className="text-danger">*</span></Form.Label>
                  <School_drop_down />
                </Col>
                <Col md={3}>
                  <Form.Label>Batch <span className="text-danger">*</span></Form.Label>
                  <Batch_drop_down />
                </Col>
              </Row>
              {missingFilters.length > 0 && missingFilters.length < 3 && (
                <div className="mt-2">
                  <Alert variant="warning" className="py-1 mb-0">
                    <small>⚠️ Please select: {missingFilters.join(", ")} to view students</small>
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedObjective && schoolContext?.schoolId && batchContext?.batch && (
        <Row className="mb-2">
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h6 className="mb-0">
                  Students batch - {selectedObjective.objectiveData.batch}
                </h6>
                <small className="text-muted">
                  Total: {students.length} students | 
                  Objective: {selectedObjective.objectiveData.objective}
                </small>
              </div>
              <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={(val) => val && setViewMode(val)} size="sm">
                <ToggleButton id="table-view" value="table" variant="outline-primary">
                  <FaTable className="me-1" />
                  Table
                </ToggleButton>
                <ToggleButton id="card-view" value="card" variant="outline-primary">
                  <FaThLarge className="me-1" />
                  Card
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </Col>
        </Row>
      )}

      {!selectedObjective && !loadingObjectives && (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">
            Please select an objective from the dropdown above to begin.
          </p>
        </div>
      )}

      {selectedObjective && (!schoolContext?.schoolId || !batchContext?.batch) && (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">
            ⚠️ Please select both School and Batch to view students for this objective.
          </p>
        </div>
      )}

      {(loading || loadingObjectives) && (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading...</p>
        </div>
      )}

      {selectedObjective && schoolContext?.schoolId && batchContext?.batch && !loading && !loadingObjectives && (
        viewMode === "table" ? TableView : <CardView />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .upload-table-wrapper {
          width: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          max-height: 75vh;
          position: relative;
        }

        .upload-table {
          min-width: 820px;
          margin-bottom: 0;
          background: white;
          font-size: 12px;
        }

        .upload-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: #f8f9fa;
          font-size: 11px;
          padding: 6px;
        }

        .upload-table td {
          padding: 5px 6px;
          font-size: 11px;
          vertical-align: middle;
        }

        .small-heading {
          width: 55px;
        }

        .name-heading {
          min-width: 140px;
        }

        .upload-heading {
          min-width: 250px;
        }

        .view-heading {
          min-width: 120px;
        }

        .small-cell {
          width: 55px;
        }

        .name-cell {
          min-width: 140px;
        }

        .upload-cell {
          min-width: 250px;
        }

        .view-cell {
          min-width: 120px;
        }

        .upload-container {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .file-input {
          flex: 1;
          font-size: 11px;
          padding: 4px;
        }

        .upload-btn {
          width: 32px;
          height: 31px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn {
          width: 32px;
          height: 31px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn {
          width: 70px;
          font-size: 11px;
          padding: 4px;
        }

        .view-btn-disabled {
          width: 70px;
          font-size: 11px;
          padding: 4px;
        }

        .file-info {
          font-size: 10px;
        }

        .uploaded-file-info {
          font-size: 11px;
        }

        .upload-table th,
        .upload-table td {
          vertical-align: middle;
        }

        .upload-table-wrapper::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .upload-table-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        button {
          transition: none !important;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 8px;
            padding-right: 8px;
          }

          .upload-table {
            min-width: 750px;
            font-size: 10px;
          }

          .upload-table thead th {
            font-size: 10px;
            padding: 5px;
          }

          .upload-table td {
            font-size: 10px;
            padding: 4px 5px;
          }

          .name-heading,
          .name-cell {
            min-width: 115px;
          }

          .upload-heading,
          .upload-cell {
            min-width: 220px;
          }

          .view-heading,
          .view-cell {
            min-width: 100px;
          }

          .file-input {
            font-size: 9px;
          }

          .upload-btn {
            width: 28px;
            height: 28px;
          }

          .delete-btn {
            width: 28px;
            height: 28px;
          }

          .view-btn {
            width: 60px;
            font-size: 9px;
          }
        }
      `}</style>
    </Container>
  );
};