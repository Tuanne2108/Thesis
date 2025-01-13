// src/utils/hotelUtils.js

/**
 * Extracts and categorizes primary amenities from hotel data
 * @param {string[]} parts - Array of hotel data parts
 * @returns {string[]} Array of primary amenities
 */
export const extractPrimaryAmenities = (parts) => {
    const amenityKeywords = [
        'wifi', 'parking', 'breakfast', 'restaurant',
        'pool', 'gym', 'spa', 'air conditioning',
        'room service', '24-hour', 'front desk'
    ];

    return parts
        .join(' ')
        .toLowerCase()
        .split(',')
        .map(part => part.trim())
        .filter(part => 
            amenityKeywords.some(keyword => 
                part.includes(keyword)
            )
        )
        .map(amenity => 
            amenity.charAt(0).toUpperCase() + 
            amenity.slice(1).trim()
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
        .join(' ')
        .split(',')
        .map(part => part.trim())
        .filter(part => 
            part.length > 2 && // Filter out very short strings
            !primaryAmenities.has(part) &&
            !part.includes('VND') && // Filter out price information
            !part.includes('/10') && // Filter out ratings
            !part.match(/^\d+/) // Filter out numeric starts
        )
        .map(amenity => 
            amenity.charAt(0).toUpperCase() + 
            amenity.slice(1).trim()
        );
};

/**
 * Formats hotel data into a structured response object
 * @param {Object} hotel - Raw hotel data
 * @returns {Object} Formatted hotel response
 */
export const formatHotelResponse = (hotel) => {
    // Handle cases where hotel data might be incomplete
    if (!hotel) return null;

    return {
        name: hotel.name || 'N/A',
        rating: hotel.rating ? `${hotel.rating}/10` : 'N/A',
        price: hotel.price 
            ? `${parseInt(hotel.price).toLocaleString()} VND` 
            : 'N/A',
        features: (hotel.features || [])
            .filter(feature => feature && feature.length > 0),
        amenities: {
            primary: (hotel.primaryAmenities || [])
                .filter(amenity => amenity && amenity.length > 0),
            additional: (hotel.additionalAmenities || [])
                .filter(amenity => amenity && amenity.length > 0)
        },
        // Add optional fields that might be useful
        address: hotel.address || 'N/A',
        reviewCount: hotel.reviewCount || 0,
        checkIn: hotel.checkIn || 'N/A',
        checkOut: hotel.checkOut || 'N/A',
        roomTypes: hotel.roomTypes || []
    };
};

/**
 * Validates hotel data structure
 * @param {Object} hotel - Hotel data to validate
 * @returns {boolean} Whether the hotel data is valid
 */
export const validateHotelData = (hotel) => {
    const requiredFields = ['name', 'price', 'rating'];
    return requiredFields.every(field => 
        hotel && hotel[field] !== undefined && hotel[field] !== null
    );
};

/**
 * Groups amenities by category for better organization
 * @param {string[]} amenities - Array of amenities
 * @returns {Object} Categorized amenities
 */
export const categorizeAmenities = (amenities) => {
    const categories = {
        comfort: ['air conditioning', 'heating', 'soundproof'],
        connectivity: ['wifi', 'internet', 'tv'],
        dining: ['restaurant', 'breakfast', 'bar', 'coffee'],
        wellness: ['spa', 'gym', 'pool', 'fitness'],
        services: ['room service', 'front desk', 'concierge'],
        facilities: ['parking', 'elevator', 'garden'],
        other: []
    };

    return amenities.reduce((acc, amenity) => {
        const lowercaseAmenity = amenity.toLowerCase();
        const category = Object.keys(categories).find(cat => 
            categories[cat].some(keyword => 
                lowercaseAmenity.includes(keyword)
            )
        ) || 'other';

        acc[category] = acc[category] || [];
        acc[category].push(amenity);
        return acc;
    }, {});
};

// Export all utility functions
export const hotelUtils = {
    extractPrimaryAmenities,
    extractAdditionalAmenities,
    formatHotelResponse,
    validateHotelData,
    categorizeAmenities
};

export default hotelUtils;