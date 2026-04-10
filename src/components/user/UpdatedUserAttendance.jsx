
// //src/compoents/user/UpdatedUserAttendance.jsx

// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import {
//   GetAttendanceByUserId,
//   PatchUserAttendanceByUserId,
// } from "../../service/userAttendance.services";
// import { patchUserById } from "../../service/User.service";
// import { Modal, Button, Card, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { selfAttendanceGamification } from "../../service/Gamification.services";

// import { selfAttendance } from "../../service/ErpTest.services";

// export const UserAttendanceUpdated = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [show, setShow] = useState(false);
//   const [showWithoutGeoLocationModal, setShowWithoutGeoLocationModal] = useState(false);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

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
//     const userId = userData.userId;
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       console.log(attendance)
//       setUserAttendanceData(attendance);

//       if (attendance?.attendance === "Present") {
//         setIsAttendanceMarked(true);
//         setShowAttendanceButton(false);
//       } else {
//         setIsAttendanceMarked(false);
//         setShowAttendanceButton(true);
//       }
//     } catch (error) {
//       console.log("❌ Error fetching attendance", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceData();
//   }, []);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//       },
//       (err) => {
//         setLocationError(`Location access denied: ${err.message}`);
//       },
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   const checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist = () => {
//     if (userData.longitude === null && userData.latitude === null) {
//       setShow(true);
//     } else {
//       setShowWithoutGeoLocationModal(true);
//     }
//   };

//   useEffect(() => {
//     checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist();
//   }, []);

//   const handleGeolocationUpdate = async () => {
//     const formData = { longitude: currentLng, latitude: currentLat };
//     try {
//       const response = await patchUserById(userData.userId, formData);
//       if (response.message === undefined) {
//         setShowWithoutGeoLocationModal(true);
//         setShow(false);
//       }
//     } catch (error) {
//       setShowWithoutGeoLocationModal(true);
//       setShow(false);
//     }
//   };




// const handleClose = () =>{

//   setShow(false);

//   navigate('/user-dashboard')
// }


//   // 🟢 Modified to preprocess image before setting state
//   const handleImageCapture = async (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const compressedFile = await preprocessImage(file);
//       setImage(compressedFile);
//       setImagePreview(URL.createObjectURL(compressedFile));
//     }
//   };

//   const updateUserAttendance = async () => {
//     const userId = userData.userId;
//     setIsSubmitting(true);

//     const attendanceStatus =
//       userAttendanceData.attendance === "Present" ? null : "Present";

//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const formData = new FormData();
//     const now = Date.now();

//     if (attendanceStatus) {
//       formData.append("attendance", attendanceStatus);
//       formData.append("loginTime", now);
//     } else {
//       formData.append("logoutTime", now);
//       formData.append("logoutLongitude", currentLng || 0);
//       formData.append("logoutLatitude", currentLat || 0);
//       formData.append("logoutCoordinateDifference", 0);
//     }

//     formData.append("longitude", currentLng || 0);
//     formData.append("latitude", currentLat || 0);
//     formData.append("coordinateDifference", 0);
//     formData.append("file", image);

//     try {
//       const response = await PatchUserAttendanceByUserId(queryParams, formData);
//       console.log(formData)
//       if (response.status === 200) {
//         alert("✅ Attendance marked successfully.");
//         setShowAttendanceButton(false);
//         await fetchUserAttendanceData();


      
//         if (userData.role === "CC"){


//         // alert('gamification')

//           //Below gamifcation setup
//         const gamificationReqBOdy = {
//           unqUserObjectId: userData._id,
//           date: new Date()
//         }
      
//         // alert(userData.role)

//         const gamificationResponse = await selfAttendanceGamification(gamificationReqBOdy)
        
//         console.log(gamificationReqBOdy.data)

//         //--------------------------------------------------------

//         }

        


//         //Below ERP TEST DATA

         

//         if (userData.role === "hkrn"){

//           // alert('hi hkrn')
       

//           const erpTestReqBody = {
//           unqUserObjectId: userData._id,
//           userId: userData.userId,
//           selfAttendance: true
//         }

//         const erpTestResponse = await selfAttendance (erpTestReqBody);

//         // navigate('/erp-test')
//         }

        


//       } else {
//         throw new Error("Attendance not saved");
//       }
//     } catch (err) {
//       console.log("❌ Error marking attendance:", err.message);
//       // alert("❌ इंटरनेट की समस्या है, कृपया पुनः प्रयास करें या अपने वरिष्ठ से संपर्क करें।");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       {/* Geolocation Modal */}
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Geolocation Required!</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Your geolocation is not updated! Click on below button to update your center
//           geo-location. (अपने केंद्र का भौगोलिक स्थान अपडेट करने के लिए नीचे दिए गए बटन पर क्लिक करें।)
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleGeolocationUpdate}>
//             Click to update!
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Attendance Modal */}
//       <Modal show={showWithoutGeoLocationModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance!</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3 text-center">
//             {userAttendanceData?.attendance === "Present" ? (
//               <p style={{ color: "green", fontWeight: "bold" }}>
//                 ✅ Attendance marked for date: {new Date().toISOString().split("T")[0]}
//               </p>
//             ) : showAttendanceButton ? (
//               <>
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

