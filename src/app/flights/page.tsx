"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Plane,
} from "lucide-react";
import Link from "next/link";
import { addDays, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlightCard } from "@/components/flights/flight-card";
import { BookingModal } from "@/components/flights/booking-modal";
import {
  FlightFilters,
  getDefaultFilters,
  applyFilters,
} from "@/components/flights/flight-filters";
import { FlightResultsLoading } from "@/components/ui/loading-skeleton";
import { ErrorState, EmptyState } from "@/components/ui/error-state";
import {
  FlightOffer,
  FlightSearchParams,
  FlightSearchResponse,
  FilterState,
} from "@/types/flight";
import { formatDate, formatINR } from "@/utils/format";

const FLIGHTS_PER_PAGE = 10;

type SortKey = "mixed" | "price" | "duration" | "departure";

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
}

function FlightsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [airlines, setAirlines] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("mixed");
  const [filters, setFilters] = useState<FilterState>({
    airlines: [],
    stops: [],
    priceRange: [0, 999999],
  });
  const [visibleCount, setVisibleCount] = useState(FLIGHTS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  const fsp: FlightSearchParams = {
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    departureDate: searchParams.get("departureDate") || "",
    returnDate: searchParams.get("returnDate") || undefined,
    adults: parseInt(searchParams.get("adults") || "1"),
    children: parseInt(searchParams.get("children") || "0"),
    infants: parseInt(searchParams.get("infants") || "0"),
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
        body: JSON.stringify(fsp),
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
    if (fsp.origin && fsp.destination && fsp.departureDate) {
      fetchFlights();
    } else {
      setLoading(false);
      setError("Missing search parameters. Please search for flights from the homepage.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFlights]);

  // Navigate to adjacent date
  const navigateDate = (delta: number) => {
    if (!fsp.departureDate) return;
    const newDate = addDays(parseISO(fsp.departureDate), delta);
    const params = new URLSearchParams(searchParams.toString());
    params.set("departureDate", format(newDate, "yyyy-MM-dd"));
    router.push(`/flights?${params.toString()}`);
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = applyFilters(flights, filters);
    if (sortBy === "mixed") return filtered;
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price": return a.price.markedUpTotal - b.price.markedUpTotal;
        case "duration": return parseDuration(a.itineraries[0].duration) - parseDuration(b.itineraries[0].duration);
        case "departure":
          return new Date(a.itineraries[0].segments[0].departure.at).getTime() -
            new Date(b.itineraries[0].segments[0].departure.at).getTime();
        default: return 0;
      }
    });
  }, [flights, filters, sortBy]);

  const visibleFlights = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + FLIGHTS_PER_PAGE);
      setLoadingMore(false);
    }, 400);
  };

  useEffect(() => { setVisibleCount(FLIGHTS_PER_PAGE); }, [filters, sortBy]);

  // Price insights
  const priceInsights = useMemo(() => {
    if (!flights.length) return null;
    const sorted = [...flights].sort((a, b) => a.price.markedUpTotal - b.price.markedUpTotal);
    const byDur = [...flights].sort((a, b) => parseDuration(a.itineraries[0].duration) - parseDuration(b.itineraries[0].duration));
    const cheapest = sorted[0];
    const fastest = byDur[0];
    const best = flights[0]; // API's best/mixed sort
    return { best, cheapest, fastest };
  }, [flights]);

  const classFmt = fsp.travelClass.replace("_", " ");
  const totalPax = fsp.adults + (fsp.children || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky Top Search Bar ── */}
      <div
        className="sticky top-16 z-40 border-b border-gray-200 shadow-sm"
        style={{ backgroundColor: "var(--brand-navy)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* Back */}
          <Button variant="ghost" asChild className="text-white/70 hover:text-white hover:bg-white/10 shrink-0 w-fit -ml-1">
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              New Search
            </Link>
          </Button>

          {/* Route summary */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => router.push("/")}
            >
              <Search className="h-4 w-4 text-white/50 shrink-0" />
              <span className="text-white font-semibold text-sm truncate">
                {fsp.origin} → {fsp.destination}
              </span>
              <span className="text-white/50 text-xs shrink-0 hidden sm:inline">·</span>
              <span className="text-white/70 text-xs shrink-0 hidden sm:inline">
                {totalPax} Adult{totalPax > 1 ? "s" : ""} · {classFmt}
              </span>
            </div>

            {/* Date navigation */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => navigateDate(-1)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-white text-sm font-semibold px-1 whitespace-nowrap">
                {fsp.departureDate ? formatDate(fsp.departureDate) : ""}
              </span>
              <button
                onClick={() => navigateDate(1)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Price Insights */}
        {!loading && priceInsights && (
          <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Best", flight: priceInsights.best, color: "border-blue-500 bg-blue-50", textColor: "text-blue-700", pill: "bg-blue-600 text-white" },
              { label: "Cheapest", flight: priceInsights.cheapest, color: "border-green-400 bg-green-50", textColor: "text-green-700", pill: "bg-green-600 text-white" },
              { label: "Fastest", flight: priceInsights.fastest, color: "border-purple-400 bg-purple-50", textColor: "text-purple-700", pill: "bg-purple-600 text-white" },
            ].map(({ label, flight, color, textColor, pill }) => (
              <div
                key={label}
                onClick={() => setSortBy(label.toLowerCase() as SortKey)}
                className={`rounded-xl border-2 p-2 sm:p-3 cursor-pointer hover:shadow-md transition-all ${sortBy === label.toLowerCase() ? color : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${sortBy === label.toLowerCase() ? pill : "bg-gray-100 text-gray-500"}`}>
                  {label}
                </span>
                <p className={`text-sm sm:text-lg font-extrabold mt-1 sm:mt-1.5 ${sortBy === label.toLowerCase() ? textColor : "text-gray-700"}`}>
                  {formatINR(Math.ceil(flight.price.markedUpTotal * 0.9))}
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden xs:block">
                  {sortBy === label.toLowerCase() ? "Sorted" : "Tap to sort"}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-6 items-start">
          {/* Sidebar Filters — desktop only, hidden on mobile to avoid layout gap */}
          {!loading && flights.length > 0 && (
            <div className="hidden lg:block">
              <FlightFilters
                flights={flights}
                airlines={airlines}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort / Count Bar */}
            {!loading && flights.length > 0 && (
              <div className="mb-4 space-y-2">
                {/* Row 1: result count + mobile filter */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? "s" : ""} sorted by
                  </span>
                  {/* Mobile filter button — only rendered once here */}
                  <div className="lg:hidden">
                    <FlightFilters
                      flights={flights}
                      airlines={airlines}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                </div>

                {/* Row 2: Sort Tabs — full-width scrollable row */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {(
                    [
                      { key: "mixed", label: "Best" },
                      { key: "price", label: "Cheapest" },
                      { key: "duration", label: "Fastest" },
                      { key: "departure", label: "Earliest" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.key}
                      onClick={() => setSortBy(o.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                        sortBy === o.key
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
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
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-gray-200">
                  <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <SlidersHorizontal className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--brand-navy)" }}>
                    No flights match your filters
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mb-5">
                    Try adjusting your filter criteria to see more results.
                  </p>
                  <Button variant="outline" onClick={() => setFilters(getDefaultFilters(flights))}>
                    Clear All Filters
                  </Button>
                </div>
              )
            ) : (
              <div className="space-y-3">
                {/* Results count */}
                <p className="text-xs text-gray-400 text-right">
                  Showing {Math.min(visibleCount, filteredAndSorted.length)} of {filteredAndSorted.length} flights
                </p>

                {visibleFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    searchParams={fsp}
                    onBook={(f) => { setSelectedFlight(f); setModalOpen(true); }}
                  />
                ))}

                {/* Load More */}
                {hasMore && (
                  <div className="flex flex-col items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="rounded-full min-w-[220px] border-gray-300 hover:border-blue-400 hover:text-blue-600"
                    >
                      {loadingMore ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading more...
                        </span>
                      ) : (
                        `Show ${Math.min(FLIGHTS_PER_PAGE, filteredAndSorted.length - visibleCount)} more flights`
                      )}
                    </Button>
                  </div>
                )}

                {!hasMore && filteredAndSorted.length > FLIGHTS_PER_PAGE && (
                  <p className="text-center text-sm text-gray-400 pt-2">
                    All {filteredAndSorted.length} flights loaded ✓
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        flight={selectedFlight}
        searchParams={fsp}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedFlight(null); }}
      />
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<FlightResultsLoading />}>
      <FlightsContent />
    </Suspense>
  );
}
