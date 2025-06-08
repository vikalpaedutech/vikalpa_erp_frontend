// Attendance.service.js

import axios from "axios";

// Env variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Student Cron Attendance API Call.

export const createAttendanceRecords = async ()=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/initiate-student-attendance`)

        if(response.status === 200){
            alert('Attendance instance created successfully!')
        } 
        return response;
    } catch (error) {
        console.log(error)
        if (error.status === 400){
            alert('Attendance instance was already created!')
        }
    }

}



// Function to get all attendance data with optional query parameters
export const getAllAttendance = async (queryParams) => {
    try {
        // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();
        // console.log("i am query params")
         console.log(queryString)
        
        // Call the API endpoint with query parameters
        const response = await axios.get(`${API_BASE_URL}/api/student-attendance?${queryString}`);
       console.log(response)
        
        return response.data; // Return the attendance data from the API

    } catch (error) {
        console.error("Error getting attendance data", error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
};


//______________________________________________________________________________________

//Put service to update the attendance status. Calls to studentAttendance.controller.js
export const updateAttendanceBySrnAndDate = async (queryParams, isAttendanceMarked) => {


    try {
        
     // Prepare query parameters to send in the URL
     const queryString = new URLSearchParams(queryParams).toString();

     const response = await axios.put (`${API_BASE_URL}/api/student-attendance?${queryString}`, isAttendanceMarked)
        console.log(isAttendanceMarked)
     return response.data; 

    } catch (error) {
        console.error("Error getting attendance data", error.message);
        throw error; // Rethrow the error to be handled by the caller
    
    }

}

//__________________________________________________________________________________________