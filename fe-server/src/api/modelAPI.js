import axiosInstance from "./axiosInstance";

const modelApi = {
  getModels: async (userId) => {
    const response = await axiosInstance.get(`/${userId}/models/get-all`);
    return response.data;
  },
  getModelInfo: async (userId, modelName) => {
    const response = await axiosInstance.get(
      `/${userId}/models/get?name=${modelName}`
    );
    return response.data;
  },
  getModelVersion: async (userId, modelName) => {
    const response = await axiosInstance.get(
      `/${userId}/models/versions/get-all?name=${modelName}`
    );
    return response.data;
  },
  createModel: async (userId, formData) => {
    const response = await axiosInstance.post(
      `/${userId}/models/create`,
      formData
    );
    return response.data;
  },
  createScriptModel: async (userId, formData) => {
    const response = await axiosInstance.post(
      `/${userId}/models/scripts/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
  getScriptsModel: async (usedId, modelId) => {
    const response = await axiosInstance.get(
      `/${usedId}/models/scripts/get-all?model_id=${modelId}`
    );
    return response.data;
  },
  getScriptsModelVersion: async (userId, modelId, version) => {
    const response = await axiosInstance.get(
      `/${userId}/models/scripts/get?model_id=${modelId}&version=${version}`
    );
    return response.data;
  },
  updateModelInfo: async (userId, updateData) => {
    const response = await axiosInstance.put(
      `/${userId}/models/update`,
      updateData
    );
    return response.data;
  },
  deleteModelInfo: async (userId, modelName) => {
    const response = await axiosInstance.delete(
      `/${userId}/models/delete`,
      modelName
    );
    return response.data;
  },
};

export default modelApi;
