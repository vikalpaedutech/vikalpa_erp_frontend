// import React, {useEffect, useContext, useState} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { UserAttendanceDashboard, MarkUserAttendance } from "../../service/User.service";

// export const UserAttendanceDashboardV2 = () =>{
// const { userData } = useContext(UserContext);

// console.log(userData)

//     return(
//         <>
//         hello
//         </>
//     )
// }



// import React, { useEffect, useContext, useState, useMemo, useCallback } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { UserAttendanceDashboard, MarkUserAttendanceManually } from "../../service/User.service";
// import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
// import Select from 'react-select';
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export const UserAttendanceDashboardV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  

//   console.log(userData)
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [markingAttendance, setMarkingAttendance] = useState(null);
//   const [viewMode, setViewMode] = useState('table');
//   const [filters, setFilters] = useState({
//     date: null,
//     role: null,
//     region: null,
//     attendanceStatus: ""
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [attendanceFormData, setAttendanceFormData] = useState({});

//   const [regionOptions, setRegionOptions] = useState([]);
//   const [roleOptions, setRoleOptions] = useState([]);

//   // Get current date string
//   const getCurrentDate = useCallback(() => {
//     return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
//   }, [filters.date, startDate]);

//   // Determine role filter based on user role
//   const getRoleFilter = useCallback(() => {
//     if (userData?.role === 'ACI') {
//       return "CC";
//     } else if (userData?.role === 'Community Manager') {
//       return ["CC", "ACI"];
//     }
//     return undefined;
//   }, [userData]);

//   // Sort users by name alphabetically
//   const sortUsersByName = useCallback((users) => {
//     return [...users].sort((a, b) => a.name?.localeCompare(b.name));
//   }, []);



//   const getSchoolIdsFromUserAccess = (userData) => {
//   const schoolIds = [];
  
//   if (userData?.userAccess?.region) {
//     userData.userAccess.region.forEach(district => {
//       district.blockIds?.forEach(block => {
//         block.schoolIds?.forEach(school => {
//           if (school.schoolId) {
//             schoolIds.push(school.schoolId);
//           }
//         });
//       });
//     });
//   }
  
//   return schoolIds;
// };
//   // Fetch dashboard data
//   const fetchAttendanceData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const roleFilter = getRoleFilter();
//       const currentDate = getCurrentDate();
//       console.log(startDate)

//          // Get school IDs from user access
//     const schoolIds = getSchoolIdsFromUserAccess(userData);

//       const reqBody = {
//         date: startDate || currentDate,
//         role: roleFilter,
//         schoolIds: schoolIds
//       };
      
//       const response = await UserAttendanceDashboard(reqBody);
//       if (response.status === "Ok") {
//         const sortedData = sortUsersByName(response.data);
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         // Extract unique roles for role filter
//         const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
//         setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
//         // Extract unique regions
//         const allRegions = [];
//         sortedData.forEach(user => {
//           if (user.role === 'CC') {
//             user.schoolsData?.forEach(school => {
//               allRegions.push({
//                 value: school.schoolId,
//                 label: school.schoolName,
//                 type: 'school'
//               });
//             });
//           } else if (user.role === 'ACI') {
//             const uniqueDistricts = [...new Set(user.schoolsData?.map(school => school.districtName))];
//             uniqueDistricts.forEach(district => {
//               if (district) {
//                 allRegions.push({
//                   value: district,
//                   label: district,
//                   type: 'district'
//                 });
//               }
//             });
//           }
//         });
//         const uniqueRegions = Array.from(new Map(allRegions.map(item => [item.value, item])).values());
//         setRegionOptions(uniqueRegions);
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       setErrorMessage("Failed to fetch attendance data");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [getRoleFilter, getCurrentDate, sortUsersByName]);

//   // Handle date change from SingleDatePicker
//   const handleDateChange = (dateObj) => {
//     if (dateObj && dateObj.YYYYMMDD) {
//       setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
//       // Also update the global context if needed
//       if (setStartDate) {
//         setStartDate(dateObj);
//       }
//     }
//   };

//   // Apply filters and maintain sorting
//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     // Role filter
//     if (filters.role) {
//       filtered = filtered.filter(user => user.role === filters.role.value);
//     }
    
//     // Region filter
//     if (filters.region) {
//       filtered = filtered.filter(user => {
//         if (user.role === 'CC') {
//           return user.schoolsData?.some(school => 
//             school.schoolName === filters.region.label || school.schoolId === filters.region.value
//           );
//         } else if (user.role === 'ACI') {
//           return user.schoolsData?.some(school => 
//             school.districtName === filters.region.label
//           );
//         }
//         return false;
//       });
//     }
    
//     // Attendance status filter
//     if (filters.attendanceStatus) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const status = currentAttendance?.attendance || "Not Marked";
//         return status === filters.attendanceStatus;
//       });
//     }
    
//     // Always maintain alphabetical order
//     setFilteredData(sortUsersByName(filtered));
//   }, [filters.role, filters.region, filters.attendanceStatus, attendanceData, sortUsersByName]);

//   // Validate if attendance can be marked
//   const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
//     if (!attendanceStatus) return false;
    
//     if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
//       return false;
//     }
    
//     return true;
//   }, []);

//   // Mark attendance instantly on select
//   const handleAttendanceChange = useCallback(async (user, attendanceStatus) => {
//     const formData = attendanceFormData[user._id] || {};
    
//     // Validate before marking
//     if (!canMarkAttendance(user, attendanceStatus, formData)) {
//       if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
//         setErrorMessage("Please enter visiting location for Field Visit");
//       } else if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
//         setErrorMessage("Please enter remark for Manual Attendance");
//       } else {
//         setErrorMessage("Please select valid attendance status");
//       }
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }
    
//     setMarkingAttendance(user._id);
//     try {
//       const currentDate = getCurrentDate();
      
//       const reqBody = {
//         _id: user._id,
//         userId: user.userId,
//         date: startDate || currentDate,
//         attendance: attendanceStatus,
//         attendanceType: formData.attendanceType || "Daily Attendance",
//         attendanceMarkedBy: userData?._id || "Admin",
//         loginTime: new Date().toISOString(),
//         logoutTime: new Date().toISOString(),
//         longitude: user.longitude || 0,
//         latitude: user.latitude || 0,
//         visitingLocation: formData.visitingLocation || null,
//         remarkForManualAttendance: formData.remarkForManualAttendance || null
//       };
      
//       const response = await MarkUserAttendanceManually(reqBody);
//       if (response.status === "Ok") {
//         // Update local state without page reload
//         const updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             // Update the user's attendance details
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               attendance: attendanceStatus,
//               attendanceType: formData.attendanceType || "Daily Attendance",
//               date: currentDate,
//               loginTime: new Date().toISOString(),
//               logoutTime: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         // Clear form data for this user
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         setSuccessMessage(`✅ Attendance marked as ${attendanceStatus} for ${user.name}`);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage("Failed to mark attendance");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setErrorMessage("Error marking attendance: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setMarkingAttendance(null);
//     }
//   }, [attendanceData, attendanceFormData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id]);

//   // Update attendance form data for a user
//   const updateAttendanceFormData = useCallback((userId, field, value) => {
//     setAttendanceFormData(prev => ({
//       ...prev,
//       [userId]: {
//         ...prev[userId],
//         [field]: value
//       }
//     }));
//   }, []);

//   // Reset filters
//   const resetFilters = useCallback(() => {
//     setFilters({
//       date: null,
//       role: null,
//       region: null,
//       attendanceStatus: ""
//     });
//     fetchAttendanceData();
//   }, [fetchAttendanceData]);

//   // Fetch data when date changes
//   useEffect(() => {
//     fetchAttendanceData();
//   }, [fetchAttendanceData, filters.date]);

//   // Get attendance badge
//   const getAttendanceBadge = useCallback((attendance) => {
//     switch(attendance) {
//       case 'Present': return <Badge bg="success">✅ Present</Badge>;
//       case 'Absent': return <Badge bg="danger">❌ Absent</Badge>;
//       case 'Half Day': return <Badge bg="warning" className="text-dark">⏳ Half Day</Badge>;
//       case 'WFH': return <Badge bg="info">🏠 WFH</Badge>;
//       case 'Comp-off': return <Badge bg="secondary">📅 Comp-off</Badge>;
//       case 'Monthly Leave': return <Badge bg="primary">📆 Monthly Leave</Badge>;
//       case 'Sick Leave': return <Badge bg="danger">🤒 Sick Leave</Badge>;
//       case 'LWP': return <Badge bg="dark">⚠️ LWP</Badge>;
//       default: return <Badge bg="secondary">⭕ Not Marked</Badge>;
//     }
//   }, []);

//   // Statistics
//   const totalUsers = filteredData.length;
//   const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
//   const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
//   const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

//   const attendanceStatusOptions = [
//     { value: "", label: "📊 All Status" },
//     { value: "Present", label: "✅ Present" },
//     { value: "Absent", label: "❌ Absent" },
//     { value: "Half Day", label: "⏳ Half Day" },
//     { value: "WFH", label: "🏠 WFH" },
//     { value: "Comp-off", label: "📅 Comp-off" },
//     { value: "Monthly Leave", label: "📆 Monthly Leave" },
//     { value: "Sick Leave", label: "🤒 Sick Leave" },
//     { value: "LWP", label: "⚠️ LWP" }
//   ];

//   const attendanceTypeOptions = [
//     { value: "Daily Attendance", label: "Daily Attendance" },
//     { value: "Field Visit", label: "Field Visit" },
//     { value: "Manual Attendance", label: "Manual Attendance" }
//   ];

//   // Card View Component
//   const CardView = useCallback(() => (
//     <Row className="g-3">
//       {filteredData.map((user, index) => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//         const formData = attendanceFormData[user._id] || {};
//         const isMarking = markingAttendance === user._id;
//         const isDisabled = isMarking || loading;
//         const canSubmit = canMarkAttendance(user, attendanceStatus, formData);
        
//         return (
//           <Col md={6} lg={4} key={user._id}>
//             <Card className="border-0 shadow-sm h-100">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-start mb-3">
//                   <div>
//                     <div className="d-flex align-items-center gap-2 mb-1">
//                       <Badge bg="secondary" className="px-2 py-1">#{index + 1}</Badge>
//                       <Badge bg="info">{user.role}</Badge>
//                     </div>
//                     <h6 className="mb-1 fw-bold">{user.name}</h6>
//                     <small className="text-muted">{user.userId}</small>
//                   </div>
//                   {getAttendanceBadge(attendanceStatus)}
//                 </div>
                
//                 <div className="mb-3">
//                   <small className="text-muted">🏫 Region:</small>
//                   <div className="small">
//                     {user.role === 'CC' 
//                       ? user.schoolsData?.map(s => s.schoolName).join(', ')
//                       : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <small className="text-muted">🕐 Last Login:</small>
//                   <div className="small">
//                     {currentAttendance?.loginTime 
//                       ? new Date(currentAttendance.loginTime).toLocaleString()
//                       : 'Not logged in'}
//                   </div>
//                 </div>
                
//                 <hr />
                
//                 <Form.Select 
//                   size="sm" 
//                   className="mb-2"
//                   value={formData.attendanceType || "Daily Attendance"}
//                   onChange={(e) => updateAttendanceFormData(user._id, 'attendanceType', e.target.value)}
//                   disabled={isDisabled}
//                 >
//                   {attendanceTypeOptions.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </Form.Select>
                
//                 {formData.attendanceType === "Field Visit" && (
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Enter visiting location *"
//                     className="mb-2"
//                     value={formData.visitingLocation || ""}
//                     onChange={(e) => updateAttendanceFormData(user._id, 'visitingLocation', e.target.value)}
//                     disabled={isDisabled}
//                     isInvalid={formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()}
//                   />
//                 )}
                
//                 {formData.attendanceType === "Manual Attendance" && (
//                   <Form.Control
//                     size="sm"
//                     as="textarea"
//                     rows={2}
//                     placeholder="Enter remark for manual attendance *"
//                     className="mb-2"
//                     value={formData.remarkForManualAttendance || ""}
//                     onChange={(e) => updateAttendanceFormData(user._id, 'remarkForManualAttendance', e.target.value)}
//                     disabled={isDisabled}
//                     isInvalid={formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()}
//                   />
//                 )}
                
//                 <Form.Select 
//                   size="sm"
//                   value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//                   onChange={(e) => handleAttendanceChange(user, e.target.value)}
//                   disabled={isDisabled || !canSubmit}
//                 >
//                   <option value="">📊 Select Attendance</option>
//                   <option value="Present">✅ Present</option>
//                   <option value="Absent">❌ Absent</option>
//                   <option value="Half Day">⏳ Half Day</option>
//                   <option value="WFH">🏠 WFH</option>
//                   <option value="Comp-off">📅 Comp-off</option>
//                   <option value="Monthly Leave">📆 Monthly Leave</option>
//                   <option value="Sick Leave">🤒 Sick Leave</option>
//                   <option value="LWP">⚠️ LWP</option>
//                 </Form.Select>
                
//                 {isMarking && <Spinner size="sm" className="mt-2" />}
//               </Card.Body>
//             </Card>
//           </Col>
//         );
//       })}
//     </Row>
//   ), [filteredData, attendanceFormData, markingAttendance, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge]);

//   // Table View Component
//   const TableView = useCallback(() => (
//     <div className="table-responsive">
//       <Table hover className="align-middle mb-0">
//         <thead className="bg-light">
//           <tr>
//             <th className="py-3">#</th>
//             <th className="py-3">👤 User</th>
//             <th className="py-3">🎭 Role</th>
//             <th className="py-3">🏫 Region</th>
//             <th className="py-3">📊 Attendance Status</th>
//             <th className="py-3">🕐 Login Time</th>
//             <th className="py-3">📝 Mark Attendance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="7" className="text-center py-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-2 text-muted">Loading attendance data...</p>
//               </td>
//             </tr>
//           ) : filteredData.length === 0 ? (
//             <tr>
//               <td colSpan="7" className="text-center py-5">
//                 <div className="text-muted">
//                   <FaClock size={50} className="mb-3 opacity-50" />
//                   <p>No attendance data found for the selected filters</p>
//                   <Button variant="outline-primary" size="sm" onClick={resetFilters}>
//                     Reset Filters
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((user, index) => {
//               const currentAttendance = user.userAttendanceDetails?.[0];
//               const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//               const formData = attendanceFormData[user._id] || {};
//               const isMarking = markingAttendance === user._id;
//               const isDisabled = isMarking || loading;
//               const canSubmit = canMarkAttendance(user, attendanceStatus, formData);
              
//               const getRegionInfo = () => {
//                 if (user.role === 'CC') {
//                   return user.schoolsData?.map(school => school.schoolName).join(', ') || 'N/A';
//                 } else if (user.role === 'ACI') {
//                   const uniqueDistricts = [...new Set(user.schoolsData?.map(school => school.districtName))];
//                   return uniqueDistricts.join(', ') || 'N/A';
//                 }
//                 return user.schoolsData?.map(s => s.schoolName).join(', ') || 'N/A';
//               };
              
//               return (
//                 <tr key={user._id} className="border-bottom">
//                   <td className="fw-bold">{index + 1}</td>
//                   <td>
//                     <div className="d-flex align-items-center">
//                       <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//                         <FaUserTag size={16} className="text-primary" />
//                       </div>
//                       <div>
//                         <div className="fw-semibold">{user.name}</div>
//                         <small className="text-muted">{user.userId}</small>
//                       </div>
//                     </div>
//                   </td>
//                   <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
//                   <td><small className="text-muted">{getRegionInfo()}</small></td>
//                   <td>{getAttendanceBadge(attendanceStatus)}</td>
//                   <td>
//                     {currentAttendance?.loginTime ? (
//                       <div>
//                         <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
//                         <br />
//                         <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
//                       </div>
//                     ) : '-'}
//                   </td>
//                   <td style={{ minWidth: '280px' }}>
//                     <div className="d-flex flex-column gap-2">
//                       <div className="d-flex gap-2">
//                         <Form.Select 
//                           size="sm" 
//                           style={{ width: '140px' }}
//                           value={formData.attendanceType || "Daily Attendance"}
//                           onChange={(e) => updateAttendanceFormData(user._id, 'attendanceType', e.target.value)}
//                           disabled={isDisabled}
//                         >
//                           {attendanceTypeOptions.map(opt => (
//                             <option key={opt.value} value={opt.value}>{opt.label}</option>
//                           ))}
//                         </Form.Select>
                        
//                         <Form.Select 
//                           size="sm"
//                           style={{ width: '140px' }}
//                           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//                           onChange={(e) => handleAttendanceChange(user, e.target.value)}
//                           disabled={isDisabled || !canSubmit}
//                         >
//                           <option value="">Select</option>
//                           <option value="Present">✅ Present</option>
//                           <option value="Absent">❌ Absent</option>
//                           <option value="Half Day">⏳ Half Day</option>
//                           <option value="WFH">🏠 WFH</option>
//                           <option value="Comp-off">📅 Comp-off</option>
//                           <option value="Monthly Leave">📆 Monthly Leave</option>
//                           <option value="Sick Leave">🤒 Sick Leave</option>
//                           <option value="LWP">⚠️ LWP</option>
//                         </Form.Select>
//                       </div>
                      
//                       {formData.attendanceType === "Field Visit" && (
//                         <Form.Control
//                           size="sm"
//                           type="text"
//                           placeholder="Visiting location *"
//                           value={formData.visitingLocation || ""}
//                           onChange={(e) => updateAttendanceFormData(user._id, 'visitingLocation', e.target.value)}
//                           disabled={isDisabled}
//                           isInvalid={formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()}
//                         />
//                       )}
                      
//                       {formData.attendanceType === "Manual Attendance" && (
//                         <Form.Control
//                           size="sm"
//                           type="text"
//                           placeholder="Remark *"
//                           value={formData.remarkForManualAttendance || ""}
//                           onChange={(e) => updateAttendanceFormData(user._id, 'remarkForManualAttendance', e.target.value)}
//                           disabled={isDisabled}
//                           isInvalid={formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()}
//                         />
//                       )}
                      
//                       {isMarking && <Spinner size="sm" />}
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [filteredData, loading, resetFilters, attendanceFormData, markingAttendance, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge]);

//   return (
//     <Container fluid className="px-4 py-4 bg-light min-vh-100">
//       {/* Success/Error Alerts */}
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           {successMessage}
//         </Alert>
//       )}
//       {errorMessage && (
//         <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
//           {errorMessage}
//         </Alert>
//       )}

//       {/* Header Section */}
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h1 className="display-6 fw-bold text-primary mb-2">
//                 📊 Attendance Dashboard
//               </h1>
//               <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
//             </div>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="outline-primary" 
//                 onClick={fetchAttendanceData}
//                 disabled={loading}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaSyncAlt /> Refresh
//               </Button>
//               <Button 
//                 variant="outline-info" 
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaDownload /> Export
//               </Button>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* Filters Row */}
//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCalendarAlt className="me-1" /> Date
//           </Form.Label>
//           <SingleDatePicker
//             selectedDate={startDate}
//             onDateChange={handleDateChange}
//             placeholderText="Select date"
//             className="w-100"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaUserTag className="me-1" /> Role
//           </Form.Label>
//           <Select
//             isClearable
//             options={roleOptions}
//             value={filters.role}
//             onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
//             placeholder="Select role..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> Region (School/District)
//           </Form.Label>
//           <Select
//             isClearable
//             options={regionOptions}
//             value={filters.region}
//             onChange={(option) => setFilters(prev => ({ ...prev, region: option }))}
//             placeholder="Select region..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaClock className="me-1" /> Attendance Status
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceStatusOptions}
//             value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
//             placeholder="Filter by status..."
//             className="react-select"
//           />
//         </Col>
//       </Row>

//       {/* Reset Filters Button Row */}
//       <Row className="mb-4">
//         <Col className="text-end">
//           <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
//             Clear All Filters
//           </Button>
//         </Col>
//       </Row>

//       {/* Statistics Cards */}
//       <Row className="mb-4 g-3">
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaUsers size={20} className="text-primary" />
//               </div>
//               <h4 className="mb-1 fw-bold">{totalUsers}</h4>
//               <small className="text-muted">Total Users</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaCheckCircle size={20} className="text-success" />
//               </div>
//               <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
//               <small className="text-muted">Present</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaTimesCircle size={20} className="text-danger" />
//               </div>
//               <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
//               <small className="text-muted">Absent</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaClock size={20} className="text-info" />
//               </div>
//               <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
//               <small className="text-muted">Attendance Rate</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* View Toggle */}
//       <div className="mb-3 d-flex justify-content-between align-items-center">
//         <div className="btn-group">
//           <Button 
//             variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('table')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaTable /> Table View
//           </Button>
//           <Button 
//             variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('card')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaThLarge /> Card View
//           </Button>
//         </div>
//         <small className="text-muted">
//           Showing {filteredData.length} of {attendanceData.length} users
//         </small>
//       </div>

//       {/* Main Content */}
//       {viewMode === 'table' ? <TableView /> : <CardView />}
//     </Container>
//   );
// };




// import React, { useEffect, useContext, useState, useMemo, useCallback } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { UserAttendanceDashboard, MarkUserAttendanceManually } from "../../service/User.service";
// import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
// import Select from 'react-select';
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { leaveApproval } from "../../service/User.service";
// // Separate Row Component for Table to prevent re-renders
// const TableRow = React.memo(({ user, index, attendanceFormData, markingAttendance, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isDisabled = isMarking || loading;
//   const canSubmit = canMarkAttendance(user, attendanceStatus, formData);
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Daily Attendance");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);
  
//   return (
//     <tr className="border-bottom">
//       <td className="fw-bold">{index + 1}</td>
//       <td>
//         <div className="d-flex align-items-center">
//           <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//             <FaUserTag size={16} className="text-primary" />
//           </div>
//           <div>
//             <div className="fw-semibold">{user.name}</div>
//           </div>
//         </div>
//       </td>
//       <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
//       <td>{getAttendanceBadge(attendanceStatus)}</td>
//       <td>
//         {currentAttendance?.loginTime ? (
//           <div>
//             <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
//             <br />
//             <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
//           </div>
//         ) : '-'}
//       </td>
//       <td style={{ minWidth: '280px' }}>
//         <div className="d-flex flex-column gap-2">
//           <div className="d-flex gap-2">
//             <Form.Select 
//               size="sm" 
//               style={{ width: '140px' }}
//               value={localAttendanceType}
//               onChange={(e) => setLocalAttendanceType(e.target.value)}
//               disabled={isDisabled}
//             >
//               <option value="Daily Attendance">Daily Attendance</option>
//               <option value="Field Visit">Field Visit</option>
//               <option value="Manual Attendance">Manual Attendance</option>
//               <option value="Leave">Leave</option>
//             </Form.Select>
            
//             <Form.Select 
//               size="sm"
//               style={{ width: '140px' }}
//               value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//               onChange={(e) => handleAttendanceChange(user, e.target.value, {
//                 attendanceType: localAttendanceType,
//                 visitingLocation: localVisitingLocation,
//                 remarkForManualAttendance: localRemark
//               })}
//               disabled={isDisabled || !canSubmit}
//             >
//               <option value="">Select</option>
//               <option value="Present">✅ Present</option>
//               <option value="Absent">❌ Absent</option>
//               <option value="Half Day">⏳ Half Day</option>
//               <option value="WFH">🏠 WFH</option>
//               <option value="Comp-off">📅 Comp-off</option>
//               <option value="Monthly Leave">📆 Monthly Leave</option>
//               <option value="Sick Leave">🤒 Sick Leave</option>
//               <option value="LWP">⚠️ LWP</option>
//             </Form.Select>
//           </div>
          
//           {localAttendanceType === "Field Visit" && (
//             <Form.Control
//               size="sm"
//               type="text"
//               placeholder="Visiting location *"
//               value={localVisitingLocation}
//               onChange={(e) => setLocalVisitingLocation(e.target.value)}
//               disabled={isDisabled}
//               isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//             />
//           )}
          
//           {localAttendanceType === "Manual Attendance" && (
//             <Form.Control
//               size="sm"
//               type="text"
//               placeholder="Remark *"
//               value={localRemark}
//               onChange={(e) => setLocalRemark(e.target.value)}
//               disabled={isDisabled}
//               isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//             />
//           )}
          
//           {isMarking && <Spinner size="sm" />}
//         </div>
//       </td>
//     </tr>
//   );
// });

// // Separate Card Component with better visibility
// const UserCard = React.memo(({ user, index, attendanceFormData, markingAttendance, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isDisabled = isMarking || loading;
//   const canSubmit = canMarkAttendance(user, attendanceStatus, formData);
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Daily Attendance");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);
  
//   // Get card border color based on attendance status
//   const getCardBorderClass = () => {
//     if (attendanceStatus === "Present") return "border-success";
//     if (attendanceStatus === "Absent") return "border-danger";
//     if (attendanceStatus === "Half Day") return "border-warning";
//     if (attendanceStatus === "WFH") return "border-info";
//     return "border-secondary";
//   };
  
//   return (
//     <Col md={6} lg={4} xl={3}>
//       <Card className={`border-2 shadow-lg h-100 ${getCardBorderClass()}`} style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
//         <Card.Header className={`bg-white py-3 border-bottom-2 ${getCardBorderClass()}`}>
//           <div className="d-flex justify-content-between align-items-start">
//             <div>
//               <div className="d-flex align-items-center gap-2 mb-2">
//                 <Badge bg="secondary" className="px-3 py-2 rounded-pill">#{index + 1}</Badge>
//                 <Badge bg="primary" className="px-3 py-2 rounded-pill">{user.role}</Badge>
//               </div>
//               <h5 className="mb-1 fw-bold text-dark">{user.name}</h5>
//             </div>
//             <div className="text-end">
//               {getAttendanceBadge(attendanceStatus)}
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="bg-light">
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaSchool className="text-primary" />
//               <small className="text-muted fw-bold">Region:</small>
//             </div>
//             <p className="mb-0 small fw-semibold text-dark bg-white p-2 rounded border">
//               {user.role === 'CC' 
//                 ? user.schoolsData?.map(s => s.schoolName).join(', ')
//                 : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
//             </p>
//           </div>
          
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaClock className="text-warning" />
//               <small className="text-muted fw-bold">Last Login:</small>
//             </div>
//             <p className="mb-0 small bg-white p-2 rounded border">
//               {currentAttendance?.loginTime 
//                 ? new Date(currentAttendance.loginTime).toLocaleString()
//                 : 'Not logged in'}
//             </p>
//           </div>
          
//           <hr className="my-3" />
          
//           <div className="mb-3">
//             <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
//             <Form.Select 
//               size="sm" 
//               value={localAttendanceType}
//               onChange={(e) => setLocalAttendanceType(e.target.value)}
//               disabled={isDisabled}
//               className="bg-white"
//             >
//               <option value="Daily Attendance">Daily Attendance</option>
//               <option value="Field Visit">Field Visit</option>
//               <option value="Manual Attendance">Manual Attendance</option>
//               <option value="Leave">Leave</option>
//             </Form.Select>
//           </div>
          
//           {localAttendanceType === "Field Visit" && (
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold small">Visiting Location <span className="text-danger">*</span></Form.Label>
//               <Form.Control
//                 size="sm"
//                 type="text"
//                 placeholder="Enter visiting location"
//                 value={localVisitingLocation}
//                 onChange={(e) => setLocalVisitingLocation(e.target.value)}
//                 disabled={isDisabled}
//                 isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//                 className="bg-white"
//               />
//               <Form.Control.Feedback type="invalid">
//                 Please enter visiting location
//               </Form.Control.Feedback>
//             </Form.Group>
//           )}
          
//           {localAttendanceType === "Manual Attendance" && (
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold small">Remark <span className="text-danger">*</span></Form.Label>
//               <Form.Control
//                 size="sm"
//                 as="textarea"
//                 rows={2}
//                 placeholder="Enter remark for manual attendance"
//                 value={localRemark}
//                 onChange={(e) => setLocalRemark(e.target.value)}
//                 disabled={isDisabled}
//                 isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//                 className="bg-white"
//               />
//               <Form.Control.Feedback type="invalid">
//                 Please enter remark
//               </Form.Control.Feedback>
//             </Form.Group>
//           )}
          
//           <Form.Group className="mb-2">
//             <Form.Label className="fw-semibold small">Mark Attendance</Form.Label>
//             <Form.Select 
//               size="sm"
//               value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//               onChange={(e) => handleAttendanceChange(user, e.target.value, {
//                 attendanceType: localAttendanceType,
//                 visitingLocation: localVisitingLocation,
//                 remarkForManualAttendance: localRemark
//               })}
//               disabled={isDisabled || !canSubmit}
//               className="bg-white"
//             >
//               <option value="">📊 Select Attendance</option>
//               <option value="Present">✅ Present</option>
//               <option value="Absent">❌ Absent</option>
//               <option value="Half Day">⏳ Half Day</option>
//               <option value="WFH">🏠 WFH</option>
//               <option value="Comp-off">📅 Comp-off</option>
//               <option value="Monthly Leave">📆 Monthly Leave</option>
//               <option value="Sick Leave">🤒 Sick Leave</option>
//               <option value="LWP">⚠️ LWP</option>
//             </Form.Select>
//           </Form.Group>
          
//           {isMarking && (
//             <div className="text-center mt-2">
//               <Spinner size="sm" animation="border" variant="primary" />
//               <span className="ms-2 small">Updating...</span>
//             </div>
//           )}
//         </Card.Body>
//         <Card.Footer className="bg-white text-muted small py-2">
//           <div className="d-flex justify-content-between align-items-center">
//             {currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked" && (
//               <Badge bg="success" className="rounded-pill">Updated</Badge>
//             )}
//           </div>
//         </Card.Footer>
//       </Card>
//     </Col>
//   );
// });

// export const UserAttendanceDashboardV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [markingAttendance, setMarkingAttendance] = useState(null);
//   const [viewMode, setViewMode] = useState('table');
//   const [filters, setFilters] = useState({
//     date: null,
//     role: null,
//     district: null,
//     school: null,
//     attendanceType: "",
//     attendanceStatus: ""
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [attendanceFormData, setAttendanceFormData] = useState({});

//   const [roleOptions, setRoleOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);

//   const getCurrentDate = useCallback(() => {
//     return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
//   }, [filters.date, startDate]);

//   const getRoleFilter = useCallback(() => {
//     if (userData?.role === 'ACI') {
//       return "CC";
//     } else if (userData?.role === 'Community Manager') {
//       return ["CC", "ACI"];
//     }
//     return undefined;
//   }, [userData]);

//   const sortUsersByName = useCallback((users) => {
//     return [...users].sort((a, b) => a.name?.localeCompare(b.name));
//   }, []);

//   const getSchoolIdsFromUserAccess = useCallback((userData) => {
//     const schoolIds = [];
//     if (userData?.userAccess?.region) {
//       userData.userAccess.region.forEach(district => {
//         district.blockIds?.forEach(block => {
//           block.schoolIds?.forEach(school => {
//             if (school.schoolId) {
//               schoolIds.push(school.schoolId);
//             }
//           });
//         });
//       });
//     }
//     return schoolIds;
//   }, []);

//   const fetchAttendanceData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const roleFilter = getRoleFilter();
//       const currentDate = getCurrentDate();
//       const schoolIds = getSchoolIdsFromUserAccess(userData);

//       const reqBody = {
//         date: startDate || currentDate,
//         role: roleFilter,
//         schoolIds: schoolIds,
//         attendanceType: filters.attendanceType || undefined,
//         attendanceStatus: filters.attendanceStatus || undefined
//       };
      
//       const response = await UserAttendanceDashboard(reqBody);
//       if (response.status === "Ok") {
//         const sortedData = sortUsersByName(response.data);
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         // Set role options
//         const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
//         setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
//         // Set district options
//         const allDistricts = new Set();
//         sortedData.forEach(user => {
//           user.schoolsData?.forEach(school => {
//             if (school.districtName) {
//               allDistricts.add(school.districtName);
//             }
//           });
//         });
//         setDistrictOptions([...allDistricts].map(district => ({ 
//           value: district, 
//           label: district 
//         })));
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       setErrorMessage("Failed to fetch attendance data");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [getRoleFilter, getCurrentDate, sortUsersByName, getSchoolIdsFromUserAccess, userData, startDate, filters.attendanceType, filters.attendanceStatus]);

