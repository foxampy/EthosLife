import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  Navigation,
  Filter,
  Grid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Award,
  Calendar,
  Users,
  Wifi,
  Car,
  Droplets,
  Wind,
  Zap,
  Accessibility,
  Baby,
  CreditCard,
  CheckCircle2,
  Info,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Sparkles,
  Dumbbell,
  Stethoscope,
  Leaf,
  Brain,
  Activity,
  Bike,
  Waves,
  Sun,
  Moon,
  Utensils,
  Coffee,
  ShoppingBag,
  ArrowRight,
  Map as MapIcon,
  Plus,
  Minus,
} from 'lucide-react';

// ==================== TYPES ====================

interface OperatingHours {
  [key: string]: { open: string; close: string; closed?: boolean };
}

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  bookableOnline: boolean;
  preparation?: string;
  category: string;
}

interface Specialist {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  photos?: string[];
  helpful: number;
  ownerResponse?: string;
}

interface MembershipOption {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

interface WellnessCenter {
  id: string;
  name: string;
  type: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  address: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
  website: string;
  hours: OperatingHours;
  services: Service[];
  amenities: string[];
  description: string;
  isVerified: boolean;
  isFeatured: boolean;
  startingPrice: number;
  distance?: number;
  specialists?: Specialist[];
  reviews?: Review[];
  memberships?: MembershipOption[];
}

interface CentersState {
  filters: {
    location: string;
    types: string[];
    services: string[];
    priceRange: [number, number];
    rating: number;
    amenities: string[];
  };
  centers: WellnessCenter[];
  selectedCenter: WellnessCenter | null;
  viewMode: 'grid' | 'list';
}

// ==================== MOCK DATA ====================

const CENTER_TYPES = [
  { id: 'gym', label: 'Fitness Center & Gym', icon: Dumbbell, color: 'bg-orange-500' },
  { id: 'clinic', label: 'Medical Clinic', icon: Stethoscope, color: 'bg-blue-500' },
  { id: 'spa', label: 'Wellness Spa', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'yoga', label: 'Yoga & Pilates Studio', icon: Activity, color: 'bg-green-500' },
  { id: 'nutrition', label: 'Nutrition Center', icon: Utensils, color: 'bg-yellow-500' },
  { id: 'mental', label: 'Mental Health Clinic', icon: Brain, color: 'bg-indigo-500' },
  { id: 'sports', label: 'Sports Medicine', icon: Bike, color: 'bg-red-500' },
  { id: 'rehab', label: 'Rehabilitation Center', icon: Activity, color: 'bg-teal-500' },
  { id: 'alternative', label: 'Alternative Medicine', icon: Leaf, color: 'bg-emerald-500' },
];

const AMENITIES = [
  { id: 'pool', label: 'Swimming Pool', icon: Waves },
  { id: 'sauna', label: 'Sauna', icon: Sun },
  { id: 'steam', label: 'Steam Room', icon: Wind },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'wifi', label: 'Free WiFi', icon: Wifi },
  { id: 'showers', label: 'Showers', icon: Droplets },
  { id: 'lockers', label: 'Lockers', icon: ShoppingBag },
  { id: 'cafe', label: 'Healthy Cafe', icon: Coffee },
  { id: 'childcare', label: 'Childcare', icon: Baby },
  { id: 'accessible', label: 'Wheelchair Accessible', icon: Accessibility },
  { id: 'nutrition', label: 'Nutrition Bar', icon: Utensils },
  { id: 'supplements', label: 'Supplement Shop', icon: ShoppingBag },
];

