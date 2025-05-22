    import React, { useState, useContext } from "react";
    import { ListGroup, Accordion, Offcanvas, Button, Container, Navbar } from "react-bootstrap";
    import { Outlet, useNavigate } from "react-router-dom";
    import { UserContext } from "../../components/contextAPIs/User.context";
    import { MdMenuOpen } from "react-icons/md";
    import { UserAttendance } from "../../components/user/UserAttendance";
    //import logoutLogo from '../../assets/logout.png'; // Replace with correct path

    const MainLayout = () => {
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
            { id: '3', label: "Disciplinary and Interaction", path: "center-disciplinary-or-interaction" },
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
        ],
        },
        {
        indexKey: "4",
        label: "🕵️ Monitoring",
        module: "Monitoring",
        main: [
            { id: '1', label: "Student Disciplinary/Interaction", path: "student-disciplinary-or-interaction" },
        ],
        },
           {
        indexKey: "5",
        label: "🕵️ Test Controller",
        module: "Test Controller",
        main: [
            { id: '1', label: "Test Controller", path: "test-controller" },
        ],
        },
        {
        indexKey: "6",
        label: "📞 Callings",
        module: "Callings",
        main: [
            { id: '1', label: "Absentee Callings", path: "student-callings" },
        ],
        },
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
           <Offcanvas.Title style={{display:"flex", gap:'9rem'}}>
                       <img style={{width:'95px', height:'100px'}} src="/buniyaadLogo.png"/>
                       <img style={{height:'105px'}} src="/haryanaLogo.png"/>
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
                            navigate(`/dashboard/${item.path}`);
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

    export default MainLayout;
