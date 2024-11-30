import React, { useEffect } from "react";
import { Features } from "../components/homepage/Features";
import { HowItWorks } from "../components/homepage/HowItWorks";
import { Partners } from "../components/homepage/Partners";
import { Footer } from "../components/homepage/Footer";
import { HeroSection } from "../components/homepage/HeroSection";
import { Testimonial } from "../components/homepage/Testimonials";
import { JourneyInspiration } from "../components/homepage/JourneyInspiration";
import { CustomizedItineraries } from "../components/homepage/CustomizedItineraries";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out-sine",
            once: false,
        });
    }, []);

    return (
        <div>
            <div>
                <HeroSection />
            </div>
            <div>
                <HowItWorks />
            </div>
            <div>
                <Features />
            </div>
            <div>
                <Testimonial />
            </div>
            <div>
                <Partners />
            </div>
            <div>
                <JourneyInspiration />
            </div>
            <div>
                <CustomizedItineraries />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default HomePage;
