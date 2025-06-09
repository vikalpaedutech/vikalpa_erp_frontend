// /FRONTEND/src/Navbar/NewNavbar.jsx

import React, { useReducer } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";
import { useContext } from "react";

export const NewNavbar = () => {
  const { userData, setUserData } = useContext(UserContext);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/user-dash");
  };

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      setUserData([]);
    }, 1000);
  };

  return (
    <Container>
        <div style={{display:'flex', gap:"82%"}}>

    <img
        src="/home-button.png"
        className="home-button"
        onClick={handleHome}
      />

      <img src="/logout.png" className="logout" onClick={handleLogout} />

        </div>
      
    </Container>
  );
};
