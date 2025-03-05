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

    getScriptInfo: async (userId, scriptId) => {
        const response = await axiosInstance.get(`/${userId}/scripts/${scriptId}`);
        return response.data;
    },

    getScriptFile: async (filePath) => {
        const response = await axiosInstance.get(`/files/file-content/${filePath}`);
        return response.data;
    },

    updateScriptInfo: async (userId, scriptId, updateData) => {
        const response = await axiosInstance.put(`/${userId}/scripts/${scriptId}`, updateData);
        return response.data;
    },

    deleteScriptInfo: async (userId, scriptId) => {
        const response = await axiosInstance.delete(`/${userId}/scripts/${scriptId}`);
        return response.data;
    },

    deleteScriptFiles: async (userId, scriptId) => {
        const response = await axiosInstance.delete(`/files/deleteFolder`,
            { params: { path: `${userId}/${scriptId}` } }
        );
        return response.data;
    }
};

export default scriptApi;
