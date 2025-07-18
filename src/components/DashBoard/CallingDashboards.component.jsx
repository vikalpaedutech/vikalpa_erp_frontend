// // /FRONTEND/src/components/DashBoard

// import React, {useEffect, useState, useContext} from 'react';

// import {
//   ListGroup,
//   Accordion,
//   Offcanvas,
//   Button,
//   Container,
//   Navbar,
//   Card,
//   Carousel,
//   Table,
// } from "react-bootstrap";
// import { href, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { MdMenuOpen } from "react-icons/md";
// import { UserAttendance } from "../../components/user/UserAttendance";
// import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";


// export const StudentCallingDashBoard = () => {

//   //Context hooks
//   const { userData, setUserData } = useContext(UserContext);

//   //All hooks
//   const [studentCount, setStudentCount] = useState([]);

//   const fetchStudentRelatedCounts = async () => {
//     const payload = {
//       schoolIds: userData[0].schoolIds,
//       classFilters: userData[0].classId || ['9', '10'],
//       date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format
//     };

//     try {
//       const response = await studentAndAttendanceAndAbsenteeCallingCount(payload);
//       console.log(response.data);

//       // Sorting logic: present === 0 should come first
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.present === 0 && b.present !== 0) return -1;
//           if (a.present !== 0 && b.present === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       // Sort by districtName
//       sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));

//       setStudentCount(sortedData);
//     } catch (error) {
//       console.log("Error fetching student count");
//     }
//   };

//   useEffect(() => {
//     fetchStudentRelatedCounts();
//   }, []);

//   // Summary by class
//   const classSummary = {
//     '9': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 },
//     '10': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 }
//   };

//   studentCount.forEach((school) => {
//     school.classes.forEach((cls) => {
//       const key = cls.classofStudent;
//       if (classSummary[key]) {
//         classSummary[key].totalStudents += cls.totalStudents;
//         classSummary[key].present += cls.present;
//         classSummary[key].absent += cls.absent;
//         classSummary[key].connectedCount += cls.connectedCount || 0;
//         classSummary[key].notConnectedCount += cls.notConnectedCount || 0;
//       }
//     });
//   });

//   return (
//     <Container className="mt-4">
//       {/* Summary Card */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall Summary</Card.Title>
//           <div >
//             <div>
//               <strong>Class 9 -</strong> Total: {classSummary['9'].totalStudents}, Connected: {classSummary['9'].connectedCount}, NotConnected: {classSummary['9'].notConnectedCount}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total: {classSummary['10'].totalStudents}, Connected: {classSummary['10'].connectedCount}, Absent: {classSummary['10'].notConnectedCount}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Attendance Table */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Calling Dashboard</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                   <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 {/* <th>Total</th> */}
//                 <th>Connected</th>
//                 <th>NotConnected</th>
//                 <th>Not Called</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {studentCount.map((school, schoolIndex) =>
//                 school.classes.map((cls, classIndex) => {
//                   const allAbsent = cls.present === 0 && cls.totalStudents > 0;
//                   const serialNo = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
//                   return (
//                     <tr
//                       key={`${school.schoolId}-${cls.classofStudent}`}
//                       style={{
//                         backgroundColor: allAbsent ? '#ffcccc' : 'transparent',
//                       }}
//                     >
                      
//                       <td>{serialNo}</td>
                       
//                       {classIndex === 0 && (

//                         <>
                        
//                           <td rowSpan={school.classes.length} className="align-middle">
//                             {school.districtName}
//                           </td>

//                           <td rowSpan={school.classes.length} className="align-middle">
//                           {school.schoolName}
//                         </td>
                        
//                         </>
                        
                        
//                       )}
//                       <td>{cls.classofStudent}</td>
//                       {/* <td>{cls.totalStudents}</td> */}
//                       <td
//                         style={{
//                           backgroundColor: cls.present === 0 ? '#ff9999' : 'inherit',
//                           fontWeight: cls.present === 0 ? 'bold' : 'normal',
//                         }}
//                       >
//                         {cls.connectedCount}
//                       </td>
//                       <td>{cls.notConnectedCount}</td>
//                       <td>{cls.notCalledCount}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };






























// /FRONTEND/src/components/DashBoard

import React, {useEffect, useState, useContext} from 'react';

