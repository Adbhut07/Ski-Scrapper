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
  infants?: number;
  travelClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  directOnly?: boolean;
  nearbyOrigin?: boolean;
  nearbyDestination?: boolean;
  // Multi-city legs (only used for multi-city trips)
  multiCityLegs?: MultiCityLeg[];
}

export interface MultiCityLeg {
  origin: string;
  destination: string;
  departureDate: string;
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

export interface CO2Emissions {
  amount: number; // kg per passenger
  unit: string;
  percentDiff?: number; // % vs typical route (negative = less)
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
    taxes?: number;
  };
  travelerPricings: {
    travelerType: string;
    price: number;
  }[];
  validatingAirlineCodes: string[];
  numberOfBookableSeats: number;
  baggage?: {
    included?: string;           // e.g. "1 PC 23KG" or "7 KG"
    cabin?: string;              // e.g. "7 KG"
    checked?: string;            // e.g. "23 KG"
    purchasable?: boolean;
    cabinKg?: number;
    checkedKg?: number;
    checkedPieces?: number;
  };
  lastTicketingDate?: string;
  airlineLogo?: string; // Direct logo URL from API
  co2Emissions?: CO2Emissions;
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

// ==========================================
// Filter State
// ==========================================

export interface FilterState {
  airlines: string[];
  stops: number[];
  priceRange: [number, number];
  departureTimeRange?: [number, number]; // hours 0–24
  maxDuration?: number; // minutes
  baggageType?: "cabin" | "checked" | "any";
}
