import axiosInstance from "./axiosInstance";

const commentApi = {
  getAllComments: async (userId, scriptId) => {
    const response = await axiosInstance.get(
      `/${userId}/scripts/${scriptId}/comments`
    );
    return response.data;
  },

  getCommentHistory: async (userId, scriptId, commentId) => {
    const response = await axiosInstance.get(
      `/${userId}/scripts/${scriptId}/comments/${commentId}/history`
    );
    return response.data;
  },

  getAllSubComments: async (userId, scriptId, commentId) => {
    const response = await axiosInstance.get(
      `/${userId}/scripts/${scriptId}/comments/${commentId}/subcomments`
    );
    return response.data;
  },

  createComment: async (userId, scriptId, formData) => {
    const response = await axiosInstance.post(
      `/${userId}/scripts/${scriptId}/comments`,
      formData
    );
    return response.data;
  },

  updateComment: async (userId, scriptId, commentId, content) => {
    const response = await axiosInstance.put(
      `/${userId}/scripts/${scriptId}/comments/${commentId}`,
      { content: content }
    );
    return response.data;
  },

  deleteComment: async (userId, scriptId, commentId) => {
    const response = await axiosInstance.delete(
      `/${userId}/scripts/${scriptId}/comments/${commentId}`
    );
    return response.data;
  },
};

export default commentApi;
