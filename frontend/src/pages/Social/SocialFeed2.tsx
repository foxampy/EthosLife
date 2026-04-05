/**
 * SocialFeed2 - Unified Social Feed Page
 * Deep Neumorphism Design - Mobile Optimized
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Smile,
  Send,
  MapPin,
  Calendar,
  User,
  Users,
  TrendingUp,
  Filter,
  Plus
} from 'lucide-react';
import { ElCard, ElButton } from '../../components/ElCore';

// ============================================
// TYPES
// ============================================

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  liked: boolean;
  saved: boolean;
  tags?: string[];
  location?: string;
  type: 'text' | 'image' | 'video' | 'achievement';
  achievement?: {
    title: string;
    icon: string;
    description: string;
  };
}

interface Filter {
  id: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { name: 'Maria K.', avatar: '👩', verified: true, level: 15 },
    content: 'Just completed my 30-day fitness challenge! 🎉 Lost 5kg and feeling amazing! Thank you all for support!',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
    likes: 234,
    comments: 45,
    shares: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    liked: false,
    saved: false,
    type: 'achievement',
    achievement: {
      title: '30-Day Challenge Complete',
      icon: '🏆',
      description: 'Completed 30 consecutive days of workouts'
    },
    tags: ['fitness', 'challenge', 'transformation']
  },
  {
    id: '2',
    author: { name: 'Alex Chen', avatar: '👨', verified: false, level: 8 },
    content: 'Morning meditation session complete 🧘 Starting the day with clarity and peace. #mindfulness #meditation',
    likes: 89,
    comments: 12,
    shares: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    liked: true,
    saved: false,
    type: 'text',
    tags: ['mindfulness', 'meditation', 'wellness']
  },
  {
    id: '3',
    author: { name: 'Sarah Johnson', avatar: '👱‍♀️', verified: true, level: 22 },
    content: 'Healthy meal prep for the week! 🥗 Quinoa bowls with grilled chicken, avocado, and fresh veggies. Recipe in comments!',
    image: 'https://images.unsplash.com/photo-1543362906-ac1b48263852?w=600&h=400&fit=crop',
    likes: 456,
    comments: 78,
    shares: 34,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    liked: false,
    saved: true,
    type: 'image',
    tags: ['nutrition', 'mealprep', 'healthy']
  },
  {
    id: '4',
    author: { name: 'Mike Torres', avatar: '🧔', verified: false, level: 12 },
    content: 'New personal record! 💪 Deadlifted 180kg today. Consistency is key!',
    likes: 167,
    comments: 23,
    shares: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    liked: false,
    saved: false,
    type: 'achievement',
    achievement: {
      title: 'Personal Record',
      icon: '💪',
      description: 'New deadlift PR: 180kg'
    },
    tags: ['fitness', 'powerlifting', 'pr']
  }
];

const FILTERS: Filter[] = [
  { id: 'all', label: 'All', icon: Filter, active: true },
  { id: 'fitness', label: 'Fitness', icon: TrendingUp, active: false },
  { id: 'nutrition', label: 'Nutrition', icon: User, active: false },
  { id: 'mindfulness', label: 'Mindfulness', icon: User, active: false },
  { id: 'achievements', label: 'Achievements', icon: User, active: false },
];

// ============================================
// COMPONENTS
// ============================================

const PostCard: React.FC<{ post: Post; onLike: (id: string) => void; onSave: (id: string) => void }> = ({ post, onLike, onSave }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neu-card p-4 mb-4"
    >
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {post.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#2d2418] text-sm sm:text-base truncate">{post.author.name}</span>
            {post.author.verified && (
              <span className="text-blue-500 text-xs">✓</span>
            )}
            <span className="text-xs text-[#5c5243]/60">Lvl {post.author.level}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#5c5243]/70">
            <span>{post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {post.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.location}
              </span>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-[#dcd3c6]/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <MoreHorizontal className="w-5 h-5 text-[#5c5243]" />
        </button>
      </div>

      {/* Achievement Badge */}
      {post.achievement && (
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{post.achievement.icon}</span>
            <div>
              <h4 className="font-bold text-[#2d2418] text-sm">{post.achievement.title}</h4>
              <p className="text-xs text-[#5c5243]">{post.achievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <p className="text-[#2d2418] mb-3 text-sm sm:text-base leading-relaxed">{post.content}</p>

      {/* Tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs text-[#5c5243] bg-[#dcd3c6]/50 px-2 py-1 rounded-lg hover:bg-[#d4ccb8] transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Media */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-xl mb-3 object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#dcd3c6]">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all min-h-[44px] ${
            post.liked
              ? 'text-red-500 bg-red-50'
              : 'text-[#5c5243] hover:bg-[#dcd3c6]/50'
          }`}
        >
          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likes}</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5c5243] hover:bg-[#dcd3c6]/50 transition-colors min-h-[44px]">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5c5243] hover:bg-[#dcd3c6]/50 transition-colors min-h-[44px]">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">{post.shares}</span>
        </button>

        <button
          onClick={() => onSave(post.id)}
          className={`p-2 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
            post.saved
              ? 'text-emerald-500 bg-emerald-50'
              : 'text-[#5c5243] hover:bg-[#dcd3c6]/50'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.saved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </motion.article>
  );
};

const CreatePostCard: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <ElCard variant="elevated" className="p-4 mb-6">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
          U
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your health journey..."
            rows={3}
            className="w-full bg-[#dcd3c6] rounded-xl px-4 py-3 text-[#2d2418] placeholder-[#5c5243]/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 resize-none text-sm sm:text-base"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#dcd3c6]/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[#5c5243]" />
              </button>
              <button className="p-2 hover:bg-[#dcd3c6]/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Video className="w-5 h-5 text-[#5c5243]" />
              </button>
              <button className="p-2 hover:bg-[#dcd3c6]/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Smile className="w-5 h-5 text-[#5c5243]" />
              </button>
            </div>
            <ElButton
              variant="gradient"
              disabled={!content.trim()}
              className="px-4 py-2 text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </ElButton>
          </div>
        </div>
      </div>
    </ElCard>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const SocialFeed2: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, saved: !post.saved }
        : post
    ));
  };

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter(post => post.tags?.includes(activeFilter) || post.type === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e4dfd5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse">
            E
          </div>
          <p className="text-[#5c5243] font-medium animate-pulse">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4dfd5] py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2d2418] mb-2">Social Feed</h1>
          <p className="text-sm text-[#5c5243]">Connect with your health community</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all min-h-[44px] ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                  : 'neu-button text-[#5c5243]'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Create Post */}
        <CreatePostCard />

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-4 text-sm text-[#5c5243]">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="font-medium text-[#2d2418]">{posts.length}</span> posts
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium text-[#2d2418]">{posts.reduce((acc, p) => acc + p.likes, 0)}</span> likes
            </span>
          </div>
          <button className="p-2 hover:bg-[#dcd3c6]/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Filter className="w-5 h-5 text-[#5c5243]" />
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#dcd3c6] flex items-center justify-center">
              <Filter className="w-10 h-10 text-[#5c5243]/50" />
            </div>
            <h3 className="text-lg font-semibold text-[#2d2418] mb-2">No posts found</h3>
            <p className="text-sm text-[#5c5243]">Try selecting a different filter</p>
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-6">
            <ElButton variant="elevated" className="px-6 py-3">
              Load More Posts
            </ElButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed2;
