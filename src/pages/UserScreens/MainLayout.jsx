import React, { useState, useContext, useEffect } from "react";
import {
  ListGroup,
  Accordion,
  Offcanvas,
  Button,
  Container,
  Navbar,
  Card,
  Carousel,
} from "react-bootstrap";
import { href, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";
import { MdMenuOpen } from "react-icons/md";
import { UserAttendance } from "../../components/user/UserAttendance";
import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services";
//import logoutLogo from '../../assets/logout.png'; // Replace with correct path
import { Link } from "react-router-dom";
import { NewNavbar } from "../../components/Navbar/NewNavbar";

const MainLayout = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { userData, setUserData } = useContext(UserContext);

  //All hooks

  const [studentCount, setStudentCount] = useState([]);


   const [startDate, setStartDate] = useState(() => {
          return new Date().toISOString().split("T")[0];
        });
        const [endDate, setEndDate] = useState(() => {
          return new Date().toISOString().split("T")[0];
        });

  //------------------------------
  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      setUserData([]);
    }, 1000);
  };



  const fetchStudentRelatedCounts = async () => {
    const payload = {
      schoolIds: userData[0].schoolIds,
      classFilters: userData[0].classId,
      // date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format

      startDate: startDate,
      endDate: endDate
    };

    try {
      const response = await studentAndAttendanceAndAbsenteeCallingCount(
        payload
      );
      console.log(response.data);
      setStudentCount(response.data);
    } catch (error) {
      console.log("Error fetching student count");
    }
  };

  useEffect(() => {
    fetchStudentRelatedCounts();
  }, []);

  const sideBarMenusByRole = [
    {
      indexKey: "1",
      label: "Academics",
      logo: "/attendance.png",
      module: "Academics",
      main: [
        {
          id: "1",
          label: "Attendance",
          logo: "/attendance.png",
          path: "mb-attendance",
        },
        { id: "2", label: "Upload Marks", logo: "/exam.png", path: "upload-marks" },
        {
          id: "3",
          label: "Disciplinary",
          logo: "/disciplinary.png",
          path: "student-disciplinary-or-interaction",
        },
          {
          id: "4",
          label: "Copy-checking",
          logo: "/copy-checking.png",
          path: "copy-checking",
        },
        {
          id: "5",
          label: "Manual Attendance",
          logo: "/upload.png",
          path: "manual-attendance", // path: "upload-attendance-pdf",
        },
      ],
    },
    // {
    //   indexKey: "2",
    //   label: "Downloads",
    //   logo: "/download.png",
    //   module: "Downloads",
    //   main: [
    //     {
    //       id: "1",
    //       label: "Manual Attendance Format",
    //       logo: "/download.png",
    //       path: "attendance-pdf-format",
    //     },
    //   ],
    // },
    {
      indexKey: "3",
      label: "Bills & Issues",
      logo: "/bills.png",
      module: "Bills",
      main: [
        { id: "1", label: "Upload Bills", logo: "/bills.png", path: "upload-bills" },
        // { id: "2", label: "Bills Verification", logo: "/bill-verification.png", path: "verify-bills" },
        { id: "2", label: "School Issues", logo: "/school.png", path: "school-concerns" },
        { id: "3", label: "Tech Issues", logo: "/tech.png", path: "tech-concerns" },
      
      
      ],
    },
    {
      indexKey: "4",
      label: "Monitoring",
      logo: "/monitoring.png",
      module: "Monitoring",
      main: [
        {
          id: "1",
          label: "Center Disciplinary/Interaction",
          path: "center-disciplinary-or-interaction",
        },
      ],
    },

    {
      indexKey: "6",
      label: "Callings",
      logo: "/client.png",
      module: "Callings",
      main: [{ id: "1", label: "Absentee Callings", logo: "/call.png", path: "absent-calling" }],
    },

    //Only for Admin
    {
      indexKey: "7",
      label: "Attendance Controller",
      module: "Attendance Controller",
      main: [
        {
          id: "1",
          label: "Initiate Student Attendance",
          path: "initiate-student-attendance",
        },
        {
          id: "2",
          label: "Initiate User Attendance",
          path: "initiate-user-attendance",
        },
        {
          id: "3",
          label: "Initiate Upload-attendance-pdf",
          path: "initiate-upload-attendance-pdf",
        },
      ],
    },

    {
      indexKey: "8",
      label: "Test Controller",
      module: "Test Controller",
      main: [
        { id: "1", label: "Create Test", path: "test-controller" },
        { id: "2", label: "Initiate Test", path: "initiate-test" },
      ],
    },

    //-----------------
  ];

  const allSidebarRoutes = sideBarMenusByRole.flatMap((section) =>
    section.main.map((item) => ({
      label: item.label,
      path: item.path,
    }))
  );

  const filteredSidbarMenusByRole = sideBarMenusByRole.filter((item) =>
    userData?.[0]?.accessModules.includes(item.module)
  );

  const logo = "./";

  const testArray = ["1", "2", "3", "4", "5", "6"];

 //Below function is for caraousel cards
