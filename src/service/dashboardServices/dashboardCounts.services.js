// /FRONTEND/src/service/dashboardServices/dashboardCount.services.js

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const studentAndAttendanceAndAbsenteeCallingCount= async (payload) => {

    console.log(payload)

    try {
        
        const response = await axios.post(`${API_BASE_URL}/api/attendance-count`, payload);
       
        console.log(response.status)
        return response.data
    } catch (error) {
        
        console.log('error occured while fetching studentAndAttendanceAndAbsenteeCallingCount')
        console.log(error)
    }

}