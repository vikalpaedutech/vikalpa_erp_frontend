import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { Container, Row, Col, Table, Image, Modal, Button } from "react-bootstrap";
import { getPendingBills, patchBillsDataVerification,getVerifiedBills , patchBillsDataApproval } from "../../service/Bills.services";
//import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'; // Import for rendering PDF
import { Document, Page } from 'react-pdf';
import Select from "react-select";

const BillsApproval = () => {
  //Below snippet has all types of hooks and context api variables this component will use.
  const { userData, setUserData } = useContext(UserContext); //Getting userData from context api, once user logs in.

  const [verifiedBillsData, setVerifiedBillsData,] = useState([]);

  //Getting the pending bills data. 
  const fetchPendingBills = async () => {
    try {
      const response = await getVerifiedBills();
      setVerifiedBillsData(response.data);
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


  const [status, setStatus] = useState("");
  const [approval, setApproval] = useState({
    approvedBy: userData?.[0]?.userId ?? "Not Known",
    approvedAt: new Date(),
    comments: ""
  })





useEffect(()=>{
console.log("status is", status)
console.log(approval.comments)
console.log("i am verification date", approval.approvedAt)
},[status, approval])

const updateVerificationStatus = async () => {

    alert(billId)

    const queryParams = {
        expenseId:"111"
    }

    const formData = {
        status: status,
        approval: approval,

    }

    try {
        const response = await patchBillsDataApproval(queryParams, formData)
    } catch (error) {
        console.log("Error patching data", error.message)
    }

    

}

  //_________________________________________________________________________________________________________________



  
  //Below code opens up the modal and show the image of bill in modal so that verifier can see bill image and verify it.
  const [show, setShow] = useState(false);
  const [selectedBillImage, setSelectedBillImage] = useState(null);
  const [billId, setSelectedBillId] = useState(null);

  const handleClose = () => {
    setShow(false);
    setSelectedBillImage(null);
  };

  const handleShow = (imageUrl, billId) => {
    setSelectedBillImage(imageUrl);
    setSelectedBillId(billId)
    setShow(true);
  };

  //Modal to display both image and PDF files
  const showBillImageModal = {
    billImageModa: (
      <>
        <Modal show={show} onHide={handleClose} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Bill Image</Modal.Title>
            
            <Select
              options={[
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
              value={status}
              onChange={(e)=> setStatus(e.value)}
            />
            <label>Remark if rejected</label>
            <input type="text" name="comments" id="comments" 
            
            value={approval.comments}
            onChange={(e) => setApproval({ ...approval, comments: e.target.value })}
            />
            <Button onClick={updateVerificationStatus}>Update Approval Status</Button>
          </Modal.Header>
          <Modal.Body
            className="text-center"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {selectedBillImage ? (
              selectedBillImage.toLowerCase().endsWith(".pdf") ? (
                // For PDF files
                <iframe
                  src={selectedBillImage}
                  width="100%"
                  height="600px"
                  style={{ border: "none", maxHeight: "80vh" }}
                  title="Bill PDF"
                />
              ) : (
                // For image files
                <Image
                  src={selectedBillImage}
                  alt="Bill"
                  fluid
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
              )
            ) : (
              <p>No image or PDF available.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    ),
  };

  //_______________________________________________________________________________________________________________________






  return (
    <Container fluid>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Expense ID</th>
            <th>User ID</th>
            <th>User Name</th> {/* 👈 New column */}
            <th>Role</th>
            <th>Purpose</th>
            <th>Expense Type</th>
            <th>Item Name</th>
            <th>Item Purpose</th>
            <th>Amount (₹)</th>
            <th>View Bill</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {verifiedBillsData && verifiedBillsData.length > 0 ? (
            verifiedBillsData.map((bill, index) => (
              <tr key={bill._id}>
                <td>{index + 1}</td>
                <td>{bill.expenseId}</td>
                <td>{bill.userId}</td>
                <td>{bill.userDetails?.name || "N/A"}</td> {/* 👈 Show user name */}
                <td>{bill.role}</td>
                <td>{bill.purposeOfExpense}</td>
                <td>{bill.expenseType}</td>
                <td>{bill.otherItemName}</td>
                <td>{bill.otherItemPurchasingPurpose}</td>
                <td>{bill.expenseAmount}</td>
                <td>
                  <Button  variant="primary" onClick={() => handleShow(bill.fileUrl, bill._id)}>
                    View Bill
                  </Button>
                </td>
               
                <td>{bill.status}</td>
                <td>{new Date(bill.expenseDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center">No pending bills found.</td>
            </tr>
          )}
        </tbody>
      </Table>
      {showBillImageModal.billImageModa}
    </Container>
  );
};

export default BillsApproval;
