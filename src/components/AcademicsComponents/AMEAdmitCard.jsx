// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { saveAs } from "file-saver";
// import { GetStudentsBySlc } from "../../service/AmeScoreCardServices/AmeScoreCardServices";
// import { useLocation } from "react-router-dom";


// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";
// const logo3 = "/vikalpalogonotitle.png";
// const admitInstructions = "/level3adimitcardinstructions.png";

// const arrayBufferToBase64 = (buffer) => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// };

// export const AMEAdmitCard = () => {



  
//   const [students, setStudents] = useState([]);
//   const [srnInput, setSrnInput] = useState("");
//   const [foundStudent, setFoundStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [busy, setBusy] = useState(false);

//   // Format date helper
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Fetch students data on component mount
//   useEffect(() => {
//     const fetchStudents = async () => {
//       setLoading(true);
//       try {
//         const response = await GetStudentsBySlc();
//         const studentData = response.data.data || [];
//         console.log("Fetched students:", studentData);
//         setStudents(studentData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch student data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   // Handle SRN search
//   const handleSearch = () => {
//     if (!srnInput.trim()) {
//       setError("Please enter an SRN number");
//       return;
//     }

//     setSearching(true);
//     setError(null);
//     setFoundStudent(null);

//     const student = students.find(
//       (s) => s.studentSrn === srnInput.trim()
//     );

//     if (student) {
//       setFoundStudent(student);
//     } else {
//       setError("No student found with this SRN number. Please check and try again.");
//     }
//     setSearching(false);
//   };

//   // Build PDF blob for admit card
//   const buildPdfBlob = async (student) => {
//     // Try to load Devanagari font (optional)
//     try {
//       const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//       const fResp = await fetch(fontUrl);
//       if (fResp.ok) {
//         const buf = await fResp.arrayBuffer();
//         const base64 = arrayBufferToBase64(buf);
//         if (jsPDF.API && jsPDF.API.addFileToVFS) {
//           jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
//           jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//         }
//       }
//     } catch (e) {
//       console.warn("Devanagari font load failed:", e);
//     }

//     const doc = new jsPDF();
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(11);

//     // Border
//     doc.rect(5, 5, 200, 285);

//     // Logos
//     try {
//       doc.addImage(logo, "PNG", 10, 8, 20, 20);
//     } catch (e) {
//       console.warn("Logo 1 load failed:", e);
//     }
//     try {
//       doc.addImage(logo2, "PNG", 180, 8, 20, 20);
//     } catch (e) {
//       console.warn("Logo 2 load failed:", e);
//     }

//     const pageWidth = doc.internal.pageSize.getWidth();

//     // Header
//     doc.setFontSize(12);
//     doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
//     doc.setFontSize(13);
//     doc.text("ANNUAL MERIT EXAMINATION, (2026-28)", pageWidth / 2, 15, { align: "center" });
//     doc.setFontSize(12);
//     doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });

//     // Exam details
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     const examDate = student.ameExaminationDate || "To be announced";
//     doc.text(`Examination Date: ${examDate}`, pageWidth / 2, 27, { align: "center" });
//     doc.setFontSize(10);
//     doc.text("Reporting Time: 08:00 AM, Exam Time: 09:15 AM to 10:30 AM", pageWidth / 2, 32, { align: "center" });

//     // Student data for PDF (Date of Birth removed)
//     const dataForPdf = [
//       ["Student Name", student.firstName ?? "-"],
//       ["Father Name", student.fatherName ?? "-"],
//       ["Mother Name", student.motherName ?? "-"],
//       ["Category", student.category ?? "-"],
//       ["SRN Number", student.studentSrn ?? "-"],
//       ["Roll Number", student.rollNumber ?? "-"],
//       ["District", student.districtName ?? "-"],
//       ["Block", student.blockName ?? "-"],
//       ["School", student.schoolName ?? "-"],
//       ["Examination Venue", student.ameExaminationVenue ?? "-"],
//     ];

