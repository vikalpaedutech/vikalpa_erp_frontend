// /FRONTEND/src/components/Concern/TechConcernStatus

// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getBillsByQueryParams } from "../../service/Bills.services";
// import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

// export const BillsStatus = () => {
//   //Context apis
//   const { userData, setUserData } = useContext(UserContext);
//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext, setClassContext } = useContext(ClassContext);

//   //Usestate hooks.
//   const [billsData, setBillsData] = useState([]);
//   const [statusSelections, setStatusSelections] = useState({}); // to track dropdown selections

//   //API to fetch concerns data. Tech Concerns Only.
//   const fetchTechConcerns = async () => {
//     const queryParams = {
//       userId: userData?.[0]?.userId,
//     //   concernType:'School'
//     };

//     console.log(queryParams);

//     try {
//       const response = await getBillsByQueryParams(queryParams);
//       console.log(response.data);
//       setBillsData(response.data);
//     } catch (error) {
//       console.log("Error fetching concerns", error);
//     }
//   };

//   const handleStatusChange = (selectedOption, concernId) => {
//     setStatusSelections({
//       ...statusSelections,
//       [concernId]: selectedOption?.value,
//     });
//   };

// //   const handleSubmitStatus = async (concernId) => {
// //     const selectedStatus = statusSelections[concernId];
// //     if (!selectedStatus) return;

// //     try {
// //       const query = {
// //         userId: userData?.[0]?.userId,
// //       };

// //       const payload = {
// //         concernStatusBySubmitter: selectedStatus,
// //       };

// //       await PatchConcernsByQueryParams(query, payload);
// //       fetchTechConcerns(); // refresh after update
// //     } catch (error) {
// //       console.log("Error updating concern status", error);
// //     }
// //   };

  

//   useEffect(() => {
//     fetchTechConcerns();
//   }, []);

//   const options = [
//     { value: "Closed", label: "Closed" },
//   ];

//   return (
//     <Container>
//       <div>
//         {billsData.map((eachBills, index) => {

//           //Handling prgress bar
//           let progressPercent = 0;
//           if (eachBills.status === "Verified") progressPercent = 33;
//           else if (eachBills.status === "Approved") progressPercent = 66;
//           else if (eachBills.status === "Paid") progressPercent = 100;

//           return (
//             <div key={index}>
//               <br />
//               <Card style={{ width: "18rem" }}>
//                 <Card.Body>
//                   <Card.Title>{eachBills.expenseType}</Card.Title>
//                   <Card.Text>
//                     <p>Purpose: {eachBills.purposeOfExpense}</p>
//                     <p>Class: {eachBills.classOfConcern}</p>

//                     {/* Conditionally render fields based on expenseType */}
//                     {eachBills.expenseType === "Travel" && (
//                       <>
//                         <p>From: {eachBills.travelFrom || "N/A"}</p>
//                         <p>To: {eachBills.travelTo || "N/A"}</p>
//                         <p>Distance: {eachBills.travelledDistance ? `${eachBills.travelledDistance} km` : "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     )}

//                     {eachBills.expenseType === "Food" && (
//                       <>
//                         <p>Food Type: {eachBills.foodType || "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     )}

//                     {eachBills.expenseType === "Accommodation" && (
//                       <>
//                         <p>Date: {eachBills.accomodationDate ? new Date(eachBills.accomodationDate).toLocaleDateString() : "N/A"}</p>
//                         <p>Days Stayed: {eachBills.stayedForDays || "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     )}

//                     {eachBills.expenseType === "Other" || eachBills.expenseType === "Stationery" ? (
//                       <>
//                         <p>Item Name: {eachBills.otherItemName || "N/A"}</p>
//                         <p>Purpose: {eachBills.otherItemPurchasingPurpose || "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     ) : null}