//   const handleDateChange = useCallback((dateObj) => {
//     if (dateObj && dateObj.YYYYMMDD) {
//       setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
//       if (setStartDate) {
//         setStartDate(dateObj);
//       }
//     }
//   }, [setStartDate]);

//   // Update school options when district is selected
//   useEffect(() => {
//     if (filters.district) {
//       const allSchools = new Set();
//       attendanceData.forEach(user => {
//         user.schoolsData?.forEach(school => {
//           if (school.districtName === filters.district.value && school.schoolName) {
//             allSchools.add(school.schoolName);
//           }
//         });
//       });
//       setSchoolOptions([...allSchools].map(school => ({ 
//         value: school, 
//         label: school 
//       })));
//     } else {
//       setSchoolOptions([]);
//     }
//   }, [filters.district, attendanceData]);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     // Filter by role
//     if (filters.role) {
//       filtered = filtered.filter(user => user.role === filters.role.value);
//     }
    
//     // Filter by district
//     if (filters.district) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.districtName === filters.district.value)
//       );
//     }
    
//     // Filter by school
//     if (filters.school) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.schoolName === filters.school.value)
//       );
//     }
    
//     // Filter by attendance type
//     if (filters.attendanceType) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
//         return attendanceType === filters.attendanceType;
//       });
//     }
    
//     // Filter by attendance status
//     if (filters.attendanceStatus) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const status = currentAttendance?.attendance || "Not Marked";
//         return status === filters.attendanceStatus;
//       });
//     }
    
//     setFilteredData(sortUsersByName(filtered));
//   }, [filters.role, filters.district, filters.school, filters.attendanceType, filters.attendanceStatus, attendanceData, sortUsersByName]);

//   const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
//     if (!attendanceStatus) return false;
    
//     if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
//       return false;
//     }
    
//     return true;
//   }, []);

//   const handleAttendanceChange = useCallback(async (user, attendanceStatus, currentFormData) => {
//     if (!canMarkAttendance(user, attendanceStatus, currentFormData)) {
//       if (currentFormData.attendanceType === "Field Visit" && !currentFormData.visitingLocation?.trim()) {
//         setErrorMessage("Please enter visiting location for Field Visit");
//       } else if (currentFormData.attendanceType === "Manual Attendance" && !currentFormData.remarkForManualAttendance?.trim()) {
//         setErrorMessage("Please enter remark for Manual Attendance");
//       } else {
//         setErrorMessage("Please select valid attendance status");
//       }
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }
    
//     setMarkingAttendance(user._id);
//     try {
//       const currentDate = getCurrentDate();
      
//       const reqBody = {
//         _id: user._id,
//         userId: user.userId,
//         date: startDate || currentDate,
//         attendance: attendanceStatus,
//         attendanceType: currentFormData.attendanceType || "Daily Attendance",
//         attendanceMarkedBy: userData?._id || "Admin",
//         loginTime: new Date().toISOString(),
//         logoutTime: new Date().toISOString(),
//         longitude: user.longitude || 0,
//         latitude: user.latitude || 0,
//         visitingLocation: currentFormData.visitingLocation || null,
//         remarkForManualAttendance: currentFormData.remarkForManualAttendance || null
//       };
      
//       const response = await MarkUserAttendanceManually(reqBody);
//       if (response.status === "Ok") {
//         const updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               attendance: attendanceStatus,
//               attendanceType: currentFormData.attendanceType || "Daily Attendance",
//               date: currentDate,
//               loginTime: new Date().toISOString(),
//               logoutTime: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         setSuccessMessage(`✅ Attendance marked as ${attendanceStatus} for ${user.name}`);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage("Failed to mark attendance");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setErrorMessage("Error marking attendance: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setMarkingAttendance(null);
//     }
//   }, [attendanceData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id, startDate]);

//   const updateAttendanceFormData = useCallback((userId, field, value) => {
//     setAttendanceFormData(prev => ({
//       ...prev,
//       [userId]: {
//         ...prev[userId],
//         [field]: value
//       }
//     }));
//   }, []);

//   const resetFilters = useCallback(() => {
//     setFilters({
//       date: null,
//       role: null,
//       district: null,
//       school: null,
//       attendanceType: "",
//       attendanceStatus: ""
//     });
//     setSchoolOptions([]);
//     fetchAttendanceData();
//   }, [fetchAttendanceData]);

//   useEffect(() => {
//     fetchAttendanceData();
//   }, [fetchAttendanceData, filters.date]);

//   const getAttendanceBadge = useCallback((attendance) => {
//     switch(attendance) {
//       case 'Present': return <Badge bg="success" className="px-3 py-2 rounded-pill">✅ Present</Badge>;
//       case 'Absent': return <Badge bg="danger" className="px-3 py-2 rounded-pill">❌ Absent</Badge>;
//       case 'Half Day': return <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill">⏳ Half Day</Badge>;
//       case 'WFH': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏠 WFH</Badge>;
//       case 'Comp-off': return <Badge bg="secondary" className="px-3 py-2 rounded-pill">📅 Comp-off</Badge>;
//       case 'Monthly Leave': return <Badge bg="primary" className="px-3 py-2 rounded-pill">📆 Monthly Leave</Badge>;
//       case 'Sick Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🤒 Sick Leave</Badge>;
//       case 'LWP': return <Badge bg="dark" className="px-3 py-2 rounded-pill">⚠️ LWP</Badge>;
//       default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">⭕ Not Marked</Badge>;
//     }
//   }, []);

//   const totalUsers = filteredData.length;
//   const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
//   const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
//   const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

//   const attendanceStatusOptions = [
//     { value: "", label: "📊 All Status" },
//     { value: "Present", label: "✅ Present" },
//     { value: "Absent", label: "❌ Absent" },
//     { value: "Half Day", label: "⏳ Half Day" },
//     { value: "WFH", label: "🏠 WFH" },
//     { value: "Comp-off", label: "📅 Comp-off" },
//     { value: "Monthly Leave", label: "📆 Monthly Leave" },
//     { value: "Sick Leave", label: "🤒 Sick Leave" },
//     { value: "LWP", label: "⚠️ LWP" }
//   ];

//   const attendanceTypeOptions = [
//     { value: "", label: "📊 All Types" },
//     { value: "Daily Attendance", label: "📋 Daily Attendance" },
//     { value: "Field Visit", label: "📍 Field Visit" },
//     { value: "Manual Attendance", label: "✍️ Manual Attendance" },
//     { value: "Leave", label: "🏖️ Leave" }
//   ];

//   const TableView = useMemo(() => (
//     <div className="table-responsive" style={{ overflowX: 'auto' }}>
//       <Table hover className="align-middle mb-0" style={{ minWidth: '800px' }}>
//         <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//           <tr>
//             <th className="py-3" style={{ width: '60px' }}>#</th>
//             <th className="py-3" style={{ width: '200px' }}>👤 User</th>
//             <th className="py-3" style={{ width: '100px' }}>🎭 Role</th>
//             <th className="py-3" style={{ width: '120px' }}>📊 Status</th>
//             <th className="py-3" style={{ width: '120px' }}>🕐 Login Time</th>
//             <th className="py-3" style={{ width: '320px' }}>📝 Mark Attendance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-2 text-muted">Loading attendance data...</p>
//               </td>
//             </tr>
//           ) : filteredData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <div className="text-muted">
//                   <FaClock size={50} className="mb-3 opacity-50" />
//                   <p>No attendance data found for the selected filters</p>
//                   <Button variant="outline-primary" size="sm" onClick={resetFilters}>
//                     Reset Filters
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((user, index) => (
//               <TableRow
//                 key={user._id}
//                 user={user}
//                 index={index}
//                 attendanceFormData={attendanceFormData}
//                 markingAttendance={markingAttendance}
//                 loading={loading}
//                 updateAttendanceFormData={updateAttendanceFormData}
//                 handleAttendanceChange={handleAttendanceChange}
//                 canMarkAttendance={canMarkAttendance}
//                 getAttendanceBadge={getAttendanceBadge}
//               />
//             ))
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [filteredData, loading, attendanceFormData, markingAttendance, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, resetFilters]);

//   const CardView = useMemo(() => (
//     <Row className="g-4">
//       {filteredData.length === 0 ? (
//         <Col xs={12}>
//           <div className="text-center py-5">
//             <FaClock size={50} className="mb-3 opacity-50" />
//             <p className="text-muted">No users found</p>
//           </div>
//         </Col>
//       ) : (
//         filteredData.map((user, index) => (
//           <UserCard
//             key={user._id}
//             user={user}
//             index={index}
//             attendanceFormData={attendanceFormData}
//             markingAttendance={markingAttendance}
//             loading={loading}
//             updateAttendanceFormData={updateAttendanceFormData}
//             handleAttendanceChange={handleAttendanceChange}
//             canMarkAttendance={canMarkAttendance}
//             getAttendanceBadge={getAttendanceBadge}
//           />
//         ))
//       )}
//     </Row>
//   ), [filteredData, attendanceFormData, markingAttendance, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge]);

//   return (
//     <Container fluid className="px-4 py-4 bg-light min-vh-100">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           {successMessage}
//         </Alert>
//       )}
//       {errorMessage && (
//         <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
//           {errorMessage}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h1 className="display-6 fw-bold text-primary mb-2">
//                 📊 Attendance Dashboard
//               </h1>
//               <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
//             </div>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="outline-primary" 
//                 onClick={fetchAttendanceData}
//                 disabled={loading}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaSyncAlt /> Refresh
//               </Button>
//               <Button 
//                 variant="outline-info" 
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaDownload /> Export
//               </Button>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCalendarAlt className="me-1" /> Date
//           </Form.Label>
//           <SingleDatePicker
//             selectedDate={startDate}
//             onDateChange={handleDateChange}
//             placeholderText="Select date"
//             className="w-100"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaUserTag className="me-1" /> Role
//           </Form.Label>
//           <Select
//             isClearable
//             options={roleOptions}
//             value={filters.role}
//             onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
//             placeholder="Select role..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> District
//           </Form.Label>
//           <Select
//             isClearable
//             options={districtOptions}
//             value={filters.district}
//             onChange={(option) => {
//               setFilters(prev => ({ 
//                 ...prev, 
//                 district: option,
//                 school: null // Reset school when district changes
//               }));
//             }}
//             placeholder="Select district..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> School
//           </Form.Label>
//           <Select
//             isClearable
//             options={schoolOptions}
//             value={filters.school}
//             onChange={(option) => setFilters(prev => ({ ...prev, school: option }))}
//             placeholder="Select school..."
//             className="react-select"
//             isDisabled={!filters.district}
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaClock className="me-1" /> Attendance Type
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceTypeOptions}
//             value={attendanceTypeOptions.find(opt => opt.value === filters.attendanceType)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceType: option?.value || "" }))}
//             placeholder="Filter by type..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCheckCircle className="me-1" /> Attendance Status
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceStatusOptions}
//             value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
//             placeholder="Filter by status..."
//             className="react-select"
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col className="text-end">
//           <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
//             Clear All Filters
//           </Button>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaUsers size={20} className="text-primary" />
//               </div>
//               <h4 className="mb-1 fw-bold">{totalUsers}</h4>
//               <small className="text-muted">Total Users</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaCheckCircle size={20} className="text-success" />
//               </div>
//               <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
//               <small className="text-muted">Present</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaTimesCircle size={20} className="text-danger" />
//               </div>
//               <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
//               <small className="text-muted">Absent</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaClock size={20} className="text-info" />
//               </div>
//               <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
//               <small className="text-muted">Attendance Rate</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <div className="mb-3 d-flex justify-content-between align-items-center">
//         <div className="btn-group">
//           <Button 
//             variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('table')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaTable /> Table View
//           </Button>
//           <Button 
//             variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('card')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaThLarge /> Card View
//           </Button>
//         </div>
//         <small className="text-muted">
//           Showing {filteredData.length} of {attendanceData.length} users
//         </small>
//       </div>

//       {viewMode === 'table' ? TableView : CardView}
//     </Container>
//   );
// };

















// import React, { useEffect, useContext, useState, useMemo, useCallback } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { UserAttendanceDashboard, MarkUserAttendanceManually, leaveApproval } from "../../service/User.service";
// import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
// import Select from 'react-select';
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Separate Row Component for Table to prevent re-renders
// const TableRow = React.memo(({ 
//   user, 
//   index, 
//   attendanceFormData, 
//   markingAttendance, 
//   loading, 
//   updateAttendanceFormData, 
//   handleAttendanceChange, 
//   canMarkAttendance, 
//   getAttendanceBadge,
//   handleLeaveApproval,
//   approvingLeave
// }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isApproving = approvingLeave === user._id;
//   const isDisabled = isMarking || isApproving || loading;
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
//   const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
//   const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localLeaveStatus !== formData.leaveStatus) {
//         updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localApprovalRemark !== formData.approvalRemark) {
//         updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
//   // Check if this is a leave attendance
//   const isExistingLeave = attendanceType === "Leave" && currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveApproved = currentAttendance?.isLeaveApproved;
//   const isLeaveMarked = currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked";

//   // Check if user is trying to select Leave (local state)
//   const isLeaveSelected = localAttendanceType === "Leave";

//   const getLeaveStatusBadge = () => {
//     if (isLeaveApproved === true) {
//       return <Badge bg="success" className="px-2 py-1">✅ Approved</Badge>;
//     } else if (isLeaveApproved === false) {
//       return <Badge bg="danger" className="px-2 py-1">❌ Rejected</Badge>;
//     } else if (isLeaveMarked) {
//       return <Badge bg="warning" className="text-dark px-2 py-1">⏳ Pending</Badge>;
//     } else {
//       return null;
//     }
//   };

//   // Get attendance options based on attendance type
//   const getAttendanceOptions = () => {
//     if (localAttendanceType === "Manual Attendance") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Field Visit") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Leave") {
//       // If this is an existing leave with approval status, show the status
//       if (isExistingLeave && isLeaveApproved !== null) {
//         return (
//           <Form.Select 
//             size="sm"
//             style={{ width: '140px' }}
//             value={attendanceStatus}
//             disabled={true}
//           >
//             <option value={attendanceStatus}>{attendanceStatus}</option>
//           </Form.Select>
//         );
//       }
      
//       // For new leave selection
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={localLeaveStatus || ""}
//           onChange={(e) => setLocalLeaveStatus(e.target.value)}
//           disabled={isDisabled}
//         >
//           <option value="">Select Leave Type</option>
//           <option value="Emergency Leave">🚨 Emergency Leave</option>
//            <option value="LWP">LWP</option>
//           <option value="Absent">🏖️ Absent</option>
//           <option value="WFH">🏠 WFH</option>
//           <option value="Comp-off">📅 Comp-off</option>
//           <option value="Medical Leave">🏥 Medical Leave</option>
//           <option value="Sick Leave">🤒 Sick Leave</option>
//           <option value="Half Day">⏳ Half Day</option>
//         </Form.Select>
//       );
//     }
//     return null;
//   };

//   return (
//     <tr className="border-bottom">
//       <td className="fw-bold">{index + 1}</td>
//       <td>
//         <div className="d-flex align-items-center">
//           <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//             <FaUserTag size={16} className="text-primary" />
//           </div>
//           <div>
//             <div className="fw-semibold">{user.name}</div>
//             {isExistingLeave && isLeaveMarked && (
//               <div className="mt-1">
//                 {getLeaveStatusBadge()}
//               </div>
//             )}
//           </div>
//         </div>
//       </td>
//       <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
//       <td>{getAttendanceBadge(attendanceStatus)}</td>
//       <td>
//         {currentAttendance?.loginTime ? (
//           <div>
//             <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
//             <br />
//             <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
//           </div>
//         ) : '-'}
//       </td>
//       <td style={{ minWidth: '320px' }}>
//         <div className="d-flex flex-column gap-2">
//           <div className="d-flex gap-2">
//             <Form.Select 
//               size="sm" 
//               style={{ width: '140px' }}
//               value={localAttendanceType}
//               onChange={(e) => {
//                 const newType = e.target.value;
//                 setLocalAttendanceType(newType);
//                 // Reset leave status when switching away from Leave
//                 if (newType !== "Leave") {
//                   setLocalLeaveStatus("");
//                   setLocalApprovalRemark("");
//                 }
//               }}
//               disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//             >
//               <option value="Manual Attendance">Manual Attendance</option>
//               <option value="Field Visit">Field Visit</option>
//               <option value="Leave">Leave</option>
//             </Form.Select>
            
//             {getAttendanceOptions()}
//           </div>
          
//           {localAttendanceType === "Field Visit" && (
//             <Form.Control
//               size="sm"
//               type="text"
//               placeholder="Visiting location *"
//               value={localVisitingLocation}
//               onChange={(e) => setLocalVisitingLocation(e.target.value)}
//               disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//               isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//             />
//           )}
          
//           {localAttendanceType === "Manual Attendance" && (
//             <Form.Control
//               size="sm"
//               type="text"
//               placeholder="Remark *"
//               value={localRemark}
//               onChange={(e) => setLocalRemark(e.target.value)}
//               disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//               isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//             />
//           )}
          
//           {/* For NEW Leave - show approval remark and submit button */}
//           {localAttendanceType === "Leave" && !isExistingLeave && (
//             <>
//               <Form.Control
//                 size="sm"
//                 type="text"
//                 placeholder="Approval remark *"
//                 value={localApprovalRemark}
//                 onChange={(e) => setLocalApprovalRemark(e.target.value)}
//                 disabled={isDisabled}
//                 isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
//               />
//               {localLeaveStatus && localApprovalRemark.trim() && (
//                 <Button
//                   size="sm"
//                   variant="primary"
//                   onClick={() => {
//                     handleAttendanceChange(user, localLeaveStatus, {
//                       attendanceType: localAttendanceType,
//                       visitingLocation: localVisitingLocation,
//                       remarkForManualAttendance: localRemark,
//                       approvalRemark: localApprovalRemark
//                     });
//                   }}
//                   disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
//                   className="d-flex align-items-center justify-content-center gap-2"
//                 >
//                   {isMarking ? (
//                     <Spinner size="sm" />
//                   ) : (
//                     <FaCheck size={14} />
//                   )}
//                   Submit Leave
//                 </Button>
//               )}
//             </>
//           )}
          
//           {/* For EXISTING Leave - show status */}
//           {isExistingLeave && isLeaveApproved !== null && (
//             <div className="p-2 bg-white rounded border">
//               <small className="text-muted">
//                 {isLeaveApproved ? '✅ Approved' : '❌ Rejected'} 
//                 {currentAttendance?.approvalRemark && ` - ${currentAttendance.approvalRemark}`}
//               </small>
//             </div>
//           )}
          
//           {/* For EXISTING Leave with Pending status */}
//           {isExistingLeave && isLeaveApproved === null && (
//             <div className="p-2 bg-warning bg-opacity-10 rounded border border-warning">
//               <small className="text-warning">
//                 ⏳ Please approve attendance by filtering attendance type leave
//               </small>
//             </div>
//           )}
          
//           {isMarking && <Spinner size="sm" />}
//         </div>
//       </td>
//     </tr>
//   );
// });

// // Card Component - keeping it similar but compact
// const UserCard = React.memo(({ 
//   user, 
//   index, 
//   attendanceFormData, 
//   markingAttendance, 
//   loading, 
//   updateAttendanceFormData, 
//   handleAttendanceChange, 
//   canMarkAttendance, 
//   getAttendanceBadge,
//   handleLeaveApproval,
//   approvingLeave
// }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isApproving = approvingLeave === user._id;
//   const isDisabled = isMarking || isApproving || loading;
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
//   const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
//   const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localLeaveStatus !== formData.leaveStatus) {
//         updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localApprovalRemark !== formData.approvalRemark) {
//         updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
//   const isExistingLeave = attendanceType === "Leave" && currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveApproved = currentAttendance?.isLeaveApproved;
//   const isLeaveMarked = currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveSelected = localAttendanceType === "Leave";

