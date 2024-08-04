/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import * as AuthApi from "../api/AuthApi";

export default function SignUp() {
    const [formData, setFormData] = useState({});
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt=""
                    src="https://static.vecteezy.com/system/resources/previews/008/956/590/original/creative-abstract-black-silhouette-running-shoe-design-logo-design-template-free-vector.jpg"
                    className="mx-auto h-20 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Register your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    id="sign-up"
                    className="space-y-6"
                    onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <Input
                                name="email"
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <Input.Password
                                name="password"
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Confirmed Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <Input.Password
                                name="confirmedPassword"
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 ">
                            {isLoading ? "Loading..." : "Sign up"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <a
                        href="/sign-in"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
}
