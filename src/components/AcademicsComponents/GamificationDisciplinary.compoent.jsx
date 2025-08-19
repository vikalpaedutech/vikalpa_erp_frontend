// //This is the GamificationDisciplinary.component.jsx


// // src/components/gamification/GamificationDisciplinary.jsx

// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from '../CentersOrSchools/DistrictBlockSchool.json'
// import { disciplinaryGamification, getDisciplinaryGamificationDocumentsForCurrentDate } from "../../service/GamificationDisciplinary.services";
// import { ListGroup, Table } from "react-bootstrap";



// const statusOptions = [
//   { value: "Poor", label: "Poor" },
//   { value: "Average", label: "Average" },
//   { value: "Good", label: "Good" },
//   { value: "Excellent", label: "Excellent" },
// ];

// export const GamificationDisciplinary = () => {
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [clickedButtonId, setClickedButtonId] = useState(null);


//   const [fetchedDisciplnaryData, setFetchedDisciplnaryData] = useState([])

//   // ✅ filter by search text
//   const filteredData = DistrictBlockSchool.filter((item) => {
//     const query = searchText.toLowerCase();
//     return (
//       item.districtName.toLowerCase().includes(query) ||
//       item.blockName.toLowerCase().includes(query) ||
//       item.schoolName.toLowerCase().includes(query)
//     );
//   }).sort((a, b) => a.districtName.localeCompare(b.districtName));

//   const handleClearFilters = () => {
//     setSelectedClass(null);
//     setSearchText("");
//   };

//   const handleStatusSubmit = async (school, statusValue) => {
//     const buttonKey = `${school.schoolId}-${statusValue}`;
//     setClickedButtonId(buttonKey);
//     setTimeout(() => setClickedButtonId(null), 300);

//     if (!selectedClass) {
//       alert("Please select class.");
//       return;
//     }

//     const submission = {
//       keyValue: "disciplinary",
//       disciplinaryValue: statusValue,
//       districtId: school.districtId,
//       blockName: school.blockId,
//       schoolId: school.schoolId,
//       classofStudent: selectedClass,
//       userId: userId,
//     };

//     try {
//       await disciplinaryGamification(submission);
//       console.log("Gamification submitted:", submission);
//     } catch (err) {
//       alert("Failed to submit.");
//       console.error(err);
//     }
//   };
  
 


//   // fetch ponitType: 'disciplinary' for current date only

//   const fetchdiscipllinaryGamification = async ()=>{


//     try {
      

//       const response = await getDisciplinaryGamificationDocumentsForCurrentDate();

//       console.log(response.data)

//       setFetchedDisciplnaryData(response.data);


//     } catch (error) {
      
//     }



//   }

//   useEffect(()=>{

//     fetchdiscipllinaryGamification();

//   }, [])


//   //------------------------------------------------------------
    

//   return (
//     <div className="container py-4">
//       <h4>Gamification – Disciplinary Rankings</h4>

//       {/* ✅ Class Selector */}
//       <ListGroup className="mb-centers-disciplinary-list" horizontal>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "9" ? "primary" : "success"}
//           onClick={() => setSelectedClass("9")}
//         >
//           9
//         </ListGroup.Item>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "10" ? "primary" : "success"}
//           onClick={() => setSelectedClass("10")}
//         >
//           10
//         </ListGroup.Item>
//       </ListGroup>

//       <br />

//       {/* ✅ Search Bar */}
//       <div className="center-disciplinary-dropdown">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by District, Block or School"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <button
//           className="btn btn-outline-secondary mt-2"
//           onClick={handleClearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* ✅ Table */}
//       <Table bordered hover responsive className="mt-4 text-center align-middle">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>District</th>
//             <th>School</th>
//             <th>Status Buttons</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((school, index) => (
//             <tr key={school.schoolId}>
//               <td>{index + 1}</td>
//               <td>{school.districtName}</td>
//               <td>{school.schoolName}</td>
//               <td>
//                 <div className="d-flex flex-wrap gap-2 justify-content-center">
//                   {statusOptions.map((status) => (
//                     <button
//                       key={status.value}
//                       className={`btn btn-sm btn-primary ${
//                         clickedButtonId === `${school.schoolId}-${status.value}`
//                           ? "button-pressed"
//                           : ""
//                       }`}
//                       onClick={() => handleStatusSubmit(school, status.value)}
//                     >
//                       {status.label}
//                     </button>
//                   ))}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };








// // src/components/gamification/GamificationDisciplinary.jsx

// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from '../CentersOrSchools/DistrictBlockSchool.json'
// import { disciplinaryGamification, getDisciplinaryGamificationDocumentsForCurrentDate } from "../../service/GamificationDisciplinary.services";
// import { ListGroup, Table } from "react-bootstrap";



// const statusOptions = [
//   { value: "Poor", label: "Poor" },
//   { value: "Average", label: "Average" },
//   { value: "Good", label: "Good" },
//   { value: "Excellent", label: "Excellent" },
// ];

// export const GamificationDisciplinary = () => {
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [clickedButtonId, setClickedButtonId] = useState(null);


//   const [fetchedDisciplnaryData, setFetchedDisciplnaryData] = useState([])

//   // ✅ filter by search text
//   const filteredData = DistrictBlockSchool.filter((item) => {
//     const query = searchText.toLowerCase();
//     return (
//       item.districtName.toLowerCase().includes(query) ||
//       item.blockName.toLowerCase().includes(query) ||
//       item.schoolName.toLowerCase().includes(query)
//     );
//   }).sort((a, b) => a.districtName.localeCompare(b.districtName));

//   const handleClearFilters = () => {
//     setSelectedClass(null);
//     setSearchText("");
//   };

//   // ✅ helper: check if school already reached 2 counts total
//   const isSchoolDisabled = (schoolId) => {
//     const schoolObj = fetchedDisciplnaryData.find(item => item.id === schoolId);
//     if (!schoolObj) return false;

//     const totalCount =
//       (schoolObj.disciplinaryRemark1Count || 0) +
//       (schoolObj.disciplinaryRemark2Count || 0) +
//       (schoolObj.disciplinaryRemark3Count || 0) +
//       (schoolObj.disciplinaryRemark4Count || 0);

//     return totalCount >= 2;
//   };

//   const handleStatusSubmit = async (school, statusValue) => {
//     const buttonKey = `${school.schoolId}-${statusValue}`;
//     setClickedButtonId(buttonKey);
//     setTimeout(() => setClickedButtonId(null), 300);

//     if (!selectedClass) {
//       alert("Please select class.");
//       return;
//     }

//     // ✅ check before posting if disabled
//     if (isSchoolDisabled(school.schoolId)) {
//       alert("This school has already received maximum rankings for today.");
//       return;
//     }

//     const submission = {
//       keyValue: "disciplinary",
//       disciplinaryValue: statusValue,
//       districtId: school.districtId,
//       blockName: school.blockId,
//       schoolId: school.schoolId,
//       classofStudent: selectedClass,
//       userId: userId,
//     };

//     try {
//       await disciplinaryGamification(submission);
//       console.log("Gamification submitted:", submission);

//       // ✅ fetch again to sync latest counts across devices
//       await fetchdiscipllinaryGamification();
//     } catch (err) {
//       alert("Failed to submit.");
//       console.error(err);
//     }
//   };
  
 


//   // fetch ponitType: 'disciplinary' for current date only

//   const fetchdiscipllinaryGamification = async ()=>{
//     try {
//       const response = await getDisciplinaryGamificationDocumentsForCurrentDate();
//       console.log(response.data)
//       setFetchedDisciplnaryData(response.data);
//     } catch (error) {
//       console.error("Error fetching disciplinary gamification:", error);
//     }
//   }

//   useEffect(()=>{
//     fetchdiscipllinaryGamification();
//   }, [])


//   //------------------------------------------------------------
    

//   return (
//     <div className="container py-4">
//       <h4>Gamification – Disciplinary Rankings</h4>

//       {/* ✅ Class Selector */}
//       <ListGroup className="mb-centers-disciplinary-list" horizontal>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "9" ? "primary" : "success"}
//           onClick={() => setSelectedClass("9")}
//         >
//           9
//         </ListGroup.Item>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "10" ? "primary" : "success"}
//           onClick={() => setSelectedClass("10")}
//         >
//           10
//         </ListGroup.Item>
//       </ListGroup>

//       <br />

//       {/* ✅ Search Bar */}
//       <div className="center-disciplinary-dropdown">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by District, Block or School"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <button
//           className="btn btn-outline-secondary mt-2"
//           onClick={handleClearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* ✅ Table */}
//       <Table bordered hover responsive className="mt-4 text-center align-middle">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>District</th>
//             <th>School</th>
//             <th>Status Buttons</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((school, index) => (
//             <tr key={school.schoolId}>
//               <td>{index + 1}</td>
//               <td>{school.districtName}</td>
//               <td>{school.schoolName}</td>
//               <td>
//                 <div className="d-flex flex-wrap gap-2 justify-content-center">
//                   {statusOptions.map((status) => (
//                     <button
//                       key={status.value}
//                       className={`btn btn-sm btn-primary ${
//                         clickedButtonId === `${school.schoolId}-${status.value}`
//                           ? "button-pressed"
//                           : ""
//                       }`}
//                       onClick={() => handleStatusSubmit(school, status.value)}
//                       disabled={isSchoolDisabled(school.schoolId)}
//                     >
//                       {status.label}
//                     </button>
//                   ))}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };








// // src/components/gamification/GamificationDisciplinary.jsx

// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from '../CentersOrSchools/DistrictBlockSchool.json'
// import { disciplinaryGamification, getDisciplinaryGamificationDocumentsForCurrentDate } from "../../service/GamificationDisciplinary.services";
// import { ListGroup, Table } from "react-bootstrap";



// const statusOptions = [
//   { value: "Poor", label: "Poor" },
//   { value: "Average", label: "Average" },
//   { value: "Good", label: "Good" },
//   { value: "Excellent", label: "Excellent" },
// ];

// export const GamificationDisciplinary = () => {
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [clickedButtonId, setClickedButtonId] = useState(null);


//   const [fetchedDisciplnaryData, setFetchedDisciplnaryData] = useState([])

//   // ✅ filter by search text
//   const filteredData = DistrictBlockSchool.filter((item) => {
//     const query = searchText.toLowerCase();
//     return (
//       item.districtName.toLowerCase().includes(query) ||
//       item.blockName.toLowerCase().includes(query) ||
//       item.schoolName.toLowerCase().includes(query)
//     );
//   }).sort((a, b) => a.districtName.localeCompare(b.districtName));

//   const handleClearFilters = () => {
//     setSelectedClass(null);
//     setSearchText("");
//   };

//   // ✅ helper: check if school already reached 2 counts total
//   const isSchoolDisabled = (schoolId) => {
//     const schoolObj = fetchedDisciplnaryData.find(item => item.id === schoolId);
//     if (!schoolObj) return false;

//     const totalCount =
//       (schoolObj.disciplinaryRemark1Count || 0) +
//       (schoolObj.disciplinaryRemark2Count || 0) +
//       (schoolObj.disciplinaryRemark3Count || 0) +
//       (schoolObj.disciplinaryRemark4Count || 0);

//     return totalCount >= 2;
//   };

//   const handleStatusSubmit = async (school, statusValue) => {
//     const buttonKey = `${school.schoolId}-${statusValue}`;
//     setClickedButtonId(buttonKey);
//     setTimeout(() => setClickedButtonId(null), 300);

//     if (!selectedClass) {
//       alert("Please select class.");
//       return;
//     }

//     // ✅ check before posting if disabled
//     if (isSchoolDisabled(school.schoolId)) {
//       alert("This school has already received maximum rankings for today.");
//       return;
//     }

//     const submission = {
//       keyValue: "disciplinary",
//       disciplinaryValue: statusValue,
//       districtId: school.districtId,
//       blockName: school.blockId,
//       schoolId: school.schoolId,
//       classofStudent: selectedClass,
//       userId: userId,
//     };

//     try {
//       await disciplinaryGamification(submission);
//       console.log("Gamification submitted:", submission);

//       // ✅ update local state immediately
//       setFetchedDisciplnaryData((prev) => {
//         const existing = prev.find((item) => item.id === school.schoolId);

//         if (existing) {
//           return prev.map((item) =>
//             item.id === school.schoolId
//               ? {
//                   ...item,
//                   [`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`]:
//                     (item[`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`] || 0) + 1,
//                 }
//               : item
//           );
//         } else {
//           return [
//             ...prev,
//             {
//               id: school.schoolId,
//               disciplinaryRemark1Count: statusValue === "Poor" ? 1 : 0,
//               disciplinaryRemark2Count: statusValue === "Average" ? 1 : 0,
//               disciplinaryRemark3Count: statusValue === "Good" ? 1 : 0,
//               disciplinaryRemark4Count: statusValue === "Excellent" ? 1 : 0,
//             },
//           ];
//         }
//       });

//       // ✅ also fetch again to sync latest counts across devices
//       fetchdiscipllinaryGamification();

//       fetchdiscipllinaryGamification();
//     } catch (err) {
//       alert("Failed to submit.");
//       console.error(err);
//     }
//   };
  
 


//   // fetch ponitType: 'disciplinary' for current date only

//   const fetchdiscipllinaryGamification = async ()=>{
//     try {
//       const response = await getDisciplinaryGamificationDocumentsForCurrentDate();
//       console.log(response.data)
//       setFetchedDisciplnaryData(response.data);
//     } catch (error) {
//       console.error("Error fetching disciplinary gamification:", error);
//     }
//   }

