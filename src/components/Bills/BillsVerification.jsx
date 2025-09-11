// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   Container,
//   Card,
//   Row,
//   Col,
//   Button,
//   Form,
// } from "react-bootstrap";
// import { getPendingAndVerifiedBillsByAci, patchBillsDataVerification } from "../../service/Bills.services";
// import Select from "react-select";

// import { deleteBill } from "../../service/Bills.services.js";

// const BillsVerification = () => {
//   const { userData, setUserData } = useContext(UserContext);

//   const [pendingBillsData, setPendingBillsData] = useState([]);
//   const [filteredRole, setFilteredRole] = useState(""); // new state for role filter
//   const [selectedBills, setSelectedBills] = useState([]); // for multi-select
//   const [bulkAction, setBulkAction] = useState(null); // for dropdown bulk status
//   const [statusFilter, setStatusFilter] = useState(""); // new filter for status

//   const fetchPendingBills = async () => {
//     let conditionalRole;
//     let status;

//     if (userData?.role === "ACI") {
//       conditionalRole = ['CC'];
//     } else {
//       conditionalRole = ['CC', 'ACI'];
//     }

//     if (userData?.role === "ACI") {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'];
//     } else {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'];
//     }

//     const role = userData?.role ?? 'NA';

//     const query = `userId=${userData.userId}&status=${status}&role=${userData.role}&conditionalRole=${conditionalRole}`;
//     try {
      
//       console.log(query)
//       const response = await getPendingAndVerifiedBillsByAci(query);
//       setPendingBillsData(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.log("Error fetching pending bills data", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchPendingBills();
//   }, []);

//   const [statuses, setStatuses] = useState({});
//   const [verifications, setVerifications] = useState({});

//   const updateVerificationStatus = async (billId) => {
//     const queryParams = {
//       _id: billId,
//     };

//     const formData = {
//       status: statuses[billId],
//       verification: verifications[billId],
//     };

//     try {
//       const response = await patchBillsDataVerification(queryParams, formData);
//       fetchPendingBills();
//     } catch (error) {
//       console.log("Error patching data", error.message);
//     }
//   };

//   const updateBulkStatus = async () => {
//     try {
//       for (const billId of selectedBills) {
//         const queryParams = { _id: billId };
//         const formData = {
//           status: bulkAction,
//           verification: {
//             verifiedBy: userData?.userId ?? "Not Known",
//             verifiedAt: new Date(),
//             comments: "",
//           },
//         };
//         await patchBillsDataVerification(queryParams, formData);
//       }
//       setSelectedBills([]);
//       setBulkAction(null);
//       fetchPendingBills();
//     } catch (error) {
//       console.log("Bulk update error", error.message);
//     }
//   };



  


//   const getDropdownOptions = () => {
//     const role = userData?.[0]?.role;
//     if (role === "Community Manager") {
//       return [
//         { value: "Approved", label: "Approved" },
//         { value: "Rejected", label: "Rejected" },
//       ];
//     } else if (role === "ACI") {
//       return [
//         { value: "Verified", label: "Verified" },
//         { value: "Rejected", label: "Rejected" },
//       ];
//     } else {
//       return [];
//     }
//   };

//   const getCardStyle = (status) => {
//     switch (status) {
//       case "Verified":
//         return { backgroundColor: "#F0F8FF" };
//       case "Rejected":
//         return { backgroundColor: "#DC143C", color: "white" };
//       case "Approved":
//         return { backgroundColor: "#7FFFD4" };
//       default:
//         return {}; // white/default
//     }
//   };

//   const isDisabled = (billStatus) => {
//     const role = userData?.[0]?.role;
//     if (role === "ACI" && billStatus !== "Pending") return true;
//     if (role === "Community Manager" && billStatus === "Approved") return true;
//     return false;
//   };

//   const sortBills = (bills) => {
//     const statusOrder = { Pending: 1, Verified: 2, Approved: 3 };
//     return bills.sort((a, b) => (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4));
//   };

//   const filteredData = sortBills(
//     pendingBillsData.filter((bill) => {
//       const roleMatch = filteredRole ? bill.role === filteredRole : true;
//       const statusMatch = statusFilter ? bill.status === statusFilter : true;
//       return roleMatch && statusMatch;
//     })
//   );

