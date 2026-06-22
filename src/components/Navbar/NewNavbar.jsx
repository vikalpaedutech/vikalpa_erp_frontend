
import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";

import { GetNotificationByUserIdOnQueryParams } from "../../service/ConcernsServices/Concern.services";
import { getNotificationsByUserId, patchNotificationByConcernTypeAndRole } from "../../service/notifications/notifications.service";
import Region from "../Students/Region.json"

import {
  getAllGamificationData,
  pointClaimedUpdation,
} from "../../service/Gamification.services";
export const NewNavbar = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [notificationData, setNotificationData] = useState([]); // ✅ initialized as array

   const [gamificationData, setGamificationData] = useState([]);


   console.log(Region)

  const navigate = useNavigate();

  const handleHome = () => {
    
    // if (userData?.[0]?.role === "CC") {
    //   navigate("/user-dash");
    // } else if (userData?.[0]?.role === "ACI") {
    //   navigate("/l2-user-dash");
    // } else if ( userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator"
      

    // ) {

    //     navigate("/l0-user-dash");

    // }
    // else if (userData?.[0]?.role === "Community Manager"){
    //   navigate("/l3-user-dash");
    // } else if (userData?.[0]?.role === "admin"){
    //   navigate("/admin-dash");
    // } else if (userData?.[0]?.role === "Technician"){

    //   navigate("/tech-dash")

    // } else {
    //    navigate("/l0-user-dash");
    // }

    navigate("/user-dashboard")
  };

  const handleIndividualConcernClick = () => {
    navigate("/individual-concerns-form");
  };

  const handleAwardPoints = () =>{
    navigate("/claim-gamification-point");
  }

  const handleProfileClick = () => {
    // alert("Coming soon!");

    navigate('/user-profile')
  };

  // Get notification api.
  const fetchNotifications = async () => {
    const queryParams = {
      userId: userData?.userId,
    };

    try {
      const response = await getNotificationsByUserId(queryParams);

      console.log('I am above data')
      console.log(response.data);
      setNotificationData(response.data);
    } catch (error) {
      console.log("Error fetching notification data", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  //-------------------------



//role handling. This is dynamically changes updates only those notification data...
//... where userId, role, and concernType matches.
let role;
if (userData?.role === "ACI"){
  role = "CC"
} else if (userData?.role === "Community Manager"){
  role = "ACI"
}



//----------------------------------------------

//Handle ConcernClick
  const handleConcernClick = async (concernType) => {


  const payload = {
    concernType: concernType,
    role: role,
    userId: userData?.userId
  }

    console.log(payload);

  try {
    
    const response = await patchNotificationByConcernTypeAndRole(payload) 

    

  } catch (error) {

    console.log("Error:", error)
    
  }
};

//--------------------------------------

//Fetching gamification points for logged in user.

// ✅ fetch gamification data
  const fetchGamficationData = async () => {
    const reqBody = { unqUserObjectId: userData?._id };

    try {
      const response = await getAllGamificationData(reqBody);
      // ✅ sort by date ascending
      const sortedData = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setGamificationData(sortedData);
      console.log(response.data)
    } catch (error) {
      console.log("Error::::>", error);
    }
  };


    useEffect(() => {
      fetchGamficationData();
    }, []);
  

    console.log(userData)

//-------------------------------------------

  return (
    <Navbar bg="light" className="shadow-sm">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* Left: Home Icon */}
        <div style={{ cursor: "pointer" }} onClick={handleHome}>
          <img
            src="/home-button.png"
            className="home-button"
            alt="Home"
            style={{ height: "30px" }}
          />
        </div>
      

        {/* <h1>{userData.name}</h1> */}
        {/* Center: Empty (optional - or could place logo) */}
        <Nav className="me-auto" />

        {/* Right: Gear Dropdown */}

        <Nav>
          {/* <NavDropdown
            align="end"
            title={
              <img
                src="/notification.png"
                className="notification"
                alt="notification"
                style={{ height: "30px", cursor: "pointer" }}
              />
            }
            id="settings-dropdown"
          > */}
     

          <NavDropdown
            align="end"
            title={
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src="/notification.png"
                  className="notification"
                  alt="notification"
                  style={{ height: "30px", cursor: "pointer" }}
                />
                {notificationData.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      lineHeight: "1",
                    }}
                  >
                    {notificationData.reduce(
                      (sum, item) => sum + (item.totalCount || 0),
                      0
                    )}
                  </span>
                )}
              </div>
            }
            id="settings-dropdown"
          >
            {/* ✅ Notification items with routing based on concernType */}
            {notificationData.length > 0 &&
              notificationData.map((item, index) => (
                <NavDropdown.Item
                  key={index}
                  onClick={() => {
                    handleConcernClick(item.concernType);
                    if (item.concernType === "Leave") {
                      navigate("/individual-concerns-resolution");
                    } else if (item.concernType === "Tech Concern") {
                      navigate("/tech-concerns-resolution");
                    } else if (
                      item.concernType === "School-Individual-Student"
                    ) {
                      navigate("/school-concerns-request");
                    }
                  }}
                >
                  <span style={{ fontWeight: "500" }}>{item.concernType}</span>
                  <span style={{ float: "right", color: "gray" }}>
                    {item.totalCount}
                  </span>
                  
                </NavDropdown.Item>
              ))}
          </NavDropdown>

          <NavDropdown
            align="end"
            title={
              <img
                src="/settings.png"
                className="logout"
                alt="Settings"
                style={{ height: "30px", cursor: "pointer" }}
              />
            }
            id="settings-dropdown"
          >
            <NavDropdown.Item onClick={handleProfileClick}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleIndividualConcernClick}>
              Individual Concerns
            </NavDropdown.Item>

            {userData?.role === "CC" ? ( <NavDropdown.Item onClick={handleAwardPoints}>
              Claim Points
            </NavDropdown.Item>):(null)}

           
            {/* <NavDropdown.Item>Other</NavDropdown.Item> */}
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={() => {
                setUserData([]);
                navigate("/");
              }}
            >
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};











