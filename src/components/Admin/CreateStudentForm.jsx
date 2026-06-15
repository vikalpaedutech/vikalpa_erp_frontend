
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from "react-bootstrap";
// import { PersonPlus, Save, ArrowLeft } from "react-bootstrap-icons";
// import { CreateStudentFormAPI as CreateStudentAPI } from "../../service/Student.service.js";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { School_drop_down } from "../Utils/DependentDropDowns.v2.jsx";

// export const CreateStudentForm = ({ onSuccess, onCancel, selectedSchoolId, selectedCenterId }) => {
//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext
//   } = useContext(DistrictBlockSschoolContextV2);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [formData, setFormData] = useState({
//     // Personal Information
//     studentSrn: "",
//     rollNumber: "",
//     firstName: "",
//     lastName: null,
//     fatherName: "",
//     motherName: "",
//     personalContact: "",
//     ParentContact: "",
//     otherContact: "",
//     dob: "",
//     gender: "",
//     category: "",
//     address: "",
    
//     // Academic Information
//     districtId: "",
//     blockId: "",
//     schoolId: selectedSchoolId || "",
//     classofStudent: "",
//     batch: "",
    
//     // Distance Information
//     singleSideDistance: "",
//     bothSideDistance: "",
    
//     // Other fields that will be sent as null by default
//     email: null,
//     parent: null,
//     medium: null,
//     isStudentOf: "MB",
//     session1: null,
//     session2: null,
//     enrollmentDate: new Date().toISOString().split('T')[0],
//     erpEnrollingDate: new Date().toISOString().split('T')[0],
//     slc: false,
//     isSlcTaken: false,
//     slcReleasingDate: null,
//     isDressGiven: false,
//     isTabGiven: false,
//     tabIMEI: null,
//     isSimGiven: false,
//     simNumber: null,
//     simIMSI: null,
//     shirtSizeInInches: null,
//     waistSizeInInches: null,
//     waistToBottomLengthInInches: null,
//     dressAmountSubmitted: false,
//     dressSizeConfirmationForm: null,
//     bankName: null,
//     bankIFSC: null,
//     bankAccNumber: null,
//     bankHolderName: null,
//     batchCompleted: false,
//     examinationVenue: null,
//   });

//   const [touched, setTouched] = useState({});

//   // Effect to auto-fill district, block, school details from schoolContext
//   useEffect(() => {
//     if (schoolContext) {
//       setFormData(prev => ({
//         ...prev,
//         districtId: schoolContext.districtId || "",
//         blockId: schoolContext.blockId || "",
//         schoolId: schoolContext.schoolId || ""
//       }));
//     }
//   }, [schoolContext]);

//   // Validation rules
//   const validateField = (name, value) => {
//     switch (name) {
//       case "studentSrn":
//         return !value ? "Student SRN is required" : "";
//       case "firstName":
//         return !value ? "First Name is required" : "";
//       case "fatherName":
//         return !value ? "Father's Name is required" : "";
//       case "personalContact":
//         if (!value) return "Personal Contact is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be 10 digits";
//         return "";
//       case "ParentContact":
//         if (!value) return "Parent Contact is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be 10 digits";
//         return "";
//       case "gender":
//         return !value ? "Gender is required" : "";
//       case "classofStudent":
//         return !value ? "Class is required" : "";
//       case "batch":
//         return !value ? "Batch is required" : "";
//       case "otherContact":
//         if (value && !/^\d{10}$/.test(value)) {
//           return "Contact number must be 10 digits";
//         }
//         return "";
//       default:
//         return "";
//     }
//   };

//   const getFieldError = (name) => {
//     if (!touched[name]) return "";
//     return validateField(name, formData[name]);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       "studentSrn", "firstName", "fatherName", 
//       "personalContact", "ParentContact", "gender", 
//       "classofStudent", "batch"
//     ];
    
//     let isValid = true;
//     const newTouched = {};
    
//     requiredFields.forEach(field => {
//       newTouched[field] = true;
//       if (!formData[field]) {
//         isValid = false;
//       }
//     });
    
//     // Also check if school is selected (via schoolContext)
//     if (!schoolContext || !schoolContext.schoolId) {
//       setError("Please select a school");
//       isValid = false;
//     }
    
//     setTouched(prev => ({ ...prev, ...newTouched }));
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setError("Please fill all required fields");
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       // Prepare the data for API
//       const submitData = {
//         ...formData,
//         isBulk: true,
//         // Set enrollment and ERP dates to current date
//         enrollmentDate: new Date().toISOString().split('T')[0],
//         erpEnrollingDate: new Date().toISOString().split('T')[0],
//         // Convert empty strings to null for optional fields
//         rollNumber: formData.rollNumber || null,
//         lastName: null,
//         motherName: formData.motherName || null,
//         otherContact: formData.otherContact || null,
//         dob: formData.dob || null,
//         category: formData.category || null,
//         address: formData.address || null,
//         email: null,
//         parent: null,
//         medium: null,
//         isStudentOf: "MB",
//         session1: null,
//         session2: null,
//         slc: false,
//         isSlcTaken: false,
//         slcReleasingDate: null,
//         isDressGiven: false,
//         isTabGiven: false,
//         tabIMEI: null,
//         isSimGiven: false,
//         simNumber: null,
//         simIMSI: null,
//         shirtSizeInInches: null,
//         waistSizeInInches: null,
//         waistToBottomLengthInInches: null,
//         dressAmountSubmitted: false,
//         dressSizeConfirmationForm: null,
//         bankName: null,
//         bankIFSC: null,
//         bankAccNumber: null,
//         bankHolderName: null,
//         batchCompleted: false,
//         examinationVenue: null,
//         // Convert distance to number if provided
//         singleSideDistance: formData.singleSideDistance ? Number(formData.singleSideDistance) : null,
//         bothSideDistance: formData.bothSideDistance ? Number(formData.bothSideDistance) : null,
//       };
      
//       const result = await CreateStudentAPI(submitData);
      
//       if (result.success) {
//         setSuccess("Student created successfully!");
//         // Reset form
//         setFormData({
//           studentSrn: "",
//           rollNumber: "",
//           firstName: "",
//           lastName: null,
//           fatherName: "",
//           motherName: "",
//           personalContact: "",
//           ParentContact: "",
//           otherContact: "",
//           dob: "",
//           gender: "",
//           category: "",
//           address: "",
//           districtId: "",
//           blockId: "",
//           schoolId: "",
//           classofStudent: "",
//           batch: "",
//           singleSideDistance: "",
//           bothSideDistance: "",
//           email: null,
//           parent: null,
//           medium: null,
//           isStudentOf: "MB",
//           session1: null,
//           session2: null,
//           enrollmentDate: new Date().toISOString().split('T')[0],
//           erpEnrollingDate: new Date().toISOString().split('T')[0],
//           slc: false,
//           isSlcTaken: false,
//           slcReleasingDate: null,
//           isDressGiven: false,
//           isTabGiven: false,
//           tabIMEI: null,
//           isSimGiven: false,
//           simNumber: null,
//           simIMSI: null,
//           shirtSizeInInches: null,
//           waistSizeInInches: null,
//           waistToBottomLengthInInches: null,
//           dressAmountSubmitted: false,
//           dressSizeConfirmationForm: null,
//           bankName: null,
//           bankIFSC: null,
//           bankAccNumber: null,
//           bankHolderName: null,
//           batchCompleted: false,
//           examinationVenue: null,
//         });
//         setTouched({});
        
//         if (onSuccess) {
//           onSuccess(result.data);
//         }
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to create student");
//       }
//     } catch (err) {
//       console.error("Error creating student:", err);
//       setError(err.message || "An error occurred while creating the student");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       studentSrn: "",
//       rollNumber: "",
//       firstName: "",
//       lastName: null,
//       fatherName: "",
//       motherName: "",
//       personalContact: "",
//       ParentContact: "",
//       otherContact: "",
//       dob: "",
//       gender: "",
//       category: "",
//       address: "",
//       districtId: "",
//       blockId: "",
//       schoolId: "",
//       classofStudent: "",
//       batch: "",
//       singleSideDistance: "",
//       bothSideDistance: "",
//       email: null,
//       parent: null,
//       medium: null,
//       isStudentOf: "MB",
//       session1: null,
//       session2: null,
//       enrollmentDate: new Date().toISOString().split('T')[0],
//       erpEnrollingDate: new Date().toISOString().split('T')[0],
//       slc: false,
//       isSlcTaken: false,
//       slcReleasingDate: null,
//       isDressGiven: false,
//       isTabGiven: false,
//       tabIMEI: null,
//       isSimGiven: false,
//       simNumber: null,
//       simIMSI: null,
//       shirtSizeInInches: null,
//       waistSizeInInches: null,
//       waistToBottomLengthInInches: null,
//       dressAmountSubmitted: false,
//       dressSizeConfirmationForm: null,
//       bankName: null,
//       bankIFSC: null,
//       bankAccNumber: null,
//       bankHolderName: null,
//       batchCompleted: false,
//       examinationVenue: null,
//     });
//     setTouched({});
//     setError(null);
//     setSuccess(null);
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={12} xl={10}>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <PersonPlus size={30} className="me-2" />
//                   <h3 className="mb-0">Create New Student</h3>
//                 </div>
//                 {onCancel && (
//                   <Button variant="light" onClick={onCancel} size="sm">
//                     <ArrowLeft className="me-1" /> Back
//                   </Button>
//                 )}
//               </div>
//             </Card.Header>
            
//             <Card.Body className="p-4">
//               {error && (
//                 <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>Error</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}
              
//               {success && (
//                 <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 {/* School Selection Dropdown */}
//                 <School_drop_down />
                
//                 {/* Personal Information Section */}
//                 <h5 className="mb-3 text-primary mt-4">Personal Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Student SRN <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="studentSrn"
//                         value={formData.studentSrn}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("studentSrn")}
//                         placeholder="Enter unique student SRN"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("studentSrn")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Roll Number (Optional)</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="rollNumber"
//                         value={formData.rollNumber}
//                         onChange={handleChange}
//                         placeholder="Enter roll number (optional)"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("firstName")}
//                         placeholder="Enter first name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("firstName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Father's Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="fatherName"
//                         value={formData.fatherName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("fatherName")}
//                         placeholder="Enter father's name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("fatherName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Mother's Name (Optional)</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="motherName"
//                         value={formData.motherName}
//                         onChange={handleChange}
//                         placeholder="Enter mother's name"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Personal Contact <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="personalContact"
//                         value={formData.personalContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("personalContact")}
//                         placeholder="10 digit mobile number"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("personalContact")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Parent Contact <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="ParentContact"
//                         value={formData.ParentContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("ParentContact")}
//                         placeholder="10 digit mobile number"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("ParentContact")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Other Contact (Optional)</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="otherContact"
//                         value={formData.otherContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("otherContact")}
//                         placeholder="Alternate contact number"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("otherContact")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date of Birth</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="dob"
//                         value={formData.dob}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Gender <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("gender")}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("gender")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Category</Form.Label>
//                       <Form.Select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Category</option>
//                         <option value="General">General</option>
//                         <option value="OBC">OBC</option>
//                         <option value="BCA">BCA</option>
//                         <option value="BCB">BCB</option>
//                         <option value="SC">SC</option>
//                         <option value="ST">ST</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={12}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Address</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         placeholder="Enter complete address"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Academic Information Section */}
//                 <h5 className="mb-3 text-primary">Academic Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Class <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="classofStudent"
//                         value={formData.classofStudent}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("classofStudent")}
//                       >
//                         <option value="">Select Class</option>
//                         <option value="9">Class 9</option>
//                         <option value="10">Class 10</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("classofStudent")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Batch <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="batch"
//                         value={formData.batch}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("batch")}
//                       >
//                         <option value="">Select Batch</option>
//                         <option value="2025-27">2025-27</option>
//                         <option value="2026-28">2026-28</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("batch")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Distance Information */}
//                 <h5 className="mb-3 text-primary">Distance Information</h5>
//                 <Row className="mb-4">
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Single Side Distance (km)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="singleSideDistance"
//                         value={formData.singleSideDistance}
//                         onChange={handleChange}
//                         placeholder="Distance in kilometers"
//                         step="0.1"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Both Side Distance (km)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="bothSideDistance"
//                         value={formData.bothSideDistance}
//                         onChange={handleChange}
//                         placeholder="Distance in kilometers"
//                         step="0.1"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Form Actions */}
//                 <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//                   <Button variant="secondary" onClick={handleReset} disabled={loading}>
//                     Reset
//                   </Button>
//                   <Button variant="primary" type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="me-2" />
//                         Create Student
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };



// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
// import { PersonPlus, Save, ArrowLeft, Eye, XCircle } from "react-bootstrap-icons";
// import { CreateStudentFormAPI as CreateStudentAPI, checkSRNAvailability } from "../../service/Student.service.js";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { School_drop_down } from "../Utils/DependentDropDowns.v2.jsx";
// import Region from "../Students/Region.json"

// export const CreateStudentForm = ({ onSuccess, onCancel, selectedSchoolId, selectedCenterId }) => {


//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext
//   } = useContext(DistrictBlockSschoolContextV2);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [showExistingModal, setShowExistingModal] = useState(false);
//   const [existingStudentData, setExistingStudentData] = useState(null);
//   const [checkingSRN, setCheckingSRN] = useState(false);
  
//     console.log(Region)
//   const [formData, setFormData] = useState({
//     // Personal Information
//     studentSrn: "",
//     rollNumber: "",
//     firstName: "",
//     lastName: null,
//     fatherName: "",
//     motherName: "",
//     personalContact: "",
//     ParentContact: "",
//     otherContact: "",
//     dob: "",
//     gender: "",
//     category: "",
//     address: "",
    
//     // Academic Information
//     districtId: "",
//     blockId: "",
//     schoolId: selectedSchoolId || "",
//     classofStudent: "",
//     batch: "",
    
//     // Distance Information
//     singleSideDistance: "",
//     bothSideDistance: "",
    
//     // Other fields that will be sent as null by default
//     email: null,
//     parent: null,
//     medium: null,
//     isStudentOf: "MB",
//     session1: null,
//     session2: null,
//     enrollmentDate: new Date().toISOString().split('T')[0],
//     erpEnrollingDate: new Date().toISOString().split('T')[0],
//     slc: false,
//     isSlcTaken: false,
//     slcReleasingDate: null,
//     isDressGiven: false,
//     isTabGiven: false,
//     tabIMEI: null,
//     isSimGiven: false,
//     simNumber: null,
//     simIMSI: null,
//     shirtSizeInInches: null,
//     waistSizeInInches: null,
//     waistToBottomLengthInInches: null,
//     dressAmountSubmitted: false,
//     dressSizeConfirmationForm: null,
//     bankName: null,
//     bankIFSC: null,
//     bankAccNumber: null,
//     bankHolderName: null,
//     batchCompleted: false,
//     examinationVenue: null,
//   });

//   const [touched, setTouched] = useState({});

//   // Debounce SRN check
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (formData.studentSrn && formData.studentSrn.length === 10 && /^\d{10}$/.test(formData.studentSrn)) {
//         checkSRN(formData.studentSrn);
//       }
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, [formData.studentSrn]);

//   // Effect to auto-fill district, block, school details from schoolContext
//   useEffect(() => {
//     if (schoolContext) {
//       setFormData(prev => ({
//         ...prev,
//         districtId: schoolContext.districtId || "",
//         blockId: schoolContext.blockId || "",
//         schoolId: schoolContext.schoolId || ""
//       }));
//     }
//   }, [schoolContext]);

//   // Check SRN availability
//   const checkSRN = async (srn) => {
//     if (!srn || srn.length !== 10) return;
    
//     setCheckingSRN(true);
//     try {
//       const result = await checkSRNAvailability({ studentSrn: srn });
//       // This endpoint would be called, but we'll handle the 409 response
//     } catch (err) {
//       if (err.status === 409 && err.existingStudent) {
//         setExistingStudentData(err.existingStudent);
//         setShowExistingModal(true);
//       }
//     } finally {
//       setCheckingSRN(false);
//     }
//   };

//   // Validation rules
//   const validateField = (name, value) => {
//     switch (name) {
//       case "studentSrn":
//         if (!value) return "Student SRN is required";
//         if (!/^\d{10}$/.test(value)) return "Student SRN must be exactly 10 digits";
//         return "";
//       case "firstName":
//         return !value ? "First Name is required" : "";
//       case "fatherName":
//         return !value ? "Father's Name is required" : "";
//       case "personalContact":
//         if (!value) return "Personal Contact is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits";
//         return "";
//       case "ParentContact":
//         if (!value) return "Parent Contact is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits";
//         return "";
//       case "otherContact":
//         if (value && !/^\d{10}$/.test(value)) {
//           return "Contact number must be exactly 10 digits";
//         }
//         return "";
//       case "gender":
//         return !value ? "Gender is required" : "";
//       case "classofStudent":
//         return !value ? "Class is required" : "";
//       case "batch":
//         return !value ? "Batch is required" : "";
//       default:
//         return "";
//     }
//   };

//   const getFieldError = (name) => {
//     if (!touched[name]) return "";
//     return validateField(name, formData[name]);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     // For contact fields and SRN, only allow numbers
//     if (name === "personalContact" || name === "ParentContact" || name === "otherContact" || name === "studentSrn") {
//       if (value && !/^\d*$/.test(value)) {
//         return;
//       }
//       // Limit SRN to 10 digits
//       if (name === "studentSrn" && value.length > 10) {
//         return;
//       }
//       // Limit contact numbers to 10 digits
//       if ((name === "personalContact" || name === "ParentContact" || name === "otherContact") && value.length > 10) {
//         return;
//       }
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       "studentSrn", "firstName", "fatherName", 
//       "personalContact", "ParentContact", "gender", 
//       "classofStudent", "batch"
//     ];
    
//     let isValid = true;
//     const newTouched = {};
    
//     requiredFields.forEach(field => {
//       newTouched[field] = true;
//       if (!formData[field]) {
//         isValid = false;
//       }
//     });
    
//     // Validate SRN length
//     if (formData.studentSrn && formData.studentSrn.length !== 10) {
//       setError("Student SRN must be exactly 10 digits");
//       isValid = false;
//     }
    
//     // Also check if school is selected (via schoolContext)
//     if (!schoolContext || !schoolContext.schoolId) {
//       setError("Please select a school");
//       isValid = false;
//     }
    
//     setTouched(prev => ({ ...prev, ...newTouched }));
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setError("Please fill all required fields correctly");
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       // Prepare the data for API
//       const submitData = {
//         ...formData,
//         // Set enrollment and ERP dates to current date
//         enrollmentDate: new Date().toISOString().split('T')[0],
//         erpEnrollingDate: new Date().toISOString().split('T')[0],
//         // Convert empty strings to null for optional fields
//         rollNumber: formData.rollNumber || null,
//         lastName: null,
//         motherName: formData.motherName || null,
//         otherContact: formData.otherContact || null,
//         dob: formData.dob || null,
//         category: formData.category || null,
//         address: formData.address || null,
//         email: null,
//         parent: null,
//         medium: null,
//         isStudentOf: "MB",
//         session1: null,
//         session2: null,
//         slc: false,
//         isSlcTaken: false,
//         slcReleasingDate: null,
//         isDressGiven: false,
//         isTabGiven: false,
//         tabIMEI: null,
//         isSimGiven: false,
//         simNumber: null,
//         simIMSI: null,
//         shirtSizeInInches: null,
//         waistSizeInInches: null,
//         waistToBottomLengthInInches: null,
//         dressAmountSubmitted: false,
//         dressSizeConfirmationForm: null,
//         bankName: null,
//         bankIFSC: null,
//         bankAccNumber: null,
//         bankHolderName: null,
//         batchCompleted: false,
//         examinationVenue: null,
//         // Convert distance to number if provided
//         singleSideDistance: formData.singleSideDistance ? Number(formData.singleSideDistance) : null,
//         bothSideDistance: formData.bothSideDistance ? Number(formData.bothSideDistance) : null,
//       };
      
//       const result = await CreateStudentAPI(submitData);
      
//       if (result.success) {
//         setSuccess("Student created successfully!");
//         // Reset form
//         setFormData({
//           studentSrn: "",
//           rollNumber: "",
//           firstName: "",
//           lastName: null,
//           fatherName: "",
//           motherName: "",
//           personalContact: "",
//           ParentContact: "",
//           otherContact: "",
//           dob: "",
//           gender: "",
//           category: "",
//           address: "",
//           districtId: "",
//           blockId: "",
//           schoolId: "",
//           classofStudent: "",
//           batch: "",
//           singleSideDistance: "",
//           bothSideDistance: "",
//           email: null,
//           parent: null,
//           medium: null,
//           isStudentOf: "MB",
//           session1: null,
//           session2: null,
//           enrollmentDate: new Date().toISOString().split('T')[0],
//           erpEnrollingDate: new Date().toISOString().split('T')[0],
//           slc: false,
//           isSlcTaken: false,
//           slcReleasingDate: null,
//           isDressGiven: false,
//           isTabGiven: false,
//           tabIMEI: null,
//           isSimGiven: false,
//           simNumber: null,
//           simIMSI: null,
//           shirtSizeInInches: null,
//           waistSizeInInches: null,
//           waistToBottomLengthInInches: null,
//           dressAmountSubmitted: false,
//           dressSizeConfirmationForm: null,
//           bankName: null,
//           bankIFSC: null,
//           bankAccNumber: null,
//           bankHolderName: null,
//           batchCompleted: false,
//           examinationVenue: null,
//         });
//         setTouched({});
        
//         if (onSuccess) {
//           onSuccess(result.data);
//         }
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to create student");
//       }
//     } catch (err) {
//       console.error("Error creating student:", err);
      
//       // Check if it's a duplicate SRN error
//       if (err.existingStudent) {
//         setExistingStudentData(err.existingStudent);
//         setShowExistingModal(true);
//         setError(`Student with SRN ${formData.studentSrn} already exists.`);
//       } else {
//         setError(err.message || "An error occurred while creating the student");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       studentSrn: "",
//       rollNumber: "",
//       firstName: "",
//       lastName: null,
//       fatherName: "",
//       motherName: "",
//       personalContact: "",
//       ParentContact: "",
//       otherContact: "",
//       dob: "",
//       gender: "",
//       category: "",
//       address: "",
//       districtId: "",
//       blockId: "",
//       schoolId: "",
//       classofStudent: "",
//       batch: "",
//       singleSideDistance: "",
//       bothSideDistance: "",
//       email: null,
//       parent: null,
//       medium: null,
//       isStudentOf: "MB",
//       session1: null,
//       session2: null,
//       enrollmentDate: new Date().toISOString().split('T')[0],
//       erpEnrollingDate: new Date().toISOString().split('T')[0],
//       slc: false,
//       isSlcTaken: false,
//       slcReleasingDate: null,
//       isDressGiven: false,
//       isTabGiven: false,
//       tabIMEI: null,
//       isSimGiven: false,
//       simNumber: null,
//       simIMSI: null,
//       shirtSizeInInches: null,
//       waistSizeInInches: null,
//       waistToBottomLengthInInches: null,
//       dressAmountSubmitted: false,
//       dressSizeConfirmationForm: null,
//       bankName: null,
//       bankIFSC: null,
//       bankAccNumber: null,
//       bankHolderName: null,
//       batchCompleted: false,
//       examinationVenue: null,
//     });
//     setTouched({});
//     setError(null);
//     setSuccess(null);
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={12} xl={10}>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <PersonPlus size={30} className="me-2" />
//                   <h3 className="mb-0">Create New Student</h3>
//                 </div>
//                 {onCancel && (
//                   <Button variant="light" onClick={onCancel} size="sm">
//                     <ArrowLeft className="me-1" /> Back
//                   </Button>
//                 )}
//               </div>
//             </Card.Header>
            
//             <Card.Body className="p-4">
//               {error && (
//                 <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>Error</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}
              
//               {success && (
//                 <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}
              
//               {checkingSRN && (
//                 <Alert variant="info" className="mb-4">
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Checking SRN availability...
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 {/* School Selection Dropdown */}
//                 <School_drop_down />
                