//   const toggleBillSelection = (billId) => {
//     setSelectedBills((prev) =>
//       prev.includes(billId)
//         ? prev.filter((id) => id !== billId)
//         : [...prev, billId]
//     );
//   };

//   const clearFilters = () => {
//     setFilteredRole("");
//     setStatusFilter("");
//   };


//   //Handiling bill deletion


//   const handleBillDelete = async (id)=>{

//     alert(id)

    
//     const formData = {
//       _id: id
//     }

//     try {
//       const response = await deleteBill(formData)
//       fetchPendingBills()
//     } catch (error) {
//       alert('Bill not deleted! An error occured')
//     }


//   }



//   //---------------------------

  

//   return (
//     <Container fluid className="py-3">
//       <h1>Hello Bills verification</h1>
//       <Row className="mb-3">
//         <Col md={3}>
//           <Form.Select
//             value={filteredRole}
//             onChange={(e) => setFilteredRole(e.target.value)}
//           >
//             <option value="">Filter by Role</option>
//             <option value="CC">CC</option>
//             <option value="ACI">ACI</option>
//           </Form.Select>
//         </Col>
//         <Col md={3}>
//           <Form.Select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">Filter by Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Verified">Verified</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//           </Form.Select>
//         </Col>
//         <Col md={2}>
//           <Button variant="secondary" onClick={clearFilters}>
//             Clear Filters
//           </Button>
//         </Col>
//         {userData?.[0]?.role === "Community Manager" && (
//           <>
//             <Col md={2}>
//               <Select
//                 options={getDropdownOptions()}
//                 value={bulkAction ? { value: bulkAction, label: bulkAction } : null}
//                 onChange={(e) => setBulkAction(e.value)}
//                 placeholder="Bulk Approve/Reject"
//               />
//             </Col>
//             <Col md={2}>
//               <Button
//                 variant="primary"
//                 disabled={!bulkAction || selectedBills.length === 0}
//                 onClick={updateBulkStatus}
//               >
//                 Submit Bulk Action
//               </Button>
//             </Col>
//           </>
//         )}
//       </Row>

//       <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
//         {filteredData && filteredData.length > 0 ? (
//           filteredData.map((bill, index) => (
//             <Col key={bill._id}>
//               <Card className="h-100 shadow-sm" style={getCardStyle(bill.status)}>
//                 <Card.Body>
//                   <Card.Title>Status: {bill.status}</Card.Title>
//                   <Card.Title>Expense Type: {bill.expenseType}</Card.Title>
//                   <Card.Subtitle className="mb-2 text-muted">
//                     Submitted by: {bill.userDetails?.name || "N/A"} ({bill.role})
//                   </Card.Subtitle>
//                   <Card.Text>
//                     <strong>User ID:</strong> {bill.userId}<br />
//                     <strong>Purpose:</strong> {bill.purposeOfExpense}<br />
//                     <strong>Item Name:</strong> {bill.otherItemName}<br />
//                     <strong>Item Purpose:</strong> {bill.otherItemPurchasingPurpose}<br />
//                     <strong>Amount (₹):</strong> {bill.expenseAmount}<br />
//                     {/* <strong>Status:</strong> {bill.status}<br /> */}
//                     <strong>Date:</strong> {new Date(bill.expenseDate).toLocaleDateString()}<br />
//                     <strong>File:</strong>{" "}
//                     {bill.fileUrl ? (
//                       <a
//                         href={bill.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         View File
//                       </a>
//                     ) : (
//                       "No file available"
//                     )}
//                   </Card.Text>

//                   {userData?.[0]?.role === "Community Manager" && (
//                     <Form.Check
//                       type="checkbox"
//                       label="Select for Bulk"
//                       checked={selectedBills.includes(bill._id)}
//                       onChange={() => toggleBillSelection(bill._id)}
//                       className="mb-2"
//                       disabled={bill.status === "Approved"}
//                     />
//                   )}

