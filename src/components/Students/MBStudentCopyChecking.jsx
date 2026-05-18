// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form } from "react-bootstrap";
// import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble } from "react-icons/fa";
// import { GetCopyCheckingData, CreateStudentCopyChecking } from "../../service/StudentCopyChecking/studentCopyChecking.service";

// export const MBStudentCopyChecking = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState({});
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [summary, setSummary] = useState(null);
  
//   // Matrix state: { studentId: { subject: { copyCheckingType: status } } }
//   const [matrixData, setMatrixData] = useState({});
  
//   // Selected copy checking types (HW, CW)
//   const [selectedTypes, setSelectedTypes] = useState({});

//   const subjects = ["Mathematics", "English", "Hindi", "Science", "Social Studies", "Computer Science"];
//   const copyCheckingTypes = ["Home Work", "Class Work"];
//   const statusOptions = [
//     { value: "complete", label: "Complete", variant: "success", icon: <FaCheckCircle /> },
//     { value: "incomplete", label: "Incomplete", variant: "warning", icon: <FaClock /> },
//     { value: "unavailable", label: "Unavailable", variant: "danger", icon: <FaTimesCircle /> }
//   ];

//   const fetchStudents = async () => {
//     setLoading(true);
//     setError(null);
    
//     const reqBody = {
//       schoolId: schoolContext?.schoolId,
//       batch: batchContext?.batch,
//       date: startDate,
//     };

//     console.log("Fetching copy checking data with:", reqBody);
    
//     try {
//       const response = await GetCopyCheckingData(reqBody);
//       console.log("Copy checking data response:", response);
      
//       if (response.success) {
//         setStudents(response.data || []);
//         setSelectedDate(response.filters?.date || startDate || null);
//         setSummary(response.summary || null);
        
//         // Initialize matrix data from fetched records
//         const initialMatrix = {};
//         const initialSelectedTypes = {};
        
//         response.data?.forEach(student => {
//           initialMatrix[student._id] = {};
//           initialSelectedTypes[student._id] = {
//             "Home Work": false,
//             "Class Work": false
//           };
          
//           // Initialize all subjects for this student
//           subjects.forEach(subject => {
//             initialMatrix[student._id][subject] = {
//               "Home Work": null,
//               "Class Work": null
//             };
//           });
          
//           // Populate existing data
//           if (student.copyCheckings && student.copyCheckings.length > 0) {
//             student.copyCheckings.forEach(copyChecking => {
//               const subject = copyChecking.subject;
//               const type = copyChecking.copyCheckingType;
//               const status = copyChecking.status;
              
//               if (initialMatrix[student._id][subject]) {
//                 initialMatrix[student._id][subject][type] = status;
//               }
              
//               // Auto-select types that have data
//               if (status) {
//                 initialSelectedTypes[student._id][type] = true;
//               }
//             });
//           }
//         });
        
//         setMatrixData(initialMatrix);
//         setSelectedTypes(initialSelectedTypes);
//       } else {
//         setError(response.message || "Failed to fetch copy checking data");
//       }
//     } catch (error) {
//       console.log("Error fetching copy checking data:", error);
//       setError("Failed to fetch copy checking data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTypeToggle = (studentId, type) => {
//     setSelectedTypes(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [type]: !prev[studentId][type]
//       }
//     }));
//   };

//   const handleStatusChange = (studentId, subject, type, status) => {
//     setMatrixData(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [subject]: {
//           ...prev[studentId][subject],
//           [type]: status
//         }
//       }
//     }));
//   };

//   const handleSubmit = async (student) => {
//     const selectedTypesForStudent = selectedTypes[student._id];
//     const selectedTypesList = Object.keys(selectedTypesForStudent).filter(type => selectedTypesForStudent[type]);
    
//     if (selectedTypesList.length === 0) {
//       setError(`Please select at least one copy checking type for ${student.firstName} ${student.lastName}`);
//       setTimeout(() => setError(null), 3000);
//       return;
//     }
    
//     // Prepare all submissions for this student
//     const submissions = [];
    
//     subjects.forEach(subject => {
//       selectedTypesList.forEach(type => {
//         const status = matrixData[student._id]?.[subject]?.[type];
//         if (status) {
//           submissions.push({
//             subject,
//             copyCheckingType: type,
//             status: status
//           });
//         }
//       });
//     });
    
//     if (submissions.length === 0) {
//       setError(`Please select at least one subject status for ${student.firstName} ${student.lastName}`);
//       setTimeout(() => setError(null), 3000);
//       return;
//     }
    
