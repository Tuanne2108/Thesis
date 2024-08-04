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
                navigate("/");
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt=""
                    src="https://static.vecteezy.com/system/resources/previews/008/956/590/original/creative-abstract-black-silhouette-running-shoe-design-logo-design-template-free-vector.jpg"
                    className="mx-auto h-20 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    id="sign-in"
                    onSubmit={handleSubmit}
                    className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <Input onChange={handleOnChange} name="email" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900">
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
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {isLoading ? "Loading..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <a
                        href="/sign-up"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
