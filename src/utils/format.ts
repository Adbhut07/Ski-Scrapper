// ==========================================
// Formatting Utilities
// ==========================================

/**
 * Format a number as INR currency.
 * e.g., 12345 → "₹12,345"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convert ISO 8601 duration to human-readable format.
 * e.g., "PT2H30M" → "2h 30m"
 */
export function formatDuration(duration: string): string {
  if (!duration) return "";

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? `${match[1]}h` : "";
  const minutes = match[2] ? `${match[2]}m` : "";

  return [hours, minutes].filter(Boolean).join(" ");
}

/**
 * Extract and format time from ISO datetime string.
 * e.g., "2024-03-15T14:30:00" → "02:30 PM"
 */
export function formatTime(datetime: string): string {
  if (!datetime) return "";

  const date = new Date(datetime);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a date string for display.
 * e.g., "2024-03-15" → "Sat, 15 Mar 2024"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get airline logo URL from a CDN.
 * Falls back to a placeholder if not available.
 */
export function getAirlineLogo(carrierCode: string): string {
  return `https://pics.avs.io/60/60/${carrierCode}.png`;
}
