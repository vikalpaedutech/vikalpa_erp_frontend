import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

import {
  School_drop_down,
  Batch_drop_down,
} from "../Utils/DependentDropDowns.v2";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

import {
  GetMBStudents,
  MarkMBStudentAttendance,
  CreateStudentFormAPI,
} from "../../service/Student.service";

import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";

import {
  FaThLarge,
  FaTable,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
  FaTrash,
  FaFileExport,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

// Simple function - sirf requestStatus show karega
const getStudentStatusDisplay = (student) => {
  const requestStatus = student?.requestStatus;
  
  if (requestStatus === "Approved") {
    return { text: "Approved", variant: "success" };
  } else if (requestStatus === "Rejected") {
    return { text: "Rejected", variant: "danger" };
  } else if (requestStatus === "Pending") {
    return { text: "Pending", variant: "secondary" };
  } else {
    return { text: requestStatus || "N/A", variant: "secondary" };
  }
};

// Helper function to check if buttons should be enabled
const shouldEnableButtons = (student) => {
  const request = student?.request;
  const requestStatus = student?.requestStatus;
  
  // DISABLE only when:
  // 1. request === "SLC Released" AND requestStatus === "Approved"
  // 2. request === "Removed" AND requestStatus === "Approved"
  
  if (request === "SLC Released" && requestStatus === "Approved") {
    return false; // Disabled
  }
  
  if (request === "Removed" && requestStatus === "Approved") {
    return false; // Disabled
  }
  
  // ENABLED for all other cases
  return true;
};

const StudentRow = React.memo(
  ({
    student,
    index,
    currentStatus,
    isLoading,
    onToggle,
    onRemoveStudent,
    onReleaseSLC,
    isRemoveLoading,
    isReleaseLoading,
  }) => {
    const isPresent = currentStatus === "Present";
    const statusDisplay = getStudentStatusDisplay(student);
    const buttonsEnabled = shouldEnableButtons(student);
    
    const isRemoveDisabled = !buttonsEnabled;
    const isReleaseDisabled = !buttonsEnabled;

    return (
      <tr>
        <td className="text-center small-cell">
          {index + 1}
        </td>

        <td className="small-cell">
          {student.studentSrn || "N/A"}
        </td>

        <td className="name-cell">
          <strong>
            {student.firstName || "N/A"}
          </strong>
          {student.lastName ? ` ${student.lastName}` : ""}
        </td>

        <td className="name-cell">
          {student.fatherName || "N/A"}
        </td>

        <td className="text-center small-cell">
          <Badge bg={statusDisplay.variant} className="px-2 py-1">
            {statusDisplay.text}
          </Badge>
        </td>

        <td className="text-center small-cell">
          <Badge bg="info" className="px-2 py-1">
            {student?.request || "N/A"}
          </Badge>
        </td>

        <td className="text-center small-cell">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemoveStudent(student)}
            disabled={isRemoveDisabled || isRemoveLoading}
            className="action-btn"
            title={
              !buttonsEnabled ? 
                (student?.request === "SLC Released" && student?.requestStatus === "Approved" ? "SLC already released" :
                 student?.request === "Removed" && student?.requestStatus === "Approved" ? "Student already removed" :
                 "Action not available") 
              : "Remove Student"
            }
          >
            {isRemoveLoading ? (
              <FaSpinner className="spin" />
            ) : (
              <FaTrash />
            )}
          </Button>
        </td>

        <td className="text-center small-cell">
          <Button
            variant="warning"
            size="sm"
            onClick={() => onReleaseSLC(student)}
            disabled={isReleaseDisabled || isReleaseLoading}
            className="action-btn"
            title={
              !buttonsEnabled ? 
                (student?.request === "SLC Released" && student?.requestStatus === "Approved" ? "SLC already released" :
                 student?.request === "Removed" && student?.requestStatus === "Approved" ? "Student already removed" :
                 "Action not available") 
              : "Release SLC"
            }
          >
            {isReleaseLoading ? (
              <FaSpinner className="spin" />
            ) : (
              <FaFileExport />
            )}
          </Button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.currentStatus === nextProps.currentStatus &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.isRemoveLoading === nextProps.isRemoveLoading &&
      prevProps.isReleaseLoading === nextProps.isReleaseLoading &&
      prevProps.student === nextProps.student
    );
  }
);

