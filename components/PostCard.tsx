
import React from 'react';
import { Post, Category } from '../types';
import { Star, Clock, MapPin, CheckCircle } from 'lucide-react';

interface PostCardProps {
  post: Post;
  lang: 'en' | 'ku';
  onClick: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, lang, onClick }) => {
  const isRtl = lang === 'ku';

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={post.images[0] || 'https://picsum.photos/400/300'} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {post.isVip && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            VIP
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
          {post.category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</h3>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            ${post.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {post.description}
        </p>

        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {post.metadata.location || 'Suli'}
            </span>
          </div>
          {post.status === 'APPROVED' && (
            <CheckCircle size={14} className="text-emerald-500" />
          )}
        </div>
      </div>
    </div>
  );
};
