import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Send,
  Image,
  Smile,
  TrendingUp,
  Eye,
  MessageCircle,
  User,
  Verified,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { NeuCard } from '../Neumorphism/NeuCard';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface SocialWidgetProps {
  posts?: Array<{
    id: string;
    user: {
      name: string;
      username: string;
      avatar: string;
      isVerified?: boolean;
      level?: number;
    };
    content: {
      text: string;
      images?: string[];
      type: 'text' | 'photo' | 'video';
    };
    metrics: {
      likes: number;
      comments: number;
      shares: number;
      views: number;
    };
    isLiked?: boolean;
    isSaved?: boolean;
    timestamp: Date;
    location?: string;
    tags?: string[];
  }>;
  className?: string;
  onPostClick?: (postId: string) => void;
  onLikeClick?: (postId: string) => void;
  onSaveClick?: (postId: string) => void;
  onShareClick?: (postId: string) => void;
  onCreatePost?: () => void;
}

export const SocialWidget: React.FC<SocialWidgetProps> = ({
  posts = [],
  className,
  onPostClick,
  onLikeClick,
  onSaveClick,
  onShareClick,
  onCreatePost,
}) => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins}м назад`;
    if (diffHours < 24) return `${diffHours}ч назад`;
    if (diffDays < 7) return `${diffDays}д назад`;
    return date.toLocaleDateString();
  };

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    onLikeClick?.(postId);
  };

  const toggleSave = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    onSaveClick?.(postId);
  };

  return (
    <div className={className}>
      {/* Create Post Button */}
      {onCreatePost && (
        <NeuCard className="mb-6 p-4" variant="inset">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold shadow-lg">
              <User size={20} />
            </div>
            <button
              onClick={onCreatePost}
              className="flex-1 text-left px-4 py-3 rounded-xl bg-[#dcd3c6] text-[#5c5243] hover:bg-[#d4ccb8] transition-colors"
            >
              Что нового?
            </button>
            <NeuButton onClick={onCreatePost} size="icon">
              <Send size={20} />
            </NeuButton>
          </div>
        </NeuCard>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <NeuCard className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-[#5c5243]/30 mx-auto mb-4" />
            <p className="text-lg text-[#5c5243]">Пока нет постов</p>
            <p className="text-sm text-[#5c5243] mt-2">Будьте первым!</p>
          </NeuCard>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NeuCard 
                className="cursor-pointer hover:shadow-[12px_12px_24px_rgba(44,40,34,0.12),-12px_-12px_24px_rgba(255,255,255,0.6)] transition-all"
                onClick={() => onPostClick?.(post.id)}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] p-0.5">
                        <div className="w-full h-full rounded-full bg-[#e4dfd5] flex items-center justify-center overflow-hidden">
                          <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      {post.user.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Verified size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2d2418]">{post.user.name}</span>
                        {post.user.isVerified && (
                          <Verified size={14} className="text-blue-500" />
                        )}
                      </div>
                      <div className="text-xs text-[#5c5243]">
                        {post.user.username} • {formatTimeAgo(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-[#d4ccb8] transition-colors">
                    <MoreHorizontal size={18} className="text-[#5c5243]" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-[#2d2418] leading-relaxed whitespace-pre-wrap mb-3">
                    {post.content.text}
                  </p>
                  
                  {post.content.images && post.content.images.length > 0 && (
                    <div className={`grid gap-2 ${
                      post.content.images.length === 1 ? 'grid-cols-1' : 
                      post.content.images.length === 2 ? 'grid-cols-2' : 
                      post.content.images.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
                    }`}>
                      {post.content.images.slice(0, 4).map((img, i) => (
                        <motion.img
                          key={i}
                          src={img}
                          alt=""
                          className="w-full h-48 object-cover rounded-xl"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[#d4ccb8] text-[#5c5243]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Meta */}
                {(post.location || post.tags) && (
                  <div className="flex items-center gap-4 text-xs text-[#5c5243] mb-4 pb-4 border-b border-[#d4ccb8]">
                    {post.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{post.location}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Post Metrics */}
                <div className="flex items-center justify-between text-xs text-[#5c5243] mb-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-red-500 fill-red-500" />
                      {post.metrics.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {post.metrics.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.metrics.views.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <NeuButton
                    variant={likedPosts.has(post.id) ? 'primary' : 'flat'}
                    size="sm"
                    onClick={(e) => toggleLike(post.id, e)}
                    leftIcon={<Heart size={16} className={likedPosts.has(post.id) ? 'text-red-500 fill-red-500' : ''} />}
                    className={likedPosts.has(post.id) ? 'text-red-500' : ''}
                  >
                    Нравится
                  </NeuButton>
                  
                  <NeuButton
                    variant="flat"
                    size="sm"
                    leftIcon={<MessageCircle size={16} />}
                  >
                    Комментарий
                  </NeuButton>
                  
                  <NeuButton
                    variant="flat"
                    size="sm"
                    leftIcon={<Share2 size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareClick?.(post.id);
                    }}
                  >
                    Поделиться
                  </NeuButton>
                  
                  <NeuButton
                    variant="flat"
                    size="icon"
                    onClick={(e) => toggleSave(post.id, e)}
                  >
                    <Bookmark 
                      size={16} 
                      className={savedPosts.has(post.id) ? 'text-[#5c5243] fill-[#5c5243]' : ''} 
                    />
                  </NeuButton>
                </div>
              </NeuCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
