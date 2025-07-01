// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";
// import {
//   DistrictBlockSchoolContext,
//   BlockContext,
//   SchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";
// import Select from "react-select";

// export const UserAttendanceACI = () => {
//   const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

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

//   const [attendanceType, setAttendanceType] = useState(""); // ✅ new
//   const [visitingLocation, setVisitingLocation] = useState(""); // ✅ new

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
//     if (!currentLat || !currentLng) {
//       alert("Location is required to mark attendance");
//       return;
//     }

//     // ✅ auto-set visitingLocation from schoolContext if attendanceType is "Center Visit"
//     const locationToSend =
//       attendanceType === "Center Visit"
//         ? schoolContext?.[0]?.label || "NA"
//         : visitingLocation;

//     if (!attendanceType || (attendanceType !== "WFH" && !locationToSend)) {
//       alert("Please complete all required attendance fields.");
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
//     formData.append("attendanceType", attendanceType);
//     formData.append("visitingLocation", locationToSend);

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
//             {isAttendanceMarked ? (
//               <p style={{ color: "green", fontWeight: "bold" }}>
//                 ✅ Attendance marked for date:{" "}
//                 {new Date().toISOString().split("T")[0]}
//               </p>
//             ) : (
//               <>
//                 <Form.Group className="mb-2 text-start">
//                   <Form.Label>Attendance Type</Form.Label>
//                   <Select
//                     options={[
//                       { value: "", label: "Select Type" },
//                       { value: "Center Visit", label: "Center Visit" },
//                       { value: "WFH", label: "WFH" },
//                       {
//                         value: "Govt. Official Visit",
//                         label: "Govt. Official Visit",
//                       },
//                       { value: "Event", label: "Event" },
//                     ]}
//                     value={
//                       attendanceType
//                         ? { value: attendanceType, label: attendanceType }
//                         : { value: "", label: "Select Type" }
//                     }
//                     onChange={(selectedOption) => {
//                       setAttendanceType(selectedOption.value);
//                       setVisitingLocation("");
//                     }}
//                   />
//                 </Form.Group>

//                 {attendanceType === "Center Visit" && (
//                   <div>
//                     <SchoolDropDowns />
//                   </div>
//                 )}

//                 {attendanceType === "Govt. Official Visit" && (
//                   <Form.Group className="mb-2 text-start">
//                     <Form.Label>Enter Govt. Official Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={visitingLocation}
//                       onChange={(e) => setVisitingLocation(e.target.value)}
//                       placeholder="e.g. BDO Office"
//                     />
//                   </Form.Group>
//                 )}

//                 {attendanceType === "Event" && (
//                   <Form.Group className="mb-2 text-start">
//                     <Form.Label>Enter Event Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={visitingLocation}
//                       onChange={(e) => setVisitingLocation(e.target.value)}
//                       placeholder="e.g. Health Fair"
//                     />
//                   </Form.Group>
//                 )}

//                 {showAttendanceButton &&
//                   (attendanceType === "WFH" ||
//                     visitingLocation ||
//                     attendanceType === "Center Visit") && (
//                     <Button variant="success" onClick={updateUserAttendance}>
//                       📸 Mark Your Attendance
//                     </Button>
//                   )}

//                 {!showAttendanceButton && (
//                   <p style={{ color: "red", fontWeight: "bold" }}>
//                     You are not within 100 meters of your center.
//                   </p>
//                 )}
//               </>
//             )}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="primary"
//             onClick={handleModalClose}
//             className="w-100"
//           >
//             Go to Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };


















