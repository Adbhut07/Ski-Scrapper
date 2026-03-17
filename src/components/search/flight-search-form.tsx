"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightLeft,
  Calendar as CalendarIcon,
  Users,
  Search,
  Minus,
  Plus,
  X,
  PlaneTakeoff,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AirportSelect } from "./airport-select";

type TripType = "one-way" | "return" | "multi-city";

interface MultiCityLeg {
  origin: string;
  destination: string;
  date?: Date;
}

const CABIN_CLASSES = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First Class" },
];

export function FlightSearchForm() {
  const router = useRouter();

  // Trip type
  const [tripType, setTripType] = useState<TripType>("one-way");

  // One-way / Return fields
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  // Multi-city legs
  const [legs, setLegs] = useState<MultiCityLeg[]>([
    { origin: "", destination: "" },
    { origin: "", destination: "" },
  ]);

  // Passengers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("ECONOMY");

  // Options
  const [directOnly, setDirectOnly] = useState(false);
  const [nearbyOrigin, setNearbyOrigin] = useState(false);
  const [nearbyDestination, setNearbyDestination] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  const totalPassengers = adults + children + infants;

  const swapAirports = () => {
    const tmp = origin;
    setOrigin(destination);
    setDestination(tmp);
  };

  // Multi-city helpers
  const updateLeg = (idx: number, field: keyof MultiCityLeg, value: string | Date | undefined) => {
    setLegs((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };
  const addLeg = () => {
    if (legs.length < 5) setLegs((prev) => [...prev, { origin: "", destination: "" }]);
  };
  const removeLeg = (idx: number) => {
    if (legs.length > 2) setLegs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSearch = () => {
    if (tripType === "multi-city") {
      const firstLeg = legs[0];
      if (!firstLeg.origin || !firstLeg.destination || !firstLeg.date) return;
      setIsSearching(true);
      const params = new URLSearchParams({
        origin: firstLeg.origin,
        destination: firstLeg.destination,
        departureDate: format(firstLeg.date, "yyyy-MM-dd"),
        adults: adults.toString(),
        children: children.toString(),
        infants: infants.toString(),
        travelClass,
        ...(directOnly && { directOnly: "true" }),
      });
      router.push(`/flights?${params.toString()}`);
      return;
    }

    if (!origin || !destination || !departureDate) return;
    setIsSearching(true);

    const params = new URLSearchParams({
      origin,
      destination,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      travelClass,
      ...(directOnly && { directOnly: "true" }),
      ...(nearbyOrigin && { nearbyOrigin: "true" }),
      ...(nearbyDestination && { nearbyDestination: "true" }),
    });

    if (tripType === "return" && returnDate) {
      params.set("returnDate", format(returnDate, "yyyy-MM-dd"));
    }

    router.push(`/flights?${params.toString()}`);
  };

  const tripLabel = CABIN_CLASSES.find((c) => c.value === travelClass)?.label ?? "Economy";
  const passengerSummary = `${totalPassengers} Traveller${totalPassengers > 1 ? "s" : ""}, ${tripLabel}`;

  return (
    <div className="w-full rounded-2xl bg-white shadow-2xl overflow-hidden">
      {/* Trip Type Tabs */}
      <div className="flex items-center gap-0 px-5 pt-4 border-b border-gray-100">
        {(["one-way", "return", "multi-city"] as TripType[]).map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px",
              tripType === type
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            {type === "one-way" ? "One Way" : type === "return" ? "Return" : "Multi-city"}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* ── ONE WAY / RETURN ── */}
        {tripType !== "multi-city" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_auto] gap-3 mb-3 items-end">
              {/* From */}
              <AirportSelect value={origin} onChange={setOrigin} placeholder="From" label="From" />

              {/* Swap */}
              <div className="flex items-end justify-center">
                <button
                  onClick={swapAirports}
                  className="h-11 w-11 rounded-full border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center transition-all shadow-sm"
                >
                  <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                </button>
              </div>

              {/* To */}
              <AirportSelect value={destination} onChange={setDestination} placeholder="To" label="To" />

              {/* Departure Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Depart</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full min-w-[130px] h-11 justify-start text-left font-normal border-gray-200",
                        !departureDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {departureDate ? format(departureDate, "dd MMM yy") : "Add date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              {tripType === "return" ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Return</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full min-w-[130px] h-11 justify-start text-left font-normal border-gray-200",
                          !returnDate && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                        {returnDate ? format(returnDate, "dd MMM yy") : "Add date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => date < (departureDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>

            {/* Options Row */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div
                  onClick={() => setNearbyOrigin(!nearbyOrigin)}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                    nearbyOrigin ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  )}
                >
                  {nearbyOrigin && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className="text-gray-600 select-none" onClick={() => setNearbyOrigin(!nearbyOrigin)}>
                  Add nearby airports (origin)
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div
                  onClick={() => setNearbyDestination(!nearbyDestination)}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                    nearbyDestination ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  )}
                >
                  {nearbyDestination && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className="text-gray-600 select-none" onClick={() => setNearbyDestination(!nearbyDestination)}>
                  Add nearby airports (destination)
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div
                  onClick={() => setDirectOnly(!directOnly)}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                    directOnly ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  )}
                >
                  {directOnly && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className="text-gray-600 select-none" onClick={() => setDirectOnly(!directOnly)}>
                  Direct flights only
                </span>
              </label>
            </div>
          </>
        )}

        {/* ── MULTI-CITY ── */}
        {tripType === "multi-city" && (
          <div className="mb-4 space-y-3">
            {legs.map((leg, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                <div className="flex items-center justify-center w-7 h-11 shrink-0">
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <AirportSelect value={leg.origin} onChange={(v) => updateLeg(idx, "origin", v)} placeholder="From" label="From" />
                </div>
                <div className="flex-1">
                  <AirportSelect value={leg.destination} onChange={(v) => updateLeg(idx, "destination", v)} placeholder="To" label="To" />
                </div>
                <div className="space-y-1 min-w-[130px]">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Depart</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal border-gray-200",
                          !leg.date && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {leg.date ? format(leg.date, "dd MMM yy") : "Add date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={leg.date}
                        onSelect={(d) => updateLeg(idx, "date", d)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {legs.length > 2 && (
                  <button
                    onClick={() => removeLeg(idx)}
                    className="h-11 w-11 shrink-0 rounded-full border border-gray-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center transition-all"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
            {legs.length < 5 && (
              <button
                onClick={addLeg}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all"
              >
                <PlaneTakeoff className="h-4 w-4" />
                + Add another flight
              </button>
            )}
          </div>
        )}

        {/* ── BOTTOM ROW: Passengers + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          {/* Travellers & Class */}
          <Popover open={passengersOpen} onOpenChange={setPassengersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 justify-start text-left font-normal border-gray-200 min-w-[220px]"
              >
                <Users className="mr-2 h-4 w-4 text-blue-500" />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                    Travellers and cabin class
                  </div>
                  <div className="text-sm font-medium text-gray-800">{passengerSummary}</div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                {[
                  { label: "Adults", sub: "12+ years", val: adults, set: setAdults, min: 1 },
                  { label: "Children", sub: "2–11 years", val: children, set: setChildren, min: 0 },
                  { label: "Infants", sub: "Under 2 years", val: infants, set: setInfants, min: 0 },
                ].map(({ label, sub, val, set, min }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => set(Math.max(min, val - 1))}
                        disabled={val <= min}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-bold text-sm">{val}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => set(Math.min(9, val + 1))}
                        disabled={val >= 9}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cabin Class</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CABIN_CLASSES.map((cls) => (
                      <button
                        key={cls.value}
                        onClick={() => setTravelClass(cls.value)}
                        className={cn(
                          "py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                          travelClass === cls.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                        )}
                      >
                        {cls.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full rounded-full font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setPassengersOpen(false)}
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Direct flights option for multi-city */}
          {tripType === "multi-city" && (
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600 whitespace-nowrap">
              <div
                onClick={() => setDirectOnly(!directOnly)}
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                  directOnly ? "bg-blue-600 border-blue-600" : "border-gray-300"
                )}
              >
                {directOnly && <Check className="h-2.5 w-2.5 text-white" />}
              </div>
              <span onClick={() => setDirectOnly(!directOnly)}>Direct flights only</span>
            </label>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={
              isSearching ||
              (tripType !== "multi-city"
                ? !origin || !destination || !departureDate
                : !legs[0].origin || !legs[0].destination || !legs[0].date)
            }
            className="h-12 px-10 rounded-full text-base font-bold text-white shadow-lg ml-auto transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0770e3, #0550a0)" }}
            size="lg"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
