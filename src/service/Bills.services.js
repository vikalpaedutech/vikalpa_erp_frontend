//This is Bills.service.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Below api posts bills data to db and cloudinary

export const createPost = async (payLoad) => {
console.log("I am payload", payLoad)
    try {
        const response = await axios.post(`${API_BASE_URL}/api/create-expense`, payLoad)
        return response.data;
    } catch (error) {
        console.log("Some error occured while posting bills data", error.message)
    }
}
//_____________________________________________________________________________


//Below api to get all bills data. 

export const getAllBills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-all-bills`);
      return response.data;
    } catch (error) {
      console.log("Error while fetching all bills", error.message);
    }
  };

  //________________________________________________________________

  //Below api to get pending bills.
  export const getPendingAndVerifiedBillsByAci = async (query) => {
    // alert("hi")
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-pending-bills?${query}`);
      return response.data;
    } catch (error) {
      console.log("Error while fetching pending bills", error.message);
    }
  };

  //_________________________________________________________________________


   //Below api to get verified bils.
   export const getVerifiedBills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-verified-bills`);
      return response.data;
    } catch (error) {
      console.log("Error while fetching verified bills", error.message);
    }
  };

  //_________________________________________________________________________










  //Below api to get approved bils.
  export const getApprovedBills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-approved-bills`);
      return response.data;
    } catch (error) {
      console.log("Error while fetching approved bills", error.message);
    }
  };

  //_________________________________________________________________________

  //Below apit to get rejected bills.
  export const getRejectedBills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-rejected-bills`);
      return response.data;
    } catch (error) {
      console.log("Error while fetching rejected bills", error.message);
    }
  };
  //___________________________________________________________________


  //Below api to get bills by query params.
  export const getBillsByQueryParams = async (queryParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-bills-by-query`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      console.log("Error while fetching bills by query", error.message);
    }
  };
  //________________________________________________________________


  //Below api patches bills data. Ony verification part

export const patchBillsDataVerification = (queryParams, formData) =>{

    // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();

        console.log("i am from service", queryString)

    try {

        const response = axios.patch(`${API_BASE_URL}/api/patch-bills?${queryString}`, formData)
        return response.data;
    } catch (error) {
        console.log("Error patchind data", error.message)
    }
}

//__________________________________________________________________________________________


  //Below api patches bills data. Ony approval part

  export const patchBillsDataApproval = (queryParams, formData) =>{

    // Prepare query parameters to send in the URL
        const queryString = new URLSearchParams(queryParams).toString();

        console.log("i am from service", queryString)

    try {

        const response = axios.patch(`${API_BASE_URL}/api/patch-bills-approval?${queryString}`, formData)
        return response.data;
    } catch (error) {
        console.log("Error patchind data", error.message)
    }
}

//__________________________________________________________________________________________



//Below api patches bills data. Ony approval part

export const deleteBill = async (formData) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/delete-bill`, {
      data: formData, // body data in delete request
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting bill", error.message);
    throw error;
  }
};

//__________________________________________________________________________________________




//Below api patches bills data. Ony approval part

export const getAllBillsWithUserDetails = async () => {
  
  try {

    const response = await axios.get(`${API_BASE_URL}/api/get-all-bills-with-user-details`);

    return response.data;

  } catch (error) {

    console.error("Error getting bills", error.message);

    throw error;

  }

};

//__________________________________________________________________________________________

