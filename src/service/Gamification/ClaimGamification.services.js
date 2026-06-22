//This is AttendancePdf.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//POST API.

export const selfAttendancePoint = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/self-attendance-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________


export const studentAttendance = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/student-attendance-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________




    
export const pdfUpload = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/pdf-upload-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________




    
    
export const callingAbsentee = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/calling-absentee-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________






        
export const disciplinary = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/disciplinary-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________






    
        
export const ClaimGamificationPoint = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/claim-gamification-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________



export const fetchUserGamificationPoints = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/fetch-gamification-points`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________








//Dashboard

export const gamificationDashboardV2 = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/gamification-dashboard-v2`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________

