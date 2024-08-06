import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as AuthApi from "../api/AuthApi";
import {
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from "../redux/user/UserSlice";
import { Popover } from "@headlessui/react";
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaGlobe,
    FaSun,
    FaMoon,
} from "react-icons/fa";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [darkMode, setDarkMode] = useState(false);

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

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };
    return (
        <header className="sticky top-0 z-50 bg-gray-800 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <a href="/" className="flex items-center space-x-2">
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/023/606/821/small/shoes-logo-design-sneakers-logo-design-vector.jpg"
                            alt="Sneaker Logo"
                            className="w-16 h-16"
                        />
                    </a>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <a href="#" className="hover:text-yellow-400">
                        New Arrivals
                    </a>
                    <a href="#" className="hover:text-yellow-400">
                        Collections
                    </a>
                    <a href="/about" className="hover:text-yellow-400">
                        About Us
                    </a>
                    <a href="/contact" className="hover:text-yellow-400">
                        Contact
                    </a>
                </nav>

                {/* Search and Icons */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search sneakers..."
                            className="bg-gray-700 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring focus:ring-yellow-500"
                        />
                        <FaSearch className="absolute top-3 left-3 text-gray-400" />
                    </div>

                    {/* Icons */}
                    <div className="flex space-x-4">
                        <a
                            href="/cart"
                            className={`hover:text-yellow-400 ${
                                darkMode ? "text-white" : "text-black"
                            }`}>
                            <FaShoppingCart size={20} />
                        </a>
                        <a
                            href="/wishlist"
                            className={`hover:text-red-600 ${
                                darkMode ? "text-white" : "text-black"
                            }`}>
                            <FaHeart size={20} />
                        </a>
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        {currentUser ? (
                            <Popover className="relative">
                                <Popover.Button className="flex items-center space-x-2 focus:outline-none">
                                    <img
                                        className="inline-block h-10 w-10 rounded-full"
                                        src={currentUser.avatar}
                                        alt="profile"
                                    />
                                </Popover.Button>
                                <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <a
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </a>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Log out
                                        </button>
                                    </div>
                                </Popover.Panel>
                            </Popover>
                        ) : (
                            <a
                                href="/sign-in"
                                className={`text-sm font-semibold leading-6 ${
                                    darkMode ? "text-yellow-600" : "text-black"
                                }`}>
                                Log in <span aria-hidden="true">&rarr;</span>
                            </a>
                        )}
                    </div>

                    {/* Language Selector */}
                    <Popover className="relative">
                        <Popover.Button className="flex items-center space-x-2 focus:outline-none">
                            <FaGlobe className="text-xl" />
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

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="focus:outline-none">
                        {darkMode ? (
                            <FaSun className="text-yellow-400 text-xl" />
                        ) : (
                            <FaMoon className="text-gray-500 text-xl" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden flex items-center px-3 py-2 border rounded text-gray-400 border-gray-700 hover:text-white hover:border-white">
                    <svg
                        className="fill-current h-3 w-3"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <nav className="bg-gray-700 space-y-2 p-4">
                    <a href="/" className="block hover:text-yellow-400">
                        Home
                    </a>
                    <a href="#" className="block hover:text-yellow-400">
                        Shop
                    </a>
                    <a href="#" className="block hover:text-yellow-400">
                        Collections
                    </a>
                    <a href="#" className="block hover:text-yellow-400">
                        About Us
                    </a>
                    <a href="#" className="block hover:text-yellow-400">
                        Contact
                    </a>
                </nav>
            </div>
        </header>
    );
}
