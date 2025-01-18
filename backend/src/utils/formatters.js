export const formatHotelData = (doc) => {
    const facilities =
        doc.metadata.facilities?.popular_facilities?.join(", ") || "N/A";
    const roomTypes =
        doc.metadata.roomTypes
            ?.map((room) => `${room.type} (Max: ${room.max_persons} persons)`)
            .join(", ") || "N/A";

    return `
        Type: Hotel
        Name: ${doc.metadata.name || "N/A"}
        Address: ${doc.metadata.address || "N/A"}
        Price: ${
            doc.metadata.price
                ? `${doc.metadata.price.toLocaleString()} VND`
                : "N/A"
        }
        Rating: ${doc.metadata.rating ? `${doc.metadata.rating}/10` : "N/A"}
        Reviews: ${doc.metadata.reviewCount || "N/A"} reviews
        Popular Facilities: ${facilities}
        Room Types: ${roomTypes}
        Check-in: ${doc.metadata.rules?.checkIn || "N/A"}
        Check-out: ${doc.metadata.rules?.checkOut || "N/A"}
        Payment: ${doc.metadata.rules?.paymentMethods?.join(", ") || "N/A"}
    `;
};

export const formatAttractionData = (doc) => {
    const itineraryInfo =
        doc.metadata.itinerary?.stops
            ?.map((stop) => `${stop.title}: ${stop.description}`)
            .join("\n") || "N/A";

    const ticketInfo =
        doc.metadata.tickets
            ?.map((ticket) => `${ticket.type}: ${ticket.price}`)
            .join("\n") || "N/A";

    const inclusionsInfo = doc.metadata.inclusions?.join("\n") || "N/A";

    return `
      Type: Attraction/Activities
      Name: ${doc.metadata.name || "N/A"}
      Description: ${doc.metadata.description || "N/A"}
      Location: ${doc.metadata.location || "N/A"}
      Duration: ${doc.metadata.itinerary?.totalDuration || "N/A"}
      Departure Point: ${doc.metadata.departurePoint || "N/A"}
      
      Itinerary:
      ${itineraryInfo}
      
      Tickets:
      ${ticketInfo}
      
      Inclusions:
      ${inclusionsInfo}
      
      Additional Information:
      ${doc.metadata.additionalInfo || "N/A"}
      
      Cancellation Policy: ${
          doc.metadata.cancellationPolicy || "Free cancellation available"
      }
    `;
};
