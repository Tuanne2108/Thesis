import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from "../redux/user/UserSlice";
import { notification, Spin, Button } from "antd";
import { ImageUploader } from "../components/ImageUploader";
import { CountrySelector } from "../components/CountrySelector";
import { ModalComponent } from "../components/ModalComponent";
import * as UserApi from "../api/UserApi";
export default function Profile() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [clearUploadFlags, setClearUploadFlags] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (clearUploadFlags) {
            setClearUploadFlags(false);
        }
    }, [clearUploadFlags]);

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            dispatch(updateUserStart());
            const res = await UserApi.updateUser(currentUser._id, formData);
            if (res.status === "success") {
                dispatch(updateUserSuccess(res.data));
                notification.success({
                    placement: "top",
                    message: "Success",
                    description: "Profile updated successfully",
                });
                setClearUploadFlags(true);
            } else {
                dispatch(updateUserFailure(res.message));
                notification.error({
                    placement: "top",
                    message: "Error",
                    description: res.message,
                });
            }
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

    const handleDeleteAccount = () => {
        setModalVisible(true);
    };

    const handleModalOk = async (e) => {
        e.preventDefault();
        dispatch(deleteUserStart());
        try {
            const res = await UserApi.deleteUser(currentUser._id);
            if (res.status === "success") {
                notification.success({
                    placement: "top",
                    message: "Success",
                    description: "User deleted successfully",
                });
                setModalVisible(false);
                dispatch(deleteUserSuccess());
                navigate("/");
            } else {
                notification.error({
                    placement: "top",
                    message: "Error",
                    description: res.message,
                });
                dispatch(deleteUserFailure(res.message));
            }
        } catch (error) {
            notification.error({
                placement: "top",
                message: "Error",
                description: error.message,
            });
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return (
        <div className="flex justify-center py-12 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
            <form className="space-y-12 w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-xl">
                {/* Photo Section */}
                <div className="flex justify-center mb-12">
                    <ImageUploader
                        currentUser={currentUser}
                        setFormData={setFormData}
                        formData={formData}
                        clearUploadFlags={clearUploadFlags}
                    />
                </div>

                {/* Profile Section */}
                <section className="border-b border-gray-300 pb-12">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                        Profile
                    </h2>
                    <p className="mt-1 text-lg text-gray-600">
                        This information will be displayed publicly, so be
                        careful what you share.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-12">
                        {/* Username */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-800">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                defaultValue={currentUser.username}
                                autoComplete="username"
                                onChange={handleOnChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-600 transition"
                            />
                        </div>

                        {/* About */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="about"
                                className="block text-sm font-medium text-gray-800">
                                About
                            </label>
                            <textarea
                                id="about"
                                name="about"
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-600 transition"
                                placeholder="Write a few sentences about yourself."
                            />
                        </div>
                    </div>
                </section>

                {/* Personal Information Section */}
                <section className="border-b border-gray-300 pb-12">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                        Personal Information
                    </h2>
                    <p className="mt-1 text-lg text-gray-600">
                        Use a permanent address where you can receive mail.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-12">
                        {/* Email Address */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-800">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={currentUser.email}
                                autoComplete="email"
                                onChange={handleOnChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-600 transition"
                            />
                        </div>

                        {/* Country */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-800">
                                Country
                            </label>
                            <CountrySelector
                                value={formData.country}
                                onChange={handleOnChange}
                            />
                        </div>

                        {/* City */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-800">
                                City
                            </label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                autoComplete="address-level2"
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-600 transition"
                            />
                        </div>

                        {/* State / Province */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="region"
                                className="block text-sm font-medium text-gray-800">
                                State / Province
                            </label>
                            <input
                                id="region"
                                name="region"
                                type="text"
                                autoComplete="address-level1"
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-600 transition"
                            />
                        </div>

                        {/* Street Address */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="street-address"
                                className="block text-sm font-medium text-gray-800">
                                Street Address
                            </label>
                            <input
                                id="street-address"
                                name="street-address"
                                type="text"
                                autoComplete="street-address"
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-600 transition"
                            />
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-x-4 mt-12">
                    {/* Delete Account Button */}
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition">
                        Delete Account
                    </button>

                    <div className="flex items-center gap-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition">
                            {isLoading ? <Spin /> : "Save"}
                        </button>
                    </div>
                </div>
            </form>
            {/* Confirmation Modal */}
            <ModalComponent
                title="Delete Account"
                visible={isModalVisible}
                footer={[
                    <Button
                        key="delete"
                        onClick={handleModalOk}
                        type="primary"
                        danger>
                        Delete
                    </Button>,
                    <Button key="cancel" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                ]}
                modalText="Are you sure you want to delete your account? This action cannot be undone."
            />
        </div>
    );
}
