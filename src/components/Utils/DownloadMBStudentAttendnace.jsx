// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { GetMBStudents, MarkMBStudentAttendance } from "../../service/Student.service";
// import { Container, Card, Table, Button, Badge, Spinner, ToggleButton, ToggleButtonGroup, Row, Col, Alert } from "react-bootstrap";
// import { FaThLarge, FaTable, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";
// import { GetAllMbStudentsData } from "../../service/Student.service";



// export const DownloadMBStudentAttendance = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   // Show alert when any filter value changes
//   useEffect(() => {
//     const schoolValue = schoolContext?.schoolId || "All";
//     const batchValue = batchContext?.batch || "All";
//     const dateValue = startDate || "All";
//     const districtValue = schoolContext?.districtId || "All";
//     const blockValue = schoolContext?.blockId || "All";
    
//     setAlertMessage(`Selected Filters:\n🏢 District: ${districtValue}\n🏘️ Block: ${blockValue}\n📚 School: ${schoolValue}\n📖 Batch: ${batchValue}\n📅 Date: ${dateValue}`);
//     setShowAlert(true);
    
//     // Auto hide alert after 3 seconds
//     const timer = setTimeout(() => {
//       setShowAlert(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, [schoolContext, batchContext, startDate]);

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* Alert to show selected filter values */}
//       {showAlert && (
//         <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="mb-3">
//           <Alert.Heading>Selected Filters</Alert.Heading>
//           <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
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
//     </Container>
//   );
// };












// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Modal, Form } from "react-bootstrap";
// import { FaFileExcel, FaDownload, FaSchool, FaUsers, FaCalendarAlt, FaFilter } from "react-icons/fa";
// import { GetAllMbStudentsData } from "../../service/Student.service";
// import * as XLSX from 'xlsx';

// export const DownloadMBStudentAttendance = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [exporting, setExporting] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Local filter states for modal
//   const [modalDistrict, setModalDistrict] = useState("");
//   const [modalBlock, setModalBlock] = useState("");
//   const [modalSchool, setModalSchool] = useState("");
//   const [modalBatch, setModalBatch] = useState("");
//   const [modalDate, setModalDate] = useState("");

//   // Fetch and export data
//   const handleExport = async () => {
//     setExporting(true);
//     setError(null);
    
//     try {
//       // Build request body
//       const reqBody = {
//         districtId: modalDistrict ? [modalDistrict] : [],
//         blockId: modalBlock ? [modalBlock] : [],
//         schoolId: modalSchool ? [modalSchool] : [],
//         batch: modalBatch ? [modalBatch] : [],
//         startDate: modalDate
//       };
      
//       console.log("Fetching data for export:", reqBody);
      
//       const response = await GetAllMbStudentsData(reqBody);
      
//       if (response.success && response.data) {
//         // Prepare data for Excel
//         const excelData = [];
//         let sno = 1;
        
//         response.data.forEach(school => {
//           if (school.students && school.students.length > 0) {
//             school.students.forEach(student => {
//               excelData.push({
//                 'S.No': sno++,
//                 'Student SRN': student.studentSrn || 'N/A',
//                 'Student Name': `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A',
//                 "Father's Name": student.fatherName || 'N/A',
//                 'District': school.schoolDetails.districtName || 'N/A',
//                 'Block': school.schoolDetails.blockName || 'N/A',
//                 'Center (School)': school.schoolDetails.schoolName || 'N/A',
//                 'Attendance Status': student.attendanceStatus || 'Absent',
//                 'Date': modalDate || startDate || new Date().toISOString().split('T')[0],
//                 'Marked': student.isAttendanceMarked ? 'Yes' : 'No'
//               });
//             });
//           } else {
//             // School with no students - still add a row for visibility
//             excelData.push({
//               'S.No': sno++,
//               'Student SRN': 'No Students',
//               'Student Name': 'No Students Found',
//               "Father's Name": 'N/A',
//               'District': school.schoolDetails.districtName || 'N/A',
//               'Block': school.schoolDetails.blockName || 'N/A',
//               'Center (School)': school.schoolDetails.schoolName || 'N/A',
//               'Attendance Status': 'N/A',
//               'Date': modalDate || startDate || new Date().toISOString().split('T')[0],
//               'Marked': 'No'
//             });
//           }
//         });
        
