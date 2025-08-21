//This is GamificationDisciplinary.services.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//Below api get s100attendances data.

export const getS100Attendances = async (queryParams, formData) => {


    // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();

        console.log("i am from service", queryString)
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/gets100-attendances?${queryString}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error getting data", error.message);
    throw error;
  }
};

//__________________________________________________________________________________________



//patches s100studentattendancs.


  export const updateAttendanceStatus = (queryParams, formData) =>{

    // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();

        console.log("i am from service", queryString)

    try {

        const response = axios.patch(`${API_BASE_URL}/api/patchs100-attendances?${queryString}`, formData)
        return response.data;
    } catch (error) {
        console.log("Error patchind data", error.message)
    }
}




//------------------------------------





//Below api get s100attendances data.

export const getAttendanceSummaryByClass = async (queryParams, formData) => {


    // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();

        console.log("i am from service", queryString)
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/s100-attendance-summary?${queryString}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error getting data", error.message);
    throw error;
  }
};

//__________________________________________________________________________________________
