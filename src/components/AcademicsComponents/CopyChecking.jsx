// // /FRONTEND/src/components/AcademicsComponents/CopyChecking.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { createDisciplinaryOrInteraction } from "../../service/StudentDisciplinaryOrInteraction.services";
// import { getStudentsByQueryParams } from "../../service/Student.service";
// import { Container, Table, Button, Row, Col, Form, Card } from "react-bootstrap";
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

// export const CopyChecking = () => {
//   const { userData } = useContext(UserContext);
//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext } = useContext(ClassContext);

//   const [firstName, setFirstName] = useState('')
//   const [studentData, setStudentData] = useState([]);
//   const [subjectSelected, setSubjectSelected] = useState(null);
//   const [classWorkStatus, setClassWorkStatus] = useState({});
//   const [homeWorkStatus, setHomeWorkStatus] = useState({});

//   const queryParams = {
//     schoolId: schoolContext?.[0]?.value ?? userData[0].assignedSchools ,
//     classofStudent: classContext?.value ?? ['9', '10'],
//     firstName: firstName
//   };

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const response = await getStudentsByQueryParams(queryParams);
//         setStudentData(response.data);
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

//   const subjectOptions = [
//     { value: "English", label: "English" },
//     { value: "Hindi", label: "Hindi" },
//     { value: "Maths", label: "Maths" },
//     { value: "Science", label: "Science" },
//     { value: "S.St", label: "S.St" },
//     // { value: "S.Sc", label: "S.Sc" },
//     // { value: "Optional", label: "Optional" },
//   ];

//   const checkingOptions = [
//     { value: "Complete", label: "Complete" },
//     { value: "Incomplete", label: "Incomplete" },
//     { value: "Copy-not-brought", label: "Copy-not-brought" },
//   ];

//   const handleSubmit = async (student) => {
//     if (!subjectSelected) {
//       alert("Please select the subject at the top before submitting.");
//       return;
//     }

//     const srn = student.studentSrn;
//     const classWork = classWorkStatus[srn]?.value;
//     const homeWork = homeWorkStatus[srn]?.value;

//     if (!classWork || !homeWork) {
//       alert("Please select both class work and home work status.");
//       return;
//     }

//     const formData = {
//       studentSrn: srn,
//       firstName: student.firstName,
//       fatherName: student.fatherName,
//       classofStudent: student.classofStudent || classContext?.id || "NA",
//       districtId: student.districtId || districtContext?.id || "NA",
//       blockId: student.blockId || blockContext?.id || "NA",
//       schoolId: student.schoolId || schoolContext?.id || "NA",
//       subject: subjectSelected.value,
//       status: "Copy Checking",
//       classWorkChecking: classWork,
//       homeWorkChecking: homeWork,
//       userId: userData?.[0]?.userId ?? "Not-known",
//     };

//     try {
//       await createDisciplinaryOrInteraction(formData);
//       alert("Copy checking submitted!");

//       setClassWorkStatus((prev) => ({ ...prev, [srn]: null }));
//       setHomeWorkStatus((prev) => ({ ...prev, [srn]: null }));
//     } catch (error) {
//       console.error("Error submitting:", error.message);
//       alert("Failed to submit data.");
//     }
//   };

//   const assignedDistricts = userData?.[0]?.assignedDistricts;

//   return (
//     <Row className="justify-content-center">
//       <Col xs={12}>
//         <Container fluid className="prevent-overflow">
//           {/* <Row>
//             <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
//           </Row> */}

//           <SchoolDropDowns/>

//           <Row>
//             <Col>
//               <ClassOfStudent />
//             </Col>
//           </Row>

//           <Row className="my-3">
//             <Col md={4}>
//               <Select
//                 options={subjectOptions}
//                 value={subjectSelected}
//                 onChange={setSubjectSelected}
//                 placeholder="Select Subject (applies to all)"
//               />
//             </Col>
//           </Row>

//           <Row>
//             <Form>
//             <Form.Group
//               as={Row}
//               className="mb-3"
//               controlId="formPlaintextPassword"
//             >
//               <Form.Label column sm="2">
//                 Filter Student Name
//               </Form.Label>
//               <Col sm="10">
//                 <Form.Control
//                   type="text"
//                   placeholder="text"
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </Col>
//             </Form.Group>
//           </Form>
//           </Row>

//           <Row>
//       {studentData.map((student, index) => {
//         const srn = student.studentSrn;
//         return (
//           <Col md={6} lg={4} key={srn} className="mb-3">
//             <Card>
//               <Card.Body>
//                 <Card.Title>
//                   {index + 1}. {student.firstName} (SRN: {srn})
//                 </Card.Title>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Class Work</Form.Label>
//                   <Select
//                     options={checkingOptions}
//                     value={classWorkStatus[srn] || null}
//                     onChange={(option) =>
//                       setClassWorkStatus((prev) => ({
//                         ...prev,
//                         [srn]: option,
//                       }))
//                     }
//                     placeholder="Select Class Work"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Home Work</Form.Label>
//                   <Select
//                     options={checkingOptions}
//                     value={homeWorkStatus[srn] || null}
//                     onChange={(option) =>
//                       setHomeWorkStatus((prev) => ({
//                         ...prev,
//                         [srn]: option,
//                       }))
//                     }
//                     placeholder="Select Home Work"
//                   />
//                 </Form.Group>

//                 <Button variant="primary" onClick={() => handleSubmit(student)}>
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




