



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
import { getPendingAndVerifiedBillsByAci, patchBillsDataVerification, getAllTypesOfBillsStatusForApprovalAndRejection,
  updateBillVerificationAndApprovalStatus
 } from "../../service/Bills.services";
import Select from "react-select";

import { deleteBill } from "../../service/Bills.services.js";
import { BillDashboard } from "./BillDashboard.jsx";

const VerifiedAndRejectedBills = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [pendingBillsData, setPendingBillsData] = useState([]);
  const [filteredRole, setFilteredRole] = useState(""); // new state for role filter
  const [selectedBills, setSelectedBills] = useState([]); // for multi-select
  const [bulkAction, setBulkAction] = useState(null); // for dropdown bulk status
  const [statusFilter, setStatusFilter] = useState(""); // new filter for status

  const [billData, setBillData] = useState([])

  const fetchPendingBills = async () => {
    let conditionalRole;
    let status;

    if (userData?.role === "ACI") {
      conditionalRole = ['CC'];
    } else {
      conditionalRole = ['CC', 'ACI'];
    }

    if (userData?.role === "ACI") {
      status = ['Verified', 'Approved', 'Rejected'];
    } else {
      status = ['Verified', 'Approved', 'Rejected'];
    }

    const role = userData?.role ?? 'NA';
    const userId = userData?._id;

    const reqBody = {

      conditionalRoleForWhoseBillsAreToBeFetched: conditionalRole,
      status: status,
      _id: userId
    }

    //const query = `userId=${userData.userId}&status=${status}&role=${userData.role}&conditionalRole=${conditionalRole}`;
    try {
      
      console.log(reqBody)
      const response = await getAllTypesOfBillsStatusForApprovalAndRejection(reqBody);
      setBillData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching pending bills data", error.message);
    }
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);


 


  const handleBillDelete = async (id)=>{

    alert(id)

    
    const formData = {
      _id: id
    }

    try {
      const response = await deleteBill(formData)
      fetchPendingBills()
    } catch (error) {
      alert('Bill not deleted! An error occured')
    }


  }



  //---------------------------

//Updating  bills verification status.

const [status, setStatus] = useState("");
const [verification, setVerification] = useState({})


  
console.log(status)
console.log(verification)


const handleBillStatusSubmission = async (e) =>{
alert(e.target.id)

let reqBody;

if (userData?.role === "ACI"){

  reqBody = {
    checkingStatus: "Verification",
    billObjectId: e.target.id,
    status:status.label,
    approvedOrVerifiedBy: userData?._id,
    verification: verification
  }

} else if (userData?.role === "Community Manager" || userData?.role === "Admin"){
  reqBody = {
    checkingStatus: "Approval",
    billObjectId: e.target.id,
    status:status.label,
    approvedOrVerifiedBy: userData?._id,
    verification: verification
  }
}





try {
  const response = await updateBillVerificationAndApprovalStatus(reqBody);

console.log(response.data)
} catch (error) {
  
  alert('Error occured while verification')
}



}


//Multi select logic
const [approval, setApproval] = useState([])
const [comments, setComments] = useState("")


console.log(approval)

const handleBulkSubmission = async () =>{

      if (approval.length <= 0){
    alert("Select Bills")
    return;
  }


  alert('i am bulk submission')

  let approvalReqBody = [];
 approval.map((each, index)=>{
  approvalReqBody.push({
     checkingStatus: "Approval",
    billObjectId: each.billObjectId,
    status:status,
    approvedOrVerifiedBy: userData?._id,
    approval: {
      approvedBy: userData?._id,
      approvedAt: new Date(),
      comments: comments
    }
  })
})

  try {
    console.log (approvalReqBody)

    for (let i=0; i<approvalReqBody.length; i++){
      const response = await updateBillVerificationAndApprovalStatus(approvalReqBody[i])

      console.log('Data updated')
    }

    
    
  } catch (error) {
    alert('error occured bulk submission')
  }
}

//Submit button disabled logic
const [submitButtonDisabled, setSubmitButtonDisabled] = useState([])

