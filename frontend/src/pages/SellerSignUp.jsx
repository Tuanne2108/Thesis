import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import * as UserApi from "../api/UserApi";

export default function SellerSignUp() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shopName: "",
        shopAddress: "",
        contactNumber: "",
        description: "",
    });

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await UserApi.becomeSeller({
                userId: currentUser._id,
                ...formData,
            });

            if (response.status === "success") {
                notification.success({
                    message: "Success",
                    description: "Seller account created successfully",
                });
                navigate("/seller-dashboard");
            } else {
                notification.error({
                    message: "Error",
                    description: response.message,
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description:
                    "An error occurred while creating the seller account",
            });
        }
    };

    return (
        <div className="flex justify-center py-12 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Become a Seller
                </h2>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-800"
                        htmlFor="shopName">
                        Shop Name
                    </label>
                    <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleOnChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-800"
                        htmlFor="shopAddress">
                        Shop Address
                    </label>
                    <input
                        type="text"
                        id="shopAddress"
                        name="shopAddress"
                        value={formData.shopAddress}
                        onChange={handleOnChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-800"
                        htmlFor="contactNumber">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleOnChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                    />
                </div>

                <div className="mb-6">
                    <label
                        className="block text-sm font-medium text-gray-800"
                        htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleOnChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="w-1/2 bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold shadow-sm hover:bg-indigo-500 transition duration-150 ease-in-out mr-2">
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/profile");
                        }}
                        className="w-1/2 bg-gray-500 text-white py-2 px-4 rounded-md font-semibold shadow-sm hover:bg-gray-400 transition duration-150 ease-in-out ml-2">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
