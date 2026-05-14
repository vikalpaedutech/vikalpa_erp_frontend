//This is User.service.js

//This contains all the service apis to call for backends'  user.controller.js apis

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Post api to send userSignup data in the backend to user.controller.js

export const createUser = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/user`, reqBody)
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








//Version 2 apis. 
//Date: 01-09-2025
//All apis are latest and optimised




export const userSignIn = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/user-signin`, reqBody);
    return response.data;
}






//Version 2 apis

export const setUserAccess = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/set-user-access`, reqBody)
    return response.data;
}




export const getAllUsersWithAccess = async (reqQuery) => {
  // Convert object to query string
  const queryString = new URLSearchParams(reqQuery).toString();

  // Use GET since you’re passing query params (instead of POST)
  const response = await axios.get(
    `${API_BASE_URL}/api/get-all-users?${queryString}`
  );

  return response.data;
};



export const getAllUsersWithAccesswithoutPagination = async (reqQuery) => {
  // Convert object to query string
  const queryString = new URLSearchParams(reqQuery).toString();

  // Use GET since you’re passing query params (instead of POST)
  const response = await axios.get(
    `${API_BASE_URL}/api/get-all-users-without-pagination?${queryString}`
  );

  return response.data;
};






export const updateUserWithAccess = async (reqBody) => {
    const response = await axios.patch (`${API_BASE_URL}/api/patch-user-and-useraccess`, reqBody)
    return response.data;
}






export const getUsersByObjectId = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/get-user-data-by-object-id`, reqBody);
    return response.data;
}










//Uder admin update service


export const updateUser = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/update-user`, reqBody);
    return response.data;
}








export const updateUserAccesses = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/update-user-access`, reqBody);
    return response.data;
}






export const UserAttendanceDashboard = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/get-user-attendance-dashboard`, reqBody);
    return response.data;
}






export const MarkUserAttendanceManually = async (reqBody) => {
    const response = await axios.post (`${API_BASE_URL}/api/mark-user-attendance-manually`, reqBody);
    return response.data;
}








// export const MarkUserAttendance = async (formData) => {

//     console.log(formData)
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/mark-user-attendance`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       // Optional: Add upload progress tracking
//       onUploadProgress: (progressEvent) => {
//         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         console.log(`Upload Progress: ${percentCompleted}%`);
//       }
//     });

//     console.log("Upload successful:", response.status);
//     return response.data;
//   } catch (error) {
//     console.log("Error uploading attendance PDF:", error.message);
//     if (error.response) {
//       console.log("Server response:", error.response.data);
//     }
//     throw error;
//   }
// };






