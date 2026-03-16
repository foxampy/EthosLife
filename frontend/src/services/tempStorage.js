/**
 * Temporary Data Storage Service
 * Stores user data temporarily in localStorage/sessionStorage until registration
 * After registration, data can be migrated to the server
 */

const STORAGE_PREFIX = 'ethoslife_temp_';
const SESSION_PREFIX = 'ethoslife_session_';

// Data types that should be stored
const DATA_TYPES = {
  // Health data
  NUTRITION: 'nutrition',
  FITNESS: 'fitness',
  SLEEP: 'sleep',
  MENTAL: 'mental',
  MEDICAL: 'medical',
  BODY: 'body',
  ENVIRONMENT: 'environment',
  
  // Social data
  POSTS: 'posts',
  COMMENTS: 'comments',
  MESSAGES: 'messages',
  
  // Profile data
  PROFILE: 'profile',
  SETTINGS: 'settings',
  
  // Dashboard data
  DASHBOARD: 'dashboard',
  
  // AI data
  AI_CHAT: 'ai_chat',
  
  // Marketplace
  CART: 'cart',
  ORDERS: 'orders',
  
  // Analytics
  ANALYTICS: 'analytics',
  
  // Gamification
  ACHIEVEMENTS: 'achievements',
  POINTS: 'points',
};

/**
 * Generate a unique guest ID if not exists
 */
function getGuestId() {
  let guestId = localStorage.getItem(`${STORAGE_PREFIX}guest_id`);
  
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(`${STORAGE_PREFIX}guest_id`, guestId);
  }
  
  return guestId;
}

/**
 * Get storage key for a data type
 */
function getStorageKey(dataType, useSession = false) {
  const prefix = useSession ? SESSION_PREFIX : STORAGE_PREFIX;
  const guestId = getGuestId();
  return `${prefix}${dataType}_${guestId}`;
}

/**
 * Save data temporarily
 * @param {string} dataType - Type of data (from DATA_TYPES)
 * @param {any} data - Data to store
 * @param {boolean} useSession - Use sessionStorage instead of localStorage
 */
function saveTempData(dataType, data, useSession = false) {
  try {
    const key = getStorageKey(dataType, useSession);
    const storage = useSession ? sessionStorage : localStorage;
    
    const storageData = {
      data,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    storage.setItem(key, JSON.stringify(storageData));
    console.log(`[TempStorage] Saved ${dataType} data`);
    return true;
  } catch (error) {
    console.error(`[TempStorage] Error saving ${dataType}:`, error);
    return false;
  }
}

/**
 * Get temporarily stored data
 * @param {string} dataType - Type of data
 * @param {boolean} useSession - Use sessionStorage instead of localStorage
 * @returns {any|null} Stored data or null
 */
function getTempData(dataType, useSession = false) {
  try {
    const key = getStorageKey(dataType, useSession);
    const storage = useSession ? sessionStorage : localStorage;
    const item = storage.getItem(key);
    
    if (!item) {
      return null;
    }
    
    const storageData = JSON.parse(item);
    console.log(`[TempStorage] Retrieved ${dataType} data`);
    return storageData.data;
  } catch (error) {
    console.error(`[TempStorage] Error retrieving ${dataType}:`, error);
    return null;
  }
}

/**
 * Remove temporarily stored data
 * @param {string} dataType - Type of data
 * @param {boolean} useSession - Use sessionStorage instead of localStorage
 */
function removeTempData(dataType, useSession = false) {
  try {
    const key = getStorageKey(dataType, useSession);
    const storage = useSession ? sessionStorage : localStorage;
    storage.removeItem(key);
    console.log(`[TempStorage] Removed ${dataType} data`);
    return true;
  } catch (error) {
    console.error(`[TempStorage] Error removing ${dataType}:`, error);
    return false;
  }
}

/**
 * Clear all temporary data for current guest
 */
function clearAllTempData() {
  try {
    const guestId = getGuestId();
    const storage = localStorage;
    
    // Remove all keys with our prefix for this guest
    const keysToRemove = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && (key.startsWith(STORAGE_PREFIX) || key.startsWith(SESSION_PREFIX))) {
        if (key.includes(guestId)) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => storage.removeItem(key));
    
    // Also remove guest ID
    localStorage.removeItem(`${STORAGE_PREFIX}guest_id`);
    
    console.log(`[TempStorage] Cleared all temp data for ${guestId}`);
    return true;
  } catch (error) {
    console.error('[TempStorage] Error clearing all data:', error);
    return false;
  }
}

/**
 * Get all temporary data for migration
 * @returns {Object} Object with all data types and their values
 */
function getAllTempData() {
  try {
    const allData = {};
    const guestId = getGuestId();
    
    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX) && key.includes(guestId)) {
        const dataType = key.replace(`${STORAGE_PREFIX}`, '').replace(`_${guestId}`, '');
        const item = localStorage.getItem(key);
        if (item) {
          const storageData = JSON.parse(item);
          allData[dataType] = storageData.data;
        }
      }
    }
    
    // Check sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(SESSION_PREFIX) && key.includes(guestId)) {
        const dataType = key.replace(`${SESSION_PREFIX}`, '').replace(`_${guestId}`, '');
        const item = sessionStorage.getItem(key);
        if (item) {
          const storageData = JSON.parse(item);
          allData[`session_${dataType}`] = storageData.data;
        }
      }
    }
    
    console.log(`[TempStorage] Retrieved all data for migration`);
    return allData;
  } catch (error) {
    console.error('[TempStorage] Error getting all data:', error);
    return {};
  }
}

/**
 * Check if there is any temporary data
 * @returns {boolean}
 */
function hasTempData() {
  try {
    const guestId = getGuestId();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX) && key.includes(guestId)) {
        return true;
      }
    }
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(SESSION_PREFIX) && key.includes(guestId)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('[TempStorage] Error checking for data:', error);
    return false;
  }
}

/**
 * Get storage statistics
 * @returns {Object} Stats about stored data
 */
function getStorageStats() {
  try {
    const guestId = getGuestId();
    const stats = {
      localStorage: { count: 0, size: 0 },
      sessionStorage: { count: 0, size: 0 },
      totalSize: 0
    };
    
    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX) && key.includes(guestId)) {
        const item = localStorage.getItem(key);
        if (item) {
          stats.localStorage.count++;
          stats.localStorage.size += item.length;
        }
      }
    }
    
    // Check sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(SESSION_PREFIX) && key.includes(guestId)) {
        const item = sessionStorage.getItem(key);
        if (item) {
          stats.sessionStorage.count++;
          stats.sessionStorage.size += item.length;
        }
      }
    }
    
    stats.totalSize = stats.localStorage.size + stats.sessionStorage.size;
    stats.guestId = guestId;
    
    return stats;
  } catch (error) {
    console.error('[TempStorage] Error getting stats:', error);
    return null;
  }
}

// Export API
export const tempStorage = {
  save: saveTempData,
  get: getTempData,
  remove: removeTempData,
  clearAll: clearAllTempData,
  getAll: getAllTempData,
  hasData: hasTempData,
  getStats: getStorageStats,
  getGuestId,
  DATA_TYPES,
};

export default tempStorage;
