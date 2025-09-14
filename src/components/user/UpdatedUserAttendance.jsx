
// //src/compoents/user/UpdatedUserAttendance.jsx

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { patchUserById } from "../../service/User.service";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { selfAttendanceGamification } from "../../service/Gamification.services";

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
    const userId = userData.userId;
    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await GetAttendanceByUserId(queryParams);
      const attendance = response.data.data?.[0]?.attendances;
      console.log(attendance)
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
      },
      (err) => {
        setLocationError(`Location access denied: ${err.message}`);
      },
      { enableHighAccuracy: true }
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




const handleClose = () =>{

  setShow(false);

  navigate('/user-dashboard')
}


  // 🟢 Modified to preprocess image before setting state
  const handleImageCapture = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const compressedFile = await preprocessImage(file);
      setImage(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    }
  };

  const updateUserAttendance = async () => {
    const userId = userData.userId;
    setIsSubmitting(true);

    const attendanceStatus =
      userAttendanceData.attendance === "Present" ? null : "Present";

    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    const formData = new FormData();
    const now = Date.now();

    if (attendanceStatus) {
      formData.append("attendance", attendanceStatus);
      formData.append("loginTime", now);
    } else {
      formData.append("logoutTime", now);
      formData.append("logoutLongitude", currentLng || 0);
      formData.append("logoutLatitude", currentLat || 0);
      formData.append("logoutCoordinateDifference", 0);
    }

    formData.append("longitude", currentLng || 0);
    formData.append("latitude", currentLat || 0);
    formData.append("coordinateDifference", 0);
    formData.append("file", image);

    try {
      const response = await PatchUserAttendanceByUserId(queryParams, formData);
      console.log(formData)
      if (response.status === 200) {
        alert("✅ Attendance marked successfully.");
        setShowAttendanceButton(false);
        await fetchUserAttendanceData();


        const gamificationReqBOdy = {
          unqUserObjectId: userData._id,
          date: new Date()
        }

        const gamificationResponse = await selfAttendanceGamification(gamificationReqBOdy)
        
        console.log(gamificationReqBOdy.data)

      } else {
        throw new Error("Attendance not saved");
      }
    } catch (err) {
      console.log("❌ Error marking attendance:", err.message);
      alert("❌ इंटरनेट की समस्या है, कृपया पुनः प्रयास करें या अपने वरिष्ठ से संपर्क करें।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Geolocation Modal */}
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

      {/* Attendance Modal */}
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

                {/* Mark Attendance Button */}
                {image && (
                  <Button variant="success" onClick={updateUserAttendance} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" role="status" className="me-2" />
                        Marking Attendance...
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

