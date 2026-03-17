"use client";

import { useState, useMemo } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Luggage, BaggageClaim } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlightOffer, FilterState } from "@/types/flight";
import { formatINR } from "@/utils/format";
import { cn } from "@/lib/utils";

export type { FilterState };

interface FlightFiltersProps {
  flights: FlightOffer[];
  airlines: Record<string, string>;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function getDefaultFilters(flights: FlightOffer[]): FilterState {
  const prices = flights.map((f) => f.price.markedUpTotal);
  return {
    airlines: [],
    stops: [],
    priceRange: [Math.min(...prices, 0), Math.max(...prices, 100000)],
    departureTimeRange: [0, 24],
    maxDuration: undefined,
    baggageType: undefined,
  };
}

export function applyFilters(flights: FlightOffer[], filters: FilterState): FlightOffer[] {
  return flights.filter((flight) => {
    const firstSeg = flight.itineraries[0].segments[0];
    const stops = flight.itineraries[0].segments.length - 1;
    const carrier = firstSeg.carrierCode;

    // Airline filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(carrier)) return false;

    // Stops filter
    const stopsVal = stops >= 2 ? 2 : stops;
    if (filters.stops.length > 0 && !filters.stops.includes(stopsVal)) return false;

    // Price filter
    if (
      flight.price.markedUpTotal < filters.priceRange[0] ||
      flight.price.markedUpTotal > filters.priceRange[1]
    ) return false;

    // Departure time filter
    if (filters.departureTimeRange) {
      const depHour = new Date(firstSeg.departure.at).getHours();
      if (depHour < filters.departureTimeRange[0] || depHour > filters.departureTimeRange[1]) return false;
    }

    // Duration filter
    if (filters.maxDuration) {
      const match = flight.itineraries[0].duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      if (match) {
        const mins = (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
        if (mins > filters.maxDuration) return false;
      }
    }

    // Baggage filter
    if (filters.baggageType === "cabin") {
      if (!flight.baggage?.cabin && !flight.baggage?.cabinKg && !flight.baggage?.included) return false;
    }
    if (filters.baggageType === "checked") {
      if (!flight.baggage?.checked && !flight.baggage?.checkedKg && !flight.baggage?.checkedPieces) return false;
    }

    return true;
  });
}

// Section header for sidebar
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{title}</span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function FlightFilters({ flights, airlines, filters, onFiltersChange }: FlightFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = useMemo(() => {
    const stopCounts: Record<number, { count: number; minPrice: number }> = {};
    const airlinePrices: Record<string, { count: number; minPrice: number }> = {};
    let minPrice = Infinity;
    let maxPrice = 0;
    let maxDur = 0;

    flights.forEach((f) => {
      const stops = Math.min(f.itineraries[0].segments.length - 1, 2);
      const carrier = f.itineraries[0].segments[0].carrierCode;
      const price = f.price.markedUpTotal;

      stopCounts[stops] = stopCounts[stops] || { count: 0, minPrice: Infinity };
      stopCounts[stops].count++;
      stopCounts[stops].minPrice = Math.min(stopCounts[stops].minPrice, price);

      airlinePrices[carrier] = airlinePrices[carrier] || { count: 0, minPrice: Infinity };
      airlinePrices[carrier].count++;
      airlinePrices[carrier].minPrice = Math.min(airlinePrices[carrier].minPrice, price);

      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);

      const match = f.itineraries[0].duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      if (match) {
        const mins = (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
        maxDur = Math.max(maxDur, mins);
      }
    });

    return { stopCounts, airlinePrices, minPrice, maxPrice, maxDur };
  }, [flights]);

  const activeCount =
    filters.airlines.length +
    filters.stops.length +
    (filters.priceRange[1] < stats.maxPrice || filters.priceRange[0] > stats.minPrice ? 1 : 0) +
    (filters.maxDuration ? 1 : 0) +
    (filters.baggageType ? 1 : 0);

  const clearAll = () =>
    onFiltersChange({
      airlines: [],
      stops: [],
      priceRange: [stats.minPrice, stats.maxPrice],
      departureTimeRange: [0, 24],
      maxDuration: undefined,
      baggageType: undefined,
    });

  const toggle = (arr: string[] | number[], val: string | number): (string | number)[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = arr as any[];
    return a.includes(val) ? a.filter((x) => x !== val) : [...a, val];
  };

  const STOP_LABELS: Record<number, string> = { 0: "Direct", 1: "1 Stop", 2: "2+ Stops" };

  const FilterContent = (
    <div className="space-y-0">
      {/* Stops */}
      <FilterSection title="Stops">
        <div className="space-y-2">
          {[0, 1, 2].map((s) => {
            if (!stats.stopCounts[s]) return null;
            const active = filters.stops.includes(s);
            return (
              <label key={s} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => onFiltersChange({ ...filters, stops: toggle(filters.stops, s) as number[] })}
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                      active ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
                    )}
                  >
                    {active && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span
                    className="text-sm text-gray-700 select-none"
                    onClick={() => onFiltersChange({ ...filters, stops: toggle(filters.stops, s) as number[] })}
                  >
                    {STOP_LABELS[s]}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">({stats.stopCounts[s].count})</span>
                  <span className="text-xs font-semibold text-gray-600 ml-2">
                    from {formatINR(stats.stopCounts[s].minPrice)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Airlines */}
      <FilterSection title="Airlines">
        <div className="space-y-2 max-h-48 overflow-y-auto thin-scrollbar">
          {Object.keys(stats.airlinePrices)
            .sort((a, b) => stats.airlinePrices[a].minPrice - stats.airlinePrices[b].minPrice)
            .map((code) => {
              const active = filters.airlines.includes(code);
              return (
                <label key={code} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => onFiltersChange({ ...filters, airlines: toggle(filters.airlines, code) as string[] })}
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                        active ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
                      )}
                    >
                      {active && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span
                      className="text-sm text-gray-700 select-none truncate max-w-[120px]"
                      onClick={() => onFiltersChange({ ...filters, airlines: toggle(filters.airlines, code) as string[] })}
                    >
                      {airlines[code] || code}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-gray-400">({stats.airlinePrices[code].count})</span>
                    <span className="text-xs font-semibold text-gray-600 ml-1.5">
                      {formatINR(stats.airlinePrices[code].minPrice)}
                    </span>
                  </div>
                </label>
              );
            })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatINR(filters.priceRange[0])}</span>
            <span className="font-semibold text-gray-700">{formatINR(filters.priceRange[1])}</span>
          </div>
          <input
            type="range"
            min={stats.minPrice}
            max={stats.maxPrice}
            step={500}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFiltersChange({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })
            }
            className="price-slider w-full"
            style={{ "--val": `${((filters.priceRange[1] - stats.minPrice) / (stats.maxPrice - stats.minPrice)) * 100}%` } as React.CSSProperties}
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>{formatINR(stats.minPrice)}</span>
            <span>{formatINR(stats.maxPrice)}</span>
          </div>
        </div>
      </FilterSection>

      {/* Departure Time */}
      <FilterSection title="Departure Time" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{filters.departureTimeRange?.[0] ?? 0}:00</span>
            <span>{filters.departureTimeRange?.[1] ?? 24}:00</span>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={filters.departureTimeRange?.[1] ?? 24}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                departureTimeRange: [filters.departureTimeRange?.[0] ?? 0, parseInt(e.target.value)],
              })
            }
            className="price-slider w-full"
            style={{ "--val": `${((filters.departureTimeRange?.[1] ?? 24) / 24) * 100}%` } as React.CSSProperties}
          />
          <div className="grid grid-cols-4 text-[10px] text-gray-400 text-center">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span>
          </div>
        </div>
      </FilterSection>

      {/* Max Duration */}
      {stats.maxDur > 0 && (
        <FilterSection title="Max Duration" defaultOpen={false}>
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Any</span>
              <span className="font-semibold text-gray-700">
                {filters.maxDuration
                  ? `${Math.floor(filters.maxDuration / 60)}h ${filters.maxDuration % 60}m`
                  : `${Math.floor(stats.maxDur / 60)}h ${stats.maxDur % 60}m`}
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={stats.maxDur}
              step={30}
              value={filters.maxDuration ?? stats.maxDur}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxDuration: parseInt(e.target.value) === stats.maxDur ? undefined : parseInt(e.target.value) })
              }
              className="price-slider w-full"
              style={{ "--val": `${((filters.maxDuration ?? stats.maxDur) / stats.maxDur) * 100}%` } as React.CSSProperties}
            />
          </div>
        </FilterSection>
      )}

      {/* Baggage */}
      <FilterSection title="Baggage" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { key: "cabin" as const, label: "Cabin bag included", Icon: Luggage },
            { key: "checked" as const, label: "Checked bag included", Icon: BaggageClaim },
          ].map(({ key, label, Icon }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => onFiltersChange({ ...filters, baggageType: filters.baggageType === key ? undefined : key })}
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                  filters.baggageType === key ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
                )}
              >
                {filters.baggageType === key && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <Icon className="h-3.5 w-3.5 text-gray-400" />
              <span
                className="text-sm text-gray-700 select-none"
                onClick={() => onFiltersChange({ ...filters, baggageType: filters.baggageType === key ? undefined : key })}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden sticky top-20">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-sm text-gray-800">Filters</span>
              {activeCount > 0 && (
                <Badge className="text-[10px] py-0 px-1.5 bg-blue-600 text-white hover:bg-blue-600">
                  {activeCount}
                </Badge>
              )}
            </div>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Clear all <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="px-4 py-2">{FilterContent}</div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-full border-gray-300"
        >
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          Filters
          {activeCount > 0 && (
            <Badge className="text-[10px] py-0 px-1.5 bg-blue-600 text-white hover:bg-blue-600 ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="relative ml-auto w-80 max-w-full h-full bg-white flex flex-col animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-sm">Filters</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-2">
                {FilterContent}
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={clearAll}>Clear all</Button>
                <Button className="flex-1 bg-blue-600 text-white" onClick={() => setMobileOpen(false)}>
                  See results
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
