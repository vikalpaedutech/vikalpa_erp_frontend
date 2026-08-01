

// import React, { useEffect, useState, useContext } from "react";
// import {
//   Button,
//   Container,
//   Card,
//   Table,
//   Form,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";

// const exportToCsv = (rows, selectedDate, classFilter) => {
//   const csvContent = [
//     ["S. No.", "District", "School", "Class", "PDF Uploaded", "Date"],
//     ...rows.map((r) => [
//       r.serial,
//       r.district,
//       r.school,
//       r.class,
//       r.pdfUploaded,
//       r.date,
//     ]),
//   ]
//     .map((row) =>
//       row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
//     )
//     .join("\n");

//   const filename = `attendancePdf_${selectedDate}_${classFilter}.csv`;
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const AttendancePdfCount = () => {
//   const { userData, setUserData } = useContext(UserContext);
//   const [pdfData, setPdfData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [startDate, setStartDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });
//   const [endDate, setEndDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [showOnlyNotUploaded, setShowOnlyNotUploaded] = useState(false);

//   const regions = userData?.userAccess?.region || [];
//   const allSchoolIds = regions.flatMap(region =>
//     region.blockIds.flatMap(block =>
//       block.schoolIds.map(school => school.schoolId)
//     )
//   );

//   const allDistrictIds = regions.map(region => region.districtId);
//   console.log(allDistrictIds);

//   const fetchPdfStatusData = async () => {
//     const payload = {
//       schoolIds: allSchoolIds,
//       startDate: startDate,
//       endDate: endDate,
//     };

//     try {
//       const response = await attendancePdfUploadStatusCountByClass(payload);
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
//           if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       sortedData.sort((a, b) =>
//         (a.districtName || "").localeCompare(b.districtName || "")
//       );

//       setPdfData(sortedData);
//     } catch (error) {
//       console.log("Error fetching attendance PDF status:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPdfStatusData();
//   }, [selectedDate, startDate, endDate]);

//   const summary = { "9": { total: 0, uploaded: 0 }, "10": { total: 0, uploaded: 0 } };

//   pdfData.forEach((school) => {
//     school.classes.forEach((cls) => {
//       if (cls.classofStudent == "9" || cls.classofStudent == "10") {
//         summary[cls.classofStudent].total += 1;
//         if (cls.pdfUploadedCount > 0) {
//           summary[cls.classofStudent].uploaded += 1;
//         }
//       }
//     });
//   });

//   const flattenedRows = [];
//   pdfData.forEach((school, schoolIndex) =>
//     school.classes.forEach((cls, classIndex) => {
//       const serial =
//         school.classes.length > 1
//           ? `${schoolIndex + 1}.${classIndex + 1}`
//           : `${schoolIndex + 1}`;
//       // Apply class filter
//       if (
//         (!userData.filterClass || userData.filterClass === "all" || cls.classofStudent === userData.filterClass) &&
//         (!showOnlyNotUploaded || cls.pdfUploadedCount === 0)
//       ) {
//         flattenedRows.push({
//           serial,
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.classofStudent,
//           pdfUploaded: cls.pdfUploadedCount > 0 ? 1 : 0,
//           date: new Date(school.date).toLocaleDateString("en-GB"),
//         });
//       }
//     })
//   );

//   const handleClassFilterChange = (filter) => {
//     setUserData({ ...userData, filterClass: filter });
//   };

//   return (
//     <Container className="mt-4">
//       <Card className="mb-3 shadow-sm p-3">
//         <Form>
//           <Form.Group as={Row} className="align-items-center">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>📅 Start Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>📅 End Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col sm={2}>
//               <Form.Check
//                 type="checkbox"
//                 label="Show only Not Uploaded"
//                 checked={showOnlyNotUploaded}
//                 onChange={(e) => setShowOnlyNotUploaded(e.target.checked)}
//               />
//             </Col>
//             <Col sm={2}>
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="All"
//                 checked={!userData.filterClass || userData.filterClass === "all"}
//                 onChange={() => handleClassFilterChange("all")}
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 9"
//                 checked={userData.filterClass === "9"}
//                 onChange={() => handleClassFilterChange("9")}
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 10"
//                 checked={userData.filterClass === "10"}
//                 onChange={() => handleClassFilterChange("10")}
//               />
//             </Col>
//             <Col sm={2}>
//               <Button
//                 variant="success"
//                 onClick={() =>
//                   exportToCsv(
//                     flattenedRows,
//                     selectedDate,
//                     userData.filterClass || "all"
//                   )
//                 }
//               >
//                 Export to CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall PDF Upload Summary</Card.Title>
//           <div>
//             <div>
//               <strong>Class 9 -</strong> Total Classes: {summary["9"].total},
//               Uploaded: {summary["9"].uploaded}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total Classes: {summary["10"].total},
//               Uploaded: {summary["10"].uploaded}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Class 9 Table */}
//       {(userData.filterClass === "9" ||
//         userData.filterClass === "all" ||
//         !userData.filterClass) && (
//         <Card className="shadow-sm mb-4">
//           <Card.Body>
//             <Card.Title>Class 9 PDF Upload Status</Card.Title>
//             <Table responsive bordered hover>
//               <thead className="table-dark text-center">
//                 <tr>
//                   <th>S. No.</th>
//                   <th>District</th>
//                   <th>School</th>
//                   <th>Class</th>
//                   <th>PDF Uploaded (1/0)</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody className="text-center">
//                 {pdfData.map((school, schoolIndex) =>
//                   school.classes
//                     .filter((cls) => cls.classofStudent == "9")
//                     .filter((cls) => !showOnlyNotUploaded || cls.pdfUploadedCount === 0)
//                     .map((cls, classIndex) => {
//                       const isUploaded = cls.pdfUploadedCount > 0;
//                       const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                       return (
//                         <tr
//                           key={`${school.schoolId}-9-${classIndex}`}
//                           style={{
//                             backgroundColor: isUploaded ? "#e6ffe6" : "#ffe6e6",
//                           }}
//                         >
//                           <td>{serialNo}</td>
//                           {classIndex === 0 && (
//                             <>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "9" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.districtName}
//                               </td>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "9" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.schoolName}
//                               </td>
//                             </>
//                           )}
//                           <td>{cls.classofStudent}</td>
//                           <td
//                             style={{
//                               backgroundColor: isUploaded ? "#ccffcc" : "#ff9999",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {isUploaded ? 1 : 0}
//                           </td>
//                           <td>{new Date(school.date).toLocaleDateString("en-GB")}</td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Class 10 Table */}
//       {(userData.filterClass === "10" ||
//         userData.filterClass === "all" ||
//         !userData.filterClass) && (
//         <Card className="shadow-sm">
//           <Card.Body>
//             <Card.Title>Class 10 PDF Upload Status</Card.Title>
//             <Table responsive bordered hover>
//               <thead className="table-dark text-center">
//                 <tr>
//                   <th>S. No.</th>
//                   <th>District</th>
//                   <th>School</th>
//                   <th>Class</th>
//                   <th>PDF Uploaded (1/0)</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody className="text-center">
//                 {pdfData.map((school, schoolIndex) =>
//                   school.classes
//                     .filter((cls) => cls.classofStudent == "10")
//                     .filter((cls) => !showOnlyNotUploaded || cls.pdfUploadedCount === 0)
//                     .map((cls, classIndex) => {
//                       const isUploaded = cls.pdfUploadedCount > 0;
//                       const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                       return (
//                         <tr
//                           key={`${school.schoolId}-10-${classIndex}`}
//                           style={{
//                             backgroundColor: isUploaded ? "#e6ffe6" : "#ffe6e6",
//                           }}
//                         >
//                           <td>{serialNo}</td>
//                           {classIndex === 0 && (
//                             <>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "10" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.districtName}
//                               </td>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "10" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.schoolName}
//                               </td>
//                             </>
//                           )}
//                           <td>{cls.classofStudent}</td>
//                           <td
//                             style={{
//                               backgroundColor: isUploaded ? "#ccffcc" : "#ff9999",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {isUploaded ? 1 : 0}
//                           </td>
//                           <td>{new Date(school.date).toLocaleDateString("en-GB")}</td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };























// import React, { useEffect, useState, useContext } from "react";
// import {
//   Button,
//   Container,
//   Card,
//   Table,
//   Form,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";
// import { uploadedAttendancePdfDashboard } from "../../service/dashboardServices/dashboardCounts.services";


// export const AttendancePdfCount = () =>{



//   return(

//     <>
//     hello
//     </>
//   )
// }






import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  Button,
  Container,
  Card,
  Table,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  ButtonGroup,
  Dropdown
} from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import { 
  FaSchool, 
  FaFilter, 
  FaDownload, 
  FaFileExcel, 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaFilePdf,
  FaCalendarAlt,
  FaInfoCircle,
  FaUndo
} from "react-icons/fa";
import { uploadedAttendancePdfDashboard } from "../../service/dashboardServices/dashboardCounts.services";
import { SingleDatePicker } from "../../components/Utils/DateNDateRangePicker";
import * as XLSX from 'xlsx';
import Region from "../../components/CentersOrSchools/DistrictBlockSchool.json";

