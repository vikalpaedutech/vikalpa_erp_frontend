// /FRONTEND/src/components/Concern/TechConcernStatus

import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const IndividualConcernsStatus = () => {
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
      concernType:['Individual']
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
        userId: userData?.[0]?.userId,
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
    { value: "Resolved", label: "Resolved" },
    { value: "Still Not Resolved", label: "Still Not Resolved" }
  ];

  return (
    <Container>
      <div>
        {concernData.length > 0 ? (
          concernData.map((eachConcern, index) => {
            return (
              <div key={index}>
                <br />
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>{eachConcern.concern}</Card.Title>
                    <Card.Text>
                    <p>Concern: {eachConcern.concern}</p>
                    <p>Remark: {eachConcern.remark}</p>
                     <p>Status: {eachConcern.concernStatusByResolver}</p>
                    </Card.Text>




                  <div className="custom-progress-container">
                      <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                      <div className="checkpoints">
                        <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
                          <span>1</span>
                          <div className="checkpoint-label">Submitted</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
                          <span>2</span>
                          <div className="checkpoint-label">Gurgaon Office</div>
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
                    </div>




                     <hr></hr>
                    <Select
                      options={options}
                      onChange={(selected) => handleStatusChange(selected, eachConcern._id)}
                      value={options.find((opt) => opt.value === statusSelections[eachConcern._id]) || null}
                      placeholder="-- Select Status --"
                    />

                    <br />

                    {/* <Select
                      options={options}
                      onChange={(selected) => handleStatusChange(selected, eachConcern._id)}
                      value={options.find((opt) => opt.value === statusSelections[eachConcern._id]) || null}
                      placeholder="-- Select Status --"
                    />

                    <br /> */}
                    {/* <Button variant="primary" onClick={() => handleSubmitStatus(eachConcern._id)}>
                      Submit
                    </Button> */}
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
