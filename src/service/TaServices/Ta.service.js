// taVerficationService.service.js

import axios from "axios";

// Env variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Student Cron Attendance API Call.

export const GetStudentAttendanceDashboard = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-ta-verification-dashboard`, reqBody)
        return response;
    } catch (error) {
        console.log(error)
       
    }

}






export const UpdateAttendanceStatus  = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/update-ta-attendance`, reqBody)
        return response;
        alert(response)
    } catch (error) {
        console.log(error)
       
    }

}




