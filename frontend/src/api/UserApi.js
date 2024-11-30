import { userApi } from ".";

export const updateUser = async (userId, userData) => {
    try {
        const response = await userApi.put(`/update-user/${userId}`, userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await userApi.delete(`/delete-user/${userId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

