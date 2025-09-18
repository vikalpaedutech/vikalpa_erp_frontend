// //This component will be the main layout for all other users, except for Addmin

// import React, {useState, useEffect, useContext} from "react";
// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
// } from "react-bootstrap";
// import { href, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { MdMenuOpen } from "react-icons/md";
// import { UserAttendance } from "../../components/user/UserAttendance";
// import { studentAndAttendanceAndAbsenteeCallingCount, attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";



// export const UserMainLayout = () =>{

// const navigate = useNavigate();

//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);

//   const handleShow = () => setShow(true);

//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [pdfData, setPdfData] = useState([]);

//   const [studentCount, setStudentCount] = useState([]);


//     const [startDate, setStartDate] = useState(() => {
//         return new Date().toISOString().split("T")[0];
//       });
//       const [endDate, setEndDate] = useState(() => {
//         return new Date().toISOString().split("T")[0];
//       });
  

//   //------------------------------
//   const handleLogout = () => {
//     navigate("/");
//     setTimeout(() => {
//       setUserData([]);
//     }, 1000);
//   };



//   const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: allSchoolIds,
//       classFilters: userData.userAccess.classId,
//       // date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format

//         startDate: startDate,
//       endDate: endDate
//     };

//     try {
//       const response = await studentAndAttendanceAndAbsenteeCallingCount(
//         payload
//       );
//       console.log(response.data);
//       setStudentCount(response.data);
//     } catch (error) {
//       console.log("Error fetching student count");
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, []);


// //User Wise Moudle access




//   const  sideBarMenusByRole = [
//     {
//       indexKey: "1",
//       label: "Dashboards",
//       logo: "/ccattendance.png",
//       module: "TRUE",

//       main: [
//         {
//           id: "1",
//           label: "CC-Attendance",
//           logo: "/ccattendance.png",
//           path: "user-attendance-dashboard",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },

//         {
//           id: "2",
//           label: "Student-Attendance",
//           logo: "/studentattendancesummary.png",
//           path: "student-attendance-dashboard",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },
//         {
//           id: "3",
//           label: "Absentee-Calling",
//           logo: "/callingsummary.png",
//           path: "student-calling-dashboard",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },

//         {
//           id: "4",
//           label: "Attendance PDF",
//           logo: "/studentattendancepdfsummary.png",
//           path: "attendance-pdf-count-dashboard",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },

//         {
//           id: "5",
//           label: "Copy-Checking/Student Disciplinary",
//           logo: "/copychecking.png",
//           path: "student-disciplinary-dashboard",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },
//       ],
//     },

//     {
//       indexKey: "1",
//       label: "Academics",
//       logo: "/attendance.png",
//       module: "TRUE",
//       main: [
//         {
//           id: "1",
//           label: "Attendance",
//           logo: "/attendance.png",
//           path: "mb-attendance",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
//         },
//         {
//           id: "2",
//           label: "Upload Marks",
//           logo: "/exam.png",
//           path: "upload-marks",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
//         },
//         {
//           id: "3",
//           label: "Disciplinary",
//           logo: "/disciplinary.png",
//           path: "student-disciplinary-or-interaction",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
//         },
//         {
//           id: "4",
//           label: "Copy-checking",
//           logo: "/copy-checking.png",
//           path: "copy-checking",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
//         },
//         {
//           id: "5",
//           label: "Manual Attendance",
//           logo: "/upload.png",
//           path: "manual-attendance", // path: "upload-attendance-pdf",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
//         },
//         {
//           id: "6",
//           label: "Gamification Disciplinary",
//           logo: "/gamification.png",
//           path: "gamification-disciplinary", // path: "upload-attendance-pdf",
//           accessedBy: [ 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'Academic Coordinator']
//         },

//         {
//           id: "7",
//           label: "S-100 Attendances",
//           logo: "/gamification.png",
//           path: "s100-attendance", // path: "upload-attendance-pdf",
          
//         },
//       ],
//     },

