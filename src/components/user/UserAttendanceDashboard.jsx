// //src/components/user/UserAttendanceDashboard.jsx

// // src/components/user/UserAttendanceDashboard.jsx
// import React, { useContext, useState, useEffect } from 'react';
// import { UserContext } from "../contextAPIs/User.context";
// import { Modal, Button, Card, Spinner, Table, Form, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getUserAttendanceSummaryData, patchUserAttendanceWithoutImage } from '../../service/userAttendance.services';

// export const UserAttendanceDash = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [attendanceSummary, setAttendanceSummary] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [startDate, setStartDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });
//   const [endDate, setEndDate] = useState(() => {
//     return new Date().toISOString().split("T")[0];
//   });

//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
//   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
//   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("All");

//   const [remarkInputs, setRemarkInputs] = useState({});

//   const fetchUserAttendanceSummaryData = async () => {
//     const loggedInUser = userData;
//     console.log(userData)
    
//     if (!loggedInUser) return;

//     let conditionalRoleToSearch;
//     if (userData?.role === "admin" || userData?.role === "Community Incharge" || userData?.role === "Community Manager" || userData?.role === "Project Coordinator") {
//       conditionalRoleToSearch = ['ACI', 'CC']
//     } else if (userData?.role === "ACI") {
//       conditionalRoleToSearch = ['CC']
//     }

//     const rolesToSearch = conditionalRoleToSearch;
//     const departmentsToSearch = ['Community'];

//     const payLoad = {
//       roles: rolesToSearch,
//       departments: departmentsToSearch,
//       districtIds: loggedInUser.districtIds || [],
//       schoolIds: loggedInUser.schoolIds || [],
//       startDate: startDate,
//       endDate: endDate
//     };

//     try {
//       setIsLoading(true);
//       const response = await getUserAttendanceSummaryData(payLoad);
      
//       let result = response?.data?.data || [];
//       console.log(result)

//       if (statusFilter !== "All") {
//         result = result.filter((item) => item.attendance === statusFilter);
//       }

//       if (
//         userData?.role === "Community Incharge" ||
//         userData?.role === "Community Manager" ||
//         userData?.role === "Project Coordinator" ||
//         userData?.role === "Admin"
//       ) {
//         if (selectedRoleFilter !== "All") {
//           result = result.filter((item) => item.role === selectedRoleFilter);
//         }
//       }

//       if (selectedTimeFilter !== "All") {
//         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
//         const threshold = new Date(startDate);
//         threshold.setHours(hour, minute, 0, 0);

//         result = result.filter((item) => {
//           if (!item.loginTime) return false;
//           const loginTime = new Date(item.loginTime);
//           return loginTime > threshold;
//         });
//       }

//       if (selectedDistrictFilter !== "All") {
//         result = result.filter((item) => {
//           const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
//           return districts.includes(selectedDistrictFilter);
//         });
//       }

//       // Sort by district name
//       result.sort((a, b) => {
//         const districtA = (a.locationInfo?.[0]?.districtName || "").toLowerCase();
//         const districtB = (b.locationInfo?.[0]?.districtName || "").toLowerCase();
//         return districtA.localeCompare(districtB);
//       });

//       setAttendanceSummary(result);

//       // Prefill remarks in state
//       const initialRemarks = {};
//       result.forEach(item => {
//         if (item.userId) {
//           initialRemarks[item.userId] = item.remarkForManualAttendance || "";
//         }
//       });
//       setRemarkInputs(initialRemarks);

//     } catch (error) {
//       console.log("Error getting data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceSummaryData();
//   }, [startDate, endDate, statusFilter, selectedRoleFilter, selectedTimeFilter, selectedDistrictFilter]);

//   const handleAttendanceUpdate = async (selectedOption, userId) => {
//     if (!remarkInputs[userId] || remarkInputs[userId].trim() === "") {
//       alert("Please enter a reason for manual attendance before updating.");
//       return;
//     }

//     const queryParams = {
//       userId: userId,
//       date: startDate,
//     };

//     const payLoad = {
//       attendance: selectedOption.value,
//       attendanceMarkedBy: userData?.[0]?.userId || "unknown",
//       attendanceType: "Leave",
//       visitingLocation: "NA",
//       remarkForManualAttendance: remarkInputs[userId],
//     };

//     try {
//       const response = await patchUserAttendanceWithoutImage(queryParams, payLoad);

//       setAttendanceSummary(prev =>
//         prev.map(item =>
//           item.userId === userId
//             ? { ...item, attendance: selectedOption.value, remarkForManualAttendance: remarkInputs[userId] }
//             : item
//         )
//       );

