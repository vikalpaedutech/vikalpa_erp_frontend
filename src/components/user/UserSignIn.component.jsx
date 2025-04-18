//This is UserSignIn.component.jsx;

//This components allows the users like, admin, cc, aci..etc.. to sign in and use their pages.

import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { getUserByContact1 } from "../../service/User.service";
import { UserContext } from "../contextAPIs/User.context";
import { useNavigate } from "react-router-dom";

export const UserSignIn = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const [contact1, setContact1] = useState("");
  const [password, setPassword] = useState("");

  const fetchData = async () => {
    try {
      const response = await getUserByContact1(contact1);
      console.log(response.data[0]._id);
      setUserData(response.data);

      //Checking if password is correct or not
      if (response.data && response.data[0].password === password){
        navigate("/center-coordinator");
      } else (
        setUserData(null)
        
      )
      //______________________________________________  
    
    } catch (error) {
      console.log("Error occurred while fetching data", error.message);
    }
  };

  useEffect(() => {
    console.log("I am from useEffect", userData);
  }, [userData]);

  return (
    <Container
      className="user-sign-in-container d-flex justify-content-center align-items-center"
      fluid
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "30rem", borderRadius: "20px" }} className="justify-content-center">
        <Card.Body className="user-sign-in-card-body">
          <Card.Title className="text-center">Mission Buniyaad</Card.Title>
          <Card.Subtitle className="mb-2 text-muted text-center">ERP-Login</Card.Subtitle>

          {/* ✅ Replaced <p> with <div> to avoid form nesting error */}
          <div className="card-text">
            <Form>
              <Form.Group className="mb-3" controlId="contactInput">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  value={contact1}
                  onChange={(e) => setContact1(e.target.value)}
                  autoComplete="tel"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="passwordInput">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Form.Group>

              <Row>
                <Button onClick={fetchData}>Login</Button>
              </Row>
            </Form>
          </div>

          <div>
            <p>New user click here to create account: <Card.Link href="/user-signup">Sign Up</Card.Link></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};