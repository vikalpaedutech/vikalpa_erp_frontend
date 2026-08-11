// import React, {useEffect, useState, useContext} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { GamificationDashboard } from "../Gamification/GamificationDashboard";

// export const GamificatonRankBulletin = () => {

//     const {userData} = useContext(UserContext)


//     console.log(userData)

//     try {
        
//     } catch (error) {
        
//     }

//     return(

//         <>
//         gamification rank bulletin
//         </>
//     )
// }





// import React, { useEffect, useState, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { Card, Row, Col, Badge, Form, Button, Spinner, Container } from "react-bootstrap";
// import { GamificationRankDashboard } from "../../service/Gamification/Gamification.services";
// export const GamificatonRankBulletin = () => {
//   const { userData } = useContext(UserContext);
//   const [loading, setLoading] = useState(false);
//   const [rankData, setRankData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [error, setError] = useState(null);

//   // Fetch rank data
//   const fetchRankData = async (date = null) => {
//     if (!userData?._id) {
//       setError("User data not found");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const requestBody = {
//         unqUserObjectId: userData._id
//       };

//       // Add date if selected
//       if (date) {
//         requestBody.gamificationDate = date;
//       }

//       const response = await GamificationRankDashboard(requestBody);
      
//       if (response.success) {
//         setRankData(response.data);
//       } else {
//         setError(response.message || "Failed to fetch rank data");
//       }
//     } catch (error) {
//       setError(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data on component mount or user change
//   useEffect(() => {
//     if (userData?._id) {
//       fetchRankData();
//     }
//   }, [userData]);

//   // Handle date filter change
//   const handleDateChange = (e) => {
//     const date = e.target.value;
//     setSelectedDate(date);
//     if (date) {
//       fetchRankData(date);
//     } else {
//       fetchRankData();
//     }
//   };

//   // Handle refresh
//   const handleRefresh = () => {
//     if (selectedDate) {
//       fetchRankData(selectedDate);
//     } else {
//       fetchRankData();
//     }
//   };

//   // Get rank badge color
//   const getRankBadgeColor = (rank) => {
//     if (rank === 0) return "secondary";
//     if (rank <= 3) return "warning";
//     if (rank <= 10) return "info";
//     if (rank <= 50) return "primary";
//     return "secondary";
//   };

//   // Get rank emoji
//   const getRankEmoji = (rank) => {
//     if (rank === 1) return "🥇";
//     if (rank === 2) return "🥈";
//     if (rank === 3) return "🥉";
//     if (rank === 0) return "📊";
//     return `#${rank}`;
//   };

//   return (
//     <Container fluid className="p-3">
//       <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
//         {/* Header */}
//         <Card.Header className="bg-gradient-primary text-white p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//           <Row className="align-items-center">
//             <Col>
//               <h4 className="mb-0 fw-bold">
//                 <i className="bi bi-trophy-fill me-2"></i>
//                 My Gamification Rank
//               </h4>
//             </Col>
//             <Col xs="auto">
//               <Badge bg="light" text="dark" className="px-3 py-2">
//                 <i className="bi bi-calendar3 me-1"></i>
//                 {rankData?.gamificationDetail?.startDate || "Loading..."} to {rankData?.gamificationDetail?.endDate || "Loading..."}
//               </Badge>
//             </Col>
//           </Row>
//         </Card.Header>

//         <Card.Body className="p-4">
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-2 text-muted">Loading your ranking...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-4">
//               <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '40px' }}></i>
//               <p className="text-danger mt-2">{error}</p>
//               <Button variant="outline-primary" size="sm" onClick={handleRefresh}>
//                 <i className="bi bi-arrow-repeat me-1"></i>
//                 Retry
//               </Button>
//             </div>
//           ) : rankData ? (
//             <>
//               {/* Main Stats */}
//               <Row className="g-4">
//                 {/* Rank Display */}
//                 <Col md={6} lg={4}>
//                   <Card className="h-100 border-0 bg-light rounded-3">
//                     <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
//                       <div className="mb-2">
//                         <Badge 
//                           bg={getRankBadgeColor(rankData.gamificationDetail?.rank)} 
//                           className="px-4 py-2 fs-5 rounded-pill"
//                         >
//                           {getRankEmoji(rankData.gamificationDetail?.rank)}
//                         </Badge>
//                       </div>
//                       <h6 className="text-muted mb-1">Your Current Rank</h6>
//                       <h2 className="display-4 fw-bold mb-0">
//                         {rankData.gamificationDetail?.rank || 0}
//                       </h2>
//                       <small className="text-muted mt-1">
//                         out of {rankData.gamificationDetail?.rank ? 'All Users' : 'N/A'}
//                       </small>
//                     </Card.Body>
//                   </Card>
//                 </Col>

