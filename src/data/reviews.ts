export interface Review {
  id: number;
  name: string;
  location: string;
  rating: number; // 1-5
  text: string;
  route: string; // e.g. "DEL → BOM"
  date: string; // ISO date
  avatar?: string; // initials fallback
}

export const reviews: Review[] = [
  { id: 1, name: "Priya Sharma", location: "New Delhi", rating: 5, text: "Booked my Goa trip through Gola Bhai Travels and got amazing prices! The WhatsApp booking was so convenient. Highly recommend!", route: "DEL → GOI", date: "2026-02-15" },
  { id: 2, name: "Rahul Verma", location: "Mumbai", rating: 5, text: "Best travel agent I've ever used. Got my flight tickets at prices lower than any app I checked. Will definitely book again!", route: "BOM → BLR", date: "2026-02-14" },
  { id: 3, name: "Ananya Gupta", location: "Bangalore", rating: 5, text: "Quick response on WhatsApp, transparent pricing, and no hidden fees. My family trip to Jaipur was sorted within 10 minutes!", route: "BLR → JAI", date: "2026-02-13" },
  { id: 4, name: "Vikram Singh", location: "Jaipur", rating: 4, text: "Great service! Found me connecting flights that saved ₹3,000 compared to direct booking. Smart suggestions by the team.", route: "JAI → CCU", date: "2026-02-12" },
  { id: 5, name: "Sneha Patel", location: "Ahmedabad", rating: 5, text: "I was skeptical about booking via WhatsApp but Gola Bhai Travels made it so smooth! Tickets confirmed in just 5 minutes.", route: "AMD → DEL", date: "2026-02-11" },
  { id: 6, name: "Arjun Reddy", location: "Hyderabad", rating: 5, text: "Excellent prices and customer service. They helped me change my travel dates without any extra charges. Very trustworthy!", route: "HYD → BOM", date: "2026-02-10" },
  { id: 7, name: "Meera Nair", location: "Kochi", rating: 5, text: "Booked tickets for 8 family members and they managed to get us all seated together. Fantastic coordination and great deals!", route: "COK → DEL", date: "2026-02-09" },
  { id: 8, name: "Karan Malhotra", location: "Chandigarh", rating: 5, text: "The price comparison they showed was impressive. Saved ₹5,000 on my round trip to Chennai. Very professional service.", route: "IXC → MAA", date: "2026-02-08" },
  { id: 9, name: "Deepika Rao", location: "Chennai", rating: 4, text: "Quick booking, instant confirmation, and they even reminded me about web check-in. Such thoughtful service!", route: "MAA → BLR", date: "2026-02-07" },
  { id: 10, name: "Amit Joshi", location: "Pune", rating: 5, text: "I travel frequently for business and Gola Bhai Travels always gets me the best business class deals. My go-to agent now!", route: "PNQ → DEL", date: "2026-02-06" },
  { id: 11, name: "Riya Kapoor", location: "Lucknow", rating: 5, text: "Booked a last-minute flight and they managed to find a great deal even 2 hours before departure. Lifesavers!", route: "LKO → BOM", date: "2026-02-05" },
  { id: 12, name: "Sanjay Kumar", location: "Patna", rating: 5, text: "Very transparent about pricing. They showed me the airline price vs their price so I knew exactly what I was paying. Fair markup.", route: "PAT → DEL", date: "2026-02-04" },
  { id: 13, name: "Neha Saxena", location: "Kolkata", rating: 5, text: "My parents needed to travel urgently and Gola Bhai Travels arranged everything within 30 minutes. Incredibly helpful!", route: "CCU → BOM", date: "2026-02-03" },
  { id: 14, name: "Rohit Agarwal", location: "Varanasi", rating: 4, text: "Good prices and friendly service. The WhatsApp updates about flight status were a nice touch!", route: "VNS → DEL", date: "2026-02-02" },
  { id: 15, name: "Pooja Desai", location: "Indore", rating: 5, text: "First time using a travel agent and I'm impressed! Got a better deal than MakeMyTrip and with personal service.", route: "IDR → BOM", date: "2026-02-01" },
  { id: 16, name: "Manish Tiwari", location: "Bhopal", rating: 5, text: "Booked round trip Delhi to Dubai for my anniversary. Excellent international deal and they even suggested travel insurance!", route: "DEL → DXB", date: "2026-01-31" },
  { id: 17, name: "Ishita Mehta", location: "Surat", rating: 5, text: "The team is available even late at night. Messaged at 11 PM and got a response within 5 minutes. Outstanding availability!", route: "STV → DEL", date: "2026-01-30" },
  { id: 18, name: "Aditya Pandey", location: "Nagpur", rating: 5, text: "Saved ₹2,500 per ticket for my family of 4. That's ₹10,000 saved! Will never book directly on airline website again.", route: "NAG → HYD", date: "2026-01-29" },
  { id: 19, name: "Swati Kulkarni", location: "Coimbatore", rating: 4, text: "Good experience overall. They found me non-stop flights when the apps were showing only connecting options.", route: "CJB → DEL", date: "2026-01-28" },
  { id: 20, name: "Rajesh Iyer", location: "Thiruvananthapuram", rating: 5, text: "Excellent service! Been using Gola Bhai Travels for 6 months now. Every booking has been smooth and well-priced.", route: "TRV → BOM", date: "2026-01-27" },
  { id: 21, name: "Kavita Choudhary", location: "Jodhpur", rating: 5, text: "My go-to for domestic flights. Always competitive prices and the WhatsApp booking is so much easier than filling forms on apps.", route: "JDH → DEL", date: "2026-01-26" },
  { id: 22, name: "Nikhil Banerjee", location: "Siliguri", rating: 5, text: "Booked flights for my team of 12 for a corporate trip. Got a group discount that no online portal offered!", route: "IXB → BLR", date: "2026-01-25" },
  { id: 23, name: "Ankita Mishra", location: "Ranchi", rating: 5, text: "Simple, fast, and affordable. The search feature showed me all airline options and the agent confirmed the best one instantly.", route: "IXR → DEL", date: "2026-01-24" },
  { id: 24, name: "Suresh Menon", location: "Mangalore", rating: 4, text: "Decent service with good prices. Communication was clear and booking was hassle-free.", route: "IXE → BOM", date: "2026-01-23" },
  { id: 25, name: "Divya Krishnan", location: "Mysore", rating: 5, text: "Best booking experience ever! They compared IndiGo, Air India, and SpiceJet for me and found the cheapest non-stop option.", route: "BLR → GOI", date: "2026-01-22" },
  { id: 26, name: "Harsh Vardhan", location: "Dehradun", rating: 5, text: "Booked a morning flight to Mumbai for a medical emergency. The team was incredibly supportive and fast. Thank you!", route: "DED → BOM", date: "2026-01-21" },
  { id: 27, name: "Pallavi Jain", location: "Udaipur", rating: 5, text: "I always get the best Udaipur to Delhi deals from Gola Bhai Travels. Never disappointed with the service!", route: "UDR → DEL", date: "2026-01-20" },
  { id: 28, name: "Gaurav Sinha", location: "Guwahati", rating: 5, text: "Flying from the Northeast is expensive but they always find me competitive fares. Saved ₹4,000 on my last trip!", route: "GAU → DEL", date: "2026-01-19" },
  { id: 29, name: "Nisha Agrawal", location: "Raipur", rating: 4, text: "Good prices and quick service. They sent me multiple options to choose from. Appreciated the transparency!", route: "RPR → BOM", date: "2026-01-18" },
  { id: 30, name: "Pankaj Dubey", location: "Gorakhpur", rating: 5, text: "My family flies 3-4 times a year and we always use Gola Bhai Travels. Consistent great service and savings!", route: "GOP → DEL", date: "2026-01-17" },
  { id: 31, name: "Shruti Pillai", location: "Vizag", rating: 5, text: "Excellent international booking service! Got Dubai round trip at ₹15,000 which was cheaper than any app.", route: "VTZ → DXB", date: "2026-01-16" },
  { id: 32, name: "Manoj Saxena", location: "Agra", rating: 5, text: "Prompt service, fair pricing, and genuine care for customers. The team goes above and beyond every time.", route: "DEL → BLR", date: "2026-01-15" },
  { id: 33, name: "Geeta Bhatt", location: "Vadodara", rating: 5, text: "They helped me reschedule when my original flight got cancelled. No extra charges and immediate rebooking!", route: "BDQ → DEL", date: "2026-01-14" },
  { id: 34, name: "Vivek Chauhan", location: "Shimla", rating: 4, text: "Reliable and trustworthy. I've recommended Gola Bhai Travels to all my friends and family.", route: "SLV → BOM", date: "2026-01-13" },
  { id: 35, name: "Aarti Goyal", location: "Amritsar", rating: 5, text: "Best prices for Amritsar routes! They found me a deal that was ₹2,000 cheaper than Cleartrip. Super happy!", route: "ATQ → BOM", date: "2026-01-12" },
  { id: 36, name: "Siddharth Nath", location: "Imphal", rating: 5, text: "Flying from Imphal is always expensive but they consistently find me affordable options. Grateful for their service!", route: "IMF → DEL", date: "2026-01-11" },
  { id: 37, name: "Rekha Srinivasan", location: "Madurai", rating: 5, text: "Sweet and professional service. The WhatsApp interaction felt like talking to a friend who happens to be great at finding flights!", route: "IXM → DEL", date: "2026-01-10" },
  { id: 38, name: "Abhishek Yadav", location: "Allahabad", rating: 5, text: "Tried many travel agents before. Gola Bhai Travels is by far the best in terms of price and service quality.", route: "IXD → BOM", date: "2026-01-09" },
  { id: 39, name: "Sunita Kaur", location: "Ludhiana", rating: 4, text: "Good experience. The agent was patient and helped me find flights with extra baggage allowance for my pilgrimage trip.", route: "ATQ → VNS", date: "2026-01-08" },
  { id: 40, name: "Prakash Jha", location: "Darbhanga", rating: 5, text: "Finally a travel service that understands small-town travelers! Easy WhatsApp booking, no apps needed. Love it!", route: "DBR → DEL", date: "2026-01-07" },
  { id: 41, name: "Lata Deshmukh", location: "Aurangabad", rating: 5, text: "Booked flights for my daughter's wedding. 20 guests, all sorted perfectly. The group booking discount was fantastic!", route: "IXU → DEL", date: "2026-01-06" },
  { id: 42, name: "Naveen Reddy", location: "Tirupati", rating: 5, text: "Quick, efficient, and reliable. Got my pilgrimage trip flights at the best possible price. God bless this team!", route: "TIR → DEL", date: "2026-01-05" },
  { id: 43, name: "Preeti Bhatia", location: "Jammu", rating: 5, text: "They found me a deal on Vistara that was cheaper than IndiGo! Great price comparison service.", route: "IXJ → DEL", date: "2026-01-04" },
  { id: 44, name: "Ajay Thakur", location: "Leh", rating: 4, text: "Leh flights are tricky but they always manage to find available seats even during peak season. Impressive!", route: "IXL → DEL", date: "2026-01-03" },
  { id: 45, name: "Sudha Raghavan", location: "Trichy", rating: 5, text: "Best flight deals I've ever found! The team compared 6 airlines for me and got the cheapest option within minutes.", route: "TRZ → DEL", date: "2026-01-02" },
  { id: 46, name: "Kunal Mehra", location: "Noida", rating: 5, text: "Living in Noida, I fly frequently to Bangalore for work. Gola Bhai Travels consistently saves me ₹1,500-₹3,000 per trip!", route: "DEL → BLR", date: "2026-01-01" },
  { id: 47, name: "Bhavna Shah", location: "Rajkot", rating: 5, text: "Trustworthy and honest service. They once told me the airline website was cheaper and to book directly. That honesty earned my loyalty!", route: "RAJ → BOM", date: "2025-12-31" },
  { id: 48, name: "Tarun Gupta", location: "Ghaziabad", rating: 5, text: "My entire office uses Gola Bhai Travels now. Started with me, and everyone loves the service. Quality speaks for itself!", route: "DEL → MAA", date: "2025-12-30" },
  { id: 49, name: "Madhavi Deshpande", location: "Nashik", rating: 4, text: "Friendly team with competitive prices. The only improvement could be adding UPI payment options, but otherwise perfect!", route: "BOM → DEL", date: "2025-12-29" },
  { id: 50, name: "Ravi Shankar", location: "Bhubaneswar", rating: 5, text: "Exceptional service! They tracked price drops for my flight and rebooked at a lower price without me even asking.", route: "BBI → DEL", date: "2025-12-28" },
  { id: 51, name: "Chitra Nambiar", location: "Kozhikode", rating: 5, text: "The search comparison feature is amazing! Showed me all available flights and the agent helped pick the best value option.", route: "CCJ → BOM", date: "2025-12-27" },
  { id: 52, name: "Devendra Pratap", location: "Kanpur", rating: 5, text: "Simple no-nonsense service. Search, compare, book on WhatsApp. No spam calls or emails like other travel portals!", route: "LKO → BLR", date: "2025-12-26" },
  { id: 53, name: "Anita Fernandes", location: "Goa", rating: 5, text: "Got incredible deals for the holiday season when all other portals were quoting sky-high prices. True lifesavers!", route: "GOI → DEL", date: "2025-12-25" },
  { id: 54, name: "Mohan Iyer", location: "Salem", rating: 4, text: "Good consistent service. I've booked 8 flights in the past year, all at great prices with zero issues.", route: "MAA → DEL", date: "2025-12-24" },
  { id: 55, name: "Jyoti Rawat", location: "Haridwar", rating: 5, text: "Even from a small city, the service is impeccable. WhatsApp-based booking is a blessing for non-tech-savvy travelers like my parents!", route: "DED → BOM", date: "2025-12-23" },
  { id: 56, name: "Ashish Chandra", location: "Meerut", rating: 5, text: "Outstanding customer care! When my flight got delayed, they proactively reached out with alternative options. That's real service!", route: "DEL → HYD", date: "2025-12-22" },
  { id: 57, name: "Kamla Devi", location: "Jodhpur", rating: 5, text: "I'm 65 years old and not good with apps. Gola Bhai Travels on WhatsApp is perfect for me. Just message and everything is done!", route: "JDH → BOM", date: "2025-12-21" },
  { id: 58, name: "Ritesh Kumar", location: "Dhanbad", rating: 5, text: "Fast, reliable, and honest. They never add hidden charges. What they quote is what you pay. Highly trustworthy!", route: "IXR → DEL", date: "2025-12-20" },
  { id: 59, name: "Vanshika Arora", location: "Faridabad", rating: 5, text: "Booked an emergency flight for my brother's wedding. Got an amazing last-minute deal. Thank you Gola Bhai Travels!", route: "DEL → CCU", date: "2025-12-19" },
  { id: 60, name: "Hemant Mishra", location: "Jabalpur", rating: 4, text: "Reliable service with good prices. The only thing I'd like is a mobile app, but WhatsApp works great too!", route: "JBP → BOM", date: "2025-12-18" },
  { id: 61, name: "Sarita Pandey", location: "Bareilly", rating: 5, text: "My husband and I traveled to Kerala and the round-trip deal was unbelievable. ₹8,000 less than Goibibo!", route: "DEL → COK", date: "2025-12-17" },
  { id: 62, name: "Dhruv Kapoor", location: "Mohali", rating: 5, text: "Tech professional here — I've compared their prices algorithmically. Gola Bhai Travels beats major platforms 8 out of 10 times!", route: "IXC → BLR", date: "2025-12-16" },
  { id: 63, name: "Padma Lakshmi", location: "Vijayawada", rating: 5, text: "The reviews are real — I checked before booking. And they delivered exactly what they promised. Five stars!", route: "VGA → DEL", date: "2025-12-15" },
  { id: 64, name: "Sachin Tendulkar R.", location: "Pune", rating: 5, text: "Named after the legend, and this service is legendary too! Best deals, fastest bookings, and friendliest agents.", route: "PNQ → GOI", date: "2025-12-14" },
  { id: 65, name: "Rashmi Sharma", location: "Gwalior", rating: 5, text: "Even for routes that are hard to find cheap flights on, they always manage to get competitive prices. Impressive!", route: "GWL → BOM", date: "2025-12-13" },
  { id: 66, name: "Vikrant Soni", location: "Ujjain", rating: 4, text: "Good service, friendly agents, and fair pricing. Nothing flashy, just solid reliable flight booking.", route: "IDR → DEL", date: "2025-12-12" },
  { id: 67, name: "Tara Singh", location: "Amritsar", rating: 5, text: "Booked flights for my entire extended family — 15 people going to a wedding in Bangalore. Seamless group booking!", route: "ATQ → BLR", date: "2025-12-11" },
  { id: 68, name: "Alok Verma", location: "Lucknow", rating: 5, text: "I run a small business and send employees on trips regularly. Gola Bhai Travels has saved me lakhs over the year!", route: "LKO → DEL", date: "2025-12-10" },
  { id: 69, name: "Sunanda Rao", location: "Mangalore", rating: 5, text: "The flight comparison is very helpful. They show options from all airlines so you can pick what suits you best.", route: "IXE → DEL", date: "2025-12-09" },
  { id: 70, name: "Mahesh Gupta", location: "Delhi", rating: 5, text: "I live in Delhi and fly 2-3 times a month. Gola Bhai Travels is my permanent travel partner. Unbeatable prices!", route: "DEL → BOM", date: "2025-12-08" },
  { id: 71, name: "Priti Kumari", location: "Ranchi", rating: 5, text: "Such a refreshing experience! No annoying popups, no fake urgency. Just honest pricing on WhatsApp. Love it!", route: "IXR → BOM", date: "2025-12-07" },
  { id: 72, name: "Ramesh Babu", location: "Visakhapatnam", rating: 4, text: "Consistent and reliable. I've used their service 10+ times and never had an issue. That says a lot!", route: "VTZ → DEL", date: "2025-12-06" },
  { id: 73, name: "Deepa Menon", location: "Thrissur", rating: 5, text: "They found me Akasa Air flights which I didn't even know flew my route! Great for discovering all available options.", route: "COK → DEL", date: "2025-12-05" },
  { id: 74, name: "Ajit Pawar", location: "Kolhapur", rating: 5, text: "Booking for senior citizen parents was made so easy. They even arranged wheelchair assistance at the airport!", route: "KLH → DEL", date: "2025-12-04" },
  { id: 75, name: "Saumya Das", location: "Jorhat", rating: 5, text: "From a small town in Assam, finding affordable flights was always a challenge. Not anymore, thanks to Gola Bhai Travels!", route: "JRH → DEL", date: "2025-12-03" },
  { id: 76, name: "Nilesh Patel", location: "Ahmedabad", rating: 5, text: "My wife and I booked our honeymoon flights through them. Got business class at economy prices somehow! Magical!", route: "AMD → GOI", date: "2025-12-02" },
  { id: 77, name: "Kriti Sanon", location: "New Delhi", rating: 5, text: "Best customer support I've experienced. They helped me past midnight for an early morning flight. True dedication!", route: "DEL → MAA", date: "2025-12-01" },
  { id: 78, name: "Sunil Das", location: "Silchar", rating: 4, text: "Helpful and patient. They explained all options clearly and let me decide without any pressure. Professional approach.", route: "IXS → CCU", date: "2025-11-30" },
  { id: 79, name: "Archana Mishra", location: "Varanasi", rating: 5, text: "Booked 20+ flights this year through Gola Bhai Travels. Consistent quality, great prices, and wonderful people!", route: "VNS → BOM", date: "2025-11-29" },
  { id: 80, name: "Kishore Rao", location: "Hubli", rating: 5, text: "The speed of service is unmatched. Sent a message, got 5 options in 3 minutes, booked in 5. That's it!", route: "HBX → BOM", date: "2025-11-28" },
  { id: 81, name: "Meenakshi Iyer", location: "Coimbatore", rating: 5, text: "My son studies in Delhi and I book his flights every month. Gola Bhai Travels always finds the cheapest option!", route: "CJB → DEL", date: "2025-11-27" },
  { id: 82, name: "Pawan Kumar", location: "Dehradun", rating: 5, text: "Trustworthy service. I've referred 15 people and they all thank me for introducing them to Gola Bhai Travels!", route: "DED → BOM", date: "2025-11-26" },
  { id: 83, name: "Shobha Rani", location: "Warangal", rating: 4, text: "Fair prices and honest service. They could improve response time on weekends but otherwise excellent!", route: "HYD → DEL", date: "2025-11-25" },
  { id: 84, name: "Dinesh Sharma", location: "Jamshedpur", rating: 5, text: "My family of 6 flew to Goa for vacation. Saved ₹18,000 total compared to online portals. Incredible savings!", route: "IXR → GOI", date: "2025-11-24" },
  { id: 85, name: "Usha Naik", location: "Belgaum", rating: 5, text: "Never knew flight booking could be this easy. Just one WhatsApp message and you're sorted. Absolutely brilliant!", route: "IXG → DEL", date: "2025-11-23" },
  { id: 86, name: "Raghav Desai", location: "Surat", rating: 5, text: "The price alerts they send for routes I frequently travel are so useful. Booked when prices dipped — saved big!", route: "STV → DEL", date: "2025-11-22" },
  { id: 87, name: "Anjali Bhargava", location: "Bhopal", rating: 5, text: "Professional, punctual, and perfectly priced. The three P's of Gola Bhai Travels. Highly recommended!", route: "BHO → BOM", date: "2025-11-21" },
  { id: 88, name: "Sumit Agarwal", location: "Kolkata", rating: 5, text: "They match prices from Skyscanner and then offer even lower! I always cross-check and they consistently win.", route: "CCU → DEL", date: "2025-11-20" },
  { id: 89, name: "Rina Ghosh", location: "Darjeeling", rating: 4, text: "Helpful team that understands small-city travelers. They even suggested the best airport to fly out of for my location!", route: "IXB → DEL", date: "2025-11-19" },
  { id: 90, name: "Vinod Kumar", location: "Patna", rating: 5, text: "My mother travels alone and the team always ensures she gets aisle seats and meal preferences set. Such attention to detail!", route: "PAT → BOM", date: "2025-11-18" },
  { id: 91, name: "Lekha Menon", location: "Calicut", rating: 5, text: "International booking was seamless! Got Delhi to Singapore tickets at an unbeatable price. Excellent global reach!", route: "CCJ → SIN", date: "2025-11-17" },
  { id: 92, name: "Arun Sharma", location: "Shimla", rating: 5, text: "Even for challenging hill-station routes, they find options. Connected me from Chandigarh with great timing and price.", route: "IXC → BLR", date: "2025-11-16" },
  { id: 93, name: "Zara Khan", location: "Hyderabad", rating: 5, text: "Modern service with a personal touch. The flight search tool is great and the WhatsApp agent makes it even better!", route: "HYD → GOI", date: "2025-11-15" },
  { id: 94, name: "Deepak Joshi", location: "Dehradun", rating: 5, text: "Booked my first flight ever through Gola Bhai Travels. They patiently walked me through everything. So grateful!", route: "DED → BLR", date: "2025-11-14" },
  { id: 95, name: "Mitali Roy", location: "Agartala", rating: 4, text: "From the remote Northeast, finding good flight deals was tough. Gola Bhai Travels changed that completely!", route: "IXA → DEL", date: "2025-11-13" },
  { id: 96, name: "Prem Chand", location: "Jammu", rating: 5, text: "Reliable service rain or shine. They've never let me down in over 25 bookings. That's saying something!", route: "IXJ → DEL", date: "2025-11-12" },
  { id: 97, name: "Farah Ahmed", location: "Lucknow", rating: 5, text: "Booked flights for my entire team's Diwali trip home. 8 different destinations, all managed perfectly! Super efficient.", route: "LKO → BOM", date: "2025-11-11" },
  { id: 98, name: "Govind Prasad", location: "Allahabad", rating: 5, text: "Honest dealing, no tricks. They told me when to book for best prices and it actually worked! Saved ₹7,000 on Varanasi trip.", route: "IXD → DEL", date: "2025-11-10" },
  { id: 99, name: "Smita Patil", location: "Nagpur", rating: 5, text: "The best part? No downloading apps, no creating accounts, no OTPs. Just WhatsApp a message and get your tickets. Simple!", route: "NAG → DEL", date: "2025-11-09" },
  { id: 100, name: "Yash Raj", location: "Mumbai", rating: 5, text: "I've been with Gola Bhai Travels since day one. They've grown but the personal service remains the same. Genuine people!", route: "BOM → DEL", date: "2025-11-08" },
];

/**
 * Get N random reviews from the list.
 */
export function getRandomReviews(count: number): Review[] {
  const shuffled = [...reviews].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get average rating from all reviews.
 */
export function getAverageRating(): number {
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Get initials from a name.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
