"use client";

import { useState, useMemo } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlightOffer } from "@/types/flight";
import { formatINR } from "@/utils/format";

export interface FilterState {
  airlines: string[];
  stops: number[];
  priceRange: [number, number];
}

interface FlightFiltersProps {
  flights: FlightOffer[];
  airlines: Record<string, string>; // code → name
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function getDefaultFilters(flights: FlightOffer[]): FilterState {
  const prices = flights.map((f) => f.price.markedUpTotal);
  return {
    airlines: [],
    stops: [],
    priceRange: [
      Math.min(...prices, 0),
      Math.max(...prices, 100000),
    ],
  };
}

export function applyFilters(
  flights: FlightOffer[],
  filters: FilterState
): FlightOffer[] {
  return flights.filter((flight) => {
    // Airline filter
    if (filters.airlines.length > 0) {
      const carrier = flight.itineraries[0].segments[0].carrierCode;
      if (!filters.airlines.includes(carrier)) return false;
    }

    // Stops filter
    if (filters.stops.length > 0) {
      const stops = flight.itineraries[0].segments.length - 1;
      if (!filters.stops.includes(stops)) return false;
    }

    // Price filter
    if (
      flight.price.markedUpTotal < filters.priceRange[0] ||
      flight.price.markedUpTotal > filters.priceRange[1]
    ) {
      return false;
    }

    return true;
  });
}

export function FlightFilters({
  flights,
  airlines,
  filters,
  onFiltersChange,
}: FlightFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const stopCounts: Record<number, number> = {};
    const airlineCounts: Record<string, number> = {};
    let minPrice = Infinity;
    let maxPrice = 0;

    flights.forEach((f) => {
      const stops = f.itineraries[0].segments.length - 1;
      stopCounts[stops] = (stopCounts[stops] || 0) + 1;

      const carrier = f.itineraries[0].segments[0].carrierCode;
      airlineCounts[carrier] = (airlineCounts[carrier] || 0) + 1;

      minPrice = Math.min(minPrice, f.price.markedUpTotal);
      maxPrice = Math.max(maxPrice, f.price.markedUpTotal);
    });

    return { stopCounts, airlineCounts, minPrice, maxPrice };
  }, [flights]);

  const activeCount =
    filters.airlines.length +
    filters.stops.length +
    (filters.priceRange[0] > stats.minPrice || filters.priceRange[1] < stats.maxPrice ? 1 : 0);

  const toggleAirline = (code: string) => {
    const newAirlines = filters.airlines.includes(code)
      ? filters.airlines.filter((a) => a !== code)
      : [...filters.airlines, code];
    onFiltersChange({ ...filters, airlines: newAirlines });
  };

  const toggleStops = (stops: number) => {
    const newStops = filters.stops.includes(stops)
      ? filters.stops.filter((s) => s !== stops)
      : [...filters.stops, stops];
    onFiltersChange({ ...filters, stops: newStops });
  };

  const clearAll = () => {
    onFiltersChange({
      airlines: [],
      stops: [],
      priceRange: [stats.minPrice, stats.maxPrice],
    });
  };

  const sortedAirlineCodes = Object.keys(stats.airlineCounts).sort(
    (a, b) => stats.airlineCounts[b] - stats.airlineCounts[a]
  );

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm">Filters</span>
          {activeCount > 0 && (
            <Badge className="text-[10px] py-0 px-1.5 bg-blue-600 text-white hover:bg-blue-600">
              {activeCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="text-xs text-muted-foreground h-7 px-2"
            >
              Clear all
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="border-t border-border/40 p-3 sm:p-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
          {/* Airlines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Airlines
            </h4>
            <div className="flex flex-wrap gap-2">
              {sortedAirlineCodes.map((code) => {
                const isActive = filters.airlines.includes(code);
                return (
                  <button
                    key={code}
                    onClick={() => toggleAirline(code)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-background text-foreground border-border hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {airlines[code] || code}
                    <span className={`text-[10px] ${isActive ? "text-blue-200" : "text-muted-foreground"}`}>
                      ({stats.airlineCounts[code]})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Stops */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Stops
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(stats.stopCounts)
                .map(Number)
                .sort()
                .map((stops) => {
                  const isActive = filters.stops.includes(stops);
                  const label = stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`;
                  return (
                    <button
                      key={stops}
                      onClick={() => toggleStops(stops)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-background text-foreground border-border hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {label}
                      <span className={`text-[10px] ${isActive ? "text-blue-200" : "text-muted-foreground"}`}>
                        ({stats.stopCounts[stops]})
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Price Range
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatINR(stats.minPrice)}
              </span>
              <input
                type="range"
                min={stats.minPrice}
                max={stats.maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                  })
                }
                className="flex-1 h-1.5 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs font-medium whitespace-nowrap">
                up to {formatINR(filters.priceRange[1])}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
