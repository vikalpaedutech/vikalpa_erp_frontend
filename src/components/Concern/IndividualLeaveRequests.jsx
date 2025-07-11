// /FRONTEND/src/components/Concern/IndividualLeaveRequests.jsx

// /FRONTEND/src/components/Concenr/TechConcernsResolution.jsx

import React from "react";
import { useState, useEffect, useContext } from "react";
import {Card, Row, Col, Form, Table, Container, Button} from "react-bootstrap"
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext,   DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, PatchConcernsByQueryParams, getIndividualConcerns, getIndividualLeave } from "../../service/ConcernsServices/Concern.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const IndividualLeaveRequests = () =>{

//Context apis
    const {userData, setUserData} = useContext(UserContext);

    const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
    
    const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
    
    const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
    
    const {classContext, setClassContext} = useContext(ClassContext);

//Usestate hooks.
    const [concernData, setConcernData] = useState([]);
    const [statusSelections, setStatusSelections] = useState({});
    const [remarks, setRemarks] = useState({}); // 🆕 New state for remarks

//API to fetch concerns data. Tech Concerns Only.
const fetchTechConcerns = async () =>{
   
  let conditionalRole;
  let conditionalDepartment;

  if (userData?.[0]?.role==="ACI"){
    conditionalRole = ["CC"]
    conditionalDepartment = ["Community"]
  } else if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Manager"){
    conditionalRole = ["ACI", "CC", "Community Incharge"]
    conditionalDepartment = ["Community"]
  } 




    const queryParams = {
         userId: userData?.[0]?.userId,
         concernType: 'Leave',
         role: userData?.[0]?.role, 
         conditionalRole: conditionalRole,
         conditionalDepartment: conditionalDepartment


        //  districtId: districtContext?.[0]?.value || userData?.[0]?.assignedDistricts,
        //  blockId: userData?.[0]?.assignedBlocks, 
        //  schoolId: schoolContext?.[0]?.value || userData?.[0]?.assignedSchools,

        //  classOfConcern: classContext.value || ['9', '10'],
        //  concernType: 'Individual'

    }
