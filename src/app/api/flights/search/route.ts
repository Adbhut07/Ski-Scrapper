// ==========================================
// Flight Search API Route Handler
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { searchFlights, GoogleFlightItinerary } from "@/lib/amadeus";
import { applyMarkup } from "@/config/markup";
import {
  FlightOffer,
  FlightSearchParams,
  FlightSearchResponse,
} from "@/types/flight";

/**
 * Interleave flights by airline using round-robin so results
 * show a mix of airlines instead of grouping by carrier.
 */
function interleaveByAirline(flights: FlightOffer[]): FlightOffer[] {
  const groups: Record<string, FlightOffer[]> = {};
  for (const flight of flights) {
    const carrier = flight.itineraries[0].segments[0].carrierCode;
    if (!groups[carrier]) groups[carrier] = [];
    groups[carrier].push(flight);
  }

  const queues = Object.values(groups).map((g) =>
    g.sort((a, b) => a.price.markedUpTotal - b.price.markedUpTotal)
  );

  const result: FlightOffer[] = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    for (const queue of queues) {
      if (queue.length > 0) {
        result.push(queue.shift()!);
        remaining = remaining || queue.length > 0;
      }
    }
  }

  return result;
}

/**
 * Extract carrier code from flight number like "6E 6022" → "6E"
 */
function extractCarrierCode(flightNumber: string): string {
  const parts = flightNumber.trim().split(/\s+/);
  return parts[0] || flightNumber;
}

/**
 * Parse Google Flights time format "2026-2-26 15:00" to ISO string
 */
function parseFlightTime(timeStr: string): string {
  if (!timeStr) return "";
  // Handle format "2026-2-26 15:00" → ISO
  try {
    const [datePart, timePart] = timeStr.split(" ");
    const [year, month, day] = datePart.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}:00`;
  } catch {
    return timeStr;
  }
}

/**
 * Convert duration in minutes to ISO 8601 duration format
 * e.g., 140 → "PT2H20M"
 */
function minutesToIsoDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let d = "PT";
  if (h > 0) d += `${h}H`;
  if (m > 0) d += `${m}M`;
  return d || "PT0M";
}

/**
 * Process a Google Flights itinerary into our FlightOffer format.
 */
function processGoogleFlightOffer(
  itinerary: GoogleFlightItinerary,
  index: number,
  totalPassengers: number
): FlightOffer {
  const baseTotal = itinerary.price;
  const markedUpTotal = applyMarkup(baseTotal, totalPassengers);

  const carrierCode = itinerary.flights[0]
    ? extractCarrierCode(itinerary.flights[0].flight_number)
    : "XX";

  // Build baggage info
  let baggageInfo: FlightOffer["baggage"] = undefined;
  if (itinerary.bags) {
    const parts: string[] = [];
    if (itinerary.bags.carry_on) parts.push(`${itinerary.bags.carry_on} carry-on`);
    if (itinerary.bags.checked) parts.push(`${itinerary.bags.checked} checked`);
    if (parts.length > 0) {
      baggageInfo = { included: parts.join(", ") };
    }
  }

  return {
    id: `gf-${index}-${carrierCode}-${baseTotal}`,
    itineraries: [
      {
        duration: minutesToIsoDuration(itinerary.duration.raw),
        segments: itinerary.flights.map((segment) => ({
          departure: {
            iataCode: segment.departure_airport.airport_code,
            at: parseFlightTime(segment.departure_airport.time),
          },
          arrival: {
            iataCode: segment.arrival_airport.airport_code,
            at: parseFlightTime(segment.arrival_airport.time),
          },
          carrierCode: extractCarrierCode(segment.flight_number),
          carrierName: segment.airline,
          flightNumber: segment.flight_number.replace(/\s+/g, "").replace(carrierCode, ""),
          duration: minutesToIsoDuration(segment.duration.raw),
          aircraft: segment.aircraft,
          numberOfStops: 0,
        })),
      },
    ],
    price: {
      currency: "INR",
      baseTotal,
      markedUpTotal,
      perAdult: Math.ceil(markedUpTotal / totalPassengers),
    },
    travelerPricings: [
      {
        travelerType: "ADULT",
        price: baseTotal,
      },
    ],
    validatingAirlineCodes: [carrierCode],
    numberOfBookableSeats: 9, // Not provided by Google Flights
    baggage: baggageInfo,
    airlineLogo: itinerary.airline_logo, // Direct logo URL from Google
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: FlightSearchParams = await request.json();

    // Validate required fields
    if (
      !body.origin ||
      !body.destination ||
      !body.departureDate ||
      !body.adults
    ) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Missing required fields: origin, destination, departureDate, adults",
        } as FlightSearchResponse,
        { status: 400 }
      );
    }

    // Validate IATA codes (3 letters)
    const iataRegex = /^[A-Z]{3}$/;
    if (
      !iataRegex.test(body.origin.toUpperCase()) ||
      !iataRegex.test(body.destination.toUpperCase())
    ) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: "Invalid airport codes. Please use valid 3-letter IATA codes.",
        } as FlightSearchResponse,
        { status: 400 }
      );
    }

    const googleResponse = await searchFlights(body);
    const totalPassengers = body.adults + (body.children || 0);

    // Combine topFlights and otherFlights — handle both response formats
    const d = googleResponse.data;
    const topFlights = d?.topFlights || d?.itineraries?.topFlights || [];
    const otherFlights = d?.otherFlights || d?.itineraries?.otherFlights || [];
    const allItineraries = [...topFlights, ...otherFlights];

    if (allItineraries.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { count: 0, currency: "INR" },
      } as FlightSearchResponse);
    }

    const MIN_PRICE_INR = 2500;

    const processedOffers = allItineraries
      .map((itinerary, index) =>
        processGoogleFlightOffer(itinerary, index, totalPassengers)
      )
      .filter((offer) => offer.price.baseTotal >= MIN_PRICE_INR);

    // Interleave flights by airline for mixed results
    const interleaved = interleaveByAirline(processedOffers);

    // Extract unique airlines for filter
    const airlines: Record<string, string> = {};
    processedOffers.forEach((offer) => {
      const code = offer.itineraries[0].segments[0].carrierCode;
      const name = offer.itineraries[0].segments[0].carrierName;
      airlines[code] = name;
    });

    return NextResponse.json({
      success: true,
      data: interleaved,
      meta: {
        count: interleaved.length,
        currency: "INR",
        airlines,
      },
    } as FlightSearchResponse);
  } catch (error) {
    console.error("Flight search error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        success: false,
        data: [],
        error: errorMessage,
      } as FlightSearchResponse,
      { status: 500 }
    );
  }
}
