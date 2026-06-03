import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";

import {
  School_drop_down,
  Batch_drop_down,
} from "../Utils/DependentDropDowns.v2";

import {
  getStudentUploadsObjectives,
  StudentUploadDashboard,
} from "../../service/StudentUploadServices/StudentUpload.services";

import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Row,
  Col,
  Alert,
  Form,
  Table,
  ProgressBar,
} from "react-bootstrap";

import Select from "react-select";

import {
  FaChartLine,
  FaUsers,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaChartPie,
  FaCalendarAlt,
  FaBook,
  FaUniversity,
  FaSchool,
  FaCity,
  FaMapMarkerAlt,
  FaFilter,
  FaDownload as FaDownloadIcon,
} from "react-icons/fa";

const DashboardCard = ({ title, value, subtitle, icon, color, variant }) => {
  return (
    <Card className="h-100 shadow-sm border-0 hover-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-muted mb-2 small-text">{title}</h6>
            <h2 className="mb-2 fw-bold">{value}</h2>
            <small className="text-muted">{subtitle}</small>
          </div>
          <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle`}>
            {icon}
          </div>
        </div>
        {variant && (
          <Badge bg={variant} className="mt-2">
            {variant === "success" ? "Excellent" : variant === "warning" ? "Average" : "Poor"}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );
};

export const StudentsUploadDashboard = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(DistrictBlockSschoolContextV2);
  const { batchContext } = useContext(DistrictBlockSschoolContextV2);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [loadingObjectives, setLoadingObjectives] = useState(false);
  
  const [activeView, setActiveView] = useState("schools");

  const fetchUploadsObjectives = async () => {
    setLoadingObjectives(true);
    try {
      const response = await getStudentUploadsObjectives();
      if (response.data && response.data.data && response.data.data.length > 0) {
        const objectiveOptions = response.data.data.map(obj => ({
          value: obj._id,
          label: `${obj.objective} - ${obj.subject} (Due: ${new Date(obj.submissionDate).toLocaleDateString()})`,
          objectiveData: obj
        }));
        setObjectives(objectiveOptions);
      }
    } catch (error) {
      console.error("Error fetching objectives:", error);
      setError("Failed to fetch objectives.");
    } finally {
      setLoadingObjectives(false);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const schoolIdArray = schoolContext?.schoolId 
      ? (Array.isArray(schoolContext.schoolId) ? schoolContext.schoolId : [schoolContext.schoolId])
      : [];
      
    const batchArray = batchContext?.batch 
      ? (Array.isArray(batchContext.batch) ? batchContext.batch : [batchContext.batch])
      : [];

    const reqBody = {
      idofstudentuploadobjectives: selectedObjective?.value || undefined,
      schoolId: schoolIdArray,
      batch: batchArray,
      districtId: [],
      blockId: [],
    };

    Object.keys(reqBody).forEach(key => {
      if (reqBody[key] === undefined || (Array.isArray(reqBody[key]) && reqBody[key].length === 0)) {
        delete reqBody[key];
      }
    });

    console.log("Dashboard Request Body:", reqBody);

    try {
      const response = await StudentUploadDashboard(reqBody);
      
      if (response.data && response.data.success) {
        setDashboardData({
          mode: response.data.mode,
          ...response.data.data
        });
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError(error.response?.data?.message || error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [selectedObjective, schoolContext?.schoolId, batchContext?.batch]);

  const handleObjectiveChange = (selectedOption) => {
    setSelectedObjective(selectedOption);
    setDashboardData(null);
    setError(null);
  };

  useEffect(() => {
    fetchUploadsObjectives();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const renderMasterDashboard = () => {
    if (!dashboardData || dashboardData.mode !== "master_dashboard") return null;

    const { overallSummary, objectivesSummary, filters } = dashboardData;

    const hasFilters = (filters?.batch?.length > 0) || (filters?.schoolId?.length > 0);

    return (
      <>
        <div className="dashboard-header mb-4 p-4 bg-gradient-primary rounded-3 text-white">
          <h3 className="mb-2">📊 Master Dashboard</h3>
          <p className="mb-0 opacity-75">Complete overview of all student upload objectives and progress</p>
          {lastUpdated && (
            <small className="opacity-50 mt-2 d-block">
              <FaCalendarAlt className="me-1" /> Last updated: {lastUpdated.toLocaleString()}
            </small>
          )}
          {hasFilters && (
            <div className="mt-3">
              {filters.batch?.length > 0 && (
                <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                  <FaFilter className="me-1" /> Batch: {filters.batch.join(", ")}
                </Badge>
              )}
              {filters.schoolId?.length > 0 && (
                <Badge bg="light" text="dark" className="px-3 py-2">
                  <FaFilter className="me-1" /> Schools: {filters.schoolId.length} selected
                </Badge>
              )}
            </div>
          )}
        </div>

        <Row className="mb-4 g-3">
          <Col lg={3} md={6}>
            <DashboardCard
              title="TOTAL OBJECTIVES"
              value={overallSummary?.totalObjectives || 0}
              subtitle="Active assignments"
              icon={<FaTrophy size={28} className="text-primary" />}
              color="primary"
            />
          </Col>
          <Col lg={3} md={6}>
            <DashboardCard
              title="TOTAL STUDENTS"
              value={(overallSummary?.totalStudents || 0).toLocaleString()}
              subtitle="Across all objectives"
              icon={<FaUsers size={28} className="text-success" />}
              color="success"
            />
          </Col>
          <Col lg={3} md={6}>
            <DashboardCard
              title="TOTAL UPLOADS"
              value={(overallSummary?.totalUploads || 0).toLocaleString()}
              subtitle="Files submitted"
              icon={<FaUpload size={28} className="text-info" />}
              color="info"
            />
          </Col>
          <Col lg={3} md={6}>
            <DashboardCard
              title="COMPLETION RATE"
              value={`${overallSummary?.overallCompletionPercentage || 0}%`}
              subtitle="Overall progress"
              icon={<FaChartPie size={28} className="text-warning" />}
              color="warning"
              variant={overallSummary?.overallCompletionPercentage >= 70 ? "success" : overallSummary?.overallCompletionPercentage >= 40 ? "warning" : "danger"}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">📋 All Objectives</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped bordered hover className="dashboard-table">
                    <thead className="table-light">
                      <tr>
                        <th>Objective Name</th>
                        <th>Subject</th>
                        <th>Due Date</th>
                        <th className="text-center">Students</th>
                        <th className="text-center">Uploads</th>
                        <th className="text-center">Pending</th>
                        <th className="text-center">Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {objectivesSummary?.map((objective, idx) => (
                        <tr 
                          key={idx} 
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            const selected = objectives.find(o => o.value === objective.objectiveId);
                            if (selected) setSelectedObjective(selected);
                          }}
                          className="clickable-row"
                        >
                          <td>
                            <strong>{objective.objectiveName}</strong>
                            <br />
                            <small className="text-muted">ID: {objective.objectiveId}</small>
                          </td>
                          <td>{objective.subject}</td>
                          <td>{new Date(objective.submissionDate).toLocaleDateString()}</td>
                          <td className="text-center">{objective.totalStudents}</td>
                          <td className="text-center">{objective.totalUploads}</td>
                          <td className="text-center">{objective.pendingUploads}</td>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <ProgressBar 
                                now={parseFloat(objective.completionPercentage)} 
                                variant={objective.completionPercentage >= 70 ? "success" : objective.completionPercentage >= 40 ? "warning" : "danger"}
                                style={{ width: '80px', height: '6px' }}
                              />
                              <Badge bg={objective.completionPercentage >= 70 ? "success" : objective.completionPercentage >= 40 ? "warning" : "danger"}>
                                {objective.completionPercentage}%
                              </Badge>
                            </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderSpecificObjectiveDashboard = () => {
    if (!dashboardData || dashboardData.mode !== "specific_objective") return null;

    const { objective, objectiveWiseSummary, schoolWiseSummary } = dashboardData;

    const hasBatchFilter = batchContext?.batch && batchContext.batch.length > 0;
    const hasSchoolFilter = schoolContext?.schoolId && schoolContext.schoolId.length > 0;

    // Group schools by district for district-wise view
    const getDistrictWiseData = () => {
      if (!schoolWiseSummary || schoolWiseSummary.length === 0) return [];
      const districtMap = new Map();
      schoolWiseSummary.forEach(school => {
        const key = school.districtId;
        if (districtMap.has(key)) {
          const existing = districtMap.get(key);
          existing.totalStudents += school.totalStudents;
          existing.totalUploads += school.totalUploads;
          existing.pendingUploads += school.pendingUploads;
          existing.totalSchools += 1;
          existing.schools.push({
            schoolId: school.schoolId,
            schoolName: school.schoolName,
            totalStudents: school.totalStudents,
            totalUploads: school.totalUploads,
            pendingUploads: school.pendingUploads,
            completionPercentage: school.completionPercentage
          });
          if (school.districtName !== "N/A" && existing.districtName === "N/A") {
            existing.districtName = school.districtName;
          }
          existing.completionPercentage = ((existing.totalUploads / existing.totalStudents) * 100).toFixed(2);
        } else {
          districtMap.set(key, {
            districtId: school.districtId,
            districtName: school.districtName,
            totalStudents: school.totalStudents,
            totalUploads: school.totalUploads,
            pendingUploads: school.pendingUploads,
            totalSchools: 1,
            completionPercentage: school.completionPercentage,
            schools: [{
              schoolId: school.schoolId,
              schoolName: school.schoolName,
              totalStudents: school.totalStudents,
              totalUploads: school.totalUploads,
              pendingUploads: school.pendingUploads,
              completionPercentage: school.completionPercentage
            }]
          });
        }
      });
      return Array.from(districtMap.values()).sort((a, b) => a.districtName.localeCompare(b.districtName));
    };

    const districtWiseData = getDistrictWiseData();

    return (
      <>
        <div className="dashboard-header mb-4 p-4 bg-gradient-primary rounded-3 text-white">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h3 className="mb-2">{objective?.objective}</h3>
              <div className="d-flex gap-2 flex-wrap mt-2">
                <Badge bg="light" text="dark" className="px-3 py-2">
                  <FaBook className="me-1" /> {objective?.subject}
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2">
                  <FaCalendarAlt className="me-1" /> Due: {objective?.submissionDate ? new Date(objective.submissionDate).toLocaleDateString() : 'N/A'}
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2">
                  <FaUniversity className="me-1" /> {objective?.batch || 'N/A'}
                </Badge>
              </div>
            </div>
            <Button 
              variant="light" 
              size="sm"
              onClick={() => setSelectedObjective(null)}
              className="rounded-pill"
            >
              ← Back to All Objectives
            </Button>
          </div>
          {hasBatchFilter && (
            <div className="mt-3">
              <Badge bg="warning" text="dark" className="px-3 py-2">
                <FaFilter className="me-1" /> Filtered by Batch: {batchContext.batch}
              </Badge>
            </div>
          )}
          {hasSchoolFilter && (
            <div className="mt-2">
              <Badge bg="info" text="dark" className="px-3 py-2">
                <FaFilter className="me-1" /> Filtered by School: {schoolContext.schoolId.length} selected
              </Badge>
            </div>
          )}
          {lastUpdated && (
            <small className="opacity-50 mt-2 d-block">
              Last updated: {lastUpdated.toLocaleString()}
            </small>
          )}
        </div>

        {/* Summary Cards */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <DashboardCard
              title="TOTAL STUDENTS"
              value={(objectiveWiseSummary?.totalStudentsOverall || 0).toLocaleString()}
              subtitle="Eligible students"
              icon={<FaUsers size={28} className="text-success" />}
              color="success"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="TOTAL UPLOADS"
              value={(objectiveWiseSummary?.totalUploadsOverall || 0).toLocaleString()}
              subtitle="Files submitted"
              icon={<FaUpload size={28} className="text-info" />}
              color="info"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="COMPLETION RATE"
              value={`${objectiveWiseSummary?.overallCompletionPercentage || 0}%`}
              subtitle="Progress"
              icon={<FaChartLine size={28} className="text-warning" />}
              color="warning"
              variant={objectiveWiseSummary?.overallCompletionPercentage >= 70 ? "success" : objectiveWiseSummary?.overallCompletionPercentage >= 40 ? "warning" : "danger"}
            />
          </Col>
        </Row>

        {/* Batch-wise Breakdown Cards */}
        {objectiveWiseSummary?.batchWiseBreakdown && objectiveWiseSummary.batchWiseBreakdown.length > 0 && (
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0 pt-3">
                  <h6 className="mb-0">📊 Batch-wise Performance</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    {objectiveWiseSummary.batchWiseBreakdown.map((batch, idx) => (
                      <Col md={4} key={idx}>
                        <Card className={`border-0 h-100 ${batch.batch === batchContext?.batch ? 'bg-warning bg-opacity-10 border-warning' : 'bg-light'}`}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">{batch.batch}</h6>
                              {batch.batch === batchContext?.batch && (
                                <Badge bg="warning" text="dark">Active Filter</Badge>
                              )}
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">Progress:</small>
                              <strong>{batch.completionPercentage}%</strong>
                            </div>
                            <ProgressBar 
                              now={parseFloat(batch.completionPercentage)} 
                              variant={batch.completionPercentage >= 70 ? "success" : batch.completionPercentage >= 40 ? "warning" : "danger"}
                              className="mb-2"
                              style={{ height: '8px' }}
                            />
                            <div className="row mt-2">
                              <div className="col-6">
                                <small className="text-muted d-block">Students</small>
                                <strong>{batch.totalStudents}</strong>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">Uploads</small>
                                <strong>{batch.totalUploads}</strong>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Only show district and school tables when batch filter is applied */}
        {hasBatchFilter && schoolWiseSummary && schoolWiseSummary.length > 0 ? (
          <>
            {/* District-wise Summary Table */}
            <Row className="mb-4">
              <Col xs={12}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white border-0 pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">🏢 District-wise Summary</h6>
                      <Badge bg="secondary">{districtWiseData.length} Districts</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <Table striped bordered hover className="dashboard-table">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>District Name</th>
                            <th className="text-center">Schools</th>
                            <th className="text-center">Total Students</th>
                            <th className="text-center">Total Uploads</th>
                            <th className="text-center">Pending</th>
                            <th className="text-center">Completion %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {districtWiseData.map((district, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{idx + 1}</td>
                              <td>
                                <strong>{district.districtName !== "N/A" ? district.districtName : `District ${district.districtId}`}</strong>
                                <br />
                                <small className="text-muted">ID: {district.districtId}</small>
                              </td>
                              <td className="text-center">{district.totalSchools}</td>
                              <td className="text-center">{district.totalStudents}</td>
                              <td className="text-center text-success">{district.totalUploads}</td>
                              <td className="text-center text-warning">{district.pendingUploads}</td>
                              <td className="text-center">
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  <ProgressBar 
                                    now={parseFloat(district.completionPercentage)} 
                                    variant={district.completionPercentage >= 70 ? "success" : district.completionPercentage >= 40 ? "warning" : "danger"}
                                    style={{ width: '80px', height: '6px' }}
                                  />
                                  <Badge bg={district.completionPercentage >= 70 ? "success" : district.completionPercentage >= 40 ? "warning" : "danger"}>
                                    {district.completionPercentage}%
                                  </Badge>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <td colSpan="2"><strong>Total</strong></td>
                            <td className="text-center"><strong>{districtWiseData.reduce((sum, d) => sum + d.totalSchools, 0)}</strong></td>
                            <td className="text-center"><strong>{districtWiseData.reduce((sum, d) => sum + d.totalStudents, 0)}</strong></td>
                            <td className="text-center"><strong>{districtWiseData.reduce((sum, d) => sum + d.totalUploads, 0)}</strong></td>
                            <td className="text-center"><strong>{districtWiseData.reduce((sum, d) => sum + d.pendingUploads, 0)}</strong></td>
                            <td className="text-center">
                              <strong>
                                {((districtWiseData.reduce((sum, d) => sum + d.totalUploads, 0) / 
                                  districtWiseData.reduce((sum, d) => sum + d.totalStudents, 0)) * 100).toFixed(2)}%
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* School-wise Summary Table */}
            <Row className="mb-4">
              <Col xs={12}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white border-0 pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">🏫 School-wise Submission Details</h6>
                      <Badge bg="secondary">{schoolWiseSummary.length} Schools</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <Table striped bordered hover className="dashboard-table">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>School Name</th>
                            <th>District</th>
                            <th>Block</th>
                            <th className="text-center">Students</th>
                            <th className="text-center">Uploads</th>
                            <th className="text-center">Pending</th>
                            <th className="text-center">Completion %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schoolWiseSummary.map((school, idx) => (
                            <tr key={idx}>
                              <td className="text-center">{idx + 1}</td>
                              <td>
                                {school.schoolName !== "Unknown School" ? (
                                  <>
                                    <strong>{school.schoolName}</strong>
                                    <br />
                                    <small className="text-muted">ID: {school.schoolId}</small>
                                  </>
                                ) : (
                                  <>
                                    <strong className="text-warning">⚠️ School ID: {school.schoolId}</strong>
                                    <br />
                                    <small className="text-muted">Name not available</small>
                                  </>
                                )}
                              </td>
                              <td>{school.districtName !== "N/A" ? school.districtName : "—"}</td>
                              <td>{school.blockName !== "N/A" ? school.blockName : "—"}</td>
                              <td className="text-center">{school.totalStudents}</td>
                              <td className="text-center text-success">{school.totalUploads}</td>
                              <td className="text-center text-warning">{school.pendingUploads}</td>
                              <td className="text-center">
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  <ProgressBar 
                                    now={parseFloat(school.completionPercentage)} 
                                    variant={school.completionPercentage >= 70 ? "success" : school.completionPercentage >= 40 ? "warning" : "danger"}
                                    style={{ width: '80px', height: '6px' }}
                                  />
                                  <Badge bg={school.completionPercentage >= 70 ? "success" : school.completionPercentage >= 40 ? "warning" : "danger"}>
                                    {school.completionPercentage}%
                                  </Badge>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <td colSpan="4"><strong>Total</strong></td>
                            <td className="text-center"><strong>{schoolWiseSummary.reduce((sum, s) => sum + s.totalStudents, 0)}</strong></td>
                            <td className="text-center"><strong className="text-success">{schoolWiseSummary.reduce((sum, s) => sum + s.totalUploads, 0)}</strong></td>
                            <td className="text-center"><strong className="text-warning">{schoolWiseSummary.reduce((sum, s) => sum + s.pendingUploads, 0)}</strong></td>
                            <td className="text-center">
                              <strong>
                                {((schoolWiseSummary.reduce((sum, s) => sum + s.totalUploads, 0) / 
                                  schoolWiseSummary.reduce((sum, s) => sum + s.totalStudents, 0)) * 100).toFixed(2)}%
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : hasBatchFilter && (!schoolWiseSummary || schoolWiseSummary.length === 0) ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <FaSchool size={60} className="text-muted mb-3" />
            <p className="text-muted mb-0">No school data available for the selected batch filter.</p>
            <p className="text-muted small mt-2">Please try selecting a different batch or objective.</p>
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <FaFilter size={60} className="text-muted mb-3" />
            <p className="text-muted mb-0">Please apply a batch filter to view district and school-wise data.</p>
            <p className="text-muted small mt-2">Select a batch from the filter above to see detailed statistics.</p>
          </div>
        )}
      </>
    );
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '38px',
      fontSize: '14px',
      borderRadius: '8px',
      borderColor: '#e0e0e0',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '13px',
      padding: '8px 12px',
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
      color: state.isSelected ? 'white' : '#212529',
    }),
  };

  return (
    <Container fluid className="dashboard-container mt-3 mb-3">
      <style>{`
        .dashboard-container {
          background: #f8f9fc;
          min-height: 100vh;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hover-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .clickable-row {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .clickable-row:hover {
          background-color: #f8f9fa !important;
        }
        
        .dashboard-table {
          font-size: 13px;
        }
        
        .dashboard-table thead th {
          background-color: #f8f9fa;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
        }
        
        .table-responsive {
          max-height: 550px;
          overflow: auto;
          border-radius: 8px;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 12px;
            padding-right: 12px;
          }
          
          .dashboard-table {
            font-size: 11px;
          }
          
          .dashboard-header {
            padding: 20px !important;
          }
          
          .dashboard-header h3 {
            font-size: 18px;
          }
        }
      `}</style>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="rounded-3">
          <FaTimesCircle className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col xs={12}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="py-3">
              <Row className="g-3 align-items-end">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label className="fw-semibold mb-1">Select Objective</Form.Label>
                    <Select
                      options={objectives}
                      value={selectedObjective}
                      onChange={handleObjectiveChange}
                      isLoading={loadingObjectives}
                      isClearable
                      placeholder="All Objectives (Master Dashboard)"
                      styles={customSelectStyles}
                      noOptionsMessage={() => "No objectives found"}
                    />
                    <Form.Text className="text-muted small">
                      {selectedObjective ? 'Viewing specific objective details' : 'Viewing all objectives summary'}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Label className="fw-semibold mb-1">Filter by School</Form.Label>
                  <School_drop_down />
                </Col>
                <Col md={4}>
                  <Form.Label className="fw-semibold mb-1">Filter by Batch (Required for details)</Form.Label>
                  <Batch_drop_down />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {(loading || loadingObjectives) && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      )}

      {!loading && !loadingObjectives && dashboardData && (
        <>
          {dashboardData.mode === "master_dashboard" && renderMasterDashboard()}
          {dashboardData.mode === "specific_objective" && renderSpecificObjectiveDashboard()}
        </>
      )}

      {!loading && !loadingObjectives && !dashboardData && !error && (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm">
          <FaChartLine size={60} className="text-muted mb-3" />
          <p className="text-muted mb-0">No data available. Please select an objective to begin.</p>
        </div>
      )}
    </Container>
  );
};