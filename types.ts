
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  BUSINESS = 'BUSINESS'
}

export enum Category {
  UMRAH = 'UMRAH',
  RESTAURANT = 'RESTAURANT',
  MARKET = 'MARKET',
  CLOTHING = 'CLOTHING',
  ELECTRONICS = 'ELECTRONICS',
  CARS = 'CARS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Post {
  id: string;
  userId: string;
  category: Category;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  isVip?: boolean;
  metadata: any; // Dynamic fields based on category
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface SystemStats {
  dailyUsers: number;
  totalPosts: number;
  revenue: number;
  commissions: number;
}