//                 {/* Total Points */}
//                 <Col md={6} lg={4}>
//                   <Card className="h-100 border-0 bg-light rounded-3">
//                     <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
//                       <div className="mb-2">
//                         <i className="bi bi-star-fill text-warning" style={{ fontSize: '32px' }}></i>
//                       </div>
//                       <h6 className="text-muted mb-1">Total Points</h6>
//                       <h2 className="display-4 fw-bold mb-0">
//                         {rankData.gamificationDetail?.totalPoint || 0}
//                       </h2>
//                       <small className="text-muted mt-1">
//                         Monthly Cumulative
//                       </small>
//                     </Card.Body>
//                   </Card>
//                 </Col>

//                 {/* Daily Points */}
//                 <Col md={6} lg={4}>
//                   <Card className="h-100 border-0 bg-light rounded-3">
//                     <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
//                       <div className="mb-2">
//                         <i className="bi bi-calendar-check-fill text-success" style={{ fontSize: '32px' }}></i>
//                       </div>
//                       <h6 className="text-muted mb-1">Today's Points</h6>
//                       <h2 className="display-4 fw-bold mb-0">
//                         {rankData.gamificationDetail?.targetDatePoints || 0}
//                       </h2>
//                       <small className="text-muted mt-1">
//                         {rankData.gamificationDetail?.targetDate || "Today"}
//                       </small>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* Points Classification */}
//               <Card className="mt-4 border-0 bg-light rounded-3">
//                 <Card.Header className="bg-transparent border-0 pt-3">
//                   <h6 className="fw-bold mb-0">
//                     <i className="bi bi-pie-chart-fill me-2"></i>
//                     Points Breakdown
//                   </h6>
//                 </Card.Header>
//                 <Card.Body className="pt-0">
//                   <Row className="g-2">
//                     {rankData.gamificationDetail?.pointsClassification && 
//                       Object.entries(rankData.gamificationDetail.pointsClassification).map(([key, value]) => (
//                         <Col xs={6} md={4} lg={2} key={key}>
//                           <div className="p-2 bg-white rounded-3 text-center shadow-sm">
//                             <div className="text-muted small text-uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
//                             <div className="fw-bold fs-5">{value}</div>
//                           </div>
//                         </Col>
//                       ))
//                     }
//                   </Row>
//                 </Card.Body>
//               </Card>

//               {/* Date Filter */}
//               <Row className="mt-4">
//                 <Col>
//                   <Card className="border-0 bg-light rounded-3">
//                     <Card.Body>
//                       <Row className="align-items-center g-3">
//                         <Col md={6}>
//                           <Form.Group>
//                             <Form.Label className="fw-semibold mb-1">
//                               <i className="bi bi-filter me-1"></i>
//                               Filter by Date
//                             </Form.Label>
//                             <Form.Control
//                               type="date"
//                               value={selectedDate}
//                               onChange={handleDateChange}
//                               className="rounded-3"
//                               max={new Date().toISOString().split('T')[0]}
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={6} className="d-flex gap-2">
//                           <Button 
//                             variant="outline-secondary" 
//                             onClick={() => {
//                               setSelectedDate("");
//                               fetchRankData();
//                             }}
//                             className="rounded-3 flex-grow-1"
//                           >
//                             <i className="bi bi-arrow-counterclockwise me-1"></i>
//                             Reset
//                           </Button>
//                           <Button 
//                             variant="outline-primary" 
//                             onClick={handleRefresh}
//                             className="rounded-3 flex-grow-1"
//                           >
//                             <i className="bi bi-arrow-repeat me-1"></i>
//                             Refresh
//                           </Button>
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* Date indicator */}
//               {selectedDate && (
//                 <div className="mt-3 text-center">
//                   <Badge bg="info" className="px-3 py-2">
//                     <i className="bi bi-calendar-range me-1"></i>
//                     Showing data for: {new Date(selectedDate).toLocaleDateString('en-IN', { 
//                       day: '2-digit', 
//                       month: 'short', 
//                       year: 'numeric' 
//                     })}
//                   </Badge>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-5">
//               <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
//               <p className="text-muted mt-2">No rank data available</p>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       <style jsx>{`
//         .bg-gradient-primary {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         }
//       `}</style>
//     </Container>
//   );
// };
















