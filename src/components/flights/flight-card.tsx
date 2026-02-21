"use client";

import Image from "next/image";
import {
  Clock,
  Plane,
  Luggage,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlightOffer, FlightSearchParams } from "@/types/flight";
import {
  formatINR,
  formatDuration,
  formatTime,
  getAirlineLogo,
} from "@/utils/format";

interface FlightCardProps {
  flight: FlightOffer;
  searchParams: FlightSearchParams;
  onBook: (flight: FlightOffer) => void;
}

export function FlightCard({ flight, searchParams, onBook }: FlightCardProps) {
  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const stopCount = outbound.segments.length - 1;

  const returnItinerary = flight.itineraries[1];

  // Prefer Google Flights logo URL, fallback to generated
  const logoUrl = flight.airlineLogo || getAirlineLogo(firstSegment.carrierCode);

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 p-0">
      <div className="p-4 sm:p-6">
        {/* Main Row: Flight Info + Price */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Airline Info */}
          <div className="flex items-center gap-3 lg:w-44 shrink-0">
            <div className="relative h-10 w-10 rounded-lg border border-border/50 bg-white overflow-hidden flex items-center justify-center shrink-0">
              <Image
                src={logoUrl}
                alt={firstSegment.carrierName}
                width={40}
                height={40}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {firstSegment.carrierName}
              </p>
              <p className="text-xs text-muted-foreground">
                {firstSegment.carrierCode}-{firstSegment.flightNumber}
              </p>
            </div>
          </div>

          {/* Flight Journey */}
          <div className="flex-1">
            {/* Outbound */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-center min-w-[70px]">
                <p className="text-lg sm:text-xl font-bold">
                  {formatTime(firstSegment.departure.at)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {firstSegment.departure.iataCode}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 px-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(outbound.duration)}
                </p>
                <div className="relative w-full flex items-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-indigo-300" />
                  {stopCount > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 flex gap-1">
                      {Array.from({ length: stopCount }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-orange-400 border-2 border-white"
                        />
                      ))}
                    </div>
                  )}
                  <Plane className="h-4 w-4 text-blue-500 -ml-0.5" />
                </div>
                <Badge
                  variant={stopCount === 0 ? "default" : "secondary"}
                  className={
                    stopCount === 0
                      ? "text-[10px] py-0 bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                      : "text-[10px] py-0 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100"
                  }
                >
                  {stopCount === 0
                    ? "Non-stop"
                    : `${stopCount} stop${stopCount > 1 ? "s" : ""}`}
                </Badge>
              </div>

              <div className="text-center min-w-[70px]">
                <p className="text-lg sm:text-xl font-bold">
                  {formatTime(lastSegment.arrival.at)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {lastSegment.arrival.iataCode}
                </p>
              </div>
            </div>

            {/* Return Journey (if round trip) */}
            {returnItinerary && (
              <div className="mt-3 pt-3 border-t border-dashed border-border/50">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="text-center min-w-[70px]">
                    <p className="text-base font-bold">
                      {formatTime(returnItinerary.segments[0].departure.at)}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {returnItinerary.segments[0].departure.iataCode}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-1 px-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(returnItinerary.duration)}
                    </p>
                    <div className="w-full flex items-center">
                      <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-blue-300" />
                      <Plane className="h-3.5 w-3.5 text-indigo-500 -ml-0.5 rotate-180" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] py-0 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Return
                    </Badge>
                  </div>

                  <div className="text-center min-w-[70px]">
                    <p className="text-base font-bold">
                      {formatTime(
                        returnItinerary.segments[
                          returnItinerary.segments.length - 1
                        ].arrival.at
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {
                        returnItinerary.segments[
                          returnItinerary.segments.length - 1
                        ].arrival.iataCode
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 lg:min-w-[150px] pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border/50 lg:pl-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {formatINR(flight.price.markedUpTotal)}
              </p>
              <p className="text-xs text-muted-foreground">
                per person • {searchParams.adults + searchParams.children} traveller(s)
              </p>
            </div>

            <Button
              onClick={() => onBook(flight)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md shadow-green-500/20 hover:shadow-lg transition-all font-semibold gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              Book on WhatsApp
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30">
          {flight.baggage?.included && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Luggage className="h-3.5 w-3.5" />
              {flight.baggage.included} baggage included
            </span>
          )}
          {flight.numberOfBookableSeats <= 5 && (
            <Badge className="text-[10px] py-0 bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
              Only {flight.numberOfBookableSeats} seats left
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
