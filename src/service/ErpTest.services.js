//This is ErpTest.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;





export const ChangePassword = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/change-password`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}


export const Disciplinary = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/erp-test-disciplinary`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}





export const CopyCheckingErpTest = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/erp-test-copychecking`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}






export const selfAttendance = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/self-attendance`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}




export const studentAttendance = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/student-attendance-test`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}




export const downloadAttendancePdfFormat = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/download-attendance-pdf-format`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}





export const uploadAttendancePdfFormat = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload-attendance-pdf`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}



export const uploadMarks = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload-marks-test`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}






export const handlingConcern = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/concern-test`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}







export const GetErpTestByUnqUserObjectId = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/erp-test-data-by-unquserobjectid`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}

