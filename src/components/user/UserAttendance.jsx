//FRONTEND/src/components/user/UserAttendance.jsx


//This component is for user attendances.

import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../contextAPIs/User.context";
import { GetAttendanceByUserId, PatchUserAttendanceByUserId } from "../../service/userAttendance.services";


export const UserAttendance = () => {

  
const [currentLat, setCurrentLat] = useState("");
const [currentLng, setCurrentLng] = useState("");

  //It gets the current coordinates of the user at the tiime of signup for attendance purpose
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);
  //____________________________________________________________________


    //Using context api
    const {userData, setUserData} = useContext(UserContext)

    //__________________________________

    //All Hooks
      const [userAttendanceData, setUserAttendanceData] = useState([])
      const [toggleSwitchAttendance, setToggleSwitchAttendance] = useState(false)
      const [userLatitude, setUserLatitude] = useState("")
      const [userLongitude, setUserLongitude] = useState("")
      const [coordinateDifference, setCoordinateDifference] = useState(null)
      const [showAttendanceButton, setShowAttendanceButton] = useState(true);
    //_______________________

    //Fetching user data by user id
    const fetchUserAttendanceData = async () => {

      const queryParams = {
        userId: userData?.[0]?.userId,
        date: new Date().toISOString().split("T")[0]
      }

      try {
        const response = await GetAttendanceByUserId(queryParams)
          setUserAttendanceData(response.data.data)
          setUserLatitude(response.data.data?.[0]?.latitude)
          setUserLongitude(response.data.data?.[0]?.longitude)
          


        
          //Checking if the user is marked Present or Absent. If present then toggle button remains on.
           if (response.data.data?.[0]?.attendances.attendance === "Present"){
            setToggleSwitchAttendance(true)

           } 


      } catch (error) {
            console.log("Error fetching attendance data", error.message)
      }

    }

    useEffect(()=>{
      fetchUserAttendanceData();
      
    },[])

    useEffect(()=>{
  
      console.log("i am userAttendance data", userAttendanceData)
      console.log(userLatitude)
      console.log(userLongitude)



      getDistanceInMeters();
    },[fetchUserAttendanceData])
  
   


  //Calculating distance between user coordinates and current coordinates:
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
    const distance = R * c;
    // setCoordinateDifference(distance);
    return distance;
  }
  
//__________________________________________
      
useEffect(() => {
  if (userLatitude && userLongitude && currentLat && currentLng) {
    const distance = getDistanceInMeters(
      parseFloat(userLatitude),
      parseFloat(userLongitude),
      currentLat,
      currentLng
    );
    console.log("Distance in meters:", distance.toFixed(2));
    setCoordinateDifference(distance.toFixed(2))
  }
}, [userLatitude, userLongitude, currentLat, currentLng]);

//-----------------------------------------------------------

//Below logic will check if users in 100 mt radius, if yes then only present button will be 
//... allowed to mark attendance.
useEffect(()=>{
if(coordinateDifference > 100){
  setShowAttendanceButton(false)
}
}, []);


const showCoordinateAlert =()=>{
  alert("Attendance will only be allowed to mark when you are in your center")
}

//__________________________________________


//Below api updates the user attendance by user id and date.

const updateUserAttendance = async () =>{

// alert(userAttendanceData?.[0]?.attendances?.attendance)

  let attendanceStatus;
  if (toggleSwitchAttendance === true){
    attendanceStatus = "Present"
  } else {attendanceStatus = "Absent"}


  const queryParams = {

    userId: userData?.[0]?.userId,
    date: new Date().toISOString().split("T")[0],

  }



let formData;



//LOGIN AND LOGOUT TIME
let loginTime = Date.now();

let logoutTime = Date.now();

if (userAttendanceData?.[0]?.attendances?.attendance === "Present"){

 formData = {
    attendance: attendanceStatus,
    // longitude: currentLng,
    // latitude: currentLat,
    // coordinateDifference:coordinateDifference
  }

} else if (userAttendanceData?.[0]?.attendances?.attendance === "Absent"){

  formData = {
    attendance: attendanceStatus,
    longitude: currentLng,
    latitude: currentLat,
    coordinateDifference:coordinateDifference,
     loginTime: loginTime,
    // logoutTime: logoutTime,
  }
}



  try {

    const response = await PatchUserAttendanceByUserId(queryParams, formData)
    
    // alert('attendance updated')
  } catch (error) {
    console.log("Error occured while updating data", error.message)
  }

}

useEffect(()=>{
  console.log(toggleSwitchAttendance)
  console.log("i am userAttendance data", userAttendanceData)
  console.log(userLatitude)
  console.log(userLongitude)

 updateUserAttendance();


},[toggleSwitchAttendance])





    return (
<>
      {showAttendanceButton === true ? (
        <div className={`User-attendance-main ${toggleSwitchAttendance ? "green" : "red"}`} 
      >
        <div
          className={`user-attendance-circle ${
            toggleSwitchAttendance ? "active" : "inactive"
          }`}
          onClick={() => setToggleSwitchAttendance(!toggleSwitchAttendance)}
        ></div>
      {toggleSwitchAttendance ? (<p style={{marginTop:'15%', marginRight:'10%', fontWeight:'bold'}}>Present</p>):(
        <p style={{marginTop:'15%', marginRight:'10%', fontWeight:'bold'}}>Absent</p>)}</div>
      
      
      ):(

<div style={{backgroundColor:"green"}} className={`User-attendance-main ${toggleSwitchAttendance ? "green" : "red"}`} 
      >
        <div
          className={`user-attendance-circle ${
            toggleSwitchAttendance ? "active" : "inactive"
          }`}
          onClick={showCoordinateAlert}
        ></div>
      {toggleSwitchAttendance ? (<p style={{marginTop:'15%', marginRight:'10%', fontWeight:'bold'}}>⛈️</p>):(
        <p style={{marginTop:'15%', marginRight:'10%', fontWeight:'bold', }}>⛈️</p>)}</div>
      

      )}

      </>
    );
}