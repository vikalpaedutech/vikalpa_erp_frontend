import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { getPendingAndVerifiedBillsByAci, patchBillsDataVerification } from "../../service/Bills.services";
import Select from "react-select";

const BillsVerification = () => {
  //Below snippet has all types of hooks and context api variables this component will use.
  const { userData, setUserData } = useContext(UserContext); //Getting userData from context api, once user logs in.

  const [pendingBillsData, setPendingBillsData] = useState([]);

  //Getting the pending bills data. 
  const fetchPendingBills = async () => {

    const query = `userId=${userData[0].userId}&status=Pending`
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

  //Below logic patches the data of bills once user verifies. Basically updates the bills' verification status like, verified
  //... or rejected and remakrs.

  const [statuses, setStatuses] = useState({});
  const [verifications, setVerifications] = useState({});

  const updateVerificationStatus = async (billId) => {
    // alert(billId)

    const queryParams = {
      // expenseId: "111"
       _id: billId,
       
    }

    const formData = {
      status: statuses[billId],
      verification: verifications[billId],
    }

    try {
      const response = await patchBillsDataVerification(queryParams, formData)
      
      fetchPendingBills();
      
    } catch (error) {
      console.log("Error patching data", error.message)
    }

  }

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
                  <div className="mb-2">
                    <Form.Label>Verification Status</Form.Label>
                    <Select
                      options={[
                        { value: "Verified", label: "Verified" },
                        { value: "Rejected", label: "Rejected" },
                      ]}
                      value={
                        statuses[bill._id]
                          ? { value: statuses[bill._id], label: statuses[bill._id] }
                          : null
                      }
                      onChange={(e) =>
                        setStatuses((prev) => ({
                          ...prev,
                          [bill._id]: e.value,
                        }))
                      }
                      placeholder="Select Status"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Remark if rejected</label>
                    <input
                      type="text"
                      name="comments"
                      id="comments"
                      className="form-control"
                      value={verifications[bill._id]?.comments || ""}
                      onChange={(e) =>
                        setVerifications((prev) => ({
                          ...prev,
                          [bill._id]: {
                            ...prev[bill._id],
                            verifiedBy: userData?.[0]?.userId ?? "Not Known",
                            verifiedAt: new Date(),
                            comments: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <Button
                    variant="success"
                    onClick={() => updateVerificationStatus(bill._id)}
                  >
                    updateVerificationStatus
                  </Button>
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

export default BillsVerification;