//                     <p>
//                       File:{" "}
//                       <a href={eachBills.fileUrl} target="_blank" rel="noopener noreferrer">
//                         View File
//                       </a>
//                     </p>
//                   </Card.Text>

//                   <div className="custom-progress-container">
//                     <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
//                     <div className="checkpoints">
//                       <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
//                         <span>1</span>
//                         <div className="checkpoint-label">Submit</div>
//                       </div>
//                       <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
//                         <span>2</span>
//                         <div className="checkpoint-label">ACI</div>
//                       </div>
//                       <div className={`checkpoint ${progressPercent >= 66 ? "active" : ""}`} style={{ left: "66%" }}>
//                         <span>3</span>
//                         <div className="checkpoint-label">Manager</div>
//                       </div>
//                       <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
//                         <span>4</span>
//                         <div className="checkpoint-label">Paid</div>
//                       </div>
//                     </div>
//                   </div>

//                   <br />
//                 </Card.Body>
//               </Card>
//             </div>
//           );
//         })}
//       </div>
//     </Container>
//   );
// };

















// // /FRONTEND/src/components/Concern/TechConcernStatus

// import React from "react";
// import { useState, useEffect, useContext } from "react";
// import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { getBillsByQueryParams } from "../../service/Bills.services";
// import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

// export const BillsStatus = () => {
//   //Context apis
//   const { userData, setUserData } = useContext(UserContext);
//   const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
//   const { blockContext, setBlockContext } = useContext(BlockContext);
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext);
//   const { classContext, setClassContext } = useContext(ClassContext);

//   //Usestate hooks.
//   const [billsData, setBillsData] = useState([]);
//   const [statusSelections, setStatusSelections] = useState({}); // to track dropdown selections

//   //API to fetch concerns data. Tech Concerns Only.
//   const fetchTechConcerns = async () => {
//     const queryParams = {
//       userId: userData?.[0]?.userId,
//     //   concernType:'School'
//     };

//     console.log(queryParams);

//     try {
//       const response = await getBillsByQueryParams(queryParams);
//       console.log(response.data);
//       setBillsData(response.data);
//     } catch (error) {
//       console.log("Error fetching concerns", error);
//     }
//   };

//   const handleStatusChange = (selectedOption, concernId) => {
//     setStatusSelections({
//       ...statusSelections,
//       [concernId]: selectedOption?.value,
//     });
//   };

// //   const handleSubmitStatus = async (concernId) => {
// //     const selectedStatus = statusSelections[concernId];
// //     if (!selectedStatus) return;

// //     try {
// //       const query = {
// //         userId: userData?.[0]?.userId,
// //       };

// //       const payload = {
// //         concernStatusBySubmitter: selectedStatus,
// //       };

// //       await PatchConcernsByQueryParams(query, payload);
// //       fetchTechConcerns(); // refresh after update
// //     } catch (error) {
// //       console.log("Error updating concern status", error);
// //     }
// //   };

  

//   useEffect(() => {
//     fetchTechConcerns();
//   }, []);

//   const options = [
//     { value: "Closed", label: "Closed" },
//   ];

//   return (
//     <Container>
//       <div>
//         {billsData.map((eachBills, index) => {

//           //Handling prgress bar
//           let progressPercent = 0;
//           if (eachBills.status === "Verified") progressPercent = 33;
//           else if (eachBills.status === "Approved") progressPercent = 66;
//           else if (eachBills.status === "Paid") progressPercent = 100;

//           return (
//             <div key={index}>
//               <br />
//               <Card style={{ width: "18rem" }}>
//                 <Card.Body>
//                   <Card.Title>{eachBills.expenseType}</Card.Title>
//                   <Card.Text>
//                     <p>Purpose: {eachBills.purposeOfExpense}</p>
//                     <p>Class: {eachBills.classOfConcern}</p>

