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
    const url =  sources;
    const findItemUrl = (name) => {
        const item = url.find((u) => u.name === name);
        return item ? item.url : "#";
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-6 leading-tight">
                    {data.title}
                </h1>
                <p className="text-gray-700 leading-relaxed text-lg max-w-2xl mx-auto">
                    {data.description}
                </p>
            </div>

            {data.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 pb-2 border-b-2 border-blue-100">
                        {section.title}
                    </h2>

                    <div className="grid gap-8">
                        {section.items.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                                <a
                                    href={findItemUrl(item.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xl font-semibold text-blue-600 mb-4 hover:text-blue-800 transition-colors">
                                    {item.name}
                                </a>

                                <div className="space-y-6">
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {item.details.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 bg-gray-50 p-4 rounded-lg">
                                        {item.details.duration && (
                                            <div className="flex items-center space-x-3 text-gray-700">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FontAwesomeIcon
                                                        icon={faClock}
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                                <span>
                                                    {item.details.duration}
                                                </span>
                                            </div>
                                        )}

                                        {item.details.location &&
                                            item.details.location !== "N/A" && (
                                                <div className="flex items-center space-x-3 text-gray-700">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={faLocationDot}
                                                            className="text-green-600"
                                                        />
                                                    </div>
                                                    <span>
                                                        {item.details.location}
                                                    </span>
                                                </div>
                                            )}

                                        {item.details.cost &&
                                            item.details.cost !== "N/A" && (
                                                <div className="flex items-center space-x-3 text-gray-700">
                                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                faHandHoldingDollar
                                                            }
                                                            className="text-yellow-600"
                                                        />
                                                    </div>
                                                    <span>
                                                        {item.details.cost}
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    {item.details.tips &&
                                        item.details.tips.length > 0 && (
                                            <div className="mt-6 bg-blue-50 p-6 rounded-xl">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <FontAwesomeIcon
                                                            icon={faLightbulb}
                                                            className="text-yellow-500"
                                                        />
                                                    </div>
                                                    <span>Travel Tips</span>
                                                </h4>
                                                <ul className="space-y-3">
                                                    {item.details.tips.map(
                                                        (tip, tipIndex) => (
                                                            <li
                                                                key={tipIndex}
                                                                className="text-gray-700 flex items-start">
                                                                <span className="text-blue-500 mr-2">
                                                                    •
                                                                </span>
                                                                <span>
                                                                    {tip}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttractionTemplate;
