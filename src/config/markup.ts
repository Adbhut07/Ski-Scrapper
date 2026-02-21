// ==========================================
// Markup Configuration
// ==========================================
// Controls how much markup is added to flight prices.
// Configure via environment variables:
//   MARKUP_TYPE = "fixed" | "percentage"
//   MARKUP_VALUE = number (e.g., 400 for ₹400 or 5 for 5%)

export type MarkupType = "fixed" | "percentage";

export interface MarkupConfig {
  type: MarkupType;
  value: number;
}

export function getMarkupConfig(): MarkupConfig {
  const type = (process.env.MARKUP_TYPE as MarkupType) || "fixed";
  const value = parseFloat(process.env.MARKUP_VALUE || "400");

  return { type, value };
}

/**
 * Apply markup to a base price.
 * @param basePrice - The original price from Amadeus API
 * @param passengers - Total number of passengers (for fixed markup)
 * @returns The marked-up price
 */
export function applyMarkup(basePrice: number, passengers: number = 1): number {
  const config = getMarkupConfig();

  if (config.type === "percentage") {
    return Math.ceil(basePrice * (1 + config.value / 100));
  }

  // Fixed: add fixed amount per passenger
  return Math.ceil(basePrice + config.value * passengers);
}
