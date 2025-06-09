// /FRONTEND/src/components/Concern/TechConcerns.jsx

import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  SchoolProvider,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { createConcern } from "../../service/ConcernsServices/Concern.services";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";

const TechConcerns = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  const [concern, setConcern] = useState(null);
  const [remark, setRemark] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [file, setFile] = useState(null);

  const concernOptions = [
    { value: "Mic", label: "Mic" },
    { value: "Camera", label: "Camera" },
    { value: "Monitor", label: "Monitor" },
  ];

  const remarkOptionsMap = {
    Mic: [
      { value: "Mic Not Working", label: "Mic Not Working" },
      { value: "Mic Not Available", label: "Mic Not Available" },
    ],
    Camera: [
      { value: "Camera Not Working", label: "Camera Not Working" },
      { value: "Camera Not Available", label: "Camera Not Available" },
    ],
    Monitor: [
      { value: "Monitor Not Working", label: "Monitor Not Working" },
      { value: "Monitor Not Available", label: "Monitor Not Available" },
    ],
  };

  const classOptions = [
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
  ];

  const handleSubmit = async () => {
    if (!concern || !remark || !schoolContext?.[0] || !selectedClass) {
      alert("Please fill in all fields.");
      return;
    }

    const schoolSelected = schoolContext[0];
    const currentDate = new Date().toISOString().split("T")[0];
    const concernId = `${concern.value}-${schoolSelected.value}`;

    const formData = new FormData();
    formData.append("concernId", concernId);
    formData.append("userId", userData?.[0]?.userId ?? "NA");
    formData.append("schoolId", schoolSelected.value);
    formData.append("concernType", "Tech Concern");
    formData.append("concern", concern.value);
    formData.append("remark", remark.value);
    formData.append("classOfConcern", selectedClass.value);
    formData.append("concernStatusBySubmitter", "Pending");
    formData.append("dateOfSubmission", currentDate);
    formData.append("concernStatusByResolver", "Pending");
    if (file) {
      formData.append("file", file);
    }

    try {
      await createConcern(formData);
      alert("Tech Concern submitted successfully!");
      setConcern(null);
      setRemark(null);
      setFile(null);
      setSelectedClass(null);
      setSchoolContext("");
    } catch (error) {
      console.error("Error submitting tech concern:", error.message);
      alert("Submission failed.");
    }
  };

  return (
    <Container className="my-4">
      <h4>Tech Concern Submission</h4>

      {/* School dropdowns */}
      <Row>
        <SchoolDropDowns />
      </Row>

      {/* Concern and Remark */}
      <Row className="mb-3">
        <Col md={4}>
          <label>Select Concern</label>
          <Select
            options={concernOptions}
            value={concern}
            onChange={(selected) => {
              setConcern(selected);
              setRemark(null);
            }}
            placeholder="Concern Type"
          />
        </Col>

        <Col md={4}>
          <label>Select Remark</label>
          <Select
            options={remarkOptionsMap[concern?.value] || []}
            value={remark}
            onChange={(selected) => setRemark(selected)}
            placeholder="Remark"
          />
        </Col>
      </Row>

      {/* Class of Concern */}
      <Row className="mb-3">
        <Col md={4}>
          <label>Select Class</label>
          <Select
            options={classOptions}
            value={selectedClass}
            onChange={(selected) => setSelectedClass(selected)}
            placeholder="Class"
          />
        </Col>
      </Row>

      {/* File Upload */}
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

      {/* Submit */}
      <Button variant="primary" onClick={handleSubmit}>
        Submit Tech Concern
      </Button>
    </Container>
  );
};

export default TechConcerns;
