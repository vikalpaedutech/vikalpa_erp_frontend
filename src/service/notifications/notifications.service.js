//This is mptofocatopms.service.js

//This contains all the service apis to call for backends'  user.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getNotificationsByUserId= async (payload) => {

    console.log(payload)

    // Prepare query parameters to send in the URL
   const queryString = new URLSearchParams(payload).toString();
   console.log(queryString, "from service")

    try {
        
        const response = await axios.get(`${API_BASE_URL}/api/get-notification-by-userid?${queryString}`);
       
        console.log(response.status)
        return response.data
    } catch (error) {
        
        console.log('error occured while fetching notification data')
        console.log(error)
    }

}


//Patch notification service. Once user clicks on notification, removing the count and notificaitn


export const patchNotificationByConcernTypeAndRole= async (payload) => {

    console.log(payload)

    // Prepare query parameters to send in the URL
   const queryString = new URLSearchParams(payload).toString();
   console.log(queryString, "from service")

    try {
        
        const response = await axios.patch(`${API_BASE_URL}/api/patch-notification-by-concerynType-and-role?${queryString}`);
       
        console.log(response.status)
        return response.data
    } catch (error) {
        
        console.log('error occured while patching notification data')
        console.log(error)
    }

}

//-------------------------------------------------------