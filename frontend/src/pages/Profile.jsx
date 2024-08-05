/* eslint-disable react/no-unescaped-entities */
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Flex, Progress } from "antd";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Profile() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePercent, setFilePercent] = useState(0);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    console.log(file);
    console.log(filePercent);

    /* firebase storage rules:
     allow read;
     allow write: if
     request.resource.size < 2 * 1024 * 1024 &&
     request.resource.contentType.matches('image/.*') */

    useEffect(() => {
        if (file) {
            handleUploadFile(file);
        }
    }, [file]);

    const handleUploadFile = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);
        setUploadComplete(false);
        setUploadError(false);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercent(Math.round(progress));
            },
            (error) => {
                console.error("An error occurred: ", error);
                setUploadError(true);
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setFormData({ ...formData, avatar: downloadUrl });
                    setUploading(false);
                    setUploadComplete(true);
                });
            }
        );
    };

    return (
        <div className="flex justify-center py-12 bg-gray-50 min-h-screen">
            <form className="space-y-12 w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                {/* Photo Section */}
                <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center">
                        {currentUser ? (
                            <img
                                className="inline-block h-40 w-40 rounded-full"
                                src={currentUser.avatar}
                                alt="user avatar"
                            />
                        ) : (
                            <UserCircleIcon
                                aria-hidden="true"
                                className="h-24 w-24 text-gray-300"
                            />
                        )}
                        {!uploading ? (
                            <button
                                type="button"
                                onClick={() => fileRef.current.click()}
                                className="mt-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                                Change Photo
                            </button>
                        ) : (
                            <Flex wrap="true" gap="small">
                                <Progress
                                    type="circle"
                                    percent={filePercent}
                                    size={50}
                                />
                            </Flex>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"></input>
                        {uploadComplete && (
                            <div className="text-sm text-green-600 mt-4">
                                Image uploaded successfully!
                            </div>
                        )}
                        {uploadError && (
                            <div className="text-sm text-red-700 mt-4">
                                Error uploading image. Please ensure the file is
                                less than 2MB and try again.
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <section className="border-b border-gray-200 pb-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Profile
                    </h2>
                    <p className="mt-1 text-base text-gray-600">
                        This information will be displayed publicly, so be
                        careful what you share.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8">
                        {/* Username */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-900">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="user123..."
                                autoComplete="username"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* About */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="about"
                                className="block text-sm font-medium text-gray-900">
                                About
                            </label>
                            <textarea
                                id="about"
                                name="about"
                                rows={4}
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Write a few sentences about yourself."
                            />
                        </div>
                    </div>
                </section>

                {/* Personal Information Section */}
                <section className="border-b border-gray-200 pb-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Personal Information
                    </h2>
                    <p className="mt-1 text-base text-gray-600">
                        Use a permanent address where you can receive mail.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8">
                        {/* First Name */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-900">
                                First Name
                            </label>
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="last-name"
                                className="block text-sm font-medium text-gray-900">
                                Last Name
                            </label>
                            <input
                                id="last-name"
                                name="last-name"
                                type="text"
                                autoComplete="family-name"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-900">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Country */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-900">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                autoComplete="country-name"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm">
                                <option>United States</option>
                                <option>Canada</option>
                                <option>Mexico</option>
                            </select>
                        </div>

                        {/* Street Address */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="street-address"
                                className="block text-sm font-medium text-gray-900">
                                Street Address
                            </label>
                            <input
                                id="street-address"
                                name="street-address"
                                type="text"
                                autoComplete="street-address"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* City */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-900">
                                City
                            </label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                autoComplete="address-level2"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* State / Province */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="region"
                                className="block text-sm font-medium text-gray-900">
                                State / Province
                            </label>
                            <input
                                id="region"
                                name="region"
                                type="text"
                                autoComplete="address-level1"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* ZIP / Postal Code */}
                        <div className="md:col-span-1">
                            <label
                                htmlFor="postal-code"
                                className="block text-sm font-medium text-gray-900">
                                ZIP / Postal Code
                            </label>
                            <input
                                id="postal-code"
                                name="postal-code"
                                type="text"
                                autoComplete="postal-code"
                                className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-x-4 mt-8">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
