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

export const googleSignIn = async (user) => {
    try {
        const response = await authApi.post("/google", user);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const facebookSignIn = async (accessToken) => {
    try {
        const response = await authApi.post("/facebook", { accessToken });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const xTwitterSignIn = async (oauthToken, oauthTokenSecret) => {
    try {
        const response = await authApi.post("/twitter", {
            oauthToken,
            oauthTokenSecret,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const signOut = async () => {
    try {
        const response = await authApi.get("/sign-out");
        return response.data;
    } catch (error) {
        throw new Error("An unexpected error occurred");
    }
};
