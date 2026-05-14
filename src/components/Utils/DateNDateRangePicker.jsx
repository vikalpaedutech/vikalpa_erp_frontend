import React, { useState, useEffect, useContext } from "react";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { Container, Card, Row, Col, Badge, Button, Form } from "react-bootstrap";

export const DateNDateRangePicker = () => {
  const { 
    startDate, 
    setStartDate,
    endDate, 
    setEndDate,
    dateRange,
    setDateRange
  } = useContext(DateNDateRangeContext);

  const [tempStartDate, setTempStartDate] = useState(startDate || "");
  const [tempEndDate, setTempEndDate] = useState(endDate || "");

  // Format dates into multiple formats
  const formatDates = (start, end) => {
    if (!start || !end) return null;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    // Helper function to format date in different ways
    const formatDateObject = (dateObj) => {
      if (!dateObj) return null;
      
      // Format functions
      const formatDDMMYYYY = () => {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formatYYYYMMDD = () => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatDDMMYYYYSlash = () => {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const formatMMDDYYYY = () => {
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${month}/${day}/${year}`;
      };

      // IST format
      const formatIST = () => {
        return dateObj.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
      };
      
      return {
        ISOformat: dateObj.toISOString(),
        IST: formatIST(),
        DDMMYYYY: formatDDMMYYYY(),
        YYYYMMDD: formatYYYYMMDD(),
        DDMMYYYYSlash: formatDDMMYYYYSlash(),
        MMDDYYYY: formatMMDDYYYY(),
        timestamp: dateObj.getTime(),
        day: dateObj.getDate(),
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        queryFormat: formatYYYYMMDD(),
      };
    };

    return {
      startDate: formatDateObject(startDateObj),
      endDate: formatDateObject(endDateObj),
      rangeString: `${formatDateObject(startDateObj).DDMMYYYY} to ${formatDateObject(endDateObj).DDMMYYYY}`,
      rangeStringISO: `${formatDateObject(startDateObj).ISOformat} to ${formatDateObject(endDateObj).ISOformat}`,
      durationDays: Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1,
    };
  };

  // Auto-save to context when both dates are selected
  useEffect(() => {
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      
      if (start <= end) {
        const formattedDates = formatDates(tempStartDate, tempEndDate);
        setDateRange(formattedDates);
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        console.log("Date Range Auto-Saved:", formattedDates);
      }
    } else if (!tempStartDate || !tempEndDate) {
      // Clear if any date is missing
      setDateRange(null);
      if (!tempStartDate) setStartDate(null);
      if (!tempEndDate) setEndDate(null);
    }
  }, [tempStartDate, tempEndDate]);

  // Handle start date change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setTempStartDate(newStartDate);
    
    // If end date is less than new start date, clear end date
    if (tempEndDate && newStartDate > tempEndDate) {
      setTempEndDate("");
      setEndDate(null);
      setDateRange(null);
    }
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setTempEndDate(newEndDate);
  };

  // Reset date range
  const resetDateRange = () => {
    setTempStartDate("");
    setTempEndDate("");
    setStartDate(null);
    setEndDate(null);
    setDateRange(null);
    console.log("Date Range Reset");
  };

  // Predefined date ranges
  const setLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    
    const endStr = end.toISOString().split('T')[0];
    const startStr = start.toISOString().split('T')[0];
    
    setTempStartDate(startStr);
    setTempEndDate(endStr);
  };

  const setLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    
    const endStr = end.toISOString().split('T')[0];
    const startStr = start.toISOString().split('T')[0];
    
    setTempStartDate(startStr);
    setTempEndDate(endStr);
  };

  const setCurrentMonth = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    
    const endStr = end.toISOString().split('T')[0];
    const startStr = start.toISOString().split('T')[0];
    
    setTempStartDate(startStr);
    setTempEndDate(endStr);
  };

  const setPreviousMonth = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
    const prevMonthEnd = new Date(end.getFullYear(), end.getMonth(), 0);
    
    const startStr = start.toISOString().split('T')[0];
    const endStr = prevMonthEnd.toISOString().split('T')[0];
    
    setTempStartDate(startStr);
    setTempEndDate(endStr);
  };

  const setToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setTempStartDate(todayStr);
    setTempEndDate(todayStr);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    setTempStartDate(yesterdayStr);
    setTempEndDate(yesterdayStr);
  };

  return (
    <Container className="mt-4 mb-4" fluid>
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-3 mb-4">
            <Col xs={12} md={6}>
              <label className="fw-bold mb-2">
                Start Date <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="date"
                value={tempStartDate}
                onChange={handleStartDateChange}
                max={tempEndDate || new Date().toISOString().split('T')[0]}
              />
            </Col>
            
            <Col xs={12} md={6}>
              <label className="fw-bold mb-2">
                End Date <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="date"
                value={tempEndDate}
                onChange={handleEndDateChange}
                min={tempStartDate}
                max={new Date().toISOString().split('T')[0]}
                disabled={!tempStartDate}
              />
            </Col>
          </Row>

          {/* Predefined Date Ranges */}
          <Row className="mb-4">
            <Col xs={12}>
              <label className="fw-bold mb-2">Quick Select</label>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="outline-primary" size="sm" onClick={setToday}>
                  Today
                </Button>
                <Button variant="outline-primary" size="sm" onClick={setYesterday}>
                  Yesterday
                </Button>
                <Button variant="outline-primary" size="sm" onClick={setLast7Days}>
                  Last 7 Days
                </Button>
                <Button variant="outline-primary" size="sm" onClick={setLast30Days}>
                  Last 30 Days
                </Button>
                <Button variant="outline-primary" size="sm" onClick={setCurrentMonth}>
                  Current Month
                </Button>
                <Button variant="outline-primary" size="sm" onClick={setPreviousMonth}>
                  Previous Month
                </Button>
              </div>
            </Col>
          </Row>

          {/* Reset Button */}
          {(tempStartDate || tempEndDate) && (
            <Row className="mb-4">
              <Col md={12}>
                <Button 
                  variant="danger" 
                  className="w-100"
                  onClick={resetDateRange}
                >
                  Clear All
                </Button>
              </Col>
            </Row>
          )}

          
        </Card.Body>
      </Card>
    </Container>
  );
};












export const SingleDatePicker = () => {
  const { 
    startDate, 
    setStartDate
  } = useContext(DateNDateRangeContext);

  const [tempStartDate, setTempStartDate] = useState(startDate || "");

  // Format date into multiple formats
  const formatSingleDate = (date) => {
    if (!date) return null;

    const dateObj = new Date(date);

    // Format functions
    const formatDDMMYYYY = () => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formatYYYYMMDD = () => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatDDMMYYYYSlash = () => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatMMDDYYYY = () => {
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${month}/${day}/${year}`;
    };

    // IST format
    const formatIST = () => {
      return dateObj.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    };
    
    return {
      ISOformat: dateObj.toISOString(),
      IST: formatIST(),
      DDMMYYYY: formatDDMMYYYY(),
      YYYYMMDD: formatYYYYMMDD(),
      DDMMYYYYSlash: formatDDMMYYYYSlash(),
      MMDDYYYY: formatMMDDYYYY(),
      timestamp: dateObj.getTime(),
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
      queryFormat: formatYYYYMMDD(),
    };
  };

  // Auto-save to context when date is selected
  useEffect(() => {
    if (tempStartDate) {
      const formattedDate = formatSingleDate(tempStartDate);
      setStartDate(tempStartDate);
      console.log("Single Date Auto-Saved:", formattedDate);
    } else {
      setStartDate(null);
    }
  }, [tempStartDate]);

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setTempStartDate(newDate);
  };

  // Reset date
  const resetDate = () => {
    setTempStartDate("");
    setStartDate(null);
    console.log("Single Date Reset");
  };

  // Predefined dates
  const setToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setTempStartDate(todayStr);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    setTempStartDate(yesterdayStr);
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setTempStartDate(tomorrowStr);
  };

  const setLast7Days = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const dateStr = date.toISOString().split('T')[0];
    setTempStartDate(dateStr);
  };

  const setLast30Days = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const dateStr = date.toISOString().split('T')[0];
    setTempStartDate(dateStr);
  };

  return (
    <Container className="mt-4 mb-4" fluid>
      <Card className="shadow-sm">
        <Card.Body>
          
          <Row className="g-3 mb-4">
            <Col xs={12}>
              <label className="fw-bold mb-2">
                Select Date <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="date"
                value={tempStartDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </Col>
          </Row>

          

          {/* Reset Button */}
          {tempStartDate && (
            <Row className="mb-4">
              <Col md={12}>
                <Button 
                  variant="danger" 
                  className="w-100"
                  onClick={resetDate}
                >
                  Clear Date
                </Button>
              </Col>
            </Row>
          )}


         
        </Card.Body>
      </Card>
    </Container>
  );
};