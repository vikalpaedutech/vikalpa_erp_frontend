//This is User.service.js

//This contains all the service apis to call for backends'  user.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Post api to send userSignup data in the backend to user.controller.js

export const createUser = async (formData) => {
    const response = await axios.post (`${API_BASE_URL}/api/user`, formData)
    return response.data;
}


export const getUserByContact1 = async (contact1) => {
    const response = await axios.get (`${API_BASE_URL}/api/user/login/${contact1}`);
    return response.data;
}


export const patchUserById = async (userId, formData) => {


    try {
        
    const response = await axios.patch(`${API_BASE_URL}/api/user/${userId}`, formData);

    console.log("User Updated In Db")
    
    return response.data;


    } catch (error) {
        
        if( error.response?.data?.message === "Coordinates not updated"){
            //  alert(error.response?.data?.message)
        } else {
            alert("User Not updated")
        }
       
        
        
    }



};


export const patchUserByContact = async (contact1, formData) => {

    console.log(contact1)
    console.log(formData)
    
    const response = await axios.patch(`${API_BASE_URL}/api/patch-user-by-contact/${contact1}`, formData);
    return response.data;
};