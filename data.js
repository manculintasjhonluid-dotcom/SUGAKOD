const buyerData = [
  {
    id: 1,
    lat: 8.37, lng: 124.86, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "Maneki-neko Cassava Trading OPC",
    address: "Lot 2 Block 14, Ansaldo Farm, San Miguel, Manolo Fortich, Bukidnon",
    products: ["Cassava"],
    status: "Potential",
    locationType: "Agricultural product wholesaler",
    phone: "+63 917 309 0852",
    geocodeQuery: "Maneki-neko Cassava Trading OPC, San Miguel, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Business listing location; confirm exact buying and receiving location",
    sourceName: "Public business listing",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Maneki-neko+Cassava+Trading+OPC+Manolo+Fortich",
    notes: "Listed as an agricultural product wholesaler. Contact the business to confirm whether it currently buys cassava directly from local farmers, including accepted varieties, quality requirements, volume, and payment terms."
  },
  {
    id: 2,
    lat: 8.356, lng: 124.813, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "POLCAS Agri Trade",
    address: "Damilag, Manolo Fortich, Bukidnon",
    products: ["Cassava", "Corn", "Copra", "Copra cake", "Rice"],
    status: "Potential",
    locationType: "Agricultural trading business",
    phone: "+63 935 941 9092",
    geocodeQuery: "POLCAS Agri Trade, Damilag, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Approximate business area; confirm exact receiving location",
    sourceName: "Public business information and Metrobank Sustainability Report",
    sourceUrl: "https://web-assets.metrobank.com.ph/1715316393-test-2023-metrobank-sustainability-report.pdf",
    notes: "Public information describes POLCAS as a business that connects farmers with markets and buys agricultural produce. Contact the business to verify its current crop requirements, buying schedule, prices, and payment arrangements."
  },
  {
    id: 3,
    lat: 8.37, lng: 124.86, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "AGRI DE ORO VMB MARKETING",
    address: "Puerto area, Manolo Fortich, Bukidnon",
    products: ["Agricultural products"],
    status: "Potential",
    locationType: "Agricultural trading lead",
    phone: "",
    geocodeQuery: "AGRI DE ORO VMB MARKETING, Puerto, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Approximate area; exact business address and receiving location need confirmation",
    sourceName: "Project team lead list (not yet verified)",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=AGRI+DE+ORO+VMB+MARKETING+Manolo+Fortich",
    notes: "Potential agricultural trading contact. Direct purchasing, accepted crops, business address, and contact details need confirmation before farmers arrange deliveries."
  },
  {
    id: 4,
    lat: 8.37, lng: 124.86, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "NSL AGRI TRADING",
    address: "Manolo Fortich, Bukidnon",
    products: ["Agricultural products"],
    status: "Potential",
    locationType: "Agricultural trading lead",
    phone: "",
    geocodeQuery: "NSL AGRI TRADING, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Municipality-level location; exact business premises need confirmation",
    sourceName: "Project team lead list (not yet verified)",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=NSL+AGRI+TRADING+Manolo+Fortich",
    notes: "Potential agricultural trading contact. Confirm its current operations, accepted commodities, direct farmer purchasing arrangements, and exact business location."
  },
  {
    id: 5,
    lat: 8.15, lng: 125.0, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "Bio Green Processing and Manufacturing, Inc.",
    address: "Bukidnon, Philippines",
    products: ["Cassava"],
    status: "Regional lead",
    locationType: "Regional processing company",
    phone: "",
    locationAccuracy: "Province-level location; exact facility location needs confirmation",
    sourceName: "Department of Agriculture Region 10",
    sourceUrl: "https://cagayandeoro.da.gov.ph/index.php/da-engages-r-10-cassava-buyers-to-address-pricing-concerns/",
    notes: "Identified by DA Region 10 among cassava buyer leads during a September 2026 meeting. Contact the company to verify its current purchasing activity, delivery requirements, and whether it accepts produce from Manolo Fortich farmers."
  },
  {
    id: 6,
    lat: 8.15, lng: 125.0, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "Phil Agro Industrial Corporation",
    address: "Bukidnon, Philippines",
    products: ["Cassava"],
    status: "Regional lead",
    locationType: "Regional agricultural industry lead",
    phone: "",
    locationAccuracy: "Province-level location; exact facility location needs confirmation",
    sourceName: "Department of Agriculture Region 10",
    sourceUrl: "https://cagayandeoro.da.gov.ph/index.php/da-engages-r-10-cassava-buyers-to-address-pricing-concerns/",
    notes: "Identified by DA Region 10 among cassava buyer leads. Current direct purchasing, accepted quality, delivery arrangements, and payment terms must be confirmed."
  },
  {
    id: 7,
    lat: 8.5, lng: 124.65, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "San Miguel Foods, Inc.",
    address: "Misamis Oriental, Philippines",
    products: ["Cassava", "Agricultural raw materials"],
    status: "Regional lead",
    locationType: "Regional food and agricultural company",
    phone: "",
    locationAccuracy: "Province-level location; exact receiving facility needs confirmation",
    sourceName: "Department of Agriculture Region 10",
    sourceUrl: "https://cagayandeoro.da.gov.ph/index.php/da-engages-r-10-cassava-buyers-to-address-pricing-concerns/",
    notes: "Identified by DA Region 10 among potential cassava buyer leads. This listing does not confirm that the company currently purchases directly from individual farmers. Verify its supplier requirements and receiving arrangements."
  },
  {
    id: 8,
    lat: 8.5, lng: 124.65, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "Daesang Philippines, Corp.",
    address: "Misamis Oriental, Philippines",
    products: ["Cassava"],
    status: "Regional lead",
    locationType: "Regional food processing company",
    phone: "",
    locationAccuracy: "Province-level location; exact receiving facility needs confirmation",
    sourceName: "Department of Agriculture Region 10",
    sourceUrl: "https://cagayandeoro.da.gov.ph/index.php/da-engages-r-10-cassava-buyers-to-address-pricing-concerns/",
    notes: "Identified by DA Region 10 among potential cassava buyer leads. Confirm current purchasing activity, crop specifications, supplier eligibility, and delivery requirements."
  },
  {
    id: 9,
    lat: 8.356, lng: 124.813, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "Traders Market Site",
    address: "P-18, Menzi, Damilag, Manolo Fortich, 8703 Bukidnon, Philippines",
    products: ["Vegetables", "Fresh produce"],
    status: "Potential",
    locationType: "Vegetable wholesaler",
    phone: "+63 994 454 0421",
    geocodeQuery: "Traders Market Site, P-18 Menzi, Damilag, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Public business listing location; confirm exact receiving entrance",
    sourceName: "Public business listing",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Traders+Market+Site+Damilag+Manolo+Fortich",
    notes: "Listed as a vegetable wholesaler. Potential outlet for local vegetable growers. Contact first to confirm whether it buys directly from farmers, which vegetables it accepts, required quantities, and buying schedule."
  },
  {
    id: 10,
    lat: 8.41, lng: 124.79, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "WR Fresh Vegetables",
    address: "Zone II, Alae, Manolo Fortich, 8703 Bukidnon, Philippines",
    products: ["Vegetables", "Fresh fruits"],
    status: "Potential",
    locationType: "Fruit and vegetable wholesaler",
    phone: "+63 935 303 2894",
    geocodeQuery: "WR Fresh Vegetables, Zone II, Alae, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Public business listing location; confirm exact receiving entrance",
    sourceName: "Public business listing",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=WR+Fresh+Vegetables+Alae+Manolo+Fortich",
    notes: "Listed as a fruit and vegetable wholesaler. Direct farmer purchasing and current crop requirements need confirmation."
  },
  {
    id: 11,
    lat: 8.37, lng: 124.86, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "M's Fresh Hydro Picks",
    address: "N.R. Ver Street, Tankulan, Manolo Fortich, Bukidnon, Philippines",
    products: ["Fresh vegetables", "Hydroponic produce"],
    status: "Potential",
    locationType: "Vegetable wholesale market",
    phone: "+63 955 014 9002",
    geocodeQuery: "M's Fresh Hydro Picks, N.R. Ver Street, Tankulan, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Public business listing location; confirm exact receiving entrance",
    sourceName: "Public business listing",
    sourceUrl: "https://www.google.com/maps/search/?api=1&query=Ms+Fresh+Hydro+Picks+Tankulan+Manolo+Fortich",
    notes: "Listed as a vegetable wholesale market. Potential outlet for fresh produce. Contact first to confirm whether it accepts produce from other farmers, its quality standards, and purchasing arrangements."
  },
  {
    id: 12,
    lat: 8.37, lng: 124.86, coordsVerified: false, // approximate area; set coordsVerified: true only after confirming the exact spot
    name: "Anakciano Incorporated",
    address: "Manolo Fortich, Bukidnon, Philippines",
    products: ["Corn", "Grains", "Feed ingredients"],
    status: "Potential",
    locationType: "Agribusiness / poultry integrator",
    phone: "",
    geocodeQuery: "Anakciano Incorporated, Manolo Fortich, Bukidnon, Philippines",
    locationAccuracy: "Approximate municipality-level location; confirm exact facility and receiving entrance",
    sourceName: "Bukidnon Statistical Yearbook 2025 and public business listing",
    sourceUrl: "https://bukidnon.gov.ph/wp-content/uploads/2025/10/BUK-SYB-2025-2024-Data.pdf",
    notes: "Listed in the Bukidnon Statistical Yearbook as a poultry integrator. It may be relevant to corn and feed-ingredient supply chains, but direct purchasing from local farmers is not confirmed. Verify its actual raw-material procurement process before referring farmers."
  }
];

