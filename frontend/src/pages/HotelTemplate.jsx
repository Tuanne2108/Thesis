import React, { useState } from "react";
import {
    MapPin,
    DollarSign,
    Star,
    Clock,
    Wifi,
    Car,
    Coffee,
    Dumbbell,
    Banknote,
    CreditCard as CardIcon,
    Building,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const HotelTemplate = ({ message, sources }) => {
    const data = message;
    const url = sources;

    const findItemUrl = (name) => {
        const item = url?.find((u) => u.name === name);
        return item ? item.url : "#";
    };

    const [expandedHotels, setExpandedHotels] = useState({});

    const toggleHotelDetails = (hotelIndex) => {
        setExpandedHotels((prev) => ({
            ...prev,
            [hotelIndex]: !prev[hotelIndex],
        }));
    };

    const getFacilityIcon = (facility) => {
        const facilityLower = facility.toLowerCase();
        if (facilityLower.includes("wifi")) return <Wifi className="w-4 h-4" />;
        if (facilityLower.includes("parking"))
            return <Car className="w-4 h-4" />;
        if (facilityLower.includes("restaurant"))
            return <Coffee className="w-4 h-4" />;
        if (facilityLower.includes("gym"))
            return <Dumbbell className="w-4 h-4" />;
        return null;
    };

    const getPaymentIcon = (option) => {
        const optionLower = option.toLowerCase();
        if (optionLower.includes("cash"))
            return <Banknote className="w-4 h-4 mr-2" />;
        if (optionLower.includes("card"))
            return <CardIcon className="w-4 h-4 mr-2" />;
    };

    const renderRating = (rating) => {
        if (!rating) return null;
        const numericRating = parseFloat(rating);
        if (isNaN(numericRating)) return null;

        return (
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{numericRating.toFixed(1)}</span>
            </div>
        );
    };

    if (!data?.sections?.[0]?.items?.length) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-8 shadow-md">
                <div className="text-center">
                    {data.title && (
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
                            {data.title}
                        </h1>
                    )}
                    {data.description && (
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            {data.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6">
                {data.sections[0].items.map((hotel, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div className="flex-1">
                                    {hotel.name && (
                                        <a
                                            href={findItemUrl(hotel.name)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                                            {hotel.name}
                                        </a>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                                        {hotel.address && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {hotel.address}
                                                </span>
                                            </div>
                                        )}
                                        {renderRating(hotel.rating)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {hotel.price && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold bg-gray-100 text-gray-700">
                                            {hotel.price}
                                        </span>
                                    )}
                                    {(hotel.facilities?.length > 0 ||
                                        hotel.roomTypes?.length > 0 ||
                                        hotel.checkIn ||
                                        hotel.checkOut ||
                                        hotel.paymentOptions?.length > 0) && (
                                        <button
                                            onClick={() =>
                                                toggleHotelDetails(index)
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            {expandedHotels[index] ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {expandedHotels[index] && (
                                <div className="space-y-6 mt-6">
                                    {hotel.facilities?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                                Facilities
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {hotel.facilities.map(
                                                    (facility, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                                                            {getFacilityIcon(
                                                                facility
                                                            )}
                                                            <span className="ml-2">
                                                                {facility}
                                                            </span>
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {hotel.roomTypes?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                                Room Types
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {hotel.roomTypes.map(
                                                    (room, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                                                            <Building className="w-4 h-4 mr-2" />
                                                            {room}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(hotel.checkIn || hotel.checkOut) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {hotel.checkIn && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        Check-in:{" "}
                                                        {hotel.checkIn}
                                                    </span>
                                                </div>
                                            )}
                                            {hotel.checkOut && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        Check-out:{" "}
                                                        {hotel.checkOut}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {hotel.paymentOptions?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                                Payment Options
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {hotel.paymentOptions.map(
                                                    (option, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                                                            {getPaymentIcon(
                                                                option
                                                            )}
                                                            {option}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelTemplate;
