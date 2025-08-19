//This is GamificationDisciplinary.services.js.

import axios from "axios";

//Env varibale.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



//Below api Posts GamificationDisciplinary data.

export const disciplinaryGamification = async (formData) => {
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/disciplinary-gamification`, formData);
    return response.data;
  } catch (error) {
    console.error("Error deleting bill", error.message);
    throw error;
  }
};

//__________________________________________________________________________________________



//Get api to fetch ponitType: 'disciplinary' for current date only


export const getDisciplinaryGamificationDocumentsForCurrentDate = async () => {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-disciplinary-docs-current-date-only`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bill", error.message);
    throw error;
  }
};

//---------------------------------------------------------------------------------