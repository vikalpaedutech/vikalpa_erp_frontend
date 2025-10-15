// // Disciplinary.component.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { createDisciplinaryOrInteraction } from "../../service/StudentDisciplinaryOrInteraction.services";
// import { getStudentsByQueryParams } from "../../service/Student.service";
// import { Container, Table, Button, Row, Col ,Card, Form} from "react-bootstrap";
// import Select from "react-select";
// import {
//   DistrictBlockSchoolContext,
//   BlockContext,
//   SchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { UserContext } from "../contextAPIs/User.context";

// import { DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";

// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";

// import { Disciplinary } from "../../service/ErpTest.services.js";



// //ERP route back.

// import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";

// export const StudentDisciplinaryOrInteraction = () => {
//   const { userData } = useContext(UserContext);

//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   const [firstName, setFirstName] = useState('')
//   const [studentData, setStudentData] = useState([]);
//   const [globalSubject, setGlobalSubject] = useState(null);
//   const [globalType, setGlobalType] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState({});
//   const [remarks, setRemarks] = useState({});



//   //---------------------------------------------------------
  
// const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

// const allDistrictIds = regions.flatMap(region => 
//   region.districtId
// )

// console.log(allDistrictIds)

// //--------------------------------------------

//   const queryParams = {
//     schoolId: schoolContext?.[0]?.value ?? allSchoolIds,
//     classofStudent: classContext?.value ?? ['9', '10'],
//     firstName: firstName
//   };

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const response = await getStudentsByQueryParams(queryParams);
//         setStudentData(response.data);
//         console.log(response.data)
//       } catch (error) {
//         console.error("Error fetching student data", error.message);
//       }
//     };
//     fetchStudentData();
//   }, [schoolContext, classContext, firstName]);

//   useEffect(() => {
//     setBlockContext("");
//     setSchoolContext("");
//   }, [districtContext]);

//   const subject = [
//     { value: "English", label: "English" },
//     { value: "Hindi", label: "Hindi" },
//     { value: "Maths", label: "Maths" },
//     { value: "Science", label: "Science" },
//     { value: "S.St", label: "S.St" },
//     { value: "S.Sc", label: "S.Sc" },
//     { value: "Optional", label: "Optional" },
//   ];

//   const disciplinaryAndInteractionOptions = [
//     { value: "Disciplinary", label: "Disciplinary" },
//     { value: "Interaction", label: "Interaction" },
//   ];

//   const statusOptions = {
//     Disciplinary: [
//   { value: "Late Arrival", label: "Late Arrival" },
//   { value: "Absenteeism", label: "Absenteeism" },
//   { value: "Using Mobile Phone", label: "Using Mobile Phone" },
//   { value: "Talking", label: "Talking" },
//   { value: "Disrespectful to Teacher", label: "Disrespectful to Teacher" },
//   { value: "Cheating", label: "Cheating" },
//   { value: "Leaving Class", label: "Leaving Class" },
//   { value: "Fighting", label: "Fighting" },
//   { value: "Inappropriate Language", label: "Inappropriate Language" },
//   { value: "Disrupting Class", label: "Disrupting Class" },
//   { value: "Prohibited Items", label: "Prohibited Items" },
//   { value: "Defiance", label: "Defiance" },
//   { value: "Theft", label: "Theft" },
//   { value: "Misuse of Resources", label: "Misuse of Resources" },
//   { value: "Sleeping", label: "Sleeping" },
//   { value: "Encouraging Indiscipline", label: "Encouraging Indiscipline" },
 
//   ],

//     Interaction: [
//       { value: "Student-Teacher", label: "Student-Teacher" },
//       { value: "Teacher-Student", label: "Teacher-Student" },
//       { value: "Teacher asked question", label: "Teacher asked question" },
//       { value: "Student answered", label: "Student answered" },
//     ],
//   };

//   const handleSubmit = async (student) => {
    
//     const srn = student.studentSrn;
//     const selectedStatuses = selectedStatus[srn];
//     const remark = remarks[srn] || "";