//         // Create worksheet
//         const worksheet = XLSX.utils.json_to_sheet(excelData);
        
//         // Set column widths
//         worksheet['!cols'] = [
//           { wch: 6 },   // S.No
//           { wch: 15 },  // Student SRN
//           { wch: 25 },  // Student Name
//           { wch: 20 },  // Father's Name
//           { wch: 20 },  // District
//           { wch: 20 },  // Block
//           { wch: 35 },  // Center (School)
//           { wch: 18 },  // Attendance Status
//           { wch: 12 },  // Date
//           { wch: 8 }    // Marked
//         ];
        
//         // Create workbook
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Attendance');
        
//         // Generate filename
//         const fileName = `Student_Attendance_${modalDate || startDate || 'report'}_${new Date().toISOString().split('T')[0]}.xlsx`;
        
//         // Export to Excel
//         XLSX.writeFile(workbook, fileName);
        
//         // Close modal
//         setShowModal(false);
        
//         // Show success alert
//         const successAlert = document.createElement('div');
//         successAlert.className = 'alert alert-success';
//         successAlert.innerHTML = '<strong>Success!</strong> Attendance report exported successfully!';
//         successAlert.style.position = 'fixed';
//         successAlert.style.top = '20px';
//         successAlert.style.right = '20px';
//         successAlert.style.zIndex = '9999';
//         successAlert.style.padding = '15px';
//         successAlert.style.borderRadius = '5px';
//         successAlert.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
//         document.body.appendChild(successAlert);
//         setTimeout(() => successAlert.remove(), 3000);
        
//       } else {
//         setError("No data available for the selected filters");
//       }
      
//     } catch (error) {
//       console.error("Error exporting data:", error);
//       setError("Failed to export data. Please try again.");
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Reset modal filters
//   const resetFilters = () => {
//     setModalDistrict("");
//     setModalBlock("");
//     setModalSchool("");
//     setModalBatch("");
//     setModalDate("");
//   };

//   // Open modal with current context values
//   const openModal = () => {
//     setModalDistrict(schoolContext?.districtId || "");
//     setModalBlock(schoolContext?.blockId || "");
//     setModalSchool(schoolContext?.schoolId || "");
//     setModalBatch(batchContext?.batch || "");
//     setModalDate(startDate || "");
//     setShowModal(true);
//     setError(null);
//   };

//   // Download Button Component (to be used in other components)
//   const DownloadButton = ({ variant = "success", size = "md", className = "" }) => (
//     <Button
//       variant={variant}
//       size={size}
//       onClick={openModal}
//       className={`d-flex align-items-center gap-2 ${className}`}
//     >
//       <FaFileExcel /> Download Attendance Report
//     </Button>
//   );

//   return (
//     <>
//       {/* Download Button */}
//       <DownloadButton />

//       {/* Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title>
//             <FaDownload className="me-2" /> Download Student Attendance Report
//           </Modal.Title>
//         </Modal.Header>
        
//         <Modal.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
//               {error}
//             </Alert>
//           )}
          
//           <p className="text-muted mb-3">
//             Select filters below to download attendance report in Excel format.
//             All fields are optional - leave empty to include all.
//           </p>
          
//           <Form>
//             <Row>
          
             
              
//               <Col md={6} className="mb-3">
                
//                 <School_drop_down />
//               </Col>
              
//               <Col md={6} className="mb-3">
      
//                 <Batch_drop_down />
//               </Col>
              
//               <Col md={12} className="mb-3">
//                 <Form.Label>
//                   <FaCalendarAlt className="me-1" /> Date
//                 </Form.Label>
//                 <SingleDatePicker />
//               </Col>
//             </Row>
            
