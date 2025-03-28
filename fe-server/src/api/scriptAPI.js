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

    renameFile: async (userId, scriptId, oldVersion, newVersion) => {
        const response = await axiosInstance.put(`/files/rename`, {
            old_path: `${userId}/${scriptId}/v${oldVersion.toFixed(1)}.json`,
            new_path: `${userId}/${scriptId}/v${newVersion.toFixed(1)}.json`
        })
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
            { params: { path: `${userId}/script/${scriptId}` } }
        );
        return response.data;
    },

    deleteScriptFileVersion: async (userId, scriptId, version) => {
        const response = await axiosInstance.delete(`/files/deleteFile`,
            { params: { path: `${userId}/script/${scriptId}/v${version.toFixed(1)}.json` } }
        );
        return response.data;
    }
};

export default scriptApi;