//   const getCardBorderClass = () => {
//     if (attendanceStatus === "Present") return "border-success";
//     if (attendanceStatus === "Absent") return "border-danger";
//     if (attendanceStatus === "Half Day") return "border-warning";
//     if (attendanceStatus === "WFH") return "border-info";
//     return "border-secondary";
//   };

//   const getAttendanceOptions = () => {
//     if (localAttendanceType === "Manual Attendance") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//           className="bg-white"
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Field Visit") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//           className="bg-white"
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Leave") {
//       if (isExistingLeave && isLeaveApproved !== null) {
//         return (
//           <Form.Select 
//             size="sm"
//             value={attendanceStatus}
//             disabled={true}
//             className="bg-white"
//           >
//             <option value={attendanceStatus}>{attendanceStatus}</option>
//           </Form.Select>
//         );
//       }
//       return (
//         <Form.Select 
//           size="sm"
//           value={localLeaveStatus || ""}
//           onChange={(e) => setLocalLeaveStatus(e.target.value)}
//           disabled={isDisabled}
//           className="bg-white"
//         >
//           <option value="">Select Leave Type</option>
//           <option value="Emergency Leave">🚨 Emergency Leave</option>
//           <option value="Leave">🏖️ Leave</option>
//           <option value="WFH">🏠 WFH</option>
//           <option value="Comp-off">📅 Comp-off</option>
//           <option value="Medical Leave">🏥 Medical Leave</option>
//           <option value="Sick Leave">🤒 Sick Leave</option>
//           <option value="Half Day">⏳ Half Day</option>
//         </Form.Select>
//       );
//     }
//     return null;
//   };
  
//   return (
//     <Col md={6} lg={4} xl={3}>
//       <Card className={`border-2 shadow-lg h-100 ${getCardBorderClass()}`} style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
//         <Card.Header className={`bg-white py-3 border-bottom-2 ${getCardBorderClass()}`}>
//           <div className="d-flex justify-content-between align-items-start">
//             <div>
//               <div className="d-flex align-items-center gap-2 mb-2">
//                 <Badge bg="secondary" className="px-3 py-2 rounded-pill">#{index + 1}</Badge>
//                 <Badge bg="primary" className="px-3 py-2 rounded-pill">{user.role}</Badge>
//                 {isExistingLeave && isLeaveMarked && (
//                   <Badge bg={isLeaveApproved === true ? "success" : isLeaveApproved === false ? "danger" : "warning"} 
//                          className="px-2 py-1 rounded-pill">
//                     {isLeaveApproved === true ? "✅ Approved" : isLeaveApproved === false ? "❌ Rejected" : "⏳ Pending"}
//                   </Badge>
//                 )}
//               </div>
//               <h5 className="mb-1 fw-bold text-dark">{user.name}</h5>
//             </div>
//             <div className="text-end">
//               {getAttendanceBadge(attendanceStatus)}
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="bg-light">
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaSchool className="text-primary" />
//               <small className="text-muted fw-bold">Region:</small>
//             </div>
//             <p className="mb-0 small fw-semibold text-dark bg-white p-2 rounded border">
//               {user.role === 'CC' 
//                 ? user.schoolsData?.map(s => s.schoolName).join(', ')
//                 : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
//             </p>
//           </div>
          
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaClock className="text-warning" />
//               <small className="text-muted fw-bold">Last Login:</small>
//             </div>
//             <p className="mb-0 small bg-white p-2 rounded border">
//               {currentAttendance?.loginTime 
//                 ? new Date(currentAttendance.loginTime).toLocaleString()
//                 : 'Not logged in'}
//             </p>
//           </div>
          
//           <hr className="my-3" />
          
//           <div className="mb-3">
//             <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
//             <Form.Select 
//               size="sm" 
//               value={localAttendanceType}
//               onChange={(e) => {
//                 const newType = e.target.value;
//                 setLocalAttendanceType(newType);
//                 if (newType !== "Leave") {
//                   setLocalLeaveStatus("");
//                   setLocalApprovalRemark("");
//                 }
//               }}
//               disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//               className="bg-white"
//             >
//               <option value="Manual Attendance">Manual Attendance</option>
//               <option value="Field Visit">Field Visit</option>
//               <option value="Leave">Leave</option>
//             </Form.Select>
//           </div>
          
//           {localAttendanceType === "Field Visit" && (
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold small">Visiting Location <span className="text-danger">*</span></Form.Label>
//               <Form.Control
//                 size="sm"
//                 type="text"
//                 placeholder="Enter visiting location"
//                 value={localVisitingLocation}
//                 onChange={(e) => setLocalVisitingLocation(e.target.value)}
//                 disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//                 isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//                 className="bg-white"
//               />
//               <Form.Control.Feedback type="invalid">
//                 Please enter visiting location
//               </Form.Control.Feedback>
//             </Form.Group>
//           )}
          
//           {localAttendanceType === "Manual Attendance" && (
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold small">Remark <span className="text-danger">*</span></Form.Label>
//               <Form.Control
//                 size="sm"
//                 as="textarea"
//                 rows={2}
//                 placeholder="Enter remark"
//                 value={localRemark}
//                 onChange={(e) => setLocalRemark(e.target.value)}
//                 disabled={isDisabled || (isExistingLeave && isLeaveApproved !== null)}
//                 isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//                 className="bg-white"
//               />
//               <Form.Control.Feedback type="invalid">
//                 Please enter remark
//               </Form.Control.Feedback>
//             </Form.Group>
//           )}
          
//           {localAttendanceType === "Leave" && !isExistingLeave && (
//             <>
//               <Form.Group className="mb-3">
//                 <Form.Label className="fw-semibold small">Approval Remark <span className="text-danger">*</span></Form.Label>
//                 <Form.Control
//                   size="sm"
//                   type="text"
//                   placeholder="Enter approval remark"
//                   value={localApprovalRemark}
//                   onChange={(e) => setLocalApprovalRemark(e.target.value)}
//                   disabled={isDisabled}
//                   isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
//                   className="bg-white"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please enter approval remark
//                 </Form.Control.Feedback>
//               </Form.Group>
              
//               {localLeaveStatus && localApprovalRemark.trim() && (
//                 <Button
//                   size="sm"
//                   variant="primary"
//                   onClick={() => {
//                     handleAttendanceChange(user, localLeaveStatus, {
//                       attendanceType: localAttendanceType,
//                       visitingLocation: localVisitingLocation,
//                       remarkForManualAttendance: localRemark,
//                       approvalRemark: localApprovalRemark
//                     });
//                   }}
//                   disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
//                   className="w-100 d-flex align-items-center justify-content-center gap-2"
//                 >
//                   {isMarking ? (
//                     <Spinner size="sm" />
//                   ) : (
//                     <FaCheck size={14} />
//                   )}
//                   Submit Leave
//                 </Button>
//               )}
//             </>
//           )}
          
//           {isExistingLeave && isLeaveApproved !== null && (
//             <div className="mt-2 p-2 bg-white rounded border">
//               <small className="text-muted">
//                 {isLeaveApproved ? '✅ Approved' : '❌ Rejected'} 
//                 {currentAttendance?.approvalRemark && ` - ${currentAttendance.approvalRemark}`}
//               </small>
//             </div>
//           )}
          
//           {isExistingLeave && isLeaveApproved === null && (
//             <div className="mt-2 p-2 bg-warning bg-opacity-10 rounded border border-warning">
//               <small className="text-warning">
//                 ⏳ Please approve attendance by filtering attendance type leave
//               </small>
//             </div>
//           )}
          
//           <Form.Group className="mb-2">
//             <Form.Label className="fw-semibold small">Mark Attendance</Form.Label>
//             {getAttendanceOptions()}
//           </Form.Group>
          
//           {isMarking && (
//             <div className="text-center mt-2">
//               <Spinner size="sm" animation="border" variant="primary" />
//               <span className="ms-2 small">Updating...</span>
//             </div>
//           )}
//         </Card.Body>
//         <Card.Footer className="bg-white text-muted small py-2">
//           <div className="d-flex justify-content-between align-items-center">
//             {currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked" && (
//               <Badge bg="success" className="rounded-pill">Updated</Badge>
//             )}
//             {isExistingLeave && isLeaveApproved !== null && (
//               <Badge bg={isLeaveApproved ? "success" : "danger"} className="rounded-pill">
//                 {isLeaveApproved ? "Approved" : "Rejected"}
//               </Badge>
//             )}
//           </div>
//         </Card.Footer>
//       </Card>
//     </Col>
//   );
// });

// export const UserAttendanceDashboardV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [markingAttendance, setMarkingAttendance] = useState(null);
//   const [approvingLeave, setApprovingLeave] = useState(null);
//   const [viewMode, setViewMode] = useState('table');
//   const [filters, setFilters] = useState({
//     date: null,
//     role: null,
//     district: null,
//     school: null,
//     attendanceType: "",
//     attendanceStatus: ""
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [attendanceFormData, setAttendanceFormData] = useState({});

//   const [roleOptions, setRoleOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);

//   const getCurrentDate = useCallback(() => {
//     return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
//   }, [filters.date, startDate]);

//   const getRoleFilter = useCallback(() => {
//     if (userData?.role === 'ACI') {
//       return "CC";
//     } else if (userData?.role === 'Community Manager') {
//       return ["CC", "ACI"];
//     }
//     return undefined;
//   }, [userData]);

//   const sortUsersByName = useCallback((users) => {
//     return [...users].sort((a, b) => a.name?.localeCompare(b.name));
//   }, []);

//   const getSchoolIdsFromUserAccess = useCallback((userData) => {
//     const schoolIds = [];
//     if (userData?.userAccess?.region) {
//       userData.userAccess.region.forEach(district => {
//         district.blockIds?.forEach(block => {
//           block.schoolIds?.forEach(school => {
//             if (school.schoolId) {
//               schoolIds.push(school.schoolId);
//             }
//           });
//         });
//       });
//     }
//     return schoolIds;
//   }, []);

//   const fetchAttendanceData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const roleFilter = getRoleFilter();
//       const currentDate = getCurrentDate();
//       const schoolIds = getSchoolIdsFromUserAccess(userData);

//       const reqBody = {
//         date: startDate || currentDate,
//         role: roleFilter,
//         schoolIds: schoolIds,
//         attendanceType: filters.attendanceType || undefined,
//         attendanceStatus: filters.attendanceStatus || undefined
//       };
      
//       const response = await UserAttendanceDashboard(reqBody);
//       if (response.status === "Ok") {
//         const sortedData = sortUsersByName(response.data);
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
//         setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
//         const allDistricts = new Set();
//         sortedData.forEach(user => {
//           user.schoolsData?.forEach(school => {
//             if (school.districtName) {
//               allDistricts.add(school.districtName);
//             }
//           });
//         });
//         setDistrictOptions([...allDistricts].map(district => ({ 
//           value: district, 
//           label: district 
//         })));
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       setErrorMessage("Failed to fetch attendance data");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [getRoleFilter, getCurrentDate, sortUsersByName, getSchoolIdsFromUserAccess, userData, startDate, filters.attendanceType, filters.attendanceStatus]);

//   const handleDateChange = useCallback((dateObj) => {
//     if (dateObj && dateObj.YYYYMMDD) {
//       setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
//       if (setStartDate) {
//         setStartDate(dateObj);
//       }
//     }
//   }, [setStartDate]);

//   useEffect(() => {
//     if (filters.district) {
//       const allSchools = new Set();
//       attendanceData.forEach(user => {
//         user.schoolsData?.forEach(school => {
//           if (school.districtName === filters.district.value && school.schoolName) {
//             allSchools.add(school.schoolName);
//           }
//         });
//       });
//       setSchoolOptions([...allSchools].map(school => ({ 
//         value: school, 
//         label: school 
//       })));
//     } else {
//       setSchoolOptions([]);
//     }
//   }, [filters.district, attendanceData]);

//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     if (filters.role) {
//       filtered = filtered.filter(user => user.role === filters.role.value);
//     }
    
//     if (filters.district) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.districtName === filters.district.value)
//       );
//     }
    
//     if (filters.school) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.schoolName === filters.school.value)
//       );
//     }
    
//     if (filters.attendanceType) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
//         return attendanceType === filters.attendanceType;
//       });
//     }
    
//     if (filters.attendanceStatus) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const status = currentAttendance?.attendance || "Not Marked";
//         return status === filters.attendanceStatus;
//       });
//     }
    
//     setFilteredData(sortUsersByName(filtered));
//   }, [filters.role, filters.district, filters.school, filters.attendanceType, filters.attendanceStatus, attendanceData, sortUsersByName]);

//   const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
//     if (!attendanceStatus) return false;
    
//     if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Leave" && !formData.approvalRemark?.trim()) {
//       return false;
//     }
    
//     return true;
//   }, []);

//   const handleAttendanceChange = useCallback(async (user, attendanceStatus, currentFormData) => {
//     if (!canMarkAttendance(user, attendanceStatus, currentFormData)) {
//       if (currentFormData.attendanceType === "Field Visit" && !currentFormData.visitingLocation?.trim()) {
//         setErrorMessage("Please enter visiting location for Field Visit");
//       } else if (currentFormData.attendanceType === "Manual Attendance" && !currentFormData.remarkForManualAttendance?.trim()) {
//         setErrorMessage("Please enter remark for Manual Attendance");
//       } else if (currentFormData.attendanceType === "Leave" && !currentFormData.approvalRemark?.trim()) {
//         setErrorMessage("Please enter approval remark for Leave");
//       } else {
//         setErrorMessage("Please select valid attendance status");
//       }
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }
    
//     setMarkingAttendance(user._id);
//     try {
//       const currentDate = getCurrentDate();
      
//       const reqBody = {
//         _id: user._id,
//         userId: user.userId,
//         date: startDate || currentDate,
//         attendance: attendanceStatus,
//         attendanceType: currentFormData.attendanceType || "Manual Attendance",
//         attendanceMarkedBy: userData?._id || "Admin",
//         loginTime: new Date().toISOString(),
//         logoutTime: new Date().toISOString(),
//         longitude: user.longitude || 0,
//         latitude: user.latitude || 0,
//         visitingLocation: currentFormData.visitingLocation || null,
//         remarkForManualAttendance: currentFormData.remarkForManualAttendance || null
//       };
      
//       const response = await MarkUserAttendanceManually(reqBody);
//       if (response.status === "Ok") {
//         let updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               attendance: attendanceStatus,
//               attendanceType: currentFormData.attendanceType || "Manual Attendance",
//               date: currentDate,
//               loginTime: new Date().toISOString(),
//               logoutTime: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         if (currentFormData.attendanceType === "Leave") {
//           const attendanceId = response.data?._id || user.userAttendanceDetails?.[0]?._id;
          
//           if (attendanceId) {
//             const leaveApprovalBody = {
//               attendanceId: attendanceId,
//               isLeaveApproved: true,
//               approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
//               approvedBy: userData?._id || "Admin"
//             };
            
//             const leaveResponse = await leaveApproval(leaveApprovalBody);
//             if (leaveResponse.status === "Ok") {
//               updatedAttendanceData = updatedAttendanceData.map(existingUser => {
//                 if (existingUser._id === user._id) {
//                   const updatedUser = { ...existingUser };
//                   const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
                  
//                   updatedUser.userAttendanceDetails = [{
//                     ...existingAttendance,
//                     isLeaveApproved: true,
//                     approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
//                     approvedBy: userData?._id || "Admin",
//                     updatedAt: new Date().toISOString()
//                   }];
                  
//                   return updatedUser;
//                 }
//                 return existingUser;
//               });
//             }
//           }
//         }
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         const message = currentFormData.attendanceType === "Leave" 
//           ? `✅ Leave marked and auto-approved for ${user.name}`
//           : `✅ Attendance marked as ${attendanceStatus} for ${user.name}`;
//         setSuccessMessage(message);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage("Failed to mark attendance");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setErrorMessage("Error marking attendance: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setMarkingAttendance(null);
//     }
//   }, [attendanceData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id, startDate]);

//   const handleLeaveApproval = useCallback(async (user, isApproved, approvalRemark) => {
//     if (!approvalRemark?.trim()) {
//       setErrorMessage("Please enter approval remark");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     const attendanceId = user.userAttendanceDetails?.[0]?._id;
//     if (!attendanceId) {
//       setErrorMessage("Attendance record not found");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     setApprovingLeave(user._id);
//     try {
//       const reqBody = {
//         attendanceId: attendanceId,
//         isLeaveApproved: isApproved,
//         approvalRemark: approvalRemark.trim(),
//         approvedBy: userData?._id || "Admin"
//       };

//       const response = await leaveApproval(reqBody);
//       if (response.status === "Ok") {
//         const updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               isLeaveApproved: isApproved,
//               approvalRemark: approvalRemark.trim(),
//               approvedBy: userData?._id || "Admin",
//               updatedAt: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         setSuccessMessage(`✅ Leave ${isApproved ? 'Approved' : 'Rejected'} for ${user.name}`);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage(response.message || "Failed to update leave approval");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error in leave approval:", error);
//       setErrorMessage("Error updating leave approval: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setApprovingLeave(null);
//     }
//   }, [attendanceData, sortUsersByName, userData?._id]);

//   const updateAttendanceFormData = useCallback((userId, field, value) => {
//     setAttendanceFormData(prev => ({
//       ...prev,
//       [userId]: {
//         ...prev[userId],
//         [field]: value
//       }
//     }));
//   }, []);

//   const resetFilters = useCallback(() => {
//     setFilters({
//       date: null,
//       role: null,
//       district: null,
//       school: null,
//       attendanceType: "",
//       attendanceStatus: ""
//     });
//     setSchoolOptions([]);
//     fetchAttendanceData();
//   }, [fetchAttendanceData]);

//   useEffect(() => {
//     fetchAttendanceData();
//   }, [fetchAttendanceData, filters.date]);

//   const getAttendanceBadge = useCallback((attendance) => {
//     switch(attendance) {
//       case 'Present': return <Badge bg="success" className="px-3 py-2 rounded-pill">✅ Present</Badge>;
//       case 'Absent': return <Badge bg="danger" className="px-3 py-2 rounded-pill">❌ Absent</Badge>;
//       case 'Half Day': return <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill">⏳ Half Day</Badge>;
//       case 'WFH': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏠 WFH</Badge>;
//       case 'Comp-off': return <Badge bg="secondary" className="px-3 py-2 rounded-pill">📅 Comp-off</Badge>;
//       case 'Emergency Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🚨 Emergency Leave</Badge>;
//       case 'Medical Leave': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏥 Medical Leave</Badge>;
//       case 'Sick Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🤒 Sick Leave</Badge>;
//       default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">⭕ Not Marked</Badge>;
//     }
//   }, []);

//   const totalUsers = filteredData.length;
//   const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
//   const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
//   const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

//   const attendanceStatusOptions = [
//     { value: "", label: "📊 All Status" },
//     { value: "Present", label: "✅ Present" },
//     { value: "Absent", label: "❌ Absent" },
//     { value: "Half Day", label: "⏳ Half Day" },
//     { value: "WFH", label: "🏠 WFH" },
//     { value: "Comp-off", label: "📅 Comp-off" },
//     { value: "Emergency Leave", label: "🚨 Emergency Leave" },
//     { value: "Medical Leave", label: "🏥 Medical Leave" },
//     { value: "Sick Leave", label: "🤒 Sick Leave" }
//   ];

//   const attendanceTypeOptions = [
//     { value: "", label: "📊 All Types" },
//     { value: "Manual Attendance", label: "✍️ Manual Attendance" },
//     { value: "Field Visit", label: "📍 Field Visit" },
//     { value: "Leave", label: "🏖️ Leave" }
//   ];

//   const TableView = useMemo(() => (
//     <div className="table-responsive" style={{ overflowX: 'auto' }}>
//       <Table hover className="align-middle mb-0" style={{ minWidth: '800px' }}>
//         <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//           <tr>
//             <th className="py-3" style={{ width: '60px' }}>#</th>
//             <th className="py-3" style={{ width: '200px' }}>👤 User</th>
//             <th className="py-3" style={{ width: '100px' }}>🎭 Role</th>
//             <th className="py-3" style={{ width: '120px' }}>📊 Status</th>
//             <th className="py-3" style={{ width: '120px' }}>🕐 Login Time</th>
//             <th className="py-3" style={{ width: '320px' }}>📝 Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-2 text-muted">Loading attendance data...</p>
//               </td>
//             </tr>
//           ) : filteredData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <div className="text-muted">
//                   <FaClock size={50} className="mb-3 opacity-50" />
//                   <p>No attendance data found for the selected filters</p>
//                   <Button variant="outline-primary" size="sm" onClick={resetFilters}>
//                     Reset Filters
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((user, index) => (
//               <TableRow
//                 key={user._id}
//                 user={user}
//                 index={index}
//                 attendanceFormData={attendanceFormData}
//                 markingAttendance={markingAttendance}
//                 loading={loading}
//                 updateAttendanceFormData={updateAttendanceFormData}
//                 handleAttendanceChange={handleAttendanceChange}
//                 canMarkAttendance={canMarkAttendance}
//                 getAttendanceBadge={getAttendanceBadge}
//                 handleLeaveApproval={handleLeaveApproval}
//                 approvingLeave={approvingLeave}
//               />
//             ))
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [filteredData, loading, attendanceFormData, markingAttendance, approvingLeave, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, resetFilters]);

//   const CardView = useMemo(() => (
//     <Row className="g-4">
//       {filteredData.length === 0 ? (
//         <Col xs={12}>
//           <div className="text-center py-5">
//             <FaClock size={50} className="mb-3 opacity-50" />
//             <p className="text-muted">No users found</p>
//           </div>
//         </Col>
//       ) : (
//         filteredData.map((user, index) => (
//           <UserCard
//             key={user._id}
//             user={user}
//             index={index}
//             attendanceFormData={attendanceFormData}
//             markingAttendance={markingAttendance}
//             loading={loading}
//             updateAttendanceFormData={updateAttendanceFormData}
//             handleAttendanceChange={handleAttendanceChange}
//             canMarkAttendance={canMarkAttendance}
//             getAttendanceBadge={getAttendanceBadge}
//             handleLeaveApproval={handleLeaveApproval}
//             approvingLeave={approvingLeave}
//           />
//         ))
//       )}
//     </Row>
//   ), [filteredData, attendanceFormData, markingAttendance, approvingLeave, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval]);

//   return (
//     <Container fluid className="px-4 py-4 bg-light min-vh-100">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           {successMessage}
//         </Alert>
//       )}
//       {errorMessage && (
//         <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
//           {errorMessage}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h1 className="display-6 fw-bold text-primary mb-2">
//                 📊 Attendance Dashboard
//               </h1>
//               <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
//             </div>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="outline-primary" 
//                 onClick={fetchAttendanceData}
//                 disabled={loading}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaSyncAlt /> Refresh
//               </Button>
//               <Button 
//                 variant="outline-info" 
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaDownload /> Export
//               </Button>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCalendarAlt className="me-1" /> Date
//           </Form.Label>
//           <SingleDatePicker
//             selectedDate={startDate}
//             onDateChange={handleDateChange}
//             placeholderText="Select date"
//             className="w-100"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaUserTag className="me-1" /> Role
//           </Form.Label>
//           <Select
//             isClearable
//             options={roleOptions}
//             value={filters.role}
//             onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
//             placeholder="Select role..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> District
//           </Form.Label>
//           <Select
//             isClearable
//             options={districtOptions}
//             value={filters.district}
//             onChange={(option) => {
//               setFilters(prev => ({ 
//                 ...prev, 
//                 district: option,
//                 school: null
//               }));
//             }}
//             placeholder="Select district..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> School
//           </Form.Label>
//           <Select
//             isClearable
//             options={schoolOptions}
//             value={filters.school}
//             onChange={(option) => setFilters(prev => ({ ...prev, school: option }))}
//             placeholder="Select school..."
//             className="react-select"
//             isDisabled={!filters.district}
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaClock className="me-1" /> Attendance Type
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceTypeOptions}
//             value={attendanceTypeOptions.find(opt => opt.value === filters.attendanceType)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceType: option?.value || "" }))}
//             placeholder="Filter by type..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCheckCircle className="me-1" /> Attendance Status
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceStatusOptions}
//             value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
//             placeholder="Filter by status..."
//             className="react-select"
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col className="text-end">
//           <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
//             Clear All Filters
//           </Button>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaUsers size={20} className="text-primary" />
//               </div>
//               <h4 className="mb-1 fw-bold">{totalUsers}</h4>
//               <small className="text-muted">Total Users</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaCheckCircle size={20} className="text-success" />
//               </div>
//               <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
//               <small className="text-muted">Present</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaTimesCircle size={20} className="text-danger" />
//               </div>
//               <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
//               <small className="text-muted">Absent</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaClock size={20} className="text-info" />
//               </div>
//               <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
//               <small className="text-muted">Attendance Rate</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <div className="mb-3 d-flex justify-content-between align-items-center">
//         <div className="btn-group">
//           <Button 
//             variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('table')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaTable /> Table View
//           </Button>
//           <Button 
//             variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('card')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaThLarge /> Card View
//           </Button>
//         </div>
//         <small className="text-muted">
//           Showing {filteredData.length} of {attendanceData.length} users
//         </small>
//       </div>

//       {viewMode === 'table' ? TableView : CardView}
//     </Container>
//   );
// }











// import React, { useEffect, useContext, useState, useMemo, useCallback, useRef } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { UserAttendanceDashboard, MarkUserAttendanceManually, leaveApproval } from "../../service/User.service";
// import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap';
// import Select from 'react-select';
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt, FaCheck, FaTimes, FaEye, FaFileImage } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Leave Approval Modal Component
// const LeaveApprovalModal = React.memo(({ 
//   show, 
//   onHide, 
//   user, 
//   currentAttendance,
//   onApprove,
//   onReject,
//   approving 
// }) => {
//   const [approvalRemark, setApprovalRemark] = useState("");
//   const [selectedAction, setSelectedAction] = useState("");
//   const [imageError, setImageError] = useState(false);

