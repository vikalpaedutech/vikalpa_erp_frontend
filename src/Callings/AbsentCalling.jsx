// // This is AttendanceSession1.jsx.
// This is AttendanceSession1.jsx

import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Alert,
  Breadcrumb,
  Card,
  Button,
} from "react-bootstrap";

import {
  getAllAttendance,
  updateAttendanceBySrnAndDate,
} from "../service/AttendanceMB.services.js";
import {
  DistrictBlockSchoolById,
  ClassOfStudent,
} from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";
import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";




import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

import Select from "react-select";
import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
import { UserContext } from "../components/contextAPIs/User.context.js";

export const AbsentCalling = ({
  assignedDistricts,
  assignedBlocks,
  assignedSchools,
}) => {
  const [date, setDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [callingStatus, setCallingStatus] = useState({});
  const { classContext, setClassContext } = useContext(ClassContext);
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(SchoolContext);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);



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

  const fetchAttendanceData = async () => {
    const queryParams = {
      studentSrn: "",
      firstName: "",
      fatherName: "",
      date: date,
      status: "Absent",
      startDate: date,
      schoolId:
        Object(schoolContext[0]).value || allSchoolIds,
      classofStudent: classContext.value || ["9", "10"],
      batch: "",
    
    };

    try {
      const response = await getAllAttendance(queryParams);
      setAttendanceData(response.data);
      console.log(response.data)
    } catch (error) {
      console.log("Error fetching data", error);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [date, classContext, schoolContext]);

  const handleStatusChange = (studentSrn, selectedOption) => {
    setCallingStatus((prev) => ({
      ...prev,
      [studentSrn]: {
        status: selectedOption,
        subOptions: null,
        newNumber: "",
      },
    }));
  };

  const handleSubOptionsChange = (studentSrn, selectedOption) => {
    setCallingStatus((prev) => ({
      ...prev,
      [studentSrn]: {
        ...prev[studentSrn],
        subOptions: selectedOption,
        newNumber: "",
      },
    }));
  };

  const handleNewNumberChange = (studentSrn, value) => {
    if (/^\d{0,10}$/.test(value)) {
      setCallingStatus((prev) => ({
        ...prev,
        [studentSrn]: {
          ...prev[studentSrn],
          newNumber: value,
        },
      }));
    }
  };

  const updateCallingStatusInDb = async (studentSrn) => {


    // Find the matching student's schoolId and classofStudent from attendanceData
    const studentRecord = attendanceData.find(
      (item) =>
        item.studentSrn === studentSrn ||
        item.studentDetails?.studentSrn === studentSrn
    );



    const queryParamsForAttendance = {
      studentSrn,
      date,
      userId: userData?.[0]?.userId,
      schoolId: studentRecord?.studentDetails?.schoolId || "",
classofStudent: studentRecord?.studentDetails?.classofStudent || "",
studentAttendanceGamificationDate: new Date().toISOString()
    };


console.log(queryParamsForAttendance)

    const formData = {
      absenteeCallingStatus:
        callingStatus[studentSrn]?.status?.value || "",
      callingRemark1:
        callingStatus[studentSrn]?.subOptions?.value || "",
      callingRemark2:
        callingStatus[studentSrn]?.subOptions?.value === "Wrong Number"
          ? callingStatus[studentSrn]?.newNumber || ""
          : "",
    };

    try {
      await updateAttendanceBySrnAndDate(
        queryParamsForAttendance,
        formData
      );
      fetchAttendanceData();
    } catch (error) {
      console.error("Error updating attendance", error.message);
    }
  };

  useEffect(() => {
    Object.entries(callingStatus).forEach(
      ([studentSrn, remarkObject]) => {
        if (remarkObject.subOptions === null) return;
        updateCallingStatusInDb(studentSrn);
      }
    );
  }, [callingStatus]);

  return (
    <Container fluid>
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <SchoolDropDowns />
        <ClassOfStudent />
      </div>

      <div>
        <h1>Absentee Calling</h1>
        <hr />
      </div>

      <div>
        {attendanceData.length > 0 ? (
          attendanceData.map((eachObject, index) => {
            const srn = eachObject.studentSrn || eachObject.studentDetails?.studentSrn;
            const selectedStatus =
              callingStatus[srn]?.status?.value;
            const selectedSubOption =
              callingStatus[srn]?.subOptions?.value;
            const selectedCallingStatus =
              eachObject.absenteeCallingStatus;

            let backColor = "white";
            if (selectedCallingStatus === "Connected") {
              backColor = "#00FFFF";
            } else if (selectedCallingStatus === "Not-Connected") {
              backColor = "#FCE4D6";
            }

            return (
              <div key={index}>
                <br />
                <Card
                  style={{
                    width: "18rem",
                    backgroundColor: `${backColor}`,
                  }}
                >
                  <Card.Body>
                    <Card.Title>
                      srn: {eachObject.studentDetails.studentSrn}
                    </Card.Title>
                    <Card.Title>
                      Name: {eachObject.studentDetails.firstName}
                    </Card.Title>
                    <Card.Title>
                      Calling Status: {selectedCallingStatus}
                    </Card.Title>

                    <Card.Text style={{ fontSize: "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <a
                          href={`tel:${eachObject.studentDetails.personalContact}`}
                          style={{ textDecoration: "none" }}
                        >
                          📞 {eachObject.studentDetails.personalContact}
                        </a>
                        <a
                          href={`tel:${eachObject.studentDetails.ParentContact}`}
                          style={{ textDecoration: "none" }}
                        >
                          📞 {eachObject.studentDetails.ParentContact}
                        </a>
                      </div>
                    </Card.Text>

                    <Select
                      options={statusOptions}
                      value={
                        callingStatus[srn]?.status || null
                      }
                      onChange={(selectedOption) =>
                        handleStatusChange(srn, selectedOption)
                      }
                    />

                    <br />
                    <Select
                      options={
                        selectedStatus
                          ? subOptions[selectedStatus]
                          : []
                      }
                      value={
                        callingStatus[srn]?.subOptions || null
                      }
                      onChange={(selectedOption) =>
                        handleSubOptionsChange(srn, selectedOption)
                      }
                      isDisabled={!selectedStatus}
                    />

                    {/* Show New Number input only for Wrong Number */}
                    {selectedSubOption === "Wrong Number" && (
                      <>
                        <Form.Label className="mt-2">
                          Update new number (Optional)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            callingStatus[srn]?.newNumber || ""
                          }
                          onChange={(e) =>
                            handleNewNumberChange(
                              srn,
                              e.target.value
                            )
                          }
                          maxLength={10}
                          placeholder="Enter 10-digit number"
                        />
                      </>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          "No data found"
        )}
      </div>
    </Container>
  );
};

// Calling status options
const statusOptions = [
  { value: "Connected", label: "Connected" },
  { value: "Not-Connected", label: "Not-Connected" },
];

// Sub-options for status
const subOptions = {
  Connected: [
    { value: "Student Wants SLC", label: "Student Wants SLC" },
    { value: "Not Interested", label: "Not Interested" },
    { value: "Same School Student", label: "Same School Student" },
    { value: "Not in MB", label: "Not in MB" },
    { value: "Sick", label: "Sick" },
    { value: "Health Issues", label: "Health Issues" },
    { value: "Family Emergency", label: "Family Emergency" },
    { value: "Out of Station", label: "Out of Station" },
    { value: "Personal Work", label: "Personal Work" },
    { value: "Transport Issue", label: "Transport Issue" },
    { value: "Bad Weather", label: "Bad Weather" },
    { value: "Family Function", label: "Family Function" },
  ],
  "Not-Connected": [
    { value: "Wrong Number", label: "Wrong Number" },
    { value: "Call not picked", label: "Call not picked" },
    { value: "No incoming", label: "No incoming" },
  ],
};
