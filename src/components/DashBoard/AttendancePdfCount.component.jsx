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
// import { attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// //import logoutLogo from '../../assets/logout.png'; // Replace with correct path
// import { Link } from "react-router-dom";
// import { NewNavbar } from "../../components/Navbar/NewNavbar";

// export const AttendancePdfCount = () => {
//   const { userData } = useContext(UserContext);
//   const [pdfData, setPdfData] = useState([]);

//   const fetchPdfStatusData = async () => {
//     const payload = {
//       schoolIds: userData[0].schoolIds,
//       date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00"
//     };

//     try {
//       const response = await attendancePdfUploadStatusCountByClass(payload);
//       console.log("PDF Upload Data", response.data);

//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
//           if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       // Sort table data by district name
//       sortedData.sort((a, b) => (a.districtName || '').localeCompare(b.districtName || ''));

//       setPdfData(sortedData);
//     } catch (error) {
//       console.log("Error fetching attendance PDF status:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPdfStatusData();
//   }, []);

//   // Summary Counts
//   const summary = {
//     '9': { total: 0, uploaded: 0 },
//     '10': { total: 0, uploaded: 0 }
//   };

//   pdfData.forEach((school) => {
//     school.classes.forEach((cls) => {
//       if (cls.classofStudent === '9' || cls.classofStudent === '10') {
//         summary[cls.classofStudent].total += 1;
//         if (cls.pdfUploadedCount > 0) {
//           summary[cls.classofStudent].uploaded += 1;
//         }
//       }
//     });
//   });

//   return (
//     <Container className="mt-4">
//       {/* Overall Summary */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall PDF Upload Summary</Card.Title>
//           <div>
//             <div>
//               <strong>Class 9 -</strong> Total Classes: {summary['9'].total}, Uploaded: {summary['9'].uploaded}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total Classes: {summary['10'].total}, Uploaded: {summary['10'].uploaded}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       <Card className="shadow-sm">
//         <Card.Body>
//           <Card.Title>Attendance PDF Upload Status</Card.Title>
//           <Table responsive bordered hover>
//             <thead className="table-dark text-center">
//               <tr>
//                 <th>S. No.</th>
//                 <th>District</th>
//                 <th>School</th>
//                 <th>Class</th>
//                 <th>PDF Uploaded (1/0)</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {pdfData.map((school, schoolIndex) =>
//                 school.classes.map((cls, classIndex) => {
//                   const isUploaded = cls.pdfUploadedCount > 0;
//                   const serialNo = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;

//                   return (
//                     <tr
//                       key={`${school.schoolId}-${cls.classofStudent}`}
//                       style={{
//                         backgroundColor: isUploaded ? '#e6ffe6' : '#ffe6e6',
//                       }}
//                     >
//                       <td>{serialNo}</td>
//                       {classIndex === 0 && (
//                         <>
//                         <td rowSpan={school.classes.length} className="align-middle">
//                           {school.districtName}
//                         </td>

                        
//                         <td rowSpan={school.classes.length} className="align-middle">
//                           {school.schoolName}
//                         </td>

                        
//                         </>
                        
//                       )}
//                       <td>{cls.classofStudent}</td>
//                       <td
//                         style={{
//                           backgroundColor: isUploaded ? '#ccffcc' : '#ff9999',
//                           fontWeight: 'bold'
//                         }}
//                       >
//                         {isUploaded ? 1 : 0}
//                       </td>
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

import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Container,
  Card,
  Table,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { UserContext } from "../../components/contextAPIs/User.context";
import { attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";

// CSV Export Utility (Fixed for comma-containing values + date + custom filename)
const exportToCsv = (rows, selectedDate, classFilter) => {
  const csvContent = [
    ["S. No.", "District", "School", "Class", "PDF Uploaded", "Date"], // Added "Date" column
    ...rows.map((r) => [
      r.serial,
      r.district,
      r.school,
      r.class,
      r.pdfUploaded,
      selectedDate, // Date value
    ]),
  ]
    .map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const filename = `attendancePdf_${selectedDate}_${classFilter}.csv`; // Naming convention
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const AttendancePdfCount = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [pdfData, setPdfData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showOnlyNotUploaded, setShowOnlyNotUploaded] = useState(false);

  const fetchPdfStatusData = async () => {
    const payload = {
      schoolIds: userData[0].schoolIds,
      date: selectedDate + "T00:00:00.000+00:00",
    };

    try {
      const response = await attendancePdfUploadStatusCountByClass(payload);
      const sortedData = response.data.map((school) => {
        const sortedClasses = [...school.classes].sort((a, b) => {
          if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
          if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
          return 0;
        });
        return { ...school, classes: sortedClasses };
      });

      sortedData.sort((a, b) =>
        (a.districtName || "").localeCompare(b.districtName || "")
      );

      setPdfData(sortedData);
    } catch (error) {
      console.log("Error fetching attendance PDF status:", error);
    }
  };

  useEffect(() => {
    fetchPdfStatusData();
  }, [selectedDate]);

  const summary = {
    "9": { total: 0, uploaded: 0 },
    "10": { total: 0, uploaded: 0 },
  };

  pdfData.forEach((school) => {
    school.classes.forEach((cls) => {
      if (cls.classofStudent === "9" || cls.classofStudent === "10") {
        summary[cls.classofStudent].total += 1;
        if (cls.pdfUploadedCount > 0) {
          summary[cls.classofStudent].uploaded += 1;
        }
      }
    });
  });

  const flattenedRows = [];
  pdfData.forEach((school, schoolIndex) =>
    school.classes.forEach((cls, classIndex) => {
      const serial =
        school.classes.length > 1
          ? `${schoolIndex + 1}.${classIndex + 1}`
          : `${schoolIndex + 1}`;
      if (!showOnlyNotUploaded || cls.pdfUploadedCount === 0) {
        flattenedRows.push({
          serial,
          district: school.districtName,
          school: school.schoolName,
          class: cls.classofStudent,
          pdfUploaded: cls.pdfUploadedCount > 0 ? 1 : 0,
        });
      }
    })
  );

  return (
    <Container className="mt-4">
      <Card className="mb-3 shadow-sm p-3">
        <Form>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm={2}>
              <strong>Select Date</strong>
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>
            <Col sm={2}>
              <Form.Check
                type="checkbox"
                label="Show only Not Uploaded"
                checked={showOnlyNotUploaded}
                onChange={(e) => setShowOnlyNotUploaded(e.target.checked)}
              />
            </Col>
            <Col sm={2}>
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="All"
                checked={!userData[0].filterClass || userData[0].filterClass === "all"}
                onChange={() => setUserData([{ ...userData[0], filterClass: "all" }])}
              />
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="Class 9"
                checked={userData[0].filterClass === "9"}
                onChange={() => setUserData([{ ...userData[0], filterClass: "9" }])}
              />
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="Class 10"
                checked={userData[0].filterClass === "10"}
                onChange={() => setUserData([{ ...userData[0], filterClass: "10" }])}
              />
            </Col>
            <Col sm={2}>
              <Button
                variant="success"
                onClick={() =>
                  exportToCsv(
                    flattenedRows,
                    selectedDate,
                    userData[0].filterClass || "all"
                  )
                }
              >
                Export to CSV
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Overall PDF Upload Summary</Card.Title>
          <div>
            <div>
              <strong>Class 9 -</strong> Total Classes: {summary["9"].total},
              Uploaded: {summary["9"].uploaded}
            </div>
            <div>
              <strong>Class 10 -</strong> Total Classes: {summary["10"].total},
              Uploaded: {summary["10"].uploaded}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Class 9 Table */}
      {(userData[0].filterClass === "9" || userData[0].filterClass === "all") && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title>Class 9 PDF Upload Status</Card.Title>
            <Table responsive bordered hover>
              <thead className="table-dark text-center">
                <tr>
                  <th>S. No.</th>
                  <th>District</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>PDF Uploaded (1/0)</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {pdfData.map((school, schoolIndex) =>
                  school.classes
                    .filter((cls) => cls.classofStudent === "9")
                    .map((cls, classIndex) => {
                      const isUploaded = cls.pdfUploadedCount > 0;
                      if (showOnlyNotUploaded && isUploaded) return null;
                      const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
                      return (
                        <tr
                          key={`${school.schoolId}-9-${classIndex}`}
                          style={{
                            backgroundColor: isUploaded ? "#e6ffe6" : "#ffe6e6",
                          }}
                        >
                          <td>{serialNo}</td>
                          {classIndex === 0 && (
                            <>
                              <td
                                rowSpan={school.classes.filter(
                                  (c) => c.classofStudent === "9"
                                ).length}
                                className="align-middle"
                              >
                                {school.districtName}
                              </td>
                              <td
                                rowSpan={school.classes.filter(
                                  (c) => c.classofStudent === "9"
                                ).length}
                                className="align-middle"
                              >
                                {school.schoolName}
                              </td>
                            </>
                          )}
                          <td>{cls.classofStudent}</td>
                          <td
                            style={{
                              backgroundColor: isUploaded ? "#ccffcc" : "#ff9999",
                              fontWeight: "bold",
                            }}
                          >
                            {isUploaded ? 1 : 0}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Class 10 Table */}
      {(userData[0].filterClass === "10" || userData[0].filterClass === "all") && (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>Class 10 PDF Upload Status</Card.Title>
            <Table responsive bordered hover>
              <thead className="table-dark text-center">
                <tr>
                  <th>S. No.</th>
                  <th>District</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>PDF Uploaded (1/0)</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {pdfData.map((school, schoolIndex) =>
                  school.classes
                    .filter((cls) => cls.classofStudent === "10")
                    .map((cls, classIndex) => {
                      const isUploaded = cls.pdfUploadedCount > 0;
                      if (showOnlyNotUploaded && isUploaded) return null;
                      const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
                      return (
                        <tr
                          key={`${school.schoolId}-10-${classIndex}`}
                          style={{
                            backgroundColor: isUploaded ? "#e6ffe6" : "#ffe6e6",
                          }}
                        >
                          <td>{serialNo}</td>
                          {classIndex === 0 && (
                            <>
                              <td
                                rowSpan={school.classes.filter(
                                  (c) => c.classofStudent === "10"
                                ).length}
                                className="align-middle"
                              >
                                {school.districtName}
                              </td>
                              <td
                                rowSpan={school.classes.filter(
                                  (c) => c.classofStudent === "10"
                                ).length}
                                className="align-middle"
                              >
                                {school.schoolName}
                              </td>
                            </>
                          )}
                          <td>{cls.classofStudent}</td>
                          <td
                            style={{
                              backgroundColor: isUploaded ? "#ccffcc" : "#ff9999",
                              fontWeight: "bold",
                            }}
                          >
                            {isUploaded ? 1 : 0}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};
