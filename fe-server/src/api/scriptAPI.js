import axiosInstance from "./axiosInstance";

const scriptApi = {
    createScript: async (userId, formData) => {
        const response = await axiosInstance.post(`/${userId}/scripts`, formData);
        return response.data;
    },
};

export default scriptApi;
