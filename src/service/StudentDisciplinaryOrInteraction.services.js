// This is StudentDisciplinaryOrInteraction.service.js


import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const createDisciplinaryOrInteraction = async (formData) => {

    const response = await axios.post(`${API_BASE_URL}/api/studentdisciplinaryOrInteraction`, formData)
    return response.data;
}


export const GetStudentCopyCheckingDashboard = async (reqQuery) =>{


     // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(reqQuery).toString();
        // console.log("i am query params")
         console.log(queryString)


    try {
        const response = await axios.get(`${API_BASE_URL}/api/get-copy-checking-dashboard?${queryString}` )

        return response;
    } catch (error) {
        alert('Error occured while fetching disciplinary data.')
    }


}