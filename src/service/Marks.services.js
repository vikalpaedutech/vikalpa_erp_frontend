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



// //Put service to update the marks status. Calls to marks.controller.js
// export const updateMarksBySrnAndExamId = async (queryParams, marksObtained, recordedBy, marksUpdatedOn) => {


//     try {
        
//      // Prepare query parameters to send in the URL
//      const queryString = new URLSearchParams(queryParams).toString();

//      const response = await axios.put (`${API_BASE_URL}/api/marks?${queryString}`, marksObtained, recordedBy, marksUpdatedOn)
//         console.log(marksObtained, recordedBy, marksUpdatedOn)
//      return response.data; 

//     } catch (error) {
//         console.error("Error updating marks data", error.message);
//         throw error; // Rethrow the error to be handled by the caller
    
//     }

// }

// //__________________________________________________________________________________________



// Put service to update the marks status
export const updateMarksBySrnAndExamId = async (queryParams, payload) => {
    try {
        const requestBody = {
            ...queryParams,
            ...payload
        };
        
        console.log("Request body for marks update:", requestBody);
        
        const response = await axios.put(`${API_BASE_URL}/api/marks`, requestBody);
        return response.data; 
    } catch (error) {
        console.error("Error updating marks data", error.message);
        throw error;
    }
}

// New service for uploading test files
export const uploadTestFileService = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload-test-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading test file", error.message);
        throw error;
    }
}