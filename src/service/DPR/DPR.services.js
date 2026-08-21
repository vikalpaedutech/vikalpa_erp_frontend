import axios from "axios";

// Environment Variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ============================================
// 1. CREATE APIs (POST)
// ============================================

export const createDailyWork = async (reqBody) => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/create-task`
        const response = await axios.post(`${API_BASE_URL}/api/create-task`, reqBody);
        return response.data;
    } catch (error) {
        console.log("Error creating daily work:", error.message);
        throw error.response?.data || error.message;
    }
};

export const createDailyWorkStatus = async (reqBody) => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/create-status`
        const response = await axios.post(`${API_BASE_URL}/api/create-status`, reqBody);
        return response.data;
    } catch (error) {
        console.log("Error creating daily work status:", error.message);
        throw error.response?.data || error.message;
    }
};

// ============================================
// 2. GET APIs (Fetch Data)
// ============================================

export const getAllDailyWork = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.unqUserObjectId) queryParams.append('unqUserObjectId', params.unqUserObjectId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.taskStatus) queryParams.append('taskStatus', params.taskStatus);
        if (params.isDeadlineCrossed !== undefined && params.isDeadlineCrossed !== null) {
            queryParams.append('isDeadlineCrossed', params.isDeadlineCrossed);
        }

        // ✅ `/dpr` hata diya - sirf `/api/tasks`
        const url = `${API_BASE_URL}/api/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log("🔍 Fetching tasks from URL:", url);
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log("Error fetching all daily work:", error.message);
        console.error("❌ Full error:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const getDailyWorkById = async (taskId) => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/task/:id`
        const response = await axios.get(`${API_BASE_URL}/api/task/${taskId}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching daily work by ID:", error.message);
        throw error.response?.data || error.message;
    }
};

export const getDailyWorkStatuses = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.taskId) queryParams.append('taskId', params.taskId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.taskStatus) queryParams.append('taskStatus', params.taskStatus);

        // ✅ `/dpr` hata diya - sirf `/api/statuses`
        const url = `${API_BASE_URL}/api/statuses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log("Error fetching daily work statuses:", error.message);
        throw error.response?.data || error.message;
    }
};

export const getLatestStatus = async (taskId) => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/status/:taskId/latest`
        const response = await axios.get(`${API_BASE_URL}/api/status/${taskId}/latest`);
        return response.data;
    } catch (error) {
        console.log("Error fetching latest status:", error.message);
        throw error.response?.data || error.message;
    }
};

// ============================================
// 3. UPDATE API (PUT)
// ============================================

export const updateDailyWork = async (taskId, reqBody) => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/task/:id`
        const response = await axios.put(`${API_BASE_URL}/api/task/${taskId}`, reqBody);
        return response.data;
    } catch (error) {
        console.log("Error updating daily work:", error.message);
        throw error.response?.data || error.message;
    }
};

// ============================================
// 4. DELETE API (DELETE)
// ============================================

export const deleteDailyWork = async (taskId) => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/task/:id`
        const response = await axios.delete(`${API_BASE_URL}/api/task/${taskId}`);
        return response.data;
    } catch (error) {
        console.log("Error deleting daily work:", error.message);
        throw error.response?.data || error.message;
    }
};

// ============================================
// 5. HELPER FUNCTIONS
// ============================================

export const getTasksByDateRange = async (employeeId, startDate, endDate) => {
    return getAllDailyWork({
        unqUserObjectId: employeeId,
        startDate: startDate,
        endDate: endDate
    });
};

export const getTasksByEmployee = async (employeeId) => {
    return getAllDailyWork({ unqUserObjectId: employeeId });
};

export const getCompletedTasksByEmployee = async (employeeId) => {
    return getAllDailyWork({
        unqUserObjectId: employeeId,
        taskStatus: 'Completed'
    });
};

export const getTasksCrossedDeadline = async (employeeId) => {
    return getAllDailyWork({
        unqUserObjectId: employeeId,
        isDeadlineCrossed: true
    });
};

// ============================================
// 6. TEST FUNCTION (to check API connection)
// ============================================

export const testApiConnection = async () => {
    try {
        // ✅ `/dpr` hata diya - sirf `/api/tasks`
        const response = await axios.get(`${API_BASE_URL}/api/tasks`);
        console.log("✅ API Connection Successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ API Connection Failed:", error.message);
        throw error.response?.data || error.message;
    }
};