//     // Set submitting state for this student
//     setSubmitting(prev => ({ ...prev, [student._id]: true }));
//     setError(null);
//     setSuccessMessage(null);
    
//     let successCount = 0;
//     let failCount = 0;
    
//     // Submit each combination
//     for (const submission of submissions) {
//       const reqBody = {
//         unqStudentObjectId: student._id,
//         studentSrn: student.studentSrn,
//         batch: student.batch,
//         schoolId: student.schoolId,
//         subject: submission.subject,
//         copyCheckingType: submission.copyCheckingType,
//         status: submission.status,
//         remark: `${submission.status} - ${new Date().toLocaleString()}`,
//         date: selectedDate || startDate,
//         copyCheckingDoneBy: userData?._id || null
//       };
      
//       console.log(`Submitting for ${student.firstName} - ${submission.subject} (${submission.copyCheckingType}):`, reqBody);
      
//       try {
//         const response = await CreateStudentCopyChecking(reqBody);
//         if (response.success) {
//           successCount++;
//         } else {
//           failCount++;
//           console.error(`Failed to save ${submission.subject} (${submission.copyCheckingType}):`, response.message);
//         }
//       } catch (error) {
//         failCount++;
//         console.error(`Error saving ${submission.subject} (${submission.copyCheckingType}):`, error);
//       }
//     }
    
//     // Show summary message
//     if (successCount > 0) {
//       setSuccessMessage(`✅ Successfully saved ${successCount} record(s) for ${student.firstName} ${student.lastName}${failCount > 0 ? `. ${failCount} failed.` : ''}`);
      
//       // Refresh data after successful save
//       setTimeout(() => {
//         fetchStudents();
//       }, 1500);
//     } else {
//       setError(`Failed to save records for ${student.firstName} ${student.lastName}. Please try again.`);
//     }
    
//     setSubmitting(prev => ({ ...prev, [student._id]: false }));
    
//     // Clear success message after 3 seconds
//     setTimeout(() => {
//       setSuccessMessage(null);
//     }, 3000);
//   };

//   // Fetch students when school, batch, or startDate changes
//   useEffect(() => {
//     if (schoolContext?.schoolId && batchContext?.batch && startDate) {
//       fetchStudents();
//     }
//   }, [schoolContext, batchContext, startDate]);

//   // Card View with Matrix
//   const CardView = () => (
//     <Row className="g-4 mt-2">
//       {students.length > 0 ? (
//         students.map((student) => {
//           const isSubmitting = submitting[student._id];
//           const selectedTypesForStudent = selectedTypes[student._id] || { "Home Work": false, "Class Work": false };
          
//           return (
//             <Col xs={12} key={student._id}>
//               <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-primary text-white">
//                   <Row>
//                     <Col md={8}>
//                       <div className="d-flex align-items-center gap-3 flex-wrap">
//                         <strong className="fs-5">
//                           {student.firstName || 'N/A'} {student.lastName || ''}
//                         </strong>
//                         <Badge bg="light" text="dark">
//                           Roll #: {student.rollNumber || 'N/A'}
//                         </Badge>
//                         <Badge bg="light" text="dark">
//                           SRN: {student.studentSrn || 'N/A'}
//                         </Badge>
//                       </div>
//                     </Col>
//                     <Col md={4} className="text-md-end">
//                       <small>
//                         Class: {student.classofStudent || 'N/A'} | Batch: {student.batch || 'N/A'}
//                       </small>
//                     </Col>
//                   </Row>
//                 </Card.Header>
                
