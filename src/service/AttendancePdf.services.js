//This is AttendancePdf.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//POST API. Initiating attendance pdf by admin in db

export const createAttendancePdfCronJob = async (reqBody) => {
    console.log("I am inside Attendance pdf cron job")
    console.log("i am file")
        try {

       
          


            const response = await axios.post(`${API_BASE_URL}/api/initiate-attendance-pdf`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error occured while uploading attendance pdf into spaces", error.message)
        }
    }
    //_____________________________________________________________________________





//Get API by schoolId

// export const GetDataBySchoolId = async (schoolId, selectedDate) => {
// console.log("I am inside Attendance pdf service and school id is", schoolId, selectedDate)
//     try {
//         const response = await axios.get(`${API_BASE_URL}/api/attendancepdf/${schoolId}/${selectedDate}`)
//         return response.data;
//     } catch (error) {
//         console.log("Some error occured while getting attendance pdf data", error.message)
//     }
// }


export const GetDataBySchoolId = async (reqBody) => {
console.log("I am inside Attendance pdf service and school id is", reqBody)

    try {
        const response = await axios.post(`${API_BASE_URL}/api/attendancepdf`, reqBody)
        return response.data;
    } catch (error) {
        console.log("Some error occured while getting attendance pdf data", error.message)
    }

}
//____________________________________________sss_________________________________


//PATCH API. Uploading attendance pdf

export const PatchAttendancePdf = async (queyrParams, file) => {
    console.log("I am inside Attendance pdf service and query parameters are", queyrParams)
    console.log("i am file")
        try {

          // Prepare query parameters to send in the URL
          const queryString = new URLSearchParams(queyrParams).toString();
          // console.log("i am query params")
        //   console.log(queryString)
          


            const response = await axios.patch(`${API_BASE_URL}/api/attendancepdf-upload?${queryString}`, file)

            console.log(response.status)

            return response.data;
        } catch (error) {
            console.log("Some error occured while uploading attendance pdf into spaces", error.message)
        }
    }
    //_____________________________________________________________________________






    //Version 2 apis

    export const getAttendancePdf = async (reqBody) => {
  
        try {



            const response = await axios.post(`${API_BASE_URL}/api/get-attendance-pdf`, reqBody)

            console.log(response.status)

            return response.data;
        } catch (error) {
            console.log("Some error occured ", error.message)
        }
    }
    //_____________________________________________________________________________

export const uploadAttendancePdf = async (formData) => {

    console.log(formData)
  try {
    const response = await axios.post(`${API_BASE_URL}/api/upload-attendance-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Optional: Add upload progress tracking
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });

    console.log("Upload successful:", response.status);
    return response.data;
  } catch (error) {
    console.log("Error uploading attendance PDF:", error.message);
    if (error.response) {
      console.log("Server response:", error.response.data);
    }
    throw error;
  }
};