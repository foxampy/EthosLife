/**
 * SocialFeedUnified - Instagram-like social feed page
 * Stories row, create post, feed cards with interactions
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  Send,
  Bookmark,
  RefreshCw,
} from 'lucide-react';
import { ElCard, ElButton, ElInput } from '../../../components/ElCore';

// Mock data for stories
const mockStories = [
  { id: '1', name: 'Your Story', image: null, isUser: true, hasStory: false },
  { id: '2', name: 'Sarah M.', image: 'https://i.pravatar.cc/150?img=1', hasStory: true },
  { id: '3', name: 'Mike R.', image: 'https://i.pravatar.cc/150?img=3', hasStory: true },
  { id: '4', name: 'Emma L.', image: 'https://i.pravatar.cc/150?img=5', hasStory: false },
  { id: '5', name: 'David K.', image: 'https://i.pravatar.cc/150?img=8', hasStory: true },
  { id: '6', name: 'Lisa T.', image: 'https://i.pravatar.cc/150?img=9', hasStory: true },
  { id: '7', name: 'John D.', image: 'https://i.pravatar.cc/150?img=11', hasStory: false },
  { id: '8', name: 'Anna P.', image: 'https://i.pravatar.cc/150?img=12', hasStory: true },
];

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    author: { name: 'Sarah Mitchell', avatar: 'https://i.pravatar.cc/150?img=1', verified: true },
    time: '2 hours ago',
    content: 'Just completed my 10k steps goal for the day! 🏃‍♀️ Feeling amazing and energized. Who else is crushing their fitness goals today? 💪 #FitnessMotivation #HealthJourney',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop',
    likes: 234,
    comments: 42,
    shares: 18,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: { name: 'Mike Roberts', avatar: 'https://i.pravatar.cc/150?img=3', verified: false },
    time: '4 hours ago',
    content: 'Healthy meal prep Sunday! 🥗 Preparing nutritious meals for the week ahead. Meal prepping has been a game changer for staying on track with my nutrition goals.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
    likes: 189,
    comments: 31,
    shares: 12,
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    author: { name: 'Emma Liu', avatar: 'https://i.pravatar.cc/150?img=5', verified: true },
    time: '6 hours ago',
    content: 'Morning yoga session complete 🧘‍♀️ Starting the day with mindfulness and movement. Remember: progress over perfection! What\'s your morning routine?',
    image: null,
    likes: 456,
    comments: 67,
    shares: 23,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '4',
    author: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=8', verified: false },
    time: '8 hours ago',
    content: 'New personal record on my 5K run! 🏃‍♂️⏱️ 22:45 - shaved 30 seconds off my previous best. Hard work pays off! Thanks to everyone who supported me on this journey.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
    likes: 312,
    comments: 45,
    shares: 28,
    isLiked: true,
    isSaved: false,
  },
];

// Story Avatar Component
const StoryAvatar: React.FC<{
  name: string;
  image: string | null;
  hasStory: boolean;
  isUser?: boolean;
  onClick?: () => void;
}> = ({ name, image, hasStory, isUser, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[72px]"
    >
      <div
        className={`relative w-16 h-16 rounded-full p-0.5 ${
          hasStory
            ? 'bg-gradient-to-tr from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-pink)]'
            : isUser
            ? 'bg-[var(--bone-400)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full h-full rounded-full bg-[var(--bone-200)] p-0.5">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {isUser && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center text-white shadow-md">
            <span className="text-xs font-bold">+</span>
          </div>
        )}
      </div>
      <span className="text-xs text-[var(--text-secondary)] truncate max-w-[72px]">
        {name}
      </span>
    </motion.button>
  );
};

// Post Card Component
const PostCard: React.FC<{
  post: typeof mockPosts[0];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}> = ({ post, onLike, onSave }) => {
  return (
    <ElCard variant="elevated" padding="none" className="overflow-hidden mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-purple)] p-0.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-full h-full rounded-full object-cover border-2 border-[var(--bone-200)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[var(--text-primary)]">
                {post.author.name}
              </span>
              {post.author.verified && (
                <div className="w-4 h-4 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">{post.time}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--bone-300)]/50"
        >
          <MoreHorizontal className="w-5 h-5 text-[var(--text-secondary)]" />
        </motion.button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-[var(--text-primary)] whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="w-full aspect-video bg-[var(--bone-300)]">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  post.isLiked
                    ? 'fill-red-500 text-red-500'
                    : 'text-[var(--text-secondary)] hover:text-red-500'
                }`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <MessageCircle className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <Share2 className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--neon-purple)]" />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSave(post.id)}
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                post.isSaved
                  ? 'fill-[var(--neon-amber)] text-[var(--neon-amber)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--neon-amber)]'
              }`}
            />
          </motion.button>
        </div>

        {/* Likes Count */}
        <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">
          {post.likes.toLocaleString()} likes
        </div>

        {/* Comments Preview */}
        <button className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
          View all {post.comments} comments
        </button>
      </div>
    </ElCard>
  );
};

// Create Post Component
const CreatePost: React.FC<{ onPost: (content: string) => void }> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content);
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <ElCard variant="elevated" className="mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold flex-shrink-0">
          A
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none outline-none resize-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            rows={isExpanded ? 3 : 1}
          />
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between pt-3 border-t border-[var(--bone-400)]/30"
            >
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--neon-green)]"
                >
                  <ImageIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--bone-300)]/50 text-[var(--neon-amber)]"
                >
                  <Smile className="w-5 h-5" />
                </motion.button>
              </div>
              <ElButton
                variant="gradient"
                size="sm"
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                <Send className="w-4 h-4 mr-1" />
                Post
              </ElButton>
            </motion.div>
          )}
        </div>
      </div>
    </ElCard>
  );
};

export const SocialFeedUnified: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState(mockPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handlePost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      author: { name: 'Alex Johnson', avatar: '', verified: false },
      time: 'Just now',
      content,
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isSaved: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Social Feed</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-[var(--bone-300)]/50 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5 text-[var(--text-secondary)]" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Stories Row */}
        <div className="mb-6 -mx-4 px-4">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mockStories.map((story) => (
              <StoryAvatar
                key={story.id}
                name={story.name}
                image={story.image}
                hasStory={story.hasStory}
                isUser={story.isUser}
              />
            ))}
          </div>
        </div>

        {/* Create Post */}
        <CreatePost onPost={handlePost} />

        {/* Feed Posts */}
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard
                post={post}
                onLike={handleLike}
                onSave={handleSave}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pull to refresh indicator */}
        <motion.div
          initial={false}
          animate={{ opacity: isRefreshing ? 1 : 0 }}
          className="flex items-center justify-center py-8"
        >
          <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Refreshing...</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SocialFeedUnified;
