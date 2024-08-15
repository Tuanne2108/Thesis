/* eslint-disable react/prop-types */
import { Flex, Progress } from "antd";
import { useState, useRef, useEffect } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export const ImageUploader = ({
    currentUser,
    setFormData,
    formData,
    clearUploadFlags,
}) => {
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePercent, setFilePercent] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentUser.avatar || "");

    useEffect(() => {
        if (file) {
            handleUploadFile(file);
        }
    }, [file]);

    useEffect(() => {
        if (clearUploadFlags) {
            setUploadComplete(false);
            setUploadError(false);
        }
    }, [clearUploadFlags]);

    const handleUploadFile = async (file) => {
        const storage = getStorage();
        const fileName = `avatar/${file.name}`;
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
                    setPreviewUrl(downloadUrl);
                    setFormData({ ...formData, avatar: downloadUrl });
                    setUploading(false);
                    setUploadComplete(true);
                });
            }
        );
    };

    return (
        <div className="flex flex-col items-center">
            {previewUrl ? (
                <img
                    className="object-cover h-40 w-40 ring-2 ring-black rounded-full"
                    src={previewUrl}
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
                    className="mt-3 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                    Change Photo
                </button>
            ) : (
                <Flex className="mt-3" wrap="true" gap="small">
                    <Progress type="circle" percent={filePercent} size={50} />
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
                    Error uploading image. Please ensure the file is less than
                    2MB and try again.
                </div>
            )}
        </div>
    );
};