//                     {/* Conditionally render fields based on expenseType */}
//                     {eachBills.expenseType === "Travel" && (
//                       <>
//                         <p>From: {eachBills.travelFrom || "N/A"}</p>
//                         <p>To: {eachBills.travelTo || "N/A"}</p>
//                         <p>Distance: {eachBills.travelledDistance ? `${eachBills.travelledDistance} km` : "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     )}

//                     {eachBills.expenseType === "Food" && (
//                       <>
//                         <p>Food Type: {eachBills.foodType || "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     )}

//                     {eachBills.expenseType === "Accommodation" && (
//                       <>
//                         <p>Date: {eachBills.accomodationDate ? new Date(eachBills.accomodationDate).toLocaleDateString() : "N/A"}</p>
//                         <p>Days Stayed: {eachBills.stayedForDays || "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     )}

//                     {eachBills.expenseType === "Other" || eachBills.expenseType === "Stationery" ? (
//                       <>
//                         <p>Item Name: {eachBills.otherItemName || "N/A"}</p>
//                         <p>Purpose: {eachBills.otherItemPurchasingPurpose || "N/A"}</p>
//                         <p>Amount: ₹{eachBills.expenseAmount}</p>
//                       </>
//                     ) : null}

//                     <p>
//                       File:{" "}
//                       <a href={eachBills.fileUrl} target="_blank" rel="noopener noreferrer">
//                         View File
//                       </a>
//                     </p>
//                   </Card.Text>

