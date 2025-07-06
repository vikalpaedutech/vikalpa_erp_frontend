// import React, { useState, useContext } from "react";
// import {
//   GetDataBySchoolId,
//   PatchAttendancePdf,
// } from "../../service/AttendancePdf.services";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";
// import Select from "react-select";
// import { Button , Card, Row, Col, Form, Table} from "react-bootstrap";

// export const AttendancePdf = () => {
//   const { userData } = useContext(UserContext);

//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [attendancePdfData, setAttendancePdfData] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState({});
//   const [hasSubmitted, setHasSubmitted] = useState(false);

//   const matchedSchools = DistrictBlockSchool.filter((school) =>
//     userData?.[0]?.assignedSchools.includes(school.schoolId)
//   );

//   const fetchAttendancePdfData = async () => {
//     try {
//       const response = await GetDataBySchoolId(selectedSchool.value, selectedDate);
//       setAttendancePdfData(response.data || []);
//       console.log("fetched data", response.data);
//     } catch (error) {
//       console.error("Error fetching attendance PDF data:", error);
//       setAttendancePdfData([]);
//     }
//   };

//   const handleFilterSubmit = () => {
//     if (selectedSchool && selectedDate) {
//       setHasSubmitted(true);
//       fetchAttendancePdfData();
//     } else {
//       alert("Please select both school and date.");
//     }
//   };

//   const handleFileChange = (e, rowId) => {
//     const file = e.target.files[0];
//     setSelectedFiles((prev) => ({
//       ...prev,
//       [rowId]: file,
//     }));
//   };

//   const handleUpload = async (row) => {
//     const file = selectedFiles[row._id];
//     if (!file) {
//       alert("Please select a PDF file before uploading.");
//       return;
//     }

//     const queryParams = {
//       schoolId: row.schoolId,
//       classofStudent: row.classofStudent,
//       dateOfUpload: selectedDate,
//     };

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userData[0].userId || "Admin")

//     try {
//       await PatchAttendancePdf(queryParams, formData);
//       alert("File uploaded successfully!");
//       fetchAttendancePdfData();
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Failed to upload file.");
//     }
//   };

//   return (
//   <div className="parent-attendancepdf p-4">
//     <h2 className="text-xl font-semibold mb-4">Attendance PDF Upload</h2>

//     <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
//       <div className="w-full md:w-1/2">
//         <label className="block text-sm font-medium mb-1">Select School</label>
//         <Select
//           options={matchedSchools.map((school) => ({
//             value: school.schoolId,
//             label: school.schoolName,
//           }))}
//           value={selectedSchool}
//           onChange={setSelectedSchool}
//           placeholder="Select a school"
//         />
//       </div>
//       <br />
//       <div>
//         <label htmlFor="date" className="block text-sm font-medium mb-1">
//           Select Date
//         </label>
//         <input
//           type="date"
//           id="date"
//           name="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="border px-2 py-1 rounded"
//         />
//       </div>
//       <br />
//       <div>
//         <Button onClick={handleFilterSubmit}>Submit</Button>
//       </div>
//     </div>
//     <hr />

