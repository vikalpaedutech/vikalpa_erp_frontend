// import React, { useState, useContext } from "react";
// import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

// import { School_drop_down, Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

// import { GetMBStudents } from "../../service/Student.service";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const AttendanceSheetFormat = () => {
//   const { userData } = useContext(UserContext);

//   const { schoolContext, batchContext } = useContext(
//     DistrictBlockSschoolContextV2
//   );

//   const { startDate } = useContext(DateNDateRangeContext);

//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [error, setError] = useState("");

//   // =========================================
//   // FETCH STUDENTS
//   // =========================================
//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const reqBody = {
//         schoolId: schoolContext?.schoolId,
//         batch: batchContext?.batch,
//         startDate,
//       };

//       const response = await GetMBStudents(reqBody);

//       setStudents(response?.data || []);

//       generatePDF(response?.data || []);
//     } catch (err) {
//       console.log(err);
//       setError("Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================
//   // GENERATE PDF
//   // =========================================
//  const generatePDF = (studentData) => {
//   if (!studentData || studentData.length === 0) {
//     alert("No students found");
//     return;
//   }

//   const doc = new jsPDF("p", "mm", "a4");

//   // =====================================================
//   // HEADER
//   // =====================================================

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(17);

//   doc.text(
//     schoolContext?.schoolName || "SCHOOL NAME",
//     105,
//     12,
//     { align: "center" }
//   );

//   doc.setFontSize(11);
//   doc.text("ATTENDANCE SHEET", 105, 18, {
//     align: "center",
//   });

//   // Batch
//   doc.setFontSize(10);
//   doc.text(`Batch : ${batchContext?.batch || "N/A"}`, 105, 24, {
//     align: "center",
//   });

//   // =====================================================
//   // TOP DETAILS
//   // =====================================================

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);

//   doc.text(
//     "Center In-charge Name __________________________",
//     14,
//     34
//   );

//   doc.text(`Date : ${startDate || ""}`, 155, 34);

//   doc.text("Role ____________________", 14, 41);

//   doc.text(
//     "Lecture Number & Subject ____________________",
//     105,
//     41
//   );

//   doc.text("Remarks (if any) ____________________", 14, 48);

//   // =====================================================
//   // SUMMARY
//   // =====================================================

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(10);

//   doc.text("ATTENDANCE SUMMARY", 14, 58);

//   autoTable(doc, {
//     startY: 61,

//     head: [["Total Students", "Total Present", "Total Absent"]],

//     body: [[studentData.length, "", ""]],

//     theme: "grid",

//     styles: {
//       fontSize: 8,
//       cellPadding: 1.5,
//       halign: "center",
//       valign: "middle",
//       lineWidth: 0.2,
//       textColor: [0, 0, 0],
//     },

//     headStyles: {
//       fillColor: [255, 255, 255],
//       textColor: [0, 0, 0],
//       fontStyle: "bold",
//     },

//     margin: {
//       left: 14,
//       right: 14,
//     },
//   });

//   // =====================================================
//   // SIGNATURE SECTION
//   // =====================================================

//   let finalY = doc.lastAutoTable.finalY + 6;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);

//   doc.text("Signature: ____________________", 14, finalY);

//   finalY += 10;

//   doc.text("Centre-Incharge Signature:", 14, finalY);

//   finalY += 7;

//   doc.text("Name ________________________________", 14, finalY);

//   finalY += 7;

//   doc.text("Date _________________________________", 14, finalY);

//   // =====================================================
//   // STUDENT TABLE
//   // =====================================================

//   finalY += 8;

//   const tableBody = studentData.map((student, index) => [
//     index + 1,
//     student?.rollNumber || "",
//     student?.studentSrn || "",
//     student?.firstName || "",
//     student?.fatherName || "",
//     "",
//   ]);

//   autoTable(doc, {
//     startY: finalY,

//     head: [
//       [
//         "S.NO",
//         "RollNO",
//         "SRN",
//         "Student Name",
//         "Father Name",
//         "Signature",
//       ],
//     ],

//     body: tableBody,

//     theme: "grid",

//     styles: {
//       fontSize: 7.5,
//       cellPadding: 1.2,
//       textColor: [0, 0, 0],
//       lineWidth: 0.2,
//       overflow: "linebreak",
//       valign: "middle",
//     },

