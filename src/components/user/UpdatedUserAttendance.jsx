// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// export const UserAttendanceUpdated = () => {

//     const navigate = useNavigate();

//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [locationPermission, setLocationPermission] = useState(null);
//   const { userData } = useContext(UserContext);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [attendanceChecked, setAttendanceChecked] = useState(false);
//   const [userLatitude, setUserLatitude] = useState("");
//   const [userLongitude, setUserLongitude] = useState("");
//   const [coordinateDifference, setCoordinateDifference] = useState(null);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [showModal, setShowModal] = useState(true); // show modal on login

//   const userId = userData?.[0]?.userId;
//   const storedLat = userData?.[0]?.latitude;
//   const storedLng = userData?.[0]?.longitude;

//   // Get geolocation
//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser");
//       return;
//     }

//     const options = {
//       enableHighAccuracy: true,
//       timeout: 10000,
//       maximumAge: 0,
//     };

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//         setLocationError(null);
//         setLocationPermission("granted");
//       },
//       (err) => {
//         setLocationError(`Location access denied: ${err.message}`);
//         setLocationPermission("denied");
//       },
//       options
//     );
//   };

//   useEffect(() => {
//     getLocation();
//     const watchId = navigator.geolocation.watchPosition(() => {}, () => {}, {
//       enableHighAccuracy: true,
//     });

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   // Fetch attendance data
//   const fetchUserAttendanceData = async () => {
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       const userEntry = response.data.data?.[0];

//       console.log("📥 Attendance API Response:", response.data.data);
      
//       //This will make sure that attendance instance information be conveyed to admin.
    
//       setUserAttendanceData(response.data.data);
//       setUserLatitude(userEntry?.latitude);
//       setUserLongitude(userEntry?.longitude);

//       if (attendance?.attendance === "Present") {
//         setAttendanceChecked(true);
//       } else {
//         setAttendanceChecked(false);
//       }
//     } catch (error) {
//       console.log("❌ Error fetching attendance data", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceData();
//   }, []);

//   // Calculate distance between coordinates
//   function getDistanceInMeters(lat1, lon1, lat2, lon2) {
//     const toRadians = (deg) => (deg * Math.PI) / 180;
//     const R = 6371000;
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

//   // Update coordinate difference
//   useEffect(() => {
//     if (storedLat && storedLng && currentLat && currentLng) {
//       const distance = getDistanceInMeters(
//         parseFloat(storedLat),
//         parseFloat(storedLng),
//         currentLat,
//         currentLng
//       );
//       const fixedDistance = distance.toFixed(2);

//       console.log("✅ Coordinates:");
//       console.log("🗺️ DB Latitude:", storedLat);
//       console.log("🗺️ DB Longitude:", storedLng);
//       console.log("📍 Current Latitude:", currentLat);
//       console.log("📍 Current Longitude:", currentLng);
//       console.log("📏 Distance from center (m):", fixedDistance);

//       setCoordinateDifference(fixedDistance);
//     } else {
      
//       console.log("⚠️ Missing coordinates to calculate distance.");

//       // //Now if coordinates are missing so first we will update coordinates.

//         const formData = {
//           longitude: currentLng,
//           latitude: currentLat
//         }
//         const userId = userData[0].userId

        
//         const PatchUser = async () =>{
//           try {

//                 const response = await patchUserById(userId, formData )

//           } catch (error) {
//             console.log("Eroor updating user coordinates")
//           }
//         }

//        if (userData[0].longitude === null && userData[0].latitude === null) {
//         PatchUser()
//         fetchUserAttendanceData()
//        }
      
      


//     }
//   }, [storedLat, storedLng, currentLat, currentLng]);

//   //--------------------------------------------

//   // Update showAttendanceButton based on distance
//   useEffect(() => {
//     if (coordinateDifference !== null) {
//       setShowAttendanceButton(coordinateDifference <= 5000);
//     }
//   }, [coordinateDifference]);

//   // Update attendance
//   const updateUserAttendance = async (checked) => {
//     if (!currentLat || !currentLng) {
//       alert("Location is required to mark attendance");
//       return;
//     }

//     const attendanceStatus = checked ? "Present" : "Absent";
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const loginTime = Date.now();
//     const logoutTime = Date.now();

//     let formData;

