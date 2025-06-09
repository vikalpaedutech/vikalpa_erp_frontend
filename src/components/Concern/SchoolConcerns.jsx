import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { createConcern } from "../../service/ConcernsServices/Concern.services";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";

const SchoolConcerns = () => {
  const { userData } = useContext(UserContext);
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  const [concern, setConcern] = useState(null);
  const [remark, setRemark] = useState(null);
  const [classOfConcern, setClassOfConcern] = useState(null); // added class state
  const [file, setFile] = useState(null);

  const concernOptions = [
    { value: "School Closed", label: "School Closed" },
    { value: "Half Day", label: "Half Day" },
  ];

  const remarkOptionsMap = {
    "School Closed": [
      { value: "Administrative", label: "Administrative" },
      { value: "Event", label: "Event" },
      { value: "Govt. Exam", label: "Govt. Exam" },
      { value: "Miscellaneous", label: "Miscellaneous" },
    ],
    "Half Day": [
      { value: "Principal", label: "Principal" },
      { value: "Electricity Issue", label: "Electricity Issue" },
      { value: "Natural Disaster", label: "Natural Disaster" },
    ],
  };

  // For classOfConcern dropdown (like tech concerns)
  const classOptions = [
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
  ];

  const handleSubmit = async () => {
    console.log(schoolContext);
    if (!concern || !remark || !schoolContext?.[0] || !classOfConcern) {
      alert("Please select all fields before submitting.");
      return;
    }

    const schoolSelected = schoolContext[0];
    const concernId = `${concern.value}-${remark.value}-${schoolSelected.value}`;
    const currentDate = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("concernId", concernId);
    formData.append("userId", userData?.[0]?.userId ?? "NA");
    formData.append("schoolId", schoolSelected.value);
    formData.append("concernType", "School"); // hidden/default
    formData.append("concern", concern.value);
    formData.append("remark", remark.value);
    formData.append("classOfConcern", classOfConcern.value); // added class
    formData.append("concernStatusBySubmitter", "informative"); // default
    formData.append("dateOfSubmission", currentDate);
    formData.append("concernStatusByResolver", "informative"); // default
    if (file) {
      formData.append("file", file);
    }

    try {
      await createConcern(formData);
      alert("Concern submitted successfully!");
      setConcern(null);
      setRemark(null);
      setClassOfConcern(null); // reset class too
      setFile(null);
      setSchoolContext("");
    } catch (error) {
      console.error("Error submitting concern:", error.message);
      alert("Submission failed.");
    }
  };

  const assignedDistricts = userData?.[0]?.assignedDistricts || [];

  return (
    <Container className="my-4">
      <h4>School Concern Submission</h4>

      {/* Dependent Dropdowns */}
      <Row>
        <SchoolDropDowns />
      </Row>

      {/* Concern, Remark & Class */}
      <Row className="mb-3">
        <Col md={3}>
          <label>Select Concern</label>
          <Select
            options={concernOptions}
            value={concern}
            onChange={(selected) => {
              setConcern(selected);
              setRemark(null); // reset remark on concern change
            }}
            placeholder="Concern Type"
          />
        </Col>

        <Col md={3}>
          <label>Select Remark</label>
          <Select
            options={remarkOptionsMap[concern?.value] || []}
            value={remark}
            onChange={(selected) => setRemark(selected)}
            placeholder="Remark"
          />
        </Col>

        <Col md={3}>
          <label>Select Class</label>
          <Select
            options={classOptions}
            value={classOfConcern}
            onChange={(selected) => setClassOfConcern(selected)}
            placeholder="Class"
          />
        </Col>
      </Row>

      {/* Optional File */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Attach File (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Submit Button */}
      <Button variant="primary" onClick={handleSubmit}>
        Submit Concern
      </Button>
    </Container>
  );
};

export default SchoolConcerns;
