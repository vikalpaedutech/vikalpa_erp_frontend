// import React, { useState, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from "./DistrictBlockSchool.json";
// import Select from "react-select";
// import {
//   createCenterOrSchoolDisciplinary,
// } from "../../service/MbCentersDisciplinary.services";
// import { Breadcrumb, ListGroup, Table, Row, Col, Container } from "react-bootstrap";
// import { CenterDisciplinaryData } from "./CenterDisciplinaryData";

// const subjects = [
//   { value: "English", label: "English" },
//   { value: "Hindi", label: "Hindi" },
//   { value: "Maths", label: "Maths" },
//   { value: "Physics", label: "Physics" },
//   { value: "Chemistry", label: "Chemistry" },
//   { value: "Bio", label: "Bio" },
//   { value: "S.St", label: "S.St" },
//   { value: "Optional", label: "Optional" },
// ];

// const types = [
//   { value: "Disciplinary", label: "Disciplinary" },
//   { value: "Interaction", label: "Interaction" },
// ];

// const statusOptions = {
//   Disciplinary: [
//     { value: "Indiscipline", label: "Indiscipline" },
//     { value: "Not Attentive", label: "Not Attentive" },
//     { value: "Lack Of Focus", label: "Lack Of Focus" },
//   ],
//   Interaction: [
//     { value: "Student-Teacher", label: "Student-Teacher" },
//     { value: "Teacher-Student", label: "Teacher-Student" },

//   ],
// };

// const MbCentersDisciplinary = () => {
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;

//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
//   const [selectedClass, setSelectedClass] = useState("9");
//   const [showDataTable, setShowDataTable] = useState(false);

//   const [remarks, setRemarks] = useState({});
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);

//   const districts = [...new Map(DistrictBlockSchool.map(item => [item.districtId, { value: item.districtId, label: item.districtName }])).values()];
//   const blocks = selectedDistrict
//     ? [...new Map(DistrictBlockSchool.filter(d => d.districtId === selectedDistrict.value).map(b => [b.blockId, { value: b.blockId, label: b.blockName }])).values()]
//     : [];
//   const schools = selectedBlock
//     ? DistrictBlockSchool.filter(s => s.blockId === selectedBlock.value).map(s => ({ value: s.schoolId, label: s.schoolName }))
//     : [];

//   const filteredData = DistrictBlockSchool.filter(item => {
//     return (
//       (!selectedDistrict || item.districtId === selectedDistrict.value) &&
//       (!selectedBlock || item.blockId === selectedBlock.value) &&
//       (!selectedSchool || item.schoolId === selectedSchool.value)
//     );
//   });

//   const handleClearFilters = () => {
//     setSelectedDistrict(null);
//     setSelectedBlock(null);
//     setSelectedSchool(null);
//     setSelectedSubject(null);
//     setSelectedType(null)
//     setShowDataTable(false)
//   };

//   const handleRemarkSubmit = async (school, statusValue) => {
//     if (!selectedSubject || !selectedType) {
//       alert("Please select subject.");
//       return;
//     }

//     const id = school.schoolId;
//     const submission = {
//       districtName: school.districtName,
//       blockName: school.blockName,
//       schoolName: school.schoolName,
//       classOfStudent: selectedClass,
//       subject: selectedSubject?.value,
//       disciplinaryOrInteraction: selectedType?.value,
//       disciplinaryOrInteractiionRemark: statusValue,
//       remark: remarks[id] || "",
//       userId: userId
//     };

//     try {
//       await createCenterOrSchoolDisciplinary(submission);
//       //alert("Remark submitted successfully!");
//       setRemarks(prev => ({ ...prev, [id]: "" }));
//     } catch (err) {
//       alert("Failed to submit.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h4>Center/School Disciplinary Records</h4>
    
//       <ListGroup className="mb-centers-disciplinary-list" horizontal >
//         <ListGroup.Item action variant="success"  onClick={() => setSelectedClass("9")}>9</ListGroup.Item>
//         <ListGroup.Item action variant="success"  onClick={() => setSelectedClass("10")}>10</ListGroup.Item>
//         <ListGroup.Item action variant="success" onClick={() => setShowDataTable(true)}>View</ListGroup.Item>
//       </ListGroup>
//     <br/>
//       <div  className = 'center-disciplinary-dropdown'> 
//         <Select options={districts} value={selectedDistrict} onChange={setSelectedDistrict} placeholder="Select District" />
//         <Select options={blocks} value={selectedBlock} onChange={setSelectedBlock} placeholder="Select Block" />
//         <Select options={schools} value={selectedSchool} onChange={setSelectedSchool} placeholder="Select School" />
       
//       </div>
//     <br/>
//       <div className = 'center-disciplinary-dropdown'>
//         <Select
//           options={subjects}
//           value={selectedSubject}
//           onChange={setSelectedSubject}
//           placeholder="Select Subject"
//         />
//         <Select
//           options={types}
//           value={selectedType}
//           onChange={setSelectedType}
//           placeholder="Select Type"
//         />

//          <button className="btn btn-outline-secondary" onClick={handleClearFilters}>Clear Filters</button>
//       </div>

//       {
//         !showDataTable ? (

//           <Table 
          
