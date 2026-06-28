import { useEffect, useMemo, useRef, useState } from "react";

const instagramUrl = "https://instagram.com/tornado_mk4";
const businessEmail = "tornado.jetta@gmail.com";
const stripePaymentUrl = "https://buy.stripe.com/5kQ14farE6P3h1nfzQfAc01";
const jotformEmbedUrl = "https://form.jotform.com/261356888735069";

const productFeatures = [
  { icon: "📱", title: "Apple CarPlay", description: "Use maps, music, calls, and messages from your iPhone directly on the touchscreen display." },
  { icon: "🤖", title: "Android Auto", description: "Connect your Android phone for navigation, music apps, hands-free calling, and everyday driving tools." },
  { icon: "🧩", title: "Android 10 System", description: "Runs on Android 10, giving the radio a familiar app-style interface with flexible settings and features." },
  { icon: "🎵", title: "Bluetooth Audio", description: "Stream music wirelessly and take hands-free calls without messy extra cables." },
  { icon: "📷", title: "Backup Camera Included", description: "Comes with a 12 LED rear-view camera for a cleaner and safer reversing setup." },
  { icon: "🎙️", title: "External Microphone", description: "Includes an external microphone for clearer hands-free calls compared to relying only on the built-in mic." },
  { icon: "🔌", title: "USB Input", description: "Use USB for charging, music playback, compatible files, and simple everyday connection options." },
  { icon: "💾", title: "Micro SD Support", description: "Use a micro SD card for extra media options, files, and compatible storage features." },
  { icon: "🎮", title: "Gaming Console Compatible", description: "Supports compatible external video input setups, making it possible to connect certain gaming consoles." },
  { icon: "🖼️", title: "Custom Wallpapers", description: "Personalize the screen with custom backgrounds to match your car, brand, or interior style." },
  { icon: "💡", title: "Custom Button Lighting", description: "Adjust the backlit button colors to better match your dashboard, interior lighting, or personal style." },
  { icon: "🎛️", title: "Remote Control Included", description: "Control basic radio functions with the included remote for simple passenger use." },
];

const heroBubbleFeatures = [
  { icon: "📱", title: "Apple CarPlay", subtitle: "Maps, music, calls, and messages" },
  { icon: "🤖", title: "Android Auto", subtitle: "Easy connection for Android users" },
  { icon: "📷", title: "Camera Included", subtitle: "Backup camera comes in the package" },
  { icon: "🎙️", title: "External Mic", subtitle: "Clearer hands-free calls" },
  { icon: "💡", title: "Custom Lighting", subtitle: "Adjustable backlit button colors" },
  { icon: "🖼️", title: "Custom Wallpapers", subtitle: "Personalize the radio screen" },
  { icon: "🎮", title: "Gaming Compatible", subtitle: "Supports compatible video input setups" },
  { icon: "💾", title: "Micro SD + USB", subtitle: "Flexible media and file options" },
];