//     headStyles: {
//       fillColor: [255, 255, 255],
//       textColor: [0, 0, 0],
//       fontStyle: "bold",
//       halign: "center",
//     },

//     bodyStyles: {
//       minCellHeight: 7,
//     },

//     columnStyles: {
//       0: { cellWidth: 12 },
//       1: { cellWidth: 28 },
//       2: { cellWidth: 32 },
//       3: { cellWidth: 42 },
//       4: { cellWidth: 42 },
//       5: { cellWidth: 28 },
//     },

//     margin: {
//       left: 14,
//       right: 14,
//     },

//     didDrawPage: function () {
//       const pageHeight = doc.internal.pageSize.height;

//       doc.setFontSize(8);

//       doc.text(
//         `Page ${doc.internal.getNumberOfPages()}`,
//         185,
//         pageHeight - 5
//       );
//     },
//   });

//   // =====================================================
//   // SAVE
//   // =====================================================

//   const fileName = `${schoolContext?.schoolName || "Attendance"}_${
//     batchContext?.batch || ""
//   }_${startDate || ""}.pdf`;

//   doc.save(fileName);
// };

//   return (
//     <Container fluid className="mt-4 mb-4">
//       {/* ERROR */}
//       {error && (
//         <Alert variant="danger" className="mb-3">
//           {error}
//         </Alert>
//       )}

//       {/* FILTER CARD */}
//       <Row className="justify-content-center">
//         <Col md={10} lg={8}>
//           <Card className="shadow-sm border-0">
//             <Card.Header className="bg-primary text-white">
//               <h4 className="mb-0">Download Attendance Sheet</h4>
//             </Card.Header>

//             <Card.Body>
//               <Row className="g-3">
//                 <Col md={4}>
//                   <SingleDatePicker />
//                 </Col>

//                 <Col md={4}>
//                   <School_drop_down />
//                 </Col>

//                 <Col md={4}>
//                   <Batch_drop_down />
//                 </Col>
//               </Row>

//               <div className="text-center mt-4">
//                 <Button
//                   variant="success"
//                   size="lg"
//                   onClick={fetchStudents}
//                   disabled={
//                     loading ||
//                     !schoolContext?.schoolId ||
//                     !batchContext?.batch
//                   }
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner
//                         animation="border"
//                         size="sm"
//                         className="me-2"
//                       />
//                       Generating PDF...
//                     </>
//                   ) : (
//                     "Download Attendance Sheet"
//                   )}
//                 </Button>
//               </div>

//               <div className="text-center mt-3 text-muted">
//                 <small>
//                   Select School, Batch and Date then download printable
//                   attendance sheet PDF.
//                 </small>
//               </div>

//               {students.length > 0 && (
//                 <div className="mt-3 text-center">
//                   <small className="text-success">
//                     {students.length} students found
//                   </small>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };












import React, { useState, useContext } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

import {
  School_drop_down,
  Batch_drop_down,
} from "../Utils/DependentDropDowns.v2";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

