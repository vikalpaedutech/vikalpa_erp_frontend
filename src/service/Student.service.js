//This is Student.service.js.

//This contains all the service apis to call for backends'  student.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
export const getStudentIfisSlcTakenIsFalse = async () => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.get (`${API_BASE_URL}/api/student`)
        
        return response.data;


    } catch (error) {
        console.error("Error getting students data", error.message);
        throw error;
    }
}

//Get All students on queryParmas
//Below calls the api from backend.
export const getStudentsByQueryParams = async (queryParams) => {
    try {
     
// Prepare query parameters to send in the URL
const queryString = new URLSearchParams(queryParams).toString();

        const response = await axios.get (`${API_BASE_URL}/api/student-queryparams?${queryString}`)
        
        return response.data;


    } catch (error) {
        console.error("Error getting students data", error.message);
        throw error;
    }
}




