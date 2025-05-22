//This is UserSignIn.component.jsx;

//This components allows the users like, admin, cc, aci..etc.. to sign in and use their pages.

import React, { useState, useEffect, useContext, use } from "react";
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
      if (response.data && response.data[0].password === password && response.data[0].isActive === true){
        navigate('/dashboard')
      }
      else (
        alert("Your account has not been verified yet. Ask your manager!")
      
        
        
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
    <div className="parent-user-signin">
      <div className="child-wrapper-div">
        <div >
       

          {/* ✅ Replaced <p> with <div> to avoid form nesting error */}
          <div className="child-signin-form">
          
            <img src="/vikalpaLogo.png" style={{height:65, width: 100}}/>
            
            <div className="child-user-signin-head-text"> 
          <h1>Vikalpa Foundation</h1>
          <h2>ERP-Login</h2>
          
          </div>
          <hr/>

            
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
            <hr></hr>
            <div>
            <p>New user click here to create account: <Card.Link href="/user-signup">Sign Up</Card.Link></p>
          </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};