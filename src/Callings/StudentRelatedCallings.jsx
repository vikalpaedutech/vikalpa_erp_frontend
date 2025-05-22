import React, { useState, useEffect, useContext } from "react";
import { Table, Row, Col, Container, Form, Button } from "react-bootstrap";
import { UserContext } from "../components/contextAPIs/User.context";
import { GetStudentRelatedCallingData } from "../service/CallingServices/StudentRelatedCallings.services";

export const StudentRelatedCallings = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [callingData, setCallingData] = useState([]);

  // Fetching calling data
  const fetchCallingData = async () => {
    try {
      const response = await GetStudentRelatedCallingData();
      console.log(response.data.data);
      setCallingData(response.data.data);
    } catch (error) {
      console.log("Error occurred while fetching calling data");
    }
  };

  useEffect(() => {
    fetchCallingData();
  }, []);

  return (
    <Container fluid className="mt-4">
      <h4 className="mb-3">📞 Student Callings Sheet</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Student SRN</th>
            <th>Personal Contact</th>
            <th>Parent Contact</th>
            <th>Other Contact</th>
            <th>Calling Status</th>
            <th>Remark 1</th>
            <th>Remark 2</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {callingData.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">No data found</td>
            </tr>
          ) : (
            callingData.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.studentSrn}</td>
                <td>
                  <a href={`tel:${student.personalContact}`} style={{ textDecoration: "none" }}>
                    📞 {student.personalContact}
                  </a>
                </td>
                <td>
                  <a href={`tel:${student.ParentContact}`} style={{ textDecoration: "none" }}>
                    📞 {student.ParentContact}
                  </a>
                </td>
                <td>
                  <a href={`tel:${student.otherContact}`} style={{ textDecoration: "none" }}>
                    📞 {student.otherContact}
                  </a>
                </td>
                <td>{student.callingStatus || "-"}</td>
                <td>{student.remark1 || "-"}</td>
                <td>{student.remark2 || "-"}</td>
                <td>{student.comments || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};
