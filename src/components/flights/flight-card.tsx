"use client";

import Image from "next/image";
import {
  Clock,
  Plane,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Luggage,
  BaggageClaim,
  Heart,
  Leaf,
  AlertCircle,
  Terminal,
} from "lucide-react";
import { useState } from "react";
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

const DISCOUNT_PERCENT = 10;

function parseDurationMins(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
}

function calcLayoverMins(arrival: string, departure: string): number {
  return Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 60000);
}

export function FlightCard({ flight, searchParams, onBook }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const outbound = flight.itineraries[0];
  const firstSeg = outbound.segments[0];
  const lastSeg = outbound.segments[outbound.segments.length - 1];
  const stopCount = outbound.segments.length - 1;

  const returnItinerary = flight.itineraries[1];

  const originalPrice = flight.price.markedUpTotal;
  const discountedPrice = Math.ceil(originalPrice * (1 - DISCOUNT_PERCENT / 100));

  const logoUrl = flight.airlineLogo || getAirlineLogo(firstSeg.carrierCode);

  // Departure time for urgency labeling
  const isLastTicketSoon =
    flight.lastTicketingDate &&
    new Date(flight.lastTicketingDate).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  // CO2 percent diff
  const co2Diff = flight.co2Emissions?.percentDiff;

  // Baggage summary
  const cabin = flight.baggage?.cabin || flight.baggage?.cabinKg ? `${flight.baggage?.cabinKg ?? ""}kg cabin` : flight.baggage?.included ? "Cabin bag" : null;
  const checked = flight.baggage?.checked || flight.baggage?.checkedKg ? `${flight.baggage?.checkedKg ?? ""}kg checked` : null;

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/8 transition-all duration-300 p-0 bg-white">
      <div className="p-4 sm:p-5">
        {/* MAIN ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">

          {/* Airline Info */}
          <div className="flex items-center gap-3 lg:w-44 shrink-0">
            <div className="relative h-11 w-11 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <Image
                src={logoUrl}
                alt={firstSeg.carrierName}
                width={40}
                height={40}
                className="object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "var(--brand-navy)" }}>
                {firstSeg.carrierName}
              </p>
              <p className="text-xs text-gray-400">
                {firstSeg.carrierCode}-{firstSeg.flightNumber}
              </p>
              {firstSeg.aircraft && (
                <p className="text-[10px] text-gray-400">{firstSeg.aircraft}</p>
              )}
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="flex-1 min-w-0">
            <ItineraryRow itinerary={outbound} accent="blue" />
            {returnItinerary && (
              <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                <ItineraryRow itinerary={returnItinerary} accent="indigo" isReturn />
              </div>
            )}
          </div>

          {/* Price Column */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 lg:gap-1 lg:min-w-[160px] pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-5">
            {/* Save Button */}
            <button
              onClick={() => setSaved(!saved)}
              className="absolute top-3 right-3 lg:static p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Save flight"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${saved ? "fill-rose-500 text-rose-500" : "text-gray-300 hover:text-rose-400"}`}
              />
            </button>

            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs text-gray-400 line-through">{formatINR(originalPrice)}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  {DISCOUNT_PERCENT}% OFF
                </span>
              </div>
              <p className="text-2xl font-extrabold" style={{ color: "var(--brand-navy)" }}>
                {formatINR(discountedPrice)}
              </p>
              <p className="text-[10px] text-green-600 font-semibold">incl. all taxes</p>
              <p className="text-xs text-gray-400 mt-0.5">
                per person · {searchParams.adults + (searchParams.children || 0)} traveller(s)
              </p>
            </div>

            <Button
              onClick={() => onBook(flight)}
              className="rounded-full font-bold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all gap-1.5 whitespace-nowrap"
              style={{ background: "var(--brand-green)" }}
            >
              <MessageCircle className="h-4 w-4" />
              Book on WhatsApp
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* BOTTOM INFO BAR */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-gray-100">
          {/* Cabin baggage */}
          {(cabin || flight.baggage?.included) && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Luggage className="h-3.5 w-3.5 text-blue-400" />
              {cabin || flight.baggage?.included}
            </span>
          )}
          {/* Checked baggage */}
          {checked && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <BaggageClaim className="h-3.5 w-3.5 text-indigo-400" />
              {checked}
            </span>
          )}
          {/* No free baggage */}
          {!cabin && !checked && !flight.baggage?.included && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Luggage className="h-3.5 w-3.5" />
              No free baggage
            </span>
          )}

          {/* Seats left */}
          {flight.numberOfBookableSeats <= 9 && (
            <Badge className="text-[10px] py-0 bg-red-50 text-red-600 border-red-200 hover:bg-red-50">
              Only {flight.numberOfBookableSeats} seats left
            </Badge>
          )}

          {/* CO2 label */}
          {co2Diff !== undefined && co2Diff < 0 && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <Leaf className="h-3.5 w-3.5" />
              {Math.abs(co2Diff)}% less CO₂ than typical
            </span>
          )}

          {/* Last ticketing warning */}
          {isLastTicketSoon && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              Ticket expires soon!
            </span>
          )}

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {expanded ? "Hide" : "Flight"} details
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* EXPANDED DETAILS */}
        {expanded && (
          <div className="mt-4 space-y-4 animate-slide-up">
            <ExpandedItinerary itinerary={outbound} label="Outbound" />
            {returnItinerary && (
              <ExpandedItinerary itinerary={returnItinerary} label="Return" />
            )}

            {/* Baggage Details Card */}
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Baggage Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <Luggage className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Cabin Bag</p>
                    <p className="text-xs text-gray-500">
                      {flight.baggage?.cabinKg ? `${flight.baggage.cabinKg} kg included` :
                       flight.baggage?.cabin ? flight.baggage.cabin :
                       "Check with airline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BaggageClaim className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Checked Bag</p>
                    <p className="text-xs text-gray-500">
                      {flight.baggage?.checkedKg
                        ? `${flight.baggage.checkedKg} kg included`
                        : flight.baggage?.checkedPieces
                        ? `${flight.baggage.checkedPieces} piece(s) included`
                        : flight.baggage?.checked
                        ? flight.baggage.checked
                        : flight.baggage?.purchasable
                        ? "Add baggage (paid)"
                        : "Not included"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Fare Type</p>
                    <p className="text-xs text-gray-500">
                      {flight.baggage?.purchasable ? "Flexible — upgrades available" : "Included in fare"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Sub-components ──

function ItineraryRow({
  itinerary,
  accent,
  isReturn,
}: {
  itinerary: FlightOffer["itineraries"][0];
  accent: "blue" | "indigo";
  isReturn?: boolean;
}) {
  const firstSeg = itinerary.segments[0];
  const lastSeg = itinerary.segments[itinerary.segments.length - 1];
  const stops = itinerary.segments.length - 1;
  const stopCodes = itinerary.segments.slice(0, -1).map((s) => s.arrival.iataCode).join(", ");

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Departure */}
      <div className="text-center shrink-0 w-[66px]">
        <p className="text-lg sm:text-xl font-extrabold" style={{ color: "var(--brand-navy)" }}>
          {formatTime(firstSeg.departure.at)}
        </p>
        <p className="text-xs font-semibold text-gray-400">{firstSeg.departure.iataCode}</p>
        {firstSeg.departure.terminal && (
          <p className="text-[10px] text-gray-300">T{firstSeg.departure.terminal}</p>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 flex flex-col items-center gap-0.5 min-w-0 px-1">
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(itinerary.duration)}
        </p>
        <div className="relative w-full flex items-center">
          <div className={`flex-1 h-px ${accent === "blue" ? "bg-gradient-to-r from-blue-300 to-indigo-300" : "bg-gradient-to-r from-indigo-300 to-purple-300"}`} />
          {stops > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-1">
              {Array.from({ length: stops }).map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-amber-400 border-2 border-white" />
              ))}
            </div>
          )}
          <Plane className={`h-4 w-4 -ml-0.5 ${accent === "blue" ? "text-blue-500" : "text-indigo-500"} ${isReturn ? "rotate-180" : ""}`} />
        </div>
        <div className="flex items-center gap-1">
          <Badge
            className={`text-[10px] py-0 px-2 font-semibold ${
              stops === 0
                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                : stops === 1
                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
            }`}
          >
            {stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`}
          </Badge>
          {stops > 0 && (
            <span className="text-[10px] text-gray-400" title={`Stops: ${stopCodes}`}>
              via {stopCodes}
            </span>
          )}
        </div>
      </div>

      {/* Arrival */}
      <div className="text-center shrink-0 w-[66px]">
        <p className="text-lg sm:text-xl font-extrabold" style={{ color: "var(--brand-navy)" }}>
          {formatTime(lastSeg.arrival.at)}
        </p>
        <p className="text-xs font-semibold text-gray-400">{lastSeg.arrival.iataCode}</p>
        {lastSeg.arrival.terminal && (
          <p className="text-[10px] text-gray-300">T{lastSeg.arrival.terminal}</p>
        )}
      </div>
    </div>
  );
}

