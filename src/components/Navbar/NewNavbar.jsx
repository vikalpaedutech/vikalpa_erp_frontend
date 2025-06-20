import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";

import { GetNotificationByUserIdOnQueryParams } from "../../service/ConcernsServices/Concern.services";

export const NewNavbar = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [notificationData, setNotificationData] = useState([]); // ✅ initialized as array

  const fetchNotification = async () => {
    const queryParams = {
      userId: userData[0].userId,
    };

    try {
      const response = await GetNotificationByUserIdOnQueryParams(queryParams);

      console.log(response.data.data);
      setNotificationData(response.data.data);
    } catch (error) {
      console.log("Error fetching notification data", error);
    }
  };

  useEffect(() => {
    
    fetchNotification();
  }, []);

  const navigate = useNavigate();

  const handleHome = () => {
    if (userData?.[0]?.role === "CC") {
      navigate("/user-dash");
    } else if (userData?.[0]?.role === "ACI") {
      navigate("/l2-user-dash");
    }
  };

  const handleIndividualConcernClick = () => {
    navigate("/individual-concerns-form");
  };

  const handleProfileClick = () => {
    alert("Coming soon!");
  };

  return (
    <Navbar bg="light" className="shadow-sm">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* Left: Home Icon */}
        <div style={{ cursor: "pointer" }} onClick={handleHome}>
          <img
            src="/home-button.png"
            className="home-button"
            alt="Home"
            style={{ height: "30px" }}
          />
        </div>

        {/* Center: Empty (optional - or could place logo) */}
        <Nav className="me-auto" />

        {/* Right: Gear Dropdown */}
        <Nav>
          <NavDropdown
            align="end"
            title={
              <img
                src="/notification.png"
                className="notification"
                alt="notification"
                style={{ height: "30px", cursor: "pointer" }}
              />
            }
            id="settings-dropdown"
          >
            {/* ✅ Notification items when isSomeoneReverted is true */}
            {notificationData.length > 0 &&
              notificationData
                .filter((item) => item.isSomeoneReverted)
                .map((item) => (
                  <NavDropdown.Item key={item._id}>
                    {item.concernId} - {item.concernType}
                  </NavDropdown.Item>
                ))}

            
          </NavDropdown>

          <NavDropdown
            align="end"
            title={
              <img
                src="/settings.png"
                className="logout"
                alt="Settings"
                style={{ height: "30px", cursor: "pointer" }}
              />
            }
            id="settings-dropdown"
          >
            <NavDropdown.Item onClick={handleProfileClick}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleIndividualConcernClick}>
              Individual Concerns
            </NavDropdown.Item>
            {/* <NavDropdown.Item>Other</NavDropdown.Item> */}
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={() => {
                setUserData([]);
                navigate("/");
              }}
            >
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};
