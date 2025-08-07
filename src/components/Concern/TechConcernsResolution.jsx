// // /FRONTEND/src/components/Concenr/TechConcernsResolution.jsx

// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import { Card, Row, Col, Form, Table, Container, Button } from "react-bootstrap";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getConcernsByQueryParameters, getConcernsPipeLineMethod, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";
// import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";

// export const TechConcernsResolution = () => {
//   // Context apis
//   const { userData, setUserData } = useContext(UserContext);
//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext, setClassContext } = useContext(ClassContext);

//   // Usestate hooks
//   const [concernData, setConcernData] = useState([]);
//   const [statusSelections, setStatusSelections] = useState({});
//   const [techVisitorRemark, setTechVisitorRemark] = useState({});
//   const [actionRecommended, setActionRecommended] = useState({});
//   const [activitySelections, setActivitySelections] = useState({});
//   const [commentInputs, setCommentInputs] = useState({});

//   const fetchTechConcerns = async () => {
//     let conditionalRole;
//     let conditionalDepartment;

//     if (userData?.[0]?.role === "ACI") {
//       conditionalRole = ["CC"];
//       conditionalDepartment = ["Community"];
//     } else if (userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRole = ["ACI", "CC"];
//       conditionalDepartment = ["Community"];
//     } else if (userData?.[0]?.role === "Community Manager") {
//       conditionalRole = ["ACI", "CC", "Community Incharge"];
//       conditionalDepartment = ["Community"];
//     }

//     const queryParams = {
//       userId: userData?.[0]?.userId,
//       concernType: 'Tech Concern',
//       role: userData?.[0]?.role,
//       conditionalRole: conditionalRole,
//       conditionalDepartment: conditionalDepartment
//     }

//     try {
//       const response = await getConcernsPipeLineMethod(queryParams);
//       setConcernData(response.data.data);
//     } catch (error) {
//       console.log('Error fetching concerns', error);
//     }
//   }

//   useEffect(() => {
//     fetchTechConcerns()
//   }, [classContext, districtContext, schoolContext])

//   const assignedDistricts = userData?.[0]?.assignedDistricts;

//   const handleStatusChange = (selectedOption, concernId) => {
//     setStatusSelections({ ...statusSelections, [concernId]: selectedOption?.value });
//     if (selectedOption?.value !== "Visited") {
//       setTechVisitorRemark(prev => ({ ...prev, [concernId]: null }));
//     }
//   };

//   const handleVisitorRemarkChange = (selectedOption, concernId) => {
//     setTechVisitorRemark({ ...techVisitorRemark, [concernId]: selectedOption?.value });
//   };

//   const handleActivityChange = (selectedOption, concernId) => {
//     setActivitySelections({ ...activitySelections, [concernId]: selectedOption?.value });
//   };

//   const handleActionRecommendedChange = (selectedOption, concernId) => {
//     setActionRecommended({ ...actionRecommended, [concernId]: selectedOption?.value });
//   };

//   const handleCommentChange = (e, concernId) => {
//     setCommentInputs({ ...commentInputs, [concernId]: e.target.value });
//   };

//    const handleSubmitStatus = async (concernId) => {
//     const selectedStatus = statusSelections[concernId];
//     const visitorRemark = techVisitorRemark[concernId];
//     const activity = activitySelections[concernId];
//     const action = actionRecommended[concernId];
//     const comment = commentInputs[concernId]; // user typed comment

//     if (!selectedStatus) return;

//     try {
//       const query = { concernId: concernId };

//       const payload = {
//         concernStatusByResolver: selectedStatus,
//         ...(visitorRemark && { techVisitorRemark: visitorRemark }),
//         ...(activity && { activityOfPersonWhoResolvesTechConcerns: activity }),
//         ...(action && { actionRecommended: action }),
//         ...(comment && { commentByResolver: comment }), // 🔁 Updated here
//       };

//       await PatchConcernsByQueryParams(query, payload);
//       fetchTechConcerns();
//     } catch (error) {
//       console.log("Error updating concern status", error);
//     }
//   };

//   const options = [
//     { value: "Resolved", label: "Resolved" },
//     { value: "Pending", label: "Pending" },
//     { value: "Working on it", label: "Working on it" },
//   ];

//   const activityOptions = [
//     { value: "Center Visited", label: "Center Visited" },
//     { value: "Called", label: "Called" },
//   ];

//   const actionOptions = [
//     { value: "New Purchasing Required", label: "New Purchasing Required" },
//     { value: "Repairing Required", label: "Repairing Required" },
//   ];

