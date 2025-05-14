
//This is DistrictBlockSchool.service.js.

//This contains all the service apis to call for backends'  district.controller.js, block.controller.js, school.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//Get all students data.
//Below calls the api from backend.
export const getDistrict = async () => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.get (`${API_BASE_URL}/api/district`)
        
        return response.data;


    } catch (error) {
        console.error("Error getting district data", error.message);
        throw error;
    }
}

//Below calls the api from backend.
export const getDistrictById = async (assignedDistricts) => {
    try {
        
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.get (`${API_BASE_URL}/api/district/${assignedDistricts}`)
        
        return response.data;


    } catch (error) {
        console.error("Error getting district data", error.message);
        throw error;
    }
}





//Api for calling Blocks data from backend. Controller name is block.controller.js
export const getBlock = async () => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.get (`${API_BASE_URL}/api/block`)
        
        return response.data;


    } catch (error) {
        console.error("Error getting block data", error.message);
        throw error;
    }
}

//_____________________________________________________________________________



//Api for calling Blocks data from backend. Controller name is school.controller.js
export const getSchool = async () => {
    try {
        // console.log('i am inside service')
        // console.log(API_BASE_URL)   
        const response = await axios.get (`${API_BASE_URL}/api/school`)
        
        return response.data;


    } catch (error) {
        console.error("Error getting block data", error.message);
        throw error;
    }
}

//______________________________________________________



//Below api fetches the blocks by districts id in mongo db.
export const getBlocksByDistrictId = async (queryParams) => {


    
   // Prepare query parameters to send in the URL
   const queryString = new URLSearchParams(queryParams).toString();
   console.log(queryString, "from service")


    try {

        const response = await axios.get(`${API_BASE_URL}/api/block-by-id?${queryString}`)

        return response.data
        
    } catch (error) {
        console.error("Error getting block data", error.message);
        throw error;
    }
   
}

//____________________________________________________________________




//Below api fetches the school by block id in mongo db.
export const getSchoolsByBlockId = async (blockId) => {

    try {

        const response = await axios.get(`${API_BASE_URL}/api/school-by-blockid/${blockId}`)

        return response.data
        
    } catch (error) {
        console.error("Error getting block data", error.message);
        throw error;
    }
   
}

//____________________________________________________________________