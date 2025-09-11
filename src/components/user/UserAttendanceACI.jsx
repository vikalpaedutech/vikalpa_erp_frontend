
// // Refactored ACI Attendance component to match the structure & flow of UpdatedUserAttendance.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Modal, Button, Card, Spinner, Form } from "react-bootstrap";
// import Select from "react-select";

// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";
// import { SchoolContext } from "../contextAPIs/DependentDropdowns.contextAPI";

// export const UserAttendanceACI = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);
//   const { schoolContext } = useContext(SchoolContext);

//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [showGeoModal, setShowGeoModal] = useState(false);
//   const [showAttendanceModal, setShowAttendanceModal] = useState(false);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [attendanceType, setAttendanceType] = useState("");
//   const [visitingLocation, setVisitingLocation] = useState("");

//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // 🟢 Image Preprocessing Function (compress to ~25KB)
//   const preprocessImage = (file) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           const MAX_WIDTH = 500;
//           const scaleSize = MAX_WIDTH / img.width;
//           canvas.width = MAX_WIDTH;
//           canvas.height = img.height * scaleSize;

//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//           let quality = 0.7;
//           let base64 = canvas.toDataURL("image/jpeg", quality);

//           while (base64.length / 1024 > 100 && quality > 0.1) {
//             quality -= 0.05;
//             base64 = canvas.toDataURL("image/jpeg", quality);
//           }

//           fetch(base64)
//             .then((res) => res.blob())
//             .then((blob) => {
//               const newFile = new File([blob], file.name, { type: "image/jpeg" });
//               resolve(newFile);
//             });
//         };
//       };
//     });
//   };

//   const fetchUserAttendanceData = async () => {
//     try {
//       const userId = userData?.userId;
//       const date = new Date().toISOString().split("T")[0];
//       const res = await GetAttendanceByUserId({ userId, date });
//       const attendance = res?.data?.data?.[0]?.attendances;
//       setUserAttendanceData(attendance);
//       setIsAttendanceMarked(attendance?.attendance === "Present");
//       setShowAttendanceButton(attendance?.attendance !== "Present");
//     } catch (err) {
//       console.log("Error fetching attendance", err);
//     }
//   };

