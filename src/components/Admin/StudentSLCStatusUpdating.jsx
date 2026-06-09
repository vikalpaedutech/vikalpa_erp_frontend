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
} from "react-bootstrap";

import {
  FaThLarge,
  FaTable,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

const StudentRow = React.memo(
  ({
    student,
    index,
    currentStatus,
    isLoading,
    onToggle,
  }) => {
    const isPresent = currentStatus === "Present";

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

          {student.lastName
            ? ` ${student.lastName}`
            : ""}
        </td>

        <td className="name-cell">
          {student.fatherName || "N/A"}
        </td>

        <td className="text-center small-cell">
          <Button
            variant={
              isPresent
                ? "success"
                : "danger"
            }
            onClick={() => onToggle(student)}
            disabled={isLoading}
            className="attendance-btn"
          >
            {isLoading ? (
              <FaSpinner className="spin" />
            ) : isPresent ? (
              "P"
            ) : (
              "A"
            )}
          </Button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.currentStatus ===
        nextProps.currentStatus &&
      prevProps.isLoading ===
        nextProps.isLoading
    );
  }
);

export const MBStudentsAttendanceV2 = () => {
  const { userData } =
    useContext(UserContext);

  const { schoolContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const { startDate } = useContext(
    DateNDateRangeContext
  );

  const { batchContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [viewMode, setViewMode] =
    useState("table");

  const [attendanceStatus, setAttendanceStatus] =
    useState({});

  const [attendanceLoading, setAttendanceLoading] =
    useState({});

  const [error, setError] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState(null);

  const tableWrapperRef = useRef(null);

  const sortStudentsAlphabetically =
    useCallback((studentsArray) => {
      if (
        !studentsArray ||
        !Array.isArray(studentsArray)
      )
        return [];

      return [...studentsArray].sort(
        (a, b) => {
          const nameA = (
            a.firstName || ""
          ).toLowerCase();

          const nameB = (
            b.firstName || ""
          ).toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;

          return 0;
        }
      );
    }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const reqBody = {
      schoolId:
        schoolContext?.schoolId,

      batch: batchContext?.batch,

      startDate: startDate,
    };

    try {
      const response =
        await GetMBStudents(reqBody);

      const sortedStudents =
        sortStudentsAlphabetically(
          response.data || []
        );

      setStudents(sortedStudents);

      const initialStatus = {};

      sortedStudents.forEach(
        (student) => {
          let status = null;

          if (
            student.attendanceStatus
          ) {
            status =
              student.attendanceStatus;
          } else if (
            student.status
          ) {
            status = student.status;
          }

          if (
            status &&
            (status === "Present" ||
              status === "Absent")
          ) {
            initialStatus[
              student._id
            ] = status;
          }
        }
      );

      setAttendanceStatus(
        initialStatus
      );
    } catch (error) {
      setError(
        "Failed to fetch students."
      );
    } finally {
      setLoading(false);
    }
  }, [
    schoolContext?.schoolId,
    batchContext?.batch,
    startDate,
    sortStudentsAlphabetically,
  ]);

  const handleMarkAttendance =
    useCallback(
      async (student, status) => {
        const scrollTop =
          tableWrapperRef.current
            ?.scrollTop || 0;

        const scrollLeft =
          tableWrapperRef.current
            ?.scrollLeft || 0;

        setAttendanceStatus(
          (prev) => ({
            ...prev,
            [student._id]: status,
          })
        );

        setAttendanceLoading(
          (prev) => ({
            ...prev,
            [student._id]: true,
          })
        );

        const reqBody = {
          _id: student._id,
          status: status,
          isAttendanceMarked: true,
          startDate: startDate,
        };

        try {
          await MarkMBStudentAttendance(
            reqBody
          );
        } catch (error) {
          setError(
            "Failed to mark attendance."
          );

          setAttendanceStatus(
            (prev) => ({
              ...prev,
              [student._id]:
                status === "Present"
                  ? "Absent"
                  : "Present",
            })
          );

          setTimeout(() => {
            setError(null);
          }, 3000);
        } finally {
          setAttendanceLoading(
            (prev) => ({
              ...prev,
              [student._id]: false,
            })
          );

          requestAnimationFrame(() => {
            if (
              tableWrapperRef.current
            ) {
              tableWrapperRef.current.scrollTop =
                scrollTop;

              tableWrapperRef.current.scrollLeft =
                scrollLeft;
            }
          });
        }
      },
      [startDate]
    );

  const toggleAttendance =
    useCallback(
      (student) => {
        const currentStatus =
          attendanceStatus[
            student._id
          ];

        const newStatus =
          currentStatus === "Present"
            ? "Absent"
            : "Present";

        handleMarkAttendance(
          student,
          newStatus
        );
      },
      [
        attendanceStatus,
        handleMarkAttendance,
      ]
    );

  useEffect(() => {
    if (
      schoolContext?.schoolId &&
      batchContext?.batch
    ) {
      fetchStudents();
    }
  }, [
    schoolContext?.schoolId,
    batchContext?.batch,
    startDate,
    fetchStudents,
  ]);

  const TableView = useMemo(() => {
    if (students.length === 0) {
      return (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">
            No students found
          </p>
        </div>
      );
    }

    return (
      <div
        ref={tableWrapperRef}
        className="attendance-table-wrapper"
      >
        <Table
          striped
          bordered
          hover
          className="attendance-table"
        >
          <thead>
            <tr>
              <th className="small-heading">
                S.No.
              </th>

              <th className="small-heading">
                SRN
              </th>

              <th className="name-heading">
                Student Name
              </th>

              <th className="name-heading">
                Father's Name
              </th>

              <th className="small-heading">
                Att.
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map(
              (student, index) => (
                <StudentRow
                  key={student._id}
                  student={student}
                  index={index}
                  currentStatus={
                    attendanceStatus[
                      student._id
                    ]
                  }
                  isLoading={
                    attendanceLoading[
                      student._id
                    ]
                  }
                  onToggle={
                    toggleAttendance
                  }
                />
              )
            )}
          </tbody>
        </Table>
      </div>
    );
  }, [
    students,
    attendanceStatus,
    attendanceLoading,
    toggleAttendance,
  ]);

  const CardView = () => (
    <Row className="g-2 mt-2">
      {students.map((student) => {
        const currentStatus =
          attendanceStatus[
            student._id
          ];

        const isLoading =
          attendanceLoading[
            student._id
          ];

        const isPresent =
          currentStatus === "Present";

        return (
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={student._id}
          >
            <Card className="h-100 shadow-sm">
              <Card.Header
                className={
                  isPresent
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }
              >
                <div className="d-flex justify-content-between">
                  <strong>
                    {student.firstName}
                  </strong>

                  <Badge bg="light">
                    {
                      student.rollNumber
                    }
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body>
                <p>
                  <strong>SRN:</strong>{" "}
                  {
                    student.studentSrn
                  }
                </p>

                <p>
                  <strong>Father:</strong>{" "}
                  {
                    student.fatherName
                  }
                </p>
              </Card.Body>

              <Card.Footer className="bg-white">
                <Button
                  variant={
                    isPresent
                      ? "success"
                      : "danger"
                  }
                  className="w-100"
                  onClick={() =>
                    toggleAttendance(
                      student
                    )
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spin me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {isPresent ? (
                        <FaUserCheck />
                      ) : (
                        <FaUserTimes />
                      )}{" "}
                      {isPresent
                        ? "Present"
                        : "Absent"}
                    </>
                  )}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Container
      fluid
      className="mt-3 mb-3"
    >
      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() =>
            setSuccessMessage(null)
          }
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setError(null)
          }
        >
          {error}
        </Alert>
      )}

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
              <h6 className="mb-0">
                Students List
              </h6>

              <small className="text-muted">
                Total: {students.length}
              </small>
            </div>

            <ToggleButtonGroup
              type="radio"
              name="viewMode"
              value={viewMode}
              onChange={(val) =>
                val &&
                setViewMode(val)
              }
              size="sm"
            >
              <ToggleButton
                id="table-view"
                value="table"
                variant="outline-primary"
              >
                <FaTable className="me-1" />
                Table
              </ToggleButton>

              <ToggleButton
                id="card-view"
                value="card"
                variant="outline-primary"
              >
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

          <p className="mt-3">
            Loading students...
          </p>
        </div>
      ) : viewMode === "table" ? (
        TableView
      ) : (
        <CardView />
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
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
          min-width: 520px;
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
            min-width: 480px;
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
        }
      `}</style>
    </Container>
  );
};