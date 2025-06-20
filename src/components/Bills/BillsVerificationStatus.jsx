// /FRONTEND/src/components/Bills/BillsVerificationStatus.jsx

import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../contextAPIs/User.context";
import { getPendingAndVerifiedBillsByAci } from "../../service/Bills.services";
import {Card, Table, Col, Row, Container, Button, Form} from "react-bootstrap";
import Select from "react-select"

export const BillsVerificationStatus = () =>{
//Below snippet has all types of hooks and context api variables this component will use.
  const { userData, setUserData } = useContext(UserContext); //Getting userData from context api, once user logs in.

  const [pendingBillsData, setPendingBillsData] = useState([]);

  //Getting the pending bills data. 
  const fetchPendingBills = async () => {

    const query = `userId=${userData[0].userId}&status=Verified`
    try {
      const response = await getPendingAndVerifiedBillsByAci(query);
      setPendingBillsData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching pending bills data", error.message);
    }
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);

  //______________________________________________________________________________________________________________________

  
  //_______________________________________________________________________________________________________________________

  return (
    <Container fluid className="py-3">
      <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
        {pendingBillsData && pendingBillsData.length > 0 ? (
          pendingBillsData.map((bill, index) => (
            <Col key={bill._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Expense Type: {bill.expenseType}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Submitted by: {bill.userDetails?.name || "N/A"} ({bill.role})
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>User ID:</strong> {bill.userId}<br />
                    <strong>Purpose:</strong> {bill.purposeOfExpense}<br />
                    <strong>Item Name:</strong> {bill.otherItemName}<br />
                    <strong>Item Purpose:</strong> {bill.otherItemPurchasingPurpose}<br />
                    <strong>Amount (₹):</strong> {bill.expenseAmount}<br />
                    <strong>Status:</strong> {bill.status}<br />
                    <strong>Date:</strong> {new Date(bill.expenseDate).toLocaleDateString()}<br />
                    <strong>File:</strong>{" "}
                    {bill.fileUrl ? (
                      <a
                        href={bill.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "No file available"
                    )}
                  </Card.Text>
                  
                
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No pending bills found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default BillsVerificationStatus;
