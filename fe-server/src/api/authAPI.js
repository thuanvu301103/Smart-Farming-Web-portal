import axiosInstance from "./axiosInstance";

const authApi = {
    login: async (username, password) => {
        const response = await axiosInstance.post("/auth/login", { username, password });
        return response.data; // Return access_token
    },

    register: async (username, password) => {
        const response = await axiosInstance.post("/auth/register", { username, password});
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
    },
};

export default authApi;
