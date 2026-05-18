//This is Bills.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Create Copy checking

export const CreateStudentCopyChecking = async (reqBody) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/create-student-copy-checking`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Some error occured", error.message)
    }
}
//_____________________________________________________________________________



//delete Copy checking

export const DeleteStudentCopyChecking = async (reqBody) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/delete-student-copy-checking`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Some error occured", error.message)
    }
}
//_____________________________________________________________________________


//dashboard Copy checking

export const StudentCopyCheckinDashboard = async (reqBody) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/dashboard-student-copy-checking`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Some error occured", error.message)
    }
}
//_____________________________________________________________________________


//get Copy checking

export const GetCopyCheckingData = async (reqBody) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-student-copy-checking`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Some error occured", error.message)
    }
}
//_____________________________________________________________________________
