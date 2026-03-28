// FRONTEND/src/service/CallingServices/StudentRelatedCallings.services.js

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//create calling
export const GetStudentsBySlc = async () =>{

    try {

        const response = await axios.post(`${API_BASE_URL}/api/student-data-for-ame`)
        return response;
    } catch (error) {
        console.log("Error :", error.message)
    }
}

