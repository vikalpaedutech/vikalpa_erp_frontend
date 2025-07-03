import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Container,
  Button
} from "react-bootstrap";
import Select from "react-select";
import { createConcern } from "../../service/ConcernsServices/Concern.services";
import { UserContext } from "../contextAPIs/User.context";
import Spinner from "react-bootstrap/Spinner"; // ✅ NEW IMPORT

export const IndividualLeave = () => {
  const { userData } = useContext(UserContext);

  const [leaveType, setLeaveType] = useState(null);
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [leaveBody, setLeaveBody] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW STATE

  const leaveOptions = [
    { value: "WFH", label: "WFH" },
    { value: "Comp-off", label: "Comp-off" },
    { value: "Emergency Leave", label: "Emergency Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Half Day", label: "Half Day" },
    {value: "Monthly Leave", label: "Monthly Leave"}
  ];


//Handling conditional Role

let conditionalRole;

if (userData?.[0]?.role === 'ACI') {
  conditionalRole = ['Community Manager', 'Director']
} else if (userData?.[0]?.role === 'CC'){
  conditionalRole = ['Community Manager', 'ACI', 'Community Incharge', 'Project Coordinator']
}

//----------------------------------------



  const handleSubmit = async () => {
    if (!leaveType || !leaveFrom || !leaveTo || !totalDays || !leaveBody) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    const concernId = `Leave-${userData?.[0]?.userId}-${leaveType.value}-${leaveFrom}-to-${leaveFrom}`;
    const currentDate = new Date().toISOString().split("T")[0];

    formData.append("concernId", concernId);
    formData.append("userId", userData?.[0]?.userId || "NA");
    formData.append("concernType", "Leave");
    formData.append("concern", "Leave");
    formData.append("remark", leaveType.value);
    formData.append("subjectOfLeave", leaveType.value);
    formData.append("leavePeriodFrom", leaveFrom);
    formData.append("leavePeriodTo", leaveTo);
    formData.append("totalDaysOfLeaveAppliedFor", totalDays);
    formData.append("leaveBody", leaveBody);
    formData.append("concernStatusBySubmitter", "informative");
    formData.append("concernStatusByResolver", "Under Review");
    formData.append("dateOfSubmission", currentDate);
     formData.append("uri1", "NA"); // default
    formData.append("uri2", "TechConcernResolution"); // default
    formData.append("uri3", "NA"); // default
    formData.append("conditionalRole", conditionalRole)
     formData.append("role", userData?.[0]?.role)
    

    if (file) {
      formData.append("file", file);
    }

    try {
      setIsSubmitting(true); // ✅ START LOADING
      await createConcern(formData);
      alert("Leave application submitted successfully!");

      // reset
      setLeaveType(null);
      setLeaveFrom("");
      setLeaveTo("");
      setTotalDays("");
      setLeaveBody("");
      setFile(null);
    } catch (error) {
      console.error("Leave application failed:", error);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false); // ✅ STOP LOADING
    }
  };

  return (
    <Container className="my-4">
      <h4>Leave Application Form</h4>
      <hr/>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Leave Type</Form.Label>
            <Select
              options={leaveOptions}
              value={leaveType}
              onChange={(selected) => setLeaveType(selected)}
              placeholder="Select Leave Type"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Leave From</Form.Label>
            <Form.Control
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Leave To</Form.Label>
            <Form.Control
              type="date"
              value={leaveTo}
              onChange={(e) => setLeaveTo(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Total Days</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              placeholder="Enter total number of days"
            />
          </Form.Group>
        </Col>

        <Col md={8}>
          <Form.Group>
            <Form.Label>Reason for Leave</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={leaveBody}
              onChange={(e) => setLeaveBody(e.target.value)}
              placeholder="Write reason..."
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Attach Document (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span className="ms-2">Submitting...</span>
          </>
        ) : (
          "Submit Leave Application"
        )}
      </Button>
    </Container>
  );
};
