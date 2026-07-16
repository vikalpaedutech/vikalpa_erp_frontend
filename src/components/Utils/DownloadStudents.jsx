// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import {
//   School_drop_down,
//   Batch_drop_down,
//   District_block_school,
// } from "../Utils/DependentDropDowns.v2";
// import {
//   Container,
//   Card,
//   Button,
//   Spinner,
//   Row,
//   Col,
//   Alert,
//   Form,
// } from "react-bootstrap";
// import { FaDownload } from "react-icons/fa";

// // Define allowed roles for download functionality
// const ALLOWED_ROLES = [
//   "Admin",
//   "Community Manager",
//   "Community Incharge",
//   "Academic Head",
//   "Operations Head"
// ];

// export const DownloadStudentsData = () => {
//   const { userData } = useContext(UserContext);
  
//   const {
//     districtContext,
//     blockContext,
//     schoolContext,
//     batchContext,
//     setSelectedBatch,
//   } = useContext(DistrictBlockSschoolContextV2);

//   // State for form fields
//   const [downloadType, setDownloadType] = useState("student-data");
//   const [isSlcTaken, setIsSlcTaken] = useState(null); // Changed to null initially
//   const [numberOfDays, setNumberOfDays] = useState(30);
//   const [exactMatch, setExactMatch] = useState(true);
//   const [format, setFormat] = useState("Excel");

//   // State for field selection (which columns to include)
//   const [selectedFields, setSelectedFields] = useState({
//     studentSrn: true,
//     rollNumber: true,
//     firstName: true,
//     gender: true,
//     fatherName: true,
//     category: true,
//     districtName: true,
//     blockName: true,
//     schoolName: true,
//     personalContact: true,
//     ParentContact: true,
//   });

//   // Loading and error states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [validationError, setValidationError] = useState(null);

//   // Check if user has permission to download
//   const hasDownloadPermission = ALLOWED_ROLES.includes(userData?.role);

//   // Handle field toggle
//   const handleFieldToggle = (fieldName) => {
//     setSelectedFields((prev) => ({
//       ...prev,
//       [fieldName]: !prev[fieldName],
//     }));
//   };

//   // Handle select all fields
//   const handleSelectAllFields = () => {
//     const allSelected = Object.values(selectedFields).every((val) => val === true);
//     const newState = {};
//     Object.keys(selectedFields).forEach((key) => {
//       newState[key] = !allSelected;
//     });
//     setSelectedFields(newState);
//   };

//   // Validate required fields
//   const validateFields = () => {
//     // Check if batch is selected
//     if (!batchContext || !batchContext.batch) {
//       setValidationError("Please select a Batch before downloading.");
//       return false;
//     }

//     // Check if SLC Taken is selected
//     if (isSlcTaken === null || isSlcTaken === "") {
//       setValidationError("Please select SLC Taken (Yes/No) before downloading.");
//       return false;
//     }

//     setValidationError(null);
//     return true;
//   };

//   // Handle download
//   const handleDownload = async () => {
//     // Validate required fields first
//     if (!validateFields()) {
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       // Extract values from context objects
//       const districtId = districtContext?.districtId;
//       const blockId = blockContext?.blockId;
//       const schoolId = schoolContext?.schoolId;
      
//       // Extract batch value from batchContext
//       let batchValue;
//       if (batchContext) {
//         if (batchContext.batch) {
//           batchValue = batchContext.batch;
//         } else if (batchContext.value) {
//           batchValue = batchContext.value;
//         } else if (typeof batchContext === 'string') {
//           batchValue = batchContext;
//         } else if (Array.isArray(batchContext) && batchContext.length > 0) {
//           batchValue = batchContext.map(item => item.batch || item);
//         }
//       }

//       // Prepare request body
//       const requestBody = {
//         ...selectedFields,
//         districtId,
//         blockId,
//         schoolId,
//         batch: batchValue ? [batchValue] : undefined,
//         isSlcTaken: isSlcTaken === "true" ? true : false,
//         downloadType,
//         numberOfDays,
//         exactMatch,
//         format,
//       };

//       console.log("Sending request body:", requestBody);