//     doc.autoTable({
//       startY: 40,
//       body: dataForPdf,
//       theme: "grid",
//       styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
//       columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
//       tableWidth: "wrap",
//     });

//     // Photo area
//     let lastY = doc.lastAutoTable?.finalY || 40 + (dataForPdf.length * 8);
    
//     // Square box with text to the right of table
//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(0.5);
//     doc.rect(150, 40, 50, 50);
//     doc.setFontSize(9);
//     doc.text("Attest your passport", 155, 60);
//     doc.text("size photo", 170, 67);
    
//     // Instructions section
//     const instructionsY = lastY + 65;
    
//     try {
//       doc.addImage(admitInstructions, "PNG", 15, 135, 180, 152);
//     } catch (e) {
//       doc.setFontSize(9);
//       doc.text("General Instructions:", 15, instructionsY);
//       doc.text("1. Reach the examination center 30 minutes before the scheduled time.", 15, instructionsY + 10);
//       doc.text("2. Carry this admit card and a valid ID proof.", 15, instructionsY + 20);
//       doc.text("3. Do not carry mobile phones, calculators, or any electronic devices.", 15, instructionsY + 30);
//       doc.text("4. Use only black/blue pen to mark answers.", 15, instructionsY + 40);
//       doc.text("5. No candidate will be allowed after the gate closes.", 15, instructionsY + 50);
//     }

//     return doc.output("blob");
//   };

//   // Download single PDF
//   const downloadAdmitCard = async () => {
//     if (!foundStudent) return;

//     setBusy(true);
//     setShowModal(true);
//     setError(null);

