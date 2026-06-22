import React, { useEffect, useContext, useState } from "react";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import {
  getAllGamificationData,
  pointClaimedUpdation,
  getUserMarkedGamificationData
} from "../../service/Gamification.services";
import { UserContext } from "../contextAPIs/User.context.js";

export const Gamification = () => {
  const { userData } = useContext(UserContext);
  const [gamificationData, setGamificationData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  // ✅ fetch gamification data
  const fetchGamficationData = async () => {
    const reqBody = { unqUserObjectId: userData?._id };

    try {
      const response = await getAllGamificationData(reqBody);
      // ✅ sort by date ascending
      const sortedData = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setGamificationData(sortedData);
      console.log(response.data)
    } catch (error) {
      console.log("Error::::>", error);
    }
  };

  

  useEffect(() => {
    if (isAuthorized) {
      fetchGamficationData();
    }
  }, [isAuthorized]);

  // ✅ claim point function
  const handleClaim = async (item, index) => {
    // check sequence: only first unclaimed can be clicked
    const firstUnclaimedIndex = gamificationData.findIndex(
      (d) => !d.pointClaimed
    );

    if (index !== firstUnclaimedIndex) {
      alert("⚠️ Please claim rewards in sequence!");
      return;
    }

    const reqBody = {
      unqUserObjectId: userData?._id,
      pointType: item.pointType,
      centerId: item.centerId,
      classOfCenter: item.classOfCenter,
      date: item.date,
    };

    try {
      await pointClaimedUpdation(reqBody);
      // update UI instantly
      const updatedData = [...gamificationData];
      updatedData[index].pointClaimed = true;
      setGamificationData(updatedData);
    } catch (error) {
      console.log("Error claiming point", error);
    }
  };

  // ✅ helper for dd-mm-yyyy format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  // ✅ total sum of claimed points
  const totalClaimedPoints = gamificationData
    .filter((d) => d.pointClaimed)
    .reduce((sum, d) => sum + (d.finalPoint || 0), 0);

  // ✅ handle password check
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "spiderman@123") {
      setIsAuthorized(true);
    } else {
      alert("Coming Soon!");
    }
  };

  if (!isAuthorized) {
    return (
      <Container className="my-5 text-center">
        <h2 className="mb-4">Coming Soon!</h2>
        <Form onSubmit={handlePasswordSubmit} style={{ maxWidth: "300px", margin: "0 auto" }}>
          <Form.Group className="mb-3">
            <Form.Label>Enter Password to Access</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">🎯 Gamification Rewards</h2>

      {/* ✅ show total claimed points */}
      <h5 className="text-center mb-4">
        Total Claimed Points: {totalClaimedPoints}
      </h5>

      <Row className="g-4">
        {gamificationData.map((item, index) => {
          const isClaimed = item.pointClaimed;
          const firstUnclaimedIndex = gamificationData.findIndex(
            (d) => !d.pointClaimed
          );
          const canClaim = index === firstUnclaimedIndex;

          return (
            <Col md={6} lg={4} key={item._id}>
              <Card
                className={`shadow-sm h-100 ${
                  isClaimed ? "border-success" : "border-primary"
                }`}
              >
                <Card.Body>
                  <Card.Title>
                    Award points received for {item.pointType.replace(/_/g, " ")}
                  </Card.Title>
                  <hr></hr>
                  <Card.Subtitle className="mb-2 text-muted">
                    Class: {item.classOfCenter} <br />
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Points:</strong> {item.finalPoint} <br />
                    <strong>Date:</strong> {formatDate(item.date)}
                  </Card.Text>

                  {isClaimed ? (
                    <Button variant="success" disabled>
                      ✅ Claimed
                    </Button>
                  ) : (
                    <Button
                      variant={canClaim ? "primary" : "secondary"}
                      disabled={!canClaim}
                      onClick={() => handleClaim(item, index)}
                    >
                      {canClaim ? "Claim Reward" : "Locked 🔒"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};
