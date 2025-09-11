// // // /FRONTEND/src/components/DashBoard


// // /FRONTEND/src/components/DashBoard

// import React, { useEffect, useState, useContext } from "react";
// import {
//   Button,
//   Container,
//   Card,
//   Table,
//   Form,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { UserContext } from "../../components/contextAPIs/User.context";
// import { attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";


// // CSV Export Utility (Fixed for comma-containing values + date + custom filename)
// const exportToCsv = (rows, selectedDate, classFilter) => {
//   const csvContent = [
//     ["S. No.", "District", "School", "Class", "PDF Uploaded", "Date"], // Added "Date" column
//     ...rows.map((r) => [
//       r.serial,
//       r.district,
//       r.school,
//       r.class,
//       r.pdfUploaded,
//       r.date, // Each row now contains its specific date
//     ]),
//   ]
//     .map((row) =>
//       row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
//     )
//     .join("\n");

//   const filename = `attendancePdf_${selectedDate}_${classFilter}.csv`; // Naming convention
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const AttendancePdfCount = () => {
//   const { userData, setUserData } = useContext(UserContext);
//   const [pdfData, setPdfData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [startDate, setStartDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });
//   const [endDate, setEndDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [showOnlyNotUploaded, setShowOnlyNotUploaded] = useState(false);

//   //--------------------------------------------------------------------------

// const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

// const allDistrictIds = regions.flatMap(region => 
//   region.districtId
// )

// console.log(allDistrictIds)

// //------------------------------------------------------------------------



//   const fetchPdfStatusData = async () => {
//     const payload = {
//       schoolIds: allSchoolIds,
//       startDate: startDate,
//       endDate: endDate,
//     };

//     try {
//       const response = await attendancePdfUploadStatusCountByClass(payload);
//       const sortedData = response.data.map((school) => {
//         const sortedClasses = [...school.classes].sort((a, b) => {
//           if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
//           if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
//           return 0;
//         });
//         return { ...school, classes: sortedClasses };
//       });

//       sortedData.sort((a, b) =>
//         (a.districtName || "").localeCompare(b.districtName || "")
//       );

//       setPdfData(sortedData);
//     } catch (error) {
//       console.log("Error fetching attendance PDF status:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPdfStatusData();
//   }, [selectedDate, startDate, endDate]);

//   const summary = {
//     "9": { total: 0, uploaded: 0 },
//     "10": { total: 0, uploaded: 0 },
//   };

//   pdfData.forEach((school) => {
//     school.classes.forEach((cls) => {
//       if (cls.classofStudent == "9" || cls.classofStudent == "10") {
//         summary[cls.classofStudent].total += 1;
//         if (cls.pdfUploadedCount > 0) {
//           summary[cls.classofStudent].uploaded += 1;
//         }
//       }
//     });
//   });

//   const flattenedRows = [];
//   pdfData.forEach((school, schoolIndex) =>
//     school.classes.forEach((cls, classIndex) => {
//       const serial =
//         school.classes.length > 1
//           ? `${schoolIndex + 1}.${classIndex + 1}`
//           : `${schoolIndex + 1}`;
//       if (!showOnlyNotUploaded || cls.pdfUploadedCount === 0) {
//         flattenedRows.push({
//           serial,
//           district: school.districtName,
//           school: school.schoolName,
//           class: cls.classofStudent,
//           pdfUploaded: cls.pdfUploadedCount > 0 ? 1 : 0,
//           date: new Date(school.date).toLocaleDateString("en-GB"),
//         });
//       }
//     })
//   );

//   return (
//     <Container className="mt-4">
//       <Card className="mb-3 shadow-sm p-3">
//         <Form>
//           <Form.Group as={Row} className="align-items-center">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>📅 Start Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>📅 End Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col sm={2}>
//               <Form.Check
//                 type="checkbox"
//                 label="Show only Not Uploaded"
//                 checked={showOnlyNotUploaded}
//                 onChange={(e) => setShowOnlyNotUploaded(e.target.checked)}
//               />
//             </Col>
//             <Col sm={2}>
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="All"
//                 checked={
//                   !userData.filterClass || userData.filterClass === "all"
//                 }
//                 onChange={() =>
//                   setUserData([{ ...userData, filterClass: "all" }])
//                 }
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 9"
//                 checked={userData.filterClass === "9"}
//                 onChange={() =>
//                   setUserData([{ ...userData, filterClass: "9" }])
//                 }
//               />
//               <Form.Check
//                 inline
//                 type="radio"
//                 name="classFilter"
//                 label="Class 10"
//                 checked={userData.filterClass === "10"}
//                 onChange={() =>
//                   setUserData([{ ...userData, filterClass: "10" }])
//                 }
//               />
//             </Col>
//             <Col sm={2}>
//               <Button
//                 variant="success"
//                 onClick={() =>
//                   exportToCsv(
//                     flattenedRows,
//                     selectedDate,
//                     userData.filterClass || "all"
//                   )
//                 }
//               >
//                 Export to CSV
//               </Button>
//             </Col>
//           </Form.Group>
//         </Form>
//       </Card>

//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <Card.Title>Overall PDF Upload Summary</Card.Title>
//           <div>
//             <div>
//               <strong>Class 9 -</strong> Total Classes: {summary["9"].total},
//               Uploaded: {summary["9"].uploaded}
//             </div>
//             <div>
//               <strong>Class 10 -</strong> Total Classes: {summary["10"].total},
//               Uploaded: {summary["10"].uploaded}
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Class 9 Table */}
//       {(userData.filterClass === "9" ||
//         userData.filterClass === "all" ||
//         !userData.filterClass) && (
//         <Card className="shadow-sm mb-4">
//           <Card.Body>
//             <Card.Title>Class 9 PDF Upload Status</Card.Title>
//             <Table responsive bordered hover>
//               <thead className="table-dark text-center">
//                 <tr>
//                   <th>S. No.</th>
//                   <th>District</th>
//                   <th>School</th>
//                   <th>Class</th>
//                   <th>PDF Uploaded (1/0)</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody className="text-center">
//                 {pdfData.map((school, schoolIndex) =>
//                   school.classes
//                     .filter((cls) => cls.classofStudent == "9")
//                     .map((cls, classIndex) => {
//                       const isUploaded = cls.pdfUploadedCount > 0;
//                       if (showOnlyNotUploaded && isUploaded) return null;
//                       const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                       return (
//                         <tr
//                           key={`${school.schoolId}-9-${classIndex}`}
//                           style={{
//                             backgroundColor: isUploaded
//                               ? "#e6ffe6"
//                               : "#ffe6e6",
//                           }}
//                         >
//                           <td>{serialNo}</td>
//                           {classIndex === 0 && (
//                             <>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "9"
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.districtName}
//                               </td>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "9"
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.schoolName}
//                               </td>
//                             </>
//                           )}
//                           <td>{cls.classofStudent}</td>
//                           <td
//                             style={{
//                               backgroundColor: isUploaded
//                                 ? "#ccffcc"
//                                 : "#ff9999",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {isUploaded ? 1 : 0}
//                           </td>
//                           <td>{new Date(school.date).toLocaleDateString("en-GB")}</td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Class 10 Table */}
//       {(userData.filterClass === "10" ||
//         userData.filterClass === "all" ||
//         !userData.filterClass) && (
//         <Card className="shadow-sm">
//           <Card.Body>
//             <Card.Title>Class 10 PDF Upload Status</Card.Title>
//             <Table responsive bordered hover>
//               <thead className="table-dark text-center">
//                 <tr>
//                   <th>S. No.</th>
//                   <th>District</th>
//                   <th>School</th>
//                   <th>Class</th>
//                   <th>PDF Uploaded (1/0)</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody className="text-center">
//                 {pdfData.map((school, schoolIndex) =>
//                   school.classes
//                     .filter((cls) => cls.classofStudent == "10")
//                     .map((cls, classIndex) => {
//                       const isUploaded = cls.pdfUploadedCount > 0;
//                       if (showOnlyNotUploaded && isUploaded) return null;
//                       const serialNo = `${schoolIndex + 1}.${classIndex + 1}`;
//                       return (
//                         <tr
//                           key={`${school.schoolId}-10-${classIndex}`}
//                           style={{
//                             backgroundColor: isUploaded
//                               ? "#e6ffe6"
//                               : "#ffe6e6",
//                           }}
//                         >
//                           <td>{serialNo}</td>
//                           {classIndex === 0 && (
//                             <>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "10"
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.districtName}
//                               </td>
//                               <td
//                                 rowSpan={school.classes.filter(
//                                   (c) => c.classofStudent == "10"
//                                 ).length}
//                                 className="align-middle"
//                               >
//                                 {school.schoolName}
//                               </td>
//                             </>
//                           )}
//                           <td>{cls.classofStudent}</td>
//                           <td
//                             style={{
//                               backgroundColor: isUploaded
//                                 ? "#ccffcc"
//                                 : "#ff9999",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {isUploaded ? 1 : 0}
//                           </td>
//                           <td>{new Date(school.date).toLocaleDateString("en-GB")}</td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };

















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
import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";

