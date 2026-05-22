import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Container, Row, Col, Card, Button, Alert, Spinner, Table, Badge, ProgressBar } from "react-bootstrap";
import { CloudUpload, Download, FileExcel, CheckCircle, XCircle, InfoCircle } from "react-bootstrap-icons";
import { CreateStudent as CreateStudentAPI } from "../../service/Student.service.js";

export const CreateStudentBulk = () => {
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [failedRecords, setFailedRecords] = useState([]);

  // Helper function to parse dates in multiple formats
  const parseDate = (dateValue) => {
    if (!dateValue || dateValue === '' || dateValue === null) return null;
    
    // If it's already a Date object
    if (dateValue instanceof Date) {
      // Set to midnight UTC to avoid timezone issues
      return new Date(Date.UTC(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()));
    }
    
    // If it's a number (Excel serial date)
    if (typeof dateValue === 'number') {
      const date = new Date((dateValue - 25569) * 86400000);
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }
    
    // Convert to string and trim
    const dateStr = String(dateValue).trim();
    
    // Try different date formats
    let day, month, year;
    
    // Format: DD-MM-YYYY or DD/MM/YYYY
    if (dateStr.match(/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/)) {
      const parts = dateStr.split(/[-/]/);
      day = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1;
      year = parseInt(parts[2]);
    }
    // Format: YYYY-MM-DD or YYYY/MM/DD
    else if (dateStr.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/)) {
      const parts = dateStr.split(/[-/]/);
      year = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1;
      day = parseInt(parts[2]);
    }
    // Format: MM/DD/YYYY (US format)
    else if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateStr.split('/');
      month = parseInt(parts[0]) - 1;
      day = parseInt(parts[1]);
      year = parseInt(parts[2]);
    }
    else {
      // Try JavaScript's Date parsing as last resort
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
      }
      return null;
    }
    
    // Validate date
    if (year && month !== undefined && day) {
      const date = new Date(Date.UTC(year, month, day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    return null;
  };

  // Download template
  const downloadTemplate = () => {
    const templateData = [
      {
        studentSrn: "STU2024001",
        rollNumber: "2024001",
        firstName: "Raj",
        lastName: "Kumar",
        fatherName: "Ramesh Kumar",
        motherName: "Sita Devi",
        email: "raj.kumar@example.com",
        personalContact: "9876543210",
        ParentContact: "9988776655",
        otherContact: "",
        dob: "15-05-2010",
        gender: "Male",
        category: "General",
        address: "123 Main Street",
        districtId: "DIST001",
        blockId: "BLK001",
        schoolId: "SCH001",
        classofStudent: "10",
        parent: "",
        enrollmentDate: "15-01-2024",
        batch: "2024-25",
        session1: "Mathematics",
        session2: "Science",
        singleSideDistance: "5",
        bothSideDistance: "10",
        slc: "false",
        isSlcTaken: "false",
        slcReleasingDate: "",
        erpEnrollingDate: "16-01-2024",
        medium: "CBSE",
        isStudentOf: "MB",
        isDressGiven: "false",
        isTabGiven: "false",
        tabIMEI: "",
        isSimGiven: "false",
        simNumber: "",
        simIMSI: "",
        bankName: "State Bank of India",
        bankIFSC: "SBIN0012345",
        bankAccNumber: "123456789012",
        bankHolderName: "Raj Kumar",
        batchCompleted: "false",
        shirtSizeInInches: "28",
        waistSizeInInches: "26",
        waistToBottomLengthInInches: "30",
        dressAmountSubmitted: "false",
        dressSizeConfirmationForm: "",
        examinationVenue: "School Premises"
      }
    ];

    const instructionsData = [
      { "Field Name": "studentSrn", "Description": "Unique Student Registration Number", "Required": "Yes", "Example": "STU2024001", "Valid Values": "Any unique string" },
      { "Field Name": "rollNumber", "Description": "Student Roll Number", "Required": "Yes", "Example": "2024001", "Valid Values": "Any unique string" },
      { "Field Name": "firstName", "Description": "Student's First Name", "Required": "Yes", "Example": "Raj", "Valid Values": "Any text" },
      { "Field Name": "lastName", "Description": "Student's Last Name", "Required": "No", "Example": "Kumar", "Valid Values": "Any text" },
      { "Field Name": "fatherName", "Description": "Father's Name", "Required": "No", "Example": "Ramesh Kumar", "Valid Values": "Any text" },
      { "Field Name": "motherName", "Description": "Mother's Name", "Required": "No", "Example": "Sita Devi", "Valid Values": "Any text" },
      { "Field Name": "email", "Description": "Email Address", "Required": "No", "Example": "raj@example.com", "Valid Values": "Valid email format" },
      { "Field Name": "personalContact", "Description": "Student's Contact Number", "Required": "No", "Example": "9876543210", "Valid Values": "10 digit number" },
      { "Field Name": "ParentContact", "Description": "Parent's Contact Number", "Required": "No", "Example": "9988776655", "Valid Values": "10 digit number" },
      { "Field Name": "otherContact", "Description": "Alternative Contact Number", "Required": "No", "Example": "", "Valid Values": "10 digit number" },
      { "Field Name": "dob", "Description": "Date of Birth", "Required": "No", "Example": "15-05-2010", "Valid Values": "DD-MM-YYYY, YYYY-MM-DD, or any valid date format" },
      { "Field Name": "gender", "Description": "Gender", "Required": "Yes", "Example": "Male", "Valid Values": "Male/Female/Other" },
      { "Field Name": "category", "Description": "Category", "Required": "No", "Example": "General", "Valid Values": "General/OBC/SC/ST" },
      { "Field Name": "address", "Description": "Student's Address", "Required": "No", "Example": "123 Main Street", "Valid Values": "Any text" },
      { "Field Name": "districtId", "Description": "District ID", "Required": "Yes", "Example": "DIST001", "Valid Values": "Valid district ID from system" },
      { "Field Name": "blockId", "Description": "Block ID", "Required": "Yes", "Example": "BLK001", "Valid Values": "Valid block ID from system" },
      { "Field Name": "schoolId", "Description": "School ID", "Required": "Yes", "Example": "SCH001", "Valid Values": "Valid school ID from system" },
      { "Field Name": "classofStudent", "Description": "Class", "Required": "Yes", "Example": "10", "Valid Values": "1-12" },
      { "Field Name": "medium", "Description": "Education Medium", "Required": "Yes", "Example": "CBSE", "Valid Values": "CBSE/HBSE" },
      { "Field Name": "isStudentOf", "Description": "Student Type", "Required": "Yes", "Example": "MB", "Valid Values": "MB/S100/Others" }
    ];

    const wb = XLSX.utils.book_new();
    const dataWs = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, dataWs, "Student Data");
    const instructionsWs = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(wb, instructionsWs, "Instructions");
    XLSX.writeFile(wb, "student_template.xlsx");
  };

  // Download error report
  const downloadErrorReport = () => {
    if (!failedRecords.length) return;
    
    const errorData = failedRecords.map(record => ({
      "Row Number": record.row,
      "Student SRN": record.data?.studentSrn || 'N/A',
      "Roll Number": record.data?.rollNumber || 'N/A',
      "First Name": record.data?.firstName || 'N/A',
      "Error Message": record.error,
      "Full Data": JSON.stringify(record.data)
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(errorData);
    
    // Adjust column widths
    ws['!cols'] = [
      { wch: 10 }, // Row Number
      { wch: 15 }, // Student SRN
      { wch: 15 }, // Roll Number
      { wch: 20 }, // First Name
      { wch: 50 }, // Error Message
      { wch: 80 }  // Full Data
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Failed Records");
    XLSX.writeFile(wb, `failed_records_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Parse file data with improved date handling
  const parseFileData = (data) => {
    const students = [];
    const parseBoolean = (value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        return lower === 'true' || lower === 'yes' || lower === '1';
      }
      return false;
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row.studentSrn && !row.rollNumber && !row.firstName) continue;
      
      const student = {
        studentSrn: row.studentSrn || null,
        rollNumber: row.rollNumber || null,
        firstName: row.firstName || null,
        lastName: row.lastName || null,
        fatherName: row.fatherName || null,
        motherName: row.motherName || null,
        email: row.email || null,
        personalContact: row.personalContact || null,
        ParentContact: row.ParentContact || null,
        otherContact: row.otherContact || null,
        dob: parseDate(row.dob),
        gender: row.gender || null,
        category: row.category || null,
        address: row.address || null,
        districtId: row.districtId || null,
        blockId: row.blockId || null,
        schoolId: row.schoolId || null,
        classofStudent: row.classofStudent || null,
        parent: row.parent || null,
        enrollmentDate: parseDate(row.enrollmentDate) || new Date(),
        batch: row.batch || null,
        session1: row.session1 || null,
        session2: row.session2 || null,
        singleSideDistance: row.singleSideDistance ? Number(row.singleSideDistance) : null,
        bothSideDistance: row.bothSideDistance ? Number(row.bothSideDistance) : null,
        slc: parseBoolean(row.slc),
        isSlcTaken: parseBoolean(row.isSlcTaken),
        slcReleasingDate: parseDate(row.slcReleasingDate),
        erpEnrollingDate: parseDate(row.erpEnrollingDate),
        medium: row.medium || null,
        isStudentOf: row.isStudentOf || null,
        isDressGiven: parseBoolean(row.isDressGiven),
        isTabGiven: parseBoolean(row.isTabGiven),
        tabIMEI: row.tabIMEI || null,
        isSimGiven: parseBoolean(row.isSimGiven),
        simNumber: row.simNumber || null,
        simIMSI: row.simIMSI || null,
        bankName: row.bankName || null,
        bankIFSC: row.bankIFSC || null,
        bankAccNumber: row.bankAccNumber || null,
        bankHolderName: row.bankHolderName || null,
        batchCompleted: parseBoolean(row.batchCompleted),
        shirtSizeInInches: row.shirtSizeInInches ? Number(row.shirtSizeInInches) : null,
        waistSizeInInches: row.waistSizeInInches ? Number(row.waistSizeInInches) : null,
        waistToBottomLengthInInches: row.waistToBottomLengthInInches ? Number(row.waistToBottomLengthInInches) : null,
        dressAmountSubmitted: parseBoolean(row.dressAmountSubmitted),
        dressSizeConfirmationForm: row.dressSizeConfirmationForm || null,
        examinationVenue: row.examinationVenue || null,
      };
      
      students.push(student);
    }
    
    return students;
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadResult(null);
    setFailedRecords([]);
    setProgress(0);
    setProcessedCount(0);

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error("No data found in the file");
        }
        
        const students = parseFileData(jsonData);
        const totalStudents = students.length;
        
        // Process in batches to show progress
        const batchSize = 50;
        let allResults = { successful: [], failed: [] };
        
        for (let i = 0; i < students.length; i += batchSize) {
          const batch = students.slice(i, i + batchSize);
          const reqBody = { isBulk: true, students: batch };
          
          const result = await CreateStudentAPI(reqBody);
          
          if (result.results) {
            allResults.successful.push(...(result.results.successful || []));
            allResults.failed.push(...(result.results.failed || []));
          }
          
          const processed = Math.min(i + batchSize, totalStudents);
          setProcessedCount(processed);
          setProgress((processed / totalStudents) * 100);
        }
        
        // Combine results
        const finalResult = {
          success: true,
          message: `Bulk upload completed. ${allResults.successful.length} successful, ${allResults.failed.length} failed.`,
          results: {
            successful: allResults.successful,
            failed: allResults.failed,
            total: totalStudents
          }
        };
        
        setUploadResult(finalResult);
        setFailedRecords(allResults.failed);
        
        event.target.value = '';
      } catch (err) {
        console.error("Error processing file:", err);
        setError(err.message || "Error processing file");
        setUploadResult(null);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };
    
    reader.onerror = () => {
      setError("Error reading file");
      setLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white py-3">
              <div className="d-flex align-items-center">
                <FileExcel size={30} className="me-2" />
                <h3 className="mb-0">Bulk Student Creation</h3>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Action Buttons */}
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <Button 
                    variant="outline-primary" 
                    onClick={downloadTemplate}
                    className="w-100 py-2"
                    size="lg"
                  >
                    <Download className="me-2" />
                    Download Template
                  </Button>
                </Col>
                <Col md={6}>
                  <label className="w-100">
                    <Button 
                      variant="success" 
                      as="span"
                      className="w-100 py-2"
                      size="lg"
                      disabled={loading}
                    >
                      <CloudUpload className="me-2" />
                      Upload Excel File
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileUpload}
                      className="d-none"
                      disabled={loading}
                    />
                  </label>
                </Col>
              </Row>

              {/* Loading Progress */}
              {loading && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-primary">
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Processing...
                    </span>
                    <span className="text-muted">
                      {processedCount} records processed
                    </span>
                  </div>
                  <ProgressBar 
                    now={progress} 
                    label={`${Math.round(progress)}%`}
                    variant="primary"
                    animated
                  />
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading>
                    <XCircle className="me-2" />
                    Error
                  </Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              {/* Success Result */}
              {uploadResult && uploadResult.success && (
                <div className="mb-4">
                  <Alert variant="success" className="mb-3">
                    <Alert.Heading>
                      <CheckCircle className="me-2" />
                      Upload Successful!
                    </Alert.Heading>
                    <p>{uploadResult.message}</p>
                  </Alert>
                  
                  {/* Statistics Cards */}
                  <Row className="mb-4">
                    <Col md={4} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <h2 className="text-primary mb-0">
                            {uploadResult.results?.total || 0}
                          </h2>
                          <small className="text-muted">Total Records</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="border-0 bg-success bg-opacity-10 text-center">
                        <Card.Body>
                          <h2 className="text-success mb-0">
                            {uploadResult.results?.successful?.length || 0}
                          </h2>
                          <small className="text-muted">Successful</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="border-0 bg-danger bg-opacity-10 text-center">
                        <Card.Body>
                          <h2 className="text-danger mb-0">
                            {uploadResult.results?.failed?.length || 0}
                          </h2>
                          <small className="text-muted">Failed</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Download Error Report */}
                  {failedRecords.length > 0 && (
                    <div className="text-center mb-4">
                      <Button 
                        variant="warning" 
                        onClick={downloadErrorReport}
                      >
                        <Download className="me-2" />
                        Download Error Report ({failedRecords.length} failed records)
                      </Button>
                    </div>
                  )}

                  {/* Failed Records Preview */}
                  {failedRecords.length > 0 && (
                    <div className="mt-4">
                      <h5 className="mb-3">
                        <InfoCircle className="me-2 text-warning" />
                        Failed Records Preview (First 10)
                      </h5>
                      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Table striped bordered hover size="sm">
                          <thead className="bg-light sticky-top">
                            <tr>
                              <th>Row</th>
                              <th>Student SRN</th>
                              <th>Roll Number</th>
                              <th>Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {failedRecords.slice(0, 10).map((record, idx) => (
                              <tr key={idx}>
                                <td>{record.row}</td>
                                <td>{record.data?.studentSrn || 'N/A'}</td>
                                <td>{record.data?.rollNumber || 'N/A'}</td>
                                <td className="text-danger">{record.error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {failedRecords.length > 10 && (
                        <p className="text-muted mt-2">
                          And {failedRecords.length - 10} more errors. Download the full report for details.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              <Card className="border-0 bg-light mt-4">
                <Card.Header className="bg-info bg-opacity-25">
                  <h6 className="mb-0">📋 Instructions</h6>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0">
                    <li>Download the Excel template using the button above</li>
                    <li>The template contains dummy data to help you understand the format</li>
                    <li>Replace dummy data with your actual student data</li>
                    <li><strong className="text-danger">Required fields:</strong> studentSrn, rollNumber, firstName, gender, districtId, blockId, schoolId, classofStudent, medium, isStudentOf</li>
                    <li><strong>Date format:</strong> Supports DD-MM-YYYY, YYYY-MM-DD, or any valid date format</li>
                    <li><strong>Medium values:</strong> CBSE or HBSE</li>
                    <li><strong>isStudentOf values:</strong> MB, S100, or Others</li>
                    <li><strong>Boolean fields:</strong> Use true/false, yes/no, or 1/0</li>
                    <li>Leave empty cells for optional fields - they will be set to null</li>
                    <li>The "Instructions" sheet in the template explains each field in detail</li>
                    <li>Upload the filled Excel file using the upload button</li>
                    <li>If there are errors, download the error report for detailed information</li>
                  </ul>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};