//           bordered
//           hover
//           responsive
//           className="mt-4 text-center align-middle">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>District</th>
//             <th>School</th>
//             {/* <th>Remark</th> */}
//             <th>Status Buttons</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((school, index) => {
//             const id = school.schoolId;
//             const statuses = selectedType ? statusOptions[selectedType.value] : [];

//             return (
//               <tr key={id}>
//                 <td>{index + 1}</td>
//                 <td>{school.districtName}</td>
//                 <td>{school.schoolName}</td>
//                 {/* <td>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={remarks[id] || ""}
//                     onChange={(e) => setRemarks(prev => ({ ...prev, [id]: e.target.value }))}
//                     placeholder="Remark"
//                   />
//                 </td> */}
//                 <td>
//                   <div className="d-flex flex-wrap gap-2">
//                     {statuses.map(status => (
//                       <button
//                         key={status.value}
//                         className="btn btn-sm btn-primary"
//                         onClick={() => handleRemarkSubmit(school, status.value)}
//                       >
//                         {status.label}
//                       </button>
//                     ))}
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>
//         ):(
//           <div>

//             <CenterDisciplinaryData/>

//           </div>
//         )
//       }
//     </div>
//   );
// };

// export default MbCentersDisciplinary;











import React, { useState, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from "./DistrictBlockSchool.json";
import Select from "react-select";
import {
  createCenterOrSchoolDisciplinary,
} from "../../service/MbCentersDisciplinary.services";
import { Breadcrumb, ListGroup, Table, Row, Col, Container } from "react-bootstrap";
import { CenterDisciplinaryData } from "./CenterDisciplinaryData";

const subjects = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Maths", label: "Maths" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Bio", label: "Bio" },
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
    // { value: "Lack Of Focus", label: "Lack Of Focus" },
  ],
  Interaction: [
    { value: "Teacher-Student", label: "Teacher-Student" },
    { value: "Student-Doubt", label: "Student-Doubt" },

  ],
};

const MbCentersDisciplinary = () => {
  const { userData } = useContext(UserContext);
  const userId = userData?.[0]?.userId;

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null); // ✅ changed from "9"
  const [showDataTable, setShowDataTable] = useState(false);

  const [remarks, setRemarks] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [searchText, setSearchText] = useState(""); // ✅ new search field
  const [clickedButtonId, setClickedButtonId] = useState(null); // ✅ new state for animation

  const districts = [...new Map(DistrictBlockSchool.map(item => [item.districtId, { value: item.districtId, label: item.districtName }])).values()];
  const blocks = selectedDistrict
    ? [...new Map(DistrictBlockSchool.filter(d => d.districtId === selectedDistrict.value).map(b => [b.blockId, { value: b.blockId, label: b.blockName }])).values()]
    : [];
  const schools = selectedBlock
    ? DistrictBlockSchool.filter(s => s.blockId === selectedBlock.value).map(s => ({ value: s.schoolId, label: s.schoolName }))
    : [];

  const filteredData = DistrictBlockSchool.filter(item => {
    const query = searchText.toLowerCase();
    return (
      item.districtName.toLowerCase().includes(query) ||
      item.blockName.toLowerCase().includes(query) ||
      item.schoolName.toLowerCase().includes(query)
    );
  }).sort((a, b) => a.districtName.localeCompare(b.districtName)); // ✅ sorted by district

  const handleClearFilters = () => {
    setSelectedDistrict(null);
    setSelectedBlock(null);
    setSelectedSchool(null);
    setSelectedSubject(null);
    setSelectedType(null)
    setSearchText(""); // ✅ reset search text
    setShowDataTable(false)
    setSelectedClass(null)
  };

  const handleRemarkSubmit = async (school, statusValue) => {
    const buttonKey = `${school.schoolId}-${statusValue}`;
    setClickedButtonId(buttonKey); // ✅ set the button to animate
    setTimeout(() => setClickedButtonId(null), 300); // ✅ reset after animation

    if (!selectedClass) {
      alert("Please select class.");
      return;
    }

    if (!selectedSubject || !selectedType) {
      alert("Please select subject.");
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
      
      <h4>Center/School Disciplinary Records</h4>
    
<ListGroup className="mb-centers-disciplinary-list" horizontal>
  <ListGroup.Item
    action
    variant={selectedClass === "9" ? "primary" : "success"}
    onClick={() => setSelectedClass("9")}
  >
    9
  </ListGroup.Item>
  <ListGroup.Item
    action
    variant={selectedClass === "10" ? "primary" : "success"}
    onClick={() => setSelectedClass("10")}
  >
    10
  </ListGroup.Item>
  <ListGroup.Item
    action
    variant="success"
    onClick={() => setShowDataTable(true)}
  >
    View
  </ListGroup.Item>
</ListGroup>
    <br/>
      <div  className = 'center-disciplinary-dropdown'> 
        <input
          type="text"
          className="form-control"
          placeholder="Search by District, Block or School"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    <br/>
      <div className = 'center-disciplinary-dropdown'>
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

         <button className="btn btn-outline-secondary" onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {
        !showDataTable ? (

          <Table 
          
          bordered
          hover
          responsive
          className="mt-4 text-center align-middle">
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
                        className={`btn btn-sm btn-primary ${clickedButtonId === `${school.schoolId}-${status.value}` ? "button-pressed" : ""}`}
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
      </Table>
        ):( 
          <div>
            <CenterDisciplinaryData/>
          </div>
        )
      }
    </div>
  );
};

export default MbCentersDisciplinary;