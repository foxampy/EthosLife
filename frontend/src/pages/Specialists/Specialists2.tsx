import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Heart,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Award,
  GraduationCap,
  Briefcase,
  Globe,
  Video,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  ThumbsUp,
  MoreHorizontal,
  Phone,
  Mail,
  Shield,
  Verified,
  TrendingUp,
  DollarSign,
  SlidersHorizontal,
  Grid3X3,
  Map as MapIcon,
  User,
  Clock3,
  Stethoscope,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Sparkles,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ==================== Types ====================

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

interface Specialist {
  id: string;
  name: string;
  title: string;
  photo: string;
  coverPhoto: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  currency: string;
  languages: string[];
  location: string;
  distance?: string;
  bio: string;
  education: string[];
  certifications: string[];
  services: Service[];
  availability: TimeSlot[];
  isVerified: boolean;
  isFavorite: boolean;
  experience: number;
  nextAvailable: string;
}

interface Filters {
  search: string;
  specialties: string[];
  priceRange: [number, number];
  rating: number;
  languages: string[];
  availability: string;
  experience: string;
  verifiedOnly: boolean;
}

// ==================== Mock Data ====================

const SPECIALTIES = [
  { id: 'nutritionist', name: 'Nutritionist & Dietitian', icon: Apple, color: 'bg-green-500' },
  { id: 'trainer', name: 'Personal Trainer', icon: Dumbbell, color: 'bg-orange-500' },
  { id: 'yoga', name: 'Yoga & Meditation', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'psychologist', name: 'Psychologist & Therapist', icon: Brain, color: 'bg-teal-500' },
  { id: 'sleep', name: 'Sleep Specialist', icon: Moon, color: 'bg-indigo-500' },
  { id: 'gp', name: 'General Practitioner', icon: Stethoscope, color: 'bg-blue-500' },
  { id: 'cardio', name: 'Cardiologist', icon: Heart, color: 'bg-red-500' },
  { id: 'neuro', name: 'Neurologist', icon: Brain, color: 'bg-violet-500' },
  { id: 'coach', name: 'Health Coach', icon: Award, color: 'bg-amber-500' },
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    title: 'MD, Board Certified Nutritionist',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    coverPhoto: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    specialties: ['nutritionist', 'coach'],
    rating: 4.9,
    reviewCount: 127,
    pricePerSession: 150,
    currency: '$',
    languages: ['en', 'es'],
    location: 'New York, NY',
    distance: '2.3 mi',
    bio: 'Dr. Sarah Mitchell is a board-certified nutritionist with over 15 years of experience helping patients achieve their health goals through personalized nutrition plans. She specializes in weight management, sports nutrition, and digestive health. Her evidence-based approach combines the latest nutritional science with practical, sustainable lifestyle changes.',
    education: ['MD, Harvard Medical School', 'MS in Nutrition, Columbia University', 'BS in Biology, Stanford University'],
    certifications: ['Board Certified in Nutrition', 'Certified Diabetes Educator', 'Sports Nutrition Specialist'],
    services: [
      { id: 's1', name: 'Initial Consultation', duration: 60, price: 150, description: 'Comprehensive assessment and personalized nutrition plan' },
      { id: 's2', name: 'Follow-up Session', duration: 30, price: 75, description: 'Progress review and plan adjustments' },
      { id: 's3', name: 'Meal Planning', duration: 45, price: 120, description: 'Custom meal plans with shopping lists' },
    ],
    availability: [
      { id: 'a1', date: '2024-03-07', time: '09:00', isAvailable: true },
      { id: 'a2', date: '2024-03-07', time: '11:00', isAvailable: true },
      { id: 'a3', date: '2024-03-07', time: '14:00', isAvailable: true },
    ],
    isVerified: true,
    isFavorite: false,
    experience: 15,
    nextAvailable: 'Tomorrow, 9:00 AM',
  },
  {
    id: '2',
    name: 'Dr. James Chen',
    title: 'PhD, Clinical Psychologist',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    coverPhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    specialties: ['psychologist'],
    rating: 4.8,
    reviewCount: 89,
    pricePerSession: 200,
    currency: '$',
    languages: ['en', 'zh'],
    location: 'San Francisco, CA',
    distance: '5.1 mi',
    bio: 'Dr. James Chen is a licensed clinical psychologist specializing in cognitive behavioral therapy (CBT), anxiety disorders, and stress management. With a warm, collaborative approach, he helps clients develop practical tools for lasting change. He has published extensively on mindfulness-based interventions and workplace mental health.',
    education: ['PhD in Clinical Psychology, Stanford University', 'MA in Psychology, UC Berkeley', 'BA in Psychology, UCLA'],
    certifications: ['Licensed Clinical Psychologist', 'Certified in CBT', 'Mindfulness-Based Stress Reduction (MBSR) Certified'],
    services: [
      { id: 's1', name: 'Individual Therapy', duration: 50, price: 200, description: 'One-on-one therapy session' },
      { id: 's2', name: 'Couples Counseling', duration: 60, price: 250, description: 'Relationship and couples therapy' },
      { id: 's3', name: 'Stress Management', duration: 45, price: 180, description: 'Techniques for managing stress and anxiety' },
    ],
    availability: [
      { id: 'a1', date: '2024-03-06', time: '16:00', isAvailable: true },
      { id: 'a2', date: '2024-03-08', time: '10:00', isAvailable: true },
      { id: 'a3', date: '2024-03-08', time: '14:00', isAvailable: true },
    ],
    isVerified: true,
    isFavorite: true,
    experience: 12,
    nextAvailable: 'Today, 4:00 PM',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    title: 'CPT, Yoga Alliance RYT-500',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    coverPhoto: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    specialties: ['trainer', 'yoga'],
    rating: 5.0,
    reviewCount: 203,
    pricePerSession: 85,
    currency: '$',
    languages: ['en', 'es', 'pt'],
    location: 'Los Angeles, CA',
    distance: '3.7 mi',
    bio: 'Emma Rodriguez is a certified personal trainer and experienced yoga instructor dedicated to helping clients build strength, flexibility, and mindfulness. Her holistic approach combines physical training with breathwork and meditation techniques for complete mind-body wellness.',
    education: ['BS in Kinesiology, UCLA', 'Yoga Alliance RYT-500', 'Precision Nutrition Level 2'],
    certifications: ['NASM Certified Personal Trainer', 'Yoga Alliance E-RYT 500', 'Prenatal Yoga Certified'],
    services: [
      { id: 's1', name: 'Personal Training', duration: 60, price: 85, description: 'One-on-one fitness training' },
      { id: 's2', name: 'Yoga Session', duration: 75, price: 70, description: 'Private yoga instruction' },
      { id: 's3', name: 'Meditation Coaching', duration: 30, price: 50, description: 'Guided meditation and mindfulness' },
    ],
    availability: [
      { id: 'a1', date: '2024-03-06', time: '07:00', isAvailable: true },
      { id: 'a2', date: '2024-03-06', time: '18:00', isAvailable: true },
      { id: 'a3', date: '2024-03-07', time: '07:00', isAvailable: true },
    ],
    isVerified: true,
    isFavorite: false,
    experience: 8,
    nextAvailable: 'Today, 7:00 AM',
  },
  {
    id: '4',
    name: 'Dr. Michael Thompson',
    title: 'MD, Sleep Medicine Specialist',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    coverPhoto: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?w=800',
    specialties: ['sleep', 'gp'],
    rating: 4.7,
    reviewCount: 64,
    pricePerSession: 180,
    currency: '$',
    languages: ['en'],
    location: 'Chicago, IL',
    distance: '1.5 mi',
    bio: 'Dr. Michael Thompson is a board-certified sleep medicine specialist who helps patients overcome insomnia, sleep apnea, and other sleep disorders. He combines medical expertise with behavioral sleep medicine techniques to improve sleep quality and overall health.',
    education: ['MD, Johns Hopkins University', 'Residency in Internal Medicine, Mayo Clinic', 'Fellowship in Sleep Medicine, Stanford'],
    certifications: ['Board Certified in Sleep Medicine', 'American Board of Internal Medicine', 'Cognitive Behavioral Therapy for Insomnia (CBT-I)'],
    services: [
      { id: 's1', name: 'Sleep Consultation', duration: 60, price: 180, description: 'Comprehensive sleep assessment' },
      { id: 's2', name: 'CPAP Management', duration: 30, price: 90, description: 'CPAP therapy optimization' },
      { id: 's3', name: 'CBT-I Program', duration: 45, price: 150, description: 'Cognitive behavioral therapy for insomnia' },
    ],
    availability: [
      { id: 'a1', date: '2024-03-11', time: '09:00', isAvailable: true },
      { id: 'a2', date: '2024-03-11', time: '13:00', isAvailable: true },
    ],
    isVerified: true,
    isFavorite: false,
    experience: 20,
    nextAvailable: 'Next Mon, 9:00 AM',
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    title: 'MD, Cardiologist',
    photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
    coverPhoto: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    specialties: ['cardio', 'gp'],
    rating: 4.9,
    reviewCount: 156,
    pricePerSession: 250,
    currency: '$',
    languages: ['en', 'hi', 'ar'],
    location: 'Houston, TX',
    distance: '4.2 mi',
    bio: 'Dr. Aisha Patel is a leading cardiologist specializing in preventive cardiology, heart failure management, and women\'s heart health. She is passionate about educating patients on heart-healthy lifestyles and providing comprehensive cardiovascular care.',
    education: ['MD, Baylor College of Medicine', 'Cardiology Fellowship, Cleveland Clinic', 'Preventive Cardiology Certification'],
    certifications: ['Board Certified in Cardiovascular Disease', 'FACC - Fellow of American College of Cardiology', 'ASE Certified in Echocardiography'],
    services: [
      { id: 's1', name: 'Cardiac Consultation', duration: 45, price: 250, description: 'Comprehensive heart health evaluation' },
      { id: 's2', name: 'Preventive Cardiology', duration: 60, price: 300, description: 'Risk assessment and prevention planning' },
      { id: 's3', name: 'Follow-up Visit', duration: 30, price: 150, description: 'Ongoing cardiac care management' },
    ],
    availability: [
      { id: 'a1', date: '2024-03-12', time: '10:00', isAvailable: true },
      { id: 'a2', date: '2024-03-12', time: '14:00', isAvailable: true },
    ],
    isVerified: true,
    isFavorite: false,
    experience: 18,
    nextAvailable: 'Next Tue, 10:00 AM',
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    title: 'Certified Health Coach',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
    coverPhoto: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    specialties: ['coach', 'trainer'],
    rating: 4.6,
    reviewCount: 78,
    pricePerSession: 65,
    currency: '$',
    languages: ['en'],
    location: 'Atlanta, GA',
    distance: '6.8 mi',
    bio: 'Marcus Johnson is a certified health coach who empowers clients to take control of their wellness journey. With a focus on sustainable habit formation, he guides individuals through nutrition, fitness, and lifestyle changes that last.',
    education: ['BS in Health Sciences, Georgia State University', 'Institute for Integrative Nutrition Graduate', 'NSHC Certified Health Coach'],
    certifications: ['National Society of Health Coaches Certified', 'Precision Nutrition Level 1', 'ACE Certified Health Coach'],
    services: [
      { id: 's1', name: 'Health Coaching', duration: 45, price: 65, description: 'Wellness goal setting and coaching' },
      { id: 's2', name: 'Habit Transformation', duration: 60, price: 80, description: 'Building sustainable healthy habits' },
      { id: 's3', name: 'Accountability Coaching', duration: 30, price: 45, description: 'Weekly check-ins and support' },
    ],
    availability: [
      { id: 'a1', date: '2024-03-06', time: '12:00', isAvailable: true },
      { id: 'a2', date: '2024-03-06', time: '17:00', isAvailable: true },
      { id: 'a3', date: '2024-03-07', time: '09:00', isAvailable: true },
    ],
    isVerified: false,
    isFavorite: false,
    experience: 5,
    nextAvailable: 'Today, 12:00 PM',
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Jennifer W.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    date: '2 weeks ago',
    content: 'Absolutely fantastic experience! Dr. Mitchell helped me understand my nutritional needs and created a plan that actually works with my lifestyle. I\'ve lost 15 pounds and feel more energetic than ever.',
    helpful: 24,
  },
  {
    id: 'r2',
    author: 'Robert K.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
    date: '1 month ago',
    content: 'Very professional and knowledgeable. The personalized approach made all the difference. Highly recommend!',
    helpful: 18,
  },
  {
    id: 'r3',
    author: 'Amanda S.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    rating: 4,
    date: '2 months ago',
    content: 'Great session, though I wish the follow-up was a bit sooner. Otherwise, excellent advice and support.',
    helpful: 12,
  },
];