// import React, { useContext, useEffect, useState } from "react";
// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";

// import { getNotificationsByUserId, patchNotificationByConcernTypeAndRole } from "../../service/notifications/notifications.service";

// import {
//   getAllGamificationData,
//   pointClaimedUpdation,
// } from "../../service/Gamification.services";
// import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";
// import Region from "../Students/Region.json";

// export const NewNavbar = () => {
//   const { userData, setUserData } = useContext(UserContext);
//   const [notificationData, setNotificationData] = useState([]);
//   const [gamificationData, setGamificationData] = useState([]);
//   const navigate = useNavigate();

//   // ──────────────────────────────────────────────────────────────
//   // ✅ FUNCTION TO EXTRACT SCHOOL IDs FROM NESTED STRUCTURE
//   // ──────────────────────────────────────────────────────────────
//   const extractSchoolIdsFromUserData = (userData) => {
//     const schoolIds = [];
    
//     try {
//       // Navigate through the nested structure
//       const region = userData?.userAccess?.region || [];
      
//       region.forEach((district) => {
//         const blockIds = district?.blockIds || [];
        
//         blockIds.forEach((block) => {
//           const schools = block?.schoolIds || [];
          
//           schools.forEach((school) => {
//             if (school?.schoolId) {
//               schoolIds.push(school.schoolId);
//             }
//           });
//         });
//       });
      
//       // Remove duplicates
//       return [...new Set(schoolIds)];
//     } catch (error) {
//       console.error("Error extracting school IDs:", error);
//       return [];
//     }
//   };

//   // ──────────────────────────────────────────────────────────────
//   // ✅ FUNCTION TO GET DISTRICT_BLOCK_SCHOOL_OBJECT_IDS
//   // ──────────────────────────────────────────────────────────────
//   const getDistrictBlockSchoolObjectIds = (schoolIds) => {
//     const objectIds = [];
    
//     try {
//       // Iterate through Region data to find matching schoolIds
//       Region.forEach((school) => {
//         if (schoolIds.includes(school.schoolId)) {
//           const id = school._id?.$oid || school._id;
//           if (id) {
//             objectIds.push(id);
//           }
//         }
//       });
      
//       return objectIds;
//     } catch (error) {
//       console.error("Error getting district block school object IDs:", error);
//       return [];
//     }
//   };

//   // ──────────────────────────────────────────────────────────────
//   // ✅ ASSIGNING GAMIFICATION FUNCTION
//   // ──────────────────────────────────────────────────────────────
//   const assigningGamification = async () => {
//     try {
//       console.log("🔄 Starting gamification assignment...");
//       console.log("UserData:", userData);

