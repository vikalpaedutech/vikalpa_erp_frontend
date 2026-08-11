// import react from "react"
// import { updateMonthlyRankings } from "../../service/Gamification/Gamification.services"
// import { GamificationRankDashboardGeneral } from "../../service/Gamification/Gamification.services"

// export const InititaeGamificationRank = () =>{

//     try {
        
//     } catch (error) {
        
//     }
    


//     return(

//         <>
//         hello world
//         </>
//     )
// }







import React, { useState, useEffect } from "react";
import { Button, Table, Spinner, Alert, Container, Row, Col, Badge } from "react-bootstrap";
import { 
  updateMonthlyRankings, 
  GamificationRankDashboardGeneral 
} from "../../service/Gamification/Gamification.services";

export const InititaeGamificationRank = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rankData, setRankData] = useState(null);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);

  // Handle Initiate Ranking
  const handleInitiateRanking = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    setError(null);
    
    try {
      const response = await updateMonthlyRankings({});
      if (response.success) {
        setUpdateMessage({
          type: 'success',
          text: `✅ Rankings updated successfully! ${response.data.totalUsersUpdated} users updated.`
        });
        // After successful update, fetch the ranking data
        await fetchRankingData();
      } else {
        setUpdateMessage({
          type: 'danger',
          text: `❌ Failed to update rankings: ${response.message}`
        });
      }
    } catch (error) {
      setUpdateMessage({
        type: 'danger',
        text: `❌ Error: ${error.message || 'Something went wrong'}`
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch Ranking Data
  const fetchRankingData = async () => {
   
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await GamificationRankDashboardGeneral({});
      console.log(response.data)
      if (response.success) {
        setRankData(response.data);
      } else {
        setError(response.message || 'Failed to fetch ranking data');
      }
    } catch (error) {
      setError(error.message || 'Something went wrong while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRankingData();
  }, []);

  // Get rank badge color
  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'warning';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'danger';
    return 'primary';
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-primary">Gamification Rankings Dashboard</h2>
          <p className="text-muted">Manage and view monthly rankings for all users</p>
        </Col>
      </Row>

      {/* Control Panel */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap align-items-center gap-3 p-3 bg-light rounded shadow-sm">
            <Button
              variant="primary"
              onClick={handleInitiateRanking}
              disabled={isUpdating}
              className="d-flex align-items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-repeat"></i>
                  Initiate User Ranking
                </>
              )}
            </Button>

            {rankData && (
              <div className="d-flex gap-3 ms-auto">
                <Badge bg="info" className="px-3 py-2">
                  📅 {rankData.startDate} - {rankData.endDate}
                </Badge>
                <Badge bg="success" className="px-3 py-2">
                  👥 {rankData.totalUsers} Users
                </Badge>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Update Message */}
      {updateMessage && (
        <Row className="mb-3">
          <Col>
            <Alert variant={updateMessage.type}>
              {updateMessage.text}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Error Message */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">❌ {error}</Alert>
          </Col>
        </Row>
      )}

      {/* Table */}
      <Row>
        <Col>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading rankings...</p>
            </div>
          ) : rankData && rankData.rankings && rankData.rankings.length > 0 ? (
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <Table striped hover responsive className="mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3 text-center">Rank</th>
                    <th className="px-4 py-3 text-center">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rankData.rankings.map((user, index) => (
                    <tr key={user.unqUserObjectId || index}>
                      <td className="px-4 py-3 fw-semibold">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                          >
                            {/* {user.name?.charAt(0).toUpperCase() || 'U'} */}
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name || 'N/A'}</div>
                            <small className="text-muted">{user.role || 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{user.regionDetails?.district || '-'}</td>
                      <td className="px-4 py-3">{user.regionDetails?.school || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge bg={getRankBadgeColor(user.rank)} pill className="px-3 py-2">
                          #{user.rank || 0}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center fw-bold">
                        {user.totalPoint || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center p-3 bg-light border-top">
                <small className="text-muted">
                  Showing {rankData.rankings.length} of {rankData.totalUsers} users
                </small>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={fetchRankingData}
                  className="d-flex align-items-center gap-1"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <div className="mb-3">
                <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
              </div>
              <h5 className="text-muted">No Rankings Found</h5>
              <p className="text-muted">Click "Initiate User Ranking" to generate rankings</p>
              <Button
                variant="primary"
                onClick={handleInitiateRanking}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Generate Rankings'}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};