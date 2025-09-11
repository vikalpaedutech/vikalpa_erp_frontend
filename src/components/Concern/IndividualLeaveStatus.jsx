// /FRONTEND/src/components/Concern/TechConcernStatus

import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const IndividualLeaveStatus = () => {
  //Context apis
  const { userData, setUserData } = useContext(UserContext);
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext, setClassContext } = useContext(ClassContext);

  //Usestate hooks.
  const [concernData, setConcernData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({}); // to track dropdown selections

  //API to fetch concerns data. Tech Concerns Only.
  const fetchTechConcerns = async () => {
    const queryParams = {
      userId: userData?.userId,
      concernType:['Leave']
    };

    console.log(queryParams);

    try {
      const response = await getConcernsByQueryParameters(queryParams);
      console.log(response.data.data);
      setConcernData(response.data.data);
    } catch (error) {
      console.log("Error fetching concerns", error);
    }
  };

  const handleStatusChange = (selectedOption, concernId) => {
    setStatusSelections({
      ...statusSelections,
      [concernId]: selectedOption?.value,
    });
  };

  const handleSubmitStatus = async (concernId) => {
    const selectedStatus = statusSelections[concernId];
    if (!selectedStatus) return;

    try {
      const query = {
        userId: userData?.userId,
      };

      const payload = {
        concernStatusBySubmitter: selectedStatus,
      };

      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns(); // refresh after update
    } catch (error) {
      console.log("Error updating concern status", error);
    }
  };

  const progressPercent = 0;

  useEffect(() => {
    fetchTechConcerns();
  }, []);

  const options = [
    { value: "Closed", label: "Closed" },
  ];
//style={{ width: "18rem" }}
  return (
    <Container>
      <div>
        {concernData.length > 0 ? (
          concernData.map((eachConcern, index) => {
            return (
              <div key={index}>
                <br />
                <Card >
                  <Card.Body>
                    <Card.Title>Subject: {eachConcern.remark}</Card.Title>
                    <Card.Text>
                    <p>From: {eachConcern.userDetails.name}</p>
                    <p>Leave Period: {eachConcern.leavePeriodFrom.replace("T00:00:00.000Z", "")} to {eachConcern.leavePeriodTo.replace("T00:00:00.000Z", "")}</p>
                    <p>Total days: {eachConcern.totalDaysOfLeaveAppliedFor}</p>
                    
                    <hr></hr>
                    <p>Reason:</p>
                     <p>{eachConcern.leaveBody}</p>

                     <p>Attachement: {eachConcern.fileUrl ? (
                        <>
                        <a href={eachConcern.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                        </>
                     ):("No attachement")}</p>
                     <hr></hr>

                    {eachConcern.l1ApprovalOnLeave.status === "Pending" ? (
                        <p>Approval Status: {eachConcern.l1ApprovalOnLeave.status}</p>
                    ):(
                        
                        <div>
                            <p style={{color:'red', fontWeight:'bold'}}>Approval Status: {eachConcern.l1ApprovalOnLeave.status}</p>
                            <p style={{color:'red', fontWeight:'bold'}}>Remark: {eachConcern.l1ApprovalOnLeave.comment}</p>
                        </div>
                       
                    )}
                     
                    </Card.Text>






                    

                    <br />

        
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