//   // Reset state when modal opens
//   useEffect(() => {
//     if (show) {
//       setApprovalRemark("");
//       setSelectedAction("");
//       setImageError(false);
//     }
//   }, [show]);

//   const handleSubmit = () => {
//     if (!selectedAction || !approvalRemark.trim()) {
//       return;
//     }
//     const isApproved = selectedAction === 'approve';
//     onApprove(user, isApproved, approvalRemark);
//   };

//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       <Modal.Header closeButton className="bg-primary text-white">
//         <Modal.Title>
//           <FaEye className="me-2" />
//           Leave Approval - {user?.name}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {currentAttendance && (
//           <div className="p-3">
//             {/* User Info */}
//             <div className="mb-3">
//               <h6 className="fw-bold text-primary">User Information</h6>
//               <div className="bg-light p-3 rounded">
//                 <Row>
//                   <Col md={6}>
//                     <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
//                     <p className="mb-1"><strong>Role:</strong> {user?.role}</p>
//                     <p className="mb-1"><strong>User ID:</strong> {user?.userId}</p>
//                   </Col>
//                   <Col md={6}>
//                     <p className="mb-1"><strong>Date:</strong> {currentAttendance?.date ? new Date(currentAttendance.date).toLocaleDateString() : 'N/A'}</p>
//                     <p className="mb-1"><strong>Leave Type:</strong> {currentAttendance?.attendance || "N/A"}</p>
//                     <p className="mb-1"><strong>Status:</strong> {
//                       currentAttendance?.isLeaveApproved === true ? <Badge bg="success">✅ Approved</Badge> :
//                       currentAttendance?.isLeaveApproved === false ? <Badge bg="danger">❌ Rejected</Badge> :
//                       <Badge bg="warning">⏳ Pending</Badge>
//                     }</p>
//                   </Col>
//                 </Row>
//               </div>
//             </div>

//             {/* Reason */}
//             <div className="mb-3">
//               <h6 className="fw-bold text-primary">Reason for Leave</h6>
//               <div className="bg-light p-3 rounded">
//                 <p className="mb-0">{currentAttendance?.reasonIfNotPresent || "No reason provided"}</p>
//               </div>
//             </div>

//             {/* Attachment */}
//             {currentAttendance?.fileUrl && (
//               <div className="mb-3">
//                 <h6 className="fw-bold text-primary">Attachment</h6>
//                 <div className="bg-light p-3 rounded text-center">
//                   {!imageError ? (
//                     <img 
//                       src={currentAttendance.fileUrl} 
//                       alt="Leave Attachment"
//                       className="img-fluid rounded"
//                       style={{ maxHeight: '300px', objectFit: 'contain' }}
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <div className="p-4">
//                       <FaFileImage size={50} className="text-muted mb-2" />
//                       <p className="text-muted">Unable to load image</p>
//                       <a href={currentAttendance.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
//                         <FaEye className="me-1" /> View in new tab
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Approval Action - Only show if not already approved/rejected */}
//             {currentAttendance?.isLeaveApproved === null && (
//               <>
//                 <hr />
//                 <div className="mb-3">
//                   <h6 className="fw-bold text-primary">Approval Action</h6>
//                   <Form.Select 
//                     className="mb-2"
//                     value={selectedAction}
//                     onChange={(e) => setSelectedAction(e.target.value)}
//                     disabled={approving}
//                   >
//                     <option value="">Select Action</option>
//                     <option value="approve">✅ Approve</option>
//                     <option value="reject">❌ Reject</option>
//                   </Form.Select>
                  
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter approval remark *"
//                     value={approvalRemark}
//                     onChange={(e) => setApprovalRemark(e.target.value)}
//                     disabled={approving}
//                     isInvalid={selectedAction && !approvalRemark.trim()}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please enter approval remark
//                   </Form.Control.Feedback>
//                 </div>
//               </>
//             )}

//             {/* Already Approved/Rejected */}
//             {currentAttendance?.isLeaveApproved !== null && (
//               <div className="mt-3 p-3 bg-light rounded">
//                 <h6 className="fw-bold text-primary">Approval Status</h6>
//                 <p className="mb-1">
//                   <strong>Status:</strong> {currentAttendance.isLeaveApproved ? '✅ Approved' : '❌ Rejected'}
//                 </p>
//                 {currentAttendance.approvalRemark && (
//                   <p className="mb-1"><strong>Remark:</strong> {currentAttendance.approvalRemark}</p>
//                 )}
//                 {currentAttendance.approvedBy && (
//                   <p className="mb-0"><strong>Approved By:</strong> {currentAttendance.approvedBy}</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide} disabled={approving}>
//           Close
//         </Button>
//         {currentAttendance?.isLeaveApproved === null && (
//           <Button 
//             variant="primary" 
//             onClick={handleSubmit}
//             disabled={approving || !selectedAction || !approvalRemark.trim()}
//           >
//             {approving ? (
//               <>
//                 <Spinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FaCheck className="me-2" />
//                 Submit Approval
//               </>
//             )}
//           </Button>
//         )}
//       </Modal.Footer>
//     </Modal>
//   );
// });

// // Separate Row Component for Table to prevent re-renders
// const TableRow = React.memo(({ 
//   user, 
//   index, 
//   attendanceFormData, 
//   markingAttendance, 
//   loading, 
//   updateAttendanceFormData, 
//   handleAttendanceChange, 
//   canMarkAttendance, 
//   getAttendanceBadge,
//   handleLeaveApproval,
//   approvingLeave,
//   onViewLeave
// }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const attendanceType = currentAttendance?.attendanceType || null;
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isApproving = approvingLeave === user._id;
//   const isDisabled = isMarking || isApproving || loading;
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
//   const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
//   const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localLeaveStatus !== formData.leaveStatus) {
//         updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localApprovalRemark !== formData.approvalRemark) {
//         updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
//   // Check if attendance is already marked
//   const isAttendanceMarked = currentAttendance && currentAttendance.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveAttendance = attendanceType === "Leave" && isAttendanceMarked;
//   const isLeaveApproved = currentAttendance?.isLeaveApproved;
  
//   // Check if attendanceType is null/undefined/blank (no attendance marked)
//   const isNoAttendance = !attendanceType || attendanceType === null || attendanceType === undefined || attendanceType === "";

//   const getLeaveStatusBadge = () => {
//     if (isLeaveApproved === true) {
//       return <Badge bg="success" className="px-2 py-1">✅ Approved</Badge>;
//     } else if (isLeaveApproved === false) {
//       return <Badge bg="danger" className="px-2 py-1">❌ Rejected</Badge>;
//     } else if (isLeaveAttendance) {
//       return <Badge bg="warning" className="text-dark px-2 py-1">⏳ Pending</Badge>;
//     } else {
//       return null;
//     }
//   };

//   // Get attendance options based on attendance type
//   const getAttendanceOptions = () => {
//     // CASE 2: Existing Leave Attendance - Only show View button, no dropdown
//     if (isLeaveAttendance) {
//       return (
//         <Button
//           size="sm"
//           variant="outline-info"
//           onClick={() => onViewLeave(user)}
//           className="d-flex align-items-center gap-1"
//         >
//           <FaEye size={14} />
//           View Details
//         </Button>
//       );
//     }
    
//     // CASE 1: No attendance marked OR other attendance types
//     if (localAttendanceType === "Manual Attendance") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Field Visit") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Leave") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={localLeaveStatus || ""}
//           onChange={(e) => setLocalLeaveStatus(e.target.value)}
//           disabled={isDisabled || isAttendanceMarked}
//         >
//           <option value="">Select Leave Type</option>
//           <option value="Emergency Leave">🚨 Emergency Leave</option>
//           <option value="LWP">LWP</option>
//           <option value="Absent">🏖️ Absent</option>
//           <option value="WFH">🏠 WFH</option>
//           <option value="Comp-off">📅 Comp-off</option>
//           <option value="Medical Leave">🏥 Medical Leave</option>
//           <option value="Sick Leave">🤒 Sick Leave</option>
//           <option value="Half Day">⏳ Half Day</option>
//         </Form.Select>
//       );
//     }
//     return null;
//   };

//   return (
//     <tr className="border-bottom">
//       <td className="fw-bold">{index + 1}</td>
//       <td>
//         <div className="d-flex align-items-center">
//           <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//             <FaUserTag size={16} className="text-primary" />
//           </div>
//           <div>
//             <div className="fw-semibold">{user.name}</div>
//             {isLeaveAttendance && (
//               <div className="mt-1">
//                 {getLeaveStatusBadge()}
//               </div>
//             )}
//           </div>
//         </div>
//       </td>
//       <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
//       <td>{getAttendanceBadge(attendanceStatus)}</td>
//       <td>
//         {currentAttendance?.loginTime ? (
//           <div>
//             <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
//             <br />
//             <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
//           </div>
//         ) : '-'}
//       </td>
//       <td style={{ minWidth: '280px' }}>
//         <div className="d-flex flex-column gap-2">
//           {/* CASE 2: Existing Leave Attendance - Show only View button */}
//           {isLeaveAttendance ? (
//             <div className="d-flex gap-2">
//               <Form.Select 
//                 size="sm" 
//                 style={{ width: '120px' }}
//                 value="Leave"
//                 disabled={true}
//               >
//                 <option value="Leave">Leave</option>
//               </Form.Select>
//               {getAttendanceOptions()}
//             </div>
//           ) : (
//             /* CASE 1: No attendance marked OR other types - Regular UI */
//             <>
//               <div className="d-flex gap-2">
//                 <Form.Select 
//                   size="sm" 
//                   style={{ width: '120px' }}
//                   value={isAttendanceMarked ? (attendanceType || "Manual Attendance") : localAttendanceType}
//                   onChange={(e) => {
//                     const newType = e.target.value;
//                     setLocalAttendanceType(newType);
//                     if (newType !== "Leave") {
//                       setLocalLeaveStatus("");
//                       setLocalApprovalRemark("");
//                     }
//                   }}
//                   disabled={isDisabled || isAttendanceMarked}
//                 >
//                   <option value="Manual Attendance">Manual Attendance</option>
//                   <option value="Field Visit">Field Visit</option>
//                   <option value="Leave">Leave</option>
//                 </Form.Select>
                
//                 {getAttendanceOptions()}
//               </div>
              
//               {localAttendanceType === "Field Visit" && (
//                 <Form.Control
//                   size="sm"
//                   type="text"
//                   placeholder="Visiting location *"
//                   value={localVisitingLocation}
//                   onChange={(e) => setLocalVisitingLocation(e.target.value)}
//                   disabled={isDisabled || isAttendanceMarked}
//                   isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//                 />
//               )}
              
//               {localAttendanceType === "Manual Attendance" && (
//                 <Form.Control
//                   size="sm"
//                   type="text"
//                   placeholder="Remark *"
//                   value={localRemark}
//                   onChange={(e) => setLocalRemark(e.target.value)}
//                   disabled={isDisabled || isAttendanceMarked}
//                   isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//                 />
//               )}
              
//               {localAttendanceType === "Leave" && !isAttendanceMarked && (
//                 <>
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Approval remark *"
//                     value={localApprovalRemark}
//                     onChange={(e) => setLocalApprovalRemark(e.target.value)}
//                     disabled={isDisabled}
//                     isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
//                   />
//                   {localLeaveStatus && localApprovalRemark.trim() && (
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       onClick={() => {
//                         handleAttendanceChange(user, localLeaveStatus, {
//                           attendanceType: localAttendanceType,
//                           visitingLocation: localVisitingLocation,
//                           remarkForManualAttendance: localRemark,
//                           approvalRemark: localApprovalRemark
//                         });
//                       }}
//                       disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
//                       className="d-flex align-items-center justify-content-center gap-2"
//                     >
//                       {isMarking ? (
//                         <Spinner size="sm" />
//                       ) : (
//                         <FaCheck size={14} />
//                       )}
//                       Submit Leave
//                     </Button>
//                   )}
//                 </>
//               )}
//             </>
//           )}
          
//           {isMarking && <Spinner size="sm" />}
//         </div>
//       </td>
//     </tr>
//   );
// });

// // Card Component - keeping it similar but compact
// const UserCard = React.memo(({ 
//   user, 
//   index, 
//   attendanceFormData, 
//   markingAttendance, 
//   loading, 
//   updateAttendanceFormData, 
//   handleAttendanceChange, 
//   canMarkAttendance, 
//   getAttendanceBadge,
//   handleLeaveApproval,
//   approvingLeave,
//   onViewLeave
// }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const attendanceType = currentAttendance?.attendanceType || null;
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isApproving = approvingLeave === user._id;
//   const isDisabled = isMarking || isApproving || loading;
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
//   const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
//   const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localLeaveStatus !== formData.leaveStatus) {
//         updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localApprovalRemark !== formData.approvalRemark) {
//         updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
//   const isAttendanceMarked = currentAttendance && currentAttendance.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveAttendance = attendanceType === "Leave" && isAttendanceMarked;
//   const isLeaveApproved = currentAttendance?.isLeaveApproved;

//   const getCardBorderClass = () => {
//     if (attendanceStatus === "Present") return "border-success";
//     if (attendanceStatus === "Absent") return "border-danger";
//     if (attendanceStatus === "Half Day") return "border-warning";
//     if (attendanceStatus === "WFH") return "border-info";
//     return "border-secondary";
//   };

//   const getAttendanceOptions = () => {
//     // CASE 2: Existing Leave Attendance - Only show View button
//     if (isLeaveAttendance) {
//       return (
//         <Button
//           size="sm"
//           variant="outline-info"
//           onClick={() => onViewLeave(user)}
//           className="w-100 d-flex align-items-center justify-content-center gap-2"
//         >
//           <FaEye size={14} />
//           View Details
//         </Button>
//       );
//     }
    
//     if (localAttendanceType === "Manual Attendance") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//           className="bg-white"
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Field Visit") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//           className="bg-white"
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Leave") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={localLeaveStatus || ""}
//           onChange={(e) => setLocalLeaveStatus(e.target.value)}
//           disabled={isDisabled || isAttendanceMarked}
//           className="bg-white"
//         >
//           <option value="">Select Leave Type</option>
//           <option value="Emergency Leave">🚨 Emergency Leave</option>
//           <option value="LWP">LWP</option>
//           <option value="Absent">🏖️ Absent</option>
//           <option value="WFH">🏠 WFH</option>
//           <option value="Comp-off">📅 Comp-off</option>
//           <option value="Medical Leave">🏥 Medical Leave</option>
//           <option value="Sick Leave">🤒 Sick Leave</option>
//           <option value="Half Day">⏳ Half Day</option>
//         </Form.Select>
//       );
//     }
//     return null;
//   };
  
//   return (
//     <Col md={6} lg={4} xl={3}>
//       <Card className={`border-2 shadow-lg h-100 ${getCardBorderClass()}`} style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
//         <Card.Header className={`bg-white py-3 border-bottom-2 ${getCardBorderClass()}`}>
//           <div className="d-flex justify-content-between align-items-start">
//             <div>
//               <div className="d-flex align-items-center gap-2 mb-2">
//                 <Badge bg="secondary" className="px-3 py-2 rounded-pill">#{index + 1}</Badge>
//                 <Badge bg="primary" className="px-3 py-2 rounded-pill">{user.role}</Badge>
//                 {isLeaveAttendance && (
//                   <Badge bg={isLeaveApproved === true ? "success" : isLeaveApproved === false ? "danger" : "warning"} 
//                          className="px-2 py-1 rounded-pill">
//                     {isLeaveApproved === true ? "✅ Approved" : isLeaveApproved === false ? "❌ Rejected" : "⏳ Pending"}
//                   </Badge>
//                 )}
//               </div>
//               <h5 className="mb-1 fw-bold text-dark">{user.name}</h5>
//             </div>
//             <div className="text-end">
//               {getAttendanceBadge(attendanceStatus)}
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="bg-light">
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaSchool className="text-primary" />
//               <small className="text-muted fw-bold">Region:</small>
//             </div>
//             <p className="mb-0 small fw-semibold text-dark bg-white p-2 rounded border">
//               {user.role === 'CC' 
//                 ? user.schoolsData?.map(s => s.schoolName).join(', ')
//                 : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
//             </p>
//           </div>
          
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaClock className="text-warning" />
//               <small className="text-muted fw-bold">Last Login:</small>
//             </div>
//             <p className="mb-0 small bg-white p-2 rounded border">
//               {currentAttendance?.loginTime 
//                 ? new Date(currentAttendance.loginTime).toLocaleString()
//                 : 'Not logged in'}
//             </p>
//           </div>
          
//           <hr className="my-3" />
          
//           {isLeaveAttendance ? (
//             /* CASE 2: Existing Leave Attendance - Show only View button */
//             <>
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
//                 <Form.Select 
//                   size="sm" 
//                   value="Leave"
//                   disabled={true}
//                   className="bg-white"
//                 >
//                   <option value="Leave">Leave</option>
//                 </Form.Select>
//               </div>
              
//               {/* Show status if already approved/rejected */}
//               {isLeaveApproved !== null && (
//                 <div className="mb-3 p-2 bg-white rounded border">
//                   <small className="text-muted">
//                     {isLeaveApproved ? '✅ Approved' : '❌ Rejected'} 
//                     {currentAttendance?.approvalRemark && ` - ${currentAttendance.approvalRemark}`}
//                   </small>
//                 </div>
//               )}
              
//               {/* View button for leave */}
//               <Button
//                 size="sm"
//                 variant="outline-info"
//                 onClick={() => onViewLeave(user)}
//                 className="w-100 d-flex align-items-center justify-content-center gap-2"
//               >
//                 <FaEye size={14} />
//                 View Details
//               </Button>
//             </>
//           ) : (
//             /* CASE 1: No attendance marked OR other types - Regular UI */
//             <>
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
//                 <Form.Select 
//                   size="sm" 
//                   value={isAttendanceMarked ? (attendanceType || "Manual Attendance") : localAttendanceType}
//                   onChange={(e) => {
//                     const newType = e.target.value;
//                     setLocalAttendanceType(newType);
//                     if (newType !== "Leave") {
//                       setLocalLeaveStatus("");
//                       setLocalApprovalRemark("");
//                     }
//                   }}
//                   disabled={isDisabled || isAttendanceMarked}
//                   className="bg-white"
//                 >
//                   <option value="Manual Attendance">Manual Attendance</option>
//                   <option value="Field Visit">Field Visit</option>
//                   <option value="Leave">Leave</option>
//                 </Form.Select>
//               </div>
              
//               {localAttendanceType === "Field Visit" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold small">Visiting Location <span className="text-danger">*</span></Form.Label>
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Enter visiting location"
//                     value={localVisitingLocation}
//                     onChange={(e) => setLocalVisitingLocation(e.target.value)}
//                     disabled={isDisabled || isAttendanceMarked}
//                     isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//                     className="bg-white"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please enter visiting location
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               )}
              
//               {localAttendanceType === "Manual Attendance" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold small">Remark <span className="text-danger">*</span></Form.Label>
//                   <Form.Control
//                     size="sm"
//                     as="textarea"
//                     rows={2}
//                     placeholder="Enter remark"
//                     value={localRemark}
//                     onChange={(e) => setLocalRemark(e.target.value)}
//                     disabled={isDisabled || isAttendanceMarked}
//                     isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//                     className="bg-white"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please enter remark
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               )}
              
//               {localAttendanceType === "Leave" && !isAttendanceMarked && (
//                 <>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold small">Approval Remark <span className="text-danger">*</span></Form.Label>
//                     <Form.Control
//                       size="sm"
//                       type="text"
//                       placeholder="Enter approval remark"
//                       value={localApprovalRemark}
//                       onChange={(e) => setLocalApprovalRemark(e.target.value)}
//                       disabled={isDisabled}
//                       isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
//                       className="bg-white"
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       Please enter approval remark
//                     </Form.Control.Feedback>
//                   </Form.Group>
                  
//                   {localLeaveStatus && localApprovalRemark.trim() && (
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       onClick={() => {
//                         handleAttendanceChange(user, localLeaveStatus, {
//                           attendanceType: localAttendanceType,
//                           visitingLocation: localVisitingLocation,
//                           remarkForManualAttendance: localRemark,
//                           approvalRemark: localApprovalRemark
//                         });
//                       }}
//                       disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
//                       className="w-100 d-flex align-items-center justify-content-center gap-2"
//                     >
//                       {isMarking ? (
//                         <Spinner size="sm" />
//                       ) : (
//                         <FaCheck size={14} />
//                       )}
//                       Submit Leave
//                     </Button>
//                   )}
//                 </>
//               )}
//             </>
//           )}
          
//           <Form.Group className="mb-2">
//             <Form.Label className="fw-semibold small">Mark Attendance</Form.Label>
//             {!isLeaveAttendance && getAttendanceOptions()}
//           </Form.Group>
          
//           {isMarking && (
//             <div className="text-center mt-2">
//               <Spinner size="sm" animation="border" variant="primary" />
//               <span className="ms-2 small">Updating...</span>
//             </div>
//           )}
//         </Card.Body>
//         <Card.Footer className="bg-white text-muted small py-2">
//           <div className="d-flex justify-content-between align-items-center">
//             {currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked" && (
//               <Badge bg="success" className="rounded-pill">Updated</Badge>
//             )}
//             {isLeaveAttendance && isLeaveApproved !== null && (
//               <Badge bg={isLeaveApproved ? "success" : "danger"} className="rounded-pill">
//                 {isLeaveApproved ? "Approved" : "Rejected"}
//               </Badge>
//             )}
//           </div>
//         </Card.Footer>
//       </Card>
//     </Col>
//   );
// });

// export const UserAttendanceDashboardV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [markingAttendance, setMarkingAttendance] = useState(null);
//   const [approvingLeave, setApprovingLeave] = useState(null);
//   const [viewMode, setViewMode] = useState('table');
//   const [filters, setFilters] = useState({
//     date: null,
//     role: null,
//     district: null,
//     school: null,
//     attendanceType: "",
//     attendanceStatus: ""
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [attendanceFormData, setAttendanceFormData] = useState({});

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedAttendance, setSelectedAttendance] = useState(null);

//   const [roleOptions, setRoleOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);

//   const getCurrentDate = useCallback(() => {
//     return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
//   }, [filters.date, startDate]);

//   const getRoleFilter = useCallback(() => {
//     if (userData?.role === 'ACI') {
//       return "CC";
//     } else if (userData?.role === 'Community Manager') {
//       return ["CC", "ACI"];
//     }
//     return undefined;
//   }, [userData]);

//   const sortUsersByName = useCallback((users) => {
//     return [...users].sort((a, b) => a.name?.localeCompare(b.name));
//   }, []);

//   const getSchoolIdsFromUserAccess = useCallback((userData) => {
//     const schoolIds = [];
//     if (userData?.userAccess?.region) {
//       userData.userAccess.region.forEach(district => {
//         district.blockIds?.forEach(block => {
//           block.schoolIds?.forEach(school => {
//             if (school.schoolId) {
//               schoolIds.push(school.schoolId);
//             }
//           });
//         });
//       });
//     }
//     return schoolIds;
//   }, []);

//   const fetchAttendanceData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const roleFilter = getRoleFilter();
//       const currentDate = getCurrentDate();
//       const schoolIds = getSchoolIdsFromUserAccess(userData);

//       const reqBody = {
//         date: startDate || currentDate,
//         role: roleFilter,
//         schoolIds: schoolIds,
//         attendanceType: filters.attendanceType || undefined,
//         attendanceStatus: filters.attendanceStatus || undefined
//       };
      
//       const response = await UserAttendanceDashboard(reqBody);
//       if (response.status === "Ok") {
//         const sortedData = sortUsersByName(response.data);
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
//         setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
//         const allDistricts = new Set();
//         sortedData.forEach(user => {
//           user.schoolsData?.forEach(school => {
//             if (school.districtName) {
//               allDistricts.add(school.districtName);
//             }
//           });
//         });
//         setDistrictOptions([...allDistricts].map(district => ({ 
//           value: district, 
//           label: district 
//         })));
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       setErrorMessage("Failed to fetch attendance data");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [getRoleFilter, getCurrentDate, sortUsersByName, getSchoolIdsFromUserAccess, userData, startDate, filters.attendanceType, filters.attendanceStatus]);

//   const handleDateChange = useCallback((dateObj) => {
//     if (dateObj && dateObj.YYYYMMDD) {
//       setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
//       if (setStartDate) {
//         setStartDate(dateObj);
//       }
//     }
//   }, [setStartDate]);

//   useEffect(() => {
//     if (filters.district) {
//       const allSchools = new Set();
//       attendanceData.forEach(user => {
//         user.schoolsData?.forEach(school => {
//           if (school.districtName === filters.district.value && school.schoolName) {
//             allSchools.add(school.schoolName);
//           }
//         });
//       });
//       setSchoolOptions([...allSchools].map(school => ({ 
//         value: school, 
//         label: school 
//       })));
//     } else {
//       setSchoolOptions([]);
//     }
//   }, [filters.district, attendanceData]);

//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     if (filters.role) {
//       filtered = filtered.filter(user => user.role === filters.role.value);
//     }
    
//     if (filters.district) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.districtName === filters.district.value)
//       );
//     }
    
//     if (filters.school) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.schoolName === filters.school.value)
//       );
//     }
    
//     if (filters.attendanceType) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
//         return attendanceType === filters.attendanceType;
//       });
//     }
    
//     if (filters.attendanceStatus) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const status = currentAttendance?.attendance || "Not Marked";
//         return status === filters.attendanceStatus;
//       });
//     }
    
//     setFilteredData(sortUsersByName(filtered));
//   }, [filters.role, filters.district, filters.school, filters.attendanceType, filters.attendanceStatus, attendanceData, sortUsersByName]);

//   const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
//     if (!attendanceStatus) return false;
    
