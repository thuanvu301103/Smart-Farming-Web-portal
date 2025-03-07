import axiosInstance from "./axiosInstance";

const modelApi = {
    getModels : async (userId) => {
        const response = await axiosInstance.get(`/${userId}/models/`);
        return response.data;
    },
    getModelInfo: async (userId, modelId) => {
        const response = await axiosInstance.get(`/${userId}/models/${modelId}`);
        return response.data;
    },
    createModel: async (userId, formData) => {
        const response = await axiosInstance.post(`/${userId}/models`, formData);
        return response.data;
    },
    createScriptModel: async (userId, modelId, formData) => {
        const response = await axiosInstance.post(`/${userId}/models/${modelId}/scripts`, formData);
        return response.data;
    },
    getScriptsModel: async (usedId, modelId) => {
        const response = await axiosInstance.get(`/${usedId}/models/${modelId}/scripts`);
        return response.data;
    },
    updateModelInfo: async (userId, modelId, updateData) => {
        const response = await axiosInstance.put(`/${userId}/models/${modelId}`, updateData);
        return response.data;
    },
    deleteModelInfo: async (userId, modelId) => {
        const response = await axiosInstance.delete(`/${userId}/models/${modelId}`);
        return response.data;
    },
};

export default modelApi;