export const AttendancePdfCount = () => {
  const { userData } = useContext(UserContext);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showNotUploadedOnly, setShowNotUploadedOnly] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sortField, setSortField] = useState("schoolName");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  // Get user's districts from userData
  const userDistricts = useMemo(() => {
    if (!userData?.userAccess?.region) return [];
    return userData.userAccess.region.map(region => region.districtId);
  }, [userData]);

  // Get user's batches from userData
  const userBatches = useMemo(() => {
    if (!userData?.userAccess?.batch) return [];
    return userData.userAccess.batch;
  }, [userData]);

  // Get unique districts from Region.json based on user's districts
  const districtOptions = useMemo(() => {
    if (!userDistricts.length) return [];
    
    const userRegionData = Region.filter(item => 
      userDistricts.includes(item.districtId)
    );
    
    const uniqueDistricts = [];
    const seen = new Set();
    userRegionData.forEach(item => {
      if (!seen.has(item.districtId)) {
        seen.add(item.districtId);
        uniqueDistricts.push({
          districtId: item.districtId,
          districtName: item.districtName
        });
      }
    });
    
    return uniqueDistricts;
  }, [userDistricts]);

  // Check if batch filter is applied
  const isBatchFilterApplied = useMemo(() => {
    return selectedBatch !== "";
  }, [selectedBatch]);

  // Prepare batch options with "Both" option
  const batchOptions = useMemo(() => {
    const options = [...userBatches];
    if (userBatches.length > 1) {
      options.push("Both");
    }
    return options;
  }, [userBatches]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedBatch("");
    setSelectedDistrict("");
    setSelectedDate(null);
    setDashboardData(null);
    setShowNotUploadedOnly(false);
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!selectedBatch) {
      setDashboardData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    let dateToUse = selectedDate;
    if (!dateToUse) {
      const today = new Date();
      dateToUse = today.toISOString().split('T')[0];
    }
    
    let batchFilter = selectedBatch;
    if (selectedBatch === "Both") {
      batchFilter = userBatches;
    }
    
    const reqBody = {
      dateOfUpload: dateToUse,
      districtIds: userDistricts.length > 0 ? userDistricts : undefined,
      batch: batchFilter
    };

    console.log("Fetching attendance PDF dashboard data with:", reqBody);
    
    try {
      const response = await uploadedAttendancePdfDashboard(reqBody);
      console.log("Dashboard response:", response);
      
      if (response.success) {
        setDashboardData(response);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show alert when any filter value changes
  useEffect(() => {
    const dateValue = selectedDate || "Today";
    const districtValue = selectedDistrict || "All";
    const batchValue = selectedBatch || "Not Selected";
    
    setAlertMessage(`Selected Filters:\n🏢 District: ${districtValue}\n📖 Batch: ${batchValue}\n📅 Date: ${dateValue}`);
    setShowAlert(true);
    
    if (selectedBatch) {
      fetchDashboardData();
    } else {
      setDashboardData(null);
    }
    
    setShowNotUploadedOnly(false);
    
    const timer = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(timer);
  }, [selectedDate, selectedDistrict, selectedBatch]);

  // Get filtered schools data with batch-wise rows for "Both"
  const getFilteredSchoolsData = () => {
    let schoolsData = dashboardData?.data || [];
    
    // Apply district filter if selected
    if (selectedDistrict) {
      schoolsData = schoolsData.filter(school => school.districtId === selectedDistrict);
    }
    
    // If "Both" is selected, create separate rows for each batch
    let expandedData = [];
    if (selectedBatch === "Both" && schoolsData.length > 0) {
      schoolsData.forEach(school => {
        // Get uploaded batches for this school
        const uploadedBatches = school.pdfDetails?.map(pdf => pdf.batch) || [];
        
        // For each user batch, create a row
        userBatches.forEach(batch => {
          const isUploaded = uploadedBatches.includes(batch);
          expandedData.push({
            ...school,
            batchDisplay: batch,
            uploadedCount: isUploaded ? 1 : 0,
            notUploadedCount: isUploaded ? 0 : 1,
            isUploaded: isUploaded
          });
        });
      });
    } else {
      // Normal data with batch info
      expandedData = schoolsData.map(school => {
        const uploadedBatches = school.pdfDetails?.map(pdf => pdf.batch) || [];
        return {
          ...school,
          batchDisplay: uploadedBatches.length > 0 ? uploadedBatches.join(', ') : 'Not Uploaded',
          isUploaded: school.uploadedCount === 1
        };
      });
    }
    
    if (showNotUploadedOnly) {
      return expandedData.filter(item => item.notUploadedCount > 0);
    }
    
    return expandedData;
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Get sorted schools data
  const getSortedSchoolsData = () => {
    const filteredSchools = getFilteredSchoolsData();
    
    const sorted = [...filteredSchools].sort((a, b) => {
      let aVal, bVal;
      
      switch(sortField) {
        case "district":
          aVal = a.districtName || "";
          bVal = b.districtName || "";
          break;
        case "block":
          aVal = a.blockName || "";
          bVal = b.blockName || "";
          break;
        case "schoolName":
          aVal = a.schoolName || "";
          bVal = b.schoolName || "";
          break;
        case "batch":
          aVal = a.batchDisplay || "";
          bVal = b.batchDisplay || "";
          break;
        case "uploadedCount":
          aVal = a.uploadedCount || 0;
          bVal = b.uploadedCount || 0;
          break;
        default:
          aVal = a.schoolName || "";
          bVal = b.schoolName || "";
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  };

  // Export Dashboard Report
  const exportDashboardReport = () => {
    try {
      setExporting(true);
      
      const filteredSchools = getSortedSchoolsData();
      const summary = dashboardData?.summary;
      
      const batchForFilename = selectedBatch === "Both" ? "Both" : selectedBatch;
      
      const summaryData = [
        { 'Report Type': 'ATTENDANCE PDF UPLOAD DASHBOARD REPORT', 'Value': '' },
        { 'Report Type': 'Generated On', 'Value': new Date().toLocaleString() },
        { 'Report Type': 'Selected Date', 'Value': summary?.date || 'Today' },
        { 'Report Type': 'Selected Batch', 'Value': selectedBatch || 'All' },
        { 'Report Type': 'Selected District', 'Value': selectedDistrict || 'All' },
        { 'Report Type': '', 'Value': '' },
        { 'Report Type': 'SUMMARY STATISTICS', 'Value': '' },
        { 'Report Type': 'Total Schools', 'Value': summary?.totalSchools || 0 },
        { 'Report Type': 'Total Uploaded', 'Value': summary?.totalUploaded || 0 },
        { 'Report Type': 'Total Not Uploaded', 'Value': summary?.totalNotUploaded || 0 },
        { 'Report Type': '', 'Value': '' }
      ];
      
      const schoolData = filteredSchools.map((school, index) => ({
        'S.No': index + 1,
        'District': school.districtName || 'N/A',
        'Block': school.blockName || 'N/A',
        'School Name': school.schoolName || 'N/A',
        'School ID': school.schoolId || 'N/A',
        'Batch': school.batchDisplay || 'N/A',
        'Uploaded': school.uploadedCount === 1 ? '✅' : '❌'
      }));
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData, { skipHeader: true });
      const schoolSheet = XLSX.utils.json_to_sheet(schoolData);
      
      schoolSheet['!cols'] = [
        { wch: 6 }, { wch: 15 }, { wch: 15 }, { wch: 35 },
        { wch: 10 }, { wch: 15 }, { wch: 12 }
      ];
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      XLSX.utils.book_append_sheet(workbook, schoolSheet, 'School-wise Report');
      
      const fileName = `Attendance_PDF_${batchForFilename}_${summary?.date || 'report'}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      showSuccessAlert('Dashboard Report exported successfully!');
      
    } catch (error) {
      console.error("Error exporting Dashboard Report:", error);
      setError("Failed to export dashboard report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Show success alert helper
  const showSuccessAlert = (message) => {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success';
    successAlert.innerText = message;
    successAlert.style.position = 'fixed';
    successAlert.style.top = '20px';
    successAlert.style.right = '20px';
    successAlert.style.zIndex = '9999';
    successAlert.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    successAlert.style.borderRadius = '8px';
    successAlert.style.padding = '15px 25px';
    document.body.appendChild(successAlert);
    setTimeout(() => successAlert.remove(), 3000);
  };

  // Summary Cards Component
  const SummaryCards = () => {
    const summary = dashboardData?.summary;
    if (!summary) return null;
    
    return (
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <FaSchool size={30} />
              <h3 className="mt-2">{summary.totalSchools}</h3>
              <p className="mb-0">Total Schools</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <FaFilePdf size={30} />
              <h3 className="mt-2">{summary.totalUploaded}</h3>
              <p className="mb-0">PDF Uploaded</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-danger text-white">
            <Card.Body>
              <FaTimesCircle size={30} />
              <h3 className="mt-2">{summary.totalNotUploaded}</h3>
              <p className="mb-0">PDF Not Uploaded</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <FaCalendarAlt size={30} />
              <h3 className="mt-2">{summary.date || 'Today'}</h3>
              <p className="mb-0">Selected Date</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Filter Button Component with Download Dropdown
  const FilterButton = () => {
    const schoolsData = getSortedSchoolsData();
    const notUploadedCount = schoolsData.filter(s => s.notUploadedCount > 0).length;
    const totalSchools = schoolsData.length;
    
    return (
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h6 className="mb-0"><FaFilter className="me-2" />Filter Options</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap align-items-center">
                <ButtonGroup>
                  <Button
                    variant={!showNotUploadedOnly ? "primary" : "outline-primary"}
                    onClick={() => setShowNotUploadedOnly(false)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaSchool /> All Schools ({totalSchools})
                  </Button>
                  <Button
                    variant={showNotUploadedOnly ? "danger" : "outline-danger"}
                    onClick={() => setShowNotUploadedOnly(true)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaTimesCircle /> Not Uploaded Only ({notUploadedCount})
                  </Button>
                </ButtonGroup>
                
                {/* Clear Filter Button */}
                <Button
                  variant="warning"
                  onClick={clearFilters}
                  className="d-flex align-items-center justify-content-center gap-2"
                  disabled={!selectedBatch && !selectedDistrict && !selectedDate}
                >
                  <FaUndo /> Clear Filters
                </Button>
                
                {/* Download Reports Dropdown */}
                <Dropdown className="ms-auto">
                  <Dropdown.Toggle 
                    variant="success" 
                    disabled={exporting || !dashboardData?.data?.length}
                    className="d-flex align-items-center gap-2"
                  >
                    {exporting ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FaDownload /> Download Reports
                      </>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={exportDashboardReport} disabled={exporting}>
                      <FaFileExcel className="me-2 text-success" />
                      Dashboard Report
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Get upload status icon
  const getUploadStatusIcon = (uploaded) => {
    if (uploaded === 1) {
      return <FaCheckCircle className="text-success" size={20} title="Uploaded" />;
    } else {
      return <FaTimesCircle className="text-danger" size={20} title="Not Uploaded" />;
    }
  };

  // School-wise Table Component
  const SchoolsTable = () => {
    const sortedSchools = getSortedSchoolsData();
    
    if (!sortedSchools || sortedSchools.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          No data available for the selected filters
        </Alert>
      );
    }
    
    const getSortIcon = (field) => {
      if (sortField !== field) return <FaSort className="ms-1" />;
      return sortOrder === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    };
    
    return (
      <div className="table-responsive">
        <Table striped bordered hover className="mt-3">
          <thead className="table-dark">
            <tr>
              <th style={{ cursor: 'pointer', width: '60px' }} onClick={() => handleSort("sno")}>S.No</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("district")}>
                District {getSortIcon("district")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("block")}>
                Block {getSortIcon("block")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("schoolName")}>
                School Name {getSortIcon("schoolName")}
              </th>
              <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => handleSort("batch")}>
                Batch {getSortIcon("batch")}
              </th>
              <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => handleSort("uploadedCount")}>
                Uploaded {getSortIcon("uploadedCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSchools.map((school, index) => (
              <tr key={`${school.schoolObjectId || index}-${school.batchDisplay || index}`} className={school.notUploadedCount > 0 ? "table-warning" : "table-success"}>
                <td>{index + 1}</td>
                <td>{school.districtName || 'N/A'}</td>
                <td>{school.blockName || 'N/A'}</td>
                <td className="fw-semibold">{school.schoolName || 'N/A'}</td>
                <td className="text-center">
                  <Badge bg={school.isUploaded ? "success" : "secondary"}>
                    {school.batchDisplay || 'N/A'}
                  </Badge>
                </td>
                <td className="text-center">
                  {getUploadStatusIcon(school.uploadedCount)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // No Batch Selected Message Component
  const NoBatchSelectedMessage = () => (
    <Card className="shadow-sm">
      <Card.Body className="text-center py-5">
        <FaInfoCircle size={50} className="text-primary mb-3" />
        <h4 className="text-primary">Please Select a Batch</h4>
        <p className="text-muted">
          Select a batch from the dropdown above to view the attendance PDF upload status.
        </p>
        {userBatches.length > 0 ? (
          <Badge bg="info" className="mt-2">
            Available Batches: {userBatches.join(', ')}
          </Badge>
        ) : (
          <Badge bg="warning" className="mt-2">
            No batches assigned to you
          </Badge>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="mt-4 mb-4">
      {showAlert && (
        <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="mb-3">
          <Alert.Heading>Selected Filters</Alert.Heading>
          <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0"><FaFilePdf className="me-2" />Attendance PDF Upload Dashboard</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                    <SingleDatePicker />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Batch <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                      <option value="">Select Batch</option>
                      {batchOptions.map((batch) => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </Form.Select>
                    {!selectedBatch && (
                      <Form.Text className="text-warning">
                        <FaInfoCircle className="me-1" />
                        Please select a batch to view data
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>District</Form.Label>
                    <Form.Select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                      <option value="">All Districts</option>
                      {districtOptions.map((district) => (
                        <option key={district.districtId} value={district.districtId}>
                          {district.districtName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {!isBatchFilterApplied ? (
        <NoBatchSelectedMessage />
      ) : loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading attendance PDF dashboard data...</p>
        </div>
      ) : (
        dashboardData && (
          <>
            <SummaryCards />
            <FilterButton />
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  {!showNotUploadedOnly ? "School-wise PDF Upload Status" : "Schools with Not Uploaded PDF"}
                  <Badge bg="light" className="ms-2 text-dark">
                    Batch: {selectedBatch}
                  </Badge>
                </h6>
              </Card.Header>
              <Card.Body>
                <SchoolsTable />
              </Card.Body>
            </Card>
          </>
        )
      )}
    </Container>
  );
};