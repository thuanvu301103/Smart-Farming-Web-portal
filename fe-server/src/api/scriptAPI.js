import axiosInstance from "./axiosInstance";

const scriptApi = {
    createScript: async (userId, formData) => {
        const response = await axiosInstance.post(`/${userId}/scripts`, formData);
        return response.data;
    },

    uploadScriptFile: async (formFileData) => {
        const response = await axiosInstance.post(`/files/upload`, formFileData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};

export default scriptApi;