//     } catch (error) {
//       console.error("❌ Patch Error:", error.message);
//       alert('Attendance has not been initiated in db. Contact to office!');
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['#', 'Name', 'Contact', 'Reason for Manual Attendance', 'Status', 'Date', 'Login Time', 'Districts', 'Centers'];
//     const rows = attendanceSummary.map((item, index) => {
//       const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
//       const centers = [...new Set(item.locationInfo?.map(loc => loc.centerName)?.filter(Boolean))] || [];

//       return [
//         index + 1,
//         item.name || "",
//         item.contact1 || "",
//         item.remarkForManualAttendance || "",
//         item.attendance || "Absent",
//         item.date ? new Date(item.date).toLocaleDateString() : "N/A",
//         item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A",
//         `${districts.join(', ')}`,
//         `${centers.join(', ')}`
//       ];
//     });

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(field => `"${field}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `Attendance_${startDate}_to_${endDate}.csv`);
//     link.style.display = "none";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const statusOptions = [
//     { value: "Present", label: "Present" },
//     { value: "WFH", label: "WFH" },
//     { value: "Comp-off", label: "Comp-off" },
//     { value: "Monthly Leave", label: "Monthly Leave" },
//     { value: "Half Day", label: "Half Day" },
//     { value: "Sick Leave", label: "Sick Leave" },
//     { value: "Leave Without Pay", label: "Leave Without Pay" },
//     { value: "Resigned", label: "Resigned " },
//   ];

//   // Collect unique districts for filter dropdown
//   const allDistricts = [
//     ...new Set(
//       attendanceSummary.flatMap(item => item.locationInfo?.map(loc => loc.districtName) || [])
//     )
//   ].filter(Boolean);

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Attendance Summary</h4>

//       <Row className="mb-3">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>📅 Start Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>📅 End Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>✅ Attendance Status</Form.Label>
//             <Form.Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="Present">Present</option>
//               <option value="Absent">Absent</option>
//               <option value="WFH">WFH</option>
//               <option value="Comp-off">Comp-off</option>
//               <option value="Monthly Leave">Monthly Leave</option>
//               <option value="Half Day">Half Day</option>
//               <option value="Sick Leave">Sick Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//               <option value="Resigned">Resigned </option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>🏢 Filter by District</Form.Label>
//             <Form.Select
//               value={selectedDistrictFilter}
//               onChange={(e) => setSelectedDistrictFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               {allDistricts.map((district, idx) => (
//                 <option key={idx} value={district}>{district}</option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>🕐 Login After</Form.Label>
//             <Form.Select
//               value={selectedTimeFilter}
//               onChange={(e) => setSelectedTimeFilter(e.target.value)}
//             >
//               <option value="All">All</option>
//               <option value="07:30">After 7:30 AM</option>
//               <option value="08:00">After 8:00 AM</option>
//               <option value="08:30">After 8:30 AM</option>
//               <option value="09:00">After 9:00 AM</option>
//               <option value="09:30">After 9:30 AM</option>
//               <option value="10:00">After 10:00 AM</option>
//               <option value="10:30">After 10:30 AM</option>
//               <option value="11:00">After 11:00 AM</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         {userData?.role === "Community Incharge" ||
//           userData?.role === "Community Manager" ||
//           userData?.role === "Project Coordinator" ||
//           userData?.role === "admin" ? (
//           <>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>👤 Filter by Role</Form.Label>
//                 <Form.Select
//                   value={selectedRoleFilter}
//                   onChange={(e) => setSelectedRoleFilter(e.target.value)}
//                 >
//                   <option value="All">All</option>
//                   <option value="CC">CC</option>
//                   <option value="ACI">ACI</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={4} className="d-flex align-items-end justify-content-between">
//               <Button variant="secondary" onClick={() => {
//                 setStatusFilter("All");
//                 setSelectedRoleFilter("All");
//                 setSelectedTimeFilter("All");
//                 setSelectedDistrictFilter("All");
//               }}>
//                 Clear Filter
//               </Button>
//               <Button variant="success" onClick={exportCSV}>⬇️ Export as CSV</Button>
//             </Col>
//           </>
//         ) : null}
//       </Row>

//       {isLoading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : attendanceSummary.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Contact</th>
//               <th style={{ whiteSpace: "normal", fontSize: "0.85rem" }}>Reason for Manual Attendance</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Login Time</th>
//               <th>Districts</th>
//               <th>Centers</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceSummary.map((item, index) => {
//               const districts = [...new Set(item.locationInfo?.map(loc => loc.districtName)?.filter(Boolean))] || [];
//               const centers = [...new Set(item.locationInfo?.map(loc => loc.centerName)?.filter(Boolean))] || [];
//               const attendanceValue = item.attendance || "Absent";
//               const statusColor = attendanceValue === "Present" ? "green" : attendanceValue === "Absent" ? "red" : "orange";

//               return (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{item.name}</td>
//                   <td>{item.contact1}</td>
//                   <td style={{ whiteSpace: "normal", fontSize: "0.85rem" }}>
//                     <Form.Control
//                       type="text"
//                       placeholder="Enter reason"
//                       value={remarkInputs[item.userId] || ""}
//                       onChange={(e) =>
//                         setRemarkInputs({ ...remarkInputs, [item.userId]: e.target.value })
//                       }
//                     />
//                   </td>
//                   <td>
//                     <Select
//                       value={{ value: attendanceValue, label: attendanceValue }}
//                       options={statusOptions}
//                       isDisabled={!remarkInputs[item.userId] || remarkInputs[item.userId].trim() === ""}
//                       onMenuOpen={() => {
//                         if (!remarkInputs[item.userId] || remarkInputs[item.userId].trim() === "") {
//                           alert("Please enter a reason for manual attendance before updating.");
//                         }
//                       }}
//                       onChange={(selectedOption) =>
//                         handleAttendanceUpdate(selectedOption, item.userId)
//                       }
//                       placeholder="Select Status"
//                       styles={{
//                         control: (provided) => ({
//                           ...provided,
//                           minWidth: 150,
//                           color: statusColor,
//                           fontWeight: "bold"
//                         }),
//                         singleValue: (provided) => ({
//                           ...provided,
//                           color: statusColor,
//                           fontWeight: "bold"
//                         })
//                       }}
//                     />
//                   </td>
//                   <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
//                   <td>{item.loginTime ? new Date(item.loginTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }) : "N/A"}</td>
//                   <td>{districts.join(', ')}</td>
//                   <td>{centers.join(', ')}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

















  // // src/components/user/UserAttendanceDashboard.jsx
  // import React, { useContext, useState, useEffect } from "react";
  // import { UserContext } from "../contextAPIs/User.context";
  // import { Spinner, Table, Form, Row, Col, Button } from "react-bootstrap";
  // import { useNavigate } from "react-router-dom";
  // import Select from "react-select";
  // import {
  //   getUserAttendanceSummaryData,
  //   patchUserAttendanceWithoutImage,
  // } from "../../service/userAttendance.services";

  // export const UserAttendanceDash = () => {
  //   const navigate = useNavigate();
  //   const { userData } = useContext(UserContext);

  //   const [attendanceSummary, setAttendanceSummary] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [startDate, setStartDate] = useState(
  //     () => new Date().toISOString().split("T")[0]
  //   );
  //   const [endDate, setEndDate] = useState(
  //     () => new Date().toISOString().split("T")[0]
  //   );

  //   const [statusFilter, setStatusFilter] = useState("All");
  //   const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  //   const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  //   const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("All");

  //   const [remarkInputs, setRemarkInputs] = useState({});

  //   const fetchUserAttendanceSummaryData = async () => {
  //     if (!userData) return;

  //     let conditionalRoleToSearch;
  //     if (
  //       ["admin", "Community Incharge", "Community Manager", "Project Coordinator"].includes(
  //         userData?.role
  //       )
  //     ) {
  //       conditionalRoleToSearch = ["ACI", "CC"];
  //     } else if (userData?.role === "ACI") {
  //       conditionalRoleToSearch = ["CC"];
  //     }

  //     const payLoad = {
  //       roles: conditionalRoleToSearch,
  //       departments: ["Community"],
  //       districtIds: userData.districtIds || [],
  //       schoolIds: userData.schoolIds || [],
  //       startDate,
  //       endDate,
  //     };

  //     try {
  //       setIsLoading(true);
  //       const response = await getUserAttendanceSummaryData(payLoad);
  //       let result = response?.data?.data || [];
  //       console.log(result)

  //       // Apply filters
  //       if (statusFilter !== "All") {
  //         result = result.filter((item) => item.attendance === statusFilter);
  //       }

  //       if (
  //         ["Community Incharge", "Community Manager", "Project Coordinator", "admin"].includes(
  //           userData?.role
  //         )
  //       ) {
  //         if (selectedRoleFilter !== "All") {
  //           result = result.filter(
  //             (item) => item.user?.role === selectedRoleFilter
  //           );
  //         }
  //       }

  //       if (selectedTimeFilter !== "All") {
  //         const [hour, minute] = selectedTimeFilter.split(":").map(Number);
  //         const threshold = new Date(startDate);
  //         threshold.setHours(hour, minute, 0, 0);

  //         result = result.filter((item) => {
  //           if (!item.loginTime) return false;
  //           return new Date(item.loginTime) > threshold;
  //         });
  //       }

  //       if (selectedDistrictFilter !== "All") {
  //         result = result.filter((item) => {
  //           const districts =
  //             item.access?.region?.map((r) => r.districtId) || [];
  //           return districts.includes(selectedDistrictFilter);
  //         });
  //       }

  //       setAttendanceSummary(result);

  //       // Prefill remarks in state
  //       const initialRemarks = {};
  //       result.forEach((item) => {
  //         if (item.user?.userId) {
  //           initialRemarks[item.user.userId] =
  //             item.remarkForManualAttendance || "";
  //         }
  //       });
  //       setRemarkInputs(initialRemarks);
  //     } catch (error) {
  //       console.log("Error getting data", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchUserAttendanceSummaryData();
  //   }, [startDate, endDate, statusFilter, selectedRoleFilter, selectedTimeFilter, selectedDistrictFilter]);

  //   const handleAttendanceUpdate = async (selectedOption, userId) => {
  //     if (!remarkInputs[userId] || remarkInputs[userId].trim() === "") {
  //       alert("Please enter a reason for manual attendance before updating.");
  //       return;
  //     }

  //     const queryParams = { userId, date: startDate };
  //     const payLoad = {
  //       attendance: selectedOption.value,
  //       attendanceMarkedBy: userData?.userId || "unknown",
  //       attendanceType: "Leave",
  //       visitingLocation: "NA",
  //       remarkForManualAttendance: remarkInputs[userId],
  //     };

  //     try {
  //       await patchUserAttendanceWithoutImage(queryParams, payLoad);
  //       setAttendanceSummary((prev) =>
  //         prev.map((item) =>
  //           item.user?.userId === userId
  //             ? {
  //                 ...item,
  //                 attendance: selectedOption.value,
  //                 remarkForManualAttendance: remarkInputs[userId],
  //               }
  //             : item
  //         )
  //       );
  //     } catch (error) {
  //       console.error("❌ Patch Error:", error.message);
  //       alert("Attendance has not been initiated in db. Contact office!");
  //     }
  //   };

  //   const exportCSV = () => {
  //     const headers = [
  //       "#",
  //       "Name",
  //       "Contact",
  //       "Reason for Manual Attendance",
  //       "Status",
  //       "Date",
  //       "Login Time",
  //       "Districts",
  //       "Centers",
  //     ];
  //     const rows = attendanceSummary.map((item, index) => {
  //       const districts =
  //         item.access?.region?.map((r) => r.districtId)?.filter(Boolean) || [];
  //       const centers =
  //         item.access?.region
  //           ?.flatMap((r) => r.blockIds?.map((b) => b.blockId))
  //           ?.filter(Boolean) || [];

  //       return [
  //         index + 1,
  //         item.user?.name || "",
  //         item.user?.contact1 || "",
  //         item.remarkForManualAttendance || "",
  //         item.attendance || "Absent",
  //         item.date ? new Date(item.date).toLocaleDateString() : "N/A",
  //         item.loginTime
  //           ? new Date(item.loginTime).toLocaleTimeString("en-IN", {
  //               hour: "numeric",
  //               minute: "numeric",
  //               second: "numeric",
  //               hour12: true,
  //             })
  //           : "N/A",
  //         `${districts.join(", ")}`,
  //         `${centers.join(", ")}`,
  //       ];
  //     });

  //     const csvContent = [
  //       headers.join(","),
  //       ...rows.map((row) => row.map((field) => `"${field}"`).join(",")),
  //     ].join("\n");

  //     const blob = new Blob([csvContent], {
  //       type: "text/csv;charset=utf-8;",
  //     });
  //     const url = URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.setAttribute("href", url);
  //     link.setAttribute(
  //       "download",
  //       `Attendance_${startDate}_to_${endDate}.csv`
  //     );
  //     link.style.display = "none";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };

  //   const statusOptions = [
  //     { value: "Present", label: "Present" },
  //     { value: "WFH", label: "WFH" },
  //     { value: "Comp-off", label: "Comp-off" },
  //     { value: "Monthly Leave", label: "Monthly Leave" },
  //     { value: "Half Day", label: "Half Day" },
  //     { value: "Sick Leave", label: "Sick Leave" },
  //     { value: "Leave Without Pay", label: "Leave Without Pay" },
  //     { value: "Resigned", label: "Resigned " },
  //   ];

  //   const allDistricts = [
  //     ...new Set(
  //       attendanceSummary.flatMap((item) =>
  //         item.access?.region?.map((r) => r.districtId) || []
  //       )
  //     ),
  //   ].filter(Boolean);

  //   return (
  //     <div className="container mt-4">
  //       <h4 className="mb-3">Attendance Summary</h4>

  //       <Row className="mb-3">
  //         <Col md={3}>
  //           <Form.Group>
  //             <Form.Label>📅 Start Date</Form.Label>
  //             <Form.Control
  //               type="date"
  //               value={startDate}
  //               onChange={(e) => setStartDate(e.target.value)}
  //             />
  //           </Form.Group>
  //         </Col>
  //         <Col md={3}>
  //           <Form.Group>
  //             <Form.Label>📅 End Date</Form.Label>
  //             <Form.Control
  //               type="date"
  //               value={endDate}
  //               onChange={(e) => setEndDate(e.target.value)}
  //             />
  //           </Form.Group>
  //         </Col>
  //         <Col md={3}>
  //           <Form.Group>
  //             <Form.Label>✅ Attendance Status</Form.Label>
  //             <Form.Select
  //               value={statusFilter}
  //               onChange={(e) => setStatusFilter(e.target.value)}
  //             >
  //               <option value="All">All</option>
  //               <option value="Present">Present</option>
  //               <option value="Absent">Absent</option>
  //               <option value="WFH">WFH</option>
  //               <option value="Comp-off">Comp-off</option>
  //               <option value="Monthly Leave">Monthly Leave</option>
  //               <option value="Half Day">Half Day</option>
  //               <option value="Sick Leave">Sick Leave</option>
  //               <option value="Leave Without Pay">Leave Without Pay</option>
  //               <option value="Resigned">Resigned </option>
  //             </Form.Select>
  //           </Form.Group>
  //         </Col>
  //         <Col md={3}>
  //           <Form.Group>
  //             <Form.Label>🏢 Filter by District</Form.Label>
  //             <Form.Select
  //               value={selectedDistrictFilter}
  //               onChange={(e) => setSelectedDistrictFilter(e.target.value)}
  //             >
  //               <option value="All">All</option>
  //               {allDistricts.map((district, idx) => (
  //                 <option key={idx} value={district}>
  //                   {district}
  //                 </option>
  //               ))}
  //             </Form.Select>
  //           </Form.Group>
  //         </Col>
  //       </Row>

  //       <Row className="mb-3">
  //         <Col md={4}>
  //           <Form.Group>
  //             <Form.Label>🕐 Login After</Form.Label>
  //             <Form.Select
  //               value={selectedTimeFilter}
  //               onChange={(e) => setSelectedTimeFilter(e.target.value)}
  //             >
  //               <option value="All">All</option>
  //               <option value="07:30">After 7:30 AM</option>
  //               <option value="08:00">After 8:00 AM</option>
  //               <option value="08:30">After 8:30 AM</option>
  //               <option value="09:00">After 9:00 AM</option>
  //               <option value="09:30">After 9:30 AM</option>
  //               <option value="10:00">After 10:00 AM</option>
  //               <option value="10:30">After 10:30 AM</option>
  //               <option value="11:00">After 11:00 AM</option>
  //             </Form.Select>
  //           </Form.Group>
  //         </Col>
  //         {["Community Incharge", "Community Manager", "Project Coordinator", "admin"].includes(
  //           userData?.role
  //         ) && (
  //           <>
  //             <Col md={4}>
  //               <Form.Group>
  //                 <Form.Label>👤 Filter by Role</Form.Label>
  //                 <Form.Select
  //                   value={selectedRoleFilter}
  //                   onChange={(e) => setSelectedRoleFilter(e.target.value)}
  //                 >
  //                   <option value="All">All</option>
  //                   <option value="CC">CC</option>
  //                   <option value="ACI">ACI</option>
  //                 </Form.Select>
  //               </Form.Group>
  //             </Col>
  //             <Col
  //               md={4}
  //               className="d-flex align-items-end justify-content-between"
  //             >
  //               <Button
  //                 variant="secondary"
  //                 onClick={() => {
  //                   setStatusFilter("All");
  //                   setSelectedRoleFilter("All");
  //                   setSelectedTimeFilter("All");
  //                   setSelectedDistrictFilter("All");
  //                 }}
  //               >
  //                 Clear Filter
  //               </Button>
  //               <Button variant="success" onClick={exportCSV}>
  //                 ⬇️ Export as CSV
  //               </Button>
  //             </Col>
  //           </>
  //         )}
  //       </Row>

  //       {isLoading ? (
  //         <div className="text-center">
  //           <Spinner animation="border" variant="primary" />
  //         </div>
  //       ) : attendanceSummary.length === 0 ? (
  //         <p>No records found.</p>
  //       ) : (
  //         <Table striped bordered hover responsive>
  //           <thead>
  //             <tr>
  //               <th>#</th>
  //               <th>Name</th>
  //               <th>Contact</th>
  //               <th>Reason for Manual Attendance</th>
  //               <th>Status</th>
  //               <th>Date</th>
  //               <th>Login Time</th>
  //               <th>Districts</th>
  //               <th>Centers</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {attendanceSummary.map((item, index) => {
  //               const districts =
  //                 item.access?.region?.map((r) => r.districtId) || [];
  //               const centers =
  //                 item.access?.region
  //                   ?.flatMap((r) => r.blockIds?.map((b) => b.blockId)) || [];
  //               const attendanceValue = item.attendance || "Absent";
  //               const statusColor =
  //                 attendanceValue === "Present"
  //                   ? "green"
  //                   : attendanceValue === "Absent"
  //                   ? "red"
  //                   : "orange";

  //               return (
  //                 <tr key={index}>
  //                   <td>{index + 1}</td>
  //                   <td>{item.user?.name}</td>
  //                   <td>{item.user?.contact1}</td>
  //                   <td>
  //                     <Form.Control
  //                       type="text"
  //                       placeholder="Enter reason"
  //                       value={remarkInputs[item.user?.userId] || ""}
  //                       onChange={(e) =>
  //                         setRemarkInputs({
  //                           ...remarkInputs,
  //                           [item.user?.userId]: e.target.value,
  //                         })
  //                       }
  //                     />
  //                   </td>
  //                   <td>
  //                     <Select
  //                       value={{
  //                         value: attendanceValue,
  //                         label: attendanceValue,
  //                       }}
  //                       options={statusOptions}
  //                       isDisabled={
  //                         !remarkInputs[item.user?.userId] ||
  //                         remarkInputs[item.user?.userId].trim() === ""
  //                       }
  //                       onMenuOpen={() => {
  //                         if (
  //                           !remarkInputs[item.user?.userId] ||
  //                           remarkInputs[item.user?.userId].trim() === ""
  //                         ) {
  //                           alert(
  //                             "Please enter a reason for manual attendance before updating."
  //                           );
  //                         }
  //                       }}
  //                       onChange={(selectedOption) =>
  //                         handleAttendanceUpdate(
  //                           selectedOption,
  //                           item.user?.userId
  //                         )
  //                       }
  //                       placeholder="Select Status"
  //                       styles={{
  //                         control: (provided) => ({
  //                           ...provided,
  //                           minWidth: 150,
  //                           color: statusColor,
  //                           fontWeight: "bold",
  //                         }),
  //                         singleValue: (provided) => ({
  //                           ...provided,
  //                           color: statusColor,
  //                           fontWeight: "bold",
  //                         }),
  //                       }}
  //                     />
  //                   </td>
  //                   <td>
  //                     {item.date
  //                       ? new Date(item.date).toLocaleDateString()
  //                       : "N/A"}
  //                   </td>
  //                   <td>
  //                     {item.loginTime
  //                       ? new Date(item.loginTime).toLocaleTimeString("en-IN", {
  //                           hour: "numeric",
  //                           minute: "numeric",
  //                           second: "numeric",
  //                           hour12: true,
  //                         })
  //                       : "N/A"}
  //                   </td>
  //                   <td>{districts.join(", ")}</td>
  //                   <td>{centers.join(", ")}</td>
  //                 </tr>
  //               );
  //             })}
  //           </tbody>
  //         </Table>
  //       )}
  //     </div>
  //   );
  // };













// src/components/user/UserAttendanceDashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { Spinner, Table, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  getUserAttendanceSummaryData,
  patchUserAttendanceWithoutImage,
} from "../../service/userAttendance.services";

export const UserAttendanceDash = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("All");

  const [remarkInputs, setRemarkInputs] = useState({});







//--------------------------------------------------------------------------

const regions = userData?.userAccess?.region || [];
const allSchoolIds = regions.flatMap(region =>
  region.blockIds.flatMap(block =>
    block.schoolIds.map(school => school.schoolId)
  )
);

const allDistrictIds = regions.flatMap(region => 
  region.districtId
)

console.log(allDistrictIds)

//------------------------------------------------------------------------




  const fetchUserAttendanceSummaryData = async () => {
    if (!userData) return;

    let conditionalRoleToSearch;
    if (
      ["admin", "Community Incharge", "Community Manager", "Project Coordinator"].includes(
        userData?.role
      )
    ) {
      conditionalRoleToSearch = ["ACI", "CC"];
    } else if (userData?.role === "ACI") {
      conditionalRoleToSearch = ["CC"];
    }

    const payLoad = {
      roles: conditionalRoleToSearch,
      departments: ["Community"],
      districtIds: allDistrictIds || [],
      schoolIds: allSchoolIds || [],
      startDate,
      endDate,
    };

    try {
      setIsLoading(true);
      const response = await getUserAttendanceSummaryData(payLoad);
      let result = response?.data?.data || [];
      console.log(result);

      // Apply filters
      if (statusFilter !== "All") {
        result = result.filter((item) => item.attendance === statusFilter);
      }

      if (
        ["Community Incharge", "Community Manager", "Project Coordinator", "admin"].includes(
          userData?.role
        )
      ) {
        if (selectedRoleFilter !== "All") {
          result = result.filter(
            (item) => item.user?.role === selectedRoleFilter
          );
        }
      }

      if (selectedTimeFilter !== "All") {
        const [hour, minute] = selectedTimeFilter.split(":").map(Number);
        const threshold = new Date(startDate);
        threshold.setHours(hour, minute, 0, 0);

        result = result.filter((item) => {
          if (!item.loginTime) return false;
          return new Date(item.loginTime) > threshold;
        });
      }

      if (selectedDistrictFilter !== "All") {
        result = result.filter((item) => {
          const districts =
            item.regionDetails?.map((r) => r.districtName) || [];
          return districts.includes(selectedDistrictFilter);
        });
      }

      setAttendanceSummary(result);

      // Prefill remarks in state
      const initialRemarks = {};
      result.forEach((item) => {
        if (item.user?.userId) {
          initialRemarks[item.user.userId] =
            item.remarkForManualAttendance || "";
        }
      });
      setRemarkInputs(initialRemarks);
    } catch (error) {
      console.log("Error getting data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAttendanceSummaryData();
  }, [startDate, endDate, statusFilter, selectedRoleFilter, selectedTimeFilter, selectedDistrictFilter]);

  const handleAttendanceUpdate = async (selectedOption, userId) => {
    if (!remarkInputs[userId] || remarkInputs[userId].trim() === "") {
      alert("Please enter a reason for manual attendance before updating.");
      return;
    }

    const queryParams = { userId, date: startDate };
    const payLoad = {
      attendance: selectedOption.value,
      attendanceMarkedBy: userData?.userId || "unknown",
      attendanceType: "Leave",
      visitingLocation: "NA",
      remarkForManualAttendance: remarkInputs[userId],
    };

    try {
      await patchUserAttendanceWithoutImage(queryParams, payLoad);
      setAttendanceSummary((prev) =>
        prev.map((item) =>
          item.user?.userId === userId
            ? {
                ...item,
                attendance: selectedOption.value,
                remarkForManualAttendance: remarkInputs[userId],
              }
            : item
        )
      );
    } catch (error) {
      console.error("❌ Patch Error:", error.message);
      alert("Attendance has not been initiated in db. Contact office!");
    }
  };

  const exportCSV = () => {
    const headers = [
      "#",
      "Name",
      "Contact",
      "Reason for Manual Attendance",
      "Status",
      "Date",
      "Login Time",
      "Districts",
      "Centers",
    ];
    const rows = attendanceSummary.map((item, index) => {
      const districtNames = [
        ...new Set(item.regionDetails?.map((r) => r.districtName)?.filter(Boolean) || []),
      ];
      const centerNames =
        item.regionDetails?.map((r) => r.centerName)?.filter(Boolean) || [];

      return [
        index + 1,
        item.user?.name || "",
        item.user?.contact1 || "",
        item.remarkForManualAttendance || "",
        item.attendance || "Absent",
        item.date ? new Date(item.date).toLocaleDateString() : "N/A",
        item.loginTime
          ? new Date(item.loginTime).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })
          : "N/A",
        `${districtNames.join(", ")}`,
        `${centerNames.join(", ")}`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Attendance_${startDate}_to_${endDate}.csv`
    );
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusOptions = [
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
    { value: "National Holiday", label: "National Holiday" },
    { value: "Festival Off", label: "Festival Off" },
       
    { value: "WFH", label: "WFH" },
    { value: "Comp-off", label: "Comp-off" },
    { value: "Monthly Leave", label: "Monthly Leave" },
    { value: "Half Day", label: "Half Day" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Leave Without Pay", label: "Leave Without Pay" },
    { value: "Resigned", label: "Resigned " },
  ];

  // ✅ Unique district names
  const allDistricts = [
    ...new Set(
      attendanceSummary.flatMap((item) =>
        item.regionDetails?.map((r) => r.districtName) || []
      )
    ),
  ].filter(Boolean);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Attendance Summary</h4>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>📅 Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>📅 End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>✅ Attendance Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="National Holidat">National Holidat</option>
              <option value="Festival Off">Festival Off</option>
               <option value="Festival Off">Festival Off</option>
              <option value="WFH">WFH</option>
              <option value="Comp-off">Comp-off</option>
              <option value="Monthly Leave">Monthly Leave</option>
              <option value="Half Day">Half Day</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Leave Without Pay">Leave Without Pay</option>
              <option value="Resigned">Resigned </option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>🏢 Filter by District</Form.Label>
            <Form.Select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
            >
              <option value="All">All</option>
              {allDistricts.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>🕐 Login After</Form.Label>
            <Form.Select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="07:30">After 7:30 AM</option>
              <option value="08:00">After 8:00 AM</option>
              <option value="08:30">After 8:30 AM</option>
              <option value="09:00">After 9:00 AM</option>
              <option value="09:30">After 9:30 AM</option>
              <option value="10:00">After 10:00 AM</option>
              <option value="10:30">After 10:30 AM</option>
              <option value="11:00">After 11:00 AM</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {["Community Incharge", "Community Manager", "Project Coordinator", "admin"].includes(
          userData?.role
        ) && (
          <>
            <Col md={4}>
              <Form.Group>
                <Form.Label>👤 Filter by Role</Form.Label>
                <Form.Select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="CC">CC</option>
                  <option value="ACI">ACI</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col
              md={4}
              className="d-flex align-items-end justify-content-between"
            >
              <Button
                variant="secondary"
                onClick={() => {
                  setStatusFilter("All");
                  setSelectedRoleFilter("All");
                  setSelectedTimeFilter("All");
                  setSelectedDistrictFilter("All");
                }}
              >
                Clear Filter
              </Button>
              <Button variant="success" onClick={exportCSV}>
                ⬇️ Export as CSV
              </Button>
            </Col>
          </>
        )}
      </Row>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : attendanceSummary.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Reason for Manual Attendance</th>
              <th>Status</th>
              <th>Date</th>
              <th>Login Time</th>
              <th>Districts</th>
              <th>Centers</th>
            </tr>
          </thead>
          <tbody>
            {attendanceSummary.map((item, index) => {
              const districtNames = [
                ...new Set(item.regionDetails?.map((r) => r.districtName) || []),
              ];
              const centerNames =
                item.regionDetails?.map((r) => r.centerName) || [];

              const attendanceValue = item.attendance || "Absent";
              const statusColor =
                attendanceValue === "Present"
                  ? "green"
                  : attendanceValue === "Absent"
                  ? "red"
                  : "orange";

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.user?.name}</td>
                  <td>{item.user?.contact1}</td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="Enter reason"
                      value={remarkInputs[item.user?.userId] || ""}
                      onChange={(e) =>
                        setRemarkInputs({
                          ...remarkInputs,
                          [item.user?.userId]: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Select
                      value={{
                        value: attendanceValue,
                        label: attendanceValue,
                      }}
                      options={statusOptions}
                      isDisabled={
                        !remarkInputs[item.user?.userId] ||
                        remarkInputs[item.user?.userId].trim() === ""
                      }
                      onMenuOpen={() => {
                        if (
                          !remarkInputs[item.user?.userId] ||
                          remarkInputs[item.user?.userId].trim() === ""
                        ) {
                          alert(
                            "Please enter a reason for manual attendance before updating."
                          );
                        }
                      }}
                      onChange={(selectedOption) =>
                        handleAttendanceUpdate(
                          selectedOption,
                          item.user?.userId
                        )
                      }
                      placeholder="Select Status"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: 150,
                          color: statusColor,
                          fontWeight: "bold",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: statusColor,
                          fontWeight: "bold",
                        }),
                      }}
                    />
                  </td>
                  <td>
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {item.loginTime
                      ? new Date(item.loginTime).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td>{districtNames.join(", ")}</td>
                  <td>{centerNames.join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};