//                 {/* Personal Information Section */}
//                 <h5 className="mb-3 text-primary mt-4">Personal Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Student SRN <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="studentSrn"
//                         value={formData.studentSrn}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("studentSrn")}
//                         placeholder="Enter 10 digit SRN"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("studentSrn")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Roll Number (Optional)</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="rollNumber"
//                         value={formData.rollNumber}
//                         onChange={handleChange}
//                         placeholder="Enter roll number (optional)"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("firstName")}
//                         placeholder="Enter first name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("firstName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Father's Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="fatherName"
//                         value={formData.fatherName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("fatherName")}
//                         placeholder="Enter father's name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("fatherName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Mother's Name (Optional)</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="motherName"
//                         value={formData.motherName}
//                         onChange={handleChange}
//                         placeholder="Enter mother's name"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Personal Contact <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="personalContact"
//                         value={formData.personalContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("personalContact")}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("personalContact")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Parent Contact <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="ParentContact"
//                         value={formData.ParentContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("ParentContact")}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("ParentContact")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Other Contact (Optional - 10 digits)</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="otherContact"
//                         value={formData.otherContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("otherContact")}
//                         placeholder="Alternate contact number"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("otherContact")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits if provided (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date of Birth</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="dob"
//                         value={formData.dob}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Gender <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("gender")}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("gender")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Category</Form.Label>
//                       <Form.Select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Category</option>
//                         <option value="General">General</option>
//                         <option value="OBC">OBC</option>
//                         <option value="BCA">BCA</option>
//                         <option value="BCB">BCB</option>
//                         <option value="SC">SC</option>
//                         <option value="ST">ST</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={12}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Address</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         placeholder="Enter complete address"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Academic Information Section */}
//                 <h5 className="mb-3 text-primary">Academic Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Class <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="classofStudent"
//                         value={formData.classofStudent}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("classofStudent")}
//                       >
//                         <option value="">Select Class</option>
//                         <option value="9">Class 9</option>
//                         <option value="10">Class 10</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("classofStudent")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Batch <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="batch"
//                         value={formData.batch}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("batch")}
//                       >
//                         <option value="">Select Batch</option>
//                         <option value="2025-27">2025-27</option>
//                         <option value="2026-28">2026-28</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("batch")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Distance Information */}
//                 <h5 className="mb-3 text-primary">Distance Information</h5>
//                 <Row className="mb-4">
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Single Side Distance (km)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="singleSideDistance"
//                         value={formData.singleSideDistance}
//                         onChange={handleChange}
//                         placeholder="Distance in kilometers"
//                         step="0.1"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Both Side Distance (km)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="bothSideDistance"
//                         value={formData.bothSideDistance}
//                         onChange={handleChange}
//                         placeholder="Distance in kilometers"
//                         step="0.1"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Form Actions */}
//                 <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//                   <Button variant="secondary" onClick={handleReset} disabled={loading}>
//                     Reset
//                   </Button>
//                   <Button variant="primary" type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="me-2" />
//                         Create Student
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Modal for Existing Student */}
//       <Modal show={showExistingModal} onHide={() => setShowExistingModal(false)} size="lg">
//         <Modal.Header closeButton className="bg-warning">
//           <Modal.Title>
//             <XCircle className="me-2" />
//             Student Already Exists
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="warning">
//             A student with SRN <strong>{existingStudentData?.studentSrn}</strong> already exists in the system.
//           </Alert>
          
//           <h6 className="mb-3">Existing Student Details:</h6>
//           <Card className="border">
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Student SRN:</strong> {existingStudentData?.studentSrn}</p>
//                   <p><strong>Name:</strong> {existingStudentData?.firstName} {existingStudentData?.lastName || ''}</p>
//                   <p><strong>Father's Name:</strong> {existingStudentData?.fatherName || 'N/A'}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>District:</strong> {existingStudentData?.districtName}</p>
//                   <p><strong>School:</strong> {existingStudentData?.schoolName}</p>
//                   <p><strong>Class:</strong> {existingStudentData?.classofStudent}</p>
//                   <p><strong>Batch:</strong> {existingStudentData?.batch}</p>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowExistingModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => {
//             setShowExistingModal(false);
//             // Focus on SRN field for new entry
//             document.getElementById('studentSrn')?.focus();
//           }}>
//             Try Different SRN
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };





// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
// import { PersonPlus, Save, ArrowLeft, Eye, XCircle } from "react-bootstrap-icons";
// import { CreateStudentFormAPI as CreateStudentAPI, checkSRNAvailability } from "../../service/Student.service.js";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { School_drop_down } from "../Utils/DependentDropDowns.v2.jsx";
// import Region from "../Students/Region.json"

// export const CreateStudentForm = ({ onSuccess, onCancel, selectedSchoolId, selectedCenterId }) => {

//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext
//   } = useContext(DistrictBlockSschoolContextV2);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [showExistingModal, setShowExistingModal] = useState(false);
//   const [existingStudentData, setExistingStudentData] = useState(null);
//   const [checkingSRN, setCheckingSRN] = useState(false);
  