//                   <div className="mb-2">
//                     <Form.Label>Verification Status</Form.Label>
//                     <Select
//                       options={getDropdownOptions()}
//                       value={
//                         statuses[bill._id]
//                           ? { value: statuses[bill._id], label: statuses[bill._id] }
//                           : null
//                       }
//                       onChange={(e) =>
//                         setStatuses((prev) => ({
//                           ...prev,
//                           [bill._id]: e.value,
//                         }))
//                       }
//                       placeholder="Select Status"
//                       isDisabled={isDisabled(bill.status)}
//                     />
//                   </div>
//                   <div className="mb-2">
//                     <label>Remark if rejected</label>
//                     <input
//                       type="text"
//                       name="comments"
//                       id="comments"
//                       className="form-control"
//                       value={verifications[bill._id]?.comments || ""}
//                       onChange={(e) =>
//                         setVerifications((prev) => ({
//                           ...prev,
//                           [bill._id]: {
//                             ...prev[bill._id],
//                             verifiedBy: userData?.[0]?.userId ?? "Not Known",
//                             verifiedAt: new Date(),
//                             comments: e.target.value,
//                           },
//                         }))
//                       }
//                       disabled={isDisabled(bill.status)}
//                     />
//                   </div>
//                   <Button
//                     variant="success"
//                     onClick={() => updateVerificationStatus(bill._id)}
//                   >
//                     updateVerificationStatus
//                   </Button>
//                       <br></br>
//                       <br></br>
//                   <Button onClick={()=>handleBillDelete(bill._id)}>Delete</Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col>
//             <p className="text-center">No pending bills found.</p>
//           </Col>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default BillsVerification;














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

const BillsVerification = () => {
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
      status = ['Pending'];
    } else {
      status = ['Pending'];
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


 


  
//React select things

let verification_options;
if (userData?.role === "ACI"){
 verification_options = [
  { value: 'Verified', label: 'Verified' },
  { value: 'Rejected', label: 'Rejected' }
]
} else {
 verification_options = [
  { value: 'Approved', label: 'Aproved' },
  { value: 'Rejected', label: 'Rejected' }
]
  
}


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

//--------------------------------------------------------








  const handleBillDelete = async (id)=>{

   

    
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




const handleBillStatusSubmission = async (e) =>{


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
    approval: verification
  }
}





try {

  console.log(reqBody)

  const response = await updateBillVerificationAndApprovalStatus(reqBody);

  fetchPendingBills()

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


      fetchPendingBills()
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
      <h1>Bills Verification</h1>

      {/* drop downs and filters */}

      {userData?.role ==="Community Manager" ? (
        <>
        <label>Bulk Submission</label>
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
                        <p>Submitted By: {eachBill.name}</p>
                        <p>User Id: {eachBill.userId}</p>
                        <p>Purpose: {eachBills.purposeOfExpense}</p>
                        <p>Expense Type: {eachBills.expenseType}</p>
                        <p>Expense Amount: Rs. {eachBills.expenseAmount}</p>
                        <p>Expense Date: {formattedDate}</p>
                      </Card.Text>

                      <label>Verification Status</label>

                      <Select
                        options={verification_options}
                        onChange={(e) => {
                          // setStatus(e.value);

                          if(e.value === 'Verified'){
                            setStatus({
                              value: [{value:'Okay', label:'Okay'}], label: 'Verified' 
                          })
                          } else if (e.value === "Approved"){
                            setStatus({
                              value: [{value:'Okay', label:'Okay'}], label: 'Approved' 
                          })
                          } 
                          else if (e.value === "Rejected") {
                            setStatus({
                              value: [{value:'Duplicate', label:'Duplicate'},
                                      {value:'Wrong bill uploaded', label:'Wrong bill uploaded'},
                                      {value:'Wrong amount filled', label:'Wrong amount filled'}
                                    ], label: 'Rejected' 
                          })
                          }
                          
                        }}
                      />
                      <br></br>

                      <label>Verification Remark</label>
                      <Select
                        options={status.value}
                        onChange={(e) => {

                          if (userData?.role === "ACI"){
                            setVerification({
                            verifiedBy: userData?._id,
                            verifiedAt: new Date(),
                            comments: e.value,
                          });
                          } else if (userData?.role === "Community Manager"){
                            setVerification({
                            approvedBy: userData?._id,
                            approvedAt: new Date(),
                            comments: e.value,
                          });
                          }
                          

                            //Logic for disabling submit button
                          setSubmitButtonDisabled([...submitButtonDisabled, eachBills._id])

                        }
                        
                      }
                      />
                      <br></br>

                      <Row>
                        <Col>
                      <Button
                        id={eachBills._id}
                        variant="primary"
                        onClick={(e) => handleBillStatusSubmission(e)}

                        disabled={!submitButtonDisabled.includes(eachBills._id)}
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






export default BillsVerification;



