//     try {
//       const blob = await buildPdfBlob(foundStudent);
//       const safeName = (foundStudent.studentSrn || foundStudent.firstName || "admit").toString().replace(/\s+/g, "_");
//       saveAs(blob, `${safeName}_AME_admit_card.pdf`);

      
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setError("Error generating admit card. Please try again.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const handleReset = () => {
//     setSrnInput("");
//     setFoundStudent(null);
//     setError(null);
//   };

//   const cardStyle = {
//     borderRadius: "12px",
//     padding: "20px",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//   };

//   return (
//     <Container className="py-5">
//       <Card style={cardStyle}>
//         <Card.Header className="bg-white text-center border-0 py-3">
//           <div style={{ textAlign: "center" }}>
//             <h2 style={{ fontWeight: 700, color: "#2c3e50" }}>Annual Merit Examination (2026-28)</h2>
//             <h3 className="text-muted">Admit Card</h3>
//             <hr />
//           </div>
//         </Card.Header>

//         <Card.Body>
//           {!foundStudent ? (
//             // Search Form
//             <div>
//               <Alert variant="info" className="mb-4">
//                 <strong>Instructions:</strong> Please enter your SRN (Student Registration Number) to download your AME Admit Card.
//               </Alert>

//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold">Enter SRN Number</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="e.g., 1706275023"
//                   value={srnInput}
//                   onChange={(e) => setSrnInput(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                   disabled={loading || searching}
//                   style={{ fontSize: "16px", padding: "12px" }}
//                 />
            
//               </Form.Group>

//               {error && (
//                 <Alert variant="danger" className="mt-3">
//                   {error}
//                 </Alert>
//               )}

//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading student data...</p>
//                 </div>
//               )}

//               <div className="d-flex gap-3 mt-4">
//                 <Button
//                   variant="primary"
//                   onClick={handleSearch}
//                   disabled={loading || searching || !srnInput.trim()}
//                   className="px-4 py-2"
//                 >
//                   {searching ? (
//                     <>
//                       <Spinner as="span" animation="border" size="sm" className="me-2" />
//                       Searching...
//                     </>
//                   ) : (
//                     "Submit"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             // Student Found - Show Details and Download Button
//             <div>
//               <Alert variant="success" className="mb-4">
//                 <strong>✓ Student Found!</strong> Please verify your details below and click download to get your AME Admit Card.
//               </Alert>

//               <div className="student-details mb-4">
//                 <h5 className="mb-3" style={{ color: "#2c3e50", borderLeft: "4px solid #0d6efd", paddingLeft: "12px" }}>
//                   Student Information
//                 </h5>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <p><strong>Student Name:</strong> {foundStudent.firstName || "-"}</p>
//                     <p><strong>Father's Name:</strong> {foundStudent.fatherName || "-"}</p>
//                     <p><strong>Mother's Name:</strong> {foundStudent.motherName || "-"}</p>
//                     <p><strong>SRN Number:</strong> {foundStudent.studentSrn || "-"}</p>
//                     <p><strong>Roll Number:</strong> {foundStudent.rollNumber || "-"}</p>
//                   </div>
//                   <div className="col-md-6">
//                     <p><strong>Category:</strong> {foundStudent.category || "-"}</p>
//                     <p><strong>District:</strong> {foundStudent.districtName || "-"}</p>
//                     <p><strong>Block:</strong> {foundStudent.blockName || "-"}</p>
//                     <p><strong>School:</strong> {foundStudent.schoolName || "-"}</p>
//                   </div>
//                 </div>
//                 <div className="row mt-2">
//                   <div className="col-12">
//                     <p><strong>Examination Venue:</strong> {foundStudent.ameExaminationVenue || "-"}</p>
//                     <p><strong>Examination Date:</strong> {foundStudent.ameExaminationDate || "To be announced"}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center mt-4">
//                 <Button
//                   variant="success"
//                   size="lg"
//                   onClick={downloadAdmitCard}
//                   className="px-5 py-2"
//                   style={{ fontSize: "18px", fontWeight: "bold" }}
//                 >
//                   <i className="fas fa-download me-2"></i>
//                   Download AME Admit Card
//                 </Button>
//               </div>

//               <div className="text-center mt-3">
//                 <Button
//                   variant="link"
//                   onClick={handleReset}
//                   className="text-muted"
//                 >
//                   Search for another student
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Card.Body>

     
//       </Card>

//       {/* Download Modal */}
//       <Modal show={showModal} onHide={() => !busy && setShowModal(false)} centered backdrop="static">
//         <Modal.Header closeButton={!busy}>
//           <Modal.Title>
//             {busy ? "Generating Admit Card..." : error ? "Error" : "Download Complete!"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           {busy ? (
//             <>
//               <Spinner animation="border" variant="primary" />
//               <div className="mt-3">
//                 <p>Please wait while we prepare your admit card...</p>
//               </div>
//             </>
//           ) : error ? (
//             <div className="text-danger">
//               <p>{error}</p>
//             </div>
//           ) : (
//             <div>
//               <div className="text-success mb-2" style={{ fontSize: "48px" }}>✓</div>
//               <p>Your AME Admit Card has been downloaded successfully!</p>
//               <p className="text-muted small">Please check your downloads folder.</p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowModal(false)}
//             disabled={busy}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };







// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { saveAs } from "file-saver";
// import { GetStudentsBySlc } from "../../service/AmeScoreCardServices/AmeScoreCardServices";

// const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";
// const logo3 = "/vikalpalogonotitle.png";
// const admitInstructions = "/level3adimitcardinstructions.png";

// const arrayBufferToBase64 = (buffer) => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// };

// export const AMEAdmitCard = () => {
//   const [students, setStudents] = useState([]);
//   const [srnInput, setSrnInput] = useState("");
//   const [foundStudent, setFoundStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [showAlertModal, setShowAlertModal] = useState(false);

//   // Format date helper
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Fetch students data on component mount
//   useEffect(() => {
//     const fetchStudents = async () => {
//       setLoading(true);
//       try {
//         const response = await GetStudentsBySlc();
//         const studentData = response.data.data || [];
//         console.log("Fetched students:", studentData);
//         setStudents(studentData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch student data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   // Handle SRN search
//   const handleSearch = () => {
//     if (!srnInput.trim()) {
//       setError("Please enter an SRN number");
//       return;
//     }

//     setSearching(true);
//     setError(null);
//     setFoundStudent(null);

//     const student = students.find(
//       (s) => s.studentSrn === srnInput.trim()
//     );

//     if (student) {
//       // Check if ameExaminationDate is null or empty right after finding student
//       if (!student.ameExaminationDate || student.ameExaminationDate === null) {
//         setShowAlertModal(true);
//         setSearching(false);
//         return;
//       }
//       setFoundStudent(student);
//     } else {
//       setError("No student found with this SRN number. Please check and try again.");
//     }
//     setSearching(false);
//   };

//   // Build PDF blob for admit card
//   const buildPdfBlob = async (student) => {
//     // Try to load Devanagari font (optional)
//     try {
//       const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
//       const fResp = await fetch(fontUrl);
//       if (fResp.ok) {
//         const buf = await fResp.arrayBuffer();
//         const base64 = arrayBufferToBase64(buf);
//         if (jsPDF.API && jsPDF.API.addFileToVFS) {
//           jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
//           jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
//         }
//       }
//     } catch (e) {
//       console.warn("Devanagari font load failed:", e);
//     }

//     const doc = new jsPDF();
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(11);

//     // Border
//     doc.rect(5, 5, 200, 285);

//     // Logos
//     try {
//       doc.addImage(logo, "PNG", 10, 8, 20, 20);
//     } catch (e) {
//       console.warn("Logo 1 load failed:", e);
//     }
//     try {
//       doc.addImage(logo2, "PNG", 180, 8, 20, 20);
//     } catch (e) {
//       console.warn("Logo 2 load failed:", e);
//     }

//     const pageWidth = doc.internal.pageSize.getWidth();

//     // Header
//     doc.setFontSize(12);
//     doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
//     doc.setFontSize(13);
//     doc.text("ANNUAL MERIT EXAMINATION, (2026-28)", pageWidth / 2, 15, { align: "center" });
//     doc.setFontSize(12);
//     doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });

//     // Exam details
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     const examDate = student.ameExaminationDate || "To be announced";
//     doc.text(`Examination Date: ${examDate}`, pageWidth / 2, 27, { align: "center" });
//     doc.setFontSize(10);
//     doc.text("Reporting Time: 08:00 AM, Exam Time: 09:15 AM to 10:30 AM", pageWidth / 2, 32, { align: "center" });

//     // Student data for PDF (Date of Birth removed)
//     const dataForPdf = [
//       ["Student Name", student.firstName ?? "-"],
//       ["Father Name", student.fatherName ?? "-"],
//       ["Mother Name", student.motherName ?? "-"],
//       ["Category", student.category ?? "-"],
//       ["SRN Number", student.studentSrn ?? "-"],
//       ["Roll Number", student.rollNumber ?? "-"],
//       ["District", student.districtName ?? "-"],
//       ["Block", student.blockName ?? "-"],
//       ["School", student.schoolName ?? "-"],
//       ["Examination Venue", student.ameExaminationVenue ?? "-"],
//     ];

//     doc.autoTable({
//       startY: 40,
//       body: dataForPdf,
//       theme: "grid",
//       styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
//       columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
//       tableWidth: "wrap",
//     });

//     // Photo area
//     let lastY = doc.lastAutoTable?.finalY || 40 + (dataForPdf.length * 8);
    
//     // Square box with text to the right of table
//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(0.5);
//     doc.rect(150, 40, 50, 50);
//     doc.setFontSize(9);
//     doc.text("Attest your passport", 155, 60);
//     doc.text("size photo", 170, 67);
    
//     // Instructions section
//     const instructionsY = lastY + 65;
    
//     try {
//       doc.addImage(admitInstructions, "PNG", 15, 135, 180, 152);
//     } catch (e) {
//       doc.setFontSize(9);
//       doc.text("General Instructions:", 15, instructionsY);
//       doc.text("1. Reach the examination center 30 minutes before the scheduled time.", 15, instructionsY + 10);
//       doc.text("2. Carry this admit card and a valid ID proof.", 15, instructionsY + 20);
//       doc.text("3. Do not carry mobile phones, calculators, or any electronic devices.", 15, instructionsY + 30);
//       doc.text("4. Use only black/blue pen to mark answers.", 15, instructionsY + 40);
//       doc.text("5. No candidate will be allowed after the gate closes.", 15, instructionsY + 50);
//     }

//     return doc.output("blob");
//   };

//   // Download single PDF
//   const downloadAdmitCard = async () => {
//     if (!foundStudent) return;

//     setBusy(true);
//     setShowModal(true);
//     setError(null);

//     try {
//       const blob = await buildPdfBlob(foundStudent);
//       const safeName = (foundStudent.studentSrn || foundStudent.firstName || "admit").toString().replace(/\s+/g, "_");
//       saveAs(blob, `${safeName}_AME_admit_card.pdf`);
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setError("Error generating admit card. Please try again.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const handleReset = () => {
//     setSrnInput("");
//     setFoundStudent(null);
//     setError(null);
//   };

//   const cardStyle = {
//     borderRadius: "12px",
//     padding: "20px",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//   };

//   return (
//     <Container className="py-5">
//       <Card style={cardStyle}>
//         <Card.Header className="bg-white text-center border-0 py-3">
//           <div style={{ textAlign: "center" }}>
//             <h2 style={{ fontWeight: 700, color: "#2c3e50" }}>Annual Merit Examination (2026-28)</h2>
//             <h3 className="text-muted">Admit Card</h3>
//             <hr />
//           </div>
//         </Card.Header>

//         <Card.Body>
//           {!foundStudent ? (
//             // Search Form
//             <div>
//               <Alert variant="info" className="mb-4">
//                 <strong>Instructions:</strong> Please enter your SRN (Student Registration Number) to download your AME Admit Card.
//               </Alert>

//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold">Enter SRN Number</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="e.g., 1706275023"
//                   value={srnInput}
//                   onChange={(e) => setSrnInput(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                   disabled={loading || searching}
//                   style={{ fontSize: "16px", padding: "12px" }}
//                 />
            
//               </Form.Group>

//               {error && (
//                 <Alert variant="danger" className="mt-3">
//                   {error}
//                 </Alert>
//               )}

//               {loading && (
//                 <div className="text-center my-4">
//                   <Spinner animation="border" variant="primary" />
//                   <p className="mt-2">Loading student data...</p>
//                 </div>
//               )}

//               <div className="d-flex gap-3 mt-4">
//                 <Button
//                   variant="primary"
//                   onClick={handleSearch}
//                   disabled={loading || searching || !srnInput.trim()}
//                   className="px-4 py-2"
//                 >
//                   {searching ? (
//                     <>
//                       <Spinner as="span" animation="border" size="sm" className="me-2" />
//                       Searching...
//                     </>
//                   ) : (
//                     "Submit"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             // Student Found - Show Details and Download Button
//             <div>
//               <Alert variant="success" className="mb-4">
//                 <strong>✓ Student Found!</strong> Please verify your details below and click download to get your AME Admit Card.
//               </Alert>

//               <div className="student-details mb-4">
//                 <h5 className="mb-3" style={{ color: "#2c3e50", borderLeft: "4px solid #0d6efd", paddingLeft: "12px" }}>
//                   Student Information
//                 </h5>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <p><strong>Student Name:</strong> {foundStudent.firstName || "-"}</p>
//                     <p><strong>Father's Name:</strong> {foundStudent.fatherName || "-"}</p>
//                     <p><strong>Mother's Name:</strong> {foundStudent.motherName || "-"}</p>
//                     <p><strong>SRN Number:</strong> {foundStudent.studentSrn || "-"}</p>
//                     <p><strong>Roll Number:</strong> {foundStudent.rollNumber || "-"}</p>
//                   </div>
//                   <div className="col-md-6">
//                     <p><strong>Category:</strong> {foundStudent.category || "-"}</p>
//                     <p><strong>District:</strong> {foundStudent.districtName || "-"}</p>
//                     <p><strong>Block:</strong> {foundStudent.blockName || "-"}</p>
//                     <p><strong>School:</strong> {foundStudent.schoolName || "-"}</p>
//                   </div>
//                 </div>
//                 <div className="row mt-2">
//                   <div className="col-12">
//                     <p><strong>Examination Venue:</strong> {foundStudent.ameExaminationVenue || "-"}</p>
//                     <p><strong>Examination Date:</strong> {foundStudent.ameExaminationDate || "To be announced"}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center mt-4">
//                 <Button
//                   variant="success"
//                   size="lg"
//                   onClick={downloadAdmitCard}
//                   className="px-5 py-2"
//                   style={{ fontSize: "18px", fontWeight: "bold" }}
//                 >
//                   <i className="fas fa-download me-2"></i>
//                   Download AME Admit Card
//                 </Button>
//               </div>

//               <div className="text-center mt-3">
//                 <Button
//                   variant="link"
//                   onClick={handleReset}
//                   className="text-muted"
//                 >
//                   Search for another student
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Card.Body>

     
//       </Card>

//       {/* Download Modal */}
//       <Modal show={showModal} onHide={() => !busy && setShowModal(false)} centered backdrop="static">
//         <Modal.Header closeButton={!busy}>
//           <Modal.Title>
//             {busy ? "Generating Admit Card..." : error ? "Error" : "Download Complete!"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           {busy ? (
//             <>
//               <Spinner animation="border" variant="primary" />
//               <div className="mt-3">
//                 <p>Please wait while we prepare your admit card...</p>
//               </div>
//             </>
//           ) : error ? (
//             <div className="text-danger">
//               <p>{error}</p>
//             </div>
//           ) : (
//             <div>
//               <div className="text-success mb-2" style={{ fontSize: "48px" }}>✓</div>
//               <p>Your AME Admit Card has been downloaded successfully!</p>
//               <p className="text-muted small">Please check your downloads folder.</p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowModal(false)}
//             disabled={busy}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Alert Modal for when examination date is not available - shows right after submitting SRN */}
//       <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title >Admit Card Not Available</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">

//           <h5>Your admit card for downloading will be available soon!</h5>
//           {/* <p className="text-muted mt-3">
//             The examination date has not been announced yet. Please check back later.
//           </p> */}
//           <hr />
//           <p className="small text-muted">
//             आपका प्रवेश पत्र डाउनलोड करने के लिए जल्द ही उपलब्ध होगा! कृपया बाद में जांच करें।
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => setShowAlertModal(false)}>
//             OK
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };









