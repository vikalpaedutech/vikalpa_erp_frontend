


import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Spinner, Badge } from 'react-bootstrap';
import { GetStudentsBySlc } from "../../service/AmeScoreCardServices/AmeScoreCardServices";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";

export const AMEScoreCard202527 = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [templatePdf, setTemplatePdf] = useState(null);

  // Create lookup maps for quick access
  const schoolMap = new Map();
  const districtMap = new Map();
  const blockMap = new Map();

  // Process DistrictBlockSchool data
  DistrictBlockSchool.forEach(item => {
    // Store school data
    if (item.schoolId && item.schoolName) {
      schoolMap.set(item.schoolId, {
        name: item.schoolName,
        blockId: item.blockId,
        districtId: item.districtId
      });
    }
    
    // Store district data
    if (item.districtId && item.districtName && !districtMap.has(item.districtId)) {
      districtMap.set(item.districtId, item.districtName);
    }
    
    // Store block data
    if (item.blockId && item.blockName && !blockMap.has(item.blockId)) {
      blockMap.set(item.blockId, item.blockName);
    }
  });

  // Load template PDF on component mount
  useEffect(() => {
    loadTemplatePDF();
    fetchStudentData();
  }, []);

  const loadTemplatePDF = async () => {
    try {
      const response = await fetch('/ame-score-card.pdf');
      const templateBytes = await response.arrayBuffer();
      setTemplatePdf(templateBytes);
    } catch (error) {
      console.error("Error loading template PDF:", error);
      setError("Failed to load template PDF");
    }
  };

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetStudentsBySlc();
      const studentData = response.data.data;
      
      // Enhance student data with real names from JSON
      const enhancedStudentData = studentData.map(student => ({
        ...student,
        districtName: districtMap.get(student.districtId) || student.districtName || `District ${student.districtId}`,
        blockName: blockMap.get(student.blockId) || student.blockName || `Block ${student.blockId}`,
        centerName: schoolMap.get(student.schoolId)?.name || student.centerName || student.schoolId || "-"
      }));
      
      setStudents(enhancedStudentData);
      
      const uniqueDistricts = [...new Map(
        enhancedStudentData.map(student => [
          student.districtId, 
          {
            districtId: student.districtId,
            districtName: student.districtName,
            studentCount: enhancedStudentData.filter(s => s.districtId === student.districtId).length
          }
        ])
      ).values()];
      
      setDistricts(uniqueDistricts);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDistrict) {
      const filtered = students.filter(
        student => student.districtId === selectedDistrict
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedDistrict, students]);

  // Function to generate PDF with template
  const generateStudentPDF = async (student) => {
    if (!templatePdf) {
      throw new Error("Template PDF not loaded");
    }

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templatePdf);
    
    // Get all pages
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages.length > 1 ? pages[1] : null;
    const { height } = firstPage.getSize();
    
    // Embed standard font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set font size and color
    const fontSize = 10;
    const textColor = rgb(0, 0, 0);
    
    // ========== FIRST PAGE CONTENT ==========
    
    // Student Information Section
    firstPage.drawText(student.studentSrn || "-", {
      x: 275,
      y: height - 103,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    });
    
    firstPage.drawText(student.firstName || "-", {
      x: 275,
      y: height - 123,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    });
    
    firstPage.drawText(student.fatherName || "-", {
      x: 275,
      y: height - 142,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    });
    
    firstPage.drawText(student.classofStudent || "-", {
      x: 275,
      y: height - 160,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    });
    
    // Use real center name from JSON
    const centerName = student.centerName || student.schoolId || "-";
    firstPage.drawText(centerName, {
      x: 275,
      y: height - 179,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
    });
    
    // Assessment Grades
    firstPage.drawText(student.disciplineGradeAssessment_AME || "-", {
      x: 275,
      y: height - 225,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    firstPage.drawText(student.academicPerformanceGradeAssessment_AME || "-", {
      x: 275,
      y: height - 241,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    firstPage.drawText(student.classParticipationGradeAssessment_AME || "-", {
      x: 275,
      y: height - 261,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    firstPage.drawText(student.responsibilityAssessment_AME || "-", {
      x: 275,
      y: height - 280,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    firstPage.drawText(student.attendanceAssessment_AME || "-", {
      x: 275,
      y: height - 295,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    firstPage.drawText(student.coCurricularAssessment_AME || "-", {
      x: 275,
      y: height - 316,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    // ========== SECOND PAGE CONTENT (if exists) ==========
    if (secondPage) {
      const secondPageHeight = secondPage.getSize().height;
      
      // Attendance percentages - fill in the existing table
      const attendanceStartY = secondPageHeight - 120;
      
      const monthsData = [
        { month: "MAY", value: student.mayMonthAttendancePercentage, y: attendanceStartY - 10 },
        { month: "JULY", value: student.julyMonthAttendancePercentage, y: attendanceStartY - 32 },
        { month: "AUGUST", value: student.augustMonthAttendancePercentage, y: attendanceStartY - 57 },
        { month: "SEPTEMBER", value: student.septemberMonthAttendancePercentage, y: attendanceStartY - 83 },
        { month: "OCTOBER", value: student.octoberMonthAttendancePercentage, y: attendanceStartY - 107 },
        { month: "NOVEMBER", value: student.novemberMonthAttendancePercentage, y: attendanceStartY - 133 },
        { month: "DECEMBER", value: student.decemberMonthAttendancePercentage, y: attendanceStartY - 158 },
        { month: "JANUARY", value: student.januaryMonthAttendancePercentage, y: attendanceStartY - 183 },
        { month: "FEBRUARY", value: student.februaryMonthAttendancePercentage, y: attendanceStartY - 208 }
      ];
      
      // Fill attendance percentages
      monthsData.forEach((item) => {
        if (item.value && item.value !== "-") {
          secondPage.drawText(`${item.value}%`, {
            x: 300,
            y: item.y,
            size: 10,
            font: helveticaFont,
            color: textColor,
          });
        } else {
          secondPage.drawText("-", {
            x: 300,
            y: item.y,
            size: 10,
            font: helveticaFont,
            color: textColor,
          });
        }
      });
      
      // Calculate Overall Attendance
      const validAttendance = [
        student.mayMonthAttendancePercentage,
        student.julyMonthAttendancePercentage,
        student.augustMonthAttendancePercentage,
        student.septemberMonthAttendancePercentage,
        student.octoberMonthAttendancePercentage,
        student.novemberMonthAttendancePercentage,
        student.decemberMonthAttendancePercentage,
        student.januaryMonthAttendancePercentage,
        student.februaryMonthAttendancePercentage
      ].filter(m => m && m !== "-" && !isNaN(parseFloat(m)));
      
      let overallAttendance = "-";
      if (validAttendance.length > 0) {
        const sum = validAttendance.reduce((acc, val) => acc + parseFloat(val), 0);
        overallAttendance = (sum / validAttendance.length).toFixed(2);
      }
      
      // Fill overall attendance
      secondPage.drawText(`${overallAttendance}%`, {
        x: 350,
        y: attendanceStartY - 244,
        size: 11,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
    }
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    // Updated filename to use centerName instead of schoolId
    const safeCenterName = (student.centerName || student.schoolId || "unknown").replace(/[^a-z0-9]/gi, '_');
    const fileName = `${student.firstName}_${student.fatherName}_${student.studentSrn}_${safeCenterName}.pdf`;
    
    return { pdfBytes, fileName };
  };

  const generateAllPDFs = async () => {
    if (filteredStudents.length === 0) {
      setError("No students found in selected district");
      return;
    }
    
    if (!templatePdf) {
      setError("Template PDF not loaded. Please check if template exists.");
      return;
    }
    
    setGenerating(true);
    setError(null);
    
    const zip = new JSZip();
    let generatedCount = 0;
    
    try {
      for (const student of filteredStudents) {
        try {
          const { pdfBytes, fileName } = await generateStudentPDF(student);
          zip.file(fileName, pdfBytes);
          generatedCount++;
        } catch (err) {
          console.error(`Error generating PDF for student ${student.studentSrn}:`, err);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const district = districts.find(d => d.districtId === selectedDistrict);
      const districtName = district?.districtName || selectedDistrict;
      const zipFileName = `scorecards_${districtName}_${new Date().toISOString().split('T')[0]}.zip`;
      
      saveAs(zipBlob, zipFileName);
      setError(`Successfully generated ${generatedCount} scorecards!`);
      setTimeout(() => setError(null), 3000);
      
    } catch (error) {
      console.error("Error generating ZIP:", error);
      setError("Failed to generate PDFs. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Mission Buniyaad - Student Performance Score Card</h4>
          <small className="text-white-50">Batch: 2025-27</small>
        </Card.Header>
        
        <Card.Body>
          {error && (
            <Alert variant={error.includes("Successfully") ? "success" : "danger"} className="mb-3">
              {error}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading student data...</p>
            </div>
          ) : (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Select District</Form.Label>
                    <Form.Select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="border-primary"
                    >
                      <option value="">-- Select a District --</option>
                      {districts.map((district) => (
                        <option key={district.districtId} value={district.districtId}>
                          {district.districtName} ({district.studentCount} students)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6} className="d-flex align-items-end">
                  {selectedDistrict && filteredStudents.length > 0 && (
                    <div className="w-100">
                      <Button
                        variant="success"
                        onClick={generateAllPDFs}
                        disabled={generating || !templatePdf}
                        className="w-100"
                        size="lg"
                      >
                        {generating ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Generating {filteredStudents.length} Scorecards...
                          </>
                        ) : (
                          `Download All Scorecards (${filteredStudents.length})`
                        )}
                      </Button>
                      {!templatePdf && (
                        <small className="text-danger d-block text-center mt-2">
                          Loading template PDF...
                        </small>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
              
              {selectedDistrict && filteredStudents.length > 0 && (
                <Alert variant="info" className="mt-3">
                  <strong>District Summary:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Total Students: <Badge bg="primary">{filteredStudents.length}</Badge></li>
                    <li>District: {districts.find(d => d.districtId === selectedDistrict)?.districtName}</li>
                    <li>ZIP file will contain individual PDFs for each student</li>
                  </ul>
                </Alert>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};