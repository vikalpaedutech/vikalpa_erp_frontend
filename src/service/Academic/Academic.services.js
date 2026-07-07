// Attendance.service.js

import axios from "axios";

// Env variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//Student Cron Attendance API Call.


export const CreateTimeTable = async (reqBody) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/create-time-table`, reqBody);
    return response.data;
  } catch (error) {
    console.error("CreateTimeTable Error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Network error occurred"
    };
  }
};



//Get time table

export const GetTimeTable = async (reqBody) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/get-timetable`, reqBody);
    return response.data;
  } catch (error) {
    console.error("get time table Error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Network error occurred"
    };
  }
};





//Get time table

export const DeleteTimeTable = async (reqBody) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/delete-time-table`, reqBody);
    return response.data;
  } catch (error) {
    console.error("delete time table Error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Network error occurred"
    };
  }
};







export const CreateLectureAndVideos = async (reqBody) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/create-lecture-videos`, reqBody);
    return response.data;
  } catch (error) {
    console.error("CreateTimeTable Error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Network error occurred"
    };
  }
};








export const GetLectureAndVideos = async (reqBody) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/get-lecture-videos`, reqBody);
    return response.data;
  } catch (error) {
    console.error("CreateTimeTable Error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Network error occurred"
    };
  }
};








export const DeleteLectureAndVideos = async (reqBody) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/delete-lecture-videos`, reqBody);
    return response.data;
  } catch (error) {
    console.error("CreateTimeTable Error:", error);
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Network error occurred"
    };
  }
};