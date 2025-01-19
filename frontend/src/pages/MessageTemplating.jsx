import React from "react";
import AttractionTemplate from "./AttractionTemplate";
import HotelTemplate from "./HotelTemplate";

const detectTemplateType = (data) => {
    try {
        // Check for attraction template
        if (
            data.sections?.some((section) =>
                section.items?.some((item) => {
                    const details = item.details;
                    return (
                        details?.cost || details?.itinerary || details?.duration
                    );
                })
            )
        ) {
            return "attraction";
        }

        // Check for hotel template
        if (data.title?.toLowerCase().includes('hotel')) {
            return "hotel";
        }

        return null;
    } catch (e) {
        console.error("Error detecting template type:", e);
        return null;
    }
};

const tryParseJSON = (text) => {
    if (typeof text !== "string") {
        return null;
    }

    if (text.startsWith("[") && text.includes("undefined")) {
        try {
            const cleanText = text.replace("undefined: ", "");
            const items = cleanText
                .replace("[", "")
                .replace("]", "")
                .split("•")
                .filter((item) => item.trim())
                .map((item) => item.trim());

            return {
                title: "Recommended Tours",
                description: "Here are the recommended tours:",
                sections: [
                    {
                        title: "Available Tours",
                        items: items.map((item) => ({
                            name: item,
                            details: {
                                description: "",
                            },
                        })),
                    },
                ],
            };
        } catch (e) {
            console.error("Array parsing error:", e);
            return null;
        }
    }


    if (text.trim().startsWith("{")) {
        try {
            const data = JSON.parse(text);
            console.log('data:', data);
            if (
                data &&
                typeof data === "object" &&
                data.title &&
                data.description &&
                data.sections &&
                Array.isArray(data.sections)
            ) {
                return data;
            }
        } catch (e) {
            console.error("JSON parsing error:", e);
            return null;
        }
    }

    return null;
};

const TemplateRenderer = ({ data, sources }) => {
    const templateType = detectTemplateType(data);

    switch (templateType) {
        case "attraction":
            return <AttractionTemplate message={data} sources={sources} />;
        case "hotel":
            return <HotelTemplate message={data} sources={sources} />;
        default:
            console.log("No matching template found for data:", data);
            return null;
    }
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
