/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Input, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import * as AuthApi from "../api/AuthApi";

export default function SignUp() {
    const [formData, setFormData] = useState({role: "customer"});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await AuthApi.signUp({
                email: formData.email,
                password: formData.password,
                confirmedPassword: formData.confirmedPassword,
            });
            notification.success({
                placement: "top",
                message: "Success",
                description: "Registration successful",
            });
            navigate("/sign-in");
        } catch (error) {
            notification.error({
                placement: "top",
                message: "Error",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <img
                        alt=""
                        src="https://static.vecteezy.com/system/resources/previews/008/956/590/original/creative-abstract-black-silhouette-running-shoe-design-logo-design-template-free-vector.jpg"
                        className="mx-auto h-20 w-auto"
                    />
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Register your account
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
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <Input.Password
                                onChange={handleOnChange}
                                name="confirmedPassword"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isLoading ? <Spin /> : "Sign up"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/sign-in"
                            className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
