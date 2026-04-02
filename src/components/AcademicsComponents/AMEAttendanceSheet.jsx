import React, { useEffect, useState } from "react";

import {
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import Select from "react-select";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaInfoCircle, FaFilter, FaBuilding, FaUsers } from "react-icons/fa";
import { GetStudentsBySlc } from "../../service/AmeScoreCardServices/AmeScoreCardServices";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";

export const AMEAttendanceSheet = () => {
  const [students, setStudents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [studentsPerRoom, setStudentsPerRoom] = useState(24);

  // Logos
  const logo = "/haryana.png";
  const logo3 = "/vikalpalogonotitle.png";

  // Create lookup maps
  const schoolMap = new Map();
  const districtMap = new Map();

  // Process DistrictBlockSchool data
  DistrictBlockSchool.forEach(item => {
    if (item.schoolId && item.schoolName) {
      schoolMap.set(item.schoolId, {
        name: item.schoolName,
        blockId: item.blockId,
        districtId: item.districtId
      });
    }
    
    if (item.districtId && item.districtName && !districtMap.has(item.districtId)) {
      districtMap.set(item.districtId, item.districtName);
    }
  });

  /* ---------------- FETCH STUDENT DATA ---------------- */
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await GetStudentsBySlc();
        const studentData = response.data.data || [];
        
        // Filter and enhance student data
        const validStudents = studentData.filter(student => 
          student.firstName && student.rollNumber
        );
        
        const enhancedStudentData = validStudents.map(student => ({
          ...student,
          districtName: districtMap.get(student.districtId) || student.districtName || `District ${student.districtId}`,
          centerName: schoolMap.get(student.schoolId)?.name || student.schoolId || "-",
          examinationVenue: student.examinationVenue || "The Multipurpose Hall (MPH) at Chaudhary Devi Lal University (CDLU), Sirsa"
        }));
        
        // Sort by center name first, then by roll number
        const sortedStudents = enhancedStudentData.sort((a, b) => {
          // First sort by center name
          const centerCompare = (a.centerName || "").localeCompare(b.centerName || "");
          if (centerCompare !== 0) return centerCompare;
          // Then sort by roll number
          return (a.rollNumber || "").localeCompare(b.rollNumber || "");
        });
        
        setStudents(sortedStudents);
        
        // Extract unique districts
        const uniqueDistricts = [
          ...new Map(
            sortedStudents.map(s => [
              s.districtId, 
              { 
                value: s.districtId, 
                label: s.districtName,
                count: sortedStudents.filter(st => st.districtId === s.districtId).length,
                venue: s.examinationVenue
              }
            ])
          ).values(),
        ];
        setDistricts(uniqueDistricts);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  /* ---------------- FETCH ATTENDANCE DATA BY DISTRICT ---------------- */
  const fetchAttendanceData = async () => {
    if (!selectedDistrict) {
      setError("Please select a district");
      return;
    }
    
    setLoadingData(true);
    setError(null);
    
    try {
      // Filter students by selected district
      let filteredStudents = students.filter(
        s => s.districtId === selectedDistrict.value
      );
      
      if (filteredStudents.length === 0) {
        setError("No students found for this district");
        setAttendanceData([]);
        setShowPreview(true);
        return;
      }
      
      // Sort by center name first, then by roll number
      filteredStudents = filteredStudents.sort((a, b) => {
        // First sort by center name
        const centerCompare = (a.centerName || "").localeCompare(b.centerName || "");
        if (centerCompare !== 0) return centerCompare;
        // Then sort by roll number
        return (a.rollNumber || "").localeCompare(b.rollNumber || "");
      });
      
      // Format data for attendance sheet
      const formattedData = filteredStudents.map(student => ({
        rollNumber: student.rollNumber,
        srn: student.studentSrn,
        name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        father: student.fatherName,
        gender: student.gender,
        centerName: student.centerName,
        district: student.districtName,
        venue: student.examinationVenue,
      }));
      
      setAttendanceData(formattedData);
      setShowPreview(true);
      
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError("Failed to fetch attendance data");
    } finally {
      setLoadingData(false);
    }
  };

  /* ---------------- DRAW TABLE IN PDF ---------------- */
  const drawTable = async (pdf, students, roomNumber, startY = 48) => {
    // Prepare body data
    const body = students.map((s, i) => [
      i + 1,
      s.rollNumber || "",
      s.srn || "",
      s.name || "",
      s.father || "",
      s.gender || "",
      s.centerName || "",
      "", // Empty placeholder for signature
    ]);

    pdf.autoTable({
      startY,
      head: [[
        "S.No",
        "Roll No",
        "SRN",
        "Name",
        "Father's Name",
        "Gender",
        "Center Name",
        "Signature",
      ]],
      body,
      theme: "grid",
      rowPageBreak: "auto",
      margin: { top: startY, bottom: 15, left: 10, right: 10 },
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        overflow: "linebreak",
        cellWidth: "wrap"
      },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255,
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 25 },
        2: { cellWidth: 28 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 18 },
        6: { cellWidth: 80 },
        7: { cellWidth: 35 },
      },
      didDrawPage: (data) => {
        // Add page number
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          pdf.internal.pageSize.height - 10
        );
      },
    });
  };

  /* ---------------- GENERATE ATTENDANCE PDFs ---------------- */
  const generateAttendancePDFs = async () => {
    if (!attendanceData.length) {
      setError("No attendance data available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      const rooms = [];

      // Split students into rooms based on studentsPerRoom
      for (let i = 0; i < attendanceData.length; i += studentsPerRoom) {
        rooms.push(attendanceData.slice(i, i + studentsPerRoom));
      }

      console.log(`Total students: ${attendanceData.length}, Total rooms: ${rooms.length}`);

      // Generate PDF for each room
      for (let r = 0; r < rooms.length; r++) {
        const pdf = new jsPDF("l", "mm", "a4");
        const w = pdf.internal.pageSize.getWidth();
        const h = pdf.internal.pageSize.getHeight();

        // Add logos
        if (logo) {
          try {
            pdf.addImage(logo, "PNG", 10, 8, 20, 20);
          } catch (e) {
            console.warn("Could not load main logo");
          }
        }

        if (logo3) {
          try {
            pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
          } catch (e) {
            console.warn("Could not load secondary logo");
          }
        }

        // Add header text
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("ANNUAL MERIT EXAMINATION (2026-28)", w / 2, 18, { align: "center" });
        
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`District: ${selectedDistrict?.label || "N/A"}`, w / 2, 34, { align: "center" });
        
        // Add venue name below district
        const venueName = attendanceData[0]?.venue || "The Multipurpose Hall (MPH) at Chaudhary Devi Lal University (CDLU), Sirsa";
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.text(`Venue: ${venueName}`, w / 2, 41, { align: "center" });
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Room No: ${r + 1} (Students ${r * studentsPerRoom + 1} to ${Math.min((r + 1) * studentsPerRoom, attendanceData.length)})`, w / 2, 48, { align: "center" });

        // Draw table with student data
        await drawTable(pdf, rooms[r], r + 1, 55);

        // Add footer note
        pdf.setFontSize(9);
        pdf.text(
          "Note: Students must sign in the signature column after verification",
          10,
          h - 8
        );

        // Add to zip
        const safeDistrictName = (selectedDistrict?.label || "District").replace(/[^a-z0-9]/gi, '_');
        zip.file(`Room_${(r + 1).toString().padStart(2, '0')}_${safeDistrictName}.pdf`, pdf.output("blob"));
      }

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const fileName = `AttendanceSheets_${(selectedDistrict?.label || "District").replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(zipBlob, fileName);
      
      setError(`Successfully generated ${rooms.length} attendance sheets for ${attendanceData.length} students!`);
      setTimeout(() => setError(null), 3000);
      
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError("PDF generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DOWNLOAD BLANK ATTENDANCE TEMPLATE ---------------- */
  const downloadBlankAttendanceTemplate = async () => {
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();

      // Logos
      if (logo) {
        try {
          pdf.addImage(logo, "PNG", 10, 8, 20, 20);
        } catch {}
      }

      if (logo3) {
        try {
          pdf.addImage(logo3, "PNG", w - 30, 8, 20, 20);
        } catch {}
      }

      // Header
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("MISSION BUNIYAAD ENTRANCE EXAMINATION LEVEL-3 (2026-28)", w / 2, 18, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Attendance Sheet", w / 2, 26, { align: "center" });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("District: ________________________________", w / 2, 34, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.text("Venue: ________________________________", w / 2, 41, { align: "center" });
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("Room No: ________", w / 2, 48, { align: "center" });

      // Blank rows
      const blankRows = Array.from({ length: studentsPerRoom }).map(() => [
        "", // S.No
        "", // Roll No
        "", // SRN
        "", // Name
        "", // Father's Name
        "", // Gender
        "", // Center Name
        "", // Signature
      ]);

      pdf.autoTable({
        startY: 55,
        head: [[
          "S.No",
          "Roll No",
          "SRN",
          "Name",
          "Father's Name",
          "Gender",
          "Center Name",
          "Signature",
        ]],
        body: blankRows,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          minCellHeight: 20,
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 25 },
          2: { cellWidth: 28 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 18 },
          6: { cellWidth: 80 },
          7: { cellWidth: 35 },
        },
      });

      pdf.save("Attendance_Blank_Template.pdf");
    } catch (err) {
      console.error("Blank template generation failed", err);
      setError("Failed to generate blank template");
    }
  };

  /* ---------------- UI RENDER ---------------- */
  return (
    <Container fluid className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaFilter className="me-2" /> 
          <h5 className="mb-0">AME L-3 ATTENDANCE SHEET GENERATOR</h5>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant={error.includes("Successfully") ? "success" : "danger"} onClose={() => setError(null)} dismissible>
              <FaInfoCircle className="me-2" />
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Select District</Form.Label>
                <Select
                  placeholder="Select District"
                  options={districts}
                  isClearable
                  onChange={(district) => {
                    setSelectedDistrict(district);
                    setShowPreview(false);
                    setAttendanceData([]);
                  }}
                  value={selectedDistrict}
                  formatOptionLabel={(option) => (
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{option.label}</span>
                      <Badge bg="info" pill className="ms-2">
                        {option.count} students
                      </Badge>
                    </div>
                  )}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">Students per Room</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="50"
                  value={studentsPerRoom}
                  onChange={(e) => setStudentsPerRoom(parseInt(e.target.value) || 24)}
                />
                <Form.Text className="text-muted">
                  Default: 24 students per room
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={3} className="d-flex align-items-end">
              <Button 
                onClick={fetchAttendanceData} 
                disabled={loadingData || !selectedDistrict}
                variant="primary"
                className="w-100"
                size="lg"
              >
                {loadingData ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  "Get Attendance Data"
                )}
              </Button>
            </Col>
          </Row>

          {showPreview && attendanceData.length > 0 && (
            <>
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0 d-flex justify-content-between align-items-center">
                    <span>
                      <FaUsers className="me-2" />
                      Preview - {selectedDistrict?.label} District
                    </span>
                    <Badge bg="info">
                      {Math.ceil(attendanceData.length / studentsPerRoom)} Rooms | {attendanceData.length} Students
                    </Badge>
                  </h6>
                  <small className="text-muted mt-1">
                    Venue: {attendanceData[0]?.venue || "The Multipurpose Hall (MPH) at Chaudhary Devi Lal University (CDLU), Sirsa"}
                  </small>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table bordered hover size="sm" className="mb-0">
                      <thead className="table-primary">
                        <tr>
                          <th>S.No</th>
                          <th>Roll No</th>
                          <th>SRN</th>
                          <th>Name</th>
                          <th>Father's Name</th>
                          <th>Gender</th>
                          <th>Center Name</th>
                          <th>Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.slice(0, 15).map((s, i) => (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td><strong>{s.rollNumber}</strong></td>
                            <td>{s.srn || "—"}</td>
                            <td>{s.name || "—"}</td>
                            <td>{s.father || "—"}</td>
                            <td className="text-center">
                              <Badge bg={s.gender === "Male" ? "primary" : "danger"}>
                                {s.gender || "—"}
                              </Badge>
                            </td>
                            <td className="small">{s.centerName || "—"}</td>
                            <td className="text-center">—</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {attendanceData.length > 15 && (
                      <div className="text-center mt-2 text-muted small">
                        + {attendanceData.length - 15} more students
                      </div>
                    )}
                  </div>
                  
                  {/* Room Distribution Summary */}
                  {/* <div className="mt-3">
                    <Alert variant="info" className="mb-0">
                      <strong>Room Distribution (Sorted by Center Name & Roll Number):</strong>
                      <div className="mt-2">
                        {Array.from({ length: Math.ceil(attendanceData.length / studentsPerRoom) }, (_, i) => {
                          const start = i * studentsPerRoom + 1;
                          const end = Math.min((i + 1) * studentsPerRoom, attendanceData.length);
                          return (
                            <Badge key={i} bg="secondary" className="me-2 mb-1">
                              Room {i + 1}: Students {start}-{end} ({end - start + 1} students)
                            </Badge>
                          );
                        })}
                      </div>
                    </Alert>
                  </div> */}
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-center gap-3 mb-4">
                <Button
                  onClick={downloadBlankAttendanceTemplate}
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  Download Blank Format
                </Button>

                <Button 
                  onClick={generateAttendancePDFs} 
                  disabled={loading || attendanceData.length === 0}
                  variant="success"
                  className="d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  {loading ? "Generating..." : `Download All PDFs (${Math.ceil(attendanceData.length / studentsPerRoom)} files)`}
                </Button>
              </div>

              <Alert variant="info" className="mb-0">
                <FaInfoCircle className="me-2" />
                <strong>Note:</strong> 
                <ul className="mb-0 mt-1">
                  <li>Total students: <strong>{attendanceData.length}</strong></li>
                  <li>Students per room: <strong>{studentsPerRoom}</strong></li>
                  <li>Total PDFs to generate: <strong>{Math.ceil(attendanceData.length / studentsPerRoom)}</strong></li>
                  <li>Each PDF contains exactly {studentsPerRoom} students (last room may have fewer)</li>
                  <li>Students are sorted by <strong>Center Name</strong> first, then by <strong>Roll Number</strong></li>
                </ul>
              </Alert>
            </>
          )}

          {showPreview && attendanceData.length === 0 && !loadingData && (
            <Alert variant="warning" className="text-center">
              <FaInfoCircle className="me-2" />
              No students found for the selected district.
            </Alert>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted small">
          <div className="d-flex justify-content-between">
            <span><FaBuilding className="me-1" /> Total Districts: {districts.length}</span>
            <span>AME Attendance Sheet Generator v2.0</span>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};