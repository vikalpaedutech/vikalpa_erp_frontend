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
import { getUserByContact1, userSignIn } from "../../service/User.service";
import { UserContext } from "../contextAPIs/User.context";
import { useNavigate } from "react-router-dom";

export const UserSignIn = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const [contact1, setContact1] = useState("");
  const [password, setPassword] = useState("");

  const fetchData = async () => {


    const reqBody = {
      contact1:contact1,
      password: password
    }

    try {
      // const response = await getUserByContact1(contact1);
       const response = await userSignIn(reqBody);
       alert(response.status)
      console.log(response.data);
      // console.log(response.data[0].role);
      setUserData(response.data);

      //Checking if password is correct or not
      if (response.status==="Success"){
       console.log('user loggedin')
       console.log(response.data.role)
       console.log(userData)
      //  if(response.data[0].role === 'ACI'){
      //    navigate('/user-attendance-aci')
      //  } else if (response.data[0].role === 'CC') {
      //     navigate('/user-attendance-updated')
      //  } else if (response.data[0].role === 'Community Manager'){
      //     navigate('/user-attendance-updated')
      //  } 
      //  else if (response.data[0].role === 'admin'){
      //     navigate('/admin-dash')
      //  } 
       
       
      //  else {
      //   navigate('/user-attendance-updated')
      //  }




       if(response.data.role === 'ACI'){
         navigate('/user-attendance-aci')
          // navigate('/user-attendance-updated')

       } else if (response.data.role === 'CC' || response.data.role === 'HKRN') {
          navigate('/user-attendance-updated')
       } else if (response.data.role === 'Community Manager'){
          navigate('/user-attendance-updated')
       } else if (response.data.role === "hkrn"){
        navigate('/user-attendance-updated')

       }
       else if (response.data.role === 'admin'){
          //navigate('/admin-dash')
          navigate('/user-dashboard')
       } 
       
       
       else {
        navigate('/user-attendance-updated')
       }
       
        
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
          
            <img src="/vikalpaFull.png" style={{height:60, width: 100}}/>
            
            <div className="child-user-signin-head-text"> 
          {/* <h1>Vikalpa Foundation</h1> */}
          {/* <h2>Login</h2> */}
          
          </div>
          <hr/>

            
            <Form>
              <Form.Group className="mb-3" controlId="contactInput">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={contact1}
                  onChange={(e) => setContact1(e.target.value)}
                  autoComplete="tel"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="passwordInput">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
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
            {/* <p>New Users: <Card.Link href="/user-signup">Sign Up</Card.Link></p> */}
            <p>Forgot Password: <Card.Link href="/forgot-password">Click Here</Card.Link></p>
          </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};