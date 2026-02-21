"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { ArrowLeft, Plane, SlidersHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlightCard } from "@/components/flights/flight-card";
import { BookingModal } from "@/components/flights/booking-modal";
import {
  FlightFilters,
  FilterState,
  getDefaultFilters,
  applyFilters,
} from "@/components/flights/flight-filters";
import { FlightResultsLoading } from "@/components/ui/loading-skeleton";
import { ErrorState, EmptyState } from "@/components/ui/error-state";
import {
  FlightOffer,
  FlightSearchParams,
  FlightSearchResponse,
} from "@/types/flight";
import { formatDate } from "@/utils/format";

const FLIGHTS_PER_PAGE = 10;

function FlightsContent() {
  const searchParams = useSearchParams();

  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [airlines, setAirlines] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"mixed" | "price" | "duration" | "departure">("mixed");
  const [filters, setFilters] = useState<FilterState>({
    airlines: [],
    stops: [],
    priceRange: [0, 999999],
  });
  const [visibleCount, setVisibleCount] = useState(FLIGHTS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  const flightSearchParams: FlightSearchParams = {
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    departureDate: searchParams.get("departureDate") || "",
    returnDate: searchParams.get("returnDate") || undefined,
    adults: parseInt(searchParams.get("adults") || "1"),
    children: parseInt(searchParams.get("children") || "0"),
    travelClass: (searchParams.get("travelClass") as FlightSearchParams["travelClass"]) || "ECONOMY",
  };

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    setVisibleCount(FLIGHTS_PER_PAGE);

    try {
      const response = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightSearchParams),
      });

      const data: FlightSearchResponse = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to fetch flights");
        setFlights([]);
      } else {
        setFlights(data.data);
        setAirlines(data.meta?.airlines || {});
        setFilters(getDefaultFilters(data.data));
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    if (flightSearchParams.origin && flightSearchParams.destination && flightSearchParams.departureDate) {
      fetchFlights();
    } else {
      setLoading(false);
      setError("Missing search parameters. Please search for flights from the homepage.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFlights]);

  const handleBook = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setModalOpen(true);
  };

  // Apply filters, then sort
  const filteredAndSorted = useMemo(() => {
    const filtered = applyFilters(flights, filters);

    if (sortBy === "mixed") return filtered; // Already interleaved from server

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price.markedUpTotal - b.price.markedUpTotal;
        case "duration":
          return (
            parseDuration(a.itineraries[0].duration) -
            parseDuration(b.itineraries[0].duration)
          );
        case "departure":
          return (
            new Date(a.itineraries[0].segments[0].departure.at).getTime() -
            new Date(b.itineraries[0].segments[0].departure.at).getTime()
          );
        default:
          return 0;
      }
    });
  }, [flights, filters, sortBy]);

  // Visible slice for progressive loading
  const visibleFlights = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  const loadMore = () => {
    setLoadingMore(true);
    // Small delay to show loading animation
    setTimeout(() => {
      setVisibleCount((prev) => prev + FLIGHTS_PER_PAGE);
      setLoadingMore(false);
    }, 400);
  };

  // Reset visible count when filters/sort change
  useEffect(() => {
    setVisibleCount(FLIGHTS_PER_PAGE);
  }, [filters, sortBy]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Link + Route Info */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-3 -ml-2 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              New Search
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>{flightSearchParams.origin}</span>
                <Plane className="h-5 w-5 text-blue-500" />
                <span>{flightSearchParams.destination}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                <span>{formatDate(flightSearchParams.departureDate)}</span>
                {flightSearchParams.returnDate && (
                  <>
                    <span>→</span>
                    <span>{formatDate(flightSearchParams.returnDate)}</span>
                  </>
                )}
                <span>•</span>
                <span>
                  {flightSearchParams.adults + flightSearchParams.children} Traveller(s)
                </span>
                <span>•</span>
                <span>{flightSearchParams.travelClass.replace("_", " ")}</span>
              </div>
            </div>

            {!loading && flights.length > 0 && (
              <Badge variant="secondary" className="self-start">
                {filteredAndSorted.length} of {flights.length} flight{flights.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        {!loading && flights.length > 0 && (
          <div className="mb-4">
            <FlightFilters
              flights={flights}
              airlines={airlines}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* Sort Controls */}
        {!loading && flights.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground shrink-0">Sort:</span>
            {(
              [
                { key: "mixed", label: "Best Mix" },
                { key: "price", label: "Cheapest" },
                { key: "duration", label: "Fastest" },
                { key: "departure", label: "Earliest" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  sortBy === option.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <FlightResultsLoading />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFlights} />
        ) : filteredAndSorted.length === 0 ? (
          flights.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-4">
                <SlidersHorizontal className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No flights match your filters</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Try adjusting your filter criteria to see more results.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters(getDefaultFilters(flights))}
              >
                Clear All Filters
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {visibleFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                searchParams={flightSearchParams}
                onBook={handleBook}
              />
            ))}

            {/* Load More / Progress */}
            {hasMore && (
              <div className="flex flex-col items-center gap-3 pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {visibleCount} of {filteredAndSorted.length} flights
                </p>
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="min-w-[200px]"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more...
                    </span>
                  ) : (
                    `Show ${Math.min(FLIGHTS_PER_PAGE, filteredAndSorted.length - visibleCount)} More Flights`
                  )}
                </Button>
              </div>
            )}

            {!hasMore && filteredAndSorted.length > FLIGHTS_PER_PAGE && (
              <p className="text-center text-sm text-muted-foreground pt-4">
                All {filteredAndSorted.length} flights loaded
              </p>
            )}
          </div>
        )}

        {/* Booking Modal */}
        <BookingModal
          flight={selectedFlight}
          searchParams={flightSearchParams}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedFlight(null);
          }}
        />
      </div>
    </div>
  );
}

// Parse ISO 8601 duration to minutes for sorting
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<FlightResultsLoading />}>
      <FlightsContent />
    </Suspense>
  );
}
