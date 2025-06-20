//FRONTEND/src/service/userAttendance.services.js

import axios from "axios";

// Env variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Get User attendance by user id

export const GetAttendanceByUserId = (queryParams) => {

    console.log("Querying id for user attendance: ", queryParams)

      // Prepare query parameters to send in the URL
      const queryString = new URLSearchParams(queryParams).toString();
    
       console.log("I am queryParams for user attendance", queryString)
    try {
        
        const response = axios.get(`${API_BASE_URL}/api/attendanceby-userid?${queryString}`)
        
        return response;

    } catch (error) {
        console.log("Error occured while fetching user attendance data", error)
    };
}



//________________________________________________

// export const PatchUserAttendanceByUserId = (queryParams, formData) => {
    
//      // Prepare query parameters to send in the URL
//      const queryString = new URLSearchParams(queryParams).toString();
    


//     try {
//         const response = axios.patch(`${API_BASE_URL}/api/updatedattendanceby-userid?${queryString}`, formData)
//         return response;

//     } catch (error) {
//         console.log("Error occured while fetching user attendance data", error)
//     };


// }




export const PatchUserAttendanceByUserId = async (queryParams, formData) => {
  const queryString = new URLSearchParams(queryParams).toString();

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/updatedattendanceby-userid?${queryString}`,
      formData,
 
    );
    return response;
  } catch (error) {
    console.error("❌ Error occurred while patching attendance:", error);
    throw error; // Optional: rethrow for caller to handle
  }
};


//________________________________________

//Post cron attendance

export const cronJobUserAttendance = async () => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/initiate-user-attendance`);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}

//-----------------------------------------------