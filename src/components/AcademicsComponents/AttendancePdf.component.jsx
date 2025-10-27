// import React, { useState, useContext } from "react";

import React, { useState, useContext } from "react";
import {
  GetDataBySchoolId,
  PatchAttendancePdf,
} from "../../service/AttendancePdf.services";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";
import Select from "react-select";
import { Button, Card, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";

import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";

import { attendancePdfGamification } from "../../service/Gamification.services.js";
import { uploadAttendancePdfFormat } from "../../service/ErpTest.services.js";


//Erp test route back
import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";

export const AttendancePdf = () => {
  const { userData } = useContext(UserContext);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendancePdfData, setAttendancePdfData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [imageGroups, setImageGroups] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [uploadingRowId, setUploadingRowId] = useState(null);





  //--------------------------------------------------------------------------

const regions = userData?.userAccess?.region || [];
const allSchoolIds = regions.flatMap(region =>
  region.blockIds.flatMap(block =>
    block.schoolIds.map(school => school.schoolId)
  )
);

const allDistrictIds = regions.flatMap(region => 
  region.districtId
)



//------------------------------------------------------------------------



  const matchedSchools = DistrictBlockSchool.filter((school) =>
    allSchoolIds.includes(school.schoolId)
  );

  const fetchAttendancePdfData = async () => {

    let reqBody;

    if(Array.isArray(userData?.userAccess?.classId) &&
  userData.userAccess.classId.length === 2 &&
  ["9", "10"].every(id => userData.userAccess.classId.includes(id))){

    reqBody = {
      classofStudent: ['9', '10'],
      schoolId:selectedSchool.value,
      dateOfUpload: selectedDate
    }
  } else {
    reqBody = {
       classofStudent:userData?.userAccess?.classId,
      schoolId: selectedSchool.value,
      dateOfUpload: selectedDate
    }
  }


    try {
      const response = await GetDataBySchoolId(reqBody ); //selectedSchool.value, selectedDate
      setAttendancePdfData(response.data || []);
    } catch (error) {
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

  const compressImageToDataURL = (file, maxWidth) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleFactor = maxWidth / img.width;
          const width = maxWidth;
          const height = img.height * scaleFactor;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.5);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
  };

  const convertImagesToPDF = async (images) => {
    const pdf = new jsPDF();
    for (let i = 0; i < images.length; i++) {
      const compressedDataUrl = await compressImageToDataURL(images[i], 800);
      const imgProps = pdf.getImageProperties(compressedDataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (i !== 0) pdf.addPage();
      pdf.addImage(compressedDataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    }
    return pdf.output("blob");
  };

  const handleUpload = async (row) => {
    const directFile = selectedFiles[row._id];
    const capturedImages = imageGroups[row._id]?.filter(Boolean);

    if (!directFile && (!capturedImages || capturedImages.length === 0)) {
      alert("Please select a PDF or capture images first.");
      return;
    }

    setUploadingRowId(row._id);

    let fileToUpload = directFile;

    if (!fileToUpload && capturedImages.length > 0) {
      try {
        const pdfBlob = await convertImagesToPDF(capturedImages);
        fileToUpload = new File([pdfBlob], "merged.pdf", { type: "application/pdf" });
      } catch (err) {
        alert("Failed to convert images to PDF.");
        setUploadingRowId(null);
        return;
      }
    }

    const queryParams = {
      schoolId: row.schoolId,
      classofStudent: row.classofStudent,
      dateOfUpload: selectedDate,
      // userId: userData?.[0]?.userId
    };

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("userId", userData.userId || "Admin");
    formData.append("unqUserObjectId", userData?._id)

    try {
      await PatchAttendancePdf(queryParams, formData);
      alert("File uploaded successfully!");
      fetchAttendancePdfData();

      //updating gamification points.


      if(userData.role === "CC" || userData.role === "Admin"){

        const gamificationReqBody = {
        unqUserObjectId: userData?._id,
        schoolId: row.schoolId,
        classofStudent: row.classofStudent,
        userId: userData?.userId
      }

      const attendancePdfGamificationResponst = await attendancePdfGamification(gamificationReqBody)

      }

      

      //ERP Test

      if (userData.role === "hkrn"){
        const erpTestReqBody = {

      unqUserObjectId: userData?._id,
        schoolId: row.schoolId,
        classofStudent: row.classofStudent,
        userId: userData?.userId
      }

      const erpTestResponse = await uploadAttendancePdfFormat(erpTestReqBody)

  //function for routing back to test page after succesfully completting the task
      
      // ErpTestPageRouteBack(userData, {keyStatus: 'Attendance'})
      
      

      }

    } catch (error) {
      alert("Failed to upload file.");
    } finally {
      setUploadingRowId(null);
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
            <div key={row._id}>
              <Card style={{ width: "100%" }}>
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
                          <a
                            href={row.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline ml-2"
                          >
                            View File
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">No URL available</span>
                        )
                      ) : (
                        <>
                          <hr />
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, row._id)}
                          />
                          <br />
                          <hr />
                          <h3>Or</h3>
                          <hr />
                          <div className="flex flex-wrap gap-2">
                            {(imageGroups[row._id] || []).map((img, index) => (
                              <label
                                key={index}
                                style={{
                                  display: "inline-block",
                                  width: 80,
                                  height: 80,
                                  border: "2px dashed #999",
                                  cursor: "pointer",
                                  position: "relative",
                                  margin:'5px'
                                
                                  
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => handleImageCapture(e, row._id, index)}
                                  style={{ display: "none" }}
                                />
                                {img ? (
                                  <img
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                   
                                    }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      fontSize: 30,
                                      fontWeight: "bold",
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                  >
                                    +
                                  </span>
                                )}
                              </label>
                            ))}
                            <label
                              style={{
                                display: "inline-block",
    width: 80,
    height: 80,
    border: "2px dashed #999",
    cursor: "pointer",
    position: "relative",
    display: "flex",           // Align children inside
    alignItems: "center",      // Vertically center "+"
    justifyContent: "center",  // Horizontally center "+"
    margin: "5px", 
                              }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) =>
                                  handleImageCapture(
                                    e,
                                    row._id,
                                    (imageGroups[row._id]?.length || 0)
                                  )
                                }
                                style={{ display: "none" }}
                              />
                              <span
                                style={{
                                  fontSize: 30,
                                  fontWeight: "bold",
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                +
                              </span>
                            </label>
                          </div>
                        </>
                      )}
                    </p>
                  </Card.Text>
                  <button
                    disabled={row.isPdfUploaded || uploadingRowId === row._id}
                    onClick={() => handleUpload(row)}
                    className={`px-3 py-1 rounded text-black ${
                      row.isPdfUploaded || uploadingRowId === row._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {uploadingRowId === row._id ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </Card.Body>
              </Card>
              <br />
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
