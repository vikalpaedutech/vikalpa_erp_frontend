//This is AttendancePdf.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//POST API. Initiating attendance pdf by admin in db

export const createAttendancePdfCronJob = async () => {
    console.log("I am inside Attendance pdf cron job")
    console.log("i am file")
        try {

       
          


            const response = await axios.post(`${API_BASE_URL}/api/initiate-attendance-pdf`)
            return response.data;
        } catch (error) {
            console.log("Some error occured while uploading attendance pdf into spaces", error.message)
        }
    }
    //_____________________________________________________________________________





//Get API by schoolId

export const GetDataBySchoolId = async (schoolId, selectedDate) => {
console.log("I am inside Attendance pdf service and school id is", schoolId, selectedDate)
    try {
        const response = await axios.get(`${API_BASE_URL}/api/attendancepdf/${schoolId}/${selectedDate}`)
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
          console.log(queryString)
          


            const response = await axios.patch(`${API_BASE_URL}/api/attendancepdf-upload?${queryString}`, file)
            return response.data;
        } catch (error) {
            console.log("Some error occured while uploading attendance pdf into spaces", error.message)
        }
    }
    //_____________________________________________________________________________