//     if (userAttendanceData?.[0]?.attendances?.attendance === "Present") {
//       formData = {
//         logoutLongitude: currentLng,
//         logoutLatitude: currentLat,
//         logoutCoordinateDifference: coordinateDifference,
//         logoutTime: logoutTime,
//       };
//     } else {
//       formData = {
//         attendance: attendanceStatus,
//         longitude: currentLng,
//         latitude: currentLat,
//         coordinateDifference: coordinateDifference,
//         loginTime: loginTime,
//       };
//     }

//     try {
//       await PatchUserAttendanceByUserId(queryParams, formData);
//       console.log("✅ Attendance updated.");
//     } catch (error) {
//       console.log("❌ Error updating attendance:", error.message);
//     }
//   };

//   // Main handler when user clicks the checkbox
//   const handleCheckboxChange = async (e) => {
//     const checked = e.target.checked;

//     if (!showAttendanceButton) {
//       alert("⚠️ You must be within 100 meters of your center to mark attendance.");
//       return;
//     }

//     setAttendanceChecked(checked);
//     console.log(userData[0].longitude)


//     // Step 2: Then mark attendance
//     await updateUserAttendance(checked);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     if(userData?.[0]?.role === "CC"){
//     navigate('/user-dash')
//     } else if (userData?.[0]?.role === "ACI"){
//       navigate('/l2-user-dash')
//     }
//   };

//   return (
//     <>
//       {locationError && (
//         <div className="location-error">
//           {locationError}. Please enable location services.
//         </div>
//       )}

//       <Modal
//         show={showModal}
//         onHide={handleModalClose}
//         centered
//         backdrop="static"
//         keyboard={false}
//         size="sm"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3">
//             {!showAttendanceButton && (
//               <p style={{ color: "red", fontWeight: "bold" }}>
//                 You are not within 100 meters of your center.
//               </p>
//             )}
//             <Form>
//               <Form.Check
//                 type="checkbox"
//                 id="attendance-checkbox"
//                 label="Mark your attendance"
//                 checked={attendanceChecked}
//                 disabled={!showAttendanceButton}
//                 onChange={handleCheckboxChange}
//               />
//             </Form>
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleModalClose} className="w-100">
//             Go to Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };
















// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export const UserAttendanceUpdated = () => {
//   const navigate = useNavigate();
//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [userLatitude, setUserLatitude] = useState("");
//   const [userLongitude, setUserLongitude] = useState("");
//   const [coordinateDifference, setCoordinateDifference] = useState(null);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [showModal, setShowModal] = useState(true);
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;
//   const storedLat = userData?.[0]?.latitude;
//   const storedLng = userData?.[0]?.longitude;

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//         console.log("📍 Current Coordinates:");
//         console.log("   ➤ Latitude:", position.coords.latitude);
//         console.log("   ➤ Longitude:", position.coords.longitude);
//       },
//       (err) => {
//         setLocationError(`Location access denied: ${err.message}`);
//       },
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   const fetchUserAttendanceData = async () => {
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       const userEntry = response.data.data?.[0];
//       setUserAttendanceData(response.data.data);
//       setUserLatitude(userEntry?.latitude);
//       setUserLongitude(userEntry?.longitude);
//       console.log("📥 Attendance data fetched:", response.data.data);
//     } catch (error) {
//       console.log("❌ Error fetching attendance", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceData();
//   }, []);

//   function getDistanceInMeters(lat1, lon1, lat2, lon2) {
//     const toRadians = (deg) => (deg * Math.PI) / 180;
//     const R = 6371000;
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);
//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

//   useEffect(() => {
//     if (storedLat && storedLng && currentLat && currentLng) {
//       const distance = getDistanceInMeters(
//         parseFloat(storedLat),
//         parseFloat(storedLng),
//         currentLat,
//         currentLng
//       );
//       const fixedDistance = distance.toFixed(2);
//       console.log("🗺️ Stored Latitude:", storedLat);
//       console.log("🗺️ Stored Longitude:", storedLng);
//       console.log("📍 Current Latitude:", currentLat);
//       console.log("📍 Current Longitude:", currentLng);
//       console.log("📏 Distance from center (m):", fixedDistance);
//       setCoordinateDifference(fixedDistance);
//       setShowAttendanceButton(fixedDistance <= 10000);
//     } else {
//       const formData = { longitude: currentLng, latitude: currentLat };
//       if (userData[0].longitude === null && userData[0].latitude === null) {
//         console.log("⚠️ Coordinates missing in DB. Updating now...");
//         patchUserById(userId, formData).catch(() =>
//           console.log("Error updating user coordinates")
//         );
//         fetchUserAttendanceData();
//       }
//     }
//   }, [storedLat, storedLng, currentLat, currentLng]);

