/**
 * CentersUnified - Wellness Centers Directory
 * Map view and list of nearby health & wellness centers
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Navigation,
  Phone,
  Globe,
  Heart,
  Filter,
  Dumbbell,
  Stethoscope,
  Sparkles,
  Activity,
  Brain,
  Leaf,
  Bike,
  X,
  ChevronRight,
  Map as MapIcon,
  List,
  ExternalLink,
  Share2,
  Bookmark,
  CheckCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { ElCard, ElButton, ElInput } from '../../components/ElCore';

// ==================== Types ====================

type CenterType = 'all' | 'gym' | 'clinic' | 'spa' | 'yoga' | 'nutrition' | 'mental' | 'sports';

interface OperatingHours {
  [key: string]: { open: string; close: string; isOpen: boolean };
}

interface WellnessCenter {
  id: string;
  name: string;
  type: CenterType;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  phone: string;
  website: string;
  hours: OperatingHours;
  amenities: string[];
  description: string;
  isVerified: boolean;
  isFavorite: boolean;
  priceRange: string;
}

// ==================== Mock Data ====================

const CENTER_TYPES: { id: CenterType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'all', label: 'All Centers', icon: Sparkles, color: 'from-gray-500 to-gray-600' },
  { id: 'gym', label: 'Gyms', icon: Dumbbell, color: 'from-orange-500 to-red-500' },
  { id: 'clinic', label: 'Clinics', icon: Stethoscope, color: 'from-blue-500 to-cyan-500' },
  { id: 'spa', label: 'Spas', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'yoga', label: 'Yoga', icon: Activity, color: 'from-green-500 to-teal-500' },
  { id: 'nutrition', label: 'Nutrition', icon: Leaf, color: 'from-yellow-500 to-orange-500' },
  { id: 'mental', label: 'Mental Health', icon: Brain, color: 'from-indigo-500 to-purple-500' },
  { id: 'sports', label: 'Sports Med', icon: Bike, color: 'from-red-500 to-rose-500' },
];

const MOCK_CENTERS: WellnessCenter[] = [
  {
    id: '1',
    name: 'Equinox Premium Fitness',
    type: 'gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    rating: 4.8,
    reviewCount: 324,
    address: '123 Madison Avenue, New York, NY',
    distance: '0.3 mi',
    phone: '+1 (212) 555-0101',
    website: 'www.equinox-premium.com',
    hours: {
      monday: { open: '05:00', close: '23:00', isOpen: true },
      tuesday: { open: '05:00', close: '23:00', isOpen: true },
      wednesday: { open: '05:00', close: '23:00', isOpen: true },
      thursday: { open: '05:00', close: '23:00', isOpen: true },
      friday: { open: '05:00', close: '22:00', isOpen: true },
      saturday: { open: '07:00', close: '20:00', isOpen: true },
      sunday: { open: '08:00', close: '18:00', isOpen: true },
    },
    amenities: ['Pool', 'Sauna', 'Parking', 'WiFi', 'Showers', 'Cafe'],
    description: 'Luxury fitness center with state-of-the-art equipment and world-class amenities.',
    isVerified: true,
    isFavorite: false,
    priceRange: '$$$',
  },
  {
    id: '2',
    name: 'Serenity Wellness Spa',
    type: 'spa',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    rating: 4.9,
    reviewCount: 189,
    address: '456 Park Avenue, New York, NY',
    distance: '0.8 mi',
    phone: '+1 (212) 555-0202',
    website: 'www.serenitywellnessspa.com',
    hours: {
      monday: { open: '09:00', close: '21:00', isOpen: true },
      tuesday: { open: '09:00', close: '21:00', isOpen: true },
      wednesday: { open: '09:00', close: '21:00', isOpen: true },
      thursday: { open: '09:00', close: '21:00', isOpen: true },
      friday: { open: '09:00', close: '22:00', isOpen: true },
      saturday: { open: '10:00', close: '22:00', isOpen: true },
      sunday: { open: '10:00', close: '20:00', isOpen: true },
    },
    amenities: ['Sauna', 'Steam Room', 'WiFi', 'Showers', 'Lockers'],
    description: 'Holistic spa combining ancient healing traditions with modern wellness techniques.',
    isVerified: true,
    isFavorite: true,
    priceRange: '$$',
  },
  {
    id: '3',
    name: 'Pure Yoga Manhattan',
    type: 'yoga',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    rating: 4.7,
    reviewCount: 256,
    address: '789 Broadway, New York, NY',
    distance: '1.2 mi',
    phone: '+1 (212) 555-0303',
    website: 'www.pureyoga.com',
    hours: {
      monday: { open: '06:00', close: '21:30', isOpen: true },
      tuesday: { open: '06:00', close: '21:30', isOpen: true },
      wednesday: { open: '06:00', close: '21:30', isOpen: true },
      thursday: { open: '06:00', close: '21:30', isOpen: true },
      friday: { open: '06:00', close: '20:00', isOpen: true },
      saturday: { open: '08:00', close: '18:00', isOpen: true },
      sunday: { open: '08:00', close: '18:00', isOpen: true },
    },
    amenities: ['WiFi', 'Showers', 'Lockers', 'Cafe', 'Mats'],
    description: 'Serene studio space offering diverse yoga styles for all levels.',
    isVerified: true,
    isFavorite: false,
    priceRange: '$',
  },
  {
    id: '4',
    name: 'NYC Medical Wellness Clinic',
    type: 'clinic',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    rating: 4.6,
    reviewCount: 142,
    address: '321 5th Avenue, New York, NY',
    distance: '0.5 mi',
    phone: '+1 (212) 555-0404',
    website: 'www.nycmedicalwellness.com',
    hours: {
      monday: { open: '08:00', close: '18:00', isOpen: true },
      tuesday: { open: '08:00', close: '18:00', isOpen: true },
      wednesday: { open: '08:00', close: '18:00', isOpen: true },
      thursday: { open: '08:00', close: '18:00', isOpen: true },
      friday: { open: '08:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '14:00', isOpen: true },
      sunday: { open: 'Closed', close: 'Closed', isOpen: false },
    },
    amenities: ['Parking', 'WiFi', 'Wheelchair Accessible'],
    description: 'Comprehensive medical wellness combining conventional and integrative medicine.',
    isVerified: true,
    isFavorite: false,
    priceRange: '$$$',
  },
  {
    id: '5',
    name: 'Mindful Mental Health Center',
    type: 'mental',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    rating: 4.9,
    reviewCount: 98,
    address: '555 Lexington Avenue, New York, NY',
    distance: '0.9 mi',
    phone: '+1 (212) 555-0505',
    website: 'www.mindfulmentalhealth.com',
    hours: {
      monday: { open: '08:00', close: '20:00', isOpen: true },
      tuesday: { open: '08:00', close: '20:00', isOpen: true },
      wednesday: { open: '08:00', close: '20:00', isOpen: true },
      thursday: { open: '08:00', close: '20:00', isOpen: true },
      friday: { open: '08:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: 'Closed', close: 'Closed', isOpen: false },
    },
    amenities: ['WiFi', 'Parking', 'Wheelchair Accessible'],
    description: 'Safe space for mental wellness with licensed therapists and counselors.',
    isVerified: true,
    isFavorite: false,
    priceRange: '$$',
  },
  {
    id: '6',
    name: 'Vitality Sports Medicine',
    type: 'sports',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    rating: 4.7,
    reviewCount: 167,
    address: '888 West 42nd Street, New York, NY',
    distance: '1.5 mi',
    phone: '+1 (212) 555-0606',
    website: 'www.vitalitysportsmed.com',
    hours: {
      monday: { open: '07:00', close: '19:00', isOpen: true },
      tuesday: { open: '07:00', close: '19:00', isOpen: true },
      wednesday: { open: '07:00', close: '19:00', isOpen: true },
      thursday: { open: '07:00', close: '19:00', isOpen: true },
      friday: { open: '07:00', close: '18:00', isOpen: true },
      saturday: { open: '08:00', close: '16:00', isOpen: true },
      sunday: { open: 'Closed', close: 'Closed', isOpen: false },
    },
    amenities: ['WiFi', 'Parking', 'Showers', 'Wheelchair Accessible'],
    description: 'Specialized care for athletes from injury prevention to performance optimization.',
    isVerified: true,
    isFavorite: true,
    priceRange: '$$$',
  },
  {
    id: '7',
    name: 'Green Leaf Nutrition Center',
    type: 'nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    rating: 4.8,
    reviewCount: 134,
    address: '222 Spring Street, New York, NY',
    distance: '2.1 mi',
    phone: '+1 (212) 555-0707',
    website: 'www.greenleafnutrition.com',
    hours: {
      monday: { open: '09:00', close: '19:00', isOpen: true },
      tuesday: { open: '09:00', close: '19:00', isOpen: true },
      wednesday: { open: '09:00', close: '19:00', isOpen: true },
      thursday: { open: '09:00', close: '19:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '15:00', isOpen: true },
      sunday: { open: 'Closed', close: 'Closed', isOpen: false },
    },
    amenities: ['WiFi', 'Parking', 'Consultation Rooms'],
    description: 'Personalized nutrition counseling and wellness coaching services.',
    isVerified: false,
    isFavorite: false,
    priceRange: '$$',
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

const IsOpenBadge: React.FC<{ hours: OperatingHours }> = ({ hours }) => {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const todayHours = hours[currentDay];
  
  if (!todayHours.isOpen) {
    return (
      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
        Closed Today
      </span>
    );
  }

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const [openHour] = todayHours.open.split(':').map(Number);
  const [closeHour] = todayHours.close.split(':').map(Number);
  
  const isOpen = currentHour >= openHour && currentHour < closeHour;

  return isOpen ? (
    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      Open Now
    </span>
  ) : (
    <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
      Closed
    </span>
  );
};

const CenterCard: React.FC<{
  center: WellnessCenter;
  onToggleFavorite: (id: string) => void;
}> = ({ center, onToggleFavorite }) => {
  const typeInfo = CENTER_TYPES.find(t => t.id === center.type);
  const Icon = typeInfo?.icon || Sparkles;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <ElCard hover className="overflow-hidden">
        {/* Image */}
        <div className="relative h-40 -mx-6 -mt-6 mb-4">
          <img
            src={center.image}
            alt={center.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${typeInfo?.color || 'from-gray-500 to-gray-600'}`}>
              <Icon className="w-3 h-3" />
              {typeInfo?.label}
            </span>
          </div>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(center.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${center.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Verified */}
          {center.isVerified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg">
              <CheckCircle className="w-3 h-3" />
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-bold text-[var(--text-primary)] text-lg">{center.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={center.rating} size="sm" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{center.rating}</span>
            <span className="text-xs text-[var(--text-tertiary)]">({center.reviewCount} reviews)</span>
            <span className="text-xs text-[var(--text-tertiary)] ml-2">{center.priceRange}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mt-2 text-sm text-[var(--text-secondary)]">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{center.address}</span>
          </div>

          {/* Distance & Hours */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-[var(--neon-cyan)]">{center.distance}</span>
            <IsOpenBadge hours={center.hours} />
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mt-3">
            {center.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="px-2 py-0.5 text-xs bg-[var(--bone-300)] text-[var(--text-secondary)] rounded-full">
                {amenity}
              </span>
            ))}
            {center.amenities.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
                +{center.amenities.length - 4}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--bone-400)]/30">
            <ElButton variant="flat" size="sm" className="flex-1" leftIcon={<Phone className="w-4 h-4" />}>
              Call
            </ElButton>
            <ElButton variant="gradient" size="sm" className="flex-1" leftIcon={<Navigation className="w-4 h-4" />}>
              Directions
            </ElButton>
          </div>
        </div>
      </ElCard>
    </motion.div>
  );
};

// ==================== Main Component ====================

export const CentersUnified: React.FC = () => {
  const [activeType, setActiveType] = useState<CenterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [centers, setCenters] = useState(MOCK_CENTERS);
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredCenters = useMemo(() => {
    return centers.filter((c) => {
      const matchesType = activeType === 'all' || c.type === activeType;
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFavorites = !showFavorites || c.isFavorite;
      return matchesType && matchesSearch && matchesFavorites;
    });
  }, [centers, activeType, searchQuery, showFavorites]);

  const toggleFavorite = (id: string) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
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
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Wellness Centers</h1>
                <p className="text-sm text-[var(--text-secondary)]">Find gyms, clinics, spas near you</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl md:ml-8">
              <ElInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search centers, locations, amenities..."
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
              <div className="flex items-center bg-[var(--bone-300)] rounded-xl p-1">
                <button
                  onClick={() => setShowMap(false)}
                  className={`p-2 rounded-lg transition-colors ${!showMap ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMap(true)}
                  className={`p-2 rounded-lg transition-colors ${showMap ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)]'}`}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {CENTER_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = activeType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white shadow-lg'
                      : 'bg-[var(--bone-300)] text-[var(--text-secondary)] hover:bg-[var(--bone-400)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {showMap ? (
          /* Map View */
          <div className="space-y-4">
            {/* Map Placeholder */}
            <div className="relative h-[400px] rounded-3xl bg-[var(--bone-300)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--bone-300)] to-[var(--bone-400)]" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C9283' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
              <div className="relative z-10 text-center">
                <MapIcon className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Map View</h3>
                <p className="text-[var(--text-secondary)] mb-4">Interactive map coming soon</p>
                <ElButton variant="flat" size="sm" onClick={() => setShowMap(false)}>
                  Switch to List View
                </ElButton>
              </div>
              
              {/* Mock Map Pins */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Nearby List */}
            <h2 className="text-lg font-bold text-[var(--text-primary)] mt-6">Nearby Centers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCenters.slice(0, 3).map((center) => (
                <CenterCard key={center.id} center={center} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          </div>
        ) : (
          /* List View */
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[var(--text-secondary)]">
                Showing <span className="font-semibold text-[var(--text-primary)]">{filteredCenters.length}</span> centers
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
            </div>

            {filteredCenters.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--bone-300)] flex items-center justify-center">
                  <Search className="w-8 h-8 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No centers found</h3>
                <p className="text-[var(--text-secondary)]">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCenters.map((center) => (
                  <CenterCard key={center.id} center={center} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CentersUnified;