//   return (
//     <Container>
//       <div><DistrictBlockSchoolById assignedDistricts={assignedDistricts} /></div>
//       <div><ClassOfStudent /></div>
//       <hr />

//       <div>
//         {concernData.length > 0 ? concernData.map((eachConcern, index) => {
//           let progressPercent = 0;

//           if (eachConcern.concernStatusBySubmitter === "Resolved") {
//             progressPercent = 100;
//           } else if (eachConcern.concernStatusByResolver === "Visited") {
//             progressPercent = 50;
//           } else if (eachConcern.concernStatusBySubmitter === "Not Resolved") {
//             progressPercent = 0;
//           }

//           return (
//             <div key={index}>
//               <br />
//               <Card style={{ width: "18rem" }}>
//                 <Card.Body>
//                   <Card.Title>Tech Concern: {eachConcern.concern}</Card.Title>
//                   <Card.Title>Issue: {eachConcern.remark}</Card.Title>
//                   <Card.Title>Class: {eachConcern.classOfConcern}</Card.Title>
//                   <Card.Text>
//                     <p>District: {eachConcern.districtDetails.districtName}</p>
//                     <p>Center: {eachConcern.schoolDetails.schoolName}</p>
//                     <br />
//                   </Card.Text>

//                   <div className="custom-progress-container">
//   {(() => {
//     let progressPercent = 0;
//     if (eachConcern.concernStatusBySubmitter === "Resolved") {
//       progressPercent = 100;
//     } else if (eachConcern.concernStatusByResolver === "Resolved") {
//       progressPercent = 66;
//     } else if (eachConcern.activityOfPersonWhoResolvesTechConcerns) {
//       progressPercent = 33;
//     }

//     return (
//       <>
//         <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
//         <div className="checkpoints">

//           {/* Step 1: Requested */}
//           <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
//             <span>1</span>
//             <div className="checkpoint-label">
//               <span>Requested<br />technician</span>
//             </div>
//           </div>

//           {/* Step 2: Activity Done */}
//           <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
//             <span>2</span>
//             <div className="checkpoint-label">
//               {eachConcern.activityOfPersonWhoResolvesTechConcerns || "Activity"}
//             </div>
//           </div>

//           {/* Step 3: Resolved */}
//           <div className={`checkpoint ${progressPercent >= 66 ? "active" : ""}`} style={{ left: "66%" }}>
//             <span>3</span>
//             <div className="checkpoint-label">Resolved</div>
//           </div>

//           {/* Step 4: Submitter Confirmed */}
//           <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
//             <span>4</span>
//             <div className="checkpoint-label">Closed</div>
//           </div>

//         </div>
//       </>
//     );
//   })()}
// </div>

//                   <br />
//                   <hr />
//                   <span style={{ fontWeight: 'bold' }}>
//                     Technician-Remark: {eachConcern.techVisitorRemark || null}
//                   </span>
//                   <br />
//                   <hr />

//                   {userData[0].role === "ACI" && (
//                     <>
                   

//                       <br />

//                       <label><strong>Technician Activity:</strong></label>
//                       <Select
//                         options={activityOptions}
//                         onChange={(selected) => handleActivityChange(selected, eachConcern.concernId)}
//                         value={activityOptions.find((opt) => opt.value === activitySelections[eachConcern.concernId]) || null}
//                         placeholder="-- Select Activity --"
//                       />

//                       <br />

//                       <label><strong>Action Recommended:</strong></label>
//                       <Select
//                         options={actionOptions}
//                         onChange={(selected) => handleActionRecommendedChange(selected, eachConcern.concernId)}
//                         value={actionOptions.find((opt) => opt.value === actionRecommended[eachConcern.concernId]) || null}
//                         placeholder="-- Action Required --"
//                       />

//                          <br />

//                        <label><strong>Status</strong></label>
//                       <Select
//                         options={options}
//                         onChange={(selected) => handleStatusChange(selected, eachConcern.concernId)}
//                         value={options.find((opt) => opt.value === statusSelections[eachConcern.concernId]) || null}
//                         placeholder="-- Select Status --"
//                       />

//                       <br />

//                       <Form.Group>
//                         <Form.Label>Optional Comment</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           placeholder="Any additional note..."
//                           value={commentInputs[eachConcern.concernId] || ''}
//                           onChange={(e) => handleCommentChange(e, eachConcern.concernId)}
//                         />
//                       </Form.Group>
//                     </>
//                   )}