//     if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Leave" && !formData.approvalRemark?.trim()) {
//       return false;
//     }
    
//     return true;
//   }, []);

//   const handleAttendanceChange = useCallback(async (user, attendanceStatus, currentFormData) => {
//     if (!canMarkAttendance(user, attendanceStatus, currentFormData)) {
//       if (currentFormData.attendanceType === "Field Visit" && !currentFormData.visitingLocation?.trim()) {
//         setErrorMessage("Please enter visiting location for Field Visit");
//       } else if (currentFormData.attendanceType === "Manual Attendance" && !currentFormData.remarkForManualAttendance?.trim()) {
//         setErrorMessage("Please enter remark for Manual Attendance");
//       } else if (currentFormData.attendanceType === "Leave" && !currentFormData.approvalRemark?.trim()) {
//         setErrorMessage("Please enter approval remark for Leave");
//       } else {
//         setErrorMessage("Please select valid attendance status");
//       }
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }
    
//     setMarkingAttendance(user._id);
//     try {
//       const currentDate = getCurrentDate();
      
//       const reqBody = {
//         _id: user._id,
//         userId: user.userId,
//         date: startDate || currentDate,
//         attendance: attendanceStatus,
//         attendanceType: currentFormData.attendanceType || "Manual Attendance",
//         attendanceMarkedBy: userData?._id || "Admin",
//         loginTime: new Date().toISOString(),
//         logoutTime: new Date().toISOString(),
//         longitude: user.longitude || 0,
//         latitude: user.latitude || 0,
//         visitingLocation: currentFormData.visitingLocation || null,
//         remarkForManualAttendance: currentFormData.remarkForManualAttendance || null
//       };
      
//       const response = await MarkUserAttendanceManually(reqBody);
//       if (response.status === "Ok") {
//         let updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               attendance: attendanceStatus,
//               attendanceType: currentFormData.attendanceType || "Manual Attendance",
//               date: currentDate,
//               loginTime: new Date().toISOString(),
//               logoutTime: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         if (currentFormData.attendanceType === "Leave") {
//           const attendanceId = response.data?._id || user.userAttendanceDetails?.[0]?._id;
          
//           if (attendanceId) {
//             const leaveApprovalBody = {
//               attendanceId: attendanceId,
//               isLeaveApproved: true,
//               approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
//               approvedBy: userData?._id || "Admin"
//             };
            
//             const leaveResponse = await leaveApproval(leaveApprovalBody);
//             if (leaveResponse.status === "Ok") {
//               updatedAttendanceData = updatedAttendanceData.map(existingUser => {
//                 if (existingUser._id === user._id) {
//                   const updatedUser = { ...existingUser };
//                   const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
                  
//                   updatedUser.userAttendanceDetails = [{
//                     ...existingAttendance,
//                     isLeaveApproved: true,
//                     approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
//                     approvedBy: userData?._id || "Admin",
//                     updatedAt: new Date().toISOString()
//                   }];
                  
//                   return updatedUser;
//                 }
//                 return existingUser;
//               });
//             }
//           }
//         }
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         const message = currentFormData.attendanceType === "Leave" 
//           ? `✅ Leave marked and auto-approved for ${user.name}`
//           : `✅ Attendance marked as ${attendanceStatus} for ${user.name}`;
//         setSuccessMessage(message);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage("Failed to mark attendance");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setErrorMessage("Error marking attendance: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setMarkingAttendance(null);
//     }
//   }, [attendanceData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id, startDate]);

//   const handleLeaveApproval = useCallback(async (user, isApproved, approvalRemark) => {
//     if (!approvalRemark?.trim()) {
//       setErrorMessage("Please enter approval remark");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     const attendanceId = user.userAttendanceDetails?.[0]?._id;
//     if (!attendanceId) {
//       setErrorMessage("Attendance record not found");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     setApprovingLeave(user._id);
//     try {
//       const reqBody = {
//         attendanceId: attendanceId,
//         isLeaveApproved: isApproved,
//         approvalRemark: approvalRemark.trim(),
//         approvedBy: userData?._id || "Admin"
//       };

//       const response = await leaveApproval(reqBody);
//       if (response.status === "Ok") {
//         const updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               isLeaveApproved: isApproved,
//               approvalRemark: approvalRemark.trim(),
//               approvedBy: userData?._id || "Admin",
//               updatedAt: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         // Close modal if open
//         setShowModal(false);
//         setSelectedUser(null);
//         setSelectedAttendance(null);
        
//         setSuccessMessage(`✅ Leave ${isApproved ? 'Approved' : 'Rejected'} for ${user.name}`);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage(response.message || "Failed to update leave approval");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error in leave approval:", error);
//       setErrorMessage("Error updating leave approval: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setApprovingLeave(null);
//     }
//   }, [attendanceData, sortUsersByName, userData?._id]);

//   const handleViewLeave = useCallback((user) => {
//     const attendance = user.userAttendanceDetails?.[0];
//     if (attendance) {
//       setSelectedUser(user);
//       setSelectedAttendance(attendance);
//       setShowModal(true);
//     }
//   }, []);

//   const updateAttendanceFormData = useCallback((userId, field, value) => {
//     setAttendanceFormData(prev => ({
//       ...prev,
//       [userId]: {
//         ...prev[userId],
//         [field]: value
//       }
//     }));
//   }, []);

//   const resetFilters = useCallback(() => {
//     setFilters({
//       date: null,
//       role: null,
//       district: null,
//       school: null,
//       attendanceType: "",
//       attendanceStatus: ""
//     });
//     setSchoolOptions([]);
//     fetchAttendanceData();
//   }, [fetchAttendanceData]);

//   useEffect(() => {
//     fetchAttendanceData();
//   }, [fetchAttendanceData, filters.date]);

//   const getAttendanceBadge = useCallback((attendance) => {
//     switch(attendance) {
//       case 'Present': return <Badge bg="success" className="px-3 py-2 rounded-pill">✅ Present</Badge>;
//       case 'Absent': return <Badge bg="danger" className="px-3 py-2 rounded-pill">❌ Absent</Badge>;
//       case 'Half Day': return <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill">⏳ Half Day</Badge>;
//       case 'WFH': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏠 WFH</Badge>;
//       case 'Comp-off': return <Badge bg="secondary" className="px-3 py-2 rounded-pill">📅 Comp-off</Badge>;
//       case 'Emergency Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🚨 Emergency Leave</Badge>;
//       case 'Medical Leave': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏥 Medical Leave</Badge>;
//       case 'Sick Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🤒 Sick Leave</Badge>;
//       case 'LWP': return <Badge bg="dark" className="px-3 py-2 rounded-pill">⚠️ LWP</Badge>;
//       default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">⭕ Not Marked</Badge>;
//     }
//   }, []);

//   const totalUsers = filteredData.length;
//   const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
//   const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
//   const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

//   const attendanceStatusOptions = [
//     { value: "", label: "📊 All Status" },
//     { value: "Present", label: "✅ Present" },
//     { value: "Absent", label: "❌ Absent" },
//     { value: "Half Day", label: "⏳ Half Day" },
//     { value: "WFH", label: "🏠 WFH" },
//     { value: "Comp-off", label: "📅 Comp-off" },
//     { value: "Emergency Leave", label: "🚨 Emergency Leave" },
//     { value: "Medical Leave", label: "🏥 Medical Leave" },
//     { value: "Sick Leave", label: "🤒 Sick Leave" },
//     { value: "LWP", label: "⚠️ LWP" }
//   ];

//   const attendanceTypeOptions = [
//     { value: "", label: "📊 All Types" },
//     { value: "Manual Attendance", label: "✍️ Manual Attendance" },
//     { value: "Field Visit", label: "📍 Field Visit" },
//     { value: "Leave", label: "🏖️ Leave" }
//   ];

//   const TableView = useMemo(() => (
//     <div className="table-responsive" style={{ overflowX: 'auto' }}>
//       <Table hover className="align-middle mb-0" style={{ minWidth: '800px' }}>
//         <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//           <tr>
//             <th className="py-3" style={{ width: '60px' }}>#</th>
//             <th className="py-3" style={{ width: '180px' }}>👤 User</th>
//             <th className="py-3" style={{ width: '100px' }}>🎭 Role</th>
//             <th className="py-3" style={{ width: '120px' }}>📊 Status</th>
//             <th className="py-3" style={{ width: '120px' }}>🕐 Login Time</th>
//             <th className="py-3" style={{ width: '280px' }}>📝 Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-2 text-muted">Loading attendance data...</p>
//               </td>
//             </tr>
//           ) : filteredData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <div className="text-muted">
//                   <FaClock size={50} className="mb-3 opacity-50" />
//                   <p>No attendance data found for the selected filters</p>
//                   <Button variant="outline-primary" size="sm" onClick={resetFilters}>
//                     Reset Filters
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((user, index) => (
//               <TableRow
//                 key={user._id}
//                 user={user}
//                 index={index}
//                 attendanceFormData={attendanceFormData}
//                 markingAttendance={markingAttendance}
//                 loading={loading}
//                 updateAttendanceFormData={updateAttendanceFormData}
//                 handleAttendanceChange={handleAttendanceChange}
//                 canMarkAttendance={canMarkAttendance}
//                 getAttendanceBadge={getAttendanceBadge}
//                 handleLeaveApproval={handleLeaveApproval}
//                 approvingLeave={approvingLeave}
//                 onViewLeave={handleViewLeave}
//               />
//             ))
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [filteredData, loading, attendanceFormData, markingAttendance, approvingLeave, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, handleViewLeave, resetFilters]);

//   const CardView = useMemo(() => (
//     <Row className="g-4">
//       {filteredData.length === 0 ? (
//         <Col xs={12}>
//           <div className="text-center py-5">
//             <FaClock size={50} className="mb-3 opacity-50" />
//             <p className="text-muted">No users found</p>
//           </div>
//         </Col>
//       ) : (
//         filteredData.map((user, index) => (
//           <UserCard
//             key={user._id}
//             user={user}
//             index={index}
//             attendanceFormData={attendanceFormData}
//             markingAttendance={markingAttendance}
//             loading={loading}
//             updateAttendanceFormData={updateAttendanceFormData}
//             handleAttendanceChange={handleAttendanceChange}
//             canMarkAttendance={canMarkAttendance}
//             getAttendanceBadge={getAttendanceBadge}
//             handleLeaveApproval={handleLeaveApproval}
//             approvingLeave={approvingLeave}
//             onViewLeave={handleViewLeave}
//           />
//         ))
//       )}
//     </Row>
//   ), [filteredData, attendanceFormData, markingAttendance, approvingLeave, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, handleViewLeave]);

//   return (
//     <Container fluid className="px-4 py-4 bg-light min-vh-100">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           {successMessage}
//         </Alert>
//       )}
//       {errorMessage && (
//         <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
//           {errorMessage}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h1 className="display-6 fw-bold text-primary mb-2">
//                 📊 Attendance Dashboard
//               </h1>
//               <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
//             </div>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="outline-primary" 
//                 onClick={fetchAttendanceData}
//                 disabled={loading}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaSyncAlt /> Refresh
//               </Button>
//               <Button 
//                 variant="outline-info" 
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaDownload /> Export
//               </Button>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCalendarAlt className="me-1" /> Date
//           </Form.Label>
//           <SingleDatePicker
//             selectedDate={startDate}
//             onDateChange={handleDateChange}
//             placeholderText="Select date"
//             className="w-100"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaUserTag className="me-1" /> Role
//           </Form.Label>
//           <Select
//             isClearable
//             options={roleOptions}
//             value={filters.role}
//             onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
//             placeholder="Select role..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> District
//           </Form.Label>
//           <Select
//             isClearable
//             options={districtOptions}
//             value={filters.district}
//             onChange={(option) => {
//               setFilters(prev => ({ 
//                 ...prev, 
//                 district: option,
//                 school: null
//               }));
//             }}
//             placeholder="Select district..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> School
//           </Form.Label>
//           <Select
//             isClearable
//             options={schoolOptions}
//             value={filters.school}
//             onChange={(option) => setFilters(prev => ({ ...prev, school: option }))}
//             placeholder="Select school..."
//             className="react-select"
//             isDisabled={!filters.district}
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaClock className="me-1" /> Attendance Type
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceTypeOptions}
//             value={attendanceTypeOptions.find(opt => opt.value === filters.attendanceType)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceType: option?.value || "" }))}
//             placeholder="Filter by type..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCheckCircle className="me-1" /> Attendance Status
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceStatusOptions}
//             value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
//             placeholder="Filter by status..."
//             className="react-select"
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col className="text-end">
//           <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
//             Clear All Filters
//           </Button>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaUsers size={20} className="text-primary" />
//               </div>
//               <h4 className="mb-1 fw-bold">{totalUsers}</h4>
//               <small className="text-muted">Total Users</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaCheckCircle size={20} className="text-success" />
//               </div>
//               <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
//               <small className="text-muted">Present</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaTimesCircle size={20} className="text-danger" />
//               </div>
//               <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
//               <small className="text-muted">Absent</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaClock size={20} className="text-info" />
//               </div>
//               <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
//               <small className="text-muted">Attendance Rate</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <div className="mb-3 d-flex justify-content-between align-items-center">
//         <div className="btn-group">
//           <Button 
//             variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('table')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaTable /> Table View
//           </Button>
//           <Button 
//             variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('card')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaThLarge /> Card View
//           </Button>
//         </div>
//         <small className="text-muted">
//           Showing {filteredData.length} of {attendanceData.length} users
//         </small>
//       </div>

//       {viewMode === 'table' ? TableView : CardView}

//       {/* Leave Approval Modal */}
//       <LeaveApprovalModal
//         show={showModal}
//         onHide={() => {
//           setShowModal(false);
//           setSelectedUser(null);
//           setSelectedAttendance(null);
//         }}
//         user={selectedUser}
//         currentAttendance={selectedAttendance}
//         onApprove={handleLeaveApproval}
//         onReject={handleLeaveApproval}
//         approving={approvingLeave !== null}
//       />
//     </Container>
//   );
// }


















// import React, { useEffect, useContext, useState, useMemo, useCallback, useRef } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { UserAttendanceDashboard, MarkUserAttendanceManually, leaveApproval } from "../../service/User.service";
// import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap';
// import Select from 'react-select';
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt, FaCheck, FaTimes, FaEye, FaFileImage, FaDownload as FaDownloadIcon } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Leave Approval Modal Component
// const LeaveApprovalModal = React.memo(({ 
//   show, 
//   onHide, 
//   user, 
//   currentAttendance,
//   onApprove,
//   onReject,
//   approving 
// }) => {
//   const [approvalRemark, setApprovalRemark] = useState("");
//   const [selectedAction, setSelectedAction] = useState("");

//   // Reset state when modal opens
//   useEffect(() => {
//     if (show) {
//       setApprovalRemark("");
//       setSelectedAction("");
//     }
//   }, [show]);

//   const handleSubmit = () => {
//     if (!selectedAction || !approvalRemark.trim()) {
//       return;
//     }
//     const isApproved = selectedAction === 'approve';
//     onApprove(user, isApproved, approvalRemark);
//   };

//   // Handle file download
//   const handleDownload = (fileUrl, fileName) => {
//     if (fileUrl) {
//       // Open in new tab
//       window.open(fileUrl, '_blank');
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       <Modal.Header closeButton className="bg-primary text-white">
//         <Modal.Title>
//           <FaEye className="me-2" />
//           Leave Approval - {user?.name}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {currentAttendance && (
//           <div className="p-3">
//             {/* User Info */}
//             <div className="mb-3">
//               <h6 className="fw-bold text-primary">User Information</h6>
//               <div className="bg-light p-3 rounded">
//                 <Row>
//                   <Col md={6}>
//                     <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
//                     <p className="mb-1"><strong>Role:</strong> {user?.role}</p>
//                     <p className="mb-1"><strong>User ID:</strong> {user?.userId}</p>
//                   </Col>
//                   <Col md={6}>
//                     <p className="mb-1"><strong>Date:</strong> {currentAttendance?.date ? new Date(currentAttendance.date).toLocaleDateString() : 'N/A'}</p>
//                     <p className="mb-1"><strong>Leave Type:</strong> {currentAttendance?.attendance || "N/A"}</p>
//                     <p className="mb-1"><strong>Status:</strong> {
//                       currentAttendance?.isLeaveApproved === true ? <Badge bg="success">✅ Approved</Badge> :
//                       currentAttendance?.isLeaveApproved === false ? <Badge bg="danger">❌ Rejected</Badge> :
//                       <Badge bg="warning">⏳ Pending</Badge>
//                     }</p>
//                   </Col>
//                 </Row>
//               </div>
//             </div>

//             {/* Reason */}
//             <div className="mb-3">
//               <h6 className="fw-bold text-primary">Reason for Leave</h6>
//               <div className="bg-light p-3 rounded">
//                 <p className="mb-0">{currentAttendance?.reasonIfNotPresent || "No reason provided"}</p>
//               </div>
//             </div>

//             {/* Attachment - Hyperlink instead of preview */}
//             {currentAttendance?.fileUrl && (
//               <div className="mb-3">
//                 <h6 className="fw-bold text-primary">Attachment</h6>
//                 <div className="bg-light p-3 rounded">
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     onClick={() => handleDownload(currentAttendance.fileUrl, currentAttendance.fileName)}
//                     className="d-flex align-items-center gap-2"
//                   >
//                     <FaDownloadIcon size={14} />
//                     View Attachment
//                   </Button>
//                   {currentAttendance.fileName && (
//                     <small className="text-muted d-block mt-1">
//                       File: {currentAttendance.fileName}
//                     </small>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Approval Action - Only show if not already approved/rejected */}
//             {currentAttendance?.isLeaveApproved === null && (
//               <>
//                 <hr />
//                 <div className="mb-3">
//                   <h6 className="fw-bold text-primary">Approval Action</h6>
//                   <Form.Select 
//                     className="mb-2"
//                     value={selectedAction}
//                     onChange={(e) => setSelectedAction(e.target.value)}
//                     disabled={approving}
//                   >
//                     <option value="">Select Action</option>
//                     <option value="approve">✅ Approve</option>
//                     <option value="reject">❌ Reject</option>
//                   </Form.Select>
                  
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter approval remark *"
//                     value={approvalRemark}
//                     onChange={(e) => setApprovalRemark(e.target.value)}
//                     disabled={approving}
//                     isInvalid={selectedAction && !approvalRemark.trim()}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please enter approval remark
//                   </Form.Control.Feedback>
//                 </div>
//               </>
//             )}

//             {/* Already Approved/Rejected */}
//             {currentAttendance?.isLeaveApproved !== null && (
//               <div className="mt-3 p-3 bg-light rounded">
//                 <h6 className="fw-bold text-primary">Approval Status</h6>
//                 <p className="mb-1">
//                   <strong>Status:</strong> {currentAttendance.isLeaveApproved ? '✅ Approved' : '❌ Rejected'}
//                 </p>
//                 {currentAttendance.approvalRemark && (
//                   <p className="mb-1"><strong>Remark:</strong> {currentAttendance.approvalRemark}</p>
//                 )}
//                 {currentAttendance.approvedBy && (
//                   <p className="mb-0"><strong>Approved By:</strong> {currentAttendance.approvedBy}</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide} disabled={approving}>
//           Close
//         </Button>
//         {currentAttendance?.isLeaveApproved === null && (
//           <Button 
//             variant="primary" 
//             onClick={handleSubmit}
//             disabled={approving || !selectedAction || !approvalRemark.trim()}
//           >
//             {approving ? (
//               <>
//                 <Spinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FaCheck className="me-2" />
//                 Submit Approval
//               </>
//             )}
//           </Button>
//         )}
//       </Modal.Footer>
//     </Modal>
//   );
// });

// // Separate Row Component for Table to prevent re-renders
// const TableRow = React.memo(({ 
//   user, 
//   index, 
//   attendanceFormData, 
//   markingAttendance, 
//   loading, 
//   updateAttendanceFormData, 
//   handleAttendanceChange, 
//   canMarkAttendance, 
//   getAttendanceBadge,
//   handleLeaveApproval,
//   approvingLeave,
//   onViewLeave
// }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const attendanceType = currentAttendance?.attendanceType || null;
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isApproving = approvingLeave === user._id;
//   const isDisabled = isMarking || isApproving || loading;
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
//   const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
//   const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localLeaveStatus !== formData.leaveStatus) {
//         updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localApprovalRemark !== formData.approvalRemark) {
//         updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
//   // Check if attendance is already marked
//   const isAttendanceMarked = currentAttendance && currentAttendance.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveAttendance = attendanceType === "Leave" && isAttendanceMarked;
//   const isLeaveApproved = currentAttendance?.isLeaveApproved;
  
//   // Check if attendanceType is null/undefined/blank (no attendance marked)
//   const isNoAttendance = !attendanceType || attendanceType === null || attendanceType === undefined || attendanceType === "";

//   const getLeaveStatusBadge = () => {
//     if (isLeaveApproved === true) {
//       return <Badge bg="success" className="px-2 py-1">✅ Approved</Badge>;
//     } else if (isLeaveApproved === false) {
//       return <Badge bg="danger" className="px-2 py-1">❌ Rejected</Badge>;
//     } else if (isLeaveAttendance) {
//       return <Badge bg="warning" className="text-dark px-2 py-1">⏳ Pending</Badge>;
//     } else {
//       return null;
//     }
//   };

//   // Get attendance options based on attendance type
//   const getAttendanceOptions = () => {
//     // CASE 2: Existing Leave Attendance - Only show View button, no dropdown
//     if (isLeaveAttendance) {
//       return (
//         <Button
//           size="sm"
//           variant="outline-info"
//           onClick={() => onViewLeave(user)}
//           className="d-flex align-items-center gap-1"
//         >
//           <FaEye size={14} />
//           View Details
//         </Button>
//       );
//     }
    
//     // CASE 1: No attendance marked OR other attendance types
//     if (localAttendanceType === "Manual Attendance") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Field Visit") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Leave") {
//       return (
//         <Form.Select 
//           size="sm"
//           style={{ width: '140px' }}
//           value={localLeaveStatus || ""}
//           onChange={(e) => setLocalLeaveStatus(e.target.value)}
//           disabled={isDisabled || isAttendanceMarked}
//         >
//           <option value="">Select Leave Type</option>
//           <option value="Emergency Leave">🚨 Emergency Leave</option>
//           <option value="LWP">LWP</option>
//           <option value="Absent">🏖️ Absent</option>
//           <option value="WFH">🏠 WFH</option>
//           <option value="Comp-off">📅 Comp-off</option>
//           <option value="Medical Leave">🏥 Medical Leave</option>
//           <option value="Sick Leave">🤒 Sick Leave</option>
//           <option value="Half Day">⏳ Half Day</option>
//         </Form.Select>
//       );
//     }
//     return null;
//   };

//   return (
//     <tr className="border-bottom">
//       <td className="fw-bold">{index + 1}</td>
//       <td>
//         <div className="d-flex align-items-center">
//           <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
//             <FaUserTag size={16} className="text-primary" />
//           </div>
//           <div>
//             <div className="fw-semibold">{user.name}</div>
//             {isLeaveAttendance && (
//               <div className="mt-1">
//                 {getLeaveStatusBadge()}
//               </div>
//             )}
//           </div>
//         </div>
//       </td>
//       <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
//       <td>{getAttendanceBadge(attendanceStatus)}</td>
//       <td>
//         {currentAttendance?.loginTime ? (
//           <div>
//             <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
//             <br />
//             <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
//           </div>
//         ) : '-'}
//       </td>
//       <td style={{ minWidth: '280px' }}>
//         <div className="d-flex flex-column gap-2">
//           {/* CASE 2: Existing Leave Attendance - Show only View button */}
//           {isLeaveAttendance ? (
//             <div className="d-flex gap-2">
//               <Form.Select 
//                 size="sm" 
//                 style={{ width: '120px' }}
//                 value="Leave"
//                 disabled={true}
//               >
//                 <option value="Leave">Leave</option>
//               </Form.Select>
//               {getAttendanceOptions()}
//             </div>
//           ) : (
//             /* CASE 1: No attendance marked OR other types - Regular UI */
//             <>
//               <div className="d-flex gap-2">
//                 <Form.Select 
//                   size="sm" 
//                   style={{ width: '120px' }}
//                   value={isAttendanceMarked ? (attendanceType || "Manual Attendance") : localAttendanceType}
//                   onChange={(e) => {
//                     const newType = e.target.value;
//                     setLocalAttendanceType(newType);
//                     if (newType !== "Leave") {
//                       setLocalLeaveStatus("");
//                       setLocalApprovalRemark("");
//                     }
//                   }}
//                   disabled={isDisabled || isAttendanceMarked}
//                 >
//                   <option value="Manual Attendance">Manual Attendance</option>
//                   <option value="Field Visit">Field Visit</option>
//                   <option value="Leave">Leave</option>
//                 </Form.Select>
                
//                 {getAttendanceOptions()}
//               </div>
              
//               {localAttendanceType === "Field Visit" && (
//                 <Form.Control
//                   size="sm"
//                   type="text"
//                   placeholder="Visiting location *"
//                   value={localVisitingLocation}
//                   onChange={(e) => setLocalVisitingLocation(e.target.value)}
//                   disabled={isDisabled || isAttendanceMarked}
//                   isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//                 />
//               )}
              
//               {localAttendanceType === "Manual Attendance" && (
//                 <Form.Control
//                   size="sm"
//                   type="text"
//                   placeholder="Remark *"
//                   value={localRemark}
//                   onChange={(e) => setLocalRemark(e.target.value)}
//                   disabled={isDisabled || isAttendanceMarked}
//                   isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//                 />
//               )}
              
