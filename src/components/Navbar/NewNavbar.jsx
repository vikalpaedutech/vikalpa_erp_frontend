// import React, { useContext, useEffect, useState } from "react";
// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";

// import { GetNotificationByUserIdOnQueryParams } from "../../service/ConcernsServices/Concern.services";
// import { getNotificationsByUserId } from "../../service/notifications/notifications.service";

// export const NewNavbar = () => {
//   const { userData, setUserData } = useContext(UserContext);

//   const [notificationData, setNotificationData] = useState([]); // ✅ initialized as array

//   // const fetchNotification = async () => {
//   //   const queryParams = {
//   //     userId: userData?.[0]?.userId,
//   //   };

//   //   try {
//   //     const response = await GetNotificationByUserIdOnQueryParams(queryParams);

//   //     // console.log(response.data.data);
//   //     setNotificationData(response.data.data);
//   //   } catch (error) {
//   //     console.log("Error fetching notification data", error);
//   //   }
//   // };

//   // useEffect(() => {
    
//   //   fetchNotification();
//   // }, []);

//   const navigate = useNavigate();

//   const handleHome = () => {
//     if (userData?.[0]?.role === "CC") {
//       navigate("/user-dash");
//     } else if (userData?.[0]?.role === "ACI") {
//       navigate("/l2-user-dash");
//     }
//   };

//   const handleIndividualConcernClick = () => {
//     navigate("/individual-concerns-form");
//   };

//   const handleProfileClick = () => {
//     alert("Coming soon!");
//   };



// //Get notification api.

//  const fetchNotifications = async () => {
//     const queryParams = {
//       userId: userData?.[0]?.userId,
//     };

//     try {
//       const response = await getNotificationsByUserId(queryParams);

//       console.log('I am above data')
//       console.log(response.data);
//       setNotificationData(response.data);
//     } catch (error) {
//       console.log("Error fetching notification data", error);
//     }
//   };

//   useEffect(() => {
    
//     fetchNotifications();
//   }, []);


// //-------------------------



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
//         {/* <p>{userData[0].role}</p> */}
//         {/* Center: Empty (optional - or could place logo) */}
//         <Nav className="me-auto" />

//         {/* Right: Gear Dropdown */}

        


//         <Nav>
//           <NavDropdown
//             align="end"
//             title={
//               <img
//                 src="/notification.png"
//                 className="notification"
//                 alt="notification"
//                 style={{ height: "30px", cursor: "pointer" }}
//               />
//             }
//             id="settings-dropdown"
//           >
//             {/* ✅ Notification items when isSomeoneReverted is true */}
//             {notificationData.length > 0 &&
//               notificationData
//                 .filter((item) => item.isSomeoneReverted)
//                 .map((item) => (
//                   <NavDropdown.Item key={item._id}>
//                     {item.concernId} - {item.concernType}
//                   </NavDropdown.Item>
//                 ))}

            
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
//             {/* <NavDropdown.Item>Other</NavDropdown.Item> */}
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






















import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";

import { GetNotificationByUserIdOnQueryParams } from "../../service/ConcernsServices/Concern.services";
import { getNotificationsByUserId, patchNotificationByConcernTypeAndRole } from "../../service/notifications/notifications.service";

export const NewNavbar = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [notificationData, setNotificationData] = useState([]); // ✅ initialized as array

  // const fetchNotification = async () => {
  //   const queryParams = {
  //     userId: userData?.[0]?.userId,
  //   };

  //   try {
  //     const response = await GetNotificationByUserIdOnQueryParams(queryParams);

  //     // console.log(response.data.data);
  //     setNotificationData(response.data.data);
  //   } catch (error) {
  //     console.log("Error fetching notification data", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchNotification();
  // }, []);

  const navigate = useNavigate();

  const handleHome = () => {
    if (userData?.[0]?.role === "CC") {
      navigate("/user-dash");
    } else if (userData?.[0]?.role === "ACI" || userData?.[0]?.role === "Community Incharge" || userData?.[0]?.role === "Project Coordinator") {
      navigate("/l2-user-dash");
    } else if (userData?.[0]?.role === "Community Manager"){
      navigate("/l3-user-dash");
    }
  };

  const handleIndividualConcernClick = () => {
    navigate("/individual-concerns-form");
  };

  const handleProfileClick = () => {
    alert("Coming soon!");
  };

  // Get notification api.
  const fetchNotifications = async () => {
    const queryParams = {
      userId: userData?.[0]?.userId,
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
if (userData?.[0]?.role === "ACI"){
  role = "CC"
} else if (userData?.[0]?.role === "Community Manager"){
  role = "ACI"
}



//----------------------------------------------

//Handle ConcernClick
  const handleConcernClick = async (concernType) => {


  const payload = {
    concernType: concernType,
    role: role,
    userId: userData?.[0]?.userId
  }

    console.log(payload);

  try {
    
    const response = await patchNotificationByConcernTypeAndRole(payload) 

    

  } catch (error) {

    console.log("Error:", error)
    
  }
};

//--------------------------------------

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

        {/* <p>{userData[0].role}</p> */}
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

