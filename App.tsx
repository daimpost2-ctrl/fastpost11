
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { CATEGORIES_CONFIG } from './constants';
import { PostCard } from './components/PostCard';
import { AdminDashboard } from './components/AdminDashboard';
import { Category, Role, Post, User } from './types';
import { generateSmartDescription } from './services/geminiService';
import { Plus, Search, Filter, Camera, X } from 'lucide-react';

// Mock Data
const MOCK_USER: User = {
  id: 'user_1',
  name: 'Ahmad Mala',
  email: 'ahmad@fastpost.iq',
  role: Role.ADMIN,
  avatar: 'https://picsum.photos/id/64/200'
};

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    category: Category.CARS,
    title: 'BMW M4 Competition 2022',
    description: 'Fresh import, low mileage, full options. Located in Suli.',
    price: 85000,
    currency: 'USD',
    images: ['https://picsum.photos/id/111/800/600'],
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
    isVip: true,
    metadata: { location: 'Sulaymaniyah', mileage: '12k', fuel: 'Petrol', gearbox: 'Auto' }
  },
  {
    id: 'p2',
    userId: 'u2',
    category: Category.RESTAURANT,
    title: 'Traditional Kurdish Quzi',
    description: 'The best slow-cooked lamb in Erbil. Family packs available.',
    price: 15000,
    currency: 'IQD',
    images: ['https://picsum.photos/id/488/800/600'],
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
    metadata: { cuisine: 'Kurdish', delivery: true, location: 'Erbil' }
  },
  {
    id: 'p3',
    userId: 'u3',
    category: Category.UMRAH,
    title: 'VIP Umrah Package - 15 Days',
    description: 'High-end hotels near Haram. 5-star service included.',
    price: 1800,
    currency: 'USD',
    images: ['https://picsum.photos/id/352/800/600'],
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    metadata: { duration: '15 days', hotels: 'Pullman Zamzam', location: 'Duhok' }
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<'en' | 'ku'>( 'en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  
  // Create Post State
  const [newPost, setNewPost] = useState({
    title: '',
    category: Category.MARKET,
    price: '',
    description: '',
    isVip: false
  });
  const [aiLoading, setAiLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: MOCK_USER.id,
      category: newPost.category,
      title: newPost.title,
      description: newPost.description,
      price: Number(newPost.price),
      currency: newPost.category === Category.CARS ? 'USD' : 'IQD',
      images: ['https://picsum.photos/800/600'],
      status: newPost.category === Category.CARS ? 'PENDING' : 'APPROVED',
      createdAt: new Date().toISOString(),
      isVip: newPost.isVip,
      metadata: { location: 'Local' }
    };
    setPosts([post, ...posts]);
    setActiveTab('home');
    setNewPost({ title: '', category: Category.MARKET, price: '', description: '', isVip: false });
  };

  const useAiDescription = async () => {
    if (!newPost.title) return;
    setAiLoading(true);
    const desc = await generateSmartDescription(newPost.category, newPost.title, {});
    setNewPost(prev => ({ ...prev, description: desc || '' }));
    setAiLoading(false);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={MOCK_USER} 
      lang={lang} 
      setLang={setLang}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {activeTab === 'home' && (
        <div className="animate-in fade-in duration-500">
          {/* Search bar */}
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder={lang === 'en' ? "Search for anything..." : "بگەڕێ بۆ هەر شتێک..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
              <Filter size={18} />
            </button>
          </div>

          {/* Categories Horizontal */}
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-4 px-4">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${!selectedCategory ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600'}`}
            >
              <div className={`p-2 rounded-xl ${!selectedCategory ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                🔥
              </div>
              <span className="text-[10px] font-bold whitespace-nowrap">All</span>
            </button>
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${selectedCategory === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600'}`}
              >
                <div className={`p-2 rounded-xl ${selectedCategory === cat.id ? 'bg-white/20' : cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold whitespace-nowrap">{lang === 'en' ? cat.label : cat.labelKu}</span>
              </button>
            ))}
          </div>

          {/* Feed Title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedCategory ? `${selectedCategory} Results` : 'Recommended for You'}
            </h2>
            <span className="text-xs text-indigo-600 font-medium">See All</span>
          </div>

          {/* Grid of Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                lang={lang} 
                onClick={() => console.log('post clicked', post.id)} 
              />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl">🧐</div>
               <p className="text-slate-500 font-medium">Nothing found. Try a different search!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="animate-in slide-in-from-bottom duration-500 max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Post</h2>
            <p className="text-sm text-slate-500">Reach thousands of buyers in Kurdistan.</p>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-6">
            {/* Image Upload Mock */}
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 transition-colors">
                <Camera className="text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold uppercase">Add Photo</span>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src="https://picsum.photos/id/10/200" alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. iPhone 15 Pro Max, 256GB"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as Category })}
                  >
                    {CATEGORIES_CONFIG.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    value={newPost.price}
                    onChange={(e) => setNewPost({ ...newPost, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Description</label>
                  <button 
                    type="button"
                    onClick={useAiDescription}
                    disabled={aiLoading || !newPost.title}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    {aiLoading ? '✨ Generating...' : '✨ Magic Write'}
                  </button>
                </div>
                <textarea 
                  rows={4}
                  required
                  placeholder="Tell buyers more about your item..."
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            {newPost.category === Category.CARS && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-500 text-sm mb-1">Paid Post Required</h4>
                <p className="text-[10px] text-yellow-700 dark:text-yellow-400 leading-relaxed">
                  Car listings require a $10 fee. Your post will be reviewed and published after payment verification.
                </p>
                <div className="mt-3 flex items-center gap-3">
                   <button type="button" className="text-xs font-bold bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-lg">Pay Now</button>
                   <span className="text-[10px] text-yellow-600">Secure payment via FastPay/FIB</span>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Post Now
            </button>
          </form>
        </div>
      )}

      {activeTab === 'dashboard' && MOCK_USER.role === Role.ADMIN && (
        <AdminDashboard posts={posts} setPosts={setPosts} />
      )}

      {activeTab === 'chat' && (
        <div className="animate-in fade-in duration-500 h-full flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mb-6">
             <Plus size={40} className="rotate-45" />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">No Conversations Yet</h2>
          <p className="text-slate-400 text-sm max-w-[240px]">Start chatting with sellers to find your next great deal.</p>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="animate-in fade-in duration-500">
           <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500 p-1 mb-4">
                 <img src={MOCK_USER.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <h2 className="text-xl font-bold dark:text-white">{MOCK_USER.name}</h2>
              <p className="text-slate-400 text-sm">{MOCK_USER.email}</p>
              <div className="mt-4 flex gap-2">
                 <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{MOCK_USER.role}</span>
                 <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">FastPost Gold</span>
              </div>
           </div>

           <div className="space-y-3">
              {[
                { label: 'My Listings', count: posts.filter(p => p.userId === MOCK_USER.id).length, icon: '📦' },
                { label: 'Favorites', count: 12, icon: '❤️' },
                { label: 'Wallet Balance', count: '$142.50', icon: '💳' },
                { label: 'Settings', icon: '⚙️' },
                { label: 'Help Center', icon: '💬' },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-sm dark:text-white">{item.label}</span>
                  </div>
                  {item.count && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">{item.count}</span>}
                </button>
              ))}
              <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold text-sm mt-8 border border-red-50 dark:border-red-900/20 rounded-2xl hover:bg-red-50 transition-colors">
                 Log Out
              </button>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
