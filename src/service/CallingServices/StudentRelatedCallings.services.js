// FRONTEND/src/service/CallingServices/StudentRelatedCallings.services.js

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//API TO CREATE CALLINGS.

export const CreateCalling = async () => {

    try {
        
    } catch (error) {
        
    }
}

//----------------------------------------------------------


//GET API
export const GetStudentRelatedCallingData = async (queryParams) =>{

    try {

        const response = await axios.get(`${API_BASE_URL}/api/get-students-related-calling?${queryParams}`)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-----------------------------------------------

//PATCH API
export const PatchStudentRelatedCallings = async (queryParams, formData) =>{

    try {

        const response = await axios.get(`${API_BASE_URL}/api/patch-student-related-calling?${queryParams}`, formData)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

//-------------------------------------------------