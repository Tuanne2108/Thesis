import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as AuthApi from "../api/AuthApi";
import { FaGlobe } from "react-icons/fa";
import { Popover } from "@headlessui/react";
import { signOutStart, signOutSuccess, signOutFailure } from "../redux/user/UserSlice";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const res = await AuthApi.signOut();
            if (res.status === "success") {
                dispatch(signOutSuccess("Signed out successfully"));
                navigate("/");
            }
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled ? "bg-gray-600 bg-opacity-90 shadow-md" : "bg-transparent"
            }`}
        >
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="text-3xl font-bold">
                    <a href="/" className="flex items-center space-x-2">
                        <span className="text-shadow text-purple-400">TRAVELxAI</span>
                    </a>
                </div>

                <div className="flex items-center space-x-10">
                    <a href="#" className="hover:text-purple-400 text-white text-lg cursor-pointer text-shadow">
                        <span className="bg-overlay">Community</span>
                    </a>
                    {currentUser ? (
                        <Popover className="relative">
                            <Popover.Button className="flex items-center space-x-2 focus:outline-none text-white text-lg cursor-pointer text-shadow">
                                <img className="inline-block h-12 w-12 rounded-full" src={currentUser.avatar} alt="profile" />
                            </Popover.Button>
                            <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </a>
                                    {currentUser.role === "seller" ? (
                                        <a href="/seller-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Dashboard
                                        </a>
                                    ) : null}
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </Popover.Panel>
                        </Popover>
                    ) : (
                        <a href="/sign-in" className="hover:text-purple-600 text-lg font-semibold text-white cursor-pointer text-shadow">
                            <span className="bg-overlay">Sign in →</span>
                        </a>
                    )}
                    <Popover className="relative">
                        <Popover.Button className="flex items-center space-x-2 focus:outline-none text-white text-lg cursor-pointer text-shadow">
                            <FaGlobe className="text-2xl" />
                        </Popover.Button>
                        <Popover.Panel className="absolute right-0 z-10 mt-2 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    English
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Vietnamese
                                </button>
                            </div>
                        </Popover.Panel>
                    </Popover>
                </div>
            </div>
        </header>
    );
}
