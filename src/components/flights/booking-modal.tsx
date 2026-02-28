"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FlightOffer,
  FlightSearchParams,
  BookingUserDetails,
} from "@/types/flight";
import { generateWhatsAppURL } from "@/utils/whatsapp";
import { formatINR, formatTime, formatDuration } from "@/utils/format";
import { MessageCircle, User, Phone, ArrowRight } from "lucide-react";

interface BookingModalProps {
  flight: FlightOffer | null;
  searchParams: FlightSearchParams;
  open: boolean;
  onClose: () => void;
}

export function BookingModal({
  flight,
  searchParams,
  open,
  onClose,
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!flight) return null;

  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const userDetails: BookingUserDetails = {
      name: name.trim(),
      phone: phone.trim(),
    };

    const whatsappURL = generateWhatsAppURL(flight, searchParams, userDetails);
    window.open(whatsappURL, "_blank");
    onClose();
    setName("");
    setPhone("");
    setErrors({});
  };

  const handleSkip = () => {
    const whatsappURL = generateWhatsAppURL(flight, searchParams);
    window.open(whatsappURL, "_blank");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            Book via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Share your details so we can reach you about this booking.
          </DialogDescription>
        </DialogHeader>

        {/* Flight Summary */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {firstSegment.departure.iataCode} → {lastSegment.arrival.iataCode}
            </span>
            <div className="text-right">
              <span className="text-xs text-muted-foreground line-through mr-1.5">
                {formatINR(flight.price.markedUpTotal)}
              </span>
              <span className="font-bold text-green-600">
                {formatINR(Math.ceil(flight.price.markedUpTotal * 0.95))}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{firstSegment.carrierName}</span>
            <span>•</span>
            <span>{formatTime(firstSegment.departure.at)}</span>
            <span>→</span>
            <span>{formatTime(lastSegment.arrival.at)}</span>
            <span>•</span>
            <span>{formatDuration(outbound.duration)}</span>
          </div>
        </div>

        {/* User Details Form */}
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="booking-name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Your Name
            </Label>
            <Input
              id="booking-name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="booking-phone"
              className="flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </Label>
            <Input
              id="booking-phone"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md shadow-green-500/20"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Continue to WhatsApp
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground text-sm"
          >
            Skip & go to WhatsApp directly
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
