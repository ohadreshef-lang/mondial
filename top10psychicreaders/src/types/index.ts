export interface PlatformRating {
  overall: number;
  psychicQuality: number;
  pricing: number;
  readingVariety: number;
  userExperience: number;
  customerSupport: number;
}

export interface PlatformPricing {
  minPerMinute: number;
  maxPerMinute: number;
  currency: string;
}

export interface SpecialOffer {
  text: string;
  code: string | null;
  expiry: string | null;
}

export interface PlatformFeatures {
  chatReadings: boolean;
  phoneReadings: boolean;
  videoReadings: boolean;
  mobileApp: boolean;
  emailReadings: boolean;
  scheduling: boolean;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  rank: number;
  logo: string;
  website: string;
  rating: PlatformRating;
  pricing: PlatformPricing;
  specialOffer: SpecialOffer;
  features: PlatformFeatures;
  readingTypes: string[];
  categories: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  advisorCount: number;
  foundedYear: number;
  satisfactionGuarantee: boolean;
  description: string;
  fullReview: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
}

export interface AffiliateConfig {
  [platformId: string]: {
    default: string;
    [landingPage: string]: string;
  };
}
