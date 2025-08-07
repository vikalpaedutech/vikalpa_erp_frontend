// import React, { useContext, useState } from "react";
// import { Button, Col, Container, Form, Row } from "react-bootstrap";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   DistrictBlockSchoolContext,
//   BlockContext,
//   SchoolContext,
//   SchoolProvider,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { createConcern } from "../../service/ConcernsServices/Concern.services";
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";
// import Spinner from "react-bootstrap/Spinner"; // NEW: Import Spinner

// const TechConcernForm = () => {
//   const { userData } = useContext(UserContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);

//   const [concern, setConcern] = useState(null);
//   const [remark, setRemark] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [file, setFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false); // NEW
//   const [key, setKey] = useState(Date.now()); // NEW
//   const [comment, setComment] = useState(""); // added comment field

//   const concernOptions = [
//     { value: "Screen", label: "Screen" },
//     { value: "Inverter", label: "Inverter" },
//     { value: "Microphone", label: "Microphone" },
//     { value: "Internet", label: "Internet" },
//     { value: "Camera", label: "Camera" },
//     { value: "Mini_PC", label: "Mini_PC" },
//     { value: "Electricity", label: "Electricity" },
//   ];

//   const remarkOptionsMap = {
//     Screen: [
//       { value: "Not working", label: "Not working" },
//       { value: "Unavailable", label: "Unavailable" },
//     ],
//     Inverter: [
//       { value: "Poor power backup", label: "Poor power backup" },
//       { value: "Not connected", label: "Not connected" },
//     ],
//     Microphone: [
//       { value: "Not working", label: "Not working" },
//       { value: "Unavailable", label: "Unavailable" },
//     ],
//     Internet: [
//       { value: "Connectivity Issue", label: "Connectivity Issue" },
//       { value: "Unavailable", label: "Unavailable" },
//       { value: "Slow", label: "Slow" },
//     ],
//     Camera: [
//       { value: "Not working", label: "Not working" },
//       { value: "Unavailable", label: "Unavailable" },
//     ],
//     Mini_PC: [
//       { value: "Not working", label: "Not working" },
//       { value: "Unavailable", label: "Unavailable" },
//     ],
//     Electricity: [
//       { value: "Not working", label: "Not working" },
//       { value: "Unavailable", label: "Unavailable" },
//     ],
//   };

//   const classOptions = [
//     { value: "9", label: "Class 9" },
//     { value: "10", label: "Class 10" },
//   ];


// //Handling conditional Role

// let conditionalRole;

// if (userData?.[0]?.role === 'ACI') {
//   conditionalRole = ['Community Manager', 'Director'] //Jin logo ko notification dikhana hai.
// } else if (userData?.[0]?.role === 'CC'){ 
//   conditionalRole = [ 'ACI', 'Community Incharge', 'Project Coordinator'] //Jin logo ko notification dikhana hai.
// }

// //----------------------------------------


//   const handleSubmit = async () => {
//     if (!concern || !remark || !schoolContext?.[0] || !selectedClass) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const schoolSelected = schoolContext[0];
//     const currentDate = new Date().toISOString().split("T")[0];
//     const concernId = `${concern.value}-${schoolSelected.value}-${selectedClass.value}`;

//     const formData = new FormData();
//     formData.append("concernId", concernId);
//     formData.append("userId", userData?.[0]?.userId ?? "NA");
//     formData.append("districtId", schoolSelected.districtId);
//     formData.append("blockId", schoolSelected.blockId);
//     formData.append("schoolId", schoolSelected.value);
//     formData.append("concernType", "Tech Concern");
//     formData.append("concern", concern.value);
//     formData.append("remark", remark.value);
//     formData.append("classOfConcern", selectedClass.value);
//     formData.append("concernStatusBySubmitter", "Raised");
//     formData.append("dateOfSubmission", currentDate);
//     formData.append("concernStatusByResolver", "");
//     formData.append("uri1", "NA"); // default
//     formData.append("uri2", "TechConcernResolution"); // default
//     formData.append("uri3", "NA"); // default
//     formData.append("conditionalRole", conditionalRole)
//     formData.append("role", userData?.[0]?.role)
//     if (comment) {
//       formData.append("comment", comment);
//     }
//     if (file) {
//       formData.append("file", file);
//     }

//     try {
//       setIsSubmitting(true); // NEW
//       await createConcern(formData);
//       alert("Tech Concern submitted successfully!");
//       setConcern(null);
//       setRemark(null);
//       setFile(null);
//       setComment(null)
//       setSelectedClass(null);
//       setSchoolContext("");
//       setKey(Date.now()); // NEW
//     } catch (error) {
//       console.error("Error submitting tech concern:", error.message);
//       alert("Submission failed.");
//     } finally {
//       setIsSubmitting(false); // NEW
//     }
//   };

//   return (
//     <Container className="my-4">
//       <h4>Tech Concern Submission</h4>
//       <hr></hr>

//       {/* School dropdowns */}
//       <Row>
//         <SchoolDropDowns key={key} />
//       </Row>

//       {/* Concern and Remark */}
//       <Row className="mb-3">
//         <Col md={4}>
//           <label>Concern Type</label>
//           <Select
//             options={concernOptions}
//             value={concern}
//             onChange={(selected) => {
//               setConcern(selected);
//               setRemark(null);
//             }}
//             placeholder="Concern Type"
//           />
//         </Col>

//         <Col md={4}>
//           <label>Remark</label>
//           <Select
//             options={remarkOptionsMap[concern?.value] || []}
//             value={remark}
//             onChange={(selected) => setRemark(selected)}
//             placeholder="Remark"
//           />
//         </Col>
//       </Row>