//                 <Card.Body>
//                   {/* Copy Checking Type Selection - Checkboxes */}
//                   <div className="mb-4">
//                     <label className="fw-bold mb-2">Select Copy Checking Types:</label>
//                     <div className="d-flex gap-4">
//                       {copyCheckingTypes.map(type => (
//                         <Form.Check
//                           key={type}
//                           type="checkbox"
//                           id={`${student._id}-${type}`}
//                           label={
//                             <span className="fw-semibold">
//                               {type === "Home Work" ? "📝 Home Work" : "📚 Class Work"}
//                             </span>
//                           }
//                           checked={selectedTypesForStudent[type] || false}
//                           onChange={() => handleTypeToggle(student._id, type)}
//                           disabled={isSubmitting}
//                         />
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* Status Matrix Table */}
//                   {Object.values(selectedTypesForStudent).some(v => v === true) ? (
//                     <div className="table-responsive">
//                       <table className="table table-bordered table-hover">
//                         <thead className="table-light">
//                           <tr>
//                             <th style={{ width: '30%' }}>Subject</th>
//                             {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).map(type => (
//                               <th key={type} style={{ width: '70%' }} colSpan={statusOptions.length}>
//                                 <div className="text-center">
//                                   {type === "Home Work" ? "📝 Home Work" : "📚 Class Work"}
//                                 </div>
//                               </th>
//                             ))}
//                           </tr>
//                           {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).length > 0 && (
//                             <tr>
//                               <th></th>
//                               {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).map(type => (
//                                 statusOptions.map(option => (
//                                   <th key={`${type}-${option.value}`} className="text-center" style={{ width: '70% / 3' }}>
//                                     {option.icon} {option.label}
//                                   </th>
//                                 ))
//                               ))}
//                             </tr>
//                           )}
//                         </thead>
//                         <tbody>
//                           {subjects.map(subject => {
//                             // Check if any status is selected for this subject for selected types
//                             const hasAnySelection = copyCheckingTypes
//                               .filter(type => selectedTypesForStudent[type])
//                               .some(type => matrixData[student._id]?.[subject]?.[type]);
                            
//                             return (
//                               <tr key={subject} className={hasAnySelection ? 'table-active' : ''}>
//                                 <td className="fw-semibold">{subject}</td>
//                                 {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).map(type => (
//                                   statusOptions.map(option => (
//                                     <td key={`${subject}-${type}-${option.value}`} className="text-center">
//                                       <Form.Check
//                                         type="radio"
//                                         name={`${student._id}-${subject}-${type}`}
//                                         checked={matrixData[student._id]?.[subject]?.[type] === option.value}
//                                         onChange={() => handleStatusChange(student._id, subject, type, option.value)}
//                                         disabled={isSubmitting}
//                                         inline
//                                       />
//                                     </td>
//                                   ))
//                                 ))}
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <Alert variant="info" className="text-center">
//                       Please select at least one copy checking type (Home Work/Class Work) to see the matrix
//                     </Alert>
//                   )}
                  
//                   {/* Parent & Contact Info */}
//                   <Row className="mt-3 pt-2 border-top">
//                     <Col md={6}>
//                       <small className="text-muted">
//                         Father: {student.fatherName || 'N/A'} | Mother: {student.motherName || 'N/A'}
//                       </small>
//                     </Col>
//                     <Col md={6}>
//                       <small className="text-muted">
//                         Contact: {student.personalContact || 'N/A'} | Parent: {student.ParentContact || 'N/A'}
//                       </small>
//                     </Col>
//                   </Row>
//                 </Card.Body>
                
//                 <Card.Footer className="bg-white border-0">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <small className="text-muted">
//                         Total Records: {student.totalCopyCheckingsCount || 0}
//                       </small>
//                     </div>
//                     <Button
//                       variant="success"
//                       onClick={() => handleSubmit(student)}
//                       disabled={isSubmitting}
//                       className="px-4"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Spinner animation="border" size="sm" className="me-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <FaSave className="me-2" />
//                           Save All Selected
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           );
//         })
//       ) : (
//         <Col xs={12}>
//           <div className="text-center text-muted py-5">
//             <FaBook size={50} className="mb-3" />
//             <p>No students found for the selected filters and date</p>
//           </div>
//         </Col>
//       )}
//     </Row>
//   );

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Summary Statistics */}
//       {summary && summary.totalStudents > 0 && (
//         <Alert variant="info" className="mb-3">
//           <Row className="text-center">
//             <Col md={3}>
//               <strong>Total Students:</strong> {summary.totalStudents}
//             </Col>
//             <Col md={3}>
//               <strong>With Copy Checkings:</strong> {summary.studentsWithCopyCheckings}
//             </Col>
//             <Col md={3}>
//               <strong>Without Copy Checkings:</strong> {summary.studentsWithoutCopyCheckings}
//             </Col>
//             <Col md={3}>
//               <strong>Total Checkings:</strong> {summary.totalCopyCheckings}
//             </Col>
//           </Row>
//         </Alert>
//       )}

//       {/* Success Message */}
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
//           <Alert.Heading>Success!</Alert.Heading>
//           <p>{successMessage}</p>
//         </Alert>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//           <Alert.Heading>Error!</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       {/* Info Message - Show selected date */}
//       {startDate && (
//         <Alert variant="info" className="mb-3">
//           <FaClipboardCheck className="me-2" />
//           <strong>Selected Date:</strong> {startDate}
//         </Alert>
//       )}

