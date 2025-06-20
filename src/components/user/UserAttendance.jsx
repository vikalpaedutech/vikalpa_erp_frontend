// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { Modal, Button, Card, Form } from "react-bootstrap";
// import { createUser } from "../../service/User.service";

// export const UserAttendance = () => {
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


//   console.log(userData)
  




//   // Fetch attendance data
//   const fetchUserAttendanceData = async () => {
//     const queryParams = {
//       userId: userData?.[0]?.userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       const userEntry = response.data.data?.[0];

//       console.log("📥 Attendance API Response:", response.data.data);

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
//     if (userLatitude && userLongitude && currentLat && currentLng) {
//       const distance = getDistanceInMeters(
//         parseFloat(userLatitude),
//         parseFloat(userLongitude),
//         currentLat,
//         currentLng
//       );
//       const fixedDistance = distance.toFixed(2);

//       console.log("✅ Coordinates:");
//       console.log("🗺️ DB Latitude:", userLatitude);
//       console.log("🗺️ DB Longitude:", userLongitude);
//       console.log("📍 Current Latitude:", currentLat);
//       console.log("📍 Current Longitude:", currentLng);
//       console.log("📏 Distance from center (m):", fixedDistance);

//       setCoordinateDifference(fixedDistance);
//     } else {
//       console.log("⚠️ Missing coordinates:", {
//         userLatitude,
//         userLongitude,
//         currentLat,
//         currentLng,
//       });
//     }
//   }, [userLatitude, userLongitude, currentLat, currentLng]);

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
//       userId: userData?.[0]?.userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const loginTime = Date.now();
//     const logoutTime = Date.now();

//     let formData;

//     if (userAttendanceData?.[0]?.attendances?.attendance === "Present") {
//       // Update logout info
//       formData = {
//         logoutLongitude: currentLng,
//         logoutLatitude: currentLat,
//         logoutCoordinateDifference: coordinateDifference,
//         logoutTime: logoutTime,
//       };
//     } else {
//       // Mark as present
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

//   // Checkbox toggle
//   const handleCheckboxChange = (e) => {
//     const checked = e.target.checked;

//     if (!showAttendanceButton) {
//       alert("⚠️ You must be within 100 meters of your center to mark attendance.");
//       return;
//     }

//     setAttendanceChecked(checked);
//     updateUserAttendance(checked);
//   };

//   // Modal close
//   const handleModalClose = () => {
//     setShowModal(false);
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
//           <Modal.Title>Attendance Attendance</Modal.Title>
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










import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { Modal, Button, Card } from "react-bootstrap";

export const UserAttendance = () => {
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [coordinateDifference, setCoordinateDifference] = useState(null);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
      },
      (err) => {
        setLocationError(`Location access denied: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchUserAttendanceData = async () => {
    const queryParams = {
      userId: userData?.[0]?.userId,
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
        setShowAttendanceButton(false);
      }
    } catch (error) {
      console.log("❌ Error fetching attendance:", error.message);
    }
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);

  useEffect(() => {
    if (userLatitude && userLongitude && currentLat && currentLng) {
      const R = 6371000;
      const dLat = ((currentLat - userLatitude) * Math.PI) / 180;
      const dLng = ((currentLng - userLongitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLatitude * Math.PI) / 180) *
          Math.cos((currentLat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setCoordinateDifference(distance.toFixed(2));
      setShowAttendanceButton(distance <= 100);
    }
  }, [userLatitude, userLongitude, currentLat, currentLng]);

  const handleAttendanceClick = async () => {
    try {
      const file = await openCameraAndCaptureImage();
      const formData = new FormData();

      const attendanceStatus =
        userAttendanceData?.[0]?.attendances?.attendance === "Present"
          ? null
          : "Present";

      const queryParams = {
        userId: userData?.[0]?.userId,
        date: new Date().toISOString().split("T")[0],
      };

      if (file) formData.append("file", file);

      formData.append("longitude", currentLng);
      formData.append("latitude", currentLat);
      formData.append("coordinateDifference", coordinateDifference);

      if (attendanceStatus) {
        formData.append("attendance", attendanceStatus);
        formData.append("loginTime", Date.now());
      } else {
        formData.append("logoutLongitude", currentLng);
        formData.append("logoutLatitude", currentLat);
        formData.append("logoutCoordinateDifference", coordinateDifference);
        formData.append("logoutTime", Date.now());
      }

      await PatchUserAttendanceByUserId(queryParams, formData);
      alert("✅ Attendance marked successfully.");
      setShowAttendanceButton(false);
    } catch (err) {
      console.error("❌ Error marking attendance:", err.message);
    }
  };

  const openCameraAndCaptureImage = async () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";

      input.onchange = () => {
        if (input.files && input.files.length > 0) {
          resolve(input.files[0]);
        } else {
          reject(new Error("No image selected."));
        }
      };

      input.click();
    });
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3 text-center">
            {locationError && (
              <p className="text-danger">{locationError}</p>
            )}
            {!showAttendanceButton ? (
              <p className="text-warning">
                You are not within 100 meters of your center.
              </p>
            ) : (
              <Button variant="success" onClick={handleAttendanceClick}>
                📸 Mark Your Attendance
              </Button>
            )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)} className="w-100">
            Go to Home
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
