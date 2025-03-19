import axiosInstance from "./axiosInstance";

const notificationApi = {
    allNotification: async (userId) => {
        const response = await axiosInstance.get(`/notification/${userId}`)
        return response.data;
    },

    notification: async (userId, notifyId) => {
        const response = await axiosInstance.get(`/notification/${userId}`, {
            params: { notifyId }
        });
        return response.data;
    },

    createNotification: async (from, to, script_id) => {
        const response = await axiosInstance.post(`/notification/share`, {
            from: from,
            to: to,
            script_id: script_id
        });
        return response.data;
    }
};

export default notificationApi;