import React, { useState, useContext } from "react";
import { ListGroup, Accordion, Offcanvas, Button, Container, Navbar } from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import AttendanceMB from "../../components/AcademicsComponents/AttendanceMB.component";
import { UploadMarks } from "../../components/AcademicsComponents/UploadMarks.component";
import { MdMenuOpen, MdSettingsSuggest } from "react-icons/md";
import { StudentDisciplinaryOrInteraction } from "../../components/AcademicsComponents/StudentDisciplinaryOrInteraction.component";
import { AttendancePdf } from "../../components/AcademicsComponents/AttendancePdf.component";
import Bills from "../../components/Bills/Bills";
import { DownloadAttendancePdfFormat } from "../../components/AcademicsComponents/DownloadAttendancePdfFormat.component";
import { UserAttendance } from "../../components/user/UserAttendance";
import { UserAttendanceLogout } from "../../components/user/userAttendanceLogout";
import { useNavigate } from "react-router-dom";
import MbCentersDisciplinary from "../../components/CentersOrSchools/MbCentersDisciplinary";

export const Template = () => {

  const navigate = useNavigate();

  // Handles Offcanvas visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // User Context
  const { userData, setUserData } = useContext(UserContext);
  console.log(userData?.[0].accessModules);
  console.log(userData)


//Logos
const logoutLogo = './logout.png'
//---------------

  // Track selected component key
  const [currentComponentKey, setCurrentComponentKey] = useState(null);

  // Sidebar config
  const sideBarMenusByRole = [
    {
      indexKey: "1",
      label: "📓 Academics",
      module: "Academics",
      main: [
        { id: '1', label: "Attendance", componentKey: "Attendance" },
        { id: '2', label: "Upload Marks", componentKey: "UploadMarks" },
        {id:'3', label: "Disciplinary and Interaciton", componentKey: "Disciplinary-and-Interaciton"},
        {id:'4', label: "Upload Attendance PDF", componentKey: "Upload-attendance-pdf"},
        // {id:'5', label: "Upload Attendance PDF", componentKey: "Upload-attendance-pdf"}
        
      ],
    },
    {
        indexKey: "2",
        label: "⬇️ Downloads",
        module:"Downloads",
        main: [
            {id:'1', label: "Manual Attendance Format", componentKey: "Manual-attendance-format"}
        
        ]
    },
    
    {
      indexKey: "3",
      label: "📜 Bills",
      module: "Bills",
      main: [
        {id:'1', label: "Upload Bills", componentKey: "Bills"},
      ],
    },


     {
      indexKey: "4",
      label: "🕵️ Monitoring",
      module: "Monitoring",
      main: [
        {id:'1', label: "Student Disciplinary/Interaction", componentKey: "Student-Disciplinary-Interaction"},
      ],
    },



  ];


//   const filteredSidbarMenusByRole = sideBarMenusByRole.filter((eachObject)=> eachObject.module === userData?.[0]?.accessModules[0])

const filteredSidbarMenusByRole = sideBarMenusByRole.filter(item => userData?.[0]?.accessModules.includes(item.module))

  console.log(filteredSidbarMenusByRole)
  console.log(userData?.[0]?.accessModules)

  // Component render map
  const renderComponent = (key) => {
    switch (key) {
      case "Attendance":
        return <AttendanceMB assignedDistricts={userData[0]?.assignedDistricts} />;
      case "UploadMarks":
        return <UploadMarks />;
      case "OperationsTask":
        return <div>Operations Task Module Coming Soon...</div>;
      case "Disciplinary-and-Interaciton":
        return <StudentDisciplinaryOrInteraction/>;
      case "Upload-attendance-pdf":
        return <AttendancePdf/>;
      case "Manual-attendance-format":
        return <DownloadAttendancePdfFormat/>  
      case "Bills":
        return <Bills/>;
      case "Student-Disciplinary-Interaction":
        return <MbCentersDisciplinary/>      
      default:
        return null;
    }
  };

  //_____________________________________________________________________

 const handleLogout = () =>{

  
  navigate('/');

  setTimeout(()=>{
    setUserData([]);
  }, 1000)
  


 }

  return (
    <div className="parent-cc-creen-main">
      {/* Navbar */}
      <nav>
         <Navbar style={{ backgroundColor: '#4e73df' }}>
      <Container fluid style={{width:'90vw'}}>
        <Navbar.Brand style={{display:'flex', gap:"30px"}} >
          <Button variant="primary" onClick={handleShow}>
                <MdMenuOpen /> All
              </Button>

              <UserAttendance/>

        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <img onClick={handleLogout} style={{height:'50px'}} src={logoutLogo}/>

          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      </nav>

      {/* Sidebar Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: "#4e73df" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{display:"flex", gap:'9rem'}}>
            <img style={{width:'95px', height:'100px'}} src="./buniyaadLogo.png"/>
            <img style={{height:'105px'}} src="./haryanaLogo.png"/>
          </Offcanvas.Title>
          
        </Offcanvas.Header>
        <br/>
        <h1 style={{color:'white', fontWeight:'bold'}}>Hello, {userData?.[0]?.name}</h1>
        <hr/>
        <Offcanvas.Body>
          <Accordion style={{display:"flex", flexDirection:'column',gap:"10px"}}>
            {filteredSidbarMenusByRole.map((section) => (
              <Accordion.Item key={section.indexKey} eventKey={section.indexKey}>
                <Accordion.Header>{section.label}</Accordion.Header>
                {section.main.map((item) => (
                  <Accordion.Body key={item.id}>
                    <ListGroup>
                      <ListGroup.Item
                        action
                        variant="success"
                        onClick={() => {
                          setCurrentComponentKey(item.componentKey);
                          setShow(false); // Optionally close menu after selection
                        }}
                      >
                        {item.label}
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                ))}
              </Accordion.Item>
            ))}
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main>
        {renderComponent(currentComponentKey)}
      
        {/* <Bills/> */}
      </main>
    </div>
  );
};
