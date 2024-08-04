import { authApi } from ".";
export const signIn = async (user) => {
    try {
        const response = await authApi.post("/sign-in", user);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
export const signUp = async (user) => {
    try {
        const response = await authApi.post("/sign-up", user);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
