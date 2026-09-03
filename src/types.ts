export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  period: string;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
  isPopular?: boolean;
  features: string[];
  disclaimer?: string;
}

export interface AddonPricing {
  id: string;
  name: string;
  priceDisplay: string;
  description: string;
  bullets: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
  highlight: string;
}

export interface ProductFeature {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  badge: string;
  statsText?: string;
  ctaText: string;
  accentColor: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SiteConfig {
  brandName: string;
  brandTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  currencySymbol: string;
  supportEmail: string;
  supportPhone: string;
  companyAddress: string;
  announcementText: string;
  showAnnouncement: boolean;
  pricing: {
    starterMonthly: number;
    starterAnnual: number;
    proMonthly: number;
    proAnnual: number;
    payrollMonthlyBase: number;
    payrollPerEmployee: number;
    cardProcessingRate: string;
    achProcessingRate: string;
  };
  stats: {
    usersCount: string;
    moneyManaged: string;
    averageRating: string;
    invoicesSent: string;
  };
}
