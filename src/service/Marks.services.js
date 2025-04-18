//Marks.services.js

// Attendance.service.js

import axios from "axios";

// Env variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;





// Function to get all attendance data with optional query parameters.

export const getAllMarksUsinQueryParams = async (queryParams) => {
    try {
        // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();
        // console.log("i am query params")
         console.log(queryString)
        
        // Call the API endpoint with query parameters
        const response = await axios.get(`${API_BASE_URL}/api/marks?${queryString}`);
       console.log(response)
        
        return response.data; // Return the attendance data from the API

    } catch (error) {
        console.error("Error getting attendance data", error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
};


//______________________________________________________________________________________



//Put service to update the marks status. Calls to marks.controller.js
export const updateMarksBySrnAndExamId = async (queryParams, marksObtained, recordedBy, marksUpdatedOn) => {


    try {
        
     // Prepare query parameters to send in the URL
     const queryString = new URLSearchParams(queryParams).toString();

     const response = await axios.put (`${API_BASE_URL}/api/marks?${queryString}`, marksObtained, recordedBy, marksUpdatedOn)
        console.log(marksObtained, recordedBy, marksUpdatedOn)
     return response.data; 

    } catch (error) {
        console.error("Error updating marks data", error.message);
        throw error; // Rethrow the error to be handled by the caller
    
    }

}

//__________________________________________________________________________________________