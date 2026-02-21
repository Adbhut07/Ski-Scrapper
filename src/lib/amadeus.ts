// ==========================================
// Google Flights API via RapidAPI (Server-Side Only)
// ==========================================

import { FlightSearchParams } from "@/types/flight";

const RAPIDAPI_HOST = "google-flights2.p.rapidapi.com";
const SEARCH_URL = `https://${RAPIDAPI_HOST}/api/v1/searchFlights`;

export interface GoogleFlightsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    // API may return either structure
    topFlights?: GoogleFlightItinerary[];
    otherFlights?: GoogleFlightItinerary[];
    itineraries?: {
      topFlights?: GoogleFlightItinerary[];
      otherFlights?: GoogleFlightItinerary[];
    };
  };
}

export interface GoogleFlightItinerary {
  departure_time: string; // "26-02-2026 03:00 PM"
  arrival_time: string;
  duration: {
    raw: number; // minutes
    text: string; // "2 hr 20 min"
  };
  flights: GoogleFlightSegment[];
  layovers: GoogleLayover[] | null;
  bags: {
    carry_on: number | null;
    checked: number | null;
  };
  price: number;
  stops: number;
  airline_logo: string;
  booking_token: string;
  carbon_emissions?: {
    difference_percent: number;
    CO2e: number;
    typical_for_this_route: number;
    higher: number;
  };
}

export interface GoogleFlightSegment {
  departure_airport: {
    airport_name: string;
    airport_code: string;
    time: string; // "2026-2-26 15:00"
  };
  arrival_airport: {
    airport_name: string;
    airport_code: string;
    time: string;
  };
  duration: {
    raw: number;
    text: string;
  };
  airline: string;
  airline_logo: string;
  flight_number: string;
  aircraft: string;
  seat: string;
  legroom: string;
  extensions: string[];
  delay?: {
    values: boolean;
    text: number;
  };
  self_transfer: boolean;
}

export interface GoogleLayover {
  duration: {
    raw: number;
    text: string;
  };
  airport: {
    airport_name: string;
    airport_code: string;
  };
}

/**
 * Search for flights using Google Flights API via RapidAPI.
 */
export async function searchFlights(
  params: FlightSearchParams
): Promise<GoogleFlightsResponse> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error(
      "RapidAPI key not configured. Set RAPIDAPI_KEY in environment variables."
    );
  }

  // Map travel class to API format
  const travelClassMap: Record<string, string> = {
    ECONOMY: "ECONOMY",
    PREMIUM_ECONOMY: "PREMIUM_ECONOMY",
    BUSINESS: "BUSINESS",
    FIRST: "FIRST",
  };

  const searchParams = new URLSearchParams({
    departure_id: params.origin.toUpperCase(),
    arrival_id: params.destination.toUpperCase(),
    outbound_date: params.departureDate,
    travel_class: travelClassMap[params.travelClass] || "ECONOMY",
    adults: params.adults.toString(),
    show_hidden: "1",
    currency: "INR",
    language_code: "en-US",
    country_code: "US",
    search_type: "best",
  });

  if (params.returnDate) {
    searchParams.set("return_date", params.returnDate);
  }

  if (params.children > 0) {
    searchParams.set("children", params.children.toString());
  }

  const url = `${SEARCH_URL}?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Flights API error: ${response.status} - ${error}`);
  }

  const data: GoogleFlightsResponse = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Google Flights API returned an error.");
  }

  return data;
}