//   // Create lookup maps from Region data
//   const schoolLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.schoolId) {
//         map.set(item.schoolId, {
//           schoolName: item.schoolName,
//           districtId: item.districtId,
//           districtName: item.districtName,
//           blockId: item.blockId,
//           blockName: item.blockName
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   const districtLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.districtId && !map.has(item.districtId)) {
//         map.set(item.districtId, {
//           districtName: item.districtName
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   const blockLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.blockId && !map.has(item.blockId)) {
//         map.set(item.blockId, {
//           blockName: item.blockName,
//           districtId: item.districtId
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   // Helper function to get school details from Region data
//   const getSchoolDetailsFromRegion = (schoolId, districtId, blockId) => {
//     // First try to find by schoolId
//     if (schoolId && schoolLookupMap.has(schoolId)) {
//       const schoolData = schoolLookupMap.get(schoolId);
//       return {
//         schoolName: schoolData.schoolName || 'N/A',
//         districtName: schoolData.districtName || 'N/A',
//         blockName: schoolData.blockName || 'N/A'
//       };
//     }
    
//     // If not found by schoolId, try by districtId and blockId
//     if (districtId && blockId) {
//       const matchingSchool = Region.find(item => 
//         item.districtId === districtId && item.blockId === blockId
//       );
//       if (matchingSchool) {
//         return {
//           schoolName: matchingSchool.schoolName || 'N/A',
//           districtName: matchingSchool.districtName || 'N/A',
//           blockName: matchingSchool.blockName || 'N/A'
//         };
//       }
//     }
    
//     // If still not found, try by districtId only
//     if (districtId && districtLookupMap.has(districtId)) {
//       return {
//         schoolName: 'N/A',
//         districtName: districtLookupMap.get(districtId).districtName,
//         blockName: blockId && blockLookupMap.has(blockId) ? blockLookupMap.get(blockId).blockName : 'N/A'
//       };
//     }
    
//     return {
//       schoolName: 'N/A',
//       districtName: 'N/A',
//       blockName: 'N/A'
//     };
//   };

//   const [formData, setFormData] = useState({
//     // Personal Information
//     studentSrn: "",
//     rollNumber: "",
//     firstName: "",
//     lastName: null,
//     fatherName: "",
//     motherName: "",
//     personalContact: "",
//     ParentContact: "",
//     otherContact: "",
//     dob: "",
//     gender: "",
//     category: "",
//     address: "",
    
//     // Academic Information
//     districtId: "",
//     blockId: "",
//     schoolId: selectedSchoolId || "",
//     classofStudent: "",
//     batch: "",
    
//     // Distance Information
//     singleSideDistance: "",
//     bothSideDistance: "",
    
//     // Other fields that will be sent as null by default
//     email: null,
//     parent: null,
//     medium: null,
//     isStudentOf: "MB",
//     session1: null,
//     session2: null,
//     enrollmentDate: new Date().toISOString().split('T')[0],
//     erpEnrollingDate: new Date().toISOString().split('T')[0],
//     slc: false,
//     isSlcTaken: false,
//     slcReleasingDate: null,
//     isDressGiven: false,
//     isTabGiven: false,
//     tabIMEI: null,
//     isSimGiven: false,
//     simNumber: null,
//     simIMSI: null,
//     shirtSizeInInches: null,
//     waistSizeInInches: null,
//     waistToBottomLengthInInches: null,
//     dressAmountSubmitted: false,
//     dressSizeConfirmationForm: null,
//     bankName: null,
//     bankIFSC: null,
//     bankAccNumber: null,
//     bankHolderName: null,
//     batchCompleted: false,
//     examinationVenue: null,
//   });

//   const [touched, setTouched] = useState({});

//   // Debounce SRN check
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (formData.studentSrn && formData.studentSrn.length === 10 && /^\d{10}$/.test(formData.studentSrn)) {
//         checkSRN(formData.studentSrn);
//       }
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, [formData.studentSrn]);

//   // Effect to auto-fill district, block, school details from schoolContext
//   useEffect(() => {
//     if (schoolContext) {
//       setFormData(prev => ({
//         ...prev,
//         districtId: schoolContext.districtId || "",
//         blockId: schoolContext.blockId || "",
//         schoolId: schoolContext.schoolId || ""
//       }));
//     }
//   }, [schoolContext]);

//   // Check SRN availability
//   const checkSRN = async (srn) => {
//     if (!srn || srn.length !== 10) return;
    
//     setCheckingSRN(true);
//     try {
//       const result = await checkSRNAvailability({ studentSrn: srn });
//     } catch (err) {
//       if (err.status === 409 && err.existingStudent) {
//         // Enhance existing student data with names from Region
//         const enhancedStudent = {
//           ...err.existingStudent,
//           ...getSchoolDetailsFromRegion(
//             err.existingStudent.schoolId,
//             err.existingStudent.districtId,
//             err.existingStudent.blockId
//           )
//         };
//         setExistingStudentData(enhancedStudent);
//         setShowExistingModal(true);
//       }
//     } finally {
//       setCheckingSRN(false);
//     }
//   };

//   // Validation rules
//   const validateField = (name, value) => {
//     switch (name) {
//       case "studentSrn":
//         if (!value) return "Student SRN is required";
//         if (!/^\d{10}$/.test(value)) return "Student SRN must be exactly 10 digits";
//         return "";
//       case "firstName":
//         return !value ? "First Name is required" : "";
//       case "fatherName":
//         return !value ? "Father's Name is required" : "";
//       case "personalContact":
//         if (!value) return "Personal Contact is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits";
//         return "";
//       case "ParentContact":
//         if (!value) return "Parent Contact is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits";
//         return "";
//       case "otherContact":
//         if (value && !/^\d{10}$/.test(value)) {
//           return "Contact number must be exactly 10 digits";
//         }
//         return "";
//       case "gender":
//         return !value ? "Gender is required" : "";
//       case "classofStudent":
//         return !value ? "Class is required" : "";
//       case "batch":
//         return !value ? "Batch is required" : "";
//       default:
//         return "";
//     }
//   };

//   const getFieldError = (name) => {
//     if (!touched[name]) return "";
//     return validateField(name, formData[name]);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     // For contact fields and SRN, only allow numbers
//     if (name === "personalContact" || name === "ParentContact" || name === "otherContact" || name === "studentSrn") {
//       if (value && !/^\d*$/.test(value)) {
//         return;
//       }
//       // Limit SRN to 10 digits
//       if (name === "studentSrn" && value.length > 10) {
//         return;
//       }
//       // Limit contact numbers to 10 digits
//       if ((name === "personalContact" || name === "ParentContact" || name === "otherContact") && value.length > 10) {
//         return;
//       }
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       "studentSrn", "firstName", "fatherName", 
//       "personalContact", "ParentContact", "gender", 
//       "classofStudent", "batch"
//     ];
    
//     let isValid = true;
//     const newTouched = {};
    
//     requiredFields.forEach(field => {
//       newTouched[field] = true;
//       if (!formData[field]) {
//         isValid = false;
//       }
//     });
    
//     // Validate SRN length
//     if (formData.studentSrn && formData.studentSrn.length !== 10) {
//       setError("Student SRN must be exactly 10 digits");
//       isValid = false;
//     }
    
//     // Also check if school is selected (via schoolContext)
//     if (!schoolContext || !schoolContext.schoolId) {
//       setError("Please select a school");
//       isValid = false;
//     }
    
//     setTouched(prev => ({ ...prev, ...newTouched }));
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setError("Please fill all required fields correctly");
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       // Prepare the data for API
//       const submitData = {
//         ...formData,
//         // Set enrollment and ERP dates to current date
//         enrollmentDate: new Date().toISOString().split('T')[0],
//         erpEnrollingDate: new Date().toISOString().split('T')[0],
//         // Convert empty strings to null for optional fields
//         rollNumber: formData.rollNumber || null,
//         lastName: null,
//         motherName: formData.motherName || null,
//         otherContact: formData.otherContact || null,
//         dob: formData.dob || null,
//         category: formData.category || null,
//         address: formData.address || null,
//         email: null,
//         parent: null,
//         medium: null,
//         isStudentOf: "MB",
//         session1: null,
//         session2: null,
//         slc: false,
//         isSlcTaken: false,
//         slcReleasingDate: null,
//         isDressGiven: false,
//         isTabGiven: false,
//         tabIMEI: null,
//         isSimGiven: false,
//         simNumber: null,
//         simIMSI: null,
//         shirtSizeInInches: null,
//         waistSizeInInches: null,
//         waistToBottomLengthInInches: null,
//         dressAmountSubmitted: false,
//         dressSizeConfirmationForm: null,
//         bankName: null,
//         bankIFSC: null,
//         bankAccNumber: null,
//         bankHolderName: null,
//         batchCompleted: false,
//         examinationVenue: null,
//         // Convert distance to number if provided
//         singleSideDistance: formData.singleSideDistance ? Number(formData.singleSideDistance) : null,
//         bothSideDistance: formData.bothSideDistance ? Number(formData.bothSideDistance) : null,
//       };
      
//       const result = await CreateStudentAPI(submitData);
      
//       if (result.success) {
//         setSuccess("Student created successfully!");
//         // Reset form
//         setFormData({
//           studentSrn: "",
//           rollNumber: "",
//           firstName: "",
//           lastName: null,
//           fatherName: "",
//           motherName: "",
//           personalContact: "",
//           ParentContact: "",
//           otherContact: "",
//           dob: "",
//           gender: "",
//           category: "",
//           address: "",
//           districtId: "",
//           blockId: "",
//           schoolId: "",
//           classofStudent: "",
//           batch: "",
//           singleSideDistance: "",
//           bothSideDistance: "",
//           email: null,
//           parent: null,
//           medium: null,
//           isStudentOf: "MB",
//           session1: null,
//           session2: null,
//           enrollmentDate: new Date().toISOString().split('T')[0],
//           erpEnrollingDate: new Date().toISOString().split('T')[0],
//           slc: false,
//           isSlcTaken: false,
//           slcReleasingDate: null,
//           isDressGiven: false,
//           isTabGiven: false,
//           tabIMEI: null,
//           isSimGiven: false,
//           simNumber: null,
//           simIMSI: null,
//           shirtSizeInInches: null,
//           waistSizeInInches: null,
//           waistToBottomLengthInInches: null,
//           dressAmountSubmitted: false,
//           dressSizeConfirmationForm: null,
//           bankName: null,
//           bankIFSC: null,
//           bankAccNumber: null,
//           bankHolderName: null,
//           batchCompleted: false,
//           examinationVenue: null,
//         });
//         setTouched({});
        
//         if (onSuccess) {
//           onSuccess(result.data);
//         }
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to create student");
//       }
//     } catch (err) {
//       console.error("Error creating student:", err);
      
//       // Check if it's a duplicate SRN error
//       if (err.existingStudent) {
//         // Enhance existing student data with names from Region
//         const enhancedStudent = {
//           ...err.existingStudent,
//           ...getSchoolDetailsFromRegion(
//             err.existingStudent.schoolId,
//             err.existingStudent.districtId,
//             err.existingStudent.blockId
//           )
//         };
//         setExistingStudentData(enhancedStudent);
//         setShowExistingModal(true);
//         setError(`Student with SRN ${formData.studentSrn} already exists.`);
//       } else {
//         setError(err.message || "An error occurred while creating the student");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       studentSrn: "",
//       rollNumber: "",
//       firstName: "",
//       lastName: null,
//       fatherName: "",
//       motherName: "",
//       personalContact: "",
//       ParentContact: "",
//       otherContact: "",
//       dob: "",
//       gender: "",
//       category: "",
//       address: "",
//       districtId: "",
//       blockId: "",
//       schoolId: "",
//       classofStudent: "",
//       batch: "",
//       singleSideDistance: "",
//       bothSideDistance: "",
//       email: null,
//       parent: null,
//       medium: null,
//       isStudentOf: "MB",
//       session1: null,
//       session2: null,
//       enrollmentDate: new Date().toISOString().split('T')[0],
//       erpEnrollingDate: new Date().toISOString().split('T')[0],
//       slc: false,
//       isSlcTaken: false,
//       slcReleasingDate: null,
//       isDressGiven: false,
//       isTabGiven: false,
//       tabIMEI: null,
//       isSimGiven: false,
//       simNumber: null,
//       simIMSI: null,
//       shirtSizeInInches: null,
//       waistSizeInInches: null,
//       waistToBottomLengthInInches: null,
//       dressAmountSubmitted: false,
//       dressSizeConfirmationForm: null,
//       bankName: null,
//       bankIFSC: null,
//       bankAccNumber: null,
//       bankHolderName: null,
//       batchCompleted: false,
//       examinationVenue: null,
//     });
//     setTouched({});
//     setError(null);
//     setSuccess(null);
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={12} xl={10}>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <PersonPlus size={30} className="me-2" />
//                   <h3 className="mb-0">Create New Student</h3>
//                 </div>
//                 {onCancel && (
//                   <Button variant="light" onClick={onCancel} size="sm">
//                     <ArrowLeft className="me-1" /> Back
//                   </Button>
//                 )}
//               </div>
//             </Card.Header>
            
//             <Card.Body className="p-4">
//               {error && (
//                 <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>Error</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}
              
//               {success && (
//                 <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}
              
//               {checkingSRN && (
//                 <Alert variant="info" className="mb-4">
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Checking SRN availability...
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 {/* School Selection Dropdown */}
//                 <School_drop_down />
                
//                 {/* Personal Information Section */}
//                 <h5 className="mb-3 text-primary mt-4">Personal Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Student SRN <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="studentSrn"
//                         value={formData.studentSrn}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("studentSrn")}
//                         placeholder="Enter 10 digit SRN"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("studentSrn")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Roll Number (Optional)</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="rollNumber"
//                         value={formData.rollNumber}
//                         onChange={handleChange}
//                         placeholder="Enter roll number (optional)"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("firstName")}
//                         placeholder="Enter first name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("firstName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Father's Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="fatherName"
//                         value={formData.fatherName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("fatherName")}
//                         placeholder="Enter father's name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("fatherName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Mother's Name (Optional)</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="motherName"
//                         value={formData.motherName}
//                         onChange={handleChange}
//                         placeholder="Enter mother's name"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Personal Contact <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="personalContact"
//                         value={formData.personalContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("personalContact")}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("personalContact")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Parent Contact <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="ParentContact"
//                         value={formData.ParentContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("ParentContact")}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("ParentContact")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Other Contact (Optional - 10 digits)</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="otherContact"
//                         value={formData.otherContact}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("otherContact")}
//                         placeholder="Alternate contact number"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("otherContact")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits if provided (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date of Birth</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="dob"
//                         value={formData.dob}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Gender <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("gender")}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("gender")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Category</Form.Label>
//                       <Form.Select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Category</option>
//                         <option value="General">General</option>
//                         <option value="OBC">OBC</option>
//                         <option value="BCA">BCA</option>
//                         <option value="BCB">BCB</option>
//                         <option value="SC">SC</option>
//                         <option value="ST">ST</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={12}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Address</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         placeholder="Enter complete address"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Academic Information Section */}
//                 <h5 className="mb-3 text-primary">Academic Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Class <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="classofStudent"
//                         value={formData.classofStudent}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("classofStudent")}
//                       >
//                         <option value="">Select Class</option>
//                         <option value="9">Class 9</option>
//                         <option value="10">Class 10</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("classofStudent")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Batch <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="batch"
//                         value={formData.batch}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("batch")}
//                       >
//                         <option value="">Select Batch</option>
//                         <option value="2025-27">2025-27</option>
//                         <option value="2026-28">2026-28</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("batch")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Distance Information */}
//                 <h5 className="mb-3 text-primary">Distance Information</h5>
//                 <Row className="mb-4">
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Single Side Distance (km)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="singleSideDistance"
//                         value={formData.singleSideDistance}
//                         onChange={handleChange}
//                         placeholder="Distance in kilometers"
//                         step="0.1"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Both Side Distance (km)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="bothSideDistance"
//                         value={formData.bothSideDistance}
//                         onChange={handleChange}
//                         placeholder="Distance in kilometers"
//                         step="0.1"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Form Actions */}
//                 <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//                   <Button variant="secondary" onClick={handleReset} disabled={loading}>
//                     Reset
//                   </Button>
//                   <Button variant="primary" type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="me-2" />
//                         Create Student
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Modal for Existing Student */}
//       <Modal show={showExistingModal} onHide={() => setShowExistingModal(false)} size="lg">
//         <Modal.Header closeButton className="bg-warning">
//           <Modal.Title>
//             <XCircle className="me-2" />
//             Student Already Exists
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="warning">
//             A student with SRN <strong>{existingStudentData?.studentSrn}</strong> already exists in the system.
//           </Alert>
          
//           <h6 className="mb-3">Existing Student Details:</h6>
//           <Card className="border">
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Student SRN:</strong> {existingStudentData?.studentSrn}</p>
//                   <p><strong>Name:</strong> {existingStudentData?.firstName} {existingStudentData?.lastName || ''}</p>
//                   <p><strong>Father's Name:</strong> {existingStudentData?.fatherName || 'N/A'}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>District:</strong> {existingStudentData?.districtName || 'N/A'}</p>
//                   <p><strong>School:</strong> {existingStudentData?.schoolName || 'N/A'}</p>
//                   <p><strong>Class:</strong> {existingStudentData?.classofStudent}</p>
//                   <p><strong>Batch:</strong> {existingStudentData?.batch}</p>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowExistingModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => {
//             setShowExistingModal(false);
//             // Focus on SRN field for new entry
//             const srnField = document.querySelector('input[name="studentSrn"]');
//             if (srnField) srnField.focus();
//           }}>
//             Try Different SRN
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };




// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
// import { PersonPlus, Save, ArrowLeft, XCircle } from "react-bootstrap-icons";
// import { CreateStudentFormAPI as CreateStudentAPI, checkSRNAvailability } from "../../service/Student.service.js";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { School_drop_down } from "../Utils/DependentDropDowns.v2.jsx";
// import Region from "../Students/Region.json"

// export const CreateStudentForm = ({ onSuccess, onCancel, selectedSchoolId, selectedCenterId }) => {

//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext
//   } = useContext(DistrictBlockSschoolContextV2);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [showExistingModal, setShowExistingModal] = useState(false);
//   const [existingStudentData, setExistingStudentData] = useState(null);
//   const [checkingSRN, setCheckingSRN] = useState(false);
  
