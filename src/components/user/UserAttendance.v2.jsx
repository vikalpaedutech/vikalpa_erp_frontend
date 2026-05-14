
// // UserAttendanceUpdated.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   markUserAttendance
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// import { selfAttendance } from "../../service/ErpTest.services";
// import imageCompression from "browser-image-compression";

// export const MarkUserAttendance = () =>{

//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   console.log(userData)

//   const handleFileChange = (e) => {

//     console.log(e)

//     const file = e.target.files[0];

//     if (file) {
//       console.log(file);
//     }
//   };




//   //Sending data to backend
//   const handleFileUpload = async (e) =>{


//   const file = e.target.files[0];

//   console.log(file)

//   console.log("Original Size:", file.size / 1024, "KB");



//     // Compression options
//     const options = {
//       maxSizeMB: 0.1, // 300 KB
//       maxWidthOrHeight: 1280,
//       useWebWorker: true,
//     };

//     // Compress image
//     const compressedFile = await imageCompression(file, options);

//     console.log(
//       "Compressed Size:",
//       compressedFile.size / 1024,
//       "KB"
//     );
  
//   const formData = new FormData();
//       formData.append('unqUserObjectId', userData?._id);
//       formData.append('userId', userData?.userId);
//       formData.append('date', new Date().toISOString());
//       formData.append('attendance', "Present");
//     //   formData.append('loginTime', new Date().toISOString());
//     //   formData.append('logoutTime', null);
//     //   formData.append('unqUserObjectId', userData?._id);
//     //   formData.append('unqUserObjectId', userData?._id);
//       formData.append('attendanceType', "Daily Attendance");
//   formData.append('file', compressedFile );

//   for (let pair of formData.entries()) {
//     console.log(pair[0], pair[1]);
//   }


//   const response = await markUserAttendance(formData)
//  console.log(response);


//   }

//   return (
//     <>
//       <input
//       type="file"
//       accept="image/*"
//       capture="environment"
//       onChange={handleFileUpload}
//     />
//     </>
//   );
// }
















// // UserAttendanceUpdated.jsx
// import React, { useState, useEffect, useContext, useRef, use } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   markUserAttendance, getUserAttendanceData
// } from "../../service/userAttendance.services";
// import { Modal, Button, Card, Spinner, Form, Row, Col, Alert, Container } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from 'react-select';
// import imageCompression from "browser-image-compression";
// import { ERPtest } from "../ErpTest/ErpTest";

// export const MarkUserAttendance = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);
  
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState(null)



//   //Chekcing if the attendance is already marked and if yes then fetching the status

//   const fetchAttendanceStatus = async () =>{

//     const reqBody = {
//         unqUserObjectId: userData?._id
//     }

//     try {
//         const response = await getUserAttendanceData(reqBody)

//         console.log(response.data.data.attendance)
//         setCurrentAttendanceStatus(response.data.data.attendance)
//     } catch (error) {
//         console.log('Error occured while fetching users data')
//     }

//   }

// useEffect(()=>{
// fetchAttendanceStatus()
// }, [])

// //----------------------------------------------------------------------
//   // Attendance Type Options
//   const attendanceTypeOptions = [
//     { value: 'Daily Attendance', label: 'Daily Attendance' },
//     { value: 'WFH', label: 'WFH' },
//     { value: 'Field Visit', label: 'Field Visit' },
//     { value: 'Center Visit', label: 'Center Visit' },
//     // { value: 'Event', label: 'Event' }
//   ];
  
//   const [selectedAttendance, setSelectedAttendance] = useState(null);
//   const [visitingLocation, setVisitingLocation] = useState('');
//   const [showLocationInput, setShowLocationInput] = useState(false);
  
//   const fileInputRef = useRef(null);
  
//   // Handle attendance type change
//   const handleAttendanceChange = (selectedOption) => {
//     setSelectedAttendance(selectedOption);
//     setVisitingLocation(''); // Reset location when attendance type changes
    
//     // Check if we need to show location input
//     if (selectedOption?.value === 'Field Visit' || selectedOption?.value === 'Center Visit') {
//       setShowLocationInput(true);
//     } else {
//       setShowLocationInput(false);
//     }
//   };
  
//   // Handle location input change
//   const handleLocationChange = (e) => {
//     setVisitingLocation(e.target.value);
//   };
  
