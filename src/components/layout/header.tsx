"use client";

import Link from "next/link";
import { Plane, Phone, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "var(--brand-navy)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg transition-all group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0770e3, #00b8a9)" }}
          >
            <Plane className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-white">
              {siteConfig.name}
            </span>
            <span className="text-[10px] leading-none hidden sm:block" style={{ color: "rgba(255,255,255,0.5)" }}>
              {siteConfig.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            <Plane className="h-3.5 w-3.5" />
            Search Flights
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Contact Us
          </a>
          <Button
            asChild
            size="sm"
            className="rounded-full font-semibold text-white shadow-lg"
            style={{ background: "var(--brand-green)" }}
          >
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              WhatsApp Us
            </a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t p-4 space-y-2 animate-slide-up"
          style={{ backgroundColor: "var(--brand-navy-mid)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-white/15"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Plane className="h-4 w-4" />
            Search Flights
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60"
          >
            Contact Us
          </a>
          <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <Button
              asChild
              className="w-full rounded-full font-semibold text-white"
              style={{ background: "var(--brand-green)" }}
            >
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