import { GetMBStudents } from "../../service/Student.service";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const AttendanceSheetFormat = () => {
  const { userData } = useContext(UserContext);

  const { schoolContext, batchContext } = useContext(
    DistrictBlockSschoolContextV2
  );

  const { startDate } = useContext(DateNDateRangeContext);

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const reqBody = {
        schoolId: schoolContext?.schoolId,
        batch: batchContext?.batch,
        startDate,
      };

      const response = await GetMBStudents(reqBody);

      // SORT NAME WISE
      const sortedStudents = (response?.data || []).sort((a, b) =>
        (a?.firstName || "").localeCompare(b?.firstName || "")
      );

      setStudents(sortedStudents);

      generatePDF(sortedStudents);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE PDF
  // =====================================================

  const generatePDF = (studentData) => {
    if (!studentData || studentData.length === 0) {
      alert("No students found");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    // =====================================================
    // HEADER
    // =====================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);

    doc.text(
      schoolContext?.schoolName || "SCHOOL NAME",
      105,
      12,
      { align: "center" }
    );

    doc.setFontSize(11);

    doc.text("ATTENDANCE SHEET", 105, 18, {
      align: "center",
    });

    // Batch
    doc.setFontSize(10);

    doc.text(`Batch : ${batchContext?.batch || "N/A"}`, 105, 24, {
      align: "center",
    });

    // =====================================================
    // TOP DETAILS
    // =====================================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      "Center In-charge Name __________________________",
      14,
      34
    );

    doc.text(`Date : ${startDate || ""}`, 155, 34);

    doc.text("Role ____________________", 14, 41);

    doc.text(
      "Lecture Number & Subject ____________________",
      105,
      41
    );

    doc.text("Remarks (if any) ____________________", 14, 48);

    // =====================================================
    // SUMMARY
    // =====================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("ATTENDANCE SUMMARY", 14, 58);

    autoTable(doc, {
      startY: 61,

      head: [["Total Students", "Total Present", "Total Absent"]],

      body: [[studentData.length, "", ""]],

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 1.5,
        halign: "center",
        valign: "middle",
        lineWidth: 0.2,
        textColor: [0, 0, 0],
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },

      margin: {
        left: 14,
        right: 14,
      },
    });

    // =====================================================
    // SIGNATURE SECTION
    // =====================================================

    let finalY = doc.lastAutoTable.finalY + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("Signature: ____________________", 14, finalY);

    finalY += 10;

    doc.text("Centre-Incharge Signature:", 14, finalY);

    finalY += 7;

    doc.text("Name ________________________________", 14, finalY);

    finalY += 7;

    doc.text("Date _________________________________", 14, finalY);

    // =====================================================
    // STUDENT TABLE
    // =====================================================

    finalY += 8;

    const tableBody = studentData.map((student, index) => [
      index + 1,
      student?.rollNumber || "",
      student?.studentSrn || "",
      student?.firstName || "",
      student?.fatherName || "",
      "",
    ]);

    autoTable(doc, {
      startY: finalY,

      head: [
        [
          "S.NO",
          "RollNO",
          "SRN",
          "Student Name",
          "Father Name",
          "Signature",
        ],
      ],

      body: tableBody,

      theme: "grid",

      styles: {
        fontSize: 7.5,
        cellPadding: 1.2,
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        overflow: "linebreak",
        valign: "middle",
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },

      bodyStyles: {
        minCellHeight: 7,
      },

      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 28 },
        2: { cellWidth: 32 },
        3: { cellWidth: 42 },
        4: { cellWidth: 42 },
        5: { cellWidth: 28 },
      },

      margin: {
        left: 14,
        right: 14,
      },

      didDrawPage: function () {
        const pageHeight = doc.internal.pageSize.height;

        doc.setFontSize(8);

        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          185,
          pageHeight - 5
        );
      },
    });

    // =====================================================
    // SAVE PDF
    // =====================================================

    const fileName = `${schoolContext?.schoolName || "Attendance"}_${
      batchContext?.batch || ""
    }_${startDate || ""}.pdf`;

    doc.save(fileName);
  };

  return (
    <>
      {/* OPEN MODAL BUTTON */}
<Card className="shadow-sm">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Download MB Attendance Pdf Format
      </Button>

      {/* MODAL */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Download Attendance Sheet</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* ERROR */}

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Container fluid>
            <Row className="justify-content-center">
              <Col md={12}>
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <Row className="g-3">
                      

                      <Col md={4}>
                        <School_drop_down />
                      </Col>

                      <Col md={4}>
                        <Batch_drop_down />
                      </Col>
                    </Row>

                    <div className="text-center mt-4">
                      <Button
                        variant="success"
                        size="lg"
                        onClick={fetchStudents}
                        disabled={
                          loading ||
                          !schoolContext?.schoolId ||
                          !batchContext?.batch
                        }
                      >
                        {loading ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Generating PDF...
                          </>
                        ) : (
                          "Download Attendance Sheet"
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-3 text-muted">
                      <small>
                        Select School, Batch and Date then download printable
                        attendance sheet PDF.
                      </small>
                    </div>

                    {students.length > 0 && (
                      <div className="mt-3 text-center">
                        <small className="text-success">
                          {students.length} students found
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      </Card>
    </>
  );
};