//             <Alert variant="info" className="mt-2">
//               <small>
//                 <strong>Note:</strong> The report will include:
//                 <ul className="mb-0 mt-1">
//                   <li>Student SRN, Name, Father's Name</li>
//                   <li>District, Block, Center</li>
//                   <li>Attendance Status (Present/Absent)</li>
//                   <li>Date of attendance</li>
//                 </ul>
//               </small>
//             </Alert>
//           </Form>
//         </Modal.Body>
        
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={handleExport}
//             disabled={exporting}
//             className="d-flex align-items-center gap-2"
//           >
//             {exporting ? (
//               <>
//                 <Spinner animation="border" size="sm" />
//                 Exporting...
//               </>
//             ) : (
//               <>
//                 <FaFileExcel /> Download Report
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// // Export the button component separately for easy ingestion
// export const AttendanceDownloadButton = ({ variant = "success", size = "md", className = "" }) => {
//   const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
//   const { startDate } = useContext(DateNDateRangeContext);
//   const { batchContext } = useContext(DistrictBlockSschoolContextV2);
//   const [showModal, setShowModal] = useState(false);
//   const [modalDistrict, setModalDistrict] = useState("");
//   const [modalBlock, setModalBlock] = useState("");
//   const [modalSchool, setModalSchool] = useState("");
//   const [modalBatch, setModalBatch] = useState("");
//   const [modalDate, setModalDate] = useState("");
//   const [exporting, setExporting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleExport = async () => {
//     setExporting(true);
//     setError(null);
    
//     try {
//       const reqBody = {
//         districtId: modalDistrict ? [modalDistrict] : [],
//         blockId: modalBlock ? [modalBlock] : [],
//         schoolId: modalSchool ? [modalSchool] : [],
//         batch: modalBatch ? [modalBatch] : [],
//         startDate: modalDate
//       };
      
//       const response = await GetAllMbStudentsData(reqBody);
      
//       if (response.success && response.data) {
//         const excelData = [];
//         let sno = 1;
        
//         response.data.forEach(school => {
//           if (school.students && school.students.length > 0) {
//             school.students.forEach(student => {
//               excelData.push({
//                 'S.No': sno++,
//                 'Student SRN': student.studentSrn || 'N/A',
//                 'Student Name': `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A',
//                 "Father's Name": student.fatherName || 'N/A',
//                 'District': school.schoolDetails.districtName || 'N/A',
//                 'Block': school.schoolDetails.blockName || 'N/A',
//                 'Center (School)': school.schoolDetails.schoolName || 'N/A',
//                 'Attendance Status': student.attendanceStatus || 'Absent',
//                 'Date': modalDate || startDate || new Date().toISOString().split('T')[0]
//               });
//             });
//           }
//         });
        
//         const worksheet = XLSX.utils.json_to_sheet(excelData);
//         worksheet['!cols'] = [
//           { wch: 6 }, { wch: 15 }, { wch: 25 }, { wch: 20 },
//           { wch: 20 }, { wch: 20 }, { wch: 35 }, { wch: 18 }, { wch: 12 }
//         ];
        
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Attendance');
        
//         const fileName = `Student_Attendance_${modalDate || startDate || 'report'}_${new Date().toISOString().split('T')[0]}.xlsx`;
//         XLSX.writeFile(workbook, fileName);
        
//         setShowModal(false);
        
//         const successAlert = document.createElement('div');
//         successAlert.className = 'alert alert-success';
//         successAlert.innerHTML = '<strong>Success!</strong> Attendance report exported successfully!';
//         successAlert.style.position = 'fixed';
//         successAlert.style.top = '20px';
//         successAlert.style.right = '20px';
//         successAlert.style.zIndex = '9999';
//         successAlert.style.padding = '15px';
//         successAlert.style.borderRadius = '5px';
//         document.body.appendChild(successAlert);
//         setTimeout(() => successAlert.remove(), 3000);
//       }
//     } catch (error) {
//       console.error("Error exporting:", error);
//       setError("Failed to export data");
//     } finally {
//       setExporting(false);
//     }
//   };

//   const openModal = () => {
//     setModalDistrict(schoolContext?.districtId || "");
//     setModalBlock(schoolContext?.blockId || "");
//     setModalSchool(schoolContext?.schoolId || "");
//     setModalBatch(batchContext?.batch || "");
//     setModalDate(startDate || "");
//     setShowModal(true);
//   };