//     {
//       indexKey: "3",
//       label: "Bills & Issues",
//       logo: "/bills.png",
//       module: "Bills",
//       main: [
//         {
//           id: "1",
//           label: "Upload Bills",
//           logo: "/bills.png",
//           path: "upload-bills",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 
//             'Project Coordinator', 'Admin', 'Tech', 'CC',
//         'DTP', 'Video Grapher', 'Media Manager', 'Editor', 'HR']
//         },
//         {
//           id: "2",
//           label: "Bills Verification",
//           logo: "/bill-verification.png",
//           path: "verify-bills",
//           accessedBy: ['ACI', 'Community Manger',  'Admin', 'Tech']
//         },
//         {
//           id: "3",
//           label: "Bill Dashboard",
//           logo: "/billdashboard.png",
//           path: "bill-dashboard",
//         },
//         // { id: "3", label: "School Issues", logo: "/school.png", path: "school-concerns" },
//         {
//           id: "7",
//           label: "School Concerns Request",
//           logo: "/school.png",
//           path: "school-concerns-request",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },
//         // { id: "4", label: "Tech Issues", logo: "/tech.png", path: "tech-concerns" },
//         {
//           id: "5",
//           label: "Tech Solution",
//           logo: "/techSolution.png",
//           path: "tech-concerns-resolution",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'Technician']
//         },
//         {
//           id: "6",
//           label: "Leave Requests",
//           logo: "/leave.png",
//           path: "individual-concerns-resolution",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },
//         {
//           id: "8",
//           label: "Individual Concerns",
//           logo: "/individualconcern.png",
//           path: "self-cocnerns-resolution",
//           accessedBy: ['Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
//         },
//       ],
//     },
//     {
//       indexKey: "4",
//       label: "Monitoring",
//       logo: "/monitoring.png",
//       module: "Monitoring",
//       main: [
//         {
//           id: "1",
//           label: "Center Disciplinary/Interaction",
//           path: "center-disciplinary-or-interaction",
//           accessedBy: [ 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'Academic Coordinator']
//         },
//       ],
//     },

//     {
//       indexKey: "6",
//       label: "Callings",
//       logo: "/client.png",
//       module: "Callings",
//       main: [
//         {
//           id: "1",
//           label: "Absentee Callings",
//           logo: "/call.png",
//           path: "absent-calling",
//           accessedBy: ['ACI', 'Community Manger', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
//         },
//       ],
//     },

//     //Only for Admin
//     {
//       indexKey: "7",
//       label: "Attendance Controller",
//       module: "TRUE", //TRUE MODULES INSTANTLY GIVE ACCESS TO ANY USERS TO THAT PARTICULAR MODULES
//       main: [
//         {
//           id: "1",
//           label: "Initiate Student Attendance",
//           path: "initiate-student-attendance",
//           accessedBy: ['Admin', 'Tech']
//         },
//         {
//           id: "2",
//           label: "Initiate User Attendance",
//           path: "initiate-user-attendance",
//           accessedBy: ['Admin', 'Tech']
//         },
//         {
//           id: "3",
//           label: "Initiate Upload-attendance-pdf",
//           path: "initiate-upload-attendance-pdf",
//           accessedBy: ['Admin', 'Tech']
//         },
//       ],
//     },

//     {
//       indexKey: "8",
//       label: "Test Controller",
//       module: "TRUE",
//       main: [
//         { id: "1", label: "Create Test", path: "test-controller",
//             accessedBy: ['Admin', 'Tech']
//          },
//         { id: "2", label: "Initiate Test", path: "initiate-test",
//             accessedBy: ['Admin', 'Tech']
//          },
        
//       ],
//     },

//     //-----------------
//   ];


//   const allSidebarRoutes = sideBarMenusByRole.flatMap((section) =>
//     section.main.map((item) => ({
//       label: item.label,
//       path: item.path,
//     }))
//   );

//   // const filteredSidbarMenusByRole = sideBarMenusByRole.filter((item) =>
//   //   userData?.[0]?.accessModules.includes(item.module)
//   // );

// const filteredSidbarMenusByRole = sideBarMenusByRole.filter((item) =>
//   userData?.userAccess?.modules?.some(module => module.name === item.module)
// );



