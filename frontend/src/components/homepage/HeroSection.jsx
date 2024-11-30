import heroBg from "../../assets/hero-bg.jpg";
import { useNavigate } from "react-router-dom";
export const HeroSection = () => {
    const navigate = useNavigate();
    const directToChat = () => {
        navigate("/chat");
    };
    return (
        <div className="relative">
            <img src={heroBg} className="w-full h-screen object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-black bg-opacity-10">
                <h1 className="text-5xl font-extrabold text-purple-600">
                    Explore the Uncharted
                </h1>
                <p className="text-xl text-gray-100 max-w-xl text-center italic">
                    Your adventure starts here. Discover destinations tailored
                    to your unique preferences with our AI-powered journey
                    planner.
                </p>
                <div className="space-x-4">
                    <button
                        className="bg-purple-500 text-black py-3 px-6 rounded-lg text-lg hover:bg-purple-400 transition"
                        onClick={directToChat}>
                        🗺️ Start Your Journey
                    </button>
                </div>
            </div>
        </div>
    );
};
