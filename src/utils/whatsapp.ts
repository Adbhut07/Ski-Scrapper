// ==========================================
// WhatsApp URL Generator
// ==========================================

import { FlightOffer, FlightSearchParams, BookingUserDetails } from "@/types/flight";
import { siteConfig } from "@/config/site";
import { formatINR, formatDuration, formatTime } from "./format";

/**
 * Generate a WhatsApp redirect URL with a pre-filled booking message.
 */
export function generateWhatsAppURL(
  flight: FlightOffer,
  searchParams: FlightSearchParams,
  userDetails?: BookingUserDetails
): string {
  const whatsappNumber = siteConfig.whatsappNumber;
  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];

  const stops =
    outbound.segments.length - 1 === 0
      ? "Non-stop"
      : `${outbound.segments.length - 1} stop(s)`;

  let message = `✈️ *Flight Booking Request*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (userDetails) {
    message += `👤 *Passenger Details*\n`;
    message += `Name: ${userDetails.name}\n`;
    message += `Phone: ${userDetails.phone}\n\n`;
  }

  message += `🛫 *Route:* ${searchParams.origin} → ${searchParams.destination}\n`;
  message += `📅 *Date:* ${searchParams.departureDate}\n`;
  if (searchParams.returnDate) {
    message += `🔄 *Return:* ${searchParams.returnDate}\n`;
  }
  message += `👥 *Passengers:* ${searchParams.adults} Adult(s)`;
  if (searchParams.children > 0) {
    message += `, ${searchParams.children} Child(ren)`;
  }
  message += `\n`;
  message += `💺 *Class:* ${searchParams.travelClass.replace("_", " ")}\n\n`;

  message += `✈️ *Flight Details*\n`;
  message += `Airline: ${firstSegment.carrierName} (${firstSegment.carrierCode})\n`;
  message += `Flight: ${firstSegment.carrierCode}${firstSegment.flightNumber}\n`;
  message += `Departure: ${formatTime(firstSegment.departure.at)} (${firstSegment.departure.iataCode})\n`;
  message += `Arrival: ${formatTime(lastSegment.arrival.at)} (${lastSegment.arrival.iataCode})\n`;
  message += `Duration: ${formatDuration(outbound.duration)}\n`;
  message += `Stops: ${stops}\n\n`;

  const originalPrice = flight.price.markedUpTotal;
  const discountedPrice = Math.ceil(originalPrice * 0.90);
  message += `💰 *Price: ~${formatINR(originalPrice)}~ ${formatINR(discountedPrice)}* (10% OFF)\n`;
  message += `✅ _Inclusive of all taxes_\n\n`;

  message += `📲 Sent via ${siteConfig.name}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