//                   <br />
//                   <Button id={eachConcern.concernId} variant="primary" onClick={() => handleSubmitStatus(eachConcern.concernId)}>
//                     Submit
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </div>
//           );
//         }) : (<div>No concerns yet</div>)}
//       </div>
//     </Container>
//   )
// }

























// // /FRONTEND/src/components/Concenr/TechConcernsResolution.jsx

// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import { Card, Row, Col, Form, Table, Container, Button } from "react-bootstrap";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getConcernsByQueryParameters, getConcernsPipeLineMethod, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";
// import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";

// export const TechConcernsResolution = () => {
//   const { userData, setUserData } = useContext(UserContext);
//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext, setClassContext } = useContext(ClassContext);

//   const [concernData, setConcernData] = useState([]);
//   const [statusSelections, setStatusSelections] = useState({});
//   const [techVisitorRemark, setTechVisitorRemark] = useState({});
//   const [actionRecommended, setActionRecommended] = useState({});
//   const [activitySelections, setActivitySelections] = useState({});
//   const [commentInputs, setCommentInputs] = useState({});

//   const fetchTechConcerns = async () => {
//     // alert(classContext?.[0]?.value)
//     let conditionalRole;
//     let conditionalDepartment;

//     if (userData?.[0]?.role === "ACI") {
//       conditionalRole = ["CC"];
//       conditionalDepartment = ["Community"];
//     } else if (userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator") {
//       conditionalRole = ["ACI", "CC"];
//       conditionalDepartment = ["Community"];
//     } else if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Technician") {
//       conditionalRole = ["ACI", "CC"];
//       conditionalDepartment = ["Community"];
//     }

//     const queryParams = {
//       userId: userData?.[0]?.userId,
//       concernType: 'Tech Concern',
//       role: userData?.[0]?.role,
//       conditionalRole: conditionalRole,
//       conditionalDepartment: conditionalDepartment,
//       districtId: districtContext?.[0]?.value || "",
//       blockId: blockContext?.[0]?.value || "",
//       schoolId: schoolContext?.[0]?.value || "",
//       classOfConcern: classContext?.value || ""
//     }


 


//     try {
//       const response = await getConcernsPipeLineMethod(queryParams);
//       setConcernData(response.data.data);

//       console.log(response.data.data)
//     } catch (error) {
//       console.log('Error fetching concerns', error);
//     }
//   }

//   useEffect(() => {
//     fetchTechConcerns()
//   }, [classContext, districtContext, blockContext, schoolContext])

//   const assignedDistricts = userData?.[0]?.assignedDistricts;

//   const handleStatusChange = (selectedOption, concernId) => {
//     setStatusSelections({ ...statusSelections, [concernId]: selectedOption?.value });
//     if (selectedOption?.value !== "Visited") {
//       setTechVisitorRemark(prev => ({ ...prev, [concernId]: null }));
//     }
//   };

//   const handleVisitorRemarkChange = (selectedOption, concernId) => {
//     setTechVisitorRemark({ ...techVisitorRemark, [concernId]: selectedOption?.value });
//   };

//   const handleActivityChange = (selectedOption, concernId) => {
//     setActivitySelections({ ...activitySelections, [concernId]: selectedOption?.value });
//   };

//   const handleActionRecommendedChange = (selectedOption, concernId) => {
//     setActionRecommended({ ...actionRecommended, [concernId]: selectedOption?.value });
//   };

//   const handleCommentChange = (e, concernId) => {
//     setCommentInputs({ ...commentInputs, [concernId]: e.target.value });
//   };

//   const handleSubmitStatus = async (concernId) => {
//     const selectedStatus = statusSelections[concernId];
//     const visitorRemark = techVisitorRemark[concernId];
//     const activity = activitySelections[concernId];
//     const action = actionRecommended[concernId];
//     const comment = commentInputs[concernId];

//     if (!selectedStatus) return;

//     try {
//       const query = { concernId: concernId };

//       const payload = {
//         concernStatusByResolver: selectedStatus,
//         ...(visitorRemark && { techVisitorRemark: visitorRemark }),
//         ...(activity && { activityOfPersonWhoResolvesTechConcerns: activity }),
//         ...(action && { actionRecommended: action }),
//         ...(comment && { commentByResolver: comment }),
//       };

//       await PatchConcernsByQueryParams(query, payload);
//       fetchTechConcerns();
//     } catch (error) {
//       console.log("Error updating concern status", error);
//     }
//   };

