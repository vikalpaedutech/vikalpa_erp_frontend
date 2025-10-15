//This is ErpTest.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;





export const ChangePassword = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/change-password`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}


export const Disciplinary = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/erp-test-disciplinary`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}





export const CopyCheckingErpTest = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/erp-test-copychecking`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}






export const selfAttendance = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/self-attendance`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}




export const studentAttendance = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/student-attendance-test`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}




export const downloadAttendancePdfFormat = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/download-attendance-pdf-format`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}





export const uploadAttendancePdfFormat = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload-attendance-pdf`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}



export const uploadMarks = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload-marks-test`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}






export const handlingConcern = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/concern-test`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}







export const GetErpTestByUnqUserObjectId = async (reqBody) =>{


    try {
        const response = await axios.post(`${API_BASE_URL}/api/erp-test-data-by-unquserobjectid`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Error::::>", error)
    }

}





//New generic erp test service



/**
 * Generic function to update any ErpTest answer field.
 * @param {string} erpTestId - _id of the ErpTest document
 * @param {string} field - field name to update
 * @param {any} value - value to set
 * @returns {Promise<Object>} - updated ErpTest data
 */
export const updateErpTestAnswerService = async (erpTestId, field, value) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/erpTest/${erpTestId}`,
      { field, value }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating ErpTest answer:', error.response?.data || error.message);
    throw error;
  }
};







// Save absentee calling details for a student
export const saveAbsenteeCallingService = async (payload) => {

  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/erp-test-absenteecalling`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error saving absentee calling:", error.response?.data || error.message);
    throw error;
  }
};








// Save closed concern details
export const saveCloseConcernService = async (payload) => {

    
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/erp-test-closeconcern`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saving close concern:",
      error.response?.data || error.message
    );
    throw error;
  }
};






export const UpdateErpMarksService = async (payload) => {
  // payload: { unqUserObjectId, userId, marks: { q1: 1.5, q2: 0, ... } }
  try {
    const response = await axios.post(`${API_BASE_URL}/api/test-marks`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating ERP marks:", error.response?.data || error.message);
    throw error;
  }
};