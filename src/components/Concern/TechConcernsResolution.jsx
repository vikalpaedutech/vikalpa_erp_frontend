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







  //Context apis
  const { userData, setUserData } = useContext(UserContext);

  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context

  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context

  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

  const { classContext, setClassContext } = useContext(ClassContext);

  //Usestate hooks.
  const [concernData, setConcernData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({});
  const [techVisitorRemark, setTechVisitorRemark] = useState({}); // New state

  //API to fetch concerns data. Tech Concerns Only.
  const fetchTechConcerns = async () => {

    
    let conditionalRole;
  let conditionalDepartment;

  if (userData?.[0]?.role==="ACI"){
    conditionalRole = ["CC"]
    conditionalDepartment = ["Community"]
  
} else if (userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator"){
      conditionalRole = ["ACI", "CC"]
    conditionalDepartment = ["Community"]

}else if (userData?.[0]?.role === "Community Manager"){
    conditionalRole = ["ACI", "CC", "Community Incharge"]
    conditionalDepartment = ["Community"]
  } 




    const queryParams = {
         userId: userData?.[0]?.userId,
         concernType: 'Tech Concern',
         role: userData?.[0]?.role, 
         conditionalRole: conditionalRole,
         conditionalDepartment: conditionalDepartment


        //  districtId: districtContext?.[0]?.value || userData?.[0]?.assignedDistricts,
        //  blockId: userData?.[0]?.assignedBlocks, 
        //  schoolId: schoolContext?.[0]?.value || userData?.[0]?.assignedSchools,

        //  classOfConcern: classContext.value || ['9', '10'],
        //  concernType: 'Individual'

    }

  







    // const queryParams = {
    //   //  userId: userData?.[0]?.userId,
    //   districtId: districtContext?.[0]?.value || userData?.[0]?.assignedDistricts,
    //   //  blockId: userData?.[0]?.assignedBlocks, 
    //   schoolId: schoolContext?.[0]?.value || userData?.[0]?.assignedSchools,
    //   classOfConcern: classContext.value || ['9', '10'],
    //   concernType: ['Tech Concern']
    // }
    console.log(queryParams)
    try {
      const response = await getConcernsPipeLineMethod(queryParams);
      console.log(response.data.data)
      setConcernData(response.data.data)
    } catch (error) {
      console.log('Error fetching concerns', error)
    }
  }

  useEffect(() => {
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
    // Clear visitor remark when status is changed
    if (selectedOption?.value !== "Visited") {
      setTechVisitorRemark(prev => ({ ...prev, [concernId]: null }));
    }
  };

  const handleVisitorRemarkChange = (selectedOption, concernId) => {
    setTechVisitorRemark({
      ...techVisitorRemark,
      [concernId]: selectedOption?.value,
    });
  };

  //Submitting concern status
  const handleSubmitStatus = async (concernId) => {
    const selectedStatus = statusSelections[concernId];
    const visitorRemark = techVisitorRemark[concernId];
    if (!selectedStatus) return;

    try {
      const query = {
        // userId: userData?.[0]?.userId,
        concernId: concernId
      };

      const payload = {
        concernStatusByResolver: selectedStatus,
        ...(visitorRemark && { techVisitorRemark: visitorRemark }), // send only if exists
      };

      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns(); // refresh after update
    } catch (error) {
      console.log("Error updating concern status", error);
    }
  };

  const progressPercent = 0;

  const options = [
    { value: "Visited", label: "Visited" },
  ];

  const options2 = [
    { value: "Repairing Required", label: "Repairing Required" },
    { value: "Purchasing Required", label: "Purchasing Required" },
  ];

  //
  return (
    <Container>
      <div>
        <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
      </div>
      <div>
        <ClassOfStudent />
      </div>
      <hr />

      <div>
        {concernData.length > 0 ? concernData.map((eachConcern, index) => {

            let progressPercent = 0;

            if (eachConcern.concernStatusBySubmitter === "Resolved") {
              progressPercent = 100;
            } else if (eachConcern.concernStatusByResolver === "Visited") {
              progressPercent = 50;
            } else if (eachConcern.concernStatusBySubmitter === "Not Resolved") {
              progressPercent = 0;
            }


 //Dynamically disabling the card features for different users.
            //If aci escalates the issue to gurgaon office, then from his end, concern gets disabled.

            let isEditable;
            // let msgOfCard;
            // if(userData[0].role === "ACI"){
            //   isEditable = userData?.[0]?.role === "ACI" && progressPercent >= 50;
              
            // } else if (userData[0].role === "Community Incharge"  ){
            //   isEditable = userData?.[0]?.role === "Community Incharge"  && progressPercent <= 0 || progressPercent >= 100 ;
            // }

              // console.log(DistrictBlockSchool)

              




          return (
            <div key={index}>
              <br />
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Tech Concern:{eachConcern.concern}</Card.Title>
                  <Card.Title>Issue :{eachConcern.remark}</Card.Title>
                  <Card.Title>Class :{eachConcern.classOfConcern}</Card.Title>
                  <Card.Text>
                    <p>District: {eachConcern.districtDetails.districtName}</p>
                    <p>Center: {eachConcern.schoolDetails.schoolName}</p>
                    <br/>
                  </Card.Text>

                  <div className="custom-progress-container">
                    <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                    <div className="checkpoints">
                      <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
                        <span>1</span>
                        <div className="checkpoint-label">
                          <span >Requested <br/> technician</span>
                        </div>
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

                  <br />

                  
                    <hr/>
                    <span style={{fontWeight:'bold'}}>
                      Technician-Remark: {eachConcern.techVisitorRemark ? (eachConcern.techVisitorRemark):(null)}

                    </span>
                    <br/>
                     <hr/>
            

                  {userData[0].role === "ACI" ? (  <Select
                    options={options}
                    onChange={(selected) => handleStatusChange(selected, eachConcern.concernId)}
                    value={options.find((opt) => opt.value === statusSelections[eachConcern.concernId]) || null}
                    placeholder="-- Select Status --"

                    isDisabled={isEditable}
                  />): (null)}

                

                  {/* Conditional visitor remark dropdown */}
                  {statusSelections[eachConcern.concernId] === "Visited" && (
                    <>
                      <br />
                      <Select
                        options={options2}
                        onChange={(selected) => handleVisitorRemarkChange(selected, eachConcern.concernId)}
                        value={options2.find((opt) => opt.value === techVisitorRemark[eachConcern.concernId]) || null}
                        placeholder="-- Visitor Remark --"
                      />
                    </>
                  )}

                  <br />
                  <Button id={eachConcern.concernId} variant="primary" onClick={(e) => handleSubmitStatus(eachConcern.concernId)}>
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