//   useEffect(()=>{
//     fetchdiscipllinaryGamification();
//   }, [])


//   //------------------------------------------------------------
    

//   return (
//     <div className="container py-4">
//       <h4>Gamification – Disciplinary Rankings</h4>

//       {/* ✅ Class Selector */}
//       <ListGroup className="mb-centers-disciplinary-list" horizontal>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "9" ? "primary" : "success"}
//           onClick={() => setSelectedClass("9")}
//         >
//           9
//         </ListGroup.Item>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "10" ? "primary" : "success"}
//           onClick={() => setSelectedClass("10")}
//         >
//           10
//         </ListGroup.Item>
//       </ListGroup>

//       <br />

//       {/* ✅ Search Bar */}
//       <div className="center-disciplinary-dropdown">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by District, Block or School"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <button
//           className="btn btn-outline-secondary mt-2"
//           onClick={handleClearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* ✅ Table */}
//       <Table bordered hover responsive className="mt-4 text-center align-middle">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>District</th>
//             <th>School</th>
//             <th>Status Buttons</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((school, index) => (
//             <tr key={school.schoolId}>
//               <td>{index + 1}</td>
//               <td>{school.districtName}</td>
//               <td>{school.schoolName}</td>
//               <td>
//                 <div className="d-flex flex-wrap gap-2 justify-content-center">
//                   {statusOptions.map((status) => (
//                     <button
//                       key={status.value}
//                       className={`btn btn-sm btn-primary ${
//                         clickedButtonId === `${school.schoolId}-${status.value}`
//                           ? "button-pressed"
//                           : ""
//                       }`}
//                       onClick={() => handleStatusSubmit(school, status.value)}
//                       disabled={isSchoolDisabled(school.schoolId)}
//                     >
//                       {status.label}
//                     </button>
//                   ))}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };



// // src/components/gamification/GamificationDisciplinary.jsx

// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from '../CentersOrSchools/DistrictBlockSchool.json'
// import { disciplinaryGamification, getDisciplinaryGamificationDocumentsForCurrentDate } from "../../service/GamificationDisciplinary.services";
// import { ListGroup, Table } from "react-bootstrap";



// const statusOptions = [
//   { value: "Poor", label: "Poor" },
//   { value: "Average", label: "Average" },
//   { value: "Good", label: "Good" },
//   { value: "Excellent", label: "Excellent" },
// ];

// export const GamificationDisciplinary = () => {
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [clickedButtonId, setClickedButtonId] = useState(null);


//   const [fetchedDisciplnaryData, setFetchedDisciplnaryData] = useState([])

//   // ✅ filter by search text
//   const filteredData = DistrictBlockSchool.filter((item) => {
//     const query = searchText.toLowerCase();
//     return (
//       item.districtName.toLowerCase().includes(query) ||
//       item.blockName.toLowerCase().includes(query) ||
//       item.schoolName.toLowerCase().includes(query)
//     );
//   }).sort((a, b) => a.districtName.localeCompare(b.districtName));

//   const handleClearFilters = () => {
//     setSelectedClass(null);
//     setSearchText("");
//   };

//   // ✅ helper: check if school already reached 2 counts total
//   const isSchoolDisabled = (schoolId) => {
//     const schoolObj = fetchedDisciplnaryData.find(item => item.id === schoolId);
//     if (!schoolObj) return false;

//     const totalCount =
//       (schoolObj.disciplinaryRemark1Count || 0) +
//       (schoolObj.disciplinaryRemark2Count || 0) +
//       (schoolObj.disciplinaryRemark3Count || 0) +
//       (schoolObj.disciplinaryRemark4Count || 0);

//     return totalCount >= 2;
//   };

//   const handleStatusSubmit = async (school, statusValue) => {
//     const buttonKey = `${school.schoolId}-${statusValue}`;
//     setClickedButtonId(buttonKey);
//     setTimeout(() => setClickedButtonId(null), 300);

//     if (!selectedClass) {
//       alert("Please select class.");
//       return;
//     }

//     // ✅ check before posting if disabled
//     if (isSchoolDisabled(school.schoolId)) {
//       alert("This school has already received maximum rankings for today.");
//       return;
//     }

//     const submission = {
//       keyValue: "disciplinary",
//       disciplinaryValue: statusValue,
//       districtId: school.districtId,
//       blockName: school.blockId,
//       schoolId: school.schoolId,
//       classofStudent: selectedClass,
//       userId: userId,
//     };

//     try {
//       await disciplinaryGamification(submission);
//       console.log("Gamification submitted:", submission);

