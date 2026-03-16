import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tempStorage } from '../services/tempStorage';
import { useAuthStore } from '../store/authStore';

interface GuestDataContextType {
  // Generic data access
  getData: <T>(key: string) => T | null;
  setData: <T>(key: string, data: T) => boolean;
  removeData: (key: string) => boolean;
  
  // Health data
  nutrition: any;
  saveNutrition: (data: any) => boolean;
  
  fitness: any;
  saveFitness: (data: any) => boolean;
  
  sleep: any;
  saveSleep: (data: any) => boolean;
  
  mood: any;
  saveMood: (data: any) => boolean;
  
  bodyMetrics: any;
  saveBodyMetrics: (data: any) => boolean;
  
  // Profile data
  profile: any;
  saveProfile: (data: any) => boolean;
  
  // Clear all
  clearAllGuestData: () => void;
  
  // Has data
  hasData: boolean;
  
  // Show upsell
  shouldShowUpsell: boolean;
}

const GuestDataContext = createContext<GuestDataContextType | undefined>(undefined);

export const GuestDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [hasData, setHasData] = useState(false);
  const [shouldShowUpsell, setShouldShowUpsell] = useState(false);
  
  // Generic data access
  const getData = useCallback(<T,>(key: string): T | null => {
    return tempStorage.get(key as any) as T | null;
  }, []);
  
  const setData = useCallback(<T,>(key: string, data: T): boolean => {
    return tempStorage.save(key as any, data);
  }, []);
  
  const removeData = useCallback((key: string): boolean => {
    return tempStorage.remove(key as any);
  }, []);
  
  // Nutrition
  const [nutrition, setNutrition] = useState<any>(null);
  const saveNutrition = (data: any): boolean => {
    const success = tempStorage.save(tempStorage.DATA_TYPES.NUTRITION, data);
    if (success) setNutrition(data);
    return success;
  };
  
  // Fitness
  const [fitness, setFitness] = useState<any>(null);
  const saveFitness = (data: any): boolean => {
    const success = tempStorage.save(tempStorage.DATA_TYPES.FITNESS, data);
    if (success) setFitness(data);
    return success;
  };
  
  // Sleep
  const [sleep, setSleep] = useState<any>(null);
  const saveSleep = (data: any): boolean => {
    const success = tempStorage.save(tempStorage.DATA_TYPES.SLEEP, data);
    if (success) setSleep(data);
    return success;
  };
  
  // Mood
  const [mood, setMood] = useState<any>(null);
  const saveMood = (data: any): boolean => {
    const success = tempStorage.save(tempStorage.DATA_TYPES.MENTAL, data);
    if (success) setMood(data);
    return success;
  };
  
  // Body Metrics
  const [bodyMetrics, setBodyMetrics] = useState<any>(null);
  const saveBodyMetrics = (data: any): boolean => {
    const success = tempStorage.save(tempStorage.DATA_TYPES.BODY, data);
    if (success) setBodyMetrics(data);
    return success;
  };
  
  // Profile
  const [profile, setProfile] = useState<any>(null);
  const saveProfile = (data: any): boolean => {
    const success = tempStorage.save(tempStorage.DATA_TYPES.PROFILE, data);
    if (success) setProfile(data);
    return success;
  };
  
  // Load data on mount
  useEffect(() => {
    if (isAuthenticated) {
      setHasData(false);
      setShouldShowUpsell(false);
      return;
    }
    
    // Load all temp data
    setNutrition(tempStorage.get(tempStorage.DATA_TYPES.NUTRITION));
    setFitness(tempStorage.get(tempStorage.DATA_TYPES.FITNESS));
    setSleep(tempStorage.get(tempStorage.DATA_TYPES.SLEEP));
    setMood(tempStorage.get(tempStorage.DATA_TYPES.MENTAL));
    setBodyMetrics(tempStorage.get(tempStorage.DATA_TYPES.BODY));
    setProfile(tempStorage.get(tempStorage.DATA_TYPES.PROFILE));
    
    // Check if has any data
    const hasAnyData = tempStorage.hasData();
    setHasData(hasAnyData);
    
    // Show upsell after 30 seconds if guest has interacted
    const timer = setTimeout(() => {
      if (!isAuthenticated && hasAnyData) {
        setShouldShowUpsell(true);
      }
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  // Clear all guest data
  const clearAllGuestData = useCallback(() => {
    tempStorage.clearAll();
    setNutrition(null);
    setFitness(null);
    setSleep(null);
    setMood(null);
    setBodyMetrics(null);
    setProfile(null);
    setHasData(false);
    setShouldShowUpsell(false);
  }, []);
  
  const value = {
    getData,
    setData,
    removeData,
    nutrition,
    saveNutrition,
    fitness,
    saveFitness,
    sleep,
    saveSleep,
    mood,
    saveMood,
    bodyMetrics,
    saveBodyMetrics,
    profile,
    saveProfile,
    clearAllGuestData,
    hasData,
    shouldShowUpsell,
  };
  
  return (
    <GuestDataContext.Provider value={value}>
      {children}
    </GuestDataContext.Provider>
  );
};

export const useGuestData = (): GuestDataContextType => {
  const context = useContext(GuestDataContext);
  if (context === undefined) {
    throw new Error('useGuestData must be used within a GuestDataProvider');
  }
  return context;
};

export default GuestDataContext;
