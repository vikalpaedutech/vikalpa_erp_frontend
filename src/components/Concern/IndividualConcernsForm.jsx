// // /FRONTEND/src/components/Concern/IndividualConcerns.jsx


// /FRONTEND/src/components/Concern/IndividualConcerns.jsx

import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { createConcern } from "../../service/ConcernsServices/Concern.services";

export const IndividualConcernsForm = () =>{

const { userData } = useContext(UserContext);

  const [concern, setConcern] = useState(null);
  const [remark, setRemark] = useState(null);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // NEW: Spinner state

  const concernOptions = [
  { value: "Salary", label: "Salary (वेतन)" },
  { value: "Work Environment", label: "Work Environment (कार्य वातावरण)" },
  { value: "Attendance", label: "Attendance (छुट्टी और उपस्थिति)" },
  { value: "Reporting Issue", label: "Reporting Issue (रिपोर्टिंग समस्या)" },
  { value: "Transfer/Work Location", label: "Transfer/Work Location (स्थानांतरण/कार्य स्थान)" },
  { value: "Shift and Duty Allocation", label: "Shift and Duty Allocation (पारी और कार्य आवंटन)" },
  { value: "Payslip", label: "Payslip (वेतन पर्ची)" },
];

const remarkOptionsMap = {
  "Salary": [
    { value: "Salary not credited", label: "Salary not credited (वेतन जमा नहीं हुआ)" },
    { value: "Salary discrepancy", label: "Salary discrepancy (वेतन में विसंगति)" },
  ],
  "Work Environment": [
    { value: "Harassment", label: "Harassment (उत्पीड़न)" },
    { value: "Behavioral issue", label: "Behavioral issue (व्यवहार संबंधी समस्या)" },
    { value: "Workspace hygiene", label: "Workspace hygiene (कार्यस्थल स्वच्छता)" },
    { value: "Safety concern", label: "Safety concern (सुरक्षा संबंधी चिंता)" },
  ],
  "Attendance": [
    { value: "Attendance Correction", label: "Attendance Correction (उपस्थिति सुधार)" },
    { value: "Leave balance query", label: "Leave balance query (छुट्टी शेष पूछताछ)" },
  ],
  "Reporting Issue": [
    { value: "Manager Behavior", label: "Manager Behavior (प्रबंधक का व्यवहार)" },
    { value: "Unfair treatment", label: "Unfair treatment (अनुचित व्यवहार)" },
  ],
  "Transfer/Work Location": [
    { value: "Request to location change", label: "Request to location change (स्थान परिवर्तन का अनुरोध)" },
    { value: "Distance Issue", label: "Distance Issue (दूरी संबंधी समस्या)" },
  ],
  "Shift and Duty Allocation": [
    { value: "Duty timing", label: "Duty timing (कार्य समय)" },
    { value: "Work Overload", label: "Work Overload (कार्यभार अधिक होना)" },
  ],
  "Payroll/Payslip": [
    { value: "Payslip Required", label: "Payslip Required (वेतन पर्ची आवश्यक)" },
  ],
};



//Handling conditional Role

let conditionalRole;

if (userData?.role === 'ACI') {
  conditionalRole = [ 'Director', 'Community Incharge', 'Project Coordinator']
} else if (userData?.role === 'CC'){
  conditionalRole = ['Director', 'Community Incharge', 'Project Coordinator']
}

//----------------------------------------


  const handleSubmit = async () => {
    if (!concern || !remark || comment.trim() === "") {
      alert("Please select all required fields and provide a comment.");
      return;
    }

    setLoading(true); // NEW: start spinner

    const concernId = `${concern.value}-${remark.value}-${userData?.[0]?.userId ?? "NA"}`;
    const currentDate = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("concernId", concernId);
    formData.append("unqUserObjectId", userData?._id);
    formData.append("userId", userData?.userId ?? "NA");
    formData.append("districtId", userData?.district ?? "NA");
    formData.append("blockId", userData?.block ?? "NA");
    formData.append("schoolId", userData?.school ?? "NA");
    formData.append("concernType", "Individual");
    formData.append("concern", concern.value);
    formData.append("remark", remark.value);
    formData.append("concernStatusBySubmitter", "informative");
    formData.append("concernStatusByResolver", "informative");
    formData.append("dateOfSubmission", currentDate);
    formData.append("comment", comment);

     formData.append("uri1", "NA"); // default
    formData.append("uri2", "TechConcernResolution"); // default
    formData.append("uri3", "NA"); // default
    formData.append("conditionalRole", conditionalRole)
    formData.append("role", userData?.role)
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
    } finally {
      setLoading(false); // NEW: stop spinner
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
      <Button variant="primary" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            /> Submitting...
          </>
        ) : (
          "Submit Concern"
        )}
      </Button>
    </Container>
  );
};
