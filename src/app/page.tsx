import {
  Plane,
  Shield,
  Clock,
  MessageCircle,
  Star,
  TrendingDown,
  HeadphonesIcon,
  Globe,
} from "lucide-react";
import { FlightSearchForm } from "@/components/search/flight-search-form";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { siteConfig } from "@/config/site";

const POPULAR_DESTINATIONS = [
  { city: "Dubai", code: "DXB", from: "₹18,500", emoji: "🇦🇪", bg: "from-orange-400 to-rose-500" },
  { city: "Bangkok", code: "BKK", from: "₹12,800", emoji: "🇹🇭", bg: "from-violet-500 to-purple-600" },
  { city: "Singapore", code: "SIN", from: "₹16,200", emoji: "🇸🇬", bg: "from-teal-400 to-cyan-600" },
  { city: "London", code: "LHR", from: "₹42,000", emoji: "🇬🇧", bg: "from-blue-500 to-indigo-600" },
  { city: "Goa", code: "GOI", from: "₹4,200", emoji: "🌴", bg: "from-green-400 to-emerald-600" },
  { city: "Mumbai", code: "BOM", from: "₹3,800", emoji: "🏙️", bg: "from-amber-400 to-orange-500" },
];

const FEATURES = [
  {
    icon: TrendingDown,
    title: "Live Best Prices",
    description: "Real-time fares from 500+ airlines. Always get the lowest price available.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Booking",
    description: "Book directly via WhatsApp. No accounts, no payment forms — just chat.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Shield,
    title: "Trusted Agents",
    description: "Personal attention from experienced travel experts for every single booking.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    title: "Instant Response",
    description: "Booking confirmation in minutes. We prioritise speed so you never miss a deal.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our agents are always available — for new bookings and last-minute changes.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Globe,
    title: "Worldwide Flights",
    description: "Search domestic & international routes across 190+ countries worldwide.",
    color: "bg-teal-100 text-teal-600",
  },
];

const STATS = [
  { value: "50,000+", label: "Happy Travellers" },
  { value: "500+", label: "Airlines Covered" },
  { value: "190+", label: "Countries" },
  { value: "24/7", label: "WhatsApp Support" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="hero-gradient relative overflow-hidden pb-20 pt-12 sm:pt-16">
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "var(--brand-teal)" }}
        />
        <div
          className="absolute bottom-0 left-0 h-72 w-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "var(--brand-blue)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Text */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-5"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Trusted by 50,000+ Indian Travellers
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Best flight deals.{" "}
              <span style={{ color: "var(--brand-teal)" }}>One simple search.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Compare prices from 500+ airlines and book in seconds via WhatsApp.
              No middleman, no forms — just great flights at unbeatable prices.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center px-4 py-2">
                <p
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ──
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "var(--brand-navy)" }}
              >
                Popular Destinations
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Top flight routes our travellers love</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.code}
                className={`relative rounded-2xl bg-gradient-to-br ${dest.bg} p-5 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md`}
              >
                <div className="text-3xl mb-2">{dest.emoji}</div>
                <p className="text-white font-bold text-sm">{dest.city}</p>
                <p className="text-white/60 text-xs">{dest.code}</p>
                <p className="text-white font-semibold text-xs mt-2">from {dest.from}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── WHY BOOK WITH US ── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--brand-navy)" }}
            >
              Why Book with {siteConfig.name}?
            </h2>
            <p className="mt-2 text-gray-500">
              We make flight booking personal, transparent, and effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <ReviewsSection />

      {/* ── CTA BANNER ── */}
      <section
        className="py-16 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--brand-navy) 0%, #0770e3 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Ready to find your perfect flight?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-base">
            Search now and book in seconds via WhatsApp. Our agents are available
            24/7 to get you the best deal.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
              "Hi! I am looking for flight tickets. Can you help me find the best deal?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-base shadow-2xl hover:scale-105 transition-transform"
            style={{ color: "var(--brand-navy)" }}
          >
            <MessageCircle className="h-5 w-5 text-green-500" />
            Chat with Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