//       {/* Filters Section */}
//       <Row className="mb-4">
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <h5 className="mb-0">Filters</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <SingleDatePicker />
//                 </Col>
//                 <Col md={3}>
//                   <School_drop_down />
//                 </Col>
//                 <Col md={3}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Students List Section - Matrix View */}
//       <Row>
//         <Col xs={12}>
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <div className="d-flex justify-content-between align-items-center flex-wrap">
//                 <h5 className="mb-0">
//                   <FaCheckDouble className="me-2" />
//                   Student Copy Checking Matrix
//                 </h5>
//                 <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
//                   <Badge bg="light" text="dark" className="ms-2">
//                     Total: {students.length} Students
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Header>
//             <Card.Body>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-3">Loading copy checking data...</p>
//                 </div>
//               ) : (
//                 <>
//                   {students.length > 0 && (
//                     <div className="mb-3 text-muted">
//                       <small>
//                         <FaClipboardCheck className="me-1" />
//                         Showing {students.length} student(s) for date: <strong>{selectedDate || startDate || 'Today'}</strong>
//                       </small>
//                     </div>
//                   )}
//                   <CardView />
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };


import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Form } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaClipboardCheck, FaSave, FaCheckDouble, FaSchool } from "react-icons/fa";
import { GetCopyCheckingData, CreateStudentCopyChecking } from "../../service/StudentCopyChecking/studentCopyChecking.service";

