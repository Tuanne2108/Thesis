import React from "react";
import AttractionTemplate from "./AttractionTemplate";
// import HotelTemplate from './HotelTemplate';

const detectTemplateType = (data) => {
    try {
        if (
            data.sections?.some((section) =>
                section.items?.some(
                    (item) => item.details?.duration || item.details?.tips
                )
            )
        ) {
            return "attraction";
        }
        if (
            data.rooms ||
            data.amenities ||
            data.properties?.some((p) => p.rooms)
        ) {
            return "hotel";
        }

        return null;
    } catch (e) {
        return null;
    }
};

const TemplateRenderer = ({ data, sources }) => {
    const templateType = detectTemplateType(data);

    switch (templateType) {
        case "attraction":
            return <AttractionTemplate message={data} sources={sources} />;
        // case 'hotel':
        //   return <HotelTemplate message={data} />;
        default:
            return null;
    }
};

const tryParseJSON = (text) => {
    try {
        const data = JSON.parse(text);
        if (
            data.title &&
            data.description &&
            ((data.sections && Array.isArray(data.sections)) ||
                (data.rooms && Array.isArray(data.rooms)) ||
                (data.properties && Array.isArray(data.properties)))
        ) {
            return data;
        }
    } catch (e) {
        return null;
    }
    return null;
};

const renderMessageContent = (message) => {
    const jsonData = tryParseJSON(message.text);
    const sources = message.source || [];

    if (jsonData) {
        return (
            <div className="w-full max-w-4xl">
                <TemplateRenderer data={jsonData} sources={sources} />
            </div>
        );
    }

    return (
        <p
            className={`${
                message.role === "user" ? "text-gray-600" : "text-blue-600"
            }`}>
            {message.text}
        </p>
    );
};

export { tryParseJSON, renderMessageContent, TemplateRenderer };