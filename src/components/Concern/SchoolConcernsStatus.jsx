// /FRONTEND/src/components/Concern/TechConcernStatus

import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const SchoolConcernsStatus = () => {
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
      userId: userData?.[0]?.userId,
      concernType:['School-Individual-Student']
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
    console.log(concernId)
    if (!selectedStatus) return;

    try {
      const query = {
        // userId: userData?.[0]?.userId,
        // concernId: concernId

         _id: concernId

      };


      let payload;

      if (selectedStatus === "Still Not Resolved"){
        
         payload = {
        concernStatusBySubmitter: selectedStatus,
        concernStatusByResolver: "Pending"
      };

      } else {

         payload = {
        concernStatusBySubmitter: selectedStatus,
       
      };

      }

      

      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns(); // refresh after update
    } catch (error) {
      console.log("Error updating concern status", error);
    }
  };

  // const progressPercent = 0;

  useEffect(() => {
    fetchTechConcerns();
  }, []);

  const options = [
    { value: "Resolved", label: "Resolved" },
    { value: "Still Not Resolved", label: "Still Not Resolved" },
  ];



  return (
    <Container>
      <h1>School Concerns:</h1>
      <hr></hr>
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
} else if (eachConcern.concernStatusByResolver === "Pending") {
  progressPercent = 0;
}
            return (
              <div key={index}>
                <br />
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>Concern Type: {eachConcern.concern}</Card.Title>
                    <Card.Title>District: {}</Card.Title>
                    <Card.Title>Class: {eachConcern.classOfConcern} </Card.Title>
                    <Card.Text>
                      <p>Concern: {eachConcern.remark}</p>
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
                      onChange={(selected) => handleStatusChange(selected, eachConcern._id)}
                      value={options.find((opt) => opt.value === statusSelections[eachConcern._id]) || null}
                      placeholder="-- Select Status --"
                    />

                    <br />
                    <Button variant="primary" onClick={() => handleSubmitStatus(eachConcern._id)}>
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
      <br></br>
    </Container>
  );
};
