export const extractPrimaryAmenities = (parts) => {
    const amenityKeywords = [
        "wifi",
        "parking",
        "breakfast",
        "restaurant",
        "pool",
        "gym",
        "spa",
        "air conditioning",
        "room service",
        "24-hour",
        "front desk",
    ];

    return parts
        .join(" ")
        .toLowerCase()
        .split(",")
        .map((part) => part.trim())
        .filter((part) =>
            amenityKeywords.some((keyword) => part.includes(keyword))
        )
        .map(
            (amenity) =>
                amenity.charAt(0).toUpperCase() + amenity.slice(1).trim()
        );
};

/**
 * Extracts and categorizes additional amenities from hotel data
 * @param {string[]} parts - Array of hotel data parts
 * @returns {string[]} Array of additional amenities
 */
export const extractAdditionalAmenities = (parts) => {
    const primaryAmenities = new Set(extractPrimaryAmenities(parts));

    return parts
        .join(" ")
        .split(",")
        .map((part) => part.trim())
        .filter(
            (part) =>
                part.length > 2 &&
                !primaryAmenities.has(part) &&
                !part.includes("VND") &&
                !part.includes("/10") &&
                !part.match(/^\d+/)
        )
        .map(
            (amenity) =>
                amenity.charAt(0).toUpperCase() + amenity.slice(1).trim()
        );
};

export const formatHotelResponse = (hotel) => {
    if (!hotel) return null;

    return {
        name: hotel.name || "N/A",
        rating: hotel.rating ? `${hotel.rating}/10` : "N/A",
        price: hotel.price
            ? `${parseInt(hotel.price).toLocaleString()} VND`
            : "N/A",
        features: (hotel.features || []).filter(
            (feature) => feature && feature.length > 0
        ),
        amenities: {
            primary: (hotel.primaryAmenities || []).filter(
                (amenity) => amenity && amenity.length > 0
            ),
            additional: (hotel.additionalAmenities || []).filter(
                (amenity) => amenity && amenity.length > 0
            ),
        },
        address: hotel.address || "N/A",
        reviewCount: hotel.reviewCount || 0,
        checkIn: hotel.checkIn || "N/A",
        checkOut: hotel.checkOut || "N/A",
        roomTypes: hotel.roomTypes || [],
    };
};

export const validateHotelData = (hotel) => {
    const requiredFields = ["name", "price", "rating"];
    return requiredFields.every(
        (field) => hotel && hotel[field] !== undefined && hotel[field] !== null
    );
};

export const categorizeAmenities = (amenities) => {
    const categories = {
        comfort: ["air conditioning", "heating", "soundproof"],
        connectivity: ["wifi", "internet", "tv"],
        dining: ["restaurant", "breakfast", "bar", "coffee"],
        wellness: ["spa", "gym", "pool", "fitness"],
        services: ["room service", "front desk", "concierge"],
        facilities: ["parking", "elevator", "garden"],
        other: [],
    };

    return amenities.reduce((acc, amenity) => {
        const lowercaseAmenity = amenity.toLowerCase();
        const category =
            Object.keys(categories).find((cat) =>
                categories[cat].some((keyword) =>
                    lowercaseAmenity.includes(keyword)
                )
            ) || "other";

        acc[category] = acc[category] || [];
        acc[category].push(amenity);
        return acc;
    }, {});
};

export const hotelUtils = {
    extractPrimaryAmenities,
    extractAdditionalAmenities,
    formatHotelResponse,
    validateHotelData,
    categorizeAmenities,
};

export default hotelUtils;