import {
  ListGroup,
  Accordion,
  Offcanvas,
  Button,
  Container,
  Navbar,
  Card,
  Carousel,
  Table,
} from "react-bootstrap";
import { href, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";
import { MdMenuOpen } from "react-icons/md";
import { UserAttendance } from "../../components/user/UserAttendance";
import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services";
//import logoutLogo from '../../assets/logout.png'; // Replace with correct path
import { Link } from "react-router-dom";
import { NewNavbar } from "../../components/Navbar/NewNavbar";

export const StudentCallingDashBoard = () => {

  //Context hooks
  const { userData, setUserData } = useContext(UserContext);

  //All hooks
  const [studentCount, setStudentCount] = useState([]);

   const [startDate, setStartDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
      });
      const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
      });






  const fetchStudentRelatedCounts = async () => {
    const payload = {
      schoolIds: userData[0].schoolIds,
      classFilters: userData[0].classId || ['9', '10'],
      
      // date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format

         startDate: startDate,
      endDate: endDate
    };

    try {
      const response = await studentAndAttendanceAndAbsenteeCallingCount(payload);
      console.log(response.data);

      // Sorting logic: present === 0 should come first
      const sortedData = response.data.map((school) => {
        const sortedClasses = [...school.classes].sort((a, b) => {
          if (a.present === 0 && b.present !== 0) return -1;
          if (a.present !== 0 && b.present === 0) return 1;
          return 0;
        });
        return { ...school, classes: sortedClasses };
      });

      // Sort by districtName
      sortedData.sort((a, b) => a.districtName.localeCompare(b.districtName));

      setStudentCount(sortedData);
    } catch (error) {
      console.log("Error fetching student count");
    }
  };

  useEffect(() => {
    fetchStudentRelatedCounts();
  }, []);

  // Summary by class
  const classSummary = {
    '9': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 },
    '10': { totalStudents: 0, present: 0, absent: 0, connectedCount: 0, notConnectedCount: 0 }
  };

  studentCount.forEach((school) => {
    school.classes.forEach((cls) => {
      const key = cls.classofStudent;
      if (classSummary[key]) {
        classSummary[key].totalStudents += cls.totalStudents;
        classSummary[key].present += cls.present;
        classSummary[key].absent += cls.absent;
        classSummary[key].connectedCount += cls.connectedCount || 0;
        classSummary[key].notConnectedCount += cls.notConnectedCount || 0;
      }
    });
  });

  return (
    <Container className="mt-4">
      {/* Summary Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Overall Summary</Card.Title>
          <div >
            <div>
              <strong>Class 9 -</strong> Total: {classSummary['9'].absent}, Connected: {classSummary['9'].connectedCount}, NotConnected: {classSummary['9'].notConnectedCount}
            </div>
            <div>
              <strong>Class 10 -</strong> Total: {classSummary['10'].absent}, Connected: {classSummary['10'].connectedCount}, Absent: {classSummary['10'].notConnectedCount}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Attendance Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Calling Dashboard</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>S. No.</th>
                <th>District</th>
                <th>School</th>
                <th>Class</th>
                <th>Absent</th>
                <th>Connected</th>
                <th>NotConnected</th>
                <th>Not Called</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {studentCount.map((school, schoolIndex) =>
                school.classes.map((cls, classIndex) => {
                  const allAbsent = cls.present === 0 && cls.totalStudents > 0;
                  const serialNo = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;
                  return (
                    <tr
                      key={`${school.schoolId}-${cls.classofStudent}`}
                      style={{
                        backgroundColor: allAbsent ? '#ffcccc' : 'transparent',
                      }}
                    >
                      <td>{serialNo}</td>
                      {classIndex === 0 && (
                        <>
                          <td rowSpan={school.classes.length} className="align-middle">
                            {school.districtName}
                          </td>
                          <td rowSpan={school.classes.length} className="align-middle">
                            {school.schoolName}
                          </td>
                        </>
                      )}
                      <td>{cls.classofStudent}</td>
                      <td>{cls.absent}</td>
                      <td
                        style={{
                          backgroundColor: cls.connectedCount === 0 ? '#ff9999' : '#ccffcc',
                          fontWeight: 'bold',
                        }}
                      >
                        {cls.connectedCount}
                      </td>
                      <td
                        style={{
                          backgroundColor: cls.notConnectedCount === 0 ? '#ff9999' : '#ccffcc',
                          fontWeight: 'bold',
                        }}
                      >
                        {cls.notConnectedCount}
                      </td>
                      <td>{cls.notCalledCount}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};
