//This records the center disciplinary issue.
//Probably will be used by class presenter, academict team

// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from "./DistrictBlockSchool.json"
// import Select from "react-select";
// import { createCenterOrSchoolDisciplinary, getCenterOrSchoolDisciplinaryDataByUserId } from "../../service/MbCentersDisciplinary.services";


// const MbCentersDisciplinary = () => {


// //context api

// const {userData, setUserData} = useContext(UserContext);

// console.log(DistrictBlockSchool)

// //Hooks for getting data from backend Apis.


//     return (
//         <div className="parent-MbcentersDisciplinary">
            
//         </div>

//     )
// }

// export default MbCentersDisciplinary;



// MbCentersDisciplinary.jsx

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from "./DistrictBlockSchool.json";
import Select from "react-select";
import {
  createCenterOrSchoolDisciplinary,
  getCenterOrSchoolDisciplinaryDataByUserId,
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
    { value: "Eating", label: "Eating" },
    { value: "Running", label: "Running" },
    { value: "Talking", label: "Talking" },
    { value: "Fighting", label: "Fighting" },
    { value: "Abusing", label: "Abusing" },
  ],
  Interaction: [
    { value: "Student-Teacher", label: "Student-Teacher" },
    { value: "Teacher-Student", label: "Teacher-Student" },
    { value: "Teacher asked question", label: "Teacher asked question" },
    { value: "Student answered", label: "Student answered" },
  ],
};

const MbCentersDisciplinary = () => {
  const { userData } = useContext(UserContext);
  const userId = userData?.[0]?.userId;
  console.log("i am user daata", userId)

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedClass, setSelectedClass] = useState("9");
  const [showDataTable, setShowDataTable] = useState(false);

  const [remarks, setRemarks] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [selectedTypes, setSelectedTypes] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState({});

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

  const handleSubmit = async (school) => {
    const id = school.schoolId;
    const selectedStatusList = selectedStatuses[id] || [];

    if (!selectedSubjects[id] || !selectedTypes[id] || selectedStatusList.length === 0) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const submissions = selectedStatusList.map((status) => ({
      districtName: school.districtName,
      blockName: school.blockName,
      schoolName: school.schoolName,
      classOfStudent: selectedClass,
      subject: selectedSubjects[id]?.value,
      disciplinaryOrInteraction: selectedTypes[id]?.value,
      disciplinaryOrInteractiionRemark: status.value,
      remark: remarks[id] || "",
      userId: userId
    }));

    try {
      for (const submission of submissions) {
        await createCenterOrSchoolDisciplinary(submission);
      }
      alert("Data submitted successfully!");
      setSelectedSubjects((prev) => ({ ...prev, [id]: null }));
      setSelectedTypes((prev) => ({ ...prev, [id]: null }));
      setSelectedStatuses((prev) => ({ ...prev, [id]: [] }));
      setRemarks((prev) => ({ ...prev, [id]: "" }));
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

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>District</th>
            <th>School</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Status</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((school, index) => {
            const id = school.schoolId;
            const currentType = selectedTypes[id]?.value;
            return (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{school.districtName}</td>
                <td>{school.schoolName}</td>
                <td>
                  <Select
                    options={subjects}
                    value={selectedSubjects[id] || null}
                    onChange={(val) => setSelectedSubjects(prev => ({ ...prev, [id]: val }))}
                    placeholder="Subject"
                  />
                </td>
                <td>
                  <Select
                    options={types}
                    value={selectedTypes[id] || null}
                    onChange={(val) => {
                      setSelectedTypes(prev => ({ ...prev, [id]: val }));
                      setSelectedStatuses(prev => ({ ...prev, [id]: [] }));
                    }}
                    placeholder="Type"
                  />
                </td>
                <td>
                  <Select
                    options={statusOptions[currentType] || []}
                    value={selectedStatuses[id] || []}
                    onChange={(val) => setSelectedStatuses(prev => ({ ...prev, [id]: val }))}
                    placeholder="Status"
                    isMulti
                    closeMenuOnSelect={false}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={remarks[id] || ""}
                    onChange={(e) => setRemarks(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder="Remark"
                  />
                </td>
                <td>
                  <button className="btn btn-success" onClick={() => handleSubmit(school)}>Submit</button>
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
