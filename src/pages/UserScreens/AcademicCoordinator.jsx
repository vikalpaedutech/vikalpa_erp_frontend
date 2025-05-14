//AcademicPresenter.jsx

//This page is going to be for cc, if cc logins then we will show him/her this page.

import React, { useState, useEffect, useRef, useContext  } from "react";
import { ListGroup , Tab , Accordion, Offcanvas, Button, Overlay, ButtonGroup , Dropdown , DropdownButton, Container , Row, Col, Navbar } from "react-bootstrap";
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
import { DownloadAttendancePdfFormat } from "../../components/AcademicsComponents/DownloadAttendancePdfFormat.component";
import MbCentersDisciplinary from "../../components/CentersOrSchools/MbCentersDisciplinary";
export const AcademicCoordinator = () => {

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



//For Slider
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
  const [showCenterDisciplinary, setShowCenterDisciplinary] = useState(false)

  const [showDisciplinaryOrInteraction, setShowDisciplinaryOrInteraction] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [showAttendancePdf, setShowAttendancePdf] = useState(false);
  


  const handleAcademicsSelect = (eventKey) => {
    // console.log(" this is my event key", eventKey)

    if (eventKey === "1") {
      setShowCenterDisciplinary(true)
      setShowDisciplinaryOrInteraction(false)
    } else if (eventKey === "2"){
      setShowDisciplinaryOrInteraction(true)
      
      setShowCenterDisciplinary(false)
      setShowMarks(false)
      setShowBillsUpload(false)
      setShowAttendancePdf(false)
      setShowAttendancePdFormat(false)
    } else if (eventKey === "3") {
      setShowMarks(true)
      setShowDisciplinaryOrInteraction(false)
     
      setShowBillsUpload(false)
      setShowAttendancePdf(false)
      setShowAttendancePdFormat(false)
    } else if (eventKey === "2") {
      setShowAttendancePdf(true)

      setShowMarks(false)
      setShowDisciplinaryOrInteraction(false)
     
      setShowBillsUpload(false)
      setShowAttendancePdFormat(false)

    }

  }

//Handling bills select

//Hooks for handling bills section
const [showBillsUpload, setShowBillsUpload] = useState(false)
  const handleBillsSelect = (eventKey) => {

    if (eventKey === "1") {
      setShowBillsUpload(true)

      setShowCenterDisciplinary(false)
      setShowDisciplinaryOrInteraction(false)
      setShowMarks(false)
      setShowAttendancePdf(false)
      setShowAttendancePdFormat(false)

    }


  }

  //Hooks for handleing downlods
  const [showAttendancePdFormat, setShowAttendancePdFormat] = useState(false)

  const handleDownloadSelect = (eventKey) => {

    if (eventKey === "1") {
      setShowBillsUpload(false)

      setShowCenterDisciplinary(false)
      setShowDisciplinaryOrInteraction(false)
      setShowMarks(false)
      setShowAttendancePdf(false)
      setShowAttendancePdFormat(true)

    }

  }

  

  //Below useEffect is for showing default screen after login.
  useEffect(()=>{
setShowCenterDisciplinary(true)
  }, [])

  return (
    <div className="parent-cc-creen-main">
      {/* Header */}
      <Row>
        {" "}
        <NavbarComponent />
      </Row>
      <br />

      {/* Main Content */}
      <main className="admin-main">
        {/* Left Sidebar */}
        <Offcanvas
          style={{ backgroundColor: "#4e73df" }}
          show={sliderContext}
          onHide={handleClose}
          backdrop={false}
          scroll={true}
          placement="start"
          className="admin-slider"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title style={{display:"flex"}}><img   src="/buniyaadLogo.png"/></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ color: "white" }}>
            <h4>Hello, {userData[0].name}</h4>
            <hr />

            <div>
              {" "}
              <ListGroup onSelect={handleBillsSelect}>
                <ListGroup.Item action variant="success" eventKey="1">
                  Dashboards
                </ListGroup.Item>
              </ListGroup>
            </div>
            <hr />

            <div>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Academics</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup onSelect={handleAcademicsSelect}>
                      <ListGroup.Item action variant="success" eventKey="1" style={{fontSize:'11px'}}>
                        Center Disciplinary/Interaction
                      </ListGroup.Item>
                      <ListGroup.Item action variant="success" eventKey="2" style={{fontSize:'11px'}}>
                      Student Disciplinary/interaction
                      </ListGroup.Item>
                     

                      {/* <ListGroup.Item action variant="info">
        Info
      </ListGroup.Item> */}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Biils</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup onSelect={handleBillsSelect}>
                      <ListGroup.Item action variant="success" eventKey="1">
                        Upload Bills
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>



                <Accordion.Item eventKey="2">
                  <Accordion.Header>Downloads</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup onSelect={handleDownloadSelect}>
                      <ListGroup.Item action variant="success" eventKey="1">
                        Downloads
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>








              </Accordion>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <main
          className={
            show ? "cc-screen-main-slider-on" : "cc-screen-main-slider-off"
          }
        >
          <div style={{}}>
            <div>{showCenterDisciplinary ? <MbCentersDisciplinary /> : null}</div>
            <div>
              {showDisciplinaryOrInteraction ? (
                <StudentDisciplinaryOrInteraction />
              ) : null}
            </div>
            <div>{showMarks ? <UploadMarks /> : null}</div>

            <div>{showBillsUpload ? <Bills /> : null}</div>

            <div>{showAttendancePdf ? <AttendancePdf /> : null}</div>

            <div>{showAttendancePdFormat ? <DownloadAttendancePdfFormat /> : null}</div>
          </div>
        </main>
      </main>
    </div>
  );
};