function ExpandedItinerary({
  itinerary,
  label,
}: {
  itinerary: FlightOffer["itineraries"][0];
  label: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label} Flight Details</p>
      </div>
      <div className="p-4 space-y-3">
        {itinerary.segments.map((seg, i) => {
          const isLast = i === itinerary.segments.length - 1;
          const nextSeg = itinerary.segments[i + 1];
          const layoverMins = !isLast ? calcLayoverMins(seg.arrival.at, nextSeg.departure.at) : null;

          return (
            <div key={i}>
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">
                {/* Left: airline */}
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <Plane className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  {!isLast && <div className="w-px h-full bg-gray-200 min-h-[20px]" />}
                </div>

                {/* Middle: segment info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: "var(--brand-navy)" }}>
                      {seg.departure.iataCode}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(seg.departure.at)}</span>
                    {seg.departure.terminal && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Terminal className="h-3 w-3" /> T{seg.departure.terminal}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 my-1 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {formatDuration(seg.duration)}
                    <span className="text-gray-300">•</span>
                    <span>{seg.carrierName} {seg.carrierCode}-{seg.flightNumber}</span>
                    {seg.aircraft && <span>· {seg.aircraft}</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: "var(--brand-navy)" }}>
                      {seg.arrival.iataCode}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(seg.arrival.at)}</span>
                    {seg.arrival.terminal && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Terminal className="h-3 w-3" /> T{seg.arrival.terminal}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Layover indicator */}
              {layoverMins !== null && (
                <div className="mt-2 ml-10 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {Math.floor(layoverMins / 60)}h {layoverMins % 60}m layover in {seg.arrival.iataCode}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
