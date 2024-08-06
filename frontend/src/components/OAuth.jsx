import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notification } from "antd";
import {
    faGoogle,
    faFacebook,
    faApple,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from "firebase/auth";
import { app } from "../firebase";
import * as AuthApi from "../api/AuthApi";
import { signInSuccess, signInFailure } from "../redux/user/UserSlice";

export default function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth(app);

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                username: user.displayName,
                email: user.email,
                photo: user.photoURL,
            };

            const response = await AuthApi.googleSignIn(userData);
            if (response.status === "success") {
                dispatch(signInSuccess(response.data));
                notification.success({
                    placement: "top",
                    message: "Success",
                    description: "Login successful",
                });
                navigate("/");
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            dispatch(signInFailure(error.message));
        }
    };

    const handleFacebookClick = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const response = await AuthApi.facebookSignIn();
            dispatch(signInSuccess(response.data));
            navigate("/");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    const handleAppleClick = async () => {};

    return (
        <div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleGoogleClick}
                    className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FontAwesomeIcon
                        icon={faGoogle}
                        className="mr-2 text-red-500"
                    />
                    Google
                </button>
                <button
                    onClick={handleFacebookClick}
                    className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FontAwesomeIcon
                        icon={faFacebook}
                        className="mr-2 text-blue-500"
                    />
                    Facebook
                </button>
                <button
                    onClick={handleAppleClick}
                    className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FontAwesomeIcon icon={faApple} className="mr-2" />
                    Apple
                </button>
            </div>
        </div>
    );
}
