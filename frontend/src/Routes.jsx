import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import ChatInterface from "./pages/ChatInterface";

import Header from "./components/Header";

function AppRoutes() {
    const location = useLocation();
    const [showHeader, setShowHeader] = useState(true);

    const hideHeaderPaths = [
        "/sign-in",
        "/sign-up",
        "/chat",
    ];
    const validPaths = ["/", "/about", "/profile", "/contact"];
    const isValidPath = validPaths.includes(location.pathname);

    useEffect(() => {
        if (hideHeaderPaths.includes(location.pathname) || !isValidPath) {
            setShowHeader(false);
        } else {
            setShowHeader(true);
        }
    }, [location.pathname]);

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
