import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Table,
  Badge,
  ProgressBar,
  Form,
  Modal,
} from "react-bootstrap";

import {
  CloudUpload,
  Download,
  CheckCircle,
  XCircle,
  InfoCircle,
  PencilSquare,
  Gear,
} from "react-bootstrap-icons";

import { UpdateStudentBySrn } from "../../service/Student.service";

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const AVAILABLE_FIELDS = {
  "Basic Info": [
    "rollNumber",
    "firstName",
    "fatherName",
    "motherName",
    "email",
    "personalContact",
    "ParentContact",
    "otherContact",
  ],

  "Personal Details": [
    "dob",
    "gender",
    "category",
    "address",
    "districtId",
    "blockId",
    "schoolId",
    "classofStudent",
    "medium",
  ],

  "Academic Info": [
    "batch",
    "session1",
    "session2",
    "enrollmentDate",
    "erpEnrollingDate",
    "batchCompleted",
    "isSlcTaken",
    "slcReleasingDate",
    "slc",
  ],

  "Device & SIM": [
    "isTabGiven",
    "tabIMEI",
    "isSimGiven",
    "simNumber",
    "simIMSI",
  ],

  "Dress Details": [
    "isDressGiven",
    "dressAmountSubmitted",
    "shirtSizeInInches",
    "waistSizeInInches",
    "waistToBottomLengthInInches",
    "dressSizeConfirmationForm",
  ],

  "Bank Details": [
    "bankName",
    "bankIFSC",
    "bankAccNumber",
    "bankHolderName",
  ],

  Other: [
    "isStudentOf",
    "examinationVenue",
    "singleSideDistance",
    "bothSideDistance",
  ],
};

const VALID_FIELDS = Object.values(AVAILABLE_FIELDS).flat();

const BOOLEAN_FIELDS = [
  "slc",
  "isSlcTaken",
  "isDressGiven",
  "isTabGiven",
  "isSimGiven",
  "batchCompleted",
  "dressAmountSubmitted",
];

const DATE_FIELDS = [
  "dob",
  "enrollmentDate",
  "slcReleasingDate",
  "erpEnrollingDate",
];

const NUMBER_FIELDS = [
  "singleSideDistance",
  "bothSideDistance",
  "shirtSizeInInches",
  "waistSizeInInches",
  "waistToBottomLengthInInches",
];

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const getFieldType = (field) => {
  if (BOOLEAN_FIELDS.includes(field)) return "boolean";
  if (DATE_FIELDS.includes(field)) return "date";
  if (NUMBER_FIELDS.includes(field)) return "number";
  return "text";
};