//   // Handle camera capture and submit
//   const handleMarkAttendance = async () => {
//     // Validation
//     if (!selectedAttendance) {
//       setError("Please select attendance type");
//       setTimeout(() => setError(null), 3000);
//       return;
//     }
    
//     if (showLocationInput && !visitingLocation.trim()) {
//       setError("Please enter visiting location");
//       setTimeout(() => setError(null), 3000);
//       return;
//     }
    
//     // Trigger camera on mobile devices
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     } else {
//       // Fallback: create temporary camera input
//       const cameraInput = document.createElement('input');
//       cameraInput.type = 'file';
//       cameraInput.accept = 'image/*';
//       cameraInput.capture = 'environment';
//       cameraInput.onchange = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//           await processAndSubmitAttendance(file);
//         }
//       };
//       cameraInput.click();
//     }
//   };
  
//   // Process image compression and submit attendance
//   const processAndSubmitAttendance = async (file) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
    
//     try {
//       console.log("Original Image:", file);
//       console.log("Original Size:", (file.size / 1024).toFixed(2), "KB");
      
//       // Compression options (target ~50KB)
//       const options = {
//         maxSizeMB: 0.05, // 50 KB
//         maxWidthOrHeight: 1024,
//         useWebWorker: true,
//         fileType: 'image/jpeg'
//       };
      
//       // Compress image
//       let compressedFile = await imageCompression(file, options);
      
//       // If still too large, compress further
//       if (compressedFile.size / 1024 > 100) {
//         options.maxSizeMB = 0.03; // 30 KB
//         options.maxWidthOrHeight = 800;
//         compressedFile = await imageCompression(file, options);
//       }
      
//       console.log("Compressed Size:", (compressedFile.size / 1024).toFixed(2), "KB");
      
//       // Prepare form data
//       const formData = new FormData();
//       formData.append('unqUserObjectId', userData?._id);
//       formData.append('userId', userData?.userId);
//       formData.append('date', new Date().toISOString());
//       formData.append('attendance', "Present");
//       formData.append('attendanceType', selectedAttendance?.value);
//       formData.append('file', compressedFile);
//       formData.append('attendanceMarkedBy', userData?._id);

      
//       // Add location if applicable
//       if (showLocationInput && visitingLocation) {
//         formData.append('visitingLocation', visitingLocation);
//       }
      
//       // Log form data for debugging
//       console.log("=== Form Data being sent ===");
//       for (let pair of formData.entries()) {
//         console.log(pair[0], pair[1]);
//       }
      
//       // Submit attendance
//       const response = await markUserAttendance(formData);
//       console.log("Full Response:", response);
      
//       // Better response checking
//       // Check if response exists and is successful
//       if (response) {
//         // Check for different possible success indicators
//         const isSuccess = 
//           response.success === true || 
//           response.status === 200 || 
//           response.status === "success" ||
//           response.data?.success === true ||
//           response.message?.toLowerCase().includes('success') ||
//           (response.data && response.data._id); // If response has data with ID
        
//         if (isSuccess) {
//           setSuccess(true);
//           setSelectedImage(null);
//           setSelectedAttendance(null);
//           setVisitingLocation('');
//           setShowLocationInput(false);
          
//           // Reset file input
//           if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//           }
          
//           // Clear success message after 3 seconds
//           setTimeout(() => {
//             setSuccess(false);
//             window.location.reload()
//           }, 1000);
//         } else {
//           // Show specific error message from response
//           const errorMsg = response?.message || response?.error || response?.data?.message || "Failed to mark attendance";
//           setError(errorMsg);
//           console.error("API returned error:", response);
//         }
//       } else {
//         setError("No response received from server");
//       }
      
//     } catch (err) {
//       console.error("Attendance Error Details:", err);
      
//       // Better error message extraction
//       let errorMessage = "Error marking attendance. Please try again.";
      
//       if (err?.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       } else if (err?.response?.data?.error) {
//         errorMessage = err.response.data.error;
//       } else if (err?.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Handle file selection (for testing on desktop)
//   const handleFileSelect = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       await processAndSubmitAttendance(file);
//     }
//   };
  
//   return (
//     <Container className="mt-4 mb-4">
//       <Card className="shadow-sm">
//         <Card.Header className="bg-primary text-white">
//           <h4 className="mb-0">Mark Your Attendance</h4>
//         </Card.Header>
        
//         {currentAttendanceStatus === "Present" ? (<>
//         Attendance Marked!
//         </>):(<>Attendance Not Marked</>)}
//         <Card.Body>
//           {/* Success Alert */}
//           {success && (
//             <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
//               <Alert.Heading>Success!</Alert.Heading>
//               <p>Your attendance has been marked successfully.</p>
//             </Alert>
//           )}
          
//           {/* Error Alert */}
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               <Alert.Heading>Error!</Alert.Heading>
//               <p>{error}</p>
//             </Alert>
//           )}
          
//           {/* Hidden file input for camera */}
//           <Form.Control
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileSelect}
//             accept="image/*"
//             capture="environment"
//             style={{ display: 'none' }}
//           />
          