const exportToCsv = (rows, selectedDate, classFilter) => {
  const csvContent = [
    ["S. No.", "District", "School", "Class", "PDF Uploaded", "Date"],
    ...rows.map((r) => [
      r.serial,
      r.district,
      r.school,
      r.class,
      r.pdfUploaded,
      r.date,
    ]),
  ]
    .map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const filename = `attendancePdf_${selectedDate}_${classFilter}.csv`;
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

  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [showOnlyNotUploaded, setShowOnlyNotUploaded] = useState(false);

  const regions = userData?.userAccess?.region || [];
  const allSchoolIds = regions.flatMap(region =>
    region.blockIds.flatMap(block =>
      block.schoolIds.map(school => school.schoolId)
    )
  );

  const allDistrictIds = regions.map(region => region.districtId);
  console.log(allDistrictIds);

  const fetchPdfStatusData = async () => {
    const payload = {
      schoolIds: allSchoolIds,
      startDate: startDate,
      endDate: endDate,
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
  }, [selectedDate, startDate, endDate]);

  const summary = { "9": { total: 0, uploaded: 0 }, "10": { total: 0, uploaded: 0 } };

  pdfData.forEach((school) => {
    school.classes.forEach((cls) => {
      if (cls.classofStudent == "9" || cls.classofStudent == "10") {
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
      // Apply class filter
      if (
        (!userData.filterClass || userData.filterClass === "all" || cls.classofStudent === userData.filterClass) &&
        (!showOnlyNotUploaded || cls.pdfUploadedCount === 0)
      ) {
        flattenedRows.push({
          serial,
          district: school.districtName,
          school: school.schoolName,
          class: cls.classofStudent,
          pdfUploaded: cls.pdfUploadedCount > 0 ? 1 : 0,
          date: new Date(school.date).toLocaleDateString("en-GB"),
        });
      }
    })
  );

  const handleClassFilterChange = (filter) => {
    setUserData({ ...userData, filterClass: filter });
  };

  return (
    <Container className="mt-4">
      <Card className="mb-3 shadow-sm p-3">
        <Form>
          <Form.Group as={Row} className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label>📅 Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>📅 End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
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
                checked={!userData.filterClass || userData.filterClass === "all"}
                onChange={() => handleClassFilterChange("all")}
              />
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="Class 9"
                checked={userData.filterClass === "9"}
                onChange={() => handleClassFilterChange("9")}
              />
              <Form.Check
                inline
                type="radio"
                name="classFilter"
                label="Class 10"
                checked={userData.filterClass === "10"}
                onChange={() => handleClassFilterChange("10")}
              />
            </Col>
            <Col sm={2}>
              <Button
                variant="success"
                onClick={() =>
                  exportToCsv(
                    flattenedRows,
                    selectedDate,
                    userData.filterClass || "all"
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
      {(userData.filterClass === "9" ||
        userData.filterClass === "all" ||
        !userData.filterClass) && (
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
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {pdfData.map((school, schoolIndex) =>
                  school.classes
                    .filter((cls) => cls.classofStudent == "9")
                    .filter((cls) => !showOnlyNotUploaded || cls.pdfUploadedCount === 0)
                    .map((cls, classIndex) => {
                      const isUploaded = cls.pdfUploadedCount > 0;
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
                                  (c) => c.classofStudent == "9" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
                                ).length}
                                className="align-middle"
                              >
                                {school.districtName}
                              </td>
                              <td
                                rowSpan={school.classes.filter(
                                  (c) => c.classofStudent == "9" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
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
                          <td>{new Date(school.date).toLocaleDateString("en-GB")}</td>
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
      {(userData.filterClass === "10" ||
        userData.filterClass === "all" ||
        !userData.filterClass) && (
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
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {pdfData.map((school, schoolIndex) =>
                  school.classes
                    .filter((cls) => cls.classofStudent == "10")
                    .filter((cls) => !showOnlyNotUploaded || cls.pdfUploadedCount === 0)
                    .map((cls, classIndex) => {
                      const isUploaded = cls.pdfUploadedCount > 0;
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
                                  (c) => c.classofStudent == "10" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
                                ).length}
                                className="align-middle"
                              >
                                {school.districtName}
                              </td>
                              <td
                                rowSpan={school.classes.filter(
                                  (c) => c.classofStudent == "10" && (!showOnlyNotUploaded || c.pdfUploadedCount === 0)
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
                          <td>{new Date(school.date).toLocaleDateString("en-GB")}</td>
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