export const MBStudentCopyChecking = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [summary, setSummary] = useState(null);
  
  // Matrix state: { studentId: { subject: { copyCheckingType: status } } }
  const [matrixData, setMatrixData] = useState({});
  
  // Selected copy checking types (HW, CW)
  const [selectedTypes, setSelectedTypes] = useState({});

  const subjects = ["Mathematics", "English", "Hindi", "Science", "Social Science", "Computer", "Biology", "Physics", "Chmemistry", "Optional"];
  const copyCheckingTypes = ["Home Work", "Class Work"];
  const statusOptions = [
    { value: "Complete", label: "Complete", variant: "success", icon: <FaCheckCircle /> },
    { value: "Incomplete", label: "Incomplete", variant: "warning", icon: <FaClock /> },
    { value: "Unavailable", label: "Unavailable", variant: "danger", icon: <FaTimesCircle /> }
  ];

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    
    const reqBody = {
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      date: startDate,
    };

    console.log("Fetching copy checking data with:", reqBody);
    
    try {
      const response = await GetCopyCheckingData(reqBody);
      console.log("Copy checking data response:", response);
      
      if (response.success) {
        setStudents(response.data || []);
        setSelectedDate(response.filters?.date || startDate || null);
        setSummary(response.summary || null);
        
        // Initialize matrix data from fetched records
        const initialMatrix = {};
        const initialSelectedTypes = {};
        
        response.data?.forEach(student => {
          initialMatrix[student._id] = {};
          initialSelectedTypes[student._id] = {
            "Home Work": false,
            "Class Work": false
          };
          
          // Initialize all subjects for this student
          subjects.forEach(subject => {
            initialMatrix[student._id][subject] = {
              "Home Work": null,
              "Class Work": null
            };
          });
          
          // Populate existing data
          if (student.copyCheckings && student.copyCheckings.length > 0) {
            student.copyCheckings.forEach(copyChecking => {
              const subject = copyChecking.subject;
              const type = copyChecking.copyCheckingType;
              const status = copyChecking.status;
              
              if (initialMatrix[student._id][subject]) {
                initialMatrix[student._id][subject][type] = status;
              }
              
              // Auto-select types that have data
              if (status) {
                initialSelectedTypes[student._id][type] = true;
              }
            });
          }
        });
        
        setMatrixData(initialMatrix);
        setSelectedTypes(initialSelectedTypes);
      } else {
        setError(response.message || "Failed to fetch copy checking data");
      }
    } catch (error) {
      console.log("Error fetching copy checking data:", error);
      setError("Failed to fetch copy checking data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (studentId, type) => {
    setSelectedTypes(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: !prev[studentId][type]
      }
    }));
  };

  const handleStatusChange = (studentId, subject, type, status) => {
    setMatrixData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: {
          ...prev[studentId][subject],
          [type]: status
        }
      }
    }));
  };

  const handleSubmit = async (student) => {
    const selectedTypesForStudent = selectedTypes[student._id];
    const selectedTypesList = Object.keys(selectedTypesForStudent).filter(type => selectedTypesForStudent[type]);
    
    if (selectedTypesList.length === 0) {
      setError(`Please select at least one copy checking type for ${student.firstName} ${student.lastName}`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Prepare all submissions for this student
    const submissions = [];
    
    subjects.forEach(subject => {
      selectedTypesList.forEach(type => {
        const status = matrixData[student._id]?.[subject]?.[type];
        if (status) {
          submissions.push({
            subject,
            copyCheckingType: type,
            status: status
          });
        }
      });
    });
    
    if (submissions.length === 0) {
      setError(`Please select at least one subject status for ${student.firstName} ${student.lastName}`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Set submitting state for this student
    setSubmitting(prev => ({ ...prev, [student._id]: true }));
    setError(null);
    setSuccessMessage(null);
    
    let successCount = 0;
    let failCount = 0;
    
    // Submit each combination
    for (const submission of submissions) {
      const reqBody = {
        unqStudentObjectId: student._id,
        studentSrn: student.studentSrn,
        batch: student.batch,
        schoolId: student.schoolId,
        subject: submission.subject,
        copyCheckingType: submission.copyCheckingType,
        status: submission.status,
        remark: `${submission.status} - ${new Date().toLocaleString()}`,
        date: selectedDate || startDate,
        copyCheckingDoneBy: userData?._id || null
      };
      
      console.log(`Submitting for ${student.firstName} - ${submission.subject} (${submission.copyCheckingType}):`, reqBody);
      
      try {
        const response = await CreateStudentCopyChecking(reqBody);
        if (response.success) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to save ${submission.subject} (${submission.copyCheckingType}):`, response.message);
        }
      } catch (error) {
        failCount++;
        console.error(`Error saving ${submission.subject} (${submission.copyCheckingType}):`, error);
      }
    }
    
    // Show summary message
    if (successCount > 0) {
      setSuccessMessage(`✅ Successfully saved ${successCount} record(s) for ${student.firstName} ${student.lastName}${failCount > 0 ? `. ${failCount} failed.` : ''}`);
      
      // Refresh data after successful save
      setTimeout(() => {
        fetchStudents();
      }, 1500);
    } else {
      setError(`Failed to save records for ${student.firstName} ${student.lastName}. Please try again.`);
    }
    
    setSubmitting(prev => ({ ...prev, [student._id]: false }));
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Fetch students when school, batch, or startDate changes
  useEffect(() => {
    if (schoolContext?.schoolId && batchContext?.batch && startDate) {
      fetchStudents();
    }
  }, [schoolContext, batchContext, startDate]);

  // Card View with Matrix
  const CardView = () => (
    <Row className="g-4 mt-2">
      {students.length > 0 ? (
        students.map((student) => {
          const isSubmitting = submitting[student._id];
          const selectedTypesForStudent = selectedTypes[student._id] || { "Home Work": false, "Class Work": false };
          const schoolName = student.schoolDetails?.schoolName || 'N/A';
          
          return (
            <Col xs={12} key={student._id}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                  <Row>
                    <Col md={8}>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <strong className="fs-5">
                          👨‍🎓 {student.firstName || 'N/A'} {student.lastName || ''}
                        </strong>
                        <Badge bg="light" text="dark" className="d-flex align-items-center gap-1">
                          <FaSchool size={12} />
                          {schoolName}
                        </Badge>
                      </div>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <small>
                        Batch: {student.batch || 'N/A'}
                      </small>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={12}>
                      <small className="text-white-50">
                        👨 Father: {student.fatherName || 'N/A'}
                      </small>
                    </Col>
                  </Row>
                </Card.Header>
                
                <Card.Body>
                  {/* Copy Checking Type Selection - Checkboxes with black border */}
                  <div className="mb-4">
                    <label className="fw-bold mb-2">Select Copy Checking Types:</label>
                    <div className="d-flex gap-4">
                      {copyCheckingTypes.map(type => (
                        <Form.Check
                          key={type}
                          type="checkbox"
                          id={`${student._id}-${type}`}
                          label={
                            <span className="fw-semibold">
                              {type === "Home Work" ? "📝 Home Work" : "📚 Class Work"}
                            </span>
                          }
                          checked={selectedTypesForStudent[type] || false}
                          onChange={() => handleTypeToggle(student._id, type)}
                          disabled={isSubmitting}
                          className="custom-checkbox-black"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Matrix Table */}
                  {Object.values(selectedTypesForStudent).some(v => v === true) ? (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: '30%' }}>Subject</th>
                            {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).map(type => (
                              <th key={type} style={{ width: '70%' }} colSpan={statusOptions.length}>
                                <div className="text-center">
                                  {type === "Home Work" ? "📝 Home Work" : "📚 Class Work"}
                                </div>
                              </th>
                            ))}
                          </tr>
                          {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).length > 0 && (
                            <tr>
                              <th></th>
                              {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).map(type => (
                                statusOptions.map(option => (
                                  <th key={`${type}-${option.value}`} className="text-center" style={{ width: '70% / 3' }}>
                                    {option.icon} {option.label}
                                  </th>
                                ))
                              ))}
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {subjects.map(subject => {
                            // Check if any status is selected for this subject for selected types
                            const hasAnySelection = copyCheckingTypes
                              .filter(type => selectedTypesForStudent[type])
                              .some(type => matrixData[student._id]?.[subject]?.[type]);
                            
                            return (
                              <tr key={subject} className={hasAnySelection ? 'table-active' : ''}>
                                <td className="fw-semibold">{subject}</td>
                                {copyCheckingTypes.filter(type => selectedTypesForStudent[type]).map(type => (
                                  statusOptions.map(option => (
                                    <td key={`${subject}-${type}-${option.value}`} className="text-center">
                                      <Form.Check
                                        type="radio"
                                        name={`${student._id}-${subject}-${type}`}
                                        checked={matrixData[student._id]?.[subject]?.[type] === option.value}
                                        onChange={() => handleStatusChange(student._id, subject, type, option.value)}
                                        disabled={isSubmitting}
                                        inline
                                      />
                                    </td>
                                  ))
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Alert variant="info" className="text-center">
                      Please select at least one copy checking type (Home Work/Class Work) to see the matrix
                    </Alert>
                  )}
                </Card.Body>
                
                <Card.Footer className="bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        Total Records: {student.totalCopyCheckingsCount || 0}
                      </small>
                    </div>
                    <Button
                      variant="success"
                      onClick={() => handleSubmit(student)}
                      disabled={isSubmitting}
                      className="px-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Save All Selected
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          );
        })
      ) : (
        <Col xs={12}>
          <div className="text-center text-muted py-5">
            <FaBook size={50} className="mb-3" />
            <p>No students found for the selected filters and date</p>
          </div>
        </Col>
      )}
    </Row>
  );

  return (
    <Container fluid className="mt-4 mb-4">
      {/* Summary Statistics */}
      {summary && summary.totalStudents > 0 && (
        <Alert variant="info" className="mb-3">
          <Row className="text-center">
            <Col md={3}>
              <strong>Total Students:</strong> {summary.totalStudents}
            </Col>
            <Col md={3}>
              <strong>With Copy Checkings:</strong> {summary.studentsWithCopyCheckings}
            </Col>
            <Col md={3}>
              <strong>Without Copy Checkings:</strong> {summary.studentsWithoutCopyCheckings}
            </Col>
            <Col md={3}>
              <strong>Total Checkings:</strong> {summary.totalCopyCheckings}
            </Col>
          </Row>
        </Alert>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">
          <Alert.Heading>Success!</Alert.Heading>
          <p>{successMessage}</p>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Info Message - Show selected date */}
      {startDate && (
        <Alert variant="info" className="mb-3">
          <FaClipboardCheck className="me-2" />
          <strong>Selected Date:</strong> {startDate}
        </Alert>
      )}

      {/* Filters Section */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <SingleDatePicker />
                </Col>
                <Col md={3}>
                  <School_drop_down />
                </Col>
                <Col md={3}>
                  <Batch_drop_down />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students List Section - Matrix View */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
           
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading copy checking data...</p>
                </div>
              ) : (
                <>
                  {students.length > 0 && (
                    <div className="mb-3 text-muted">
                      <small>
                        <FaClipboardCheck className="me-1" />
                        Showing {students.length} student(s) for date: <strong>{selectedDate || startDate || 'Today'}</strong>
                      </small>
                    </div>
                  )}
                  <CardView />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom CSS for black checkbox borders */}
      <style jsx>{`
        .custom-checkbox-black :global(.form-check-input) {
          border: 2px solid #000 !important;
          cursor: pointer;
        }
        .custom-checkbox-black :global(.form-check-input:checked) {
          background-color: #0d6efd;
          border-color: #0d6efd !important;
        }
        .custom-checkbox-black :global(.form-check-input:focus) {
          border-color: #000 !important;
          box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
        }
        .custom-checkbox-black :global(.form-check-label) {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};