//                 {/* Mark Attendance Button */}
//                 {image && (
//                   <Button variant="success" onClick={updateUserAttendance} disabled={isSubmitting}>
//                     {isSubmitting ? (
//                       <>
//                         <Spinner animation="border" size="sm" role="status" className="me-2" />
//                         Marking Attendance...
//                       </>
//                     ) : (
//                       "📍 Mark Your Attendance"
//                     )}
//                   </Button>
//                 )}
//               </>
//             ) : null}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleClose}>
//             Go To Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
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
// import { selfAttendanceGamification } from "../../service/Gamification.services";
// import { selfAttendance } from "../../service/ErpTest.services";

// export const UserAttendanceUpdated = () => {
//   const navigate = useNavigate();
//   const { userData } = useContext(UserContext);

//   const [currentLat, setCurrentLat] = useState(null);
//   const [currentLng, setCurrentLng] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [show, setShow] = useState(false);
//   const [showWithoutGeoLocationModal, setShowWithoutGeoLocationModal] = useState(false);
//   const [userAttendanceData, setUserAttendanceData] = useState([]);
//   const [showAttendanceButton, setShowAttendanceButton] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // 🟢 Optimized Image Preprocessing Function (No Base64)
//   const preprocessImage = (file) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       const objectUrl = URL.createObjectURL(file);
      
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");

//         const MAX_WIDTH = 500;
//         const scaleSize = MAX_WIDTH / img.width;
//         canvas.width = MAX_WIDTH;
//         canvas.height = img.height * scaleSize;

//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//         // Start with quality 0.7, reduce if needed
//         let quality = 0.7;
        
//         const compressWithQuality = (currentQuality) => {
//           canvas.toBlob((blob) => {
//             if (blob.size / 1024 > 100 && currentQuality > 0.1) {
//               // Still too large, reduce quality and try again
//               compressWithQuality(currentQuality - 0.05);
//             } else {
//               const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { 
//                 type: "image/jpeg" 
//               });
//               URL.revokeObjectURL(objectUrl); // Clean up memory
//               resolve(newFile);
//             }
//           }, "image/jpeg", currentQuality);
//         };
        
//         compressWithQuality(quality);
//       };
      
//       img.onerror = () => {
//         URL.revokeObjectURL(objectUrl);
//         resolve(file); // Fallback to original file
//       };
      
//       img.src = objectUrl;
//     });
//   };

//   const fetchUserAttendanceData = async () => {
//     const userId = userData.userId;
//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const response = await GetAttendanceByUserId(queryParams);
//       const attendance = response.data.data?.[0]?.attendances;
//       console.log(attendance);
//       setUserAttendanceData(attendance);