//   // Create lookup maps from Region data
//   const schoolLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.schoolId) {
//         map.set(item.schoolId, {
//           schoolName: item.schoolName,
//           districtId: item.districtId,
//           districtName: item.districtName,
//           blockId: item.blockId,
//           blockName: item.blockName
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   const districtLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.districtId && !map.has(item.districtId)) {
//         map.set(item.districtId, {
//           districtName: item.districtName
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   // Helper function to get school details from Region data
//   const getSchoolDetailsFromRegion = (schoolId, districtId, blockId) => {
//     // First try to find by schoolId
//     if (schoolId && schoolLookupMap.has(schoolId)) {
//       const schoolData = schoolLookupMap.get(schoolId);
//       return {
//         schoolName: schoolData.schoolName || 'N/A',
//         districtName: schoolData.districtName || 'N/A',
//         blockName: schoolData.blockName || 'N/A'
//       };
//     }
    
//     // If not found by schoolId, try by districtId and blockId
//     if (districtId && blockId) {
//       const matchingSchool = Region.find(item => 
//         item.districtId === districtId && item.blockId === blockId
//       );
//       if (matchingSchool) {
//         return {
//           schoolName: matchingSchool.schoolName || 'N/A',
//           districtName: matchingSchool.districtName || 'N/A',
//           blockName: matchingSchool.blockName || 'N/A'
//         };
//       }
//     }
    
//     // If still not found, try by districtId only
//     if (districtId && districtLookupMap.has(districtId)) {
//       return {
//         schoolName: 'N/A',
//         districtName: districtLookupMap.get(districtId).districtName,
//         blockName: 'N/A'
//       };
//     }
    
//     return {
//       schoolName: 'N/A',
//       districtName: 'N/A',
//       blockName: 'N/A'
//     };
//   };

//   // Get class based on batch
//   const getClassFromBatch = (batch) => {
//     if (batch === '2025-27') return '10';
//     if (batch === '2026-28') return '9';
//     return '';
//   };

//   const [formData, setFormData] = useState({
//     // Personal Information
//     studentSrn: "",
//     firstName: "",
//     fatherName: "",
//     motherName: "",
//     personalContact: "",
//     ParentContact: "",
//     dob: "",
//     gender: "",
//     address: null,
    
//     // Academic Information
//     districtId: "",
//     blockId: "",
//     schoolId: selectedSchoolId || "",
//     batch: "",
//     classofStudent: "",
    
//     // Other fields that will be sent as null by default
//     rollNumber: null,
//     lastName: null,
//     otherContact: null,
//     category: null,
//     email: null,
//     parent: null,
//     medium: null,
//     isStudentOf: "MB",
//     session1: null,
//     session2: null,
//     enrollmentDate: new Date().toISOString().split('T')[0],
//     erpEnrollingDate: new Date().toISOString().split('T')[0],
//     slc: true,
//     isSlcTaken: false,
//     slcReleasingDate: null,
//     isDressGiven: false,
//     isTabGiven: false,
//     tabIMEI: null,
//     isSimGiven: false,
//     simNumber: null,
//     simIMSI: null,
//     shirtSizeInInches: null,
//     waistSizeInInches: null,
//     waistToBottomLengthInInches: null,
//     dressAmountSubmitted: false,
//     dressSizeConfirmationForm: null,
//     bankName: null,
//     bankIFSC: null,
//     bankAccNumber: null,
//     bankHolderName: null,
//     batchCompleted: false,
//     examinationVenue: null,
//     singleSideDistance: null,
//     bothSideDistance: null,
//   });

//   const [touched, setTouched] = useState({});

//   // Update class when batch changes
//   useEffect(() => {
//     if (formData.batch) {
//       const className = getClassFromBatch(formData.batch);
//       setFormData(prev => ({
//         ...prev,
//         classofStudent: className
//       }));
//     }
//   }, [formData.batch]);

//   // Debounce SRN check
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (formData.studentSrn && formData.studentSrn.length === 10 && /^\d{10}$/.test(formData.studentSrn)) {
//         checkSRN(formData.studentSrn);
//       }
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, [formData.studentSrn]);

//   // Effect to auto-fill district, block, school details from schoolContext
//   useEffect(() => {
//     if (schoolContext) {
//       setFormData(prev => ({
//         ...prev,
//         districtId: schoolContext.districtId || "",
//         blockId: schoolContext.blockId || "",
//         schoolId: schoolContext.schoolId || ""
//       }));
//     }
//   }, [schoolContext]);

//   // Check SRN availability
//   const checkSRN = async (srn) => {
//     if (!srn || srn.length !== 10) return;
    
//     setCheckingSRN(true);
//     try {
//       const result = await checkSRNAvailability({ studentSrn: srn });
//     } catch (err) {
//       if (err.status === 409 && err.existingStudent) {
//         const enhancedStudent = {
//           ...err.existingStudent,
//           ...getSchoolDetailsFromRegion(
//             err.existingStudent.schoolId,
//             err.existingStudent.districtId,
//             err.existingStudent.blockId
//           )
//         };
//         setExistingStudentData(enhancedStudent);
//         setShowExistingModal(true);
//       }
//     } finally {
//       setCheckingSRN(false);
//     }
//   };

//   // Validation rules
//   const validateField = (name, value) => {
//     switch (name) {
//       case "studentSrn":
//         if (!value) return "Student SRN is required";
//         if (!/^\d{10}$/.test(value)) return "Student SRN must be exactly 10 digits";
//         return "";
//       case "firstName":
//         return !value ? "First Name is required" : "";
//       case "fatherName":
//         return !value ? "Father's Name is required" : "";
//       case "gender":
//         return !value ? "Gender is required" : "";
//       case "batch":
//         return !value ? "Batch is required" : "";
//       default:
//         return "";
//     }
//   };

//   const getFieldError = (name) => {
//     if (!touched[name]) return "";
//     return validateField(name, formData[name]);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     // For SRN field, only allow numbers
//     if (name === "studentSrn") {
//       if (value && !/^\d*$/.test(value)) {
//         return;
//       }
//       if (value.length > 10) {
//         return;
//       }
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       "studentSrn", "firstName", "fatherName", "gender", "batch"
//     ];
    
//     let isValid = true;
//     const newTouched = {};
    
//     requiredFields.forEach(field => {
//       newTouched[field] = true;
//       if (!formData[field]) {
//         isValid = false;
//       }
//     });
    
//     // Validate SRN length
//     if (formData.studentSrn && formData.studentSrn.length !== 10) {
//       setError("Student SRN must be exactly 10 digits");
//       isValid = false;
//     }
    
//     // Also check if school is selected (via schoolContext)
//     if (!schoolContext || !schoolContext.schoolId) {
//       setError("Please select a school");
//       isValid = false;
//     }
    
//     setTouched(prev => ({ ...prev, ...newTouched }));
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setError("Please fill all required fields correctly");
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       // Prepare the data for API
//       const submitData = {
//         ...formData,
//         // Set enrollment and ERP dates to current date
//         enrollmentDate: new Date().toISOString().split('T')[0],
//         erpEnrollingDate: new Date().toISOString().split('T')[0],
//         // Set SLC fields as boolean
//         slc: true,
//         isSlcTaken: false,
//         // Convert empty strings to null for optional fields
//         rollNumber: null,
//         lastName: null,
//         motherName: formData.motherName || null,
//         otherContact: null,
//         dob: formData.dob || null,
//         category: null,
//         address: null,
//         email: null,
//         parent: null,
//         medium: null,
//         isStudentOf: "MB",
//         session1: null,
//         session2: null,
//         slcReleasingDate: null,
//         isDressGiven: false,
//         isTabGiven: false,
//         tabIMEI: null,
//         isSimGiven: false,
//         simNumber: null,
//         simIMSI: null,
//         shirtSizeInInches: null,
//         waistSizeInInches: null,
//         waistToBottomLengthInInches: null,
//         dressAmountSubmitted: false,
//         dressSizeConfirmationForm: null,
//         bankName: null,
//         bankIFSC: null,
//         bankAccNumber: null,
//         bankHolderName: null,
//         batchCompleted: false,
//         examinationVenue: null,
//         singleSideDistance: null,
//         bothSideDistance: null,
//         personalContact: formData.personalContact || null,
//         ParentContact: formData.ParentContact || null,
//       };
      
//       const result = await CreateStudentAPI(submitData);
      
//       if (result.success) {
//         setSuccess("Student created successfully!");
//         // Reset form
//         setFormData({
//           studentSrn: "",
//           firstName: "",
//           fatherName: "",
//           motherName: "",
//           personalContact: "",
//           ParentContact: "",
//           dob: "",
//           gender: "",
//           address: null,
//           districtId: "",
//           blockId: "",
//           schoolId: "",
//           batch: "",
//           classofStudent: "",
//           rollNumber: null,
//           lastName: null,
//           otherContact: null,
//           category: null,
//           email: null,
//           parent: null,
//           medium: null,
//           isStudentOf: "MB",
//           session1: null,
//           session2: null,
//           enrollmentDate: new Date().toISOString().split('T')[0],
//           erpEnrollingDate: new Date().toISOString().split('T')[0],
//           slc: true,
//           isSlcTaken: false,
//           slcReleasingDate: null,
//           isDressGiven: false,
//           isTabGiven: false,
//           tabIMEI: null,
//           isSimGiven: false,
//           simNumber: null,
//           simIMSI: null,
//           shirtSizeInInches: null,
//           waistSizeInInches: null,
//           waistToBottomLengthInInches: null,
//           dressAmountSubmitted: false,
//           dressSizeConfirmationForm: null,
//           bankName: null,
//           bankIFSC: null,
//           bankAccNumber: null,
//           bankHolderName: null,
//           batchCompleted: false,
//           examinationVenue: null,
//           singleSideDistance: null,
//           bothSideDistance: null,
//         });
//         setTouched({});
        
//         if (onSuccess) {
//           onSuccess(result.data);
//         }
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to create student");
//       }
//     } catch (err) {
//       console.error("Error creating student:", err);
      
//       // Check if it's a duplicate SRN error
//       if (err.existingStudent) {
//         const enhancedStudent = {
//           ...err.existingStudent,
//           ...getSchoolDetailsFromRegion(
//             err.existingStudent.schoolId,
//             err.existingStudent.districtId,
//             err.existingStudent.blockId
//           )
//         };
//         setExistingStudentData(enhancedStudent);
//         setShowExistingModal(true);
//         setError(`Student with SRN ${formData.studentSrn} already exists.`);
//       } else {
//         setError(err.message || "An error occurred while creating the student");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       studentSrn: "",
//       firstName: "",
//       fatherName: "",
//       motherName: "",
//       personalContact: "",
//       ParentContact: "",
//       dob: "",
//       gender: "",
//       address: null,
//       districtId: "",
//       blockId: "",
//       schoolId: "",
//       batch: "",
//       classofStudent: "",
//       rollNumber: null,
//       lastName: null,
//       otherContact: null,
//       category: null,
//       email: null,
//       parent: null,
//       medium: null,
//       isStudentOf: "MB",
//       session1: null,
//       session2: null,
//       enrollmentDate: new Date().toISOString().split('T')[0],
//       erpEnrollingDate: new Date().toISOString().split('T')[0],
//       slc: true,
//       isSlcTaken: false,
//       slcReleasingDate: null,
//       isDressGiven: false,
//       isTabGiven: false,
//       tabIMEI: null,
//       isSimGiven: false,
//       simNumber: null,
//       simIMSI: null,
//       shirtSizeInInches: null,
//       waistSizeInInches: null,
//       waistToBottomLengthInInches: null,
//       dressAmountSubmitted: false,
//       dressSizeConfirmationForm: null,
//       bankName: null,
//       bankIFSC: null,
//       bankAccNumber: null,
//       bankHolderName: null,
//       batchCompleted: false,
//       examinationVenue: null,
//       singleSideDistance: null,
//       bothSideDistance: null,
//     });
//     setTouched({});
//     setError(null);
//     setSuccess(null);
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={12} xl={10}>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <PersonPlus size={30} className="me-2" />
//                   <h3 className="mb-0">Create New Student</h3>
//                 </div>
//                 {onCancel && (
//                   <Button variant="light" onClick={onCancel} size="sm">
//                     <ArrowLeft className="me-1" /> Back
//                   </Button>
//                 )}
//               </div>
//             </Card.Header>
            
//             <Card.Body className="p-4">
//               {error && (
//                 <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>Error</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}
              
//               {success && (
//                 <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}
              
//               {checkingSRN && (
//                 <Alert variant="info" className="mb-4">
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Checking SRN availability...
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 {/* School Selection Dropdown */}
//                 <School_drop_down />
                
//                 {/* Batch Selection */}
//                 <Row className="mb-4">
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Batch <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="batch"
//                         value={formData.batch}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("batch")}
//                       >
//                         <option value="">Select Batch</option>
//                         <option value="2025-27">2025-27 (Class 10)</option>
//                         <option value="2026-28">2026-28 (Class 9)</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("batch")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         {formData.batch === '2025-27' && "This batch will enroll in Class 10"}
//                         {formData.batch === '2026-28' && "This batch will enroll in Class 9"}
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 {/* Personal Information Section */}
//                 <h5 className="mb-3 text-primary">Personal Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Student SRN <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="studentSrn"
//                         value={formData.studentSrn}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("studentSrn")}
//                         placeholder="Enter 10 digit SRN"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("studentSrn")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("firstName")}
//                         placeholder="Enter first name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("firstName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Father's Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="fatherName"
//                         value={formData.fatherName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("fatherName")}
//                         placeholder="Enter father's name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("fatherName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Mother's Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="motherName"
//                         value={formData.motherName}
//                         onChange={handleChange}
//                         placeholder="Enter mother's name"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Personal Contact</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="personalContact"
//                         value={formData.personalContact}
//                         onChange={handleChange}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Text className="text-muted">
//                         Optional - 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Parent Contact</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="ParentContact"
//                         value={formData.ParentContact}
//                         onChange={handleChange}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Text className="text-muted">
//                         Optional - 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date of Birth</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="dob"
//                         value={formData.dob}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Gender <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("gender")}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("gender")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Form Actions */}
//                 <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//                   <Button variant="secondary" onClick={handleReset} disabled={loading}>
//                     Reset
//                   </Button>
//                   <Button variant="primary" type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="me-2" />
//                         Create Student
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Modal for Existing Student */}
//       <Modal show={showExistingModal} onHide={() => setShowExistingModal(false)} size="lg">
//         <Modal.Header closeButton className="bg-warning">
//           <Modal.Title>
//             <XCircle className="me-2" />
//             Student Already Exists
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="warning">
//             A student with SRN <strong>{existingStudentData?.studentSrn}</strong> already exists in the system.
//           </Alert>
          