//   return (
//     <>
//       <Button variant={variant} size={size} onClick={openModal} className={`d-flex align-items-center gap-2 ${className}`}>
//         <FaFileExcel /> Download Attendance Report
//       </Button>
      
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title><FaDownload className="me-2" /> Download Student Attendance Report</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form>
//             <Row>
//               <Col md={6} className="mb-3">
//                 <Form.Label><FaFilter className="me-1" /> District</Form.Label>
//                 <Form.Select value={modalDistrict} onChange={(e) => setModalDistrict(e.target.value)}>
//                   <option value="">All Districts</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6} className="mb-3">
//                 <Form.Label><FaFilter className="me-1" /> Block</Form.Label>
//                 <Form.Select value={modalBlock} onChange={(e) => setModalBlock(e.target.value)}>
//                   <option value="">All Blocks</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6} className="mb-3">
//                 <Form.Label><FaSchool className="me-1" /> School</Form.Label>
//                 <School_drop_down />
//               </Col>
//               <Col md={6} className="mb-3">
//                 <Form.Label><FaUsers className="me-1" /> Batch</Form.Label>
//                 <Batch_drop_down />
//               </Col>
//               <Col md={12} className="mb-3">
//                 <Form.Label><FaCalendarAlt className="me-1" /> Date</Form.Label>
//                 <SingleDatePicker />
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//           <Button variant="success" onClick={handleExport} disabled={exporting}>
//             {exporting ? <><Spinner animation="border" size="sm" /> Exporting...</> : <><FaFileExcel /> Download Report</>}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };














import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Modal, Form } from "react-bootstrap";
import { FaFileExcel, FaDownload, FaSchool, FaUsers, FaCalendarAlt, FaFilter } from "react-icons/fa";
import { GetAllMbStudentsData } from "../../service/Student.service";
import * as XLSX from 'xlsx';