console.log(status)
console.log(verification)
console.log(submitButtonDisabled)


  return (
    <Container fluid className="py-3">
      <h1>Verified/Rejected Bills</h1>

      {/* drop downs and filters */}

      {userData?.role ==="Community Manager" ? (
        <>
        <label>Bulk Approval</label>
        <Select
        options={verification_options}
        onChange={(e) => {
          setStatus(e.value);
        }}
      />
      <br></br>
      <label>Bulk Remark</label>
      <Select
        options={approval_remark}
        onChange={(e) => {
          setComments(e.value);
        }}
      />

      <br></br>

      <Button disabled={!comments} onClick={handleBulkSubmission}>Bulk Submit</Button>

      <br></br>
      <br></br>

      {/* // */}
        </>
      ):(null)}

      

      {billData.map((eachBill, index) => {
        return (
          <>
            {eachBill.expenses.map((eachBills, index) => {
              const DateFormat = new Date(eachBills.expenseDate);
              const formattedDate =
                ("0" + DateFormat.getDate()).slice(-2) +
                "-" +
                ("0" + (DateFormat.getMonth() + 1)).slice(-2) +
                "-" +
                DateFormat.getFullYear();

              return (
                <>
                  <Card key={index}>
                    <Card.Body>
                      {userData?.role === "Community Manager" ? (
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApproval([
                                ...approval,
                                {
                                  approvedBy: userData?._id,
                                  approvedAt: new Date(),
                                  billObjectId: eachBills._id,
                                  approvedOrVerifiedBy: userData?._id,
                                },
                              ]);
                            } else {
                              setApproval(
                                approval.filter(
                                  (each) => each.billObjectId !== eachBills._id
                                )
                              );
                            }
                          }}
                        />
                      ) : null}

                      <Card.Title>Bill Type:{eachBills.expenseType}</Card.Title>
                      <Card.Title>Bill Status:{eachBills.status}</Card.Title>
                      <Card.Title>
                        File:{" "}
                        <a href={eachBills.fileUrl} target="_blank">
                          Open
                        </a>
                      </Card.Title>
                      <hr></hr>
                      <Card.Text>
                        <p>Bill Owner: {eachBill.name}</p>
                        <p>Purpose: {eachBills.purposeOfExpense}</p>
                        <p>Expense Type: {eachBills.expenseType}</p>
                        <p>Expense Amount: Rs. {eachBills.expenseAmount}</p>
                        <p>Expense Date: {formattedDate}</p>
                         <p>bill id Date: {eachBills._id}</p>
                      </Card.Text>

                     {userData?.role === "ACI" ? null : (
  <>
    {eachBills.status === "Approved" ? null : (
      <>
        <label>Verification Status</label>
        <Select
          options={verification_options}
          onChange={(e) => {
            if (e.value === "Approved") {
              setStatus({
                value: [{ value: "Okay", label: "Okay" }],
                label: "Approved",
              });
            } else {
              setStatus({
                value: [
                  { value: "Duplicate", label: "Duplicate" },
                  { value: "Wrong bill uploaded", label: "Wrong bill uploaded" },
                  { value: "Wrong amount filled", label: "Wrong amount filled" },
                ],
                label: "Rejected",
              });
            }
          }}
        />

        <br />

        <label>Verification Remark</label>
        <Select
          options={status.value}
          onChange={(e) => {
            setVerification({
              verifiedBy: userData?._id,
              verifiedAt: new Date(),
              comments: e.value,
            });

            // Logic for disabling submit button
            setSubmitButtonDisabled((prev) => [...prev, eachBills._id]);
          }}
        />

        <br />

        <Row>
          <Col>
            <Button
              id={eachBills._id}
              variant="primary"
              onClick={(e) => handleBillStatusSubmission(e)}
              disabled={!submitButtonDisabled.includes(eachBills._id)} // ✅ fixed
            >
              Submit
            </Button>
          </Col>

          <Col>
            <Button
              id={eachBills._id}
              variant="primary"
              onClick={(e) => handleBillDelete(e.target.id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </>
    )}
  </>
)}

                      
                      
                    </Card.Body>
                  </Card>
                  <br></br>
                </>
              );
            })}
          </>
        );
      })}
    </Container>
  );
};




//React select things

const verification_options = [
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' }
]


// const verification_options = [
//   { value: [{value:'Okay', label:'Okay'}], label: 'Verified' },
//   { value: [{value:'Duplicate', label:'Duplicate'},
//     {value:'Wrong bill uploaded', label:'Wrong bill uploaded'},
//     {value:'Wrong amount filled', label:'Wrong amount filled'}
//   ], label: 'Rejected' }
// ]








const rejection_options = [
  { value: 'Bill Not Clear', label: 'Bill Not Clear' },
  { value: 'Duplicate', label: 'Duplicate' },
  { value: 'Wrong Bill Uploaded', label: 'Wrong Bill Uploaded' },
]

const approval_remark = [
  { value: 'Okay', label: 'Okay' },
  { value: 'Duplicate', label: 'Duplicate' },
  { value: 'Wrong Bill Uploaded', label: 'Wrong Bill Uploaded' },
]



export default  VerifiedAndRejectedBills;









