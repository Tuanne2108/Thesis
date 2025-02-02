/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "../redux/user/UserSlice";
import * as AuthApi from "../api/AuthApi";
import OAuth from "../components/OAuth";

export default function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const { isLoading } = useSelector((state) => state.user);

    const handleOnChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            const response = await AuthApi.signIn({
                email: formData.email,
                password: formData.password,
            });
            if (response.status === "success") {
                dispatch(signInSuccess(response.data));
                notification.success({
                    placement: "top",
                    message: "Success",
                    description: "Login successful",
                });
                if (response.data.role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/");
                }
            } else {
                dispatch(signInFailure(response.message));
                notification.error({
                    placement: "top",
                    message: "Error",
                    description: response.message,
                });
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
            notification.error({
                placement: "top",
                message: "Error",
                description: error.message,
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <span className="text-purple-500 font-bold text-3xl">
                        TRAVELxAI
                    </span>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form
                    id="sign-in"
                    onSubmit={handleSubmit}
                    className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-2">
                            <Input
                                onChange={handleOnChange}
                                name="email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Input.Password
                                onChange={handleOnChange}
                                name="password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isLoading ? "Loading..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/sign-up"
                            className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign Up
                        </a>
                    </p>
                </div>

                <OAuth />
            </div>
        </div>
    );
}