export const DownloadMBStudentAttendance = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  
  // Local filter states for modal
  const [modalDistrict, setModalDistrict] = useState("");
  const [modalBlock, setModalBlock] = useState("");
  const [modalSchool, setModalSchool] = useState("");
  const [modalBatch, setModalBatch] = useState("");
  const [modalDate, setModalDate] = useState("");

  // Fetch and export data
  const handleExport = async () => {
    setExporting(true);
    setError(null);
    
    try {
      // Build request body
      const reqBody = {
        districtId: modalDistrict ? [modalDistrict] : [],
        blockId: modalBlock ? [modalBlock] : [],
        schoolId: modalSchool ? [modalSchool] : [],
        batch: modalBatch ? [modalBatch] : [],
        startDate: modalDate
      };
      
      console.log("Fetching data for export:", reqBody);
      
      const response = await GetAllMbStudentsData(reqBody);
      
      if (response.success && response.data) {
        // Prepare data for Excel
        const excelData = [];
        
        response.data.forEach(school => {
          if (school.students && school.students.length > 0) {
            school.students.forEach(student => {
              excelData.push({
                'S.No': 0, // Will be updated after sorting
                'Student SRN': student.studentSrn || 'N/A',
                'Student Name': `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A',
                "Father's Name": student.fatherName || 'N/A',
                'District': school.schoolDetails.districtName || 'N/A',
                'Block': school.schoolDetails.blockName || 'N/A',
                'Center (School)': school.schoolDetails.schoolName || 'N/A',
                'Attendance Status': student.attendanceStatus || 'Absent',
                'Date': modalDate || startDate || new Date().toISOString().split('T')[0]
              });
            });
          }
        });
        
        // Sort data: first by District, then by Block, then by Center, then by Student Name alphabetically
        const sortedData = excelData.sort((a, b) => {
          // First sort by District
          if (a.District < b.District) return -1;
          if (a.District > b.District) return 1;
          
          // Then by Block
          if (a.Block < b.Block) return -1;
          if (a.Block > b.Block) return 1;
          
          // Then by Center
          if (a['Center (School)'] < b['Center (School)']) return -1;
          if (a['Center (School)'] > b['Center (School)']) return 1;
          
          // Then by Student Name alphabetically
          if (a['Student Name'] < b['Student Name']) return -1;
          if (a['Student Name'] > b['Student Name']) return 1;
          
          return 0;
        });
        
        // Add S.No after sorting and remove temporary S.No field
        const finalData = sortedData.map((item, index) => ({
          'S.No': index + 1,
          'Student SRN': item['Student SRN'],
          'Student Name': item['Student Name'],
          "Father's Name": item["Father's Name"],
          'District': item.District,
          'Block': item.Block,
          'Center (School)': item['Center (School)'],
          'Attendance Status': item['Attendance Status'],
          'Date': item.Date
        }));
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(finalData);
        
        // Set column widths
        worksheet['!cols'] = [
          { wch: 8 },   // S.No
          { wch: 15 },  // Student SRN
          { wch: 25 },  // Student Name
          { wch: 20 },  // Father's Name
          { wch: 20 },  // District
          { wch: 20 },  // Block
          { wch: 35 },  // Center (School)
          { wch: 18 },  // Attendance Status
          { wch: 12 }   // Date
        ];
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Attendance');
        
        // Generate filename: Attendance_batchName_date.xlsx
        const batchName = modalBatch || batchContext?.batch || 'all_batches';
        const dateStr = modalDate || startDate || new Date().toISOString().split('T')[0];
        const fileName = `Attendance_${batchName}_${dateStr}.xlsx`;
        
        // Export to Excel
        XLSX.writeFile(workbook, fileName);
        
        // Close modal
        setShowModal(false);
        
        // Show success alert
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.innerHTML = '<strong>Success!</strong> Attendance report exported successfully!';
        successAlert.style.position = 'fixed';
        successAlert.style.top = '20px';
        successAlert.style.right = '20px';
        successAlert.style.zIndex = '9999';
        successAlert.style.padding = '15px';
        successAlert.style.borderRadius = '5px';
        successAlert.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        document.body.appendChild(successAlert);
        setTimeout(() => successAlert.remove(), 3000);
        
      } else {
        setError("No data available for the selected filters");
      }
      
    } catch (error) {
      console.error("Error exporting data:", error);
      setError("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Open modal with current context values
  const openModal = () => {
    setModalDistrict(schoolContext?.districtId || "");
    setModalBlock(schoolContext?.blockId || "");
    setModalSchool(schoolContext?.schoolId || "");
    setModalBatch(batchContext?.batch || "");
    setModalDate(startDate || "");
    setShowModal(true);
    setError(null);
  };

  // Download Button Component (to be used in other components)
  const DownloadButton = ({ variant = "success", size = "md", className = "" }) => (
    <Button
      variant={variant}
      size={size}
      onClick={openModal}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      <FaFileExcel /> Download Attendance Report
    </Button>
  );

  return (
    <>
      {/* Download Button */}
      <DownloadButton />

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaDownload className="me-2" /> Download Student Attendance Report
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
              {error}
            </Alert>
          )}
          
          <p className="text-muted mb-3">
            Select filters below to download attendance report in Excel format.
            All fields are optional - leave empty to include all.
          </p>
          
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <School_drop_down />
              </Col>
              
              <Col md={6} className="mb-3">
                <Batch_drop_down />
              </Col>
              
              <Col md={12} className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-1" /> Date
                </Form.Label>
                <SingleDatePicker />
              </Col>
            </Row>
            
            <Alert variant="info" className="mt-2">
              <small>
                <strong>Note:</strong> The report will be sorted by:
                <ul className="mb-0 mt-1">
                  <li>District (A-Z)</li>
                  <li>Block (A-Z)</li>
                  <li>Center (School) (A-Z)</li>
                  <li>Student Name (A-Z)</li>
                </ul>
              </small>
            </Alert>
          </Form>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleExport}
            disabled={exporting}
            className="d-flex align-items-center gap-2"
          >
            {exporting ? (
              <>
                <Spinner animation="border" size="sm" />
                Exporting...
              </>
            ) : (
              <>
                <FaFileExcel /> Download Report
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Export the button component separately for easy ingestion
export const AttendanceDownloadButton = ({ variant = "success", size = "md", className = "" }) => {
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  const [showModal, setShowModal] = useState(false);
  const [modalDistrict, setModalDistrict] = useState("");
  const [modalBlock, setModalBlock] = useState("");
  const [modalSchool, setModalSchool] = useState("");
  const [modalBatch, setModalBatch] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    
    try {
      const reqBody = {
        districtId: modalDistrict ? [modalDistrict] : [],
        blockId: modalBlock ? [modalBlock] : [],
        schoolId: modalSchool ? [modalSchool] : [],
        batch: modalBatch ? [modalBatch] : [],
        startDate: modalDate
      };
      
      const response = await GetAllMbStudentsData(reqBody);
      
      if (response.success && response.data) {
        const excelData = [];
        
        response.data.forEach(school => {
          if (school.students && school.students.length > 0) {
            school.students.forEach(student => {
              excelData.push({
                'S.No': 0,
                'Student SRN': student.studentSrn || 'N/A',
                'Student Name': `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A',
                "Father's Name": student.fatherName || 'N/A',
                'District': school.schoolDetails.districtName || 'N/A',
                'Block': school.schoolDetails.blockName || 'N/A',
                'Center (School)': school.schoolDetails.schoolName || 'N/A',
                'Attendance Status': student.attendanceStatus || 'Absent',
                'Date': modalDate || startDate || new Date().toISOString().split('T')[0]
              });
            });
          }
        });
        
        // Sort data
        const sortedData = excelData.sort((a, b) => {
          if (a.District < b.District) return -1;
          if (a.District > b.District) return 1;
          if (a.Block < b.Block) return -1;
          if (a.Block > b.Block) return 1;
          if (a['Center (School)'] < b['Center (School)']) return -1;
          if (a['Center (School)'] > b['Center (School)']) return 1;
          if (a['Student Name'] < b['Student Name']) return -1;
          if (a['Student Name'] > b['Student Name']) return 1;
          return 0;
        });
        
        const finalData = sortedData.map((item, index) => ({
          'S.No': index + 1,
          'Student SRN': item['Student SRN'],
          'Student Name': item['Student Name'],
          "Father's Name": item["Father's Name"],
          'District': item.District,
          'Block': item.Block,
          'Center (School)': item['Center (School)'],
          'Attendance Status': item['Attendance Status'],
          'Date': item.Date
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(finalData);
        worksheet['!cols'] = [
          { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 20 },
          { wch: 20 }, { wch: 20 }, { wch: 35 }, { wch: 18 }, { wch: 12 }
        ];
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Attendance');
        
        const batchName = modalBatch || batchContext?.batch || 'all_batches';
        const dateStr = modalDate || startDate || new Date().toISOString().split('T')[0];
        const fileName = `Attendance_${batchName}_${dateStr}.xlsx`;
        
        XLSX.writeFile(workbook, fileName);
        
        setShowModal(false);
        
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.innerHTML = '<strong>Success!</strong> Attendance report exported successfully!';
        successAlert.style.position = 'fixed';
        successAlert.style.top = '20px';
        successAlert.style.right = '20px';
        successAlert.style.zIndex = '9999';
        successAlert.style.padding = '15px';
        successAlert.style.borderRadius = '5px';
        document.body.appendChild(successAlert);
        setTimeout(() => successAlert.remove(), 3000);
      }
    } catch (error) {
      console.error("Error exporting:", error);
      setError("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const openModal = () => {
    setModalDistrict(schoolContext?.districtId || "");
    setModalBlock(schoolContext?.blockId || "");
    setModalSchool(schoolContext?.schoolId || "");
    setModalBatch(batchContext?.batch || "");
    setModalDate(startDate || "");
    setShowModal(true);
  };

  return (
    <>
      <Button variant={variant} size={size} onClick={openModal} className={`d-flex align-items-center gap-2 ${className}`}>
        <FaFileExcel /> Download Attendance Report
      </Button>
      
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title><FaDownload className="me-2" /> Download Student Attendance Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label><FaFilter className="me-1" /> District</Form.Label>
                <Form.Select value={modalDistrict} onChange={(e) => setModalDistrict(e.target.value)}>
                  <option value="">All Districts</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label><FaFilter className="me-1" /> Block</Form.Label>
                <Form.Select value={modalBlock} onChange={(e) => setModalBlock(e.target.value)}>
                  <option value="">All Blocks</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label><FaSchool className="me-1" /> School</Form.Label>
                <School_drop_down />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label><FaUsers className="me-1" /> Batch</Form.Label>
                <Batch_drop_down />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label><FaCalendarAlt className="me-1" /> Date</Form.Label>
                <SingleDatePicker />
              </Col>
            </Row>
            <Alert variant="info" className="mt-2">
              <small>
                <strong>Note:</strong> Report columns: S.No, Student SRN, Student Name, Father's Name, District, Block, Center, Attendance Status, Date
              </small>
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleExport} disabled={exporting}>
            {exporting ? <><Spinner animation="border" size="sm" /> Exporting...</> : <><FaFileExcel /> Download Report</>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};