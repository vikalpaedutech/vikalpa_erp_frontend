// /FRONTEND/src/Navbar/NewNavbar.jsx

import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const NewNavbar = () => {

const navigate = useNavigate();

  const handleHome = () => {
    navigate("/user-dash");
  };

    return(
        <Container>
            <img
                      src="/home-button.png"
                      className="home-button"
                      onClick={handleHome}
                    />
        </Container>
    )



}


