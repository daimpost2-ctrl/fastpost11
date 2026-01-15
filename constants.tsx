
import React from 'react';
import { 
  Palmtree, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Shirt, 
  Laptop, 
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Search,
  User as UserIcon
} from 'lucide-react';
import { Category } from './types';

export const CATEGORIES_CONFIG = [
  { id: Category.UMRAH, label: 'Umrah', labelKu: 'عومرە', icon: <Palmtree size={24} />, color: 'bg-emerald-100 text-emerald-600' },
  { id: Category.RESTAURANT, label: 'Food', labelKu: 'چێشتخانە', icon: <Utensils size={24} />, color: 'bg-orange-100 text-orange-600' },
  { id: Category.CARS, label: 'Cars', labelKu: 'ئۆتۆمبێل', icon: <Car size={24} />, color: 'bg-blue-100 text-blue-600', isPaid: true },
  { id: Category.MARKET, label: 'Market', labelKu: 'مارکت', icon: <ShoppingBag size={24} />, color: 'bg-purple-100 text-purple-600' },
  { id: Category.CLOTHING, label: 'Clothes', labelKu: 'جل و بەرگ', icon: <Shirt size={24} />, color: 'bg-pink-100 text-pink-600' },
  { id: Category.ELECTRONICS, label: 'Tech', labelKu: 'ئەلیکترۆنیات', icon: <Laptop size={24} />, color: 'bg-indigo-100 text-indigo-600' },
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Search size={22} /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={22} /> },
  { id: 'create', label: 'Post', icon: <PlusCircle size={28} className="text-indigo-600" /> },
  { id: 'dashboard', label: 'Admin', icon: <LayoutDashboard size={22} />, adminOnly: true },
  { id: 'profile', label: 'Profile', icon: <UserIcon size={22} /> },
];