//       // ✅ update local state immediately
//       setFetchedDisciplnaryData((prev) => {
//         const existing = prev.find((item) => item.id === school.schoolId);

//         if (existing) {
//           return prev.map((item) =>
//             item.id === school.schoolId
//               ? {
//                   ...item,
//                   [`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`]:
//                     (item[`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`] || 0) + 1,
//                 }
//               : item
//           );
//         } else {
//           return [
//             ...prev,
//             {
//               id: school.schoolId,
//               disciplinaryRemark1Count: statusValue === "Poor" ? 1 : 0,
//               disciplinaryRemark2Count: statusValue === "Average" ? 1 : 0,
//               disciplinaryRemark3Count: statusValue === "Good" ? 1 : 0,
//               disciplinaryRemark4Count: statusValue === "Excellent" ? 1 : 0,
//               point: 0, // new school default
//             },
//           ];
//         }
//       });

//       // ✅ also fetch again to sync latest counts across devices
//       fetchdiscipllinaryGamification();

//       fetchdiscipllinaryGamification();
//     } catch (err) {
//       alert("Failed to submit.");
//       console.error(err);
//     }
//   };
  
 


//   // fetch ponitType: 'disciplinary' for current date only

//   const fetchdiscipllinaryGamification = async ()=>{
//     try {
//       const response = await getDisciplinaryGamificationDocumentsForCurrentDate();
//       console.log(response.data)
//       setFetchedDisciplnaryData(response.data);
//     } catch (error) {
//       console.error("Error fetching disciplinary gamification:", error);
//     }
//   }

//   useEffect(()=>{
//     fetchdiscipllinaryGamification();
//   }, [])


//   //------------------------------------------------------------
    

//   return (
//     <div className="container py-4">
//       <h4>Gamification – Disciplinary Rankings</h4>

//       {/* ✅ Class Selector */}
//       <ListGroup className="mb-centers-disciplinary-list" horizontal>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "9" ? "primary" : "success"}
//           onClick={() => setSelectedClass("9")}
//         >
//           9
//         </ListGroup.Item>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "10" ? "primary" : "success"}
//           onClick={() => setSelectedClass("10")}
//         >
//           10
//         </ListGroup.Item>
//       </ListGroup>

//       <br />

//       {/* ✅ Search Bar */}
//       <div className="center-disciplinary-dropdown">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by District, Block or School"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <button
//           className="btn btn-outline-secondary mt-2"
//           onClick={handleClearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* ✅ Table */}
//       <Table bordered hover responsive className="mt-4 text-center align-middle">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>District</th>
//             <th>School</th>
//             <th>Status Buttons</th>
//             <th>Total Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((school, index) => {
//             const schoolData = fetchedDisciplnaryData.find((item) => item.id === school.schoolId);

//             return (
//               <tr key={school.schoolId}>
//                 <td>{index + 1}</td>
//                 <td>{school.districtName}</td>
//                 <td>{school.schoolName}</td>
//                 <td>
//                   <div className="d-flex flex-wrap gap-3 justify-content-center">
//                     {statusOptions.map((status, idx) => {
//                       const count =
//                         schoolData?.[`disciplinaryRemark${idx + 1}Count`] || 0;

//                       return (
//                         <div key={status.value} className="text-center">
//                           <button
//                             className={`btn btn-sm btn-primary ${
//                               clickedButtonId === `${school.schoolId}-${status.value}`
//                                 ? "button-pressed"
//                                 : ""
//                             }`}
//                             onClick={() => handleStatusSubmit(school, status.value)}
//                             disabled={isSchoolDisabled(school.schoolId)}
//                           >
//                             {status.label}
//                           </button>
//                           <div style={{ fontSize: "12px", marginTop: "2px" }}>
//                             {count}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </td>
//                 <td>
//                   {schoolData?.point ?? 0}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

























// // src/components/gamification/GamificationDisciplinary.jsx

// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import DistrictBlockSchool from '../CentersOrSchools/DistrictBlockSchool.json'
// import { disciplinaryGamification, getDisciplinaryGamificationDocumentsForCurrentDate } from "../../service/GamificationDisciplinary.services";
// import { ListGroup, Table } from "react-bootstrap";



// const statusOptions = [
//   { value: "Poor", label: "Poor" },
//   { value: "Average", label: "Average" },
//   { value: "Good", label: "Good" },
//   { value: "Excellent", label: "Excellent" },
// ];

// export const GamificationDisciplinary = () => {
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [clickedButtonId, setClickedButtonId] = useState(null);

//   const [fetchedDisciplnaryData, setFetchedDisciplnaryData] = useState([])

