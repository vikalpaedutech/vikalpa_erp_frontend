//This is AttendancePdf.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



    
    //getAttachementById

          export const getAttachementById = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/get-attachement-by-id`, 
                reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error", error.message)
        }
    }
