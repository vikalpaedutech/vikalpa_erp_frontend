    import React, { useState, useContext } from "react";
    import { ListGroup, Accordion, Offcanvas, Button, Container, Navbar } from "react-bootstrap";
    import { Outlet, useNavigate } from "react-router-dom";
    import { UserContext } from "../../components/contextAPIs/User.context";
    import { MdMenuOpen } from "react-icons/md";
    import { UserAttendance } from "../../components/user/UserAttendance";
    //import logoutLogo from '../../assets/logout.png'; // Replace with correct path

    const MainLayoutAdmin = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { userData, setUserData } = useContext(UserContext);

    const handleLogout = () => {
        navigate('/');
        setTimeout(() => {
        setUserData([]);
        }, 1000);
    };

    const sideBarMenusByRole = [
        {
        indexKey: "1",
        label: "📓 Academics",
        module: "Academics",
        main: [
            { id: '1', label: "Attendance", path: "mb-attendance" },
            { id: '2', label: "Upload Marks", path: "upload-marks" },
            { id: '3', label: "Disciplinary and Interaction", path: "student-disciplinary-or-interaction" },
            { id: '4', label: "Upload Attendance PDF", path: "upload-attendance-pdf" },
        ],
        },
        {
        indexKey: "2",
        label: "⬇️ Downloads",
        module: "Downloads",
        main: [
            { id: '1', label: "Manual Attendance Format", path: "attendance-pdf-format" }
        ]
        },
        {
        indexKey: "3",
        label: "📜 Bills",
        module: "Bills",
        main: [
            { id: '1', label: "Upload Bills", path: "upload-bills" },
            { id: '2', label: "Bills Verification", path: "verify-bills" }
        ],
        },
        {
        indexKey: "4",
        label: "🕵️ Monitoring",
        module: "Monitoring",
        main: [
            { id: '1', label: "Center Disciplinary/Interaction", path: "center-disciplinary-or-interaction" },
        ],
        },
        
        {
        indexKey: "6",
        label: "📞 Callings",
        module: "Callings",
        main: [
            { id: '1', label: "Absentee Callings", path: "absentee-calling" },
        ],
        },

        //Only for Admin
        {
        indexKey: "7",
        label: "🙋🏻 Attendance Controller",
        module: "Attendance Controller",
        main: [
            { id: '1', label: "Initiate Student Attendance", path: "initiate-student-attendance" },
            { id: '2', label: "Initiate User Attendance", path: "initiate-user-attendance" },
            {id:'3', label:"Initiate Upload-attendance-pdf", path: "initiate-upload-attendance-pdf"}
        ],

        },

         {
        indexKey: "8",
        label: "🖋️ Test Controller",
        module: "Test Controller",
        main: [
            { id: '1', label: "Create Test", path: "test-controller" },
            { id: '2', label: "Initiate Test", path: "initiate-test" },
        ],

        },

        //-----------------
    ];

    const filteredSidbarMenusByRole = sideBarMenusByRole.filter(item =>
        userData?.[0]?.accessModules.includes(item.module)
    );

const logo = './'

    return (
        <div className="parent-cc-creen-main">
        <Navbar style={{ backgroundColor: '#4e73df' }}>
            <Container fluid style={{ width: '90vw' }}>
            <Navbar.Brand style={{ display: 'flex', gap: "30px" }}>
                <Button variant="primary" onClick={handleShow}><MdMenuOpen /> All</Button>
                <UserAttendance />
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                <img onClick={handleLogout} style={{ height: '50px', cursor: 'pointer' }} src='/logout.png' alt="Logout" />
                </Navbar.Text>
            </Navbar.Collapse>
            </Container>
        </Navbar>

        <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: "#4e73df" }}>
            <Offcanvas.Header closeButton>
           <Offcanvas.Title style={{display:"flex", gap:'2rem'}}>
                       <img style={{width:'95px', height:'100px'}} src="/buniyaadLogo.png"/>
                       <img style={{height:'105px'}} src="/vikalpaLogo.png"/>
                     </Offcanvas.Title>
            </Offcanvas.Header>
            <br />
            <h1 style={{ color: 'white', fontWeight: 'bold' }}>Hello, {userData?.[0]?.name}</h1>
            <hr />
            <Offcanvas.Body>
            <Accordion style={{ display: "flex", flexDirection: 'column', gap: "10px" }}>
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
                            navigate(`/admin-dash/${item.path}`);
                            setShow(false);
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

        <main>
            <Outlet />
        </main>
        </div>
    );
    };

    export default MainLayoutAdmin;
