// /FRONTEND/src/components/Concenr/TechConcernsResolution.jsx

import React from "react";
import { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Form, Table, Container, Button } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  SchoolContext,
  BlockContext,
  DistrictBlockSchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import {
  getConcernsByQueryParameters,
  getConcernsPipeLineMethod,
  PatchConcernsByQueryParams,
} from "../../service/ConcernsServices/Concern.services";
import {
  District,
  DistrictBlockSchoolById,
  ClassOfStudent,
} from "../DependentDropDowns/DistrictBlockSchool.component";
import { getIndividualConcerns } from "../../service/ConcernsServices/Concern.services";

export const SchoolConcernsResolution = () => {
  //Context apis
  const { userData, setUserData } = useContext(UserContext);

  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context

  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context

  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

  const { classContext, setClassContext } = useContext(ClassContext);

  //Usestate hooks.
  const [concernData, setConcernData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({});

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

}else if (userData?.[0]?.role === "admin" || userData?.[0]?.role === "Community Manager"){
    conditionalRole = ["ACI", "CC", "Community Incharge"]
    conditionalDepartment = ["Community"]
  } 




    const queryParams = {
         userId: userData?.[0]?.userId,
         concernType: 'School-Individual-Student',
         role: userData?.[0]?.role, 
         conditionalRole: conditionalRole,
         conditionalDepartment: conditionalDepartment,

          districtId: districtContext?.[0]?.value || "",
      blockId: blockContext?.[0]?.value || "",
      schoolId: schoolContext?.[0]?.value || "",
      classOfConcern: classContext?.value || ""


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

    //   classOfConcern: classContext.value || ["9", "10"],
    //   concernType: ["School-Individual-Student"],
    //   // concernStatusByResolver:'NA'
    // };
    console.log(queryParams);
    try {
      const response = await  getConcernsPipeLineMethod(queryParams); //getConcernsByQueryParameters

      console.log(response.data.data);

      setConcernData(response.data.data);
    } catch (error) {
      console.log("Error fetching concerns", error);
    }
  };

  useEffect(() => {
    fetchTechConcerns();
  }, [classContext, districtContext, schoolContext]);

  //dependencie of DistrictBlockSchoolById

  const assignedDistricts = userData?.[0]?.assignedDistricts;
  

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
        // userId: userData?.[0]?.userId,
        concernId: concernId,
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


  // console.log(userData)
  // alert(assignedDistricts)

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
        {concernData.length > 0 ? (
          concernData.map((eachConcern, index) => {


                let progressPercent = 0;
if (eachConcern.concernStatusBySubmitter === "Resolved") {
  progressPercent = 100;
} else if (eachConcern.concernStatusByResolver === "Resolved") {
  progressPercent = 75;
} else if (eachConcern.concernStatusByResolver === "Escalate to Gurgaon Office") {
  progressPercent = 50;
} else if (eachConcern.concernStatusByResolver === "NA") {
  progressPercent = 0;
}


            let options = [];
            if (eachConcern.concern === "SLC") {
              options = [
                { value: "SLC released", label: "SLC released" },
                { value: "Counselling required", label: "Counselling required" },
                { value: "Counselled", label: "Counselled" },
              ];
            } else if (eachConcern.concern === "Document") {
              options = [
                { value: "Shared", label: "Shared" },
              ];
            } else if (eachConcern.concern === "Academic") {
              options = [
                { value: "Resolved", label: "Resolved" },
                { value: "Not resolved", label: "Not resolved" },
              ];
            } else {
                options = [
                { value: "Resolved", label: "Resolved" },
                { value: "Escalate to Gurgaon Office", label: "Escalate to Gurgaon Office" },
              ];
            }


            //Dynamically disabling the card features for different users.
            //If aci escalates the issue to gurgaon office, then from his end, concern gets disabled.

            let isEditable;
            let msgOfCard;
            if(userData[0].role === "ACI"){
              isEditable = userData?.[0]?.role === "ACI" && progressPercent >= 50;
              
            } else if (userData[0].role === "Community Incharge"  ){
              isEditable = userData?.[0]?.role === "Community Incharge"  && progressPercent <= 0 || progressPercent >= 75 ;
            }



          //   const isEditable =
          // userData?.[0]?.role === "ACI" && progressPercent >= 50; // Only ACI can edit before step 3
        


            return (


              <div key={index}>
                <br />
                
                <Card style={{ width: "18rem" }}>
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Body>
                    {/* <p>{progressPercent}</p> */}
                    <Card.Title>Student SRN: {eachConcern.studentSrn}</Card.Title>
                    <Card.Title>Concern Type: {eachConcern.concern}</Card.Title>
                    <Card.Title>Concern: {eachConcern.remark}</Card.Title>
                    <Card.Title>Class: {eachConcern.classOfConcern} </Card.Title>
                    <Card.Text>
                      <p>District: {eachConcern.districtDetails.districtName}</p>
                      <p>Center: {eachConcern.schoolDetails.schoolName}</p>
                       <hr></hr>
                       <p style={{fontWeight:'bold'}}>Description:</p>
                       <p>{eachConcern.comment}</p>
                        <hr></hr>
                    
                        <p>Attachement: {eachConcern.fileUrl ? (<div>
                    
                        <a href={eachConcern.fileUrl}>View file</a>
                        </div>):("No attachement!")}</p>
                        <hr></hr>
                     </Card.Text>
                            <div className="custom-progress-container">
                      <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                      <div className="checkpoints">
                        <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
                          <span>1</span>
                          <div className="checkpoint-label">Raised</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 25 ? "active" : ""}`} style={{ left: "25%" }}>
                          <span>2</span>
                          <div className="checkpoint-label">ACI</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 50 ? "active" : ""}`} style={{ left: "50%" }}>
                          <span>3</span>
                          <div className="checkpoint-label">GGN Office</div>
                        </div>

                         <div className={`checkpoint ${progressPercent >= 75 ? "active" : ""}`} style={{ left: "75%" }}>
                          <span>3</span>
                          <div className="checkpoint-label">Resolved</div>
                        </div>

                        <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
                          <span>4</span>
                          <div className="checkpoint-label">Closed</div>
                        </div>
                      </div>
                    </div>

                    <br />

                <hr></hr>
                    

                    <Select
                      options={options}
                      onChange={(selected) =>
                        handleStatusChange(selected, eachConcern.concernId)
                      }
                      value={
                        options.find(
                          (opt) =>
                            opt.value === statusSelections[eachConcern.concernId]
                        ) || null
                      }
                      placeholder="-- Select Status --"
                      isDisabled={isEditable}
                    />

                    <br />
                    <Button
                      id={eachConcern.concernId}
                      variant="primary"
                      onClick={(e) => handleSubmitStatus(eachConcern.concernId)}
                    >
                      Submit
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          <div>No concerns yet</div>
        )}
      </div>
    </Container>
  );
};
