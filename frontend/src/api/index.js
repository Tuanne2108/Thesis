import axios from "axios";

export const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
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

export const sellerApi = axios.create({
    baseURL: "http://localhost:3000/api/seller",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const productApi = axios.create({
    baseURL: "http://localhost:3000/api/product",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
