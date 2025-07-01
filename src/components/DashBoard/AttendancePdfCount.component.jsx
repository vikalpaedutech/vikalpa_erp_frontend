// /FRONTEND/src/components/DashBoard

import React, {useEffect, useState, useContext} from 'react';

import {
  ListGroup,
  Accordion,
  Offcanvas,
  Button,
  Container,
  Navbar,
  Card,
  Carousel,
  Table,
} from "react-bootstrap";
import { href, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";
import { MdMenuOpen } from "react-icons/md";
import { UserAttendance } from "../../components/user/UserAttendance";
import { attendancePdfUploadStatusCountByClass } from "../../service/dashboardServices/dashboardCounts.services";
//import logoutLogo from '../../assets/logout.png'; // Replace with correct path
import { Link } from "react-router-dom";
import { NewNavbar } from "../../components/Navbar/NewNavbar";

export const AttendancePdfCount = () => {
  const { userData } = useContext(UserContext);
  const [pdfData, setPdfData] = useState([]);

  const fetchPdfStatusData = async () => {
    const payload = {
      schoolIds: userData[0].schoolIds,
      date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00"
    };

    try {
      const response = await attendancePdfUploadStatusCountByClass(payload);
      console.log("PDF Upload Data", response.data);

      const sortedData = response.data.map((school) => {
        const sortedClasses = [...school.classes].sort((a, b) => {
          if (a.pdfUploadedCount === 0 && b.pdfUploadedCount !== 0) return -1;
          if (a.pdfUploadedCount !== 0 && b.pdfUploadedCount === 0) return 1;
          return 0;
        });
        return { ...school, classes: sortedClasses };
      });

      setPdfData(sortedData);
    } catch (error) {
      console.log("Error fetching attendance PDF status:", error);
    }
  };

  useEffect(() => {
    fetchPdfStatusData();
  }, []);

  // Summary Counts
  const summary = {
    '9': { total: 0, uploaded: 0 },
    '10': { total: 0, uploaded: 0 }
  };

  pdfData.forEach((school) => {
    school.classes.forEach((cls) => {
      if (cls.classofStudent === '9' || cls.classofStudent === '10') {
        summary[cls.classofStudent].total += 1;
        if (cls.pdfUploadedCount > 0) {
          summary[cls.classofStudent].uploaded += 1;
        }
      }
    });
  });

  return (
    <Container className="mt-4">
      {/* Overall Summary */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Overall PDF Upload Summary</Card.Title>
          <div>
            <div>
              <strong>Class 9 -</strong> Total Classes: {summary['9'].total}, Uploaded: {summary['9'].uploaded}
            </div>
            <div>
              <strong>Class 10 -</strong> Total Classes: {summary['10'].total}, Uploaded: {summary['10'].uploaded}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Attendance PDF Upload Status</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>S. No.</th>
                <th>School</th>
                <th>Class</th>
                <th>PDF Uploaded (1/0)</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {pdfData.map((school, schoolIndex) =>
                school.classes.map((cls, classIndex) => {
                  const isUploaded = cls.pdfUploadedCount > 0;
                  const serialNo = school.classes.length > 1 ? `${schoolIndex + 1}.${classIndex + 1}` : `${schoolIndex + 1}`;

                  return (
                    <tr
                      key={`${school.schoolId}-${cls.classofStudent}`}
                      style={{
                        backgroundColor: isUploaded ? '#e6ffe6' : '#ffe6e6',
                      }}
                    >
                      <td>{serialNo}</td>
                      {classIndex === 0 && (
                        <td rowSpan={school.classes.length} className="align-middle">
                          {school.schoolName}
                        </td>
                      )}
                      <td>{cls.classofStudent}</td>
                      <td
                        style={{
                          backgroundColor: isUploaded ? '#ccffcc' : '#ff9999',
                          fontWeight: 'bold'
                        }}
                      >
                        {isUploaded ? 1 : 0}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};
