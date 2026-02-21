import { Plane, Shield, Clock, MessageCircle } from "lucide-react";
import { FlightSearchForm } from "@/components/search/flight-search-form";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-background" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Hero Text */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4 backdrop-blur-sm">
              <Plane className="h-4 w-4" />
              Search • Compare • Book via WhatsApp
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              Find the Best{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Flight Deals
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Search real-time flight prices, compare options, and book instantly via WhatsApp.
              No middleman, no hassle — just the best deals delivered to you.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Why Book with {siteConfig.name}?
            </h2>
            <p className="mt-2 text-muted-foreground">
              We make flight booking simple, transparent, and personal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Plane,
                title: "Live Prices",
                description:
                  "Real-time flight prices from major airlines. Always up to date.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp Booking",
                description:
                  "Book directly via WhatsApp. No forms, no accounts, just chat.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Shield,
                title: "Trusted Agent",
                description:
                  "Personal attention from experienced travel agents for every booking.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Clock,
                title: "Quick Response",
                description:
                  "Get booking confirmation within minutes. We value your time.",
                color: "bg-orange-100 text-orange-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Trust Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to find your perfect flight?
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Search now and book in seconds via WhatsApp. Our agents are available 24/7.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
              "Hi! I am looking for flight tickets. Can you help?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-blue-600 px-6 py-3 font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            Chat with Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