//   const openCameraAndCaptureImage = () => {
//     return new Promise((resolve, reject) => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.capture = "environment";
//       input.onchange = () => {
//         if (input.files && input.files.length > 0) {
//           console.log("📸 Image selected:", input.files[0]?.name);
//           resolve(input.files[0]);
//         } else {
//           reject(new Error("No image selected"));
//         }
//       };
//       input.click();
//     });
//   };

//   const updateUserAttendance = async () => {
//     if (!currentLat || !currentLng) {
//       alert("Location is required to mark attendance");
//       return;
//     }

//     const attendanceStatus =
//       userAttendanceData?.[0]?.attendances?.attendance === "Present"
//         ? null
//         : "Present";

//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const formData = new FormData();
//     const now = Date.now();

//     if (attendanceStatus) {
//       formData.append("attendance", attendanceStatus);
//       formData.append("loginTime", now);
//       console.log("🟢 Logging attendance: Present");
//     } else {
//       formData.append("logoutTime", now);
//       formData.append("logoutLongitude", currentLng);
//       formData.append("logoutLatitude", currentLat);
//       formData.append("logoutCoordinateDifference", coordinateDifference);
//       console.log("🔴 Logging logout attendance");
//     }

//     formData.append("longitude", currentLng);
//     formData.append("latitude", currentLat);
//     formData.append("coordinateDifference", coordinateDifference);

//     console.log("📤 Payload Coordinates:");
//     console.log("   ➤ Longitude:", currentLng);
//     console.log("   ➤ Latitude:", currentLat);
//     console.log("   ➤ Coordinate Difference:", coordinateDifference);

//     try {
//       const image = await openCameraAndCaptureImage();
//       formData.append("file", image);

