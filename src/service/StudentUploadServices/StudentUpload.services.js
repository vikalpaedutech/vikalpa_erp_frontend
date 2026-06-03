// Attendance.service.js

import axios from "axios";

// Env variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Student Cron Attendance API Call.

export const UplaoadStudentFiles = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload-student-file`, reqBody)

        if(response.status === 200){
        console.log('data updated successfully')
        } 
        return response;
    } catch (error) {
        console.log(error)
        if (error.status === 400){
            alert('Server error occured.')
        }
    }

}






export const getStudentUploadsObjectives = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-student-objectives`, reqBody)

        if(response.status === 200){
        console.log('data fetched successfully')
        } 
        return response;
    } catch (error) {
        console.log(error)
        if (error.status === 400){
            alert('Server error occured.')
        }
    }

}








export const GetStudentsForUploads = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-student-for-uploads`, reqBody)

        if(response.status === 200){
        console.log('data fetched successfully')
        } 
        return response;
    } catch (error) {
        console.log(error)
        if (error.status === 400){
            alert('Server error occured.')
        }
    }

}







export const DeletUploads = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/delete-student-uploads`, reqBody)

        if(response.status === 200){
        console.log('data deleted successfully')
        } 
        return response;
    } catch (error) {
        console.log(error)
        if (error.status === 400){
            alert('Server error occured.')
        }
    }

}







export const StudentUploadDashboard = async (reqBody)=> {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/student-upload-dashboard`, reqBody)

        if(response.status === 200){
        console.log('data fetched successfully')
        } 
        return response;
    } catch (error) {
        console.log(error)
        if (error.status === 400){
            alert('Server error occured.')
        }
    }

}