//           <h6 className="mb-3">Existing Student Details:</h6>
//           <Card className="border">
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Student SRN:</strong> {existingStudentData?.studentSrn}</p>
//                   <p><strong>Name:</strong> {existingStudentData?.firstName} {existingStudentData?.lastName || ''}</p>
//                   <p><strong>Father's Name:</strong> {existingStudentData?.fatherName || 'N/A'}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>District:</strong> {existingStudentData?.districtName || 'N/A'}</p>
//                   <p><strong>School:</strong> {existingStudentData?.schoolName || 'N/A'}</p>
//                   <p><strong>Class:</strong> {existingStudentData?.classofStudent}</p>
//                   <p><strong>Batch:</strong> {existingStudentData?.batch}</p>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowExistingModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => {
//             setShowExistingModal(false);
//             const srnField = document.querySelector('input[name="studentSrn"]');
//             if (srnField) srnField.focus();
//           }}>
//             Try Different SRN
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };




// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
// import { PersonPlus, Save, ArrowLeft, XCircle } from "react-bootstrap-icons";
// import { CreateStudentFormAPI as CreateStudentAPI, checkSRNAvailability } from "../../service/Student.service.js";
// import { UserContext } from "../contextAPIs/User.context.js";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI.js";
// import { School_drop_down } from "../Utils/DependentDropDowns.v2.jsx";
// import Region from "../Students/Region.json"

// export const CreateStudentForm = ({ onSuccess, onCancel, selectedSchoolId, selectedCenterId }) => {

//   const { userData } = useContext(UserContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext
//   } = useContext(DistrictBlockSschoolContextV2);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [showExistingModal, setShowExistingModal] = useState(false);
//   const [existingStudentData, setExistingStudentData] = useState(null);
//   const [checkingSRN, setCheckingSRN] = useState(false);
  
