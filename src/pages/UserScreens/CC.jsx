//CC.jsx

//This page is going to be for cc, if cc logins then we will show him/her this page.

import React, { useState, useEffect, useRef, useContext  } from "react";
import { Accordion, Offcanvas, Button, Overlay, ButtonGroup , Dropdown , DropdownButton, Container , Row, Col, Navbar } from "react-bootstrap";
import UserLoggedIn from "../../components/user/UserLoggedIn.component";
import { StudentDisciplinaryOrInteraction } from "../../components/AcademicsComponents/StudentDisciplinaryOrInteraction.component";
import { UploadMarks } from "../../components/AcademicsComponents/UploadMarks.component";
import Bills from "../../components/Bills/Bills";
import { UserContext } from "../../components/contextAPIs/User.context";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar/Navbar";
import { MdMenuOpen } from "react-icons/md";
import { AttendancePdf } from "../../components/AcademicsComponents/AttendancePdf.component";
import { SliderContext } from "../../components/contextAPIs/SliderHook.context";

export const CenterCoordinator = () => {

//context hooks
const {sliderContext, setSliderContext} = useContext(SliderContext)


  const navigate = useNavigate();

  const {userData, setUserData} = useContext(UserContext)

  const handleUserLogout = () => {
    setUserData([]); // ✅ Reset to empty array to match expected structure
    alert("Logged out");
    navigate("/user-signin");
  }

  //________________________________________________________________________________




  const [show, setShow] = useState(true);

    //For overlay
  const [showOverLay, setShowOverLay] = useState(false);
  const target = useRef(null);
  //________________________________

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setShow(!isMobile); // Show sidebar by default on desktop, hide on mobile
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize); // Listen to window resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Handles the opening and closing of slider from context api
  const handleClose = () => {
    
    setSliderContext(false)
    
 
    
    setShow(false)};
  const handleShow = () => setShow(true);

  //_______________________________
  //_________________________________________________________________________

  //Logics
  //Handling Acadmic Section:

  const [showAttendance, setShowAttendance] = useState(false)
  const [showDisciplinaryOrInteraction, setShowDisciplinaryOrInteraction] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [showAttendancePdf, setShowAttendancePdf] = useState(false);
  const handleAcademicsSelect = (eventKey) => {
    // console.log(" this is my event key", eventKey)

    if (eventKey === "1") {
      setShowAttendance(true)
      setShowDisciplinaryOrInteraction(false)
      setShowMarks(false)
      setShowBillsUpload(false)
      setShowAttendancePdf(false)
        
    } else if (eventKey === "4"){
      setShowDisciplinaryOrInteraction(true)
      setShowAttendance(false)
      setShowMarks(false)
      setShowBillsUpload(false)
      setShowAttendancePdf(false)
    } else if (eventKey === "3") {
      setShowMarks(true)
      setShowDisciplinaryOrInteraction(false)
      setShowAttendance(false)
      setShowBillsUpload(false)
      setShowAttendancePdf(false)
    } else if (eventKey === "2") {
      setShowAttendancePdf(true)

      setShowMarks(false)
      setShowDisciplinaryOrInteraction(false)
      setShowAttendance(false)
      setShowBillsUpload(false)

    }

  }

//Handling bills select

//Hooks for handling bills section
const [showBillsUpload, setShowBillsUpload] = useState(false)
  const handleBillsSelect = (eventKey) => {

    if (eventKey === "1") {
      setShowBillsUpload(true)

      setShowAttendance(false)
      setShowDisciplinaryOrInteraction(false)
      setShowMarks(false)
      setShowAttendancePdf(false)

    }


  }

  //Below useEffect is for showing default screen after login.
  useEffect(()=>{
 setShowAttendance(true)
  }, [])

  return (
    <div className="parent-cc-creen-main">
      {/* Header */}
      <Row>
        {" "}
        <NavbarComponent />
      </Row>
      <br />
      {/* <Row>
        <Col xs="auto">
          <MdMenuOpen
            onClick={handleShow}
            style={{
              cursor: "pointer",
              width: "30px", // Change this to your preferred width
              height: "30px", // Change this to your preferred height
              cursor: "pointer",
            }}
          />
        </Col>
      </Row>
      <hr /> */}

      {/* Main Content */}
      <main className="admin-main">
        {/* Left Sidebar */}
        <Offcanvas
          show={sliderContext}
          onHide={handleClose}
          backdrop={false}
          scroll={true}
          placement="start"
          className="admin-slider"
         >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h2>Hello CC</h2>
            <hr />
            {/* <>
      {['Primary'].map(
        (variant) => (
          <DropdownButton
            as={ButtonGroup}
            key={variant}
            id={`dropdown-variants-${variant}`}
            variant={variant.toLowerCase()}
            title={variant}
          >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3" active>
              Active Item
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
        ),
      )}
    </> */}
            <p>Home</p>
            <hr />

            <DropdownButton
              className="slider-dropdown-1"
              title="Academics"
              onSelect={handleAcademicsSelect}
            >
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Student Attendance</Dropdown.Item>
              <Dropdown.Item eventKey="2">Upload Pdfs</Dropdown.Item>
              <Dropdown.Item eventKey="3">Update Marks</Dropdown.Item>
              <Dropdown.Item eventKey="4">Disciplinary Issue</Dropdown.Item>

              {/* <Dropdown.Item eventKey="3" active>
                Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>

            <hr />

            <DropdownButton className="slider-dropdown-1" title="User">
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Your Information</Dropdown.Item>
              <Dropdown.Item eventKey="2">Mark Your Attendance</Dropdown.Item>
              {/* <Dropdown.Item eventKey="3" active>
                Active Item
              </Dropdown.Item> */}
              {/* <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>

            <hr />

            <DropdownButton
              className="slider-dropdown-1"
              title="Bills"
              onSelect={handleBillsSelect}
            >
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Upload Bills</Dropdown.Item>
              {/* <Dropdown.Item eventKey="2">Mark Your Attendance</Dropdown.Item> */}
              {/* <Dropdown.Item eventKey="3" active>
    Active Item
  </Dropdown.Item> */}
              {/* <Dropdown.Divider />
  <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>
          </Offcanvas.Body>
        </Offcanvas>

        <main  className={show ? "cc-screen-main-slider-on" : "cc-screen-main-slider-off"}>
          <div style={{}}>

            <div>{showAttendance ? <UserLoggedIn /> : null}</div>
            <div>
              {showDisciplinaryOrInteraction ? (
                <StudentDisciplinaryOrInteraction />
              ) : null}
            </div>
            <div>{showMarks ? <UploadMarks /> : null}</div>

            <div>{showBillsUpload ? <Bills /> : null}</div>

            <div>{showAttendancePdf ? <AttendancePdf /> : null}</div>
            
          </div>
        </main>
      </main>
    </div>
  );
};