//   const checkUserCoordinates = () => {
//     const { latitude, longitude } = userData?.[0] || {};
//     if (!latitude || !longitude) setShowGeoModal(true);
//     else setShowAttendanceModal(true);
//   };

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//       },
//       (err) => {
//         console.log("Location error", err);
//       },
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   useEffect(() => {
//     fetchUserAttendanceData();
//     checkUserCoordinates();
//   }, []);

//   const updateGeolocation = async () => {
//     try {
//       const userId = userData?.userId;
//       await patchUserById(userId, { latitude: currentLat, longitude: currentLng });
//       setShowGeoModal(false);
//       setShowAttendanceModal(true);
//     } catch (err) {
//       setShowGeoModal(false);
//       setShowAttendanceModal(true);
//     }
//   };

//   // 🟢 Modified to preprocess image before setting state
//   const handleImageCapture = async (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const compressedFile = await preprocessImage(file);
//       setImage(compressedFile);
//       setImagePreview(URL.createObjectURL(compressedFile));
//     }
//   };

//   const markAttendance = async () => {
//     alert('attendance is being marked')
//     setIsSubmitting(true);
//     try {
//       const userId = userData?.userId;
//       const date = new Date().toISOString().split("T")[0];
//       const queryParams = { userId, date };
//       const formData = new FormData();
//       const now = Date.now();

//       const attendanceStatus = isAttendanceMarked ? null : "Present";
//       if (attendanceStatus) formData.append("attendance", attendanceStatus);

//       formData.append("loginTime", now);
//       formData.append("longitude", currentLng || 0);
//       formData.append("latitude", currentLat || 0);
//       formData.append("coordinateDifference", 0);
//       formData.append("attendanceType", attendanceType);
//       formData.append("visitingLocation", attendanceType === "Center Visit" ? schoolContext?.[0]?.label : visitingLocation);

//       if (image) formData.append("file", image);

//       const res = await PatchUserAttendanceByUserId(queryParams, formData);
//       if (res?.status === 200) {
//         alert("✅ Attendance marked successfully.");
//         setIsAttendanceMarked(true);
//         setShowAttendanceButton(false);
//         fetchUserAttendanceData();
//       }
//     } catch (err) {
//       console.log("Error marking attendance", err);
//       alert("❌ Failed to mark attendance.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const closeModal = () => {
//     setShowGeoModal(false);
//     setShowAttendanceModal(false);
//     const role = userData?.role;
//     if (role === "CC") navigate("/user-dashboard");
//     else if (role === "ACI") navigate('/user-dashboard');//navigate("/l2-user-dash");
//     else navigate("/");
//   };

//   return (
//     <>
//       <Modal show={showGeoModal} onHide={closeModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Geolocation Required</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Please update your center coordinates first.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={updateGeolocation}>Update Coordinates</Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showAttendanceModal} onHide={closeModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3 text-center">
//             {isAttendanceMarked ? (
//               <p className="text-success fw-bold">
//                 ✅ Attendance marked for {new Date().toISOString().split("T")[0]}
//               </p>
//             ) : (
//               <>
//                 <Form.Group className="mb-2">
//                   <Form.Label>Attendance Type</Form.Label>
//                   <Select
//                     options={[
//                       { value: "", label: "Select Type" },
//                       { value: "Center Visit", label: "Center Visit" },
//                       { value: "WFH", label: "WFH" },
//                       { value: "Govt. Official Visit", label: "Govt. Official Visit" },
//                       { value: "Event", label: "Event" },
//                       { value: "Kurukshetra Campus Visit", label: "Kurukshetra Campus Visit" },
//                     ]}
//                     value={{ label: attendanceType || "Select Type", value: attendanceType }}
//                     onChange={(opt) => {
//                       setAttendanceType(opt.value);
//                       setVisitingLocation("");
//                     }}
//                   />
//                 </Form.Group>

//                 {attendanceType === "Center Visit" && <SchoolDropDowns />}

//                 {attendanceType !== "Center Visit" &&
//                   attendanceType !== "WFH" &&
//                   attendanceType !== "Kurukshetra Campus Visit" && (
//                   <Form.Group className="mb-2">
//                     <Form.Label>Visiting Location</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={visitingLocation}
//                       onChange={(e) => setVisitingLocation(e.target.value)}
//                     />
//                   </Form.Group>
//                 )}

//                 {/* Camera Trigger Box */}
//                 <div
//                   style={{
//                     border: "2px dashed gray",
//                     borderRadius: "10px",
//                     padding: "20px",
//                     marginBottom: "10px",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => document.getElementById("cameraInput").click()}
//                 >
//                   {imagePreview ? (
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
//                     />
//                   ) : (
//                     <p>📸 Click here to capture photo</p>
//                   )}
//                 </div>

//                 {/* Hidden Input */}
//                 <input
//                   id="cameraInput"
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={handleImageCapture}
//                   style={{ display: "none" }}
//                 />

//                 {showAttendanceButton && image && (
//                   <Button variant="success" onClick={markAttendance} disabled={isSubmitting}>
//                     {isSubmitting ? <Spinner animation="border" size="sm" className="me-2" /> : "📸 Mark Your Attendance"}
//                   </Button>
//                 )}
//               </>
//             )}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={closeModal} className="w-100">Go To Home</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };






















// Refactored ACI Attendance component to match the structure & flow of UpdatedUserAttendance.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Card, Spinner, Form } from "react-bootstrap";
import Select from "react-select";

import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";
import { SchoolContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";


export const UserAttendanceACI = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const { schoolContext } = useContext(SchoolContext);

  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceType, setAttendanceType] = useState("");
  const [visitingLocation, setVisitingLocation] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 🟢 Image Preprocessing Function (compress to ~25KB)
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = 0.7;
          let base64 = canvas.toDataURL("image/jpeg", quality);

          while (base64.length / 1024 > 100 && quality > 0.1) {
            quality -= 0.05;
            base64 = canvas.toDataURL("image/jpeg", quality);
          }

          fetch(base64)
            .then((res) => res.blob())
            .then((blob) => {
              const newFile = new File([blob], file.name, { type: "image/jpeg" });
              resolve(newFile);
            });
        };
      };
    });
  };

  const fetchUserAttendanceData = async () => {
    try {
      const userId = userData?.userId;
      const date = new Date().toISOString().split("T")[0];
      const res = await GetAttendanceByUserId({ userId, date });
      const attendance = res?.data?.data?.[0]?.attendances;
      setUserAttendanceData(attendance);
      setIsAttendanceMarked(attendance?.attendance === "Present");
      setShowAttendanceButton(attendance?.attendance !== "Present");
      setShowAttendanceModal(true);
    } catch (err) {
      console.log("Error fetching attendance", err);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
      },
      (err) => {
        console.log("Location error", err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);

  // 🟢 Modified to preprocess image before setting state
  const handleImageCapture = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const compressedFile = await preprocessImage(file);
      setImage(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    }
  };

  const markAttendance = async () => {

    setIsSubmitting(true);
    try {
      const userId = userData?.userId;
      const date = new Date().toISOString().split("T")[0];
      const queryParams = { userId, date };
      const formData = new FormData();
      const now = Date.now();

      const attendanceStatus = isAttendanceMarked ? null : "Present";
      if (attendanceStatus) formData.append("attendance", attendanceStatus);

      formData.append("loginTime", now);
      formData.append("longitude", currentLng || 0);
      formData.append("latitude", currentLat || 0);
      formData.append("coordinateDifference", 0);
      formData.append("attendanceType", attendanceType);
      formData.append("visitingLocation", attendanceType === "Center Visit" ? schoolContext?.[0]?.label : visitingLocation);

      if (image) formData.append("file", image);

      const res = await PatchUserAttendanceByUserId(queryParams, formData);
      if (res?.status === 200) {
        alert("✅ Attendance marked successfully.");
        setIsAttendanceMarked(true);
        setShowAttendanceButton(false);
        fetchUserAttendanceData();
      }
    } catch (err) {
      console.log("Error marking attendance", err);
      alert("❌ Failed to mark attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAttendanceModal(false);
    const role = userData?.role;
    if (role === "CC") navigate("/user-dashboard");
    else if (role === "ACI") navigate('/user-dashboard');//navigate("/l2-user-dash");
    else navigate("/");
  };

  return (
    <>
      <Modal show={showAttendanceModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mark Your Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3 text-center">
            {isAttendanceMarked ? (
              <p className="text-success fw-bold">
                ✅ Attendance marked for {new Date().toISOString().split("T")[0]}
              </p>
            ) : (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Attendance Type</Form.Label>
                  <Select
                    options={[
                      { value: "", label: "Select Type" },
                      { value: "Center Visit", label: "Center Visit" },
                      { value: "WFH", label: "WFH" },
                      { value: "Govt. Official Visit", label: "Govt. Official Visit" },
                      { value: "Event", label: "Event" },
                      { value: "Kurukshetra Campus Visit", label: "Kurukshetra Campus Visit" },
                    ]}
                    value={{ label: attendanceType || "Select Type", value: attendanceType }}
                    onChange={(opt) => {
                      setAttendanceType(opt.value);
                      setVisitingLocation("");
                    }}
                  />
                </Form.Group>

                {attendanceType === "Center Visit" && <SchoolDropdown />}
                    <br></br>
                {attendanceType !== "Center Visit" &&
                  attendanceType !== "WFH" &&
                  attendanceType !== "Kurukshetra Campus Visit" && (
                  <Form.Group className="mb-2">
                    <Form.Label>Visiting Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={visitingLocation}
                      onChange={(e) => setVisitingLocation(e.target.value)}
                    />
                  </Form.Group>
                )}

                {/* Camera Trigger Box */}
                <div
                  style={{
                    border: "2px dashed gray",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("cameraInput").click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                    />
                  ) : (
                    <p>📸 Click here to capture photo</p>
                  )}
                </div>

                {/* Hidden Input */}
                <input
                  id="cameraInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  style={{ display: "none" }}
                />

                {showAttendanceButton && image && (
                  <Button variant="success" onClick={markAttendance} disabled={isSubmitting}>
                    {isSubmitting ? <Spinner animation="border" size="sm" className="me-2" /> : "📸 Mark Your Attendance"}
                  </Button>
                )}
              </>
            )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal} className="w-100">Go To Home</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
