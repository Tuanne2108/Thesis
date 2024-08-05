import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notification } from "antd";
import {
    faGoogle,
    faFacebook,
    faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
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

    const handleXTwitterClick = async () => {
        try {
            const provider = new TwitterAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const response = await AuthApi.xTwitterSignIn();
            dispatch(signInSuccess(response.data));
            navigate("/");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center">Or continue with</h2>
            <div className="flex space-x-4">
                <button
                    onClick={handleGoogleClick}
                    className="bg-red-500 text-white p-3 rounded-md">
                    <FontAwesomeIcon icon={faGoogle} size="lg" />
                </button>
                <button
                    onClick={handleFacebookClick}   
                    className="bg-blue-600 text-white p-3 rounded-md">
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                </button>
                <button
                    onClick={handleXTwitterClick}
                    className="bg-black text-white p-3 rounded-md">
                    <FontAwesomeIcon icon={faXTwitter} size="lg" />
                </button>
            </div>
        </div>
    );
}
