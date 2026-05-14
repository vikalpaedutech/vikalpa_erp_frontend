// import React,{useState, useEffect, useContext} from "react";
// import { getAttendancePdf } from "../../service/AttendancePdf.services";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// export const AttendancePdfv2 = ()=>{

//   const { userData } = useContext(UserContext);
// const { startDate, setStartDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
// console.log(userData)



//     return(
//         <>
//         <SingleDatePicker/>
//         <Batch_drop_down/>
//         hello
//         </>
//     )
// }



// import React, { useState, useEffect, useContext } from "react";
// import { getAttendancePdf, uploadAttendancePdf } from "../../service/AttendancePdf.services";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, Modal } from 'react-bootstrap';

// export const AttendancePdfv2 = () => {
//   const { userData } = useContext(UserContext);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   // State variables
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  
//   // Upload states
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [uploadFile, setUploadFile] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [uploadSuccess, setUploadSuccess] = useState(null);
  
//   // Extract all school IDs from user's accessible regions
//   useEffect(() => {
//     if (userData?.userAccess?.region) {
//       const schoolIds = [];
//       userData.userAccess.region.forEach(district => {
//         district.blockIds.forEach(block => {
//           block.schoolIds.forEach(school => {
//             schoolIds.push(school.schoolId);
//           });
//         });
//       });
//       setSelectedSchoolIds(schoolIds);
//       console.log("Extracted School IDs:", schoolIds);
//     }
//   }, [userData]);

//   // Function to format date for API
//   const formatDateForAPI = (date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
//   };

//   // Handle fetch attendance data
//   const handleFetchAttendance = async () => {
//     // Validation
//     if (!batchContext.batch) {
//       setError("Please select a batch");
//       return;
//     }
    
//     if (!startDate) {
//       setError("Please select a date");
//       return;
//     }

//     if (selectedSchoolIds.length === 0) {
//       setError("No schools found for this user");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const formattedDate = formatDateForAPI(startDate);
//       const requestBody = {
//         schoolId: selectedSchoolIds,
//         batch: batchContext.batch,
//         dateOfUpload: formattedDate
//       };
      
//       console.log("Request Body:", requestBody);
      
//       const response = await getAttendancePdf(requestBody);
      
//       if (response.status === 'Ok') {
//         setAttendanceData(response.data);
//         console.log("Attendance Data:", response.data);
//       } else {
//         setError("Failed to fetch attendance data");
//       }
//     } catch (err) {
//       setError("Error fetching attendance: " + err.message);
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle reset filters
//   const handleReset = () => {
//     setSelectedBatch("");
//     setStartDate(null);
//     setAttendanceData([]);
//     setError(null);
//   };

//   // Handle upload button click
//   const handleUploadClick = (school) => {
//     setSelectedSchool(school);
//     setShowUploadModal(true);
//     setUploadFile(null);
//     setUploadError(null);
//     setUploadSuccess(null);
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       setUploadFile(file);
//       setUploadError(null);
//     } else {
//       setUploadError("Please select a valid PDF file");
//       setUploadFile(null);
//     }
//   };

//   // Handle file upload submission
//   const handleUploadSubmit = async () => {
//     if (!uploadFile) {
//       setUploadError("Please select a PDF file to upload");
//       return;
//     }

//     if (!selectedSchool) {
//       setUploadError("No school selected");
//       return;
//     }

//     setUploadLoading(true);
//     setUploadError(null);
//     setUploadSuccess(null);

//     try {
//       const formData = new FormData();
      
//       alert(selectedSchool._id)
//       // Append the file
//       formData.append('file', uploadFile);
      
//       // Append other required fields
//       formData.append('unqUserObjectId', userData?._id || '');
//       formData.append('district_block_schoolsObjectId', selectedSchool._id);
//       formData.append('batch', batchContext.batch || selectedBatch);
//       formData.append('dateOfUpload', formatDateForAPI(startDate));
//       formData.append('isPdfUploaded', true);
      
//       console.log("Uploading PDF for school:", selectedSchool.schoolName);
//       console.log("FormData contents:");
//       for (let pair of formData.entries()) {
//         console.log(pair[0] + ': ' + pair[1]);
//       }
      
//       const response = await uploadAttendancePdf(formData);
      
//       if (response.status === 'Success') {
//         setUploadSuccess(response.message);
        
//         // Refresh attendance data to show updated upload
//         setTimeout(() => {
//           handleFetchAttendance();
//         }, 2000);
        
