import axios from "axios";

export const authApi = axios.create({
    baseURL: "https://thesis-nu.vercel.app/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const userApi = axios.create({
    baseURL: "http://localhost:3000/api/user",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

