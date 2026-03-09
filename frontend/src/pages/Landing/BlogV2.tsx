import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Heart,
  Brain,
  Activity,
  Moon,
  Utensils,
  Dumbbell
} from 'lucide-react';

const BlogV2 = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все', icon: null, count: 24 },
    { id: 'nutrition', name: 'Питание', icon: <Utensils className="w-4 h-4" />, count: 6 },
    { id: 'fitness', name: 'Фитнес', icon: <Dumbbell className="w-4 h-4" />, count: 5 },
    { id: 'sleep', name: 'Сон', icon: <Moon className="w-4 h-4" />, count: 4 },
    { id: 'mental', name: 'Психология', icon: <Brain className="w-4 h-4" />, count: 5 },
    { id: 'habits', name: 'Привычки', icon: <Activity className="w-4 h-4" />, count: 4 }
  ];

  const posts = [
    {
      id: 1,
      title: '10 привычек для здорового сна',
      excerpt: 'Научно обоснованные практики для улучшения качества сна и повышения энергии в течение дня.',
      category: 'sleep',
      author: 'Др. Анна Петрова',
      date: '9 марта 2026',
      readTime: '8 мин',
      image: '😴',
      featured: true,
      tags: ['сон', 'здоровье', 'привычки']
    },
    {
      id: 2,
      title: 'Как начать отслеживать питание: полное руководство',
      excerpt: 'Пошаговый план для начинающих. От выбора приложения до понимания макросов и калорий.',
      category: 'nutrition',
      author: 'Мария Иванова',
      date: '8 марта 2026',
      readTime: '12 мин',
      image: '🥗',
      featured: true,
      tags: ['питание', 'трекинг', 'гайд']
    },
    {
      id: 3,
      title: 'Обзор лучших трекеров здоровья 2026',
      excerpt: 'Сравниваем 15 популярных приложений и устройств. Что действительно работает?',
      category: 'fitness',
      author: 'Александр Волков',
      date: '7 марта 2026',
      readTime: '15 мин',
      image: '⌚',
      featured: false,
      tags: ['обзор', 'трекеры', 'wearables']
    },
    {
      id: 4,
      title: 'Ментальное здоровье: 5 инструментов самопомощи',
      excerpt: 'CBT техники, медитации, mood tracking — что работает и как начать использовать.',
      category: 'mental',
      author: 'Др. Елена Соколова',
      date: '6 марта 2026',
      readTime: '10 мин',
      image: '🧠',
      featured: false,
      tags: ['психология', 'CBT', 'медитация']
    },
    {
      id: 5,
      title: 'Как найти врача-нутрициолога онлайн',
      excerpt: 'Критерии выбора, вопросы на первой консультации, красные флаги.',
      category: 'nutrition',
      author: 'Др. Михаил Козлов',
      date: '5 марта 2026',
      readTime: '7 мин',
      image: '👨‍⚕️',
      featured: false,
      tags: ['нутрициолог', 'консультация', 'выбор']
    },
    {
      id: 6,
      title: 'Трекер привычек: зачем и как использовать',
      excerpt: 'Научное обоснование трекинга привычек. 66 дней до автоматизма.',
      category: 'habits',
      author: 'Ольга Новикова',
      date: '4 марта 2026',
      readTime: '9 мин',
      image: '✅',
      featured: false,
      tags: ['привычки', 'трекинг', 'мотивация']
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2d2418] mb-6">
              Блог о Здоровье
            </h1>
            <p className="text-xl text-[#5c5243] max-w-3xl mx-auto mb-10">
              Научно обоснованные статьи о питании, фитнесе, сне, психологии и привычках
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#5c5243]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск статей..."
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[#e4dfd5] border border-[#c9b8a6]/40 text-[#2d2418] placeholder-[#7a6e5d] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30 focus:border-transparent shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] text-lg"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg'
                      : 'bg-[#e4dfd5] text-[#5c5243] hover:bg-[#d4ccb8]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="text-xs opacity-70">({category.count})</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d2418] mb-4">
                Избранное
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="neu-card overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`)}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="h-64 bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center text-8xl">
                    {post.image}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-[#5c5243] mb-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#2d2418] mb-3 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#5c5243] mb-6 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#5c5243]" />
                        <span className="text-sm text-[#5c5243]">{post.author}</span>
                      </div>
                      <span className="text-emerald-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                        Читать далее <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d2418] mb-4">
              Все Статьи
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="neu-card overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-6xl">
                  {post.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#5c5243] mb-3">
                    <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2d2418] mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#5c5243] mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5c5243]">{post.author}</span>
                    <span className="text-violet-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Читать <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neu-card p-12 md:p-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <TrendingUp className="w-12 h-12 text-emerald-500" />
              <h2 className="text-4xl md:text-5xl font-bold text-[#2d2418]">
                Подписка на Рассылку
              </h2>
            </div>
            <p className="text-xl text-[#5c5243] mb-8 max-w-2xl mx-auto">
              Получайте новые статьи и советы по здоровью прямо на почту
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-6 py-4 rounded-xl bg-[#e4dfd5] border border-[#c9b8a6]/40 text-[#2d2418] placeholder-[#7a6e5d] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30 focus:border-transparent shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]"
              />
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Подписаться
              </motion.button>
            </div>
            <p className="mt-4 text-sm text-[#5c5243]">
              Никакого спама. Отписка в один клик.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogV2;
