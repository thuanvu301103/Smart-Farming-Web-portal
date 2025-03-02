import axiosInstance from "./axiosInstance";

const userApi = {
    profile: async (userId) => {
        const response = await axiosInstance.get(`/${userId}/profile`);
        //console.log("Fetch data: ", response.data);
        return response.data;
    },

    topScripts: async (userId) => {
        const response = await axiosInstance.get(`/${userId}/scripts/top`)
        return response.data;
    },
};

export default userApi;
