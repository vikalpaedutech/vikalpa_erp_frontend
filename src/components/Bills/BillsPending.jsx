// //This is /Frontend/src/components/Bills/BillsVerificationAndApproval.jsx


// /*
// 1 First we get the pending bills.
// 2 We then Verifiy, Approved, Reject, or Paid bills.

// */

// import React, {useState, useEffect, useContext, use} from "react";
//  import { UserContext } from "../contextAPIs/User.context";
// import { Container, Row, Col, Table ,Image} from "react-bootstrap";
// import { getPendingAndVerifiedBillsByAci } from "../../service/Bills.services";


//  const BillsPending = () => {
    
//     //Below snippet has all types of hooks and context api variables this component will use.
//     const {userData, setUserData} = useContext(UserContext); //Getting userData from context api, once user logs in.

//     consilt [pendingBillsData, setPendingBillsData] = useState([]);

//     //__________________________________________________________________________________________________________




//     //Getting the pending bills data. 

//     const fetchPendingBills = async () => {

//         try {
//             const response = await getPendingAndVerifiedBillsByAci();
//             setPendingBillsData(response.data);
//             console.log(response.data)
//         } catch (error) {
//             console.log("Error fetching pending bills data", error.message)
//         }
//     }

//     useEffect(()=>{
//         fetchPendingBills();
//     }, [])



    

//     return(

//         <Container fluid>
// <Table striped bordered hover responsive>
//   <thead>
//     <tr>
//       <th>#</th>
//       <th>Expense ID</th>
//       <th>User ID</th>
//       <th>User Name</th> {/* 👈 New column */}
//       <th>Role</th>
//       <th>Purpose</th>
//       <th>Expense Type</th>
//       <th>Item Name</th>
//       <th>Item Purpose</th>
//       <th>Amount (₹)</th>
//       <th>Bill Image</th>
//       <th>Status</th>
//       <th>Date</th>
//     </tr>
//   </thead>
//   <tbody>
//     {pendingBillsData && pendingBillsData.length > 0 ? (
//       pendingBillsData.map((bill, index) => (
//         <tr key={bill._id}>
//           <td>{index + 1}</td>
//           <td>{bill.expenseId}</td>
//           <td>{bill.userId}</td>
//           <td>{bill.userDetails?.name || "N/A"}</td> {/* 👈 Show user name */}
//           <td>{bill.role}</td>
//           <td>{bill.purposeOfExpense}</td>
//           <td>{bill.expenseType}</td>
//           <td>{bill.otherItemName}</td>
//           <td>{bill.otherItemPurchasingPurpose}</td>
//           <td>{bill.expenseAmount}</td>
//           <td>
//             <a href={bill.fileUrl} target="_blank" rel="noopener noreferrer">
//               <Image 
//                 src={bill.fileUrl} 
//                 alt="Bill" 
//                 thumbnail 
//                 style={{ maxWidth: '100px', maxHeight: '100px' }} 
//               />
//             </a>
//           </td>
//           <td>{bill.status}</td>
//           <td>{new Date(bill.expenseDate).toLocaleDateString()}</td>
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td colSpan="13" className="text-center">No pending bills found.</td>
//       </tr>
//     )}
//   </tbody>
// </Table>
           
//         </Container>
//     )
//  }

//  export default BillsPending;