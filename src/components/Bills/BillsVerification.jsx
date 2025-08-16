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

// const BillsVerification = () => {
//   //Below snippet has all types of hooks and context api variables this component will use.
//   const { userData, setUserData } = useContext(UserContext); //Getting userData from context api, once user logs in.

//   const [pendingBillsData, setPendingBillsData] = useState([]);

//   //Getting the pending bills data. 
//   const fetchPendingBills = async () => {

//     let conditionalRole;
//     let status;

//     if (userData?.[0]?.role === "ACI"){
//       conditionalRole = ['CC'] 
//     } else {
//       conditionalRole = ['CC', 'ACI']
//     }


//       if (userData?.[0]?.role === "ACI"){
//       status = ['Pending'] 
//     } else {
//       status = ['Pending', 'Verified']
//     }





//     const role = userData?.[0]?.role ?? 'NA'

//     const query = `userId=${userData[0].userId}&status=${status}&role=${userData[0].role}&conditionalRole=${conditionalRole}`
//     try {
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

//   //______________________________________________________________________________________________________________________

//   //Below logic patches the data of bills once user verifies. Basically updates the bills' verification status like, verified
//   //... or rejected and remakrs.

//   const [statuses, setStatuses] = useState({});
//   const [verifications, setVerifications] = useState({});

//   const updateVerificationStatus = async (billId) => {
//     // alert(billId)

//     const queryParams = {
//       // expenseId: "111"
//        _id: billId,
       
//     }

//     const formData = {
//       status: statuses[billId],
//       verification: verifications[billId],
//     }

//     try {
//       const response = await patchBillsDataVerification(queryParams, formData)
      
//       fetchPendingBills();
      
//     } catch (error) {
//       console.log("Error patching data", error.message)
//     }

//   }

//   //_______________________________________________________________________________________________________________________

//   return (
//     <Container fluid className="py-3">
//       <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
//         {pendingBillsData && pendingBillsData.length > 0 ? (
//           pendingBillsData.map((bill, index) => (
//             <Col key={bill._id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Body>
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
//                     <strong>Status:</strong> {bill.status}<br />
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
//                   <div className="mb-2">
//                     <Form.Label>Verification Status</Form.Label>
//                     <Select
//                       options={[
//                         { value: "Verified", label: "Verified" },
//                         { value: "Rejected", label: "Rejected" },
//                       ]}
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
//                     />
//                   </div>
//                   <Button
//                     variant="success"
//                     onClick={() => updateVerificationStatus(bill._id)}
//                   >
//                     updateVerificationStatus
//                   </Button>
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

// const BillsVerification = () => {
//   //Below snippet has all types of hooks and context api variables this component will use.
//   const { userData, setUserData } = useContext(UserContext); //Getting userData from context api, once user logs in.

//   const [pendingBillsData, setPendingBillsData] = useState([]);

//   //Getting the pending bills data. 
//   const fetchPendingBills = async () => {

//     let conditionalRole;
//     let status;

//     if (userData?.[0]?.role === "ACI"){
//       conditionalRole = ['CC'] 
//     } else {
//       conditionalRole = ['CC', 'ACI']
//     }

//     if (userData?.[0]?.role === "ACI"){
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'] 
//     } else {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected']
//     }

//     const role = userData?.[0]?.role ?? 'NA'

//     const query = `userId=${userData[0].userId}&status=${status}&role=${userData[0].role}&conditionalRole=${conditionalRole}`
//     try {
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

//   //______________________________________________________________________________________________________________________

//   //Below logic patches the data of bills once user verifies. Basically updates the bills' verification status like, verified
//   //... or rejected and remakrs.

//   const [statuses, setStatuses] = useState({});
//   const [verifications, setVerifications] = useState({});

//   const updateVerificationStatus = async (billId) => {
//     // alert(billId)

//     const queryParams = {
//       // expenseId: "111"
//        _id: billId,
//     }

//     const formData = {
//       status: statuses[billId],
//       verification: verifications[billId],
//     }

//     try {
//       const response = await patchBillsDataVerification(queryParams, formData)
//       fetchPendingBills();
//     } catch (error) {
//       console.log("Error patching data", error.message)
//     }

//   }

//   //_______________________________________________________________________________________________________________________

//   // Dropdown options based on user role
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

//   return (
//     <Container fluid className="py-3">
//       <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
//         {pendingBillsData && pendingBillsData.length > 0 ? (
//           pendingBillsData.map((bill, index) => (
//             <Col key={bill._id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Body>
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
//                     <strong>Status:</strong> {bill.status}<br />
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
//                     />
//                   </div>
//                   <Button
//                     variant="success"
//                     onClick={() => updateVerificationStatus(bill._id)}
//                   >
//                     updateVerificationStatus
//                   </Button>
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

