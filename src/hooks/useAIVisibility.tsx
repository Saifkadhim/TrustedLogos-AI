import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AIVisibilityContextType {
  isAIVisible: boolean;
  toggleAIVisibility: () => void;
  setAIVisibility: (visible: boolean) => void;
}

const AIVisibilityContext = createContext<AIVisibilityContextType | undefined>(undefined);

interface AIVisibilityProviderProps {
  children: ReactNode;
}

export const AIVisibilityProvider: React.FC<AIVisibilityProviderProps> = ({ children }) => {
  // Default to hidden (false) so you can work on it privately
  const [isAIVisible, setIsAIVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('ai-tools-visible');
    return saved ? JSON.parse(saved) : false;
  });

  // Persist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-tools-visible', JSON.stringify(isAIVisible));
  }, [isAIVisible]);

  const toggleAIVisibility = () => {
    setIsAIVisible(prev => !prev);
  };

  const setAIVisibility = (visible: boolean) => {
    setIsAIVisible(visible);
  };

  return (
    <AIVisibilityContext.Provider value={{
      isAIVisible,
      toggleAIVisibility,
      setAIVisibility
    }}>
      {children}
    </AIVisibilityContext.Provider>
  );
};

export const useAIVisibility = (): AIVisibilityContextType => {
  const context = useContext(AIVisibilityContext);
  if (context === undefined) {
    throw new Error('useAIVisibility must be used within an AIVisibilityProvider');
  }
  return context;
};