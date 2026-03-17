"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  FlightOffer,
  FlightSearchParams,
  BookingUserDetails,
} from "@/types/flight";
import { generateWhatsAppURL } from "@/utils/whatsapp";
import { formatINR, formatTime, formatDuration } from "@/utils/format";
import {
  MessageCircle,
  User,
  Phone,
  ArrowRight,
  Plane,
  Clock,
  Luggage,
  BaggageClaim,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { getAirlineLogo } from "@/utils/format";

interface BookingModalProps {
  flight: FlightOffer | null;
  searchParams: FlightSearchParams;
  open: boolean;
  onClose: () => void;
}


export function BookingModal({ flight, searchParams, open, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!flight) return null;

  const outbound = flight.itineraries[0];
  const firstSeg = outbound.segments[0];
  const lastSeg = outbound.segments[outbound.segments.length - 1];
  const returnItin = flight.itineraries[1];

  const price = flight.price.markedUpTotal;
  const logoUrl = flight.airlineLogo || getAirlineLogo(firstSeg.carrierCode);

  const validate = (): boolean => {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone.trim())) errs.phone = "Enter a valid 10-digit number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const userDetails: BookingUserDetails = { name: name.trim(), phone: phone.trim() };
    const whatsappURL = generateWhatsAppURL(flight, searchParams, userDetails);
    window.open(whatsappURL, "_blank");
    onClose();
    setName(""); setPhone(""); setErrors({});
  };

  const handleSkip = () => {
    const whatsappURL = generateWhatsAppURL(flight, searchParams);
    window.open(whatsappURL, "_blank");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto thin-scrollbar p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-3 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              Book via WhatsApp
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-5 pt-4">
          {/* Flight Summary */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
            {/* Outbound */}
            <ItinerarySummary
              itinerary={outbound}
              label="Outbound"
              logoUrl={logoUrl}
            />
            {returnItin && (
              <>
                <Separator />
                <ItinerarySummary
                  itinerary={returnItin}
                  label="Return"
                  logoUrl={flight.airlineLogo || getAirlineLogo(returnItin.segments[0].carrierCode)}
                />
              </>
            )}

            {/* Baggage Row */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-4 bg-blue-50/50">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Luggage className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-medium">Cabin:</span>
                <span>
                  {flight.baggage?.cabinKg ? `${flight.baggage.cabinKg} kg` :
                   flight.baggage?.cabin || flight.baggage?.included || "Check airline"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <BaggageClaim className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-medium">Checked:</span>
                <span>
                  {flight.baggage?.checkedKg ? `${flight.baggage.checkedKg} kg` :
                   flight.baggage?.checked ||
                   (flight.baggage?.purchasable ? "Add baggage (paid)" : "Not included")}
                </span>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Price Summary</p>
            <div className="flex justify-between font-bold">
              <span style={{ color: "var(--brand-navy)" }}>Total fare (incl. all taxes)</span>
              <span className="text-xl" style={{ color: "var(--brand-navy)" }}>{formatINR(price)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-right">
              per person · {searchParams.adults + (searchParams.children || 0)} traveller(s)
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-700">Your Details (optional)</p>
            <div className="space-y-2">
              <Label htmlFor="booking-name" className="flex items-center gap-1.5 text-sm">
                <User className="h-3.5 w-3.5 text-gray-400" />
                Your Name
              </Label>
              <Input
                id="booking-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                className={errors.name ? "border-red-400" : ""}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-phone" className="flex items-center gap-1.5 text-sm">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                Phone Number
              </Label>
              <Input
                id="booking-phone"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); if (errors.phone) setErrors({ ...errors, phone: undefined }); }}
                className={errors.phone ? "border-red-400" : ""}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 rounded-full font-bold text-white shadow-lg text-base"
              style={{ background: "var(--brand-green)" }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Continue to WhatsApp
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-400 text-sm hover:text-gray-600"
            >
              Skip &amp; open WhatsApp directly
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ItinerarySummary({
  itinerary,
  label,
  logoUrl,
}: {
  itinerary: FlightOffer["itineraries"][0];
  label: string;
  logoUrl: string;
}) {
  const firstSeg = itinerary.segments[0];
  const lastSeg = itinerary.segments[itinerary.segments.length - 1];
  const stops = itinerary.segments.length - 1;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {label}
        </span>
        <div className="h-6 w-6 rounded overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
          <Image src={logoUrl} alt={firstSeg.carrierName} width={24} height={24} className="object-contain" unoptimized />
        </div>
        <span className="text-xs text-gray-500">{firstSeg.carrierName} · {firstSeg.carrierCode}-{firstSeg.flightNumber}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-center">
          <p className="font-bold text-base" style={{ color: "var(--brand-navy)" }}>{formatTime(firstSeg.departure.at)}</p>
          <p className="text-xs text-gray-400">{firstSeg.departure.iataCode}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />{formatDuration(itinerary.duration)}
          </span>
          <div className="w-full flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-indigo-200" />
            <ChevronRight className="h-3.5 w-3.5 text-blue-400 -ml-0.5" />
          </div>
          <span className="text-[10px] text-gray-400">
            {stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="text-center">
          <p className="font-bold text-base" style={{ color: "var(--brand-navy)" }}>{formatTime(lastSeg.arrival.at)}</p>
          <p className="text-xs text-gray-400">{lastSeg.arrival.iataCode}</p>
        </div>
      </div>

      {/* All segments mini-list */}
      {itinerary.segments.length > 1 && (
        <div className="mt-2 space-y-1">
          {itinerary.segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
              <Plane className="h-3 w-3 shrink-0 text-blue-400" />
              <span>{seg.departure.iataCode} → {seg.arrival.iataCode}</span>
              <span className="text-gray-300">·</span>
              <span>{formatTime(seg.departure.at)} – {formatTime(seg.arrival.at)}</span>
              <span className="text-gray-300">·</span>
              <span>{formatDuration(seg.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
