//This is AttendancePdf.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



export const selfAttendancePoint = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/self-attendance-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________



//student attendance
export const studentAttendance = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/student-attendance-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________





    //pdf upload

    export const pdfUpload = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/pdf-upload-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________



    

    //calling absentee


    export const callingAbsentee = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/calling-absentee-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________



    
    //marks

    export const marks = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/marks-point`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
    //_____________________________________________________________________________