const priceData = [
  {
    id: 1,
    commodity: "Palay (Dry)",
    price: "₱19.98",
    unit: "kg",
    priceType: "Farmgate",
    location: "Bukidnon",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Reported farmgate price. Use as a reference only; actual prices may vary by municipality, variety, moisture content, and grain quality."
  },
  {
    id: 2,
    commodity: "Palay (Dry)",
    price: "₱21.64",
    unit: "kg",
    priceType: "Farmgate",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Regional farmgate reference. This is not necessarily the price offered by buyers in Manolo Fortich."
  },
  {
    id: 3,
    commodity: "Fresh Cassava",
    price: "₱3.00–₱3.50",
    unit: "kg",
    priceType: "Buyer-reported",
    location: "Northern Mindanao",
    date: "September 17, 2026",
    source: "Department of Agriculture Region 10",
    sourceUrl: "https://cagayandeoro.da.gov.ph/index.php/da-engages-r-10-cassava-buyers-to-address-pricing-concerns/",
    notes: "Buyer-reported price information discussed during a DA Region 10 meeting. Confirm the current offer, variety, quality standards, delivery costs, and deductions directly with the buyer."
  },
  {
    id: 4,
    commodity: "Rice (Special)",
    price: "₱65.90",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Retail reference price. This is not a farmgate price or a direct buyer offer to farmers."
  },
  {
    id: 5,
    commodity: "Rice (Well-Milled)",
    price: "₱57.27",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Retail reference price. Actual prices vary by store, location, and rice classification."
  },
  {
    id: 6,
    commodity: "Rice (Regular-Milled)",
    price: "₱51.52",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Retail reference price. Do not interpret this as the price farmers receive for palay."
  },
  {
    id: 7,
    commodity: "Tomato",
    price: "₱111.64",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Regional retail reference price. Actual market prices may change depending on supply, quality, and location."
  },
  {
    id: 8,
    commodity: "Eggplant",
    price: "₱89.00",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Regional retail reference price, not a confirmed farmgate or wholesale buying price."
  },
  {
    id: 9,
    commodity: "Native Pechay",
    price: "₱107.25",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Regional retail reference price. Prices offered to farmers may be different."
  },
  {
    id: 10,
    commodity: "Carrot",
    price: "₱103.20",
    unit: "kg",
    priceType: "Retail",
    location: "Northern Mindanao",
    date: "September 2026",
    source: "Philippine Statistics Authority (PSA)",
    sourceUrl: "https://psa.gov.ph/",
    notes: "Regional retail reference price. Actual prices depend on grade, quality, and market conditions."
  }
];