//       console.log("📎 Attached Image:", image?.name);
//       await PatchUserAttendanceByUserId(queryParams, formData);
//       alert("✅ Attendance marked successfully.");
//       setShowAttendanceButton(false);
//     } catch (err) {
//       console.log("❌ Error marking attendance:", err.message);
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     if (userData?.[0]?.role === "CC") {
//       navigate("/user-dash");
//     } else if (userData?.[0]?.role === "ACI") {
//       navigate("/l2-user-dash");
//     }
//   };

//   return (
//     <>
//       {locationError && (
//         <div className="location-error">
//           {locationError}. Please enable location services.
//         </div>
//       )}

//       <Modal
//         show={showModal}
//         onHide={handleModalClose}
//         centered
//         backdrop="static"
//         keyboard={false}
//         size="sm"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3 text-center">
//             {!showAttendanceButton ? (
//               <p style={{ color: "red", fontWeight: "bold" }}>
//                 You are not within 100 meters of your center.
//               </p>
//             ) : (
//               <Button variant="success" onClick={updateUserAttendance}>
//                 📸 Mark Your Attendance
//               </Button>
//             )}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleModalClose} className="w-100">
//             Go to Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };




















//Below code is the finla and latest

// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export const UserAttendanceUpdated = () => {
//   const navigate = useNavigate();
//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [userLatitude, setUserLatitude] = useState("");
//   const [userLongitude, setUserLongitude] = useState("");
//   const [coordinateDifference, setCoordinateDifference] = useState(null);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [showModal, setShowModal] = useState(true);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false); // ✅ New state
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;
//   const storedLat = userData?.[0]?.latitude;
//   const storedLng = userData?.[0]?.longitude;

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//         console.log("📍 Current Coordinates:");
//         console.log("   ➤ Latitude:", position.coords.latitude);
//         console.log("   ➤ Longitude:", position.coords.longitude);
//       },
//       (err) => {
//         setLocationError(`Location access denied: ${err.message}`);
//       },
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   const fetchUserAttendanceData = async () => {
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       const userEntry = response.data.data?.[0];
//       setUserAttendanceData(response.data.data);
//       setUserLatitude(userEntry?.latitude);
//       setUserLongitude(userEntry?.longitude);
//       if (attendance?.attendance === "Present") {
//         setIsAttendanceMarked(true); // ✅ Attendance already done
//         setShowAttendanceButton(false);
//       }
//       console.log("📥 Attendance data fetched:", response.data.data);
//     } catch (error) {
//       console.log("❌ Error fetching attendance", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceData();
//   }, []);

//   function getDistanceInMeters(lat1, lon1, lat2, lon2) {
//     const toRadians = (deg) => (deg * Math.PI) / 180;
//     const R = 6371000;
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);
//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

//   useEffect(() => {
//     if (storedLat && storedLng && currentLat && currentLng) {
//       const distance = getDistanceInMeters(
//         parseFloat(storedLat),
//         parseFloat(storedLng),
//         currentLat,
//         currentLng
//       );
//       const fixedDistance = distance.toFixed(2);
//       console.log("🗺️ Stored Latitude:", storedLat);
//       console.log("🗺️ Stored Longitude:", storedLng);
//       console.log("📍 Current Latitude:", currentLat);
//       console.log("📍 Current Longitude:", currentLng);
//       console.log("📏 Distance from center (m):", fixedDistance);
//       setCoordinateDifference(fixedDistance);
//       setShowAttendanceButton(fixedDistance <= 10000 && !isAttendanceMarked); // ✅ only show if within range and not marked
//     } else {
//       const formData = { longitude: currentLng, latitude: currentLat };
//       if (userData[0].longitude === null && userData[0].latitude === null) {
//         console.log("⚠️ Coordinates missing in DB. Updating now...");
//         patchUserById(userId, formData).catch(() =>
//           console.log("Error updating user coordinates")
//         );
//         fetchUserAttendanceData();
//       }
//       setShowAttendanceButton(true); // ✅ Show button on first-time even before diff calc
//     }
//   }, [storedLat, storedLng, currentLat, currentLng, isAttendanceMarked]);

//   const openCameraAndCaptureImage = () => {
//     return new Promise((resolve, reject) => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.capture = "environment";
//       input.onchange = () => {
//         if (input.files && input.files.length > 0) {
//           console.log("📸 Image selected:", input.files[0]?.name);
//           resolve(input.files[0]);
//         } else {
//           reject(new Error("No image selected"));
//         }
//       };
//       input.click();
//     });
//   };

//   const updateUserAttendance = async () => {
//     // if (!currentLat || !currentLng) {
//     //   alert("Location is required to mark attendance");
//     //   return;
//     // }

//     const attendanceStatus =
//       userAttendanceData?.[0]?.attendances?.attendance === "Present"
//         ? null
//         : "Present";

//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const formData = new FormData();
//     const now = Date.now();

//     if (attendanceStatus) {
//       formData.append("attendance", attendanceStatus);
//       formData.append("loginTime", now);
//       console.log("🟢 Logging attendance: Present");
//     } else {
//       formData.append("logoutTime", now);
//       formData.append("logoutLongitude", currentLng);
//       formData.append("logoutLatitude", currentLat);
//       formData.append("logoutCoordinateDifference", coordinateDifference);
//       console.log("🔴 Logging logout attendance");
//     }

//     formData.append("longitude", currentLng);
//     formData.append("latitude", currentLat);
//     formData.append("coordinateDifference", coordinateDifference);

//     console.log("📤 Payload Coordinates:");
//     console.log("   ➤ Longitude:", currentLng);
//     console.log("   ➤ Latitude:", currentLat);
//     console.log("   ➤ Coordinate Difference:", coordinateDifference);

//     try {
//       const image = await openCameraAndCaptureImage();
//       formData.append("file", image);

//       console.log("📎 Attached Image:", image?.name);
//       await PatchUserAttendanceByUserId(queryParams, formData);
//       alert("✅ Attendance marked successfully.");
//       setIsAttendanceMarked(true); // ✅ Mark as done
//       setShowAttendanceButton(false);
//     } catch (err) {
//       console.log("❌ Error marking attendance:", err.message);
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     if (userData?.[0]?.role === "CC") {
//       navigate("/user-dash");
//     } else if (userData?.[0]?.role === "ACI") {
//       navigate("/l2-user-dash");
//     } else if (userData?.[0]?.role === "Community Manager"){
//       navigate("/l3-user-dash")
//     } else if(userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator" ) {
//       navigate("/l0-user-dash");
//     }



//   };

//   return (
//     <>
//       {/* {locationError && (
//         <div className="location-error">
//           {locationError}. Please enable location services.
//         </div>
//       )} */}

//       <Modal
//         show={showModal}
//         onHide={handleModalClose}
//         centered
//         backdrop="static"
//         keyboard={false}
//         size="sm"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance ✅</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3 text-center">
//             {isAttendanceMarked ? (
//               <p style={{ color: "green", fontWeight: "bold" }}>
//                 ✅ Attendance marked for date: {new Date().toISOString().split("T")[0]}
//               </p>
//             ) : showAttendanceButton ? (
//               <Button variant="success" onClick={updateUserAttendance}>
//                 📸 Mark Your Attendance
//               </Button>
//             ) : (
//               <p style={{ color: "red", fontWeight: "bold" }}>
//                 You are not within 100 meters of your center.
//               </p>
//             )}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleModalClose} className="w-100">
//             Go to Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };














// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export const UserAttendanceUpdated = () => {
//   const navigate = useNavigate();
//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [userLatitude, setUserLatitude] = useState("");
//   const [userLongitude, setUserLongitude] = useState("");
//   const [coordinateDifference, setCoordinateDifference] = useState(null);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [showModal, setShowModal] = useState(true);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Spinner state
//   const { userData } = useContext(UserContext);
//   const userId = userData?.[0]?.userId;
//   const storedLat = userData?.[0]?.latitude;
//   const storedLng = userData?.[0]?.longitude;

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//         console.log("📍 Current Coordinates:");
//         console.log("   ➤ Latitude:", position.coords.latitude);
//         console.log("   ➤ Longitude:", position.coords.longitude);
//       },
//       (err) => {
//         setLocationError(`Location access denied: ${err.message}`);
//       },
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   const fetchUserAttendanceData = async () => {
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       const userEntry = response.data.data?.[0];
//       setUserAttendanceData(response.data.data);
//       setUserLatitude(userEntry?.latitude);
//       setUserLongitude(userEntry?.longitude);
//       if (attendance?.attendance === "Present") {
//         setIsAttendanceMarked(true);
//         setShowAttendanceButton(false);
//       }
//       console.log("📥 Attendance data fetched:", response.data.data);
//     } catch (error) {
//       console.log("❌ Error fetching attendance", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceData();
//   }, []);

//   function getDistanceInMeters(lat1, lon1, lat2, lon2) {
//     const toRadians = (deg) => (deg * Math.PI) / 180;
//     const R = 6371000;
//     const φ1 = toRadians(lat1);
//     const φ2 = toRadians(lat2);
//     const Δφ = toRadians(lat2 - lat1);
//     const Δλ = toRadians(lon2 - lon1);
//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

//   useEffect(() => {
//     if (storedLat && storedLng && currentLat && currentLng) {
//       const distance = getDistanceInMeters(
//         parseFloat(storedLat),
//         parseFloat(storedLng),
//         currentLat,
//         currentLng
//       );
//       const fixedDistance = distance.toFixed(2);
//       console.log("🗺️ Stored Latitude:", storedLat);
//       console.log("🗺️ Stored Longitude:", storedLng);
//       console.log("📍 Current Latitude:", currentLat);
//       console.log("📍 Current Longitude:", currentLng);
//       console.log("📏 Distance from center (m):", fixedDistance);
//       setCoordinateDifference(fixedDistance);
//       setShowAttendanceButton(fixedDistance <= 10000 && !isAttendanceMarked);
//     } else {
//       const formData = { longitude: currentLng, latitude: currentLat };
//       if (userData[0].longitude === null && userData[0].latitude === null) {
//         console.log("⚠️ Coordinates missing in DB. Updating now...");
//         patchUserById(userId, formData).catch(() =>
//           console.log("Error updating user coordinates")
//         );
//         fetchUserAttendanceData();
//       }
//       setShowAttendanceButton(true);
//     }
//   }, [storedLat, storedLng, currentLat, currentLng, isAttendanceMarked]);

//   const openCameraAndCaptureImage = () => {
//     return new Promise((resolve, reject) => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.capture = "environment";
//       input.onchange = () => {
//         if (input.files && input.files.length > 0) {
//           console.log("📸 Image selected:", input.files[0]?.name);
//           resolve(input.files[0]);
//         } else {
//           reject(new Error("No image selected"));
//         }
//       };
//       input.click();
//     });
//   };

//   const updateUserAttendance = async () => {
//     setIsSubmitting(true); // ✅ Start spinner

//     const attendanceStatus =
//       userAttendanceData?.[0]?.attendances?.attendance === "Present"
//         ? null
//         : "Present";

//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const formData = new FormData();
//     const now = Date.now();

//     if (attendanceStatus) {
//       formData.append("attendance", attendanceStatus);
//       formData.append("loginTime", now);
//       console.log("🟢 Logging attendance: Present");
//     } else {
//       formData.append("logoutTime", now);
//       formData.append("logoutLongitude", currentLng);
//       formData.append("logoutLatitude", currentLat);
//       formData.append("logoutCoordinateDifference", coordinateDifference);
//       console.log("🔴 Logging logout attendance");
//     }

//     formData.append("longitude", currentLng);
//     formData.append("latitude", currentLat);
//     formData.append("coordinateDifference", coordinateDifference);

//     console.log("📤 Payload Coordinates:");
//     console.log("   ➤ Longitude:", currentLng);
//     console.log("   ➤ Latitude:", currentLat);
//     console.log("   ➤ Coordinate Difference:", coordinateDifference);

//     try {
//       const image = await openCameraAndCaptureImage();
//       formData.append("file", image);

//       console.log("📎 Attached Image:", image?.name);
//       await PatchUserAttendanceByUserId(queryParams, formData);
//       alert("✅ Attendance marked successfully.");
//       setIsAttendanceMarked(true);
//       setShowAttendanceButton(false);
//     } catch (err) {
//       console.log("❌ Error marking attendance:", err.message);
//     } finally {
//       setIsSubmitting(false); // ✅ Stop spinner
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     if (userData?.[0]?.role === "CC") {
//       navigate("/user-dash");
//     } else if (userData?.[0]?.role === "ACI") {
//       navigate("/l2-user-dash");
//     } else if (userData?.[0]?.role === "Community Manager"){
//       navigate("/l3-user-dash")
//     } else if(userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator" ) {
//       navigate("/l0-user-dash");
//     }
//   };

//   return (
//     <>
//       <Modal
//         show={showModal}
//         onHide={handleModalClose}
//         centered
//         backdrop="static"
//         keyboard={false}
//         size="sm"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance ✅</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3 text-center">
//             {isAttendanceMarked ? (
//               <p style={{ color: "green", fontWeight: "bold" }}>
//                 ✅ Attendance marked for date: {new Date().toISOString().split("T")[0]}
//               </p>
//             ) : showAttendanceButton ? (
//               <Button
//                 variant="success"
//                 onClick={updateUserAttendance}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Spinner
//                       animation="border"
//                       size="sm"
//                       role="status"
//                       className="me-2"
//                     />
//                     Marking Attendance...
//                   </>
//                 ) : (
//                   "📸 Mark Your Attendance"
//                 )}
//               </Button>
//             ) : (
//               <p style={{ color: "red", fontWeight: "bold" }}>
//                 You are not within 100 meters of your center.
//               </p>
//             )}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleModalClose} className="w-100">
//             Go to Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };



































// 🟢 MODIFIED BLOCKS ARE MARKED WITH "✅ MODIFIED" COMMENTS

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { patchUserById } from "../../service/User.service";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const UserAttendanceUpdated = () => {
  const navigate = useNavigate();
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [coordinateDifference, setCoordinateDifference] = useState(null);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Spinner state
  const { userData } = useContext(UserContext);
  const userId = userData?.[0]?.userId;
  const storedLat = userData?.[0]?.latitude;
  const storedLng = userData?.[0]?.longitude;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
        console.log("📍 Current Coordinates:");
        console.log("   ➤ Latitude:", position.coords.latitude);
        console.log("   ➤ Longitude:", position.coords.longitude);
      },
      (err) => {
        setLocationError(`Location access denied: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchUserAttendanceData = async () => {
    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await GetAttendanceByUserId(queryParams);
      const attendance = response.data.data?.[0]?.attendances;
      const userEntry = response.data.data?.[0];
      setUserAttendanceData(response.data.data);
      setUserLatitude(userEntry?.latitude);
      setUserLongitude(userEntry?.longitude);
      if (attendance?.attendance === "Present") {
        setIsAttendanceMarked(true);
        setShowAttendanceButton(false);
      }
      console.log("📥 Attendance data fetched:", response.data.data);
    } catch (error) {
      console.log("❌ Error fetching attendance", error.message);
    }
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);

  function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371000;
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    if (storedLat && storedLng && currentLat && currentLng) {
      const distance = getDistanceInMeters(
        parseFloat(storedLat),
        parseFloat(storedLng),
        currentLat,
        currentLng
      );
      const fixedDistance = distance.toFixed(2);
      console.log("🗺️ Stored Latitude:", storedLat);
      console.log("🗺️ Stored Longitude:", storedLng);
      console.log("📍 Current Latitude:", currentLat);
      console.log("📍 Current Longitude:", currentLng);
      console.log("📏 Distance from center (m):", fixedDistance);
      setCoordinateDifference(fixedDistance);
      setShowAttendanceButton(fixedDistance <= 10000 && !isAttendanceMarked);
    } else {
      const formData = { longitude: currentLng, latitude: currentLat };
      if (userData[0].longitude === null && userData[0].latitude === null) {
        console.log("⚠️ Coordinates missing in DB. Updating now...");
        patchUserById(userId, formData).catch(() =>
          console.log("Error updating user coordinates")
        );
        fetchUserAttendanceData();
      }
      setShowAttendanceButton(true);
    }
  }, [storedLat, storedLng, currentLat, currentLng, isAttendanceMarked]);

  const openCameraAndCaptureImage = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = () => {
        if (input.files && input.files.length > 0) {
          console.log("📸 Image selected:", input.files[0]?.name);
          resolve(input.files[0]);
        } else {
          reject(new Error("No image selected"));
        }
      };
      input.click();
    });
  };

  const updateUserAttendance = async () => {
    setIsSubmitting(true); // ✅ Start spinner

    const attendanceStatus =
      userAttendanceData?.[0]?.attendances?.attendance === "Present"
        ? null
        : "Present";

    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    const formData = new FormData();
    const now = Date.now();

    if (attendanceStatus) {
      formData.append("attendance", attendanceStatus);
      formData.append("loginTime", now);
      console.log("🟢 Logging attendance: Present");
    } else {
      formData.append("logoutTime", now);
      formData.append("logoutLongitude", currentLng);
      formData.append("logoutLatitude", currentLat);
      formData.append("logoutCoordinateDifference", coordinateDifference);
      console.log("🔴 Logging logout attendance");
    }

    formData.append("longitude", currentLng);
    formData.append("latitude", currentLat);
    formData.append("coordinateDifference", coordinateDifference);

    console.log("📤 Payload Coordinates:");
    console.log("   ➤ Longitude:", currentLng);
    console.log("   ➤ Latitude:", currentLat);
    console.log("   ➤ Coordinate Difference:", coordinateDifference);

    try {
      const image = await openCameraAndCaptureImage();
      formData.append("file", image);

      console.log("📎 Attached Image:", image?.name);
      const response = await PatchUserAttendanceByUserId(queryParams, formData); // ✅ MODIFIED

      if (response?.data?.success || response?.status === 200) {
        alert("✅ Attendance marked successfully.");
        setIsAttendanceMarked(true);
        setShowAttendanceButton(false);
        await fetchUserAttendanceData(); // ✅ Refresh data after success
      } else {
        throw new Error("Attendance not saved");
      }
    } catch (err) {
      console.log("❌ Error marking attendance:", err.message);
      alert("❌ इंटरनेट की समस्या है, कृपया पुनः प्रयास करें या अपने वरिष्ठ से संपर्क करें।\n\n⚠️ Your internet is slow, try again or contact your senior.");
    } finally {
      setIsSubmitting(false); // ✅ Stop spinner
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (userData?.[0]?.role === "CC") {
      navigate("/user-dash");
    } else if (userData?.[0]?.role === "ACI" || userData?.[0]?.role==="Community Incharge" || userData?.[0]?.role==="Project Coordinator" ) {
      navigate("/l2-user-dash");
    } else if (userData?.[0]?.role === "Community Manager") {
      navigate("/l3-user-dash");
    } else if (userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator") {
      // navigate("/l0-user-dash");
     
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mark Your Attendance ✅</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3 text-center">
            {isAttendanceMarked ? (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ✅ Attendance marked for date: {new Date().toISOString().split("T")[0]}
              </p>
            ) : showAttendanceButton ? (
              <Button
                variant="success"
                onClick={updateUserAttendance}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    Marking Attendance...
                  </>
                ) : (
                  "📸 Mark Your Attendance"
                )}
              </Button>
            ) : (
              <p style={{ color: "red", fontWeight: "bold" }}>
                You are not within 100 meters of your center.
              </p>
            )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose} className="w-100">
            Go to Home
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
