export interface BrandingConfig {
  logoUrl: string;
  faviconUrl?: string;
  brandName: string;
  tagline: string;
}

export interface HeroConfig {
  ctaText: string;
  ctaLink: string;
  bgImage: string;
}

export interface Testimonial {
  id: number;
  name: string;
  comment: string;
  rating: number;
  image: string;
}

export interface AboutConfig {
  story: string;
  values: string[];
  showTestimonials: boolean;
  testimonials: Testimonial[];
}

export interface PromotionConfig {
  show: boolean;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  ctaText: string;
  ctaLink: string;
}

export interface ContactConfig {
  whatsapp: string;
  phone: string;
  email?: string;
  address: string;
  mapsCoords: string;
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface SiteConfig {
  branding: BrandingConfig;
  hero: HeroConfig;
  about: AboutConfig;
  promotion: PromotionConfig;
  contact: ContactConfig;
  menu: MenuItem[];
}
