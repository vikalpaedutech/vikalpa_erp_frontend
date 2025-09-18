// /src/components/user/UserProfile.jsx

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table } from "react-bootstrap";
import Select from "react-select";
import { GetAttendanceDataOfUsersByMonthAndYear } from "../../service/userAttendance.services";

export const UserProfile = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const [individualAttendanceData, setIndividualAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Generate default month and year
  const currentMonthIndex = new Date().getMonth(); // 0-based
  const currentYear = new Date().getFullYear();

  // Month and Year options
  const monthOptions = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  const yearOptions = [
    { value: 2025, label: "2025" },
    { value: 2026, label: "2026" },
    { value: 2027, label: "2027" },
  ];

  // State for selected month/year
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[currentMonthIndex]);
  const [selectedYear, setSelectedYear] = useState(yearOptions.find(y => y.value === currentYear));

  // Fetch data on load or on filter change
  const fetchThisUserAttendanceData = async (month, year) => {
    const queryParams = {
      userId: userData?.userId || "NA",
    };

    const payLoad = {
      month,
      year,
    };

    try {
      const response = await GetAttendanceDataOfUsersByMonthAndYear(queryParams, payLoad);
      setIndividualAttendanceData(response.data.data || []);
      console.log(response.data.data)
      setCurrentPage(1); // Reset pagination on filter
    } catch (error) {
      alert("Error fetching attendance data!");
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchThisUserAttendanceData(selectedMonth.value, selectedYear.value);
    }
  }, [selectedMonth, selectedYear]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = individualAttendanceData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(individualAttendanceData.length / rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container my-4">
      {/* <h2>{userData?.[0]?.name}'s Attendance</h2> */}

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="text-center mb-3">Monthly Attendance</Card.Title>

          {/* Month-Year Select Dropdowns */}
          <div className="d-flex gap-3 justify-content-center mb-4 flex-wrap">
            <div style={{ minWidth: "150px" }}>
              <Select
                options={monthOptions}
                value={selectedMonth}
                onChange={setSelectedMonth}
                placeholder="Select Month"
              />
            </div>
            <div style={{ minWidth: "150px" }}>
              <Select
                options={yearOptions}
                value={selectedYear}
                onChange={setSelectedYear}
                placeholder="Select Year"
              />
            </div>
          </div>

          {/* Attendance Table */}
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Login Time</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((item, idx) => (
                    <tr key={item._id || idx}>
                      <td>{new Date(item.date).toLocaleDateString("en-IN")}</td>
                      <td>{item.attendance}</td>
                      <td>
                        {item.loginTime
                          ? new Date(item.loginTime).toLocaleTimeString("en-IN")
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No attendance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              ◀ Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next ▶
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
