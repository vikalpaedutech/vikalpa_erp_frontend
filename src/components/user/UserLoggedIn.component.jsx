//UserLoggedIn.component.jsx

//After successfull login, user comes to this page.

import React, { useContext } from "react";
import { UserContext } from "../../components/contextAPIs/User.context.js";
import { useNavigate } from "react-router-dom";
import AttendanceMB from "../AcademicsComponents/AttendanceMB.component.jsx";

const UserLoggedIn = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const handleUserLogout = () => {
    setUserData([]); // ✅ Reset to empty array to match expected structure
    alert("Logged out");
    navigate("/user-signin");
  };

  // ✅ Check if userData exists and has valid structure
  const isUserLoggedIn = Array.isArray(userData) && userData.length > 0;

  return (
    <>
      <div>
        {isUserLoggedIn ? (
          <div>
            <h1>Welcome, {userData[0].assignedDistricts?.[0]}</h1>
            <button onClick={handleUserLogout}>Logout</button>
          </div>
        ) : (
          <p>Please log in to view your dashboard.</p>
        )}
      </div>

      <div>
        {isUserLoggedIn && (
          <AttendanceMB assignedDistricts={userData[0].assignedDistricts} />
        )}
      </div>
    </>
  );
};

export default UserLoggedIn;
