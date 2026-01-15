
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, FileText, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getMarketInsights } from '../services/geminiService';
import { Post, Category } from '../types';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface AdminDashboardProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, setPosts }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoadingInsights(true);
      const res = await getMarketInsights({
        totalPosts: posts.length,
        pending: posts.filter(p => p.status === 'PENDING').length,
        carRevenue: posts.filter(p => p.category === Category.CARS).length * 10
      });
      setInsights(res);
      setIsLoadingInsights(false);
    };
    fetchInsights();
  }, [posts.length]);

  const stats = [
    { label: 'Active Users', value: '1,240', icon: <Users className="text-blue-600" />, trend: '+12%' },
    { label: 'Total Posts', value: posts.length, icon: <FileText className="text-purple-600" />, trend: '+5%' },
    { label: 'Revenue', value: `$${posts.length * 10 + 450}`, icon: <DollarSign className="text-emerald-600" />, trend: '+18%' },
    { label: 'Conversions', value: '24%', icon: <TrendingUp className="text-orange-600" />, trend: '+2%' },
  ];

  const handlePostAction = (postId: string, status: 'APPROVED' | 'REJECTED') => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Hub</h2>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold uppercase">SuperAdmin</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{stat.icon}</div>
              <span className="text-[10px] font-bold text-emerald-500">{stat.trend}</span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            <div className="text-xl font-bold dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} />
            <h3 className="font-bold text-lg">AI Market Insights</h3>
          </div>
          {isLoadingInsights ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : (
            <ul className="space-y-3">
              {insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-indigo-100">
                  <span className="mt-1.5 w-1 h-1 bg-white rounded-full flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2">
             Weekly Revenue 
            <span className="text-xs font-normal text-slate-400">(Auto-calculated)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center justify-between">
            Pending Approvals
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
              {posts.filter(p => p.status === 'PENDING').length} Action Required
            </span>
          </h3>
          <div className="space-y-3">
            {posts.filter(p => p.status === 'PENDING').map(post => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold line-clamp-1 dark:text-white">{post.title}</div>
                    <div className="text-[10px] text-slate-400">{post.category} • ${post.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePostAction(post.id, 'APPROVED')} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                    <CheckCircle size={18} />
                  </button>
                  <button onClick={() => handlePostAction(post.id, 'REJECTED')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
            {posts.filter(p => p.status === 'PENDING').length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                All clear! No pending posts.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