const cropData = [
  {
    id: 1,
    name: "Corn",
    icon: "🌽",
    description: "An important agricultural crop used for food, livestock feed, and other agricultural products.",
    plantingReminder: "Check the recommended variety, planting schedule, soil condition, and local weather before planting.",
    harvestReminder: "Harvest at the appropriate maturity and dry grains properly to help maintain quality.",
    marketReminder: "Ask potential buyers about moisture content, quality standards, volume requirements, and current buying prices."
  },
  {
    id: 2,
    name: "Cassava",
    icon: "🥔",
    description: "A root crop used for food, starch, animal feed, and various processed products.",
    plantingReminder: "Use healthy planting materials and prepare well-drained soil.",
    harvestReminder: "Harvest according to the variety and intended market. Handle roots carefully to reduce damage.",
    marketReminder: "Confirm buyer requirements for variety, size, freshness, delivery schedule, and minimum volume before harvesting."
  },
  {
    id: 3,
    name: "Rice",
    icon: "🌾",
    description: "A major food crop and an important source of livelihood for many farming households.",
    plantingReminder: "Follow the recommended planting calendar and proper water and nutrient management practices.",
    harvestReminder: "Harvest at the recommended maturity and dry palay properly before storage or delivery.",
    marketReminder: "Compare farmgate offers and check moisture content, grain quality, weighing procedures, and payment terms."
  },
  {
    id: 4,
    name: "Vegetables",
    icon: "🥬",
    description: "A broad crop group that includes leafy vegetables, fruit vegetables, and other fresh produce.",
    plantingReminder: "Choose suitable varieties and consider the local climate, soil condition, and water availability.",
    harvestReminder: "Harvest at the correct maturity and use clean containers to minimize bruising and spoilage.",
    marketReminder: "Contact traders and wholesalers before harvesting to confirm demand, grades, packaging, quantities, and delivery arrangements."
  }
];

const resourceData = [
  { name: "Manolo Fortich Digital Agriculture Marketplace", description: "The existing local marketplace. SUGAKOD complements it and does not replace it.", url: "", contact: "" },
  { name: "Municipal Agriculture Office, Manolo Fortich", description: "Local agricultural services, technical assistance, and farmer programs.", url: "", contact: "" },
  { name: "Department of Agriculture Region 10", description: "Regional announcements, programs, and buyer or price information for Northern Mindanao.", url: "https://cagayandeoro.da.gov.ph/", contact: "" },
  { name: "Philippine Statistics Authority (PSA)", description: "Official agricultural price and production statistics.", url: "https://psa.gov.ph/", contact: "" },
  { name: "Provincial Government of Bukidnon", description: "Provincial publications, statistics, and agricultural information.", url: "https://bukidnon.gov.ph/", contact: "" }
];