import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StudentUploadObjectivesDashboard } from "../../service/StudentUploadServices/StudentUpload.services";
import { Table, Button, Form, Row, Col, Card, Badge, Spinner, Alert, ButtonGroup } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const StudentUploadObjectiveDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchObjective, setSearchObjective] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await StudentUploadObjectivesDashboard();
      const data = response.data.data || [];
      
      setDashboardData(data);
      setFilteredData(data);
      
      // Extract unique batches and subjects for filters
      const batches = new Set();
      const subjects = new Set();
      
      data.forEach(item => {
        subjects.add(item.subject);
        Object.keys(item.batchWiseStats).forEach(batch => {
          batches.add(batch);
        });
      });
      
      setAvailableBatches(["all", ...Array.from(batches)]);
      setAvailableSubjects(["all", ...Array.from(subjects)]);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...dashboardData];
    
    // Filter by batch - CRITICAL FIX: Filter the batchWiseStats object itself
    if (selectedBatch !== "all") {
      filtered = filtered.map(item => {
        // Check if the item has the selected batch
        if (item.batchWiseStats[selectedBatch]) {
          // Return only the selected batch's data
          return {
            ...item,
            batchWiseStats: {
              [selectedBatch]: item.batchWiseStats[selectedBatch]
            }
          };
        }
        return null;
      }).filter(item => item !== null);
    }
    
    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(item => item.subject === selectedSubject);
    }
    
    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(item => 
        new Date(item.dateOfObjective) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => 
        new Date(item.dateOfObjective) <= new Date(dateRange.end)
      );
    }
    
    // Filter by search term
    if (searchObjective) {
      filtered = filtered.filter(item => 
        item.objective.toLowerCase().includes(searchObjective.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchObjective.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [selectedBatch, selectedSubject, dateRange, searchObjective, dashboardData]);

  const resetFilters = () => {
    setSelectedBatch("all");
    setSelectedSubject("all");
    setDateRange({ start: "", end: "" });
    setSearchObjective("");
  };

  // Handle View Report
  const handleViewReport = (objectiveId, batch, objectiveName) => {
    // Navigate to the report page with the objective ID and batch
    navigate(`/student-upload-dashboard`, { 
      state: { objectiveId: objectiveId, batch: batch, objectiveName: objectiveName  } 
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = [];
    
    filteredData.forEach(item => {
      Object.entries(item.batchWiseStats).forEach(([batch, stats]) => {
        exportData.push({
          "Objective": item.objective,
          "Subject": item.subject,
          "Description": item.descriptionOfObject,
          "Date of Objective": new Date(item.dateOfObjective).toLocaleDateString(),
          "Submission Date": new Date(item.submissionDate).toLocaleDateString(),
          "Batch": batch,
          "Total Students": stats.totalStudents,
          "Uploaded Count": stats.uploadedCount,
          "Pending Uploads": stats.pendingUploads,
          "Completion %": stats.completionPercentage + "%"
        });
      });
    });
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Objectives Dashboard");
    XLSX.writeFile(workbook, `objectives_dashboard_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Student Upload Objectives Dashboard", 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(`Filters Applied - Batch: ${selectedBatch}, Subject: ${selectedSubject}`, 14, 35);
    
    const tableData = [];
    
    filteredData.forEach(item => {
      Object.entries(item.batchWiseStats).forEach(([batch, stats]) => {
        tableData.push([
          item.objective.substring(0, 30),
          item.subject,
          new Date(item.dateOfObjective).toLocaleDateString(),
          new Date(item.submissionDate).toLocaleDateString(),
          batch,
          stats.totalStudents,
          stats.uploadedCount,
          stats.pendingUploads,
          stats.completionPercentage + "%"
        ]);
      });
    });
    
    doc.autoTable({
      head: [["Objective", "Subject", "Date Given", "Submission Date", "Batch", "Total", "Uploaded", "Pending", "Completion %"]],
      body: tableData,
      startY: 45,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9 }
    });
    
    doc.save(`objectives_dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading dashboard data...</span>
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
          <h2 className="mb-0">Student Upload Objectives Dashboard</h2>
          <small className="text-muted">Track objective-wise student upload progress</small>
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
            <Col md={3}>
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
            
            <Col md={3}>
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
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>From Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>To Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={8}>
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
            <Col md={4} className="d-flex align-items-end">
              <Button variant="secondary" onClick={resetFilters} className="w-100">
                <i className="bi bi-arrow-repeat me-2"></i>Reset Filters
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
                {filteredData.length === 0 || filteredData.reduce((acc, item) => acc + Object.keys(item.batchWiseStats).length, 0) === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      No data found matching the filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    Object.entries(item.batchWiseStats).map(([batch, stats], batchIndex) => (
                      <tr key={`${item.objectiveId}-${batch}`}>
                        <td className="align-middle">
                          {index + 1}
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
                          {new Date(item.dateOfObjective).toLocaleDateString()}
                        </td>
                        <td className="align-middle">
                          {new Date(item.submissionDate).toLocaleDateString()}
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
                            <i className="bi bi-eye me-1"></i>View Report
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
              <strong>Total Records:</strong> {filteredData.reduce((acc, item) => acc + Object.keys(item.batchWiseStats).length, 0)}
            </div>
            <div className="text-muted">
              Showing {filteredData.length} objective(s)
            </div>
            {(selectedBatch !== "all" || selectedSubject !== "all" || dateRange.start || dateRange.end || searchObjective) && (
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