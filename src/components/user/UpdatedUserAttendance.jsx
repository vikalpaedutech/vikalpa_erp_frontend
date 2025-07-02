//src/compoents/user/UpdatedUserAttendance.jsx

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import {
  GetAttendanceByUserId,
  PatchUserAttendanceByUserId,
} from "../../service/userAttendance.services";
import { patchUserById } from "../../service/User.service";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export const UserAttendanceUpdated = () => {

  //routing
  const navigate = useNavigate();





  //Context API
  const {userData} = useContext(UserContext);

  //----------------------------------------------




  
  
  //All hooks

  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [show, setShow] = useState(false)
  const [showWithoutGeolocationModal, setShowWithoutGeoLocationModal] = useState(false)

  const [userAttendanceData, setUserAttendanceData] = useState([]);

  const [showAttendanceButton, setShowAttendanceButton] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Spinner state

    const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

  //--------------------------------------------------






  //Fetching User Attendance To Check If Attendance is marked or not.

   const fetchUserAttendanceData = async () => {

    const userId = userData?.[0]?.userId

    const queryParams = {
      userId,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await GetAttendanceByUserId(queryParams);
      
      const attendance = response.data.data?.[0]?.attendances;
      
      const userEntry = response.data.data?.[0];

      
      console.log(attendance)

      setUserAttendanceData(attendance);
      
     


      if (attendance?.attendance === "Present") {
        
        setIsAttendanceMarked(true);
        
        setShowAttendanceButton(false);
      } else {

        setIsAttendanceMarked(false);
        
        setShowAttendanceButton(true);

      }
      console.log("📥 Attendance data fetched:", response.data.data);
    } catch (error) {
      console.log("❌ Error fetching attendance", error.message);
    }
  };

  useEffect(() => {
    fetchUserAttendanceData();
  }, []);


  
  //----------------------------------------------
















  //Accessing current latitude and longitude using browser geolocationApi.

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







  //Checking if the user has latitude and longitude stored in db, if not, then updating it in db first.
  //...and if db is already ther then ignoring this block
  const checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist = ()=>{

    if(userData[0].longitude === null && userData[0].latitude === null){
    
      // alert('Coordinates are missing')


      setShow(true)

      



    
      } else {

        alert('Coordinates found')

        setShowWithoutGeoLocationModal(true)

      }

     

  }

  useEffect(()=>{
    checkinIfUserHaveCoordinatesStoredInDbAndIfNotThenUpdatingItFrist()
  },[])






  //Funtion to get Coordinate difference.

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




  


  //This function updates geolocation in db if not updated.

  const handleGeolocationUpdate = async () =>{


    const formData = { longitude: currentLng, latitude: currentLat };



    try {

      const response = await patchUserById(userData?.[0]?.userId, formData)

      
      console.log("Updated user Coordinates in db", response.message)
       
       
       
       if (response.message === undefined){




        // alert('well attendance not updated')


        
        //className="MarkAttendanceModal"
        setShowWithoutGeoLocationModal(true);
        



        //Ye Ye geoloaction (className= GeolocationModal) update karane wale modal ko close krta hai
        setShow(false)




       } 
       
       console.log(response)
      
    } catch (error) {
      



      //className="WithoutGeoLocationModal"
        setShowWithoutGeoLocationModal(true);
        



        //Ye Ye geoloaction (className= GeolocationModal) update karane wale modal ko close krta hai
        setShow(false)


      // alert ('Some error occured in updating coordinates! Please try again.')


      

    }



    

  }








// Modal Handle Close

const handleClose = () => {


   setShow(false);


    if (userData?.[0]?.role === "CC") {
      navigate("/user-dash");
    } else if (userData?.[0]?.role === "ACI" || userData?.[0]?.role==="Community Incharge" || userData?.[0]?.role==="Project Coordinator" || userData?.[0]?.role === "Academic-Coordinator" ) {
      navigate("/l2-user-dash");
    } else if (userData?.[0]?.role === "Community Manager") {
      navigate("/l3-user-dash");
    } 
    // else if (userData?.[0]?.role === "Academic-Coordinator" ) {
    //   navigate("/l0-user-dash");
     
    // }



}






//Updates User Attendance When coordinates are not there.

const updateUserAttendance = async () => {

const userId = userData?.[0]?.userId

    setIsSubmitting(true); // ✅ Start spinner

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
      formData.append("logoutLongitude", currentLng || 0);
      formData.append("logoutLatitude", currentLat || 0);
      formData.append("logoutCoordinateDifference", 0);
      console.log("🔴 Logging logout attendance");
    }

    formData.append("longitude", currentLng || 0);
    formData.append("latitude", currentLat || 0);
    formData.append("coordinateDifference", 0);

    console.log("📤 Payload Coordinates:");
    console.log("   ➤ Longitude:", currentLng || 0);
    console.log("   ➤ Latitude:", currentLat || 0);
    console.log("   ➤ Coordinate Difference:", 0);

    try {



        try {
  const image = await openCameraAndCaptureImage();
  formData.append("file", image);
  console.log("📎 Attached Image:", image?.name);
} catch (error) {
  alert("❌ Attendance image capture cancelled.");
  setIsSubmitting(false);
  return;
}



      // const image = await openCameraAndCaptureImage();
      // formData.append("file", image);

      
      const response = await PatchUserAttendanceByUserId(queryParams, formData); // ✅ MODIFIED

      

      if (response.status === 200) {
      
        
        
        // alert(response?.status === 200)



        alert("✅ Attendance marked successfully.");
      
        setShowAttendanceButton(false);
        await fetchUserAttendanceData(); // ✅ Refresh data after success
      } else {
        throw new Error("Attendance not saved");
      }
    } catch (err) {
      console.log("❌ Error marking attendance:", err.message);
      alert("❌ इंटरनेट की समस्या है, कृपया पुनः प्रयास करें या अपने वरिष्ठ से संपर्क करें।\n\n⚠️ Your internet is slow, try again or contact your senior.");
    } finally {
      setIsSubmitting(false); // ✅ Stop spinner
    }
  };











  //Opens Camera

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
  








return(

  <div>


  <div className="GeolocationModal">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Geolocation Required!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your geolocation is not updated!
          Click on below button to update your center geo-location.(अपने केंद्र का भौगोलिक स्थान अपडेट करने के लिए नीचे दिए गए बटन पर क्लिक करें।)
        </Modal.Body>
        <Modal.Footer>

        
          <Button variant="primary" onClick={handleGeolocationUpdate}>
            Click to update!
          </Button>
          
        </Modal.Footer>
        </Modal>

    </div>





    <div className="MarkAttendanceModal">


       <Modal show={showWithoutGeolocationModal} onHide={handleClose}>
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
               <Button
                 variant="success"
                 onClick={updateUserAttendance}
                 disabled={isSubmitting}
               >
                 {isSubmitting ? (
                   <>
                     <Spinner
                       animation="border"
                       size="sm"
                       role="status"
                       className="me-2"
                     />
                     Marking Attendance...
                   </>
                 ) : (
                   "📸 Mark Your Attendance"
                 )}
               </Button>
             ) : (
               null
             )}
           </Card>

{/* 
<p style={{ color: "red", fontWeight: "bold" }}>
                 You are not within 100 meters of your center.
               </p> */}




        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="primary" onClick={handleClose}>
           Go To Home
          </Button>
        </Modal.Footer>
      </Modal>



    </div>


  </div>

)




}