//       if (attendance?.attendance === "Present") {
//         setIsAttendanceMarked(true);
//         setShowAttendanceButton(false);
//       } else {
//         setIsAttendanceMarked(false);
//         setShowAttendanceButton(true);
//       }
//     } catch (error) {
//       console.log("❌ Error fetching attendance", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserAttendanceData();
//   }, []);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLat(position.coords.latitude);
//         setCurrentLng(position.coords.longitude);
//       },
//       (err) => {
//         setLocationError(`Location access denied: ${err.message}`);
//       },
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   const checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist = () => {
//     if (userData.longitude === null && userData.latitude === null) {
//       setShow(true);
//     } else {
//       setShowWithoutGeoLocationModal(true);
//     }
//   };

//   useEffect(() => {
//     checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist();
//   }, []);

//   const handleGeolocationUpdate = async () => {
//     const formData = { longitude: currentLng, latitude: currentLat };
//     try {
//       const response = await patchUserById(userData.userId, formData);
//       if (response.message === undefined) {
//         setShowWithoutGeoLocationModal(true);
//         setShow(false);
//       }
//     } catch (error) {
//       setShowWithoutGeoLocationModal(true);
//       setShow(false);
//     }
//   };

//   const handleClose = () => {
//     setShow(false);
//     navigate('/user-dashboard');
//   };

//   // 🟢 Modified to preprocess image before setting state
//   const handleImageCapture = async (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Clean up previous preview URL if exists
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
      
//       const compressedFile = await preprocessImage(file);
//       setImage(compressedFile);
//       setImagePreview(URL.createObjectURL(compressedFile));
//     }
//   };

//   const updateUserAttendance = async () => {
//     const userId = userData.userId;
//     setIsSubmitting(true);

//     const attendanceStatus =
//       userAttendanceData?.attendance === "Present" ? null : "Present";

//     const queryParams = {
//       userId,
//       date: new Date().toISOString().split("T")[0],
//     };

//     const formData = new FormData();
//     const now = Date.now();

//     if (attendanceStatus) {
//       formData.append("attendance", attendanceStatus);
//       formData.append("loginTime", now);
//     } else {
//       formData.append("logoutTime", now);
//       formData.append("logoutLongitude", currentLng || 0);
//       formData.append("logoutLatitude", currentLat || 0);
//       formData.append("logoutCoordinateDifference", 0);
//     }

//     formData.append("longitude", currentLng || 0);
//     formData.append("latitude", currentLat || 0);
//     formData.append("coordinateDifference", 0);
//     formData.append("file", image);

//     try {
//       const response = await PatchUserAttendanceByUserId(queryParams, formData);
//       console.log(formData);
//       if (response.status === 200) {
//         alert("✅ Attendance marked successfully.");
//         setShowAttendanceButton(false);
//         await fetchUserAttendanceData();

//         if (userData.role === "CC") {
//           // Gamification setup
//           const gamificationReqBOdy = {
//             unqUserObjectId: userData._id,
//             date: new Date()
//           };
          
//           const gamificationResponse = await selfAttendanceGamification(gamificationReqBOdy);
//           console.log(gamificationResponse?.data);
//         }

//         if (userData.role === "hkrn") {
//           const erpTestReqBody = {
//             unqUserObjectId: userData._id,
//             userId: userData.userId,
//             selfAttendance: true
//           };

//           const erpTestResponse = await selfAttendance(erpTestReqBody);
//         }

//       } else {
//         throw new Error("Attendance not saved");
//       }
//     } catch (err) {
//       console.log("❌ Error marking attendance:", err.message);
//       alert("❌ Internet issue, please try again or contact your supervisor.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Clean up preview URL on component unmount
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

//   return (
//     <div>
//       {/* Geolocation Modal */}
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Geolocation Required!</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Your geolocation is not updated! Click on below button to update your center
//           geo-location. (अपने केंद्र का भौगोलिक स्थान अपडेट करने के लिए नीचे दिए गए बटन पर क्लिक करें।)
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleGeolocationUpdate}>
//             Click to update!
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Attendance Modal */}
//       <Modal show={showWithoutGeoLocationModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Mark Your Attendance!</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Card className="p-3 text-center">
//             {userAttendanceData?.attendance === "Present" ? (
//               <p style={{ color: "green", fontWeight: "bold" }}>
//                 ✅ Attendance marked for date: {new Date().toISOString().split("T")[0]}
//               </p>
//             ) : showAttendanceButton ? (
//               <>
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

//                 {/* Mark Attendance Button */}
//                 {image && (
//                   <Button variant="success" onClick={updateUserAttendance} disabled={isSubmitting}>
//                     {isSubmitting ? (
//                       <>
//                         <Spinner animation="border" size="sm" role="status" className="me-2" />
//                         Marking Attendance...
//                       </>
//                     ) : (
//                       "📍 Mark Your Attendance"
//                     )}
//                   </Button>
//                 )}
//               </>
//             ) : null}
//           </Card>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleClose}>
//             Go To Home
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };


















// UserAttendanceUpdated.jsx
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { patchUserById } from "../../service/User.service";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { selfAttendance } from "../../service/ErpTest.services";

