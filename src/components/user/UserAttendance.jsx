import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { GetAttendanceByUserId, PatchUserAttendanceByUserId } from "../../service/userAttendance.services";

export const UserAttendance = () => {
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const { userData, setUserData } = useContext(UserContext);
  const [userAttendanceData, setUserAttendanceData] = useState([]);
  const [toggleSwitchAttendance, setToggleSwitchAttendance] = useState(false);
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [coordinateDifference, setCoordinateDifference] = useState(null);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);

  // Enhanced geolocation function with permission handling
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0 // Force fresh location
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
        if (err.code === err.PERMISSION_DENIED) {
          // This will help us know if user explicitly denied permission
          setLocationPermission("denied");
        }
      },
      options
    );
  };

  // Check and request location permission on component mount
  useEffect(() => {
    getLocation();
    
    // For iOS devices, we need to watch position to keep asking for permission
    const watchId = navigator.geolocation.watchPosition(
      () => {}, 
      () => {},
      { enableHighAccuracy: true }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch user attendance data
  const fetchUserAttendanceData = async () => {
    const queryParams = {
      userId: userData?.[0]?.userId,
      date: new Date().toISOString().split("T")[0]
    };

    try {
      const response = await GetAttendanceByUserId(queryParams);
      setUserAttendanceData(response.data.data);
      setUserLatitude(response.data.data?.[0]?.latitude);
      setUserLongitude(response.data.data?.[0]?.longitude);

      if (response.data.data?.[0]?.attendances.attendance === "Present") {
        setToggleSwitchAttendance(true);
      }
    } catch (error) {
      console.log("Error fetching attendance data", error.message);
    }
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);

  // Calculate distance between coordinates
  function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371000; // radius of Earth in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Update distance when coordinates change
  useEffect(() => {
    if (userLatitude && userLongitude && currentLat && currentLng) {
      const distance = getDistanceInMeters(
        parseFloat(userLatitude),
        parseFloat(userLongitude),
        currentLat,
        currentLng
      );
      setCoordinateDifference(distance.toFixed(2));
    }
  }, [userLatitude, userLongitude, currentLat, currentLng]);

  // Check if user is within 100m radius
  useEffect(() => {
    if (coordinateDifference !== null) {
      setShowAttendanceButton(coordinateDifference <= 100);
    }
  }, [coordinateDifference]);

  const showCoordinateAlert = () => {
    if (!currentLat || !currentLng) {
      alert("Please enable location services to mark attendance");
    } else {
      alert("Attendance will only be allowed when you are in your center (within 100m)");
    }
  };

  // Update user attendance
  const updateUserAttendance = async () => {
    if (!currentLat || !currentLng) {
      alert("Location is required to mark attendance");
      return;
    }

    const attendanceStatus = toggleSwitchAttendance ? "Present" : "Absent";
    const queryParams = {
      userId: userData?.[0]?.userId,
      date: new Date().toISOString().split("T")[0],
    };

    let formData;
    const loginTime = Date.now();

    if (userAttendanceData?.[0]?.attendances?.attendance === "Present") {
      formData = {
        attendance: attendanceStatus,
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
    } catch (error) {
      console.log("Error updating attendance", error.message);
    }
  };

  useEffect(() => {
    if (toggleSwitchAttendance !== null) {
      updateUserAttendance();
    }
  }, [toggleSwitchAttendance]);

  // Button click handler with location check
  const handleAttendanceClick = () => {
    if (!currentLat || !currentLng) {
      alert("Please enable location services to mark attendance");
      getLocation(); // Try to get location again
      return;
    }
    setToggleSwitchAttendance(!toggleSwitchAttendance);
  };

  return (
    <>
      {locationError && (
        <div className="location-error">
          {locationError}. Please enable location services.
        </div>
      )}

      {showAttendanceButton ? (
        <div className={`User-attendance-main ${toggleSwitchAttendance ? "green" : "red"}`}>
          <div
            className={`user-attendance-circle ${toggleSwitchAttendance ? "active" : "inactive"}`}
            onClick={handleAttendanceClick}
          ></div>
          {toggleSwitchAttendance ? (
            <p style={{ marginTop: '15%', marginRight: '10%', fontWeight: 'bold' }}>Present</p>
          ) : (
            <p style={{ marginTop: '15%', marginRight: '10%', fontWeight: 'bold' }}>Absent</p>
          )}
        </div>
      ) : (
        <div className={`User-attendance-main ${toggleSwitchAttendance ? "green" : "red"}`}>
          <div
            className={`user-attendance-circle ${toggleSwitchAttendance ? "active" : "inactive"}`}
            onClick={showCoordinateAlert}
          ></div>
          <p style={{ marginTop: '15%', marginRight: '10%', fontWeight: 'bold' }}>⛈️</p>
        </div>
      )}
    </>
  );
};