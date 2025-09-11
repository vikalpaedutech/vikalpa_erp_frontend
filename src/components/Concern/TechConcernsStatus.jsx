// // /FRONTEND/src/components/Concern/TechConcernStatus


import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getConcernsByQueryParameters, PatchConcernsByQueryParams } from "../../service/ConcernsServices/Concern.services";

export const TechConcernsStatus = () => {
  const { userData } = useContext(UserContext);
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext } = useContext(SchoolContext);
  const { classContext } = useContext(ClassContext);

  const [concernData, setConcernData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const fetchTechConcerns = async () => {
    const queryParams = {
      userId: userData?.userId,
      concernType: "Tech Concern"
    };

    try {
      const response = await getConcernsByQueryParameters(queryParams);
      setConcernData(response.data.data);
    } catch (error) {
      console.log("Error fetching concerns", error);
    }
  };

  useEffect(() => {
    fetchTechConcerns();
  }, []);

  const handleStatusChange = (selectedOption, concernId) => {
    setStatusSelections({ ...statusSelections, [concernId]: selectedOption?.value });
  };

  const handleCommentChange = (e, concernId) => {
    setCommentInputs({ ...commentInputs, [concernId]: e.target.value });
  };

  const handleSubmitStatus = async (concernId, concernObj) => {
    const selectedStatus = statusSelections[concernId];
    const comment = commentInputs[concernId];

    if (!selectedStatus) return;

    const query = { _id: concernId };

    let payload = {
      concernStatusBySubmitter: selectedStatus,
    };

    if (selectedStatus === "Not Resolved") {
      const prevStatus = concernObj.concernStatusByResolver || "No Status";
      const prevActivity = concernObj.activityOfPersonWhoResolvesTechConcerns || "No Activity";
      const prevAction = concernObj.actionRecommended || "No Action";

      const prefixedComment = `Previous Status: ${prevStatus}, Activity: ${prevActivity}, Action: ${prevAction} | User Remark: ${comment}`;

      payload = {
        ...payload,
        concernStatusByResolver: "Pending",
        activityOfPersonWhoResolvesTechConcerns: null,
        actionRecommended: null,
        commentByResolver: prefixedComment,
      };
    }

    try {
      await PatchConcernsByQueryParams(query, payload);
      fetchTechConcerns();
      setCommentInputs(prev => ({ ...prev, [concernId]: '' }));
    } catch (error) {
      console.log("Error updating concern status", error);
    }
  };

  const options = [
    { value: "Resolved", label: "Resolved" },
    { value: "Not Resolved", label: "Not Resolved" },
  ];

  return (
    <Container>
      <div>
        {concernData.length > 0 ? (
          concernData.map((eachConcern, index) => {
            let progressPercent = 0;
            if (eachConcern.concernStatusBySubmitter === "Resolved") {
              progressPercent = 100;
            } else if (eachConcern.concernStatusByResolver) {
              progressPercent = 75;
            } else if (eachConcern.activityOfPersonWhoResolvesTechConcerns) {
              progressPercent = 50;
            }

            //style={{ width: "18rem" }}
            return (
              <div key={index}>
                <br />
                <Card >
                  <Card.Body>
                    <Card.Title>Concern: {eachConcern.concern}</Card.Title>
                    <Card.Title>Class: {eachConcern.classOfConcern}</Card.Title>
                    <Card.Title>Issue: {eachConcern.remark}</Card.Title>
                    <hr/>
                    <span style={{ fontWeight: 'bold' }}>
                      Description: {eachConcern.comment || "No comment provided"}
                    </span>

                    <hr/>

                    <div className="custom-progress-container">
                      <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                      <div className="checkpoints">
                        <div className={`checkpoint active`} style={{ left: "0%" }}>
                          <span>1</span>
                          <div className="checkpoint-label">Requested<br />Technician</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 50 ? "active" : ""}`} style={{ left: "33%" }}>
                          <span>2</span>
                          <div className="checkpoint-label">
                            {eachConcern.activityOfPersonWhoResolvesTechConcerns || "Activity"}
                          </div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 75 ? "active" : ""}`} style={{ left: "66%" }}>
                          <span>3</span>
                          <div className="checkpoint-label">
                            {eachConcern.concernStatusByResolver || "Resolver Status"}
                          </div>
                        </div>
                        <div className={`checkpoint ${progressPercent === 100 ? "active" : ""}`} style={{ left: "100%" }}>
                          <span>4</span>
                          <div className="checkpoint-label">Closed</div>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>
                      Technician-Remark: {eachConcern.techVisitorRemark || null}
                    </span>
                    <br />
                    
                    <hr />

                    <Select
                      options={options}
                      onChange={(selected) => handleStatusChange(selected, eachConcern._id)}
                      value={options.find((opt) => opt.value === statusSelections[eachConcern._id]) || null}
                      placeholder="-- Select Status --"
                    />

                    {statusSelections[eachConcern._id] === "Not Resolved" && (
                      <Form.Group className="mt-3">
                        <Form.Label><strong>Explain your issue</strong></Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={commentInputs[eachConcern._id] || ''}
                          onChange={(e) => handleCommentChange(e, eachConcern._id)}
                          required
                        />
                      </Form.Group>
                    )}

                    <br />
                    <Button
                      variant="primary"
                      onClick={() => handleSubmitStatus(eachConcern._id, eachConcern)}
                      disabled={
                        statusSelections[eachConcern._id] === "Not Resolved" &&
                        (!commentInputs[eachConcern._id] || commentInputs[eachConcern._id].trim() === "")
                      }
                    >
                      Submit
                    </Button>

                    {eachConcern.commentByResolver && (
                      <>
                        <hr />
                        <span style={{ fontWeight: 'bold' }}>
                          Resolver Remark: {eachConcern.commentByResolver}
                        </span>
                      </>
                    )}

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