const MOCK_CENTERS: WellnessCenter[] = [
  {
    id: '1',
    name: 'Equinox Premium Fitness',
    type: 'gym',
    photos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    ],
    rating: 4.8,
    reviewCount: 324,
    address: '123 Madison Avenue, New York, NY 10016',
    coordinates: { lat: 40.7489, lng: -73.9851 },
    phone: '+1 (212) 555-0101',
    email: 'info@equinox-premium.com',
    website: 'www.equinox-premium.com',
    hours: {
      monday: { open: '05:00', close: '23:00' },
      tuesday: { open: '05:00', close: '23:00' },
      wednesday: { open: '05:00', close: '23:00' },
      thursday: { open: '05:00', close: '23:00' },
      friday: { open: '05:00', close: '22:00' },
      saturday: { open: '07:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' },
    },
    services: [
      { id: 's1', name: 'Personal Training Session', duration: '60 min', price: 120, description: 'One-on-one training with certified fitness coach', bookableOnline: true, category: 'Fitness' },
      { id: 's2', name: 'Group HIIT Class', duration: '45 min', price: 35, description: 'High-intensity interval training in group setting', bookableOnline: true, category: 'Classes' },
      { id: 's3', name: 'Yoga Flow', duration: '60 min', price: 30, description: 'Vinyasa yoga for all levels', bookableOnline: true, category: 'Classes' },
      { id: 's4', name: 'Cryotherapy Session', duration: '15 min', price: 65, description: 'Whole body cryotherapy for recovery', bookableOnline: true, category: 'Recovery' },
      { id: 's5', name: 'Massage Therapy', duration: '90 min', price: 180, description: 'Deep tissue sports massage', bookableOnline: true, category: 'Recovery' },
    ],
    amenities: ['pool', 'sauna', 'steam', 'parking', 'wifi', 'showers', 'lockers', 'cafe', 'nutrition'],
    description: 'Experience luxury fitness at its finest. Our state-of-the-art facility features cutting-edge equipment, expert trainers, and world-class amenities including an indoor pool, spa services, and healthy dining options.',
    isVerified: true,
    isFeatured: true,
    startingPrice: 30,
    distance: 0.3,
    specialists: [
      { id: 'sp1', name: 'Marcus Chen', role: 'Head Trainer', photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200', bio: 'NASM certified with 10+ years experience', specialties: ['HIIT', 'Strength Training'], rating: 4.9, reviewCount: 127 },
      { id: 'sp2', name: 'Sarah Williams', role: 'Yoga Instructor', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', bio: 'RYT-500 certified yoga teacher', specialties: ['Vinyasa', 'Meditation'], rating: 4.8, reviewCount: 89 },
    ],
    reviews: [
      { id: 'r1', author: 'Jennifer M.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', rating: 5, date: '2024-03-01', content: 'Absolutely love this gym! The facilities are pristine and the trainers are incredibly knowledgeable.', helpful: 24 },
      { id: 'r2', author: 'Michael R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', rating: 4, date: '2024-02-28', content: 'Great equipment and atmosphere. A bit pricey but worth it for the quality.', helpful: 12, ownerResponse: 'Thank you for your feedback, Michael! We\'re glad you\'re enjoying our facilities.' },
    ],
    memberships: [
      { id: 'm1', name: 'Day Pass', price: 45, period: 'day', features: ['Full facility access', 'Group classes included', 'Locker room access'] },
      { id: 'm2', name: 'All Access', price: 249, period: 'month', features: ['Unlimited visits', 'All locations', 'Guest privileges', 'Spa access', 'Cryotherapy discount'], popular: true },
      { id: 'm3', name: 'Classes Pack', price: 299, period: '10 classes', features: ['10 group classes', 'Valid for 3 months', 'All class types'] },
    ],
  },
  {
    id: '2',
    name: 'Serenity Wellness Spa',
    type: 'spa',
    photos: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
      'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800',
    ],
    rating: 4.9,
    reviewCount: 189,
    address: '456 Park Avenue, New York, NY 10022',
    coordinates: { lat: 40.7629, lng: -73.9776 },
    phone: '+1 (212) 555-0202',
    email: 'book@serenityspa.com',
    website: 'www.serenitywellnessspa.com',
    hours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '20:00' },
    },
    services: [
      { id: 's1', name: 'Swedish Massage', duration: '60 min', price: 140, description: 'Relaxing full-body massage with aromatic oils', bookableOnline: true, category: 'Massage' },
      { id: 's2', name: 'Deep Tissue Massage', duration: '90 min', price: 200, description: 'Intensive massage targeting deep muscle layers', bookableOnline: true, category: 'Massage' },
      { id: 's3', name: 'Hot Stone Therapy', duration: '75 min', price: 165, description: 'Heated basalt stones for deep relaxation', bookableOnline: true, category: 'Massage' },
      { id: 's4', name: 'Facial Treatment', duration: '60 min', price: 130, description: 'Customized facial with premium skincare', bookableOnline: true, category: 'Skincare' },
      { id: 's5', name: 'Body Scrub', duration: '45 min', price: 95, description: 'Exfoliating treatment with organic products', bookableOnline: true, category: 'Body' },
    ],
    amenities: ['sauna', 'steam', 'wifi', 'showers', 'lockers', 'cafe'],
    description: 'Escape the city hustle at Serenity Wellness Spa. Our holistic approach combines ancient healing traditions with modern wellness techniques. Experience tranquility in our luxurious treatment rooms and relaxation lounges.',
    isVerified: true,
    isFeatured: true,
    startingPrice: 95,
    distance: 0.8,
  },
  {
    id: '3',
    name: 'Pure Yoga Manhattan',
    type: 'yoga',
    photos: [
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    ],
    rating: 4.7,
    reviewCount: 256,
    address: '789 Broadway, New York, NY 10003',
    coordinates: { lat: 40.7308, lng: -73.9973 },
    phone: '+1 (212) 555-0303',
    email: 'hello@pureyoga.com',
    website: 'www.pureyoga.com',
    hours: {
      monday: { open: '06:00', close: '21:30' },
      tuesday: { open: '06:00', close: '21:30' },
      wednesday: { open: '06:00', close: '21:30' },
      thursday: { open: '06:00', close: '21:30' },
      friday: { open: '06:00', close: '20:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '08:00', close: '18:00' },
    },
    services: [
      { id: 's1', name: 'Vinyasa Flow', duration: '60 min', price: 28, description: 'Dynamic flowing yoga sequence', bookableOnline: true, category: 'Yoga' },
      { id: 's2', name: 'Power Yoga', duration: '75 min', price: 32, description: 'Strength-focused yoga practice', bookableOnline: true, category: 'Yoga' },
      { id: 's3', name: 'Restorative Yoga', duration: '90 min', price: 35, description: 'Gentle, relaxing practice with props', bookableOnline: true, category: 'Yoga' },
      { id: 's4', name: 'Meditation Class', duration: '45 min', price: 22, description: 'Guided meditation and breathwork', bookableOnline: true, category: 'Meditation' },
    ],
    amenities: ['wifi', 'showers', 'lockers', 'cafe', 'accessible'],
    description: 'Find your inner peace at Pure Yoga Manhattan. We offer a diverse range of yoga styles for practitioners of all levels. Our serene studio space provides the perfect environment for your practice.',
    isVerified: true,
    isFeatured: false,
    startingPrice: 22,
    distance: 1.2,
  },
  {
    id: '4',
    name: 'NYC Medical Wellness Clinic',
    type: 'clinic',
    photos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    ],
    rating: 4.6,
    reviewCount: 142,
    address: '321 5th Avenue, New York, NY 10016',
    coordinates: { lat: 40.7484, lng: -73.9857 },
    phone: '+1 (212) 555-0404',
    email: 'appointments@nycmedical.com',
    website: 'www.nycmedicalwellness.com',
    hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '14:00' },
      sunday: { closed: true, open: '', close: '' },
    },
    services: [
      { id: 's1', name: 'Annual Physical', duration: '45 min', price: 250, description: 'Comprehensive health screening', bookableOnline: true, category: 'Preventive Care' },
      { id: 's2', name: 'Blood Panel Analysis', duration: '30 min', price: 180, description: 'Complete blood work with consultation', bookableOnline: true, category: 'Diagnostics' },
      { id: 's3', name: 'IV Therapy', duration: '60 min', price: 299, description: 'Vitamin and nutrient IV drip', bookableOnline: true, category: 'Wellness' },
      { id: 's4', name: 'Hormone Consultation', duration: '60 min', price: 350, description: 'Comprehensive hormone assessment', bookableOnline: true, category: 'Specialized' },
    ],
    amenities: ['wifi', 'parking', 'accessible'],
    description: 'Comprehensive medical wellness services combining conventional medicine with integrative health approaches. Our board-certified physicians provide personalized care plans for optimal health.',
    isVerified: true,
    isFeatured: false,
    startingPrice: 180,
    distance: 0.5,
  },
  {
    id: '5',
    name: 'Mindful Mental Health Center',
    type: 'mental',
    photos: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    ],
    rating: 4.9,
    reviewCount: 98,
    address: '555 Lexington Avenue, New York, NY 10017',
    coordinates: { lat: 40.7556, lng: -73.9721 },
    phone: '+1 (212) 555-0505',
    email: 'care@mindfulmental.com',
    website: 'www.mindfulmentalhealth.com',
    hours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { closed: true, open: '', close: '' },
    },
    services: [
      { id: 's1', name: 'Initial Consultation', duration: '60 min', price: 200, description: 'Comprehensive mental health assessment', bookableOnline: true, category: 'Therapy' },
      { id: 's2', name: 'Individual Therapy', duration: '50 min', price: 180, description: 'One-on-one counseling session', bookableOnline: true, category: 'Therapy' },
      { id: 's3', name: 'Couples Therapy', duration: '90 min', price: 280, description: 'Relationship counseling session', bookableOnline: true, category: 'Therapy' },
      { id: 's4', name: 'Group Therapy', duration: '90 min', price: 75, description: 'Supportive group counseling', bookableOnline: true, category: 'Groups' },
    ],
    amenities: ['wifi', 'accessible', 'parking'],
    description: 'A safe space for mental wellness and personal growth. Our licensed therapists and counselors provide evidence-based treatments in a supportive, confidential environment.',
    isVerified: true,
    isFeatured: false,
    startingPrice: 75,
    distance: 0.9,
  },
  {
    id: '6',
    name: 'Vitality Sports Medicine',
    type: 'sports',
    photos: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    ],
    rating: 4.7,
    reviewCount: 167,
    address: '888 West 42nd Street, New York, NY 10036',
    coordinates: { lat: 40.7589, lng: -73.9912 },
    phone: '+1 (212) 555-0606',
    email: 'info@vitalitysports.com',
    website: 'www.vitalitysportsmed.com',
    hours: {
      monday: { open: '07:00', close: '19:00' },
      tuesday: { open: '07:00', close: '19:00' },
      wednesday: { open: '07:00', close: '19:00' },
      thursday: { open: '07:00', close: '19:00' },
      friday: { open: '07:00', close: '18:00' },
      saturday: { open: '08:00', close: '16:00' },
      sunday: { closed: true, open: '', close: '' },
    },
    services: [
      { id: 's1', name: 'Sports Physical', duration: '45 min', price: 150, description: 'Comprehensive athletic assessment', bookableOnline: true, category: 'Assessment' },
      { id: 's2', name: 'Physical Therapy Session', duration: '60 min', price: 165, description: 'Rehabilitation and recovery therapy', bookableOnline: true, category: 'Therapy' },
      { id: 's3', name: 'Injury Consultation', duration: '30 min', price: 125, description: 'Sports injury evaluation', bookableOnline: true, category: 'Consultation' },
      { id: 's4', name: 'Performance Testing', duration: '90 min', price: 299, description: 'Athletic performance analysis', bookableOnline: true, category: 'Testing' },
    ],
    amenities: ['wifi', 'parking', 'accessible', 'showers'],
    description: 'Specialized care for athletes of all levels. From injury prevention to performance optimization, our sports medicine experts help you achieve your athletic goals.',
    isVerified: true,
    isFeatured: true,
    startingPrice: 125,
    distance: 1.5,
  },
];

// ==================== HELPER COMPONENTS ====================

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
          className={`${sizeClasses[size]} ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' }> = ({ 
  children, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const IsOpen: React.FC<{ hours: OperatingHours }> = ({ hours }) => {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const todayHours = hours[currentDay];
  if (todayHours?.closed) {
    return <Badge variant="warning">Closed Today</Badge>;
  }

  const [openHour, openMinute] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  const isOpen = currentTime >= openTime && currentTime < closeTime;

  return isOpen ? <Badge variant="success">Open Now</Badge> : <Badge variant="warning">Closed</Badge>;
};

// ==================== MAIN COMPONENT ====================

export default function Centers2() {
  // State
  const [state, setState] = useState<CentersState>({
    filters: {
      location: 'New York, NY',
      types: [],
      services: [],
      priceRange: [0, 500],
      rating: 0,
      amenities: [],
    },
    centers: MOCK_CENTERS,
    selectedCenter: null,
    viewMode: 'grid',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedCenters, setSavedCenters] = useState<string[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'staff'>('overview');
  const [showNearMe, setShowNearMe] = useState(false);

  // Filter centers
  const filteredCenters = useMemo(() => {
    return state.centers.filter((center) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          center.name.toLowerCase().includes(query) ||
          center.address.toLowerCase().includes(query) ||
          center.services.some(s => s.name.toLowerCase().includes(query)) ||
          center.amenities.some(a => a.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (state.filters.types.length > 0 && !state.filters.types.includes(center.type)) {
        return false;
      }

      // Rating filter
      if (state.filters.rating > 0 && center.rating < state.filters.rating) {
        return false;
      }

      // Price filter
      if (center.startingPrice < state.filters.priceRange[0] || center.startingPrice > state.filters.priceRange[1]) {
        return false;
      }

      // Amenities filter
      if (state.filters.amenities.length > 0) {
        const hasAllAmenities = state.filters.amenities.every(a => center.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      // Featured first, then by rating
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });
  }, [state.centers, state.filters, searchQuery]);

  // Handlers
  const toggleType = (typeId: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        types: prev.filters.types.includes(typeId)
          ? prev.filters.types.filter(t => t !== typeId)
          : [...prev.filters.types, typeId],
      },
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        amenities: prev.filters.amenities.includes(amenityId)
          ? prev.filters.amenities.filter(a => a !== amenityId)
          : [...prev.filters.amenities, amenityId],
      },
    }));
  };

  const toggleSaveCenter = (centerId: string) => {
    setSavedCenters(prev => 
      prev.includes(centerId) 
        ? prev.filter(id => id !== centerId)
        : [...prev, centerId]
    );
  };

  const nextPhoto = (centerId: string, totalPhotos: number) => {
    setActivePhotoIndex(prev => ({
      ...prev,
      [centerId]: ((prev[centerId] || 0) + 1) % totalPhotos,
    }));
  };

  const prevPhoto = (centerId: string, totalPhotos: number) => {
    setActivePhotoIndex(prev => ({
      ...prev,
      [centerId]: ((prev[centerId] || 0) - 1 + totalPhotos) % totalPhotos,
    }));
  };

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {
        location: prev.filters.location,
        types: [],
        services: [],
        priceRange: [0, 500],
        rating: 0,
        amenities: [],
      },
    }));
    setSearchQuery('');
  };

  const activeFiltersCount = state.filters.types.length + state.filters.amenities.length + 
    (state.filters.rating > 0 ? 1 : 0) + 
    (state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 500 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================== HERO SECTION ==================== */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Discover Wellness Centers
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Find top-rated gyms, spas, clinics, and wellness studios near you. Book appointments instantly.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search centers, services, or treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl md:border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={state.filters.location}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, location: e.target.value }
                  }))}
                  className="bg-transparent outline-none text-gray-800 w-32 md:w-40"
                />
              </div>
              <button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowNearMe(true)}
              >
                <Navigation className="w-4 h-4" />
                <span>Near Me</span>
              </button>
            </div>

            {/* Quick Type Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CENTER_TYPES.slice(0, 6).map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    state.filters.types.includes(type.id)
                      ? 'bg-white text-emerald-800 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FILTER BAR ==================== */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm whitespace-nowrap transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-gray-300 mx-1" />

              {/* Rating Filter */}
              <select
                value={state.filters.rating}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  filters: { ...prev.filters, rating: Number(e.target.value) }
                }))}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>

              {/* Price Filter */}
              <select
                value={`${state.filters.priceRange[0]}-${state.filters.priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, priceRange: [min, max] }
                  }));
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="0-500">Any Price</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200+</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden md:inline">
                {filteredCenters.length} results
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setState(prev => ({ ...prev, viewMode: 'grid' }))}
                  className={`p-2 ${state.viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, viewMode: 'list' }))}
                  className={`p-2 ${state.viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Center Types */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Center Type</h4>
                  <div className="space-y-2">
                    {CENTER_TYPES.map((type) => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={state.filters.types.includes(type.id)}
                          onChange={() => toggleType(type.id)}
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                  <div className="space-y-2">
                    {AMENITIES.map((amenity) => (
                      <label key={amenity.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={state.filters.amenities.includes(amenity.id)}
                          onChange={() => toggleAmenity(amenity.id)}
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        />
                        <amenity.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Opening Hours</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Open Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                      <Sun className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Open Early (before 7AM)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                      <Moon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Open Late (after 9PM)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Open Weekends</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCenters.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No centers found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            state.viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${
                  state.viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => setState(prev => ({ ...prev, selectedCenter: center }))}
              >
                {/* Image Section */}
                <div className={`relative ${state.viewMode === 'list' ? 'w-72 shrink-0' : 'aspect-[4/3]'}`}>
                  <img
                    src={center.photos[activePhotoIndex[center.id] || 0]}
                    alt={center.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {center.photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevPhoto(center.id, center.photos.length); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextPhoto(center.id, center.photos.length); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {center.photos.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              idx === (activePhotoIndex[center.id] || 0) ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {center.isFeatured && (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    {center.isVerified && (
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSaveCenter(center.id); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${savedCenters.includes(center.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>

                  {/* Type Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-white text-xs font-semibold px-2.5 py-1 rounded-full ${
                      CENTER_TYPES.find(t => t.id === center.type)?.color || 'bg-gray-500'
                    }`}>
                      {CENTER_TYPES.find(t => t.id === center.type)?.label || center.type}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{center.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={center.rating} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">{center.rating}</span>
                    <span className="text-sm text-gray-500">({center.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{center.address}</span>
                    {center.distance && (
                      <span className="text-emerald-600 font-medium shrink-0">• {center.distance} mi</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <IsOpen hours={center.hours} />
                  </div>

                  {/* Services Preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {center.services.slice(0, 3).map((service) => (
                      <span key={service.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {service.name}
                      </span>
                    ))}
                    {center.services.length > 3 && (
                      <span className="text-xs text-gray-500 px-1">+{center.services.length - 3}</span>
                    )}
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex items-center gap-2 mb-4">
                    {center.amenities.slice(0, 5).map((amenityId) => {
                      const amenity = AMENITIES.find(a => a.id === amenityId);
                      return amenity ? (
                        <div key={amenityId} className="text-gray-400" title={amenity.label}>
                          <amenity.icon className="w-4 h-4" />
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">From</span>
                      <p className="font-bold text-emerald-600 text-lg">${center.startingPrice}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, selectedCenter: center })); }}
                        className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                      >
                        Book Visit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== CENTER DETAIL MODAL ==================== */}
      {state.selectedCenter && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setState(prev => ({ ...prev, selectedCenter: null }))}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-5xl my-8 text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setState(prev => ({ ...prev, selectedCenter: null }))}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header Image Gallery */}
              <div className="relative h-64 md:h-96">
                <div className="absolute inset-0 flex">
                  {state.selectedCenter.photos.map((photo, idx) => (
                    <div key={idx} className="flex-1">
                      <img
                        src={photo}
                        alt={`${state.selectedCenter!.name} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 md:left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      CENTER_TYPES.find(t => t.id === state.selectedCenter!.type)?.color || 'bg-gray-500'
                    }`}>
                      {CENTER_TYPES.find(t => t.id === state.selectedCenter!.type)?.label}
                    </span>
                    {state.selectedCenter.isVerified && (
                      <span className="bg-blue-500 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{state.selectedCenter.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <StarRating rating={state.selectedCenter.rating} size="lg" />
                    <span className="font-semibold">{state.selectedCenter.rating}</span>
                    <span className="text-white/80">({state.selectedCenter.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-b border-gray-200 bg-gray-50 px-4 md:px-6 py-3 flex items-center gap-3 overflow-x-auto">
                <button 
                  onClick={() => toggleSaveCenter(state.selectedCenter!.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors shrink-0 ${
                    savedCenters.includes(state.selectedCenter!.id)
                      ? 'bg-red-50 text-red-600'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${savedCenters.includes(state.selectedCenter!.id) ? 'fill-current' : ''}`} />
                  {savedCenters.includes(state.selectedCenter!.id) ? 'Saved' : 'Save'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
                <div className="flex-1" />
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0">
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 px-4 md:px-6">
                <div className="flex gap-6">
                  {(['overview', 'services', 'reviews', 'staff'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? 'border-emerald-600 text-emerald-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                      <>
                        {/* Description */}
                        <section>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                          <p className="text-gray-600 leading-relaxed">{state.selectedCenter.description}</p>
                        </section>

                        {/* Amenities */}
                        <section>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">Amenities</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {state.selectedCenter.amenities.map((amenityId) => {
                              const amenity = AMENITIES.find(a => a.id === amenityId);
                              return amenity ? (
                                <div key={amenityId} className="flex items-center gap-2 text-gray-700">
                                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <amenity.icon className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  <span className="text-sm">{amenity.label}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </section>

                        {/* Services Preview */}
                        <section>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">Popular Services</h3>
                            <button 
                              onClick={() => setActiveTab('services')}
                              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              View all
                            </button>
                          </div>
                          <div className="space-y-3">
                            {state.selectedCenter.services.slice(0, 3).map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                                  <p className="text-sm text-gray-500">{service.duration} • {service.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-emerald-600">${service.price}</p>
                                  {service.bookableOnline && (
                                    <span className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Book online
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* Membership Options */}
                        {state.selectedCenter.memberships && (
                          <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Membership Options</h3>
                            <div className="grid gap-3">
                              {state.selectedCenter.memberships.map((membership) => (
                                <div 
                                  key={membership.id} 
                                  className={`p-4 rounded-xl border-2 transition-colors ${
                                    membership.popular 
                                      ? 'border-emerald-500 bg-emerald-50/50' 
                                      : 'border-gray-200 hover:border-emerald-200'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{membership.name}</h4>
                                      {membership.popular && (
                                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                          Most Popular
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-gray-900">${membership.price}</p>
                                      <p className="text-xs text-gray-500">/{membership.period}</p>
                                    </div>
                                  </div>
                                  <ul className="space-y-1">
                                    {membership.features.map((feature, idx) => (
                                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </>
                    )}

                    {activeTab === 'services' && (
                      <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">All Services</h3>
                        <div className="space-y-4">
                          {['Fitness', 'Recovery', 'Wellness', 'Classes'].map((category) => {
                            const categoryServices = state.selectedCenter!.services.filter(s => s.category === category);
                            if (categoryServices.length === 0) return null;
                            return (
                              <div key={category}>
                                <h4 className="font-semibold text-gray-700 mb-2">{category}</h4>
                                <div className="space-y-2">
                                  {categoryServices.map((service) => (
                                    <div key={service.id} className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h5 className="font-semibold text-gray-900">{service.name}</h5>
                                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-4 h-4" />
                                              {service.duration}
                                            </span>
                                            {service.preparation && (
                                              <span className="flex items-center gap-1">
                                                <Info className="w-4 h-4" />
                                                Preparation required
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                          <p className="font-bold text-lg text-emerald-600">${service.price}</p>
                                          <button className="mt-2 px-4 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                                            Book
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {activeTab === 'reviews' && (
                      <section>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-center">
                            <p className="text-5xl font-bold text-gray-900">{state.selectedCenter!.rating}</p>
                            <StarRating rating={state.selectedCenter!.rating} size="md" />
                            <p className="text-sm text-gray-500 mt-1">{state.selectedCenter!.reviewCount} reviews</p>
                          </div>
                          <div className="flex-1 space-y-1">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <div key={star} className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 w-3">{star}</span>
                                <Star className="w-4 h-4 text-gray-300" />
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${Math.random() * 60 + 10}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {state.selectedCenter!.reviews?.map((review) => (
                            <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-start gap-3">
                                <img 
                                  src={review.avatar} 
                                  alt={review.author}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{review.author}</span>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1 my-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <p className="text-gray-700 mt-2">{review.content}</p>
                                  <div className="flex items-center gap-4 mt-3">
                                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                      <ThumbsUp className="w-4 h-4" />
                                      Helpful ({review.helpful})
                                    </button>
                                    <button className="text-sm text-gray-500 hover:text-gray-700">
                                      Report
                                    </button>
                                  </div>
                                  {review.ownerResponse && (
                                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                      <p className="text-sm font-semibold text-gray-900 mb-1">Response from owner</p>
                                      <p className="text-sm text-gray-600">{review.ownerResponse}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {activeTab === 'staff' && state.selectedCenter!.specialists && (
                      <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Our Specialists</h3>
                        <div className="grid gap-4">
                          {state.selectedCenter!.specialists.map((specialist) => (
                            <div key={specialist.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                              <img 
                                src={specialist.photo} 
                                alt={specialist.name}
                                className="w-20 h-20 rounded-xl object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{specialist.name}</h4>
                                    <p className="text-sm text-emerald-600">{specialist.role}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-sm">{specialist.rating}</span>
                                    <span className="text-sm text-gray-500">({specialist.reviewCount})</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{specialist.bio}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {specialist.specialties.map((spec, idx) => (
                                    <span key={idx} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                                <button className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                  Book with {specialist.name.split(' ')[0]}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <a href={`tel:${state.selectedCenter.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-emerald-600">
                          <Phone className="w-5 h-5" />
                          <span>{state.selectedCenter.phone}</span>
                        </a>
                        <a href={`mailto:${state.selectedCenter.email}`} className="flex items-center gap-3 text-gray-700 hover:text-emerald-600">
                          <Mail className="w-5 h-5" />
                          <span className="text-sm">{state.selectedCenter.email}</span>
                        </a>
                        <a href={`https://${state.selectedCenter.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-emerald-600">
                          <Globe className="w-5 h-5" />
                          <span className="text-sm">{state.selectedCenter.website}</span>
                        </a>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Opening Hours</h4>
                      <div className="space-y-2">
                        {Object.entries(state.selectedCenter.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="capitalize text-gray-600">{day}</span>
                            <span className={hours.closed ? 'text-red-500' : 'text-gray-900'}>
                              {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Location Map Placeholder */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MapIcon className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Map integration would go here</p>
                          <p className="text-xs">{state.selectedCenter.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
