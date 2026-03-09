import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AppVersion = 'v1' | 'v2';

interface VersionContextType {
  version: AppVersion;
  setVersion: (version: AppVersion) => void;
  toggleVersion: () => void;
  isV2: boolean;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersion must be used within VersionProvider');
  }
  return context;
};

interface VersionProviderProps {
  children: ReactNode;
  defaultVersion?: AppVersion;
}

export const VersionProvider: React.FC<VersionProviderProps> = ({ 
  children, 
  defaultVersion = 'v2' 
}) => {
  const [version, setVersionState] = useState<AppVersion>(() => {
    const saved = localStorage.getItem('appVersion');
    return (saved as AppVersion) || defaultVersion;
  });

  useEffect(() => {
    localStorage.setItem('appVersion', version);
  }, [version]);

  const setVersion = (newVersion: AppVersion) => {
    setVersionState(newVersion);
  };

  const toggleVersion = () => {
    setVersionState(prev => prev === 'v1' ? 'v2' : 'v1');
  };

  const value = {
    version,
    setVersion,
    toggleVersion,
    isV2: version === 'v2',
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};

export default VersionContext;