//       // Step 1: Extract school IDs from user's nested structure
//       const schoolIds = extractSchoolIdsFromUserData(userData);
//       console.log("✅ Extracted School IDs:", schoolIds);

//       if (schoolIds.length === 0) {
//         console.log("⚠️ No schools found for this user");
//         return;
//       }

//       // Step 2: Get district_block_schoolsObjectIds from Region data
//       const districtBlockSchoolIds = getDistrictBlockSchoolObjectIds(schoolIds);
//       console.log("✅ District Block School Object IDs:", districtBlockSchoolIds);

//       if (districtBlockSchoolIds.length === 0) {
//         console.log("⚠️ No matching district_block_schoolsObjectId found in Region");
//         return;
//       }

//       // Step 3: Get user's batches from userAccess
//       const userBatches = userData?.userAccess?.batch || [];
//       console.log("✅ User Batches:", userBatches);

//       if (userBatches.length === 0) {
//         console.log("⚠️ No batches found for this user");
//         return;
//       }

//       // Step 4: Prepare and send payload for each batch
//       for (const batch of userBatches) {
//         if (!batch) continue;

//         console.log(`📦 Processing batch: ${batch}`);

//         const payload = {
//           pointType: "disciplinary",
//           date: new Date().toISOString().split("T")[0],
//           batch: batch,
//           schoolId: schoolIds.join(","), // Comma separated string
//           district_block_schoolsObjectId: districtBlockSchoolIds, // Array of object IDs
//           unqObjectId: userData?._id,
//         };

//         console.log(`📤 Sending payload for batch ${batch}:`, payload);

//         try {
//           const response = await ClaimGamificationPoint(payload);
//           console.log(`✅ Success for batch ${batch}:`, response);
//         } catch (error) {
//           console.error(`❌ Error for batch ${batch}:`, error);
//         }
//       }

//       console.log("✅ Gamification assignment completed!");
//     } catch (error) {
//       console.error("❌ Error in assigningGamification:", error);
//     }
//   };

//   // ──────────────────────────────────────────────────────────────
//   // HANDLERS
//   // ──────────────────────────────────────────────────────────────

//   const handleHome = () => {
//     navigate("/user-dashboard");
//   };

//   const handleIndividualConcernClick = () => {
//     navigate("/individual-concerns-form");
//   };

//   const handleAwardPoints = () => {
//     navigate("/claim-gamification-point");
//   };

//   const handleProfileClick = () => {
//     navigate('/user-profile');
//   };

//   // ──────────────────────────────────────────────────────────────
//   // NOTIFICATIONS
//   // ──────────────────────────────────────────────────────────────

//   const fetchNotifications = async () => {
//     const queryParams = {
//       userId: userData?.userId,
//     };

//     try {
//       const response = await getNotificationsByUserId(queryParams);
//       console.log('Notification data:', response.data);
//       setNotificationData(response.data);
//     } catch (error) {
//       console.log("Error fetching notification data", error);
//     }
//   };

//   useEffect(() => {
//     if (userData?.userId) {
//       fetchNotifications();
//     }
//   }, [userData?.userId]);

//   // ──────────────────────────────────────────────────────────────
//   // GAMIFICATION DATA
//   // ──────────────────────────────────────────────────────────────

//   const fetchGamficationData = async () => {
//     const reqBody = { unqUserObjectId: userData?._id };

//     try {
//       const response = await getAllGamificationData(reqBody);
//       const sortedData = response.data.sort(
//         (a, b) => new Date(a.date) - new Date(b.date)
//       );
//       setGamificationData(sortedData);
//       console.log('Gamification data:', response.data);
//     } catch (error) {
//       console.log("Error fetching gamification data:", error);
//     }
//   };

//   useEffect(() => {
//     if (userData?._id) {
//       fetchGamficationData();
//     }
//   }, [userData?._id]);

//   // ──────────────────────────────────────────────────────────────
//   // 🔥 TRIGGER ASSIGNING GAMIFICATION ON COMPONENT MOUNT
//   // ──────────────────────────────────────────────────────────────
//   // useEffect(() => {
//   //   if (userData?._id && userData?.userAccess?.region?.length > 0) {
//   //     console.log("🚀 Triggering assigningGamification on component mount...");
//   //     assigningGamification();
//   //   } else {
//   //     console.log("⏳ Waiting for userData to be ready...");
//   //   }
//   // }, [userData]); // Re-run when userData changes

