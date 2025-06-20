// /FRONTEND/src/components/Concern/IndividualConcerns.jsx

import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { createConcern } from "../../service/ConcernsServices/Concern.services";
export const IndividualConcernsForm = () =>{

const { userData } = useContext(UserContext);

  const [concern, setConcern] = useState(null);
  const [remark, setRemark] = useState(null);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  const concernOptions = [
    { value: "Salary", label: "Salary" },
    { value: "Work Environment", label: "Work Environment" },
    { value: "Leave & Attendance", label: "Leave & Attendance" },
    { value: "Reporting Issue", label: "Reporting Issue" },
    { value: "Transfer/Work Location", label: "Transfer/Work Location" },
    { value: "Shift and Duty Allocation", label: "Shift and Duty Allocation" },
    { value: "Payroll/Payslip", label: "Payroll/Payslip" },
  ];

  const remarkOptionsMap = {
    "Salary": [
      { value: "Salary not credited", label: "Salary not credited" },
      { value: "Salary discrepancy", label: "Salary discrepancy" },
    ],
    "Work Environment": [
      { value: "Harassment", label: "Harassment" },
      { value: "Behavioral issue", label: "Behavioral issue" },
      { value: "Workspace hygiene", label: "Workspace hygiene" },
      { value: "Safety concern", label: "Safety concern" },
    ],
    "Leave & Attendance": [
      { value: "Attendance Correction", label: "Attendance Correction" },
      { value: "Leave balance query", label: "Leave balance query" },
      
    ],
    "Reporting Issue": [
      { value: "Manager Behavior", label: "Manager Behavior" },
      { value: "Unfair treatment", label: "Unfair treatment" },
    ],
    "Transfer/Work Location": [
      { value: "Request to location change", label: "Request to location change" },
      { value: "Distance Issue", label: "Distance Issue" },
    ],
    "Shift and Duty Allocation": [
      { value: "Duty timing", label: "Duty timing" },
      { value: "Work Overload", label: "Work Overload" },
    ],
    "Payroll/Payslip": [
      { value: "Payslip Required", label: "Payslip Required" },
    ],
  };

  const handleSubmit = async () => {
    if (!concern || !remark || comment.trim() === "") {
      alert("Please select all required fields and provide a comment.");
      return;
    }

    const concernId = `${concern.value}-${remark.value}-${userData?.[0]?.userId ?? "NA"}`;
    const currentDate = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("concernId", concernId);
    formData.append("userId", userData?.[0]?.userId ?? "NA");
    formData.append("districtId", userData?.[0]?.district ?? "NA");
    formData.append("blockId", userData?.[0]?.block ?? "NA");
    formData.append("schoolId", userData?.[0]?.school ?? "NA");
    formData.append("concernType", "Individual");
    formData.append("concern", concern.value);
    formData.append("remark", remark.value);
    formData.append("concernStatusBySubmitter", "informative");
    formData.append("concernStatusByResolver", "informative");
    formData.append("dateOfSubmission", currentDate);
    formData.append("comment", comment);
    if (file) {
      formData.append("file", file);
    }

    try {
      await createConcern(formData);
      alert("Concern submitted successfully!");
      setConcern(null);
      setRemark(null);
      setComment("");
      setFile(null);
    } catch (error) {
      console.error("Error submitting concern:", error.message);
      alert("Submission failed.");
    }
  };

  return (
    <Container className="my-4">
      <h4>Individual Concern Submission</h4>

      {/* Concern and Remark */}
      <Row className="mb-3">
        <Col md={4}>
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

      {/* Comment Field */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Explain Your Concern in brief</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your concern..."
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