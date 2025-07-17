// // /FRONTEND/src/components/Concern/IndividualConcernsRequests.jsx



// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import {Card, Row, Col, Form, Table, Container, Button} from "react-bootstrap"
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { SchoolContext, BlockContext,   DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getConcernsByQueryParameters, PatchConcernsByQueryParams, getIndividualConcerns } from "../../service/ConcernsServices/Concern.services";
// import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

// export const IndividualConcernsRequest = () =>{

// //Context apis
//     const {userData, setUserData} = useContext(UserContext);

//     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
    
//     const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
    
//     const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
    
//     const {classContext, setClassContext} = useContext(ClassContext);

// //Usestate hooks.
//     const [concernData, setConcernData] = useState([]);
//     const [statusSelections, setStatusSelections] = useState({});

// //API to fetch concerns data. Tech Concerns Only.
// const fetchTechConcerns = async () =>{
   


//   let conditionalRole;
//   let conditionalDepartment;

//   // if (userData?.[0]?.role==="ACI"){
//   //   conditionalRole = ["CC"]
//   //   conditionalDepartment = ["Community"]
//   // }
//   if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator"){
//     conditionalRole = ["ACI", "CC", "Community Incharge", "MIS",
// "Technician","Teacher","Project Coordinator","Photographer","MIS",
// "Media Manager" ,"DTP","Community Manager","Academic-Coordinator",

//     ]
//     conditionalDepartment = ["Community"]

  
//   } 




//     const queryParams = {
//          userId: userData?.[0]?.userId,
//          concernType: 'Individual',
//          role: userData?.[0]?.role, 
//          conditionalRole: conditionalRole,
//          conditionalDepartment: conditionalDepartment







//     // const queryParams = {
//     //      userId: userData?.[0]?.userId,
//     //      concernType: 'Individual'

//         //  districtId: districtContext?.[0]?.value || userData?.[0]?.assignedDistricts,
//         //  blockId: userData?.[0]?.assignedBlocks, 
//         //  schoolId: schoolContext?.[0]?.value || userData?.[0]?.assignedSchools,

//         //  classOfConcern: classContext.value || ['9', '10'],
//         //  concernType: 'Individual'

//     }
// console.log(queryParams)
//     try {
//         const response = await getIndividualConcerns(queryParams);

//         console.log(response.data.data)

//         setConcernData(response.data.data)

//     } catch (error) {
//         console.log('Error fetching concerns', error)
//     }
// }

// useEffect(()=>{
//  fetchTechConcerns()
// }, [classContext, districtContext, schoolContext])

// //dependencie of DistrictBlockSchoolById
 
// const assignedDistricts = userData?.[0]?.assignedDistricts


// //React selected status change

// const handleStatusChange = (selectedOption, concernId) => {
//     setStatusSelections({
//       ...statusSelections,
//       [concernId]: selectedOption?.value,
//     });
// };


// //Submitting concern status


// const handleSubmitStatus = async (concernId) => {
//     const selectedStatus = statusSelections[concernId];
//     if (!selectedStatus) return;

//     try {
//       const query = {
//         // userId: userData?.[0]?.userId,
//         concernId: concernId
//       };

//       const payload = {
//   // concernStatusByResolver: {
//   //   approvedBy: userData?.[0]?.userId,
//   //   approvedOn: new Date(),
//   //   comment: 'NA'
//   // }
//    concernStatusByResolver: selectedStatus,
// };
//       await PatchConcernsByQueryParams(query, payload);
//       fetchTechConcerns(); // refresh after update
//     } catch (error) {
//       console.log("Error updating concern status", error);
//     }
// };

// const progressPercent = 0;

// const options = [
//     { value: "Talked over call", label: "Talked over call" },
//     { value: "Working on it", label: "Working on it" },
//     { value: "Resolved", label: "Resolved" },
// ];

// // ✅ New: Format date to dd-mm-yyyy
// const formatDate = (isoString) => {
//     if (!isoString) return '';
//     const date = new Date(isoString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
// }

// //
//     return (
//         <Container>
//             <div>
//                 <DistrictBlockSchoolById assignedDistricts={assignedDistricts}/>
//             </div>
//             {/* <div>
//                 <ClassOfStudent/>
//             </div> */}
//             <hr/>
        
//         <div>
//             {concernData.length > 0 ? concernData.map((eachConcern, index)=>{
//                 return (
//                   <div key={index}>

