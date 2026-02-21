// ==========================================
// Flight Search & API Types
// ==========================================

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  travelClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

// ==========================================
// Processed Flight Data (sent to frontend)
// ==========================================

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO datetime
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  carrierName: string;
  flightNumber: string;
  duration: string; // ISO 8601 duration e.g. PT2H30M
  aircraft?: string;
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;
  itineraries: FlightItinerary[];
  price: {
    currency: string;
    baseTotal: number; // original price from API
    markedUpTotal: number; // price after markup
    perAdult: number;
    perChild?: number;
  };
  travelerPricings: {
    travelerType: string;
    price: number;
  }[];
  validatingAirlineCodes: string[];
  numberOfBookableSeats: number;
  baggage?: {
    included?: string;
    purchasable?: boolean;
  };
  lastTicketingDate?: string;
  airlineLogo?: string; // Direct logo URL from API
}

export interface FlightSearchResponse {
  success: boolean;
  data: FlightOffer[];
  meta?: {
    count: number;
    currency: string;
    airlines?: Record<string, string>; // carrier code → name
  };
  error?: string;
}

export interface BookingUserDetails {
  name: string;
  phone: string;
}
