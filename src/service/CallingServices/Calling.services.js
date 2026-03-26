// FRONTEND/src/service/CallingServices/StudentRelatedCallings.services.js

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//create calling
export const createCallings = async (reqBody) =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/create-calling`, reqBody)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------

//crete objective of calling
export const createObjectiveOfCalling = async (reqBody) =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/create-objective-of-calling`, reqBody)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------






//crete objective of calling
export const getCallingsByAssignedTo = async (reqBody) =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/get-calling`, reqBody)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------




//get objective of calling
export const getObjectiveOfCall = async (reqBody) =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/get-objective-of-calls`, reqBody)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------


//crete objective of calling
export const updateCalling = async (reqBody) =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/update-calling`, reqBody)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------




//calling dashboard by user id
export const callingDashboardByUserId = async (reqBody) =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/dashboard-objective-of-callings`, reqBody)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------