//   const logo = "./";

//   const testArray = ["1", "2", "3", "4", "5", "6"];

//   //Below function is for caraousel cards
// const getClassValue = (classNum, key) => {
//   if (!studentCount || studentCount.length === 0) return "--";

//   let total = 0;

//   studentCount.forEach((school) => {
//     const classData = school.classes.find(
//       (cls) => cls.classofStudent === classNum
//     );
//     if (classData && classData[key] !== undefined) {
//       total += classData[key];
//     }
//   });

//   return total;
// };



// //Calling summary

// const getCallingSummary = (classNum, key) => {
//   if (!studentCount || studentCount.length === 0) return 0;

//   let total = 0;

//   studentCount.forEach((school) => {
//     const classData = school.classes.find(
//       (cls) => cls.classofStudent === classNum
//     );
//     if (classData) {
//       if (key === "totalCallings") {
//         total += (classData.connectedCount || 0) + (classData.notConnectedCount || 0);
//       } else if (key === "notCalled") {
//         const attempted =
//           (classData.connectedCount || 0) + (classData.notConnectedCount || 0);
//         total += (classData.absent || 0) - attempted;
//       } else {
//         total += classData[key] || 0;
//       }
//     }
//   });

//   return total;
// };

// //--------------------------------------





//   const handleClick = () => {
//     alert("hi");
//     navigate("/admin-dash/mb-attendance");
//   };

//   //Handling app squares clicks. So that people can navigate to the sub apps.

//   const handleAppClicks = (e) => {
//     e.preventDefault(); 

//     //alert(e.target.id)
//    navigate(`/${e.target.id}`);
//   };
//   //------------------------------------------------


//   //Attendance pdf count
  
//   const fetchPdfStatusData = async () => {
//       const payload = {
//         schoolIds: allSchoolIds,
//         // date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00"

//          startDate: startDate,
//       endDate: endDate
//       };
  
//       try {
//         const response = await attendancePdfUploadStatusCountByClass(payload);
//         console.log("PDF Upload Data", response.data);
  
//         const sortedData = response.data.map((school) => {
//           const sortedClasses = [...school.classes].sort((a, b) => {
//             if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
//             if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
//             return 0;
//           });
//           return { ...school, classes: sortedClasses };
//         });
  
//         setPdfData(sortedData);
//       } catch (error) {
//         console.log("Error fetching attendance PDF status:", error);
//       }
//     };
  
//     useEffect(() => {
//       fetchPdfStatusData();
//     }, []);
  
//     // Summary Counts
//     const summary = {
//       '9': { total: 0, uploaded: 0 },
//       '10': { total: 0, uploaded: 0 }
//     };
  
//     pdfData.forEach((school) => {
//       school.classes.forEach((cls) => {
//         if (cls.classofStudent === '9' || cls.classofStudent === '10') {
//           summary[cls.classofStudent].total += 1;
//           if (cls.pdfUploadedCount > 0) {
//             summary[cls.classofStudent].uploaded += 1;
//           }
//         }
//       });
//     });
  
  
//     //---------------------------------------------------------------------
  
  
//     // Summary Counts for Carousel PDF card
//   const getPdfSummary = (classNum, type) => {
//     const classSummary = summary[classNum];
//     if (!classSummary) return "0";
//     if (type === "uploaded") return classSummary.uploaded;
//     if (type === "notUploaded") return classSummary.total - classSummary.uploaded;
//     if (type === "total") return classSummary.total;
//     return "0";
//   };
  
//   //-------------------------------
  

//     return(
//         <Container fluid>
//             <h1>Hello User Layout</h1>
//             <h3>cc layout</h3>
//             <h3>aci layout</h3>
//             <h3>community manager layout</h3>
//             <h3>community incharge layout</h3>
//             <h3>project coordinator layout</h3>
//             <h3>academic coordinator layout</h3>
//             <h3>dtp layout</h3>
//             <h3>teacher layout</h3>
//             <h3>technician layout</h3>
//             <h3>tech layout</h3>

//             <hr></hr>




