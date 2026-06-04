import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { StudentUploadDashboard } from "../../service/StudentUploadServices/StudentUpload.services";
import { Table, Button, Form, Row, Col, Card, Badge, Spinner, Alert, ButtonGroup } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const StudentsUploadDashboard = () => {
  const location = useLocation();
  const { objectiveId, batch, objectiveName } = location.state || {};
 
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [showZeroUploadsOnly, setShowZeroUploadsOnly] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSchools, setAvailableSchools] = useState([]);

  const fetchStudentUploadDashboard = async () => {
    setLoading(true);
    setError(null);
    
    const reqBody = {
      _id: objectiveId,
      batch: batch
    };

    try {
      const response = await StudentUploadDashboard(reqBody);
      const data = response.data.data || [];
      
      // Sort data by district name
      const sortedData = [...data].sort((a, b) => a.districtName.localeCompare(b.districtName));
      
      setDashboardData(sortedData);
      setFilteredData(sortedData);
      
      // Extract unique districts for filter
      const districts = new Set();
      sortedData.forEach(item => {
        if (item.districtName) {
          districts.add(item.districtName);
        }
      });
      
      setAvailableDistricts(["all", ...Array.from(districts).sort()]);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (objectiveId) {
      fetchStudentUploadDashboard();
    }
  }, [objectiveId, batch]);

  // Update available schools when district changes
  useEffect(() => {
    if (selectedDistrict !== "all") {
      const schools = new Set();
      dashboardData
        .filter(item => item.districtName === selectedDistrict)
        .forEach(item => {
          schools.add(item.schoolName);
        });
      setAvailableSchools(["all", ...Array.from(schools).sort()]);
      setSelectedSchool("all");
    } else {
      const schools = new Set();
      dashboardData.forEach(item => {
        schools.add(item.schoolName);
      });
      setAvailableSchools(["all", ...Array.from(schools).sort()]);
      setSelectedSchool("all");
    }
  }, [selectedDistrict, dashboardData]);

  // Apply filters
  useEffect(() => {
    let filtered = [...dashboardData];
    
    // Filter by district
    if (selectedDistrict !== "all") {
      filtered = filtered.filter(item => item.districtName === selectedDistrict);
    }
    
    // Filter by school
    if (selectedSchool !== "all") {
      filtered = filtered.filter(item => item.schoolName === selectedSchool);
    }
    
    // Filter zero uploads only
    if (showZeroUploadsOnly) {
      filtered = filtered.filter(item => item.uploadedCount === 0);
    }
    
    setFilteredData(filtered);
  }, [selectedDistrict, selectedSchool, showZeroUploadsOnly, dashboardData]);

  const resetFilters = () => {
    setSelectedDistrict("all");
    setSelectedSchool("all");
    setShowZeroUploadsOnly(false);
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "District": item.districtName,
      "Block": item.blockName,
      "School Name": item.schoolName,
      "School ID": item.schoolId,
      "Total Students": item.totalStudents,
      "Uploaded Count": item.uploadedCount,
      "Pending Uploads": item.pendingUploads,
      "Completion %": item.completionPercentage + "%"
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "School wise Report");
    XLSX.writeFile(workbook, `school_wise_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Student Upload Dashboard - School Wise Report", 14, 15);
    doc.text(`Objective: ${objectiveName || objectiveId}`, 14, 25);
    doc.text(`Batch: ${batch || 'N/A'}`, 14, 35);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 45);
    
    let yPosition = 55;
    if (selectedDistrict !== "all") {
      doc.text(`Filter: District - ${selectedDistrict}`, 14, yPosition);
      yPosition += 10;
    }
    if (selectedSchool !== "all") {
      doc.text(`Filter: School - ${selectedSchool}`, 14, yPosition);
      yPosition += 10;
    }
    if (showZeroUploadsOnly) {
      doc.text(`Filter: Showing schools with zero uploads only`, 14, yPosition);
      yPosition += 10;
    }
    
    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.districtName,
      item.schoolName.substring(0, 40),
      item.blockName,
      item.totalStudents,
      item.uploadedCount,
      item.pendingUploads,
      item.completionPercentage + "%"
    ]);
    
    doc.autoTable({
      head: [["#", "District", "School Name", "Block", "Total", "Uploaded", "Pending", "Completion %"]],
      body: tableData,
      startY: yPosition,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9 }
    });
    
    doc.save(`school_wise_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading school-wise data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error!</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header with Export Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Student Upload Dashboard</h2>
          <small className="text-muted">
            School-wise report for objective: <strong>{objectiveName || objectiveId}</strong> | Batch: <strong>{batch}</strong>
          </small>
        </div>
        <ButtonGroup>
          <Button variant="success" onClick={exportToExcel}>
            <i className="bi bi-file-excel me-2"></i>Export Excel
          </Button>
          <Button variant="danger" onClick={exportToPDF}>
            <i className="bi bi-file-pdf me-2"></i>Export PDF
          </Button>
        </ButtonGroup>
      </div>

      {/* Filters Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <strong>Filters</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>District Name</Form.Label>
                <Form.Select 
                  value={selectedDistrict} 
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>
                      {district === "all" ? "All Districts" : district}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>School Name</Form.Label>
                <Form.Select 
                  value={selectedSchool} 
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={selectedDistrict === "all" && availableSchools.length === 1}
                >
                  {availableSchools.map(school => (
                    <option key={school} value={school}>
                      {school === "all" ? "All Schools" : school}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Check 
                  type="checkbox"
                  label="Show schools with zero uploads only"
                  checked={showZeroUploadsOnly}
                  onChange={(e) => setShowZeroUploadsOnly(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col className="text-end">
              <Button variant="secondary" onClick={resetFilters} size="sm">
                <i className="bi bi-arrow-repeat me-2"></i>Reset All Filters
              </Button>
            </Col>
          </Row>
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
                  <th>District</th>
                  <th>School Name</th>
                  <th>Block</th>
                  <th>Total Students</th>
                  <th>Uploaded Count</th>
                  <th>Pending Uploads</th>
                  <th>Completion %</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      No data found matching the filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.schoolId}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle">
                        <Badge bg="secondary">{item.districtName}</Badge>
                      </td>
                      <td className="align-middle">
                        <strong>{item.schoolName}</strong>
                        <br />
                        <small className="text-muted">ID: {item.schoolId}</small>
                      </td>
                      <td className="align-middle">{item.blockName}</td>
                      <td className="align-middle text-center">
                        <strong>{item.totalStudents}</strong>
                      </td>
                      <td className={`align-middle text-center fw-bold ${item.uploadedCount > 0 ? 'text-success' : 'text-muted'}`}>
                        {item.uploadedCount}
                      </td>
                      <td className="align-middle text-center text-danger fw-bold">
                        {item.pendingUploads}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-2">
                            <div className="progress" style={{ height: "8px" }}>
                              <div 
                                className={`progress-bar ${item.completionPercentage >= 70 ? 'bg-success' : item.completionPercentage >= 40 ? 'bg-warning' : 'bg-danger'}`}
                                style={{ width: `${item.completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="fw-bold">{item.completionPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Total Records:</strong> {filteredData.length}
              {filteredData.length !== dashboardData.length && (
                <span className="text-muted ms-2">
                  (Filtered from {dashboardData.length} total schools)
                </span>
              )}
            </div>
            <div className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Data sorted by district name
            </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};