const vehicleDatabase = {
  Acura: ["CL", "ILX", "Integra", "MDX", "RDX", "RL", "RSX", "TL", "TLX", "TSX"],
  "Alfa Romeo": ["4C", "Giulia", "Spider", "Stelvio"],
  Audi: ["80", "90", "A3", "A4", "A5", "A6", "A7", "A8", "Allroad", "Q3", "Q5", "Q7", "R8", "RS4", "RS6", "S3", "S4", "S5", "TT"],
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "M3", "M4", "M5", "X1", "X3", "X5", "Z3", "Z4"],
  Buick: ["Century", "Enclave", "Encore", "LaCrosse", "LeSabre", "Lucerne", "Regal", "Rendezvous"],
  Cadillac: ["ATS", "CTS", "DeVille", "DTS", "Escalade", "Seville", "SRX", "STS", "XTS"],
  Chevrolet: ["Astro", "Avalanche", "Blazer", "Camaro", "Cobalt", "Colorado", "Corvette", "Cruze", "Equinox", "Express", "HHR", "Impala", "Malibu", "Monte Carlo", "S-10", "Silverado 1500", "Silverado 2500HD", "Suburban", "Tahoe", "Trailblazer", "Traverse", "Volt"],
  Chrysler: ["200", "300", "300M", "Concorde", "Crossfire", "Pacifica", "PT Cruiser", "Sebring", "Town & Country"],
  Dodge: ["Avenger", "Caliber", "Challenger", "Charger", "Dakota", "Dart", "Durango", "Grand Caravan", "Journey", "Magnum", "Neon", "Nitro", "Ram 1500", "Ram 2500", "Ram 3500", "Stratus", "Viper"],
  Fiat: ["124 Spider", "500", "500L", "500X", "Punto"],
  Ford: ["Bronco", "Crown Victoria", "E-Series", "Edge", "Escape", "Escort", "Excursion", "Expedition", "Explorer", "F-150", "F-250", "F-350", "Fiesta", "Focus", "Fusion", "Mustang", "Probe", "Ranger", "Taurus", "Thunderbird", "Transit"],
  Genesis: ["G70", "G80", "G90", "GV70", "GV80"],
  GMC: ["Acadia", "Canyon", "Envoy", "Jimmy", "Safari", "Savana", "Sierra 1500", "Sierra 2500HD", "Terrain", "Yukon", "Yukon XL"],
  Honda: ["Accord", "Civic", "Civic del Sol", "CR-V", "CR-Z", "Element", "Fit", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Prelude", "Ridgeline", "S2000"],
  Hummer: ["H1", "H2", "H3", "H3T"],
  Hyundai: ["Accent", "Elantra", "Genesis", "Genesis Coupe", "Kona", "Palisade", "Santa Fe", "Sonata", "Tiburon", "Tucson", "Veloster"],
  Infiniti: ["G20", "G35", "G37", "I30", "I35", "M35", "M45", "Q50", "Q60", "QX4", "QX50", "QX56", "QX60"],
  Isuzu: ["Amigo", "Ascender", "Axiom", "Hombre", "Rodeo", "Trooper", "VehiCROSS"],
  Jaguar: ["F-Type", "S-Type", "X-Type", "XE", "XF", "XJ", "XJ8", "XJR", "XJS", "XK", "XKR"],
  Jeep: ["Cherokee", "CJ", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Liberty", "Patriot", "Renegade", "Wrangler", "Wrangler Unlimited"],
  Kia: ["Forte", "K5", "Optima", "Rio", "Sedona", "Sorento", "Soul", "Spectra", "Sportage", "Stinger", "Telluride"],
  "Land Rover": ["Defender", "Discovery", "Freelander", "LR2", "LR3", "LR4", "Range Rover", "Range Rover Sport"],
  Lexus: ["CT", "ES", "GS", "GX", "IS", "LS", "LX", "NX", "RC", "RX", "SC"],
  Lincoln: ["Aviator", "Continental", "LS", "MKC", "MKS", "MKX", "MKZ", "Navigator", "Town Car"],
  Mazda: ["2", "3", "5", "6", "B-Series", "CX-3", "CX-5", "CX-7", "CX-9", "MazdaSpeed3", "MazdaSpeed6", "Miata", "MPV", "MX-5 Miata", "Protege", "RX-7", "RX-8", "Tribute"],
  Mercedes: ["190E", "C-Class", "CL-Class", "CLA", "CLK", "CLS", "E-Class", "G-Class", "GL-Class", "GLA", "GLC", "GLE", "GLK", "M-Class", "S-Class", "SL", "SLK", "Sprinter"],
  Mercury: ["Cougar", "Grand Marquis", "Marauder", "Mariner", "Milan", "Mountaineer", "Sable", "Villager"],
  Mini: ["Clubman", "Convertible", "Cooper", "Cooper Hardtop", "Countryman", "Paceman", "Roadster"],
  Mitsubishi: ["3000GT", "Diamante", "Eclipse", "Galant", "Lancer", "Lancer Evolution", "Mirage", "Montero", "Outlander", "Raider"],
  Nissan: ["200SX", "240SX", "300ZX", "350Z", "370Z", "Altima", "Armada", "Cube", "Frontier", "GT-R", "Juke", "Leaf", "Maxima", "Murano", "Pathfinder", "Quest", "Rogue", "Sentra", "Titan", "Versa", "Xterra"],
  Oldsmobile: ["88", "Achieva", "Alero", "Aurora", "Bravada", "Cutlass", "Intrigue", "Silhouette"],
  Plymouth: ["Breeze", "Colt", "Grand Voyager", "Laser", "Neon", "Prowler", "Voyager"],
  Pontiac: ["Aztek", "Bonneville", "Fiero", "Firebird", "G5", "G6", "G8", "Grand Am", "Grand Prix", "GTO", "Solstice", "Sunfire", "Trans Am", "Vibe"],
  Porsche: ["911", "924", "928", "944", "968", "Boxster", "Cayenne", "Cayman", "Macan", "Panamera"],
  Ram: ["1500", "2500", "3500", "ProMaster", "ProMaster City"],
  Saab: ["9-2X", "9-3", "9-5", "9-7X", "900", "9000"],
  Saturn: ["Astra", "Aura", "Ion", "L-Series", "Outlook", "Relay", "S-Series", "Sky", "Vue"],
  Scion: ["FR-S", "iA", "iM", "iQ", "tC", "xA", "xB", "xD"],
  Subaru: ["Ascent", "Baja", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "SVX", "Tribeca", "WRX", "WRX STI", "XV Crosstrek"],
  Suzuki: ["Aerio", "Equator", "Forenza", "Grand Vitara", "Kizashi", "Samurai", "Sidekick", "Swift", "SX4", "Vitara", "XL7"],
  Toyota: ["4Runner", "86", "Avalon", "Camry", "Celica", "Corolla", "Cressida", "Echo", "FJ Cruiser", "GR86", "Highlander", "Land Cruiser", "Matrix", "MR2", "Prius", "RAV4", "Sequoia", "Sienna", "Solara", "Supra", "Tacoma", "Tundra", "Venza", "Yaris"],
  Volkswagen: ["Arteon", "Atlas", "Beetle", "Cabrio", "Cabriolet", "CC", "Corrado", "Eos", "EuroVan", "Golf", "Golf Alltrack", "Golf R", "GTI", "Jetta", "Jetta GLI", "New Beetle", "Passat", "Phaeton", "Rabbit", "R32", "Routan", "Scirocco", "Tiguan", "Touareg", "Vanagon"],
  Volvo: ["240", "740", "850", "940", "960", "C30", "C70", "S40", "S60", "S70", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"],
};

const vehicleMakes = Object.keys(vehicleDatabase).sort();

const productSpecs = [
  { label: "Screen Size", value: "7-inch touchscreen" },
  { label: "Install Size", value: "Universal double DIN, 178mm × 100mm / 7.01in × 3.94in" },
  { label: "Phone Connection", value: "Wired / wireless Apple CarPlay and Android Auto" },
  { label: "Bluetooth", value: "Bluetooth 5.1 with hands-free calling and music streaming" },
  { label: "Camera", value: "12 LED rear-view backup camera included" },
  { label: "Mirror Link", value: "Wired phone mirroring for compatible iOS and Android devices" },
  { label: "Audio Expansion", value: "RCA outputs for amplifier, subwoofer, and monitor connections" },
  { label: "Included Items", value: "Radio, rear camera, camera cable, remote, harness, brackets, screws, and manual" },
];

const packageItems = [
  "Upgraded double DIN touchscreen radio",
  "12 LED rear-view backup camera",
  "Backup camera cable",
  "Remote control",
  "Wiring harness",
  "Two mounting brackets",
  "Four screws",
  "English user manual",
];

const checkoutSteps = [
  { number: "01", title: "Check fitment", text: "Enter your year, make, and model so the order starts with the right vehicle information." },
  { number: "02", title: "Submit order details", text: "Send your vehicle and contact details so the correct radio package, bezel, and harness can be matched to the order." },
  { number: "03", title: "Complete secure payment", text: "Stripe handles card payment securely after the order details are submitted." },
];

const policies = [
  { icon: "📦", title: "Shipping Policy", text: "Timely orders are prepared for same-day shipping, with delivery expected in 4 days or less after the order details and payment are received." },
  { icon: "🔁", title: "30-Day Replacement Policy", text: "If a radio arrives defective or does not work properly, contact us within 30 days so the issue can be reviewed and the right replacement path can be handled." },
  { icon: "🛡️", title: "Support", text: "Customers receive help with product questions, basic setup questions, and defect-related support. Physical damage, misuse, water damage, altered wiring, or modified units are not covered." },
  { icon: "🧰", title: "Fitment & Installation", text: "Radios are made for standard double DIN openings. Vehicle-specific bezels, dash kits, and harness adapters are matched to the order when needed. Installation is not included." },
  { icon: "💳", title: "Payment Policy", text: "Payments are handled through Stripe secure checkout. Order details are collected through Jotform so payment and fulfillment information can be matched before shipping." },
  { icon: "📩", title: "Support Contact", text: "For order questions, warranty questions, or product support, email tornado.jetta@gmail.com or message @tornado_mk4 on Instagram. Instagram is usually the fastest way to reach us." },
];

const faqs = [
  { question: "Will this fit my car?", answer: "Our radios are made for standard double DIN radio openings. Use the fitment checker above to enter your year, make, and model before placing your order." },
  { question: "Do I need a dash kit?", answer: "Most vehicles need a vehicle-specific bezel, dash kit, or harness adapter. The order form collects your vehicle info so the correct parts can be matched to your kit." },
  { question: "Does it come with wiring?", answer: "The goal is to include the radio plus the vehicle-specific harness or adapter needed for a cleaner install. Some vehicles may still need minor wiring or trim work." },
  { question: "Is installation included?", answer: "Installation is not included because products are shipped directly to customers. Many customers can handle the install themselves or have a local audio shop install it." },
  { question: "How fast does it ship?", answer: "Orders are prepared after fitment details and payment are received. Delivery timing depends on the radio, vehicle-specific parts, and carrier timing." },
  { question: "What if it does not work?", answer: "If your radio arrives defective or does not work properly, contact support within 30 days so the issue can be reviewed and the right replacement path can be handled." },
  { question: "Is there a warranty?", answer: "A 30-day replacement policy is included for defective units. Physical damage, misuse, water damage, altered wiring, or modified units are not covered." },
  { question: "How do I pay?", answer: "Payments are handled through Stripe secure checkout. Stripe lets customers pay online without sharing card details directly with us." },
  { question: "How do I contact you after ordering?", answer: "You can contact us by email at tornado.jetta@gmail.com. For the fastest support, you can also message @tornado_mk4 on Instagram." },
];

const testimonials = [
  { name: "Jake M.", car: "2004 Volkswagen Jetta GLI", review: "Honestly blew my mind for the price. The CarPlay connects in like 2 seconds and the backup camera is way clearer than I expected. Install took me about an hour with the included harness. 10/10 would buy again.", rating: 5 },
  { name: "Priya S.", car: "2006 Honda Civic EX", review: "I was nervous about wiring it up but the harness matched perfectly and the instructions were solid. The custom wallpapers are such a nice touch — I put a vintage Civic one on there and it looks factory. Love it.", rating: 5 },
  { name: "Marcus T.", car: "2008 BMW 328i", review: "DM'd @tornado_mk4 before ordering because I wasn't sure about the fitment in my E90. Got a same-day reply with exactly what I needed. The radio fits clean, no gaps, and the Bluetooth audio quality is surprisingly good for calls and music.", rating: 5 },
];

const guides = [
  {
    slug: "does-carplay-work-with-any-car",
    title: "Does Apple CarPlay Work With Any Car?",
    excerpt: "Apple CarPlay works in most vehicles with a double DIN opening. Here's how to check if your car is compatible and what you might need for a clean install.",
    category: "Fitment",
    readTime: "4 min",
    body: [
      "Apple CarPlay doesn't require a brand-new car. It works in most vehicles with a standard double DIN radio opening — that's the roughly 7-inch wide by 4-inch tall dash opening found in most cars built since the early 2000s.",
      "The easiest way to check your fitment is to measure your current radio opening or look up your vehicle's factory radio size. Most Hondas, Toyotas, Volkswagens, BMWs, and domestic trucks from 2000 onward use a double DIN opening.",
      "If your car has a single DIN opening (about 2 inches tall), you'll need a dash kit to fill the extra space. Many aftermarket kits include these, but it's worth confirming before ordering.",
      "Factory premium sound systems (like Harman Kardon, Bose, or Beats) may need a special harness adapter to integrate with an aftermarket radio. These are usually available for most popular vehicles.",
      "The bottom line: if your car has a double DIN opening and you're okay with a basic wiring harness swap, CarPlay is a straightforward upgrade. Use our fitment checker above to confirm your specific vehicle.",
    ],
  },
  {
    slug: "carplay-vs-android-auto",
    title: "Apple CarPlay vs Android Auto: Which One Do You Need?",
    excerpt: "Both systems mirror your phone to your car's screen, but they work differently. Here's what to know before choosing your next radio upgrade.",
    category: "Buying Guide",
    readTime: "5 min",
    body: [
      "Apple CarPlay and Android Auto do the same basic thing — they put your phone's apps on your car's touchscreen for safer driving. But they're built for different phones.",
      "CarPlay is for iPhone users. It gives you a simplified iOS-style interface with Maps, Music, Messages, and phone calls. It works wired or wirelessly depending on the radio.",
      "Android Auto is for Android users. It gives you Google Maps, Google Assistant, Spotify, and other apps in a driver-friendly layout. It also works wired or wirelessly.",
      "Most modern aftermarket radios support both systems, so you don't have to choose. If you switch phones later, the radio still works.",
      "The main difference is the navigation app. CarPlay defaults to Apple Maps (though Google Maps and Waze are supported too). Android Auto uses Google Maps.",
      "For most buyers, the choice comes down to which phone you carry. Either way, a modern touchscreen radio with both systems gives you the best of both worlds.",
    ],
  },
  {
    slug: "how-to-install-double-din-radio",
    title: "How to Install a Double DIN Radio: Step by Step",
    excerpt: "Installing a double DIN radio is a weekend project most people can handle. Here's what you'll need and what to expect during the install.",
    category: "Installation",
    readTime: "6 min",
    body: [
      "Installing a double DIN radio is one of the most common DIY car upgrades. Most people with basic tools can handle it in 1-2 hours.",
      "What you'll need: a trim removal tool (or flathead screwdriver with a cloth), a socket set (usually 10mm), wire strippers, and electrical tape or heat shrink tubing.",
      "Step 1: Disconnect the car battery. Always do this first to avoid short circuits or airbag warnings.",
      "Step 2: Remove the factory radio trim. Most clips out gently with a trim tool. Some vehicles have screws hidden behind the ashtray or cup holders.",
      "Step 3: Remove the factory radio bolts and slide the old unit out. Take a photo of the wiring before disconnecting anything.",
      "Step 4: Connect the new wiring harness. Most aftermarket radios use a universal harness that connects to your car's factory plug. Vehicle-specific harnesses are available for a plug-and-play experience.",
      "Step 5: Slide the new radio into the dash, secure with brackets, and reconnect the battery. Test everything before putting the trim back.",
      "If you're not comfortable with wiring, a local car audio shop can usually install a double DIN radio for $50-150 depending on the area.",
    ],
  },
  {
    slug: "best-carplay-radio-for-volkswagen-mk4",
    title: "Best CarPlay Radio for Volkswagen MK4 Jetta & Golf",
    excerpt: "The MK4 platform is one of the most popular cars for aftermarket radio upgrades. Here's what to look for when choosing a CarPlay radio for your MK4.",
    category: "Vehicle-Specific",
    readTime: "5 min",
    body: [
      "The Volkswagen MK4 platform (Jetta, Golf, GTI, GLI, New Beetle) is one of the most popular cars for aftermarket radio upgrades. The factory radios in these cars are showing their age, and a modern CarPlay upgrade completely transforms the interior.",
      "MK4s use a double DIN opening, so most modern touchscreen radios fit without modification. The main consideration is the dash kit — you'll want a kit that fills the gaps around the new radio for a factory-looking fit.",
      "Wiring harness adapters for the MK4 are widely available and make the install plug-and-play. No cutting factory wires required.",
      "One thing to watch: some MK4s have a factory amplifier in the trunk. If your car has the premium sound system, you'll need a harness that integrates with the amp or bypass it.",
      "Backup camera integration is a big upgrade for MK4s. Most of these cars never had a factory camera, so adding one with a new radio is a huge safety improvement.",
      "For MK4 owners, the upgrade path is well-documented and parts are affordable. It's one of the easiest cars to get a clean, modern CarPlay setup in.",
    ],
  },
  {
    slug: "carplay-radio-backup-camera-guide",
    title: "How to Set Up a Backup Camera With Your CarPlay Radio",
    excerpt: "Adding a backup camera to an older car is one of the safest upgrades you can make. Here's how it works with a modern CarPlay radio.",
    category: "Installation",
    readTime: "4 min",
    body: [
      "A backup camera is one of the most practical upgrades for any car, especially older models that never had a factory camera. Most modern CarPlay radios include a camera input.",
      "The camera mounts near your license plate or rear bumper. Most aftermarket cameras are universal and fit any vehicle with a clean mounting surface.",
      "The camera cable runs from the rear of the car to the radio. In most sedans and hatchbacks, you can route it through the trunk lining and under the door sill trim.",
      "When you shift into reverse, the radio automatically switches to the camera feed. When you shift back to drive, it returns to CarPlay or Android Auto.",
      "Most backup camera kits include everything you need: the camera, a long cable, and mounting hardware. Some cameras include parking guide lines that adjust with your steering wheel.",
      "If your CarPlay radio package includes a backup camera, it's already matched to the radio's input. No extra adapters needed.",
    ],
  },
  {
    slug: "wireless-vs-wired-carplay",
    title: "Wireless vs Wired CarPlay: Which Is Better in 2026?",
    excerpt: "Wireless CarPlay is the standard in 2026, but wired still has its place. Here's an honest comparison of both so you can choose the right radio.",
    category: "Buying Guide",
    readTime: "6 min",
    body: [
      "One of the most common questions we get is: 'Should I get a wireless CarPlay radio, or is wired CarPlay good enough?' The short answer: wireless CarPlay is absolutely worth it in 2026. The technology has matured, the latency is negligible, and the convenience of just getting in your car and having CarPlay connect automatically is a game-changer.",
      "Wireless CarPlay uses Bluetooth for the initial handshake and Wi-Fi (5GHz) for the actual data transfer. The whole process takes about 5-10 seconds from turning the key to having CarPlay on your screen. Wired CarPlay uses a USB cable and launches in 1-2 seconds, plus it charges your phone.",
      "Here's the thing: almost every modern CarPlay radio offers BOTH wireless and wired CarPlay. You're not choosing one or the other — you get both in a single unit. Use wireless for daily driving convenience, and keep a USB cable as backup for long trips or if wireless doesn't connect on the first try.",
      "The one real downside of wireless is battery drain. Wireless CarPlay uses about 5-10% of your battery per hour. On long drives, you might actually lose charge. The fix is simple: a wireless charging pad gives you the best of both worlds.",
      "Audio quality? In a car, you cannot tell the difference between wireless and wired. Road noise, wind noise, and engine noise mask any subtle differences. Bluetooth AAC 256kbps is transparent for 99% of listeners.",
      "Our recommendation: get a radio with wireless + wired CarPlay. The small price difference is worth it for the convenience alone. In 2026, there's no reason to settle for wired-only.",
    ],
  },
  {
    slug: "carplay-vs-bluetooth",
    title: "Why CarPlay Is Better Than Bluetooth Alone",
    excerpt: "Bluetooth audio is fine for music, but CarPlay gives you navigation, messaging, and a full app interface. Here's why it's worth the upgrade.",
    category: "Buying Guide",
    readTime: "4 min",
    body: [
      "If your car already has Bluetooth, you might wonder if CarPlay is worth it. The short answer: yes, especially if you use navigation or messaging in the car.",
      "Bluetooth audio is one-way: music and phone calls. You still have to look at your phone for maps, texts, and app controls. That's the dangerous part.",
      "CarPlay puts everything on your car's touchscreen. Maps with turn-by-turn directions, music controls, message previews, and Siri or Google Assistant voice control — all without touching your phone.",
      "The safety difference is real. Navigation on a phone mounted to your windshield is distracting. A 7-inch screen at eye level in your dash is much better.",
      "CarPlay also supports more apps than basic Bluetooth: podcast apps, audiobooks, WhatsApp, Waze, Google Maps, Spotify, and more.",
      "If your car is from 2010 or earlier, it probably doesn't have Bluetooth either. A CarPlay radio gives you both Bluetooth and the full smart interface in one upgrade.",
    ],
  },
  {
    slug: "carplay-vs-factory-navigation",
    title: "CarPlay Radio vs Factory Navigation: Worth It?",
    excerpt: "Factory navigation systems from 2015 and earlier are outdated. Here's why a CarPlay upgrade is better than built-in GPS.",
    category: "Buying Guide",
    readTime: "5 min",
    body: [
      "Factory navigation systems rely on pre-loaded map data that was current when your car was manufactured. Updating them requires a dealer visit or SD card — and after a few years, updates stop entirely.",
      "No real-time data. Factory nav doesn't show traffic congestion, road closures, police speed traps, or dynamic routing the way Waze or Google Maps does.",
      "CarPlay and Android Auto solve this with always-updating maps, real-time traffic, and app integration. Your music, podcasts, and messaging apps are all on the screen.",
      "Voice control that actually works. Siri and Google Assistant understand natural language — send messages, change music, get directions without touching your phone.",
      "For most cars built before 2018, a CarPlay radio is a massive upgrade over factory navigation — all for less than the cost of a single dealer map update.",
      "The upgrade is especially worth it for daily drivers. The time saved with real-time traffic alone pays for the radio within a few months.",
    ],
  },

  {
    slug: "best-carplay-for-honda-civic",
    title: "Best CarPlay Radio for Honda Civic (2001-2021)",
    excerpt: "The Honda Civic is one of the most popular cars for CarPlay upgrades. Here's what to look for by generation.",
    category: "Vehicle-Specific",
    readTime: "5 min",
    body: [
      "The Honda Civic is one of the most popular cars in America and one of the best candidates for a CarPlay upgrade. Most Civics from 2001 onward use a double DIN radio opening.",
      "Huge aftermarket support means dash kits, wiring harnesses, and trim pieces are available for every generation. Parts are affordable and easy to find.",
      "7th Gen (2001-2005): One of the first Civics with double DIN. A CarPlay radio fits cleanly with a basic dash kit.",
      "8th & 9th Gen (2006-2015): Two-tier dash design. A CarPlay radio replaces the lower section while the upper display continues to function normally.",
      "10th Gen (2016-2021): Higher trims have factory CarPlay. If your Civic has the base 5-inch radio, upgrading to a full CarPlay touchscreen is a huge improvement.",
      "Most Civic owners can handle the install in 1-2 hours with basic tools. Not comfortable with DIY? A local shop installs a CarPlay radio for $75-150.",
    ],
  },
  {
    slug: "top-5-budget-carplay-radios-under-150",
    title: "Top 5 Budget CarPlay Radios Under $150 in 2026",
    excerpt: "You don't need to spend $500+ to get a great CarPlay radio. Here are the best budget options that actually deliver on features, reliability, and daily driving experience.",
    category: "Buying Guide",
    readTime: "7 min",
    body: [
      "The CarPlay radio market has changed a lot in the last two years. You no longer need to spend $400-600 to get a reliable unit with wireless CarPlay, a responsive touchscreen, and a backup camera. There are now solid options under $150 that check all the boxes for daily driving.",
      "We tested and compared budget CarPlay radios based on four criteria: screen quality, wireless CarPlay reliability, included accessories (backup camera, harness, microphone), and real-world user feedback. Here are our top 5 picks.",
      "#1 - Universal Double DIN Android 10 CarPlay Radio ($109-129): The best overall value in budget CarPlay. You get wireless AND wired CarPlay, Android Auto, a 7-inch touchscreen, Bluetooth 5.1, a 12 LED backup camera, external microphone, and custom wallpaper support - all for under $130. The Android 10 operating system means the interface feels familiar and responsive. Screen brightness is good enough for daytime driving, and the capacitive touchscreen is noticeably better than older resistive screens. Best for: Anyone who wants the most features per dollar. This is the sweet spot for most car owners.",
      "#2 - Single DIN Flip-Out CarPlay Screen ($89-109): If your car has a single DIN opening (about 2 inches tall), a flip-out screen is your best bet. The screen flips down and rotates to reveal a 7-inch CarPlay display, then tucks away when you park. The trade-off is a smaller screen than a full double DIN unit, and the moving parts mean one more thing that could eventually wear out. But for trucks, older cars, and vehicles with limited dash space, this is a clean solution. Best for: Single DIN vehicles, trucks, and anyone who wants a hidden screen when parked.",
      "#3 - 10.1-Inch Floating Touchscreen ($119-149): The big-screen option. A 10.1-inch display that mounts on top of your dash gives you a modern, Tesla-style look. These work with both single and double DIN vehicles since the screen sits above the factory radio. The larger screen is great for maps and media, but it can block some dash vents and may look out of place in smaller cars. Installation is simpler since you are not removing the factory radio - just mounting the new screen and connecting a few cables. Best for: People who want a big screen without replacing the factory radio.",
      "#4 - Name-Brand Entry-Level CarPlay Radio ($129-149): Pioneer, Kenwood, and Sony all have entry-level CarPlay radios in the $130-150 range. You get brand-name reliability, better audio processing, and warranty support - but fewer features at the same price point. These units typically have smaller screens (6.2-6.8 inches), wired-only CarPlay at this price, and no included backup camera. The audio quality is noticeably better though, especially if you have upgraded your speakers. Best for: Audiophiles and people who prioritize sound quality and brand trust over screen size.",
      "#5 - Budget 7-Inch CarPlay Radio ($79-99): The ultra-budget option. These no-name 7-inch units get the job done for wireless CarPlay and basic media, but expect compromises: slower processors, dimmer screens, and hit-or-miss wireless connectivity. At this price, you are usually not getting a backup camera included, and the build quality is noticeably cheaper. But if your budget is firm at $100 and you just want CarPlay in your daily driver, these work. Best for: Strict budgets and secondary vehicles where premium features are not a priority.",
      "The bottom line: for most people, the universal double DIN Android 10 radio at $109-129 is the best value. You get every feature that matters - wireless CarPlay, backup camera, Bluetooth 5.1, custom wallpapers - at a price that is hard to beat. The name-brand options are worth considering if audio quality is your top priority, but for daily driving, the feature-per-dollar winner is clear.",
      "Whatever you choose, make sure the seller offers vehicle-specific fitment support. A $109 radio that does not fit your dash is a $109 mistake. Always confirm your year, make, and model before ordering.",
    ],
  },
];

const nextSteps = [
  { icon: "🚗", title: "Vehicle-specific fitment", text: "Your year, make, and model are checked before the order is fulfilled." },
  { icon: "🧩", title: "Matched parts", text: "The radio, bezel, dash kit, and harness are matched around your vehicle when needed." },
  { icon: "💳", title: "Secure checkout", text: "Order details are collected separately from payment so the kit can be matched correctly." },
  { icon: "📩", title: "Real support", text: "Questions can go straight to @tornado_mk4 before or after ordering." },
];

const aboutHighlights = [
  "Recent college graduate",
  "European car enthusiast",
  "MK4 Volkswagen content creator",
  "Into cars, bikes, and clean OEM+ style upgrades",
];

function JotformOrderForm() {
  return (
    <iframe
      title="Radio Order Details Form"
      src={jotformEmbedUrl}
      className="h-[720px] w-full rounded-[1.5rem] border-0 bg-white"
      allowFullScreen
    />
  );
}

export default function App() {
  const [fitment, setFitment] = useState({ year: "", make: "", model: "" });
  const [fitmentChecked, setFitmentChecked] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [heroBubbleIndex, setHeroBubbleIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const faqRefs = useRef([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroBubbleIndex((currentIndex) => (currentIndex + 1) % heroBubbleFeatures.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  const activeHeroBubble = heroBubbleFeatures[heroBubbleIndex];
  const selectedMakeKey = vehicleMakes.find((make) => make.toLowerCase() === fitment.make.trim().toLowerCase());

  const makeSuggestions = useMemo(() => {
    const search = fitment.make.trim().toLowerCase();
    if (!search) return vehicleMakes.slice(0, 12);
    return vehicleMakes.filter((make) => make.toLowerCase().includes(search)).slice(0, 12);
  }, [fitment.make]);

  const modelOptions = selectedMakeKey ? vehicleDatabase[selectedMakeKey] : [];
  const selectedModelKey = modelOptions.find((model) => model.toLowerCase() === fitment.model.trim().toLowerCase());

  const modelSuggestions = useMemo(() => {
    const search = fitment.model.trim().toLowerCase();
    if (!selectedMakeKey) return [];
    if (!search) return modelOptions.slice(0, 18);
    return modelOptions.filter((model) => model.toLowerCase().includes(search)).slice(0, 18);
  }, [fitment.model, modelOptions, selectedMakeKey]);

  const vehicleName = `${fitment.year} ${fitment.make} ${fitment.model}`.trim();
  const stripeCheckoutLabel = fitmentChecked && vehicleName ? `Secure checkout for ${vehicleName}` : "Secure Stripe Checkout";
  const showMakeSuggestions = activeField === "make" && makeSuggestions.length > 0 && !selectedMakeKey;
  const showModelSuggestions = activeField === "model" && selectedMakeKey && modelSuggestions.length > 0 && !selectedModelKey;

  function handleFitmentSubmit(event) {
    event.preventDefault();
    setFitmentChecked(true);
    setActiveField(null);
  }

  function selectMake(make) {
    setFitment({ ...fitment, make, model: "" });
    setFitmentChecked(false);
    setActiveField("model");
  }

  function selectModel(model) {
    setFitment({ ...fitment, model });
    setFitmentChecked(false);
    setActiveField(null);
  }

  function toggleFaq(index) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  function handlePageClick(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href")?.replace("#", "");
    const targetElement = targetId ? document.getElementById(targetId) : null;
    if (!targetElement) return;

    event.preventDefault();
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main onClick={handlePageClick} className="min-h-screen overflow-x-hidden bg-slate-50 pb-28 text-slate-900 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#home" className="flex items-center gap-2 font-bold tracking-tight text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">🚗</span>
            CarPlay Radio Hub
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#about" className="transition hover:text-blue-600">About Me</a>
            <a href="#products" className="transition hover:text-blue-600">Products</a>
            <a href="#guides" className="transition hover:text-blue-600">Guides</a>
            <a href="#specs" className="transition hover:text-blue-600">Specs</a>
            <a href="#checkout" className="transition hover:text-blue-600">Checkout</a>
            <a href="#faq" className="transition hover:text-blue-600">FAQ</a>
            <a href="#policies" className="transition hover:text-blue-600">Policies</a>
            <a href="#gallery" className="transition hover:text-blue-600">Gallery</a>
            <a href="#contact" className="transition hover:text-blue-600">Contact</a>
          </div>

          <a href={stripePaymentUrl} target="_blank" rel="noreferrer" className="hidden rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 md:inline-flex">
            Order Kit
          </a>
        </nav>
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-28">
          <div className="w-[calc(100vw-2.5rem)] min-w-0 max-w-2xl sm:w-auto">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              Fitment-first ordering for double DIN radio kits
            </div>

            <h1 className="max-w-full text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Upgrade your car with Apple CarPlay & Android Auto.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Modern Android 10 touchscreen radio kits with wireless Apple CarPlay, Android Auto, Bluetooth 5.1, USB, micro SD, custom wallpapers, backlit button lighting, and a 12 LED backup camera included. Rated 5V preouts for amplifier and subwoofer expansion. Enter your vehicle info first so the right radio package, bezel, and harness can be matched before checkout.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <a href="#fitment-checker" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Check Fitment</a>
              <a href="#checkout" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-600">Checkout</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-700">💬 Questions</a>
            </div>

            <div className="mt-8 flex max-w-full flex-wrap gap-3 text-sm font-semibold text-slate-600">
              {[
                "Apple CarPlay",
                "Android Auto",
                "Android 10",
                "Bluetooth 5.1",
                "Backup Camera Included",
                "External Microphone",
                "USB Input",
                "Micro SD Support",
                "Mirror Link",
                "Custom Wallpapers",
                "Custom Button Lighting",
                "Remote Included",
                "Gaming Console Compatible",
                "RCA Audio Expansion",
                "Fitment Checked",
              ].map((feature) => (
                <span key={feature} className="max-w-full rounded-full bg-white px-4 py-2 shadow-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-[calc(100vw-2.5rem)] min-w-0 sm:w-auto">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/50">
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-inner">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Now Playing</p>
                    <p className="font-semibold">Wireless Drive Mix</p>
                  </div>
                  <div className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold">CarPlay</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-blue-600 p-5 shadow-lg shadow-blue-900/30"><div className="mb-8 text-3xl">📱</div><p className="text-sm font-semibold">Maps, music, calls, and messages on screen</p></div>
                  <div className="rounded-2xl bg-slate-800 p-5"><div className="mb-8 text-3xl">🎵</div><p className="text-sm font-semibold">Bluetooth audio with easy controls</p></div>
                  <div className="rounded-2xl bg-slate-800 p-5"><div className="mb-8 text-3xl">📷</div><p className="text-sm font-semibold">Backup camera included in the package</p></div>
                  <div className="rounded-2xl bg-slate-800 p-5"><div className="mb-8 text-3xl">💡</div><p className="text-sm font-semibold">Custom wallpapers and button lighting</p></div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-xl md:-left-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
              <p className="text-3xl font-black text-slate-950">$109.99</p>
            </div>

            <div className="absolute -right-3 -top-6 hidden w-64 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">
              <div key={activeHeroBubble.title} className="animate-pulse">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-700">{activeHeroBubble.icon}</span>
                  <div><p className="text-sm font-bold text-slate-950">{activeHeroBubble.title}</p><p className="text-xs text-slate-500">{activeHeroBubble.subtitle}</p></div>
                </div>

                <div className="flex gap-1.5">
                  {heroBubbleFeatures.map((feature, index) => (
                    <span key={feature.title} className={`h-1.5 rounded-full transition-all ${index === heroBubbleIndex ? "w-6 bg-blue-600" : "w-1.5 bg-slate-200"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[420px] bg-slate-950 p-6 text-white md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(148,163,184,0.25),transparent_35%)]" />
              <div className="relative flex h-full min-h-[360px] flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Photo Placeholder</p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight">Add a picture of you with your MK4 here.</h3>
                  <p className="mt-4 leading-7 text-slate-200">This spot is made for a real photo of you and the car so the site feels personal, authentic, and connected to your Instagram page.</p>
                </div>

                <div className="mt-8 rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Suggested image</p>
                  <p className="mt-1 text-sm font-bold">You standing next to the Tornado Red MK4 Jetta GLI, or a clean rolling/parking shot with you in frame.</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 lg:p-10">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">About Me</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Built by someone who is actually in the car scene.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">I’m a recent college graduate, a European car enthusiast, and the person behind @tornado_mk4 on Instagram. A lot of my content is centered around my Tornado Red MK4 Volkswagen Jetta GLI, car projects, clean upgrades, and the kind of small details that make older cars feel modern again.</p>
              <p className="mt-4 leading-7 text-slate-600">I started offering these radios because a simple Apple CarPlay and Android Auto upgrade can completely change the way an older interior feels. Whether you drive a Volkswagen, BMW, Honda, truck, daily, project car, or something oddball, the goal is to make the process simple, affordable, and easy to understand.</p>
              <p className="mt-4 leading-7 text-slate-600">Outside of MK4 content, I have a real passion for European cars, bikes, and enthusiast builds in general. This site is meant to feel less like a random product page and more like buying from someone who understands why these upgrades matter.</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {aboutHighlights.map((highlight) => <div key={highlight} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">✅ {highlight}</div>)}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600">Visit @tornado_mk4</a>
                <a href="#checkout" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-300 hover:text-blue-700">Go to Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Product Features</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Everything drivers want in a modern touchscreen radio.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">A clean upgrade for older interiors with the everyday features people actually use: maps, music, calls, camera support, external microphone, lighting customization, and flexible media options.</p>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50 px-6 py-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">Radio package</p>
            <p className="mt-1 text-3xl font-black text-slate-950">$109.99</p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-bold">
              <a href="#fitment-checker" className="text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">Check your fitment below</a>
              <a href="#checkout" className="text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950">Pay through Stripe</a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productFeatures.map((feature) => (
            <article key={feature.title} className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition group-hover:bg-blue-50">{feature.icon}</div>
              <h3 className="text-lg font-black text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>

        <div id="fitment-checker" className="mt-8 overflow-visible rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
            <div className="bg-slate-950 p-6 text-white md:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-300">Instant Fitment Check</p>
              <h3 className="mt-3 text-3xl font-black tracking-tight">Check your vehicle fitment.</h3>
              <p className="mt-4 leading-7 text-slate-300">Enter your year, make, and model. The menu includes a wide mix of domestic, import, European, older, newer, common, and enthusiast vehicles.</p>

              <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-200">
                <div className="rounded-2xl bg-white/10 p-4">✅ Extensive make and model suggestions</div>
                <div className="rounded-2xl bg-white/10 p-4">✅ Common, rare, foreign, and domestic platforms</div>
                <div className="rounded-2xl bg-white/10 p-4">✅ Backup camera included with package</div>
              </div>

              <a href={instagramUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-slate-950">Questions? DM @tornado_mk4</a>
            </div>

            <div className="p-6 pb-28 md:p-8">
              <form onSubmit={handleFitmentSubmit} className="grid gap-4">
                <div>
                  <label htmlFor="year" className="mb-2 block text-sm font-bold text-slate-700">Year</label>
                  <input id="year" type="text" inputMode="numeric" placeholder="Example: 2008" value={fitment.year} onChange={(event) => { setFitment({ ...fitment, year: event.target.value }); setFitmentChecked(false); }} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="relative">
                  <label htmlFor="make" className="mb-2 block text-sm font-bold text-slate-700">Make</label>
                  <input id="make" type="text" placeholder="Start typing: Volkswagen, Honda, Ford, Saab..." value={fitment.make} autoComplete="off" onFocus={() => setActiveField("make")} onBlur={() => window.setTimeout(() => setActiveField(null), 120)} onChange={(event) => { setFitment({ ...fitment, make: event.target.value, model: "" }); setFitmentChecked(false); setActiveField("make"); }} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />

                  {showMakeSuggestions && (
                    <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">Complete your selection</div>
                      {makeSuggestions.map((make) => (
                        <button key={make} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectMake(make)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"><span>{make}</span><span className="text-xs font-bold text-slate-400">Select</span></button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="model" className="mb-2 block text-sm font-bold text-slate-700">Model</label>
                  <input id="model" type="text" placeholder={selectedMakeKey ? `Select or type a ${selectedMakeKey} model` : "Choose a make first"} value={fitment.model} autoComplete="off" disabled={!fitment.make.trim()} onFocus={() => setActiveField("model")} onBlur={() => window.setTimeout(() => setActiveField(null), 120)} onChange={(event) => { setFitment({ ...fitment, model: event.target.value }); setFitmentChecked(false); setActiveField("model"); }} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60" />

                  {showModelSuggestions && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">{selectedMakeKey} model options</div>
                      {modelSuggestions.map((model) => (
                        <button key={model} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectModel(model)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"><span>{model}</span><span className="text-xs font-bold text-slate-400">Select</span></button>
                      ))}
                    </div>
                  )}

                  {activeField === "model" && fitment.make.trim() && !selectedMakeKey && <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 shadow-lg">Select a make from the suggestions first to unlock preset model options.</div>}
                </div>

                <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Check Fitment</button>
              </form>

              {fitmentChecked && (
                <div className="mt-6 rounded-[1.5rem] border border-green-200 bg-green-50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white">✓</span>
                    <div>
                      <h4 className="font-black text-green-900">Good news, your vehicle is a valid fit.</h4>
                      <p className="mt-2 text-sm leading-6 text-green-800">{vehicleName || "Your vehicle"} is compatible with this Apple CarPlay and Android Auto radio package. Continue to checkout to place the order.</p>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <a href="#checkout" className="inline-flex rounded-full bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800">Continue to Checkout</a>
                        <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-green-300 bg-white px-5 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-100">DM @tornado_mk4</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-500">Fitment note: most standard double DIN vehicles can be supported, but exact parts can vary by vehicle. Submit your year, make, and model before checkout.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="specs" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Product Details</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Built for a clean, modern double DIN upgrade.</h2>
          <p className="mt-4 text-slate-600">This package is designed around a universal double DIN touchscreen radio with wired and wireless phone connection options, Bluetooth calling, mirror link support, rear camera support, and expansion outputs for future audio upgrades. Vehicle-specific parts are matched after the customer submits year, make, and model.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {productSpecs.map((spec) => <div key={spec.label} className="rounded-3xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-blue-600">{spec.label}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{spec.value}</p></div>)}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">What Comes In The Box</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Complete radio package.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">The package includes the main radio and the key accessories needed for the setup. Vehicle-specific dash kits, trim pieces, or extra wiring may vary depending on the car.</p>
            <div className="mt-6 grid gap-3">
              {packageItems.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">✓</span>{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="checkout" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Checkout</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Submit details, then pay securely.</h2>
          <p className="mt-4 text-slate-600">Submit your vehicle details first, then complete secure payment through Stripe. This keeps the order matched to the right car before the package is prepared.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Radio Package</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">CarPlay / Android Auto Radio Package</h3>
            <p className="mt-3 text-slate-600">Includes the 7-inch touchscreen radio, 12 LED backup camera, backup camera cable, remote control, wiring harness, mounting brackets, screws, Android 10 system, Bluetooth 5.1, USB, micro SD support, custom wallpapers, and custom button lighting.</p>

            <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold text-slate-300">Sale price</p>
              <p className="mt-1 text-4xl font-black">$109.99</p>
              <p className="mt-2 text-sm text-slate-300">Regular price $150. Fitment details are collected before fulfillment.</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">🔒 Secure Checkout</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">📦 4-Day Delivery</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">🔄 30-Day Replacement</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">📷 Camera Included</span>
            </div>

            <div className="mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-sm font-black text-blue-900">Vehicle-specific order matching</p>
              <p className="mt-1 text-sm leading-6 text-blue-800">Submit your year, make, and model first so the right radio package and vehicle-specific parts can be matched before fulfillment. Backup camera is included.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Order & Payment</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Finish your order.</h3>
            <p className="mt-3 text-slate-600">First, submit the order details form. Then complete secure payment through Stripe. Jotform collects fitment details while Stripe handles payment.</p>

            {fitmentChecked && vehicleName && (
              <div className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
                <p className="text-sm font-black text-green-900">Vehicle selected</p>
                <p className="mt-1 text-sm font-semibold text-green-800">{vehicleName}</p>
                <p className="mt-2 text-xs leading-5 text-green-700">Add this vehicle information again inside the Jotform if prompted.</p>
              </div>
            )}

            <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-4">
              <p className="mb-4 text-sm font-black text-slate-950">Step 1: Submit order details</p>
              <JotformOrderForm />
            </div>

            <a href={stripePaymentUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-7 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              Step 2: {stripeCheckoutLabel}
            </a>

            <p className="mt-3 text-center text-xs font-semibold text-slate-500">Order details are collected through Jotform. Secure payment is powered by Stripe and opens in a new tab.</p>

            <div className="mt-7 grid gap-3">
              {checkoutSteps.map((step) => (
                <div key={step.number} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xs font-black text-white">{step.number}</span>
                  <div>
                    <p className="font-black text-slate-950">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-black text-amber-900">Order matching note</p>
              <p className="mt-2 text-sm leading-6 text-amber-800">Use the same name and email on the order form and Stripe checkout so your vehicle details can be matched to your payment.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Common questions before you order.</h2>
          <p className="mt-4 text-slate-600">Here are the main things customers usually want to know about fitment, shipping, installation, payment, and warranty support.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const contentMaxHeight = isOpen ? (faqRefs.current[index]?.scrollHeight ?? 500) : 0;
            return (
              <article key={faq.question} className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg font-black text-slate-950">{faq.question}</h3>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg font-bold transition-all duration-300 ${isOpen ? "border-blue-300 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-400"}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  ref={(el) => { faqRefs.current[index] = el; }}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: `${contentMaxHeight}px` }}
                >
                  <p className="px-6 pb-6 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[2rem] border border-blue-200 bg-blue-50 p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Still have a question?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">Message @tornado_mk4 on Instagram or email tornado.jetta@gmail.com for product questions, warranty questions, order help, or anything specific to your car.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`mailto:${businessEmail}`} className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-100">Email Support</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600">DM @tornado_mk4</a>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Customer Reviews</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">What buyers are saying.</h2>
          <p className="mt-4 text-slate-600">Real messages from customers who've installed the radio in their own cars. These are the kind of DMs we get almost every day.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.car}</p>
                </div>
              </div>
              <div className="mb-3 text-sm tracking-wide">
                {"⭐".repeat(testimonial.rating)}
              </div>
              <p className="text-sm leading-6 text-slate-600">{testimonial.review}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="guides" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Buying Guides</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Everything you need to know before upgrading your car radio.</h2>
          <p className="mt-4 text-slate-600">Real guides on fitment, installation, and choosing the right CarPlay or Android Auto setup for your vehicle.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <article key={guide.slug} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{guide.category}</span>
                <span className="text-xs text-slate-400">{guide.readTime} read</span>
              </div>
              <h3 className="text-lg font-black text-slate-950">{guide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
              <div className="mt-4 space-y-2">
                {guide.body.slice(0, 2).map((paragraph, i) => (
                  <p key={i} className="text-xs leading-5 text-slate-500">{paragraph}</p>
                ))}
              </div>
              <a href="#checkout" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-800">
                Shop CarPlay Radios →
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-blue-200 bg-blue-50 p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Ready to upgrade your car?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">Check your vehicle fitment and order a complete CarPlay / Android Auto radio kit with backup camera included.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#fitment-checker" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Check Fitment</a>
              <a href="#checkout" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600">Order Now</a>
            </div>
          </div>
        </div>
      </section>

      <section id="policies" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Store Policies</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Shipping, warranty, and support information.</h2>
          <p className="mt-4 text-slate-600">These policies explain how orders are shipped, how replacements work, what is covered, and how customers can get support after ordering.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <article key={policy.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-3xl">{policy.icon}</div>
              <h3 className="text-lg font-black text-slate-950">{policy.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{policy.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl font-black">Need help with an order?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Keep your order details, payment confirmation, and vehicle information ready when contacting support.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`mailto:${businessEmail}`} className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-100">Email Support</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-slate-950">DM @tornado_mk4</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">How Ordering Works</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">A cleaner way to order a vehicle-specific radio kit.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {nextSteps.map((section) => <div key={section.title} className="rounded-[1.5rem] bg-slate-50 p-5"><div className="text-3xl">{section.icon}</div><h3 className="mt-4 font-black text-slate-950">{section.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{section.text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Gallery</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Product photos and install examples.</h2>
          <p className="mt-4 text-slate-600">A closer look at the packaging, screen, install, and camera. Swap these placeholders with real photos when ready.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "📦", title: "Product Packaging", desc: "Close-up of the boxed radio and included accessories." },
            { icon: "🖥️", title: "Screen Wallpaper Demo", desc: "Custom wallpaper running on the 7-inch touchscreen." },
            { icon: "🔧", title: "Installed in Dash", desc: "Radio mounted in a double DIN opening, clean fit." },
            { icon: "📷", title: "Backup Camera View", desc: "12 LED rear-view camera feed on the screen." },
          ].map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl transition group-hover:from-blue-50 group-hover:to-slate-100">
                {item.icon}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Contact</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Questions about the product or warranty?</h2>
          <p className="mt-4 max-w-2xl text-slate-600">Use the fitment checker above to check your vehicle and checkout to place your order. For product details, warranty questions, ordering help, or anything else, email tornado.jetta@gmail.com or message me on Instagram at @tornado_mk4.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#fitment-checker" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Go to Fitment Checker</a>
            <a href="#checkout" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600">Go to Checkout</a>
            <a href={`mailto:${businessEmail}`} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-300 hover:text-blue-700">Email Support</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-300 hover:text-blue-700">DM @tornado_mk4</a>
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-400/30 backdrop-blur md:hidden">
        <div className="pointer-events-auto grid grid-cols-2 gap-2">
          <a href="#fitment-checker" className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">Check Fitment</a>
            <a href="#checkout" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600 animate-[pulse_2s_ease-in-out_infinite]">Order Kit</a>
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-slate-500">Fitment first • Vehicle-specific parts matched before fulfillment</p>
      </div>
    </main>
  );
}
