
// BACKEND/src/components/DownloadAttendancePdfFormat.component.jsx

import React, { useState, useEffect, useContext } from "react";
import { getStudentIfisSlcTakenIsFalse, getStudentsByQueryParams } from "../../service/Student.service";

import { UserContext } from "../contextAPIs/User.context";
import { ClassOfStudent, DistrictBlockSchoolById } from "../DependentDropDowns/DistrictBlockSchool.component";
import { ListGroup , Button, Table, Spinner } from "react-bootstrap";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import html2canvas from "html2canvas";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";

import { downloadAttendancePdfFormat } from "../../service/ErpTest.services.js";

//ERP test route back

import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";

export const DownloadAttendancePdfFormat = () => {
  const { userData } = useContext(UserContext);
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext } = useContext(SchoolContext);
   
  //ClassContext API
   const {classContext, setClassContext} = useContext(ClassContext);


  const [studentData, setStudentData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);
  const [isReadyToDownload, setIsReadyToDownload] = useState(false);
  // const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState("")

  // Fetch student data when component mounts or school context changes
  const fetchStudentData = async () => {

    console.log(schoolContext)
    // alert(schoolContext?.[0]?.value)
   const queryParams = {
      isSlcTaken:false,
      classofStudent:classContext?.value,
      schoolId:schoolContext?.value
    }

    console.log(queryParams)
    try {
      const response = await getStudentsByQueryParams(queryParams) //getStudentIfisSlcTakenIsFalse();
      setStudentData(response.data);
      console.log(response.data)
    } catch (error) {
      console.log("Error fetching students data", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [schoolContext, classContext]);

  // Trigger spinner again when classContext changes
  useEffect(() => {
    if (classContext && filteredStudents.length > 0) {
      setIsSubmitting(true);
      setIsReadyToDownload(false);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsReadyToDownload(true);
      }, 1500);
    }
  }, [classContext]);

  // Handle form submission to filter students based on selected district, block, and school
  const handleSubmit = () => {
    if (!schoolContext) {
      alert("Please select district, block and school.");
      return;
    }

    if (!classContext) {
      alert("Please select class.");
      return;
    }

    setIsSubmitting(true);
    setIsReadyToDownload(false);

    setTimeout(() => {
      const filtered = studentData.filter((student) => {
        return String(student.schoolId) === String(schoolContext?.value) && String(student.classofStudent) === String(classContext.value);
      });

      if (filtered.length === 0) {
        alert("No students found for selected filters.");
      }

      setFilteredStudents(filtered);
      setIsSubmitting(false);
      setIsReadyToDownload(true);
    }, 5000);
  };

    const admitHrLogo = "/haryanaLogo.png"
    const buniyaadLogo = "/buniyaadLogo.png"

  //generate pdf function
  const generatePDF = async () => {
    setIsPDFGenerating(true);
  
    const pdf = new jsPDF("p", "mm", "a4");

      //Add logo hrLogo to the left side:
      pdf.addImage(admitHrLogo, "PNG", 15, 3, 15, 16)
      pdf.addImage(buniyaadLogo, "PNG", 180, 3, 15, 15)
  
    // Header
    pdf.setFontSize(12);
    pdf.text(`${schoolContext.label}`, 105, 10, { align: "center" }); //${districtContext[0].label} - 
    pdf.setFontSize(14);
    pdf.text(`Attendance Sheet_Class_${classContext.value}`, 105, 18, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`Date: _________________`, 20, 30);  //_________________  pdf.text(`Date: ${''}`, 20, 30)
    // pdf.line(30, 31, 55, 31);
    pdf.text(`Center Incharge Name: ______________________________`, 80, 30);
    pdf.text(`Role: _________________`, 20, 38);
    pdf.text(`Remarks (if any): ___________________________________`, 80, 38);
  
    // Attendance summary table
    pdf.autoTable({
      startY: 45,
      head: [['Total Student', 'Present', 'Absent']],
      body: [['', '', '']],
      theme: 'grid',
      styles: {
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        fontSize: 11,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
    });
    pdf.setFontSize(12);
    pdf.text(`Signature: ___________________________________`, 15, 70);
  
    // Student attendance list table
    const tableData = filteredStudents.map((student, index) => [
      index + 1,
      student.studentSrn,
      student.rollNumber,
      student.firstName.toUpperCase(),
      student.fatherName.toUpperCase(),
      "" // Blank cell for signature
    ]);
  
    pdf.autoTable({
      head: [['S.No',  'SRN', 'Roll Number', 'First Name', 'Father Name', 'Signature']],
      body: tableData,
      startY: pdf.lastAutoTable.finalY + 15,
      theme: 'grid',
      styles: {
        fontSize: 7, // Reduced font size
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 50 },
      },
    });
  
    pdf.save(`MB-L3-Attendance.pdf`);


    setIsPDFGenerating(false);

    //ERP Test

    if (userData.role === "hkrn") {
      
      const erpTestReqBody = {
      unqUserObjectId:userData._id,
      userId:userData.userId,
      classOfCenter:classContext?.value,
      schoolId:schoolContext?.value
      }

      console.log(erpTestReqBody)
      const erpTestResponse = await downloadAttendancePdfFormat(erpTestReqBody)

      
//function for routing back to test page after succesfully completting the task
      
 ErpTestPageRouteBack(userData, {keyStatus: 'DownloadPdf'})
      
      

    }



  };

  return (
    <div className="parent-div-download-attendance-pdf" style={{ padding: "20px" }}>
      <h3>Download Manual Attendance Pdf Format</h3>
      
      {/* <DistrictBlockSchoolById assignedDistricts={userData[0].assignedDistricts} />
       */}
      
      <br/>
      <div>

         <div>
                            <SchoolDropdown />
                        </div>
        {/* <div>
          <input type="date" 
          
          onChange={(e) => setSelectedDate(e.target.value)}

          />
        </div> */}
          <div>
            <ClassOfStudent />
          </div>
        </div>
      
      <hr />

      <Button onClick={handleSubmit} variant="primary" className="mb-3">Submit</Button>

      
         {classContext.value === "9" ? (
  <h1>Download 9th Class PDF</h1>
) : classContext.value === "10" ? (
  <h1>Download 10th Class PDF</h1>
) : (
  <h1>Filter Your Data.</h1>
)}

      
      
      
      {/* Show a spinner while submitting */}
      {isSubmitting && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

 
      {/* Show download button after successful filtering */}
      {isReadyToDownload && !isPDFGenerating && filteredStudents.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <Button onClick={generatePDF} variant="success">
            Download Attendance PDF
          </Button>
        </div>
      )}

      {/* Show spinner while generating the PDF */}
      {isPDFGenerating && (
        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            /> Generating PDF...
          </Button>
        </div>
      )}

      {/* Hidden section that generates the PDF */}
      {isReadyToDownload && (
        <div id="attendance-pdf-section" style={{ padding: "20px", border: "1px solid #000", marginTop: "30px", display: "none" }}>
          <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
            {schoolContext?.label?.toUpperCase()}
          </h4>

          <p>
            Date: ________________ &nbsp;&nbsp;&nbsp; Center Incharge Name: ________________
            <br />
            Role: ________________
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th style={cellStyle}>Total Students</th>
                <th style={cellStyle}>Total Present</th>
                <th style={cellStyle}>Total Absent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>__________</td>
                <td style={cellStyle}>__________</td>
                <td style={cellStyle}>__________</td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cellStyle}>S.No</th>
                <th style={cellStyle}>SRN</th>
                <th style={cellStyle}>First Name</th>
                <th style={cellStyle}>Father Name</th>
                <th style={cellStyle}>Signature</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student._id}>
                  <td style={cellStyle}>{index + 1}</td>
                  <td style={cellStyle}>{student.studentSrn}</td>
                  <td style={cellStyle}>{student.firstName}</td>
                  <td style={cellStyle}>{student.fatherName}</td>
                  <td style={cellStyle}>________________</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  border: "1px solid black",
  padding: "6px",
  textAlign: "center",
  fontSize: "12px",
};
