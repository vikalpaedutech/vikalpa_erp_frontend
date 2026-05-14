// import React, {useEffect, useContext, useState} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { UserAttendanceDashboard, MarkUserAttendance } from "../../service/User.service";

// export const UserAttendanceDashboardV2 = () =>{
// const { userData } = useContext(UserContext);

// console.log(userData)

//     return(
//         <>
//         hello
//         </>
//     )
// }



import React, { useEffect, useContext, useState, useMemo, useCallback } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { UserAttendanceDashboard, MarkUserAttendanceManually } from "../../service/User.service";
import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export const UserAttendanceDashboardV2 = () => {
  const { userData } = useContext(UserContext);
  const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    date: null,
    role: null,
    region: null,
    attendanceStatus: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendanceFormData, setAttendanceFormData] = useState({});

  const [regionOptions, setRegionOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  // Get current date string
  const getCurrentDate = useCallback(() => {
    return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
  }, [filters.date, startDate]);

  // Determine role filter based on user role
  const getRoleFilter = useCallback(() => {
    if (userData?.role === 'ACI') {
      return "CC";
    } else if (userData?.role === 'Community Manager') {
      return ["CC", "ACI"];
    }
    return undefined;
  }, [userData]);

  // Sort users by name alphabetically
  const sortUsersByName = useCallback((users) => {
    return [...users].sort((a, b) => a.name?.localeCompare(b.name));
  }, []);

  // Fetch dashboard data
  const fetchAttendanceData = useCallback(async () => {
    setLoading(true);
    try {
      const roleFilter = getRoleFilter();
      const currentDate = getCurrentDate();
      console.log(startDate)
      const reqBody = {
        date: startDate || currentDate,
        role: roleFilter,
      };
      
      const response = await UserAttendanceDashboard(reqBody);
      if (response.status === "Ok") {
        const sortedData = sortUsersByName(response.data);
        setAttendanceData(sortedData);
        setFilteredData(sortedData);
        
        // Extract unique roles for role filter
        const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
        setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
        // Extract unique regions
        const allRegions = [];
        sortedData.forEach(user => {
          if (user.role === 'CC') {
            user.schoolsData?.forEach(school => {
              allRegions.push({
                value: school.schoolId,
                label: school.schoolName,
                type: 'school'
              });
            });
          } else if (user.role === 'ACI') {
            const uniqueDistricts = [...new Set(user.schoolsData?.map(school => school.districtName))];
            uniqueDistricts.forEach(district => {
              if (district) {
                allRegions.push({
                  value: district,
                  label: district,
                  type: 'district'
                });
              }
            });
          }
        });
        const uniqueRegions = Array.from(new Map(allRegions.map(item => [item.value, item])).values());
        setRegionOptions(uniqueRegions);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setErrorMessage("Failed to fetch attendance data");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }, [getRoleFilter, getCurrentDate, sortUsersByName]);

  // Handle date change from SingleDatePicker
  const handleDateChange = (dateObj) => {
    if (dateObj && dateObj.YYYYMMDD) {
      setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
      // Also update the global context if needed
      if (setStartDate) {
        setStartDate(dateObj);
      }
    }
  };

  // Apply filters and maintain sorting
  useEffect(() => {
    let filtered = [...attendanceData];
    
    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role.value);
    }
    
    // Region filter
    if (filters.region) {
      filtered = filtered.filter(user => {
        if (user.role === 'CC') {
          return user.schoolsData?.some(school => 
            school.schoolName === filters.region.label || school.schoolId === filters.region.value
          );
        } else if (user.role === 'ACI') {
          return user.schoolsData?.some(school => 
            school.districtName === filters.region.label
          );
        }
        return false;
      });
    }
    
    // Attendance status filter
    if (filters.attendanceStatus) {
      filtered = filtered.filter(user => {
        const currentAttendance = user.userAttendanceDetails?.[0];
        const status = currentAttendance?.attendance || "Not Marked";
        return status === filters.attendanceStatus;
      });
    }
    
    // Always maintain alphabetical order
    setFilteredData(sortUsersByName(filtered));
  }, [filters.role, filters.region, filters.attendanceStatus, attendanceData, sortUsersByName]);

  // Validate if attendance can be marked
  const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
    if (!attendanceStatus) return false;
    
    if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
      return false;
    }
    
    if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
      return false;
    }
    
    return true;
  }, []);

  // Mark attendance instantly on select
  const handleAttendanceChange = useCallback(async (user, attendanceStatus) => {
    const formData = attendanceFormData[user._id] || {};
    
    // Validate before marking
    if (!canMarkAttendance(user, attendanceStatus, formData)) {
      if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
        setErrorMessage("Please enter visiting location for Field Visit");
      } else if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
        setErrorMessage("Please enter remark for Manual Attendance");
      } else {
        setErrorMessage("Please select valid attendance status");
      }
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setMarkingAttendance(user._id);
    try {
      const currentDate = getCurrentDate();
      
      const reqBody = {
        _id: user._id,
        userId: user.userId,
        date: startDate || currentDate,
        attendance: attendanceStatus,
        attendanceType: formData.attendanceType || "Daily Attendance",
        attendanceMarkedBy: userData?._id || "Admin",
        loginTime: new Date().toISOString(),
        logoutTime: new Date().toISOString(),
        longitude: user.longitude || 0,
        latitude: user.latitude || 0,
        visitingLocation: formData.visitingLocation || null,
        remarkForManualAttendance: formData.remarkForManualAttendance || null
      };
      
      const response = await MarkUserAttendanceManually(reqBody);
      if (response.status === "Ok") {
        // Update local state without page reload
        const updatedAttendanceData = attendanceData.map(existingUser => {
          if (existingUser._id === user._id) {
            // Update the user's attendance details
            const updatedUser = { ...existingUser };
            const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
            updatedUser.userAttendanceDetails = [{
              ...existingAttendance,
              attendance: attendanceStatus,
              attendanceType: formData.attendanceType || "Daily Attendance",
              date: currentDate,
              loginTime: new Date().toISOString(),
              logoutTime: new Date().toISOString()
            }];
            
            return updatedUser;
          }
          return existingUser;
        });
        
        const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
        setAttendanceData(sortedUpdatedData);
        
        // Clear form data for this user
        setAttendanceFormData(prev => ({
          ...prev,
          [user._id]: {}
        }));
        
        setSuccessMessage(`✅ Attendance marked as ${attendanceStatus} for ${user.name}`);
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setErrorMessage("Failed to mark attendance");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setErrorMessage("Error marking attendance: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setMarkingAttendance(null);
    }
  }, [attendanceData, attendanceFormData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id]);

  // Update attendance form data for a user
  const updateAttendanceFormData = useCallback((userId, field, value) => {
    setAttendanceFormData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      date: null,
      role: null,
      region: null,
      attendanceStatus: ""
    });
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  // Fetch data when date changes
  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData, filters.date]);

  // Get attendance badge
  const getAttendanceBadge = useCallback((attendance) => {
    switch(attendance) {
      case 'Present': return <Badge bg="success">✅ Present</Badge>;
      case 'Absent': return <Badge bg="danger">❌ Absent</Badge>;
      case 'Half Day': return <Badge bg="warning" className="text-dark">⏳ Half Day</Badge>;
      case 'WFH': return <Badge bg="info">🏠 WFH</Badge>;
      case 'Comp-off': return <Badge bg="secondary">📅 Comp-off</Badge>;
      case 'Monthly Leave': return <Badge bg="primary">📆 Monthly Leave</Badge>;
      case 'Sick Leave': return <Badge bg="danger">🤒 Sick Leave</Badge>;
      case 'LWP': return <Badge bg="dark">⚠️ LWP</Badge>;
      default: return <Badge bg="secondary">⭕ Not Marked</Badge>;
    }
  }, []);

  // Statistics
  const totalUsers = filteredData.length;
  const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
  const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
  const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

  const attendanceStatusOptions = [
    { value: "", label: "📊 All Status" },
    { value: "Present", label: "✅ Present" },
    { value: "Absent", label: "❌ Absent" },
    { value: "Half Day", label: "⏳ Half Day" },
    { value: "WFH", label: "🏠 WFH" },
    { value: "Comp-off", label: "📅 Comp-off" },
    { value: "Monthly Leave", label: "📆 Monthly Leave" },
    { value: "Sick Leave", label: "🤒 Sick Leave" },
    { value: "LWP", label: "⚠️ LWP" }
  ];

  const attendanceTypeOptions = [
    { value: "Daily Attendance", label: "Daily Attendance" },
    { value: "Field Visit", label: "Field Visit" },
    { value: "Manual Attendance", label: "Manual Attendance" }
  ];

  // Card View Component
  const CardView = useCallback(() => (
    <Row className="g-3">
      {filteredData.map((user, index) => {
        const currentAttendance = user.userAttendanceDetails?.[0];
        const attendanceStatus = currentAttendance?.attendance || "Not Marked";
        const formData = attendanceFormData[user._id] || {};
        const isMarking = markingAttendance === user._id;
        const isDisabled = isMarking || loading;
        const canSubmit = canMarkAttendance(user, attendanceStatus, formData);
        
        return (
          <Col md={6} lg={4} key={user._id}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <Badge bg="secondary" className="px-2 py-1">#{index + 1}</Badge>
                      <Badge bg="info">{user.role}</Badge>
                    </div>
                    <h6 className="mb-1 fw-bold">{user.name}</h6>
                    <small className="text-muted">{user.userId}</small>
                  </div>
                  {getAttendanceBadge(attendanceStatus)}
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">🏫 Region:</small>
                  <div className="small">
                    {user.role === 'CC' 
                      ? user.schoolsData?.map(s => s.schoolName).join(', ')
                      : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
                  </div>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">🕐 Last Login:</small>
                  <div className="small">
                    {currentAttendance?.loginTime 
                      ? new Date(currentAttendance.loginTime).toLocaleString()
                      : 'Not logged in'}
                  </div>
                </div>
                
                <hr />
                
                <Form.Select 
                  size="sm" 
                  className="mb-2"
                  value={formData.attendanceType || "Daily Attendance"}
                  onChange={(e) => updateAttendanceFormData(user._id, 'attendanceType', e.target.value)}
                  disabled={isDisabled}
                >
                  {attendanceTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
                
                {formData.attendanceType === "Field Visit" && (
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter visiting location *"
                    className="mb-2"
                    value={formData.visitingLocation || ""}
                    onChange={(e) => updateAttendanceFormData(user._id, 'visitingLocation', e.target.value)}
                    disabled={isDisabled}
                    isInvalid={formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()}
                  />
                )}
                
                {formData.attendanceType === "Manual Attendance" && (
                  <Form.Control
                    size="sm"
                    as="textarea"
                    rows={2}
                    placeholder="Enter remark for manual attendance *"
                    className="mb-2"
                    value={formData.remarkForManualAttendance || ""}
                    onChange={(e) => updateAttendanceFormData(user._id, 'remarkForManualAttendance', e.target.value)}
                    disabled={isDisabled}
                    isInvalid={formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()}
                  />
                )}
                
                <Form.Select 
                  size="sm"
                  value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
                  onChange={(e) => handleAttendanceChange(user, e.target.value)}
                  disabled={isDisabled || !canSubmit}
                >
                  <option value="">📊 Select Attendance</option>
                  <option value="Present">✅ Present</option>
                  <option value="Absent">❌ Absent</option>
                  <option value="Half Day">⏳ Half Day</option>
                  <option value="WFH">🏠 WFH</option>
                  <option value="Comp-off">📅 Comp-off</option>
                  <option value="Monthly Leave">📆 Monthly Leave</option>
                  <option value="Sick Leave">🤒 Sick Leave</option>
                  <option value="LWP">⚠️ LWP</option>
                </Form.Select>
                
                {isMarking && <Spinner size="sm" className="mt-2" />}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  ), [filteredData, attendanceFormData, markingAttendance, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge]);

  // Table View Component
  const TableView = useCallback(() => (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="py-3">#</th>
            <th className="py-3">👤 User</th>
            <th className="py-3">🎭 Role</th>
            <th className="py-3">🏫 Region</th>
            <th className="py-3">📊 Attendance Status</th>
            <th className="py-3">🕐 Login Time</th>
            <th className="py-3">📝 Mark Attendance</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading attendance data...</p>
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-5">
                <div className="text-muted">
                  <FaClock size={50} className="mb-3 opacity-50" />
                  <p>No attendance data found for the selected filters</p>
                  <Button variant="outline-primary" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </td>
            </tr>
          ) : (
            filteredData.map((user, index) => {
              const currentAttendance = user.userAttendanceDetails?.[0];
              const attendanceStatus = currentAttendance?.attendance || "Not Marked";
              const formData = attendanceFormData[user._id] || {};
              const isMarking = markingAttendance === user._id;
              const isDisabled = isMarking || loading;
              const canSubmit = canMarkAttendance(user, attendanceStatus, formData);
              
              const getRegionInfo = () => {
                if (user.role === 'CC') {
                  return user.schoolsData?.map(school => school.schoolName).join(', ') || 'N/A';
                } else if (user.role === 'ACI') {
                  const uniqueDistricts = [...new Set(user.schoolsData?.map(school => school.districtName))];
                  return uniqueDistricts.join(', ') || 'N/A';
                }
                return user.schoolsData?.map(s => s.schoolName).join(', ') || 'N/A';
              };
              
              return (
                <tr key={user._id} className="border-bottom">
                  <td className="fw-bold">{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                        <FaUserTag size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">{user.userId}</small>
                      </div>
                    </div>
                  </td>
                  <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
                  <td><small className="text-muted">{getRegionInfo()}</small></td>
                  <td>{getAttendanceBadge(attendanceStatus)}</td>
                  <td>
                    {currentAttendance?.loginTime ? (
                      <div>
                        <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
                        <br />
                        <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
                      </div>
                    ) : '-'}
                  </td>
                  <td style={{ minWidth: '280px' }}>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex gap-2">
                        <Form.Select 
                          size="sm" 
                          style={{ width: '140px' }}
                          value={formData.attendanceType || "Daily Attendance"}
                          onChange={(e) => updateAttendanceFormData(user._id, 'attendanceType', e.target.value)}
                          disabled={isDisabled}
                        >
                          {attendanceTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </Form.Select>
                        
                        <Form.Select 
                          size="sm"
                          style={{ width: '140px' }}
                          value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
                          onChange={(e) => handleAttendanceChange(user, e.target.value)}
                          disabled={isDisabled || !canSubmit}
                        >
                          <option value="">Select</option>
                          <option value="Present">✅ Present</option>
                          <option value="Absent">❌ Absent</option>
                          <option value="Half Day">⏳ Half Day</option>
                          <option value="WFH">🏠 WFH</option>
                          <option value="Comp-off">📅 Comp-off</option>
                          <option value="Monthly Leave">📆 Monthly Leave</option>
                          <option value="Sick Leave">🤒 Sick Leave</option>
                          <option value="LWP">⚠️ LWP</option>
                        </Form.Select>
                      </div>
                      
                      {formData.attendanceType === "Field Visit" && (
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Visiting location *"
                          value={formData.visitingLocation || ""}
                          onChange={(e) => updateAttendanceFormData(user._id, 'visitingLocation', e.target.value)}
                          disabled={isDisabled}
                          isInvalid={formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()}
                        />
                      )}
                      
                      {formData.attendanceType === "Manual Attendance" && (
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Remark *"
                          value={formData.remarkForManualAttendance || ""}
                          onChange={(e) => updateAttendanceFormData(user._id, 'remarkForManualAttendance', e.target.value)}
                          disabled={isDisabled}
                          isInvalid={formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()}
                        />
                      )}
                      
                      {isMarking && <Spinner size="sm" />}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  ), [filteredData, loading, resetFilters, attendanceFormData, markingAttendance, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge]);

  return (
    <Container fluid className="px-4 py-4 bg-light min-vh-100">
      {/* Success/Error Alerts */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
          {errorMessage}
        </Alert>
      )}

      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="display-6 fw-bold text-primary mb-2">
                📊 Attendance Dashboard
              </h1>
              <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={fetchAttendanceData}
                disabled={loading}
                className="d-flex align-items-center gap-2"
              >
                <FaSyncAlt /> Refresh
              </Button>
              <Button 
                variant="outline-info" 
                className="d-flex align-items-center gap-2"
              >
                <FaDownload /> Export
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters Row */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaCalendarAlt className="me-1" /> Date
          </Form.Label>
          <SingleDatePicker
            selectedDate={startDate}
            onDateChange={handleDateChange}
            placeholderText="Select date"
            className="w-100"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaUserTag className="me-1" /> Role
          </Form.Label>
          <Select
            isClearable
            options={roleOptions}
            value={filters.role}
            onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
            placeholder="Select role..."
            className="react-select"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaSchool className="me-1" /> Region (School/District)
          </Form.Label>
          <Select
            isClearable
            options={regionOptions}
            value={filters.region}
            onChange={(option) => setFilters(prev => ({ ...prev, region: option }))}
            placeholder="Select region..."
            className="react-select"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaClock className="me-1" /> Attendance Status
          </Form.Label>
          <Select
            isClearable
            options={attendanceStatusOptions}
            value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
            onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
            placeholder="Filter by status..."
            className="react-select"
          />
        </Col>
      </Row>

      {/* Reset Filters Button Row */}
      <Row className="mb-4">
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
            Clear All Filters
          </Button>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaUsers size={20} className="text-primary" />
              </div>
              <h4 className="mb-1 fw-bold">{totalUsers}</h4>
              <small className="text-muted">Total Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaCheckCircle size={20} className="text-success" />
              </div>
              <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
              <small className="text-muted">Present</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaTimesCircle size={20} className="text-danger" />
              </div>
              <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
              <small className="text-muted">Absent</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaClock size={20} className="text-info" />
              </div>
              <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
              <small className="text-muted">Attendance Rate</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* View Toggle */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="btn-group">
          <Button 
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('table')}
            className="d-flex align-items-center gap-2"
          >
            <FaTable /> Table View
          </Button>
          <Button 
            variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('card')}
            className="d-flex align-items-center gap-2"
          >
            <FaThLarge /> Card View
          </Button>
        </div>
        <small className="text-muted">
          Showing {filteredData.length} of {attendanceData.length} users
        </small>
      </div>

      {/* Main Content */}
      {viewMode === 'table' ? <TableView /> : <CardView />}
    </Container>
  );
};