//     {attendancePdfData.length > 0 ? (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {attendancePdfData.map((row) => (
//           <Card key={row._id} style={{ width: '100%' }}>
//             <Card.Body>
//               <Card.Title>Class: {row.classofStudent}</Card.Title>
//               <Card.Text>
//                 <p>District: {row.districtName}</p>
//                 <p>Center: {row.schoolName}</p>
//                 <p>Status: {row.isPdfUploaded ? "Uploaded" : "Not Uploaded"}</p>
//                 <p>
//                   Select/View File:
//                   {row.isPdfUploaded ? (
//                     row.fileUrl ? (
//                       <a
//                         href={row.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline ml-2"
//                       >
//                         View File
//                       </a>
//                     ) : (
//                       <span className="text-gray-500 italic">No URL available</span>
//                     )
//                   ) : (
//                     <>
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx, image/*"
//                       onChange={(e) => handleFileChange(e, row._id)}
//                     />
//                     <br>
//                     </br>
//                     <p>Or</p>
//                     <div>
//                       <input 
//                       type="file"
//                       accept="image/*"
//                       capture="environment"
//                       />
//                     </div>
//                     </>
                    
//                   )}
//                 </p>
//               </Card.Text>
//               <button
//                 disabled={row.isPdfUploaded}
//                 onClick={() => handleUpload(row)}
//                 className={`px-3 py-1 rounded text-white ${
//                   row.isPdfUploaded
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 Upload
//               </button>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//     ) : (
//       hasSubmitted && (
//         <p className="mt-4 text-red-600 font-medium">
//           No data found for this school and date.
//         </p>
//       )
//     )}
//   </div>
// );

// };





















// import React, { useState, useContext } from "react";
// import {
//   GetDataBySchoolId,
//   PatchAttendancePdf,
// } from "../../service/AttendancePdf.services";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";
// import Select from "react-select";
// import { Button , Card, Row, Col, Form, Table} from "react-bootstrap";
// import jsPDF from "jspdf";

// export const AttendancePdf = () => {
//   const { userData } = useContext(UserContext);

//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [attendancePdfData, setAttendancePdfData] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState({});
//   const [imageGroups, setImageGroups] = useState({});
//   const [hasSubmitted, setHasSubmitted] = useState(false);

//   const matchedSchools = DistrictBlockSchool.filter((school) =>
//     userData?.[0]?.assignedSchools.includes(school.schoolId)
//   );

//   const fetchAttendancePdfData = async () => {
//     try {
//       const response = await GetDataBySchoolId(selectedSchool.value, selectedDate);
//       setAttendancePdfData(response.data || []);
//       console.log("fetched data", response.data);
//     } catch (error) {
//       console.error("Error fetching attendance PDF data:", error);
//       setAttendancePdfData([]);
//     }
//   };

//   const handleFilterSubmit = () => {
//     if (selectedSchool && selectedDate) {
//       setHasSubmitted(true);
//       fetchAttendancePdfData();
//     } else {
//       alert("Please select both school and date.");
//     }
//   };

//   const handleFileChange = (e, rowId) => {
//     const file = e.target.files[0];
//     if (file?.type === "application/pdf") {
//       file.arrayBuffer().then(buffer => {
//         if (buffer.byteLength === 0) {
//           alert("Selected PDF file is empty!");
//           return;
//         }
//         setSelectedFiles((prev) => ({
//           ...prev,
//           [rowId]: file,
//         }));
//       });
//     } else {
//       setSelectedFiles((prev) => ({
//         ...prev,
//         [rowId]: file,
//       }));
//     }
//   };

//   const handleImageCapture = (e, rowId, index) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageGroups((prev) => {
//       const existing = prev[rowId] || [];
//       const newGroup = [...existing];
//       newGroup[index] = file;
//       return { ...prev, [rowId]: newGroup };
//     });
//   };

//   const convertImagesToPDF = async (images) => {
//     const pdf = new jsPDF();
//     for (let i = 0; i < images.length; i++) {
//       const img = await readFileAsDataURL(images[i]);
//       const imgProps = pdf.getImageProperties(img);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       if (i !== 0) pdf.addPage();
//       pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
//     }
//     return pdf.output("blob");
//   };

//   const readFileAsDataURL = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleUpload = async (row) => {
//     const directFile = selectedFiles[row._id];
//     const capturedImages = imageGroups[row._id]?.filter(Boolean);

//     if (!directFile && (!capturedImages || capturedImages.length === 0)) {
//       alert("Please select a PDF or capture images first.");
//       return;
//     }

//     let fileToUpload = directFile;

//     if (!fileToUpload && capturedImages.length > 0) {
//       try {
//         const pdfBlob = await convertImagesToPDF(capturedImages);
//         fileToUpload = new File([pdfBlob], "merged.pdf", { type: "application/pdf" });
//       } catch (err) {
//         console.error("PDF conversion error:", err);
//         alert("Failed to convert images to PDF.");
//         return;
//       }
//     }

//     const queryParams = {
//       schoolId: row.schoolId,
//       classofStudent: row.classofStudent,
//       dateOfUpload: selectedDate,
//     };

//     const formData = new FormData();
//     formData.append("file", fileToUpload);
//     formData.append("userId", userData[0].userId || "Admin")

//     try {
//       await PatchAttendancePdf(queryParams, formData);
//       alert("File uploaded successfully!");
//       fetchAttendancePdfData();
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Failed to upload file.");
//     }
//   };

//   return (
//   <div className="parent-attendancepdf p-4">
//     <h2 className="text-xl font-semibold mb-4">Attendance PDF Upload</h2>

//     <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
//       <div className="w-full md:w-1/2">
//         <label className="block text-sm font-medium mb-1">Select School</label>
//         <Select
//           options={matchedSchools.map((school) => ({
//             value: school.schoolId,
//             label: school.schoolName,
//           }))}
//           value={selectedSchool}
//           onChange={setSelectedSchool}
//           placeholder="Select a school"
//         />
//       </div>
//       <br />
//       <div>
//         <label htmlFor="date" className="block text-sm font-medium mb-1">
//           Select Date
//         </label>
//         <input
//           type="date"
//           id="date"
//           name="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="border px-2 py-1 rounded"
//         />
//       </div>
//       <br />
//       <div>
//         <Button onClick={handleFilterSubmit}>Submit</Button>
//       </div>
//     </div>
//     <hr />

//     {attendancePdfData.length > 0 ? (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {attendancePdfData.map((row) => (
//           <Card key={row._id} style={{ width: '100%' }}>
//             <Card.Body>
//               <Card.Title>Class: {row.classofStudent}</Card.Title>
//               <Card.Text>
//                 <p>District: {row.districtName}</p>
//                 <p>Center: {row.schoolName}</p>
//                 <p>Status: {row.isPdfUploaded ? "Uploaded" : "Not Uploaded"}</p>
//                 <p>
//                   Select/View File:
//                   {row.isPdfUploaded ? (
//                     row.fileUrl ? (
//                       <a
//                         href={row.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline ml-2"
//                       >
//                         View File
//                       </a>
//                     ) : (
//                       <span className="text-gray-500 italic">No URL available</span>
//                     )
//                   ) : (
//                     <>
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx, image/*"
//                       onChange={(e) => handleFileChange(e, row._id)}
//                     />
//                     <br>
//                     </br>
//                     <p>Or</p>
//                     <div className="flex flex-wrap gap-2">
//                       {[0, 1, 2, 3].map((index) => (
//                         <input
//                           key={index}
//                           type="file"
//                           accept="image/*"
//                           capture="environment"
//                           onChange={(e) => handleImageCapture(e, row._id, index)}
//                         />
//                       ))}
//                     </div>
//                     </>
//                   )}
//                 </p>
//               </Card.Text>
//               <button
//                 disabled={row.isPdfUploaded}
//                 onClick={() => handleUpload(row)}
//                 className={`px-3 py-1 rounded text-white ${
//                   row.isPdfUploaded
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 Upload
//               </button>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//     ) : (
//       hasSubmitted && (
//         <p className="mt-4 text-red-600 font-medium">
//           No data found for this school and date.
//         </p>
//       )
//     )}
//   </div>
// );
// };





















import React, { useState, useContext } from "react";
import {
  GetDataBySchoolId,
  PatchAttendancePdf,
} from "../../service/AttendancePdf.services";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";
import Select from "react-select";
import { Button, Card } from "react-bootstrap";
import jsPDF from "jspdf";

export const AttendancePdf = () => {
  const { userData } = useContext(UserContext);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendancePdfData, setAttendancePdfData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [imageGroups, setImageGroups] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const matchedSchools = DistrictBlockSchool.filter((school) =>
    userData?.[0]?.assignedSchools.includes(school.schoolId)
  );

  const fetchAttendancePdfData = async () => {
    try {
      const response = await GetDataBySchoolId(selectedSchool.value, selectedDate);
      setAttendancePdfData(response.data || []);
      console.log("fetched data", response.data);
    } catch (error) {
      console.error("Error fetching attendance PDF data:", error);
      setAttendancePdfData([]);
    }
  };

  const handleFilterSubmit = () => {
    if (selectedSchool && selectedDate) {
      setHasSubmitted(true);
      fetchAttendancePdfData();
    } else {
      alert("Please select both school and date.");
    }
  };

  const handleFileChange = (e, rowId) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      file.arrayBuffer().then(buffer => {
        if (buffer.byteLength === 0) {
          alert("Selected PDF file is empty!");
          return;
        }
        setSelectedFiles((prev) => ({
          ...prev,
          [rowId]: file,
        }));
      });
    } else {
      setSelectedFiles((prev) => ({
        ...prev,
        [rowId]: file,
      }));
    }
  };

  const handleImageCapture = (e, rowId, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageGroups((prev) => {
      const existing = prev[rowId] || [];
      const newGroup = [...existing];
      newGroup[index] = file;
      return { ...prev, [rowId]: newGroup };
    });
  };

  const convertImagesToPDF = async (images) => {
    const pdf = new jsPDF();
    for (let i = 0; i < images.length; i++) {
      const img = await readFileAsDataURL(images[i]);
      const imgProps = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (i !== 0) pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    return pdf.output("blob");
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (row) => {
    const directFile = selectedFiles[row._id];
    const capturedImages = imageGroups[row._id]?.filter(Boolean);

    if (!directFile && (!capturedImages || capturedImages.length === 0)) {
      alert("Please select a PDF or capture images first.");
      return;
    }

    let fileToUpload = directFile;

    if (!fileToUpload && capturedImages.length > 0) {
      try {
        const pdfBlob = await convertImagesToPDF(capturedImages);
        fileToUpload = new File([pdfBlob], "merged.pdf", { type: "application/pdf" });
      } catch (err) {
        console.error("PDF conversion error:", err);
        alert("Failed to convert images to PDF.");
        return;
      }
    }

    const queryParams = {
      schoolId: row.schoolId,
      classofStudent: row.classofStudent,
      dateOfUpload: selectedDate,
    };

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("userId", userData[0].userId || "Admin")

    try {
      await PatchAttendancePdf(queryParams, formData);
      alert("File uploaded successfully!");
      fetchAttendancePdfData();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    }
  };

  return (
  <div className="parent-attendancepdf p-4">
    <h2 className="text-xl font-semibold mb-4">Attendance PDF Upload</h2>

    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="w-full md:w-1/2">
        <label className="block text-sm font-medium mb-1">Select School</label>
        <Select
          options={matchedSchools.map((school) => ({
            value: school.schoolId,
            label: school.schoolName,
          }))}
          value={selectedSchool}
          onChange={setSelectedSchool}
          placeholder="Select a school"
        />
      </div>
      <br />
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      <br />
      <div>
        <Button onClick={handleFilterSubmit}>Submit</Button>
      </div>
    </div>
    <hr />

    {attendancePdfData.length > 0 ? (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {attendancePdfData.map((row) => (
          <div>

            <Card key={row._id} style={{ width: '100%' }}>
            <Card.Body>
              <Card.Title>Class: {row.classofStudent}</Card.Title>
              <Card.Text>
                <p>District: {row.districtName}</p>
                <p>Center: {row.schoolName}</p>
                <p>Status: {row.isPdfUploaded ? "Uploaded" : "Not Uploaded"}</p>
                <p>
                  Select/View File:
                  {row.isPdfUploaded ? (
                    row.fileUrl ? (
                     
                     <>
                     
                     
                      <a
                        href={row.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-2"
                      >
                        View File
                      </a>
                      
                     </>
                   
                    ) : (
                      <span className="text-gray-500 italic">No URL available</span>
                    )
                  ) : (
                    <>
                        <hr/>
              
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx, image/*"
                      onChange={(e) => handleFileChange(e, row._id)}
                    />
                    <br />
                    <hr/>
                    
                    <h3>Or</h3>
                    <hr/>
                    <div className="flex flex-wrap gap-2">
                      {(imageGroups[row._id] || []).map((img, index) => (
                        <label key={index} style={{ display: 'inline-block', width: 80, height: 80, border: '2px dashed #999', cursor: 'pointer', position: 'relative' }}>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleImageCapture(e, row._id, index)}
                            style={{ display: 'none' }}
                          />
                          {img ? (
                            <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 30, fontWeight: 'bold', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>+</span>
                          )}
                        </label>
                      ))}
                      <label style={{ display: 'inline-block', width: 80, height: 80, border: '2px dashed #999', cursor: 'pointer', position: 'relative' }}>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleImageCapture(e, row._id, (imageGroups[row._id]?.length || 0))}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: 30, fontWeight: 'bold', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>+</span>
                      </label>
                    </div>
                    </>
                  )}
                </p>
              </Card.Text>
              <button
                disabled={row.isPdfUploaded}
                onClick={() => handleUpload(row)}
                className={`px-3 py-1 rounded text-black ${
                  row.isPdfUploaded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Upload
              </button>
            </Card.Body>
          </Card>
        <br/>

          </div>

        ))}
      </div>
    ) : (
      hasSubmitted && (
        <p className="mt-4 text-red-600 font-medium">
          No data found for this school and date.
        </p>
      )
    )}
  </div>
);
};