export const UserAttendanceUpdated = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [show, setShow] = useState(false);
  const [showWithoutGeoLocationModal, setShowWithoutGeoLocationModal] = useState(false);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 🟢 Optimized Image Preprocessing Function (No Base64)
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.7;
        
        const compressWithQuality = (currentQuality) => {
          canvas.toBlob((blob) => {
            console.log(`📊 Compression: ${(blob.size / 1024).toFixed(2)}KB at quality ${currentQuality}`);
            if (blob.size / 1024 > 100 && currentQuality > 0.1) {
              compressWithQuality(currentQuality - 0.05);
            } else {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { 
                type: "image/jpeg" 
              });
              URL.revokeObjectURL(objectUrl);
              console.log(`✅ Final compressed size: ${(newFile.size / 1024).toFixed(2)}KB`);
              resolve(newFile);
            }
          }, "image/jpeg", currentQuality);
        };
        
        compressWithQuality(quality);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        console.error("❌ Image loading failed, using original file");
        resolve(file);
      };
      
      img.src = objectUrl;
    });
  };

  const fetchUserAttendanceData = async () => {
    const userId = userData.userId;
    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await GetAttendanceByUserId(queryParams);
      const attendance = response.data.data?.[0]?.attendances;
      console.log("📋 Fetched attendance:", attendance);
      setUserAttendanceData(attendance);

      if (attendance?.attendance === "Present") {
        setIsAttendanceMarked(true);
        setShowAttendanceButton(false);
      } else {
        setIsAttendanceMarked(false);
        setShowAttendanceButton(true);
      }
    } catch (error) {
      console.log("❌ Error fetching attendance", error.message);
    }
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
        console.log("📍 Location obtained:", position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLocationError(`Location access denied: ${err.message}`);
        console.error("❌ Location error:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist = () => {
    if (userData.longitude === null && userData.latitude === null) {
      setShow(true);
    } else {
      setShowWithoutGeoLocationModal(true);
    }
  };

  useEffect(() => {
    checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist();
  }, []);

  const handleGeolocationUpdate = async () => {
    const formData = { longitude: currentLng, latitude: currentLat };
    try {
      const response = await patchUserById(userData.userId, formData);
      if (response.message === undefined) {
        setShowWithoutGeoLocationModal(true);
        setShow(false);
      }
    } catch (error) {
      setShowWithoutGeoLocationModal(true);
      setShow(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    navigate('/user-dashboard');
  };

  const handleImageCapture = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`📸 Original file size: ${(file.size / 1024).toFixed(2)}KB`);
      
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      const compressedFile = await preprocessImage(file);
      setImage(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    }
  };

  const updateUserAttendance = async () => {
    const userId = userData.userId;
    setIsSubmitting(true);
    setUploadProgress(0);

    const attendanceStatus =
      userAttendanceData?.attendance === "Present" ? null : "Present";

    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    const formData = new FormData();
    const now = Date.now();

    if (attendanceStatus) {
      formData.append("attendance", attendanceStatus);
      formData.append("loginTime", now);
      console.log("✅ Marking LOGIN attendance");
    } else {
      formData.append("logoutTime", now);
      formData.append("logoutLongitude", currentLng || 0);
      formData.append("logoutLatitude", currentLat || 0);
      formData.append("logoutCoordinateDifference", 0);
      console.log("✅ Marking LOGOUT attendance");
    }

    formData.append("longitude", currentLng || 0);
    formData.append("latitude", currentLat || 0);
    formData.append("coordinateDifference", 0);
    
    if (image) {
      formData.append("file", image);
      console.log(`📤 Uploading file: ${image.name}, Size: ${(image.size / 1024).toFixed(2)}KB`);
    } else {
      console.warn("⚠️ No image captured!");
    }

    try {
      const response = await PatchUserAttendanceByUserId(queryParams, formData, (progress) => {
        setUploadProgress(progress);
      });
      
      console.log("📡 API Response:", response);
      
      if (response.status === 200) {
        alert("✅ Attendance marked successfully.");
        setShowAttendanceButton(false);
        setImage(null);
        setImagePreview(null);
        await fetchUserAttendanceData();

        

        if (userData.role === "hkrn") {
          const erpTestReqBody = {
            unqUserObjectId: userData._id,
            userId: userData.userId,
            selfAttendance: true
          };
          const erpTestResponse = await selfAttendance(erpTestReqBody);
          console.log("📊 ERP Test response:", erpTestResponse);
        }
      } else {
        throw new Error("Attendance not saved");
      }
    } catch (err) {
      console.error("❌ Error marking attendance:", err);
      alert(`❌ Failed to mark attendance: ${err.message || "Please try again"}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Geolocation Required!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your geolocation is not updated! Click on below button to update your center
          geo-location. (अपने केंद्र का भौगोलिक स्थान अपडेट करने के लिए नीचे दिए गए बटन पर क्लिक करें।)
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleGeolocationUpdate}>
            Click to update!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWithoutGeoLocationModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mark Your Attendance!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3 text-center">
            {userAttendanceData?.attendance === "Present" ? (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ✅ Attendance marked for date: {new Date().toISOString().split("T")[0]}
              </p>
            ) : showAttendanceButton ? (
              <>
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

                <input
                  id="cameraInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  style={{ display: "none" }}
                />

                {image && (
                  <Button variant="success" onClick={updateUserAttendance} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" role="status" className="me-2" />
                        {uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : "Processing..."}
                      </>
                    ) : (
                      "📍 Mark Your Attendance"
                    )}
                  </Button>
                )}
              </>
            ) : null}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Go To Home
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};