//               {localAttendanceType === "Leave" && !isAttendanceMarked && (
//                 <>
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Approval remark *"
//                     value={localApprovalRemark}
//                     onChange={(e) => setLocalApprovalRemark(e.target.value)}
//                     disabled={isDisabled}
//                     isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
//                   />
//                   {localLeaveStatus && localApprovalRemark.trim() && (
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       onClick={() => {
//                         handleAttendanceChange(user, localLeaveStatus, {
//                           attendanceType: localAttendanceType,
//                           visitingLocation: localVisitingLocation,
//                           remarkForManualAttendance: localRemark,
//                           approvalRemark: localApprovalRemark
//                         });
//                       }}
//                       disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
//                       className="d-flex align-items-center justify-content-center gap-2"
//                     >
//                       {isMarking ? (
//                         <Spinner size="sm" />
//                       ) : (
//                         <FaCheck size={14} />
//                       )}
//                       Submit Leave
//                     </Button>
//                   )}
//                 </>
//               )}
//             </>
//           )}
          
//           {isMarking && <Spinner size="sm" />}
//         </div>
//       </td>
//     </tr>
//   );
// });

// // Card Component - keeping it similar but compact
// const UserCard = React.memo(({ 
//   user, 
//   index, 
//   attendanceFormData, 
//   markingAttendance, 
//   loading, 
//   updateAttendanceFormData, 
//   handleAttendanceChange, 
//   canMarkAttendance, 
//   getAttendanceBadge,
//   handleLeaveApproval,
//   approvingLeave,
//   onViewLeave
// }) => {
//   const currentAttendance = user.userAttendanceDetails?.[0];
//   const attendanceStatus = currentAttendance?.attendance || "Not Marked";
//   const attendanceType = currentAttendance?.attendanceType || null;
//   const formData = attendanceFormData[user._id] || {};
//   const isMarking = markingAttendance === user._id;
//   const isApproving = approvingLeave === user._id;
//   const isDisabled = isMarking || isApproving || loading;
  
//   const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
//   const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
//   const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
//   const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
//   const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localVisitingLocation !== formData.visitingLocation) {
//         updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localRemark !== formData.remarkForManualAttendance) {
//         updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localAttendanceType !== formData.attendanceType) {
//         updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localLeaveStatus !== formData.leaveStatus) {
//         updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (localApprovalRemark !== formData.approvalRemark) {
//         updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
//       }
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
//   const isAttendanceMarked = currentAttendance && currentAttendance.attendance && currentAttendance.attendance !== "Not Marked";
//   const isLeaveAttendance = attendanceType === "Leave" && isAttendanceMarked;
//   const isLeaveApproved = currentAttendance?.isLeaveApproved;

//   const getCardBorderClass = () => {
//     if (attendanceStatus === "Present") return "border-success";
//     if (attendanceStatus === "Absent") return "border-danger";
//     if (attendanceStatus === "Half Day") return "border-warning";
//     if (attendanceStatus === "WFH") return "border-info";
//     return "border-secondary";
//   };

//   const getAttendanceOptions = () => {
//     // CASE 2: Existing Leave Attendance - Only show View button
//     if (isLeaveAttendance) {
//       return (
//         <Button
//           size="sm"
//           variant="outline-info"
//           onClick={() => onViewLeave(user)}
//           className="w-100 d-flex align-items-center justify-content-center gap-2"
//         >
//           <FaEye size={14} />
//           View Details
//         </Button>
//       );
//     }
    
//     if (localAttendanceType === "Manual Attendance") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//           className="bg-white"
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Field Visit") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
//           onChange={(e) => handleAttendanceChange(user, e.target.value, {
//             attendanceType: localAttendanceType,
//             visitingLocation: localVisitingLocation,
//             remarkForManualAttendance: localRemark,
//             approvalRemark: localApprovalRemark
//           })}
//           disabled={isDisabled || isAttendanceMarked}
//           className="bg-white"
//         >
//           <option value="">Select</option>
//           <option value="Present">✅ Present</option>
//         </Form.Select>
//       );
//     } else if (localAttendanceType === "Leave") {
//       return (
//         <Form.Select 
//           size="sm"
//           value={localLeaveStatus || ""}
//           onChange={(e) => setLocalLeaveStatus(e.target.value)}
//           disabled={isDisabled || isAttendanceMarked}
//           className="bg-white"
//         >
//           <option value="">Select Leave Type</option>
//           <option value="Emergency Leave">🚨 Emergency Leave</option>
//           <option value="LWP">LWP</option>
//           <option value="Absent">🏖️ Absent</option>
//           <option value="WFH">🏠 WFH</option>
//           <option value="Comp-off">📅 Comp-off</option>
//           <option value="Medical Leave">🏥 Medical Leave</option>
//           <option value="Sick Leave">🤒 Sick Leave</option>
//           <option value="Half Day">⏳ Half Day</option>
//         </Form.Select>
//       );
//     }
//     return null;
//   };
  
//   return (
//     <Col md={6} lg={4} xl={3}>
//       <Card className={`border-2 shadow-lg h-100 ${getCardBorderClass()}`} style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
//         <Card.Header className={`bg-white py-3 border-bottom-2 ${getCardBorderClass()}`}>
//           <div className="d-flex justify-content-between align-items-start">
//             <div>
//               <div className="d-flex align-items-center gap-2 mb-2">
//                 <Badge bg="secondary" className="px-3 py-2 rounded-pill">#{index + 1}</Badge>
//                 <Badge bg="primary" className="px-3 py-2 rounded-pill">{user.role}</Badge>
//                 {isLeaveAttendance && (
//                   <Badge bg={isLeaveApproved === true ? "success" : isLeaveApproved === false ? "danger" : "warning"} 
//                          className="px-2 py-1 rounded-pill">
//                     {isLeaveApproved === true ? "✅ Approved" : isLeaveApproved === false ? "❌ Rejected" : "⏳ Pending"}
//                   </Badge>
//                 )}
//               </div>
//               <h5 className="mb-1 fw-bold text-dark">{user.name}</h5>
//             </div>
//             <div className="text-end">
//               {getAttendanceBadge(attendanceStatus)}
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="bg-light">
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaSchool className="text-primary" />
//               <small className="text-muted fw-bold">Region:</small>
//             </div>
//             <p className="mb-0 small fw-semibold text-dark bg-white p-2 rounded border">
//               {user.role === 'CC' 
//                 ? user.schoolsData?.map(s => s.schoolName).join(', ')
//                 : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
//             </p>
//           </div>
          
//           <div className="mb-3">
//             <div className="d-flex align-items-center gap-2 mb-2">
//               <FaClock className="text-warning" />
//               <small className="text-muted fw-bold">Last Login:</small>
//             </div>
//             <p className="mb-0 small bg-white p-2 rounded border">
//               {currentAttendance?.loginTime 
//                 ? new Date(currentAttendance.loginTime).toLocaleString()
//                 : 'Not logged in'}
//             </p>
//           </div>
          
//           <hr className="my-3" />
          
//           {isLeaveAttendance ? (
//             /* CASE 2: Existing Leave Attendance - Show only View button */
//             <>
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
//                 <Form.Select 
//                   size="sm" 
//                   value="Leave"
//                   disabled={true}
//                   className="bg-white"
//                 >
//                   <option value="Leave">Leave</option>
//                 </Form.Select>
//               </div>
              
//               {/* Show status if already approved/rejected */}
//               {isLeaveApproved !== null && (
//                 <div className="mb-3 p-2 bg-white rounded border">
//                   <small className="text-muted">
//                     {isLeaveApproved ? '✅ Approved' : '❌ Rejected'} 
//                     {currentAttendance?.approvalRemark && ` - ${currentAttendance.approvalRemark}`}
//                   </small>
//                 </div>
//               )}
              
//               {/* View button for leave */}
//               <Button
//                 size="sm"
//                 variant="outline-info"
//                 onClick={() => onViewLeave(user)}
//                 className="w-100 d-flex align-items-center justify-content-center gap-2"
//               >
//                 <FaEye size={14} />
//                 View Details
//               </Button>
//             </>
//           ) : (
//             /* CASE 1: No attendance marked OR other types - Regular UI */
//             <>
//               <div className="mb-3">
//                 <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
//                 <Form.Select 
//                   size="sm" 
//                   value={isAttendanceMarked ? (attendanceType || "Manual Attendance") : localAttendanceType}
//                   onChange={(e) => {
//                     const newType = e.target.value;
//                     setLocalAttendanceType(newType);
//                     if (newType !== "Leave") {
//                       setLocalLeaveStatus("");
//                       setLocalApprovalRemark("");
//                     }
//                   }}
//                   disabled={isDisabled || isAttendanceMarked}
//                   className="bg-white"
//                 >
//                   <option value="Manual Attendance">Manual Attendance</option>
//                   <option value="Field Visit">Field Visit</option>
//                   <option value="Leave">Leave</option>
//                 </Form.Select>
//               </div>
              
//               {localAttendanceType === "Field Visit" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold small">Visiting Location <span className="text-danger">*</span></Form.Label>
//                   <Form.Control
//                     size="sm"
//                     type="text"
//                     placeholder="Enter visiting location"
//                     value={localVisitingLocation}
//                     onChange={(e) => setLocalVisitingLocation(e.target.value)}
//                     disabled={isDisabled || isAttendanceMarked}
//                     isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
//                     className="bg-white"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please enter visiting location
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               )}
              
//               {localAttendanceType === "Manual Attendance" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold small">Remark <span className="text-danger">*</span></Form.Label>
//                   <Form.Control
//                     size="sm"
//                     as="textarea"
//                     rows={2}
//                     placeholder="Enter remark"
//                     value={localRemark}
//                     onChange={(e) => setLocalRemark(e.target.value)}
//                     disabled={isDisabled || isAttendanceMarked}
//                     isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
//                     className="bg-white"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please enter remark
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               )}
              
//               {localAttendanceType === "Leave" && !isAttendanceMarked && (
//                 <>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-semibold small">Approval Remark <span className="text-danger">*</span></Form.Label>
//                     <Form.Control
//                       size="sm"
//                       type="text"
//                       placeholder="Enter approval remark"
//                       value={localApprovalRemark}
//                       onChange={(e) => setLocalApprovalRemark(e.target.value)}
//                       disabled={isDisabled}
//                       isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
//                       className="bg-white"
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       Please enter approval remark
//                     </Form.Control.Feedback>
//                   </Form.Group>
                  
//                   {localLeaveStatus && localApprovalRemark.trim() && (
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       onClick={() => {
//                         handleAttendanceChange(user, localLeaveStatus, {
//                           attendanceType: localAttendanceType,
//                           visitingLocation: localVisitingLocation,
//                           remarkForManualAttendance: localRemark,
//                           approvalRemark: localApprovalRemark
//                         });
//                       }}
//                       disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
//                       className="w-100 d-flex align-items-center justify-content-center gap-2"
//                     >
//                       {isMarking ? (
//                         <Spinner size="sm" />
//                       ) : (
//                         <FaCheck size={14} />
//                       )}
//                       Submit Leave
//                     </Button>
//                   )}
//                 </>
//               )}
//             </>
//           )}
          
//           <Form.Group className="mb-2">
//             <Form.Label className="fw-semibold small">Mark Attendance</Form.Label>
//             {!isLeaveAttendance && getAttendanceOptions()}
//           </Form.Group>
          
//           {isMarking && (
//             <div className="text-center mt-2">
//               <Spinner size="sm" animation="border" variant="primary" />
//               <span className="ms-2 small">Updating...</span>
//             </div>
//           )}
//         </Card.Body>
//         <Card.Footer className="bg-white text-muted small py-2">
//           <div className="d-flex justify-content-between align-items-center">
//             {currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked" && (
//               <Badge bg="success" className="rounded-pill">Updated</Badge>
//             )}
//             {isLeaveAttendance && isLeaveApproved !== null && (
//               <Badge bg={isLeaveApproved ? "success" : "danger"} className="rounded-pill">
//                 {isLeaveApproved ? "Approved" : "Rejected"}
//               </Badge>
//             )}
//           </div>
//         </Card.Footer>
//       </Card>
//     </Col>
//   );
// });

// export const UserAttendanceDashboardV2 = () => {
//   const { userData } = useContext(UserContext);
//   const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [markingAttendance, setMarkingAttendance] = useState(null);
//   const [approvingLeave, setApprovingLeave] = useState(null);
//   const [viewMode, setViewMode] = useState('table');
//   const [filters, setFilters] = useState({
//     date: null,
//     role: null,
//     district: null,
//     school: null,
//     attendanceType: "",
//     attendanceStatus: ""
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [attendanceFormData, setAttendanceFormData] = useState({});

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedAttendance, setSelectedAttendance] = useState(null);

//   const [roleOptions, setRoleOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);

//   const getCurrentDate = useCallback(() => {
//     return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
//   }, [filters.date, startDate]);

//   const getRoleFilter = useCallback(() => {
//     if (userData?.role === 'ACI') {
//       return "CC";
//     } else if (userData?.role === 'Community Manager') {
//       return ["CC", "ACI"];
//     }
//     return undefined;
//   }, [userData]);

//   const sortUsersByName = useCallback((users) => {
//     return [...users].sort((a, b) => a.name?.localeCompare(b.name));
//   }, []);

//   const getSchoolIdsFromUserAccess = useCallback((userData) => {
//     const schoolIds = [];
//     if (userData?.userAccess?.region) {
//       userData.userAccess.region.forEach(district => {
//         district.blockIds?.forEach(block => {
//           block.schoolIds?.forEach(school => {
//             if (school.schoolId) {
//               schoolIds.push(school.schoolId);
//             }
//           });
//         });
//       });
//     }
//     return schoolIds;
//   }, []);

//   const fetchAttendanceData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const roleFilter = getRoleFilter();
//       const currentDate = getCurrentDate();
//       const schoolIds = getSchoolIdsFromUserAccess(userData);

//       const reqBody = {
//         date: startDate || currentDate,
//         role: roleFilter,
//         schoolIds: schoolIds,
//         attendanceType: filters.attendanceType || undefined,
//         attendanceStatus: filters.attendanceStatus || undefined
//       };
      
//       const response = await UserAttendanceDashboard(reqBody);
//       if (response.status === "Ok") {
//         const sortedData = sortUsersByName(response.data);
//         setAttendanceData(sortedData);
//         setFilteredData(sortedData);
        
//         const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
//         setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
//         const allDistricts = new Set();
//         sortedData.forEach(user => {
//           user.schoolsData?.forEach(school => {
//             if (school.districtName) {
//               allDistricts.add(school.districtName);
//             }
//           });
//         });
//         setDistrictOptions([...allDistricts].map(district => ({ 
//           value: district, 
//           label: district 
//         })));
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       setErrorMessage("Failed to fetch attendance data");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [getRoleFilter, getCurrentDate, sortUsersByName, getSchoolIdsFromUserAccess, userData, startDate, filters.attendanceType, filters.attendanceStatus]);

//   const handleDateChange = useCallback((dateObj) => {
//     if (dateObj && dateObj.YYYYMMDD) {
//       setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
//       if (setStartDate) {
//         setStartDate(dateObj);
//       }
//     }
//   }, [setStartDate]);

//   useEffect(() => {
//     if (filters.district) {
//       const allSchools = new Set();
//       attendanceData.forEach(user => {
//         user.schoolsData?.forEach(school => {
//           if (school.districtName === filters.district.value && school.schoolName) {
//             allSchools.add(school.schoolName);
//           }
//         });
//       });
//       setSchoolOptions([...allSchools].map(school => ({ 
//         value: school, 
//         label: school 
//       })));
//     } else {
//       setSchoolOptions([]);
//     }
//   }, [filters.district, attendanceData]);

//   useEffect(() => {
//     let filtered = [...attendanceData];
    
//     if (filters.role) {
//       filtered = filtered.filter(user => user.role === filters.role.value);
//     }
    
//     if (filters.district) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.districtName === filters.district.value)
//       );
//     }
    
//     if (filters.school) {
//       filtered = filtered.filter(user => 
//         user.schoolsData?.some(school => school.schoolName === filters.school.value)
//       );
//     }
    
//     if (filters.attendanceType) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
//         return attendanceType === filters.attendanceType;
//       });
//     }
    
//     if (filters.attendanceStatus) {
//       filtered = filtered.filter(user => {
//         const currentAttendance = user.userAttendanceDetails?.[0];
//         const status = currentAttendance?.attendance || "Not Marked";
//         return status === filters.attendanceStatus;
//       });
//     }
    
//     setFilteredData(sortUsersByName(filtered));
//   }, [filters.role, filters.district, filters.school, filters.attendanceType, filters.attendanceStatus, attendanceData, sortUsersByName]);

//   const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
//     if (!attendanceStatus) return false;
    
//     if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
//       return false;
//     }
    
//     if (formData.attendanceType === "Leave" && !formData.approvalRemark?.trim()) {
//       return false;
//     }
    
//     return true;
//   }, []);

//   const handleAttendanceChange = useCallback(async (user, attendanceStatus, currentFormData) => {
//     if (!canMarkAttendance(user, attendanceStatus, currentFormData)) {
//       if (currentFormData.attendanceType === "Field Visit" && !currentFormData.visitingLocation?.trim()) {
//         setErrorMessage("Please enter visiting location for Field Visit");
//       } else if (currentFormData.attendanceType === "Manual Attendance" && !currentFormData.remarkForManualAttendance?.trim()) {
//         setErrorMessage("Please enter remark for Manual Attendance");
//       } else if (currentFormData.attendanceType === "Leave" && !currentFormData.approvalRemark?.trim()) {
//         setErrorMessage("Please enter approval remark for Leave");
//       } else {
//         setErrorMessage("Please select valid attendance status");
//       }
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }
    
//     setMarkingAttendance(user._id);
//     try {
//       const currentDate = getCurrentDate();
      
//       const reqBody = {
//         _id: user._id,
//         userId: user.userId,
//         date: startDate || currentDate,
//         attendance: attendanceStatus,
//         attendanceType: currentFormData.attendanceType || "Manual Attendance",
//         attendanceMarkedBy: userData?._id || "Admin",
//         loginTime: new Date().toISOString(),
//         logoutTime: new Date().toISOString(),
//         longitude: user.longitude || 0,
//         latitude: user.latitude || 0,
//         visitingLocation: currentFormData.visitingLocation || null,
//         remarkForManualAttendance: currentFormData.remarkForManualAttendance || null
//       };
      
//       const response = await MarkUserAttendanceManually(reqBody);
//       if (response.status === "Ok") {
//         let updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               attendance: attendanceStatus,
//               attendanceType: currentFormData.attendanceType || "Manual Attendance",
//               date: currentDate,
//               loginTime: new Date().toISOString(),
//               logoutTime: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         if (currentFormData.attendanceType === "Leave") {
//           const attendanceId = response.data?._id || user.userAttendanceDetails?.[0]?._id;
          
//           if (attendanceId) {
//             const leaveApprovalBody = {
//               attendanceId: attendanceId,
//               isLeaveApproved: true,
//               approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
//               approvedBy: userData?._id || "Admin"
//             };
            
//             const leaveResponse = await leaveApproval(leaveApprovalBody);
//             if (leaveResponse.status === "Ok") {
//               updatedAttendanceData = updatedAttendanceData.map(existingUser => {
//                 if (existingUser._id === user._id) {
//                   const updatedUser = { ...existingUser };
//                   const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
                  
//                   updatedUser.userAttendanceDetails = [{
//                     ...existingAttendance,
//                     isLeaveApproved: true,
//                     approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
//                     approvedBy: userData?._id || "Admin",
//                     updatedAt: new Date().toISOString()
//                   }];
                  
//                   return updatedUser;
//                 }
//                 return existingUser;
//               });
//             }
//           }
//         }
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         const message = currentFormData.attendanceType === "Leave" 
//           ? `✅ Leave marked and auto-approved for ${user.name}`
//           : `✅ Attendance marked as ${attendanceStatus} for ${user.name}`;
//         setSuccessMessage(message);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage("Failed to mark attendance");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setErrorMessage("Error marking attendance: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setMarkingAttendance(null);
//     }
//   }, [attendanceData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id, startDate]);

//   const handleLeaveApproval = useCallback(async (user, isApproved, approvalRemark) => {
//     if (!approvalRemark?.trim()) {
//       setErrorMessage("Please enter approval remark");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     const attendanceId = user.userAttendanceDetails?.[0]?._id;
//     if (!attendanceId) {
//       setErrorMessage("Attendance record not found");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     setApprovingLeave(user._id);
//     try {
//       const reqBody = {
//         attendanceId: attendanceId,
//         isLeaveApproved: isApproved,
//         approvalRemark: approvalRemark.trim(),
//         approvedBy: userData?._id || "Admin"
//       };

//       const response = await leaveApproval(reqBody);
//       if (response.status === "Ok") {
//         const updatedAttendanceData = attendanceData.map(existingUser => {
//           if (existingUser._id === user._id) {
//             const updatedUser = { ...existingUser };
//             const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
//             updatedUser.userAttendanceDetails = [{
//               ...existingAttendance,
//               isLeaveApproved: isApproved,
//               approvalRemark: approvalRemark.trim(),
//               approvedBy: userData?._id || "Admin",
//               updatedAt: new Date().toISOString()
//             }];
            
//             return updatedUser;
//           }
//           return existingUser;
//         });
        
//         const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
//         setAttendanceData(sortedUpdatedData);
        
//         setAttendanceFormData(prev => ({
//           ...prev,
//           [user._id]: {}
//         }));
        
//         // Close modal if open
//         setShowModal(false);
//         setSelectedUser(null);
//         setSelectedAttendance(null);
        
//         setSuccessMessage(`✅ Leave ${isApproved ? 'Approved' : 'Rejected'} for ${user.name}`);
//         setTimeout(() => setSuccessMessage(""), 2000);
//       } else {
//         setErrorMessage(response.message || "Failed to update leave approval");
//         setTimeout(() => setErrorMessage(""), 3000);
//       }
//     } catch (error) {
//       console.error("Error in leave approval:", error);
//       setErrorMessage("Error updating leave approval: " + error.message);
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setApprovingLeave(null);
//     }
//   }, [attendanceData, sortUsersByName, userData?._id]);

//   const handleViewLeave = useCallback((user) => {
//     const attendance = user.userAttendanceDetails?.[0];
//     if (attendance) {
//       setSelectedUser(user);
//       setSelectedAttendance(attendance);
//       setShowModal(true);
//     }
//   }, []);

//   const updateAttendanceFormData = useCallback((userId, field, value) => {
//     setAttendanceFormData(prev => ({
//       ...prev,
//       [userId]: {
//         ...prev[userId],
//         [field]: value
//       }
//     }));
//   }, []);

//   const resetFilters = useCallback(() => {
//     setFilters({
//       date: null,
//       role: null,
//       district: null,
//       school: null,
//       attendanceType: "",
//       attendanceStatus: ""
//     });
//     setSchoolOptions([]);
//     fetchAttendanceData();
//   }, [fetchAttendanceData]);

//   useEffect(() => {
//     fetchAttendanceData();
//   }, [fetchAttendanceData, filters.date]);

//   const getAttendanceBadge = useCallback((attendance) => {
//     switch(attendance) {
//       case 'Present': return <Badge bg="success" className="px-3 py-2 rounded-pill">✅ Present</Badge>;
//       case 'Absent': return <Badge bg="danger" className="px-3 py-2 rounded-pill">❌ Absent</Badge>;
//       case 'Half Day': return <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill">⏳ Half Day</Badge>;
//       case 'WFH': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏠 WFH</Badge>;
//       case 'Comp-off': return <Badge bg="secondary" className="px-3 py-2 rounded-pill">📅 Comp-off</Badge>;
//       case 'Emergency Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🚨 Emergency Leave</Badge>;
//       case 'Medical Leave': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏥 Medical Leave</Badge>;
//       case 'Sick Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🤒 Sick Leave</Badge>;
//       case 'LWP': return <Badge bg="dark" className="px-3 py-2 rounded-pill">⚠️ LWP</Badge>;
//       default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">⭕ Not Marked</Badge>;
//     }
//   }, []);

//   const totalUsers = filteredData.length;
//   const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
//   const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
//   const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

//   const attendanceStatusOptions = [
//     { value: "", label: "📊 All Status" },
//     { value: "Present", label: "✅ Present" },
//     { value: "Absent", label: "❌ Absent" },
//     { value: "Half Day", label: "⏳ Half Day" },
//     { value: "WFH", label: "🏠 WFH" },
//     { value: "Comp-off", label: "📅 Comp-off" },
//     { value: "Emergency Leave", label: "🚨 Emergency Leave" },
//     { value: "Medical Leave", label: "🏥 Medical Leave" },
//     { value: "Sick Leave", label: "🤒 Sick Leave" },
//     { value: "LWP", label: "⚠️ LWP" }
//   ];

//   const attendanceTypeOptions = [
//     { value: "", label: "📊 All Types" },
//     { value: "Manual Attendance", label: "✍️ Manual Attendance" },
//     { value: "Field Visit", label: "📍 Field Visit" },
//     { value: "Leave", label: "🏖️ Leave" }
//   ];

