import React, { useState, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from "./DistrictBlockSchool.json";
import Select from "react-select";
import {
  createCenterOrSchoolDisciplinary,
} from "../../service/MbCentersDisciplinary.services";
import { Breadcrumb } from "react-bootstrap";

const subjects = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Maths", label: "Maths" },
  { value: "Science", label: "Science" },
  { value: "S.St", label: "S.St" },
  { value: "Optional", label: "Optional" },
];

const types = [
  { value: "Disciplinary", label: "Disciplinary" },
  { value: "Interaction", label: "Interaction" },
];

const statusOptions = {
  Disciplinary: [
    { value: "Indiscipline", label: "Indiscipline" },
    { value: "Not Attentive", label: "Not Attentive" },
    { value: "Lack Of Focus", label: "Lack Of Focus" },
  ],
  Interaction: [
    { value: "Student-Teacher", label: "Student-Teacher" },
    { value: "Teacher-Student", label: "Teacher-Student" },

  ],
};

const MbCentersDisciplinary = () => {
  const { userData } = useContext(UserContext);
  const userId = userData?.[0]?.userId;

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedClass, setSelectedClass] = useState("9");
  const [showDataTable, setShowDataTable] = useState(false);

  const [remarks, setRemarks] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const districts = [...new Map(DistrictBlockSchool.map(item => [item.districtId, { value: item.districtId, label: item.districtName }])).values()];
  const blocks = selectedDistrict
    ? [...new Map(DistrictBlockSchool.filter(d => d.districtId === selectedDistrict.value).map(b => [b.blockId, { value: b.blockId, label: b.blockName }])).values()]
    : [];
  const schools = selectedBlock
    ? DistrictBlockSchool.filter(s => s.blockId === selectedBlock.value).map(s => ({ value: s.schoolId, label: s.schoolName }))
    : [];

  const filteredData = DistrictBlockSchool.filter(item => {
    return (
      (!selectedDistrict || item.districtId === selectedDistrict.value) &&
      (!selectedBlock || item.blockId === selectedBlock.value) &&
      (!selectedSchool || item.schoolId === selectedSchool.value)
    );
  });

  const handleClearFilters = () => {
    setSelectedDistrict(null);
    setSelectedBlock(null);
    setSelectedSchool(null);
  };

  const handleRemarkSubmit = async (school, statusValue) => {
    if (!selectedSubject || !selectedType) {
      alert("Please select subject and type first.");
      return;
    }

    const id = school.schoolId;
    const submission = {
      districtName: school.districtName,
      blockName: school.blockName,
      schoolName: school.schoolName,
      classOfStudent: selectedClass,
      subject: selectedSubject?.value,
      disciplinaryOrInteraction: selectedType?.value,
      disciplinaryOrInteractiionRemark: statusValue,
      remark: remarks[id] || "",
      userId: userId
    };

    try {
      await createCenterOrSchoolDisciplinary(submission);
      //alert("Remark submitted successfully!");
      setRemarks(prev => ({ ...prev, [id]: "" }));
    } catch (err) {
      alert("Failed to submit.");
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h4>Center / School Disciplinary Records</h4>

      <Breadcrumb>
        <Breadcrumb.Item active={selectedClass === "9"} onClick={() => setSelectedClass("9")}>Class 9</Breadcrumb.Item>
        <Breadcrumb.Item active={selectedClass === "10"} onClick={() => setSelectedClass("10")}>Class 10</Breadcrumb.Item>
        <Breadcrumb.Item active={selectedClass === "10"} onClick={() => setShowDataTable(true)}>See Data</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex gap-3 my-3 align-items-end">
        <Select options={districts} value={selectedDistrict} onChange={setSelectedDistrict} placeholder="Select District" />
        <Select options={blocks} value={selectedBlock} onChange={setSelectedBlock} placeholder="Select Block" />
        <Select options={schools} value={selectedSchool} onChange={setSelectedSchool} placeholder="Select School" />
        <button className="btn btn-outline-secondary" onClick={handleClearFilters}>Clear Filters</button>
      </div>

      <div className="d-flex gap-3 my-3 align-items-center">
        <Select
          options={subjects}
          value={selectedSubject}
          onChange={setSelectedSubject}
          placeholder="Select Subject"
        />
        <Select
          options={types}
          value={selectedType}
          onChange={setSelectedType}
          placeholder="Select Type"
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>District</th>
            <th>School</th>
            {/* <th>Remark</th> */}
            <th>Status Buttons</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((school, index) => {
            const id = school.schoolId;
            const statuses = selectedType ? statusOptions[selectedType.value] : [];

            return (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{school.districtName}</td>
                <td>{school.schoolName}</td>
                {/* <td>
                  <input
                    type="text"
                    className="form-control"
                    value={remarks[id] || ""}
                    onChange={(e) => setRemarks(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder="Remark"
                  />
                </td> */}
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status.value}
                        className="btn btn-sm btn-primary"
                        onClick={() => handleRemarkSubmit(school, status.value)}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MbCentersDisciplinary;