//       {/* Class of Concern */}
//       <Row className="mb-3">
//         <Col md={4}>
//           <label>Class</label>
//           <Select
//             options={classOptions}
//             value={selectedClass}
//             onChange={(selected) => setSelectedClass(selected)}
//             placeholder="Class"
//           />
//         </Col>
//       </Row>

//       {/* File Upload */}
//       <Row className="mb-3">
//         <Col md={6}>
//           <Form.Group>
//             <Form.Label>Attach File (optional)</Form.Label>
//             <Form.Control
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </Form.Group>
//         </Col>
//       </Row>

//       {/* Breif description about the concerns */}

//         <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Brief description of issue (required)</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                       placeholder="Type your comment here..."
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>      


//       {/* Submit */}
//       <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
//         {isSubmitting ? (
//           <>
//             <Spinner
//               as="span"
//               animation="border"
//               size="sm"
//               role="status"
//               aria-hidden="true"
//             />
//             <span className="ms-2">Submitting...</span>
//           </>
//         ) : (
//           "Submit Tech Concern"
//         )}
//       </Button>
//     </Container>
//   );
// };

// export default TechConcernForm;














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
import Spinner from "react-bootstrap/Spinner"; // NEW: Import Spinner

const TechConcernForm = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  const [concern, setConcern] = useState(null);
  const [remark, setRemark] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW
  const [key, setKey] = useState(Date.now()); // NEW
  const [comment, setComment] = useState(""); // added comment field

  const concernOptions = [
    { value: "Screen", label: "Screen" },
    { value: "Inverter", label: "Inverter" },
    { value: "Microphone", label: "Microphone" },
    { value: "Internet", label: "Internet" },
    { value: "Camera", label: "Camera" },
    { value: "Mini_PC", label: "Mini_PC" },
    { value: "Electricity", label: "Electricity" },
  ];

  const remarkOptionsMap = {
    Screen: [
      { value: "Not working", label: "Not working" },
      { value: "Unavailable", label: "Unavailable" },
    ],
    Inverter: [
      { value: "Poor power backup", label: "Poor power backup" },
      { value: "Not connected", label: "Not connected" },
    ],
    Microphone: [
      { value: "Not working", label: "Not working" },
      { value: "Unavailable", label: "Unavailable" },
    ],
    Internet: [
      { value: "Connectivity Issue", label: "Connectivity Issue" },
      { value: "Unavailable", label: "Unavailable" },
      { value: "Slow", label: "Slow" },
    ],
    Camera: [
      { value: "Not working", label: "Not working" },
      { value: "Unavailable", label: "Unavailable" },
    ],
    Mini_PC: [
      { value: "Not working", label: "Not working" },
      { value: "Unavailable", label: "Unavailable" },
    ],
    Electricity: [
      { value: "Not working", label: "Not working" },
      { value: "Unavailable", label: "Unavailable" },
    ],
  };

  const classOptions = [
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
  ];


  //Handling conditional Role

  let conditionalRole;

  if (userData?.[0]?.role === 'ACI') {
    conditionalRole = ['Community Manager', 'Director'] //Jin logo ko notification dikhana hai.
  } else if (userData?.[0]?.role === 'CC'){ 
    conditionalRole = [ 'ACI', 'Community Incharge', 'Project Coordinator'] //Jin logo ko notification dikhana hai.
  }

  //----------------------------------------


  const handleSubmit = async () => {
    if (!concern || !remark || !schoolContext?.[0] || !selectedClass || !comment.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const schoolSelected = schoolContext[0];
    const currentDate = new Date().toISOString().split("T")[0];
    const concernId = `${concern.value}-${schoolSelected.value}-${selectedClass.value}`;

    const formData = new FormData();
    formData.append("concernId", concernId);
    formData.append("userId", userData?.[0]?.userId ?? "NA");
    formData.append("districtId", schoolSelected.districtId);
    formData.append("blockId", schoolSelected.blockId);
    formData.append("schoolId", schoolSelected.value);
    formData.append("concernType", "Tech Concern");
    formData.append("concern", concern.value);
    formData.append("remark", remark.value);
    formData.append("classOfConcern", selectedClass.value);
    formData.append("concernStatusBySubmitter", "Raised");
    formData.append("dateOfSubmission", currentDate);
    formData.append("concernStatusByResolver", "");
    formData.append("uri1", "NA"); // default
    formData.append("uri2", "TechConcernResolution"); // default
    formData.append("uri3", "NA"); // default
    formData.append("conditionalRole", conditionalRole)
    formData.append("role", userData?.[0]?.role)
    if (comment) {
      formData.append("comment", comment);
    }
    if (file) {
      formData.append("file", file);
    }

    try {
      setIsSubmitting(true); // NEW
      await createConcern(formData);
      alert("Tech Concern submitted successfully!");
      setConcern(null);
      setRemark(null);
      setFile(null);
      setComment(""); // Reset comment field
      setSelectedClass(null);
      setSchoolContext("");
      setKey(Date.now()); // NEW
    } catch (error) {
      console.error("Error submitting tech concern:", error.message);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false); // NEW
    }
  };

  return (
    <Container className="my-4">
      <h4>Tech Concern Submission</h4>
      <hr></hr>

      {/* School dropdowns */}
      <Row>
        <SchoolDropDowns key={key} />
      </Row>

      {/* Concern and Remark */}
      <Row className="mb-3">
        <Col md={4}>
          <label>Concern Type</label>
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
          <label>Remark</label>
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
          <label>Class</label>
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

      {/* Breif description about the concerns */}

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

      {/* Submit */}
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
          "Submit Tech Concern"
        )}
      </Button>
    </Container>
  );
};

export default TechConcernForm;