//   const TableView = useMemo(() => (
//     <div className="table-responsive" style={{ overflowX: 'auto' }}>
//       <Table hover className="align-middle mb-0" style={{ minWidth: '800px' }}>
//         <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//           <tr>
//             <th className="py-3" style={{ width: '60px' }}>#</th>
//             <th className="py-3" style={{ width: '180px' }}>👤 User</th>
//             <th className="py-3" style={{ width: '100px' }}>🎭 Role</th>
//             <th className="py-3" style={{ width: '120px' }}>📊 Status</th>
//             <th className="py-3" style={{ width: '120px' }}>🕐 Login Time</th>
//             <th className="py-3" style={{ width: '280px' }}>📝 Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-2 text-muted">Loading attendance data...</p>
//               </td>
//             </tr>
//           ) : filteredData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <div className="text-muted">
//                   <FaClock size={50} className="mb-3 opacity-50" />
//                   <p>No attendance data found for the selected filters</p>
//                   <Button variant="outline-primary" size="sm" onClick={resetFilters}>
//                     Reset Filters
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((user, index) => (
//               <TableRow
//                 key={user._id}
//                 user={user}
//                 index={index}
//                 attendanceFormData={attendanceFormData}
//                 markingAttendance={markingAttendance}
//                 loading={loading}
//                 updateAttendanceFormData={updateAttendanceFormData}
//                 handleAttendanceChange={handleAttendanceChange}
//                 canMarkAttendance={canMarkAttendance}
//                 getAttendanceBadge={getAttendanceBadge}
//                 handleLeaveApproval={handleLeaveApproval}
//                 approvingLeave={approvingLeave}
//                 onViewLeave={handleViewLeave}
//               />
//             ))
//           )}
//         </tbody>
//       </Table>
//     </div>
//   ), [filteredData, loading, attendanceFormData, markingAttendance, approvingLeave, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, handleViewLeave, resetFilters]);

//   const CardView = useMemo(() => (
//     <Row className="g-4">
//       {filteredData.length === 0 ? (
//         <Col xs={12}>
//           <div className="text-center py-5">
//             <FaClock size={50} className="mb-3 opacity-50" />
//             <p className="text-muted">No users found</p>
//           </div>
//         </Col>
//       ) : (
//         filteredData.map((user, index) => (
//           <UserCard
//             key={user._id}
//             user={user}
//             index={index}
//             attendanceFormData={attendanceFormData}
//             markingAttendance={markingAttendance}
//             loading={loading}
//             updateAttendanceFormData={updateAttendanceFormData}
//             handleAttendanceChange={handleAttendanceChange}
//             canMarkAttendance={canMarkAttendance}
//             getAttendanceBadge={getAttendanceBadge}
//             handleLeaveApproval={handleLeaveApproval}
//             approvingLeave={approvingLeave}
//             onViewLeave={handleViewLeave}
//           />
//         ))
//       )}
//     </Row>
//   ), [filteredData, attendanceFormData, markingAttendance, approvingLeave, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, handleViewLeave]);

//   return (
//     <Container fluid className="px-4 py-4 bg-light min-vh-100">
//       {successMessage && (
//         <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
//           {successMessage}
//         </Alert>
//       )}
//       {errorMessage && (
//         <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
//           {errorMessage}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h1 className="display-6 fw-bold text-primary mb-2">
//                 📊 Attendance Dashboard
//               </h1>
//               <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
//             </div>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="outline-primary" 
//                 onClick={fetchAttendanceData}
//                 disabled={loading}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaSyncAlt /> Refresh
//               </Button>
//               <Button 
//                 variant="outline-info" 
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaDownload /> Export
//               </Button>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCalendarAlt className="me-1" /> Date
//           </Form.Label>
//           <SingleDatePicker
//             selectedDate={startDate}
//             onDateChange={handleDateChange}
//             placeholderText="Select date"
//             className="w-100"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaUserTag className="me-1" /> Role
//           </Form.Label>
//           <Select
//             isClearable
//             options={roleOptions}
//             value={filters.role}
//             onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
//             placeholder="Select role..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> District
//           </Form.Label>
//           <Select
//             isClearable
//             options={districtOptions}
//             value={filters.district}
//             onChange={(option) => {
//               setFilters(prev => ({ 
//                 ...prev, 
//                 district: option,
//                 school: null
//               }));
//             }}
//             placeholder="Select district..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaSchool className="me-1" /> School
//           </Form.Label>
//           <Select
//             isClearable
//             options={schoolOptions}
//             value={filters.school}
//             onChange={(option) => setFilters(prev => ({ ...prev, school: option }))}
//             placeholder="Select school..."
//             className="react-select"
//             isDisabled={!filters.district}
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaClock className="me-1" /> Attendance Type
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceTypeOptions}
//             value={attendanceTypeOptions.find(opt => opt.value === filters.attendanceType)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceType: option?.value || "" }))}
//             placeholder="Filter by type..."
//             className="react-select"
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Label className="fw-semibold">
//             <FaCheckCircle className="me-1" /> Attendance Status
//           </Form.Label>
//           <Select
//             isClearable
//             options={attendanceStatusOptions}
//             value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
//             onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
//             placeholder="Filter by status..."
//             className="react-select"
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col className="text-end">
//           <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
//             Clear All Filters
//           </Button>
//         </Col>
//       </Row>

//       <Row className="mb-4 g-3">
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaUsers size={20} className="text-primary" />
//               </div>
//               <h4 className="mb-1 fw-bold">{totalUsers}</h4>
//               <small className="text-muted">Total Users</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaCheckCircle size={20} className="text-success" />
//               </div>
//               <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
//               <small className="text-muted">Present</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaTimesCircle size={20} className="text-danger" />
//               </div>
//               <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
//               <small className="text-muted">Absent</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="text-center">
//               <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
//                 <FaClock size={20} className="text-info" />
//               </div>
//               <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
//               <small className="text-muted">Attendance Rate</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <div className="mb-3 d-flex justify-content-between align-items-center">
//         <div className="btn-group">
//           <Button 
//             variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('table')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaTable /> Table View
//           </Button>
//           <Button 
//             variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
//             onClick={() => setViewMode('card')}
//             className="d-flex align-items-center gap-2"
//           >
//             <FaThLarge /> Card View
//           </Button>
//         </div>
//         <small className="text-muted">
//           Showing {filteredData.length} of {attendanceData.length} users
//         </small>
//       </div>

//       {viewMode === 'table' ? TableView : CardView}

//       {/* Leave Approval Modal */}
//       <LeaveApprovalModal
//         show={showModal}
//         onHide={() => {
//           setShowModal(false);
//           setSelectedUser(null);
//           setSelectedAttendance(null);
//         }}
//         user={selectedUser}
//         currentAttendance={selectedAttendance}
//         onApprove={handleLeaveApproval}
//         onReject={handleLeaveApproval}
//         approving={approvingLeave !== null}
//       />
//     </Container>
//   );
// }














import React, { useEffect, useContext, useState, useMemo, useCallback, useRef } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { UserAttendanceDashboard, MarkUserAttendanceManually, leaveApproval } from "../../service/User.service";
import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaUserTag, FaSchool, FaDownload, FaSyncAlt, FaThLarge, FaTable, FaCalendarAlt, FaCheck, FaTimes, FaEye, FaFileImage, FaDownload as FaDownloadIcon } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// Leave Approval Modal Component
const LeaveApprovalModal = React.memo(({ 
  show, 
  onHide, 
  user, 
  currentAttendance,
  onApprove,
  onReject,
  approving 
}) => {
  const [approvalRemark, setApprovalRemark] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setApprovalRemark("");
      setSelectedAction("");
    }
  }, [show]);

  const handleSubmit = () => {
    if (!selectedAction || !approvalRemark.trim()) {
      return;
    }
    const isApproved = selectedAction === 'approve';
    onApprove(user, isApproved, approvalRemark);
  };

  // Handle file download
  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaEye className="me-2" />
          Leave Approval - {user?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentAttendance && (
          <div className="p-3">
            {/* User Info */}
            <div className="mb-3">
              <h6 className="fw-bold text-primary">User Information</h6>
              <div className="bg-light p-3 rounded">
                <Row>
                  <Col md={6}>
                    <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
                    <p className="mb-1"><strong>Role:</strong> {user?.role}</p>
                    <p className="mb-1"><strong>User ID:</strong> {user?.userId}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1"><strong>Date:</strong> {currentAttendance?.date ? new Date(currentAttendance.date).toLocaleDateString() : 'N/A'}</p>
                    <p className="mb-1"><strong>Leave Type:</strong> {currentAttendance?.attendance || "N/A"}</p>
                    <p className="mb-1"><strong>Status:</strong> {
                      currentAttendance?.isLeaveApproved === true ? <Badge bg="success">✅ Approved</Badge> :
                      currentAttendance?.isLeaveApproved === false ? <Badge bg="danger">❌ Rejected</Badge> :
                      <Badge bg="warning">⏳ Pending</Badge>
                    }</p>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-3">
              <h6 className="fw-bold text-primary">Reason for Leave</h6>
              <div className="bg-light p-3 rounded">
                <p className="mb-0">{currentAttendance?.reasonIfNotPresent || "No reason provided"}</p>
              </div>
            </div>

            {/* Attachment - Hyperlink instead of preview */}
            {currentAttendance?.fileUrl && (
              <div className="mb-3">
                <h6 className="fw-bold text-primary">Attachment</h6>
                <div className="bg-light p-3 rounded">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleDownload(currentAttendance.fileUrl, currentAttendance.fileName)}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaDownloadIcon size={14} />
                    View Attachment
                  </Button>
                  {currentAttendance.fileName && (
                    <small className="text-muted d-block mt-1">
                      File: {currentAttendance.fileName}
                    </small>
                  )}
                </div>
              </div>
            )}

            {/* Approval Action - Only show if not already approved/rejected */}
            {currentAttendance?.isLeaveApproved === null && (
              <>
                <hr />
                <div className="mb-3">
                  <h6 className="fw-bold text-primary">Approval Action</h6>
                  <Form.Select 
                    className="mb-2"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    disabled={approving}
                  >
                    <option value="">Select Action</option>
                    <option value="approve">✅ Approve</option>
                    <option value="reject">❌ Reject</option>
                  </Form.Select>
                  
                  <Form.Control
                    type="text"
                    placeholder="Enter approval remark *"
                    value={approvalRemark}
                    onChange={(e) => setApprovalRemark(e.target.value)}
                    disabled={approving}
                    isInvalid={selectedAction && !approvalRemark.trim()}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter approval remark
                  </Form.Control.Feedback>
                </div>
              </>
            )}

            {/* Already Approved/Rejected */}
            {currentAttendance?.isLeaveApproved !== null && (
              <div className="mt-3 p-3 bg-light rounded">
                <h6 className="fw-bold text-primary">Approval Status</h6>
                <p className="mb-1">
                  <strong>Status:</strong> {currentAttendance.isLeaveApproved ? '✅ Approved' : '❌ Rejected'}
                </p>
                {currentAttendance.approvalRemark && (
                  <p className="mb-1"><strong>Remark:</strong> {currentAttendance.approvalRemark}</p>
                )}
                {currentAttendance.approvedBy && (
                  <p className="mb-0"><strong>Approved By:</strong> {currentAttendance.approvedBy}</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={approving}>
          Close
        </Button>
        {currentAttendance?.isLeaveApproved === null && (
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={approving || !selectedAction || !approvalRemark.trim()}
          >
            {approving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <FaCheck className="me-2" />
                Submit Approval
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
});

// Separate Row Component for Table to prevent re-renders
const TableRow = React.memo(({ 
  user, 
  index, 
  attendanceFormData, 
  markingAttendance, 
  loading, 
  updateAttendanceFormData, 
  handleAttendanceChange, 
  canMarkAttendance, 
  getAttendanceBadge,
  handleLeaveApproval,
  approvingLeave,
  onViewLeave
}) => {
  const currentAttendance = user.userAttendanceDetails?.[0];
  const attendanceStatus = currentAttendance?.attendance || "Not Marked";
  const attendanceType = currentAttendance?.attendanceType || null;
  const formData = attendanceFormData[user._id] || {};
  const isMarking = markingAttendance === user._id;
  const isApproving = approvingLeave === user._id;
  const isDisabled = isMarking || isApproving || loading;
  
  const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
  const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
  const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
  const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
  const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localVisitingLocation !== formData.visitingLocation) {
        updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localRemark !== formData.remarkForManualAttendance) {
        updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localAttendanceType !== formData.attendanceType) {
        updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localLeaveStatus !== formData.leaveStatus) {
        updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localApprovalRemark !== formData.approvalRemark) {
        updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
  // Check if attendance is already marked
  const isAttendanceMarked = currentAttendance && currentAttendance.attendance && currentAttendance.attendance !== "Not Marked";
  const isLeaveAttendance = attendanceType === "Leave" && isAttendanceMarked;
  const isLeaveApproved = currentAttendance?.isLeaveApproved;
  
  // Check if attendanceType is null/undefined/blank (no attendance marked)
  const isNoAttendance = !attendanceType || attendanceType === null || attendanceType === undefined || attendanceType === "";

  const getLeaveStatusBadge = () => {
    if (isLeaveApproved === true) {
      return <Badge bg="success" className="px-2 py-1">✅ Approved</Badge>;
    } else if (isLeaveApproved === false) {
      return <Badge bg="danger" className="px-2 py-1">❌ Rejected</Badge>;
    } else if (isLeaveAttendance) {
      return <Badge bg="warning" className="text-dark px-2 py-1">⏳ Pending</Badge>;
    } else {
      return null;
    }
  };

  // Get attendance options based on attendance type
  const getAttendanceOptions = () => {
    // CASE 2: Existing Leave Attendance - Only show View button, no dropdown
    if (isLeaveAttendance) {
      return (
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => onViewLeave(user)}
          className="d-flex align-items-center gap-1"
        >
          <FaEye size={14} />
          View Details
        </Button>
      );
    }
    
    // CASE 1: No attendance marked OR other attendance types
    if (localAttendanceType === "Manual Attendance") {
      return (
        <Form.Select 
          size="sm"
          style={{ width: '140px' }}
          value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
          onChange={(e) => handleAttendanceChange(user, e.target.value, {
            attendanceType: localAttendanceType,
            visitingLocation: localVisitingLocation,
            remarkForManualAttendance: localRemark,
            approvalRemark: localApprovalRemark
          })}
          disabled={isDisabled || isAttendanceMarked}
        >
          <option value="">Select</option>
          <option value="Present">✅ Present</option>
        </Form.Select>
      );
    } else if (localAttendanceType === "Field Visit") {
      return (
        <Form.Select 
          size="sm"
          style={{ width: '140px' }}
          value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
          onChange={(e) => handleAttendanceChange(user, e.target.value, {
            attendanceType: localAttendanceType,
            visitingLocation: localVisitingLocation,
            remarkForManualAttendance: localRemark,
            approvalRemark: localApprovalRemark
          })}
          disabled={isDisabled || isAttendanceMarked}
        >
          <option value="">Select</option>
          <option value="Present">✅ Present</option>
        </Form.Select>
      );
    } else if (localAttendanceType === "Leave") {
      return (
        <Form.Select 
          size="sm"
          style={{ width: '140px' }}
          value={localLeaveStatus || ""}
          onChange={(e) => setLocalLeaveStatus(e.target.value)}
          disabled={isDisabled || isAttendanceMarked}
        >
          <option value="">Select Leave Type</option>
          <option value="Emergency Leave">🚨 Emergency Leave</option>
          <option value="LWP">LWP</option>
          <option value="Absent">🏖️ Absent</option>
          <option value="WFH">🏠 WFH</option>
          <option value="Comp-off">📅 Comp-off</option>
          <option value="Medical Leave">🏥 Medical Leave</option>
          <option value="Sick Leave">🤒 Sick Leave</option>
          <option value="Half Day">⏳ Half Day</option>
        </Form.Select>
      );
    }
    return null;
  };

  return (
    <tr className="border-bottom">
      <td className="fw-bold">{index + 1}</td>
      <td>
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
            <FaUserTag size={16} className="text-primary" />
          </div>
          <div>
            <div className="fw-semibold">{user.name}</div>
            {isLeaveAttendance && (
              <div className="mt-1">
                {getLeaveStatusBadge()}
              </div>
            )}
          </div>
        </div>
      </td>
      <td><Badge bg="info" className="px-3 py-1">{user.role}</Badge></td>
      <td>{getAttendanceBadge(attendanceStatus)}</td>
      <td>
        {currentAttendance?.loginTime ? (
          <div>
            <small>{new Date(currentAttendance.loginTime).toLocaleDateString()}</small>
            <br />
            <small className="text-muted">{new Date(currentAttendance.loginTime).toLocaleTimeString()}</small>
          </div>
        ) : '-'}
      </td>
      <td style={{ minWidth: '280px' }}>
        <div className="d-flex flex-column gap-2">
          {/* CASE 2: Existing Leave Attendance - Show only View button */}
          {isLeaveAttendance ? (
            <div className="d-flex gap-2">
              <Form.Select 
                size="sm" 
                style={{ width: '120px' }}
                value="Leave"
                disabled={true}
              >
                <option value="Leave">Leave</option>
              </Form.Select>
              {getAttendanceOptions()}
            </div>
          ) : (
            /* CASE 1: No attendance marked OR other types - Regular UI */
            <>
              <div className="d-flex gap-2">
                <Form.Select 
                  size="sm" 
                  style={{ width: '120px' }}
                  value={isAttendanceMarked ? (attendanceType || "Manual Attendance") : localAttendanceType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setLocalAttendanceType(newType);
                    if (newType !== "Leave") {
                      setLocalLeaveStatus("");
                      setLocalApprovalRemark("");
                    }
                  }}
                  disabled={isDisabled || isAttendanceMarked}
                >
                  <option value="Manual Attendance">Manual Attendance</option>
                  <option value="Field Visit">Field Visit</option>
                  <option value="Leave">Leave</option>
                </Form.Select>
                
                {getAttendanceOptions()}
              </div>
              
              {localAttendanceType === "Field Visit" && (
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Visiting location *"
                  value={localVisitingLocation}
                  onChange={(e) => setLocalVisitingLocation(e.target.value)}
                  disabled={isDisabled || isAttendanceMarked}
                  isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
                />
              )}
              
              {localAttendanceType === "Manual Attendance" && (
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Remark *"
                  value={localRemark}
                  onChange={(e) => setLocalRemark(e.target.value)}
                  disabled={isDisabled || isAttendanceMarked}
                  isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
                />
              )}
              
              {localAttendanceType === "Leave" && !isAttendanceMarked && (
                <>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Approval remark *"
                    value={localApprovalRemark}
                    onChange={(e) => setLocalApprovalRemark(e.target.value)}
                    disabled={isDisabled}
                    isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
                  />
                  {localLeaveStatus && localApprovalRemark.trim() && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        handleAttendanceChange(user, localLeaveStatus, {
                          attendanceType: localAttendanceType,
                          visitingLocation: localVisitingLocation,
                          remarkForManualAttendance: localRemark,
                          approvalRemark: localApprovalRemark
                        });
                      }}
                      disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      {isMarking ? (
                        <Spinner size="sm" />
                      ) : (
                        <FaCheck size={14} />
                      )}
                      Submit Leave
                    </Button>
                  )}
                </>
              )}
            </>
          )}
          
          {isMarking && <Spinner size="sm" />}
        </div>
      </td>
    </tr>
  );
});

// Card Component - keeping it similar but compact
const UserCard = React.memo(({ 
  user, 
  index, 
  attendanceFormData, 
  markingAttendance, 
  loading, 
  updateAttendanceFormData, 
  handleAttendanceChange, 
  canMarkAttendance, 
  getAttendanceBadge,
  handleLeaveApproval,
  approvingLeave,
  onViewLeave
}) => {
  const currentAttendance = user.userAttendanceDetails?.[0];
  const attendanceStatus = currentAttendance?.attendance || "Not Marked";
  const attendanceType = currentAttendance?.attendanceType || null;
  const formData = attendanceFormData[user._id] || {};
  const isMarking = markingAttendance === user._id;
  const isApproving = approvingLeave === user._id;
  const isDisabled = isMarking || isApproving || loading;
  
  const [localVisitingLocation, setLocalVisitingLocation] = useState(formData.visitingLocation || "");
  const [localRemark, setLocalRemark] = useState(formData.remarkForManualAttendance || "");
  const [localAttendanceType, setLocalAttendanceType] = useState(formData.attendanceType || "Manual Attendance");
  const [localLeaveStatus, setLocalLeaveStatus] = useState(formData.leaveStatus || "");
  const [localApprovalRemark, setLocalApprovalRemark] = useState(formData.approvalRemark || "");
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localVisitingLocation !== formData.visitingLocation) {
        updateAttendanceFormData(user._id, 'visitingLocation', localVisitingLocation);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localVisitingLocation, user._id, formData.visitingLocation, updateAttendanceFormData]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localRemark !== formData.remarkForManualAttendance) {
        updateAttendanceFormData(user._id, 'remarkForManualAttendance', localRemark);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localRemark, user._id, formData.remarkForManualAttendance, updateAttendanceFormData]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localAttendanceType !== formData.attendanceType) {
        updateAttendanceFormData(user._id, 'attendanceType', localAttendanceType);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localAttendanceType, user._id, formData.attendanceType, updateAttendanceFormData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localLeaveStatus !== formData.leaveStatus) {
        updateAttendanceFormData(user._id, 'leaveStatus', localLeaveStatus);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localLeaveStatus, user._id, formData.leaveStatus, updateAttendanceFormData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localApprovalRemark !== formData.approvalRemark) {
        updateAttendanceFormData(user._id, 'approvalRemark', localApprovalRemark);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localApprovalRemark, user._id, formData.approvalRemark, updateAttendanceFormData]);
  
  const isAttendanceMarked = currentAttendance && currentAttendance.attendance && currentAttendance.attendance !== "Not Marked";
  const isLeaveAttendance = attendanceType === "Leave" && isAttendanceMarked;
  const isLeaveApproved = currentAttendance?.isLeaveApproved;

  const getCardBorderClass = () => {
    if (attendanceStatus === "Present") return "border-success";
    if (attendanceStatus === "Absent") return "border-danger";
    if (attendanceStatus === "Half Day") return "border-warning";
    if (attendanceStatus === "WFH") return "border-info";
    return "border-secondary";
  };

  const getAttendanceOptions = () => {
    // CASE 2: Existing Leave Attendance - Only show View button
    if (isLeaveAttendance) {
      return (
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => onViewLeave(user)}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FaEye size={14} />
          View Details
        </Button>
      );
    }
    
    if (localAttendanceType === "Manual Attendance") {
      return (
        <Form.Select 
          size="sm"
          value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
          onChange={(e) => handleAttendanceChange(user, e.target.value, {
            attendanceType: localAttendanceType,
            visitingLocation: localVisitingLocation,
            remarkForManualAttendance: localRemark,
            approvalRemark: localApprovalRemark
          })}
          disabled={isDisabled || isAttendanceMarked}
          className="bg-white"
        >
          <option value="">Select</option>
          <option value="Present">✅ Present</option>
        </Form.Select>
      );
    } else if (localAttendanceType === "Field Visit") {
      return (
        <Form.Select 
          size="sm"
          value={attendanceStatus === "Not Marked" ? "" : attendanceStatus}
          onChange={(e) => handleAttendanceChange(user, e.target.value, {
            attendanceType: localAttendanceType,
            visitingLocation: localVisitingLocation,
            remarkForManualAttendance: localRemark,
            approvalRemark: localApprovalRemark
          })}
          disabled={isDisabled || isAttendanceMarked}
          className="bg-white"
        >
          <option value="">Select</option>
          <option value="Present">✅ Present</option>
        </Form.Select>
      );
    } else if (localAttendanceType === "Leave") {
      return (
        <Form.Select 
          size="sm"
          value={localLeaveStatus || ""}
          onChange={(e) => setLocalLeaveStatus(e.target.value)}
          disabled={isDisabled || isAttendanceMarked}
          className="bg-white"
        >
          <option value="">Select Leave Type</option>
          <option value="Emergency Leave">🚨 Emergency Leave</option>
          <option value="LWP">LWP</option>
          <option value="Absent">🏖️ Absent</option>
          <option value="WFH">🏠 WFH</option>
          <option value="Comp-off">📅 Comp-off</option>
          <option value="Medical Leave">🏥 Medical Leave</option>
          <option value="Sick Leave">🤒 Sick Leave</option>
          <option value="Half Day">⏳ Half Day</option>
        </Form.Select>
      );
    }
    return null;
  };
  
  return (
    <Col md={6} lg={4} xl={3}>
      <Card className={`border-2 shadow-lg h-100 ${getCardBorderClass()}`} style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
        <Card.Header className={`bg-white py-3 border-bottom-2 ${getCardBorderClass()}`}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="secondary" className="px-3 py-2 rounded-pill">#{index + 1}</Badge>
                <Badge bg="primary" className="px-3 py-2 rounded-pill">{user.role}</Badge>
                {isLeaveAttendance && (
                  <Badge bg={isLeaveApproved === true ? "success" : isLeaveApproved === false ? "danger" : "warning"} 
                         className="px-2 py-1 rounded-pill">
                    {isLeaveApproved === true ? "✅ Approved" : isLeaveApproved === false ? "❌ Rejected" : "⏳ Pending"}
                  </Badge>
                )}
              </div>
              <h5 className="mb-1 fw-bold text-dark">{user.name}</h5>
            </div>
            <div className="text-end">
              {getAttendanceBadge(attendanceStatus)}
            </div>
          </div>
        </Card.Header>
        <Card.Body className="bg-light">
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaSchool className="text-primary" />
              <small className="text-muted fw-bold">Region:</small>
            </div>
            <p className="mb-0 small fw-semibold text-dark bg-white p-2 rounded border">
              {user.role === 'CC' 
                ? user.schoolsData?.map(s => s.schoolName).join(', ')
                : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')}
            </p>
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaClock className="text-warning" />
              <small className="text-muted fw-bold">Last Login:</small>
            </div>
            <p className="mb-0 small bg-white p-2 rounded border">
              {currentAttendance?.loginTime 
                ? new Date(currentAttendance.loginTime).toLocaleString()
                : 'Not logged in'}
            </p>
          </div>
          
          <hr className="my-3" />
          
          {isLeaveAttendance ? (
            /* CASE 2: Existing Leave Attendance - Show only View button */
            <>
              <div className="mb-3">
                <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
                <Form.Select 
                  size="sm" 
                  value="Leave"
                  disabled={true}
                  className="bg-white"
                >
                  <option value="Leave">Leave</option>
                </Form.Select>
              </div>
              
              {/* Show status if already approved/rejected */}
              {isLeaveApproved !== null && (
                <div className="mb-3 p-2 bg-white rounded border">
                  <small className="text-muted">
                    {isLeaveApproved ? '✅ Approved' : '❌ Rejected'} 
                    {currentAttendance?.approvalRemark && ` - ${currentAttendance.approvalRemark}`}
                  </small>
                </div>
              )}
              
              {/* View button for leave */}
              <Button
                size="sm"
                variant="outline-info"
                onClick={() => onViewLeave(user)}
                className="w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FaEye size={14} />
                View Details
              </Button>
            </>
          ) : (
            /* CASE 1: No attendance marked OR other types - Regular UI */
            <>
              <div className="mb-3">
                <Form.Label className="fw-semibold small">Attendance Type</Form.Label>
                <Form.Select 
                  size="sm" 
                  value={isAttendanceMarked ? (attendanceType || "Manual Attendance") : localAttendanceType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setLocalAttendanceType(newType);
                    if (newType !== "Leave") {
                      setLocalLeaveStatus("");
                      setLocalApprovalRemark("");
                    }
                  }}
                  disabled={isDisabled || isAttendanceMarked}
                  className="bg-white"
                >
                  <option value="Manual Attendance">Manual Attendance</option>
                  <option value="Field Visit">Field Visit</option>
                  <option value="Leave">Leave</option>
                </Form.Select>
              </div>
              
              {localAttendanceType === "Field Visit" && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Visiting Location <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter visiting location"
                    value={localVisitingLocation}
                    onChange={(e) => setLocalVisitingLocation(e.target.value)}
                    disabled={isDisabled || isAttendanceMarked}
                    isInvalid={localAttendanceType === "Field Visit" && !localVisitingLocation.trim()}
                    className="bg-white"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter visiting location
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              
              {localAttendanceType === "Manual Attendance" && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Remark <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    size="sm"
                    as="textarea"
                    rows={2}
                    placeholder="Enter remark"
                    value={localRemark}
                    onChange={(e) => setLocalRemark(e.target.value)}
                    disabled={isDisabled || isAttendanceMarked}
                    isInvalid={localAttendanceType === "Manual Attendance" && !localRemark.trim()}
                    className="bg-white"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter remark
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              
              {localAttendanceType === "Leave" && !isAttendanceMarked && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Approval Remark <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Enter approval remark"
                      value={localApprovalRemark}
                      onChange={(e) => setLocalApprovalRemark(e.target.value)}
                      disabled={isDisabled}
                      isInvalid={localAttendanceType === "Leave" && !localApprovalRemark.trim()}
                      className="bg-white"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter approval remark
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  {localLeaveStatus && localApprovalRemark.trim() && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        handleAttendanceChange(user, localLeaveStatus, {
                          attendanceType: localAttendanceType,
                          visitingLocation: localVisitingLocation,
                          remarkForManualAttendance: localRemark,
                          approvalRemark: localApprovalRemark
                        });
                      }}
                      disabled={isDisabled || !localLeaveStatus || !localApprovalRemark.trim()}
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      {isMarking ? (
                        <Spinner size="sm" />
                      ) : (
                        <FaCheck size={14} />
                      )}
                      Submit Leave
                    </Button>
                  )}
                </>
              )}
            </>
          )}
          
          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold small">Mark Attendance</Form.Label>
            {!isLeaveAttendance && getAttendanceOptions()}
          </Form.Group>
          
          {isMarking && (
            <div className="text-center mt-2">
              <Spinner size="sm" animation="border" variant="primary" />
              <span className="ms-2 small">Updating...</span>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="bg-white text-muted small py-2">
          <div className="d-flex justify-content-between align-items-center">
            {currentAttendance?.attendance && currentAttendance.attendance !== "Not Marked" && (
              <Badge bg="success" className="rounded-pill">Updated</Badge>
            )}
            {isLeaveAttendance && isLeaveApproved !== null && (
              <Badge bg={isLeaveApproved ? "success" : "danger"} className="rounded-pill">
                {isLeaveApproved ? "Approved" : "Rejected"}
              </Badge>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
});

export const UserAttendanceDashboardV2 = () => {
  const { userData } = useContext(UserContext);
  const { startDate, setStartDate } = useContext(DateNDateRangeContext);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(null);
  const [approvingLeave, setApprovingLeave] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    date: null,
    role: null,
    district: null,
    school: null,
    attendanceType: "",
    attendanceStatus: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendanceFormData, setAttendanceFormData] = useState({});
  const [exporting, setExporting] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [roleOptions, setRoleOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  const getCurrentDate = useCallback(() => {
    return filters.date || startDate?.YYYYMMDD || new Date().toISOString().split('T')[0];
  }, [filters.date, startDate]);

  const getRoleFilter = useCallback(() => {
    if (userData?.role === 'ACI') {
      return "CC";
    } else if (userData?.role === 'Community Manager') {
      return ["CC", "ACI"];
    }
    return undefined;
  }, [userData]);

  const sortUsersByName = useCallback((users) => {
    return [...users].sort((a, b) => a.name?.localeCompare(b.name));
  }, []);

  const getSchoolIdsFromUserAccess = useCallback((userData) => {
    const schoolIds = [];
    if (userData?.userAccess?.region) {
      userData.userAccess.region.forEach(district => {
        district.blockIds?.forEach(block => {
          block.schoolIds?.forEach(school => {
            if (school.schoolId) {
              schoolIds.push(school.schoolId);
            }
          });
        });
      });
    }
    return schoolIds;
  }, []);

  const fetchAttendanceData = useCallback(async () => {
    setLoading(true);
    try {
      const roleFilter = getRoleFilter();
      const currentDate = getCurrentDate();
      const schoolIds = getSchoolIdsFromUserAccess(userData);

      const reqBody = {
        date: startDate || currentDate,
        role: roleFilter,
        schoolIds: schoolIds,
        attendanceType: filters.attendanceType || undefined,
        attendanceStatus: filters.attendanceStatus || undefined
      };
      
      const response = await UserAttendanceDashboard(reqBody);
      if (response.status === "Ok") {
        const sortedData = sortUsersByName(response.data);
        setAttendanceData(sortedData);
        setFilteredData(sortedData);
        
        const uniqueRoles = [...new Set(sortedData.map(user => user.role))];
        setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));
        
        const allDistricts = new Set();
        sortedData.forEach(user => {
          user.schoolsData?.forEach(school => {
            if (school.districtName) {
              allDistricts.add(school.districtName);
            }
          });
        });
        setDistrictOptions([...allDistricts].map(district => ({ 
          value: district, 
          label: district 
        })));
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setErrorMessage("Failed to fetch attendance data");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }, [getRoleFilter, getCurrentDate, sortUsersByName, getSchoolIdsFromUserAccess, userData, startDate, filters.attendanceType, filters.attendanceStatus]);

  // Export to Excel function
  const handleExport = useCallback(async () => {
    if (filteredData.length === 0) {
      setErrorMessage("No data to export");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setExporting(true);
    try {
      // Prepare data for export
      const exportData = filteredData.map((user, index) => {
        const currentAttendance = user.userAttendanceDetails?.[0] || {};
        const attendanceStatus = currentAttendance?.attendance || "Not Marked";
        const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
        
        return {
          'S.No': index + 1,
          'Name': user.name || '',
          'User ID': user.userId || '',
          'Role': user.role || '',
          'Attendance Status': attendanceStatus,
          'Attendance Type': attendanceType,
          'Date': currentAttendance?.date ? new Date(currentAttendance.date).toLocaleDateString() : '-',
          'Login Time': currentAttendance?.loginTime ? new Date(currentAttendance.loginTime).toLocaleString() : '-',
          'Leave Status': currentAttendance?.isLeaveApproved === true ? 'Approved' : 
                          currentAttendance?.isLeaveApproved === false ? 'Rejected' : 
                          currentAttendance?.attendanceType === 'Leave' ? 'Pending' : 'N/A',
          'Approval Remark': currentAttendance?.approvalRemark || '-',
          'Reason': currentAttendance?.reasonIfNotPresent || '-',
          'Region': user.role === 'CC' 
            ? user.schoolsData?.map(s => s.schoolName).join(', ') 
            : [...new Set(user.schoolsData?.map(s => s.districtName))].join(', ')
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      const colWidths = [
        { wch: 6 },  // S.No
        { wch: 25 }, // Name
        { wch: 15 }, // User ID
        { wch: 15 }, // Role
        { wch: 20 }, // Attendance Status
        { wch: 20 }, // Attendance Type
        { wch: 15 }, // Date
        { wch: 20 }, // Login Time
        { wch: 15 }, // Leave Status
        { wch: 30 }, // Approval Remark
        { wch: 30 }, // Reason
        { wch: 40 }  // Region
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `Attendance_Report_${dateStr}.xlsx`;

      // Export
      XLSX.writeFile(wb, filename);
      
      setSuccessMessage(`✅ Attendance data exported successfully as ${filename}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error exporting data:", error);
      setErrorMessage("Failed to export data: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setExporting(false);
    }
  }, [filteredData]);

  const handleDateChange = useCallback((dateObj) => {
    if (dateObj && dateObj.YYYYMMDD) {
      setFilters(prev => ({ ...prev, date: dateObj.YYYYMMDD }));
      if (setStartDate) {
        setStartDate(dateObj);
      }
    }
  }, [setStartDate]);

  useEffect(() => {
    if (filters.district) {
      const allSchools = new Set();
      attendanceData.forEach(user => {
        user.schoolsData?.forEach(school => {
          if (school.districtName === filters.district.value && school.schoolName) {
            allSchools.add(school.schoolName);
          }
        });
      });
      setSchoolOptions([...allSchools].map(school => ({ 
        value: school, 
        label: school 
      })));
    } else {
      setSchoolOptions([]);
    }
  }, [filters.district, attendanceData]);

  useEffect(() => {
    let filtered = [...attendanceData];
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role.value);
    }
    
    if (filters.district) {
      filtered = filtered.filter(user => 
        user.schoolsData?.some(school => school.districtName === filters.district.value)
      );
    }
    
    if (filters.school) {
      filtered = filtered.filter(user => 
        user.schoolsData?.some(school => school.schoolName === filters.school.value)
      );
    }
    
    if (filters.attendanceType) {
      filtered = filtered.filter(user => {
        const currentAttendance = user.userAttendanceDetails?.[0];
        const attendanceType = currentAttendance?.attendanceType || "Daily Attendance";
        return attendanceType === filters.attendanceType;
      });
    }
    
    if (filters.attendanceStatus) {
      filtered = filtered.filter(user => {
        const currentAttendance = user.userAttendanceDetails?.[0];
        const status = currentAttendance?.attendance || "Not Marked";
        return status === filters.attendanceStatus;
      });
    }
    
    setFilteredData(sortUsersByName(filtered));
  }, [filters.role, filters.district, filters.school, filters.attendanceType, filters.attendanceStatus, attendanceData, sortUsersByName]);

  const canMarkAttendance = useCallback((user, attendanceStatus, formData) => {
    if (!attendanceStatus) return false;
    
    if (formData.attendanceType === "Field Visit" && !formData.visitingLocation?.trim()) {
      return false;
    }
    
    if (formData.attendanceType === "Manual Attendance" && !formData.remarkForManualAttendance?.trim()) {
      return false;
    }
    
    if (formData.attendanceType === "Leave" && !formData.approvalRemark?.trim()) {
      return false;
    }
    
    return true;
  }, []);

  const handleAttendanceChange = useCallback(async (user, attendanceStatus, currentFormData) => {
    if (!canMarkAttendance(user, attendanceStatus, currentFormData)) {
      if (currentFormData.attendanceType === "Field Visit" && !currentFormData.visitingLocation?.trim()) {
        setErrorMessage("Please enter visiting location for Field Visit");
      } else if (currentFormData.attendanceType === "Manual Attendance" && !currentFormData.remarkForManualAttendance?.trim()) {
        setErrorMessage("Please enter remark for Manual Attendance");
      } else if (currentFormData.attendanceType === "Leave" && !currentFormData.approvalRemark?.trim()) {
        setErrorMessage("Please enter approval remark for Leave");
      } else {
        setErrorMessage("Please select valid attendance status");
      }
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setMarkingAttendance(user._id);
    try {
      const currentDate = getCurrentDate();
      
      const reqBody = {
        _id: user._id,
        userId: user.userId,
        date: startDate || currentDate,
        attendance: attendanceStatus,
        attendanceType: currentFormData.attendanceType || "Manual Attendance",
        attendanceMarkedBy: userData?._id || "Admin",
        loginTime: new Date().toISOString(),
        logoutTime: new Date().toISOString(),
        longitude: user.longitude || 0,
        latitude: user.latitude || 0,
        visitingLocation: currentFormData.visitingLocation || null,
        remarkForManualAttendance: currentFormData.remarkForManualAttendance || null
      };
      
      const response = await MarkUserAttendanceManually(reqBody);
      if (response.status === "Ok") {
        let updatedAttendanceData = attendanceData.map(existingUser => {
          if (existingUser._id === user._id) {
            const updatedUser = { ...existingUser };
            const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
            updatedUser.userAttendanceDetails = [{
              ...existingAttendance,
              attendance: attendanceStatus,
              attendanceType: currentFormData.attendanceType || "Manual Attendance",
              date: currentDate,
              loginTime: new Date().toISOString(),
              logoutTime: new Date().toISOString()
            }];
            
            return updatedUser;
          }
          return existingUser;
        });
        
        if (currentFormData.attendanceType === "Leave") {
          const attendanceId = response.data?._id || user.userAttendanceDetails?.[0]?._id;
          
          if (attendanceId) {
            const leaveApprovalBody = {
              attendanceId: attendanceId,
              isLeaveApproved: true,
              approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
              approvedBy: userData?._id || "Admin"
            };
            
            const leaveResponse = await leaveApproval(leaveApprovalBody);
            if (leaveResponse.status === "Ok") {
              updatedAttendanceData = updatedAttendanceData.map(existingUser => {
                if (existingUser._id === user._id) {
                  const updatedUser = { ...existingUser };
                  const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
                  
                  updatedUser.userAttendanceDetails = [{
                    ...existingAttendance,
                    isLeaveApproved: true,
                    approvalRemark: currentFormData.approvalRemark?.trim() || "Auto-approved",
                    approvedBy: userData?._id || "Admin",
                    updatedAt: new Date().toISOString()
                  }];
                  
                  return updatedUser;
                }
                return existingUser;
              });
            }
          }
        }
        
        const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
        setAttendanceData(sortedUpdatedData);
        
        setAttendanceFormData(prev => ({
          ...prev,
          [user._id]: {}
        }));
        
        const message = currentFormData.attendanceType === "Leave" 
          ? `✅ Leave marked and auto-approved for ${user.name}`
          : `✅ Attendance marked as ${attendanceStatus} for ${user.name}`;
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setErrorMessage("Failed to mark attendance");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setErrorMessage("Error marking attendance: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setMarkingAttendance(null);
    }
  }, [attendanceData, canMarkAttendance, getCurrentDate, sortUsersByName, userData?._id, startDate]);

  const handleLeaveApproval = useCallback(async (user, isApproved, approvalRemark) => {
    if (!approvalRemark?.trim()) {
      setErrorMessage("Please enter approval remark");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const attendanceId = user.userAttendanceDetails?.[0]?._id;
    if (!attendanceId) {
      setErrorMessage("Attendance record not found");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setApprovingLeave(user._id);
    try {
      const reqBody = {
        attendanceId: attendanceId,
        isLeaveApproved: isApproved,
        approvalRemark: approvalRemark.trim(),
        approvedBy: userData?._id || "Admin"
      };

      const response = await leaveApproval(reqBody);
      if (response.status === "Ok") {
        const updatedAttendanceData = attendanceData.map(existingUser => {
          if (existingUser._id === user._id) {
            const updatedUser = { ...existingUser };
            const existingAttendance = updatedUser.userAttendanceDetails?.[0] || {};
            
            updatedUser.userAttendanceDetails = [{
              ...existingAttendance,
              isLeaveApproved: isApproved,
              approvalRemark: approvalRemark.trim(),
              approvedBy: userData?._id || "Admin",
              updatedAt: new Date().toISOString()
            }];
            
            return updatedUser;
          }
          return existingUser;
        });
        
        const sortedUpdatedData = sortUsersByName(updatedAttendanceData);
        setAttendanceData(sortedUpdatedData);
        
        setAttendanceFormData(prev => ({
          ...prev,
          [user._id]: {}
        }));
        
        // Close modal if open
        setShowModal(false);
        setSelectedUser(null);
        setSelectedAttendance(null);
        
        setSuccessMessage(`✅ Leave ${isApproved ? 'Approved' : 'Rejected'} for ${user.name}`);
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setErrorMessage(response.message || "Failed to update leave approval");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error in leave approval:", error);
      setErrorMessage("Error updating leave approval: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setApprovingLeave(null);
    }
  }, [attendanceData, sortUsersByName, userData?._id]);

  const handleViewLeave = useCallback((user) => {
    const attendance = user.userAttendanceDetails?.[0];
    if (attendance) {
      setSelectedUser(user);
      setSelectedAttendance(attendance);
      setShowModal(true);
    }
  }, []);

  const updateAttendanceFormData = useCallback((userId, field, value) => {
    setAttendanceFormData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      date: null,
      role: null,
      district: null,
      school: null,
      attendanceType: "",
      attendanceStatus: ""
    });
    setSchoolOptions([]);
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData, filters.date]);

  const getAttendanceBadge = useCallback((attendance) => {
    switch(attendance) {
      case 'Present': return <Badge bg="success" className="px-3 py-2 rounded-pill">✅ Present</Badge>;
      case 'Absent': return <Badge bg="danger" className="px-3 py-2 rounded-pill">❌ Absent</Badge>;
      case 'Half Day': return <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill">⏳ Half Day</Badge>;
      case 'WFH': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏠 WFH</Badge>;
      case 'Comp-off': return <Badge bg="secondary" className="px-3 py-2 rounded-pill">📅 Comp-off</Badge>;
      case 'Emergency Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🚨 Emergency Leave</Badge>;
      case 'Medical Leave': return <Badge bg="info" className="px-3 py-2 rounded-pill">🏥 Medical Leave</Badge>;
      case 'Sick Leave': return <Badge bg="danger" className="px-3 py-2 rounded-pill">🤒 Sick Leave</Badge>;
      case 'LWP': return <Badge bg="dark" className="px-3 py-2 rounded-pill">⚠️ LWP</Badge>;
      default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">⭕ Not Marked</Badge>;
    }
  }, []);

  const totalUsers = filteredData.length;
  const presentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Present').length;
  const absentCount = filteredData.filter(user => user.userAttendanceDetails?.[0]?.attendance === 'Absent').length;
  const attendancePercentage = totalUsers > 0 ? ((presentCount / totalUsers) * 100).toFixed(1) : 0;

  const attendanceStatusOptions = [
    { value: "", label: "📊 All Status" },
    { value: "Present", label: "✅ Present" },
    { value: "Absent", label: "❌ Absent" },
    { value: "Half Day", label: "⏳ Half Day" },
    { value: "WFH", label: "🏠 WFH" },
    { value: "Comp-off", label: "📅 Comp-off" },
    { value: "Emergency Leave", label: "🚨 Emergency Leave" },
    { value: "Medical Leave", label: "🏥 Medical Leave" },
    { value: "Sick Leave", label: "🤒 Sick Leave" },
    { value: "LWP", label: "⚠️ LWP" }
  ];

  const attendanceTypeOptions = [
    { value: "", label: "📊 All Types" },
    { value: "Manual Attendance", label: "✍️ Manual Attendance" },
    { value: "Field Visit", label: "📍 Field Visit" },
    { value: "Leave", label: "🏖️ Leave" }
  ];

  const TableView = useMemo(() => (
    <div className="table-responsive" style={{ overflowX: 'auto' }}>
      <Table hover className="align-middle mb-0" style={{ minWidth: '800px' }}>
        <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <tr>
            <th className="py-3" style={{ width: '60px' }}>#</th>
            <th className="py-3" style={{ width: '180px' }}>👤 User</th>
            <th className="py-3" style={{ width: '100px' }}>🎭 Role</th>
            <th className="py-3" style={{ width: '120px' }}>📊 Status</th>
            <th className="py-3" style={{ width: '120px' }}>🕐 Login Time</th>
            <th className="py-3" style={{ width: '280px' }}>📝 Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading attendance data...</p>
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <div className="text-muted">
                  <FaClock size={50} className="mb-3 opacity-50" />
                  <p>No attendance data found for the selected filters</p>
                  <Button variant="outline-primary" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </td>
            </tr>
          ) : (
            filteredData.map((user, index) => (
              <TableRow
                key={user._id}
                user={user}
                index={index}
                attendanceFormData={attendanceFormData}
                markingAttendance={markingAttendance}
                loading={loading}
                updateAttendanceFormData={updateAttendanceFormData}
                handleAttendanceChange={handleAttendanceChange}
                canMarkAttendance={canMarkAttendance}
                getAttendanceBadge={getAttendanceBadge}
                handleLeaveApproval={handleLeaveApproval}
                approvingLeave={approvingLeave}
                onViewLeave={handleViewLeave}
              />
            ))
          )}
        </tbody>
      </Table>
    </div>
  ), [filteredData, loading, attendanceFormData, markingAttendance, approvingLeave, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, handleViewLeave, resetFilters]);

  const CardView = useMemo(() => (
    <Row className="g-4">
      {filteredData.length === 0 ? (
        <Col xs={12}>
          <div className="text-center py-5">
            <FaClock size={50} className="mb-3 opacity-50" />
            <p className="text-muted">No users found</p>
          </div>
        </Col>
      ) : (
        filteredData.map((user, index) => (
          <UserCard
            key={user._id}
            user={user}
            index={index}
            attendanceFormData={attendanceFormData}
            markingAttendance={markingAttendance}
            loading={loading}
            updateAttendanceFormData={updateAttendanceFormData}
            handleAttendanceChange={handleAttendanceChange}
            canMarkAttendance={canMarkAttendance}
            getAttendanceBadge={getAttendanceBadge}
            handleLeaveApproval={handleLeaveApproval}
            approvingLeave={approvingLeave}
            onViewLeave={handleViewLeave}
          />
        ))
      )}
    </Row>
  ), [filteredData, attendanceFormData, markingAttendance, approvingLeave, loading, updateAttendanceFormData, handleAttendanceChange, canMarkAttendance, getAttendanceBadge, handleLeaveApproval, handleViewLeave]);

  return (
    <Container fluid className="px-4 py-4 bg-light min-vh-100">
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible className="mb-3">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible className="mb-3">
          {errorMessage}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="display-6 fw-bold text-primary mb-2">
                📊 Attendance Dashboard
              </h1>
              <p className="text-muted mb-0">Manage and track user attendance in real-time</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={fetchAttendanceData}
                disabled={loading}
                className="d-flex align-items-center gap-2"
              >
                <FaSyncAlt /> Refresh
              </Button>
              <Button 
                variant="outline-info" 
                onClick={handleExport}
                disabled={exporting || filteredData.length === 0}
                className="d-flex align-items-center gap-2"
              >
                {exporting ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FaDownload /> Export
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaCalendarAlt className="me-1" /> Date
          </Form.Label>
          <SingleDatePicker
            selectedDate={startDate}
            onDateChange={handleDateChange}
            placeholderText="Select date"
            className="w-100"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaUserTag className="me-1" /> Role
          </Form.Label>
          <Select
            isClearable
            options={roleOptions}
            value={filters.role}
            onChange={(option) => setFilters(prev => ({ ...prev, role: option }))}
            placeholder="Select role..."
            className="react-select"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaSchool className="me-1" /> District
          </Form.Label>
          <Select
            isClearable
            options={districtOptions}
            value={filters.district}
            onChange={(option) => {
              setFilters(prev => ({ 
                ...prev, 
                district: option,
                school: null
              }));
            }}
            placeholder="Select district..."
            className="react-select"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaSchool className="me-1" /> School
          </Form.Label>
          <Select
            isClearable
            options={schoolOptions}
            value={filters.school}
            onChange={(option) => setFilters(prev => ({ ...prev, school: option }))}
            placeholder="Select school..."
            className="react-select"
            isDisabled={!filters.district}
          />
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaClock className="me-1" /> Attendance Type
          </Form.Label>
          <Select
            isClearable
            options={attendanceTypeOptions}
            value={attendanceTypeOptions.find(opt => opt.value === filters.attendanceType)}
            onChange={(option) => setFilters(prev => ({ ...prev, attendanceType: option?.value || "" }))}
            placeholder="Filter by type..."
            className="react-select"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="fw-semibold">
            <FaCheckCircle className="me-1" /> Attendance Status
          </Form.Label>
          <Select
            isClearable
            options={attendanceStatusOptions}
            value={attendanceStatusOptions.find(opt => opt.value === filters.attendanceStatus)}
            onChange={(option) => setFilters(prev => ({ ...prev, attendanceStatus: option?.value || "" }))}
            placeholder="Filter by status..."
            className="react-select"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={resetFilters} className="px-4">
            Clear All Filters
          </Button>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaUsers size={20} className="text-primary" />
              </div>
              <h4 className="mb-1 fw-bold">{totalUsers}</h4>
              <small className="text-muted">Total Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaCheckCircle size={20} className="text-success" />
              </div>
              <h4 className="mb-1 fw-bold text-success">{presentCount}</h4>
              <small className="text-muted">Present</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaTimesCircle size={20} className="text-danger" />
              </div>
              <h4 className="mb-1 fw-bold text-danger">{absentCount}</h4>
              <small className="text-muted">Absent</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-block mb-2">
                <FaClock size={20} className="text-info" />
              </div>
              <h4 className="mb-1 fw-bold">{attendancePercentage}%</h4>
              <small className="text-muted">Attendance Rate</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="btn-group">
          <Button 
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('table')}
            className="d-flex align-items-center gap-2"
          >
            <FaTable /> Table View
          </Button>
          <Button 
            variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('card')}
            className="d-flex align-items-center gap-2"
          >
            <FaThLarge /> Card View
          </Button>
        </div>
        <small className="text-muted">
          Showing {filteredData.length} of {attendanceData.length} users
        </small>
      </div>

      {viewMode === 'table' ? TableView : CardView}

      {/* Leave Approval Modal */}
      <LeaveApprovalModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedUser(null);
          setSelectedAttendance(null);
        }}
        user={selectedUser}
        currentAttendance={selectedAttendance}
        onApprove={handleLeaveApproval}
        onReject={handleLeaveApproval}
        approving={approvingLeave !== null}
      />
    </Container>
  );
}