//         // Close modal after 2 seconds
//         setTimeout(() => {
//           setShowUploadModal(false);
//           setUploadFile(null);
//           setSelectedSchool(null);
//         }, 2000);
//       } else {
//         setUploadError(response.message || "Failed to upload PDF");
//       }
//     } catch (err) {
//       setUploadError("Error uploading PDF: " + err.message);
//       console.error("Upload error:", err);
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   // Get status badge variant for PDF upload
//   const getStatusBadge = (isUploaded) => {
//     return isUploaded ? 
//       <Badge bg="success">Uploaded</Badge> : 
//       <Badge bg="danger">Not Uploaded</Badge>;
//   };

//   // Format date for display
//   const formatDisplayDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   return (
//     <Container fluid className="py-4">
//       <h2 className="mb-4 pb-2 border-bottom border-success">Attendance PDF Management</h2>
      
//       {/* User Info Card */}
//       {userData && (
//         <Card className="mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//           <Card.Body>
//             <Card.Title as="h4">User Information</Card.Title>
//             <Row>
//               <Col md={3}>
//                 <p className="mb-1"><strong>Name:</strong> {userData.name}</p>
//               </Col>
//               <Col md={3}>
//                 <p className="mb-1"><strong>Role:</strong> {userData.role}</p>
//               </Col>
//               <Col md={3}>
//                 <p className="mb-1"><strong>Department:</strong> {userData.department}</p>
//               </Col>
//               <Col md={3}>
//                 <p className="mb-1"><strong>Total Schools Access:</strong> <Badge bg="light" text="dark">{selectedSchoolIds.length}</Badge></p>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Filters Section */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title as="h4">Filter Attendance Records</Card.Title>
//           <Row className="align-items-end">
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Select Date:</Form.Label>
//                 <SingleDatePicker />
//               </Form.Group>
//             </Col>
            
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Select Batch:</Form.Label>
//                 <Batch_drop_down 
//                   batchContext={batchContext}
//                   selectedBatch={selectedBatch}
//                   setSelectedBatch={setSelectedBatch}
//                 />
//               </Form.Group>
//             </Col>
            
//             <Col md={6}>
//               <div className="d-flex gap-2">
//                 <Button 
//                   variant="success" 
//                   onClick={handleFetchAttendance} 
//                   disabled={loading}
//                 >
//                   {loading ? "Loading..." : "Fetch Attendance"}
//                 </Button>
//                 <Button 
//                   variant="danger" 
//                   onClick={handleReset}
//                 >
//                   Reset
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" className="mb-4">
//           <Alert.Heading>Error</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Loading Indicator */}
//       {loading && (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3">Fetching attendance records...</p>
//         </div>
//       )}

//       {/* Results Section */}
//       {!loading && attendanceData.length > 0 && (
//         <div className="mt-4">
//           <div className="mb-3">
//             <h3>Attendance Records</h3>
//             <p className="text-muted">
//               Showing {attendanceData.length} school(s) with attendance records
//             </p>
//           </div>
          
//           <Row xs={1} md={2} lg={3} className="g-4">
//             {attendanceData.map((school) => (
//               <Col key={school._id}>
//                 <Card className="h-100 shadow-sm">
//                   <Card.Header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//                     <Card.Title as="h5" className="mb-0">{school.schoolName}</Card.Title>
//                     <small className="text-white-50">ID: {school.schoolId}</small>
//                   </Card.Header>
                  
//                   <Card.Body>
//                     <div className="mb-3 pb-2 border-bottom">
//                       <p className="mb-1"><strong>District:</strong> {school.districtName}</p>
//                       <p className="mb-1"><strong>Block:</strong> {school.blockName}</p>
//                       <p className="mb-0">
//                         <strong>Status:</strong> {' '}
//                         <Badge bg={school.isCenterClosed ? "danger" : "success"}>
//                           {school.isCenterClosed ? "Closed" : "Active"}
//                         </Badge>
//                       </p>
//                     </div>
                    
//                     {/* Attendance PDF Details */}
//                     {school.uploadpdfdetails && school.uploadpdfdetails.length > 0 ? (
//                       <div>
//                         <h6 className="mb-2">PDF Details</h6>
//                         {school.uploadpdfdetails.map((pdf) => (
//                           <Card key={pdf._id} className="mb-2 bg-light">
//                             <Card.Body className="p-3">
//                               <p className="mb-1"><strong>Batch:</strong> {pdf.batch}</p>
//                               <p className="mb-1">
//                                 <strong>Upload Status:</strong> {' '}
//                                 {getStatusBadge(pdf.isPdfUploaded)}
//                               </p>
//                               <p className="mb-1"><strong>Upload Date:</strong> {formatDisplayDate(pdf.dateOfUpload)}</p>
//                               <p className="mb-1"><strong>File Name:</strong> {pdf.fileName || "N/A"}</p>
                              
