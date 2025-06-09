// This is Concern.services.js


import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const createConcern = async (formData) => {
  
 try {

        const response = await axios.post(`${API_BASE_URL}/api/create-concern`, formData)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}
