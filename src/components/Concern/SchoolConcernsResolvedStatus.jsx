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
  PatchConcernsByQueryParams,
} from "../../service/ConcernsServices/Concern.services";
import {
  District,
  DistrictBlockSchoolById,
  ClassOfStudent,
} from "../DependentDropDowns/DistrictBlockSchool.component";
import { getIndividualConcerns } from "../../service/ConcernsServices/Concern.services";

export const SchoolConcernsResolvedStatus = () => {
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
    const queryParams = {
      //  userId: userData?.[0]?.userId,
      districtId: districtContext?.[0]?.value || userData?.[0]?.assignedDistricts,
      //  blockId: userData?.[0]?.assignedBlocks,
      schoolId: schoolContext?.[0]?.value || userData?.[0]?.assignedSchools,

      classOfConcern: classContext.value || ["9", "10"],
      concernType: ["School"],
      concernStatusByResolver:['Resolved, SLC released']
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
    alert('h')
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
                { value: "Not resolved", label: "Not resolved" },
              ];
            }

            return (
              <div key={index}>
                <br />
                <Card style={{ width: "18rem" }}>
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Body>
                    <Card.Title>
                      {eachConcern.concern} || {eachConcern.classOfConcern}
                    </Card.Title>
                    <Card.Text>
                      <p>Remark: {eachConcern.remark}</p>
                      <hr></hr>
                      <p style={{ fontWeight: "bold" }}>Description:</p>
                      <p>{eachConcern.comment}</p>
                    </Card.Text>


                    <br />

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
