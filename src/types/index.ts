// ==========================================
// SORO FABRICATIONS — Type Definitions
// ==========================================

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  icon: string;
  capabilities: string[];
  applications: string[];
  imageUrl?: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  tags: string[];
  shortDesc: string;
  description: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  hardware: string[];
  software: string[];
  imageUrl: string;
  images: string[];
  slug: string;
  featured: boolean;
}

export type ProjectCategory =
  | 'pcb-design'
  | 'pcb-assembly'
  | 'embedded-systems'
  | '3d-design'
  | '3d-printing'
  | 'cnc-fabrication'
  | 'medical-tech'
  | 'iot';

export interface Industry {
  id: string;
  title: string;
  description: string;
  applications: string[];
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  feedback: string;
  rating: number;
  isVerified: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface QuoteFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  serviceCategory: string;
  projectTitle: string;
  projectDescription: string;
  estimatedQuantity: string;
  budgetRange: string;
  deliveryDate: string;
  contactMethod: string;
  privacyConsent: boolean;
}