//                   {eachBills.status === "Rejected" ? (
//                     <>
//                       <p><strong>Bill Status:</strong> Rejected</p>
//                       <p><strong>Comments:</strong> {eachBills.verification?.comments || "No comments provided"}</p>
//                     </>
//                   ) : (
//                     <div className="custom-progress-container">
//                       <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
//                       <div className="checkpoints">
//                         <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
//                           <span>1</span>
//                           <div className="checkpoint-label">Submit</div>
//                         </div>
//                         <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
//                           <span>2</span>
//                           <div className="checkpoint-label">ACI</div>
//                         </div>
//                         <div className={`checkpoint ${progressPercent >= 66 ? "active" : ""}`} style={{ left: "66%" }}>
//                           <span>3</span>
//                           <div className="checkpoint-label">Manager</div>
//                         </div>
//                         <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
//                           <span>4</span>
//                           <div className="checkpoint-label">Paid</div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <br />
//                 </Card.Body>
//               </Card>
//             </div>
//           );
//         })}
//       </div>
//     </Container>
//   );
// };





















  import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getBillsByQueryParams } from "../../service/Bills.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const BillsStatus = () => {
  //Context apis
  const { userData, setUserData } = useContext(UserContext);
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext, setClassContext } = useContext(ClassContext);

  //Usestate hooks.
  const [billsData, setBillsData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({}); // to track dropdown selections

  //API to fetch concerns data. Tech Concerns Only.
  const fetchTechConcerns = async () => {
    const queryParams = {
      userId: userData?.[0]?.userId,
    //   concernType:'School'
    };

    console.log(queryParams);

    try {
      const response = await getBillsByQueryParams(queryParams);
      console.log(response.data);
      setBillsData(response.data);
    } catch (error) {
      console.log("Error fetching concerns", error);
    }
  };

  const handleStatusChange = (selectedOption, concernId) => {
    setStatusSelections({
      ...statusSelections,
      [concernId]: selectedOption?.value,
    });
  };

//   const handleSubmitStatus = async (concernId) => {
//     const selectedStatus = statusSelections[concernId];
//     if (!selectedStatus) return;

//     try {
//       const query = {
//         userId: userData?.[0]?.userId,
//       };

//       const payload = {
//         concernStatusBySubmitter: selectedStatus,
//       };

//       await PatchConcernsByQueryParams(query, payload);
//       fetchTechConcerns(); // refresh after update
//     } catch (error) {
//       console.log("Error updating concern status", error);
//     }
//   };

  

  useEffect(() => {
    fetchTechConcerns();
  }, []);

  const options = [
    { value: "Closed", label: "Closed" },
  ];

  return (
    <Container>
      <div>
        {billsData.map((eachBills, index) => {

          //Handling prgress bar
          let progressPercent = 0;
          if (eachBills.status === "Verified") progressPercent = 33;
          else if (eachBills.status === "Approved") progressPercent = 66;
          else if (eachBills.status === "Paid") progressPercent = 100;

          return (
            <div key={index}>
              <br />
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{eachBills.expenseType}</Card.Title>
                  <Card.Text>
                    <p>Purpose: {eachBills.purposeOfExpense}</p>
                    <p>Class: {eachBills.classOfConcern}</p>

                    {/* Conditionally render fields based on expenseType */}
                    {eachBills.expenseType === "Travel" && (
                      <>
                        <p>From: {eachBills.travelFrom || "N/A"}</p>
                        <p>To: {eachBills.travelTo || "N/A"}</p>
                        <p>Distance: {eachBills.travelledDistance ? `${eachBills.travelledDistance} km` : "N/A"}</p>
                        <p>Amount: ₹{eachBills.expenseAmount}</p>
                      </>
                    )}

                    {eachBills.expenseType === "Food" && (
                      <>
                        <p>Food Type: {eachBills.foodType || "N/A"}</p>
                        <p>Amount: ₹{eachBills.expenseAmount}</p>
                      </>
                    )}

                    {eachBills.expenseType === "Accommodation" && (
                      <>
                        <p>Date: {eachBills.accomodationDate ? new Date(eachBills.accomodationDate).toLocaleDateString() : "N/A"}</p>
                        <p>Days Stayed: {eachBills.stayedForDays || "N/A"}</p>
                        <p>Amount: ₹{eachBills.expenseAmount}</p>
                      </>
                    )}

                    {eachBills.expenseType === "Other" || eachBills.expenseType === "Stationery" ? (
                      <>
                        <p>Item Name: {eachBills.otherItemName || "N/A"}</p>
                        <p>Purpose: {eachBills.otherItemPurchasingPurpose || "N/A"}</p>
                        <p>Amount: ₹{eachBills.expenseAmount}</p>
                      </>
                    ) : null}

                    <p>
                      File:{" "}
                      <a href={eachBills.fileUrl} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </p>
                  </Card.Text>

                  {eachBills.status === "Rejected" ? (
                    <>
                      <p><strong>Bill Status:</strong> Rejected</p>
                      <p><strong>Comments:</strong> {eachBills.verification?.comments || "No comments provided"}</p>
                    </>
                  ) : (
                    <div className="custom-progress-container">
                      <div className="custom-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                      <div className="checkpoints">
                        <div className={`checkpoint ${progressPercent >= 0 ? "active" : ""}`} style={{ left: "0%" }}>
                          <span>1</span>
                          <div className="checkpoint-label">Submit</div>
                        </div>
                        {userData?.[0]?.role === "CC" && (
                          <div className={`checkpoint ${progressPercent >= 33 ? "active" : ""}`} style={{ left: "33%" }}>
                            <span>2</span>
                            <div className="checkpoint-label">ACI</div>
                          </div>
                        )}
                        <div className={`checkpoint ${progressPercent >= (userData?.[0]?.role === "CC" ? 66 : 33) ? "active" : ""}`} style={{ left: userData?.[0]?.role === "CC" ? "66%" : "50%" }}>
                          <span>{userData?.[0]?.role === "CC" ? "3" : "2"}</span>
                          <div className="checkpoint-label">Manager</div>
                        </div>
                        <div className={`checkpoint ${progressPercent >= 100 ? "active" : ""}`} style={{ left: "100%" }}>
                          <span>{userData?.[0]?.role === "CC" ? "4" : "3"}</span>
                          <div className="checkpoint-label">Paid</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <br />
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </Container>
  );
};
