// Frontend/service/MbCentersDisciplinary.services.js

import axios from "axios";

//ENV Variables

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//api to post data
export const createCenterOrSchoolDisciplinary = async (formData) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/centerOrSchoolDisciplinary`, formData)
        return response.data
    } catch (error) {
        console.log("Error from service. Error posting data", error.message)
    }
};
//-----------------------------------------------------------------


//api to get data by userId
export const getCenterOrSchoolDisciplinaryDataByUserId = async (formData) => {
console.log(formData, "from service")

    try {
        const response = await axios.get(`${API_BASE_URL}/api/centerOrSchoolDisciplinary-by-userId/${formData}` )
        return response.data
    } catch (error) {
        console.log("Error from service. Error posting data", error.message)
    }
};
//-----------------------------------------------------------------