//   const options = [
//     { value: "Resolved", label: "Resolved" },
//     { value: "Pending", label: "Pending" },
//     { value: "Working on it", label: "Working on it" },
//   ];

//   const activityOptions = [
//     { value: "Center Visited", label: "Center Visited" },
//     { value: "Called", label: "Called" },
//   ];

//   const actionOptions = [
//     { value: "New Purchasing Required", label: "New Purchasing Required" },
//     { value: "Repairing Required", label: "Repairing Required" },
//   ];

//   return (
//     <Container>
//       <div><DistrictBlockSchoolById assignedDistricts={assignedDistricts} /></div>
//       <div><ClassOfStudent /></div>
//       <hr />

//       <div>
//         {concernData.length > 0 ? concernData.map((eachConcern, index) => {
//           let progressPercent = 0;

//           if (eachConcern.concernStatusBySubmitter === "Resolved") {
//             progressPercent = 100;
//           } else if (eachConcern.concernStatusByResolver === "Resolved") {
//             progressPercent = 66;
//           } else if (eachConcern.activityOfPersonWhoResolvesTechConcerns) {
//             progressPercent = 33;
//           }


//           //style={{ width: "18rem" }}
//           return (
//             <div key={index}>
//               <br />
//               <Card >
//                 <Card.Body>
//                   <Card.Title>Tech Concern: {eachConcern.concern}</Card.Title>
//                   <Card.Title>Issue: {eachConcern.remark}</Card.Title>
//                   <Card.Title>Class: {eachConcern.classOfConcern}</Card.Title>
//                   <Card.Text>
//                     <p>District: {eachConcern.districtDetails.districtName}</p>
//                     <p>Center: {eachConcern.schoolDetails.schoolName}</p>
//                     <br />
//                   </Card.Text>

//                   {/* Progress Bar */}
//                   <div className="custom-progress-container">
//                     {(() => {
//                       return (
//                         <>
//                           <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
//                           <div className="checkpoints">
//                             <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
//                               <span>1</span>
//                               <div className="checkpoint-label">Requested<br />technician</div>
//                             </div>
//                             <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
//                               <span>2</span>
//                               <div className="checkpoint-label">{eachConcern.activityOfPersonWhoResolvesTechConcerns || "Activity"}</div>
//                             </div>
//                             <div className={`checkpoint ${progressPercent >= 66 ? "active" : ""}`} style={{ left: "66%" }}>
//                               <span>3</span>
//                               <div className="checkpoint-label">Resolved</div>
//                             </div>
//                             <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
//                               <span>4</span>
//                               <div className="checkpoint-label">Closed</div>
//                             </div>
//                           </div>
//                         </>
//                       );
//                     })()}
//                   </div>

//                   <br />
//                   <hr />
//                   <span style={{ fontWeight: 'bold' }}>
//                     Technician-Remark: {eachConcern.techVisitorRemark || null}
//                   </span>
//                   <br />
//                   <hr />

//                   {/* Additional Fields for ACI */}
//                   {userData[0].role === "Technician" && (
//                     <>
//                       <label><strong>Technician Activity:</strong></label>
//                       <Select
//                         options={activityOptions}
//                         onChange={(selected) => handleActivityChange(selected, eachConcern.concernId)}
//                         value={activityOptions.find((opt) => opt.value === activitySelections[eachConcern.concernId]) || null}
//                         placeholder="-- Select Activity --"
//                       />

//                       {/* Only show the rest if activity is selected */}
//                       {activitySelections[eachConcern.concernId] && (
//                         <>
//                           <br />
//                           <label><strong>Action Recommended:</strong></label>
//                           <Select
//                             options={actionOptions}
//                             onChange={(selected) => handleActionRecommendedChange(selected, eachConcern.concernId)}
//                             value={actionOptions.find((opt) => opt.value === actionRecommended[eachConcern.concernId]) || null}
//                             placeholder="-- Action Required --"
//                           />

//                           <br />
//                           <label><strong>Status</strong></label>
//                           <Select
//                             options={options}
//                             onChange={(selected) => handleStatusChange(selected, eachConcern.concernId)}
//                             value={options.find((opt) => opt.value === statusSelections[eachConcern.concernId]) || null}
//                             placeholder="-- Select Status --"
//                           />

//                           <br />
//                           <Form.Group>
//                             <Form.Label>Optional Comment</Form.Label>
//                             <Form.Control
//                               as="textarea"
//                               rows={2}
//                               placeholder="Any additional note..."
//                               value={commentInputs[eachConcern.concernId] || ''}
//                               onChange={(e) => handleCommentChange(e, eachConcern.concernId)}
//                             />
//                           </Form.Group>
//                         </>
//                       )}
//                     </>
//                   )}

