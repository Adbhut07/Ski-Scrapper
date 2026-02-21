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

export function FlightSearchForm() {
  const router = useRouter();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [isSearching, setIsSearching] = useState(false);

  const swapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) return;

    setIsSearching(true);

    const params = new URLSearchParams({
      origin,
      destination,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      adults: adults.toString(),
      children: children.toString(),
      travelClass,
    });

    if (isRoundTrip && returnDate) {
      params.set("returnDate", format(returnDate, "yyyy-MM-dd"));
    }

    router.push(`/flights?${params.toString()}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="w-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 shadow-xl shadow-black/5">
      {/* Trip Type Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            setIsRoundTrip(false);
            setReturnDate(undefined);
          }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            !isRoundTrip
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          One Way
        </button>
        <button
          onClick={() => setIsRoundTrip(true)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            isRoundTrip
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Round Trip
        </button>
      </div>

      {/* Airport Selection Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 mb-4">
        <AirportSelect
          value={origin}
          onChange={setOrigin}
          placeholder="From"
          label="From"
        />

        <div className="flex items-end justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapAirports}
            className="h-11 w-11 rounded-full border-dashed hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <ArrowRightLeft className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        <AirportSelect
          value={destination}
          onChange={setDestination}
          placeholder="To"
          label="To"
        />
      </div>

      {/* Date and Passengers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Departure Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-foreground">
            Departure
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-11 justify-start text-left font-normal",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate
                  ? format(departureDate, "dd MMM yyyy")
                  : "Select date"}
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
        {isRoundTrip && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none text-foreground">
              Return
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate
                    ? format(returnDate, "dd MMM yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) =>
                    date < (departureDate || new Date())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Passengers */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-foreground">
            Passengers
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-11 justify-start text-left font-normal"
              >
                <Users className="mr-2 h-4 w-4" />
                {adults + children} Traveller(s)
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Adults</p>
                    <p className="text-xs text-muted-foreground">12+ years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(Math.min(9, adults + 1))}
                      disabled={adults >= 9}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Children</p>
                    <p className="text-xs text-muted-foreground">2-11 years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setChildren(Math.min(9, children + 1))}
                      disabled={children >= 9}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Travel Class */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-foreground">
            Class
          </label>
          <Select value={travelClass} onValueChange={setTravelClass}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Economy</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="FIRST">First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={!origin || !destination || !departureDate || isSearching}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
        size="lg"
      >
        {isSearching ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Searching flights...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Flights
          </span>
        )}
      </Button>
    </div>
  );
}
