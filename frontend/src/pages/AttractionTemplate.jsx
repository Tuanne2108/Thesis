import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faLocationDot,
    faHandHoldingDollar,
    faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const AttractionTemplate = ({ message, sources }) => {
    const data = message;
    const url = sources;

    const findItemUrl = (name) => {
        const item = url.find((u) => u.name === name);
        return item ? item.url : "#";
    };

    const findItemImages = (name) => {
        const item = url.find((u) => u.name === name);
        return item?.images || [];
    };

    const formatTicket = (tickets) => {
        if (!tickets) return null;

        const formatPrice = (price) => {
            return price ? price.replace("US$", "$") : null;
        };

        const ticketInfo = [];
        if (tickets.adult && tickets.adult !== "N/A") {
            ticketInfo.push(`Adult: ${formatPrice(tickets.adult)}`);
        }
        if (tickets.child && tickets.child !== "N/A") {
            ticketInfo.push(`Child: ${formatPrice(tickets.child)}`);
        }
        if (tickets.infant && tickets.infant !== "N/A") {
            ticketInfo.push(`Infant: ${formatPrice(tickets.infant)}`);
        }

        return ticketInfo.length > 0 ? ticketInfo : null;
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-6 leading-tight">
                    {data.title}
                </h1>
                <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
                    {data.description}
                </p>
            </div>

            {data.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 pb-2 border-b-2 border-blue-100">
                        {section.title}
                    </h2>

                    <div className="grid gap-8">
                        {section.items.map((item, itemIndex) => {
                            const itemImages = findItemImages(item.name);
                            const ticketInfo = formatTicket(item.details.tickets);

                            return (
                                <div key={itemIndex} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                                    {itemImages.length > 0 && (
                                        <div className="mb-12">
                                            <div className="relative h-96 mb-4 overflow-hidden rounded-xl">
                                                <img
                                                    src={itemImages[0]}
                                                    alt={`Main ${item.name}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {itemImages.length > 1 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                    {itemImages.slice(1).map((image, index) => (
                                                        <div key={index} className="relative h-32 overflow-hidden rounded-lg">
                                                            <img
                                                                src={image}
                                                                alt={`${item.name} thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <a
                                        href={findItemUrl(item.name)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl font-semibold text-blue-600 mb-4 hover:text-blue-800 transition-colors inline-block">
                                        {item.name}
                                    </a>

                                    <div className="space-y-6">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {item.details.description}
                                        </p>

                                        <div className="flex flex-wrap gap-6 mt-6">
                                            {item.details.duration && item.details.duration !== "N/A" && (
                                                <div className="flex items-center space-x-3 text-gray-700 bg-blue-50 px-4 py-2 rounded-lg">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={faClock}
                                                            className="text-blue-600"
                                                        />
                                                    </div>
                                                    <span>{item.details.duration}</span>
                                                </div>
                                            )}

                                            {item.details.location && item.details.location !== "N/A" && (
                                                <div className="flex items-center space-x-3 text-gray-700 bg-green-50 px-4 py-2 rounded-lg">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={faLocationDot}
                                                            className="text-green-600"
                                                        />
                                                    </div>
                                                    <span>{item.details.location}</span>
                                                </div>
                                            )}

                                            {ticketInfo && (
                                                <div className="flex items-center space-x-3 text-gray-700 bg-yellow-50 px-4 py-2 rounded-lg">
                                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={faHandHoldingDollar}
                                                            className="text-yellow-600"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {ticketInfo.map((info, index) => (
                                                            <span key={index} className="whitespace-nowrap">
                                                                {info}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {item.details.tips && item.details.tips.length > 0 && (
                                            <div className="mt-6 bg-blue-50 p-6 rounded-xl">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={faLightbulb}
                                                            className="text-yellow-500"
                                                        />
                                                    </div>
                                                    <span>Notice</span>
                                                </h4>
                                                <ul className="space-y-3">
                                                    {item.details.tips.map((tip, tipIndex) => (
                                                        <li key={tipIndex} className="text-gray-700 flex items-start">
                                                            <span className="text-blue-500 mr-2">•</span>
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttractionTemplate;