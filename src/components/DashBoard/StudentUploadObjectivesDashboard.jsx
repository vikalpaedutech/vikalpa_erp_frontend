// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { StudentUploadObjectivesDashboard } from "../../service/StudentUploadServices/StudentUpload.services";
// import { Table, Button, Form, Row, Col, Card, Badge, Spinner, Alert, ButtonGroup } from "react-bootstrap";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { StudentUploadDashboard } from "../../service/StudentUploadServices/StudentUpload.services";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { DateNDateRangePicker } from "../Utils/DateNDateRangePicker";
// export const StudentUploadObjectiveDashboard = () => {


// const {startDate, 
//       setStartDate,
//       endDate, 
//       setEndDate,
//       } = useContext(DateNDateRangeContext)

//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [exportLoading, setExportLoading] = useState(false);
  
//   // Filter states
//   const [selectedBatch, setSelectedBatch] = useState("all");
//   const [selectedSubject, setSelectedSubject] = useState("all");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [searchObjective, setSearchObjective] = useState("");
//   const [availableBatches, setAvailableBatches] = useState([]);
//   const [availableSubjects, setAvailableSubjects] = useState([]);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await StudentUploadObjectivesDashboard();
//       const data = response.data.data || [];
      
//         console.log(data)

//       setDashboardData(data);
//       setFilteredData(data);
      
//       // Extract unique batches and subjects for filters
//       const batches = new Set();
//       const subjects = new Set();
      
//       data.forEach(item => {
//         subjects.add(item.subject);
//         Object.keys(item.batchWiseStats).forEach(batch => {
//           batches.add(batch);
//         });
//       });
      