const getClassValue = (classNum, key) => {
  if (!studentCount || studentCount.length === 0) return "--";

  let total = 0;

  studentCount.forEach((school) => {
    const classData = school.classes.find(
      (cls) => cls.classofStudent === classNum
    );
    if (classData && classData[key] !== undefined) {
      total += classData[key];
    }
  });

  return total;
};



//Calling summary

const getCallingSummary = (classNum, key) => {
  if (!studentCount || studentCount.length === 0) return 0;

  let total = 0;

  studentCount.forEach((school) => {
    const classData = school.classes.find(
      (cls) => cls.classofStudent === classNum
    );
    if (classData) {
      if (key === "totalCallings") {
        total += (classData.connectedCount || 0) + (classData.notConnectedCount || 0);
      } else if (key === "notCalled") {
        const attempted =
          (classData.connectedCount || 0) + (classData.notConnectedCount || 0);
        total += (classData.absent || 0) - attempted;
      } else {
        total += classData[key] || 0;
      }
    }
  });

  return total;
};

//--------------------------------------
  const handleClick = () => {
    alert("hi");
    navigate("/admin-dash/mb-attendance");
  };

  //Handling app squares clicks. So that people can navigate to the sub apps.

  const handleAppClicks = (e) => {
    e.preventDefault();

    //alert(e.target.id)
   navigate(`/${e.target.id}`);
  };
  //------------------------------------------------

  return (
    <div>
      {/* <div>
        <img src="/logout.png" className="logout" onClick={handleLogout} />
        <NewNavbar/>
      </div> */}

      <div className="main-layout">
        <Carousel
          fade
          controls={true}
          interval={null}
          className="mainlayout-bulletin"
        >
          <Carousel.Item>
            <Link to={"/mb-attendance"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
            
            <Card className="mainlayout-cards">
              <Card.Body>
                <p className="mainlayout-cards-title">Attendance</p>
                <Card.Subtitle className="mb-3 text-muted">
                  Summary:
                </Card.Subtitle>

                {/* Table-like layout */}
                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead className="thead-light">
                      <tr>
                        <th>
                          <p>Status</p>
                        </th>
                        <th>
                          <p>9th Class</p>
                        </th>
                        <th>
                          <p>10th Class</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p>Students</p>
                        </td>
                        <td>
                          <p>{getClassValue("9", "totalStudents")}</p>
                        </td>
                        <td>
                          <p>{getClassValue("10", "totalStudents")}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Present</p>
                        </td>
                        <td>
                          <p>{getClassValue("9", "present")}</p>
                        </td>
                        <td>
                          <p>{getClassValue("10", "present")}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Absent</p>
                        </td>
                        <td>
                          <p>{getClassValue("9", "absent")}</p>
                        </td>
                        <td>
                          <p>{getClassValue("10", "absent")}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>

             
            </Card>
            </Link>
          </Carousel.Item>

          <Carousel.Item>
            <Link to={"/absent-calling"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
            
            <Card className="mainlayout-cards">
              <Card.Body>
                <p className="mainlayout-cards-title">Callings</p>
                <Card.Subtitle className="mb-3 text-muted">
                  Summary:
                </Card.Subtitle>

                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead className="thead-light">
                      <tr>
                        <th>
                          <p>Status</p>
                        </th>
                        <th>
                          <p>9th Class</p>
                        </th>
                        <th>
                          <p>10th Class</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p>Total Callings</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("9", "totalAbsenteeCallings")}</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("10", "totalAbsenteeCallings")}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Connected</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("9", "connectedCount")}</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("10", "connectedCount")}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Not Connected</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("9", "notConnectedCount")}</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("10", "notConnectedCount")}</p>
                        </td>
                      </tr>
                      {/* <tr>
                        <td>
                          <p>Not Called</p>
                        </td>
                        <td>
                          <p>{getClassValue("9", "notCalledCount")}</p>
                        </td>
                        <td>
                          <p>{getClassValue("10", "notCalledCount")}</p>
                        </td>
                      </tr> */}
                      
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            
            </Card>
            </Link>
          </Carousel.Item>
        </Carousel>


        <div className="mainlayout-other-functionalities">
          {filteredSidbarMenusByRole.map((eachModule, index) => {
            return (
              <div key={index} id={index} style={{ textAlign: "left" }}>
                <h1>{eachModule.label}</h1>
                <hr />
                <div className="sub-app-div" key={index}>
                  {eachModule.main.map((eachApp, index) => {
                    return (
                     <div className="each-app-wrapper">
  <div
    id={eachApp.path}
    onClick={(e)=>handleAppClicks(e)}
    className="each-div"
    style={{
      backgroundImage: `url(${eachApp.logo})`,
      backgroundSize: "cover",
      backgroundPosition: "left",
      backgroundRepeat: "no-repeat",
    
    }}
  ></div>
  <p className="app-label">{eachApp.label}</p>
</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
