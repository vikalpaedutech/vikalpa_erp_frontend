import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner  } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { createConcern } from "../../service/ConcernsServices/Concern.services";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";
import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";
import { handlingConcern } from "../../service/ErpTest.services.js";


//ERP test route back

import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";

const SchoolConcernsForm = () => {
  const { userData } = useContext(UserContext);
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  const [concern, setConcern] = useState(null);
  const [remark, setRemark] = useState(null);
  const [classOfConcern, setClassOfConcern] = useState(null); // added class state
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState(""); // added comment field
  const [studentSrn, setStudentSrn] = useState(""); // for SLC option
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: For spinner
  const [key, setKey] = useState(Date.now()); // NEW: For resetting SchoolDropDowns

  const concernOptions = [
    { value: "School", label: "School" },
    { value: "Student", label: "Student" },
  ];

  const remarkOptionsMap = {
    "School": [
      { value: "School Closed", label: "School Closed" },
      { value: "School Half-Day", label: "School Half-Day" },
      { value: "Class Interrupted", label: "Class Interrupted" },
      { value: "Optional Class", label: "Optional Class" },
      { value: "Exam", label: "Exam" },
      { value: "Photocopy", label: "Photocopy" },
      { value: "Question Paper Checking", label: "Question Paper Checking" },
      { value: "T.A", label: "T.A" },
      { value: "Uniform/Books Funds", label: "Uniform/Books Funds" },
      { value: "Other FundS", label: "Other Funds" },
    ],
    "Student": [
      { value: "MB App not working", label: "MB App not working" },
      { value: "Add Student on ERP", label: "Add student on ERP" },
      { value: "New Admission", label: "New Admission" },
      { value: "SLC Released, Remove", label: "SLC Released, Remove" },
       { value: "Center Change", label: "Center Change" },
      { value: "SLC", label: "SLC" },
      { value: "Optional Subject", label: "Optional Subject" },
      { value: "Document", label: "Document" },
      { value: "Funds issue", label: "Funds issue" },
      { value: "School Timing Issue", label: "School Timing Issue" },
      { value: "Bank Details", label: "Bank Details" },
      { value: "Emergency", label: "Emergency" },
      
    ],
  };

  // For classOfConcern dropdown (like tech concerns)
  const classOptions = [
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];


//Handling conditional Role

let conditionalRole;

if (userData?.role === 'ACI') {
  conditionalRole = ['Community Manager', 'Director']
} else if (userData?.role === 'CC'){
  conditionalRole = [ 'ACI', 'Community Incharge', 'Project Coordinator']
}

//----------------------------------------

//--------------------------------------------------------------------------

const regions = userData?.userAccess?.region || [];
const allSchoolIds = regions.flatMap(region =>
  region.blockIds.flatMap(block =>
    block.schoolIds.map(school => school.schoolId)
  )
);

const allDistrictIds = regions.flatMap(region => 
  region.districtId
)

console.log(allDistrictIds)

//------------------------------------------------------------------------







  const handleSubmit = async () => {
    console.log(schoolContext);
    console.log(concern)
    console.log(remark)
    console.log(schoolContext)
    console.log(classOfConcern)
    if (!concern || !remark || !schoolContext || !classOfConcern) {
      alert("Please select all fields before submitting.");
      return;
    }

    // Check comment requirement
    const requiresComment = true;
    if (requiresComment && comment.trim() === "") {
      alert("Please enter a comment for this concern.");
      return;
    }

    // Validate student SRN if Student
    if (concern.value === "Student") {
      const srnRegex = /^\d{10}$/;
      if (!srnRegex.test(studentSrn)) {
        alert("Please enter a valid 10-digit Student SRN.");
        return;
      }
    }

    const schoolSelected = schoolContext;
    const currentDate = new Date().toISOString().split("T")[0];


    let concernId;
    if (concern.value === "Student") {
       concernId = `${concern.value}-${remark.value.replace(" ", "")}-${schoolSelected.value}-${currentDate}-${classOfConcern.value}-${studentSrn}`;
    } else {
      concernId = `${concern.value}-${remark.value.replace(" ", "")}-${schoolSelected.value}-${currentDate}-${classOfConcern.value}`;
    }
    

    const formData = new FormData();
    formData.append("concernId", concernId);
        formData.append("unqUserObjectId", userData?._id);
    formData.append("userId", userData?.userId ?? "NA");
    formData.append("districtId", schoolSelected.districtId);
    formData.append("blockId", schoolSelected.blockId);
    formData.append("schoolId", schoolSelected.value);
    formData.append("concernType", "School-Individual-Student"); // hidden/default
    formData.append("concern", concern.value);
    formData.append("remark", remark.value);
    formData.append("classOfConcern", classOfConcern.value); // added class
    formData.append("concernStatusBySubmitter", "Raised"); // default
    formData.append("dateOfSubmission", currentDate);
    formData.append("concernStatusByResolver", "Pending"); // default
    formData.append("uri1", "NA"); // default
    formData.append("uri2", "SchoolConcernResolution"); // default
    formData.append("uri3", "NA"); // default
    formData.append("conditionalRole", conditionalRole)
    formData.append("role", userData?.role)
    if (comment) {
      formData.append("comment", comment);
    }
    if (concern.value === "Student" && studentSrn) {
      formData.append("studentSrn", studentSrn);
    }
    if (file) {
      formData.append("file", file);
    }

    try {
      setIsSubmitting(true); // NEW
      const response = await createConcern(formData);

      
      //ERP Test

      let erpTestConcernType;


    if (concern.value === "Student"){
      erpTestConcernType = "Student-Concern"
    } else if (concern.value === "School") {
      erpTestConcernType = "School-Concern"
    }

      


      // if (userData.role === "hkrn"){
      //   const erpTestReqBody = {
        
      //             unqUserObjectId: userData._id,
      //             userId: userData.userId,
      //             concernType: erpTestConcernType
      //           }
        
        
      //           const responseERpTest = await handlingConcern(erpTestReqBody)

      //  //function for routing back to test page after succesfully completting the task
                
      //  ErpTestPageRouteBack(userData, {keyStatus: erpTestConcernType})
                
                
      // }




      if (userData.role === "hkrn"){
  const erpTestReqBody = {
    unqUserObjectId: userData._id,
    userId: userData.userId,
    concernType: erpTestConcernType,              // "School-Concern" or "Student-Concern"
    concern: concern.value,                        // "School" or "Student"
    remark: remark.value,                          // remark selected in UI
    classOfConcern: classOfConcern.value,          // class selected
    schoolId: schoolSelected.value,                // school id
    dateOfSubmission: currentDate,
    comment: comment || null,
    studentSrn: concern.value === "Student" ? studentSrn : null
  }

  const responseERpTest = await handlingConcern(erpTestReqBody)

  //function for routing back to test page after succesfully completting the task
  // ErpTestPageRouteBack(userData, {keyStatus: erpTestConcernType})
}

      //------------------------

    if(response.status===200){
      alert('Concern created successfully!')
      
    } 
      setConcern(null);
      setRemark(null);
      setClassOfConcern(null); // reset class too
      setFile(null);
      setComment(""); // reset comment
      setStudentSrn(""); // reset srn
     setSchoolContext([]); // setSchoolContext("");
      setKey(Date.now()); // force re-render of SchoolDropDowns
    } catch (error) {
      console.error("Error submitting concern:", error.message);
      alert(`Submission Failed! A school concern cannot be duplicated. You cannot create the same type of concern on the same date before closing the previous one..`)
    } finally {
      setIsSubmitting(false); // NEW
    }
  };

  const assignedDistricts = allDistrictIds || [];


  return (
    <Container className="my-4">
      <h4>School/Individual Student Concern Submission</h4>
      <hr></hr>

      {/* Dependent Dropdowns */}
      <Row>
        <SchoolDropdown key={key} />
        
      </Row>

      <br></br>

      {/* Concern, Remark & Class */}
      <Row className="mb-3">
        <Col md={3}>
          <label>Concern Type</label>
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
          <label>Remark</label>
          <Select
            options={remarkOptionsMap[concern?.value] || []}
            value={remark}
            onChange={(selected) => setRemark(selected)}
            placeholder="Remark"
          />
        </Col>

        {/* Student SRN Field (only for Student) */}
        {concern?.value === "Student" && (
          // <Row className="mb-3">
          //   <Col md={4}>
          //     <Form.Group>
          //       <Form.Label>Student SRN (10 digits)</Form.Label>
          //       <Form.Control
          //         type="text"
          //         value={studentSrn}
          //         onChange={(e) => setStudentSrn(e.target.value)}
          //         placeholder="Enter 10-digit SRN"
          //       />
          //     </Form.Group>
          //   </Col>
          // </Row>




          <Row className="mb-3">
  <Col md={4}>
    <Form.Group>
      <Form.Label>Student SRN (10 digits)</Form.Label>
      <Form.Control
        type="text"
        inputMode="numeric"
        pattern="\d{10}"
        maxLength={10}
        value={studentSrn}
        onChange={(e) => {
          const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-digits
          setStudentSrn(onlyNums);
        }}
        placeholder="Enter 10-digit SRN"
      />
    </Form.Group>
  </Col>
</Row>
        )}

        <Col md={3}>
          <label>Class</label>
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

      {/* Comment Field */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Brief description of issue (required)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your comment here..."
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Submit Button */}
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
          "Submit Concern"
        )}
      </Button>
    </Container>
  );
};

export default SchoolConcernsForm;
