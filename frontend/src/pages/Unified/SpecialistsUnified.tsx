/**
 * SpecialistsUnified - Specialist Marketplace
 * Browse and book healthcare professionals
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Filter,
  Stethoscope,
  Dumbbell,
  Apple,
  Brain,
  Sparkles,
  CheckCircle,
  Video,
  X,
  ChevronRight,
  User,
  Phone,
  Mail,
  Globe,
  Bookmark,
  TrendingUp,
  Award,
  Verified,
} from 'lucide-react';
import { ElCard, ElButton, ElInput } from '../../components/ElCore';

// ==================== Types ====================

type SpecialistCategory = 'all' | 'doctors' | 'trainers' | 'nutritionists' | 'psychologists';

interface Specialist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  category: SpecialistCategory;
  specialties: string[];
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  currency: string;
  location: string;
  distance: string;
  languages: string[];
  nextAvailable: string;
  isVerified: boolean;
  isFavorite: boolean;
  experience: number;
  bio: string;
  sessionTypes: ('in-person' | 'video' | 'chat')[];
}

interface Appointment {
  id: string;
  specialist: Specialist;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'in-person' | 'video' | 'chat';
}

// ==================== Mock Data ====================

const CATEGORIES: { id: SpecialistCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Specialists', icon: Sparkles },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'trainers', label: 'Trainers', icon: Dumbbell },
  { id: 'nutritionists', label: 'Nutritionists', icon: Apple },
  { id: 'psychologists', label: 'Psychologists', icon: Brain },
];

const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    title: 'MD, Board Certified Nutritionist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    category: 'nutritionists',
    specialties: ['Weight Management', 'Sports Nutrition', 'Diabetes'],
    rating: 4.9,
    reviewCount: 127,
    pricePerSession: 150,
    currency: '$',
    location: 'New York, NY',
    distance: '2.3 mi',
    languages: ['English', 'Spanish'],
    nextAvailable: 'Tomorrow, 9:00 AM',
    isVerified: true,
    isFavorite: false,
    experience: 15,
    bio: 'Board-certified nutritionist with 15+ years helping patients achieve their health goals.',
    sessionTypes: ['in-person', 'video'],
  },
  {
    id: '2',
    name: 'Dr. James Chen',
    title: 'PhD, Clinical Psychologist',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    category: 'psychologists',
    specialties: ['CBT', 'Anxiety', 'Stress Management'],
    rating: 4.8,
    reviewCount: 89,
    pricePerSession: 200,
    currency: '$',
    location: 'San Francisco, CA',
    distance: '5.1 mi',
    languages: ['English', 'Mandarin'],
    nextAvailable: 'Today, 4:00 PM',
    isVerified: true,
    isFavorite: true,
    experience: 12,
    bio: 'Licensed clinical psychologist specializing in CBT and mindfulness-based therapies.',
    sessionTypes: ['video', 'chat'],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    title: 'CPT, Yoga Alliance RYT-500',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    category: 'trainers',
    specialties: ['Personal Training', 'Yoga', 'Pilates'],
    rating: 5.0,
    reviewCount: 203,
    pricePerSession: 85,
    currency: '$',
    location: 'Los Angeles, CA',
    distance: '3.7 mi',
    languages: ['English', 'Spanish', 'Portuguese'],
    nextAvailable: 'Today, 7:00 AM',
    isVerified: true,
    isFavorite: false,
    experience: 8,
    bio: 'Certified personal trainer and yoga instructor with a holistic approach to fitness.',
    sessionTypes: ['in-person', 'video'],
  },
  {
    id: '4',
    name: 'Dr. Michael Thompson',
    title: 'MD, Sleep Medicine Specialist',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    category: 'doctors',
    specialties: ['Sleep Disorders', 'Insomnia', 'Sleep Apnea'],
    rating: 4.7,
    reviewCount: 64,
    pricePerSession: 180,
    currency: '$',
    location: 'Chicago, IL',
    distance: '1.5 mi',
    languages: ['English'],
    nextAvailable: 'Next Mon, 9:00 AM',
    isVerified: true,
    isFavorite: false,
    experience: 20,
    bio: 'Board-certified sleep medicine specialist helping patients achieve better sleep.',
    sessionTypes: ['in-person', 'video', 'chat'],
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    title: 'MD, Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
    category: 'doctors',
    specialties: ['Cardiology', 'Preventive Care', 'Heart Health'],
    rating: 4.9,
    reviewCount: 156,
    pricePerSession: 250,
    currency: '$',
    location: 'Houston, TX',
    distance: '4.2 mi',
    languages: ['English', 'Hindi', 'Arabic'],
    nextAvailable: 'Next Tue, 10:00 AM',
    isVerified: true,
    isFavorite: false,
    experience: 18,
    bio: 'Leading cardiologist specializing in preventive cardiology and women\'s heart health.',
    sessionTypes: ['in-person'],
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    title: 'Certified Health Coach',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
    category: 'trainers',
    specialties: ['Health Coaching', 'Habit Building', 'Lifestyle'],
    rating: 4.6,
    reviewCount: 78,
    pricePerSession: 65,
    currency: '$',
    location: 'Atlanta, GA',
    distance: '6.8 mi',
    languages: ['English'],
    nextAvailable: 'Today, 12:00 PM',
    isVerified: false,
    isFavorite: false,
    experience: 5,
    bio: 'Certified health coach empowering clients to take control of their wellness journey.',
    sessionTypes: ['video', 'chat'],
  },
  {
    id: '7',
    name: 'Dr. Lisa Wong',
    title: 'RD, Registered Dietitian',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    category: 'nutritionists',
    specialties: ['Clinical Nutrition', 'Eating Disorders', 'Pediatrics'],
    rating: 4.9,
    reviewCount: 142,
    pricePerSession: 120,
    currency: '$',
    location: 'Seattle, WA',
    distance: '3.2 mi',
    languages: ['English', 'Mandarin'],
    nextAvailable: 'Tomorrow, 2:00 PM',
    isVerified: true,
    isFavorite: true,
    experience: 10,
    bio: 'Registered dietitian specializing in clinical nutrition and eating disorder recovery.',
    sessionTypes: ['in-person', 'video'],
  },
  {
    id: '8',
    name: 'Dr. David Kim',
    title: 'PhD, Sports Psychologist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    category: 'psychologists',
    specialties: ['Sports Psychology', 'Performance', 'Motivation'],
    rating: 4.8,
    reviewCount: 95,
    pricePerSession: 175,
    currency: '$',
    location: 'Denver, CO',
    distance: '4.5 mi',
    languages: ['English', 'Korean'],
    nextAvailable: 'Wed, 11:00 AM',
    isVerified: true,
    isFavorite: false,
    experience: 14,
    bio: 'Sports psychologist helping athletes achieve peak mental performance.',
    sessionTypes: ['video', 'chat'],
  },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    specialist: MOCK_SPECIALISTS[0],
    date: '2024-03-15',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'video',
  },
  {
    id: 'a2',
    specialist: MOCK_SPECIALISTS[2],
    date: '2024-03-12',
    time: '9:00 AM',
    status: 'completed',
    type: 'in-person',
  },
  {
    id: 'a3',
    specialist: MOCK_SPECIALISTS[6],
    date: '2024-03-20',
    time: '2:30 PM',
    status: 'upcoming',
    type: 'video',
  },
];

// ==================== Components ====================

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'md' }) => {
  const sizeClasses = { sm: 'w-3 h-3', md: 'w-4 h-4' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--bone-400)]'}`}
        />
      ))}
    </div>
  );
};

const SpecialistCard: React.FC<{
  specialist: Specialist;
  onBook: (specialist: Specialist) => void;
  onToggleFavorite: (id: string) => void;
}> = ({ specialist, onBook, onToggleFavorite }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <ElCard hover className="h-full flex flex-col">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={specialist.avatar}
            alt={specialist.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          {specialist.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Verified className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] truncate">{specialist.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] truncate">{specialist.title}</p>
            </div>
            <button
              onClick={() => onToggleFavorite(specialist.id)}
              className="p-1.5 rounded-lg hover:bg-[var(--bone-300)] transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${specialist.isFavorite ? 'fill-red-500 text-red-500' : 'text-[var(--text-tertiary)]'}`}
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={specialist.rating} size="sm" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{specialist.rating}</span>
            <span className="text-xs text-[var(--text-tertiary)]">({specialist.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {specialist.specialties.slice(0, 3).map((spec) => (
          <span key={spec} className="px-2 py-0.5 text-xs bg-[var(--bone-300)] text-[var(--text-secondary)] rounded-full">
            {spec}
          </span>
        ))}
      </div>

      {/* Location & Availability */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{specialist.location} • {specialist.distance}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-green-600">
          <Clock className="w-3.5 h-3.5" />
          <span>{specialist.nextAvailable}</span>
        </div>
      </div>

      {/* Session Types */}
      <div className="flex items-center gap-2 mt-3">
        {specialist.sessionTypes.includes('video') && (
          <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            <Video className="w-3 h-3" /> Video
          </span>
        )}
        {specialist.sessionTypes.includes('chat') && (
          <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            <Globe className="w-3 h-3" /> Chat
          </span>
        )}
        {specialist.sessionTypes.includes('in-person') && (
          <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            <User className="w-3 h-3" /> In-person
          </span>
        )}
      </div>

      {/* Price & Action */}
      <div className="mt-4 pt-4 border-t border-[var(--bone-400)]/30 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-[var(--text-primary)]">
            {specialist.currency}{specialist.pricePerSession}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">/session</span>
        </div>
        <ElButton variant="gradient" size="sm" onClick={() => onBook(specialist)}>
          Book
        </ElButton>
      </div>
    </ElCard>
  </motion.div>
);

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const isUpcoming = appointment.status === 'upcoming';
  return (
    <ElCard variant="flat" className="flex items-center gap-4">
      <img
        src={appointment.specialist.avatar}
        alt={appointment.specialist.name}
        className="w-12 h-12 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--text-primary)] truncate">{appointment.specialist.name}</h4>
        <p className="text-sm text-[var(--text-secondary)]">{appointment.specialist.title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {appointment.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {appointment.time}
          </span>
          {appointment.type === 'video' && <Video className="w-3 h-3" />}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {appointment.status}
        </span>
        {isUpcoming && (
          <ElButton variant="flat" size="xs">
            Join
          </ElButton>
        )}
      </div>
    </ElCard>
  );
};

// ==================== Main Component ====================

export const SpecialistsUnified: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SpecialistCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [specialists, setSpecialists] = useState(MOCK_SPECIALISTS);
  const [showAppointments, setShowAppointments] = useState(false);

  const filteredSpecialists = useMemo(() => {
    return specialists.filter((s) => {
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.specialties.some(sp => sp.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFavorites = !showFavorites || s.isFavorite;
      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [specialists, activeCategory, searchQuery, showFavorites]);

  const toggleFavorite = (id: string) => {
    setSpecialists((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleBook = (specialist: Specialist) => {
    // Booking logic would go here
    console.log('Booking:', specialist.name);
  };

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Find a Specialist</h1>
                <p className="text-sm text-[var(--text-secondary)]">Connect with healthcare professionals</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl md:ml-8">
              <ElInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty, or condition..."
                leftIcon={<Search className="w-4 h-4" />}
                fullWidth
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ElButton
                variant={showFavorites ? 'gradient' : 'flat'}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                leftIcon={<Heart className="w-4 h-4" />}
              >
                Saved
              </ElButton>
              <ElButton
                variant={showAppointments ? 'gradient' : 'flat'}
                size="sm"
                onClick={() => setShowAppointments(!showAppointments)}
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                My Appointments
              </ElButton>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white shadow-lg'
                      : 'bg-[var(--bone-300)] text-[var(--text-secondary)] hover:bg-[var(--bone-400)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Specialists Grid */}
          <div className="flex-1">
            {showAppointments ? (
              /* My Appointments View */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">My Appointments</h2>
                  <button
                    onClick={() => setShowAppointments(false)}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Back to specialists
                  </button>
                </div>
                
                {/* Upcoming */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
                    Upcoming
                  </h3>
                  <div className="space-y-3">
                    {MOCK_APPOINTMENTS.filter(a => a.status === 'upcoming').map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                </div>

                {/* Past */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
                    Past
                  </h3>
                  <div className="space-y-3">
                    {MOCK_APPOINTMENTS.filter(a => a.status === 'completed').map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Specialists View */
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[var(--text-secondary)]">
                    Showing <span className="font-semibold text-[var(--text-primary)]">{filteredSpecialists.length}</span> specialists
                  </p>
                </div>

                {filteredSpecialists.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--bone-300)] flex items-center justify-center">
                      <Search className="w-8 h-8 text-[var(--text-tertiary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No specialists found</h3>
                    <p className="text-[var(--text-secondary)]">Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSpecialists.map((specialist) => (
                      <SpecialistCard
                        key={specialist.id}
                        specialist={specialist}
                        onBook={handleBook}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpecialistsUnified;