// /FRONTEND/src/components/AcademicsComponents/CopyChecking.jsx

import React, { useState, useEffect, useContext } from "react";
import { createDisciplinaryOrInteraction } from "../../service/StudentDisciplinaryOrInteraction.services";
import { getStudentsByQueryParams } from "../../service/Student.service";
import { Container, Table, Button, Row, Col, Form, Card } from "react-bootstrap";
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

export const CopyChecking = () => {
  const { userData } = useContext(UserContext);
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext } = useContext(ClassContext);

  const [firstName, setFirstName] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [classWorkStatus, setClassWorkStatus] = useState({});
  const [homeWorkStatus, setHomeWorkStatus] = useState({});
  const [selectedSubjectsPerStudent, setSelectedSubjectsPerStudent] = useState({});

  const queryParams = {
    schoolId: schoolContext?.[0]?.value ?? userData[0].assignedSchools,
    classofStudent: classContext?.value ?? ['9', '10'],
    firstName: firstName
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getStudentsByQueryParams(queryParams);
        setStudentData(response.data);
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

  const subjectOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Maths", label: "Maths" },
    { value: "Science", label: "Science" },
    { value: "S.St", label: "S.St" },
  ];

  const checkingOptions = [
    { value: "Complete", label: "Complete" },
    { value: "Incomplete", label: "Incomplete" },
    { value: "Copy-not-brought", label: "Copy-not-brought" },
  ];

  const handleSubjectCheckboxChange = (srn, subjectValue) => {
    setSelectedSubjectsPerStudent((prev) => {
      const currentSubjects = prev[srn] || [];
      const updatedSubjects = currentSubjects.includes(subjectValue)
        ? currentSubjects.filter((s) => s !== subjectValue)
        : [...currentSubjects, subjectValue];
      return { ...prev, [srn]: updatedSubjects };
    });
  };

  const handleSubmit = async (student) => {
  const srn = student.studentSrn;
  const classWork = classWorkStatus[srn]?.value;
  const homeWork = homeWorkStatus[srn]?.value;
  const selectedSubjects = selectedSubjectsPerStudent[srn] || [];

  if (selectedSubjects.length === 0) {
    alert("Please select at least one subject.");
    return;
  }

  if (!classWork && !homeWork) {
    alert("Please select either Class Work or Home Work status.");
    return;
  }

  try {
    for (let subject of selectedSubjects) {
      const formData = {
        studentSrn: srn,
        firstName: student.firstName,
        fatherName: student.fatherName,
        classofStudent: student.classofStudent || classContext?.id || "NA",
        districtId: student.districtId || districtContext?.id || "NA",
        blockId: student.blockId || blockContext?.id || "NA",
        schoolId: student.schoolId || schoolContext?.id || "NA",
        subject: subject,
        status: "Copy Checking",
        classWorkChecking: classWork ?? "Not-selected",
        homeWorkChecking: homeWork ?? "Not-selected",
        userId: userData?.[0]?.userId ?? "Not-known",
      };

      await createDisciplinaryOrInteraction(formData);
    }

    alert("Copy checking submitted!");

    setClassWorkStatus((prev) => ({ ...prev, [srn]: null }));
    setHomeWorkStatus((prev) => ({ ...prev, [srn]: null }));
    setSelectedSubjectsPerStudent((prev) => ({ ...prev, [srn]: [] }));
  } catch (error) {
    console.error("Error submitting:", error.message);
    alert("Failed to submit data.");
  }
};

  const assignedDistricts = userData?.[0]?.assignedDistricts;

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <Container fluid className="prevent-overflow">
          {/* <Row>
            <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
          </Row> */}

          <SchoolDropDowns />

          <Row>
            <Col>
              <ClassOfStudent />
            </Col>
          </Row>

          <Row className="my-3">
            <Col md={4}>
              <p><b>Select subjects inside each student card</b></p>
            </Col>
          </Row>

          <Row>
            <Form>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="2">
                  Filter Student Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    placeholder="text"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Row>

          <Row>
            {studentData.map((student, index) => {
              const srn = student.studentSrn;
              const selectedSubjects = selectedSubjectsPerStudent[srn] || [];
              return (
                <Col md={6} lg={4} key={srn} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {index + 1}. {student.firstName} (SRN: {srn})
                      </Card.Title>

                      <Form.Group className="mb-2">
                        <Form.Label>Subjects</Form.Label>
                        <div>
                          {subjectOptions.map((subject) => (
                            <Form.Check
                              key={subject.value}
                              type="checkbox"
                              label={subject.label}
                              checked={selectedSubjects.includes(subject.value)}
                              onChange={() =>
                                handleSubjectCheckboxChange(srn, subject.value)
                              }
                            />
                          ))}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Class Work</Form.Label>
                        <Select
                          options={checkingOptions}
                          value={classWorkStatus[srn] || null}
                          onChange={(option) =>
                            setClassWorkStatus((prev) => ({
                              ...prev,
                              [srn]: option,
                            }))
                          }
                          placeholder="Select Class Work"
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Home Work</Form.Label>
                        <Select
                          options={checkingOptions}
                          value={homeWorkStatus[srn] || null}
                          onChange={(option) =>
                            setHomeWorkStatus((prev) => ({
                              ...prev,
                              [srn]: option,
                            }))
                          }
                          placeholder="Select Home Work"
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        onClick={() => handleSubmit(student)}
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

