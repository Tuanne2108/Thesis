const HOTEL_KEYWORDS = [
    "hotel",
    "room",
    "accommodation",
    "stay",
    "lodge",
    "booking",
    "check-in",
    "check out",
];

const ATTRACTION_KEYWORDS = [
    "attraction",
    "visit",
    "sight",
    "tour",
    "place",
    "activity",
    "see",
    "do",
    "have",
];

export const determineQueryType = (question) => {
    question = question.toLowerCase();
    const isHotelRelated = HOTEL_KEYWORDS.some((keyword) =>
        question.includes(keyword)
    );
    const isAttractionRelated = ATTRACTION_KEYWORDS.some((keyword) =>
        question.includes(keyword)
    );

    if (isHotelRelated && isAttractionRelated) return "general";
    if (isHotelRelated) return "hotel";
    if (isAttractionRelated) return "attraction";
    return "general";
};
