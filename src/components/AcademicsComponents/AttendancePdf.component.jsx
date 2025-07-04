import React, { useState, useContext } from "react";
import {
  GetDataBySchoolId,
  PatchAttendancePdf,
} from "../../service/AttendancePdf.services";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";
import Select from "react-select";
import { Button , Card, Row, Col, Form, Table} from "react-bootstrap";

export const AttendancePdf = () => {
  const { userData } = useContext(UserContext);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendancePdfData, setAttendancePdfData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
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
    setSelectedFiles((prev) => ({
      ...prev,
      [rowId]: file,
    }));
  };

  const handleUpload = async (row) => {
    const file = selectedFiles[row._id];
    if (!file) {
      alert("Please select a PDF file before uploading.");
      return;
    }

    const queryParams = {
      schoolId: row.schoolId,
      classofStudent: row.classofStudent,
      dateOfUpload: selectedDate,
    };

    const formData = new FormData();
    formData.append("file", file);
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
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e, row._id)}
                    />
                  )}
                </p>
              </Card.Text>
              <button
                disabled={row.isPdfUploaded}
                onClick={() => handleUpload(row)}
                className={`px-3 py-1 rounded text-white ${
                  row.isPdfUploaded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Upload
              </button>
            </Card.Body>
          </Card>
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
