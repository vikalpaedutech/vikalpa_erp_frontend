// /FRONTEND/src/components/AcademicsComponents/CopyChecking.jsx

import React, { useState, useEffect, useContext } from "react";
import { createDisciplinaryOrInteraction } from "../../service/StudentDisciplinaryOrInteraction.services";
import { getStudentsByQueryParams } from "../../service/Student.service";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { UserContext } from "../contextAPIs/User.context";

import { DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const CopyChecking = () => {
  const { userData } = useContext(UserContext);
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext } = useContext(ClassContext);

  const [studentData, setStudentData] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [classWorkStatus, setClassWorkStatus] = useState({});
  const [homeWorkStatus, setHomeWorkStatus] = useState({});

  const queryParams = {
    schoolId: schoolContext?.[0]?.value ?? null,
    classofStudent: classContext?.value ?? null,
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
  }, [schoolContext, classContext]);

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
    { value: "S.Sc", label: "S.Sc" },
    { value: "Optional", label: "Optional" },
  ];

  const checkingOptions = [
    { value: "Complete", label: "Complete" },
    { value: "Incomplete", label: "Incomplete" },
    { value: "Copy-not-brought", label: "Copy-not-brought" },
  ];

  const handleSubmit = async (student) => {
    if (!subjectSelected) {
      alert("Please select the subject at the top before submitting.");
      return;
    }

    const srn = student.studentSrn;
    const classWork = classWorkStatus[srn]?.value;
    const homeWork = homeWorkStatus[srn]?.value;

    if (!classWork || !homeWork) {
      alert("Please select both class work and home work status.");
      return;
    }

    const formData = {
      studentSrn: srn,
      firstName: student.firstName,
      fatherName: student.fatherName,
      classofStudent: student.classofStudent || classContext?.id || "NA",
      districtId: student.districtId || districtContext?.id || "NA",
      blockId: student.blockId || blockContext?.id || "NA",
      schoolId: student.schoolId || schoolContext?.id || "NA",
      subject: subjectSelected.value,
      status: "Copy Checking",
      classWorkChecking: classWork,
      homeWorkChecking: homeWork,
      userId: userData?.[0]?.userId ?? "Not-known",
    };

    try {
      await createDisciplinaryOrInteraction(formData);
      alert("Copy checking submitted!");

      setClassWorkStatus((prev) => ({ ...prev, [srn]: null }));
      setHomeWorkStatus((prev) => ({ ...prev, [srn]: null }));
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
          <Row>
            <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />
          </Row>

          <Row>
            <Col>
              <ClassOfStudent />
            </Col>
          </Row>

          <Row className="my-3">
            <Col md={4}>
              <Select
                options={subjectOptions}
                value={subjectSelected}
                onChange={setSubjectSelected}
                placeholder="Select Subject (applies to all)"
              />
            </Col>
          </Row>

          <Row>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>SRN</th>
                  <th>Student</th>
                  <th>Father</th>
                  <th>Class Work</th>
                  <th>Home Work</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, index) => {
                  const srn = student.studentSrn;
                  return (
                    <tr key={srn}>
                      <td>{index + 1}</td>
                      <td>{srn}</td>
                      <td>{student.firstName}</td>
                      <td>{student.fatherName}</td>
                      <td>
                        <Select
                          options={checkingOptions}
                          value={classWorkStatus[srn] || null}
                          onChange={(option) =>
                            setClassWorkStatus((prev) => ({
                              ...prev,
                              [srn]: option,
                            }))
                          }
                          placeholder="Class Work"
                        />
                      </td>
                      <td>
                        <Select
                          options={checkingOptions}
                          value={homeWorkStatus[srn] || null}
                          onChange={(option) =>
                            setHomeWorkStatus((prev) => ({
                              ...prev,
                              [srn]: option,
                            }))
                          }
                          placeholder="Home Work"
                        />
                      </td>
                      <td>
                        <Button variant="primary" onClick={() => handleSubmit(student)}>
                          Submit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};