//   // ✅ filter by search text
//   const filteredData = DistrictBlockSchool.filter((item) => {
//     const query = searchText.toLowerCase();
//     return (
//       item.districtName.toLowerCase().includes(query) ||
//       item.blockName.toLowerCase().includes(query) ||
//       item.schoolName.toLowerCase().includes(query)
//     );
//   }).sort((a, b) => a.districtName.localeCompare(b.districtName));

//   const handleClearFilters = () => {
//     setSelectedClass(null);
//     setSearchText("");
//   };

//   // ✅ helper: check if school already reached 2 counts total
//   const isSchoolDisabled = (schoolId) => {
//     const schoolObj = fetchedDisciplnaryData.find(item => item.id === schoolId && item.classofStudent === selectedClass);
//     if (!schoolObj) return false;

//     const totalCount =
//       (schoolObj.disciplinaryRemark1Count || 0) +
//       (schoolObj.disciplinaryRemark2Count || 0) +
//       (schoolObj.disciplinaryRemark3Count || 0) +
//       (schoolObj.disciplinaryRemark4Count || 0);

//     return totalCount >= 2;
//   };

//   const handleStatusSubmit = async (school, statusValue) => {
//     const buttonKey = `${school.schoolId}-${statusValue}`;
//     setClickedButtonId(buttonKey);
//     setTimeout(() => setClickedButtonId(null), 300);

//     if (!selectedClass) {
//       alert("Please select class.");
//       return;
//     }

//     // ✅ check before posting if disabled
//     if (isSchoolDisabled(school.schoolId)) {
//       alert("This school has already received maximum rankings for today.");
//       return;
//     }

//     const submission = {
//       keyValue: "disciplinary",
//       disciplinaryValue: statusValue,
//       districtId: school.districtId,
//       blockName: school.blockId,
//       schoolId: school.schoolId,
//       classofStudent: selectedClass,
//       userId: userId,
//     };

//     try {
//       await disciplinaryGamification(submission);
//       console.log("Gamification submitted:", submission);

//       // ✅ update local state immediately
//       setFetchedDisciplnaryData((prev) => {
//         const existing = prev.find((item) => item.id === school.schoolId && item.classofStudent === selectedClass);

//         if (existing) {
//           return prev.map((item) =>
//             item.id === school.schoolId && item.classofStudent === selectedClass
//               ? {
//                   ...item,
//                   [`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`]:
//                     (item[`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`] || 0) + 1,
//                 }
//               : item
//           );
//         } else {
//           return [
//             ...prev,
//             {
//               id: school.schoolId,
//               classofStudent: selectedClass,
//               disciplinaryRemark1Count: statusValue === "Poor" ? 1 : 0,
//               disciplinaryRemark2Count: statusValue === "Average" ? 1 : 0,
//               disciplinaryRemark3Count: statusValue === "Good" ? 1 : 0,
//               disciplinaryRemark4Count: statusValue === "Excellent" ? 1 : 0,
//               point: 0, // new school default
//             },
//           ];
//         }
//       });

//       // ✅ also fetch again to sync latest counts across devices
//       fetchdiscipllinaryGamification();

//       fetchdiscipllinaryGamification();

//       fetchdiscipllinaryGamification();

//     } catch (err) {
//       alert("Failed to submit.");
//       console.error(err);
//     }
//   };
  
//   // fetch ponitType: 'disciplinary' for current date only
//   const fetchdiscipllinaryGamification = async ()=>{
//     try {
//       const response = await getDisciplinaryGamificationDocumentsForCurrentDate();
//       console.log(response.data)
//       setFetchedDisciplnaryData(response.data);
//     } catch (error) {
//       console.error("Error fetching disciplinary gamification:", error);
//     }
//   }

//   useEffect(()=>{
//     fetchdiscipllinaryGamification();
//   }, [])


//   //------------------------------------------------------------
    

//   return (
//     <div className="container py-4">
//       <h4>Gamification – Disciplinary Rankings</h4>

//       {/* ✅ Class Selector */}
//       <ListGroup className="mb-centers-disciplinary-list" horizontal>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "9" ? "primary" : "success"}
//           onClick={() => setSelectedClass("9")}
//         >
//           9
//         </ListGroup.Item>
//         <ListGroup.Item
//           action
//           variant={selectedClass === "10" ? "primary" : "success"}
//           onClick={() => setSelectedClass("10")}
//         >
//           10
//         </ListGroup.Item>
//       </ListGroup>

//       <br />