//     if ( !selectedStatuses || selectedStatuses.length === 0) {
//       alert("Please fill subject, type, and status before submitting.");
//       return;
//     }

//     const formDataArray = selectedStatuses.map((status) => ({
//       studentSrn: srn,
//       firstName: student.firstName,
//       fatherName: student.fatherName,
//       classofStudent: student.classofStudent || classContext?.id || "NA",
//       districtId: student.districtId || districtContext?.id || "NA",
//       blockId: student.blockId || blockContext?.id || "NA",
//       schoolId: student.schoolId || schoolContext?.id || "NA",
//       subject: "NA",
//       status: "Disciplinary",
//       remark: status.value,
//       // remark: remark,
//       userId: userData?.[0]?.userId ?? "Not-known",
//     }));

//     try {
//       for (const formData of formDataArray) {
//         await createDisciplinaryOrInteraction(formData);

//         //ERP Test

//         if (userData.role === "hkrn"){
//           const erpTestReqBody = {

//             unqUserObjectId: userData._id,
//             userId:userData.userId,
//             disciplnary: true
//           }

//           const responseErpTestDisciplinary = await Disciplinary(erpTestReqBody)


//     //function for routing back to test page after succesfully completting the task
         
//     ErpTestPageRouteBack(userData, {keyStatus: 'disciplinary'})
//         }
//       }

//       alert("Data submitted successfully!");

//       setSelectedStatus((prev) => ({ ...prev, [srn]: [] }));
//       setRemarks((prev) => ({ ...prev, [srn]: "" }));
//     } catch (error) {
//       console.error("Submit error:", error.message);
//       alert("Failed to submit data.");
//     }
//   };

//   const assignedDistricts = allDistrictIds;

//   const statusList = statusOptions[globalType?.value] || [];

//   return (
//     <Row className="justify-content-center">
//       <Col xs={12}>
//         <Container fluid className="prevent-overflow">
//           {/* <Row>
//             <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
//           </Row> */}

//           <Row>
//             <SchoolDropdown/>
//           </Row>

//           <Row>
//             <Col>
//               <ClassOfStudent />
//             </Col>
//           </Row>

//           <Row>
//             <Form>
//              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
//         <Form.Label column sm="2">
//           Filter Student Name
//         </Form.Label>
//         <Col sm="10">
//           <Form.Control type="text" placeholder="text" onChange={(e)=>setFirstName(e.target.value)} />
//         </Col>
//       </Form.Group>
//       </Form>
//           </Row>

//           {/* <Row className="my-3">
//             <Col md={6}>
//               <Select
//                 options={subject}
//                 value={globalSubject}
//                 onChange={(option) => setGlobalSubject(option)}
//                 placeholder="Select Subject (Applies to All)"
//               />
//             </Col>
//             <Col md={6}>
//               <Select
//                 options={disciplinaryAndInteractionOptions}
//                 value={globalType}
//                 onChange={(option) => {
//                   setGlobalType(option);
//                   setSelectedStatus({});
//                 }}
//                 placeholder="Select Type (Applies to All)"
//               />
//             </Col>
//           </Row> */}

//           <Row>
//       {studentData.map((student, index) => {
//         const srn = student.studentSrn;

//         return (
//           <Col md={6} lg={4} key={srn} className="mb-4">
//             <br></br>
//             <Card className="h-100 shadow-sm">
//               <Card.Body>
//                  <Card.Subtitle className="mb-3 text-muted" style={{backgroundColor:'#F0F8FF', fontSize:'30px'}}>Total Raises in past: {student.disciplinaryCount}</Card.Subtitle>
//                 <hr></hr>
//                 <Card.Title className="mb-2">
//                   {index + 1}. {student.firstName}
//                 </Card.Title>
               
//                 <Card.Subtitle className="mb-3 text-muted">SRN: {srn}</Card.Subtitle>

