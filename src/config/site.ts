// ==========================================
// Site-wide Configuration
// ==========================================

export const siteConfig = {
  name: "Soami Travels",
  tagline: "Best Flight Deals, Booked via WhatsApp",
  description:
    "Find the best flight deals and book instantly via WhatsApp. Compare prices, choose your flight, and let us handle the rest.",
  url: "https://soamitravels.com",
  ogImage: "/og-image.png",
  contact: {
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
    email: "info@soamitravels.com",
    address: "India",
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
};