// const BillsVerification = () => {
//   const { userData, setUserData } = useContext(UserContext);

//   const [pendingBillsData, setPendingBillsData] = useState([]);

//   const fetchPendingBills = async () => {
//     let conditionalRole;
//     let status;

//     if (userData?.[0]?.role === "ACI") {
//       conditionalRole = ['CC'];
//     } else {
//       conditionalRole = ['CC', 'ACI'];
//     }

//     if (userData?.[0]?.role === "ACI") {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'];
//     } else {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'];
//     }

//     const role = userData?.[0]?.role ?? 'NA';

//     const query = `userId=${userData[0].userId}&status=${status}&role=${userData[0].role}&conditionalRole=${conditionalRole}`;
//     try {
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

//   return (
//     <Container fluid className="py-3">
//       <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
//         {pendingBillsData && pendingBillsData.length > 0 ? (
//           pendingBillsData.map((bill, index) => (
//             <Col key={bill._id}>
//               <Card className="h-100 shadow-sm" style={getCardStyle(bill.status)}>
//                 <Card.Body>
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
//                     <strong>Status:</strong> {bill.status}<br />
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

// const BillsVerification = () => {
//   const { userData, setUserData } = useContext(UserContext);

//   const [pendingBillsData, setPendingBillsData] = useState([]);
//   const [filteredRole, setFilteredRole] = useState(""); // new state for role filter
//   const [selectedBills, setSelectedBills] = useState([]); // for multi-select
//   const [bulkAction, setBulkAction] = useState(null); // for dropdown bulk status

//   const fetchPendingBills = async () => {
//     let conditionalRole;
//     let status;

//     if (userData?.[0]?.role === "ACI") {
//       conditionalRole = ['CC'];
//     } else {
//       conditionalRole = ['CC', 'ACI'];
//     }

//     if (userData?.[0]?.role === "ACI") {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'];
//     } else {
//       status = ['Pending', 'Verified', 'Approved', 'Rejected'];
//     }

//     const role = userData?.[0]?.role ?? 'NA';

//     const query = `userId=${userData[0].userId}&status=${status}&role=${userData[0].role}&conditionalRole=${conditionalRole}`;
//     try {
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
//             verifiedBy: userData?.[0]?.userId ?? "Not Known",
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

//   const filteredData = filteredRole
//     ? pendingBillsData.filter((bill) => bill.role === filteredRole)
//     : pendingBillsData;

//   const toggleBillSelection = (billId) => {
//     setSelectedBills((prev) =>
//       prev.includes(billId)
//         ? prev.filter((id) => id !== billId)
//         : [...prev, billId]
//     );
//   };

//   return (
//     <Container fluid className="py-3">
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
//         {userData?.[0]?.role === "Community Manager" && (
//           <>
//             <Col md={3}>
//               <Select
//                 options={getDropdownOptions()}
//                 value={bulkAction ? { value: bulkAction, label: bulkAction } : null}
//                 onChange={(e) => setBulkAction(e.value)}
//                 placeholder="Bulk Approve/Reject"
//               />
//             </Col>
//             <Col md={3}>
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
//                     <strong>Status:</strong> {bill.status}<br />
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
import { getPendingAndVerifiedBillsByAci, patchBillsDataVerification } from "../../service/Bills.services";
import Select from "react-select";

import { deleteBill } from "../../service/Bills.services.js";