//                 <div className="mb-3">
//                   <label className="form-label fw-bold">Status</label>
//                   <Select
//                     options={statusOptions.Disciplinary}
//                     value={selectedStatus[srn] || []}
//                     onChange={(option) =>
//                       setSelectedStatus((prev) => ({
//                         ...prev,
//                         [srn]: option,
//                       }))
//                     }
//                     placeholder="Select Status"
//                     isMulti
//                     closeMenuOnSelect={false}
//                   />
//                 </div>

//                 <Button
//                   variant="success"
//                   onClick={() => handleSubmit(student)}
//                   className="w-100"
//                 >
//                   Submit
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         );
//       })}
//     </Row>
//         </Container>
//       </Col>
//     </Row>
//   );
// };




















// Disciplinary.component.jsx

import React, { useState, useEffect, useContext } from "react";
import { createDisciplinaryOrInteraction } from "../../service/StudentDisciplinaryOrInteraction.services";
import { getStudentsByQueryParams } from "../../service/Student.service";
import { Container, Table, Button, Row, Col ,Card, Form} from "react-bootstrap";
import Select from "react-select";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { UserContext } from "../contextAPIs/User.context";

import { DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";

import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";

import { Disciplinary } from "../../service/ErpTest.services.js";

//ERP route back.

import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";

export const StudentDisciplinaryOrInteraction = () => {
  const { userData } = useContext(UserContext);

  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext } = useContext(ClassContext);

  const [firstName, setFirstName] = useState('')
  const [studentData, setStudentData] = useState([]);
  const [globalSubject, setGlobalSubject] = useState(null);
  const [globalType, setGlobalType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [remarks, setRemarks] = useState({});

  //---------------------------------------------------------
  
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

//--------------------------------------------

  const queryParams = {
    schoolId: schoolContext?.[0]?.value ?? allSchoolIds,
    classofStudent: classContext?.value ?? ['9', '10'],
    firstName: firstName
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getStudentsByQueryParams(queryParams);
        setStudentData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching student data", error.message);
      }
    };
    fetchStudentData();
  }, [schoolContext, classContext, firstName]);

  useEffect(() => {
    setBlockContext("");
    setSchoolContext("");
  }, [districtContext]);

  const subject = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Maths", label: "Maths" },
    { value: "Science", label: "Science" },
    { value: "S.St", label: "S.St" },
    { value: "S.Sc", label: "S.Sc" },
    { value: "Optional", label: "Optional" },
  ];

  const disciplinaryAndInteractionOptions = [
    { value: "Disciplinary", label: "Disciplinary" },
    { value: "Interaction", label: "Interaction" },
  ];

  const statusOptions = {
    Disciplinary: [
  { value: "Late Arrival", label: "Late Arrival" },
  { value: "Absenteeism", label: "Absenteeism" },
  { value: "Using Mobile Phone", label: "Using Mobile Phone" },
  { value: "Talking", label: "Talking" },
  { value: "Disrespectful to Teacher", label: "Disrespectful to Teacher" },
  { value: "Cheating", label: "Cheating" },
  { value: "Leaving Class", label: "Leaving Class" },
  { value: "Fighting", label: "Fighting" },
  { value: "Inappropriate Language", label: "Inappropriate Language" },
  { value: "Disrupting Class", label: "Disrupting Class" },
  { value: "Prohibited Items", label: "Prohibited Items" },
  { value: "Defiance", label: "Defiance" },
  { value: "Theft", label: "Theft" },
  { value: "Misuse of Resources", label: "Misuse of Resources" },
  { value: "Sleeping", label: "Sleeping" },
  { value: "Encouraging Indiscipline", label: "Encouraging Indiscipline" },
 
  ],

    Interaction: [
      { value: "Student-Teacher", label: "Student-Teacher" },
      { value: "Teacher-Student", label: "Teacher-Student" },
      { value: "Teacher asked question", label: "Teacher asked question" },
      { value: "Student answered", label: "Student answered" },
    ],
  };

  const handleSubmit = async (student) => {
    
    const srn = student.studentSrn;
    const selectedStatuses = selectedStatus[srn];
    const remark = remarks[srn] || "";

    if ( !selectedStatuses || selectedStatuses.length === 0) {
      alert("Please fill subject, type, and status before submitting.");
      return;
    }

    const formDataArray = selectedStatuses.map((status) => ({
      studentSrn: srn,
      firstName: student.firstName,
      fatherName: student.fatherName,
      classofStudent: student.classofStudent || classContext?.id || "NA",
      districtId: student.districtId || districtContext?.id || "NA",
      blockId: student.blockId || blockContext?.id || "NA",
      schoolId: student.schoolId || schoolContext?.id || "NA",
      subject: "NA",
      status: "Disciplinary",
      remark: status.value,
      // remark: remark,
      userId: userData?.[0]?.userId ?? "Not-known",
    }));

    try {
      for (const formData of formDataArray) {
        await createDisciplinaryOrInteraction(formData);

        //ERP Test

        if (userData.role === "hkrn"){
          // Updated ERP request body to send disciplinary object
          const erpTestReqBody = {
            unqUserObjectId: userData._id,
            userId: userData.userId,
            disciplinary: {
              [student.firstName]: selectedStatuses.map(s => s.value).join(", ") // store multiple remarks as comma-separated
            }
          }

          const responseErpTestDisciplinary = await Disciplinary(erpTestReqBody)

          //function for routing back to test page after succesfully completting the task
          // ErpTestPageRouteBack(userData, {keyStatus: 'disciplinary'})
        }
      }

      alert("Data submitted successfully!");

      setSelectedStatus((prev) => ({ ...prev, [srn]: [] }));
      setRemarks((prev) => ({ ...prev, [srn]: "" }));
    } catch (error) {
      console.error("Submit error:", error.message);
      alert("Failed to submit data.");
    }
  };

  const assignedDistricts = allDistrictIds;

  const statusList = statusOptions[globalType?.value] || [];

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <Container fluid className="prevent-overflow">
          {/* <Row>
            <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
          </Row> */}

          <Row>
            <SchoolDropdown/>
          </Row>

          <Row>
            <Col>
              <ClassOfStudent />
            </Col>
          </Row>

          <Row>
            <Form>
             <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Filter Student Name
        </Form.Label>
        <Col sm="10">
          <Form.Control type="text" placeholder="text" onChange={(e)=>setFirstName(e.target.value)} />
        </Col>
      </Form.Group>
      </Form>
          </Row>

          {/* <Row className="my-3">
            <Col md={6}>
              <Select
                options={subject}
                value={globalSubject}
                onChange={(option) => setGlobalSubject(option)}
                placeholder="Select Subject (Applies to All)"
              />
            </Col>
            <Col md={6}>
              <Select
                options={disciplinaryAndInteractionOptions}
                value={globalType}
                onChange={(option) => {
                  setGlobalType(option);
                  setSelectedStatus({});
                }}
                placeholder="Select Type (Applies to All)"
              />
            </Col>
          </Row> */}

          <Row>
      {studentData.map((student, index) => {
        const srn = student.studentSrn;

        return (
          <Col md={6} lg={4} key={srn} className="mb-4">
            <br></br>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                 <Card.Subtitle className="mb-3 text-muted" style={{backgroundColor:'#F0F8FF', fontSize:'30px'}}>Total Raises in past: {student.disciplinaryCount}</Card.Subtitle>
                <hr></hr>
                <Card.Title className="mb-2">
                  {index + 1}. {student.firstName}
                </Card.Title>
               
                <Card.Subtitle className="mb-3 text-muted">SRN: {srn}</Card.Subtitle>

                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <Select
                    options={statusOptions.Disciplinary}
                    value={selectedStatus[srn] || []}
                    onChange={(option) =>
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [srn]: option,
                      }))
                    }
                    placeholder="Select Status"
                    isMulti
                    closeMenuOnSelect={false}
                  />
                </div>

                <Button
                  variant="success"
                  onClick={() => handleSubmit(student)}
                  className="w-100"
                >
                  Submit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
        </Container>
      </Col>
    </Row>
  );
};