//                               {pdf.fileUrl && pdf.isPdfUploaded && (
//                                 <Button 
//                                   variant="info" 
//                                   size="sm" 
//                                   href={pdf.fileUrl} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="mt-2"
//                                 >
//                                   📄 View PDF
//                                 </Button>
//                               )}
//                             </Card.Body>
//                           </Card>
//                         ))}
//                       </div>
//                     ) : (
//                       <Alert variant="warning" className="mb-0">
//                         ⚠️ No attendance PDF uploaded for this date and batch
//                       </Alert>
//                     )}
                    
//                     {/* Upload Button */}
//                     <Button 
//                       variant="primary" 
//                       size="sm" 
//                       className="mt-3 w-100"
//                       onClick={() => handleUploadClick(school)}
//                     >
//                       📤 Upload Attendance PDF
//                     </Button>
//                   </Card.Body>
                  
//                   <Card.Footer className="text-muted">
//                     <small>Last Updated: {formatDisplayDate(school.updatedAt)}</small>
//                   </Card.Footer>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       )}

//       {/* No Data Message */}
//       {!loading && !error && attendanceData.length === 0 && (
//         <Card className="text-center py-5">
//           <Card.Body>
//             <Card.Title>No Attendance Records Found</Card.Title>
//             <Card.Text>
//               Please select a date and batch, then click "Fetch Attendance"
//             </Card.Text>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Upload Modal */}
//       <Modal show={showUploadModal} onHide={() => !uploadLoading && setShowUploadModal(false)}>
//         <Modal.Header closeButton={!uploadLoading}>
//           <Modal.Title>Upload Attendance PDF</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedSchool && (
//             <>
//               <p><strong>School:</strong> {selectedSchool.schoolName}</p>
//               <p><strong>School ID:</strong> {selectedSchool.schoolId}</p>
//               <p><strong>District:</strong> {selectedSchool.districtName}</p>
//               <p><strong>Block:</strong> {selectedSchool.blockName}</p>
//               <p><strong>Batch:</strong> {batchContext.batch || selectedBatch}</p>
//               <p><strong>Date:</strong> {formatDisplayDate(startDate)}</p>
              
//               <hr />
              
//               {uploadSuccess && (
//                 <Alert variant="success" className="mt-3">
//                   {uploadSuccess}
//                 </Alert>
//               )}
              
//               {uploadError && (
//                 <Alert variant="danger" className="mt-3">
//                   {uploadError}
//                 </Alert>
//               )}
              
//               <Form.Group className="mt-3">
//                 <Form.Label>Select PDF File</Form.Label>
//                 <Form.Control
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileChange}
//                   disabled={uploadLoading}
//                 />
//                 <Form.Text className="text-muted">
//                   Please upload a PDF file (max size: 5MB)
//                 </Form.Text>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button 
//             variant="secondary" 
//             onClick={() => setShowUploadModal(false)}
//             disabled={uploadLoading}
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleUploadSubmit}
//             disabled={uploadLoading || !uploadFile}
//           >
//             {uploadLoading ? <Spinner animation="border" size="sm" /> : "Upload PDF"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };








import React, { useState, useEffect, useContext } from "react";
import { getAttendancePdf, uploadAttendancePdf } from "../../service/AttendancePdf.services";
import { UserContext } from "../contextAPIs/User.context";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';
import { AttendanceSheetFormat } from "../Utils/AttendanceSheetFormat";