//                     <br/>
//                     <Card style={{ width: "18rem" }}>
//                       {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
//                       <Card.Body>
//                         <Card.Title>Raised By: {eachConcern.userDetails.name}</Card.Title>
//                         <Card.Title>Subject: {eachConcern.concern}</Card.Title>
//                         <Card.Text>
//                           <p>Date: {formatDate(eachConcern.dateOfSubmission)} </p>
//                           {/* <p>Leave applied for: {eachConcern.totalDaysOfLeaveAppliedFor} days</p> */}
//                         </Card.Text>

//                         {/* <div className="custom-progress-container">
//                           <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
//                           <div className="checkpoints">
//                             <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
//                               <span>1</span>
//                               <div className="checkpoint-label">Pending</div>
//                             </div>
//                             <div className={`checkpoint ${progressPercent >= 50 ? "active" : ""}`} style={{ left: "50%" }}>
//                               <span>2</span>
//                               <div className="checkpoint-label">Visited</div>
//                             </div>
//                             <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
//                               <span>3</span>
//                               <div className="checkpoint-label">Resolved</div>
//                             </div>
//                           </div>
//                         </div>

//                         <br /> */}

                        
//                         <hr></hr>
//                         <p style={{fontWeight:'bold'}}>Description:</p>
//                         <p>{eachConcern.comment}</p>
//                         <hr></hr>

//                         {eachConcern.fileUrl ? (
//                             <div>
//                                 <p>Attachement: <a href={eachConcern.fileUrl}>View</a></p>
//                             </div>
//                         ):(
//                             <div>
//                                 <p>Attachment: No attachment.</p>
//                             </div>
//                         )}

//                         <Select
//                           options={options}
//                           onChange={(selected) => handleStatusChange(selected, eachConcern.concernId)}
//                           value={options.find((opt) => opt.value === statusSelections[eachConcern.concernId]) || null}
//                           placeholder="-- Select Status --"
//                           />




//                         <br />
//                         <Button id={eachConcern.concernId} variant="primary" onClick={(e) => handleSubmitStatus(eachConcern.concernId)}>
//                           Submit
//                         </Button>
//                       </Card.Body>
//                     </Card>

//                   </div>
//                 );
//             }):(<div>No concerns yet</div>)}
//         </div>
          
//         </Container>
//     )
// }






















// /FRONTEND/src/components/Concern/IndividualConcernsRequests.jsx

import React from "react";
import { useState, useEffect, useContext } from "react";
import {Card, Row, Col, Form, Table, Container, Button} from "react-bootstrap"
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext,   DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, PatchConcernsByQueryParams, getIndividualConcerns } from "../../service/ConcernsServices/Concern.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const IndividualConcernsRequest = () =>{

//Context apis
    const {userData, setUserData} = useContext(UserContext);

    const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
    
    const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
    
    const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
    
    const {classContext, setClassContext} = useContext(ClassContext);

//Usestate hooks.
    const [concernData, setConcernData] = useState([]);
    const [statusSelections, setStatusSelections] = useState({});

//API to fetch concerns data. Tech Concerns Only.
const fetchTechConcerns = async () =>{

  let conditionalRole;
  let conditionalDepartment;

  // if (userData?.[0]?.role==="ACI"){
  //   conditionalRole = ["CC"]
  //   conditionalDepartment = ["Community"]
  // }
  if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator"){
    conditionalRole = ["ACI", "CC", "Community Incharge", "MIS",
"Technician","Teacher","Project Coordinator","Photographer","MIS",
"Media Manager" ,"DTP","Community Manager","Academic-Coordinator"]
    conditionalDepartment = ["Community"]
  } 

    const queryParams = {
         userId: userData?.[0]?.userId,
         concernType: 'Individual',
         role: userData?.[0]?.role, 
         conditionalRole: conditionalRole,
         conditionalDepartment: conditionalDepartment
    }

    console.log(queryParams)

    try {
        const response = await getIndividualConcerns(queryParams);
        console.log(response.data.data)
        setConcernData(response.data.data)

        // Prefill dropdown selections
        const initialSelections = {};
        response.data.data.forEach((item) => {
          if (item.concernStatusByResolver) {
            initialSelections[item.concernId] = item.concernStatusByResolver;
          }
        });
        setStatusSelections(initialSelections);

    } catch (error) {
        console.log('Error fetching concerns', error)
    }
}

