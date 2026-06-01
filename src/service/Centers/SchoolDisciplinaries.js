//This is AttendancePdf.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//POST API.

export const createSchoolDisciplinaryRecord = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/create-disciplinary-record`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error occuredcreating data", error.message)
        }
    }
    //_____________________________________________________________________________



    //get api

    export const GetSchoolDisciplinaryData = async (reqBody) => {

        try {
            const response = await axios.post(`${API_BASE_URL}/api/get-disciplinary-record`, reqBody)
            return response.data;
        } catch (error) {
            console.log("Some error occuredcreating data", error.message)
        }
    }
    //_____________________________________________________________________________