import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { Card, Row, Col, Badge, Form, Button, Spinner, Container } from "react-bootstrap";
import { GamificationRankDashboard } from "../../service/Gamification/Gamification.services";

export const GamificatonRankBulletin = () => {
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [rankData, setRankData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(null);

  // Fetch rank data
  const fetchRankData = async (date = null) => {
    if (!userData?._id) {
      setError("User data not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        unqUserObjectId: userData._id
      };

      if (date) {
        requestBody.gamificationDate = date;
      }

      const response = await GamificationRankDashboard(requestBody);
      
      if (response.success) {
        setRankData(response.data);
      } else {
        setError(response.message || "Failed to fetch rank data");
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchRankData();
    }
  }, [userData]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      fetchRankData(date);
    } else {
      fetchRankData();
    }
  };

  const handleRefresh = () => {
    if (selectedDate) {
      fetchRankData(selectedDate);
    } else {
      fetchRankData();
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 0) return "secondary";
    if (rank <= 3) return "warning";
    if (rank <= 10) return "info";
    if (rank <= 50) return "primary";
    return "secondary";
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    if (rank === 0) return "📊";
    return `#${rank}`;
  };

  const getDisplayPoints = () => {
    return rankData?.gamificationDetail?.targetDatePoints || 0;
  };

  const getDisplayPointsClassification = () => {
    return rankData?.gamificationDetail?.targetDatePointsClassification || {
      selfAttendance: 0,
      studentAttendance: 0,
      uploadPdf: 0,
      callingAbsentee: 0,
      marks: 0,
      disciplinary: 0
    };
  };

  const displayDate = selectedDate || rankData?.gamificationDetail?.targetDate || new Date().toISOString().split('T')[0];

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Container fluid className="p-2 p-sm-3">
      <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
        {/* Header - Mobile Optimized */}
        <Card.Header className="bg-gradient-primary text-white p-3 p-sm-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 className="mb-0 fw-bold fs-6 fs-sm-5">
              <i className="bi bi-trophy-fill me-1 me-sm-2"></i>
              My Rank (This is currently in the trial phase.)
            </h5>
            <small className="bg-light text-dark px-2 px-sm-3 py-1 rounded-pill fs-7">
              <i className="bi bi-calendar3 me-1"></i>
              {rankData?.gamificationDetail?.startDate || "Loading..."} - {rankData?.gamificationDetail?.endDate || "Loading..."}
            </small>
          </div>
        </Card.Header>

        <Card.Body className="p-3 p-sm-4">
          {loading ? (
            <div className="text-center py-4 py-sm-5">
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="mt-2 text-muted small">Loading your ranking...</p>
            </div>
          ) : error ? (
            <div className="text-center py-3 py-sm-4">
              <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '28px' }}></i>
              <p className="text-danger small mt-2">{error}</p>
              <Button variant="outline-primary" size="sm" onClick={handleRefresh}>
                <i className="bi bi-arrow-repeat me-1"></i>
                Retry
              </Button>
            </div>
          ) : rankData ? (
            <>
              {/* Main Stats - Mobile Optimized */}
              <Row className="g-2 g-sm-3">
                {/* Rank Display */}
                <Col xs={4}>
                  <Card className="h-100 border-0 bg-light rounded-2">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-2 p-sm-3">
                      <Badge 
                        bg={getRankBadgeColor(rankData.gamificationDetail?.rank)} 
                        className="px-2 px-sm-3 py-1 py-sm-2 fs-6 fs-sm-5 rounded-pill"
                      >
                        {getRankEmoji(rankData.gamificationDetail?.rank)}
                      </Badge>
                      <h6 className="text-muted mb-0 small fs-7 mt-1">Rank</h6>
                      <h3 className="fw-bold mb-0 fs-2 fs-sm-1">
                        {rankData.gamificationDetail?.rank || 0}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Total Points */}
                <Col xs={4}>
                  <Card className="h-100 border-0 bg-light rounded-2">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-2 p-sm-3">
                      <i className="bi bi-star-fill text-warning" style={{ fontSize: '20px' }}></i>
                      <h6 className="text-muted mb-0 small fs-7 mt-1">Total</h6>
                      <h3 className="fw-bold mb-0 fs-2 fs-sm-1">
                        {rankData.gamificationDetail?.totalPoint || 0}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Daily Points */}
                <Col xs={4}>
                  <Card className="h-100 border-0 bg-light rounded-2">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-2 p-sm-3">
                      <i className="bi bi-calendar-check-fill text-success" style={{ fontSize: '20px' }}></i>
                      <h6 className="text-muted mb-0 small fs-7 mt-1">
                        {selectedDate ? 'Filtered' : 'Today'}
                      </h6>
                      <h3 className="fw-bold mb-0 fs-2 fs-sm-1">
                        {getDisplayPoints()}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Date display under stats */}
              <div className="text-center mt-2">
                <small className="text-muted fs-7">
                  <i className="bi bi-calendar-range me-1"></i>
                  {selectedDate ? `Showing: ${formatDate(selectedDate)}` : `Today: ${formatDate(displayDate)}`}
                </small>
              </div>

              {/* Points Breakdown - Mobile Optimized */}
              <Card className="mt-3 mt-sm-4 border-0 bg-light rounded-2">
                <Card.Header className="bg-transparent border-0 pt-2 pt-sm-3 px-2 px-sm-3">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <h6 className="fw-bold mb-0 small">
                      <i className="bi bi-pie-chart-fill me-1"></i>
                      Points Breakdown
                    </h6>
                    {selectedDate && (
                      <span className="text-muted fs-7">
                        ({formatDate(selectedDate)})
                      </span>
                    )}
                  </div>
                </Card.Header>
                <Card.Body className="pt-0 px-2 px-sm-3 pb-2 pb-sm-3">
                  <Row className="g-1 g-sm-2">
                    {Object.entries(getDisplayPointsClassification()).map(([key, value]) => (
                      <Col xs={4} sm={3} md={2} key={key}>
                        <div className="p-1 p-sm-2 bg-white rounded-2 text-center shadow-sm">
                          <div className="text-muted small fs-8 text-uppercase" style={{ fontSize: '8px' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="fw-bold fs-6 fs-sm-5">{value}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* Date Filter - Mobile Optimized */}
              <Row className="mt-3 mt-sm-4">
                <Col>
                  <Card className="border-0 bg-light rounded-2">
                    <Card.Body className="p-2 p-sm-3">
                      <Row className="align-items-center g-2">
                        <Col xs={12} sm={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold mb-1 small">
                              <i className="bi bi-filter me-1"></i>
                              Filter by Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              value={selectedDate}
                              onChange={handleDateChange}
                              className="rounded-2"
                              size="sm"
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <div className="d-flex gap-2 mt-2 mt-sm-0">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => {
                                setSelectedDate("");
                                fetchRankData();
                              }}
                              className="rounded-2 flex-grow-1"
                            >
                              <i className="bi bi-arrow-counterclockwise me-1"></i>
                              Reset
                            </Button>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={handleRefresh}
                              className="rounded-2 flex-grow-1"
                            >
                              <i className="bi bi-arrow-repeat me-1"></i>
                              Refresh
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div className="text-center py-4 py-sm-5">
              <i className="bi bi-inbox" style={{ fontSize: '32px', color: '#ccc' }}></i>
              <p className="text-muted small mt-2">No rank data available</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .fs-7 {
          font-size: 0.75rem;
        }
        .fs-8 {
          font-size: 0.65rem;
        }
        @media (max-width: 576px) {
          .fs-sm-5 {
            font-size: 1rem !important;
          }
          .fs-sm-1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </Container>
  );
};