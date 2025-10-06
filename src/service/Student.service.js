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





//patch all students All students on queryParmas
//Below calls the api from backend.
export const patchStudentBySrn = async (studentSrn, reqBody) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/student/${studentSrn}`,
      reqBody
    );

    return response.data;
  } catch (error) {
    console.error("Error patching student data", error.message);
    throw error;
  }
};



// NEW: upload dress size confirmation PDF
export const uploadDressSizeForm = async (studentSrn, file) => {
  try {
    const formData = new FormData();
    formData.append("dressSizeConfirmationForm", file); // must match multer field name

    const response = await axios.patch(
      `${API_BASE_URL}/api/students/${studentSrn}/dress-size-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // backend returns { status:"Success", message: "...", data: student }
    return response.data;
  } catch (error) {
    console.error("Error uploading dress size form", error.message || error);
    throw error;
  }
};
