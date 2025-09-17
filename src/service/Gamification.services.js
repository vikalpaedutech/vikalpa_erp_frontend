//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
export const selfAttendanceGamification = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/self-attendance-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}






export const studentAttendanceGamification = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/student-attendance-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}






export const attendancePdfGamification = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/attendance-pdf-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}









export const studentAbsenteeCallingGamification = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/student-absentee-calling-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}











export const studentMarksGamification = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/student-marks-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}










export const disciplinaryGamification = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/center-disciplinary-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}



//Get disciplinaryGamification data


export const getDisciplinaryGamificationData = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.get (`${API_BASE_URL}/api/get-disciplinary-gamification`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}





export const getAllGamificationData = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/get-all-gamification-data-by-unqUserObjectId`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}



export const pointClaimedUpdation = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/update-gamification-data`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}



export const getUserMarkedGamificationData = async (reqBody) => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.post (`${API_BASE_URL}/api/get-user-marked-gamification-data`, reqBody)
        
        return response.data;


    } catch (error) {
        console.error("Error updating gamification point", error.message);
        throw error;
    }
}