//       // Make API call with blob response for file download
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/api/download-students-data`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Download failed");
//       }

//       // Get blob from response
//       const blob = await response.blob();
      
//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
      
//       // Set filename based on download type and format
//       const extension = format.toLowerCase() === "excel" ? "xlsx" : format.toLowerCase();
//       link.download = `${downloadType}_${new Date().toISOString().slice(0, 10)}.${extension}`;
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 5000);
//     } catch (err) {
//       console.error("Download error:", err);
//       setError(err.message || "Failed to download data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // If user doesn't have permission, show access denied
//   if (!hasDownloadPermission) {
//     return (
//       <Container className="mt-4">
//         <Alert variant="danger">
//           <Alert.Heading>Access Denied</Alert.Heading>
//           <p>
//             You don't have permission to download student data. 
//             Required roles: {ALLOWED_ROLES.join(", ")}
//           </p>
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="mt-4">
//       <Card>
//         <Card.Header as="h5" className="bg-primary text-white">
//           <FaDownload className="me-2" />
//           Download Students Data
//         </Card.Header>
//         <Card.Body>
//           {/* Filters Section */}
//           <Row className="mb-3">
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label className="fw-bold">
//                   Batch <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Batch_drop_down
//                   selectedBatch={batchContext}
//                   setSelectedBatch={setSelectedBatch}
//                   multiple={false}
//                 />
//                 {!batchContext?.batch && (
//                   <small className="text-danger d-block mt-1">
//                     Batch is required
//                   </small>
//                 )}
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>District, Block & School</Form.Label>
//                 <District_block_school isEmbedded={true} />
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label className="fw-bold">
//                   SLC Taken <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Select
//                   value={isSlcTaken === null ? "" : isSlcTaken}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setIsSlcTaken(value === "" ? null : value);
//                     // Clear validation error when user selects
//                     if (validationError?.includes("SLC")) {
//                       setValidationError(null);
//                     }
//                   }}
//                   className={!isSlcTaken ? "border-danger" : ""}
//                 >
//                   <option value="">Select SLC Taken...</option>
//                   <option value="true">Yes</option>
//                   <option value="false">No</option>
//                 </Form.Select>
//                 {!isSlcTaken && (
//                   <small className="text-danger d-block mt-1">
//                     SLC Taken is required
//                   </small>
//                 )}
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Validation Error Display */}
//           {validationError && (
//             <Alert variant="danger" onClose={() => setValidationError(null)} dismissible>
//               {validationError}
//             </Alert>
//           )}

//           {/* Download Settings Section */}
//           <Row className="mb-3">
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Download Type</Form.Label>
//                 <Form.Select
//                   value={downloadType}
//                   onChange={(e) => setDownloadType(e.target.value)}
//                 >
//                   <option value="student-data">Student Data</option>
//                   <option value="top-absentee">Top Absentee (Total)</option>
//                   <option value="consecutive-absentee">
//                     Consecutive Absentee
//                   </option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Number of Days</Form.Label>
//                 <Form.Control
//                   type="number"
//                   min="1"
//                   max="365"
//                   value={numberOfDays}
//                   onChange={(e) => setNumberOfDays(parseInt(e.target.value) || 30)}
//                   disabled={downloadType === "student-data"}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Exact Match</Form.Label>
//                 <Form.Select
//                   value={exactMatch}
//                   onChange={(e) => setExactMatch(e.target.value === "true")}
//                   disabled={downloadType === "student-data"}
//                 >
//                   <option value="true">Yes (Exact {numberOfDays} days)</option>
//                   <option value="false">No (All students)</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>File Format</Form.Label>
//                 <Form.Select
//                   value={format}
//                   onChange={(e) => setFormat(e.target.value)}
//                 >
//                   <option value="Excel">Excel (.xlsx)</option>
//                   <option value="CSV">CSV (.csv)</option>
//                   <option value="PDF">PDF (.pdf)</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Fields Selection Section */}
//           <Card className="mb-3">
//             <Card.Header>
//               <Row className="align-items-center">
//                 <Col>
//                   <strong>Select Columns to Include</strong>
//                 </Col>
//                 <Col xs="auto">
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     onClick={handleSelectAllFields}
//                   >
//                     {Object.values(selectedFields).every((val) => val === true)
//                       ? "Deselect All"
//                       : "Select All"}
//                   </Button>
//                 </Col>
//               </Row>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 {Object.keys(selectedFields).map((field) => (
//                   <Col key={field} md={3} className="mb-2">
//                     <Form.Check
//                       type="checkbox"
//                       id={`field-${field}`}
//                       label={field
//                         .replace(/([A-Z])/g, " $1")
//                         .trim()
//                         .replace(/^./, (str) => str.toUpperCase())}
//                       checked={selectedFields[field]}
//                       onChange={() => handleFieldToggle(field)}
//                     />
//                   </Col>
//                 ))}
//               </Row>
//             </Card.Body>
//           </Card>

//           {/* Current Selection Display */}
//           <Card className="mb-3 bg-light">
//             <Card.Body>
//               <small>
//                 <strong>Current Selection:</strong><br />
//                 District: {districtContext?.districtName || "All"} | 
//                 Block: {blockContext?.blockName || "All"} | 
//                 School: {schoolContext?.schoolName || "All"} | 
//                 Batch: {batchContext?.batch || "Not Selected"} | 
//                 SLC: {isSlcTaken === "true" ? "Yes" : isSlcTaken === "false" ? "No" : "Not Selected"}
//               </small>
//             </Card.Body>
//           </Card>

//           {/* Error and Success Messages */}
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
//               File downloaded successfully!
//             </Alert>
//           )}

//           {/* Download Button */}
//           <div className="d-grid gap-2">
//             <Button
//               variant="success"
//               size="lg"
//               onClick={handleDownload}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Spinner
//                     as="span"
//                     animation="border"
//                     size="sm"
//                     role="status"
//                     aria-hidden="true"
//                     className="me-2"
//                   />
//                   Downloading...
//                 </>
//               ) : (
//                 <>
//                   <FaDownload className="me-2" />
//                   Download Data
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* Info Note */}
//           <Alert variant="info" className="mt-3">
//             <small>
//               <strong>Note:</strong> 
//               {downloadType === "student-data" && " Downloads all student data with selected filters."}
//               {downloadType === "top-absentee" && " Downloads students with highest total absences in the last N days."}
//               {downloadType === "consecutive-absentee" && " Downloads students who are continuously absent for N days."}
//               {" "}File will be downloaded in {format} format.
//               <br />
//               <span className="text-danger">*</span> Required fields: Batch and SLC Taken
//             </small>
//           </Alert>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };













import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import {
  School_drop_down,
  Batch_drop_down,
  District_block_school,
} from "../Utils/DependentDropDowns.v2";
import {
  Container,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Alert,
  Form,
} from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

// Define allowed roles for download functionality
const ALLOWED_ROLES = [
  "Admin",
  "Community Manager",
  "Community Incharge",
  "Academic Head",
  "Operations Head"
];

export const DownloadStudentsData = () => {
  const { userData } = useContext(UserContext);
  
  const {
    districtContext,
    blockContext,
    schoolContext,
    batchContext,
    setSelectedBatch,
  } = useContext(DistrictBlockSschoolContextV2);

  // State for form fields
  const [downloadType, setDownloadType] = useState("student-data");
  const [isSlcTaken, setIsSlcTaken] = useState(null); // Changed to null initially
  const [numberOfDays, setNumberOfDays] = useState(30);
  const [exactMatch, setExactMatch] = useState(true);
  const [format, setFormat] = useState("Excel");

  // State for field selection (which columns to include)
  const [selectedFields, setSelectedFields] = useState({
    studentSrn: true,
    rollNumber: true,
    firstName: true,
    gender: true,
    fatherName: true,
    category: true,
    districtName: true,
    blockName: true,
    schoolName: true,
    personalContact: true,
    ParentContact: true,
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Check if user has permission to download
  const hasDownloadPermission = ALLOWED_ROLES.includes(userData?.role);

  // Handle field toggle
  const handleFieldToggle = (fieldName) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Handle select all fields
  const handleSelectAllFields = () => {
    const allSelected = Object.values(selectedFields).every((val) => val === true);
    const newState = {};
    Object.keys(selectedFields).forEach((key) => {
      newState[key] = !allSelected;
    });
    setSelectedFields(newState);
  };

  // Validate required fields
  const validateFields = () => {
    // Check if batch is selected
    if (!batchContext || !batchContext.batch) {
      setValidationError("Please select a Batch before downloading.");
      return false;
    }

    // Check if SLC Taken is selected
    if (isSlcTaken === null || isSlcTaken === "") {
      setValidationError("Please select SLC Taken (Yes/No) before downloading.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  // Handle download
  const handleDownload = async () => {
    // Validate required fields first
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Extract values from context objects
      const districtId = districtContext?.districtId;
      const blockId = blockContext?.blockId;
      const schoolId = schoolContext?.schoolId;
      
      // Extract batch value from batchContext
      let batchValue;
      if (batchContext) {
        if (batchContext.batch) {
          batchValue = batchContext.batch;
        } else if (batchContext.value) {
          batchValue = batchContext.value;
        } else if (typeof batchContext === 'string') {
          batchValue = batchContext;
        } else if (Array.isArray(batchContext) && batchContext.length > 0) {
          batchValue = batchContext.map(item => item.batch || item);
        }
      }

      // Prepare request body
      const requestBody = {
        ...selectedFields,
        districtId,
        blockId,
        schoolId,
        batch: batchValue ? [batchValue] : undefined,
        isSlcTaken: isSlcTaken === "true" ? true : false,
        downloadType,
        numberOfDays,
        exactMatch,
        format,
      };

      console.log("Sending request body:", requestBody);

      // Make API call with blob response for file download
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/download-students-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Download failed");
      }

      // Get blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Set filename based on download type and format
      const extension = format.toLowerCase() === "excel" ? "xlsx" : format.toLowerCase();
      link.download = `${downloadType}_${new Date().toISOString().slice(0, 10)}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Download error:", err);
      setError(err.message || "Failed to download data");
    } finally {
      setLoading(false);
    }
  };

  // If user doesn't have permission, show access denied
  if (!hasDownloadPermission) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>
            You don't have permission to download student data. 
            Required roles: {ALLOWED_ROLES.join(", ")}
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Card>
        <Card.Header as="h5" className="bg-primary text-white">
          <FaDownload className="me-2" />
          Download Students Data
        </Card.Header>
        <Card.Body>
          {/* Filters Section */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  Batch <span className="text-danger">*</span>
                </Form.Label>
                <Batch_drop_down
                  selectedBatch={batchContext}
                  setSelectedBatch={setSelectedBatch}
                  multiple={false}
                />
                {!batchContext?.batch && (
                  <small className="text-danger d-block mt-1">
                    Batch is required
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>District, Block & School</Form.Label>
                <District_block_school isEmbedded={true} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  SLC Taken <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={isSlcTaken === null ? "" : isSlcTaken}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIsSlcTaken(value === "" ? null : value);
                    // Clear validation error when user selects
                    if (validationError?.includes("SLC")) {
                      setValidationError(null);
                    }
                  }}
                  className={!isSlcTaken ? "border-danger" : ""}
                >
                  <option value="">Select SLC Taken...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
                {!isSlcTaken && (
                  <small className="text-danger d-block mt-1">
                    SLC Taken is required
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Validation Error Display */}
          {validationError && (
            <Alert variant="danger" onClose={() => setValidationError(null)} dismissible>
              {validationError}
            </Alert>
          )}

          {/* Download Settings Section */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Download Type</Form.Label>
                <Form.Select
                  value={downloadType}
                  onChange={(e) => setDownloadType(e.target.value)}
                >
                  <option value="student-data">Student Data</option>
                  {/* Removed Top Absentee option as requested */}
                  <option value="consecutive-absentee">
                    Consecutive Absentee
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Number of Days</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="365"
                  value={numberOfDays}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string for user to type
                    if (value === "") {
                      setNumberOfDays("");
                      return;
                    }
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      setNumberOfDays(numValue);
                    }
                  }}
                  onBlur={(e) => {
                    // Set default value if empty
                    if (numberOfDays === "" || numberOfDays === null) {
                      setNumberOfDays(30);
                    }
                  }}
                  disabled={downloadType === "student-data"}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Exact Match</Form.Label>
                <Form.Select
                  value={exactMatch}
                  onChange={(e) => setExactMatch(e.target.value === "true")}
                  disabled={downloadType === "student-data"}
                >
                  <option value="true">Yes (Exact {numberOfDays || 30} days)</option>
                  <option value="false">No (All students)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>File Format</Form.Label>
                <Form.Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="Excel">Excel (.xlsx)</option>
                  <option value="CSV">CSV (.csv)</option>
                  <option value="PDF">PDF (.pdf)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Fields Selection Section */}
          <Card className="mb-3">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <strong>Select Columns to Include</strong>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleSelectAllFields}
                  >
                    {Object.values(selectedFields).every((val) => val === true)
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                {Object.keys(selectedFields).map((field) => (
                  <Col key={field} md={3} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`field-${field}`}
                      label={field
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/^./, (str) => str.toUpperCase())}
                      checked={selectedFields[field]}
                      onChange={() => handleFieldToggle(field)}
                    />
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Current Selection Display */}
          <Card className="mb-3 bg-light">
            <Card.Body>
              <small>
                <strong>Current Selection:</strong><br />
                District: {districtContext?.districtName || "All"} | 
                Block: {blockContext?.blockName || "All"} | 
                School: {schoolContext?.schoolName || "All"} | 
                Batch: {batchContext?.batch || "Not Selected"} | 
                SLC: {isSlcTaken === "true" ? "Yes" : isSlcTaken === "false" ? "No" : "Not Selected"}
              </small>
            </Card.Body>
          </Card>

          {/* Error and Success Messages */}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
              File downloaded successfully!
            </Alert>
          )}

          {/* Download Button */}
          <div className="d-grid gap-2">
            <Button
              variant="success"
              size="lg"
              onClick={handleDownload}
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
                  Downloading...
                </>
              ) : (
                <>
                  <FaDownload className="me-2" />
                  Download Data
                </>
              )}
            </Button>
          </div>

          {/* Info Note */}
          <Alert variant="info" className="mt-3">
            <small>
              <strong>Note:</strong> 
              {downloadType === "student-data" && " Downloads all student data with selected filters."}
              {downloadType === "consecutive-absentee" && " Downloads students who are continuously absent for N days."}
              {" "}File will be downloaded in {format} format.
              <br />
              <span className="text-danger">*</span> Required fields: Batch and SLC Taken
            </small>
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
};