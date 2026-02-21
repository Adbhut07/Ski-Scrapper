import { Airport } from "@/types/flight";

export const airports: Airport[] = [
  // Major Indian Cities
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "India" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India" },
  { code: "GOI", name: "Goa International Airport", city: "Goa", country: "India" },
  { code: "PNQ", name: "Pune Airport", city: "Pune", country: "India" },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India" },
  { code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow", country: "India" },
  { code: "IXC", name: "Chandigarh International Airport", city: "Chandigarh", country: "India" },
  { code: "PAT", name: "Jay Prakash Narayan International Airport", city: "Patna", country: "India" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India" },
  { code: "VNS", name: "Lal Bahadur Shastri International Airport", city: "Varanasi", country: "India" },
  { code: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar", country: "India" },
  { code: "IXB", name: "Bagdogra Airport", city: "Bagdogra", country: "India" },
  { code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram", country: "India" },
  { code: "IDR", name: "Devi Ahilyabai Holkar Airport", city: "Indore", country: "India" },
  { code: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", city: "Nagpur", country: "India" },
  { code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar", country: "India" },
  { code: "RPR", name: "Swami Vivekananda Airport", city: "Raipur", country: "India" },
  { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi", country: "India" },
  { code: "UDR", name: "Maharana Pratap Airport", city: "Udaipur", country: "India" },
  { code: "VTZ", name: "Visakhapatnam Airport", city: "Visakhapatnam", country: "India" },
  { code: "CJB", name: "Coimbatore International Airport", city: "Coimbatore", country: "India" },
  { code: "IXM", name: "Madurai Airport", city: "Madurai", country: "India" },
  { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", city: "Amritsar", country: "India" },

  // International Hubs
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA" },
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "China" },
  { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan" },
  { code: "ICN", name: "Incheon International Airport", city: "Seoul", country: "South Korea" },
  { code: "SYD", name: "Sydney Airport", city: "Sydney", country: "Australia" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar" },
  { code: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "UAE" },
  { code: "MLE", name: "Velana International Airport", city: "Malé", country: "Maldives" },
  { code: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka" },
  { code: "KTM", name: "Tribhuvan International Airport", city: "Kathmandu", country: "Nepal" },
  { code: "DAC", name: "Hazrat Shahjalal International Airport", city: "Dhaka", country: "Bangladesh" },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return airports.filter(
    (airport) =>
      airport.code.toLowerCase().includes(q) ||
      airport.city.toLowerCase().includes(q) ||
      airport.name.toLowerCase().includes(q)
  ).slice(0, 10);
}
