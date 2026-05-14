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




export const PatchUserAttendanceByUserId = async (queryParams, formData, onProgress) => {
  const queryString = new URLSearchParams(queryParams).toString();

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/updatedattendanceby-userid?${queryString}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
        timeout: 60000, // 60 second timeout
      }
    );
    
    return response;
  } catch (error) {
    console.error("❌ Error occurred while patching attendance:", error);
    
    if (error.code === 'ECONNABORTED') {
      alert('❌ Upload timeout! Please check your internet connection and try again.');
    } else if (error.response) {
      alert(`❌ Server error: ${error.response.data?.message || "Please try again"}`);
    } else if (error.request) {
      alert('❌ Network error! Please check your internet connection.');
    } else {
      alert('❌ Error! Attendance Not Updated. Please Retry!');
    }
    
    throw error;
  }
};


//________________________________________

//Post cron attendance

export const cronJobUserAttendance = async (reqBody) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/initiate-user-attendance`, reqBody);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}

//-----------------------------------------------



//Get Attendance Data by SchoolIds, Roles, and Districts.


export const getFilteredUserAttendanceSummary = async (payLoad) => {

  

    try {
        const response = await axios.post(`${API_BASE_URL}/api/user-attendance-summary`, payLoad);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}


//Patch attendance status in db. without image.

export const patchUserAttendanceWithoutImage = async (queyrParams, payLoad) => {


      // Prepare query parameters to send in the URL
          const queryString = new URLSearchParams(queyrParams).toString();
          console.log(queyrParams)

    try {
        const response = await axios.patch(`${API_BASE_URL}/api/patch-user-attendance-without-image?${queryString}`, payLoad);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}




//Get user attendance data of a single month. And user can filter out a data...
//...of any month within a year.

export const GetAttendanceDataOfUsersByMonthAndYear = async (queyrParams, payLoad) => {


      // Prepare query parameters to send in the URL
          const queryString = new URLSearchParams(queyrParams).toString();
          console.log(queyrParams)

          console.log(payLoad)

    try {
        const response = await axios.post(`${API_BASE_URL}/api/individual-user-attendance-dash?${queryString}`, payLoad);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}




// V2 API....

export const getUserAttendanceSummaryData = async (payLoad) => {

  

    try {
        const response = await axios.post(`${API_BASE_URL}/api/user-attendance-summary-data`, payLoad);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}



//New Api 07-05-2026

export const markUserAttendance = async (formData) => {


    try {
        const response = await axios.post(`${API_BASE_URL}/api/mark-user-attendance`, formData);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}





export const getUserAttendanceData = async (reqBody) => {


    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-user-attendance`, reqBody);
        return response
    } catch (error) {
        console.log(error.status)
      
        console.log(error.message)
    }
}