// ==================== Components ====================

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );
};

const LanguageFlag: React.FC<{ code: string }> = ({ code }) => {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? <span title={lang.name}>{lang.flag}</span> : null;
};

const SpecialtyBadge: React.FC<{ specialtyId: string }> = ({ specialtyId }) => {
  const specialty = SPECIALTIES.find((s) => s.id === specialtyId);
  if (!specialty) return null;
  const Icon = specialty.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
      <Icon className="w-3 h-3" />
      {specialty.name}
    </span>
  );
};

// ==================== Main Component ====================

export default function Specialists2() {
  // State
  const [filters, setFilters] = useState<Filters>({
    search: '',
    specialties: [],
    priceRange: [0, 500],
    rating: 0,
    languages: [],
    availability: '',
    experience: '',
    verifiedOnly: false,
  });
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price' | 'experience'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>(MOCK_SPECIALISTS);
  const [showFilters, setShowFilters] = useState(true);
  const [bookingStep, setBookingStep] = useState<'select' | 'datetime' | 'confirm' | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'video' | 'inPerson' | 'chat'>('video');
  const [bookingNotes, setBookingNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [savedSpecialists, setSavedSpecialists] = useState<string[]>(['2']);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);

  // Derived values
  const filteredSpecialists = useMemo(() => {
    let result = [...specialists];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.title.toLowerCase().includes(searchLower) ||
          s.specialties.some((spec) =>
            SPECIALTIES.find((sp) => sp.id === spec)?.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Specialty filter
    if (filters.specialties.length > 0) {
      result = result.filter((s) => filters.specialties.some((spec) => s.specialties.includes(spec)));
    }

    // Price filter
    result = result.filter(
      (s) => s.pricePerSession >= filters.priceRange[0] && s.pricePerSession <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((s) => s.rating >= filters.rating);
    }

    // Language filter
    if (filters.languages.length > 0) {
      result = result.filter((s) => filters.languages.some((lang) => s.languages.includes(lang)));
    }

    // Verified filter
    if (filters.verifiedOnly) {
      result = result.filter((s) => s.isVerified);
    }

    // Experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      result = result.filter((s) => s.experience >= min && (max ? s.experience <= max : true));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.pricePerSession - b.pricePerSession;
        case 'experience':
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    return result;
  }, [specialists, filters, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.specialties.length) count++;
    if (filters.rating > 0) count++;
    if (filters.languages.length) count++;
    if (filters.availability) count++;
    if (filters.experience) count++;
    if (filters.verifiedOnly) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    return count;
  }, [filters]);

  // Handlers
  const toggleSpecialty = (specialtyId: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialtyId)
        ? prev.specialties.filter((s) => s !== specialtyId)
        : [...prev.specialties, specialtyId],
    }));
  };

  const toggleLanguage = (langCode: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(langCode)
        ? prev.languages.filter((l) => l !== langCode)
        : [...prev.languages, langCode],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      specialties: [],
      priceRange: [0, 500],
      rating: 0,
      languages: [],
      availability: '',
      experience: '',
      verifiedOnly: false,
    });
  };

  const toggleFavorite = (e: React.MouseEvent, specialistId: string) => {
    e.stopPropagation();
    setSpecialists((prev) =>
      prev.map((s) => (s.id === specialistId ? { ...s, isFavorite: !s.isFavorite } : s))
    );
    if (savedSpecialists.includes(specialistId)) {
      setSavedSpecialists((prev) => prev.filter((id) => id !== specialistId));
      toast.success('Removed from favorites');
    } else {
      setSavedSpecialists((prev) => [...prev, specialistId]);
      toast.success('Added to favorites');
    }
  };

  const startBooking = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setBookingStep('select');
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const confirmBooking = () => {
    if (!selectedSpecialist || !selectedService || !selectedDate || !selectedTime) return;

    const appointment = {
      id: Date.now().toString(),
      specialist: selectedSpecialist,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      sessionType,
      notes: bookingNotes,
      status: 'confirmed',
    };

    setMyAppointments((prev) => [...prev, appointment]);
    setBookingStep(null);
    setSelectedSpecialist(null);
    toast.success('Appointment booked successfully! Check your email for confirmation.');
  };

  // Render
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Title & Search */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-100 rounded-xl">
                  <Stethoscope className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Find a Specialist</h1>
                  <p className="text-sm text-slate-500">Connect with healthcare professionals</p>
                </div>
              </div>
              
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or condition..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                  showFilters ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'map' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">Active filters:</span>
              {filters.specialties.map((spec) => {
                const specialty = SPECIALTIES.find((s) => s.id === spec);
                return (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full"
                  >
                    {specialty?.name}
                    <button
                      onClick={() => toggleSpecialty(spec)}
                      className="hover:text-teal-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {filters.rating > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full">
                  {filters.rating}+ stars
                  <button onClick={() => setFilters((prev) => ({ ...prev, rating: 0 }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full">
                  Verified only
                  <button onClick={() => setFilters((prev) => ({ ...prev, verifiedOnly: false }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-72 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
                  {/* Sort */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price">Lowest Price</option>
                      <option value="experience">Most Experienced</option>
                    </select>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Specialties</h3>
                    <div className="space-y-2">
                      {SPECIALTIES.map((specialty) => (
                        <label
                          key={specialty.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.specialties.includes(specialty.id)}
                            onChange={() => toggleSpecialty(specialty.id)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                          />
                          <div className={`p-1.5 rounded-lg ${specialty.color}`}>
                            <specialty.icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm text-slate-700">{specialty.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], parseInt(e.target.value)],
                          }))
                        }
                        className="w-full accent-teal-600"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-1">
                        <span>$0</span>
                        <span className="font-medium text-slate-900">
                          Up to ${filters.priceRange[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Minimum Rating</h3>
                    <div className="space-y-2">
                      {[5, 4.5, 4].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => setFilters((prev) => ({ ...prev, rating }))}
                            className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                          />
                          <StarRating rating={rating} size="sm" />
                          <span className="text-sm text-slate-700">{rating}+</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === 0}
                          onChange={() => setFilters((prev) => ({ ...prev, rating: 0 }))}
                          className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                        />
                        <span className="text-sm text-slate-700">Any rating</span>
                      </label>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Languages</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {LANGUAGES.slice(0, 6).map((lang) => (
                        <label
                          key={lang.code}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.languages.includes(lang.code)}
                            onChange={() => toggleLanguage(lang.code)}
                            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                          />
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm text-slate-700">{lang.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Experience</h3>
                    <div className="space-y-2">
                      {[
                        { value: '10-100', label: '10+ years' },
                        { value: '5-10', label: '5-10 years' },
                        { value: '0-5', label: 'Less than 5 years' },
                      ].map((exp) => (
                        <label
                          key={exp.value}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="experience"
                            checked={filters.experience === exp.value}
                            onChange={() => setFilters((prev) => ({ ...prev, experience: exp.value }))}
                            className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">{exp.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verified Only */}
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-slate-700">Verified professionals only</span>
                  </label>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500">
                Showing <span className="font-semibold text-slate-900">{filteredSpecialists.length}</span> specialists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSpecialists.map((specialist) => (
                <motion.div
                  key={specialist.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Cover Photo */}
                  <div className="relative h-32 bg-slate-200">
                    <img
                      src={specialist.coverPhoto}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, specialist.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          specialist.isFavorite || savedSpecialists.includes(specialist.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Verification Badge */}
                    {specialist.isVerified && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-teal-500 text-white text-xs font-medium rounded-lg">
                        <Verified className="w-3 h-3" />
                        Verified
                      </div>
                    )}

                    {/* Profile Photo */}
                    <div className="absolute -bottom-8 left-4">
                      <div className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden shadow-md">
                        <img
                          src={specialist.photo}
                          alt={specialist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-10 px-4 pb-4">
                    {/* Name & Title */}
                    <div className="mb-2">
                      <h3 className="font-bold text-slate-900">{specialist.name}</h3>
                      <p className="text-sm text-slate-500">{specialist.title}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={specialist.rating} />
                      <span className="text-sm font-medium text-slate-900">{specialist.rating}</span>
                      <span className="text-sm text-slate-400">({specialist.reviewCount} reviews)</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {specialist.specialties.slice(0, 2).map((spec) => (
                        <SpecialtyBadge key={spec} specialtyId={spec} />
                      ))}
                      {specialist.specialties.length > 2 && (
                        <span className="px-2 py-1 text-xs text-slate-500 bg-slate-100 rounded-lg">
                          +{specialist.specialties.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <div className="flex gap-1">
                        {specialist.languages.slice(0, 3).map((lang) => (
                          <LanguageFlag key={lang} code={lang} />
                        ))}
                      </div>
                    </div>

                    {/* Location & Next Available */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {specialist.location}
                        {specialist.distance && (
                          <span className="text-slate-400">• {specialist.distance}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-teal-600">
                        <Clock className="w-3.5 h-3.5" />
                        {specialist.nextAvailable}
                      </div>
                    </div>

                    {/* Bio Excerpt */}
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      {specialist.bio}
                    </p>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-lg font-bold text-slate-900">
                          {specialist.currency}{specialist.pricePerSession}
                        </span>
                        <span className="text-sm text-slate-400">/session</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSpecialist(specialist)}
                          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => startBooking(specialist)}
                          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredSpecialists.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No specialists found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specialist Detail Modal */}
      <AnimatePresence>
        {selectedSpecialist && !bookingStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSpecialist(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-48">
                <img
                  src={selectedSpecialist.coverPhoto}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedSpecialist(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Profile Header */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
                  <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src={selectedSpecialist.photo}
                      alt={selectedSpecialist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-white pb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{selectedSpecialist.name}</h2>
                      {selectedSpecialist.isVerified && (
                        <Verified className="w-5 h-5 text-teal-400" />
                      )}
                    </div>
                    <p className="text-white/80">{selectedSpecialist.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <StarRating rating={selectedSpecialist.rating} />
                      <span className="font-medium">{selectedSpecialist.rating}</span>
                      <span className="text-white/60">({selectedSpecialist.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => toggleFavorite(e, selectedSpecialist.id)}
                      className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          savedSpecialists.includes(selectedSpecialist.id)
                            ? 'fill-red-400 text-red-400'
                            : ''
                        }`}
                      />
                    </button>
                    <button className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex">
                {/* Left Side - Info */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                  {/* Quick Info */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <Briefcase className="w-5 h-5 text-teal-600 mb-2" />
                      <p className="text-lg font-bold text-slate-900">{selectedSpecialist.experience}+</p>
                      <p className="text-xs text-slate-500">Years Experience</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <Award className="w-5 h-5 text-teal-600 mb-2" />
                      <p className="text-lg font-bold text-slate-900">{selectedSpecialist.certifications.length}</p>
                      <p className="text-xs text-slate-500">Certifications</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-teal-600 mb-2" />
                      <p className="text-lg font-bold text-slate-900">{selectedSpecialist.reviewCount}</p>
                      <p className="text-xs text-slate-500">Patients Helped</p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
                    {['about', 'services', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                          activeTab === tab
                            ? 'bg-white text-teal-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      {/* Bio */}
                      <section>
                        <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{selectedSpecialist.bio}</p>
                      </section>

                      {/* Education */}
                      <section>
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Education
                        </h3>
                        <ul className="space-y-2">
                          {selectedSpecialist.education.map((edu, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <Check className="w-4 h-4 text-teal-500 mt-0.5" />
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </section>

                      {/* Certifications */}
                      <section>
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Certifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedSpecialist.certifications.map((cert, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm rounded-lg"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Languages */}
                      <section>
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Languages
                        </h3>
                        <div className="flex gap-3">
                          {selectedSpecialist.languages.map((lang) => {
                            const language = LANGUAGES.find((l) => l.code === lang);
                            return (
                              <div
                                key={lang}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"
                              >
                                <span className="text-lg">{language?.flag}</span>
                                <span className="text-sm text-slate-700">{language?.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div className="space-y-4">
                      {selectedSpecialist.services.map((service) => (
                        <div
                          key={service.id}
                          className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">{service.name}</h4>
                            <span className="text-lg font-bold text-teal-600">
                              {selectedSpecialist.currency}{service.price}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Rating Summary */}
                      <div className="p-4 bg-slate-50 rounded-xl mb-6">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">{selectedSpecialist.rating}</p>
                            <StarRating rating={selectedSpecialist.rating} />
                            <p className="text-sm text-slate-500 mt-1">{selectedSpecialist.reviewCount} reviews</p>
                          </div>
                          <div className="flex-1 space-y-1">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <div key={star} className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-3">{star}</span>
                                <Star className="w-3 h-3 text-amber-400" />
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-amber-400 rounded-full"
                                    style={{ width: `${Math.random() * 60 + 20}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reviews */}
                      {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="p-4 border border-slate-200 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={review.avatar}
                                alt={review.author}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-slate-900">{review.author}</p>
                                <p className="text-xs text-slate-400">{review.date}</p>
                              </div>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{review.content}</p>
                          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side - Booking Panel */}
                <div className="w-80 bg-slate-50 p-6 border-l border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Book Appointment</h3>
                  
                  <div className="space-y-3 mb-6">
                    {/* Session Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Session Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'video', icon: Video, label: 'Video' },
                          { id: 'inPerson', icon: MapPin, label: 'In-Person' },
                          { id: 'chat', icon: MessageSquare, label: 'Chat' },
                        ].map((type) => (
                          <button
                            key={type.id}
                            className="p-2 bg-white border border-slate-200 rounded-lg text-center hover:border-teal-300 transition-colors"
                          >
                            <type.icon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                            <span className="text-xs text-slate-600">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Next Available */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Next Available</p>
                      <p className="font-medium text-teal-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedSpecialist.nextAvailable}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {selectedSpecialist.currency}{selectedSpecialist.pricePerSession}
                        <span className="text-sm font-normal text-slate-400">/session</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => startBooking(selectedSpecialist)}
                    className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Book Appointment
                  </button>

                  <button className="w-full mt-3 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Flow Modal */}
      <AnimatePresence>
        {selectedSpecialist && bookingStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setBookingStep(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Booking Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img
                      src={selectedSpecialist.photo}
                      alt={selectedSpecialist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Book with {selectedSpecialist.name}</h3>
                    <p className="text-sm text-slate-500">{selectedSpecialist.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingStep(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Booking Steps */}
              <div className="p-6">
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                  {[
                    { id: 'select', label: 'Service' },
                    { id: 'datetime', label: 'Date & Time' },
                    { id: 'confirm', label: 'Confirm' },
                  ].map((step, i) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                          bookingStep === step.id
                            ? 'bg-teal-100 text-teal-700 font-medium'
                            : i < ['select', 'datetime', 'confirm'].indexOf(bookingStep || '')
                            ? 'bg-teal-50 text-teal-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          bookingStep === step.id
                            ? 'bg-teal-600 text-white'
                            : i < ['select', 'datetime', 'confirm'].indexOf(bookingStep || '')
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-300 text-white'
                        }`}>
                          {i < ['select', 'datetime', 'confirm'].indexOf(bookingStep || '') ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        {step.label}
                      </div>
                      {i < 2 && <div className="flex-1 h-0.5 bg-slate-200" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step Content */}
                {bookingStep === 'select' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Select a Service</h4>
                    <div className="space-y-3">
                      {selectedSpecialist.services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                            selectedService?.id === service.id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-slate-200 hover:border-teal-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">{service.name}</h5>
                            <span className="text-lg font-bold text-teal-600">
                              {selectedSpecialist.currency}{service.price}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration} minutes
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Session Type */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Session Type</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'video', icon: Video, label: 'Video Call' },
                          { id: 'inPerson', icon: MapPin, label: 'In-Person' },
                          { id: 'chat', icon: MessageSquare, label: 'Chat' },
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setSessionType(type.id as any)}
                            className={`p-4 border-2 rounded-xl text-center transition-colors ${
                              sessionType === type.id
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-slate-200 hover:border-teal-300'
                            }`}
                          >
                            <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                              sessionType === type.id ? 'text-teal-600' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              sessionType === type.id ? 'text-teal-700' : 'text-slate-600'
                            }`}>
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => selectedService && setBookingStep('datetime')}
                      disabled={!selectedService}
                      className="w-full mt-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {bookingStep === 'datetime' && (
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Select Date</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                          <button
                            key={day}
                            onClick={() => setSelectedDate(`2024-03-${6 + i}`)}
                            className={`flex-shrink-0 w-16 p-3 rounded-xl border-2 text-center transition-colors ${
                              selectedDate === `2024-03-${6 + i}`
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-slate-200 hover:border-teal-300'
                            }`}
                          >
                            <p className="text-xs text-slate-500">{day}</p>
                            <p className="font-bold text-slate-900">{6 + i}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Select Time</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                selectedTime === time
                                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                                  : 'border-slate-200 hover:border-teal-300 text-slate-600'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Notes for Specialist (Optional)</h4>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Any specific concerns or topics you'd like to discuss..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep('select')}
                        className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => selectedTime && setBookingStep('confirm')}
                        disabled={!selectedTime}
                        className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 'confirm' && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                      <h4 className="font-semibold text-slate-900">Booking Summary</h4>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                          <img
                            src={selectedSpecialist.photo}
                            alt={selectedSpecialist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{selectedSpecialist.name}</p>
                          <p className="text-sm text-slate-500">{selectedSpecialist.title}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Service</span>
                          <span className="font-medium text-slate-900">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date & Time</span>
                          <span className="font-medium text-slate-900">
                            {selectedDate} at {selectedTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Duration</span>
                          <span className="font-medium text-slate-900">{selectedService?.duration} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Session Type</span>
                          <span className="font-medium text-slate-900 capitalize">{sessionType}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900">Total</span>
                          <span className="text-2xl font-bold text-teal-600">
                            {selectedSpecialist.currency}{selectedService?.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Note */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        You won't be charged until after your appointment. 
                        Cancel up to 24 hours before for a full refund.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep('datetime')}
                        className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={confirmBooking}
                        className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
