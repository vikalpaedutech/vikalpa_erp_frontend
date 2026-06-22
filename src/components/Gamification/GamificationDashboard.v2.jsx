import React, { useEffect, useState, useContext } from "react";
import { gamificationDashboardV2 } from "../../service/Gamification/ClaimGamification.services";
import { UserContext } from "../contextAPIs/User.context";
import { Container, Card, Table, Form, Badge, Spinner, Alert } from "react-bootstrap";
import { FaSync, FaSearch, FaUsers } from "react-icons/fa";

export const GamificationDashboardV2 = () => {
  const { userData } = useContext(UserContext);
  
  // State Management
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");

  // Months array for dropdown
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];

  // Years array for dropdown (last 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const reqBody = {
        month: selectedMonth,
        year: selectedYear
      };

      const response = await gamificationDashboardV2(reqBody);
      console.log("Dashboard Response:", response);

      if (response.status === "Success") {
        setDashboardData(response.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message || "An error occurred while fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when month/year changes
  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  // Filter users based on search
  const filteredUsers = dashboardData?.users?.filter(user =>
    user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort users by points (descending) and add rank
  const sortedUsers = [...filteredUsers].sort((a, b) => 
    b.gamificationSummary.totalPoints - a.gamificationSummary.totalPoints
  ).map((user, index) => ({
    ...user,
    rank: index + 1
  }));

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get rank badge color - SAME FOR ALL
  const getRankBadge = (rank) => {
    return "light"; // Same color for all
  };

  // Get points color
  const getPointsColor = (points) => {
    if (points >= 50) return "success";
    if (points >= 20) return "primary";
    if (points >= 0) return "secondary";
    return "danger";
  };

  // Loading State
  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading Dashboard...</p>
        </div>
      </Container>
    );
  }

  // Error State
  if (error) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center" style={{ maxWidth: '500px' }}>
          <Alert variant="danger" className="p-4">
            <Alert.Heading>⚠️ Error Loading Dashboard</Alert.Heading>
            <p>{error}</p>
            <button 
              className="btn btn-primary" 
              onClick={fetchDashboardData}
            >
              <FaSync className="me-2" /> Retry
            </button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header with Filters */}
      <Card className="bg-primary text-white border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h4 className="mb-1 fw-bold">🎯 Gamification Dashboard</h4>
            </div>
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-white/10 text-white border-white/30 w-auto"
                style={{ minWidth: '120px' }}
              >
                {months.map(month => (
                  <option key={month.value} value={month.value} className="text-dark">
                    {month.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-white/10 text-white border-white/30 w-auto"
                style={{ minWidth: '100px' }}
              >
                {years.map(year => (
                  <option key={year} value={year} className="text-dark">
                    {year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Search and Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div style={{ minWidth: '250px', flex: 1 }}>
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <Form.Control
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-5"
                  />
                </div>
              </div>
              <small className="text-muted">
                {dashboardData?.dateRange && (
                  <>
                    {formatDate(dashboardData.dateRange.startDate)} - {formatDate(dashboardData.dateRange.endDate)}
                  </>
                )}
              </small>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center" style={{ width: '60px' }}>#</th>
                  <th>Username</th>
                  <th>District</th>
                  <th>School</th>
                  <th className="text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <tr key={user.user._id}>
                      <td className="text-center align-middle">
                        <Badge bg={getRankBadge(user.rank)} className="fs-6 px-3 py-2 text-dark">
                          #{user.rank}
                        </Badge>
                      </td>
                      <td className="align-middle">
                        <div className="fw-semibold">{user.user.name}</div>
                      </td>
                      <td className="align-middle">
                        <div>
                          {user.schoolDetails?.length > 0 ? (
                            <>
                              <div className="fw-semibold">
                                {user.schoolDetails[0]?.districtName || 'N/A'}
                              </div>
                              <small className="text-muted">
                                {user.schoolDetails[0]?.blockName || ''}
                              </small>
                            </>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div>
                          {user.schoolDetails?.length > 0 ? (
                            <>
                              <div className="fw-semibold">
                                {user.schoolDetails[0]?.schoolName || 'N/A'}
                              </div>
                              <small className="text-muted">
                                {user.schoolDetails.length > 1 && (
                                  <span className="text-primary">+{user.schoolDetails.length - 1} more</span>
                                )}
                              </small>
                            </>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <Badge 
                          bg={getPointsColor(user.gamificationSummary.totalPoints)} 
                          className="fs-6 px-3 py-2"
                        >
                          {user.gamificationSummary.totalPoints}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="text-muted">
                        <FaUsers size={40} className="mb-3 text-muted" />
                        <p className="mb-0">No users found</p>
                        <small>Try adjusting your search or filters</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="p-3 border-top bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                Showing {sortedUsers.length} of {dashboardData?.users?.length || 0} users
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};