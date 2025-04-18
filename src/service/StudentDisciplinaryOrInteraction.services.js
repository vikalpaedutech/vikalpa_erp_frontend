// This is StudentDisciplinaryOrInteraction.service.js


import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const createDisciplinaryOrInteraction = async (formData) => {

    const response = await axios.post(`${API_BASE_URL}/api/studentdisciplinaryOrInteraction`, formData)
    return response.data;
}