useEffect(()=>{
 fetchTechConcerns()
}, [classContext, districtContext, schoolContext])

//dependencie of DistrictBlockSchoolById
const assignedDistricts = userData?.[0]?.assignedDistricts

//React selected status change
const handleStatusChange = (selectedOption, concernId) => {
    setStatusSelections({
      ...statusSelections,
      [concernId]: selectedOption?.value,
    });
};

//Submitting concern status
const handleSubmitStatus = async (concernId) => {
    const selectedStatus = statusSelections[concernId];
    if (!selectedStatus) return;

    try {
      const query = {
        concernId: concernId
      };

      const payload = {
        concernStatusByResolver: selectedStatus,
      };

      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns(); // refresh after update
    } catch (error) {
      console.log("Error updating concern status", error);
    }
};

const progressPercent = 0;

const options = [
    { value: "Talked over call", label: "Talked over call" },
    { value: "Working on it", label: "Working on it" },
    { value: "Resolved", label: "Resolved" },
];

// ✅ New: Format date to dd-mm-yyyy
const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// ✅ New: Card color based on status
const getCardStyle = (status) => {
    if (status === "Talked over call" || status === "Working on it") {
        return { backgroundColor: "#FF8C00",  }; //width: "18rem"
    } else if (status === "Resolved") {
        return { backgroundColor: "#7FFFD4", }; //width: "18rem" 
    } else {
        return { backgroundColor: "white",  }; //width: "18rem"
    }
}

//
    return (
        <Container>
            {/* <div>
                <DistrictBlockSchoolById assignedDistricts={assignedDistricts}/>
            </div> */}
            {/* <div>
                <ClassOfStudent/>
            </div> */}
            <h1>Individual Concerns</h1>
            <hr/>
        
        <div>
            {concernData.length > 0 ? concernData.map((eachConcern, index)=>{
                const cardStyle = getCardStyle(eachConcern.concernStatusByResolver);
                const isResolved = eachConcern.concernStatusByResolver === "Resolved";
                return (
                  <div key={index}>
                    <br />
                    <Card style={cardStyle}>
                      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                      <Card.Body>
                        <Card.Title>
                          Current Status:{" "}
                          {eachConcern.concernStatusByResolver || "Not updated"}
                        </Card.Title>
                        <Card.Title>
                          Raised By: {eachConcern.userDetails.name}
                        </Card.Title>
                        <Card.Title>Subject: {eachConcern.concern}</Card.Title>

                        <Card.Text>
                          <p>
                            Role: {eachConcern.userDetails.role}{" "}
                          </p>
                          <p>
                            Date: {formatDate(eachConcern.dateOfSubmission)}{" "}
                          </p>
                        </Card.Text>

                        <Card.Text>
                          <p>
                            Contact:{" "}
                            <a href={`tel:${eachConcern.userDetails.contact1}`}>
                              {eachConcern.userDetails.contact1}
                            </a>
                          </p>
                          <p>
                            Alternate:{" "}
                            <a href={`tel:${eachConcern.userDetails.contact2}`}>
                              {eachConcern.userDetails.contact2}
                            </a>
                          </p>
                        </Card.Text>

                        <hr></hr>
                        <p style={{ fontWeight: "bold" }}>Description:</p>
                        <p>{eachConcern.comment}</p>
                        <hr></hr>

                        {eachConcern.fileUrl ? (
                          <div>
                            <p>
                              Attachement:{" "}
                              <a href={eachConcern.fileUrl}>View</a>
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p>Attachment: No attachment.</p>
                          </div>
                        )}

                        <Select
                          options={options}
                          onChange={(selected) =>
                            handleStatusChange(selected, eachConcern.concernId)
                          }
                          value={
                            options.find(
                              (opt) =>
                                opt.value ===
                                statusSelections[eachConcern.concernId]
                            ) || null
                          }
                          placeholder="-- Select Status --"
                          isDisabled={isResolved}
                        />

                        <br />
                        <Button
                          id={eachConcern.concernId}
                          variant="primary"
                          onClick={(e) =>
                            handleSubmitStatus(eachConcern.concernId)
                          }
                          disabled={isResolved}
                        >
                          Submit
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                );
            }):(<div>No concerns yet</div>)}
        </div>
          
        </Container>
    )
}
