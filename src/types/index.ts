// Types for TravelMom.ai

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface TourOption {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  description: string;
}

export interface Route {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  destination: string;
  childAge: string;
  duration: string;
  tags: string[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  tags: string[];
  createdAt: string;
}

export interface QuickStartForm {
  destination: string;
  dates: string;
  childrenCount: number;
  childrenAges: string;
  budget: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  location: string;
}