import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { GetStudentsBySlc } from "../../service/AmeScoreCardServices/AmeScoreCardServices";

const logo = "/haryana.png";
const logo2 = "/admitBuniyaLogo.png";
const logo3 = "/vikalpalogonotitle.png";
const admitInstructions = "/level3adimitcardinstructions.png";

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const AMEAdmitCard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [srnInput, setSrnInput] = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Format date helper
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch students data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await GetStudentsBySlc();
        const studentData = response.data.data || [];
        console.log("Fetched students:", studentData);
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Handle SRN search
  const handleSearch = () => {
    if (!srnInput.trim()) {
      setError("Please enter an SRN number");
      return;
    }

    setSearching(true);
    setError(null);
    setFoundStudent(null);

    const student = students.find(
      (s) => s.studentSrn === srnInput.trim()
    );

    if (student) {
      // Check if ameExaminationDate is null or empty right after finding student
      if (!student.ameExaminationDate || student.ameExaminationDate === null) {
        setShowAlertModal(true);
        setSearching(false);
        return;
      }
      setFoundStudent(student);
    } else {
      setError("No student found with this SRN number. Please check and try again.");
    }
    setSearching(false);
  };

  // Build PDF blob for admit card
  const buildPdfBlob = async (student) => {
    // Try to load Devanagari font (optional)
    try {
      const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
      const fResp = await fetch(fontUrl);
      if (fResp.ok) {
        const buf = await fResp.arrayBuffer();
        const base64 = arrayBufferToBase64(buf);
        if (jsPDF.API && jsPDF.API.addFileToVFS) {
          jsPDF.API.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64);
          jsPDF.API.addFont("NotoSansDevanagari-Regular.ttf", "NotoDeva", "normal");
        }
      }
    } catch (e) {
      console.warn("Devanagari font load failed:", e);
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Border
    doc.rect(5, 5, 200, 285);

    // Logos
    try {
      doc.addImage(logo, "PNG", 10, 8, 20, 20);
    } catch (e) {
      console.warn("Logo 1 load failed:", e);
    }
    try {
      doc.addImage(logo2, "PNG", 180, 8, 20, 20);
    } catch (e) {
      console.warn("Logo 2 load failed:", e);
    }

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(12);
    doc.text("Directorate of School Education (DSE) Shiksha Sadan, Haryana", pageWidth / 2, 10, { align: "center" });
    doc.setFontSize(13);
    doc.text("ANNUAL MERIT EXAMINATION, (2026-28)", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("E – Admit Card", pageWidth / 2, 22, { align: "center" });

    // Exam details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const examDate = student.ameExaminationDate || "To be announced";
    doc.text(`Examination Date: ${examDate}`, pageWidth / 2, 27, { align: "center" });
    doc.setFontSize(10);
    doc.text("Reporting Time: 08:00 AM, Exam Time: 09:15 AM to 10:30 AM", pageWidth / 2, 32, { align: "center" });

    // Student data for PDF (Date of Birth removed)
    const dataForPdf = [
      ["Student Name", student.firstName ?? "-"],
      ["Father Name", student.fatherName ?? "-"],
      ["Mother Name", student.motherName ?? "-"],
      ["Category", student.category ?? "-"],
      ["SRN Number", student.studentSrn ?? "-"],
      ["Roll Number", student.rollNumber ?? "-"],
      ["District", student.districtName ?? "-"],
      ["Block", student.blockName ?? "-"],
      ["School", student.schoolName ?? "-"],
      ["Examination Venue", student.ameExaminationVenue ?? "-"],
    ];

    doc.autoTable({
      startY: 40,
      body: dataForPdf,
      theme: "grid",
      styles: { lineWidth: 0.2, lineColor: [0, 0, 0], fillColor: false, textColor: [0, 0, 0], fontSize: 10 },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 } },
      tableWidth: "wrap",
    });

    // Photo area
    let lastY = doc.lastAutoTable?.finalY || 40 + (dataForPdf.length * 8);
    
    // Square box with text to the right of table
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(150, 40, 50, 50);
    doc.setFontSize(9);
    doc.text("Attest your passport", 155, 60);
    doc.text("size photo", 170, 67);
    
    // Instructions section
    const instructionsY = lastY + 65;
    
    try {
      doc.addImage(admitInstructions, "PNG", 15, 135, 180, 152);
    } catch (e) {
      doc.setFontSize(9);
      doc.text("General Instructions:", 15, instructionsY);
      doc.text("1. Reach the examination center 30 minutes before the scheduled time.", 15, instructionsY + 10);
      doc.text("2. Carry this admit card and a valid ID proof.", 15, instructionsY + 20);
      doc.text("3. Do not carry mobile phones, calculators, or any electronic devices.", 15, instructionsY + 30);
      doc.text("4. Use only black/blue pen to mark answers.", 15, instructionsY + 40);
      doc.text("5. No candidate will be allowed after the gate closes.", 15, instructionsY + 50);
    }

    return doc.output("blob");
  };

  // Download single PDF
  const downloadAdmitCard = async () => {
    if (!foundStudent) return;

    setBusy(true);
    setShowModal(true);
    setError(null);

    try {
      const blob = await buildPdfBlob(foundStudent);
      const safeName = (foundStudent.studentSrn || foundStudent.firstName || "admit").toString().replace(/\s+/g, "_");
      saveAs(blob, `${safeName}_AME_admit_card.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Error generating admit card. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setSrnInput("");
    setFoundStudent(null);
    setError(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFoundStudent(null);
    setSrnInput("");
    setError(null);
    navigate("/ame-admit-card");
  };

  const cardStyle = {
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  };

  return (
    <Container className="py-5">
      <Card style={cardStyle}>
        <Card.Header className="bg-white text-center border-0 py-3">
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontWeight: 700, color: "#2c3e50" }}>Annual Merit Examination (2026-28)</h2>
            <h3 className="text-muted">Admit Card</h3>
            <hr />
          </div>
        </Card.Header>

        <Card.Body>
          {!foundStudent ? (
            // Search Form
            <div>
              <Alert variant="info" className="mb-4">
                <strong>Instructions:</strong> Please enter your SRN (Student Registration Number) to download your AME Admit Card.
              </Alert>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Enter SRN Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 1706275023"
                  value={srnInput}
                  onChange={(e) => setSrnInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={loading || searching}
                  style={{ fontSize: "16px", padding: "12px" }}
                />
            
              </Form.Group>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {loading && (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading student data...</p>
                </div>
              )}

              <div className="d-flex gap-3 mt-4">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading || searching || !srnInput.trim()}
                  className="px-4 py-2"
                >
                  {searching ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Searching...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Student Found - Show Details and Download Button
            <div>
              <Alert variant="success" className="mb-4">
                <strong>Admit Card Status:</strong> Please verify your details below and click download to get your AME Admit Card.
              </Alert>

              <div className="student-details mb-4">
                <h5 className="mb-3" style={{ color: "#2c3e50", borderLeft: "4px solid #0d6efd", paddingLeft: "12px" }}>
                  Student Information
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Student Name:</strong> {foundStudent.firstName || "-"}</p>
                    <p><strong>Father's Name:</strong> {foundStudent.fatherName || "-"}</p>
                    <p><strong>Mother's Name:</strong> {foundStudent.motherName || "-"}</p>
                    <p><strong>SRN Number:</strong> {foundStudent.studentSrn || "-"}</p>
                    <p><strong>Roll Number:</strong> {foundStudent.rollNumber || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Category:</strong> {foundStudent.category || "-"}</p>
                    <p><strong>District:</strong> {foundStudent.districtName || "-"}</p>
                    <p><strong>Block:</strong> {foundStudent.blockName || "-"}</p>
                    <p><strong>School:</strong> {foundStudent.schoolName || "-"}</p>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12">
                    <p><strong>Examination Venue:</strong> {foundStudent.ameExaminationVenue || "-"}</p>
                    <p><strong>Examination Date:</strong> {foundStudent.ameExaminationDate || "To be announced"}</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={downloadAdmitCard}
                  className="px-5 py-2"
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  <i className="fas fa-download me-2"></i>
                  Download AME Admit Card
                </Button>
              </div>

              {/* <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={handleReset}
                  className="text-muted"
                >
                  Search for another student
                </Button>
              </div> */}
            </div>
          )}
        </Card.Body>

     
      </Card>

      {/* Download Modal */}
      <Modal show={showModal} onHide={() => !busy && handleModalClose()} centered backdrop="static">
        <Modal.Header closeButton={!busy}>
          <Modal.Title>
            {busy ? "Generating Admit Card..." : error ? "Error" : "Download Complete!"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {busy ? (
            <>
              <Spinner animation="border" variant="primary" />
              <div className="mt-3">
                <p>Please wait while we prepare your admit card...</p>
              </div>
            </>
          ) : error ? (
            <div className="text-danger">
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <div className="text-success mb-2" style={{ fontSize: "48px" }}>✓</div>
              <p>Your AME Admit Card has been downloaded successfully!</p>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleModalClose}
            disabled={busy}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alert Modal for when examination date is not available - shows right after submitting SRN */}
      <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title >Admit Card Not Available</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">

          <h5>Your admit card for downloading will be available soon!</h5>
          <hr />
          <p className="small text-muted">
            आपका प्रवेश पत्र डाउनलोड करने के लिए जल्द ही उपलब्ध होगा! कृपया बाद में जांच करें।
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAlertModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};