// src/components/UserScreens


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
import { studentAndAttendanceAndAbsenteeCallingCount, attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
//import logoutLogo from '../../assets/logout.png'; // Replace with correct path
import { Link } from "react-router-dom";
import { NewNavbar } from "../../components/Navbar/NewNavbar";

const AdminLayout = () => {

  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const { userData, setUserData } = useContext(UserContext);

  //All hooks
  const [pdfData, setPdfData] = useState([]);

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
      label: "Dashboards",
      logo: "/ccattendance.png",
      module: "TRUE",
      main: [
        {
          id: "1",
          label: "CC-Attendance",
          logo: "/ccattendance.png",
          path: "user-attendance-dashboard",
        },
           
        {
          id: "2",
          label: "Student-Attendance",
          logo: "/studentattendancesummary.png",
          path: "student-attendance-dashboard",
        },
           {
          id: "3",
          label: "Absentee-Calling",
          logo: "/callingsummary.png",
          path: "student-calling-dashboard",
        },

         {
          id: "4",
          label: "Attendance PDF",
          logo: "/studentattendancepdfsummary.png",
          path: "attendance-pdf-count-dashboard",
        },

         {
          id: "5",
          label: "Copy-Checking/Student Disciplinary",
          logo: "/copychecking.png",
          path: "student-disciplinary-dashboard",
        },




      ],
    },

    {
      indexKey: "1",
      label: "Academics",
      logo: "/attendance.png",
      module: "TRUE",
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
        { id: "2", label: "Bills Verification", logo: "/bill-verification.png", path: "verify-bills" },
        { id: "3", label: "Bill Dashboard", logo: "/billdashboard.png", path: "bill-dashboard" },
        // { id: "3", label: "School Issues", logo: "/school.png", path: "school-concerns" },
        { id: "7", label: "School Concerns Request", logo: "/school.png", path: "school-concerns-request" },
        // { id: "4", label: "Tech Issues", logo: "/tech.png", path: "tech-concerns" },
        { id: "5", label: "Tech Solution", logo: "/techSolution.png", path: "tech-concerns-resolution" },
        { id: "6", label: "Leave Requests", logo: "/leave.png", path: "individual-concerns-resolution" },
        { id: "8", label: "Individual Concerns", logo: "/individualconcern.png", path: "self-cocnerns-resolution" },
      
      
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
      module: "TRUE", //TRUE MODULES INSTANTLY GIVE ACCESS TO ANY USERS TO THAT PARTICULAR MODULES
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
      module: "TRUE",
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













  //Attendance pdf count
  
  const fetchPdfStatusData = async () => {
      const payload = {
        schoolIds: userData[0].schoolIds,
        // date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00"

         startDate: startDate,
      endDate: endDate
      };
  
      try {
        const response = await attendancePdfUploadStatusCountByClass(payload);
        console.log("PDF Upload Data", response.data);
  
        const sortedData = response.data.map((school) => {
          const sortedClasses = [...school.classes].sort((a, b) => {
            if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
            if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
            return 0;
          });
          return { ...school, classes: sortedClasses };
        });
  
        setPdfData(sortedData);
      } catch (error) {
        console.log("Error fetching attendance PDF status:", error);
      }
    };
  
    useEffect(() => {
      fetchPdfStatusData();
    }, []);
  
    // Summary Counts
    const summary = {
      '9': { total: 0, uploaded: 0 },
      '10': { total: 0, uploaded: 0 }
    };
  
    pdfData.forEach((school) => {
      school.classes.forEach((cls) => {
        if (cls.classofStudent === '9' || cls.classofStudent === '10') {
          summary[cls.classofStudent].total += 1;
          if (cls.pdfUploadedCount > 0) {
            summary[cls.classofStudent].uploaded += 1;
          }
        }
      });
    });
  
  
    //---------------------------------------------------------------------
  
  
    // Summary Counts for Carousel PDF card
  const getPdfSummary = (classNum, type) => {
    const classSummary = summary[classNum];
    if (!classSummary) return "0";
    if (type === "uploaded") return classSummary.uploaded;
    if (type === "notUploaded") return classSummary.total - classSummary.uploaded;
    if (type === "total") return classSummary.total;
    return "0";
  };
  
  //-------------------------------
  









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
            <Link to={"/student-calling-dashboard"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
            
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
                      <tr>
                        <td>
                          <p>Not Called</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("9", "notCalledCount")}</p>
                        </td>
                        <td>
                          <p>{getCallingSummary("10", "notCalledCount")}</p>
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
            <Link to={"/attendance-pdf-count-dashboard"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
              <Card className="mainlayout-cards">
                <Card.Body>
                  <p className="mainlayout-cards-title">Attendance Pdf</p>
                  <Card.Subtitle className="mb-3 text-muted">Summary:</Card.Subtitle>
          
                  <div className="table-responsive">
                    <table className="table table-bordered text-center">
                      <thead className="thead-light">
                        <tr>
                          <th><p>Status</p></th>
                          <th><p>9th Class</p></th>
                          <th><p>10th Class</p></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><p>Total School</p></td>
                          <td><p>{getPdfSummary("9", "total")}</p></td>
                          <td><p>{getPdfSummary("10", "total")}</p></td>
                        </tr>
                        <tr>
                          <td><p>Uploaded</p></td>
                          <td><p>{getPdfSummary("9", "uploaded")}</p></td>
                          <td><p>{getPdfSummary("10", "uploaded")}</p></td>
                        </tr>
                        <tr>
                          <td><p>Not Uploaded</p></td>
                          <td><p>{getPdfSummary("9", "notUploaded")}</p></td>
                          <td><p>{getPdfSummary("10", "notUploaded")}</p></td>
                        </tr>
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

export default AdminLayout;

