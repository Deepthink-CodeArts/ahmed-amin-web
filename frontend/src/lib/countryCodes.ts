// src/lib/countryCodes.ts

// Primary country-name → ISO alpha-2 map (lowercase codes for FlagCDN)
export const COUNTRY_CODE_MAP: Record<string, string> = {
    // Asia
    "Bangladesh": "bd",
    "Singapore": "sg",
    "India": "in",
    "Pakistan": "pk",
    "Sri Lanka": "lk",
    "Nepal": "np",
    "Bhutan": "bt",
    "Maldives": "mv",
    "Afghanistan": "af",
    "China": "cn",
    "Hong Kong": "hk",
    "Macau": "mo",
    "Taiwan": "tw",
    "Japan": "jp",
    "South Korea": "kr",
    "North Korea": "kp",
    "Mongolia": "mn",
    "Malaysia": "my",
    "Thailand": "th",
    "Vietnam": "vn",
    "Cambodia": "kh",
    "Laos": "la",
    "Myanmar": "mm",
    "Indonesia": "id",
    "Philippines": "ph",
    "Brunei": "bn",
  
    // Middle East
    "United Arab Emirates": "ae",
    "Saudi Arabia": "sa",
    "Qatar": "qa",
    "Oman": "om",
    "Bahrain": "bh",
    "Kuwait": "kw",
    "Turkey": "tr",
    "Iran": "ir",
    "Iraq": "iq",
    "Jordan": "jo",
    "Lebanon": "lb",
    "Israel": "il",
  
    // Europe (West/North)
    "United Kingdom": "gb",
    "Ireland": "ie",
    "Iceland": "is",
    "Norway": "no",
    "Sweden": "se",
    "Finland": "fi",
    "Denmark": "dk",
    "Netherlands": "nl",
    "Belgium": "be",
    "Luxembourg": "lu",
    "France": "fr",
    "Germany": "de",
    "Switzerland": "ch",
    "Austria": "at",
    "Portugal": "pt",
    "Spain": "es",
    "Italy": "it",
  
    // Europe (Central/East/South)
    "Poland": "pl",
    "Czechia": "cz",
    "Slovakia": "sk",
    "Hungary": "hu",
    "Romania": "ro",
    "Bulgaria": "bg",
    "Greece": "gr",
    "Croatia": "hr",
    "Slovenia": "si",
    "Serbia": "rs",
    "Bosnia and Herzegovina": "ba",
    "Montenegro": "me",
    "North Macedonia": "mk",
    "Albania": "al",
    "Lithuania": "lt",
    "Latvia": "lv",
    "Estonia": "ee",
    "Ukraine": "ua",
    "Belarus": "by",
    "Moldova": "md",
    "Georgia": "ge",
    "Armenia": "am",
    "Azerbaijan": "az",
  
    // Africa
    "Egypt": "eg",
    "Morocco": "ma",
    "Algeria": "dz",
    "Tunisia": "tn",
    "Libya": "ly",
    "Ethiopia": "et",
    "Kenya": "ke",
    "Tanzania": "tz",
    "Uganda": "ug",
    "Rwanda": "rw",
    "Ghana": "gh",
    "Nigeria": "ng",
    "South Africa": "za",
    "Senegal": "sn",
    "Ivory Coast": "ci",
    "Cameroon": "cm",
  
    // Americas (North/Central/Caribbean)
    "United States": "us",
    "Canada": "ca",
    "Mexico": "mx",
    "Guatemala": "gt",
    "Belize": "bz",
    "El Salvador": "sv",
    "Honduras": "hn",
    "Nicaragua": "ni",
    "Costa Rica": "cr",
    "Panama": "pa",
    "Cuba": "cu",
    "Dominican Republic": "do",
    "Jamaica": "jm",
    "Haiti": "ht",
  
    // Americas (South)
    "Brazil": "br",
    "Argentina": "ar",
    "Chile": "cl",
    "Peru": "pe",
    "Colombia": "co",
    "Bolivia": "bo",
    "Uruguay": "uy",
    "Paraguay": "py",
    "Venezuela": "ve",
    "Ecuador": "ec",
  
    // Oceania
    "Australia": "au",
    "New Zealand": "nz",
    "Fiji": "fj",
    "Papua New Guinea": "pg",
  };
  
  // Common aliases → normalized primary key in COUNTRY_CODE_MAP
  const ALIASES: Record<string, string> = {
    // UK
    "UK": "United Kingdom",
    "Great Britain": "United Kingdom",
    "Britain": "United Kingdom",
    "England": "United Kingdom",
  
    // USA
    "USA": "United States",
    "US": "United States",
    "U.S.A.": "United States",
    "U.S.": "United States",
    "America": "United States",
  
    // Others
    "South Korea": "South Korea",
    "Republic of Korea": "South Korea",
    "Korea, South": "South Korea",
    "North Korea": "North Korea",
    "Korea, North": "North Korea",
    "UAE": "United Arab Emirates",
    "Ivory Coast": "Ivory Coast", // Côte d’Ivoire handled as Ivory Coast here
    "Cote d'Ivoire": "Ivory Coast",
    "Côte d’Ivoire": "Ivory Coast",
  };
  
  // Helper: get ISO code from a user-facing country name safely
  export function resolveCountryCode(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();
  
    // Try exact hit first
    if (COUNTRY_CODE_MAP[trimmed]) return COUNTRY_CODE_MAP[trimmed];
  
    // Try alias redirection
    if (ALIASES[trimmed]) {
      const canonical = ALIASES[trimmed];
      return COUNTRY_CODE_MAP[canonical] ?? null;
    }
  
    // Last-resort: case-insensitive exact match over primary keys
    const key = Object.keys(COUNTRY_CODE_MAP).find(
      k => k.toLowerCase() === trimmed.toLowerCase()
    );
    return key ? COUNTRY_CODE_MAP[key] : null;
  }
  