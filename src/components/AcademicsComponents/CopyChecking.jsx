// // /FRONTEND/src/components/AcademicsComponents/CopyChecking.jsx

import React, { useState, useEffect, useContext } from "react";
import { createDisciplinaryOrInteraction } from "../../service/StudentDisciplinaryOrInteraction.services";
import { getStudentsByQueryParams } from "../../service/Student.service";
import { Container, Button, Row, Col, Form, Card } from "react-bootstrap";
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
  const [selectedStatusesPerStudent, setSelectedStatusesPerStudent] = useState({});
  const [checkingTypePerStudent, setCheckingTypePerStudent] = useState({});

  const queryParams = {
    schoolId: schoolContext?.[0]?.value ?? userData[0].assignedSchools,
    classofStudent: classContext?.value ?? ['9', '10'],
    firstName: firstName
  };

  // useEffect(() => {
  //   const fetchStudentData = async () => {
  //     try {
  //       const response = await getStudentsByQueryParams(queryParams);
  //       setStudentData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching student data", error.message);
  //     }
  //   };

  //   fetchStudentData();
  // }, [schoolContext, classContext, firstName]);



useEffect(() => {
  const fetchStudentData = async () => {
    try {
      const response = await getStudentsByQueryParams(queryParams);
      const enrichedData = response.data;

      const initStatuses = {};
      const initTypes = {};

      enrichedData.forEach((student) => {
        const srn = student.studentSrn;
        const copyRecords = student.todayCopyChecking || [];

        const subjectMap = {};
        let checkingType = null;

        copyRecords.forEach((rec) => {
          if (rec.classWorkChecking !== "NA") {
            subjectMap[rec.subject] = rec.classWorkChecking;
            checkingType = { value: "Class Work", label: "Class Work" };
          } else if (rec.homeWorkChecking !== "NA") {
            subjectMap[rec.subject] = rec.homeWorkChecking;
            checkingType = { value: "Home Work", label: "Home Work" };
          }
        });

        if (Object.keys(subjectMap).length > 0) {
          initStatuses[srn] = subjectMap;
        }

        if (checkingType) {
          initTypes[srn] = checkingType;
        }
      });

      setSelectedStatusesPerStudent(initStatuses);
      setCheckingTypePerStudent(initTypes);
      setStudentData(enrichedData);
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
    { value: "Unavailable", label: "Unavailable" },
  ];

  const handleStatusChange = (srn, subject, status) => {
    setSelectedStatusesPerStudent(prev => {
      const studentStatuses = prev[srn] || {};
      return {
        ...prev,
        [srn]: {
          ...studentStatuses,
          [subject]: status
        }
      };
    });
  };

  const handleSubmit = async (student) => {
    const srn = student.studentSrn;
    const checkType = checkingTypePerStudent[srn]?.value;
    const subjectStatusMap = selectedStatusesPerStudent[srn];

    if (!checkType) {
      alert("Please select whether you're checking Class Work or Home Work.");
      return;
    }

    if (!subjectStatusMap || Object.keys(subjectStatusMap).length === 0) {
      alert("Please select at least one subject's status.");
      return;
    }

    try {
      for (let [subject, status] of Object.entries(subjectStatusMap)) {
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
          classWorkChecking: checkType === "Class Work" ? status : "NA",
          homeWorkChecking: checkType === "Home Work" ? status : "NA",
          userId: userData?.[0]?.userId ?? "Not-known",
        };

        await createDisciplinaryOrInteraction(formData);
      }

      alert("Copy checking submitted!");

      setSelectedStatusesPerStudent(prev => ({ ...prev, [srn]: {} }));
      setCheckingTypePerStudent(prev => ({ ...prev, [srn]: null }));
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
              <p><b>Select work type and subject statuses inside each student card</b></p>
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
              const statuses = selectedStatusesPerStudent[srn] || {};
              return (
                <Col md={6} lg={4} key={srn} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {index + 1}. {student.firstName} (SRN: {srn})
                      </Card.Title>

                      <Form.Group className="mb-2">
                        <Form.Label>Select Checking Type</Form.Label>
                        <Select
                          options={[{ value: "Class Work", label: "Class Work" }, { value: "Home Work", label: "Home Work" }]}
                          value={checkingTypePerStudent[srn] || null}
                          onChange={(option) =>
                            setCheckingTypePerStudent((prev) => ({
                              ...prev,
                              [srn]: option,
                            }))
                          }
                          placeholder="Select Type"
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Subjects</Form.Label>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Subject</th>
                                {checkingOptions.map((opt) => (
                                  <th key={opt.value}>{opt.label}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {subjectOptions.map((subj) => (
                                <tr key={subj.value}>
                                  <td>{subj.label}</td>
                                  {checkingOptions.map((opt) => (
                                    <td key={opt.value}>
                                      <Form.Check
                                        type="checkbox"
                                        checked={statuses[subj.value] === opt.value}
                                        onChange={() => handleStatusChange(srn, subj.value, opt.value)}
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