// <div>
//       {/* <div>
//         <img src="/logout.png" className="logout" onClick={handleLogout} />
//         <NewNavbar/>
//       </div> */}

//       <div className="main-layout">
//         <Carousel
//           fade
//           controls={true}
//           interval={null}
//           className="mainlayout-bulletin"
//         >
//           <Carousel.Item>
//             <Link to={"/mb-attendance"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
            
//             <Card className="mainlayout-cards">
//               <Card.Body>
//                 <p className="mainlayout-cards-title">Attendance</p>
//                 <Card.Subtitle className="mb-3 text-muted">
//                   Summary:
//                 </Card.Subtitle>

//                 {/* Table-like layout */}
//                 <div className="table-responsive">
//                   <table className="table table-bordered text-center">
//                     <thead className="thead-light">
//                       <tr>
//                         <th>
//                           <p>Status</p>
//                         </th>
//                         <th>
//                           <p>9th Class</p>
//                         </th>
//                         <th>
//                           <p>10th Class</p>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <p>Students</p>
//                         </td>
//                         <td>
//                           <p>{getClassValue("9", "totalStudents")}</p>
//                         </td>
//                         <td>
//                           <p>{getClassValue("10", "totalStudents")}</p>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <p>Present</p>
//                         </td>
//                         <td>
//                           <p>{getClassValue("9", "present")}</p>
//                         </td>
//                         <td>
//                           <p>{getClassValue("10", "present")}</p>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <p>Absent</p>
//                         </td>
//                         <td>
//                           <p>{getClassValue("9", "absent")}</p>
//                         </td>
//                         <td>
//                           <p>{getClassValue("10", "absent")}</p>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </Card.Body>

             
//             </Card>
//             </Link>
//           </Carousel.Item>

//           <Carousel.Item>
//             <Link to={"/student-calling-dashboard"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
            
//             <Card className="mainlayout-cards">
//               <Card.Body>
//                 <p className="mainlayout-cards-title">Callings</p>
//                 <Card.Subtitle className="mb-3 text-muted">
//                   Summary:
//                 </Card.Subtitle>

//                 <div className="table-responsive">
//                   <table className="table table-bordered text-center">
//                     <thead className="thead-light">
//                       <tr>
//                         <th>
//                           <p>Status</p>
//                         </th>
//                         <th>
//                           <p>9th Class</p>
//                         </th>
//                         <th>
//                           <p>10th Class</p>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <p>Total Callings</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("9", "totalAbsenteeCallings")}</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("10", "totalAbsenteeCallings")}</p>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <p>Connected</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("9", "connectedCount")}</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("10", "connectedCount")}</p>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <p>Not Connected</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("9", "notConnectedCount")}</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("10", "notConnectedCount")}</p>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <p>Not Called</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("9", "notCalledCount")}</p>
//                         </td>
//                         <td>
//                           <p>{getCallingSummary("10", "notCalledCount")}</p>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </Card.Body>
            
//             </Card>
//             </Link>
//           </Carousel.Item>







//           <Carousel.Item>
//             <Link to={"/attendance-pdf-count-dashboard"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
//               <Card className="mainlayout-cards">
//                 <Card.Body>
//                   <p className="mainlayout-cards-title">Attendance Pdf</p>
//                   <Card.Subtitle className="mb-3 text-muted">Summary:</Card.Subtitle>
          
//                   <div className="table-responsive">
//                     <table className="table table-bordered text-center">
//                       <thead className="thead-light">
//                         <tr>
//                           <th><p>Status</p></th>
//                           <th><p>9th Class</p></th>
//                           <th><p>10th Class</p></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td><p>Total School</p></td>
//                           <td><p>{getPdfSummary("9", "total")}</p></td>
//                           <td><p>{getPdfSummary("10", "total")}</p></td>
//                         </tr>
//                         <tr>
//                           <td><p>Uploaded</p></td>
//                           <td><p>{getPdfSummary("9", "uploaded")}</p></td>
//                           <td><p>{getPdfSummary("10", "uploaded")}</p></td>
//                         </tr>
//                         <tr>
//                           <td><p>Not Uploaded</p></td>
//                           <td><p>{getPdfSummary("9", "notUploaded")}</p></td>
//                           <td><p>{getPdfSummary("10", "notUploaded")}</p></td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Link>
//           </Carousel.Item>
//         </Carousel>