//       {/* ✅ Search Bar */}
//       <div className="center-disciplinary-dropdown">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by District, Block or School"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <button
//           className="btn btn-outline-secondary mt-2"
//           onClick={handleClearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* ✅ Table */}
//       {!selectedClass ? (
//         <div className="mt-4 text-center text-muted">
//           Please select class first.
//         </div>
//       ) : (
//         <Table bordered hover responsive className="mt-4 text-center align-middle">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>District</th>
//               <th>School</th>
//               <th>Status Buttons</th>
//               <th>Total Points</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((school, index) => {
//               const schoolData = fetchedDisciplnaryData.find(
//                 (item) => item.id === school.schoolId && item.classofStudent === selectedClass
//               );

//               return (
//                 <tr key={school.schoolId}>
//                   <td>{index + 1}</td>
//                   <td>{school.districtName}</td>
//                   <td>{school.schoolName}</td>
//                   <td>
//                     <div className="d-flex flex-wrap gap-3 justify-content-center">
//                       {statusOptions.map((status, idx) => {
//                         const count =
//                           schoolData?.[`disciplinaryRemark${idx + 1}Count`] || 0;

//                         return (
//                           <div key={status.value} className="text-center">
//                             <button
//                               className={`btn btn-sm btn-primary ${
//                                 clickedButtonId === `${school.schoolId}-${status.value}`
//                                   ? "button-pressed"
//                                   : ""
//                               }`}
//                               onClick={() => handleStatusSubmit(school, status.value)}
//                               disabled={isSchoolDisabled(school.schoolId)}
//                             >
//                               {status.label}
//                             </button>
//                             <div style={{ fontSize: "12px", marginTop: "2px" }}>
//                               {count}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </td>
//                   <td>
//                     {schoolData?.point ?? 0}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };





















// src/components/gamification/GamificationDisciplinary.jsx

import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../contextAPIs/User.context";
import DistrictBlockSchool from '../CentersOrSchools/DistrictBlockSchool.json'
import { disciplinaryGamification, getDisciplinaryGamificationDocumentsForCurrentDate } from "../../service/GamificationDisciplinary.services";
import { ListGroup, Table, Button } from "react-bootstrap";


const statusOptions = [
  { value: "Poor", label: "Poor" },
  { value: "Average", label: "Average" },
  { value: "Good", label: "Good" },
  { value: "Excellent", label: "Excellent" },
];