export const AttendancePdfv2 = () => {
  const { userData } = useContext(UserContext);
  const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  // State variables
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  
  // Upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  
  // Image capture states
  const [capturedImages, setCapturedImages] = useState([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  
  // Extract all school IDs from user's accessible regions
  useEffect(() => {
    if (userData?.userAccess?.region) {
      const schoolIds = [];
      userData.userAccess.region.forEach(district => {
        district.blockIds.forEach(block => {
          block.schoolIds.forEach(school => {
            schoolIds.push(school.schoolId);
          });
        });
      });
      setSelectedSchoolIds(schoolIds);
      console.log("Extracted School IDs:", schoolIds);
    }
  }, [userData]);

  // Function to format date for API
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Handle fetch attendance data
  const handleFetchAttendance = async () => {
    if (!batchContext.batch) {
      setError("Please select a batch");
      return;
    }
    
    if (!startDate) {
      setError("Please select a date");
      return;
    }

    if (selectedSchoolIds.length === 0) {
      setError("No schools found for this user");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = formatDateForAPI(startDate);
      const requestBody = {
        schoolId: selectedSchoolIds,
        batch: batchContext.batch,
        dateOfUpload: formattedDate
      };
      
      const response = await getAttendancePdf(requestBody);
      
      if (response.status === 'Ok') {
        setAttendanceData(response.data);
      } else {
        setError("Failed to fetch attendance data");
      }
    } catch (err) {
      setError("Error fetching attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset filters
  const handleReset = () => {
    setSelectedBatch("");
    setStartDate(null);
    setAttendanceData([]);
    setError(null);
  };

  // Compress image function
  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return imageFile;
    }
  };

  // Handle image selection from gallery/camera
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    setImageUploadLoading(true);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const compressedImage = await compressImage(file);
        const imageUrl = URL.createObjectURL(compressedImage);
        setCapturedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: imageUrl,
          file: compressedImage,
          name: file.name
        }]);
      }
    }
    setImageUploadLoading(false);
    e.target.value = ''; // Reset input
  };

  // Remove image from list
  const removeImage = (id) => {
    setCapturedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  // Convert images to PDF
  const convertImagesToPDF = async () => {
    if (capturedImages.length === 0) return null;
    
    try {
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      for (let i = 0; i < capturedImages.length; i++) {
        const imgFile = capturedImages[i].file;
        const imgUrl = URL.createObjectURL(imgFile);
        
        // Load image to get dimensions
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to load image'));
          image.src = imgUrl;
        });
        
        // Calculate dimensions to fit A4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = imgWidth / imgHeight;
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / ratio;
        
        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * ratio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        if (i !== 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgUrl, 'JPEG', x, y, finalWidth, finalHeight);
        URL.revokeObjectURL(imgUrl);
      }
      
      return pdf.output('blob');
    } catch (error) {
      console.error("Error creating PDF:", error);
      throw error;
    }
  };

  // Handle file upload submission (PDF)
  const handlePdfUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a PDF file");
      return;
    }

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('unqUserObjectId', userData?._id || '');
      formData.append('district_block_schoolsObjectId', selectedSchool._id);
      formData.append('batch', batchContext.batch || selectedBatch);
      formData.append('dateOfUpload', formatDateForAPI(startDate));
      formData.append('isPdfUploaded', true);
      
      const response = await uploadAttendancePdf(formData);
      
      if (response.status === 'Success') {
        setUploadSuccess(response.message);
        setTimeout(() => {
          handleFetchAttendance();
          setShowUploadModal(false);
          setUploadFile(null);
          setSelectedSchool(null);
        }, 2000);
      } else {
        setUploadError(response.message || "Failed to upload PDF");
      }
    } catch (err) {
      setUploadError("Error uploading PDF: " + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle images to PDF upload
  const handleImagesToPdfUpload = async () => {
    if (capturedImages.length === 0) {
      setUploadError("Please select at least one image");
      return;
    }

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Convert images to PDF
      const pdfBlob = await convertImagesToPDF();
      
      if (!pdfBlob) {
        throw new Error("Failed to create PDF from images");
      }
      
      const pdfFile = new File(
        [pdfBlob], 
        `attendance_${selectedSchool.schoolId}_${formatDateForAPI(startDate)}.pdf`, 
        { type: 'application/pdf' }
      );
      
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('unqUserObjectId', userData?._id || '');
      formData.append('district_block_schoolsObjectId', selectedSchool._id);
      formData.append('batch', batchContext.batch || selectedBatch);
      formData.append('dateOfUpload', formatDateForAPI(startDate));
      formData.append('isPdfUploaded', true);
      
      const response = await uploadAttendancePdf(formData);
      
      if (response.status === 'Success') {
        setUploadSuccess(response.message);
        
        // Clear images
        capturedImages.forEach(img => URL.revokeObjectURL(img.url));
        setCapturedImages([]);
        
        setTimeout(() => {
          handleFetchAttendance();
          setShowUploadModal(false);
          setSelectedSchool(null);
        }, 2000);
      } else {
        setUploadError(response.message || "Failed to upload PDF");
      }
    } catch (err) {
      setUploadError("Error creating/uploading PDF: " + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle upload button click
  const handleUploadClick = (school) => {
    setSelectedSchool(school);
    setShowUploadModal(true);
    setUploadFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    setCapturedImages([]);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
      setUploadError(null);
    } else {
      setUploadError("Please select a valid PDF file");
      setUploadFile(null);
    }
  };

  // Get status badge variant for PDF upload
  const getStatusBadge = (isUploaded) => {
    return isUploaded ? 
      <Badge bg="success">Uploaded</Badge> : 
      <Badge bg="danger">Not Uploaded</Badge>;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 pb-2 border-bottom border-success">Attendance PDF Management</h2>
      
      {/* User Info Card */}
      {userData && (
        <Card className="mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Card.Body>
            <Card.Title as="h4">User Information</Card.Title>
            <Row>
              <Col md={3}>
                <p className="mb-1"><strong>Name:</strong> {userData.name}</p>
              </Col>
              <Col md={3}>
                <p className="mb-1"><strong>Role:</strong> {userData.role}</p>
              </Col>
              <Col md={3}>
                <p className="mb-1"><strong>Department:</strong> {userData.department}</p>
              </Col>
              <Col md={3}>
                <p className="mb-1"><strong>Total Schools Access:</strong> <Badge bg="light" text="dark">{selectedSchoolIds.length}</Badge></p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

<Row>
<Col md={3} className="d-flex">
      <div className="w-100">
        <AttendanceSheetFormat />
      </div>
    </Col>
</Row>

    <br></br>
      {/* Filters Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
  <Card.Title as="h4" className="mb-4">
    Filter Attendance Records
  </Card.Title>

  <Row className="g-3 align-items-end">
    {/* PDF BUTTON */}
    
    
    {/* DATE */}
    <Col md={3}>
      <Form.Group className="w-100">
        <SingleDatePicker />
      </Form.Group>
    </Col>

    {/* BATCH */}
    <Col md={3}>
      <Form.Group className="w-100">
        <Batch_drop_down
          batchContext={batchContext}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
        />
      </Form.Group>
    </Col>

    

    {/* ACTION BUTTONS */}
    <Col md={3}>
      <div className="d-flex gap-2 flex-wrap">
        <Button
          variant="success"
          onClick={handleFetchAttendance}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Attendance"}
        </Button>

        <Button
          variant="danger"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </Col>

  </Row>
</Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Fetching attendance records...</p>
        </div>
      )}

      {/* Results Section */}
      {!loading && attendanceData.length > 0 && (
        <div className="mt-4">
          <div className="mb-3">
            <h3>Attendance Records</h3>
            <p className="text-muted">
              Showing {attendanceData.length} school(s) with attendance records
            </p>
          </div>
          
          <Row xs={1} md={2} lg={3} className="g-4">
            {attendanceData.map((school) => (
              <Col key={school._id}>
                <Card className="h-100 shadow-sm">
                  <Card.Header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Card.Title as="h5" className="mb-0">{school.schoolName}</Card.Title>
                    <small className="text-white-50">ID: {school.schoolId}</small>
                  </Card.Header>
                  
                  <Card.Body>
                    <div className="mb-3 pb-2 border-bottom">
                      <p className="mb-1"><strong>District:</strong> {school.districtName}</p>
                      <p className="mb-1"><strong>Block:</strong> {school.blockName}</p>
                      <p className="mb-0">
                        <strong>Status:</strong> {' '}
                        <Badge bg={school.isCenterClosed ? "danger" : "success"}>
                          {school.isCenterClosed ? "Closed" : "Active"}
                        </Badge>
                      </p>
                    </div>
                    
                    {/* Attendance PDF Details */}
                    {school.uploadpdfdetails && school.uploadpdfdetails.length > 0 ? (
                      <div>
                        <h6 className="mb-2">PDF Details</h6>
                        {school.uploadpdfdetails.map((pdf) => (
                          <Card key={pdf._id} className="mb-2 bg-light">
                            <Card.Body className="p-3">
                              <p className="mb-1"><strong>Batch:</strong> {pdf.batch}</p>
                              <p className="mb-1">
                                <strong>Upload Status:</strong> {' '}
                                {getStatusBadge(pdf.isPdfUploaded)}
                              </p>
                              <p className="mb-1"><strong>Upload Date:</strong> {formatDisplayDate(pdf.dateOfUpload)}</p>
                              <p className="mb-1"><strong>File Name:</strong> {pdf.fileName || "N/A"}</p>
                              
                              {pdf.fileUrl && pdf.isPdfUploaded && (
                                <Button 
                                  variant="info" 
                                  size="sm" 
                                  href={pdf.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mt-2"
                                >
                                  📄 View PDF
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="warning" className="mb-0">
                        ⚠️ No attendance PDF uploaded for this date and batch
                      </Alert>
                    )}
                    
                    {/* Upload Button */}
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-3 w-100"
                      onClick={() => handleUploadClick(school)}
                    >
                      📤 Upload Attendance PDF
                    </Button>
                  </Card.Body>
                  
                  <Card.Footer className="text-muted">
                    <small>Last Updated: {formatDisplayDate(school.updatedAt)}</small>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* No Data Message */}
      {!loading && !error && attendanceData.length === 0 && (
        <Card className="text-center py-5">
          <Card.Body>
            <Card.Title>No Attendance Records Found</Card.Title>
            <Card.Text>
              Please select a date and batch, then click "Fetch Attendance"
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => {
        setShowUploadModal(false);
        setCapturedImages([]);
      }} size="lg">
        <Modal.Header closeButton={!uploadLoading}>
          <Modal.Title>Upload Attendance - {selectedSchool?.schoolName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSchool && (
            <>
              <div className="mb-3">
                <p><strong>School ID:</strong> {selectedSchool.schoolId}</p>
                <p><strong>Batch:</strong> {batchContext.batch || selectedBatch}</p>
                <p><strong>Date:</strong> {formatDisplayDate(startDate)}</p>
              </div>
              
              <hr />
              
              {/* Option 1: Upload PDF File */}
              <div className="mb-4">
                <h6>Option 1: Upload PDF File</h6>
                <Form.Group>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={uploadLoading}
                  />
                  <Form.Text className="text-muted">
                    Upload an existing PDF file (max size: 5MB)
                  </Form.Text>
                </Form.Group>
                {uploadFile && (
                  <Alert variant="info" className="mt-2">
                    Selected: {uploadFile.name}
                  </Alert>
                )}
              </div>
              
              <hr />
              
              {/* Option 2: Capture Images and Convert to PDF */}
              <div>
                <h6>Option 2: Capture/Select Images</h6>
                <p className="text-muted">Select images from gallery or take photos using camera</p>
                
                {/* Image Upload Box */}
                <div 
                  className="border rounded p-4 text-center mb-3"
                  style={{ 
                    border: '2px dashed #ccc', 
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa'
                  }}
                  onClick={() => document.getElementById('imageInput').click()}
                >
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    disabled={uploadLoading}
                  />
                  {imageUploadLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <div style={{ fontSize: '48px' }}>📸</div>
                      <p className="mb-0">Click to select images</p>
                      <small className="text-muted">Supports JPG, PNG, GIF (will be compressed)</small>
                    </>
                  )}
                </div>
                
                {/* Image Preview Grid */}
                {capturedImages.length > 0 && (
                  <div className="mt-3">
                    <h6>Selected Images ({capturedImages.length})</h6>
                    <Row xs={2} md={3} className="g-2">
                      {capturedImages.map((img) => (
                        <Col key={img.id}>
                          <Card className="h-100">
                            <Card.Img 
                              variant="top" 
                              src={img.url} 
                              style={{ height: '120px', objectFit: 'cover' }} 
                            />
                            <Card.Body className="p-2 text-center">
                              <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => removeImage(img.id)}
                                disabled={uploadLoading}
                              >
                                Remove
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <Alert variant="info" className="mt-2">
                      <small>{capturedImages.length} image(s) will be merged into a single PDF in order</small>
                    </Alert>
                  </div>
                )}
              </div>
              
              {uploadSuccess && (
                <Alert variant="success" className="mt-3">
                  {uploadSuccess}
                </Alert>
              )}
              
              {uploadError && (
                <Alert variant="danger" className="mt-3">
                  {uploadError}
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowUploadModal(false);
              setCapturedImages([]);
            }}
            disabled={uploadLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={uploadFile ? handlePdfUpload : (capturedImages.length > 0 ? handleImagesToPdfUpload : null)}
            disabled={uploadLoading || (!uploadFile && capturedImages.length === 0)}
          >
            {uploadLoading ? <Spinner animation="border" size="sm" /> : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};