//       setAvailableBatches(["all", ...Array.from(batches)]);
//       setAvailableSubjects(["all", ...Array.from(subjects)]);
      
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setError("Failed to fetch dashboard data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...dashboardData];
    
//     // Filter by batch - CRITICAL FIX: Filter the batchWiseStats object itself
//     if (selectedBatch !== "all") {
//       filtered = filtered.map(item => {
//         // Check if the item has the selected batch
//         if (item.batchWiseStats[selectedBatch]) {
//           // Return only the selected batch's data
//           return {
//             ...item,
//             batchWiseStats: {
//               [selectedBatch]: item.batchWiseStats[selectedBatch]
//             }
//           };
//         }
//         return null;
//       }).filter(item => item !== null);
//     }
    
//     // Filter by subject
//     if (selectedSubject !== "all") {
//       filtered = filtered.filter(item => item.subject === selectedSubject);
//     }
    
//     // Filter by date range
//     if (dateRange.start) {
//       filtered = filtered.filter(item => 
//         new Date(item.dateOfObjective) >= new Date(dateRange.start)
//       );
//     }
//     if (dateRange.end) {
//       filtered = filtered.filter(item => 
//         new Date(item.dateOfObjective) <= new Date(dateRange.end)
//       );
//     }
    
//     // Filter by search term
//     if (searchObjective) {
//       filtered = filtered.filter(item => 
//         item.objective.toLowerCase().includes(searchObjective.toLowerCase()) ||
//         item.subject.toLowerCase().includes(searchObjective.toLowerCase())
//       );
//     }
    
//     setFilteredData(filtered);
//   }, [selectedBatch, selectedSubject, dateRange, searchObjective, dashboardData]);

//   const resetFilters = () => {
//     setSelectedBatch("all");
//     setSelectedSubject("all");
//     setDateRange({ start: "", end: "" });
//     setSearchObjective("");
//   };

//   // Get filtered objective IDs
//   const getFilteredObjectiveIds = () => {
//     const objectiveIds = [];
//     filteredData.forEach(item => {
//       if (item.objectiveId && !objectiveIds.includes(item.objectiveId)) {
//         objectiveIds.push(item.objectiveId);
//       }
//     });
//     return objectiveIds;
//   };

//   // Handle Show Filtered Objective IDs
//   const handleShowObjectiveIds = () => {
//     const objectiveIds = getFilteredObjectiveIds();
    
//     if (objectiveIds.length === 0) {
//       alert("No objectives found with current filters");
//     } else {
//       const objectiveIdsString = objectiveIds.join(", ");
//       alert(`Filtered Objective IDs (${objectiveIds.length}):\n\n${objectiveIdsString}`);
//     }
//   };
// // Handle Export with API data
// const handleExportWithAPI = async () => {
//   const objectiveIds = getFilteredObjectiveIds();
  
//   if (objectiveIds.length === 0) {
//     alert("No objectives found with current filters to export");
//     return;
//   }

//   setExportLoading(true);
  
//   try {
//     const exportBatch = selectedBatch !== "all" ? selectedBatch : availableBatches.find(b => b !== "all") || "2025-27";
    
//     const reqBody = {
//       _id: objectiveIds.join(','),
//       batch: exportBatch
//     };

//     const response = await StudentUploadDashboard(reqBody);
//     const objectiveWiseData = response.data.data || [];
    
//     if (objectiveWiseData.length === 0) {
//       alert("No school data found for the selected objectives");
//       setExportLoading(false);
//       return;
//     }

//     // Prepare export data in clean tabular format
//     const exportData = [];
    
//     objectiveWiseData.forEach(objective => {
//       // Get all schools with students for this objective
//       const schoolsWithStudents = objective.schools.filter(school => school.hasStudents);
      
//       if (schoolsWithStudents.length === 0) {
//         // If no schools have students, still show the objective with empty school data
//         exportData.push({
//           "Objective ID": objective.objectiveId,
//           "Objective Name": objective.objectiveName,
//           "Subject": objective.subject,
//           "Date of Objective": new Date(objective.dateOfObjective).toLocaleDateString(),
//           "Submission Date": new Date(objective.submissionDate).toLocaleDateString(),
//           "Batch": objective.batch,
//           "Total Objectives": "",
//           "School Name": "No schools found with students",
//           "District": "",
//           "Block": "",
//           "School Total Students": 0,
//           "School Uploaded": 0,
//           "School Pending": 0,
//           "School Completion %": "0%",
//           "Objective Total Students": objective.totalStudents,
//           "Objective Total Uploads": objective.totalUploads,
//           "Objective Total Pending": objective.totalPending,
//           "Objective Completion %": objective.completionPercentage + "%"
//         });
//       } else {
//         // Add a row for each school
//         schoolsWithStudents.forEach((school, idx) => {
//           exportData.push({
//             "Objective ID": idx === 0 ? objective.objectiveId : "",
//             "Objective Name": idx === 0 ? objective.objectiveName : "",
//             "Subject": idx === 0 ? objective.subject : "",
//             "Date of Objective": idx === 0 ? new Date(objective.dateOfObjective).toLocaleDateString() : "",
//             "Submission Date": idx === 0 ? new Date(objective.submissionDate).toLocaleDateString() : "",
//             "Batch": idx === 0 ? objective.batch : "",
//             "Total Objectives": "",
//             "School Name": school.schoolName,
//             "District": school.districtName,
//             "Block": school.blockName,
//             "School Total Students": school.totalStudents,
//             "School Uploaded": school.uploadedCount,
//             "School Pending": school.pendingUploads,
//             "School Completion %": school.completionPercentage + "%",
//             "Objective Total Students": idx === 0 ? objective.totalStudents : "",
//             "Objective Total Uploads": idx === 0 ? objective.totalUploads : "",
//             "Objective Total Pending": idx === 0 ? objective.totalPending : "",
//             "Objective Completion %": idx === 0 ? objective.completionPercentage + "%" : ""
//           });
//         });
//       }
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Objective-wise School Report");
    
//     // Auto-size columns
//     const maxWidth = 20;
//     worksheet['!cols'] = [
//       { wch: 25 }, // Objective ID
//       { wch: 35 }, // Objective Name
//       { wch: 15 }, // Subject
//       { wch: 18 }, // Date of Objective
//       { wch: 18 }, // Submission Date
//       { wch: 12 }, // Batch
//       { wch: 15 }, // Total Objectives
//       { wch: 30 }, // School Name
//       { wch: 20 }, // District
//       { wch: 20 }, // Block
//       { wch: 18 }, // School Total Students
//       { wch: 15 }, // School Uploaded
//       { wch: 15 }, // School Pending
//       { wch: 18 }, // School Completion %
//       { wch: 22 }, // Objective Total Students
//       { wch: 22 }, // Objective Total Uploads
//       { wch: 22 }, // Objective Total Pending
//       { wch: 22 }  // Objective Completion %
//     ];
    
//     XLSX.writeFile(workbook, `objective_wise_school_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
//     alert(`Export successful! ${objectiveWiseData.length} objective(s) exported with ${exportData.length} school records.`);
    
//   } catch (error) {
//     console.error("Error exporting data:", error);
//     alert("Failed to export data. Please try again.");
//   } finally {
//     setExportLoading(false);
//   }
// };
//   // Handle View Report
//   const handleViewReport = (objectiveId, batch, objectiveName) => {
//     // Navigate to the report page with the objective ID and batch
//     navigate(`/student-upload-dashboard`, { 
//       state: { objectiveId: objectiveId, batch: batch, objectiveName: objectiveName  } 
//     });
//   };

//   // Export to Excel (existing table data)
//   const exportToExcel = () => {
//     const exportData = [];
    
//     filteredData.forEach(item => {
//       Object.entries(item.batchWiseStats).forEach(([batch, stats]) => {
//         exportData.push({
//           "Objective ID": item.objectiveId,
//           "Objective": item.objective,
//           "Subject": item.subject,
//           "Description": item.descriptionOfObject,
//           "Date of Objective": new Date(item.dateOfObjective).toLocaleDateString(),
//           "Submission Date": new Date(item.submissionDate).toLocaleDateString(),
//           "Batch": batch,
//           "Total Students": stats.totalStudents,
//           "Uploaded Count": stats.uploadedCount,
//           "Pending Uploads": stats.pendingUploads,
//           "Completion %": stats.completionPercentage + "%"
//         });
//       });
//     });
    
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Objectives Dashboard");
//     XLSX.writeFile(workbook, `objectives_dashboard_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   // Export to PDF (existing table data)
//   const exportToPDF = () => {
//     const doc = new jsPDF();
    
//     doc.text("Student Upload Objectives Dashboard", 14, 15);
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
//     doc.text(`Filters Applied - Batch: ${selectedBatch}, Subject: ${selectedSubject}`, 14, 35);
    
//     const tableData = [];
    
//     filteredData.forEach(item => {
//       Object.entries(item.batchWiseStats).forEach(([batch, stats]) => {
//         tableData.push([
//           item.objectiveId,
//           item.objective.substring(0, 25),
//           item.subject,
//           new Date(item.dateOfObjective).toLocaleDateString(),
//           new Date(item.submissionDate).toLocaleDateString(),
//           batch,
//           stats.totalStudents,
//           stats.uploadedCount,
//           stats.pendingUploads,
//           stats.completionPercentage + "%"
//         ]);
//       });
//     });
    
//     doc.autoTable({
//       head: [["ID", "Objective", "Subject", "Date Given", "Submission Date", "Batch", "Total", "Uploaded", "Pending", "Completion %"]],
//       body: tableData,
//       startY: 45,
//       theme: "striped",
//       styles: { fontSize: 7, cellPadding: 2 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 8 }
//     });
    
//     doc.save(`objectives_dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
//         <Spinner animation="border" variant="primary" />
//         <span className="ms-3">Loading dashboard data...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="danger" className="m-3">
//         <Alert.Heading>Error!</Alert.Heading>
//         <p>{error}</p>
//       </Alert>
//     );
//   }

//   const objectiveIdsCount = getFilteredObjectiveIds().length;

//   return (
//     <div className="container-fluid p-4">
//       {/* Header with Export Buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="mb-0">Student Upload Objectives Dashboard</h2>
//           <small className="text-muted">Track objective-wise student upload progress</small>
//         </div>
//         <div>
//           <ButtonGroup className="me-2">
//             <Button variant="success" onClick={exportToExcel}>
//               <i className="bi bi-file-excel me-2"></i>Export Excel
//             </Button>
//             <Button variant="danger" onClick={exportToPDF}>
//               <i className="bi bi-file-pdf me-2"></i>Export PDF
//             </Button>
//             <Button 
//               variant="warning" 
//               onClick={handleExportWithAPI}
//               disabled={exportLoading || objectiveIdsCount === 0}
//             >
//               {exportLoading ? (
//                 <>
//                   <Spinner as="span" animation="border" size="sm" className="me-2" />
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-download me-2"></i>Export School Report
//                 </>
//               )}
//             </Button>
//           </ButtonGroup>
//           <Button 
//             variant="info" 
//             onClick={handleShowObjectiveIds}
//             className="text-white"
//           >
//             <i className="bi bi-tags me-2"></i>Show Objective IDs ({objectiveIdsCount})
//           </Button>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Header className="bg-light">
//             <DateNDateRangePicker/>
//           <strong>Filters</strong>
//         </Card.Header>
//         <Card.Body>
//           <Row>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Batch</Form.Label>
//                 <Form.Select 
//                   value={selectedBatch} 
//                   onChange={(e) => setSelectedBatch(e.target.value)}
//                 >
//                   {availableBatches.map(batch => (
//                     <option key={batch} value={batch}>
//                       {batch === "all" ? "All Batches" : batch}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
            
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Subject</Form.Label>
//                 <Form.Select 
//                   value={selectedSubject} 
//                   onChange={(e) => setSelectedSubject(e.target.value)}
//                 >
//                   {availableSubjects.map(subject => (
//                     <option key={subject} value={subject}>
//                       {subject === "all" ? "All Subjects" : subject}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
            
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>From Date</Form.Label>
//                 <Form.Control 
//                   type="date" 
//                   value={dateRange.start}
//                   onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
//                 />
//               </Form.Group>
//             </Col>
            
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>To Date</Form.Label>
//                 <Form.Control 
//                   type="date" 
//                   value={dateRange.end}
//                   onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
          
//           <Row className="mt-3">
//             <Col md={8}>
//               <Form.Group>
//                 <Form.Label>Search Objective/Subject</Form.Label>
//                 <Form.Control 
//                   type="text" 
//                   placeholder="Search by objective name or subject..."
//                   value={searchObjective}
//                   onChange={(e) => setSearchObjective(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4} className="d-flex align-items-end">
//               <Button variant="secondary" onClick={resetFilters} className="w-100">
//                 <i className="bi bi-arrow-repeat me-2"></i>Reset Filters
//               </Button>
//             </Col>
//           </Row>
//           {(dateRange.start || dateRange.end) && (
//             <Row className="mt-2">
//               <Col>
//                 <Alert variant="info" className="mb-0 py-2">
//                   <i className="bi bi-info-circle me-2"></i>
//                   Date range filter active. <strong>{objectiveIdsCount}</strong> objective(s) found. Click "Export School Report" to get school-wise data for these objectives.
//                 </Alert>
//               </Col>
//             </Row>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Data Table */}
//       <Card className="shadow-sm">
//         <Card.Body className="p-0">
//           <div className="table-responsive">
//             <Table striped bordered hover className="mb-0">
//               <thead className="bg-primary text-white">
//                 <tr>
//                   <th>#</th>
//                   <th>Objective ID</th>
//                   <th>Objective</th>
//                   <th>Subject</th>
//                   <th>Date of Objective</th>
//                   <th>Submission Date</th>
//                   <th>Batch</th>
//                   <th>Total Students</th>
//                   <th>Uploaded Count</th>
//                   <th>Pending Uploads</th>
//                   <th>Completion %</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length === 0 || filteredData.reduce((acc, item) => acc + Object.keys(item.batchWiseStats).length, 0) === 0 ? (
//                   <tr>
//                     <td colSpan="12" className="text-center py-5">
//                       No data found matching the filters
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((item, index) => (
//                     Object.entries(item.batchWiseStats).map(([batch, stats], batchIndex) => (
//                       <tr key={`${item.objectiveId}-${batch}`}>
//                         <td className="align-middle">
//                           {index + 1}
//                         </td>
//                         <td className="align-middle">
//                           <code><small>{item.objectiveId}</small></code>
//                         </td>
//                         <td className="align-middle">
//                           <div><strong>{item.objective}</strong></div>
//                           {item.descriptionOfObject && (
//                             <small className="text-muted">{item.descriptionOfObject.substring(0, 100)}</small>
//                           )}
//                         </td>
//                         <td className="align-middle">
//                           <Badge bg="info">{item.subject}</Badge>
//                         </td>
//                         <td className="align-middle">
//                           {new Date(item.dateOfObjective).toLocaleDateString()}
//                         </td>
//                         <td className="align-middle">
//                           {new Date(item.submissionDate).toLocaleDateString()}
//                         </td>
//                         <td className="align-middle">
//                           <Badge bg="secondary">{batch}</Badge>
//                         </td>
//                         <td className="align-middle text-center">
//                           <strong>{stats.totalStudents}</strong>
//                         </td>
//                         <td className="align-middle text-success fw-bold text-center">
//                           {stats.uploadedCount}
//                         </td>
//                         <td className="align-middle text-danger fw-bold text-center">
//                           {stats.pendingUploads}
//                         </td>
//                         <td className="align-middle">
//                           <div className="d-flex align-items-center">
//                             <div className="flex-grow-1 me-2">
//                               <div className="progress" style={{ height: "8px" }}>
//                                 <div 
//                                   className={`progress-bar ${stats.completionPercentage >= 70 ? 'bg-success' : stats.completionPercentage >= 40 ? 'bg-warning' : 'bg-danger'}`}
//                                   style={{ width: `${stats.completionPercentage}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                             <span className="fw-bold">{stats.completionPercentage}%</span>
//                           </div>
//                         </td>
//                         <td className="align-middle">
//                           <Button 
//                             variant="primary" 
//                             size="sm"
//                             onClick={() => handleViewReport(item.objectiveId, batch, item.objective)}
//                           >
//                             <i className="bi bi-eye me-1"></i>View
//                           </Button>
//                         </td>
//                       </tr>
//                     ))
//                   ))
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//         <Card.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <strong>Total Records:</strong> {filteredData.reduce((acc, item) => acc + Object.keys(item.batchWiseStats).length, 0)}
//             </div>
//             <div className="text-muted">
//               Showing {filteredData.length} objective(s)
//             </div>
//             {(selectedBatch !== "all" || selectedSubject !== "all" || dateRange.start || dateRange.end || searchObjective) && (
//               <Button 
//                 variant="link" 
//                 size="sm" 
//                 onClick={resetFilters}
//                 className="text-decoration-none"
//               >
//                 Clear all filters
//               </Button>
//             )}
//           </div>
//         </Card.Footer>
//       </Card>
//     </div>
//   );
// };




import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StudentUploadObjectivesDashboard } from "../../service/StudentUploadServices/StudentUpload.services";
import { Table, Button, Form, Row, Col, Card, Badge, Spinner, Alert, ButtonGroup } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { StudentUploadDashboard } from "../../service/StudentUploadServices/StudentUpload.services";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { DateNDateRangePicker } from "../Utils/DateNDateRangePicker";
import JSZip from 'jszip'; // <-- ADD THIS LINE
export const StudentUploadObjectiveDashboard = () => {
  const { 
    dateRange,
    setStartDate,
    setEndDate
  } = useContext(DateNDateRangeContext);

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Filter states
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchObjective, setSearchObjective] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  // Use ref to prevent multiple API calls
  const isFetchingRef = useRef(false);
  const prevDateRangeRef = useRef(null);

  // Get current date for default date range
  const getCurrentDateRange = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: firstDayOfMonth.toISOString().split('T')[0],
      endDate: lastDayOfMonth.toISOString().split('T')[0]
    };
  };

  const fetchDashboardData = async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) return;
    
    // Check if date range is available
    if (!dateRange?.startDate?.queryFormat || !dateRange?.endDate?.queryFormat) {
      console.log("No date range selected, skipping fetch");
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // Create reqBody with date range from context
      const reqBody = {
        startDate: dateRange.startDate.queryFormat,
        endDate: dateRange.endDate.queryFormat,
        batch: selectedBatch !== "all" ? selectedBatch : null,
        subject: selectedSubject !== "all" ? selectedSubject : null
      };

      console.log("Fetching dashboard data with reqBody:", reqBody);
      
      const response = await StudentUploadObjectivesDashboard(reqBody);
      const data = response.data.data || [];
      
      console.log("Dashboard response:", data);

      setDashboardData(data);
      setFilteredData(data);
      
      // Extract unique batches and subjects for filters
      const batches = new Set();
      const subjects = new Set();
      
      data.forEach(item => {
        if (item.subject) subjects.add(item.subject);
        if (item.batchWiseStats) {
          Object.keys(item.batchWiseStats).forEach(batch => {
            batches.add(batch);
          });
        }
      });
      
      // Convert to array and sort
      const sortedBatches = ["all", ...Array.from(batches).sort()];
      const sortedSubjects = ["all", ...Array.from(subjects).sort()];
      
      setAvailableBatches(sortedBatches);
      setAvailableSubjects(sortedSubjects);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Fetch data when date range changes
  useEffect(() => {
    // Check if date range has actually changed
    const currentDateRangeKey = `${dateRange?.startDate?.queryFormat}_${dateRange?.endDate?.queryFormat}`;
    const prevDateRangeKey = prevDateRangeRef.current;
    
    if (dateRange?.startDate?.queryFormat && dateRange?.endDate?.queryFormat) {
      // Only fetch if date range is different from previous or if it's the first time
      if (currentDateRangeKey !== prevDateRangeKey) {
        prevDateRangeRef.current = currentDateRangeKey;
        fetchDashboardData();
      }
    }
  }, [dateRange?.startDate?.queryFormat, dateRange?.endDate?.queryFormat]);

  // Fetch data when batch or subject changes (only if date range is selected)
  useEffect(() => {
    if (dateRange?.startDate?.queryFormat && dateRange?.endDate?.queryFormat) {
      fetchDashboardData();
    }
  }, [selectedBatch, selectedSubject]);

  // Apply local search filter
  useEffect(() => {
    if (!dashboardData.length) return;
    
    let filtered = [...dashboardData];
    
    // Filter by search term
    if (searchObjective) {
      filtered = filtered.filter(item => 
        (item.objective && item.objective.toLowerCase().includes(searchObjective.toLowerCase())) ||
        (item.subject && item.subject.toLowerCase().includes(searchObjective.toLowerCase()))
      );
    }
    
    setFilteredData(filtered);
  }, [searchObjective, dashboardData]);

  const resetFilters = () => {
    // Reset batch and subject filters
    setSelectedBatch("all");
    setSelectedSubject("all");
    setSearchObjective("");
    
    // Reset date range to current month
    const { startDate, endDate } = getCurrentDateRange();
    
    // Update the date range context
    if (setStartDate && setEndDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };

  // Get filtered objective IDs
  const getFilteredObjectiveIds = () => {
    const objectiveIds = [];
    filteredData.forEach(item => {
      if (item.objectiveId && !objectiveIds.includes(item.objectiveId)) {
        objectiveIds.push(item.objectiveId);
      }
    });
    return objectiveIds;
  };

  // Handle Show Filtered Objective IDs
  const handleShowObjectiveIds = () => {
    const objectiveIds = getFilteredObjectiveIds();
    
    if (objectiveIds.length === 0) {
      alert("No objectives found with current filters");
    } else {
      const objectiveIdsString = objectiveIds.join(", ");
      alert(`Filtered Objective IDs (${objectiveIds.length}):\n\n${objectiveIdsString}`);
    }
  };
  
// // Handle Export with API data - School-wise rows with repeated objective names
// const handleExportWithAPI = async () => {
//   if (filteredData.length === 0) {
//     alert("No data available to export");
//     return;
//   }

//   setExportLoading(true);
  
//   try {
//     // Group objectives by batch
//     const objectivesByBatch = {};
    
//     filteredData.forEach(objective => {
//       const batch = objective.batch;
//       if (!objectivesByBatch[batch]) {
//         objectivesByBatch[batch] = [];
//       }
//       objectivesByBatch[batch].push(objective);
//     });
    
//     const batches = Object.keys(objectivesByBatch);
    
//     // If multiple batches, create separate files
//     if (batches.length > 1) {
//       const zip = new JSZip();
      
//       for (const batch of batches) {
//         const objectives = objectivesByBatch[batch];
//         const exportData = [];
        
//         // Prepare data - each school as separate row with objective name repeated
//         objectives.forEach(objective => {
//           const schools = objective.schoolWiseDetails?.schools || [];
          
//           if (schools.length === 0) {
//             // One row with no school
//             exportData.push({
//               "Objective Name": objective.objectiveName,
//               "Date of Objective": objective.dateOfObjective ? new Date(objective.dateOfObjective).toLocaleDateString() : "",
//               "Batch": batch,
//               "District Name": "",
//               "School Name": "No schools found",
//               "Total Students": 0,
//               "Uploaded Count": 0,
//               "Pending Uploads": 0,
//               "Completion %": "0%",
//               "Objective Total Students": objective.overallStats?.totalStudents || 0,
//               "Objective Total Uploads": objective.overallStats?.totalUploads || 0,
//               "Objective Completion %": (objective.overallStats?.completionPercentage || 0) + "%"
//             });
//           } else {
//             // Each school gets its own row with objective name repeated
//             schools.forEach(school => {
//               exportData.push({
//                 "Objective Name": objective.objectiveName,
//                 "Date of Objective": objective.dateOfObjective ? new Date(objective.dateOfObjective).toLocaleDateString() : "",
//                 "Batch": batch,
//                 "District Name": school.districtName || "",
//                 "School Name": school.schoolName || "",
//                 "Total Students": school.totalStudents || 0,
//                 "Uploaded Count": school.uploadedCount || 0,
//                 "Pending Uploads": school.pendingUploads || 0,
//                 "Completion %": school.completionPercentage + "%",
//                 "Objective Total Students": objective.overallStats?.totalStudents || 0,
//                 "Objective Total Uploads": objective.overallStats?.totalUploads || 0,
//                 "Objective Completion %": (objective.overallStats?.completionPercentage || 0) + "%"
//               });
//             });
//           }
//         });
        
//         // Create worksheet
//         const worksheet = XLSX.utils.json_to_sheet(exportData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, `Batch_${batch}_Report`);
        
//         // Auto-size columns
//         worksheet['!cols'] = [
//           { wch: 35 }, // Objective Name
//           { wch: 18 }, // Date of Objective
//           { wch: 12 }, // Batch
//           { wch: 20 }, // District Name
//           { wch: 35 }, // School Name
//           { wch: 15 }, // Total Students
//           { wch: 15 }, // Uploaded Count
//           { wch: 15 }, // Pending Uploads
//           { wch: 15 }, // Completion %
//           { wch: 22 }, // Objective Total Students
//           { wch: 22 }, // Objective Total Uploads
//           { wch: 22 }  // Objective Completion %
//         ];
        
//         const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
//         zip.file(`Objective_Wise_School_Report_Batch_${batch}_${dateRange?.startDate?.YYYYMMDD || 'report'}.xlsx`, excelData);
//       }
      
//       // Generate and download zip file
//       const zipBlob = await zip.generateAsync({ type: 'blob' });
//       const zipUrl = URL.createObjectURL(zipBlob);
//       const zipLink = document.createElement('a');
//       zipLink.href = zipUrl;
//       zipLink.download = `Objective_Reports_${dateRange?.startDate?.YYYYMMDD || 'report'}_to_${dateRange?.endDate?.YYYYMMDD || 'report'}.zip`;
//       document.body.appendChild(zipLink);
//       zipLink.click();
//       document.body.removeChild(zipLink);
//       URL.revokeObjectURL(zipUrl);
      
//       alert(`Export successful! ${batches.length} batch(es) exported as separate Excel files in ZIP.`);
      
//     } else {
//       // Single batch - create single Excel file
//       const batch = batches[0];
//       const objectives = objectivesByBatch[batch];
//       const exportData = [];
      
//       // Prepare data - each school as separate row with objective name repeated
//       objectives.forEach(objective => {
//         const schools = objective.schoolWiseDetails?.schools || [];
        
//         if (schools.length === 0) {
//           exportData.push({
//             "Objective Name": objective.objectiveName,
//             "Date of Objective": objective.dateOfObjective ? new Date(objective.dateOfObjective).toLocaleDateString() : "",
//             "Batch": batch,
//             "District Name": "",
//             "School Name": "No schools found",
//             "Total Students": 0,
//             "Uploaded Count": 0,
//             "Pending Uploads": 0,
//             "Completion %": "0%",
//             "Objective Total Students": objective.overallStats?.totalStudents || 0,
//             "Objective Total Uploads": objective.overallStats?.totalUploads || 0,
//             "Objective Completion %": (objective.overallStats?.completionPercentage || 0) + "%"
//           });
//         } else {
//           // Each school gets its own row with objective name repeated
//           schools.forEach(school => {
//             exportData.push({
//               "Objective Name": objective.objectiveName,
//               "Date of Objective": objective.dateOfObjective ? new Date(objective.dateOfObjective).toLocaleDateString() : "",
//               "Batch": batch,
//               "District Name": school.districtName || "",
//               "School Name": school.schoolName || "",
//               "Total Students": school.totalStudents || 0,
//               "Uploaded Count": school.uploadedCount || 0,
//               "Pending Uploads": school.pendingUploads || 0,
//               "Completion %": school.completionPercentage + "%",
//               "Objective Total Students": objective.overallStats?.totalStudents || 0,
//               "Objective Total Uploads": objective.overallStats?.totalUploads || 0,
//               "Objective Completion %": (objective.overallStats?.completionPercentage || 0) + "%"
//             });
//           });
//         }
//       });
      
//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, `Batch_${batch}_Report`);
      
//       // Auto-size columns
//       worksheet['!cols'] = [
//         { wch: 35 }, // Objective Name
//         { wch: 18 }, // Date of Objective
//         { wch: 12 }, // Batch
//         { wch: 20 }, // District Name
//         { wch: 35 }, // School Name
//         { wch: 15 }, // Total Students
//         { wch: 15 }, // Uploaded Count
//         { wch: 15 }, // Pending Uploads
//         { wch: 15 }, // Completion %
//         { wch: 22 }, // Objective Total Students
//         { wch: 22 }, // Objective Total Uploads
//         { wch: 22 }  // Objective Completion %
//       ];
      
//       const fileName = `Objective_Wise_School_Report_${batch}_${dateRange?.startDate?.YYYYMMDD || 'start'}_to_${dateRange?.endDate?.YYYYMMDD || 'end'}.xlsx`;
//       XLSX.writeFile(workbook, fileName);
      
//       alert(`Export successful! ${objectives.length} objective(s) exported for batch ${batch}`);
//     }
    
//   } catch (error) {
//     console.error("Error exporting data:", error);
//     alert("Failed to export data. Please try again.");
//   } finally {
//     setExportLoading(false);
//   }
// };



// Handle Export with API data - One row per school with multiple objective columns
const handleExportWithAPI = async () => {
  if (filteredData.length === 0) {
    alert("No data available to export");
    return;
  }

  setExportLoading(true);
  
  try {
    // Group objectives by batch
    const objectivesByBatch = {};
    
    filteredData.forEach(objective => {
      const batch = objective.batch;
      if (!objectivesByBatch[batch]) {
        objectivesByBatch[batch] = [];
      }
      objectivesByBatch[batch].push(objective);
    });
    
    const batches = Object.keys(objectivesByBatch);
    
    // If multiple batches, create separate files
    if (batches.length > 1) {
      const zip = new JSZip();
      
      for (const batch of batches) {
        const objectives = objectivesByBatch[batch];
        
        // Create a map of school data for this batch
        const schoolMap = new Map();
        
        objectives.forEach(objective => {
          const schools = objective.schoolWiseDetails?.schools || [];
          
          schools.forEach(school => {
            const schoolKey = `${school.schoolId}`;
            if (!schoolMap.has(schoolKey)) {
              schoolMap.set(schoolKey, {
                schoolName: school.schoolName,
                districtName: school.districtName,
                blockName: school.blockName,
                totalStudents: school.totalStudents,
                objectiveUploads: {}
              });
            }
            
            const schoolData = schoolMap.get(schoolKey);
            schoolData.objectiveUploads[objective.objectiveName] = {
              uploadedCount: school.uploadedCount,
              pendingUploads: school.pendingUploads
            };
          });
        });
        
        // Convert map to array and sort by District Name then School Name
        let schoolsArray = Array.from(schoolMap, ([schoolId, schoolData]) => ({
          schoolId,
          ...schoolData
        }));
        
        // Sort by District Name first, then School Name
        schoolsArray.sort((a, b) => {
          const districtCompare = (a.districtName || "").localeCompare(b.districtName || "");
          if (districtCompare !== 0) return districtCompare;
          return (a.schoolName || "").localeCompare(b.schoolName || "");
        });
        
        // Prepare export data - one row per school with S.No
        const exportData = [];
        let serialNo = 1;
        
        // Create headers
        const baseHeaders = ["S.No", "District Name", "School Name", "Total Students"];
        const objectiveHeaders = [];
        
        objectives.forEach(objective => {
          objectiveHeaders.push(`${objective.objectiveName} (Uploaded Count)`);
          objectiveHeaders.push(`${objective.objectiveName} (Pending Uploads)`);
        });
        
        // Create rows
        for (const school of schoolsArray) {
          const row = {
            "S.No": serialNo++,
            "District Name": school.districtName || "",
            "School Name": school.schoolName || "",
            "Total Students": school.totalStudents || 0
          };
          
          objectives.forEach(objective => {
            const uploads = school.objectiveUploads[objective.objectiveName] || {
              uploadedCount: 0,
              pendingUploads: 0
            };
            
            row[`${objective.objectiveName} (Uploaded Count)`] = uploads.uploadedCount;
            row[`${objective.objectiveName} (Pending Uploads)`] = uploads.pendingUploads;
          });
          
          exportData.push(row);
        }
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Batch_${batch}_Report`);
        
        // Auto-size columns
        const allHeaders = [...baseHeaders, ...objectiveHeaders];
        const colWidths = allHeaders.map(header => ({ wch: Math.max(header.length, 20) }));
        worksheet['!cols'] = colWidths;
        
        const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        zip.file(`School_Wise_Objective_Report_Batch_${batch}_${dateRange?.startDate?.YYYYMMDD || 'report'}.xlsx`, excelData);
      }
      
      // Generate and download zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const zipLink = document.createElement('a');
      zipLink.href = zipUrl;
      zipLink.download = `School_Wise_Reports_${dateRange?.startDate?.YYYYMMDD || 'report'}_to_${dateRange?.endDate?.YYYYMMDD || 'report'}.zip`;
      document.body.appendChild(zipLink);
      zipLink.click();
      document.body.removeChild(zipLink);
      URL.revokeObjectURL(zipUrl);
      
      alert(`Export successful! ${batches.length} batch(es) exported as separate Excel files in ZIP.`);
      
    } else {
      // Single batch - create single Excel file
      const batch = batches[0];
      const objectives = objectivesByBatch[batch];
      
      // Create a map of school data for this batch
      const schoolMap = new Map();
      
      objectives.forEach(objective => {
        const schools = objective.schoolWiseDetails?.schools || [];
        
        schools.forEach(school => {
          const schoolKey = `${school.schoolId}`;
          if (!schoolMap.has(schoolKey)) {
            schoolMap.set(schoolKey, {
              schoolName: school.schoolName,
              districtName: school.districtName,
              blockName: school.blockName,
              totalStudents: school.totalStudents,
              objectiveUploads: {}
            });
          }
          
          const schoolData = schoolMap.get(schoolKey);
          schoolData.objectiveUploads[objective.objectiveName] = {
            uploadedCount: school.uploadedCount,
            pendingUploads: school.pendingUploads
          };
        });
      });
      
      // Convert map to array and sort by District Name then School Name
      let schoolsArray = Array.from(schoolMap, ([schoolId, schoolData]) => ({
        schoolId,
        ...schoolData
      }));
      
      // Sort by District Name first, then School Name
      schoolsArray.sort((a, b) => {
        const districtCompare = (a.districtName || "").localeCompare(b.districtName || "");
        if (districtCompare !== 0) return districtCompare;
        return (a.schoolName || "").localeCompare(b.schoolName || "");
      });
      
      // Prepare export data - one row per school with S.No
      const exportData = [];
      let serialNo = 1;
      
      for (const school of schoolsArray) {
        const row = {
          "S.No": serialNo++,
          "District Name": school.districtName || "",
          "School Name": school.schoolName || "",
          "Total Students": school.totalStudents || 0
        };
        
        objectives.forEach(objective => {
          const uploads = school.objectiveUploads[objective.objectiveName] || {
            uploadedCount: 0,
            pendingUploads: 0
          };
          
          row[`${objective.objectiveName} (Uploaded Count)`] = uploads.uploadedCount;
          row[`${objective.objectiveName} (Pending Uploads)`] = uploads.pendingUploads;
        });
        
        exportData.push(row);
      }
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Batch_${batch}_Report`);
      
      // Auto-size columns
      const baseHeaders = ["S.No", "District Name", "School Name", "Total Students"];
      const objectiveHeaders = [];
      objectives.forEach(objective => {
        objectiveHeaders.push(`${objective.objectiveName} (Uploaded Count)`);
        objectiveHeaders.push(`${objective.objectiveName} (Pending Uploads)`);
      });
      const allHeaders = [...baseHeaders, ...objectiveHeaders];
      const colWidths = allHeaders.map(header => ({ wch: Math.max(header.length, 20) }));
      worksheet['!cols'] = colWidths;
      
      const fileName = `School_Wise_Objective_Report_${batch}_${dateRange?.startDate?.YYYYMMDD || 'start'}_to_${dateRange?.endDate?.YYYYMMDD || 'end'}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert(`Export successful! ${schoolsArray.length} school(s) exported for batch ${batch}`);
    }
    
  } catch (error) {
    console.error("Error exporting data:", error);
    alert("Failed to export data. Please try again.");
  } finally {
    setExportLoading(false);
  }
};



  // Handle View Report
  const handleViewReport = (objectiveId, batch, objectiveName) => {
    navigate(`/student-upload-dashboard`, { 
      state: { 
        objectiveId: objectiveId, 
        batch: batch, 
        objectiveName: objectiveName,
        startDate: dateRange?.startDate?.queryFormat,
        endDate: dateRange?.endDate?.queryFormat
      } 
    });
  };

  // Export to Excel (current table data)
  const exportToExcel = () => {
    const exportData = [];
    
    filteredData.forEach(item => {
      if (item.batchWiseStats) {
        Object.entries(item.batchWiseStats).forEach(([batch, stats]) => {
          exportData.push({
            "Objective ID": item.objectiveId,
            "Objective": item.objective,
            "Subject": item.subject,
            "Description": item.descriptionOfObject,
            "Date of Objective": item.dateOfObjective ? new Date(item.dateOfObjective).toLocaleDateString() : "",
            "Submission Date": item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : "",
            "Batch": batch,
            "Total Students": stats.totalStudents,
            "Uploaded Count": stats.uploadedCount,
            "Pending Uploads": stats.pendingUploads,
            "Completion %": stats.completionPercentage + "%",
            "Date Range": `${dateRange?.startDate?.DDMMYYYY || 'N/A'} to ${dateRange?.endDate?.DDMMYYYY || 'N/A'}`
          });
        });
      }
    });
    
    if (exportData.length === 0) {
      alert("No data to export");
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Objectives Dashboard");
    XLSX.writeFile(workbook, `objectives_dashboard_${dateRange?.startDate?.YYYYMMDD || 'report'}_to_${dateRange?.endDate?.YYYYMMDD || 'report'}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
    
    const doc = new jsPDF();
    
    doc.text("Student Upload Objectives Dashboard", 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(`Date Range: ${dateRange?.startDate?.DDMMYYYY || 'N/A'} to ${dateRange?.endDate?.DDMMYYYY || 'N/A'}`, 14, 35);
    doc.text(`Filters Applied - Batch: ${selectedBatch}, Subject: ${selectedSubject}`, 14, 45);
    
    const tableData = [];
    
    filteredData.forEach(item => {
      if (item.batchWiseStats) {
        Object.entries(item.batchWiseStats).forEach(([batch, stats]) => {
          tableData.push([
            item.objectiveId,
            (item.objective || "").substring(0, 25),
            item.subject || "",
            item.dateOfObjective ? new Date(item.dateOfObjective).toLocaleDateString() : "",
            item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : "",
            batch,
            stats.totalStudents,
            stats.uploadedCount,
            stats.pendingUploads,
            stats.completionPercentage + "%"
          ]);
        });
      }
    });
    
    doc.autoTable({
      head: [["ID", "Objective", "Subject", "Date Given", "Submission Date", "Batch", "Total", "Uploaded", "Pending", "Completion %"]],
      body: tableData,
      startY: 55,
      theme: "striped",
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 8 }
    });
    
    doc.save(`objectives_dashboard_${dateRange?.startDate?.YYYYMMDD || 'report'}_to_${dateRange?.endDate?.YYYYMMDD || 'report'}.pdf`);
  };

  const getDateRangeDisplay = () => {
    if (dateRange?.startDate?.DDMMYYYY && dateRange?.endDate?.DDMMYYYY) {
      return `${dateRange.startDate.DDMMYYYY} to ${dateRange.endDate.DDMMYYYY}`;
    }
    return "Select date range";
  };

  // Check if date range is selected
  if (!dateRange?.startDate?.queryFormat || !dateRange?.endDate?.queryFormat) {
    return (
      <div className="container-fluid p-4">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <h4>Please select a date range</h4>
            <p className="text-muted">Use the date picker above to select start and end dates</p>
            <DateNDateRangePicker />
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (loading && !dashboardData.length) {
    return (
      <div className="container-fluid p-4">
        <DateNDateRangePicker />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <DateNDateRangePicker />
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  const objectiveIdsCount = getFilteredObjectiveIds().length;
  const totalRecords = filteredData.reduce((acc, item) => acc + (item.batchWiseStats ? Object.keys(item.batchWiseStats).length : 0), 0);

  return (
    <div className="container-fluid p-4">
      {/* Date Range Picker */}
      <div className="mb-4">
        <DateNDateRangePicker />
      </div>

      {/* Header with Export Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Student Upload Objectives Dashboard</h2>
          <small className="text-muted">Track objective-wise student upload progress</small>
          <div className="mt-1">
            <Badge bg="info" className="me-2">
              <i className="bi bi-calendar me-1"></i>
              Date Range: {getDateRangeDisplay()}
            </Badge>
            {selectedBatch !== "all" && (
              <Badge bg="secondary" className="me-2">
                Batch: {selectedBatch}
              </Badge>
            )}
            {selectedSubject !== "all" && (
              <Badge bg="secondary">
                Subject: {selectedSubject}
              </Badge>
            )}
          </div>
        </div>
        <div>
          <ButtonGroup className="me-2">
            <Button variant="success" onClick={exportToExcel} disabled={!filteredData.length}>
              <i className="bi bi-file-excel me-2"></i>Export Excel
            </Button>
            <Button variant="danger" onClick={exportToPDF} disabled={!filteredData.length}>
              <i className="bi bi-file-pdf me-2"></i>Export PDF
            </Button>
            <Button 
              variant="warning" 
              onClick={handleExportWithAPI}
              disabled={exportLoading || objectiveIdsCount === 0}
            >
              {exportLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>Export School Report
                </>
              )}
            </Button>
          </ButtonGroup>
          <Button 
            variant="info" 
            onClick={handleShowObjectiveIds}
            className="text-white"
            disabled={!filteredData.length}
          >
            <i className="bi bi-tags me-2"></i>Show Objective IDs ({objectiveIdsCount})
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <strong>Additional Filters</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Batch</Form.Label>
                <Form.Select 
                  value={selectedBatch} 
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  {availableBatches.map(batch => (
                    <option key={batch} value={batch}>
                      {batch === "all" ? "All Batches" : batch}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search Objective/Subject</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Search by objective name or subject..."
                  value={searchObjective}
                  onChange={(e) => setSearchObjective(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={12} className="d-flex justify-content-end">
              <Button variant="secondary" onClick={resetFilters}>
                <i className="bi bi-arrow-repeat me-2"></i>Clear Filters
              </Button>
            </Col>
          </Row>
          
          {filteredData.length === 0 && dashboardData.length > 0 && (
            <Row className="mt-2">
              <Col>
                <Alert variant="warning" className="mb-0 py-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No objectives found matching the selected filters.
                </Alert>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Objective ID</th>
                  <th>Objective</th>
                  <th>Subject</th>
                  <th>Date of Objective</th>
                  <th>Submission Date</th>
                  <th>Batch</th>
                  <th>Total Students</th>
                  <th>Uploaded Count</th>
                  <th>Pending Uploads</th>
                  <th>Completion %</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 || totalRecords === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-5">
                      {loading ? "Loading..." : "No data found matching the filters"}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    item.batchWiseStats && Object.entries(item.batchWiseStats).map(([batch, stats], batchIndex) => (
                      <tr key={`${item.objectiveId}-${batch}`}>
                        <td className="align-middle">{index + 1}</td>
                        <td className="align-middle">
                          <code><small>{item.objectiveId}</small></code>
                        </td>
                        <td className="align-middle">
                          <div><strong>{item.objective}</strong></div>
                          {item.descriptionOfObject && (
                            <small className="text-muted">{item.descriptionOfObject.substring(0, 100)}</small>
                          )}
                        </td>
                        <td className="align-middle">
                          <Badge bg="info">{item.subject}</Badge>
                        </td>
                        <td className="align-middle">
                          {item.dateOfObjective ? new Date(item.dateOfObjective).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="align-middle">
                          {item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="align-middle">
                          <Badge bg="secondary">{batch}</Badge>
                        </td>
                        <td className="align-middle text-center">
                          <strong>{stats.totalStudents}</strong>
                        </td>
                        <td className="align-middle text-success fw-bold text-center">
                          {stats.uploadedCount}
                        </td>
                        <td className="align-middle text-danger fw-bold text-center">
                          {stats.pendingUploads}
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-2">
                              <div className="progress" style={{ height: "8px" }}>
                                <div 
                                  className={`progress-bar ${stats.completionPercentage >= 70 ? 'bg-success' : stats.completionPercentage >= 40 ? 'bg-warning' : 'bg-danger'}`}
                                  style={{ width: `${stats.completionPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="fw-bold">{stats.completionPercentage}%</span>
                          </div>
                        </td>
                        <td className="align-middle">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleViewReport(item.objectiveId, batch, item.objective)}
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Total Records:</strong> {totalRecords}
            </div>
            <div className="text-muted">
              Showing {filteredData.length} objective(s) for date range: {getDateRangeDisplay()}
            </div>
            {(selectedBatch !== "all" || selectedSubject !== "all" || searchObjective) && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={resetFilters}
                className="text-decoration-none"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};