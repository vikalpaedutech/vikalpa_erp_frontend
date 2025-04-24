//Disciplinary.component.jsx

/*
This component will allow users or CCs to update students disciplinary issue in the classes:



*/

// Disciplinary.component.jsx

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

export const StudentDisciplinaryOrInteraction = () => {

  

      //using userContext
      const { userData, setUserData } = useContext(UserContext);
      //___________________________________________________

//District, block kschool context api hooks
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext, setClassContext } = useContext(ClassContext);
  const { userContext, setUserContext } = useContext(UserContext);

  //________________________________________________________________________

  const [studentData, setStudentData] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [selectedDIType, setSelectedDIType] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [remarks, setRemarks] = useState({});


  const queryParams = {
    
    schoolId: schoolContext?.[0]?.value ?? null,
    // classContext: classContext.value
  };

  useEffect(() => { 
    
  console.log("i am student's class",classContext.value)
    const fetchStudentData = async () => {
      try {
        const response = await getStudentsByQueryParams(queryParams);
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data", error.message);
      }
    };
console.log(userData.assignedDistricts)
    fetchStudentData();
  }, [ schoolContext, classContext]);

//Below snippet clears the filter

useEffect (()=>{

  setBlockContext("")
  setSchoolContext("")

}, [districtContext])



  //Below blocks variables are to be shown in select drop downs
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
      { value: "Eating", label: "Eating" },
      { value: "Running", label: "Running" },
      { value: "Talking", label: "Talking" },
      { value: "Fighting", label: "Fighting" },
      { value: "Abusing", label: "Abusing" },
    ],
    Interaction: [
      { value: "Student-Teacher", label: "Student-Teacher" },
      { value: "Teacher-Student", label: "Teacher-Student" },
      { value: "Teacher asked question", label: "Teacher asked question" },
      { value: "Student answered", label: "Student answered" },
      
    ],
  };

  //_____________________________________________________________________________

  const handleSubmit = async (student) => {
    const srn = student.studentSrn;
    const selectedSubject = selectedSubjects[srn];
    const selectedType = selectedDIType[srn];
    const selectedStatuses = selectedStatus[srn];
    const remark = remarks[srn] || "";

    if (!selectedSubject || !selectedType || !selectedStatuses || selectedStatuses.length === 0) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const formDataArray = selectedStatuses.map((status) => ({
      studentSrn: srn,
      firstName: student.firstName,
      fatherName: student.fatherName,
      classofStudent: student.classId || classContext?.id || "NA",
      districtId: student.districtId || districtContext?.id || "NA",
      blockId: student.blockId || blockContext?.id || "NA",
      schoolId: student.schoolId || schoolContext?.id || "NA",
      subject: selectedSubject.value,
      disciplinaryOrInteraction: selectedType.value,
      disciplinaryOrInteractiionRemark: status.value,
      remark: remark,
      userId: userData?.[0]?.userId ?? "Not-known",
    }));

    try {
      for (const formData of formDataArray) {
        console.log(formData);
        await createDisciplinaryOrInteraction(formData);
      }

      alert("Data submitted successfully!");

      // Reset fields for this student
      setSelectedSubjects((prev) => ({ ...prev, [srn]: null }));
      setSelectedDIType((prev) => ({ ...prev, [srn]: null }));
      setSelectedStatus((prev) => ({ ...prev, [srn]: [] }));
      setRemarks((prev) => ({ ...prev, [srn]: "" }));
    } catch (error) {
      console.error("Submit error:", error.message);
      alert("Failed to submit data.");
    }
  };

//Passing props to DistrictBlockSchoolById component for filtering for logged in users.
const assignedDistricts = userData[0].assignedDistricts;
console.log("i am user distrit", assignedDistricts);


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

      <Row>
      <Table responsive bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>SRN</th>
            <th>Student</th>
            <th>Father</th>
            {/* <th>District</th>
            <th>Block</th>
            <th>School</th> */}
            <th>Subject</th>
            <th>Type</th>
            <th>Status</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student, index) => {
            const srn = student.studentSrn;
            const selectedType = selectedDIType[srn]?.value;
            const statusList = statusOptions[selectedType] || [];

            return (
              <tr key={srn}>
                <td>{index + 1}</td>
                <td>{srn}</td>
                <td>{student.firstName}</td>
                <td>{student.fatherName}</td>
                {/* <td>{student.districtId}</td>
                <td>{student.blockId}</td>
                <td>{student.schoolId}</td> */}

                <td>
                  <Select
                    options={subject}
                    value={selectedSubjects[srn] || null}
                    onChange={(option) =>
                      setSelectedSubjects((prev) => ({
                        ...prev,
                        [srn]: option,
                      }))
                    }
                    placeholder="Subject"
                  />
                </td>

                <td>
                  <Select
                    options={disciplinaryAndInteractionOptions}
                    value={selectedDIType[srn] || null}
                    onChange={(option) => {
                      setSelectedDIType((prev) => ({
                        ...prev,
                        [srn]: option,
                      }));
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [srn]: [],
                      }));
                    }}
                    placeholder="Type"
                  />
                </td>

                <td>
                  <Select
                    options={statusList}
                    value={selectedStatus[srn] || []}
                    onChange={(option) =>
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [srn]: option,
                      }))
                    }
                    placeholder="Status"
                    isMulti
                    closeMenuOnSelect={false}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={remarks[srn] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [srn]: e.target.value,
                      }))
                    }
                    placeholder="Remark"
                  />
                </td>

                <td>
                  <Button variant="success" onClick={() => handleSubmit(student)}>
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