console.log(queryParams)
    try {
        const response = await getIndividualLeave(queryParams);

        console.log(response.data.data)

        setConcernData(response.data.data)

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

// 🆕 Input remark change handler
const handleRemarkChange = (e, concernId) => {
    setRemarks({
        ...remarks,
        [concernId]: e.target.value,
    });
};


//Submitting concern status



const handleSubmitStatus = async (concernId) => {
    const selectedStatus = statusSelections[concernId];
    if (!selectedStatus) return;

    if (selectedStatus === "Rejected" && (!remarks[concernId] || remarks[concernId].trim() === "")) {
        alert("Remark is mandatory when rejecting leave.");
        return;
    }

    try {
      const query = {
        // userId: userData?.[0]?.userId,
        concernId: concernId
      };

      const payload = {
  l1ApprovalOnLeave: {
    status: statusSelections[concernId] || 'NA',
    approvedBy: userData?.[0]?.userId,

    approvedOn: new Date(),
    comment: remarks[concernId] || 'NA' // 🆕 use remark if provided
  }
  // concernStatusByResolver: selectedStatus,
  
};
      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns(); // refresh after update
    } catch (error) {
      console.log("Error updating concern status", error);
    }
};

const progressPercent = 0;

const options = [
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
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


//creating regex filter option fo filtering leaves.

const [searchItem, setSearchItem] = useState("")

const regex = new RegExp(searchItem, 'i')

const filteredLeaves = concernData.filter(item => 
  regex.test(item.userDetails.name) || regex.test(item.subjectOfLeave)
);


console.log(filteredLeaves)

//
    return (
       <Container>
    {/* <div>
        <DistrictBlockSchoolById assignedDistricts={assignedDistricts}/>
    </div> */}
    {/* <div>
        <ClassOfStudent/>
    </div> */}
    <h1>Center Coordinators Leaves.</h1>
    <hr/>
  <Form.Control
  type="text"
  placeholder="Search by Name or Subject"
  onChange={(e) => setSearchItem(e.target.value)}
  className="mb-3"
/>

    <div>
        {filteredLeaves.length > 0 ? filteredLeaves
          // ✅ Sort: show approved/rejected cards last
          .sort((a, b) => {
              const aStatus = a?.l1ApprovalOnLeave?.status;
              const bStatus = b?.l1ApprovalOnLeave?.status;
              const aResolved = aStatus === "Approved" || aStatus === "Rejected";
              const bResolved = bStatus === "Approved" || bStatus === "Rejected";
              return aResolved - bResolved;
          })
          .map((eachConcern, index) => {
            const isResolved = eachConcern?.l1ApprovalOnLeave?.status === "Approved" || eachConcern?.l1ApprovalOnLeave?.status === "Rejected";
            const resolvedStatus = eachConcern?.l1ApprovalOnLeave?.status || '';
            const resolvedComment = eachConcern?.l1ApprovalOnLeave?.comment || '';


            //Changing colors of cards on Approval or Rejectiono.
            let cardBackgroundColor;
            if(resolvedStatus === "Approved"){
                cardBackgroundColor = '#7FFFD4'
            } else if (resolvedStatus === "Rejected"){
              cardBackgroundColor = '#FF6347'
            } else {
              cardBackgroundColor = 'white'
            }


            return (
              <div key={index}>
                <br />
                <Card style={{ width: "18rem" , backgroundColor:cardBackgroundColor}}>
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Body>
                    
                    <Card.Title>Subject: {eachConcern.subjectOfLeave}</Card.Title>
                    <Card.Title>Name: {eachConcern.userDetails.name}</Card.Title>
                    <Card.Title>Role: {eachConcern.userDetails.role}</Card.Title>
                    <Card.Text>
                      <p>Leave from {formatDate(eachConcern.leavePeriodFrom)} to {formatDate(eachConcern.leavePeriodTo)} </p>
                      <p>Leave applied for: {eachConcern.totalDaysOfLeaveAppliedFor} days</p>
                    </Card.Text>

                    {/* <div className="custom-progress-container">
                      <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                      <div className="checkpoints">
                        <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
                          <span>1</span>
                          <div className="checkpoint-label">Pending</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 50 ? "active" : ""}`} style={{ left: "50%" }}>
                          <span>2</span>
                          <div className="checkpoint-label">Visited</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
                          <span>3</span>
                          <div className="checkpoint-label">Resolved</div>
                        </div>
                      </div>
                    </div>

                    <br /> */}

                    <hr></hr>
                    <p style={{ fontWeight: 'bold' }}>Description:</p>
                    <p>{eachConcern.leaveBody}</p>

                    {/* ✅ Show status and comment if resolved */}
                    {isResolved && (
                      <>
                        <p><strong>Status:</strong> {resolvedStatus}</p>
                        <p><strong>Remark:</strong> {resolvedComment}</p>
                      </>
                    )}

                    <Select
                      options={options}
                      onChange={(selected) => handleStatusChange(selected, eachConcern.concernId)}
                      value={options.find((opt) => opt.value === statusSelections[eachConcern.concernId]) || null}
                      placeholder="-- Select Status --"
                      isDisabled={isResolved} // ✅ disable if resolved
                    />

                    {/* 🆕 Remark input field */}
                    <Form.Control
                      className="mt-2"
                      type="text"
                      placeholder="Enter remark (optional)"
                      value={remarks[eachConcern.concernId] || ''}
                      onChange={(e) => handleRemarkChange(e, eachConcern.concernId)}
                      disabled={isResolved} // ✅ disable if resolved
                    />

                    <br />
                    <Button
                      id={eachConcern.concernId}
                      variant="primary"
                      onClick={(e) => handleSubmitStatus(eachConcern.concernId)}
                      disabled={isResolved} // ✅ disable if resolved
                    >
                      Submit
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          }) : (<div>No concerns yet</div>)}
    </div>
</Container>

    )
}