// Convert any date format to YYYY-MM-DD without timezone shift
const convertToUTCYMD = (dateValue) => {
  if (!dateValue) return null;
  
  let year, month, day;
  
  // If it's a Date object
  if (dateValue instanceof Date) {
    year = dateValue.getUTCFullYear();
    month = String(dateValue.getUTCMonth() + 1).padStart(2, '0');
    day = String(dateValue.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // If it's a string
  if (typeof dateValue === 'string') {
    // DD-MM-YYYY format
    if (dateValue.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      const parts = dateValue.split('-');
      day = String(parseInt(parts[0])).padStart(2, '0');
      month = String(parseInt(parts[1])).padStart(2, '0');
      year = parts[2];
      return `${year}-${month}-${day}`;
    }
    
    // DD/MM/YYYY format
    if (dateValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateValue.split('/');
      day = String(parseInt(parts[0])).padStart(2, '0');
      month = String(parseInt(parts[1])).padStart(2, '0');
      year = parts[2];
      return `${year}-${month}-${day}`;
    }
    
    // YYYY-MM-DD format
    if (dateValue.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      return dateValue;
    }
    
    // YYYY/MM/DD format
    if (dateValue.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
      return dateValue.replace(/\//g, '-');
    }
  }
  
  // If it's a number (Excel serial date)
  if (typeof dateValue === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const msPerDay = 86400000;
    const utcDays = dateValue - 1;
    const date = new Date(excelEpoch.getTime() + (utcDays * msPerDay));
    year = date.getUTCFullYear();
    month = String(date.getUTCMonth() + 1).padStart(2, '0');
    day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
};

const normalizeValue = (field, value) => {
  const fieldType = getFieldType(field);

  if (fieldType === "boolean") {
    const val = String(value).toLowerCase().trim();
    if (["true", "yes", "1"].includes(val)) return true;
    if (["false", "no", "0"].includes(val)) return false;
    return false;
  }

  if (fieldType === "number") {
    return value !== "" ? Number(value) : null;
  }

  if (fieldType === "date") {
    if (!value) return null;
    // Return date in YYYY-MM-DD format without timezone shift
    return convertToUTCYMD(value);
  }

  return String(value).trim();
};

const validateColumns = (row) => {
  Object.keys(row).forEach((key) => {
    if (key !== "studentSrn" && !VALID_FIELDS.includes(key)) {
      throw new Error(`Invalid column found: ${key}`);
    }
  });
};

const parseFileData = (data) => {
  const updates = [];
  const srnSet = new Set();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    validateColumns(row);

    if (!row.studentSrn) continue;

    if (srnSet.has(row.studentSrn)) {
      throw new Error(`Duplicate SRN found: ${row.studentSrn}`);
    }

    srnSet.add(row.studentSrn);

    const updateItem = {
      studentSrn: String(row.studentSrn).trim(),
    };

    Object.keys(row).forEach((key) => {
      if (
        key !== "studentSrn" &&
        row[key] !== undefined &&
        row[key] !== null &&
        row[key] !== ""
      ) {
        updateItem[key] = normalizeValue(key, row[key]);
      }
    });

    if (Object.keys(updateItem).length > 1) {
      updates.push(updateItem);
    }
  }

  return updates;
};

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export const UpdateStudentBulk = () => {
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [failedRecords, setFailedRecords] = useState([]);
  const [singleUpdateMode, setSingleUpdateMode] = useState(false);
  const [singleStudent, setSingleStudent] = useState({
    studentSrn: "",
    updates: {},
  });
  const [selectedField, setSelectedField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  
  // Template customization states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedFieldsForTemplate, setSelectedFieldsForTemplate] = useState({
    "Basic Info": [],
    "Personal Details": [],
    "Academic Info": [],
    "Device & SIM": [],
    "Dress Details": [],
    "Bank Details": [],
    "Other": [],
  });
  const [selectAllFields, setSelectAllFields] = useState(false);

  /* ---------------------------------------------------------------------- */
  /*                             SINGLE UPDATE                              */
  /* ---------------------------------------------------------------------- */

  const addFieldToUpdate = () => {
    if (!selectedField) return;
    const processedValue = normalizeValue(selectedField, fieldValue);
    setSingleStudent((prev) => ({
      ...prev,
      updates: {
        ...prev.updates,
        [selectedField]: processedValue,
      },
    }));
    setSelectedField("");
    setFieldValue("");
  };

  const removeFieldFromUpdate = (field) => {
    const updates = { ...singleStudent.updates };
    delete updates[field];
    setSingleStudent((prev) => ({
      ...prev,
      updates,
    }));
  };

  const handleSingleUpdate = async () => {
    if (loading) return;
    if (!singleStudent.studentSrn) {
      setError("Please enter Student SRN");
      return;
    }
    if (Object.keys(singleStudent.updates).length === 0) {
      setError("Please add at least one field");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadResult(null);
      setFailedRecords([]);

      const reqBody = {
        studentSrn: singleStudent.studentSrn,
        updates: singleStudent.updates,
        isBulk: false,
      };

      const result = await UpdateStudentBySrn(reqBody);

      if (result && result.success) {
        setUploadResult({
          success: true,
          message: result.message || "Student updated successfully",
          data: result.data,
          results: null,
        });
        setSingleStudent({ studentSrn: "", updates: {} });
      } else {
        throw new Error(result?.message || "Update failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                          TEMPLATE CUSTOMIZATION                        */
  /* ---------------------------------------------------------------------- */

  const initializeTemplateFields = () => {
    const initialSelected = {};
    Object.keys(AVAILABLE_FIELDS).forEach((category) => {
      if (selectAllFields) {
        initialSelected[category] = [...AVAILABLE_FIELDS[category]];
      } else {
        initialSelected[category] = [];
      }
    });
    setSelectedFieldsForTemplate(initialSelected);
  };

  const toggleFieldForTemplate = (category, field) => {
    setSelectedFieldsForTemplate((prev) => {
      const currentFields = prev[category];
      const newFields = currentFields.includes(field)
        ? currentFields.filter((f) => f !== field)
        : [...currentFields, field];
      
      return {
        ...prev,
        [category]: newFields,
      };
    });
  };

  const toggleCategoryForTemplate = (category) => {
    setSelectedFieldsForTemplate((prev) => {
      const allFieldsInCategory = AVAILABLE_FIELDS[category];
      const currentSelected = prev[category];
      const isAllSelected = currentSelected.length === allFieldsInCategory.length;
      
      return {
        ...prev,
        [category]: isAllSelected ? [] : [...allFieldsInCategory],
      };
    });
  };

  const toggleAllFieldsForTemplate = () => {
    if (selectAllFields) {
      const emptySelected = {};
      Object.keys(AVAILABLE_FIELDS).forEach((category) => {
        emptySelected[category] = [];
      });
      setSelectedFieldsForTemplate(emptySelected);
      setSelectAllFields(false);
    } else {
      const allSelected = {};
      Object.keys(AVAILABLE_FIELDS).forEach((category) => {
        allSelected[category] = [...AVAILABLE_FIELDS[category]];
      });
      setSelectedFieldsForTemplate(allSelected);
      setSelectAllFields(true);
    }
  };

  const downloadCustomizedTemplate = () => {
    const selectedFieldsList = [];
    Object.values(selectedFieldsForTemplate).forEach((fields) => {
      selectedFieldsList.push(...fields);
    });

    if (selectedFieldsList.length === 0) {
      setError("Please select at least one field for the template");
      return;
    }

    const templateData = [
      {
        studentSrn: "STU2024001",
        ...selectedFieldsList.reduce((acc, field) => {
          if (BOOLEAN_FIELDS.includes(field)) {
            acc[field] = "true";
          } else if (DATE_FIELDS.includes(field)) {
            acc[field] = "2024-01-15";
          } else if (NUMBER_FIELDS.includes(field)) {
            acc[field] = "10";
          } else {
            acc[field] = `example_${field}`;
          }
          return acc;
        }, {}),
      },
      {
        studentSrn: "STU2024002",
        ...selectedFieldsList.reduce((acc, field) => {
          acc[field] = "";
          return acc;
        }, {}),
      },
    ];

    const instructionData = [
      { "Field Name": "studentSrn", Description: "REQUIRED - Unique student SRN", Example: "STU2024001", Type: "String" },
      ...selectedFieldsList.map((field) => ({
        "Field Name": field,
        Description: getFieldDescription(field),
        Example: getFieldExample(field),
        Type: getFieldType(field),
      })),
    ];

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(templateData);
    const ws2 = XLSX.utils.json_to_sheet(instructionData);
    
    const cols = [{ wch: 15 }, ...selectedFieldsList.map(() => ({ wch: 15 }))];
    ws1['!cols'] = cols;
    ws2['!cols'] = [{ wch: 20 }, { wch: 40 }, { wch: 20 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(wb, ws1, "Update Data");
    XLSX.utils.book_append_sheet(wb, ws2, "Instructions");
    XLSX.writeFile(wb, `student_update_template_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setShowTemplateModal(false);
    setError(null);
  };

  const getFieldDescription = (field) => {
    const descriptions = {
      rollNumber: "Student Roll Number",
      firstName: "Student's First Name",
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      email: "Email Address",
      personalContact: "Student's Contact Number",
      ParentContact: "Parent's Contact Number",
      otherContact: "Alternative Contact Number",
      dob: "Date of Birth (YYYY-MM-DD)",
      gender: "Gender (Male/Female/Other)",
      category: "Category (General/OBC/SC/ST)",
      address: "Student's Address",
      districtId: "District ID",
      blockId: "Block ID",
      schoolId: "School ID",
      classofStudent: "Class/Grade",
      batch: "Batch Year",
      session1: "Session 1 Subject",
      session2: "Session 2 Subject",
      enrollmentDate: "Enrollment Date (YYYY-MM-DD)",
      erpEnrollingDate: "ERP Enrolling Date (YYYY-MM-DD)",
      batchCompleted: "Batch Completed Status",
      isSlcTaken: "SLC Taken Status",
      slcReleasingDate: "SLC Releasing Date (YYYY-MM-DD)",
      slc: "SLC Status",
      isTabGiven: "Tab Given Status",
      tabIMEI: "Tab IMEI Number",
      isSimGiven: "SIM Given Status",
      simNumber: "SIM Number",
      simIMSI: "SIM IMSI",
      isDressGiven: "Dress Given Status",
      dressAmountSubmitted: "Dress Amount Submitted",
      shirtSizeInInches: "Shirt Size (inches)",
      waistSizeInInches: "Waist Size (inches)",
      waistToBottomLengthInInches: "Waist to Bottom Length (inches)",
      dressSizeConfirmationForm: "Dress Size Confirmation Form",
      bankName: "Bank Name",
      bankIFSC: "Bank IFSC Code",
      bankAccNumber: "Bank Account Number",
      bankHolderName: "Bank Account Holder Name",
      isStudentOf: "Student Type (MB/S100/Others)",
      examinationVenue: "Examination Venue",
      singleSideDistance: "Single Side Distance",
      bothSideDistance: "Both Side Distance",
      medium: "Education Medium (CBSE/HBSE)",
    };
    return descriptions[field] || "Field description";
  };

  const getFieldExample = (field) => {
    const examples = {
      rollNumber: "2024001",
      firstName: "Raj",
      fatherName: "Ramesh Kumar",
      motherName: "Sita Devi",
      email: "student@example.com",
      personalContact: "9876543210",
      ParentContact: "9876543210",
      otherContact: "9876543210",
      dob: "2010-05-15",
      gender: "Male",
      category: "General",
      address: "123 Main Street",
      districtId: "DIST001",
      blockId: "BLK001",
      schoolId: "SCH001",
      classofStudent: "10",
      batch: "2024-25",
      session1: "Mathematics",
      session2: "Science",
      enrollmentDate: "2024-01-15",
      erpEnrollingDate: "2024-01-16",
      batchCompleted: "false",
      isSlcTaken: "false",
      slcReleasingDate: "2024-03-15",
      slc: "false",
      isTabGiven: "true",
      tabIMEI: "123456789012345",
      isSimGiven: "true",
      simNumber: "987654321098765",
      simIMSI: "405123456789012",
      isDressGiven: "true",
      dressAmountSubmitted: "true",
      shirtSizeInInches: "28",
      waistSizeInInches: "26",
      waistToBottomLengthInInches: "30",
      dressSizeConfirmationForm: "Form submitted",
      bankName: "State Bank of India",
      bankIFSC: "SBIN0012345",
      bankAccNumber: "123456789012",
      bankHolderName: "Raj Kumar",
      isStudentOf: "MB",
      examinationVenue: "School Premises",
      singleSideDistance: "5",
      bothSideDistance: "10",
      medium: "CBSE",
    };
    return examples[field] || "example_value";
  };

  /* ---------------------------------------------------------------------- */
  /*                              BULK UPDATE                               */
  /* ---------------------------------------------------------------------- */

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }

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
        // Read as raw data to avoid automatic date conversion
        const workbook = XLSX.read(data, { type: "array", cellDates: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: "" });

        if (!jsonData.length) {
          throw new Error("No data found in file");
        }

        const updates = parseFileData(jsonData);
        if (!updates.length) {
          throw new Error("No valid updates found. Each row must have studentSrn and at least one field to update.");
        }

        const totalUpdates = updates.length;
        const allResults = { successful: [], failed: [] };

        for (let i = 0; i < updates.length; i++) {
          const updateItem = updates[i];
          
          try {
            const updateFields = {};
            Object.keys(updateItem).forEach(key => {
              if (key !== 'studentSrn') {
                updateFields[key] = updateItem[key];
              }
            });

            const reqBody = {
              isBulk: false,
              studentSrn: updateItem.studentSrn,
              updates: updateFields,
            };

            const result = await UpdateStudentBySrn(reqBody);

            if (result && result.success) {
              allResults.successful.push({
                studentSrn: updateItem.studentSrn,
                updatedFields: Object.keys(updateFields),
                message: result.message,
              });
            } else {
              allResults.failed.push({
                studentSrn: updateItem.studentSrn,
                error: result?.message || "Update failed",
              });
            }
          } catch (err) {
            console.error(`Error updating ${updateItem.studentSrn}:`, err);
            allResults.failed.push({
              studentSrn: updateItem.studentSrn,
              error: err?.response?.data?.message || err.message || "Update failed",
            });
          }

          const processed = i + 1;
          setProcessedCount(processed);
          setProgress((processed / totalUpdates) * 100);
        }

        setUploadResult({
          success: true,
          message: `Bulk update completed. ${allResults.successful.length} successful, ${allResults.failed.length} failed.`,
          results: {
            total: totalUpdates,
            successful: allResults.successful,
            failed: allResults.failed,
          },
        });

        setFailedRecords(allResults.failed);
        event.target.value = "";

      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error processing file");
        setUploadResult(null);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      setError("Error reading file");
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadErrorReport = () => {
    if (!failedRecords.length) return;

    const errorData = failedRecords.map((record, index) => ({
      "S.No.": index + 1,
      "Student SRN": record.studentSrn || "N/A",
      "Error Message": record.error,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(errorData);
    XLSX.utils.book_append_sheet(wb, ws, "Failed Updates");
    XLSX.writeFile(wb, `failed_updates_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  /* ---------------------------------------------------------------------- */
  /*                                  UI                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <PencilSquare size={28} className="me-2" />
                  <h3 className="mb-0">Student Bulk Update</h3>
                </div>
              </div>
            </Card.Header>

            <Card.Body>
              {/* MODE BUTTONS */}
              <div className="mb-4">
                <Button
                  variant={!singleUpdateMode ? "primary" : "outline-primary"}
                  className="me-2"
                  onClick={() => setSingleUpdateMode(false)}
                >
                  Bulk Update
                </Button>
                <Button
                  variant={singleUpdateMode ? "primary" : "outline-primary"}
                  onClick={() => setSingleUpdateMode(true)}
                >
                  Single Student Update
                </Button>
              </div>

              {/* SINGLE UPDATE MODE */}
              {singleUpdateMode ? (
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h5 className="mb-4">Single Student Update</h5>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Student SRN <span className="text-danger">*</span></strong>
                      </Form.Label>
                      <Form.Control
                        value={singleStudent.studentSrn}
                        onChange={(e) =>
                          setSingleStudent({ ...singleStudent, studentSrn: e.target.value })
                        }
                        placeholder="Enter student SRN"
                      />
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={5}>
                        <Form.Select
                          value={selectedField}
                          onChange={(e) => setSelectedField(e.target.value)}
                        >
                          <option value="">Select Field to Update</option>
                          {Object.entries(AVAILABLE_FIELDS).map(([category, fields]) => (
                            <optgroup label={category} key={category}>
                              {fields.map((field) => (
                                <option key={field} value={field}>
                                  {field}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={5}>
                        <Form.Control
                          type={
                            getFieldType(selectedField) === "date"
                              ? "date"
                              : getFieldType(selectedField) === "number"
                              ? "number"
                              : "text"
                          }
                          disabled={!selectedField}
                          value={fieldValue}
                          onChange={(e) => setFieldValue(e.target.value)}
                          placeholder="Enter new value"
                        />
                      </Col>
                      <Col md={2}>
                        <Button
                          variant="success"
                          className="w-100"
                          disabled={!selectedField || fieldValue === ""}
                          onClick={addFieldToUpdate}
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>

                    {Object.keys(singleStudent.updates).length > 0 && (
                      <div className="mt-3 mb-3">
                        <Form.Label><strong>Fields to Update:</strong></Form.Label>
                        <div className="border rounded p-3 bg-white">
                          {Object.entries(singleStudent.updates).map(([field, value]) => (
                            <Badge
                              bg="info"
                              className="me-2 mb-2 p-2"
                              key={field}
                              style={{ cursor: "pointer" }}
                              onClick={() => removeFieldFromUpdate(field)}
                            >
                              {field}: {String(value)} ✕
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-100 mt-3"
                      size="lg"
                      onClick={handleSingleUpdate}
                      disabled={loading || !singleStudent.studentSrn || Object.keys(singleStudent.updates).length === 0}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : "Update Student"}
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                /* BULK UPDATE MODE */
                <>
                  <Row className="mb-4">
                    <Col md={6} className="mb-3">
                      <Button 
                        variant="outline-primary" 
                        className="w-100" 
                        size="lg" 
                        onClick={() => {
                          initializeTemplateFields();
                          setShowTemplateModal(true);
                        }}
                      >
                        <Gear className="me-2" />
                        Customize & Download Template
                      </Button>
                    </Col>
                    <Col md={6}>
                      <label className="w-100">
                        <Button as="span" variant="success" className="w-100" size="lg" disabled={loading}>
                          <CloudUpload className="me-2" />
                          Upload Excel File
                        </Button>
                        <input
                          type="file"
                          className="d-none"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileUpload}
                          disabled={loading}
                        />
                      </label>
                    </Col>
                  </Row>
                  <Alert variant="info">
                    <InfoCircle className="me-2" />
                    <strong>Note:</strong> Click "Customize & Download Template" to select which fields you want to update, then download a customized template with only those fields.
                  </Alert>
                </>
              )}

              {/* PROGRESS */}
              {loading && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </span>
                    <span>{processedCount} records processed</span>
                  </div>
                  <ProgressBar now={progress} label={`${Math.round(progress)}%`} animated />
                </div>
              )}

              {/* ERROR */}
              {error && (
                <Alert variant="danger">
                  <Alert.Heading><XCircle className="me-2" />Error</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              {/* SUCCESS */}
              {uploadResult?.success && (
                <Alert variant="success">
                  <Alert.Heading><CheckCircle className="me-2" />Success</Alert.Heading>
                  <p>{uploadResult.message}</p>
                  {uploadResult.data && (
                    <p className="mb-0 mt-2"><strong>Updated SRN:</strong> {uploadResult.data.studentSrn}</p>
                  )}
                </Alert>
              )}

              {/* RESULTS STATISTICS */}
              {uploadResult?.results && (
                <>
                  <Row className="mb-4">
                    <Col md={4}>
                      <Card className="text-center border-0 bg-light">
                        <Card.Body>
                          <h2 className="text-primary">{uploadResult.results.total}</h2>
                          <small>Total Records</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center border-0 bg-success bg-opacity-10">
                        <Card.Body>
                          <h2 className="text-success">{uploadResult.results.successful?.length || 0}</h2>
                          <small>Successful</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center border-0 bg-danger bg-opacity-10">
                        <Card.Body>
                          <h2 className="text-danger">{uploadResult.results.failed?.length || 0}</h2>
                          <small>Failed</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* FAILED RECORDS */}
                  {failedRecords.length > 0 && (
                    <>
                      <div className="text-center mb-3">
                        <Button variant="warning" onClick={downloadErrorReport}>
                          <Download className="me-2" />
                          Download Error Report ({failedRecords.length} failed)
                        </Button>
                      </div>
                      <h6 className="mb-3">Failed Records Preview (First 10):</h6>
                      <Table striped bordered hover responsive size="sm">
                        <thead className="bg-light">
                          <tr>
                            <th>#</th>
                            <th>Student SRN</th>
                            <th>Error</th>
                          </tr>
                        </thead>
                        <tbody>
                          {failedRecords.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.studentSrn || "N/A"}</td>
                              <td className="text-danger">{item.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {failedRecords.length > 10 && (
                        <p className="text-muted">And {failedRecords.length - 10} more errors. Download full report for details.</p>
                      )}
                    </>
                  )}
                </>
              )}

              {/* INSTRUCTIONS */}
              <Card className="mt-4 border-0 bg-light">
                <Card.Header className="bg-info bg-opacity-25">
                  <h6 className="mb-0"><InfoCircle className="me-2" />Instructions</h6>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0">
                    <li><strong className="text-danger">studentSrn</strong> is required for every row</li>
                    <li>Click <strong>"Customize & Download Template"</strong> to select which fields you want to update</li>
                    <li>The template will only include the fields you selected</li>
                    <li>Only filled cells will be updated - empty cells are ignored</li>
                    <li><strong>Boolean fields:</strong> Use true/false, yes/no, or 1/0</li>
                    <li><strong>Date fields:</strong> Use <strong>DD-MM-YYYY</strong> (e.g., 15-01-2024) or <strong>YYYY-MM-DD</strong> (e.g., 2024-01-15)</li>
                    <li><strong>Number fields:</strong> Use numeric values only</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Duplicate SRNs are not allowed in the same file</li>
                  </ul>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Template Customization Modal */}
      <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <Gear className="me-2" />
            Customize Template - Select Fields to Update
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <InfoCircle className="me-2" />
            Select the fields you want to include in the template. Only selected fields will appear in the downloaded template.
          </Alert>
          
          <div className="mb-3">
            <Button 
              variant={selectAllFields ? "danger" : "success"} 
              size="sm"
              onClick={toggleAllFieldsForTemplate}
            >
              {selectAllFields ? "Deselect All" : "Select All Fields"}
            </Button>
          </div>

          {Object.entries(AVAILABLE_FIELDS).map(([category, fields]) => (
            <Card className="mb-3 border" key={category}>
              <Card.Header className="bg-light">
                <Form.Check
                  type="checkbox"
                  label={<strong>{category}</strong>}
                  checked={selectedFieldsForTemplate[category]?.length === fields.length}
                  onChange={() => toggleCategoryForTemplate(category)}
                />
              </Card.Header>
              <Card.Body>
                <Row>
                  {fields.map((field) => (
                    <Col md={4} key={field} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span>
                            {field}
                            <small className="text-muted ms-2">({getFieldType(field)})</small>
                          </span>
                        }
                        checked={selectedFieldsForTemplate[category]?.includes(field)}
                        onChange={() => toggleFieldForTemplate(category, field)}
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={downloadCustomizedTemplate}>
            <Download className="me-2" />
            Download Template
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};