// top of file
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { patchUserById } from "../../service/User.service";
import { Modal, Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import Select from "react-select";

// component start
export const UserAttendanceACI = () => {
  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

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
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false); // ✅ New state
  const { userData } = useContext(UserContext);
  const userId = userData?.[0]?.userId;
  const storedLat = userData?.[0]?.latitude;
  const storedLng = userData?.[0]?.longitude;

  const [attendanceType, setAttendanceType] = useState(""); // ✅ new
  const [visitingLocation, setVisitingLocation] = useState(""); // ✅ new
  const [loading, setLoading] = useState(false); // ✅ loading spinner state

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
        setIsAttendanceMarked(true); // ✅ Attendance already done
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
      setShowAttendanceButton(fixedDistance <= 10000 && !isAttendanceMarked); // ✅ only show if within range and not marked
    } else {
      const formData = { longitude: currentLng, latitude: currentLat };
      if (userData[0].longitude === null && userData[0].latitude === null) {
        console.log("⚠️ Coordinates missing in DB. Updating now...");
        patchUserById(userId, formData).catch(() =>
          console.log("Error updating user coordinates")
        );
        fetchUserAttendanceData();
      }
      setShowAttendanceButton(true); // ✅ Show button on first-time even before diff calc
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
    if (!currentLat || !currentLng) {
      alert("Location is required to mark attendance");
      return;
    }

    // ✅ auto-set visitingLocation from schoolContext if attendanceType is "Center Visit"
    const locationToSend =
      attendanceType === "Center Visit"
        ? schoolContext?.[0]?.label || "NA"
        : visitingLocation;

    if (!attendanceType || (attendanceType !== "WFH" && !locationToSend)) {
      alert("Please complete all required attendance fields.");
      return;
    }

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
    formData.append("attendanceType", attendanceType);
    formData.append("visitingLocation", locationToSend);

    console.log("📤 Payload Coordinates:");
    console.log("   ➤ Longitude:", currentLng);
    console.log("   ➤ Latitude:", currentLat);
    console.log("   ➤ Coordinate Difference:", coordinateDifference);

    try {
      setLoading(true); // ✅ start loading spinner
      const image = await openCameraAndCaptureImage();
      formData.append("file", image);

      console.log("📎 Attached Image:", image?.name);
      await PatchUserAttendanceByUserId(queryParams, formData);
      alert("✅ Attendance marked successfully.");
      setIsAttendanceMarked(true); // ✅ Mark as done
      setShowAttendanceButton(false);
    } catch (err) {
      console.log("❌ Error marking attendance:", err.message);
    } finally {
      setLoading(false); // ✅ stop loading spinner
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (userData?.[0]?.role === "CC") {
      navigate("/user-dash");
    } else if (userData?.[0]?.role === "ACI") {
      navigate("/l2-user-dash");
    }
  };

  return (
    <>
      {locationError && (
        <div className="location-error">
          {locationError}. Please enable location services.
        </div>
      )}

      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mark Your Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3 text-center">
            {isAttendanceMarked ? (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ✅ Attendance marked for date:{" "}
                {new Date().toISOString().split("T")[0]}
              </p>
            ) : (
              <>
                <Form.Group className="mb-2 text-start">
                  <Form.Label>Attendance Type</Form.Label>
                  <Select
                    options={[
                      { value: "", label: "Select Type" },
                      { value: "Center Visit", label: "Center Visit" },
                      { value: "WFH", label: "WFH" },
                      {
                        value: "Govt. Official Visit",
                        label: "Govt. Official Visit",
                      },
                      { value: "Event", label: "Event" },
                    ]}
                    value={
                      attendanceType
                        ? { value: attendanceType, label: attendanceType }
                        : { value: "", label: "Select Type" }
                    }
                    onChange={(selectedOption) => {
                      setAttendanceType(selectedOption.value);
                      setVisitingLocation("");
                    }}
                  />
                </Form.Group>

                {attendanceType === "Center Visit" && (
                  <div>
                    <SchoolDropDowns />
                  </div>
                )}

                {attendanceType === "Govt. Official Visit" && (
                  <Form.Group className="mb-2 text-start">
                    <Form.Label>Enter Govt. Official Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={visitingLocation}
                      onChange={(e) => setVisitingLocation(e.target.value)}
                      placeholder="e.g. BDO Office"
                    />
                  </Form.Group>
                )}

                {attendanceType === "Event" && (
                  <Form.Group className="mb-2 text-start">
                    <Form.Label>Enter Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={visitingLocation}
                      onChange={(e) => setVisitingLocation(e.target.value)}
                      placeholder="e.g. Health Fair"
                    />
                  </Form.Group>
                )}

                {showAttendanceButton &&
                  (attendanceType === "WFH" ||
                    visitingLocation ||
                    attendanceType === "Center Visit") && (
                    <Button variant="success" onClick={updateUserAttendance} disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Uploading...
                        </>
                      ) : (
                        "📸 Mark Your Attendance"
                      )}
                    </Button>
                  )}

                {!showAttendanceButton && (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    You are not within 100 meters of your center.
                  </p>
                )}
              </>
            )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleModalClose}
            className="w-100"
          >
            Go to Home
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
