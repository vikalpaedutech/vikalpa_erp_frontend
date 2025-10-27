// FRONTEND/src/service/ExamAndTestController.js

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const createPost = async (formData) => {
console.log(formData)
try {
    
    const response = await axios.post (`${API_BASE_URL}/api/exam-controller`, formData)

    return response;

} catch (error) {
    console.log("Error occured while creating test", error.message)
}

}

export const createMarksRecordCron = async (formData) => {

console.log(formData)

    try {
        const response = await axios.post(`${API_BASE_URL}/api/initiate-test`, formData)
       console.log(response.error)
        return response;
    } catch (error) {
        console.log(error.status)
        if(error.status === 400){
            alert("Test is already created")
        }
        console.log("Error occured while initiating test.", error.message)
    }

}


export const GetTests = async (reqBody) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-tests`, reqBody)
        return response;
    } catch (error) {
        console.log("Error fetching test data", error.message)
    }
}