//   // ──────────────────────────────────────────────────────────────
//   // ROLE HANDLING FOR NOTIFICATIONS
//   // ──────────────────────────────────────────────────────────────


// //////////////////////////////////////////////////////
//   let role;
//   if (userData?.role === "ACI") {
//     role = "CC";
//   } else if (userData?.role === "Community Manager") {
//     role = "ACI";
//   }

//   const handleConcernClick = async (concernType) => {
//     const payload = {
//       concernType: concernType,
//       role: role,
//       userId: userData?.userId
//     };

//     console.log(payload);

//     try {
//       const response = await patchNotificationByConcernTypeAndRole(payload);
//       console.log('Notification updated:', response);
//     } catch (error) {
//       console.log("Error updating notification:", error);
//     }
//   };

//   console.log('UserData:', userData);

//   // ──────────────────────────────────────────────────────────────
//   // RENDER
//   // ──────────────────────────────────────────────────────────────

//   return (
//     <Navbar bg="light" className="shadow-sm">
//       <Container
//         fluid
//         className="d-flex justify-content-between align-items-center"
//       >
//         {/* Left: Home Icon */}
//         <div style={{ cursor: "pointer" }} onClick={handleHome}>
//           <img
//             src="/home-button.png"
//             className="home-button"
//             alt="Home"
//             style={{ height: "30px" }}
//           />
//         </div>

//         <Nav className="me-auto" />

//         {/* Right: Notification & Settings Dropdown */}
//         <Nav>
//           <NavDropdown
//             align="end"
//             title={
//               <div style={{ position: "relative", display: "inline-block" }}>
//                 <img
//                   src="/notification.png"
//                   className="notification"
//                   alt="notification"
//                   style={{ height: "30px", cursor: "pointer" }}
//                 />
//                 {notificationData.length > 0 && (
//                   <span
//                     style={{
//                       position: "absolute",
//                       top: "-5px",
//                       right: "-5px",
//                       background: "red",
//                       color: "white",
//                       borderRadius: "50%",
//                       padding: "2px 6px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       lineHeight: "1",
//                     }}
//                   >
//                     {notificationData.reduce(
//                       (sum, item) => sum + (item.totalCount || 0),
//                       0
//                     )}
//                   </span>
//                 )}
//               </div>
//             }
//             id="notification-dropdown"
//           >
//             {notificationData.length > 0 &&
//               notificationData.map((item, index) => (
//                 <NavDropdown.Item
//                   key={index}
//                   onClick={() => {
//                     handleConcernClick(item.concernType);
//                     if (item.concernType === "Leave") {
//                       navigate("/individual-concerns-resolution");
//                     } else if (item.concernType === "Tech Concern") {
//                       navigate("/tech-concerns-resolution");
//                     } else if (
//                       item.concernType === "School-Individual-Student"
//                     ) {
//                       navigate("/school-concerns-request");
//                     }
//                   }}
//                 >
//                   <span style={{ fontWeight: "500" }}>{item.concernType}</span>
//                   <span style={{ float: "right", color: "gray" }}>
//                     {item.totalCount}
//                   </span>
//                 </NavDropdown.Item>
//               ))}
//           </NavDropdown>

//           <NavDropdown
//             align="end"
//             title={
//               <img
//                 src="/settings.png"
//                 className="logout"
//                 alt="Settings"
//                 style={{ height: "30px", cursor: "pointer" }}
//               />
//             }
//             id="settings-dropdown"
//           >
//             <NavDropdown.Item onClick={handleProfileClick}>
//               Profile
//             </NavDropdown.Item>
//             <NavDropdown.Item onClick={handleIndividualConcernClick}>
//               Individual Concerns
//             </NavDropdown.Item>

//             {userData?.role === "CC" && (
//               <NavDropdown.Item onClick={handleAwardPoints}>
//                 Claim Points
//               </NavDropdown.Item>
//             )}

//             <NavDropdown.Divider />
//             <NavDropdown.Item
//               onClick={() => {
//                 setUserData([]);
//                 navigate("/");
//               }}
//             >
//               Logout
//             </NavDropdown.Item>
//           </NavDropdown>
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };