import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { patchUser } from "../../service/User.service";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export const UserAttendanceUpdated = () => {

    const navigate = useNavigate();

  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const { userData } = useContext(UserContext);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [coordinateDifference, setCoordinateDifference] = useState(null);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);
  const [showModal, setShowModal] = useState(true); // show modal on login

  const userId = userData?.[0]?.userId;
  const storedLat = userData?.[0]?.latitude;
  const storedLng = userData?.[0]?.longitude;

  // Get geolocation
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
        setLocationError(null);
        setLocationPermission("granted");
      },
      (err) => {
        setLocationError(`Location access denied: ${err.message}`);
        setLocationPermission("denied");
      },
      options
    );
  };

  useEffect(() => {
    getLocation();
    const watchId = navigator.geolocation.watchPosition(() => {}, () => {}, {
      enableHighAccuracy: true,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch attendance data
  const fetchUserAttendanceData = async () => {
    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await GetAttendanceByUserId(queryParams);
      const attendance = response.data.data?.[0]?.attendances;
      const userEntry = response.data.data?.[0];

      console.log("📥 Attendance API Response:", response.data.data);

      setUserAttendanceData(response.data.data);
      setUserLatitude(userEntry?.latitude);
      setUserLongitude(userEntry?.longitude);

      if (attendance?.attendance === "Present") {
        setAttendanceChecked(true);
      } else {
        setAttendanceChecked(false);
      }
    } catch (error) {
      console.log("❌ Error fetching attendance data", error.message);
    }
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);

  // Calculate distance between coordinates
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

  // Update coordinate difference
  useEffect(() => {
    if (storedLat && storedLng && currentLat && currentLng) {
      const distance = getDistanceInMeters(
        parseFloat(storedLat),
        parseFloat(storedLng),
        currentLat,
        currentLng
      );
      const fixedDistance = distance.toFixed(2);

      console.log("✅ Coordinates:");
      console.log("🗺️ DB Latitude:", storedLat);
      console.log("🗺️ DB Longitude:", storedLng);
      console.log("📍 Current Latitude:", currentLat);
      console.log("📍 Current Longitude:", currentLng);
      console.log("📏 Distance from center (m):", fixedDistance);

      setCoordinateDifference(fixedDistance);
    } else {
      console.log("⚠️ Missing coordinates to calculate distance.");
    }
  }, [storedLat, storedLng, currentLat, currentLng]);

  // Update showAttendanceButton based on distance
  useEffect(() => {
    if (coordinateDifference !== null) {
      setShowAttendanceButton(coordinateDifference <= 5000);
    }
  }, [coordinateDifference]);

  // Update attendance
  const updateUserAttendance = async (checked) => {
    if (!currentLat || !currentLng) {
      alert("Location is required to mark attendance");
      return;
    }

    const attendanceStatus = checked ? "Present" : "Absent";
    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    const loginTime = Date.now();
    const logoutTime = Date.now();

    let formData;

    if (userAttendanceData?.[0]?.attendances?.attendance === "Present") {
      formData = {
        logoutLongitude: currentLng,
        logoutLatitude: currentLat,
        logoutCoordinateDifference: coordinateDifference,
        logoutTime: logoutTime,
      };
    } else {
      formData = {
        attendance: attendanceStatus,
        longitude: currentLng,
        latitude: currentLat,
        coordinateDifference: coordinateDifference,
        loginTime: loginTime,
      };
    }

    try {
      await PatchUserAttendanceByUserId(queryParams, formData);
      console.log("✅ Attendance updated.");
    } catch (error) {
      console.log("❌ Error updating attendance:", error.message);
    }
  };

  // Main handler when user clicks the checkbox
  const handleCheckboxChange = async (e) => {
    const checked = e.target.checked;

    if (!showAttendanceButton) {
      alert("⚠️ You must be within 100 meters of your center to mark attendance.");
      return;
    }

    setAttendanceChecked(checked);

    // Step 1: If user does NOT have geo data, patch it first
    if (!storedLat || !storedLng || storedLat === "" || storedLng === "") {
      try {
        const patchData = {
          latitude: currentLat,
          longitude: currentLng,
        };
        await patchUser(userId, patchData);
        console.log("✅ User coordinates updated");
      } catch (error) {
        console.error("❌ Error updating user geolocation:", error.message);
        alert("Unable to update your location. Please try again.");
        return;
      }
    }

    // Step 2: Then mark attendance
    await updateUserAttendance(checked);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/user-dash')
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
          <Card className="p-3">
            {!showAttendanceButton && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                You are not within 100 meters of your center.
              </p>
            )}
            <Form>
              <Form.Check
                type="checkbox"
                id="attendance-checkbox"
                label="Mark your attendance"
                checked={attendanceChecked}
                disabled={!showAttendanceButton}
                onChange={handleCheckboxChange}
              />
            </Form>
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
