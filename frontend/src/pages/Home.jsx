import React from "react";
import { HeroSection } from "../components/homepage/HeroSection";
import { FeaturedCategories } from "../components/homepage/FeaturedCategories";
import { NewArrivals } from "../components/homepage/NewArrivals";
import { BrandStory } from "../components/homepage/BrandStory";
import { SpecialOffers } from "../components/homepage/SpecialOffers";
import { SocialMediaFeed } from "../components/homepage/SocialMediaFeed";
import { Footer } from "../components/homepage/Footer";

const newArrivals = [
    {
        id: 1,
        name: "Classic Sneakers",
        price: 59.99,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Leather Boots",
        price: 89.99,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 74.99,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 4,
        name: "Formal Shoes",
        price: 99.99,
        image: "https://via.placeholder.com/150",
    },
];

const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <FeaturedCategories />
            <NewArrivals products={newArrivals} />
            <BrandStory />
            <SpecialOffers />
            <SocialMediaFeed />
            <Footer />
        </div>
    );
};

export default HomePage;