export const GamificationDisciplinary = () => {
  const { userData } = useContext(UserContext);
  const userId = userData?.[0]?.userId;

  const [selectedClass, setSelectedClass] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [clickedButtonId, setClickedButtonId] = useState(null);

  const [fetchedDisciplnaryData, setFetchedDisciplnaryData] = useState([])

  // ✅ filter by search text
  const filteredData = DistrictBlockSchool.filter((item) => {
    const query = searchText.toLowerCase();
    return (
      item.districtName.toLowerCase().includes(query) ||
      item.blockName.toLowerCase().includes(query) ||
      item.schoolName.toLowerCase().includes(query)
    );
  }).sort((a, b) => a.districtName.localeCompare(b.districtName));

  const handleClearFilters = () => {
    setSelectedClass(null);
    setSearchText("");
  };

  // ✅ helper: check if school already reached 2 counts total
  const isSchoolDisabled = (schoolId) => {
    const schoolObj = fetchedDisciplnaryData.find(item => item.id === schoolId && item.classofStudent === selectedClass);
    if (!schoolObj) return false;

    const totalCount =
      (schoolObj.disciplinaryRemark1Count || 0) +
      (schoolObj.disciplinaryRemark2Count || 0) +
      (schoolObj.disciplinaryRemark3Count || 0) +
      (schoolObj.disciplinaryRemark4Count || 0);

    return totalCount >= 2;
  };

  const handleStatusSubmit = async (school, statusValue) => {
    const buttonKey = `${school.schoolId}-${statusValue}`;
    setClickedButtonId(buttonKey);
    setTimeout(() => setClickedButtonId(null), 300);

    if (!selectedClass) {
      alert("Please select class.");
      return;
    }

    // ✅ check before posting if disabled
    if (isSchoolDisabled(school.schoolId)) {
      alert("This school has already received maximum rankings for today.");
      return;
    }

    const submission = {
      keyValue: "disciplinary",
      disciplinaryValue: statusValue,
      districtId: school.districtId,
      blockName: school.blockId,
      schoolId: school.schoolId,
      classofStudent: selectedClass,
      userId: userId,
    };

    try {
      await disciplinaryGamification(submission);
      console.log("Gamification submitted:", submission);

      // ✅ update local state immediately
      setFetchedDisciplnaryData((prev) => {
        const existing = prev.find((item) => item.id === school.schoolId && item.classofStudent === selectedClass);

        if (existing) {
          return prev.map((item) =>
            item.id === school.schoolId && item.classofStudent === selectedClass
              ? {
                  ...item,
                  [`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`]:
                    (item[`disciplinaryRemark${statusOptions.findIndex(opt => opt.value === statusValue) + 1}Count`] || 0) + 1,
                }
              : item
          );
        } else {
          return [
            ...prev,
            {
              id: school.schoolId,
              classofStudent: selectedClass,
              disciplinaryRemark1Count: statusValue === "Poor" ? 1 : 0,
              disciplinaryRemark2Count: statusValue === "Average" ? 1 : 0,
              disciplinaryRemark3Count: statusValue === "Good" ? 1 : 0,
              disciplinaryRemark4Count: statusValue === "Excellent" ? 1 : 0,
              point: 0, // new school default
            },
          ];
        }
      });

      // ✅ also fetch again to sync latest counts across devices
      fetchdiscipllinaryGamification();
      fetchdiscipllinaryGamification();
      fetchdiscipllinaryGamification();

    } catch (err) {
      alert("Failed to submit.");
      console.error(err);
    }
  };
  
  // fetch ponitType: 'disciplinary' for current date only
  const fetchdiscipllinaryGamification = async ()=>{
    try {
      const response = await getDisciplinaryGamificationDocumentsForCurrentDate();
      console.log(response.data)
      setFetchedDisciplnaryData(response.data);
    } catch (error) {
      console.error("Error fetching disciplinary gamification:", error);
    }
  }

  useEffect(()=>{
    fetchdiscipllinaryGamification();
  }, [])


  //------------------------------------------------------------
  // ✅ CSV Export Function
  const handleExportCSV = () => {
    if (!selectedClass) {
      alert("Please select class first.");
      return;
    }

    const headers = [
      "District",
      "School",
      "Poor Count",
      "Average Count",
      "Good Count",
      "Excellent Count",
      "Total Points",
      "Class"
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      // wrap in quotes if contains comma or quote
      if (str.includes(",") || str.includes("\"")) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const rows = filteredData.map((school) => {
      const schoolData = fetchedDisciplnaryData.find(
        (item) => item.id === school.schoolId && item.classofStudent === selectedClass
      );

      return [
        escapeCSV(school.districtName),
        escapeCSV(school.schoolName),
        schoolData?.disciplinaryRemark1Count || 0,
        schoolData?.disciplinaryRemark2Count || 0,
        schoolData?.disciplinaryRemark3Count || 0,
        schoolData?.disciplinaryRemark4Count || 0,
        schoolData?.point ?? 0,
        selectedClass
      ];
    });

    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `disciplinary_class_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //------------------------------------------------------------

  return (
    <div className="container py-4">
      <h4>Gamification – Disciplinary Rankings (Testing Phase)</h4>

      {/* ✅ Class Selector */}
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
      </ListGroup>

      <br />

      {/* ✅ Search Bar */}
      <div className="center-disciplinary-dropdown">
        <input
          type="text"
          className="form-control"
          placeholder="Search by District, Block or School"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary mt-2"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* ✅ Export CSV Button */}
      {selectedClass && (
        <div className="mt-3 text-end">
          <Button variant="success" onClick={handleExportCSV}>
            Export CSV (Class {selectedClass})
          </Button>
        </div>
      )}

      {/* ✅ Table */}
      {!selectedClass ? (
        <div className="mt-4 text-center text-muted">
          Please select class first.
        </div>
      ) : (
        <Table bordered hover responsive className="mt-4 text-center align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>District</th>
              <th>School</th>
              <th>Status Buttons</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((school, index) => {
              const schoolData = fetchedDisciplnaryData.find(
                (item) => item.id === school.schoolId && item.classofStudent === selectedClass
              );

              return (
                <tr key={school.schoolId}>
                  <td>{index + 1}</td>
                  <td>{school.districtName}</td>
                  <td>{school.schoolName}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                      {statusOptions.map((status, idx) => {
                        const count =
                          schoolData?.[`disciplinaryRemark${idx + 1}Count`] || 0;

                        return (
                          <div key={status.value} className="text-center">
                            <button
                              className={`btn btn-sm btn-primary ${
                                clickedButtonId === `${school.schoolId}-${status.value}`
                                  ? "button-pressed"
                                  : ""
                              }`}
                              onClick={() => handleStatusSubmit(school, status.value)}
                              disabled={isSchoolDisabled(school.schoolId)}
                            >
                              {status.label}
                            </button>
                            <div style={{ fontSize: "12px", marginTop: "2px" }}>
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    {schoolData?.point ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};
