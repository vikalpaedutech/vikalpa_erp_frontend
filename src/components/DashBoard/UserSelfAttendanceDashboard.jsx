import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { userSelfAttendanceDashboard } from "../../service/userAttendance.services";
import { Container, Row, Col, Card, Button, Table, Modal, Spinner, Alert, Badge, Nav, Breadcrumb } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Helper functions
const formatDate = (date, formatStr) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  if (formatStr === 'dd-MM-yyyy') return `${day}-${month}-${year}`;
  if (formatStr === 'dd-MM-yyyy HH:mm') return `${day}-${month}-${year} ${hours}:${minutes}`;
  if (formatStr === 'MMMM') {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[d.getMonth()];
  }
  return `${day}-${month}-${year}`;
};

const getMonthName = (month) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month - 1];
};

const getStatusBadgeVariant = (status) => {
  if (!status) return 'secondary';
  const s = status.toLowerCase();
  switch (s) {
    case 'present': return 'success';
    case 'absent': return 'danger';
    case 'leave': return 'warning';
    case 'half-day': return 'info';
    case 'wfh': return 'primary';
    default: return 'secondary';
  }
};

const getStatusDisplay = (status) => {
  if (!status) return '-';
  return status;
};

export const UserSelfAttendanceDashboard = () => {
  const { userData } = useContext(UserContext);
  
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentView, setCurrentView] = useState('calendar');
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    leave: 0,
    halfDay: 0,
    wfh: 0,
    percentage: 0
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const fetchAttendanceData = async () => {
    if (!userData?._id) return;

    setLoading(true);
    setError(null);

    try {
      const reqBody = {
        _id: userData._id,
        month: selectedMonth,
        year: selectedYear
      };

      const response = await userSelfAttendanceDashboard(reqBody);
      
      if (response?.data?.success) {
        const data = response.data.data;
        setDashboardData(data);
        
        const summary = data.attendanceSummary;
        setAttendanceStats({
          totalDays: summary.totalDays || 0,
          present: summary.presentDays || 0,
          absent: summary.absentDays || 0,
          leave: summary.leaveDays || 0,
          halfDay: summary.halfDays || 0,
          wfh: data.attendanceRecords?.filter(r => r.attendance?.toLowerCase() === 'wfh').length || 0,
          percentage: summary.attendancePercentage || 0
        });
      } else {
        setError(response?.data?.message || 'Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [userData?._id, selectedMonth, selectedYear]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleGoToToday = () => {
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null, record: null });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const record = dashboardData?.attendanceRecords?.find(r => {
        const recordDate = new Date(r.date);
        return recordDate.getDate() === day && 
               recordDate.getMonth() === selectedMonth - 1 && 
               recordDate.getFullYear() === selectedYear;
      });
      
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === selectedMonth - 1 && 
                      new Date().getFullYear() === selectedYear;
      
      days.push({ 
        day, 
        date,
        record,
        isToday,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (day, record) => {
    if (record) {
      setSelectedRecord(record);
      setShowDetailModal(true);
    }
  };

  const exportToExcel = () => {
    if (!dashboardData?.attendanceRecords?.length) {
      alert('No data to export');
      return;
    }

    const exportData = dashboardData.attendanceRecords.map((record, index) => ({
      'S.No': index + 1,
      'Date': record.date ? formatDate(record.date, 'dd-MM-yyyy') : '',
      'Status': record.attendance || '',
      'Login Time': record.loginTime ? formatDate(record.loginTime, 'dd-MM-yyyy HH:mm') : '',
      'Logout Time': record.logoutTime ? formatDate(record.logoutTime, 'dd-MM-yyyy HH:mm') : '',
      'Attendance Type': record.attendanceType || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${formatDate(new Date(), 'dd-MM-yyyy')}.xlsx`);
    setShowExportModal(false);
  };

  const exportToPDF = () => {
    if (!dashboardData?.attendanceRecords?.length) {
      alert('No data to export');
      return;
    }

    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('Attendance Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`User: ${dashboardData.userDetails.name}`, 20, 30);
    doc.text(`Department: ${dashboardData.userDetails.department}`, 20, 37);
    doc.text(`Role: ${dashboardData.userDetails.role}`, 20, 44);
    doc.text(`Month: ${getMonthName(selectedMonth)} ${selectedYear}`, 20, 51);
    doc.text(`Generated: ${formatDate(new Date(), 'dd-MM-yyyy HH:mm')}`, 20, 58);

    doc.setFontSize(11);
    doc.text(`Total Days: ${attendanceStats.totalDays}`, 200, 30);
    doc.text(`Present: ${attendanceStats.present}`, 200, 37);
    doc.text(`Absent: ${attendanceStats.absent}`, 200, 44);
    doc.text(`Attendance: ${attendanceStats.percentage}%`, 200, 51);

    const tableData = dashboardData.attendanceRecords.map((record, index) => [
      index + 1,
      record.date ? formatDate(record.date, 'dd-MM-yyyy') : '',
      record.attendance || '',
      record.loginTime ? formatDate(record.loginTime, 'dd-MM-yyyy HH:mm') : '-',
      record.logoutTime ? formatDate(record.logoutTime, 'dd-MM-yyyy HH:mm') : '-',
      record.attendanceType || '-'
    ]);

    doc.autoTable({
      startY: 65,
      head: [['S.No', 'Date', 'Status', 'Login Time', 'Logout Time', 'Attendance Type']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`Attendance_Report_${getMonthName(selectedMonth)}_${selectedYear}.pdf`);
    setShowExportModal(false);
  };

  if (loading && !dashboardData) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="p-2 p-sm-3" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card className="mb-2 mb-sm-3 shadow-sm">
        <Card.Body className="p-2 p-sm-3">
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <h5 className="mb-0" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                My Attendance Dashboard
              </h5>
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-start justify-content-md-end gap-2 mt-2 mt-md-0">
              <Button 
                variant="primary" 
                onClick={fetchAttendanceData}
                disabled={loading}
                size="sm"
                className="px-2 px-sm-3"
              >
                Refresh
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowExportModal(true)}
                disabled={!dashboardData?.attendanceRecords?.length}
                size="sm"
                className="px-2 px-sm-3"
              >
                Export
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Breadcrumb Navigation */}
      <Card className="mb-2 mb-sm-3 shadow-sm">
        <Card.Body className="p-2 p-sm-3">
          <Row className="align-items-center">
           
            <Col xs={12} md={8}>
              <div className="d-flex gap-1 gap-sm-2 justify-content-start justify-content-md-end mt-2 mt-md-0 flex-wrap">
                <Button 
                  variant={currentView === 'calendar' ? 'primary' : 'outline-secondary'} 
                  onClick={() => setCurrentView('calendar')}
                  size="sm"
                  className="px-2 px-sm-3"
                  style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)' }}
                >
                  Calendar
                </Button>
                <Button 
                  variant={currentView === 'list' ? 'primary' : 'outline-secondary'} 
                  onClick={() => setCurrentView('list')}
                  size="sm"
                  className="px-2 px-sm-3"
                  style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)' }}
                >
                  List View
                </Button>
                <Button 
                  variant={currentView === 'summary' ? 'primary' : 'outline-secondary'} 
                  onClick={() => setCurrentView('summary')}
                  size="sm"
                  className="px-2 px-sm-3"
                  style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)' }}
                >
                  Summary
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* User Info Card */}
      {dashboardData?.userDetails && (
        <Card className="mb-2 mb-sm-3 shadow-sm">
          <Card.Body className="p-2 p-sm-3">
            <Row className="align-items-center">
              <Col xs="auto">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: 'clamp(35px, 5vw, 50px)', height: 'clamp(35px, 5vw, 50px)', fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 'bold' }}>
                  {dashboardData.userDetails.name?.charAt(0).toUpperCase()}
                </div>
              </Col>
              <Col>
                <h6 className="mb-1" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)' }}>{dashboardData.userDetails.name}</h6>
                <div className="d-flex flex-wrap gap-1">
                  <Badge bg="info" className="me-1" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                    {dashboardData.userDetails.department}
                  </Badge>
                  <Badge bg="info" className="me-1" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                    {dashboardData.userDetails.role}
                  </Badge>
                  <Badge bg="light" text="dark" className="me-1" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                    {dashboardData.userDetails.mobile}
                  </Badge>
                
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Stats Cards */}
      {dashboardData && (
        <Row className="mb-2 mb-sm-3 g-1 g-sm-2">
          <Col xs={4} sm={4} md={2}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-1 p-sm-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Total</small>
                <h5 className="mb-0" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.5rem)' }}>{attendanceStats.totalDays}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} sm={4} md={2}>
            <Card className="h-100 shadow-sm border-success border-start border-4">
              <Card.Body className="text-center p-1 p-sm-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Present</small>
                <h5 className="mb-0 text-success" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.5rem)' }}>{attendanceStats.present}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} sm={4} md={2}>
            <Card className="h-100 shadow-sm border-danger border-start border-4">
              <Card.Body className="text-center p-1 p-sm-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Absent</small>
                <h5 className="mb-0 text-danger" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.5rem)' }}>{attendanceStats.absent}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} sm={4} md={2}>
            <Card className="h-100 shadow-sm border-warning border-start border-4">
              <Card.Body className="text-center p-1 p-sm-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Leave</small>
                <h5 className="mb-0 text-warning" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.5rem)' }}>{attendanceStats.leave}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} sm={4} md={2}>
            <Card className="h-100 shadow-sm border-primary border-start border-4">
              <Card.Body className="text-center p-1 p-sm-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>WFH</small>
                <h5 className="mb-0 text-primary" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.5rem)' }}>{attendanceStats.wfh}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} sm={4} md={2}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-1 p-sm-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>%</small>
                <h5 className={`mb-0 ${attendanceStats.percentage >= 75 ? 'text-success' : 'text-danger'}`} 
                    style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.5rem)' }}>
                  {attendanceStats.percentage}%
                </h5>
                <div className="progress mt-1" style={{ height: '3px' }}>
                  <div 
                    className={`progress-bar ${attendanceStats.percentage >= 75 ? 'bg-success' : 'bg-danger'}`}
                    style={{ width: `${Math.min(attendanceStats.percentage, 100)}%` }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Month Navigation */}
      <Card className="mb-2 mb-sm-3 shadow-sm">
        <Card.Body className="p-2 p-sm-3">
          <Row className="align-items-center">
            <Col xs={12} md={4}>
              <h6 className="mb-0" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)' }}>
                {getMonthName(selectedMonth)} {selectedYear}
              </h6>
            </Col>
            <Col xs={12} md={8}>
              <div className="d-flex gap-1 gap-sm-2 justify-content-start justify-content-md-end mt-2 mt-md-0 flex-wrap">
                <Button variant="outline-secondary" onClick={handlePrevMonth} size="sm" className="px-2 px-sm-3">
                  Prev
                </Button>
                <Button variant="primary" onClick={handleGoToToday} size="sm" className="px-2 px-sm-3">
                  Today
                </Button>
                <Button variant="outline-secondary" onClick={handleNextMonth} size="sm" className="px-2 px-sm-3">
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-2 mb-sm-3">
          {error}
        </Alert>
      )}

      {/* Calendar View */}
      {currentView === 'calendar' && (
        <Card className="shadow-sm">
          <Card.Body className="p-1 p-sm-3">
            <h6 className="mb-2 mb-sm-3" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>Attendance Calendar</h6>
            <div className="table-responsive">
              <table className="table table-bordered text-center mb-0" style={{ tableLayout: 'fixed', fontSize: 'clamp(0.5rem, 0.9vw, 0.8rem)' }}>
                <thead>
                  <tr>
                    {weekDays.map((day) => (
                      <th key={day} className="bg-light py-1 py-sm-2" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => {
                    const startIndex = weekIndex * 7;
                    const weekDaysData = calendarDays.slice(startIndex, startIndex + 7);
                    return (
                      <tr key={weekIndex}>
                        {weekDaysData.map((item, index) => {
                          if (!item.day) {
                            return <td key={`empty-${index}`} style={{ minHeight: 'clamp(40px, 8vw, 70px)' }} />;
                          }
                          
                          const isToday = item.isToday;
                          const isWeekend = item.isWeekend;
                          const status = item.record?.attendance;
                          const badgeVariant = getStatusBadgeVariant(status);
                          
                          return (
                            <td 
                              key={item.day}
                              style={{ 
                                minHeight: 'clamp(40px, 8vw, 70px)',
                                backgroundColor: isToday ? '#e3f2fd' : (isWeekend ? '#fafafa' : 'white'),
                                cursor: item.record ? 'pointer' : 'default',
                                verticalAlign: 'middle',
                                padding: 'clamp(2px, 0.5vw, 8px)'
                              }}
                              onClick={() => handleDateClick(item.day, item.record)}
                            >
                              <div className="fw-bold" style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)', color: isWeekend ? '#999' : 'inherit' }}>
                                {item.day}
                                {isToday && <span className="badge bg-primary rounded-pill ms-1" style={{ fontSize: 'clamp(4px, 0.5vw, 6px)', padding: '1px 3px' }}>●</span>}
                              </div>
                              {item.record && (
                                <Badge 
                                  bg={badgeVariant} 
                                  style={{ 
                                    fontSize: 'clamp(0.4rem, 0.7vw, 0.65rem)', 
                                    padding: 'clamp(1px, 0.3vw, 4px) clamp(2px, 0.5vw, 8px)',
                                    marginTop: 'clamp(1px, 0.3vw, 4px)',
                                    display: 'inline-block'
                                  }}
                                >
                                  {getStatusDisplay(status)}
                                </Badge>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Legend */}
            <div className="d-flex flex-wrap gap-1 gap-sm-2 justify-content-center mt-2 mt-sm-3">
              <Badge bg="success" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Present</Badge>
              <Badge bg="danger" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Absent</Badge>
              <Badge bg="warning" text="dark" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Leave</Badge>
              <Badge bg="info" text="dark" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Half Day</Badge>
              <Badge bg="primary" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>WFH</Badge>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* List View */}
      {currentView === 'list' && (
        <Card className="shadow-sm">
          <Card.Body className="p-1 p-sm-3">
            <h6 className="mb-2 mb-sm-3" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>Attendance Records</h6>
            {dashboardData?.attendanceRecords?.length > 0 ? (
              <div className="table-responsive">
                <Table striped bordered hover size="sm" className="mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>#</th>
                      <th style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Date</th>
                      <th style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Status</th>
                      <th style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Login</th>
                      <th style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Logout</th>
                      <th style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.attendanceRecords.map((record, index) => (
                      <tr key={record._id || index}>
                        <td style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>{index + 1}</td>
                        <td style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                          {record.date ? formatDate(record.date, 'dd-MM-yyyy') : '-'}
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(record.attendance)} style={{ fontSize: 'clamp(0.4rem, 0.7vw, 0.65rem)' }}>
                            {getStatusDisplay(record.attendance)}
                          </Badge>
                        </td>
                        <td style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                          {record.loginTime ? formatDate(record.loginTime, 'dd-MM-yyyy HH:mm') : '-'}
                        </td>
                        <td style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>
                          {record.logoutTime ? formatDate(record.logoutTime, 'dd-MM-yyyy HH:mm') : '-'}
                        </td>
                        <td style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)' }}>{record.attendanceType || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted py-4" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>
                No attendance records found
              </p>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Summary View */}
      {currentView === 'summary' && dashboardData && (
        <Card className="shadow-sm">
          <Card.Body className="p-2 p-sm-3">
            <h6 className="mb-2 mb-sm-3" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>Summary</h6>
            <Row>
              <Col md={6}>
                <h6 style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>User Information</h6>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Name:</strong> {dashboardData.userDetails.name}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Email:</strong> {dashboardData.userDetails.email}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Mobile:</strong> {dashboardData.userDetails.mobile}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Department:</strong> {dashboardData.userDetails.department}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Role:</strong> {dashboardData.userDetails.role}
                </div>
              </Col>
              <Col md={6}>
                <h6 style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>Attendance Summary</h6>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Month:</strong> {getMonthName(selectedMonth)} {selectedYear}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Total Days:</strong> {attendanceStats.totalDays}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Present:</strong> {attendanceStats.present}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Absent:</strong> {attendanceStats.absent}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Leave:</strong> {attendanceStats.leave}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Half Days:</strong> {attendanceStats.halfDay}
                </div>
                <div className="border-bottom py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>WFH:</strong> {attendanceStats.wfh}
                </div>
                <div className="py-1 py-sm-2" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>
                  <strong>Attendance %:</strong> {attendanceStats.percentage}%
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>
              <h6>{formatDate(selectedRecord.date, 'dd-MM-yyyy')}</h6>
              <div className="border-bottom py-2">
                <strong>Status:</strong>{' '}
                <Badge bg={getStatusBadgeVariant(selectedRecord.attendance)}>
                  {getStatusDisplay(selectedRecord.attendance)}
                </Badge>
              </div>
              <div className="border-bottom py-2">
                <strong>Login Time:</strong> {selectedRecord.loginTime ? formatDate(selectedRecord.loginTime, 'dd-MM-yyyy HH:mm') : '-'}
              </div>
              
              <div className="border-bottom py-2">
                <strong>Attendance Type:</strong> {selectedRecord.attendanceType || '-'}
              </div>
              {selectedRecord.fileUrl && (
                <div className="py-2">
                  <strong>File:</strong>{' '}
                  <a href={selectedRecord.fileUrl} target="_blank" rel="noopener noreferrer">
                    View Attachment
                  </a>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)} size="sm">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Export Modal */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>Export Attendance Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>
            Choose your preferred export format:
          </p>
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={exportToExcel} size="sm">
              Export as Excel (.xlsx)
            </Button>
            <Button variant="secondary" onClick={exportToPDF} size="sm">
              Export as PDF (.pdf)
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)} size="sm">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};