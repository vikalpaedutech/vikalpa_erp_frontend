// This is Concern.services.js


import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const createConcern = async (formData) => {
  
 try {

        const response = await axios.post(`${API_BASE_URL}/api/create-concern`, formData)
        
     

     
        
        return response;
    } catch (error) {

        

        if(error.response.status === 409){
            alert('Concern was already created! You can only create concern once the previous concern was either closed!')
        }

        console.log("Error :", error.message)
    }
}

export const getConcernsByQueryParameters = async (queryparams) =>{

  

    try {
        
         // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryparams).toString();
        // console.log("i am query params")
         console.log(queryString)
        const response = await axios.get(`${API_BASE_URL}/api/get-concerns-by-query-parameters?${queryString}`)
        return response;

    } catch (error) {

        console.log("Error :", error.message)

    }
}


export const PatchConcernsByQueryParams = async (queryParams, payLoad) => {


  console.log(queryParams)
  console.log(payLoad)
    try {
        
        //Prepare query parametrs to send in the URL

        const queryString = new URLSearchParams(queryParams).toString();

        const response = await axios.patch(`${API_BASE_URL}/api/patch-concern-by-query-parameters?${queryString}`, payLoad)

      

        return response;

    } catch (error) {

       
        
        console.log("Error :", error.message);

    }
}


//Get IndividualConcenrs.

export const getIndividualConcerns = async (queryParams) => {


    try {
        
         //Prepare query parametrs to send in the URL

        const queryString = new URLSearchParams(queryParams).toString();

        const response = axios.get(`${API_BASE_URL}/api/get-individual-concerns?${queryString}`)

        return response;

    } catch (error) {
        
        console.log("Error :", error.message);

    }


}




//Get Individual Leave

export const getIndividualLeave = async (queryParams) => {


    try {
        
         //Prepare query parametrs to send in the URL

        const queryString = new URLSearchParams(queryParams).toString();

        const response = axios.get(`${API_BASE_URL}/api/get-individual-leave?${queryString}`)

        return response;
        
    } catch (error) {
        
        console.log("Error :", error.message);

    }
    


}


//get notification api

export const GetNotificationByUserIdOnQueryParams = async (queryParams) =>{


    try {

         //Prepare query parametrs to send in the URL

        const queryString = new URLSearchParams(queryParams).toString();

        const response = axios.get(`${API_BASE_URL}/api/get-notification?${queryString}`)

        return response;
        
    } catch (error) {
        console.log("Error :", error.message);
    }
}