//         <div className="mainlayout-other-functionalities">
//           {filteredSidbarMenusByRole.map((eachModule, index) => {
//             return (
//               <div key={index} id={index} style={{ textAlign: "left" }}>
//                 <h1>{eachModule.label}</h1>
//                 <hr />
//                 <div className="sub-app-div" key={index}>
//                   {eachModule.main.map((eachApp, index) => {
//                     return (
//                      <div className="each-app-wrapper">
//   <div
//     id={eachApp.path}
//     onClick={(e)=>handleAppClicks(e)}
//     className="each-div"
//     style={{
//       backgroundImage: `url(${eachApp.logo})`,
//       backgroundSize: "cover",
//       backgroundPosition: "left",
//       backgroundRepeat: "no-repeat",
    
//     }}
//   ></div>
//   <p className="app-label">{eachApp.label}</p>
// </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>

//         </Container>
//     )
// }











//This component will be the main layout for all other users, except for Admin

import React, {useState, useEffect, useContext} from "react";
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
import { Link } from "react-router-dom";
import { NewNavbar } from "../../components/Navbar/NewNavbar";

export const UserMainLayout = () =>{

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



  const regions = userData?.userAccess?.region || [];
const allSchoolIds = regions.flatMap(region =>
  region.blockIds.flatMap(block =>
    block.schoolIds.map(school => school.schoolId)
  )
);

  const fetchStudentRelatedCounts = async () => {
    const payload = {
      schoolIds: allSchoolIds,
      classFilters: userData.userAccess.classId || ['9', '10'],
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


  const  sideBarMenusByRole = [
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
          accessedBy: ['MIS', 'ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
        {
          id: "2",
          label: "Student-Attendance",
          logo: "/studentattendancesummary.png",
          path: "student-attendance-dashboard",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
        {
          id: "3",
          label: "Absentee-Calling",
          logo: "/callingsummary.png",
          path: "student-calling-dashboard",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
        {
          id: "4",
          label: "Attendance PDF",
          logo: "/studentattendancepdfsummary.png",
          path: "attendance-pdf-count-dashboard",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
        {
          id: "5",
          label: "Copy-Checking/Student Disciplinary",
          logo: "/copychecking.png",
          path: "student-disciplinary-dashboard",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
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
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
        },
        {
          id: "2",
          label: "Upload Marks",
          logo: "/exam.png",
          path: "upload-marks",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
        },
        {
          id: "3",
          label: "Disciplinary",
          logo: "/disciplinary.png",
          path: "student-disciplinary-or-interaction",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
        },
        {
          id: "4",
          label: "Copy-checking",
          logo: "/copy-checking.png",
          path: "copy-checking",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
        },
        {
          id: "5",
          label: "Manual Attendance",
          logo: "/upload.png",
          path: "manual-attendance",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
        },
        {
          id: "6",
          label: "Gamification Disciplinary",
          logo: "/gamification.png",
          path: "gamification-disciplinary",
          accessedBy: [ 'MIS','Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'Academic Coordinator']
        },
        {
          id: "7",
          label: "S-100 Attendances",
          logo: "/gamification.png",
          path: "s100-attendance",
          accessedBy: ['MIS','Tech','Admin']
        },
      ],
    },
    {
      indexKey: "3",
      label: "Bills & Issues",
      logo: "/bills.png",
      module: "Bills",
      main: [
        {
          id: "1",
          label: "Upload Bills",
          logo: "/bills.png",
          path: "upload-bills",
          accessedBy: ['Teacher', 'Photographer', 'MIS','ACI', 'Community Manager', 'Community Incharge', 
            'Project Coordinator', 'Admin', 'Tech', 'CC',
        'DTP', 'Video Grapher', 'Media Manager', 'Editor', 'HR', 'Technician']
        },
        { id: "3", label: "School Issues", logo: "/school.png", path: "school-concerns",
            accessedBy: ['MIS','CC']
         },
         { id: "4", label: "Tech Issues", logo: "/tech.png", path: "tech-concerns",
             accessedBy: ['MIS','CC']
          },
        {
          id: "2",
          label: "Bills Verification",
          logo: "/bill-verification.png",
          path: "bills-pending-verification",
          accessedBy: ['MIS','ACI', 'Community Manager',  'Admin', 'Tech']
        },
        {
          id: "3",
          label: "Bill Dashboard",
          logo: "/billdashboard.png",
          path: "bill-dashboard",
          accessedBy: ['MIS','Admin','Tech','Community Manager', "Accountant"]
        },
        {
          id: "7",
          label: "School Concerns Request",
          logo: "/school.png",
          path: "school-concerns-request",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
        {
          id: "5",
          label: "Tech Solution",
          logo: "/techSolution.png",
          path: "tech-concerns-resolution",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'Technician']
        },
        {
          id: "6",
          label: "Leave Requests",
          logo: "/leave.png",
          path: "individual-concerns-resolution",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
        {
          id: "8",
          label: "Individual Concerns",
          logo: "/individualconcern.png",
          path: "self-cocnerns-resolution",
          accessedBy: ['MIS','Community Incharge', 'Project Coordinator', 'Admin', 'Tech']
        },
      ],
    },
    {
      indexKey: "4",
      label: "Monitoring",
      logo: "/monitoring.png",
      module: "TRUE",
      main: [
        {
          id: "1",
          label: "Center Disciplinary/Interaction",
          path: "center-disciplinary-or-interaction",
          accessedBy: [ 'MIS','Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'Academic Coordinator']
        },
      ],
    },
    {
      indexKey: "6",
      label: "Callings",
      logo: "/client.png",
      module: "Callings",
      main: [
        {
          id: "1",
          label: "Absentee Callings",
          logo: "/call.png",
          path: "absent-calling",
          accessedBy: ['MIS','ACI', 'Community Manager', 'Community Incharge', 'Project Coordinator', 'Admin', 'Tech', 'CC']
        },
      ],
    },

    // Below are for admin only
    {
      indexKey: "7",
      label: "Attendance Controller",
      module: "TRUE",
      main: [
        {
          id: "1",
          label: "Initiate Student Attendance",
          path: "initiate-student-attendance",
          accessedBy: ['MIS','Admin', 'Tech']
        },
        {
          id: "2",
          label: "Initiate User Attendance",
          path: "initiate-user-attendance",
          accessedBy: ['MIS','Admin', 'Tech']
        },
        {
          id: "3",
          label: "Initiate Upload-attendance-pdf",
          path: "initiate-upload-attendance-pdf",
          accessedBy: ['MIS','Admin', 'Tech']
        },
      ],
    },
    {
      indexKey: "8",
      label: "Test Controller",
      module: "TRUE",
      main: [
        { id: "1", label: "Create Test", path: "test-controller",
            accessedBy: ['MIS','Admin', 'Tech']
         },
        { id: "2", label: "Initiate Test", path: "initiate-test",
            accessedBy: ['MIS','Admin', 'Tech']
         },
      ],
    },
    {
      indexKey: "9",
      label: "User Controller",
      module: "TRUE",
      main: [
        { id: "1", label: "Create User", path: "create-user",
            accessedBy: ['MIS','Admin', 'Tech']
         },
       
      ],
    },
  ];

  const filteredSidbarMenusByRole = sideBarMenusByRole.filter((item) =>
    userData?.userAccess?.modules?.some(module => module.name === item.module)
  );

  const logo = "./";

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

  const handleAppClicks = (e) => {
    e.preventDefault(); 
    navigate(`/${e.target.id}`);
  };

  const fetchPdfStatusData = async () => {
      const payload = {
        schoolIds: allSchoolIds,
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
  
    const getPdfSummary = (classNum, type) => {
      const classSummary = summary[classNum];
      if (!classSummary) return "0";
      if (type === "uploaded") return classSummary.uploaded;
      if (type === "notUploaded") return classSummary.total - classSummary.uploaded;
      if (type === "total") return classSummary.total;
      return "0";
    };
  
    return(
        <Container fluid>
            {/* <h1>Hello User Layout</h1>
            <h3>cc layout</h3>
            <h3>aci layout</h3>
            <h3>community manager layout</h3>
            <h3>community incharge layout</h3>
            <h3>project coordinator layout</h3>
            <h3>academic coordinator layout</h3>
            <h3>dtp layout</h3>
            <h3>teacher layout</h3>
            <h3>technician layout</h3>
            <h3>tech layout</h3> */}

            <hr></hr>

<div>
      <div className="main-layout">
        {["ACI", "CC", "Project Coordinator", "MIS", "Community Incharge", "Admin", "Community Manager"].includes(userData?.role) && (
  <Carousel
    fade
    controls={true}
    interval={null}
    className="mainlayout-bulletin"
  >
    {/* attendance card */}
    <Carousel.Item>
      <Link to={"/mb-attendance"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
        <Card className="mainlayout-cards">
          <Card.Body>
            <p className="mainlayout-cards-title">Attendance</p>
            <Card.Subtitle className="mb-3 text-muted">
              Summary:
            </Card.Subtitle>
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
                    <td><p>Students</p></td>
                    <td><p>{getClassValue("9", "totalStudents")}</p></td>
                    <td><p>{getClassValue("10", "totalStudents")}</p></td>
                  </tr>
                  <tr>
                    <td><p>Present</p></td>
                    <td><p>{getClassValue("9", "present")}</p></td>
                    <td><p>{getClassValue("10", "present")}</p></td>
                  </tr>
                  <tr>
                    <td><p>Absent</p></td>
                    <td><p>{getClassValue("9", "absent")}</p></td>
                    <td><p>{getClassValue("10", "absent")}</p></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </Carousel.Item>

    {/* calling card */}
    <Carousel.Item>
      <Link to={"/student-calling-dashboard"} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
        <Card className="mainlayout-cards">
          <Card.Body>
            <p className="mainlayout-cards-title">Callings</p>
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
                    <td><p>Total Callings</p></td>
                    <td><p>{getCallingSummary("9", "totalAbsenteeCallings")}</p></td>
                    <td><p>{getCallingSummary("10", "totalAbsenteeCallings")}</p></td>
                  </tr>
                  <tr>
                    <td><p>Connected</p></td>
                    <td><p>{getCallingSummary("9", "connectedCount")}</p></td>
                    <td><p>{getCallingSummary("10", "connectedCount")}</p></td>
                  </tr>
                  <tr>
                    <td><p>Not Connected</p></td>
                    <td><p>{getCallingSummary("9", "notConnectedCount")}</p></td>
                    <td><p>{getCallingSummary("10", "notConnectedCount")}</p></td>
                  </tr>
                  <tr>
                    <td><p>Not Called</p></td>
                    <td><p>{getCallingSummary("9", "notCalledCount")}</p></td>
                    <td><p>{getCallingSummary("10", "notCalledCount")}</p></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </Carousel.Item>

    {/* pdf card */}
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
)}


        <div className="mainlayout-other-functionalities">
  {filteredSidbarMenusByRole.map((eachModule, index) => {
    // Filter apps inside each module by role
    const accessibleApps = eachModule.main.filter(
      (eachApp) =>
        !eachApp.accessedBy || eachApp.accessedBy.includes(userData?.role)
    );

    // If no accessible apps, skip rendering this module
    if (accessibleApps.length === 0) {
      return null;
    }

    return (
      <div key={index} id={index} style={{ textAlign: "left" }}>
        <h1>{eachModule.label}</h1>
        <hr />
        <div className="sub-app-div" key={index}>
          {accessibleApps.map((eachApp, idx) => (
            <div className="each-app-wrapper" key={idx}>
              <div
                id={eachApp.path}
                onClick={(e) => handleAppClicks(e)}
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
          ))}
        </div>
      </div>
    );
  })}
</div>

      </div>
    </div>

        </Container>
    )
}
