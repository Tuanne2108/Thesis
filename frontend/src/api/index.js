import axios from "axios";

export const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


