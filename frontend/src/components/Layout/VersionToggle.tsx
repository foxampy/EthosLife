import React from 'react';
import { useVersion } from '../../contexts/VersionContext';
import { motion } from 'framer-motion';
import { Zap, Grid3X3 } from 'lucide-react';

export interface VersionToggleProps {
  className?: string;
}

export const VersionToggle: React.FC<VersionToggleProps> = ({ className = '' }) => {
  const { version, toggleVersion, isV2 } = useVersion();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <motion.button
        onClick={toggleVersion}
        className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all overflow-hidden ${
          isV2 
            ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white shadow-lg' 
            : 'bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)]'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-2">
          {isV2 ? <Zap size={16} /> : <Grid3X3 size={16} />}
          {isV2 ? 'V2' : 'V1'}
        </span>
        
        {/* Glow effect for V2 */}
        {isV2 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#00d9ff]/20 to-[#9d4edd]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
      
      <div className="flex items-center gap-1 text-xs text-[#5c5243]">
        <span className={isV2 ? 'opacity-50' : 'font-semibold'}>V1 Classic</span>
        <span>·</span>
        <span className={!isV2 ? 'opacity-50' : 'font-semibold'}>V2 Neo</span>
      </div>
    </div>
  );
};

export default VersionToggle;