export const RemoveOrReleaseSLC = () => {

  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { startDate } = useContext(DateNDateRangeContext);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState({});
  const [removeLoading, setRemoveLoading] = useState({});
  const [releaseLoading, setReleaseLoading] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState(null);

  const tableWrapperRef = useRef(null);

  const sortStudentsAlphabetically = useCallback((studentsArray) => {
    if (!studentsArray || !Array.isArray(studentsArray)) return [];
    return [...studentsArray].sort((a, b) => {
      const nameA = (a.firstName || "").toLowerCase();
      const nameB = (b.firstName || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const reqBody = {
      schoolId: schoolContext?.schoolId,
      batch: batchContext?.batch,
      startDate: startDate,
    };

    try {
      const response = await GetMBStudents(reqBody);
      const sortedStudents = sortStudentsAlphabetically(response.data || []);
      setStudents(sortedStudents);

      const initialStatus = {};
      sortedStudents.forEach((student) => {
        let status = null;
        if (student.attendanceStatus) {
          status = student.attendanceStatus;
        } else if (student.status) {
          status = student.status;
        }
        if (status && (status === "Present" || status === "Absent")) {
          initialStatus[student._id] = status;
        }
      });
      setAttendanceStatus(initialStatus);
    } catch (error) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, [schoolContext?.schoolId, batchContext?.batch, startDate, sortStudentsAlphabetically]);

  const handleMarkAttendance = useCallback(
    async (student, status) => {
      const scrollTop = tableWrapperRef.current?.scrollTop || 0;
      const scrollLeft = tableWrapperRef.current?.scrollLeft || 0;

      setAttendanceStatus((prev) => ({
        ...prev,
        [student._id]: status,
      }));

      setAttendanceLoading((prev) => ({
        ...prev,
        [student._id]: true,
      }));

      const reqBody = {
        _id: student._id,
        status: status,
        isAttendanceMarked: true,
        startDate: startDate,
      };

      try {
        await MarkMBStudentAttendance(reqBody);
      } catch (error) {
        setError("Failed to mark attendance.");
        setAttendanceStatus((prev) => ({
          ...prev,
          [student._id]: status === "Present" ? "Absent" : "Present",
        }));
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setAttendanceLoading((prev) => ({
          ...prev,
          [student._id]: false,
        }));
        requestAnimationFrame(() => {
          if (tableWrapperRef.current) {
            tableWrapperRef.current.scrollTop = scrollTop;
            tableWrapperRef.current.scrollLeft = scrollLeft;
          }
        });
      }
    },
    [startDate]
  );

  const toggleAttendance = useCallback(
    (student) => {
      const currentStatus = attendanceStatus[student._id];
      const newStatus = currentStatus === "Present" ? "Absent" : "Present";
      handleMarkAttendance(student, newStatus);
    },
    [attendanceStatus, handleMarkAttendance]
  );

  const confirmRemoveStudent = useCallback((student) => {
    setSelectedStudent(student);
    setActionType("remove");
    setShowConfirmModal(true);
  }, []);

  const confirmReleaseSLC = useCallback((student) => {
    setSelectedStudent(student);
    setActionType("release");
    setShowConfirmModal(true);
  }, []);

  const executeAction = useCallback(async () => {
    if (!selectedStudent || !actionType) return;

    setShowConfirmModal(false);
    
    if (actionType === "remove") {
      setRemoveLoading((prev) => ({ ...prev, [selectedStudent._id]: true }));
    } else {
      setReleaseLoading((prev) => ({ ...prev, [selectedStudent._id]: true }));
    }

    const reqBody = {
      studentSrn: selectedStudent.studentSrn,
      userId: userData?._id,
      studentCRUDStatus: actionType === "remove" ? "Removed" : "SLC Released",
      request: actionType === "remove" ? "Removed" : "SLC Released",
      requestStatus: "Approved",
    };

    try {
      const response = await CreateStudentFormAPI(reqBody);
      
      if (response.success) {
        setSuccessMessage(
          actionType === "remove" 
            ? `Student ${selectedStudent.firstName} removed successfully!` 
            : `SLC released for ${selectedStudent.firstName} successfully!`
        );
        
        await fetchStudents();
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.message || "Operation failed");
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to perform operation");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      if (actionType === "remove") {
        setRemoveLoading((prev) => ({ ...prev, [selectedStudent._id]: false }));
      } else {
        setReleaseLoading((prev) => ({ ...prev, [selectedStudent._id]: false }));
      }
      setSelectedStudent(null);
      setActionType(null);
    }
  }, [selectedStudent, actionType, userData, fetchStudents]);

  useEffect(() => {
    if (schoolContext?.schoolId && batchContext?.batch) {
      fetchStudents();
    }
  }, [schoolContext?.schoolId, batchContext?.batch, startDate, fetchStudents]);

  const TableView = useMemo(() => {
    if (students.length === 0) {
      return (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">No students found</p>
        </div>
      );
    }

    return (
      <div ref={tableWrapperRef} className="attendance-table-wrapper">
        <Table striped bordered hover className="attendance-table">
          <thead>
            <tr>
              <th className="small-heading">S.No.</th>
              <th className="small-heading">SRN</th>
              <th className="name-heading">Student Name</th>
              <th className="name-heading">Father's Name</th>
              <th className="status-heading">Status</th>
              <th className="status-heading">Requested For</th>
              <th className="action-heading">Remove</th>
              <th className="action-heading">Release SLC</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <StudentRow
                key={student._id}
                student={student}
                index={index}
                currentStatus={attendanceStatus[student._id]}
                isLoading={attendanceLoading[student._id]}
                isRemoveLoading={removeLoading[student._id]}
                isReleaseLoading={releaseLoading[student._id]}
                onToggle={toggleAttendance}
                onRemoveStudent={confirmRemoveStudent}
                onReleaseSLC={confirmReleaseSLC}
              />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }, [
    students,
    attendanceStatus,
    attendanceLoading,
    removeLoading,
    releaseLoading,
    toggleAttendance,
    confirmRemoveStudent,
    confirmReleaseSLC,
  ]);

  const CardView = () => (
    <Row className="g-2 mt-2">
      {students.map((student) => {
        const currentStatus = attendanceStatus[student._id];
        const isLoading = attendanceLoading[student._id];
        const isPresent = currentStatus === "Present";
        const statusDisplay = getStudentStatusDisplay(student);
        const buttonsEnabled = shouldEnableButtons(student);
        
        const isRemoveDisabled = !buttonsEnabled;
        const isReleaseDisabled = !buttonsEnabled;

        return (
          <Col xs={12} sm={6} md={4} lg={3} key={student._id}>
            <Card className="h-100 shadow-sm">
              <Card.Header
                className={isPresent ? "bg-success text-white" : "bg-danger text-white"}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{student.firstName}</strong>
                  <Badge bg="light" text="dark">{student.rollNumber || "N/A"}</Badge>
                </div>
              </Card.Header>

              <Card.Body>
                <p><strong>SRN:</strong> {student.studentSrn}</p>
                <p><strong>Father:</strong> {student.fatherName}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg={statusDisplay.variant}>
                    {statusDisplay.text}
                  </Badge>
                </p>
                <p>
                  <strong>Requested For:</strong>{" "}
                  <Badge bg="info">
                    {student?.request || "N/A"}
                  </Badge>
                </p>
                <p>
                  <strong>Request Status:</strong> {student.requestStatus || "N/A"}
                </p>
              </Card.Body>

              <Card.Footer className="bg-white">
                <div className="d-flex gap-2">
                  <Button
                    variant={isPresent ? "success" : "danger"}
                    className="flex-grow-1"
                    onClick={() => toggleAttendance(student)}
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="spin me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        {isPresent ? <FaUserCheck /> : <FaUserTimes />}{" "}
                        {isPresent ? "Present" : "Absent"}
                      </>
                    )}
                  </Button>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    variant="danger"
                    className="flex-grow-1"
                    onClick={() => confirmRemoveStudent(student)}
                    disabled={isRemoveDisabled || removeLoading[student._id]}
                    size="sm"
                    title={
                      !buttonsEnabled ? 
                        (student?.request === "SLC Released" && student?.requestStatus === "Approved" ? "SLC already released" :
                         student?.request === "Removed" && student?.requestStatus === "Approved" ? "Student already removed" :
                         "Action not available") 
                      : "Remove Student"
                    }
                  >
                    {removeLoading[student._id] ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <><FaTrash className="me-1" /> Remove</>
                    )}
                  </Button>
                  <Button
                    variant="warning"
                    className="flex-grow-1"
                    onClick={() => confirmReleaseSLC(student)}
                    disabled={isReleaseDisabled || releaseLoading[student._id]}
                    size="sm"
                    title={
                      !buttonsEnabled ? 
                        (student?.request === "SLC Released" && student?.requestStatus === "Approved" ? "SLC already released" :
                         student?.request === "Removed" && student?.requestStatus === "Approved" ? "Student already removed" :
                         "Action not available") 
                      : "Release SLC"
                    }
                  >
                    {releaseLoading[student._id] ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <><FaFileExport className="me-1" /> Release SLC</>
                    )}
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Container fluid className="mt-3 mb-3">
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          <FaInfoCircle className="me-2" />
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton className={actionType === "remove" ? "bg-danger text-white" : "bg-warning"}>
          <Modal.Title>
            {actionType === "remove" ? (
              <><FaTrash className="me-2" /> Confirm Remove</>
            ) : (
              <><FaFileExport className="me-2" /> Confirm SLC Release</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {actionType === "remove" ? "remove" : "release SLC for"} the following student?
          </p>
          <Card className="bg-light">
            <Card.Body>
              <p><strong>Name:</strong> {selectedStudent?.firstName} {selectedStudent?.lastName || ""}</p>
              <p><strong>SRN:</strong> {selectedStudent?.studentSrn}</p>
              <p><strong>Father's Name:</strong> {selectedStudent?.fatherName}</p>
              <p><strong>Class:</strong> {selectedStudent?.classofStudent}</p>
              <p><strong>Batch:</strong> {selectedStudent?.batch}</p>
              <p><strong>Current Request:</strong> {selectedStudent?.request || "N/A"}</p>
              <p><strong>Request Status:</strong> {selectedStudent?.requestStatus || "N/A"}</p>
            </Card.Body>
          </Card>
          {actionType === "remove" ? (
            <p className="text-danger mt-3">
              <FaExclamationTriangle className="me-1" />
              This action will mark the student as "Deleted" and cannot be undone easily.
            </p>
          ) : (
            <p className="text-warning mt-3">
              <FaExclamationTriangle className="me-1" />
              This will mark the student's SLC as released.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant={actionType === "remove" ? "danger" : "warning"} onClick={executeAction}>
            Confirm {actionType === "remove" ? "Remove" : "Release SLC"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-2">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white py-2">
              Filters
            </Card.Header>
            <Card.Body className="py-2">
              <Row className="g-2">
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

      <Row className="mb-2">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h6 className="mb-0">Students List</h6>
              <small className="text-muted">Total: {students.length}</small>
            </div>
            <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={(val) => val && setViewMode(val)} size="sm">
              <ToggleButton id="table-view" value="table" variant="outline-primary">
                <FaTable className="me-1" />
                Table
              </ToggleButton>
              <ToggleButton id="card-view" value="card" variant="outline-primary">
                <FaThLarge className="me-1" />
                Card
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading students...</p>
        </div>
      ) : viewMode === "table" ? (
        TableView
      ) : (
        <CardView />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .attendance-table-wrapper {
          width: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          max-height: 75vh;
          position: relative;
        }

        .attendance-table {
          min-width: 750px;
          margin-bottom: 0;
          background: white;
          font-size: 12px;
        }

        .attendance-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: #f8f9fa;
          font-size: 11px;
          padding: 6px;
        }

        .attendance-table td {
          padding: 5px 6px;
          font-size: 11px;
        }

        .small-heading {
          width: 55px;
        }

        .status-heading {
          width: 100px;
        }

        .action-heading {
          width: 80px;
        }

        .name-heading {
          min-width: 140px;
        }

        .small-cell {
          width: 55px;
        }

        .name-cell {
          min-width: 140px;
        }

        .attendance-btn {
          width: 38px;
          height: 28px;
          padding: 0;
          font-size: 11px;
          font-weight: bold;
          border: none;
          box-shadow: none;
        }

        .action-btn {
          width: 32px;
          height: 28px;
          padding: 0;
          font-size: 12px;
        }

        .attendance-table th,
        .attendance-table td {
          vertical-align: middle;
          white-space: nowrap;
        }

        .attendance-table-wrapper::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .attendance-table-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        button {
          transition: none !important;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 8px;
            padding-right: 8px;
          }

          .attendance-table {
            min-width: 700px;
            font-size: 10px;
          }

          .attendance-table thead th {
            font-size: 10px;
            padding: 5px;
          }

          .attendance-table td {
            font-size: 10px;
            padding: 4px 5px;
          }

          .name-heading,
          .name-cell {
            min-width: 115px;
          }

          .attendance-btn {
            width: 34px;
            height: 26px;
            font-size: 10px;
          }

          .action-btn {
            width: 28px;
            height: 26px;
            font-size: 10px;
          }

          .status-heading {
            width: 90px;
          }
        }
      `}</style>
    </Container>
  );
};