//                   <br />

//                   <Button
//                     id={eachConcern.concernId}
//                     variant="primary"
//                     onClick={() => handleSubmitStatus(eachConcern.concernId)}
//                   >
//                     Submit
//                   </Button>

//                   {/* Show DB comment if exists */}
//                   {eachConcern.comment && (
//                     <>
//                       <hr />
//                       <span><strong>Submitter Comment:</strong> {eachConcern.comment}</span>
//                     </>
//                   )}
//                 </Card.Body>
//               </Card>
//             </div>
//           );
//         }) : (<div>No concerns yet</div>)}
//       </div>
//     </Container>
//   )
// }

































// /FRONTEND/src/components/Concenr/TechConcernsResolution.jsx

import React from "react";
import { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Form, Table, Container, Button } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, getConcernsPipeLineMethod, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json";

export const TechConcernsResolution = () => {
  const { userData, setUserData } = useContext(UserContext);
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext, setClassContext } = useContext(ClassContext);

  const [concernData, setConcernData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({});
  const [techVisitorRemark, setTechVisitorRemark] = useState({});
  const [actionRecommended, setActionRecommended] = useState({});
  const [activitySelections, setActivitySelections] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const fetchTechConcerns = async () => {
    let conditionalRole;
    let conditionalDepartment;

    if (userData?.[0]?.role === "ACI") {
      conditionalRole = ["CC"];
      conditionalDepartment = ["Community"];
    } else if (userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator") {
      conditionalRole = ["ACI", "CC"];
      conditionalDepartment = ["Community"];
    } else if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Technician") {
      conditionalRole = ["ACI", "CC"];
      conditionalDepartment = ["Community"];
    }

    const queryParams = {
      userId: userData?.[0]?.userId,
      concernType: 'Tech Concern',
      role: userData?.[0]?.role,
      conditionalRole: conditionalRole,
      conditionalDepartment: conditionalDepartment,
      districtId: districtContext?.[0]?.value || "",
      blockId: blockContext?.[0]?.value || "",
      schoolId: schoolContext?.[0]?.value || "",
      classOfConcern: classContext?.value || ""
    }

    try {
      const response = await getConcernsPipeLineMethod(queryParams);
      setConcernData(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.log('Error fetching concerns', error);
    }
  }

  useEffect(() => {
    fetchTechConcerns()
  }, [classContext, districtContext, blockContext, schoolContext])

  const assignedDistricts = userData?.[0]?.assignedDistricts;

  const handleStatusChange = (selectedOption, concernId) => {
    setStatusSelections({ ...statusSelections, [concernId]: selectedOption?.value });
    if (selectedOption?.value !== "Visited") {
      setTechVisitorRemark(prev => ({ ...prev, [concernId]: null }));
    }
  };

  const handleVisitorRemarkChange = (selectedOption, concernId) => {
    setTechVisitorRemark({ ...techVisitorRemark, [concernId]: selectedOption?.value });
  };

  const handleActivityChange = (selectedOption, concernId) => {
    setActivitySelections({ ...activitySelections, [concernId]: selectedOption?.value });
  };

  const handleActionRecommendedChange = (selectedOption, concernId) => {
    setActionRecommended({ ...actionRecommended, [concernId]: selectedOption?.value });
  };

  const handleCommentChange = (e, concernId) => {
    setCommentInputs({ ...commentInputs, [concernId]: e.target.value });
  };

  const handleSubmitStatus = async (concernId) => {
    const selectedStatus = statusSelections[concernId];
    const visitorRemark = techVisitorRemark[concernId];
    const activity = activitySelections[concernId];
    const action = actionRecommended[concernId];
    const comment = commentInputs[concernId];

    if (!selectedStatus) return;

    try {
      const query = { concernId: concernId };

      const payload = {
        concernStatusByResolver: selectedStatus,
        ...(visitorRemark && { techVisitorRemark: visitorRemark }),
        ...(activity && { activityOfPersonWhoResolvesTechConcerns: activity }),
        ...(action && { actionRecommended: action }),
        ...(comment && { commentByResolver: comment }),
      };

      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns();
    } catch (error) {
      console.log("Error updating concern status", error);
    }
  };

  const options = [
    { value: "Resolved", label: "Resolved" },
    { value: "Pending", label: "Pending" },
    { value: "Working on it", label: "Working on it" },
  ];

  const activityOptions = [
    { value: "Center Visited", label: "Center Visited" },
    { value: "Called", label: "Called" },
  ];

  const actionOptions = [
    { value: "New Purchasing Required", label: "New Purchasing Required" },
    { value: "Repairing Required", label: "Repairing Required" },
  ];

  return (
    <Container>
      <div><DistrictBlockSchoolById assignedDistricts={assignedDistricts} /></div>
      <div><ClassOfStudent /></div>
      <hr />

      <div>
        {concernData.length > 0 ? concernData.map((eachConcern, index) => {
          let progressPercent = 0;

          if (eachConcern.concernStatusBySubmitter === "Resolved") {
            progressPercent = 100;
          } else if (eachConcern.concernStatusByResolver === "Resolved") {
            progressPercent = 66;
          } else if (eachConcern.activityOfPersonWhoResolvesTechConcerns) {
            progressPercent = 33;
          }

          const isDisabled = progressPercent === 100;

          return (
            <div key={index}>
              <br />
              <Card>
                <Card.Body>
                  <Card.Title>Tech Concern: {eachConcern.concern}</Card.Title>
                  <Card.Title>Issue: {eachConcern.remark}</Card.Title>
                  <Card.Title>Class: {eachConcern.classOfConcern}</Card.Title>
                  <Card.Text>
                    <p>District: {eachConcern.districtDetails.districtName}</p>
                    <p>Center: {eachConcern.schoolDetails.schoolName}</p>
                    <br />
                  </Card.Text>

                  <div className="custom-progress-container">
                    <>
                      <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                      <div className="checkpoints">
                        <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
                          <span>1</span>
                          <div className="checkpoint-label">Requested<br />technician</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
                          <span>2</span>
                          <div className="checkpoint-label">{eachConcern.activityOfPersonWhoResolvesTechConcerns || "Activity"}</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 66 ? "active" : ""}`} style={{ left: "66%" }}>
                          <span>3</span>
                          <div className="checkpoint-label">Resolved</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
                          <span>4</span>
                          <div className="checkpoint-label">Closed</div>
                        </div>
                      </div>
                    </>
                  </div>

                  <br />
                  <hr />
                  <span style={{ fontWeight: 'bold' }}>
                    Technician-Remark: {eachConcern.techVisitorRemark || null}
                  </span>
                  <br />
                  <hr />

                  {userData[0].role === "Technician" && (
                    <>
                      <label><strong>Technician Activity:</strong></label>
                      <Select
                        options={activityOptions}
                        onChange={(selected) => handleActivityChange(selected, eachConcern.concernId)}
                        value={activityOptions.find((opt) => opt.value === activitySelections[eachConcern.concernId]) || null}
                        placeholder="-- Select Activity --"
                        isDisabled={isDisabled}
                      />

                      {activitySelections[eachConcern.concernId] && (
                        <>
                          <br />
                          <label><strong>Action Recommended:</strong></label>
                          <Select
                            options={actionOptions}
                            onChange={(selected) => handleActionRecommendedChange(selected, eachConcern.concernId)}
                            value={actionOptions.find((opt) => opt.value === actionRecommended[eachConcern.concernId]) || null}
                            placeholder="-- Action Required --"
                            isDisabled={isDisabled}
                          />

                          <br />
                          <label><strong>Status</strong></label>
                          <Select
                            options={options}
                            onChange={(selected) => handleStatusChange(selected, eachConcern.concernId)}
                            value={options.find((opt) => opt.value === statusSelections[eachConcern.concernId]) || null}
                            placeholder="-- Select Status --"
                            isDisabled={isDisabled}
                          />

                          <br />
                          <Form.Group>
                            <Form.Label>Optional Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              placeholder="Any additional note..."
                              value={commentInputs[eachConcern.concernId] || ''}
                              onChange={(e) => handleCommentChange(e, eachConcern.concernId)}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </>
                      )}
                    </>
                  )}

                  <br />
                  <Button
                    id={eachConcern.concernId}
                    variant="primary"
                    onClick={() => handleSubmitStatus(eachConcern.concernId)}
                    disabled={isDisabled}
                  >
                    Submit
                  </Button>

                  {eachConcern.comment && (
                    <>
                      <hr />
                      <span><strong>Submitter Comment:</strong> {eachConcern.comment}</span>
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>
          );
        }) : (<div>No concerns yet</div>)}
      </div>
    </Container>
  )
}
