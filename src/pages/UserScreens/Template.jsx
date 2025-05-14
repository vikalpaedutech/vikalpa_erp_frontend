import React, { useState, useContext } from "react";
import { ListGroup, Accordion, Offcanvas, Button, Container, Navbar } from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import AttendanceMB from "../../components/AcademicsComponents/AttendanceMB.component";
import { UploadMarks } from "../../components/AcademicsComponents/UploadMarks.component";
import { MdMenuOpen } from "react-icons/md";
import { StudentDisciplinaryOrInteraction } from "../../components/AcademicsComponents/StudentDisciplinaryOrInteraction.component";
import { AttendancePdf } from "../../components/AcademicsComponents/AttendancePdf.component";
import Bills from "../../components/Bills/Bills";
import { DownloadAttendancePdfFormat } from "../../components/AcademicsComponents/DownloadAttendancePdfFormat.component";
import { UserAttendance } from "../../components/user/UserAttendance";
import { UserAttendanceLogout } from "../../components/user/userAttendanceLogout";

export const Template = () => {
  // Handles Offcanvas visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // User Context
  const { userData } = useContext(UserContext);
  console.log(userData?.[0].accessModules?.[0]);

  // Track selected component key
  const [currentComponentKey, setCurrentComponentKey] = useState(null);

  // Sidebar config
  const sideBarMenusByRole = [
    {
      indexKey: "1",
      label: "Academics",
      module: "Academics",
      main: [
        { id: '1', label: "Attendance", componentKey: "Attendance" },
        { id: '2', label: "Upload Marks", componentKey: "UploadMarks" },
        {id:'3', label: "Disciplinary and Interaciton", componentKey: "Disciplinary-and-Interaciton"},
        {id:'4', label: "Upload Attendance PDF", componentKey: "Upload-attendance-pdf"},
        {id:'5', label: "Upload Attendance PDF", componentKey: "Upload-attendance-pdf"}
        
      ],
    },
    {
        indexKey: "2",
        label: "Downloads",
        module:"Downloads",
        main: [
            {id:'1', label: "Manual Attendance Format", componentKey: "Manual-attendance-format"}
        
        ]
    },
    
    {
      indexKey: "3",
      label: "Bills",
      module: "Bills",
      main: [
        {id:'1', label: "Upload Bills", componentKey: "Bills"},
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
      default:
        return null;
    }
  };

  //_____________________________________________________________________

 

  return (
    <div className="parent-cc-creen-main">
      {/* Navbar */}
      <nav>
        <Navbar style={{ backgroundColor: '#4e73df' }}>
          <Container>
            <Navbar.Brand href="#home" style={{display:'flex'}}>
              <Button variant="primary" onClick={handleShow}>
                <MdMenuOpen /> All
              </Button>
              
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
               <div style={{display:"flex", gap:'10px'}}>
                <UserAttendance/>
                <UserAttendanceLogout/>
              </div>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </nav>

      {/* Sidebar Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: "#4e73df" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion>
            {filteredSidbarMenusByRole.map((section) => (
              <Accordion.Item key={section.indexKey} eventKey={section.indexKey}>
                <Accordion.Header>{section.module}</Accordion.Header>
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