//   // Create lookup maps from Region data
//   const schoolLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.schoolId) {
//         map.set(item.schoolId, {
//           schoolName: item.schoolName,
//           districtId: item.districtId,
//           districtName: item.districtName,
//           blockId: item.blockId,
//           blockName: item.blockName
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   const districtLookupMap = useMemo(() => {
//     const map = new Map();
//     Region.forEach(item => {
//       if (item.districtId && !map.has(item.districtId)) {
//         map.set(item.districtId, {
//           districtName: item.districtName
//         });
//       }
//     });
//     return map;
//   }, [Region]);

//   // Helper function to get school details from Region data
//   const getSchoolDetailsFromRegion = (schoolId, districtId, blockId) => {
//     // First try to find by schoolId
//     if (schoolId && schoolLookupMap.has(schoolId)) {
//       const schoolData = schoolLookupMap.get(schoolId);
//       return {
//         schoolName: schoolData.schoolName || 'N/A',
//         districtName: schoolData.districtName || 'N/A',
//         blockName: schoolData.blockName || 'N/A'
//       };
//     }
    
//     // If not found by schoolId, try by districtId and blockId
//     if (districtId && blockId) {
//       const matchingSchool = Region.find(item => 
//         item.districtId === districtId && item.blockId === blockId
//       );
//       if (matchingSchool) {
//         return {
//           schoolName: matchingSchool.schoolName || 'N/A',
//           districtName: matchingSchool.districtName || 'N/A',
//           blockName: matchingSchool.blockName || 'N/A'
//         };
//       }
//     }
    
//     // If still not found, try by districtId only
//     if (districtId && districtLookupMap.has(districtId)) {
//       return {
//         schoolName: 'N/A',
//         districtName: districtLookupMap.get(districtId).districtName,
//         blockName: 'N/A'
//       };
//     }
    
//     return {
//       schoolName: 'N/A',
//       districtName: 'N/A',
//       blockName: 'N/A'
//     };
//   };

//   // Get class based on batch
//   const getClassFromBatch = (batch) => {
//     if (batch === '2025-27') return '10';
//     if (batch === '2026-28') return '9';
//     return '';
//   };

//   // Store selected batch separately to persist after submit
//   const [selectedBatch, setSelectedBatch] = useState("");

//   const [formData, setFormData] = useState({
//     // Personal Information
//     studentSrn: "",
//     firstName: "",
//     fatherName: "",
//     motherName: "",
//     personalContact: "",
//     ParentContact: "",
//     dob: "",
//     gender: "",
//     address: null,
    
//     // Academic Information
//     districtId: "",
//     blockId: "",
//     schoolId: selectedSchoolId || "",
//     batch: "",
//     classofStudent: "",
    
//     // Other fields that will be sent as null by default
//     rollNumber: null,
//     lastName: null,
//     otherContact: null,
//     category: null,
//     email: null,
//     parent: null,
//     medium: null,
//     isStudentOf: "MB",
//     session1: null,
//     session2: null,
//     enrollmentDate: new Date().toISOString().split('T')[0],
//     erpEnrollingDate: new Date().toISOString().split('T')[0],
//     slc: true,
//     isSlcTaken: false,
//     slcReleasingDate: null,
//     isDressGiven: false,
//     isTabGiven: false,
//     tabIMEI: null,
//     isSimGiven: false,
//     simNumber: null,
//     simIMSI: null,
//     shirtSizeInInches: null,
//     waistSizeInInches: null,
//     waistToBottomLengthInInches: null,
//     dressAmountSubmitted: false,
//     dressSizeConfirmationForm: null,
//     bankName: null,
//     bankIFSC: null,
//     bankAccNumber: null,
//     bankHolderName: null,
//     batchCompleted: false,
//     examinationVenue: null,
//     singleSideDistance: null,
//     bothSideDistance: null,
//   });

//   const [touched, setTouched] = useState({});

//   // Update class when batch changes
//   useEffect(() => {
//     if (formData.batch) {
//       const className = getClassFromBatch(formData.batch);
//       setFormData(prev => ({
//         ...prev,
//         classofStudent: className
//       }));
//     }
//   }, [formData.batch]);

//   // Debounce SRN check
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (formData.studentSrn && formData.studentSrn.length === 10 && /^\d{10}$/.test(formData.studentSrn)) {
//         checkSRN(formData.studentSrn);
//       }
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, [formData.studentSrn]);

//   // Effect to auto-fill district, block, school details from schoolContext
//   useEffect(() => {
//     if (schoolContext) {
//       setFormData(prev => ({
//         ...prev,
//         districtId: schoolContext.districtId || "",
//         blockId: schoolContext.blockId || "",
//         schoolId: schoolContext.schoolId || ""
//       }));
//     }
//   }, [schoolContext]);

//   // Check SRN availability
//   const checkSRN = async (srn) => {
//     if (!srn || srn.length !== 10) return;
    
//     setCheckingSRN(true);
//     try {
//       const result = await checkSRNAvailability({ studentSrn: srn });
//     } catch (err) {
//       if (err.status === 409 && err.existingStudent) {
//         const enhancedStudent = {
//           ...err.existingStudent,
//           ...getSchoolDetailsFromRegion(
//             err.existingStudent.schoolId,
//             err.existingStudent.districtId,
//             err.existingStudent.blockId
//           )
//         };
//         setExistingStudentData(enhancedStudent);
//         setShowExistingModal(true);
//       }
//     } finally {
//       setCheckingSRN(false);
//     }
//   };

//   // Validation rules
//   const validateField = (name, value) => {
//     switch (name) {
//       case "studentSrn":
//         if (!value) return "Student SRN is required";
//         if (!/^\d{10}$/.test(value)) return "Student SRN must be exactly 10 digits";
//         return "";
//       case "firstName":
//         return !value ? "First Name is required" : "";
//       case "fatherName":
//         return !value ? "Father's Name is required" : "";
//       case "gender":
//         return !value ? "Gender is required" : "";
//       case "batch":
//         return !value ? "Batch is required" : "";
//       default:
//         return "";
//     }
//   };

//   const getFieldError = (name) => {
//     if (!touched[name]) return "";
//     return validateField(name, formData[name]);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     // For SRN field, only allow numbers
//     if (name === "studentSrn") {
//       if (value && !/^\d*$/.test(value)) {
//         return;
//       }
//       if (value.length > 10) {
//         return;
//       }
//     }
    
//     // Update batch in both formData and selectedBatch
//     if (name === "batch") {
//       setSelectedBatch(value);
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       "studentSrn", "firstName", "fatherName", "gender", "batch"
//     ];
    
//     let isValid = true;
//     const newTouched = {};
    
//     requiredFields.forEach(field => {
//       newTouched[field] = true;
//       if (!formData[field]) {
//         isValid = false;
//       }
//     });
    
//     // Validate SRN length
//     if (formData.studentSrn && formData.studentSrn.length !== 10) {
//       setError("Student SRN must be exactly 10 digits");
//       isValid = false;
//     }
    
//     // Also check if school is selected (via schoolContext)
//     if (!schoolContext || !schoolContext.schoolId) {
//       setError("Please select a school");
//       isValid = false;
//     }
    
//     setTouched(prev => ({ ...prev, ...newTouched }));
//     return isValid;
//   };

//   const resetForm = () => {
//     // Reset only the form fields, keep school and batch selection
//     setFormData(prev => ({
//       ...prev,
//       studentSrn: "",
//       firstName: "",
//       fatherName: "",
//       motherName: "",
//       personalContact: "",
//       ParentContact: "",
//       dob: "",
//       gender: "",
//       address: null,
//       // Keep districtId, blockId, schoolId, batch, classofStudent as they are
//     }));
//     setTouched({});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setError("Please fill all required fields correctly");
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       // Prepare the data for API
//       const submitData = {
//         ...formData,
//         // Set enrollment and ERP dates to current date
//         enrollmentDate: new Date().toISOString().split('T')[0],
//         erpEnrollingDate: new Date().toISOString().split('T')[0],
//         // Set SLC fields as boolean
//         slc: true,
//         isSlcTaken: false,
//         // Convert empty strings to null for optional fields
//         rollNumber: null,
//         lastName: null,
//         motherName: formData.motherName || null,
//         otherContact: null,
//         dob: formData.dob || null,
//         category: null,
//         address: null,
//         email: null,
//         parent: null,
//         medium: null,
//         isStudentOf: "MB",
//         session1: null,
//         session2: null,
//         slcReleasingDate: null,
//         isDressGiven: false,
//         isTabGiven: false,
//         tabIMEI: null,
//         isSimGiven: false,
//         simNumber: null,
//         simIMSI: null,
//         shirtSizeInInches: null,
//         waistSizeInInches: null,
//         waistToBottomLengthInInches: null,
//         dressAmountSubmitted: false,
//         dressSizeConfirmationForm: null,
//         bankName: null,
//         bankIFSC: null,
//         bankAccNumber: null,
//         bankHolderName: null,
//         batchCompleted: false,
//         examinationVenue: null,
//         singleSideDistance: null,
//         bothSideDistance: null,
//         personalContact: formData.personalContact || null,
//         ParentContact: formData.ParentContact || null,
//       };
      
//       const result = await CreateStudentAPI(submitData);
      
//       if (result.success) {
//         setSuccess("Student created successfully!");
//         // Reset only the filled fields, keep school and batch
//         resetForm();
        
//         if (onSuccess) {
//           onSuccess(result.data);
//         }
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to create student");
//       }
//     } catch (err) {
//       console.error("Error creating student:", err);
      
//       // Check if it's a duplicate SRN error
//       if (err.existingStudent) {
//         const enhancedStudent = {
//           ...err.existingStudent,
//           ...getSchoolDetailsFromRegion(
//             err.existingStudent.schoolId,
//             err.existingStudent.districtId,
//             err.existingStudent.blockId
//           )
//         };
//         setExistingStudentData(enhancedStudent);
//         setShowExistingModal(true);
//         setError(`Student with SRN ${formData.studentSrn} already exists.`);
//       } else {
//         setError(err.message || "An error occurred while creating the student");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       studentSrn: "",
//       firstName: "",
//       fatherName: "",
//       motherName: "",
//       personalContact: "",
//       ParentContact: "",
//       dob: "",
//       gender: "",
//       address: null,
//       districtId: schoolContext?.districtId || "",
//       blockId: schoolContext?.blockId || "",
//       schoolId: schoolContext?.schoolId || "",
//       batch: selectedBatch,
//       classofStudent: selectedBatch ? getClassFromBatch(selectedBatch) : "",
//       rollNumber: null,
//       lastName: null,
//       otherContact: null,
//       category: null,
//       email: null,
//       parent: null,
//       medium: null,
//       isStudentOf: "MB",
//       session1: null,
//       session2: null,
//       enrollmentDate: new Date().toISOString().split('T')[0],
//       erpEnrollingDate: new Date().toISOString().split('T')[0],
//       slc: true,
//       isSlcTaken: false,
//       slcReleasingDate: null,
//       isDressGiven: false,
//       isTabGiven: false,
//       tabIMEI: null,
//       isSimGiven: false,
//       simNumber: null,
//       simIMSI: null,
//       shirtSizeInInches: null,
//       waistSizeInInches: null,
//       waistToBottomLengthInInches: null,
//       dressAmountSubmitted: false,
//       dressSizeConfirmationForm: null,
//       bankName: null,
//       bankIFSC: null,
//       bankAccNumber: null,
//       bankHolderName: null,
//       batchCompleted: false,
//       examinationVenue: null,
//       singleSideDistance: null,
//       bothSideDistance: null,
//     });
//     setSelectedBatch("");
//     setTouched({});
//     setError(null);
//     setSuccess(null);
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="justify-content-center">
//         <Col lg={12} xl={10}>
//           <Card className="shadow-lg border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center">
//                   <PersonPlus size={30} className="me-2" />
//                   <h3 className="mb-0">Create New Student</h3>
//                 </div>
//                 {onCancel && (
//                   <Button variant="light" onClick={onCancel} size="sm">
//                     <ArrowLeft className="me-1" /> Back
//                   </Button>
//                 )}
//               </div>
//             </Card.Header>
            
//             <Card.Body className="p-4">
//               {error && (
//                 <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
//                   <Alert.Heading>Error</Alert.Heading>
//                   <p>{error}</p>
//                 </Alert>
//               )}
              
//               {success && (
//                 <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
//                   <Alert.Heading>Success!</Alert.Heading>
//                   <p>{success}</p>
//                 </Alert>
//               )}
              
//               {checkingSRN && (
//                 <Alert variant="info" className="mb-4">
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Checking SRN availability...
//                 </Alert>
//               )}
              
//               <Form onSubmit={handleSubmit}>
//                 {/* School Selection Dropdown */}
//                 <School_drop_down />
                
//                 {/* Batch Selection */}
//                 <Row className="mb-4">
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Batch <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="batch"
//                         value={formData.batch}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("batch")}
//                       >
//                         <option value="">Select Batch</option>
//                         <option value="2025-27">2025-27 (Class 10)</option>
//                         <option value="2026-28">2026-28 (Class 9)</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("batch")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         {formData.batch === '2025-27' && "This batch will enroll in Class 10"}
//                         {formData.batch === '2026-28' && "This batch will enroll in Class 9"}
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 {/* Personal Information Section */}
//                 <h5 className="mb-3 text-primary">Personal Information</h5>
//                 <Row className="mb-4">
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Student SRN <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="studentSrn"
//                         value={formData.studentSrn}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("studentSrn")}
//                         placeholder="Enter 10 digit SRN"
//                         maxLength={10}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("studentSrn")}
//                       </Form.Control.Feedback>
//                       <Form.Text className="text-muted">
//                         Must be exactly 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("firstName")}
//                         placeholder="Enter first name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("firstName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Father's Name <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="fatherName"
//                         value={formData.fatherName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("fatherName")}
//                         placeholder="Enter father's name"
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("fatherName")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Mother's Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="motherName"
//                         value={formData.motherName}
//                         onChange={handleChange}
//                         placeholder="Enter mother's name"
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Personal Contact</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="personalContact"
//                         value={formData.personalContact}
//                         onChange={handleChange}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Text className="text-muted">
//                         Optional - 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Parent Contact</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="ParentContact"
//                         value={formData.ParentContact}
//                         onChange={handleChange}
//                         placeholder="10 digit mobile number"
//                         maxLength={10}
//                       />
//                       <Form.Text className="text-muted">
//                         Optional - 10 digits (numbers only)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date of Birth</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="dob"
//                         value={formData.dob}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                   </Col>
                  
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Gender <span className="text-danger">* (Mandatory)</span></Form.Label>
//                       <Form.Select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!getFieldError("gender")}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </Form.Select>
//                       <Form.Control.Feedback type="invalid">
//                         {getFieldError("gender")}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Form Actions */}
//                 <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//                   <Button variant="secondary" onClick={handleReset} disabled={loading}>
//                     Reset All
//                   </Button>
//                   <Button variant="primary" type="submit" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" className="me-2" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="me-2" />
//                         Create Student
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Modal for Existing Student */}
//       <Modal show={showExistingModal} onHide={() => setShowExistingModal(false)} size="lg">
//         <Modal.Header closeButton className="bg-warning">
//           <Modal.Title>
//             <XCircle className="me-2" />
//             Student Already Exists
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="warning">
//             A student with SRN <strong>{existingStudentData?.studentSrn}</strong> already exists in the system.
//           </Alert>
          
//           <h6 className="mb-3">Existing Student Details:</h6>
//           <Card className="border">
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Student SRN:</strong> {existingStudentData?.studentSrn}</p>
//                   <p><strong>Name:</strong> {existingStudentData?.firstName} {existingStudentData?.lastName || ''}</p>
//                   <p><strong>Father's Name:</strong> {existingStudentData?.fatherName || 'N/A'}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>District:</strong> {existingStudentData?.districtName || 'N/A'}</p>
//                   <p><strong>School:</strong> {existingStudentData?.schoolName || 'N/A'}</p>
//                   <p><strong>Class:</strong> {existingStudentData?.classofStudent}</p>
//                   <p><strong>Batch:</strong> {existingStudentData?.batch}</p>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowExistingModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => {
//             setShowExistingModal(false);
//             const srnField = document.querySelector('input[name="studentSrn"]');
//             if (srnField) srnField.focus();
//           }}>
//             Try Different SRN
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

















import React, { useState, useEffect, useContext, useMemo } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
import { PersonPlus, Save, ArrowLeft, XCircle, Trash, FileEarmarkCheck } from "react-bootstrap-icons";
import { CreateStudentFormAPI as CreateStudentAPI, checkSRNAvailability } from "../../service/Student.service.js";
import { UserContext } from "../contextAPIs/User.context.js";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI.js";
import { School_drop_down } from "../Utils/DependentDropDowns.v2.jsx";
import Region from "../Students/Region.json"
import { useLocation } from "react-router-dom";

export const CreateStudentForm = ({ onSuccess, onCancel, selectedSchoolId, selectedCenterId }) => {
  const location = useLocation();
  const { userData } = useContext(UserContext);
  
  // Determine CRUD status based on URL
  const getCRUDStatusFromURL = () => {
    const path = location.pathname;
    if (path.includes("remove-student")) return "Removed";
    if (path.includes("slc-release")) return "SLC Released";
    return "Added"; // Default for create-student-form
  };
  
  const [crudStatus, setCrudStatus] = useState(getCRUDStatusFromURL());
  
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext
  } = useContext(DistrictBlockSschoolContextV2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [existingStudentData, setExistingStudentData] = useState(null);
  const [checkingSRN, setCheckingSRN] = useState(false);
  
  // Create lookup maps from Region data
  const schoolLookupMap = useMemo(() => {
    const map = new Map();
    Region.forEach(item => {
      if (item.schoolId) {
        map.set(item.schoolId, {
          schoolName: item.schoolName,
          districtId: item.districtId,
          districtName: item.districtName,
          blockId: item.blockId,
          blockName: item.blockName
        });
      }
    });
    return map;
  }, [Region]);

  const districtLookupMap = useMemo(() => {
    const map = new Map();
    Region.forEach(item => {
      if (item.districtId && !map.has(item.districtId)) {
        map.set(item.districtId, {
          districtName: item.districtName
        });
      }
    });
    return map;
  }, [Region]);

  // Helper function to get school details from Region data
  const getSchoolDetailsFromRegion = (schoolId, districtId, blockId) => {
    if (schoolId && schoolLookupMap.has(schoolId)) {
      const schoolData = schoolLookupMap.get(schoolId);
      return {
        schoolName: schoolData.schoolName || 'N/A',
        districtName: schoolData.districtName || 'N/A',
        blockName: schoolData.blockName || 'N/A'
      };
    }
    
    if (districtId && blockId) {
      const matchingSchool = Region.find(item => 
        item.districtId === districtId && item.blockId === blockId
      );
      if (matchingSchool) {
        return {
          schoolName: matchingSchool.schoolName || 'N/A',
          districtName: matchingSchool.districtName || 'N/A',
          blockName: matchingSchool.blockName || 'N/A'
        };
      }
    }
    
    if (districtId && districtLookupMap.has(districtId)) {
      return {
        schoolName: 'N/A',
        districtName: districtLookupMap.get(districtId).districtName,
        blockName: 'N/A'
      };
    }
    
    return {
      schoolName: 'N/A',
      districtName: 'N/A',
      blockName: 'N/A'
    };
  };

  // Get class based on batch
  const getClassFromBatch = (batch) => {
    if (batch === '2025-27') return '10';
    if (batch === '2026-28') return '9';
    return '';
  };

  const [selectedBatch, setSelectedBatch] = useState("");

  const [formData, setFormData] = useState({
    studentSrn: "",
    firstName: "",
    fatherName: "",
    motherName: "",
    personalContact: "",
    ParentContact: "",
    dob: "",
    gender: "",
    address: null,
    districtId: "",
    blockId: "",
    schoolId: selectedSchoolId || "",
    batch: "",
    classofStudent: "",
    rollNumber: null,
    lastName: null,
    otherContact: null,
    category: null,
    email: null,
    parent: null,
    medium: null,
    isStudentOf: "MB",
    session1: null,
    session2: null,
    enrollmentDate: new Date().toISOString().split('T')[0],
    erpEnrollingDate: new Date().toISOString().split('T')[0],
    slc: true,
    isSlcTaken: false,
    slcReleasingDate: null,
    isDressGiven: false,
    isTabGiven: false,
    tabIMEI: null,
    isSimGiven: false,
    simNumber: null,
    simIMSI: null,
    shirtSizeInInches: null,
    waistSizeInInches: null,
    waistToBottomLengthInInches: null,
    dressAmountSubmitted: false,
    dressSizeConfirmationForm: null,
    bankName: null,
    bankIFSC: null,
    bankAccNumber: null,
    bankHolderName: null,
    batchCompleted: false,
    examinationVenue: null,
    singleSideDistance: null,
    bothSideDistance: null,
    userId: userData?._id || null,
    studentCRUDStatus: "Added",
  });

  const [touched, setTouched] = useState({});

  // Update class when batch changes
  useEffect(() => {
    if (formData.batch) {
      const className = getClassFromBatch(formData.batch);
      setFormData(prev => ({
        ...prev,
        classofStudent: className
      }));
    }
  }, [formData.batch]);

  // Debounce SRN check (only for Add case)
  useEffect(() => {
    if (crudStatus !== "Added") return;
    
    const timer = setTimeout(() => {
      if (formData.studentSrn && formData.studentSrn.length === 10 && /^\d{10}$/.test(formData.studentSrn)) {
        checkSRN(formData.studentSrn);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.studentSrn, crudStatus]);

  // Effect to auto-fill district, block, school details from schoolContext
  useEffect(() => {
    if (schoolContext) {
      setFormData(prev => ({
        ...prev,
        districtId: schoolContext.districtId || "",
        blockId: schoolContext.blockId || "",
        schoolId: schoolContext.schoolId || ""
      }));
    }
  }, [schoolContext]);

  // Check SRN availability
  const checkSRN = async (srn) => {
    if (!srn || srn.length !== 10) return;
    
    setCheckingSRN(true);
    try {
      const result = await checkSRNAvailability({ studentSrn: srn });
    } catch (err) {
      if (err.status === 409 && err.existingStudent) {
        const enhancedStudent = {
          ...err.existingStudent,
          ...getSchoolDetailsFromRegion(
            err.existingStudent.schoolId,
            err.existingStudent.districtId,
            err.existingStudent.blockId
          )
        };
        setExistingStudentData(enhancedStudent);
        setShowExistingModal(true);
      }
    } finally {
      setCheckingSRN(false);
    }
  };

  // Validation rules
  const validateField = (name, value) => {
    // Skip validation for Remove and SLC Released cases
    if (crudStatus !== "Added") return "";
    
    switch (name) {
      case "studentSrn":
        if (!value) return "Student SRN is required";
        if (!/^\d{10}$/.test(value)) return "Student SRN must be exactly 10 digits";
        return "";
      case "firstName":
        return !value ? "First Name is required" : "";
      case "fatherName":
        return !value ? "Father's Name is required" : "";
      case "gender":
        return !value ? "Gender is required" : "";
      case "batch":
        return !value ? "Batch is required" : "";
      default:
        return "";
    }
  };

  const getFieldError = (name) => {
    if (!touched[name]) return "";
    return validateField(name, formData[name]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "studentSrn" && crudStatus === "Added") {
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 10) {
        return;
      }
    }
    
    if (name === "batch") {
      setSelectedBatch(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    // Skip validation for Remove and SLC Released cases
    if (crudStatus !== "Added") return true;
    
    const requiredFields = [
      "studentSrn", "firstName", "fatherName", "gender", "batch"
    ];
    
    let isValid = true;
    const newTouched = {};
    
    requiredFields.forEach(field => {
      newTouched[field] = true;
      if (!formData[field]) {
        isValid = false;
      }
    });
    
    if (formData.studentSrn && formData.studentSrn.length !== 10) {
      setError("Student SRN must be exactly 10 digits");
      isValid = false;
    }
    
    if (!schoolContext || !schoolContext.schoolId) {
      setError("Please select a school");
      isValid = false;
    }
    
    setTouched(prev => ({ ...prev, ...newTouched }));
    return isValid;
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      studentSrn: "",
      firstName: "",
      fatherName: "",
      motherName: "",
      personalContact: "",
      ParentContact: "",
      dob: "",
      gender: "",
      address: null,
    }));
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fill all required fields correctly");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const submitData = {
        ...formData,
        userId: userData?._id,
        studentCRUDStatus: crudStatus,
        enrollmentDate: new Date().toISOString().split('T')[0],
        erpEnrollingDate: new Date().toISOString().split('T')[0],
        slc: crudStatus === "Added" ? true : false,
        isSlcTaken: crudStatus === "Added" ? false : true,
        rollNumber: null,
        lastName: null,
        motherName: formData.motherName || null,
        otherContact: null,
        dob: formData.dob || null,
        category: null,
        address: null,
        email: null,
        parent: null,
        medium: null,
        isStudentOf: "MB",
        session1: null,
        session2: null,
        slcReleasingDate: null,
        isDressGiven: false,
        isTabGiven: false,
        tabIMEI: null,
        isSimGiven: false,
        simNumber: null,
        simIMSI: null,
        shirtSizeInInches: null,
        waistSizeInInches: null,
        waistToBottomLengthInInches: null,
        dressAmountSubmitted: false,
        dressSizeConfirmationForm: null,
        bankName: null,
        bankIFSC: null,
        bankAccNumber: null,
        bankHolderName: null,
        batchCompleted: false,
        examinationVenue: null,
        singleSideDistance: null,
        bothSideDistance: null,
        personalContact: formData.personalContact || null,
        ParentContact: formData.ParentContact || null,
      };
      
      const result = await CreateStudentAPI(submitData);
      
      if (result.success) {
        let successMessage = "";
        if (crudStatus === "Added") successMessage = "Student created successfully!";
        else if (crudStatus === "Removed") successMessage = "Student removed successfully!";
        else successMessage = "Student SLC status updated successfully!";
        
        setSuccess(successMessage);
        
        if (crudStatus === "Added") {
          resetForm();
        } else {
          setFormData(prev => ({ ...prev, studentSrn: "" }));
        }
        
        if (onSuccess) {
          onSuccess(result.data);
        }
        
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error:", err);
      
      if (err.existingStudent) {
        const enhancedStudent = {
          ...err.existingStudent,
          ...getSchoolDetailsFromRegion(
            err.existingStudent.schoolId,
            err.existingStudent.districtId,
            err.existingStudent.blockId
          )
        };
        setExistingStudentData(enhancedStudent);
        setShowExistingModal(true);
        setError(`Student with SRN ${formData.studentSrn} already exists.`);
      } else {
        setError(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      studentSrn: "",
      firstName: "",
      fatherName: "",
      motherName: "",
      personalContact: "",
      ParentContact: "",
      dob: "",
      gender: "",
      address: null,
      districtId: schoolContext?.districtId || "",
      blockId: schoolContext?.blockId || "",
      schoolId: schoolContext?.schoolId || "",
      batch: selectedBatch,
      classofStudent: selectedBatch ? getClassFromBatch(selectedBatch) : "",
      rollNumber: null,
      lastName: null,
      otherContact: null,
      category: null,
      email: null,
      parent: null,
      medium: null,
      isStudentOf: "MB",
      session1: null,
      session2: null,
      enrollmentDate: new Date().toISOString().split('T')[0],
      erpEnrollingDate: new Date().toISOString().split('T')[0],
      slc: true,
      isSlcTaken: false,
      slcReleasingDate: null,
      isDressGiven: false,
      isTabGiven: false,
      tabIMEI: null,
      isSimGiven: false,
      simNumber: null,
      simIMSI: null,
      shirtSizeInInches: null,
      waistSizeInInches: null,
      waistToBottomLengthInInches: null,
      dressAmountSubmitted: false,
      dressSizeConfirmationForm: null,
      bankName: null,
      bankIFSC: null,
      bankAccNumber: null,
      bankHolderName: null,
      batchCompleted: false,
      examinationVenue: null,
      singleSideDistance: null,
      bothSideDistance: null,
      userId: userData?._id || null,
      studentCRUDStatus: crudStatus,
    });
    setSelectedBatch("");
    setTouched({});
    setError(null);
    setSuccess(null);
  };

  // Get page title and button text based on CRUD status
  const getPageTitle = () => {
    switch(crudStatus) {
      case "Removed": return "Remove Student";
      case "SLC Released": return "Release SLC";
      default: return "Create New Student";
    }
  };

  const getButtonText = () => {
    switch(crudStatus) {
      case "Removed": return "Remove Student";
      case "SLC Released": return "Release SLC";
      default: return "Create Student";
    }
  };

  const getButtonIcon = () => {
    switch(crudStatus) {
      case "Removed": return <Trash className="me-2" />;
      case "SLC Released": return <FileEarmarkCheck className="me-2" />;
      default: return <Save className="me-2" />;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={12} xl={10}>
          <Card className="shadow-lg border-0">
            <Card.Header className={`py-3 ${crudStatus === "Removed" ? "bg-danger" : crudStatus === "SLC Released" ? "bg-warning" : "bg-primary"} text-white`}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <PersonPlus size={30} className="me-2" />
                  <h3 className="mb-0">{getPageTitle()}</h3>
                </div>
                {onCancel && (
                  <Button variant="light" onClick={onCancel} size="sm">
                    <ArrowLeft className="me-1" /> Back
                  </Button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
                  <Alert.Heading>Success!</Alert.Heading>
                  <p>{success}</p>
                </Alert>
              )}
              
              {checkingSRN && crudStatus === "Added" && (
                <Alert variant="info" className="mb-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Checking SRN availability...
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <School_drop_down />
                
                {crudStatus === "Added" && (
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Batch <span className="text-danger">* (Mandatory)</span></Form.Label>
                        <Form.Select
                          name="batch"
                          value={formData.batch}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!getFieldError("batch")}
                        >
                          <option value="">Select Batch</option>
                          <option value="2025-27">2025-27 (Class 10)</option>
                          <option value="2026-28">2026-28 (Class 9)</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {getFieldError("batch")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                
                <h5 className="mb-3 text-primary">Student Information</h5>
                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Student SRN <span className="text-danger">* (Mandatory - 10 digits)</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="studentSrn"
                        value={formData.studentSrn}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!getFieldError("studentSrn")}
                        placeholder="Enter 10 digit SRN"
                        maxLength={10}
                        disabled={crudStatus !== "Added"}
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("studentSrn")}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  {crudStatus === "Added" && (
                    <>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name <span className="text-danger">* (Mandatory)</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!getFieldError("firstName")}
                            placeholder="Enter first name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {getFieldError("firstName")}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father's Name <span className="text-danger">* (Mandatory)</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!getFieldError("fatherName")}
                            placeholder="Enter father's name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {getFieldError("fatherName")}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother's Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleChange}
                            placeholder="Enter mother's name"
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Personal Contact</Form.Label>
                          <Form.Control
                            type="tel"
                            name="personalContact"
                            value={formData.personalContact}
                            onChange={handleChange}
                            placeholder="10 digit mobile number"
                            maxLength={10}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Parent Contact</Form.Label>
                          <Form.Control
                            type="tel"
                            name="ParentContact"
                            value={formData.ParentContact}
                            onChange={handleChange}
                            placeholder="10 digit mobile number"
                            maxLength={10}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender <span className="text-danger">* (Mandatory)</span></Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!getFieldError("gender")}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {getFieldError("gender")}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <Button variant="secondary" onClick={handleReset} disabled={loading}>
                    Reset
                  </Button>
                  <Button 
                    variant={crudStatus === "Removed" ? "danger" : crudStatus === "SLC Released" ? "warning" : "primary"} 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {getButtonIcon()}
                        {getButtonText()}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showExistingModal} onHide={() => setShowExistingModal(false)} size="lg">
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>
            <XCircle className="me-2" />
            Student Already Exists
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            A student with SRN <strong>{existingStudentData?.studentSrn}</strong> already exists in the system.
          </Alert>
          
          <h6 className="mb-3">Existing Student Details:</h6>
          <Card className="border">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Student SRN:</strong> {existingStudentData?.studentSrn}</p>
                  <p><strong>Name:</strong> {existingStudentData?.firstName} {existingStudentData?.lastName || ''}</p>
                  <p><strong>Father's Name:</strong> {existingStudentData?.fatherName || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>District:</strong> {existingStudentData?.districtName || 'N/A'}</p>
                  <p><strong>School:</strong> {existingStudentData?.schoolName || 'N/A'}</p>
                  <p><strong>Class:</strong> {existingStudentData?.classofStudent}</p>
                  <p><strong>Batch:</strong> {existingStudentData?.batch}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExistingModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowExistingModal(false);
            const srnField = document.querySelector('input[name="studentSrn"]');
            if (srnField) srnField.focus();
          }}>
            Try Different SRN
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};