import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { Container, Card, Button, Badge, Spinner, Row, Col, Alert, Table, ButtonGroup } from "react-bootstrap";
import { FaSchool, FaChartLine, FaUsers, FaFilter, FaDownload, FaFileExcel, FaSort, FaSortUp, FaSortDown, FaPhoneAlt, FaPhoneSlash, FaUserSlash, FaCheckCircle, FaTimesCircle, FaUserCheck } from "react-icons/fa";
import { StudentAbsenteeCallingDashboard } from "../../service/Student.service";
import * as XLSX from 'xlsx';

export const MBStudentsAbsenteeCallingDashboard = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showNoCallsOnly, setShowNoCallsOnly] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sortField, setSortField] = useState("schoolName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedSchools, setExpandedSchools] = useState(new Set());

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const reqBody = {
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      date: startDate,
      districtId: schoolContext?.districtId,
      blockId: schoolContext?.blockId
    };

    console.log("Fetching absentee calling dashboard data with:", reqBody);
    
    try {
      const response = await StudentAbsenteeCallingDashboard(reqBody);
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
    const schoolValue = schoolContext?.schoolId || "All";
    const batchValue = batchContext?.batch || "All";
    const dateValue = startDate || "All";
    const districtValue = schoolContext?.districtId || "All";
    const blockValue = schoolContext?.blockId || "All";
    
    setAlertMessage(`Selected Filters:\n🏢 District: ${districtValue}\n🏘️ Block: ${blockValue}\n📚 School: ${schoolValue}\n📖 Batch: ${batchValue}\n📅 Date: ${dateValue}`);
    setShowAlert(true);
    
    if (batchContext?.batch && startDate) {
      fetchDashboardData();
    }
    
    setShowNoCallsOnly(false);
    
    const timer = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(timer);
  }, [schoolContext, batchContext, startDate]);

  // Toggle school expansion
  const toggleSchoolExpansion = (schoolId) => {
    const newExpanded = new Set(expandedSchools);
    if (newExpanded.has(schoolId)) {
      newExpanded.delete(schoolId);
    } else {
      newExpanded.add(schoolId);
    }
    setExpandedSchools(newExpanded);
  };

  // Get filtered schools data
  const getFilteredSchoolsData = () => {
    const schoolsData = dashboardData?.schoolsData || [];
    
    if (showNoCallsOnly) {
      return schoolsData.filter(school => school.notCalledCount > 0);
    }
    
    return schoolsData;
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
          aVal = a.schoolDetails.districtName || "";
          bVal = b.schoolDetails.districtName || "";
          break;
        case "block":
          aVal = a.schoolDetails.blockName || "";
          bVal = b.schoolDetails.blockName || "";
          break;
        case "schoolName":
          aVal = a.schoolDetails.schoolName || "";
          bVal = b.schoolDetails.schoolName || "";
          break;
        case "totalAbsentStudents":
          aVal = a.totalAbsentStudents || 0;
          bVal = b.totalAbsentStudents || 0;
          break;
        case "connectedCount":
          aVal = a.connectedCount || 0;
          bVal = b.connectedCount || 0;
          break;
        case "notConnectedCount":
          aVal = a.notConnectedCount || 0;
          bVal = b.notConnectedCount || 0;
          break;
        case "notCalledCount":
          aVal = a.notCalledCount || 0;
          bVal = b.notCalledCount || 0;
          break;
        default:
          aVal = a.schoolDetails.schoolName || "";
          bVal = b.schoolDetails.schoolName || "";
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      setExporting(true);
      
      const filteredSchools = getSortedSchoolsData();
      const summary = dashboardData?.summary;
      
      const summaryData = [
        { 'Report Type': 'ABSENTEE CALLING DASHBOARD REPORT', 'Value': '' },
        { 'Report Type': 'Generated On', 'Value': new Date().toLocaleString() },
        { 'Report Type': 'Selected Date', 'Value': dashboardData?.filters?.date || 'All' },
        { 'Report Type': 'Selected Batch', 'Value': dashboardData?.filters?.batch || 'All' },
        { 'Report Type': 'Selected District', 'Value': dashboardData?.filters?.districtId || 'All' },
        { 'Report Type': 'Selected Block', 'Value': dashboardData?.filters?.blockId || 'All' },
        { 'Report Type': 'Selected School', 'Value': dashboardData?.filters?.schoolId || 'All' },
        { 'Report Type': '', 'Value': '' },
        { 'Report Type': 'SUMMARY STATISTICS', 'Value': '' },
        { 'Report Type': 'Total Schools', 'Value': summary?.totalSchools || 0 },
        { 'Report Type': 'Total Absent Students', 'Value': summary?.totalAbsentStudents || 0 },
        { 'Report Type': 'Connected', 'Value': `${summary?.connectedCount || 0} (${summary?.connectedPercentage || 0}%)` },
        { 'Report Type': 'Not Connected', 'Value': `${summary?.notConnectedCount || 0} (${summary?.notConnectedPercentage || 0}%)` },
        { 'Report Type': 'Not Called', 'Value': `${summary?.notCalledCount || 0} (${summary?.notCalledPercentage || 0}%)` },
        { 'Report Type': '', 'Value': '' }
      ];
      
      const schoolData = filteredSchools.map((school, index) => ({
        'S.No': index + 1,
        'District': school.schoolDetails.districtName || 'N/A',
        'Block': school.schoolDetails.blockName || 'N/A',
        'School Name': school.schoolDetails.schoolName || 'N/A',
        'School ID': school.schoolDetails.schoolId || 'N/A',
        'Total Absent Students': school.totalAbsentStudents,
        'Connected': school.connectedCount,
        'Not Connected': school.notConnectedCount,
        'Not Called': school.notCalledCount
      }));
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData, { skipHeader: true });
      const schoolSheet = XLSX.utils.json_to_sheet(schoolData);
      
      schoolSheet['!cols'] = [
        { wch: 6 }, { wch: 15 }, { wch: 15 }, { wch: 35 },
        { wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 12 }
      ];
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      XLSX.utils.book_append_sheet(workbook, schoolSheet, 'School-wise Report');
      
      const fileName = `Absentee_Calling_Report_${dashboardData?.filters?.date || 'report'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      setTimeout(() => {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.innerText = 'Report exported successfully!';
        successAlert.style.position = 'fixed';
        successAlert.style.top = '20px';
        successAlert.style.right = '20px';
        successAlert.style.zIndex = '9999';
        document.body.appendChild(successAlert);
        setTimeout(() => successAlert.remove(), 3000);
      }, 100);
      
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export report. Please try again.");
    } finally {
      setExporting(false);
    }
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
          <Card className="text-center shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <FaUsers size={30} />
              <h3 className="mt-2">{summary.totalAbsentStudents}</h3>
              <p className="mb-0">Total Absent Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <FaPhoneAlt size={30} />
              <h3 className="mt-2">{summary.connectedCount}</h3>
              <p className="mb-0">Connected ({summary.connectedPercentage}%)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-danger text-white">
            <Card.Body>
              <FaPhoneSlash size={30} />
              <h3 className="mt-2">{summary.notConnectedCount}</h3>
              <p className="mb-0">Not Connected ({summary.notConnectedPercentage}%)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Additional Stats Cards
  const AdditionalStats = () => {
    const summary = dashboardData?.summary;
    if (!summary) return null;
    
    return (
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100 border-0 bg-light">
            <Card.Body className="text-center">
              <FaUserSlash size={30} className="text-danger mb-2" />
              <h4 className="text-danger">{summary.notCalledCount}</h4>
              <p className="mb-0 text-muted">Not Called ({summary.notCalledPercentage}%)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100 border-0 bg-light">
            <Card.Body className="text-center">
              <FaCheckCircle size={30} className="text-success mb-2" />
              <h4 className="text-success">{summary.connectedCount}</h4>
              <p className="mb-0 text-muted">Connected</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100 border-0 bg-light">
            <Card.Body className="text-center">
              <FaTimesCircle size={30} className="text-warning mb-2" />
              <h4 className="text-warning">{summary.notConnectedCount}</h4>
              <p className="mb-0 text-muted">Not Connected</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Filter Button Component
  const FilterButton = () => {
    const schoolsData = getFilteredSchoolsData();
    const noCallsCount = schoolsData.filter(s => s.notCalledCount > 0).length;
    const totalSchools = schoolsData.length;
    
    return (
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h6 className="mb-0"><FaFilter className="me-2" />Filter Options</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <ButtonGroup>
                  <Button
                    variant={!showNoCallsOnly ? "primary" : "outline-primary"}
                    onClick={() => setShowNoCallsOnly(false)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaSchool /> All Schools ({totalSchools})
                  </Button>
                  <Button
                    variant={showNoCallsOnly ? "danger" : "outline-danger"}
                    onClick={() => setShowNoCallsOnly(true)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUserSlash /> Not Called Students Only ({noCallsCount})
                  </Button>
                </ButtonGroup>
                <Button
                  variant="success"
                  onClick={exportToExcel}
                  disabled={exporting || !dashboardData?.schoolsData?.length}
                  className="d-flex align-items-center justify-content-center gap-2 ms-auto"
                >
                  {exporting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaFileExcel /> Export to Excel
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  // Get status badge
  const getCallingStatusBadge = (category) => {
    switch(category) {
      case "Connected":
        return <Badge bg="success"><FaPhoneAlt className="me-1" size={10} /> Connected</Badge>;
      case "Not Connected":
        return <Badge bg="danger"><FaPhoneSlash className="me-1" size={10} /> Not Connected</Badge>;
      default:
        return <Badge bg="secondary"><FaUserSlash className="me-1" size={10} /> Not Called</Badge>;
    }
  };

  // Student Table Component for expanded view
  const StudentTable = ({ students }) => {
    if (!students || students.length === 0) {
      return <p className="text-muted text-center">No students data available</p>;
    }

    return (
      <div className="table-responsive mt-3">
        <Table size="sm" bordered striped>
          <thead className="table-secondary">
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Father's Name</th>
              <th>Mother's Name</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th>Calling Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.studentId}>
                <td>{idx + 1}</td>
                <td>{student.studentName || "N/A"}</td>
                <td>{student.studentUserId || student.studentId?.slice(-6) || "N/A"}</td>
                <td>{student.fatherName || "N/A"}</td>
                <td>{student.motherName || "N/A"}</td>
                <td>{student.contact1 || student.contact2 || "N/A"}</td>
                <td>{getCallingStatusBadge(student.callingCategory)}</td>
                <td>
                  {student.absenteeCallingStatus || 
                   (student.callingCategory === "Not Called" ? "Not Called" : "N/A")}
                </td>
                <td>
                  {student.callingRemark1 || student.callingRemark2 || student.comments || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // School-wise Table Component with Expand/Collapse
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
              {/* <th style={{ width: "40px" }}>Expand</th> */}
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("sno")}>S.No</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("district")}>
                District {getSortIcon("district")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("block")}>
                Block {getSortIcon("block")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("schoolName")}>
                School Name {getSortIcon("schoolName")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("totalAbsentStudents")}>
                Total Absent {getSortIcon("totalAbsentStudents")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("connectedCount")}>
                Connected {getSortIcon("connectedCount")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("notConnectedCount")}>
                Not Connected {getSortIcon("notConnectedCount")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("notCalledCount")}>
                Not Called {getSortIcon("notCalledCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSchools.map((school, index) => (
              <React.Fragment key={school.schoolDetails.schoolId}>
                <tr className={school.notCalledCount > 0 ? "table-warning" : ""}>
                  {/* <td className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => toggleSchoolExpansion(school.schoolDetails.schoolId)}
                      className="p-0"
                    >
                      {expandedSchools.has(school.schoolDetails.schoolId) ? "▼" : "▶"}
                    </Button>
                  </td> */}
                  <td>{index + 1}</td>
                  <td>{school.schoolDetails.districtName || 'N/A'}</td>
                  <td>{school.schoolDetails.blockName || 'N/A'}</td>
                  <td className="fw-semibold">{school.schoolDetails.schoolName || 'N/A'}</td>
                  <td className="text-center text-warning fw-bold">{school.totalAbsentStudents}</td>
                  <td className="text-center text-success">
                    <FaPhoneAlt className="me-1" /> {school.connectedCount}
                  </td>
                  <td className="text-center text-danger">
                    <FaPhoneSlash className="me-1" /> {school.notConnectedCount}
                  </td>
                  <td className="text-center text-secondary">
                    <FaUserSlash className="me-1" /> {school.notCalledCount}
                  </td>
                </tr>
                {expandedSchools.has(school.schoolDetails.schoolId) && (
                  <tr>
                    <td colSpan="9" className="p-3 bg-light">
                      <h6 className="mb-3">Student Details - {school.schoolDetails.schoolName}</h6>
                      <StudentTable students={school.students} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // Progress Bar Component
  const ProgressBar = () => {
    const summary = dashboardData?.summary;
    if (!summary) return null;
    
    const total = summary.totalAbsentStudents;
    const connected = summary.connectedCount;
    const notConnected = summary.notConnectedCount;
    const notCalled = summary.notCalledCount;
    
    const connectedPercent = (connected / total) * 100;
    const notConnectedPercent = (notConnected / total) * 100;
    const notCalledPercent = (notCalled / total) * 100;
    
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-info text-white">
          <h6 className="mb-0"><FaChartLine className="me-2" />Calling Status Overview</h6>
        </Card.Header>
        <Card.Body>
          <div className="progress" style={{ height: '30px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${connectedPercent}%` }}
              title={`Connected: ${connected} (${summary.connectedPercentage}%)`}
            >
              {connectedPercent > 10 && `Connected ${connected} (${summary.connectedPercentage}%)`}
            </div>
            <div 
              className="progress-bar bg-danger" 
              style={{ width: `${notConnectedPercent}%` }}
              title={`Not Connected: ${notConnected} (${summary.notConnectedPercentage}%)`}
            >
              {notConnectedPercent > 10 && `Not Connected ${notConnected} (${summary.notConnectedPercentage}%)`}
            </div>
            <div 
              className="progress-bar bg-secondary" 
              style={{ width: `${notCalledPercent}%` }}
              title={`Not Called: ${notCalled} (${summary.notCalledPercentage}%)`}
            >
              {notCalledPercent > 10 && `Not Called ${notCalled} (${summary.notCalledPercentage}%)`}
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-around">
            <div><Badge bg="success">Connected</Badge> {summary.connectedPercentage}%</div>
            <div><Badge bg="danger">Not Connected</Badge> {summary.notConnectedPercentage}%</div>
            <div><Badge bg="secondary">Not Called</Badge> {summary.notCalledPercentage}%</div>
          </div>
        </Card.Body>
      </Card>
    );
  };

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
              <h5 className="mb-0"><FaPhoneAlt className="me-2" />Absentee Calling Dashboard</h5>
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

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading absentee calling dashboard data...</p>
        </div>
      ) : (
        dashboardData && (
          <>
            <SummaryCards />
            <AdditionalStats />
            <ProgressBar />
            <FilterButton />
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  {!showNoCallsOnly ? "School-wise Absentee Calling Report" : "Schools with Not Called Students"}
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