//           <Form>
//             {/* Attendance Type Dropdown */}
//             <Form.Group className="mb-4">
//               <Form.Label className="fw-bold">
//                 Attendance Type <span className="text-danger">*</span>
//               </Form.Label>
//               <Select
//                 options={attendanceTypeOptions}
//                 value={selectedAttendance}
//                 onChange={handleAttendanceChange}
//                 placeholder="Select attendance type..."
//                 isClearable
//                 isSearchable
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: '#ced4da',
//                     '&:hover': { borderColor: '#86b7fe' }
//                   })
//                 }}
//               />
//             </Form.Group>
            
//             {/* Manual Visiting Location Input */}
//             {showLocationInput && (
//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold">
//                   Visiting Location <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={visitingLocation}
//                   onChange={handleLocationChange}
//                   placeholder="Enter visiting location (e.g., Client Office, Site Location, etc.)"
//                   className="form-control-lg"
//                 />
//                 <Form.Text className="text-muted">
//                   Please enter the location you are visiting
//                 </Form.Text>
//               </Form.Group>
//             )}
            
//             {/* User Info Card */}
//             <Card className="bg-light mb-4">
//               <Card.Body>
//                 <Row>
//                   <Col md={6}>
//                     <small className="text-muted">Employee ID</small>
//                     <p className="mb-0 fw-bold">{userData?.userId || 'N/A'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <small className="text-muted">Name</small>
//                     <p className="mb-0 fw-bold">{userData?.name || userData?.fullName || 'N/A'}</p>
//                   </Col>
//                 </Row>
//                 <Row className="mt-2">
//                   <Col md={6}>
//                     <small className="text-muted">Date</small>
//                     <p className="mb-0 fw-bold">{new Date().toLocaleDateString()}</p>
//                   </Col>
//                   <Col md={6}>
//                     <small className="text-muted">Time</small>
//                     <p className="mb-0 fw-bold">{new Date().toLocaleTimeString()}</p>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
            
//             {/* Mark Attendance Button */}
//             <div className="d-grid gap-2">

//             {currentAttendanceStatus === "Present" ? (
//             <Button
//                 variant="primary"
//                 size="lg"
//                 onClick={handleMarkAttendance}
//                 disabled={loading}
//                 className="d-flex align-items-center justify-content-center gap-2"
//                 disabled
//               >
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     📸 Mark Attendance
//                   </>
//                 )}
//               </Button>
//             ):(<Button
//                 variant="primary"
//                 size="lg"
//                 onClick={handleMarkAttendance}
//                 disabled={loading}
//                 className="d-flex align-items-center justify-content-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     📸 Mark Attendance
//                   </>
//                 )}
//               </Button>)}
              
//             </div>
            
//             <small className="text-muted d-block text-center mt-3">
//               Clicking the button will open camera to capture your attendance photo
//             </small>
//           </Form>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };











// UserAttendanceUpdated.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  markUserAttendance, getUserAttendanceData
} from "../../service/userAttendance.services";
import { Modal, Button, Card, Spinner, Form, Row, Col, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import imageCompression from "browser-image-compression";

export const MarkUserAttendance = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState(null);
  const [attendanceTime, setAttendanceTime] = useState(null);
  const [attendanceType, setAttendanceType] = useState(null);
  const [attendanceLocation, setAttendanceLocation] = useState(null);

  // Define roles that can see attendance type dropdown
  const allowedRolesForAttendanceType = ['ACI', 'Media Manager'];
  const canShowAttendanceType = allowedRolesForAttendanceType.includes(userData?.role);

  // Fetching if the attendance is already marked and if yes then fetching the status
  const fetchAttendanceStatus = async () => {
    const reqBody = {
      unqUserObjectId: userData?._id
    }

    try {
      const response = await getUserAttendanceData(reqBody)
      console.log(response.data.data)
      const attendanceData = response.data.data;
      
      setCurrentAttendanceStatus(attendanceData.attendance)
      
      // If attendance is marked, store the time, type and location
      if (attendanceData.attendance === "Present") {
        // Format the time from createdAt or updatedAt
        const markedTime = attendanceData.createdAt || attendanceData.updatedAt;
        if (markedTime) {
          const date = new Date(markedTime);
          const formattedTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
          });
          setAttendanceTime(formattedTime);
        }
        
        // Store attendance type
        setAttendanceType(attendanceData.attendanceType || 'Daily Attendance');
        
        // Store visiting location if exists
        setAttendanceLocation(attendanceData.visitingLocation || null);
      }
    } catch (error) {
      console.log('Error occured while fetching users data')
    }
  }

  useEffect(() => {
    fetchAttendanceStatus()
  }, [])

  //----------------------------------------------------------------------
  // Attendance Type Options
  const attendanceTypeOptions = [
    { value: 'Daily Attendance', label: 'Daily Attendance' },
    { value: 'WFH', label: 'WFH' },
    { value: 'Field Visit', label: 'Field Visit' },
    { value: 'Center Visit', label: 'Center Visit' },
  ];
  
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [visitingLocation, setVisitingLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Set default attendance type for non-allowed roles
  useEffect(() => {
    if (!canShowAttendanceType && !selectedAttendance) {
      const defaultAttendance = attendanceTypeOptions.find(option => option.value === 'Daily Attendance');
      setSelectedAttendance(defaultAttendance);
    }
  }, [canShowAttendanceType]);
  
  // Handle attendance type change
  const handleAttendanceChange = (selectedOption) => {
    setSelectedAttendance(selectedOption);
    setVisitingLocation(''); // Reset location when attendance type changes
    
    // Check if we need to show location input
    if (selectedOption?.value === 'Field Visit' || selectedOption?.value === 'Center Visit') {
      setShowLocationInput(true);
    } else {
      setShowLocationInput(false);
    }
  };
  
  // Handle location input change
  const handleLocationChange = (e) => {
    setVisitingLocation(e.target.value);
  };
  
  // Handle camera capture and submit
  const handleMarkAttendance = async () => {
    // Validation
    if (canShowAttendanceType && !selectedAttendance) {
      setError("Please select attendance type");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (showLocationInput && !visitingLocation.trim()) {
      setError("Please enter visiting location");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Trigger camera on mobile devices
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Fallback: create temporary camera input
      const cameraInput = document.createElement('input');
      cameraInput.type = 'file';
      cameraInput.accept = 'image/*';
      cameraInput.capture = 'environment';
      cameraInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          await processAndSubmitAttendance(file);
        }
      };
      cameraInput.click();
    }
  };
  
  // Process image compression and submit attendance
  const processAndSubmitAttendance = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log("Original Image:", file);
      console.log("Original Size:", (file.size / 1024).toFixed(2), "KB");
      
      // Compression options (target ~50KB)
      const options = {
        maxSizeMB: 0.05, // 50 KB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      // Compress image
      let compressedFile = await imageCompression(file, options);
      
      // If still too large, compress further
      if (compressedFile.size / 1024 > 100) {
        options.maxSizeMB = 0.03; // 30 KB
        options.maxWidthOrHeight = 800;
        compressedFile = await imageCompression(file, options);
      }
      
      console.log("Compressed Size:", (compressedFile.size / 1024).toFixed(2), "KB");
      
      // Prepare form data
      const formData = new FormData();
      formData.append('unqUserObjectId', userData?._id);
      formData.append('userId', userData?.userId);
      formData.append('date', new Date().toISOString());
      formData.append('attendance', "Present");
      formData.append('attendanceType', selectedAttendance?.value || 'Daily Attendance');
      formData.append('file', compressedFile);
      formData.append('attendanceMarkedBy', userData?._id);
      
      // Add location if applicable
      if (showLocationInput && visitingLocation) {
        formData.append('visitingLocation', visitingLocation);
      }
      
      // Log form data for debugging
      console.log("=== Form Data being sent ===");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Submit attendance
      const response = await markUserAttendance(formData);
      console.log("Full Response:", response);
      
      // Better response checking
      // Check if response exists and is successful
      if (response) {
        // Check for different possible success indicators
        const isSuccess = 
          response.success === true || 
          response.status === 200 || 
          response.status === "success" ||
          response.data?.success === true ||
          response.message?.toLowerCase().includes('success') ||
          (response.data && response.data._id); // If response has data with ID
        
        if (isSuccess) {
          setSuccess(true);
          setSelectedImage(null);
          setSelectedAttendance(null);
          setVisitingLocation('');
          setShowLocationInput(false);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          // Refresh attendance status
          await fetchAttendanceStatus();
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else {
          // Show specific error message from response
          const errorMsg = response?.message || response?.error || response?.data?.message || "Failed to mark attendance";
          setError(errorMsg);
          console.error("API returned error:", response);
        }
      } else {
        setError("No response received from server");
      }
      
    } catch (err) {
      console.error("Attendance Error Details:", err);
      
      // Better error message extraction
      let errorMessage = "Error marking attendance. Please try again.";
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file selection (for testing on desktop)
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await processAndSubmitAttendance(file);
    }
  };
  
  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Mark Your Attendance</h4>
        </Card.Header>
        
        <Card.Body>
          {/* Success Alert */}
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
              <Alert.Heading>Success!</Alert.Heading>
              <p>Your attendance has been marked successfully.</p>
            </Alert>
          )}
          
          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}
          
          {/* Hidden file input for camera */}
          <Form.Control
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
          
          <Form>
            {/* Attendance Type Dropdown - Only shown for ACI and Media Manager roles */}
            {canShowAttendanceType && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Attendance Type <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  options={attendanceTypeOptions}
                  value={selectedAttendance}
                  onChange={handleAttendanceChange}
                  placeholder="Select attendance type..."
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#ced4da',
                      '&:hover': { borderColor: '#86b7fe' }
                    })
                  }}
                />
              </Form.Group>
            )}
            
            {/* Manual Visiting Location Input */}
            {showLocationInput && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Visiting Location <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={visitingLocation}
                  onChange={handleLocationChange}
                  placeholder="Enter visiting location (e.g., Client Office, Site Location, etc.)"
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">
                  Please enter the location you are visiting
                </Form.Text>
              </Form.Group>
            )}
            
            {/* User Info Card - Without Employee ID */}
            <Card className="bg-light mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <small className="text-muted">Name</small>
                    <p className="mb-0 fw-bold">{userData?.name || userData?.fullName || 'N/A'}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Date</small>
                    <p className="mb-0 fw-bold">{new Date().toLocaleDateString()}</p>
                  </Col>
                </Row>
               
                
                {/* Show Attendance Status Section if marked */}
                {currentAttendanceStatus === "Present" && (
                  <>
                    <hr className="mt-3 mb-3" />
                    <Row>
                      <Col md={12}>
                        <h6 className="text-success mb-2">✓ Attendance Status</h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <small className="text-muted">Status</small>
                        <p className="mb-0 fw-bold text-success">{currentAttendanceStatus}</p>
                      </Col>
                      <Col md={4}>
                        <small className="text-muted">Marked At</small>
                        <p className="mb-0 fw-bold">{attendanceTime || 'N/A'}</p>
                      </Col>
                      <Col md={4}>
                        <small className="text-muted">Attendance Type</small>
                        <p className="mb-0 fw-bold">{attendanceType || 'Daily Attendance'}</p>
                      </Col>
                    </Row>
                    {attendanceLocation && (
                      <Row className="mt-2">
                        <Col md={12}>
                          <small className="text-muted">Visiting Location</small>
                          <p className="mb-0 fw-bold">{attendanceLocation}</p>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
            
            {/* Mark Attendance Button */}
            <div className="d-grid gap-2">
              {currentAttendanceStatus === "Present" ? (
                <Button
                  variant="success"
                  size="lg"
                  disabled
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  ✓ Attendance Marked Successfully
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleMarkAttendance}
                  disabled={loading}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Processing...
                    </>
                  ) : (
                    <>
                      📸 Mark Attendance
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <small className="text-muted d-block text-center mt-3">
              Clicking the button will open camera to capture your attendance photo
            </small>

          </Form>
          <hr>
          </hr>
          <div  style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>
          <Button onClick={()=>{
            navigate('/user-dashboard')
          }}>
            Got to Home
          </Button>
         
          <Button onClick={()=>{
            alert("Coming Soon!")
          }}>
            Attendance Summary
          </Button>
          </div>
        
        </Card.Body>
      </Card>
    </Container>
  );
};