const BillsVerification = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [pendingBillsData, setPendingBillsData] = useState([]);
  const [filteredRole, setFilteredRole] = useState(""); // new state for role filter
  const [selectedBills, setSelectedBills] = useState([]); // for multi-select
  const [bulkAction, setBulkAction] = useState(null); // for dropdown bulk status
  const [statusFilter, setStatusFilter] = useState(""); // new filter for status

  const fetchPendingBills = async () => {
    let conditionalRole;
    let status;

    if (userData?.[0]?.role === "ACI") {
      conditionalRole = ['CC'];
    } else {
      conditionalRole = ['CC', 'ACI'];
    }

    if (userData?.[0]?.role === "ACI") {
      status = ['Pending', 'Verified', 'Approved', 'Rejected'];
    } else {
      status = ['Pending', 'Verified', 'Approved', 'Rejected'];
    }

    const role = userData?.[0]?.role ?? 'NA';

    const query = `userId=${userData[0].userId}&status=${status}&role=${userData[0].role}&conditionalRole=${conditionalRole}`;
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

  const [statuses, setStatuses] = useState({});
  const [verifications, setVerifications] = useState({});

  const updateVerificationStatus = async (billId) => {
    const queryParams = {
      _id: billId,
    };

    const formData = {
      status: statuses[billId],
      verification: verifications[billId],
    };

    try {
      const response = await patchBillsDataVerification(queryParams, formData);
      fetchPendingBills();
    } catch (error) {
      console.log("Error patching data", error.message);
    }
  };

  const updateBulkStatus = async () => {
    try {
      for (const billId of selectedBills) {
        const queryParams = { _id: billId };
        const formData = {
          status: bulkAction,
          verification: {
            verifiedBy: userData?.[0]?.userId ?? "Not Known",
            verifiedAt: new Date(),
            comments: "",
          },
        };
        await patchBillsDataVerification(queryParams, formData);
      }
      setSelectedBills([]);
      setBulkAction(null);
      fetchPendingBills();
    } catch (error) {
      console.log("Bulk update error", error.message);
    }
  };



  


  const getDropdownOptions = () => {
    const role = userData?.[0]?.role;
    if (role === "Community Manager") {
      return [
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
      ];
    } else if (role === "ACI") {
      return [
        { value: "Verified", label: "Verified" },
        { value: "Rejected", label: "Rejected" },
      ];
    } else {
      return [];
    }
  };

  const getCardStyle = (status) => {
    switch (status) {
      case "Verified":
        return { backgroundColor: "#F0F8FF" };
      case "Rejected":
        return { backgroundColor: "#DC143C", color: "white" };
      case "Approved":
        return { backgroundColor: "#7FFFD4" };
      default:
        return {}; // white/default
    }
  };

  const isDisabled = (billStatus) => {
    const role = userData?.[0]?.role;
    if (role === "ACI" && billStatus !== "Pending") return true;
    if (role === "Community Manager" && billStatus === "Approved") return true;
    return false;
  };

  const sortBills = (bills) => {
    const statusOrder = { Pending: 1, Verified: 2, Approved: 3 };
    return bills.sort((a, b) => (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4));
  };

  const filteredData = sortBills(
    pendingBillsData.filter((bill) => {
      const roleMatch = filteredRole ? bill.role === filteredRole : true;
      const statusMatch = statusFilter ? bill.status === statusFilter : true;
      return roleMatch && statusMatch;
    })
  );

  const toggleBillSelection = (billId) => {
    setSelectedBills((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId]
    );
  };

  const clearFilters = () => {
    setFilteredRole("");
    setStatusFilter("");
  };


  //Handiling bill deletion


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

  

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={filteredRole}
            onChange={(e) => setFilteredRole(e.target.value)}
          >
            <option value="">Filter by Role</option>
            <option value="CC">CC</option>
            <option value="ACI">ACI</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Col>
        {userData?.[0]?.role === "Community Manager" && (
          <>
            <Col md={2}>
              <Select
                options={getDropdownOptions()}
                value={bulkAction ? { value: bulkAction, label: bulkAction } : null}
                onChange={(e) => setBulkAction(e.value)}
                placeholder="Bulk Approve/Reject"
              />
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                disabled={!bulkAction || selectedBills.length === 0}
                onClick={updateBulkStatus}
              >
                Submit Bulk Action
              </Button>
            </Col>
          </>
        )}
      </Row>

      <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((bill, index) => (
            <Col key={bill._id}>
              <Card className="h-100 shadow-sm" style={getCardStyle(bill.status)}>
                <Card.Body>
                  <Card.Title>Status: {bill.status}</Card.Title>
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
                    {/* <strong>Status:</strong> {bill.status}<br /> */}
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

                  {userData?.[0]?.role === "Community Manager" && (
                    <Form.Check
                      type="checkbox"
                      label="Select for Bulk"
                      checked={selectedBills.includes(bill._id)}
                      onChange={() => toggleBillSelection(bill._id)}
                      className="mb-2"
                      disabled={bill.status === "Approved"}
                    />
                  )}

                  <div className="mb-2">
                    <Form.Label>Verification Status</Form.Label>
                    <Select
                      options={getDropdownOptions()}
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
                      isDisabled={isDisabled(bill.status)}
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
                      disabled={isDisabled(bill.status)}
                    />
                  </div>
                  <Button
                    variant="success"
                    onClick={() => updateVerificationStatus(bill._id)}
                  >
                    updateVerificationStatus
                  </Button>
                      <br></br>
                      <br></br>
                  <Button onClick={()=>handleBillDelete(bill._id)}>Delete</Button>
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
















